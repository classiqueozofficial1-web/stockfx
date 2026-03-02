import PocketBase from 'pocketbase';

// central PocketBase client instance; reuse across app
const baseUrl = (import.meta as any).env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
export const pb = new PocketBase(baseUrl);

// Persist auth state in localStorage (token + record) so sessions
// survive page reloads and can be restored across devices if the
// token is synced manually between them.
const AUTH_TOKEN_KEY = 'pb_auth_token';
const AUTH_RECORD_KEY = 'pb_auth_record';

export function saveAuth() {
  const token = pb.authStore.token;
  const rec = pb.authStore.record;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  if (rec) {
    try {
      localStorage.setItem(AUTH_RECORD_KEY, JSON.stringify(rec));
    } catch {}
  }
}

export function loadAuth() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const recJson = localStorage.getItem(AUTH_RECORD_KEY);
  let rec: any = undefined;
  if (recJson) {
    try { rec = JSON.parse(recJson); } catch {}
  }
  if (token) {
    pb.authStore.save(token, rec);
  }
}

export function clearAuth() {
  pb.authStore.clear();
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_RECORD_KEY);
}


export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Create a new user in the default "users" collection and trigger
 * the built‑in email verification flow (if the collection is
 * configured to require email confirmation).
 */
export async function registerUser(payload: RegisterPayload) {
  // pocketbase requires passwordConfirm for user creation
  const record = await pb.collection('users').create(
    {
      email: payload.email,
      password: payload.password,
      passwordConfirm: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    },
    { sendEmail: true }
  );
  // new users aren't logged in automatically; if your collection
  // has `required email confirmation` the user will still need to
  // verify before logging in.
  saveAuth();
  return record;
}

export async function loginUser(email: string, password: string) {
  const authData = await pb.collection('users').authWithPassword(email, password);
  // persist token so we can reload later / access across tabs
  saveAuth();
  // pb.authStore model contains token, record, etc.
  return authData;
}

export function logout() {
  clearAuth();
}
