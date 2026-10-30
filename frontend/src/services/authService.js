import api from './api';

/**
 * Authentication service — wraps auth-related API calls.
 */
const authService = {
  /** Log in with email and password. */
  async login(email, password) {
    return api.post('/auth/login', { email, password });
  },

  /** Create a new account. */
  async signup(name, email, password) {
    return api.post('/auth/signup', { name, email, password });
  },

  /** Validate the current token and retrieve user info. */
  async getMe() {
    return api.get('/auth/me');
  },
};

export default authService;
