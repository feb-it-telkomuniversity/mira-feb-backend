import { getOrCreateConversation, logMessage, createUnresolvedTicket } from "../model/conversation-model.js"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function handleNewUser(msg, conversation) {
    const chat = await msg.getChat()
    const currentHour = new Date().getHours();
    let greeting
    if (currentHour >= 8 && currentHour < 11) {
        greeting = "pagi"
    } else if (currentHour >= 11 && currentHour < 15) {
        greeting = "siang"
    } else if (currentHour >= 15 && currentHour < 19) {
        greeting = "sore"
    }

    chat.sendStateTyping()
    await new Promise((resolve) => setTimeout(resolve, 3000))
    await msg.reply(`Halo 👋, selamat ${greeting} dan selamat datang di layanan akademik Fakultas Ekonomi dan Bisnis Telkom University.`)
    await msg.reply("Sebelum melanjutkan dan untuk personalisasi layanan, silakan pilih peran Anda 🫡:\n\n1️⃣ Mahasiswa\n2️⃣ Dosen")

    await prisma.conversation.update({
        where: { id: conversation.id },
        data: { step: 'select_role' }
    })
}

async function handleMessage(msg) {
    if (msg.fromMe || msg.type !== "chat" || !msg.body) return
    
    const userId = msg.from;
    const text = msg.body.trim()
    const chat = await msg.getChat()

    const conversation = await getOrCreateConversation(userId)

    const activeTickets = await prisma.unresolved.findFirst({
        where: {
            message: {
                conversationId: conversation.id
            },
            status: {
                in: ['open', 'in_progress']
            }
        }
    })
    if (activeTickets) {
        const reply = `Halo! Sepertinya admin kami sedang menangani permintaanmu sebelumnya.  
        \nMohon ditunggu balasan dari mereka ya sebelum memulai pertanyaan baru, agar tidak terjadi tumpang tindih informasi. 
        \nTerima kasih! 🙏`
        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 3000))
        msg.reply(reply)
        return
    }

    await logMessage(conversation.id, 'user', text)

    if (conversation.isNew) {
        return await handleNewUser(msg, conversation)
    }

    try {
        const handlerModule = await import(`../handlers/${conversation.step}.handler.js`)
        await handlerModule.default(msg, conversation, text, chat)
    } catch (error) {
        if (error.code === "MODULE NOT FOUND") {
            console.error(`Handler untuk step "${conversation.step}" tidak ditemukan.`)
            await msg.reply("Maaf, saya sedikit kebingungan. Mari kita kembali ke menu utama.")
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: { step: 'menu' }
            })
        } else {
            throw error
        }
    }
}

export { handleMessage }