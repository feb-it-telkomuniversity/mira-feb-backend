import express from "express"
import { initializeWhatsapp } from "./services/whatsapp-service.js";
import route from "./routes/api.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cron from "node-cron"
import { sendScheduleReminders } from "./model/schedule-model.js";

const allowedOrigins = [
    'http://localhost:3000',
    'https://mira-feb.telkomuniversity.ac.id'
]

const app = express()
app.disable('etag')
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
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