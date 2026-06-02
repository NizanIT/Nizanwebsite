'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
interface CTAProps {
  onBook: () => void;
}

export default function CTA({ onBook }: CTAProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden" ref={ref}>
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/frames/ezgif-frame-080.jpg?v=2"
          alt="Luxury bridal background"
          fill
          className="object-cover object-top scale-[1.12]"
        />
        <div className="absolute inset-0 bg-navy/85" />
      </div>

      {/* Gold particle-like decorative SVG */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-gold/40"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-[2] max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <Image 
            src="/nizan_logo_white.png" 
            alt="Nizan Makeovers Logo"
            width={120}
            height={80}
            className="h-20 lg:h-28 w-auto object-contain"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-gold text-xs font-medium tracking-[0.3em] uppercase mb-6 block"
        >
          Your Most Beautiful Moment Awaits
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-6xl font-light text-white mb-8 leading-tight"
        >
          Begin Your{' '}
          <span className="italic gradient-text">Transformation</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-white/65 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Book your consultation with a bridal makeup artist and experience premium bridal makeup services with the best makeup artist in Kerala.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <button
            id="cta-book-btn"
            onClick={onBook}
            className="shimmer-btn pulse-gold bg-gold hover:bg-gold-light text-navy text-sm font-semibold tracking-[0.2em] uppercase px-12 py-5 transition-all duration-400 hover:shadow-[0_0_50px_rgba(229,217,205,0.5)]"
            style={{ borderRadius: 0 }}
          >
            Book Your Makeover Today
          </button>
        </motion.div>

        {/* Ornamental line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-4 mt-16 max-w-xs mx-auto"
        >
          <div className="flex-1 h-px bg-gold/30" />
          <span className="text-gold/60 text-sm">✦</span>
          <div className="flex-1 h-px bg-gold/30" />
        </motion.div>
      </div>
    </section>
  );
}
