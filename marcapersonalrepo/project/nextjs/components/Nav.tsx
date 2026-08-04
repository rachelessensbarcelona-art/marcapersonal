'use client';

import { useEffect, useState } from 'react';
import { t, waHref, igHref, mailHref, site } from '@/lib/site';
import { openChat } from '@/lib/chatBus';

const big = {
  fontFamily: t.font,
  fontSize: 'clamp(2.4rem,7vw,5rem)',
  fontWeight: 500,
  letterSpacing: '-0.014em',
  lineHeight: 1.05,
  textAlign: 'left' as const,
};

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const bar = (flip: boolean) => ({
    display: 'block',
    width: open ? 24 : flip ? 17 : 26,
    height: 1.5,
    background: t.ink,
    transformOrigin: 'center',
    transition: 'transform 380ms cubic-bezier(.22,1,.36,1), width 380ms ease',
    transform: open ? `translateY(${flip ? -3.75 : 3.75}px) rotate(${flip ? -45 : 45}deg)` : 'none',
  });

  return (
    <>
      <nav id="xp-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `16px ${t.gut}`, color: t.ink, backdropFilter: 'blur(14px) saturate(1.4)', WebkitBackdropFilter: 'blur(14px) saturate(1.4)', background: 'rgba(251,249,246,0.6)', borderBottom: '1px solid rgba(20,17,16,0.07)' }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.02em' }}>{site.name}</span>
        <button type="button" aria-label="Abrir menú" onClick={() => setOpen((v) => !v)} style={{ width: 44, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
          <span style={bar(false)} />
          <span style={bar(true)} />
        </button>
      </nav>

      <div style={{ position: 'fixed', inset: 0, zIndex: 90, overflowY: 'auto', background: 'rgba(251,249,246,0.97)', backdropFilter: 'blur(22px) saturate(1.5)', WebkitBackdropFilter: 'blur(22px) saturate(1.5)', color: t.ink, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transform: open ? 'translateY(0)' : 'translateY(-12px)', transition: 'opacity 420ms cubic-bezier(.22,1,.36,1), transform 480ms cubic-bezier(.22,1,.36,1)' }}>
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          style={{ position: 'absolute', top: 14, right: t.gut, width: 46, height: 46, borderRadius: '50%', border: '1px solid rgba(20,17,16,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 300, lineHeight: 1, color: t.ink, transition: 'border-color 250ms ease, background-color 250ms ease' }}
        >
          ×
        </button>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: `clamp(96px,14vh,150px) ${t.gut} clamp(36px,6vh,64px)`, minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 40 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'clamp(8px,1.8vh,18px)' }}>
            <a href="/" style={big} onClick={() => setOpen(false)}>Inicio</a>
            <a href="/inversion" style={big}>Cómo te quiero ayudar</a>
            <button
              type="button"
              onClick={() => { setOpen(false); openChat(); }}
              style={{ marginTop: 'clamp(14px,2.6vh,26px)', fontSize: 'clamp(15px,1.5vw,18px)', fontWeight: 500, borderBottom: `1px solid ${t.accent}`, paddingBottom: 3, color: t.accent, textAlign: 'left' }}
            >
              Reservar una llamada conmigo →
            </button>
          </nav>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 26px', alignItems: 'center', borderTop: `1px solid ${t.hair}`, paddingTop: 20, fontSize: 12.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <a href={waHref()} target="_blank" rel="noopener">WhatsApp</a>
            <a href={igHref} target="_blank" rel="noopener">Instagram</a>
            <a href={mailHref}>Correo</a>
            <span style={{ marginLeft: 'auto', color: '#6B6560' }}>© {new Date().getFullYear()} {site.name}</span>
          </div>
        </div>
      </div>
    </>
  );
}
