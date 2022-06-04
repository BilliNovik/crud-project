import express from 'express'
import controller from '../controllers/posts.js'

const posts = express.Router()

posts.get('/get', controller.get)
posts.post('/create', controller.create)
posts.patch('/:id', controller.edit)
posts.delete('/:id', controller.delete)

export default posts