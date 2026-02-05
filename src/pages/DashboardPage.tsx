import { useState } from 'react';
import { DashboardSidebar } from '../components/investment/DashboardSidebar';
import { StatsCard } from '../components/investment/StatsCard';
import {
  TransactionItem } from
'../components/investment/TransactionItem';
import { PortfolioChart } from '../components/investment/PortfolioChart';
import { Button } from '../components/ui/Button';
import {
  Bell,
  Search,
  Wallet,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  ArrowUpRight,
  Menu,
  X } from
'lucide-react';
interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

import { useEffect } from 'react';
import { getDashboard, clearToken } from '../lib/session';

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">{error || 'Please log in to view your dashboard.'}</h2>
          <button className="text-emerald-600 font-medium" onClick={() => { clearToken(); onNavigate('login'); }}>Go to Login</button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    clearToken();
    onNavigate('landing');
  };
  // Show zero balance and no transactions for new users
  const transactions: any[] = [];
  const balance = user.balance ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={user.name}
        userEmail={user.email}
        balance={balance}
      />


      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen &&
      <div className="fixed inset-0 z-50 md:hidden">
          <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}>
        </div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 z-50 animate-slide-in-left">
            <div className="flex justify-end p-4">
              <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white">

                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="h-full overflow-y-auto pb-20">
              {/* Reusing sidebar logic would be better, but for simplicity in template: */}
              <DashboardSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              onLogout={() => onNavigate('landing')} />

            </div>
          </div>
        </div>
      }

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-500 hover:text-slate-700 mr-4">

              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-lg text-slate-900">InvestPro</span>
          </div>

              <div className="hidden md:flex items-center text-xl font-bold text-slate-900">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64" />

            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right mr-2">
                <span className="text-sm font-medium text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
              <Button
                size="sm"
                className="hidden sm:flex"
                onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Balance"
              value="$124,592.00"
              change="2.4%"
              icon={Wallet} />

            <StatsCard
              title="Total Profit"
              value="$12,402.00"
              change="12.5%"
              icon={TrendingUp}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100" />

            <StatsCard
              title="Monthly Income"
              value="$3,240.50"
              change="4.2%"
              icon={DollarSign}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100" />

            <StatsCard
              title="Active Trades"
              value="14"
              change="2"
              isPositive={false}
              icon={Activity}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100" />

          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Chart Section */}
            <div className="lg:col-span-2 space-y-8">
              <PortfolioChart />

              {/* Watchlist */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Market Watchlist</h3>
                  <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                  {
                    symbol: 'AAPL',
                    name: 'Apple Inc.',
                    price: '$182.50',
                    change: '+1.2%',
                    up: true
                  },
                  {
                    symbol: 'TSLA',
                    name: 'Tesla, Inc.',
                    price: '$240.10',
                    change: '-0.8%',
                    up: false
                  },
                  {
                    symbol: 'BTC',
                    name: 'Bitcoin',
                    price: '$34,200.00',
                    change: '+4.5%',
                    up: true
                  },
                  {
                    symbol: 'ETH',
                    name: 'Ethereum',
                    price: '$1,780.00',
                    change: '+2.1%',
                    up: true
                  }].
                  map((stock) =>
                  <div
                    key={stock.symbol}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">

                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 mr-4">
                          {stock.symbol}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {stock.symbol}
                          </p>
                          <p className="text-xs text-slate-500">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          {stock.price}
                        </p>
                        <p
                        className={`text-xs font-medium ${stock.up ? 'text-emerald-600' : 'text-red-600'}`}>

                          {stock.change}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Transactions & Quick Actions */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-emerald-600 rounded-xl p-6 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <h3 className="font-bold text-lg mb-1 relative z-10">
                  Quick Transfer
                </h3>
                <p className="text-emerald-100 text-sm mb-6 relative z-10">
                  Move funds instantly between accounts.
                </p>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center gap-2">
                    <ArrowUpRight className="h-5 w-5" />
                    Send
                  </button>
                  <button className="bg-white text-emerald-900 hover:bg-emerald-50 p-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center gap-2 shadow-sm">
                    <Plus className="h-5 w-5" />
                    Add Money
                  </button>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900">Recent Activity</h3>
                  <button className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {transactions.map((tx, i) =>
                  <TransactionItem key={i} {...tx} />
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-sm"
                  rightIcon={<ArrowUpRight className="h-4 w-4" />}>

                  View All History
                </Button>
              </div>

              {/* Asset Allocation */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-6">
                  Asset Allocation
                </h3>
                <div className="flex items-center justify-center mb-6 relative">
                  {/* Simple CSS Donut Chart */}
                  <div className="h-40 w-40 rounded-full border-[16px] border-emerald-500 border-r-blue-500 border-b-purple-500 border-l-orange-500 transform rotate-45"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs text-slate-500">Total Assets</span>
                    <span className="font-bold text-slate-900">12</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                  {
                    label: 'Stocks',
                    color: 'bg-emerald-500',
                    value: '45%'
                  },
                  {
                    label: 'Crypto',
                    color: 'bg-blue-500',
                    value: '25%'
                  },
                  {
                    label: 'ETFs',
                    color: 'bg-purple-500',
                    value: '20%'
                  },
                  {
                    label: 'Cash',
                    color: 'bg-orange-500',
                    value: '10%'
                  }].
                  map((item) =>
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-sm">

                      <div className="flex items-center">
                        <span
                        className={`h-3 w-3 rounded-full ${item.color} mr-2`}>
                      </span>
                        <span className="text-slate-600">{item.label}</span>
                      </div>
                      <span className="font-medium text-slate-900">
                        {item.value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>);

}