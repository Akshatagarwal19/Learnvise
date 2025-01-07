import express from 'express';
import auth from '../middleware/auth.js';
import courseController from '../controllers/coursecontroller.js';
import enrollmentController from '../controllers/enrollmentcontroller.js';
import toggleFreeStatus from '../controllers/freeAccessController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", auth.authenticate, auth.authorize(["Instructor", "Manager", "Owner"]),upload.single("thumbnail"), courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/:id", auth.authenticate, courseController.getCourseById);
router.put("/:id", auth.authenticate, auth.authorize(["Instructor", "Manager", "Owner"]), courseController.updateCourse);
router.delete("/:id", auth.authenticate, auth.authorize(["Manager", "Owner"]), courseController.deleteCourse);

// ---------- Section Routes ----------
router.post("/:courseId/sections",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),upload.array("videos", 10),courseController.addSection);
router.put("/:courseId/sections/:sectionId",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),courseController.updateSection);
router.delete("/:courseId/sections/:sectionId",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),courseController.deleteSection);

// ---------- Lesson Routes ----------
// Add a lesson to a section
router.post('/:courseId/sections/:sectionId/lessons',auth.authenticate,auth.authorize(['Instructor', 'Manager', 'Owner']),upload.single('video'),courseController.addLesson);
router.put("/:courseId/sections/:sectionId/lessons/:lessonId",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),courseController.updateLesson);
router.delete("/:courseId/sections/:sectionId/lessons/:lessonId",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),courseController.deleteLesson);
router.get("/:courseId/sections/:sectionId/lessons",auth.authenticate,auth.authorize(["Instructor", "Student"]),courseController.getLessons);
router.get("/:courseId/sections/:sectionId/lessons/:lessonId", auth.authenticate, courseController.getLesson);
// router.get("/:courseId/sections/:sectionId/lessons/:lessonId/stream",auth.authenticate,auth.authorize(["Instructor", "Student"]),courseController.getLessonVideo);
// Get Enrolled Students

router.get('/:courseId/enrollments',auth.authenticate, enrollmentController.getEnrolledStudents);

// FreeAccess route
router.patch("/:courseId/sections/:sectionId/lessons/:lessonId?",auth.authenticate,auth.authorize(["Instructor", "Manager", "Owner"]),toggleFreeStatus);

export default router;