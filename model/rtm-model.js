import prisma from "../utils/prisma.js";


async function getAllRtmQuery(filters = {}) {
    const where = {}

    if (filters.search) {
        where.OR = [
            // Pencarian di level Induk (Nama Rapat)
            {
                name: {
                    contains: filters.search,
                    mode: 'insensitive'
                }
            },
            // Pencarian "Deep Dive" ke level Anak (Tabel Pembahasan)
            {
                discussions: {
                    some: { // 'some' artinya: "minimal ada 1 baris yang cocok"
                        OR: [
                            { topic: { contains: filters.search, mode: 'insensitive' } },
                            { problem: { contains: filters.search, mode: 'insensitive' } },
                            { actionPlan: { contains: filters.search, mode: 'insensitive' } },
                            { outcome: { contains: filters.search, mode: 'insensitive' } },
                            { pic: { contains: filters.search, mode: 'insensitive' } },
                            { target: { contains: filters.search, mode: 'insensitive' } },
                            { status: { contains: filters.search, mode: 'insensitive' } }
                        ]
                    }
                }
            }
        ];
    }

    if (filters.startDate || filters.endDate) {
        where.meetingDate = {}

        if (filters.startDate) {
            where.meetingDate.gte = new Date(filters.startDate)
        }
        if (filters.endDate) {
            where.meetingDate.lte = new Date(filters.endDate)
        }
    }

    if (filters.material) {
        where.materials = {
            has: filters.material
        }
    }

    if (filters.status) {
        where.discussions = {
            some: {
                status: { contains: filters.status, mode: 'insensitive' }
            }
        }
    }
    return await prisma.rtmMeeting.findMany({
        where: where,
        orderBy: {
            meetingDate: 'desc'
        }
    })
}

async function getRtmByIdQuery(id) {
    return await prisma.rtmMeeting.findUnique({
        where: { id: parseInt(id) },
        include: {
            discussions: true
        }
    });
}

async function createRtmMeetingQuery(payload) {
    return await prisma.rtmMeeting.create({
        data: payload,
        include: {
            discussions: true,
        }
    })
}

async function updateRtmQuery(id, payload) {
    const { discussions, ...meetingData } = payload
    return await prisma.rtmMeeting.update({
        where: { id: parseInt(id) },
        data: {
            ...meetingData,
            discussions: discussions ? {
                deleteMany: {},
                create: discussions
            } : undefined
        },
        include: {
            discussions: true
        }
    })
}

async function deleteRtmQuery(id) {
    return await prisma.rtmMeeting.delete({
        where: { id: parseInt(id) }
    });
}

export {
    getAllRtmQuery,
    getRtmByIdQuery,
    createRtmMeetingQuery,
    updateRtmQuery,
    deleteRtmQuery
}