# Chemspec Intelligence Platform

A web demo of a live dashboard + automation + AI layer for a coatings distributor
(STANDOX / AUTOMAX). Single-page, no build step, deploys free on GitHub Pages.

> All figures are **synthetic / illustrative**. No real customer data.

## What's inside

| View | Shows |
|---|---|
| Overview | Live KPI tiles + 12-month revenue/margin + "what needs you today" feed |
| Sales & Profit | Revenue by month, branch split, top products |
| Stock Forecast | Predictive days-to-stockout + reorder flags |
| Debtors | Aging buckets + auto-generated statement/reminder |
| Quote Pipeline | Funnel + conversion |
| AI Assistant | Technical (mixing ratios, primer specs) + customer (product recs) chat |

It sits **on top of** an existing ERP (e.g. Fincon) — it reads data, it doesn't
replace the system of record.

## Run locally

```bash
python3 -m http.server 4711
# open http://localhost:4711
```

## Live AI

The assistant runs in **Demo mode** out of the box (built-in smart answers).
To make it genuinely clever with DeepSeek, deploy the Cloudflare Worker proxy and
point the app at it — see [RUNBOOK.md](RUNBOOK.md). The DeepSeek API key lives only
in the Worker (server-side secret), never in this repo or the browser.

## Admin portal

Click the ⚙ in the top bar. Sign in to configure the AI proxy URL, model, persona,
and automation toggles. Settings save to the browser (localStorage). Credentials
are validated against a SHA-256 hash — no cleartext password in the source. Change
it via [RUNBOOK.md](RUNBOOK.md).

## Layout

```
index.html      the whole app (HTML + CSS + JS, offline-safe, no CDN)
config.js       public runtime config (AI proxy URL) — no secrets
worker/         Cloudflare Worker proxy for DeepSeek (key = server-side secret)
RUNBOOK.md      activate live AI + change admin password + deploy
```
