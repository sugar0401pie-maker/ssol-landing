/* 방문 분석 — 2026-11-19 owner 요청. 페이지가 열릴 때 한 번, 퀴즈 서버(quiz.ssolwellnesshouse.com/api/pv)로 방문 기록을 보낸다.
   개인정보 없음: 브라우저마다 무작위로 만든 방문자 id(쿠키 ssol_vid — ssolwellnesshouse.com 전체에서 공유해서 퀴즈로 넘어간 사람을 같은 사람으로 센다),
   탭마다 무작위로 만든 세션 id, 경로(?뒤는 보내지 않음), 유입 출처(utm·이전 사이트 도메인), 기기 종류만 보낸다.
   '추적 안 함(DNT/GPC)' 설정이나 관리자가 켠 '내 방문 제외'(쿠키 ssol_notrack=1)면 보내지 않는다. 규칙은 퀴즈 저장소 lib/pv.ts·lib/attribution.ts와 같다. */
(function () {
  try {
    var ROOT = "ssolwellnesshouse.com";
    var host = location.hostname;
    if (host !== "www." + ROOT) return; // 로컬·미리보기 주소에서는 보내지 않는다
    var cookie = function (n) {
      var m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)"));
      return m ? decodeURIComponent(m[1]) : "";
    };
    if (cookie("ssol_notrack") === "1" || navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return;
    var newId = function () {
      return window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2);
    };
    var clean = function (v, max) {
      return String(v || "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, max || 40);
    };

    var vid = cookie("ssol_vid") || newId();
    document.cookie = "ssol_vid=" + encodeURIComponent(vid) + "; Max-Age=31536000; Path=/; SameSite=Lax; Domain=." + ROOT + "; Secure";

    var sid;
    try {
      sid = sessionStorage.getItem("ssol_pv_sid");
      if (!sid) { sid = newId(); sessionStorage.setItem("ssol_pv_sid", sid); }
    } catch (e) { sid = newId(); }

    // 유입 출처: 세션의 첫 화면에서 한 번 정해 두고 이후 페이지에서는 그대로 쓴다.
    var attr;
    try { attr = JSON.parse(sessionStorage.getItem("ssol_attr_v1") || "null"); } catch (e) { attr = null; }
    if (!attr) {
      var p = new URLSearchParams(location.search);
      var ref = "";
      try {
        var u = document.referrer ? new URL(document.referrer) : null;
        if (u && u.hostname !== host) ref = clean(u.hostname, 80);
      } catch (e) {}
      var fromRef = function (h) {
        var rules = [
          [/(^|\.)instagram\.com$/, "instagram"], [/(^|\.)(kakao\.com|kakaocdn\.net|kakaotalk\.com)$/, "kakao"],
          [/(^|\.)naver\.(com|me)$/, "naver"], [/(^|\.)google\./, "google"], [/(^|\.)(facebook|fb)\.com$/, "facebook"],
          [/(^|\.)threads\.(net|com)$/, "threads"], [/(^|\.)(twitter|x)\.com$/, "twitter"], [/(^|\.)t\.co$/, "twitter"],
          [/(^|\.)youtube\.com$/, "youtube"], [/(^|\.)daum\.net$/, "daum"],
          [/^quiz\.ssolwellnesshouse\.com$/, "quiz"], [/^app\.ssolwellnesshouse\.com$/, "app"],
          [/^astro\.ssolwellnesshouse\.com$/, "astro"], [/^tarot\.ssolwellnesshouse\.com$/, "tarot"]
        ];
        for (var i = 0; i < rules.length; i++) if (rules[i][0].test(h)) return rules[i][1];
        return "referral";
      };
      attr = { src: clean(p.get("utm_source")) || (ref ? fromRef(ref) : "direct"), med: clean(p.get("utm_medium")), camp: clean(p.get("utm_campaign")), ref: ref };
      try { sessionStorage.setItem("ssol_attr_v1", JSON.stringify(attr)); } catch (e) {}
    }

    var body = JSON.stringify({
      path: location.pathname, vid: vid, sid: sid,
      src: attr.src, med: attr.med, camp: attr.camp, ref: attr.ref,
      dev: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop"
    });
    var url = "https://quiz." + ROOT + "/api/pv";
    // text/plain이라 브라우저의 사전 확인 요청(preflight) 없이 바로 간다.
    var sent = navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: "text/plain;charset=UTF-8" }));
    if (!sent) fetch(url, { method: "POST", body: body, mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=UTF-8" } }).catch(function () {});
  } catch (e) { /* 집계 실패는 화면에 영향을 주지 않는다 */ }
})();
