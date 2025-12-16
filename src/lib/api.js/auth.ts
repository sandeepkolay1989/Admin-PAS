import { API } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message?: string;
  data?: {
    token: string;
    user?: any;
  };
  token?: string;
}

/**
 * Login function that authenticates user and stores token
 * @param credentials - Email and password
 * @returns Promise with login response containing token
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(API.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data: LoginResponse = await response.json();

    // Handle different response formats
    if (!response.ok || (data.statusCode && data.statusCode !== 200)) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token if present (handle different response structures)
    const token = data.token || data.data?.token || data.data?.accessToken || data.accessToken;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout function that clears stored token
 */
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Check if user is authenticated (token exists)
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem('token');
};

/**
 * Get stored token
 */
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

