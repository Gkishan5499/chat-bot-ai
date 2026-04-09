import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors"

import authRoutes from "./routes/auth.js";
import botRoutes from "./routes/bot.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(express.json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options(/.*/, cors()); // Handle preflight - regex works in all Express versions



// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use("/api/auth", authRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.log("Database is not connected", error)
})

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})