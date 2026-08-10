'use client';

import { useState } from 'react';
import { t } from '@/lib/site';

const ITEMS: [string, string][] = [
  ['¿Cómo funciona la financiación?', 'Directa del fabricante, en cuotas mensuales y sin pasar por un banco. Las condiciones dependen del plazo: te las enseño con números reales en la llamada.'],
  ['¿Qué mantenimiento tiene de verdad?', 'Un filtro de unos 6.600 litros —en una familia, más o menos un año— que cuesta 95 €, y una limpieza profunda ocasional. Nada más.'],
  ['¿Puedo probar el agua antes?', 'Si vives cerca, te llevo unos cinco litros a casa. No la envío lejos porque pierde propiedades con el tiempo y prefiero decírtelo antes.'],
  ['¿Esto sustituye ir al médico?', 'No, en absoluto. Nada de esta página es consejo médico. Si tienes una condición de salud, tu médico. Esto es un electrodoméstico.'],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {ITEMS.map(([q, a], i) => (
        <div key={q} style={{ borderTop: '1px solid ' + t.hair, borderBottom: i === ITEMS.length - 1 ? '1px solid ' + t.hair : undefined }}>
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, textAlign: 'left', padding: '21px 0' }}>
            <span style={{ fontSize: 'clamp(17px,1.4vw,18.5px)', fontWeight: 600 }}>{q}</span>
            <span style={{ fontSize: 24, fontWeight: 300, color: t.accent, lineHeight: 1, transition: 'transform 400ms cubic-bezier(.22,1,.36,1)', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
          </button>
          <div style={{ display: 'grid', gridTemplateRows: open === i ? '1fr' : '0fr', transition: 'grid-template-rows 400ms cubic-bezier(.22,1,.36,1)' }}>
            <div style={{ overflow: 'hidden', minHeight: 0 }}>
              <p style={{ margin: '0 0 22px', fontSize: 17, lineHeight: 1.65, color: t.soft, maxWidth: '64ch' }}>{a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
