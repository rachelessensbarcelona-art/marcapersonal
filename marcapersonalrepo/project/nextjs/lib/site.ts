export const site = {
  name: 'Raquel Rodríguez',
  whatsapp: '+34600000000',
  instagram: 'raquelrodriguez',
  email: 'hola@raquelrodriguez.es',
};

export const t = {
  bg: '#FBF9F6',
  ink: '#141110',
  soft: 'rgba(20,17,16,0.66)',
  faint: 'rgba(20,17,16,0.45)',
  hair: 'rgba(20,17,16,0.12)',
  accent: '#4A6B7D',
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
