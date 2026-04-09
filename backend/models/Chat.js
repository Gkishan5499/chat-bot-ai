import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    visitorId: String,
    messages: [{ role: String, content: String, timestamp: Date }],

}, { timestamps: true }
)
export default mongoose.model("Chat", chatSchema);