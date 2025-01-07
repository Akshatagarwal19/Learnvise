import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await  User.findOne({ email });

            if (!user) {
                return  res.status(401).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials wrong password" });
            }

            const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '4h' });
            res.cookie("authToken", token, {
                httpOnly: false, // Secure: Prevent client-side access
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax", // Use secure cookies in production
                maxAge: 3600000, // 1 hour in milliseconds
            });
            res.status(200).json({ message : "Login Successfull" });
        } catch (error) {
            console.error("Error during login:", error.message);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    signup: async (req, res) => {
        const { username, email, password, role } = req.body;

        try{
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: "User already exists Please login" })
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                role: role || "Student",
            });

            await newUser.save();

            res.status(201).json({
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            });
        } catch (error) {
            console.error("Error during signup:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
};

export default authController;
