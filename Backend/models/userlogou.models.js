import mongoose from 'mongoose';

const logoutSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    expiration: {
        type: Date,
        required: true,
    },
});

const Logout = mongoose.model('Logout', logoutSchema);

export default Logout;
