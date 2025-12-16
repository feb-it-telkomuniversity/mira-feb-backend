import { getContractManagementDataQuery } from "../model/contract-management-model.js"

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

export { getContractManagementData }