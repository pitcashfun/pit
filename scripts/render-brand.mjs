import { writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";

mkdirSync("/tmp/till-art", { recursive: true });

const css = `
  @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Outfit:wght@400;500&display=swap");
  html, body { margin: 0; background: #f6efe4; }
  .till {
    width: 32px; height: 32px;
  }
`;

const glyph = (w = 320) => {
  const s = w / 32;
  return `
  <svg width="${w}" height="${w}" viewBox="0 0 32 32">
    <rect x="6" y="10" width="20" height="14" rx="2" fill="#fffaf3" stroke="#2a2420" stroke-width="1.75"/>
    <rect x="6" y="10" width="20" height="4" rx="2" fill="#3d8f6a"/>
    <rect x="14" y="16.5" width="4" height="3" rx="0.6" fill="#2a2420"/>
  </svg>`;
};

const pages = {
  logo: {
    w: 1024,
    h: 1024,
    html: `<!doctype html><html><head><style>${css}
      body{display:flex;align-items:center;justify-content:center;width:1024px;height:1024px;background:#f6efe4}
    </style></head><body>${glyph(640)}</body></html>`,
  },
  hero: {
    w: 1408,
    h: 1408,
    html: `<!doctype html><html><head><style>${css}
      body{display:flex;flex-direction:column;align-items:center;justify-content:center;width:1408px;height:1408px;background:#f6efe4;gap:48px}
      p{font-family:Fraunces,serif;font-size:72px;margin:0;color:#2a2420;font-weight:500;letter-spacing:-.03em}
    </style></head><body>${glyph(720)}<p>Till.</p></body></html>`,
  },
  banner: {
    w: 2160,
    h: 864,
    html: `<!doctype html><html><head><style>${css}
      body{display:flex;align-items:center;justify-content:space-between;width:2160px;height:864px;background:#f6efe4;padding:0 160px;box-sizing:border-box}
      h1{font-family:Fraunces,serif;font-size:180px;margin:0;color:#2a2420;font-weight:500;letter-spacing:-.04em}
      .sub{font-family:Outfit,sans-serif;font-size:28px;color:#7a736c;margin-top:12px}
    </style></head><body>
      <div><h1>Till.</h1><div class="sub">paste the till · 4.7% in · ETH out</div></div>
      ${glyph(520)}
    </body></html>`,
  },
  quiet: {
    w: 2160,
    h: 864,
    html: `<!doctype html><html><head><style>${css}
      body{display:flex;align-items:center;justify-content:center;width:2160px;height:864px;background:#f6efe4}
    </style></head><body>${glyph(420)}</body></html>`,
  },
  wells: {
    w: 1728,
    h: 1152,
    html: `<!doctype html><html><head><style>${css}
      body{display:flex;flex-direction:column;align-items:center;justify-content:center;width:1728px;height:1152px;background:#f6efe4;gap:56px}
      .row{display:flex;gap:40px}
      .card{width:280px;height:200px;background:#fffaf3;border:3px solid #2a2420;border-radius:28px;display:flex;flex-direction:column;overflow:hidden}
      .lip{height:48px;background:#3d8f6a}
      .h{flex:1;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:32px;color:#2a2420;font-weight:500}
    </style></head><body>
      <div class="row">
        <div class="card"><div class="lip"></div><div class="h">4.7%</div></div>
        <div class="card"><div class="lip"></div><div class="h">ETH</div></div>
        <div class="card"><div class="lip"></div><div class="h">15m</div></div>
        <div class="card"><div class="lip"></div><div class="h">TILL</div></div>
      </div>
    </body></html>`,
  },
  receipt: {
    w: 1728,
    h: 1152,
    html: `<!doctype html><html><head><style>${css}
      body{display:flex;align-items:center;justify-content:center;gap:80px;width:1728px;height:1152px;background:#f6efe4}
      .rec{width:520px;height:640px;background:#fffaf3;border:3px dashed #eadfd0;border-radius:36px;padding:48px;box-sizing:border-box;font-family:Outfit,sans-serif;color:#2a2420}
      .rec h2{font-family:Fraunces,serif;font-size:56px;margin:12px 0 24px;font-weight:500}
      .rec p{margin:10px 0;font-size:22px;color:#7a736c}
    </style></head><body>
      ${glyph(420)}
      <div class="rec">
        <p>RECEIPT</p>
        <h2>$TILL</h2>
        <p>4.7% in</p>
        <p>ETH out</p>
        <p>15 min yank</p>
      </div>
    </body></html>`,
  },
};

const out = {
  logo: "/workspace/public/logo.jpg",
  hero: "/workspace/public/till-hero.jpg",
  banner: "/workspace/public/till-banner.jpg",
  quiet: "/workspace/public/till-banner-quiet.jpg",
  wells: "/workspace/public/till-wells.jpg",
  receipt: "/workspace/public/till-receipt.jpg",
};

const browser = await chromium.launch();
for (const [key, spec] of Object.entries(pages)) {
  const page = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
  await page.setContent(spec.html, { waitUntil: "networkidle" });
  await page.screenshot({ path: out[key], type: "jpeg", quality: 92 });
  await page.close();
  console.log("wrote", out[key]);
}
await browser.close();
