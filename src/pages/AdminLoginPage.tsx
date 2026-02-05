import React, { useState } from 'react';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const adminEmail = 'adminkingsley@gmail.com';
  const adminPassword = 'Kingsley2000';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      if (email === adminEmail && password === adminPassword) {
        setLoading(false);
        onSuccess();
      } else {
        setLoading(false);
        setError('Invalid admin credentials');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          className="px-4 py-2 border rounded"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="px-4 py-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
}
