'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { postToErp } from '@/lib/erp';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await postToErp({
        path: '/api/leads/public',
        body: {
          ...formData,
          source: 'website-contact',
        },
      });

      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: '',
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Something went wrong'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  });

  const inputClass =
    'w-full bg-white/5 border border-white/10 focus:border-gold/60 text-white placeholder-white/30 text-sm px-5 py-4 outline-none transition-colors duration-300';

  return (
    <section
      id="contact"
      className="section-dark py-28 lg:py-36 relative overflow-hidden"
      ref={ref}
    >
      {/* Decorative gold orb */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(229,217,205,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            {...fadeUp(0)}
            className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-4 block"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            {...fadeUp(0.1)}
            className="font-display text-4xl md:text-5xl font-light text-white mb-5"
          >
            Contact Us
          </motion.h2>
          <motion.p
            {...fadeUp(0.2)}
            className="text-white/50 text-lg max-w-lg mx-auto leading-relaxed"
          >
            Have a question or ready to book? Reach out and we&apos;ll get back to
            you promptly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — contact info */}
          <motion.div {...fadeUp(0.25)} className="space-y-10">
            {[
              {
                icon: '📍',
                label: 'Studio Location',
                value: 'Available on request — home visits warmly welcomed India · UAE · Malaysia',
              },
              {
                icon: '📞',
                label: 'Phone / WhatsApp',
                value: '+91 97465 14181',
              },
              {
                icon: '✉️',
                label: 'Email',
                value: 'nizanmakeovers@gmail.com',
              },
              {
                icon: '🕐',
                label: 'Working Hours',
                value: 'Always Open',
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-5 items-start">
                <div className="w-11 h-11 border border-gold/30 flex items-center justify-center text-lg shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-1">
                    {item.label}
                  </p>
                  <p className="text-white/80 text-base">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Ornamental divider */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex-1 h-px bg-gold/20" />
              <span className="text-gold/40 text-xs">✦</span>
              <div className="flex-1 h-px bg-gold/20" />
            </div>

            <p className="text-white/35 text-sm leading-relaxed">
              Follow our transformations on Instagram and stay updated with the
              latest looks, tips, and exclusive offers.
            </p>
          </motion.div>

          {/* Right — form */}
          <motion.div {...fadeUp(0.35)}>
            {submitted ? (
              <div className="border border-gold/30 p-12 text-center">
                <div className="text-gold text-4xl mb-4">✦</div>
                <h3 className="font-display text-2xl text-white font-light mb-3">
                  Message Received
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Thank you for reaching out. We&apos;ll be in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone / WhatsApp"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />

                <select
                  id="contact-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>
                    Select a Service
                  </option>
                  {[
                    'Bridal Makeover',
                    'Party Makeover',
                    'Editorial / Fashion',
                    'Engagement Look',
                    'Other',
                  ].map((s) => (
                    <option key={s} value={s} className="bg-navy text-white">
                      {s}
                    </option>
                  ))}
                </select>

                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your event or any questions…"
                  value={formData.message}
                  onChange={handleChange}
                  className={inputClass}
                />

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="shimmer-btn w-full bg-gold hover:bg-gold-light text-navy text-[11px] font-bold tracking-[0.22em] uppercase py-4 transition-all duration-400 hover:shadow-[0_0_40px_rgba(229,217,205,0.4)]"
                  style={{ borderRadius: 0 }}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                {error ? (
                  <p className="text-red-300 text-sm" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
