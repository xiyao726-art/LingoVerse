/* ============================================================
 * 语界 LingoVerse —— 互动学习模块
 * 课程详情 + 单词闪卡(SRS) / 语法 / 口语跟读 / 听力 四大训练器
 * ============================================================ */
(function () {
"use strict";

const view = () => document.getElementById("view");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const go = (h) => window.App && window.App.goto(h);
const toast = (msg, type) => window.App && window.App.toast(msg, type);
const celebrate = (list) => window.App && window.App.celebrate(list);

const SKILL_META = {
  vocab: { icon: "🃏", name: "单词记忆", color: "#6C5CE7", bg: "linear-gradient(135deg,#6C5CE7,#8B5CF6)" },
  grammar: { icon: "✏️", name: "语法练习", color: "#0984E3", bg: "linear-gradient(135deg,#0984E3,#74B9FF)" },
  speaking: { icon: "🎤", name: "口语跟读", color: "#E17055", bg: "linear-gradient(135deg,#E17055,#FD79A8)" },
  listening: { icon: "🎧", name: "听力训练", color: "#00B894", bg: "linear-gradient(135deg,#00B894,#55EFC4)" }
};

/* ================= 课程详情 ================= */
function lessonView(lessonId) {
  const found = CONTENT.findLesson(lessonId);
  if (!found) { view().innerHTML = '<div class="empty"><span class="e-ico">🤔</span>课程不存在</div>'; return; }
  const { lang, level, lesson } = found;
  const st = Store.lessonState(lessonId);
  const best = (k) => (st[k] && st[k].tries ? st[k].best : null);

  view().innerHTML = `
    <div class="lesson-hero" style="background:linear-gradient(135deg,${level.color},${level.color}CC)">
      <a class="lh-back" data-nav="#/courses">← 返回课程列表</a>
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <span style="font-size:42px">${lesson.icon}</span>
        <div>
          <h2>${esc(lesson.title)}</h2>
          <p>${esc(level.name)} · ${esc(lesson.desc)}</p>
        </div>
        ${st.done ? '<span class="tag" style="background:rgba(255,255,255,.25);color:#fff">✓ 已完成</span>' : ""}
      </div>
      <div class="lh-stats">
        <div><b>${lesson.vocab.length}</b>个核心词</div>
        <div><b>${lesson.grammar.length}</b>道语法题</div>
        <div><b>${lesson.speaking.length}</b>句跟读</div>
        <div><b>${lesson.listening.qs.length}</b>道听力题</div>
      </div>
    </div>
    <div class="module-grid">
      ${["vocab", "grammar", "speaking", "listening"].map((k) => {
        const m = SKILL_META[k]; const sc = best(k);
        return `
        <div class="module-card ${sc !== null ? "mc-done" : ""}" data-skill="${k}">
          <div class="mc-ico" style="background:${m.color}18">${m.icon}</div>
          <div style="flex:1">
            <h4>${m.name}</h4>
            <p>${moduleDesc(k, lesson)}</p>
            ${sc !== null ? `<span class="mc-score">最佳成绩 ${sc} 分 · 点击${st.done ? "复习" : "继续"}</span>`
              : '<span class="muted" style="font-size:12.5px">点击开始 →</span>'}
          </div>
        </div>`;
      }).join("")}
    </div>
    <div style="text-align:center;margin-top:26px">
      <button class="btn btn-primary btn-lg" id="start-recommend">${st.done ? "🔁 复习本课单词" : "🚀 按顺序开始学习"}</button>
    </div>`;

  view().querySelectorAll("[data-skill]").forEach((el) => {
    el.onclick = () => startLessonSkill(lessonId, el.dataset.skill);
  });
  view().querySelector("#start-recommend").onclick = () => {
    const order = ["vocab", "grammar", "listening", "speaking"];
    const next = order.find((k) => !(st[k] && st[k].tries)) || "vocab";
    startLessonSkill(lessonId, next);
  };
}

function moduleDesc(k, lesson) {
  return {
    vocab: "闪卡记忆 + 智能间隔复习，掌握 " + lesson.vocab.length + " 个核心词",
    grammar: lesson.grammar.length + " 道选择填空，即时反馈与语法解析",
    speaking: "AI 语音跟读打分，攻克 " + lesson.speaking.length + " 个实用句",
    listening: "情景对话听练，答对 " + lesson.listening.qs.length + " 道理解题"
  }[k];
}

function startLessonSkill(lessonId, skill) {
  const found = CONTENT.findLesson(lessonId);
  const lang = found.lang;
  const lesson = found.lesson;
  if (skill === "vocab") runVocab({ words: lesson.vocab.map((v) => Object.assign({ lessonId }, v)), lang, lessonId, title: lesson.title });
  if (skill === "grammar") runGrammar({ questions: lesson.grammar, lang, lessonId, title: lesson.title });
  if (skill === "speaking") runSpeaking({ sentences: lesson.speaking, lang, lessonId, title: lesson.title });
  if (skill === "listening") runListening({ material: Object.assign({ title: lesson.title }, lesson.listening), lang, lessonId });
}

/* ================= 专项练习入口 ================= */
function practice(skill) {
  const u = Store.user();
  const langId = u.targetLang;
  const lang = CONTENT.langs[langId];
  if (skill === "vocab") {
    let deck = Store.dueWords(langId, 8);
    const fresh = Store.freshWords(langId, 10);
    if (deck.length < 6) deck = deck.concat(fresh.slice(0, 10 - deck.length));
    if (!deck.length) deck = Store.shuffle(CONTENT.allWords(langId)).slice(0, 8);
    runVocab({ words: deck, lang, lessonId: null, title: lang.flag + " " + lang.name + " · 单词复习" });
  } else if (skill === "grammar") {
    runGrammar({ questions: Store.shuffle(CONTENT.allGrammar(langId)).slice(0, 8), lang, lessonId: null, title: lang.flag + " " + lang.name + " · 语法闯关" });
  } else if (skill === "speaking") {
    runSpeaking({ sentences: Store.shuffle(CONTENT.allSpeaking(langId)).slice(0, 6), lang, lessonId: null, title: lang.flag + " " + lang.name + " · 口语训练" });
  } else if (skill === "listening") {
    const mat = Store.shuffle(CONTENT.allListening(langId))[0];
    runListening({ material: mat, lang, lessonId: null });
  }
}

/* ================= 通用：训练头部 / 结算 ================= */
function trainHead(meta, index, total, title, backNav) {
  const pct = Math.round((index / total) * 100);
  return `
    <div class="train-head">
      <a class="th-back" data-nav="${backNav}">← 退出</a>
      <div class="train-progress progress"><i style="width:${pct}%;background:${meta.bg}"></i></div>
      <div class="train-count">${Math.min(index + 1, total)}/${total}</div>
    </div>
    <div style="text-align:center;margin-bottom:14px">
      <span class="tag" style="background:${meta.color}18;color:${meta.color}">${meta.icon} ${esc(title || meta.name)}</span>
    </div>`;
}

// 统一结算：写进度、XP、成就，再渲染结算页
function settle(skill, lessonId, score, count, perfect, extra) {
  let xp, completed = false, bonus = 0, ach = [];
  if (lessonId) {
    const r = Store.finishModule(lessonId, skill, { score, count, perfect });
    xp = r.xp; completed = r.completed; bonus = r.bonus; ach = r.achievements;
  } else {
    Store.today();
    Store.bump(skill, count);
    Store.bump("practices", 1);
    Store.addMinutes(skill === "vocab" ? 3 : 4);
    xp = 5 + Math.round(score / 10);
    Store.addXP(xp);
    ach = Store.checkAchievements();
  }
  if (ach.length) celebrate(ach);
  if (window.App) window.App.refresh();
  renderResult({ skill, score, xp, completed, bonus, extra, lessonId });
}

function renderResult({ skill, score, xp, completed, bonus, extra, lessonId }) {
  const meta = SKILL_META[skill];
  const grade = score >= 90 ? ["🏆", "太棒了，近乎完美！"] : score >= 75 ? ["🎉", "表现出色，继续保持！"]
    : score >= 60 ? ["💪", "顺利完成，再接再厉！"] : ["🌱", "别灰心，多练几次就好～"];
  view().innerHTML = `
    <div class="train-wrap">
      <div class="card result-card">
        <div class="result-emoji">${grade[0]}</div>
        <h2>${grade[1]}</h2>
        <p class="muted">${meta.icon} ${meta.name}${completed ? " · 🎊 恭喜完成整节课程！" : ""}</p>
        <div class="score-ring" style="background:${score >= 85 ? "linear-gradient(135deg,#00B894,#55EFC4)" : score >= 60 ? "linear-gradient(135deg,#F39C12,#FDCB6E)" : "linear-gradient(135deg,#FF7675,#FAB1A0)"};margin:22px auto">
          ${score}<small style="font-size:13px;font-weight:700">分</small>
        </div>
        <div class="result-stats">
          <div class="result-stat"><b class="xp-float">+${xp}${bonus ? ` <small style="color:#00B894">(含课程奖励+${bonus})</small>` : ""}</b><small>经验值</small></div>
          <div class="result-stat"><b>${extra.main}</b><small>${extra.mainLabel}</small></div>
          <div class="result-stat"><b>${Store.user().streak}</b><small>连续天数 🔥</small></div>
        </div>
        ${achievementLine()}
        <div class="train-actions">
          <button class="btn btn-ghost" id="r-retry">🔁 再练一次</button>
          ${lessonId ? `<button class="btn btn-soft" data-nav="#/lesson/${lessonId}">📖 返回课程</button>` : ""}
          <button class="btn btn-primary" data-nav="#/">🏠 回到首页</button>
        </div>
      </div>
    </div>`;
  view().querySelector("#r-retry").onclick = () => {
    if (lessonId) startLessonSkill(lessonId, skill);
    else practice(skill);
  };
  toast("获得 +" + xp + " XP", "xp");
}

function achievementLine() {
  const s = Store.stats();
  const unlocked = Object.keys(Store.user().achievements).length;
  return `<p class="muted" style="font-size:13px">🏅 已解锁 ${unlocked}/${CONTENT.ACHIEVEMENTS.length} 个成就 · 当前 Lv.${s.level} ${s.levelTitle}</p>`;
}

/* ================= 1. 单词闪卡 ================= */
function runVocab({ words, lang, lessonId, title }) {
  const deck = Store.shuffle(words);
  let i = 0, known = 0, masteredNow = 0;

  function draw() {
    if (i >= deck.length) {
      const score = Math.round((known / deck.length) * 100);
      settle("vocab", lessonId, score, deck.length, score === 100, {
        main: known + "/" + deck.length, mainLabel: "认识的单词"
      });
      return;
    }
    const v = deck[i];
    view().innerHTML = `
      <div class="train-wrap">
        ${trainHead(SKILL_META.vocab, i, deck.length, title, lessonId ? "#/lesson/" + lessonId : "#/courses")}
        <div class="train-card">
          <h3>点击卡片翻面，看看你记住了吗？</h3>
          <div class="flash-stage">
            <div class="flash-card" id="flash">
              <div class="flash-face flash-front">
                <span class="flash-srs">第 ${(Store.user().words[(v.lessonId || lessonId) + "|" + v.w] || {}).n || 0} 次复习</span>
                <div class="flash-word">${esc(v.w)}</div>
                <div class="flash-phon">${esc(v.p || "")}</div>
              </div>
              <div class="flash-face flash-back">
                <div class="flash-trans">${esc(v.t)}</div>
                <div class="flash-phon" style="color:#0E8C6A">${esc(v.p || "")}</div>
              </div>
            </div>
            <button class="ico-btn" id="play-word" style="width:48px;height:48px;background:var(--primary-soft);font-size:22px">🔊</button>
            <div class="flash-hint" id="flip-hint">👆 点击卡片翻面</div>
          </div>
          <div class="train-actions">
            <button class="btn btn-unknow" id="btn-no">😖 还不认识</button>
            <button class="btn btn-know" id="btn-yes">😊 认识</button>
          </div>
        </div>
      </div>`;

    const card = view().querySelector("#flash");
    let flipped = false, acted = false;
    const flip = () => { flipped = true; card.classList.add("flipped"); };
    card.onclick = flip;
    SpeechKit.speak(v.w, lang.speech, 0.95);
    view().querySelector("#play-word").onclick = (e) => { e.stopPropagation(); SpeechKit.speak(v.w, lang.speech, 0.9); };

    const answer = (isKnown) => {
      if (acted) return;
      acted = true;
      if (!flipped) flip();
      const r = Store.reviewWord(v.lessonId || lessonId, v.w, isKnown);
      if (isKnown) known++;
      if (r.justMastered) masteredNow++;
      if (r.achievements && r.achievements.length) celebrate(r.achievements);
      i++;
      setTimeout(draw, 260);
    };
    view().querySelector("#btn-no").onclick = () => answer(false);
    view().querySelector("#btn-yes").onclick = () => answer(true);
  }
  draw();
}

/* ================= 2. 语法选择 ================= */
function runGrammar({ questions, lang, lessonId, title }) {
  const qs = Store.shuffle(questions);
  let i = 0, correct = 0;

  function draw() {
    if (i >= qs.length) {
      const score = Math.round((correct / qs.length) * 100);
      settle("grammar", lessonId, score, 1, score === 100, {
        main: correct + "/" + qs.length, mainLabel: "答对题数"
      });
      return;
    }
    const q = qs[i];
    const opts = Store.shuffle(q.o.map((text, idx) => ({ text, right: idx === q.a })));
    view().innerHTML = `
      <div class="train-wrap">
        ${trainHead(SKILL_META.grammar, i, qs.length, title, lessonId ? "#/lesson/" + lessonId : "#/courses")}
        <div class="train-card">
          <h3>选择正确的一项</h3>
          <div class="quiz-q">${esc(q.q)}</div>
          <div class="quiz-opts">
            ${opts.map((o, idx) => `
              <button class="quiz-opt" data-i="${idx}">
                <span class="qo-key">${"ABC"[idx]}</span><span>${esc(o.text)}</span>
              </button>`).join("")}
          </div>
          <div class="quiz-explain" id="explain">💡 ${esc(q.e || "再读一遍原句，培养语感。")}</div>
          <div class="train-feedback" id="gf"></div>
          <div class="train-actions">
            <button class="btn btn-ghost" id="g-play">🔊 听句子</button>
            <button class="btn btn-primary" id="g-next" style="display:none">下一题 →</button>
          </div>
        </div>
      </div>`;

    let answered = false, rightPick = false;
    view().querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.onclick = () => {
        if (answered) return;
        answered = true;
        const o = opts[+btn.dataset.i];
        rightPick = o.right;
        view().querySelectorAll(".quiz-opt").forEach((b, idx) => {
          b.disabled = true;
          if (opts[idx].right) b.classList.add("correct");
        });
        if (!o.right) btn.classList.add("wrong");
        view().querySelector("#explain").classList.add("show");
        const gf = view().querySelector("#gf");
        if (o.right) { gf.textContent = "✅ 回答正确！"; gf.className = "train-feedback tf-good"; correct++; }
        else { gf.textContent = "❌ 正确答案已标出"; gf.className = "train-feedback tf-bad"; }
        view().querySelector("#g-next").style.display = "";
        if (o.right) SpeechKit.speak(q.q.replace(/_{2,}/g, q.o[q.a]), lang.speech, 0.95);
      };
    });
    view().querySelector("#g-play").onclick = () => SpeechKit.speak(q.q, lang.speech, 0.9);
    let advanced = false;
    view().querySelector("#g-next").onclick = () => { if (advanced) return; advanced = true; i++; draw(); };
  }
  draw();
}

/* ================= 3. 口语跟读 ================= */
function runSpeaking({ sentences, lang, lessonId, title }) {
  let i = 0; const scores = [];

  function draw() {
    if (i >= sentences.length) {
      const score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      settle("speaking", lessonId, score, 1, score >= 90, {
        main: score + "分", mainLabel: "平均发音分"
      });
      return;
    }
    const s = sentences[i];
    const sttOk = SpeechKit.supportedSTT;
    view().innerHTML = `
      <div class="train-wrap">
        ${trainHead(SKILL_META.speaking, i, sentences.length, title, lessonId ? "#/lesson/" + lessonId : "#/courses")}
        <div class="train-card">
          <h3>先听示范，再长按节奏跟读</h3>
          <div class="speak-big">${esc(s.t)}</div>
          ${s.tip ? `<p class="muted" style="font-size:13.5px">💡 ${esc(s.tip)}</p>` : ""}
          <div style="margin:14px 0">
            <button class="ico-btn" id="sp-play" style="width:52px;height:52px;background:#FDF0E8;font-size:24px">🔊 听示范</button>
            <button class="ico-btn" id="sp-slow" style="width:52px;height:52px;background:#FDF0E8;font-size:15px">🐢 慢速</button>
          </div>
          <div id="sp-action">
            ${sttOk ? `
              <button class="speak-btn" id="sp-rec">🎤</button>
              <div class="flash-hint" id="rec-hint">点击麦克风开始跟读</div>`
            : `
              <div class="card" style="background:#FFF9E8;box-shadow:none;font-size:13.5px;color:#8A6D3B;margin:8px auto;max-width:430px">
                当前浏览器不支持语音识别，可使用“朗读自评”模式：大声跟读后为自己打分。
              </div>`}
          </div>
          <div class="speak-result" id="sp-result"></div>
          <div class="train-actions" id="sp-foot" style="display:none">
            <button class="btn btn-ghost" id="sp-again">🔁 再读一次</button>
            <button class="btn btn-primary" id="sp-next">下一句 →</button>
          </div>
        </div>
      </div>`;

    view().querySelector("#sp-play").onclick = () => SpeechKit.speak(s.t, lang.speech, 0.95);
    view().querySelector("#sp-slow").onclick = () => SpeechKit.speak(s.t, lang.speech, 0.65);

    setTimeout(() => SpeechKit.speak(s.t, lang.speech, 0.95), 350);

    if (sttOk) {
      view().querySelector("#sp-rec").onclick = async (e) => {
        const btn = e.currentTarget;
        const hint = view().querySelector("#rec-hint");
        btn.classList.add("recording");
        btn.textContent = "●";
        hint.textContent = "正在聆听…请大声跟读";
        const r = await SpeechKit.recognize(lang.speech, 7000);
        btn.classList.remove("recording");
        btn.textContent = "🎤";
        if (r.ok) {
          const sc = SpeechKit.score(s.t, r.alternatives || [r.transcript]);
          scores[i] = Math.max(scores[i] || 0, sc);
          showScore(sc, r.transcript, true);
        } else {
          const map = { "no-speech": "没有检测到语音，请再试一次", "not-allowed": "请允许使用麦克风", "timeout": "时间到，请再试一次" };
          hint.textContent = map[r.error] || "识别失败，请重试（也可用下方自评）";
          showSelfRate();
        }
      };
    } else {
      showSelfRate();
    }

    function showSelfRate() {
      const host = view().querySelector("#sp-action");
      if (!host || host.dataset.rated) return;
      host.dataset.rated = "1";
      const div = document.createElement("div");
      div.className = "train-actions";
      div.innerHTML = `
        <button class="btn btn-ghost" id="rate-bad">还需练习</button>
        <button class="btn btn-know btn" id="rate-good">😊 我能流利朗读</button>`;
      host.appendChild(div);
      view().querySelector("#rate-bad").onclick = () => {
        SpeechKit.speak(s.t, lang.speech, 0.8);
        toast("再来一遍，你可以的！", "error");
      };
      view().querySelector("#rate-good").onclick = () => {
        scores[i] = Math.max(scores[i] || 0, 85);
        showScore(85, "（自评模式）", false);
      };
    }

    function showScore(sc, heard, real) {
      const color = sc >= 85 ? "linear-gradient(135deg,#00B894,#55EFC4)"
        : sc >= 60 ? "linear-gradient(135deg,#F39C12,#FDCB6E)"
        : "linear-gradient(135deg,#FF7675,#FAB1A0)";
      view().querySelector("#sp-result").innerHTML = `
        <div class="score-ring" style="background:${color}">${sc}<small style="font-size:12px;font-weight:700">分</small></div>
        <div style="font-size:13.5px;color:var(--ink-2);margin-top:6px">
          ${real ? "识别到：" + esc(heard) : "自评完成，继续保持开口练习！"}
        </div>
        ${sc >= 85 ? '<div class="tf-good" style="margin-top:6px">发音很棒！👏</div>' : sc >= 60 ? '<div style="color:#E17055;font-weight:800;margin-top:6px">不错，注意个别发音 🎯</div>' : '<div class="tf-bad" style="margin-top:6px">再听一遍示范，模仿语调 🔁</div>'}`;
      view().querySelector("#sp-foot").style.display = "";
      view().querySelector("#sp-action").style.display = "none";
      view().querySelector("#sp-again").onclick = () => { view().querySelector("#sp-action").style.display = ""; view().querySelector("#sp-foot").style.display = "none"; view().querySelector("#sp-result").innerHTML = ""; };
      let advanced = false;
      view().querySelector("#sp-next").onclick = () => { if (advanced) return; advanced = true; i++; draw(); };
    }
  }
  draw();
}

/* ================= 4. 听力训练 ================= */
function runListening({ material, lang, lessonId }) {
  const stage = { phase: "listen", i: 0, correct: 0, revealed: false, playing: false };
  const m = material;

  function renderListen() {
    view().innerHTML = `
      <div class="train-wrap">
        ${trainHead(SKILL_META.listening, 0, 1, m.title || "听力理解", lessonId ? "#/lesson/" + lessonId : "#/courses")}
        <div class="train-card">
          <h3>听对话，抓取关键信息</h3>
          <div class="listen-controls">
            <button class="btn btn-primary" id="li-all">▶️ 播放全文</button>
            <button class="btn btn-soft" id="li-slow">🐢 慢速播放</button>
            <button class="btn btn-ghost" id="li-toggle">👁 ${stage.revealed ? "隐藏原文" : "显示原文"}</button>
          </div>
          <div class="listen-stage">
            ${m.lines.map((l, idx) => `
              <div class="listen-line ${stage.revealed ? "" : "hidden-line"}">
                <span class="ll-who">${esc(l.w)}</span>
                <span class="ll-text">${esc(l.t)}</span>
                <button class="ico-btn li-one" data-i="${idx}" style="width:32px;height:32px;font-size:14px;margin-left:auto">🔊</button>
              </div>`).join("")}
          </div>
          <p class="muted" style="font-size:12.5px">💡 先盲听 2 遍，再显示原文核对，最后答题</p>
          <div class="train-actions">
            <button class="btn btn-primary btn-lg" id="li-start">📝 开始答题（${m.qs.length} 题）</button>
          </div>
        </div>
      </div>`;

    view().querySelector("#li-toggle").onclick = () => { stage.revealed = !stage.revealed; renderListen(); };
    view().querySelector("#li-all").onclick = () => playAll(false);
    view().querySelector("#li-slow").onclick = () => playAll(true);
    view().querySelector("#li-start").onclick = () => { stage.phase = "quiz"; stage.i = 0; drawQuiz(); };
    view().querySelectorAll(".li-one").forEach((b) => {
      b.onclick = () => SpeechKit.speak(m.lines[+b.dataset.i].t, lang.speech, 0.92);
    });
  }

  async function playAll(slow) {
    if (stage.playing) return;
    stage.playing = true;
    for (const l of m.lines) {
      await SpeechKit.speak(l.t, lang.speech, slow ? 0.62 : 0.95);
      await new Promise((r) => setTimeout(r, 260));
    }
    stage.playing = false;
  }

  function drawQuiz() {
    if (stage.i >= m.qs.length) {
      const score = Math.round((stage.correct / m.qs.length) * 100);
      settle("listening", lessonId, score, 1, score === 100, {
        main: stage.correct + "/" + m.qs.length, mainLabel: "答对题数"
      });
      return;
    }
    const q = m.qs[stage.i];
    const opts = Store.shuffle(q.o.map((text, idx) => ({ text, right: idx === q.a })));
    view().innerHTML = `
      <div class="train-wrap">
        ${trainHead(SKILL_META.listening, stage.i, m.qs.length, m.title || "听力理解", lessonId ? "#/lesson/" + lessonId : "#/courses")}
        <div class="train-card">
          <h3>听力理解题</h3>
          <button class="btn btn-soft" id="li-replay" style="margin:0 auto 12px">🔊 重听对话</button>
          <div class="quiz-q" style="font-size:19px">${esc(q.q)}</div>
          <div class="quiz-opts">
            ${opts.map((o, idx) => `
              <button class="quiz-opt" data-i="${idx}">
                <span class="qo-key">${"ABC"[idx]}</span><span>${esc(o.text)}</span>
              </button>`).join("")}
          </div>
          <div class="train-feedback" id="lq-fb"></div>
          <div class="train-actions">
            <button class="btn btn-primary" id="lq-next" style="display:none">${stage.i + 1 >= m.qs.length ? "查看结果 →" : "下一题 →"}</button>
          </div>
        </div>
      </div>`;

    view().querySelector("#li-replay").onclick = () => playAll(false);
    let answered = false;
    view().querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.onclick = () => {
        if (answered) return;
        answered = true;
        const o = opts[+btn.dataset.i];
        view().querySelectorAll(".quiz-opt").forEach((b, idx) => {
          b.disabled = true;
          if (opts[idx].right) b.classList.add("correct");
        });
        const fb = view().querySelector("#lq-fb");
        if (o.right) { stage.correct++; fb.textContent = "✅ 听对了！"; fb.className = "train-feedback tf-good"; }
        else { btn.classList.add("wrong"); fb.textContent = "❌ 再回去听一听关键句"; fb.className = "train-feedback tf-bad"; }
        view().querySelector("#lq-next").style.display = "";
      };
    });
    let advanced = false;
    view().querySelector("#lq-next").onclick = () => { if (advanced) return; advanced = true; stage.i++; drawQuiz(); };
  }

  renderListen();
}

/* ================= 导出 ================= */
window.Learn = { lessonView, practice, startLessonSkill };
})();
