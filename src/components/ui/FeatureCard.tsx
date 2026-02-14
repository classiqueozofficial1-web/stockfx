import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: string | ReactNode;
  title: string;
  description: string;
  color?: 'amber' | 'blue' | 'emerald' | 'purple';
}

export function FeatureCard({ icon, title, description, color = 'amber' }: FeatureCardProps) {
  const colorClass = {
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
  }[color];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass} text-xl`}>
        {typeof icon === 'string' ? icon : icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
