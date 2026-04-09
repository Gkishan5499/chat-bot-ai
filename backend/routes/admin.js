import express from "express";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import LoginLog from "../models/LoginLog.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/admin/stats — platform overview
router.get("/stats", requireAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const activeUsers = await User.countDocuments({ isAdmin: false, isActive: true });
        const totalChats = await Chat.countDocuments();
        const totalMessages = await Chat.aggregate([
            { $project: { count: { $size: "$messages" } } },
            { $group: { _id: null, total: { $sum: "$count" } } }
        ]);

        res.json({
            totalUsers,
            activeUsers,
            totalChats,
            totalMessages: totalMessages[0]?.total || 0,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/users — list all users
router.get("/users", requireAdmin, async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false })
            .select("-password")
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/admin/users/:id/toggle — enable/disable user
router.patch("/users/:id/toggle", requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.isActive = !user.isActive;
        await user.save();
        res.json({ isActive: user.isActive });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/admin/users/:id — delete user
router.delete("/users/:id", requireAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Chat.deleteMany({ userId: req.params.id });
        res.json({ message: "User and their chats deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/chats — recent chats across all users
router.get("/chats", requireAdmin, async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate("userId", "name email botName")
            .sort({ updatedAt: -1 })
            .limit(50);
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/logs — login attempt logs
router.get("/logs", requireAdmin, async (req, res) => {
    try {
        const logs = await LoginLog.find()
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
