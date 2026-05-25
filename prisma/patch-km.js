import { calculateKM } from "../utils/contract-management-calculator.js";
import prisma from "../utils/prisma.js";

async function patchDataKM() {
    console.log("⏳ Memulai proses sinkronisasi kalkulasi KM...");

    // 1. Tarik semua data Master Fakultas beserta anak-anak Unit-nya
    const contracts = await prisma.contractManagement.findMany({
        include: { assignments: true }
    });

    const operations = [];
    const quarters = [1, 2, 3, 4];

    for (const contract of contracts) {
        const contractUpdate = {};
        let hasContractUpdate = false;

        // 2. Kalkulasi ulang untuk FAKULTAS (Master)
        quarters.forEach(q => {
            const realization = contract[`realizationTw${q}`];

            // Hanya hitung jika ada realisasi yang pernah diinput
            if (realization !== null && realization !== undefined) {
                const calcData = {
                    responsibility: contract.responsibility,
                    weight: contract[`weightTw${q}`],
                    target: contract[`targetTw${q}`],
                    realization: realization,
                    min: contract[`minTw${q}`],
                    max: contract[`maxTw${q}`]
                };

                const res = calculateKM(calcData);
                contractUpdate[`achievementTw${q}`] = res.achievement;
                contractUpdate[`persRealTw${q}`] = res.persReal;
                contractUpdate[`valueTw${q}`] = res.value;
                hasContractUpdate = true;
            }
        });

        if (hasContractUpdate) {
            operations.push(prisma.contractManagement.update({
                where: { id: contract.id },
                data: contractUpdate
            }));
        }

        // 3. Kalkulasi ulang untuk UNIT (Assignments)
        for (const assignment of contract.assignments) {
            const assignmentUpdate = {};
            let hasAssignmentUpdate = false;

            quarters.forEach(q => {
                const realization = assignment[`realizationTw${q}`];

                if (realization !== null && realization !== undefined) {
                    const calcData = {
                        responsibility: contract.responsibility,
                        weight: contract[`weightTw${q}`],
                        target: contract[`targetTw${q}`],
                        realization: realization,
                        min: contract[`minTw${q}`],
                        max: contract[`maxTw${q}`]
                    };

                    const res = calculateKM(calcData);
                    assignmentUpdate[`achievementTw${q}`] = res.achievement;
                    assignmentUpdate[`persRealTw${q}`] = res.persReal;
                    assignmentUpdate[`valueTw${q}`] = res.value;
                    hasAssignmentUpdate = true;
                }
            });

            if (hasAssignmentUpdate) {
                operations.push(prisma.contractAssignment.update({
                    where: { id: assignment.id },
                    data: assignmentUpdate
                }));
            }
        }
    }

    console.log(`🚀 Ditemukan ${operations.length} baris data yang siap di-patch...`)

    // Eksekusi semua secara bersamaan biar kenceng!
    await prisma.$transaction(operations)

    console.log("✅ Selesai. Semua nilai Pers Real & Value sudah terisi otomatis!")
}

patchDataKM()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })