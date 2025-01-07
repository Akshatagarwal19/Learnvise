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
    sections: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, default: 0 },
            lessons: [
                {
                    title: { type: String, required: true},
                    videoUrl: { type: String },
                    description: { type: String, default: "" },
                    price: { type: Number, default: 0 },
                },
            ],
        },
    ],
    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            ratings: { type: Number, required: true },
            review: { type: String },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;