import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createUserQuery, deleteUserQuery, findUserByUsernameQuery, getUsersQuery, updateUserQuery } from "../model/auth-model.js"

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
        const hashedPassword = await bcrypt.hash(password, 10)

        const updatedUser = await updateUserQuery(id, username, hashedPassword, name, role)
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

export { signIn, registerUser, getUsers, deleteUser, updateUser }