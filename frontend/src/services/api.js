import { API_BASE } from '../utils/constants';

/**
 * Lightweight fetch wrapper with automatic auth headers and error handling.
 */
const api = {
  /**
   * Get the stored auth token.
   */
  _getToken() {
    return localStorage.getItem('auth_token')
      ? JSON.parse(localStorage.getItem('auth_token'))
      : null;
  },

  /**
   * Build common request headers.
   */
  _headers() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this._getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  /**
   * Handle the response — parse JSON and check for auth errors.
   */
  async _handleResponse(response) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  },

  /** GET request */
  async get(url) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      headers: this._headers(),
    });
    return this._handleResponse(response);
  },

  /** POST request */
  async post(url, data) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(data),
    });
    return this._handleResponse(response);
  },

  /** DELETE request */
  async delete(url) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: this._headers(),
    });
    return this._handleResponse(response);
  },
};

export default api;
