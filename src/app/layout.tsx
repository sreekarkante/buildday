import type { Metadata } from 'next';
import './globals.css';
import TrackingCapture from '@/components/TrackingCapture';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import { Suspense } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buildday.vercel.app';

export const metadata: Metadata = {
  title: 'BuildDay — Build Your First AI Project in 60 Minutes',
  description: 'Free 60-minute workshop for final-year engineering students. Build a real AI project for your resume. No coding background needed.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Build Your First AI Project in 60 Minutes. Free.',
    description: 'Final-year engineering student? Join 500+ students building real AI projects for their resumes. 60 minutes. 100% free.',
    url: siteUrl,
    siteName: 'BuildDay',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BuildDay - Build Your First AI Project in 60 Minutes',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Your First AI Project in 60 Minutes. Free.',
    description: 'Join 500+ final-year students building real AI projects. Free workshop by NxtWave.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0A0A0F] text-white min-h-screen font-sans antialiased">
        <Suspense fallback={null}>
          <TrackingCapture />
        </Suspense>
        <main>{children}</main>
        <StickyMobileCTA />
      </body>
    </html>
  );
}
