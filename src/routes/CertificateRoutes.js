import express from 'express';
import auth from '../middleware/auth.js';
import certificatecontroller from '../controllers/certificatecontroller.js';

const router = express.Router();

router.post( "/:courseId/generate", auth.authenticate, auth.authorize(["Student"]), certificatecontroller.generateCertificate);

export default router;