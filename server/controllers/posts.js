import Post from '../models/Post.js'
import User from '../models/User.js'

const posts = {
    get: async (req, res) => {
        try {
            const posts = await Post.find()
            res.json(posts)

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с получениям постов' })

        }
    },

    create: async (req, res) => {
        try {
            const { post, id } = req.body
            if (post.length > 280) return res.status(400).json({ message: 'cлишком много символов' })

            const user = await User.findOne({ _id: id })
            const createdPost = await Post.create({
                post, like: 0, user: {
                    avatar: user.avatar,
                    login: user.login,
                    id: user.id
                },
            })
            return res.json({ message: 'успешно создан пост', post: createdPost })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с созданием поста' })

        }
    },

    edit: async (req, res) => {
        try {
            const { data } = req.body
            const { id } = req.params

            const updatePost = await Post.findById(id)
            await updatePost.updateOne({ post: data })

            res.json(updatePost)

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с редактированием поста' })

        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params

            await Post.findByIdAndRemove(id)
            return res.json({ message: 'пост удален' })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'проблема с редактированием поста' })

        }
    },
}

export default posts