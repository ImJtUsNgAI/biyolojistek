'use strict';
// Thermometer transect at the Sulphur Spring: walk down the hot outflow and stop at a stake every 5 m. At each
// stake the probe reads the water temperature, the light and the H₂S, and a hand lens shows what lives there.
// The mat changes colour with the temperature, and somewhere between two stakes the first green appears.
const THERMO = {
  N: 9, X0: 64, DX: 48.5, CY: 88,
  MATS: {
    source: { name: tr('Berrak su', 'Clear water'), who: tr('Gözle görünen örtü yok. Bu sıcaklığa yalnızca arkeler dayanır.', 'No mat you can see. Only archaea can stand this heat.') },
    white: { name: tr('Beyaz iplikler', 'White streamers'), who: tr('Kükürt bakterileri: ışık değil, H₂S ile yaşıyorlar.', 'Sulphur bacteria: they live on H₂S, not on light.') },
    yellow: { name: tr('Sarı örtü', 'Yellow mat'), who: tr('Kükürt bakterileri ve çöken kükürt. Hâlâ hiç yeşil yok.', 'Sulphur bacteria and settled sulphur. Still no green at all.') },
    orange: { name: tr('Turuncu-yeşil örtü', 'Orange-green mat'), who: tr('Siyanobakteriler! Klorofil burada başlıyor; turuncu, onu güneşten koruyan pigment.', 'Cyanobacteria! Chlorophyll starts here; the orange is a pigment shading it from the sun.') },
    brown: { name: tr('Kahverengi kalın örtü', 'Thick brown mat'), who: tr('Siyanobakteriler ve altın renkli diatomlar, kat kat.', 'Cyanobacteria and golden diatoms, layer upon layer.') },
    green: { name: tr('Yeşil alg iplikleri', 'Green algal threads'), who: tr('Yeşil algler; aralarında sinek larvaları ve salyangozlar. İlk hayvanlar!', 'Green algae, with fly larvae and snails among them. The first animals!') },
  },
  sx(i) { return this.X0 + i * this.DX; },
  cy(x) { return this.CY + Math.sin(x * 0.021) * 7; },
  cw(x) { return 22 + (x - this.X0) / 390 * 26; },

  open() {
    const S = G.S;
    const run = S.spring || (S.spring = { seed: 1 + Math.floor(Math.random() * 1e5), meas: {} });
    this.st = { run, sel: null, probe: { x: this.X0 - 30, to: null, k: 0 }, t: 0 };
    const last = Object.keys(run.meas).map(Number).sort((a, b) => a - b).pop();
    if (last != null) { this.st.sel = last; this.st.probe.x = this.sx(last); }
    const body = h('div', 'kit rig ferm thermo');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('İstasyon · kaynaktan uzaklık', 'Station · distance from the source'))}</label>
        <div class="th-st">${Array.from({ length: this.N }, (_, i) => `<button data-i="${i}">${i * 5} m</button>`).join('')}</div>
        <p class="fm-const">${L(tr('Her istasyonda aynı: öğle saati, sonda suyun 2 cm altında. Işık ölçer ve H₂S şeridi de probun üstünde.', 'The same at every station: midday, the probe 2 cm under the water. A light meter and an H₂S strip ride on the probe too.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('İpucu: kaynaktan başla, aşağı doğru in. İlk yeşil hangi iki kazığın arasında?', 'Tip: start at the source and work downstream. Between which two stakes does the first green appear?'))}</p>`;
    body.querySelectorAll('.th-st button').forEach(b => b.onclick = () => this.go(+b.dataset.i));
    this.body = body; this.cv = body.querySelector('canvas');
    this.cv.addEventListener('pointerdown', e => {
      const r = this.cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 460, y = (e.clientY - r.top) / r.height * 300;
      if (y > 170) return;
      const i = Math.round((x - this.X0) / this.DX);
      if (i >= 0 && i < this.N && Math.abs(x - this.sx(i)) < 22) this.go(i);
    });
    this.pn = UI.panel({ title: tr('Kükürtlü Pınar · Sıcaklık ölçümü', 'Sulphur Spring · Temperature transect'), code: 'BİY.10.2.1', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.table(); this.loop();
  },
  // one station's readings: fixed for this save, so a second visit reads the same water
  data(i) {
    const R = MX.rng(this.st.run.seed * 31 + i * 7 + 3), d = i * 5;
    const T = Math.round((90 - 1.6 * d + (R() - 0.5) * 1.2) * 10) / 10;
    return { d, T, lux: Math.round(96 + R() * 4), h2s: Math.round((8 * Math.exp(-d / 8) + 0.05 + R() * 0.1) * 10) / 10, mat: SPRING.mat(T) };
  },
  // walk the probe to a stake; the reading is taken when it gets there
  go(i) {
    const p = this.st.probe;
    if (p.to != null) return;
    p.to = i; p.k = 0; this.st.sel = i;
    AU.sfx('click'); this._sync();
  },
  measure(i) {
    const run = this.st.run;
    if (!run.meas[i]) run.meas[i] = this.data(i);
    this.st.sel = i; this.st.probe.x = this.sx(i); this.st.probe.to = null;
    AU.sfx('pen');
    this._sync(); this.table(); G.save();
  },
  step(dt) {
    const st = this.st, p = st.probe;
    st.t += dt;
    if (p.to == null) return;
    const tx = this.sx(p.to), d = tx - p.x;
    if (Math.abs(d) > 1) { p.x += Math.sign(d) * Math.min(Math.abs(d), dt * 300); return; }
    p.x = tx; p.k += dt / 0.7;
    if (p.k >= 1) this.measure(p.to);
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
  _sync() {
    const m = this.st.run.meas;
    this.body.querySelectorAll('.th-st button').forEach(b => { const i = +b.dataset.i; b.classList.toggle('on', this.st.sel === i); b.classList.toggle('done', !!m[i]); b.disabled = this.st.probe.to != null; });
  },
  analyse() {
    const m = this.st.run.meas, list = Object.values(m).sort((a, b) => a.d - b.d);
    const o = { n: list.length, source: !!m[0], line: !!(m[2] && m[3]), animals: list.some(r => r.T < 45) };
    o.done = o.n >= 6 && o.source && o.line && o.animals;
    o.list = list;
    return o;
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S;
    const rows = a.list.map(r => `<tr><td>${r.d} m</td><td><b>${r.T.toFixed(1)} °C</b></td><td>%${r.lux}</td><td>${r.h2s.toFixed(1)}</td><td><i class="th-sw" style="--sw:${SPRING.COL[r.mat]}"></i>${U.esc(L(this.MATS[r.mat].name))}</td></tr>`).join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Uzaklık', 'Distance'))}</th><th>${L(tr('Sıcaklık', 'Temp.'))}</th><th>${L(tr('Işık', 'Light'))}</th><th>H₂S mg/L</th><th>${L(tr('Örtü', 'Mat'))}</th></tr>${rows || `<tr><td colspan="5">${L(tr('Henüz ölçüm yok.', 'No readings yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.n >= 6, tr(`Altı istasyon (${a.n}/6)`, `Six stations (${a.n}/6)`)], [a.source, tr('Kaynak', 'The source')], [a.line, tr('Yeşil çizgi', 'The green line')], [a.animals, tr('İlk hayvanlar', 'The first animals')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.list.length) UI._chart(body.querySelector('.rig-chart'), { values: a.list.map(r => r.T), labels: a.list.map(r => ({ tr: String(r.d), en: String(r.d) })), colors: a.list.map(r => SPRING.COL[r.mat]), unit: tr('°C · uzaklık (m)', '°C · distance (m)') });
    let msg = null;
    if (a.line && !this._saidLine) { this._saidLine = true; msg = tr(`10 m’de ${a.list.find(r => r.d === 10).T.toFixed(1)} °C ve hiç yeşil yok; 15 m’de ${a.list.find(r => r.d === 15).T.toFixed(1)} °C ve siyanobakteriler var. Yeşil çizgi arada!`, `At 10 m, ${a.list.find(r => r.d === 10).T.toFixed(1)} °C and no green at all; at 15 m, ${a.list.find(r => r.d === 15).T.toFixed(1)} °C and cyanobacteria. The green line is in between!`); }
    if (a.done && !S.flags.springTransect) {
      S.flags.springTransect = true;
      S.journal.exps.push({ title: tr('Kükürtlü Pınar sıcaklık ölçümü', 'Sulphur Spring transect'), code: 'BİY.10.2.1', t: Date.now(),
        head: [tr('Uzaklık', 'Distance'), tr('Sıcaklık', 'Temperature'), tr('Işık', 'Light'), 'H₂S', tr('Örtü', 'Mat')],
        rows: a.list.map(r => [r.d + ' m', r.T.toFixed(1) + ' °C', '%' + r.lux, r.h2s.toFixed(1) + ' mg/L', this.MATS[r.mat].name]),
        chart: { values: a.list.map(r => r.T), labels: a.list.map(r => ({ tr: String(r.d), en: String(r.d) })), colors: a.list.map(r => SPRING.COL[r.mat]), unit: tr('°C · uzaklık (m)', '°C · distance (m)') },
        note: tr('Su kaynaktan uzaklaştıkça soğudu; ışık her istasyonda aynıydı. Yaklaşık 73 °C’nin üstünde yeşil yok: orada yalnızca H₂S ile yaşayan bakteriler ve arkeler var. Altında siyanobakteriler, 45 °C’nin altında algler ve hayvanlar başlıyor.', 'The water cooled as it flowed away from the source; the light was the same at every station. Above about 73 °C there is no green: only bacteria living on H₂S, and archaea. Below it cyanobacteria begin, and under 45 °C algae and animals.') });
      msg = tr('Ölçüm tamam! Sonuçlar defterinde.', 'Transect complete! The results are in your journal.');
      if (Q.at('spring', 'transect')) { UI.stamp(L(tr('TRANSEKT', 'TRANSECT'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
    if (msg) body.querySelector('.kit-msg').textContent = L(msg);
  },
  async close() {
    this.pn = null;
    if (Q.at('spring', 'transect') && G.S.flags.springTransect) {
      await ask('spring_green');
      await ask('spring_energy');
      await UI.say('player', tr('Pınar zehirli değil: her sıcaklıkta başka canlılar yaşıyor. En sıcak yerdekiler güneşe bile muhtaç değil. Kahvehanedeki dedelere anlatmalıyım.', 'The spring isn’t poisoned: different living things live at each temperature. The ones in the hottest water don’t even need the sun. I must tell the grandpas at the teahouse.'));
      Q.adv('spring');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(77);
    // grey volcanic ground with a pale crust along the water
    b.fillStyle = MX.lin(b, 0, 0, 0, 300, [[0, '#9A907E'], [1, '#7E7666']]); b.fillRect(0, 0, 460, 300);
    for (let k = 0; k < 160; k++) { b.fillStyle = `rgba(${R() < 0.5 ? '60,54,46' : '190,182,164'},${(0.2 + R() * 0.3).toFixed(2)})`; b.beginPath(); b.ellipse(R() * 460, R() * 170, 2 + R() * 6, 1 + R() * 3, R() * 3, 0, TAU); b.fill(); }
    const top = [], bot = [];
    for (let x = this.X0 - 10; x <= 464; x += 4) { const y = this.cy(x), w = this.cw(x) / 2; top.push([x, y - w]); bot.push([x, y + w]); }
    b.fillStyle = '#CFC7B4'; b.beginPath(); U.poly(b, top.map(([x, y]) => [x, y - 9]).concat(bot.map(([x, y]) => [x, y + 9]).reverse()), true); b.fill();
    b.beginPath(); b.arc(40, this.CY, 42, 0, TAU); b.fill();
    b.fillStyle = MX.rad(b, 40, this.CY, 10, 90, [[0, 'rgba(226,200,80,0.7)'], [1, 'rgba(226,200,80,0)']]); b.fillRect(0, 0, 150, 170);
    // the channel, coloured by the true temperature at each point (the stakes will tell you the numbers)
    b.save(); b.beginPath(); U.poly(b, top.concat(bot.slice().reverse()), true); b.clip();
    for (let x = this.X0 - 12; x <= 464; x += 1.5) { const t = (x - this.X0) / (this.DX * 8); b.fillStyle = SPRING.COL[SPRING.mat(SPRING.T(U.clamp(t, 0, 1.1)))]; b.globalAlpha = 0.35; b.beginPath(); b.arc(x, this.cy(x), this.cw(x) * 0.62, 0, TAU); b.fill(); }
    b.globalAlpha = 1;
    for (let k = 0; k < 700; k++) {
      const x = this.X0 + R() * 400, t = (x - this.X0) / (this.DX * 8), m = SPRING.mat(SPRING.T(U.clamp(t, 0, 1))), y = this.cy(x) + (R() - 0.5) * this.cw(x);
      MX.line(b, MX.strand(R, x, y, (R() - 0.5) * 0.4, m === 'green' ? 8 + R() * 10 : m === 'white' ? 5 + R() * 7 : 2 + R() * 4, 1.5, 0.4), SPRING.STR[m][R() < 0.55 ? 0 : 1], 0.6);
    }
    b.restore();
    b.strokeStyle = 'rgba(60,50,36,0.6)'; b.lineWidth = 0.8; b.beginPath(); U.poly(b, top, false); b.stroke(); b.beginPath(); U.poly(b, bot, false); b.stroke();
    // the vent pool
    b.fillStyle = '#E2CC5E'; b.beginPath(); b.arc(40, this.CY, 32, 0, TAU); b.fill();
    b.fillStyle = MX.rad(b, 42, this.CY + 2, 2, 27, [[0, '#0B2E4E'], [0.45, '#15628A'], [0.8, '#3AA4B4'], [1, '#A8D4C4']]); b.beginPath(); b.arc(40, this.CY, 27, 0, TAU); b.fill();
    b.strokeStyle = 'rgba(250,250,236,0.85)'; b.lineWidth = 1.2; b.stroke();
    // the lower part of the bench: a field notebook page
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5; for (let y = 186; y < 300; y += 12) { b.beginPath(); b.moveTo(130, y); b.lineTo(456, y); b.stroke(); }
    this._bc = c;
    return c;
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, m = st.run.meas, t = st.t;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // steam and bubbles over the hot end
    for (let i = 0; i < 7; i++) { const k = (t * 0.2 + i / 7) % 1, sx = 22 + (i * 23) % 90 + k * 30, sy = this.CY - k * 70, r = 8 + k * 16; x.fillStyle = MX.rad(x, sx, sy, 0, r, [[0, `rgba(252,252,250,${(0.35 * Math.sin(k * Math.PI)).toFixed(3)})`], [1, 'rgba(252,252,250,0)']]); x.beginPath(); x.arc(sx, sy, r, 0, TAU); x.fill(); }
    for (let i = 0; i < 4; i++) { const k = (t * 0.8 + i * 0.29) % 1; x.strokeStyle = `rgba(255,255,255,${(0.8 * (1 - k)).toFixed(2)})`; x.lineWidth = 0.6; x.beginPath(); x.arc(32 + (i * 11) % 20, this.CY - 8 + (i * 7) % 16, 1 + k * 4, 0, TAU); x.stroke(); }
    // the green line, once both stakes around it have been read
    if (m[2] && m[3]) {
      const lx = this.sx(2) + (m[2].T - 73) / (m[2].T - m[3].T) * this.DX, ly = this.cy(lx), w = this.cw(lx) / 2 + 14;
      x.strokeStyle = '#2F6A3A'; x.lineWidth = 1.6; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(lx, ly - w); x.lineTo(lx, ly + w); x.stroke(); x.setLineDash([]);
      x.fillStyle = 'rgba(244,238,221,0.92)'; x.fillRect(lx - 34, ly - w - 14, 68, 12); x.strokeStyle = '#2F6A3A'; x.lineWidth = 0.8; x.strokeRect(lx - 34, ly - w - 14, 68, 12);
      x.fillStyle = '#2F6A3A'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(L(tr('yeşil çizgi ≈73 °C', 'green line ≈73 °C')), lx, ly - w - 5);
    }
    // stakes, each with its reading once taken
    for (let i = 0; i < this.N; i++) {
      const sx = this.sx(i), sy = this.cy(sx) + this.cw(sx) / 2 + 12, r = m[i], sel = st.sel === i;
      x.fillStyle = 'rgba(30,24,16,0.35)'; x.beginPath(); x.ellipse(sx + 2, sy + 1, 3, 1.4, 0, 0, TAU); x.fill();
      x.fillStyle = '#E8E0CC'; x.fillRect(sx - 1.6, sy - 14, 3.2, 14); x.fillStyle = '#B03A2E'; x.fillRect(sx - 1.6, sy - 14, 3.2, 5);
      x.strokeStyle = 'rgba(30,24,16,0.8)'; x.lineWidth = 0.5; x.strokeRect(sx - 1.6, sy - 14, 3.2, 14);
      x.fillStyle = sel ? '#1B1A17' : 'rgba(244,238,221,0.9)'; x.fillRect(sx - 15, sy + 3, 30, 11);
      x.fillStyle = sel ? '#F4EEDD' : '#1B1A17'; x.font = '700 7.5px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(i * 5 + ' m', sx, sy + 11);
      if (r) {
        x.fillStyle = SPRING.COL[r.mat]; x.fillRect(sx - 17, sy + 16, 34, 13); x.strokeStyle = '#1B1A17'; x.lineWidth = 0.7; x.strokeRect(sx - 17, sy + 16, 34, 13);
        x.fillStyle = r.mat === 'brown' || r.mat === 'green' ? '#FBF7EC' : '#1B1A17'; x.font = '700 8px "Courier Prime", monospace'; x.fillText(r.T.toFixed(1) + '°', sx, sy + 25.5);
      }
    }
    this._probe(x);
    this._lens(x);
  },
  // the hand-held probe: a steel rod dipped in the water, its dial above
  _probe(x) {
    const p = this.st.probe, px = p.x, py = this.cy(px), reading = p.to != null && Math.abs(px - this.sx(p.to)) <= 1;
    x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(px + 3, py + 2); x.lineTo(px + 17, py - 38); x.stroke();
    x.strokeStyle = '#C8CCD0'; x.lineWidth = 2; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 14, py - 40); x.stroke();
    x.fillStyle = '#2A2620'; x.beginPath(); x.arc(px + 16, py - 48, 10, 0, TAU); x.fill();
    x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(px + 16, py - 48, 8, 0, TAU); x.fill();
    // the needle sweeps up while the probe settles
    const r = this.st.run.meas[this.st.sel], T = reading ? 20 + (this.data(p.to).T - 20) * U.clamp(p.k, 0, 1) : r && Math.abs(px - this.sx(this.st.sel)) <= 1 ? r.T : 20, a = Math.PI * 0.8 + (T - 20) / 80 * Math.PI * 1.4;
    x.strokeStyle = '#A0322A'; x.lineWidth = 1; x.beginPath(); x.moveTo(px + 16, py - 48); x.lineTo(px + 16 + Math.cos(a) * 6.5, py - 48 + Math.sin(a) * 6.5); x.stroke();
    x.strokeStyle = 'rgba(40,36,30,0.6)'; x.lineWidth = 0.4; for (let k = 0; k <= 8; k++) { const b = Math.PI * 0.8 + k / 8 * Math.PI * 1.4; x.beginPath(); x.moveTo(px + 16 + Math.cos(b) * 6.6, py - 48 + Math.sin(b) * 6.6); x.lineTo(px + 16 + Math.cos(b) * 7.8, py - 48 + Math.sin(b) * 7.8); x.stroke(); }
    x.fillStyle = 'rgba(255,255,255,0.7)'; for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(px + (k - 1) * 3, py + 1 + (k % 2), 1, 0, TAU); x.fill(); }
  },
  // the lower page: a hand lens on the selected station and its readings
  _lens(x) {
    const st = this.st, i = st.sel, r = i != null ? st.run.meas[i] : null, cx = 66, cy = 236, R = 52;
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.beginPath(); x.arc(cx + 2, cy + 3, R + 3, 0, TAU); x.fill();
    x.save(); x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.clip(); x.translate(cx, cy);
    if (r) this._mat(x, r.mat, i, st.t); else { x.fillStyle = '#D8D2C2'; x.fillRect(-R, -R, 2 * R, 2 * R); }
    x.restore();
    x.fillStyle = MX.rad(x, cx, cy, R * 0.6, R, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.3)']]); x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fill();
    x.strokeStyle = '#2A2620'; x.lineWidth = 2.6; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.stroke();
    x.strokeStyle = '#C8A24E'; x.lineWidth = 1.2; x.beginPath(); x.arc(cx, cy, R - 1.6, 0, TAU); x.stroke();
    x.fillStyle = '#1B1A17'; x.textAlign = 'left';
    if (!r) {
      x.font = '600 11px "Atkinson Hyperlegible Next", sans-serif';
      x.fillText(L(st.probe.to != null ? tr('Prob ölçüyor…', 'The probe is reading…') : tr('Bir kazık seç: prob oraya gider ve ölçer.', 'Pick a stake: the probe goes there and takes a reading.')), 136, 214);
      return;
    }
    x.font = '700 9px "Courier Prime", monospace'; x.fillStyle = '#A0322A'; x.fillText(L(tr('İSTASYON', 'STATION')) + ' · ' + r.d + ' m', 136, 190);
    x.fillStyle = '#1B1A17'; x.font = '700 26px "Courier Prime", monospace'; x.fillText(r.T.toFixed(1) + ' °C', 136, 218);
    x.font = '700 10px "Courier Prime", monospace'; x.fillText(L(tr('ışık', 'light')) + ' %' + r.lux + '   H₂S ' + r.h2s.toFixed(1) + ' mg/L', 290, 206);
    x.fillStyle = SPRING.COL[r.mat]; x.fillRect(136, 228, 12, 12); x.strokeStyle = '#1B1A17'; x.lineWidth = 0.8; x.strokeRect(136, 228, 12, 12);
    x.fillStyle = '#1B1A17'; x.font = '700 11px "Atkinson Hyperlegible Next", sans-serif'; x.fillText(L(this.MATS[r.mat].name), 154, 238);
    x.font = '400 10px "Atkinson Hyperlegible Next", sans-serif';
    const words = L(this.MATS[r.mat].who).split(' '); let line = '', y = 256;
    for (const w of words) { if (x.measureText(line + w).width > 310) { x.fillText(line, 136, y); line = ''; y += 13; } line += w + ' '; }
    x.fillText(line, 136, y);
  },
  // what the hand lens shows at each band; the streamers sway in the current
  _mat(x, mat, i, t) {
    const R = MX.rng(900 + i * 17), sway = k => Math.sin(t * 2 + k) * 0.18;
    const bg = { source: '#9CCCD2', white: '#D8D8CC', yellow: '#D8C27A', orange: '#C88450', brown: '#7E6A48', green: '#6E8E5A' }[mat];
    x.fillStyle = bg; x.fillRect(-60, -60, 120, 120);
    if (mat === 'source') {
      x.fillStyle = 'rgba(255,255,255,0.35)'; for (let k = 0; k < 6; k++) { const q = (t * 0.5 + k / 6) % 1; x.beginPath(); x.arc(-30 + k * 12, 40 - q * 90, 2 + q * 2, 0, TAU); x.fill(); }
      MX.dots(x, R, 40, [-50, -50, 100, 100], 0.4, 0.8, 'rgba(60,80,90,0.5)');
      x.fillStyle = 'rgba(240,220,120,0.9)'; for (let k = 0; k < 5; k++) { x.save(); x.translate(-40 + R() * 80, -40 + R() * 80); x.rotate(R() * 3); x.fillRect(-2, -2, 4, 4); x.restore(); }
      return;
    }
    if (mat === 'white' || mat === 'yellow') {
      for (let k = 0; k < 22; k++) {
        const y0 = -50 + R() * 100, a = sway(k), pts = [];
        for (let s = 0; s <= 6; s++) pts.push([-60 + s * 20, y0 + Math.sin(s * 0.9 + k + t * 1.5) * 3 + s * 20 * Math.sin(a)]);
        MX.line(x, pts, mat === 'white' ? (k % 3 ? '#FBFAF4' : '#E6D6CC') : (k % 3 ? '#F2DC70' : '#FFF4C0'), 2.2 + R() * 1.5);
      }
      if (mat === 'yellow') { x.fillStyle = 'rgba(250,236,120,0.95)'; for (let k = 0; k < 12; k++) { x.save(); x.translate(-45 + R() * 90, -45 + R() * 90); x.rotate(R() * 3); x.beginPath(); x.moveTo(0, -3); x.lineTo(2.2, 0); x.lineTo(0, 3); x.lineTo(-2.2, 0); x.closePath(); x.fill(); x.restore(); } }
      return;
    }
    if (mat === 'orange' || mat === 'brown') {
      const top = mat === 'orange' ? ['#E8963E', '#B8622A'] : ['#A87E46', '#6E5028'];
      for (let k = 0; k < 60; k++) { x.fillStyle = top[k % 2]; x.beginPath(); x.ellipse(-55 + R() * 110, -55 + R() * 110, 6 + R() * 10, 3 + R() * 5, R() * 3, 0, TAU); x.fill(); }
      for (let k = 0; k < (mat === 'orange' ? 28 : 18); k++) MX.rod(x, -48 + R() * 96, -48 + R() * 96, R() * TAU, 9, 4, '#4E9270', 'rgba(20,60,40,0.9)');
      if (mat === 'brown') for (let k = 0; k < 9; k++) { x.save(); x.translate(-44 + R() * 88, -44 + R() * 88); x.rotate(R() * 3); x.fillStyle = '#C8A04A'; x.beginPath(); x.ellipse(0, 0, 8, 2.6, 0, 0, TAU); x.fill(); x.strokeStyle = '#6A5020'; x.lineWidth = 0.5; x.stroke(); x.beginPath(); x.moveTo(-6, 0); x.lineTo(6, 0); x.stroke(); x.restore(); }
      return;
    }
    // green: algal threads, a snail, and a red midge larva wriggling through
    for (let k = 0; k < 16; k++) {
      const y0 = -50 + R() * 100, pts = [];
      for (let s = 0; s <= 6; s++) pts.push([-60 + s * 20, y0 + Math.sin(s * 0.8 + k + t) * 5 + s * 3 * sway(k)]);
      MX.line(x, pts, k % 2 ? '#8ABE56' : '#5E9A3A', 2.4);
      MX.line(x, pts.map(([px, py]) => [px, py - 0.6]), 'rgba(220,250,180,0.35)', 0.6);
    }
    x.fillStyle = MX.lit(x, 18, 22, 8, '#6A5236'); x.beginPath(); x.arc(18, 22, 8, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(240,226,200,0.6)'; x.lineWidth = 0.8; x.beginPath(); x.arc(18, 22, 4.5, 0, 4.6); x.stroke();
    const lp = []; for (let s = 0; s <= 8; s++) lp.push([-30 + s * 4, -14 + Math.sin(s * 0.9 + t * 6) * 3.5]);
    MX.line(x, lp, '#B8322A', 3); x.fillStyle = '#5A1810'; x.beginPath(); x.arc(lp[8][0] + 1, lp[8][1], 2, 0, TAU); x.fill();
  },
};
