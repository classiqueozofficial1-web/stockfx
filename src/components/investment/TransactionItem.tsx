import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
export type TransactionType = 'deposit' | 'withdrawal' | 'trade' | 'purchase';
interface TransactionItemProps {
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: string;
  date: string;
}
export function TransactionItem({
  type,
  title,
  subtitle,
  amount,
  date
}: TransactionItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-5 w-5 text-emerald-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-slate-600" />;
      case 'trade':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      case 'purchase':
        return <ShoppingBag className="h-5 w-5 text-purple-600" />;
    }
  };
  const getIconBg = () => {
    switch (type) {
      case 'deposit':
        return 'bg-emerald-100';
      case 'withdrawal':
        return 'bg-slate-100';
      case 'trade':
        return 'bg-blue-100';
      case 'purchase':
        return 'bg-purple-100';
    }
  };
  const isPositive =
  type === 'deposit' || type === 'trade' && amount.startsWith('+');
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 -mx-2 rounded-lg transition-colors">
      <div className="flex items-center">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${getIconBg()}`}>

          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>

          {isPositive ? '+' : ''}
          {amount}
        </p>
        <p className="text-xs text-slate-400">{date}</p>
      </div>
    </div>);

}