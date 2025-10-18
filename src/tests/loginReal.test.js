// src/tests/loginReal.test.js
import fetch from 'node-fetch';

// 🔑 PASTE YOUR VALUES HERE (from verifier test output!)
const USERNAME = 'zkp_user_1760825176889'; // ← YOUR username
const PROOF = {
    a: "11196187812524768586064218974492394649500049443937269167968648938676871527393",
    b: "35731605468657991598792381857660295464689365160307633838141976057223313244424",
    c: "999",
    r: "12400545"
};

// 🌐 Send login request
async function testLogin() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME, proof: PROOF })
        });

        const result = await response.json();
        console.log("🔐 LOGIN RESULT:", result);
    } catch (err) {
        console.error("💥 Network error:", err.message);
    }
}

// ▶️ Run it
testLogin();