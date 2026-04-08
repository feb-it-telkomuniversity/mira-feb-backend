
import { findConversationById, findTickets, assignTicketToAdminQuery, countDasboardStatsQuery, getTicketCategoryStatsQuery, getTicketTrendsQuery, resolveTicketByAdminQuery, findRelevantConversationSegment, createComplaintTicketQuery, getMyTicketsQuery, getTicketsForAdminQuery, verifyTicketQuery, getTicketComplaintDetailQuery } from "../model/ticket-model.js"

async function getTickets(req, res) {
    try {
        const { status } = req.query
        const tickets = await findTickets(status)
        res.json(tickets)
    } catch (error) {
        res.status(500).json({ message: "Error fetching open tickets", error: error.message })
    }
}

async function getConversationDetails(req, res) {
    try {
        const { id } = req.params
        const conversation = await findConversationById(id)
        if (!conversation) {
            return res.json(404).json({ message: "Conversation not found" })
        }
        let activeTicket = null
        for (const msg of conversation.messages) {
            if (msg.unresolved && Array.isArray(msg.unresolved) && msg.unresolved.length > 0) {
                const ticket = msg.unresolved[0]
                if (ticket.status === 'open' || ticket.status === 'in_progress') {
                    activeTicket = ticket;
                    break
                }
            }
        }
        res.json({ ...conversation, activeTicket })
    } catch (error) {
        res.status(500).json({ message: "Error fetching Conversation details", error: error.message })
    }
}

async function getConversationRelevantDetails(req, res) {
    try {
        const { id } = req.params
        const conversationSegment = await findRelevantConversationSegment(id)
        if (!conversationSegment || !conversationSegment.conversation) {
            return res.status(404).json({ message: "Conversation not found or no active ticket" })
        }
        res.json({ conversationSegment })
    } catch (error) {
        res.status(500).json({ message: "Error fetching relevant conversation segment", error: error.message })
    }
}

async function assignTicketToAdmin(req, res) {
    try {
        const { id } = req.params
        const { adminName } = req.body
        if (!adminName) {
            return res.status(400).json({ message: "adminName is required" })
        }
        const updatedTicket = await assignTicketToAdminQuery(id, adminName)
        res.json(updatedTicket)
    } catch (error) {
        res.status(500).json({ message: "Error assigning ticket", error: error.message })
        console.log("error: ", error.message);
    }
}

async function resolveTicketByAdmin(req, res) {
    try {
        const { id } = req.params
        const resolveTicket = await resolveTicketByAdminQuery(id)
        res.json(resolveTicket)
    } catch (error) {
        res.status(500).json({ message: "Error when resolving ticket", error: error.message })
        console.log("error: ", error.message);
    }
}

async function countDasboardStats(req, res) {
    try {
        const stats = await countDasboardStatsQuery()
        res.json(stats)
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message })
    }
}

async function getTicketCategoryStats(req, res) {
    try {
        const stats = await getTicketCategoryStatsQuery()
        res.json(stats)
    } catch (error) {
        res.status(500).json({ message: "Error fetching category stats", error: error.message })
    }
}

async function getTicketTrends(req, res) {
    try {
        const period = parseInt(req.query.period) || 7
        const stats = await getTicketTrendsQuery(period)
        res.json(stats)
    } catch (error) {
        console.error("Error fetching trend ticket:", error.message)
        res.status(500).json({ message: "Error fetching trend ticket", error: error.message })
    }
}

async function createComplaintTicket(req, res) {
    try {
        const userId = req.user.id;
        const { category, description, attachmentUrl } = req.body;

        if (!category || !description) {
            return res.status(400).json({
                success: false,
                message: "Category and description is mandatory"
            })
        }

        const newTicket = await createComplaintTicketQuery(userId, {
            category,
            description,
            attachmentUrl
        })

        res.status(201).json({
            success: true,
            message: "Pengaduan berhasil dikirim!",
            data: newTicket
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating complaint ticket.",
            error: error.message
        })
    }
}

async function getMyTickets(req, res) {
    try {
        const userId = req.user.id;
        const tickets = await getMyTicketsQuery(userId);
        res.status(200).json({
            success: true,
            data: tickets
        })
    } catch (error) {
        console.error("Error fetching tickets:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching tickets.",
            error: error.message
        })
    }
}

async function getTicketsForAdmin(req, res) {
    try {
        const status = req.query

        const tickets = await getTicketsForAdminQuery(status)

        res.status(200).json({
            success: true,
            message: "Tickets successfully fetched",
            data: tickets
        })
    } catch (error) {
        console.error("Error fetching admin tickets:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching admin tickets.",
            error: error.message
        })
    }
}

async function verifyTicket(req, res) {
    try {
        const { id } = req.params
        const { status, actionNote } = req.body

        const validStatuses = ['InProgress', 'EscalatedToDean', 'Resolved', 'Cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Ticket status invalid!"
            })
        }

        const updatedTicket = await verifyTicketQuery(id, { status, actionNote })

        res.status(200).json({
            success: true,
            message: `Ticket successfully updated to status: ${status}`,
            data: updatedTicket
        })

    } catch (error) {
        console.error("Error triage ticket:", error.message);
        res.status(500).json({ success: false, message: "Error triage ticket." })
    }
}

async function getTicketComplaintDetail(req, res) {
    try {
        const { id } = req.params
        const userId = req.user.id
        const userRole = req.user.role

        const ticket = await getTicketComplaintDetailQuery(id)

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found!" })
        }

        const isAdminOrDekan = ['ADMIN', 'DEKANAT'].includes(userRole.toUpperCase())
        if (!isAdminOrDekan && ticket.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied! You don't have permission to view this ticket."
            })
        }

        res.status(200).json({
            success: true,
            data: ticket
        })

    } catch (error) {
        console.error("Error fetching ticket detail:", error.message)
        res.status(500).json({ success: false, message: "Error fetching ticket detail." })
    }
}

export {
    getTickets,
    getConversationDetails,
    assignTicketToAdmin,
    resolveTicketByAdmin,
    countDasboardStats,
    getTicketCategoryStats,
    getTicketTrends,
    getConversationRelevantDetails,
    createComplaintTicket,
    // HaloDekan
    getMyTickets,
    getTicketComplaintDetail,
    getTicketsForAdmin,
    verifyTicket,
}