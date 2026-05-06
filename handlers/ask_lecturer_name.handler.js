import { logMessage } from "../model/conversation-model.js"
import { generateResponse } from "../services/gemini-service.js"
import prisma from "../utils/prisma.js";

export default async function askLecturerName(msg, conversation, text, chat) {
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
        console.error("Error saat ekstraksi nama dosen: ", error)
        name = text
    }

    await prisma.users.update({
        where: { id: conversation.user.id },
        data: { name: name }
    })
    await prisma.conversation.update({
        where: { id: conversation.id },
        data: { step: 'lecturer_select_unit' }
    })

    const reply = `Terima kasih, Bapak/Ibu ${name}. Data sudah tersimpan. Selanjutnya, silakan pilih unit yang ingin Anda hubungi dengan membalas hanya angkanya saja ya🫡:\n\n1️⃣ Sekretariat\n2️⃣ SDM\n3️⃣ Wakil Dekan 1 (Akademik)\n4️⃣ Wakil Dekan 2 (Sumber Daya).`
    chat.sendStateTyping()
    await new Promise((resolve) => setTimeout(resolve, 4000))
    msg.reply(reply)
    await logMessage(conversation.id, 'bot', reply)
    // return
}