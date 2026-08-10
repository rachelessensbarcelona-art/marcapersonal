import { site, siteUrl, igHref } from '@/lib/site';

/**
 * Los "datos estructurados": una ficha invisible que Google lee para
 * entender de quién es la web. No se ve en la pantalla, pero es lo que
 * hace que en el buscador salga la foto, el nombre y los enlaces bien
 * puestos, en vez de un resultado gris cualquiera.
 *
 * Solo se declara lo que se puede demostrar en la propia web. Nada de
 * inventarse valoraciones ni cifras: Google penaliza eso.
 */
const fichas = [
  {
    '@type': 'Person',
    '@id': `${siteUrl}/#raquel`,
    name: site.name,
    givenName: 'Raquel',
    familyName: 'Rodríguez',
    url: siteUrl,
    image: `${siteUrl}/raquel-retrato.webp`,
    email: `mailto:${site.email}`,
    telephone: site.whatsapp,
    jobTitle: 'Mentora de emprendimiento para mujeres',
    description:
      'Raquel Rodríguez acompaña a mujeres de más de 40 años a montar su propio negocio desde casa, a poner en valor lo que ya saben hacer y a recuperar su tiempo.',
    knowsAbout: [
      'Emprendimiento femenino',
      'Negocio desde casa',
      'Reinvención profesional a partir de los 40',
    ],
    knowsLanguage: 'es-ES',
    sameAs: [igHref],
  },
  {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#web`,
    url: siteUrl,
    name: site.name,
    inLanguage: 'es-ES',
    publisher: { '@id': `${siteUrl}/#raquel` },
  },
  {
    '@type': 'ProfilePage',
    '@id': `${siteUrl}/#pagina`,
    url: siteUrl,
    name: 'Raquel Rodríguez · Emprender desde casa a los 40',
    isPartOf: { '@id': `${siteUrl}/#web` },
    about: { '@id': `${siteUrl}/#raquel` },
    inLanguage: 'es-ES',
  },
];

export default function DatosGoogle() {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': fichas });
  return (
    <script
      type="application/ld+json"
      // El JSON lo generamos nosotros, no viene de fuera: no hay texto de nadie que pueda colarse.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}
