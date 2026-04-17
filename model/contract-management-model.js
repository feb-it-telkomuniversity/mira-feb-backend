import { PrismaClient } from "@prisma/client";
import { calculateKM } from "../utils/contract-management-calculator.js";
const prisma = new PrismaClient()

// Helper untuk menentukan TW sebelumnya
const getPrevQuarter = (current) => {
    const map = { "TW-1": "TW-4", "TW-2": "TW-1", "TW-3": "TW-2", "TW-4": "TW-3" };
    return map[current] || null; // Jika TW-1, idealnya cek tahun sebelumnya, tapi utk simpel kita return TW-4
};

export const getContractStatsQuery = async (currentQuarter, year) => {
    const prevQuarter = getPrevQuarter(currentQuarter);

    const currentYearStart = new Date(`${year}-01-01`);
    const currentYearEnd = new Date(`${year}-12-31`);

    const whereCurrent = {
        quarterly: currentQuarter,
        createdAt: { gte: currentYearStart, lte: currentYearEnd }
    };

    const wherePrev = {
        quarterly: prevQuarter,
        createdAt: { gte: currentYearStart, lte: currentYearEnd } // Note: Logic ini perlu disesuaikan jika TW-1 bandingannya TW-4 tahun lalu
    };

    // --- 1. Fetch Data Saat Ini ---
    const [
        currCount,
        currAvgAchivement,
        currTargetMet,
        currTotalValue
    ] = await prisma.$transaction([
        prisma.contractManagement.count({ where: whereCurrent }),

        prisma.contractAssignment.aggregate({
            _avg: { achievement: true },
            where: { contract: whereCurrent }
        }),

        // Target Tercapai (Achievement >= 100)
        prisma.contractAssignment.count({
            where: { contract: whereCurrent, achievement: { gte: 100 } }
        }),

        // Total Nilai
        prisma.contractAssignment.aggregate({
            _sum: { value: true },
            where: { contract: whereCurrent }
        })
    ]);

    // --- 2. Fetch Data Sebelumnya (Untuk Trend) ---
    // Jika prevQuarter null (misal data awal tahun), kita anggap 0
    let prevStats = { count: 0, avgAch: 0, targetMet: 0, totalVal: 0 };

    if (prevQuarter) {
        const [prevCount, prevAvg, prevMet, prevSum] = await prisma.$transaction([
            prisma.contractManagement.count({ where: wherePrev }),
            prisma.contractAssignment.aggregate({ _avg: { achievement: true }, where: { contract: wherePrev } }),
            prisma.contractAssignment.count({ where: { contract: wherePrev, achievement: { gte: 100 } } }),
            prisma.contractAssignment.aggregate({ _sum: { value: true }, where: { contract: wherePrev } })
        ]);

        prevStats = {
            count: prevCount,
            avgAch: Number(prevAvg?._avg?.achievement) || 0,
            targetMet: prevMet,
            totalVal: Number(prevSum?._sum?.value) || 0
        };
    }

    // --- 3. Hitung Diff & Format ---
    // Helper format trend
    const calcTrend = (curr, prev) => {
        const diff = curr - prev;
        return {
            value: curr, // Nilai asli
            change: diff, // Selisih (+/-)
            trend: diff >= 0 ? "up" : "down",
            formattedChange: diff >= 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}` // String tampilan
        };
    };

    const currValues = {
        count: currCount,
        avgAch: Number(currAvgAchivement?._avg?.achievement) || 0,
        targetMet: currTargetMet,
        totalVal: Number(currTotalValue?._sum?.value) || 0
    };

    return {
        totalResponsibility: calcTrend(currValues.count, prevStats.count),
        avgAchievement: calcTrend(currValues.avgAch, prevStats.avgAch),
        targetAchieved: calcTrend(currValues.targetMet, prevStats.targetMet),
        totalValue: calcTrend(currValues.totalVal, prevStats.totalVal)
    };
};

async function getContractManagementDataQuery(page = 1, limit = 15, search = "", filters = {}) {
    const skip = (page - 1) * limit
    const andConditions = []

    // 1. Search berdasarkan Nama KPI ATAU Nama Unit yang di-assign
    if (search) {
        andConditions.push({
            OR: [
                { responsibility: { contains: search, mode: "insensitive" } },
                {
                    assignments: {
                        some: { unit: { name: { contains: search, mode: "insensitive" } } }
                    }
                }
            ]
        })
    }

    if (filters.category) {
        andConditions.push({ ContractManagementCategory: filters.category });
    }

    if (filters.quarterly) {
        andConditions.push({ quarterly: filters.quarterly })
    }

    // 2. Filter spesifik berdasarkan ID Unit
    if (filters.unitId) {
        andConditions.push({
            assignments: { some: { unitId: filters.unitId } }
        })
    }

    const whereClause = andConditions.length > 0 ? { AND: andConditions } : {}

    const [data, totalCount] = await prisma.$transaction([
        prisma.contractManagement.findMany({
            where: whereClause,
            skip: skip,
            take: limit,
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                ContractManagementCategory: true,
                responsibility: true,
                quarterly: true,
                unitOfMeasurement: true,
                weight: true,
                target: true,
                assignments: {
                    select: {
                        unit: {
                            select: {
                                id: true,
                                name: true,
                                category: true // Penting untuk Frontend misahin kolom Prodi, KK, Kaur
                            }
                        }
                    }
                }
            }
        }),
        prisma.contractManagement.count({ where: whereClause })
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

async function getContractManagementByIdQuery(id) {
    return await prisma.contractManagement.findUnique({
        where: { id: parseInt(id) }
    })
}

async function createContractManagementQuery(data) {
    const { unitIds, ...contractData } = payload

    const {
        weight,
        target,
        realization,
        min,
        max,
    } = data;

    const calculated = calculateKM({
        responsibility: data.responsibility,
        weight,
        target,
        realization,
        min,
        max,
    });

    return prisma.contractManagement.create({
        data: {
            ...data,
            ...calculated,
        },
    });
}

async function createContractManagementQueryWithAssignment(payload) {
    const { unitIds, ...contractData } = payload;

    return await prisma.contractManagement.create({
        data: {
            ...contractData,

            // Bikin baris kosong di ContractAssignment untuk setiap Prodi/Unit yang ditugaskan
            assignments: {
                create: Array.isArray(unitIds)
                    ? unitIds.map(id => ({ unitId: id }))
                    : []
            }
        },
        include: {
            assignments: {
                select: {
                    unit: {
                        select: { name: true, category: true }
                    }
                }
            }
        }
    });
}

async function updateContractManagementQuery(id, payload) {
    const fetchData = await prisma.contractManagement.findUnique({
        where: { id: parseInt(id) }
    })

    if (!fetchData) {
        throw new Error("RecordNotFound")
    }

    const mergedData = {
        responsibility: payload.responsibility !== undefined ? payload.responsibility : fetchData.responsibility,
        weight: payload.weight !== undefined ? payload.weight : fetchData.weight,
        target: payload.target !== undefined ? payload.target : fetchData.target,
        realization: payload.realization !== undefined ? payload.realization : fetchData.realization,
        min: payload.min !== undefined ? payload.min : fetchData.min,
        max: payload.max !== undefined ? payload.max : fetchData.max,
    }
    const calculateData = calculateKM(mergedData)

    return await prisma.contractManagement.update({
        where: { id: parseInt(id) },
        data: {
            responsibility: payload.responsibility,
            quarterly: payload.quarterly,
            unit: payload.unit,

            weight: mergedData.weight,
            target: mergedData.target,
            realization: mergedData.realization,
            min: mergedData.min,
            max: mergedData.max,
            Input: payload.Input,
            Monitor: payload.Monitor,

            achievement: calculateData.achievement,
            persReal: calculateData.persReal,
            value: calculateData.value
        }
    })
}

async function deleteContractManagementQuery(id) {
    return await prisma.contractManagement.delete({
        where: { id: parseInt(id) }
    })
}

export { getContractManagementDataQuery, createContractManagementQuery, updateContractManagementQuery, getContractManagementByIdQuery, deleteContractManagementQuery, createContractManagementQueryWithAssignment }
