# 🧾 ZK-Auth — Changelog

A privacy-preserving passwordless authentication system using Zero-Knowledge Proofs (Chaum–Pedersen Protocol).

---

## [2.0.0] — 2025-10-19
### ✅ Stage 2 Complete: ZKP Engine (Chaum–Pedersen Protocol)

> **Milestone**: Fully functional zero-knowledge passwordless login backend.

This release completes **Stage 2** of the ZK-Auth Final Year Project, delivering a mathematically sound Chaum–Pedersen ZKP verifier, dual-key user model, and working `/api/auth/login` endpoint.

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
- **ZKP Login Endpoint**:
    - `POST /api/auth/login` — verifies user proof against stored keys
    - Returns success/failure with clear messages
- **Integration Tests**:
    - `src/tests/registerZKPUser.test.js` — registers user with dual keys
    - `src/tests/loginReal.test.js` — end-to-end ZKP login simulation

---

### 🛠 Changed

- **Project Structure**:
    - Added `src/services/`, `src/tests/` directories
- **User Registration**:
    - Now accepts optional `publicKeyZ` during registration
- **Server Setup** (`server.js`):
    - Fixed module initialization order (ESM compliance)
    - Registered `/api/auth` routes correctly
- **Dependency**:
    - Added `node-fetch@^3.1.0` for HTTP testing in Node.js

---

### ✅ Verified

- ✅ Modular exponentiation handles 256-bit numbers safely
- ✅ Chaum–Pedersen verifier passes valid proofs, rejects invalid ones
- ✅ Users can register with **two public keys** (`y = g^x`, `z = h^x`)
- ✅ Login endpoint **successfully verifies real ZKP proofs**
- ✅ Full flow: **Register → Store Keys → Prove → Login** (100% working)

---

### 🧪 Demo Commands (Copy-Paste for Showcase)

> 💡 Run these in order to **reproduce your Stage 2 demo**.

```bash
# 1. Start the backend server
npm run dev

# 2. In a NEW terminal: Register a ZKP user
node "src/tests/registerZKPUser.test.js"

# 3. Copy the printed username (e.g., zkp_user_1760825176889)

# 4. Update src/tests/loginReal.test.js with that username
#    (Keep the proof values from chaumPedersenVerifier.test.js)

# 5. Run the login test
node "src/tests/loginReal.test.js"

# ✅ Expected output:
# 🔐 LOGIN RESULT: { message: "✅ Login successful!", user: { username: "zkp_user_..." } }