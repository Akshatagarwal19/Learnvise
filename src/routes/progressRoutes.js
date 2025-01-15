import express from 'express';
import auth from '../middleware/auth.js';
import progressController from '../controllers/progressController.js';

const router = express.Router();

router.post("/:courseId/lessons/:lessonId/complete", auth.authenticate, progressController.markLessonComplete );
router.get("/:courseId/progress", auth.authenticate, progressController.getProgress);

export default router;