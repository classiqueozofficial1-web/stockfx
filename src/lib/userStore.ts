// Simple in-memory user store for demo
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  createdAt: string;
  balance: number;
  notifications: string[];
  registrationStatus: 'pending' | 'confirmed';
  verified: boolean;
}

let users: UserRecord[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'active', createdAt: '2026-01-01', balance: 1200.50, notifications: [], registrationStatus: 'confirmed', verified: true },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'blocked', createdAt: '2026-01-02', balance: 0, notifications: [], registrationStatus: 'confirmed', verified: false },
  { id: '3', name: 'Carol Lee', email: 'carol@example.com', status: 'active', createdAt: '2026-01-03', balance: 500.00, notifications: [], registrationStatus: 'pending', verified: false },
];

export function getUsers() {
  return users;
}

export function addUser(user: UserRecord) {
  users = [...users, user];
}

export function updateUser(id: string, update: Partial<UserRecord>) {
  users = users.map(u => u.id === id ? { ...u, ...update } : u);
}

export function deleteUser(id: string) {
  users = users.filter(u => u.id !== id);
}
