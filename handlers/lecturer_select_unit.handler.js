import { logMessage } from "../model/conversation-model"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

export default async function lecturerSelectUnit(msg, conversation, text, chat) {
    let unitCategory
    switch (text) {
        case '1': unitCategory = 'Sekretariat'; break
        case '2': unitCategory = 'Wadek1'; break
        case '3': unitCategory = 'Wadek2'; break
        case '4': unitCategory = 'Prodi S1'; break
        case '5': unitCategory = 'Prodi S2'; break
        default:
            await msg.reply("Pilihan tidak valid. Silakan pilih unit dengan membalas angka yang sesuai.")
            return
    }

    await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
            step: 'chat',
            category: unitCategory
        }
    })

    const reply = `Baik, Anda terhubung dengan unit *${unitCategory}*. Silakan sampaikan pertanyaan atau kendala Anda.`
    chat.sendStateTyping()
    await new Promise((resolve) => setTimeout(resolve, 4000))
    msg.reply(reply)
    await logMessage(conversation.id, 'bot', reply)
    // return
}