/**
 * Reservas de la web de Raquel Rodríguez.
 * Pega este código en Extensiones > Apps Script de tu Hoja de cálculo.
 *
 * Cada vez que alguien reserva desde la web:
 *   1. Guarda una fila nueva en la hoja.
 *   2. Manda un correo de confirmación a quien ha reservado.
 *   3. Te manda a ti un aviso de que tienes una reunión.
 *
 * Si un correo falla, la fila ya está guardada: nunca se pierde una reserva.
 */

// ── Lo único que puedes querer tocar ──────────────────────────────
// El identificador de tu hoja: el trozo largo que sale en su enlace, entre
// /d/ y /edit. Dejarlo puesto hace que funcione tanto si este script está
// dentro de la hoja como si es un proyecto suelto.
var ID_HOJA     = '1yu_yopxH-YWVS2lZpJA0T4e44Cn5tLXRwDrjmkFpzMk';
var AVISARME_A  = '';                  // vacío = tu propia cuenta de Google
var MI_NOMBRE   = 'Raquel Rodríguez';
var MI_WHATSAPP = '+34676508388';      // sale en el correo de confirmación
var CREAR_EVENTO = true;               // pon false si no quieres la cita en tu Calendar
var MINUTOS_CITA = 20;
// ──────────────────────────────────────────────────────────────────

var CABECERAS = ['Fecha', 'Nombre', 'Correo', 'WhatsApp', 'Día', 'Hora', 'Tema', 'Origen'];

/**
 * Pulsa "Ejecutar" con esta función seleccionada para comprobar que todo
 * va bien sin pasar por la web: escribe una fila de prueba y manda los
 * correos. Si algo falla, el error sale abajo en "Registro de ejecución".
 */
function probar() {
  var r = doPost({ postData: { contents: JSON.stringify({
    nombre: 'PRUEBA — borra esta fila',
    email: Session.getEffectiveUser().getEmail(),
    telefono: '+34600000000',
    dia: 'prueba', hora: '10:00', tema: 'Prueba', origen: 'probar()',
  }) } });
  Logger.log(r.getContent());
  return r.getContent();
}

/** Devuelve la primera hoja, venga el script de donde venga. */
function _hoja() {
  var ss = null;
  if (ID_HOJA) ss = SpreadsheetApp.openById(ID_HOJA);
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No encuentro la hoja. Revisa ID_HOJA arriba del todo.');
  return ss.getSheets()[0];
}

function doPost(e) {
  var d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return _json({ ok: false, error: 'JSON no válido' });
  }

  // 1) Guardar la fila. Va primero y sola: es lo que no se puede perder.
  try {
    var hoja = _hoja();
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(CABECERAS);
      hoja.getRange(1, 1, 1, CABECERAS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }
    hoja.appendRow([
      new Date(d.fecha || Date.now()),
      d.nombre || '',
      d.email || '',
      "'" + (d.telefono || ''),   // la comilla evita que Sheets se coma el +34
      d.dia || '',
      d.hora || '',
      d.tema || '',
      d.origen || '',
    ]);
  } catch (err) {
    return _json({ ok: false, error: 'No se pudo guardar: ' + err });
  }

  var avisos = { cliente: false, mio: false, evento: false };

  // 1b) Crear la cita en tu Google Calendar. Si falla, seguimos.
  try {
    if (CREAR_EVENTO && d.fechaYmd && d.hora) {
      var partes = String(d.fechaYmd).split('-');
      var hm = String(d.hora).split(':');
      var inicio = new Date(+partes[0], +partes[1] - 1, +partes[2], +hm[0], +(hm[1] || 0), 0);
      if (!isNaN(inicio.getTime())) {
        var fin = new Date(inicio.getTime() + MINUTOS_CITA * 60000);
        var ev = CalendarApp.getDefaultCalendar().createEvent(
          'Llamada con ' + (d.nombre || 'alguien'),
          inicio, fin,
          {
            description: 'Tema: ' + (d.tema || '-') +
                         '\nWhatsApp: ' + (d.telefono || '-') +
                         '\nCorreo: ' + (d.email || '-') +
                         '\nVino de: ' + (d.origen || '-'),
            guests: d.email || '',
            sendInvites: !!d.email,
          }
        );
        ev.addPopupReminder(30);
        avisos.evento = true;
      }
    }
  } catch (err) {}

  // 2) Correo a quien ha reservado. Si falla, seguimos.
  try {
    if (d.email) {
      MailApp.sendEmail({
        to: d.email,
        subject: 'Tu llamada con ' + MI_NOMBRE + ' — ' + (d.dia || '') + ' a las ' + (d.hora || ''),
        htmlBody: _correoCliente(d),
        name: MI_NOMBRE,
      });
      avisos.cliente = true;
    }
  } catch (err) {}

  // 3) Aviso para ti. Si falla, seguimos.
  try {
    var mio = AVISARME_A || Session.getEffectiveUser().getEmail();
    if (mio) {
      MailApp.sendEmail({
        to: mio,
        subject: '📅 Nueva reunión: ' + (d.nombre || 'alguien') + ' · ' + (d.dia || '') + ' ' + (d.hora || ''),
        htmlBody: _correoMio(d),
        name: 'Reservas de la web',
        replyTo: d.email || undefined,
      });
      avisos.mio = true;
    }
  } catch (err) {}

  return _json({ ok: true, avisos: avisos });
}

function _correoCliente(d) {
  var nombre = String(d.nombre || '').split(' ')[0];
  var wa = MI_WHATSAPP
    ? '<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#57534e">' +
      'Si te surge cualquier cosa antes, escríbeme por WhatsApp al ' +
      '<a href="https://wa.me/' + MI_WHATSAPP.replace(/[^0-9]/g, '') + '" style="color:#4A6B7D">' +
      _esc(MI_WHATSAPP) + '</a>.</p>'
    : '';
  return '' +
    '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;background:#FBF9F6;padding:32px 16px">' +
      '<div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e5e4;border-radius:16px;padding:32px">' +
        '<p style="margin:0 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#4A6B7D">Reserva confirmada</p>' +
        '<h1 style="margin:0 0 20px;font-size:26px;font-weight:600;color:#141110;letter-spacing:-.02em">' +
          'Hola ' + _esc(nombre) + ', nos vemos pronto.</h1>' +
        '<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#57534e">' +
          'Gracias por reservar un rato conmigo. Son unos 20 minutos, sin guion y sin compromiso.</p>' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:24px">' +
          _fila('Día', d.dia) + _fila('Hora', d.hora) + _fila('Tema', d.tema || 'Por decidir') +
        '</table>' +
        '<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#57534e">' +
          'Te escribiré por WhatsApp para confirmarlo. Si no te viene bien, respóndeme a este correo y lo cambiamos sin problema.</p>' +
        wa +
        '<p style="margin:26px 0 0;padding-top:18px;border-top:1px solid #e7e5e4;font-size:13px;color:#a8a29e">' +
          _esc(MI_NOMBRE) + '</p>' +
      '</div>' +
    '</div>';
}

function _correoMio(d) {
  var tel = String(d.telefono || '').replace(/[^0-9]/g, '');
  return '' +
    '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;padding:24px 16px">' +
      '<div style="max-width:520px;margin:0 auto">' +
        '<h1 style="margin:0 0 18px;font-size:22px;font-weight:600;color:#141110">Tienes una reunión nueva</h1>' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:22px">' +
          _fila('Nombre', d.nombre) + _fila('Día', d.dia) + _fila('Hora', d.hora) +
          _fila('Tema', d.tema) + _fila('Correo', d.email) + _fila('WhatsApp', d.telefono) +
          _fila('Vino de', d.origen) +
        '</table>' +
        (tel
          ? '<a href="https://wa.me/' + tel + '" ' +
            'style="display:inline-block;background:#141110;color:#ffffff;text-decoration:none;' +
            'padding:12px 22px;border-radius:999px;font-size:14px;font-weight:600">Escribirle por WhatsApp</a>'
          : '') +
      '</div>' +
    '</div>';
}

function _fila(k, v) {
  if (!v) return '';
  return '<tr>' +
    '<td style="padding:9px 0;border-bottom:1px solid #f0efed;font-size:13px;color:#a8a29e">' + _esc(k) + '</td>' +
    '<td style="padding:9px 0;border-bottom:1px solid #f0efed;font-size:15px;font-weight:600;color:#141110;text-align:right">' + _esc(v) + '</td>' +
  '</tr>';
}

function _esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
