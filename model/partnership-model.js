import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function getPartnershipStatsQuery() {
    // 1. Chart berdasarkan Tahun Terbit
    const byYear = await prisma.partnershipDocument.groupBy({
        by: ['yearIssued'],
        _count: {
            id: true, // Hitung jumlah dokumen
        },
        orderBy: {
            yearIssued: 'asc',
        }
    });

    // 2. Chart berdasarkan Tipe Dokumen
    const byDocType = await prisma.partnershipDocument.groupBy({
        by: ['docType'],
        _count: {
            id: true,
        },
    });

    const yearStats = byYear.map(item => ({ name: item.yearIssued.toString(), total: item._count.id }));
    const docTypeStats = byDocType.map(item => ({ name: item.docType, total: item._count.id }));

    return { yearStats, docTypeStats };
}

async function getPartnershipSummaryStatsQuery() {
    const today = new Date()
    const [totalMoA, totalMoU, totalIA, activePartnerGroup] = await Promise.all([
        prisma.partnershipDocument.count({
            where: { docType: 'MoA' }
        }),
        prisma.partnershipDocument.count({
            where: { docType: 'MoU' }
        }),
        prisma.partnershipDocument.count({
            where: { docType: 'IA' }
        }),
        prisma.partnershipDocument.groupBy({
            by: ['partnerName'],
            where: {
                validUntil: {
                    gte: today // lebih besar atau sama dengan hari ini
                }
            }
        })
    ])

    return { totalMoA, totalMoU, totalIA, activePartnerGroup: activePartnerGroup.length }
}

async function getPartnershipChartQuery() {
    const yearRaw = await prisma.partnershipDocument.groupBy({
        by: ['yearIssued'],
        _count: { id: true },
        orderBy: { yearIssued: 'asc' }
    })

    const categoryRaw = await prisma.partnershipDocument.groupBy({
        by: ['partnershipType'],
        where: {
            partnershipType: { not: null }
        },
        _count: { id: true }
    })

    const scopeRaw = await prisma.partnershipDocument.groupBy({
        by: ['scope'],
        where: {
            scope: { not: null }
        },
        _count: { id: true }
    })

    // Data untuk Chart (RECHART FRIENDLY)
    const documentsByYear = yearRaw.map(item => ({
        name: item.yearIssued.toString(),
        value: item._count.id
    }))

    const documentByCategory = categoryRaw.map((item) => ({
        name: item.partnershipType,
        value: item._count.id
    }))

    const documentByScope = scopeRaw.map((item) => ({
        name: item.scope,
        value: item._count.id
    }))

    return { documentsByYear, documentByCategory, documentByScope }
}

async function getPartnershipDataQuery(page = 1, limit = 15, search = "", filters={}) {
    const skip = (page - 1) * limit

    const andConditions = []

    if (search) {
        andConditions.push({
            OR: [
                { partnerName: { contains: search, mode: "insensitive" } },
                { yearIssued: isNaN(parseInt(search)) ? undefined : parseInt(search) },
                { docNumberInternal: { contains: search, mode: "insensitive" } }
            ]
        })
    }

    if (filters.scope) {
        andConditions.push({ scope: filters.scope.toLowerCase() });
    }

    if (filters.docType) {
        andConditions.push({ docType: filters.docType });
    }

    if (filters.archive) {
        if (filters.archive === 'missing_hardcopy') {
            andConditions.push({ hasHardcopy: false });
        } else if (filters.archive === 'missing_softcopy') {
            andConditions.push({ hasSoftcopy: false });
        } else if (filters.archive === 'complete') {
            andConditions.push({ hasHardcopy: true, hasSoftcopy: true });
        }
    }

    if (filters.status) {
        const today = new Date();
        if (filters.status === 'active') {
            andConditions.push({
                OR: [{ validUntil: { gte: today } }, { validUntil: null }]
            });
        } else if (filters.status === 'expired') {
            andConditions.push({ validUntil: { lt: today } });
        } else if (filters.status === 'expiring') {
            const threeMonthsLater = new Date();
            threeMonthsLater.setMonth(today.getMonth() + 3);
            andConditions.push({ validUntil: { gte: today, lte: threeMonthsLater } });
        }
    }

    const whereClause = andConditions.length > 0 ? { AND: andConditions } : {}

    const [data, totalCount] = await prisma.$transaction([
        prisma.partnershipDocument.findMany({
            where: whereClause,
            skip: skip,     // Lewati data sebelumnya
            take: limit,    // Ambil sejumlah limit
            orderBy: {
                updatedAt: 'desc', // Urutkan dari yang terbaru diupdate
            },
        }),
        prisma.partnershipDocument.count({
            where: whereClause,
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

export { 
    getPartnershipStatsQuery, 
    getPartnershipSummaryStatsQuery, 
    getPartnershipChartQuery,
    getPartnershipDataQuery
}