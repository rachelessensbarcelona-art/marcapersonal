'use client';

import { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/site';

/**
 * El vídeo de presentación, servido desde la propia web (public/video.mp4).
 *
 * Tres cosas hacen que arranque al instante:
 *
 *  1. El archivo está preparado con "faststart": el índice del vídeo va al
 *     principio, así que el navegador puede empezar a pintar imagen mientras
 *     todavía se está descargando el resto. Sin eso habría que esperar a
 *     tener los 12 MB enteros antes de ver nada.
 *  2. Arranca solo y en silencio. Los navegadores solo permiten el arranque
 *     automático si no hay sonido — con sonido lo bloquean siempre, sin
 *     excepción. Como el vídeo lleva los subtítulos incrustados, se entiende
 *     igual desde el primer segundo.
 *  3. Encima queda un botón para activar el sonido. Un solo toque.
 *
 * Y como es el reproductor del propio navegador, el botón de pausa es de
 * verdad y funciona en cualquier móvil.
 */
export default function VideoPresentacion() {
  const ref = useRef<HTMLVideoElement>(null);
  const [conSonido, setConSonido] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Si la persona ha pedido menos animación en su móvil, no arrancamos solos.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Algunos navegadores rechazan la promesa si aún no hay datos: da igual,
    // el botón de play sigue estando para quien quiera darle.
    v.play().catch(() => {});
  }, []);

  const activarSonido = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setConSonido(true);
    v.play().catch(() => {});
  };

  return (
    <>
      <video
        ref={ref}
        controls
        muted
        autoPlay
        playsInline
        preload="auto"
        poster="/video-poster.jpg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', background: '#000', objectFit: 'cover' }}
      >
        <source src="/video.mp4" type="video/mp4" />
        Tu navegador no puede reproducir este vídeo.
      </video>

      {!conSonido && (
        <button
          type="button"
          onClick={activarSonido}
          style={{
            position: 'absolute', top: 'clamp(11px,1.4vw,16.5px)', right: 'clamp(11px,1.4vw,16.5px)', zIndex: 2,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            minHeight: 44, padding: '0 clamp(15px,1.3vw,18px) 0 clamp(13px,1.1vw,15px)', borderRadius: 999,
            background: 'rgba(251,249,246,0.94)', color: t.ink,
            fontSize: 'clamp(13.5px,1.1vw,15.5px)', fontWeight: 600, letterSpacing: '-0.01em',
            boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <span aria-hidden style={{ fontSize: 16.5, lineHeight: 1 }}>🔇</span>
          Activar sonido
        </button>
      )}
    </>
  );
}
