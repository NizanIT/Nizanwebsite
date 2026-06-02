import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import PreviousMasterclasses from '@/components/PreviousMasterclasses';

export const metadata: Metadata = {
  title: 'Previous Masterclasses | Nizan Makeovers',
  description:
    'Explore all previous bridal and editorial makeup masterclasses conducted by Nizan Makeovers. Hands-on workshops for aspiring and professional makeup artists.',
  keywords: [
    'makeup masterclass',
    'bridal makeup training',
    'Nizan Makeovers masterclass',
    'makeup workshop Kerala',
    'professional makeup course',
  ],
  openGraph: {
    title: 'Previous Masterclasses | Nizan Makeovers',
    description:
      'Discover past bridal and fashion makeup masterclasses by Nizan Makeovers — hands-on, luxury, and transformative.',
    type: 'website',
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
