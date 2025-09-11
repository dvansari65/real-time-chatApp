import React from 'react';

export const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center space-x-2 h-10">
      <div className="w-3 h-3 rounded-full bg-gray-500 animate-[pulse_1.5s_ease-in-out_infinite] opacity-30"></div>
      <div className="w-3 h-3 rounded-full bg-gray-500 animate-[pulse_1.5s_ease-in-out_infinite_0.5s] opacity-30"></div>
      <div className="w-3 h-3 rounded-full bg-gray-500 animate-[pulse_1.5s_ease-in-out_infinite_1s] opacity-30"></div>
    </div>
  );
};

