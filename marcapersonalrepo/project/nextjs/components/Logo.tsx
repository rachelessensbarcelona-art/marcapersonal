'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

/**
 * Enseña public/logo.png. Mientras ese archivo no exista, cae al nombre
 * escrito en vez de dejar el icono de imagen rota.
 *
 * Ojo con el detalle: si la imagen falla ANTES de que React se enganche
 * (que es lo normal en la primera carga), el onError nunca llega. Por eso
 * además comprobamos al montar si la imagen trae ancho real.
 */
export default function Logo({ alto, soloImagen = false }: { alto: string; soloImagen?: boolean }) {
  const img = useRef<HTMLImageElement>(null);
  const [roto, setRoto] = useState(false);

  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setRoto(true);
  }, []);

  if (roto) {
    return soloImagen ? null : (
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.02em' }}>{site.name}</span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={img}
      src="/logo.png"
      alt={soloImagen ? '' : site.name}
      aria-hidden={soloImagen || undefined}
      onError={() => setRoto(true)}
      style={{ height: alto, width: 'auto', display: 'block' }}
    />
  );
}
