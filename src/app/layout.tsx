import "./globals.css";

export const metadata = {
  title: "Han Tagam | Элегантная восточная кухня с доставкой",
  description: "✨ Han Tagam — изысканная восточная кухня, национальные блюда, банкетный зал и VIP кабинеты. Закажите онлайн через QR-меню! 🥘 Традиции Востока",
  keywords: [
    'Han Tagam',
    'Хан Тагам',
    'восточная кухня',
    'национальная кухня',
    'доставка еды',
    'QR меню',
    'заказ онлайн',
    'банкетный зал',
    'VIP кабинеты',
    'ресторан',
    'туркменская кухня',
    'элегантная кухня',
    'традиционные блюда'
  ],
  authors: [{ name: 'Han Tagam' }],
  creator: 'Han Tagam',
  publisher: 'Han Tagam',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hantagam.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '✨ Han Tagam | Элегантная восточная кухня',
    description: '🥘 Изысканная восточная кухня, национальные блюда, банкетный зал и VIP кабинеты. 🌟 Традиции Востока. Закажите онлайн!',
    url: 'https://hantagam.com',
    siteName: 'Han Tagam',
    images: [
      {
        url: '/images/han-tagam-logo.png',
        width: 1200,
        height: 630,
        alt: '✨ Han Tagam - Элегантная восточная кухня',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '✨ Han Tagam | Элегантная восточная кухня',
    description: '🥘 Изысканная восточная кухня, национальные блюда, банкетный зал и VIP кабинеты. 🌟 Традиции Востока.',
    images: ['/images/han-tagam-logo.png'],
    creator: '@HanTagam',
    site: '@HanTagam',
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
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#d4af37',
  width: 'device-width',
  initialScale: 1,
};

import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <head>
        {/* Force cache refresh for static assets */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="h-full mobile-app-feel safe-area-padding" style={{background: 'var(--han-bg, var(--bg-primary))', color: 'var(--han-text, var(--text-primary))'}}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
