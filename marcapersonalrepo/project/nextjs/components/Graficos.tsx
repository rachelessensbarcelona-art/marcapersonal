'use client';

import { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/site';

/* ────────────────────────────────────────────────────────────────
   Los números salen todos de la misma base que la tabla de la
   página: 8 litros al día · 365 días = 2.920 litros al año.
   Equipo: 5.600 € + un filtro de 95 € al año.
   Nada de esto es una promesa de ingresos: es coste de agua.
   ──────────────────────────────────────────────────────────────── */
const LITROS_ANO = 2920;
const EQUIPO = 5600;
const FILTRO_ANO = 95;

const MARCAS = [
  { m: 'Bezoya', litro: 0.72 },
  { m: 'Font Vella', litro: 0.74 },
  { m: 'Lanjarón', litro: 0.76 },
];

// es-ES no agrupa los millares de cuatro cifras (5600), y aquí queremos
// que 7.500 case con 43.216. Agrupamos a mano.
const eur = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';

/** Dispara una animación cuando el bloque entra en pantalla. */
function useEnPantalla<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [dentro, setDentro] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setDentro(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDentro(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, dentro] as const;
}

/* ═══════════ 1. Lo que cuesta el agua en 20 años ═══════════ */
export function BarrasCoste() {
  const [ref, dentro] = useEnPantalla<HTMLDivElement>();
  const filas = [
    ...MARCAS.map((x) => ({ nombre: x.m, valor: x.litro * LITROS_ANO * 20, destacada: false })),
    { nombre: 'El equipo', valor: EQUIPO + FILTRO_ANO * 20, destacada: true },
  ];
  const max = Math.max(...filas.map((f) => f.valor));

  return (
    <div ref={ref}>
      {filas.map((f, i) => (
        <div key={f.nombre} style={{ marginBottom: i === filas.length - 1 ? 0 : 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7, gap: 12 }}>
            <span style={{ fontSize: 17, fontWeight: f.destacada ? 700 : 500, color: t.ink }}>{f.nombre}</span>
            <span style={{ fontSize: f.destacada ? 18 : 15, fontWeight: f.destacada ? 700 : 600, color: f.destacada ? t.accent : 'rgba(20,17,16,0.75)', fontVariantNumeric: 'tabular-nums' }}>
              {eur(f.valor)}
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: 'rgba(20,17,16,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              width: dentro ? `${(f.valor / max) * 100}%` : '0%',
              background: f.destacada ? t.accent : 'rgba(20,17,16,0.26)',
              transition: `width 1100ms cubic-bezier(.22,1,.36,1) ${i * 130}ms`,
            }} />
          </div>
        </div>
      ))}
      <p style={{ margin: '18px 0 0', fontSize: 14.5, lineHeight: 1.6, color: 'rgba(20,17,16,0.5)' }}>
        Coste acumulado en 20 años · 8 litros al día · El equipo incluye un filtro de 95 € al año
      </p>
    </div>
  );
}

/* ═══════════ 2. Cuándo se paga solo ═══════════ */
export function Amortizacion() {
  const [ref, dentro] = useEnPantalla<HTMLDivElement>();

  const anos = 12;
  const aguaAno = MARCAS[1].litro * LITROS_ANO;            // Font Vella, la del medio
  const corte = EQUIPO / (aguaAno - FILTRO_ANO);           // años hasta igualarse
  const max = aguaAno * anos;

  const W = 640, H = 300, ML = 8, MR = 8, MT = 16, MB = 34;
  const px = (a: number) => ML + (a / anos) * (W - ML - MR);
  const py = (v: number) => MT + (1 - v / max) * (H - MT - MB);

  const linea = (f: (a: number) => number) =>
    Array.from({ length: anos + 1 }, (_, a) => `${a === 0 ? 'M' : 'L'}${px(a).toFixed(1)},${py(f(a)).toFixed(1)}`).join(' ');

  const dAgua = linea((a) => aguaAno * a);
  const dEquipo = linea((a) => EQUIPO + FILTRO_ANO * a);

  return (
    <div ref={ref}>
      {/* leyenda: dos series, siempre con nombre además del color */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px', marginBottom: 16 }}>
        {[
          { c: t.rose, txt: 'Agua embotellada' },
          { c: t.accent, txt: 'El equipo (compra + filtros)' },
        ].map((l) => (
          <span key={l.txt} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15.5, color: 'rgba(20,17,16,0.72)' }}>
            <span style={{ width: 14, height: 3, borderRadius: 999, background: l.c }} />{l.txt}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
           aria-label={`El gasto en agua embotellada supera al del equipo a los ${corte.toFixed(1)} años.`}
           style={{ display: 'block', overflow: 'visible' }}>
        {/* rejilla discreta */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={ML} x2={W - MR} y1={py(max * f)} y2={py(max * f)} stroke="rgba(20,17,16,0.07)" strokeWidth="1" />
        ))}
        {/* años */}
        {[0, 3, 6, 9, 12].map((a) => (
          <text key={a} x={px(a)} y={H - 12} textAnchor={a === 0 ? 'start' : a === 12 ? 'end' : 'middle'}
                fontSize="11.5" fill="rgba(20,17,16,0.45)">{a === 0 ? 'Hoy' : `${a} años`}</text>
        ))}

        {/* el punto en que se cruzan */}
        <line x1={px(corte)} x2={px(corte)} y1={MT} y2={H - MB}
              stroke={t.accent} strokeWidth="1" strokeDasharray="3 4" opacity={dentro ? 0.5 : 0}
              style={{ transition: 'opacity 500ms ease 1100ms' }} />

        <path d={dAgua} fill="none" stroke={t.rose} strokeWidth="2.5" strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={dentro ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(.4,0,.2,1)' }} />
        <path d={dEquipo} fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={dentro ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(.4,0,.2,1) 180ms' }} />

        {/* etiquetas directas al final de cada línea */}
        <g opacity={dentro ? 1 : 0} style={{ transition: 'opacity 500ms ease 1400ms' }}>
          <circle cx={px(anos)} cy={py(aguaAno * anos)} r="4.5" fill={t.rose} stroke="#FBF9F6" strokeWidth="2" />
          <text x={px(anos)} y={py(aguaAno * anos) - 12} textAnchor="end" fontSize="13" fontWeight="700" fill={t.ink}>
            {eur(aguaAno * anos)}
          </text>
          <circle cx={px(anos)} cy={py(EQUIPO + FILTRO_ANO * anos)} r="4.5" fill={t.accent} stroke="#FBF9F6" strokeWidth="2" />
          <text x={px(anos)} y={py(EQUIPO + FILTRO_ANO * anos) + 20} textAnchor="end" fontSize="13" fontWeight="700" fill={t.ink}>
            {eur(EQUIPO + FILTRO_ANO * anos)}
          </text>
        </g>
      </svg>

      <p style={{ margin: '16px 0 0', fontSize: 17, lineHeight: 1.6, color: t.ink }}>
        <strong style={{ fontWeight: 700 }}>Se paga solo a los {corte.toFixed(1).replace('.', ',')} años.</strong>{' '}
        <span style={{ color: 'rgba(20,17,16,0.62)' }}>
          A partir de ahí, cada año que pasa es dinero que te ahorras. A los 12 son{' '}
          {eur(aguaAno * anos - (EQUIPO + FILTRO_ANO * anos))}.
        </span>
      </p>
    </div>
  );
}

/* ═══════════ 3. Cómo funciona el negocio, paso a paso ═══════════ */
const PASOS = [
  { n: '01', t: 'Lo tienes en tu casa', d: 'Empiezas siendo clienta. Lo usas cada día y sabes de lo que hablas.' },
  { n: '02', t: 'Te das de alta', d: 'Como distribuidora independiente del fabricante. Sin stock, sin local y sin comprar inventario.' },
  { n: '03', t: 'Lo recomiendas', d: 'Cuando alguien te pregunta, se lo enseñas. El fabricante se encarga del envío, el cobro y la garantía.' },
  { n: '04', t: 'Cobras del fabricante', d: 'Una comisión por cada equipo vendido, directamente de la marca. Tú no manejas dinero de nadie.' },
];

export function ComoFunciona() {
  const [ref, dentro] = useEnPantalla<HTMLDivElement>();
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* el hilo que une los pasos */}
      <div aria-hidden style={{
        position: 'absolute', left: 21, top: 26, bottom: 26, width: 2,
        background: `linear-gradient(180deg, ${t.accent} 0%, ${t.rose} 100%)`,
        transformOrigin: 'top',
        transform: dentro ? 'scaleY(1)' : 'scaleY(0)',
        transition: 'transform 1200ms cubic-bezier(.22,1,.36,1)',
      }} />
      {PASOS.map((p, i) => (
        <div key={p.n} style={{
          display: 'grid', gridTemplateColumns: '44px 1fr', gap: 20, alignItems: 'start',
          marginBottom: i === PASOS.length - 1 ? 0 : 30,
          opacity: dentro ? 1 : 0,
          transform: dentro ? 'none' : 'translateY(16px)',
          transition: `opacity 640ms ease ${240 + i * 160}ms, transform 640ms cubic-bezier(.22,1,.36,1) ${240 + i * 160}ms`,
        }}>
          <span style={{
            width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: t.bg, border: `2px solid ${t.accent}`, color: t.accent,
            fontSize: 15.5, fontWeight: 700, letterSpacing: '0.04em', position: 'relative', zIndex: 1,
          }}>{p.n}</span>
          <div style={{ paddingTop: 6 }}>
            <p style={{ margin: 0, fontSize: 'clamp(18px,1.6vw,21px)', fontWeight: 600, letterSpacing: '-0.015em' }}>{p.t}</p>
            <p style={{ margin: '7px 0 0', fontSize: 16.5, lineHeight: 1.65, color: 'rgba(20,17,16,0.66)', maxWidth: '52ch' }}>{p.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
