'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, X } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface MasterclassData {
  title: string;
  description: string;
  date_range: string;
  location: string;
  image_url: string;
  registration_url: string;
}

export default function MasterclassAnnouncement() {
  const [data, setData] = useState<MasterclassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchMasterclass = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: mc, error } = await supabase
          .from('masterclass')
          .select('*')
          .eq('status', 'active')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) console.error('Supabase error:', error);
        if (mc) {
          setData(mc);
          // Show popup after 1.5 seconds delay only when an active announcement exists
          setTimeout(() => setIsOpen(true), 1500);
        }
      } catch (err) {
        console.error('Error fetching masterclass:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterclass();
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (loading || !isOpen || !data) return null;

  const displayData = {
    ...data,
    image_url: data.image_url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-navy/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-navy/95 border border-gold/30 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row max-h-full"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-gold text-navy rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300 shadow-xl"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Left Column: Visual (Hidden on mobile or top on mobile) */}
            <div className="relative w-full lg:w-2/5 aspect-[4/5] lg:aspect-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-gold/20">
              <Image
                src={displayData.image_url}
                alt={displayData.title || 'Masterclass Poster'}
                fill
                className="object-cover transition-transform duration-[3s] hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent lg:hidden pointer-events-none" />
            </div>

            {/* Right Column: Content */}
            <div className="w-full lg:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-gold" />
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-bold">
                  Limited Opportunity
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl text-white font-light leading-tight mb-6">
                {displayData.title ? (
                  <>
                    {displayData.title.split(' ').slice(0, 2).join(' ')} <br />
                    <span className="italic gradient-text">{displayData.title.split(' ').slice(2).join(' ')}</span>
                  </>
                ) : (
                  'Upcoming Masterclass'
                )}
              </h2>

              <p className="text-white/60 text-base md:text-lg mb-8 leading-relaxed">
                {displayData.description}
              </p>

              {/* Detail Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Calendar, text: displayData.date_range },
                  { icon: MapPin, text: displayData.location },
                  { icon: Users, text: 'Limited Batch' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                      <item.icon size={16} className="text-gold" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={displayData.registration_url || WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shimmer-btn inline-flex items-center justify-center gap-3 bg-gold text-navy px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-400 hover:shadow-[0_0_30px_rgba(229,217,205,0.4)]"
                >
                  Register Now
                  <ArrowRight size={16} />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-0 right-0 w-[200%] h-[1px] bg-gold rotate-45 translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
