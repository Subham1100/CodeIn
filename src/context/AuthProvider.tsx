import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define User type — adjust based on your user object
interface User {
  email: string;
  // add other user fields as needed
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

// Create context with null default (you'll check for null when consuming)
const AuthContext = createContext<AuthContextType | null>(null);

// Type for AuthProvider's props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/database/api/user/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        setUser({ email }); // add other user info here if available
        navigate("/rooms");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/database/api/user/register`,
        { username, email, password }
      );
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume context with null check
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
