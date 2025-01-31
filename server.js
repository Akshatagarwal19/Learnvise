import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import enrollmentRoutes from "./src/routes/enrollmentRoutes.js"
import progressRoutes from "./src/routes/progressRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import QuizRoutes from "./src/routes/QuizRoutes.js";
import CertificateRoutes from "./src/routes/CertificateRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { storage } from './src/config/multer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

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
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);  // Course-related routes
app.use("/api/categories", categoryRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/Quiz", QuizRoutes);
app.use("/api/certificate", CertificateRoutes);
// Static Route to expose certificate folder to browser for download
app.use("/certificates", express.static("certificates"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
