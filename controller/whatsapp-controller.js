import { db } from "../config/database-connection"
import { generateResponse } from "../services/gemini-service"
import { getOrCreateConversation, logMessage, createUnresolvedTicket } from "../model/conversation-model"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

async function handleMessage(msg) {
    const userId = msg.from;
    const text = msg.body.trim()
    const chat = await msg.getChat()

    const currentHour = new Date().getHours();
    let greeting
    if (currentHour >= 7 && currentHour < 11) {
        greeting = "pagi"
    } else if (currentHour >= 11 && currentHour < 15) {
        greeting = "siang"
    } else if (currentHour >= 15 && currentHour < 19) {
        greeting = "sore"
    }

    const conversation = await getOrCreateConversation(userId)

    await logMessage(conversation.id, 'user', text)

    const activeTickets = await prisma.unresolved.findFirst({
        where: {
            message: {
                conversationId: conversation.id
            },
            status: {
                in: ['open', 'in_progress']
            }
        }
    })


    if (activeTickets) {
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
        await msg.reply(`Halo 👋, selamat ${greeting} dan selamat datang di layanan akademik Fakultas Ekonomi dan Bisnis Telkom University.`);
        await msg.reply("Untuk personalisasi layanan, silakan pilih peran Anda:\n\n1️⃣ Mahasiswa\n2️⃣ Dosen 🙂")
        return
    }

    if (conversation.step === "awaiting_feedback") {
        const lastMessageId = conversation.last_bot_message_id
        let replyText = ""

        switch (text) {
            case "1":
                await prisma.message.update({
                    where: { id: lastMessageId },
                    data: { feedback: 'ONE' }
                })
                replyText = `Syukurlah kalau begitu! Terima kasih feedback-nya ya. Jangan sungkan untuk memulai percakapan lagi ya ${conversation.user.name}`
                await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: { step: 'menu' }
                })
                break
            case "2":
            case "3":
                const feedbackValue = text === "2" ? "TWO" : "THREE"
                await prisma.message.update({
                    where: { id: lastMessageId },
                    data: {
                        feedback: feedbackValue,
                        need_human: true,
                    }
                })
                // await db.query("UPDATE messages SET feedback = ?, need_human = TRUE WHERE id = ?", [text, lastMessageId])
                await createUnresolvedTicket(lastMessageId)
                replyText = "Terima kasih atas masukannya. 🙏 Pesan ini sudah kami tandai untuk ditinjau oleh admin.\n\nApakah kamu ingin terhubung dengan admin sekarang? Balas *'YA'* jika perlu."
                break
            default:
                if (text.toLowerCase() === 'ya') {
                    const ticketToUpdate = await prisma.unresolved.update({
                        where: { messageId: lastMessageId }
                    })
                    if (ticketToUpdate) {
                        await prisma.unresolved.update({
                            where: { id: ticketToUpdate },
                            data: { status: 'in_progress' }
                        })
                    }
                    replyText = "Baik, pesanmu sudah diteruskan dan menjadi prioritas. Mohon tunggu balasan dari admin ya!"
                    await prisma.conversation.update({
                        where: { id: conversation.id },
                        data: { step: 'menu' }
                    })
                } else {
                    replyText = "Pilihan feedback tidak valid. Silakan balas dengan angka 1, 2, atau 3."
                }
        }

        chat.sendStateTyping()
        await new Promise((resolve) => setTimeout(resolve, 3000))
        await msg.reply(replyText)
        await logMessage(conversation.id, 'bot', replyText)
        return
    }

    // Step 1: Select Role
    if (conversation.step === "select_role") {
        let nextStep = ''
        let userRole = ''
        let replyText = ''

        switch(text) {
            case '1':
                userRole = 'Mahasiswa'
                nextStep = 'ask_nim'
                replyText = "Terima kasih, Anda telah memilih opsi Mahasiswa. Mohon untuk memasukkan NIM Anda agar kami dapat melakukan verifikasi"
                break
            case '2':
                userRole = 'Dosen'
                nextStep = 'ask_lecturer_name'
                replyText = "Terima kasih, Anda telah memilih opsi Dosen. Mohon untuk memasukkan nama lengkap Anda"
                break
            default:
                replyText = "Pilihan tidak valid. Silakan balas dengan angka 1 (Mahasiswa) atau 2 (Dosen)."
                await msg.reply(replyText)
                await logMessage(conversation.id, 'bot', replyText)
                return
        }

        await prisma.users.update({
            where: { id: conversation.user.id },
            data: { role: userRole }
        })
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { step: nextStep }
        })

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

        await prisma.users.update({
            where: { id: conversation.user.id },
            data: { identifier: nim }
        })
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { step: 'ask_name' }
        })

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

        await prisma.users.update({
            where: { id: conversation.user.id },
            data: { name: name }
        })
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { step: 'menu' }
        })
    
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
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    step: 'chat',
                    category: category
                }
            })
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
        return;
    }
}

export { handleMessage }