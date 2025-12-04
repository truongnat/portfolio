import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { Providers } from './providers';
import { Navigation } from '@/components/Navigation';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';



import { seo } from '@/lib/config';

export const metadata: Metadata = {
  title: {
    default: seo.title,
    template: `%s | ${seo.title}`,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: 'Dao Quang Truong' }],
  creator: 'Dao Quang Truong',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: seo.url,
    title: seo.title,
    description: seo.description,
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Navigation />
      <AnalyticsTracker />
      {children}
      <ScrollToTop />
    </Providers>
  );
}
