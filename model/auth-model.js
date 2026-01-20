import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function createUserQuery(username, hashedPassword, name, role) {
    return await prisma.users.create({
        data: {
            username: username,
            password: hashedPassword,
            name: name,
            role: role
        }
    })
}

async function findUserByUsernameQuery(username) {
    return await prisma.users.findUnique({
        where: { username: username }
    })
}

async function getUsersQuery() {
    return await prisma.users.findMany()
}

export {
    createUserQuery,
    findUserByUsernameQuery,
    getUsersQuery
}