import { jwtDecode } from 'jwt-decode';
import authService from './../api/authService';

interface TokenPayload {
  exp: number;
  sub: string;
  email: string;
  'cognito:groups'?: string[];
  given_name?: string;
}

// Storage keys
const ACCESS_TOKEN_KEY = 'luminis_access_token';
const REFRESH_TOKEN_KEY = 'luminis_refresh_token';
const ID_TOKEN_KEY = 'luminis_id_token';

// Save tokens to local storage
export const saveTokens = (accessToken: string, refreshToken: string, idToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(ID_TOKEN_KEY, idToken);
};

// Get access token from local storage
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get refresh token from local storage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Get ID token from local storage
export const getIdToken = (): string | null => {
  return localStorage.getItem(ID_TOKEN_KEY);
};

// Check if user is authenticated (token exists and is not expired)
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Get time until token expiration in seconds
export const getTimeUntilExpiration = (): number | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp - currentTime;
  } catch (error) {
    return null;
  }
};

// Check if token is expiring soon (within 5 minutes)
export const isTokenExpiringSoon = (): boolean => {
  const timeUntilExpiration = getTimeUntilExpiration();
  return timeUntilExpiration !== null && timeUntilExpiration < 300; // 5 minutes = 300 seconds
};

// Get user information from token
export const getUserInfo = () => {
  const token = getIdToken();

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      givenName: decoded['given_name'] || '',
      groups: decoded['cognito:groups'] || []
    };
  } catch (error) {
    return null;
  }
};

// Logout - remove tokens from local storage
export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ID_TOKEN_KEY);
};

// Check and refresh session if needed
export const checkSession = async (): Promise<boolean> => {
  // If not authenticated at all, return false immediately
  if (!isAuthenticated()) {
    return false;
  }

  // If token is expiring soon, try to refresh
  if (isTokenExpiringSoon()) {
    try {
      const refreshToken = getRefreshToken();
      
      // If no refresh token exists, session is invalid
      if (!refreshToken) {
        return false;
      }
      
      // Attempt to refresh the tokens
      const response = await authService.refreshToken({ refreshToken });
      
      // Save the new tokens
      saveTokens(
        response.accessToken,
        response.refreshToken,
        response.idToken
      );
      
      return true;
    } catch (error) {
      // If refresh fails, session is invalid
      logout();
      return false;
    }
  }
  
  // Token is valid and not expiring soon
  return true;
};