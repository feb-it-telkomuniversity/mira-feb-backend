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

async function getPartnershipDataQuery(page = 1, limit = 15, search = "") {
    const skip = (page - 1) * limit
    
    const whereClause = search ? {
        OR: [
            { partnerName: { contains: search, mode: "insensitive" } },
            { 
                yearIssued: isNaN(parseInt(search)) ? undefined : parseInt(search)
            }
        ]
    } : {}

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