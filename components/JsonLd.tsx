// JSON-LD structured data for SEO — LocalBusiness + Person schema
// Usage: <JsonLd /> in layout or page

export default function JsonLd() {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': 'https://nizanmakeovers.com/#business',
    name: 'Nizan Makeovers',
    description:
      "Kerala's premier luxury bridal makeup studio founded by Feeniya Nizan. Specialising in Airbrush and Signature Bridal Makeup. 2000+ brides transformed across India and UAE.",
    url: 'https://nizanmakeovers.com',
    logo: 'https://nizanmakeovers.com/nizan_logo_white.png',
    image: 'https://nizanmakeovers.com/og-image.jpg',
    telephone: '+919746514181',
    email: 'nizanmakeovers@gmail.com',
    priceRange: '₹₹₹',
    currenciesAccepted: 'INR, AED',
    openingHours: 'Mo-Su 00:00-23:59',
    areaServed: [
      { '@type': 'State', name: 'Kerala', 'address-country': 'IN' },
      { '@type': 'State', name: 'Tamil Nadu', 'address-country': 'IN' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    sameAs: [
      'https://www.instagram.com/nizanmakeovers',
      'https://www.facebook.com/nizanmakeover',
      'https://www.youtube.com/@nizanmakeovers',
    ],
    founder: {
      '@type': 'Person',
      name: 'Feeniya Nizan',
      jobTitle: 'Founder & Lead Bridal Makeup Artist',
      url: 'https://nizanmakeovers.com/about',
      sameAs: ['https://www.instagram.com/nizanmakeovers'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Bridal Makeup Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Airbrush Bridal Makeup',
            description:
              'Lightweight, long-lasting airbrush makeup technique for flawless bridal looks.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Signature Bridal Makeup',
            description:
              'Premium customized bridal makeup crafted by expert artists for Hindu, Muslim, and Christian weddings.',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
    />
  );
}
