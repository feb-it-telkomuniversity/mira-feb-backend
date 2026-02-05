import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getOrCreateConversation(phoneNumber) {
    let isNewUser = false

    let user = await prisma.users.findUnique({
        where: { phoneNumber: phoneNumber }
    })
    if (!user) {
        user = await prisma.users.create({
            data: { phoneNumber: phoneNumber }
        })
        isNewUser = true
    }

    let conversation = await prisma.conversation.findFirst({
        where: {
            userId: user.id,
            createdAt: {
                gt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    if (!conversation) {
        const initialStep = isNewUser ? 'select_role' : 'menu'
        conversation = await prisma.conversation.create({
            data: {
                userId: user.id,
                step: initialStep
            }
        })
    }

    return { ...conversation, user, isNew: isNewUser }
}

async function logMessage(conversationId, sender, text, needHuman = false, feedback = null) {
    const newMessage = await prisma.message.create({
        data: {
            conversation: {
                connect: {
                    id: conversationId
                }
            },
            sender: sender,
            message_text: text,
            need_human: needHuman,
            feedback: feedback
        }
    })
    console.log("Save message: ", newMessage)
    return newMessage.id
}

async function createUnresolvedTicket(messageId) {
    const createTicket = await prisma.unresolved.create({
        data: { messageId: messageId }
    })
    console.log("Membuat tiket: ", createTicket)
}

export {
    getOrCreateConversation,
    logMessage,
    createUnresolvedTicket
}