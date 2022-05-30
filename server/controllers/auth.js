import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import User from "../models/User.js"
import Role from "../models/Role.js"

const auth = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find()
            return res.json(users)

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с получением пользователей' })

        }
    },

    registration: async (req, res) => {
        try {
            console.log(req.body.email)
            const { email, password } = req.body

            const candidate = await User.findOne({ email })
            if (candidate) return res.status(400).json({ message: 'пользователь уже существует' })

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'USER' })
            const user = await User.create({
                email,
                password: hashPassword,
                roles: [userRole.value]
            })

            return res.json({ message: 'пользователь успешно создан' })

        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'проблема с регистрацией' })

        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const candidate = await User.findOne({ email })
            if (!candidate) return res.status(400).json({ message: 'неверный логин' })

            const checkPassword = await bcrypt.compare(password, candidate.password)
            if (!checkPassword) return res.status(400).json({ message: 'неверный пароль' })

            return res.json({ message: 'успешный вход' })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с входом' })

        }
    }
}

export default auth