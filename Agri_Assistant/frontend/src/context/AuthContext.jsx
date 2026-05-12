import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Utility to decode JWT token to check expiry
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTime, setSessionTime] = useState(0); // Elapsed session time in seconds

  // Initialize from sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUserStr = sessionStorage.getItem('currentUser');
    
    if (storedToken && storedUserStr) {
      const decoded = decodeJWT(storedToken);
      const currentTime = Date.now() / 1000;
      
      // Check if JWT is expired
      if (decoded && decoded.exp < currentTime) {
        // Token expired, clear everything
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('loginTime');
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUserStr));
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Setup auto logout when token expires
        if (decoded && decoded.exp) {
          const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
          if (timeUntilExpiry > 0 && timeUntilExpiry < 2147483647) {
             setTimeout(() => {
                logout();
                window.location.href = '/login'; // Force redirect
             }, timeUntilExpiry);
          }
        }
      }
    }
    setLoading(false);
  }, []);

  // Update session time every second if logged in
  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(() => {
        const storedLoginTime = sessionStorage.getItem('loginTime');
        if (storedLoginTime) {
          const elapsed = Math.floor((Date.now() - parseInt(storedLoginTime, 10)) / 1000);
          setSessionTime(elapsed);
        }
      }, 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [user]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    const now = Date.now().toString();
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('token', userToken);
    sessionStorage.setItem('loginTime', now);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    setSessionTime(0);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loginTime');
    delete axios.defaults.headers.common['Authorization'];
    setSessionTime(0);
  };

  const formatSessionTime = (totalSeconds) => {
    if (!totalSeconds) return "0s";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const updateUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, updateUser, sessionTime, formattedSessionTime: formatSessionTime(sessionTime) }}>
      {children}
    </AuthContext.Provider>
  );
};
