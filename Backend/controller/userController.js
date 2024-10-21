import User from '../models/usermodel.js';
import generateToken from '../utils/generatetoken.js';
import Image from '../models/imagemodel.js';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import Logout from '../models/userlogou.models.js';

// Register User api controller 😃✅😂🥰😎😐
export const registerUser = async (req, res) => {
    try {
        // get user details from req.body ✅
        const { username, email, password, adminRegistrationToken } = req.body;

        // check user isadmin or not ✅
        let isAdmin = false;
        if (adminRegistrationToken === process.env.ADMIN_REGISTRATION_TOKEN) {
            isAdmin = true;
        }

        // check user is already exists or not ✅
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).send('User already exists, please login.');
        }

        // create new user ✅
        const createUser = await User.create({ username, email, password, isAdmin });

        // if user is successfully created then send response to database✅ 
        if (createUser) {
            res.status(201).json({
                _id: createUser._id,
                username: createUser.username,
                email: createUser.email,
                isAdmin: createUser.isAdmin,
                token: generateToken(createUser._id),
            });

            // save userdetails in database✅
            await createUser.save();
        } else {
            res.status(400).send('Invalid user data');
        }
    } catch (error) {
        res.status(400).send({ message: 'Failed to create user' });
    }
};

// Login User api controller 😐😎🥰😂✅😃🤣🤣
export const loginUser = async (req, res) => {
    try {
        // get userdata from client side req.body✅ 
        const { email, password } = req.body;

        // check user is exist or not ✅
        const userExist = await User.findOne({ email });

        // if userExist then compare email and password ✅
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
            message: 'faild to loginuser', error
        })
    }
};

// Logout User api controller 🤣😃✅😂🥰😎😐
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


// Cloudinary configuration 😐😎🥰😂✅
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Upload image api controller✅
export const uploadImage = async (req, res) => {
    try {

        // find user by userId ✅
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).send('Unauthorized. Please login.');
        }

        // if file has not uploaded then show this message ✅
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // upload file on specific folder which is created by admin✅
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'user_avatar' });

        // get image and image uploader details✅
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

        if (!image) {
            return res.status(400).send('file not provided')
        }
        // save in database✅
        await image.save();

        // remove file from localStorage✅
        fs.unlinkSync(req.file.path);

        // count image✅
        user.imageCount += 1;

        // push image on the specific user profile✅
        user.uploadedImages.push(image._id);

        // save images on the user profile in database✅
        await user.save();

        // send data to client side ✅
        res.status(201).send({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            username: user.username,
            uploadedImages: user.uploadedImages,
            imageCount: user.imageCount,
        });
    } catch (error) {
        fs.unlinkSync(req.file.path)
        console.error('Error uploading image', error);
        res.status(500).send('Error uploading image');
    }
};


// Update image status and completion api controller✅😂🥰😎😐😃🤣
export const updateImageStatus = async (req, res) => {
    try {
        // get all data which is you need from client side ✅
        const { POstatus, POcompletedAt, Accountantstatus, AccountantcompletedAt } = req.body;

        // get imageId ✅
        const imageId = req.params.id;

        // find image by imageId in database✅
        const image = await Image.findById(imageId)

        // set current time ✅
        const currentTime = new Date()

        // store all updated data in this object ✅
        const updateData = {};

        // check postatus and potimetaken ✅
        if (POstatus === 'Done' && !image.POtimeTaken) {
            const timeTaken = parseInt((currentTime - new Date(image.createdAt)) / 1000 / 60)
            updateData.POtimeTaken = timeTaken
            updateData.POcompletedAt = currentTime
        }

        // if po completed there task then store updated data in updateData object ✅
        if (POcompletedAt) updateData.POstatus = POstatus;

        // check Accountantstatus and AccountantTimeTaken✅
        if (Accountantstatus === 'Done' && !image.AccountantTimeTaken) {
            const timeTaken = parseInt((currentTime - new Date(image.createdAt)) / 1000 / 60)
            updateData.AccountantTimeTaken = timeTaken
            updateData.AccountantcompletedAt = currentTime
        }

        // if Accountant has completed there task then store updated data in updateData object✅
        if (AccountantcompletedAt) updateData.Accountantstatus = Accountantstatus;

        // find all data by id and updatedata and store all updateData in updateImage variable ✅
        const updateImage = await Image.findByIdAndUpdate(imageId, updateData, { new: true });

        // send response in json form ✅
        res.status(200).json(updateImage);
    } catch (error) {
        res.status(500).json({ error: 'Error updating image' });
    }
};


// Get all images of users by all admin api controller 🤣😃😐😎🥰😂✅
// Get all images of users with filtering options
export const getAllImagesOfUser = async (req, res) => {
    try {

        // hit a query in POstatus database✅
        const { POstatus } = req.query;

        // create a object for store filter ✅
        const filter = {};

        // check if POstatus is all filter value ✅
        if (POstatus && POstatus !== 'All') {
            filter.POstatus = POstatus; // Filter by POstatus
        }

        // find filtered image and store in database✅
        const images = await Image.find(filter).populate('user'); // Ensure you're populating the user correctly

        // send response in json form ✅
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error); // Log any errors
        res.status(500).json({ message: error.message });
    }
};

