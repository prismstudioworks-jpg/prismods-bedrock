import React, { useRef, useState, useEffect } from 'react';
import { BedrockAddon, AddonCategory, CATEGORY_LABELS, ThemeMode } from '../types/addon';
import { ChevronLeft, ChevronRight, Heart, Edit3, Trash2, Download } from 'lucide-react';
import { hasContent } from '../utils/storage';

interface CategorySliderSectionProps {
  categoryKey: AddonCategory;
  title: string;
  addons: BedrockAddon[];
  onSelectAddon: (addon: BedrockAddon) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  isOwner: boolean;
  onEdit?: (addon: BedrockAddon) => void;
  onDelete?: (addon: BedrockAddon) => void;
  themeMode?: ThemeMode;
}

export const CategorySliderSection: React.FC<CategorySliderSectionProps> = ({
  categoryKey,
  title,
  addons,
  onSelectAddon,
  bookmarks,
  onToggleBookmark,
  isOwner,
  onEdit,
  onDelete,
  themeMode = 'dark',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [addons]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.75, 280);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Mouse drag-to-slide handlers for desktop visitors
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftStart(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const distance = (x - startX) * 1.5;
    if (Math.abs(distance) > 5) {
      setHasDragged(true);
    }
    el.scrollLeft = scrollLeftStart - distance;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  if (addons.length === 0) return null;

  // Pretty category display names and short tags matching official reference
  const getCategoryMeta = (cat: AddonCategory) => {
    switch (cat) {
      case 'addon':
        return { title: 'ADD-ONS', tag: 'Add-On' };
      case 'map':
        return { title: 'WORLDS', tag: 'World' };
      case 'skin_pack':
        return { title: 'SKIN PACKS', tag: 'Skin Pack' };
      case 'resource_pack':
        return { title: 'TEXTURE PACKS', tag: 'Texture Pack' };
      case 'shader':
        return { title: 'SHADERS', tag: 'Shader' };
      case 'behavior_pack':
        return { title: 'BEHAVIOR PACKS', tag: 'Behavior' };
      default:
        return { title: title ? title.toUpperCase() : 'CATEGORY', tag: title || 'Pack' };
    }
  };

  const meta = getCategoryMeta(categoryKey);
  const displayTitle = title ? title.toUpperCase() : meta.title;

  return (
    <section className="space-y-2.5 py-3">
      {/* Category Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className={`text-sm sm:text-base md:text-lg font-black tracking-wider uppercase ${
            themeMode === 'light' ? 'text-slate-900' : 'text-slate-100'
          }`}>
            {displayTitle}
          </h2>
        </div>

        {/* Navigation Arrow Buttons (< and >) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label={`Slide ${displayTitle} left`}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
              canScrollLeft
                ? themeMode === 'light'
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm active:scale-95'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 shadow-sm active:scale-95'
                : 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500'
            }`}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label={`Slide ${displayTitle} right`}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
              canScrollRight
                ? themeMode === 'light'
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm active:scale-95'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 shadow-sm active:scale-95'
                : 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500'
            }`}
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-3 pt-1 px-1 -mx-1 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {addons.map((addon) => {
          const isBookmarked = bookmarks.includes(addon.id);
          const versionText = addon.version || addon.bedrockVersion || '1.0.0';

          return (
            <div
              key={addon.id}
              onClick={() => {
                if (!hasDragged) {
                  onSelectAddon(addon);
                }
              }}
              className="group w-[230px] sm:w-[260px] md:w-[280px] shrink-0 snap-start cursor-pointer select-none space-y-2"
            >
              {/* Thumbnail Container */}
              <div className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden border transition-all duration-300 group-hover:shadow-xl ${
                themeMode === 'light'
                  ? 'bg-slate-100 border-slate-200/90 group-hover:border-cyan-500/60 shadow-slate-200/50'
                  : 'bg-slate-950 border-slate-800 group-hover:border-cyan-500/50 shadow-black/40'
              }`}>
                {/* Image Cover or Minecraft Procedural Art */}
                {hasContent(addon.coverImage) ? (
                  <img
                    src={addon.coverImage}
                    alt={addon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/60 p-4 flex flex-col justify-between relative overflow-hidden">
                    {/* Subtle block grid pattern */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00f5d4_1px,transparent_1px)] [background-size:12px_12px]" />
                    <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold">{meta.tag}</span>
                    </div>
                    <div className="relative z-10 my-auto text-center font-black text-slate-200 text-sm line-clamp-2 px-1">
                      {addon.title}
                    </div>
                  </div>
                )}

                {/* Top-Left Version Pill */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-300 font-mono text-[10px] font-bold tracking-wider border border-white/10 shadow-sm">
                    {versionText}
                  </span>
                </div>

                {/* Top-Right Quick Bookmark, Owner Controls & Update Tag */}
                <div
                  className="absolute top-2 right-2 z-10 flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Tag Update at right top corner of addon image */}
                  {addon.hasUpdateTag && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md shadow-emerald-500/30 border border-emerald-400/80">
                      Update
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(addon.id)}
                    className={`p-1.5 rounded-lg backdrop-blur-md border transition ${
                      isBookmarked
                        ? 'bg-rose-500/30 text-rose-300 border-rose-500/40'
                        : 'bg-black/60 text-slate-300 hover:text-white border-white/10 hover:bg-black/80'
                    }`}
                    title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  </button>

                  {isOwner && (
                    <>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(addon)}
                          className="p-1.5 rounded-lg bg-black/60 text-emerald-300 hover:text-white border border-white/10 hover:bg-emerald-600/80 transition"
                          title="Edit Addon"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(addon)}
                          className="p-1.5 rounded-lg bg-black/60 text-rose-300 hover:text-white border border-white/10 hover:bg-rose-600/80 transition"
                          title="Delete Addon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Bottom-Left Category Tag on Image */}
                <div className="absolute bottom-2 left-2.5 z-10">
                  <span className="text-white text-xs font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] opacity-90 group-hover:opacity-100 transition">
                    {meta.tag}
                  </span>
                </div>

                {/* Subtle dark gradient scrim at bottom to ensure text legibility */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Title & Metadata Underneath */}
              <div className="px-0.5 space-y-0.5">
                <h3 className={`text-xs sm:text-sm font-extrabold tracking-tight uppercase line-clamp-1 transition-colors ${
                  themeMode === 'light'
                    ? 'text-slate-900 group-hover:text-cyan-600'
                    : 'text-slate-100 group-hover:text-cyan-400'
                }`}>
                  {addon.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px]">
                    {addon.author ? `by ${addon.author}` : addon.tagline || meta.tag}
                  </span>

                  {addon.downloadCount !== undefined && addon.downloadCount > 0 && (
                    <span className="flex items-center gap-1 text-emerald-400 shrink-0 font-medium font-mono text-[10px]">
                      <Download className="w-2.5 h-2.5" />
                      <span>{addon.downloadCount}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Divider between category rows */}
      <div className={`border-b pt-2 ${
        themeMode === 'light' ? 'border-slate-200' : 'border-slate-800/60'
      }`} />
    </section>
  );
};
