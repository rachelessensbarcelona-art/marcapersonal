import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import BookingAgent from '@/components/BookingAgent';

const grotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Raquel Rodríguez',
  description: '¿Cuándo decidiste algo solo para ti? Soy Raquel Rodríguez y esta es mi historia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={grotesk.variable}>
      <body>
        <Nav />
        {children}
        <BookingAgent />
        <Cursor />
      </body>
    </html>
  );
}
