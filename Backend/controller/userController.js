import User from '../models/usermodel.js';
import generateToken from '../utils/generatetoken.js';
import Image from '../models/imagemodel.js';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import Logout from '../models/userlogou.models.js';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, adminRegistrationToken } = req.body;

        let isAdmin = false;
        if (adminRegistrationToken === process.env.ADMIN_REGISTRATION_TOKEN) {
            isAdmin = true;
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).send('User already exists, please login.');
        }

        const createUser = await User.create({ username, email, password, isAdmin });

        if (createUser) {
            res.status(201).json({
                _id: createUser._id,
                username: createUser.username,
                email: createUser.email,
                isAdmin: createUser.isAdmin,
                token: generateToken(createUser._id),
            });
            await createUser.save();
        } else {
            res.status(400).send('Invalid user data');
        }
    } catch (error) {
        res.status(400).send({ message: 'Failed to create user' });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist && await userExist.matchPassword(password)) {
        res.status(201).json({
            _id: userExist._id,
            email: userExist.email,
            isAdmin: userExist.isAdmin,
            token: generateToken(userExist._id),
        });
    } else {
        res.status(401).send('Invalid email or password');
    }
};

// Logout User
export const logoutUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(400).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await Logout.create({
            token,
            expiration: new Date(decoded.exp * 1000),
        });

        res.status(200).send('User logged out successfully');
    } catch (error) {
        res.status(500).send('Failed to log out');
    }
};

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image
export const uploadImage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).send('Unauthorized. Please login.');
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'user_avatar' });

        const image = new Image({
            filename: req.file.filename,
            path: result.secure_url,
            contentType: req.file.mimetype,
            size: req.file.size,
            username: user.username,
            user: user._id,
            createdAt: new Date(),
            POstatus: 'pending',
            Accountantstatus: 'pending',
        });

        await image.save();
        fs.unlinkSync(req.file.path);

        user.imageCount += 1;
        user.uploadedImages.push(image._id);
        await user.save();

        res.status(201).send({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            username: user.username,
            uploadedImages: user.uploadedImages,
            imageCount: user.imageCount,
        });
    } catch (error) {
        console.error('Error uploading image', error);
        res.status(500).send('Error uploading image');
    }
};

// Update image status and completion
export const updateImageStatus = async (req, res) => {
    try {
        const { POstatus, POcompletedAt, Accountantstatus, AccountantcompletedAt } = req.body;

        const updateData = {};
        if (POstatus) updateData.POstatus = POstatus;
        if (POcompletedAt) updateData.POcompletedAt = new Date();
        if (Accountantstatus) updateData.Accountantstatus = Accountantstatus;
        if (AccountantcompletedAt) updateData.AccountantcompletedAt = new Date();

        const updateImage = await Image.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updateImage);
    } catch (error) {
        res.status(500).json({ error: 'Error updating image' });
    }
};

// Get all images of users
export const getAllImagesOfUser = async (req, res) => {
    try {
        const images = await Image.find({}).populate('user', 'username email');
        res.status(200).json(images);
    } catch (error) {
        res.status(500).send('Error getting images');
    }
};
