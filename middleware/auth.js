import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Raw Authorization Header:", authHeader); 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token); // Extract token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Decoded Token Payload:", decoded);// Verify token
        req.user = decoded; // Attach decoded payload to `req.user`
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

export default { authenticate, authorize };
