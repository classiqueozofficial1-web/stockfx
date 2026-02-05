import { UserRecord, getUsers } from './userStore';

let currentUser: UserRecord | null = null;

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Store/retrieve token in localStorage
function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function clearToken() {
  localStorage.removeItem('auth_token');
}

// Local setter (keeps existing test flows working)
export function setCurrentUser(email: string) {
  const user = getUsers().find(u => u.email === email);
  currentUser = user || null;
}

// Set current user from a full profile (used after successful API calls)
export function setCurrentUserFromProfile(user: UserRecord | null) {
  currentUser = user;
}

export function getCurrentUser(): UserRecord | null {
  return currentUser;
}

export function logoutUser() {
  currentUser = null;
}

// --- API helpers (talk to the dev auth server) ---
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Login failed');
  }
  if (data.token) setToken(data.token);
  return data;
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Registration failed');
  }
  // Optionally log in user after registration
  if (data.token) setToken(data.token);
  return data;
}

// Fetch dashboard data using token
export async function getDashboard() {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard');
  return data.user;
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/api/me`, { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.user || data) as UserRecord | null;
}

export async function apiLogout() {
  try {
    await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' });
  } catch (e) {
    console.warn('Logout network error:', e);
  }
  currentUser = null;
}

// Lightweight health check used by the UI to verify the auth server is reachable
export async function apiHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch (e) {
    return false;
  }
}

// --- Admin API helpers ---
export async function apiListUsers() {
  const res = await fetch(`${API_BASE}/auth/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
  return data.users;
}

export async function apiUpdateBalance(userId: string, amount: number) {
  const res = await fetch(`${API_BASE}/auth/user/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update balance');
  return data;
}

export async function apiEditName(userId: string, name: string) {
  const res = await fetch(`${API_BASE}/auth/user/name`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to edit name');
  return data;
}

export async function apiSendNotification(userId: string, message: string) {
  const res = await fetch(`${API_BASE}/auth/user/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send notification');
  return data;
}

export { setToken, getToken, clearToken };

