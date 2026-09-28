import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

interface ThemeToggleProps {
  showMenu?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showMenu = false,
  className = '',
  size = 'md',
}) => {
  const { themeMode, resolvedTheme, isDark, toggleTheme, setThemeMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!showMenu) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
        title={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
        className={`relative inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6600] ${
          isDark
            ? 'bg-[#181a24] text-[#ff6600] hover:bg-[#222533] border border-white/10 shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/80 shadow-xs'
        } ${size === 'sm' ? 'p-2 text-xs' : 'p-2.5'} ${className}`}
      >
        <span className="sr-only">Basculer le thème</span>
        {isDark ? (
          <Sun className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} transition-transform duration-300 rotate-0 scale-100 stroke-[2.2]`} />
        ) : (
          <Moon className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} transition-transform duration-300 -rotate-12 scale-100 stroke-[2.2] text-gray-700`} />
        )}
      </button>
    );
  }

  const options: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { mode: 'light', label: 'Clair', icon: Sun },
    { mode: 'dark', label: 'Sombre', icon: Moon },
    { mode: 'system', label: 'Système', icon: Monitor },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Sélectionner le mode d'affichage"
        aria-expanded={dropdownOpen}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6600] ${
          isDark
            ? 'bg-[#181a24] text-gray-200 hover:bg-[#222533] border border-white/10'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
        }`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-[#ff6600]" />
        ) : (
          <Sun className="w-4 h-4 text-[#ff6600]" />
        )}
        <span className="capitalize">{themeMode === 'system' ? 'Auto' : themeMode === 'dark' ? 'Sombre' : 'Clair'}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-[#181a24] border border-gray-200 dark:border-white/10 shadow-xl py-1.5 z-50 animate-fadeIn">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = themeMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setThemeMode(opt.mode);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-[#ff6600] bg-orange-50 dark:bg-orange-950/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#ff6600]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
