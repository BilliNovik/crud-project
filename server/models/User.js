import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
        }
    ],
    isActivated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String
    },
})

export default mongoose.model('User', userSchema)