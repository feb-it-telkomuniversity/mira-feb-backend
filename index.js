import express from "express"
import { initializeWhatsapp } from "./services/whatsapp-service";
import route from "./routes/api"
import cors from 'cors'

const app = express()
app.use(cors())
// app.use(cors({
//   origin: 'http://localhost:3002' 
// }))
app.use(express.json())

initializeWhatsapp()

app.get("/", (req, res) => {
    res.json({
        "message": "WA Bot Service is running 🚀"
    });
})

app.use('/api', route)

const PORT = 3001

app.listen(3001, () => {
    console.log(`Server walk in  http://localhost:${PORT}`);
})