import express from 'express';
import cors from 'cors';
import passport from 'passport';
import configurePassport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Create Express application
const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow requests from Vite dev server, Vercel preview/production URLs, or same-origin
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Passport ────────────────────────────────────────────────────────────────
configurePassport();
app.use(passport.initialize());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Global Error Handler (must be registered LAST) ──────────────────────────
app.use(errorHandler);

export default app;