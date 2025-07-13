import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(403).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authMiddleware;
