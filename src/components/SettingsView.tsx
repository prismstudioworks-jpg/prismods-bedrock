import React, { useState } from 'react';
import { 
  MemberUser, DownloadHistoryItem, ThemeMode, UserRole, TextFontPreference, AppStatusConfig 
} from '../types/addon';
import { 
  Settings, Moon, Sun, Globe, Download, User, LogOut, 
  LogIn, Search, Check, Clock, Trash2, Sparkles, Type, 
  Shield, Info, Smartphone, ExternalLink, RefreshCw, Key
} from 'lucide-react';
import { WORLD_LANGUAGES, getTranslation } from '../utils/i18n';
import { UserRoleBadge } from './UserRoleBadge';

interface SettingsViewProps {
  currentMember: MemberUser | null;
  downloadHistory: DownloadHistoryItem[];
  themeMode: ThemeMode;
  onToggleTheme: (mode: ThemeMode) => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
  onSignOut: () => void;
  onOpenSignIn: () => void;
  onClearDownloadHistory: () => void;
  role: UserRole;
  isAdmin: boolean;
  isOwner: boolean;
  ownerTagText?: string;
  ownerTagColor?: string;
  adminTagColor?: string;
  fontPreference: TextFontPreference;
  onToggleFont: (font: TextFontPreference) => void;
  appStatus: AppStatusConfig;
  onOpenDeveloperTools?: () => void;
  onToggleDeveloperSecret?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentMember,
  downloadHistory,
  themeMode,
  onToggleTheme,
  currentLanguage,
  onSelectLanguage,
  onSignOut,
  onOpenSignIn,
  onClearDownloadHistory,
  role,
  isAdmin,
  isOwner,
  ownerTagText,
  ownerTagColor,
  adminTagColor,
  fontPreference,
  onToggleFont,
  appStatus,
  onOpenDeveloperTools,
  onToggleDeveloperSecret,
}) => {
  const isLight = themeMode === 'light';
  const [activeSubTab, setActiveSubTab] = useState<'theme' | 'account' | 'languages' | 'downloads' | 'about'>('theme');
  const [langSearch, setLangSearch] = useState('');

  const filteredLanguages = WORLD_LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
        isLight
          ? 'bg-gradient-to-br from-cyan-50 via-white to-blue-50 border-cyan-200/80 shadow-sm'
          : 'bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 border-slate-800 shadow-xl'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5" />
              <span>App Preferences</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Settings & Preferences
            </h1>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Customize your display theme, font, account profile, download history, and app language.
            </p>
          </div>

          {/* Current Mode Badge */}
          <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}>
            <span>Active Theme:</span>
            <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black uppercase ${
              isLight ? 'bg-amber-100 text-amber-800' : 'bg-cyan-500/20 text-cyan-400'
            }`}>
              {isLight ? 'Light (White)' : 'Dark'}
            </span>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/40 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'theme', label: '🎨 Appearance & Theme', icon: Moon },
            { id: 'account', label: '👤 Account & Profile', icon: User },
            { id: 'languages', label: '🌐 World Languages', icon: Globe },
            { id: 'downloads', label: `📥 Downloads (${downloadHistory.length})`, icon: Download },
            { id: 'about', label: 'ℹ️ About & Version', icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : isLight
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: APPEARANCE & THEME (Dark Mode / Light Mode + Fonts) */}
      {activeSubTab === 'theme' && (
        <div className="space-y-6">
          {/* Dark / Light Mode Selector */}
          <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-xl'
          }`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Display Theme Mode
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Choose between Dark Bedrock UI or clean White / Light Mode for your device.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dark Mode Card */}
              <div
                onClick={() => onToggleTheme('dark')}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                  themeMode === 'dark'
                    ? 'border-cyan-400 bg-cyan-950/30 text-white shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-900 text-cyan-400 border border-slate-800">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">Dark Mode</h4>
                    <p className="text-xs text-slate-400">Deep obsidian & cyan neon accents</p>
                  </div>
                </div>
                {themeMode === 'dark' && (
                  <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black text-xs">
                    ✓
                  </span>
                )}
              </div>

              {/* Light Mode Card */}
              <div
                onClick={() => onToggleTheme('light')}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                  themeMode === 'light'
                    ? 'border-amber-400 bg-amber-50 text-slate-900 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-black text-sm ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      Light Mode
                    </h4>
                    <p className={`text-xs ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      Clean white background & crisp contrast
                    </p>
                  </div>
                </div>
                {themeMode === 'light' && (
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                    ✓
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Typography / Font Preference */}
          <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-xl'
          }`}>
            <h3 className={`text-base font-black mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Text & Font Style
            </h3>
            <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Select font style for UI labels, titles, and descriptions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onToggleFont('basic')}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  fontPreference === 'basic'
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="block font-bold text-sm">Modern Sans (Default)</span>
                    <span className="text-[11px] opacity-75">Clean, highly readable typography</span>
                  </div>
                </div>
                {fontPreference === 'basic' && <Check className="w-4 h-4 text-cyan-400" />}
              </button>

              <button
                type="button"
                onClick={() => onToggleFont('minecraft')}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between font-mono ${
                  fontPreference === 'minecraft'
                    ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="block font-bold text-sm">Minecraft Pixel Font</span>
                    <span className="text-[11px] opacity-75">Classic 8-bit Bedrock game styling</span>
                  </div>
                </div>
                {fontPreference === 'minecraft' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACCOUNT & PROFILE */}
      {activeSubTab === 'account' && (
        <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-xl'
        }`}>
          {currentMember ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={currentMember.avatar}
                    alt={currentMember.username}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-800 border-2 border-cyan-400/40"
                  />
                  <div>
                    <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {currentMember.displayName || currentMember.username}
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono">@{currentMember.username}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <UserRoleBadge
                        role={role}
                        tagText={isOwner ? ownerTagText : isAdmin ? 'Admin' : 'Visitor'}
                        tagColor={isOwner ? ownerTagColor : isAdmin ? adminTagColor : undefined}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={onSignOut}
                  className="px-4 py-2 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <span className="text-slate-400 block mb-1">Username</span>
                  <strong className={isLight ? 'text-slate-800' : 'text-white'}>{currentMember.username}</strong>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <span className="text-slate-400 block mb-1">Member Status</span>
                  <strong className="text-emerald-400">Active Member</strong>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <span className="text-slate-400 block mb-1">Joined Date</span>
                  <strong className={isLight ? 'text-slate-800' : 'text-white'}>
                    {new Date(currentMember.joinedAt).toLocaleDateString()}
                  </strong>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <span className="text-slate-400 block mb-1">Total Downloads on Device</span>
                  <strong className="text-cyan-400">{downloadHistory.length} addons</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Sign In to PrismMods
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Log in or register an account to leave reviews, save favorite add-ons across sessions, and join community discussions.
                </p>
              </div>

              <button
                onClick={onOpenSignIn}
                className="w-full py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Sign In / Create Account</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: WORLD LANGUAGES */}
      {activeSubTab === 'languages' && (
        <div className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-xl'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Choose Display Language
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Supports 50+ languages with regional variants.
              </p>
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search languages..."
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none transition border ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-sm'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{lang.flag}</span>
                    <div className="truncate">
                      <span className="block font-bold text-xs truncate">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 truncate">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DOWNLOAD HISTORY */}
      {activeSubTab === 'downloads' && (
        <div className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Local Download History
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Track packages downloaded directly on this browser/device.
              </p>
            </div>

            {downloadHistory.length > 0 && (
              <button
                onClick={onClearDownloadHistory}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {downloadHistory.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Download className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
              <p className="text-xs font-bold text-slate-400">No downloads recorded yet</p>
              <p className="text-[11px] text-slate-500">Add-ons you download will appear here for quick reference.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {downloadHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Download className="w-4 h-4" />
                    </span>
                    <div>
                      <strong className="block font-bold text-sm">{item.title}</strong>
                      <span className="text-[10px] text-slate-400">
                        {item.category} • {new Date(item.downloadedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {item.fileFormat && (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-300 font-mono text-[10px] font-bold">
                      .{item.fileFormat}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: ABOUT & VERSION */}
      {activeSubTab === 'about' && (
        <div className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                PrismMods Bedrock Edition
              </h3>
              <p className="text-xs text-slate-400">
                Version {appStatus.appVersion || '1.0.0'} • Minecraft Bedrock Mod Hub
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border text-xs space-y-2 leading-relaxed ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <p>
              PrismMods is an open Minecraft Bedrock hub for Add-ons, Behavior Packs, Resource Packs, Shaders, and Custom Worlds.
            </p>
            <p className="text-slate-500 text-[11px]">
              Minecraft is a registered trademark of Mojang AB / Microsoft Corporation. All community modifications remain the intellectual property of their respective creators.
            </p>
          </div>

          {/* Developer Tools Shortcut if developer/owner */}
          {isOwner && onOpenDeveloperTools && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Key className="w-4 h-4" />
                <span>Developer Workshop Access</span>
              </div>
              <button
                type="button"
                onClick={onOpenDeveloperTools}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Open Developer Tools
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
