import { db } from "../config/database-connection"

async function getOrCreateConversation(phoneNumber) {
    const [rows] = await db.query("SELECT * FROM conversations WHERE phone_number = ? LIMIT 1", [phoneNumber])
    if (rows.length > 0) {
        console.log("Menampilkan percakapan sebelumnya: ", rows)
        return {...rows[0], isNew: false}; // Kembalikan data percakapan yang sudah ada
    } else {
        const [result] = await db.query(
            "INSERT INTO conversations (phone_number, step) VALUES (?, 'ask_nim')", 
            [phoneNumber]
        );
        console.log("Membuat percakapan baru: ", result)
        const [newRows] = await db.query("SELECT * FROM conversations WHERE id = ?", [result.insertId])
        console.log("Menampilkan data percakapan baru: ", newRows)
        return {...newRows[0], isNew: true} // Kembalikan data percakapan baru
    }
}

async function logMessage(conversationId, sender, text, needHuman = false, feedback = null) {
    const [result] = await db.query(
        "INSERT INTO messages (conversation_id, sender, message_text, need_human, feedback) VALUES (?, ?, ?, ?, ?)",
        [conversationId, sender, text, needHuman, feedback]
    )
    console.log("Save message: ", result)
    return result.insertId
}

async function createUnresolvedTicket(messageId) {
    const createTicket = await db.query(
        "INSERT INTO unresolved (message_id, status) VALUES (?, 'open')", [messageId]
    )
    console.log("Membuat tiket: ", createTicket)
}

export {
    getOrCreateConversation,
    logMessage,
    createUnresolvedTicket
}