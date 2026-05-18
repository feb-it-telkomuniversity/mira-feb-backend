const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
    console.log("🚀 Memulai proses pengurutan data...");

    const orderMapping = [
        { responsibility: "Operating Ratio Fakultas", order: 1 },
        { responsibility: "Operating Ratio & Cash Collection Telkom University (Common Indikator)", order: 2 },
        { responsibility: "Kepuasan Mahasiswa (EDOM)", order: 3 },
        { responsibility: "Customer Satisfaction Index", order: 4 },

        // B. Internal Business Process
        { responsibility: "Pemenuhan kuota Maba sesuai SK YPT", order: 5 },

        // C. Pendidikan Mahasiswa
        { responsibility: "Lulusan mendapat pekerjaan yang layak", order: 6 },
        { responsibility: "Kelulusan Tepat Waktu", order: 7 },
        { responsibility: "DO dan Undur Diri (Turn Over) Mahasiswa Angkatan Habis Masa Studi", order: 8 },
        { responsibility: "Kelas yang kolaboratif dan partisipatif", order: 9 },
        { responsibility: "Mahasiswa mendapat pengalaman di luar kampus", order: 10 },
        { responsibility: "Jumlah kerjasama infrastruktur laboratorium", order: 11 },
        { responsibility: "Rerata Presentase Penurunan Lulusan", order: 12 },
        { responsibility: "Jumlah mahasiswa yang mengikuti pembelajaran luar Prodi", order: 13 },

        // Riset dan Abdimas
        { responsibility: "Publikasi Terindex Scopus / WoS", order: 14 },
        { responsibility: "Penelitian dan abdimas yang didanai pihak eksternal", order: 15 },
        { responsibility: "Peningkatan Sitasi Baru dari paper yang terindeks", order: 16 },
        { responsibility: "International Publication Collaboration", order: 17 },
        { responsibility: "Desa Binaan", order: 18 },
        { responsibility: "Jumlah lulusan memiliki kolaborasi riset internasional", order: 19 },
        { responsibility: "jumlah lulusan telah memiliki kitupan ilmiah (H-Index)", order: 20 },
        { responsibility: "Jumlah lulusan yang terlibat dalam pengembangan HKI, teknologi tepat guna, buku ilmiah ber-ISBN sebagai sumber rujukan penting digunakan dalam suatu wilayah atau pada level nasional atau pada level internasional atau menghasilkan kebijakan publik berbasis riset", order: 21 },

        // Prestasi Mahasiswa
        { responsibility: "Prestasi kompetisi (tingkat Internasional/Nasional/Provinsi)", order: 22 },
        { responsibility: "Jumlah pendanaan hibah kompetisi belmawa (termasuk innovillage)", order: 23 },
        { responsibility: "Jumlah dosen yang terlibat membina kompetisi minimal tingkat nasional (Keterlibatan Membimbing)", order: 24 },

        // Internasionalisasi
        { responsibility: "Prodi Kelas Internasional dengan Dual/Joint Degree Aktif minimal submit kemendikbud", order: 25 },
        { responsibility: "Kesiapan Jumlah mahasiswa inbound mobility", order: 26 },
        { responsibility: "Mahasiswa outbound mobility (short dan long program)", order: 27 },
        { responsibility: "Jumlah mahasiswa tersertifikasi internasional", order: 28 },
        { responsibility: "Lulusan telah memiliki publikasi pada jurnal bereputasi internasional", order: 29 },

        // Sumber Daya Manusia
        { responsibility: "Performansi Dosen S3 (Sesuai BA yang Ditetapkan)", order: 30 },
        { responsibility: "Performansi terkait JFA Lektor, Lektor Kepala, dan Guru Besar (Sesuai BA yang Ditetapkan)", order: 31 },

        // Transformasi Digital dalam Pembelajaran
        { responsibility: "Mata kuliah menerapkan standard Online Learning", order: 32 },
        { responsibility: "Jumlah learning factory*", order: 33 },
        { responsibility: "Jumlah sertifikasi (untuk mahasiswa)", order: 34 },

        // Inovasi dan Entrepreneurial University
        { responsibility: "Penelitian Dosen TRL >=4 Granted PPM", order: 35 },
        { responsibility: "Tim Startup Berbasis Inovasi yang baru di Ekosistemn BTP dan Fakultas", order: 36 },
        { responsibility: "Jumlah HKI yang diimplementasikan di industri*", order: 37 },
        { responsibility: "Persentase dosen yang berkegiatan tridharma di luar kampus", order: 38 },
        { responsibility: "Persentase dosen yang memiliki sertifikasi profesi", order: 39 },
        { responsibility: "Jumlah mahasiswa yang terlibat WRAP research di CoE", order: 40 },
        { responsibility: "Jumlah dosen yang ditugaskan untuk terlibat di entrepreneurship berkolaborasi dengan BTP", order: 41 },
        { responsibility: "Jumlah mahasiswa yang terlibat WRAP entrepreneurship dan Program Entrepreneurship lainnya di Ekosistem BTP dan Fakultas", order: 42 },
        { responsibility: "Mitra yang mengisi Academic Survey", order: 43 },

        // Akreditasi, Sertifikasi dan Pembentukan Prodi Baru
        { responsibility: "Jumlah Prodi Baru", order: 44 },

        // Rata-Rata Pencapaian Pengembangan Sumber Daya
        { responsibility: "Jumlah Pegawai yang Mengikuti dan Menuntaskan Kewajiban Peningkatan kompetensi SDM", order: 45 },
        { responsibility: "Turunan Kontrak Manajemen ke Prodi dan KK", order: 46 },

        // Rata-rata Pencapaian Dukungan Data, Administrasi, dan Kesekretariatan
        { responsibility: "Kelengkapan Lapman", order: 47 },

        // Poin Tambahan
        { responsibility: "Pendapatan NTF (Seluruh NTF, Termasuk Hibah Penelitian)", order: 48 }
    ];

    try {
        for (const item of orderMapping) {
            const updated = await prisma.contractManagement.updateMany({
                where: {
                    responsibility: { contains: item.responsibility }
                },
                data: { order: item.order }
            });

            console.log(`✅ ${item.responsibility}: ${updated.count} baris diupdate ke order ${item.order}`);
        }
        console.log("✨ Semua data berhasil diurutkan!");
    } catch (error) {
        console.error("❌ Waduh, ada error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

backfill();