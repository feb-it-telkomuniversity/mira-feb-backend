import { createManagementQuery } from "../model/management-report-model.js";

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

export { createManagementReport }