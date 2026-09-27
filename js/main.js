'use strict';
// Boot, input, the main loop, saving, and the title desk.
const SAVE_KEY = 'seedkeeper_save_v1', SET_KEY = 'seedkeeper_settings_v1';

const G = {
  version: '0.22.103',
  // demo: a practice game from the teacher's picker (or a ?ders / ?numune link) that is never written to the save
  S: null, mode: 'boot', t: 0, frame: 0, busy: false, reduceMotion: false, demo: false,
  dpr: 1, vw: 0, vh: 0, cw: 0, ch: 0,
  keys: {}, mouse: { x: 0, y: 0, active: false }, pointer: 'mouse',
  set: { lang: 'tr', music: 0.55, sfx: 0.8, text: 1, motion: false, conf: true, tts: false, board: false, think: 0, vivid: false },

  init() {
    let saved = null;
    try { saved = localStorage.getItem(SET_KEY); Object.assign(this.set, JSON.parse(saved || '{}')); } catch (e) { }
    const q = new URLSearchParams(location.search);
    // first run on a big touch screen (a classroom smartboard): large targets and a short thinking pause for the class
    const touchy = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0;
    if (!saved && touchy && Math.max(screen.width, screen.height) >= 1200) Object.assign(this.set, { board: true, think: 10 });
    if (q.get('tahta') != null) this.set.board = q.get('tahta') !== '0';
    if (touchy) this.pointer = 'touch';
    I18N.lang = this.set.lang;
    this.cv = document.getElementById('game');
    this.ctx = this.cv.getContext('2d');
    this.applySettings();
    UI.init();
    W.init();
    this.resize();
    window.addEventListener('resize', () => { this.resize(); if (UI.hud) UI.fitHud(); });
    this.bindInput();
    if (q.get('selftest')) { const s = document.createElement('script'); s.src = 'js/selftest.js'; document.body.appendChild(s); }
    else if (q.get('ders')) this.lesson(q.get('ders'));
    else if (q.get('numune')) this.specimen(q.get('numune'));
    else if (q.get('gorunumler')) {
      // a teacher's saved views, carried by link: they join this computer's list and the first one opens
      this.specimen(null);
      const vs = STUDY.importViews(q.get('gorunumler'));
      if (vs.length) setTimeout(() => { STUDY._viewGo(vs[0]); UI.toast(T('st_views_in', { n: vs.length }), '★'); }, 300);
    }
    else if (q.get('yaris') != null) { this.specimen(null); setTimeout(() => RACE.open(), 300); }
    else if (q.get('vadi') != null) this.specimen(null);   // a practice valley, straight in: no intro, never saved
    else if (q.get('start')) this.newGame('', 0);
    else TITLE.show();
    let last = performance.now();
    const loop = now => {
      const dt = U.clamp((now - last) / 1000, 0, 0.05); last = now;
      try { this.step(dt); } catch (e) { reportError(e); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    setInterval(() => { if (this.mode === 'play' && !this.busy) this.save(); }, 20000);
  },
  step(dt) {
    this.t += dt; this.frame++;
    INK.frame();
    if (this.mode === 'play') {
      this.S.played = (this.S.played || 0) + dt;
      // the specimen table covers the whole screen, so the valley rests while it is open
      if (STUDY.on) STUDY.frame(dt);
      else { W.update(dt); LENS.update(dt); Q.update(dt); UI.frame(); W.render(this.ctx); }
      document.body.dataset.booted = '1';
      if (this.joyEl) { const on = !STUDY.on && !UI.modal && !this.busy && !LENS.on; this.joyEl.classList.toggle('show', on); if (!on) this.joy = null; }
    } else if (this.mode === 'ride') { RIDE.update(dt); RIDE.draw(this.ctx); }
    else if (this.mode === 'title') { TITLE.frame(dt); document.body.dataset.booted = '1'; }
  },
  resize() {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.vw = window.innerWidth; this.vh = window.innerHeight;
    this.cv.width = this.cw = Math.round(this.vw * this.dpr);
    this.cv.height = this.ch = Math.round(this.vh * this.dpr);
    ART.setScale(CAM.z * this.dpr);
    if (this.mode === 'title') TITLE.paint();
    STUDY.resize();
  },
  bindInput() {
    const cv = this.cv;
    window.addEventListener('keydown', e => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName) && e.target.offsetParent !== null) return;
      AU.unlock();
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      this.keys[e.code] = true;
      if (e.repeat) return;
      if (this.mode === 'ride') { RIDE.key(e); return; }
      if (this.mode !== 'play') { if (UI.top()) UI.key(e); return; }
      if (UI.key(e)) return;
      if (this.busy) return;
      switch (e.code) {
        case 'KeyL': LENS.toggle(); break;
        case 'KeyJ': UI.journal(); break;
        case 'KeyM': UI.journal('map'); break;
        case 'Escape': if (LENS.on) LENS.toggle(false); else UI.settings(); break;
        case 'KeyE': case 'Space': case 'Enter': if (LENS.on) LENS.openStudy(); else W.interact(); break;
        case 'KeyZ': LENS.wheel(-1); break;
        case 'KeyX': LENS.wheel(1); break;
      }
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; });
    // one pointer path for mouse, pen, touch screens and IR smartboard frames
    const pos = e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; };
    cv.style.touchAction = 'none';
    cv.addEventListener('pointermove', e => {
      this.pointer = e.pointerType || 'mouse';
      if (this.pointer === 'mouse' || e.buttons) { pos(e); this.mouse.active = true; }
    });
    cv.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') this.mouse.active = false; });
    cv.addEventListener('pointerdown', e => {
      AU.unlock();
      if (!e.isPrimary) return;
      this.pointer = e.pointerType || 'mouse';
      const touch = this.pointer !== 'mouse';
      pos(e); this.mouse.active = true;
      if (this.mode !== 'play' || (!touch && e.button !== 0)) return;
      if (UI.modal || this.busy) { if (UI._dlgOpen && !UI.top()) UI.advance(); return; }
      if (LENS.click(e.clientX, e.clientY, touch)) return;
      const [wx, wy] = W.toWorld(e.clientX, e.clientY);
      if (!W.spotAt(wx, wy)) W.clickWorld(wx, wy);
    });
    // right-click still toggles the lens with a mouse; a long press on a smartboard must never open a browser menu
    window.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (e.target === cv && this.pointer === 'mouse' && this.mode === 'play' && !UI.modal && !this.busy) LENS.toggle();
    });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      if (this.mode !== 'play' || UI.modal) return;
      if (LENS.on) { LENS.wheel(e.deltaY > 0 ? 1 : -1); return; }
      CAM.z = U.clamp(CAM.z * (e.deltaY > 0 ? 0.92 : 1.08), 0.7, 1.8);
      ART.setScale(CAM.z * this.dpr);
    }, { passive: false });
    // pinch-zoom and double-tap zoom would shove the whole page around on a board
    document.addEventListener('gesturestart', e => e.preventDefault());
    document.addEventListener('dblclick', e => e.preventDefault());
    // virtual joystick for phones/tablets (tap-to-walk still works everywhere)
    this.joy = null;
    if (matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 900) {
      const el = this.joyEl = document.createElement('div'), k = document.createElement('i');
      el.className = 'joy'; el.appendChild(k); document.body.appendChild(el);
      let id = null;
      const mv = e => {
        const r = el.getBoundingClientRect(), R = r.width / 2;
        let x = (e.clientX - r.left - R) / R, y = (e.clientY - r.top - R) / R;
        const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
        k.style.transform = `translate(${x * R * 0.6}px, ${y * R * 0.6}px)`;
        this.joy = l < 0.2 ? null : { x, y };
      };
      const up = e => { if (e.pointerId !== id) return; id = null; this.joy = null; k.style.transform = ''; };
      el.addEventListener('pointerdown', e => { AU.unlock(); id = e.pointerId; el.setPointerCapture(id); mv(e); e.preventDefault(); });
      el.addEventListener('pointermove', e => { if (e.pointerId === id) mv(e); });
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    }
  },
  fullscreen() {
    const d = document;
    try { if (d.fullscreenElement) d.exitFullscreen(); else d.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => { }); } catch (e) { }
  },

  // ---------------- game state ----------------
  newGame(name, look, quiet, demo) {
    this.demo = !!demo;
    this.S = SIM.newState(name, look);
    this.S.settings = null;
    W.player.look = PEOPLE.player[look] || PEOPLE.player[0];
    this.S.player = [2420, 1425];
    Q.applyWorld();
    this.enterPlay();
    if (!quiet) Q.begin();
  },
  load() {
    try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (!s || s.v !== 1) return false; this.S = s; } catch (e) { return false; }
    this.demo = false;
    const J = this.S.journal; J.reviews = J.reviews || {}; J.seen = J.seen || {};
    for (const r of Object.values(J.obs)) if (r.spec) J.seen[r.spec] = 1;
    W.player.look = PEOPLE.player[this.S.look] || PEOPLE.player[0];
    Q.applyWorld();
    this.enterPlay();
    SYNC.start();
    return true;
  },
  hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } },
  save() {
    if (!this.S || this.demo) return;
    this.S.player = [Math.round(W.player.x), Math.round(W.player.y)];
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.S)); } catch (e) { }
    SYNC.touch();
  },
  wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } location.href = location.pathname; },
  enterPlay() {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    TITLE.hide();
    this.mode = 'play';
    ART.invalidate();
    UI.showHud(true); UI.relabel(); UI.lensHud(); DEMO.tag();
    AU.music('world');
  },
  toTitle() { if (STUDY.on) STUDY.close(); this.save(); LENS.on = false; UI.showHud(false); UI.hideDlg(); this.mode = 'title'; TITLE.show(); },
  // teacher lesson mode: ?ders=bloat opens that case straight away
  lesson(id) {
    this.newGame('', 0, true, true);
    if (!CASES[id] || id === 'intro') { Q.begin(); return; }
    const S = this.S;
    S.flags.letterRead = S.flags.gotLens = S.flags.gotJournal = S.flags.lesson = true;
    S.cases.intro = { step: 3, done: true };
    // the nail comes after the bloat: Sarıkız is already treated and grazing in the grass paddock
    if (id === 'hardware' || id === 'owl') { S.flags.cowTreated = S.flags.cowMoved = true; Q.applyWorld(); }
    Q.open(id);
    if (id === 'mendel') { give('pea_round'); give('pea_wrinkled'); }
    // the festival from a teacher link: skip the invitation letter, Grandma is already in the square
    if (id === 'festival') { Q.adv('festival'); Q._festWorld(); }
    const r = WORLD.regions[CASES[id].region];
    W.waypoint = S.waypoint = { x: r.x, y: r.y };
    // the lesson starts beside the case's first person or thing, not after a long walk across the valley
    const near = DEMO.START[id];
    if (near) { [W.player.x, W.player.y] = W.freeSpot(near[0], near[1]); CAM.x = W.player.x; CAM.y = W.player.y; W.waypoint = S.waypoint = null; }
    this.busy = false;
    UI.hideDlg();
  },
  // teacher shortcut: ?numune=cow opens straight onto that specimen's table, ready to project
  specimen(id) {
    this.newGame('', 0, true, true);
    const S = this.S;
    S.flags.letterRead = S.flags.gotLens = S.flags.gotJournal = S.flags.lesson = true;
    S.cases.intro = { step: 3, done: true };
    this.busy = false; UI.hideDlg();
    if (id && SPECS[id]) setTimeout(() => STUDY.open({ spec: id }, 0), 300);
  },
  setLang(l) { I18N.lang = this.set.lang = l; ART.invalidate(); UI.relabel(); UI.lensHud(); this.saveSettings(); if (this.mode === 'title') TITLE.menu(); },
  applySettings() {
    this.reduceMotion = !!this.set.motion;
    document.documentElement.style.setProperty('--ts', this.set.text);
    document.documentElement.classList.toggle('reduce-motion', this.reduceMotion);
    document.documentElement.classList.toggle('board', !!this.set.board);
    // a projector in a lit classroom washes colours out: the pictures (never the text) get more contrast and colour
    document.documentElement.classList.toggle('vivid', !!this.set.vivid);
    if (typeof UI !== 'undefined' && UI.hud) UI.fitHud();
    // on a board the valley is drawn a little closer so it reads from the back of the room
    const z = this.set.board ? 1.25 : 1;
    if (this._boardZ !== z) { this._boardZ = z; CAM.z = z; if (this.cw) ART.setScale(CAM.z * this.dpr); }
    AU.vol.music = this.set.music; AU.vol.sfx = this.set.sfx;
    if (AU.ok) AU.setVol();
  },
  saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(this.set)); } catch (e) { } },
};

// ---------------------------------------------------------------- error collector (read by tools/smoke.js)
function reportError(e) {
  console.error(e);
  let pre = document.getElementById('boot-errors');
  if (!pre) { pre = document.createElement('pre'); pre.id = 'boot-errors'; pre.hidden = true; document.body.appendChild(pre); }
  pre.textContent += (e && e.stack ? e.stack : String(e)) + '\n';
}
window.addEventListener('error', e => reportError(e.error || e.message));
window.addEventListener('unhandledrejection', e => reportError(e.reason));

// ---------------------------------------------------------------- title: grandma's desk
const TITLE = {
  el: null, base: null, started: false,
  show() {
    G.mode = 'title';
    if (!this.el) {
      this.el = h('div', 'title');
      this.el.innerHTML = `<canvas class="desk"></canvas><div class="tabs"></div><div class="lang-tag"></div><div class="tap hand"></div><div class="credit"></div><div class="chooser hidden"></div>`;
      document.getElementById('ui').appendChild(this.el);
      this.el.querySelector('.tap').onclick = () => this.begin();
      this.el.querySelector('.desk').onclick = () => { if (!this.started) this.begin(); };
    }
    this.el.classList.remove('hidden');
    this.paint(); this.menu();
    if (this.started) AU.music('title');
  },
  hide() { if (this.el) this.el.classList.add('hidden'); },
  begin() {
    if (this.started) return;
    this.started = true;
    AU.unlock(); AU.music('title'); AU.sfx('page');
    this.el.classList.add('open');
    this.menu();
  },
  menu() {
    if (!this.el) return;
    const tabs = this.el.querySelector('.tabs'), J = this.J;
    this.el.querySelector('.tap').textContent = T('click_start');
    this.el.querySelector('.credit').innerHTML = `Erasmus+ · ${L({ tr: 'Oyunlaştırma ile biyoloji', en: 'Biology through gamification' })} · ${L({ tr: 'Hazırlayan', en: 'Made by' })} <b>Alp</b> · Denizli · v${G.version}`;
    const lt = this.el.querySelector('.lang-tag');
    lt.innerHTML = `<button data-l="tr" class="${I18N.lang === 'tr' ? 'on' : ''}">TR</button><span>|</span><button data-l="en" class="${I18N.lang === 'en' ? 'on' : ''}">EN</button>`;
    lt.querySelectorAll('button').forEach(b => b.onclick = () => { AU.sfx('click'); G.setLang(b.dataset.l); this.paint(); });
    if (J) Object.assign(tabs.style, { left: (J.x + J.w - 4) + 'px', top: (J.y + J.h * 0.16) + 'px' });
    const items = [['new', T('new_game')]];
    if (G.hasSave()) items.unshift(['cont', T('continue')]);
    items.push(['demo', T('demo_menu')], ['set', T('settings')]);
    tabs.innerHTML = items.map(([k, t], i) => `<button data-k="${k}" style="--i:${i}">${U.esc(t)}</button>`).join('');
    tabs.querySelectorAll('button').forEach(b => {
      b.onmouseenter = () => AU.sfx('hover');
      b.onclick = () => {
        AU.sfx('page');
        const k = b.dataset.k;
        if (k === 'cont') { if (!G.load()) this.menu(); }
        if (k === 'new') this.chooser();
        if (k === 'demo') DEMO.open();
        if (k === 'set') UI.settings();
      };
    });
  },
  chooser() {
    const c = this.el.querySelector('.chooser');
    let look = 0;
    c.innerHTML = `<div class="card paper"><h2>${T('who_are_you')}</h2><div class="looks">${[0, 1, 2, 3].map(i => `<button data-i="${i}" class="${i ? '' : 'on'}"><canvas width="120" height="120"></canvas></button>`).join('')}</div>
      <label class="nick"><span>${T('nickname')}</span><input class="nm" maxlength="16" autocomplete="off" spellcheck="false"></label>
      ${SYNC.url() ? `<label class="nick cls"><span>${U.esc(L(tr('Sınıf kodu (öğretmeninden)', 'Class code (from your teacher)')))}</span><input class="cl" maxlength="24" autocomplete="off" spellcheck="false" placeholder="10A-K7P2" value="${U.esc(SYNC.fromLink() || SYNC.remembered())}"></label>` : ''}
      <div class="card-foot"><button class="back">${T('back')}</button><button class="yes go">${T('begin')} →</button></div></div>`;
    c.querySelectorAll('.looks button').forEach(b => {
      ACT.portrait(b.querySelector('canvas'), +b.dataset.i);
      b.onclick = () => { look = +b.dataset.i; AU.sfx('pen'); c.querySelectorAll('.looks button').forEach(x => x.classList.toggle('on', x === b)); };
    });
    c.querySelector('.back').onclick = () => { AU.sfx('click'); c.classList.add('hidden'); };
    c.querySelector('.go').onclick = () => {
      const name = c.querySelector('input.nm').value.trim().slice(0, 16), cl = c.querySelector('input.cl');
      const cls = cl ? cl.value : '';
      // in a class the teacher needs something to tell students apart by
      if (SYNC.code(cls) && !name) { const nm = c.querySelector('input.nm'); nm.placeholder = L(tr('Sınıf için bir takma ad yaz', 'Type a nickname for the class')); nm.focus(); AU.sfx('wrong'); return; }
      AU.sfx('stamp');
      c.classList.add('hidden');
      UI.fade(() => { G.newGame(name, look); if (cls) SYNC.join(cls); }, 500);
    };
    c.classList.remove('hidden');
    setTimeout(() => c.querySelector('input.nm').focus(), 50);
  },

  // ---- painting ----
  paint() {
    if (!this.el) return;
    const cv = this.el.querySelector('.desk'), vw = G.vw, vh = G.vh, dpr = G.dpr;
    cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); cv.style.width = vw + 'px'; cv.style.height = vh + 'px';
    const b = this.base = U.canvas(cv.width, cv.height), x = b.getContext('2d');
    x.scale(dpr, dpr);
    const r = U.rng(7);
    // walnut planks
    const pw = 190;
    for (let px = -40, i = 0; px < vw + pw; px += pw, i++) {
      const col = ['#5C3B25', '#55361F', '#61402A', '#583922'][i % 4];
      x.fillStyle = col; x.fillRect(px, 0, pw, vh);
      x.strokeStyle = 'rgba(30,18,10,0.35)'; x.lineWidth = 1;
      for (let k = 0; k < 26; k++) {
        const ox = px + 6 + k * (pw - 12) / 26 + (r() - 0.5) * 4, ph = r() * 10;
        x.beginPath(); for (let y = 0; y <= vh; y += 12) x.lineTo(ox + Math.sin(y * 0.01 + ph) * 3 + Math.sin(y * 0.047 + k) * 1.2, y); x.stroke();
      }
      for (let k = 0; k < 2; k++) { const kx = px + 30 + r() * (pw - 60), ky = r() * vh; x.strokeStyle = 'rgba(30,18,10,0.45)'; for (let q = 1; q < 6; q++) { x.beginPath(); x.ellipse(kx, ky, q * 3.2, q * 9, 0, 0, TAU); x.stroke(); } }
      x.fillStyle = 'rgba(15,8,4,0.7)'; x.fillRect(px - 1.5, 0, 3, vh);
    }
    // journal
    const jw = Math.min(430, vw * 0.34), jh = jw * 1.34, jx = vw * 0.47 - jw * 0.62, jy = vh / 2 - jh / 2 + 6;
    this.J = { x: jx, y: jy, w: jw, h: jh };
    x.save(); x.translate(jx + jw / 2, jy + jh / 2); x.rotate(-0.025); x.translate(-jw / 2, -jh / 2);
    x.fillStyle = 'rgba(0,0,0,0.45)'; x.filter = 'blur(10px)'; x.fillRect(10, 16, jw, jh); x.filter = 'none';
    x.fillStyle = '#E9DFC6'; x.fillRect(jw - 8, 6, 10, jh - 12);
    for (let k = 0; k < 10; k++) { x.strokeStyle = 'rgba(120,100,70,0.35)'; x.beginPath(); x.moveTo(jw - 7 + k, 8); x.lineTo(jw - 7 + k, jh - 8); x.stroke(); }
    x.fillStyle = '#2F4A3A'; U.rr(x, 0, 0, jw, jh, 6); x.fill();
    x.strokeStyle = 'rgba(255,255,255,0.05)'; x.lineWidth = 1;
    for (let k = -jh; k < jw; k += 3) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + jh, jh); x.stroke(); }
    x.strokeStyle = 'rgba(0,0,0,0.08)'; for (let k = 0; k < jw + jh; k += 3) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k - jh, jh); x.stroke(); }
    x.fillStyle = '#243A2D'; x.fillRect(0, 0, 26, jh);
    x.fillStyle = '#6A4A30'; for (const [cx, cy, sx, sy] of [[jw, 0, -1, 1], [jw, jh, -1, -1]]) { x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + sx * 46, cy); x.lineTo(cx, cy + sy * 46); x.closePath(); x.fill(); }
    x.fillStyle = '#16120F'; x.fillRect(jw - 44, 0, 12, jh);
    x.strokeStyle = '#C9A55A'; x.lineWidth = 1.3; x.strokeRect(46, 34, jw - 110, jh - 68); x.strokeRect(51, 39, jw - 120, jh - 78);
    const gold = x.createLinearGradient(0, jh * 0.24, 0, jh * 0.34); gold.addColorStop(0, '#F1D98C'); gold.addColorStop(0.5, '#C9A04A'); gold.addColorStop(1, '#8E6A24');
    x.fillStyle = gold; x.textAlign = 'center';
    const tcx = 46 + (jw - 110) / 2;
    x.font = `700 ${Math.round(jw * 0.105)}px "Bodoni Moda", serif`;
    x.shadowColor = 'rgba(0,0,0,0.5)'; x.shadowOffsetY = 1.5;
    x.fillText(T('title'), tcx, jh * 0.3);
    x.font = `600 ${Math.round(jw * 0.036)}px "Courier Prime", monospace`;
    x.fillText(T('title_alt'), tcx, jh * 0.36);
    x.shadowColor = 'transparent';
    x.strokeStyle = '#C9A55A'; x.lineWidth = 1.2;
    const oy = jh * 0.5; x.beginPath(); x.moveTo(tcx - 60, oy); x.lineTo(tcx - 14, oy); x.moveTo(tcx + 14, oy); x.lineTo(tcx + 60, oy); x.stroke();
    x.save(); x.translate(tcx, oy); for (let k = 0; k < 6; k++) { x.rotate(TAU / 6); x.beginPath(); x.ellipse(0, -8, 3.2, 8, 0, 0, TAU); x.stroke(); } x.restore();
    x.fillStyle = gold; x.font = `italic 500 ${Math.round(jw * 0.04)}px "Bodoni Moda", serif`;
    this.wrapText(x, T('tagline'), tcx, jh * 0.62, jw - 150, jw * 0.055);
    x.font = `700 ${Math.round(jw * 0.032)}px "Courier Prime", monospace`;
    x.fillText('SAHA DEFTERİ · N. Y. · 1987 —', tcx, jh * 0.86);
    x.restore();
    // brass lens on the desk
    const lx = jx + jw + 150, ly = jy + jh * 0.78, lr = 58;
    x.save(); x.fillStyle = 'rgba(0,0,0,0.4)'; x.filter = 'blur(6px)'; x.beginPath(); x.arc(lx + 8, ly + 10, lr + 8, 0, TAU); x.fill(); x.fillRect(lx + 40, ly + 30, 120, 22); x.filter = 'none'; x.restore();
    x.save(); x.translate(lx, ly); x.rotate(0.6); x.fillStyle = '#4E3524'; U.rr(x, lr + 4, -9, 110, 18, 8); x.fill(); x.strokeStyle = '#1B1A17'; x.stroke(); x.fillStyle = '#C8A24E'; x.fillRect(lr - 4, -11, 14, 22); x.restore();
    const lg = x.createRadialGradient(lx - 20, ly - 22, 4, lx, ly, lr); lg.addColorStop(0, 'rgba(255,245,220,0.5)'); lg.addColorStop(1, 'rgba(140,100,60,0.15)');
    x.fillStyle = lg; x.beginPath(); x.arc(lx, ly, lr, 0, TAU); x.fill();
    const rg = x.createLinearGradient(lx - lr, ly - lr, lx + lr, ly + lr); rg.addColorStop(0, '#F0D78A'); rg.addColorStop(0.45, '#9A7428'); rg.addColorStop(0.7, '#DDB85C'); rg.addColorStop(1, '#6E5218');
    x.strokeStyle = rg; x.lineWidth = 10; x.beginPath(); x.arc(lx, ly, lr + 4, 0, TAU); x.stroke();
    x.strokeStyle = '#1B1A17'; x.lineWidth = 1.2; x.beginPath(); x.arc(lx, ly, lr - 1, 0, TAU); x.stroke(); x.beginPath(); x.arc(lx, ly, lr + 9, 0, TAU); x.stroke();
    // envelope with wax seal
    const ex = jx + jw + 90, ey = jy + 20, ew = 230, eh = 150;
    x.save(); x.translate(ex + ew / 2, ey + eh / 2); x.rotate(0.07); x.translate(-ew / 2, -eh / 2);
    x.fillStyle = 'rgba(0,0,0,0.35)'; x.filter = 'blur(6px)'; x.fillRect(6, 8, ew, eh); x.filter = 'none';
    x.fillStyle = '#EFE4CB'; x.fillRect(0, 0, ew, eh); x.strokeStyle = 'rgba(80,60,30,0.5)'; x.lineWidth = 1; x.strokeRect(0.5, 0.5, ew - 1, eh - 1);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(ew / 2, eh * 0.55); x.lineTo(ew, 0); x.stroke();
    x.fillStyle = '#9A2A22'; x.beginPath(); U.path(x, U.blob(ew / 2, eh * 0.55, 20, 18, 12, 0.12, 3), true); x.fill();
    x.fillStyle = '#7A1E18'; x.beginPath(); x.arc(ew / 2, eh * 0.55, 11, 0, TAU); x.fill();
    x.fillStyle = '#C8584A'; x.font = '700 12px "Bodoni Moda", serif'; x.textAlign = 'center'; x.fillText('N', ew / 2, eh * 0.55 + 4);
    x.fillStyle = '#2A2A5A'; x.font = '600 26px "Caveat", cursive'; x.textAlign = 'left'; x.fillText(L({ tr: 'Torunuma', en: 'For my grandchild' }), 22, eh - 20);
    x.fillStyle = '#B05A4A'; x.fillRect(ew - 58, 12, 44, 52); x.strokeStyle = '#EFE4CB'; x.setLineDash([2, 2]); x.strokeRect(ew - 56, 14, 40, 48); x.setLineDash([]);
    x.restore();
    // tea glass on its saucer
    const tx = jx - 110, ty = jy + 90;
    if (tx > 60) {
      x.fillStyle = 'rgba(0,0,0,0.35)'; x.beginPath(); x.ellipse(tx + 6, ty + 8, 52, 30, 0, 0, TAU); x.fill();
      x.fillStyle = '#F2EEE6'; x.beginPath(); x.ellipse(tx, ty, 50, 28, 0, 0, TAU); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.2; x.stroke();
      x.strokeStyle = '#A0322A'; x.lineWidth = 3; x.beginPath(); x.ellipse(tx, ty, 42, 22, 0, 0, TAU); x.stroke();
      x.fillStyle = '#B8561E'; x.beginPath(); x.ellipse(tx, ty - 2, 26, 15, 0, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(255,240,220,0.8)'; x.lineWidth = 2; x.beginPath(); x.ellipse(tx, ty - 2, 26, 15, 0, 0, TAU); x.stroke();
      x.fillStyle = 'rgba(255,220,160,0.5)'; x.beginPath(); x.ellipse(tx - 8, ty - 7, 8, 3, -0.3, 0, TAU); x.fill();
      this.tea = { x: tx, y: ty - 10 };
      // pencil
      x.save(); x.translate(tx - 10, jy + jh * 0.62); x.rotate(-1.1);
      x.fillStyle = '#E2B23A'; x.fillRect(-90, -6, 170, 12); x.strokeStyle = '#1B1A17'; x.lineWidth = 1; x.strokeRect(-90, -6, 170, 12);
      x.fillStyle = '#E8C8A0'; x.beginPath(); x.moveTo(80, -6); x.lineTo(104, 0); x.lineTo(80, 6); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = '#1B1A17'; x.beginPath(); x.moveTo(97, -2); x.lineTo(104, 0); x.lineTo(97, 2); x.fill();
      x.fillStyle = '#C86A6A'; x.fillRect(-100, -6, 12, 12); x.strokeRect(-100, -6, 12, 12);
      x.restore();
    } else this.tea = null;
    // seeds and a pressed flower
    for (let i = 0; i < 16; i++) { const sx = jx + jw * 0.2 + r() * 180, sy = jy + jh + 18 + r() * 40; x.fillStyle = U.pick(['#D9B45A', '#C9A04A', '#B98A4A'], r()); x.beginPath(); x.ellipse(sx, sy, 5, 2.6, r() * 3, 0, TAU); x.fill(); x.strokeStyle = 'rgba(0,0,0,0.4)'; x.lineWidth = 0.6; x.stroke(); }
    const fx = jx + jw + 60, fy = jy + jh - 30;
    x.strokeStyle = '#5E7A3A'; x.lineWidth = 2; x.beginPath(); x.moveTo(fx, fy + 60); x.quadraticCurveTo(fx + 10, fy + 20, fx + 4, fy - 10); x.stroke();
    for (let k = 0; k < 5; k++) { x.save(); x.translate(fx + 4, fy - 10); x.rotate(k / 5 * TAU); x.fillStyle = '#C87AA0'; x.globalAlpha = 0.8; x.beginPath(); x.ellipse(0, -10, 5, 10, 0, 0, TAU); x.fill(); x.restore(); }
    x.globalAlpha = 1;
    // lamp light and vignette
    const lamp = x.createRadialGradient(vw * 0.3, -vh * 0.15, 20, vw * 0.35, vh * 0.2, vw * 0.9);
    lamp.addColorStop(0, 'rgba(255,214,150,0.35)'); lamp.addColorStop(0.5, 'rgba(255,190,120,0.08)'); lamp.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = lamp; x.fillRect(0, 0, vw, vh);
    const vg = x.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * 0.35, vw / 2, vh / 2, Math.max(vw, vh) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.6)');
    x.fillStyle = vg; x.fillRect(0, 0, vw, vh);
    this.menu();
  },
  wrapText(x, text, cx, y, max, lh) {
    const words = text.split(' '); let line = '', yy = y;
    for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > max && line) { x.fillText(line, cx, yy); line = w; yy += lh; } else line = t; }
    if (line) x.fillText(line, cx, yy);
  },
  frame(dt) {
    if (!this.base || !this.el || this.el.classList.contains('hidden')) return;
    const cv = this.el.querySelector('.desk'), x = cv.getContext('2d'), dpr = G.dpr;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.drawImage(this.base, 0, 0);
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.tea && !G.reduceMotion) {
      for (let k = 0; k < 3; k++) {
        const ph = G.t * 0.6 + k * 2.1, a = 0.18 * (0.5 + 0.5 * Math.sin(ph));
        x.strokeStyle = `rgba(255,250,240,${a})`; x.lineWidth = 3;
        x.beginPath();
        for (let s = 0; s <= 20; s++) { const yy = this.tea.y - s * 4, xx = this.tea.x - 8 + k * 8 + Math.sin(s * 0.35 + G.t * 1.5 + k) * (3 + s * 0.4); s ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }
        x.stroke();
      }
    }
    const fl = 0.03 * Math.sin(G.t * 7) * Math.sin(G.t * 2.3);
    if (fl > 0) { x.fillStyle = `rgba(255,220,160,${fl})`; x.fillRect(0, 0, G.vw, G.vh); }
  },
};

// boot once the fonts are in (canvas text needs them)
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  const fams = ['700 20px "Bodoni Moda"', '600 20px "Atkinson Hyperlegible Next"', '700 20px "Courier Prime"', '600 20px "Caveat"'];
  return Promise.all(fams.map(f => document.fonts.load(f, 'ığüşöçİĞÜŞÖÇ').catch(() => null)));
}).then(() => { try { G.init(); } catch (e) { reportError(e); } });
