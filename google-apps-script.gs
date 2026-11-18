/**
 * LANDING PAGE - Ricardo Cavaca | Predial Rainha Santa
 * Google Apps Script bound to the leads spreadsheet.
 * Set optional WhatsApp API credentials in Project Settings > Script properties.
 */
const SHEET_TAB = 'Leads';

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    // Honeypot anti-spam
    if (p.website) return json_({ok:true, ignored:true});
    const required = ['nome','telefone','tipo','local','consentimento'];
    for (const key of required) {
      if (!p[key]) throw new Error('Missing required field: ' + key);
    }
    if (p.consentimento !== 'Sim') throw new Error('Consent not granted');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_TAB);
    if (!sheet) sheet = ss.insertSheet(SHEET_TAB);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/hora','Nome','Telefone','Tipo de imóvel','Localização','Prazo de venda','Preço pretendido','Detalhes','Consentimento','Origem','Estado','Notas de acompanhamento']);
      sheet.setFrozenRows(1);
      sheet.getRange(1,1,1,12).setFontWeight('bold');
    }

    const timestamp = new Date();
    const lead = {
      nome: clean_(p.nome), telefone: clean_(p.telefone), tipo: clean_(p.tipo),
      local: clean_(p.local), prazo: clean_(p.prazo), preco: clean_(p.preco),
      detalhes: clean_(p.detalhes), source: clean_(p.source)
    };
    sheet.appendRow([timestamp, lead.nome, lead.telefone, lead.tipo, lead.local,
      lead.prazo, lead.preco, lead.detalhes, 'Sim', lead.source, 'Novo', '']);

    // Free backup alert by email (set NOTIFY_EMAIL in Script Properties).
    const props = PropertiesService.getScriptProperties();
    const email = props.getProperty('NOTIFY_EMAIL');
    const subject = '🆕 Novo lead imobiliário — ' + lead.nome;
    const body = 'Novo pedido de avaliação recebido:\n\n' +
      'Nome: ' + lead.nome + '\nTelefone: ' + lead.telefone +
      '\nTipo: ' + lead.tipo + '\nLocalização: ' + lead.local +
      '\nPrazo: ' + (lead.prazo || 'Não indicado') +
      '\nPreço: ' + (lead.preco || 'Não indicado') +
      '\nDetalhes: ' + (lead.detalhes || 'Não indicados') +
      '\n\nRegistado na folha: ' + ss.getUrl();
    if (email) MailApp.sendEmail(email, subject, body);

    // WhatsApp Cloud API notification (optional; requires Meta setup + approved template).
    sendWhatsAppAlert_(lead, props);

    return json_({ok:true});
  } catch (err) {
    console.error(err);
    return json_({ok:false, error:String(err)});
  }
}

function sendWhatsAppAlert_(lead, props) {
  const token = props.getProperty('WHATSAPP_ACCESS_TOKEN');
  const phoneId = props.getProperty('WHATSAPP_PHONE_NUMBER_ID');
  const recipient = props.getProperty('WHATSAPP_ALERT_RECIPIENT'); // e.g. 351920495389
  const template = props.getProperty('WHATSAPP_TEMPLATE_NAME'); // e.g. new_lead_alert
  const language = props.getProperty('WHATSAPP_TEMPLATE_LANGUAGE') || 'pt_PT';
  if (!token || !phoneId || !recipient || !template) return; // WhatsApp not configured; email still alerts.

  const url = 'https://graph.facebook.com/v23.0/' + phoneId + '/messages';
  const payload = {
    messaging_product: 'whatsapp',
    to: recipient,
    type: 'template',
    template: {
      name: template,
      language: { code: language },
      components: [{
        type: 'body',
        parameters: [
          {type:'text', text:lead.nome || '-'},
          {type:'text', text:lead.telefone || '-'},
          {type:'text', text:lead.tipo || '-'},
          {type:'text', text:lead.local || '-'}
        ]
      }]
    }
  };
  const response = UrlFetchApp.fetch(url, {
    method:'post',
    contentType:'application/json',
    headers:{Authorization:'Bearer ' + token},
    payload:JSON.stringify(payload),
    muteHttpExceptions:true
  });
  console.log('WhatsApp API status: ' + response.getResponseCode() + ' / ' + response.getContentText());
}

function clean_(value) {
  return String(value || '').trim().substring(0, 2000);
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
