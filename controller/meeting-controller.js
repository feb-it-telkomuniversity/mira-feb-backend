import { createMeetingQuery } from "../model/meeting-model.js";

async function createMeeting(req, res) {
    try {
        const payload = req.body

        // 1. Validasi Field Wajib (Header Rapat)
        if (!payload.title || !payload.date || !payload.startTime || !payload.leader) {
            return res.status(400).json({
                success: false,
                message: "Data pokok rapat (Judul, Tanggal, Waktu, Pemimpin) wajib diisi."
            })
        }

        // 2. Validasi Agenda (Minimal 1 Agenda biar gak kosong melompong)
        if (!payload.agendas || payload.agendas.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Minimal harus ada 1 Agenda pembahasan."
            })
        }

        // 3. Eksekusi Model
        const newMeeting = await createMeetingQuery(payload);

        res.status(201).json({
            success: true,
            message: "Notulensi rapat berhasil disimpan.",
            data: newMeeting
        });

    } catch (error) {
        console.error("Error creating meeting:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server saat menyimpan notulensi."
        });
    }
}

export { createMeeting }