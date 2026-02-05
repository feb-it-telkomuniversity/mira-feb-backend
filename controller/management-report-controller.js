import { createManagementQuery, deleteManagementReportQuery, getManagementReportListQuery, toggleReportStatusQuery, updateManagementReportQuery } from "../model/management-report-model.js";

async function createManagementReport(req, res) {
    try {
        const payload = req.body

        if (!payload.indicator) {
            return res.status(400).json({
                success: false,
                message: "Nama indikator wajib diisi."
            });
        }

        const newReport = await createManagementQuery(payload)

        if (newReport) {
            return res.status(201).json({
                success: true,
                message: "Indikator laporan berhasil ditambahkan.",
                data: newReport
            })
        }
    } catch (error) {
        console.error("Error creating management report:", error)

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: `Indikator ini sudah terdaftar untuk tahun ${req.body.year || new Date().getFullYear()}.`
            })
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server saat menyimpan data."
        })
    }
}

async function getManagementReportList(req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.search || ""
        const year = req.query.year || undefined

        const result = await getManagementReportListQuery(page, limit, search, year)

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data laporan manajemen",
            data: result.data,
            pagination: result.pagination
        })
    } catch (error) {
        console.error("Error fetching management reports:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server saat memuat data."
        })
    }
}


async function updateManagementReport(req, res) {
    try {
        const id = req.params.id
        const payload = req.body

        if (!id) return res.status(400).json({ message: "Tidak ditemukan id-nya" })
            
        const updateReport = await updateManagementReportQuery(id, payload)

        if (updateReport) {
            res.status(200).json({
                success: true,
                message: "Data berhasil diperbarui",
                data: updateReport
            })
        }
    } catch (error) {
        console.error("Error updating report:", error);
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: "Indikator dengan nama tersebut sudah ada di tahun ini." });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan." });
        }
        res.status(500).json({ success: false, message: "Server error." });
    }
}

async function toggleReportStatus(req, res) {
    try {
        const { id } = req.params;
        const { quarter, value } = req.body; // Expect: { "quarter": "tw1", "value": true }

        // 1. Validasi Input
        const allowedQuarters = ['tw1', 'tw2', 'tw3', 'tw4'];
        if (!allowedQuarters.includes(quarter)) {
            return res.status(400).json({ 
                success: false, 
                message: "Parameter quarter tidak valid. Gunakan: tw1, tw2, tw3, atau tw4." 
            });
        }

        if (typeof value !== 'boolean') {
            return res.status(400).json({ 
                success: false, 
                message: "Value harus boolean (true/false)." 
            });
        }

        // 2. Eksekusi Model
        const result = await toggleReportStatusQuery(id, quarter, value);

        res.status(200).json({
            success: true,
            message: `Status ${quarter.toUpperCase()} berhasil diubah.`,
            data: result
        });

    } catch (error) {
        console.error("Error toggling status:", error);
        res.status(500).json({ success: false, message: "Gagal mengubah status checklist." });
    }
}

async function deleteManagementReport(req, res) {
    try {
        const reportId = parseInt(req.params.id)
        const result = await deleteManagementReportQuery(reportId)
        if (result) {
            res.status(200).json({
                success: true,
                message: "Report delted successfully"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { createManagementReport, getManagementReportList, deleteManagementReport, updateManagementReport, toggleReportStatus }