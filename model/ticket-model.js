import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

async function findTickets(status) {
    const whereClause = {}
    if (status) whereClause.status = status
    return await prisma.unresolved.findMany({
        where: whereClause,
        orderBy: { createdAt: 'asc' },
        include: {
            message: {
                select: {
                    message_text: true,
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

async function assignTicketToAdminQuery(ticketId, adminName) {
    return await prisma.unresolved.update({
        where: { id: parseInt(ticketId) },
        data: {
            status: 'in_progress',
            assignedTo: adminName
        }
    })
}

async function resolveTicketByAdminQuery() {

}

async function countDasboardStatsQuery() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [ openTickets, inProgressTickets, totalUsers, resolvedToday  ] = await Promise.all([
        prisma.unresolved.count({
            where: { status: 'open' }
        }),
        prisma.unresolved.count({
            where: { status: 'in_progress' }
        }),
        prisma.users.count(),
        prisma.unresolved.count({
            where: {
                status: 'resolved',
                updatedAt: {
                    gte: today,
                }
            }
        })
    ])

    return { openTickets, inProgressTickets, resolvedToday, totalUsers }
}

export { 
    findTickets, 
    findConversationById, 
    assignTicketToAdminQuery, 
    resolveTicketByAdminQuery, 
    countDasboardStatsQuery 
}