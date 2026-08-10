import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * Genera /robots.txt: las instrucciones para los buscadores.
 *
 * Se les deja entrar a todo menos a /api/, que son las tuberías internas
 * (el formulario de reserva). Ahí no hay nada que enseñar y solo
 * ensuciaría los resultados.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
