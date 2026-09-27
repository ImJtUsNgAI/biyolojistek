'use strict';
// Photosynthesis bench: an Elodea sprig under a lamp. Change one variable, count bubbles, repeat.
const RIG = {
  COLORS: {
    white: { name: tr('Beyaz', 'White'), c: '#FFF6DC', eff: 1.0 },
    red: { name: tr('Kırmızı', 'Red'), c: '#E2553F', eff: 0.95 },
    blue: { name: tr('Mavi', 'Blue'), c: '#4A78D8', eff: 0.8 },
    green: { name: tr('Yeşil', 'Green'), c: '#55B45A', eff: 0.45 },
  },
  rate(o) {
    const I = Math.pow(10 / o.d, 2), light = I / (I + 0.35) * 1.35;
    const temp = { 15: 0.6, 25: 1, 35: 0.85 }[o.temp];
    return 40 * light * this.COLORS[o.color].eff * temp * (o.co2 ? 1 : 0.55);
  },
  open() {
    const S = G.S;
    const st = this.st = { color: 'white', d: 20, temp: 25, co2: true, trials: S.rigTrials || (S.rigTrials = []), running: false, bubbles: [], count: 0, t: 0 };
    const body = h('div', 'kit rig');
    const C = this.COLORS;
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Işık rengi', 'Light colour'))}</label><div class="seg colors">${Object.keys(C).map(k => `<button data-c="${k}" style="--sw:${C[k].c}">${L(C[k].name)}</button>`).join('')}</div>
        <label>${L(tr('Lamba uzaklığı', 'Lamp distance'))} <b class="dv">20 cm</b></label><input type="range" min="10" max="50" step="5" value="20" class="dist">
        <label>${L(tr('Su sıcaklığı', 'Water temperature'))}</label><div class="seg temps">${[15, 25, 35].map(v => `<button data-t="${v}">${v} °C</button>`).join('')}</div>
        <label>${L(tr('Suya karbonat (CO₂ kaynağı)', 'Bicarbonate in the water (CO₂ source)'))}</label><div class="seg co2"><button data-k="1">${L(tr('Var', 'Yes'))}</button><button data-k="0">${L(tr('Yok', 'No'))}</button></div>
        <button class="big run">${L(tr('1 dakika say ▶', 'Count for 1 minute ▶'))}</button>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('İpucu: adil bir deneyde yalnızca bir şeyi değiştirirsin. Diğer her şey aynı kalmalı.', 'Tip: in a fair test you change only one thing. Everything else stays the same.'))}</p>`;
    const sync = () => {
      body.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === st.color));
      body.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', +b.dataset.t === st.temp));
      body.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('on', (b.dataset.k === '1') === st.co2));
      body.querySelector('.dv').textContent = st.d + ' cm';
    };
    body.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { if (st.running) return; st.color = b.dataset.c; AU.sfx('click'); sync(); });
    body.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { if (st.running) return; st.temp = +b.dataset.t; AU.sfx('click'); sync(); });
    body.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { if (st.running) return; st.co2 = b.dataset.k === '1'; AU.sfx('click'); sync(); });
    const dist = body.querySelector('.dist'); dist.oninput = () => { if (st.running) { dist.value = st.d; return; } st.d = +dist.value; sync(); };
    body.querySelector('.run').onclick = () => this.run(body);
    sync();
    this.body = body;
    this.cv = body.querySelector('canvas');
    this.pn = UI.panel({ title: tr('Deney masası · Su vebası (Elodea)', 'Experiment bench · Waterweed (Elodea)'), code: 'BİY.10.1.3', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this.table(); this.loop();
  },
  run(body) {
    const st = this.st;
    if (st.running) return;
    const mean = this.rate(st), noisy = Math.max(0, Math.round(mean * (1 + (Math.random() + Math.random() + Math.random() - 1.5) * 0.12)));
    st.running = true; st.t = 0; st.count = 0; st.goal = noisy; st.emitted = 0;
    st.times = Array.from({ length: noisy }, () => Math.random() * 5.6).sort((a, b) => a - b);
    body.querySelector('.run').disabled = true;
    AU.sfx('click');
  },
  loop() {
    let last = performance.now();
    const step = now => {
      if (!this.pn || this.pn.closed) return;
      const dt = U.clamp((now - last) / 1000, 0, 0.05) * UI.benchPace(this.cv); last = now;
      const st = this.st;
      if (st.running) {
        st.t += dt;
        while (st.emitted < st.times.length && st.times[st.emitted] <= st.t) { st.bubbles.push({ x: 0, y: 0, r: 2 + Math.random() * 1.8, vy: 0, life: 0 }); st.emitted++; }
        if (st.t >= 6) this.finish();
      }
      for (const b of st.bubbles) { b.vy = Math.min(90, b.vy + dt * 160); b.y -= b.vy * dt; b.x += Math.sin(b.life * 8) * 0.3; b.life += dt; if (b.y < -128 && !b.counted) { b.counted = true; st.count++; if (st.count % 2 === 0) AU.sfx('bubble'); } }
      st.bubbles = st.bubbles.filter(b => b.y > -150);
      this.draw();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  finish() {
    const st = this.st;
    st.running = false;
    st.count = st.goal;
    st.trials.push({ color: st.color, d: st.d, temp: st.temp, co2: st.co2, n: st.goal });
    this.body.querySelector('.run').disabled = false;
    AU.sfx('pen');
    this.table();
    G.save();
  },
  // best comparable group: same distance/temp/CO₂, colours varied
  analyse() {
    const groups = {};
    for (const t of this.st.trials) { const k = t.d + '|' + t.temp + '|' + t.co2; (groups[k] = groups[k] || {})[t.color] = (groups[k][t.color] || []).concat(t.n); }
    let best = null, score = -1;
    for (const k in groups) {
      const g = groups[k], cols = Object.keys(g), full = cols.filter(c => g[c].length >= 3).length;
      const sc = full * 10 + cols.length;
      if (sc > score) { score = sc; best = { key: k, g, cols, full }; }
    }
    return best;
  },
  table() {
    const st = this.st, body = this.body, a = this.analyse();
    const rows = st.trials.slice(-8).reverse().map((t, i) => `<tr${i === 0 ? ` data-new="${st.trials.length}"` : ''}><td><i class="dot" style="background:${this.COLORS[t.color].c}"></i>${L(this.COLORS[t.color].name)}</td><td>${t.d} cm</td><td>${t.temp} °C</td><td>${t.co2 ? '✓' : '—'}</td><td><b>${t.n}</b></td></tr>`).join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Renk', 'Colour'))}</th><th>${L(tr('Uzaklık', 'Distance'))}</th><th>°C</th><th>CO₂</th><th>${L(tr('Kabarcık/dk', 'Bubbles/min'))}</th></tr>${rows || `<tr><td colspan="5">${L(tr('Henüz ölçüm yok.', 'No measurements yet.'))}</td></tr>`}</table>`;
    const s1 = a && a.cols.length >= 2, s2 = a && a.cols.length >= 3, s3 = a && a.full >= 3;
    body.querySelector('.stamps').innerHTML = [
      [s1, tr('Tek değişken', 'One variable')], [s2, tr('En az 3 renk', '3+ colours')], [s3, tr('Her biri 3 tekrar', '3 repeats each')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a) {
      const cols = a.cols.filter(c => a.g[c].length);
      UI._chart(body.querySelector('.rig-chart'), { values: cols.map(c => a.g[c].reduce((x, y) => x + y, 0) / a.g[c].length), labels: cols.map(c => this.COLORS[c].name), colors: cols.map(c => this.COLORS[c].c), unit: tr('ort. kabarcık/dk', 'avg bubbles/min') });
    }
    if (s3 && !G.S.flags.rigDone) {
      G.S.flags.rigDone = true;
      this.st.done = true;
      this.record(a);
      if (Q.at('light', 'exp')) {
        this.body.querySelector('.kit-msg').textContent = L(tr('Adil bir deney! Sonuçlar defterine yazıldı.', 'A fair test! Your results are in the journal.'));
        UI.stamp(L(tr('ADİL DENEY', 'FAIR TEST')));
        setTimeout(() => this.pn && this.pn.close(), 1800);
      }
    }
  },
  record(a) {
    const S = G.S, cols = a.cols.filter(c => a.g[c].length), [d, temp, co2] = a.key.split('|');
    S.journal.exps.push({ title: tr('Işık rengi ve fotosentez', 'Light colour and photosynthesis'), code: 'BİY.10.1.3', t: Date.now(),
      head: [tr('Renk', 'Colour'), tr('Ölçümler', 'Readings'), tr('Ortalama', 'Average')],
      rows: cols.map(c => [this.COLORS[c].name, a.g[c].join(' · '), U.num(a.g[c].reduce((x, y) => x + y, 0) / a.g[c].length, 1)]),
      chart: { values: cols.map(c => a.g[c].reduce((x, y) => x + y, 0) / a.g[c].length), labels: cols.map(c => this.COLORS[c].name), colors: cols.map(c => this.COLORS[c].c), unit: tr('ort. kabarcık/dk', 'avg bubbles/min') },
      stamps: [{ t: tr('Tek değişken', 'One variable'), ok: true }, { t: tr('3+ koşul', '3+ conditions'), ok: true }, { t: tr('3 tekrar', '3 repeats'), ok: true }],
      note: tr(`Sabit tutulanlar: ${d} cm, ${temp} °C, karbonat ${co2 === 'true' ? 'var' : 'yok'}.`, `Kept the same: ${d} cm, ${temp} °C, bicarbonate ${co2 === 'true' ? 'yes' : 'no'}.`) });
    G.save();
  },
  async close() {
    const done = G.S.flags.rigDone;
    this.pn = null;
    if (done && Q.at('light', 'exp')) {
      await ask('light');
      await UI.say('player', tr('Demek sorun lambalarda. Seradaki tepsilere dönüp lambaları ayarlayayım.', "So the lamps are the problem. Let me go back to the trays and change them."));
      Q.adv('light');
    }
  },
  // The bench in logical units (460 × 300, drawn at 2×). The plant sits at BX; the lamp's face stands on the ruler
  // mark for the chosen distance. Everything that does not move is painted once per setup into two cached layers.
  BX: 330,
  _layers() {
    const st = this.st, key = [st.color, st.d, st.temp, st.co2, document.fonts ? document.fonts.status : ''].join('|');
    if (this._lk === key) return this._ly;
    const mk = () => { const c = U.canvas(920, 600), x = c.getContext('2d'); x.scale(2, 2); return [c, x]; };
    const [bc, b] = mk(), [fc, f] = mk();
    const col = this.COLORS[st.color].c, bx = this.BX, F = bx - st.d * 5.6, I = Math.min(1, Math.pow(10 / st.d, 2));
    // wall and bench
    b.fillStyle = MX.lin(b, 0, 0, 0, 262, [[0, '#3C3832'], [1, '#27241F']]); b.fillRect(0, 0, 460, 262);
    b.strokeStyle = 'rgba(255,255,255,0.035)'; b.lineWidth = 1;
    for (let y = 22; y < 262; y += 24) { b.beginPath(); b.moveTo(0, y); b.lineTo(460, y); b.stroke(); for (let x = (y / 24 % 2) * 24; x < 460; x += 48) { b.beginPath(); b.moveTo(x, y - 24); b.lineTo(x, y); b.stroke(); } }
    b.fillStyle = MX.lin(b, 0, 262, 0, 300, [[0, '#8C6C4A'], [1, '#5A4230']]); b.fillRect(0, 262, 460, 38);
    const R = MX.rng(7);
    for (let i = 0; i < 26; i++) { const y = 263 + R() * 36; b.strokeStyle = `rgba(60,38,20,${(0.12 + R() * 0.2).toFixed(2)})`; b.lineWidth = 0.5 + R(); b.beginPath(); b.moveTo(0, y); for (let x = 0; x <= 460; x += 20) b.lineTo(x, y + Math.sin(x * 0.02 + i) * 1.2); b.stroke(); }
    b.fillStyle = 'rgba(255,232,196,0.3)'; b.fillRect(0, 262, 460, 1);
    // steel rule lying on the bench, zero under the plant
    b.fillStyle = MX.lin(b, 0, 266, 0, 276, [[0, '#E4E6E4'], [0.5, '#B8BCBC'], [1, '#8A8E8E']]); b.fillRect(34, 266, 372, 10);
    b.fillStyle = '#1E1E1E'; b.font = '700 7px "Courier Prime", monospace'; b.textAlign = 'center';
    for (let mm = 0; mm <= 550; mm += 5) { const px = bx - mm * 0.56; if (px < 36) break; b.fillRect(px - 0.25, 266, 0.5, mm % 50 === 0 ? 5 : mm % 10 === 0 ? 3.2 : 2); if (mm % 100 === 0) b.fillText(mm / 10, px, 275); }
    // the light: a cone on the wall and the bench, brighter the closer the lamp
    b.save(); b.globalCompositeOperation = 'lighter';
    const g = b.createLinearGradient(F, 0, bx + 60, 0); g.addColorStop(0, U.rgba(col, 0.4)); g.addColorStop(1, U.rgba(col, 0.05 + 0.25 * I));
    b.fillStyle = g; b.beginPath(); b.moveTo(F, 128); b.lineTo(bx + 70, 64); b.lineTo(bx + 70, 262); b.lineTo(F, 172); b.closePath(); b.fill();
    b.fillStyle = MX.rad(b, (F + bx) / 2 + 20, 268, 4, 90, [[0, U.rgba(col, 0.25 + 0.2 * I)], [1, U.rgba(col, 0)]]); b.beginPath(); b.ellipse((F + bx) / 2 + 20, 268, 110, 12, 0, 0, TAU); b.fill();
    b.restore();
    // desk lamp: weighted base, pole, enamel shade, and an LED face in the chosen colour
    b.fillStyle = 'rgba(0,0,0,0.35)'; b.beginPath(); b.ellipse(F - 24, 263, 22, 4, 0, 0, TAU); b.fill();
    b.fillStyle = MX.lin(b, F - 44, 0, F - 4, 0, [[0, '#2A2E2C'], [0.4, '#5E6662'], [1, '#222624']]); b.beginPath(); b.ellipse(F - 24, 258, 20, 5, 0, 0, TAU); b.fill(); b.fillRect(F - 44, 252, 40, 6); b.beginPath(); b.ellipse(F - 24, 252, 20, 5, 0, 0, TAU); b.fill();
    b.fillStyle = MX.lin(b, F - 27, 0, F - 21, 0, [[0, '#6E7672'], [0.5, '#D8DCDA'], [1, '#6E7672']]); b.fillRect(F - 27, 150, 5, 102);
    b.fillStyle = MX.lin(b, 0, 124, 0, 176, [[0, '#4E6E5E'], [0.35, '#86A898'], [1, '#2A3E34']]);
    b.beginPath(); b.moveTo(F - 40, 140); b.lineTo(F - 2, 124); b.lineTo(F - 2, 176); b.lineTo(F - 40, 160); b.closePath(); b.fill();
    b.fillStyle = MX.lin(b, 0, 140, 0, 160, [[0, '#3A5046'], [1, '#22302A']]); b.beginPath(); b.ellipse(F - 40, 150, 3, 10, 0, 0, TAU); b.fill();
    b.save(); b.globalCompositeOperation = 'lighter';
    b.fillStyle = MX.rad(b, F, 150, 2, 40, [[0, U.rgba(col, 0.9)], [0.35, U.rgba(col, 0.35)], [1, U.rgba(col, 0)]]); b.beginPath(); b.ellipse(F, 150, 30, 44, 0, 0, TAU); b.fill();
    b.restore();
    b.fillStyle = MX.lin(b, 0, 126, 0, 174, [[0, U.shade(col, 0.6)], [0.5, '#FFFFFF'], [1, U.shade(col, 0.4)]]); b.beginPath(); b.ellipse(F, 150, 4.5, 24, 0, 0, TAU); b.fill();
    // water bath: the water, lit by the lamp and faintly tinted by its temperature
    const wt = st.temp === 35 ? '#C8B49A' : st.temp === 15 ? '#94BCD4' : '#A2C6C6';
    b.fillStyle = MX.lin(b, 0, 110, 0, 258, [[0, U.rgba(wt, 0.5)], [1, U.rgba(U.shade(wt, -0.3), 0.6)]]); b.fillRect(bx - 44, 110, 88, 148);
    b.fillStyle = MX.lin(b, bx - 44, 0, bx + 44, 0, [[0, U.rgba(col, 0.22 * (0.4 + I))], [1, U.rgba(col, 0.04)]]); b.fillRect(bx - 44, 110, 88, 148);
    if (st.co2) { for (let i = 0; i < 40; i++) { b.fillStyle = 'rgba(255,255,255,0.35)'; b.beginPath(); b.arc(bx - 40 + R() * 80, 114 + R() * 140, 0.35 + R() * 0.4, 0, TAU); b.fill(); } }
    b.fillStyle = 'rgba(255,255,255,0.5)'; b.fillRect(bx - 44, 109.5, 88, 1.2);
    // water standing inside the test tube, above the bath's surface (the gas pocket is drawn over it)
    b.fillStyle = U.rgba(wt, 0.55); b.fillRect(bx - 6.5, 41, 13, 70);
    // glass: tank walls, funnel, test tube, thermometer, all in front of the plant and the bubbles
    const glass = (pts, w = 1.3) => { f.strokeStyle = 'rgba(226,240,246,0.75)'; f.lineWidth = w; f.beginPath(); pts.forEach(([x, y], i) => i ? f.lineTo(x, y) : f.moveTo(x, y)); f.stroke(); };
    f.fillStyle = 'rgba(220,236,242,0.1)'; f.fillRect(bx - 47, 96, 3, 164); f.fillRect(bx + 44, 96, 3, 164); f.fillRect(bx - 47, 257, 94, 3);
    glass([[bx - 47, 96], [bx - 47, 260], [bx + 47, 260], [bx + 47, 96]], 1.4); glass([[bx - 44, 98], [bx - 44, 257], [bx + 44, 257], [bx + 44, 98]], 0.6);
    f.strokeStyle = 'rgba(255,255,255,0.12)'; f.lineWidth = 6; f.beginPath(); f.moveTo(bx - 30, 250); f.lineTo(bx - 6, 120); f.stroke(); f.lineWidth = 2.5; f.beginPath(); f.moveTo(bx - 18, 252); f.lineTo(bx + 4, 132); f.stroke();
    f.fillStyle = 'rgba(220,236,242,0.1)'; f.beginPath(); f.moveTo(bx - 34, 205); f.lineTo(bx - 8, 150); f.lineTo(bx + 8, 150); f.lineTo(bx + 34, 205); f.closePath(); f.fill();
    glass([[bx - 34, 205], [bx - 8, 150]]); glass([[bx + 34, 205], [bx + 8, 150]]);
    f.fillStyle = 'rgba(220,236,242,0.08)'; f.fillRect(bx - 8, 40, 16, 110);
    glass([[bx - 8, 150], [bx - 8, 42]]); glass([[bx + 8, 150], [bx + 8, 42]]); f.beginPath(); f.arc(bx, 42, 8, Math.PI, 0); f.stroke();
    f.strokeStyle = 'rgba(255,255,255,0.45)'; f.lineWidth = 1; f.beginPath(); f.moveTo(bx - 5, 46); f.lineTo(bx - 5, 146); f.stroke();
    // clamp holding the test tube
    f.fillStyle = MX.lin(f, 0, 58, 0, 66, [[0, '#9AA2A0'], [1, '#4A5250']]); f.fillRect(bx + 8, 58, 44, 7); f.fillRect(bx - 11, 56, 4, 11); f.fillRect(bx + 7, 56, 4, 11);
    f.fillStyle = MX.lin(f, bx + 48, 0, bx + 56, 0, [[0, '#6E7672'], [0.5, '#D8DCDA'], [1, '#6E7672']]); f.fillRect(bx + 50, 20, 5, 242);
    // thermometer standing in the bath
    const tx = bx + 32, top = 230 - st.temp / 40 * 150;
    f.fillStyle = 'rgba(240,246,248,0.35)'; U.rr(f, tx - 3, 66, 6, 172, 3); f.fill(); f.strokeStyle = 'rgba(230,240,246,0.8)'; f.lineWidth = 0.7; f.stroke();
    f.fillStyle = '#C8302A'; f.fillRect(tx - 1, top, 2, 236 - top); f.beginPath(); f.arc(tx, 238, 3.6, 0, TAU); f.fill();
    f.fillStyle = 'rgba(255,255,255,0.6)'; f.beginPath(); f.arc(tx - 1.2, 237, 1, 0, TAU); f.fill();
    f.fillStyle = '#F4EEDD'; f.font = '700 6px "Courier Prime", monospace'; f.textAlign = 'right';
    for (let c = 10; c <= 40; c += 10) { const y = 230 - c / 40 * 150; f.fillRect(tx - 3, y - 0.3, 2.4, 0.6); f.fillText(c + '°', tx - 4, y + 2); }
    // bicarbonate: a jar and a spoon beside the bath when it is in the water
    if (st.co2) {
      f.fillStyle = 'rgba(0,0,0,0.3)'; f.beginPath(); f.ellipse(420, 263, 16, 3, 0, 0, TAU); f.fill();
      f.fillStyle = 'rgba(226,236,240,0.35)'; U.rr(f, 404, 226, 32, 36, 4); f.fill(); f.strokeStyle = 'rgba(230,240,246,0.8)'; f.lineWidth = 0.8; f.stroke();
      f.fillStyle = '#F4F4F0'; U.rr(f, 406, 238, 28, 22, 3); f.fill();
      f.fillStyle = '#5E3A2A'; U.rr(f, 402, 220, 36, 7, 2); f.fill();
      f.fillStyle = '#F4EEDD'; f.fillRect(408, 242, 24, 11); f.fillStyle = '#1B1A17'; f.font = '700 5.5px "Courier Prime", monospace'; f.textAlign = 'center'; f.fillText('NaHCO₃', 420, 249.5);
    }
    this._lk = key; this._ly = { back: bc, front: fc };
    return this._ly;
  },
  // an Elodea sprig, cut end up, weighed down with a paper clip; oxygen streams from the cut
  _elodea(x, now) {
    const bx = this.BX, stem = [[bx - 3, 252], [bx + 3, 236], [bx - 1, 218], [bx, 197]], sway = Math.sin(now / 900) * 0.06;
    x.strokeStyle = 'rgba(210,214,212,0.9)'; x.lineWidth = 0.8; x.beginPath(); x.ellipse(bx - 3, 252, 3, 6, 0, 0, TAU); x.stroke(); x.beginPath(); x.ellipse(bx - 3, 253, 1.8, 4, 0, 0, TAU); x.stroke();
    MX.line(x, stem, '#4E7A34', 2);
    for (let t = 0.04; t < 0.97; t += 0.075) {
      const [px, py, a] = MX.along(stem, t);
      for (const [s, l] of [[-1, 7], [1, 7], [0, 3.5]]) {
        const b = a + Math.PI + s * 1.05 + sway * (1 + t) + Math.sin(now / 700 + t * 9) * 0.05;
        MX.taper(x, [[px, py], [px + Math.cos(b) * l * 0.5, py + Math.sin(b) * l * 0.5], [px + Math.cos(b) * l, py + Math.sin(b) * l]], 1.4, 2, U.pick(['#3E7A2E', '#4E8A34', '#5E9A3E'], (t * 7 + s + 1) % 1), 'rgba(30,60,20,0.55)');
      }
    }
    x.fillStyle = '#C8D8A8'; x.beginPath(); x.ellipse(bx, 197, 1.6, 0.8, 0, 0, TAU); x.fill();
  },
  draw() {
    const cv = this.cv, x = cv.getContext('2d'), st = this.st, bx = this.BX, now = performance.now(), ly = this._layers();
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(ly.back, 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // gas collected at the top of the test tube
    const gas = Math.min(60, st.trials.length * 1.5 + st.count * 0.3);
    if (gas > 0.5) { x.fillStyle = 'rgba(236,244,246,0.9)'; x.fillRect(bx - 6.5, 41, 13, gas); x.fillStyle = 'rgba(255,255,255,0.8)'; x.fillRect(bx - 6.5, 40 + gas, 13, 1); x.fillStyle = 'rgba(40,60,70,0.35)'; x.fillRect(bx - 6.5, 41 + gas, 13, 0.6); }
    this._elodea(x, now);
    for (const b of st.bubbles) {
      const by = 196 + b.y, bxx = bx + b.x; if (by < 42 + gas) continue;
      x.fillStyle = 'rgba(255,255,255,0.14)'; x.beginPath(); x.arc(bxx, by, b.r, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineWidth = 0.7; x.stroke();
      x.fillStyle = 'rgba(255,255,255,0.9)'; x.beginPath(); x.arc(bxx - b.r * 0.35, by - b.r * 0.35, b.r * 0.25, 0, TAU); x.fill();
    }
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(ly.front, 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // stopwatch: one turn of the hand is the counted minute
    const cx = 60, cy = 58;
    x.fillStyle = MX.lin(x, cx - 8, 20, cx + 8, 28, [[0, '#8A8E8C'], [0.5, '#E8EAE8'], [1, '#6A6E6C']]); x.fillRect(cx - 5, 20, 10, 8); x.fillRect(cx - 2.5, 16, 5, 5);
    x.fillStyle = MX.lin(x, cx - 32, cy - 32, cx + 32, cy + 32, [[0, '#E8EAE8'], [0.5, '#8A8E8C'], [1, '#C8CCCA']]); x.beginPath(); x.arc(cx, cy, 32, 0, TAU); x.fill();
    x.fillStyle = MX.rad(x, cx - 8, cy - 10, 4, 30, [[0, '#FFFFFA'], [1, '#E4E0D4']]); x.beginPath(); x.arc(cx, cy, 28, 0, TAU); x.fill();
    x.strokeStyle = '#1B1A17';
    for (let k = 0; k < 60; k++) { const a = k / 60 * TAU, r0 = k % 5 ? 25.5 : 23; x.lineWidth = k % 5 ? 0.5 : 1.2; x.beginPath(); x.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); x.lineTo(cx + Math.cos(a) * 27, cy + Math.sin(a) * 27); x.stroke(); }
    const a = -Math.PI / 2 + (st.running ? st.t / 6 : 0) * TAU;
    x.strokeStyle = '#B0302A'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(cx - Math.cos(a) * 6, cy - Math.sin(a) * 6); x.lineTo(cx + Math.cos(a) * 25, cy + Math.sin(a) * 25); x.stroke();
    x.fillStyle = '#B0302A'; x.beginPath(); x.arc(cx, cy, 2.2, 0, TAU); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.35)'; x.beginPath(); x.ellipse(cx - 9, cy - 12, 12, 6, -0.5, 0, TAU); x.fill();
    // bubble counter
    x.fillStyle = '#1A1C1A'; U.rr(x, 104, 30, 78, 40, 5); x.fill();
    x.fillStyle = '#2C3A2C'; U.rr(x, 108, 34, 70, 24, 3); x.fill();
    x.fillStyle = '#B8F0A0'; x.font = '700 20px "Courier Prime", monospace'; x.textAlign = 'right';
    x.fillText(String(st.running ? st.count : (st.trials.length ? st.trials[st.trials.length - 1].n : 0)), 172, 53);
    x.fillStyle = '#C8CCC8'; x.font = '600 8px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText(L(tr('kabarcık / dk', 'bubbles / min')), 143, 66);
  },
};
