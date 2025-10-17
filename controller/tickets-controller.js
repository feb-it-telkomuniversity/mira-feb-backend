
import { PrismaClient } from "../generated/prisma"
import { findConversationById, findTickets, assignTicketToAdminQuery, countDasboardStatsQuery, getTicketCategoryStatsQuery, getTicketTrendsQuery } from "../model/ticket-model"

const prisma = new PrismaClient()

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
        res.json(conversation)
    } catch (error) {
        res.status(500).json({ message: "Error fetching Conversation details", error: error.message })
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
        res.status(500).json({ message: "Error fetching trend ticket", error: error.message })
        console.error("Error fetching trend ticket:", error.message);
        res.json([])
    }
}

export { 
    getTickets, 
    getConversationDetails, 
    assignTicketToAdmin, 
    countDasboardStats, 
    getTicketCategoryStats,
    getTicketTrends
}