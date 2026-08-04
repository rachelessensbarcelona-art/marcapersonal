'use client';

import { useEffect, useRef } from 'react';
import { t } from '@/lib/site';

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia('(hover: none)').matches || innerWidth < 900) return;
    const R = ring.current!, D = dot.current!;
    document.documentElement.style.cursor = 'none';
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0;

    const tick = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      R.style.transform = `translate(${rx.toFixed(1)}px,${ry.toFixed(1)}px)`;
      D.style.transform = `translate(${mx.toFixed(1)}px,${my.toFixed(1)}px)`;
      raf = requestAnimationFrame(tick);
    };
    const grow = (v: boolean) => {
      R.style.width = R.style.height = v ? '62px' : '36px';
      R.style.margin = v ? '-31px 0 0 -31px' : '-18px 0 0 -18px';
      R.style.borderColor = v ? t.accent : 'rgba(20,17,16,0.35)';
      R.style.background = v ? 'color-mix(in srgb, ' + t.accent + ' 12%, transparent)' : 'transparent';
      D.style.transform += ' scale(' + (v ? 0 : 1) + ')';
      D.style.opacity = v ? '0' : '1';
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      const el = e.target as HTMLElement;
      const inField = !!el.closest('input, textarea, [data-native-cursor]');
      document.documentElement.style.cursor = inField ? 'auto' : 'none';
      R.style.opacity = inField ? '0' : '1';
      D.style.opacity = inField ? '0' : '1';
      if (!inField) grow(!!el.closest('a, button'));
    };
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget) { R.style.opacity = '0'; D.style.opacity = '0'; } };
    const onDown = () => { R.style.borderColor = t.accent; };

    addEventListener('mousemove', onMove, { passive: true });
    addEventListener('mouseout', onOut);
    addEventListener('mousedown', onDown);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('mousemove', onMove);
      removeEventListener('mouseout', onOut);
      removeEventListener('mousedown', onDown);
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  const base = { position: 'fixed' as const, top: 0, left: 0, pointerEvents: 'none' as const, zIndex: 999, opacity: 0 };
  return (
    <>
      <div ref={ring} style={{ ...base, width: 36, height: 36, margin: '-18px 0 0 -18px', borderRadius: '50%', border: '1px solid rgba(20,17,16,0.35)', transition: 'opacity 300ms ease, width 220ms cubic-bezier(.22,1,.36,1), height 220ms cubic-bezier(.22,1,.36,1), margin 220ms cubic-bezier(.22,1,.36,1), background-color 220ms ease, border-color 220ms ease' }} />
      <div ref={dot} style={{ ...base, width: 5, height: 5, margin: '-2.5px 0 0 -2.5px', borderRadius: '50%', background: t.accent, transition: 'opacity 300ms ease' }} />
    </>
  );
}
