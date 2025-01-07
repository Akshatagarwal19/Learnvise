import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const enrollmentController = {
  enrollInCourse: async (req, res) => {
    const { courseId } = req.params; 
    const studentId = req.user.id; 
  
    try {
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
      if (existingEnrollment) {
        return res.status(400).json({ message: "Student is already enrolled in this course" });
      }
  
      const mockPurchase = {
        transactionId: `TXN-${Date.now()}`, 
        amount: course.price, 
        status: "Success", 
        purchasedAt: new Date(), 
      };
  
      const enrollment = new Enrollment({
        student: studentId,
        course: courseId,
        enrolledAt: new Date(),
        progress: 0,
        mockPurchase, // Store the mock purchase data in the enrollment
      });
  
      await enrollment.save();
  
      res.status(201).json({
        success: true,
        message: "Enrollment successful",
        enrollment,
      });
    } catch (error) {
      console.error("Error enrolling student:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to enroll in course",
        error: error.message,
      });
    }
  },
  
  getEnrolledStudents: async (req, res) => {
    const { courseId } = req.params;
    const instructorId = req.user.id;

    try {
      const course = await Course.findById(courseId);
      if(!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if(course.instructor.toString() !== instructorId) {
        return res.status(404).json({ message: "Unauthorised : You are  not the instructor"});
      }

      const enrollments = await Enrollment.find({ course: courseId }).populate("student", "name email").select("student enrolledAt");

      if (enrollments.length === 0 ) {
        return res.status(404).json({ message: "No Students enrolled in this course."})
      }

      const enrollmentCount = enrollments.length;
      let baseCommision = 10;
      let additionalCommission = 0;

      if (enrollmentCount > 100) additionalCommission += 1;
      if (enrollmentCount > 500) additionalCommission += 2;
      if (enrollmentCount > 1000) additionalCommission += 5;

      const totalCommission = baseCommision + additionalCommission;

      res.status(200).json({
        success: true,
        message: "Enrolled students retrieved successfully",
        enrollmentCount,
        commission: totalCommission,
        enrollments,
      });
    } catch (error) {
      console.error("Error retrieving enrolled students:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve enrolled students",
        error: error.message,
      })
    }
  },

  getEnrollmentDetails: async (req, res) => {
    const studentId = req.user.id; // Extracted from the token in the middleware

    try {
      const enrollments = await Enrollment.find({
        student: studentId,
      }).populate("course");

      if (!enrollments || enrollments.length === 0) {
        return res
          .status(404)
          .json({ message: "No enrollments found for this user" });
      }

      res
        .status(200)
        .json({ message: "Enrollments retrieved successfully", enrollments });
    } catch (error) {
      console.error("Error fetching enrollments:", error.message);
      res
        .status(500)
        .json({ message: "Failed to fetch enrollments", error: error.message });
    }
  },

  checkEnrollmentStatus: async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
      const enrollment = await Enrollment.findOne({
        student: userId,
        course: courseId,
      });

      if (!enrollment) {
        return res
          .status(200)
          .json({
            isEnrolled: false,
            message: "User is not enrolled in this course",
          });
      }

      return res
        .status(200)
        .json({ isEnrolled: true, message: "User is enrolled in this course" });
    } catch (error) {
      console.error("Error checking enrollment status:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to check enrollment status",
        error: error.message,
      });
    }
  }
};

export default enrollmentController;
