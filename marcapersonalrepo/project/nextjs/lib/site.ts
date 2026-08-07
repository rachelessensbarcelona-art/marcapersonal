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
 *
 * Pega el enlace TAL CUAL, del sitio que sea: YouTube, Vimeo o Google
 * Drive. Abajo se traduce solo al formato que hace falta para incrustarlo.
 * Déjalo vacío y se ve el marcador con el botón de play.
 *
 * OJO con Google Drive: el archivo tiene que estar compartido como
 * "cualquier persona con el enlace", o se verá un recuadro vacío.
 */
export const videoUrl = 'https://drive.google.com/file/d/1v2dSDiNpc0wgSCTVxX7O3-gqCCkQXygD/view?usp=sharing';

/**
 * Forma del vídeo. Si está grabado en vertical (con el móvil), déjalo en
 * true: el marco se hace alto y no salen esas bandas negras a los lados.
 * Si algún día lo cambias por uno horizontal, ponlo en false.
 */
export const videoVertical = false;

/** Traduce un enlace normal al enlace que se puede incrustar. */
export const aEmbed = (url: string): string => {
  const u = url.trim();
  if (!u) return '';

  // Google Drive: .../file/d/ID/view  →  .../file/d/ID/preview
  const drive = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;

  // YouTube: youtu.be/ID · watch?v=ID · shorts/ID · live/ID
  const yt = u.match(/(?:youtu\.be\/|[?&]v=|youtube\.com\/(?:shorts|live|embed)\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;

  // Vimeo: vimeo.com/123456789
  const vi = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;

  return u;   // ya venía listo para incrustar
};
