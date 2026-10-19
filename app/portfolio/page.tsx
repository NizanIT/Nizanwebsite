import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Portfolio from '@/components/Portfolio';

export const metadata: Metadata = {
  title: 'Bridal Makeup Portfolio | 2000+ Transformations | Nizan Makeovers',
  description:
    'Gallery of 2000+ bridal transformations, editorial shoots, and luxury makeup looks by Feeniya Nizan across India and UAE.',
  openGraph: {
    title: 'Bridal Makeup Portfolio | Nizan Makeovers',
    description: 'View 2000+ beautiful bridal and editorial transformations.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bridal Makeup Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bridal Makeup Portfolio | Nizan Makeovers',
    description: 'View 2000+ beautiful bridal and editorial transformations.',
    images: ['/og-image.jpg'],
  },
};

export default function PortfolioPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Selected Work"
        title="Portfolio of Bridal Transformations"
        description="View a larger curated gallery of bridal, editorial, reception, and occasion looks shaped with elegance, precision, and luxury artistry."
      />
      <Portfolio showViewAll={false} />
    </PageShell>
  );
}
