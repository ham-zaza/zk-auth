// src/services/chaumPedersenVerifier.js
import { ZKP_PARAMS } from '../config/zkpParams.js';
import modExp from '../utils/modExp.js';

/**
 * Verifies a Chaum-Pedersen Zero-Knowledge Proof
 *
 * USER KNOWS secret 'x' and has TWO public values:
 *   - y = g^x mod p
 *   - z = h^x mod p   (h is a second generator)
 *
 * PROOF CONTAINS:
 *   - a = g^k mod p          (first commitment)
 *   - b = h^k mod p          (second commitment)
 *   - c = challenge (from server, random)
 *   - r = k + c * x mod q    (response)
 *
 * VERIFIER CHECKS:
 *   1. g^r ≟ a * (y^c) mod p
 *   2. h^r ≟ b * (z^c) mod p
 *
 * If BOTH are true → proof is VALID!
 */

export function verifyChaumPedersen(proof, y, z) {
    const { p, q, g, h } = ZKP_PARAMS; // 🔥 Now using 'h' too!
    const { a, b, c, r } = proof;

    // 🔢 STEP 1: Validate input ranges
    if (a <= 0n || a >= p || b <= 0n || b >= p) {
        console.log("❌ Proof failed: a or b out of range [1, p-1]");
        return false;
    }
    if (c < 0n || c >= q || r < 0n || r >= q) {
        console.log("❌ Proof failed: c or r out of range [0, q-1]");
        return false;
    }

    // 🔢 STEP 2: Verify Equation 1 → g^r == a * (y^c) mod p
    const left1 = modExp(g, r, p);           // g^r mod p
    const yToC = modExp(y, c, p);            // y^c mod p
    const right1 = (a * yToC) % p;           // a * y^c mod p

    // 🔢 STEP 3: Verify Equation 2 → h^r == b * (z^c) mod p
    const left2 = modExp(h, r, p);           // h^r mod p
    const zToC = modExp(z, c, p);            // z^c mod p
    const right2 = (b * zToC) % p;           // b * z^c mod p

    // 🔍 STEP 4: Final check
    const valid1 = left1 === right1;
    const valid2 = left2 === right2;

    if (valid1 && valid2) {
        console.log("✅ ZKP VERIFIED SUCCESSFULLY!");
        return true;
    } else {
        console.log("❌ ZKP VERIFICATION FAILED!");
        console.log("Equation 1 (g^r = a·y^c):", valid1 ? "✅" : "❌");
        console.log("Equation 2 (h^r = b·z^c):", valid2 ? "✅" : "❌");
        return false;
    }
}