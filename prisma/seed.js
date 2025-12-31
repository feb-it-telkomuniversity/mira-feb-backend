import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper untuk membaca CSV dan mengembalikan Promise data
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' })) // 🚨 PENTING: Set separator titik koma
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

async function main() {
    console.log('🌱 Start seeding...');

    // --- 1. SEED DATA TPA (STAFF) ---

    // Fix for __dirname ReferenceError:
    const tpaFilePath = path.join(process.cwd(), 'prisma', 'data', 'data_tpa_feb.csv');
    console.log(`Reading TPA data from ${tpaFilePath}...`);

    const tpaDataRaw = await readCSV(tpaFilePath);

    const tpaDataFormatted = tpaDataRaw.map(row => ({
        name: row['Nama'],
        nip: row['NIP'] ? String(row['NIP']).trim() : null,
        workUnit: row['Lokasi Kerja'],
        employmentStatus: row['Status']
    })).filter(item => item.nip)

    if (tpaDataFormatted.length > 0) {
        await prisma.EmployeeTPA.createMany({
            data: tpaDataFormatted,
            skipDuplicates: true,
        });
        console.log(`✅ Berhasil seed ${tpaDataFormatted.length} data TPA.`);
    }


    // --- 2. SEED DATA DOSEN (LECTURER) ---
    const dosenFilePath = path.join(process.cwd(), 'prisma', 'data', 'data_dosen_feb.csv');
    console.log(`Reading Dosen data from ${dosenFilePath}...`)

    const dosenDataRaw = await readCSV(dosenFilePath);

    const dosenDataFormatted = dosenDataRaw.map(row => ({
        nip: row['NIP'] ? String(row['NIP']).trim() : null,
        nuptk: row['NUPTK'] === '' ? null : String(row['NUPTK']), // Handle kosong
        frontTitle: row['GLR DPN'],
        name: row['NAMA'],
        backTitle: row['GLR BLKG'],
        prodi: row['PRODI'],
        lecturerCode: row['KODE DOSEN'],
        education: row['Pendidikan'],
        jobFunctional: row['JAD']
    })).filter(item => item.nip && item.name);

    if (dosenDataFormatted.length > 0) {
        await prisma.lecturer.createMany({
            data: dosenDataFormatted,
            skipDuplicates: true,
        });
        console.log(`✅ Berhasil seed ${dosenDataFormatted.length} data Dosen.`);
    }

    console.log('🚀 Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });