/* Chemspec Intelligence — public runtime config (NO SECRETS HERE).
 *
 * To turn on Live AI for everyone who opens the link:
 *   1. Deploy the Cloudflare Worker in /worker (see RUNBOOK.md) — your DeepSeek
 *      key lives there as a server-side secret, never in this file or the browser.
 *   2. Paste the Worker URL below and push. Leave "" for the built-in demo AI.
 */
window.CHEMSPEC_CONFIG = {
  AI_PROXY_URL: "",   // set to the Worker URL once DEEPSEEK_API_KEY secret is in the Worker
  MODEL: "deepseek-chat"
};
