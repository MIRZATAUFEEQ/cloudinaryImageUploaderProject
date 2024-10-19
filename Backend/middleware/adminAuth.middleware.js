

import jwt from 'jsonwebtoken'
import User from '../models/usermodel.js';

export const adminAuth = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token Not Provided, ')
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)

        if (!user || !user.isAdmin) {
            return res.status(403).send('access is available for only Admin')
        }
        req.user = user  //attach user to request object✅
        next()     //proceed to the next middleware or route handler✅
    } catch (error) {
        res.status(401).send('token is not valid')
    }
}


