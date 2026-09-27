'use strict';
// Sweep-net bench for the stork chick: five brisk sweeps through the unsprayed meadow and five through the sprayed
// one (the same effort in both: a fair comparison). Sweep too slowly and the grasshoppers jump clear and the
// butterflies lift off. Then sort the catch into plant-eaters and hunters, and the two pyramids stand side by side:
// with the plant-eaters gone, there is nothing left for the hunters, the frogs or a stork family to eat.
const SWEEP = {
  SITES: { meadow: tr('İlaçsız çayır', 'Unsprayed meadow'), sprayed: tr('İlaçlı çayır', 'Sprayed meadow') },
  N: 5,
  // animals in the grass per sweep, by site
  POP: { meadow: { grasshopper: 3, caterpillar: 2, aphid: 6, butterfly: 1.2, ladybird: 1.4, spider: 2 }, sprayed: { grasshopper: 0.4, caterpillar: 0, aphid: 1, butterfly: 0, ladybird: 0, spider: 0.4 } },
  JUMP: { grasshopper: 150, butterfly: 220 },   // sweep slower than this (px/s) and they get away
  LEVEL: { grasshopper: 1, caterpillar: 1, aphid: 1, butterfly: 1, ladybird: 2, spider: 2 },
  NAME: { grasshopper: tr('Çekirge', 'Grasshopper'), caterpillar: tr('Tırtıl', 'Caterpillar'), aphid: tr('Yaprak biti', 'Aphid'), butterfly: tr('Kelebek', 'Butterfly'), ladybird: tr('Uğur böceği', 'Ladybird'), spider: tr('Örümcek', 'Spider') },
  BAND: [66, 156],

  open() {
    const S = G.S;
    const run = S.sweep || (S.sweep = { seed: 1 + Math.floor(Math.random() * 1e5), sweeps: { meadow: [], sprayed: [] }, placed: {} });
    this.st = { run, t: 0, site: run.sweeps.meadow.length < this.N ? 'meadow' : 'sprayed', bugs: [], drag: null, sel: null, fly: [] };
    const body = h('div', 'kit rig ferm sweep');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Nerede?', 'Where?'))}</label>
        <div class="sw-site">${Object.keys(this.SITES).map(s => `<button data-s="${s}">${U.esc(L(this.SITES[s]))}</button>`).join('')}</div>
        <p class="fm-const">${L(tr('Her iki çayırda da aynı: 5 süpürme, aynı böcek ağı, aynı hız. Ağı otların içinden bir uçtan öbür uca, tek ve hızlı bir hareketle geçir.', 'The same in both meadows: 5 sweeps, the same net, the same speed. Swing the net through the grass from one end to the other in a single brisk stroke.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div>
      <p class="kit-msg"></p>`;
    body.querySelectorAll('.sw-site button').forEach(b => b.onclick = () => this.pickSite(b.dataset.s));
    this.body = body; this.cv = body.querySelector('canvas');
    const at = e => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300]; };
    this.cv.addEventListener('pointerdown', e => { const [x, y] = at(e); this.press(x, y); });
    this.cv.addEventListener('pointermove', e => { const [x, y] = at(e); this.st.net = [x, y]; if (this.st.drag) this.st.drag.pts.push([x, y]); });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) this.cv.addEventListener(ev, () => this.release());
    this.pn = UI.panel({ title: tr('Böcek ağı · Çayırda kim var, kim kimi yer?', 'Sweep net · Who lives in the meadow, and who eats whom?'), code: 'BİY.10.2.3', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this.spawn(); this._msg(this.hint()); this._sync(); this.table(); this.loop();
  },
  phase() { const r = this.st.run; return r.sweeps.meadow.length < this.N || r.sweeps.sprayed.length < this.N ? 'sample' : this.KINDS().every(k => r.placed[k]) ? 'done' : 'pyramid'; },
  KINDS() { const tot = this.totals('meadow'); return INSECT.KINDS.filter(k => tot[k] > 0); },
  hint() {
    const ph = this.phase(), r = this.st.run, n = r.sweeps[this.st.site].length;
    if (ph === 'sample') return n < this.N ? tr(`${L(this.SITES[this.st.site])}: ${n + 1}. süpürme. Ağı otların içinden hızla geçir.`, `${L(this.SITES[this.st.site])}: sweep ${n + 1}. Swing the net briskly through the grass.`) : tr('Bu çayır tamam. Öbür çayıra geç: aynı sayıda süpürme, adil karşılaştırma.', 'This meadow is done. Switch to the other one: the same number of sweeps makes it a fair comparison.');
    if (ph === 'pyramid') return tr('Aşağıdaki hayvanları besin piramidine yerleştir: önce birine, sonra yukarıdaki basamağa dokun.', 'Place the animals below on the food pyramid: tap one, then tap its level above.');
    return tr('Piramitler hazır.', 'The pyramids are ready.');
  },
  pickSite(s) {
    if (!this.SITES[s] || s === this.st.site) return;
    const r = this.st.run, cur = r.sweeps[this.st.site].length;
    if (cur > 0 && cur < this.N) { this._msg(tr(`Önce bu çayırdaki ${this.N} süpürmeyi bitir: yarım kalan örnek karşılaştırmayı bozar.`, `Finish the ${this.N} sweeps in this meadow first: a half-done sample spoils the comparison.`)); return; }
    this.st.site = s; AU.sfx('click'); this.spawn(); this._msg(this.hint()); this._sync();
  },
  // the animals in the grass for the next sweep, the same for everyone with this save
  spawn() {
    const st = this.st, n = st.run.sweeps[st.site].length, R = MX.rng(st.run.seed + (st.site === 'sprayed' ? 5000 : 0) + n * 37);
    st.bugs = [];
    const pop = this.POP[st.site];
    for (const k of INSECT.KINDS) {
      let c = Math.floor(pop[k]) + (R() < pop[k] % 1 ? 1 : 0);
      for (let i = 0; i < c; i++) st.bugs.push({ k, x: 40 + R() * 380, y: this.BAND[0] + 6 + R() * (this.BAND[1] - this.BAND[0] - 12), ph: R() * TAU, gone: 0 });
    }
  },
  press(x, y) {
    const ph = this.phase();
    if (ph === 'sample' && y < 172) { this.st.drag = { pts: [[x, y]], t0: performance.now() }; return; }
    if (ph === 'pyramid' || ph === 'done') this.tapPyramid(x, y);
  },
  release() {
    const d = this.st.drag; this.st.drag = null;
    if (d && d.pts.length > 1) this.sweep(d.pts, Math.max(0.05, (performance.now() - d.t0) / 1000));
  },
  // one sweep: every animal close to the net's path is caught, unless the net was too slow for it
  sweep(pts, dur) {
    const st = this.st, run = st.run, list = run.sweeps[st.site];
    if (this.phase() !== 'sample' || list.length >= this.N) return null;
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const span = Math.max(...pts.map(p => p[0])) - Math.min(...pts.map(p => p[0]));
    if (span < 240) { this._msg(tr('Böcek ağı otların ancak bir kısmından geçti: bir uçtan öbür uca süpür.', 'The net only went through part of the grass: sweep from one end to the other.')); return null; }
    // a net swung over the tops (or along the ground) would count as an empty sample and spoil the comparison
    if (pts.filter(p => p[1] > this.BAND[0] - 12 && p[1] < this.BAND[1] + 12).length < pts.length / 2) { this._msg(tr('Böcek ağı otların üstünden geçti: otların ortasından süpür.', 'The net skimmed over the grass: sweep through the middle of it.')); return null; }
    const speed = len / dur, got = {}, near = (b) => { let m = 1e9; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1, t = U.clamp(((b.x - ax) * dx + (b.y - ay) * dy) / l, 0, 1); m = Math.min(m, Math.hypot(b.x - ax - t * dx, b.y - ay - t * dy)); } return m; };
    let fled = 0;
    for (const b of st.bugs) {
      if (b.gone || near(b) > 24) continue;
      if (this.JUMP[b.k] && speed < this.JUMP[b.k]) { b.gone = -1; fled++; continue; }
      b.gone = 1; got[b.k] = (got[b.k] || 0) + 1;
    }
    list.push(got);
    const n = Object.values(got).reduce((a, b) => a + b, 0);
    AU.sfx(n ? 'pen' : 'click');
    this._msg(fled && speed < 150 ? tr(`Yavaş süpürdün: ${fled} hayvan zıplayıp kaçtı. Daha hızlı!`, `You swept slowly: ${fled} animals jumped clear. Faster!`) : n ? tr(`${n} hayvan yakalandı.`, `${n} animals caught.`) : tr('Böcek ağı boş geldi.', 'The net came up empty.'));
    if (list.length < this.N) setTimeout(() => { if (this.pn) { this.spawn(); } }, 700);
    else if (this.phase() === 'sample') { const other = st.site === 'meadow' ? 'sprayed' : 'meadow'; st.site = other; this.spawn(); this._msg(tr(`Bu çayır tamam. Şimdi ${L(this.SITES[other]).toLocaleLowerCase('tr-TR')}: yine ${this.N} süpürme.`, `This meadow is done. Now the ${L(this.SITES[other]).toLowerCase()}: ${this.N} sweeps again.`)); }
    else this._msg(this.phase() === 'pyramid' ? tr('İki çayır da örneklendi! Şimdi hayvanları besin piramidine yerleştir.', 'Both meadows are sampled! Now place the animals on the food pyramid.') : this.hint());
    this._sync(); this.table(); G.save();
    return got;
  },
  totals(site) { const t = {}; for (const s of this.st.run.sweeps[site]) for (const k in s) t[k] = (t[k] || 0) + s[k]; return t; },

  // ---------------------------------------------------------------- the pyramid: who eats plants, who eats animals
  LEVELS: [[1, tr('Otçullar (birincil tüketiciler)', 'Plant-eaters (primary consumers)')], [2, tr('Etçiller (ikincil tüketiciler)', 'Meat-eaters (secondary consumers)')]],
  WHY: {
    grasshopper: tr('Çekirge çiğneyici çeneleriyle ot yer: otçul.', 'The grasshopper chews grass with its jaws: a plant-eater.'),
    caterpillar: tr('Tırtıl yaprak yer: otçul.', 'The caterpillar eats leaves: a plant-eater.'),
    aphid: tr('Yaprak biti bitkinin özsuyunu emer: otçul.', 'The aphid sucks the plant’s sap: a plant-eater.'),
    butterfly: tr('Kelebek çiçeklerin nektarını içer: otçul.', 'The butterfly drinks nectar from flowers: a plant-eater.'),
    ladybird: tr('Uğur böceği yaprak bitlerini yer: etçil. Bir tanesi günde onlarca bit yiyebilir.', 'The ladybird eats aphids: a meat-eater. One can eat dozens a day.'),
    spider: tr('Örümcek ağına düşen böcekleri yer: etçil.', 'The spider eats insects caught in its web: a meat-eater.'),
  },
  place(k, lv) {
    const run = this.st.run;
    if (this.phase() !== 'pyramid' || run.placed[k] || !this.LEVEL[k]) return false;
    if (this.LEVEL[k] !== lv) { AU.sfx('wrong'); this._msg(tr(`${L(this.NAME[k])} orada değil. Ne yiyor? Ona göre yerleştir.`, `The ${L(this.NAME[k]).toLowerCase()} doesn’t go there. What does it eat? Place it by that.`)); return false; }
    run.placed[k] = lv; this.st.sel = null; AU.sfx('pen');
    this._msg(this.WHY[k]);
    this._sync(); this.table(); G.save();
    return true;
  },
  // canvas hit areas for the pyramid phase
  _chips() { return this.KINDS().map((k, i) => ({ k, x: 14 + i * 74, y: 250, w: 68, h: 36 })); },
  _levelBox(lv) { return lv === 1 ? { x: 20, y: 108, w: 420, h: 26 } : { x: 60, y: 76, w: 340, h: 26 }; },
  tapPyramid(x, y) {
    const run = this.st.run;
    const chip = this._chips().find(c => x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h && !run.placed[c.k]);
    if (chip) { this.st.sel = chip.k; AU.sfx('click'); return; }
    if (!this.st.sel) return;
    for (const [lv] of this.LEVELS) { const b = this._levelBox(lv); if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) { this.place(this.st.sel, lv); return; } }
  },

  // ---------------------------------------------------------------- the loop, the table, the record
  step(dt) {
    const st = this.st; st.t += dt;
    for (const b of st.bugs) if (b.gone === -1) { b.y -= dt * 60; b.x += dt * 40 * Math.sin(b.ph); }
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
    const b = this.body, run = this.st.run;
    if (!b) return;
    b.querySelectorAll('.sw-site button').forEach(el => { const s = el.dataset.s; el.classList.toggle('on', this.st.site === s); el.classList.toggle('done', run.sweeps[s].length >= this.N); el.disabled = this.phase() !== 'sample'; });
  },
  analyse() {
    const m = this.totals('meadow'), s = this.totals('sprayed'), sum = t => Object.values(t).reduce((a, b) => a + b, 0), kinds = t => Object.keys(t).filter(k => t[k] > 0).length;
    const lv = (t, l) => Object.keys(t).filter(k => this.LEVEL[k] === l).reduce((a, k) => a + t[k], 0);
    return { m, s, nM: sum(m), nS: sum(s), kM: kinds(m), kS: kinds(s), hM: lv(m, 1), hS: lv(s, 1), cM: lv(m, 2), cS: lv(s, 2), sampled: this.phase() !== 'sample', done: this.phase() === 'done' };
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, run = this.st.run;
    const rows = INSECT.KINDS.filter(k => a.m[k] || a.s[k]).map(k => `<tr><td><b>${U.esc(L(this.NAME[k]))}</b></td><td>${a.m[k] || 0}</td><td>${a.s[k] || 0}</td><td>${run.placed[k] ? L(run.placed[k] === 1 ? tr('otçul', 'plant-eater') : tr('etçil', 'meat-eater')) : '?'}</td></tr>`).join('');
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Hayvan', 'Animal'))}</th><th>${L(tr('İlaçsız', 'Unsprayed'))} (${run.sweeps.meadow.length}/${this.N})</th><th>${L(tr('İlaçlı', 'Sprayed'))} (${run.sweeps.sprayed.length}/${this.N})</th><th>${L(tr('Beslenme', 'Diet'))}</th></tr>${rows || `<tr><td colspan="4">${L(tr('Henüz süpürme yok.', 'No sweeps yet.'))}</td></tr>`}<tr><td><b>${L(tr('Toplam', 'Total'))}</b></td><td><b>${a.nM}</b> · ${a.kM} ${L(tr('tür', 'kinds'))}</td><td><b>${a.nS}</b> · ${a.kS} ${L(tr('tür', 'kinds'))}</td><td></td></tr></table>`;
    body.querySelector('.stamps').innerHTML = [
      [run.sweeps.meadow.length >= this.N && run.sweeps.sprayed.length >= this.N, tr('İki çayır, eşit emek', 'Two meadows, equal effort')], [a.done, tr('Besin piramidi', 'Food pyramid')], [a.sampled && a.nM > a.nS * 4, tr('İlaçlıda hayat yok gibi', 'The sprayed one is nearly empty')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.done && !S.flags.sweepDone) {
      S.flags.sweepDone = true;
      S.journal.exps.push({ title: tr('Böcek ağıyla örnekleme', 'Sweep-net sampling'), code: 'BİY.10.2.3', t: Date.now(),
        head: [tr('Hayvan', 'Animal'), tr('İlaçsız', 'Unsprayed'), tr('İlaçlı', 'Sprayed'), tr('Beslenme', 'Diet')],
        rows: INSECT.KINDS.filter(k => a.m[k] || a.s[k]).map(k => [this.NAME[k], String(a.m[k] || 0), String(a.s[k] || 0), run.placed[k] === 1 ? tr('otçul', 'plant-eater') : tr('etçil', 'meat-eater')]),
        chart: { values: [a.hM, a.cM, a.hS, a.cS], labels: [tr('Otçul · ilaçsız', 'Plant-eaters · unsprayed'), tr('Etçil · ilaçsız', 'Meat-eaters · unsprayed'), tr('Otçul · ilaçlı', 'Plant-eaters · sprayed'), tr('Etçil · ilaçlı', 'Meat-eaters · sprayed')], colors: ['#7AA640', '#B8401A', '#B8C890', '#D89A80'], unit: tr('hayvan (5 süpürme)', 'animals (5 sweeps)') },
        note: tr('İlaçsız çayırda altı türden çok sayıda hayvan vardı; ilaçlı çayırda neredeyse hiç. Her basamakta bir alttakinden daha az hayvan var, çünkü enerjinin çoğu her basamakta ısı olarak kaybolur. Otçullar yok olunca etçillere, kurbağalara ve leyleklere de besin kalmaz.', 'The unsprayed meadow had many animals of six kinds; the sprayed one had almost none. Each level has fewer animals than the one below, because most of the energy is lost as heat at every step. When the plant-eaters go, nothing is left for the meat-eaters, the frogs or the storks.') });
      this._msg(tr('Piramitler hazır! İlaçlı çayırda piramidin tabanı çökmüş. Sonuçlar defterinde.', 'The pyramids are ready! In the sprayed meadow the base of the pyramid has collapsed. The results are in your journal.'));
      if (Q.at('leylek', 'sweep')) { UI.stamp(L(tr('ATRAP', 'SWEEP NET'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  async close() {
    this.pn = null;
    if (this.st) this.st.drag = null;
    if (Q.at('leylek', 'sweep') && G.S.flags.sweepDone) {
      await ask('leylek_ten');
      await UI.say('player', tr('Leylek yavrusunun aç kalmasının nedeni ortada. Şimdi yakalananlara merceğimle yakından bakayım: kim ne yiyor?', 'It’s clear why the chick is starving. Now let me look at the catch closely with my lens: who eats what?'));
      Q.adv('leylek');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc && this._bcLang === I18N.lang) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    b.fillStyle = MX.lin(b, 0, 0, 0, 172, [[0, '#BFD8EC'], [0.35, '#E4EEF0'], [0.36, '#9AB870'], [1, '#6E9444']]); b.fillRect(0, 0, 460, 172);
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5; for (let y = 186; y < 300; y += 12) { b.beginPath(); b.moveTo(8, y); b.lineTo(452, y); b.stroke(); }
    this._bc = c; this._bcLang = I18N.lang;
    return c;
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, t = st.t, run = st.run, ph = this.phase();
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    if (ph === 'sample') {
      const sprayed = st.site === 'sprayed', R = MX.rng(99);
      // tall grass swaying; the sprayed meadow is thinner and yellower, no flowers
      for (let k = 0; k < 150; k++) {
        const gx = R() * 460, h = 50 + R() * 70, sw = Math.sin(t * 1.6 + gx * 0.05) * 4;
        x.strokeStyle = sprayed ? `rgba(${160 + R() * 30 | 0},${150 + R() * 20 | 0},80,0.85)` : `rgba(${70 + R() * 30 | 0},${120 + R() * 40 | 0},50,0.85)`; x.lineWidth = 1.2;
        x.beginPath(); x.moveTo(gx, 172); x.quadraticCurveTo(gx + sw * 0.5, 172 - h * 0.5, gx + sw, 172 - h); x.stroke();
        if (!sprayed && k % 9 === 0) { x.fillStyle = ['#F4E060', '#F4F2EC', '#C878B8'][k % 3]; x.beginPath(); x.arc(gx + sw, 172 - h, 2.4, 0, TAU); x.fill(); }
      }
      for (const b of st.bugs) if (b.gone <= 0) INSECT.draw(x, b.k, b.x, b.y + Math.sin(t * 3 + b.ph) * (b.k === 'butterfly' ? 4 : 1), b.k === 'aphid' ? 1.3 : 1, b.k === 'butterfly' ? Math.sin(t * 8 + b.ph) * 0.2 : 0);
      // the net: a hoop on a stick, following the pointer
      const d = st.drag, [nx, ny] = st.net || [230, 110];
      if (d) { x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); d.pts.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.stroke(); }
      x.strokeStyle = '#6A4A2A'; x.lineWidth = 2.2; x.beginPath(); x.moveTo(nx + 16, ny + 12); x.lineTo(nx + 60, ny + 60); x.stroke();
      x.strokeStyle = '#E8E4DA'; x.lineWidth = 1.8; x.beginPath(); x.ellipse(nx, ny, 14, 20, 0.5, 0, TAU); x.stroke();
      x.fillStyle = 'rgba(240,238,230,0.35)'; x.fill();
      x.fillStyle = '#1B1A17'; x.font = '700 11px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left';
      x.fillText(L(this.SITES[st.site]) + ' · ' + L(tr(`süpürme ${Math.min(this.N, run.sweeps[st.site].length + 1)}/${this.N}`, `sweep ${Math.min(this.N, run.sweeps[st.site].length + 1)}/${this.N}`)), 10, 18);
    } else {
      // two pyramids side by side: the meadow's and the sprayed meadow's, bar widths by animals caught
      const a = this.analyse(), W = v => 8 + Math.min(1, v / 40) * 170;
      for (const [cx, site, hN, cN] of [[118, 'meadow', a.hM, a.cM], [342, 'sprayed', a.hS, a.cS]]) {
        x.fillStyle = '#F4EEDD'; x.font = '700 10px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText(L(this.SITES[site]), cx, 14);
        const rows = [[140, 190, '#5A8A3A', tr('Çayır bitkileri', 'Meadow plants')], [108, W(hN), '#9AC060', null], [76, W(cN), '#D06A3A', null], [44, site === 'meadow' ? 26 : 4, '#E8E4DA', tr('Kurbağa, leylek', 'Frog, stork')]];
        for (const [y, w, col, lab] of rows) { x.fillStyle = col; x.fillRect(cx - w / 2, y, w, 26); x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 0.8; x.strokeRect(cx - w / 2, y, w, 26); if (lab) { x.fillStyle = '#1B1A17'; x.font = '600 8px "Atkinson Hyperlegible Next", sans-serif'; x.fillText(L(lab), cx, y + 16); } }
        x.fillStyle = '#1B1A17'; x.font = '700 9px "Courier Prime", monospace'; x.fillText(String(hN), cx, 124); x.fillText(String(cN), cx, 92);
      }
      // the level labels in the middle double as the drop targets for the animals
      for (const [lv, lab] of this.LEVELS) { const b = this._levelBox(lv); x.strokeStyle = st.sel ? 'rgba(255,240,160,0.9)' : 'rgba(255,255,255,0.3)'; x.setLineDash([4, 3]); x.lineWidth = 1.2; x.strokeRect(b.x, b.y, b.w, b.h); x.setLineDash([]); x.fillStyle = 'rgba(20,20,16,0.75)'; U.rr(x, 230 - 70, b.y + 6.5, 140, 13, 4); x.fill(); x.fillStyle = '#F4EEDD'; x.font = '600 8px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText(L(lab), 230, b.y + 16); }
      // the animals to place, on the lower page
      for (const c of this._chips()) {
        const done = run.placed[c.k], on = st.sel === c.k;
        x.fillStyle = done ? 'rgba(90,150,90,0.5)' : on ? 'rgba(255,230,140,0.95)' : '#FBF8EE'; U.rr(x, c.x, c.y, c.w, c.h, 6); x.fill(); x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = 0.8; x.stroke();
        INSECT.draw(x, c.k, c.x + 16, c.y + 18, c.k === 'aphid' ? 2 : 1.2);
        x.fillStyle = '#1B1A17'; x.font = '600 8px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left'; x.fillText(L(this.NAME[c.k]), c.x + 30, c.y + 21);
        if (done) { x.fillText('✓', c.x + c.w - 10, c.y + 10); }
      }
    }
    // lower page during sampling: the two trays so far
    if (ph === 'sample') {
      for (const [i, site] of [[0, 'meadow'], [1, 'sprayed']]) {
        const bx = 12 + i * 224, tot = this.totals(site);
        x.fillStyle = '#FBFBF7'; U.rr(x, bx, 196, 212, 92, 6); x.fill(); x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 0.8; x.stroke();
        x.fillStyle = '#1B1A17'; x.font = '700 9px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left'; x.fillText(L(this.SITES[site]) + ` (${run.sweeps[site].length}/${this.N})`, bx + 8, 208);
        let j = 0; for (const k of INSECT.KINDS) for (let n = 0; n < Math.min(12, tot[k] || 0); n++, j++) INSECT.draw(x, k, bx + 16 + (j % 12) * 16, 224 + Math.floor(j / 12) * 16, k === 'aphid' ? 1.4 : 0.8);
      }
    }
  },
};
