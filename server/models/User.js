import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
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
            type: String,
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