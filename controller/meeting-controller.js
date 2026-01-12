import { createMeetingQuery, deleteMeetingQueryById, getMeetingListQuery, getMeetingListQueryById, updateMeetingQuery } from "../model/meeting-model.js";

const calculateMeetingStatus = (meeting) => {
    // 1. Prioritas Utama: Kalau di DB statusnya 'Cancelled', ya tetap Cancelled
    if (meeting.status === 'Batal') {
        return 'Batal'
    }

    const now = new Date();
    const start = new Date(meeting.startTime);
    const end = new Date(meeting.endTime);

    if (now < start) {
        return 'Terjadwal'; // Belum mulai
    } else if (now >= start && now <= end) {
        return 'Berlangsung'; // Sedang jalan
    } else {
        return 'Selesai'; // Waktu sudah lewat
    }
};

const ROOM_MAP = {
    "Ruang Rapat Manterawu lt. 2": "RuangRapatManterawuLt2",
    "Ruang Rapat Miossu lt. 1": "RuangRapatMiossuLt1",
    "Ruang Rapat Miossu lt. 2": "RuangRapatMiossuLt2",
    "Ruang Rapat Maratua lt. 1": "RuangRapatMaratuaLt1",
    "Aula FEB": "AulaFEB",
    "Aula Manterawu": "AulaManterawu",
    "Lainnya": "Lainnya"
};

async function createMeeting(req, res) {
    try {
        const raw = req.body

        // 1. Validasi Field Wajib (Header Rapat)
        if (!raw.title || !raw.date || !raw.startTime || !raw.endTime || !raw.leader || !raw.room) {
            return res.status(400).json({
                success: false,
                message: "Data pokok rapat (Judul, Waktu, Tempat, Pemimpin) wajib diisi."
            });
        }

        const roomEnum = ROOM_MAP[raw.room] || raw.room
        if (roomEnum === 'Lainnya' && (!raw.locationDetail || raw.locationDetail.trim() === "")) {
            return res.status(400).json({ 
                success: false, 
                message: "Jika ruangan 'Lainnya', mohon isi detail lokasi rapat." 
            })
        }

        // 2. Validasi Agenda (Minimal 1 Agenda biar gak kosong melompong)
        if (!raw.agendas || raw.agendas.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Minimal harus ada 1 Agenda pembahasan."
            })
        }

        // 3. Eksekusi Model
        const payload = {
            title: raw.title,
            date: raw.date,
            startTime: raw.startTime,
            endTime: raw.endTime,
            room: roomEnum,
            locationDetail: raw.locationDetail,

            leader: raw.leader,
            notetaker: raw.notetaker,
            participants: raw.participants || [],

            agendas: raw.agendas
        }
        const newMeeting = await createMeetingQuery(payload)

        res.status(201).json({
            success: true,
            message: "Rapat berhasil dijadwalkan.",
            data: newMeeting
        });

    } catch (error) {
        console.error("Error creating meeting:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server saat menyimpan data."
        });
    }
}

async function getMeetingList(req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 15
        const search = req.query.search || ""

        const status = req.query.status || undefined

        const result = await getMeetingListQuery(page, limit, search)

        const mappedData = result.data.map(meeting => {
            const dynamicStatus = calculateMeetingStatus(meeting)
            return {
                ...meeting,
                status: dynamicStatus,
                hasNotulensi: dynamicStatus !== 'Terjadwal' && dynamicStatus !== 'Batal'
                // hasNotulensi: meeting.status !== 'Terjadwal' && meeting.status !== 'Batal'
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
        const data = await getMeetingListQueryById(id)

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Data rapat tidak ditemukan."
            })
        }
        
        const dynamicStatus = calculateMeetingStatus(data)

        const result = {
            ...data,
            status: dynamicStatus
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
        const raw = req.body

        if (!id) {
            return res.status(400).json({ success: false, message: "ID Rapat wajib ada." })
        }

        if (!raw.title) {
            return res.status(400).json({ success: false, message: "Judul rapat tidak boleh kosong." })
        }

        const roomEnum = ROOM_MAP[raw.room] || raw.room
        if (roomEnum === 'Lainnya' && (!raw.locationDetail || raw.locationDetail.trim() === "")) {
            return res.status(400).json({ 
                success: false, 
                message: "Jika ruangan 'Lainnya', mohon isi detail lokasi rapat." 
            });
        }

        const payload = {
            title: raw.title,
            date: raw.date,
            startTime: raw.startTime,
            endTime: raw.endTime,
            room: roomEnum,
            locationDetail: raw.locationDetail,

            leader: raw.leader,
            notetaker: raw.notetaker,
            participants: raw.participants || [],
            status: raw.status,

            agendas: raw.agendas
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