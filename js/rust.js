'use strict';
// Wind table by Osman's wheat. Two model fields of 8 × 6 plants side by side under the same wind: on the left one
// uniform variety (every plant the same, every plant open to this rust), on the right Grandma's mixed field, where
// only a few plants are of a type the rust can attack. Tap a plant to set down the first rusty leaf (the same spot in
// both fields), then the wind carries the spores on, two weeks at a time. The same spores fly in both fields; only
// the plants differ. Nothing can fail: any tap is a good start, and the one big button picks a plant for you.
const RUST = {
  C: 8, ROWS: 6, GENS: 8, STEP: 0.95,
  F: [{ x: 20, y: 90, w: 200, h: 162 }, { x: 240, y: 90, w: 200, h: 162 }],   // the two fields in the 460 × 300 scene
  // spore flights from a sporulating plant: [dx, dy, chance]. The wind blows left to right, so most go downwind.
  WIND: [[1, 0, 0.9], [1, -1, 0.7], [1, 1, 0.7], [0, -1, 0.6], [0, 1, 0.6], [-1, 0, 0.5], [-1, -1, 0.38], [-1, 1, 0.38], [2, 0, 0.35], [2, -1, 0.25], [2, 1, 0.25], [3, 0, 0.15]],

  open() {
    const S = G.S;
    const run = S.rust || (S.rust = { seed: 1 + Math.floor(Math.random() * 1e5), done: 0 });
    const body = h('div', 'kit rig ferm rustbench');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <button class="pl-go"></button>
        <p class="fm-const">${L(tr('İki tarla da aynı rüzgârı, aynı sporları alıyor. Tek fark bitkiler: soldakilerin hepsi aynı çeşit, sağdakiler karışık.', 'Both fields get the same wind and the same spores. The only difference is the plants: on the left they are all one variety, on the right they are mixed.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div>
      <p class="kit-msg"></p>`;
    body.querySelector('.pl-go').addEventListener('click', () => this.act());
    this.body = body; this.cv = body.querySelector('canvas');
    this.fresh(run);
    const at = e => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300]; };
    this.cv.addEventListener('pointerdown', e => this.tap(...at(e)));
    this.cv.addEventListener('pointermove', e => { this.st.hand = at(e); });
    this.cv.addEventListener('pointerleave', () => { this.st.hand = null; });
    // space or enter presses the big button; captured so the player doesn't walk off
    this._key = e => {
      if (!this.pn || !['Space', 'Enter'].includes(e.code)) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (!e.repeat) this.act();
    };
    window.addEventListener('keydown', this._key, true);
    this.pn = UI.panel({ title: tr('Rüzgâr masası · Pas nasıl yayılır?', 'Wind table · How does rust spread?'), code: 'BİY.10.2.8', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.loop();
  },
  fresh(run) {
    run = run || this.st.run;
    const n = this.C * this.ROWS, plant = v => ({ v, inf: -1, at: 0, fleck: 0 });
    this.st = { run, phase: 'pick', t: 0, gt: 0, gen: 0, start: null, fields: [Array.from({ length: n }, () => plant(0)), Array.from({ length: n }, () => plant(1))], sp: [], idle: 0, help: false, hand: null, result: null };
    this.mix();
    this._msg(tr('Soldaki tarlada bir bitkiye dokun: ilk paslı yaprak oraya düşsün. Sağdaki tarlada da aynı yere düşecek.', 'Tap a plant in the left field: the first rusty leaf lands there. It will land in the same spot in the right field too.'));
    this._sync();
  },
  idx(c, r) { return r * this.C + c; },
  cell(f, c, r) { const F = this.F[f], cw = F.w / this.C, ch = F.h / this.ROWS; return [F.x + (c + 0.5) * cw, F.y + (r + 0.5) * ch]; },
  hit(x, y) {
    for (const F of this.F) if (x > F.x - 6 && x < F.x + F.w + 6 && y > F.y - 14 && y < F.y + F.h + 4)
      return [U.clamp(Math.floor((x - F.x) / F.w * this.C), 0, this.C - 1), U.clamp(Math.floor((y - F.y) / F.h * this.ROWS), 0, this.ROWS - 1)];
    return null;
  },
  // Grandma's field: three local types sown mixed. Type 0 is open to this rust race, types 1 and 2 are not; the open
  // plants rarely stand next to each other.
  mix() {
    const C = this.C, n = C * this.ROWS, R = MX.rng(this.st.run.seed + this.st.run.done * 97), P = this.st.fields[1];
    const order = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    for (const p of P) p.v = -1;
    for (const i of order) {
      const c = i % C, r = i / C | 0;
      let near = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const cc = c + dx, rr = r + dy; if ((dx || dy) && cc >= 0 && cc < C && rr >= 0 && rr < this.ROWS && P[this.idx(cc, rr)].v === 0) near++; }
      P[i].v = !near && R() < 0.8 ? 0 : 1 + (R() < 0.5 ? 1 : 0);
    }
  },
  begin(c, r) {
    const st = this.st;
    st.start = [c, r];
    // the first rusty leaf always lands on a plant it can grow on; in Grandma's field that plant's open neighbours swap
    // for resistant ones, so the mix keeps its rule that open plants seldom touch
    const M = st.fields[1], s = this.idx(c, r);
    if (M[s].v !== 0) { M[s].v = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const cc = c + dx, rr = r + dy; if ((dx || dy) && cc >= 0 && cc < this.C && rr >= 0 && rr < this.ROWS && M[this.idx(cc, rr)].v === 0) M[this.idx(cc, rr)].v = 1; } }
    for (const P of st.fields) { const p = P[this.idx(c, r)]; p.inf = 0; p.at = st.t; }
    st.phase = 'wind'; st.gen = 0; st.gt = this.STEP * 0.6; AU.sfx('page');
    this._msg(tr('Paslı yaprak düştü. Rüzgâr esiyor: her iki haftada bir, paslı bitkilerin sporları rüzgârla komşu bitkilere uçuyor.', 'The rusty leaf has landed. The wind is blowing: every two weeks the rusty plants’ spores fly on the wind to the plants nearby.'));
    this._sync();
  },
  tap(x, y) {
    const st = this.st; st.idle = 0;
    if (st.phase !== 'pick') return;
    const k = this.hit(x, y);
    if (k) { AU.sfx('click'); this.begin(...k); }
  },
  // the one big button: whatever the next step is
  act() {
    const st = this.st; st.idle = 0;
    if (st.phase === 'pick') { AU.sfx('click'); this.begin(1, 2); }
    else if (st.phase === 'done') { st.run.done++; this.fresh(); AU.sfx('click'); }
    this._sync();
  },
  // one generation of the fungus: every plant that has been rusty since an earlier generation sheds spores. The same
  // flights are drawn for both fields (a hash of the plant, the direction and the week), so only the plants differ.
  spread() {
    const st = this.st, g = ++st.gen, C = this.C, seed = st.run.seed + st.run.done * 131;
    st.fields.forEach((P, f) => {
      for (let i = 0; i < P.length; i++) {
        const p = P[i]; if (p.inf < 0 || p.inf >= g) continue;
        const c = i % C, r = i / C | 0;
        this.WIND.forEach(([dx, dy, ch], w) => {
          const cc = c + dx, rr = r + dy;
          if (cc < 0 || cc >= C || rr < 0 || rr >= this.ROWS || U.hash(i * 13 + w, g * 7 + 3, seed) > ch) return;
          const q = P[this.idx(cc, rr)];
          if (q.inf >= 0 || q.fleck >= 3 || q.pend) return;
          q.pend = true;
          st.sp.push({ f, to: this.idx(cc, rr), a: this.cell(f, c, r), b: this.cell(f, cc, rr), t: 0, dur: 0.45 + U.hash(i, w, g) * 0.35, g });
        });
      }
    });
    AU.sfx('whoosh');
  },
  land(s) {
    const q = this.st.fields[s.f][s.to]; q.pend = false;
    if (q.v === 0) { if (q.inf < 0) { q.inf = s.g; q.at = this.st.t; } }
    else q.fleck = Math.min(3, q.fleck + 1);
  },
  count(f) { return this.st.fields[f].filter(p => p.inf >= 0).length; },
  settle() {
    const st = this.st, S = G.S, a = this.count(0), b = this.count(1), n = this.C * this.ROWS, pc = k => Math.round(k / n * 100);
    st.phase = 'done'; st.result = [a, b];
    AU.sfx('chime');
    this._msg(tr(`16 hafta sonra: tek çeşit tarlada ${a}/${n} bitki paslandı, karışık tarlada yalnızca ${b}/${n}. Aynı sporlar iki tarlaya da uçtu; karışık tarlada çoğu dayanıklı bitkilere kondu ve orada öldü.`, `After 16 weeks: in the one-variety field ${a}/${n} plants rusted, in the mixed field only ${b}/${n}. The same spores flew into both fields; in the mixed field most of them landed on resistant plants and died there.`));
    S.rustRes = [a, b];
    if (!S.flags.rustDone) {
      S.flags.rustDone = true;
      S.journal.exps.push({ title: tr('Rüzgâr masası: pas tek çeşit ve karışık tarlada', 'Wind table: rust in a one-variety and a mixed field'), code: 'BİY.10.2.8', t: Date.now(),
        head: [tr('Tarla', 'Field'), tr('Bitkiler', 'Plants'), tr('16 hafta sonra paslı', 'Rusty after 16 weeks'), tr('Oran', 'Share')],
        rows: [[tr('tek çeşit (Osman)', 'one variety (Osman)'), n, a, '%' + pc(a)], [tr('karışık (Nine)', 'mixed (Grandma)'), n, b, '%' + pc(b)]],
        note: tr('İki tarlaya aynı rüzgârla aynı sporlar gönderildi. Tek çeşit tarlada her bitki aynı genleri taşıdığı için her spor tutundu ve pas bitkiden bitkiye atladı. Karışık tarlada sporların çoğu dayanıklı bitkilere kondu; oradaki birkaç hücreyi öldürüp kendisi de öldü, zincir kırıldı. Bu bir model: gerçek tarlada fark genellikle bu kadar büyük değildir ama yönü aynıdır.', 'The same spores were sent into both fields on the same wind. In the one-variety field every plant carries the same genes, so every spore took hold and the rust jumped from plant to plant. In the mixed field most spores landed on resistant plants; they killed a few cells there and died themselves, so the chain broke. This is a model: in a real field the difference is usually smaller, but it goes the same way.') });
      if (Q.at('pas', 'wind')) { UI.stamp(L(tr('KARŞILAŞTIRILDI', 'COMPARED'))); const pn = this.pn; setTimeout(() => pn && pn.close(), 3200); }
    }
    this._sync(); G.save();
  },

  // ---------------------------------------------------------------- time
  step(dt) {
    const st = this.st;
    st.t += dt; st.idle += dt;
    if (st.phase === 'pick' && st.idle > 6) st.help = true;
    if (st.phase === 'wind') {
      st.gt += dt;
      if (st.gen < this.GENS && st.gt >= this.STEP) { st.gt = 0; this.spread(); this._sync(); }
      else if (st.gen >= this.GENS && !st.sp.length && st.gt >= 0.5) this.settle();
    }
    for (const s of st.sp) { s.t += dt; if (s.t >= s.dur) this.land(s); }
    st.sp = st.sp.filter(s => s.t < s.dur);
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
    const b = this.body, st = this.st;
    if (!b) return;
    const go = b.querySelector('.pl-go'), busy = st.phase === 'wind';
    go.textContent = L(st.phase === 'pick' ? tr('Paslı yaprağı bırak 🍂', 'Drop the rusty leaf 🍂') : busy ? tr(`Rüzgâr esiyor… ${st.gen * 2}. hafta`, `Wind blowing… week ${st.gen * 2}`) : tr('Başka bir yerden dene ↺', 'Try another spot ↺'));
    go.disabled = busy;
    go.classList.toggle('next', !busy);
    this.table();
  },
  table() {
    const b = this.body, S = G.S, st = this.st, n = this.C * this.ROWS, res = S.rustRes;
    if (!b) return;
    b.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Tarla', 'Field'))}</th><th>${L(tr('Bitkiler', 'Plants'))}</th><th>${L(tr('16 hafta sonra paslı', 'Rusty after 16 weeks'))}</th></tr>${res ? `<tr><td><b>${L(tr('tek çeşit', 'one variety'))}</b></td><td>${n}</td><td>${res[0]}</td></tr><tr><td><b>${L(tr('karışık', 'mixed'))}</b></td><td>${n}</td><td>${res[1]}</td></tr>` : `<tr><td colspan="3">${L(tr('Henüz sonuç yok.', 'No results yet.'))}</td></tr>`}</table>`;
    b.querySelector('.stamps').innerHTML = [
      [st.phase !== 'pick' || !!res, tr('İlk paslı yaprak', 'First rusty leaf')], [st.phase === 'done' || !!res, tr('16 hafta rüzgâr', '16 weeks of wind')], [!!S.flags.rustDone, tr('İki tarla karşılaştırıldı', 'Both fields compared')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
  },
  async close() {
    this.pn = null;
    window.removeEventListener('keydown', this._key, true);
    if (Q.at('pas', 'wind') && G.S.flags.rustDone) {
      await ask('pas_spread');
      await UI.say('player', tr('Pası durduran ilaç değil, çeşitlilikti. Osman Amca’ya anlatayım.', 'What stopped the rust wasn’t a spray, it was variety. Let me tell Osman Amca.'));
      Q.adv('pas');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(88);
    b.fillStyle = MX.lin(b, 0, 0, 0, 70, [[0, '#BCD6E6'], [1, '#E8EEDC']]); b.fillRect(0, 0, 460, 70);
    // far hills and the poplar windbreak
    b.fillStyle = '#9CB08A'; b.beginPath(); b.moveTo(0, 58); for (let x = 0; x <= 460; x += 20) b.lineTo(x, 50 - Math.sin(x * 0.018) * 8 - Math.sin(x * 0.05) * 3); b.lineTo(460, 70); b.lineTo(0, 70); b.fill();
    for (let x = 8; x < 460; x += 26) { b.fillStyle = '#5E7A44'; b.beginPath(); b.ellipse(x, 48, 5, 16, 0, 0, TAU); b.fill(); b.fillStyle = 'rgba(255,255,230,0.18)'; b.beginPath(); b.ellipse(x - 1.6, 44, 2, 11, 0, 0, TAU); b.fill(); }
    b.fillStyle = MX.lin(b, 0, 62, 0, 300, [[0, '#8AA05A'], [1, '#6E8446']]); b.fillRect(0, 62, 460, 238);
    for (let k = 0; k < 500; k++) { b.fillStyle = `rgba(${60 + R() * 60 | 0},${90 + R() * 50 | 0},${30 + R() * 30 | 0},0.5)`; b.fillRect(R() * 460, 62 + R() * 238, 1, 2 + R() * 3); }
    for (const F of this.F) {
      b.fillStyle = 'rgba(30,24,10,0.3)'; U.rr(b, F.x - 4, F.y - 6, F.w + 12, F.h + 16, 6); b.fill();
      b.fillStyle = MX.lin(b, 0, F.y, 0, F.y + F.h, [[0, '#7A5E3E'], [1, '#5E4630']]); U.rr(b, F.x - 6, F.y - 10, F.w + 12, F.h + 16, 6); b.fill();
      for (let r = 0; r < this.ROWS; r++) { const y = F.y + (r + 0.5) * F.h / this.ROWS + 8; b.strokeStyle = 'rgba(40,28,16,0.45)'; b.lineWidth = 2; b.beginPath(); b.moveTo(F.x - 2, y); b.lineTo(F.x + F.w + 2, y); b.stroke(); b.strokeStyle = 'rgba(160,130,90,0.35)'; b.lineWidth = 1; b.beginPath(); b.moveTo(F.x - 2, y - 2); b.lineTo(F.x + F.w + 2, y - 2); b.stroke(); }
    }
    b.fillStyle = '#1B1A17'; b.font = '700 10px "Atkinson Hyperlegible Next", sans-serif'; b.textAlign = 'center'; b.textBaseline = 'middle';
    b.fillText(L(tr('Osman’ın tarlası · tek çeşit', 'Osman’s field · one variety')), this.F[0].x + this.F[0].w / 2, 70);
    b.fillText(L(tr('Nine’nin tarlası · karışık', 'Grandma’s field · mixed')), this.F[1].x + this.F[1].w / 2, 70);
    this._bc = c;
    return c;
  },
  // one wheat plant: a tuft of blades and an ear. Type 0 has a pale awnless ear, type 1 a red ear, type 2 black awns.
  // A rusty plant yellows and gets orange stripes; a resistant one that caught spores shows a few brown flecks.
  _plant(x, px, py, p, t, sway) {
    const s = p.inf >= 0 ? U.clamp((t - p.at) / 2.4, 0, 1) : 0;
    const g = s > 0 ? `rgb(${110 + s * 110 | 0},${154 + s * 40 | 0},${62 - s * 10 | 0})` : p.v === 2 ? '#5E8A3A' : p.v === 1 ? '#6A9440' : '#72A044';
    x.lineCap = 'round';
    for (let k = 0; k < 5; k++) {
      const a = (k - 2) * 0.42 + sway * 0.5, L1 = 12 + (k % 2) * 3;
      const ex = px + Math.sin(a) * L1, ey = py - Math.cos(a) * L1 * 0.85;
      x.strokeStyle = g; x.lineWidth = 2.2; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.sin(a) * L1 * 0.4, py - L1 * 0.6, ex + Math.sin(a) * 3, ey + 2); x.stroke();
      if (s > 0.15) for (let q = 1; q <= Math.round(s * 4); q++) { const f = q / 5; x.fillStyle = q % 2 ? '#E8862A' : '#F0A040'; x.fillRect(px + (ex - px) * f - 0.7, py + (ey - py) * f - 0.5, 1.5, 1.1); }
      if (p.fleck && k < p.fleck + 1) { const f = 0.55; x.fillStyle = '#5A3A1A'; x.beginPath(); x.arc(px + (ex - px) * f, py + (ey - py) * f, 0.9, 0, TAU); x.fill(); }
    }
    const hx = px + sway * 3, hy = py - 22;
    x.strokeStyle = s > 0.5 ? '#B8A050' : '#8AA84A'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px, py - 12, hx, hy + 4); x.stroke();
    const ear = p.v === 1 ? '#B8683A' : p.v === 2 ? '#C8B474' : s > 0.6 ? '#B89A50' : '#D8C070';
    x.fillStyle = ear; x.beginPath(); x.ellipse(hx, hy, 2.3, 5, sway * 0.3, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(60,40,20,0.5)'; x.lineWidth = 0.4; for (let q = -3; q <= 3; q += 2) { x.beginPath(); x.moveTo(hx - 2, hy + q); x.lineTo(hx + 2, hy + q - 1); x.stroke(); }
    if (p.v === 2) { x.strokeStyle = '#2A2016'; x.lineWidth = 0.6; for (let q = -2; q <= 2; q++) { x.beginPath(); x.moveTo(hx + q * 0.8, hy - 3); x.lineTo(hx + q * 2.2 + sway * 2, hy - 12); x.stroke(); } }
    // a rusty plant in its sporulating weeks gives off an orange haze
    if (s > 0.4 && p.inf < this.st.gen) { x.fillStyle = `rgba(232,134,42,${(0.16 * s).toFixed(2)})`; x.beginPath(); x.arc(px, py - 10, 11, 0, TAU); x.fill(); }
  },
  _ring(x, px, py, r, t) {
    const k = 0.5 + 0.5 * Math.sin(t * 5);
    x.strokeStyle = `rgba(242,199,68,${(0.55 + 0.4 * k).toFixed(2)})`; x.lineWidth = 3; x.beginPath(); x.arc(px, py, r + k * 4, 0, TAU); x.stroke();
  },
  draw() {
    const x = this.cv.getContext('2d'), st = this.st, t = st.t;
    x.setTransform(2, 0, 0, 2, 0, 0);
    x.drawImage(this._back(), 0, 0, 460, 300);
    const wind = st.phase === 'wind';
    // wind streaks across the sky
    x.strokeStyle = 'rgba(255,255,255,0.7)'; x.lineWidth = 1.4; x.lineCap = 'round';
    for (let k = 0; k < 7; k++) { const sp = wind ? 90 : 20, px = ((k * 71 + t * sp) % 520) - 40, py = 18 + (k * 23) % 34; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 14, py - 3, px + 28, py); x.stroke(); }
    x.fillStyle = '#1B1A17'; x.font = '700 11px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(L(tr('rüzgâr  ➜', 'wind  ➜')), 230, 16);
    // the plants, row by row so the ones in front overlap the ones behind
    for (let f = 0; f < 2; f++) {
      const P = st.fields[f];
      for (let r = 0; r < this.ROWS; r++) for (let c = 0; c < this.C; c++) {
        const [px, py] = this.cell(f, c, r), sway = Math.sin(t * (wind ? 3.2 : 1.4) + c * 0.7 + r * 0.4) * (wind ? 0.35 : 0.12) + (wind ? 0.2 : 0);
        this._plant(x, px, py + 8, P[this.idx(c, r)], t, sway);
      }
    }
    // spores in flight: little orange dots riding the wind in an arc
    for (const s of st.sp) {
      const k = s.t / s.dur, px = U.lerp(s.a[0], s.b[0], k), py = U.lerp(s.a[1], s.b[1], k) - Math.sin(k * Math.PI) * 14;
      x.fillStyle = 'rgba(232,134,42,0.35)'; x.beginPath(); x.arc(px - 3, py + 1, 2.2, 0, TAU); x.fill();
      x.fillStyle = '#F09A30'; x.beginPath(); x.arc(px, py, 1.8, 0, TAU); x.fill();
    }
    // where to tap: the hovered plant, or a pulsing ring once the player has waited a while
    if (st.phase === 'pick') {
      const k = st.hand && this.hit(...st.hand);
      if (k) for (let f = 0; f < 2; f++) { const [px, py] = this.cell(f, ...k); x.strokeStyle = 'rgba(242,199,68,0.9)'; x.lineWidth = 2; x.beginPath(); x.arc(px, py - 2, 13, 0, TAU); x.stroke(); }
      if (st.help) this._ring(x, ...this.cell(0, 1, 2), 14, t);
    }
    // the rusty leaf dropping at the start
    if (st.start && st.gen === 0) for (let f = 0; f < 2; f++) { const [px, py] = this.cell(f, ...st.start); x.fillStyle = '#E8862A'; x.save(); x.translate(px + 4, py - 16 + Math.min(1, st.gt) * 6); x.rotate(0.6); x.beginPath(); x.ellipse(0, 0, 7, 2.2, 0, 0, TAU); x.fill(); x.restore(); }
    // counters under each field
    for (let f = 0; f < 2; f++) {
      const F = this.F[f], n = this.count(f), done = st.phase === 'done';
      x.fillStyle = done ? (f ? '#3E6A3A' : '#A0322A') : '#1B1A17';
      x.font = `700 ${done ? 15 : 11}px "Courier Prime", monospace`; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(`${L(tr('paslı', 'rusty'))} ${n}/${this.C * this.ROWS}`, F.x + F.w / 2, F.y + F.h + 22);
    }
    x.fillStyle = 'rgba(27,26,23,0.8)'; x.font = '700 10px "Courier Prime", monospace'; x.textAlign = 'right';
    x.fillText(`${L(tr('hafta', 'week'))} ${st.gen * 2}/16`, 452, 16);
    // a small legend: which of Grandma's plants this rust can attack
    x.textAlign = 'left'; x.font = '700 8px "Atkinson Hyperlegible Next", sans-serif';
    [['#D8C070', tr('hassas', 'open to rust')], ['#B8683A', tr('dayanıklı', 'resistant')], ['#C8B474', tr('dayanıklı (kılçıklı)', 'resistant (awned)')]].forEach(([col, lab], i) => { const lx = 12 + i * 92; x.fillStyle = col; x.beginPath(); x.ellipse(lx, 290, 2.6, 5, 0, 0, TAU); x.fill(); if (i === 2) { x.strokeStyle = '#2A2016'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(lx, 286); x.lineTo(lx + 1, 280); x.stroke(); } x.fillStyle = '#1B1A17'; x.fillText(L(lab), lx + 6, 290); });
  },
};
