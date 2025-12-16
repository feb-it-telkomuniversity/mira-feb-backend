import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();
const csvFilePath = path.join(
  process.cwd(),
  "prisma",
  "data",
  "contract_management.csv"
);

// ---------- Helpers ----------
const parseIntSafe = (v) =>
  v === undefined || v === null || v === "" ? null : parseInt(v);

const parseDecimalSafe = (v) =>
  v === undefined || v === null || v === ""
    ? null
    : Number(v.replace(",", "."));

const parseString = (v) =>
  !v || v.trim() === "" ? null : v.trim();

async function main() {
  console.log("🌱 Seeding Contract Management...");

  await prisma.contractManagement.deleteMany();

  const records = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        records.push({
          ContractManagementCategory: row.ContractManagementCategory,
          responsibility: row.responsibility,
          quarterly: row.quarterly,
          unit: parseString(row.unit),
          weight: parseString(row.weight),
          target: parseString(row.target),
          realization: parseString(row.realization),
          achievement: parseString(row.achievement),
          max: parseIntSafe(row.max),
          min: parseIntSafe(row.min),
          persReal: parseDecimalSafe(row.persReal),
          value: parseDecimalSafe(row.value),
          Input: parseString(row.Input),
          Monitor: parseString(row.Monitor),
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  let success = 0;
  let failed = 0;

  for (const r of records) {
    try {
      await prisma.contractManagement.create({ data: r });
      success++;
    } catch (e) {
      failed++;
      console.error("❌ Gagal:", r.responsibility, e.message);
    }
  }

  console.log(`✅ Selesai. Success: ${success}, Failed: ${failed}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
