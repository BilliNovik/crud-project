import express from 'express'
import controller from '../controllers/auth.js'

const auth = express.Router()

auth.post('/registration', controller.registration)
auth.post('/login', controller.login)
auth.post('/logout', controller.logout)
auth.post('/refresh', controller.refresh)

export default auth