// src/controllers/authController.js
import User from '../models/User.js';
import { ZKP_PARAMS } from '../config/zkpParams.js';
import modExp from '../utils/modExp.js';
import cryptoNode from 'crypto';

const { p, q, g, h } = ZKP_PARAMS;

// Step 1: Receive (a, b) and send challenge c
export const getChallenge = async (req, res) => {
    try {
        const { a, b } = req.body;

        if (!a || !b) {
            return res.status(400).json({ error: "Missing a or b" });
        }

        // 🔥 Generate random challenge c ∈ [1, q-1] using Node.js crypto
        const randomBytes = cryptoNode.randomBytes(32);
        let c = BigInt('0x' + randomBytes.toString('hex')) % q;
        if (c === 0n) c = 1n;

        res.json({ c: c.toString() });
    } catch (err) {
        console.error("Challenge error:", err);
        return res.status(500).json({ error: "Challenge failed" });
    }
};

// Step 2: Verify full proof
export const verifyProof = async (req, res) => {
    try {
        const { a, b, c, s, publicKeyY, publicKeyZ } = req.body;

        if (!a || !b || !c || !s || !publicKeyY || !publicKeyZ) {
            return res.status(400).json({ error: "Missing proof components" });
        }

        const A = BigInt(a);
        const B = BigInt(b);
        const C = BigInt(c);
        const S = BigInt(s);
        const Y = BigInt(publicKeyY);
        const Z = BigInt(publicKeyZ);

        // 🔍 Verify: g^s == a * y^c (mod p)
        const left1 = modExp(g, S, p);
        const right1 = (A * modExp(Y, C, p)) % p;

        // 🔍 Verify: h^s == b * z^c (mod p)
        const left2 = modExp(h, S, p);
        const right2 = (B * modExp(Z, C, p)) % p;

        // 🔍 DEBUG LOGS ADDED HERE
        console.log("🔍 DEBUG VERIFIER INPUTS:");
        console.log("g^s mod p =", left1.toString());
        console.log("a * y^c mod p =", right1.toString());
        console.log("h^s mod p =", left2.toString());
        console.log("b * z^c mod p =", right2.toString());
        console.log("Match 1:", left1 === right1);
        console.log("Match 2:", left2 === right2);
        console.log("----------------------------------------");

        if (left1 === right1 && left2 === right2) {
            return res.json({ message: "✅ Login successful!" });
        } else {
            return res.status(401).json({ error: "❌ Invalid proof" });
        }
    } catch (err) {
        console.error("Verify error:", err);
        return res.status(500).json({ error: "Verification failed" });
    }
};