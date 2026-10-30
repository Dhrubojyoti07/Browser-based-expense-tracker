import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/env.js';

/**
 * JWT authentication middleware.
 * Extracts a Bearer token from the Authorization header, verifies it,
 * and attaches the user object (without password) to req.user.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please provide a valid token.', 401));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new AppError('Authentication required. Please provide a valid token.', 401));
    }

    // Verify the token
    const secret = JWT_SECRET || 'expense-tracker-jwt-secret-key-2024';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return next(new AppError('Invalid or expired token', 401));
    }

    // Look up the user to ensure they still exist
    const user = User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    // Attach user to the request (omit password)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    next(new AppError('Authentication failed', 401));
  }
};

export default auth;