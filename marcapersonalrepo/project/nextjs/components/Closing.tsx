'use client';

import { t } from '@/lib/site';
import { openChat } from '@/lib/chatBus';

export default function Closing() {
  return (
    <section
      id="cierre"
      data-fin-pagina
      style={{
        position: 'relative', background: t.bg, color: t.ink, overflow: 'hidden',
        // El padding de abajo NO se pone aquí: lo pone globals.css, que le
        // suma el hueco que necesita la burbuja del asistente en móvil.
        paddingTop: 'clamp(64px,11vh,180px)',
        paddingLeft: t.gut, paddingRight: t.gut,
        ['--pb' as string]: 'clamp(48px,7vh,90px)',
      }}
    >
      {/* Dos luces de la paleta, rosa arriba y azul abajo, para que el cierre
          no quede en blanco y negro. */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(66% 52% at 50% 24%, rgba(201,164,171,0.34) 0%, rgba(201,164,171,0) 72%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(84% 48% at 50% 112%, rgba(44,62,90,0.18) 0%, rgba(44,62,90,0) 70%)' }} />
      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontFamily: t.font, fontSize: 'clamp(3.4rem,9vw,8rem)', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1 }}>¿Hablamos?</h2>
        <p style={{ margin: '3vh auto 0', fontSize: 'clamp(17px,1.7vw,21px)', lineHeight: 1.5, color: 'rgba(20,17,16,0.7)', maxWidth: '26ch', fontWeight: 450, letterSpacing: '-0.018em' }}>
          Una llamada, de mujer a mujer, sin compromiso. Si no es para ti, seré la primera en decírtelo.
        </p>
        <button type="button" onClick={openChat} style={{ marginTop: '4vh', background: t.ink, color: t.bg, fontSize: 16.5, fontWeight: 600, padding: '16px 34px', borderRadius: 999, transition: 'transform 250ms ease' }}>
          Hablar con Raquel
        </button>
        <p style={{ margin: '16px auto 0', maxWidth: '30ch', fontSize: 'clamp(10.5px,2.7vw,12.5px)', fontWeight: 500, letterSpacing: '0.13em', lineHeight: 1.7, textTransform: 'uppercase', color: '#6B6560' }}>
          Mi asistente te busca hueco en mi agenda
        </p>
      </div>
    </section>
  );
}
