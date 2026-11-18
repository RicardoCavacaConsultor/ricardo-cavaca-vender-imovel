# Landing page — Ricardo Cavaca | Leads to Google Sheets

## Ficheiros
- `index.html`: landing page
- `assets/predial-rainha-santa-logo.jpeg`: logótipo fornecido
- `assets/ricardo-avatar.png`: avatar usado anteriormente, extraído da imagem de perfil enviada
- `google-apps-script.gs`: backend gratuito para registar leads no Sheets e enviar alertas por email; opcionalmente envia WhatsApp pela Cloud API
- `README-SETUP.md`: configuração

## Publicar a página (GitHub Pages)
1. Criar um repositório público GitHub.
2. Carregar `index.html` para a raiz e a pasta `assets`.
3. Settings > Pages > Deploy from a branch > `main` > `/ (root)` > Save.
4. URL será `https://UTILIZADOR.github.io/NOME-REPOSITORIO/`.

## Formulário
O formulário só funciona quando o URL da Web App do Apps Script é colocado na variável `GOOGLE_SCRIPT_URL` em `index.html`.

## Privacidade
A landing page deve ter uma política de privacidade acessível, identificando o responsável pelo tratamento, finalidade, base legal, retenção, direitos e contactos. Rever o texto com a agência antes de publicar.
