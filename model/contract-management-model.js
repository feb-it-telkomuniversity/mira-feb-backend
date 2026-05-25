import { calculateKM } from "../utils/contract-management-calculator.js";
import prisma from "../utils/prisma.js";

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
        createdAt: { gte: currentYearStart, lte: currentYearEnd }
    }

    const wherePrev = {
        createdAt: { gte: currentYearStart, lte: currentYearEnd }
    };

    const twNum = currentQuarter.replace('TW-', '');
    const prevTwNum = prevQuarter ? prevQuarter.replace('TW-', '') : null;

    const avgField = {};
    avgField[`achievementTw${twNum}`] = true;

    const sumField = {};
    sumField[`valueTw${twNum}`] = true;

    // --- 1. Fetch Data Saat Ini ---
    const [
        currCount,
        currAvgAchivement,
        currTargetMet,
        currTotalValue
    ] = await prisma.$transaction([
        prisma.contractManagement.count({ where: whereCurrent }),

        prisma.contractAssignment.aggregate({
            _avg: avgField,
            where: { contract: whereCurrent }
        }),

        // Target Tercapai (Achievement >= 100)
        prisma.contractAssignment.count({
            where: { contract: whereCurrent, [`achievementTw${twNum}`]: { gte: 100 } }
        }),

        // Total Nilai
        prisma.contractAssignment.aggregate({
            _sum: sumField,
            where: { contract: whereCurrent }
        })
    ]);

    // --- 2. Fetch Data Sebelumnya (Untuk Trend) ---
    // Jika prevQuarter null (misal data awal tahun), kita anggap 0
    let prevStats = { count: 0, avgAch: 0, targetMet: 0, totalVal: 0 };

    if (prevQuarter && prevTwNum) {
        const prevAvgField = {};
        prevAvgField[`achievementTw${prevTwNum}`] = true;
        const prevSumField = {};
        prevSumField[`valueTw${prevTwNum}`] = true;

        const [prevCount, prevAvg, prevMet, prevSum] = await prisma.$transaction([
            prisma.contractManagement.count({ where: wherePrev }),
            prisma.contractAssignment.aggregate({ _avg: prevAvgField, where: { contract: wherePrev } }),
            prisma.contractAssignment.count({ where: { contract: wherePrev, [`achievementTw${prevTwNum}`]: { gte: 100 } } }),
            prisma.contractAssignment.aggregate({ _sum: prevSumField, where: { contract: wherePrev } })
        ])

        prevStats = {
            count: prevCount,
            avgAch: Number(prevAvg?._avg[`achievementTw${prevTwNum}`]) || 0,
            targetMet: prevMet,
            totalVal: Number(prevSum?._sum[`valueTw${prevTwNum}`]) || 0
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
        avgAch: Number(currAvgAchivement?._avg[`achievementTw${twNum}`]) || 0,
        targetMet: currTargetMet,
        totalVal: Number(currTotalValue?._sum[`valueTw${twNum}`]) || 0
    };

    const currentYearStr = year.toString();
    const prevYearStr = (parseInt(year) - 1).toString();

    const [currentAgg, prevAgg] = await Promise.all([
        prisma.contractManagement.aggregate({
            _sum: {
                valueTw1: true,
                valueTw2: true,
                valueTw3: true,
                valueTw4: true
            },
            where: { year: currentYearStr }
        }),
        prisma.contractManagement.aggregate({
            _sum: { valueTw4: true },
            where: { year: prevYearStr }
        })
    ]);

    const valTw1 = Number(currentAgg._sum.valueTw1) || 0;
    const valTw2 = Number(currentAgg._sum.valueTw2) || 0;
    const valTw3 = Number(currentAgg._sum.valueTw3) || 0;
    const valTw4 = Number(currentAgg._sum.valueTw4) || 0;
    const valPrevTw4 = Number(prevAgg._sum.valueTw4) || 0;

    return {
        totalResponsibility: calcTrend(currValues.count, prevStats.count),
        avgAchievement: calcTrend(currValues.avgAch, prevStats.avgAch),
        targetAchieved: calcTrend(currValues.targetMet, prevStats.targetMet),
        totalValue: calcTrend(currValues.totalVal, prevStats.totalVal),
        valuePerTw: {
            tw1: calcTrend(valTw1, valPrevTw4),
            tw2: calcTrend(valTw2, valTw1),
            tw3: calcTrend(valTw3, valTw2),
            tw4: calcTrend(valTw4, valTw3)
        }
    };
}

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
            orderBy: { order: 'asc' },
            select: {
                id: true,
                order: true,
                ContractManagementCategory: true,
                subCategory: true,
                responsibility: true,
                unitOfMeasurement: true,
                targetTw1: true, targetTw2: true, targetTw3: true, targetTw4: true,
                weightTw1: true, weightTw2: true, weightTw3: true, weightTw4: true,
                realizationTw1: true, realizationTw2: true, realizationTw3: true, realizationTw4: true,
                achievementTw1: true, achievementTw2: true, achievementTw3: true, achievementTw4: true,
                definition: true,
                objective: true,
                indicatorCalc: true,
                assignments: {
                    where: filters.unitId ? { unitId: filters.unitId } : undefined,
                    select: {
                        id: true,
                        unitId: true,
                        realizationTw1: true, realizationTw2: true, realizationTw3: true, realizationTw4: true,
                        achievementTw1: true, achievementTw2: true, achievementTw3: true, achievementTw4: true,
                        persRealTw1: true, persRealTw2: true, persRealTw3: true, persRealTw4: true,
                        valueTw1: true, valueTw2: true, valueTw3: true, valueTw4: true,
                        inputNote: true,
                        monitorNote: true,
                        unit: {
                            select: {
                                name: true,
                                category: true
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
        where: { id: parseInt(id) },
        include: {
            assignments: {
                select: {
                    id: true,
                    unitId: true,
                    unit: { select: { name: true } }
                }
            }
        }
    })
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
    const { unitIds, ...updateData } = payload;

    // 1. Tarik data lama
    const existingData = await prisma.contractManagement.findUnique({
        where: { id: parseInt(id) },
        include: { assignments: true }
    });

    if (!existingData) {
        throw new Error("RecordNotFound");
    }

    const updatedContractData = { ...existingData, ...updateData };
    const quarters = [1, 2, 3, 4];

    // ======================================================
    // 2. Hitung Otomatis Capaian (Achievement) FAKULTAS (Master)
    // ======================================================
    quarters.forEach(q => {
        const currentRealization = updateData[`realizationTw${q}`] !== undefined
            ? updateData[`realizationTw${q}`]
            : existingData[`realizationTw${q}`];

        if (currentRealization !== null && currentRealization !== undefined) {
            const calcMasterData = {
                responsibility: updatedContractData.responsibility,
                weight: updatedContractData[`weightTw${q}`],
                target: updatedContractData[`targetTw${q}`],
                realization: currentRealization,
                min: updatedContractData[`minTw${q}`],
                max: updatedContractData[`maxTw${q}`]
            };

            const resultMasterKM = calculateKM(calcMasterData)
            updateData[`achievementTw${q}`] = resultMasterKM.achievement
            updateData[`persRealTw${q}`] = resultMasterKM.persReal
            updateData[`valueTw${q}`] = resultMasterKM.value

        } else if (updateData[`realizationTw${q}`] === null) {
            updateData[`achievementTw${q}`] = null;
        }
    });

    // ======================================================
    // 3. Inisialisasi Transaksi Database (Simpan data Fakultas)
    // ======================================================
    const prismaOperations = [
        prisma.contractManagement.update({
            where: { id: parseInt(id) },
            data: updateData
        })
    ];

    // ======================================================
    // 4. Sinkronisasi Unit
    // ======================================================
    if (Array.isArray(unitIds)) {
        const currentUnitIds = existingData.assignments.map(a => a.unitId);
        const unitsToAdd = unitIds.filter(id => !currentUnitIds.includes(id));
        const unitsToRemove = currentUnitIds.filter(id => !unitIds.includes(id));

        if (unitsToRemove.length > 0) {
            prismaOperations.push(prisma.contractAssignment.deleteMany({
                where: { contractId: parseInt(id), unitId: { in: unitsToRemove } }
            }));
        }

        if (unitsToAdd.length > 0) {
            prismaOperations.push(prisma.contractAssignment.createMany({
                data: unitsToAdd.map(newUnitId => ({
                    contractId: parseInt(id),
                    unitId: parseInt(newUnitId)
                }))
            }));
        }
    }

    // ======================================================
    // 5. Rekalkulasi Capaian UNIT (Jika Target/Bobot Berubah)
    // ======================================================
    existingData.assignments.forEach(assignment => {
        const assignmentUpdateData = {};
        let shouldUpdate = false;

        quarters.forEach(q => {
            if (assignment[`realizationTw${q}`] !== null && assignment[`realizationTw${q}`] !== undefined) {
                const calcData = {
                    responsibility: updatedContractData.responsibility,
                    weight: updatedContractData[`weightTw${q}`],
                    target: updatedContractData[`targetTw${q}`],
                    realization: assignment[`realizationTw${q}`],
                    min: updatedContractData[`minTw${q}`],
                    max: updatedContractData[`maxTw${q}`]
                };

                const resultKM = calculateKM(calcData);

                assignmentUpdateData[`achievementTw${q}`] = resultKM.achievement;
                assignmentUpdateData[`persRealTw${q}`] = resultKM.persReal;
                assignmentUpdateData[`valueTw${q}`] = resultKM.value;
                shouldUpdate = true;
            }
        });

        if (shouldUpdate) {
            const isRemoved = Array.isArray(unitIds) && !unitIds.includes(assignment.unitId);
            if (!isRemoved) {
                prismaOperations.push(prisma.contractAssignment.update({
                    where: { id: assignment.id },
                    data: assignmentUpdateData
                }));
            }
        }
    });

    // 6. Eksekusi semua secara bersamaan!
    await prisma.$transaction(prismaOperations);
    return await getContractManagementByIdQuery(id);
}

async function deleteContractManagementQuery(id) {
    return await prisma.contractManagement.delete({
        where: { id: parseInt(id) }
    })
}

async function updateAssignementQuery(assignmentId, updateData) {
    const assignment = await prisma.contractAssignment.findUnique({
        where: { id: parseInt(assignmentId) },
        include: { contract: true }
    });

    if (!assignment) {
        throw new Error('AssignmentNotFound');
    }

    const dataToUpdate = {};

    const quarters = [1, 2, 3, 4];
    quarters.forEach(q => {
        const realizationVal = updateData[`realizationTw${q}`];
        if (realizationVal !== undefined && realizationVal !== null && realizationVal !== "") {
            const calcData = {
                responsibility: assignment.contract.responsibility,
                weight: assignment.contract[`weightTw${q}`],
                target: assignment.contract[`targetTw${q}`],
                realization: realizationVal,
                min: assignment.contract[`minTw${q}`],
                max: assignment.contract[`maxTw${q}`]
            };

            const resultKM = calculateKM(calcData);

            dataToUpdate[`realizationTw${q}`] = parseFloat(realizationVal);
            dataToUpdate[`achievementTw${q}`] = resultKM.achievement;
            dataToUpdate[`persRealTw${q}`] = resultKM.persReal;
            dataToUpdate[`valueTw${q}`] = resultKM.value;
        } else if (realizationVal === null || realizationVal === "") {
            dataToUpdate[`realizationTw${q}`] = null;
            dataToUpdate[`achievementTw${q}`] = null;
            dataToUpdate[`persRealTw${q}`] = null;
            dataToUpdate[`valueTw${q}`] = null;
        }
    });

    if (updateData.inputNote !== undefined) {
        dataToUpdate.inputNote = updateData.inputNote;
    }

    return await prisma.contractAssignment.update({
        where: { id: parseInt(assignmentId) },
        data: dataToUpdate
    });
}


export {
    getContractManagementDataQuery,
    updateContractManagementQuery,
    getContractManagementByIdQuery,
    deleteContractManagementQuery,
    createContractManagementQueryWithAssignment,
    updateAssignementQuery,
}
