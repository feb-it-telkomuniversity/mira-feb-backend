import fs from "fs";
import path from "path";
import prisma from "../utils/prisma.js";

async function main() {
  console.log("Reading lecture_profile.json...");
  const filePath = path.join(process.cwd(), "lecture_profile.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const records = JSON.parse(rawData);

  console.log(`Found ${records.length} records. Processing...`);

  const dataToInsert = [];
  const seenCodes = new Set();

  for (const item of records) {
    const rawCode = item.lecturercode ? item.lecturercode.trim() : "";
    const rawNama = item.nama ? item.nama.trim() : "";

    if (!rawCode || !rawNama || seenCodes.has(rawCode)) {
      continue;
    }
    seenCodes.add(rawCode);

    const rawNipNidn = item["nip / nidn"] ? item["nip / nidn"].trim() : null;
    let nip = null;
    let nidn = null;

    if (rawNipNidn) {
      const parts = rawNipNidn.split("/").map((p) => p.trim());
      if (parts[0]) nip = parts[0];
      if (parts[1]) nidn = parts[1];
    }

    dataToInsert.push({
      lecturerCode: rawCode,
      nipNidn: rawNipNidn,
      nip: nip,
      nidn: nidn,
      nama: rawNama,
      homebase: item.homebase ? item.homebase.trim() : null,
      kelompokKeahlian: item["kelompok keahlian"] ? item["kelompok keahlian"].trim() : null,
      employeeStatus: item.employeestatus ? item.employeestatus.trim() : null,
      academicFuncPosition: item.academicfuncposition ? item.academicfuncposition.trim() : null,
      lastAcademicTitle: item.lastacademictitle ? item.lastacademictitle.trim() : null,
      institutionName: item.institutionname ? item.institutionname.trim() : null,
      tahun: item.tahun ? String(item.tahun).trim() : null,
    });
  }

  console.log(`Inserting ${dataToInsert.length} unique lecture profiles in batch...`);
  const result = await prisma.lectureProfile.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });

  console.log(`\n--- Import Summary ---`);
  console.log(`Successfully created: ${result.count} records`);
  console.log(`Total DB Rows: ${await prisma.lectureProfile.count()}`);
}

main()
  .catch((e) => {
    console.error("Error during import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
