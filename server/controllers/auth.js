import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid';

import User from "../models/User.js"
import Role from "../models/Role.js"
import tokensService from "../service/tokens.js";

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
            const { login, avatar, email, password, } = req.body

            const candidate = await User.findOne({ login })
            if (candidate) return res.status(400).json({ message: 'пользователь c таким логином уже существует' })

            const candidateCheckEmail = await User.findOne({ email })
            if (candidateCheckEmail) return res.status(400).json({ message: 'пользователь c такой почтой уже существует' })

            const activationLink = uuidv4()
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'USER' })

            const user = await User.create({
                login,
                avatar,
                email,
                password: hashPassword,
                roles: [userRole.value],
                activationLink,
            })

            const tokens = tokensService.tokenGenerate({ email, id: user._id, isActivated: user.isActivated })
            await tokensService.saveToken(user._id, tokens.refreshToken)

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json({ message: 'пользователь успешно создан', ...tokens })

        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'проблема с регистрацией' })

        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const candidate = await User.findOne({ email })
            if (!candidate) return res.status(400).json({ message: 'неверная почта' })

            const checkPassword = await bcrypt.compare(password, candidate.password)
            if (!checkPassword) return res.status(400).json({ message: 'неверный пароль' })

            const tokens = tokensService.tokenGenerate({ email, id: candidate._id, isActivated: candidate.isActivated })
            await tokensService.saveToken(candidate._id, tokens.refreshToken)

            return res.json({ message: 'успешный вход', data: { ...candidate._doc } })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с входом' })

        }
    },

    logout: async (req, res) => {
        try {
            const { refreshToken } = req.cookies
            const token = await tokensService.deleteToken(refreshToken);

            res.clearCookie('refreshToken')
            return res.status(200).json({ message: 'успешный выход' })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с выходом' })

        }
    },

    refresh: async (req, res) => {
        try {
            const { refreshToken } = req.cookies
            const user = await tokensService.validateRefreshToken(refreshToken)
            if (!refreshToken) res.status(400).json({ message: 'проблема с обнолением' })

            const tokenFromDB = tokensService.findToken(refreshToken)
            if (!user || !tokenFromDB) {
                return res.status(400).json({ message: 'проблема с обнолением' })
            }

            const candidate = await User.findById(user.id)
            const tokens = tokensService.tokenGenerate({ email: user.email, id: candidate._id, isActivated: candidate.isActivated })
            await tokensService.saveToken(candidate._id, tokens.refreshToken)

            return res.json({ message: 'успешное обновление' })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с обнолением' })

        }
    }
}

export default auth