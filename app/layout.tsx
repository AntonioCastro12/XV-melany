import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:3000';

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
        url: '/og.jpg',
        width: 1200,
        height: 675,
        alt: 'Mis XV Años de Melany Deniss — 24 de octubre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mis XV Años | Melany Deniss',
    description: 'Acompáñame a celebrar mis XV años este 24 de octubre.',
    images: ['/og.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#b50909',
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
