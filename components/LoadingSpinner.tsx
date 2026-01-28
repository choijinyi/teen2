
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce delay-75"></div>
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce delay-150"></div>
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce delay-300"></div>
    </div>
  );
};

export default LoadingSpinner;
