import prisma from "../utils/prisma.js";


async function getAllRtmQuery() {
    return await prisma.rtmMeeting.findMany({
        orderBy: {
            createdAt: 'desc'
        },
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

export {
    getAllRtmQuery,
    getRtmByIdQuery,
    createRtmMeetingQuery,
}