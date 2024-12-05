import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import auth from "./middleware/auth.js";
import ownerRoutes from "./routes/owner.js";
import managerRoutes from "./routes/manager.js";
import instructorRoutes from "./routes/instructor.js";
import studentRoutes from "./routes/student.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    password: String,
    role: String,
}));

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password }); // Await for database query
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" }); // Send proper response for invalid user
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.use("/owner", auth.authenticate, auth.authorize(["Owner"]), ownerRoutes);
app.use("/manager", auth.authenticate, auth.authorize(["Manager", "Owner"]), managerRoutes);
app.use("/instructor", auth.authenticate, auth.authorize(["Instructor", "Manager", "Owner"]), instructorRoutes);
app.use("/student", auth.authenticate, auth.authorize(["Student", "Instructor", "Manager", "Owner"]), studentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
