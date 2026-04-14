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

async function findRelevantConversationSegment(conversationId) {
    const activeTicket = await prisma.unresolved.findFirst({
        where: {
            message: { conversationId: parseInt(conversationId) },
            status: {
                in: ['open', 'in_progress']
            }
        },
        orderBy: { createdAt: 'desc' },
        include: { message: true }
    })

    if (!activeTicket) {
        const conversationInfo = await prisma.conversation.findUnique({
            where: { id: parseInt(conversationId) },
            include: { user: { select: { name: true, identifier: true } } }
        })
        return {
            conversation: conversationInfo,
            messages: [],
            activeTicket: null
        }
    }

    const relevantMessages = await prisma.message.findMany({
        where: {
            conversationId: parseInt(conversationId),
            // Ambil pesan dari sebelum tiket dibuat sampai pesan tiket itu sendiri
            id: { lte: activeTicket.messageId },
        },
        orderBy: { createdAt: 'asc' },
        include: { unresolved: true } // Tetap sertakan data tiket
    })

    const conversationInfo = await prisma.conversation.findUnique({
        where: { id: parseInt(conversationId) },
        include: { user: { select: { name: true, identifier: true } } }
    })

    return {
        conversation: conversationInfo, // Info dasar percakapan & user
        messages: relevantMessages,    // Hanya potongan pesan relevan
        activeTicket: activeTicket     // Detail tiket aktif
    }
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
    const ticket = await prisma.unresolved.findUnique({
        where: { id: parseInt(ticketId) },
        include: {
            message: {
                select: { conversationId: true }
            }
        },
    })

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    const conversationId = ticket.message.conversationId

    return await prisma.$transaction([
        prisma.unresolved.update({
            where: { id: parseInt(ticketId) },
            data: { status: 'resolved' },
        }),
        prisma.conversation.update({
            where: { id: conversationId },
            data: { step: 'menu', last_bot_message_id: null },
        }),
    ])
}

async function countDasboardStatsQuery() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [openTickets, inProgressTickets, totalUsers, resolvedToday] = await Promise.all([
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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodInDays + 1)
    startDate.setHours(0, 0, 0, 0)

    const query = await prisma.$queryRaw(
        Prisma.sql`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM "unresolved"
            WHERE created_at >= ${startDate} 
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

// ==== HaloDekan Pengaduan ====
async function createComplaintTicketQuery(userId, data) {
    const { category, description, attachmentUrl } = data;

    // AUTO-GENERATE TICKET CODE (Format: HD-TAHUN-000X)
    const ticketCount = await prisma.complainmentTicket.count();
    const currentYear = new Date().getFullYear();
    const ticketCode = `HD-${currentYear}-${(ticketCount + 1).toString().padStart(4, '0')}`;

    return await prisma.complainmentTicket.create({
        data: {
            ticketCode,
            userId,
            category,
            description,
            attachmentUrl,
            status: 'Submitted'
        }
    })
}

async function getMyTicketsQuery(userId) {
    return await prisma.complainmentTicket.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    })
}

async function getTicketsForAdminQuery(statusFilter) {
    const whereClause = statusFilter ? { status: statusFilter } : {}

    return await prisma.complainmentTicket.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true, role: true }
            },
            assignedTo: {
                select: { name: true }
            }
        }
    })
}

async function verifyTicketQuery(ticketId, data) {
    const { status, actionNote } = data

    return await prisma.complainmentTicket.update({
        where: { id: parseInt(ticketId) },
        data: {
            status: status,
            actionNote: actionNote
        }
    })
}

async function getTicketComplaintDetailQuery(ticketId) {
    return await prisma.complainmentTicket.findUnique({
        where: { id: parseInt(ticketId) },
        include: {
            user: {
                select: { name: true, username: true, email: true }
            },
            assignedTo: {
                select: { name: true }
            }
        }
    })
}

// 1. Query untuk Dekan menugaskan tiket ke Unit
async function assignTicketQuery(ticketId, assignedToId, actionNote) {
    return await prisma.complainmentTicket.update({
        where: { id: parseInt(ticketId) },
        data: {
            status: 'AssignedToUnit',
            assignedToId: parseInt(assignedToId),
            actionNote: actionNote
        }
    })
}

// 2. Query untuk Unit mengirimkan bukti penyelesaian
async function submitResolutionQuery(ticketId, resolutionNote, resolutionProofUrls) {
    return await prisma.complainmentTicket.update({
        where: { id: parseInt(ticketId) },
        data: {
            status: 'WaitingDeanApproval',
            resolutionNote: resolutionNote,
            resolutionProofUrls: resolutionProofUrls
        }
    })
}

// 3. Query Umum untuk ganti status (Admin tolak, Dekan ACC, dll)
async function updateTicketStatusQuery(ticketId, status, actionNote) {
    return await prisma.complainmentTicket.update({
        where: { id: parseInt(ticketId) },
        data: {
            status: status,
            actionNote: actionNote
        }
    })
}

async function getTicketsForRoleQuery() {
    // Jika statusFilter yang dikirim adalah array, gunakan operator 'in'
    // Contoh: ['EscalatedToDean', 'WaitingDeanApproval']
    // const whereClause = statusFilter
    //     ? { status: { in: Array.isArray(statusFilter) ? statusFilter : [statusFilter] } }
    //     : {};

    return await prisma.complainmentTicket.findMany({
        // where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true, role: true }
            },
            assignedTo: {
                select: { name: true }
            }
        }
    })
}

async function getTicketsForUnitQuery(user) {
    const subordinates = await prisma.users.findMany({
        where: { supervisorId: user.id },
        select: { id: true }
    })
    const targetIds = [user.id, ...subordinates.map(sub => sub.id)]

    return await prisma.complainmentTicket.findMany({
        where: {
            assignedToId: { in: targetIds },
        },
        orderBy: { updatedAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true } // Info mahasiswa pelapor
            },
            assignedTo: {
                select: { id: true, name: true, role: true }
            }
        }
    })
}

export {
    findTickets,
    findConversationById,
    assignTicketToAdminQuery,
    resolveTicketByAdminQuery,
    countDasboardStatsQuery,
    getTicketCategoryStatsQuery,
    getTicketTrendsQuery,
    findRelevantConversationSegment,

    // HaloDekan
    createComplaintTicketQuery,
    getMyTicketsQuery,
    getTicketComplaintDetailQuery,
    getTicketsForAdminQuery,
    verifyTicketQuery,
    assignTicketQuery,
    submitResolutionQuery,
    updateTicketStatusQuery,
    getTicketsForRoleQuery,
    getTicketsForUnitQuery
}