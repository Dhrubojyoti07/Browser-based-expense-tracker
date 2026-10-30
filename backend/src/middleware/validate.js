import { AppError } from './errorHandler.js';

/**
 * Validate signup request body.
 * Requires name (string), email (valid format), and password (min 6 chars).
 */
export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('Name is required', 400));
  }

  if (!email || typeof email !== 'string') {
    return next(new AppError('Email is required', 400));
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  if (!password || typeof password !== 'string') {
    return next(new AppError('Password is required', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  next();
};

/**
 * Validate login request body.
 * Requires email (string) and password (string).
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return next(new AppError('Email is required', 400));
  }

  if (!password || typeof password !== 'string') {
    return next(new AppError('Password is required', 400));
  }

  next();
};

/**
 * Validate expense creation request body.
 * Requires name (string), amount (positive number), and category (string).
 */
export const validateExpense = (req, res, next) => {
  const { name, amount, category } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('Expense name is required', 400));
  }

  if (amount === undefined || amount === null || typeof amount !== 'number') {
    return next(new AppError('Amount is required and must be a number', 400));
  }

  if (amount <= 0) {
    return next(new AppError('Amount must be greater than zero', 400));
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return next(new AppError('Category is required', 400));
  }

  next();
};
