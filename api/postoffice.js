// 고민우체국(대표님 2026-11-26: 앱 게시판의 글 전체를 랜딩에도 올림).
// 글 원본은 앱에서 관리해요. 여기서는 앱의 공개 데이터(/api/board/public)를 받아 랜딩 주소의 글 페이지로 그려요.
// 그래서 예약 회차는 공개 날짜가 되면, 앱에서 고친 글은 몇 분 안에 자동으로 반영돼요(이 파일은 안 고쳐도 됨).
// 주소(vercel.json): /postoffice · /postoffice/<회차> · /postoffice-sitemap.xml
// 주의: /postoffice/index.json은 만들지 않아요 — 앱이 그 파일이 있으면 앱 안의 글 대신 그 목록을 써요.

const SITE = "https://www.ssolwellnesshouse.com";
const APP = "https://app.ssolwellnesshouse.com";
const DATA_URL = process.env.BOARD_DATA_URL || APP + "/api/board/public";

const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const abs = (src) => {
  try {
    const u = new URL(src, APP);
    return u.protocol === "https:" ? u.href : "";
  } catch (e) {
    return "";
  }
};
const dateLabel = (key) => `${Number(String(key).slice(5, 7))}월 ${Number(String(key).slice(8, 10))}일`;
const tagLink = (t) => `<a href="${APP}/board/tag/${encodeURIComponent(t)}">#${esc(t)}</a>`;

const FOOTER = `  <footer>
    <a class="by" href="https://www.ssolwellness.com">by 쏠 웰니스 하우스</a>
    <div class="links"><a href="/postoffice">고민우체국</a><span>·</span><a href="/safety.html">안전 장치</a><span>·</span><a href="/faq.html">자주 묻는 질문</a><span>·</span><a href="/team.html">만든 사람들</a><span>·</span><a href="/session.html">웰니스 세션</a><span>·</span><a href="/privacy-guide.html">개인정보 보호</a></div>
    <div class="links"><a href="/about.html">쏘웰라 소개</a><span>·</span><a href="/privacy.html">개인정보처리방침</a><span>·</span><a href="/terms.html">이용약관</a><span>·</span><a href="/privacy-sensitive.html">민감정보 처리방침</a></div>
    <div>쏠 웰니스 하우스 · 대표 김준석 · 사업자등록번호 572-07-03549 · 통신판매업신고번호 2026-서울마포-2770</div>
    <div>서울시 마포구 독막로 100 4층 408호 · 연락처 010-2835-2263</div>
  </footer>`;

const CSS = `
:root{--navy:#033667;--sky:#A9C4D9;--sky-soft:#E3EDF4;--page:#E9EFF4;--ground:#FFFFFF;--ink:#0F1E2C;--muted:#4E5D6B;--line:#D5E1EA;--card:#FFFFFF;--accent:#033667;
  --serif:'Gowun Batang','Nanum Myeongjo',serif;--sans:'Noto Sans KR',system-ui,-apple-system,sans-serif}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--page:#070F17;--ground:#0B1824;--ink:#E7EEF4;--muted:#A5B6C5;--line:#23384B;--card:#11222F;--sky-soft:#132838;--accent:#A9C4D9;color-scheme:dark}}
:root[data-theme="dark"]{--page:#070F17;--ground:#0B1824;--ink:#E7EEF4;--muted:#A5B6C5;--line:#23384B;--card:#11222F;--sky-soft:#132838;--accent:#A9C4D9;color-scheme:dark}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--page);color:var(--ink);font-family:var(--sans);font-size:15.5px;line-height:1.75;word-break:keep-all;overflow-wrap:break-word}
a{color:inherit}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid var(--sky);outline-offset:3px}
img{max-width:100%}
h1,h2,h3{font-family:var(--serif);font-weight:700;letter-spacing:-.4px;text-wrap:balance;margin:0}
.app{max-width:430px;margin:0 auto;background:var(--ground);box-shadow:0 0 0 1px var(--line),0 20px 60px rgba(3,54,103,.12)}
@media (min-width:600px){.app{margin-block:24px;border-radius:28px;overflow:hidden}}
.top{display:flex;align-items:center;justify-content:space-between;height:62px;padding-inline:18px;background:#033667}
.logo{display:flex;align-items:center;gap:8px;white-space:nowrap;color:#fff;text-decoration:none;font-weight:700;font-size:15px}
.logo img{width:34px}
.login{font-size:13px;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.5);padding:5px 12px;border-radius:99px}
main{padding:16px 20px 36px}
.back{display:inline-block;padding:6px 0;font-size:14px;color:var(--muted)}
.chip{display:inline-block;margin-top:10px;background:var(--sky-soft);color:var(--ink);border-radius:99px;padding:1px 12px;font-size:12.5px;font-weight:700}
h1{font-size:23px;line-height:1.45;margin-top:10px}
.box{background:var(--sky-soft);border-radius:16px;padding:14px 16px;margin-top:16px}
.box b{display:block;font-size:13.5px;color:var(--accent)}
.box p{margin:4px 0 0}
.slides{margin-top:16px}
.track{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;border-radius:16px;scrollbar-width:none}
.track::-webkit-scrollbar{display:none}
.track img{flex:0 0 100%;width:100%;height:auto;scroll-snap-align:center;border-radius:16px}
.nav{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:8px;font-size:13px;color:var(--muted)}
.nav button{width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:18px;cursor:pointer}
.cover{display:block;width:100%;height:auto;border-radius:16px;margin-top:16px}
.body{margin-top:20px}
.body p{margin:12px 0 0}
.body h2{font-size:19px;margin-top:24px}
.body h3{font-size:17px;margin-top:20px}
.body blockquote{margin:12px 0 0;padding:2px 0 2px 14px;border-left:3px solid var(--line)}
.body ul,.body ol{margin:10px 0 0;padding-left:20px}
.body a{color:var(--accent)}
.note{margin:14px 0 0;font-size:12.5px;line-height:1.7;color:var(--muted)}
.promo{margin-top:24px;border:1px solid var(--line);background:var(--card);border-radius:16px;padding:16px}
.promo .head{margin:0;font-family:var(--serif);font-weight:700;font-size:17px;line-height:1.5;color:var(--accent)}
.promo .desc{margin:4px 0 0;font-size:13.5px;color:var(--muted)}
.promo a{display:block;margin-top:12px;background:var(--sky-soft);border-radius:12px;padding:10px 12px;text-decoration:none}
.promo a span{display:block;font-size:13px;color:var(--muted);line-height:1.6}
.promo a .name{font-size:12px;color:var(--accent);font-weight:700}
.promo a .t{font-size:14.5px;color:var(--ink);font-weight:700}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
.tags a{border:1px solid var(--line);border-radius:99px;padding:2px 10px;font-size:12px;color:var(--muted);text-decoration:none}
details{margin-top:8px}
summary{cursor:pointer;font-size:12.5px;color:var(--muted)}
.cta{display:flex;align-items:center;justify-content:center;height:52px;margin-top:22px;border-radius:14px;background:#033667;color:#fff;font-weight:700;text-decoration:none}
.pager{display:flex;justify-content:space-between;gap:10px;margin-top:18px;font-size:13.5px}
.pager a{color:var(--accent)}
.lead{margin:6px 0 0;color:var(--muted);font-size:14px}
.list{list-style:none;margin:18px 0 0;padding:0;display:flex;flex-direction:column;gap:10px}
.row{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;align-items:center;border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px;text-decoration:none}
.row img,.row .no{width:64px;height:72px;object-fit:cover;object-position:top;border-radius:10px;background:var(--sky-soft)}
.row .no{display:grid;place-items:center;font-weight:700;color:var(--muted)}
.row strong{display:block;font-size:14.5px;line-height:1.5}
.row small{display:block;margin-top:2px;font-size:12px;color:var(--muted)}
.row.soon{border-style:dashed;opacity:.6}
footer{padding:28px 20px 36px;text-align:center;font-size:11.5px;color:var(--muted);line-height:1.8;display:flex;flex-direction:column;align-items:center;gap:2px;border-top:1px solid var(--line)}
footer .by{color:var(--accent);text-underline-offset:3px;font-size:13px}
footer .links{margin:4px 0;display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
footer .links a{text-underline-offset:3px}
`;

function layout({ title, description, canonical, image, type, noindex, main }) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/icon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<title>${esc(title)}</title>
${description ? `<meta name="description" content="${esc(description)}">` : ""}
${noindex ? '<meta name="robots" content="noindex">' : ""}
${canonical ? `<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="${type || "website"}">
<meta property="og:locale" content="ko_KR">
<meta property="og:site_name" content="쏠 웰니스 하우스">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">` : ""}
${image ? `<meta property="og:image" content="${esc(image)}">` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<div class="app">
  <header class="top">
    <a class="logo" href="/"><img src="/images/mark-cream.png" alt="">쏠 웰니스 하우스</a>
    <a class="login" href="/login.html">로그인</a>
  </header>
  <main>
${main}
  </main>
${FOOTER}
</div>
<script src="/pv.js" defer></script>
</body>
</html>
`;
}

function listPage(data) {
  const eps = data.episodes;
  const rows = eps
    .map((e) => {
      const img = e.cover ? abs(e.cover) : "";
      return `<li><a class="row" href="/postoffice/${e.n}">${img ? `<img src="${esc(img)}" alt="" loading="lazy" width="64" height="72">` : `<span class="no">${e.n}화</span>`}<span><strong>${e.n}화. ${esc(e.title)}</strong><small>${e.tags.main.map((t) => "#" + esc(t)).join(" ")}</small></span></a></li>`;
    })
    .join("\n");
  const soon = (data.upcoming || [])
    .map((u) => `<li><div class="row soon"><span class="no">${u.n}화</span><span><strong>${esc(u.title)}</strong><small>${dateLabel(u.publishAt)} 공개 예정이에요</small></span></div></li>`)
    .join("\n");
  return layout({
    title: "고민우체국 | 쏠 웰니스 하우스",
    description: "일상의 고민을 받아서 답변해드려요. " + eps.slice(-3).map((e) => e.title).join(" · "),
    canonical: SITE + "/postoffice",
    image: eps[0] && eps[0].cover ? abs(eps[0].cover) : "",
    main: `<span class="chip">고민 타파</span>
<h1>고민우체국</h1>
<p class="lead">일상의 고민을 받아서 답변해드려요.</p>
<ul class="list">
${rows}
${soon}
</ul>
<a class="cta" href="${APP}/">쏘웰라와 이야기하기</a>`,
  });
}

function postPage(data, e) {
  const eps = data.episodes;
  const i = eps.findIndex((x) => x.n === e.n);
  const prev = eps[i - 1];
  const next = eps[i + 1];
  const images = (e.images || []).map((m) => ({ src: abs(m.src), alt: m.alt })).filter((m) => m.src);
  const cover = !images.length && e.cover ? abs(e.cover) : "";
  const shareImage = e.cover ? abs(e.cover) : images[0] ? images[0].src : "";
  const slides = images.length
    ? `<section class="slides" aria-label="고민우체국 ${e.n}화 대화 캡처">
<div class="track" id="track" tabindex="0">
${images.map((m, k) => `<img src="${esc(m.src)}" alt="${esc(m.alt)}" width="900" height="1200"${k ? ' loading="lazy"' : ""}>`).join("\n")}
</div>
${images.length > 1 ? `<div class="nav"><button type="button" data-step="-1" aria-label="이전 그림">‹</button><span id="count">1 / ${images.length}</span><button type="button" data-step="1" aria-label="다음 그림">›</button></div>
<script>
(function(){var t=document.getElementById("track"),c=document.getElementById("count"),n=${images.length};
function at(){return Math.round(t.scrollLeft/(t.clientWidth+10));}
t.addEventListener("scroll",function(){c.textContent=(at()+1)+" / "+n;},{passive:true});
[].forEach.call(document.querySelectorAll("[data-step]"),function(b){b.addEventListener("click",function(){var k=Math.max(0,Math.min(n-1,at()+Number(b.getAttribute("data-step"))));t.scrollTo({left:k*(t.clientWidth+10),behavior:"smooth"});});});})();
</script>` : ""}
</section>`
    : "";
  const p = e.promo;
  const t = data.tarot;
  return layout({
    title: `고민우체국 ${e.n}화 — ${e.title} | 쏠 웰니스 하우스`,
    description: e.summary,
    canonical: `${SITE}/postoffice/${e.n}`,
    image: shareImage,
    type: "article",
    main: `<a class="back" href="/postoffice">‹ 고민우체국 목록</a>
<article>
${cover ? `<img class="cover" src="${esc(cover)}" alt="고민우체국 ${e.n}화 표지" width="720" height="900">` : ""}
<div><span class="chip">고민우체국 ${e.n}화</span></div>
<h1>${esc(e.title)}</h1>
${slides}
<div class="box"><b>줄거리</b><p>${esc(e.summary)}</p></div>
${e.html ? `<div class="body">${e.html}</div>` : '<p class="note">전체 글은 준비하고 있어요. 곧 이 자리에 올라와요.</p>'}
</article>
<p class="note">일상의 고민을 받아서 답변해드려요.</p>
<p class="note">이 글은 자기이해를 돕는 일반 정보예요. 의료적 진단이나 심리 치료를 대신하지 않아요.</p>
<section class="promo">
<p class="head">${esc(p.sowella.headline)}</p>
<p class="desc">${esc(p.sowella.desc)}</p>
<a href="${esc(t.url)}" target="_blank" rel="noopener"><span class="name">${esc(t.name)}</span><span class="t">${esc(p.tarot.headline)}</span><span>${esc(p.tarot.desc)}</span></a>
</section>
<nav class="tags" aria-label="태그">${e.tags.main.map(tagLink).join("")}</nav>
${e.tags.rest.length ? `<details><summary>태그 ${e.tags.rest.length}개 더 보기</summary><div class="tags">${e.tags.rest.map(tagLink).join("")}</div></details>` : ""}
<a class="cta" href="${APP}/">쏘웰라와 이야기하기</a>
<nav class="pager" aria-label="이전·다음 회차"><span>${prev ? `<a href="/postoffice/${prev.n}">‹ ${prev.n}화</a>` : ""}</span><span>${next ? `<a href="/postoffice/${next.n}">${next.n}화 ›</a>` : ""}</span></nav>`,
  });
}

const messagePage = (heading, text) =>
  layout({
    title: `${heading} | 쏠 웰니스 하우스`,
    noindex: true,
    main: `<h1>${esc(heading)}</h1>
<p class="lead">${esc(text)}</p>
<p><a class="back" href="/postoffice">‹ 고민우체국 목록</a></p>
<a class="cta" href="${APP}/board">앱의 고민 타파 보기</a>`,
  });

function sitemap(data) {
  const urls = [`${SITE}/postoffice`, ...data.episodes.map((e) => `${SITE}/postoffice/${e.n}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
}

async function loadData() {
  const res = await fetch(DATA_URL, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("data " + res.status);
  const data = await res.json();
  if (!Array.isArray(data.episodes) || !data.episodes.length) throw new Error("empty");
  return data;
}

function send(res, status, body, cache, type) {
  res.statusCode = status;
  res.setHeader("Content-Type", (type || "text/html") + "; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(body);
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, SITE);
  const q = req.query || {};
  const wantsSitemap = (q.sitemap || url.searchParams.get("sitemap")) === "1";
  const raw = q.n != null ? q.n : url.searchParams.get("n");
  let data;
  try {
    data = await loadData();
  } catch (e) {
    console.error("postoffice:", e.message);
    return send(res, 503, messagePage("잠시 글을 못 가져왔어요", "조금 뒤에 다시 열어 주세요."), "no-store");
  }
  // 5분 동안은 저장해 둔 화면을 보여 주고, 앱이 잠깐 안 열려도 하루까지는 마지막 화면을 보여 줘요.
  const cache = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
  if (wantsSitemap) return send(res, 200, sitemap(data), cache, "application/xml");
  if (raw == null || raw === "") return send(res, 200, listPage(data), cache);
  const e = data.episodes.find((x) => String(x.n) === String(raw));
  if (!e) return send(res, 404, messagePage("아직 없는 글이에요", "아직 공개 전이거나 주소가 달라요."), "public, max-age=0, s-maxage=60");
  return send(res, 200, postPage(data, e), cache);
};
