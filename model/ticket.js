import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

async function findTicketsByStatus(status = 'open') {
    return await prisma.unresolved.findMany({
        where: { status: status },
        orderBy: { createdAt: 'asc' },
        include: {
            message: {
                select: {
                    messageText: true,
                    conversation: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true,
                                    identifier: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })
}

async function findConversationById(conversationId) {
    return await prisma.conversation.findUnique({
        where: { id: parseInt(conversationId) },
        include: {
            user: {
                select: { name: true, identifier: true }
            },
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });
}

export { findTicketsByStatus, findConversationById }