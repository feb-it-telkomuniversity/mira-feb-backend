import prisma from "../utils/prisma.js";

// ======= START SURAT MASUK =======

async function getAllSuratMasukQuery(filters = {}) {
    const where = {};

    // 1. Fitur Global Search (Nyari by Nomor, Pengirim, atau Perihal)
    if (filters.search) {
        where.OR = [
            { nomorSuratAsal: { contains: filters.search, mode: 'insensitive' } },
            { instansiPengirim: { contains: filters.search, mode: 'insensitive' } },
            { perihal: { contains: filters.search, mode: 'insensitive' } }
        ];
    }

    // 2. Filter by Klasifikasi (opsional jika FE ngirim)
    if (filters.klasifikasi) {
        where.kerahasiaan = filters.klasifikasi;
    }

    // 3. Filter by Status (opsional)
    if (filters.status) {
        where.status = {
            contains: filters.status,
            mode: 'insensitive'
        };
    }

    return await prisma.suratMasuk.findMany({
        where: where,
        orderBy: {
            tanggalDiterima: 'desc'
        },
        include: {
            disposisi: {
                select: {
                    id: true,
                    status: true,
                    penerimaUnitId: true
                }
            }
        }
    });
}

async function getSuratMasukByIdQuery(id) {
    const data = await prisma.suratMasuk.findUnique({
        where: { id: parseInt(id) },
        include: {
            disposisi: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!data) {
        throw new Error("SuratMasukNotFound");
    }

    return data;
}

async function createSuratMasukQuery(payload) {
    const dataToInsert = {
        nomorSuratAsal: payload.nomorSuratAsal,
        instansiPengirim: payload.instansiPengirim,
        tanggalSurat: new Date(payload.tanggalSurat),
        tanggalDiterima: new Date(payload.tanggalDiterima),
        kerahasiaan: payload.kerahasiaan || 'Normal',
        retensi: payload.retensi || 'SatuTahun',
        perihal: payload.perihal,
        ringkasan: payload.ringkasan,
        linkPdf: payload.linkPdf || null,
        status: 'Diterima'
    };

    return await prisma.suratMasuk.create({
        data: dataToInsert
    });
}

async function updateSuratMasukQuery(id, payload) {
    const existingData = await prisma.suratMasuk.findUnique({
        where: { id: parseInt(id) }
    });

    if (!existingData) {
        throw new Error("SuratMasukNotFound");
    }

    const dataToUpdate = { ...payload };

    if (payload.tanggalSurat) {
        dataToUpdate.tanggalSurat = new Date(payload.tanggalSurat);
    }
    if (payload.tanggalDiterima) {
        dataToUpdate.tanggalDiterima = new Date(payload.tanggalDiterima);
    }

    return await prisma.suratMasuk.update({
        where: { id: parseInt(id) },
        data: dataToUpdate
    })
}

async function deleteSuratMasukQuery(id) {
    return await prisma.suratMasuk.delete({
        where: { id: parseInt(id) }
    })
}

// ======= END SURAT MASUK =======

// ======= START SURAT KELUAR =======




// ======= END SURAT KELUAR =======

export {
    getAllSuratMasukQuery,
    getSuratMasukByIdQuery,
    createSuratMasukQuery,
    updateSuratMasukQuery,
    deleteSuratMasukQuery
}