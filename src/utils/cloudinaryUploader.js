import cloudinary from "../config/cloudinary.js";
import path from "path";

/**
 * Uploads a file to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from Multer.
 * @param {string} folder - The folder name in Cloudinary.
 * @param {string} resourceType - Resource type ("image", "video", or "auto").
 * @returns {Promise<object>} - Cloudinary response.
 */
const uploadToCloudinary = (fileBuffer, folder, resourceType = "auto", originalName) => {
    return new Promise((resolve, reject) => {
        console.log("Uploading to Cloudinary");
        console.log("Resource Type:", resourceType);
        console.log("Buffer Size:", fileBuffer.length);

        const safeName = originalName ? path.parse(originalName).name : `file_${Date.now()}`;
        
        cloudinary.uploader.upload_stream(
            {
                folder: `appfolder/${folder}`,
                resource_type: resourceType,
                public_id: safeName,
                use_filename: true,
                unique_filename: false,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error.message);
                    return reject(new Error(`Cloudinary upload failed: ${error.message}`));
                } else{
                    console.log("Cloudinary Upload Successful:", result);
                    resolve(result);
                }
                
            }
        ).end(fileBuffer);
    });
};

export default uploadToCloudinary;
