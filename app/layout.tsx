import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Mis XV Años | Melany Deniss',
  description: 'Acompáñame a celebrar mis XV años este 24 de octubre.',
  openGraph: {
    title: 'Mis XV Años | Melany Deniss',
    description: 'Acompáñame a celebrar mis XV años este 24 de octubre.',
    type: 'website',
    locale: 'es_MX',
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 909,
        alt: 'Mis XV Años de Melany Deniss — 24 de octubre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mis XV Años | Melany Deniss',
    description: 'Acompáñame a celebrar mis XV años este 24 de octubre.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#761c2c',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
