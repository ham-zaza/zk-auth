# 🧾 ZK-Auth — Changelog

A privacy-preserving passwordless authentication system using Zero-Knowledge Proofs (Chaum–Pedersen Protocol).

---

## [2.0.0] — 2025-10-23
### ✅ Stage 2 Complete: ZKP Engine (Chaum–Pedersen Protocol)

> **Milestone**: Fully functional zero-knowledge passwordless login backend with **real 2-step challenge-response flow**.

This release completes **Stage 2** of the ZK-Auth Final Year Project, delivering a mathematically sound Chaum–Pedersen ZKP verifier, dual-key user model, and **interactive login protocol**.

---

### ✨ Added

- **ZKP Core Utilities**:
    - `src/utils/modExp.js` — secure modular exponentiation with `BigInt`
    - Unit test: `modExp.test.js`
- **Cryptographic Parameters**:
    - `src/config/zkpParams.js` — safe primes (`p`, `q`) and generators (`g = 2`, `h = 3`) from RFC 5114
- **Chaum–Pedersen Verifier**:
    - `src/services/chaumPedersenVerifier.js` — validates ZKP proofs without secret exposure
    - Full test suite: `chaumPedersenVerifier.test.js`
- **Enhanced User Model**:
    - Added `publicKeyZ` field to store second public key (`z = h^x`)
    - Backward-compatible (Stage 1 users still work)
- **Interactive ZKP Login Flow**:
    - `POST /api/auth/challenge` — server issues random challenge `c`
    - `POST /api/auth/verify` — verifies full proof (`a`, `b`, `c`, `s`)
- **Integration Tests**:
    - `src/tests/registerZKPUser.test.js` — registers user with dual keys
    - `src/tests/loginReal.test.js` — **end-to-end 2-step ZKP login**

---

### 🛠 Changed

- **Project Structure**:
    - Added `src/services/`, `src/tests/` directories
- **User Registration**:
    - Now accepts optional `publicKeyZ` during registration
- **Server Setup** (`server.js`):
    - Added **CORS** for Chrome extension (`chrome-extension://*`)
    - Fixed module initialization order (ESM compliance)
    - Registered `/api/auth` routes correctly
- **Dependencies**:
    - Added `node-fetch@^3.1.0` for HTTP testing
    - Added `cors` for cross-origin requests

---

### ✅ Verified

- ✅ Modular exponentiation handles 256-bit numbers safely
- ✅ Chaum–Pedersen verifier passes valid proofs, rejects invalid ones
- ✅ Users can register with **two public keys** (`y = g^x`, `z = h^x`)
- ✅ **Interactive ZKP flow works**:
    1. Client sends commitment (`a`, `b`)
    2. Server replies with challenge (`c`)
    3. Client computes response (`s = k + c·x mod q`)
    4. Server verifies proof → **✅ Login successful!**
- ✅ Full flow: **Register → Store Keys → Prove → Login** (100% working)

---

### 🧪 Demo Commands (Copy-Paste for Showcase)

> 💡 Run these in order to **reproduce your Stage 2 demo**.

```bash
# 1. Start the backend server
npm run dev

# 2. In a NEW terminal: Register a ZKP user
node "src/tests/registerZKPUser.test.js"

# 3. Update src/tests/loginReal.test.js with the new username

# 4. Run the login test (uses real 2-step ZKP flow)
node "src/tests/loginReal.test.js"

# ✅ Expected output:
# 🔐 Starting REAL ZKP Login...
# 📋 Challenge c = 21481897635594847035324120291172461665335799122009455272759383921815531311043
# ✅ FINAL LOGIN RESULT: { message: "✅ Login successful!" }