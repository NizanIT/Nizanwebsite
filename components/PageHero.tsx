'use client';

import { motion } from 'framer-motion';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="section-dark pt-36 md:pt-40 pb-16 md:pb-20 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top, rgba(229,217,205,0.08) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 text-center relative z-[1]">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-4 block"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65 }}
          className="font-display text-4xl md:text-6xl font-light text-white mb-5"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.65 }}
          className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
