import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import WhyChoose from '@/components/WhyChoose';
import About from '@/components/About';
import Branches from '@/components/Branches';

export const metadata: Metadata = {
  title: "About Nizan Makeovers | Feeniya Nizan & Team",
  description:
    "Meet Feeniya Nizan and the expert team behind Nizan Makeovers. 8+ years of luxury bridal expertise serving Kerala, India, and UAE.",
  openGraph: {
    title: "About Nizan Makeovers | Feeniya Nizan & Team",
    description: "Learn the story of Kerala's premier bridal makeup studio.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Nizan Makeovers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Nizan Makeovers | Feeniya Nizan",
    description: "Learn the story of Kerala's premier bridal makeup studio.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About Nizan"
        title="Our Story & Signature Artistry"
        description="Discover the journey behind Nizan Makeovers, our bridal expertise, and the vision that continues to expand our artistry across India."
      />
      <WhyChoose />
      <About />
      <Branches />
    </PageShell>
  );
}
