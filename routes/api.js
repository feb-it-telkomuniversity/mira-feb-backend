import { Router } from 'express';
import { getTickets, getConversationDetails, assignTicketToAdmin, countDasboardStats, getTicketCategoryStats, getTicketTrends, resolveTicketByAdmin, getConversationRelevantDetails } from "../controller/tickets-controller.js"
import { signIn, registerAdmin } from '../controller/auth-controller.js'
import { handleCreateSchedule, getSchedulesByMonth, handleCancelSchedule, handleDeleteSchedule } from '../controller/schedule-controller.js';
import { createContact, getContacts, handleDeleteContact } from '../controller/contacts-controller.js';
import { createPartnershipData, deletePartnershipData, getPartnershipCharts, getPartnershipData, getPartnershipStats, getPartnershipSummaryStats, updatePartnershipData } from '../controller/partnership-controller.js';
import { addEvent, getEvents, getGoogleEvents, googleLogin, googleRedirect } from '../controller/google-calendar-controller.js';

const route = Router()

// AUTH
route.post('/sign-in', signIn)
route.post('/register-admin', registerAdmin)

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

route.get('/contacts', getContacts)
route.post('/contacts', createContact)
route.delete('/contacts/:id', handleDeleteContact)

route.get('/partnership/stats', getPartnershipSummaryStats)
route.get('/partnership/chart', getPartnershipCharts)
route.get('/partnership', getPartnershipData)
route.post('/partnership', createPartnershipData)
route.put('/partnership/:id', updatePartnershipData)
route.delete('/partnership/:id', deletePartnershipData)

route.get("/google/login", googleLogin);
route.get("/google/redirect", googleRedirect);
route.get("/google/events", getGoogleEvents);
route.post("/google/events", addEvent);

export default route