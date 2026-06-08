import {
    getAllTtdLogsQuery,
    getTtdLogByIdQuery,
    createTtdLogQuery,
    updateTtdLogQuery,
    updateTtdLogStatusQuery,
    deleteTtdLogQuery,
    getTtdStatsQuery
} from "../model/log-ttd-dekan-model.js";
import multer from 'multer';
import { put } from "@vercel/blob";

// Setup multer for memory storage file upload (max size 5MB)
const uploadFile = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 }
});

async function getTtdLogs(req, res) {
    try {
        const { search, status, jenisDokumen, mine } = req.query;

        const filters = {
            search,
            status,
            jenisDokumen
        };

        // If mine is true, only fetch logs created by the logged-in user
        if (mine === 'true') {
            filters.userId = req.user.id;
        }

        const data = await getAllTtdLogsQuery(filters);
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil daftar log tanda tangan Dekan",
            data
        });
    } catch (error) {
        console.error("Error fetching Ttd Logs:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data log tanda tangan Dekan",
            error: error.message
        });
    }
}

async function getTtdLogById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID log wajib disertakan"
            });
        }

        const data = await getTtdLogByIdQuery(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Data log tanda tangan Dekan tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail log tanda tangan Dekan",
            data
        });
    } catch (error) {
        console.error("Error fetching Ttd Log detail:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil detail log tanda tangan Dekan",
            error: error.message
        });
    }
}

async function getTtdStats(req, res) {
    try {
        const { mine } = req.query;
        const userId = mine === 'true' ? req.user.id : null;

        const stats = await getTtdStatsQuery(userId);
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil statistik log tanda tangan Dekan",
            data: stats
        });
    } catch (error) {
        console.error("Error fetching Ttd stats:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik",
            error: error.message
        });
    }
}

async function createTtdLog(req, res) {
    try {
        const {
            nomorDokumen,
            namaDokumen,
            jenisDokumen,
            namaPengaju,
            unitAsal,
            metodeOtorisasi,
            berkasPendukung,
            catatanPengaju
        } = req.body;

        // Validation
        if (!namaDokumen || !jenisDokumen || !namaPengaju || !unitAsal || !metodeOtorisasi) {
            return res.status(400).json({
                success: false,
                message: "Kolom namaDokumen, jenisDokumen, namaPengaju, unitAsal, dan metodeOtorisasi wajib diisi"
            });
        }

        const payload = {
            userId: req.user.id,
            nomorDokumen: nomorDokumen || null,
            namaDokumen,
            jenisDokumen,
            namaPengaju,
            unitAsal,
            metodeOtorisasi,
            berkasPendukung: berkasPendukung || null,
            catatanPengaju: catatanPengaju || null
        };

        const newLog = await createTtdLogQuery(payload);

        return res.status(201).json({
            success: true,
            message: "Dokumen otorisasi tanda tangan Dekan berhasil diajukan",
            data: newLog
        });
    } catch (error) {
        console.error("Error creating Ttd Log:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengajukan otorisasi tanda tangan Dekan",
            error: error.message
        });
    }
}

async function updateTtdLog(req, res) {
    try {
        const { id } = req.params;
        const {
            nomorDokumen,
            namaDokumen,
            jenisDokumen,
            namaPengaju,
            unitAsal,
            metodeOtorisasi,
            berkasPendukung,
            catatanPengaju
        } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID wajib diisi" });
        }

        const existingLog = await getTtdLogByIdQuery(id);
        if (!existingLog) {
            return res.status(404).json({ success: false, message: "Log tidak ditemukan" });
        }

        // Authorization: Only the creator (user_id) or Admin/Super Admin can update
        const isOwner = existingLog.userId === req.user.id;
        const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role.toUpperCase());
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Anda tidak berhak memperbarui dokumen ini."
            });
        }

        // State check: Only allow editing if state is "Menunggu TTD" or "Ditolak/Revisi"
        if (existingLog.status === "Selesai TTD" && !isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Dokumen yang telah ditandatangani tidak dapat diubah."
            });
        }

        const payload = {
            actorId: req.user.id,
            nomorDokumen,
            namaDokumen,
            jenisDokumen,
            namaPengaju,
            unitAsal,
            metodeOtorisasi,
            berkasPendukung,
            catatanPengaju
        };

        const updatedLog = await updateTtdLogQuery(id, payload);

        return res.status(200).json({
            success: true,
            message: "Data log tanda tangan Dekan berhasil diperbarui",
            data: updatedLog
        });
    } catch (error) {
        console.error("Error updating Ttd Log:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal memperbarui data log",
            error: error.message
        });
    }
}

async function updateTtdLogStatus(req, res) {
    try {
        const { id } = req.params;
        const { status, hashVerifier, catatanPenyetuju } = req.body;

        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: "ID dan status wajib disertakan"
            });
        }

        const validStatuses = ["Menunggu TTD", "Selesai TTD", "Ditolak/Revisi"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status tidak valid. Gunakan 'Menunggu TTD', 'Selesai TTD', atau 'Ditolak/Revisi'"
            });
        }

        const existingLog = await getTtdLogByIdQuery(id);
        if (!existingLog) {
            return res.status(404).json({ success: false, message: "Log tidak ditemukan" });
        }

        const additionalData = {
            hashVerifier,
            catatanPenyetuju
        };

        const updatedLog = await updateTtdLogStatusQuery(id, status, req.user.id, additionalData);

        return res.status(200).json({
            success: true,
            message: `Status dokumen berhasil diubah menjadi: ${status}`,
            data: updatedLog
        });
    } catch (error) {
        console.error("Error updating Ttd status:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengubah status dokumen",
            error: error.message
        });
    }
}

async function deleteTtdLog(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID wajib diisi" });
        }

        const existingLog = await getTtdLogByIdQuery(id);
        if (!existingLog) {
            return res.status(404).json({ success: false, message: "Log tidak ditemukan" });
        }

        // Authorization: Only the creator or Admin/Super Admin can delete
        const isOwner = existingLog.userId === req.user.id;
        const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role.toUpperCase());
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Anda tidak berhak menghapus dokumen ini."
            });
        }

        // State check: Only allow deleting if status is "Menunggu TTD" (or if admin)
        if (existingLog.status !== "Menunggu TTD" && !isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Hanya dokumen dengan status 'Menunggu TTD' yang dapat dihapus."
            });
        }

        await deleteTtdLogQuery(id);

        return res.status(200).json({
            success: true,
            message: "Log tanda tangan Dekan berhasil dihapus"
        });
    } catch (error) {
        console.error("Error deleting Ttd Log:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal menghapus log",
            error: error.message
        });
    }
}

async function uploadSupportingFile(req, res) {
    const uploadProcess = uploadFile.single('file');

    uploadProcess(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'Ukuran file terlalu besar! Maksimal 5MB.'
                });
            }
            return res.status(400).json({
                success: false,
                message: `Upload Error: ${err.message}`
            });
        } else if (err) {
            return res.status(500).json({
                success: false,
                message: `Server Error: ${err.message}`
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada file yang diunggah'
                });
            }

            const file = req.file;
            const fileName = `log-ttd-dekan/${Date.now()}-${file.originalname}`;
            const blob = await put(fileName, file.buffer, {
                access: 'public',
                addRandomSuffix: true
            });

            return res.status(200).json({
                success: true,
                message: 'Berkas pendukung berhasil diunggah',
                url: blob.url
            });
        } catch (error) {
            console.error('Vercel Blob Upload Error: ', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal menyimpan berkas ke Vercel Blob'
            });
        }
    });
}

export {
    getTtdLogs,
    getTtdLogById,
    getTtdStats,
    createTtdLog,
    updateTtdLog,
    updateTtdLogStatus,
    deleteTtdLog,
    uploadSupportingFile
};
