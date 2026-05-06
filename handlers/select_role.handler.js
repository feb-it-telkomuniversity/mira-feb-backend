import { getOrCreateConversation, logMessage, createUnresolvedTicket } from "../model/conversation-model.js"
import prisma from "../utils/prisma.js";

export default async function selectRole(msg, conversation, text) {
    let nextStep = ''
    let userRole = ''
    let replyText = ''

    switch (text) {
        case '1':
            userRole = 'mahasiswa'
            nextStep = 'ask_student_nim'
            replyText = "Terima kasih, Anda telah memilih opsi Mahasiswa. Mohon untuk memasukkan NIM Anda agar kami dapat melakukan verifikasi"
            break
        case '2':
            userRole = 'dosen'
            nextStep = 'ask_lecturer_name'
            replyText = "Terima kasih, Anda telah memilih opsi Dosen. Mohon untuk memasukkan nama lengkap Anda"
            break
        default:
            replyText = "Pilihan tidak valid. Silakan balas dengan angka 1 (Mahasiswa) atau 2 (Dosen)."
            await msg.reply(replyText)
            await logMessage(conversation.id, 'bot', replyText)
            return
    }

    await prisma.users.update({
        where: { id: conversation.user.id },
        data: { role: userRole }
    })
    await prisma.conversation.update({
        where: { id: conversation.id },
        data: { step: nextStep }
    })

    await msg.reply(replyText)
    await logMessage(conversation.id, 'bot', replyText)
    // return
}