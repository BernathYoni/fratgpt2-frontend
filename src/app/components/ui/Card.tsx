import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl p-6 ${hover ? 'hover:border-accent transition-colors' : ''} ${className}`}>
      {children}
    </div>
  );
}
