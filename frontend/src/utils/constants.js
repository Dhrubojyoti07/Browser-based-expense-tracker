const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (isLocal ? '/api' : 'https://browser-based-expense-tracker.onrender.com/api');

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (isLocal ? 'ws://localhost:3001' : 'wss://browser-based-expense-tracker.onrender.com');

export const CATEGORIES = ['Food', 'Travel', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Travel: '#3b82f6',
  Utilities: '#10b981',
  Shopping: '#8b5cf6',
  Entertainment: '#ec4899',
  Health: '#ef4444',
  Other: '#6b7280',
};
