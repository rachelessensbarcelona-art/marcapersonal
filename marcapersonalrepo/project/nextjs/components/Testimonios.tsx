'use client';

import { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/site';

const FICHAS = [
  { texto: 'Aquí va, palabra por palabra, lo que ha cambiado en su casa desde que lo tiene.', quien: 'Nombre · Ciudad' },
  { texto: 'Qué esperaba antes de comprarlo y qué se ha encontrado después.', quien: 'Nombre · Ciudad' },
  { texto: 'Mejor si es de alguien a quien al principio le pareció caro.', quien: 'Nombre · Ciudad' },
  { texto: 'Y una de alguien que además lo ha convertido en su negocio.', quien: 'Nombre · Ciudad' },
];

/** Carrusel de testimonios: se arrastra, se desliza con las flechas y se ajusta solo. */
export default function Testimonios() {
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const alScroll = () => {
      const hijo = el.firstElementChild as HTMLElement | null;
      if (!hijo) return;
      const paso = hijo.offsetWidth + 18;
      setActivo(Math.round(el.scrollLeft / paso));
    };
    el.addEventListener('scroll', alScroll, { passive: true });
    return () => el.removeEventListener('scroll', alScroll);
  }, []);

  const ir = (dir: number) => {
    const el = pista.current;
    if (!el) return;
    const hijo = el.firstElementChild as HTMLElement | null;
    if (!hijo) return;
    el.scrollBy({ left: (hijo.offsetWidth + 18) * dir, behavior: 'smooth' });
  };

  const flecha: React.CSSProperties = {
    width: 46, height: 46, borderRadius: '50%', border: '1px solid rgba(20,17,16,0.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
    background: 'rgba(251,249,246,0.7)', backdropFilter: 'blur(8px)',
    transition: 'background-color 260ms ease, border-color 260ms ease, transform 260ms ease',
  };

  return (
    <div>
      <div
        ref={pista}
        style={{
          display: 'flex', gap: 18, overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 6,
        }}
      >
        {FICHAS.map((f, i) => (
          <article
            key={i}
            style={{
              flex: '0 0 min(88%, 340px)', scrollSnapAlign: 'start',
              border: '1px solid rgba(20,17,16,0.12)', borderRadius: 20, overflow: 'hidden',
              background: '#FBF9F6',
              transition: 'transform 420ms cubic-bezier(.22,1,.36,1), box-shadow 420ms ease',
              transform: activo === i ? 'translateY(-4px)' : 'none',
              boxShadow: activo === i ? '0 18px 44px rgba(30,45,66,0.13)' : '0 2px 10px rgba(30,45,66,0.05)',
            }}
          >
            <div style={{
              aspectRatio: '4 / 3', display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 12, borderBottom: '1px solid rgba(20,17,16,0.1)',
              background: `linear-gradient(150deg, rgba(232,212,216,0.55) 0%, rgba(201,164,171,0.28) 55%, rgba(74,97,120,0.16) 100%)`,
            }}>
              <span style={{
                width: 54, height: 54, borderRadius: '50%', background: 'rgba(251,249,246,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(30,45,66,0.14)',
              }}>
                <span style={{ width: 0, height: 0, borderLeft: `13px solid ${t.accent}`, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', marginLeft: 4 }} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(20,17,16,0.5)' }}>
                Vídeo · 40 s
              </span>
            </div>
            <div style={{ padding: 22 }}>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6 }}>{f.texto}</p>
              <p style={{ margin: '16px 0 0', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(20,17,16,0.45)' }}>
                {f.quien}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <button type="button" aria-label="Anterior" onClick={() => ir(-1)} style={flecha}>←</button>
        <button type="button" aria-label="Siguiente" onClick={() => ir(1)} style={flecha}>→</button>
        <div style={{ display: 'flex', gap: 7, marginLeft: 8 }}>
          {FICHAS.map((_, i) => (
            <span key={i} style={{
              width: activo === i ? 22 : 7, height: 7, borderRadius: 999,
              background: activo === i ? t.accent : 'rgba(20,17,16,0.18)',
              transition: 'width 340ms cubic-bezier(.22,1,.36,1), background-color 340ms ease',
            }} />
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(20,17,16,0.4)' }}>
          Desliza
        </span>
      </div>
    </div>
  );
}
