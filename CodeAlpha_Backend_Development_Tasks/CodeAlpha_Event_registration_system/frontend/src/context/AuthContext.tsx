import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
};

interface AuthContextType {
  user: User | null;
  loginState: (userData: User) => void;
  logoutState: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ ...parsed, token: storedToken });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const loginState = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      email: userData.email,
      role: userData.role
    }));
    localStorage.setItem('token', userData.token);
  };

  const logoutState = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loginState, logoutState, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
