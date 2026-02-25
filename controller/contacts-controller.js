import { createContactQuery, deleteContactQuery, getContactsQuery, updateContactQuery } from '../model/contact-model.js'

async function getContacts(req, res) {
    try {
        const contacts = await getContactsQuery()
        res.status(200).json(contacts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function createContact(req, res) {
    try {
        const contactData = req.body
        const contact = await createContactQuery(contactData)
        res.status(201).json(contact)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function updateContact(req, res) {
    try {
        const contacts = await updateContactQuery(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            contacts: contacts
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function handleDeleteContact(req, res) {
    try {
        const contactId = parseInt(req.params.id)
        await deleteContactQuery(contactId)
        res.status(204).json({ message: "Contact deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { getContacts, createContact, updateContact, handleDeleteContact }