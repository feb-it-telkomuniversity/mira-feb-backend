import { createScheduleQuery } from "../model/schedule-model";

async function handleCreateSchedule(req, res) {
    try {
        const { 
            targetPerson, 
            targetPhoneNumber, 
            eventTitle, 
            eventDescription, 
            eventTime,  
            createdBy 
        } = req.body

        if (!targetPerson || !targetPhoneNumber || !eventTitle || !eventDescription || !eventTime || !createdBy) {
            return res.status(400).json({ message: "Semua field wajib diisi." });
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

export { handleCreateSchedule }