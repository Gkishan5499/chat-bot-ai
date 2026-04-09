import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import LoginLog from "../models/LoginLog.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const apiKey = crypto.randomBytes(24).toString("hex");

        const user = await User.create({ name, email, password: hashed, apiKey });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, apiKey, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            await LoginLog.create({ email, ip, success: false, reason: "User not found" });
            return res.status(400).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            await LoginLog.create({ email, ip, success: false, reason: "Wrong password" });
            return res.status(400).json({ error: "Wrong password" });
        }

        // Log successful login
        await LoginLog.create({ email, ip, success: true, reason: "Login successful" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, apiKey: user.apiKey, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;