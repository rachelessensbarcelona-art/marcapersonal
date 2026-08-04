'use client';

import { t } from '@/lib/site';
import { openChat } from '@/lib/chatBus';

export default function Closing() {
  return (
    <section id="cierre" style={{ position: 'relative', background: t.bg, color: t.ink, padding: `clamp(100px,16vh,180px) ${t.gut} clamp(56px,7vh,90px)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 50% at 50% 30%, rgba(206,122,87,0.09) 0%, rgba(206,122,87,0) 70%)' }} />
      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6560' }}>06 — Tu turno</p>
        <h2 style={{ margin: '2vh 0 0', fontFamily: t.font, fontSize: 'clamp(3.4rem,9vw,8rem)', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1 }}>¿Hablamos?</h2>
        <p style={{ margin: '3vh auto 0', fontSize: 'clamp(17px,1.7vw,21px)', lineHeight: 1.5, color: 'rgba(20,17,16,0.7)', maxWidth: '26ch', fontWeight: 450, letterSpacing: '-0.018em' }}>
          Veinte minutos, sin guion y sin compromiso. Si no es para ti, seré la primera en decírtelo.
        </p>
        <button type="button" onClick={openChat} style={{ marginTop: '4vh', background: t.ink, color: t.bg, fontSize: 16.5, fontWeight: 600, padding: '16px 34px', borderRadius: 999, transition: 'transform 250ms ease' }}>
          Hablar con Raquel
        </button>
        <p style={{ margin: '14px 0 0', fontSize: 12.5, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B6560' }}>
          Mi asistente te encuentra hueco en un minuto
        </p>
      </div>
    </section>
  );
}
