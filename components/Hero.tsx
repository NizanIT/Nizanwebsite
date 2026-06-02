'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

const HERO_VIDEO_SRC = '/video-swap_2026-04-07_03-23-46.mp4';
const HERO_POSTER_SRC = '/frames/ezgif-frame-001.jpg?v=3';

interface HeroProps {
  onBook: () => void;
}

export default function Hero({ onBook }: HeroProps) {
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative"
      style={{ height: '100vh', background: '#060f22' }}
    >
      <div className="relative h-screen overflow-hidden">

        <motion.div
          className="absolute inset-0 z-0 bg-navy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {isMobile ? (
            <Image
              src={HERO_POSTER_SRC}
              alt="Bridal makeup cinematic portrait"
              fill
              priority
              className="object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={HERO_POSTER_SRC}
            >

              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          )}
        </motion.div>



        {/* Dark gradient overlay — left-heavy navy fade */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(6,15,34,0.94) 0%, rgba(11,27,59,0.72) 45%, rgba(11,27,59,0.18) 100%)',
          }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(6,15,34,0.8) 0%, transparent 100%)',
          }}
        />

        {/* Watermark cover — soft corner blend */}
        <div
          className="absolute bottom-0 right-0 z-[2] pointer-events-none"
          style={{
            width: '200px',
            height: '100px',
            background: 'radial-gradient(ellipse at bottom right, rgba(6,15,34,1) 0%, rgba(6,15,34,0.85) 40%, transparent 75%)',
          }}
        />

        {/* Antigravity particle system — z above overlay */}
        <ParticleCanvas isMobile={isMobile} />

        {/* ── Hero Content ─────────────────────────────── */}
        <div className="relative z-[3] h-full flex items-center pt-24 md:pt-32">

          <div className="max-w-[1320px] mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-2xl">

              {/* Eyebrow label */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-px bg-gold" />
                <span className="text-gold text-[11px] font-medium tracking-[0.35em] uppercase">
                  Luxury bridal makeup artist
                </span>
                <div className="w-8 h-px bg-gold" />
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-light text-white leading-[1.05] tracking-tight mb-8"
                style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}
              >
                <span className="relative italic">
                  Turning your dream
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 2.3, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 -bottom-1 h-[2px] w-full bg-gold block origin-left"
                  />
                </span>
                <br />
                <span
                  className="font-display"
                  style={{
                    background: 'linear-gradient(120deg, #d0bfae 0%, #f0ebe4 50%, #e5d9cd 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Bridal look into reality
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
                className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl"
              >
                Nizan Makeovers is one of Kerala’s leading luxury bridal makeup studios, founded by Feeniya Nizan, a renowned bridal makeup artist in India. Known for expert Airbrush and Signature Makeup, the studio has beautifully transformed over 2,000 brides across India and the UAE.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.7, ease: 'easeOut' }}
                className="flex flex-wrap gap-4 mb-14"
              >
                <button
                  id="hero-book-btn"
                  onClick={onBook}
                  className="shimmer-btn group relative bg-gold text-navy text-[11px] font-bold tracking-[0.22em] uppercase px-9 py-4 transition-all duration-400 hover:bg-gold-light hover:shadow-[0_0_40px_rgba(229,217,205,0.5)] pulse-gold"
                  style={{ borderRadius: 0 }}
                >
                  Book Now
                </button>
                <button
                  onClick={() => scrollTo('services')}
                  className="group border border-white/25 hover:border-gold/70 text-white/80 hover:text-gold text-[11px] font-medium tracking-[0.22em] uppercase px-9 py-4 transition-all duration-400 backdrop-blur-sm hover:bg-gold/5"
                  style={{ borderRadius: 0 }}
                >
                  Our Services
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.9 }}
                className="flex gap-8 pt-8 border-t border-white/10"
              >
                {[
                  { n: '2000+', label: 'Bridal Transformations' },
                  { n: '8+', label: 'Years Expertise' },
                  { n: '10+', label: 'Masterclasses' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl md:text-3xl font-light text-gold leading-none mb-1">
                      {s.n}
                    </div>
                    <div className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
          />
          <span className="text-[9px] tracking-[0.35em] text-gold/50 uppercase">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
