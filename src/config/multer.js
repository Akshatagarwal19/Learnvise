import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const ensureUploadPath = (uploadDir) => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
};

// Define storage based on file type
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir;

        if (file.mimetype.startsWith("image/")) {
            uploadDir = path.join("uploads", "thumbnails"); // Store thumbnails
        } else {
            uploadDir = path.join("uploads", "lessons"); // Store lesson files
        }

        ensureUploadPath(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/png", "image/jpeg", "image/jpg", // Thumbnails
        "video/mp4", "video/webm", "video/ogg", // Videos
        "application/pdf", // PDFs
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Excel files
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({ storage, fileFilter });

export { storage }; 
export default upload;
