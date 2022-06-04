import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import auth from './routes/auth.js'
import posts from './routes/posts.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/auth', auth);
app.use('/posts', posts);

const start = async () => {
    await mongoose.connect(process.env.DB)
    app.listen(PORT, () => console.log(`work on ${PORT}`))
}
start()