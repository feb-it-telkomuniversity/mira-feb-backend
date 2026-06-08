import prisma from "../utils/prisma.js";

async function getAllTtdLogsQuery(filters = {}) {
    const where = {};

    // 1. Search filter: Matches document number, name, submitter, or unit
    if (filters.search) {
        where.OR = [
            { nomorDokumen: { contains: filters.search, mode: 'insensitive' } },
            { namaDokumen: { contains: filters.search, mode: 'insensitive' } },
            { namaPengaju: { contains: filters.search, mode: 'insensitive' } },
            { unitAsal: { contains: filters.search, mode: 'insensitive' } }
        ];
    }

    // 2. Status filter
    if (filters.status) {
        where.status = {
            contains: filters.status,
            mode: 'insensitive'
        };
    }

    // 3. Document type filter
    if (filters.jenisDokumen) {
        where.jenisDokumen = filters.jenisDokumen;
    }

    // 4. Submitter ID filter (for filtering user's own requests)
    if (filters.userId) {
        where.userId = parseInt(filters.userId);
    }

    return await prisma.logTtdDekan.findMany({
        where: where,
        orderBy: {
            tanggalAjuan: 'desc'
        },
        include: {
            histories: {
                select: {
                    id: true,
                    actionType: true,
                    message: true,
                    createdAt: true,
                    actor: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
}

async function getTtdLogByIdQuery(id) {
    return await prisma.logTtdDekan.findUnique({
        where: { id: parseInt(id) },
        include: {
            histories: {
                include: {
                    actor: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            avatarUrl: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    unit: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
}

async function createTtdLogQuery(payload) {
    const { userId, nomorDokumen, namaDokumen, jenisDokumen, namaPengaju, unitAsal, metodeOtorisasi, berkasPendukung, catatanPengaju } = payload;

    return await prisma.logTtdDekan.create({
        data: {
            nomorDokumen,
            namaDokumen,
            jenisDokumen,
            namaPengaju,
            unitAsal,
            metodeOtorisasi,
            berkasPendukung,
            catatanPengaju,
            userId: parseInt(userId),
            status: "Menunggu TTD",
            histories: {
                create: {
                    actorId: parseInt(userId),
                    actionType: "SUBMITTED",
                    message: `Dokumen berhasil diajukan oleh ${namaPengaju} dari unit ${unitAsal}`
                }
            }
        },
        include: {
            histories: true
        }
    });
}

async function updateTtdLogQuery(id, payload) {
    const { nomorDokumen, namaDokumen, jenisDokumen, namaPengaju, unitAsal, metodeOtorisasi, berkasPendukung, catatanPengaju, actorId } = payload;

    const dataToUpdate = {};
    if (nomorDokumen !== undefined) dataToUpdate.nomorDokumen = nomorDokumen;
    if (namaDokumen !== undefined) dataToUpdate.namaDokumen = namaDokumen;
    if (jenisDokumen !== undefined) dataToUpdate.jenisDokumen = jenisDokumen;
    if (namaPengaju !== undefined) dataToUpdate.namaPengaju = namaPengaju;
    if (unitAsal !== undefined) dataToUpdate.unitAsal = unitAsal;
    if (metodeOtorisasi !== undefined) dataToUpdate.metodeOtorisasi = metodeOtorisasi;
    if (berkasPendukung !== undefined) dataToUpdate.berkasPendukung = berkasPendukung;
    if (catatanPengaju !== undefined) dataToUpdate.catatanPengaju = catatanPengaju;

    return await prisma.logTtdDekan.update({
        where: { id: parseInt(id) },
        data: {
            ...dataToUpdate,
            histories: {
                create: {
                    actorId: parseInt(actorId),
                    actionType: "UPDATED",
                    message: "Detail dokumen diperbarui oleh pengaju"
                }
            }
        },
        include: {
            histories: true
        }
    });
}

async function updateTtdLogStatusQuery(id, status, actorId, additionalData = {}) {
    const dataToUpdate = { status };
    let actionType = "UPDATED";
    let message = `Status dokumen diperbarui menjadi ${status}`;

    if (status === "Selesai TTD") {
        dataToUpdate.hashVerifier = additionalData.hashVerifier || null;
        dataToUpdate.tanggalTtd = new Date();
        actionType = "SIGNED";
        message = additionalData.message || `Dokumen telah ditandatangani secara digital oleh Dekan. Verifikator Hash: ${additionalData.hashVerifier || '-'}`;
    } else if (status === "Ditolak/Revisi") {
        dataToUpdate.catatanPenyetuju = additionalData.catatanPenyetuju || null;
        dataToUpdate.tanggalDitolak = new Date();
        actionType = "REJECTED";
        message = additionalData.catatanPenyetuju ? `Dokumen ditolak/perlu revisi dengan catatan: ${additionalData.catatanPenyetuju}` : "Dokumen ditolak/perlu revisi";
    }

    return await prisma.logTtdDekan.update({
        where: { id: parseInt(id) },
        data: {
            ...dataToUpdate,
            histories: {
                create: {
                    actorId: parseInt(actorId),
                    actionType,
                    message
                }
            }
        },
        include: {
            histories: true
        }
    });
}

async function deleteTtdLogQuery(id) {
    return await prisma.logTtdDekan.delete({
        where: { id: parseInt(id) }
    });
}

async function getTtdStatsQuery(userId = null) {
    const baseWhere = userId ? { userId: parseInt(userId) } : {};

    const [total, waiting, signed, rejected] = await Promise.all([
        prisma.logTtdDekan.count({ where: baseWhere }),
        prisma.logTtdDekan.count({
            where: {
                ...baseWhere,
                status: { contains: "Menunggu TTD", mode: 'insensitive' }
            }
        }),
        prisma.logTtdDekan.count({
            where: {
                ...baseWhere,
                status: { contains: "Selesai TTD", mode: 'insensitive' }
            }
        }),
        prisma.logTtdDekan.count({
            where: {
                ...baseWhere,
                status: { contains: "Ditolak/Revisi", mode: 'insensitive' }
            }
        })
    ]);

    return {
        total,
        waiting,
        signed,
        rejected
    };
}

export {
    getAllTtdLogsQuery,
    getTtdLogByIdQuery,
    createTtdLogQuery,
    updateTtdLogQuery,
    updateTtdLogStatusQuery,
    deleteTtdLogQuery,
    getTtdStatsQuery
};
