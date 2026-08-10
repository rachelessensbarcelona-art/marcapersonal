import type { Metadata, Viewport } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import BookingAgent from '@/components/BookingAgent';
import DatosGoogle from '@/components/DatosGoogle';
import { site, siteUrl, t } from '@/lib/site';

const grotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Todo lo que Google y las redes sociales leen de la web.
 *
 * El título y la descripción son EXACTAMENTE lo que sale en el buscador,
 * así que están escritos para que una persona los lea, no para rellenar
 * palabras. Regla: el título por debajo de 60 letras y la descripción
 * por debajo de 155, o Google los corta con puntos suspensivos.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Raquel Rodríguez · Emprender desde casa a los 40',
    template: '%s · Raquel Rodríguez',
  },
  description:
    'Acompaño a mujeres de más de 40 años a montar su propio negocio desde casa y a recuperar su tiempo. Hablamos 20 minutos por videollamada, de mujer a mujer.',
  keywords: [
    'Raquel Rodríguez',
    'emprender a los 40 mujeres',
    'negocio propio desde casa',
    'reinventarse a los 50',
    'mentoría para mujeres',
    'segunda oportunidad profesional',
  ],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  applicationName: site.name,
  category: 'lifestyle',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: site.name,
    title: 'Raquel Rodríguez · Emprender desde casa a los 40',
    description:
      'La historia de cómo decidí algo solo para mí. Y de cómo puedes empezar tú, con lo que ya sabes hacer. Videollamada de 20 minutos, sin compromiso.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Raquel Rodríguez' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raquel Rodríguez · Emprender desde casa a los 40',
    description: 'Acompaño a mujeres +40 a montar su propio negocio. Videollamada de 20 minutos, sin compromiso.',
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: t.bg,
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={grotesk.variable}>
      <body>
        <DatosGoogle />
        <Nav />
        {children}
        <BookingAgent />
        <Cursor />
      </body>
    </html>
  );
}
