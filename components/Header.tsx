'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About Us', href: '#about', pageHref: '/' },
  { label: 'Who We Are', href: '#who-we-are', pageHref: '/' },
  { label: 'Services', href: '#services', pageHref: '/' },
  { label: 'Our Works', href: '#portfolio', pageHref: '/' },
  { label: 'Masterclasses', href: '/masterclasses', pageHref: '/masterclasses', isPage: true },
  { label: 'Our Team', href: '#team', pageHref: '/' },
  { label: 'Testimonials', href: '#testimonials', pageHref: '/' },
  { label: 'Contact', href: '#contact', pageHref: '/' },
];



interface HeaderProps {
  onBook: () => void;
}

export default function Header({ onBook }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBooking = () => {
    onBook();
    setMobileOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (pathname !== '/') {
      setMobileOpen(false);
      return;
    }

    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy/95 backdrop-blur-xl border-b border-gold/10 shadow-[0_4px_40px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-2 flex items-center justify-between">
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <Link href="/">
            <Image 
              src="/nizan_logo_white.png" 
              alt="Nizan Makeovers Logo"
              width={200}
              height={100}
              className={`transition-all duration-500 object-contain w-auto h-auto ${
                scrolled ? 'max-h-14 md:max-h-16' : 'max-h-16 md:max-h-20'
              }`}
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.isPage ? link.href : (pathname === '/' ? link.href : link.pageHref)}
              onClick={(e) => {
                if (!link.isPage && pathname === '/') {
                  e.preventDefault();
                  handleNavClick(link.href);
                } else {
                  setMobileOpen(false);
                }
              }}
              className={`text-[11px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 relative group whitespace-nowrap ${
                pathname === '/masterclasses' && link.isPage
                  ? 'text-gold'
                  : 'text-white/70 hover:text-gold'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Book CTA */}
        <div className="flex items-center gap-4">
          <button
            id="header-book-btn"
            onClick={handleBooking}
            className="shimmer-btn hidden lg:inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-[11px] font-semibold tracking-[0.1em] uppercase px-5 py-2.5 transition-all duration-300 hover:shadow-[0_0_24px_rgba(229,217,205,0.4)]"
            style={{ borderRadius: 0 }}
          >
            Book Now
          </button>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white/80 hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-navy/98 backdrop-blur-xl border-t border-gold/10"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-sm font-medium tracking-[0.15em] uppercase text-white/70 hover:text-gold transition-colors"
                >
                  <Link
                    href={link.isPage ? link.href : (pathname === '/' ? link.href : link.pageHref)}
                    onClick={(e) => {
                      if (!link.isPage && pathname === '/') {
                        e.preventDefault();
                        handleNavClick(link.href);
                      } else {
                        setMobileOpen(false);
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <button
                onClick={handleBooking}
                className="shimmer-btn mt-2 bg-gold text-navy text-xs font-semibold tracking-[0.15em] uppercase px-6 py-3 text-center"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
