import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createAdminQuery, findAdminByUsernameQuery } from "../model/auth-model.js"

async function signIn(req, res) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({
                succes: false,
                message: "Username and Password are required"
            })
        }
        
        const admin = await findAdminByUsernameQuery(username)
        if (!admin) {
            return res.status(401).json({
                succes: false,
                message: "Username or Password incorrect"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                succes: false,
                message: "Your password is incorrect"
            })
        }

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username,
            }, process.env.JWT_SECRET_KEY, 
            { expiresIn: '8h' }
        )

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            admin: {
                id: admin.id,
                name: admin.name,
                username: admin.username,
                fullName: admin.fullName
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

async function registerAdmin(req, res) {
    try {
        const { username, fullname, password } = req.body
        if (!username || !fullname || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, name, and password are required'
            });
        }
        
        const existingAdmin = await findAdminByUsernameQuery(username)
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "username already in use"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = await createAdminQuery(username, fullname, hashedPassword)
        res.status(201).json({
            success: true,
            message: "Admin created successfuly",
            admin: newAdmin
        })
    } catch (error) {
        console.error('Register admin error: ', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export { signIn, registerAdmin }