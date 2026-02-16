import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { TrendingUp, Wallet, Zap, BarChart3 } from 'lucide-react';
import { DashboardSidebar } from '../components/investment/DashboardSidebar';
import { PortfolioChart } from '../components/investment/PortfolioChart';
import { MarketTrendsChart } from '../components/investment/MarketTrendsChart';
import { AssetAllocationChart } from '../components/investment/AssetAllocationChart';
import { TopPerformersTable } from '../components/investment/TopPerformersTable';
import { getDashboard, clearToken } from '../lib/session';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  const portfolioValue = user?.balance || 0;
  const totalProfit = user?.totalProfit || 2450.50;
  const monthlyIncome = user?.monthlyIncome || 1200.75;
  const activeTrades = user?.activeTrades || 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={user.firstName}
        userEmail={user.email}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Welcome back, {user.firstName}! 👋</h1>
              <p className="text-slate-600 mt-2">Here's what's happening with your portfolio today.</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-600">Portfolio Balance</p>
                <Wallet className="h-5 w-5 text-emerald-600 opacity-50" />
              </div>
              <p className="text-3xl font-bold text-slate-900">${portfolioValue.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-600">Total Profit</p>
                <TrendingUp className="h-5 w-5 text-emerald-600 opacity-50" />
              </div>
              <p className="text-3xl font-bold text-emerald-600">${totalProfit.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-600">Monthly Income</p>
                <Zap className="h-5 w-5 text-blue-600 opacity-50" />
              </div>
              <p className="text-3xl font-bold text-blue-600">${monthlyIncome.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-600">Active Trades</p>
                <BarChart3 className="h-5 w-5 text-purple-600 opacity-50" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{activeTrades}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PortfolioChart totalBalance={portfolioValue} />
            </div>

            {/* Asset Allocation - Takes 1 column */}
            <div>
              <AssetAllocationChart />
            </div>
          </div>

          {/* Market Trends */}
          <div>
            <MarketTrendsChart />
          </div>

          {/* Top Performers */}
          <div>
            <TopPerformersTable />
          </div>

          {/* Bottom Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <p><span className="text-slate-600">Name:</span> <span className="font-medium text-slate-900">{user.firstName} {user.lastName || ''}</span></p>
                <p><span className="text-slate-600">Email:</span> <span className="font-medium text-slate-900">{user.email}</span></p>
                <p><span className="text-slate-600">Status:</span> <span className="font-medium text-emerald-600">✓ Verified</span></p>
                <p><span className="text-slate-600">Member Since:</span> <span className="font-medium text-slate-900">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span></p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-white text-emerald-600 hover:bg-slate-100 font-medium rounded-lg transition-colors">
                  Buy Assets
                </button>
                <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors">
                  Transfer Funds
                </button>
                <button onClick={handleLogout} className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
