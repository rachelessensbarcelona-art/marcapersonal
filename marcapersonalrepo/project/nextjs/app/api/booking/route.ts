import { NextResponse } from 'next/server';

const cap = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

export async function POST(req: Request) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.warn('[reservas] Falta GOOGLE_SHEETS_WEBHOOK_URL: la reserva no se ha guardado en la hoja.');
    return NextResponse.json({ saved: false });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ saved: false }, { status: 400 });

  const row = {
    fecha: new Date().toISOString(),
    nombre: cap(body.name, 60),
    email: cap(body.email, 120).toLowerCase(),
    telefono: cap(body.phone, 20),
    dia: cap(body.day, 40),
    hora: cap(body.time, 10),
    tema: cap(body.interest, 40),
    origen: cap(body.source, 60),
  };
  if (!row.nombre || !row.telefono) return NextResponse.json({ saved: false }, { status: 400 });

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(8000),
    });
    return NextResponse.json({ saved: r.ok });
  } catch {
    console.error('[reservas] No se pudo escribir en la hoja de cálculo.');
    return NextResponse.json({ saved: false });
  }
}
