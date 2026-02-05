import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const data = JSON.parse(
  fs.readFileSync("./prisma/data/contract_management_seed.json", "utf-8")
);

async function main() {
    console.log("Clearing contract_management table...");
    await prisma.contractManagement.deleteMany();
  
    console.log("Seeding contract_management...");
    await prisma.contractManagement.createMany({
      data,
    });
  
    console.log("Contract Management seeding completed");
  }

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
