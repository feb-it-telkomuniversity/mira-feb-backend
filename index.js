import express from "express"
import { initializeWhatsapp } from "./services/whatsapp-service.js";
import route from "./routes/api.js"
import cors from 'cors'
import cron from "node-cron"
import { sendScheduleReminders } from "./model/schedule-model.js";

const app = express()
app.use(cors())

app.use(express.json())

// initializeWhatsapp()

app.get("/", (req, res) => {
    res.json({
        "message": "MIRA FEB Backend running so quickly 🚀"
    });
})

app.use('/api', route)

// cron.schedule('*/9 * * * *', sendScheduleReminders)
// console.log('🕒 Cron job untuk reminder sudah aktif dan akan berjalan setiap 2 menit.')

const PORT = 3001

app.listen(3001, () => {
    console.log(`Server walk in  http://localhost:${PORT}`);
})