'use strict';
// Owl pellet bench: brush the fur off a barn owl's pellet on a dissection tray. Loose bones fly to the bone chart
// by themselves; every skull has to be named with a three-step dichotomous key, reading its teeth in the loupe.
// The skulls give the night's catch.
const PELLET = {
  CX: 156, CY: 86, RX: 120, RY: 64,
  SP: {
    vole: { name: tr('Tarla faresi', 'Field vole'), latin: 'Microtus', group: tr('Kemirgen', 'Rodent'), path: ['b', 'b', 'a'] },
    mouse: { name: tr('Orman faresi', 'Wood mouse'), latin: 'Apodemus', group: tr('Kemirgen', 'Rodent'), path: ['b', 'b', 'b'] },
    shrew: { name: tr('Sivri fare', 'Shrew'), latin: 'Crocidura', group: tr('Böcekçil', 'Insectivore'), path: ['b', 'a'] },
    bird: { name: tr('Serçe', 'Sparrow'), latin: 'Passer', group: tr('Kuş', 'Bird'), path: ['a'] },
  },
  KEY: [
    { q: tr('1 · Çenede diş var mı?', '1 · Are there teeth in the jaws?'), a: tr('Diş yok, gaga var', 'No teeth: a beak'), b: tr('Dişler var', 'Teeth') },
    { q: tr('2 · Ön dişlerle yanak dişleri arasında boşluk var mı?', '2 · Is there a gap between the front teeth and the cheek teeth?'), a: tr('Yok: kesintisiz bir sıra sivri diş', 'No: one unbroken row of pointed teeth'), b: tr('Var: iki büyük kesici, sonra boşluk', 'Yes: two big incisors, then a gap') },
    { q: tr('3 · Azı dişlerinin çiğneme yüzü nasıl?', '3 · What do the grinding faces of the molars look like?'), a: tr('Zikzak çizen üçgenler', 'Zigzag triangles'), b: tr('Yuvarlak tümsekler', 'Rounded bumps') },
  ],
  // what the loupe shows when a wrong branch is chosen: [couplet][species]
  HINT: [
    { bird: tr('Büyütece bak: bu kafatasında hiç diş yok, ağız sivri bir gagayla bitiyor.', 'Look in the loupe: this skull has no teeth at all; the mouth ends in a pointed beak.'), other: tr('Büyütece bak: çenelerde dişler sıralanmış, gaga yok.', 'Look in the loupe: there are teeth lined up in the jaws, and no beak.') },
    { shrew: tr('Dişlere bak: ön dişlerden sonra boşluk yok; kesintisiz, sivri bir sıra.', 'Look at the teeth: there’s no gap after the front teeth; it’s one unbroken, pointed row.'), other: tr('Dişlere bak: iki büyük, kıvrık kesici dişten sonra geniş bir boşluk var.', 'Look at the teeth: after two big, curved incisors there is a wide gap.') },
    { vole: tr('Büyütecin köşesindeki azı yüzüne bak: kenarları zikzak çizen üçgenler.', 'Look at the molar face in the corner of the loupe: triangles with zigzag edges.'), other: tr('Azı yüzüne bak: zikzak yok, yuvarlak tümsekler var.', 'Look at the molar face: no zigzags, just rounded bumps.') },
  ],
  ROWS: [['skull', tr('Kafatası', 'Skull')], ['jaw', tr('Alt çene', 'Lower jaw')], ['long', tr('Uzun kemik', 'Long bone')], ['pelvis', tr('Kalça', 'Hip')], ['vert', tr('Omur', 'Vertebra')], ['rib', tr('Kaburga', 'Rib')]],

  // the same pellet for everyone: bones and fur tufts are laid out once from a fixed seed
  layout() {
    if (this._lay) return this._lay;
    const R = MX.rng(3131), bones = [];
    const skulls = [[96, 66, 'vole', -0.2], [158, 50, 'shrew', 0.15], [218, 76, 'vole', 0.3], [120, 112, 'mouse', -0.1], [196, 118, 'bird', 0.4]];
    skulls.forEach(([x, y, sp, a]) => bones.push({ t: 'skull', x, y, a, sp }));
    const inside = (x, y) => ((x - this.CX) / (this.RX * 0.86)) ** 2 + ((y - this.CY) / (this.RY * 0.84)) ** 2 < 1 && skulls.every(s => Math.hypot(s[0] - x, s[1] - y) > 26);
    const pts = MX.scatter(R, 25, 17, [this.CX - this.RX, this.CY - this.RY, this.RX * 2, this.RY * 2], inside);
    const kinds = ['jaw', 'jaw', 'jaw', 'jaw', 'jaw', 'jaw', 'jaw', 'long', 'long', 'long', 'long', 'long', 'long', 'pelvis', 'pelvis', 'vert', 'vert', 'vert', 'vert', 'vert', 'vert', 'rib', 'rib', 'rib', 'rib'];
    pts.forEach(([x, y], i) => bones.push({ t: kinds[i % kinds.length], x, y, a: R() * TAU }));
    const tufts = [];
    for (let y = this.CY - this.RY - 4; y <= this.CY + this.RY + 4; y += 17) for (let x = this.CX - this.RX - 4; x <= this.CX + this.RX + 4; x += 19) {
      const px = x + ((Math.round(y) / 17) & 1 ? 9 : 0) + (R() - 0.5) * 5, py = y + (R() - 0.5) * 5;
      if (((px - this.CX) / (this.RX + 6)) ** 2 + ((py - this.CY) / (this.RY + 6)) ** 2 < 1) tufts.push({ x: px, y: py, r: 13 + R() * 5, s: Math.floor(R() * 1e4) });
    }
    return (this._lay = { bones, tufts });
  },

  open() {
    const S = G.S, L0 = this.layout();
    const run = S.pellet || (S.pellet = { fur: [], ids: {}, out: {}, miss: 0 });
    this.st = { run, t: 0, sel: null, node: 0, fly: [], down: false, gone: [] };
    this._traySig = null;
    const body = h('div', 'kit rig ferm pellet');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label class="pe-q"></label>
        <button class="pe-a" data-k="a"></button>
        <button class="pe-b" data-k="b"></button>
        <p class="fm-const">${L(tr('Kusmuk kurutulmuş, ısıyla mikroplardan arındırılmış. Eldivenle çalış; kemikleri kırmadan ayır.', 'The pellet has been dried and heat-treated against germs. Work in gloves and take the bones out without breaking them.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('İpucu: kusmuğun üstünde parmağını gezdir, kılları ayıkla. Çıkan her kafatasına dokun ve anahtarla adını bul.', 'Tip: rub your finger over the pellet to tease the fur away. Tap each skull that appears and name it with the key.'))}</p>`;
    body.querySelector('.pe-a').onclick = () => this.answer('a');
    body.querySelector('.pe-b').onclick = () => this.answer('b');
    this.body = body; this.cv = body.querySelector('canvas');
    const at = e => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300]; };
    this.cv.addEventListener('pointerdown', e => { const [x, y] = at(e); if (y > 172) return; this.st.down = true; if (!this.tap(x, y)) this.brush(x, y); });
    this.cv.addEventListener('pointermove', e => { if (!this.st.down) return; const [x, y] = at(e); if (y < 172) this.brush(x, y); });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) this.cv.addEventListener(ev, () => { this.st.down = false; });
    this.pn = UI.panel({ title: tr('Baykuş kusmuğu · Gece ne yedi?', 'Owl pellet · What did it eat last night?'), code: 'BİY.9.1.5', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    // bones already out stay on the chart
    L0.bones.forEach((b, i) => { if (b.t !== 'skull' && !run.out[i] && !this.covered(b)) run.out[i] = true; });
    this._sync(); this.table(); this.loop();
  },
  covered(b) { const run = this.st.run; return this.layout().tufts.some((t, i) => !run.fur[i] && Math.hypot(t.x - b.x, t.y - b.y) < t.r + 4); },
  // teasing the fur: every tuft under the finger comes away; bones it uncovers fly to the chart
  brush(x, y, r = 24) {
    const run = this.st.run, L0 = this.layout();
    let n = 0;
    L0.tufts.forEach((t, i) => { if (!run.fur[i] && Math.hypot(t.x - x, t.y - y) < r) { run.fur[i] = true; this.st.gone.push({ x: t.x, y: t.y, r: t.r, s: t.s, k: 0 }); n++; } });
    if (!n) return;
    if (Math.random() < 0.5) AU.sfx('dig');
    L0.bones.forEach((b, i) => { if (b.t !== 'skull' && !run.out[i] && !this.st.fly.some(f => f.i === i) && !this.covered(b)) this.st.fly.push({ i, k: 0 }); });
    this._sync(); this.table();
  },
  brushAll() { const L0 = this.layout(); L0.tufts.forEach(t => this.brush(t.x, t.y, 2)); },
  tap(x, y) {
    // the nearest open skull within reach; a finger on a board gets a longer reach than a mouse
    const run = this.st.run, L0 = this.layout();
    let i = -1, best = G.set.board ? 28 : 18;
    L0.bones.forEach((b, k) => { const d = Math.hypot(b.x - x, b.y - y); if (b.t === 'skull' && !run.ids[k] && d < best && !this.covered(b)) { best = d; i = k; } });
    if (i < 0) return false;
    this.select(i);
    return true;
  },
  select(i) {
    const b = this.layout().bones[i];
    if (!b || b.t !== 'skull' || this.st.run.ids[i] || this.covered(b)) return false;
    this.st.sel = i; this.st.node = 0; AU.sfx('click');
    this._msg(tr('Kafatası büyüteçte. Anahtarın ilk sorusuna bak ve büyüteçteki kafatasına uyan seçeneği seç.', 'The skull is in the loupe. Read the key’s first question and pick the choice that fits the skull in the loupe.'));
    this._sync();
    return true;
  },
  // one step down the key: a choice that doesn't fit the skull shows what to look at instead
  answer(k) {
    const st = this.st, run = st.run;
    if (st.sel == null) return false;
    const sp = this.layout().bones[st.sel].sp, want = this.SP[sp].path[st.node];
    if (k !== want) {
      run.miss++; AU.sfx('wrong');
      const h = this.HINT[st.node]; this._msg(h[sp] || h.other);
      this._sync();
      return false;
    }
    AU.sfx('pen');
    if (st.node + 1 < this.SP[sp].path.length) { st.node++; this._msg(tr('Doğru yol. Sıradaki soru.', 'Right branch. Next question.')); }
    else {
      run.ids[st.sel] = sp; st.sel = null; st.node = 0;
      this._msg(tr(`Bu bir ${L(this.SP[sp].name).toLocaleLowerCase('tr')} (${this.SP[sp].latin}). Sıradaki kafatasına dokun.`, `It’s a ${L(this.SP[sp].name).toLowerCase()} (${this.SP[sp].latin}). Tap the next skull.`));
      AU.sfx('chime');
    }
    this._sync(); this.table(); G.save();
    return true;
  },
  step(dt) {
    const st = this.st, run = st.run;
    st.t += dt;
    for (const f of st.fly) f.k += dt / 0.6;
    const done = st.fly.filter(f => f.k >= 1);
    if (done.length) { done.forEach(f => { run.out[f.i] = true; }); st.fly = st.fly.filter(f => f.k < 1); this.table(); G.save(); }
    for (const g of st.gone) g.k += dt / 0.5;
    st.gone = st.gone.filter(g => g.k < 1);
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
    const b = this.body, st = this.st, c = this.KEY[st.node], on = st.sel != null;
    b.querySelector('.pe-q').textContent = on ? L(c.q) : L(tr('Anahtar: önce bir kafatasına dokun.', 'The key: tap a skull first.'));
    b.querySelector('.pe-a').textContent = 'a) ' + L(c.a); b.querySelector('.pe-b').textContent = 'b) ' + L(c.b);
    b.querySelector('.pe-a').disabled = b.querySelector('.pe-b').disabled = !on;
  },
  analyse() {
    const run = this.st.run, L0 = this.layout();
    const nb = L0.bones.filter(b => b.t !== 'skull').length, out = Object.keys(run.out).length;
    const fur = run.fur.filter(Boolean).length / L0.tufts.length;
    const count = {}; for (const k in run.ids) count[run.ids[k]] = (count[run.ids[k]] || 0) + 1;
    const skulls = L0.bones.filter(b => b.t === 'skull').length, named = Object.keys(run.ids).length;
    return { fur, out, nb, count, skulls, named, rodents: (count.vole || 0) + (count.mouse || 0), done: named === skulls };
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, sps = ['vole', 'mouse', 'shrew', 'bird'];
    const rows = sps.filter(s => a.count[s]).map(s => `<tr><td><b>${U.esc(L(this.SP[s].name))}</b> <i>${this.SP[s].latin}</i></td><td>${U.esc(L(this.SP[s].group))}</td><td><b>${a.count[s]}</b></td></tr>`).join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Av', 'Prey'))}</th><th>${L(tr('Grup', 'Group'))}</th><th>${L(tr('Sayı', 'Count'))}</th></tr>${rows || `<tr><td colspan="3">${L(tr('Henüz tanınan kafatası yok.', 'No skulls named yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.fur > 0.9, tr('Kıllar ayıklandı', 'Fur teased out')], [a.out === a.nb, tr(`Kemikler (${a.out}/${a.nb})`, `Bones (${a.out}/${a.nb})`)], [a.done, tr(`Kafatasları (${a.named}/${a.skulls})`, `Skulls (${a.named}/${a.skulls})`)],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const got = sps.filter(s => a.count[s]);
    if (got.length) UI._chart(body.querySelector('.rig-chart'), { values: got.map(s => a.count[s]), labels: got.map(s => this.SP[s].name), colors: got.map(s => ({ vole: '#A07848', mouse: '#C89A5A', shrew: '#6A6A7A', bird: '#8A9A5A' })[s]), unit: tr('kafatası sayısı', 'number of skulls') });
    if (a.done && !S.flags.pelletDone) {
      S.flags.pelletDone = true;
      S.journal.exps.push({ title: tr('Baykuş kusmuğu', 'Owl pellet'), code: 'BİY.9.1.5', t: Date.now(),
        head: [tr('Av', 'Prey'), tr('Grup', 'Group'), tr('Sayı', 'Count')],
        rows: got.map(s => [tr(this.SP[s].name.tr + ' (' + this.SP[s].latin + ')', this.SP[s].name.en + ' (' + this.SP[s].latin + ')'), this.SP[s].group, String(a.count[s])]),
        chart: { values: got.map(s => a.count[s]), labels: got.map(s => this.SP[s].name), colors: got.map(s => ({ vole: '#A07848', mouse: '#C89A5A', shrew: '#6A6A7A', bird: '#8A9A5A' })[s]), unit: tr('kafatası sayısı', 'number of skulls') },
        note: tr(`Bir kusmukta ${a.skulls} kafatası: ${a.rodents} kemirgen, bir sivri fare ve bir serçe. Kusmuk, baykuşun sindiremediği kıl ve kemiklerin midesinde toplanıp ağızdan atılmasıdır. Kafatasları ikili bir anahtarla, dişlerine bakılarak tanındı. Sivri fare kemirgen değil, böcekçildir.`, `${a.skulls} skulls in one pellet: ${a.rodents} rodents, a shrew and a sparrow. A pellet is the fur and bone the owl can’t digest, packed together in its stomach and brought up through the mouth. The skulls were named with a dichotomous key by their teeth. The shrew is not a rodent but an insectivore.`) });
      this._msg(tr(`Bir gecenin avı: ${a.skulls} hayvan, ${a.rodents}’ü kemirgen. Sonuçlar defterinde.`, `One night’s catch: ${a.skulls} animals, ${a.rodents} of them rodents. The results are in your journal.`));
      if (Q.at('owl', 'pellets')) { UI.stamp(L(tr('AV SAYILDI', 'CATCH COUNTED'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  async close() {
    this.pn = null;
    if (Q.at('owl', 'pellets') && G.S.flags.pelletDone) {
      await ask('owl_count');
      await UI.say('player', tr('Bir baykuş ailesi yılda binlerce fare yakalıyor, üstelik parasız ve gece vardiyasında! Rıza Dede’ye anlatmalıyım.', 'An owl family catches thousands of mice a year, for free and on the night shift! I must tell Rıza Dede.'));
      Q.adv('owl');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc && this._bcLang === I18N.lang) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    // the black wax of a dissection tray, and the bone chart on a card beside it
    b.fillStyle = '#6A5A48'; b.fillRect(0, 0, 460, 172);
    b.fillStyle = '#1E1E22'; U.rr(b, 6, 6, 302, 160, 8); b.fill(); b.strokeStyle = '#8A8A90'; b.lineWidth = 2; b.stroke();
    b.fillStyle = 'rgba(255,255,255,0.04)'; U.rr(b, 12, 10, 290, 40, 6); b.fill();
    b.fillStyle = '#F4EEDD'; b.fillRect(316, 6, 138, 160); b.strokeStyle = '#1B1A17'; b.lineWidth = 1; b.strokeRect(316, 6, 138, 160);
    b.fillStyle = '#1B1A17'; b.font = '700 8px "Courier Prime", monospace'; b.textAlign = 'left';
    this.ROWS.forEach(([, name], i) => { const y = 22 + i * 25; b.fillText(L(name).toLocaleUpperCase(I18N.lang === 'tr' ? 'tr' : 'en'), 322, y - 4); b.strokeStyle = 'rgba(60,90,120,0.25)'; b.lineWidth = 0.5; b.beginPath(); b.moveTo(320, y + 14); b.lineTo(450, y + 14); b.stroke(); });
    // the lower part: a field notebook page with the loupe and the key
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5; for (let y = 186; y < 300; y += 12) { b.beginPath(); b.moveTo(136, y); b.lineTo(456, y); b.stroke(); }
    this._bc = c; this._bcLang = I18N.lang;
    return c;
  },
  // where the chart keeps bone number n of a kind
  slot(t, n) { const r = this.ROWS.findIndex(([k]) => k === t); return [326 + (n % 9) * 13.5, 22 + r * 25 + 5 + Math.floor(n / 9) * 5]; },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, run = st.run, L0 = this.layout(), t = st.t;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // the pellet itself (bones still in it, the fur over them, the pile of teased fur) changes only when a tuft or a
    // bone moves, so it is painted into its own layer and reused between those moments
    const nf = run.fur.filter(Boolean).length, sig = nf + '|' + Object.keys(run.out).length + '|' + Object.keys(run.ids).length + '|' + st.fly.map(f => f.i).join(',');
    if (this._traySig !== sig) {
      this._traySig = sig;
      const c = this._tray || (this._tray = U.canvas(920, 344)), o = c.getContext('2d');
      o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, 920, 344); o.setTransform(2, 0, 0, 2, 0, 0);
      L0.bones.forEach((b, i) => {
        if (b.t !== 'skull' && (run.out[i] || st.fly.some(f => f.i === i))) return;
        if (b.t === 'skull' && run.ids[i]) return;
        this._bone(o, b, b.x, b.y, 1, b.a);
      });
      L0.tufts.forEach((tf, i) => { if (!run.fur[i]) this._tuft(o, tf.x, tf.y, tf.r, tf.s, 1); });
      for (let k = 0; k < Math.min(24, nf); k++) this._tuft(o, 280 - (k % 4) * 7, 150 - Math.floor(k / 4) * 4, 7, k * 17, 0.8);
    }
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._tray, 0, 0); x.setTransform(2, 0, 0, 2, 0, 0);
    for (const g of st.gone) this._tuft(x, g.x + g.k * 30, g.y - g.k * 20, g.r * (1 - g.k * 0.5), g.s, 1 - g.k);
    // uncovered skulls glow until they are named; the selected one wears a ring
    L0.bones.forEach((b, i) => {
      if (b.t !== 'skull' || run.ids[i] || this.covered(b)) return;
      const on = st.sel === i, p = 0.5 + 0.5 * Math.sin(t * 4 + i);
      x.strokeStyle = on ? '#E8B83A' : `rgba(232,184,58,${(0.35 + 0.4 * p).toFixed(2)})`; x.lineWidth = on ? 2 : 1.2;
      x.beginPath(); x.arc(b.x, b.y, 17 + (on ? 0 : p * 2), 0, TAU); x.stroke();
    });
    // bones flying to the chart, and the ones already sorted
    const count = {};
    L0.bones.forEach((b, i) => { if (b.t !== 'skull' && run.out[i]) { const n = count[b.t] = (count[b.t] || 0) + 1; const [sx, sy] = this.slot(b.t, n - 1); this._bone(x, b, sx, sy, 0.42, 0); } });
    for (const f of st.fly) {
      const b = L0.bones[f.i], n = (count[b.t] || 0) + st.fly.filter(g => g !== f && L0.bones[g.i].t === b.t && g.i < f.i).length, [sx, sy] = this.slot(b.t, n), k = U.easeOut(U.clamp(f.k, 0, 1));
      this._bone(x, b, b.x + (sx - b.x) * k, b.y + (sy - b.y) * k - Math.sin(k * Math.PI) * 30, 1 - 0.58 * k, b.a * (1 - k));
    }
    let ns = 0;
    L0.bones.forEach((b, i) => { if (b.t === 'skull' && run.ids[i]) { const [sx, sy] = this.slot('skull', ns++ * 2); this._bone(x, b, sx + 6, sy, 0.42, 0); } });
    x.fillStyle = '#1B1A17'; x.font = '700 9px "Courier Prime", monospace'; x.textAlign = 'right';
    this.ROWS.forEach(([k], i) => { const n = k === 'skull' ? Object.keys(run.ids).length : count[k] || 0; if (n) x.fillText('×' + n, 450, 22 + i * 25 - 4); });
    this._loupe(x);
    this._key(x);
  },
  _tuft(x, cx, cy, r, s, a) {
    const R = MX.rng(s + 1);
    x.globalAlpha = a;
    x.fillStyle = '#5E5650'; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
    for (let k = 0; k < 14; k++) { const q = R() * TAU, l = r * (0.4 + R() * 0.8); x.strokeStyle = R() < 0.5 ? '#7A7068' : '#403A36'; x.lineWidth = 0.7; x.beginPath(); x.moveTo(cx + Math.cos(q) * r * 0.2, cy + Math.sin(q) * r * 0.2); x.quadraticCurveTo(cx + Math.cos(q + 0.4) * l * 0.6, cy + Math.sin(q + 0.4) * l * 0.6, cx + Math.cos(q + 0.2) * l, cy + Math.sin(q + 0.2) * l); x.stroke(); }
    x.globalAlpha = 1;
  },
  // one bone at (px, py): skulls in side view, the rest as simple shapes
  _bone(x, b, px, py, s, a) {
    x.save(); x.translate(px, py); x.rotate(a); x.scale(s, s);
    const bone = '#EDE6D6', edge = '#8A7A60';
    x.fillStyle = bone; x.strokeStyle = edge; x.lineWidth = 0.8;
    if (b.t === 'skull') { x.scale(0.26, 0.26); this._skull(x, b.sp, false); }
    else if (b.t === 'jaw') { x.beginPath(); x.moveTo(-10, 2); x.quadraticCurveTo(-2, 5, 8, 3); x.lineTo(10, -4); x.lineTo(6, -2); x.quadraticCurveTo(0, 1, -8, -1); x.closePath(); x.fill(); x.stroke(); x.strokeStyle = '#D8A040'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(-9, 0); x.quadraticCurveTo(-13, -1, -14, -4); x.stroke(); }
    else if (b.t === 'long') { x.fillRect(-9, -1.2, 18, 2.4); x.strokeRect(-9, -1.2, 18, 2.4); for (const e of [-9, 9]) { x.beginPath(); x.arc(e, 0, 2.3, 0, TAU); x.fill(); x.stroke(); } }
    else if (b.t === 'pelvis') { x.beginPath(); x.moveTo(-9, -3); x.lineTo(6, -5); x.lineTo(9, 1); x.lineTo(2, 5); x.lineTo(-8, 3); x.closePath(); x.fill(); x.stroke(); x.fillStyle = '#1E1E22'; x.beginPath(); x.ellipse(2, 0, 2.4, 1.6, 0, 0, TAU); x.fill(); }
    else if (b.t === 'vert') { x.fillRect(-2.5, -2.5, 5, 5); x.strokeRect(-2.5, -2.5, 5, 5); x.beginPath(); x.moveTo(-2.5, 0); x.lineTo(-5.5, -1); x.moveTo(2.5, 0); x.lineTo(5.5, -1); x.moveTo(0, -2.5); x.lineTo(0, -5.5); x.lineWidth = 1.4; x.strokeStyle = bone; x.stroke(); }
    else { x.lineWidth = 1.3; x.strokeStyle = bone; x.beginPath(); x.arc(0, 6, 9, -Math.PI * 0.8, -Math.PI * 0.2); x.stroke(); }
    x.restore();
  },
  // a skull in side view, snout to the left, about 100 units long; the loupe also draws the molar face
  _skull(x, sp, big) {
    const bone = '#EFE8D8', edge = '#7A6A50', ink = big ? 1.4 : 3;
    x.lineJoin = 'round';
    if (sp === 'bird') {
      x.fillStyle = bone; x.strokeStyle = edge; x.lineWidth = ink;
      x.beginPath(); x.arc(22, -6, 28, 0, TAU); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(-4, -16); x.quadraticCurveTo(-30, -12, -52, 2); x.quadraticCurveTo(-30, 6, -4, 10); x.closePath(); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(-52, 2); x.lineTo(-6, 0); x.stroke();
      x.fillStyle = 'rgba(60,50,40,0.55)'; x.beginPath(); x.arc(8, -8, 15, 0, TAU); x.fill();
      x.fillStyle = 'rgba(60,50,40,0.5)'; x.beginPath(); x.ellipse(-18, -6, 4, 2, -0.2, 0, TAU); x.fill();
      return;
    }
    if (sp === 'shrew') {
      const up = [[-58, 4], [-54, -4], [-30, -10], [0, -16], [26, -20], [44, -12], [50, 2], [38, 12], [10, 12], [-20, 8], [-52, 8]];
      x.fillStyle = bone; x.strokeStyle = edge; x.lineWidth = ink; x.beginPath(); U.poly(x, up, true); x.fill(); x.stroke();
      x.fillStyle = 'rgba(60,50,40,0.45)'; x.beginPath(); x.ellipse(-6, -4, 5, 4, 0, 0, TAU); x.fill();
      // an unbroken row of pointed teeth, the first ones hooked forward
      x.fillStyle = '#F8F4EA'; x.strokeStyle = edge; x.lineWidth = ink * 0.6;
      x.beginPath(); x.moveTo(-54, 6); x.quadraticCurveTo(-64, 10, -62, 18); x.lineTo(-52, 10); x.closePath(); x.fill(); x.stroke();
      for (let k = 0; k < 11; k++) { const tx = -48 + k * 6.4; x.beginPath(); x.moveTo(tx, 9); x.lineTo(tx + 3.2, 17 - (k % 3)); x.lineTo(tx + 6.4, 10); x.closePath(); x.fill(); x.stroke(); }
      // lower jaw
      x.fillStyle = bone; x.lineWidth = ink; x.beginPath(); U.poly(x, [[-56, 24], [-20, 22], [14, 24], [30, 20], [36, 34], [20, 32], [-20, 30], [-54, 28]], true); x.fill(); x.stroke();
      x.fillStyle = '#F8F4EA'; x.lineWidth = ink * 0.6; for (let k = 0; k < 10; k++) { const tx = -52 + k * 6.6; x.beginPath(); x.moveTo(tx, 23); x.lineTo(tx + 3.3, 17 + (k % 2)); x.lineTo(tx + 6.6, 22); x.closePath(); x.fill(); x.stroke(); }
      return;
    }
    // rodents: vole blunt-nosed with small eyes, wood mouse pointier with a big eye socket
    const vole = sp === 'vole';
    const up = vole ? [[-44, -4], [-40, -14], [-20, -22], [10, -26], [34, -22], [48, -8], [46, 8], [30, 16], [0, 14], [-24, 10], [-40, 6]] : [[-52, -2], [-46, -10], [-20, -20], [10, -26], [34, -22], [48, -8], [46, 8], [30, 16], [0, 14], [-26, 8], [-48, 4]];
    x.fillStyle = bone; x.strokeStyle = edge; x.lineWidth = ink; x.beginPath(); U.poly(x, up, true); x.fill(); x.stroke();
    x.fillStyle = 'rgba(60,50,40,0.5)'; x.beginPath(); x.ellipse(-4, -6, vole ? 11 : 15, vole ? 8 : 11, 0, 0, TAU); x.fill();
    x.strokeStyle = edge; x.lineWidth = ink; x.beginPath(); x.moveTo(-22, 2); x.quadraticCurveTo(-4, 10, 16, 2); x.stroke();
    // the big curved incisors, orange with enamel
    const inc = vole ? '#E09A38' : '#E8C060', nose = vole ? -40 : -48;
    x.strokeStyle = inc; x.lineWidth = big ? 5 : 9; x.lineCap = 'round';
    x.beginPath(); x.moveTo(nose + 4, 2); x.quadraticCurveTo(nose - 2, 8, nose, 18); x.stroke();
    // then the gap, and the cheek teeth
    for (let k = 0; k < 3; k++) {
      const tx = 2 + k * 9;
      x.fillStyle = '#F4EEDC'; x.strokeStyle = edge; x.lineWidth = ink * 0.6;
      x.beginPath(); if (vole) { x.moveTo(tx, 13); for (let z = 0; z < 4; z++) { x.lineTo(tx + z * 2.2 + 1.1, 20); x.lineTo(tx + z * 2.2 + 2.2, 15); } x.lineTo(tx + 8.8, 13); } else { x.moveTo(tx, 13); x.arc(tx + 2.2, 17, 2.2, Math.PI, 0, true); x.arc(tx + 6.6, 17, 2.2, Math.PI, 0, true); x.lineTo(tx + 8.8, 13); }
      x.closePath(); x.fill(); x.stroke();
    }
    // lower jaw with its incisor
    x.fillStyle = bone; x.strokeStyle = edge; x.lineWidth = ink; x.beginPath(); U.poly(x, [[nose + 6, 26], [-10, 24], [26, 26], [34, 16], [40, 30], [24, 38], [-10, 36], [nose + 8, 32]], true); x.fill(); x.stroke();
    x.strokeStyle = inc; x.lineWidth = big ? 4.5 : 8; x.beginPath(); x.moveTo(nose + 8, 28); x.quadraticCurveTo(nose, 26, nose - 2, 20); x.stroke();
    x.lineCap = 'butt';
  },
  // the loupe on the lower page: the selected skull, big, and a corner window on the molar face for rodents
  _loupe(x) {
    const st = this.st, i = st.sel, cx = 66, cy = 236, R = 56;
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.beginPath(); x.arc(cx + 2, cy + 3, R + 3, 0, TAU); x.fill();
    x.save(); x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.clip();
    x.fillStyle = '#2A2A2E'; x.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    if (i != null) {
      const sp = this.layout().bones[i].sp;
      x.save(); x.translate(cx - 2, cy - 8); x.scale(0.92, 0.92); this._skull(x, sp, true); x.restore();
      if (sp === 'vole' || sp === 'mouse') {
        const ox = cx + 26, oy = cy + 34;
        x.fillStyle = '#EFE8D8'; x.beginPath(); x.arc(ox, oy, 17, 0, TAU); x.fill(); x.strokeStyle = '#C8A24E'; x.lineWidth = 1; x.stroke();
        x.strokeStyle = '#6A5A40'; x.lineWidth = 0.9;
        for (let k = 0; k < 3; k++) {
          const my = oy - 10 + k * 7;
          if (sp === 'vole') { x.beginPath(); x.moveTo(ox - 10, my); for (let z = 0; z < 5; z++) { x.lineTo(ox - 8 + z * 4, my + (z % 2 ? 2.8 : -2.8)); } x.lineTo(ox + 10, my); x.stroke(); }
          else for (let z = 0; z < 3; z++) { x.beginPath(); x.arc(ox - 6 + z * 6, my, 2.3, 0, TAU); x.stroke(); }
        }
      }
    } else {
      x.fillStyle = '#9A9AA0'; x.font = '600 10px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center';
      x.fillText(L(tr('kafatası seç', 'pick a skull')), cx, cy + 3);
    }
    x.restore();
    x.fillStyle = MX.rad(x, cx, cy, R * 0.6, R, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.3)']]); x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fill();
    x.strokeStyle = '#2A2620'; x.lineWidth = 2.6; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.stroke();
    x.strokeStyle = '#C8A24E'; x.lineWidth = 1.2; x.beginPath(); x.arc(cx, cy, R - 1.6, 0, TAU); x.stroke();
  },
  // the key as it would be printed in a field guide; the selected skull's path lights up
  _key(x) {
    const st = this.st, run = st.run, sel = st.sel != null ? this.layout().bones[st.sel].sp : null, cnt = this.analyse().count;
    const lines = [
      [0, 'a', tr('1a  Diş yok, gaga var', '1a  No teeth: a beak'), 'bird'], [0, 'b', tr('1b  Dişler var', '1b  Teeth'), '→ 2'],
      [1, 'a', tr('2a  Kesintisiz sivri diş sırası', '2a  One unbroken row of pointed teeth'), 'shrew'], [1, 'b', tr('2b  Kesicilerden sonra boşluk', '2b  A gap after the incisors'), '→ 3'],
      [2, 'a', tr('3a  Azı yüzü zikzak', '3a  Molar faces zigzag'), 'vole'], [2, 'b', tr('3b  Azı yüzü yuvarlak tümsekli', '3b  Molar faces with round bumps'), 'mouse'],
    ];
    x.textAlign = 'left';
    lines.forEach(([n, k, t, to], j) => {
      const y = 192 + j * 17.5, path = sel ? this.SP[sel].path : null, taken = path && path[n] === k && n < st.node, here = sel && n === st.node;
      if (here) { x.fillStyle = 'rgba(232,184,58,0.22)'; x.fillRect(138, y - 11, 318, 15); }
      x.fillStyle = taken ? '#2F6A3A' : '#1B1A17'; x.font = (taken || here ? '700 ' : '400 ') + '10px "Atkinson Hyperlegible Next", sans-serif';
      x.fillText(L(t), 142 + (n ? 10 : 0), y);
      const leaf = this.SP[to];
      x.font = '700 9px "Courier Prime", monospace'; x.textAlign = 'right';
      x.fillStyle = leaf ? '#A0322A' : '#6A6458';
      x.fillText(leaf ? L(leaf.name).toLocaleUpperCase(I18N.lang === 'tr' ? 'tr' : 'en') + (cnt[to] ? ' ×' + cnt[to] : '') : to, 452, y);
      x.textAlign = 'left';
    });
    if (run.miss && !sel) { x.fillStyle = '#6A6458'; x.font = '400 8px "Atkinson Hyperlegible Next", sans-serif'; x.fillText(L(tr(`yanlış dal: ${run.miss}`, `wrong branches: ${run.miss}`)), 142, 297); }
  },
};
