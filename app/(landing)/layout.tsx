import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { Providers } from './providers';
import { Navigation } from '@/components/Navigation';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';



export const metadata: Metadata = {
  title: {
    default: 'Portfolio | Full-Stack Developer',
    template: '%s | Portfolio',
  },
  description:
    'Modern developer portfolio showcasing full-stack development, AI/ML projects, and technical expertise. Built with Next.js 16, TypeScript, and Tailwind CSS.',
  keywords: [
    'portfolio',
    'developer',
    'full-stack',
    'TypeScript',
    'React',
    'Next.js',
    'AI',
    'Machine Learning',
  ],
  authors: [{ name: 'Portfolio Developer' }],
  creator: 'Portfolio Developer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portfolio.dev',
    title: 'Portfolio | Full-Stack Developer',
    description:
      'Modern developer portfolio showcasing full-stack development, AI/ML projects, and technical expertise.',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Full-Stack Developer',
    description:
      'Modern developer portfolio showcasing full-stack development, AI/ML projects, and technical expertise.',
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
