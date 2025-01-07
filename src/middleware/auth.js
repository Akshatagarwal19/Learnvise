import jwt from "jsonwebtoken";

const ROLE_HIERARCHY = {
    Owner: 3,
    Manager: 2,
    Instructor: 1,
    Student: 0,
};
const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Payload:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

/**
 * Middleware to authorize access based on user roles.
 * @param {string} minRole - The minimum required role.
 */
const authorize = (minRole) => {
    return (req, res, next) => {
        const userRole = req.user?.role; // Extract user role from `req.user`
        
        if (!userRole || !(userRole in ROLE_HIERARCHY)) {
            return res.status(403).json({ message: "Access denied: Role not recognized" });
        }

        if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minRole]) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }

        next();
    };
};


export default { authenticate, authorize };
