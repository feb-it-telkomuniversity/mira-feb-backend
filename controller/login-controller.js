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

        const user = await prisma.users.findUnique({
            where: { email: googleEmail }
        })

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Email in this user are not found in MIRA system"
            })
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