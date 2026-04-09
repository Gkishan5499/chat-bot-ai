import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};

export const requireAdmin = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || !user.isAdmin)
            return res.status(403).json({ error: "Admin access required" });
        req.userId = decoded.id;
        req.adminUser = user;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};