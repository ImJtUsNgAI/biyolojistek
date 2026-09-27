'use strict';
// Grafting bench by the old Amasya apple tree. Four steps, as Hüseyin Usta learned them: one long, straight, sloping
// cut on the scion; set it on the rootstock so the green cambium rings touch (the scion is thinner, so centring it
// puts its cambium against dead wood: slide it to one side); wrap the union firmly, not too tight; then wait four
// weeks. A graft takes only when all three are right. Two living grafts save the tree.
const GRAFT = {
  RR: 26, RS: 15, BARK_R: 3, BARK_S: 2,   // rootstock and scion radii and bark thickness, cross-section units
  BAND: [0.5, 0.85],                      // tape tension that holds without strangling
  NEED: 2,
  INSET: [380, 86, 76],
  get GAP() { return (this.RR - this.BARK_R) - (this.RS - this.BARK_S); },

  open() {
    const S = G.S;
    const run = S.graft || (S.graft = { seed: 1 + Math.floor(Math.random() * 1e5), done: [] });
    this.st = { run, t: 0, g: null, drag: null, move: 0, hold: false };
    this.fresh();
    const body = h('div', 'kit rig ferm graft');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <div class="gr-mv"><button class="gr-l">◀</button><button class="gr-r">▶</button></div>
        <button class="gr-join">${L(tr('Birleştir', 'Join'))} ✓</button>
        <button class="gr-wrap">${L(tr('Bantla sar (basılı tut)', 'Wrap (hold)'))} ⟳</button>
        <button class="gr-next">${L(tr('Yeni anaç', 'New rootstock'))} ↺</button>
        <p class="fm-const">${L(tr('Kalem: yaşlı ağaçtan bir yıllık, gözlü dal. Anaç: köklü genç fidan. İkisi de aynı kalınlıkta değil!', 'Scion: a one-year shoot with buds, from the old tree. Rootstock: a young rooted sapling. They aren’t the same thickness!'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div>
      <p class="kit-msg"></p>`;
    const hold = (el, on, off) => {
      el.addEventListener('pointerdown', e => { e.preventDefault(); on(); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) el.addEventListener(ev, off);
    };
    hold(body.querySelector('.gr-l'), () => { this.st.move = -1; }, () => { if (this.st.move < 0) this.st.move = 0; });
    hold(body.querySelector('.gr-r'), () => { this.st.move = 1; }, () => { if (this.st.move > 0) this.st.move = 0; });
    hold(body.querySelector('.gr-wrap'), () => this.wrapOn(), () => this.wrapOff());
    body.querySelector('.gr-join').onclick = () => this.join();
    body.querySelector('.gr-next').onclick = () => { if (this.st.g.phase === 'done' || this.st.g.phase === 'cut' || this.st.g.phase === 'join') { this.fresh(); AU.sfx('click'); } };
    this.body = body; this.cv = body.querySelector('canvas');
    const at = e => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300]; };
    this.cv.addEventListener('pointerdown', e => { const [x, y] = at(e); this.press(x, y); });
    this.cv.addEventListener('pointermove', e => { if (this.st.drag) { const [x, y] = at(e); this.moveTo(x, y); } });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) this.cv.addEventListener(ev, () => this.release());
    // arrow keys slide the scion, space wraps; captured so they don't walk the player about
    this._key = e => {
      if (!this.pn) return;
      const g = this.st.g, arrow = e.code === 'ArrowLeft' || e.code === 'ArrowRight';
      if (arrow && g.phase === 'join') { e.preventDefault(); e.stopImmediatePropagation(); this.st.move = e.type === 'keydown' ? (e.code === 'ArrowLeft' ? -1 : 1) : 0; }
      else if (e.code === 'Space' && g.phase === 'wrap') { e.preventDefault(); e.stopImmediatePropagation(); if (e.type === 'keydown' && !e.repeat) this.wrapOn(); else if (e.type === 'keyup') this.wrapOff(); }
    };
    window.addEventListener('keydown', this._key, true); window.addEventListener('keyup', this._key, true);
    this.pn = UI.panel({ title: tr('Aşı masası · Yaşlı ağacı çoğaltmak', 'Grafting bench · Copying the old tree'), code: 'BİY.12.1.6', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.table(); this.loop();
  },
  fresh() {
    this.st.g = { phase: 'cut', pts: [], cutQ: 0, off: 0, tape: 0, wrapping: false, grow: 0, ok: null, why: null, n: this.st.run.done.length + 1 };
    this.st.drag = null; this.st.move = 0;
    if (this.body) { this._msg(tr('Kalemin ucunda tek, uzun, düz bir eğik kesik aç: bıçağı kesikli çizgi boyunca bir çekişte sürükle.', 'Make one long, straight, sloping cut at the end of the scion: drag the knife along the dotted line in a single stroke.')); this._sync(); }
  },

  // ---------------------------------------------------------------- 1 · the cut
  press(x, y) {
    const g = this.st.g;
    if (g.phase === 'cut' && x > 80 && x < 230 && y > 30 && y < 110) { this.st.drag = { kind: 'cut' }; g.pts = [[x, y]]; return; }
    if (g.phase === 'join' && y < 172 && x < 300) { this.st.drag = { kind: 'slide', x, off: g.off }; return; }
  },
  moveTo(x, y) {
    const d = this.st.drag, g = this.st.g;
    if (d.kind === 'cut') { const l = g.pts[g.pts.length - 1]; if (Math.hypot(x - l[0], y - l[1]) > 1.5) g.pts.push([x, y]); }
    else if (d.kind === 'slide') g.off = U.clamp(d.off + (x - d.x) / 2.2, -this.RR + this.RS - 4, this.RR - this.RS + 4);
  },
  release() {
    const d = this.st.drag; this.st.drag = null;
    if (d && d.kind === 'cut') this.cutFrom(this.st.g.pts);
  },
  // straightness: how far the stroke wanders from its own chord; the cut must also run along the stick, not across
  cutFrom(pts) {
    const g = this.st.g;
    if (g.phase !== 'cut' || pts.length < 2) return;
    const [x0, y0] = pts[0], [x1, y1] = pts[pts.length - 1], len = Math.hypot(x1 - x0, y1 - y0);
    if (len < 40 || Math.abs(x1 - x0) < 34) { g.pts = []; this._msg(tr('Kesik çok kısa ya da dalın enine: dal boyunca uzun, eğik bir çekişle kes.', 'The cut is too short or goes across the stick: cut along it in one long, sloping stroke.')); return; }
    let s = 0; for (const [x, y] of pts) { const d = Math.abs((y1 - y0) * x - (x1 - x0) * y + x1 * y0 - y1 * x0) / len; s += d * d; }
    this.cut(U.clamp(1 - Math.sqrt(s / pts.length) / 4, 0, 1));
  },
  cut(q) {
    const g = this.st.g;
    if (g.phase !== 'cut') return;
    g.cutQ = Math.round(q * 100) / 100; g.phase = 'join'; g.off = 0;
    AU.sfx(q >= 0.5 ? 'pen' : 'wrong');
    this._msg(q >= 0.5 ? tr('Düzgün, pürüzsüz bir yüzey. Şimdi kalemi anacın kesiğine oturt: sağdaki kesitte yeşil halkalar kambiyum.', 'A smooth, flat face. Now set the scion on the rootstock’s cut: in the cross-section on the right, the green rings are the cambium.')
      : tr('Kesik eğri büğrü oldu: yüzeyler tam oturmayacak, arada hava kalacak. İstersen yeni anaçla baştan başla; yoksa kalemi oturt.', 'The cut came out wobbly: the faces won’t sit flat and air will be left between them. Start again with a new rootstock if you like, or set the scion anyway.'));
    this._sync();
  },

  // ---------------------------------------------------------------- 2 · set the scion so the cambium rings touch
  contact(off) { return U.clamp(1 - Math.abs(Math.abs(off) - this.GAP) / 3, 0, 1); },
  join(off) {
    const g = this.st.g;
    if (g.phase !== 'join') return;
    if (off != null) g.off = off;
    g.cont = Math.round(this.contact(g.off) * 100) / 100; g.phase = 'wrap'; g.tape = 0; this.st.move = 0;
    AU.sfx('click');
    this._msg(g.cont >= 0.4 ? tr('Kambiyum kambiyuma değiyor! Şimdi bantla sar: düğmeyi basılı tut, gerginlik yeşil banttayken bırak.', 'Cambium is touching cambium! Now wrap it: hold the button and let go while the tension is in the green band.')
      : tr('Kalem oturdu, ama sağdaki kesite bak: yeşil halkalar değmiyor. Yine de sarabilirsin.', 'The scion is set, but look at the cross-section on the right: the green rings aren’t touching. You can wrap it anyway.'));
    this._sync();
  },

  // ---------------------------------------------------------------- 3 · wrap: firm, not strangling
  wrapOn() { const g = this.st.g; if (g.phase === 'wrap') g.wrapping = true; },
  wrapOff() { const g = this.st.g; if (g.phase === 'wrap' && g.wrapping) { g.wrapping = false; if (g.tape > 0.05) this.wrap(g.tape); } },
  wrap(t) {
    const g = this.st.g;
    if (g.phase !== 'wrap') return;
    g.tape = Math.round(U.clamp(t, 0, 1) * 100) / 100; g.wrapping = false;
    const [lo, hi] = this.BAND;
    g.why = g.cutQ < 0.5 ? 'cut' : g.cont < 0.4 ? 'cambium' : g.tape < lo ? 'loose' : g.tape > hi ? 'tight' : null;
    g.ok = !g.why; g.phase = 'grow'; g.grow = 0;
    AU.sfx('pen');
    this._msg(tr('Aşı yapıldı. Dört hafta bekliyoruz…', 'The graft is done. Four weeks of waiting…'));
    this._sync();
  },

  // ---------------------------------------------------------------- 4 · four weeks later
  settle() {
    const g = this.st.g, run = this.st.run;
    g.phase = 'done';
    run.done.push({ cutQ: g.cutQ, off: Math.round(g.off * 10) / 10, cont: g.cont, tape: g.tape, ok: g.ok, why: g.why });
    const W = {
      cut: tr('Kalem kurudu: eğri kesik yüzünden yüzeyler tam oturmadı, aradaki hava kalemi kuruttu.', 'The scion dried out: the wobbly cut left the faces badly matched, and the air between them dried it.'),
      cambium: tr('Kalem kurudu: kambiyumlar değmedi. Kalemin kambiyumu anacın odununa dayandı; odun hücreleri ölüdür, bölünüp kaynaşamaz.', 'The scion dried out: the cambium layers never touched. The scion’s cambium sat against the rootstock’s wood, and wood cells are dead: they can’t divide and knit together.'),
      loose: tr('Kalem kurudu: bant gevşekti, kalem kıpırdadı ve yara kurudu.', 'The scion dried out: the tape was loose, the scion wobbled and the wound dried.'),
      tight: tr('Kalem kurudu: bant çok sıkıydı, kabuğu ezdi ve soymuk borularını kapattı.', 'The scion dried out: the tape was too tight; it crushed the bark and shut the phloem.'),
    };
    const good = run.done.filter(r => r.ok).length;
    if (g.ok) { AU.sfx('chime'); this._msg(good >= this.NEED ? tr('Tuttu! Gözler patladı, yapraklar açılıyor. İki canlı fidan: yaşlı ağaç yaşayacak.', 'It took! The buds have burst and leaves are opening. Two living saplings: the old tree will live on.') : tr('Tuttu! Kallus iki yanı kaynaştırdı, gözler patlıyor. Bir tane daha: “Yeni anaç”.', 'It took! Callus has knitted the two sides together and the buds are bursting. One more: “New rootstock”.')); }
    else { AU.sfx('wrong'); this._msg(W[g.why]); }
    this._sync(); this.table(); G.save();
  },

  // ---------------------------------------------------------------- the loop, the table, the record
  step(dt) {
    const st = this.st, g = st.g;
    st.t += dt;
    if (g.phase === 'join' && st.move) g.off = U.clamp(g.off + st.move * dt * 9, -this.RR + this.RS - 4, this.RR - this.RS + 4);
    if (g.phase === 'wrap' && g.wrapping) { g.tape = Math.min(1, g.tape + dt * 0.55); if (g.tape >= 1) this.wrap(1); }
    if (g.phase === 'grow') { g.grow = Math.min(1, g.grow + dt / 2.4); if (g.grow >= 1) this.settle(); }
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
    const b = this.body, g = this.st.g;
    if (!b) return;
    b.querySelector('.gr-l').disabled = b.querySelector('.gr-r').disabled = b.querySelector('.gr-join').disabled = g.phase !== 'join';
    b.querySelector('.gr-wrap').disabled = g.phase !== 'wrap';
    b.querySelector('.gr-next').disabled = !(g.phase === 'done' || g.phase === 'cut' || g.phase === 'join');
  },
  analyse() {
    const d = this.st.run.done, good = d.filter(r => r.ok);
    return { n: d.length, good: good.length, done: good.length >= this.NEED, side: good.some(r => Math.abs(r.off) > 5), centredFail: d.some(r => r.why === 'cambium') };
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, run = this.st.run;
    const tape = r => r.tape < this.BAND[0] ? tr('gevşek', 'loose') : r.tape > this.BAND[1] ? tr('çok sıkı', 'too tight') : tr('iyi', 'good');
    const rows = run.done.map((r, i) => `<tr${r.ok ? '' : ' class="cl-bad"'}><td><b>${i + 1}</b></td><td>${L(r.cutQ >= 0.5 ? tr('düz', 'straight') : tr('eğri', 'wobbly'))}</td><td>%${Math.round(r.cont * 100)}</td><td>${L(tape(r))}</td><td>${r.ok ? '🌱 ' + L(tr('tuttu', 'took')) : '✗ ' + L(tr('kurudu', 'dried'))}</td></tr>`).join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>#</th><th>${L(tr('Kesik', 'Cut'))}</th><th>${L(tr('Kambiyum teması', 'Cambium contact'))}</th><th>${L(tr('Bant', 'Tape'))}</th><th>${L(tr('Sonuç', 'Result'))}</th></tr>${rows || `<tr><td colspan="5">${L(tr('Henüz aşı yok.', 'No grafts yet.'))}</td></tr>`}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.good >= 1, tr('İlk tutan aşı', 'First graft to take')], [a.side, tr('Kambiyum kambiyuma', 'Cambium to cambium')], [a.done, tr(`İki fidan (${Math.min(a.good, 2)}/2)`, `Two saplings (${Math.min(a.good, 2)}/2)`)],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.done && !S.flags.graftDone) {
      S.flags.graftDone = true;
      S.journal.exps.push({ title: tr('Aşı: yaşlı ağacı çoğaltmak', 'Grafting: copying the old tree'), code: 'BİY.12.1.6', t: Date.now(),
        head: [tr('Aşı', 'Graft'), tr('Kesik', 'Cut'), tr('Kambiyum teması', 'Cambium contact'), tr('Bant', 'Tape'), tr('Sonuç', 'Result')],
        rows: run.done.map((r, i) => [String(i + 1), r.cutQ >= 0.5 ? tr('düz', 'straight') : tr('eğri', 'wobbly'), '%' + Math.round(r.cont * 100), tape(r), r.ok ? tr('tuttu', 'took') : tr('kurudu', 'dried')]),
        note: tr('Aşı ancak kalemin ve anacın kambiyumu en az bir yanda birbirine değdiğinde tuttu. Kalem anaçtan ince olduğu için ortalamak işe yaramadı; bir yana kaydırmak gerekti. Tutan her fidan, yaşlı ağacın genetik bir kopyası: bu bir eşeysiz üreme.', 'A graft only took when the cambium of scion and rootstock touched on at least one side. The scion is thinner than the rootstock, so centring it didn’t work; it had to be moved to one side. Every graft that took is a genetic copy of the old tree: this is asexual reproduction.') });
      this._msg(tr('İki canlı fidan! Sonuçlar defterinde. Hüseyin Usta’ya göster.', 'Two living saplings! The results are in your journal. Show Hüseyin Usta.'));
      if (Q.at('asi', 'graft')) { UI.stamp(L(tr('AŞI', 'GRAFT'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  async close() {
    this.pn = null;
    window.removeEventListener('keydown', this._key, true); window.removeEventListener('keyup', this._key, true);
    if (this.st) { this.st.move = 0; this.st.drag = null; if (this.st.g) this.st.g.wrapping = false; }
    if (Q.at('asi', 'graft') && G.S.flags.graftDone) {
      await ask('asi_kinds');
      await UI.say('player', tr('İki fidan tuttu. Hüseyin Usta’ya götüreyim.', 'Two saplings have taken. Let me take them to Hüseyin Usta.'));
      Q.adv('asi');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc && this._bcLang === I18N.lang) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(88);
    // a potting bench under the old tree: planks, soil crumbs, a leaf or two
    for (let y = 0; y < 172; y += 22) { b.fillStyle = y % 44 ? '#8A6A48' : '#96764E'; b.fillRect(0, y, 460, 21); b.fillStyle = 'rgba(40,26,14,0.45)'; b.fillRect(0, y + 21, 460, 1); }
    for (let k = 0; k < 40; k++) { b.fillStyle = 'rgba(60,40,24,0.5)'; b.beginPath(); b.arc(R() * 300, 120 + R() * 50, 0.8 + R() * 1.6, 0, TAU); b.fill(); }
    for (let k = 0; k < 3; k++) { const x = 30 + R() * 240, y = 20 + R() * 120; b.fillStyle = 'rgba(90,130,50,0.8)'; b.beginPath(); b.ellipse(x, y, 7, 3.4, R() * 3, 0, TAU); b.fill(); }
    const [ix, iy, ir] = this.INSET;
    b.fillStyle = '#2A241E'; b.beginPath(); b.arc(ix, iy, ir + 7, 0, TAU); b.fill();
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5; for (let y = 186; y < 300; y += 12) { b.beginPath(); b.moveTo(8, y); b.lineTo(452, y); b.stroke(); }
    this._bc = c; this._bcLang = I18N.lang;
    return c;
  },
  // cross-section inset: bark, cambium, wood, pith of both stems, with the touching arc lit up
  _inset(x, g) {
    const [ix, iy, ir] = this.INSET, k = ir / (this.RR + 4), sx = ix + g.off * k;
    x.save(); x.beginPath(); x.arc(ix, iy, ir, 0, TAU); x.clip();
    x.fillStyle = '#E8E0CC'; x.fillRect(ix - ir, iy - ir, ir * 2, ir * 2);
    const stem = (cx, r, bark, alpha) => {
      x.globalAlpha = alpha;
      x.fillStyle = '#7A5A38'; x.beginPath(); x.arc(cx, iy, r * k, 0, TAU); x.fill();
      x.fillStyle = '#6AA040'; x.beginPath(); x.arc(cx, iy, (r - bark) * k, 0, TAU); x.fill();
      x.fillStyle = '#E4D2A4'; x.beginPath(); x.arc(cx, iy, (r - bark - 1) * k, 0, TAU); x.fill();
      x.fillStyle = '#F6EEDA'; x.beginPath(); x.arc(cx, iy, r * 0.25 * k, 0, TAU); x.fill();
      x.globalAlpha = 1;
    };
    stem(ix, this.RR, this.BARK_R, 1);
    if (g.phase !== 'cut') {
      stem(sx, this.RS, this.BARK_S, 0.8);
      // where the two cambium rings meet
      const cR = (this.RR - this.BARK_R) * k, cS = (this.RS - this.BARK_S) * k;
      x.strokeStyle = 'rgba(210,255,120,0.95)'; x.lineWidth = 3.2; x.lineCap = 'round';
      for (let a = 0; a < TAU; a += 0.05) {
        const px = sx + Math.cos(a) * cS, py = iy + Math.sin(a) * cS;
        if (Math.abs(Math.hypot(px - ix, py - iy) - cR) < 1.6 * k) { x.beginPath(); x.moveTo(px, py); x.lineTo(sx + Math.cos(a + 0.05) * cS, iy + Math.sin(a + 0.05) * cS); x.stroke(); }
      }
    }
    x.restore();
    x.fillStyle = '#F4EEDD'; x.font = '700 8px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center';
    x.fillText(L(tr('kesit · yeşil: kambiyum', 'cross-section · green: cambium')), ix, iy + ir + 5);
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, g = st.g, t = st.t;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    if (g.phase === 'cut') {
      // the scion, big, lying on the bench; the dotted guide for the sloping cut
      x.fillStyle = '#7A5A38'; U.rr(x, 20, 62, 200, 16, 7); x.fill(); x.strokeStyle = '#3A2A1A'; x.lineWidth = 1; x.stroke();
      for (const bx of [50, 96, 142]) { x.fillStyle = '#5A3A22'; x.beginPath(); x.moveTo(bx, 62); x.lineTo(bx + 6, 54); x.lineTo(bx + 9, 62); x.closePath(); x.fill(); }
      x.strokeStyle = 'rgba(255,240,160,0.9)'; x.setLineDash([4, 3]); x.lineWidth = 1.2; x.beginPath(); x.moveTo(130, 60); x.lineTo(214, 80); x.stroke(); x.setLineDash([]);
      if (g.pts.length > 1) { x.strokeStyle = '#F4F2EC'; x.lineWidth = 1.6; x.beginPath(); g.pts.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.stroke(); }
      else { x.fillStyle = 'rgba(255,240,160,0.9)'; x.font = '700 12px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText('🔪', 124 + Math.sin(t * 3) * 4, 52); }
    } else {
      // side view: the rootstock stub in its pot, the scion on top, shifted by the slider
      const cx = 150, off = g.off * 2.2, rw = this.RR * 1.1, sw = this.RS * 1.1, dead = g.phase === 'done' && !g.ok, gr = g.phase === 'grow' ? g.grow : g.phase === 'done' ? 1 : 0;
      x.fillStyle = '#A8583A'; x.beginPath(); x.moveTo(cx - 44, 140); x.lineTo(cx + 44, 140); x.lineTo(cx + 36, 170); x.lineTo(cx - 36, 170); x.closePath(); x.fill();
      x.fillStyle = '#4A3624'; x.fillRect(cx - 44, 136, 88, 6);
      x.fillStyle = '#6E5A40'; x.fillRect(cx - rw, 96, rw * 2, 42); x.strokeStyle = '#3A2A1A'; x.lineWidth = 1; x.strokeRect(cx - rw, 96, rw * 2, 42);
      x.fillStyle = dead ? U.shade('#7A5A38', -0.35 * gr) : '#7A5A38'; x.fillRect(cx + off - sw, 26, sw * 2, 72); x.strokeRect(cx + off - sw, 26, sw * 2, 72);
      if (g.cutQ < 0.5) { x.strokeStyle = 'rgba(30,20,10,0.8)'; x.beginPath(); for (let k = 0; k <= 8; k++) x.lineTo(cx + off - sw + k * sw / 4, 97 + (k % 2 ? 2 : -1)); x.stroke(); }
      // buds, then leaves if the graft takes
      for (const [by, s] of [[40, 1], [62, -1], [84, 1]]) {
        const bx = cx + off + s * sw;
        if (g.ok && gr > 0.5) { const l = (gr - 0.5) * 2; x.fillStyle = '#6AA040'; x.beginPath(); x.ellipse(bx + s * 8 * l, by - 4 * l, 9 * l + 1, 4 * l + 1, s * -0.5, 0, TAU); x.fill(); }
        else { x.fillStyle = dead ? '#3A2A1A' : '#5A3A22'; x.beginPath(); x.moveTo(bx, by + 3); x.lineTo(bx + s * 6, by - 3); x.lineTo(bx, by - 3); x.closePath(); x.fill(); }
      }
      // the tape: turns appear with tension, green when the tension is right
      const turns = g.phase === 'wrap' ? g.tape : g.tape || 0;
      if (turns > 0) {
        const [lo, hi] = this.BAND, okT = turns >= lo && turns <= hi;
        for (let k = 0; k < Math.ceil(turns * 7); k++) { x.fillStyle = okT ? 'rgba(210,228,200,0.95)' : 'rgba(236,220,200,0.95)'; x.save(); x.translate(cx + off / 2, 84 + k * 4); x.rotate(-0.2); x.fillRect(-rw - 2, -1.6, rw * 2 + 4, 3.2); x.restore(); }
      }
      // callus swelling at the union as the weeks pass
      if (g.ok && gr > 0.2) { x.fillStyle = `rgba(236,226,190,${(0.8 * gr).toFixed(2)})`; x.beginPath(); x.ellipse(cx + off / 2, 97, rw + 3 * gr, 4 * gr, 0, 0, TAU); x.fill(); }
      if (g.phase === 'wrap') {
        const [lo, hi] = this.BAND;
        x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(220, 24, 12, 120);
        x.fillStyle = 'rgba(90,176,96,0.8)'; x.fillRect(220, 144 - hi * 120, 12, (hi - lo) * 120);
        x.fillStyle = '#F4EEDD'; x.fillRect(216, 144 - g.tape * 120 - 1, 20, 2.4);
        x.font = '600 8px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText(L(tr('gerginlik', 'tension')), 226, 18);
      }
      if (g.phase === 'grow' || g.phase === 'done') {
        x.fillStyle = '#F4EEDD'; x.font = '700 12px "Courier Prime", monospace'; x.textAlign = 'left';
        x.fillText(L(tr(`${Math.min(4, Math.floor(gr * 4 + 0.001))}. hafta`, `Week ${Math.min(4, Math.floor(gr * 4 + 0.001))}`)), 222, 40);
      }
    }
    this._inset(x, g);
    // lower page: the four steps and the saplings so far
    const steps = [tr('Kes', 'Cut'), tr('Birleştir', 'Join'), tr('Sar', 'Wrap'), tr('Bekle', 'Wait')], cur = ['cut', 'join', 'wrap', 'grow', 'done'].indexOf(g.phase);
    x.font = '700 10px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left';
    x.fillStyle = '#1B1A17'; x.fillText(L(tr(`${g.n}. anaç`, `Rootstock ${g.n}`)), 12, 190);
    steps.forEach((s, i) => {
      const bx = 12 + i * 110, on = i === cur, ok = i < cur;
      x.fillStyle = on ? 'rgba(90,120,60,0.9)' : ok ? 'rgba(90,150,90,0.8)' : 'rgba(0,0,0,0.12)'; U.rr(x, bx, 200, 100, 22, 5); x.fill();
      x.fillStyle = on || ok ? '#F4EEDD' : '#4A4640'; x.fillText((ok ? '✓ ' : (i + 1) + ' · ') + L(s), bx + 8, 215);
    });
    const a = this.analyse();
    for (let i = 0; i < Math.max(2, a.n); i++) { const r = st.run.done[i]; x.font = '400 14px sans-serif'; x.fillText(r ? (r.ok ? '🌱' : '🥀') : '○', 12 + i * 22, 250); }
  },
};
