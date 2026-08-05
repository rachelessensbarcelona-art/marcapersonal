export const site = {
  name: 'Raquel Rodríguez',
  whatsapp: '+34676508388',
  instagram: 'raquelrodriguez',
  email: 'hola@raquelrodriguez.es',
};

export const t = {
  bg: '#FBF9F6',
  ink: '#141110',
  soft: 'rgba(20,17,16,0.66)',
  faint: 'rgba(20,17,16,0.45)',
  hair: 'rgba(20,17,16,0.12)',
  accent: '#2C3E5A',      // azul profundo — el acento principal
  accentSoft: '#4A6178',  // azul pizarra
  rose: '#C9A4AB',        // rosa empolvado
  roseSoft: '#E8D4D8',    // rosa claro, para el cristal
  deep: '#1E2D42',        // el más oscuro de la paleta
  gut: 'clamp(26px,6.2vw,104px)',
  font: 'var(--font-display), -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

export const waHref = (text?: string) =>
  'https://wa.me/' + site.whatsapp.replace(/[^\d]/g, '') + (text ? '?text=' + encodeURIComponent(text) : '');
export const igHref = 'https://instagram.com/' + site.instagram;
export const mailHref = 'mailto:' + site.email;

export const kicker = (color = t.accent) => ({
  margin: 0, fontSize: 11.5, fontWeight: 500, letterSpacing: '0.24em',
  textTransform: 'uppercase' as const, color,
});

/**
 * El vídeo de arriba de la página "Los números, sin rodeos".
 * Pega aquí el enlace para insertar (embed) y aparecerá solo.
 *   YouTube  → https://www.youtube.com/embed/CODIGO
 *   Vimeo    → https://player.vimeo.com/video/CODIGO
 * Déjalo vacío y se ve el marcador con el botón de play.
 */
export const videoUrl = '';
