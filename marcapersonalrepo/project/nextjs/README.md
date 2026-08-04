# Raquel Rodríguez — web de marca personal (Next.js)

Next.js 15 (App Router) + React 19. Sin librerías de estilos: estilos en línea y `app/globals.css` para resets y keyframes.

## Arrancar en tu ordenador

```bash
npm install
npm run dev      # http://localhost:3000
```

## Estructura

- `app/page.tsx` — portada: `Experience` (5 capítulos con scroll + canvas de partículas) y `Closing`.
- `app/inversion/page.tsx` — página escondida: lo que ya gastas, precio, qué incluye, testimonios, negocio y FAQ.
- `components/Nav.tsx` — barra fija + menú hamburguesa (Inicio / Cómo te quiero ayudar).
- `components/BookingAgent.tsx` — botón flotante y asistente que agenda la llamada.
- `components/Cursor.tsx` — cursor animado (se desactiva en táctil y por debajo de 900 px).
- `lib/site.ts` — nombre, WhatsApp, Instagram, email y paleta. **Edita aquí tus datos reales.**
- `app/api/booking/route.ts` — envía cada reserva a la hoja de cálculo de Google.
- `app/api/assistant/route.ts` — respuesta con IA a lo que escribe el visitante (opcional).

## Datos que tienes que cambiar

1. `lib/site.ts`: whatsapp, instagram, email.
2. `public/raquel-hero.png` y `public/raquel-retrato.png`: las fotos definitivas.
3. Testimonios de `app/inversion/page.tsx`: sustituye los tres huecos por vídeos y nombres reales, con permiso por escrito.

---

## Reservas en Google Sheets

Cada vez que alguien termina de reservar, sus datos caen como una fila nueva
en una hoja de cálculo de Google (igual que un Excel, pero online).

### Paso 1 — Crear la hoja

1. Entra en <https://sheets.google.com> y crea una hoja en blanco.
2. Llámala por ejemplo **Reservas Raquel**.

### Paso 2 — Pegar el código

1. En esa hoja: menú **Extensiones → Apps Script**.
2. Borra lo que haya y pega **todo** el contenido del archivo `google-apps-script.gs` de este proyecto.
3. Pulsa el icono de guardar (💾).

### Paso 3 — Publicarlo

1. Arriba a la derecha: botón azul **Implementar → Nueva implementación**.
2. En el engranaje ⚙ elige **Aplicación web**.
3. Rellena:
   - *Descripción*: `Reservas web`
   - *Ejecutar como*: **Yo**
   - *Quién tiene acceso*: **Cualquier usuario**  ← importante
4. **Implementar**. Google pedirá permisos: acéptalos (dirá que la app "no está verificada" — es tuya, pulsa *Configuración avanzada → Ir a…*).
5. Copia la **URL de la aplicación web**. Empieza por `https://script.google.com/macros/s/…/exec`.

### Paso 4 — Darle esa URL a la web

En local, crea un archivo `.env.local` dentro de `project/nextjs`:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AQUI_TU_URL/exec
```

En Vercel, la misma variable se pone en **Settings → Environment Variables** (ver más abajo).

> Si esta variable no existe, la web **sigue funcionando** y el asistente sigue
> agendando; simplemente no escribe en la hoja. No se rompe nada.

---

## Publicar en Vercel

### Paso 1 — Subir a GitHub

```bash
git push -u origin main
```

### Paso 2 — Conectar Vercel

1. Entra en <https://vercel.com> y accede con tu cuenta de GitHub.
2. **Add New → Project** e importa el repositorio `marcapersonal`.
3. **Muy importante** — como la web no está en la raíz del repositorio:
   - En *Root Directory* pulsa **Edit** y elige `project/nextjs`.
4. Framework: Vercel detectará **Next.js** solo. No toques nada más.

### Paso 3 — Variables de entorno

En **Settings → Environment Variables** añade:

| Nombre | Valor | Obligatoria |
|---|---|---|
| `GOOGLE_SHEETS_WEBHOOK_URL` | la URL del Paso 3 de arriba | Sí, para las reservas |
| `ANTHROPIC_API_KEY` | `sk-ant-…` | No, solo para la IA del chat |

### Paso 4 — Deploy

Pulsa **Deploy**. A partir de ahí, cada `git push` a `main` republica la web sola.

---

## IA del asistente (opcional)

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.local
```

Sin clave, el asistente sigue agendando con su frase por defecto.

## Antes de publicar

Añade privacidad, cookies y aviso legal (LSSICE) con NIF y domicilio. Nada de la web es consejo médico ni promesa de ingresos.
