import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/Quiz.js";
import Certificae from "../models/Certificate.js";

const CertificateController = {
    generateCertificate: async (req, res) => {
        const { studentId, courseId } = req.params;

        try {
            const progress = await Progress.findOne({ student: studentId, course: courseId });
            const course = await Course.findById(courseId);

            if (!progress || progress.completedLessons.length !== course.lessons.length) {
                return res.status(400).json({ success: false, message: "Course not fully completed" });
            }

            // Mark certificate as issued
            await Progress.findOneAndUpdate(
                { student: studentId, course: courseId },
                { $set: { certificateIssued: true } }
            );

            // Generate certificate (PDF generation logic here)
            const certificateId = `CERT-${studentId}-${courseId}-${Date.now()}`;
            res.status(200).json({ success: true, message: "Certificate generated", certificateId });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to generate certificate", error });
        }
    }
};

export default CertificateController;