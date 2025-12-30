import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function createManagementQuery(payload) {
    const reportYear = payload.year ? parseInt(payload.year) : new Date().getFullYear()

    return await prisma.managementReport.create({
        data: {
            indicator: payload.indicator,
            year: reportYear,
            evidenceLink: payload.evidenceLink,
            tw1: payload.tw1 ?? false,
            tw2: payload.tw2 ?? false,
            tw3: payload.tw3 ?? false,
            tw4: payload.tw4 ?? false,
        }
    })
}

async function getManagementReportListQuery(page = 1, limit = 15, search = "", year) {
    const skip = (page - 1) * limit
    const filterYear = year ? parseInt(year) : new Date().getFullYear()

    const whereClause = {
        year: filterYear,
        indicator: {
            contains: search,
            mode: 'insensitive' 
        }
    }

    const [data, totalCount] = await prisma.$transaction([
        prisma.managementReport.findMany({
            where: whereClause,
            skip: skip,
            take: limit,
            orderBy: {
                id: 'asc' 
            }
        }),
        prisma.managementReport.count({
            where: whereClause
        })
    ])

    return {
        data, 
        pagination: {
            totalItems: totalCount,
            totalPage: Math.ceil(totalCount / limit),
            currentPage: page,
            pageSize: limit,
            currentYear: filterYear
        }
    }
}

async function updateManagementReportQuery(id, payload) {
    return await prisma.managementReport.update({
        where: { id: parseInt(id) },
        data: {
            indicator: payload.indicator,
            evidenceLink: payload.evidenceLink,
            year: payload.year ? parseInt(payload.year) : undefined,
            tw1: payload.tw1,
            tw2: payload.tw2,
            tw3: payload.tw3,
            tw4: payload.tw4,
        }
    })
}

async function toggleReportStatusQuery(id, quarter, value)  {
    return await prisma.managementReport.update({
        where: { id: parseInt(id) },
        data: {
            [quarter]: value
        }
    })
}

async function deleteManagementReportQuery(reportId) {
    return await prisma.managementReport.delete({
        where: {
            id: reportId
        }
    })
}

export { createManagementQuery, getManagementReportListQuery, deleteManagementReportQuery, updateManagementReportQuery, toggleReportStatusQuery }