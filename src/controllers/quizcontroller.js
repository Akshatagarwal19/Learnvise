import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/Quiz.js";

const QuizController = {
    addQuizToLesson: async (req, res) => {
        const { lessonId } = req.params;
        const { questions } = req.body;

        try {
            const quiz = await Quiz.create({ lesson: lessonId, questions });
            const course = await Course.findOneAndUpdate(
                { "lessons._id": lessonId },
                { $set: { "lessons.$.quiz": quiz._id } },
                { new: true }
            );

            res.status(201).json({ success: true, message: "Quiz added successfully", course });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to add quiz", error });
        }
    },

    // attemptQuiz: async (req, res) => {
    //     const { studentId } = req.user.id;
    //     const { lessonId } = req.params;
    //     const { answers } = req.body;

    //     try {
    //         const quiz = await Quiz.findOne({ lesson: lessonId });
    //         if (!quiz) {
    //             return res.status(404).json({ success: false, message: "Quiz not found" });
    //         }

    //         if (answers.length !== quiz.questions.length) {
    //             return res.status(400).json({ success: false, message: "Number of answers does not match the number of questions" });
    //         }

    //         // Calculate score
    //         let score = 0;
    //         quiz.questions.forEach((q, index) => {
    //             if (q.correctOption === answers[index]) score++;
    //         });

    //         const percentage = (score / quiz.questions.length) * 100;

    //         // Update progress if score > 50%
    //         if (percentage >= 50) {
    //             await Progress.findOneAndUpdate(
    //                 { student: studentId, "completedQuizzes.lesson": { $ne: lessonId } },
    //                 {
    //                     $push: { completedQuizzes: { lesson: lessonId, score } },
    //                     $addToSet: { completedLessons: lessonId },
    //                 },
    //                 { new: true }
    //             );
    //         }

    //         res.status(200).json({ success: true, message: "Quiz attempted", percentage, passed: percentage >= 50 });
    //     } catch (error) {
    //         res.status(500).json({ success: false, message: "Failed to attempt quiz", error });
    //     }
    // }
};

export default QuizController;