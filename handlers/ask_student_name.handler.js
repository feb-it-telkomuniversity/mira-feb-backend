import { getOrCreateConversation, logMessage, createUnresolvedTicket } from "../model/conversation-model"
import { PrismaClient } from "../generated/prisma"
import { generateResponse } from "../services/gemini-service"

const prisma = new PrismaClient()

export default async function askStudentName(msg, conversation, text, chat) {
    let name
    try {
        const extractionPrompt = `
        Dari kalimat berikut, ekstrak HANYA nama lengkap orangnya. 
        Jangan sertakan kata lain seperti "nama saya adalah", sapaan, atau penjelasan apapun.
        Jika tidak ada nama yang bisa ditemukan, balas HANYA dengan kata "TIDAK_DITEMUKAN".

        Kalimat: "${text}"
        `
        const extractedName = await generateResponse(extractionPrompt)

        if (extractedName.toUpperCase() === "TIDAK_DITEMUKAN" || extractedName.length < 3) {
            const reply = "Maaf, sepertinya saya tidak bisa mengenali nama dari kalimatmu. Bisa tolong ketik nama lengkapmu saja? 😊"
            msg.reply(reply)
            return
        }

        name = extractedName

    } catch (error) {
        console.error("Error saat ekstraksi nama:", error);
        nama = text;
    }

    await prisma.users.update({
        where: { id: conversation.user.id },
        data: { name: name }
    })
    await prisma.conversation.update({
        where: { id: conversation.id },
        data: { step: 'menu' }
    })

    chat.sendStateTyping()
    await new Promise((resolve) => setTimeout(resolve, 4000))
    const reply = `Halo ${name}, datamu sudah tersimpan ✅\n\nSilakan pilih kategori bantuan di bawah ini:\n1️⃣ Sidang\n2️⃣ Keuangan\n3️⃣ Wisuda`
    msg.reply(reply)
    await logMessage(conversation.id, 'bot', reply) 
    // return
}