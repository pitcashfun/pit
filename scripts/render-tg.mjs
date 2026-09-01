import { chromium } from "playwright";

const css = `
  @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Outfit:wght@400;500&display=swap");
  html,body{margin:0;background:#f6efe4;color:#2a2420}
  body{width:1728px;height:1152px;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif}
  h1{font-family:Fraunces,serif;font-weight:500;letter-spacing:-.03em;margin:0}
`;

const glyph = (w) => `
<svg width="${w}" height="${w}" viewBox="0 0 32 32">
  <rect x="6" y="10" width="20" height="14" rx="2" fill="#fffaf3" stroke="#2a2420" stroke-width="1.75"/>
  <rect x="6" y="10" width="20" height="4" rx="2" fill="#3d8f6a"/>
  <rect x="14" y="16.5" width="4" height="3" rx="0.6" fill="#2a2420"/>
</svg>`;

const pages = {
  system: `<!doctype html><html><head><style>${css}
    .wrap{display:flex;flex-direction:column;align-items:center;gap:56px;padding:80px}
    .row{display:flex;gap:36px}
    .box{width:360px;height:280px;background:#fffaf3;border-radius:36px;border:3px solid #2a2420;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
    .n{font-size:40px;font-family:Fraunces,serif}
    .t{font-size:22px;color:#7a736c}
    h1{font-size:72px}
  </style></head><body><div class="wrap">
    <h1>Till.</h1>
    <div class="row">
      <div class="box"><div class="n">01</div><div class="t">trade on LetsCash</div></div>
      <div class="box"><div class="n">4.7%</div><div class="t">ETH into the drawer</div></div>
      <div class="box"><div class="n">15m</div><div class="t">holders claim ETH</div></div>
    </div>
  </div></body></html>`,

  split: `<!doctype html><html><head><style>${css}
    .row{display:flex;align-items:center;gap:80px}
    .stack{display:flex;flex-direction:column;gap:20px}
    .bar{height:88px;border-radius:22px;display:flex;align-items:center;padding:0 32px;font-size:28px;font-weight:500}
    .pad{width:180px;background:#f4c9b8}
    .till{width:720px;background:#3d8f6a;color:#fffaf3}
    h1{font-size:64px;margin-bottom:28px}
    .hint{color:#7a736c;font-size:22px}
  </style></head><body>
    <div>
      <h1>Where the 5% goes.</h1>
      <div class="stack">
        <div class="bar pad">0.3% pad</div>
        <div class="bar till">4.7% the till · claim ETH</div>
      </div>
      <p class="hint" style="margin-top:28px">We never sell $TILL to pay you.</p>
    </div>
    ${glyph(380)}
  </body></html>`,

  yank: `<!doctype html><html><head><style>${css}
    .col{display:flex;flex-direction:column;align-items:center;gap:28px}
    h1{font-size:80px}
    .sub{font-size:28px;color:#7a736c}
  </style></head><body>
    <div class="col">
      ${glyph(520)}
      <h1>Open the drawer.</h1>
      <div class="sub">hold $TILL · yank every 15 minutes · ETH lands</div>
    </div>
  </body></html>`,
};

const out = {
  system: "/workspace/public/till-tg-system.jpg",
  split: "/workspace/public/till-tg-split.jpg",
  yank: "/workspace/public/till-tg-yank.jpg",
};

const browser = await chromium.launch();
for (const [k, html] of Object.entries(pages)) {
  const page = await browser.newPage({ viewport: { width: 1728, height: 1152 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: out[k], type: "jpeg", quality: 92 });
  await page.close();
  console.log(out[k]);
}
await browser.close();
