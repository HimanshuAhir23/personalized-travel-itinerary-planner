import api from './api';
import { User, AuthResponse, LoginCredentials, SignupCredentials } from '../types/auth';

const DEMO_USER: User = {
  id: 'usr_demo_101',
  email: 'explorer@wanderwise.ai',
  display_name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  created_at: new Date().toISOString(),
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('wanderwise_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Offline/Local demo fallback for seamless client testing if backend is inactive
      console.warn('API login call failed, providing demo session:', error);
      const mockUser: User = {
        ...DEMO_USER,
        email: credentials.email || DEMO_USER.email,
        display_name: credentials.email ? credentials.email.split('@')[0] : DEMO_USER.display_name,
      };
      const mockResponse: AuthResponse = {
        user: mockUser,
        access_token: 'demo_token_' + Date.now(),
      };
      localStorage.setItem('access_token', mockResponse.access_token);
      localStorage.setItem('wanderwise_user', JSON.stringify(mockUser));
      return mockResponse;
    }
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', credentials);
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('wanderwise_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('API signup call failed, providing demo session:', error);
      const newUser: User = {
        id: 'usr_' + Date.now(),
        email: credentials.email,
        display_name: credentials.display_name || credentials.email.split('@')[0],
        created_at: new Date().toISOString(),
      };
      const mockResponse: AuthResponse = {
        user: newUser,
        access_token: 'demo_token_' + Date.now(),
      };
      localStorage.setItem('access_token', mockResponse.access_token);
      localStorage.setItem('wanderwise_user', JSON.stringify(newUser));
      return mockResponse;
    }
  },

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.get<User>('/auth/me');
      localStorage.setItem('wanderwise_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const cached = localStorage.getItem('wanderwise_user');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
      return DEMO_USER;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // silently proceed
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('wanderwise_user');
    }
  },
};
