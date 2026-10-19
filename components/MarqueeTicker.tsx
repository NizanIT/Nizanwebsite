'use client';

const items = [
  'Bridal Makeup',
  'Airbrush Technique',
  'Luxury Artistry',
  'Signature Looks',
  'Kerala\'s Finest',
  '2000+ Brides',
  'UAE & India',
  'Award-Winning',
];

export default function MarqueeTicker() {
  const repeated = [...items, ...items];

  return (
    <div className="marquee-track w-full overflow-hidden border-y border-gold/20 bg-navy py-4 select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((text, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-gold/70 text-[10px] font-medium tracking-[0.35em] uppercase px-8">
              {text}
            </span>
            <span className="text-gold/30 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
