// MOVE Feed — prévia de link (WhatsApp, Instagram, Telegram...) com nome do cliente e período.
// Cloudflare Worker (plano gratuito). Cole este código inteiro no editor do Worker.

const PROJECT_ID = "move-operacional";
const API_KEY = "AIzaSyCwnBQwHmfl5F_fm93rsAL7RDguYcsHs0o"; // chave web pública do seu Firebase
const SITE = "https://brunaminellyd.github.io/move-dashboard/feed-cliente.html";
const IMAGE = "https://brunaminellyd.github.io/move-dashboard/assets/brand/og-move.png";
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sv = f => f && f.stringValue;

async function get(path) {
  const r = await fetch(`${FIRESTORE}/${path}?key=${API_KEY}`, { headers: { Referer: "https://brunaminellyd.github.io/" } });
  return r.ok ? r.json() : null;
}

function periodo(f) {
  const per = sv(f.period) || sv(f.mes) || "";
  const ini = sv(f.inicio) || (per ? per + "-01" : "");
  const fim = sv(f.fim) || ini;
  if (!ini) return "";
  const D = (s, o) => new Date(s + "T12:00:00Z").toLocaleDateString("pt-BR", { timeZone: "UTC", ...o });
  if (ini.slice(0, 7) === fim.slice(0, 7)) return D(ini, { month: "long", year: "numeric" });
  const outroAno = ini.slice(0, 4) !== fim.slice(0, 4);
  const a = D(ini, outroAno ? { day: "numeric", month: "short", year: "numeric" } : { day: "numeric", month: "short" });
  const b = D(fim, { day: "numeric", month: "short", year: "numeric" });
  return (a + " a " + b).replace(/\./g, "");
}

export default {
  async fetch(req) {
    const u = new URL(req.url);
    const t = (u.searchParams.get("t") || "").trim();
    let title = "Planejamento de conteúdo — MOVE Marketing";
    let desc = "Veja as publicações planejadas, comente e aprove.";

    if (/^[a-f0-9]{32}$/.test(t)) {
      try {
        const share = await get(`feed_shares/${t}`);
        const planId = share && sv(share.fields && share.fields.planId);
        const plan = planId && (await get(`feed_plans/${planId}`));
        const f = plan && plan.fields;
        if (f && f.shareAtivo && f.shareAtivo.booleanValue) {
          const nome = sv(f.clientName) || sv(f.clienteNome) || "";
          const per = periodo(f);
          if (nome) {
            title = nome + (per ? " · " + per : "");
            desc = "Planejamento de conteúdo MOVE Marketing. Toque para ver as publicações, comentar e aprovar.";
          }
        }
      } catch (e) { /* se falhar, usa a prévia genérica */ }
    }

    const dest = SITE + (t ? "?t=" + encodeURIComponent(t) : "");
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta property="og:type" content="website"><meta property="og:site_name" content="MOVE Marketing">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${IMAGE}"><meta property="og:image:width" content="600"><meta property="og:image:height" content="600">
<meta property="og:url" content="${esc(req.url)}"><meta name="twitter:card" content="summary">
<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${esc(dest)}"></head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:40px"><p>Abrindo o planejamento…</p>
<p><a href="${esc(dest)}">Clique aqui se não abrir</a></p><script>location.replace(${JSON.stringify(dest)})</script></body></html>`;

    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
  }
};
