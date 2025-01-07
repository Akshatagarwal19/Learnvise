// import Course from "../models/Course.js";
import FreeAccess from "../models/FreeAccess.js";

const toggleFreeStatus = async (req ,res) => {
    try {
        const { courseId, sectionId, lessonId } = req.params;
        const { isFree } = req.body;

        const query = { courseId };
        if (sectionId) query.sectionId = sectionId;
        if (lessonId) query.lessonId = lessonId;

        const freeAccess = await FreeAccess.findOneAndUpdate(
            query,
            { isFree },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Free status updated successfully.",
            freeAccess,
        });
    } catch (error) {
        console.error("Error updating free status:", error.message);
        res.status(500).json({ message: "Failed to update free status", error: error.message });
    }
};

export default toggleFreeStatus;