import mongoose from 'mongoose'

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
 

}, { timestamps: true })

const Image = mongoose.model('Image', imageSchema)
export default Image


