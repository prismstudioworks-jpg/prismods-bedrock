import React, { useState, useEffect } from 'react';
import { 
  BedrockAddon, AppStatusConfig, VisitorPresence, 
  CommunityRule, InappropriateReport, SocialMediaLink 
} from '../types/addon';
import { 
  X, Wrench, Power, AlertTriangle, ShieldCheck, 
  Users, UserX, Ban, Check, Download, Upload, 
  Sparkles, Palette, Monitor, RefreshCw, HardDrive, 
  Smartphone, Radio, Clock, ShieldAlert, Scroll, 
  Plus, Trash2, Flag, MessageSquare, Image as ImageIcon, Eye
} from 'lucide-react';
import { 
  getVisitorsList, kickVisitorWithTimeout, banVisitor, 
  setAppStatus, broadcastAppEvent, setVisitorAdminRole,
  getCommunityRules, addCommunityRule, deleteCommunityRule,
  getInappropriateReports, resolveInappropriateReport, deleteInappropriateReport
} from '../utils/storage';
import { processImageFile } from '../utils/imageHelper';
import { getMinecraftCharacterAvatar } from '../utils/minecraftAvatars';
import { AppLogo } from './AppLogo';
import { UserRoleBadge } from './UserRoleBadge';
import { BedrockLoadingScreen } from './BedrockLoadingScreen';

interface DeveloperSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appStatus: AppStatusConfig;
  onUpdateAppStatus: (updates: Partial<AppStatusConfig>) => void;
  addons: BedrockAddon[];
  onImportAddons: (imported: BedrockAddon[]) => void;
  onClearAllAddons: () => void;
  onLoadSampleData: () => void;
  onPreviewLoadingScreen?: () => void;
  saveAchievementEnabled: boolean;
  onToggleSaveAchievement: (enabled: boolean) => void;
  saveIntervalSeconds: number;
  onUpdateSaveInterval: (seconds: number) => void;
  loadingScreenEnabled: boolean;
  onToggleLoadingScreen: (enabled: boolean) => void;
  isVisitorPreviewMode: boolean;
  onToggleVisitorPreviewMode: (enabled: boolean) => void;
}

const ICON_PRESETS: { type: AppStatusConfig['appIconType']; label: string; desc: string }[] = [
  { type: 'prism', label: 'Prism Crystal', desc: 'Glowing cyan crystal diamond' },
  { type: 'emerald', label: 'Emerald Gem', desc: 'Vibrant Minecraft emerald' },
  { type: 'netherite', label: 'Netherite Ingot', desc: 'Sleek dark obsidian netherite' },
  { type: 'ender', label: 'Eye of Ender', desc: 'Mystic portal purple & cyan' },
  { type: 'command', label: 'Command Block', desc: 'Legendary developer gold block' },
  { type: 'apple', label: 'Golden Apple', desc: 'Enchanted golden shine' },
];

const ANIMATED_GIF_PRESETS = [
  {
    name: 'Nether Portal',
    desc: 'Swirling purple obsidian portal',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="np" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%239333ea"><animate attributeName="stop-color" values="%239333ea;%23c084fc;%237e22ce;%239333ea" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="%233b0764"><animate attributeName="stop-color" values="%233b0764;%23581c87;%232e1065;%233b0764" dur="3s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="100" height="100" rx="22" fill="%230b0517"/><rect x="16" y="16" width="68" height="68" rx="14" fill="url(%23np)"><animate attributeName="opacity" values="0.85;1;0.75;0.85" dur="2s" repeatCount="indefinite"/></rect><circle cx="36" cy="38" r="8" fill="%23f3e8ff" opacity="0.7"><animate attributeName="cy" values="38;28;38" dur="2.5s" repeatCount="indefinite"/><animate attributeName="r" values="8;5;8" dur="2.5s" repeatCount="indefinite"/></circle><circle cx="64" cy="62" r="9" fill="%23e9d5ff" opacity="0.6"><animate attributeName="cy" values="62;70;62" dur="3s" repeatCount="indefinite"/></circle></svg>',
  },
  {
    name: 'Campfire Flame',
    desc: 'Flickering Minecraft fire flame',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><radialGradient id="cf"><stop offset="0%" stop-color="%23fef08a"/><stop offset="50%" stop-color="%23f97316"/><stop offset="100%" stop-color="%23b91c1c"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="%231a0800"/><path d="M50 16 C45 35 30 46 30 66 C30 80 40 86 50 86 C60 86 70 80 70 66 C70 46 55 35 50 16 Z" fill="url(%23cf)"><animateTransform attributeName="transform" type="scale" values="1 1; 1.06 0.94; 0.97 1.03; 1 1" dur="0.9s" repeatCount="indefinite" transform-origin="50 86"/></path><circle cx="50" cy="70" r="10" fill="%23ffffff" opacity="0.9"><animate attributeName="r" values="10;7;12;10" dur="0.9s" repeatCount="indefinite"/></circle></svg>',
  },
  {
    name: 'Shimmering Diamond',
    desc: 'Pulsing cyan diamond crystal sparkle',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="dm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2367e8f9"><animate attributeName="stop-color" values="%2367e8f9;%23a5f3fc;%2306b6d4;%2367e8f9" dur="2s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="%230e7490"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="%23041c24"/><polygon points="50,20 80,50 50,80 20,50" fill="url(%23dm)"><animateTransform attributeName="transform" type="rotate" values="0 50 50; 360 50 50" dur="12s" repeatCount="indefinite"/></polygon><circle cx="35" cy="35" r="4" fill="%23ffffff"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="65" cy="65" r="4" fill="%23ffffff"><animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/></circle></svg>',
  },
  {
    name: 'Ender Eye',
    desc: 'Mystical floating ender eye animation',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="22" fill="%23051a14"/><circle cx="50" cy="50" r="32" fill="%23059669"><animate attributeName="r" values="32;35;32" dur="2.2s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="22" fill="%2310b981"/><ellipse cx="50" cy="50" rx="6" ry="16" fill="%23022c22"><animate attributeName="ry" values="16;4;16" dur="3s" repeatCount="indefinite"/></ellipse><circle cx="48" cy="46" r="3" fill="%23a7f3d0"/></svg>',
  },
];

const TIMEOUT_PRESETS = [
  { label: '1 Minute', seconds: 60 },
  { label: '5 Minutes', seconds: 300 },
  { label: '15 Minutes', seconds: 900 },
  { label: '1 Hour', seconds: 3600 },
  { label: '24 Hours', seconds: 86400 },
];

const LOADING_SCREEN_PRESETS = [
  {
    name: 'Nether Portal Swirl',
    desc: 'Deep purple obsidian & nether flame',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'End Dimension Void',
    desc: 'Purple void sky with star clusters',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Lush Caves Cavern',
    desc: 'Subterranean moss, crystals & glow',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cherry Blossom Forest',
    desc: 'Serene sakura pink & lush green',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Bedrock Mountain Peaks',
    desc: 'Towering stone heights above clouds',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
];

export const DeveloperSettingsModal: React.FC<DeveloperSettingsModalProps> = ({
  isOpen,
  onClose,
  appStatus,
  onUpdateAppStatus,
  addons,
  onImportAddons,
  onClearAllAddons,
  onLoadSampleData,
  onPreviewLoadingScreen,
  saveAchievementEnabled,
  onToggleSaveAchievement,
  saveIntervalSeconds,
  onUpdateSaveInterval,
  loadingScreenEnabled,
  onToggleLoadingScreen,
  isVisitorPreviewMode,
  onToggleVisitorPreviewMode,
}) => {
  const [activeTab, setActiveTab] = useState<'app_state' | 'icon' | 'loading_screen' | 'visitors' | 'rules' | 'reports' | 'data'>('app_state');
  const [visitors, setVisitors] = useState<VisitorPresence[]>([]);
  const [customIconInput, setCustomIconInput] = useState(appStatus.customIconUrl || '');
  const [closedMessageInput, setClosedMessageInput] = useState(appStatus.closedMessage);
  const [versionInput, setVersionInput] = useState(appStatus.appVersion || '1.0.0');
  const [versionMessageInput, setVersionMessageInput] = useState(appStatus.versionMessage || 'Welcome to the latest version!');
  const [loadingPhotoInput, setLoadingPhotoInput] = useState(appStatus.loadingScreenImageUrl || '');
  const [loadingTitleInput, setLoadingTitleInput] = useState(appStatus.loadingScreenTitle || 'PrismMods Bedrock Hub');
  const [loadingSubtitleInput, setLoadingSubtitleInput] = useState(appStatus.loadingScreenSubtitle || 'Loading resources, behavior packs & terrain...');
  const [isTestingLoadingScreen, setIsTestingLoadingScreen] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Rules state
  const [rules, setRules] = useState<CommunityRule[]>([]);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');

  // Social media links state
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(appStatus.socialLinks || []);
  const [newSocialPlatform, setNewSocialPlatform] = useState<'whatsapp' | 'telegram' | 'other'>('whatsapp');
  const [newSocialTitle, setNewSocialTitle] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Reports state
  const [reports, setReports] = useState<InappropriateReport[]>([]);

  // Kick Timeout Modal state
  const [kickTarget, setKickTarget] = useState<VisitorPresence | null>(null);
  const [kickDuration, setKickDuration] = useState<number>(300); // 5 mins default
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [kickCustomWarning, setKickCustomWarning] = useState<string>('Please refrain from inappropriate behavior or spam.');

  // Ban Confirmation Modal state
  const [banTarget, setBanTarget] = useState<VisitorPresence | null>(null);

  // Load and poll data while modal is open
  useEffect(() => {
    if (isOpen) {
      setVisitors(getVisitorsList());
      setRules(getCommunityRules());
      setReports(getInappropriateReports());
      setLoadingPhotoInput(appStatus.loadingScreenImageUrl || '');
      setLoadingTitleInput(appStatus.loadingScreenTitle || 'PrismMods Bedrock Hub');
      setLoadingSubtitleInput(appStatus.loadingScreenSubtitle || 'Loading resources, behavior packs & terrain...');
      setVersionInput(appStatus.appVersion || '1.0.0');
      setVersionMessageInput(appStatus.versionMessage || 'Welcome to the latest version!');

      const interval = setInterval(() => {
        setVisitors(getVisitorsList());
        setReports(getInappropriateReports());
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, appStatus]);

  if (!isOpen) return null;

  const totalDownloads = addons.reduce((sum, a) => sum + (a.downloadCount || 0), 0);
  const unresolvedReportsCount = reports.filter((r) => !r.resolved).length;

  const handleToggleCloseApp = () => {
    const nextClosed = !appStatus.isClosed;
    const updates: Partial<AppStatusConfig> = {
      isClosed: nextClosed,
      closedMessage: closedMessageInput.trim() || 'Sorry, because our app is having problems and it is closing',
    };
    if (!nextClosed) {
      // Re-opening app: set lastOpenedAt and trigger notification
      updates.lastOpenedAt = Date.now();
      updates.hasNotifiedOpen = false;
      broadcastAppEvent('APP_REOPENED');
    }
    onUpdateAppStatus(updates);
    setMsg({
      text: nextClosed ? 'App is now CLOSED for visitors.' : 'App is now OPEN! Visitors can explore.',
      type: 'success',
    });
  };

  const handleSelectIconPreset = (type: AppStatusConfig['appIconType']) => {
    onUpdateAppStatus({ appIconType: type, customIconUrl: undefined });
    setMsg({ text: `App icon updated to ${type}!`, type: 'success' });
  };

  const handleCustomIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
      const url = await processImageFile(file, 256, 256, 0.9);
      onUpdateAppStatus({ appIconType: 'custom', customIconUrl: url });
      setCustomIconInput(url);
      setMsg({ 
        text: isGif 
          ? 'Custom Animated GIF app icon uploaded and active!' 
          : 'Custom app icon uploaded and applied!', 
        type: 'success' 
      });
    } catch {
      setMsg({ text: 'Error uploading custom icon', type: 'error' });
    }
  };

  const handleSaveCustomIconUrl = () => {
    if (customIconInput.trim()) {
      const isGif = customIconInput.toLowerCase().includes('.gif') || customIconInput.includes('image/gif');
      onUpdateAppStatus({ appIconType: 'custom', customIconUrl: customIconInput.trim() });
      setMsg({ 
        text: isGif ? 'Animated GIF icon URL applied!' : 'Custom icon URL applied!', 
        type: 'success' 
      });
    }
  };

  const handleRemoveCustomIcon = () => {
    onUpdateAppStatus({ appIconType: 'prism', customIconUrl: undefined });
    setCustomIconInput('');
    setMsg({ text: 'Reset app icon to default Prism icon', type: 'success' });
  };

  // Loading Screen Handlers (Developer sets photo -> affects ALL visitors, visitors cannot change)
  const handleLoadingPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1200, 720, 0.85);
      setLoadingPhotoInput(dataUrl);
      onUpdateAppStatus({
        loadingScreenImageUrl: dataUrl,
        loadingScreenTitle: loadingTitleInput.trim() || 'PrismMods Bedrock Hub',
        loadingScreenSubtitle: loadingSubtitleInput.trim() || 'Loading resources, behavior packs & terrain...',
      });
      setMsg({
        text: 'Custom loading screen photo uploaded & applied to ALL visitors!',
        type: 'success',
      });
    } catch {
      setMsg({ text: 'Error uploading loading screen image', type: 'error' });
    }
  };

  const handleSelectLoadingPreset = (url: string, name: string) => {
    setLoadingPhotoInput(url);
    onUpdateAppStatus({
      loadingScreenImageUrl: url,
      loadingScreenTitle: loadingTitleInput.trim() || 'PrismMods Bedrock Hub',
      loadingScreenSubtitle: loadingSubtitleInput.trim() || 'Loading resources, behavior packs & terrain...',
    });
    setMsg({
      text: `Loading screen preset "${name}" applied to all visitors!`,
      type: 'success',
    });
  };

  const handleSaveLoadingScreenSettings = () => {
    onUpdateAppStatus({
      loadingScreenImageUrl: loadingPhotoInput.trim(),
      loadingScreenTitle: loadingTitleInput.trim() || 'PrismMods Bedrock Hub',
      loadingScreenSubtitle: loadingSubtitleInput.trim() || 'Loading resources, behavior packs & terrain...',
    });
    setMsg({
      text: 'Loading screen settings updated! All visitors will see this photo on opening the app.',
      type: 'success',
    });
  };

  const handleClearLoadingPhoto = () => {
    setLoadingPhotoInput('');
    onUpdateAppStatus({
      loadingScreenImageUrl: '',
      loadingScreenTitle: loadingTitleInput.trim() || 'PrismMods Bedrock Hub',
      loadingScreenSubtitle: loadingSubtitleInput.trim() || 'Loading resources, behavior packs & terrain...',
    });
    setMsg({
      text: 'Reset to default Minecraft Bedrock loading screen for all visitors.',
      type: 'success',
    });
  };

  // Open Kick Dialog with Timeout and Custom Warning
  const handleOpenKickDialog = (visitor: VisitorPresence) => {
    setKickTarget(visitor);
    setKickDuration(300); // 5 mins
    setCustomMinutes('');
    setKickCustomWarning('You were kicked for violating community standards. Please review our rules.');
  };

  const handleConfirmKick = () => {
    if (!kickTarget) return;

    let finalSeconds = kickDuration;
    if (customMinutes && parseInt(customMinutes, 10) > 0) {
      finalSeconds = parseInt(customMinutes, 10) * 60;
    }

    kickVisitorWithTimeout(
      kickTarget.id,
      finalSeconds,
      kickCustomWarning.trim(),
      kickTarget.username
    );

    setVisitors(getVisitorsList());
    setMsg({
      text: `Kicked ${kickTarget.username} with a ${Math.ceil(finalSeconds / 60)} minute timeout.`,
      type: 'success',
    });
    setKickTarget(null);
  };

  // Open Ban Confirmation Dialog
  const handleOpenBanDialog = (visitor: VisitorPresence) => {
    setBanTarget(visitor);
  };

  const handleConfirmBan = () => {
    if (!banTarget) return;
    banVisitor(banTarget.id, true);
    setVisitors(getVisitorsList());
    setMsg({
      text: `Banned ${banTarget.username} from accessing the app.`,
      type: 'success',
    });
    setBanTarget(null);
  };

  const handleUnbanVisitor = (visitorId: string, name: string) => {
    banVisitor(visitorId, false);
    setVisitors(getVisitorsList());
    setMsg({
      text: `Unbanned / unblocked ${name}.`,
      type: 'success',
    });
  };

  const handleAdminToggle = (vId: string, isCurrentlyAdmin: boolean, name: string) => {
    setVisitorAdminRole(vId, !isCurrentlyAdmin);
    setVisitors(getVisitorsList());
    setMsg({
      text: !isCurrentlyAdmin 
        ? `${name} has been promoted to Admin! They can now add add-ons and customize their tag color.`
        : `${name} has been demoted back to Visitor.`,
      type: 'success',
    });
  };

  // Rules Handlers
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleDesc.trim()) return;

    addCommunityRule(newRuleTitle.trim(), newRuleDesc.trim());
    setRules(getCommunityRules());
    setNewRuleTitle('');
    setNewRuleDesc('');
    setMsg({ text: 'New custom rule added!', type: 'success' });
  };

  const handleDeleteRule = (ruleId: string) => {
    deleteCommunityRule(ruleId);
    setRules(getCommunityRules());
    setMsg({ text: 'Rule deleted.', type: 'success' });
  };

  // Reports Handlers
  const handleResolveReport = (id: string) => {
    resolveInappropriateReport(id);
    setReports(getInappropriateReports());
    setMsg({ text: 'Report marked as resolved.', type: 'success' });
  };

  const handleDeleteReport = (id: string) => {
    deleteInappropriateReport(id);
    setReports(getInappropriateReports());
    setMsg({ text: 'Report deleted.', type: 'success' });
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(addons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `prismmods-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setMsg({ text: 'Backup JSON downloaded successfully!', type: 'success' });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportAddons(parsed);
          setMsg({ text: `Imported ${parsed.length} addons!`, type: 'success' });
        }
      } catch {
        setMsg({ text: 'Invalid JSON file.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-950/40 max-h-[92vh] flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Developer & Owner Control Room
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Owner Exclusive
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage app availability, custom icons, visitor kick/ban timeouts, custom rules, and reported content
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-slate-800 bg-slate-950/60 overflow-x-auto text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('app_state')}
            className={`px-3.5 py-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'app_state'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>Open/Close App {appStatus.isClosed ? '(CLOSED)' : '(OPEN)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('icon')}
            className={`px-3.5 py-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'icon'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Change App Icon</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loading_screen')}
            className={`px-3.5 py-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'loading_screen'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Loading Screen (Custom Photo)</span>
            {appStatus.loadingScreenImageUrl && (
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visitors')}
            className={`px-3.5 py-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'visitors'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Live Visitors & Moderation ({visitors.filter((v) => v.isOnline).length} Online)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>Community Rules ({rules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'reports'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Reported Content</span>
            {unresolvedReportsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {unresolvedReportsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`px-3.5 py-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Downloads & Backup</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {msg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              }`}
            >
              {msg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{msg.text}</span>
            </div>
          )}

          {/* TAB 1: CLOSE / OPEN APP */}
          {activeTab === 'app_state' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">App Availability Switch</h3>
                    <p className="text-xs text-slate-400">
                      When closed, visitors are prevented from using the app and receive your problem notice.
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      appStatus.isClosed
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {appStatus.isClosed ? '🔴 APP CLOSED' : '🟢 APP OPEN'}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleToggleCloseApp}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                      appStatus.isClosed
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>
                      {appStatus.isClosed ? 'Click to REOPEN App for Visitors' : 'Click to CLOSE App (Technical Problems)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Closed Message Customizer */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Visitor Problem Notification Message
                </label>
                <textarea
                  rows={2}
                  value={closedMessageInput}
                  onChange={(e) => setClosedMessageInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  placeholder="Sorry, because our app is having problems and it is closing"
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateAppStatus({ closedMessage: closedMessageInput.trim() });
                    setMsg({ text: 'Closed message saved!', type: 'success' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
                >
                  Save Message
                </button>
              </div>

              {/* Version & Version Message Customizer */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      App Version
                    </label>
                    <input
                      type="text"
                      value={versionInput}
                      onChange={(e) => setVersionInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                      placeholder="1.0.0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Version Popup Message
                  </label>
                  <textarea
                    rows={2}
                    value={versionMessageInput}
                    onChange={(e) => setVersionMessageInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400"
                    placeholder="Welcome to the latest version!"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateAppStatus({ appVersion: versionInput.trim(), versionMessage: versionMessageInput.trim() });
                    setMsg({ text: 'Version settings saved!', type: 'success' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition"
                >
                  Save Version Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CHANGE APP ICON */}
          {activeTab === 'icon' && (
            <div className="space-y-5 animate-fade-in">
              {/* Current Active Icon & Multi-size Previews */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <AppLogo config={appStatus} size="lg" />
                    <AppLogo config={appStatus} size="md" />
                    <AppLogo config={appStatus} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">Current Active Icon</h3>
                      {appStatus.appIconType === 'custom' && appStatus.customIconUrl ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase flex items-center gap-1.5 shadow-sm">
                          {appStatus.customIconUrl.includes('.gif') || appStatus.customIconUrl.includes('image/gif') || appStatus.customIconUrl.includes('svg') ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                              <span>🎞️ Animated GIF Active</span>
                            </>
                          ) : (
                            <span>🖼️ Custom Image Active</span>
                          )}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                          Preset Theme
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 capitalize mt-0.5">
                      Theme: {appStatus.appIconType} {appStatus.customIconUrl ? '• Custom Uploaded / GIF' : '• Built-in Preset'}
                    </p>
                  </div>
                </div>

                {(appStatus.appIconType === 'custom' || appStatus.customIconUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveCustomIcon}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>

              {/* Upload Custom Image or Animated GIF */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 border-2 border-cyan-500/40 space-y-3.5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                        <span>Add Custom Image or Animated GIF</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black animate-pulse">
                        GIF Supported ✨
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Upload any animated GIF, PNG, JPG, or WebP. Animation frames and looping are 100% preserved.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 py-3 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload GIF or Image File</span>
                    <input
                      type="file"
                      accept="image/gif,image/png,image/jpeg,image/webp,image/svg+xml,image/*"
                      onChange={handleCustomIconUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste direct Image or GIF URL (.gif, .png...)"
                      value={customIconInput}
                      onChange={(e) => setCustomIconInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCustomIconUrl}
                      disabled={!customIconInput.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold transition active:scale-95 shadow-md"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Animated GIF Presets (1-Click Test for Developers) */}
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <span>🎞️ Test Animated GIF Presets (1-Click Apply):</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {ANIMATED_GIF_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          onUpdateAppStatus({ appIconType: 'custom', customIconUrl: preset.url });
                          setCustomIconInput(preset.url);
                          setMsg({ text: `Applied ${preset.name} Animated Icon!`, type: 'success' });
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 active:scale-95 ${
                          appStatus.customIconUrl === preset.url
                            ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-950 shrink-0 flex items-center justify-center">
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-[11px] text-white truncate">{preset.name}</div>
                          <div className="text-[9px] text-cyan-400 font-mono">Animated GIF</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Built-in Bedrock Preset Themes */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Built-in Bedrock Preset Themes:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ICON_PRESETS.map((preset) => (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => handleSelectIconPreset(preset.type)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                        appStatus.appIconType === preset.type && !appStatus.customIconUrl
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <AppLogo config={{ ...appStatus, appIconType: preset.type, customIconUrl: undefined }} size="sm" />
                      <div>
                        <div className="font-bold text-xs text-white">{preset.label}</div>
                        <div className="text-[10px] text-slate-400">{preset.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOADING SCREEN (DEVELOPER CUSTOM PHOTO - AFFECTS ALL VISITORS) */}
          {activeTab === 'loading_screen' && (
            <div className="space-y-4 animate-fade-in">
              {/* Developer Exclusivity Notice */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-sm">
                      Global Loading Screen Manager
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      Developer Exclusive
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Any image you set here will be <strong>automatically displayed to every visitor</strong> when they launch or reload PrismMods. Visitors do <strong>not</strong> have permission to modify this screen.
                  </p>
                </div>
              </div>

              {/* Live Miniature Preview of Loading Screen */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>Live Loading Screen Preview</span>
                  </label>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    loadingPhotoInput
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {loadingPhotoInput ? 'Custom Photo Active' : 'Default Minecraft Dirt/Stone Active'}
                  </span>
                </div>

                <div className="relative w-full aspect-[16/9] max-h-56 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl flex flex-col items-center justify-between p-4 bg-slate-950">
                  {/* Background */}
                  {loadingPhotoInput ? (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={loadingPhotoInput}
                        alt="Loading Screen Preview"
                        className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
                    </div>
                  )}

                  {/* Top Preview Badge */}
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-slate-300 text-[10px] font-mono backdrop-blur-sm border border-slate-800">
                      Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onPreviewLoadingScreen) {
                          onPreviewLoadingScreen();
                        } else {
                          setIsTestingLoadingScreen(true);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] transition flex items-center gap-1 shadow"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Test Full Screen</span>
                    </button>
                  </div>

                  {/* Center Content */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-1 my-auto">
                    <AppLogo config={appStatus} size="sm" />
                    <h4 className="text-sm font-black text-white font-minecraft drop-shadow">
                      {loadingTitleInput || 'PrismMods Bedrock Hub'}
                    </h4>
                    <p className="text-[10px] text-cyan-200/90 font-medium">
                      {loadingSubtitleInput || 'Loading resources, behavior packs & terrain...'}
                    </p>
                  </div>

                  {/* Bottom Progress Bar Preview */}
                  <div className="relative z-10 w-full max-w-xs space-y-1">
                    <div className="text-center text-[10px] text-slate-300 font-medium truncate">
                      Tip: Netherite gear does not burn in lava.
                    </div>
                    <div className="h-2.5 w-full bg-slate-950/90 rounded border border-slate-700 overflow-hidden p-0.5">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-sm w-3/4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Custom Photo Option */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Upload Custom Photo for Loading Screen</span>
                  </h4>
                  <span className="text-[10px] text-cyan-400">JPG, PNG, WEBP, SVG</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 py-3 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Upload Image From Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLoadingPhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste direct image URL"
                      value={loadingPhotoInput}
                      onChange={(e) => setLoadingPhotoInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveLoadingScreenSettings}
                      disabled={!loadingPhotoInput.trim()}
                      className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold transition shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {loadingPhotoInput && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 truncate max-w-[280px]">
                      Photo URL: {loadingPhotoInput.slice(0, 45)}...
                    </span>
                    <button
                      type="button"
                      onClick={handleClearLoadingPhoto}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline transition"
                    >
                      Clear & Use Default Bedrock Background
                    </button>
                  </div>
                )}
              </div>

              {/* Minecraft Atmosphere Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Or Select an Official Minecraft Atmosphere Preset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {LOADING_SCREEN_PRESETS.map((preset) => {
                    const isSelected = loadingPhotoInput === preset.url;
                    return (
                      <div
                        key={preset.name}
                        onClick={() => handleSelectLoadingPreset(preset.url, preset.name)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-2.5 bg-slate-950 ${
                          isSelected
                            ? 'border-purple-400 ring-2 ring-purple-400/30 bg-purple-950/20'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-white truncate">{preset.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{preset.desc}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Loading Screen Text Options */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Customize Loading Screen Texts
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Loading Title</label>
                    <input
                      type="text"
                      value={loadingTitleInput}
                      onChange={(e) => setLoadingTitleInput(e.target.value)}
                      placeholder="PrismMods Bedrock Hub"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400 font-minecraft"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Loading Subtitle</label>
                    <input
                      type="text"
                      value={loadingSubtitleInput}
                      onChange={(e) => setLoadingSubtitleInput(e.target.value)}
                      placeholder="Loading resources, behavior packs & terrain..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Loading Duration (seconds)</label>
                    <input
                      type="number"
                      min="1"
                      value={typeof appStatus.loadingScreenDuration === 'number' && !isNaN(appStatus.loadingScreenDuration) ? appStatus.loadingScreenDuration : 7}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onUpdateAppStatus({ loadingScreenDuration: isNaN(val) ? 7 : Math.max(1, val) });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Download Delay (seconds)</label>
                    <input
                      type="number"
                      min="0"
                      value={typeof appStatus.downloadDelay === 'number' && !isNaN(appStatus.downloadDelay) ? appStatus.downloadDelay : 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onUpdateAppStatus({ downloadDelay: isNaN(val) ? 0 : Math.max(0, val) });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onPreviewLoadingScreen) {
                        onPreviewLoadingScreen();
                      } else {
                        setIsTestingLoadingScreen(true);
                      }
                    }}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Preview Full Loading Screen</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveLoadingScreenSettings}
                    className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Broadcast to All Visitors</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE VISITORS & KICK / BAN MODERATION */}
          {activeTab === 'visitors' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-slate-200">
                    {visitors.filter((v) => v.isOnline).length} Visitors Currently Online
                  </span>
                </div>
                <span>Auto-refreshes every 3 seconds</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {visitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={visitor.avatar}
                          alt={visitor.username}
                          className="w-9 h-9 rounded-xl object-cover bg-slate-900 border border-slate-700"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                            visitor.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                          title={visitor.isOnline ? 'Online' : 'Offline'}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white">{visitor.username}</span>
                          <UserRoleBadge
                            role={visitor.role}
                            tagText={visitor.tagText}
                            tagColor={visitor.tagColor}
                            customLogoUrl={visitor.customLogoUrl}
                            size="sm"
                          />
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              visitor.isOnline
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {visitor.isOnline ? 'Online 🟢' : 'Offline ⚪'}
                          </span>
                          {visitor.isBanned && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                              Banned 🚫
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{visitor.device}</span>
                          <span>•</span>
                          <span>ID: {visitor.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Admin promotion, Kick (Timeout dialog), Ban (Confirmation modal), Unban */}
                    <div className="flex items-center gap-1.5">
                      {visitor.role !== 'owner' && (
                        <button
                          type="button"
                          onClick={() => handleAdminToggle(visitor.id, visitor.role === 'admin', visitor.username)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition flex items-center gap-1 ${
                            visitor.role === 'admin'
                              ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-800 hover:bg-cyan-950/50 text-slate-300 hover:text-cyan-300 border-slate-700'
                          }`}
                          title={visitor.role === 'admin' ? 'Remove admin status' : 'Promote visitor to Admin'}
                        >
                          <Wrench className="w-3 h-3" />
                          <span>{visitor.role === 'admin' ? 'Admin 🔧' : 'Become Admin'}</span>
                        </button>
                      )}

                      {/* Kick with Timeout Duration & Custom Warning */}
                      <button
                        type="button"
                        onClick={() => handleOpenKickDialog(visitor)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition flex items-center gap-1"
                        title="Kick visitor with timeout duration and custom warning message"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Kick (Timeout)</span>
                      </button>

                      {/* Ban / Unblock */}
                      {visitor.isBanned ? (
                        <button
                          type="button"
                          onClick={() => handleUnbanVisitor(visitor.id, visitor.username)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/50 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Unblock / Unban</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenBanDialog(visitor)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Ban</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMMUNITY RULES MANAGER */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <span className="font-bold">Community Rules Integration:</span> Rules added here will be immediately visible to visitors when they click the <strong>"Rules"</strong> button on top near the status button!
              </div>

              {/* Add New Custom Rule Form */}
              <form onSubmit={handleAddRule} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Developer Custom Rule</span>
                </h4>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Rule Title (e.g. No Inappropriate Language)"
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Custom Rule Explanation / Warning (e.g. Any offensive comments or harassment will result in a kick or permanent ban)"
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Custom Rule for Visitors</span>
                </button>
              </form>

              {/* Existing Rules List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-white text-xs">{rule.title}</h4>
                      </div>
                      <p className="text-slate-300 pl-7 text-[11px] leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition shrink-0"
                      title="Delete this rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INAPPROPRIATE REPORTS INBOX */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold">Inappropriate Content Feed:</span> Anything flagged by visitors or members arrives here for your direct review.
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  {reports.length} Total Reports
                </span>
              </div>

              {reports.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-2 text-xs text-slate-500">
                  <ShieldCheck className="w-8 h-8 mx-auto text-emerald-400" />
                  <p>All clean! No inappropriate items reported right now.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 rounded-2xl border transition space-y-2 text-xs ${
                        report.resolved
                          ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                          : 'bg-slate-950 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase text-[10px]">
                            {report.targetType} Flagged
                          </span>
                          <span className="font-bold text-white">
                            User: {report.reportedUsername}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                        <span className="text-rose-400 font-bold">Reason: </span>
                        {report.reason}
                        {report.targetTitleOrSnippet && (
                          <div className="mt-1 text-slate-400 italic">
                            "{report.targetTitleOrSnippet}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[10px] text-slate-500">
                          Reported by: {report.reporterUsername || 'Anonymous Visitor'}
                        </div>

                        {/* Direct moderation actions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleOpenKickDialog({
                                id: report.reportedUserId,
                                username: report.reportedUsername,
                                avatar: getMinecraftCharacterAvatar(report.reportedUsername || report.reportedUserId),
                                isOnline: true,
                                lastSeen: Date.now(),
                                isBanned: false,
                                device: 'Reported Device',
                                joinedAt: Date.now(),
                                role: 'visitor',
                                tagText: 'Visitor',
                                tagColor: '#64748b',
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Kick Offender</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleOpenBanDialog({
                                id: report.reportedUserId,
                                username: report.reportedUsername,
                                avatar: getMinecraftCharacterAvatar(report.reportedUsername || report.reportedUserId),
                                isOnline: true,
                                lastSeen: Date.now(),
                                isBanned: false,
                                device: 'Reported Device',
                                joinedAt: Date.now(),
                                role: 'visitor',
                                tagText: 'Visitor',
                                tagColor: '#64748b',
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Ban Offender</span>
                          </button>

                          {!report.resolved ? (
                            <button
                              type="button"
                              onClick={() => handleResolveReport(report.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
                            >
                              Resolve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: DOWNLOADS & BACKUP */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Total Downloads</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">{totalDownloads}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Across all Bedrock items</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Live Add-ons</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{addons.length}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Active catalog items</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <span>💬 Social Media Links (WhatsApp & Telegram)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Appears at the very bottom</span>
                </div>

                {/* Add Social Link Form */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="whatsapp">💚 WhatsApp</option>
                      <option value="telegram">💙 Telegram</option>
                      <option value="other">🌐 Other Link</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Title (e.g. Official WhatsApp Group)"
                      value={newSocialTitle}
                      onChange={(e) => setNewSocialTitle(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />

                    <input
                      type="url"
                      placeholder="URL (https://wa.me/... or t.me/...)"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newSocialTitle.trim() || !newSocialUrl.trim()) return;
                      const newItem: SocialMediaLink = {
                        id: 'social-' + Date.now(),
                        platform: newSocialPlatform,
                        title: newSocialTitle.trim(),
                        url: newSocialUrl.trim(),
                      };
                      const updated = [...socialLinks, newItem];
                      setSocialLinks(updated);
                      setNewSocialTitle('');
                      setNewSocialUrl('');
                      onUpdateAppStatus({ socialLinks: updated });
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Social Media Link</span>
                  </button>
                </div>

                {/* Existing Social Links List */}
                {socialLinks.length > 0 && (
                  <div className="space-y-2">
                    {socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            link.platform === 'whatsapp'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : link.platform === 'telegram'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {link.platform}
                          </span>
                          <div className="truncate">
                            <div className="font-bold text-white">{link.title}</div>
                            <div className="text-[11px] text-slate-400 truncate">{link.url}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = socialLinks.filter((s) => s.id !== link.id);
                            setSocialLinks(updated);
                            onUpdateAppStatus({ socialLinks: updated });
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition shrink-0"
                          title="Remove social link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Progress Achievement Popup Toggle */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                saveAchievementEnabled
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-1 pr-3">
                  <div className="text-xs font-black flex items-center gap-1.5 text-slate-100">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Minecraft Save Achievement Progress Popup (10s tick)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    If ON, a Minecraft achievement toast pops up every {saveIntervalSeconds}s when save progress runs. If OFF, saves silently in background without disturbing you.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={saveAchievementEnabled}
                  onChange={(e) => onToggleSaveAchievement(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-100">Initial Loading Screen</div>
                  <div className="text-[11px] text-slate-400">Enable or disable the loading screen on app launch.</div>
                </div>
                <input
                  type="checkbox"
                  checked={loadingScreenEnabled}
                  onChange={(e) => onToggleLoadingScreen(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
                />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-100">Visitor Preview Mode</div>
                  <div className="text-[11px] text-slate-400">View the app as a visitor would see it.</div>
                </div>
                <input
                  type="checkbox"
                  checked={isVisitorPreviewMode}
                  onChange={(e) => onToggleVisitorPreviewMode(e.target.checked)}
                  className="w-5 h-5 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
                />
              </div>

              {/* Auto-save interval configuration */}

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Auto-save Duration
                </h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={isNaN(saveIntervalSeconds) ? 10 : saveIntervalSeconds}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) onUpdateSaveInterval(val);
                    }}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                  />
                  <span className="text-sm font-bold text-slate-400">seconds per auto-save tick</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Configure how often the app automatically saves your progress (default 10s).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>PrismMods Bedrock Dev Tools • Client Moderation active</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Cancel / Go Back
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SUB-MODAL 1: KICK WITH TIMEOUT DURATION & WARNING    */}
        {/* ---------------------------------------------------- */}
        {kickTarget && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-slate-100">
            <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Kick Visitor & Set Timeout</h3>
                    <p className="text-xs text-slate-400">Target: {kickTarget.username}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setKickTarget(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Timeout Duration Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Timeout Duration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIMEOUT_PRESETS.map((preset) => (
                    <button
                      key={preset.seconds}
                      type="button"
                      onClick={() => {
                        setKickDuration(preset.seconds);
                        setCustomMinutes('');
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        kickDuration === preset.seconds && !customMinutes
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom Minutes Input */}
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Or custom minutes:</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 10"
                    value={customMinutes}
                    onChange={(e) => {
                      setCustomMinutes(e.target.value);
                      if (e.target.value) {
                        setKickDuration(parseInt(e.target.value, 10) * 60);
                      }
                    }}
                    className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white outline-none focus:border-amber-400"
                  />
                  <span className="text-xs text-slate-400">min</span>
                </div>
              </div>

              {/* Custom Warning Message Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Custom Warning Message to Show Them:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter warning for what they did wrong..."
                  value={kickCustomWarning}
                  onChange={(e) => setKickCustomWarning(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Confirm / Cancel Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setKickTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Cancel / Go Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmKick}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>Execute Kick & Timeout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUB-MODAL 2: BAN CONFIRMATION MODAL ("NO" vs "YES") */}
        {/* ---------------------------------------------------- */}
        {banTarget && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-slate-100">
            <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-2xl shadow-rose-950/60">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                <Ban className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-white">Confirm Ban</h3>
                <p className="text-sm font-bold text-rose-300">
                  Are you sure you want to ban this person?
                </p>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-2 mt-2">
                  <img
                    src={banTarget.avatar}
                    alt={banTarget.username}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="font-bold text-white text-xs">{banTarget.username}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({banTarget.id.slice(0, 8)})</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                When banned, they will receive the notice to contact <strong className="text-slate-200">prismstudioworks@gmail.com</strong>. You can unblock them at any time.
              </p>

              {/* Exact NO and YES buttons as requested */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBanTarget(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs border border-slate-700 transition"
                >
                  NO
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBan}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Loading Screen Tester inside Developer Modal */}
      {isTestingLoadingScreen && (
        <BedrockLoadingScreen
          config={{
            ...appStatus,
            loadingScreenImageUrl: loadingPhotoInput,
            loadingScreenTitle: loadingTitleInput,
            loadingScreenSubtitle: loadingSubtitleInput,
          }}
          isLoading={true}
          isPreview={true}
          onClosePreview={() => setIsTestingLoadingScreen(false)}
          onFinishLoading={() => setIsTestingLoadingScreen(false)}
        />
      )}
    </div>
  );
};
