// src/controllers/authController.js
import User from '../models/User.js';
import { verifyChaumPedersen } from '../services/chaumPedersenVerifier.js';

export const login = async (req, res) => {
    try {
        const { username, proof } = req.body;

        // 🔍 Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 🚨 TEMP: For Stage 2, we assume proof is VALID (we'll generate it below)
        // In Stage 3, proof comes from browser extension

        // 🔑 Get public keys
        const y = BigInt(user.publicKey);
        const z = BigInt(user.publicKeyZ);

        // 📦 Parse proof (convert strings to BigInt)
        const parsedProof = {
            a: BigInt(proof.a),
            b: BigInt(proof.b),
            c: BigInt(proof.c),
            r: BigInt(proof.r)
        };

        // ✅ Verify ZKP
        const isValid = verifyChaumPedersen(parsedProof, y, z);

        if (isValid) {
            return res.json({ message: "✅ Login successful!", user: { username: user.username } });
        } else {
            return res.status(401).json({ error: "❌ Invalid proof" });
        }

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};