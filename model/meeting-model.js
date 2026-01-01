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

async function deleteMeetingQueryById(meetingId) {
    return await prisma.meeting.delete({
        where: { id: parseInt(meetingId) },
    })
}

export { createMeetingQuery, getMeetingListQuery, getMeetingListQueryById, deleteMeetingQueryById }