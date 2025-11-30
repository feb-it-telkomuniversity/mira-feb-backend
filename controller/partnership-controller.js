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

export { getPartnershipStats, getPartnershipSummaryStats, getPartnershipCharts, getPartnershipData }