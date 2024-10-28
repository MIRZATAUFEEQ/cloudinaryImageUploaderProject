import express from 'express';
import { registerUser, loginUser, logoutUser, uploadImage } from '../controller/userController.js';
import upload from '../middleware/multer.middleware.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

// Define routes✅
router.post('/registeruser', registerUser); // Register route✅
router.post('/loginuser', loginUser);       // Login route✅
router.post('/logout', protect, logoutUser);
router.post('/upload', protect, upload.single('file'), uploadImage); // image upload route✅

// Export the router✅
export default router;
