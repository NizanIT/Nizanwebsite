'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Quote, ImageIcon, MessageSquareQuote } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PortfolioCard } from './Portfolio';

/* ─────────────────────────────────────────────
   PORTFOLIO DATA & HELPERS
───────────────────────────────────────────── */

const layoutPresets: Array<Pick<PortfolioCard, 'gridClass' | 'aspect' | 'parallaxDir'>> = [
  { gridClass: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', parallaxDir: 1 },
  { gridClass: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]', parallaxDir: -1 },
  { gridClass: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]', parallaxDir: 1 },
  { gridClass: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', parallaxDir: -1 },
];

function PortfolioItem({ src, alt, title, category, gridClass, aspect, parallaxDir, index }: PortfolioCard & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [parallaxDir * 40, parallaxDir * -40]);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={`${gridClass} relative overflow-hidden group cursor-pointer`}
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: index * 0.13, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }}
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
            background: 'linear-gradient(to top, rgba(6,15,34,0.95) 0%, rgba(11,27,59,0.3) 55%, transparent 100%)',
            opacity: 0.7,
          }}
        />
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500" />

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
          <span className="text-gold text-[10px] tracking-[0.28em] uppercase font-semibold block mb-2">{category}</span>
          <h3 className="font-display text-xl md:text-2xl text-white font-light leading-tight">{title}</h3>
        </div>

        <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-gold opacity-0 group-hover:opacity-100 transition-all duration-400 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-gold opacity-0 group-hover:opacity-100 transition-all duration-400 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIAL DATA
───────────────────────────────────────────── */

const testimonials = [
  {
    name: 'Anjali Menon',
    role: 'Bridal Client',
    text: 'Feeniya and her team made my wedding day truly magical. The airbrush makeup was flawless and lasted throughout the entire event. I felt like the best version of myself!',
    location: 'Kochi, Kerala',
  },
  {
    name: 'Sarah Joseph',
    role: 'Bridal Client',
    text: 'The level of professionalism and artistry at Nizan Makeovers is unmatched. They understood exactly what I wanted for my Christian bridal look and executed it with perfection.',
    location: 'Dubai, UAE',
  },
  {
    name: 'Priya Sharma',
    role: 'Celebrity Client',
    text: "Working with Feeniya for my editorial shoot was an incredible experience. Her eye for detail and ability to create a high-fashion look is why she's at the top of her game.",
    location: 'Mumbai, India',
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

type Tab = 'portfolio' | 'testimonials';

export default function ShowcaseTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioCard[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      try {
        const { data: list, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('status', 'active')
          .order('sort_order', { ascending: true });

        if (error) throw error;

        const mapped = (list || []).slice(0, 4).map(
          (item: { image_url: string; alt_text?: string; title: string; category?: string }, index: number) => {
            const preset = layoutPresets[index % layoutPresets.length];
            return {
              src: item.image_url,
              alt: item.alt_text?.trim() || item.title,
              title: item.title,
              category: item.category?.trim() || 'Portfolio',
              ...preset,
            };
          }
        );

        setPortfolioItems(mapped);
      } catch {
        setPortfolioItems([]);
      }
    };
    load();
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'portfolio', label: 'Our Works', icon: ImageIcon },
    { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  ];

  return (
    <section
      id="portfolio"
      className="section-dark py-28 lg:py-36 relative overflow-hidden"
      ref={ref}
    >
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(229,217,205,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-4 block"
          >
            Craft & Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="font-display text-4xl md:text-5xl font-light text-white mb-3"
          >
            {activeTab === 'portfolio' ? (
              <>The <span className="italic">Portfolio</span></>
            ) : (
              <>Client <span className="italic">Stories</span></>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="text-white/45 text-base max-w-lg mx-auto leading-relaxed"
          >
            {activeTab === 'portfolio'
              ? 'A curated showcase of breathtaking transformations — each one a unique story of artistry, culture, and grace.'
              : 'Real words from real brides and clients who trusted us with their most cherished moments.'}
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-14"
        >
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex items-center gap-2.5 px-7 py-3 text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-300 ${
                activeTab === key
                  ? 'bg-gold text-navy'
                  : 'border border-white/15 text-white/45 hover:text-white hover:border-white/40'
              }`}
            >
              <Icon size={14} />
              {label}
              {activeTab === key && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-gold -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">

          {/* ── PORTFOLIO TAB ── */}
          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {portfolioItems.length > 0 ? (
                <div className="grid grid-cols-12 gap-4 md:gap-5">
                  {portfolioItems.map((item, i) => (
                    <PortfolioItem key={`${item.src}-${i}`} {...item} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/25 text-sm py-20 tracking-wider">
                  Portfolio images will appear here once configured.
                </p>
              )}

              <div className="text-center mt-14">
                <Link
                  href="/portfolio"
                  className="shimmer-btn inline-flex border border-gold/40 hover:border-gold hover:bg-gold hover:text-navy text-gold text-[11px] tracking-[0.22em] uppercase px-10 py-4 transition-all duration-400 font-medium"
                >
                  View Full Portfolio
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── TESTIMONIALS TAB ── */}
          {activeTab === 'testimonials' && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {/* Giant decorative quote */}
              <div className="relative">
                <div className="absolute -top-4 left-0 text-gold/10 pointer-events-none select-none">
                  <Quote size={160} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
                  {testimonials.map((t, i) => (
                    <motion.div
                      key={t.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                      className="bg-white/[0.03] border border-white/10 p-8 lg:p-10 relative group hover:bg-white/[0.06] transition-all duration-500 flex flex-col"
                    >
                      <Quote className="text-gold/30 mb-6 group-hover:text-gold/55 transition-colors flex-shrink-0" size={28} />
                      <p className="text-white/70 text-lg leading-relaxed mb-8 italic font-light flex-1">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <div>
                        <p className="text-white font-display text-xl mb-1">{t.name}</p>
                        <p className="text-gold text-[10px] tracking-widest uppercase">
                          {t.role} — {t.location}
                        </p>
                      </div>

                      {/* Animated gold bottom border */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-700" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
