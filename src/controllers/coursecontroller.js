import Course from "../models/Course.js";
import Category from "../models/Category.js";
import uploadToCloudinary from "../utils/cloudinaryUploader.js";

const courseController = {
  createCourse: async (req, res) => {
    const { title, description, price, language, level, category } = req.body;
    const instructorId = req.user.id; // Assuming `req.user` is populated by authentication middleware

    console.log("Request Body:", req.body);
    console.log("Multer File Object:", req.file);

    const durationLimits = {
      Beginner: 20,
      Intermediate: 40,
      Advanced: 60,
    };

    try {
      if (
        !title ||
        !description ||
        !price ||
        !language ||
        !level ||
        !category
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Thumbnail file is required" });
      }

      if (!durationLimits[level]) {
        return res.status(400).json({ message: "Invalid course Level" });
      }

      // Find category by name
      const existingCategory = await Category.findOne({ name: category });
      if (!existingCategory) {
        return res.status(400).json({ message: "Invalid category name" });
      }

      let thumbnailUrl;
      try {
        const resourceType = req.file.mimetype.startsWith("image/")
          ? "image"
          : "auto";
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "thumbnails",
          resourceType
        );
        thumbnailUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Thumbnail upload failed:", error.message);
        return res.status(500).json({ message: "Failed to upload thumbnail" });
      }

      const course = new Course({
        title,
        description,
        price,
        language,
        level,
        thumbnail: thumbnailUrl,
        instructor: instructorId,
        category: existingCategory._id,
        totalDuration: 0,
        durationLimit: durationLimits[level],
      });

      const savedCourse = await course.save();
      return res
        .status(201)
        .json({ message: "Course created successfully", course: savedCourse });
    } catch (error) {
      console.error("Error creating course:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to create course", error: error.message });
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find()
        .populate("category")
        .populate("instructor");
      res
        .status(200)
        .json({ message: "Courses retrieved successfully", courses });
    } catch (error) {
      console.error("Error retrieving courses:", error.message);
      res
        .status(500)
        .json({ message: "Failed to retrieve courses", error: error.message });
    }
  },

  getCourseById: async (req, res) => {
    const { id } = req.params;

    try {
      const course = await Course.findById(id)
        .populate("category")
        .populate("instructor");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res
        .status(200)
        .json({ message: "Course retrieved  successfully", course });
    } catch (error) {
      console.error("Error retrieving course:", error.message);
      res
        .status(500)
        .json({ message: "failed to retrieve course", error: error.message });
    }
  },

  updateCourse: async (req, res) => {
    const { id } = req.params;

    try {
      const updates = req.body;

      if (updates.category) {
        const existingCategory = await Category.findById(updates.category);
        if (!existingCategory) {
          return res.status(400).json({ message: "Invalid category Id" });
        }
      }

      if (req.file) {
        const cloudinaryResponse = await uploadToCloudinary(
          req.file.buffer,
          "course_thumbnails"
        );
        updates.thumbnail = cloudinaryResponse.secure_url;
      }

      const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Error updating course:", error.message);
      res
        .status(500)
        .json({ message: "Failed to update course", error: error.message });
    }
  },

  deleteCourse: async (req, res) => {
    const { id } = req.params;

    try {
      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error.message);
      res
        .status(500)
        .json({ message: "Failed to delete course", error: error.message });
    }
  },

  // lesson related methods
  addLesson: async (req, res) => {
    try {
      const { title, description, price, contentType, duration, quiz } =
        req.body;
      const { courseId } = req.params;

      if (!title || !description || !contentType || !duration) {
        return res
          .status(400)
          .json({
            message:
              "Title, description, content type, and duration are required.",
          });
      }

      if (!req.file) {
        return res.status(400).json({ message: "File is required." });
      }

      const { buffer, mimetype } = req.file;
      const resourceType = mimetype.startsWith("video/")
        ? "video"
        : mimetype === "application/pdf" ||
          mimetype === "application/vnd.ms-excel" ||
          mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ? "raw"
        : null;

      console.log("Resource Type:", resourceType);
      if (!resourceType) {
        return res
          .status(400)
          .json({
            message:
              "Invalid file type. Only video, pdf, or excel files are supported.",
          });
      }

      const uploadResult = await uploadToCloudinary(
        buffer,
        "lesson_files",
        resourceType
      );
      console.log("Cloudinary Upload Result:", uploadResult);

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }

      // Set time limits based on course level
      let timeLimit;
      if (course.level === "Beginner") {
        timeLimit = 20;
      } else if (course.level === "Intermediate") {
        timeLimit = 40;
      } else if (course.level === "Advanced") {
        timeLimit = 60;
      }

      // Initialize the new lesson
      const newLesson = {
        title,
        contentType,
        fileUrl: uploadResult.secure_url,
        description,
        price: course.level === "Advanced" ? price : 0, // Only advanced courses can have paid lessons
        isFree: false,
        timeLimit,
        duration,
      };

      // Save the lesson and get its ID
      course.lessons.push(newLesson);
      await course.save();

      const addedLesson = course.lessons[course.lessons.length - 1]; // Retrieve the added lesson

      // If a quiz is provided, validate and create it
      if (quiz && quiz.questions && quiz.questions.length > 0) {
        const { questions } = quiz;

        if (questions.length > 10) {
          return res
            .status(400)
            .json({ message: "A quiz can have a maximum of 10 questions." });
        }

        const formattedQuestions = questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctOption: q.correctOption,
        }));

        const newQuiz = new Quiz({
          lesson: addedLesson._id,
          questions: formattedQuestions,
        });

        await newQuiz.save();
        addedLesson.quiz = newQuiz._id; // Associate the quiz with the lesson
      }

      await course.save();

      res
        .status(201)
        .json({ message: "Lesson added successfully.", lesson: addedLesson });
    } catch (error) {
      console.error("Error adding lesson:", error.message);
      res
        .status(500)
        .json({ message: "Failed to add lesson.", error: error.message });
    }
  },

  updateLesson: async (req, res) => {
    try {
      const { title, duration } = req.body;
      const { courseId, sectionId, lessonId } = req.params;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(404).json({ message: "Section not found." });
      }
      const lesson = section.lessons.id(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found." });
      }
      if (title) lesson.title = title;
      if (duration) lesson.duration = parseFloat(duration);
      if (req.file) {
        const { buffer, mimetype } = req.file;
        const resourceType = mimetype.startsWith("video/") ? "video" : null;
        if (!resourceType) {
          return res.status(400).json({
            message: "Invalid file type. Only video files are supported.",
          });
        }
        const uploadResult = await uploadToCloudinary(
          buffer,
          "lesson_videos",
          resourceType
        );
        lesson.videoUrl = uploadResult.secure_url;
      }
      await course.save();
      res.status(200).json({ message: "Lesson updated successfully.", lesson });
    } catch (error) {
      console.error("Error updating lesson:", error.message);
      res
        .status(500)
        .json({ message: "Failed to update lesson.", error: error.message });
    }
  },

  deleteLesson: async (req, res) => {
    try {
      const { courseId, sectionId, lessonId } = req.params;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(404).json({ message: "Section not found." });
      }
      const lessonIndex = section.lessons.findIndex(
        (lesson) => lesson._id.toString() === lessonId
      );
      if (lessonIndex === -1) {
        return res.status(404).json({ message: "Lesson not found." });
      }
      section.lessons.splice(lessonIndex, 1);
      await course.save();
      res.status(200).json({ message: "Lesson deleted successfully." });
    } catch (error) {
      console.error("Error deleting lesson:", error.message);
      res
        .status(500)
        .json({ message: "Failed to delete lesson.", error: error.message });
    }
  },

  getLessons: async (req, res) => {
    const { courseId, sectionId } = req.params;

    try {
      const course = await Course.findById(courseId).populate(
        "sections.lessons"
      );
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }

      res.status(200).json({ lessons: section.lessons });
    } catch (error) {
      console.error("Error retrieving lessons:", error.message);
      res
        .status(500)
        .json({ message: "Failed to retrieve lessons", error: error.message });
    }
  },

  getLesson: async (req, res) => {
    try {
      const { courseId, sectionId, lessonId } = req.params;
      const user = req.user;
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }

      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }

      if (
        course.instructor.toString() === user.id ||
        ["Manager", "Admin", "Owner"].includes(user.role)
      ) {
        const lesson = section.lessons.id(lessonId);
        if (!lesson) {
          return res.status(404).json({ message: "Lesson not found" });
        }
        return res
          .status(200)
          .json({ message: "Lesson retrieved successfully.", lesson });
      }

      const freeAccess = await FreeAccess.findOne({
        courseId,
        sectionId,
        lessonId,
      });
      const isFree = freeAccess ? freeAccess.isFree : false;

      if (!isFree) {
        return res.status(403).json({
          message:
            "Access denied. This lesson is not free, and you do not have permission to access it.",
        });
      }
      const lesson = section.lessons.id(lessonId);
      res
        .status(200)
        .json({ message: "Lesson retrieved successfully.", lesson });
    } catch (error) {
      console.error("Error fetching lesson:", error.message);
      res
        .status(500)
        .json({ message: "Failed to fetch lesson.", error: error.message });
    }
  },
};

export default courseController;
