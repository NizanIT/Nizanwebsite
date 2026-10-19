import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import PreviousMasterclasses from '@/components/PreviousMasterclasses';

export const metadata: Metadata = {
  title: 'Makeup Masterclasses | Nizan Makeovers | Professional Training',
  description:
    'Bridal makeup masterclasses and professional training workshops by Feeniya Nizan. Learn airbrush, signature makeup, and editorial beauty techniques.',
  keywords: [
    'makeup masterclass Kerala',
    'bridal makeup training',
    'makeup workshop India',
    'professional makeup course',
    'airbrush makeup training',
    'Feeniya Nizan masterclass',
  ],
  openGraph: {
    title: 'Makeup Masterclasses | Nizan Makeovers',
    description:
      'Professional bridal and editorial makeup masterclasses by Feeniya Nizan — hands-on training for makeup artists.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Makeup Masterclasses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Makeup Masterclasses | Nizan Makeovers',
    description: 'Professional bridal and editorial makeup masterclasses and training.',
    images: ['/og-image.jpg'],
  },
};

export default function MasterclassesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Knowledge & Excellence"
        title="Previous Masterclasses"
        description="A curated archive of every masterclass we've hosted — hands-on sessions where passionate artists trained alongside Nizan to master the craft of luxury bridal transformation."
      />
      <PreviousMasterclasses />
    </PageShell>
  );
}
