import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_token');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validate existing token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      } catch {
        // Token invalid — clear auth data
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (email, password) => {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', JSON.stringify(data.token));
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      navigate('/');
    },
    [navigate]
  );

  const signup = useCallback(
    async (name, email, password) => {
      const data = await authService.signup(name, email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', JSON.stringify(data.token));
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      navigate('/');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
