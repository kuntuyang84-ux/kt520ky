/* ============================================================
   K & L 情侣小站 · 交互脚本
   ============================================================
   ⭐⭐⭐ 专属信息都在下面 CONFIG 里改，改完保存刷新即可 ⭐⭐⭐
   ============================================================ */

const CONFIG = {
  /* 两个人的名字（想用中文/昵称都行） */
  names: { a: 'K', b: 'L' },

  /* 首屏的一句话 */
  tagline: '执子之手 · 与子偕老',

  /* ⚠️ 在一起（或结婚）的日期：'YYYY-MM-DD'。 */
  startDate: '2026-06-15',

  /* 每天心跳次数（用来算"为你心动 N 次"，每分钟 80 次） */
  heartbeatsPerDay: 115200,

  /* 我们的故事：date / title / text，按顺序写 */
  story: [
    { date: '2026.06.15', title: '在一起',     text: '从这天起，「我」变成了「我们」。' },
    { date: '2026 夏',    title: '热恋的每一天', text: '一起吃饭、散步、看晚霞，平凡的日子都在发光。' },
    { date: '未来',       title: '未完待续',   text: '第一个 100 天、第一个 365 天……故事还长，我们慢慢写。' },
  ],

  /* 相册：把照片命名为 photo-1.jpg ~ photo-9.jpg，直接放进和 index.html 同一个文件夹。
        emoji 是没放照片时显示的占位图案，caption 是照片下方的小字。 */
  gallery: [
    { src: 'photo-1.jpg', emoji: '🎬', caption: '第一张合照',     date: 'PHOTO 01' },
    { src: 'photo-2.jpg', emoji: '🌸', caption: '春天和你',       date: 'PHOTO 02' },
    { src: 'photo-3.jpg', emoji: '🍜', caption: '第一次约会吃的那碗面', date: 'PHOTO 03' },
    { src: 'photo-4.jpg', emoji: '🚄', caption: '一起去看海',     date: 'PHOTO 04' },
    { src: 'photo-5.jpg', emoji: '🎂', caption: '给你过的生日',   date: 'PHOTO 05' },
    { src: 'photo-6.jpg', emoji: '🌇', caption: '黄昏散步',       date: 'PHOTO 06' },
    { src: 'photo-7.jpg', emoji: '☕', caption: '周末的咖啡馆',   date: 'PHOTO 07' },
    { src: 'photo-8.jpg', emoji: '🌧️', caption: '雨天的屋檐下',  date: 'PHOTO 08' },
    { src: 'photo-9.jpg', emoji: '🏠', caption: '我们的小家',     date: 'PHOTO 09' },
  ],

  /* 留言板初始留言（首次打开时出现，之后以大家留言为准，可手动删除） */
  seedMessages: [
    { name: 'K', text: '第一句话，想留给你。', ts: '2026-09-06', hearts: 1 },
    { name: 'L', text: '那我说第二句：往后的日子，都请多指教啦。', ts: '2026-09-06', hearts: 1 },
  ],
};

/* ============================================================ */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const pad = n => String(n).padStart(2, '0');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 应用专属信息 ---------- */
  $('#nameA').textContent = CONFIG.names.a;
  $('#nameB').textContent = CONFIG.names.b;
  $('#tagline').textContent = CONFIG.tagline;
  $('#year').textContent = new Date().getFullYear();
  $('.nav-logo').innerHTML =
    `${escapeHTML(CONFIG.names.a)}<span class="logo-heart" id="logoHeart" role="button" tabindex="0" aria-label="点我试试">❤</span>${escapeHTML(CONFIG.names.b)}`;
  $('#footerLine').innerHTML =
    `${escapeHTML(CONFIG.names.a)} <span class="heart">❤</span> ${escapeHTML(CONFIG.names.b)} · Since 06·15`;

  function escapeHTML(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ============================================================
     1. 时光机：在一起天数 / 纪念日倒计时 / 心跳 / 里程碑
     ============================================================ */
  const start = parseDate(CONFIG.startDate) || new Date(2015, 5, 15);
  const DAY = 86400000;
  const $days = $('#daysNum'), $hms = $('#hmsLive');
  const $anniDays = $('#anniDays'), $anniHMS = $('#anniHMS');
  const $beat = $('#heartbeatNum');

  function parseDate(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function nextAnniversary() {
    const now = new Date();
    let target = new Date(now.getFullYear(), start.getMonth(), start.getDate());
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (target.getTime() === todayStart) return { date: target, isToday: true };
    if (target.getTime() < todayStart) target = new Date(now.getFullYear() + 1, start.getMonth(), start.getDate());
    return { date: target, isToday: false };
  }

  function tick() {
    const now = new Date();
    const diff = Math.max(0, now - start);
    const days = Math.floor(diff / DAY);
    const rest = diff - days * DAY;
    const h = Math.floor(rest / 3600000);
    const m = Math.floor(rest % 3600000 / 60000);
    const s = Math.floor(rest % 60000 / 1000);

    $days.textContent = days.toLocaleString('zh-CN');
    $hms.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;

    const anni = nextAnniversary();
    if (anni.isToday) {
      $anniDays.textContent = '今天';
      $anniDays.style.fontSize = 'clamp(1.8rem, 1.2rem + 3vw, 3rem)';
      $anniHMS.textContent = '🎂 纪念日快乐！';
    } else {
      const d2 = anni.date - now;
      const dd = Math.floor(d2 / DAY);
      const hh = Math.floor(d2 % DAY / 3600000);
      const mm = Math.floor(d2 % 3600000 / 60000);
      const ss = Math.floor(d2 % 60000 / 1000);
      $anniDays.textContent = dd.toLocaleString('zh-CN');
      $anniHMS.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
    }

    const beats = days * CONFIG.heartbeatsPerDay;
    $beat.textContent = beats >= 1e8
      ? (beats / 1e8).toFixed(2) + ' 亿'
      : (beats / 1e4).toFixed(1) + ' 万';
  }

  /* 里程碑：100 / 365 / 520 / 1000 / 1314 / 2000 / 3000 / 5000 天 */
  function renderMilestones() {
    const box = $('#milestones');
    const list = [100, 365, 520, 1000, 1314, 2000, 3000, 5000];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const passed = [], upcoming = [];
    for (const d of list) {
      const date = new Date(start.getTime() + d * DAY);
      (date <= todayStart ? passed : upcoming).push({ d, date });
    }
    const fmt = dt => `${dt.getFullYear()}.${pad(dt.getMonth() + 1)}.${pad(dt.getDate())}`;
    let html = passed.map(p =>
      `<span class="milestone done">💕 ${p.d} 天 · ${fmt(p.date)}</span>`).join('');
    if (upcoming.length) {
      const next = upcoming[0];
      const left = Math.ceil((next.date - todayStart) / DAY);
      html += `<span class="milestone next">♥ 下一站：${next.d} 天 · ${fmt(next.date)} · 还有 ${left} 天</span>`;
    }
    box.innerHTML = html;
  }

  tick();
  setInterval(tick, 1000);
  renderMilestones();

  /* ============================================================
     2. 我们的故事：时间线
     ============================================================ */
  (function renderStory() {
    const ol = $('#timeline');
    ol.innerHTML = CONFIG.story.map((s, i) => `
      <li class="timeline-item reveal">
        <span class="timeline-dot" aria-hidden="true"></span>
        <p class="timeline-date">${escapeHTML(s.date)}</p>
        <h3 class="timeline-title">${escapeHTML(s.title)}</h3>
        <p class="timeline-text">${escapeHTML(s.text)}</p>
      </li>`).join('');
  })();

  /* ============================================================
     3. 相册：拍立得 + 灯箱
     ============================================================ */
  const PH_GRADIENTS = [
    ['#E8B4BC', '#B4485A'], ['#EFD3A8', '#C29A62'], ['#D9C3D6', '#9A6E92'],
    ['#BFD3C8', '#6F9280'], ['#C7D4E2', '#6C86A3'],
  ];

  (function renderGallery() {
    const grid = $('#galleryGrid');
    grid.innerHTML = CONFIG.gallery.map((g, i) => `
      <figure class="polaroid reveal" data-index="${i}" tabindex="0" role="button"
              aria-label="查看照片：${escapeHTML(g.caption)}">
        <div class="polaroid-frame">
          <img src="${g.src}" alt="${escapeHTML(g.caption)}" loading="lazy">
        </div>
        <figcaption class="polaroid-caption">
          <p class="polaroid-title">${escapeHTML(g.caption)}</p>
          <p class="polaroid-date">${escapeHTML(g.date)}</p>
        </figcaption>
      </figure>`).join('');

    /* 照片缺失 → 显示手绘感占位 */
    $$('.polaroid img', grid).forEach((img, i) => {
      img.addEventListener('error', () => {
        CONFIG.gallery[i].failed = true;
        const [c1, c2] = PH_GRADIENTS[i % PH_GRADIENTS.length];
        const ph = document.createElement('div');
        ph.className = 'ph';
        ph.style.background = `linear-gradient(150deg, ${c1}, ${c2})`;
        ph.innerHTML = `<span class="ph-emoji">${CONFIG.gallery[i].emoji}</span>
                        <span class="ph-text">等一张照片</span>`;
        img.replaceWith(ph);
      });
    });

    /* 灯箱 */
    const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCaption'), lbPh = $('#lbPh');
    let current = 0;
    let lastFocus = null;

    function openLb(i) {
      current = i;
      lastFocus = document.activeElement;
      updateLb();
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      $('#lbClose').focus();
    }
    function updateLb() {
      const g = CONFIG.gallery[current];
      lbCap.textContent = `${g.caption} · ${g.date}`;
      if (g.failed) {
        lbImg.hidden = true;
        const [c1, c2] = PH_GRADIENTS[current % PH_GRADIENTS.length];
        lbPh.style.background = `linear-gradient(150deg, ${c1}, ${c2})`;
        lbPh.innerHTML = `<span class="ph-emoji">${g.emoji}</span><span class="ph-text">等一张照片</span>`;
        lbPh.hidden = false;
      } else {
        lbPh.hidden = true;
        lbImg.hidden = false;
        lbImg.src = g.src;
        lbImg.alt = g.caption;
      }
    }
    function closeLb() {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    /* 兜底：灯箱图加载失败（lazy 图未及 404 就被点开）时也显示占位 */
    lbImg.addEventListener('error', () => {
      CONFIG.gallery[current].failed = true;
      updateLb();
    });
    function step(dir) {
      current = (current + dir + CONFIG.gallery.length) % CONFIG.gallery.length;
      updateLb();
    }

    grid.addEventListener('click', e => {
      const fig = e.target.closest('.polaroid');
      if (fig) openLb(+fig.dataset.index);
    });
    grid.addEventListener('keydown', e => {
      const fig = e.target.closest('.polaroid');
      if (fig && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openLb(+fig.dataset.index);
      }
    });
    $('#lbClose').addEventListener('click', closeLb);
    $('#lbPrev').addEventListener('click', () => step(-1));
    $('#lbNext').addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  })();

  /* ============================================================
     4. 留言板（localStorage）
     ============================================================ */
  const LS_KEY = 'ktll_messages_v1';
  const LS_LIKED = 'ktll_liked_v1';

  function loadMessages() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) { /* 数据坏了就重置 */ }
    const seed = CONFIG.seedMessages.map((m, i) => ({ ...m, id: 'seed-' + i }));
    saveMessages(seed);
    return seed;
  }
  function saveMessages(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (_) { /* 忽略 */ }
  }
  function likedSet() {
    try { return new Set(JSON.parse(localStorage.getItem(LS_LIKED) || '[]')); }
    catch (_) { return new Set(); }
  }
  function saveLiked(set) {
    try { localStorage.setItem(LS_LIKED, JSON.stringify([...set])); } catch (_) { /* 忽略 */ }
  }

  let messages = loadMessages();

  (function renderNotes() {
    const wall = $('#notesWall');

    function draw() {
      if (!messages.length) {
        wall.innerHTML = '<p class="notes-empty">还没有留言，来写下第一句吧 ✍️</p>';
        return;
      }
      const liked = likedSet();
      wall.innerHTML = messages.map(m => {
        const isLiked = liked.has(m.id);
        return `
        <article class="note">
          <p class="note-text">${escapeHTML(m.text)}</p>
          <div class="note-foot">
            <div>
              <span class="note-name">${escapeHTML(m.name)}</span>
              <span class="note-meta"> · ${escapeHTML(m.ts)}</span>
            </div>
            <div class="note-actions">
              <button class="note-heart ${isLiked ? 'liked' : ''}" data-id="${m.id}" aria-label="点赞这条留言">
                <span class="heart-glyph">${isLiked ? '❤' : '♡'}</span>${m.hearts}
              </button>
              <button class="note-del" data-id="${m.id}" aria-label="删除这条留言">✕</button>
            </div>
          </div>
        </article>`;
      }).join('');
    }

    wall.addEventListener('click', e => {
      const heartBtn = e.target.closest('.note-heart');
      const delBtn = e.target.closest('.note-del');
      if (heartBtn) {
        const id = heartBtn.dataset.id;
        const liked = likedSet();
        const m = messages.find(x => x.id === id);
        if (!m) return;
        if (liked.has(id)) { liked.delete(id); m.hearts = Math.max(0, m.hearts - 1); }
        else { liked.add(id); m.hearts++; }
        saveLiked(liked);
        saveMessages(messages);
        draw();
      }
      if (delBtn) {
        if (!confirm('确定要撕掉这张便签吗？')) return;
        messages = messages.filter(x => x.id !== delBtn.dataset.id);
        saveMessages(messages);
        draw();
      }
    });

    /* 表单 */
    const form = $('#boardForm'), nameInput = $('#msgName'), textInput = $('#msgText');
    const counter = $('#charCount');
    textInput.addEventListener('input', () => counter.textContent = textInput.value.length);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = textInput.value.trim();
      if (!text) {
        textInput.classList.add('input-error');
        textInput.focus();
        showToast('写点什么再贴上来嘛 🥺');
        return;
      }
      textInput.classList.remove('input-error');
      const now = new Date();
      const ts = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
      messages.unshift({
        id: String(Date.now()),
        name: nameInput.value.trim() || '匿名的小可爱',
        text: text.slice(0, 200),
        ts,
        hearts: 0,
      });
      saveMessages(messages);
      draw();
      form.reset();
      counter.textContent = '0';
      showToast('贴好啦 ❤');
      wall.firstElementChild?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });

    draw();
  })();

  /* ============================================================
     5. 导航：滚动态 / 移动端菜单 / 当前版块高亮
     ============================================================ */
  const nav = $('#siteNav'), navToggle = $('#navToggle'), navMenu = $('#navMenu');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });
  navMenu.addEventListener('click', e => {
    if (e.target.closest('a')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  const sectionIds = ['hero', 'time', 'story', 'gallery', 'board'];
  const linkMap = new Map($$('.nav-link').map(a => [a.getAttribute('href').slice(1), a]));
  const secObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        linkMap.forEach(a => a.removeAttribute('aria-current'));
        linkMap.get(en.target.id)?.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sectionIds.forEach(id => { const el = document.getElementById(id); if (el) secObserver.observe(el); });

  /* ============================================================
     6. 滚动入场动画
     ============================================================ */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ============================================================
     7. 彩蛋：漂浮爱心 + 点击迸发
     ============================================================ */
  (function hearts() {
    const canvas = $('#heartsCanvas');
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    const hero = $('#hero');
    const COLORS = ['#B4485A', '#D06B7D', '#C2A05E', '#E8B4BC'];
    let W, H, DPR;
    const floaters = [];
    const bursts = [];
    const MAX_FLOAT = 26;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function drawHeart(x, y, size, rot, color, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(size, size);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 0.32);
      ctx.bezierCurveTo(-0.58, -0.08, -0.36, -0.62, 0, -0.26);
      ctx.bezierCurveTo(0.36, -0.62, 0.58, -0.08, 0, 0.32);
      ctx.fill();
      ctx.restore();
    }

    function spawnFloater(randomY) {
      floaters.push({
        x: Math.random() * W,
        y: randomY ? Math.random() * H : H + 20,
        size: 6 + Math.random() * 11,
        speed: 0.25 + Math.random() * 0.55,
        sway: 14 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        rot: (Math.random() - 0.5) * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.14 + Math.random() * 0.22,
      });
    }
    for (let i = 0; i < MAX_FLOAT; i++) spawnFloater(true);

    function burst(x, y) {
      for (let i = 0; i < 10; i++) {
        const ang = Math.random() * Math.PI * 2;
        const v = 1.2 + Math.random() * 2.4;
        bursts.push({
          x, y,
          vx: Math.cos(ang) * v,
          vy: Math.sin(ang) * v - 1.4,
          size: 4 + Math.random() * 8,
          rot: (Math.random() - .5) * 1.2,
          vr: (Math.random() - .5) * .12,
          life: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    let running = true;
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(loop);
    });

    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() / 1000;

      for (let i = floaters.length - 1; i >= 0; i--) {
        const f = floaters[i];
        f.y -= f.speed;
        const x = f.x + Math.sin(t * 0.9 + f.phase) * f.sway * 0.16;
        drawHeart(x, f.y, f.size, f.rot + Math.sin(t + f.phase) * 0.12, f.color, f.alpha);
        if (f.y < -30) {
          floaters.splice(i, 1);
          spawnFloater(false);
        }
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx; b.y += b.vy;
        b.vy += 0.05; b.rot += b.vr; b.life -= 0.02;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        drawHeart(b.x, b.y, b.size, b.rot, b.color, Math.max(0, b.life) * 0.85);
      }

      if (floaters.length < MAX_FLOAT && Math.random() < 0.06) spawnFloater(false);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    hero.addEventListener('click', e => {
      if (e.target.closest('a, button')) return;
      const rect = hero.getBoundingClientRect();
      burst(e.clientX - rect.left, e.clientY - rect.top);
    });
  })();

  /* logo 上的小红心：点一下全是爱 */
  document.addEventListener('click', e => {
    const heart = e.target.closest('#logoHeart');
    if (!heart) return;
    const rect = heart.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.textContent = '❤';
      s.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;
        pointer-events:none;z-index:999;font-size:${10 + Math.random() * 12}px;color:var(--rose);
        transition:transform 1s ease-out,opacity 1s ease-out;will-change:transform,opacity;`;
      document.body.appendChild(s);
      const dx = (Math.random() - .5) * 120, dy = -(60 + Math.random() * 90);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() - .5) * 90}deg)`;
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 1100);
    }
    showToast('爱你哟 ❤');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'logoHeart') e.target.click();
  });
})();
