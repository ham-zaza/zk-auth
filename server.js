// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // 🔥 Import cors
import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from './src/routes/authRoutes.js';

// 🔥 Load environment variables FIRST
dotenv.config();

// ✅ Create Express app IMMEDIATELY after imports
const app = express();

// 🧰 Middleware
app.use(express.json());

// 🌐 Add CORS — allow requests from Chrome extension and localhost
app.use(cors({
    origin: [
        'http://localhost:3000',
        'chrome-extension://*' // ✅ Allows ALL Chrome extensions (safe for local dev)
    ],
    credentials: true
}));

// 🌐 Connect to MongoDB
connectDB();

// 🛣️ Register ALL routes AFTER app is created
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // ✅ Now SAFE!

// 🧪 Debug routes (keep these!)
app.get("/debug", (req, res) => {
    res.json({
        message: "Debug route works!",
        timestamp: new Date().toISOString(),
    });
});

app.get("/", (req, res) => {
    res.send("ZK-Auth backend running");
});

// ▶️ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Server listening on http://localhost:${PORT}`);
});