import { PrismaClient } from "@prisma/client";
import { client as whatsAppClient } from '../services/whatsapp-client.js'
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

        for (const recipient of recipients) {
            // Cari atau Buat Kontak (Upsert)
            const contact = await trans.contacts.findUnique({
                where: { id: recipient.id }
            })          
            if (!contact) {
                throw new Error(`Kontak dengan ID ${recipient.id} tidak ditemukan`);
            }

            // 3. Hubungkan Jadwal dengan Kontak
            //    di tabel ScheduleRecipient
            await trans.scheduleRecipient.create({
                data: {
                    scheduleId: newSchedule.id,
                    contactId: contact.id
                }
            });
        }
        
        return trans.schedule.findUnique({
            where: { id: newSchedule.id },
            include: { 
                recipients: {
                    include: {
                        contact: true // Kirim juga data kontaknya
                    }
                } 
            }
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
            recipients: {
                include: {
                    contact: true
                }
            }
        }
    })
    
    if (reminderToSend.length === 0) {
        console.log('Tidak ada jadwal reminder yang perlu dikirim saat ini')
        return
    }
    console.log(`Ditemukan ${reminderToSend.length} reminder untuk dikirim`)

    for (const schedule of reminderToSend) {
        for (const recipient of schedule.recipients) {
            const contact = recipient.contact
            if (!contact) {
                console.error(`Kontak tidak ditemukan untuk recipient ID ${recipient.id} di jadwal ID ${schedule.id}`)
                continue
            }
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
                })
                const message = `*Pengingat Jadwal*\n\nYth. Bpk/Ibu ${contact.name}\nIzin mengingatkan Anda memiliki jadwal:\n\n*Kegiatan*: ${schedule.eventTitle}\n*Detail*: ${schedule.eventDescription}\n*Waktu*: ${formattedDate}\n*Pukul*: ${formattedTime}\n\nTerima kasih\n\nCatatan: Pesan ini tidak untuk dibalas, hanya sebagai *PENGINGAT*`

                await whatsAppClient.sendMessage(contact.phoneNumber, message);
                console.log(`✅ Reminder untuk "${schedule.eventTitle}" berhasil dikirim ke ${contact.name}.`)

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
    // Tidak ada filter berdasarkan bulan/tahun, ambil semua jadwal dan urutkan berdasarkan eventTime ascending
    return await prisma.schedule.findMany({
        orderBy: {
            eventTime: 'asc'
        }
    });
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