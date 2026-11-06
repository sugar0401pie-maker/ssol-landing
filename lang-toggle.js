/* SSOL Wellness House — KOR/ENG 언어 스위치 (v1, 2026-11-06)
   사용법: 모든 페이지(한국어·영문)의 </body> 바로 앞에 한 줄만 넣으면 돼요.
     <script src="/lang-toggle.js" defer></script>
   - header.top 오른쪽 위에 KOR | ENG 스위치를 넣어요(한국어판은 로그인 버튼 왼쪽).
   - 탭(클릭)·좌우 스와이프(드래그)·키보드(←/→, Enter, Space)로 바꿀 수 있어요.
   - 같은 페이지의 다른 언어판으로 이동해요: /about.html ⇄ /en/about.html, / ⇄ /en/
   - 고른 언어는 localStorage 'ssol-lang'에 기억해요(자동 이동은 하지 않음).
*/
(function () {
  var header = document.querySelector('header.top');
  if (!header) return;

  var path = location.pathname.replace(/index\.html$/, '');
  var isEn = /^\/en(\/|$)/.test(path);

  // 영문판이 아직 없는 한국어 페이지 → 영문 대체 경로
  // (영문 정책 페이지가 생기면 privacy·terms 줄을 /en/privacy.html 등으로 바꾸세요)
  var KO_TO_EN = {
    '/login.html': '/en/',
    '/privacy.html': '/en/',
    '/terms.html': '/en/',
    '/privacy-sensitive.html': '/en/'
  };
  // 한국어판이 없는 영문 페이지 → 한국어 대체 경로
  var EN_TO_KO = {
    '/en/consumer-health-data.html': '/privacy-sensitive.html',
    '/en/cookies.html': '/privacy.html'
  };

  function target(toEn) {
    if (toEn) {
      if (isEn) return null;
      if (KO_TO_EN[path]) return KO_TO_EN[path];
      return path === '/' ? '/en/' : '/en' + path;
    }
    if (!isEn) return null;
    if (EN_TO_KO[path]) return EN_TO_KO[path];
    var ko = path.replace(/^\/en/, '');
    return ko === '' || ko === '/' ? '/' : ko;
  }

  var css = '' +
    '.lt-wrap{display:flex;align-items:center;gap:8px}' +
    '.lt{position:relative;display:inline-grid;grid-template-columns:1fr 1fr;align-items:center;height:30px;width:96px;padding:2px;border-radius:99px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.08);cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;font:700 11.5px/1 var(--sans,system-ui,sans-serif);letter-spacing:.6px}' +
    '.lt:focus-visible{outline:3px solid var(--sky,#A9C4D9);outline-offset:3px}' +
    '.lt span{position:relative;z-index:1;text-align:center;color:rgba(255,255,255,.75);transition:color .2s}' +
    '.lt i{position:absolute;top:2px;bottom:2px;left:2px;width:calc(50% - 2px);border-radius:99px;background:#fff;box-shadow:0 2px 6px rgba(2,36,71,.25);transition:transform .22s cubic-bezier(.3,.7,.4,1)}' +
    '.lt[aria-checked="true"] i{transform:translateX(100%)}' +
    '.lt[aria-checked="false"] span.k,.lt[aria-checked="true"] span.e{color:var(--navy,#033667)}' +
    '.lt.drag i{transition:none}' +
    '@media (prefers-reduced-motion:reduce){.lt i,.lt span{transition:none}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var sw = document.createElement('div');
  sw.className = 'lt';
  sw.setAttribute('role', 'switch');
  sw.setAttribute('tabindex', '0');
  sw.setAttribute('aria-checked', isEn ? 'true' : 'false');
  sw.setAttribute('aria-label', isEn ? 'Language: English. Switch to Korean' : '언어: 한국어. 영어로 바꾸기');
  sw.innerHTML = '<i aria-hidden="true"></i><span class="k" lang="ko">KOR</span><span class="e" lang="en">ENG</span>';

  // 헤더 오른쪽 묶음(로그인 버튼이 있으면 그 왼쪽)
  var wrap = document.createElement('div');
  wrap.className = 'lt-wrap';
  var right = header.querySelector('.login, .lang');
  if (right && right.classList.contains('lang')) { right.remove(); right = null; }
  if (right) { header.insertBefore(wrap, right); wrap.appendChild(sw); wrap.appendChild(right); }
  else { header.appendChild(wrap); wrap.appendChild(sw); }

  var thumb = sw.querySelector('i');
  var busy = false;

  function go(toEn) {
    var url = target(toEn);
    sw.setAttribute('aria-checked', toEn ? 'true' : 'false');
    thumb.style.transform = '';
    try { localStorage.setItem('ssol-lang', toEn ? 'en' : 'ko'); } catch (e) {}
    if (!url || busy) return;
    busy = true;
    setTimeout(function () { location.href = url + location.search + location.hash; }, 200);
  }

  // 탭 + 스와이프
  var x0 = null, moved = false, w = 0;
  sw.addEventListener('pointerdown', function (e) {
    x0 = e.clientX; moved = false; w = sw.clientWidth / 2 - 2;
    sw.classList.add('drag');
    try { sw.setPointerCapture(e.pointerId); } catch (err) {}
  });
  sw.addEventListener('pointermove', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0;
    if (Math.abs(dx) > 4) moved = true;
    var base = sw.getAttribute('aria-checked') === 'true' ? w : 0;
    var pos = Math.max(0, Math.min(w, base + dx));
    thumb.style.transform = 'translateX(' + pos + 'px)';
  });
  function end(e) {
    if (x0 === null) return;
    var dx = e.clientX - x0;
    x0 = null;
    sw.classList.remove('drag');
    var on = sw.getAttribute('aria-checked') === 'true';
    if (!moved) { go(!on); return; }          // 탭
    if (dx > 12) go(true);                     // 오른쪽으로 밀기 → ENG
    else if (dx < -12) go(false);              // 왼쪽으로 밀기 → KOR
    else thumb.style.transform = '';
  }
  sw.addEventListener('pointerup', end);
  sw.addEventListener('pointercancel', function () { x0 = null; sw.classList.remove('drag'); thumb.style.transform = ''; });

  sw.addEventListener('keydown', function (e) {
    var on = sw.getAttribute('aria-checked') === 'true';
    if (e.key === 'ArrowRight') { e.preventDefault(); if (!on) go(true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); if (on) go(false); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(!on); }
  });
})();
