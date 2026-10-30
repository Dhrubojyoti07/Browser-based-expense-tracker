export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `ws://${window.location.hostname}:3001`
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);

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
