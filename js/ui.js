'use strict';
// DOM interface: HUD, dialogue, question cards, the journal, settings, the title desk and season postcards.
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

const ICON = {
  clock: '<svg viewBox="0 0 32 32"><circle cx="16" cy="18" r="10.5"/><path d="M16 12v6.5l4.2 2.8M12.5 3.8h7M16 3.8v3.7M25.2 8.6l1.9-1.9"/></svg>',
  lens: '<svg viewBox="0 0 32 32"><circle cx="13" cy="13" r="8.5"/><path d="M19.4 19.6l8.2 7.9"/><path d="M8.6 11.2c.7-2 2.3-3.2 4.3-3.4"/></svg>',
  journal: '<svg viewBox="0 0 32 32"><path d="M6.2 5.4h16.6a3.2 3.2 0 0 1 3.2 3.2v18.2H9.4a3.2 3.2 0 0 1-3.2-3.2z"/><path d="M6.2 23.4a3.1 3.1 0 0 1 3.1-3h16.6"/><path d="M11 10.2h10.2M11 14.1h6.8"/></svg>',
  map: '<svg viewBox="0 0 32 32"><path d="M4.2 8.1l7.9-3 8 3 7.8-3v19.1l-7.8 3-8-3-7.9 3z"/><path d="M12.1 5.1v19M20.1 8.1v19"/></svg>',
  gear: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="4.2"/><path d="M16 3.8v4M16 24.2v4M3.8 16h4M24.2 16h4M7.4 7.4l2.8 2.8M21.8 21.8l2.8 2.8M7.4 24.6l2.8-2.8M21.8 10.2l2.8-2.8"/></svg>',
  speaker: '<svg viewBox="0 0 32 32"><path d="M5 12.5h5l7-6v19l-7-6H5z"/><path d="M21.5 11.5c1.7 2.6 1.7 6.4 0 9M24.8 8.6c3.2 4.3 3.2 10.5 0 14.8"/></svg>',
  close: '<svg viewBox="0 0 32 32"><path d="M8.5 8.2l15.2 15.6M23.6 8.4L8.3 23.7"/></svg>',
  pin: '<svg viewBox="0 0 32 32"><path d="M16 28.5s-8.5-8.6-8.5-14.8a8.5 8.5 0 0 1 17 0C24.5 19.9 16 28.5 16 28.5z"/><circle cx="16" cy="13.6" r="3"/></svg>',
  back: '<svg viewBox="0 0 32 32"><path d="M19.5 7.5L10.8 16l8.7 8.5"/></svg>',
  quiz: '<svg viewBox="0 0 32 32"><path d="M7 5.5h18v21H7z"/><path d="M11.5 11.5l2 2 4-4M11.5 19.5l2 2 4-4M20 12h1.5M20 20h1.5"/></svg>',
  flask: '<svg viewBox="0 0 32 32"><path d="M12.4 4.6h7.2M13.6 4.6v8.3L6.4 25.2a2.2 2.2 0 0 0 1.9 3.3h15.4a2.2 2.2 0 0 0 1.9-3.3l-7.2-12.3V4.6"/><path d="M9.4 20.6h13.2"/><circle cx="14.2" cy="24.2" r="1.3"/><circle cx="18.6" cy="22.8" r="0.9"/></svg>',
  full: '<svg viewBox="0 0 32 32"><path d="M5.5 12V5.5H12M20 5.5h6.5V12M26.5 20v6.5H20M12 26.5H5.5V20"/></svg>',
  race: '<svg viewBox="0 0 32 32"><path d="M9.5 5.5h13v6.2a6.5 6.5 0 0 1-13 0z"/><path d="M9.5 8H5.8c0 3.4 1.6 5.2 4.4 5.6M22.5 8h3.7c0 3.4-1.6 5.2-4.4 5.6M16 18.2v4.6M11 26.5h10l-1.2-3.7h-7.6z"/></svg>',
};

const NAMES = {
  player: () => G.S && G.S.name ? G.S.name : L({ tr: 'Sen', en: 'You' }),
  nebahat: () => L({ tr: 'Nebahat Nine', en: 'Grandma Nebahat' }),
  narrator: () => '',
};
const speakerName = who => NAMES[who] ? NAMES[who]() : L(ACT.names[who] || { tr: who, en: who });

const UI = {
  modal: null, _stack: [], _dlgOpen: false, _toasts: [],

  init() {
    const R = this.root = document.getElementById('ui');
    // ------------ HUD
    this.hud = h('div', 'hud hidden');
    this.hud.innerHTML = `
      <div class="tag-season"><span class="ts-s"></span><span class="ts-y"></span></div>
      <div class="obj"><b></b><p></p></div>
      <nav class="hud-btns">
        <button data-a="lens">${ICON.lens}<span></span></button>
        <button data-a="journal">${ICON.journal}<span></span></button>
        <button data-a="map">${ICON.map}<span></span></button>
        <button data-a="demo">${ICON.flask}<span></span></button>
        <button data-a="settings">${ICON.gear}<span></span></button>
        <button data-a="race" class="only-board">${ICON.race}<span></span></button>
        <button data-a="timer" class="only-board">${ICON.clock}<span></span></button>
        <button data-a="full" class="only-board">${ICON.full}<span></span></button>
      </nav>
      <div class="prompt hidden"><kbd>E</kbd><span class="pv"></span> <span class="pl"></span></div>
      <button class="lensbar hidden">${ICON.lens}<span class="lb-t"></span><b class="lb-go"></b></button>`;
    R.appendChild(this.hud);
    this.hud.querySelector('.hud-btns').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { AU.sfx('click'); this.action(b.dataset.a); } });
    this.hud.querySelector('.prompt').addEventListener('click', () => W.interact());
    this.hud.querySelector('.lensbar').addEventListener('click', () => { if (!G.busy && !this.modal) LENS.openStudy(); });
    this.toastBox = h('div', 'toasts'); R.appendChild(this.toastBox);
    // ------------ dialogue
    this.dlg = h('div', 'dlg hidden');
    this.dlg.innerHTML = `<div class="dlg-card"><div class="dlg-face"><canvas width="240" height="240"></canvas><div class="dlg-name"></div></div><div class="dlg-body"><p class="dlg-text"></p><div class="dlg-opts"></div></div><button class="dlg-tts">${ICON.speaker}</button><button class="dlg-back" hidden>↶</button><div class="dlg-next">▼</div><div class="dlg-peek hidden"><div class="dlg-face"><canvas width="240" height="240"></canvas><div class="dlg-pname"></div></div><div class="dlg-body"><b class="dlg-ptag"></b><p class="dlg-ptext"></p></div></div></div>`;
    R.appendChild(this.dlg);
    this._said = [];
    this.dlg.addEventListener('click', e => {
      if (e.target.closest('.dlg-back')) { this.peek(1); return; }
      if (this._peekI) { this.peek(0); return; }
      if (e.target.closest('.dlg-tts')) { this.speak(this._dlgText, true); return; } if (e.target.closest('.dlg-opts')) return; this.advance();
    });
    // ------------ layers
    this.layer = h('div', 'layer'); R.appendChild(this.layer);
    this.fadeEl = h('div', 'fade'); R.appendChild(this.fadeEl);
    INK.init(R);
    this.relabel();
  },

  relabel() {
    const db = this.dlg && this.dlg.querySelector('.dlg-back');
    if (db) { db.setAttribute('aria-label', T('dlg_back')); db.title = T('dlg_back') + ' (PageUp)'; }
    const b = this.hud.querySelectorAll('.hud-btns button span');
    ['hud_lens', 'hud_journal', 'hud_map', 'hud_demo', 'hud_settings', 'hud_race', 'hud_timer', 'hud_full'].forEach((k, i) => { b[i].textContent = T(k); });
    if (typeof DEMO !== 'undefined' && G.S) DEMO.tag();
    this.hud.querySelector('.obj b').textContent = T('objective');
    this.dlg.querySelector('.dlg-tts').title = T('read_aloud');
    this._objTxt = null;
  },

  action(a) {
    if (G.busy && a !== 'settings') return;
    if (a === 'lens') LENS.toggle();
    if (a === 'journal') this.journal();
    if (a === 'map') this.journal('map');
    if (a === 'settings') this.settings();
    if (a === 'full') G.fullscreen();
    if (a === 'race') RACE.open();
    if (a === 'demo') DEMO.open();
    if (a === 'timer') this.timerPick();
  },

  // called every frame while playing
  frame() {
    const S = G.S;
    const sn = SEASON_NAMES()[S.season], ys = T('year_n', { n: S.year });
    if (this._seasonTxt !== sn + ys) { this._seasonTxt = sn + ys; this.hud.querySelector('.ts-s').textContent = sn; this.hud.querySelector('.ts-y').textContent = ys; this.hud.dataset.season = S.season; }
    const ot = Q.objectiveText() || T('no_objective');
    if (ot !== this._objTxt) { this._objTxt = ot; const p = this.hud.querySelector('.obj p'); p.textContent = ot; this.hud.querySelector('.obj').classList.remove('pop'); void p.offsetWidth; this.hud.querySelector('.obj').classList.add('pop'); }
    const it = !G.busy && !this.modal && !LENS.on ? W.hover : null, pr = this.hud.querySelector('.prompt');
    const key = it ? it.id + it.verb : '';
    if (key !== this._prKey) {
      this._prKey = key;
      pr.classList.toggle('hidden', !it);
      if (it) { pr.querySelector('.pv').textContent = T(it.verb); pr.querySelector('.pl').textContent = L(it.label); }
    }
    this.hud.classList.toggle('dim', !!G.busy);
    // the lens bar: what the lens is over, and a big button that opens the specimen table
    const tg = LENS.on ? LENS.target : null, sp = tg && SPECS[tg.spec], lk = LENS.on ? (sp ? tg.spec + LENS.level : 'none') : '';
    if (lk !== this._lbKey) {
      this._lbKey = lk;
      const lb = this.hud.querySelector('.lensbar');
      lb.classList.toggle('hidden', !LENS.on);
      lb.classList.toggle('ready', !!sp);
      lb.querySelector('.lb-t').textContent = sp ? L(sp.name) + ' · ' + L(sp.levels[LENS.level].tag) : T(G.pointer === 'mouse' ? 'lens_hint' : 'lens_hint_touch');
      lb.querySelector('.lb-go').textContent = sp ? T('st_open') + ' ▸' : '';
    }
  },
  showHud(v) { this.hud.classList.toggle('hidden', !v); if (v) this.fitHud(); },
  // on a board the top bar is a tall column of big buttons in the bottom-right corner; when the window is too short
  // for it (a 768-high board with the browser's own bars showing) it folds into two columns instead of running off the top
  fitHud(avail) {
    const col = this.hud && this.hud.querySelector('.hud-btns'); if (!col) return;
    col.classList.remove('two');
    if (!G.set.board) return;
    const bs = [...col.children].filter(b => b.offsetHeight), b0 = bs[0];
    if (!b0) return;
    const gap = parseFloat(getComputedStyle(col).rowGap) || 12, need = bs.length * b0.offsetHeight + (bs.length - 1) * gap + 36;
    col.classList.toggle('two', need > (avail || this.root.clientHeight || innerHeight));
  },
  lensHud() {
    this._lbKey = null;
    this.hud.querySelector('[data-a="lens"]').classList.toggle('on', LENS.on);
  },

  // ------------ toasts
  toast(text, icon = '•') {
    const el = h('div', 'toast', `<i>${U.esc(icon)}</i><span>${U.esc(text)}</span>`);
    this.toastBox.appendChild(el);
    this._toasts.push(el);
    while (this._toasts.length > 3) this._toasts.shift().remove();
    const life = 4200 + Math.min(3000, text.length * 30);
    setTimeout(() => el.classList.add('out'), life);
    setTimeout(() => { el.remove(); this._toasts = this._toasts.filter(e => e !== el); }, life + 700);
  },

  // ------------ modal stack
  _push(name, el) { this._stack.push({ name, el }); this.modal = name; this.layer.appendChild(el); requestAnimationFrame(() => el.classList.add('in')); },
  _pop(el) {
    const i = this._stack.findIndex(s => s.el === el);
    if (i >= 0) this._stack.splice(i, 1);
    this.modal = this._stack.length ? this._stack[this._stack.length - 1].name : (this._dlgOpen ? 'dlg' : null);
    el.classList.remove('in'); el.classList.add('out');
    setTimeout(() => el.remove(), 260);
  },
  top() { return this._stack[this._stack.length - 1]; },

  // ------------ dialogue
  say(who, text, opt = {}) {
    return new Promise(res => {
      clearTimeout(this._dlgClose);
      this.peek(0);
      const face = this.dlg.querySelector('.dlg-face'), cv = face.querySelector('canvas');
      const hasFace = this._hasFace(who);
      face.classList.toggle('hidden', !hasFace);
      if (hasFace) ACT.portrait(cv, who);
      this.dlg.querySelector('.dlg-name').textContent = speakerName(who);
      this.dlg.classList.toggle('narr', who === 'narrator');
      this.dlg.classList.remove('hidden');
      this._dlgOpen = true; if (!this._stack.length) this.modal = 'dlg';
      const opts = this.dlg.querySelector('.dlg-opts'); opts.innerHTML = '';
      this._dlgText = L(text);
      this._said.push({ who, text: this._dlgText }); if (this._said.length > 12) this._said.shift();
      this.dlg.querySelector('.dlg-back').hidden = this._said.length < 2;
      this._type(this._dlgText);
      if (G.set.tts) this.speak(this._dlgText);
      const done = v => { this._dlgNext = null; if (!opt.keep) this._dlgClose = setTimeout(() => this.hideDlg(), 90); res(v); };
      if (opt.options) {
        const show = () => {
          opt.options.forEach((o, i) => {
            const b = h('button', 'opt', `<kbd>${i + 1}</kbd>${U.esc(L(o))}`);
            b.onclick = e => { e.stopPropagation(); AU.sfx('pen'); done(i); };
            opts.appendChild(b);
          });
          this._opts = opt.options.length;
        };
        this._afterType = show;
        this._dlgNext = null;
        this.dlg.classList.add('choosing');
      } else {
        this._opts = 0; this._afterType = null;
        this.dlg.classList.remove('choosing');
        this._dlgNext = () => done();
      }
      this._optPick = i => { const b = opts.querySelectorAll('button')[i]; if (b) b.click(); };
    });
  },
  choose(who, text, options) { return this.say(who, text, { options }); },
  async talk(lines) { for (const [who, text] of lines) await this.say(who, text); },
  _hasFace(who) { return who !== 'narrator' && !!(who === 'player' || PEOPLE[who] || ['sarikiz', 'karabas', 'nebahat'].includes(who)); },
  // ↶ in the dialogue, or the clicker's back key: the lines said before (the last eleven), one further back a press,
  // laid over the current line, which waits untouched. A tap on the card or the forward key comes back to it without
  // moving on: for the pupil who missed what Rıza just said
  peek(step) {
    const pk = this.dlg.querySelector('.dlg-peek'), n = this._said.length;
    const i = step ? Math.min((this._peekI || 0) + 1, n - 1) : 0;
    if (step && i === this._peekI) return;
    this._peekI = i; pk.classList.toggle('hidden', !i); this.dlg.classList.toggle('peeking', !!i);
    if (!i) return;
    AU.sfx('page');
    const l = this._said[n - 1 - i], face = pk.querySelector('.dlg-face'), f = this._hasFace(l.who);
    face.classList.toggle('hidden', !f); pk.classList.toggle('narr', l.who === 'narrator');
    if (f) ACT.portrait(face.querySelector('canvas'), l.who);
    pk.querySelector('.dlg-pname').textContent = l.who === 'narrator' ? '' : speakerName(l.who);
    pk.querySelector('.dlg-ptag').textContent = T('dlg_back_tag').replace('{n}', i);
    pk.querySelector('.dlg-ptext').textContent = l.text;
  },
  hideDlg() { this.peek(0); this.dlg.classList.add('hidden'); this._dlgOpen = false; if (!this._stack.length) this.modal = null; if (window.speechSynthesis) speechSynthesis.cancel(); },
  _type(s) {
    const el = this.dlg.querySelector('.dlg-text');
    el.textContent = '';
    this._typing = true; this._full = s;
    const cps = G.reduceMotion ? 1e9 : 55;
    const t0 = performance.now();
    const step = () => {
      if (!this._typing || this._full !== s) return;
      const n = Math.min(s.length, Math.floor((performance.now() - t0) / 1000 * cps));
      el.textContent = s.slice(0, n);
      if (n >= s.length) { this._finishType(); return; }
      requestAnimationFrame(step);
    };
    step();
  },
  _finishType() {
    this._typing = false;
    this.dlg.querySelector('.dlg-text').textContent = this._full;
    this.dlg.classList.add('ready');
    if (this._afterType) { const f = this._afterType; this._afterType = null; f(); }
  },
  advance() {
    if (this._typing) { this._finishType(); return; }
    if (this._dlgNext) { this.dlg.classList.remove('ready'); AU.sfx('page'); this._dlgNext(); }
  },
  speak(text, force) {
    if (!window.speechSynthesis || (!force && !G.set.tts)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[“”"]/g, ''));
    u.lang = I18N.lang === 'tr' ? 'tr-TR' : 'en-GB'; u.rate = 0.97;
    const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith(I18N.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  },

  // ------------ class timer (smart board): a big countdown above everything, for "two minutes to draw what you see".
  // It floats over the valley, the benches and the specimen table alike, and rings when the time is up
  // ------------ draw a name (smart board): the class list is typed once and kept on this computer only; a name is drawn
  // at random, and nobody comes up again until everyone has
  KURA_KEY: 'seedkeeper-names', _drawn: new Set(),
  _names() { try { return [...new Set((localStorage.getItem(this.KURA_KEY) || '').split('\n').map(s => s.trim()).filter(Boolean))]; } catch (e) { return []; } },
  _kuraNext(names) {
    let pool = names.filter(n => !this._drawn.has(n));
    if (!pool.length) { this._drawn.clear(); pool = names.slice(); }
    const n = pool[Math.floor(Math.random() * pool.length)];
    this._drawn.add(n);
    return n;
  },
  kura() {
    const names = this._names(); if (!names.length) return;
    const pick = this._kuraNext(names), el = h('div', 'kura');
    el.innerHTML = `<small>${T('ku_title')}</small><b></b><p class="ku-left"></p>`;
    document.body.appendChild(el);
    const b = el.querySelector('b');
    let delay = G.reduceMotion ? 999 : 45;
    const spin = () => {
      if (!el.isConnected) return;
      if (delay > 380) {
        b.textContent = pick; el.classList.add('done'); AU.sfx('success');
        el.querySelector('.ku-left').textContent = T('ku_left', { a: names.length - this._drawn.size, b: names.length });
        return;
      }
      b.textContent = names[Math.floor(Math.random() * names.length)]; AU.sfx('click');
      delay *= 1.17; setTimeout(spin, delay);
    };
    spin();
    el.onclick = () => el.remove();
  },
  timerPick() {
    const el = h('div', 'modal timerpick');
    el.innerHTML = `<div class="card paper"><h3>${T('tm_title')}</h3><p class="sub">${T('tm_sub')}</p>
      <div class="tm-opts">${[1, 2, 3, 5, 10].map(m => `<button data-m="${m}"><b>${m}</b><small>${T('tm_min')}</small></button>`).join('')}</div>
      <h3 class="ku-h">${T('ku_title')}</h3><p class="sub">${T('ku_sub')}</p>
      <textarea class="ku-names" rows="5" placeholder="${U.esc(T('ku_ph'))}">${U.esc(this._names().join('\n'))}</textarea>
      <div class="ku-row"><button class="ku-go">${T('ku_go')}</button><small class="ku-info"></small></div>
      <div class="card-foot"><button class="cancel">${T('cancel')}</button></div></div>`;
    const ta = el.querySelector('.ku-names'), go = el.querySelector('.ku-go');
    const sync = () => { try { localStorage.setItem(this.KURA_KEY, ta.value); } catch (e) { } const n = this._names().length; go.disabled = !n; el.querySelector('.ku-info').textContent = n ? T('ku_left', { a: this._names().filter(x => !this._drawn.has(x)).length || n, b: n }) : ''; };
    ta.oninput = sync; sync();
    go.onclick = () => { sync(); if (!this._names().length) return; AU.sfx('click'); this._pop(el); this.kura(); };
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { AU.sfx('click'); this._pop(el); this.timer(+b.dataset.m * 60); });
    el.querySelector('.cancel').onclick = () => { AU.sfx('click'); this._pop(el); };
    el._key = e => { if (e.code === 'Escape') this._pop(el); };
    this._push('timerpick', el);
  },
  timer(sec) {
    this.timerStop();
    const el = this._tm = h('div', 'class-timer');
    el.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="tb" cx="50" cy="50" r="44"/><circle class="tf" cx="50" cy="50" r="44"/></svg><b class="tt" role="timer"></b>
      <div class="tm-b"><button data-t="p" aria-label="${U.esc(T('tm_pause'))}">❚❚</button><button data-t="a">+30</button><button data-t="x" aria-label="${U.esc(T('close'))}">×</button></div>`;
    document.body.appendChild(el);
    this._tmS = { total: sec, left: sec, run: true, last: performance.now(), done: false };
    el.querySelector('[data-t=p]').onclick = e => { e.stopPropagation(); const s = this._tmS; s.run = !s.run; s.last = performance.now(); e.currentTarget.textContent = s.run ? '❚❚' : '▶'; el.classList.toggle('paused', !s.run); AU.sfx('click'); };
    el.querySelector('[data-t=a]').onclick = e => { e.stopPropagation(); const s = this._tmS; s.left += 30; s.total = Math.max(s.total, s.left); if (s.done) { s.done = false; s.run = true; el.classList.remove('done'); } AU.sfx('click'); this._tmTick(); };
    el.querySelector('[data-t=x]').onclick = e => { e.stopPropagation(); AU.sfx('click'); this.timerStop(); };
    el.onclick = () => { if (this._tmS.done) this.timerStop(); };
    this._tmI = setInterval(() => this._tmTick(), 200);
    this._tmTick();
    AU.sfx('page');
  },
  _tmTick() {
    const el = this._tm, s = this._tmS; if (!el) return;
    const now = performance.now();
    if (s.run && !s.done) {
      s.left -= (now - s.last) / 1000;
      if (s.left <= 0) { s.left = 0; s.done = true; el.classList.add('done'); AU.sfx('chime'); setTimeout(() => AU.sfx('chime'), 450); setTimeout(() => AU.sfx('success'), 900); }
    }
    s.last = now;
    const n = Math.ceil(s.left);
    el.querySelector('.tt').textContent = s.done ? T('tm_done') : `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
    el.querySelector('.tf').style.strokeDashoffset = (276.46 * (1 - s.left / s.total)).toFixed(1);
    el.classList.toggle('last', !s.done && s.left <= 10);
  },
  timerStop() { clearInterval(this._tmI); if (this._tm) this._tm.remove(); this._tm = null; },

  // ------------ ✋ class vote (board mode), for any card of answer buttons: a tap counts one raised hand on an option,
  // "The class's answer" then clicks the top option for real, so the answer is recorded the normal way; a tie is left
  // to the class. The first count is kept (kit.tally) and goes to the teacher with the answer
  voteKit(box, fb) {
    if (!G.set.board) return null;
    const ans = [...box.querySelectorAll('.answers .ans')];
    ans.forEach(b => { b.insertAdjacentHTML('afterbegin', '<i class="vbar"></i>'); b.insertAdjacentHTML('beforeend', '<em class="vn"></em>'); });
    const row = h('div', 'vote', `<span class="vh hidden">${T('vote_hint')}</span><button class="vt">✋ <span>${T('vote_btn')}</span></button><button class="vu hidden" disabled>${T('vote_undo')}</button><b class="vtot"></b><button class="vr hidden">${T('vote_reset')}</button><button class="vgo hidden" disabled>${T('vote_go')} ▸</button>`);
    box.querySelector('.answers').after(row);
    // hist: the order the hands were counted in, so a slip of the finger can be taken back one hand at a time
    const kit = { votes: null, tally: null, row, hist: [] };
    const paint = () => {
      const mx = Math.max(1, ...kit.votes), sum = kit.votes.reduce((a, v) => a + v, 0);
      row.querySelector('.vtot').textContent = sum ? T('vote_total').replace('{n}', sum) : '';
      row.querySelector('.vu').disabled = !kit.hist.length;
      ans.forEach((b, i) => {
        b.style.setProperty('--v', Math.round(kit.votes[i] / mx * 100) + '%');
        b.querySelector('.vn').textContent = kit.votes[i] || '';
        b.classList.toggle('top', kit.votes[i] > 0 && kit.votes[i] === mx);
      });
      row.querySelector('.vgo').disabled = !kit.votes.some(v => v);
    };
    const mode = on => {
      kit.votes = on ? ans.map(() => 0) : null; kit.hist = [];
      box.classList.toggle('voting', on);
      if (on) box.classList.remove('voted');
      row.querySelector('.vt').classList.toggle('on', on);
      row.querySelector('.vt span').textContent = T(on ? 'vote_stop' : 'vote_btn');
      row.querySelectorAll('.vh, .vr, .vgo, .vu').forEach(x => x.classList.toggle('hidden', !on));
      if (on) paint();
    };
    row.querySelector('.vt').onclick = () => {
      const r = box.querySelector('.st-think:not(.hidden) button'); if (r) r.click();
      mode(!kit.votes); AU.sfx('click');
    };
    row.querySelector('.vr').onclick = () => { mode(true); AU.sfx('page'); };
    kit.undo = () => { if (!kit.votes || !kit.hist.length) return; kit.votes[kit.hist.pop()]--; paint(); AU.sfx('click'); };
    row.querySelector('.vu').onclick = () => kit.undo();
    row.querySelector('.vgo').onclick = () => {
      const mx = Math.max(...kit.votes); if (!mx) return;
      const kept = kit.votes.slice(), tops = kept.map((v, i) => v === mx ? i : -1).filter(i => i >= 0);
      if (!kit.tally) kit.tally = kept;
      mode(false); box.classList.add('voted');   // the bars stay up so the class sees how it split
      if (tops.length > 1) { AU.sfx('page'); fb.className = 'fb'; fb.innerHTML = `<b>${T('vote_tie')}</b>`; return; }
      ans[tops[0]].click();
    };
    // called first by the answer buttons: while counting, a tap is a hand, not an answer
    kit.take = i => { if (!kit.votes) return false; kit.votes[i]++; kit.hist.push(i); paint(); AU.sfx('click'); return true; };
    kit.done = () => row.classList.add('hidden');
    return kit;
  },

  // ------------ question card (misconception-tagged answers)
  ask(q) {
    return new Promise(res => {
      const S = G.S, el = h('div', 'modal ask');
      const letters = 'ABCD';
      el.innerHTML = `<div class="card index">
        <div class="card-head"><span class="code">${U.esc(currText(q.code))}</span><span class="who">${U.esc(q.who ? speakerName(q.who) : '')}</span></div>
        <h3>${U.esc(L(q.prompt))}</h3>
        ${q.figure ? '<canvas class="fig" width="520" height="200"></canvas>' : ''}
        ${STUDY._thinkHTML()}
        <div class="answers">${q.options.map((o, i) => `<button class="ans" data-i="${i}"><b>${letters[i]}</b><span>${U.esc(L(o.t))}</span></button>`).join('')}</div>
        ${G.set.conf ? `<div class="conf"><button data-c="1">${T('sure')}</button><button data-c="0" class="on">${T('not_sure')}</button></div>` : ''}
        <div class="fb hidden"></div>
        <div class="card-foot"><button class="tts">${ICON.speaker}</button><button class="go hidden">${T('next')} →</button></div>
      </div>`;
      if (q.figure) q.figure(el.querySelector('.fig'));
      let sure = false, tries = 0, first = null, firstTag = null, finished = false;
      // board mode: the teacher counts raised hands on each option, then the most-voted option is the class's answer
      const vk = this.voteKit(el.querySelector('.card'), el.querySelector('.fb'));
      el.querySelectorAll('.conf button').forEach(b => b.onclick = () => { sure = b.dataset.c === '1'; el.querySelectorAll('.conf button').forEach(x => x.classList.toggle('on', x === b)); AU.sfx('click'); });
      el.querySelector('.tts').onclick = () => this.speak(L(q.prompt) + '. ' + q.options.map((o, i) => letters[i] + ': ' + L(o.t)).join('. '), true);
      const fb = el.querySelector('.fb');
      el.querySelectorAll('.ans').forEach(b => b.onclick = () => {
        if (finished || b.classList.contains('x') || el.querySelector('.card').classList.contains('thinking')) return;
        const i = +b.dataset.i, o = q.options[i];
        if (vk && vk.take(i)) return;
        tries++;
        if (first === null) { first = i; if (!o.ok) firstTag = o.tag || null; }
        if (o.ok) {
          finished = true;
          b.classList.add('ok');
          AU.sfx('success');
          this.stamp(T('correct'));
          fb.className = 'fb good'; fb.innerHTML = `<p>${U.esc(L(q.explain || o.fb || ''))}</p>`;
          el.querySelector('.go').classList.remove('hidden');
          if (vk) vk.done();
          S.answers.push({ q: q.id, code: q.code, case: q.case || null, first, ok: first === i, tries, sure, tag: firstTag, votes: (vk && vk.tally) || undefined, t: Date.now() });
          G.save();
        } else {
          b.classList.add('x');
          AU.sfx('wrong');
          fb.className = 'fb bad'; fb.innerHTML = `<b>${T('think_again')}</b><p>${U.esc(L(o.fb || ''))}</p>`;
        }
      });
      const close = () => { this._pop(el); res(first !== null && q.options[first].ok); };
      el.querySelector('.go').onclick = () => { AU.sfx('page'); close(); };
      el._key = e => {
        if (!finished && /^Digit[1-4]$/.test(e.code)) { const b = el.querySelectorAll('.ans')[+e.code.slice(5) - 1]; if (b) b.click(); }
        if (vk && vk.votes && e.code === 'Backspace') { e.preventDefault(); vk.undo(); }
        if (finished && this.fwd(e.code)) close();
        else if (!finished && e.code !== 'KeyE' && this.fwd(e.code)) { const r = el.querySelector('.st-think:not(.hidden) button'); if (r) r.click(); }
      };
      this._push('ask', el);
      STUDY._think(el.querySelector('.card'));
      if (G.set.tts) this.speak(L(q.prompt));
    });
  },

  // ------------ present evidence from the journal
  present(prompt, accept) {
    return new Promise(res => {
      const S = G.S, el = h('div', 'modal present');
      const ids = Object.keys(S.journal.obs);
      el.innerHTML = `<div class="card paper wide"><h3>${T('j_present_title')}</h3><p class="sub">${U.esc(L(prompt))}</p><div class="obs-grid"></div><div class="card-foot"><button class="cancel">${T('cancel')}</button></div></div>`;
      const grid = el.querySelector('.obs-grid');
      if (!ids.length) grid.innerHTML = `<p class="empty">${T('j_pick_obs')}</p>`;
      ids.forEach(id => {
        const o = OBS[id], rec = S.journal.obs[id];
        const b = h('button', 'obs-card', `<canvas width="120" height="90"></canvas><b>${U.esc(L(o.title))}</b><small>${U.esc(currText(o.code))}</small>`);
        LENS.thumb(b.querySelector('canvas'), rec.spec, rec.lvl);
        b.onclick = () => {
          if (accept && !accept(id)) { b.classList.add('shake'); AU.sfx('wrong'); setTimeout(() => b.classList.remove('shake'), 400); return; }
          AU.sfx('stamp'); this._pop(el); res(id);
        };
        grid.appendChild(b);
      });
      el.querySelector('.cancel').onclick = () => { this._pop(el); res(null); };
      el._key = e => { if (e.code === 'Escape') { this._pop(el); res(null); } };
      this._push('present', el);
    });
  },

  // ------------ generic panel for mini-games
  panel(opt) {
    const el = h('div', 'modal panel' + (opt.cls ? ' ' + opt.cls : ''));
    el.innerHTML = `<div class="card paper ${opt.wide ? 'wide' : ''}"><div class="panel-head"><h3>${U.esc(L(opt.title))}</h3>${opt.code && currText(opt.code) ? `<span class="code">${U.esc(currText(opt.code))}</span>` : ''}<button class="x">${ICON.close}</button></div><div class="panel-body"></div></div>`;
    const body = el.querySelector('.panel-body');
    if (typeof opt.body === 'string') body.innerHTML = opt.body; else if (opt.body) body.appendChild(opt.body);
    const api = { el, body, closed: false, close: () => { if (api.closed) return; api.closed = true; this._pop(el); if (opt.onClose) opt.onClose(); } };
    el.querySelector('.x').onclick = () => { AU.sfx('click'); api.close(); };
    el._key = e => { if (e.code === 'Escape' && !opt.noEsc) api.close(); else if (opt.onKey) opt.onKey(e); };
    this._push('panel', el);
    if (body.querySelector('.rig-bottom')) this._rigJump(el);
    if (body.querySelector('.kit.rig > .rig-top > canvas')) this._rigBig(el);
    if (body.querySelector('.kit.detector > canvas, .kit.scale > canvas, .kit.mendel > canvas')) this._kitLens(el);
    return api;
  },
  // a magnifier over a canvas: while it is on, a layer over the picture takes the finger, and a round window three times
  // closer rides just above it (so the finger does not hide what it points at; near the top it hangs below instead),
  // follows it and shows the moving picture as it moves. Where the finger lifts, the window stays (as the specimen
  // table's does), so the teacher can step aside and talk: a finger on the window slides it along, one anywhere else
  // takes it there, and the 🔍 that turned it on takes it away. A mouse gets it by hovering. The layer and the window
  // sit in host, the canvas's positioned parent, placed in its own layout units (a card's entrance tilt does not throw
  // them off). src(x) picks what to read at a point across the picture (0..1): a snapshot may lie over part of it. The
  // window's canvas sits in a box of its own: the benches style every canvas inside them. A window left behind wears its
  // power on its rim (2x, 3x or 5x, as the specimen table's lens has): a tap there changes it, and it is kept for the
  // next magnifier
  _lens(cv, host, src) {
    const hit = h('div', 'lens-hit'), win = h('div', 'lens-win'), wc = document.createElement('canvas'), pow = h('button', 'lens-pow'), D = 220, ZS = [2, 3, 5];
    wc.width = wc.height = 440; win.appendChild(wc); host.append(hit, win, pow);
    pow.setAttribute('aria-label', T('rig_lens_pow')); pow.title = T('rig_lens_pow');
    let tg = null, drag = null, pinned = false, raf = 0, on = false, Z = UI._lensZ || 3;
    const fit = () => Object.assign(hit.style, { left: cv.offsetLeft + 'px', top: cv.offsetTop + 'px', width: cv.offsetWidth + 'px', height: cv.offsetHeight + 'px' });
    const hide = () => { tg = null; drag = null; pinned = false; win.classList.remove('on', 'pinned'); pow.classList.remove('on'); };
    const paint = () => {
      raf = 0;
      if (!tg || !on || !cv.isConnected) { win.classList.remove('on'); return; }
      const r = cv.getBoundingClientRect(), s = cv.width / r.width, x = U.clamp(tg.x - r.left, 0, r.width), y = U.clamp(tg.y - r.top, 0, r.height);
      tg.x = r.left + x; tg.y = r.top + y;
      const c = (src && src(x / r.width)) || cv, sw = D / Z * s, lx = wc.getContext('2d'), n = wc.width;
      lx.fillStyle = '#1B1A17'; lx.fillRect(0, 0, n, n);
      lx.drawImage(c, x * s - sw / 2, y * s - sw / 2, sw, sw, 0, 0, n, n);
      lx.strokeStyle = 'rgba(244, 222, 154, 0.85)'; lx.lineWidth = n / 110;
      lx.beginPath(); lx.moveTo(n / 2 - n / 14, n / 2); lx.lineTo(n / 2 + n / 14, n / 2); lx.moveTo(n / 2, n / 2 - n / 14); lx.lineTo(n / 2, n / 2 + n / 14); lx.stroke();
      const ox = cv.offsetLeft + x * cv.offsetWidth / r.width, oy = cv.offsetTop + y * cv.offsetHeight / r.height;
      let t = oy - D - 30; if (t < 4) t = oy + 30;
      const wl = U.clamp(ox - D / 2, 4, host.clientWidth - D - 4), wt = U.clamp(t, 4, host.clientHeight - D - 4);
      win.style.left = wl + 'px'; win.style.top = wt + 'px';
      win.classList.add('on'); win.classList.toggle('pinned', pinned);
      // the power chip sits on the rim, low on the right (the window is D + 8 across with its border)
      pow.style.left = Math.round(wl + 167) + 'px'; pow.style.top = Math.round(wt + 167) + 'px'; pow.textContent = Z + '×'; pow.classList.toggle('on', pinned);
      raf = requestAnimationFrame(paint);
    };
    const go = () => { cancelAnimationFrame(raf); paint(); };
    const onWin = e => { if (!pinned || !win.classList.contains('on')) return false; const q = win.getBoundingClientRect(); return Math.hypot(e.clientX - (q.left + q.width / 2), e.clientY - (q.top + q.height / 2)) < q.width / 2; };
    hit.addEventListener('pointerdown', e => {
      e.preventDefault(); try { hit.setPointerCapture(e.pointerId); } catch (_) { }
      const slide = onWin(e);
      drag = { id: e.pointerId, slide, x: e.clientX, y: e.clientY, tx: slide ? tg.x : 0, ty: slide ? tg.y : 0 };
      if (!slide) tg = { x: e.clientX, y: e.clientY };
      pinned = false; go();
    });
    hit.addEventListener('pointermove', e => {
      if (drag && drag.id === e.pointerId) tg = drag.slide ? { x: drag.tx + e.clientX - drag.x, y: drag.ty + e.clientY - drag.y } : { x: e.clientX, y: e.clientY };
      else if (!drag && !pinned && e.pointerType === 'mouse') tg = { x: e.clientX, y: e.clientY };
      else return;
      go();
    });
    hit.addEventListener('pointerup', e => { if (!drag || drag.id !== e.pointerId) return; drag = null; if (e.pointerType !== 'mouse') { pinned = true; go(); AU.sfx('click'); } });
    hit.addEventListener('pointercancel', e => { if (drag && drag.id === e.pointerId) hide(); });
    hit.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !drag && !pinned) hide(); });
    pow.addEventListener('pointerdown', e => e.stopPropagation());
    pow.onclick = e => { e.stopPropagation(); Z = UI._lensZ = ZS[(ZS.indexOf(Z) + 1) % ZS.length]; AU.sfx('click'); go(); };
    return {
      on: () => on, fit,
      set(v) { on = !!v; fit(); hit.classList.toggle('on', on); if (!on) { cancelAnimationFrame(raf); raf = 0; hide(); } },
    };
  },
  // the detector, the scale and Mendel's peas have no big view: on the board a 🔍 chip in the picture's corner gives
  // them the same magnifier (the needle on the scale's dial, a wrinkled pea against a round one). On the detector it
  // takes the top-left corner: the signal gauge's red end is in the top-right one
  _kitLens(el) {
    const cv = el.querySelector('.kit.detector > canvas, .kit.scale > canvas, .kit.mendel > canvas'), kit = cv.parentNode, left = kit.classList.contains('detector');
    kit.classList.add('has-lens');
    const lz = this._lens(cv, kit), b = h('button', 'lens-chip');
    b.textContent = '🔍'; b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', T('rig_lens')); b.title = T('rig_lens');
    kit.appendChild(b);
    const place = () => { b.style.left = cv.offsetLeft + (left ? 8 : cv.offsetWidth - 64) + 'px'; b.style.top = cv.offsetTop + 8 + 'px'; lz.fit(); };
    b.onclick = () => { AU.sfx('click'); lz.set(!lz.on()); b.classList.toggle('on', lz.on()); b.setAttribute('aria-pressed', String(lz.on())); place(); };
    // the chip follows the picture: when the bench's size changes, and when its text or rows change above the picture
    // (which moves it without resizing it)
    place();
    if (window.ResizeObserver) { const ro = new ResizeObserver(() => { if (!el.isConnected) ro.disconnect(); else place(); }); ro.observe(kit); ro.observe(cv); }
    const mo = new MutationObserver(() => { if (!el.isConnected) mo.disconnect(); else place(); });
    mo.observe(kit, { childList: true, subtree: true, characterData: true });
  },
  // how fast a bench's clock runs: 1, unless the big view has paused its picture (0) or slowed it down (0.5). A step
  // while paused lets six frames through (a tenth of a second), one per call: each bench asks once a frame
  benchPace(cv) {
    if (!cv) return 1;
    if (cv._pace === 0 && cv._stepN > 0) { cv._stepN--; return 1; }
    return cv._pace ?? 1;
  },
  // on the board a bench's picture opens big: the live canvas itself moves into a screen-filling view, so taps on it
  // still land where they should (every bench maps them through the canvas's own rectangle), with the message line and
  // the bench's big buttons beside it; "Smaller" (or Esc) puts it back where it was
  _rigBig(el) {
    const kit = el.querySelector('.kit.rig'), cv = kit.querySelector('.rig-top > canvas');
    const go = h('button', 'rig-big');
    go.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    go.setAttribute('aria-label', T('rig_big')); go.title = T('rig_big');
    kit.appendChild(go);
    go.onclick = () => {
      if (el.querySelector('.rig-focus')) return;
      AU.sfx('click');
      const par = cv.parentNode, home = cv.nextSibling, msg = kit.querySelector(':scope > .kit-msg');
      const f = h('div', 'rig-focus');
      // pace, for the class to watch closely: pause (to point, draw and talk) or half speed. The step test keeps real
      // time, since its beat is the experiment
      const paced = !kit.classList.contains('steptest');
      f.innerHTML = `<div class="rf-main"><div class="rf-stage"><canvas class="rf-over" width="${cv.width}" height="${cv.height}"></canvas><b class="rf-olbl"></b><b class="rf-now">${U.esc(T('rig_now'))}</b><div class="rf-wipe" aria-label="${U.esc(T('rig_wipe'))}" title="${U.esc(T('rig_wipe'))}"><i>⇆</i></div><b class="rf-badge"></b></div></div><div class="rf-side"><div class="rf-top"><button class="rf-x">${U.esc(T('rig_small'))}</button><button class="rf-predb" hidden aria-label="${U.esc(T('rig_pred_b'))}" title="${U.esc(T('rig_pred_b'))}">🤔 ${U.esc(T('rig_pred'))}</button></div><p class="rf-msg"></p><div class="rf-btns"></div>${paced ? `<div class="rf-pace seg">${[[0, '⏸', 'rig_pause', 'K'], ['step', '⏭', 'rig_step', '→'], [0.5, '½', 'rig_half'], [1, '1×', 'rig_full', '←']].map(([v, s, k, kk]) => `<button data-p="${v}" aria-label="${U.esc(T(k))}" title="${U.esc(T(k) + (kk ? ` (${kk})` : ''))}">${s}</button>`).join('')}</div>` : ''}<div class="rf-snaps"><div class="rf-row"><button class="rf-snap" aria-label="${U.esc(T('rig_snap'))}" title="${U.esc(T('rig_snap'))}">${U.esc(T('rig_snap_s'))}</button><button class="rf-lensb" aria-pressed="false" aria-label="${U.esc(T('rig_lens'))}" title="${U.esc(T('rig_lens') + ' (M)')}">🔍</button><button class="rf-save" aria-label="${U.esc(T('rig_save'))}" title="${U.esc(T('rig_save'))}">💾</button></div><div class="rf-thumbs"></div></div></div><button class="rf-helpb" aria-label="${U.esc(T('rig_help_t'))}" title="${U.esc(T('rig_help_t') + ' (H)')}">?</button>`;
      f.querySelector('.rf-stage').prepend(cv);
      const badge = f.querySelector('.rf-badge'), stepB = f.querySelector('.rf-pace [data-p="step"]'), predB = f.querySelector('.rf-predb');
      const pace = p => {
        cv._pace = p; cv._stepN = 0; f.dataset.pace = p;
        f.querySelectorAll('.rf-pace button').forEach(b => b.classList.toggle('on', +b.dataset.p === p));
        badge.textContent = p === 0 ? T('rig_paused') : p < 1 ? T('rig_slowed') : '';
        if (stepB) stepB.disabled = p !== 0;
      };
      f.querySelectorAll('.rf-pace button:not([data-p="step"])').forEach(b => b.onclick = () => { AU.sfx('click'); pace(+b.dataset.p); });
      // frozen, ⏭ moves the experiment on by a moment and freezes it again: a bubble at a time, a balloon a breath at a time
      if (stepB) stepB.onclick = () => { if (cv._pace !== 0) return; AU.sfx('click'); cv._stepN = 6; };
      // snapshots, to compare: 📷 keeps the moment (the last three, for as long as the bench stays open). A thumbnail
      // lays its moment over the left half of the live picture, then-and-now side by side across a divider the class
      // can drag either way (all the way right is the whole snapshot); a tap on the snapshot's part, or on the
      // thumbnail again, goes back to live
      const snaps = kit._snaps || (kit._snaps = []), row = f.querySelector('.rf-thumbs');
      const over = f.querySelector('.rf-over'), olbl = f.querySelector('.rf-olbl'), wipeEl = f.querySelector('.rf-wipe'), nowEl = f.querySelector('.rf-now');
      let showing = null, wipe = 0.5;
      const wipeTo = w => {
        wipe = U.clamp(w, 0.04, 1);
        over.style.clipPath = `inset(0 ${((1 - wipe) * 100).toFixed(2)}% 0 0)`;
        wipeEl.style.left = (wipe * 100).toFixed(2) + '%';
        olbl.style.maxWidth = `calc(${(wipe * 100).toFixed(2)}% - 24px)`;
        nowEl.classList.toggle('gone', wipe > 0.9);
      };
      const show = s => {
        showing = s; f.classList.toggle('shot', !!s);
        if (s) { const x = over.getContext('2d'); x.clearRect(0, 0, over.width, over.height); x.drawImage(s.c, 0, 0); olbl.textContent = T('rig_shot_on').replace('{n}', s.n); wipeTo(0.5); }
        row.querySelectorAll('.rf-thumb').forEach(b => b.classList.toggle('on', !!s && +b.dataset.n === s.n));
      };
      // the divider follows the finger that took it, wherever it wanders
      let wp = null;
      wipeEl.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); wp = e.pointerId; try { wipeEl.setPointerCapture(e.pointerId); } catch (_) { } });
      wipeEl.addEventListener('pointermove', e => { if (wp !== e.pointerId) return; const r = over.getBoundingClientRect(); wipeTo((e.clientX - r.left) / r.width); });
      for (const t of ['pointerup', 'pointercancel']) wipeEl.addEventListener(t, e => { if (wp === e.pointerId) wp = null; });
      wipeEl.addEventListener('click', e => e.stopPropagation());
      // the thumbnails show the whole moment, letterboxed, so they can be told apart by more than their number
      const thumbs = () => {
        row.innerHTML = '';
        for (const s of snaps) {
          const b = h('button', 'rf-thumb'); b.dataset.n = s.n; b.setAttribute('aria-label', T('rig_shot').replace('{n}', s.n));
          const tc = document.createElement('canvas'); tc.width = 152; tc.height = 116;
          const tx = tc.getContext('2d'), k = Math.min(152 / s.c.width, 116 / s.c.height), w = s.c.width * k, hh = s.c.height * k;
          tx.fillStyle = '#1B1A17'; tx.fillRect(0, 0, 152, 116); tx.drawImage(s.c, (152 - w) / 2, (116 - hh) / 2, w, hh);
          const i = document.createElement('i'); i.textContent = s.n; b.append(tc, i);
          b.onclick = () => { AU.sfx('click'); show(showing === s ? null : s); };
          row.appendChild(b);
        }
      };
      f.querySelector('.rf-snap').onclick = () => {
        AU.sfx('lens');
        const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; c.getContext('2d').drawImage(cv, 0, 0);
        kit._snapN = (kit._snapN || 0) + 1; snaps.push({ n: kit._snapN, c }); if (snaps.length > 3) snaps.shift();
        if (showing && !snaps.includes(showing)) show(null);
        thumbs(); f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash');
      };
      over.onclick = () => { AU.sfx('click'); show(null); };
      thumbs();
      // the magnifier (🔍, see _lens): the snapshot's part shows in it too when one lies over the picture, and the
      // snapshot's divider can still be dragged while it is on
      const lensB = f.querySelector('.rf-lensb'), lz = this._lens(cv, f.querySelector('.rf-stage'), x => f.classList.contains('shot') && x < wipe ? over : cv);
      const lensOn = on => { lz.set(on); f.classList.toggle('lens', on); lensB.classList.toggle('on', on); lensB.setAttribute('aria-pressed', String(on)); };
      lensB.onclick = () => { AU.sfx('click'); lensOn(!lz.on()); };
      // the bench's big buttons (run, limewater, step) answer from here too: a click or a press is passed on to them
      const bigs = [...kit.querySelectorAll('.kit-ctrl .big')], fm = f.querySelector('.rf-msg');
      const prox = bigs.map(b => {
        const p = h('button', 'big');
        p.addEventListener('pointerdown', e => { e.preventDefault(); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: e.pointerId })); });
        // a big button pressed while paused starts things moving again, or the class would stare at a frozen start
        p.onclick = () => { if (cv._pace === 0) pace(1); b.click(); };
        f.querySelector('.rf-btns').appendChild(p); return p;
      });
      const sync = () => { fm.textContent = msg ? msg.textContent : ''; bigs.forEach((b, i) => { prox[i].textContent = b.textContent; prox[i].disabled = b.disabled; }); };
      // the newest result, read off the table's marked row, heading by heading, in a strip under the picture: the table
      // itself is under the big view, and the class would otherwise have to shrink the picture to see what the run just
      // gave. The picture gives up the strip's height (about 2% of it on a 1080-line board); before a result the
      // headings show with dashes, so the strip is there from the start and nothing moves when it fills
      const tbl = kit.querySelector('.rig-table'), main = f.querySelector('.rf-main');
      let lastEl = null;
      const last = () => {
        const tb = tbl && tbl.querySelector('table'), hr = tb && [...tb.rows].find(r => r.querySelector('th'));
        f.classList.toggle('has-last', !!hr); predB.hidden = !hr;
        if (!hr) { if (lastEl) lastEl.hidden = true; return; }
        if (!lastEl) {
          lastEl = h('div', 'rf-last'); lastEl.innerHTML = `<i class="rf-chartb" aria-hidden="true">📈</i><b>${U.esc(T('rig_last'))}</b><dl></dl><i class="rf-pred" role="button" hidden></i>`; main.appendChild(lastEl);
          lastEl.onclick = e => { if (e.target.closest('.rf-pred') || !(kc && kc._chartData)) return; AU.sfx('click'); chartOn(chartW.hidden); };
          lastEl.querySelector('.rf-pred').onclick = () => { AU.sfx('click'); pred = kit._pred = null; last(); };
        }
        const rs = [...tb.querySelectorAll('tr.fresh')], r = rs[0], heads = [...hr.cells].map(c => c.textContent.trim());
        // a result of several rows (four dishes, three flasks) shows every row: its own settings, short, then its
        // outcome (the bold cell) in full. The settings give way first when the strip is crowded; a yes/no cell
        // borrows its heading ("Sugar ✓"), and the run's number moves up beside the strip's name
        let items, run = '';
        if (rs.length > 1) {
          items = rs.map(x => {
            const c = [...x.cells].map(td => td.textContent.trim());
            let ri = [...x.cells].findIndex(td => td.querySelector('b')); if (ri < 0) ri = c.length - 1;
            if (!run) run = c.find(v => /^#\d/.test(v)) || '';
            return [c.map((v, i) => i === ri || !v || /^#\d/.test(v) ? '' : /^[✓✗—–-]$/.test(v) ? `${heads[i] || ''} ${v}`.trim() : v).filter(Boolean).join(' · '), c[ri]];
          });
        } else items = (r ? [...r.cells].map(c => c.textContent.trim()) : heads.map(() => '–')).map((v, i) => [heads[i], v]);
        lastEl.hidden = false; lastEl.classList.toggle('none', !r); lastEl.classList.toggle('multi', rs.length > 1);
        const cc = !!(kc && kc._chartData); lastEl.classList.toggle('can-chart', cc); lastEl.title = cc ? T('rig_chart') : '';
        lastEl.querySelector('b').textContent = T('rig_last') + (run ? ' ' + run : '');
        lastEl.querySelector('dl').innerHTML = items.map(([k, v]) => `<div><dt>${U.esc(k || '')}</dt><dd>${U.esc(v || '–')}</dd></div>`).join('');
        if (r && r.classList.contains('pulse') && !G.reduceMotion) { lastEl.classList.remove('new'); void lastEl.offsetWidth; lastEl.classList.add('new'); }
        // the class's guess waits at the strip's end; the first result to land after it is set beside it
        const pc = lastEl.querySelector('.rf-pred');
        pc.hidden = !pred;
        if (pred) {
          if (!pred.res && rs.some(x => x.classList.contains('pulse') && !pred.seen.has(x))) pred.res = verdict(rs);
          pc.textContent = (pred.res || T('rig_pred_wait').replace('{g}', pred.g)) + ' ✕';
        }
      };
      // predict, then watch: before a run the teacher types the class's guess on a fingertip keypad (how many bubbles,
      // how many cm). It waits in the strip; the result that lands next comes out beside it with the gap, or, for a
      // result of several rows, the row nearest the guess. A tap on it (✕) clears it
      let pred = kit._pred || null;
      const num = v => { const m = String(v).replace(',', '.').match(/-?\d+(?:\.\d+)?/); return m ? +m[0] : NaN; };
      const fmt = x => String(+x.toFixed(2)).replace('.', I18N.lang === 'tr' ? ',' : '.');
      const outc = x => {
        const c = [...x.cells].map(td => td.textContent.trim());
        let ri = [...x.cells].findIndex(td => td.querySelector('b')); if (ri < 0) ri = c.length - 1;
        return [c.find((v, i) => i !== ri && v && !/^#\d/.test(v)) || '', c[ri]];
      };
      const verdict = rows => {
        const outs = rows.map(outc), put = (k, o) => T(k).replace('{g}', pred.g).replace('{r}', o.r).replace('{d}', o.d || '').replace('{k}', o.k || '');
        if (outs.length === 1) {
          const [, v] = outs[0], x = num(v), d = pred.n - x;
          if (isNaN(x)) return put('rig_pred_got', { r: v });
          return put(Math.abs(d) < 1e-9 ? 'rig_pred_hit' : d > 0 ? 'rig_pred_over' : 'rig_pred_under', { r: v, d: fmt(Math.abs(d)) });
        }
        let best = null;
        outs.forEach(([k, v]) => { const x = num(v); if (!isNaN(x) && (!best || Math.abs(x - pred.n) < best.e)) best = { k, r: v, e: Math.abs(x - pred.n) }; });
        return best ? put('rig_pred_near', best) : put('rig_pred_got', { r: outs.map(o => o[1]).join(', ') });
      };
      predB.onclick = async () => {
        AU.sfx('click'); lensOn(false);
        const hr = tbl && [...tbl.querySelectorAll('tr')].find(x => x.querySelector('th')), hd = hr ? hr.cells[hr.cells.length - 1].textContent.trim() : '';
        const v = await UI.numPad(el, T('rig_pred_q') + (hd ? ' · ' + hd : ''));
        if (v == null || !el.isConnected) return;
        pred = kit._pred = { g: v, n: +v.replace(',', '.'), seen: new Set(tbl ? tbl.querySelectorAll('tr.pulse') : []), res: null };
        last();
      };
      // 📈 the bench's chart of all its results, big in the picture's place, for the back row: a tap on the strip brings it
      // up and takes it away (so does a tap on the chart). It is drawn afresh at the picture's own pixels, so its words
      // stay sharp, redraws itself when a new result comes in, and a photo taken meanwhile is of the chart
      const kc = kit.querySelector('.rig-chart'), chartW = h('div', 'rf-chartw'), chartCv = document.createElement('canvas');
      chartW.hidden = true; chartW.appendChild(chartCv); f.querySelector('.rf-stage').appendChild(chartW);
      const chartDraw = () => {
        if (chartW.hidden || !kc || !kc._chartData) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        chartCv.width = Math.max(1, Math.round(cv.offsetWidth * dpr)); chartCv.height = Math.max(1, Math.round(cv.offsetHeight * dpr));
        chartCv._k = chartCv.width / 360; UI._chart(chartCv, kc._chartData);
      };
      const chartOn = on => {
        if (on && !(kc && kc._chartData)) return;
        chartW.hidden = !on; f.classList.toggle('charting', on); if (lastEl) lastEl.classList.toggle('charting', on);
        if (on) { lensOn(false); chartDraw(); }
      };
      if (kc) kc._onChart = () => { if (lastEl) lastEl.classList.add('can-chart'); chartDraw(); };
      chartW.onclick = () => { AU.sfx('click'); chartOn(false); };
      // 💾 the experiment as one picture for the class page: the live picture (with a snapshot's half when one lies over
      // it), the pen's lines moved from the screen onto it, and a caption with the bench, the date, the latest result
      // and the class's guess
      const photo = () => {
        const k = 1.5, W = Math.round(cv.width * k), H = Math.round(cv.height * k), foot = 132;
        const o = document.createElement('canvas'); o.width = W; o.height = H + foot;
        const c = o.getContext('2d');
        const charting = !chartW.hidden;
        c.drawImage(charting ? chartCv : cv, 0, 0, W, H);
        if (!charting && f.classList.contains('shot')) {
          c.save(); c.beginPath(); c.rect(0, 0, W * wipe, H); c.clip(); c.drawImage(over, 0, 0, W, H); c.restore();
          c.fillStyle = '#F4DE9A'; c.fillRect(W * wipe - 2, 0, 4, H);
        }
        const r = cv.getBoundingClientRect(), sx = W / (r.width || 1), sy = H / (r.height || 1);
        c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip(); c.lineCap = 'round'; c.lineJoin = 'round';
        for (const s of INK.strokes) {
          if (s.laser) continue;
          c.beginPath(); s.forEach(([x, y], i) => { const X = (x - r.left) * sx, Y = (y - r.top) * sy; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); });
          if (s.col === INK.HL) { c.strokeStyle = 'rgba(255, 219, 40, 0.42)'; c.lineWidth = 30 * sx; } else { c.strokeStyle = INK.COLS[s.col] || INK.COLS[0]; c.lineWidth = 6 * sx; }
          c.stroke();
        }
        c.restore();
        const font = getComputedStyle(document.body).fontFamily, ttl = el.querySelector('.panel-head h3');
        c.fillStyle = '#F7F2E4'; c.fillRect(0, H, W, foot); c.fillStyle = '#2A2620'; c.fillRect(0, H, W, 3);
        c.textBaseline = 'middle'; c.textAlign = 'right'; c.font = `400 22px ${font}`;
        c.fillText(`${T('title')} · ${new Date().toLocaleDateString(I18N.lang === 'tr' ? 'tr-TR' : 'en-GB')}`, W - 24, H + 34);
        c.textAlign = 'left'; c.font = `700 30px ${font}`;
        c.fillText(ttl ? ttl.textContent : '', 24, H + 34, W - 340);
        c.font = `400 25px ${font}`;
        const res = lastEl && !lastEl.hidden && !lastEl.classList.contains('none') ? `${lastEl.querySelector('b').textContent}: ${[...lastEl.querySelectorAll('dl > div')].map(d => `${d.querySelector('dt').textContent} ${d.querySelector('dd').textContent}`.trim()).join(' · ')}` : '';
        if (res) c.fillText(res, 24, H + 76, W - 48);
        if (pred) c.fillText(pred.res || T('rig_pred_wait').replace('{g}', pred.g), 24, H + 110, W - 48);
        return o;
      };
      f._photo = photo;
      f.querySelector('.rf-save').onclick = () => {
        AU.sfx('page'); f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash');
        const d = new Date(), p2 = n => String(n).padStart(2, '0');
        const name = `tohum-bekcisi-deney-${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.png`;
        try {
          photo().toBlob(bl => {
            if (!bl) { UI.toast(T('st_shot_no'), '!'); return; }
            const a = document.createElement('a'), u = URL.createObjectURL(bl);
            a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(u), 5000);
            UI.toast(T('st_shot_ok'), '✦');
          }, 'image/png');
        } catch (err) { UI.toast(T('st_shot_no'), '!'); }
      };
      // ? a card over the picture that says what each control here does, a line each, only for the ones this bench
      // has: a teacher who never read the guide finds the magnifier, the guess and the chart
      const help = h('div', 'rf-help'); help.hidden = true;
      help.innerHTML = `<div class="rf-helpc"><div class="rf-padh"><b>${U.esc(T('rig_help_t'))}</b><button class="rf-hx" aria-label="${U.esc(T('close'))}" title="${U.esc(T('close'))}">✕</button></div><ul></ul></div>`;
      f.appendChild(help);
      const helpOn = on => {
        help.hidden = !on; if (!on) return;
        lensOn(false);
        const rows = [];
        if (paced) rows.push(['⏸ ⏭ ½ 1×', 'rig_h_pace']);
        rows.push(['📷', 'rig_h_snap'], ['🔍', 'rig_h_lens'], ['💾', 'rig_h_save']);
        if (!predB.hidden) rows.push(['🤔', 'rig_h_pred']);
        if (lastEl && !lastEl.hidden) rows.push(lastEl.classList.contains('can-chart') ? ['📈', 'rig_h_strip_chart'] : ['▬', 'rig_h_strip']);
        rows.push(['✎', 'rig_h_pen'], ['⌨', paced ? 'rig_h_keys' : 'rig_h_keys0']);
        help.querySelector('ul').innerHTML = rows.map(([i, k]) => `<li><i>${U.esc(i)}</i><span>${U.esc(T(k))}</span></li>`).join('');
      };
      f.querySelector('.rf-helpb').onclick = () => { AU.sfx('page'); helpOn(true); };
      help.querySelector('.rf-hx').onclick = () => { AU.sfx('click'); helpOn(false); };
      help.onclick = e => { if (e.target === help) { AU.sfx('click'); helpOn(false); } };
      const mo = new MutationObserver(sync);
      mo.observe(kit, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['disabled'] });
      // ink drawn on the small picture would point at the wrong place on the big one
      const inkOff = () => { if (INK.strokes.length) { INK.strokes = []; INK._ui(); } };
      const key0 = el._key;
      const close = () => { mo.disconnect(); lensOn(false); if (kc) kc._onChart = null; cv._pace = 1; cv._stepN = 0; par.insertBefore(cv, home); f.remove(); el._key = key0; el._onMark = null; inkOff(); };
      f.querySelector('.rf-x').onclick = () => { AU.sfx('click'); close(); };
      // a keyboard, or the teacher's presentation clicker (its forward and back are PageDown and PageUp): forward
      // freezes, then each press steps on a moment; back plays again; K freezes or plays, M the magnifier. The button
      // answering lights up for a moment, so the class sees what the far-off press did
      const tap = s => {
        const b = f.querySelector(s); if (!b || b.disabled) return;
        b.click(); b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 260);
      };
      el._key = e => {
        if (!help.hidden) { if (e.code === 'Escape' || e.code === 'KeyH' || UI.fwd(e.code)) helpOn(false); return; }
        if (e.code === 'KeyH') helpOn(true);
        else if (e.code === 'Escape') close();
        else if (paced && ['ArrowRight', 'PageDown', 'Period'].includes(e.code)) tap(cv._pace === 0 ? '.rf-pace [data-p="step"]' : '.rf-pace [data-p="0"]');
        else if (paced && ['ArrowLeft', 'PageUp'].includes(e.code)) tap('.rf-pace [data-p="1"]');
        else if (paced && e.code === 'KeyK') tap(`.rf-pace [data-p="${cv._pace === 0 ? 1 : 0}"]`);
        else if (e.code === 'KeyM') tap('.rf-lensb');
        else if (key0) key0(e);
      };
      el.appendChild(f); pace(1); sync(); inkOff(); last(); el._onMark = last;
    };
  },
  // on the board a bench's results (the stamps, the table, the chart) sit below its picture: a fingertip chip in the
  // card's corner jumps down to them and back up to the picture, and pulses when a run adds a result out of sight
  _rigJump(el) {
    const card = el.querySelector('.card'), rb = el.querySelector('.rig-bottom');
    const j = h('div', 'rig-jump away'); j.innerHTML = '<button></button>'; card.appendChild(j);
    const b = j.firstChild; let seen = null, t = 0;
    const below = () => rb.getBoundingClientRect().top > card.getBoundingClientRect().bottom - 90;
    const set = () => {
      const dn = below(), up = !dn && card.scrollTop > 20;
      j.classList.toggle('away', !dn && !up); j.dataset.go = dn ? 'down' : 'up';
      b.textContent = T(dn ? 'rig_results' : 'rig_picture');
      // never on the bench's own buttons (the largest text on a short board brings them down to the card's corner)
      j.classList.remove('left');
      if (!j.classList.contains('away')) {
        const br = b.getBoundingClientRect(), on = x => { const q = x.getBoundingClientRect(); return q.width && q.right > br.left && q.left < br.right && q.bottom > br.top && q.top < br.bottom; };
        if ([...el.querySelectorAll('.kit-ctrl .run, .kit-ctrl .big')].some(on)) j.classList.add('left');
      }
    };
    // the way is read afresh at the tap (a scroll event can lag behind the jump), and the label follows at once
    b.onclick = () => {
      AU.sfx('click'); j.classList.remove('new');
      card.scrollTo({ top: below() ? card.scrollHeight : 0, behavior: G.reduceMotion ? 'auto' : 'smooth' });
      set();
    };
    card.addEventListener('scroll', set, { passive: true });
    // in every mode the newest result stays marked (soft yellow, one pulse as it lands) until the next result, so the
    // class sees which row is the one just got. A bench whose result is several rows, or whose repeats read the same,
    // names its newest rows (data-new = the result's number, which only grows). The others are compared by text, since
    // they rebuild their tables whole: a row nobody had before is new (a repeat of a row counts as one more), and more
    // than three at once, or none of the old rows left, is a new layout (a reset, a new variable), not a result
    let known = null, fresh = new Set(), lastId = null, freshId = null;
    const mark = () => {
      const rows = [...rb.querySelectorAll('.rig-table tr')].filter(r => r.cells.length > 1 && !r.querySelector('th'));
      const nr = rows.find(r => r.dataset.new), id = nr ? nr.dataset.new : null;
      if (known) {
        if (id != null || lastId != null) {
          if (id == null) freshId = null;
          else if (lastId == null || +id > +lastId) { freshId = id; rows.forEach(r => { if (r.dataset.new === id) r.classList.add('pulse'); }); }
        } else {
          const pool = new Map(); known.forEach(t => pool.set(t, (pool.get(t) || 0) + 1));
          const add = rows.filter(r => { const n = pool.get(r.textContent) || 0; if (n) pool.set(r.textContent, n - 1); return !n; });
          if (add.length) {
            const lay = add.length > 3 || (add.length === rows.length && known.length > 1);
            fresh = new Set(lay ? [] : add.map(r => r.textContent));
            if (!lay) add.forEach(r => r.classList.add('pulse'));
          }
        }
      }
      // the highest number seen stays the mark's measure (a lower one is not news); rows without numbers start afresh
      lastId = id == null ? null : lastId == null || +id > +lastId ? id : lastId;
      known = rows.map(r => r.textContent);
      rows.forEach(r => r.classList.toggle('fresh', freshId != null ? r.dataset.new === freshId : fresh.has(r.textContent)));
      if (el._onMark) el._onMark();
    };
    const mo = new MutationObserver(() => {
      if (!el.isConnected) { mo.disconnect(); return; }
      set();
      if (seen !== null) mark();
      if (seen === null || rb.textContent === seen) return;
      seen = rb.textContent;
      if (below()) { j.classList.add('new'); clearTimeout(t); t = setTimeout(() => j.classList.remove('new'), 2600); }
    });
    mo.observe(rb, { childList: true, subtree: true, characterData: true });
    // the bench fills its table right after opening: only what changes after that is news
    setTimeout(() => { seen = rb.textContent; mark(); set(); }, 80);
  },
  confirm(text, yes, no) {
    return new Promise(res => {
      const el = h('div', 'modal confirm');
      el.innerHTML = `<div class="card paper small"><p>${U.esc(L(text))}</p><div class="card-foot"><button class="no">${U.esc(no || T('cancel'))}</button><button class="yes">${U.esc(yes || T('ok'))}</button></div></div>`;
      const end = v => { this._pop(el); res(v); };
      el.querySelector('.yes').onclick = () => { AU.sfx('click'); end(true); };
      el.querySelector('.no').onclick = () => { AU.sfx('click'); end(false); };
      el._key = e => { if (e.code === 'Escape') end(false); if (e.code === 'Enter') end(true); };
      this._push('confirm', el);
    });
  },
  // a fingertip number pad over a window, for the class's guess: resolves to what was typed ('12', '-3', '2,5'), or to
  // null. While it is up it takes the window's keys (digits, minus, comma, Backspace, Enter, Esc), and gives them back
  numPad(host, title) {
    return new Promise(res => {
      const pad = h('div', 'rf-pad');
      pad.innerHTML = `<div class="rf-padc"><div class="rf-padh"><b></b><button class="rf-pno" aria-label="${U.esc(T('cancel'))}" title="${U.esc(T('cancel'))}">✕</button></div><output class="rf-padv"></output><div class="rf-keys">${['7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0', ','].map(k => `<button data-k="${k}">${k === '-' ? '−' : k}</button>`).join('')}<button data-k="del" aria-label="⌫">⌫</button><button class="rf-pok">${U.esc(T('ok'))}</button></div></div>`;
      pad.querySelector('.rf-padh b').textContent = title;
      host.appendChild(pad);
      const out = pad.querySelector('.rf-padv'), ok = pad.querySelector('.rf-pok'), key0 = host._key;
      let typed = '';
      const set = v => { typed = v; out.textContent = v || '–'; ok.disabled = !/\d/.test(v); };
      const key = k => {
        if (k === 'del') set(typed.slice(0, -1));
        else if (k === '-') set(typed.startsWith('-') ? typed.slice(1) : '-' + typed);
        else if (k === ',') { if (!typed.includes(',')) set((/\d$/.test(typed) ? typed : typed + '0') + ','); }
        else if (typed.replace(/[-,]/g, '').length < 6) set(/^-?0$/.test(typed) ? typed.slice(0, -1) + k : typed + k);
      };
      const end = v => { if (!pad.isConnected) return; pad.remove(); host._key = key0; res(v); };
      const done = () => { if (/\d/.test(typed)) { AU.sfx('pen'); end(typed); } };
      pad.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { AU.sfx('click'); key(b.dataset.k); });
      pad.querySelector('.rf-pno').onclick = () => { AU.sfx('click'); end(null); };
      pad.onclick = e => { if (e.target === pad) { AU.sfx('click'); end(null); } };
      ok.onclick = done;
      host._key = e => {
        const d = /^(Digit|Numpad)(\d)$/.exec(e.code);
        if (d) key(d[2]);
        else if (e.code === 'Minus' || e.code === 'NumpadSubtract') key('-');
        else if (['Comma', 'Period', 'NumpadDecimal'].includes(e.code)) key(',');
        else if (e.code === 'Backspace') key('del');
        else if (e.code === 'Enter' || e.code === 'NumpadEnter') done();
        else if (e.code === 'Escape') end(null);
      };
      set('');
    });
  },
  notice(title, body, kind = 'case') {
    return new Promise(res => {
      const el = h('div', 'modal notice ' + kind);
      el.innerHTML = `<div class="card paper small"><div class="kicker">${U.esc(kind === 'case' ? T('new_case') : '')}</div><h2>${U.esc(L(title))}</h2><p>${U.esc(L(body))}</p><div class="card-foot"><button class="yes">${T('ok')}</button></div></div>`;
      const end = () => { this._pop(el); res(); };
      el.querySelector('.yes').onclick = () => { AU.sfx('page'); end(); };
      el._key = e => { if (e.code === 'Escape' || this.fwd(e.code)) end(); };
      AU.sfx(kind === 'case' ? 'chime' : 'success');
      this._push('notice', el);
    });
  },
  stamp(text, sub) {
    const el = h('div', 'stamp', `<div><b>${U.esc(text)}</b>${sub ? `<small>${U.esc(sub)}</small>` : ''}</div>`);
    this.root.appendChild(el);
    setTimeout(() => AU.sfx('stamp'), 120);
    setTimeout(() => el.classList.add('out'), 1300);
    setTimeout(() => el.remove(), 1800);
  },
  fade(fn, ms = 450) {
    return new Promise(res => {
      this.fadeEl.classList.add('on');
      setTimeout(async () => { if (fn) await fn(); this.fadeEl.classList.remove('on'); setTimeout(res, ms); }, ms);
    });
  },

  // ------------ keyboard while a modal / dialogue is up
  // the keys that go on: the usual three, and the forward key of a presentation clicker (PageDown, or → on some), so a
  // teacher walking among the class can run the story from the clicker in their hand
  fwd(code) { return ['Space', 'Enter', 'KeyE', 'PageDown', 'ArrowRight'].includes(code); },
  key(e) {
    const top = this.top();
    if (top) { if (top.el._key) top.el._key(e); return true; }
    if (this._dlgOpen) {
      if (e.code === 'PageUp' || e.code === 'ArrowLeft') this.peek(1);
      else if (this._peekI && (this.fwd(e.code) || e.code === 'Escape')) this.peek(0);
      else if (/^Digit[1-4]$/.test(e.code) && this._opts) this._optPick(+e.code.slice(5) - 1);
      else if (this.fwd(e.code)) this.advance();
      return true;
    }
    return false;
  },

  // ================= journal =================
  journal(tab) {
    if (G.busy) return;
    const cur = this.top();
    if (cur && cur.name === 'journal') { if (tab && tab !== this._jTab) this._jShow(tab); else this._pop(cur.el); return; }
    if (this._stack.length || this._dlgOpen) return;
    const el = h('div', 'modal journal-wrap');
    const tabs = ['cases', 'obs', 'exps', 'seeds', 'map', 'curr'];
    const tl = { cases: 'j_cases', obs: 'j_obs', exps: 'j_exps', seeds: 'j_seeds', map: 'j_map', curr: 'j_curr' };
    el.innerHTML = `<div class="journal"><div class="j-tabs">${tabs.map(t => `<button data-t="${t}">${T(tl[t])}</button>`).join('')}</div><div class="j-spread"><div class="j-page j-left"></div><div class="j-gutter"></div><div class="j-page j-right"></div></div><button class="x">${ICON.close}</button></div>`;
    el.querySelector('.j-tabs').onclick = e => { const b = e.target.closest('button'); if (b) { AU.sfx('page'); this._jShow(b.dataset.t); } };
    el.querySelector('.x').onclick = () => { AU.sfx('click'); this._pop(el); };
    el._key = e => { if (e.code === 'Escape' || e.code === 'KeyJ' || (e.code === 'KeyM' && this._jTab === 'map')) this._pop(el); else if (e.code === 'KeyM') this._jShow('map'); };
    this._jEl = el;
    this._push('journal', el);
    AU.sfx('page');
    this._jShow(tab || this._jTab || 'cases');
  },
  _jShow(tab) {
    this._jTab = tab;
    const el = this._jEl, L_ = el.querySelector('.j-left'), R_ = el.querySelector('.j-right');
    el.querySelectorAll('.j-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    el.querySelector('.journal').dataset.tab = tab;
    L_.innerHTML = ''; R_.innerHTML = '';
    this['_j_' + tab](L_, R_);
  },
  _j_cases(Lp, Rp) {
    const S = G.S;
    Lp.appendChild(h('h2', 'jh', T('j_cases')));
    const list = h('ul', 'case-list');
    let first = null;
    for (const id of CASE_ORDER) {
      const c = CASES[id], st = Q.state(id);
      const li = h('li', 'case ' + st, `<b>${st === 'locked' ? '· · ·' : U.esc(L(c.title))}</b><span>${T(st === 'done' ? 'j_done' : st === 'open' ? 'j_open' : 'j_locked')}</span>`);
      if (st !== 'locked') { li.onclick = () => { AU.sfx('pen'); list.querySelectorAll('li').forEach(x => x.classList.remove('sel')); li.classList.add('sel'); this._jCase(Rp, id); }; if (!first || (st === 'open' && Q.state(first) !== 'open')) first = id; }
      list.appendChild(li);
    }
    Lp.appendChild(list);
    const fixed = S.answers.filter(a => !a.ok && a.tag);
    if (fixed.length) {
      Lp.appendChild(h('h4', 'jh4', T('j_misc')));
      const ul = h('ul', 'misc');
      const seen = new Set();
      for (const a of fixed) { if (seen.has(a.tag)) continue; seen.add(a.tag); const m = MISC[a.tag]; if (m) ul.appendChild(h('li', '', `<s>${U.esc(L(m.wrong))}</s> → ${U.esc(L(m.right))}`)); }
      Lp.appendChild(ul);
    }
    if (first) { this._jCase(Rp, first); const li = [...list.children][CASE_ORDER.indexOf(first)]; if (li) li.classList.add('sel'); }
    else Rp.appendChild(h('p', 'hint', T('j_pick_case')));
  },
  _jCase(Rp, id) {
    const c = CASES[id], S = G.S, st = Q.state(id), cur = Q.stepIndex(id);
    Rp.innerHTML = '';
    const head = h('div', 'case-head', `<small>${U.esc(L(WORLD.regions[c.region].name))}</small><h2>${U.esc(L(c.title))}</h2>`);
    if (st === 'done') head.appendChild(h('div', 'mini-stamp', T('solved')));
    Rp.appendChild(head);
    Rp.appendChild(h('p', 'blurb', U.esc(L(c.blurb))));
    Rp.appendChild(h('h4', 'jh4', T('j_steps')));
    const ol = h('ol', 'steps');
    c.steps.forEach((s, i) => { if (i > cur && st !== 'done') return; ol.appendChild(h('li', i < cur || st === 'done' ? 'done' : 'now', U.esc(L(s.t)))); });
    Rp.appendChild(ol);
    Rp.appendChild(h('h4', 'jh4', T('j_outcomes')));
    Rp.appendChild(h('div', 'codes', c.codes.map(k => `<span>${U.esc(currText(k))}</span>`).join('')));
    const ans = S.answers.filter(a => a.case === id);
    if (ans.length) {
      Rp.appendChild(h('h4', 'jh4', T('j_answers')));
      Rp.appendChild(h('ul', 'ans-list', ans.map(a => `<li class="${a.ok ? 'ok' : 'retry'}">${a.ok ? '✓' : '↻'} ${U.esc(a.q)}${a.sure ? ' · ' + T('sure') : ''}</li>`).join('')));
    }
  },
  // the specimen cabinet: every specimen as a drawer, each opening straight onto the specimen table
  _j_obs(Lp, Rp) {
    const S = G.S, all = Object.keys(OBS).length, found = Object.keys(S.journal.obs).length;
    Lp.appendChild(h('h2', 'jh', T('j_cabinet')));
    Lp.appendChild(h('p', 'count', T('j_found', { a: found, b: all })));
    const grid = h('div', 'cabinet');
    let first = null;
    for (const id in SPECS) {
      const sp = SPECS[id], open = STUDY.canOpen(id), pr = STUDY.specProgress(id);
      const stars = sp.levels.map((lv, l) => { const r = STUDY.reviewOf(id, l); return r ? (r.best >= r.n ? '★' : '✓') : '·'; }).join('');
      const b = h('button', 'spec-card' + (open ? '' : ' unk'), `<canvas width="150" height="112"></canvas><b>${open ? U.esc(L(sp.name)) : '?'}</b><small>${pr.a}/${pr.b} <i>${stars}</i></small>`);
      const cv = b.querySelector('canvas');
      if (open) LENS.thumb(cv, id, 0); else this._jSketch(cv);
      b.onclick = () => { AU.sfx('pen'); grid.querySelectorAll('.sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); this._jSpec(Rp, id); };
      grid.appendChild(b);
      if (!first && open && pr.a) first = [b, id];
    }
    Lp.appendChild(grid);
    Lp.appendChild(this._jCritters(Rp));
    if (first) { first[0].classList.add('sel'); this._jSpec(Rp, first[1]); }
    else Rp.appendChild(h('p', 'hint', T('j_pick_spec')));
  },
  // the valley's small lives: a picture once spotted, a question mark before; tap one to read about it
  _jCritters(Rp) {
    const J = G.S.journal.critters || {}, all = W.CRITTERS, box = h('div', 'critters');
    box.appendChild(h('h4', 'jh4', `${T('j_critters')} · ${all.filter(k => J[k]).length}/${all.length}`));
    const row = h('div', 'crit-row');
    for (const k of all) {
      const seen = !!J[k], b = h('button', 'crit' + (seen ? ' seen' : ''), `<canvas width="144" height="112"></canvas><b>${seen ? U.esc(T('cr_' + k)) : '?'}</b><small>${seen ? '× ' + J[k] : ''}</small>`);
      const cv = b.querySelector('canvas');
      if (seen) PART.icon(cv, k); else this._jSketch(cv);
      b.onclick = () => {
        if (!seen) { AU.sfx('click'); this.toast(T('j_crit_hint'), '?'); return; }
        AU.sfx('pen');
        const jr = box.closest('.journal'); if (jr) jr.querySelectorAll('.sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel');
        Rp.innerHTML = '';
        Rp.appendChild(h('div', 'crit-page', `<canvas width="288" height="224"></canvas><h2>${U.esc(T('cr_' + k))}</h2><p>${U.esc(T('cr_' + k + '_f'))}</p><p class="count">${U.esc(T('cr_seen_n', { n: J[k] }))}</p>`));
        PART.icon(Rp.querySelector('.crit-page canvas'), k);
      };
      row.appendChild(b);
    }
    box.appendChild(row);
    if (!all.some(k => J[k])) box.appendChild(h('p', 'hint', T('j_crit_hint')));
    return box;
  },
  // a sighting in the valley: a small card with a fact the first time, a toast after that
  spotted(kind, n) {
    const all = W.CRITTERS, J = G.S.journal.critters || {}, seen = all.filter(k => J[k]).length, name = T('cr_' + kind);
    if (n > 1) { this.toast(`${name} · ${T('cr_again', { n })}`, '◉'); AU.sfx('click'); return; }
    document.querySelectorAll('.spot-card').forEach(x => x.remove());
    const el = h('div', 'spot-card', `<canvas width="144" height="112"></canvas><div><small>${T('cr_new')}</small><b>${U.esc(name)}</b><p>${U.esc(T('cr_' + kind + '_f'))}</p><em>${U.esc(seen === all.length ? T('cr_all') : T('cr_count', { a: seen, b: all.length }))}</em></div>`);
    PART.icon(el.querySelector('canvas'), kind);
    this.hud.appendChild(el);
    AU.sfx('success');
    const out = () => { if (!el.isConnected) return; el.classList.add('out'); setTimeout(() => el.remove(), 400); };
    el.onclick = out; setTimeout(out, 11000);
  },
  _jSketch(cv) {
    const x = cv.getContext('2d');
    x.fillStyle = '#E9E1CC'; x.fillRect(0, 0, cv.width, cv.height);
    x.strokeStyle = 'rgba(27,26,23,0.25)'; x.setLineDash([4, 4]); x.lineWidth = 1.5; x.strokeRect(6, 6, cv.width - 12, cv.height - 12); x.setLineDash([]);
    x.fillStyle = 'rgba(27,26,23,0.3)'; x.font = '700 44px "Bodoni Moda", serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', cv.width / 2, cv.height / 2 + 2);
  },
  _jSpec(Rp, id) {
    const sp = SPECS[id], open = STUDY.canOpen(id);
    Rp.innerHTML = '';
    Rp.appendChild(h('h2', 'obs-t', open ? U.esc(L(sp.name)) : '?'));
    if (!open) { Rp.appendChild(h('p', 'hint', T('st_locked'))); return; }
    sp.levels.forEach((lv, l) => {
      const parts = STUDY.partsOf(id, l), r = STUDY.reviewOf(id, l);
      Rp.appendChild(h('h4', 'jh4', `${U.esc(L(lv.tag))} <span>${parts.filter(p => G.S.journal.obs[p.id]).length}/${parts.length}${r ? ' · ' + T('st_sum_p', { a: r.best, b: r.n }) : ''}</span>`));
      const ul = h('ul', 'part-list');
      for (const p of parts) {
        const f = !!G.S.journal.obs[p.id], li = h('li', f ? 'f' : 'u', f ? `<button><b>${p.n}</b>${U.esc(L(OBS[p.id].title))}<small>${U.esc(currText(OBS[p.id].code))}</small></button>` : `<span><b>${p.n}</b>· · ·</span>`);
        if (f) li.querySelector('button').onclick = () => this._jStudy(id, l, p.id);
        ul.appendChild(li);
      }
      Rp.appendChild(ul);
    });
    const go = h('button', 'big yes st-open', `${ICON.lens}<span>${T('st_open')}</span>`);
    go.onclick = () => this._jStudy(id, 0, null);
    Rp.appendChild(go);
  },
  _jStudy(id, l, focus) {
    AU.sfx('page');
    const cur = this.top(); if (cur && cur.name === 'journal') this._pop(cur.el);
    setTimeout(() => STUDY.open({ spec: id }, l, focus, null, { onClose: () => this.journal('obs') }), 120);
  },
  _j_exps(Lp, Rp) {
    const S = G.S, ex = S.journal.exps;
    Lp.appendChild(h('h2', 'jh', T('j_exps')));
    if (!ex.length) { Lp.appendChild(h('p', 'hint', T('j_empty_exps'))); return; }
    const list = h('ul', 'case-list');
    ex.forEach((e, i) => { const li = h('li', 'case', `<b>${U.esc(L(e.title))}</b><span>${new Date(e.t).toLocaleDateString(I18N.lang === 'tr' ? 'tr-TR' : 'en-GB')}</span>`); li.onclick = () => { AU.sfx('pen'); list.querySelectorAll('li').forEach(x => x.classList.remove('sel')); li.classList.add('sel'); this._jExp(Rp, e); }; list.appendChild(li); });
    Lp.appendChild(list);
    list.lastChild.classList.add('sel');
    this._jExp(Rp, ex[ex.length - 1]);
  },
  _jExp(Rp, e) {
    Rp.innerHTML = '';
    Rp.appendChild(h('h2', 'obs-t', U.esc(L(e.title))));
    if (e.code) Rp.appendChild(h('div', 'codes', `<span>${U.esc(currText(e.code))}</span>`));
    if (e.head) {
      const tb = h('table', 'exp-table');
      tb.innerHTML = `<tr>${e.head.map(c => `<th>${U.esc(L(c))}</th>`).join('')}</tr>` + e.rows.map(r => `<tr>${r.map(c => `<td>${U.esc(L(c))}</td>`).join('')}</tr>`).join('');
      Rp.appendChild(tb);
    }
    if (e.chart) { const cv = h('canvas', 'exp-chart'); cv.width = 380; cv.height = 180; Rp.appendChild(cv); this._chart(cv, e.chart); }
    if (e.stamps) Rp.appendChild(h('div', 'stamps', e.stamps.map(s => `<span class="ms ${s.ok ? '' : 'no'}">${U.esc(L(s.t))}</span>`).join('')));
    if (e.note) Rp.appendChild(h('p', 'obs-txt hand', U.esc(L(e.note))));
  },
  // (a canvas's _k draws the same chart at k backing pixels a unit, sharp at any size: the big view's chart is 360 units
  // wide like the bench's own; the last chart drawn on a canvas is kept on it, and its _onChart hears of every redraw)
  _chart(cv, c) {
    const x = cv.getContext('2d'), k = cv._k || 1, w = cv.width / k, hh = cv.height / k, pad = 30;
    x.setTransform(k, 0, 0, k, 0, 0);
    x.fillStyle = '#FBF7EC'; x.fillRect(0, 0, w, hh);
    x.strokeStyle = 'rgba(60,90,120,0.15)'; x.lineWidth = 1;
    for (let gx = pad; gx < w; gx += 20) { x.beginPath(); x.moveTo(gx, 8); x.lineTo(gx, hh - pad); x.stroke(); }
    for (let gy = hh - pad; gy > 8; gy -= 20) { x.beginPath(); x.moveTo(pad, gy); x.lineTo(w - 8, gy); x.stroke(); }
    x.strokeStyle = '#1B1A17'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(pad, 8); x.lineTo(pad, hh - pad); x.lineTo(w - 8, hh - pad); x.stroke();
    // bars stand on zero; when some values are negative, zero moves up and those bars hang below it
    const max = Math.max(1, ...c.values), min = Math.min(0, ...c.values), n = c.values.length, bw = (w - pad - 20) / n;
    const span = max - min, base = hh - pad - (hh - pad - 16) * -min / span;
    if (min < 0) { x.strokeStyle = '#1B1A17'; x.lineWidth = 1; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(pad, base); x.lineTo(w - 8, base); x.stroke(); x.setLineDash([]); }
    c.values.forEach((v, i) => {
      const bx = pad + 6 + i * bw, bh = (hh - pad - 16) * v / span;
      x.fillStyle = c.colors ? c.colors[i] : '#6E8F4E'; x.fillRect(bx, base - bh, bw - 12, bh);
      x.strokeStyle = '#1B1A17'; x.lineWidth = 1; x.strokeRect(bx, base - bh, bw - 12, bh);
      x.fillStyle = '#1B1A17'; x.font = '700 11px "Courier Prime", monospace'; x.textAlign = 'center';
      x.fillText(String(Math.round(v * 10) / 10), bx + (bw - 12) / 2, v >= 0 ? base - bh - 5 : base - bh + 13);
      x.fillText(L(c.labels[i]), bx + (bw - 12) / 2, hh - pad + 15);
    });
    if (c.unit) { x.save(); x.translate(12, hh / 2); x.rotate(-Math.PI / 2); x.textAlign = 'center'; x.font = '600 11px "Atkinson Hyperlegible Next", sans-serif'; x.fillText(L(c.unit), 0, 0); x.restore(); }
    cv._chartData = c; if (cv._onChart) cv._onChart();
  },
  _j_seeds(Lp, Rp) {
    const S = G.S;
    Lp.appendChild(h('h2', 'jh', T('j_seeds')));
    const box = h('div', 'envelopes');
    for (const id in SEEDS) {
      const sd = SEEDS[id], has = S.journal.seeds.includes(id);
      const b = h('button', 'envelope' + (has ? '' : ' empty'), has ? `<span class="hand">${U.esc(L(sd.name))}</span><small>${U.esc(sd.latin)}</small>` : '<span class="hand">?</span>');
      b.style.setProperty('--tint', sd.tint);
      if (has) b.onclick = () => { AU.sfx('page'); box.querySelectorAll('.sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); this._jSeed(Rp, id); };
      box.appendChild(b);
    }
    Lp.appendChild(box);
    const first = S.journal.seeds[S.journal.seeds.length - 1];
    if (first) this._jSeed(Rp, first);
  },
  _jSeed(Rp, id) {
    const sd = SEEDS[id];
    Rp.innerHTML = '';
    Rp.appendChild(h('h2', 'obs-t', U.esc(L(sd.name))));
    Rp.appendChild(h('div', 'codes', `<span><i>${U.esc(sd.latin)}</i></span><span>${U.esc(L(sd.from))}</span>`));
    Rp.appendChild(h('p', 'obs-txt', U.esc(L(sd.text))));
    if (sd.note) Rp.appendChild(h('p', 'obs-txt hand', '“' + U.esc(L(sd.note)) + '” — ' + NAMES.nebahat()));
  },
  _j_map(Lp, Rp) {
    const J = this._jEl.querySelector('.j-spread');
    const cv = h('canvas', 'map-cv');
    const hint = h('p', 'map-hint', T('j_map_hint'));
    Lp.appendChild(hint); Lp.appendChild(cv);
    const draw = () => {
      const r = Lp.getBoundingClientRect(), r2 = Rp.getBoundingClientRect();
      const w = Math.round(r2.right - r.left - 40), hh = Math.round(w * WORLD.H / WORLD.W);
      cv.style.width = w + 'px'; cv.style.height = hh + 'px';
      cv.width = w * G.dpr; cv.height = hh * G.dpr;
      MAPDRAW.draw(cv, w, hh);
    };
    requestAnimationFrame(draw);
    cv.onclick = e => {
      const r = cv.getBoundingClientRect(), wx = (e.clientX - r.left) / r.width * WORLD.W, wy = (e.clientY - r.top) / r.height * WORLD.H;
      let best = null, bd = 1e9;
      for (const k in WORLD.regions) { const g = WORLD.regions[k], d = Math.hypot(g.x - wx, g.y - wy); if (d < bd) { bd = d; best = k; } }
      W.waypoint = { x: wx, y: wy };
      G.S.waypoint = W.waypoint;
      AU.sfx('stamp');
      this.toast(T('j_waypoint', { p: L(WORLD.regions[best].name) }), '➶');
      draw();
    };
  },
  _j_curr(Lp, Rp) {
    Lp.appendChild(h('h2', 'jh', T('j_curr')));
    Lp.appendChild(h('p', 'hint', T('j_curr_hint')));
    const st = CURR.status();
    const box = h('div', 'curr');
    for (const th of CURR.themes) {
      box.appendChild(h('h4', 'jh4', U.esc(L(th.name))));
      box.appendChild(h('ul', 'curr-list', th.items.map(([code, txt]) => `<li class="s${st[code] || 0}"><i>${['○', '◐', '●'][st[code] || 0]}</i> ${U.esc(L(txt))}</li>`).join('')));
    }
    const half = h('div', 'curr');
    const nodes = [...box.children], cut = Math.ceil(nodes.length / 2 / 2) * 2;
    nodes.slice(cut).forEach(n => half.appendChild(n));
    Lp.appendChild(box); Rp.appendChild(half);
    const ex = h('div', 'export', `<button class="big">${T('j_export')}</button><p class="hint">${T('j_export_hint')}</p>`);
    ex.querySelector('button').onclick = () => { AU.sfx('stamp'); CURR.export(); };
    if (SYNC.url() && !G.demo) ex.prepend(SYNC.box());
    Rp.appendChild(ex);
  },

  // ================= settings =================
  settings() {
    const cur = this.top();
    if (cur && cur.name === 'settings') { this._pop(cur.el); return; }
    if (cur && cur.name !== 'journal') return;
    if (cur) this._pop(cur.el);
    const s = G.set, el = h('div', 'modal settings');
    const tog = (k, lab) => `<label class="row"><span>${T(lab)}</span><button class="tog ${s[k] ? 'on' : ''}" data-k="${k}">${s[k] ? T('s_on') : T('s_off')}</button></label>`;
    el.innerHTML = `<div class="card paper">
      <div class="panel-head"><h3>${T('settings')}</h3><button class="x">${ICON.close}</button></div>
      <label class="row"><span>${T('s_lang')}</span><span class="seg"><button data-lang="tr" class="${I18N.lang === 'tr' ? 'on' : ''}">Türkçe</button><button data-lang="en" class="${I18N.lang === 'en' ? 'on' : ''}">English</button></span></label>
      <label class="row"><span>${T('s_music')}</span><input type="range" min="0" max="100" data-v="music" value="${Math.round(s.music * 100)}"></label>
      <label class="row"><span>${T('s_sfx')}</span><input type="range" min="0" max="100" data-v="sfx" value="${Math.round(s.sfx * 100)}"></label>
      <label class="row"><span>${T('s_text')}</span><span class="seg">${[0.9, 1, 1.15, 1.3].map(v => `<button data-ts="${v}" class="${s.text === v ? 'on' : ''}" style="font-size:${v}em">Aa</button>`).join('')}</span></label>
      ${tog('board', 's_board')}${tog('vivid', 's_vivid')}
      <label class="row"><span>${T('s_think')}</span><span class="seg">${[0, 10, 20, 30].map(v => `<button data-th="${v}" class="${(+s.think || 0) === v ? 'on' : ''}">${v ? v + ' ' + T('sec') : T('s_off')}</button>`).join('')}</span></label>
      ${tog('motion', 's_motion')}${tog('conf', 's_conf')}${tog('tts', 's_tts')}
      <div class="controls"><h4>${T('s_controls')}</h4><p>${T(s.board ? 's_controls_board' : 's_controls_txt')}</p></div>
      <div class="card-foot"><button class="danger reset">${T('s_reset')}</button>${G.mode === 'play' ? `<button class="menu">${T('s_title')}</button>` : ''}<button class="yes done">${T('ok')}</button></div>
    </div>`;
    const close = () => { this._pop(el); G.saveSettings(); };
    el.querySelector('.x').onclick = close; el.querySelector('.done').onclick = close;
    el.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { G.setLang(b.dataset.lang); close(); this.settings(); });
    el.querySelectorAll('input[type=range]').forEach(r => r.oninput = () => { s[r.dataset.v] = r.value / 100; AU.vol.music = s.music; AU.vol.sfx = s.sfx; AU.setVol(); if (r.dataset.v === 'sfx') AU.sfx('click'); });
    el.querySelectorAll('[data-ts]').forEach(b => b.onclick = () => { s.text = +b.dataset.ts; G.applySettings(); el.querySelectorAll('[data-ts]').forEach(x => x.classList.toggle('on', x === b)); });
    el.querySelectorAll('.tog').forEach(b => b.onclick = () => { s[b.dataset.k] = !s[b.dataset.k]; b.classList.toggle('on', s[b.dataset.k]); b.textContent = s[b.dataset.k] ? T('s_on') : T('s_off'); G.applySettings(); AU.sfx('click'); if (b.dataset.k === 'board') el.querySelector('.controls p').textContent = T(s.board ? 's_controls_board' : 's_controls_txt'); });
    el.querySelectorAll('[data-th]').forEach(b => b.onclick = () => { s.think = +b.dataset.th; el.querySelectorAll('[data-th]').forEach(x => x.classList.toggle('on', x === b)); AU.sfx('click'); });
    el.querySelector('.reset').onclick = async () => { if (await this.confirm(T('s_reset_q'), T('s_reset_yes'))) { G.wipe(); } };
    const mb = el.querySelector('.menu'); if (mb) mb.onclick = () => { close(); G.toTitle(); };
    el._key = e => { if (e.code === 'Escape') close(); };
    this._push('settings', el);
  },

  // ================= season postcard =================
  season(lines) {
    return new Promise(res => {
      const S = G.S, el = h('div', 'modal season');
      const name = SEASON_NAMES()[S.season];
      el.innerHTML = `<div class="postcard"><div class="pc-front"><canvas></canvas><div class="pc-title">${U.esc(name)}<small>${T('year_n', { n: S.year })}</small></div></div>
        <div class="pc-back"><div class="pc-stamp"><canvas width="90" height="110"></canvas></div><div class="pc-post">${U.esc(L({ tr: 'Denizli · Saha İstasyonu', en: 'Denizli · Field Station' }))}</div>
        <div class="pc-text hand">${lines.map(l => `<p>${U.esc(L(l))}</p>`).join('')}</div><button class="yes">${T('season_cont')} →</button></div></div>`;
      const front = el.querySelector('.pc-front canvas');
      front.width = 520; front.height = 360;
      POSTCARD.paint(front, S.season, S.restored);
      POSTCARD.stamp(el.querySelector('.pc-stamp canvas'), S.season);
      el.querySelector('.yes').onclick = () => { AU.sfx('page'); this._pop(el); res(); };
      el._key = e => { if (e.code === 'Escape' || this.fwd(e.code)) el.querySelector('.yes').click(); };
      AU.sfx('chime');
      this._push('season', el);
    });
  },
};

// ---------------------------------------------------------------- map drawing (journal)
const MAPDRAW = {
  // what each building is called on the map (a getter: ui.js loads before cases.js defines tr)
  get NAMES() { return {
    hub: tr('Okul · Saha İstasyonu', 'School · Field Station'), greenhouse: tr('Sera', 'Greenhouse'), barn: tr('Ahır', 'Barn'), riza: tr('Rıza Dede', 'Rıza Dede'),
    shed: tr('Kulübe', 'Shed'), clinic: tr('Sağlık Ocağı', 'Health Centre'), firin: tr('Fırın', 'Bakery'), kahve: tr('Kahvehane', 'Teahouse'),
    songul: tr('Songül', 'Songül'), station: tr('Durak', 'Halt'), seedbank: tr('Tohum Bankası', 'Seed Bank'), yaylaevi: tr('Yayla evi', 'Yayla hut'),
  }; },
  ROOF: { school: '#9A4A32', glass: '#BFD8DC', barn: '#8A3A2A', house: '#B5653E', shed: '#7A6A55', clinic: '#E4E0D6', bakery: '#C07A48', kahve: '#A0583A', station: '#6A7A8A', vault: '#8C8C82', yayla: '#6E8A4A' },
  draw(cv, w, hh) {
    const x = cv.getContext('2d'), s = w / WORLD.W, S = G.S, Wd = WORLD, R = U.rng(31), lang = I18N.lang;
    x.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    // old paper: a warm wash, lighter in the middle, speckled, browned towards the edges
    x.fillStyle = '#EDE1C2'; x.fillRect(0, 0, w, hh);
    let g = x.createRadialGradient(w / 2, hh / 2, 10, w / 2, hh / 2, Math.max(w, hh) * 0.7);
    g.addColorStop(0, 'rgba(255,250,232,0.55)'); g.addColorStop(1, 'rgba(150,110,60,0.28)'); x.fillStyle = g; x.fillRect(0, 0, w, hh);
    for (let i = 0; i < 1400; i++) { x.fillStyle = R() < 0.5 ? 'rgba(120,90,50,0.07)' : 'rgba(255,255,255,0.12)'; x.fillRect(R() * w, R() * hh, 1.2, 1.2); }
    x.save(); x.scale(s, s);
    const poly = (pts, fill, stroke, lw) => { x.beginPath(); U.path(x, pts, true); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.stroke(); } };
    // the land: grass everywhere, the forest in the north-west, the meadow, the rock with the yayla in its hollow
    x.fillStyle = 'rgba(150,176,110,0.22)'; x.fillRect(0, 0, Wd.W, Wd.H);
    if (Wd.forestPoly) poly(Wd.forestPoly, 'rgba(92,124,70,0.32)');
    if (Wd.meadowPoly) { poly(Wd.meadowPoly, 'rgba(206,196,110,0.35)'); for (let i = 0; i < 90; i++) { const px = 2860 + R() * 900, py = 740 + R() * 560; if (!U.inPoly(px, py, Wd.meadowPoly)) continue; x.strokeStyle = 'rgba(110,120,50,0.55)'; x.lineWidth = 7; x.beginPath(); x.moveTo(px - 14, py); x.lineTo(px - 4, py - 22); x.moveTo(px, py); x.lineTo(px + 2, py - 28); x.moveTo(px + 12, py); x.lineTo(px + 6, py - 20); x.stroke(); } }
    if (Wd.rockPoly) {
      poly(Wd.rockPoly, '#B8AD98', 'rgba(60,50,40,0.7)', 10);
      x.save(); x.beginPath(); U.path(x, Wd.rockPoly, true); x.clip();
      x.strokeStyle = 'rgba(70,60,50,0.35)'; x.lineWidth = 8; for (let k = -40; k < 40; k++) { x.beginPath(); x.moveTo(3700 + k * 60, 0); x.lineTo(3700 + k * 60 + 500, 800); x.stroke(); }
      x.restore();
      if (Wd.yaylaPoly) poly(Wd.yaylaPoly, '#B7C98A', 'rgba(70,90,50,0.8)', 8);
    }
    // yards of beaten earth
    for (const y of Wd.yards || []) poly(y, 'rgba(196,168,120,0.55)');
    // paths: a dark edge and a pale middle
    x.lineCap = 'round'; x.lineJoin = 'round';
    for (const p of Wd.paths) { x.setLineDash(p.main ? [] : [40, 26]); x.strokeStyle = 'rgba(120,90,55,0.75)'; x.lineWidth = p.w * 0.9; x.beginPath(); U.path(x, p.pts, false); x.stroke(); x.strokeStyle = 'rgba(232,212,170,0.9)'; x.lineWidth = p.w * 0.5; x.stroke(); }
    x.setLineDash([]);
    // the river with its banks, the pond, the bridges
    const rp = W.riverPts || Wd.riverCtl;
    x.strokeStyle = '#4E7E92'; x.lineWidth = 92; x.beginPath(); U.path(x, rp, false); x.stroke();
    x.strokeStyle = '#8FC0D2'; x.lineWidth = 70; x.stroke();
    x.strokeStyle = 'rgba(255,255,255,0.4)'; x.lineWidth = 8; x.setLineDash([60, 90]); x.stroke(); x.setLineDash([]);
    poly(W.pondPts || U.blob(Wd.pond.x, Wd.pond.y, Wd.pond.rx, Wd.pond.ry, 16, 0.1, 5), '#8FC0D2', '#4E7E92', 12);
    x.strokeStyle = 'rgba(255,255,255,0.45)'; x.lineWidth = 7; for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(Wd.pond.x - 120 + k * 50, Wd.pond.y - 40 + k * 30); x.lineTo(Wd.pond.x - 60 + k * 50, Wd.pond.y - 40 + k * 30); x.stroke(); }
    for (const b of Wd.bridges) {
      const nx = b.nx != null ? b.nx : 0, ny = b.ny != null ? b.ny : 1;
      x.strokeStyle = '#6A4A2A'; x.lineWidth = b.w * 0.8; x.lineCap = 'butt'; x.beginPath(); x.moveTo(b.x - nx * b.len / 2, b.y - ny * b.len / 2); x.lineTo(b.x + nx * b.len / 2, b.y + ny * b.len / 2); x.stroke();
      x.strokeStyle = '#B48A5A'; x.lineWidth = b.w * 0.55; x.stroke(); x.lineCap = 'round';
    }
    // the hot spring: a blue pool ringed with yellow sulphur
    x.fillStyle = '#E2C04A'; x.beginPath(); x.ellipse(4290, 700, 110, 70, 0, 0, TAU); x.fill();
    x.fillStyle = '#3FA8C8'; x.beginPath(); x.ellipse(4290, 700, 74, 44, 0, 0, TAU); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 6; x.stroke();
    // fields with rows of crop, the paddocks with their gates
    for (const f of Wd.fields) {
      x.save(); x.translate(f.x + f.w / 2, f.y + f.h / 2); x.rotate(f.ang || 0);
      x.fillStyle = '#D4BC78'; x.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
      x.strokeStyle = 'rgba(110,130,60,0.55)'; x.lineWidth = 9; for (let k = -f.w / 2 + 22; k < f.w / 2; k += 34) { x.beginPath(); x.moveTo(k, -f.h / 2 + 12); x.lineTo(k, f.h / 2 - 12); x.stroke(); }
      x.strokeStyle = '#1B1A17'; x.lineWidth = 7; x.strokeRect(-f.w / 2, -f.h / 2, f.w, f.h);
      x.fillStyle = 'rgba(244,238,221,0.9)'; x.beginPath(); x.arc(0, 0, 62, 0, TAU); x.fill(); x.fillStyle = '#1B1A17'; x.font = '700 90px "Courier Prime", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(f.id, 0, 4);
      x.restore();
    }
    for (const p of Wd.paddocks) {
      x.fillStyle = p.id === 'clover' ? 'rgba(150,190,110,0.45)' : 'rgba(170,196,120,0.4)'; x.fillRect(p.x, p.y, p.w, p.h);
      x.strokeStyle = '#6A4A2A'; x.lineWidth = 9; x.setLineDash([26, 16]);
      const gt = p.gate, sides = { n: [[p.x, p.y], [p.x + p.w, p.y]], s: [[p.x, p.y + p.h], [p.x + p.w, p.y + p.h]], w: [[p.x, p.y], [p.x, p.y + p.h]], e: [[p.x + p.w, p.y], [p.x + p.w, p.y + p.h]] };
      for (const k in sides) {
        const [a, b] = sides[k];
        if (gt && gt.side === k) { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], Math.min(b[1], gt.a)); x.moveTo(a[0], Math.max(a[1], gt.b)); x.lineTo(b[0], b[1]); x.stroke(); }
        else { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
      }
      x.setLineDash([]);
      x.fillStyle = 'rgba(27,26,23,0.7)'; x.font = 'italic 70px "Caveat", cursive'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(L(p.id === 'clover' ? tr('yonca ağılı', 'clover paddock') : tr('çayır ağılı', 'grass paddock')), p.x + p.w / 2, p.y + p.h / 2);
    }
    // trees: a shadow and a round crown each; poplars tall and thin
    for (const t of W.trees || []) {
      const r = (t.type === 'poplar' ? 16 : 26) * (t.s || 1);
      x.fillStyle = 'rgba(40,50,20,0.25)'; x.beginPath(); x.ellipse(t.x + 10, t.y + 6, r, r * 0.6, 0, 0, TAU); x.fill();
      x.fillStyle = t.type === 'poplar' ? '#5E7E3E' : t.type === 'fruit' ? '#6E9448' : '#58783A';
      x.beginPath(); if (t.type === 'poplar') x.ellipse(t.x, t.y - r, r * 0.6, r * 1.3, 0, 0, TAU); else x.arc(t.x, t.y - r * 0.6, r, 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,255,220,0.25)'; x.beginPath(); x.arc(t.x - r * 0.3, t.y - r * 0.9, r * 0.4, 0, TAU); x.fill();
    }
    // buildings from above: a shadow, the roof in its own colour, the ridge, and the name underneath
    for (const b of Wd.buildings) {
      x.fillStyle = 'rgba(40,30,20,0.3)'; x.fillRect(b.x + 18, b.y + 18, b.w, b.d);
      x.fillStyle = this.ROOF[b.kind] || '#B5653E'; x.fillRect(b.x, b.y, b.w, b.d);
      x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(b.x, b.y + b.d / 2, b.w, b.d / 2);
      x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 6; x.beginPath(); x.moveTo(b.x + 10, b.y + b.d / 2); x.lineTo(b.x + b.w - 10, b.y + b.d / 2); x.stroke();
      x.strokeStyle = '#1B1A17'; x.lineWidth = 8; x.strokeRect(b.x, b.y, b.w, b.d);
      if (b.kind === 'clinic') { x.fillStyle = '#C0302A'; x.fillRect(b.x + b.w / 2 - 12, b.y + b.d / 2 - 40, 24, 80); x.fillRect(b.x + b.w / 2 - 40, b.y + b.d / 2 - 12, 80, 24); }
      if (b.kind === 'glass') { x.strokeStyle = 'rgba(60,90,100,0.6)'; x.lineWidth = 4; for (let k = b.x + 40; k < b.x + b.w; k += 40) { x.beginPath(); x.moveTo(k, b.y); x.lineTo(k, b.y + b.d); x.stroke(); } }
      const nm = this.NAMES[b.id];
      if (nm) {
        x.font = '700 64px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'top';
        const t = L(nm), tw = x.measureText(t).width;
        x.fillStyle = 'rgba(244,238,221,0.85)'; x.fillRect(b.x + b.w / 2 - tw / 2 - 14, b.y + b.d + 14, tw + 28, 76);
        x.fillStyle = '#1B1A17'; x.fillText(t, b.x + b.w / 2, b.y + b.d + 22);
      }
    }
    // the stork's nest and the well
    x.fillStyle = '#7A5A34'; x.beginPath(); x.arc(2560, 1262, 34, 0, TAU); x.fill(); x.fillStyle = '#F4F4F0'; x.beginPath(); x.ellipse(2560, 1250, 22, 12, 0, 0, TAU); x.fill();
    x.fillStyle = '#6E9DB0'; x.beginPath(); x.arc(2190, 2300, 24, 0, TAU); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 7; x.stroke();
    // region names in a hand; a flower where the valley is well again
    for (const k in Wd.regions) {
      const r = Wd.regions[k], vis = S.visited[k], ly = r.y - r.r * 0.45;
      x.font = `${vis ? '700' : '400'} 150px "Caveat", cursive`; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      const t = vis ? L(r.name) : '?';
      x.lineWidth = 26; x.strokeStyle = 'rgba(244,238,221,0.8)'; x.strokeText(t, r.x, ly);
      x.fillStyle = vis ? '#2A2418' : 'rgba(27,26,23,0.35)'; x.fillText(t, r.x, ly);
      if (S.restored[k]) { x.fillStyle = '#A0322A'; x.font = '700 100px "Courier Prime", monospace'; x.fillText('✿', r.x, ly - 140); }
    }
    // a pin for every open case at the place it starts; the one you are following is bigger and named
    for (const id in S.cases) {
      const c = S.cases[id], at = typeof DEMO !== 'undefined' && DEMO.START[id];
      if (!at || c.done || id === 'intro') continue;
      const big = S.focus === id, r = big ? 70 : 48;
      x.fillStyle = 'rgba(0,0,0,0.3)'; x.beginPath(); x.ellipse(at[0] + 14, at[1] + 6, r * 0.7, r * 0.3, 0, 0, TAU); x.fill();
      x.fillStyle = big ? '#C0302A' : '#D8743A'; x.beginPath(); x.moveTo(at[0], at[1]); x.bezierCurveTo(at[0] - r, at[1] - r * 1.2, at[0] - r * 0.9, at[1] - r * 2.6, at[0], at[1] - r * 2.6); x.bezierCurveTo(at[0] + r * 0.9, at[1] - r * 2.6, at[0] + r, at[1] - r * 1.2, at[0], at[1]); x.fill();
      x.strokeStyle = '#1B1A17'; x.lineWidth = 7; x.stroke();
      x.fillStyle = '#FFF'; x.font = `700 ${Math.round(r * 1.2)}px "Courier Prime", monospace`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('!', at[0], at[1] - r * 1.75);
      if (big && CASES[id]) {
        x.font = '700 70px "Atkinson Hyperlegible Next", sans-serif'; const t = L(CASES[id].title), tw = x.measureText(t).width;
        x.fillStyle = '#1B1A17'; x.fillRect(at[0] + 70, at[1] - 210, tw + 40, 96); x.fillStyle = '#F4EEDD'; x.textAlign = 'left'; x.fillText(t, at[0] + 90, at[1] - 160);
      }
    }
    // the waypoint and you
    if (W.waypoint) { x.strokeStyle = '#A0322A'; x.lineWidth = 18; x.beginPath(); x.moveTo(W.waypoint.x - 55, W.waypoint.y - 55); x.lineTo(W.waypoint.x + 55, W.waypoint.y + 55); x.moveTo(W.waypoint.x + 55, W.waypoint.y - 55); x.lineTo(W.waypoint.x - 55, W.waypoint.y + 55); x.stroke(); }
    const p = W.player;
    x.fillStyle = 'rgba(160,50,42,0.25)'; x.beginPath(); x.arc(p.x, p.y, 110, 0, TAU); x.fill();
    x.fillStyle = '#A0322A'; x.beginPath(); x.arc(p.x, p.y, 48, 0, TAU); x.fill(); x.strokeStyle = '#F4EEDD'; x.lineWidth = 14; x.stroke();
    x.fillStyle = '#1B1A17'; x.font = '700 64px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'top'; x.fillText(L(tr('Sen', 'You')), p.x, p.y + 60);
    x.restore();
    // the title cartouche, a scale bar and the compass rose
    x.font = '700 15px "Bodoni Moda", Georgia, serif'; const title = L(tr('Denizli · Vadinin haritası', 'Denizli · Map of the valley')), tw = x.measureText(title).width;
    x.fillStyle = 'rgba(244,238,221,0.92)'; x.fillRect(10, 10, tw + 24, 30); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.2; x.strokeRect(10, 10, tw + 24, 30); x.strokeRect(13, 13, tw + 18, 24);
    x.fillStyle = '#1B1A17'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText(title, 22, 26);
    const bar = 400 * s; x.fillStyle = '#1B1A17'; x.fillRect(16, hh - 20, bar / 2, 5); x.strokeRect(16, hh - 20, bar, 5);
    x.font = '700 10px "Courier Prime", monospace'; x.textBaseline = 'bottom'; x.fillText(lang === 'tr' ? '0      200 m' : '0      200 m', 16, hh - 23);
    x.save(); x.translate(w - 44, 48); x.strokeStyle = '#1B1A17'; x.fillStyle = '#1B1A17'; x.lineWidth = 1.2;
    x.fillStyle = 'rgba(244,238,221,0.85)'; x.beginPath(); x.arc(0, 0, 24, 0, TAU); x.fill(); x.stroke(); x.beginPath(); x.arc(0, 0, 18, 0, TAU); x.stroke();
    x.fillStyle = '#1B1A17';
    for (let k = 0; k < 4; k++) { x.save(); x.rotate(k * Math.PI / 2); x.beginPath(); x.moveTo(0, -30); x.lineTo(5, 0); x.lineTo(-5, 0); x.closePath(); k ? x.stroke() : x.fill(); x.restore(); }
    x.font = '700 11px "Courier Prime", monospace'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillText(lang === 'tr' ? 'K' : 'N', 0, -34);
    x.restore();
    x.strokeStyle = '#1B1A17'; x.lineWidth = 1.5; x.strokeRect(0.75, 0.75, w - 1.5, hh - 1.5); x.strokeRect(4.5, 4.5, w - 9, hh - 9);
  },
};

// ---------------------------------------------------------------- season postcards
const POSTCARD = {
  paint(cv, season, restored) {
    const x = cv.getContext('2d'), w = cv.width, hh = cv.height, P = PALS[season], r = U.rng(season * 7 + 3);
    const sky = x.createLinearGradient(0, 0, 0, hh * 0.6);
    sky.addColorStop(0, ['#BFD8E6', '#9EC8E4', '#E6C9A0', '#C8D0DA'][season]); sky.addColorStop(1, ['#F4EAD0', '#F6EBC8', '#F2DDB8', '#EEF0F2'][season]);
    x.fillStyle = sky; x.fillRect(0, 0, w, hh);
    for (let k = 0; k < 3; k++) {
      const y0 = hh * (0.42 + k * 0.12), col = U.mix(k === 0 ? '#9AA8B8' : P.grass2, P.grass, k / 2);
      const pts = [[-10, hh + 10]]; for (let i = 0; i <= 12; i++) pts.push([i * w / 12, y0 + Math.sin(i * 0.9 + k * 2) * 18 + (r() - 0.5) * 10]); pts.push([w + 10, hh + 10]);
      U.wash(x, pts, season === 3 && k > 0 ? U.mix(col, '#FFFFFF', 0.6) : col, { seed: k + 3, edge: 0.3 });
    }
    x.strokeStyle = U.mix(P.water, '#FFFFFF', 0.2); x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(w * 0.1, hh); x.quadraticCurveTo(w * 0.45, hh * 0.72, w * 0.8, hh * 0.62); x.stroke();
    for (let i = 0; i < 6; i++) { const px = w * (0.15 + i * 0.14), py = hh * (0.62 + (i % 2) * 0.06); x.fillStyle = season === 3 ? '#7A6A5A' : P.poplar; x.beginPath(); U.path(x, [[px, py], [px - 7, py - 30], [px, py - 76 - i * 4], [px + 7, py - 30]], true); x.fill(); U.ink(x, [[px, py], [px - 7, py - 30], [px, py - 76 - i * 4], [px + 7, py - 30]], { closed: true, w: 1, seed: i }); }
    x.fillStyle = '#E8D9B8'; x.fillRect(w * 0.55, hh * 0.52, 70, 40); x.fillStyle = '#B5653E'; x.beginPath(); x.moveTo(w * 0.55 - 8, hh * 0.52); x.lineTo(w * 0.55 + 35, hh * 0.52 - 26); x.lineTo(w * 0.55 + 78, hh * 0.52); x.fill();
    U.ink(x, U.rectPts(w * 0.55, hh * 0.52, 70, 40), { closed: true, w: 1.2, seed: 9 });
    if (season === 3) for (let i = 0; i < 160; i++) { x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.arc(r() * w, r() * hh, 1 + r() * 2, 0, TAU); x.fill(); }
    if (season === 0) for (let i = 0; i < 40; i++) { x.fillStyle = r() < 0.5 ? '#F2D4DA' : '#FFF1B8'; x.beginPath(); x.arc(r() * w, hh * 0.7 + r() * hh * 0.3, 2.5, 0, TAU); x.fill(); }
    if (season === 2) for (let i = 0; i < 30; i++) { x.fillStyle = r() < 0.5 ? '#C08A3E' : '#D9A95A'; x.beginPath(); U.path(x, U.blob(r() * w, r() * hh, 4, 2, 6, 0.2, i), true); x.fill(); }
    if (season <= 1) { x.strokeStyle = '#1B1A17'; x.lineWidth = 1.5; for (const [bx, by] of [[w * 0.3, hh * 0.18], [w * 0.36, hh * 0.22]]) { x.beginPath(); x.moveTo(bx - 10, by); x.quadraticCurveTo(bx - 4, by - 6, bx, by); x.quadraticCurveTo(bx + 4, by - 6, bx + 10, by); x.stroke(); } }
    for (let i = 0; i < 2500; i++) { x.fillStyle = r() < 0.5 ? 'rgba(60,40,20,0.06)' : 'rgba(255,255,255,0.08)'; x.fillRect(r() * w, r() * hh, 1.5, 1.5); }
  },
  stamp(cv, season) {
    const x = cv.getContext('2d'), w = cv.width, hh = cv.height;
    x.fillStyle = '#F4EEDD'; x.fillRect(0, 0, w, hh);
    x.fillStyle = ['#8FB36A', '#D9A94A', '#C0703E', '#6E8FAE'][season]; x.fillRect(8, 8, w - 16, hh - 30);
    x.fillStyle = '#F4EEDD'; x.font = '700 30px "Bodoni Moda", serif'; x.textAlign = 'center'; x.fillText(['✿', '☀', '❦', '❄'][season], w / 2, hh / 2);
    x.fillStyle = '#1B1A17'; x.font = '700 10px "Courier Prime", monospace'; x.fillText('DENİZLİ', w / 2, hh - 10);
    x.strokeStyle = '#F4EEDD'; x.lineWidth = 4; x.setLineDash([3, 3]); x.strokeRect(2, 2, w - 4, hh - 4);
  },
};

// ================================================================ the screen pen (board mode)
// On a smart board the teacher wants to circle something on whatever is showing: a tube on a bench, a word on a question
// card, a house in the valley. A tab on the left edge turns a clear sheet over the screen into paper: three inks, the
// highlighter, the laser, Undo and Clear. The ink belongs to the screen it was drawn on and goes when that screen closes.
// The specimen table has its own pen (its ink stays on the chart as it moves), so there the tab steps aside
const INK = {
  on: false, strokes: [], col: 0, _top: null, _pt: null, _drawn: false,
  COLS: ['#C8302A', '#26306A', '#16898E'], HL: 3, LASER: 4,
  init(R) {
    const el = this.el = h('div', 'ink away');
    el.innerHTML = `<canvas class="ink-cv"></canvas><nav class="ink-bar" role="toolbar">
      <button class="ink-go" aria-label="${U.esc(T('ink_go'))}" title="${U.esc(T('ink_go'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 6.6l3.4 3.4" stroke="currentColor" stroke-width="1.8"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="#C8302A"/></svg></button>
      <div class="ink-more">${this.COLS.map((c, i) => `<button data-c="${i}" aria-label="${U.esc(T('st_t_ink'))} ${i + 1}"><b class="dot" style="background:${c}"></b></button>`).join('')}<button data-c="3" aria-label="${U.esc(T('st_hl'))}" title="${U.esc(T('st_hl'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 21.5h10" stroke="#F2CC1D" stroke-width="3.4" stroke-linecap="round"/><path d="M14.6 2.8l6.6 6.6-8.4 8.4-6.6-6.6z" fill="#FFE14D" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6.2 11.2 3.4 17l3.6 3.6 5.8-2.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></button><button data-c="4" aria-label="${U.esc(T('st_lz'))}" title="${U.esc(T('st_lz'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18c3-1 5-6 8-7s5 2 8-2" fill="none" stroke="#E8402A" stroke-width="2.4" stroke-linecap="round" opacity="0.45"/><circle cx="19" cy="9" r="3.4" fill="#FF5A3C"/><circle cx="19" cy="9" r="1.4" fill="#FFF4E8"/></svg></button><button class="ink-undo" aria-label="${U.esc(T('st_t_undo'))}" title="${U.esc(T('st_t_undo'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v5.2h5.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6 9.2A8 8 0 1 1 6.3 17.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button><button class="ink-clear" aria-label="${U.esc(T('ink_clear'))}" title="${U.esc(T('ink_clear'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20h12M5.2 14.8l8-8a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8L13 19H9.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11l5 5" stroke="currentColor" stroke-width="1.8"/></svg></button></div></nav>`;
    R.appendChild(el);
    this.cv = el.querySelector('canvas'); this.ctx = this.cv.getContext('2d');
    el.querySelector('.ink-go').onclick = () => this.toggle();
    el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { this.col = +b.dataset.c; AU.sfx('click'); this._ui(); });
    el.querySelector('.ink-undo').onclick = () => { this.strokes.pop(); AU.sfx('page'); this._ui(); };
    el.querySelector('.ink-clear').onclick = () => { this.strokes = []; AU.sfx('page'); this._ui(); };
    const xy = e => [e.clientX, e.clientY];
    this.cv.addEventListener('pointerdown', e => {
      if (!this.on || this._pt != null) return;
      e.preventDefault(); try { this.cv.setPointerCapture(e.pointerId); } catch (_) { }
      this._pt = e.pointerId;
      const s = [xy(e)]; s.col = this.col; if (this.col === this.LASER) s.laser = true;
      if (!s.laser) this._top = this._screen();
      this._snapA = null; clearTimeout(this._snapT);
      this.strokes.push(s); this._ui();
    });
    this.cv.addEventListener('pointermove', e => {
      if (this._pt !== e.pointerId) return;
      const s = this.strokes[this.strokes.length - 1]; if (!s || s.snapped) return;
      const p = xy(e), l = s[s.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 2) s.push(p);
      this._snapArm(s, p);
    });
    for (const t of ['pointerup', 'pointercancel']) this.cv.addEventListener(t, e => {
      if (this._pt !== e.pointerId) return;
      this._pt = null; clearTimeout(this._snapT);
      const s = this.strokes[this.strokes.length - 1];
      if (s && s.laser) s.end = performance.now(); else if (s && s.length === 1) s.push([s[0][0] + 0.5, s[0][1]]);
      this._ui();
    });
  },
  // as on the specimen table: a line held still at its end for half a second tidies up into a straight line, an ellipse
  // or a rectangle (the table's own recogniser, in screen pixels); drawing on without the pause stays freehand
  _snapArm(s, p) {
    if (s.laser || (this._snapA && Math.hypot(p[0] - this._snapA[0], p[1] - this._snapA[1]) < 6)) return;
    this._snapA = p; clearTimeout(this._snapT);
    this._snapT = setTimeout(() => {
      if (this._pt == null || this.strokes[this.strokes.length - 1] !== s || s.snapped || s.length < 8) return;
      const sh = STUDY._shapeOf(s, 1); if (!sh) return;
      s.length = 0; for (const q of sh.pts) s.push(q);
      s.snapped = sh.kind; AU.sfx('click');
    }, 550);
  },
  // what is showing: the top window, the specimen table, or the valley itself
  _screen() { return STUDY.on ? 'study' : (UI.top() && UI.top().el) || G.mode; },
  toggle(on = !this.on) { this.on = !!on; AU.sfx('click'); this._ui(); },
  _ui() {
    if (!this.el) return;
    this.el.classList.toggle('inking', this.on);
    this.el.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('on', +b.dataset.c === this.col));
    const kept = this.strokes.some(s => !s.laser);
    this.el.querySelector('.ink-undo').disabled = !this.strokes.length; this.el.querySelector('.ink-clear').disabled = !kept;
  },
  frame() {
    if (!this.el) return;
    const away = !G.set.board || STUDY.on || G.mode !== 'play';
    if (away !== this.el.classList.contains('away')) { this.el.classList.toggle('away', away); if (away) { this.on = false; this.strokes = []; this._pt = null; this._ui(); } }
    if (away) return;
    // the ink belongs to the screen it was drawn on: a window opening or closing takes it away
    if (this._pt == null && this.strokes.some(s => !s.laser) && this._screen() !== this._top) { this.strokes = this.strokes.filter(s => s.laser); this._ui(); }
    const now = performance.now(), n0 = this.strokes.length;
    this.strokes = this.strokes.filter(s => !s.end || now - s.end < 1600);
    if (this.strokes.length !== n0) this._ui();
    if (!this.strokes.length && !this._drawn) return;
    const c = this.ctx, dpr = G.dpr || 1, W = innerWidth, H = innerHeight;
    if (this.cv.width !== Math.round(W * dpr) || this.cv.height !== Math.round(H * dpr)) { this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr); }
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    c.lineCap = 'round'; c.lineJoin = 'round';
    const path = s => { c.beginPath(); s.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); };
    for (const s of this.strokes) {
      if (s.laser) {
        const a = s.end ? U.clamp(1 - (now - s.end - 700) / 900, 0, 1) : 1;
        c.save(); c.globalAlpha = a; path(s);
        c.shadowColor = 'rgba(255, 70, 40, 0.9)'; c.shadowBlur = 18 * dpr; c.strokeStyle = 'rgba(255, 80, 50, 0.95)'; c.lineWidth = 8; c.stroke();
        c.shadowBlur = 0; c.strokeStyle = 'rgba(255, 246, 232, 0.95)'; c.lineWidth = 2.6; c.stroke(); c.restore();
      } else if (s.col === this.HL) { path(s); c.strokeStyle = 'rgba(255, 219, 40, 0.42)'; c.lineWidth = 30; c.stroke(); }
      else { path(s); c.strokeStyle = this.COLS[s.col] || this.COLS[0]; c.lineWidth = 6; c.stroke(); }
    }
    this._drawn = this.strokes.length > 0;
  },
};
