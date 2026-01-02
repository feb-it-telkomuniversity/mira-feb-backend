import { createMeetingQuery, deleteMeetingQueryById, getMeetingListQuery, getMeetingListQueryById, updateMeetingQuery } from "../model/meeting-model.js";

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

async function getMeetingList(req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 15
        const search = req.query.search || ""

        const status = req.query.status || undefined

        const result = await getMeetingListQuery(page, limit, search, status)

        const mappedData = result.data.map(meeting => {
            // Menambahkan properti hasNotulensi berdasarkan status meeting:
            // Jika status BUKAN 'Terjadwal' dan BUKAN 'Batal', maka hasNotulensi = true
            // Artinya, notulensi sudah tersedia untuk rapat tsb
            return {
                ...meeting,
                hasNotulensi: meeting.status !== 'Terjadwal' && meeting.status !== 'Batal'
            }
        })

        if (result) {
            return res.status(200).json({
                success: true,
                message: "Berhasil mengambil data rapat",
                data: mappedData,
                pagination: result.pagination
            })
        }
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server saat memuat data."
        })        
    }
}

async function getMeetingListById(req, res) {
    try {
        const { id } = req.params
        const result = await getMeetingListQueryById(id)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Data rapat tidak ditemukan."
            })
        }

        res.status(200).json({
            success: true,
            message: `Berhasil mengambil data rapat dari id: ${id}`,
            data: result,
        })

    } catch (error) {
        console.error("Error fetching meetings:", error);
        if (error.code === 'P2025' || error.message.includes('Int')) {
            return res.status(400).json({ success: false, message: "Format ID tidak valid." });
       }

       res.status(500).json({
           success: false,
           message: "Terjadi kesalahan server saat memuat data."
       })
    }
}

async function updateMeeting(req, res) {
    try {
        const { id } = req.params
        const payload = req.body

        if (!id) {
            return res.status(400).json({ success: false, message: "ID Rapat wajib ada." })
        }

        if (!payload.title) {
            return res.status(400).json({ success: false, message: "Judul rapat tidak boleh kosong." })
        }

        const updatedData = await updateMeetingQuery(id, payload)

        res.status(200).json({
            success: true,
            message: "Data notulensi berhasil diperbarui.",
            data: updatedData
        })
    } catch (error) {
        console.error("Error updating meeting:", error)

        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Data rapat tidak ditemukan." })
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server saat memperbarui data."
        })
    }
}

async function deleteMeetingById(req, res) {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ success: false, message: "ID Rapat diperlukan." })
        }

        await deleteMeetingQueryById(id)
        res.status(200).json({
            success: true,
            message: "Meeting deleted successfully"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                success: false, 
                message: "Data rapat tidak ditemukan atau sudah dihapus sebelumnya." 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan server." 
        })
    }
}

export { createMeeting, getMeetingList, getMeetingListById, deleteMeetingById, updateMeeting }