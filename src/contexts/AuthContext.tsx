import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService, { 
  LoginCredentials, 
  RegisterData, 
  VerifyEmailData,
  ResendVerificationData 
} from '../api/authService';
import { 
  saveTokens, 
  isAuthenticated, 
  logout as clearSession, 
  getUserInfo,
  checkSession 
} from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionExpiringSoon: boolean;
  user: any;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  resendVerificationCode: (data: ResendVerificationData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSessionExpiringSoon, setIsSessionExpiringSoon] = useState<boolean>(false);
  const [user, setUser] = useState<any>(getUserInfo());
  const navigate = useNavigate();

  useEffect(() => {
    // Initial check
    const initializeAuth = async () => {
      const valid = await checkSession();
      setIsAuth(valid);
      setUser(getUserInfo());
      setIsLoading(false);
    };

    initializeAuth();

    // Set up periodic session check
    const intervalId = setInterval(async () => {
      const valid = await checkSession();
      if (!valid) {
        handleLogout();
      }
      setIsSessionExpiringSoon(!valid);
    }, 60_000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      saveTokens(
        response.accessToken,
        response.refreshToken,
        response.idToken
      );
      setIsAuth(true);
      setUser(getUserInfo());
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if the error is due to unverified email
      if (error.response && error.response.status === 400 && 
          error.response.data.error && 
          error.response.data.error.includes('Email not verified')) {
        
        // Show appropriate toast message
        toast.error('Your email is not verified. Redirecting to verification page.');
        
        // Navigate to verification page with the email
        navigate('/verify-email', { state: { email: credentials.email } });
      } else {
        // For other errors, just throw to be handled by the LoginPage
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success('Registration successful. Please verify your email.');
      navigate('/verify-email', { state: { email: data.email } });
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // rethrow to allow RegisterPage to handle it
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (data: VerifyEmailData) => {
    try {
      setIsLoading(true);
      await authService.verifyEmail(data);
      toast.success('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async (data: ResendVerificationData) => {
    try {
      setIsLoading(true);
      await authService.resendVerificationCode(data);
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setIsAuth(false);
    setUser(null);
    navigate('/login');
  };

  const value = {
    isAuthenticated: isAuth,
    isLoading,
    isSessionExpiringSoon,
    user,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;