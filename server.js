import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/users", userRoutes); // ✅ note: /api/users, not just /api

// ✅ DEBUG route to test server
app.get("/debug", (req, res) => {
    res.json({
        message: "Debug route works!",
        timestamp: new Date().toISOString(),
    });
});

// ✅ Root route
app.get("/", (req, res) => {
    res.send("ZK-Auth backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Server listening on http://localhost:${PORT}`);
});
