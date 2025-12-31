import { Router } from 'express';
import { getTickets, getConversationDetails, assignTicketToAdmin, countDasboardStats, getTicketCategoryStats, getTicketTrends, resolveTicketByAdmin, getConversationRelevantDetails } from "../controller/tickets-controller.js"
import { signIn, registerAdmin } from '../controller/auth-controller.js'
import { handleCreateSchedule, getSchedulesByMonth, handleCancelSchedule, handleDeleteSchedule } from '../controller/schedule-controller.js';
import { createContact, getContacts, handleDeleteContact } from '../controller/contacts-controller.js';
import { createPartnershipData, deletePartnershipData, getPartnershipCharts, getPartnershipData, getPartnershipStats, getPartnershipSummaryStats, updatePartnershipData } from '../controller/partnership-controller.js';
import { addEvent, getEvents, getGoogleEvents, googleLogin, googleRedirect } from '../controller/google-calendar-controller.js';
import { createContractManagement, getContractManagementData, getContractStats } from '../controller/contract-management-controller.js';
import { createActivityMonitoring, getActivityMonitoringList, deleteActivityMonitoring, updateActivityMonitoring } from '../controller/activity-monitoring-controller.js'
import { createManagementReport, deleteManagementReport, getManagementReportList, toggleReportStatus, updateManagementReport } from '../controller/management-report-controller.js'
import { getLecturersList } from '../controller/lecturer-controller.js'
import { getStaffsList } from '../controller/staff-controller.js'
import { createMeeting } from '../controller/meeting-controller.js'

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

// ==== Partnership ====
route.get('/partnership/stats', getPartnershipSummaryStats)
route.get('/partnership/chart', getPartnershipCharts)
route.get('/partnership', getPartnershipData)
route.post('/partnership', createPartnershipData)
route.put('/partnership/:id', updatePartnershipData)
route.delete('/partnership/:id', deletePartnershipData)

// ==== Google Calendar ====
route.get("/google/login", googleLogin);
route.get("/google/redirect", googleRedirect);
route.get("/google/events", getGoogleEvents);
route.post("/google/events", addEvent);

// ==== Contract Management ====
route.get('/contract-management', getContractManagementData)
route.post('/contract-management', createContractManagement)
route.get('/contract-management/stats', getContractStats)

// ==== Activtiy Monitoring List ====
route.get('/activity-monitoring', getActivityMonitoringList)
route.post('/activity-monitoring', createActivityMonitoring)
route.delete('/activity-monitoring/:id', deleteActivityMonitoring)
route.put('/activity-monitoring/:id', updateActivityMonitoring)

// ==== Management Report ====
route.get('/management-reports', getManagementReportList)
route.post('/management-reports', createManagementReport)
route.delete('/management-reports/:id', deleteManagementReport)
route.put('/management-reports/:id', updateManagementReport)
route.patch('/management-reports/:id/toggle', toggleReportStatus)

// ==== MEETING ====
route.post('/meetings', createMeeting)


// ==== DATA TPA dan DATA DOSEN ====
route.get('/lecturers', getLecturersList)
route.get('/staffs', getStaffsList)


export default route