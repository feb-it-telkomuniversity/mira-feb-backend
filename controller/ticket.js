
import { PrismaClient } from "../generated/prisma"
import { findConversationById, findTicketsByStatus } from "../model/ticket"

const prisma = new PrismaClient()

async function getAllOpenTickets(req, res) {
    try {
        const tickets = await findTicketsByStatus('open')
        res.json(tickets) 
    } catch (error) {
        res.status(500).json({ message: "Error fetching open tickets", error: error.message })
    }
}

async function getConversationTickets(req, res) {
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