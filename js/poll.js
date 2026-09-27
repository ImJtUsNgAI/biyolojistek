'use strict';
// Hand-pollination table in Fatma Teyze's squash patch. The way seed savers keep a squash variety pure:
// in the evening close a female bud and a male bud of the same variety so no bee can get in; next morning pick the
// male flower, strip its petals, brush its pollen onto the female flower's stigma, close the flower again and tag it.
// Then a summer passes and the seeds of the tagged squash and of an open-pollinated one are sown side by side.
// Nothing here can fail: a wrong tap only earns a hint, and every step can also be done with the one big button.
const POLL = {
  // bud heads in the 460 × 300 scene, and where each stalk leaves the vine
  BUDS: {
    M1: { at: [70, 136], root: [84, 232], male: true },
    F1: { at: [168, 170], root: [140, 232], male: false, ov: [[140, 214], [160, 188]] },
    M2: { at: [252, 124], root: [248, 230], male: true },
    F2: { at: [338, 172], root: [312, 230], male: false, ov: [[312, 212], [330, 190]] },
    M3: { at: [412, 138], root: [424, 230], male: true },
  },
  BIG: 2.6,                               // the clipped female is drawn this much larger while it is open for brushing
  ST: 1.7,                                // and its stigma larger still, so the pads are big enough to rub on a board
  // the stigma's three pads at brushing size, relative to the flower's head (they match SQUASH.stigma's layout)
  get LOBES() { const r = 22 * this.BIG * this.ST; return [0, 1, 2].map(i => { const a = -Math.PI / 2 + i * TAU / 3; return [Math.cos(a) * r * 0.13, 2 - r * 0.12 + Math.sin(a) * r * 0.1]; }); },

  open() {
    const S = G.S;
    const run = S.poll || (S.poll = { seed: 1 + Math.floor(Math.random() * 1e5), done: 0 });
    this.st = { run, phase: 'eve', closed: {}, cov: [0, 0, 0], bees: [] };
    const body = h('div', 'kit rig ferm poll');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <button class="pl-go"></button>
        <p class="fm-const">${L(tr('Ata kabağı ile komşunun süs kabağı aynı türden: arı birinin polenini öbürüne taşıyabilir. Tohumluk kabağı ancak böyle saf tutarsın.', 'The heirloom squash and the neighbour’s gourds are one species: a bee can carry pollen from one to the other. This is how you keep a seed squash pure.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div>
      <p class="kit-msg"></p>`;
    const go = body.querySelector('.pl-go');
    go.addEventListener('pointerdown', e => { e.preventDefault(); if (this.st.phase === 'brush') this.st.holding = true; else this.act(); });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) go.addEventListener(ev, () => { this.st.holding = false; });
    this.body = body; this.cv = body.querySelector('canvas');
    this.fresh(run);
    const at = e => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300]; };
    this.cv.addEventListener('pointerdown', e => { const [x, y] = at(e); this.st.drag = true; this.tap(x, y); });
    this.cv.addEventListener('pointermove', e => { const [x, y] = at(e); this.st.hand = [x, y]; if (this.st.drag) this.rub(x, y); });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) this.cv.addEventListener(ev, () => { this.st.drag = false; });
    // space or enter does the next step (held down while brushing); captured so the player doesn't walk off
    this._key = e => {
      if (!this.pn || !['Space', 'Enter'].includes(e.code)) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.type === 'keydown' && !e.repeat) { if (this.st.phase === 'brush') this.st.holding = true; else this.act(); }
      else if (e.type === 'keyup') this.st.holding = false;
    };
    window.addEventListener('keydown', this._key, true); window.addEventListener('keyup', this._key, true);
    this.pn = UI.panel({ title: tr('Tozlama masası · Ata kabağını saf tutmak', 'Pollination table · Keeping the heirloom squash pure'), code: 'BİY.12.1.11', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.loop();
  },
  fresh(run) {
    run = run || this.st.run;
    this.st = { run, phase: 'eve', t: 0, pt: 0, closed: {}, picked: false, opened: false, cov: [0, 0, 0], tagged: false, grow: 0, year: 0, anim: null, holding: false, drag: false, hand: null, wrong: 0, help: false, idle: 0, bees: [] };
    this._msg(tr('Akşam oldu. Yarın sabah açılacak iki tomurcuğu şimdi kapat ki içine arı giremesin: bir dişi, bir erkek. Tomurcuğa dokun, mandal takılsın.', 'Evening. Close two buds that will open tomorrow, so no bee can get in: one female, one male. Tap a bud to clip it shut.'));
    this._sync();
  },

  // ---------------------------------------------------------------- the steps
  ready() { const c = this.st.closed; return !!(c.F1 || c.F2) && !!(c.M1 || c.M2 || c.M3); },
  // the female that was clipped (the first one, if both were)
  fem() { return this.st.closed.F1 || !this.st.closed.F2 ? 'F1' : 'F2'; },
  male() { return ['M1', 'M2', 'M3'].find(k => this.st.closed[k]); },
  near(x, y, r = 30) {
    let best = null, bd = r;
    for (const k in this.BUDS) { const [bx, by] = this.BUDS[k].at, d = Math.hypot(x - bx, y - by); if (d < bd) { bd = d; best = k; } }
    return best;
  },
  tap(x, y) {
    const st = this.st, k = this.near(x, y, st.phase === 'brush' ? 60 : 32);
    st.idle = 0;
    if (st.anim) return;
    if (st.phase === 'eve') {
      if (!k) return;
      if (st.closed[k]) { this._msg(tr('Bu tomurcuk zaten mandallı.', 'This bud is already clipped.')); return; }
      const b = this.BUDS[k];
      if (!b.male && (st.closed.F1 || st.closed.F2)) { this._msg(tr('Bir dişi tomurcuk yeter. Şimdi bir erkek tomurcuk kapat: uzun ince saplı olanlar erkek.', 'One female bud is enough. Now close a male bud: the ones on long thin stalks are male.')); return; }
      st.closed[k] = true; AU.sfx('click');
      if (b.male && !(st.closed.F1 || st.closed.F2)) {
        st.wrong++;
        if (st.wrong >= 2) st.help = true;
        this._msg(st.wrong >= 2 ? tr('Bunlar erkek tomurcuk. Dişi tomurcuğun altında minik bir kabak var: sarı halkayla gösterdim.', 'These are male buds. A female bud has a tiny squash underneath it: the yellow rings show you where.') : tr('Güzel, bu bir erkek tomurcuk. Şimdi bir dişi tomurcuk bul: altında minik bir kabak var.', 'Good, that’s a male bud. Now find a female bud: it has a tiny squash underneath.'));
      } else if (this.ready()) this._msg(tr('İkisi de kapalı. “Sabahı bekle” düğmesine bas.', 'Both are closed. Press “Wait for morning”.'));
      else this._msg(tr('Dişi tomurcuk kapandı. Şimdi bir erkek tomurcuk kapat: uzun ince saplı olanlar erkek.', 'The female bud is closed. Now close a male bud: the ones on long thin stalks are male.'));
      this._sync();
      return;
    }
    if (st.phase === 'morn' && k === this.male()) return this.act();
    if (st.phase === 'morn' && k) { this._msg(tr('Mandallı erkek çiçeği kopar: onun polenine hiçbir arı dokunmadı.', 'Pick the clipped male flower: no bee has touched its pollen.')); return; }
    if ((st.phase === 'open' || st.phase === 'close') && k === this.fem()) return this.act();
    if (st.phase === 'brush') this.rub(x, y);
  },
  // brushing: the anther column rubbed over a pad dusts it yellow
  rub(x, y) {
    const st = this.st; if (st.phase !== 'brush') return;
    const [fx, fy] = this.BUDS[this.fem()].at;
    this.LOBES.forEach(([lx, ly], i) => { if (Math.hypot(x - (fx + lx), y - (fy + ly)) < 18) st.cov[i] = Math.min(1, st.cov[i] + 0.06); });
    this._checkBrush();
  },
  _checkBrush() {
    const st = this.st;
    if (st.phase === 'brush' && st.cov.every(c => c >= 1)) {
      st.phase = 'close'; st.holding = false; AU.sfx('chime');
      this._msg(tr('Tepe polenle kaplandı. Çiçeği hemen yeniden kapat ve sapına etiket as: hangi kabağın tohumu saklanacak, belli olsun.', 'The stigma is covered in pollen. Close the flower again straight away and hang a tag on its stalk, so everyone knows which squash to keep seed from.'));
      this._sync();
    }
  },
  // the one big button: whatever the next step is
  act() {
    const st = this.st;
    st.idle = 0;
    if (st.anim) return;
    switch (st.phase) {
      case 'eve':
        if (!this.ready()) { st.help = true; this._msg(tr('Önce iki tomurcuk kapat: bir dişi (altında minik kabak var) ve bir erkek (uzun ince saplı). Sarı halkalar yol gösteriyor.', 'First close two buds: a female (it has a tiny squash underneath) and a male (on a long thin stalk). The yellow rings show the way.')); return; }
        st.phase = 'night'; st.pt = 0; AU.sfx('page');
        this._msg(tr('Gece geçiyor… Sabah mandalsız çiçekler açılacak ve arılar gelecek.', 'The night passes… In the morning the unclipped flowers will open and the bees will come.'));
        break;
      case 'morn':
        st.anim = { k: 'pick', t: 0, dur: 1.1 }; AU.sfx('pen');
        break;
      case 'open':
        st.anim = { k: 'open', t: 0, dur: 0.9 }; AU.sfx('click');
        break;
      case 'brush':
        st.cov = st.cov.map(c => Math.min(1, c + 0.34)); AU.sfx('click'); this._checkBrush();
        break;
      case 'close':
        st.anim = { k: 'tag', t: 0, dur: 0.9 }; AU.sfx('pen');
        break;
      case 'done':
        this.fresh(); AU.sfx('click');
        break;
    }
    this._sync();
  },
  _after(k) {
    const st = this.st;
    if (k === 'pick') {
      st.picked = true; st.phase = 'open';
      this._msg(tr('Taç yaprakları söküldü: ortada polenle kaplı başçık sütunu kaldı. Şimdi dişi çiçeğin mandalını aç.', 'The petals are stripped off: the pollen-covered anther column is left. Now take the clip off the female flower.'));
    } else if (k === 'open') {
      st.opened = true; st.phase = 'brush';
      this._msg(tr('Başçık sütununu dişicik tepesine sür: tepenin üç lobu da sarıya boyansın. Parmağınla lobların üstünden geç ya da düğmeye basılı tut.', 'Rub the anther column over the stigma until all three pads are yellow. Run your finger over the pads or hold the button down.'));
    } else if (k === 'tag') {
      st.tagged = true; st.phase = 'grow'; st.grow = 0;
      this._msg(tr('Yaz boyunca iki kabak büyüyor: etiketli olan ve arıların tozladığı. Dıştan ikisi de aynı görünecek…', 'Over the summer two squash grow: the tagged one and the one the bees pollinated. From outside they will look just the same…'));
    }
    this._sync();
  },
  // how many open-pollinated seedlings come true: some of the bees came from the gourd fence
  openTrue() { return 2 + (this.st.run.seed % 3); },
  settle() {
    const st = this.st, S = G.S, n = this.openTrue();
    st.phase = 'done'; st.run.done++;
    AU.sfx('chime');
    this._msg(tr(`Etiketli kabağın tohumlarından 6/6 ata kabağı çıktı; arıların tozladığı kabağınkilerden yalnızca ${n}/6. İki kabak dıştan aynıydı: karışma tohumdaydı.`, `The tagged squash’s seeds gave 6/6 heirloom squash; the bee-pollinated squash’s seeds only ${n}/6. The two squash looked the same outside: the cross was in the seeds.`));
    if (!S.flags.pollDone) {
      S.flags.pollDone = true;
      S.journal.exps.push({ title: tr('Elle tozlama: ata kabağını saf tutmak', 'Hand pollination: keeping the heirloom squash pure'), code: 'BİY.12.1.11', t: Date.now(),
        head: [tr('Kabak', 'Squash'), tr('Nasıl tozlandı?', 'How was it pollinated?'), tr('Etiket', 'Tag'), tr('Gelecek yıl atası gibi', 'True to type next year')],
        rows: [['1', tr('elle, ata × ata', 'by hand, heirloom × heirloom'), tr('var', 'yes'), '6/6'], ['2', tr('açık, arılarla', 'open, by bees'), tr('yok', 'no'), n + '/6']],
        note: tr('Akşamdan kapatılan çiçeğe yalnızca aynı çeşidin poleni ulaştı; tohumlarının hepsi atası gibi çıktı. Açık kalan çiçeğe arılar süs kabağının polenini de getirdi: kabağın kendisi değişmedi ama tohumlarının bir kısmından siğilli, çizgili kabaklar çıktı. Karışma bir kuşak sonra görünür.', 'Only pollen of the same variety reached the flower closed the evening before, and all its seeds came true. Bees brought gourd pollen to the open flower too: the squash itself didn’t change, but some of its seeds grew warty, striped squash. A cross shows up one generation later.') });
      if (Q.at('kabak', 'pollinate')) { UI.stamp(L(tr('TOZLANDI', 'POLLINATED'))); const pn = this.pn; setTimeout(() => pn && pn.close(), 2200); }
    }
    this._sync(); G.save();
  },

  // ---------------------------------------------------------------- time
  step(dt) {
    const st = this.st;
    st.t += dt; st.idle += dt;
    if (st.phase === 'eve' && st.idle > 7) st.help = true;
    if (st.anim) { st.anim.t += dt; if (st.anim.t >= st.anim.dur) { const k = st.anim.k; st.anim = null; this._after(k); } }
    if (st.phase === 'night') {
      st.pt += dt / 2.6;
      if (st.pt >= 1) {
        st.pt = 1; st.phase = 'morn';
        this._msg(tr('Günaydın! Mandalsız çiçekler açtı, arılar geziyor; bazıları komşunun süs kabaklarından geliyor. Mandallı çiçeklere giremediler. Kapattığın erkek çiçeği kopar.', 'Good morning! The unclipped flowers have opened and bees are going round; some come from the neighbour’s gourds. They couldn’t get into the clipped ones. Pick the male flower you closed.'));
        this._sync();
      }
    }
    if (st.phase === 'brush' && st.holding) { st.cov = st.cov.map(c => Math.min(1, c + dt * 0.6)); this._checkBrush(); }
    if (st.phase === 'grow') { st.grow = Math.min(1, st.grow + dt / 3.2); if (st.grow >= 1) { st.phase = 'year'; st.year = 0; this._msg(tr('Gelecek bahar: iki kabağın tohumlarını ayrı sıralara ektin.', 'Next spring: you sowed the two squash’s seeds in separate rows.')); this._sync(); } }
    if (st.phase === 'year') { st.year = Math.min(1, st.year + dt / 2.6); if (st.year >= 1) this.settle(); }
    // bees: in the morning they fly between the fence and the open flowers
    const day = ['morn', 'open', 'brush', 'close'].includes(st.phase);
    if (!day) st.bees.length = 0;
    if (day && st.bees.length < 4 && Math.random() < dt * 1.2) st.bees.push({ x: 440 + Math.random() * 20, y: 80 + Math.random() * 30, to: this._beeTarget(), t: 0 });
    for (const b of st.bees) {
      b.t += dt;
      const [tx, ty] = b.to, dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy);
      if (d < 6) { b.to = Math.random() < 0.35 ? [480, 60 + Math.random() * 40] : this._beeTarget(); }
      else { const v = 90 * dt; b.x += dx / d * v + Math.sin(b.t * 17) * 0.6; b.y += dy / d * v + Math.cos(b.t * 13) * 0.6; }
    }
    st.bees = st.bees.filter(b => b.x < 470);
  },
  _beeTarget() {
    const st = this.st, open = Object.keys(this.BUDS).filter(k => !st.closed[k] && !(k === 'F1' && st.opened));
    const k = open[Math.floor(Math.random() * open.length)] || 'F2', [x, y] = this.BUDS[k].at;
    return [x + (Math.random() - 0.5) * 16, y - 4];
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
    const lab = {
      eve: tr('Sabahı bekle ☾', 'Wait for morning ☾'), night: tr('Gece…', 'Night…'), morn: tr('Erkek çiçeği kopar ✿', 'Pick the male flower ✿'),
      open: tr('Dişi çiçeğin mandalını aç', 'Unclip the female flower'), brush: tr('Polen sür (basılı tut)', 'Brush on pollen (hold)'),
      close: tr('Kapat ve etiketle 🏷', 'Close and tag 🏷'), grow: tr('Yaz geçiyor…', 'Summer passes…'), year: tr('Gelecek yıl…', 'Next year…'), done: tr('Yeni çiçek ↺', 'Another flower ↺'),
    }[st.phase];
    const go = b.querySelector('.pl-go'), busy = ['night', 'grow', 'year'].includes(st.phase) || !!st.anim;
    go.textContent = L(lab);
    go.disabled = busy;
    go.classList.toggle('next', !busy && (st.phase !== 'eve' || this.ready()));
    this.table();
  },
  table() {
    const b = this.body, S = G.S, st = this.st;
    if (!b) return;
    const n = this.openTrue(), have = S.flags.pollDone;
    b.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Kabak', 'Squash'))}</th><th>${L(tr('Nasıl tozlandı?', 'How was it pollinated?'))}</th><th>${L(tr('Etiket', 'Tag'))}</th><th>${L(tr('Gelecek yıl atası gibi', 'True to type next year'))}</th></tr>${have ? `<tr><td><b>1</b></td><td>${L(tr('elle, ata × ata', 'by hand, heirloom × heirloom'))}</td><td>🏷</td><td>6/6</td></tr><tr class="cl-bad"><td><b>2</b></td><td>${L(tr('açık, arılarla', 'open, by bees'))}</td><td>–</td><td>${n}/6</td></tr>` : `<tr><td colspan="4">${L(tr('Henüz sonuç yok.', 'No results yet.'))}</td></tr>`}</table>`;
    b.querySelector('.stamps').innerHTML = [
      [this.ready() || st.phase !== 'eve', tr('Akşamdan kapatıldı', 'Closed the evening before')], [st.cov.every(c => c >= 1) || st.tagged, tr('Polen sürüldü', 'Pollen brushed on')], [st.tagged, tr('Etiketlendi', 'Tagged')], [!!have, tr('Gelecek yıl saf', 'Pure next year')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
  },
  async close() {
    this.pn = null;
    window.removeEventListener('keydown', this._key, true); window.removeEventListener('keyup', this._key, true);
    if (this.st) { this.st.holding = false; this.st.drag = false; }
    if (Q.at('kabak', 'pollinate') && G.S.flags.pollDone) {
      await ask('kabak_bee');
      await UI.say('player', tr('Etiketli kabağın tohumu saf. Fatma Teyze’ye ne olduğunu anlatayım.', 'The tagged squash’s seed is pure. Let me tell Fatma Teyze what happened.'));
      Q.adv('kabak');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(77), SQ = SQUASH;
    // the neighbour's fence on the right, gourd vines climbing it
    for (let i = 0; i < 12; i++) { const x = 250 + i * 18; b.fillStyle = i % 2 ? '#8E8674' : '#9C927E'; b.fillRect(x, 58, 15, 76); b.fillStyle = 'rgba(0,0,0,0.18)'; b.fillRect(x + 13, 58, 2, 76); b.beginPath(); b.moveTo(x, 58); b.lineTo(x + 7.5, 50); b.lineTo(x + 15, 58); b.fillStyle = i % 2 ? '#8E8674' : '#9C927E'; b.fill(); }
    b.fillStyle = '#6E6656'; b.fillRect(248, 74, 216, 5); b.fillRect(248, 112, 216, 5);
    for (let v = 0; v < 3; v++) { const p = MX.strand(R, 250 + v * 70, 132, -1.3, 110, 6, 0.8); MX.line(b, p, '#5E8034', 1.6); for (let k = 1; k < p.length; k += 3) SQ.leaf(b, R, p[k][0], p[k][1], 6 + R() * 4, R() * 6, 0.8, 1); }
    [[276, 92, 7, 0], [312, 118, 6, 1], [352, 86, 8, 3], [396, 110, 7, 2], [436, 90, 6, 0]].forEach(([x, y, r, k]) => SQ.gourd(b, R, x, y, r, k));
    b.fillStyle = 'rgba(40,30,20,0.55)'; b.font = '700 8px "Courier Prime", monospace'; b.textAlign = 'center'; b.fillText(L(tr('komşunun süs kabakları', 'the neighbour’s gourds')), 356, 146);
    // soil, straw and Grandma's squash leaves
    b.fillStyle = MX.lin(b, 0, 128, 0, 300, [[0, '#6A5238'], [1, '#4A3826']]); b.fillRect(0, 130, 460, 170);
    b.fillStyle = MX.lin(b, 0, 124, 0, 136, [[0, 'rgba(106,82,56,0)'], [1, 'rgba(106,82,56,1)']]); b.fillRect(0, 122, 250, 10);
    for (let k = 0; k < 360; k++) { const x = R() * 470, y = 132 + R() * 170, a = (R() - 0.5) * 1.6; b.strokeStyle = `rgba(${210 + R() * 30 | 0},${176 + R() * 30 | 0},${100 + R() * 40 | 0},${(0.45 + R() * 0.4).toFixed(2)})`; b.lineWidth = 0.6 + R() * 0.5; b.beginPath(); b.moveTo(x, y); b.lineTo(x + Math.cos(a) * (5 + R() * 9), y + Math.sin(a) * (5 + R() * 9)); b.stroke(); }
    [[40, 190, 46, -0.4], [206, 196, 50, 0.2], [290, 262, 44, -0.2], [380, 196, 42, 0.5], [110, 272, 40, 0.3], [452, 270, 40, -0.5]].forEach(([x, y, r, a], i) => SQ.leaf(b, R, x, y, r, a, 0.62, i % 2));
    SQ.stem(b, R, [[-10, 236], [60, 230], [150, 236], [240, 228], [330, 234], [470, 226]], 7);
    this._bc = c;
    return c;
  },
  // a closed bud: a twisted, ribbed point, yellow showing between green ribs
  _bud(x, bx, by, s, clip) {
    x.save(); x.translate(bx, by); x.scale(s, s);
    const pts = [[0, -20], [6, -8], [8, 4], [5, 12], [0, 14], [-5, 12], [-8, 4], [-6, -8]];
    x.fillStyle = MX.lin(x, -8, 0, 8, 0, [[0, '#9CB25A'], [0.5, '#E8D26A'], [1, '#8AA24A']]); x.beginPath(); MX.curve(x, pts); x.fill();
    x.strokeStyle = 'rgba(70,100,30,0.8)'; x.lineWidth = 0.9; for (const k of [-4, 0, 4]) { x.beginPath(); x.moveTo(k * 0.6, -18); x.quadraticCurveTo(k * 1.5, -2, k, 13); x.stroke(); }
    x.strokeStyle = 'rgba(40,60,20,0.8)'; x.lineWidth = 0.6; x.beginPath(); MX.curve(x, pts); x.stroke();
    if (clip) {
      // a wooden clothes peg pinching the tip shut
      x.save(); x.translate(0, -12); x.rotate(-0.25);
      x.fillStyle = '#C8A06A'; x.fillRect(-9, -3, 18, 2.6); x.fillStyle = '#A8804A'; x.fillRect(-9, 0.4, 18, 2.6);
      x.fillStyle = '#8A9098'; x.fillRect(-2, -3.6, 4, 7.2); x.strokeStyle = '#3A2A1A'; x.lineWidth = 0.5; x.strokeRect(-9, -3, 18, 6);
      x.restore();
    }
    x.restore();
  },
  _stalk(x, b) {
    const [rx, ry] = b.root, [ax, ay] = b.at;
    if (b.male) SQUASH.stem(x, MX.rng(3), [[rx, ry], [rx + (ax - rx) * 0.3, ry - (ry - ay) * 0.45], [ax, ay + 16]], 2.4);
    else { SQUASH.stem(x, MX.rng(4), [[rx, ry], b.ov[0]], 3.2); SQUASH.baby(x, MX.rng(5), b.ov[0][0], b.ov[0][1], b.ov[1][0], b.ov[1][1], 10); }
  },
  // a grown summer squash: long, pale green with darker flecks (the heirloom), or a warty striped cross
  _fruit(x, cx, cy, len, cross, a = -0.5) {
    x.save(); x.translate(cx, cy); x.rotate(a);
    if (cross) { SQUASH.gourd(x, MX.rng(cx | 0), 0, 0, len * 0.32, 0); x.restore(); return; }
    const w = len * 0.36, body = [[-len / 2, -w * 0.36], [-len * 0.2, -w * 0.5], [len * 0.3, -w * 0.52], [len / 2, -w * 0.3], [len * 0.52, 0], [len / 2, w * 0.3], [len * 0.3, w * 0.52], [-len * 0.2, w * 0.5], [-len / 2, w * 0.36]];
    MX.fill(x, body, MX.lin(x, 0, -w / 2, 0, w / 2, [[0, '#D6E4A8'], [0.45, '#A8C476'], [1, '#6E8E44']]));
    x.save(); x.beginPath(); MX.curve(x, body); x.clip(); MX.dots(x, MX.rng(9), 40, [-len / 2, -w / 2, len, w], 0.4, 1.1, 'rgba(90,120,50,0.45)'); x.restore();
    x.strokeStyle = 'rgba(60,80,30,0.7)'; x.lineWidth = 0.6; x.beginPath(); MX.curve(x, body); x.stroke();
    x.fillStyle = '#7A8A4A'; x.fillRect(-len / 2 - 5, -2, 6, 4);
    x.restore();
  },
  _ring(x, px, py, r, t) {
    const k = 0.5 + 0.5 * Math.sin(t * 5);
    x.strokeStyle = `rgba(242,199,68,${(0.55 + 0.4 * k).toFixed(2)})`; x.lineWidth = 3; x.beginPath(); x.arc(px, py, r + k * 4, 0, TAU); x.stroke();
  },
  draw() {
    const x = this.cv.getContext('2d'), st = this.st, t = st.t, R = MX.rng(21);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // sky by the time of day: evening, night, then morning
    const night = st.phase === 'night' ? Math.sin(st.pt * Math.PI) : 0, eve = st.phase === 'eve';
    const top = eve ? '#E8A070' : st.phase === 'grow' || st.phase === 'year' || st.phase === 'done' ? '#B8D4E4' : '#CFE2EC';
    x.fillStyle = MX.lin(x, 0, 0, 0, 140, [[0, top], [1, eve ? '#F4D2A0' : '#EEF2E4']]); x.fillRect(0, 0, 460, 140);
    x.drawImage(this._back(), 0, 0, 460, 300);
    const SQ = SQUASH, R2 = MX.rng(31);
    // the vine's flowers: stalk, then bud or open flower
    for (const k in this.BUDS) {
      const b = this.BUDS[k], [bx, by] = b.at, closed = !!st.closed[k];
      if (st.phase === 'grow' || st.phase === 'year' || st.phase === 'done') {
        if (!b.male) {
          const g = st.phase === 'grow' ? st.grow : 1, len = 18 + g * 50, tagged = k === this.fem();
          SQ.stem(x, R2, [b.root, b.ov[0]], 3.2);
          this._fruit(x, b.ov[0][0] + 14 * g, b.ov[0][1] - 8 * g, len, false);
          if (tagged) { x.fillStyle = '#F4EEDD'; x.strokeStyle = '#1B1A17'; x.lineWidth = 0.8; U.rr(x, b.ov[0][0] - 8, b.ov[0][1] + 6, 30, 13, 2); x.fill(); x.stroke(); x.fillStyle = '#A0322A'; x.font = '700 7px "Courier Prime", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(L(tr('ELLE', 'HAND')), b.ov[0][0] + 7, b.ov[0][1] + 12.5); }
          x.fillStyle = 'rgba(27,26,23,0.8)'; x.font = '700 8px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText(L(tagged ? tr('etiketli (elle)', 'tagged (by hand)') : tr('açık (arılarla)', 'open (by bees)')), b.ov[0][0] + 10, b.ov[0][1] + 34);
        }
        continue;
      }
      if (k === this.male() && st.picked) continue;
      this._stalk(x, b);
      const isF = k === this.fem() && !b.male, big = isF && (st.opened || !!(st.anim && st.anim.k === 'open')), Rf = MX.rng(bx * 7 | 0);
      const openNow = st.phase !== 'eve' && st.phase !== 'night' && (!closed || big) ? 1 : st.phase === 'night' && !closed ? U.clamp((st.pt - 0.6) / 0.4, 0, 1) : 0;
      let op = openNow;
      if (isF && st.anim && st.anim.k === 'open') op = st.anim.t / st.anim.dur;
      if (isF && st.anim && st.anim.k === 'tag') op = 1 - st.anim.t / st.anim.dur;
      if (isF && st.tagged) op = 0;
      const s = big ? U.lerp(1, this.BIG, st.phase === 'brush' || st.phase === 'close' ? 1 : op) * (st.anim && st.anim.k === 'tag' ? 1 - st.anim.t / st.anim.dur * 0.5 : 1) : 1;
      if (op > 0.02) {
        x.save(); x.globalAlpha = Math.min(1, op * 1.4);
        SQ.bloom(x, Rf, bx, by, 22 * s * (0.6 + op * 0.4), 0.8, 0);
        if (b.male) SQ.column(x, Rf, bx, by + 2, 22 * s); else SQ.stigma(x, Rf, bx, by + 2, 22 * s * (big ? U.lerp(1, this.ST, (s - 1) / (this.BIG - 1)) : 1));
        x.restore();
      }
      if (op < 0.98) { x.save(); x.globalAlpha = 1 - op; this._bud(x, bx, by, big ? 1.3 : 1, closed && !(isF && st.opened && !st.tagged)); x.restore(); }
      // the pollen on the stigma pads
      if (isF && (st.phase === 'brush' || (st.phase === 'close' && !(st.anim && st.anim.k === 'tag')))) {
        this.LOBES.forEach(([lx, ly], i) => {
          const px = bx + lx, py = by + ly, c = st.cov[i];
          for (let q = 0; q < Math.round(c * 30); q++) { const a = q * 2.4, d = (q % 7) * 1.5; x.fillStyle = '#FFE680'; x.beginPath(); x.arc(px + Math.cos(a) * d, py + Math.sin(a) * d * 0.8, 1.3, 0, TAU); x.fill(); }
          if (c < 1) this._ring(x, px, py, 12, t + i);
        });
      }
    }
    // the tag hanging from F1's stalk once it has been closed again
    if (st.tagged && !['grow', 'year', 'done'].includes(st.phase)) { const b = this.BUDS[this.fem()]; x.strokeStyle = '#8A7A5A'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(b.ov[0][0], b.ov[0][1]); x.lineTo(b.ov[0][0] - 6, b.ov[0][1] + 12); x.stroke(); x.fillStyle = '#F4EEDD'; x.strokeStyle = '#1B1A17'; U.rr(x, b.ov[0][0] - 22, b.ov[0][1] + 12, 32, 13, 2); x.fill(); x.stroke(); x.fillStyle = '#A0322A'; x.font = '700 7px "Courier Prime", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(L(tr('ELLE', 'HAND')), b.ov[0][0] - 6, b.ov[0][1] + 18.5); }
    // the picked male flower, petals stripped: held over the stigma while brushing, or following the finger
    if (st.picked && st.phase !== 'grow' && st.phase !== 'year' && st.phase !== 'done') {
      const f = this.BUDS[this.fem()].at, hold = st.hand && st.drag && st.phase === 'brush' ? st.hand : st.phase === 'brush' ? [f[0] + 30 + Math.sin(t * 6) * (st.holding ? 12 : 3), f[1] - 18 + Math.cos(t * 9) * (st.holding ? 5 : 1)] : [400, 60];
      x.save(); x.translate(hold[0], hold[1]); x.rotate(-0.6);
      SQ.stem(x, R, [[0, 44], [0, 6]], 2.4);
      SQ.column(x, R, 0, 6, 34);
      x.restore();
    } else if (st.anim && st.anim.k === 'pick') {
      const m = this.BUDS[this.male()].at, k = st.anim.t / st.anim.dur;
      x.save(); x.translate(U.lerp(m[0], 400, k), U.lerp(m[1], 60, k)); x.globalAlpha = 1 - k * 0.3; SQ.bloom(x, R, 0, 0, 22 * (1 - k * 0.8), 0.8, k * 2); SQ.column(x, R, 0, 2, 22); x.restore();
    }
    // bees
    for (const b of st.bees) { x.fillStyle = 'rgba(230,240,250,0.7)'; U.ellipse(x, b.x - 1, b.y - 3, 3.4, 1.6, -0.5); x.fill(); U.ellipse(x, b.x + 1, b.y - 3, 3.4, 1.6, 0.5); x.fill(); x.fillStyle = '#3A2A1A'; U.ellipse(x, b.x, b.y, 4, 2.4, 0); x.fill(); x.fillStyle = '#E0A63A'; x.fillRect(b.x - 1.4, b.y - 2.2, 1.4, 4.4); }
    // night falls and lifts
    if (night > 0) { x.fillStyle = `rgba(16,20,44,${(0.72 * night).toFixed(2)})`; x.fillRect(0, 0, 460, 300); x.fillStyle = `rgba(250,246,220,${night.toFixed(2)})`; x.beginPath(); x.arc(80, 40, 11, 0, TAU); x.fill(); }
    // where to tap next
    if (!st.anim) {
      if (st.phase === 'eve' && st.help) for (const k of ['F1', 'F2']) if (!st.closed[k] && !(st.closed.F1 || st.closed.F2)) this._ring(x, ...this.BUDS[k].at, 22, t);
      if (st.phase === 'eve' && st.help && (st.closed.F1 || st.closed.F2) && !this.male()) for (const k of ['M1', 'M2', 'M3']) this._ring(x, ...this.BUDS[k].at, 20, t);
      if (st.phase === 'morn') this._ring(x, ...this.BUDS[this.male()].at, 24, t);
      if (st.phase === 'open' || st.phase === 'close') this._ring(x, ...this.BUDS[this.fem()].at, st.phase === 'close' ? 46 : 26, t);
    }
    // next year: two rows of six plants, one from each squash's seed
    if (st.phase === 'year' || st.phase === 'done') {
      const k = st.phase === 'year' ? st.year : 1, n = this.openTrue();
      x.fillStyle = `rgba(247,242,228,${(0.94 * Math.min(1, k * 2)).toFixed(2)})`; x.fillRect(18, 14, 424, 186); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.2; x.strokeRect(18, 14, 424, 186);
      x.fillStyle = '#1B1A17'; x.font = '700 11px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left'; x.textBaseline = 'middle';
      x.fillText(L(tr('Gelecek yıl', 'Next year')), 30, 30);
      const rows = [[tr('Etiketli kabağın tohumu', 'Seed of the tagged squash'), 6], [tr('Arıların tozladığı kabağın tohumu', 'Seed of the bee-pollinated squash'), n]];
      rows.forEach(([lab, good], r) => {
        const y = 70 + r * 72;
        x.fillStyle = '#1B1A17'; x.font = '700 9px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left'; x.fillText(L(lab), 30, y - 22);
        const cross = [1, 4, 5, 2, 3, 0].slice(0, 6 - good);
        for (let i = 0; i < 6; i++) { if (i / 6 > k * 1.2) break; this._fruit(x, 60 + i * 60, y + 8, 34, r === 1 && cross.includes(i), -0.2); }
        x.fillStyle = r ? '#A0322A' : '#3E6A3A'; x.font = '700 14px "Courier Prime", monospace'; x.textAlign = 'right'; x.fillText(`${r ? good : 6}/6`, 432, y + 8);
      });
    }
  },
};
