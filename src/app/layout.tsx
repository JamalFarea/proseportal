import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { BrandingProvider } from '@/components/BrandingProvider';
import { InviteNotifications } from '@/components/InviteNotifications';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://proseportal.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s | ProsePortal',
    default: 'ProsePortal — Modern Markdown Editor with AI & Cloud Sync',
  },
  description: 'ProsePortal is a modern markdown editor with AI-powered content suggestions, real-time cloud sync via Firebase, and a distraction-free writing experience. Supports Arabic and English.',
  keywords: ['markdown editor', 'AI writing assistant', 'cloud sync', 'ProsePortal', 'online markdown', 'Arabic markdown editor', 'محرر ماركداون'],
  authors: [{ name: 'ProsePortal' }],
  creator: 'ProsePortal',
  publisher: 'ProsePortal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    siteName: 'ProsePortal',
    title: 'ProsePortal — Modern Markdown Editor with AI & Cloud Sync',
    description: 'Write markdown with AI-powered suggestions, real-time cloud sync, and a clean distraction-free interface. يدعم العربية.',
    url: baseUrl,
  },
  twitter: {
    card: 'summary',
    title: 'ProsePortal — Modern Markdown Editor',
    description: 'Write markdown with AI suggestions and cloud sync. يدعم اللغة العربية.',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      en: baseUrl,
      ar: `${baseUrl}/ar`,
    },
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/favicon.svg', sizes: 'any' }],
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'ProsePortal' },
  formatDetection: { telephone: false },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ProsePortal',
              url: baseUrl,
              description: 'Modern markdown editor with AI-powered content suggestions and real-time cloud sync. Supports Arabic and English.',
              applicationCategory: 'WebApplication',
              operatingSystem: 'All',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              author: { '@type': 'Organization', name: 'ProsePortal' },
              inLanguage: ['en', 'ar'],
            }),
          }}
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <BrandingProvider>
            {children}
            <Toaster />
            <InviteNotifications />
          </BrandingProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
