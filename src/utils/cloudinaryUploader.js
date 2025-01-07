import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a file to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from Multer.
 * @param {string} folder - The folder name in Cloudinary.
 * @param {string} resourceType - Resource type ("image", "video", or "auto").
 * @returns {Promise<object>} - Cloudinary response.
 */
const uploadToCloudinary = (fileBuffer, folder, resourceType = "auto") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: `appfolder/${folder}`,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error.message);
                    return reject(error);
                } else{
                    resolve(result);
                }
                
            }
        ).end(fileBuffer);
    });
};

export default uploadToCloudinary;
