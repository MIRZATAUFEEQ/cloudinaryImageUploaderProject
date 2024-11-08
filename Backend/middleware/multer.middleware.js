import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();  // Store the file as Buffer in memory

// Create the multer instance with the defined storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },  // 10MB limit
    fileFilter: (req, file, cb) => {
        // Allowed file types including images, PDF, and Excel files
        const allowedFileTypes = [
            'auto',
            'image/jpeg',   // JPEG images
            'image/png',    // PNG images
            'application/pdf', // PDF files
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
            'application/vnd.ms-excel', // XLS
            'application/octet-stream' // For generic binary files, can help with some Excel uploads
        ];

        console.log('File received:', file.originalname, 'MIME type:', file.mimetype); // Log the file details

        // Allow file types if allowedFileTypes is empty or file type is allowed
        if (allowedFileTypes.length === 0 || allowedFileTypes.includes(file.mimetype)) {
            return cb(null, true);  // Accept the file
        }
        return cb(new Error('Error: File type not supported!'));  // Reject the file
    }
});

export default upload;