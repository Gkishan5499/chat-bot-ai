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

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-bot-ai-one-smoky.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.options(/.*/, cors()); // Handle preflight - regex works in all Express versions



// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use("/api/auth", authRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("API WORKING ✅");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.log("Database is not connected", error)
})

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})