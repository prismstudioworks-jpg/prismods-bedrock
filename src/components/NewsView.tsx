import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Sparkles, Flame, Calendar, User, Heart, 
  ExternalLink, Search, Tag, CheckCircle2, Plus, X, 
  Clock, Share2, Shield, ArrowRight, MessageSquare, Trash2
} from 'lucide-react';
import { ThemeMode } from '../types/addon';

export interface NewsPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'game_update' | 'addon_drop' | 'community' | 'security' | 'creator';
  tag: string;
  date: string;
  author: string;
  authorRole?: string;
  likes: number;
  readTime: string;
  bannerGradient: string;
  highlights?: string[];
}

const DEFAULT_NEWS: NewsPost[] = [];

const STORAGE_KEY_NEWS = 'prismmods_custom_news_articles';
const STORAGE_KEY_LIKED = 'prismmods_liked_news_posts';

interface NewsViewProps {
  themeMode: ThemeMode;
  isOwnerOrAdmin: boolean;
}

export const NewsView: React.FC<NewsViewProps> = ({ themeMode, isOwnerOrAdmin = true }) => {
  const isLight = themeMode === 'light';
  const [posts, setPosts] = useState<NewsPost[]>(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_NEWS);
    } catch {}
    return DEFAULT_NEWS;
  });

  const [likedPosts, setLikedPosts] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LIKED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsPost | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NewsPost['category']>('community');
  const [newTag, setNewTag] = useState('');

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedPosts.includes(id);
    const updatedLiked = isLiked
      ? likedPosts.filter((item) => item !== id)
      : [...likedPosts, id];

    setLikedPosts(updatedLiked);
    try {
      localStorage.setItem(STORAGE_KEY_LIKED, JSON.stringify(updatedLiked));
    } catch {}

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newPost: NewsPost = {
      id: `custom-news-${Date.now()}`,
      title: newTitle.trim(),
      summary: newSummary.trim(),
      content: newContent.trim() || newSummary.trim(),
      category: newCategory,
      tag: newTag.trim() || 'Announcement',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Owner & Admin',
      authorRole: 'PrismMods Staff',
      likes: 1,
      readTime: '2 min read',
      bannerGradient: 'from-cyan-600 via-blue-700 to-indigo-900',
      highlights: [newTitle.trim()],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(updated));
    } catch {}

    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewTag('');
    setIsNewPostModalOpen(false);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this news story?')) return;
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(updated));
    } catch {}
    if (activeArticle?.id === id) {
      setActiveArticle(null);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchTag = p.tag.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchTag;
    }
    return true;
  });

  const featured = posts[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner / Heading */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
        isLight
          ? 'bg-gradient-to-br from-cyan-50 via-white to-emerald-50 border-cyan-200/80 shadow-sm'
          : 'bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 border-slate-800 shadow-xl'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Minecraft Bedrock Chronicle</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              News & Community Updates
            </h1>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Stay updated with Bedrock patch notes, Render Dragon shader progress, and PrismMods announcements.
            </p>
          </div>

          {isOwnerOrAdmin && (
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post Announcement</span>
            </button>
          )}
        </div>

        {/* Search & Category Filter Chips */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All News' },
              { id: 'game_update', label: '🎮 Game Updates' },
              { id: 'addon_drop', label: '✨ Add-on Drops' },
              { id: 'community', label: '👥 Community' },
              { id: 'security', label: '🛡️ Safety & Rules' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : isLight
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none transition border ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500'
                  : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Featured Lead Story (Only if 'all' and no search) */}
      {selectedCategory === 'all' && !searchQuery.trim() && featured && (
        <div
          onClick={() => setActiveArticle(featured)}
          className={`cursor-pointer group rounded-3xl border overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
            isLight
              ? 'bg-white border-slate-200 hover:border-cyan-400 shadow-md'
              : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 shadow-2xl'
          }`}
        >
          <div className={`p-6 sm:p-8 bg-gradient-to-r ${featured.bannerGradient} text-white relative`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[11px] font-black tracking-wide uppercase border border-white/20">
                ⭐ Featured Story
              </span>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {featured.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug group-hover:text-cyan-200 transition">
              {featured.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed max-w-3xl">
              {featured.summary}
            </p>

            {featured.highlights && (
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={`px-6 py-3.5 flex items-center justify-between text-xs ${
            isLight ? 'bg-slate-50 text-slate-600' : 'bg-slate-950 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">By {featured.author}</span>
              <span>•</span>
              <span className="text-cyan-400 font-bold">{featured.authorRole}</span>
            </div>

            <div className="flex items-center gap-4">
              {isOwnerOrAdmin && (
                <button
                  type="button"
                  onClick={(e) => handleDeletePost(featured.id, e)}
                  className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition"
                  title="Delete news story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={(e) => handleToggleLike(featured.id, e)}
                className={`flex items-center gap-1 font-bold transition ${
                  likedPosts.includes(featured.id)
                    ? 'text-rose-400'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedPosts.includes(featured.id) ? 'fill-rose-400' : ''}`} />
                <span>{featured.likes}</span>
              </button>

              <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          return (
            <div
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className={`group cursor-pointer rounded-3xl border p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-lg'
                  : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900 shadow-xl'
              }`}
            >
              <div className="space-y-3">
                {/* Post Category & Meta */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    post.category === 'game_update'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : post.category === 'addon_drop'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : post.category === 'security'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {post.tag}
                  </span>

                  <span className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-base sm:text-lg font-black leading-snug group-hover:text-cyan-400 transition ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {post.title}
                </h3>

                {/* Summary */}
                <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {post.summary}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className={`text-[11px] truncate max-w-[150px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  By <strong className="font-semibold text-slate-300">{post.author}</strong>
                </span>

                <div className="flex items-center gap-3">
                  {isOwnerOrAdmin && (
                    <button
                      type="button"
                      onClick={(e) => handleDeletePost(post.id, e)}
                      className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition"
                      title="Delete news story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleToggleLike(post.id, e)}
                    className={`flex items-center gap-1 font-bold text-xs transition ${
                      isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <span className="text-cyan-400 font-bold flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <Newspaper className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
          <p className="text-sm font-bold text-slate-300">No news articles found</p>
          <p className="text-xs text-slate-500">Try adjusting your category filter or search query.</p>
        </div>
      )}

      {/* ARTICLE READER POPUP MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col text-slate-100 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-3 pr-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-black uppercase">
                  {activeArticle.tag}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {activeArticle.date}
                </span>
                <span className="text-xs text-slate-400">• {activeArticle.readTime}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>By <strong className="text-white">{activeArticle.author}</strong></span>
                {activeArticle.authorRole && (
                  <span className="px-2 py-0.2 rounded-full bg-slate-800 text-cyan-300 font-semibold text-[10px]">
                    {activeArticle.authorRole}
                  </span>
                )}
              </div>
            </div>

            {/* Highlights */}
            {activeArticle.highlights && (
              <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                  Key Takeaways
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {activeArticle.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="my-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {activeArticle.content}
            </div>

            {/* Footer with Like & Actions */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleToggleLike(activeArticle.id, e)}
                  className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition ${
                    likedPosts.includes(activeArticle.id)
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.includes(activeArticle.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{activeArticle.likes} Likes</span>
                </button>

                {isOwnerOrAdmin && (
                  <button
                    type="button"
                    onClick={(e) => handleDeletePost(activeArticle.id, e)}
                    className="px-3.5 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition"
                    title="Delete news story"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL (Owner/Admin) */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <form
            onSubmit={handleCreatePost}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[92vh] flex flex-col text-slate-100 overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-black text-white">
                Publish Community Announcement
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Headline Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. New Minecraft 1.21.50 Preview Available"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                >
                  <option value="game_update">Game Update</option>
                  <option value="addon_drop">Add-on Drop</option>
                  <option value="community">Community</option>
                  <option value="security">Safety & Moderation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tag Label</label>
                <input
                  type="text"
                  placeholder="e.g. Announcement, Shaders..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Short Summary *</label>
              <textarea
                required
                rows={2}
                placeholder="Brief 1-2 sentence overview shown in the news card..."
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Article Content</label>
              <textarea
                rows={5}
                placeholder="Write detailed patch notes, instructions, or news details here..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Publish News
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
