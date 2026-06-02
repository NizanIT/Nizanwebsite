'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

const team = [
  {
    name: 'Feeniya Nizan',
    role: 'Founder & CEO',
    speciality: 'Lead Bridal Artist | Airbrush | Educator',
    bio: "One of India's most revered celebrity makeup artists with 10+ years of mastery and 2,000+ bridal transformations. Conducted 12 prestigious masterclasses across Kerala, Tamil Nadu & Dubai. Her artistry has graced celebrities, public figures, and thousands of cherished brides across South Asia and the UAE.",
    initials: 'FN',
    accent: '#e5d9cd',
    tag: 'Founder',
  },
  {
    name: 'Jasim Rasheed',
    role: 'Co-Founder & CFO',
    speciality: 'Strategy | Finance | Brand Architecture',
    bio: 'The strategic and financial architect of Nizan Makeovers. With sharp business acumen and a deep understanding of the luxury service landscape, Jasim has shaped Nizan Makeovers into the premium, globally reaching brand it is today.',
    initials: 'JR',
    accent: '#e5d9cd',
    tag: 'Co-Founder',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="team" className="section-dark py-28 lg:py-36 relative overflow-hidden" ref={ref}>

      {/* Ambient background orb */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(229,217,205,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-4 block"
          >
            The Artists Behind the Artistry
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl md:text-5xl font-light text-white mb-5"
          >
            Meet Our{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(120deg, #d0bfae 0%, #f0ebe4 50%, #e5d9cd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Team
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed"
          >
            A passionate team of skilled artists dedicated to crafting unforgettable looks for your most cherished moments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-4 max-w-xs mx-auto mt-6"
          >
            <div className="flex-1 h-px bg-gold/20" />
            <span className="text-gold/40 text-sm">✦</span>
            <div className="flex-1 h-px bg-gold/20" />
          </motion.div>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{
                y: -10,
                boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(229,217,205,0.35)',
              }}
              className="relative group bg-white/[0.04] border border-white/10 p-10 flex flex-col items-center text-center transition-all duration-400 cursor-pointer"
            >
              {/* Tag badge */}
              {member.tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 whitespace-nowrap">
                  {member.tag}
                </div>
              )}

              {/* Avatar initials circle */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-2xl font-display font-semibold text-navy transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #d0bfae 0%, #f0ebe4 100%)' }}
              >
                {member.initials}
              </div>

              {/* Gold divider line */}
              <div className="w-8 h-px bg-gold/50 mx-auto mb-6 transition-all duration-300 group-hover:w-16 group-hover:bg-gold" />

              {/* Name & role */}
              <h3 className="font-display text-xl font-medium text-white mb-1">{member.name}</h3>
              <p className="text-gold text-[11px] tracking-[0.22em] uppercase mb-3">{member.role}</p>
              <p className="text-white/35 text-[10px] tracking-[0.18em] uppercase mb-5 border border-white/10 px-3 py-1.5">
                {member.speciality}
              </p>

              {/* Bio */}
              <p className="text-white/55 text-sm leading-relaxed flex-1">{member.bio}</p>

              {/* Bottom gold accent */}
              <div className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-all duration-300 group-hover:via-gold/60" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
