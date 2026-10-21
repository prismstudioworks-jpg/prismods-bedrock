import React, { useState, useEffect, useMemo } from 'react';
import { 
  BedrockAddon, AddonCategory, CATEGORY_LABELS, 
  MemberUser, AddonComment, AppStatusConfig, OwnerLiveConfig,
  ThemeMode, KickRecord, CommunityRule, DownloadHistoryItem,
  TextFontPreference, ExternalLink 
} from './types/addon';
import { 
  getStoredAddons, saveStoredAddons, 
  isDeveloperEnvironment, setDeveloperSession,
  getBrandTitle, setBrandTitle, 
  getStoredBookmarks, toggleStoredBookmark, SAMPLE_STARTER_ADDONS,
  getAppStatus, setAppStatus, subscribeToLiveEvents,
  getCurrentMember, setCurrentMember, getStoredComments, 
  addStoredComment, deleteStoredComment, incrementAddonDownloads,
  heartbeatVisitor, isCurrentVisitorBanned, checkIsKicked, DEFAULT_APP_STATUS,
  isCurrentVisitorAdmin, getOwnerLiveConfig, getVisitorsList,
  getThemeMode, setThemeMode, getCommunityRules, getDownloadHistory,
  clearDownloadHistory, clearKickRecord, getAdminTagColor, getDeviceId,
  getFontPreference, setFontPreference, deleteStoredAddon, triggerAddonFileDownload,
  addCommunityRule, deleteCommunityRule
} from './utils/storage';
import { getStoredLanguage, setStoredLanguage, getTranslation } from './utils/i18n';
import { Header } from './components/Header';
import { AddonCard } from './components/AddonCard';
import { CategorySliderSection } from './components/CategorySliderSection';
import { AddonDetailModal } from './components/AddonDetailModal';
import { AddonFormModal } from './components/AddonFormModal';
import { CategoryPickerModal } from './components/CategoryPickerModal';
import { NameSuggestionsModal } from './components/NameSuggestionsModal';
import { DeveloperSettingsModal } from './components/DeveloperSettingsModal';
import { AuthModal } from './components/AuthModal';
import { BedrockLoadingScreen } from './components/BedrockLoadingScreen';
import { MaintenanceOverlay } from './components/MaintenanceOverlay';
import { KickedOrBannedOverlay } from './components/KickedOrBannedOverlay';
import { LiveStatusModal } from './components/LiveStatusModal';
import { RulesModal } from './components/RulesModal';
import { VisitorSettingsModal } from './components/VisitorSettingsModal';
import { MinecraftAchievementToast } from './components/MinecraftAchievementToast';
import { VersionPopup } from './components/VersionPopup';
import { BottomNavBar, NavTabId } from './components/BottomNavBar';
import { NewsView } from './components/NewsView';
import { RulesView } from './components/RulesView';
import { SettingsView } from './components/SettingsView';
import { 
  Search, Filter, Plus, Sparkles, Package, 
  Palette, Map as MapIcon, Cpu, Bookmark, 
  Layers, HardDrive, Shield, Check, Info, ArrowUpDown, RefreshCw, Download,
  SlidersHorizontal, LayoutGrid
} from 'lucide-react';

const SHOWCASE_CATEGORY_ORDER: { key: AddonCategory; title: string }[] = [
  { key: 'addon', title: 'ADD-ONS' },
  { key: 'map', title: 'WORLDS' },
  { key: 'skin_pack', title: 'SKIN PACKS' },
  { key: 'resource_pack', title: 'TEXTURE PACKS' },
  { key: 'shader', title: 'SHADERS' },
  { key: 'behavior_pack', title: 'BEHAVIOR PACKS' },
];

export default function App() {
  // Addons & Preferences
  const [addons, setAddons] = useState<BedrockAddon[]>([]);
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);
  const [brandTitle, setBrandTitleState] = useState<string>('PrismMods Bedrock');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Member Authentication
  const [currentMember, setCurrentMemberState] = useState<MemberUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loadingScreenPreview, setLoadingScreenPreview] = useState(false);

  // Theme & Language (Client-side per phone/device)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getThemeMode());
  const [currentLanguage, setCurrentLanguageState] = useState<string>(getStoredLanguage());
  const [fontPreference, setFontPreferenceState] = useState<TextFontPreference>(getFontPreference());

  // Rules & Download History
  const [rules, setRules] = useState<CommunityRule[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isVisitorSettingsOpen, setIsVisitorSettingsOpen] = useState(false);

  // Active Bottom Nav Bar Tab: 'home' | 'news' | 'rules' | 'settings'
  const [activeNavTab, setActiveNavTab] = useState<NavTabId>('home');

  const handleAddNewRule = (title: string, description: string) => {
    addCommunityRule(title, description);
    setRules(getCommunityRules());
  };

  const handleDeleteRule = (id: string) => {
    deleteCommunityRule(id);
    setRules(getCommunityRules());
  };

  // Deletion Modal & Download Success Toast states
  const [addonToDelete, setAddonToDelete] = useState<BedrockAddon | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Comments
  const [comments, setComments] = useState<AddonComment[]>([]);

  // App Status (Open / Close Maintenance & Custom App Icon)
  const [appStatus, setAppStatusState] = useState<AppStatusConfig>(DEFAULT_APP_STATUS);

  // 10-second tick save progress achievement toast state
  const [saveAchievementEnabled, setSaveAchievementEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('prismmods_save_achievement_toggle');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });
  const [saveIntervalSeconds, setSaveIntervalSeconds] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('prismmods_save_interval');
      const parsed = stored ? parseInt(stored, 10) : 10;
      return isNaN(parsed) || parsed <= 0 ? 10 : parsed;
    } catch {
      return 10;
    }
  });
  const [saveAchievementToast, setSaveAchievementToast] = useState<string | null>(null);

  // App Loading & Version Popup
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [loadingScreenEnabled, setLoadingScreenEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('prismmods_loading_screen_enabled');
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [isVersionPopupOpen, setIsVersionPopupOpen] = useState(false);

  const handleToggleSaveAchievement = (enabled: boolean) => {
    setSaveAchievementEnabled(enabled);
    try {
      localStorage.setItem('prismmods_save_achievement_toggle', JSON.stringify(enabled));
    } catch {}
  };

  const handleUpdateSaveInterval = (seconds: number) => {
    const valid = isNaN(seconds) || seconds <= 0 ? 10 : seconds;
    setSaveIntervalSeconds(valid);
    try {
      localStorage.setItem('prismmods_save_interval', valid.toString());
    } catch {}
  };

  // Customizable save progress interval
  useEffect(() => {
    // Initial loading timer (7s default)
    const duration = appStatus.loadingScreenDuration && !isNaN(appStatus.loadingScreenDuration)
      ? appStatus.loadingScreenDuration
      : 7;
    
    let loadingTimer: NodeJS.Timeout;
    if (loadingScreenEnabled) {
      setIsAppLoading(true);
      loadingTimer = setTimeout(() => {
        setIsAppLoading(false);
        setIsVersionPopupOpen(true);
      }, duration * 1000);
    } else {
      setIsAppLoading(false);
    }

    const intervalSec = saveIntervalSeconds && !isNaN(saveIntervalSeconds) && saveIntervalSeconds > 0
      ? saveIntervalSeconds
      : 10;

    const saveInterval = setInterval(() => {
      const currentAddons = getStoredAddons();
      saveStoredAddons(currentAddons);

      if (saveAchievementEnabled) {
        setSaveAchievementToast(`Game Saved: Progress Saved Successfully! (${intervalSec}s interval)`);
        setTimeout(() => {
          setSaveAchievementToast(null);
        }, 4000);
      }
    }, intervalSec * 1000);

    return () => {
      if (loadingTimer) clearTimeout(loadingTimer);
      clearInterval(saveInterval);
    };
  }, [saveAchievementEnabled, saveIntervalSeconds, appStatus.loadingScreenDuration, loadingScreenEnabled]);
  // Live Visitor Kick / Ban status
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [kickRecord, setKickRecord] = useState<KickRecord | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBedrockFilter, setSelectedBedrockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'links' | 'downloads'>('newest');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');

  // Visitor Preview Mode (ONLY Developer can toggle to see what visitors see)
  const [isVisitorPreviewMode, setIsVisitorPreviewMode] = useState<boolean>(false);

  // Live Community Status & Roles
  const [isLiveStatusModalOpen, setIsLiveStatusModalOpen] = useState<boolean>(false);
  const [ownerConfig, setOwnerConfig] = useState<OwnerLiveConfig>(getOwnerLiveConfig());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);

  // Modals
  const [isNameSuggestionsOpen, setIsNameSuggestionsOpen] = useState(false);
  const [isDeveloperToolsOpen, setIsDeveloperToolsOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [selectedCreationCategory, setSelectedCreationCategory] = useState<AddonCategory>('addon');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<BedrockAddon | null>(null);
  const [selectedAddonDetail, setSelectedAddonDetail] = useState<BedrockAddon | null>(null);

  // Initialize and apply theme & font
  useEffect(() => {
    const initialTheme = getThemeMode();
    setThemeModeState(initialTheme);
    if (typeof document !== 'undefined') {
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }

    const initialFont = getFontPreference();
    setFontPreferenceState(initialFont);
    if (typeof document !== 'undefined') {
      if (initialFont === 'minecraft') {
        document.body.classList.add('font-minecraft');
        document.body.classList.remove('font-basic');
      } else {
        document.body.classList.remove('font-minecraft');
        document.body.classList.add('font-basic');
      }
    }
  }, []);

  // Initialize and subscribe
  useEffect(() => {
    setAddons(getStoredAddons());
    const member = getCurrentMember();
    const isOwnerEmail = member?.email === 'altaxx39@gmail.com';
    const devEnv = isDeveloperEnvironment() || isOwnerEmail;
    if (isOwnerEmail) {
      setDeveloperSession(true);
    }
    setIsDeveloper(devEnv);
    setBrandTitleState(getBrandTitle());
    setBookmarks(getStoredBookmarks());
    setCurrentMemberState(member);
    setComments(getStoredComments());
    setIsAdmin(isCurrentVisitorAdmin());
    setOwnerConfig(getOwnerLiveConfig());
    setRules(getCommunityRules());
    setDownloadHistory(getDownloadHistory());

    const initialStatus = getAppStatus();
    setAppStatusState(initialStatus);

    // Initial visitor presence & status check
    heartbeatVisitor(getCurrentMember());
    setIsBanned(isCurrentVisitorBanned());
    setKickRecord(checkIsKicked());

    const initialVisitors = getVisitorsList();
    setOnlineCount(initialVisitors.filter((v) => v.isOnline).length);


    // Recurring heartbeat every 15s to maintain live online status
    const heartbeatInterval = setInterval(() => {
      heartbeatVisitor(getCurrentMember());
      setIsBanned(isCurrentVisitorBanned());
      const currentKick = checkIsKicked();
      setKickRecord(currentKick);
      setIsAdmin(isCurrentVisitorAdmin());
      const currentVisitors = getVisitorsList();
      setOnlineCount(currentVisitors.filter((v) => v.isOnline).length);
    }, 15000);

    // Secret developer shortcut: Ctrl+Shift+D or Cmd+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsDeveloper((prev) => {
          const next = !prev;
          setDeveloperSession(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Live multi-tab broadcast listener
    const unsubscribe = subscribeToLiveEvents((event) => {
      if (event.type === 'APP_STATUS_CHANGED') {
        const prevStatus = appStatus;
        const newStatus = event.payload as AppStatusConfig;
        setAppStatusState(newStatus);
        if (newStatus.isClosed) {
          localStorage.setItem('prismmods_saw_closed', 'true');
        }
      } else if (event.type === 'APP_REOPENED') {
        setAppStatusState((prev) => ({ ...prev, isClosed: false }));
      } else if (event.type === 'ADDONS_UPDATED') {
        setAddons(event.payload);
      } else if (event.type === 'COMMENT_ADDED' || event.type === 'COMMENT_DELETED') {
        setComments(getStoredComments());
      } else if (event.type === 'MEMBER_AUTH_CHANGE') {
        setCurrentMemberState(event.payload);
      } else if (event.type === 'VISITOR_KICKED') {
        const kickRec = checkIsKicked();
        if (kickRec) setKickRecord(kickRec);
      } else if (event.type === 'VISITOR_KICK_CLEARED') {
        setKickRecord(null);
      } else if (event.type === 'VISITOR_BANNED') {
        setIsBanned(isCurrentVisitorBanned());
      } else if (event.type === 'DOWNLOAD_INCREMENTED') {
        setAddons(getStoredAddons());
      } else if (event.type === 'DOWNLOAD_HISTORY_UPDATED') {
        setDownloadHistory(getDownloadHistory());
      } else if (event.type === 'RULES_UPDATED') {
        setRules(getCommunityRules());
      } else if (event.type === 'VISITOR_ADMIN_CHANGED') {
        setIsAdmin(isCurrentVisitorAdmin());
        const updatedVisitors = getVisitorsList();
        setOnlineCount(updatedVisitors.filter((v) => v.isOnline).length);
      } else if (event.type === 'OWNER_CONFIG_CHANGED') {
        setOwnerConfig(getOwnerLiveConfig());
      }
    });

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribe();
    };
  }, []);

  // Theme Toggle (only affects this device/phone)
  const handleToggleTheme = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setThemeMode(mode);
  };

  // Text Font Toggle (Basic style vs Minecraft style font for visitors, admins, and owner)
  const handleToggleFont = (newFont: TextFontPreference) => {
    setFontPreferenceState(newFont);
    setFontPreference(newFont);
  };

  // Language Selection
  const handleSelectLanguage = (code: string) => {
    setCurrentLanguageState(code);
    setStoredLanguage(code);
  };

  // Update App Status (Developer only)
  const handleUpdateAppStatus = (updates: Partial<AppStatusConfig>) => {
    const updated = setAppStatus(updates);
    setAppStatusState(updated);
  };

  // Toggle Visitor Preview Mode (ONLY Developer can see/toggle this!)
  const handleToggleVisitorPreview = () => {
    setIsVisitorPreviewMode((prev) => !prev);
  };

  // Secret Developer Trigger
  const handleToggleDeveloperSecret = () => {
    const next = !isDeveloper;
    setIsDeveloper(next);
    setDeveloperSession(next);
  };

  // Category Selection from Modal
  const handleSelectCreationType = (cat: AddonCategory) => {
    setSelectedCreationCategory(cat);
    setIsCategoryPickerOpen(false);
    setEditingAddon(null);
    setIsFormModalOpen(true);
  };

  // Add / Edit Addon Handlers
  const handleOpenCreateModal = () => {
    setIsCategoryPickerOpen(true);
  };

  const handleOpenEdit = (addon: BedrockAddon) => {
    setEditingAddon(addon);
    setSelectedCreationCategory(addon.category);
    setIsFormModalOpen(true);
  };

  const handleSaveAddon = (savedAddon: BedrockAddon) => {
    let updatedList: BedrockAddon[];
    if (editingAddon) {
      updatedList = addons.map((a) => (a.id === savedAddon.id ? savedAddon : a));
    } else {
      updatedList = [savedAddon, ...addons];
    }
    setAddons(updatedList);
    saveStoredAddons(updatedList);
    setIsFormModalOpen(false);
    setEditingAddon(null);
    if (selectedAddonDetail?.id === savedAddon.id) {
      setSelectedAddonDetail(savedAddon);
    }
  };

  const handleDeleteAddon = (addon: BedrockAddon) => {
    setAddonToDelete(addon);
  };

  const handleConfirmDelete = () => {
    if (!addonToDelete) return;
    const updatedList = deleteStoredAddon(addonToDelete.id);
    setAddons(updatedList);
    if (selectedAddonDetail?.id === addonToDelete.id) {
      setSelectedAddonDetail(null);
    }
    setAddonToDelete(null);
  };

  // Direct Addon File Download with file type and success message
  const handleTriggerDownloadFile = (addon: BedrockAddon, link?: ExternalLink) => {
    triggerAddonFileDownload(addon, link);
    setAddons(getStoredAddons());
    setDownloadHistory(getDownloadHistory());
    setDownloadSuccessToast('You have successfully downloaded the file');
    setTimeout(() => setDownloadSuccessToast(null), 4500);
  };

  const handleUpdateAddonsList = (newList: BedrockAddon[]) => {
    setAddons(newList);
    saveStoredAddons(newList);
  };

  const handleImportAddons = (imported: BedrockAddon[]) => {
    const current = getStoredAddons();
    const map = new Map<string, BedrockAddon>();
    current.forEach((a) => map.set(a.id, a));
    imported.forEach((a) => map.set(a.id, a));
    const merged = Array.from(map.values());
    setAddons(merged);
    saveStoredAddons(merged);
  };

  const handleSelectBrandTitle = (newTitle: string) => {
    setBrandTitleState(newTitle);
    setBrandTitle(newTitle);
    document.title = `${newTitle} - Minecraft Bedrock Hub`;
  };

  const handleToggleBookmark = (id: string) => {
    const updated = toggleStoredBookmark(id);
    setBookmarks(updated);
  };

  // Member Authentication
  const handleMemberSignIn = (user: MemberUser) => {
    setCurrentMember(user);
    setCurrentMemberState(user);
    if (user.email === 'altaxx39@gmail.com') {
      setIsDeveloper(true);
      setDeveloperSession(true);
    }
    heartbeatVisitor(user);
  };

  const handleMemberSignOut = () => {
    setCurrentMember(null);
    setCurrentMemberState(null);
  };

  // Comments
  const handleAddComment = (content: string, rating: number) => {
    if (!selectedAddonDetail || !currentMember) return;
    addStoredComment({
      addonId: selectedAddonDetail.id,
      userId: currentMember.id,
      username: currentMember.username,
      userAvatar: currentMember.avatar,
      content,
      rating,
    });
    setComments(getStoredComments());
  };

  const handleDeleteComment = (commentId: string) => {
    deleteStoredComment(commentId);
    setComments(getStoredComments());
  };

  // Download tracking
  const handleIncrementDownload = (addonId: string) => {
    incrementAddonDownloads(addonId);
    const updatedList = getStoredAddons();
    setAddons(updatedList);
    setDownloadHistory(getDownloadHistory());
    if (selectedAddonDetail?.id === addonId) {
      const found = updatedList.find((a) => a.id === addonId);
      if (found) setSelectedAddonDetail(found);
    }
  };

  // Clear kick record handler
  const handleClearKicked = () => {
    clearKickRecord();
    setKickRecord(null);
  };

  // Permission states (Admins can ONLY add add-ons; Visitor Preview disables dev view)
  const effectiveIsDeveloper = isDeveloper && !isVisitorPreviewMode;
  const effectiveCanAddAddons = effectiveIsDeveloper || (!isVisitorPreviewMode && isAdmin);

  // Filter and sort addons
  const filteredAddons = useMemo(() => {
    return addons.filter((addon) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = addon.title.toLowerCase().includes(q);
        const matchTagline = addon.tagline?.toLowerCase().includes(q) || false;
        const matchDesc = addon.description?.toLowerCase().includes(q) || false;
        const matchAuthor = addon.author?.toLowerCase().includes(q) || false;
        const matchTags = addon.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        if (!matchTitle && !matchTagline && !matchDesc && !matchAuthor && !matchTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && addon.category !== selectedCategory) {
        return false;
      }

      // Bedrock version filter
      if (selectedBedrockFilter !== 'all') {
        if (!addon.bedrockVersion?.includes(selectedBedrockFilter)) {
          return false;
        }
      }

      // Bookmarks only filter
      if (showOnlyBookmarks && !bookmarks.includes(addon.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
      if (sortBy === 'links') return (b.links?.length || 0) - (a.links?.length || 0);
      return 0;
    });
  }, [addons, searchQuery, selectedCategory, selectedBedrockFilter, showOnlyBookmarks, bookmarks, sortBy]);

  const categories: { key: string; label: string; count: number }[] = useMemo(() => {
    const list = [
      { key: 'all', label: getTranslation('allCategories', currentLanguage), count: addons.length },
    ];
    (Object.keys(CATEGORY_LABELS) as AddonCategory[]).forEach((cat) => {
      list.push({
        key: cat,
        label: CATEGORY_LABELS[cat].label,
        count: addons.filter((a) => a.category === cat).length,
      });
    });
    return list;
  }, [addons, currentLanguage]);

  const myDeviceId = getDeviceId();
  const adminTagColor = getAdminTagColor(myDeviceId);

  return (
    <div className={`min-h-screen transition-colors ${themeMode === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* MAINTENANCE OVERLAY (App is closed for technical problems) */}
      <MaintenanceOverlay
        isClosed={appStatus.isClosed}
        closedMessage={appStatus.closedMessage}
        isDeveloper={effectiveIsDeveloper}
      />

      {isAppLoading ? (
        <BedrockLoadingScreen
          config={appStatus}
          isLoading={true}
          onFinishLoading={() => {}}
        />
      ) : (
        <>
          {/* Primary Header */}
          <Header
            brandTitle={brandTitle}
            onOpenNameSuggestions={() => setIsNameSuggestionsOpen(true)}
            isDeveloper={isDeveloper}
            isVisitorPreviewMode={isVisitorPreviewMode}
            onToggleVisitorPreview={handleToggleVisitorPreview}
            onToggleDeveloperSecret={handleToggleDeveloperSecret}
            onOpenNewAddonModal={handleOpenCreateModal}
            onOpenDeveloperTools={() => setIsDeveloperToolsOpen(true)}
            bookmarkedCount={bookmarks.length}
            showOnlyBookmarks={showOnlyBookmarks}
            onToggleBookmarksFilter={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
            currentMember={currentMember}
            onOpenSignIn={() => setIsAuthModalOpen(true)}
            onSignOut={handleMemberSignOut}
            appStatus={appStatus}
            isAdmin={isAdmin}
            onOpenLiveStatus={() => setIsLiveStatusModalOpen(true)}
            onlineVisitorsCount={onlineCount}
            ownerConfig={ownerConfig}
            onOpenRules={() => setIsRulesModalOpen(true)}
            onOpenVisitorSettings={() => setIsVisitorSettingsOpen(true)}
            themeMode={themeMode}
            onToggleTheme={handleToggleTheme}
            currentLanguage={currentLanguage}
          />

          {/* Main Container with safe bottom padding for BottomNavBar */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-28">
            {/* 1. HOME TAB */}
            {activeNavTab === 'home' && (
              <div className="space-y-4 sm:space-y-5">
                {/* Search, Filter, and Sort Toolbar */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={getTranslation('searchPlaceholder', currentLanguage)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs sm:text-sm outline-none transition ${
                  themeMode === 'light'
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-cyan-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort & Version Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`flex items-center gap-1 border rounded-xl px-2.5 py-1.5 text-xs ${
                themeMode === 'light'
                  ? 'bg-white border-slate-300 text-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="downloads">Most Downloads</option>
                  <option value="title">Alphabetical (A-Z)</option>
                  <option value="links">Most Download Links</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* View Mode Toggle: Category Slides (Screenshot style) vs Grid */}
              <div className={`flex items-center rounded-xl p-0.5 border ${
                themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
              }`}>
                <button
                  type="button"
                  onClick={() => setViewMode('slider')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    viewMode === 'slider'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Category Slides View (Slide to see more addons)"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Slides</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    viewMode === 'grid'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>

              {/* Bookmarks / Saved Addons Filter */}
              <button
                type="button"
                onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  showOnlyBookmarks
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
                    : themeMode === 'light'
                    ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
                title="Filter saved favorite addons"
              >
                <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span className="hidden sm:inline">{getTranslation('saved', currentLanguage)}</span>
                {bookmarks.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                    {bookmarks.length}
                  </span>
                )}
              </button>

              {/* Quick Add Add-on Button for Owner / Admin */}
              {effectiveCanAddAddons && (
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm shadow-emerald-500/25 transition flex items-center gap-1.5 active:scale-95"
                  title="Add new addon"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{getTranslation('addAddon', currentLanguage)}</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.key
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : themeMode === 'light'
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedCategory === cat.key
                    ? 'bg-slate-950/20 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Addon Catalog: Category Sliders Showcase (Reference layout) or Grid */}
        {viewMode === 'slider' && selectedCategory === 'all' && !searchQuery.trim() ? (
          /* Main Category Slider Sections (ADD-ONS, WORLDS, SKIN PACKS, TEXTURE PACKS...) */
          <div className="space-y-4">
            {SHOWCASE_CATEGORY_ORDER.map(({ key, title }) => {
              const categoryAddons = filteredAddons.filter((a) => a.category === key);
              if (categoryAddons.length === 0) return null;
              return (
                <CategorySliderSection
                  key={key}
                  categoryKey={key}
                  title={title}
                  addons={categoryAddons}
                  onSelectAddon={(addon) => setSelectedAddonDetail(addon)}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  isOwner={effectiveIsDeveloper}
                  onEdit={effectiveCanAddAddons ? (addon) => handleOpenEdit(addon) : undefined}
                  onDelete={effectiveIsDeveloper ? (addon) => handleDeleteAddon(addon) : undefined}
                  themeMode={themeMode}
                />
              );
            })}
          </div>
        ) : viewMode === 'slider' && selectedCategory !== 'all' && !searchQuery.trim() ? (
          /* Single Category Filtered Slider View + Grid */
          <div className="space-y-6">
            <CategorySliderSection
              categoryKey={selectedCategory as AddonCategory}
              title={SHOWCASE_CATEGORY_ORDER.find((c) => c.key === selectedCategory)?.title || selectedCategory}
              addons={filteredAddons}
              onSelectAddon={(addon) => setSelectedAddonDetail(addon)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              isOwner={effectiveIsDeveloper}
              onEdit={effectiveCanAddAddons ? (addon) => handleOpenEdit(addon) : undefined}
              onDelete={effectiveIsDeveloper ? (addon) => handleDeleteAddon(addon) : undefined}
              themeMode={themeMode}
            />

            {filteredAddons.length > 0 && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className={`text-xs font-black tracking-wider uppercase ${
                    themeMode === 'light' ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    All {SHOWCASE_CATEGORY_ORDER.find((c) => c.key === selectedCategory)?.title || 'Items'} ({filteredAddons.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredAddons.map((addon) => (
                    <AddonCard
                      key={addon.id}
                      addon={addon}
                      isBookmarked={bookmarks.includes(addon.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onClick={(a: BedrockAddon) => setSelectedAddonDetail(a)}
                      onEdit={effectiveCanAddAddons ? (a: BedrockAddon) => handleOpenEdit(a) : undefined}
                      onDelete={effectiveIsDeveloper ? (a: BedrockAddon) => handleDeleteAddon(a) : undefined}
                      isOwner={effectiveIsDeveloper}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Standard Grid View or Search Results */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredAddons.map((addon) => (
              <AddonCard
                key={addon.id}
                addon={addon}
                isBookmarked={bookmarks.includes(addon.id)}
                onToggleBookmark={handleToggleBookmark}
                onClick={(a: BedrockAddon) => setSelectedAddonDetail(a)}
                onEdit={effectiveCanAddAddons ? (a: BedrockAddon) => handleOpenEdit(a) : undefined}
                onDelete={effectiveIsDeveloper ? (a: BedrockAddon) => handleDeleteAddon(a) : undefined}
                isOwner={effectiveIsDeveloper}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAddons.length === 0 && (
          <div className={`text-center py-12 px-4 rounded-3xl border space-y-3 ${
            themeMode === 'light'
              ? 'bg-white border-slate-200'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <Package className="w-10 h-10 mx-auto text-slate-500" />
            <h3 className="text-base font-bold text-white">No Add-ons Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No modifications match your current filters. Try resetting search query or categories.
            </p>
            {(searchQuery || selectedCategory !== 'all' || showOnlyBookmarks) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowOnlyBookmarks(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
              >
                {getTranslation('clearFilters', currentLanguage)}
              </button>
            )}
          </div>
        )}
              </div>
            )}

        {/* 2. NEWS TAB */}
        {activeNavTab === 'news' && (
          <NewsView
            themeMode={themeMode}
            isOwnerOrAdmin={effectiveIsDeveloper || isAdmin}
          />
        )}

        {/* 3. RULES TAB */}
        {activeNavTab === 'rules' && (
          <RulesView
            rules={rules}
            onAddRule={handleAddNewRule}
            onDeleteRule={handleDeleteRule}
            themeMode={themeMode}
            currentLanguage={currentLanguage}
            isOwnerOrAdmin={effectiveIsDeveloper || isAdmin}
            onOpenRulesEditor={() => setIsDeveloperToolsOpen(true)}
          />
        )}

        {/* 4. SETTINGS TAB */}
        {activeNavTab === 'settings' && (
          <SettingsView
            currentMember={currentMember}
            downloadHistory={downloadHistory}
            themeMode={themeMode}
            onToggleTheme={handleToggleTheme}
            currentLanguage={currentLanguage}
            onSelectLanguage={handleSelectLanguage}
            onSignOut={handleMemberSignOut}
            onOpenSignIn={() => setIsAuthModalOpen(true)}
            onClearDownloadHistory={() => {
              clearDownloadHistory();
              setDownloadHistory([]);
            }}
            role={effectiveIsDeveloper ? 'owner' : isAdmin ? 'admin' : 'visitor'}
            isAdmin={isAdmin}
            isOwner={effectiveIsDeveloper}
            ownerTagText={ownerConfig.tagText}
            ownerTagColor={ownerConfig.tagColor}
            adminTagColor={adminTagColor}
            fontPreference={fontPreference}
            onToggleFont={handleToggleFont}
            appStatus={appStatus}
            onOpenDeveloperTools={() => setIsDeveloperToolsOpen(true)}
            onToggleDeveloperSecret={handleToggleDeveloperSecret}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className={`border-t py-8 px-4 sm:px-6 lg:px-8 text-xs transition-colors ${
        themeMode === 'light'
          ? 'bg-white border-slate-200 text-slate-500'
          : 'bg-slate-950 border-slate-800/80 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 text-center">
          {/* Social Media Links if added by developer */}
          {appStatus.socialLinks && appStatus.socialLinks.length > 0 && (
            <div className="w-full pb-6 border-b border-slate-800/80 flex flex-col items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Connect With Us
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {appStatus.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-2xl border font-bold text-xs transition flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 ${
                      link.platform === 'whatsapp'
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                        : link.platform === 'telegram'
                        ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span>{link.platform === 'whatsapp' ? '💚' : link.platform === 'telegram' ? '💙' : '🌐'}</span>
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className={`font-bold ${themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>
                {brandTitle}
              </span>
              <span>•</span>
              <span>Minecraft Bedrock Edition Showcase</span>
            </div>

            <div className="text-slate-500">
              All Bedrock addons, behavior packs, and textures belong to their respective creators.
            </div>
          </div>
        </div>
      </footer>

      {/* 📱 Modern Bottom Navigation Bar: 1. Home, 2. News, 3. Rules, 4. Settings */}
      <BottomNavBar
        activeTab={activeNavTab}
        onSelectTab={(tab) => {
          setActiveNavTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        themeMode={themeMode}
        currentLanguage={currentLanguage}
        rulesCount={rules.length}
      />
        </>
      )}

      {/* Version Popup shown after loading completes */}
      {isVersionPopupOpen && (
        <VersionPopup
          version={appStatus.appVersion || '1.0.0'}
          message={appStatus.versionMessage || 'Welcome to the latest version!'}
          onClose={() => setIsVersionPopupOpen(false)}
        />
      )}

      {/* ALL MODALS */}
      <AddonDetailModal
        isOpen={Boolean(selectedAddonDetail)}
        onClose={() => setSelectedAddonDetail(null)}
        addon={selectedAddonDetail}
        isOwner={effectiveIsDeveloper}
        isBookmarked={selectedAddonDetail ? bookmarks.includes(selectedAddonDetail.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onEdit={effectiveCanAddAddons ? (addon) => {
          setSelectedAddonDetail(null);
          handleOpenEdit(addon);
        } : undefined}
        onDelete={effectiveIsDeveloper ? handleDeleteAddon : undefined}
        currentMember={currentMember}
        comments={selectedAddonDetail ? comments.filter((c) => c.addonId === selectedAddonDetail.id) : []}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onOpenSignIn={() => setIsAuthModalOpen(true)}
        onDownloadClick={handleIncrementDownload}
        downloadDelay={appStatus.downloadDelay}
      />

      <AddonFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveAddon}
        onDelete={effectiveIsDeveloper ? handleDeleteAddon : undefined}
        initialAddon={editingAddon}
        defaultCategory={selectedCreationCategory}
      />

      <CategoryPickerModal
        isOpen={isCategoryPickerOpen}
        onClose={() => setIsCategoryPickerOpen(false)}
        onSelectCategory={handleSelectCreationType}
        currentCategory={selectedCreationCategory}
      />

      <NameSuggestionsModal
        isOpen={isNameSuggestionsOpen}
        onClose={() => setIsNameSuggestionsOpen(false)}
        currentTitle={brandTitle}
        onSelectTitle={handleSelectBrandTitle}
        isOwner={isDeveloper}
      />

      <DeveloperSettingsModal
        isOpen={isDeveloperToolsOpen}
        onClose={() => setIsDeveloperToolsOpen(false)}
        appStatus={appStatus}
        onUpdateAppStatus={handleUpdateAppStatus}
        addons={addons}
        onImportAddons={handleImportAddons}
        onClearAllAddons={() => handleUpdateAddonsList([])}
        onLoadSampleData={() => handleUpdateAddonsList(SAMPLE_STARTER_ADDONS)}
        onPreviewLoadingScreen={() => {
          setIsDeveloperToolsOpen(false);
          setLoadingScreenPreview(true);
        }}
        saveAchievementEnabled={saveAchievementEnabled}
        onToggleSaveAchievement={handleToggleSaveAchievement}
        saveIntervalSeconds={saveIntervalSeconds}
        onUpdateSaveInterval={handleUpdateSaveInterval}
        loadingScreenEnabled={loadingScreenEnabled}
        onToggleLoadingScreen={(enabled) => {
          setLoadingScreenEnabled(enabled);
          localStorage.setItem('prismmods_loading_screen_enabled', JSON.stringify(enabled));
        }}
        isVisitorPreviewMode={isVisitorPreviewMode}
        onToggleVisitorPreviewMode={setIsVisitorPreviewMode}
      />

      <BedrockLoadingScreen
        config={appStatus}
        isLoading={loadingScreenPreview}
        onFinishLoading={() => setLoadingScreenPreview(false)}
        isPreview={loadingScreenPreview}
        onClosePreview={() => setLoadingScreenPreview(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleMemberSignIn}
      />

      {/* Rules Modal (for visitors to view custom rules created by developer) */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        rules={rules}
        currentLang={currentLanguage}
      />

      {/* Visitor & Member Settings Modal */}
      <VisitorSettingsModal
        isOpen={isVisitorSettingsOpen}
        onClose={() => setIsVisitorSettingsOpen(false)}
        currentMember={currentMember}
        downloadHistory={downloadHistory}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        onSignOut={handleMemberSignOut}
        onClearDownloadHistory={() => {
          clearDownloadHistory();
          setDownloadHistory([]);
        }}
        onOpenSignIn={() => {
          setIsVisitorSettingsOpen(false);
          setIsAuthModalOpen(true);
        }}
        role={effectiveIsDeveloper ? 'owner' : isAdmin ? 'admin' : 'visitor'}
        isAdmin={isAdmin}
        isOwner={effectiveIsDeveloper}
        ownerTagText={ownerConfig.tagText}
        ownerTagColor={ownerConfig.tagColor}
        adminTagColor={adminTagColor}
        fontPreference={fontPreference}
        onToggleFont={handleToggleFont}
      />


      {/* Real-time Kick or Ban blocker */}
      <KickedOrBannedOverlay
        isBanned={isBanned}
        kickRecord={kickRecord}
        onClearKicked={handleClearKicked}
      />

      {/* Live Community Status Modal (Shows who is online and tags, owner logo/tag customizer) */}
      <LiveStatusModal
        isOpen={isLiveStatusModalOpen}
        onClose={() => setIsLiveStatusModalOpen(false)}
        isOwner={effectiveIsDeveloper}
        currentMember={currentMember}
      />

      {/* 🗑️ DEDICATED DELETE CONFIRMATION MODAL (Fixes delete button for any type of addon) */}
      {addonToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-slate-100">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-2xl shadow-rose-950/60">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <span className="text-2xl">🗑️</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Delete Add-on</h3>
              <p className="text-sm font-semibold text-rose-300">
                Are you sure you want to delete this addon?
              </p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mt-2 font-mono">
                "{addonToDelete.title}" ({addonToDelete.category})
              </div>
            </div>

            <p className="text-xs text-slate-400">
              This will permanently remove this addon package from your catalog.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddonToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                Cancel / Go Back
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              >
                <span>Delete Addon</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📥 SUCCESS DOWNLOAD FLOATING TOAST */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in">
          <div className="px-5 py-3.5 rounded-2xl bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 text-sm font-bold shadow-2xl shadow-emerald-950/80 flex items-center gap-3 backdrop-blur-md">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
              ✓
            </span>
            <span>{downloadSuccessToast}</span>
          </div>
        </div>
      )}
      
      {/* 🏆 MINECRAFT ACHIEVEMENT TOAST */}
      {saveAchievementToast && (
        <MinecraftAchievementToast message={saveAchievementToast} />
      )}
    </div>
  );
}
