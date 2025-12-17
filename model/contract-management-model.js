import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function getContractManagementDataQuery(page = 1, limit = 15, search = "", filters={}) {
    const skip = (page - 1) * limit

    const andConditions = []

    if (search) {
        andConditions.push({
            OR: [
                { responsibility: { contains: search, mode: "insensitive" } },
                { unit: { contains: search, mode: "insensitive" } },
            ]
        })
    }

    if (filters.category) {
        andConditions.push({ ContractManagementCategory: filters.category });
    }

    if (filters.quarterly) {
        andConditions.push({ quarterly: filters.quarterly })
    }

    if (filters.unit) {
        andConditions.push({
            OR: [
                { unit: filters.unit },
                { unit: null }
            ]
        })
    }

    const whereClause = andConditions.length > 0 ? { AND: andConditions } : {}

    const [data, totalCount] = await prisma.$transaction([
        prisma.contractManagement.findMany({
            where: whereClause,
            skip: skip,
            take: limit,
            orderBy: {
                updatedAt: 'desc'
            }
        }),
        prisma.contractManagement.count({
            where: whereClause
        })
    ])

    return {
        data,
        pagination: {
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            pageSize: limit
        }
    }
}

export { getContractManagementDataQuery }
