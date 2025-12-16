import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();
const csvFilePath = path.join(process.cwd(), 'prisma', 'data', 'partnership_documents.csv');

// --- HELPER FUNCTIONS ---

function parseBoolean(value) {
    if (!value) return false;
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === '1' || lower === 'yes' || lower === 'ada';
}

function parseDate(dateString) {
    if (!dateString || dateString.trim() === '' || dateString === '-') return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

// Helper: Ubah string kosong jadi null
function parseOptionalString(value) {
    if (!value || value.trim() === "" || value.trim() === "-") return null;
    return value.trim();
}

// Helper: Handle Scope (International -> international)
function parseScope(value) {
    if (!value) return null;
    return value.toLowerCase().trim();
}

// Helper: Handle Approval Status
// Mapping dari "Approved" di CSV ke Enum Prisma
function parseApproval(value) {
    if (!value || value.trim() === '' || value.trim() === '-') return null; // Bisa return 'Pending' kalau mau default

    const status = value.trim();
    // Sesuaikan dengan Enum di schema.prisma
    if (['Approved', 'Returned', 'Submitted', 'Pending', 'Skipped'].includes(status)) {
        return status;
    }
    return null; // Jika typo atau format beda
}

async function main() {
    console.log(`🌱 Memulai proses seeding dari ${csvFilePath}...`);

    // 1. Bersihkan data lama
    console.log('🧹 Membersihkan data lama...');
    try {
        await prisma.partnershipDocument.deleteMany({});
        console.log('✅ Data lama bersih.');
    } catch (e) {
        console.warn('⚠️ Warning: Gagal membersihkan data lama (mungkin tabel kosong). Lanjut...');
    }

    const records = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                // Pastikan nama key (row['...']) SAMA PERSIS dengan header di CSV kamu
                const transformedRow = {
                    // --- Identitas Utama ---
                    yearIssued: parseInt(row['Tahun/Year']) || new Date().getFullYear(),
                    docType: parseOptionalString(row['Doc. Type']), // Enum MoA/MoU biasanya case sensitive, pastikan CSV sama
                    partnerName: row['Mitra/Partner'] || 'Unknown Partner',
                    scope: parseScope(row['Cakupan/Scope']), // "International" -> "international"

                    // --- PIC & Kontak ---
                    picExternal: parseOptionalString(row['PIC (Ext)']),
                    picExternalPhone: parseOptionalString(row['Phone']), // ✅ Kolom Baru
                    picInternal: parseOptionalString(row['PIC (Int)']),

                    // --- Dokumen ---
                    docNumberInternal: parseOptionalString(row['No. Document (Int)']),
                    docNumberExternal: parseOptionalString(row['No. Document (Ext)']),
                    docLink: parseOptionalString(row['Doc. Link']), // ✅ Kolom Baru

                    // --- Tanggal & Signing ---
                    dateCreated: parseDate(row['Doc. Date Created']),
                    signingType: parseOptionalString(row['Signing Type']),
                    dateSigned: parseDate(row['Doc. Date Signed']),
                    validUntil: parseDate(row['Valid Until']),
                    duration: parseOptionalString(row['Tahun']), // ✅ Kolom Baru (Durasi text)

                    // --- APPROVAL WORKFLOW (Baju Surat) --- ✅ BARU
                    approvalWadek2: parseApproval(row['Wadek II']),
                    approvalWadek1: parseApproval(row['Wadek I']),
                    approvalKabagKST: parseApproval(row['Ka. Bag. KST']),
                    approvalDirSPIO: parseApproval(row['Dir. SPIO']),
                    approvalKaurLegal: parseApproval(row['Ka. Ur. Legal']),
                    approvalKabagSekpim: parseApproval(row['Ka. Bag. Sekpim']),
                    approvalDirSPS: parseApproval(row['Dir. SPS']),
                    approvalDekan: parseApproval(row['Dekan']),
                    approvalWarek1: parseApproval(row['Warek I']),
                    approvalRektor: parseApproval(row['Rektor']),

                    // --- Lainnya ---
                    notes: parseOptionalString(row['Notes']),
                    hasHardcopy: parseBoolean(row['Hardcopy']),
                    hasSoftcopy: parseBoolean(row['Softcopy']),

                    // Default null karena tidak ada di CSV baru
                    partnershipType: null,
                    // activityType: null
                };
                records.push(transformedRow);
            })
            .on('end', () => {
                console.log(`✅ CSV dibaca: ${records.length} baris.`);
                resolve();
            })
            .on('error', (error) => reject(error));
    });

    console.log('🚀 Menyimpan ke database...');
    let successCount = 0;
    let errorCount = 0;

    for (const record of records) {
        try {
            await prisma.partnershipDocument.create({
                data: record,
            });
            successCount++;
        } catch (error) {
            errorCount++;
            console.error(`❌ Gagal baris mitra: ${record.partnerName}`);
            console.error(`   Penyebab: ${error.message}`);
        }
    }

    console.log(`\n🌱 Seeding Selesai! Sukses: ${successCount}, Gagal: ${errorCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });