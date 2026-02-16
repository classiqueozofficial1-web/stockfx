import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { LogOut, TrendingUp, Wallet, Zap, BarChart3 } from 'lucide-react';

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

  // Fallback data if user data is incomplete
  const portfolioValue = user?.balance || 0;
  const totalProfit = user?.totalProfit || 2450.50;
  const monthlyIncome = user?.monthlyIncome || 1200.75;
  const activeTrades = user?.activeTrades || 12;
  const portfolioPerformance = user?.portfolioPerformance || 8.5;

  const assetAllocation = {
    stocks: 45,
    crypto: 25,
    etfs: 20,
    cash: 10
  };

  const topHoldings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, value: 7500, change: 2.5 },
    { symbol: 'BTC', name: 'Bitcoin', shares: 0.5, value: 18750, change: 5.2 },
    { symbol: 'MSFT', name: 'Microsoft', shares: 25, value: 8750, change: 1.8 },
    { symbol: 'ETH', name: 'Ethereum', shares: 5, value: 9250, change: 4.1 }
  ];

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Welcome, {user.firstName}! 👋</h1>
            <p className="text-slate-600 mt-2">Here's your investment portfolio overview</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="lg" className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-slate-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Portfolio Value</p>
                <p className="text-3xl font-bold text-slate-900">${portfolioValue.toFixed(2)}</p>
              </div>
              <Wallet className="h-8 w-8 text-emerald-600 opacity-75" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-slate-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Profit</p>
                <p className="text-3xl font-bold text-emerald-600">${totalProfit.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600 opacity-75" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-slate-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Monthly Income</p>
                <p className="text-3xl font-bold text-blue-600">${monthlyIncome.toFixed(2)}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600 opacity-75" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-slate-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Portfolio Performance</p>
                <p className="text-3xl font-bold text-purple-600">{portfolioPerformance.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600 opacity-75" />
            </div>
          </div>
        </div>

        {/* Active Trades & Asset Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Asset Allocation */}
          <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Asset Allocation</h2>
            <div className="space-y-4">
              {Object.entries(assetAllocation).map(([asset, percentage]) => (
                <div key={asset}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">{asset}</span>
                    <span className="text-sm font-bold text-slate-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        asset === 'stocks' ? 'bg-blue-500' :
                        asset === 'crypto' ? 'bg-orange-500' :
                        asset === 'etfs' ? 'bg-emerald-500' :
                        'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Trades */}
          <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Active Trades</h2>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-900">Active Positions</p>
                    <p className="text-sm text-slate-600">Currently open positions</p>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">{activeTrades}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <p className="text-xs text-slate-600">Win Rate</p>
                  <p className="font-bold text-blue-600">78%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                  <p className="text-xs text-slate-600">Avg Return</p>
                  <p className="font-bold text-purple-600">+6.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Holdings */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Top Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Symbol</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Company</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Shares</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Value</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Change</th>
                </tr>
              </thead>
              <tbody>
                {topHoldings.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{holding.symbol}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600">{holding.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-slate-600">{holding.shares}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-slate-900">${holding.value.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold ${holding.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Info Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 text-white rounded-xl p-6">
            <h3 className="font-semibold mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-slate-400">Email:</span> {user.email}</p>
              <p><span className="text-slate-400">Name:</span> {user.firstName} {user.lastName || ''}</p>
              <p><span className="text-slate-400">Status:</span> <span className="text-emerald-400">✓ Verified</span></p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full bg-white text-emerald-600 hover:bg-slate-100">Buy Assets</Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white">Transfer Funds</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
