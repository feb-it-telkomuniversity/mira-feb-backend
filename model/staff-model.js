import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getStaffsListQuery(search = "") {
    const whereClause = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { nip: { contains: search } }
        ]
    } : {};

    const data = await prisma.employeeTPA.findMany({
        where: whereClause,
        orderBy: { workUnit: 'asc' }
    })

    return {
        data,
    }
}

export { getStaffsListQuery };