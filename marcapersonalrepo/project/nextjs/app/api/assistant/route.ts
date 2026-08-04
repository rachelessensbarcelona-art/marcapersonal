import { NextResponse } from 'next/server';

/**
 * Respuesta breve y humana a lo que escribe el visitante.
 * Requiere ANTHROPIC_API_KEY en .env.local. Si no existe, devuelve null
 * y el chat usa su frase por defecto (la web sigue funcionando).
 */
export async function POST(req: Request) {
  const { message } = (await req.json()) as { message?: string };
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || !message) return NextResponse.json({ reply: null });

  const system =
    'Eres el asistente de reservas de la web de Raquel Rodríguez, asesora española que trabaja con un dispositivo japonés de tratamiento de agua para casa. ' +
    'Responde en español de España, máximo 2 frases cortas, tono cercano, honesto y sobrio. ' +
    'Prohibido: prometer beneficios de salud o de ingresos, usar emojis, sonar comercial. No hagas preguntas: solo reconoce con naturalidad lo que ha dicho.';

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 200,
        system,
        messages: [{ role: 'user', content: message.slice(0, 400) }],
      }),
    });
    const data = await r.json();
    const reply = data?.content?.[0]?.text?.trim() ?? null;
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: null });
  }
}
