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
    return await prisma.users.findMany({
        where: {
            role: {
                not: "admin"
            }
        }
    })
}

async function updateUserQuery(id, updateData) {
    return await prisma.users.update({
        where: { id: parseInt(id) },
        data: updateData
    })
}

async function deleteUserQuery(id) {
    return await prisma.users.delete({
        where: { id: parseInt(id) }
    })
}

async function getMyProfileQuery(id) {
    return await prisma.users.findUnique({
        where: { id: parseInt(id) }
    })
}

export {
    createUserQuery,
    findUserByUsernameQuery,
    getUsersQuery,
    deleteUserQuery,
    updateUserQuery,
    getMyProfileQuery
}