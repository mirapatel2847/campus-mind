import { User, Session, SignInRequest, SignUpRequest } from '../types/auth';

const STORAGE_USERS_KEY = 'campusmind_users';
const STORAGE_SESSION_KEY = 'campusmind_session';

interface StoredUser extends User {
  passwordHash: string; // In mock mode, stores simple plaintext/hash for credential verification
}

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'usr_demo_1',
    name: 'Campus Student',
    email: 'demo@campus.edu',
    passwordHash: 'password123',
  },
];

const delay = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getStoredUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw) as StoredUser[];
  } catch (err) {
    console.error('Failed to read users from localStorage', err);
    return DEFAULT_USERS;
  }
};

const saveStoredUsers = (users: StoredUser[]): void => {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to write users to localStorage', err);
  }
};

/**
 * Signs in a user with email and password.
 * Will throw "Invalid email or password" if credentials do not match.
 */
export async function signIn(email: string, password: string): Promise<Session>;
export async function signIn(request: SignInRequest): Promise<Session>;
export async function signIn(
  emailOrRequest: string | SignInRequest,
  maybePassword?: string
): Promise<Session> {
  await delay(500);

  const email = (
    typeof emailOrRequest === 'string' ? emailOrRequest : emailOrRequest.email
  ).trim().toLowerCase();
  const password =
    typeof emailOrRequest === 'string' ? maybePassword ?? '' : emailOrRequest.password;

  const users = getStoredUsers();
  const matchedUser = users.find(
    (u) => u.email.toLowerCase() === email && u.passwordHash === password
  );

  if (!matchedUser) {
    throw new Error('Invalid email or password');
  }

  const session: Session = {
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    },
    token: `mock-jwt-token-${matchedUser.id}-${Date.now()}`,
  };

  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
  }

  return session;
}

/**
 * Registers a new user with name, email, and password.
 * Will throw "Email already registered" if an account with this email exists.
 */
export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<Session>;
export async function signUp(request: SignUpRequest): Promise<Session>;
export async function signUp(
  nameOrRequest: string | SignUpRequest,
  maybeEmail?: string,
  maybePassword?: string
): Promise<Session> {
  await delay(500);

  const name = (
    typeof nameOrRequest === 'string' ? nameOrRequest : nameOrRequest.name
  ).trim();
  const email = (
    typeof nameOrRequest === 'string' ? maybeEmail ?? '' : nameOrRequest.email
  ).trim().toLowerCase();
  const password =
    typeof nameOrRequest === 'string' ? maybePassword ?? '' : nameOrRequest.password;

  const users = getStoredUsers();
  const existingUser = users.find((u) => u.email.toLowerCase() === email);

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    email,
    passwordHash: password,
  };

  users.push(newUser);
  saveStoredUsers(users);

  const session: Session = {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
  };

  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
  }

  return session;
}

/**
 * Returns current authenticated session from storage if present.
 */
export function getCurrentSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch (err) {
    console.error('Failed to read session from localStorage', err);
    return null;
  }
}

/**
 * Clears current session from storage.
 */
export async function signOut(): Promise<void> {
  await delay(200);
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear session from localStorage', err);
  }
}
