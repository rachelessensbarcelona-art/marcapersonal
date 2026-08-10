'use client';

import { useEffect, useRef } from 'react';
import { t } from '@/lib/site';

type Formation = { x: number; y: number; kind: 'dot' | 'ring'; key: string; a: number; r?: number; rr?: number; rot?: number };
type P = { hx: number; hy: number; x: number; y: number; r: number; ph: number; sp: number; a: number; rot: number };

const hexRgb = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const sm = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const eo = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

const BANDS = [
  { title: 'Mi tiempo', body: 'Mi propio negocio.', rgb: '30,45,66', a: 0.34 },
  { title: 'Mi gente', body: 'Mujeres que han cambiado y evolucionado conmigo.', rgb: '74,97,120', a: 0.34 },
  { title: 'Mi familia', body: 'Mi prioridad.', rgb: '201,164,171', a: 0.46 },
  { title: 'Mi vida', body: 'Como yo la quiero vivir.', rgb: '232,212,216', a: 0.62 },
];

const STORY_WORDS = 'Hasta que todo cambió. Empecé pensando en mí, en mi casa, sin contárselo a nadie. Fueron meses de constancia, presentaciones hasta altas horas de la madrugada con equipos del otro lado del mundo.'.split(' ');
const ACCENT_WORDS = /cambió\.|mí,|Hasta/;

export default function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const track = trackRef.current!, stage = stageRef.current!, canvas = canvasRef.current!;
    const cache: Record<string, HTMLElement | null> = {};
    const q = (sel: string) => (cache[sel] !== undefined ? cache[sel] : (cache[sel] = document.querySelector<HTMLElement>(sel)));

    const chs = Array.from(document.querySelectorAll<HTMLElement>('[data-ch]'));
    const hlines = Array.from(document.querySelectorAll<HTMLElement>('[data-hline]'));
    const bands = Array.from(document.querySelectorAll<HTMLElement>('[data-band]'));
    const bandLabels = Array.from(document.querySelectorAll<HTMLElement>('[data-bandlabel]'));
    const railBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-rail]'));
    const words = Array.from(document.querySelectorAll<HTMLElement>('[data-wseq] span'));

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function layout() {
      const narrow = innerWidth < 860;
      esMovil = narrow;
      const nav = document.getElementById('xp-nav');
      const safe = Math.round((nav ? nav.getBoundingClientRect().height : 60) + 22);
      chs.forEach((el) => {
        el.style.boxSizing = 'border-box';
        el.style.paddingTop = safe + 'px';
        const cs = getComputedStyle(el);
        if (cs.display === 'flex') {
          if (cs.flexDirection === 'column') el.style.justifyContent = 'safe center';
          else el.style.alignItems = 'safe center';
        }
      });
      const head2 = document.querySelector<HTMLElement>('[data-ch2-head]');
      if (head2) { head2.style.boxSizing = 'border-box'; head2.style.paddingTop = safe + 18 + 'px'; }
      const split = document.querySelector<HTMLElement>('[data-hero-split]');
      const txt = document.querySelector<HTMLElement>('[data-hero-text]');
      const h1 = document.querySelector<HTMLElement>('[data-hero-h1]');
      const img = document.querySelector<HTMLImageElement>('[data-hero-photo]');
      if (split && txt && h1 && img) {
        // En movil la foto va arriba, entera y nitida, y el texto debajo sobre
        // fondo solido: ella se ve y el texto se lee, sin pisarse.
        split.style.gridTemplateColumns = narrow ? '1fr' : '52% 48%';
        split.style.gridTemplateRows = narrow ? 'minmax(0,38vh) 1fr' : 'none';
        txt.style.padding = narrow ? `clamp(19px,3vh,28px) ${t.gut} 15vh` : `clamp(72px,10vh,112px) clamp(28px,3.5vw,64px) clamp(76px,10vh,100px) 7vw`;
        txt.style.gridArea = narrow ? '2 / 1' : 'auto';
        txt.style.justifyContent = narrow ? 'flex-start' : 'safe center';
        h1.style.fontSize = narrow ? 'clamp(2rem,9.4vw,3rem)' : 'clamp(2.2rem,min(7.4vw,8.6vh),7.6rem)';
        const wrapImg = document.querySelector<HTMLElement>('[data-hero-img]');
        if (wrapImg) {
          wrapImg.style.gridArea = narrow ? '1 / 1' : 'auto';
          wrapImg.style.opacity = '1';
        }
        img.style.objectPosition = narrow ? '50% 12%' : '42% 8%';
        const fx = document.querySelector<HTMLElement>('[data-hero-fade-x]');
        if (fx) fx.style.opacity = narrow ? '0' : '1';
        const fy = document.querySelector<HTMLElement>('[data-hero-fade-y]');
        if (fy) fy.style.height = narrow ? '46%' : '16%';
        const bar = document.querySelector<HTMLElement>('[data-hero-bar]');
        if (bar) {
          bar.style.right = narrow ? t.gut : 'calc(48vw + 28px)';
          bar.style.display = narrow ? 'none' : 'flex';
        }
      }
      // Capitulo 5: en movil el titular baja de tamano, los pasos se aprietan y
      // se reserva sitio abajo para que la burbuja del chat no pise el texto.
      const ch5 = document.querySelector<HTMLElement>('[data-ch="4"]');
      const t5 = document.querySelector<HTMLElement>('[data-ch5-title]');
      const g5 = document.querySelector<HTMLElement>('[data-ch5-grid]');
      const caja5 = document.querySelector<HTMLElement>('[data-ch5-caja]');
      if (ch5 && t5 && g5) {
        t5.style.fontSize = narrow ? 'clamp(1.28rem,5.1vw,1.7rem)' : 'clamp(2rem,3.8vw,3.6rem)';
        t5.style.margin = narrow ? '1.2vh 0 0 0' : '2.2vh 0 0 0';
        const s5 = document.querySelector<HTMLElement>('[data-ch5-sub]');
        if (s5) { s5.style.fontSize = narrow ? '15.5px' : 'clamp(16.5px,1.35vw,19px)'; s5.style.margin = narrow ? '1.2vh 0 0 0' : '1.8vh 0 0 0'; }
        g5.style.gap = narrow ? '11px' : 'clamp(19px,2.4vw,34px)';
        g5.style.marginTop = narrow ? '1.6vh' : 'clamp(24px,4vh,46px)';
        // Sitio para la burbuja de Raquel: la foto (54) + su margen (16) + aire.
        ch5.style.paddingBottom = narrow ? '88px' : '';

        // Si aun asi no cabe (moviles bajitos tipo iPhone SE), el bloque se
        // encoge lo justo. El margen negativo compensa el hueco que deja el
        // encogido, para que siga quedando centrado y no se descuadre.
        // Si no cabe, primero se retiran las explicaciones de los tres pasos
        // (los titulos solos ya cuentan el proceso, y el detalle esta en la
        // pagina de precios). Encoger la letra seria el ultimo recurso: para
        // esta audiencia, un texto diminuto es un texto que nadie lee.
        const cuerpos = Array.from(ch5.querySelectorAll<HTMLElement>('[data-step] p:nth-of-type(3)'));
        if (caja5) {
          cuerpos.forEach((el) => { el.style.display = ''; });
          caja5.style.transform = 'none';
          caja5.style.marginBottom = '';
          const encoger = (k: number) => {
            caja5.style.transform = `scale(${k.toFixed(3)})`;
            caja5.style.marginBottom = `${-Math.round(caja5.scrollHeight * (1 - k))}px`;
          };
          if (narrow) {
            const cs5 = getComputedStyle(ch5);
            const libre = ch5.clientHeight - parseFloat(cs5.paddingTop) - parseFloat(cs5.paddingBottom);
            let alto = caja5.scrollHeight;
            if (libre > 0 && alto > libre) {
              const roce = libre / alto;
              if (roce >= 0.93) {
                // Le falta muy poco: un pellizco que no se nota al leer.
                encoger(roce);
              } else {
                // Le falta de verdad: se van las explicaciones y todo lo que
                // queda se lee a tamano completo.
                cuerpos.forEach((el) => { el.style.display = 'none'; });
                alto = caja5.scrollHeight;
                if (alto > libre) encoger(Math.max(0.9, libre / alto));
              }
            }
          }
        }
      }

      // Las rayitas de capitulo estorban en movil: fuera. Queda la barra de abajo.
      const rail = document.getElementById('xp-rail');
      if (rail) rail.style.display = narrow ? 'none' : 'flex';
      const c2 = document.querySelector<HTMLElement>('[data-ch="3"]');
      const head = document.querySelector<HTMLElement>('[data-ch2-head]');
      const grid = document.querySelector<HTMLElement>('[data-bands-grid]');
      if (c2 && head && grid) {
        if (narrow) {
          c2.style.display = 'flex'; c2.style.flexDirection = 'column'; c2.style.justifyContent = 'safe center'; c2.style.padding = `${safe}px ${t.gut} 5vh`; c2.style.boxSizing = 'border-box';
          head.style.position = 'relative'; head.style.inset = 'auto'; head.style.padding = '0'; head.style.flex = 'none';
          grid.style.position = 'relative'; grid.style.inset = 'auto'; grid.style.gridTemplateColumns = 'repeat(2,1fr)'; grid.style.marginTop = '3.5vh'; grid.style.minHeight = '42vh'; grid.style.borderRadius = '14px'; grid.style.overflow = 'hidden';
        } else {
          c2.style.display = ''; c2.style.flexDirection = ''; c2.style.justifyContent = ''; c2.style.padding = `${safe}px 0 0`;
          head.style.position = 'absolute'; head.style.inset = '0'; head.style.padding = `${safe + 18}px ${t.gut} 0`; head.style.flex = '';
          grid.style.position = 'absolute'; grid.style.inset = '0'; grid.style.gridTemplateColumns = 'repeat(4,1fr)'; grid.style.marginTop = '0'; grid.style.minHeight = ''; grid.style.borderRadius = '0';
        }
      }
      const por = document.querySelector<HTMLElement>('[data-portrait]');
      const wseq = document.querySelector<HTMLElement>('[data-wseq]');
      if (por && wseq) {
        // En movil ella tambien sale: la foto va arriba, redonda y compacta,
        // y la frase debajo. Antes se escondia y la historia quedaba sin cara.
        const c3 = document.querySelector<HTMLElement>('[data-ch="2"]');
        const marco = document.querySelector<HTMLElement>('[data-portrait-marco]');
        const pie = document.querySelector<HTMLElement>('[data-portrait-pie]');
        por.style.display = 'block';
        if (c3) { c3.style.flexDirection = narrow ? 'column' : 'row'; c3.style.gap = narrow ? '2.2vh' : '5vw'; }
        por.style.order = narrow ? '-1' : '0';
        por.style.flex = narrow ? 'none' : '1 1 0';
        por.style.width = narrow ? 'min(42vw,164px)' : 'auto';
        por.style.maxWidth = narrow ? 'none' : '420px';
        por.style.alignSelf = narrow ? 'flex-start' : 'auto';
        if (marco) { marco.style.aspectRatio = narrow ? '1 / 1' : '4 / 5'; marco.style.borderRadius = narrow ? '999px' : '24px'; }
        if (pie) pie.style.display = narrow ? 'none' : 'block';

        // La historia es larga: la letra se ata tambien al alto de la ventana,
        // que si no en portatiles se sale por abajo.
        wseq.style.fontSize = narrow ? 'clamp(1.18rem,4.7vw,1.6rem)' : 'clamp(1.3rem,min(2.9vw,3.9vh),2.7rem)';
        wseq.style.maxWidth = narrow ? '100%' : '17em';
        wseq.style.lineHeight = '1.18';
        const dis = document.querySelector<HTMLElement>('[data-disclaimer="1"]');
        if (dis) dis.style.margin = narrow ? '2vh 0 0 0' : '2.4vh 0 0 0';
      }
      const short = innerHeight < 640;
      const sub2 = document.querySelector<HTMLElement>('[data-hero-sub="1"] p + p');
      if (sub2) sub2.style.display = short ? 'none' : 'block';
      const q1 = document.querySelector<HTMLElement>('[data-ch1-q]');
      const d1 = document.querySelector<HTMLElement>('[data-ch1-d]');
      if (q1 && d1) { q1.style.maxWidth = narrow ? '18em' : '15em'; d1.style.maxWidth = narrow ? '30em' : '24em'; }
    }

    function staticLayout() {
      track.style.height = 'auto';
      stage.style.position = 'relative'; stage.style.height = 'auto'; stage.style.overflow = 'visible';
      canvas.style.display = 'none';
      const rail = document.getElementById('xp-rail'); if (rail) rail.style.display = 'none';
      const bgs = ['#FBF9F6', '#F8F6F2', '#F5F3EF', '#FBF9F6', '#F8F6F2'];
      chs.forEach((c, i) => { c.style.position = 'relative'; c.style.opacity = '1'; c.style.minHeight = '100vh'; c.style.background = bgs[i]; });
      hlines.forEach((l) => { l.style.transform = 'none'; });
      bands.forEach((b) => { b.style.transform = 'scaleY(1)'; });
      bandLabels.forEach((b) => { b.style.opacity = '1'; });
      const big = document.querySelector<HTMLElement>('[data-big="dias"]'); if (big) big.textContent = '7.300';
      const dis = document.querySelector<HTMLElement>('[data-disclaimer="1"]'); if (dis) dis.style.opacity = '1';
      document.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
      layout();
    }

    if (reduced) { staticLayout(); return; }

    words.forEach((w) => { w.style.display = 'inline-block'; w.style.opacity = '0.16'; w.style.transform = 'translateY(0.3em)'; });

    const onRailClick = (i: number) => () => {
      const seg = (track.offsetHeight - innerHeight) / 5;
      window.scrollTo({ top: track.offsetTop + seg * i + (i ? seg * 0.42 : 0), behavior: 'smooth' });
    };
    const railHandlers = railBtns.map((b, i) => { const h = onRailClick(i); b.addEventListener('click', h); return h; });

    let introPlayed = false;
    function playIntro() {
      hlines.forEach((l, i) => {
        l.style.transform = 'translateY(112%)';
        l.animate([{ transform: 'translateY(112%)' }, { transform: 'translateY(0)' }], { duration: 1050, delay: 200 + i * 130, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' });
      });
      document.querySelectorAll<HTMLElement>('[data-hero-sub]').forEach((sub, i) => {
        sub.style.opacity = '0';
        sub.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 800, delay: 900 + i * 240, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' });
      });
      setTimeout(() => { introPlayed = true; }, 1700);
    }

    // ---------- particles
    const accentRgb = hexRgb(t.accent);
    const cols: Record<string, string> = { bone: '20,17,16', terra: accentRgb.join(','), ph0: '30,45,66', ph1: '74,97,120', ph2: '201,164,171', ph3: '201,164,171' };
    const N = 96;
    const ps: P[] = Array.from({ length: N }, () => ({
      hx: Math.random(), hy: Math.random(), x: Math.random(), y: Math.random(),
      r: 0.9 + Math.random() * 1.6, ph: Math.random() * Math.PI * 2,
      sp: 0.5 + Math.random(), a: 0, rot: 0,
    }));

    let cw = 0, chh = 0, ctx = canvas.getContext('2d')!;
    function sizeCanvas() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      cw = stage.clientWidth; chh = stage.clientHeight;
      canvas.width = cw * dpr; canvas.height = chh * dpr;
      ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function formation(p: P, i: number, mode: number, time: number, hold: number): Formation {
      const w = cw, h = chh;
      const off: Formation = { x: -120, y: -120, kind: 'dot', key: 'bone', a: 0, r: p.r };

      if (mode === 0) { // La pregunta — un iris que respira y unas pocas ascuas subiendo
        if (i === 0) { const breathe = 1 + Math.sin(time * 0.24) * 0.07; return { x: w * 0.33, y: h * 0.5, kind: 'ring', key: 'bone', a: 0.13, rr: Math.min(w, h) * 0.34 * breathe }; }
        if (i === 1) { const breathe = 1 + Math.sin(time * 0.24 + 1.2) * 0.09; return { x: w * 0.33, y: h * 0.5, kind: 'ring', key: 'terra', a: 0.1, rr: Math.min(w, h) * 0.52 * breathe }; }
        if (i > 12) return off;
        const rise = (p.hy + time * 0.014 * p.sp) % 1;
        return { x: (0.06 + p.hx * 0.4) * w + Math.sin(time * 0.5 + p.ph) * 12, y: (1.05 - rise * 1.14) * h, kind: 'dot', key: i % 4 === 0 ? 'terra' : 'bone', a: 0.34 * Math.min(1, rise * 4), r: p.r * 1.1 };
      }
      if (mode === 1) { // Mi punto de partida — rejilla de horas, casi todas apagadas
        const n = ps.length, colsN = 12, rows = Math.ceil(n / colsN);
        const ci = i % colsN, ri = Math.floor(i / colsN);
        const d = ((i * 7919) % n) / n;
        const e = Math.min(1, Math.max(0, (hold * 1.35 - d) / 0.26));
        const eov = 1 - Math.pow(1 - e, 3);
        const gx = 0.5 + (ci - (colsN - 1) / 2) * (Math.min(w, h) * 0.052) / w;
        const gy = 0.52 + (ri - (rows - 1) / 2) * (Math.min(w, h) * 0.052) / h;
        const mine = i % 9 === 0;
        return { x: gx * w, y: (gy - (1 - eov) * 0.1) * h, kind: 'dot', key: mine ? 'terra' : 'bone', a: e <= 0 ? 0 : (mine ? 0.6 : 0.13) * eov, r: mine ? p.r * 1.5 : p.r * 0.85 };
      }
      if (mode === 2) { // El giro — una trayectoria que se dobla hacia arriba
        if (i > 33) return off;
        const u = i / 34;
        const bend = Math.min(1, Math.max(0, (hold - 0.12) / 0.55));
        const flat = 0.72;
        const turn = flat - Math.pow(Math.max(0, u - 0.42) / 0.58, 1.7) * 0.46 * bend;
        const wob = Math.sin(time * 0.7 + u * 5) * 3;
        const past = u < 0.42;
        return { x: (0.07 + u * 0.86) * w, y: turn * h + wob, kind: 'dot', key: past ? 'bone' : 'terra', a: past ? 0.2 : 0.24 + 0.4 * bend, r: past ? p.r * 0.85 : p.r * 1.25 };
      }
      if (mode === 3) { // Lo que cambió — cuatro columnas, una por cosa
        const col = i % 4, cx = (col + 0.5) / 4;
        if (i < 4) {
          const rise = ((0.2 + p.hy * 0.5 - time * 0.03) % 1 + 1) % 1;
          return { x: cx * w, y: (0.15 + rise * 0.7) * h, kind: 'ring', key: 'ph' + col, a: 0.26, rr: Math.min(w / 4.6, 150) };
        }
        if (i > 27) return off;
        const rise = ((p.hy - time * 0.022 * p.sp) % 1 + 1) % 1;
        return { x: (cx + (p.hx - 0.5) * 0.14) * w + Math.sin(time * 0.7 + p.ph) * 5, y: rise * h, kind: 'dot', key: 'ph' + col, a: 0.45, r: p.r * 1.1 };
      }
      // Y ahora tú — tres nodos y el camino entre ellos
      if (i < 3) {
        const on = Math.min(1, Math.max(0, (hold - 0.1 - i * 0.16) / 0.3));
        const pulse = 1 + Math.sin(time * 0.8 + i * 1.6) * 0.06;
        return { x: (0.2 + i * 0.3) * w, y: h * 0.5, kind: 'ring', key: i === 2 ? 'terra' : 'bone', a: 0.1 + 0.12 * on, rr: Math.min(w, h) * 0.15 * pulse * (0.75 + 0.25 * on) };
      }
      if (i > 26) return off;
      const u = (i - 3) / 24;
      const flow = (u + time * 0.045) % 1;
      return { x: (0.2 + flow * 0.6) * w, y: h * 0.5 + Math.sin(flow * 6.2832 + time * 0.5) * h * 0.035, kind: 'dot', key: flow > 0.66 ? 'terra' : 'bone', a: 0.16 + 0.3 * Math.sin(flow * 3.14), r: p.r * 1.1 };
    }

    // ---------- main loop
    let lastS = scrollY, energy = 1, pt = -9, cleared = false, active = -1, raf = 0;
    let esMovil = innerWidth < 860;
    const t0 = performance.now();

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      const time = (now - t0) / 1000;
      const vh = innerHeight;
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - vh;
      const s = Math.min(Math.max(-rect.top, 0), total);
      const v = Math.abs(s - lastS); lastS = s;
      // Movimiento constante: no depende de lo rapido que hagas scroll.
      energy = 1;
      const tt = s / (total / 5);

      if (rect.bottom <= 0 || rect.top > vh) {
        if (!cleared) { ctx.clearRect(0, 0, cw, chh); cleared = true; }
        return;
      }
      const moved = Math.abs(tt - pt) > 0.0004;
      pt = tt;

      if (moved) {
        // Cada capitulo respira un color distinto de la paleta, muy suave:
        // crema, azul, rosa, azul y rosa. Sin llegar a distraer, pero el
        // recorrido deja de ser todo blanco.
        const bgs = [[251, 249, 246], [244, 246, 250], [250, 244, 246], [243, 246, 251], [250, 245, 247]];
        const bi = Math.min(4, Math.floor(tt)), bp = tt - bi;
        const nb = Math.min(4, bi + 1);
        const mix = sm((bp - 0.62) / 0.38);
        const bg = bgs[bi].map((c, j) => Math.round(c + (bgs[nb][j] - c) * mix));
        stage.style.background = `rgb(${bg.join(',')})`;
        const prog = document.getElementById('xp-progress');
        if (prog) prog.style.width = (Math.min(1, Math.max(0, tt / 5)) * 100).toFixed(2) + '%';
        // En el capitulo 5 hay mucho texto y poco ancho: en movil los circulos
        // le pasaban por encima a las palabras y se leia fatal. Se apagan casi
        // del todo justo ahi, y siguen enteros en el resto de capitulos.
        canvas.style.opacity = esMovil && tt > 3.55 ? Math.max(0.16, 1 - (tt - 3.55) * 2.4).toFixed(2) : '1';
        const activeNow = Math.max(0, Math.min(4, Math.round(tt - 0.2)));
        if (activeNow !== active) {
          active = activeNow;
          railBtns.forEach((b, i) => { const bar = b.firstChild as HTMLElement; bar.style.opacity = i === active ? '0.95' : '0.3'; bar.style.transform = i === active ? 'scaleX(1.35)' : 'scaleX(1)'; });
        }
      }

      const holds = [0, 0, 0, 0, 0];
      chs.forEach((ch, i) => {
        const a = tt - i;
        const inP = i === 0 ? 1 : sm((a + 0.13) / 0.2);
        // El ultimo capitulo NO se desvanece: si lo hace, al final del scroll
        // queda un hueco gris enorme antes de "¿Hablamos?". Se queda puesto
        // hasta que la seccion se va sola hacia arriba.
        const outP = i === 4 ? 0 : sm((a - 0.67) / 0.2);
        const vis = inP * (1 - outP);
        const hold = Math.min(1, Math.max(0, a / 0.62));
        holds[i] = i === 0 ? Math.min(1, Math.max(0, tt / 0.7)) : hold;
        if (!moved) return;
        if (vis <= 0.001) { ch.style.opacity = '0'; ch.style.visibility = 'hidden'; return; }
        ch.style.visibility = 'visible';
        ch.style.opacity = String(vis);
        const inX = (1 - inP) * 62, outX = outP * 42;
        const sc = 1 - outP * 0.05;
        ch.style.transformOrigin = '50% 50%';
        ch.style.transform = `translate3d(${inX - outX}vw,0,0) scale(${sc})`;
        ch.style.clipPath = `inset(0 ${(inX * 0.5).toFixed(2)}vw 0 0)`;
        ch.style.filter = outP > 0.02 ? `blur(${(outP * 5).toFixed(2)}px)` : '';
      });

      if (introPlayed) {
        hlines.forEach((l, i) => { l.style.transform = `translateY(${Math.sin(time * 0.9 + i * 1.4) * 3}px)`; });
      }

      if (moved) {
        const big = q('[data-big="dias"]');
        if (big) big.textContent = Math.round(7300 * eo(holds[1])).toLocaleString('es-ES');
        bands.forEach((b, i) => { b.style.transform = `scaleY(${sm((holds[3] - 0.1 - i * 0.14) / 0.5)})`; });
        bandLabels.forEach((b, i) => { const o = sm((holds[3] - 0.22 - i * 0.14) / 0.35); b.style.opacity = String(o); b.style.transform = `translateY(${(1 - o) * 14}px)`; });
        const wp = holds[2];
        const n = words.length;
        words.forEach((w, i) => {
          const o = sm((wp * 1.15 - i / n) / 0.12);
          w.style.opacity = String(0.16 + 0.84 * o);
          w.style.transform = `translateY(${(1 - o) * 0.3}em)`;
          w.style.color = o > 0.5 && ACCENT_WORDS.test(w.textContent || '') ? t.accent : '';
        });
        const dis = q('[data-disclaimer="1"]');
        if (dis) dis.style.opacity = String(sm((wp - 0.82) / 0.18));
        const sp = holds[4];
        document.querySelectorAll<HTMLElement>('[data-step]').forEach((el, i) => {
          const o = sm((sp - 0.12 - i * 0.14) / 0.4);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 16}px)`;
        });
        const por = q('[data-portrait="1"] img');
        if (por) por.style.transform = `translateY(${-wp * 14}%)`;
        const hp = q('[data-hero-photo]');
        if (hp) hp.style.transform = `translateY(${tt * 22}px) scale(${1 + tt * 0.06})`;
      }

      cleared = false;
      ctx.clearRect(0, 0, cw, chh);
      const mA = Math.min(4, Math.floor(tt + 0.5));
      const prev = Math.max(0, mA - 1);
      const bl = sm(((tt - prev) - 0.5) / 0.4);
      const dip = 1 - 0.45 * Math.sin(bl * Math.PI);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        const fa = formation(p, i, prev, time, holds[prev]);
        const fb = mA === prev ? fa : formation(p, i, mA, time, holds[mA]);
        const tx = fa.x + (fb.x - fa.x) * bl, ty = fa.y + (fb.y - fa.y) * bl;
        p.x += (tx - p.x) * 0.08 * energy;
        p.y += (ty - p.y) * 0.08 * energy;
        const f = bl < 0.5 ? fa : fb;
        const ta = (fa.a + (fb.a - fa.a) * bl) * dip;
        p.a += (ta - p.a) * 0.1;
        p.rot += ((f.rot || 0) - p.rot) * 0.12;
        const rr = (fa.r || 2) + ((fb.r || 2) - (fa.r || 2)) * bl;
        if (p.a < 0.012) continue;
        const rgb = cols[f.key] || cols.bone;
        if (f.kind === 'ring') {
          const rad = (fa.rr || 100) + ((fb.rr || fa.rr || 100) - (fa.rr || 100)) * bl;
          ctx.strokeStyle = `rgba(${rgb},${p.a.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 6.2832); ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${rgb},${p.a.toFixed(3)})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.2832); ctx.fill();
        }
      }
    }

    layout();
    // Con la tipografia ya cargada las medidas cambian: hay que recalcular.
    document.fonts?.ready.then(() => layout()).catch(() => {});
    sizeCanvas();
    const onResize = () => { sizeCanvas(); layout(); };
    addEventListener('resize', onResize);
    raf = requestAnimationFrame(loop);
    playIntro();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
      railBtns.forEach((b, i) => b.removeEventListener('click', railHandlers[i]));
    };
  }, []);

  return (
    <>
      <div id="xp-rail" style={{ position: 'fixed', left: `calc(${t.gut} / 2 - 13px)`, top: '50%', transform: 'translateY(-50%)', zIndex: 70, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <button key={i} type="button" data-rail={i} aria-label={`Capítulo ${i + 1}`} style={{ width: 26, height: 8, display: 'flex', alignItems: 'center' }}>
            <span style={{ display: 'block', height: 2, width: '100%', background: t.ink, opacity: i === 0 ? 0.9 : 0.3, transition: 'opacity 300ms, transform 300ms' }} />
          </button>
        ))}
      </div>

      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, height: 2, zIndex: 82, background: 'rgba(20,17,16,0.08)' }}>
        <div id="xp-progress" style={{ height: '100%', width: '0%', background: t.accent, transformOrigin: 'left' }} />
      </div>

      <div ref={trackRef} style={{ position: 'relative', height: '900vh' }}>
        <div ref={stageRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: t.bg }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', background: 'radial-gradient(120% 90% at 50% 45%, rgba(20,17,16,0) 55%, rgba(20,17,16,0.05) 78%, rgba(20,17,16,0.12) 100%)' }} />

          {/* 01 — La pregunta */}
          <div data-ch="0" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div data-hero-split style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '52% 48%' }}>
              <div data-hero-text="1" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'safe center', padding: 'clamp(72px,10vh,112px) clamp(28px,3.5vw,64px) clamp(76px,10vh,100px) 7vw', boxSizing: 'border-box', minHeight: 0 }}>
                <h1 data-hero-h1 style={{ margin: 0, fontWeight: 500, fontSize: 'clamp(2.2rem,min(7.4vw,8.6vh),7.6rem)', letterSpacing: '-0.042em', lineHeight: 0.92, color: t.ink }}>
                  <span style={{ overflow: 'hidden', display: 'block', padding: '0.02em 0' }}><span data-hline style={{ display: 'block' }}>¿Cuándo</span></span>
                  <span style={{ overflow: 'hidden', display: 'block', padding: '0.02em 0' }}><span data-hline style={{ display: 'block' }}>decidiste algo</span></span>
                  <span style={{ overflow: 'hidden', display: 'block', padding: '0.02em 0' }}><span data-hline style={{ display: 'block', color: t.accent }}>solo para ti?</span></span>
                </h1>
                <div data-hero-sub="1" style={{ margin: 'clamp(14px,2.2vh,32px) 0 0 0' }}>
                  <span style={{ display: 'block', width: 52, height: 1, background: 'rgba(20,17,16,0.28)', marginBottom: 'clamp(11px,1.4vh,22px)' }} />
                  <p style={{ margin: 0, fontSize: 'clamp(18px,1.6vw,22px)', lineHeight: 1.45, color: t.ink, maxWidth: '19em', fontWeight: 500, letterSpacing: '-0.012em' }}>Soy Raquel Rodríguez.</p>
                  <p style={{ margin: '8px 0 0 0', fontSize: 'clamp(16.5px,1.35vw,19px)', lineHeight: 1.6, color: 'rgba(20,17,16,0.7)', maxWidth: '25em', fontWeight: 400 }}>Yo tardé más de 20 años en contestar esta pregunta.</p>
                </div>
                <div data-hero-sub="2" style={{ marginTop: 'clamp(21px,4vh,52px)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span aria-hidden style={{ position: 'relative', display: 'block', width: 1, height: 56, background: 'rgba(20,17,16,0.14)', overflow: 'hidden', flex: 'none' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 22, background: t.accent, animation: 'rrgota 2.4s cubic-bezier(0.65,0,0.35,1) infinite' }} />
                  </span>
                  <span style={{ fontSize: 14.5, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6560' }}>Sigue bajando</span>
                </div>
              </div>
              <div data-hero-img style={{ position: 'relative', overflow: 'hidden', willChange: 'transform' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-hero-photo src="/raquel-hero.webp" alt="Raquel Rodríguez" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '42% 8%', display: 'block', filter: 'contrast(1.06) saturate(0.5)' }} />
                <div data-hero-fade-x style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '14%', background: `linear-gradient(90deg, ${t.bg} 0%, rgba(251,249,246,0) 100%)`, pointerEvents: 'none' }} />
                <div data-hero-fade-y style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '16%', background: `linear-gradient(180deg, rgba(251,249,246,0) 0%, ${t.bg} 100%)`, pointerEvents: 'none' }} />
              </div>
            </div>
            <div data-hero-bar style={{ position: 'absolute', left: t.gut, right: t.gut, bottom: 'clamp(19px,2.6vh,32px)', zIndex: 3, display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', gap: 24, borderTop: '1px solid rgba(20,17,16,0.12)', paddingTop: 'clamp(12px,1.6vh,17.5px)' }}>
              <p style={{ margin: 0, fontSize: 15.5, fontWeight: 400, letterSpacing: '0.01em', color: '#6B6560', whiteSpace: 'nowrap' }}>Empresaria · Desde 2008</p>
            </div>
          </div>

          {/* 02 — Mi punto de partida */}
          <div data-ch="1" style={{ position: 'absolute', inset: 0, opacity: 0, color: t.ink }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 70% at 22% 50%, rgba(251,249,246,0.94) 0%, rgba(251,249,246,0.7) 45%, rgba(251,249,246,0.1) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${t.gut}` }}>
              <p data-big="dias" style={{ margin: '1.4vh 0 0 0', fontFamily: t.font, fontSize: 'clamp(5rem,15vw,14rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 0.86, fontVariantNumeric: 'tabular-nums', color: t.ink }}>0</p>
              <p data-ch1-q style={{ margin: '1.6vh 0 0 0', fontFamily: t.font, fontSize: 'clamp(1.7rem,3.6vw,3.2rem)', fontWeight: 500, letterSpacing: '-0.012em', lineHeight: 1.16, maxWidth: '15em' }}>
                días ayudando a vivir el plan de otros.<br /><span style={{ color: t.accent }}>¿Y yo? ¿Para cuándo?</span>
              </p>
              <p data-ch1-d style={{ margin: '2.4vh 0 0 0', fontSize: 'clamp(16.5px,1.4vw,18px)', lineHeight: 1.6, color: 'rgba(20,17,16,0.72)', maxWidth: '24em' }}>
                Tenía todo lo que pintan como una buena vida: buen sueldo, buenos resultados. Pero tenía la sensación de que no era lo que yo quería. Pasaban los días y nunca me preocupé por mí.
              </p>
            </div>
          </div>

          {/* 03 — El giro */}
          <div data-ch="2" style={{ position: 'absolute', inset: 0, opacity: 0, color: t.ink, display: 'flex', alignItems: 'safe center', padding: `0 ${t.gut} clamp(21px,3vh,36px)`, gap: '5vw', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ flex: '1.4 1 0', minWidth: 0 }}>
              <p data-wseq style={{ margin: 0, fontFamily: t.font, fontSize: 'clamp(2.2rem,5vw,4.6rem)', fontWeight: 500, letterSpacing: '-0.014em', lineHeight: 1.12, maxWidth: '15em' }}>
                {STORY_WORDS.flatMap((w, i) => [<span key={`w${i}`}>{w}</span>, i < STORY_WORDS.length - 1 ? ' ' : null])}
              </p>
              <p data-disclaimer="1" style={{ margin: '3.5vh 0 0 0', fontSize: 'clamp(16.5px,1.4vw,17.5px)', lineHeight: 1.6, color: 'rgba(20,17,16,0.68)', maxWidth: '40ch', opacity: 0 }}>
                Escalando paso a paso. Me llevó tiempo, pero lo logré. Y tú también puedes.
              </p>
            </div>
            <figure data-portrait="1" style={{ flex: '1 1 0', minWidth: 0, margin: 0, maxWidth: 420, display: 'block' }}>
              <div data-portrait-marco style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4 / 5', boxShadow: '0 18px 44px rgba(30,45,66,0.18)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/raquel-retrato.webp" alt="Raquel Rodríguez" style={{ width: '100%', height: '118%', objectFit: 'cover', objectPosition: '50% 15%', display: 'block' }} />
              </div>
              <figcaption data-portrait-pie style={{ margin: '12px 0 0 0', fontSize: 14.5, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B6560' }}>Raquel Rodríguez · Empresaria desde 2008</figcaption>
            </figure>
          </div>

          {/* 04 — Lo que cambió */}
          <div data-ch="3" style={{ position: 'absolute', inset: 0, opacity: 0, color: t.ink }}>
            <div data-bands-grid style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
              {BANDS.map((b, i) => (
                <div key={b.title} style={{ position: 'relative', overflow: 'hidden', borderRight: i < 3 ? '1px solid rgba(20,17,16,0.08)' : undefined }}>
                  <div data-band style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(${b.rgb},0) 20%, rgba(${b.rgb},${b.a}) 100%)`, transform: 'scaleY(0)', transformOrigin: 'bottom' }} />
                  <div data-bandlabel style={{ position: 'absolute', left: 0, right: 0, bottom: '6vh', textAlign: 'center', opacity: 0, padding: '0 12px' }}>
                    <p style={{ margin: 0, fontSize: 14.5, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6560' }}>0{i + 1}</p>
                    <p style={{ margin: '10px 0 0 0', fontSize: 'clamp(1.15rem,2vw,1.75rem)', fontWeight: 650, letterSpacing: '-0.02em', lineHeight: 1.12 }}>{b.title}</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 'clamp(14.5px,1.15vw,17px)', lineHeight: 1.5, color: 'rgba(20,17,16,0.74)' }}>{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div data-ch2-head style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '10vh 5vw 0', textAlign: 'center', pointerEvents: 'none', boxSizing: 'border-box' }}>
              <h2 style={{ margin: '2.2vh 0 0 0', fontFamily: t.font, fontSize: 'clamp(2.7rem,6.4vw,6.4rem)', fontWeight: 500, letterSpacing: '-0.018em', lineHeight: 0.98 }}>
                Cinco años después,<br /><span style={{ color: t.accent, fontWeight: 500 }}>esto es lo que cambió.</span>
              </h2>
            </div>
          </div>

          {/* 05 — Y ahora tú */}
          <div data-ch="4" style={{ position: 'absolute', inset: 0, opacity: 0, color: t.ink, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${t.gut}`, boxSizing: 'border-box' }}>
            {/* Caja que se encoge sola si la pantalla es muy bajita, para que
                los 3 pasos y la tarjeta quepan enteros sin cortarse. */}
            <div data-ch5-caja style={{ width: '100%', transformOrigin: 'top center' }}>
            <h2 data-ch5-title style={{ margin: 0, fontFamily: t.font, fontSize: 'clamp(2rem,3.8vw,3.6rem)', fontWeight: 500, letterSpacing: '-0.018em', lineHeight: 1.06, maxWidth: '16em' }}>
              Cambió porque encontré cómo ganarme la vida desde casa.<br /><span style={{ color: t.accent, fontWeight: 500 }}>Y hoy quiero compartirla contigo.</span>
            </h2>
            <p data-ch5-sub style={{ margin: '1.8vh 0 0 0', fontSize: 'clamp(16.5px,1.35vw,19px)', lineHeight: 1.55, color: 'rgba(20,17,16,0.7)', maxWidth: '44ch' }}>
              Llevo años con esto y tengo resultados. Si algo he aprendido es que funciona. Si te interesa, agenda una llamada y te lo cuento tal cual es.
            </p>
            <div data-ch5-grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,230px),1fr))', gap: 'clamp(19px,2.4vw,34px)', marginTop: 'clamp(24px,4vh,46px)', maxWidth: 1100 }}>
              {[
                ['Agendamos una llamada', 'Me cuentas dónde estás. Yo te digo con sinceridad si puedo ayudarte.'],
                ['Empiezas pequeño', 'Sin dejar lo que ya tienes. Como empecé yo: en casa y a mi ritmo.'],
                ['Decides hasta dónde', 'Si te encaja, te acompaño. Si no, nos hemos conocido y ya está.'],
              ].map(([title, body], i) => (
                <div key={title} data-step style={{ borderTop: '1px solid rgba(20,17,16,0.16)', paddingTop: 16 }}>
                  <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, letterSpacing: '0.18em', color: t.accent }}>0{i + 1}</p>
                  <p style={{ margin: '10px 0 0 0', fontSize: 'clamp(18px,1.6vw,22px)', fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</p>
                  <p style={{ margin: '8px 0 0 0', fontSize: 'clamp(16px,1.25vw,17px)', lineHeight: 1.6, color: 'rgba(20,17,16,0.7)' }}>{body}</p>
                </div>
              ))}
            </div>
            {/* Segundo camino: para quien prefiere leerlo antes que hablar.
                Es la puerta a la pagina de precios, asi que merece forma de
                tarjeta y no un enlace gris perdido en un parrafo. */}
            <a
              data-tarjeta-inversion
              href="/inversion"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'clamp(16.5px,2vw,22px)',
                margin: 'clamp(22px,3.4vh,38px) 0 0 0', maxWidth: '46em',
                padding: 'clamp(16.5px,1.8vh,21px) clamp(19px,2vw,26px)',
                borderRadius: 16,
                border: `1px solid ${t.accent}33`,
                background: 'linear-gradient(120deg, rgba(232,212,216,0.34) 0%, rgba(201,164,171,0.14) 100%)',
                transition: 'transform 320ms cubic-bezier(.22,1,.36,1), box-shadow 320ms ease, border-color 320ms ease',
              }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span data-tarjeta-kicker style={{ display: 'block', fontSize: 13.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.accent, marginBottom: 5 }}>
                  Antes de hablar
                </span>
                <span data-tarjeta-texto style={{ display: 'block', fontSize: 'clamp(17px,1.4vw,18px)', lineHeight: 1.5, color: t.ink, fontWeight: 500, letterSpacing: '-0.012em' }}>
                  Míralo todo escrito: qué es, cuánto cuesta y qué dicen quienes ya lo tienen
                </span>
              </span>
              <span data-flecha aria-hidden style={{
                flex: 'none', width: 40, height: 40, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: t.accent, color: '#F4EBED', fontSize: 18, lineHeight: 1,
                transition: 'transform 320ms cubic-bezier(.22,1,.36,1)',
              }}>→</span>
            </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
