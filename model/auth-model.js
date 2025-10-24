import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function createAdminQuery(username, fullName, hashedPassword) {
    return await prisma.admins.create({
        data: {
            username: username,
            fullName: fullName,
            password: hashedPassword
        }
    })
}

async function findAdminByUsernameQuery(username) {
    return await prisma.admins.findUnique({
        where: { username: username }
    })
}

export {
    createAdminQuery,
    findAdminByUsernameQuery
}