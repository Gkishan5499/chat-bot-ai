import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "./models/User.js";

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Hash the password properly using bcrypt
    const hashed = await bcrypt.hash("password", 10);
    const newApiKey = crypto.randomBytes(24).toString("hex");

    await User.findOneAndUpdate(
        { email: "demo@botflow.io" },
        {
            name: "Demo User",
            email: "demo@botflow.io",
            password: hashed,
            apiKey: newApiKey,
            customPrompt: "You are a helpful AI assistant for BotFlow. Keep replies short, direct, and under 3 sentences.",
            botName: "Agent Smith",
            botColor: "#4F46E5"
        },
        { upsert: true }
    );
    console.log("SUCCESS: Created fully authenticated dummy user!");
    console.log("Email: demo@botflow.io");
    console.log("Password: password");
    process.exit(0);
}
run();
