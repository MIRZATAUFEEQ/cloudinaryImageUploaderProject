import mongoose, { mongo } from 'mongoose'

let imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        require: true,
    },
    username: {
        type: String, required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Pending',
    },

    completedAt: Date

}, { timestamps: true })

const Image = mongoose.model('Image', imageSchema)
export default Image

