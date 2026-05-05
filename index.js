import express from "express"
import { initializeWhatsapp } from "./services/whatsapp-service.js";
import route from "./routes/api.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cron from "node-cron"
import { sendScheduleReminders } from "./model/schedule-model.js";

const app = express()
app.use(cors({
    origin: process.env.PUBLIC_API_BASE_URL || "http://localhost:3000",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// initializeWhatsapp()

app.get("/", (req, res) => {
    res.json({
        "message": "MIRA FEB Backend running quickly 🚀"
    });
})

app.use('/api', route)

// cron.schedule('*/9 * * * *', sendScheduleReminders)
// console.log('🕒 Cron job untuk reminder sudah aktif dan akan berjalan setiap 2 menit.')

const PORT = 3001

app.listen(3001, () => {
    console.log(`Server walk in  http://localhost:${PORT}`);
})