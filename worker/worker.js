/* Cloudflare Worker — DeepSeek proxy for Chemspec Intelligence.
 *
 * Why this exists: a static GitHub Pages site cannot safely hold an API key,
 * and DeepSeek blocks direct browser calls (CORS). This Worker holds the key as
 * a server-side secret (DEEPSEEK_API_KEY) and exposes a CORS-enabled endpoint
 * the website can call. The key is NEVER in the repo or the browser.
 *
 * Deploy: see ../RUNBOOK.md  (wrangler login → secret put → deploy).
 */

// Lock this to your Pages origin in production, e.g. "https://prathap-alpha.github.io"
const ALLOW_ORIGIN = "*";

export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return json({ error: "POST only" }, 405, cors);
    if (!env.DEEPSEEK_API_KEY) return json({ error: "Worker is missing the DEEPSEEK_API_KEY secret" }, 500, cors);

    let body;
    try { body = await req.json(); } catch { return json({ error: "invalid JSON body" }, 400, cors); }

    const payload = {
      model: body.model || "deepseek-chat",
      temperature: typeof body.temperature === "number" ? body.temperature : 0.4,
      messages: Array.isArray(body.messages) ? body.messages.slice(-12) : [],
      max_tokens: 700,
      stream: false,
    };

    let r;
    try {
      r = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.DEEPSEEK_API_KEY },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      return json({ error: "upstream fetch failed: " + e.message }, 502, cors);
    }

    const data = await r.json().catch(() => ({ error: "upstream returned non-JSON" }));
    return json(data, r.status, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
