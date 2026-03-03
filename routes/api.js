import { Router } from 'express';
import { getTickets, getConversationDetails, assignTicketToAdmin, countDasboardStats, getTicketCategoryStats, getTicketTrends, resolveTicketByAdmin, getConversationRelevantDetails } from "../controller/tickets-controller.js"
import { signIn, getUsers, registerUser, deleteUser, updateUser, updateMyProfile, uploadAvatar, deleteAvatar, getMyProfile } from '../controller/auth-controller.js'
import { handleCreateSchedule, getSchedulesByMonth, handleCancelSchedule, handleDeleteSchedule } from '../controller/schedule-controller.js';
import { createContact, getContacts, handleDeleteContact, updateContact } from '../controller/contacts-controller.js';
import { createPartnershipData, deletePartnershipData, getPartnershipCharts, getPartnershipData, getPartnershipStats, getPartnershipSummaryStats, updatePartnershipData } from '../controller/partnership-controller.js';
import { addEvent, getEvents, getGoogleEvents, googleLogin, googleRedirect } from '../controller/google-calendar-controller.js';
import { createContractManagement, deleteContractManagement, getContractManagementById, getContractManagementData, getContractStats, updateContractManagement } from '../controller/contract-management-controller.js';
import { createActivityMonitoring, getActivityMonitoringList, deleteActivityMonitoring, updateActivityMonitoring } from '../controller/activity-monitoring-controller.js'
import { createManagementReport, deleteManagementReport, getManagementReportList, toggleReportStatus, updateManagementReport } from '../controller/management-report-controller.js'
import { getLecturersList } from '../controller/lecturer-controller.js'
import { getStaffsList } from '../controller/staff-controller.js'
import { createMeeting, deleteMeetingById, getMeetingList, getMeetingListById, updateMeeting } from '../controller/meeting-controller.js'
import { verifyRole, verifyToken } from '../middleware/auth-middleware.js'
import multer from 'multer'
import { loginWithGoogle } from '../controller/login-controller.js';

const route = Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2mb
    }
})


// PUBLIC ROUTES
route.post('/sign-in', signIn)
route.get("/google/login", googleLogin);
route.get("/google/redirect", googleRedirect)
route.post('/auth/google', loginWithGoogle)

// PROTECTED ROUTES
route.use(verifyToken)

const canEditData = verifyRole(['admin', 'dekanat', 'kaur', 'kaprodi'])
const adminOnly = verifyRole(['admin'])


route.get("/users", adminOnly, getUsers)
route.post('/register-user', adminOnly, registerUser)
route.patch('/users/me', updateMyProfile)
route.post('/users/upload-avatar', upload.single('avatar'), uploadAvatar)
route.delete('/users/delete-avatar', deleteAvatar)
route.delete('/users/:id', adminOnly, deleteUser)
route.put('/users/:id', adminOnly, updateUser)
route.get('/users/me', getMyProfile)

route.get('/tickets', adminOnly, getTickets)
route.put('/tickets/:id/assign', adminOnly, assignTicketToAdmin)
route.put('/tickets/:id/resolve', adminOnly, resolveTicketByAdmin)
route.get('/dashboard/stats', adminOnly, countDasboardStats)
route.get('/dashboard/stats/ticket-categories', adminOnly, getTicketCategoryStats)
route.get('/dashboard/stats/ticket-trends', adminOnly, getTicketTrends)
// route.get('/conversations/:id', getConversationDetails)
route.get('/conversations/:id', adminOnly, getConversationRelevantDetails)

route.get('/schedules', getSchedulesByMonth)
route.post('/schedules', handleCreateSchedule)
route.delete('/schedules/:id', handleDeleteSchedule)
route.put('/schedules/:id/cancel', handleCancelSchedule)

route.get('/contacts', getContacts)
route.post('/contacts', createContact)
route.delete('/contacts/:id', handleDeleteContact)
route.put('/contacts/:id', updateContact)

// ==== Partnership ====
route.get('/partnership/stats', getPartnershipSummaryStats)
route.get('/partnership/chart', getPartnershipCharts)
route.get('/partnership', getPartnershipData)
route.post('/partnership', createPartnershipData)
route.put('/partnership/:id', updatePartnershipData)
route.delete('/partnership/:id', deletePartnershipData)

// ==== Google Calendar ====
route.get("/google/events", getGoogleEvents);
route.post("/google/events", addEvent);

// ==== Contract Management ====
route.get('/contract-management', getContractManagementData)
route.get('/contract-management/stats', getContractStats)
route.get('/contract-management/:id', getContractManagementById)
route.post('/contract-management', createContractManagement)
route.put('/contract-management/:id', updateContractManagement)
route.delete('/contract-management/:id', deleteContractManagement)

// ==== Activtiy Monitoring List ====
route.get('/activity-monitoring', getActivityMonitoringList)
route.post('/activity-monitoring', createActivityMonitoring)
route.delete('/activity-monitoring/:id', deleteActivityMonitoring)
route.put('/activity-monitoring/:id', updateActivityMonitoring)

// ==== Management Report ====
route.get('/management-reports', getManagementReportList)
route.post('/management-reports', createManagementReport)
route.put('/management-reports/:id', updateManagementReport)
route.patch('/management-reports/:id/toggle', toggleReportStatus)
route.delete('/management-reports/:id', deleteManagementReport)

// ==== NOTULENSI MEETING ====
route.get('/meetings', getMeetingList)
route.get('/meetings/:id', getMeetingListById)
route.post('/meetings', createMeeting)
route.put('/meetings/:id', updateMeeting)
route.delete('/meetings/:id', deleteMeetingById)

// ==== DATA TPA dan DATA DOSEN ====
route.get('/lecturers', getLecturersList)
route.get('/staffs', getStaffsList)

export default route