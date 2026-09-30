/* ============================================================
 * 语界 LingoVerse —— 应用入口 / 路由 / 认证 / 仪表盘 / 课程
 * ============================================================ */
(function () {
"use strict";

const $ = (sel) => document.querySelector(sel);
const view = () => document.getElementById("view");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* 注入彩带动画样式 */
const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes lvfall{to{transform:translateY(105vh) rotate(720deg);opacity:.2}}`;
document.head.appendChild(styleEl);

const App = {
  /* ---------- 启动 ---------- */
  boot() {
    Store.init();
    window.addEventListener("hashchange", () => this.route());
    let lastNavAt = 0;
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-nav]");
      if (!a || a.tagName === "A" && a.getAttribute("href") === "#") return;
      const now = performance.now();
      if (now - lastNavAt < 400) { e.preventDefault(); return; } // 防抖：屏蔽极短时间内的第二次导航
      lastNavAt = now;
      const h = a.dataset.nav;
      if (h === location.hash) App.route(); // 同地址强制刷新（如结果页返回课程）
      else location.hash = h;
    });
    $("#menu-btn").onclick = () => { $("#sidebar").classList.add("open"); $("#overlay").classList.add("show"); };
    $("#overlay").onclick = () => { $("#sidebar").classList.remove("open"); $("#overlay").classList.remove("show"); };

    this.initInstaller();

    if (Store.user()) this.mountApp();
    else this.showAuth();
  },

  /* ---------- PWA：安装到桌面 / 主屏幕 ---------- */
  isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  },

  initInstaller() {
    if (this.__installerInit) return;
    this.__installerInit = true;
    let deferred = null;

    const btn = document.createElement("button");
    btn.id = "pwa-install";
    btn.className = "pwa-install hidden";
    btn.type = "button";
    btn.textContent = "📲 安装 APP";
    document.body.appendChild(btn);

    const show = () => btn.classList.remove("hidden");
    const hide = () => btn.classList.add("hidden");

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferred = e;
      if (!this.isStandalone()) show();
    });
    window.addEventListener("appinstalled", () => {
      deferred = null; hide();
      this.toast("安装成功！可从桌面启动「语界」🎉", "success");
    });

    btn.onclick = async () => {
      if (deferred) {
        deferred.prompt();
        try {
          const choice = await deferred.userChoice;
          if (choice && choice.outcome === "accepted") this.toast("正在安装，请稍候…", "success");
        } catch (err) { /* 忽略 */ }
        deferred = null; hide();
      } else {
        this.installHelpModal();
      }
    };

    if (this.isStandalone()) return;
    // 不支持 beforeinstallprompt 的浏览器（iOS Safari / Firefox 等）：延迟后展示入口，点击查看安装指引
    setTimeout(() => { if (!deferred && !this.isStandalone()) show(); }, 3500);
  },

  installHelpModal() {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const root = $("#modal-root");
    root.innerHTML = `
      <div class="modal-mask" id="m-mask">
        <div class="modal">
          <div style="text-align:center;margin-bottom:6px">
            <img src="icons/icon-192.png" width="64" height="64" style="border-radius:15px" alt="语界">
          </div>
          <h3 style="text-align:center;margin:4px 0">把「语界」装到桌面</h3>
          <p class="muted" style="font-size:13.5px;line-height:1.8;margin:10px 0">
          ${isIOS
            ? `iPhone / iPad：点击 Safari 底部的 <b>分享</b> 图标，选择 <b>「添加到主屏幕」</b>，再点右上角「添加」即可。`
            : `电脑 / 安卓（Chrome、Edge）：点击地址栏右侧的 <b>安装图标 ⊕</b>，或打开右上角菜单 ⋮ 选择 <b>「安装语界 / 添加到主屏幕」</b>。`}
          </p>
          <div class="card" style="background:var(--primary-soft);box-shadow:none;font-size:12.5px;color:var(--primary);line-height:1.7;margin:6px 0 14px">
            安装后可像原生 APP 一样全屏启动、离线使用，学习数据保存在本设备浏览器中。
          </div>
          <button class="btn btn-primary btn-block" id="m-close">知道了</button>
        </div>
      </div>`;
    const close = () => (root.innerHTML = "");
    $("#m-mask").onclick = (e) => { if (e.target.id === "m-mask") close(); };
    $("#m-close").onclick = close;
  },

  goto(h) { location.hash = h; },

  /* ---------- 登录 / 注册 ---------- */
  showAuth() {
    $("#app-root").classList.add("hidden");
    $("#auth-root").classList.remove("hidden");
    $("#auth-root").innerHTML = `
      <div class="auth-hero">
        <div class="auth-brand"><span class="brand-logo">语</span>语界 LingoVerse</div>
        <h1>一个平台，<br>流利说出<em>英 · 日 · 韩</em></h1>
        <p>沉浸式分级课程 + 听说读写互动训练，AI 语音打分与个性化学习路径，让每一分钟学习都有反馈。</p>
        <div class="hero-features">
          <div class="hero-feature"><span class="hf-ico">📚</span><div><b>三级九课分级体系</b><small>从入门问候到新闻敬语，科学进阶</small></div></div>
          <div class="hero-feature"><span class="hf-ico">🎤</span><div><b>AI 口语实时打分</b><small>逐句跟读，发音相似度即时反馈</small></div></div>
          <div class="hero-feature"><span class="hf-ico">🃏</span><div><b>智能间隔复习</b><small>SRS 算法在遗忘临界点唤醒单词</small></div></div>
          <div class="hero-feature"><span class="hf-ico">🏆</span><div><b>成就与学习社区</b><small>每日任务、徽章排行、伙伴打卡</small></div></div>
        </div>
        <div class="hero-flags">🇬🇧 🇯🇵 🇰🇷</div>
      </div>
      <div class="auth-panel">
        <div class="auth-box">
          <div class="auth-tabs">
            <button id="tab-login" class="active">登录</button>
            <button id="tab-register">注册</button>
          </div>
          <div id="auth-form"></div>
          <div class="auth-demo">第一次使用？<a id="demo-link">使用演示账号一键体验 →</a></div>
          <div class="auth-foot">数据保存在本地浏览器 · 演示项目无需后端服务</div>
        </div>
      </div>`;

    let mode = "login";
    const renderForm = () => {
      $("#tab-login").classList.toggle("active", mode === "login");
      $("#tab-register").classList.toggle("active", mode === "register");
      $("#auth-form").innerHTML = mode === "login" ? `
        <form id="login-form">
          <div class="field" id="f-user"><label>用户名</label><input placeholder="请输入用户名" value="demo" autocomplete="username">
            <div class="err">请输入用户名</div></div>
          <div class="field" id="f-pass"><label>密码</label><input type="password" placeholder="请输入密码" value="123456" autocomplete="current-password">
            <div class="err">请输入密码</div></div>
          <div class="field" id="f-msg" style="display:none;color:var(--danger);font-size:13px"></div>
          <button class="btn btn-primary btn-lg btn-block" type="submit" style="margin-top:6px">登 录</button>
        </form>` : `
        <form id="login-form">
          <div class="field" id="f-user"><label>用户名</label><input placeholder="2-14 位中英文、数字或下划线">
            <div class="err">请输入用户名</div></div>
          <div class="field" id="f-email"><label>邮箱</label><input type="email" placeholder="you@example.com">
            <div class="err">邮箱格式不正确</div></div>
          <div class="field" id="f-pass"><label>密码</label><input type="password" placeholder="至少 6 位">
            <div class="err">密码至少 6 位</div></div>
          <div class="field">
            <label>我想先学习</label>
            <div class="lang-pick">
              <label><input type="radio" name="lang" value="en" checked><span class="lp-flag">🇬🇧</span>英语</label>
              <label><input type="radio" name="lang" value="ja"><span class="lp-flag">🇯🇵</span>日语</label>
              <label><input type="radio" name="lang" value="ko"><span class="lp-flag">🇰🇷</span>韩语</label>
            </div>
          </div>
          <div class="field" id="f-msg" style="display:none;color:var(--danger);font-size:13px"></div>
          <button class="btn btn-primary btn-lg btn-block" type="submit" style="margin-top:6px">创建账号，开始学习</button>
        </form>`;

      $("#login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = $("#f-msg");
        msg.style.display = "none";
        const userInput = $("#f-user input");
        const passInput = $("#f-pass input");
        let ok = true;
        if (!userInput.value.trim()) { $("#f-user").classList.add("invalid"); ok = false; }
        else $("#f-user").classList.remove("invalid");
        if (!passInput.value) { $("#f-pass").classList.add("invalid"); ok = false; }
        else $("#f-pass").classList.remove("invalid");

        let emailInput = null;
        if (mode === "register") {
          emailInput = $("#f-email input");
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            $("#f-email").classList.add("invalid"); ok = false;
          } else $("#f-email").classList.remove("invalid");
        }
        if (!ok) return;

        if (mode === "login") {
          const r = Store.login(userInput.value, passInput.value);
          if (!r.ok) { msg.textContent = r.error; msg.style.display = "block"; return; }
        } else {
          const lang = document.querySelector('input[name="lang"]:checked').value;
          const r = Store.register({
            username: userInput.value, email: emailInput.value,
            password: passInput.value, lang
          });
          if (!r.ok) { msg.textContent = r.error; msg.style.display = "block"; return; }
        }
        this.mountApp();
      });
    };
    $("#tab-login").onclick = () => { mode = "login"; renderForm(); };
    $("#tab-register").onclick = () => { mode = "register"; renderForm(); };
    $("#demo-link").onclick = () => {
      const r = Store.login("demo", "123456");
      if (r.ok) this.mountApp();
    };
    renderForm();
  },

  /* ---------- 挂载应用 ---------- */
  mountApp() {
    Store.today(); // 记录今日访问 / 连续天数
    $("#auth-root").classList.add("hidden");
    $("#app-root").classList.remove("hidden");
    this.refreshChrome();
    if (!location.hash) location.hash = "#/";
    else this.route();
  },

  logout() {
    Store.logout();
    location.hash = "";
    $("#app-root").classList.add("hidden");
    SpeechKit.stopSpeak && SpeechKit.stopSpeak();
    this.showAuth();
  },

  /* ---------- 顶栏 / 侧栏 ---------- */
  refreshChrome() {
    const u = Store.user(); if (!u) return;
    const s = Store.stats();
    const lang = CONTENT.langs[u.targetLang];
    $("#tb-streak").textContent = s.streak;
    $("#tb-xp").textContent = s.xp;
    $("#tb-level").textContent = s.level;
    $("#topbar-lang").innerHTML = `${lang.flag} ${lang.name} <span style="opacity:.6">▾</span>`;
    $("#topbar-lang").onclick = () => this.profileModal();
    $("#topbar-user").innerHTML = `
      <span class="avatar" style="background:${u.avatarColor}">${esc(u.username[0].toUpperCase())}</span>
      <div class="tu-name">${esc(u.username)}<small>Lv.${s.level} ${s.levelTitle}</small></div>`;
    $("#topbar-user").onclick = () => this.profileModal();

    const quests = Store.questsToday();
    $("#sidebar-daily").innerHTML = `
      <div class="sc-title">📋 今日任务</div>
      ${quests.map((q) => `
        <div class="mini-quest ${q.done ? "done" : ""}">
          <span class="mq-dot">${q.claimed ? "✓" : q.icon}</span>
          <div class="mq-txt">${q.name}<small>${q.progress}/${q.target} · +${q.reward}XP</small></div>
        </div>`).join("")}
      <a class="btn btn-soft btn-block" style="margin-top:8px;padding:8px;font-size:12.5px" data-nav="#/achievements">
        领取奖励 / 查看成就
      </a>`;
  },

  refresh() { this.refreshChrome(); },

  profileModal() {
    const u = Store.user();
    const s = Store.stats();
    const root = $("#modal-root");
    root.innerHTML = `
      <div class="modal-mask" id="m-mask">
        <div class="modal">
          <div style="display:flex;align-items:center;gap:13px;margin-bottom:14px">
            <span class="avatar" style="width:52px;height:52px;font-size:21px;background:${u.avatarColor}">${esc(u.username[0].toUpperCase())}</span>
            <div><h3 style="margin:0">${esc(u.username)}</h3><div class="muted" style="font-size:13px">${esc(u.email)}</div></div>
          </div>
          <div class="modal-row"><span>Lv.${s.level} ${s.levelTitle}</span><b>${s.xp} XP</b></div>
          <div class="modal-row"><span>🔥 连续学习</span><b>${s.streak} 天</b></div>
          <div class="modal-row"><span>🃏 已掌握单词</span><b>${s.masteredWords} 个</b></div>
          <div class="modal-row" style="display:block">
            <span>🌍 当前学习语言</span>
            <div class="switch-lang">
              ${CONTENT.langList.map((l) =>
                `<button data-lang="${l.id}" class="${l.id === u.targetLang ? "active" : ""}">${l.flag} ${l.name}</button>`).join("")}
            </div>
          </div>
          <button class="btn btn-danger btn-block" id="m-logout" style="margin-top:16px">退出登录</button>
          <button class="btn btn-ghost btn-block" id="m-close" style="margin-top:10px">关闭</button>
        </div>
      </div>`;
    const close = () => (root.innerHTML = "");
    $("#m-mask").onclick = (e) => { if (e.target.id === "m-mask") close(); };
    $("#m-close").onclick = close;
    $("#m-logout").onclick = () => { close(); this.logout(); };
    root.querySelectorAll("[data-lang]").forEach((b) => {
      b.onclick = () => {
        Store.setLang(b.dataset.lang);
        close(); this.refreshChrome();
        this.toast("已切换到" + CONTENT.langs[b.dataset.lang].name + "学习", "success");
        this.route();
      };
    });
  },

  /* ---------- Toast ---------- */
  toast(msg, type = "") {
    const root = $("#toast-root");
    const el = document.createElement("div");
    el.className = "toast t-" + type;
    el.innerHTML = `<span>${type === "success" ? "✅" : type === "error" ? "⚠️" : type === "xp" ? "⭐" : "🔔"}</span><span>${esc(msg)}</span>`;
    root.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 2600);
  },

  /* ---------- 成就庆祝（彩带） ---------- */
  celebrate(list) {
    if (!list || !list.length) return;
    list.forEach((a, i) => {
      setTimeout(() => {
        this.toast("解锁成就「" + a.name + "」 " + a.icon, "success");
      }, i * 700);
    });
    const colors = ["#6C5CE7", "#FD79A8", "#FDCB6E", "#00B894", "#74B9FF", "#FF7675"];
    for (let i = 0; i < 42; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      c.style.animation = `lvfall ${1.8 + Math.random() * 1.4}s ${Math.random() * 0.6}s ease-in forwards`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3600);
    }
  },

  /* ---------- 路由 ---------- */
  route() {
    if (!Store.user()) { this.showAuth(); return; }
    this.refreshChrome();
    const raw = (location.hash || "#/").replace(/^#\/?/, "");
    const parts = raw.split("/");
    const page = parts[0] || "";
    const arg = parts[1];
    document.querySelectorAll(".nav-item").forEach((a) => {
      const target = a.dataset.nav.replace(/^#\/?/, "").split("/")[0];
      a.classList.toggle("active", target === page || (page === "" && target === ""));
    });
    $("#sidebar").classList.remove("open");
    $("#overlay").classList.remove("show");
    window.scrollTo(0, 0);

    if (page === "") this.dashboard();
    else if (page === "courses") this.courses();
    else if (page === "lesson") Learn.lessonView(arg);
    else if (page === "practice") Learn.practice(arg);
    else if (page === "progress") Social.progressView();
    else if (page === "community") Social.communityView();
    else if (page === "achievements") Social.achievementsView();
    else this.dashboard();

    // 为锚点型导航补 href，支持右键打开与无障碍语义（视图渲染后执行）
    document.querySelectorAll("a[data-nav]").forEach((a) => { a.setAttribute("href", a.dataset.nav); });
  },

  /* ---------- 仪表盘 ---------- */
  dashboard() {
    const u = Store.user();
    const s = Store.stats();
    const lang = CONTENT.langs[u.targetLang];
    const langProg = s.lessons.find((x) => x.lang.id === u.targetLang);
    const pct = Math.round(langProg.done / langProg.total * 100);
    const R = 52, C = 2 * Math.PI * R;
    const recs = Store.recommendations();
    const t = Store.today();
    const hour = new Date().getHours();
    const hello = hour < 6 ? "夜深了" : hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好";

    const quick = [
      { k: "vocab", icon: "🃏", name: "单词记忆", desc: "SRS 智能闪卡", bg: "#EFEDFF" },
      { k: "grammar", icon: "✏️", name: "语法练习", desc: "闯关即时解析", bg: "#E8F0FF" },
      { k: "speaking", icon: "🎤", name: "口语跟读", desc: "AI 发音打分", bg: "#FDEEE7" },
      { k: "listening", icon: "🎧", name: "听力训练", desc: "情景对话听解", bg: "#E4F8F1" }
    ];

    view().innerHTML = `
      <div class="welcome-banner">
        <h2>${hello}，${esc(u.username)}！继续你的${lang.flag}${lang.name}之旅</h2>
        <p>${t.xp > 0
          ? `今天已学习 ${t.minutes} 分钟、获得 ${t.xp} XP，${s.streak} 天的坚持正在改变你 🔥`
          : "今天还没有开始学习，完成一节 5 分钟的小课，延续你的连续打卡吧！"}</p>
        <div class="wb-actions">
          <a class="btn" data-nav="${recs[0] ? recs[0].nav : "#/courses"}">${t.xp > 0 ? "继续今日学习 →" : "立即开始 🚀"}</a>
          <a class="btn btn-outline" data-nav="#/courses">浏览全部课程</a>
        </div>
      </div>

      <div class="dash-grid">
        <div class="stat-card"><div class="sc-ico" style="background:#FDEEE7">🔥</div><div><b>${s.streak}</b><small>连续学习天数</small></div></div>
        <div class="stat-card"><div class="sc-ico" style="background:#EFEDFF">⭐</div><div><b>${t.xp}</b><small>今日 XP</small></div></div>
        <div class="stat-card"><div class="sc-ico" style="background:#FFF4E0">🃏</div><div><b>${s.masteredWords}</b><small>已掌握单词</small></div></div>
        <div class="stat-card"><div class="sc-ico" style="background:#E8F0FF">🎓</div><div><b>${s.completedCount}</b><small>完成课程数</small></div></div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="panel-head">
            <h3>${lang.flag} ${lang.name}学习总览</h3>
            <a data-nav="#/courses">切换语种 →</a>
          </div>
          <div class="ring-wrap">
            <div class="ring">
              <svg width="118" height="118">
                <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#6C5CE7"/><stop offset="100%" stop-color="#8B5CF6"/>
                </linearGradient></defs>
                <circle class="ring-bg" cx="59" cy="59" r="${R}"/>
                <circle class="ring-fg" cx="59" cy="59" r="${R}"
                  stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>
              </svg>
              <div class="ring-txt"><b>${pct}%</b><small>${langProg.done}/${langProg.total} 课</small></div>
            </div>
            <div class="skill-bars">
              ${["vocab", "grammar", "speaking", "listening"].map((k) => {
                const meta = { vocab: ["🃏 词汇", "#6C5CE7"], grammar: ["✏️ 语法", "#0984E3"], speaking: ["🎤 口语", "#E17055"], listening: ["🎧 听力", "#00B894"] }[k];
                const v = s.skillAvg[k];
                return `
                <div class="skill-bar">
                  <div class="sb-head"><span>${meta[0]}</span><small>${v ? v + " 分" : "未测评"}</small></div>
                  <div class="progress"><i style="width:${v}%;background:${meta[1]}"></i></div>
                </div>`;
              }).join("")}
            </div>
          </div>
          <hr style="border:none;border-top:1px solid var(--line);margin:18px 0 14px">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
            ${quick.map((q) => `
              <div data-nav="#/practice/${q.k}" style="background:${q.bg};border-radius:14px;padding:13px 8px;text-align:center;cursor:pointer;transition:.15s"
                onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform=''">
                <div style="font-size:22px">${q.icon}</div>
                <b style="font-size:12.5px;display:block;margin-top:3px">${q.name}</b>
                <small style="color:var(--ink-3);font-size:10.5px">${q.desc}</small>
              </div>`).join("")}
          </div>
        </div>

        <div class="card">
          <div class="panel-head"><h3>🎯 为你推荐</h3><span class="muted" style="font-size:12px">个性化路径</span></div>
          ${recs.map((r) => `
            <div class="path-item" data-nav="${r.nav}">
              <div class="path-ico" style="background:${r.bg}">${r.icon}</div>
              <div class="pi-main">
                <b>${esc(r.title)}</b>
                <small>${esc(r.sub)}</small>
              </div>
              <span class="path-badge ${r.badgeCls}">${r.badge}</span>
              <span class="pi-arrow">→</span>
            </div>`).join("")}
          <a class="btn btn-soft btn-block" style="margin-top:12px" data-nav="#/progress">📈 查看详细学习分析</a>
        </div>
      </div>`;
  },

  /* ---------- 课程中心 ---------- */
  courses() {
    const u = Store.user();
    const langId = u.targetLang;
    const lang = CONTENT.langs[langId];
    const s = Store.stats();

    view().innerHTML = `
      <div class="section-title">📚 分级课程体系</div>
      <div class="section-sub">每个语种 3 个级别、9 节情景课程，从零基础到高阶思辨稳步进阶</div>

      <div class="lang-switch">
        ${CONTENT.langList.map((l) => `
          <button class="lang-tab ${l.id === langId ? "active" : ""}" data-lang="${l.id}">
            <span class="lt-flag">${l.flag}</span>${l.name}<small style="opacity:.7;font-weight:600"> ${l.native}</small>
          </button>`).join("")}
      </div>
      <div id="levels"></div>`;

    const drawLevels = () => {
      const cur = CONTENT.langs[Store.user().targetLang];
      $("#levels").innerHTML = cur.levels.map((lv, li) => {
        const lessons = lv.lessons;
        const done = lessons.filter((l) => (Store.user().lessons[l.id] || {}).done).length;
        const pct = Math.round(done / lessons.length * 100);
        return `
        <div class="level-block">
          <div class="level-head">
            <div class="level-badge" style="background:${lv.color}">L${li + 1}</div>
            <div>
              <h3>${esc(lv.name)}</h3>
              <small>${esc(lv.sub)}</small>
            </div>
            <div class="level-prog">
              <div class="progress green" style="margin-bottom:4px"><i style="width:${pct}%"></i></div>
              <small class="muted" style="font-size:11.5px">${done}/${lessons.length} 已完成</small>
            </div>
          </div>
          <div class="lesson-grid">
            ${lessons.map((l, idx) => {
              const st = Store.user().lessons[l.id] || {};
              return `
              <div class="lesson-card" data-lesson="${l.id}">
                ${st.done ? '<span class="lc-check">✓</span>' : ""}
                <div class="lc-ico" style="background:${lv.color}18;font-size:24px">${l.icon}</div>
                <h4>${idx + 1}. ${esc(l.title)}</h4>
                <p>${esc(l.desc)}</p>
                <div class="lc-meta">
                  <span>🃏 ${l.vocab.length}</span><span>✏️ ${l.grammar.length}</span>
                  <span>🎤 ${l.speaking.length}</span><span>🎧 ${l.listening.qs.length}</span>
                  ${st.done ? '<span style="margin-left:auto;color:var(--accent);font-weight:800">已完成</span>' : ""}
                </div>
              </div>`;
            }).join("")}
          </div>
        </div>`;
      }).join("");

      view().querySelectorAll("[data-lesson]").forEach((el) => {
        el.onclick = () => (location.hash = "#/lesson/" + el.dataset.lesson);
      });
    };

    view().querySelectorAll("[data-lang]").forEach((b) => {
      b.onclick = () => {
        Store.setLang(b.dataset.lang);
        this.refreshChrome();
        this.courses();
      };
    });
    drawLevels();
  }
};

window.App = App;
document.addEventListener("DOMContentLoaded", () => App.boot());
})();
