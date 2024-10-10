const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: [true, 'adminName is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
    },
    
    password: {
        type: String,
        required: [true, 'password is required'],
    },

}, { timestamps: true })

export const Admin = mongoose.model('Admin', adminSchema)