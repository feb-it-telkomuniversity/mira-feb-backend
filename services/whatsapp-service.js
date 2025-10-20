import qrcode from "qrcode-terminal"
import { handleMessage } from "../controller/whatsapp-controller.js"
import { client } from "./whatsapp-client.js"

function initializeWhatsapp() {
    client.on("qr", (qr) => {
        console.log("Scan QR ini dengan WhatsApp Web:");
        qrcode.generate(qr, { small: true });
    })
    
    client.on("ready", () => {
        console.log("WhatsApp bot siap 🚀");
    })

    client.on("message", handleMessage)

    client.initialize()
}

export { initializeWhatsapp }