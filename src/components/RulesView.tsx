import React, { useState } from 'react';
import { CommunityRule, ThemeMode } from '../types/addon';
import { 
  Scroll, Shield, CheckCircle2, AlertTriangle, Plus, 
  Trash2, Search, FileText, Lock, Sparkles, Scale, Info 
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface RulesViewProps {
  rules: CommunityRule[];
  onAddRule?: (title: string, description: string) => void;
  onDeleteRule?: (id: string) => void;
  themeMode: ThemeMode;
  currentLanguage: string;
  isOwnerOrAdmin: boolean;
  onOpenRulesEditor?: () => void;
}

const DEFAULT_STARTER_RULES: CommunityRule[] = [
  {
    id: 'rule-default-1',
    title: 'Safe & Direct Add-on Links Only',
    description: 'All downloads must link directly to .mcaddon, .mcpack, .mcworld, MediaFire, CurseForge, GitHub, or reputable creator hubs. Link shorteners with deceptive ads, survey paywalls, or suspicious popups are strictly prohibited.',
    createdAt: Date.now() - 1000000,
  },
  {
    id: 'rule-default-2',
    title: 'Valid Manifest & UUID Integrity',
    description: 'Ensure your add-ons contain unique UUIDs in manifest.json to prevent world corruption when loaded alongside other Bedrock packs. Test packs before submitting.',
    createdAt: Date.now() - 800000,
  },
  {
    id: 'rule-default-3',
    title: 'Respect Original Creators & Give Credit',
    description: 'Never re-upload another creator’s textures, models, or scripts without explicit permission. Always link the original author and state modifications clearly in the description.',
    createdAt: Date.now() - 600000,
  },
  {
    id: 'rule-default-4',
    title: 'Family-Friendly & Non-Toxic Community',
    description: 'Keep comment sections, usernames, and pack descriptions respectful. Inappropriate content, hate speech, spamming, or harassment will result in immediate suspension.',
    createdAt: Date.now() - 400000,
  },
  {
    id: 'rule-default-5',
    title: 'Accurate Bedrock Version & Category Tags',
    description: 'Properly tag compatible Bedrock versions (e.g. 1.21+, 1.20+) and correct categories (Addon, Map, Texture Pack, Shader, Skin Pack). Do not use misleading thumbnails or false promises.',
    createdAt: Date.now() - 200000,
  },
];

export const RulesView: React.FC<RulesViewProps> = ({
  rules,
  onAddRule,
  onDeleteRule,
  themeMode,
  currentLanguage,
  isOwnerOrAdmin,
  onOpenRulesEditor,
}) => {
  const isLight = themeMode === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Use stored custom rules or default starter rules
  const displayRules = rules && rules.length > 0 ? rules : DEFAULT_STARTER_RULES;

  const filteredRules = displayRules.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
  });

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    if (onAddRule) {
      onAddRule(newTitle.trim(), newDesc.trim());
    }
    setNewTitle('');
    setNewDesc('');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
        isLight
          ? 'bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-amber-200/80 shadow-sm'
          : 'bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border-slate-800 shadow-xl'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Scroll className="w-3.5 h-3.5" />
              <span>Official Code of Conduct</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Community Rules & Guidelines
            </h1>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Enforced by PrismMods moderation to keep Minecraft Bedrock downloads safe, clean, and enjoyable for all players.
            </p>
          </div>

          {isOwnerOrAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Rule</span>
              </button>

              {onOpenRulesEditor && (
                <button
                  onClick={onOpenRulesEditor}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                >
                  Manage in Tools
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Highlights / Rules Pillars */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
            isLight ? 'bg-white/80 border-slate-200 text-slate-800' : 'bg-slate-950/70 border-slate-800 text-emerald-300'
          }`}>
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="block font-bold">Trusted Source App</strong>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Direct verified downloads</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
            isLight ? 'bg-white/80 border-slate-200 text-slate-800' : 'bg-slate-950/70 border-slate-800 text-cyan-300'
          }`}>
            <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <strong className="block font-bold">Fair Play & Creator Rights</strong>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Respect original assets</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
            isLight ? 'bg-white/80 border-slate-200 text-slate-800' : 'bg-slate-950/70 border-slate-800 text-amber-300'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <strong className="block font-bold">Zero Tolerance Toxicity</strong>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Constructive friendly chat</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/40">
          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search community rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none transition border ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                  : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Inline Add Rule Form (Owner / Admin) */}
      {isAddingNew && (
        <form
          onSubmit={handleSaveNew}
          className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-xl space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Community Rule
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Rule Title</label>
            <input
              type="text"
              required
              placeholder="e.g. No Pirated DLC or Marketplace Content"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Rule Description</label>
            <textarea
              required
              rows={3}
              placeholder="Detailed explanation of the rule and expected behavior..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredRules.map((rule, index) => (
          <div
            key={rule.id}
            className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 ${
              isLight
                ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
                : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900 shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <span className="w-8 h-8 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-black flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>

                <div className="space-y-1.5">
                  <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {rule.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {rule.description}
                  </p>
                </div>
              </div>

              {isOwnerOrAdmin && onDeleteRule && rule.id.startsWith('custom-') && (
                <button
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                  title="Delete this rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredRules.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <Scroll className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
            <p className="text-sm font-bold text-slate-300">No matching rules found</p>
            <p className="text-xs text-slate-500">Try searching for other keywords.</p>
          </div>
        )}
      </div>

      {/* Moderation Warning Footer */}
      <div className={`p-4 sm:p-5 rounded-2xl border text-xs flex items-center gap-3 ${
        isLight
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
      }`}>
        <Info className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="space-y-0.5">
          <span className="font-bold">Automated & Community Moderation:</span>
          <p className="text-[11px] opacity-90 leading-relaxed">
            Violations of these guidelines can lead to account timeouts, pack removal, or permanent device bans. To report an issue, use the report button inside any add-on card.
          </p>
        </div>
      </div>
    </div>
  );
};
