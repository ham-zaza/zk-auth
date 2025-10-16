import express from "express";
import { registerUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// ✅ Register new user (POST)
router.post("/register", registerUser);

// ✅ Get all users (GET)
router.get("/", getAllUsers);

export default router;
