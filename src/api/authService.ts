import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  given_name: string;
  role?: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  verifyEmail: async (data: VerifyEmailData) => {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  }
};

export default authService;