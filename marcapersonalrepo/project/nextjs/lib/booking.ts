export type Chip = { label: string; v: string; primary?: boolean };
export type Msg = { me?: boolean; text?: string; card?: Booking };
export type Booking = { interest: string | null; day: string | null; time: string | null; name: string; phone: string };
export type Step = 'idle' | 'interest' | 'day' | 'time' | 'name' | 'phone' | 'consent' | 'done' | 'saved';

export const STORAGE_KEY = 'rr-reserva-v1';

export const nextDays = (n = 5) => {
  const out: string[] = [];
  const d = new Date();
  const fmt = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    out.push(fmt.format(d));
  }
  return out;
};

export const TIMES = ['10:00', '12:30', '17:00', '19:30'];

export const INTERESTS: Chip[] = [
  { label: 'El dispositivo', v: 'i' },
  { label: 'El negocio', v: 'i' },
  { label: 'Las dos cosas', v: 'i' },
];

export const CONSENT: Chip[] = [
  { label: 'Acepto y reservo', v: 'ok', primary: true },
  { label: 'No, de momento no', v: 'no' },
];

export const ackFor = (label: string) =>
  label === 'El negocio'
    ? 'Bien. Sin promesas de cifras: te contaré cómo funciona el modelo y qué implica de verdad.'
    : label === 'Las dos cosas'
    ? 'Las dos van juntas, es justo mi caso.'
    : 'Perfecto. Qué hace en tu casa, qué no hace y todo lo que quieras preguntarme, sin compromiso.';

export const guessInterest = (text: string) => {
  const s = text.toLowerCase();
  const biz = /negoc|ingres|dinero|equipo|distribu|vender|trabajo extra/.test(s);
  const dev = /aparato|dispositivo|agua|casa|salud|filtr|beber|grifo|precio/.test(s);
  if (biz && dev) return 'Las dos cosas';
  if (biz) return 'El negocio';
  if (dev) return 'El dispositivo';
  return null;
};

export const validPhone = (raw: string) => {
  const d = raw.replace(/[^\d+]/g, '');
  return /^\+?\d{9,15}$/.test(d) ? d : null;
};
