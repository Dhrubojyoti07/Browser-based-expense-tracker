import { Router } from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validate.js';
import auth from '../middleware/auth.js';

const router = Router();

// POST /api/auth/signup — Register a new user
router.post('/signup', validateSignup, signup);

// POST /api/auth/login — Authenticate an existing user
router.post('/login', validateLogin, login);

// GET /api/auth/me — Get the current user's profile (requires auth)
router.get('/me', auth, getMe);

export default router;
