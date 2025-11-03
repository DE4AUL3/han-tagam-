import "./globals.css";
export const metadata = {
  title: "Han Tagam — Ресторан туркменской кухни",
  description: "Han Tagam — ресторан традиционной туркменской кухни с доставкой. Попробуйте аутентичные блюда Туркменистана.",
  keywords: [
    'QR меню',
    'ресторан',
    'онлайн меню',
    'заказ еды',
    'MenuCraft',
    'cafe',
    'restaurant menu',
    'digital menu',
    'турецкая кухня',
    'туркменская кухня'
  ],
  authors: [{ name: 'MenuCraft Team' }],
  creator: 'MenuCraft',
  publisher: 'MenuCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'ru': '/ru',
      'tk': '/tk',
    },
  },
  openGraph: {
      title: 'Han Tagam — QR-меню',
      description: 'Han Tagam — элегантное светлое QR-меню для кафе и ресторанов',
      url: 'http://localhost:3000',
      siteName: 'Han Tagam',
      images: [
        {
          url: '/han_tagam2..jpg',
          width: 1200,
          height: 630,
          alt: 'Han Tagam',
        },
      ],
      locale: 'ru_RU',
      type: 'website',
    },
  twitter: {
    card: 'summary_large_image',
    title: 'MenuCraft — QR-меню для ресторанов',
    description: 'Готовый к продакшену шаблон Next.js для QR-меню с админкой и мультиязычностью.',
    images: ['/panda_logo.jpg'],
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
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="h-full mobile-app-feel safe-area-padding" style={{background: 'var(--han-bg, var(--bg-primary))', color: 'var(--han-text, var(--text-primary))'}}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
