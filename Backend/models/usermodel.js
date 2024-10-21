import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

// Load environment variables from .env file✅😀🤣😂
dotenv.config()
const connectDB = async () => {
    try {
        const connectionInstanse = await mongoose.connect(`${process.env.DB_URL}`)
        console.log(`🫙  mongodb connected successfully!! DB host ${connectionInstanse.connection.host}`)
    } catch (error) {
        console.log('mongodb connection failed',error)
    }
}
connectDB()

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    uploadedImages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Hash password before saving user to the database✅
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    // generat salt of a password ✅
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password ✅
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
