import React from 'react';
import { Home, Newspaper, Scroll, Settings } from 'lucide-react';
import { ThemeMode } from '../types/addon';
import { getTranslation } from '../utils/i18n';

export type NavTabId = 'home' | 'news' | 'rules' | 'settings';

interface BottomNavBarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  themeMode: ThemeMode;
  currentLanguage: string;
  newsBadge?: number | string;
  rulesCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  themeMode,
  currentLanguage,
  newsBadge = 'NEW',
  rulesCount,
}) => {
  const isLight = themeMode === 'light';

  const navItems = [
    {
      id: 'home' as NavTabId,
      label: getTranslation('home', currentLanguage) || 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'news' as NavTabId,
      label: getTranslation('news', currentLanguage) || 'News',
      icon: Newspaper,
      badge: newsBadge,
    },
    {
      id: 'rules' as NavTabId,
      label: getTranslation('rules', currentLanguage) || 'Rules',
      icon: Scroll,
      badge: rulesCount && rulesCount > 0 ? rulesCount : null,
    },
    {
      id: 'settings' as NavTabId,
      label: getTranslation('settings', currentLanguage) || 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 transition-colors select-none ${
        isLight
          ? 'bg-white/95 border-t border-slate-200/90 text-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-slate-950/95 border-t border-slate-800/90 text-slate-300 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]'
      } backdrop-blur-lg`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
      aria-label="Main Navigation"
    >
      <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all duration-200 active:scale-95 group ${
                isActive
                  ? isLight
                    ? 'text-cyan-700 font-bold'
                    : 'text-cyan-400 font-bold'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900 font-medium'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active glow pill background */}
              {isActive && (
                <span
                  className={`absolute inset-x-2 inset-y-0 rounded-xl transition-all ${
                    isLight
                      ? 'bg-cyan-50 border border-cyan-200/60'
                      : 'bg-cyan-500/10 border border-cyan-500/20'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'group-hover:scale-105 stroke-[1.8]'
                  }`}
                />

                {/* Badge if any */}
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-tight leading-tight shadow-sm animate-pulse ${
                      item.id === 'news'
                        ? 'bg-rose-500 text-white'
                        : isLight
                        ? 'bg-slate-800 text-white'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`relative z-10 text-[11px] mt-1 tracking-tight truncate max-w-[70px] ${
                  isActive ? 'font-black' : 'font-medium'
                }`}
              >
                {item.label}
              </span>

              {/* Active Dot */}
              {isActive && (
                <span
                  className="relative z-10 w-1.5 h-1.5 mt-0.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
