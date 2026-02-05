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
            include: {
                activities: true 
            }
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

async function createPartnershipDataQuery(payload) {
    const toNull = (value) => (value === "" || value === undefined ? null : value)

    return await prisma.partnershipDocument.create({
        data: {
            partnerName: payload.partnerName,
            yearIssued: payload.yearIssued, // Sudah number dari FE
            docType: payload.docType,
            scope: payload.scope,

            picExternal: toNull(payload.picExternal),
            picExternalPhone: toNull(payload.picExternalPhone),
            picInternal: toNull(payload.picInternal),

            notes: payload.notes,
            hasHardcopy: payload.hasHardcopy,
            hasSoftcopy: payload.hasSoftcopy,
            // Hati-hati: Kolom Unique. Kalau "" dikirim double, Prisma error. Jadi harus null.
            docNumberInternal: toNull(payload.docNumberInternal), 
            docNumberExternal: toNull(payload.docNumberExternal),

            partnershipType: toNull(payload.partnershipType),

            signingType: toNull(payload.signingType),
            docLink: toNull(payload.docLink),
            duration: toNull(payload.duration),
            dateCreated: toNull(payload.dateCreated),
            dateSigned: toNull(payload.dateSigned),
            validUntil: toNull(payload.validUntil),

            activities: {
                create: (payload.activityType || []).map((type) => ({
                    type: type,
                    status: "BelumTerlaksana"
                }))
            }
        },
        include: {
            activities: true
        }
    })
}

async function updatePartnershipDataQuery(id, payload) {
    const processValue = (value) => {
        if (value === undefined) return undefined;
        if (value === "") return null;
        return value;
    }
    
    const processDate = (value) => {
        if (value === undefined) return undefined;
        if (value === "" || value === null) return null;
        return new Date(value)
    }

    // ============================================================
    // 🚨 LOGIC 1: UPDATE STATUS & NOTES (TRANSACTIONAL) 
    // Dipakai jika FE mengirim array object yang punya 'id'
    // ============================================================
    if (payload.activities && payload.activities.length > 0 && payload.activities[0].id) {
        const updatePromises = payload.activities.map(act => 
            prisma.partnershipActivity.update({
                where: { id: parseInt(act.id) }, // Cari berdasarkan ID activity
                data: {
                    status: act.status, // Update Status
                    notes: act.notes    // Update Notes
                }
            })
        );

        await prisma.$transaction(updatePromises);

        return await prisma.partnershipDocument.findUnique({
            where: { id: parseInt(id) },
            include: { activities: true }
        });
    }

    // ============================================================
    // 🚨 LOGIC 2: WIPE & REPLACE (DELETE ALL -> CREATE NEW)
    // Dipakai jika FE mengirim array string (e.g. ['JointResearch'])
    // atau object tanpa ID (Data baru dari form utama)
    // ============================================================
    let activitiesOperation = undefined;

    const incomingActivities = payload.activities || payload.activityType;

    if (incomingActivities && !incomingActivities[0]?.id) {
        const activitiesData = incomingActivities.map((item) => {
            if (typeof item === 'string') {
                return {
                    type: item,
                    status: 'BelumTerlaksana',
                    notes: null
                }
            } else {
                return {
                    type: item.type,
                    status: item.status || 'BelumTerlaksana',
                    notes: item.notes || null
                }
            }
        });

        activitiesOperation = {
            deleteMany: {},
            create: activitiesData
        };
    }

    return await prisma.partnershipDocument.update({
        where: { id: parseInt(id) },
        data: {
            yearIssued: payload.yearIssued ? parseInt(payload.yearIssued) : undefined, 
            docType: payload.docType,
            partnerName: payload.partnerName,
            scope: payload.scope,
            
            picExternal: processValue(payload.picExternal),
            picExternalPhone: processValue(payload.picExternalPhone),
            picInternal: processValue(payload.picInternal),

            docNumberInternal: processValue(payload.docNumberInternal),
            docNumberExternal: processValue(payload.docNumberExternal),

            partnershipType: processValue(payload.partnershipType),
            
            // Masukkan logic activitiesOperation disini
            // (Akan undefined jika masuk ke Logic 1, jadi aman)
            activities: activitiesOperation, 
            
            dateCreated: processDate(payload.dateCreated),
            signingType: processValue(payload.signingType),
            dateSigned: processDate(payload.dateSigned),
            validUntil: processDate(payload.validUntil),
            duration: processValue(payload.duration),

            docLink: processValue(payload.docLink),
            notes: payload.notes,
            hasHardcopy: payload.hasHardcopy,
            hasSoftcopy: payload.hasSoftcopy,

            approvalWadek2: processValue(payload.approvalWadek2),
            approvalWadek1: processValue(payload.approvalWadek1),
            approvalKabagKST: processValue(payload.approvalKabagKST),
            approvalDirSPIO: processValue(payload.approvalDirSPIO),
            approvalKaurLegal: processValue(payload.approvalKaurLegal),
            approvalKabagSekpim: processValue(payload.approvalKabagSekpim),
            approvalDirSPS: processValue(payload.approvalDirSPS),
            approvalDekan: processValue(payload.approvalDekan),
            approvalWarek1: processValue(payload.approvalWarek1),
            approvalRektor: processValue(payload.approvalRektor),
        },
        include: {
            activities: true
        }
    })
}

async function deletePartnershipDataQuery(id) {
    return await prisma.partnershipDocument.delete({
        where: { id: id }
    })
}

export { 
    getPartnershipStatsQuery, 
    getPartnershipSummaryStatsQuery, 
    getPartnershipChartQuery,
    getPartnershipDataQuery,
    createPartnershipDataQuery,
    updatePartnershipDataQuery,
    deletePartnershipDataQuery
}