# Runbook — activate Live AI + manage the admin login

Everything here is a one-time setup. The website works immediately without it
(built-in "Demo AI"); these steps switch the assistant to real DeepSeek and make
the automations genuinely "clever".

---

## A. Turn on Live AI (DeepSeek via Cloudflare Worker) — ~5 min

The DeepSeek key must **never** go in the website, the repo, or the chat. It
lives only inside the Cloudflare Worker as an encrypted secret.

```bash
cd worker

# 1. Log in to Cloudflare (opens your browser once)
npx wrangler login

# 2. Store your DeepSeek key as a secret (paste it when prompted — not in any file)
npx wrangler secret put DEEPSEEK_API_KEY

# 3. Deploy the proxy
npx wrangler deploy
#  → prints a URL like  https://chemspec-ai.<your-subdomain>.workers.dev
```

Then make the whole site "clever" for everyone with the link:

- **Option 1 (global):** put that URL in `config.js` → `AI_PROXY_URL`, commit & push.
  Every visitor now gets live AI.
- **Option 2 (just your browser):** open the site → ⚙ admin → paste the URL in
  **AI proxy URL** → Save. Only your browser uses it.

Get a DeepSeek key at <https://platform.deepseek.com> (API keys). DeepSeek is the
cheap option — no expensive per-call pricing.

> Security: after it works, tighten `ALLOW_ORIGIN` in `worker/worker.js` from `"*"`
> to your Pages origin (e.g. `https://prathap-alpha.github.io`) and redeploy.

---

## B. Change the admin password

The login checks a SHA-256 hash of `email:password`. The cleartext is **not** in
the repo. To set a new one:

```bash
# pick your own email + a STRONG password (do not reuse a phone number)
printf 'you@company.com:YOUR-NEW-STRONG-PASSWORD' | shasum -a 256 | awk '{print $1}'
```

Copy the printed hash into `index.html` → `const ADMIN_CRED_HASH="…"`, then push.

> Note: a login on a static site is a soft gate, not real security — the page is
> world-readable. That's fine here because the only thing behind it is local
> settings; the DeepSeek key is never behind it (it lives in the Worker).

---

## C. Deploy / update the website (GitHub Pages)

```bash
git add -A && git commit -m "update" && git push
```

Pages rebuilds automatically. Live URL:
`https://prathap-alpha.github.io/chemspec-intelligence/`
