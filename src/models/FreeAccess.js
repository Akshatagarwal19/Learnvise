import mongoose from "mongoose";

const FreeAccessSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    isFree: { type: Boolean, required: true },
});

export default mongoose.model("FreeAccess", FreeAccessSchema);