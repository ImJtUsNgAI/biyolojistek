'use strict';
// Germination bench in the seed bank: four petri dishes of ten pea seeds. For each dish choose the water, the
// temperature, light or dark, and which jar the seeds come from; wait a week and count the sprouts.
const GERM = {
  WATER: { dry: tr('Kuru', 'Dry'), moist: tr('Nemli', 'Moist'), wet: tr('Su altında', 'Under water') },
  LOTS: ['2023', '2011', '1998'],
  // share of each jar's seeds still alive: seeds age in storage, even dry and cool
  VIAB: { 2023: 0.95, 2011: 0.6, 1998: 0.25 },
  DX: [70, 180, 290, 400], DY: 138, R: 46,
  RUN: 6, // seconds of real time for a week
  cond(d) { return `${L(this.WATER[d.water])} · ${d.temp} °C · ${L(d.light ? tr('ışık', 'light') : tr('karanlık', 'dark'))} · ${d.lot}`; },

  open() {
    const S = G.S;
    const st = this.st = { d: [0, 1, 2, 3].map(() => ({ water: 'moist', temp: 22, light: true, lot: '2023' })), runs: S.germRuns || (S.germRuns = []), running: false, day: 0, seeds: [[], [], [], []] };
    const last = st.runs[st.runs.length - 1];
    if (last) { last.d.forEach((d, i) => { st.d[i] = { water: d.water, temp: d.temp, light: d.light, lot: d.lot }; }); this._sow(last.seed); st.day = 7; }
    else this._sow(1);
    const seg = (i, key, opts) => `<div class="seg" data-k="${key}">${opts.map(([v, t]) => `<button data-v="${v}">${t}</button>`).join('')}</div>`;
    const body = h('div', 'kit rig ferm germ');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Tabak · su · sıcaklık · ışık · kavanoz', 'Dish · water · temperature · light · jar'))}</label>
        ${[0, 1, 2, 3].map(i => `<div class="fm-row gm-row" data-i="${i}"><b class="fm-tag" style="--bc:#4A5A48">${'ABCD'[i]}</b>
          ${seg(i, 'water', Object.keys(this.WATER).map(k => [k, L(this.WATER[k])]))}
          ${seg(i, 'temp', [[4, '4 °C'], [22, '22 °C']])}
          ${seg(i, 'light', [[1, '☀'], [0, '☾']])}
          ${seg(i, 'lot', this.LOTS.map(y => [y, y]))}</div>`).join('')}
        <p class="fm-const">${L(tr('Her tabakta aynı: 10 bezelye tohumu, kurutma kâğıdı, kapalı kapak.', 'The same in every dish: 10 pea seeds, blotting paper, a closed lid.'))}</p>
        <button class="big run">${L(tr('Bir hafta bekle ▶', 'Wait one week ▶'))}</button>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('İpucu: tabakların yalnızca birinde bir şeyi değiştir. Tohum neye ihtiyaç duyuyor?', 'Tip: change one thing in just one dish. What does a seed need?'))}</p>`;
    body.querySelectorAll('.gm-row').forEach(row => {
      const i = +row.dataset.i;
      row.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => {
        // on the board each setting shows only its current value, and a tap on it steps to the next choice
        const bs = [...sg.querySelectorAll('button')], k = sg.dataset.k;
        const v = G.set.board && b.classList.contains('on') ? bs[(bs.indexOf(b) + 1) % bs.length].dataset.v : b.dataset.v;
        this._set(i, { [k]: k === 'temp' ? +v : k === 'light' ? v === '1' : v });
      }));
    });
    body.querySelector('.run').onclick = () => this.run();
    this.body = body; this.cv = body.querySelector('canvas');
    this._sync();
    this.pn = UI.panel({ title: tr('Tohum bankası · Çimlenme masası', 'Seed bank · Germination bench'), code: 'BİY.12.1.12', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this.table(); this.loop();
  },
  _set(i, o) {
    const st = this.st;
    if (st.running) return;
    Object.assign(st.d[i], o);
    st.day = 0; this._sow(st.seed);
    AU.sfx('click'); this._sync();
  },
  _sync() {
    const st = this.st;
    this.body.querySelectorAll('.gm-row').forEach(row => {
      const d = st.d[+row.dataset.i];
      row.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => {
        const k = sg.dataset.k, v = b.dataset.v;
        b.classList.toggle('on', k === 'temp' ? +v === d.temp : k === 'light' ? (v === '1') === d.light : v === d[k]);
      }));
    });
    this.body.querySelector('.run').disabled = st.running;
  },
  // lay ten seeds in each dish and decide their fate: whether each one is alive, and on which day it would sprout
  _sow(seed) {
    const st = this.st; st.seed = seed;
    st.seeds = st.d.map((d, i) => {
      const R = MX.rng(seed * 13 + i * 7 + 1), alive = U.clamp(Math.round(10 * this.VIAB[d.lot] + (R() - 0.5) * 2), 0, 10), out = [];
      const drown = d.water === 'wet' ? 1 + Math.floor(R() * 2) : 99;
      for (let k = 0; k < 10; k++) {
        const a = k < 8 ? k / 8 * TAU + 0.3 : (k - 8) * Math.PI + 0.3, r = k < 8 ? 27 + (R() - 0.5) * 4 : 9;
        const ok = k < alive && d.water !== 'dry' && (d.water !== 'wet' || k < drown);
        // a live seed on wet paper sprouts in one to three days when warm; in the fridge it takes one to two weeks
        const tg = ok ? (d.temp === 22 ? 1.1 + R() * 1.9 : 5.5 + R() * 8) : 1e9;
        out.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, a: Math.atan2(Math.sin(a) * r, Math.cos(a) * r) + (R() - 0.5) * 0.8, tg, curl: (R() - 0.5) * 1.6, mould: !ok && d.water !== 'dry' && R() < (d.water === 'wet' ? 0.7 : 0.5) });
      }
      return out;
    });
  },
  run() {
    const st = this.st;
    if (st.running) return;
    this._sow(Math.floor(Math.random() * 1e6) + 2);
    st.running = true; st.day = 0;
    AU.sfx('click'); this._sync();
  },
  count(i, day = this.st.day) { return this.st.seeds[i].filter(s => day >= s.tg + 0.15).length; },
  step(dt) {
    const st = this.st;
    if (!st.running) return;
    st.day = Math.min(7, st.day + dt * 7 / this.RUN);
    if (st.day >= 7) this.finish();
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
    st.running = false; st.day = 7;
    st.runs.push({ seed: st.seed, d: st.d.map((d, i) => ({ water: d.water, temp: d.temp, light: d.light, lot: d.lot, n: this.count(i, 7) })) });
    AU.sfx('pen');
    this._sync(); this.table(); G.save();
  },
  analyse() {
    const o = { water: false, oxygen: false, temp: false, light: false, lot: false, lots: {} };
    for (const r of this.st.runs) {
      const d = r.d;
      for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
        const diff = ['water', 'temp', 'light', 'lot'].filter(k => d[a][k] !== d[b][k]);
        if (diff.length !== 1) continue;
        const k = diff[0];
        if (k === 'water') { const w = [d[a].water, d[b].water].sort().join('|'); if (w === 'dry|moist') o.water = true; if (w === 'moist|wet') o.oxygen = true; }
        else o[k] = true;
      }
      for (const x of d) if (x.water === 'moist' && x.temp === 22) o.lots[x.lot] = x.n * 10;
    }
    o.factors = o.water && o.oxygen && o.temp && o.light;
    o.viab = this.LOTS.every(y => o.lots[y] != null);
    return o;
  },
  table() {
    const st = this.st, body = this.body, a = this.analyse(), S = G.S;
    const rows = st.runs.slice(-2).map((r, k, arr) => r.d.map((d, i) => `<tr class="${i === 0 ? 'fm-first' : ''}"${k === arr.length - 1 ? ` data-new="${st.runs.length}"` : ''}><td>${i === 0 ? '#' + (st.runs.length - arr.length + k + 1) : ''}</td><td>${'ABCD'[i]}</td><td>${U.esc(this.cond(d))}</td><td><b>${d.n}/10</b></td></tr>`).join('')).reverse().join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Deneme', 'Run'))}</th><th>${L(tr('Tabak', 'Dish'))}</th><th>${L(tr('Koşul', 'Condition'))}</th><th>${L(tr('Çimlenen', 'Sprouted'))}</th></tr>${rows || `<tr><td colspan="4">${L(tr('Henüz deneme yok.', 'No runs yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.water, tr('Su', 'Water')], [a.oxygen, tr('Hava (su altı)', 'Air (under water)')], [a.temp, tr('Sıcaklık', 'Temperature')], [a.light, tr('Işık', 'Light')], [a.viab, tr('Üç kavanoz', 'Three jars')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const last = st.runs[st.runs.length - 1];
    if (a.viab) UI._chart(body.querySelector('.rig-chart'), { values: this.LOTS.map(y => a.lots[y]), labels: this.LOTS.map(y => ({ tr: y, en: y })), colors: ['#6E9A4A', '#C8A24E', '#A0522D'], unit: tr('çimlenme (%)', 'germination (%)') });
    else if (last) UI._chart(body.querySelector('.rig-chart'), { values: last.d.map(d => d.n), labels: last.d.map((d, i) => ({ tr: 'ABCD'[i], en: 'ABCD'[i] })), colors: ['#6E8F4E', '#8FAA5E', '#5E7A3E', '#A8B87A'], unit: tr('çimlenen tohum (10’da)', 'seeds sprouted (of 10)') });
    let msg = null;
    if (a.factors && !S.flags.germFactors) {
      S.flags.germFactors = true;
      S.journal.exps.push({ title: tr('Çimlenme etmenleri', 'What seeds need to germinate'), code: 'BİY.12.1.12', t: Date.now(),
        head: [tr('Tabak', 'Dish'), tr('Koşul', 'Condition'), tr('Çimlenen', 'Sprouted')],
        rows: last.d.map((d, i) => ['ABCD'[i], { tr: `${this.WATER[d.water].tr} ·${d.temp} °C · ${d.light ? 'ışık' : 'karanlık'} · ${d.lot}`, en: `${this.WATER[d.water].en} · ${d.temp} °C · ${d.light ? 'light' : 'dark'} · ${d.lot}` }, d.n + '/10']),
        stamps: [{ t: tr('Su', 'Water'), ok: true }, { t: tr('Hava', 'Air'), ok: true }, { t: tr('Sıcaklık', 'Temperature'), ok: true }, { t: tr('Işık', 'Light'), ok: true }],
        note: tr('Bezelye tohumu çimlenmek için suya, havaya (oksijen) ve uygun sıcaklığa ihtiyaç duyuyor. Kuru tohum hiç şişmedi; su altındakiler şişti ama boğuldu; soğukta çok yavaş. Işık fark etmedi.', 'Pea seeds need water, air (oxygen) and a suitable temperature to germinate. Dry seeds never swelled; seeds under water swelled but drowned; in the cold they were very slow. Light made no difference.') });
      msg = tr('Tohumun neye ihtiyacı olduğunu buldun! Sonuçlar defterine yazıldı.', 'You found out what a seed needs! Your results are in the journal.');
      if (Q.at('seedbank', 'exp')) { UI.stamp(L(tr('ADİL DENEY', 'FAIR TEST'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); }; }
    }
    if (a.viab && Q.state('seedbank') !== 'locked' && (!S.flags.germViab || Q.at('seedbank', 'viability'))) {
      S.germLots = a.lots;
      if (!S.flags.germViab) {
        S.flags.germViab = true;
        S.journal.exps.push({ title: tr('Tohum canlılık testi', 'Seed viability test'), code: 'BİY.12.1.12', t: Date.now(),
          head: [tr('Kavanoz', 'Jar'), tr('Çimlenme', 'Germination')],
          rows: this.LOTS.map(y => [y, '%' + a.lots[y]]),
          chart: { values: this.LOTS.map(y => a.lots[y]), labels: this.LOTS.map(y => ({ tr: y, en: y })), colors: ['#6E9A4A', '#C8A24E', '#A0522D'], unit: tr('çimlenme (%)', 'germination (%)') },
          note: tr('Nemli kâğıt, 22 °C, bir hafta. Tohum bankalarının kuralı: çimlenmesi %85’in altına düşen kavanoz yeniden ekilip tazelenir.', 'Moist paper, 22 °C, one week. The seed banks’ rule: a jar whose germination falls below 85% is sown again and renewed.') });
      }
      if (Q.at('seedbank', 'viability') && !msg) { msg = tr('Üç kavanoz da denendi. Sonuçlar defterinde.', 'All three jars tested. The results are in your journal.'); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); }; }
    }
    if (msg) body.querySelector('.kit-msg').textContent = L(msg);
  },
  async close() {
    this.pn = null;
    const S = G.S;
    if (Q.at('seedbank', 'exp') && S.flags.germFactors) {
      await ask('germ_oxygen');
      await UI.say('player', tr('Demek tohum da nefes alıyor. Şimdi çimlenen bir tohuma merceğimle yakından bakayım.', 'So seeds breathe too. Now let me take a close look at a sprouting seed with my lens.'));
      Q.adv('seedbank');
    } else if (Q.at('seedbank', 'viability') && S.flags.germViab && S.germLots) {
      const l = S.germLots;
      await ask('seed_regrow', { a: l['2023'], b: l['2011'], c: l['1998'] });
      Q.adv('seedbank');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    const key = I18N.lang + (document.fonts ? document.fonts.status : '');
    if (this._bk === key) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    // a green cutting mat on the bench, with its grid
    b.fillStyle = MX.lin(b, 0, 0, 0, 300, [[0, '#4E6E5A'], [1, '#3E5A48']]); b.fillRect(0, 0, 460, 300);
    b.strokeStyle = 'rgba(230,240,230,0.14)'; b.lineWidth = 0.5;
    for (let x = 10; x < 460; x += 10) { b.beginPath(); b.moveTo(x, 0); b.lineTo(x, 300); b.stroke(); }
    for (let y = 10; y < 300; y += 10) { b.beginPath(); b.moveTo(0, y); b.lineTo(460, y); b.stroke(); }
    b.strokeStyle = 'rgba(230,240,230,0.3)'; b.lineWidth = 0.8;
    for (let x = 50; x < 460; x += 50) { b.beginPath(); b.moveTo(x, 0); b.lineTo(x, 300); b.stroke(); }
    for (let y = 50; y < 300; y += 50) { b.beginPath(); b.moveTo(0, y); b.lineTo(460, y); b.stroke(); }
    // label cards under the dishes are drawn live (they change with the settings)
    this._bk = key; this._bc = c;
    return c;
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    st.d.forEach((d, i) => this._dish(x, i, d));
    this._calendar(x);
  },
  _dish(x, i, d) {
    const st = this.st, cx = this.DX[i], cy = this.DY, R = this.R, day = st.day, wetK = d.water === 'dry' ? 0 : Math.min(1, day * 1.5);
    x.fillStyle = 'rgba(0,0,0,0.3)'; x.beginPath(); x.ellipse(cx + 4, cy + 5, R + 3, R + 2, 0, 0, TAU); x.fill();
    // blotting paper: pale when dry, darker when soaked; under water a layer of water over it
    x.fillStyle = d.water === 'dry' ? '#EFE9DA' : '#DCD3BE'; x.beginPath(); x.arc(cx, cy, R - 3, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(150,140,120,0.25)'; x.lineWidth = 0.4; for (let k = 0; k < 6; k++) { x.beginPath(); x.arc(cx, cy, R - 6 - k * 6, 0, TAU); x.stroke(); }
    // the seeds
    for (const s of st.seeds[i]) {
      const sx = cx + s.x, sy = cy + s.y, sw = d.water === 'dry' ? 1 : 1 + 0.26 * wetK, r = 4.6 * sw, g = day - s.tg;
      if (g > 0) {
        // the young root (radicle) pushes out and curls; root hairs appear near its tip; later a green shoot
        const len = Math.min(26, g * (d.temp === 22 ? 7.5 : 3)), a = s.a, c = s.curl;
        const pts = [];
        for (let t = 0; t <= 1.0001; t += 0.2) { const aa = a + c * t * t; pts.push([sx + Math.cos(a) * r * 0.8 + Math.cos(aa) * len * t, sy + Math.sin(a) * r * 0.8 + Math.sin(aa) * len * t]); }
        if (len > 13) { x.strokeStyle = 'rgba(250,250,244,0.6)'; x.lineWidth = 0.3; const [hx, hy, ha] = MX.along(pts, 0.7); for (let k = -4; k <= 4; k++) { const [px, py] = MX.along(pts, 0.55 + k * 0.03); x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(ha + Math.PI / 2) * 2.2, py + Math.sin(ha + Math.PI / 2) * 2.2); x.moveTo(px, py); x.lineTo(px - Math.cos(ha + Math.PI / 2) * 2.2, py - Math.sin(ha + Math.PI / 2) * 2.2); x.stroke(); } }
        MX.taper(x, pts, 2.6, 1, '#FAF6E6', 'rgba(150,140,100,0.6)');
        if (g > 3.2 && d.temp === 22) { const b = a + Math.PI + 0.5, l2 = Math.min(9, (g - 3.2) * 4); x.strokeStyle = d.light ? '#6E9A3A' : '#D8D6A0'; x.lineWidth = 1.6; x.lineCap = 'round'; x.beginPath(); x.moveTo(sx + Math.cos(b) * r * 0.7, sy + Math.sin(b) * r * 0.7); x.quadraticCurveTo(sx + Math.cos(b) * (r + l2), sy + Math.sin(b) * (r + l2), sx + Math.cos(b + 0.6) * (r + l2 * 0.8), sy + Math.sin(b + 0.6) * (r + l2 * 0.8)); x.stroke(); }
      }
      const col = d.lot === '1998' ? '#A89A5E' : d.lot === '2011' ? '#B8B266' : '#C4C46E';
      x.fillStyle = MX.lit(x, sx, sy, r, g > 0 ? U.shade(col, 0.08) : col, 0.4, 0.4); x.beginPath(); x.arc(sx, sy, r, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(80,70,30,0.5)'; x.lineWidth = 0.4; x.stroke();
      if (sw > 1.1 && g > 0) { x.strokeStyle = 'rgba(90,80,40,0.5)'; x.lineWidth = 0.5; x.beginPath(); x.arc(sx, sy, r * 0.8, s.a - 0.6, s.a + 0.6); x.stroke(); }
      x.fillStyle = '#5A4A2A'; x.beginPath(); x.ellipse(sx + Math.cos(s.a) * r * 0.75, sy + Math.sin(s.a) * r * 0.75, 0.8, 1.6, s.a, 0, TAU); x.fill();
      // dead seeds on wet paper go mouldy after a few days
      if (s.mould && day > 3.5) { const m = Math.min(1, (day - 3.5) / 3); x.strokeStyle = `rgba(250,250,250,${(0.75 * m).toFixed(2)})`; x.lineWidth = 0.35; for (let k = 0; k < 14; k++) { const aa = k / 14 * TAU; x.beginPath(); x.moveTo(sx + Math.cos(aa) * r * 0.6, sy + Math.sin(aa) * r * 0.6); x.lineTo(sx + Math.cos(aa) * (r + 2.5 * m), sy + Math.sin(aa) * (r + 2.5 * m)); x.stroke(); } }
    }
    if (d.water === 'wet') { x.fillStyle = `rgba(120,170,200,${(0.25 * Math.max(0.4, wetK)).toFixed(2)})`; x.beginPath(); x.arc(cx, cy, R - 3, 0, TAU); x.fill(); x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 0.6; for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(cx - 10 + k * 9, cy - 16 + k * 12, 8, 3.6, 4.6); x.stroke(); } }
    // glass: the dish wall and a lid
    x.strokeStyle = 'rgba(236,246,250,0.9)'; x.lineWidth = 2.2; x.beginPath(); x.arc(cx, cy, R - 1.5, 0, TAU); x.stroke();
    x.strokeStyle = 'rgba(200,220,228,0.6)'; x.lineWidth = 1; x.beginPath(); x.arc(cx, cy, R + 1.2, 0, TAU); x.stroke();
    x.fillStyle = 'rgba(255,255,255,0.22)'; x.beginPath(); x.ellipse(cx - R * 0.45, cy - R * 0.45, R * 0.3, R * 0.12, -0.8, 0, TAU); x.fill();
    // in the dark: kitchen foil folded back over half of the lid
    if (!d.light) {
      x.save(); x.beginPath(); x.arc(cx, cy, R + 2, Math.PI * 0.5, Math.PI * 1.5); x.closePath(); x.clip();
      x.fillStyle = MX.lin(x, cx - R, cy - R, cx, cy + R, [[0, '#B8BCC0'], [0.3, '#E8ECEE'], [0.55, '#9EA2A6'], [0.8, '#D8DCDE'], [1, '#A8ACB0']]); x.fillRect(cx - R - 3, cy - R - 3, R + 3, 2 * R + 6);
      x.strokeStyle = 'rgba(80,84,88,0.35)'; x.lineWidth = 0.5; for (let k = 0; k < 7; k++) { x.beginPath(); x.moveTo(cx - R + k * 7, cy - R); x.lineTo(cx - R + 4 + k * 6, cy + R); x.stroke(); }
      x.restore();
      x.fillStyle = '#F4EEDD'; x.font = '700 9px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText('☾', cx - R * 0.5, cy + 3);
    }
    if (d.temp === 4) { x.strokeStyle = 'rgba(210,236,250,0.9)'; x.lineWidth = 1.6; x.setLineDash([2, 3]); x.beginPath(); x.arc(cx, cy, R + 4, 0, TAU); x.stroke(); x.setLineDash([]); x.fillStyle = '#DDF0FA'; x.font = '700 11px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText('❄', cx + R * 0.72, cy - R * 0.72); }
    // label card and the count
    const n = this.count(i), done = !st.running && st.day >= 7;
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(cx - 46, 200, 96, 44);
    x.fillStyle = '#F4EEDD'; x.fillRect(cx - 48, 198, 96, 44); x.strokeStyle = '#2A2620'; x.lineWidth = 0.7; x.strokeRect(cx - 48, 198, 96, 44);
    x.fillStyle = '#1B1A17'; x.textAlign = 'left'; x.font = '700 9px "Courier Prime", monospace'; x.fillText('ABCD'[i] + '  ' + d.lot, cx - 42, 210);
    x.font = '600 7px "Atkinson Hyperlegible Next", sans-serif';
    x.fillText(L(this.WATER[d.water]) + ' · ' + d.temp + ' °C', cx - 42, 221);
    x.fillText(L(d.light ? tr('ışıkta', 'in light') : tr('karanlıkta', 'in the dark')), cx - 42, 231);
    x.fillStyle = done ? '#2F6A3A' : '#6A6458'; x.font = '700 12px "Courier Prime", monospace'; x.textAlign = 'right'; x.fillText(n + '/10', cx + 44, 238);
  },
  _calendar(x) {
    const st = this.st, d = Math.floor(st.day + 1e-6);
    x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(16, 16, 68, 52);
    x.fillStyle = '#F4EEDD'; x.fillRect(12, 12, 68, 52); x.fillStyle = '#A0322A'; x.fillRect(12, 12, 68, 14);
    x.fillStyle = '#F4EEDD'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(L(tr('GÜN', 'DAY')), 46, 22);
    x.fillStyle = '#1B1A17'; x.font = '700 24px "Courier Prime", monospace'; x.fillText(String(d), 46, 54);
    x.strokeStyle = '#2A2620'; x.lineWidth = 0.8; x.strokeRect(12, 12, 68, 52);
    x.fillStyle = 'rgba(244,238,221,0.8)'; for (let k = 0; k < 7; k++) { x.beginPath(); x.arc(96 + k * 9, 38, 3, 0, TAU); x.fill(); }
    x.fillStyle = '#6E9A4A'; for (let k = 0; k < Math.min(7, d); k++) { x.beginPath(); x.arc(96 + k * 9, 38, 3, 0, TAU); x.fill(); }
  },
};
