import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
  size = 'md',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-700 disabled:cursor-not-allowed disabled:opacity-50';

  const sizes = {
    sm:  'px-4 py-1.5 text-sm',
    md:  'px-6 py-2.5 text-sm',
    lg:  'px-8 py-3   text-base',
  };

  const variants = {
    primary:   'bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
    outline:   'border border-navy-800 text-navy-800 hover:bg-navy-50 active:bg-navy-100',
    ghost:     'text-navy-800 hover:bg-navy-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
