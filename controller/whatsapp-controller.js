import { db } from "../config/database-connection"
import { generateResponse } from "../services/gemini-service"
import { getOrCreateConversation, logMessage, createUnresolvedTicket } from "../model/conversation-model"

async function handleMessage(msg) {
    const userId = msg.from;
    const text = msg.body.trim()
    const chat = await msg.getChat()

    const conversation = await getOrCreateConversation(userId)

    await logMessage(conversation.id, 'user', text)

    const [activeTickets] = await db.query(`
        SELECT unresolved.id FROM unresolved
        JOIN messages ON unresolved.message_id = messages.id
        WHERE messages.conversation_id = ?
        AND unresolved.status IN ('open', 'in_progress')
        LIMIT 1`,
        [conversation.id]
    )

    if (activeTickets.length > 0) {
        const reply = `Halo! Sepertinya admin kami sedang menangani permintaanmu sebelumnya.  
        \nMohon ditunggu balasan dari mereka ya sebelum memulai pertanyaan baru, agar tidak terjadi tumpang tindih informasi. 
        \nTerima kasih! 🙏`
        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 3000))
        msg.reply(reply)
        return
    }

    if (conversation.isNew) {
        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 3000))
        await msg.reply("Halo 👋, saya admin akademik Fakultas Ekonomi dan Bisnis Telkom University.")
        await msg.reply("Sebelum melanjutkan, boleh sebutkan NIM kamu dulu untuk verifikasi ya? 🙂")
        return
    }
    
    if (conversation.step === "awaiting_feedback") {
        const lastMessageId = conversation.last_bot_message_id
        let replyText = ""

        switch (text) {
            case "1":
                await db.query("UPDATE messages SET feedback = '1' WHERE id = ?", [lastMessageId])
                replyText = `Syukurlah kalau begitu! Terima kasih feedback-nya ya. Jangan sungkan untuk memulai percakapan lagi ya ${conversation.user.name}`
                await db.query("UPDATE conversations SET step = 'menu' WHERE id = ?", [conversation.id])
                break
            case "2":
            case "3":
                await db.query("UPDATE messages SET feedback = ?, need_human = TRUE WHERE id = ?", [text, lastMessageId])
                await createUnresolvedTicket(lastMessageId)
                replyText = "Terima kasih atas masukannya. 🙏 Pesan ini sudah kami tandai untuk ditinjau oleh admin.\n\nApakah kamu ingin terhubung dengan admin sekarang? Balas *'YA'* jika perlu."
                break
            default:
                if (text.toLowerCase() === 'ya') {
                    await db.query("UPDATE unresolved SET status = 'in_progress' WHERE message_id = ?", [lastMessageId])
                    replyText = "Baik, pesanmu sudah diteruskan dan menjadi prioritas. Mohon tunggu balasan dari admin ya!"
                    // Kembalikan ke menu setelah eskalasi
                    await db.query("UPDATE conversations SET step = 'menu' WHERE id = ?", [conversation.id])
                } else {
                    replyText = "Pilihan feedback tidak valid. Silakan balas dengan angka 1, 2, atau 3."
                }
        }

        await msg.reply(replyText)
        await logMessage(conversation.id, 'bot', replyText)
        return
    }

    // 2. Step: validasi NIM
    if (conversation.step === "ask_nim") {
        let nimMatch = text.match(/\d+/g)
        let nim = nimMatch ? nimMatch.find((num) => num.length >= 8) : null

        if (!nim) {
            chat.sendStateTyping()
            await new Promise((resolve) => setTimeout(resolve, 2000))
            await msg.reply("⚠️ Format NIM sepertinya kurang tepat. Mohon masukkan NIM dengan benar ya, contoh: 10123008");
            return
        }

        await db.query("UPDATE users SET identifier = ? WHERE id = ?", [nim, conversation.user.id])
        await db.query("UPDATE conversations SET step = 'ask_name' WHERE id = ?", [conversation.id])

        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 4000))
        const reply = `Oke, NIM kamu ${nim} sudah tercatat. 👍\n\nSelanjutnya, boleh info nama lengkapmu?`
        await msg.reply(reply)
        await logMessage(conversation.id, 'bot', reply)
        return
    }

    // 3. Step: Ask name
    if (conversation.step === "ask_name") {
        let name
        try {
            const extractionPrompt = `
            Dari kalimat berikut, ekstrak HANYA nama lengkap orangnya. 
            Jangan sertakan kata lain seperti "nama saya adalah", sapaan, atau penjelasan apapun.
            Jika tidak ada nama yang bisa ditemukan, balas HANYA dengan kata "TIDAK_DITEMUKAN".

            Kalimat: "${text}"
            `
            const extractedName = await generateResponse(extractionPrompt)

            if (extractedName.toUpperCase() === "TIDAK_DITEMUKAN" || extractedName.length < 3) {
                const reply = "Maaf, sepertinya saya tidak bisa mengenali nama dari kalimatmu. Bisa tolong ketik nama lengkapmu saja? 😊"
                msg.reply(reply)
                return
            }

            name = extractedName

        } catch (error) {
            console.error("Error saat ekstraksi nama:", error);
            nama = text;
        }

        await db.query("UPDATE users SET name = ? WHERE id = ?", [name, conversation.user.id])
        await db.query("UPDATE conversations SET step = 'menu' WHERE id = ?", [conversation.id])

        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 4000))
        const reply = `Halo ${name}, datamu sudah tersimpan ✅\n\nSilakan pilih kategori bantuan di bawah ini:\n1️⃣ Sidang\n2️⃣ Keuangan\n3️⃣ Wisuda`
        msg.reply(reply)
        await logMessage(conversation.id, 'bot', reply) 

        return
    }

    // 4. Step: pilih kategori
    if (conversation.step === "menu") {
        let category
        let skipWelcome = false

        switch (text) {
            case "1":
                category = "Sidang"
                skipWelcome = true
                break
                case "2":
                category = "Keuangan"
                skipWelcome = true
                break;
                case "3":
                category = "Wisuda";
                skipWelcome = true
                break;
            default:
                const welcomeBackText = `Halo lagi, ${conversation.user.name}! Saya admin akademik Fakultas Ekonomi dan Bisnis Telkom University. Senang bisa bantu kamu lagi. 😊`
                const menuText = `Silakan pilih salah satu kategori di bawah ini dengan membalas angkanya ya:\n\n1️⃣ Sidang\n2️⃣ Keuangan\n3️⃣ Wisuda`
                chat.sendStateTyping()
                await new Promise((resolve) => setTimeout(resolve, 3000))
                await msg.reply(welcomeBackText)
                await logMessage(conversation.id, 'bot', welcomeBackText)
                chat.sendStateTyping()
                await new Promise((resolve) => setTimeout(resolve, 3000))
                await msg.reply(menuText)
                await logMessage(conversation.id, 'bot', menuText)
                return
        }

        if (skipWelcome) {
            await db.query("UPDATE conversations SET step = 'chat', category = ? WHERE id = ?", [category, conversation.id])
            const reply = `✅ Kamu memilih kategori *${category}*. Silakan tanyakan apa yang ingin kamu ketahui.`
    
            chat.sendStateTyping()
            await new Promise((resolve) => setTimeout(resolve, 3000))
            await msg.reply(reply);
            await logMessage(conversation.id, 'bot', reply)
        }
        return
    }

    // 5. Step: percakapan natural sesuai kategori
    if (conversation.step === "chat") {
        prompt = `
        PERSONA KAMU:
        - Kamu adalah admin akademik FEB Telkom University yang super ramah, ceria, dan sangat membantu.
        - Posisikan dirimu sebagai kakak tingkat atau staf muda yang akrab dengan mahasiswa.
        - Gaya bicaramu semi-formal, positif, dan antusias. Boleh pakai emoji sesekali (misal: 😊👍🫡😁) untuk menambah keakraban.

        ATURAN:
        - Kategori saat ini adalah: "${conversation.category}".
        - Jangan pernah mengulang sapaan atau memperkenalkan diri.
        - Hindari bahasa yang terlalu kaku atau seperti robot.
        ---
        PERTANYAAN DARI MAHASISWA:
        ${text}
        `

        try {
            chat.sendStateTyping()
            const reply = await generateResponse(prompt)
            
            const botMessageId = await logMessage(conversation.id, 'bot', reply)
            
            await new Promise((resolve) => setTimeout(resolve, 2000))
            await msg.reply(reply)

            const feedbackQuestion = `Tolong nilai jawaban AI FEB diatas dengan membalas hanya dengan angka. Apakah jawabannya: \n\n1️⃣ Tepat & membantu\n2️⃣ Kurang tepat\n3️⃣ Sama sekali tidak menjawab\n\nBalas hanya dengan angka 1, 2, atau 3 ya
            `
            chat.sendStateTyping()
            await new Promise((resolve) => setTimeout(resolve, 4000))
            await msg.reply(feedbackQuestion)
            await logMessage(conversation.id, 'bot', feedbackQuestion)
            await db.query(
                "UPDATE conversations SET step = 'awaiting_feedback', last_bot_message_id = ? WHERE id = ?", 
                [botMessageId, conversation.id]
            )
        } catch (error) {
            console.error("Error Gemini:", error)
            await new Promise((resolve) => setTimeout(resolve, 3000))
            const errorReply = "Maaf, sistem error saat menjawab pertanyaan."
            const errorMsgId = await logMessage(conversation.id, 'bot', errorReply, true)
            await createUnresolvedTicket(errorMsgId)
        }
        return;
    }
}

export { handleMessage }