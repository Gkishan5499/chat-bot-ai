import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./models/User.js";

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@botflow.io";
    const password = "Admin@BotFlow2024";
    const hashed = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
        { email },
        {
            name: "BotFlow Admin",
            email,
            password: hashed,
            isAdmin: true,
            isActive: true,
        },
        { upsert: true, new: true }
    );

    process.exit(0);
}

run();
