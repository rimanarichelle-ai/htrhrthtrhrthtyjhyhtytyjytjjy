import React from 'react';

interface DZLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  onClick?: () => void;
}

export const DZLogo: React.FC<DZLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  theme = 'auto',
  className = '',
  onClick,
}) => {
  const getTextColor = () => {
    if (theme === 'dark') return 'text-white';
    if (theme === 'light') return 'text-gray-900';
    return 'text-gray-900 dark:text-white';
  };

  const getSubtitleColor = () => {
    if (theme === 'dark') return 'text-gray-400';
    if (theme === 'light') return 'text-gray-500';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* DZ RENT CAR Vector Wordmark matching screenshot */}
      <div className="flex flex-col">
        <div className="relative flex items-center">
          {/* Dynamic orange arch curve above */}
          <svg
            className="absolute -top-2.5 left-0 w-full h-3"
            viewBox="0 0 140 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 14C35 2 105 2 138 14"
              stroke="#ff6600"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-[#ff6600] pr-1">
            DZ
          </span>
          <span className={`text-xl sm:text-2xl font-black tracking-tight ${getTextColor()}`}>
            RENT CAR
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] font-medium tracking-wide mt-0.5 ${getSubtitleColor()}`}>
            Location de voitures à Alger
          </span>
        )}
      </div>
    </div>
  );
};


