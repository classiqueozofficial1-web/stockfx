import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { LogOut } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

import { getDashboard, clearToken } from '../lib/session';

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setUser)
      .catch((err) => {
        setError(err.message || 'Not authenticated');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    clearToken();
    onNavigate('login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('dashboard.loading')}</div>;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center max-w-md">
          <h2 className="text-xl font-bold mb-4 text-red-600">{error || 'Not authenticated'}</h2>
          <Button onClick={() => { clearToken(); onNavigate('login'); }} className="w-full">
            {t('dashboard.goToLogin')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Welcome, {user.firstName}!</h1>
            <p className="text-slate-600 mt-2">Your investment dashboard</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="lg" className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Account Balance</h3>
            <p className="text-3xl font-bold text-slate-900" >\</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Email</h3>
            <p className="text-lg font-semibold text-slate-900">{user.email}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Status</h3>
            <span className={inline-block px-3 py-1 rounded-full text-sm font-medium {} + ${user.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}}>
              {user.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Dashboard</h2>
          <p className="text-slate-600 mb-4">OTP-based registration and email verification system is now active!</p>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
             Email OTP system ready. Users receive verification codes at their email address upon registration.
          </div>
        </div>
      </div>
    </div>
  );
}
