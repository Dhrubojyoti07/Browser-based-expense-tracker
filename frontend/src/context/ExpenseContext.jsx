import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import useWebSocket from '../hooks/useWebSocket';
import api from '../services/api';

const ExpenseContext = createContext(null);

/**
 * Get the localStorage key for a user's expenses.
 */
function getStorageKey(userId) {
  return `expenses_${userId}`;
}

export function ExpenseProvider({ children }) {
  const { user, token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { lastMessage } = useWebSocket(token);

  // Load expenses from localStorage when user changes
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      return;
    }

    try {
      const stored = localStorage.getItem(getStorageKey(user._id || user.id));
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
    }
  }, [user]);

  // Persist expenses to localStorage whenever they change
  useEffect(() => {
    if (!user) return;
    const key = getStorageKey(user._id || user.id);
    localStorage.setItem(key, JSON.stringify(expenses));
  }, [expenses, user]);

  // Listen for WebSocket messages for cross-tab sync
  useEffect(() => {
    if (!lastMessage || !user) return;

    const { type, expense, expenseId } = lastMessage;

    if (type === 'expense:created' && expense) {
      setExpenses((prev) => {
        // Avoid duplicates
        if (prev.some((e) => (e._id || e.id) === (expense._id || expense.id))) {
          return prev;
        }
        return [expense, ...prev];
      });
    }

    if (type === 'expense:deleted' && expenseId) {
      setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== expenseId));
    }
  }, [lastMessage, user]);

  const addExpense = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        const result = await api.post('/expenses', data);
        const newExpense = result.expense || result;
        setExpenses((prev) => [newExpense, ...prev]);
        return newExpense;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteExpense = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== id));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Computed values
  const totalAmount = useMemo(
    () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [expenses]
  );

  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, e) => {
      const cat = e.category || 'Other';
      acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
      return acc;
    }, {});
  }, [expenses]);

  return (
    <ExpenseContext.Provider
      value={{ expenses, totalAmount, categoryTotals, addExpense, deleteExpense, isLoading }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}

export default ExpenseContext;
