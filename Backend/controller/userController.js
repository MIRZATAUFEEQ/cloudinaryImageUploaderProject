import User from '../models/usermodel.js';
import generateToken from '../utils/generatetoken.js';
import Image from '../models/imagemodel.js';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import Logout from '../models/userlogou.models.js';
// const cloudinary = cloudinarypkg.v2;




// Register User✅😃👟😎🤣❌💸✂️
export const registerUser = async (req, res) => {
    try {
        // get username,email,password from req.body✅
        const { username, email, password, adminRegistrationToken } = req.body;

        let isAdmin = false
        if (adminRegistrationToken === process.env.ADMIN_REGISTRATION_TOKEN) {
            isAdmin = true
        }


        // find user existence in data base ✅
        const userExist = await User.findOne({ email })

        // if user exist then show message ✅
        if (userExist) {
            return res.status(400).send('User already exists, please login.')
        }
        // now create new user ✅
        const createUser = await User.create({
            username,
            email,
            password,
            isAdmin: isAdmin
        })

        // if user is successfully created then send response to database✅
        if (createUser) {
            res.status(201).json({
                _id: createUser._id,
                username: createUser.username,
                email: createUser.email,
                isAdmin: createUser.isAdmin,
                token: generateToken(createUser._id)
            })

            // save user details in database✅
            await createUser.save()
        }
        else {
            res.status(400).send('Invalid user data')
        }
    } catch (error) {
        res.status(400).send({
            message: 'faild to creating user'
        })
    }
}



// Login User ✅😃👟😎🤣❌💸✂️

export const loginUser = async (req, res) => {
    // get email and password from req.body ✅
    const { email, password } = req.body;

    // find user userExist or not in database✅
    const userExist = await User.findOne({ email });

    // match entered email and password✅
    //  from existing email and password✅
    if (userExist && await userExist.matchPassword(password)) {
        res.status(201).json({
            _id: userExist._id,
            email: userExist.email,
            isAdmin: userExist.isAdmin,
            token: generateToken(userExist._id)
        });
    } else {
        res.status(401).send('Invalid email or password');
    }
}



// cloudinary configration 😃✅😂😐✂️😃😂✅🥰😎💸😡

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// controller for uploading image✅💸✂️🤣😂😃
export const uploadImage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).send('Unauthorized. Please login.');
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded')
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'user_avatar',
        });

        const image = new Image({
            filename: req.file.filename,
            path: result.secure_url,
            contentType: req.file.mimetype,
            size: req.file.size,
            username: user.username,
            user: user._id
        });

        await image.save();
        fs.unlinkSync(req.file.path);

        user.imageCount += 1;
        await user.save(); // Save the updated user document


        // Add the image ID to the user's uploadedImages array
        user.uploadedImages.push(image._id);
        await user.save(); // Save the updated user document

        res.status(201).send({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            username: user.username,
            uploadedImages: user.uploadedImages, // Send back the list of uploaded images
            imageCount: user.imageCount, // Send back the updated count
        });


    } catch (error) {
        console.error('Error uploading image', error);
        res.status(500).send('Error uploading image');
    }
};



// logoutUser route controller is here ❤️🤣😀😡💸😎🥰✅😂😃✂️😐
export const logoutUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is in the "Authorization" header

    if (!token) {
        return res.status(400).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the token to the blacklist with its expiration time
        await Logout.create({
            token,
            expiration: new Date(decoded.exp * 1000), // JWT expiration time in milliseconds
        });

        res.status(200).send('User logged out successfully');

    } catch (error) {
        res.status(500).send('Failed to log out');
    }
};


// get all images
//you can see all images which is uplod by image uploader
// export const getAllImages = async (req, res) => {
//     try {
//         // find all images from Image model and store in a object 
//         const images = await Image.find({})
//         res.status(201).send(images)

//     } catch (error) {
//         res.status(500).send({
//             message: 'could not found images'
//         })
//     }
// }



// PO Admin route controller is here
export const getAllImagesOfUser = async (req, res) => {
    try {
        const images = await Image.find({}).populate('user', 'username email')
        // console.log('images fetched',images)
        res.status(200).json(images)
    } catch (error) {
        res.status(500).send('error geting images')
    }
}


