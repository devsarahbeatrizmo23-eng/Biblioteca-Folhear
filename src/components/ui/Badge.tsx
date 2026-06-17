import React from 'react';
import { LoanStatus } from '../../types';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  info: 'bg-[#A8E1DF] text-gray-700 border border-[#88C7DB]',
  gray: 'bg-gray-100 text-gray-500 border border-gray-200',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${VARIANT_CLASSES[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const configs: Record<LoanStatus, { label: string; variant: BadgeVariant }> = {
    pendente: { label: 'Pendente', variant: 'default' },
    devolvido: { label: 'Devolvido', variant: 'success' },
    atrasado: { label: 'Atrasado', variant: 'error' },
  };

  const config = configs[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function AvailabilityBadge({ available }: { available: boolean }) {
  return available ? (
    <Badge variant="success">Disponível</Badge>
  ) : (
    <Badge variant="gray">Esgotado</Badge>
  );
}
