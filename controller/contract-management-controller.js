import { createContractManagementQuery, getContractManagementDataQuery, getContractStatsQuery, updateContractManagementQuery } from "../model/contract-management-model.js"

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
            unit: req.query.unit || null
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

export { getContractManagementData, createContractManagement, updateContractManagement }