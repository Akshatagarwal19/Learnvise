import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import nodemailer from "nodemailer";
import Certificate from "../models/Certificate.js";

const CertificateController = {
    generateCertificate: async (req, res) => {
        const { courseId } = req.params;
        const studentId = req.user.id;

        try {
            const progress = await Progress.findOne({ student: studentId, course: courseId });
            if (!progress) {
                return res.status(404).json({ success: false, message: "Progress not found" });
            }

            const course = await Course.findById(courseId).populate("lessons");
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            const courseLessonIds = course.lessons.map(lesson => lesson._id.toString());
            const completedLessonIds = progress.completedLessons.map(id => id.toString());

            const isCourseCompleted = courseLessonIds.every(id => completedLessonIds.includes(id));
            if (!isCourseCompleted) {
                return res.status(400).json({ success: false, message: "Course not fully completed" });
            }

            const existingCertificate = await Certificate.findOne({ student: studentId, course: courseId });
            if (existingCertificate) {
                return res.status(400).json({ success: false, message: "Certificate already issued" });
            }

            const certificateId = `CERT-${studentId}-${courseId}-${Date.now()}`;
            const fileName = `${certificateId}.pdf`;
            const pdfPath = path.join("certificates", fileName);
            const downloadUrl = `${req.protocol}://${req.get("host")}/certificates/${fileName}`;
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream(pdfPath));
            // Add certificate content
            doc.fontSize(24).text("Certificate of Completion", { align: "center" });
            doc.moveDown();
            doc.fontSize(16).text(`This is to certify that`, { align: "center" });
            doc.fontSize(20).text(`Student ID: ${studentId}`, { align: "center" });
            doc.moveDown();
            doc.fontSize(16).text(`has successfully completed the course`, { align: "center" });
            doc.fontSize(20).text(`"${course.title}"`, { align: "center" });
            doc.moveDown(2);
            doc.fontSize(14).text(`Issued on: ${new Date().toLocaleDateString()}`, { align: "center" });

            doc.end();

            // Save certificate to database
            const newCertificate = await Certificate.create({
                student: studentId,
                course: courseId,
                certificateId,
                filePath: pdfPath,
                downloadUrl,
                issuedAt: new Date(),
            });

            // Mark certificate as issued in progress
            await Progress.findOneAndUpdate(
                { student: studentId, course: courseId },
                { $set: { certificateIssued: true } }
            );

            console.log("Certificate generated and saved successfully");
            
            res.status(200).json({
                success: true,
                message: "Certificate generated successfully",
                certificateId: newCertificate.certificateId,
                pdfPath: newCertificate.filePath,
                downloadUrl: newCertificate.downloadUrl,
            });
        } catch (error) {
            console.error("Error generating certificate:", error);
            res.status(500).json({ success: false, message: "Failed to generate certificate", error: error.message || error });
        }
    },

    emailCertificate: async (req, res) => {
        const { courseId } = req.params;
        const studentId = req.user.id;
        const { email } = req.body; // Frontend passes the recipient's email

        try {
            // Fetch certificate details
            const certificate = await Certificate.findOne({ student: studentId, course: courseId });
            if (!certificate) {
                return res.status(404).json({ success: false, message: "Certificate not found" });
            }

            const pdfPath = certificate.filePath;

            // Verify if the certificate file exists
            if (!fs.existsSync(pdfPath)) {
                return res.status(404).json({ success: false, message: "Certificate file not found" });
            }

            // Configure email transport (example: using Gmail SMTP)
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER, // Your email address
                    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
                },
            });

            // Email options
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your Certificate of Completion",
                text: `Dear Student,

Congratulations on completing the course! Please find your certificate of completion attached.

Best regards,
The Team`,
                attachments: [
                    {
                        filename: `${certificate.certificateId}.pdf`,
                        path: pdfPath,
                    },
                ],
            };

            // Send email
            await transporter.sendMail(mailOptions);

            console.log("Certificate emailed successfully to:", email);
            res.status(200).json({ success: true, message: "Certificate emailed successfully" });
        } catch (error) {
            console.error("Error sending certificate email:", error);
            res.status(500).json({ success: false, message: "Failed to email certificate", error: error.message || error });
        }
    },
};

export default CertificateController;
