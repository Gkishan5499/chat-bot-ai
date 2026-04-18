import express from "express";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import LoginLog from "../models/LoginLog.js";
import Faq from "../models/Faq.js";
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

// GET /api/admin/faqs — list all FAQs for management
router.get("/faqs", requireAdmin, async (_req, res) => {
    try {
        const faqs = await Faq.find()
            .sort({ sortOrder: 1, createdAt: -1 })
            .lean();
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/admin/faqs — create FAQ
router.post("/faqs", requireAdmin, async (req, res) => {
    try {
        const { question, answer, keywords = [], minMatches = 1, isActive = true, showOnBot = true, sortOrder = 0 } = req.body;

        if (!question || !String(question).trim()) {
            return res.status(400).json({ error: "Question is required" });
        }
        if (!answer || !String(answer).trim()) {
            return res.status(400).json({ error: "Answer is required" });
        }

        const normalizedKeywords = Array.isArray(keywords)
            ? keywords.map((k) => String(k).trim().toLowerCase()).filter(Boolean)
            : String(keywords)
                .split(",")
                .map((k) => k.trim().toLowerCase())
                .filter(Boolean);

        const faq = await Faq.create({
            question: String(question).trim(),
            answer: String(answer).trim(),
            keywords: normalizedKeywords,
            minMatches: Math.max(1, Number(minMatches) || 1),
            isActive: Boolean(isActive),
            showOnBot: Boolean(showOnBot),
            sortOrder: Number(sortOrder) || 0,
            createdBy: req.userId,
        });

        res.status(201).json(faq);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/admin/faqs/:id — update FAQ
router.put("/faqs/:id", requireAdmin, async (req, res) => {
    try {
        const { question, answer, keywords, minMatches, isActive, showOnBot, sortOrder } = req.body;

        const update = {};
        if (question !== undefined) update.question = String(question).trim();
        if (answer !== undefined) update.answer = String(answer).trim();
        if (keywords !== undefined) {
            update.keywords = Array.isArray(keywords)
                ? keywords.map((k) => String(k).trim().toLowerCase()).filter(Boolean)
                : String(keywords)
                    .split(",")
                    .map((k) => k.trim().toLowerCase())
                    .filter(Boolean);
        }
        if (minMatches !== undefined) update.minMatches = Math.max(1, Number(minMatches) || 1);
        if (isActive !== undefined) update.isActive = Boolean(isActive);
        if (showOnBot !== undefined) update.showOnBot = Boolean(showOnBot);
        if (sortOrder !== undefined) update.sortOrder = Number(sortOrder) || 0;

        const faq = await Faq.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!faq) return res.status(404).json({ error: "FAQ not found" });

        res.json(faq);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/admin/faqs/:id — delete FAQ
router.delete("/faqs/:id", requireAdmin, async (req, res) => {
    try {
        const faq = await Faq.findByIdAndDelete(req.params.id);
        if (!faq) return res.status(404).json({ error: "FAQ not found" });
        res.json({ message: "FAQ deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
