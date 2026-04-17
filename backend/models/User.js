import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    apiKey: { type: String, unique: true },
    customPrompt: { type: String, default: "You are a helpful assistant. Keep replies short and direct." },
    botName: { type: String, default: "AI Assistant" },
    botColor: { type: String, default: "#4F46E5" },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

}, { timestamps: true }
)
export default mongoose.model("User", userSchema);