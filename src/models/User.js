// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // 🔑 OLD: single public key (we'll keep it for now)
    publicKey: {
        type: String,
        required: true
    },
    // 🔑 NEW: second public key for Chaum-Pedersen
    publicKeyZ: {
        type: String,
        required: false // optional for now (Stage 2.5)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);