interface StatCounterProps {
  label: string;
  value: string;
  icon?: string;
  trend?: 'up' | 'down';
}

export function StatCounter({ label, value }: StatCounterProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
      <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
    </div>
  );
}
