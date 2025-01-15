import Course from "../models/Course.js";
import mongoose from "mongoose";

const progressController = {
    markLessonComplete: async (req, res) => {
        try {
            const { courseId, lessonId } = req.params;
            const studentId = req.user.id;
    
            if (!courseId || !lessonId) {
                return res.status(400).json({ message: "CourseId & LessonId are required." });
            }
    
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(400).json({ message: "Course not found." });
            }
    
            const lessonObjectId = new mongoose.Types.ObjectId(lessonId);
            const lesson = course.lessons.id(lessonObjectId);
            if (!lesson) {
                return res.status(400).json({ message: "Lesson not found in this course." });
            }
    
            // Find the existing student progress or create a new entry if not found
            let studentProgress = course.studentProgress.find(
                (progress) => progress.student?.toString() === studentId
            );
    
            if (!studentProgress) {
                studentProgress = {
                    student: studentId,
                    completedLessons: [],
                    progressPercentage: 0,
                };
                course.studentProgress.push(studentProgress);
            }
    
            // Update progress only if the lesson isn't already marked as completed
            if (!studentProgress.completedLessons.includes(lessonId.toString())) {
                studentProgress.completedLessons.push(lessonId);
            }
    
            // Recalculate progress percentage
            const totalLessons = course.lessons.length;
            const completedLessons = studentProgress.completedLessons.length;
            studentProgress.progressPercentage = (completedLessons / totalLessons) * 100;
    
            await course.save();
    
            return res.status(200).json({ message: "Lesson marked as complete.", progress: studentProgress });
        } catch (error) {
            console.error("Error in progressController - markLessonComplete:", error);
            res.status(500).json({ message: "Failed to mark lesson as complete.", error: error.message });
        }
    },
    
    getProgress: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const studentId = req.user.id;
    
            if (!studentId) {
                return res.status(400).json({ message: "Student ID is required." });
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(400).json({ message: "Course not found." });
            }
    
            // Find the student progress for the specific student ID
            const studentProgress = course.studentProgress.find(
                (progress) => progress.student?.toString() === studentId?.toString()
            );
    
            if (!studentProgress) {
                return res.status(200).json({ message: "No progress found for this course." });
            }
    
            return res.status(200).json({ message: "Progress retrieved successfully.", progress: studentProgress });
        } catch (error) {
            console.error("Error in progressController - getProgress:", error);
            res.status(500).json({ message: "Failed to retrieve progress.", error: error.message });
        }
    },
    
};

export default progressController;