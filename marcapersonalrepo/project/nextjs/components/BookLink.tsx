'use client';

import { t } from '@/lib/site';
import { openChat } from '@/lib/chatBus';

export default function BookLink() {
  return (
    <button type="button" onClick={openChat} style={{ background: t.ink, color: t.bg, fontSize: 15.5, fontWeight: 600, padding: '14px 30px', borderRadius: 999 }}>
      Reservar una llamada con Raquel
    </button>
  );
}
