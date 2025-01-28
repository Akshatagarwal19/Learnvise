import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    certificateId: { type: String, required: true },
    filePath: { type: String, required: true },
    downloadUrl: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
});

const Certificate = mongoose.model("Certificate", CertificateSchema);
export default Certificate;