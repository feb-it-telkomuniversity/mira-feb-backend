import { cancelScheduleQuery, createScheduleQuery, deleteScheduleQuery, getSchedulesByMonthQuery } from "../model/schedule-model";

async function getSchedulesByMonth(req, res) {
    try {
        const now = new Date()
        const year = parseInt(req.query.year) || now.getFullYear()
        const month = parseInt(req.query.month) || now.getMonth() + 1

        const schedule = await getSchedulesByMonthQuery(year, month)
        res.json(schedule)
    } catch (error) {
        console.error('Error saat mengambil jadwal: ', error)
        res.status(500).json({ "Message": "Internal server error" })
    }
}

async function handleCreateSchedule(req, res) {
    try {
        const { 
            recipients,
            eventTitle, 
            eventDescription, 
            eventTime,
            reminderTime,
            createdBy 
        } = req.body

        if (!Array.isArray(recipients)  || !recipients || recipients.length === 0 || !eventTitle || !eventDescription || !eventTime  || !reminderTime || !createdBy) {
            return res.status(400).json({ message: "Field event, reminder, dan minimal satu penerima wajib diisi." });
        }

        const newSchedule = await createScheduleQuery(req.body)
        res.status(201).json({
            message: "Jadwal berhasil dibuat",
            data: newSchedule
        })
    } catch (error) {
        console.error("Error saat membuat jadawl: ", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function handleCancelSchedule(req, res) {
    try {
        const scheduleId = parseInt(req.params.id)
        const updateScheduleStatus = await cancelScheduleQuery(scheduleId)
        if (updateScheduleStatus === 0) {
            return res.status(409).json({
                message: "Schedule cannot be cancel. Maybe it has been sent or no schedule yet"
            })
        }
        res.json({ message: `Schedule ${scheduleId} successfully cancelled` })
    } catch (error) {
        res.status(500).json({ message: "Got error when canceling schedule ", error: error.message })
        console.error({ message: "Got error when canceling schedule ", error: error.message })
    }
}

async function handleDeleteSchedule(req, res) {
    try {
        const scheduleId = parseInt(req.params.id)
        const deleteSchedule = await deleteScheduleQuery(scheduleId)
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: "Error when deleting schedule", error: error.message })
    }
}

export { handleCreateSchedule, getSchedulesByMonth, handleCancelSchedule, handleDeleteSchedule }