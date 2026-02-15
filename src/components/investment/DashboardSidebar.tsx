
import {
  LayoutDashboard,
  PieChart,
  ArrowRightLeft,
  Settings,
  LogOut,
  CreditCard,
} from 'lucide-react';
import { Logo } from './Logo';
interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}
export function DashboardSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  userName = 'Alex Morgan',
  userEmail = 'alex@example.com'
}: DashboardSidebarProps) {
  const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: PieChart
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ArrowRightLeft
  },
  {
    id: 'cards',
    label: 'Cards',
    icon: CreditCard
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white h-screen fixed left-0 top-0 border-r border-amber-500/20 overflow-hidden shadow-2xl shadow-black/50">
      {/* Logo Area */}
      <div className="p-4 sm:p-5 flex items-center border-b border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
        <Logo size="md" showText={true} variant="dark" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 sm:py-4 md:py-6 px-2 sm:px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                    ${isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                  `}>
                  <Icon
                    className={`mr-2 sm:mr-3 h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
            </button>);

        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center mb-4 px-2">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg text-sm">
            {userName.charAt(0)}
          </div>
          <div className="ml-2 sm:ml-3 overflow-hidden">
            <p className="text-xs sm:text-sm font-medium text-white truncate">
              {userName}
            </p>
            <p className="text-xs text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">

          <LogOut className="mr-2 sm:mr-3 h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Out</span>
        </button>
      </div>
    </div>);

}