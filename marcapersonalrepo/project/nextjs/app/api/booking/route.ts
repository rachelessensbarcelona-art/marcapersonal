import { NextResponse } from 'next/server';

const cap = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

/**
 * Diagnóstico. Abre en el navegador:
 *   /api/booking            -> dice si Vercel tiene la variable
 *   /api/booking?probar=1   -> manda una fila de prueba y enseña qué responde Google
 * Nunca devuelve la URL secreta, solo si tiene la forma correcta.
 */
export async function GET(req: Request) {
  const bruto = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const url = bruto?.trim();

  const diagnostico = {
    variableConfigurada: !!bruto,
    tieneEspaciosSobrantes: !!bruto && bruto !== bruto.trim(),
    acabaEnExec: !!url?.endsWith('/exec'),
    esDeAppsScript: !!url?.startsWith('https://script.google.com/macros/s/'),
    longitud: url?.length ?? 0,
  };

  if (!url) {
    return NextResponse.json({
      ...diagnostico,
      veredicto: 'FALTA la variable GOOGLE_SHEETS_WEBHOOK_URL en Vercel, o el despliegue actual se construyó antes de añadirla. Añádela y vuelve a desplegar.',
    });
  }

  if (new URL(req.url).searchParams.get('probar') !== '1') {
    return NextResponse.json({
      ...diagnostico,
      veredicto: 'La variable está puesta. Abre /api/booking?probar=1 para mandar una fila de prueba a la hoja.',
    });
  }

  // Prueba real de extremo a extremo contra el Apps Script
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        nombre: 'PRUEBA desde la web — borra esta fila',
        email: '',
        telefono: '+34600000000',
        dia: 'prueba', hora: '00:00', tema: 'Prueba', origen: '/api/booking?probar=1',
      }),
      signal: AbortSignal.timeout(10000),
    });
    const texto = (await r.text()).slice(0, 400);
    return NextResponse.json({
      ...diagnostico,
      googleRespondio: r.status,
      googleDijo: texto,
      veredicto: texto.includes('"ok":true')
        ? 'TODO CORRECTO. Mira la hoja: debe haber una fila nueva.'
        : 'Google contestó, pero no guardó. Lo más común: la implementación del Apps Script sigue sirviendo el código viejo. Ve a Implementar > Gestionar implementaciones > lápiz > Versión: Nueva > Implementar.',
    });
  } catch (e) {
    return NextResponse.json({
      ...diagnostico,
      veredicto: 'Vercel no pudo contactar con Google. Revisa que el acceso de la implementación sea "Cualquier usuario".',
      error: String(e).slice(0, 200),
    });
  }
}

export async function POST(req: Request) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!url) {
    console.warn('[reservas] Falta GOOGLE_SHEETS_WEBHOOK_URL: la reserva no se ha guardado en la hoja.');
    return NextResponse.json({ saved: false, motivo: 'sin-variable' });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ saved: false, motivo: 'sin-datos' }, { status: 400 });

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
  if (!row.nombre || !row.telefono) {
    return NextResponse.json({ saved: false, motivo: 'faltan-campos' }, { status: 400 });
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(10000),
    });
    const texto = (await r.text()).slice(0, 300);
    const guardado = r.ok && texto.includes('"ok":true');
    if (!guardado) console.error('[reservas] Google no guardó la fila. Estado %s. Dijo: %s', r.status, texto);
    return NextResponse.json({ saved: guardado });
  } catch (e) {
    console.error('[reservas] No se pudo contactar con la hoja de cálculo:', e);
    return NextResponse.json({ saved: false, motivo: 'sin-conexion' });
  }
}
