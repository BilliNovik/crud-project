import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'USER',
        unique: true
    },
})

export default mongoose.model('Role', roleSchema)