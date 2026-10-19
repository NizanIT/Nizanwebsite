import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: "Contact Nizan Makeovers | Bridal Makeup Booking",
  description:
    "Contact Nizan Makeovers for bridal makeup bookings, consultations, and personalised beauty planning across Kerala, India, and UAE.",
  openGraph: {
    title: "Contact Nizan Makeovers | Bridal Makeup Booking",
    description: "Book a consultation with Kerala's premier bridal makeup artist.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Nizan Makeovers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Nizan Makeovers | Bridal Makeup Booking",
    description: "Book a consultation with Kerala's premier bridal makeup artist.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact Nizan"
        title="Book Your Bridal Experience"
        description="Reach out for bridal bookings, makeover consultations, and personalised beauty planning with Nizan Makeovers."
      />
      <Contact />
    </PageShell>
  );
}
