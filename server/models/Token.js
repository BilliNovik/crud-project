import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    refreshToken: {
        type: String,
        required: true
    },
})

export default mongoose.model('Token', tokenSchema)