import { PrismaClient } from "@prisma/client";
import fs from "fs";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const data = JSON.parse(
  fs.readFileSync("./prisma/data/contract_management_seed.json", "utf-8")
);

async function main() {
  console.log("Clearing contract_management table...");
  await prisma.contractManagement.deleteMany();

  console.log("Seeding contract_management...");
  await prisma.contractManagement.createMany({ data });

  console.log("Upserting uat_admin user...");
  // Password manual Anda disetel menjadi: UAT#2026
  const hashedPassword = await bcrypt.hash("UAT#2026", 10);

  await prisma.users.upsert({
    where: { username: "uat_admin" },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "uat_admin",
      name: "UAT Administrator",
      role: "admin",
      password: hashedPassword,
      email: "seb@telkomuniversity.ac.id",
    },
  });

  console.log("All seeding completed successfully!");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());