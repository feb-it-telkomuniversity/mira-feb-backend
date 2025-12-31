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

export { createMeetingQuery }