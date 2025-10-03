import express from "express"
import { initializeWhatsapp } from "./services/whatsapp-service";
import route from "./routes/ticket";

const app = express()
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