import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createUserQuery, deleteUserQuery, findUserByUsernameQuery, getMyProfileQuery, getUsersQuery, updateUserQuery } from "../model/auth-model.js"
import { del, put } from "@vercel/blob"
import { Prisma, PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { sendOtpEmail } from "../services/email-service.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const prisma = new PrismaClient()

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
}

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
                role: user.role,
                unitId: user.unitId
            }, process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        )
        res.cookie('auth_token', token, cookieOptions)

        res.status(200).json({
            success: true,
            message: 'Login successful',
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
        const { username, password, name, role, supervisorId, unitId } = req.body
        if (!username || !name || !password || !role || !unitId) {
            return res.status(400).json({
                success: false,
                message: 'Username, name, password, role, and unitId are required'
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

        const newUser = await createUserQuery(username, hashedPassword, name, role, supervisorId, unitId)
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
        const { username, name, password, role, supervisorId, unitId } = req.body

        const updateData = {}
        if (username) updateData.username = username
        if (name) updateData.name = name
        if (role) updateData.role = role
        if (supervisorId !== undefined) {
            updateData.supervisorId = supervisorId ? parseInt(supervisorId) : null
        }
        if (unitId !== undefined) {
            updateData.unitId = unitId ? parseInt(unitId) : null
        }

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

        const newToken = jwt.sign(
            {
                id: updatedUser.id,
                username: updatedUser.username,
                role: updatedUser.role,
                unitId: updatedUser.unitId
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        )

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        }
        res.cookie('auth_token', newToken, cookieOptions)

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
        const { googleToken, userId } = req.body

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
            where: { googleEmail: googleEmail }
        })

        if (existingEmail && existingEmail.id !== userId) {
            return res.status(400).json({
                success: false,
                message: "Email ini telah terhubung dengan akun lain"
            })
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { googleEmail: googleEmail }
        })

        delete updatedUser.password

        res.status(200).json({
            success: true,
            message: "Google account successfully linked",
            email: updatedUser.googleEmail
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
            data: { googleEmail: null }
        })

        delete updatedUser.password

        res.status(200).json({
            success: true,
            message: "Google account successfully unlinked",
            email: updatedUser.googleEmail
        })
    } catch (error) {
        console.error('Unlink Google account error: ', error)
        res.status(500).json({
            success: false,
            message: 'Failed to unlink Google account'
        })
    }
}

const requestOtp = async (req, res) => {
    try {
        const { email } = req.body

        const normalizedEmail = email.toLowerCase().trim()

        // Validasi domain email
        if (!normalizedEmail.endsWith('@student.telkomuniversity.ac.id') && !normalizedEmail.endsWith('@telkomuniversity.ac.id')) {
            return res.status(403).json({ success: false, message: "Gunakan email resmi Telkom University!" });
        }

        // Generate 6 digit angka random
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Set kadaluarsa 5 menit dari sekarang
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Simpan/Update OTP di database
        await prisma.otpRequest.upsert({
            where: { email: normalizedEmail },
            update: { otp: otpCode, expiresAt: expiresAt },
            create: { email: normalizedEmail, otp: otpCode, expiresAt: expiresAt }
        });

        // Kirim email
        const isSent = await sendOtpEmail(normalizedEmail, otpCode);

        if (!isSent) {
            return res.status(500).json({ success: false, message: "Gagal mengirim email OTP." });
        }

        res.status(200).json({ success: true, message: "OTP berhasil dikirim ke email Anda." });

    } catch (error) {
        console.error("Error request OTP:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        const normalizedEmail = email.toLowerCase().trim()

        // Cari OTP di database
        const otpRecord = await prisma.otpRequest.findUnique({ where: { email: normalizedEmail } });

        if (!otpRecord) {
            return res.status(404).json({ success: false, message: "Silakan request OTP terlebih dahulu." });
        }

        // Cek apakah OTP salah atau kadaluarsa
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ success: false, message: "Kode OTP salah!" });
        }
        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({ success: false, message: "Kode OTP sudah kadaluarsa!" });
        }

        // OTP Valid! Hapus OTP dari database agar tidak bisa dipakai ulang
        await prisma.otpRequest.delete({ where: { email: normalizedEmail } });

        // Proses Auto-Registration / Get User
        let user = await prisma.users.findUnique({ where: { email: normalizedEmail } });

        if (!user) {
            const isStudent = normalizedEmail.endsWith('@student.telkomuniversity.ac.id')
            let baseUsername = normalizedEmail.split('@')[0]
            let finalUsername = baseUsername
            let isUsernameTaken = await prisma.users.findUnique({ where: { username: finalUsername } })

            while (isUsernameTaken) {
                const randomSuffix = Math.floor(1000 + Math.random() * 9000)
                finalUsername = `${baseUsername}_${randomSuffix}`
                isUsernameTaken = await prisma.users.findUnique({ where: { username: finalUsername } })
            }

            user = await prisma.users.create({
                data: {
                    email: normalizedEmail,
                    name: baseUsername,
                    username: finalUsername,
                    role: isStudent ? "mahasiswa" : "tpa"
                }
            })
        }

        // Generate JWT Token (Persis seperti fungsi Google Login kamu)
        const jwtPayload = { id: user.id, username: user.username, role: user.role, unitId: user.unitId };
        const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('auth_token', authToken, cookieOptions)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user.id, name: user.name, username: user.username, role: user.role }
        });

    } catch (error) {
        console.error("Error verify OTP:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
}

const signOut = (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
        success: true,
        message: "Logout berhasil"
    });
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
    unlinkGoogleAccount,
    requestOtp,
    verifyOtp,
    signOut
}