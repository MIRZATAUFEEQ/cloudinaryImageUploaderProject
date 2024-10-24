import User from '../models/usermodel.js';
import generateToken from '../utils/generatetoken.js';
import Image from '../models/imagemodel.js';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import Logout from '../models/userlogou.models.js';

// Register User API Controller ✅
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

// Login User API Controller ✅
export const loginUser = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(401).send({
            message: 'Failed to login', error
        });
    }
};

// Logout User API Controller ✅
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

// Cloudinary Configuration ✅
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Image API Controller (Optimized) ✅
export const uploadImage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).send('Unauthorized. Please login.');
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Upload the image to Cloudinary and optimize by using eager transformations
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'user_avatar',
        });


        const image = new Image({
            filename: req.file.filename,
            path: result.secure_url,
            contentType: req.file.mimetype,
            size: req.file.size,
            username: user.username,
            user: user._id,
            createdAt: new Date(),
            POnumber: '',
            GRNnumber: '',
            stamp: false,
            POstatus: 'pending',
            Accountantstatus: 'pending',
        });

        if (!image) {
            return res.status(400).send('File not provided');
        }

        // Save the image and update user data asynchronously using Promise.all
        await Promise.all([
            image.save(),
            fs.unlinkSync(req.file.path),
            User.findByIdAndUpdate(req.user._id, {
                $inc: { imageCount: 1 },
                $push: { uploadedImages: image._id },
            }),
        ]);

        // Send response to client
        res.status(201).send({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            username: user.username,
            uploadedImages: user.uploadedImages,
            imageCount: user.imageCount,
            stamp: image.stamp,
        });
    } catch (error) {
        // Remove file from local storage if an error occurs
        fs.unlinkSync(req.file.path);
        console.error('Error uploading image', error);
        res.status(500).send('Error uploading image');
    }
};

// Update Image Status and Completion API Controller ✅
// Update Image Status and Completion API Controller ✅
export const updateImageStatus = async (req, res) => {
    try {
        const { POstatus, POcompletedAt, Accountantstatus, AccountantcompletedAt, GRNstatus, GRNcompletedAt, POnumber, GRNnumber, stamp } = req.body;

        const imageId = req.params.id;
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(400).json({ error: 'Image not found' });
        }

        const currentTime = new Date();
        const updateData = {};

        if (POnumber || GRNnumber || stamp) {
            updateData.POnumber = POnumber || image.POnumber;
            updateData.GRNnumber = GRNnumber || image.GRNnumber;
            updateData.stamp = stamp || image.stamp;
        }

        if (POstatus === 'Done' && !image.POtimeTaken) {
            const timeTaken = Math.floor((currentTime - new Date(image.createdAt)) / 1000);
            const minutes = Math.floor(timeTaken / 60);
            const seconds = timeTaken % 60;
            updateData.POtimeTaken = minutes > 0 ? `${minutes}:${seconds} minute` : `${seconds} seconds`;
            updateData.POcompletedAt = currentTime;
        }

        if (POcompletedAt) updateData.POstatus = POstatus;

        if (Accountantstatus === 'Done' && !image.AccountantTimeTaken) {
            const timeTaken = Math.floor((currentTime - new Date(image.createdAt)) / 1000);
            const minutes = Math.floor(timeTaken / 60);
            const seconds = timeTaken % 60;
            updateData.AccountantTimeTaken = minutes > 0 ? `${minutes} : ${seconds} minute` : `${seconds} seconds`;
            updateData.AccountantcompletedAt = currentTime;
        }

        if (AccountantcompletedAt) updateData.Accountantstatus = Accountantstatus;

        if (GRNstatus === 'Done' && !image.GRNtimeTaken) {
            const timeTaken = Math.floor((currentTime - new Date(image.createdAt)) / 1000);
            const minutes = Math.floor(timeTaken / 60);
            const seconds = timeTaken % 60;
            updateData.GRNtimeTaken = minutes > 0 ? `${minutes}:${seconds} minute` : `${seconds} seconds`;
            updateData.GRNcompletedAt = currentTime;
        }

        if (GRNcompletedAt) updateData.GRNstatus = GRNstatus;

        const updateImage = await Image.findByIdAndUpdate(imageId, updateData, { new: true });

        if (!updateImage) {
            return res.status(404).json({ error: 'Failed to update image' });
        }

        res.status(200).json(updateImage);
    } catch (error) {
        console.error('Error updating image:', error);  // Log the error
        res.status(500).json({ error: 'Error updating image' });
    }
};


// Get All Images of Users API Controller ✅
export const getAllImagesOfUser = async (req, res) => {
    try {
        const { POstatus } = req.query;
        const filter = {};

        if (POstatus && POstatus !== 'All') {
            filter.POstatus = POstatus;
        }

        const images = await Image.find(filter).populate('user');

        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: error.message });
    }
};
