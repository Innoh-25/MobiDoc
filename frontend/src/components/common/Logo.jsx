import React from 'react';

export const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg transform rotate-45"></div>
      <div className="absolute inset-2 bg-white rounded-md"></div>
      <div className="absolute inset-3 flex items-center justify-center">
        <svg className="h-full w-full text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14v6l9-5" />
          <path d="M12 14l-9-5" />
          <path d="M12 14v6l-9-5" />
        </svg>
      </div>
    </div>
  );
};