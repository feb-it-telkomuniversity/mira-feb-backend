import { PrismaClient } from "../generated/prisma";
import { client as whatsAppClient } from '../services/whatsapp-client'
const prisma = new PrismaClient()

async function createScheduleQuery(scheduleData) {
    const { recipients, ...mainScheduleData } = scheduleData
    
    return await prisma.$transaction(async (trans) => {
        const newSchedule = await trans.schedule.create({
            data: {
                eventTitle: mainScheduleData.eventTitle,
                eventDescription: mainScheduleData.eventDescription,
                eventTime: new Date(mainScheduleData.eventTime),
                reminderTime: new Date(mainScheduleData.reminderTime),
                status: 'pending',
                createdBy: mainScheduleData.createdBy
            }
        })
        // Siapkan data penerima dengan ID jadwal yang baru dibuat
        const recipientData = recipients.map((recipient) => ({
            scheduleId: newSchedule.id,
            name: recipient.name,
            phoneNumber: recipient.phoneNumber
        }))
        await trans.scheduleRecipient.createMany({ // Simpan semua penerima sekaligus
            data: recipientData
        })
        
        // Kembalikan jadwal yang baru dibuat beserta penerimanya
        return trans.schedule.findUnique({
            where: { id: newSchedule.id },
            include: { recipients: true }
        }) 
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
        },
        include: {
            recipients: true
        }
    })
    
    if (reminderToSend.length === 0) {
        console.log('Tidak ada jadwal reminder yang perlu dikirim saat ini')
        return
    }
    console.log(`Ditemukan ${reminderToSend.length} reminder untuk dikirim`)

    for (const schedule of reminderToSend) {
        for (const recipient of schedule.recipients) {          
            try {
                const eventDate = new Date(schedule.eventTime);
                const formattedTime = eventDate.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                const formattedDate = eventDate.toLocaleDateString('id-ID', {
                    weekday: 'long', // Hari
                    day: 'numeric',  // tanggal
                    month: 'long',   // bulan
                });
                const message = `🔔 *PENGINGAT JADWAL* 🔔\n\nAssalamualaikum, ${recipient.name}.\n\nIzin mengingatkan, Anda memiliki jadwal:\n\n*Kegiatan:* ${schedule.eventTitle}\n*Detail:* ${schedule.eventDescription}\n*Waktu:* ${formattedDate}\n*Pukul:* ${formattedTime}\n\nPesan ini tidak untuk dibalas, hanya sebagai *PENGINGAT*\n\nTerima kasih.`;

                await whatsAppClient.sendMessage(recipient.phoneNumber, message);
                console.log(`✅ Reminder untuk "${schedule.eventTitle}" berhasil dikirim ke ${recipient.name}.`)

                await prisma.schedule.update({
                    where: { id: schedule.id },
                    data: { status: "sent" }
                })
            } catch (error) {
                console.error(`❌ Gagal mengirim reminder untuk jadwal ID ${schedule.id}:`, error)
            }
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
    return await prisma.schedule.delete({
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