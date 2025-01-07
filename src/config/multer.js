import multer from "multer";
import path from "path";

// Multer upload configuration
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|mp4|avi|mkv/; // Allowed file types
        const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                            allowedTypes.test(file.mimetype);
    
        cb(isValidType ? null : new Error("Invalid file type"), isValidType);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});

export default upload;
