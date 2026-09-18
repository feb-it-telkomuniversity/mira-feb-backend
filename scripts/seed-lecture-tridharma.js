import fs from "fs";
import path from "path";
import prisma from "../utils/prisma.js";

async function main() {
  console.log("Reading lecture_tridharma.json...");
  const filePath = path.join(process.cwd(), "lecture_tridharma.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const records = JSON.parse(rawData);

  console.log(`Found ${records.length} records. Processing...`);

  const dataToInsert = [];
  const seenCodes = new Set();

  for (const item of records) {
    const rawCode = item.lecturercode ? item.lecturercode.trim() : "";

    if (!rawCode || seenCodes.has(rawCode)) {
      continue;
    }
    seenCodes.add(rawCode);

    dataToInsert.push({
      lecturerCode: rawCode,
      studyProgramType: item.studyprogramtype ? String(item.studyprogramtype).trim() : null,
      totalBimbingan: item.total_bimbingan ? String(item.total_bimbingan).trim() : null,
      listMataKuliah: item.list_mata_kuliah || [],
    });
  }

  console.log(`Inserting ${dataToInsert.length} unique tridharma records in batch...`);
  const result = await prisma.lectureTridharma.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });

  console.log(`\n--- Import Summary ---`);
  console.log(`Successfully created: ${result.count} records`);
  console.log(`Total DB Rows: ${await prisma.lectureTridharma.count()}`);
}

main()
  .catch((e) => {
    console.error("Error during import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
