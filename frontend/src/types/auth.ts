export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials {
  email: string;
  password?: string;
  display_name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
