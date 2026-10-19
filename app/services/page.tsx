import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Services from '@/components/Services';

export const metadata: Metadata = {
  title: 'Bridal & Airbrush Makeup Services | Nizan Makeovers Kerala',
  description:
    'Professional bridal makeup, airbrush makeup, and signature beauty services for weddings, engagements, and special events across Kerala and India.',
  openGraph: {
    title: 'Bridal & Airbrush Makeup Services | Nizan Makeovers',
    description: 'Luxury bridal and signature makeup services for your special day.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bridal Makeup Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bridal & Airbrush Makeup Services | Nizan Makeovers',
    description: 'Luxury bridal and signature makeup services for your special day.',
    images: ['/og-image.jpg'],
  },
};

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Luxury Services"
        title="Bridal & Signature Makeup Services"
        description="Explore our premium beauty offerings designed for unforgettable weddings, refined occasions, and graceful bridal transformations."
      />
      <Services />
    </PageShell>
  );
}
