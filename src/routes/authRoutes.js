// src/routes/authRoutes.js
import { Router } from 'express';
import { getChallenge, verifyProof } from '../controllers/authController.js';

const router = Router();

router.post('/challenge', getChallenge);  // Step 1
router.post('/verify', verifyProof);      // Step 2

export default router;