import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { User, Session, SignInRequest, SignUpRequest } from '../types/auth';
import * as authApi from '../api/auth';

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (emailOrRequest: string | SignInRequest, maybePassword?: string) => Promise<Session>;
  signUp: (nameOrRequest: string | SignUpRequest, maybeEmail?: string, maybePassword?: string) => Promise<Session>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial mount
  useEffect(() => {
    try {
      const existingSession = authApi.getCurrentSession();
      if (existingSession) {
        setSession(existingSession);
      }
    } catch (err) {
      console.error('Error hydrating auth state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(
    async (emailOrRequest: string | SignInRequest, maybePassword?: string): Promise<Session> => {
      setIsLoading(true);
      try {
        let newSession: Session;
        if (typeof emailOrRequest === 'string') {
          newSession = await authApi.signIn(emailOrRequest, maybePassword || '');
        } else {
          newSession = await authApi.signIn(emailOrRequest);
        }
        setSession(newSession);
        return newSession;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signUp = useCallback(
    async (
      nameOrRequest: string | SignUpRequest,
      maybeEmail?: string,
      maybePassword?: string
    ): Promise<Session> => {
      setIsLoading(true);
      try {
        let newSession: Session;
        if (typeof nameOrRequest === 'string') {
          newSession = await authApi.signUp(
            nameOrRequest,
            maybeEmail || '',
            maybePassword || ''
          );
        } else {
          newSession = await authApi.signUp(nameOrRequest);
        }
        setSession(newSession);
        return newSession;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authApi.signOut();
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isAuthenticated: !!session,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [session, isLoading, signIn, signUp, signOut]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
