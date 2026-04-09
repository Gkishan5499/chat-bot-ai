import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model fallback list — tries each in order if previous fails
const MODEL_FALLBACKS = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.0-pro",
];

async function sendWithFallback(systemPrompt, chatHistory, message) {
    let lastError;
    for (const modelName of MODEL_FALLBACKS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemPrompt,
            });
            const chat = model.startChat({
                history: chatHistory,
                generationConfig: { maxOutputTokens: 500 },
            });
            const result = await chat.sendMessage([{ text: message }]);
            return result.response.text();
        } catch (err) {
            console.warn(`Model ${modelName} failed:`, err.message);
            lastError = err;
            // Only retry on 503 or overload errors
            if (!err.message?.includes("503") && !err.message?.includes("overload") && !err.message?.includes("high demand")) {
                throw err;
            }
        }
    }
    throw lastError;
}

router.post("/", async (req, res) => {
    try {
        const { message, apiKey, visitorId, history = [] } = req.body;

        const user = await User.findOne({ apiKey });
        if (!user) return res.status(401).json({ error: "Invalid API key" });

        if (!user.isActive) return res.status(403).json({ error: "This bot has been disabled." });

        // Convert history format to Gemini format
        const chatHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const reply = await sendWithFallback(user.customPrompt, chatHistory, message);

        // Save to DB
        await Chat.findOneAndUpdate(
            { userId: user._id, visitorId },
            {
                $push: {
                    messages: [
                        { role: "user", content: message, timestamp: new Date() },
                        { role: "assistant", content: reply, timestamp: new Date() },
                    ]
                }
            },
            { upsert: true }
        );

        res.json({ reply });
    } catch (err) {
        console.error("Gemini API Error:", err);

        // Return a friendly error based on the type
        if (err.message?.includes("503") || err.message?.includes("high demand")) {
            return res.status(503).json({ error: "The AI service is temporarily overloaded. Please try again in a moment." });
        }
        if (err.message?.includes("429")) {
            return res.status(429).json({ error: "Rate limit reached. Please wait a moment and try again." });
        }
        res.status(500).json({ error: "Something went wrong. Please try again." });
    }
});

export default router;