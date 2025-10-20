import { logMessage } from "../model/conversation-model.js"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

export default async function menu(msg, conversation, text, chat) {
    let category
    let skipWelcome = false

    switch (text) {
        case "1":
            category = "Sidang"
            skipWelcome = true
            break
            case "2":
            category = "Keuangan"
            skipWelcome = true
            break;
            case "3":
            category = "Wisuda";
            skipWelcome = true
            break;
        default:
            const welcomeBackText = `Halo lagi, ${conversation.user.name}! Saya admin akademik Fakultas Ekonomi dan Bisnis Telkom University. Senang bisa bantu kamu lagi. 😊`
            const menuText = `Silakan pilih salah satu kategori di bawah ini dengan membalas angkanya ya:\n\n1️⃣ Sidang\n2️⃣ Keuangan\n3️⃣ Wisuda`
            chat.sendStateTyping()
            await new Promise((resolve) => setTimeout(resolve, 3000))
            await msg.reply(welcomeBackText)
            await logMessage(conversation.id, 'bot', welcomeBackText)
            chat.sendStateTyping()
            await new Promise((resolve) => setTimeout(resolve, 3000))
            await msg.reply(menuText)
            await logMessage(conversation.id, 'bot', menuText)
            return
    }

    if (skipWelcome) {
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                step: 'chat',
                category: category
            }
        })
        const reply = `✅ Kamu memilih kategori *${category}*. Silakan tanyakan apa yang ingin kamu ketahui.`

        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 3000))
        await msg.reply(reply);
        await logMessage(conversation.id, 'bot', reply)
    }
    // return
}