import { logMessage, createUnresolvedTicket } from "../model/conversation-model.js"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

export default async function awaitingFeedback(msg, conversation, text, chat) {
    const lastMessageId = conversation.last_bot_message_id
    let replyText = ""

    switch (text) {
        case "1":
            await prisma.message.update({
                where: { id: lastMessageId },
                data: { feedback: 'ONE' }
            })
            replyText = `Syukurlah kalau begitu! Terima kasih feedback-nya ya. Jangan sungkan untuk memulai percakapan lagi ya ${conversation.user.name}`
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: { step: 'menu' }
            })
            break
        case "2":
        case "3":
            const feedbackValue = text === "2" ? "TWO" : "THREE"
            await prisma.message.update({
                where: { id: lastMessageId },
                data: {
                    feedback: feedbackValue,
                    need_human: true,
                }
            })
            // await db.query("UPDATE messages SET feedback = ?, need_human = TRUE WHERE id = ?", [text, lastMessageId])
            await createUnresolvedTicket(lastMessageId)
            replyText = "Terima kasih atas masukannya. 🙏 Pesan ini sudah kami tandai untuk ditinjau oleh admin.\n\nApakah kamu ingin terhubung dengan admin sekarang? Balas *'YA'* jika perlu."
            break
        default:
            if (text.toLowerCase() === 'ya') {
                const ticketToUpdate = await prisma.unresolved.findUnique({
                    where: { messageId: lastMessageId }
                })
                if (ticketToUpdate) {
                    await prisma.unresolved.update({
                        where: { id: ticketToUpdate },
                        data: { status: 'in_progress' }
                    })
                }
                replyText = "Baik, pesanmu sudah diteruskan dan menjadi prioritas. Mohon tunggu balasan dari admin ya!"
                await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: { step: 'menu' }
                })
            } else {
                replyText = "Pilihan feedback tidak valid. Silakan balas dengan angka 1, 2, atau 3."
            }
    }

    chat.sendStateTyping()
    await new Promise((resolve) => setTimeout(resolve, 3000))
    await msg.reply(replyText)
    await logMessage(conversation.id, 'bot', replyText)
    return
}