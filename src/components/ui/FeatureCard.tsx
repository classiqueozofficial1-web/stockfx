import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: string | ReactNode;
  title: string;
  description: string;
  color?: 'amber' | 'blue' | 'emerald' | 'purple';
  index?: number;
}

export function FeatureCard({ icon, title, description, color = 'amber', index = 0 }: FeatureCardProps) {
  const colorClass = {
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
  }[color];

  return (
    <div 
      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:scale-105 hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-left-8"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 pt-2 ${colorClass} text-2xl`}>
        {typeof icon === 'string' ? icon : icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
