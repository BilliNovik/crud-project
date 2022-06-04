import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    post: String,
    like: Number,
    user: {
        type: Object
    },
    data: {
        type: Date,
        default: () => Date.now()
    }
})

export default mongoose.model('Post', postSchema)