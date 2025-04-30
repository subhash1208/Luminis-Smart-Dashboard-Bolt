import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials, RegisterData } from '../api/authService';
import { saveTokens, isAuthenticated, isTokenExpiringSoon, logout, getUserInfo } from '../utils/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isSessionExpiringSoon: boolean;
  userInfo: { id: string; email: string; givenName: string } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{ id: string; email: string; givenName: string } | null>(null);
  const [isSessionExpiringSoon, setIsSessionExpiringSoon] = useState(false);

  // Check token expiration in intervals
  useEffect(() => {
    const checkTokenExpiration = () => {
      setIsSessionExpiringSoon(isTokenExpiringSoon());
    };

    // Check initially
    checkTokenExpiration();

    // Set interval to check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  // Load user info from token on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUserInfo();
      if (user) {
        setUserInfo({
          id: user.id,
          email: user.email,
          givenName: user.givenName
        });
      }
    }
  }, []);

  // Login handler
  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken, idToken } = await authService.login(credentials);
      saveTokens(accessToken, refreshToken, idToken);
      
      const user = getUserInfo();
      if (user) {
        setUserInfo({
          id: user.id,
          email: user.email,
          givenName: user.givenName
        });
      }
      
      toast.success('Logged in successfully');
      navigate('/houses');
    } catch (error) {
      // Error is handled by axios interceptor
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success('Registration successful. Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      // Error is handled by axios interceptor
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    setUserInfo(null);
    setIsSessionExpiringSoon(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    isAuthenticated: isAuthenticated(),
    isSessionExpiringSoon,
    userInfo,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};