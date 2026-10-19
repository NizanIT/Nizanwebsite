import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Team from '@/components/Team';
import Branches from '@/components/Branches';

export const metadata: Metadata = {
  title: 'Team Nizan Makeovers | Expert Bridal Makeup Artists',
  description:
    'Meet the team of expert makeup artists at Nizan Makeovers and Team N Makeovers across Kerala, Tamil Nadu, and India.',
  openGraph: {
    title: 'Team Nizan Makeovers | Expert Bridal Makeup Artists',
    description: 'Meet our passionate team of skilled bridal makeup artists.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Team Nizan Makeovers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team Nizan Makeovers | Expert Artists',
    description: 'Meet our passionate team of skilled bridal makeup artists.',
    images: ['/og-image.jpg'],
  },
};

export default function TeamPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Meet The Team"
        title="Experts Behind Every Bridal Look"
        description="Meet the artists behind Nizan Makeovers and explore the talented teams delivering signature beauty experiences across our branches."
      />
      <Team />
      <Branches />
    </PageShell>
  );
}
