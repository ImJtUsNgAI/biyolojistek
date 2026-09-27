'use strict';
// Compost bin beside the farm's heap. Tap the brown pile (straw, dry leaves) and the green pile (grass, vegetable
// scraps) to build a heap layer by layer, water it, turn it with the fork, and watch a thermometer: when the mix,
// the damp and the air are right, the microbes' respiration heats the heap to 55–70 °C within a couple of weeks.
// Sevim's heap (all wet green, never turned) is the comparison. Nothing can fail: a poor heap just stays cold and
// smells, the hint says why, and the one big button always does the next sensible thing.
const COMPOST = {
  CAP: 14,                                   // layers the bin holds
  AT: { brown: [66, 222], green: [394, 222], water: [62, 104], fork: [398, 104] },   // tap targets in the 460 × 300 scene
  R: 52,
  WEEK: 1.3,                                 // seconds per week

  open() {
    const S = G.S;
    const body = h('div', 'kit rig ferm compostbench');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <button class="pl-go"></button>
        <p class="fm-const">${L(tr('Kahverengi (saman, kuru yaprak) yığına karbon ve hava boşluğu, yeşil (çim, sebze artığı) azot ve su katar. Mikroplara ikisi de lazım.', 'Brown (straw, dry leaves) brings carbon and air pockets; green (grass, vegetable scraps) brings nitrogen and water. The microbes need both.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div>
      <p class="kit-msg"></p>`;
    body.querySelector('.pl-go').addEventListener('click', () => this.act());
    this.body = body; this.cv = body.querySelector('canvas');
    this.fresh();
    const at = e => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300]; };
    this.cv.addEventListener('pointerdown', e => this.tap(...at(e)));
    this.cv.addEventListener('pointermove', e => { this.st.hand = at(e); });
    this.cv.addEventListener('pointerleave', () => { this.st.hand = null; });
    this._key = e => {
      if (!this.pn || !['Space', 'Enter'].includes(e.code)) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (!e.repeat) this.act();
    };
    window.addEventListener('keydown', this._key, true);
    this.pn = UI.panel({ title: tr('Kompost kasası · Yığın neden ısınır?', 'Compost bin · Why does a heap heat up?'), code: 'BİY.10.2.4', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.loop();
  },
  fresh() {
    this.st = { phase: 'fill', t: 0, wt: 0, layers: [], m: 0.15, air: 1, T: 16, fuel: 1, week: 0, hist: [16], hot: 0, maxT: 16, smelly: false, fx: [], turned: 0, idle: 0, hand: null, since: 0, last: null };
    this._msg(tr('Boş kasaya katman katman bir yığın kur: soldaki kahverengi yığına ya da sağdaki yeşil yığına dokun. En az 6 katman gerekli.', 'Build a heap in the empty bin layer by layer: tap the brown pile on the left or the green pile on the right. You need at least 6 layers.'));
    this._sync();
  },
  green() { const L_ = this.st.layers; return L_.length ? L_.filter(k => k === 'g').length / L_.length : 0; },
  // what is holding the heap back most, or null when it is working well
  problem() {
    const st = this.st, g = this.green();
    if (!st.layers.length) return 'empty';
    if (st.m > 0.72 || g > 0.5) return 'green';
    if (g < 0.15) return 'brown';
    if (st.m < 0.4) return 'dry';
    if (st.air < 0.35 && st.phase === 'weeks') return 'air';
    return null;
  },
  add(k) {
    const st = this.st; st.idle = 0;
    if (st.phase === 'done') return;
    // a full bin: a forkful of the other kind comes out to make room, so the mix can always be put right
    if (st.layers.length >= this.CAP) {
      const i = st.layers.lastIndexOf(k === 'b' ? 'g' : 'b');
      if (i < 0) { this._msg(tr('Kasa dolu. Çatalla karıştırabilir ya da sulayabilirsin.', 'The bin is full. You can turn it with the fork or water it.')); return; }
      st.layers.splice(i, 1);
      if (k === 'b') st.m = U.clamp(st.m - 0.1, 0, 1);
      this._msg(tr('Kasa dolu: bir çatal dolusu çıkarıp yerine yenisini koydun.', 'The bin is full: you forked some out and put the new layer in its place.'));
    }
    st.layers.push(k);
    st.m = U.clamp(st.m + (k === 'g' ? 0.1 : -0.03), 0, 1);
    st.fx.push({ k, t: 0, n: st.layers.length - 1 }); AU.sfx('dig');
    this._explain(); this._sync();
  },
  water() { const st = this.st; st.idle = 0; if (st.phase === 'done') return; st.m = U.clamp(st.m + 0.2, 0, 1); st.fx.push({ k: 'w', t: 0 }); AU.sfx('splash'); this._explain(); this._sync(); },
  turn() {
    const st = this.st; st.idle = 0; if (st.phase === 'done') return;
    st.air = 1; st.turned++;
    if (st.m > 0.6) st.m = Math.max(0.55, st.m - 0.1);
    // mixing: the layers are shuffled so browns and greens sit side by side
    const L_ = st.layers, R = MX.rng(st.turned * 17 + L_.length);
    for (let i = L_.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [L_[i], L_[j]] = [L_[j], L_[i]]; }
    st.fx.push({ k: 'f', t: 0 }); AU.sfx('whoosh');
    this._explain(); this._sync();
  },
  tap(x, y) {
    const st = this.st, A = this.AT, near = k => Math.hypot(x - A[k][0], y - A[k][1]) < this.R;
    if (near('brown')) this.add('b'); else if (near('green')) this.add('g'); else if (near('water')) this.water(); else if (near('fork')) this.turn();
    else if (st.phase === 'fill' && x > 160 && x < 300 && y > 110) this.act();
  },
  // the one big button: start the weeks, or fix whatever is wrong right now
  act() {
    const st = this.st; st.idle = 0;
    if (st.phase === 'done') { this.fresh(); AU.sfx('click'); return; }
    if (st.phase === 'fill' && st.layers.length >= 6) {
      st.phase = 'weeks'; st.wt = 0; AU.sfx('page');
      this._msg(tr('Haftalar geçiyor. Termometreyi izle: mikroplar çalıştıkça yığın ısınır.', 'The weeks are passing. Watch the thermometer: as the microbes work, the heap warms up.'));
      this._sync(); return;
    }
    const p = this.problem();
    if (p === 'green' || p === 'empty') this.add('b');
    else if (p === 'brown') this.add('g');
    else if (p === 'dry') this.water();
    else if (p === 'air') this.turn();
    else if (st.phase === 'fill') this.add(this.green() < 0.34 ? 'g' : 'b');
  },
  _explain() {
    const st = this.st, g = Math.round(this.green() * 100), p = this.problem();
    const say = {
      empty: tr('Kasa boş.', 'The bin is empty.'),
      green: tr(`Yeşil payı %${g}, çok ıslak ve sıkışık. Kahverengi ekle: saman hem suyu emer hem hava boşluğu açar.`, `Green share ${g}%, too wet and packed. Add brown: straw soaks up water and opens air pockets.`),
      brown: tr(`Yeşil payı %${g}. Mikroplara azot lazım: biraz yeşil ekle.`, `Green share ${g}%. The microbes need nitrogen: add some green.`),
      dry: tr('Yığın kuru. Mikroplar ancak nemde çalışır: sula (sıkılmış bir sünger kadar nemli olmalı).', 'The heap is dry. Microbes only work in the damp: water it (it should be as damp as a wrung-out sponge).'),
      air: tr('Yığının içinde hava bitti. Çatalla karıştır: oksijen gelince mikroplar yeniden ısıtır.', 'The air inside the heap is used up. Turn it with the fork: with oxygen back, the microbes heat it up again.'),
    }[p];
    if (say) this._msg(say);
    else if (st.phase === 'fill') this._msg(st.layers.length < 6 ? tr(`Güzel karışım: yeşil payı %${g}. ${6 - st.layers.length} katman daha.`, `A good mix: green share ${g}%. ${6 - st.layers.length} more layers.`) : tr(`Güzel karışım: yeşil payı %${g}, nem yerinde. “Haftalar geçsin” düğmesine bas.`, `A good mix: green share ${g}%, damp enough. Press “Let the weeks pass”.`));
    else this._msg(tr('Yığın iyi çalışıyor. Bekle ve termometreyi izle.', 'The heap is working well. Wait and watch the thermometer.'));
  },
  // one week of the heap: how busy the microbes are depends on the mix, the damp and the air
  week() {
    const st = this.st, g = this.green();
    const qb = 1 - U.clamp((Math.abs(g - 0.35) - 0.1) / 0.3, 0, 1);
    const qm = 1 - U.clamp((Math.abs(st.m - 0.55) - 0.12) / 0.25, 0, 1);
    const act = qb * qm * (0.45 + 0.55 * st.air) * (0.5 + 0.5 * st.fuel);
    const target = 16 + 60 * act;
    st.T += (target - st.T) * 0.7;
    st.fuel = Math.max(0.15, st.fuel - 0.04 * act);
    st.air = U.clamp(st.air - 0.12 - 0.15 * g, 0, 1);
    st.m = U.clamp(st.m - 0.05 * Math.max(0, st.T - 20) / 50 + 0.015 * g, 0, 1);
    st.smelly = g > 0.6 || st.m > 0.78 || (st.air < 0.15 && g > 0.3);
    st.week++; st.hist.push(st.T); st.maxT = Math.max(st.maxT, st.T);
    if (st.T >= 55) st.hot++;
    // heat that lasts is what kills weed seeds and germs; after two hot weeks the heap is on its way
    if (st.hot >= 2 && st.week >= 4) return this.settle();
    this._explain();
    if (st.smelly) this._msg(tr('Pis bir koku yükseliyor: yığın havasız ve çok ıslak. Kahverengi ekle ve çatalla karıştır.', 'A nasty smell is rising: the heap is airless and too wet. Add brown and turn it with the fork.'));
    this._sync();
  },
  settle() {
    const st = this.st, S = G.S, g = Math.round(this.green() * 100), T = Math.round(st.maxT);
    st.phase = 'done'; AU.sfx('chime');
    this._msg(tr(`${st.week}. haftada yığının içi ${T} °C’ye çıktı ve iki hafta sıcak kaldı. Yabancı ot tohumları ve hastalık mikropları bu sıcakta ölür. Birkaç ay sonra kara, kokusuz toprak olacak.`, `By week ${st.week} the inside of the heap reached ${T} °C and stayed hot for two weeks. Weed seeds and disease germs die in that heat. In a few months it will be dark, sweet-smelling soil.`));
    S.compostRes = [g, T, st.week];
    if (!S.flags.compostDone) {
      S.flags.compostDone = true;
      S.journal.exps.push({ title: tr('Kompost kasası: yığın neden ısınır?', 'Compost bin: why does a heap heat up?'), code: 'BİY.10.2.4', t: Date.now(),
        head: [tr('Yığın', 'Heap'), tr('Yeşil payı', 'Green share'), tr('Karıştırma', 'Turned'), tr('En yüksek sıcaklık', 'Highest temperature'), tr('Koku', 'Smell')],
        rows: [[tr('Sevim Hanım’ın', 'Sevim’s'), '%100', tr('hiç', 'never'), '21 °C', tr('çürük yumurta, amonyak', 'rotten eggs, ammonia')], [tr('Senin', 'Yours'), '%' + g, st.turned + '×', T + ' °C', tr('orman toprağı', 'forest soil')]],
        note: tr('Yığını ısıtan güneş değil, mikropların oksijenli solunumudur. Kahverengi ve yeşil karışınca, nem yerinde ve hava varken bakteriler ve mantarlar hızla çoğalır; ısı yığında birikir. Yalnızca ıslak yeşilden oluşan, hiç karıştırılmayan yığın havasız kalır: orada yavaş çalışan havasız mikroplar amonyak ve kükürtlü gazlar çıkarır.', 'What heats the heap is not the sun but the microbes’ aerobic respiration. With brown and green mixed, enough damp and air, bacteria and fungi multiply fast and the heat builds up in the heap. A heap of wet green alone that is never turned goes airless: slow airless microbes there give off ammonia and sulphur gases.') });
      if (Q.at('kompost', 'build')) { UI.stamp(L(tr('ISINDI', 'HOT'))); const pn = this.pn; setTimeout(() => pn && pn.close(), 3200); }
    }
    this._sync(); G.save();
  },

  // ---------------------------------------------------------------- time
  step(dt) {
    const st = this.st;
    st.t += dt; st.idle += dt;
    if (st.phase === 'weeks') { st.wt += dt; if (st.wt >= this.WEEK) { st.wt = 0; this.week(); } }
    for (const f of st.fx) f.t += dt;
    st.fx = st.fx.filter(f => f.t < 0.9);
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
  _msg(t) { if (this.body && t) this.body.querySelector('.kit-msg').textContent = L(t); },
  _sync() {
    const b = this.body, st = this.st;
    if (!b) return;
    const p = this.problem(), go = b.querySelector('.pl-go');
    const fix = { green: tr('Kahverengi ekle 🍂', 'Add brown 🍂'), brown: tr('Yeşil ekle 🌿', 'Add green 🌿'), dry: tr('Sula 💧', 'Water it 💧'), air: tr('Çatalla karıştır ⟲', 'Turn it ⟲') }[p];
    let lab, busy = false;
    if (st.phase === 'done') lab = tr('Yeni yığın ↺', 'A new heap ↺');
    else if (st.phase === 'fill') lab = st.layers.length >= 6 && !p ? tr('Haftalar geçsin ▶', 'Let the weeks pass ▶') : fix || tr('Katman ekle', 'Add a layer');
    else if (fix) lab = fix;
    else { lab = tr(`${st.week}. hafta… bekle`, `Week ${st.week}… wait`); busy = true; }
    if (st.phase === 'fill' && st.layers.length >= 6 && p) lab = tr('Haftalar geçsin ▶', 'Let the weeks pass ▶');
    go.textContent = L(lab); go.disabled = busy; go.classList.toggle('next', !busy);
    this.table();
  },
  table() {
    const b = this.body, S = G.S, st = this.st, res = S.compostRes;
    if (!b) return;
    b.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Yığın', 'Heap'))}</th><th>${L(tr('Yeşil payı', 'Green share'))}</th><th>${L(tr('En yüksek sıcaklık', 'Highest temperature'))}</th><th>${L(tr('Koku', 'Smell'))}</th></tr>
      <tr><td><b>${L(tr('Sevim Hanım’ın', 'Sevim’s'))}</b></td><td>%100</td><td>21 °C</td><td>${L(tr('çürük yumurta', 'rotten eggs'))}</td></tr>
      ${res ? `<tr><td><b>${L(tr('Senin', 'Yours'))}</b></td><td>%${res[0]}</td><td>${res[1]} °C</td><td>${L(tr('orman toprağı', 'forest soil'))}</td></tr>` : ''}</table>`;
    b.querySelector('.stamps').innerHTML = [
      [st.layers.length >= 6 || !!res, tr('Yığın kuruldu', 'Heap built')], [st.phase !== 'fill' || !!res, tr('Haftalar geçti', 'Weeks passed')], [st.hot > 0 || !!res, tr('55 °C’yi geçti', 'Passed 55 °C')], [!!S.flags.compostDone, tr('Kaydedildi', 'Recorded')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
  },
  async close() {
    this.pn = null;
    window.removeEventListener('keydown', this._key, true);
    if (Q.at('kompost', 'build') && G.S.flags.compostDone) {
      await ask('kompost_smell');
      await UI.say('player', tr('Sevim Hanım’ın yığını bozulmamış, sadece havasız ve aç kalmış. Ona anlatayım.', 'Sevim’s heap isn’t ruined, it’s just airless and hungry. Let me tell her.'));
      Q.adv('kompost');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(99);
    b.fillStyle = MX.lin(b, 0, 0, 0, 150, [[0, '#C8DCE6'], [1, '#EEF0E2']]); b.fillRect(0, 0, 460, 150);
    // the farmyard fence and the shed wall behind
    b.fillStyle = '#9A7A56'; b.fillRect(0, 120, 460, 6); b.fillRect(0, 142, 460, 5);
    for (let x = 6; x < 460; x += 34) { b.fillStyle = '#8A6A48'; b.fillRect(x, 108, 7, 50); b.fillStyle = 'rgba(0,0,0,0.15)'; b.fillRect(x + 5, 108, 2, 50); }
    b.fillStyle = MX.lin(b, 0, 150, 0, 300, [[0, '#8A7A5A'], [1, '#6A5A40']]); b.fillRect(0, 150, 460, 150);
    for (let k = 0; k < 500; k++) { b.fillStyle = `rgba(${60 + R() * 50 | 0},${50 + R() * 40 | 0},${30 + R() * 20 | 0},0.5)`; b.fillRect(R() * 460, 150 + R() * 150, 2, 1); }
    // the brown pile: straw and dry leaves
    const [bx, by] = this.AT.brown;
    b.fillStyle = 'rgba(0,0,0,0.25)'; b.beginPath(); b.ellipse(bx, by + 34, 52, 10, 0, 0, TAU); b.fill();
    b.fillStyle = '#B89048'; b.beginPath(); b.ellipse(bx, by + 12, 50, 26, 0, Math.PI, 0); b.fill(); b.fillRect(bx - 50, by + 12, 100, 20);
    for (let k = 0; k < 160; k++) { const a = Math.PI + R() * Math.PI, d = R(), x = bx + Math.cos(a) * 48 * d, y = by + 12 + Math.sin(a) * 24 * d + R() * 22; b.strokeStyle = R() < 0.6 ? `rgb(${210 + R() * 30 | 0},${176 + R() * 30 | 0},${90 + R() * 30 | 0})` : `rgb(${140 + R() * 40 | 0},${90 + R() * 30 | 0},${40 + R() * 20 | 0})`; b.lineWidth = 1.2; b.beginPath(); b.moveTo(x, y); const t = R() * TAU; b.lineTo(x + Math.cos(t) * 8, y + Math.sin(t) * 3); b.stroke(); }
    // the green pile: grass clippings and vegetable scraps
    const [gx, gy] = this.AT.green;
    b.fillStyle = 'rgba(0,0,0,0.25)'; b.beginPath(); b.ellipse(gx, gy + 34, 52, 10, 0, 0, TAU); b.fill();
    b.fillStyle = '#5E8A34'; b.beginPath(); b.ellipse(gx, gy + 12, 50, 26, 0, Math.PI, 0); b.fill(); b.fillRect(gx - 50, gy + 12, 100, 20);
    for (let k = 0; k < 170; k++) { const a = Math.PI + R() * Math.PI, d = R(), x = gx + Math.cos(a) * 48 * d, y = gy + 12 + Math.sin(a) * 24 * d + R() * 22; b.strokeStyle = `rgb(${70 + R() * 50 | 0},${130 + R() * 60 | 0},${40 + R() * 30 | 0})`; b.lineWidth = 1.3; b.beginPath(); b.moveTo(x, y); const t = R() * TAU; b.lineTo(x + Math.cos(t) * 6, y + Math.sin(t) * 3); b.stroke(); }
    for (let k = 0; k < 10; k++) { const x = gx - 40 + R() * 80, y = gy + R() * 26; b.fillStyle = R() < 0.5 ? '#E8862A' : '#D8C04A'; b.beginPath(); b.ellipse(x, y, 5, 2.4, R() * 3, 0, TAU); b.fill(); }
    // labels on little stakes
    const tag = (x, y, t1, t2, col) => { b.fillStyle = '#6A4A30'; b.fillRect(x - 1, y, 2, 20); b.fillStyle = '#F4EEDD'; U.rr(b, x - 46, y - 22, 92, 24, 3); b.fill(); b.strokeStyle = '#1B1A17'; b.lineWidth = 1; b.stroke(); b.fillStyle = col; b.font = '700 9px "Atkinson Hyperlegible Next", sans-serif'; b.textAlign = 'center'; b.textBaseline = 'middle'; b.fillText(L(t1), x, y - 15); b.fillStyle = '#1B1A17'; b.font = '7px "Atkinson Hyperlegible Next", sans-serif'; b.fillText(L(t2), x, y - 5); };
    tag(bx, by - 30, tr('KAHVERENGİ', 'BROWN'), tr('saman, kuru yaprak', 'straw, dry leaves'), '#8A5A1A');
    tag(gx, gy - 30, tr('YEŞİL', 'GREEN'), tr('çim, sebze artığı', 'grass, veg scraps'), '#3E6A2A');
    this._bc = c;
    return c;
  },
  _layerCol(k, i, age) {
    // fresh layers keep their colour; as the heap works they darken toward humus
    const base = k === 'g' ? [96, 150, 58] : [196, 160, 86], hum = [70, 50, 32], f = U.clamp(age, 0, 1);
    return base.map((v, j) => Math.round(v + (hum[j] - v) * f));
  },
  draw() {
    const x = this.cv.getContext('2d'), st = this.st, t = st.t, A = this.AT;
    x.setTransform(2, 0, 0, 2, 0, 0);
    x.drawImage(this._back(), 0, 0, 460, 300);
    // the bin: a slatted wooden box, its front boards left off so the layers show
    const bx0 = 168, bx1 = 292, by1 = 272, lh = 11 * (0.7 + 0.3 * st.fuel);
    x.fillStyle = '#5A4028'; x.fillRect(bx0 - 8, 116, 8, by1 - 116); x.fillRect(bx1, 116, 8, by1 - 116);
    x.fillStyle = '#3A2A1A'; x.fillRect(bx0, 120, bx1 - bx0, by1 - 120);
    for (let y = 124; y < by1; y += 16) { x.fillStyle = 'rgba(90,64,40,0.55)'; x.fillRect(bx0, y, bx1 - bx0, 3); }
    const R = MX.rng(5);
    st.layers.forEach((k, i) => {
      const y = by1 - (i + 1) * lh, fx = st.fx.find(f => f.n === i && (f.k === 'g' || f.k === 'b')), drop = fx ? (1 - Math.min(1, fx.t / 0.35)) * 60 : 0;
      const col = this._layerCol(k, i, (1 - st.fuel) * 1.6 * (1 - i / Math.max(1, st.layers.length)));
      x.fillStyle = `rgb(${col.join(',')})`; x.fillRect(bx0 + 2, y - drop, bx1 - bx0 - 4, lh + 0.5);
      for (let q = 0; q < 16; q++) { x.strokeStyle = k === 'g' ? 'rgba(40,70,20,0.6)' : 'rgba(250,230,170,0.6)'; x.lineWidth = 1; const px = bx0 + 4 + R() * (bx1 - bx0 - 12); x.beginPath(); x.moveTo(px, y - drop + R() * lh); x.lineTo(px + 6 + R() * 4, y - drop + R() * lh); x.stroke(); }
      if (k === 'g' && i % 2) { x.fillStyle = '#E8862A'; x.beginPath(); x.ellipse(bx0 + 20 + (i * 37) % 80, y - drop + lh / 2, 4, 1.8, 0.3, 0, TAU); x.fill(); }
    });
    // white threads in a hot heap, worms once it cools and matures
    if (st.hot && st.layers.length) for (let k = 0; k < 18; k++) { const px = bx0 + 10 + (k * 53) % (bx1 - bx0 - 20), py = by1 - lh * (1 + (k * 7) % Math.max(1, st.layers.length - 1)); x.strokeStyle = 'rgba(240,236,226,0.8)'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 4, py - 3, px + 8, py + 1); x.stroke(); }
    // the smell: flies over a wet, airless heap
    if (st.smelly && st.phase !== 'done') for (let k = 0; k < 5; k++) { const a = t * (2 + k * 0.4) + k, px = 230 + Math.cos(a) * (30 + k * 6), py = by1 - st.layers.length * lh - 16 + Math.sin(a * 1.3) * 10; x.fillStyle = '#1A1A1A'; x.beginPath(); x.arc(px, py, 1.6, 0, TAU); x.fill(); x.fillStyle = 'rgba(220,230,240,0.7)'; x.beginPath(); x.ellipse(px - 1.5, py - 1.5, 1.8, 1, -0.5, 0, TAU); x.fill(); }
    // steam over a hot heap
    if (st.T > 38 && st.layers.length) { const k = U.clamp((st.T - 38) / 25, 0, 1), top = by1 - st.layers.length * lh; for (let q = 0; q < 4; q++) { const ph = (t * 0.5 + q * 0.25) % 1, px = 190 + q * 26 + Math.sin(t + q) * 4, py = top - ph * 50; x.fillStyle = `rgba(255,255,255,${(0.45 * k * (1 - ph)).toFixed(2)})`; x.beginPath(); x.arc(px, py, 6 + ph * 10, 0, TAU); x.fill(); } }
    // the watering can and the fork, with a pour or a turn when used
    const can = A.water, fork = A.fork, fw = st.fx.find(f => f.k === 'w'), ff = st.fx.find(f => f.k === 'f');
    x.save(); x.translate(can[0], can[1]); x.rotate(fw ? -0.5 * Math.sin(Math.min(1, fw.t / 0.9) * Math.PI) : 0);
    x.fillStyle = '#6A8AA0'; U.rr(x, -18, -12, 30, 24, 4); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 1; x.stroke();
    x.beginPath(); x.moveTo(12, 0); x.lineTo(30, -14); x.lineWidth = 3; x.strokeStyle = '#6A8AA0'; x.stroke(); x.fillStyle = '#4A6A80'; x.beginPath(); x.ellipse(31, -15, 3, 4.5, -0.8, 0, TAU); x.fill();
    x.strokeStyle = '#4A6A80'; x.lineWidth = 2.4; x.beginPath(); x.arc(-3, -14, 9, Math.PI, 0); x.stroke();
    x.restore();
    if (fw) for (let q = 0; q < 10; q++) { const k = (fw.t * 3 + q * 0.1) % 1; x.fillStyle = 'rgba(120,170,210,0.8)'; x.beginPath(); x.arc(U.lerp(can[0] + 34, 220, k) + q * 3, U.lerp(can[1] - 10, 200, k), 1.4, 0, TAU); x.fill(); }
    x.save(); x.translate(ff ? U.lerp(fork[0], 250, Math.sin(Math.min(1, ff.t / 0.9) * Math.PI)) : fork[0], fork[1]); x.rotate(0.35 + (ff ? Math.sin(ff.t * 14) * 0.3 : 0));
    x.fillStyle = '#8A6A44'; x.fillRect(-2, -40, 4, 50); x.fillStyle = '#6A7078'; x.fillRect(-10, 10, 20, 4); for (const dx of [-9, -3, 3, 9]) x.fillRect(dx - 1, 12, 2.2, 18);
    x.restore();
    x.fillStyle = '#1B1A17'; x.font = '700 9px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(L(tr('sula', 'water')), can[0], can[1] + 24); x.fillText(L(tr('karıştır', 'turn')), fork[0], fork[1] + 40);
    // the thermometer: a dial on a long probe pushed into the heap
    const T = st.T, dx = 318, dy = 150;
    x.strokeStyle = '#8A9098'; x.lineWidth = 3; x.beginPath(); x.moveTo(dx, dy + 18); x.lineTo(262, 236); x.stroke();
    x.fillStyle = '#F4F2EC'; x.beginPath(); x.arc(dx, dy, 20, 0, TAU); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.4; x.stroke();
    x.strokeStyle = 'rgba(200,60,40,0.5)'; x.lineWidth = 4; x.beginPath(); x.arc(dx, dy, 15, Math.PI * 0.75 + (55 / 80) * Math.PI * 1.5, Math.PI * 2.25); x.stroke();
    const ang = Math.PI * 0.75 + U.clamp(T / 80, 0, 1) * Math.PI * 1.5;
    x.strokeStyle = '#A0322A'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(dx, dy); x.lineTo(dx + Math.cos(ang) * 15, dy + Math.sin(ang) * 15); x.stroke();
    x.fillStyle = T >= 55 ? '#A0322A' : '#1B1A17'; x.font = '700 16px "Courier Prime", monospace'; x.textAlign = 'left'; x.fillText(`${Math.round(T)} °C`, dx + 26, dy + 1);
    // the graph: temperature by week, with the 55 °C line where weed seeds and germs die
    const gx0 = 150, gx1 = 330, gy0 = 16, gy1 = 86, n = 12, wk = Math.max(n, st.hist.length - 1), off = Math.max(0, st.hist.length - 1 - n);
    x.fillStyle = 'rgba(247,242,228,0.92)'; x.fillRect(gx0 - 8, gy0 - 8, gx1 - gx0 + 16, gy1 - gy0 + 22); x.strokeStyle = '#1B1A17'; x.lineWidth = 1; x.strokeRect(gx0 - 8, gy0 - 8, gx1 - gx0 + 16, gy1 - gy0 + 22);
    const Y = v => gy1 - v / 75 * (gy1 - gy0), X = i => gx0 + (i - off) / n * (gx1 - gx0);
    x.strokeStyle = 'rgba(160,50,42,0.6)'; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(gx0, Y(55)); x.lineTo(gx1, Y(55)); x.stroke(); x.setLineDash([]);
    x.fillStyle = '#A0322A'; x.font = '700 7px "Courier Prime", monospace'; x.textAlign = 'right'; x.fillText('55 °C', gx1, Y(55) - 5);
    x.strokeStyle = '#26306A'; x.lineWidth = 1.8; x.beginPath(); st.hist.forEach((v, i) => { if (i < off) return; const px = X(i), py = Y(v); i === off ? x.moveTo(px, py) : x.lineTo(px, py); }); x.stroke();
    x.fillStyle = '#1B1A17'; x.textAlign = 'center'; x.font = '7px "Courier Prime", monospace'; x.fillText(L(tr('hafta', 'week')) + ' ' + st.week, (gx0 + gx1) / 2, gy1 + 8);
    // three gauges under the graph: green share, damp, air, each with its good band
    const gauge = (i, lab, v, lo, hi) => { const w = 52, x0 = 150 + i * 64, y0 = 108; x.fillStyle = '#1B1A17'; x.font = '700 7px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left'; x.fillText(L(lab), x0, y0 - 5); x.fillStyle = 'rgba(255,255,255,0.8)'; x.fillRect(x0, y0, w, 6); x.fillStyle = 'rgba(62,106,58,0.35)'; x.fillRect(x0 + lo * w, y0, (hi - lo) * w, 6); x.fillStyle = v >= lo && v <= hi ? '#3E6A3A' : '#A0322A'; x.fillRect(x0 + U.clamp(v, 0, 1) * w - 1.5, y0 - 2, 3, 10); x.strokeStyle = '#1B1A17'; x.lineWidth = 0.6; x.strokeRect(x0, y0, w, 6); };
    gauge(0, tr('yeşil payı', 'green share'), this.green(), 0.2, 0.5);
    gauge(1, tr('nem', 'damp'), st.m, 0.43, 0.67);
    gauge(2, tr('hava', 'air'), st.air, 0.35, 1);
    // where to tap: the fix for what is wrong, pulsing
    const p = this.problem(), ring = { green: 'brown', brown: 'green', dry: 'water', air: 'fork', empty: st.idle > 3 ? 'brown' : null }[p];
    if (ring && st.phase !== 'done') { const [rx, ry] = A[ring], k = 0.5 + 0.5 * Math.sin(t * 5); x.strokeStyle = `rgba(242,199,68,${(0.55 + 0.4 * k).toFixed(2)})`; x.lineWidth = 3; x.beginPath(); x.arc(rx, ry + (ring === 'fork' ? 6 : 8), this.R - 6 + k * 4, 0, TAU); x.stroke(); }
    const hv = st.hand; if (hv) for (const k in A) if (Math.hypot(hv[0] - A[k][0], hv[1] - A[k][1]) < this.R) { x.strokeStyle = 'rgba(255,255,255,0.8)'; x.lineWidth = 2; x.beginPath(); x.arc(A[k][0], A[k][1] + 8, this.R - 8, 0, TAU); x.stroke(); }
  },
};
