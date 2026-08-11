'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '@/lib/site';

/**
 * Los testimonios.
 *
 * PARA AÑADIR UNO NUEVO: sube el vídeo a public/ y añade una línea aquí
 * debajo. El carrusel se encarga del resto — flechas, puntitos y el paso
 * automático aparecen solos en cuanto hay más de uno.
 *
 *   video  — el archivo dentro de public/ (grabado con el móvil, vertical)
 *   poster — la primera imagen que se ve, para que no salga un cuadro negro
 *   texto  — una frase suya, si la tienes. Puede ir vacía.
 *   quien  — nombre y ciudad. Solo con su permiso por escrito.
 */
type Ficha = { video: string; poster: string; texto?: string; quien?: string };

const FICHAS: Ficha[] = [
  {
    video: '/testimonio-1.mp4',
    poster: '/testimonio-1-poster.jpg',
  },
];

/** Cada cuánto pasa solo al siguiente. */
const CADA = 6500;

export default function Testimonios() {
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const [sonando, setSonando] = useState<number | null>(null);
  const [parado, setParado] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const varios = FICHAS.length > 1;

  /** Lleva la pista a una tarjeta concreta. */
  const irA = useCallback((i: number) => {
    const el = pista.current;
    const hijo = el?.firstElementChild as HTMLElement | null;
    if (!el || !hijo) return;
    const paso = hijo.offsetWidth + 18;
    el.scrollTo({ left: paso * ((i + FICHAS.length) % FICHAS.length), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const alScroll = () => {
      const hijo = el.firstElementChild as HTMLElement | null;
      if (!hijo) return;
      setActivo(Math.round(el.scrollLeft / (hijo.offsetWidth + 18)));
    };
    el.addEventListener('scroll', alScroll, { passive: true });
    return () => el.removeEventListener('scroll', alScroll);
  }, []);

  /**
   * El paso automático. Se detiene solo cuando hace falta: mientras suena
   * un vídeo, cuando el ratón está encima, cuando la persona lo está
   * arrastrando con el dedo, o si ha pedido menos movimiento en su móvil.
   * Un carrusel que se mueve mientras estás leyendo es un carrusel que
   * molesta.
   */
  useEffect(() => {
    if (!varios || parado || sonando !== null) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => irA(activo + 1), CADA);
    return () => clearInterval(id);
  }, [varios, parado, sonando, activo, irA]);

  /** Solo puede sonar uno a la vez: si arranca otro, el anterior se para. */
  const reproducir = (i: number) => {
    videos.current.forEach((v, j) => { if (v && j !== i) v.pause(); });
    const v = videos.current[i];
    if (!v) return;
    if (v.paused) { void v.play(); setSonando(i); } else { v.pause(); setSonando(null); }
  };

  const flecha: React.CSSProperties = {
    width: 46, height: 46, borderRadius: '50%', border: `1px solid ${t.accent}33`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: t.accent,
    background: 'rgba(251,249,246,0.8)', backdropFilter: 'blur(8px)',
    transition: 'background-color 260ms ease, border-color 260ms ease, transform 260ms ease',
  };

  return (
    <div
      onMouseEnter={() => setParado(true)}
      onMouseLeave={() => setParado(false)}
      onTouchStart={() => setParado(true)}
      onFocusCapture={() => setParado(true)}
      onBlurCapture={() => setParado(false)}
    >
      <div
        ref={pista}
        style={{
          display: 'flex', gap: 18, overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 6,
        }}
      >
        {FICHAS.map((f, i) => (
          <article
            key={f.video}
            aria-hidden={varios && activo !== i ? undefined : undefined}
            style={{
              flex: varios ? '0 0 min(88%, 340px)' : '0 0 min(100%, 360px)',
              scrollSnapAlign: 'start',
              border: '1px solid rgba(20,17,16,0.12)', borderRadius: 20, overflow: 'hidden',
              background: '#FBF9F6',
              transition: 'transform 460ms cubic-bezier(.22,1,.36,1), box-shadow 460ms ease, opacity 460ms ease',
              transform: activo === i ? 'translateY(-4px)' : 'none',
              opacity: varios && activo !== i ? 0.72 : 1,
              boxShadow: activo === i ? '0 18px 44px rgba(30,45,66,0.16)' : '0 2px 10px rgba(30,45,66,0.05)',
            }}
          >
            {/* El marco sigue la forma del vídeo: están grabados en vertical
                con el móvil, así que va alto y se ve la cara entera. */}
            <div style={{ position: 'relative', aspectRatio: '9 / 16', background: '#161C26' }}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={(el) => { videos.current[i] = el; }}
                src={f.video}
                poster={f.poster}
                preload="metadata"
                playsInline
                controls={sonando === i}
                onPlay={() => setSonando(i)}
                onPause={() => setSonando((s) => (s === i ? null : s))}
                onEnded={() => setSonando(null)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {sonando !== i && (
                <button
                  type="button"
                  onClick={() => reproducir(i)}
                  aria-label="Reproducir el testimonio"
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
                    background: 'linear-gradient(180deg, rgba(22,28,38,0.12) 0%, rgba(22,28,38,0.42) 100%)',
                  }}
                >
                  <span style={{
                    width: 66, height: 66, borderRadius: '50%', background: 'rgba(251,249,246,0.94)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 26px rgba(0,0,0,0.32)',
                  }}>
                    <span style={{ width: 0, height: 0, borderLeft: `17px solid ${t.accent}`, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', marginLeft: 5 }} />
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFFFFF', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                    Ver testimonio
                  </span>
                </button>
              )}
            </div>

            {(f.texto || f.quien) && (
              <div style={{ padding: 22, borderTop: '1px solid rgba(20,17,16,0.1)' }}>
                {f.texto && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>{f.texto}</p>}
                {f.quien && (
                  <p style={{ margin: f.texto ? '16px 0 0' : 0, fontSize: 13, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(20,17,16,0.45)' }}>
                    {f.quien}
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {varios && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
          <button type="button" aria-label="Anterior" onClick={() => irA(activo - 1)} style={flecha}>←</button>
          <button type="button" aria-label="Siguiente" onClick={() => irA(activo + 1)} style={flecha}>→</button>

          {/* Los puntitos: el activo se estira y se va llenando de color, así
              se ve cuánto queda para que pase al siguiente. */}
          <div style={{ display: 'flex', gap: 7, marginLeft: 8 }}>
            {FICHAS.map((f, i) => (
              <button
                key={f.video}
                type="button"
                aria-label={`Ir al testimonio ${i + 1}`}
                onClick={() => irA(i)}
                style={{
                  width: activo === i ? 30 : 9, height: 9, borderRadius: 999, padding: 0,
                  background: activo === i ? 'rgba(30,45,66,0.16)' : 'rgba(20,17,16,0.18)',
                  overflow: 'hidden', position: 'relative',
                  transition: 'width 380ms cubic-bezier(.22,1,.36,1), background-color 380ms ease',
                }}
              >
                {activo === i && (
                  <span
                    key={`${activo}-${parado}-${sonando}`}
                    aria-hidden
                    style={{
                      position: 'absolute', inset: 0, transformOrigin: 'left', background: t.accent,
                      animation: parado || sonando !== null ? 'none' : `rrbarra ${CADA}ms linear forwards`,
                      transform: parado || sonando !== null ? 'scaleX(1)' : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(20,17,16,0.4)' }}>
            Desliza
          </span>
        </div>
      )}
    </div>
  );
}
