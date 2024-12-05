import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    password: String,
    role: String,
}));

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({}); // Clear existing users

        await User.insertMany([
            { username: "Ram", password: "password", role: "Owner" },
            { username: "Shyam", password: "password", role: "Manager" },
            { username: "Valmiki", password: "password", role: "Instructor" },
            { username: "Arun", password: "password", role: "Student" },
        ]);

        console.log("User data seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
