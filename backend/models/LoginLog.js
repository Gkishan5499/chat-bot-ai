import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema({
    email: { type: String },
    ip: { type: String },
    success: { type: Boolean, default: false },
    reason: { type: String },
}, { timestamps: true });

export default mongoose.model("LoginLog", loginLogSchema);
