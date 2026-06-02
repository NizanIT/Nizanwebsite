'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube } from 'lucide-react';

const footerLinks = {
  Explore: [
    { label: 'About Nizan', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Masterclasses', href: '/masterclasses' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Services: [
    { label: 'Bridal Elegance', href: '/services' },
    { label: 'Event Glamour', href: '/services' },
    { label: 'Editorial & Fashion', href: '/portfolio' },
    { label: 'Skin Preparations', href: '/services' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/contact' },
    { label: 'Terms of Service', href: '/contact' },
    { label: 'Refund Policy', href: '/contact' },
  ],
};

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/nizanmakeovers' },
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/nizanmakeover' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@nizanmakeovers' },
];

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-gold/10 pt-20 pb-8">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <Image 
                src="/nizan_logo_white.png" 
                alt="Nizan Makeovers Logo"
                width={120}
                height={80}
                className="h-20 md:h-32 w-auto object-contain opacity-90"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-8">
              Follow our transformations on Instagram — masterclass announcements,
              behind-the-scenes, and stay updated with the latest looks, tips, and
              exclusive offers.
            </p>
            {/* Socials */}
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 border border-white/15 hover:border-gold flex items-center justify-center text-white/50 hover:text-gold transition-all duration-300 hover:shadow-[0_0_16px_rgba(229,217,205,0.2)]"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/45 hover:text-gold text-sm transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-3 h-px bg-gold/0 group-hover:bg-gold/60 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Gold divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-gold/40 text-xs">✦</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wide">
            © 2025 Nizan Makeovers. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Crafted with elegance &amp; passion ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
