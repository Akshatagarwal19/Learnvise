import express from 'express';
import auth from '../middleware/auth.js';
import QuizController from '../controllers/quizcontroller.js';

const router = express.Router();

router.post("/lessons/:lessonId/quiz", auth.authenticate, auth.authorize(["Instructor"]), QuizController.addQuizToLesson);
// router.post("/:lessonId/attempt", auth.authenticate, auth.authorize(["Student"]), QuizController.attemptQuiz);

export default router;
