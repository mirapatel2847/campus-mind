export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Session {
  user: User;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
}
