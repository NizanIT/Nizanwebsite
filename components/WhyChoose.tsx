'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Gem, Heart, Crown, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: "India's Top Bridal Artist",
    description:
      "Recognised as India's top bridal makeup artist with an international presence in the UAE. When you book Nizan, you secure access to one of the finest artistic minds in the country.",
  },
  {
    icon: Gem,
    title: 'Exclusively Luxury Products',
    description:
      "Every product is sourced from the world's most prestigious beauty houses — premium, internationally acclaimed, dermatologically trusted. Only the absolute finest graces your face.",
  },
  {
    icon: Heart,
    title: 'Certified Trainer & Expert',
    description:
      "Feeniya has conducted 10+ prestigious masterclasses across Kerala, Tamil Nadu & Dubai. The depth of a master educator's knowledge is channelled into every single bridal look.",
  },
  {
    icon: Crown,
    title: '2000+ Transformations',
    description:
      'Over two thousand brides have sat in our chair and left feeling extraordinary. A decade of trust, precision, and radiant confidence. That is not a number — that is a legacy.',
  },
  {
    icon: Sparkles,
    title: 'Masterclass · Celebrity · Bridal',
    description:
      "Celebrity shoots, masterclass training, and bridal mastery — Feeniya's multi-dimensional expertise brings a rare, extraordinary depth to every look she creates.",
  },
];

export default function WhyChoose() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="who-we-are" className="section-cream py-28 lg:py-36" ref={ref}>
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-gold text-xs font-medium tracking-[0.3em] uppercase mb-4 block"
          >
            Our Identity
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-4xl md:text-5xl font-light text-navy mb-5"
          >
            Who We <span className="italic">Are</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-navy/60 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Uncompromising quality and unparalleled expertise in every
            brushstroke, every look, every moment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-6xl mx-auto">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`text-center group ${i >= 3 ? 'lg:col-span-1 lg:max-w-[340px] lg:mx-auto' : ''}`}
              >
                {/* Icon container */}
                <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center">
                  {/* Rotating ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-gold/30"
                  />
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
                    <Icon size={28} className="text-gold" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Gold dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-gold mx-auto mb-5" />

                <h3 className="font-display text-xl font-medium text-navy mb-3">
                  {feat.title}
                </h3>
                <p className="text-navy/55 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Separator ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex items-center gap-4 mt-20"
        >
          <div className="flex-1 h-px bg-navy/10" />
          <span className="text-gold text-xl">✦</span>
          <div className="flex-1 h-px bg-navy/10" />
        </motion.div>
      </div>
    </section>
  );
}
