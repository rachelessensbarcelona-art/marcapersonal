/**
 * Pega este código en Extensiones > Apps Script de tu Hoja de cálculo de Google.
 * Instrucciones completas en README.md, apartado "Reservas en Google Sheets".
 */

var CABECERAS = ['Fecha', 'Nombre', 'WhatsApp', 'Día', 'Hora', 'Tema', 'Origen'];

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (hoja.getLastRow() === 0) {
      hoja.appendRow(CABECERAS);
      hoja.getRange(1, 1, 1, CABECERAS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }

    hoja.appendRow([
      new Date(d.fecha || Date.now()),
      d.nombre || '',
      "'" + (d.telefono || ''),
      d.dia || '',
      d.hora || '',
      d.tema || '',
      d.origen || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
