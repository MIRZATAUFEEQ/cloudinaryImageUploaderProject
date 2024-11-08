import mongoose from 'mongoose'

let imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },

    path: {
        type: Buffer,
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
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    stamp: {
        type: Boolean,
        default: false,
    },


    // Add POStatus and POCompletedAt fields✅
    POemail: {
        type: String,
        default: ''
    },
    POnumber: {
        type: String,
        default: ''
    },
    POstatus: {
        type: String,
        // enum: ['Done', 'Pending'],
        default: 'Pending',
    },

    POcompletedAt: {
        type: Date,
    },
    POtimeTaken: {
        type: String,
        default: '',
    },


    // Add Accountantstatus and AccountantcompletedAt fields✅
    Accountantemail: {
        type: String,
        default: ''
    },
    Accountantstatus: {
        type: String,
        default: 'Pending',
    },
    AccountantcompletedAt: {
        type: Date
    },
    AccountantTimeTaken: {
        type: String,
        default: ''
    },


    // start grn data here 
    GRNemail: {
        type: String,
        default: ''
    },
    GRNnumber: {
        type: String,
        default: ''
    },
    GRNstatus: {
        type: String,
        default: 'Pending'
    },
    GRNcompletedAt: {
        type: Date,
    },
    GRNtimeTaken: {
        type: String,
        default: ''
    }


}, { timestamps: true })

// imageSchema.index({ user: 1, POstatus: 1 });

const Image = mongoose.model('Image', imageSchema)
export default Image

