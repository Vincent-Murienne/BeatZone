import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType } from "./types";
import { login as loginService, logout as logoutService, onAuthStateChange } from "../services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'beatzone_user';
const SESSION_KEY = 'beatzone_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveUserToStorage = (userData: User | null) => {
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(SESSION_KEY, 'true');
      setUser(userData);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    }
  };

  const getUserFromStorage = (): User | null => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChange((newUser) => {
      if (newUser) {
        setUser(newUser);
        saveUserToStorage(newUser);
      } else {
        setUser(null);
        saveUserToStorage(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginService(email, password);
      if (response && response.user) {
        setUser(response.user);
        saveUserToStorage(response.user);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutService();
      setUser(null);
      saveUserToStorage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, saveUserToStorage }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
