import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model fallback list. Override with GEMINI_MODELS in .env, comma-separated.
const DEFAULT_MODEL_FALLBACKS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
];

const MODEL_FALLBACKS = (process.env.GEMINI_MODELS || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

const ACTIVE_MODEL_FALLBACKS = MODEL_FALLBACKS.length ? MODEL_FALLBACKS : DEFAULT_MODEL_FALLBACKS;
const MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 2048);

function buildSystemPrompt(userPrompt) {
    const basePrompt = String(userPrompt || "You are a helpful assistant.").trim();
    return `${basePrompt}\n\nStyle rules: Reply in one short paragraph only. Use 1-2 sentences maximum unless the user explicitly asks for more detail. Avoid bullet points, long explanations, and marketing-style text.`;
}

async function sendWithFallback(systemPrompt, chatHistory, message) {
    let lastError;
    for (const modelName of ACTIVE_MODEL_FALLBACKS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: buildSystemPrompt(systemPrompt),
            });
            const chat = model.startChat({
                history: chatHistory,
                generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
            });
            const result = await chat.sendMessage([{ text: message }]);
            return result.response.text();
        } catch (err) {
            console.warn(`Model ${modelName} failed:`, err.message);
            lastError = err;
            // Keep trying fallback models. We'll return the last error if all fail.
            continue;
        }
    }
    throw lastError;
}

function buildGeminiHistory(history) {
    if (!Array.isArray(history)) return [];

    const normalized = history
        .map((msg) => {
            const text = String(msg?.content ?? "").trim();
            if (!text) return null;

            const role = msg?.role === "assistant" || msg?.role === "model" ? "model" : "user";
            return { role, parts: [{ text }] };
        })
        .filter(Boolean);

    // Gemini startChat requires the first history item to be user.
    while (normalized.length && normalized[0].role !== "user") {
        normalized.shift();
    }

    return normalized;
}

router.post("/", async (req, res) => {
    try {
        const { message, apiKey, visitorId, history = [] } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Server AI key is missing. Add GEMINI_API_KEY in backend .env." });
        }

        if (!message || !String(message).trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!apiKey) {
            return res.status(401).json({ error: "API key is required" });
        }

        const user = await User.findOne({ apiKey });
        if (!user) return res.status(401).json({ error: "Invalid API key" });

        if (!user.isActive) return res.status(403).json({ error: "This bot has been disabled." });

        const chatHistory = buildGeminiHistory(history);

        const reply = await sendWithFallback(user.customPrompt, chatHistory, String(message).trim());

        // Save to DB
        await Chat.findOneAndUpdate(
            { userId: user._id, visitorId: visitorId || "web-visitor" },
            {
                $push: {
                    messages: [
                        { role: "user", content: String(message).trim(), timestamp: new Date() },
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
        if (err.message?.includes("API key") || err.message?.includes("invalid") || err.message?.includes("Invalid API key")) {
            return res.status(401).json({ error: "AI provider key is invalid. Check GEMINI_API_KEY." });
        }
        if (err.message?.includes("404") || err.message?.includes("not found") || err.message?.includes("models/")) {
            return res.status(502).json({ error: "Configured AI model is unavailable. Please update model names in backend." });
        }
        if (err.message?.includes("503") || err.message?.includes("high demand")) {
            return res.status(503).json({ error: "The AI service is temporarily overloaded. Please try again in a moment." });
        }
        if (err.message?.includes("429")) {
            return res.status(429).json({ error: "Rate limit reached. Please wait a moment and try again." });
        }
        res.status(500).json({ error: `Something went wrong. ${err.message || "Please try again."}` });
    }
});

export default router;