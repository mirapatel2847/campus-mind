// Scratch test script to test mock auth logic in node
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value.toString(); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

(global as any).localStorage = new MockLocalStorage();

async function runTests() {
  const { signIn, signUp, signOut, getCurrentSession } = await import('./src/api/auth.ts');
  console.log('Testing CampusMind Auth Layer...');

  // 1. Initial state
  console.assert(getCurrentSession() === null, 'Initial session should be null');

  // 2. Default user login (demo@campus.edu / password123)
  const demoSession = await signIn('demo@campus.edu', 'password123');
  console.assert(demoSession.user.email === 'demo@campus.edu', 'Demo login failed');
  console.assert(getCurrentSession()?.token === demoSession.token, 'Session persistence failed');
  console.log('✔ Demo sign-in and session persistence passed');

  // 3. Sign out
  await signOut();
  console.assert(getCurrentSession() === null, 'Sign out should clear session');
  console.log('✔ Sign-out passed');

  // 4. Invalid credentials
  try {
    await signIn('demo@campus.edu', 'wrongpass');
    console.error('FAIL: Expected invalid password error');
  } catch (err: any) {
    console.assert(err.message === 'Invalid email or password', 'Wrong error message on bad password');
    console.log('✔ Invalid password error check passed');
  }

  // 5. Sign up new student
  const newSession = await signUp('Taylor Swift', 'taylor@campus.edu', 'supersecret8');
  console.assert(newSession.user.name === 'Taylor Swift', 'User name mismatch');
  console.assert(newSession.user.email === 'taylor@campus.edu', 'Email mismatch');
  console.assert(getCurrentSession()?.token === newSession.token, 'New session persistence failed');
  console.log('✔ Sign-up new user passed');

  // 6. Duplicate email sign up
  try {
    await signUp('Another Taylor', 'taylor@campus.edu', 'differentpass123');
    console.error('FAIL: Expected duplicate email error');
  } catch (err: any) {
    console.assert(err.message === 'Email already registered', 'Wrong duplicate email error message');
    console.log('✔ Duplicate email error check passed');
  }

  // 7. Sign in with newly created credentials
  await signOut();
  const relogSession = await signIn('taylor@campus.edu', 'supersecret8');
  console.assert(relogSession.user.id === newSession.user.id, 'Relog user ID mismatch');
  console.log('✔ Re-login with new credentials passed');

  console.log('All auth contract tests passed successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
