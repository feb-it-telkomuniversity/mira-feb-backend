import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fungsi detektif yang sama persis kayak tadi
const detectSubCategory = (responsibilityText) => {
    if (!responsibilityText) return null;
    const text = responsibilityText.toLowerCase();

    if (text.includes("edom") || text.includes("satisfaction")) return "KepuasanCustomer";
    if (text.includes("lulusan mendapat") || text.includes("tepat waktu") || text.includes("do dan undur") || text.includes("kolaboratif dan partisipatif") || text.includes("luar kampus") || text.includes("infrastruktur laboratorium")) return "PendidikanMahasiswa";
    if (text.includes("scopus") || text.includes("didanai pihak") || text.includes("sitasi") || text.includes("desa binaan") || text.includes("riset internasional") || text.includes("kitupan ilmiah") || text.includes("hki")) return "RisetAbdimas";
    if (text.includes("prestasi") || text.includes("hibah kompetisi") || text.includes("membina kompetisi")) return "PrestasiMahasiswa";
    if (text.includes("kelas internasional") || text.includes("inbound mobility") || text.includes("outbound mobility") || text.includes("tersertifikasi internasional") || text.includes("bereputasi internasional")) return "Internasionalisasi";
    if (text.includes("dosen s3") || text.includes("jfa lektor")) return "SDM";
    if (text.includes("online learning") || text.includes("learning factory") || text.includes("sertifikasi (untuk mahasiswa)")) return "TransformasiDigital";
    if (text.includes("trl >=4") || text.includes("startup") || text.includes("diimplementasikan di industri") || text.includes("berkegiatan tridharma") || text.includes("sertifikasi profesi") || text.includes("wrap research") || text.includes("entrepreneurship") || text.includes("academic survey")) return "InovasiEntrepreneurship";
    if (text.includes("prodi baru")) return "AkreditasiSertifikasi";
    if (text.includes("pengembangan sumber daya") || text.includes("peningkatan kompetensi sdm") || text.includes("penurunan kontrak manajemen")) return "PengembanganSDM";
    if (text.includes("lapman")) return "DukunganData";

    return "Lainnya";
};

async function main() {
    console.log("Mulai ngecek data lama...");

    // 1. Tarik semua data yang Kategori-nya NonFinancial
    const contracts = await prisma.contractManagement.findMany({
        where: { ContractManagementCategory: "NonFinancial" }
    });

    let updatedCount = 0;

    // 2. Looping 40+ data lu
    for (const contract of contracts) {
        const subCat = detectSubCategory(contract.responsibility);

        // 3. Update datanya di database
        if (subCat) {
            await prisma.contractManagement.update({
                where: { id: contract.id },
                data: { subCategory: subCat }
            });
            console.log(`[UPDATE] ID: ${contract.id} masuk ke laci -> ${subCat}`);
            updatedCount++;
        }
    }

    console.log(`🎉 SELESAI! Berhasil mengupdate ${updatedCount} data secara otomatis.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())