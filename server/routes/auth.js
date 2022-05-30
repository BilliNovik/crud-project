import express from 'express'
import controller from '../controllers/auth.js'

const auth = express.Router()

auth.post('/registration', controller.registration)
auth.post('/login', controller.login)
// auth.get('/logout', controller.logout)
// auth.get('/users', controller.getUsers)

export default auth