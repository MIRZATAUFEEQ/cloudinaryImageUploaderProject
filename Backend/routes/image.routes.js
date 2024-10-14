// routes/imageRoutes.js
import express from 'express';
import { getAllImagesOfUser, updateImageStatus } from '../controller/userController.js';
import { adminAuth } from '../middleware/adminAuth.middleware.js';
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router();

// Route to get all images (protected route for admins)
router.get('/images', protect, adminAuth, getAllImagesOfUser);
router.patch('/images/:id', updateImageStatus)

export default router;

