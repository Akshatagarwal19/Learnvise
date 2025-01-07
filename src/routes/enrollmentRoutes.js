import express from "express";
import enrollmentController from "../controllers/enrollmentcontroller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/enroll/:courseId", auth.authenticate, enrollmentController.enrollInCourse);
router.get("/course/:courseId", auth.authenticate, enrollmentController.getEnrolledStudents);
router.get("/details", auth.authenticate, enrollmentController.getEnrollmentDetails);
router.get("/check-status/:courseId", auth.authenticate, enrollmentController.checkEnrollmentStatus);

export default router;
