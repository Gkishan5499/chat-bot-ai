import express from "express";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get bot settings
router.get("/settings", protect, async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
});

// Update bot settings
router.put("/settings", protect, async (req, res) => {
    const { customPrompt, botName, botColor } = req.body;
    const user = await User.findByIdAndUpdate(
        req.userId,
        { customPrompt, botName, botColor },
        { new: true }
    ).select("-password");
    res.json(user);
});

// Get chat history
router.get("/chats", protect, async (req, res) => {
    const chats = await Chat.find({ userId: req.userId })
        .sort({ updatedAt: -1 })
        .limit(50);
    res.json(chats);
});

// Get single conversation
router.get("/chats/:chatId", protect, async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.chatId, userId: req.userId });
        if (!chat) return res.status(404).json({ error: "Conversation not found" });
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Append a message to an existing conversation from dashboard
router.post("/chats/:chatId/messages", protect, async (req, res) => {
    try {
        const { content, role = "assistant" } = req.body;
        if (!content || !String(content).trim()) {
            return res.status(400).json({ error: "Message content is required" });
        }

        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.chatId, userId: req.userId },
            {
                $push: {
                    messages: {
                        role,
                        content: String(content).trim(),
                        timestamp: new Date(),
                    }
                }
            },
            { new: true }
        );

        if (!chat) return res.status(404).json({ error: "Conversation not found" });
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get dashboard stats
router.get("/stats", protect, async (req, res) => {
    try {
        const totalConversations = await Chat.countDocuments({ userId: req.userId });
        
        // Get recent chats for activity feed
        const recentChats = await Chat.find({ userId: req.userId })
            .sort({ updatedAt: -1 })
            .limit(5);

        const recentActivity = recentChats.map(c => ({
            title: `Chat with visitor ${c.visitorId.substring(0, 8)}`,
            time: c.updatedAt,
            alert: false
        }));

        res.json({
            totalConversations,
            resolutionRate: 84.2,
            avgResponseTime: "1.2s",
            recentActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;