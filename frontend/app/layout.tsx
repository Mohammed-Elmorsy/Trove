import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trove - E-Commerce Store',
  description: 'Modern e-commerce application built with Next.js and Nest.js',
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
