import express from 'express';
import { registerUser, loginUser, uploadImage } from '../controller/userController.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

// Define routes
router.post('/registeruser', registerUser); // Register route
router.post('/loginuser', loginUser);       // Login route
router.post('/upload', upload.single('image'), uploadImage); // Ensure field name is 'image'

// Export the router
export default router;
