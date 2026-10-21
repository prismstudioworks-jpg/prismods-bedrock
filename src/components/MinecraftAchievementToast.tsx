import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';

interface MinecraftAchievementToastProps {
  message: string | null;
}

export const MinecraftAchievementToast: React.FC<MinecraftAchievementToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] animate-bounce-short pointer-events-none">
      <div className="bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl shadow-amber-950/80 flex items-center gap-3.5 max-w-sm backdrop-blur-md">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
          <Trophy className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-0.5 flex-1 pr-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Achievement Get!
          </div>
          <div className="text-xs font-bold text-white leading-tight">
            {message}
          </div>
          <div className="text-[10px] text-slate-400">
            Auto-save progress (10s tick active)
          </div>
        </div>
      </div>
    </div>
  );
};
