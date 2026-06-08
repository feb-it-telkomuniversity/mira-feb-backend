import {
    getAllSuratMasukQuery,
    getSuratMasukByIdQuery,
    createSuratMasukQuery,
    updateSuratMasukQuery,
    deleteSuratMasukQuery,
    getAllDisposisiQuery,
    createDisposisiQuery,
    updateDisposisiStatusQuery,
    deleteDisposisiQuery,
    getAllSuratKeluarQuery,
    getSuratKeluarByIdQuery,
    createSuratKeluarQuery,
    updateSuratKeluarQuery,
    deleteSuratKeluarQuery
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

// ======= START DISPOSISI =======

const getAllDisposisi = async (req, res) => {
    try {
        const { search, status } = req.query;

        const filters = {
            search: search || undefined,
            status: status || undefined
        };

        const data = await getAllDisposisiQuery(filters);

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil log disposisi",
            data: data
        });
    } catch (error) {
        console.error("Error in getAllDisposisi:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil log disposisi",
            error: error.message
        });
    }
}

const createDisposisi = async (req, res) => {
    try {
        const payload = req.body;

        // Validasi input wajib dari form disposisi
        if (!payload.suratMasukId || !payload.pemberiId || !payload.penerimaUnitId || !payload.instruksi) {
            return res.status(400).json({
                success: false,
                message: "Data disposisi tidak lengkap. Surat asal, pemberi, unit penerima, dan instruksi wajib diisi."
            });
        }

        // Validasi Enum Instruksi (Mencegah string ngasal masuk ke DB)
        const validInstruksi = ['TindakLanjuti', 'Pelajari', 'Hadiri', 'Simpan', 'DraftBalasan'];
        if (!validInstruksi.includes(payload.instruksi)) {
            return res.status(400).json({
                success: false,
                message: "Format instruksi aksi tidak valid"
            });
        }

        // Eksekusi ke Query Model
        const [newDisposisi, updatedSurat] = await createDisposisiQuery(payload);

        return res.status(201).json({
            success: true,
            message: "Surat masuk berhasil didisposisikan tugasnya",
            data: newDisposisi
        });
    } catch (error) {
        console.error("Error in createDisposisi:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal memproses disposisi surat",
            error: error.message
        });
    }
};

// ======= END DISPOSISI =======

const updateDisposisiStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['BelumDiproses', 'Diproses', 'Selesai'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status tidak valid. Gunakan salah satu: ${validStatuses.join(', ')}`
            });
        }

        const updated = await updateDisposisiStatusQuery(id, status);

        return res.status(200).json({
            success: true,
            message: `Status disposisi berhasil diubah menjadi ${status}`,
            data: updated
        });
    } catch (error) {
        console.error('Error in updateDisposisiStatus:', error);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengubah status disposisi',
            error: error.message
        });
    }
};

const deleteDisposisi = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID disposisi tidak valid'
            });
        }

        await deleteDisposisiQuery(id);

        return res.status(200).json({
            success: true,
            message: 'Log disposisi berhasil dihapus'
        });
    } catch (error) {
        console.error('Error in deleteDisposisi:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Log disposisi tidak ditemukan' });
        }
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus log disposisi',
            error: error.message
        });
    }
};


// ======= START SURAT KELUAR =======
const getAllSuratKeluar = async (req, res) => {
    try {
        const { search, status, jenisSurat } = req.query;
        const data = await getAllSuratKeluarQuery({ search, status, jenisSurat });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error getAllSuratKeluar:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getSuratKeluarById = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID tidak valid" });

        const data = await getSuratKeluarByIdQuery(id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        if (error.message === "SuratKeluarNotFound") {
            return res.status(404).json({ success: false, message: "Draft tidak ditemukan" });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
}

const createSuratKeluar = async (req, res) => {
    try {
        const payload = req.body;

        // Validasi field wajib berdasarkan schema Prisma
        if (!payload.jenisSurat || !payload.tujuanPenerima || !payload.perihal || !payload.isiUtama) {
            return res.status(400).json({
                success: false,
                message: "Jenis Surat, Tujuan Penerima, Perihal, dan Isi Utama wajib diisi"
            })
        }

        const newData = await createSuratKeluarQuery(payload);
        return res.status(201).json({ success: true, message: "Draft berhasil dibuat", data: newData });
    } catch (error) {
        console.error("Error createSuratKeluar:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updateSuratKeluar = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID tidak valid" });

        const payload = req.body;
        if (Object.keys(payload).length === 0) {
            return res.status(400).json({ success: false, message: "Tidak ada data untuk diupdate" });
        }

        const updatedData = await updateSuratKeluarQuery(id, payload);
        return res.status(200).json({ success: true, message: "Draft berhasil diupdate", data: updatedData });
    } catch (error) {
        if (error.message === "SuratKeluarNotFound") {
            return res.status(404).json({ success: false, message: "Draft tidak ditemukan" });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
}

const deleteSuratKeluar = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID tidak valid" });

        await deleteSuratKeluarQuery(id);
        return res.status(200).json({ success: true, message: "Draft berhasil dihapus" });
    } catch (error) {
        if (error.message === "SuratKeluarNotFound") {
            return res.status(404).json({ success: false, message: "Draft tidak ditemukan" });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
}

// ======= END SURAT KELUAR =======


export {
    // Surat Masuk
    getAllSuratMasuk,
    getSuratMasukById,
    createSuratMasuk,
    updateSuratMasuk,
    deleteSuratMasuk,

    // Disposisi Surat
    getAllDisposisi,
    createDisposisi,
    updateDisposisiStatus,
    deleteDisposisi,

    // Surat Keluar
    getAllSuratKeluar,
    getSuratKeluarById,
    createSuratKeluar,
    updateSuratKeluar,
    deleteSuratKeluar
}