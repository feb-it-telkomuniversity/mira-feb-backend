import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function getContactsQuery() {
    const contacts = await prisma.contacts.findMany({
        select: {
            id: true,
            name: true,
            phoneNumber: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
        }
    })
    return contacts
}

async function createContactQuery(contactData) {
    const contact = await prisma.contacts.create({
        data: {
            name: contactData.name,
            phoneNumber: contactData.phoneNumber,
            notes: contactData.notes,
            title: ""
        }
    })
    return contact
}

export { getContactsQuery, createContactQuery }
