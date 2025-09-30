import express from "express"
import { initializeWhatsapp } from "./services/whatsapp-service";

const app = express()
app.use(express.json())

initializeWhatsapp()

app.get("/", (req, res) => {
    res.json({
        "message": "WA Bot Service is running 🚀"
    });
})

const PORT = 3001

app.listen(3001, () => {
    console.log(`Server walk in  http://localhost:${PORT}`);
})