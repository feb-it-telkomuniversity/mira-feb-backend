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

// START DISPOSISI SURAT
async function getAllDisposisiQuery(filters = {}) {
    const where = {};

    if (filters.search) {
        where.suratMasuk = {
            OR: [
                { nomorSuratAsal: { contains: filters.search, mode: 'insensitive' } },
                { perihal: { contains: filters.search, mode: 'insensitive' } }
            ]
        };
    }

    if (filters.status) {
        where.status = filters.status;
    }

    return await prisma.disposisiSurat.findMany({
        where: where,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            suratMasuk: {
                select: {
                    nomorSuratAsal: true,
                    perihal: true
                }
            },
            pemberi: { select: { name: true } },
            penerimaUnit: { select: { name: true } }
        }
    });
}

async function createDisposisiQuery(payload) {
    const { suratMasukId, pemberiId, penerimaUnitId, instruksi, batasWaktu, catatan } = payload;

    return await prisma.$transaction([
        // Langkah A: Insert ke tabel disposisi_surat
        prisma.disposisiSurat.create({
            data: {
                suratMasukId: parseInt(suratMasukId),
                pemberiId: parseInt(pemberiId),
                penerimaUnitId: parseInt(penerimaUnitId),
                instruksi: instruksi,
                batasWaktu: batasWaktu ? new Date(batasWaktu) : null,
                catatan: catatan || null,
                status: 'BelumDiproses'
            }
        }),

        // Langkah B: Update status di tabel surat_masuk induknya
        prisma.suratMasuk.update({
            where: { id: parseInt(suratMasukId) },
            data: { status: 'BelumDiproses' }
        })
    ]);
}

async function updateDisposisiStatusQuery(id, status) {
    return await prisma.disposisiSurat.update({
        where: { id: parseInt(id) },
        data: { status }
    });
}

async function deleteDisposisiQuery(id) {
    return await prisma.disposisiSurat.delete({
        where: { id: parseInt(id) }
    });
}

// END DISPOSISI SURAT

// ======= START SURAT KELUAR =======
async function getAllSuratKeluarQuery(filters = {}) {
    const where = {};

    if (filters.search) {
        where.OR = [
            { nomorSurat: { contains: filters.search, mode: 'insensitive' } },
            { tujuanPenerima: { contains: filters.search, mode: 'insensitive' } },
            { perihal: { contains: filters.search, mode: 'insensitive' } }
        ];
    }

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.jenisSurat) {
        where.jenisSurat = filters.jenisSurat;
    }

    return await prisma.suratKeluar.findMany({
        where: where,
        orderBy: {
            updatedAt: 'desc'
        }
    });
}

async function getSuratKeluarByIdQuery(id) {
    const data = await prisma.suratKeluar.findUnique({
        where: { id: parseInt(id) }
    });

    if (!data) throw new Error("SuratKeluarNotFound");
    return data;
}

async function createSuratKeluarQuery(payload) {
    const dataToInsert = {
        nomorSurat: 'ST-089/FEB-TelU/WADEK1/V/2026',
        jenisSurat: payload.jenisSurat,
        tujuanPenerima: payload.tujuanPenerima,
        perihal: payload.perihal,
        isiUtama: payload.isiUtama,
        kerahasiaan: payload.kerahasiaan || 'Normal',
        tanggalSurat: payload.tanggalSurat ? new Date(payload.tanggalSurat) : null,

        // Field ornamen Canvas PDF (opsional saat awal create)
        salamPembuka: payload.salamPembuka || null,
        paragrafPembuka: payload.paragrafPembuka || null,
        paragrafPenutup: payload.paragrafPenutup || null,
        namaPenandatangan: payload.namaPenandatangan || null,
        jabatanPenandatangan: payload.jabatanPenandatangan || null,

        status: 'Draft'
    }

    return await prisma.suratKeluar.create({
        data: dataToInsert
    })
}

async function updateSuratKeluarQuery(id, payload) {
    const existingData = await prisma.suratKeluar.findUnique({
        where: { id: parseInt(id) }
    })
    if (!existingData) throw new Error("SuratKeluarNotFound");

    const dataToUpdate = { ...payload };
    // Format ulang tanggal jika user mengirimkan perubahan tanggal
    if (payload.tanggalSurat) {
        dataToUpdate.tanggalSurat = new Date(payload.tanggalSurat);
    }
    return await prisma.suratKeluar.update({
        where: { id: parseInt(id) },
        data: dataToUpdate
    });
}

async function deleteSuratKeluarQuery(id) {
    const existingData = await prisma.suratKeluar.findUnique({
        where: { id: parseInt(id) }
    });
    if (!existingData) throw new Error("SuratKeluarNotFound");

    return await prisma.suratKeluar.delete({
        where: { id: parseInt(id) }
    });
}


// ======= END SURAT KELUAR =======

export {
    // Surat Masuk
    getAllSuratMasukQuery,
    getSuratMasukByIdQuery,
    createSuratMasukQuery,
    updateSuratMasukQuery,
    deleteSuratMasukQuery,

    // Disposisi Surat
    getAllDisposisiQuery,
    createDisposisiQuery,
    updateDisposisiStatusQuery,
    deleteDisposisiQuery,

    // Surat Keluar
    getAllSuratKeluarQuery,
    getSuratKeluarByIdQuery,
    createSuratKeluarQuery,
    updateSuratKeluarQuery,
    deleteSuratKeluarQuery
}