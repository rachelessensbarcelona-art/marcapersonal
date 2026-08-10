import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * Genera /sitemap.xml: el índice de la web para Google.
 *
 * Son solo dos páginas, pero tenerlo hecho hace que las encuentre en
 * horas en vez de en semanas. Cuando añadas una página nueva, añádela
 * también aquí.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();
  return [
    { url: siteUrl, lastModified: hoy, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/inversion`, lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
