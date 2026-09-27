'use strict';
// Slide bench at the teahouse: make a wet mount of onion skin, then of cheek cells, the way it's done in every school
// lab: pull the sample onto the drop, lower the coverslip, draw the stain through with a paper towel, then find a
// nucleus in the eyepiece. Nothing here can go wrong: each step shows how it is done and why, and the slide always
// comes out clean. (Mehmet Dede's own bubbly slide in the case shows what air bubbles look like.)
const SLIDE = {
  SAMPLES: {
    onion: { name: tr('Soğan zarı', 'Onion skin'), stain: tr('Lugol (iyot)', 'Iodine'), ink: '#B07A2A', col: '#C49A52', shape: tr('Tuğla gibi dizili hücreler, kalın duvar', 'Cells laid like bricks, a thick wall') },
    cheek: { name: tr('Yanak hücreleri', 'Cheek cells'), stain: tr('Metilen mavisi', 'Methylene blue'), ink: '#2A58B0', col: '#5A7AC0', shape: tr('Yassı, düzensiz hücreler, ortada çekirdek', 'Flat, uneven cells, the nucleus in the middle') },
  },
  ORDER: ['onion', 'cheek'],
  LOWER: 30,    // °/s: the coverslip settles by itself once it is started
  HINGE: [176, 128], SLIP: 46, EYE: [380, 86, 76],

  open() {
    const S = G.S;
    const run = S.slide || (S.slide = { seed: 1 + Math.floor(Math.random() * 1e5), done: {} });
    this.st = { run, t: 0, hold: false, holdT: 0, wicking: false, drag: null, p: null };
    this.fresh(this.ORDER.find(s => !(run.done[s] && run.done[s].good)) || 'onion');
    const body = h('div', 'kit rig ferm slide');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Örnek', 'Sample'))}</label>
        <div class="sl-s">${this.ORDER.map(s => `<button data-s="${s}">${U.esc(L(this.SAMPLES[s].name))}</button>`).join('')}</div>
        <button class="sl-down">${L(tr('Lameli indir', 'Lower the coverslip'))} ▼</button>
        <button class="sl-drop">${L(tr('Boyayı damlat', 'Add the stain'))} 💧</button>
        <button class="sl-wick">${L(tr('Kurutma kâğıdı', 'Paper towel'))} ▭</button>
        <button class="sl-redo">${L(tr('Yeniden hazırla', 'Start again'))} ↺</button>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div>
      <p class="kit-msg"></p>`;
    body.querySelectorAll('.sl-s button').forEach(b => b.onclick = () => { if (b.dataset.s !== this.st.p.sp) { this.fresh(b.dataset.s); AU.sfx('click'); } });
    const hold = (el, on, off) => {
      el.addEventListener('pointerdown', e => { e.preventDefault(); on(); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) el.addEventListener(ev, off);
    };
    // one tap each: a smart board can't be held down reliably
    body.querySelector('.sl-down').onclick = () => { if (this.st.p.phase === 'cover') this.st.hold = true; };
    body.querySelector('.sl-wick').onclick = () => this.wickOn();
    body.querySelector('.sl-drop').onclick = () => this.drop();
    body.querySelector('.sl-redo').onclick = () => { this.fresh(this.st.p.sp); AU.sfx('click'); };
    this.body = body; this.cv = body.querySelector('canvas');
    const at = e => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300]; };
    this.cv.addEventListener('pointerdown', e => { const [x, y] = at(e); this.press(x, y); });
    this.cv.addEventListener('pointermove', e => { if (this.st.drag) { const [x, y] = at(e); this.move(x, y); } });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) this.cv.addEventListener(ev, () => this.release());
    // the down arrow or space lowers the coverslip too; captured so it doesn't walk the player about
    this._key = e => {
      if (!this.pn || !(e.code === 'ArrowDown' || e.code === 'Space') || this.st.p.phase !== 'cover') return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.type === 'keydown') this.st.hold = true;
    };
    window.addEventListener('keydown', this._key, true); window.addEventListener('keyup', this._key, true);
    this.pn = UI.panel({ title: tr('Preparat masası · Hücreyi görmek', 'Slide bench · Seeing a cell'), code: 'BİY.9.1.4', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.table(); this.loop();
  },
  fresh(sp) {
    this.st.p = { sp, phase: 'pick', got: 0, v: 0, vmax: 0, thick: false, a: 45, pend: 0, lead: 0, bubbles: [], dropped: false, s: 0, over: 0, dry: false, found: false, tapBub: 0 };
    this.st.hold = false; this.st.wicking = false; this.st.drag = null; this._vc = null;
    if (this.body) { this._msg(this.hint()); this._sync(); }
  },
  hint() {
    const p = this.st.p;
    return p.phase === 'pick' ? (p.sp === 'onion' ? tr('Soğan yaprağının içindeki ince zarı cımbızla tut ve yavaşça lamın üstündeki su damlasına çek.', 'Grip the thin skin inside the onion leaf with the forceps and pull it slowly over to the drop of water on the slide.') : tr('Temiz bir kürdanla yanağının içini hafifçe sıyır, sonra kürdanı yavaşça lamın üstündeki damlaya sür.', 'Scrape the inside of your cheek gently with a clean toothpick, then move it slowly over to the drop on the slide.'))
      : p.phase === 'cover' ? tr('“Lameli indir”e bas. Lamel bir kenarından damlaya dayanır ve yavaşça iner; böylece altında hava kalmaz.', 'Press “Lower the coverslip”. It rests on the drop by one edge and goes down slowly, so no air is trapped underneath.')
      : p.phase === 'stain' ? tr('Önce “Boyayı damlat”, sonra “Kurutma kâğıdı”na bas: kâğıt suyu çeker, boya lamelin altından geçer.', 'Press “Add the stain”, then “Paper towel”: the paper draws the water off and pulls the stain under the coverslip.')
      : tr('Mikroskopta bir hücre çekirdeği bul ve dokun.', 'Find a cell nucleus in the microscope and tap it.');
  },

  // ---------------------------------------------------------------- 1 · pull the sample onto the slide
  press(x, y) {
    const p = this.st.p;
    if (p.phase === 'pick' && x < 130 && y > 60 && y < 160) { this.st.drag = { x, y, t: performance.now() / 1000, kind: 'pick' }; p.v = 0; p.vmax = 0; AU.sfx('click'); return; }
    // tapping the slide itself does the next thing too
    if (p.phase === 'pick' && y < 172) { this.pick(0); return; }
    if (p.phase === 'cover' && y < 172) { this.st.hold = true; return; }
    if (p.phase === 'stain' && y < 172 && x < 330) { if (!p.dropped) this.drop(); else this.wickOn(); return; }
    const [ex, ey, er] = this.EYE;
    if (p.phase === 'view' && Math.hypot(x - ex, y - ey) < er) this.tapView((x - ex) / er * 150, (y - ey) / er * 150);
  },
  move(x, y) {
    const d = this.st.drag, p = this.st.p;
    if (d.kind === 'pick') {
      const now = performance.now() / 1000, dt = Math.max(0.012, now - d.t), v = Math.hypot(x - d.x, y - d.y) / dt;
      p.v = p.v * 0.6 + v * 0.4; p.vmax = Math.max(p.vmax, p.v);
      d.x = x; d.y = y; d.t = now;
      p.got = U.clamp((x - 70) / 90, p.got, 1);
      if (p.got >= 1) this.pick(p.vmax);
    }
  },
  release() {
    const d = this.st.drag; this.st.drag = null;
    // let go anywhere and the sample still lands in the drop
    if (d && d.kind === 'pick' && this.st.p.phase === 'pick') this.pick(0);
  },
  // the sample lands in the drop as a single thin layer, however it was pulled
  pick(speed) {
    const p = this.st.p;
    if (p.phase !== 'pick') return;
    p.vmax = speed || 0; p.thick = false; p.got = 1; p.phase = 'cover'; this.st.drag = null;
    AU.sfx('pen');
    this._msg(tr('Güzel: incecik tek bir katman damlanın içinde. Işık ancak ince bir katmandan geçer. Şimdi lamel.', 'Nice: a single, very thin layer is in the drop. Light only gets through a thin layer. Now the coverslip.'));
    this._sync();
  },

  // ---------------------------------------------------------------- 2 · lower the coverslip slowly
  push(da) { const p = this.st.p; if (p.phase !== 'cover') return; da = U.clamp(da, 0, p.a); p.a -= da; p.pend += da; },
  slipEnd() { const [hx, hy] = this.HINGE, a = this.st.p.a * Math.PI / 180; return [hx + Math.cos(a) * this.SLIP, hy - Math.sin(a) * this.SLIP]; },
  _bubble(p, f) { const R = MX.rng(this.st.run.seed + p.bubbles.length * 17 + (p.sp === 'cheek' ? 5 : 0)); p.bubbles.push({ f: U.clamp(f, 0.05, 0.98), r: 0.6 + R() * 0.4, fx: R(), fy: R() }); },

  // ---------------------------------------------------------------- 3 · stain, drawn through with a paper towel
  drop() {
    const p = this.st.p;
    if (p.phase !== 'stain' || p.dropped) return;
    p.dropped = true; AU.sfx('bubble');
    this._msg(tr(`${L(this.SAMPLES[p.sp].stain)} lamelin kenarında. Şimdi öbür kenara kurutma kâğıdını tut.`, `The ${L(this.SAMPLES[p.sp].stain).toLowerCase()} is at the edge of the coverslip. Now hold the paper towel to the other edge.`));
    this._sync();
  },
  wickOn() {
    const p = this.st.p;
    if (p.phase !== 'stain') return;
    if (!p.dropped) { this._msg(tr('Önce boyayı damlat; yoksa kâğıt yalnızca suyu çeker.', 'Add the stain first, or the paper just draws off the water.')); return; }
    this.st.wicking = true;
  },
  // the paper draws the stain through, then comes away by itself
  wick(dt) {
    const p = this.st.p;
    if (p.phase !== 'stain' || !p.dropped) return;
    p.s = Math.min(1, p.s + dt * 1.0);
    if (p.s >= 1) this.unwick();
  },
  unwick() { this.st.wicking = false; const p = this.st.p; if (p.phase === 'stain' && p.s >= 1) { this.view(); AU.sfx('chime'); this._msg(this.hint()); } },
  view() { this.st.p.phase = 'view'; this._vc = null; this._sync(); },

  // ---------------------------------------------------------------- 4 · the eyepiece: find a nucleus
  field() {
    // the student's own bubbles, dropped into the field of view where the prep trapped them
    const p = this.st.p, cheek = p.sp === 'cheek';
    return { cheek, thick: p.thick, bubbles: p.bubbles.map(b => ({ x: -110 + b.fx * 220, y: -110 + b.fy * 220, r: 12 + b.r * 16 })) };
  },
  tapView(x, y) {
    const p = this.st.p;
    if (p.phase !== 'view') return;
    const f = this.field();
    // a generous target for a finger on a smart board; after two misses the nuclei are ringed
    const n = CELLS.layout(f.cheek).find(c => Math.hypot(x - c.nx, y - c.ny) < c.nr + 14);
    if (!n) { AU.sfx('click'); p.tapBub++; this._msg(tr('Orada çekirdek yok. Boyanmış, koyu, küçük yuvarlağı ara.' + (p.tapBub >= 2 ? ' Halkalı olanlardan birine dokun.' : ''), 'No nucleus there. Look for the small, dark, stained round body.' + (p.tapBub >= 2 ? ' Tap one of the ringed ones.' : ''))); return 'miss'; }
    p.found = true; p.phase = 'done'; this.judge();
    return 'nucleus';
  },
  tapNucleus() {
    const f = this.field(), n = CELLS.layout(f.cheek).find(c => Math.hypot(c.nx, c.ny) < 120 && !f.bubbles.some(b => Math.hypot(c.nx - b.x, c.ny - b.y) < b.r + 8));
    return n ? this.tapView(n.nx, n.ny) : null;
  },
  judge() {
    const p = this.st.p, run = this.st.run, good = true;
    run.done[p.sp] = { bubbles: 0, thick: false, dry: false, good };
    const name = L(this.SAMPLES[p.sp].name);
    AU.sfx('pen');
    const next = this.ORDER.find(s => !(run.done[s] && run.done[s].good));
    this._msg(next ? tr(`${name}: çekirdek görünüyor! Şimdi ${L(this.SAMPLES[next].name).toLocaleLowerCase('tr-TR')}.`, `${name}: the nucleus shows! Now the ${L(this.SAMPLES[next].name).toLowerCase()}.`) : tr(`${name}: çekirdek görünüyor!`, `${name}: the nucleus shows!`));
    if (next) setTimeout(() => { if (this.pn && this.st.p.phase === 'done' && this.st.p.sp === p.sp) this.fresh(next); }, 1600);
    this._sync(); this.table(); G.save();
  },

  // ---------------------------------------------------------------- the loop, the table, the record
  step(dt) {
    const st = this.st, p = st.p;
    st.t += dt;
    if (p.phase === 'cover') {
      // once started the coverslip settles slowly by itself, the water spreading ahead of it: no air is trapped
      if (st.hold) this.push(this.LOWER * dt);
      p.pend = 0; p.lead = 0;
      if (p.a <= 0.01) {
        p.a = 0; p.phase = 'stain'; st.hold = false;
        this._msg(tr('Lamel yavaşça indi, altında hiç hava kalmadı. Şimdi boya.', 'The coverslip went down slowly and no air was trapped. Now the stain.'));
        this._sync();
      }
    }
    if (p.phase === 'stain' && st.wicking) this.wick(dt);
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
    const b = this.body, st = this.st, p = st.p, run = st.run;
    if (!b) return;
    b.querySelectorAll('.sl-s button').forEach(el => { const s = el.dataset.s, r = run.done[s]; el.classList.toggle('on', p.sp === s); el.classList.toggle('done', !!(r && r.good)); });
    b.querySelector('.sl-down').disabled = p.phase !== 'cover';
    b.querySelector('.sl-drop').disabled = p.phase !== 'stain' || p.dropped;
    b.querySelector('.sl-wick').disabled = p.phase !== 'stain' || !p.dropped;
    // the button for the next thing to do glows
    const nextBtn = p.phase === 'cover' ? '.sl-down' : p.phase === 'stain' ? (p.dropped ? '.sl-wick' : '.sl-drop') : null;
    for (const s of ['.sl-down', '.sl-drop', '.sl-wick']) b.querySelector(s).classList.toggle('next', s === nextBtn);
  },
  analyse() {
    const run = this.st.run, good = this.ORDER.filter(s => run.done[s] && run.done[s].good);
    return { good, n: good.length, done: good.length === this.ORDER.length };
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, run = this.st.run, yes = L(tr('evet', 'yes')), no = L(tr('hayır', 'no'));
    const rows = this.ORDER.filter(s => run.done[s]).map(s => `<tr><td><b>${U.esc(L(this.SAMPLES[s].name))}</b></td><td>${U.esc(L(this.SAMPLES[s].stain))}</td><td>${L(this.SAMPLES[s].shape)}</td><td>✓</td></tr>`).join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Örnek', 'Sample'))}</th><th>${L(tr('Boya', 'Stain'))}</th><th>${L(tr('Ne gördün?', 'What did you see?'))}</th><th>${L(tr('Çekirdek', 'Nucleus'))}</th></tr>${rows || `<tr><td colspan="4">${L(tr('Henüz preparat yok.', 'No slides yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [!!(run.done.onion && run.done.onion.good), tr('Soğan zarı', 'Onion skin')], [!!(run.done.cheek && run.done.cheek.good), tr('Yanak hücreleri', 'Cheek cells')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.done && !S.flags.slideDone) {
      S.flags.slideDone = true;
      S.journal.exps.push({ title: tr('Preparat hazırlama', 'Making a wet mount'), code: 'BİY.9.1.4', t: Date.now(),
        head: [tr('Örnek', 'Sample'), tr('Boya', 'Stain'), tr('Ne görüldü', 'What was seen'), tr('Çekirdek', 'Nucleus')],
        rows: this.ORDER.map(s => [this.SAMPLES[s].name, this.SAMPLES[s].stain, this.SAMPLES[s].shape, tr('görüldü', 'seen')]),
        note: tr('Soğan zarında dikdörtgen hücreler, kalın bir hücre duvarı, kenara itilmiş bir çekirdek ve koca bir koful vardı; kloroplast yoktu. Yanak hücreleri yassı ve düzensizdi, yalnızca zarla çevriliydi, çekirdekleri ortadaydı. İkisi de hücrelerden yapılmış.', 'The onion skin had rectangular cells with a thick cell wall, a nucleus pushed to one side and a big vacuole; there were no chloroplasts. The cheek cells were flat and irregular, bounded only by a membrane, with the nucleus in the middle. Both are made of cells.') });
      this._msg(tr('İki preparat hazır! Sonuçlar defterinde. Mehmet Dede’ye gösterme zamanı.', 'Both slides are ready! The results are in your journal. Time to show Mehmet Dede.'));
      if (Q.at('hucre', 'slide')) { UI.stamp(L(tr('PREPARAT', 'SLIDES'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  async close() {
    this.pn = null;
    window.removeEventListener('keydown', this._key, true); window.removeEventListener('keyup', this._key, true);
    if (this.st) { this.st.hold = false; this.st.wicking = false; this.st.drag = null; }
    if (Q.at('hucre', 'slide') && G.S.flags.slideDone) {
      await ask('hucre_diff');
      await UI.say('player', tr('Işık mikroskobu bu kadarını gösteriyor. Mehmet Dede “hücrenin içi boş bir torba” diyecek; Nine’nin elektron mikroskobu fotoğraflarına merceğimle bakayım.', 'The light microscope shows this much. Mehmet Dede will say “a cell is an empty bag”; let me look at Grandma’s electron microscope pictures with my lens.'));
      Q.adv('hucre');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc && this._bcLang === I18N.lang) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(77);
    // the teahouse table: dark wood, a glass of tea left at the corner
    b.fillStyle = '#6A4A30'; b.fillRect(0, 0, 460, 172);
    for (let k = 0; k < 30; k++) { b.strokeStyle = `rgba(30,18,10,${(0.1 + R() * 0.15).toFixed(2)})`; b.lineWidth = 0.6 + R(); const y = R() * 172; b.beginPath(); b.moveTo(0, y); b.bezierCurveTo(150, y + (R() - 0.5) * 10, 300, y + (R() - 0.5) * 10, 460, y + (R() - 0.5) * 8); b.stroke(); }
    b.fillStyle = 'rgba(0,0,0,0.25)'; b.beginPath(); b.ellipse(22, 38, 12, 4, 0, 0, TAU); b.fill();
    b.fillStyle = 'rgba(190,60,30,0.7)'; b.beginPath(); b.moveTo(13, 12); b.lineTo(31, 12); b.lineTo(28, 36); b.lineTo(16, 36); b.closePath(); b.fill();
    b.strokeStyle = 'rgba(255,255,255,0.55)'; b.lineWidth = 1; b.stroke();
    // the eyepiece's dark surround
    const [ex, ey, er] = this.EYE;
    b.fillStyle = '#1A1612'; b.beginPath(); b.arc(ex, ey, er + 8, 0, TAU); b.fill();
    b.strokeStyle = '#3A342E'; b.lineWidth = 3; b.beginPath(); b.arc(ex, ey, er + 6, 0, TAU); b.stroke();
    // the lower page
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5; for (let y = 186; y < 300; y += 12) { b.beginPath(); b.moveTo(8, y); b.lineTo(452, y); b.stroke(); }
    this._bc = c; this._bcLang = I18N.lang;
    return c;
  },
  // the eyepiece view is painted once per prep result, then only blitted
  _view() {
    const f = this.field(), sig = JSON.stringify(f);
    if (this._vc && this._vcSig === sig) return this._vc;
    const c = U.canvas(304, 304), o = c.getContext('2d');
    o.translate(152, 152); o.scale(152 / 150, 152 / 150);
    CELLS.paint(o, f);
    this._vc = c; this._vcSig = sig;
    return c;
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, p = st.p, t = st.t, S = this.SAMPLES[p.sp];
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // the source: half an onion with its skin, or a cup of clean toothpicks
    if (p.sp === 'onion') {
      x.fillStyle = '#7A2E4E'; x.beginPath(); x.ellipse(52, 118, 40, 34, 0, Math.PI, TAU); x.fill();
      for (let k = 0; k < 5; k++) { x.fillStyle = k % 2 ? '#F4E6EC' : '#EAD6E0'; x.beginPath(); x.ellipse(52, 118, 37 - k * 7, 31 - k * 6, 0, Math.PI, TAU); x.fill(); }
      x.fillStyle = '#5A3A2A'; x.fillRect(10, 118, 84, 4);
    } else {
      x.fillStyle = '#E8E0D0'; x.fillRect(40, 96, 26, 30); x.strokeStyle = '#8A8070'; x.lineWidth = 0.8; x.strokeRect(40, 96, 26, 30);
      for (let k = 0; k < 7; k++) { x.strokeStyle = '#D8BC84'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(44 + k * 3, 98); x.lineTo(42 + k * 3.4, 80 + (k % 3) * 3); x.stroke(); }
    }
    // the slide, side on: a glass bar on the table, the drop, the sample, the coverslip on its hinge
    const [hx, hy] = this.HINGE;
    x.fillStyle = 'rgba(200,226,232,0.8)'; x.fillRect(136, hy, 140, 5); x.strokeStyle = 'rgba(90,120,130,0.9)'; x.lineWidth = 0.7; x.strokeRect(136, hy, 140, 5);
    const stained = p.phase === 'view' || p.phase === 'done' ? 1 : p.phase === 'stain' ? p.s : 0;
    const waterEnd = hx + this.SLIP * (p.phase === 'pick' ? 0.55 : Math.min(1, 0.55 + 0.45 * (1 - p.a / 45) + (p.phase !== 'cover' ? 1 : 0)));
    x.fillStyle = 'rgba(150,200,226,0.65)'; x.beginPath(); x.moveTo(hx - 4, hy); x.quadraticCurveTo((hx + waterEnd) / 2, hy - 8 * (p.phase === 'pick' ? 1 : p.a / 45 + 0.2), waterEnd, hy); x.closePath(); x.fill();
    if (stained > 0) { x.fillStyle = U.rgba(S.ink, 0.55); x.fillRect(hx, hy - 2.5, (this.SLIP) * stained, 2.5); }
    // the sample: follows the forceps or toothpick while it is being pulled, then lies in the drop
    if (p.phase === 'pick') {
      const d = st.drag, sx = d ? d.x : 70 + p.got * 90, sy = d ? d.y : 112;
      x.fillStyle = p.sp === 'onion' ? 'rgba(250,250,255,0.75)' : 'rgba(230,220,200,0.9)'; x.beginPath(); x.ellipse(sx, sy, p.sp === 'onion' ? 12 : 4, 3, -0.3, 0, TAU); x.fill();
      x.strokeStyle = p.sp === 'onion' ? '#B8BCC0' : '#D8BC84'; x.lineWidth = p.sp === 'onion' ? 1.6 : 1.4; x.beginPath(); x.moveTo(sx + 4, sy - 2); x.lineTo(sx + 30, sy - 40); x.stroke();
      if (!d) { x.fillStyle = 'rgba(255,240,160,0.9)'; x.font = '700 10px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText('⇢', 110 + Math.sin(t * 4) * 6, 100); }
    } else {
      x.fillStyle = p.thick ? 'rgba(220,210,200,0.95)' : 'rgba(250,250,255,0.8)'; x.fillRect(hx + 8, hy - (p.thick ? 3 : 1.4), 26, p.thick ? 3 : 1.4);
    }
    // the coverslip on its hinge, the water front under it, trapped bubbles
    if (p.phase !== 'pick') {
      const [sx, sy] = this.slipEnd();
      x.strokeStyle = 'rgba(210,236,244,0.95)'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(hx, hy - 0.5); x.lineTo(sx, sy); x.stroke();
      x.strokeStyle = 'rgba(90,120,130,0.9)'; x.lineWidth = 0.5; x.stroke();
      for (const b of p.bubbles) { const bx = hx + b.f * this.SLIP, by = hy - 1.6 - Math.max(0, Math.tan(p.a * Math.PI / 180) * b.f * this.SLIP * 0.5); x.strokeStyle = '#1A1A18'; x.lineWidth = 0.9; x.fillStyle = 'rgba(255,255,255,0.8)'; x.beginPath(); x.arc(bx, by, 1.2 + b.r * 1.4, 0, TAU); x.fill(); x.stroke(); }
      if (p.phase === 'cover') {
        x.fillStyle = 'rgba(255,240,160,0.9)'; x.beginPath(); x.arc(sx, sy, 4 + Math.sin(t * 5), 0, TAU); x.fill();
      }
    }
    // the stain dropper and the paper towel
    if (p.phase === 'stain') {
      x.fillStyle = '#2A2620'; x.fillRect(hx - 8, 60, 8, 22); x.fillStyle = '#C8C0B0'; x.beginPath(); x.ellipse(hx - 4, 58, 5, 4, 0, 0, TAU); x.fill();
      if (p.dropped) { x.fillStyle = U.rgba(S.ink, 0.8); x.beginPath(); x.arc(hx - 2, hy - 3, 3, 0, TAU); x.fill(); }
      const tw = st.wicking ? 0 : 10;
      x.fillStyle = '#F4F2EC'; x.fillRect(hx + this.SLIP + 4 + tw, hy - 16, 30, 22); x.strokeStyle = '#B8B2A4'; x.lineWidth = 0.6; x.strokeRect(hx + this.SLIP + 4 + tw, hy - 16, 30, 22);
      if (st.wicking) { x.fillStyle = U.rgba(S.ink, 0.35 * p.s); x.fillRect(hx + this.SLIP + 4, hy - 4, 10 * p.s, 10); }
      x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(150, 20, 110, 8); x.fillStyle = U.rgba(S.ink, 0.9); x.fillRect(150, 20, 110 * p.s, 8);
    }
    // the eyepiece
    const [ex, ey, er] = this.EYE;
    x.save(); x.beginPath(); x.arc(ex, ey, er, 0, TAU); x.clip();
    if (p.phase === 'view' || p.phase === 'done') {
      x.drawImage(this._view(), ex - er, ey - er, er * 2, er * 2);
      // after two misses the nuclei are ringed, pulsing, so nobody is left searching
      if (p.phase === 'view' && p.tapBub >= 2) for (const c of CELLS.layout(p.sp === 'cheek')) {
        if (Math.hypot(c.nx, c.ny) > 140) continue;
        x.strokeStyle = `rgba(255,220,80,${(0.6 + 0.4 * Math.sin(t * 5)).toFixed(2)})`; x.lineWidth = 1.4;
        x.beginPath(); x.arc(ex + c.nx / 150 * er, ey + c.ny / 150 * er, (c.nr + 6) / 150 * er, 0, TAU); x.stroke();
      }
    }
    else { x.fillStyle = '#2A2622'; x.fillRect(ex - er, ey - er, er * 2, er * 2); x.fillStyle = 'rgba(244,238,221,0.5)'; x.font = '700 30px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText('?', ex, ey + 10); }
    const g = x.createRadialGradient(ex, ey, er * 0.82, ex, ey, er); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.6)'); x.fillStyle = g; x.fillRect(ex - er, ey - er, er * 2, er * 2);
    x.restore();
    // lower page: the four steps, the current one lit
    const steps = [tr('Örneği al', 'Take the sample'), tr('Lamel', 'Coverslip'), tr('Boya', 'Stain'), tr('Çekirdek', 'Nucleus')], cur = ['pick', 'cover', 'stain', 'view', 'done'].indexOf(p.phase);
    x.font = '700 10px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left';
    x.fillStyle = '#1B1A17'; x.fillText(L(S.name) + ' · ' + L(S.stain), 12, 190);
    steps.forEach((s, i) => {
      const bx = 12 + i * 110, on = i === cur, ok = i < cur;
      x.fillStyle = on ? U.rgba(S.ink, 0.9) : ok ? 'rgba(90,150,90,0.8)' : 'rgba(0,0,0,0.12)'; U.rr(x, bx, 200, 100, 22, 5); x.fill();
      x.fillStyle = on || ok ? '#F4EEDD' : '#4A4640'; x.fillText((ok ? '✓ ' : (i + 1) + ' · ') + L(s), bx + 8, 215);
    });
  },
};
