import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  topBorderColor?: 'color-3' | 'color-4' | 'color-5' | 'none';
  onClick?: () => void;
  hoverable?: boolean;
}

const TOP_BORDER_CLASSES = {
  'color-3': 'border-t-4 border-t-[#A8E1DF]',
  'color-4': 'border-t-4 border-t-[#88C7DB]',
  'color-5': 'border-t-4 border-t-[#5D97D1]',
  none: '',
};

export function Card({
  children,
  className = '',
  topBorderColor = 'none',
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        ${TOP_BORDER_CLASSES[topBorderColor]}
        ${hoverable ? 'hover:shadow-md hover:border-[#A8E1DF] transition-all duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  topBorderColor?: 'color-3' | 'color-4' | 'color-5';
  onClick?: () => void;
  trend?: {
    value: string;
    positive?: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  topBorderColor = 'color-3',
  onClick,
  trend,
}: StatCardProps) {
  return (
    <Card topBorderColor={topBorderColor} hoverable={!!onClick} onClick={onClick}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            {trend && (
              <p className={`text-xs mt-1 font-medium ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: '#DDF8C3' }}>
            <div style={{ color: '#5D97D1' }}>{icon}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
