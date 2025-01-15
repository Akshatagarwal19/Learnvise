import Course from "../models/Course.js";

const toggleFreeStatus = async (req, res) => {
    try {
        const { courseId, sectionId, lessonId } = req.params;
        const { isFree } = req.body;

        if (typeof isFree !== "boolean") {
            return res.status(400).json({ message: "'isFree' must be explicitly true or false." });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        if (sectionId) {
            const section = course.sections.id(sectionId);
            if (!section) {
                return res.status(404).json({ message: "Section not found." });
            }

            if (lessonId) {
                const lesson = section.lessons.id(lessonId);
                if (!lesson) {
                    return res.status(404).json({ message: "Lesson not found." });
                }
                // Update free status for the specific lesson
                lesson.isFree = isFree;
            } else {
                // Update free status for the section
                section.isFree = isFree;
            }
        } else {
            // Optionally, handle free status for the entire course (if needed)
            return res.status(400).json({ message: "Course-level free access is not supported." });
        }

        await course.save();

        res.status(200).json({
            message: "Free status updated successfully.",
            course, // Return updated course or specific data for frontend convenience
        });
    } catch (error) {
        console.error("Error updating free status:", error.message);
        res.status(500).json({ message: "Failed to update free status", error: error.message });
    }
};

export default toggleFreeStatus;
