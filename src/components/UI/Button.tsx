import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  return (
    <button 
      className={`win95-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
