'use client';

import { useEffect, useState } from 'react';
import { t, videoUrl, aEmbed } from '@/lib/site';

/**
 * El vídeo de la página de inversión.
 *
 * Si existe public/video.mp4 (lo subes tú, igual que el logo), se usa
 * el reproductor nativo del navegador: carga al instante y siempre
 * tiene su botón de play/pausa, porque es el propio navegador quien
 * lo dibuja — no depende de ningún servicio externo.
 *
 * Si no existe ese archivo, cae al enlace de VIDEO_URL en lib/site.ts
 * (YouTube, Vimeo o Drive) incrustado en un iframe. Esa vía depende
 * del reproductor de terceros: no podemos garantizar su velocidad de
 * carga ni sus controles, porque el vídeo vive en sus servidores, no
 * en los nuestros.
 */
export default function VideoPresentacion() {
  const [autohospedado, setAutohospedado] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch('/video.mp4', { method: 'HEAD' })
      .then((r) => { if (vivo && r.ok) setAutohospedado(true); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  if (autohospedado) {
    return (
      <video
        controls
        preload="auto"
        playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', background: '#000' }}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
    );
  }

  const embed = aEmbed(videoUrl);
  if (embed) {
    return (
      <iframe
        src={embed}
        title="Vídeo de presentación"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'repeating-linear-gradient(135deg, rgba(20,17,16,0.045) 0 1px, transparent 1px 13px)' }}>
      <span style={{ width: 76, height: 76, borderRadius: '50%', border: '1px solid rgba(20,17,16,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(251,249,246,0.7)' }}>
        <span style={{ width: 0, height: 0, borderLeft: `18px solid ${t.ink}`, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', marginLeft: 5 }} />
      </span>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6560', textAlign: 'center', padding: '0 24px', lineHeight: 1.7 }}>
        Aquí va tu vídeo · 16:9<br />sube public/video.mp4 o pega el enlace en lib/site.ts
      </span>
    </div>
  );
}
