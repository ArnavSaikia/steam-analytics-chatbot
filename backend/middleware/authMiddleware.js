const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user (exclude password)
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = user;

            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
};

module.exports = { protect };