import { createPartnershipDataQuery, deletePartnershipDataQuery, getPartnershipChartQuery, getPartnershipDataQuery, getPartnershipStatsQuery, getPartnershipSummaryStatsQuery, updatePartnershipDataQuery } from "../model/partnership-model.js";

async function getPartnershipStats(req, res) {
    try {
        const partnershipStats = await getPartnershipStatsQuery()
        return res.status(200).json(partnershipStats)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function getPartnershipSummaryStats(req, res) {
    try {
        const stats = await getPartnershipSummaryStatsQuery()
        res.status(200).json({
            success: true,
            message: "Successfully fetch partnership statistic",
            data: stats
        })
    } catch (error) {
        console.error("Error fetching partnership stats:", error)
        res.status(500).json({ 
            message: "Internal server error when fetching partnership data", 
            error: error.message 
        })
    }
}

async function getPartnershipCharts(req, res) {
    try {
        const chartData = await getPartnershipChartQuery()
        res.status(200).json({
            success: true,
            message: "Successfully fetch chart data partnership",
            data: chartData
        });
    } catch (error) {
        console.error("Error fetching partnership charts:", error);
        res.status(500).json({ message: "Internal server error when fetching partnership data" });
    }
}

async function getPartnershipData(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const search = req.query.search || ""

        const filters = {
            scope: req.query.scope || null,
            docType: req.query.docType || null,
            status: req.query.status || null,
            archive: req.query.archive || null,
        }

        if (page < 1 || limit < 1) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid page or limit parameter" 
            });
        }

        const result = await getPartnershipDataQuery(page, limit, search, filters)

        res.status(200).json({
            success: true,
            message: "Successfully fetch partnership data",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error("Error fetching partnership data:", error);
        res.status(500).json({ message: "Internal server error when fetching partnership data" });
    }
}

async function createPartnershipData(req, res) {
    try {
        const data = req.body
        if (!data.partnerName || !data.docType || !data.scope) {
            return res.status(400).json({
                success: false,
                message: "Data wajib (Nama Mitra, Tipe Dokumen, Scope) harus diisi."
            })
        }

        const newPartnership = await createPartnershipDataQuery(data)

        res.status(201).json({
            success: true,
            message: "Successfully create partnership data",
            data: newPartnership
        })
    } catch (error) {
        console.error("Error creating partnership:", error)

        if (error.code === 'P2002') {
            const target = error.meta?.target || "field unik";
            return res.status(409).json({ // 409 Conflict
                success: false,
                message: `Gagal: Data pada ${target} sudah terdaftar di sistem.`
            })
        }

        res.status(500).json({ 
            success: false,
            message: "Terjadi kesalahan server saat menyimpan data." 
        })
    }
}

async function updatePartnershipData(req, res) {
    try {
        const { id } = req.params // Ambil ID dari URL
        const payload = req.body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID Partnership wajib disertakan."
            })
        }

        if (Array.isArray(payload.activities)) {
            payload.activities = payload.activities.map(act => ({
                id: act.id,
                status: act.status || null,
                notes: act.notes || null
            }))
        }

        // Jalankan Update
        const updatedData = await updatePartnershipDataQuery(id, payload)

        res.status(200).json({
            success: true,
            message: "Data partnership berhasil diperbarui",
            data: updatedData
        })

    } catch (error) {
        console.error("Error updating partnership:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "Data partnership tidak ditemukan."
            });
        }

        // Handle Error: Unique Constraint (Misal ganti No Dokumen jadi nomor yg sudah ada)
        if (error.code === 'P2002') {
             return res.status(409).json({
                success: false,
                message: "Nomor dokumen yang anda masukkan sudah digunakan oleh data lain."
            });
        }

        res.status(500).json({ 
            success: false,
            message: "Terjadi kesalahan server saat memperbarui data." 
        });
    }
}

async function deletePartnershipData(req, res) {
    try {
        const partnershipId = parseInt(req.params.id)
        await deletePartnershipDataQuery(partnershipId)
        res.status(204).json({ message: "Partnership data terhapus dengan baik" })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Terjadi kesalahan server saat memperbarui data." 
        })
    }
}

export { 
    getPartnershipStats, 
    getPartnershipSummaryStats, 
    getPartnershipCharts, 
    getPartnershipData, 
    createPartnershipData, 
    updatePartnershipData,
    deletePartnershipData 
}