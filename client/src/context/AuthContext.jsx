import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

/**
 * Auth context object
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Auth provider component - Manages authentication state for the entire app
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Provider wrapper
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check if user has valid token and fetch user data on mount
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Login user - Store token and user data
   * @param {string} token - JWT token
   * @param {Object} userData - User object
   */
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  /**
   * Logout user - Clear token and user data
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context
 * @returns {Object} Authentication context value {user, loading, login, logout}
 */
export const useAuth = () => useContext(AuthContext);