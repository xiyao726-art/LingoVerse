/* ============================================================
 * 语界 LingoVerse —— 数据层
 * 用户注册登录 · 学习进度 · SRS 间隔重复 · 推荐 · 成就 · 社区
 * 数据保存在 localStorage（纯前端演示方案）
 * ============================================================ */
(function () {
"use strict";

const USERS_KEY = "lv_users_v1";
const SESSION_KEY = "lv_session_v1";

const SKILLS = {
  vocab: { name: "单词记忆", icon: "🃏", color: "#6C5CE7" },
  grammar: { name: "语法练习", icon: "✏️", color: "#0984E3" },
  speaking: { name: "口语跟读", icon: "🎤", color: "#E17055" },
  listening: { name: "听力训练", icon: "🎧", color: "#00B894" }
};

// SRS 间隔（毫秒）：stage 1→10分钟，2→1天，3→2天，4→4天，5→7天，6→15天
const SRS_GAP = [0, 10 * 60 * 1000, 864e5, 2 * 864e5, 4 * 864e5, 7 * 864e5, 15 * 864e5];
const MASTER_STAGE = 3; // 达到 stage 3 视为“已掌握”

const LEVEL_TITLES = ["", "语言萌新", "初露锋芒", "勤学少年", "进阶行者", "语言达人", "博学鸿儒", "首席翻译官", "多语大师", "传奇语者"];

/* ---------- 工具 ---------- */
const $ = (id) => (id === undefined ? undefined : id);
function dkey(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function load(k, def) {
  try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? def : v; }
  catch (e) { return def; }
}
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function uid() { return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

/* ---------- 用户数据 ---------- */
function blankUser(username, email, pass, lang) {
  return {
    username, email, pass, createdAt: Date.now(),
    avatarColor: pickColor(username),
    targetLang: lang || "en",
    xp: 0, streak: 0, lastActive: "",
    lessons: {},          // lessonId -> {done, vocab:{best}, grammar:{best,perfect}, speaking:{best}, listening:{best}}
    words: {},            // "lessonId|word" -> {s:stage, n, m, due}
    log: {},              // date -> {xp,minutes,words,grammar,listening,speaking,lessons,practices,claimed}
    achievements: {},     // achId -> unlockDate
    posts: [],
    likes: {},            // postId -> true
    likeDelta: {},        // seed postId -> 0/1
    comments: {},         // postId -> [{u,t}]
    groups: [],
    onboarded: false
  };
}
function pickColor(seed) {
  const colors = ["#6C5CE7", "#0984E3", "#00B894", "#E17055", "#FD79A8", "#F39C12", "#2EA44F", "#E84393"];
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return colors[h % colors.length];
}

/* ---------- 演示账号（让新访客立即看到丰富数据） ---------- */
function demoUser() {
  const u = blankUser("demo", "demo@lingoverse.app", btoa("123456"), "en");
  u.avatarColor = "#6C5CE7";
  u.xp = 640;
  u.streak = 6;
  const today = new Date();
  u.lastActive = dkey(today);

  // 近 7 天学习日志
  const seed = [
    [12, 80, 8], [18, 60, 6], [10, 120, 10],
    [22, 100, 9], [8, 40, 4], [16, 140, 12], [14, 100, 8]
  ]; // [words, xp, minutes]
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const s = seed[6 - i];
    u.log[dkey(d)] = {
      xp: s[1], minutes: s[2], words: s[0],
      grammar: i % 2 ? 3 : 0, listening: i % 3 === 0 ? 1 : 0,
      speaking: i % 2 === 0 ? 2 : 0, lessons: i === 6 ? 1 : (i === 3 ? 1 : 0), practices: 2
    };
  }
  // en-l1 已完成
  u.lessons["en-l1"] = {
    done: true, vocab: { best: 100 }, grammar: { best: 100, perfect: 2 },
    speaking: { best: 86 }, listening: { best: 100 }
  };
  // en-l2 部分进度
  u.lessons["en-l2"] = {
    done: false, vocab: { best: 83 }, grammar: { best: 67, perfect: 0 }
  };
  // 标记部分单词已掌握（SRS）
  const l1 = CONTENT.findLesson("en-l1").lesson;
  l1.vocab.slice(0, 5).forEach((v, idx) => {
    u.words["en-l1|" + v.w] = { s: idx < 4 ? 4 : 2, n: idx < 4 ? 4 : 1, m: idx < 4, due: 0 };
  });
  CONTENT.findLesson("en-l2").lesson.vocab.slice(0, 4).forEach((v, idx) => {
    u.words["en-l2|" + v.w] = { s: idx < 2 ? 3 : 1, n: idx < 2 ? 3 : 1, m: idx < 2, due: idx >= 2 ? 0 : Date.now() + 864e5 };
  });
  // 解锁部分成就
  u.achievements = {
    first_step: dkey(today),
    words_20: dkey(new Date(today.getTime() - 864e5)),
    streak_3: dkey(new Date(today.getTime() - 3 * 864e5)),
    speaker_10: dkey(new Date(today.getTime() - 2 * 864e5))
  };
  return u;
}

/* ---------- Store ---------- */
const Store = {
  users: load(USERS_KEY, null),

  init() {
    if (!this.users) {
      this.users = { demo: demoUser() };
      this.persist();
    }
    // 数据结构补丁（向前兼容）
    Object.values(this.users).forEach((u) => {
      u.words = u.words || {}; u.log = u.log || {}; u.lessons = u.lessons || {};
      u.achievements = u.achievements || {}; u.posts = u.posts || [];
      u.likes = u.likes || {}; u.likeDelta = u.likeDelta || {};
      u.comments = u.comments || {}; u.groups = u.groups || [];
      Object.values(u.log).forEach((day) => { day.claimed = day.claimed || {}; });
    });
  },
  persist() { save(USERS_KEY, this.users); },

  /* ----- 认证 ----- */
  currentName() { return load(SESSION_KEY, null); },
  user() {
    const n = this.currentName();
    return n && this.users[n] ? this.users[n] : null;
  },
  login(username, password) {
    const u = this.users[username.trim().toLowerCase()];
    if (!u) return { ok: false, error: "该账号不存在，请先注册" };
    if (u.pass !== btoa(password)) return { ok: false, error: "密码不正确，请重试" };
    save(SESSION_KEY, username.trim().toLowerCase());
    return { ok: true };
  },
  register({ username, email, password, lang }) {
    const name = username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,14}$/.test(name))
      return { ok: false, error: "用户名需为 2-14 位中英文、数字或下划线" };
    if (this.users[name]) return { ok: false, error: "该用户名已被注册" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "邮箱格式不正确" };
    if (password.length < 6) return { ok: false, error: "密码至少 6 位" };
    const u = blankUser(name, email.trim(), btoa(password), lang);
    this.users[name] = u;
    this.persist();
    save(SESSION_KEY, name);
    return { ok: true };
  },
  logout() { localStorage.removeItem(SESSION_KEY); },
  setLang(langId) {
    const u = this.user(); if (!u) return;
    u.targetLang = langId; this.persist();
  },

  /* ----- 每日打卡 / 日志 ----- */
  today() {
    const u = this.user(); if (!u) return null;
    const k = dkey();
    if (!u.log[k]) {
      // 计算连续天数
      const yest = dkey(new Date(Date.now() - 864e5));
      if (u.lastActive === dkey()) {
        /* 今日已初始化 */
      } else if (u.lastActive === yest) {
        u.streak += 1;
      } else {
        u.streak = u.lastActive === "" ? 1 : 1;
      }
      u.lastActive = k;
      u.log[k] = { xp: 0, minutes: 0, words: 0, grammar: 0, listening: 0, speaking: 0, lessons: 0, practices: 0, claimed: {} };
      this.persist();
    }
    return u.log[k];
  },
  bump(metric, n = 1) {
    const t = this.today(); const u = this.user();
    t[metric] = (t[metric] || 0) + n;
    this.persist();
  },
  addXP(n) {
    const u = this.user(); if (!u || n <= 0) return;
    const t = this.today();
    u.xp += n; t.xp += n;
    this.persist();
  },
  addMinutes(n) {
    const t = this.today(); t.minutes += n; this.persist();
  },

  /* ----- 单词 SRS ----- */
  reviewWord(lessonId, word, known) {
    const u = this.user();
    const key = lessonId + "|" + word;
    const w = u.words[key] || { s: 0, n: 0, m: false, due: 0 };
    w.n += 1;
    if (known) {
      w.s = clamp(w.s + 1, 0, SRS_GAP.length - 1);
      w.due = Date.now() + (SRS_GAP[w.s] || 0);
    } else {
      w.s = 0; w.due = 0;
    }
    const wasMastered = w.m;
    w.m = w.s >= MASTER_STAGE;
    u.words[key] = w;
    this.bump("words", known ? 1 : 0);
    if (known) this.addXP(2);
    this.persist();
    const ach = this.checkAchievements();
    return { mastered: w.m, justMastered: w.m && !wasMastered, stage: w.s, achievements: ach };
  },
  dueWords(langId, limit = 12) {
    const u = this.user();
    const now = Date.now();
    const due = [];
    CONTENT.allWords(langId).forEach((v) => {
      const st = u.words[v.lessonId + "|" + v.w];
      if (st && (st.due <= now)) {
        due.push(Object.assign({}, v, { stage: st.s }));
      }
    });
    // 优先到期最久的
    return due.slice(0, limit);
  },
  // 未学过的新词
  freshWords(langId, limit = 10) {
    const u = this.user();
    return CONTENT.allWords(langId).filter((v) => !u.words[v.lessonId + "|" + v.w]).slice(0, limit);
  },

  /* ----- 模块完成结算 ----- */
   finishModule(lessonId, skill, result) {
    const u = this.user();
    const st = u.lessons[lessonId] || { done: false };
    const old = st[skill] || { best: 0, perfect: 0 };
    const isBest = result.score > old.best;
    st[skill] = {
      best: Math.max(old.best, result.score),
      perfect: (old.perfect || 0) + (result.perfect ? 1 : 0),
      tries: (old.tries || 0) + 1
    };
    u.lessons[lessonId] = st;

    this.today(); // 确保打卡
    this.bump(skill, result.count || 1);
    this.bump("practices", 1);
    this.addMinutes(skill === "vocab" ? 3 : 4);

    // XP：基础分 + 新纪录奖励
    let xp = 5 + Math.round(result.score / 10);
    if (isBest && result.score >= 60) xp += 5;
    this.addXP(xp);

    // 课程完成判定：四个模块都完成且词汇完成过整轮（由 runner 保证）
    const allDone = ["vocab", "grammar", "speaking", "listening"].every((k) => st[k] && st[k].tries > 0);
    let completed = false, bonus = 0;
    if (allDone && !st.done) {
      st.done = true; completed = true;
      bonus = 30;
      this.addXP(bonus);
      this.bump("lessons", 1);
    }
    this.persist();
    const ach = this.checkAchievements();
    return { xp, isBest, completed, bonus, achievements: ach };
  },
  lessonState(lessonId) {
    const u = this.user();
    return u.lessons[lessonId] || { done: false };
  },

  /* ----- 统计 ----- */
  stats() {
    const u = this.user();
    if (!u) return null;
    const lessons = CONTENT.langList.map((lang) => {
      const all = CONTENT.lessonsOf(lang.id);
      const done = all.filter((x) => (u.lessons[x.lesson.id] || {}).done).length;
      return { lang: lang, total: all.length, done };
    });
    const completedCount = lessons.reduce((s, x) => s + x.done, 0);
    const masteredWords = Object.values(u.words).filter((w) => w.m).length;
    const totalWords = Object.keys(u.words).length;
    const langsStudied = lessons.filter((x) => x.done > 0).map((x) => x.lang.id);

    // 各技能平均水平
    const skillAvg = {};
    Object.keys(SKILLS).forEach((k) => {
      const vals = Object.values(u.lessons).map((l) => l[k] && l[k].best).filter((v) => v !== undefined);
      skillAvg[k] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    });
    const perfectCount = Object.values(u.lessons).reduce((s, l) => s + ((l.grammar && l.grammar.perfect) || 0), 0);

    // 累计次数
    let speakingCount = 0, listeningCount = 0, totalMinutes = 0, postCount = u.posts.length;
    Object.values(u.log).forEach((l) => {
      speakingCount += l.speaking || 0; listeningCount += l.listening || 0;
      totalMinutes += l.minutes || 0;
    });

    return {
      xp: u.xp, streak: u.streak,
      level: Math.floor(u.xp / 250) + 1,
      levelTitle: LEVEL_TITLES[Math.min(Math.floor(u.xp / 250) + 1, LEVEL_TITLES.length - 1)],
      nextLevelAt: (Math.floor(u.xp / 250) + 1) * 250,
      prevLevelAt: Math.floor(u.xp / 250) * 250,
      lessons, completedCount,
      totalLessons: CONTENT.langList.reduce((s, l) => s + CONTENT.lessonsOf(l.id).length, 0),
      masteredWords, totalWords, totalWordBank: CONTENT.langList.reduce((s, l) => s + CONTENT.allWords(l.id).length, 0),
      langsStudied, skillAvg, perfectCount, speakingCount, listeningCount, totalMinutes, postCount
    };
  },

  /* ----- 个性化推荐 ----- */
  recommendations() {
    const u = this.user();
    const langId = u.targetLang;
    const recs = [];

    // 1. 到期复习单词
    const due = this.dueWords(langId, 50);
    if (due.length) {
      recs.push({
        icon: "🔁", bg: "#FFF4E0", badge: "复习", badgeCls: "pb-daily",
        title: due.length + " 个单词到了复习时间",
        sub: "间隔重复算法推荐，趁热打铁记忆更牢",
        nav: "#/practice/vocab"
      });
    }

    // 2. 下一节未完成课程
    const order = CONTENT.lessonsOf(langId);
    const next = order.find((x) => !(u.lessons[x.lesson.id] || {}).done);
    if (next) {
      const st = u.lessons[next.lesson.id];
      recs.push({
        icon: next.lesson.icon, bg: "#EFEDFF", badge: st ? "继续学习" : "新课", badgeCls: "pb-next",
        title: next.lesson.title,
        sub: next.level.name + " · " + next.lesson.desc,
        nav: "#/lesson/" + next.lesson.id
      });
    }

    // 3. 薄弱技能专项
    const s = this.stats();
    const weakSkills = Object.keys(SKILLS)
      .map((k) => ({ k, v: s.skillAvg[k] }))
      .filter((x) => x.v > 0)
      .sort((a, b) => a.v - b.v);
    if (weakSkills.length && weakSkills[0].v < 85) {
      const k = weakSkills[0].k;
      recs.push({
        icon: SKILLS[k].icon, bg: "#FFEDEE", badge: "薄弱项", badgeCls: "pb-weak",
        title: "加强「" + SKILLS[k].name + "」专项训练",
        sub: "你的平均正确率为 " + weakSkills[0].v + "%，针对性练习可快速提升",
        nav: "#/practice/" + k
      });
    }

    // 4. 新手引导
    if (s.completedCount === 0) {
      recs.push({
        icon: "🚀", bg: "#E4F8F1", badge: "入门", badgeCls: "pb-daily",
        title: "从第一节问候课开始",
        sub: "5 分钟完成你的第一节课，解锁首个成就",
        nav: "#/lesson/" + order[0].lesson.id
      });
    }

    // 5. 全部完成 → 推荐其他语言
    if (!next) {
      const other = CONTENT.langList.find((l) => l.id !== langId);
      recs.push({
        icon: other.flag, bg: "#E8F0FF", badge: "新语种", badgeCls: "pb-next",
        title: "试试「" + other.name + "」课程",
        sub: "你已完成当前语言全部课程，多语者思维更敏捷",
        nav: "#/courses"
      });
    }
    return recs.slice(0, 4);
  },

  /* ----- 成就 ----- */
  checkAchievements() {
    const u = this.user();
    const s = this.stats();
    const newly = [];
    CONTENT.ACHIEVEMENTS.forEach((a) => {
      if (!u.achievements[a.id] && a.cond(s)) {
        u.achievements[a.id] = dkey();
        newly.push(a);
      }
    });
    if (newly.length) this.persist();
    return newly;
  },

  /* ----- 每日任务 ----- */
  questsToday() {
    const t = this.today();
    return CONTENT.DAILY_QUESTS.map((q) => {
      const progress = clamp(t[q.metric] || 0, 0, q.target);
      return Object.assign({}, q, {
        progress, done: progress >= q.target,
        claimed: !!(t.claimed && t.claimed[q.id])
      });
    });
  },
  claimQuest(id) {
    const u = this.user(); const t = this.today();
    t.claimed = t.claimed || {};
    const q = CONTENT.DAILY_QUESTS.find((x) => x.id === id);
    if (!q || t.claimed[id]) return { ok: false };
    if ((t[q.metric] || 0) < q.target) return { ok: false, error: "任务尚未完成" };
    t.claimed[id] = true;
    u.xp += q.reward;
    this.persist();
    this.checkAchievements();
    return { ok: true, reward: q.reward };
  },

  /* ----- 近 7 天日志 ----- */
  weekly() {
    const u = this.user();
    const out = [];
    const names = ["日", "一", "二", "三", "四", "五", "六"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = dkey(d);
      out.push({
        key: k, label: names[d.getDay()],
        today: i === 0,
        xp: (u.log[k] || {}).xp || 0,
        minutes: (u.log[k] || {}).minutes || 0,
        words: (u.log[k] || {}).words || 0
      });
    }
    return out;
  },
  // 最近 35 天打卡日历
  calendar() {
    const u = this.user();
    const out = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const l = u.log[dkey(d)];
      let level = 0;
      if (l) level = l.minutes >= 10 ? 3 : (l.minutes >= 5 ? 2 : 1);
      out.push({ day: d.getDate(), level, date: dkey(d) });
    }
    return out;
  },

  /* ----- 社区 ----- */
  posts(tagFilter) {
    const u = this.user();
    const userPosts = u.posts.map((p) => ({
      id: p.id, user: u.username, color: u.avatarColor,
      tag: p.tag, tagColor: tagColorOf(p.tag),
      time: p.time, text: p.text,
      likes: p.likes + (u.likeDelta[p.id] || 0), liked: !!u.likes[p.id],
      comments: (p.comments || []).concat(u.comments[p.id] || []),
      mine: true
    }));
    const seeds = CONTENT.SEED_POSTS.map((p) => ({
      ...p,
      likes: p.likes + (u.likeDelta[p.id] || 0),
      liked: !!u.likes[p.id],
      comments: (p.comments || []).map(normalizeSeedComment).concat(u.comments[p.id] || [])
    }));
    let all = userPosts.concat(seeds);
    if (tagFilter && tagFilter !== "全部") all = all.filter((p) => p.tag === tagFilter);
    return all;
  },
  addPost(text, tag) {
    const u = this.user();
    const post = { id: uid(), text: text.trim(), tag: tag || "打卡", time: "刚刚", likes: 0, comments: [], ts: Date.now() };
    u.posts.unshift(post);
    this.addXP(10);
    this.persist();
    this.checkAchievements();
    return post;
  },
  toggleLike(postId) {
    const u = this.user();
    if (u.likes[postId]) {
      delete u.likes[postId];
      u.likeDelta[postId] = Math.max(0, (u.likeDelta[postId] || 1) - 1);
    } else {
      u.likes[postId] = true;
      u.likeDelta[postId] = (u.likeDelta[postId] || 0) + 1;
    }
    this.persist();
  },
  addComment(postId, text) {
    const u = this.user();
    const list = u.comments[postId] || (u.comments[postId] = []);
    list.push({ u: u.username, color: u.avatarColor, text: text.trim() });
    this.persist();
  },
  toggleGroup(name) {
    const u = this.user();
    const i = u.groups.indexOf(name);
    if (i >= 0) u.groups.splice(i, 1); else u.groups.push(name);
    this.persist();
    return i < 0;
  },

  /* ----- 排行榜 ----- */
  leaderboard() {
    const u = this.user();
    const me = {
      name: u.username + "（我）", color: u.avatarColor,
      sub: CONTENT.langs[u.targetLang].name + " · 连续 " + u.streak + " 天",
      xp: u.xp, me: true
    };
    return CONTENT.SEED_LEADERS.concat([me]).sort((a, b) => b.xp - a.xp);
  }
};

// 种子评论结构修正：数据文件里写成 {"u":"Ken","c":" #FF6B81","t":"正文"}
function normalizeSeedComment(c) {
  if (c.text !== undefined) return { u: c.u, color: (c.c || "").trim() || "#9AA0B5", text: c.text };
  return { u: c.u, color: "#9AA0B5", text: c.t };
}
function tagColorOf(tag) {
  const map = { "日语": "#FFE9EE", "英语": "#E8F0FF", "韩语": "#E6F6EC", "打卡": "#FFF1E8", "经验": "#EFEDFF" };
  return map[tag] || "#F0F1F7";
}

Store.SKILLS = SKILLS;
Store.shuffle = shuffle;
window.Store = Store;
})();
