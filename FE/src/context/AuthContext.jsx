import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Ambil token dan role dari Local Storage saat aplikasi dimuat
  const initialToken = localStorage.getItem('userToken');
  const initialRole = localStorage.getItem('userRole');

  const [token, setToken] = useState(initialToken);
  const [userRole, setUserRole] = useState(initialRole);

  const login = (newToken, role) => {
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('userRole', role);
    setToken(newToken);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  return useContext(AuthContext);
};