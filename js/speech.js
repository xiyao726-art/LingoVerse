/* ============================================================
 * 语界 LingoVerse —— 语音能力层
 * 文字转语音（朗读/听力） + 语音识别（口语跟读评分）
 * 基于 Web Speech API（SpeechSynthesis / SpeechRecognition）
 * ============================================================ */
(function () {
"use strict";

const synth = window.speechSynthesis || null;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let voices = [];

function refreshVoices() {
  if (!synth) return;
  voices = synth.getVoices();
}
if (synth) {
  refreshVoices();
  synth.onvoiceschanged = refreshVoices;
}

/* 朗读：返回 Promise，结束时 resolve */
function speak(text, lang, rate = 1) {
  return new Promise((resolve) => {
    if (!synth) { resolve(false); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1;
    // 优先选择语种匹配的本地嗓音
    const match = voices.find((v) => v.lang === lang && v.localService)
      || voices.find((v) => v.lang && v.lang.toLowerCase() === lang.toLowerCase())
      || voices.find((v) => v.lang && v.lang.split("-")[0] === lang.split("-")[0]);
    if (match) u.voice = match;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    // 兜底：1.2 倍超时保护
    setTimeout(() => resolve(true), Math.max(2500, text.length * 180 / Math.max(rate, 0.5)));
    synth.speak(u);
  });
}

function stopSpeak() { if (synth) synth.cancel(); }

/* 语音识别：返回 {ok, transcript, error} */
function recognize(lang, timeoutMs = 6000) {
  return new Promise((resolve) => {
    if (!SR) { resolve({ ok: false, error: "unsupported" }); return; }
    let rec;
    try {
      rec = new SR();
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.continuous = false;
    } catch (e) {
      resolve({ ok: false, error: "unsupported" }); return;
    }
    let done = false;
    const finish = (r) => { if (!done) { done = true; try { rec.stop(); } catch (e) {} resolve(r); } };
    const timer = setTimeout(() => finish({ ok: false, error: "timeout" }), timeoutMs);
    rec.onresult = (ev) => {
      clearTimeout(timer);
      const alts = [];
      for (let i = 0; i < ev.results[0].length; i++) alts.push(ev.results[0][i].transcript);
      finish({ ok: true, transcript: alts[0] || "", alternatives: alts });
    };
    rec.onerror = (ev) => { clearTimeout(timer); finish({ ok: false, error: ev.error || "error" }); };
    rec.onend = () => { clearTimeout(timer); if (!done) finish({ ok: false, error: "no-speech" }); };
    try { rec.start(); } catch (e) { clearTimeout(timer); finish({ ok: false, error: "start-failed" }); }
  });
}

/* 文本规范化：去标点、转小写、压缩空格（中日韩字符安全） */
function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[.,!?;:"'“”‘’()（）。、？！，；：～~—\-…\[\]{}«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* 编辑距离（字符级，对中日韩文同样有效） */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i].concat(new Array(n).fill(0)));
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/* 发音相似度 0-100：取多个候选中的最高分；英文按词序列也比较一次 */
function score(target, heardList) {
  const t = norm(target);
  if (!t) return 0;
  const cands = (heardList || []).map(norm).filter(Boolean);
  if (!cands.length) return 0;
  let best = 0;
  cands.forEach((h) => {
    const dist = levenshtein(t, h);
    const ratio = Math.max(0, 1 - dist / Math.max(t.length, h.length));
    // 词级重合度（容忍词序小差异）
    const wt = t.split(" ").filter(Boolean), wh = h.split(" ").filter(Boolean);
    let wordScore = 0;
    if (wt.length > 1 && wh.length) {
      const setH = new Set(wh);
      wordScore = wt.filter((x) => setH.has(x)).length / wt.length;
    }
    best = Math.max(best, Math.round(Math.max(ratio, wordScore * 0.95) * 100));
  });
  return Math.min(100, best);
}

window.SpeechKit = {
  get supportedTTS() { return !!synth; },
  get supportedSTT() { return !!SR; },
  speak, stopSpeak, recognize, norm, score
};
})();
