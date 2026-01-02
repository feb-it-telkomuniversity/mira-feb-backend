import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function createMeetingQuery(payload) {
    return await prisma.meeting.create({
        data: {
            title: payload.title,
            date: new Date(payload.date),
            startTime: new Date(payload.startTime),
            endTime: new Date(payload.endTime),
            location: payload.location,
            leader: payload.leader,
            notetaker: payload.notetaker,
            
            participants: payload.participants || [], 

            // 2. Data Agenda (Nested Create)
            // Prisma otomatis looping array ini dan insert ke tabel meeting_agendas
            agendas: {
                create: (payload.agendas || []).map(agenda => ({
                    title: agenda.title,
                    discussion: agenda.discussion,
                    decision: agenda.decision || null // Optional
                }))
            },

            // 3. Data Tindak Lanjut (Nested Create)
            actionItems: {
                create: (payload.actionItems || []).map(item => ({
                    task: item.task,
                    pic: item.pic,
                    deadline: new Date(item.deadline),
                    status: 'Pending'
                }))
            }
        },
        // Include biar pas response datanya lengkap sama anak-anaknya
        include: {
            agendas: true,
            actionItems: true
        }
    })
}


async function getMeetingListQuery(page = 1, limit = 10, search = "", status) {
    const skip = (page - 1) * limit;

    const whereClause = {
        OR: search ? [
            { title: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { leader: { contains: search, mode: 'insensitive' } }
        ] : undefined,

        status: status ? status : undefined 
    };

    if (!search) delete whereClause.OR
    if (!status) delete whereClause.status

    const [data, totalCount] = await prisma.$transaction([
        prisma.meeting.findMany({
            where: whereClause,
            skip: skip,
            take: limit,
            orderBy: {
                date: 'desc'
            },
            select: {
                id: true,
                title: true,
                date: true,
                startTime: true,
                endTime: true,
                location: true,
                leader: true,
                notetaker: true,
                status: true,
            }
        }),
        prisma.meeting.count({ where: whereClause })
    ])

    return {
        data,
        pagination: {
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            pageSize: limit
        }
    }
}

async function getMeetingListQueryById(id) {
    return await prisma.meeting.findUnique({
        where: { id: parseInt(id) },
        include: {
            agendas: {
                orderBy: { id: 'asc' }
            },
            actionItems: {
                orderBy: { id: 'asc' }
            }
        },
    })
}

const parseDate = (val) => {
    if (!val) return undefined; // Biarkan Prisma pakai data lama kalau undefined
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
};

async function updateMeetingQuery(id, payload) {
    const meetingId = parseInt(id)

    return await prisma.$transaction(async (tx) => {
        const allowedStatuses = ["Selesai", "Berlangsung", "Terjadwal", "Batal"]
        let status = payload.status
        if (!allowedStatuses.includes(status)) {
            status = "Terjadwal"
        }
        const updatedMeeting = await tx.meeting.update({
            where: { id: meetingId },
            data: {
                title: payload.title,
                date: parseDate(payload.date),
                startTime: parseDate(payload.startTime),
                endTime: parseDate(payload.endTime),
                location: payload.location,
                leader: payload.leader,
                notetaker: payload.notetaker,
                participants: payload.participants || [],
                status: status
            }
        })
    
        // Sync Agendas
        if (payload.agendas) {
            const keptAgendaIds = payload.agendas
                .filter(a => a.id)
                .map(a => parseInt(a.id));
    
            // Hapus agenda di DB yang ID-nya TIDAK ADA di list FE
            await tx.meetingAgenda.deleteMany({
                where: {
                    meetingId: meetingId,
                    id: { notIn: keptAgendaIds }
                }
            });
    
            // B. Upsert (Update Existing / Create New)
            for (const agenda of payload.agendas) {
                if (agenda.id) {
                    await tx.meetingAgenda.update({
                        where: { id: parseInt(agenda.id) },
                        data: {
                            title: agenda.title,
                            discussion: agenda.discussion,
                            decision: agenda.decision
                        }
                    })
                } else {
                    await tx.meetingAgenda.create({
                        data: {
                            meetingId: meetingId,
                            title: agenda.title,
                            discussion: agenda.discussion,
                            decision: agenda.decision
                        }
                    })
                }
            }    
        }
        // Sync Action Items
        if (payload.actionItems) {
            // A. Delete Missing
            const keptActionIds = payload.actionItems
                .filter(a => a.id)
                .map(a => parseInt(a.id));

            await tx.meetingActionItem.deleteMany({
                where: {
                    meetingId: meetingId,
                    id: { notIn: keptActionIds }
                }
            });

            // B. Upsert Loop
            for (const item of payload.actionItems) {
                if (item.id) {
                    await tx.meetingActionItem.update({
                        where: { id: parseInt(item.id) },
                        data: {
                            task: item.task,
                            pic: item.pic,
                            deadline: new Date(item.deadline),
                            status: item.status
                        }
                    });
                } else {
                    await tx.meetingActionItem.create({
                        data: {
                            meetingId: meetingId,
                            task: item.task,
                            pic: item.pic,
                            deadline: new Date(item.deadline),
                            status: 'Pending'
                        }
                    });
                }
            }
        }
    
        return await tx.meeting.findUnique({
            where: { id: meetingId },
            include: { agendas: true, actionItems: true }
        })
    })
}

async function deleteMeetingQueryById(meetingId) {
    return await prisma.meeting.delete({
        where: { id: parseInt(meetingId) },
    })
}

export { createMeetingQuery, getMeetingListQuery, getMeetingListQueryById, deleteMeetingQueryById, updateMeetingQuery }