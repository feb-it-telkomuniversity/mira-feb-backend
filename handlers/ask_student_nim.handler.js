import { getOrCreateConversation, logMessage, createUnresolvedTicket } from "../model/conversation-model"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

export default async function askStudentNim(msg, conversation, text, chat) {
    let nimMatch = text.match(/\d+/g)
    let nim = nimMatch ? nimMatch.find((num) => num.length >= 8) : null

    if (!nim) {
        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await msg.reply("⚠️ Format NIM sepertinya kurang tepat. Mohon masukkan NIM dengan benar ya, contoh: 10123008");
        return
    }

    await prisma.users.update({
        where: { id: conversation.user.id },
        data: { identifier: nim }
    })
    await prisma.conversation.update({
        where: { id: conversation.id },
        data: { step: 'ask_student_name' }
    })

    chat.sendStateTyping()
    await new Promise((resolve) => setTimeout(resolve, 4000))
    const reply = `Oke, NIM kamu ${nim} sudah tercatat. 👍\n\nSelanjutnya, boleh info nama lengkapmu?`
    await msg.reply(reply)
    await logMessage(conversation.id, 'bot', reply)
    // return
}