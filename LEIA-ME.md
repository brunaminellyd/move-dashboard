# MOVE — arquivos para publicar

Envie ao GitHub, na mesma pasta do projeto, **os três HTMLs e a pasta `assets` inteira** (mantendo as subpastas):

- `index.html`, `feed.html`, `feed-cliente.html`
- `assets/brand/` — logo, favicon, imagem da prévia do WhatsApp e as folhas de estilo (`move-brand.css`, `move-ui.css`) e o script `move-ui.js`
- `assets/fonts/` — a fonte Nexa (arquivos .woff2)

`worker-preview-move.js` não vai para o GitHub: é o código do Worker do Cloudflare (prévia do link no WhatsApp).

Depois de enviar, force a atualização do navegador (Ctrl+Shift+R / Cmd+Shift+R).
Os arquivos antigos `favicon-move.png` e `og-move.png` da raiz do projeto podem ser apagados.
