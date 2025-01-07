import express from "express";
import authController from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);

export default router;
