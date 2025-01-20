import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/Quiz.js";

const progressController = {
    markLessonComplete: async (req, res) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.user.id;
    const { answers } = req.body;  // Answers submitted by the student

    try {
        if (!courseId || !lessonId) {
            return res.status(400).json({ message: "CourseId & LessonId are required." });
        }

        // Fetch course and lesson
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course not found." });
        }

        const lesson = course.lessons.find(
            (lesson) => lesson._id.toString() === lessonId
        );
        if (!lesson) {
            return res.status(400).json({ message: "Lesson not found in this course" });
        }

        // Fetch quiz for the lesson
        const quiz = await Quiz.findOne({ lesson: lessonId });
        if (!quiz) {
            return res.status(400).json({ message: "Quiz not found for this lesson." });
        }

        // Validate answers
        if (!answers || answers.length !== quiz.questions.length) {
            return res.status(400).json({ message: "Invalid or incomplete answers provided." });
        }

        // Calculate quiz score
        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (q.correctOption === answers[index]) score++;
        });

        const percentage = (score / quiz.questions.length) * 100;

        // Ensure the quiz is passed (at least 50%)
        if (percentage < 50) {
            return res.status(400).json({ message: "Quiz not passed. You must score at least 50% to complete the lesson." });
        }

        // Update progress
        let progress = await Progress.findOne({ student: studentId, course: courseId });

        if (!progress) {
            progress = new Progress({
                student: studentId,
                course: courseId,
                completedLessons: [],
                completedQuizzes: [],
                progressPercentage: 0,
            });
        }

        // Mark lesson as completed and record quiz score
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            progress.completedQuizzes.push({ lesson: lessonId, score });
        }

        // Recalculate overall progress percentage
        const totalLessons = course.lessons.length;
        const completedLessons = progress.completedLessons.length;
        progress.progressPercentage = (completedLessons / totalLessons) * 100;

        await progress.save();

        // Return success response with progress data
        return res.status(200).json({ message: "Lesson completed successfully.", progress });
    } catch (error) {
        console.error("Error in attemptAndCompleteLesson:", error);
        res.status(500).json({ message: "Failed to complete lesson and quiz.", error: error.message });
    }
    },

    getProgress: async (req, res) => {
        try {
            const { courseId } = req.params;
            const studentId = req.user.id;
    
            if (!courseId || !studentId) {
                return res.status(400).json({ message: "CourseId & Student ID are required." });
            }
    
            // Find the student's progress for the specific course
            const progress = await Progress.findOne({
                student: studentId,
                course: courseId,
            });
    
            if (!progress) {
                return res.status(200).json({ message: "No progress found for this course." });
            }
    
            // Fetch course details, including lessons
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(400).json({ message: "Course not found." });
            }
    
            // Add lessons to the progress object for easier access
            const completedLessons = progress.completedLessons.map((lessonId) => {
                return course.lessons.find((lesson) => lesson._id.toString() === lessonId.toString());
            });
    
            // Calculate the total progress percentage
            const totalLessons = course.lessons.length;
            const completedLessonsCount = completedLessons.filter(Boolean).length;  // Count non-null lessons
            const overallProgress = (completedLessonsCount / totalLessons) * 100;
    
            // Return the progress along with lesson details
            return res.status(200).json({
                message: "Progress retrieved successfully.",
                progress: {
                    student: progress.student,
                    course: progress.course,
                    completedLessons: completedLessons,  // Send full lesson details
                    progressPercentage: overallProgress,
                    completedQuizzes: progress.completedQuizzes,  // Include completed quizzes as well
                }
            });
        } catch (error) {
            console.error("Error in progressController - getProgress:", error);
            res.status(500).json({ message: "Failed to retrieve progress.", error: error.message });
        }
    }
       
    
};

export default progressController;
