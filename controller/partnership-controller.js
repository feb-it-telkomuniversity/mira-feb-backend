import { getPartnershipChartQuery, getPartnershipDataQuery, getPartnershipStatsQuery, getPartnershipSummaryStatsQuery } from "../model/partnership-model.js";

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
            message: "Successfully fetch chart date partnership",
            data: chartData
        });
    } catch (error) {
        console.error("Error fetching partnership charts:", error);
        res.status(500).json({ message: "Internal server error when fetching partnership data" });
    }
}

async function getPartnershipData(req, res) {
    try {
        const partnershipData = await getPartnershipDataQuery()
        res.status(200).json({
            success: true,
            message: "Successfully fetch partnership data",
            data: partnershipData
        })
    } catch (error) {
        console.error("Error fetching partnership data:", error);
        res.status(500).json({ message: "Internal server error when fetching partnership data" })        
    }
}

export { getPartnershipStats, getPartnershipSummaryStats, getPartnershipCharts, getPartnershipData }