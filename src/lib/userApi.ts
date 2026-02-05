const API_URL = 'http://localhost:4000';

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getDashboard(token: string) {
  const res = await fetch(`${API_URL}/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
