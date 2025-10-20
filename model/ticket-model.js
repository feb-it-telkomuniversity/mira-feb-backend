import { PrismaClient, Prisma } from "@prisma/client";

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
                orderBy: { createdAt: 'asc' },
                include: {
                    unresolved: true
                }
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

async function resolveTicketByAdminQuery(ticketId) {
    return await prisma.unresolved.update({
        where: { id: ticketId },
        data: {
            status: 'resolved'
        }
    })
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

async function getTicketCategoryStatsQuery() {
    const countCategory = await prisma.conversation.groupBy({
        by: ['category'],
        where: {
            category: {
                not: null, // Abaikan percakapan yang belum punya kategori
            }
        },
        _count: {
            category: true
        }
    })

    return countCategory.map((item) => ({
        name: item.category,
        total: item._count.category
    }))
}

async function getTicketTrendsQuery(periodInDays = 7) {
    const query = await prisma.$queryRaw(
        Prisma.sql`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM Unresolved
            WHERE created_at >= NOW() - INTERVAL ${periodInDays} DAY
            GROUP BY DATE(created_at)
            ORDER BY date ASC;
        `
    )

    const trends = []
    const dateMap = new Map(query.map(item => [new Date(item.date).toISOString().split('T')[0], Number(item.count)]))

    for (let i = 0; i < periodInDays; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split('T')[0]
        
        trends.push({
            date: dateString,
            count: dateMap.get(dateString) || 0
        })
    }

    return trends.reverse()
}

export { 
    findTickets, 
    findConversationById, 
    assignTicketToAdminQuery, 
    resolveTicketByAdminQuery, 
    countDasboardStatsQuery,
    getTicketCategoryStatsQuery,
    getTicketTrendsQuery
}