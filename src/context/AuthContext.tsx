import React, { createContext, useState, useEffect } from 'react';

interface AuthContextProps {
  token: string | null;
  setAuthData: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  setAuthData: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedExpiration = localStorage.getItem('token_expiration');
    
    if (storedToken && storedExpiration) {
      const expirationDate = new Date(storedExpiration);
      const now = new Date();
      
      // لو الـ token منتهي، نعمل logout تلقائي
      if (expirationDate <= now) {
        logout();
        return;
      }
      
      setToken(storedToken);
    } else if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const setAuthData = (t: string) => {
    setToken(t);
    localStorage.setItem('token', t);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
  };

  return (
    <AuthContext.Provider value={{ token, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
