import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createUserQuery, deleteUserQuery, findUserByUsernameQuery, getMyProfileQuery, getUsersQuery, updateUserQuery } from "../model/auth-model.js"
import { del, put } from "@vercel/blob"
import { Prisma, PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const prisma = new PrismaClient()

async function signIn(req, res) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({
                succes: false,
                message: "Username and Password are required"
            })
        }

        const user = await findUserByUsernameQuery(username)
        if (!user) {
            return res.status(401).json({
                succes: false,
                message: "Username or Password incorrect"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                succes: false,
                message: "Your password is incorrect"
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            }, process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        )

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Login error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function registerUser(req, res) {
    try {
        const { username, password, name, role } = req.body
        if (!username || !name || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Username, name, password, and role are required'
            });
        }

        const existingUser = await findUserByUsernameQuery(username)
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "username already in use"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await createUserQuery(username, hashedPassword, name, role)
        res.status(201).json({
            success: true,
            message: "User created successfuly",
            user: newUser
        })
    } catch (error) {
        console.error('Register admin error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function getUsers(req, res) {
    try {
        const users = await getUsersQuery()
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users: users
        })
    } catch (error) {
        console.error('Get users error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params
        const deletedUser = await deleteUserQuery(id)
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            user: deletedUser
        })
    } catch (error) {
        console.error('Delete user error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params
        const { username, name, password, role } = req.body

        const updateData = {}
        if (username) updateData.username = username
        if (name) updateData.name = name
        if (role) updateData.role = role

        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await updateUserQuery(id, updateData)
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        })
    } catch (error) {
        console.error('Update user error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function getMyProfile(req, res) {
    try {
        const id = req.user.id
        const user = await getMyProfileQuery(id)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        delete user.password
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user: user
        })
    } catch (error) {
        console.error('Get my profile error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function updateMyProfile(req, res) {
    try {
        const userId = req.user.id
        const { username, name, password, avatarUrl } = req.body

        let updateData = {}

        if (name) updateData.name = name
        if (avatarUrl) updateData.avatarUrl = avatarUrl

        if (username) {
            const existingUser = await findUserByUsernameQuery(username)
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    message: "Username already in use, please choose another one"
                })
            }
        }
        updateData.username = username

        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data change"
            })
        }

        const updatedUser = await updateUserQuery(userId, updateData)
        delete updatedUser.password

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })
    } catch (error) {
        console.error('Update profile error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function uploadAvatar(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'There is no file to upload'
            });
        }

        const file = req.file

        const fileName = `profiles/${Date.now()}-${file.originalname}`

        const blob = await put(fileName, file.buffer, {
            access: 'public',
            addRandomSuffix: true,
        })

        res.status(200).json({
            success: true,
            message: 'Photo succeded uploaded',
            url: blob.url
        })
    } catch (error) {
        console.error('Upload avatar error: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file to server'
        })
    }
}

async function deleteAvatar(req, res) {
    try {
        const userId = req.user.id
        const { avatarUrl } = req.body

        if (avatarUrl && avatarUrl.includes('vercel-storage.com')) {
            await del(avatarUrl)
        }

        const updatedUser = await updateUserQuery(userId, { avatarUrl: null })
        delete updatedUser.password

        res.status(200).json({
            success: true,
            message: 'Profile picture deleted successfully',
            user: updatedUser
        })
    } catch (error) {
        console.error('Delete avatar error: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed delete profile picture'
        })
    }
}

async function linkGoogleAccount(req, res) {
    try {
        const { googleToken, userId, token } = req.body

        if (!googleToken || !userId) {
            return res.status(400).json({
                success: false,
                message: "Your data is incomplete"
            })
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        const googleEmail = payload.email

        const existingEmail = await prisma.users.findUnique({
            where: { email: googleEmail }
        })

        if (existingEmail && existingEmail.id !== userId) {
            return res.status(400).json({
                success: false,
                message: "Email ini telah terhubung dengan akun lain"
            })
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { email: googleEmail }
        })

        delete updatedUser.password

        res.status(200).json({
            success: true,
            message: "Google account successfully linked",
            email: updatedUser.email
        })
    } catch (error) {
        console.error('Link Google account error: ', error)
        res.status(500).json({
            success: false,
            message: 'Failed to link Google account'
        })
    }
}

async function unlinkGoogleAccount(req, res) {
    try {
        const userId = req.user.id

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { email: null }
        })

        delete updatedUser.password

        res.status(200).json({
            success: true,
            message: "Google account successfully unlinked",
            email: updatedUser.email
        })
    } catch (error) {
        console.error('Unlink Google account error: ', error)
        res.status(500).json({
            success: false,
            message: 'Failed to unlink Google account'
        })
    }
}

export {
    signIn,
    registerUser,
    getUsers,
    deleteUser,
    updateUser,
    getMyProfile,
    updateMyProfile,
    uploadAvatar,
    deleteAvatar,
    getMyProfileQuery,
    linkGoogleAccount,
    unlinkGoogleAccount
}