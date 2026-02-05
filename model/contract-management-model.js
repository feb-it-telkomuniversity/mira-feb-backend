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

        prisma.contractManagement.aggregate({
            _avg: { achievement: true },
            where: whereCurrent
        }),

        // Target Tercapai (Achievement >= 100)
        prisma.contractManagement.count({
            where: { ...whereCurrent, achievement: { gte: 100 } }
        }),

        // Total Nilai
        prisma.contractManagement.aggregate({
            _sum: { value: true },
            where: whereCurrent
        })
    ]);

    // --- 2. Fetch Data Sebelumnya (Untuk Trend) ---
    // Jika prevQuarter null (misal data awal tahun), kita anggap 0
    let prevStats = { count: 0, avgAch: 0, targetMet: 0, totalVal: 0 };

    if (prevQuarter) {
        const [prevCount, prevAvg, prevMet, prevSum] = await prisma.$transaction([
            prisma.contractManagement.count({ where: wherePrev }),
            prisma.contractManagement.aggregate({ _avg: { achievement: true }, where: wherePrev }),
            prisma.contractManagement.count({ where: { ...wherePrev, achievement: { gte: 100 } } }),
            prisma.contractManagement.aggregate({ _sum: { value: true }, where: wherePrev })
        ]);

        prevStats = {
            count: prevCount,
            avgAch: Number(prevAvg._avg.achievement) || 0,
            targetMet: prevMet,
            totalVal: Number(prevSum._sum.value) || 0
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
        avgAch: Number(currAvgAchivement._avg.achievement) || 0,
        targetMet: currTargetMet,
        totalVal: Number(currTotalValue._sum.value) || 0
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

async function getContractManagementByIdQuery(id) {
    return await prisma.contractManagement.findUnique({
        where: { id: parseInt(id) }
    })
}

async function createContractManagementQuery(data) {
    const {
        weight,
        target,
        realization,
        min,
        max,
    } = data;

    const calculated = calculateKM({
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

async function updateContractManagementQuery(id, payload) {
    const fetchData = await prisma.contractManagement.findUnique({
        where: { id: parseInt(id) }
    })

    if (!fetchData) {
        throw new Error("RecordNotFound")
    }

    const mergedData = {
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

export { getContractManagementDataQuery, createContractManagementQuery, updateContractManagementQuery, getContractManagementByIdQuery, deleteContractManagementQuery }
