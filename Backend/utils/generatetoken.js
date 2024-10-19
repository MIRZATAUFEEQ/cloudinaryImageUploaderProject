import jwt from 'jsonwebtoken'

// generateToken for every user ✅😂🤣😀😃
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expiration time✅
    });
};

export default generateToken;
