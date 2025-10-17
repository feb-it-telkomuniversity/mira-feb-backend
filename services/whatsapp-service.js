import { Client, LocalAuth } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"
import { handleMessage } from "../controller/whatsapp-controller"
import { client } from "./whatsapp-client"

// WhatsApp Client
// export const client = new Client({
//     authStrategy: new LocalAuth(),
// })

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