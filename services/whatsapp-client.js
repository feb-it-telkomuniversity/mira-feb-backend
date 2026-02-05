import pkg from "whatsapp-web.js"
import path from 'path'

const { Client, LocalAuth } = pkg
const SESSION_PATH = path.join('/tmp', '.wwebjs_auth')

export const client = new Client({
    authStrategy: new LocalAuth({ dataPath: SESSION_PATH }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});