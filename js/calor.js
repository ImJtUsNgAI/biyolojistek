'use strict';
// Food calorimeter by the school: a 0.2 g piece of food burns on a needle under a tin can of water, sheltered from
// the wind by a tin screen. The water's rise in temperature gives the energy per gram. Every burn counts: the
// point of the bench is comparing the foods, not steering a flame.
const CALOR = {
  CANX: 150, CANY: 84, NY: 132, WATER: 50,
  FOODS: {
    walnut: { name: tr('Ceviz', 'Walnut'), kj: 27, burn: 7, col: '#C89A5A' },
    leblebi: { name: tr('Leblebi', 'Leblebi'), kj: 15.5, burn: 5, col: '#E2B85A' },
    lokum: { name: tr('Lokum', 'Lokum'), kj: 16, burn: 4.6, col: '#E8A0B0' },
    bread: { name: tr('Ekmek', 'Bread'), kj: 11, burn: 4.2, col: '#EAD6A8' },
    apricot: { name: tr('Kuru kayısı', 'Dried apricot'), kj: 10, burn: 4, col: '#E07A2A' },
  },
  ORDER: ['walnut', 'leblebi', 'lokum', 'bread', 'apricot'],
  EFF: 0.45,

  open() {
    const S = G.S;
    const run = S.calor || (S.calor = { seed: 1 + Math.floor(Math.random() * 1e5), runs: {} });
    this.st = { run, t: 0, sel: this.ORDER.find(f => !(run.runs[f] && run.runs[f].valid)) || 'walnut', burn: null, x: this.CANX, move: 0, drag: false, auto: false };
    const body = h('div', 'kit rig ferm calor');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Yiyecek', 'Food'))}</label>
        <div class="cl-food">${this.ORDER.map(f => `<button data-f="${f}">${U.esc(L(this.FOODS[f].name))}</button>`).join('')}</div>
        <button class="cl-go">${L(tr('Yak', 'Light it'))} 🔥</button>
        <p class="fm-const">${L(tr('Her seferinde aynı: 0,2 g örnek, kutuda 50 mL su, aynı yükseklik. Teneke siper rüzgârı keser.', 'The same every time: a 0.2 g sample, 50 mL of water in the can, the same height. A tin screen keeps the wind off.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('Bir yiyecek seç ve “Yak”a bas. Suyun ne kadar ısındığını izle.', 'Pick a food and press “Light it”. Watch how much the water warms up.'))}</p>`;
    body.querySelectorAll('.cl-food button').forEach(b => b.onclick = () => this.pick(b.dataset.f));
    body.querySelector('.cl-go').onclick = () => this.light();
    this.body = body; this.cv = body.querySelector('canvas');
    // tapping the stand lights the food too: one big target on a smart board
    this.cv.addEventListener('pointerdown', e => { const r = this.cv.getBoundingClientRect(); if ((e.clientY - r.top) / r.height * 300 < 172) this.light(); });
    this.pn = UI.panel({ title: tr('Kalorimetre · Hangi yiyecek daha çok enerji verir?', 'Calorimeter · Which food gives more energy?'), code: 'BİY.10.1.10', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.table(); this.loop();
  },
  mass(f) { const R = MX.rng(this.st.run.seed * 13 + this.ORDER.indexOf(f) * 7 + 1); return Math.round((0.2 + (R() - 0.5) * 0.02) * 1000) / 1000; },
  // the screen keeps the flame straight up under the can; it only flickers
  flameX() { return this.CANX + Math.sin(this.st.t * 9) * 1.2; },
  pick(f) { if (this.st.burn || !this.FOODS[f]) return; this.st.sel = f; AU.sfx('click'); this._sync(); },
  light() {
    const st = this.st;
    if (st.burn) return false;
    const f = st.sel, food = this.FOODS[f], m = this.mass(f);
    st.burn = { f, m, E: m * food.kj * 1000, D: food.burn, k: 0, q: 0, cen: 0, T: [] };
    AU.sfx('whoosh');
    this._msg(tr(`${L(food.name)} yanıyor. Termometreyi izle.`, `The ${L(food.name).toLowerCase()} is burning. Watch the thermometer.`));
    this._sync();
    return true;
  },
  step(dt) {
    const st = this.st;
    st.t += dt;
    st.x = this.CANX;
    const b = st.burn;
    if (!b) return;
    const t0 = b.k * b.D;
    b.k = Math.min(1, b.k + dt / b.D);
    const p = b.E * Math.PI / (2 * b.D) * Math.sin(Math.PI * (t0 + dt / 2) / b.D);
    b.q += p * dt * this.EFF;
    b.cen += p * dt / b.E;
    b.T.push(this.temp(b.q));
    if (b.k >= 1) this.finish();
  },
  temp(q) { return 20 + q / (this.WATER * 4.186); },
  finish() {
    const st = this.st, b = st.burn, run = st.run;
    st.burn = null;
    const dT = Math.round((this.temp(b.q) - 20) * 10) / 10, kjg = Math.round(this.WATER * 4.186 * dT / b.m / 100) / 10, cen = 1, valid = true;
    const prev = run.runs[b.f];
    if (valid || !prev || !prev.valid) run.runs[b.f] = { m: b.m, dT, kjg, cen, valid, T: b.T.filter((_, i) => i % 4 === 0) };
    const name = L(this.FOODS[b.f].name);
    AU.sfx('pen'); this._msg(tr(`${name}: su ${dT.toFixed(1).replace('.', ',')} °C ısındı → ${kjg.toFixed(1).replace('.', ',')} kJ/g.`, `${name}: the water warmed by ${dT.toFixed(1)} °C → ${kjg.toFixed(1)} kJ/g.`));
    const next = this.ORDER.find(f => !(run.runs[f] && run.runs[f].valid));
    if (valid && next) st.sel = next;
    this._sync(); this.table(); G.save();
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
  _msg(t) { if (this.body) this.body.querySelector('.kit-msg').textContent = L(t); },
  _sync() {
    const b = this.body, st = this.st, run = st.run;
    b.querySelectorAll('.cl-food button').forEach(el => { const f = el.dataset.f, r = run.runs[f]; el.classList.toggle('on', st.sel === f); el.classList.toggle('done', !!(r && r.valid)); el.disabled = !!st.burn; });
    b.querySelector('.cl-go').disabled = !!st.burn;
  },
  analyse() {
    const run = this.st.run, v = this.ORDER.filter(f => run.runs[f] && run.runs[f].valid);
    const best = v.slice().sort((a, b) => run.runs[b].kjg - run.runs[a].kjg)[0];
    return { valid: v, n: v.length, best, done: v.length === this.ORDER.length, walnutBeatsLokum: !!(run.runs.walnut && run.runs.lokum && run.runs.walnut.valid && run.runs.lokum.valid && run.runs.walnut.kjg > run.runs.lokum.kjg) };
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, run = this.st.run, f1 = v => v.toFixed(1).replace('.', I18N.lang === 'tr' ? ',' : '.');
    const rows = this.ORDER.filter(f => run.runs[f]).map(f => { const r = run.runs[f]; return `<tr${r.valid ? '' : ' class="cl-bad"'}><td><b>${U.esc(L(this.FOODS[f].name))}</b></td><td>${r.m.toFixed(2).replace('.', I18N.lang === 'tr' ? ',' : '.')} g</td><td>${f1(r.dT)} °C</td><td><b>${f1(r.kjg)}</b></td><td>${a.done ? f1(this.FOODS[f].kj) : '?'}</td></tr>`; }).join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Yiyecek', 'Food'))}</th><th>${L(tr('Kütle', 'Mass'))}</th><th>ΔT</th><th>kJ/g</th><th>${L(tr('Etiket', 'Label'))}</th></tr>${rows || `<tr><td colspan="5">${L(tr('Henüz yakılan yok.', 'Nothing burnt yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.n === 5, tr(`Beş yiyecek (${a.n}/5)`, `Five foods (${a.n}/5)`)], [a.walnutBeatsLokum, tr('Ceviz mi, lokum mu?', 'Walnut or lokum?')], [a.done, tr('Etiketle karşılaştır', 'Compare with the label')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.n) UI._chart(body.querySelector('.rig-chart'), { values: a.valid.map(f => run.runs[f].kjg), labels: a.valid.map(f => this.FOODS[f].name), colors: a.valid.map(f => this.FOODS[f].col), unit: tr('kJ/g (ölçülen)', 'kJ/g (measured)') });
    if (a.done && !S.flags.calorDone) {
      S.flags.calorDone = true;
      S.journal.exps.push({ title: tr('Yiyeceklerin enerjisi', 'Energy in food'), code: 'BİY.10.1.10', t: Date.now(),
        head: [tr('Yiyecek', 'Food'), tr('Kütle', 'Mass'), 'ΔT', tr('Ölçülen', 'Measured'), tr('Etiket', 'Label')],
        rows: this.ORDER.map(f => { const r = run.runs[f]; return [this.FOODS[f].name, r.m.toFixed(2) + ' g', r.dT.toFixed(1) + ' °C', r.kjg.toFixed(1) + ' kJ/g', this.FOODS[f].kj + ' kJ/g']; }),
        chart: { values: this.ORDER.map(f => run.runs[f].kjg), labels: this.ORDER.map(f => this.FOODS[f].name), colors: this.ORDER.map(f => this.FOODS[f].col), unit: tr('kJ/g (ölçülen)', 'kJ/g (measured)') },
        note: tr('Gram başına en çok enerjiyi yağlı ceviz verdi; lokum ve leblebi ortada, suyu çok olan ekmek ve kayısı en az. Ölçülen değerler etiketin yarısından azdı: ısının çoğu kutuya değil havaya gitti. Hepsi aynı düzenekte ölçüldüğü için sıralama yine de güvenilir.', 'Fatty walnut gave the most energy per gram; lokum and leblebi came in the middle, and watery bread and apricot the least. The measured values were less than half the label’s: most of the heat went into the air rather than the can. Since all were measured on the same set-up, the ranking can still be trusted.') });
      this._msg(tr('Beşi de ölçüldü! Etiket değerleri tabloya geldi: ölçtüklerin neden daha az? Sonuçlar defterinde.', 'All five measured! The label values are in the table: why are yours lower? The results are in your journal.'));
      if (Q.at('azik', 'burn')) { UI.stamp(L(tr('KALORİMETRE', 'CALORIMETER'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  async close() {
    this.pn = null;
    if (this.st) { this.st.burn = null; this.st.move = 0; }
    if (Q.at('azik', 'burn') && G.S.flags.calorDone) {
      await ask('azik_loss');
      await UI.say('player', tr('Ceviz gram başına lokumun neredeyse iki katı enerji veriyor. Peki bu enerji nerede saklı, vücutta nerede açığa çıkıyor? Azığa merceğimle bakayım.', 'Gram for gram, walnut gives nearly twice the energy of lokum. But where is that energy stored, and where is it released in the body? Let me look at the snacks with my lens.'));
      Q.adv('azik');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc && this._bcLang === I18N.lang) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(66);
    // an outdoor table under the walnut tree, dappled shade
    b.fillStyle = '#B08A5E'; b.fillRect(0, 0, 460, 172);
    for (let y = 0; y < 172; y += 24) { b.fillStyle = y % 48 ? '#A8845A' : '#B8946A'; b.fillRect(0, y, 460, 23); b.fillStyle = 'rgba(60,40,20,0.35)'; b.fillRect(0, y + 23, 460, 1); }
    for (let k = 0; k < 12; k++) { b.fillStyle = `rgba(30,50,20,${(0.07 + R() * 0.08).toFixed(2)})`; b.beginPath(); b.ellipse(R() * 460, R() * 172, 26 + R() * 40, 14 + R() * 20, R() * 3, 0, TAU); b.fill(); }
    // retort stand: base, rod and the clamp holding the can
    b.fillStyle = '#3A3A3E'; b.fillRect(52, 150, 70, 8); b.fillRect(80, 10, 5, 142);
    b.fillRect(82, 50, this.CANX - 82 - 22, 4);
    // the lower page: the result bars and a sketch of the idea
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5; for (let y = 186; y < 300; y += 12) { b.beginPath(); b.moveTo(8, y); b.lineTo(452, y); b.stroke(); }
    b.fillStyle = '#1B1A17'; b.font = '700 8px "Courier Prime", monospace'; b.textAlign = 'left';
    b.fillText(L(tr('ENERJİ = 50 g su × 4,2 J/g°C × ΔT', 'ENERGY = 50 g water × 4.2 J/g°C × ΔT')), 12, 186);
    this._bc = c; this._bcLang = I18N.lang;
    return c;
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, b = st.burn, run = st.run, t = st.t;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    const T = b ? this.temp(b.q) : 20, cx = this.CANX, cy = this.CANY;
    // the tin can: water inside, a thermometer standing in it
    x.fillStyle = 'rgba(0,0,0,0.2)'; x.beginPath(); x.ellipse(cx + 3, cy + 2, 24, 4, 0, 0, TAU); x.fill();
    x.fillStyle = MX.lin(x, cx - 22, 0, cx + 22, 0, [[0, '#8A9098'], [0.4, '#D8DCE0'], [1, '#6E747C']]); x.fillRect(cx - 22, cy - 50, 44, 50);
    for (let k = 1; k < 6; k++) { x.strokeStyle = 'rgba(40,44,50,0.35)'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(cx - 22, cy - k * 8.5); x.lineTo(cx + 22, cy - k * 8.5); x.stroke(); }
    x.fillStyle = '#6E747C'; x.beginPath(); x.ellipse(cx, cy - 50, 22, 4, 0, 0, TAU); x.fill(); x.fillStyle = 'rgba(120,170,210,0.8)'; x.beginPath(); x.ellipse(cx, cy - 48, 19, 3, 0, 0, TAU); x.fill();
    x.fillStyle = `rgba(40,30,20,${Math.min(0.6, (T - 20) * 0.03).toFixed(2)})`; x.fillRect(cx - 22, cy - 6, 44, 6);
    // thermometer: its red column climbs with the water
    const th = cx + 8;
    x.fillStyle = '#F4F4F0'; x.fillRect(th - 3, cy - 88, 6, 50); x.strokeStyle = '#2A2620'; x.lineWidth = 0.7; x.strokeRect(th - 3, cy - 88, 6, 50);
    const lvl = U.clamp((T - 15) / 30, 0, 1); x.fillStyle = '#C8302A'; x.fillRect(th - 1.2, cy - 40 - lvl * 44, 2.4, lvl * 44 + 4);
    x.beginPath(); x.arc(th, cy - 38, 3.4, 0, TAU); x.fill();
    // the needle in its cork, the food on it, and the flame the wind pushes about
    const nx = st.x, f = b ? b.f : st.sel, food = this.FOODS[f];
    x.fillStyle = '#B08050'; x.fillRect(nx - 9, 144, 18, 10); x.strokeStyle = '#6A4A2A'; x.lineWidth = 0.8; x.strokeRect(nx - 9, 144, 18, 10);
    x.strokeStyle = '#A8ACB0'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(nx, 144); x.lineTo(nx, this.NY + 4); x.stroke();
    const left = b ? 1 - b.k * 0.7 : 1;
    x.fillStyle = b ? U.shade(food.col, -0.5 * b.k) : food.col; x.beginPath(); x.ellipse(nx, this.NY, 7 * left + 2, 5 * left + 1.5, 0, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(60,40,20,0.7)'; x.lineWidth = 0.6; x.stroke();
    if (b) {
      const fx = this.flameX(), p = Math.sin(Math.PI * b.k), top = cy + 2, h = (this.NY - top) * (0.5 + 0.5 * p);
      for (let k = 0; k < 3; k++) {
        const w = (9 - k * 2.6) * (0.6 + 0.5 * p), fl = Math.sin(t * 20 + k) * 1.5;
        x.fillStyle = ['rgba(240,120,30,0.75)', 'rgba(250,190,60,0.85)', 'rgba(255,250,210,0.95)'][k];
        x.beginPath(); x.moveTo(nx - w, this.NY - 2); x.quadraticCurveTo(nx - w * 0.8 + (fx - nx) * 0.3, this.NY - h * 0.5, fx + fl, this.NY - h * (1 - k * 0.18)); x.quadraticCurveTo(nx + w * 0.8 + (fx - nx) * 0.3, this.NY - h * 0.5, nx + w, this.NY - 2); x.closePath(); x.fill();
      }
      // smoke curling off to one side
      for (let k = 0; k < 5; k++) { const q = (t * 0.8 + k / 5) % 1; x.fillStyle = `rgba(90,90,90,${(0.3 * (1 - q)).toFixed(2)})`; x.beginPath(); x.arc(fx + q * 40 + Math.sin(q * 6 + k) * 6, this.NY - h - q * 50, 4 + q * 10, 0, TAU); x.fill(); }
    }
    // the tin wind screen round the needle
    x.fillStyle = 'rgba(150,156,164,0.55)'; x.fillRect(cx - 40, 96, 6, 58); x.fillRect(cx + 34, 96, 6, 58);
    x.strokeStyle = 'rgba(60,64,70,0.6)'; x.lineWidth = 0.6; x.strokeRect(cx - 40, 96, 6, 58); x.strokeRect(cx + 34, 96, 6, 58);
    // the reading, big, on the right
    x.fillStyle = '#20302A'; U.rr(x, 290, 16, 156, 58, 6); x.fill();
    x.fillStyle = '#7CF0B0'; x.font = '700 30px "Courier Prime", monospace'; x.textAlign = 'right'; x.fillText(T.toFixed(1) + ' °C', 438, 52);
    x.font = '700 10px "Courier Prime", monospace'; x.fillText('ΔT ' + (T - 20).toFixed(1) + ' °C', 438, 67);
    x.fillStyle = '#1B1A17'; x.font = '700 10px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left';
    x.fillText(L(food.name) + ' · ' + this.mass(f).toFixed(2) + ' g', 292, 92);
    // the temperature curve of this burn (or the last one)
    const curve = b ? b.T : run.runs[st.sel] && run.runs[st.sel].T;
    x.strokeStyle = 'rgba(30,30,30,0.35)'; x.lineWidth = 0.6; x.strokeRect(292, 100, 152, 60);
    if (curve && curve.length > 1) { x.strokeStyle = '#C8302A'; x.lineWidth = 1.4; x.beginPath(); const n = b ? Math.max(curve.length, b.D / 0.05) : curve.length; curve.forEach((v, i) => { const px = 292 + i / (n - 1) * 152, py = 160 - U.clamp((v - 20) / 16, 0, 1) * 58; i ? x.lineTo(px, py) : x.moveTo(px, py); }); x.stroke(); }
    // lower page: measured bars, with the label value as a ghost bar once all five are in
    const a = this.analyse();
    this.ORDER.forEach((k, i) => {
      const y = 202 + i * 19, r = run.runs[k];
      x.fillStyle = '#1B1A17'; x.font = '600 10px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left'; x.fillText(L(this.FOODS[k].name), 12, y + 9);
      if (a.done) { x.strokeStyle = 'rgba(40,40,40,0.5)'; x.setLineDash([3, 2]); x.strokeRect(100, y, this.FOODS[k].kj * 12, 12); x.setLineDash([]); }
      if (r) { x.fillStyle = r.valid ? this.FOODS[k].col : 'rgba(160,160,160,0.5)'; x.fillRect(100, y, r.kjg * 12, 12); x.strokeStyle = '#1B1A17'; x.lineWidth = 0.7; x.strokeRect(100, y, r.kjg * 12, 12); x.fillStyle = '#1B1A17'; x.font = '700 9px "Courier Prime", monospace'; x.fillText(r.kjg.toFixed(1) + (r.valid ? '' : ' ✗'), 104 + r.kjg * 12, y + 9); }
    });
    if (a.done) { x.fillStyle = '#4A4A4A'; x.font = '400 8px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'right'; x.fillText(L(tr('kesikli: paketteki değer', 'dashed: value on the packet')), 452, 296); }
  },
};
