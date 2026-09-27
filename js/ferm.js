'use strict';
// Fermentation bench at the village bakery. Three flasks of yeast in water, a balloon over each neck: choose the
// water temperature and whether there is sugar, wait, compare the balloons, then bubble the gas through limewater.
const FERM = {
  TEMPS: [10, 35, 70],
  BAL: ['#C23A2C', '#2F68B4', '#D6A02A'],
  FX: [96, 226, 356],
  RUN: 6, // seconds of real time for one 40-minute wait
  // gas made per minute, relative to warm water with sugar. Yeast enzymes work best near body warmth and slowly in
  // the cold; at 70 °C the cells die within seconds. Without sugar they have almost nothing to ferment.
  rate(f) { return (f.temp === 35 ? 1 : f.temp === 10 ? 0.22 : 0) * (f.sugar ? 1 : 0.06); },
  // balloon circumference in cm for a volume of gas (1 = a full warm, sweet flask after 40 minutes)
  circ(v) { return 8 + 26 * Math.sqrt(Math.max(0, v)); },
  cond(f) { return `${f.temp} °C · ${L(f.sugar ? tr('şekerli', 'sugar') : tr('şekersiz', 'no sugar'))}`; },

  open() {
    const S = G.S;
    const st = this.st = { f: [0, 1, 2].map(() => ({ temp: 35, sugar: true })), runs: S.fermRuns || (S.fermRuns = []), running: false, t: 0,
      v: [0, 0, 0], k: [1, 1, 1], bub: [[], [], []], lime: S.flags.limeDone ? 1 : 0, limeT: -1, from: -1, v0: 0 };
    const last = st.runs[st.runs.length - 1];
    if (last) last.f.forEach((f, i) => { st.f[i] = { temp: f.temp, sugar: f.sugar }; st.v[i] = f.v; });
    const body = h('div', 'kit rig ferm');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Şişe · su sıcaklığı · şeker', 'Flask · water temperature · sugar'))}</label>
        ${[0, 1, 2].map(i => `<div class="fm-row" data-i="${i}"><b class="fm-tag" style="--bc:${this.BAL[i]}">${'ABC'[i]}</b>
          <div class="seg temps">${this.TEMPS.map(t => `<button data-t="${t}">${t} °C</button>`).join('')}</div>
          <div class="seg sugar"><button data-s="1">${L(tr('Şeker', 'Sugar'))}</button><button data-s="0">${L(tr('Yok', 'None'))}</button></div></div>`).join('')}
        <p class="fm-const">${L(tr('Her şişede aynı: 1 çay kaşığı kuru maya, 150 mL su.', 'The same in every flask: 1 teaspoon of dried yeast, 150 mL of water.'))}</p>
        <button class="big run">${L(tr('40 dakika bekle ▶', 'Wait 40 minutes ▶'))}</button>
        <button class="big lime">${L(tr('Gazı kireç suyundan geçir', 'Bubble the gas through limewater'))}</button>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('İpucu: iki şişe arasında yalnızca bir şey farklı olsun. Hangi balon neden şişti?', 'Tip: let only one thing differ between two flasks. Which balloon grew, and why?'))}</p>`;
    body.querySelectorAll('.fm-row').forEach(row => {
      const i = +row.dataset.i;
      row.querySelectorAll('[data-t]').forEach(b => b.onclick = () => this._set(i, { temp: +b.dataset.t }));
      row.querySelectorAll('[data-s]').forEach(b => b.onclick = () => this._set(i, { sugar: b.dataset.s === '1' }));
    });
    body.querySelector('.run').onclick = () => this.run();
    body.querySelector('.lime').onclick = () => this.limewater();
    this.body = body;
    this.cv = body.querySelector('canvas');
    this._sync();
    this.pn = UI.panel({ title: tr('Fırının deney masası · Maya ve balonlar', "The bakery's lab table · Yeast and balloons"), code: 'BİY.10.1.9', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this.table(); this.loop();
  },
  // a changed setting means a fresh flask: its balloon starts empty
  _set(i, o) {
    const st = this.st;
    if (st.running || st.limeT >= 0) return;
    Object.assign(st.f[i], o); st.v[i] = 0; st.bub[i] = [];
    AU.sfx('click'); this._sync();
  },
  _sync() {
    const st = this.st, b = this.body;
    b.querySelectorAll('.fm-row').forEach(row => {
      const f = st.f[+row.dataset.i];
      row.querySelectorAll('[data-t]').forEach(x => x.classList.toggle('on', +x.dataset.t === f.temp));
      row.querySelectorAll('[data-s]').forEach(x => x.classList.toggle('on', (x.dataset.s === '1') === f.sugar));
    });
    b.querySelector('.run').disabled = st.running || st.limeT >= 0;
    b.querySelector('.lime').disabled = st.running || st.limeT >= 0 || !(Math.max(...st.v) > 0.05);
  },
  run() {
    const st = this.st;
    if (st.running || st.limeT >= 0) return;
    st.running = true; st.t = 0; st.v = [0, 0, 0]; st.bub = [[], [], []];
    st.k = st.f.map(() => 1 + (Math.random() + Math.random() - 1) * 0.08);
    AU.sfx('click'); this._sync();
  },
  // one tick of the bench; the loop feeds it real time, the self-test feeds it by hand
  step(dt) {
    const st = this.st;
    if (st.running) {
      st.t = Math.min(1, st.t + dt / this.RUN);
      st.f.forEach((f, i) => {
        const r = this.rate(f) * st.k[i];
        // the hot flask's balloon lifts a little at first: warmed air expanding, not yeast
        st.v[i] = r * st.t + (f.temp === 70 ? 0.008 * Math.min(1, st.t * 8) : 0);
        if (Math.random() < r * dt * 26) st.bub[i].push({ x: (Math.random() - 0.5) * 50, y: 0, r: 0.7 + Math.random() * 1.3, s: 14 + Math.random() * 16 });
      });
      if (st.t >= 1) this.finish();
    }
    if (st.limeT >= 0) {
      st.limeT = Math.min(1, st.limeT + dt / 3);
      st.v[st.from] = st.v0 * (1 - st.limeT);
      st.lime = Math.max(st.lime, Math.pow(st.limeT, 0.7));
      if (Math.random() < dt * 14) st.bub[3] = (st.bub[3] || []).concat({ x: (Math.random() - 0.5) * 4, y: 0, r: 0.6 + Math.random() * 0.8, s: 18 + Math.random() * 10 });
      if (st.limeT >= 1) this._limeDone();
    }
    for (const list of st.bub) if (list) { for (const b of list) b.y += b.s * dt; }
    st.bub = st.bub.map((list, i) => (list || []).filter(b => b.y < (i === 3 ? 48 : 34)));
  },
  loop() {
    let last = performance.now();
    const tick = now => {
      if (!this.pn || this.pn.closed) return;
      this.step(U.clamp((now - last) / 1000, 0, 0.05) * UI.benchPace(this.cv)); last = now;
      this.draw();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
  finish() {
    const st = this.st;
    st.running = false;
    st.runs.push({ f: st.f.map((f, i) => ({ temp: f.temp, sugar: f.sugar, v: +st.v[i].toFixed(3), c: Math.round(this.circ(st.v[i])) })) });
    AU.sfx('pen');
    this._sync(); this.table();
    G.save();
  },
  limewater() {
    const st = this.st;
    if (st.running || st.limeT >= 0) return;
    const j = st.v.indexOf(Math.max(...st.v));
    if (!(st.v[j] > 0.05)) { this.body.querySelector('.kit-msg').textContent = L(tr('Önce bir balonu şişir: gaz olmadan test yapılamaz.', 'Blow up a balloon first: no gas, no test.')); return; }
    st.from = j; st.v0 = st.v[j]; st.limeT = 0; st.lime = 0; st.bub[3] = [];
    AU.sfx('bubble'); this._sync();
  },
  _limeDone() {
    const st = this.st;
    st.limeT = -1; st.bub[3] = [];
    G.S.flags.limeDone = true;
    AU.sfx('chime');
    this.body.querySelector('.kit-msg').textContent = L(tr('Kireç suyu süt gibi bulandı: balondaki gaz karbondioksit (CO₂)!', 'The limewater has turned milky: the gas in the balloon is carbon dioxide (CO₂)!'));
    this._sync(); this.table(); G.save();
  },
  // what the runs so far show
  analyse() {
    const out = { one: false, heat: false, cold: false, sugar: false, lime: !!G.S.flags.limeDone, best: null };
    for (const r of this.st.runs) {
      const f = r.f;
      for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) {
        const dT = f[a].temp !== f[b].temp, dS = f[a].sugar !== f[b].sugar;
        if (dT !== dS) out.one = true;
        const ts = [f[a].temp, f[b].temp].sort((x, y) => x - y).join('|');
        if (dT && !dS && ts === '35|70') { out.heat = true; out.best = r; }
        if (dT && !dS && ts === '10|35') out.cold = true;
        if (dS && !dT) out.sugar = true;
      }
    }
    return out;
  },
  table() {
    const st = this.st, body = this.body, a = this.analyse();
    const rows = st.runs.slice(-3).map((r, k, arr) => r.f.map((f, i) => `<tr class="${i === 0 ? 'fm-first' : ''}"${k === arr.length - 1 ? ` data-new="${st.runs.length}"` : ''}><td>${i === 0 ? '#' + (st.runs.length - arr.length + k + 1) : ''}</td><td><i class="dot" style="background:${this.BAL[i]}"></i>${'ABC'[i]}</td><td>${f.temp} °C</td><td>${f.sugar ? '✓' : '—'}</td><td><b>${f.c} cm</b></td></tr>`).join('')).reverse().join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Deneme', 'Run'))}</th><th>${L(tr('Şişe', 'Flask'))}</th><th>${L(tr('Su', 'Water'))}</th><th>${L(tr('Şeker', 'Sugar'))}</th><th>${L(tr('Balon çevresi', 'Balloon round'))}</th></tr>${rows || `<tr><td colspan="5">${L(tr('Henüz deneme yok.', 'No runs yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.one, tr('Tek değişken', 'One variable')], [a.heat, tr('35 °C ↔ 70 °C', '35 °C ↔ 70 °C')], [a.sugar, tr('Şekerli ↔ şekersiz', 'Sugar ↔ none')], [a.lime, tr('Kireç suyu testi', 'Limewater test')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const last = st.runs[st.runs.length - 1];
    if (last) UI._chart(body.querySelector('.rig-chart'), { values: last.f.map(f => f.c), labels: last.f.map((f, i) => ({ tr: 'ABC'[i] + ' · ' + f.temp + '°', en: 'ABC'[i] + ' · ' + f.temp + '°' })), colors: this.BAL, unit: tr('balon çevresi (cm)', 'balloon round (cm)') });
    if (a.one && a.heat && a.lime && !G.S.flags.fermDone) {
      G.S.flags.fermDone = true;
      this.record(a.best || last);
      body.querySelector('.kit-msg').textContent = L(tr('Adil bir deney! Sonuçlar defterine yazıldı.', 'A fair test! Your results are in the journal.'));
      UI.stamp(L(tr('ADİL DENEY', 'FAIR TEST')));
      if (Q.at('bakery', 'exp')) { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); };
    }
  },
  record(r) {
    const S = G.S;
    S.journal.exps.push({ title: tr('Maya, sıcaklık ve şeker', 'Yeast, temperature and sugar'), code: 'BİY.10.1.9', t: Date.now(),
      head: [tr('Şişe', 'Flask'), tr('Koşul', 'Condition'), tr('Balon çevresi', 'Balloon round')],
      rows: r.f.map((f, i) => ['ABC'[i], { tr: f.temp + ' °C · ' + (f.sugar ? 'şekerli' : 'şekersiz'), en: f.temp + ' °C · ' + (f.sugar ? 'sugar' : 'no sugar') }, f.c + ' cm']),
      chart: { values: r.f.map(f => f.c), labels: r.f.map((f, i) => ({ tr: 'ABC'[i] + ' · ' + f.temp + '°', en: 'ABC'[i] + ' · ' + f.temp + '°' })), colors: this.BAL, unit: tr('balon çevresi (cm)', 'balloon round (cm)') },
      stamps: [{ t: tr('Tek değişken', 'One variable'), ok: true }, { t: tr('35 °C ↔ 70 °C', '35 °C ↔ 70 °C'), ok: true }, { t: tr('Kireç suyu', 'Limewater'), ok: true }],
      note: tr('Kireç suyu bulandı: gaz CO₂. 70 °C’de balon hiç büyümedi: sıcak su mayayı öldürür. İlk küçük kabarma, ısınan havanın genleşmesiydi.', 'The limewater went cloudy: the gas is CO₂. At 70 °C the balloon never grew: hot water kills yeast. The small first lift was just warm air expanding.') });
    G.save();
  },
  async close() {
    this.pn = null;
    if (G.S.flags.fermDone && Q.at('bakery', 'exp')) {
      await UI.say('player', tr('70 °C’deki şişenin balonu hiç şişmedi: sıcak su mayayı öldürüyor. Kireç suyu da bulandı; çıkan gaz CO₂. Peki Nazlı Teyze mayayı nasıl açıyordu?', "The balloon on the 70 °C flask never grew: hot water kills yeast. And the limewater went cloudy, so the gas is CO₂. So how did Nazlı Teyze mix her yeast?"));
      Q.adv('bakery');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  NT: 138, NB: 170, BASE: 248, SURF: 210, HW: 40,
  _hw(y) { return 7 + (this.HW - 7) * U.clamp((y - this.NB) / (this.BASE - this.NB), 0, 1); },
  _layers() {
    const st = this.st, key = st.f.map(f => f.temp + (f.sugar ? 's' : 'n')).join('|') + I18N.lang + (document.fonts ? document.fonts.status : '');
    if (this._lk === key) return this._ly;
    const mk = () => { const c = U.canvas(920, 600), x = c.getContext('2d'); x.scale(2, 2); return [c, x]; };
    const [bc, b] = mk(), [fc, f] = mk(), R = MX.rng(31);
    // whitewashed back room of the bakery, a shelf of jars, a wooden bench
    b.fillStyle = MX.lin(b, 0, 0, 0, 258, [[0, '#E4D9C2'], [1, '#CDBFA2']]); b.fillRect(0, 0, 460, 258);
    const w = U.rgb('#9A8A6A');
    const s0 = MX.s; MX.s = 2; MX.tex(b, 0, 0, 460, 258, (x, y) => [w[0], w[1], w[2], U.fbm(x * 0.03, y * 0.03, 3, 5) * 60], 160); MX.s = s0;
    b.fillStyle = MX.lin(b, 0, 70, 0, 80, [[0, '#8C6C4A'], [1, '#5A4230']]); b.fillRect(250, 70, 200, 8);
    const jar = (x0, wd, ht, fill, label) => {
      b.fillStyle = 'rgba(0,0,0,0.25)'; b.beginPath(); b.ellipse(x0 + wd / 2 + 3, 70, wd / 2, 2.5, 0, 0, TAU); b.fill();
      b.fillStyle = 'rgba(226,236,240,0.4)'; U.rr(b, x0, 70 - ht, wd, ht, 4); b.fill(); b.strokeStyle = 'rgba(250,252,252,0.8)'; b.lineWidth = 0.8; b.stroke();
      b.fillStyle = fill; U.rr(b, x0 + 2, 70 - ht * 0.72, wd - 4, ht * 0.72 - 2, 3); b.fill();
      b.fillStyle = '#6B4A32'; U.rr(b, x0 - 1, 70 - ht - 5, wd + 2, 6, 2); b.fill();
      b.fillStyle = '#F4EEDD'; b.fillRect(x0 + 3, 70 - ht * 0.55, wd - 6, 10); b.fillStyle = '#1B1A17'; b.font = '700 5.5px "Courier Prime", monospace'; b.textAlign = 'center'; b.fillText(label, x0 + wd / 2, 70 - ht * 0.55 + 7);
    };
    jar(262, 38, 40, '#C9A874', L(tr('MAYA', 'YEAST')));
    jar(312, 38, 44, '#F6F4EE', L(tr('ŞEKER', 'SUGAR')));
    jar(362, 34, 48, 'rgba(236,244,246,0.5)', L(tr('KİREÇ S.', 'LIMEWATER')));
    // a peel hanging on the wall
    b.fillStyle = MX.lin(b, 186, 0, 206, 0, [[0, '#8A6844'], [0.5, '#B89060'], [1, '#7A5A3A']]); b.fillRect(193, 14, 6, 60);
    b.beginPath(); b.ellipse(196, 88, 20, 24, 0, 0, TAU); b.fill(); b.strokeStyle = 'rgba(60,40,20,0.5)'; b.lineWidth = 0.8; b.stroke();
    b.fillStyle = 'rgba(245,240,225,0.5)'; for (let i = 0; i < 40; i++) { b.beginPath(); b.arc(180 + R() * 32, 72 + R() * 36, 0.4 + R() * 0.6, 0, TAU); b.fill(); }
    // bench
    b.fillStyle = MX.lin(b, 0, 258, 0, 300, [[0, '#9A7650'], [1, '#5E4432']]); b.fillRect(0, 258, 460, 42);
    for (let i = 0; i < 24; i++) { const y = 259 + R() * 40; b.strokeStyle = `rgba(60,38,20,${(0.1 + R() * 0.2).toFixed(2)})`; b.lineWidth = 0.5 + R(); b.beginPath(); b.moveTo(0, y); for (let x = 0; x <= 460; x += 20) b.lineTo(x, y + Math.sin(x * 0.02 + i) * 1.2); b.stroke(); }
    b.fillStyle = 'rgba(255,240,210,0.3)'; b.fillRect(0, 258, 460, 1);
    b.fillStyle = 'rgba(250,246,236,0.5)'; for (let i = 0; i < 60; i++) { b.beginPath(); b.ellipse(R() * 460, 262 + R() * 36, 0.8 + R() * 2.4, 0.4 + R() * 0.8, 0, 0, TAU); b.fill(); }
    // flasks: bath water behind, the yeast suspension, the glass and the bath's front wall in front
    st.f.forEach((fl, i) => {
      const cx = this.FX[i], water = fl.temp === 10 ? '#A4C8DE' : fl.temp === 70 ? '#CFC6B4' : '#B6D2CC';
      b.fillStyle = 'rgba(0,0,0,0.3)'; b.beginPath(); b.ellipse(cx + 4, 259, 58, 5, 0, 0, TAU); b.fill();
      b.fillStyle = MX.lin(b, cx - 56, 0, cx + 56, 0, [[0, '#6E7472'], [0.3, '#C8CCCA'], [0.6, '#9A9E9C'], [1, '#5A605E']]); b.beginPath(); b.ellipse(cx, 234, 56, 9, 0, 0, TAU); b.fill();
      b.fillStyle = water; b.beginPath(); b.ellipse(cx, 235, 52, 7.5, 0, 0, TAU); b.fill();
      const lq = [[cx - this._hw(this.SURF), this.SURF], [cx + this._hw(this.SURF), this.SURF], [cx + this.HW, this.BASE - 3], [cx + this.HW - 4, this.BASE], [cx - this.HW + 4, this.BASE], [cx - this.HW, this.BASE - 3]];
      b.fillStyle = MX.lin(b, 0, this.SURF, 0, this.BASE, [[0, fl.sugar ? '#E0D2AE' : '#D8CCAA'], [1, '#B8A276']]);
      b.beginPath(); lq.forEach(([x, y], k) => k ? b.lineTo(x, y) : b.moveTo(x, y)); b.closePath(); b.fill();
      b.fillStyle = 'rgba(120,90,50,0.25)'; for (let k = 0; k < 50; k++) { const y = this.SURF + 4 + R() * (this.BASE - this.SURF - 6), hw = this._hw(y) - 2; b.beginPath(); b.arc(cx + (R() * 2 - 1) * hw, y, 0.3 + R() * 0.5, 0, TAU); b.fill(); }
      const glass = (pts, lw = 1.2) => { f.strokeStyle = 'rgba(232,242,246,0.85)'; f.lineWidth = lw; f.beginPath(); pts.forEach(([x, y], k) => k ? f.lineTo(x, y) : f.moveTo(x, y)); f.stroke(); };
      f.fillStyle = 'rgba(220,236,242,0.1)'; f.beginPath(); f.moveTo(cx - 7, this.NT); f.lineTo(cx - 7, this.NB); f.lineTo(cx - this.HW, this.BASE); f.lineTo(cx + this.HW, this.BASE); f.lineTo(cx + 7, this.NB); f.lineTo(cx + 7, this.NT); f.closePath(); f.fill();
      glass([[cx - 7, this.NT], [cx - 7, this.NB], [cx - this.HW, this.BASE - 3], [cx - this.HW + 4, this.BASE], [cx + this.HW - 4, this.BASE], [cx + this.HW, this.BASE - 3], [cx + 7, this.NB], [cx + 7, this.NT]], 1.4);
      f.strokeStyle = 'rgba(255,255,255,0.4)'; f.lineWidth = 2.5; f.beginPath(); f.moveTo(cx - 24, this.BASE - 8); f.lineTo(cx - 6, this.NB + 6); f.stroke();
      f.strokeStyle = 'rgba(40,40,40,0.35)'; f.lineWidth = 0.6; for (let m = 0; m < 3; m++) { const y = 200 + m * 14, hw = this._hw(y); f.beginPath(); f.moveTo(cx + hw - 8, y); f.lineTo(cx + hw - 2, y); f.stroke(); }
      // bath front wall, with ice or steam marks
      f.fillStyle = MX.lin(f, cx - 56, 0, cx + 56, 0, [[0, '#5A605E'], [0.25, '#B8BCBA'], [0.55, '#8A8E8C'], [1, '#4A504E']]);
      f.beginPath(); f.moveTo(cx - 56, 234); f.lineTo(cx - 52, 256); f.quadraticCurveTo(cx, 262, cx + 52, 256); f.lineTo(cx + 56, 234); f.quadraticCurveTo(cx, 244, cx - 56, 234); f.fill();
      f.strokeStyle = 'rgba(30,30,30,0.5)'; f.lineWidth = 0.8; f.stroke();
      if (fl.temp === 10) for (const [dx, dy] of [[-40, -2], [36, 0], [-22, 3], [44, 4]]) { f.fillStyle = 'rgba(240,248,252,0.85)'; U.rr(f, cx + dx - 5, 231 + dy, 10, 7, 2); f.fill(); f.strokeStyle = 'rgba(150,190,210,0.8)'; f.lineWidth = 0.5; f.stroke(); }
      // label card on the bench
      f.fillStyle = 'rgba(0,0,0,0.25)'; f.fillRect(cx - 27, 268, 56, 24);
      f.fillStyle = '#F4EEDD'; f.fillRect(cx - 29, 266, 56, 24); f.strokeStyle = '#2A2620'; f.lineWidth = 0.7; f.strokeRect(cx - 29, 266, 56, 24);
      f.fillStyle = this.BAL[i]; f.beginPath(); f.arc(cx - 20, 278, 6.5, 0, TAU); f.fill();
      f.fillStyle = '#FFFFFF'; f.font = '700 8px "Courier Prime", monospace'; f.textAlign = 'center'; f.textBaseline = 'middle'; f.fillText('ABC'[i], cx - 20, 278.5);
      f.fillStyle = '#1B1A17'; f.font = '700 7px "Courier Prime", monospace'; f.textAlign = 'left'; f.fillText(fl.temp + ' °C', cx - 11, 273.5);
      f.font = '600 6px "Atkinson Hyperlegible Next", sans-serif'; f.fillText(L(fl.sugar ? tr('+ şeker', '+ sugar') : tr('şekersiz', 'no sugar')), cx - 11, 283);
      f.textBaseline = 'alphabetic';
    });
    // limewater test tube in a little rack
    const lx = 430;
    f.fillStyle = MX.lin(f, 0, 236, 0, 258, [[0, '#9A7650'], [1, '#6E5238']]); f.fillRect(lx - 16, 236, 32, 22); f.fillRect(lx - 16, 196, 32, 5); f.fillRect(lx - 16, 196, 3, 40); f.fillRect(lx + 13, 196, 3, 40);
    f.strokeStyle = 'rgba(232,242,246,0.85)'; f.lineWidth = 1.1; f.beginPath(); f.moveTo(lx - 7, 146); f.lineTo(lx - 7, 238); f.arc(lx, 238, 7, Math.PI, 0, true); f.lineTo(lx + 7, 146); f.stroke();
    f.fillStyle = '#F4EEDD'; f.fillRect(lx - 16, 146, 32, 10); f.fillStyle = '#1B1A17'; f.font = '700 5.5px "Courier Prime", monospace'; f.textAlign = 'center'; f.fillText(L(tr('KİREÇ SUYU', 'LIMEWATER')), lx, 153);
    this._lk = key; this._ly = { back: bc, front: fc };
    return this._ly;
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, now = performance.now(), ly = this._layers();
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(ly.back, 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    st.f.forEach((f, i) => {
      const cx = this.FX[i], r = this.rate(f) * (st.running ? 1 : Math.min(1, st.v[i] * 3));
      // bubbles rising through the suspension and a head of foam on it
      for (const b of st.bub[i]) { const y = this.BASE - 6 - b.y, hw = this._hw(y) - 3; x.strokeStyle = 'rgba(255,252,240,0.8)'; x.lineWidth = 0.5; x.beginPath(); x.arc(cx + U.clamp(b.x, -hw, hw), y, b.r, 0, TAU); x.stroke(); }
      const foam = Math.min(6, r * 6 * (st.running ? st.t : 1));
      if (foam > 0.3) { x.fillStyle = 'rgba(248,242,222,0.92)'; const hw = this._hw(this.SURF - foam); x.beginPath(); x.moveTo(cx - this._hw(this.SURF), this.SURF + 1); for (let k = 0; k <= 8; k++) { const px = cx - hw + k * hw / 4; x.lineTo(px, this.SURF - foam + Math.sin(k * 2.1 + now / 400) * 0.8); } x.lineTo(cx + this._hw(this.SURF), this.SURF + 1); x.closePath(); x.fill(); }
      // steam off the hot bath
      if (f.temp === 70) for (let k = 0; k < 3; k++) { const ph = (now / 2400 + k / 3) % 1; x.fillStyle = `rgba(250,248,240,${(0.3 * (1 - ph)).toFixed(2)})`; x.beginPath(); x.ellipse(cx - 30 + k * 30 + Math.sin(now / 700 + k) * 4, 228 - ph * 40, 7 + ph * 8, 4 + ph * 5, 0, 0, TAU); x.fill(); }
    });
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(ly.front, 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    st.f.forEach((f, i) => this._balloon(x, i, now));
    this._lime(x, now);
    this._clock(x);
  },
  _balloon(x, i, now) {
    const st = this.st, cx = this.FX[i], c = this.circ(st.v[i]), col = this.BAL[i], nt = this.NT;
    // rubber rolled over the rim
    x.fillStyle = U.shade(col, -0.25); U.rr(x, cx - 9, nt - 2, 18, 7, 3); x.fill();
    if (c < 11) {
      // an empty balloon flops over the side of the neck
      const k = (c - 8) / 3, sw = Math.sin(now / 900 + i) * 0.04;
      x.save(); x.translate(cx, nt - 2); x.rotate(-1.1 + k * 1.0 + sw);
      x.fillStyle = MX.lin(x, -6, 0, 6, 0, [[0, U.shade(col, -0.2)], [0.5, U.shade(col, 0.15)], [1, U.shade(col, -0.3)]]);
      x.beginPath(); x.moveTo(-4, 0); x.bezierCurveTo(-7, -10, -8 - k * 4, -22 - k * 4, 0, -26 - k * 6); x.bezierCurveTo(8 + k * 4, -22 - k * 4, 7, -10, 4, 0); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 0.5; x.stroke();
      x.strokeStyle = 'rgba(0,0,0,0.18)'; x.beginPath(); x.moveTo(-2, -6); x.quadraticCurveTo(0, -14, -1, -20); x.stroke();
      x.restore();
      return;
    }
    const r = c * 0.95 / 2, cy = nt - 4 - r * 1.02;
    x.fillStyle = U.shade(col, -0.1); x.beginPath(); x.moveTo(cx - 5, nt - 1); x.quadraticCurveTo(cx - 3, cy + r * 0.8, cx - r * 0.3, cy + r * 0.9); x.lineTo(cx + r * 0.3, cy + r * 0.9); x.quadraticCurveTo(cx + 3, cy + r * 0.8, cx + 5, nt - 1); x.closePath(); x.fill();
    x.fillStyle = MX.rad(x, cx - r * 0.35, cy - r * 0.4, r * 0.05, r * 1.1, [[0, U.shade(col, 0.55)], [0.25, U.shade(col, 0.12)], [0.8, col], [1, U.shade(col, -0.35)]]);
    x.beginPath(); x.ellipse(cx, cy, r * 0.94, r * 1.02, 0, 0, TAU); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.55)'; x.beginPath(); x.ellipse(cx - r * 0.38, cy - r * 0.45, r * 0.16, r * 0.26, -0.5, 0, TAU); x.fill();
    if (!st.running && st.limeT < 0 && st.v[i] > 0.01) {
      const t = Math.round(c) + ' cm'; x.font = '700 8px "Courier Prime", monospace'; const tw = x.measureText(t).width;
      x.fillStyle = 'rgba(244,238,221,0.92)'; U.rr(x, cx - tw / 2 - 4, cy - r * 1.02 - 14, tw + 8, 11, 2); x.fill();
      x.fillStyle = '#1B1A17'; x.textAlign = 'center'; x.fillText(t, cx, cy - r * 1.02 - 5.5);
    }
  },
  _lime(x, now) {
    const st = this.st, lx = 430, top = 176, bot = 242;
    // the limewater: clear, going milky as CO₂ forms chalk (calcium carbonate) in it
    const m = st.lime;
    x.fillStyle = `rgba(${Math.round(222 + 26 * m)},${Math.round(236 + 10 * m)},${Math.round(238 + 6 * m)},${(0.4 + 0.55 * m).toFixed(2)})`;
    x.beginPath(); x.moveTo(lx - 6.4, top); x.lineTo(lx - 6.4, 238); x.arc(lx, 238, 6.4, Math.PI, 0, true); x.lineTo(lx + 6.4, top); x.closePath(); x.fill();
    if (m > 0.05) { x.fillStyle = `rgba(255,255,255,${(0.35 * m).toFixed(2)})`; for (let k = 0; k < 14; k++) { x.beginPath(); x.arc(lx + Math.sin(k * 3.7) * 4, top + 6 + (k * 17 % 60), 0.8, 0, TAU); x.fill(); } }
    if (st.limeT >= 0 && st.from >= 0) {
      const fx = this.FX[st.from];
      x.strokeStyle = '#6E2A20'; x.lineWidth = 2.4; x.lineCap = 'round';
      x.beginPath(); x.moveTo(fx, this.NT - 3); x.bezierCurveTo(fx + 20, 70, lx - 10, 60, lx, 120); x.lineTo(lx, bot - 6); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,0.3)'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(fx - 1, this.NT - 4); x.bezierCurveTo(fx + 19, 69, lx - 11, 59, lx - 1, 120); x.stroke();
      for (const b of st.bub[3] || []) { const y = bot - 6 - b.y; if (y < top) continue; x.strokeStyle = 'rgba(255,255,255,0.9)'; x.lineWidth = 0.4; x.beginPath(); x.arc(lx + b.x, y, b.r, 0, TAU); x.stroke(); }
    }
    if (m >= 0.99 && st.limeT < 0) { x.fillStyle = '#2F6A3A'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText('CO₂ ✓', lx, 136); }
  },
  _clock(x) {
    const st = this.st, cx = 46, cy = 50, min = st.running ? st.t * 40 : st.runs.length ? 40 : 0;
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.beginPath(); x.arc(cx + 2, cy + 3, 30, 0, TAU); x.fill();
    x.fillStyle = MX.lin(x, cx - 30, cy - 30, cx + 30, cy + 30, [[0, '#8A6844'], [1, '#5A4230']]); x.beginPath(); x.arc(cx, cy, 30, 0, TAU); x.fill();
    x.fillStyle = MX.rad(x, cx - 6, cy - 8, 3, 28, [[0, '#FFFDF4'], [1, '#E6DECA']]); x.beginPath(); x.arc(cx, cy, 26, 0, TAU); x.fill();
    x.strokeStyle = '#1B1A17';
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; x.lineWidth = k % 3 ? 0.6 : 1.4; x.beginPath(); x.moveTo(cx + Math.cos(a) * 21, cy + Math.sin(a) * 21); x.lineTo(cx + Math.cos(a) * 24.5, cy + Math.sin(a) * 24.5); x.stroke(); }
    const a = -Math.PI / 2 + min / 60 * TAU;
    x.strokeStyle = '#B0302A'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * 21, cy + Math.sin(a) * 21); x.stroke();
    x.fillStyle = 'rgba(176,48,42,0.18)'; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, 20, -Math.PI / 2, a); x.closePath(); x.fill();
    x.fillStyle = '#1B1A17'; x.beginPath(); x.arc(cx, cy, 1.8, 0, TAU); x.fill();
    x.font = '700 9px "Courier Prime", monospace'; x.textAlign = 'left'; x.fillStyle = '#2A2620';
    x.fillText(Math.round(min) + ' ' + L(tr('dk', 'min')), cx + 36, cy + 3);
  },
};
