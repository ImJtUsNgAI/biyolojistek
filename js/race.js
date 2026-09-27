'use strict';
// Class race (Sınıf yarışı): the smartboard splits into a red half and a blue half, both showing the same specimen
// plate. A part's name flashes up; the first team to touch it scores and everyone reads what it is. A wrong touch
// freezes that team for two seconds. Built from the lens plates and their numbered parts, so every new plate joins in.
const RACE = {
  on: false, el: null, st: null, raf: 0,
  TEAMS: [
    { id: 'red', name: tr('Kırmızı', 'Red'), c: '#B8402E', bg: '#F3E1D8' },
    { id: 'blue', name: tr('Mavi', 'Blue'), c: '#2E5E9A', bg: '#DCE6F0' },
  ],
  TOPICS: {
    all: { name: tr('Hepsi', 'Everything'), specs: null },
    plant: { name: tr('Bitkiler', 'Plants'), specs: ['wheat', 'chickpea', 'clover', 'pea', 'tree', 'willow', 'sprout', 'garden', 'apple'] },
    animal: { name: tr('Hayvanlar', 'Animals'), specs: ['cow', 'sheep', 'dog', 'stork', 'frog', 'fish', 'bee', 'blood', 'owl', 'sweep', 'heart'] },
    eco: { name: tr('Ekosistem', 'Ecosystems'), specs: ['pond', 'mushroom', 'soil', 'dough', 'spring', 'snack'] },
  },
  LOCK: 2, TIME: 25,

  // every plate part that can be judged fairly: a tap is counted as right within r of it, and no other part is that close
  pool(topic = 'all') {
    const want = this.TOPICS[topic].specs, out = [];
    for (const spec in SPECS) {
      if (want && !want.includes(spec)) continue;
      SPECS[spec].levels.forEach((lv, l) => {
        if (lv.mode !== 'plate') return;
        const parts = STUDY.partsOf(spec, l);
        for (const p of parts) {
          const near = Math.min(80, ...parts.filter(q => q !== p).map(q => Math.hypot(q.px - p.px, q.py - p.py)));
          if (near < 30 || !OBS[p.id]) continue;
          out.push({ spec, l, id: p.id, px: p.px, py: p.py, r: U.clamp(near * 0.5, 16, 30) });
        }
      });
    }
    return out;
  },
  // rounds from as many different plates as possible, never the same plate twice in a row
  pick(pool, n) {
    const byPlate = {};
    for (const p of shuffle(pool.slice())) (byPlate[p.spec + ':' + p.l] = byPlate[p.spec + ':' + p.l] || []).push(p);
    const plates = shuffle(Object.keys(byPlate)), out = [];
    for (let k = 0; out.length < n && k < 50; k++) for (const key of plates) { const p = byPlate[key].shift(); if (p) out.push(p); if (out.length >= n) break; }
    for (let i = 1; i < out.length; i++) if (out[i].spec === out[i - 1].spec && out[i].l === out[i - 1].l) { const j = out.findIndex((q, k) => k > i && (q.spec !== out[i - 1].spec || q.l !== out[i - 1].l)); if (j > 0) [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  },

  open(opt = {}) {
    if (this.on) return;
    if (STUDY.on) STUDY.close();
    if (LENS.on) LENS.toggle(false);
    this.on = true;
    this.cfg = Object.assign({ n: 10, topic: 'all' }, this.cfg || {}, opt);
    const el = this.el = h('div', 'modal race');
    el._key = e => { if (e.code === 'Escape') this.close(); if (UI.fwd(e.code) && e.code !== 'KeyE' && this.st && this.st.phase === 'shown') this.next(); };
    UI._push('race', el);
    AU.sfx('page');
    this.setup();
  },
  close() {
    if (!this.on) return;
    this.on = false; this.st = null;
    cancelAnimationFrame(this.raf);
    UI._pop(this.el);
  },

  // ---------------------------------------------------------------- setup
  setup() {
    const c = this.cfg, seg = (k, opts) => `<div class="seg rc-${k}">${opts.map(([v, t]) => `<button data-${k}="${v}" class="${String(c[k]) === String(v) ? 'on' : ''}">${U.esc(L(t))}</button>`).join('')}</div>`;
    this.el.innerHTML = `<div class="rc-setup paper">
      <button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      <h2>${U.esc(L(tr('Sınıf yarışı', 'Class race')))}</h2>
      <p class="rc-how">${U.esc(L(tr('Tahta ikiye bölünür: solda Kırmızı takım, sağda Mavi takım. Aynı görüntü iki tarafta da görünür. Üstte bir yapının adı çıkınca ilk dokunan takım puanı alır. Yanlış dokunan takım iki saniye donar.', 'The board splits in two: Red team on the left, Blue team on the right, the same plate on both sides. When a part’s name appears at the top, the first team to touch it scores. A team that touches the wrong place freezes for two seconds.')))}</p>
      <label>${U.esc(L(tr('Konu', 'Topic')))}</label>${seg('topic', Object.entries(this.TOPICS).map(([k, v]) => [k, v.name]))}
      <label>${U.esc(L(tr('Tur sayısı', 'Rounds')))}</label>${seg('n', [[5, { tr: '5', en: '5' }], [10, { tr: '10', en: '10' }], [15, { tr: '15', en: '15' }]])}
      <button class="big yes rc-go">${U.esc(L(tr('Başla ▸', 'Start ▸')))}</button>
    </div>`;
    this.el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    for (const k of ['topic', 'n']) this.el.querySelectorAll(`[data-${k}]`).forEach(b => b.onclick = () => {
      c[k] = k === 'n' ? +b.dataset[k] : b.dataset[k]; AU.sfx('click');
      this.el.querySelectorAll(`[data-${k}]`).forEach(x => x.classList.toggle('on', x === b));
    });
    this.el.querySelector('.rc-go').onclick = () => { AU.sfx('click'); this.start(); };
  },

  // ---------------------------------------------------------------- the race
  start() {
    const rounds = this.pick(this.pool(this.cfg.topic), this.cfg.n);
    this.st = { rounds, i: -1, score: { red: 0, blue: 0 }, lock: { red: 0, blue: 0 }, marks: [], phase: 'idle', t: 0, winner: null, log: [] };
    this.el.innerHTML = `<div class="rc-top">
        <div class="rc-score red"><b>0</b><span>${U.esc(L(this.TEAMS[0].name))}</span></div>
        <div class="rc-ask"><small class="rc-round"></small><h2 class="rc-name"></h2><div class="rc-time"><i></i></div></div>
        <div class="rc-score blue"><b>0</b><span>${U.esc(L(this.TEAMS[1].name))}</span></div>
        <button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      </div>
      <div class="rc-halves">${this.TEAMS.map(tm => `<div class="rc-half ${tm.id}" data-team="${tm.id}"><canvas></canvas><div class="rc-freeze">${U.esc(L(tr('Donduk!', 'Frozen!')))}</div></div>`).join('')}</div>
      <div class="rc-card"></div>`;
    this.el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    this.cvs = [...this.el.querySelectorAll('.rc-half canvas')];
    this.cvs.forEach((cv, k) => cv.addEventListener('pointerdown', e => {
      e.preventDefault();
      const r = cv.getBoundingClientRect(), [px, py] = this._toPlate(cv, e.clientX - r.left, e.clientY - r.top);
      this._tap(this.TEAMS[k].id, px, py);
    }));
    let last = performance.now();
    const loop = now => {
      if (!this.on || !this.st) return;
      const dt = U.clamp((now - last) / 1000, 0, 0.05); last = now;
      this.frame(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    this.next();
  },
  item() { const s = this.st; return s && s.rounds[s.i]; },
  next() {
    const s = this.st; if (!s) return;
    s.i++; s.marks = []; s.lock = { red: 0, blue: 0 }; s.found = null; s.t = 0;
    this.el.querySelector('.rc-card').classList.remove('show');
    if (s.i >= s.rounds.length) { this.finish(); return; }
    const it = this.item();
    s.phase = 'ask';
    this.el.querySelector('.rc-round').textContent = L(tr(`Tur ${s.i + 1} / ${s.rounds.length} · ${L(SPECS[it.spec].name)} · ${L(SPECS[it.spec].levels[it.l].tag)}`, `Round ${s.i + 1} / ${s.rounds.length} · ${L(SPECS[it.spec].name)} · ${L(SPECS[it.spec].levels[it.l].tag)}`));
    const nm = this.el.querySelector('.rc-name'); nm.textContent = L(tr('Bul: ', 'Find: ')) + L(OBS[it.id].title); nm.classList.remove('pop'); void nm.offsetWidth; nm.classList.add('pop');
    AU.sfx('chime');
  },
  // a touch from one team, in plate units
  _tap(team, px, py) {
    const s = this.st; if (!s || s.phase !== 'ask') return;
    if (s.lock[team] > 0) return;
    const it = this.item(), d = Math.hypot(px - it.px, py - it.py);
    if (d <= it.r) {
      s.phase = 'shown'; s.found = team; s.score[team]++;
      s.log.push({ id: it.id, team });
      s.marks.push({ team, px, py, ok: true, t: 0 });
      AU.sfx('success');
      this._score();
      this.reveal(team);
    } else {
      s.lock[team] = this.LOCK;
      s.marks.push({ team, px, py, ok: false, t: 0 });
      AU.sfx('wrong');
    }
  },
  reveal(team) {
    const s = this.st, it = this.item(), a = ATLAS[it.id], tm = this.TEAMS.find(t => t.id === team);
    const head = team ? L(tr(`${L(tm.name)} takım buldu!`, `${L(tm.name)} team found it!`)) : L(tr('Süre doldu. İşte burada:', "Time's up. Here it is:"));
    const card = this.el.querySelector('.rc-card');
    card.style.setProperty('--tc', tm ? tm.c : '#5A5040');
    card.innerHTML = `<div><small>${U.esc(head)}</small><h3>${U.esc(L(OBS[it.id].title))}</h3><p>${a ? md(LX(a.what)) : ''}</p></div><button class="big yes rc-next">${U.esc(s.i + 1 >= s.rounds.length ? L(tr('Sonuçlar ▸', 'Results ▸')) : L(tr('Sonraki ▸', 'Next ▸')))}</button>`;
    card.querySelector('.rc-next').onclick = () => { AU.sfx('click'); this.next(); };
    card.classList.add('show');
  },
  _score() { for (const tm of this.TEAMS) { const b = this.el.querySelector(`.rc-score.${tm.id} b`); b.textContent = this.st.score[tm.id]; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } },
  finish() {
    const s = this.st, [r, b] = [s.score.red, s.score.blue];
    s.phase = 'done'; s.winner = r > b ? 'red' : b > r ? 'blue' : null;
    cancelAnimationFrame(this.raf);
    const tm = this.TEAMS.find(t => t.id === s.winner);
    const list = s.rounds.map((it, i) => { const lg = s.log.find(q => q.id === it.id); return `<li class="${lg ? lg.team : 'none'}">${U.esc(L(OBS[it.id].title))}<small>${U.esc(L(SPECS[it.spec].name))}</small></li>`; }).join('');
    this.el.innerHTML = `<div class="rc-setup rc-end paper">
      <button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      <small>${U.esc(L(tr('Sınıf yarışı bitti', 'Class race over')))}</small>
      <h2 style="color:${tm ? tm.c : 'inherit'}">${U.esc(tm ? L(tr(`${L(tm.name)} takım kazandı!`, `${L(tm.name)} team wins!`)) : L(tr('Berabere!', "It's a draw!")))}</h2>
      <div class="rc-final"><b class="red">${r}</b><span>:</span><b class="blue">${b}</b></div>
      <ol class="rc-list">${list}</ol>
      <div class="rc-foot"><button class="rc-again">${U.esc(L(tr('Yeni yarış', 'New race')))}</button><button class="big yes rc-close">${U.esc(T('close'))}</button></div>
    </div>`;
    this.el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    this.el.querySelector('.rc-close').onclick = () => { AU.sfx('click'); this.close(); };
    this.el.querySelector('.rc-again').onclick = () => { AU.sfx('click'); this.setup(); };
    UI.stamp(tm ? L(tm.name).toLocaleUpperCase(I18N.lang === 'tr' ? 'tr-TR' : 'en') : '=', L(tr('Sınıf yarışı', 'Class race')));
  },

  // ---------------------------------------------------------------- drawing
  _fit(cv) {
    const r = cv.getBoundingClientRect(), dpr = G.dpr;
    if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) { cv.width = Math.max(2, Math.round(r.width * dpr)); cv.height = Math.max(2, Math.round(r.height * dpr)); }
    const z = Math.min(r.width, r.height) * 0.94 / 280;
    return { w: r.width, h: r.height, z, cx: r.width / 2, cy: r.height / 2 };
  },
  _toPlate(cv, x, y) { const f = this._fit(cv); return [(x - f.cx) / f.z, (y - f.cy) / f.z]; },
  frame(dt) {
    const s = this.st; if (!s || s.phase === 'done') return;
    s.t += dt;
    for (const k in s.lock) s.lock[k] = Math.max(0, s.lock[k] - dt);
    for (const m of s.marks) m.t += dt;
    if (s.phase === 'ask' && s.t >= this.TIME) { s.phase = 'shown'; s.found = null; s.log.push({ id: this.item().id, team: null }); AU.sfx('wrong'); this.reveal(null); }
    const bar = this.el.querySelector('.rc-time i'); if (bar) bar.style.width = (s.phase === 'ask' ? 100 * (1 - s.t / this.TIME) : 0) + '%';
    this.el.querySelectorAll('.rc-half').forEach(hf => hf.classList.toggle('frozen', s.lock[hf.dataset.team] > 0));
    const it = this.item(); if (!it) return;
    const lv = SPECS[it.spec].levels[it.l], st = LENS.state({ spec: it.spec }); st.t = G.t + s.t;
    this.cvs.forEach((cv, k) => {
      const tm = this.TEAMS[k], f = this._fit(cv), c = cv.getContext('2d');
      c.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
      c.fillStyle = tm.bg; c.fillRect(0, 0, f.w, f.h);
      c.save(); c.translate(f.cx, f.cy); c.scale(f.z, f.z);
      c.fillStyle = 'rgba(40,25,10,0.16)'; c.fillRect(-135, -134, 280, 280);
      c.save(); c.beginPath(); c.rect(-140, -140, 280, 280); c.clip(); lv.draw(c, st); c.restore();
      c.strokeStyle = '#1B1A17'; c.lineWidth = 1.5 / f.z * 1.5; c.strokeRect(-140, -140, 280, 280);
      // this team's taps: a cross for a miss, fading out
      for (const m of s.marks) {
        if (m.team !== tm.id || m.ok || m.t > 1.6) continue;
        const a = 1 - m.t / 1.6, r = 9 / f.z * 2.2;
        c.strokeStyle = `rgba(200,40,30,${a.toFixed(2)})`; c.lineWidth = 4 / f.z * 1.4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(m.px - r, m.py - r); c.lineTo(m.px + r, m.py + r); c.moveTo(m.px + r, m.py - r); c.lineTo(m.px - r, m.py + r); c.stroke();
      }
      // the answer, once found or once time runs out: a ring in the winning team's colour on both halves
      if (s.phase === 'shown') {
        const win = this.TEAMS.find(t => t.id === s.found), col = win ? win.c : '#1B1A17', pulse = 1 + 0.08 * Math.sin(G.t * 6);
        c.fillStyle = 'rgba(20,16,10,0.35)'; c.beginPath(); c.rect(-140, -140, 280, 280); c.moveTo(it.px + it.r * 1.6, it.py); c.arc(it.px, it.py, it.r * 1.6, 0, TAU, true); c.fill();
        c.strokeStyle = '#FFFFFF'; c.lineWidth = 7 / f.z * 1.3; c.beginPath(); c.arc(it.px, it.py, it.r * 1.6 * pulse, 0, TAU); c.stroke();
        c.strokeStyle = col; c.lineWidth = 4 / f.z * 1.3; c.stroke();
      }
      c.restore();
    });
  },
};
