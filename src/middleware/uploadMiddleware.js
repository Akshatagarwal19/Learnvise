// // uploadMiddleware.js
// import { Readable } from 'stream';
// import cloudinary from '../config/cloudinary.js'; // Adjust this to your Cloudinary setup
// import multer from '../config/multer.js'; // Adjust this to your Multer setup
// import upload from '../config/multer.js';

// const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: resourceType },
//       (error, result) => {
//         if (error) {
//           console.error('Cloudinary upload error:', error);
//           return reject(error);
//         }
//         resolve(result);
//       }
//     );

//     const readableStream = new Readable();
//     readableStream.push(fileBuffer);
//     readableStream.push(null); // End the stream
//     readableStream.pipe(stream);
//   });
// };

// const uploadMiddleware = (req, res, next) => {
//   console.log('Entering uploadMiddleware...');
//   upload.single('file')(req, res, async (err) => {
//     if (err) {
//       console.error('Multer file upload error:', err.message);
//       return res.status(400).json({ error: 'File upload failed', details: err.message });
//     }

//     console.log('File uploaded to memory:', req.file);

//     try {
//       if (!req.file) {
//         console.warn('No file provided in the request');
//         return res.status(400).json({ error: 'No file provided' });
//       }

//       const isThumbnail = req.body.type === 'thumbnail';
//       const cloudinaryFolder = isThumbnail ? 'thumbnails' : 'lessons';

//       // Upload to Cloudinary
//       const result = await uploadToCloudinary(req.file.buffer, cloudinaryFolder, 'video');
//       console.log('Upload result:', result);

//       req.file.cloudinary = result;
//       next();
//     } catch (error) {
//       console.error('Error in uploadMiddleware:', error.message);
//       res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
//     }
//   });
// };

// export default uploadMiddleware;
