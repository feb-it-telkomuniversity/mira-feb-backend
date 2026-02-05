import { logMessage, createUnresolvedTicket } from "../model/conversation-model.js"
import { PrismaClient } from "@prisma/client"
import { generateResponse } from "../services/gemini-service.js"

const prisma = new PrismaClient()

export default async function chat(msg, conversation, text, chat) {
    if (conversation.user.role === "dosen") {
        // const subKategoriSekretariat = "Surat Tugas, Peminjaman Ruangan, Jadwal Rapat, Administrasi Umum"
        const prompt = `
        Anda adalah asisten akademik virtual yang cerdas dan membantu untuk dosen.
        Tugas Anda adalah menjawab pertanyaan berikut berdasarkan pengetahuan umum Anda.

        PERINGATAN PENTING:
        - Anda TIDAK memiliki akses ke data, prosedur, atau kebijakan internal spesifik dari FEB Telkom University.
        - Jika pertanyaan meminta informasi internal (seperti status pengajuan, jadwal personal, atau prosedur spesifik kampus), Anda WAJIB menyatakan bahwa Anda tidak memiliki akses ke informasi tersebut.
        - Setiap jawaban yang Anda berikan WAJIB diakhiri dengan disclaimer berikut, tanpa mengubah kalimatnya.

        Disclaimer Wajib:
        "---
        *Perlu diingat, informasi ini bersifat umum berdasarkan pengetahuan saya. Untuk prosedur dan kebijakan resmi yang berlaku di FEB Telkom University, mohon untuk selalu melakukan konfirmasi ulang dengan unit terkait.*"

        Konteks Unit Pertanyaan: ${conversation.category}
        Pertanyaan dari Dosen: "${text}"
        `;

        const reply = await generateResponse(prompt)
        const botMessageId = await logMessage(conversation.id, 'bot', reply)
        // const reply = `Terima kasih, Bapak/Ibu. Pertanyaan Anda terkait *${reply}* dalam unit *${conversation.category}* telah kami catat dan akan segera ditindaklanjuti.`
        console.log(`AI mendeteksi sub-kategori: ${reply}`)
        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 4000))
        await msg.reply(reply)
        const feedbackQuestion = `Tolong nilai jawaban AI FEB diatas dengan membalas hanya dengan angka. Apakah jawabannya: \n\n1️⃣ Tepat & membantu\n2️⃣ Kurang tepat\n3️⃣ Sama sekali tidak menjawab\n\nBalas hanya dengan angka 1, 2, atau 3  `
        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 4000))
        await msg.reply(feedbackQuestion)
        await logMessage(conversation.id, 'bot', feedbackQuestion)

        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                step: 'awaiting_feedback',
                last_bot_message_id: botMessageId
            }
        })
    } else {
        const prompt = `
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

            const feedbackQuestion = `Tolong nilai jawaban AI FEB diatas dengan membalas hanya dengan angka. Apakah jawabannya: \n\n1️⃣ Tepat & membantu\n2️⃣ Kurang tepat\n3️⃣ Sama sekali tidak menjawab\n\nBalas hanya dengan angka 1, 2, atau 3 ya `
            chat.sendStateTyping()
            await new Promise((resolve) => setTimeout(resolve, 4000))
            await msg.reply(feedbackQuestion)
            await logMessage(conversation.id, 'bot', feedbackQuestion)
            
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    step: 'awaiting_feedback',
                    last_bot_message_id: botMessageId
                }
            })
        } catch (error) {
            console.error("Error Gemini:", error)
            await new Promise((resolve) => setTimeout(resolve, 3000))
            const errorReply = "Maaf, sistem error saat menjawab pertanyaan."
            const errorMsgId = await logMessage(conversation.id, 'bot', errorReply, true)
            await createUnresolvedTicket(errorMsgId)
        }
        // return
    }
}