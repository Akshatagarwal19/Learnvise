import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import enrollmentRoutes from "./src/routes/enrollmentRoutes.js"
import progressRoutes from "./src/routes/progressRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
// import paymentRoutes from "./src/routes/paymentRoutes.js";
// import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

app.use(cookieParser());
// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    // allowedHeaders: "Content-Type,Authorization",
    credentials: true,
}));
app.use(bodyParser.json());

// Database Connection
connectDB();

app.get('/', (req, res) => {
    console.log("welcome to my api")
    res.send('Welcome to this API');
});
// Routes
app.use("/api/auth", authRoutes);        // Authentication-related routes
app.use("/api/courses", courseRoutes);  // Course-related routes
app.use("/api/categories", categoryRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
// app.use("/api/payment", paymentRoutes); //Payment-related routes
// app.use("/api/users", userRoutes);      // User profile-related routes

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
