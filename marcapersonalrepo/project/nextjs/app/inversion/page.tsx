import type { Metadata } from 'next';
import Faq from '@/components/Faq';
import BookLink from '@/components/BookLink';
import Reveal from '@/components/Reveal';
import Contador from '@/components/Contador';
import Testimonios from '@/components/Testimonios';
import { BarrasCoste, Amortizacion, ComoFunciona } from '@/components/Graficos';
import VideoPresentacion from '@/components/VideoPresentacion';
import { t, waHref, videoVertical } from '@/lib/site';

export const metadata: Metadata = {
  title: 'La inversión — Raquel Rodríguez',
  description: 'El precio, la financiación, los testimonios y el negocio. Escrito, sin llamadas.',
};

const wrap = { maxWidth: 1180, margin: '0 auto' } as const;
const hair = '1px solid ' + t.hair;
const h2: React.CSSProperties = { margin: 0, fontSize: 'clamp(1.5rem,2.8vw,2.3rem)', fontWeight: 600, letterSpacing: '-0.03em' };
const micro: React.CSSProperties = { fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase' };

const MARCAS = [
  { m: 'Bezoya', l: '0,72 €', y: '2.102 €', k: '42.048 €' },
  { m: 'Font Vella', l: '0,74 €', y: '2.161 €', k: '43.216 €' },
  { m: 'Lanjarón', l: '0,76 €', y: '2.219 €', k: '44.384 €' },
];

const INCLUYE: [string, string, string][] = [
  ['01', 'El equipo completo', 'Aparato, filtro, mangueras y adaptadores de grifo. Nada que comprar aparte.'],
  ['02', 'Garantía oficial', 'Cobertura y servicio técnico del fabricante, una marca japonesa con más de cincuenta años.'],
  ['03', 'Yo, al otro lado', 'Te guío al conectarlo y te enseño a usar las cuatro aguas. Sin coste y sin fecha de caducidad.'],
  ['04', '14 días para pensarlo', 'Derecho de desistimiento, como en cualquier compra a distancia en España.'],
];

const NEGOCIO: [string, string, string][] = [
  ['01', 'Sin stock, sin local, sin inventario.', 'Todo se lleva desde el móvil.'],
  ['02', 'Recomiendas algo que ya usas.', 'El aparato está en tu cocina y lo usas cada día. No vendes nada que no conozcas.'],
  ['03', 'Un modelo de más de cincuenta años.', 'La marca funciona igual desde los años setenta. No es la moda de este trimestre.'],
  ['04', 'Te formo yo.', 'Con lo que aprendí montando mi propio equipo. Los errores caros ya los cometí yo.'],
];

export default function Inversion() {
  return (
    <main style={{ background: t.bg, color: t.ink }}>
      <header style={{ padding: `clamp(104px,15vh,168px) ${t.gut} clamp(40px,6vh,72px)` }}>
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 'clamp(14px,2.4vh,26px)' }}>
            <span style={{ ...micro, letterSpacing: '0.2em', color: t.accent }}>01</span>
            <span style={{ ...micro, letterSpacing: '0.2em', color: '#6B6560' }}>Lo que uso en mi casa</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px 48px' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(2.3rem,6vw,5.4rem)', fontWeight: 500, letterSpacing: '-0.022em', lineHeight: 0.98, maxWidth: '17ch' }}>
              Míralo antes<br /><span style={{ color: t.accent }}>de decidir nada.</span>
            </h1>
            <p style={{ margin: 0, fontSize: 'clamp(15.5px,1.4vw,18px)', lineHeight: 1.6, color: t.soft, maxWidth: '34ch' }}>
              Dos minutos de vídeo, sin efectos: qué es, cómo se conecta y qué hace en una cocina normal. Debajo, los números completos.
            </p>
          </div>

          {/* El marco sigue la forma del video. Con uno vertical, un marco 16:9
              deja dos bandas negras enormes a los lados; con este no. Y el fondo
              va oscuro para que cualquier banda que quede parezca intencionada. */}
          <figure style={{
            margin: 'clamp(28px,4.5vh,56px) auto 0',
            position: 'relative', borderRadius: 22, overflow: 'hidden',
            border: hair, background: t.deep,
            aspectRatio: videoVertical ? '9 / 16' : '16 / 9',
            maxWidth: videoVertical ? 'min(100%, 420px)' : '100%',
          }}>
            <VideoPresentacion />
          </figure>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 'clamp(22px,3.4vh,38px)', alignItems: 'center' }}>
            <a href="#precio" style={{ background: t.ink, color: t.bg, borderRadius: 999, padding: '14px 26px', fontSize: 15, fontWeight: 600 }}>Ver el precio</a>
            <a href="#negocio" style={{ border: hair, borderRadius: 999, padding: '14px 26px', fontSize: 15, fontWeight: 500 }}>Y si quiero venderlo</a>
          </div>
        </div>
      </header>

      <section style={{ padding: '0 5vw clamp(58px,8vh,94px)' }}>
        <div style={wrap}>
          <div style={{ borderTop: hair, paddingTop: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px 32px' }}>
            <h2 style={h2}>Primero, lo que ya gastas</h2>
            <p style={{ ...micro, margin: 0, letterSpacing: '0.18em', color: t.soft }}>Familia de 4 · 8 litros al día</p>
          </div>
          <div style={{ overflowX: 'auto', marginTop: 24 }}>
            <div style={{ minWidth: 600 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr .8fr 1fr 1.2fr', gap: 24, paddingBottom: 12, ...micro, color: 'rgba(20,17,16,0.42)' }}>
                <span>Marca</span><span>€ / litro</span><span>Al año</span><span>En 20 años</span>
              </div>
              {MARCAS.map((r, i) => (
                <Reveal key={r.m} delay={i * 90} y={16} style={{ display: 'grid', gridTemplateColumns: '1.3fr .8fr 1fr 1.2fr', gap: 24, alignItems: 'baseline', borderTop: hair, borderBottom: i === MARCAS.length - 1 ? hair : undefined, padding: '19px 0' }}>
                  <span style={{ fontSize: 16.5, fontWeight: 500 }}>{r.m}</span>
                  <span style={{ fontSize: 14, color: t.soft }}>{r.l}</span>
                  <span style={{ fontSize: 15 }}>{r.y}</span>
                  <span style={{ fontSize: 17, fontWeight: 600, color: t.accent }}>{r.k}</span>
                </Reveal>
              ))}
            </div>
          </div>
          <p style={{ ...micro, margin: '14px 0 0', color: 'rgba(20,17,16,0.38)' }}>
            Precio de botella de litro en supermercado · Y esto es solo el agua de beber
          </p>

          <Reveal delay={120} style={{ marginTop: 'clamp(38px,6vh,64px)' }}>
            <h3 style={{ ...h2, fontSize: 'clamp(1.3rem,2.2vw,1.8rem)', marginBottom: 22 }}>
              Verlo de un vistazo
            </h3>
            <BarrasCoste />
          </Reveal>

          <Reveal delay={120} style={{ marginTop: 'clamp(38px,6vh,64px)' }}>
            <h3 style={{ ...h2, fontSize: 'clamp(1.3rem,2.2vw,1.8rem)', marginBottom: 8 }}>
              ¿Cuándo deja de costarte dinero?
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.65, color: t.soft, maxWidth: '52ch' }}>
              Las dos líneas son lo que llevas gastado. Donde se cruzan, el equipo ya se ha pagado solo.
            </p>
            <Amortizacion />
          </Reveal>
        </div>
      </section>

      <section id="precio" style={{ background: t.deep, color: '#F4EBED', padding: `clamp(64px,10vh,120px) ${t.gut}`, scrollMarginTop: 74, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 78% 30%, rgba(201,164,171,0.20) 0%, rgba(201,164,171,0) 70%)' }} />
        <div style={{ ...wrap, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 'clamp(30px,4.5vw,64px)', alignItems: 'center' }}>
          <Reveal>
            <p style={{ ...micro, margin: '0 0 16px', letterSpacing: '0.22em', color: 'rgba(244,235,237,0.6)' }}>El equipo con el que trabajo</p>
            <p style={{ margin: 0, fontSize: 'clamp(3.4rem,8vw,6.4rem)', fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 0.95, color: '#F4EBED' }}>
              <Contador hasta={5600} sufijo=" €" />
            </p>
            <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10, ...micro, letterSpacing: '0.14em', color: 'rgba(244,235,237,0.65)' }}>
              <span>Pago único · 15–20 años de vida útil</span>
              <span>Financiación directa del fabricante</span>
              <span>Filtro: 95 € ≈ una vez al año</span>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ margin: '0 0 20px', fontSize: 'clamp(16px,1.4vw,18.5px)', lineHeight: 1.7, color: 'rgba(244,235,237,0.78)' }}>
              No es un gasto nuevo: es mover el que ya tienes a algo que se queda en tu casa dos décadas. Y súmale parte de lo que gastas en limpieza, que estas aguas también sustituyen.
            </p>
            <p style={{ margin: 0, fontSize: 'clamp(17px,1.5vw,20px)', lineHeight: 1.6, fontWeight: 600, color: t.roseSoft }}>
              Es caro. No voy a fingir que no. Por eso lo lees aquí y no escondido detrás de una llamada.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '0 5vw clamp(58px,8vh,94px)' }}>
        <div style={wrap}>
          <h2 style={{ ...h2, borderTop: hair, paddingTop: 28, marginBottom: 26 }}>Qué entra en ese precio</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 18 }}>
            {INCLUYE.map(([n, ti, body], i) => (
              <Reveal key={n} delay={i * 80} style={{ border: hair, borderRadius: 18, padding: 24, background: 'rgba(232,212,216,0.18)' }}>
                <p style={{ ...micro, margin: '0 0 10px', letterSpacing: '0.2em', color: t.accent }}>{n}</p>
                <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>{ti}</p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: t.soft }}>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonios" style={{ background: 'linear-gradient(180deg, rgba(232,212,216,0.42) 0%, rgba(232,212,216,0.12) 100%)', padding: `clamp(58px,8vh,94px) ${t.gut}`, scrollMarginTop: 74 }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={{ ...h2, marginBottom: 12 }}>Lo que dicen quienes ya lo tienen</h2>
            <p style={{ margin: '0 0 30px', fontSize: 15.5, lineHeight: 1.65, color: t.soft, maxWidth: '56ch' }}>
              Solo publico experiencias reales, con nombre y permiso por escrito. Ninguna dice que el agua cure nada, porque no lo hace.
            </p>
          </Reveal>
          <Reveal delay={120}><Testimonios /></Reveal>
        </div>
      </section>

      <section id="negocio" style={{ padding: '0 5vw clamp(58px,8vh,94px)', scrollMarginTop: 74 }}>
        <div style={wrap}>
          <div style={{ borderTop: hair, paddingTop: 28 }}>
            <p style={{ ...micro, letterSpacing: "0.2em", color: t.accent, margin: "0 0 14px" }}>La otra puerta</p>
            <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(1.7rem,3.6vw,3.1rem)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.08, maxWidth: '22ch' }}>
              El mismo aparato que tienes en casa puede ser tu negocio
            </h2>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: t.soft, maxWidth: '52ch' }}>
              No todo el mundo llega hasta aquí, y está bien. Yo empecé siendo clienta; me hice distribuidora independiente en 2021 y hoy tengo equipo en varios países.
            </p>
          </div>
          <Reveal delay={100} style={{ marginTop: 'clamp(34px,5vh,54px)' }}>
            <h3 style={{ ...h2, fontSize: 'clamp(1.3rem,2.2vw,1.8rem)', marginBottom: 26 }}>
              Cómo funciona, paso a paso
            </h3>
            <ComoFunciona />
          </Reveal>

          <div style={{ marginTop: 'clamp(34px,5vh,54px)' }}>
            {NEGOCIO.map(([n, ti, body], i) => (
              <Reveal key={n} delay={i * 80} y={14} style={{ borderTop: hair, borderBottom: i === NEGOCIO.length - 1 ? hair : undefined, padding: '22px 0', display: 'grid', gridTemplateColumns: 'minmax(34px,42px) 1fr', gap: 20 }}>
                <span style={{ ...micro, letterSpacing: '0.14em', color: 'rgba(20,17,16,0.4)', paddingTop: 4 }}>{n}</span>
                <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65 }}>
                  <strong style={{ fontWeight: 600 }}>{ti}</strong> <span style={{ color: t.soft }}>{body}</span>
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 30, background: t.deep, color: '#F4EBED', borderRadius: 18, padding: 'clamp(24px,3.4vw,38px)' }}>
            <p style={{ ...micro, letterSpacing: "0.2em", color: t.rose, margin: "0 0 12px" }}>Lo que no te voy a prometer</p>
            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, maxWidth: '62ch' }}>
              Ni una cifra de ingresos, ni un plazo, ni que dejes tu trabajo. Esto es vender, y vender es un oficio que se tarda en aprender. Si buscas algo rápido o pasivo, esto no lo es.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '0 5vw clamp(66px,9vh,104px)' }}>
        <div style={wrap}>
          <h2 style={{ ...h2, borderTop: hair, paddingTop: 28, marginBottom: 24 }}>Las preguntas del dinero</h2>
          <Faq />
          <div style={{ marginTop: 'clamp(38px,6vh,60px)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 20px', fontSize: 'clamp(16.5px,1.8vw,21px)', fontWeight: 500, letterSpacing: '-0.015em' }}>
              ¿Te cuadran los números? Hablemos de lo importante.
            </p>
            <BookLink />
            <p style={{ margin: '18px 0 0', fontSize: 12, color: 'rgba(20,17,16,0.4)' }}>
              O escríbeme por{' '}
              <a href={waHref('Hola Raquel, vengo de la página de la inversión.')} target="_blank" rel="noopener" style={{ borderBottom: '1px solid rgba(20,17,16,0.25)' }}>WhatsApp</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
