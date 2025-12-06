import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { seo } from "@/lib/config";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: {
    default: seo.title,
    template: `%s | ${seo.title}`,
  },
  description: seo.description,
  keywords: seo.keywords,
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: seo.url,
    title: seo.title,
    description: seo.description,
    siteName: seo.title,
    images: [
      {
        url: seo.image,
        width: 1200,
        height: 630,
        alt: seo.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [seo.image],
    creator: '@truongnat', // inferred from github username config if needed, but hardcoded for now or use config
  },
  verification: {
    google: "verification_token", // Placeholder or from config if available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
