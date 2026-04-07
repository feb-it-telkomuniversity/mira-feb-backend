import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken"

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const prisma = new PrismaClient()

export async function loginWithGoogle(req, res) {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Google Token not Found"
            })
        }

        // const ticket = await googleClient.verifyIdToken({
        //     idToken: token,
        //     audience: process.env.GOOGLE_CLIENT_ID
        // })

        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!googleResponse.ok) {
            throw new Error("Failed to fetch data from google");
        }

        const payload = await googleResponse.json()
        const googleEmail = payload.email

        let user = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: googleEmail },
                    { googleEmail: googleEmail }
                ]
            }
        })

        if (!user) {
            const isStudent = googleEmail.endsWith('@student.telkomuniversity.ac.id')

            if (isStudent) {
                user = await prisma.users.create({
                    data: {
                        email: googleEmail,
                        googleEmail: googleEmail,
                        name: payload.name,
                        username: googleEmail.split('@')[0],
                        role: 'mahasiswa',
                    }
                })
            } else {
                return res.status(403).json({
                    success: false,
                    message: "Email Anda belum terdaftar dan bukan email resmi Telkom University."
                })
            }
        }

        const jwtPayload = {
            id: user.id,
            username: user.username,
            role: user.role
        }

        const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        res.status(200).json({
            success: true,
            message: 'Login successful with Google Auth',
            token: authToken,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Google Login Error:', error)
        res.status(500).json({ success: false, message: 'Failed verify Google Auth' })
    }
}