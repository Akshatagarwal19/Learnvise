import express from "express";
import auth from "../middleware/auth.js";
import userController from "../controllers/usercontroller.js";

const router = express.Router();

router.get("/students", userController.getStudents);
router.get("/instructors", userController.getInstructors);

export default router;