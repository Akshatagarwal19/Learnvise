import mongoose from 'mongoose';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import Enrollment from './src/models/Enrollment.js';

const createMockData = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/CWEBDB');

        console.log("Connected to database.");

        // 1. Create mock users (students)
        const students = [];
        for (let i = 0; i < 200; i++) {
            const student = new User({
                username: `Student ${i + 1}`,
                email: `student${i + 1}@example.com`,
                password: 'password123', // Ideally hashed in production
                role: 'Student',
            });
            students.push(student.save());
        }

        const savedStudents = await Promise.all(students);
        console.log(`${savedStudents.length} mock students created.`);

        // 2. Fetch existing courses
        const courses = await Course.find().limit(5); // Fetch a few courses for testing
        if (!courses.length) {
            console.log("No courses found. Add courses before running this script.");
            return;
        }

        console.log(`${courses.length} courses found for enrollment.`);

        // 3. Create mock enrollments
        const enrollments = [];
        savedStudents.forEach((student, index) => {
            const course = courses[index % courses.length]; // Assign students to courses in a round-robin fashion
            const enrollment = new Enrollment({
                student: student._id,
                course: course._id,
                progress: 0,
                enrolledAt: new Date(),
                mockPurchases: { status: "Success" },
            });
            enrollments.push(enrollment.save());
        });

        const savedEnrollments = await Promise.all(enrollments);
        console.log(`${savedEnrollments.length} mock enrollments created.`);

        console.log("Mock data creation complete.");
        process.exit();
    } catch (error) {
        console.error("Error creating mock data:", error.message);
        process.exit(1);
    }
};

createMockData();
