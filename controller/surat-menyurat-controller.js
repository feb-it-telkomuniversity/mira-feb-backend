import {
    getAllSuratMasukQuery,
    getSuratMasukByIdQuery,
    createSuratMasukQuery,
    updateSuratMasukQuery,
    deleteSuratMasukQuery
} from "../model/surat-menyurat-model.js";

// ======= START SURAT MASUK =======
const getAllSuratMasuk = async (req, res) => {
    try {
        const { search, klasifikasi, status } = req.query;

        const filters = {
            search: search || undefined,
            klasifikasi: klasifikasi || undefined,
            status: status || undefined
        };

        const data = await getAllSuratMasukQuery(filters);

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil daftar surat masuk",
            data: data
        });
    } catch (error) {
        console.error("Error in getAllSuratMasuk:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data surat masuk",
            error: error.message
        })
    }
}

const getSuratMasukById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID Surat Masuk tidak valid"
            })
        }

        const data = await getSuratMasukByIdQuery(id);

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail surat masuk",
            data: data
        });
    } catch (error) {
        console.error("Error in getSuratMasukById:", error)

        if (error.message === "SuratMasukNotFound") {
            return res.status(404).json({
                success: false,
                message: "Data surat masuk tidak ditemukan"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}

const createSuratMasuk = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload.nomorSuratAsal || !payload.instansiPengirim || !payload.tanggalSurat || !payload.tanggalDiterima || !payload.perihal || !payload.ringkasan) {
            return res.status(400).json({
                success: false,
                message: "Semua form wajib (Nomor, Instansi, Tanggal, Perihal, Ringkasan) harus diisi"
            });
        }

        const newData = await createSuratMasukQuery(payload);

        return res.status(201).json({
            success: true,
            message: "Berhasil meregistrasi Surat Masuk baru",
            data: newData
        });
    } catch (error) {
        console.error("Error in createSuratMasuk:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal menyimpan surat masuk",
            error: error.message
        });
    }
}

const updateSuratMasuk = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID Surat Masuk tidak valid"
            });
        }

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Tidak ada data yang dikirim untuk diupdate"
            });
        }

        const updatedData = await updateSuratMasukQuery(id, payload);

        return res.status(200).json({
            success: true,
            message: "Berhasil mengupdate data Surat Masuk",
            data: updatedData
        });
    } catch (error) {
        console.error("Error in updateSuratMasuk:", error);

        if (error.message === "SuratMasukNotFound") {
            return res.status(404).json({
                success: false,
                message: "Data surat masuk yang akan diedit tidak ditemukan"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Gagal mengupdate data",
            error: error.message
        });
    }
}

async function deleteSuratMasuk(req, res) {
    try {
        const { id } = req.params
        if (!id) return res.status(400).json({ success: false, message: "ID wajib diisi" })

        await deleteSuratMasukQuery(id)

        return res.status(200).json({
            success: true,
            message: "Berhasil menghapus data Surat Masuk"
        })
    } catch (error) {
        if (error.message === "SuratMasukNotFound") {
            return res.status(404).json({
                success: false,
                message: "Data surat masuk yang akan dihapus tidak ditemukan"
            });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Surat Masuk tidak ditemukan" });
        }

        return res.status(500).json({
            success: false,
            message: "Gagal menghapus data",
            error: error.message
        })
    }
}

// ======= END SURAT MASUK =======

// ======= START SURAT KELUAR =======

// ======= END SURAT KELUAR =======


export {
    getAllSuratMasuk,
    getSuratMasukById,
    createSuratMasuk,
    updateSuratMasuk,
    deleteSuratMasuk
}