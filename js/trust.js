/* CODED FIT — Honest Limits disclosure (auto-injected).
   Mount: <div data-honest-limits></div> anywhere in the page.
   No fake accuracy anywhere on the platform — this strip states it plainly. */
(function () {
  'use strict';
  const HTML = `
    <div style="border:1px solid #e8d9a0;background:#fffae8;border-radius:4px;padding:14px 16px;margin:20px 0;font-size:12px;line-height:1.7;color:#4a3f10;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:800;letter-spacing:1px;color:#8a6d00;margin-bottom:6px;">◉ HONEST LIMITS — PLEASE READ</div>
      <div>• Body measurements yahan <b>estimate</b> hain (photo + height/weight se) — medical-grade ya tailor-tape accuracy ka daava nahi karte. Har value par confidence % dikhta hai.</div>
      <div>• 3D avatar aapke <b>proportions ka parametric model</b> hai, photorealistic twin nahi. Final fit hamesha <b>First Garment Trial</b> me confirm hota hai.</div>
      <div>• Photo try-on <b>server-side secure API</b> se hota hai — aapki API keys kabhi frontend ya app me nahi hoti.</div>
      <div>• Aapka body data <b>aapke control me</b> hai: Body Visualizer page par <b>Delete My Data</b> se turant delete karo.</div>
    </div>`;
  function mount() {
    document.querySelectorAll('[data-honest-limits]').forEach(el => {
      if (!el.dataset.done) { el.innerHTML = HTML; el.dataset.done = '1'; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
