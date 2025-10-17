import { Router } from 'express';
import { getTickets, getConversationDetails, assignTicketToAdmin, countDasboardStats, getTicketCategoryStats, getTicketTrends } from "../controller/tickets-controller"
import { signIn, signUp } from '../controller/auth-controller';
import { handleCreateSchedule, getSchedulesByMonth, handleCancelSchedule, handleDeleteSchedule } from '../controller/schedule-controller';

const route = Router()

// AUTH
route.post('/sign-in', signIn)
route.post('/sign-up', signUp)

route.get('/tickets', getTickets)
route.put('/tickets/:id/assign', assignTicketToAdmin)
route.get('/dashboard/stats', countDasboardStats)
route.get('/dashboard/stats/ticket-categories', getTicketCategoryStats)
route.get('/dashboard/stats/ticket-trends', getTicketTrends)
route.get('/conversations/:id', getConversationDetails)

route.get('/schedules', getSchedulesByMonth)
route.post('/schedules', handleCreateSchedule)
route.delete('/schedules/:id', handleDeleteSchedule)
route.put('/schedules/:id/cancel', handleCancelSchedule)

export default route