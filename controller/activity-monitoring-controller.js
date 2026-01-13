import { createActivityMonitoringQuery, getActivityMonitoringListQuery, deleteActivityMonitoringQuery, updateActivityMonitoringQuery } from '../model/activity-monitoring-model.js'

const UNIT_MAP = {
    "Dekan": "Dekan",
    "Wakil Dekan I": "WakilDekanI",
    "Wakil Dekan II": "WakilDekanII",
    "Urusan Sekretariat Dekan": "UrusanSekretariatDekan",
    "Urusan Layanan Akademik": "UrusanLayananAkademik",
    "Urusan Laboratorium": "UrusanLaboratorium",
    "Urusan SDM Keuangan": "UrusanSDMKeuangan",
    "Urusan Kemahasiswaan": "UrusanKemahasiswaan",
    "Prodi S1 Manajemen": "ProdiS1Manajemen",
    "Prodi S1 Administrasi Bisnis": "ProdiS1AdministrasiBisnis",
    "Prodi S1 Akuntansi": "ProdiS1Akuntansi",
    "Prodi S1 Leisure Management": "ProdiS1LeisureManagement",
    "Prodi S1 Bisnis Digital": "ProdiS1BisnisDigital",
    "Prodi S2 Manajemen": "ProdiS2Manajemen",
    "Prodi S2 Manajemen PJJ": "ProdiS2ManajemenPJJ",
    "Prodi S2 Administrasi Bisnis": "ProdiS2AdministrasiBisnis",
    "Prodi S2 Akuntansi": "ProdiS2Akuntansi",
    "Prodi S3 Manajemen": "ProdiS3Manajemen"
};

const PRODI_MAP = {
    "S1 Manajemen": "S1Manajemen",
    "S1 Administrasi Bisnis": "S1AdministrasiBisnis",
    "S1 Akuntansi": "S1Akuntansi",
    "S1 Leisure Management": "S1LeisureManagement",
    "S1 Bisnis Digital": "S1BisnisDigital",
    "S2 Manajemen": "S2Manajemen",
    "S2 Manajemen PJJ": "S2ManajemenPJJ",
    "S2 Administrasi Bisnis": "S2AdministrasiBisnis",
    "S2 Akuntansi": "S2Akuntansi",
    "S3 Manajemen": "S3Manajemen"
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

const OFFICIAL_MAP = {
    "Rektor": "Rektor",
    "Wakil Rektor 1": "WakilRektor1",
    "Wakil Rektor 2": "WakilRektor2",
    "Wakil Rektor 3": "WakilRektor3",
    "Wakil Rektor 4": "WakilRektor4",
    "Dekan": "Dekan",
    "Wakil Dekan I": "WakilDekanI",
    "Wakil Dekan II": "WakilDekanII",
    "Kaur Sekretariat Dekan": "KaurSekretariatDekan",
    "Kaur Akademik": "KaurAkademik",
    "Kaur Laboratorium": "KaurLaboratorium",
    "Kaur SDM Keuangan": "KaurSDMKeuangan",
    "Kaur Kemahasiswaan": "KaurKemahasiswaan",
    "Kaprodi S1 Manajemen": "KaprodiS1Manajemen",
    "Kaprodi S1 Administrasi Bisnis": "KaprodiS1AdministrasiBisnis",
    "Kaprodi S1 Akuntansi": "KaprodiS1Akuntansi",
    "Kaprodi S1 Leisure Management": "KaprodiS1LeisureManagement",
    "Kaprodi S1 Bisnis Digital": "KaprodiS1BisnisDigital",
    "Kaprodi S2 Manajemen": "KaprodiS2Manajemen",
    "Kaprodi S2 Manajemen PJJ": "KaprodiS2ManajemenPJJ",
    "Kaprodi S2 Administrasi Bisnis": "KaprodiS2AdministrasiBisnis",
    "Kaprodi S2 Akuntansi": "KaprodiS2Akuntansi",
    "Kaprodi S3 Manajemen": "KaprodiS3Manajemen"
}

const ACTIVITY_STATUS_MAP = {
    "Normal": "normal",
    "Ada Konflik": "conflict",
}

async function getActivityMonitoringList(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        let unitFilter = undefined;
        if (req.query.unit && req.query.unit !== "Semua Unit") { // Cek jika bukan default value
            unitFilter = UNIT_MAP[req.query.unit] || req.query.unit;
        }

        let statusFilter = undefined
        const rawStatus = req.query.status

        if (rawStatus) {
            if (rawStatus === 'normal') {
                statusFilter = ['Normal'];
            }
            else if (rawStatus === 'conflict') {
                statusFilter = ['RoomConflict', 'OfficialConflict', 'DoubleConflict'];
            }
            else if (['RoomConflict', 'OfficialConflict', 'DoubleConflict'].includes(rawStatus)) {
                statusFilter = [rawStatus];
            }
        }

        const filters = {
            unit: unitFilter || undefined,
            status: statusFilter || undefined,
            date: req.query.date || undefined
        };

        const result = await getActivityMonitoringListQuery(page, limit, search, filters);

        // Helper: Format Enum jadi Readable String (Opsional)
        // Kalau mau formatting di BE, lakukan map di sini. 
        // Tapi biasanya formatting tampilan dilakukan di Frontend.

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data monitoring kegiatan",
            data: result.data,
            pagination: result.pagination
        });

    } catch (error) {
        console.error("Error fetching activities:", error)
        if (error.message.includes("Invalid value for argument")) {
            return res.status(400).json({
                success: false,
                message: "Filter tidak valid (Format Enum salah)."
            });
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server."
        });
    }
}

async function createActivityMonitoring(req, res) {
    try {
        const raw = req.body

        if (!raw.title || !raw.date || !raw.startTime || !raw.endTime || !raw.unit || !raw.room) {
            return res.status(400).json({
                success: false,
                message: "Data wajib (Judul, Tanggal, Waktu, Unit, Ruangan) harus diisi."
            })
        }

        const unitEnum = UNIT_MAP[raw.unit] || raw.unit
        const roomEnum = ROOM_MAP[raw.room] || raw.room

        let prodiEnum = null;
        if (raw.prodi && raw.prodi !== "-" && raw.prodi !== "") {
            prodiEnum = PRODI_MAP[raw.prodi] || raw.prodi;
        }

        let officialsEnum = []
        if (raw.officials && Array.isArray(raw.officials)) {
            officialsEnum = raw.officials.map(p => {
                if (typeof p !== 'string') return null
                // Regex ini menghapus SPASI, TITIK, KOMA. Sisa Huruf & Angka saja.
                // "Kaur SDM Keuangan" -> "KaurSDMKeuangan"
                return p.replace(/[^a-zA-Z0-9]/g, "")
            }).filter(p => p !== null && p !== "")
        }

        if (roomEnum === 'Lainnya' && (!raw.locationDetail || raw.locationDetail.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "Jika ruangan 'Lainnya', mohon isi detail lokasi kegiatan."
            })
        }

        const payload = {
            title: raw.title,
            date: raw.date,
            startTime: raw.startTime,
            endTime: raw.endTime,
            participants: raw.participants,
            description: raw.description,

            unit: unitEnum,
            room: roomEnum,
            locationDetail: raw.locationDetail,
            officials: officialsEnum
        }

        const newActivity = await createActivityMonitoringQuery(payload)

        let message = "Kegiatan berhasil ditambahkan."
        if (newActivity.status === 'RoomConflict') {
            message = "Disimpan dengan KONFLIK RUANGAN."
        } else if (newActivity.status === 'OfficialConflict') {
            const names = newActivity._conflictDetails.join(", ")
            message = `Disimpan dengan KONFLIK PEJABAT: ${names}.`
        } else if (newActivity.status === 'DoubleConflict') {
            const names = newActivity._conflictDetails.join(", ")
            message = `Disimpan dengan KONFLIK GANDA (Ruangan & Pejabat: ${names}).`
        }
        delete newActivity._conflictDetails;

        res.status(201).json({
            success: true,
            message: message,
            data: newActivity
        })
    } catch (error) {
        console.error("Error creating activity:", error)
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: "Data konflik unique." });
        }

        if (error.message.includes("Argument 'room'")) {
            return res.status(400).json({ success: false, message: "Format Ruangan tidak valid." });
        }

        res.status(500).json({ success: false, message: "Server error." })
    }
}

async function deleteActivityMonitoring(req, res) {
    try {
        const activityId = parseInt(req.params.id)
        const response = await deleteActivityMonitoringQuery(activityId)
        if (response) {
            res.status(200).json({
                success: true,
                message: "Delete activity success"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function updateActivityMonitoring(req, res) {
    try {
        const { id } = req.params
        const raw = req.body
        if (!id) {
            return res.status(400).json({ success: false, message: "ID Kegiatan wajib ada." })
        }

        if (!raw.title || !raw.date || !raw.startTime || !raw.endTime || !raw.unit || !raw.room) {
            return res.status(400).json({
                success: false,
                message: "Data wajib (Judul, Tanggal, Waktu, Unit, Ruangan) harus diisi."
            })
        }

        const unitEnum = UNIT_MAP[raw.unit] || raw.unit
        const roomEnum = ROOM_MAP[raw.room] || raw.room

        let officialsEnum = []
        if (raw.officials && Array.isArray(raw.officials)) {
            officialsEnum = raw.officials.map(p => {
                if (typeof p !== 'string') return null
                // Regex ini menghapus SPASI, TITIK, KOMA. Sisa Huruf & Angka saja.
                // "Kaur SDM Keuangan" -> "KaurSDMKeuangan"
                return p.replace(/[^a-zA-Z0-9]/g, "")
            }).filter(p => p !== null && p !== "")
        }

        if (roomEnum === 'Lainnya' && (!raw.locationDetail || raw.locationDetail.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "Jika ruangan 'Lainnya', mohon isi detail lokasi kegiatan."
            })
        }

        const payload = {
            title: raw.title,
            date: raw.date,
            startTime: raw.startTime,
            endTime: raw.endTime,
            participants: raw.participants,
            description: raw.description,

            unit: unitEnum,
            room: roomEnum,
            locationDetail: raw.locationDetail,
            officials: officialsEnum
        }

        const updatedActivity = await updateActivityMonitoringQuery(id, payload);

        let message = "Kegiatan berhasil diperbarui.";
        if (updatedActivity.status === 'RoomConflict') {
            message = "Diperbarui dengan KONFLIK RUANGAN.";
        } else if (updatedActivity.status === 'OfficialConflict') {
            const names = updatedActivity._conflictDetails ? updatedActivity._conflictDetails.join(", ") : ""
            message = `Diperbarui dengan KONFLIK PEJABAT: ${names}.`
        }
        else if (updatedActivity.status === 'DoubleConflict') {
            const names = updatedActivity._conflictDetails ? updatedActivity._conflictDetails.join(", ") : ""
            message = `Diperbarui dengan KONFLIK GANDA (Ruangan & Pejabat: ${names}).`
        }
        delete updatedActivity._conflictDetails

        res.status(200).json({
            success: true,
            message: message,
            data: updatedActivity
        });
    } catch (error) {
        console.error("Error updating activity:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Data kegiatan tidak ditemukan." })
        }

        if (error.message.includes("Argument")) {
            return res.status(400).json({ success: false, message: "Format data (Enum) tidak valid." })
        }
        res.status(500).json({ success: false, message: "Server error." })
    }
}

export { getActivityMonitoringList, createActivityMonitoring, deleteActivityMonitoring, updateActivityMonitoring }