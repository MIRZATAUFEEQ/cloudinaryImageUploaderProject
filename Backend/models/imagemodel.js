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
        required: true,
    },
    username: {
        type: String, required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Add POStatus and POCompletedAt fields
    POstatus: {
        type: String,
        // enum: ['Done', 'Pending'],
        default: 'Pending',
    },

    POcompletedAt: {
        type: Date,
    },
    // Add Accountantstatus and AccountantcompletedAt fields
    Accountantstatus: {
        type: String,
        default: 'Pending',
    },
    AccountantcompletedAt: {
        type: Date
    },
    POtimeTaken: {
        type: Number,
        default: null,
    },
    AccountantTimeTaken: {
        type: Number,
        default: null
    }


}, { timestamps: true })

imageSchema.index({ user: 1, POstatus: 1 });

const Image = mongoose.model('Image', imageSchema)
export default Image

