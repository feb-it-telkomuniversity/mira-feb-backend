import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createUserQuery, findUserByUsernameQuery, getUsersQuery } from "../model/auth-model.js"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// export const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const user = await prisma.users.findUnique({
//             where: { username: username }
//         })

//         if (!user) return res.status(404).json({ success: false, message: "Username tidak ditemukan" })

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) return res.status(400).json({ success: false, message: "Password salah" })

//         const token = jwt.sign(
//             {
//                 id: user.id,
//                 username: user.username,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         )

//         res.json({
//             success: true,
//             message: "Login successful",
//             token: token,
//             data: {
//                 id: user.id,
//                 name: user.name,
//                 role: user.role
//             }
//         });

//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ success: false, message: "Server error" })
//     }
// }

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

export { signIn, registerUser, getUsers }