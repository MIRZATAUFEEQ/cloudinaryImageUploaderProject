import User from '../models/usermodel.js';
import generateToken from '../utils/generatetoken.js';
import Image from '../models/imagemodel.js';
import cloudinarypkg from 'cloudinary';
import * as fs from 'fs';

const cloudinary = cloudinarypkg.v2;



// Register User

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const userExist = await User.findOne({ email })
    if (userExist) {
        return res.status(400).send('User already exists, please login.')
    }
    const createUser = await User.create({
        username,
        email,
        password,
    })
    if (createUser) {
        res.status(201).json({
            _id: createUser._id,
            username: createUser.username,
            email: createUser.email,
            token: generateToken(createUser._id)
        })
       await createUser.save()
        // console.log(createUser)
    }
    else {
        res.status(400).send('Invalid user data')
    }
}



// Login User ✅😃👟😎🤣❌💸✂️
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist && await userExist.matchPassword(password)) {
        res.status(201).json({
            _id: userExist._id,
            // username: userExist.username,
            email: userExist.email,
            token: generateToken(userExist._id)
        });
    } else {
        res.status(401).send('Invalid email or password');
    }
}



// upload image configration 😃✅😂
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// controller for uploading image
export const uploadImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'user_avatar', // folder in cloudinary where image will be saved
        });

        const image = new Image({
            
            filename: req.file.filename,
            path: result.secure_url,
            contentType: req.file.mimetype,
            size: req.file.size,
        });

        await image.save();
        fs.unlinkSync(req.file.path); // Remove the temporary file
        res.status(201).send({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Error uploading image', error);
        res.status(500).send('Error uploading image');
    }
};