import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }
    ],
    progressPercentage: { type: Number, default: 0 },
    engagementMetrics: {
        totalViews: { type: Number, default: 0 },
        totaTimeSpent: { type: Number, default: 0 }
    },
    completedQuizzes: [
        {
            lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson"},
            score: { type: Number, required: true },
        }
    ],
    certificateIssued: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ProgressSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const Progress = mongoose.model("Progress", ProgressSchema);
export default Progress;