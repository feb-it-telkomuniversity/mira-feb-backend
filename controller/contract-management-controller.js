import { createContractManagementQuery, createContractManagementQueryWithAssignment, deleteContractManagementQuery, getContractManagementByIdQuery, getContractManagementDataQuery, getContractStatsQuery, updateContractManagementQuery } from "../model/contract-management-model.js"

export const getContractStats = async (req, res) => {
    try {
        const { quarterly, year } = req.query;

        // Logic sederhana penentuan TW default (bisa disesuaikan dengan logic tanggal)
        const currentQuarter = quarterly || "TW-4";
        const currentYear = year || new Date().getFullYear();

        const stats = await getContractStatsQuery(currentQuarter, currentYear);

        // Kita format agar mirip dengan struktur 'statsData' di Frontend kamu
        const responseData = [
            {
                title: "Total Responsibility",
                value: stats.totalResponsibility.value.toString(),
                change: `${stats.totalResponsibility.formattedChange} items`, // e.g: +8 items
                trend: stats.totalResponsibility.trend,
                description: `dari ${currentQuarter === 'TW-1' ? 'tahun' : 'triwulan'} lalu`,
                iconKey: "FileText" // String identifier untuk icon di FE
            },
            {
                title: "Rata-rata Pencapaian",
                value: `${stats.avgAchievement.value.toFixed(1)}%`,
                change: `${stats.avgAchievement.formattedChange}%`,
                trend: stats.avgAchievement.trend,
                description: "dari target",
                iconKey: "Target"
            },
            {
                title: "Target Tercapai",
                value: stats.targetAchieved.value.toString(),
                change: stats.targetAchieved.formattedChange,
                trend: stats.targetAchieved.trend,
                description: "responsibility",
                iconKey: "CheckCircle2"
            },
            {
                title: "Total Nilai",
                // Format number locale (4,285)
                value: new Intl.NumberFormat('id-ID').format(stats.totalValue.value),
                change: `${stats.totalValue.formattedChange}`, // e.g: +3.8
                trend: stats.totalValue.trend,
                description: "nilai kinerja",
                iconKey: "BarChart3"
            }
        ];

        return res.status(200).json({
            success: true,
            data: responseData
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

async function getContractManagementData(req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 15
        const search = req.query.search || ""

        const filters = {
            category: req.query.category || null,
            quarterly: req.query.quarterly || null,
            unitId: parseInt(req.query.unit) || null // Ubah jadi unitId (angka)
        }

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or limit parameter"
            })
        }

        const result = await getContractManagementDataQuery(page, limit, search, filters)

        res.status(200).json({
            success: true,
            message: "Successfully fetch KM data",
            data: result.data,
            pagination: result.pagination
        })
    } catch (error) {
        console.error("Error fetching KM data: ", error)
        res.status(500).json({ message: "Internal server error when fetching KM data" })
    }
}

async function getContractManagementById(req, res) {
    try {
        const { id } = req.params
        const data = await getContractManagementByIdQuery(id)

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Data rapat tidak ditemukan."
            })
        }

        res.status(200).json({
            success: true,
            message: `Berhasil mengambil detail data KM dari id: ${id}`,
            data: data,
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

async function createContractManagement(req, res) {
    try {
        const payload = req.body;

        const result = await createContractManagementQuery(payload)

        res.status(201).json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error("Create KM error:", error)

        res.status(500).json({
            success: false,
            message: "Failed to create contract management data",
        })
    }
}

async function createContractManagementWithAssignment(req, res) {
    try {
        const {
            ContractManagementCategory,
            responsibility,
            quarterly,
            unitOfMeasurement,
            weight,
            target,
            min,
            max,
            unitIds
        } = req.body;

        if (!responsibility || !quarterly) {
            return res.status(400).json({
                success: false,
                message: "Responsibility and quarterly are required fields"
            });
        }

        // 3. Susun payload bersih untuk dikirim ke Model
        const cleanPayload = {
            ContractManagementCategory: ContractManagementCategory || null,
            responsibility,
            quarterly,
            unitOfMeasurement: unitOfMeasurement || null,
            weight: weight ? parseFloat(weight) : null,
            target: target || null,
            min: min ? parseFloat(min) : null,
            max: max ? parseFloat(max) : null,
            unitIds: unitIds || []
        };

        const result = await createContractManagementQueryWithAssignment(cleanPayload);

        res.status(201).json({
            success: true,
            message: "Successfully created Contract Management Data",
            data: result,
        });
    } catch (error) {
        console.error("Create KM error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create contract management data",
        });
    }
}

async function updateContractManagement(req, res) {
    try {
        const { id } = req.params
        const payload = req.body

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" })
        }

        const updatedData = await updateContractManagementQuery(id, payload)

        res.status(200).json({
            success: true,
            message: "Data successfully recalculated and updated",
            data: updatedData
        })
    } catch (error) {
        console.error("Update KM error:", error)

        if (error.message === "RecordNotFound" || error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update contract management data"
        })
    }
}

async function deleteContractManagement(req, res) {
    try {
        const { id } = req.params
        const result = await deleteContractManagementQuery(id)

        res.status(200).json({
            success: true,
            message: "Data successfully deleted",
            data: result
        })
    } catch (error) {
        console.error("Delete KM error:", error)

        if (error.message === "RecordNotFound" || error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        res.status(500).json({
            success: false,
            message: "Failed to delete contract management data"
        })
    }
}
export { getContractManagementData, createContractManagement, updateContractManagement, getContractManagementById, deleteContractManagement, createContractManagementWithAssignment }