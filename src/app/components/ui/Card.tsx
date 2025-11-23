import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`bg-white border border-border rounded-xl p-6 shadow-sm ${hover ? 'hover:shadow-md hover:border-accent transition-all duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
}
