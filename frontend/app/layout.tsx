import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Trove - Modern E-Commerce Store',
    template: '%s | Trove',
  },
  description:
    'Discover amazing products at great prices. Shop electronics, clothing, books, home goods and more at Trove.',
  keywords: ['e-commerce', 'online shopping', 'products', 'electronics', 'clothing', 'books'],
  authors: [{ name: 'Trove' }],
  creator: 'Trove',
  publisher: 'Trove',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Trove',
    title: 'Trove - Modern E-Commerce Store',
    description:
      'Discover amazing products at great prices. Shop electronics, clothing, books, home goods and more at Trove.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trove E-Commerce Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trove - Modern E-Commerce Store',
    description:
      'Discover amazing products at great prices. Shop electronics, clothing, books, home goods and more at Trove.',
    images: ['/og-image.jpg'],
    creator: '@trove',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
