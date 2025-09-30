import { db } from "../config/database-connection"

async function getOrCreateConversation(phoneNumber) {
    let user
    let isNewUser = false
    
    const [userRows] = await db.query("SELECT * FROM users WHERE phone_number = ? LIMIT 1", [phoneNumber])
    if (userRows.length > 0) {
        user = userRows[0]
    } else {
        const [result] = await db.query("INSERT INTO users (phone_number) VALUES (?)", [phoneNumber])
        console.log("Membuat percakapan baru: ", result)
        const [newUserRows] = await db.query("SELECT * FROM users WHERE id = ?", [result.insertId])
        console.log("Menampilkan data percakapan baru: ", newUserRows)
        user = newUserRows[0]
        isNewUser = true // Kembalikan data percakapan baru
    }

    let conversation
    const [converRows] = await db.query(
        "SELECT * FROM conversations WHERE user_id = ? AND created_at > NOW() - INTERVAL 6 HOUR ORDER BY created_at DESC LIMIT 1",
        [user.id]
    )

    if (converRows.length > 0) {
        conversation = converRows[0]
    } else {
        const initialStep = isNewUser ? 'ask_nim' : 'menu'
        const [result] = await db.query(
            "INSERT INTO conversations (user_id, step) VALUES (?, ?)",
            [user.id, initialStep]
        )
        const [newConvoRows] = await db.query("SELECT * FROM conversations WHERE id = ?", [result.insertId])
        conversation = newConvoRows[0]
    }
    return { ...conversation, user, isNew: isNewUser }
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