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
  "http://localhost:5174",
  "http://localhost:5175",
  "https://chat-bot-ai-orcin.vercel.app"
];

const isLocalhostOrigin = (origin) => /^http:\/\/localhost:\d+$/.test(origin);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Handle preflight with the same origin policy

// Public chat endpoint - allow all origins since it's a public widget
const publicCorsOptions = {
  origin: "*",
  credentials: false
};
app.options("/api/chat", cors(publicCorsOptions));

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use("/api/auth", authRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/chat", cors(publicCorsOptions), chatRoutes);
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