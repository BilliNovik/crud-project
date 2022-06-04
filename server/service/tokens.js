import jwt from 'jsonwebtoken'
import Token from '../models/Token.js'

const tokens = {

    tokenGenerate: (payload) => {
        const accessToken = jwt.sign(
            payload,
            process.env.SECRET_ACCESS,
            { expiresIn: '30m' }
        )
        const refreshToken = jwt.sign(
            payload,
            process.env.SECRET_REFRESH,
            { expiresIn: '30d' }
        )

        return {
            accessToken,
            refreshToken
        }
    },

    saveToken: async (userId, refreshToken) => {
        const tokenData = await Token.findOne({ user: userId })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await Token.create({ user: userId, refreshToken })
        return token
    },

    deleteToken: async (refreshToken) => {
        const token = await Token.deleteOne({ refreshToken })
        return token
    },

    findToken: async (token) => {
        const result = await Token.findOne({ token })
        return result
    },

    validateAccessToken: async (token) => {
        try {
            const user = jwt.verify(token, process.env.SECRET_ACCESS)
            return user

        } catch (error) {
            return null

        }
    },

    validateRefreshToken: async (token) => {
        try {
            const user = jwt.verify(token, process.env.SECRET_REFRESH)
            return user

        } catch (error) {
            return null

        }
    },

}

export default tokens