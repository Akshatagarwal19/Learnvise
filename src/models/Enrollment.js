import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0 }, // Global course progress
    purchasedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],   // Array of purchased lessons
    mockPurchases: { 
        transactionId: { type: String },
        amount: { type: Number },
        status: { type: String, enum: ["Success", "Failed"], default: "Success" },
        purchasedAt: { type: Date },
    },
    completedAt: { type: Date },
    enrolledAt: { type: Date, default: Date.now },
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;
