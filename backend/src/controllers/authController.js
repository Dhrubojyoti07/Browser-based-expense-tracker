import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { JWT_SECRET } from '../config/env.js';

/**
 * Generate a signed JWT for a given user ID.
 * Token expires in 7 days.
 * @param {string} id - The user's unique ID.
 * @returns {string} Signed JWT token.
 */
const generateToken = (id) => {
  const secret = JWT_SECRET || 'expense-tracker-jwt-secret-key-2024';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

/**
 * POST /api/auth/signup
 * Register a new user.
 * Hashes the password, stores the user, and returns a JWT + user data.
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with this email already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user record
    const user = User.create({ name, email, password: hashedPassword });

    // Generate JWT
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticate an existing user via Passport local strategy.
 * Returns a JWT + user data on success.
 */
export const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new AppError(info?.message || 'Invalid email or password', 401));
    }

    // Generate JWT
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  })(req, res, next);
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile.
 * Requires auth middleware to populate req.user.
 */
export const getMe = (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};