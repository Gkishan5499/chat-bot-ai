import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    let user = await User.findOne({});
    if (!user) {
        user = await User.create({
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            apiKey: "sk-real-test-api-key-12345",
            customPrompt: "You are a helpful assistant. Keep replies short and direct.",
            botName: "AI Assistant",
            botColor: "#4F46E5"
        });
        console.log("Created dummy user.");
    }
    console.log("API_KEY:" + user.apiKey);
    process.exit(0);
}
run();
