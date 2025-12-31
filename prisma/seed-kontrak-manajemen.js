import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient()
const csvFilePath = path.join(
  process.cwd(),
  "prisma",
  "data",
  "contract_management.csv"
);

// ---------- Helpers ----------
const parseDecimal = (v) => {
  if (v === undefined || v === null || v === "") return null;
  return Number(String(v).replace(",", "."));
};

const parseIntSafe = (v) => {
  if (v === undefined || v === null || v === "") return null;
  return Number(v);
};

const parseString = (v) =>
  !v || String(v).trim() === "" ? null : String(v).trim();

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
          responsibility: parseString(row.responsibility),
          quarterly: row.quarterly,
          unit: parseString(row.unit),

          // NUMERIC (Decimal)
          weight: parseDecimal(row.weight),
          target: parseDecimal(row.target),
          realization: parseDecimal(row.realization),

          // NUMERIC (Int)
          max: parseIntSafe(row.max),
          min: parseIntSafe(row.min),

          // META
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