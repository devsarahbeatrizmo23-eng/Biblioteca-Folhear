import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[#5D97D1] hover:bg-[#88C7DB] text-white border border-[#5D97D1] hover:border-[#88C7DB] shadow-sm',
  secondary:
    'bg-[#88C7DB] hover:bg-[#A8E1DF] text-white border border-[#88C7DB] hover:border-[#A8E1DF] shadow-sm',
  outline:
    'bg-transparent hover:bg-[#DDF8C3] text-[#5D97D1] border border-[#5D97D1] hover:text-[#5D97D1]',
  ghost: 'bg-transparent hover:bg-[#DDF8C3] text-[#5D97D1] border border-transparent',
  danger: 'bg-red-500 hover:bg-red-600 text-white border border-red-500 shadow-sm',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#88C7DB] focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
