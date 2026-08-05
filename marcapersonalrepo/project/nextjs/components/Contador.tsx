'use client';

import { useEffect, useRef, useState } from 'react';

/** Un número que cuenta hasta su valor cuando entra en pantalla. */
export default function Contador({
  hasta,
  sufijo = '',
  style,
}: { hasta: number; sufijo?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(hasta); return; }

    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const dur = 1500;
      const paso = (ahora: number) => {
        const p = Math.min(1, (ahora - t0) / dur);
        const suave = 1 - Math.pow(1 - p, 4);          // frena al final
        setN(Math.round(hasta * suave));
        if (p < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [hasta]);

  // El español no agrupa los millares de cuatro cifras, pero aquí queremos
  // 5.600 para que case con el resto de cifras de la página.
  const conPuntos = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {conPuntos}{sufijo}
    </span>
  );
}
