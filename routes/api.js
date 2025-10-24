import { Router } from 'express';
import { getTickets, getConversationDetails, assignTicketToAdmin, countDasboardStats, getTicketCategoryStats, getTicketTrends, resolveTicketByAdmin, getConversationRelevantDetails } from "../controller/tickets-controller.js"
const AuthController = require('../controller/auth-controller.js')
import { handleCreateSchedule, getSchedulesByMonth, handleCancelSchedule, handleDeleteSchedule } from '../controller/schedule-controller.js';

const route = Router()

// AUTH
route.post('/sign-in', AuthController.signIn)
route.post('/register-admin', AuthController.registerAdmin)

route.get('/tickets', getTickets)
route.put('/tickets/:id/assign', assignTicketToAdmin)
route.put('/tickets/:id/resolve', resolveTicketByAdmin)
route.get('/dashboard/stats', countDasboardStats)
route.get('/dashboard/stats/ticket-categories', getTicketCategoryStats)
route.get('/dashboard/stats/ticket-trends', getTicketTrends)
// route.get('/conversations/:id', getConversationDetails)
route.get('/conversations/:id', getConversationRelevantDetails)

route.get('/schedules', getSchedulesByMonth)
route.post('/schedules', handleCreateSchedule)
route.delete('/schedules/:id', handleDeleteSchedule)
route.put('/schedules/:id/cancel', handleCancelSchedule)

export default route