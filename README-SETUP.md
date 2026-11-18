# Configurar Google Sheets + alerta de email + WhatsApp (Cloud API)

## A. Criar a folha Google
1. Aceda a https://sheets.google.com e crie uma folha chamada `Leads Ricardo Cavaca`.
2. Renomeie a primeira aba para `Leads` (o script cria os cabeçalhos automaticamente na primeira submissão).
3. Na folha: Extensões > Apps Script.
4. Apague o código de exemplo e cole todo o conteúdo de `google-apps-script.gs`.
5. Guardar (Ctrl+S). No Apps Script, abra ⚙️ Project Settings > Script properties > Add script property:
   - `NOTIFY_EMAIL` = email para receber alerta gratuito (ex.: email do Ricardo).

## B. Publicar como Web App
1. Apps Script > Deploy > New deployment.
2. Tipo: Web app.
3. Description: `Receção de leads landing page`.
4. Execute as: **Me**.
5. Who has access: **Anyone** (o formulário público precisa de enviar dados sem login).
6. Deploy. Autorize os acessos pedidos.
7. Copie o URL terminado em `/exec`.

## C. Ligar a landing page
1. Abra `index.html` num editor de texto.
2. Procure `const GOOGLE_SCRIPT_URL = 'COLAR_AQUI_URL_WEB_APP_GOOGLE_APPS_SCRIPT';`
3. Substitua o placeholder pelo URL `/exec` que copiou, mantendo as aspas.
4. Volte a carregar `index.html` no GitHub e faça Commit changes. O Pages publica a atualização.

## D. Testar
1. Abra o site publicado no telemóvel ou numa janela privada.
2. Preencha um lead de teste e submeta.
3. Confirme que aparece uma nova linha na folha `Leads`.
4. Confirme que recebeu email (ver spam se necessário).
5. Teste com dados fictícios e depois apague a linha de teste.

## E. WhatsApp automático — opcional (API oficial Meta)
A mensagem automática para o Ricardo exige a WhatsApp Business Cloud API e um template aprovado. Não basta ter WhatsApp Business instalado.

1. Criar/usar Meta Business Portfolio e uma app Meta Developers com produto WhatsApp.
2. Configurar a Cloud API e obter:
   - Phone Number ID do número remetente/API.
   - Token de acesso adequado (idealmente token permanente de System User; não usar token temporário para produção).
   - Número de destino do Ricardo no formato internacional, apenas dígitos, ex. `351920495389`.
3. Criar e submeter para aprovação um template de categoria Utility, com nome `new_lead_alert`, idioma `pt_PT`, texto:
   `Novo lead para avaliação imobiliária. Nome: {{1}}. Telefone: {{2}}. Tipo de imóvel: {{3}}. Localização: {{4}}.`
   A aprovação e elegibilidade são controladas pela Meta. O destinatário deve estar apto a receber mensagens da API.
4. Apps Script > Project Settings > Script properties, adicionar:
   - `WHATSAPP_ACCESS_TOKEN` = token de acesso
   - `WHATSAPP_PHONE_NUMBER_ID` = Phone Number ID
   - `WHATSAPP_ALERT_RECIPIENT` = telefone do Ricardo em formato internacional, sem `+`
   - `WHATSAPP_TEMPLATE_NAME` = `new_lead_alert`
   - `WHATSAPP_TEMPLATE_LANGUAGE` = `pt_PT`
5. Guardar. Fazer nova submissão de teste. Ver Apps Script > Executions / Logs para erros da chamada API.

**Segurança:** nunca coloque tokens de API no HTML, GitHub, nem nesta conversa. Guarde-os apenas nas Script Properties. Se o código Apps Script for alterado, crie nova versão do Web App (Deploy > Manage deployments > Edit > New version > Deploy).

A API oficial pode ter custos por mensagem, dependendo do tipo, regras e tarifa vigente. Para manter tudo 100% sem custos, deixe apenas `NOTIFY_EMAIL` configurado e não configure as propriedades WhatsApp.
