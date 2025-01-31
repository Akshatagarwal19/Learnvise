import express from 'express';
import auth from '../middleware/auth.js';
import courseController from '../controllers/coursecontroller.js';
import enrollmentController from '../controllers/enrollmentcontroller.js';
import toggleFreeStatus from '../controllers/freeAccessController.js';
import multer from 'multer';
import { storage } from '../config/multer.js';
const router = express.Router();
const upload = multer({ storage });

router.post("/", auth.authenticate, auth.authorize(["Instructor", "Manager", "Owner"]),upload.single("thumbnail"), courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.put("/:id", auth.authenticate, auth.authorize(["Instructor", "Manager", "Owner"]), courseController.updateCourse);
router.delete("/:id", auth.authenticate, auth.authorize(["Manager", "Owner"]), courseController.deleteCourse);

// ---------- Lesson Routes ----------
router.post('/:courseId/lessons',auth.authenticate,auth.authorize(['Instructor', 'Manager', 'Owner']),upload.single('file'),courseController.addLesson);
router.put("/:courseId/lessons/:lessonId",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),courseController.updateLesson);
router.delete("/:courseId/lessons/:lessonId",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),courseController.deleteLesson);
router.get("/:courseId/lessons",auth.authenticate,auth.authorize(["Instructor", "Student"]),courseController.getLessons);
router.get("/:courseId/lessons/:lessonId", auth.authenticate, courseController.getLesson);
// router.get("/:courseId/lessons/:lessonId/stream",auth.authenticate,auth.authorize(["Instructor", "Student"]),courseController.getLessonVideo);
// Get Enrolled Students

router.get('/:courseId/enrollments',auth.authenticate, enrollmentController.getEnrolledStudents);

// FreeAccess route
router.patch("/:courseId/lessons/:lessonId?",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),toggleFreeStatus);

export default router;