import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function createManagementQuery(payload) {
    const reportYear = payload.year ? parseInt(payload.year) : new Date().getFullYear()

    return await prisma.managementReport.create({
        data: {
            indicator: payload.indicator,
            year: reportYear,
            evidenceLink: payload.evidenceLink,
        }
    })
}

export { createManagementQuery }