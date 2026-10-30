import { v4 as uuidv4 } from 'uuid';
import { broadcast } from '../services/websocket.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /api/expenses
 * Returns a success acknowledgment.
 * Actual expense data lives in the frontend's localStorage.
 */
export const getExpenses = (req, res) => {
  res.json({ expenses: [] });
};

/**
 * POST /api/expenses
 * Validate incoming expense data, generate a UUID and timestamp,
 * then return the complete expense object for the frontend to store in localStorage.
 * Also broadcasts an "expense:created" event via WebSocket.
 */
export const createExpense = (req, res, next) => {
  try {
    const { name, amount, category } = req.body;

    const expense = {
      id: uuidv4(),
      name: name.trim(),
      amount,
      category: category.trim(),
      date: new Date().toISOString(),
      userId: req.user.id,
    };

    // Notify all connected clients of this user
    broadcast(req.user.id, 'expense:created', expense);

    res.status(201).json({ expense });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/expenses/:id
 * Validates authentication and returns a success message.
 * The frontend removes the expense from its localStorage.
 * Broadcasts an "expense:deleted" event via WebSocket.
 */
export const deleteExpense = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Expense ID is required', 400));
    }

    // Notify all connected clients of this user
    broadcast(req.user.id, 'expense:deleted', { id });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};
