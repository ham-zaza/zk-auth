// src/tests/loginReal.test.js
import fetch from 'node-fetch';
import { ZKP_PARAMS } from '../config/zkpParams.js';
import modExp from '../utils/modExp.js';

const { p, q, g, h } = ZKP_PARAMS;

// 🔑 MUST match your registered user!
const USERNAME = "zkp_user_1761165536075";
const SECRET_X = 12345n; // ← same as in chaumPedersenVerifier.test.js

async function zkpLogin() {
    try {
        console.log("🔐 Starting REAL ZKP Login...");

        // 🔁 STEP 1: User generates commitment (a, b) using secret x
        const k = 67890n; // random nonce (in real app, generated fresh each time)
        const a = modExp(g, k, p).toString(); // a = g^k mod p
        const b = modExp(h, k, p).toString(); // b = h^k mod p

        console.log("1. Sending commitment (a, b) to get challenge...");
        const challengeRes = await fetch('http://localhost:3000/api/auth/challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ a, b })
        });

        const { c } = await challengeRes.json(); // ← server returns { c: "..." }
        if (!c) throw new Error("No challenge received");

        console.log("📋 Challenge c =", c);

        // 🔁 STEP 2: User computes response s = k + c*x mod q
        const cBig = BigInt(c);
        const s = (k + cBig * SECRET_X) % q;

        // 🔁 STEP 3: Get user's public keys from DB (in real app, stored locally)
        // For test, we recompute them (must match registration!)
        const y = modExp(g, SECRET_X, p).toString(); // publicKey
        const z = modExp(h, SECRET_X, p).toString(); // publicKeyZ

        console.log("2. Sending full proof to verify...");
        const verifyRes = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                a, b,
                c: c.toString(),
                s: s.toString(),
                publicKeyY: y,
                publicKeyZ: z
            })
        });

        const result = await verifyRes.json();
        console.log("✅ FINAL LOGIN RESULT:", result);

    } catch (err) {
        console.error("💥 Login failed:", err.message);
    }
}

zkpLogin();