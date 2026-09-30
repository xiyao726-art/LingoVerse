/* ============================================================
 * 语界 LingoVerse —— 进度 / 社区 / 成就 视图
 * ============================================================ */
(function () {
"use strict";

const view = () => document.getElementById("view");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const go = (h) => window.App && window.App.goto(h);
const toast = (m, t) => window.App && window.App.toast(m, t);
const refresh = () => window.App && window.App.refresh();

/* ================= 学习进度 ================= */
function progressView() {
  const s = Store.stats();
  const week = Store.weekly();
  const maxXp = Math.max(50, ...week.map((d) => d.xp));
  const totalH = Math.floor(s.totalMinutes / 60);
  const mins = s.totalMinutes % 60;

  // 雷达图坐标（四轴：词汇/语法/口语/听力）
  const cx = 110, cy = 110, R = 82;
  const axes = [
    { key: "vocab", label: "词汇", ang: -Math.PI / 2 },
    { key: "grammar", label: "语法", ang: 0 },
    { key: "listening", label: "听力", ang: Math.PI / 2 },
    { key: "speaking", label: "口语", ang: Math.PI }
  ];
  const pt = (ang, r) => [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  const gridPoly = [0.25, 0.5, 0.75, 1].map((f) =>
    axes.map((a) => pt(a.ang, R * f).join(",")).join(" ")
  );
  const dataPoly = axes.map((a) => pt(a.ang, R * Math.max(s.skillAvg[a.key], 4) / 100).join(",")).join(" ");
  const axisLabels = axes.map((a) => {
    const [x, y] = pt(a.ang, R + 20);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
      font-size="13" font-weight="700" fill="#5B6178">${a.label} ${s.skillAvg[a.key]}</text>`;
  }).join("");

  // 打卡日历
  const cal = Store.calendar();
  const firstDate = new Date(cal[0].date);
  const offset = (firstDate.getDay() + 6) % 7; // 周一起
  const calHeads = ["一", "二", "三", "四", "五", "六", "日"];

  view().innerHTML = `
    <div class="section-title">📈 学习进度</div>
    <div class="section-sub">数据记录你的每一步坚持 —— 连续学习 <b style="color:#E17055">${s.streak}</b> 天</div>

    <div class="prog-grid">
      <div class="stat-card"><div class="sc-ico" style="background:#EFEDFF">⭐</div><div><b>${s.xp}</b><small>累计经验值</small></div></div>
      <div class="stat-card"><div class="sc-ico" style="background:#E4F8F1">⏱️</div><div><b>${totalH > 0 ? totalH + "h" + mins + "m" : s.totalMinutes + "m"}</b><small>学习时长</small></div></div>
      <div class="stat-card"><div class="sc-ico" style="background:#FFF4E0">🃏</div><div><b>${s.masteredWords}</b><small>已掌握单词</small></div></div>
      <div class="stat-card"><div class="sc-ico" style="background:#E8F0FF">🎓</div><div><b>${s.completedCount}/${s.totalLessons}</b><small>完成课程</small></div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="panel-head"><h3>本周学习 XP</h3><a data-nav="#/achievements">查看任务 →</a></div>
        <div class="week-chart">
          ${week.map((d) => `
            <div class="week-col">
              <div class="week-bar ${d.today ? "today" : ""}" style="height:${Math.round(d.xp / maxXp * 100)}%">
                ${d.xp ? `<small>${d.xp}</small>` : ""}
              </div>
              <div class="week-label">${d.label}</div>
            </div>`).join("")}
        </div>
        <p class="muted" style="font-size:12.5px;margin-top:14px">今日已获得 ${week[6].xp} XP · 学习 ${week[6].minutes} 分钟 · 记住 ${week[6].words} 词</p>
      </div>

      <div class="card">
        <div class="panel-head"><h3>能力雷达</h3><span class="muted" style="font-size:12px">四大技能均分</span></div>
        <div class="radar-wrap">
          <svg width="240" height="240" viewBox="0 0 220 220">
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#6C5CE7" stop-opacity=".45"/>
                <stop offset="100%" stop-color="#8B5CF6" stop-opacity=".2"/>
              </linearGradient>
            </defs>
            ${gridPoly.map((p, i) => `<polygon points="${p}" fill="none" stroke="#ECEEF5" stroke-width="1"/>`).join("")}
            ${axes.map((a) => { const [x, y] = pt(a.ang, R); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#ECEEF5"/>`; }).join("")}
            <polygon points="${dataPoly}" fill="url(#radarFill)" stroke="#6C5CE7" stroke-width="2"/>
            ${axes.map((a) => { const [x, y] = pt(a.ang, R * Math.max(s.skillAvg[a.key], 4) / 100); return `<circle cx="${x}" cy="${y}" r="3.5" fill="#6C5CE7"/>`; }).join("")}
            ${axisLabels}
          </svg>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="panel-head"><h3>打卡日历（近 5 周）</h3><span class="muted" style="font-size:12px">颜色越深学习越久</span></div>
        <div class="calendar-grid">
          ${calHeads.map((h) => `<div class="cal-head">${h}</div>`).join("")}
          ${Array.from({ length: offset }).map(() => '<div></div>').join("")}
          ${cal.map((c) => `<div class="cal-cell ${c.level ? "done-" + c.level : ""}" title="${c.date}">${c.day}</div>`).join("")}
        </div>
        <div style="display:flex;gap:8px;align-items:center;justify-content:flex-end;margin-top:12px;font-size:11.5px;color:var(--ink-3)">
          少 <span class="cal-cell done" style="width:14px;height:14px"></span>
          <span class="cal-cell done-2" style="width:14px;height:14px"></span>
          <span class="cal-cell done-3" style="width:14px;height:14px"></span> 多
        </div>
      </div>

      <div class="card">
        <div class="panel-head"><h3>语种课程进度</h3></div>
        ${s.lessons.map(({ lang, total, done }) => {
          const pct = Math.round(done / total * 100);
          return `
          <div style="margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;margin-bottom:7px">
              <span>${lang.flag} ${lang.name}</span><small class="muted">${done}/${total} · ${pct}%</small>
            </div>
            <div class="progress" style="height:10px"><i style="width:${pct}%;background:${lang.id === "en" ? "var(--en)" : lang.id === "ja" ? "var(--ja)" : "var(--ko)"}"></i></div>
          </div>`;
        }).join("")}
        <hr style="border:none;border-top:1px solid var(--line);margin:16px 0">
        <div style="display:grid;gap:11px;font-size:13.5px">
          <div style="display:flex;justify-content:space-between"><span class="muted">💯 语法满分次数</span><b>${s.perfectCount} 次</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">🎤 口语练习次数</span><b>${s.speakingCount} 次</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">🎧 听力练习次数</span><b>${s.listeningCount} 次</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">🌍 涉及语种</span><b>${s.langsStudied.length} 种</b></div>
        </div>
      </div>
    </div>`;
}

/* ================= 学习社区 ================= */
let currentTag = "全部";
const expandedPosts = new Set(); // 重渲染后保持评论区展开状态
const TAGS = ["全部", "英语", "日语", "韩语", "打卡", "经验"];

function communityView(tag) {
  currentTag = tag || "全部";
  const posts = Store.posts(currentTag);
  const u = Store.user();
  const groups = CONTENT.GROUPS;

  view().innerHTML = `
    <div class="section-title">💬 学习社区</div>
    <div class="section-sub">和全球语言学习者一起交流、打卡、共同进步</div>

    <div class="tabs">
      ${TAGS.map((t) => `<button class="tab-btn ${t === currentTag ? "active" : ""}" data-tag="${t}">${t}</button>`).join("")}
    </div>

    <div class="community-grid">
      <div>
        <div class="card post-composer">
          <textarea id="post-text" placeholder="分享你的学习心得、提出疑问、或者打卡今天的学习……"></textarea>
          <div class="pc-foot">
            <div class="pc-tags">
              ${["英语", "日语", "韩语", "打卡", "经验"].map((t, i) =>
                `<span class="pc-tag ${i === 3 ? "active" : ""}" data-tag="${t}">#${t}</span>`).join("")}
            </div>
            <button class="btn btn-primary" id="post-send" style="margin-left:auto">发布 🚀</button>
          </div>
        </div>
        <div id="feed">
          ${posts.length ? posts.map(postHtml).join("") : '<div class="card empty"><span class="e-ico">🔇</span>该标签下还没有动态，来发第一条吧～</div>'}
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="panel-head"><h3>🏅 我的排名</h3><a data-nav="#/achievements">完整榜单</a></div>
          ${myRankHtml()}
        </div>
        <div class="card">
          <div class="panel-head"><h3>👥 推荐学习小组</h3></div>
          ${groups.map((g) => {
            const joined = u.groups.includes(g.name);
            return `
            <div class="group-item">
              <div class="group-ico">${g.icon}</div>
              <div style="flex:1;min-width:0">
                <b>${g.name}</b>
                <small>${g.members.toLocaleString()} 人 · ${g.desc}</small>
              </div>
              <button class="btn ${joined ? "btn-soft" : "btn-ghost"}" data-group="${esc(g.name)}">${joined ? "已加入 ✓" : "加入"}</button>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`;

  // 标签切换
  view().querySelectorAll(".tabs .tab-btn").forEach((b) => b.onclick = () => communityView(b.dataset.tag));

  // 发帖标签选择
  let selTag = "打卡";
  view().querySelectorAll(".pc-tag").forEach((el) => {
    el.onclick = () => {
      view().querySelectorAll(".pc-tag").forEach((x) => x.classList.remove("active"));
      el.classList.add("active"); selTag = el.dataset.tag;
    };
  });
  view().querySelector("#post-send").onclick = () => {
    const ta = view().querySelector("#post-text");
    const text = ta.value.trim();
    if (!text) { toast("说点什么再发布吧～", "error"); return; }
    if (text.length > 300) { toast("内容请控制在 300 字以内", "error"); return; }
    Store.addPost(text, selTag);
    toast("动态已发布，+10 XP 🎉", "success");
    communityView(currentTag);
  };

  bindPostEvents();
}

function postHtml(p) {
  return `
  <div class="post" data-id="${p.id}">
    <div class="post-head">
      <span class="avatar" style="background:${p.color}">${esc(p.user[0].toUpperCase())}</span>
      <div>
        <div class="ph-name">${esc(p.user)}${p.mine ? ' <span class="tag" style="font-size:10px;padding:1px 7px">我</span>' : ""}</div>
        <div class="ph-meta">${p.time}</div>
      </div>
      <span class="post-tag" style="background:${p.tagColor || "#F0F1F7"}">#${esc(p.tag)}</span>
    </div>
    <div class="post-body">${esc(p.text)}</div>
    <div class="post-actions">
      <button class="${p.liked ? "liked" : ""}" data-act="like">${p.liked ? "❤️" : "🤍"} ${p.likes}</button>
      <button data-act="comments">💬 ${p.comments.length}</button>
    </div>
    <div class="post-comments">
      ${p.comments.map((c) => `
        <div class="comment">
          <span class="avatar" style="background:${c.color || "#9AA0B5"}">${esc((c.u || "?")[0].toUpperCase())}</span>
          <div><b>${esc(c.u)}</b><span>${esc(c.text)}</span></div>
        </div>`).join("")}
      <div class="comment-input">
        <input placeholder="写下你的评论…" maxlength="120">
        <button class="btn btn-primary" style="padding:8px 16px">发送</button>
      </div>
    </div>
  </div>`;
}

function bindPostEvents() {
  view().querySelectorAll(".post").forEach((post) => {
    const id = post.dataset.id;
    const likeBtn = post.querySelector('[data-act="like"]');
    const cmBtn = post.querySelector('[data-act="comments"]');
    const cmBox = post.querySelector(".post-comments");

    likeBtn.onclick = () => { Store.toggleLike(id); communityView(currentTag); };
    cmBtn.onclick = () => {
      if (expandedPosts.has(id)) expandedPosts.delete(id); else expandedPosts.add(id);
      cmBox.classList.toggle("show");
    };
    if (expandedPosts.has(id)) cmBox.classList.add("show");

    const input = post.querySelector(".comment-input input");
    const send = post.querySelector(".comment-input .btn");
    const submit = () => {
      const v = input.value.trim();
      if (!v) return;
      Store.addComment(id, v);
      toast("评论已发送", "success");
      expandedPosts.add(id);
      communityView(currentTag);
    };
    send.onclick = submit;
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  });

  view().querySelectorAll("[data-group]").forEach((b) => {
    b.onclick = () => {
      const joined = Store.toggleGroup(b.dataset.group);
      toast(joined ? "已加入「" + b.dataset.group + "」" : "已退出小组", joined ? "success" : "");
      communityView(currentTag);
    };
  });
}

function myRankHtml() {
  const board = Store.leaderboard();
  const idx = board.findIndex((x) => x.me);
  const me = board[idx];
  return `
    <div class="lb-row me" style="background:var(--primary-soft);border-radius:12px">
      <div class="lb-rank">${idx + 1 >= 4 ? idx + 1 : ["🥇", "🥈", "🥉"][idx]}</div>
      <span class="avatar" style="background:${me.color}">${esc(me.name[0].toUpperCase())}</span>
      <div class="lb-name">${esc(me.name)}<small>${esc(me.sub)}</small></div>
      <div class="lb-xp">${me.xp} XP</div>
    </div>
    <p class="muted" style="font-size:12.5px;margin-top:10px;text-align:center">
      ${idx === 0 ? "你已登顶榜首，继续保持！👑" : "距上一名还差 " + (board[idx - 1].xp - me.xp) + " XP，加油！"}
    </p>`;
}

/* ================= 成就激励 ================= */
function achievementsView() {
  const s = Store.stats();
  const quests = Store.questsToday();
  const u = Store.user();
  const board = Store.leaderboard();
  const lvlPct = Math.round((s.xp - s.prevLevelAt) / (s.nextLevelAt - s.prevLevelAt) * 100);

  view().innerHTML = `
    <div class="section-title">🏆 成就中心</div>
    <div class="section-sub">完成任务、解锁徽章、登上排行榜，让学习像游戏一样停不下来</div>

    <div class="card" style="margin-bottom:20px;background:linear-gradient(120deg,#6C5CE7,#8E5CF0);color:#fff">
      <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
        <div style="font-size:44px">🎖️</div>
        <div style="flex:1;min-width:220px">
          <div style="font-weight:800;font-size:18px">Lv.${s.level} ${s.levelTitle}</div>
          <div style="font-size:13px;opacity:.9;margin:4px 0 8px">再获得 ${s.nextLevelAt - s.xp} XP 升级到 Lv.${s.level + 1}</div>
          <div class="progress" style="background:rgba(255,255,255,.25)"><i style="width:${lvlPct}%;background:#fff"></i></div>
        </div>
        <div style="text-align:center">
          <div style="font-size:24px;font-weight:800">${s.xp}</div><small style="opacity:.85">当前 XP</small>
        </div>
      </div>
    </div>

    <h3 style="margin-bottom:12px;font-size:17px">📋 今日任务</h3>
    <div class="quest-list">
      ${quests.map((q) => `
        <div class="quest-card">
          <div class="qc-head">
            <div class="quest-ico">${q.icon}</div>
            <div><b>${q.name}</b><small>${q.progress}/${q.target}</small></div>
            <span class="qc-reward">+${q.reward} XP</span>
          </div>
          <div class="progress" style="margin-bottom:12px"><i style="width:${Math.round(q.progress / q.target * 100)}%"></i></div>
          <button class="btn ${q.claimed ? "btn-ghost" : q.done ? "btn-primary" : "btn-ghost"} btn-block" data-quest="${q.id}"
            ${q.claimed ? "disabled" : ""}>
            ${q.claimed ? "✓ 已领取" : q.done ? "🎁 领取奖励" : "未完成"}
          </button>
        </div>`).join("")}
    </div>

    <h3 style="margin-bottom:12px;font-size:17px">🎖️ 成就徽章（${Object.keys(u.achievements).length}/${CONTENT.ACHIEVEMENTS.length}）</h3>
    <div class="ach-grid">
      ${CONTENT.ACHIEVEMENTS.map((a) => {
        const got = u.achievements[a.id];
        return `
        <div class="ach-card ${got ? "" : "locked"}">
          <div class="ach-medal">${a.icon}</div>
          <h4>${a.name}</h4>
          <p>${a.desc}</p>
          <div class="ach-date">${got ? "✓ " + got + " 解锁" : "🔒 未解锁"}</div>
        </div>`;
      }).join("")}
    </div>

    <div class="card">
      <div class="panel-head"><h3>🏅 学习排行榜</h3><span class="muted" style="font-size:12px">按本周累计 XP 排名</span></div>
      <div class="leaderboard">
        ${board.map((p, idx) => `
          <div class="lb-row ${p.me ? "me" : ""} ${idx === 0 ? "top1" : ""}">
            <div class="lb-rank">${idx < 3 ? ["🥇", "🥈", "🥉"][idx] : idx + 1}</div>
            <span class="avatar" style="background:${p.color}">${esc(p.name[0].toUpperCase())}</span>
            <div class="lb-name">${esc(p.name)}<small>${esc(p.sub)}</small></div>
            <div class="lb-xp">${p.xp} XP</div>
          </div>`).join("")}
      </div>
    </div>`;

  view().querySelectorAll("[data-quest]").forEach((b) => {
    b.onclick = () => {
      const r = Store.claimQuest(b.dataset.quest);
      if (r.ok) { toast("领取成功，+" + r.reward + " XP 🎁", "xp"); achievementsView(); refresh(); }
      else toast(r.error || "任务尚未完成", "error");
    };
  });
}

window.Social = { progressView, communityView, achievementsView };
})();
