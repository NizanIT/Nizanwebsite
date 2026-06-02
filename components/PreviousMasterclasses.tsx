'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, X, GraduationCap, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Masterclass {
  id: string;
  title: string;
  description: string;
  date_range: string;
  location: string;
  status: string;
  image_url: string;
  registration_url: string;
  created_at?: string;
}

const FALLBACK_MASTERCLASSES: Masterclass[] = [
  {
    id: '1',
    title: 'Advanced Bridal Masterclass 2024',
    description:
      'An immersive, hands-on bridal transformation session covering HD makeup, skin prep, and long-lasting techniques used on real brides. Attendees gained insider knowledge on luxury product choices and professional draping.',
    date_range: 'November 10–12, 2024',
    location: 'Nizan Studio, Kochi',
    status: 'completed',
    image_url:
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop',
    registration_url: '#',
  },
  {
    id: '2',
    title: 'Editorial & Fashion Makeup Masterclass',
    description:
      'A creative exploration of avant-garde editorial looks, bold runway aesthetics, and the art of storytelling through makeup. Participants left with a refined editorial portfolio and a deeper understanding of light and colour theory.',
    date_range: 'August 3–5, 2024',
    location: 'Grand Studio, Kozhikode',
    status: 'completed',
    image_url:
      'https://images.unsplash.com/photo-1487412947147-5cebf100d293?q=80&w=2071&auto=format&fit=crop',
    registration_url: '#',
  },
  {
    id: '3',
    title: 'Luxury Skin Prep & Bridal Artistry',
    description:
      'Focused on flawless skin preparation, this masterclass covered facials, primers, and layering techniques that ensure bridal looks last beautifully through an entire wedding day.',
    date_range: 'March 22–24, 2024',
    location: 'Nizan Studio, Thrissur',
    status: 'completed',
    image_url:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop',
    registration_url: '#',
  },
];

export default function PreviousMasterclasses() {
  const [items, setItems] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Masterclass | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed'>('all');

  useEffect(() => {
    const fetchAll = async () => {
      if (!supabase) {
        setItems(FALLBACK_MASTERCLASSES);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('masterclass')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(FALLBACK_MASTERCLASSES);
        }
      } catch {
        setItems(FALLBACK_MASTERCLASSES);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selected]);

  const displayed = filter === 'all' ? items : items.filter((i) => i.status === 'completed');

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
  };

  if (loading) {
    return (
      <section className="section-dark py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-white/5 animate-pulse border border-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-dark py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">

          {/* Section Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-10 mb-16"
          >
            {[
              { icon: GraduationCap, value: `${items.length}+`, label: 'Masterclasses Held' },
              { icon: Users, value: '500+', label: 'Artists Trained' },
              { icon: Star, value: '100%', label: 'Satisfaction Rate' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                  <Icon size={22} className="text-gold" />
                </div>
                <span className="font-display text-3xl text-white font-light">{value}</span>
                <span className="text-white/40 text-[10px] tracking-[0.25em] uppercase font-bold">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-14"
          >
            {(['all', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-[10px] tracking-[0.28em] uppercase font-bold px-6 py-2.5 border transition-all duration-300 ${
                  filter === tab
                    ? 'bg-gold text-navy border-gold'
                    : 'text-white/40 border-white/15 hover:text-white hover:border-white/40'
                }`}
              >
                {tab === 'all' ? 'All Classes' : 'Completed'}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          {displayed.length === 0 ? (
            <div className="text-center py-20 text-white/30 text-sm tracking-wider">
              No masterclasses found.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayed.map((mc) => (
                <motion.article
                  key={mc.id}
                  variants={cardVariants}
                  onClick={() => setSelected(mc)}
                  className="group relative cursor-pointer overflow-hidden border border-white/8 hover:border-gold/35 transition-all duration-500 bg-white/[0.02]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={mc.image_url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop'}
                      alt={mc.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

                    {/* Status badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`text-[9px] tracking-[0.3em] uppercase font-black px-3 py-1.5 ${
                          mc.status === 'active'
                            ? 'bg-gold text-navy'
                            : 'bg-white/10 backdrop-blur-sm text-white/70 border border-white/20'
                        }`}
                      >
                        {mc.status === 'active' ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>

                    {/* Bottom content overlapping image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-xl text-white font-light leading-snug mb-3">
                        {mc.title}
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {mc.date_range && (
                          <div className="flex items-center gap-2 text-white/60">
                            <Calendar size={13} className="text-gold flex-shrink-0" />
                            <span className="text-xs">{mc.date_range}</span>
                          </div>
                        )}
                        {mc.location && (
                          <div className="flex items-center gap-2 text-white/60">
                            <MapPin size={13} className="text-gold flex-shrink-0" />
                            <span className="text-xs">{mc.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover View More indicator */}
                  <div className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="border border-gold/60 text-gold text-[10px] tracking-[0.3em] uppercase font-bold px-6 py-3">
                      View Details
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-navy/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-4xl bg-navy border border-gold/25 shadow-[0_0_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-gold text-navy rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300 shadow-xl"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Image */}
              <div className="relative w-full lg:w-2/5 aspect-[4/5] lg:aspect-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-gold/15 flex-shrink-0">
                <Image
                  src={selected.image_url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop'}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent lg:hidden" />
              </div>

              {/* Content */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-px bg-gold" />
                  <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-bold">
                    Past Masterclass
                  </span>
                </div>

                <h2 className="font-display text-2xl md:text-4xl text-white font-light leading-tight mb-5">
                  {selected.title}
                </h2>

                <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8">
                  {selected.description}
                </p>

                <div className="space-y-3 mb-10">
                  {selected.date_range && (
                    <div className="flex items-center gap-4 text-white/70">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Calendar size={15} className="text-gold" />
                      </div>
                      <span className="text-sm">{selected.date_range}</span>
                    </div>
                  )}
                  {selected.location && (
                    <div className="flex items-center gap-4 text-white/70">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={15} className="text-gold" />
                      </div>
                      <span className="text-sm">{selected.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-white/70">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Users size={15} className="text-gold" />
                    </div>
                    <span className="text-sm">Limited Batch · Hands-On Training</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/8">
                  <p className="text-white/35 text-xs tracking-wider leading-relaxed">
                    Interested in future masterclasses? Follow us on Instagram
                    @nizanmakeovers or contact us to be notified when registration opens.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
