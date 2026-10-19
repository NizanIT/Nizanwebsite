'use client';

import { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    name: 'Anjali Menon',
    role: 'Bridal Client',
    text: "Feeniya and her team made my wedding day truly magical. The airbrush makeup was flawless and lasted throughout the entire event. I felt like the best version of myself!",
    location: 'Kochi, Kerala',
    initial: 'AM',
  },
  {
    name: 'Sarah Joseph',
    role: 'Bridal Client',
    text: "The level of professionalism and artistry at Nizan Makeovers is unmatched. They understood exactly what I wanted for my Christian bridal look and executed it with perfection.",
    location: 'Dubai, UAE',
    initial: 'SJ',
  },
  {
    name: 'Priya Sharma',
    role: 'Celebrity Client',
    text: "Working with Feeniya for my editorial shoot was an incredible experience. Her eye for detail and ability to create a high-fashion look is why she's at the top of her game.",
    location: 'Mumbai, India',
    initial: 'PS',
  },
  {
    name: 'Nadia Al-Hassan',
    role: 'Bridal Client',
    text: "I flew in from Abu Dhabi specifically for Nizan Makeovers after seeing their work online. Every rupee was worth it — absolutely breathtaking bridal transformation.",
    location: 'Abu Dhabi, UAE',
    initial: 'NH',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [autoplay.current]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="testimonials" className="section-dark py-28 lg:py-40 relative overflow-hidden" ref={ref}>
      {/* Giant decorative quote */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none">
        <Quote
          className="absolute -top-8 -left-8 text-gold/5"
          style={{ width: 320, height: 320 }}
          strokeWidth={0.5}
        />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Editorial header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="text-gold text-[11px] font-medium tracking-[0.35em] uppercase mb-4 block"
            >
              Kind Words
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display font-light text-white leading-[1.0]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              What Our Brides
              <br />
              <span className="italic text-gold/80">Are Saying</span>
            </motion.h2>
          </div>

          {/* Arrow controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex gap-3 shrink-0"
          >
            <button
              onClick={scrollPrev}
              className="w-12 h-12 border border-white/20 hover:border-gold hover:bg-gold hover:text-navy text-white flex items-center justify-center transition-all duration-300 group"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 border border-white/20 hover:border-gold hover:bg-gold hover:text-navy text-white flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Embla carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex-none w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[calc(33.33%-16px)]"
              >
                <div className="bg-white/[0.03] border border-white/10 p-8 lg:p-10 h-full flex flex-col group hover:border-gold/30 hover:bg-white/[0.05] transition-all duration-500 relative">
                  {/* Quote icon */}
                  <Quote className="text-gold/40 mb-6 shrink-0" size={28} strokeWidth={1.5} />

                  <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 italic font-light flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    {/* Avatar initial */}
                    <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                      <span className="text-gold text-xs font-semibold tracking-wider">{t.initial}</span>
                    </div>
                    <div>
                      <p className="text-white font-display text-lg leading-none mb-1">{t.name}</p>
                      <p className="text-gold/60 text-[10px] tracking-widest uppercase">{t.role} — {t.location}</p>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold group-hover:w-full transition-all duration-700" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
