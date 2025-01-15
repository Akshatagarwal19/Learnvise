import mongoose, { Mongoose } from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true},
    price: { type: Number, required: true},
    language: { type: String, default: "English"},
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    thumbnail: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category:{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    lessons: [
        {
            title: { type: String, required: true },
            contentType: { type: String, enum: ["video", "pdf", "excel"], required: true },
            fileUrl: { type: String, required: true },
            description: { type: String , default: "" },
            price: { type: Number, default: 0 },
            isFree: { type: Boolean, default: false },
            timeLimit: { type: Number },
            duration: { type: Number }
            ,
            progressTracking: {
                completionCriteria: {
                    type: String,
                    threshold: Number,
                },
                engagementMetrics: {
                    totalViews: { type: Number, default: 0 },
                    timeSpent: { type: Number, default: 0 },
                }
            }
        }
    ],
    totalDuration: { type: Number },
    studentProgress: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            completedLessons: [
                { type: mongoose.Schema.Types.ObjectId }
            ],
            progressPercentage: { type: Number, default: 0 },
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;