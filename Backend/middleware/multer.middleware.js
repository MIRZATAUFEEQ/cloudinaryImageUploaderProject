import multer from 'multer';
import path from 'path';

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // get images from localStorage✅
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {

        // giving filename by date and randomnumber✅
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // fix the filename field in cloudinary✅
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Fix the filename field
    }
});

// Create the multer instance with the defined storage
const upload = multer({
    // uploadImages in cloudinary✅
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types which type you want to upload✅
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File type not supported!'));
    }
});

export default upload;
