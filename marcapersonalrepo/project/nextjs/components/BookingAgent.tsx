'use client';

import { useEffect, useRef, useState } from 'react';
import { t, waHref } from '@/lib/site';
import { onOpenChat, onMenuToggle } from '@/lib/chatBus';
import {
  ackFor, Booking, Chip, CONSENT, guessInterest, INTERESTS, Msg, nextDays, parseContacto, Step, STORAGE_KEY, TIMES,
} from '@/lib/booking';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function BookingAgent() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chips, setChips] = useState<Chip[]>([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const bk = useRef<Booking & { step: Step }>({ step: 'idle', interest: null, day: null, ymd: null, time: null, name: '', email: '', phone: '' });
  const started = useRef(false);

  useEffect(() => onMenuToggle(setMenuAbierto), []);
  useEffect(() => onOpenChat(() => { setOpen(true); setOpened(true); setNudge(false); void start(); }), []);
  useEffect(() => {
    const a = setTimeout(() => setNudge(true), 5000);
    const b = setTimeout(() => setNudge(false), 17000);
    if (location.hash === '#reservar') { setOpen(true); setOpened(true); void start(); }
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [msgs, typing]);

  const push = (m: Msg) => setMsgs((v) => [...v, m]);

  const say = async (text: string, opts: { fast?: boolean; chips?: Chip[] } = {}) => {
    setTyping(true); setChips([]);
    await wait(opts.fast ? 350 : Math.min(420 + text.length * 6, 1300));
    setTyping(false);
    push({ text });
    if (opts.chips) setChips(opts.chips);
  };

  const askDay = (changing = false) => {
    bk.current.step = 'day';
    return say(changing ? 'Sin problema. ¿Qué día te viene mejor?' : '¿Qué día te viene bien? Son unos 20 minutos, sin compromiso.', {
      chips: nextDays().map((d) => ({ label: d.label, v: 'd', ymd: d.ymd })),
    });
  };

  const start = async () => {
    if (started.current) return;
    started.current = true;
    let saved: (Booking & { ts: number }) | null = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch {}
    if (saved?.day && saved?.time) {
      bk.current = { ...bk.current, ...saved, step: 'saved' };
      await say(`Hola de nuevo. Tienes una llamada reservada: ${saved.day}, a las ${saved.time}.`, {
        chips: [{ label: 'La mantengo', v: 'keep' }, { label: 'Cambiar la cita', v: 'change' }],
      });
      return;
    }
    await say('Hola, soy el asistente de Raquel. Te reservo 20 minutos con ella en menos de un minuto.');
    bk.current.step = 'interest';
    await say('¿Qué te trae por aquí?', { chips: INTERESTS });
  };

  const aiAck = async (text: string) => {
    let reply = 'Gracias por contármelo. Eso, mejor de viva voz: es justo lo que Raquel prefiere hablar sin guiones.';
    try {
      const r = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await r.json();
      if (data?.reply) reply = String(data.reply).slice(0, 260);
    } catch {}
    return say(reply);
  };

  const finish = async () => {
    bk.current.step = 'done';
    const b = bk.current;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...b, ts: Date.now() })); } catch {}
    void fetch('/api/booking', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...b, source: location.pathname }),
    }).catch(() => {});
    setTyping(true); setChips([]);
    await wait(500);
    setTyping(false);
    push({ card: { ...b } });
    await say('Reservada. Raquel te confirma por WhatsApp en menos de 24 horas. Si te surge algo antes, escríbele directamente.', {
      chips: [{ label: 'Escribir por WhatsApp', v: 'wa', primary: true }, { label: 'Cambiar la cita', v: 'change' }],
    });
  };

  const route = async (text: string, chip?: Chip) => {
    const st = bk.current.step;
    if (st === 'saved') {
      if (chip?.v === 'change') return askDay(true);
      if (chip) return say('Genial. Raquel te escribirá por WhatsApp para confirmar. Cualquier duda, déjamela aquí.');
      return aiAck(text);
    }
    if (st === 'idle' || st === 'interest') {
      bk.current.step = 'interest';
      const label = chip ? text : guessInterest(text);
      if (label) { bk.current.interest = label; await say(ackFor(label), { fast: true }); return askDay(); }
      await aiAck(text);
      return say('Para orientar la llamada: ¿qué encaja más contigo?', { chips: INTERESTS });
    }
    if (st === 'day') {
      if (chip) { bk.current.day = text; bk.current.ymd = chip.ymd ?? null; bk.current.step = 'time'; return say(`${text}. ¿A qué hora?`, { fast: true, chips: TIMES.map((x) => ({ label: x, v: 't' })) }); }
      return say('Mejor elige uno de los días de abajo, así no nos bailan las fechas.', { chips: nextDays().map((d) => ({ label: d.label, v: 'd', ymd: d.ymd })) });
    }
    if (st === 'time') {
      if (chip) { bk.current.time = text; bk.current.step = 'name'; return say('Apuntado. ¿Cómo te llamas?', { fast: true }); }
      return say('Elige una de las horas de abajo y seguimos.', { chips: TIMES.map((x) => ({ label: x, v: 't' })) });
    }
    if (st === 'name') {
      if (text.trim().length < 2) return say('Creo que eso no es un nombre. ¿Cómo te llamas?');
      bk.current.name = text.replace(/\s+/g, ' ').slice(0, 60);
      bk.current.step = 'contacto';
      return say(`Encantado, ${bk.current.name.split(' ')[0]}. Déjame dos datos y cierro la cita: tu correo y tu WhatsApp. Puedes ponerlos juntos en un mismo mensaje.`, { fast: true });
    }
    if (st === 'contacto') {
      const { email, phone } = parseContacto(text);
      if (email) bk.current.email = email;
      if (phone) bk.current.phone = phone;
      const falta = { email: !bk.current.email, phone: !bk.current.phone };
      if (falta.email && falta.phone) {
        return say('No he pillado ninguno de los dos. Escríbelos así, en la misma línea: nombre@correo.com +34 600 123 456');
      }
      if (falta.email) return say('Tengo el WhatsApp ✓ — me falta el correo. ¿Cuál es?', { fast: true });
      if (falta.phone) return say('Tengo el correo ✓ — me falta el WhatsApp. ¿Cuál es?', { fast: true });
      bk.current.step = 'consent';
      return say('Los dos apuntados ✓ Última cosa y cierro: tus datos se usan solo para organizar esta llamada. Ni listas, ni publicidad. ¿Aceptas la política de privacidad?', { chips: CONSENT });
    }
    if (st === 'consent') {
      if (chip?.v === 'ok' || /acept|s[ií]|vale|ok|claro/.test(text.toLowerCase())) return finish();
      if (chip) { bk.current.step = 'interest'; return say('Sin problema: no guardo nada. Si lo prefieres, escríbele directamente por WhatsApp.', { chips: [{ label: 'Abrir WhatsApp', v: 'wa' }] }); }
      return say('Necesito un sí explícito para guardar la reserva. ¿Aceptas la política de privacidad?', { chips: CONSENT });
    }
    if (chip?.v === 'change') return askDay(true);
    return aiAck(text);
  };

  const pick = (c: Chip) => {
    if (c.v === 'wa') { const b = bk.current; window.open(waHref(b.day ? `Hola Raquel, soy ${b.name}. He reservado el ${b.day} a las ${b.time}.` : 'Hola Raquel, vengo de tu web.'), '_blank'); return; }
    push({ me: true, text: c.label });
    setChips([]);
    void route(c.label, c);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const v = draft.trim();
    if (!v) return;
    push({ me: true, text: v });
    setDraft('');
    if (!started.current) { started.current = true; bk.current.step = 'interest'; }
    void route(v);
  };

  const ink = '#191510', bone = '#F3EFE9';
  const bubble = (me?: boolean) => ({
    background: me ? '#1B1611' : 'rgba(25,21,16,0.06)',
    color: me ? bone : ink,
    borderRadius: me ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
    padding: '11px 15px', maxWidth: '84%', fontSize: 14.5, lineHeight: 1.55,
  });

  const row = (k: string, v: string) => (
    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '7px 0', borderTop: '1px solid rgba(25,21,16,0.1)', fontSize: 13.5 }}>
      <span style={{ color: 'rgba(25,21,16,0.55)' }}>{k}</span>
      <span style={{ fontWeight: 600 }}>{v}</span>
    </div>
  );

  return (
    <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 96, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, pointerEvents: 'none', opacity: menuAbierto ? 0 : 1, visibility: menuAbierto ? 'hidden' : 'visible', transition: 'opacity 260ms ease' }}>
      <div data-native-cursor style={{ width: 'min(376px, calc(100vw - 44px))', height: 'min(560px, calc(100dvh - 140px))', display: 'flex', flexDirection: 'column', background: '#FFFFFF', color: ink, borderRadius: 24, overflow: 'hidden', boxShadow: '0 26px 70px rgba(20,17,16,0.16)', border: '1px solid rgba(25,21,16,0.08)', transformOrigin: '100% 100%', transform: open ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.96)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'transform 380ms cubic-bezier(.22,1,.36,1), opacity 300ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid rgba(25,21,16,0.1)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/raquel-avatar.webp" alt="Raquel Rodríguez" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flex: 'none' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Raquel Rodríguez</p>
            <p style={{ margin: '1px 0 0', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6560' }}>Asistente de agenda · En línea</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(25,21,16,0.06)', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <div ref={box} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 18px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.me ? 'flex-end' : 'flex-start' }}>
              {m.card ? (
                <div style={{ border: '1px solid rgba(25,21,16,0.14)', borderRadius: 16, padding: '15px 17px', background: '#FFFFFF', width: 'min(100%,300px)' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6560' }}>Resumen de tu reserva</p>
                  {row('Día', m.card.day || '')}
                  {row('Hora', m.card.time || '')}
                  {row('Tema', m.card.interest || 'Por decidir')}
                  {row('Nombre', m.card.name)}
                  {row('Correo', m.card.email)}
                  {row('WhatsApp', m.card.phone)}
                </div>
              ) : (
                <div style={bubble(m.me)}>{m.text}</div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(25,21,16,0.06)', borderRadius: '18px 18px 18px 6px', padding: '14px 16px', display: 'flex', gap: 5 }}>
                {[0, 0.15, 0.3].map((d) => (
                  <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: ink, animation: `rrdot 1.1s ${d}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {chips.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '2px 16px 12px' }}>
            {chips.map((c) => (
              <button key={c.label} type="button" onClick={() => pick(c)} style={{ background: c.primary ? '#1B1611' : 'transparent', color: c.primary ? bone : ink, border: c.primary ? '1px solid #1B1611' : '1px solid rgba(25,21,16,0.28)', borderRadius: 999, padding: '8px 15px', fontSize: 13.5, fontWeight: 500 }}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={send} style={{ display: 'flex', gap: 10, padding: '11px 13px', borderTop: '1px solid rgba(25,21,16,0.1)', alignItems: 'center' }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Escribe aquí…" aria-label="Mensaje para el asistente" style={{ flex: 1, minWidth: 0, background: 'rgba(25,21,16,0.05)', border: 'none', borderRadius: 999, padding: '11px 17px', fontSize: 14.5 }} />
          <button type="submit" aria-label="Enviar" style={{ width: 40, height: 40, flex: 'none', borderRadius: '50%', background: '#191510', color: bone, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
        </form>
        <p style={{ margin: 0, padding: '0 14px 11px', textAlign: 'center', fontSize: 10.5, fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(25,21,16,0.45)' }}>
          Datos solo para organizar la llamada · RGPD
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
        <button
          type="button"
          onClick={() => { setOpen(true); setOpened(true); setNudge(false); void start(); }}
          style={{ background: '#FFFFFF', color: ink, fontSize: 13.5, fontWeight: 500, padding: '10px 17px', borderRadius: 999, border: '1px solid rgba(20,17,16,0.12)', boxShadow: '0 10px 28px rgba(20,17,16,0.10)', textAlign: 'left', whiteSpace: 'nowrap', transform: nudge && !open ? 'translateY(0)' : 'translateY(8px)', opacity: nudge && !open ? 1 : 0, pointerEvents: nudge && !open ? 'auto' : 'none', transition: 'transform 400ms cubic-bezier(.22,1,.36,1), opacity 350ms ease' }}
        >
          ¿Hablamos 20 minutos?
        </button>
        <button
          type="button"
          aria-label="Abrir asistente de reservas"
          onClick={() => (open ? setOpen(false) : (setOpen(true), setOpened(true), setNudge(false), void start()))}
          style={{ position: 'relative', width: 54, height: 54, borderRadius: '50%', flex: 'none', background: t.bg, border: '1px solid rgba(20,17,16,0.14)', boxShadow: '0 10px 30px rgba(20,17,16,0.10)', overflow: 'hidden', transition: 'transform 260ms cubic-bezier(.22,1,.36,1), border-color 260ms ease' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/raquel-avatar.webp" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(251,249,246,0.92)', color: ink, fontSize: 22, fontWeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: open ? 1 : 0, transition: 'opacity 250ms ease', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>×</span>
          {!opened && <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: t.accent, boxShadow: `0 0 0 2px ${t.bg}`, display: 'block' }} />}
        </button>
      </div>
    </div>
  );
}
