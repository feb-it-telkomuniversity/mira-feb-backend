import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();
const csvFilePath = path.join(process.cwd(), 'prisma', 'data', 'partnership_documents.csv');

function parseBoolean(value) {
    if (!value) return false;
    const lower = value.toLowerCase();
    return lower === 'true' || lower === '1';
}

function parseDate(dateString) {
    if (!dateString || dateString === '') return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

// Helper: Ubah string kosong jadi null
function parseOptionalEnum(value) {
    return value === "" ? null : value;
}

// Helper Baru: Hapus spasi untuk menyesuaikan dengan format Enum Prisma
// Contoh: "Joint Degree" -> "JointDegree"
function formatEnum(value) {
    if (!value || value === "") return null;
    return value.replace(/\s+/g, ''); 
}

async function main() {
    console.log(`🌱 Memulai proses seeding dari ${csvFilePath}...`);
    
    // 1. Bersihkan data lama
    console.log('🧹 Membersihkan data lama...');
    await prisma.partnershipDocument.deleteMany({});
    console.log('✅ Data lama bersih.');

    const records = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const transformedRow = {
                    yearIssued: parseInt(row.year_issued) || null,
                    docType: parseOptionalEnum(row.doc_type),
                    
                    // --- DATA BARU ---
                    partnershipType: parseOptionalEnum(row.partnership_type), // Pastikan case sensitive (Akademik, Penelitian)
                    activityType: formatEnum(row.activity_type), // Otomatis hapus spasi (Joint Degree -> JointDegree)

                    partnerName: row.partner_name,
                    scope: parseOptionalEnum(row.scope),
                    picExternal: row.pic_external || null,
                    picInternal: row.pic_internal || null,
                    docNumberInternal: row.doc_number_internal || null,
                    docNumberExternal: row.doc_number_external || null,
                    signingType: row.signing_type || null,
                    dateCreated: parseDate(row.date_created),
                    dateSigned: parseDate(row.date_signed),
                    validUntil: parseDate(row.valid_until),
                    notes: row.notes || null,
                    hasHardcopy: parseBoolean(row.has_hardcopy),
                    hasSoftcopy: parseBoolean(row.has_softcopy),
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
    for (const record of records) {
        try {
            await prisma.partnershipDocument.create({
                data: record,
            });
        } catch (error) {
            console.error(`❌ Gagal: ${record.partnerName} | Error: ${error.message}`);
        }
    }
    
    console.log('🌱 Seeding selesai.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });