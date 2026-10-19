import type { Metadata } from "next";
import { Archivo, Playfair_Display } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = "https://nizanmakeovers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nizan Makeovers | Luxury Bridal Makeup Artist in Kerala",
    template: "%s | Nizan Makeovers",
  },
  description:
    "Nizan Makeovers — Kerala's premier luxury bridal makeup artist. Founded by Feeniya Nizan, specialising in Airbrush & Signature Bridal Makeup. 2000+ brides transformed across India and UAE.",
  keywords: [
    "bridal makeup artist Kerala",
    "luxury bridal makeup Kerala",
    "Feeniya Nizan",
    "Nizan Makeovers",
    "airbrush makeup Kerala",
    "bridal makeup Kozhikode",
    "bridal makeup Calicut",
    "wedding makeup artist Kerala",
    "bridal makeup artist India",
    "bridal makeup UAE",
    "signature makeup Kerala",
    "celebrity makeup Kerala",
    "best bridal makeup artist Kerala",
    "Hindu bridal makeup",
    "Muslim bridal makeup",
    "Christian bridal makeup",
    "HD makeup Kerala",
    "makeup masterclass Kerala",
  ],
  authors: [{ name: "Feeniya Nizan", url: SITE_URL }],
  creator: "Nizan Makeovers",
  publisher: "Nizan Makeovers",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Nizan Makeovers | Luxury Bridal Makeup Artist in Kerala",
    description:
      "Kerala's premier luxury bridal makeup studio by Feeniya Nizan. Airbrush & Signature Makeup. 2000+ brides transformed across India and UAE.",
    url: SITE_URL,
    type: "website",
    locale: "en_IN",
    siteName: "Nizan Makeovers",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nizan Makeovers — Luxury Bridal Makeup Artist in Kerala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nizan Makeovers | Luxury Bridal Makeup Artist in Kerala",
    description:
      "Kerala's premier luxury bridal makeup studio by Feeniya Nizan. 2000+ brides transformed.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/nizan_logo_white.png" />
        <JsonLd />
      </head>
      <body className={`${archivo.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
