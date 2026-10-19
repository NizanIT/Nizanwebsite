'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, SlidersHorizontal, Sparkles } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { supabase } from '@/lib/supabase';

export interface PortfolioCard {
  src: string;
  alt: string;
  title: string;
  category: string;
  gridClass: string;
  aspect: string;
  parallaxDir: 1 | -1;
  event?: string;
  style?: string;
}

const layoutPresets: Array<Pick<PortfolioCard, 'gridClass' | 'aspect' | 'parallaxDir'>> = [
  { gridClass: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', parallaxDir: 1 },
  { gridClass: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]', parallaxDir: -1 },
  { gridClass: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]', parallaxDir: 1 },
  { gridClass: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', parallaxDir: -1 },
];

const EVENT_CATEGORIES = [
  'All',
  'Muhurtham & Traditional',
  'Reception & Glam',
  'Haldi & Mehendi',
  'Engagement & Party'
];

const STYLE_CATEGORIES = [
  'All',
  'Airbrush Radiance',
  'Signature HD',
  'Dewy & Minimalist',
  'Royal Classic'
];

const DEFAULT_PORTFOLIO_ITEMS: PortfolioCard[] = [
  {
    src: '/portfolio_images/photo-output (12).JPEG',
    alt: 'Royal Temple Muhurtham Bridal Makeover',
    title: 'Royal Temple Muhurtham',
    category: 'Muhurtham & Traditional',
    gridClass: '', aspect: '', parallaxDir: 1,
  },
  {
    src: '/portfolio_images/photo-output (13).JPEG',
    alt: 'Dewy Reception Airbrush Glow Makeover',
    title: 'Shimmering Dewy Glow',
    category: 'Reception & Glam',
    gridClass: '', aspect: '', parallaxDir: -1,
  },
  {
    src: '/portfolio_images/photo-output (14).JPEG',
    alt: 'Luminous Minimalist Christian Bridal Makeover',
    title: 'Luminous Christian Bride',
    category: 'Reception & Glam',
    gridClass: '', aspect: '', parallaxDir: 1,
  },
  {
    src: '/portfolio_images/photo-output (16).JPEG',
    alt: 'Traditional Kasavu Saree Muhurtham Bride',
    title: 'Kasavu Saree Muhurtham',
    category: 'Muhurtham & Traditional',
    gridClass: '', aspect: '', parallaxDir: -1,
  },
  {
    src: '/portfolio_images/photo-output (17).JPEG',
    alt: 'Velvet Matte Evening Reception Makeup',
    title: 'Velvet Matte Reception Glam',
    category: 'Reception & Glam',
    gridClass: '', aspect: '', parallaxDir: 1,
  },
  {
    src: '/portfolio_images/photo-output (18).JPEG',
    alt: 'Pastel Floral Mehendi Transformation',
    title: 'Pastel Floral Mehendi',
    category: 'Haldi & Mehendi',
    gridClass: '', aspect: '', parallaxDir: -1,
  },
  {
    src: '/portfolio_images/photo-output (19).JPEG',
    alt: 'Vibrant Sunset Sangeet Airbrush Glam',
    title: 'Sunset Sangeet Radiance',
    category: 'Haldi & Mehendi',
    gridClass: '', aspect: '', parallaxDir: 1,
  },
  {
    src: '/portfolio_images/photo-output (20).JPEG',
    alt: 'Royal Muslim Nikah Luxury Makeup',
    title: 'Bespoke Royal Nikah Glam',
    category: 'Reception & Glam',
    gridClass: '', aspect: '', parallaxDir: -1,
  },
  {
    src: '/portfolio_images/photo-output (21).JPEG',
    alt: 'Dewy Soft Glam Engagement Makeup',
    title: 'Soft Glam Engagement Bride',
    category: 'Engagement & Party',
    gridClass: '', aspect: '', parallaxDir: 1,
  },
  {
    src: '/portfolio_images/photo-output (23).JPEG',
    alt: 'Vibrant Sun-kissed Haldi Makeover',
    title: 'Sun-kissed Haldi Look',
    category: 'Haldi & Mehendi',
    gridClass: '', aspect: '', parallaxDir: -1,
  },
  {
    src: '/portfolio_images/photo-output (24).JPEG',
    alt: 'Royal North Indian Traditional Bridal',
    title: 'Royal North Indian Bridal',
    category: 'Muhurtham & Traditional',
    gridClass: '', aspect: '', parallaxDir: 1,
  },
];

/* Helper to parse categories based on title/tag values */
function parsePortfolioItem(item: { title: string; category?: string }) {
  const titleText = item.title.toLowerCase();
  const categoryText = (item.category || '').toLowerCase();

  // 1. Determine Event / Ceremony
  let event = 'Engagement & Party'; // Default
  if (
    categoryText.includes('muhurtham') ||
    categoryText.includes('traditional') ||
    categoryText.includes('temple') ||
    titleText.includes('muhurtham') ||
    titleText.includes('traditional') ||
    titleText.includes('kerala') ||
    titleText.includes('kasavu') ||
    titleText.includes('wedding')
  ) {
    event = 'Muhurtham & Traditional';
  } else if (
    categoryText.includes('reception') ||
    categoryText.includes('glam') ||
    categoryText.includes('gown') ||
    categoryText.includes('evening') ||
    categoryText.includes('nikah') ||
    titleText.includes('reception') ||
    titleText.includes('gown') ||
    titleText.includes('evening') ||
    titleText.includes('nikah') ||
    titleText.includes('christian') ||
    titleText.includes('bride')
  ) {
    event = 'Reception & Glam';
  } else if (
    categoryText.includes('haldi') ||
    categoryText.includes('mehendi') ||
    categoryText.includes('sangeet') ||
    titleText.includes('haldi') ||
    titleText.includes('mehendi') ||
    titleText.includes('sangeet') ||
    titleText.includes('pastel') ||
    titleText.includes('floral')
  ) {
    event = 'Haldi & Mehendi';
  } else if (
    categoryText.includes('engagement') ||
    categoryText.includes('party') ||
    categoryText.includes('trial') ||
    titleText.includes('engagement') ||
    titleText.includes('party') ||
    titleText.includes('soft glam')
  ) {
    event = 'Engagement & Party';
  }

  // 2. Determine Makeup Artistry Style
  let style = 'Signature HD'; // Default
  if (
    categoryText.includes('airbrush') ||
    categoryText.includes('radiance') ||
    titleText.includes('airbrush') ||
    titleText.includes('radiance') ||
    titleText.includes('shimmering')
  ) {
    style = 'Airbrush Radiance';
  } else if (
    categoryText.includes('dewy') ||
    categoryText.includes('minimal') ||
    categoryText.includes('nude') ||
    titleText.includes('dewy') ||
    titleText.includes('minimal') ||
    titleText.includes('nude') ||
    titleText.includes('ethereal') ||
    titleText.includes('luminous')
  ) {
    style = 'Dewy & Minimalist';
  } else if (
    categoryText.includes('royal') ||
    categoryText.includes('classic') ||
    categoryText.includes('celebrity') ||
    titleText.includes('royal') ||
    titleText.includes('classic') ||
    titleText.includes('celebrity') ||
    titleText.includes('kasavu') ||
    titleText.includes('temple')
  ) {
    style = 'Royal Classic';
  } else if (
    categoryText.includes('hd') ||
    titleText.includes('hd') ||
    titleText.includes('velvet') ||
    titleText.includes('matte')
  ) {
    style = 'Signature HD';
  }

  return { event, style };
}

/* ── Lightbox ──────────────────────────────────────────── */
function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: PortfolioCard[];
  startIndex: number;
  onClose: () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev();
      if (e.key === 'ArrowRight') emblaApi?.scrollNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [emblaApi, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 border border-white/20 hover:border-gold text-white hover:text-gold flex items-center justify-center transition-all duration-200"
      >
        <X size={18} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
        className="absolute left-4 md:left-8 z-10 w-12 h-12 border border-white/20 hover:border-gold hover:bg-gold hover:text-navy text-white flex items-center justify-center transition-all duration-200"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); scrollNext(); }}
        className="absolute right-4 md:right-8 z-10 w-12 h-12 border border-white/20 hover:border-gold hover:bg-gold hover:text-navy text-white flex items-center justify-center transition-all duration-200"
      >
        <ChevronRight size={20} />
      </button>

      <div
        className="w-full max-w-5xl px-16 md:px-24 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        ref={emblaRef}
      >
        <div className="flex">
          {items.map((item, i) => (
            <div key={i} className="flex-none w-full relative">
              <div className="relative w-full" style={{ aspectRatio: '16/10', maxHeight: '80vh' }}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={i === startIndex}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase mb-1">{item.category}</p>
                <p className="text-white/70 font-display text-lg font-light">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Grid Item ─────────────────────────────────────────── */
function PortfolioItem({
  src, alt, title, category, gridClass, aspect, parallaxDir, index, onClick,
}: PortfolioCard & { index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [parallaxDir * 40, parallaxDir * -40]);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      layout
      className={`${gridClass} relative overflow-hidden group cursor-pointer rounded-xl`}
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
    >
      <div className={`${aspect} relative overflow-hidden`}>
        <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={index < 4}
          />
        </motion.div>

        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to top, rgba(18,17,57,0.95) 0%, rgba(18,17,57,0.2) 55%, transparent 100%)',
            opacity: 0.8,
          }}
        />
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500" />

        <div className="absolute top-4 right-4 w-9 h-9 border border-gold/50 bg-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <ZoomIn size={14} className="text-gold" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
          <span className="text-gold text-[10px] tracking-[0.28em] uppercase font-semibold block mb-2">
            {category}
          </span>
          <h3 className="font-display text-xl md:text-2xl text-white font-light leading-tight">
            {title}
          </h3>
        </div>

        <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-gold opacity-0 group-hover:opacity-100 transition-all duration-400" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-gold opacity-0 group-hover:opacity-100 transition-all duration-400" />
      </div>
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────── */
interface PortfolioProps {
  items?: PortfolioCard[];
  showViewAll?: boolean;
  maxItems?: number;
}

export default function Portfolio({ items, showViewAll = true, maxItems }: PortfolioProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [remoteItems, setRemoteItems] = useState<PortfolioCard[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Double Filter States
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');

  useEffect(() => {
    if (items && items.length > 0) return;
    if (!supabase) return;

    supabase
      .from('portfolio')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })
      .then(({ data: list, error }) => {
        if (error) { console.error('Portfolio fetch error:', error); return; }
        const mapped = (list || []).map((item: {
          image_url: string; alt_text?: string; title: string; category?: string;
        }) => ({
          src: item.image_url,
          alt: item.alt_text?.trim() || item.title,
          title: item.title,
          category: item.category?.trim() || 'Portfolio',
          gridClass: '',
          aspect: '',
          parallaxDir: 1 as 1 | -1,
        }));
        setRemoteItems(mapped);
      });
  }, [items]);

  // Determine base source
  const baseSource = items && items.length > 0 ? items : (remoteItems.length > 0 ? remoteItems : DEFAULT_PORTFOLIO_ITEMS);

  // Apply filters
  const filteredItems = baseSource.filter((item) => {
    const { event, style } = parsePortfolioItem(item);
    const matchesEvent = selectedEvent === 'All' || event === selectedEvent;
    const matchesStyle = selectedStyle === 'All' || style === selectedStyle;
    return matchesEvent && matchesStyle;
  });

  // Apply maxItems limit
  const resolvedItems = typeof maxItems === 'number' ? filteredItems.slice(0, Math.max(0, maxItems)) : filteredItems;

  // Dynamically apply layout presets so grid aligns beautifully when filtered
  const displayedItems = resolvedItems.map((item, index) => ({
    ...item,
    gridClass: layoutPresets[index % layoutPresets.length].gridClass,
    aspect: layoutPresets[index % layoutPresets.length].aspect,
    parallaxDir: layoutPresets[index % layoutPresets.length].parallaxDir,
  }));

  return (
    <>
      <section id="portfolio" className="section-dark py-28 lg:py-40" ref={ref}>
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">

          {/* Editorial Header */}
          <div className="mb-20">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-gold text-[11px] font-medium tracking-[0.35em] uppercase mb-4 block"
            >
              Selected Work
            </motion.span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-light text-white leading-[1.0]"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
              >
                The
                <br />
                <span className="italic">Portfolio</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-white/50 text-base max-w-sm leading-relaxed md:text-right"
              >
                A curated showcase of breathtaking transformations — each one a unique story of artistry, culture, and grace.
              </motion.p>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 h-px bg-white/10 origin-left"
            />
          </div>

          {/* Refined Double Filter Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mb-16 space-y-6 bg-white/[0.02] border border-gold/10 p-6 md:p-8 rounded-2xl backdrop-blur-md"
          >
            {/* Filter 1: Ceremony / Event */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <span className="text-gold text-[10px] tracking-[0.25em] uppercase font-bold min-w-[170px] flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold/60" /> Ceremony:
              </span>
              <div className="flex flex-wrap gap-2">
                {EVENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedEvent(cat)}
                    className={`text-[10px] font-semibold tracking-[0.18em] uppercase px-4 py-2.5 transition-all duration-300 border rounded-lg ${
                      selectedEvent === cat
                        ? "bg-gold text-navy border-gold shadow-[0_0_15px_rgba(229,217,205,0.25)] scale-[1.02]"
                        : "border-white/10 text-white/50 hover:border-gold/30 hover:text-white"
                    }`}
                  >
                    {cat === 'All' ? 'All Events' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro horizontal separator */}
            <div className="h-px bg-white/5" />

            {/* Filter 2: Makeup Artistry Style */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <span className="text-gold text-[10px] tracking-[0.25em] uppercase font-bold min-w-[170px] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold/60" /> Artistry Style:
              </span>
              <div className="flex flex-wrap gap-2">
                {STYLE_CATEGORIES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`text-[10px] font-semibold tracking-[0.18em] uppercase px-4 py-2.5 transition-all duration-300 border rounded-lg ${
                      selectedStyle === style
                        ? "bg-gold text-navy border-gold shadow-[0_0_15px_rgba(229,217,205,0.25)] scale-[1.02]"
                        : "border-white/10 text-white/50 hover:border-gold/30 hover:text-white"
                    }`}
                  >
                    {style === 'All' ? 'All Styles' : style}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid with layouts */}
          {displayedItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-12 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {displayedItems.map((item, i) => (
                  <PortfolioItem
                    key={`${item.src}-${i}`}
                    {...item}
                    index={i}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]"
            >
              <p className="text-white/40 text-base tracking-[0.1em] font-light mb-4">No matching looks found in the portfolio.</p>
              <button
                onClick={() => { setSelectedEvent('All'); setSelectedStyle('All'); }}
                className="text-gold text-xs font-semibold tracking-[0.18em] uppercase hover:underline"
              >
                Reset all filters
              </button>
            </motion.div>
          )}

          {showViewAll && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-16 flex items-center gap-6"
            >
              <div className="flex-1 h-px bg-white/10" />
              <Link
                href="/portfolio"
                className="shimmer-btn inline-flex border border-gold/40 hover:border-gold hover:bg-gold hover:text-navy text-gold text-[11px] tracking-[0.22em] uppercase px-10 py-4 transition-all duration-400 font-medium whitespace-nowrap"
              >
                View Full Portfolio →
              </Link>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={resolvedItems}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
