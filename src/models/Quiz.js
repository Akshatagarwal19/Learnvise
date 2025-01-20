import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    questions: [
        {
            questionText: { type: String, required: true },
            Options: [{ type: String, required: true }],
            correctOption: { type: Number, required: true },
        }
    ],
    maxQuestions: { type: Number, default: 10 },
    createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;