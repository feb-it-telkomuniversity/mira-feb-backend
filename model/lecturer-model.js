import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getLecturersListQuery(search = "") {
    const whereClause = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { nip: { contains: search } }
        ]
    } : {};

    const data = await prisma.lecturer.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
    });

    return { data };
}

export { getLecturersListQuery }