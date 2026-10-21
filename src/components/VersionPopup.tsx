import React from 'react';
import { Info } from 'lucide-react';

interface VersionPopupProps {
  version: string;
  message: string;
  onClose: () => void;
}

export const VersionPopup: React.FC<VersionPopupProps> = ({ version, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl space-y-4 max-w-sm w-full">
        <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white">App Version {version}</h2>
          <p className="text-slate-400 text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
