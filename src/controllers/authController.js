// src/controllers/authController.js
import User from '../models/User.js';
import { ZKP_PARAMS } from '../config/zkpParams.js';
import modExp from '../utils/modExp.js';

// ✅ Import crypto properly for ESM
import { createHash } from 'crypto';

const { p, q, g, h } = ZKP_PARAMS;

// ── 1. User Registration ───────────────────────────────
export const registerUser = async (req, res) => {
    console.log("✅ Register route called!");
    console.log("Request body:", req.body);

    try {
        const { username, publicKeyY, publicKeyZ } = req.body;

        if (!username || !publicKeyY) {
            return res.status(400).json({ message: "Username and publicKeyY are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, publicKeyY, publicKeyZ });
        await newUser.save();

        console.log("✅ User saved:", newUser);
        res.status(201).json({ message: "User registered successfully!", user: newUser });

    } catch (error) {
        console.error("❌ Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ── 2. List Users (for testing)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-__v");
        res.status(200).json({ message: "Users fetched!", count: users.length, users });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

// ── 3. Non-Interactive ZKP Login ───────────────────────
export const verifyProof = async (req, res) => {
    console.log("🔍 RAW REQUEST BODY:", req.body);

    const { username, a, b, s, domain, timestamp } = req.body;

    if (!username || !a || !b || !s || !domain || !timestamp) {
        return res.status(400).json({ error: "Missing proof components" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!user.publicKeyY || !user.publicKeyZ) {
            return res.status(400).json({ error: "User missing public keys" });
        }

        const A = BigInt(a);
        const B = BigInt(b);
        const S = BigInt(s);
        const Y = BigInt(user.publicKeyY);
        const Z = BigInt(user.publicKeyZ);

        // 🔁 Compute c = H(g, h, Y, Z, A, B, domain, timestamp)
        const hash = createHash('sha256')
            .update(g.toString())
            .update(h.toString())
            .update(Y.toString())
            .update(Z.toString())
            .update(A.toString())
            .update(B.toString())
            .update(domain)
            .update(timestamp.toString())
            .digest();
        const C = BigInt('0x' + hash.toString('hex')) % q;

        // 🔢 Verify equations
        const left1 = modExp(g, S, p);
        const right1 = (A * modExp(Y, C, p)) % p;

        const left2 = modExp(h, S, p);
        const right2 = (B * modExp(Z, C, p)) % p;

        if (left1 === right1 && left2 === right2) {
            return res.json({ message: "✅ Login successful!" });
        } else {
            return res.status(401).json({ error: "❌ Invalid proof" });
        }
    } catch (err) {
        console.error("💥 Verification crash:", err);
        return res.status(500).json({ error: "Verification crashed", details: err.message });
    }
};