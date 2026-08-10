'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  /** Retraso en ms, para que los elementos de un grupo entren en cascada. */
  delay?: number;
  /** Cuánto sube al entrar. */
  y?: number;
  as?: 'div' | 'section' | 'li';
  style?: React.CSSProperties;
  id?: string;
};

/**
 * Aparece al entrar en pantalla: sube un poco y se funde.
 * Si el visitante pide menos movimiento, se muestra sin más.
 */
export default function Reveal({ children, delay = 0, y = 26, as = 'div', style, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisto(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisto(true); io.disconnect(); } },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal
      style={{
        ...style,
        opacity: visto ? 1 : 0,
        transform: visto ? 'none' : `translateY(${y}px)`,
        transition: `opacity 780ms cubic-bezier(.22,1,.36,1) ${delay}ms, transform 780ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
        willChange: visto ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
