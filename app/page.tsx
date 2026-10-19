'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MarqueeTicker from '@/components/MarqueeTicker';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { WHATSAPP_URL } from '@/lib/constants';


// Lazy-load below-fold sections
const MasterclassAnnouncement = dynamic(() => import('@/components/MasterclassAnnouncement'), { ssr: false });
const About = dynamic(() => import('@/components/About'), { ssr: false });
const Services = dynamic(() => import('@/components/Services'), { ssr: false });
const Portfolio = dynamic(() => import('@/components/Portfolio'), { ssr: false });
const Team = dynamic(() => import('@/components/Team'), { ssr: false });
const WhyChoose = dynamic(() => import('@/components/WhyChoose'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });
const CTA = dynamic(() => import('@/components/CTA'), { ssr: false });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: false });

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = () => window.open(WHATSAPP_URL, '_blank');

  const closeBooking = () => setIsBookingOpen(false);

  return (
    <main className={`min-h-screen ${isBookingOpen ? 'overflow-hidden' : ''}`}>
      <Header onBook={openBooking} />
      <Hero onBook={openBooking} />
      <MarqueeTicker />

      <MasterclassAnnouncement />
      
      <About />
      <WhyChoose />
      <Services />
      <Portfolio maxItems={4} />
      <Team />
      <Testimonials />

      {/* <Branches /> */}

      <CTA onBook={openBooking} />
      <Contact />
      <Footer />

      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
    </main>
  );
}

