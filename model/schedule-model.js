import { PrismaClient } from "../generated/prisma";
import { client as whatsAppClient } from "../services/whatsapp-service";
const prisma = new PrismaClient()

async function createScheduleQuery(scheduleData) {
    return await prisma.schedule.create({
        data: {
            targetPerson: scheduleData.targetPerson,
            targetPhoneNumber: scheduleData.targetPhoneNumber,
            eventTitle: scheduleData.eventTitle,
            eventDescription: scheduleData.eventDescription,
            eventTime: new Date(scheduleData.eventTime),
            reminderTime: new Date(scheduleData.reminderTime),
            status: 'pending',
            createdBy: scheduleData.createdBy
        }
    })
}

async function sendScheduleReminders() {
    console.log('⏰ Menjalankan pengecekan jadwal reminder...')
    
    const now = new Date()
    const reminderToSend = await prisma.schedule.findMany({
        where: {
            reminderTime: {
                lte: now,
            },
            status: 'pending'
        }
    })
    
    if (reminderToSend.length === 0) {
        console.log('Tidak ada jadwal reminder yang perlu dikirim saat ini')
        return
    }
    console.log(`Ditemukan ${reminderToSend.length} reminder untuk dikirim`)

    for (const schedule of reminderToSend) {
        try {
            const eventTimeFormatted = new Date(schedule.eventTime).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            })
            const message = `🔔 *PENGINGAT JADWAL* 🔔\n\nAssalamualaikum, ${schedule.targetPerson}.\n\nSekadar pengingat, Anda memiliki jadwal:\n\n*Kegiatan:* ${schedule.eventTitle}\n*Waktu:* Pukul ${eventTimeFormatted} hari ini.\n\nTerima kasih.`

            await whatsAppClient.sendMessage(schedule.targetPhoneNumber, message);
            console.log(`✅ Reminder untuk "${schedule.eventDescription}" berhasil dikirim ke ${schedule.targetPerson}.`)

            await prisma.schedule.update({
                where: { id: schedule.id },
                data: { status: "sent" }
            })
        } catch (error) {
            console.error(`❌ Gagal mengirim reminder untuk jadwal ID ${schedule.id}:`, error)
        }
    }
}

async function getSchedulesByMonthQuery(year, month) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 1)

    return await prisma.schedule.findMany({
        where: {
            eventTime: {
                gte: startDate,
                lt: endDate
            }
        },
        orderBy: {
            eventTime: 'asc'
        }
    })
}

async function cancelScheduleQuery(scheduleId) {
    const cancelSchedule = await prisma.schedule.updateMany({
        where: { 
            id: scheduleId,
            status: {
                not: 'sent'
            }
         },
        data: { status: 'cancelled' }
    })
    return cancelSchedule.count
}

async function deleteScheduleQuery(scheduleId) {
    return await prisma.schedule.update({
        where: { id: scheduleId } 
    })
}

export { 
    createScheduleQuery, 
    sendScheduleReminders, 
    getSchedulesByMonthQuery, 
    cancelScheduleQuery, 
    deleteScheduleQuery
}