import multer from "multer";


// Multer upload configuration
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = /video\/(mp4|avi|mkv)|application\/(pdf|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)/; // Allowed file types
        const isValidType = allowedTypes.test(file.mimetype);

        if (!isValidType) {
            console.error(`Rejected file type: ${file.mimetype}`);
        }
    
        cb(isValidType ? null : new Error("Invalid file type. Allowed types: video (mp4, avi, mkv), pdf, excel"), isValidType);
    },
    limits: { fileSize: 100 * 1024 * 1024 }, // 10 MB file size limit
});

export default upload;
