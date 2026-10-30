import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expenseController.js';
import { validateExpense } from '../middleware/validate.js';
import auth from '../middleware/auth.js';

const router = Router();

// All expense routes require authentication
router.use(auth);

// GET /api/expenses — Retrieve expenses (acknowledgment; data lives in localStorage)
router.get('/', getExpenses);

// POST /api/expenses — Create a new expense (generates ID + timestamp)
router.post('/', validateExpense, createExpense);

// DELETE /api/expenses/:id — Delete an expense by ID
router.delete('/:id', deleteExpense);

export default router;
