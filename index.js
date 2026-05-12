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
app.use((req, res, next) => {
    const origin = req.headers.origin;

    // ✨ Cek apakah origin ada di list (lebih fleksibel dibanding indexOf)
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // ✨ Wajib ada buat handle "credentials: include"
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, ngrok-skip-browser-warning');

    // ✨ Langsung jawab OK kalau request-nya OPTIONS (Pre-flight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

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