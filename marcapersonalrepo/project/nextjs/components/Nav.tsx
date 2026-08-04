'use client';

import { useEffect, useState } from 'react';
import { t, waHref, igHref, mailHref, site } from '@/lib/site';
import { openChat, setMenuOpen } from '@/lib/chatBus';

const big = {
  display: 'block',
  fontFamily: t.font,
  fontSize: 'clamp(2.4rem,7vw,5rem)',
  fontWeight: 500,
  letterSpacing: '-0.014em',
  lineHeight: 1.05,
  textAlign: 'left' as const,
};

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => { setMenuOpen(open); }, [open]);

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
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: `clamp(104px,15vh,160px) ${t.gut} clamp(36px,6vh,64px)`, minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'clamp(40px,8vh,80px)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
            <p style={{ margin: '0 0 clamp(20px,3.5vh,36px)', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A938C' }}>
              Dónde quieres ir
            </p>

            {[
              { href: '/', n: '01', title: 'Mi historia', desc: 'Cómo pasé de vivir el plan de otros a tener el mío.' },
              { href: '/inversion', n: '02', title: 'Cómo te quiero ayudar', desc: 'Qué es, cuánto cuesta y qué dicen quienes ya lo tienen.' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ display: 'block', borderTop: '1px solid rgba(20,17,16,0.14)', padding: 'clamp(18px,3vh,30px) 0' }}
              >
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', color: t.accent, flex: 'none' }}>{item.n}</span>
                  <span style={{ ...big, flex: 1 }}>{item.title}</span>
                  <span style={{ fontSize: 'clamp(20px,2.5vw,28px)', color: t.accent, flex: 'none', lineHeight: 1 }}>→</span>
                </span>
                <span style={{ display: 'block', margin: '8px 0 0 26px', fontSize: 'clamp(14px,1.4vw,16.5px)', lineHeight: 1.5, color: 'rgba(20,17,16,0.6)', maxWidth: '34em' }}>
                  {item.desc}
                </span>
              </a>
            ))}

            <div style={{ borderTop: '1px solid rgba(20,17,16,0.14)', paddingTop: 'clamp(24px,4vh,40px)' }}>
              <button
                type="button"
                onClick={() => { setOpen(false); openChat(); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: t.ink, color: t.bg, fontSize: 'clamp(15px,1.5vw,17px)', fontWeight: 600, padding: '16px 30px', borderRadius: 999 }}
              >
                Reservar una llamada <span aria-hidden>→</span>
              </button>
              <p style={{ margin: '12px 0 0', fontSize: 13.5, color: 'rgba(20,17,16,0.55)' }}>
                20 minutos, sin compromiso. Te contesto yo.
              </p>
            </div>
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
