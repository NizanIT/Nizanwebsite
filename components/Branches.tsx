'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';

const branches = [
  {
    name: 'Team N Makeovers',
    city: 'Calicut',
    note: 'Branch photo coming soon',
  },
  {
    name: 'Team N Cochin',
    city: 'Cochin',
    note: 'Branch photo coming soon',
  },
  {
    name: 'Team N Chennai',
    city: 'Chennai',
    note: 'Branch photo coming soon',
  },
  {
    name: 'Team N Bangalore',
    city: 'Bangalore',
    note: 'Branch photo coming soon',
  },
];

export default function Branches() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="branches" className="section-cream py-28 lg:py-36 relative overflow-hidden" ref={ref}>
      <div
        className="absolute -left-28 top-10 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229,217,205,0.08) 0%, transparent 72%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-4 block"
          >
            Our Branches
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="font-display text-4xl md:text-5xl font-light text-navy mb-6"
          >
            Expanding Bridal Artistry Across <span className="italic gradient-text">India</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.65 }}
            className="text-navy/70 text-lg leading-relaxed"
          >
            Nizan Makeovers proudly expands its bridal artistry across India with expert teams
            dedicated to delivering flawless and luxury bridal makeup services.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.18 + index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white border border-navy/10 p-6 md:p-8 shadow-[0_20px_60px_rgba(11,27,59,0.06)]"
            >
              <div className="aspect-[4/3] border border-dashed border-gold/30 bg-gradient-to-br from-navy/[0.02] via-gold/[0.04] to-white flex items-center justify-center text-center px-6">
                <div>
                  <div className="mx-auto mb-5 w-14 h-14 rounded-full border border-gold/25 bg-gold/10 flex items-center justify-center">
                    <MapPin size={24} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <p className="text-navy/55 text-[11px] tracking-[0.28em] uppercase mb-2">
                    Add Photo
                  </p>
                  <p className="text-navy/45 text-sm">{branch.note}</p>
                </div>
              </div>

              <div className="pt-6">
                <div className="w-10 h-px bg-gold mb-4 transition-all duration-300 group-hover:w-20" />
                <h3 className="font-display text-2xl md:text-3xl font-medium text-navy mb-2">
                  {branch.name}
                </h3>
                <p className="text-gold text-[11px] tracking-[0.25em] uppercase">{branch.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
