'use strict';
// The potato test by Songül's garden: six equal potato cylinders go into five salt solutions and a cup of well
// water. After half an hour each one is blotted and weighed again. The line through the five known cups crosses
// zero where the potato cells' sap matches the solution, and reading the well's cylinder off that line tells how
// salty the well is.
const OSMO = {
  C: [0, 0.5, 1, 2, 4], WELL: 1.6, X0: 50, DX: 72, BY: 150, TRAY: 44, N: 6,
  LAB: ['%0', '%0,5', '%1', '%2', '%4'],
  bx(i) { return this.X0 + i * this.DX; },
  conc(i) { return i < 5 ? this.C[i] : this.WELL; },
  label(i) { return i < 5 ? this.LAB[i] : L(tr('KUYU', 'WELL')); },
  // % mass change after 30 min: gains water below ~0.9 % NaCl, loses it above, and levels off as the cells plasmolyse
  change(c) { return 24 * Math.tanh((0.9 - c) / 1.4); },

  open() {
    const S = G.S;
    const run = S.osmo || (S.osmo = { seed: 1 + Math.floor(Math.random() * 1e5), cut: false, in: [], soaked: false, m1: {}, est: null });
    this.st = { run, t: 0, anim: {}, wait: null, sel: null, shown: 0 };
    this._saidZero = this._saidWell = false;
    const body = h('div', 'kit rig ferm osmo');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <button class="os-cut">${L(tr('Patatesten 6 silindir kes ve tart', 'Cut 6 potato cylinders and weigh them'))}</button>
        <button class="os-wait">${L(tr('30 dakika bekle', 'Wait 30 minutes'))}</button>
        <label>${L(tr('Kuyu suyu kaç % tuzlu?', 'How salty is the well water (%)?'))} <b class="os-v">%1,0</b></label>
        <input class="os-est" type="range" min="0" max="4" step="0.1" value="1">
        <button class="os-go">${L(tr('Grafikten oku', 'Read it off the graph'))}</button>
        <p class="fm-const">${L(tr('Hepsinde aynı: aynı patates, aynı boy (1 cm × 4 cm), aynı süre, aynı sıcaklık. Tartmadan önce kâğıt havluyla kurulanır.', 'The same for all: the same potato, the same size (1 cm × 4 cm), the same time and temperature. Each is blotted dry before weighing.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('İpucu: önce silindirleri kes. Sonra her bardağa dokun: silindir içine düşer.', 'Tip: cut the cylinders first. Then tap each cup and a cylinder drops in.'))}</p>`;
    body.querySelector('.os-cut').onclick = () => this.cut();
    body.querySelector('.os-wait').onclick = () => this.wait();
    const est = body.querySelector('.os-est');
    est.oninput = () => { this.st.pick = +est.value; this._sync(); };
    body.querySelector('.os-go').onclick = () => this.estimate(+est.value);
    this.body = body; this.cv = body.querySelector('canvas');
    this.cv.addEventListener('pointerdown', e => {
      const r = this.cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 460, y = (e.clientY - r.top) / r.height * 300;
      if (y > 172) return;
      const i = Math.round((x - this.X0) / this.DX);
      if (i >= 0 && i < this.N && Math.abs(x - this.bx(i)) < 30) this.tapCup(i);
    });
    this.st.pick = run.est != null ? run.est : 1; est.value = this.st.pick;
    this.pn = UI.panel({ title: tr('Patates deneyi · Kuyu ne kadar tuzlu?', 'The potato test · How salty is the well?'), code: 'BİY.9.2.6', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.table(); this.loop();
  },
  // masses are fixed for this save: the same cylinder always weighs the same
  m0(i) { const R = MX.rng(this.st.run.seed * 17 + i * 5 + 1); return Math.round((2 + (R() - 0.5) * 0.16) * 100) / 100; },
  mEnd(i) {
    const R = MX.rng(this.st.run.seed * 23 + i * 11 + 7); R();
    return Math.round(this.m0(i) * (1 + (this.change(this.conc(i)) + (R() - 0.5) * 1.2) / 100) * 100) / 100;
  },
  pct(i) { const m = this.st.run.m1[i]; return m == null ? null : (m - this.m0(i)) / this.m0(i) * 100; },

  cut() {
    const run = this.st.run;
    if (run.cut) return;
    run.cut = true; AU.sfx('click');
    this._msg(tr('Altı silindir, her biri yaklaşık 2 g. Şimdi her bardağa dokun.', 'Six cylinders, about 2 g each. Now tap each cup.'));
    this._sync(); this.table(); G.save();
  },
  tapCup(i) {
    const run = this.st.run;
    if (!run.cut) { this._msg(tr('Önce silindirleri kes.', 'Cut the cylinders first.')); return; }
    if (!run.soaked) this.drop(i); else this.weigh(i);
  },
  drop(i) {
    const run = this.st.run, st = this.st;
    if (!run.cut || run.in[i] || st.anim[i] || run.soaked || st.wait != null) return;
    st.anim[i] = { kind: 'drop', k: 0 }; AU.sfx('whoosh');
  },
  wait() {
    const run = this.st.run;
    if (run.soaked || this.st.wait != null) return;
    if (!run.cut || run.in.filter(Boolean).length < this.N) { this._msg(tr('Önce altı silindirin hepsini bardaklara at.', 'Put all six cylinders in the cups first.')); return; }
    this.st.wait = 0; AU.sfx('click'); this._sync();
  },
  weigh(i) {
    const run = this.st.run, st = this.st;
    if (!run.soaked || run.m1[i] != null || st.anim[i]) return;
    st.anim[i] = { kind: 'lift', k: 0 }; AU.sfx('click');
  },
  // the reading is checked against the student's own line, not the hidden answer
  estimate(v) {
    const a = this.analyse(), run = this.st.run;
    if (!a.known || !a.well) { this._msg(tr('Önce altı silindirin hepsini tart.', 'Weigh all six cylinders first.')); return false; }
    this.st.pick = v;
    if (Math.abs(v - a.wellAt) <= 0.3) {
      run.est = Math.round(a.wellAt * 10) / 10; AU.sfx('pen');
      this._sync(); this.table(); G.save();
      return true;
    }
    AU.sfx('wrong');
    this._msg(tr(`Kuyu silindiri %${this._f(a.wellPct)} değişti. Kesikli çizgi, bilinen bardakların çizgisini nerede kesiyor? Oradan aşağı in.`, `The well cylinder changed by ${this._f(a.wellPct)}%. Where does the dashed line cross the line of the known cups? Go straight down from there.`));
    this._sync();
    return false;
  },
  step(dt) {
    const st = this.st, run = st.run;
    st.t += dt;
    for (const k in st.anim) {
      const an = st.anim[k], i = +k;
      an.k += dt / (an.kind === 'drop' ? 0.55 : 0.7);
      if (an.k < 1) continue;
      delete st.anim[k];
      if (an.kind === 'drop') { run.in[i] = true; AU.sfx('splash'); if (run.in.filter(Boolean).length === this.N) this._msg(tr('Hepsi bardaklarda. Şimdi “30 dakika bekle”ye bas.', 'All in the cups. Now press “Wait 30 minutes”.')); }
      else { run.m1[i] = this.mEnd(i); st.sel = i; st.shown = 0; AU.sfx('pen'); }
      this._sync(); this.table(); G.save();
    }
    if (st.wait != null) {
      st.wait += dt / 2.4;
      if (st.wait >= 1) { st.wait = null; run.soaked = true; this._msg(tr('Yarım saat geçti. Şimdi her bardağa dokun: silindir kurulanıp teraziye konur.', 'Half an hour has passed. Now tap each cup: the cylinder is blotted and put on the scale.')); this._sync(); this.table(); G.save(); }
    }
    if (st.sel != null) st.shown = Math.min(1, st.shown + dt / 0.6);
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
  _f(v) { return (v > 0 ? '+' : '') + (Math.round(v * 10) / 10).toFixed(1).replace('.', I18N.lang === 'tr' ? ',' : '.'); },
  _c(v) { return (Math.round(v * 10) / 10).toFixed(1).replace('.', I18N.lang === 'tr' ? ',' : '.'); },
  _msg(t) { if (this.body) this.body.querySelector('.kit-msg').textContent = L(t); },
  _sync() {
    const b = this.body, run = this.st.run, a = this.analyse();
    b.querySelector('.os-cut').disabled = run.cut;
    b.querySelector('.os-wait').disabled = run.soaked || this.st.wait != null || a.dropped < this.N;
    b.querySelector('.os-est').disabled = b.querySelector('.os-go').disabled = !(a.known && a.well) || run.est != null;
    b.querySelector('.os-v').textContent = '%' + this._c(run.est != null ? run.est : this.st.pick);
  },
  analyse() {
    const run = this.st.run, o = { cut: run.cut, dropped: run.in.filter(Boolean).length, soaked: run.soaked };
    o.weighed = Object.keys(run.m1).length;
    o.known = [0, 1, 2, 3, 4].every(i => run.m1[i] != null);
    o.well = run.m1[5] != null;
    o.pts = [0, 1, 2, 3, 4].filter(i => run.m1[i] != null).map(i => [this.C[i], this.pct(i)]);
    // where the measured line crosses zero, and where it reaches the well cylinder's change
    const cross = y => { const p = o.pts; for (let k = 0; k < p.length - 1; k++) { const [c0, v0] = p[k], [c1, v1] = p[k + 1]; if ((v0 - y) * (v1 - y) <= 0 && v0 !== v1) return c0 + (v0 - y) / (v0 - v1) * (c1 - c0); } return null; };
    o.zero = o.known ? cross(0) : null;
    o.wellPct = o.well ? this.pct(5) : null;
    o.wellAt = o.known && o.well ? cross(o.wellPct) : null;
    if (o.wellAt == null && o.known && o.well) o.wellAt = o.wellPct > o.pts[0][1] ? 0 : 4;
    o.est = run.est;
    o.done = o.known && o.well && run.est != null;
    return o;
  },
  feel(p) { return p > 5 ? tr('sert, gergin', 'firm, taut') : p < -5 ? tr('yumuşak, bükülüyor', 'soft, it bends') : tr('pek değişmedi', 'hardly changed'); },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, run = this.st.run;
    const rows = run.cut ? Array.from({ length: this.N }, (_, i) => {
      const p = this.pct(i);
      return `<tr${i === 5 ? ' class="os-well"' : ''}><td><b>${U.esc(this.label(i))}</b></td><td>${this.m0(i).toFixed(2)} g</td><td>${run.m1[i] != null ? run.m1[i].toFixed(2) + ' g' : '—'}</td><td>${p != null ? '<b>' + this._f(p) + '</b>' : '—'}</td><td>${p != null ? U.esc(L(this.feel(p))) : ''}</td></tr>`;
    }).join('') : '';
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Çözelti', 'Solution'))}</th><th>${L(tr('Başta', 'Before'))}</th><th>${L(tr('Sonra', 'After'))}</th><th>${L(tr('Değişim %', 'Change %'))}</th><th>${L(tr('Doku', 'Feel'))}</th></tr>${rows || `<tr><td colspan="5">${L(tr('Henüz silindir yok.', 'No cylinders yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.dropped === this.N, tr('Altı bardak', 'Six cups')], [a.soaked, tr('30 dakika', '30 minutes')], [a.weighed === this.N, tr(`Tartıldı (${a.weighed}/6)`, `Weighed (${a.weighed}/6)`)], [a.est != null, tr('Kuyu okundu', 'Well read')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const ws = [0, 1, 2, 3, 4, 5].filter(i => run.m1[i] != null);
    if (ws.length) UI._chart(body.querySelector('.rig-chart'), { values: ws.map(i => Math.round(this.pct(i) * 10) / 10), labels: ws.map(i => ({ tr: i < 5 ? this.LAB[i] : 'KUYU', en: i < 5 ? this.LAB[i] : 'WELL' })), colors: ws.map(i => i === 5 ? '#6A7A8A' : this.pct(i) >= 0 ? '#6E8F4E' : '#B0503A'), unit: tr('% kütle değişimi', '% mass change') });
    if (a.known && !this._saidZero) { this._saidZero = true; this._msg(tr(`Çizgi sıfırı yaklaşık %${this._c(a.zero)}’da kesiyor: patates hücrelerinin özsuyu bu kadar tuzlu gibi. ${a.well ? 'Şimdi kuyuyu oku!' : 'Kuyu bardağını da tart.'}`, `The line crosses zero at about ${this._c(a.zero)}%: the potato cells’ sap is about as salty as that. ${a.well ? 'Now read the well!' : 'Weigh the well cup too.'}`)); }
    else if (a.known && a.well && !this._saidWell && run.est == null) { this._saidWell = true; this._msg(tr('Kaydırıcıyı sürükle: dikey çizgi, kesikli kuyu çizgisini bilinen bardakların çizgisi üstünde kessin.', 'Drag the slider until the vertical line meets the dashed well line on the line of the known cups.')); }
    if (a.done && !S.flags.osmoDone) {
      S.flags.osmoDone = true;
      S.journal.exps.push({ title: tr('Patates osmoz deneyi', 'Potato osmosis test'), code: 'BİY.9.2.6', t: Date.now(),
        head: [tr('Çözelti', 'Solution'), tr('Başta', 'Before'), tr('Sonra', 'After'), tr('Değişim', 'Change'), tr('Doku', 'Feel')],
        rows: Array.from({ length: this.N }, (_, i) => [i < 5 ? this.LAB[i] : tr('Kuyu suyu', 'Well water'), this.m0(i).toFixed(2) + ' g', run.m1[i].toFixed(2) + ' g', this._f(this.pct(i)) + ' %', this.feel(this.pct(i))]),
        chart: { values: ws.map(i => Math.round(this.pct(i) * 10) / 10), labels: ws.map(i => ({ tr: i < 5 ? this.LAB[i] : 'KUYU', en: i < 5 ? this.LAB[i] : 'WELL' })), colors: ws.map(i => i === 5 ? '#6A7A8A' : this.pct(i) >= 0 ? '#6E8F4E' : '#B0503A'), unit: tr('% kütle değişimi', '% mass change') },
        note: tr(`Tuzu az bardaklarda patates su aldı, ağırlaştı ve sertleşti; tuzu çok olanlarda su kaybetti ve yumuşadı. Su, hücre zarından az tuzlu taraftan çok tuzlu tarafa geçti: osmoz. Çizgi sıfırı yaklaşık %${this._c(a.zero)}’da kesti. Kuyu suyu yaklaşık %${this._c(run.est)} tuzlu: kök hücrelerinden de su çeker.`, `In the less salty cups the potato took in water, got heavier and firmer; in the saltier ones it lost water and went soft. Water crossed the cell membrane from the less salty side to the saltier side: osmosis. The line crossed zero at about ${this._c(a.zero)}%. The well water is about ${this._c(run.est)}% salt: it pulls water out of root cells too.`) });
      this._msg(tr(`Kuyu suyu yaklaşık %${this._c(run.est)} tuzlu: patates hücrelerinden de, domates köklerinden de tuzlu! Sonuçlar defterinde.`, `The well water is about ${this._c(run.est)}% salt: saltier than the potato cells, and saltier than the tomato roots! The results are in your journal.`));
      if (Q.at('well', 'osmo')) { UI.stamp(L(tr('OSMOZ', 'OSMOSIS'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  async close() {
    this.pn = null;
    if (Q.at('well', 'osmo') && G.S.flags.osmoDone) {
      await ask('osmo_why');
      await UI.say('player', tr('Toprak ıslak ama su kuyudan tuzlu geliyor. Kökteki hücreler su alamıyor, tersine su veriyor. Songül Abla’ya anlatmalıyım.', 'The soil is wet, but the water comes salty from the well. The root cells can’t take water in; they give it away instead. I must tell Songül Abla.'));
      Q.adv('well');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc && this._bcLang === I18N.lang) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(55);
    // a garden table of weathered planks under the walnut's shade
    b.fillStyle = '#B89A6E'; b.fillRect(0, 0, 460, 172);
    for (let y = 0; y < 172; y += 21) {
      b.fillStyle = y % 42 ? '#B0916A' : '#BC9E72'; b.fillRect(0, y, 460, 20);
      b.fillStyle = 'rgba(60,40,20,0.35)'; b.fillRect(0, y + 20, 460, 1);
      for (let k = 0; k < 7; k++) { b.strokeStyle = 'rgba(90,64,36,0.18)'; b.lineWidth = 0.6; b.beginPath(); const yy = y + 3 + R() * 14; b.moveTo(0, yy); b.bezierCurveTo(150, yy + (R() - 0.5) * 4, 300, yy + (R() - 0.5) * 4, 460, yy); b.stroke(); }
    }
    for (let k = 0; k < 9; k++) { b.fillStyle = `rgba(40,60,20,${(0.06 + R() * 0.06).toFixed(2)})`; b.beginPath(); b.ellipse(R() * 460, R() * 172, 30 + R() * 40, 14 + R() * 18, R() * 3, 0, TAU); b.fill(); }
    // the lower part: a field notebook page with the scale on the left and the graph paper on the right
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    const g = this.G;
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5;
    for (let c2 = 0; c2 <= 4.001; c2 += 0.25) { const x = this.gx(c2); b.beginPath(); b.moveTo(x, g.y0); b.lineTo(x, g.y1); b.stroke(); }
    for (let v = -30; v <= 20; v += 5) { const y = this.gy(v); b.beginPath(); b.moveTo(g.x0, y); b.lineTo(g.x1, y); b.stroke(); }
    b.strokeStyle = '#1B1A17'; b.lineWidth = 1; b.beginPath(); b.moveTo(g.x0, g.y0); b.lineTo(g.x0, g.y1); b.lineTo(g.x1, g.y1); b.stroke();
    b.setLineDash([2, 2]); b.beginPath(); b.moveTo(g.x0, this.gy(0)); b.lineTo(g.x1, this.gy(0)); b.stroke(); b.setLineDash([]);
    b.fillStyle = '#1B1A17'; b.font = '700 7.5px "Courier Prime", monospace'; b.textAlign = 'center';
    for (let c2 = 0; c2 <= 4; c2++) b.fillText('%' + c2, this.gx(c2), g.y1 + 9);
    b.textAlign = 'right'; for (const v of [20, 10, 0, -10, -20, -30]) b.fillText((v > 0 ? '+' : '') + v, g.x0 - 3, this.gy(v) + 2.5);
    b.textAlign = 'left'; b.font = '600 8px "Atkinson Hyperlegible Next", sans-serif';
    b.fillText(L(tr('kütle değişimi %', 'mass change %')), g.x0 + 4, g.y0 + 7);
    b.textAlign = 'right'; b.fillText(L(tr('tuz oranı →', 'salt →')), g.x1, g.y1 - 4);
    // the scale
    b.fillStyle = 'rgba(0,0,0,0.2)'; b.beginPath(); b.ellipse(64, 290, 50, 5, 0, 0, TAU); b.fill();
    b.fillStyle = '#D8DCE0'; U.rr(b, 16, 236, 96, 52, 6); b.fill(); b.strokeStyle = '#6A7078'; b.lineWidth = 1; b.stroke();
    b.fillStyle = '#9AA0A8'; b.beginPath(); b.ellipse(64, 234, 40, 7, 0, 0, TAU); b.fill(); b.fillStyle = '#C4C8CE'; b.beginPath(); b.ellipse(64, 232, 38, 6, 0, 0, TAU); b.fill();
    b.fillStyle = '#20302A'; U.rr(b, 28, 252, 72, 26, 3); b.fill();
    this._bc = c; this._bcLang = I18N.lang;
    return c;
  },
  G: { x0: 160, x1: 448, y0: 182, y1: 286 },
  gx(c) { return this.G.x0 + c / 4 * (this.G.x1 - this.G.x0); },
  gy(v) { return this.G.y0 + (20 - U.clamp(v, -30, 20)) / 50 * (this.G.y1 - this.G.y0); },
  // where cylinder i is drawn now: on the tray, falling, standing in its cup, on its way to the scale, on the scale
  pose(i) {
    const st = this.st, run = st.run, an = st.anim[i], bx = this.bx(i);
    const tray = { x: bx, y: this.TRAY, a: 0 }, cup = { x: bx + 3, y: this.BY - 30, a: 1.2 }, scale = { x: 64, y: 226, a: 0 };
    const mix = (p, q, k) => ({ x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k - Math.sin(k * Math.PI) * 26, a: p.a + (q.a - p.a) * k });
    const p = this.pct(i), soak = run.soaked || run.m1[i] != null ? 1 : st.wait != null && run.in[i] ? U.easeOut(st.wait) : 0;
    const f = p != null ? p : this.change(this.conc(i)) * soak;
    const sz = { len: 34 * (1 + f * 0.006), w: 8 * (1 + f * 0.004), bend: f < 0 ? -f * 0.024 : 0 };
    if (an) return Object.assign(an.kind === 'drop' ? mix(tray, cup, U.clamp(an.k, 0, 1)) : mix(cup, scale, U.clamp(an.k, 0, 1)), sz);
    if (run.m1[i] != null) return Object.assign(st.sel === i ? scale : tray, sz);
    if (run.in[i]) return Object.assign(cup, sz);
    return Object.assign(tray, sz);
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, run = st.run, t = st.t;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // before the cut: a potato on a board and the cork borer
    if (!run.cut) {
      x.fillStyle = '#C8A878'; U.rr(x, 170, 14, 120, 44, 6); x.fill(); x.strokeStyle = 'rgba(60,40,20,0.6)'; x.lineWidth = 0.8; x.stroke();
      MX.fill(x, MX.blob(214, 36, 30, 17, { wob: 0.12, n: 18, seed: 5 }), MX.lit(x, 214, 36, 30, '#C09A5A'));
      x.fillStyle = 'rgba(80,60,30,0.5)'; for (let k = 0; k < 6; k++) { x.beginPath(); x.arc(196 + k * 7, 30 + (k % 3) * 5, 1, 0, TAU); x.fill(); }
      x.save(); x.translate(262, 36); x.rotate(-0.3); x.fillStyle = '#B8BCC0'; x.fillRect(-2, -18, 4, 30); x.fillStyle = '#3A3A3A'; x.fillRect(-7, -22, 14, 5); x.restore();
    }
    // the cups: five labelled salt solutions and one of well water
    for (let i = 0; i < this.N; i++) this._cup(x, i, t, false);
    for (let i = 0; i < this.N; i++) if (run.cut) this._cyl(x, this.pose(i), i);
    for (let i = 0; i < this.N; i++) this._cup(x, i, t, true);
    // water moving in or out while the clock runs
    if (st.wait != null) {
      for (let i = 0; i < this.N; i++) {
        const out = this.change(this.conc(i)) < 0, p = this.pose(i);
        for (let k = 0; k < 3; k++) {
          const q = (t * 0.9 + k / 3) % 1, a = k * 2.1 + i, r0 = out ? 7 + q * 12 : 19 - q * 12;
          x.fillStyle = `rgba(60,130,200,${(0.8 * Math.sin(q * Math.PI)).toFixed(2)})`;
          x.beginPath(); x.arc(p.x + Math.cos(a) * r0, p.y + Math.sin(a) * r0 * 0.8, 1.6, 0, TAU); x.fill();
        }
      }
      this._clock(x, 424, 26, st.wait);
    }
    this._scale(x);
    this._graph(x);
  },
  _cup(x, i, t, front) {
    const bx = this.bx(i), by = this.BY, w = 21, top = by - 66, lq = by - 46;
    if (!front) {
      x.fillStyle = 'rgba(40,30,20,0.28)'; x.beginPath(); x.ellipse(bx + 3, by + 2, w + 3, 4, 0, 0, TAU); x.fill();
      x.fillStyle = i === 5 ? 'rgba(206,210,180,0.75)' : 'rgba(200,226,240,0.6)'; x.fillRect(bx - w + 1, lq, 2 * w - 2, by - lq);
      x.fillStyle = 'rgba(255,255,255,0.35)'; x.beginPath(); x.ellipse(bx, lq, w - 1, 3, 0, 0, TAU); x.fill();
      return;
    }
    x.strokeStyle = 'rgba(40,50,60,0.75)'; x.lineWidth = 1.1;
    x.beginPath(); x.moveTo(bx - w, top); x.lineTo(bx - w, by); x.lineTo(bx + w, by); x.lineTo(bx + w, top); x.stroke();
    x.beginPath(); x.ellipse(bx, top, w, 3, 0, 0, TAU); x.stroke();
    x.fillStyle = 'rgba(255,255,255,0.3)'; x.fillRect(bx - w + 3, top + 4, 3, by - top - 8);
    for (let k = 1; k < 4; k++) { x.strokeStyle = 'rgba(40,50,60,0.5)'; x.lineWidth = 0.5; x.beginPath(); x.moveTo(bx + w - 6, by - k * 14); x.lineTo(bx + w, by - k * 14); x.stroke(); }
    // label card
    x.fillStyle = i === 5 ? '#2A3440' : '#F4EEDD'; x.fillRect(bx - 17, by + 5, 34, 13); x.strokeStyle = '#1B1A17'; x.lineWidth = 0.7; x.strokeRect(bx - 17, by + 5, 34, 13);
    x.fillStyle = i === 5 ? '#F4EEDD' : '#1B1A17'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(this.label(i), bx, by + 14.5);
  },
  _cyl(x, p, i) {
    // the centre line is an arc: a limp cylinder sags, a firm one stays straight
    const pts = [], n = 8, L0 = p.len, b = p.bend;
    for (let k = 0; k <= n; k++) { const s = k / n - 0.5; pts.push(b > 0.01 ? [Math.sin(s * b) * L0 / b, (1 - Math.cos(s * b)) * L0 / b] : [s * L0, 0]); }
    x.save(); x.translate(p.x, p.y); x.rotate(p.a);
    x.fillStyle = 'rgba(40,30,20,0.18)'; x.beginPath(); x.ellipse(2, 5, L0 / 2, 3, 0, 0, TAU); x.fill();
    MX.taper(x, pts, p.w, p.w, '#EEE0B0', 'rgba(120,96,50,0.9)');
    const e = pts[n], s0 = pts[0];
    x.fillStyle = '#F8F0D2'; x.strokeStyle = 'rgba(120,96,50,0.8)'; x.lineWidth = 0.5;
    for (const [q, dir] of [[s0, -1], [e, 1]]) { x.beginPath(); x.ellipse(q[0], q[1], 1.6, p.w / 2, dir * p.bend / 2, 0, TAU); x.fill(); x.stroke(); }
    x.restore();
  },
  _clock(x, cx, cy, k) {
    x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(cx, cy, 16, 0, TAU); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.4; x.stroke();
    x.fillStyle = 'rgba(200,80,60,0.35)'; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, 14, -Math.PI / 2, -Math.PI / 2 + k * Math.PI, false); x.closePath(); x.fill();
    const a = -Math.PI / 2 + k * Math.PI, b = -Math.PI / 2 + k * TAU * 6;
    x.strokeStyle = '#1B1A17'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * 11, cy + Math.sin(a) * 11); x.stroke();
    x.lineWidth = 0.7; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(b) * 13, cy + Math.sin(b) * 13); x.stroke();
    x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(Math.round(k * 30) + L(tr(' dk', ' min')), cx, cy + 27);
  },
  _scale(x) {
    const st = this.st, run = st.run, i = st.sel;
    let v = null;
    if (i != null && run.m1[i] != null) v = run.m1[i] * U.clamp(st.shown, 0, 1);
    x.fillStyle = '#7CF0B0'; x.font = '700 15px "Courier Prime", monospace'; x.textAlign = 'right';
    x.fillText(v == null ? '0.00 g' : v.toFixed(2) + ' g', 96, 271);
    x.fillStyle = '#1B1A17'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center';
    x.fillText(i != null && run.m1[i] != null ? this.label(i) + ' · ' + L(tr('başta', 'before')) + ' ' + this.m0(i).toFixed(2) + ' g' : L(tr('terazi', 'scale')), 64, 198);
  },
  _graph(x) {
    const a = this.analyse(), run = this.st.run, g = this.G;
    // the well cylinder's change: a dashed line across
    if (a.well) {
      const y = this.gy(a.wellPct);
      x.strokeStyle = '#4A5A6A'; x.lineWidth = 1; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(g.x0, y); x.lineTo(g.x1, y); x.stroke(); x.setLineDash([]);
      x.fillStyle = '#4A5A6A'; x.font = '700 7.5px "Courier Prime", monospace'; x.textAlign = 'right'; x.fillText(L(tr('kuyu', 'well')) + ' ' + this._f(a.wellPct), g.x1, y - 3);
    }
    // the line through the known cups, and its points
    if (a.pts.length > 1) { x.strokeStyle = '#2F6A3A'; x.lineWidth = 1.6; x.beginPath(); a.pts.forEach(([c, v], k) => k ? x.lineTo(this.gx(c), this.gy(v)) : x.moveTo(this.gx(c), this.gy(v))); x.stroke(); }
    for (const [c, v] of a.pts) { x.fillStyle = v >= 0 ? '#6E8F4E' : '#B0503A'; x.beginPath(); x.arc(this.gx(c), this.gy(v), 3, 0, TAU); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 0.7; x.stroke(); }
    if (a.zero != null) { x.fillStyle = '#2F6A3A'; x.beginPath(); x.arc(this.gx(a.zero), this.gy(0), 2.2, 0, TAU); x.fill(); x.font = '700 7.5px "Courier Prime", monospace'; x.textAlign = 'left'; x.fillText('≈%' + this._c(a.zero), this.gx(a.zero) + 4, this.gy(0) - 4); }
    // the student's reading: a vertical line from the slider, green once it is right
    if (a.known && a.well) {
      const c = run.est != null ? run.est : this.st.pick, px = this.gx(c);
      x.strokeStyle = run.est != null ? '#2F6A3A' : '#B03A2E'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(px, g.y0); x.lineTo(px, g.y1); x.stroke();
      x.fillStyle = x.strokeStyle; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center';
      x.fillText((run.est != null ? L(tr('kuyu ≈ ', 'well ≈ ')) : '') + '%' + this._c(c), U.clamp(px, g.x0 + 24, g.x1 - 24), g.y1 - 12);
    }
  },
};
