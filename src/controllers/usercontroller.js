import User from '../models/User.js';

const userController = {
    getStudents: async (req, res) => {
        try {
            const students = await User.find({ role: "Student" });
            res.status(200).json({
                count: students.length,
                users: students,
            });
        } catch (err) {
            res.status(500).json({ error: "Error Fetching Students" });
        }
    },

    getInstructors: async (req, res) => {
        try {
            const instructors = await User.find({ role: "Instructor" });
            res.status(200).json({
                count: instructors.length,
                users: instructors,
            });
        } catch (err) {
            res.status(500).json({ error: "Error Fetching Instructors" })
        }
    }
}

export default userController;