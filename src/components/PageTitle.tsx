import React from 'react';

export interface PageTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  className = '',
  badge,
}) => {
  return (
    <div className={`text-center space-y-2 mb-6 ${className}`}>
      {badge && (
        <div className="inline-flex items-center justify-center mb-1">
          {badge}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
