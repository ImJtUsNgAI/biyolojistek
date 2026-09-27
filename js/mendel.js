'use strict';
// Mendel's bench: emasculate, pollinate, bag; fill the Punnett square; later count the F2 peas.
const MENDEL = {
  podSeeds(where) {
    const m = G.S.mendel || {};
    if (where === 'bench') return m.step >= 1 ? ['R', 'R', 'R', 'R', 'R', 'R'] : ['R', 'R', 'R', 'r', 'r', 'r'];
    if (m.bed === 'grown') return ['R', 'r', 'R', 'R', 'R', 'r'];
    return ['R', 'R', 'R', 'R', 'R', 'R'];
  },

  // canvas is 560 × 300 logical units, drawn at 2×; the two flowers stand at L0 (mother) and R0 (father)
  L0: { x: 150, y: 150 }, R0: { x: 410, y: 150 },
  // a pea flower has ten stamens (nine joined in a sheath, one free) ringing the stigma: that is why peas pollinate
  // themselves, and why Mendel had to open the keel and pluck them before the pollen ripened
  antherPos(c) { const out = []; for (let i = 0; i < 10; i++) { const a = Math.PI * (1.08 + i * 0.093); out.push([c.x + Math.cos(a) * 19, c.y - 44 + Math.sin(a) * 11]); } return out; },
  stigma(c) { return [c.x, c.y - 62]; },

  open() {
    const S = G.S, m = S.mendel;
    const body = h('div', 'kit mendel');
    if (m.step >= 1) {
      body.innerHTML = `<p class="kit-intro">${L(tr('F1 tohumların hazır: hepsi yuvarlak, hepsi Rr. Okulun yanındaki bezelye yatağına ek; bir mevsim sonra kendi çiçekleriyle tozlaşıp F2’yi verecekler.', 'Your F1 seeds are ready: all round, all Rr. Sow them in the pea bed next to the school; in a season they will self-pollinate and give you F2.'))}</p>`;
      body.appendChild(this.punnett(['R', 'r'], ['R', 'r'], true, tr('Tahmin et: F1 × F1 (Rr × Rr)', 'Predict: F1 × F1 (Rr × Rr)')));
      UI.panel({ title: tr('Mendel masası', "Mendel's bench"), code: 'BİY.12.2.5', body, wide: true });
      return;
    }
    body.innerHTML = `<p class="kit-intro"></p><canvas width="1120" height="600"></canvas><div class="kit-ctrl row tools">
        <button data-tool="tweezers">${L(tr('Cımbız', 'Tweezers'))}</button><button data-tool="brush">${L(tr('Fırça', 'Brush'))}</button><button data-tool="bag">${L(tr('Kese kâğıdı', 'Paper bag'))}</button></div>
        <div class="kit-msg"></div><div class="punnett-slot"></div>`;
    const cv = body.querySelector('canvas'), intro = body.querySelector('.kit-intro'), msg = body.querySelector('.kit-msg');
    const st = this.st = { tool: null, anthers: Array(10).fill(1), brush: false, pollinated: false, bagged: false, pod: 0, crossed: false };
    const steps = [
      tr('1 · Yuvarlak (RR) çiçeğin kayıkçığı açıldı. On başçığın hepsini cımbızla kopar: kendi kendini tozlaştırmasın.', '1 · The keel of the round (RR) flower is open. Pluck all ten anthers with the tweezers so it cannot pollinate itself.'),
      tr('2 · Fırçayla buruşuk (rr) çiçeğin başçıklarından polen al.', "2 · Use the brush to pick up pollen from the wrinkled (rr) flower's anthers."),
      tr('3 · Poleni yuvarlak çiçeğin tepeciğine (stigma) sür.', "3 · Brush the pollen onto the round flower's stigma."),
      tr('4 · Çiçeği kese kâğıdıyla kapat: başka polen gelmesin.', '4 · Cover the flower with a paper bag so no other pollen gets in.'),
    ];
    const stage = () => st.anthers.some(a => a) ? 0 : !st.brush && !st.pollinated ? 1 : !st.pollinated ? 2 : !st.bagged ? 3 : 4;
    const say = () => { const s = stage(); intro.textContent = s < 4 ? L(steps[s]) : L(tr('Çapraz tamam. Bakla büyüyor…', 'The cross is done. A pod is growing…')); };
    const tools = body.querySelectorAll('[data-tool]');
    tools.forEach(b => b.onclick = () => { st.tool = b.dataset.tool; AU.sfx('click'); tools.forEach(x => x.classList.toggle('on', x === b)); });
    const L0 = this.L0, R0 = this.R0;
    // one tap on the bench, in canvas units (exposed as MENDEL._tap for the self-test)
    const tap = this._tap = (px, py) => {
      const s = stage();
      if (!st.tool) { msg.textContent = L(tr('Önce aşağıdan bir alet seç.', 'Pick a tool below first.')); return; }
      if (s === 0) {
        if (st.tool !== 'tweezers') { msg.textContent = L(tr('Başçıkları koparmak için cımbız lazım.', 'You need the tweezers to pluck anthers.')); AU.sfx('wrong'); return; }
        let hit = false;
        this.antherPos(L0).forEach(([ax, ay], i) => { if (st.anthers[i] && Math.hypot(px - ax, py - ay) < 9) { st.anthers[i] = 0; hit = true; } });
        if (hit) { AU.sfx('pop'); const left = st.anthers.filter(a => a).length; if (left) msg.textContent = L(tr(`${left} başçık kaldı.`, `${left} anthers left.`)); else msg.textContent = ''; }
        if (Math.abs(px - R0.x) < 70) { msg.textContent = L(tr('O buruşuk çiçek: polen onun başçıklarından alınacak. Başçıkları koparılacak olan soldaki.', "That's the wrinkled flower: the pollen comes from its anthers. Pluck the anthers on the left one.")); AU.sfx('wrong'); }
      } else if (s === 1) {
        if (st.tool !== 'brush') { msg.textContent = L(tr('Polen almak için fırçayı kullan.', 'Use the brush to pick up pollen.')); AU.sfx('wrong'); return; }
        if (this.antherPos(R0).some(([ax, ay]) => Math.hypot(px - ax, py - ay) < 14)) { st.brush = true; msg.textContent = ''; AU.sfx('pen'); }
        else msg.textContent = L(tr('Sağdaki buruşuk çiçeğin sarı başçıklarına dokun.', 'Touch the yellow anthers of the wrinkled flower on the right.'));
      } else if (s === 2) {
        if (st.tool !== 'brush') { AU.sfx('wrong'); return; }
        const [sx, sy] = this.stigma(L0);
        if (Math.hypot(px - sx, py - sy) < 14) { st.pollinated = true; st.brush = false; msg.textContent = ''; AU.sfx('chime'); }
        else msg.textContent = L(tr('Tepecik, soldaki çiçeğin başçıklarının ortasından yükselen yeşil uç.', 'The stigma is the green tip rising out of the middle of the left flower.'));
      } else if (s === 3) {
        if (st.tool !== 'bag') { AU.sfx('wrong'); return; }
        if (Math.abs(px - L0.x) < 70) { st.bagged = true; AU.sfx('page'); t0 = performance.now(); }
      }
      say();
    };
    cv.onclick = e => { const r = cv.getBoundingClientRect(); tap((e.clientX - r.left) * 560 / r.width, (e.clientY - r.top) * 300 / r.height); };
    let raf = 0, t0 = 0;
    const draw = now => {
      if (pn.closed) return;
      const x = cv.getContext('2d'); x.setTransform(2, 0, 0, 2, 0, 0);
      x.fillStyle = MX.lin(x, 0, 0, 0, 300, [[0, '#EEF0E6'], [1, '#D8DCCC']]); x.fillRect(0, 0, 560, 300);
      x.fillStyle = 'rgba(60,70,50,0.12)'; x.beginPath(); x.ellipse(280, 292, 300, 18, 0, 0, TAU); x.fill();
      this.flower(x, L0.x, L0.y, st.anthers, st.pollinated, st.bagged, now);
      this.flower(x, R0.x, R0.y, null, false, false, now);
      x.fillStyle = '#1B1A17'; x.font = '700 12px "Courier Prime", monospace'; x.textAlign = 'center';
      x.fillText(L(tr('♀ YUVARLAK · RR', '♀ ROUND · RR')), L0.x, 290); x.fillText(L(tr('♂ BURUŞUK · rr', '♂ WRINKLED · rr')), R0.x, 290);
      if (st.brush) this.brushIcon(x, 280, 40, now);
      if (st.bagged) {
        const k = U.clamp((now - t0) / 2200, 0, 1);
        x.fillStyle = `rgba(20,24,16,${(0.4 * Math.min(1, k * 3)).toFixed(2)})`; x.fillRect(0, 0, 560, 300);
        x.save(); x.translate(280, 150); x.scale(0.55 + 0.45 * k, 0.55 + 0.45 * k); this.pod(x, k); x.restore();
        if (k >= 1 && !st.crossed) {
          st.crossed = true;
          msg.textContent = L(tr('F1 baklası: 6 bezelyenin hepsi yuvarlak! Şimdi Punnett karesini doldur.', 'The F1 pod: all 6 peas are round! Now fill in the Punnett square.'));
          body.querySelector('.punnett-slot').appendChild(this.punnett(['R', 'R'], ['r', 'r'], false, tr('RR × rr çaprazı', 'The RR × rr cross'), ok => {
            if (!ok) return;
            S.mendel.step = 1; S.mendel.f1 = true;
            S.journal.exps.push({ title: tr('Mendel çaprazı: RR × rr', "Mendel's cross: RR × rr"), code: 'BİY.12.2.5', t: Date.now(), head: [tr('Kuşak', 'Generation'), tr('Genotip', 'Genotype'), tr('Fenotip', 'Phenotype')],
              rows: [[tr('Ana (♀)', 'Mother (♀)'), 'RR', tr('yuvarlak', 'round')], [tr('Baba (♂)', 'Father (♂)'), 'rr', tr('buruşuk', 'wrinkled')], ['F1', 'Rr', tr('hepsi yuvarlak', 'all round')]] });
            G.save();
            UI.stamp('F1 = Rr');
            setTimeout(() => pn.close(), 1600);
          }));
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const pn = UI.panel({ title: tr('Mendel masası', "Mendel's bench"), code: 'BİY.12.1.11', body, wide: true, onClose: async () => {
      cancelAnimationFrame(raf);
      if (S.mendel.step >= 1 && Q.at('mendel', 'cross')) {
        await ask('mendel_f1');
        await UI.say('player', tr('F1’leri bahçedeki bezelye yatağına ekeyim. Bakalım buruşukluk geri gelecek mi?', "Let me sow the F1 seeds in the pea bed. Will the wrinkles come back?"));
        Q.adv('mendel');
      }
    } });
    this._draw = draw;
    say();
    raf = requestAnimationFrame(draw);
  },

  // a white pea flower seen from the front with its keel parted: banner behind, wings to the sides, and the
  // column of stamens around the bearded style in the middle. `anthers` null means all ten are present.
  flower(x, cx, cy, anthers, pollinated, bagged, now = 0) {
    x.save(); x.translate(cx, cy);
    const sway = Math.sin(now / 1400 + cx) * 0.01; x.rotate(sway);
    // stem, a leaflet pair and a tendril
    MX.taper(x, [[0, 140], [2, 90], [0, 40]], 5.5, 4, MX.lin(x, -3, 0, 3, 0, [[0, '#4E7A2E'], [0.5, '#8AB45A'], [1, '#3E6A24']]), 'rgba(40,70,20,0.6)');
    for (const s of [-1, 1]) { const lf = MX.blob(s * 30, 104, 22, 11, { seed: s + 5, wob: 0.05, rot: s * -0.35, n: 24 }); MX.fill(x, lf, MX.lit(x, s * 30, 104, 22, '#6E9A44', 0.3, 0.35)); MX.line(x, [[s * 4, 104], [s * 50, 96]], 'rgba(40,70,20,0.4)', 0.6); }
    const td = [[2, 76], [14, 72], [26, 64]]; for (let k = 0; k < 20; k++) { const a = Math.PI * 0.8 - k * 0.45, r = 7 - k * 0.3; td.push([34 + Math.cos(a) * r, 58 + Math.sin(a) * r]); }
    MX.line(x, td, '#7AA24A', 1.1, false);
    // calyx
    for (let k = -2; k <= 2; k++) MX.taper(x, [[k * 4, 44], [k * 7, 32], [k * 9, 20]], 6, 0.6, MX.lit(x, k * 6, 32, 12, '#6E9A44', 0.3, 0.3), 'rgba(40,70,20,0.5)');
    MX.fill(x, MX.blob(0, 42, 11, 7, { seed: 2, wob: 0.05 }), MX.lit(x, 0, 42, 11, '#6E9A44', 0.3, 0.35));
    // banner (standard) petal, veined and notched
    const banner = [[-8, 30], [-40, 8], [-62, -26], [-66, -62], [-48, -94], [-18, -106], [0, -98], [18, -106], [48, -94], [66, -62], [62, -26], [40, 8], [8, 30]];
    MX.fill(x, banner, MX.rad(x, 0, -30, 10, 110, [[0, '#FFFFFE'], [0.7, '#F4F2F4'], [1, '#DCD8E2']]));
    x.save(); MX.path(x, banner); x.clip();
    for (let k = -9; k <= 9; k++) { const a = -Math.PI / 2 + k * 0.15; MX.line(x, [[0, 24], [Math.cos(a) * 50, 24 + Math.sin(a) * 70], [Math.cos(a) * 110, 24 + Math.sin(a) * 140]], 'rgba(150,140,180,0.28)', 0.5); }
    x.fillStyle = MX.rad(x, 0, 16, 2, 30, [[0, 'rgba(170,200,120,0.5)'], [1, 'rgba(170,200,120,0)']]); x.fillRect(-30, -10, 60, 40);
    x.restore();
    x.strokeStyle = 'rgba(120,110,130,0.45)'; x.lineWidth = 0.7; MX.path(x, banner); x.stroke();
    // wings
    for (const s of [-1, 1]) {
      const wing = [[s * 6, 26], [s * 28, 20], [s * 50, 2], [s * 56, -22], [s * 42, -40], [s * 22, -34], [s * 10, -14]];
      MX.fill(x, wing, MX.lin(x, s * 8, 0, s * 56, -20, [[0, '#F0EEF2'], [0.6, '#FFFFFF'], [1, '#E2DEE8']]));
      x.strokeStyle = 'rgba(120,110,130,0.5)'; x.lineWidth = 0.7; MX.path(x, wing); x.stroke();
      MX.line(x, [[s * 10, 20], [s * 30, -4], [s * 44, -24]], 'rgba(150,140,170,0.3)', 0.5);
    }
    // keel, parted into its two halves
    for (const s of [-1, 1]) {
      const keel = [[s * 3, 30], [s * 22, 26], [s * 32, 10], [s * 26, -4], [s * 12, -2], [s * 4, 12]];
      MX.fill(x, keel, MX.lin(x, 0, 30, s * 30, 0, [[0, '#E6ECD6'], [1, '#F8F8F0']]));
      x.strokeStyle = 'rgba(110,120,90,0.55)'; x.lineWidth = 0.7; MX.path(x, keel); x.stroke();
    }
    // staminal sheath around the ovary, the free tenth stamen beside it
    MX.taper(x, [[0, 26], [0, 4], [0, -26]], 9, 7, MX.lin(x, -5, 0, 5, 0, [[0, '#D8E4C0'], [0.5, '#F4F8EA'], [1, '#C8D8AC']]), 'rgba(110,130,80,0.6)');
    MX.line(x, [[6, 24], [7, 0], [5, -28]], '#E4ECD4', 1.2);
    // style: bends up out of the sheath, bearded along its inner side
    const style = [[0, -24], [0, -40], [0, -54], [0, -62]];
    MX.taper(x, style, 2.4, 2, '#B8CF8A', 'rgba(80,110,50,0.6)');
    x.strokeStyle = 'rgba(240,244,230,0.9)'; x.lineWidth = 0.35;
    for (let k = 0; k < 14; k++) { const y = -34 - k * 1.8; x.beginPath(); x.moveTo(-1, y); x.lineTo(-3.2, y - 1.4); x.stroke(); }
    MX.ball(x, 0, -62, 3.2, pollinated ? '#E2C04E' : '#9CC06A', 0.4, 0.35);
    if (pollinated) for (let i = 0; i < 9; i++) MX.ball(x, -2.4 + (i % 3) * 2.4, -64 + Math.floor(i / 3) * 2.2, 0.8, '#D8A020', 0.4, 0.3);
    // ten filaments and their anthers ringing the stigma
    this.antherPos({ x: 0, y: 0 }).forEach(([ax, ay], i) => {
      const on = !anthers || anthers[i];
      MX.line(x, [[ax * 0.2, -26], [ax * 0.7, ay + 6], [ax, ay + (on ? 3 : 1)]], '#E8EEDC', 0.8);
      if (on) {
        MX.fill(x, MX.blob(ax, ay, 2.8, 3.8, { seed: i + 20, wob: 0.08, n: 12 }), MX.lit(x, ax, ay, 4, '#E9B838', 0.35, 0.35));
        x.strokeStyle = 'rgba(150,100,20,0.6)'; x.lineWidth = 0.35; x.beginPath(); x.moveTo(ax, ay - 3.5); x.lineTo(ax, ay + 3.5); x.stroke();
        for (let k = 0; k < 3; k++) { x.fillStyle = 'rgba(240,200,70,0.8)'; x.beginPath(); x.arc(ax + Math.sin(i * 3 + k) * 3.5, ay + Math.cos(i * 5 + k) * 3.5, 0.5, 0, TAU); x.fill(); }
      } else { x.strokeStyle = '#A0322A'; x.lineWidth = 0.7; x.beginPath(); x.moveTo(ax - 1.5, ay); x.lineTo(ax + 1.5, ay + 2); x.stroke(); }
    });
    // a glassine bag tied round the stem keeps stray pollen out
    if (bagged) {
      const bag = [[-12, 44], [-70, 30], [-82, -40], [-70, -112], [-24, -124], [24, -124], [70, -112], [82, -40], [70, 30], [12, 44]];
      MX.fill(x, bag, MX.lin(x, -80, 0, 80, 0, [[0, 'rgba(196,172,128,0.97)'], [0.45, 'rgba(226,206,164,0.97)'], [1, 'rgba(176,150,106,0.97)']]));
      x.strokeStyle = 'rgba(110,86,50,0.8)'; x.lineWidth = 1; MX.path(x, bag); x.stroke();
      for (const [a, b] of [[[-40, 30], [-46, -110]], [[18, 34], [24, -118]], [[-70, -90], [70, -94]]]) MX.line(x, [a, b], 'rgba(120,96,60,0.35)', 0.8);
      MX.line(x, [[-14, 42], [0, 46], [14, 42]], '#6A5030', 2); MX.line(x, [[10, 44], [20, 54], [14, 60]], '#6A5030', 1);
    }
    x.restore();
  },
  brushIcon(x, bx, by, now) {
    x.save(); x.translate(bx, by); x.rotate(-0.6 + Math.sin(now / 300) * 0.05);
    MX.taper(x, [[-30, 0], [0, 0]], 3, 4, MX.lin(x, 0, -2, 0, 2, [[0, '#C8A060'], [1, '#8A6030']]));
    x.fillStyle = MX.lin(x, 0, -3, 0, 3, [[0, '#D8DCDA'], [1, '#8A8E8C']]); x.fillRect(0, -2.5, 6, 5);
    MX.taper(x, [[6, 0], [12, 0], [16, 0]], 5, 1, '#3A2E22');
    for (let i = 0; i < 8; i++) MX.ball(x, 11 + (i % 4) * 1.6, -1.5 + Math.floor(i / 4) * 3, 0.9, '#E9B838', 0.4, 0.3);
    x.restore();
    x.fillStyle = '#1B1A17'; x.font = '600 11px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center'; x.fillText(L(tr('fırçada polen', 'pollen on the brush')), bx, by + 22);
  },
  // the F1 pod split open: six round seeds (k = 0..1 grows it)
  pod(x, k) {
    const shell = [[-150, 4], [-120, -34], [-60, -50], [40, -52], [120, -34], [156, -6], [124, 30], [40, 46], [-60, 44], [-124, 30]];
    MX.fill(x, shell, MX.lin(x, 0, -52, 0, 46, [[0, '#8EB85A'], [0.4, '#B8D880'], [1, '#6E9A3A']]));
    x.strokeStyle = 'rgba(50,80,24,0.7)'; x.lineWidth = 1.2; MX.path(x, shell); x.stroke();
    const inner = shell.map(([a, b]) => [a * 0.9, b * 0.62 - 2]);
    MX.fill(x, inner, MX.lin(x, 0, -34, 0, 28, [[0, '#E4EEC4'], [1, '#C8DC98']]));
    for (let i = 0; i < 6; i++) {
      const sx = -100 + i * 40, r = 16 * Math.min(1, k * 1.4);
      if (r < 0.5) continue;
      MX.line(x, [[sx, -28], [sx, -r * 0.8]], '#8AAE5A', 1.4);
      x.fillStyle = 'rgba(40,60,20,0.25)'; x.beginPath(); x.ellipse(sx + 2, 3, r, r * 0.9, 0, 0, TAU); x.fill();
      MX.ball(x, sx, 0, r, '#C9D46A', 0.45, 0.35);
      x.fillStyle = 'rgba(255,255,240,0.5)'; x.beginPath(); x.ellipse(sx - r * 0.35, -r * 0.4, r * 0.3, r * 0.18, -0.5, 0, TAU); x.fill();
    }
    MX.line(x, [[-156, 0], [-176, -6], [-184, -18]], '#6E9A3A', 3);
    for (let k2 = -2; k2 <= 2; k2++) MX.taper(x, [[-154, 0], [-166, k2 * 5], [-174, k2 * 9]], 5, 0.8, '#6E9A44');
  },

  // Punnett square: pick a genotype for every cell
  punnett(mom, dad, predict, title, onDone) {
    const el = h('div', 'punnett');
    const opts = ['RR', 'Rr', 'rr'];
    const want = (a, b) => [a, b].sort((p, q) => p === 'R' ? -1 : q === 'R' ? 1 : 0).join('');
    el.innerHTML = `<h4>${U.esc(L(title))}</h4><table><tr><th></th>${dad.map(g => `<th class="g">${g}</th>`).join('')}</tr>${mom.map((a, i) => `<tr><th class="g">${a}</th>${dad.map((b, j) => `<td><button data-i="${i}" data-j="${j}">?</button></td>`).join('')}</tr>`).join('')}</table><p class="pn-msg">${L(tr('Kutulara tıkla: RR → Rr → rr', 'Click the boxes: RR → Rr → rr'))}</p>`;
    const cells = {}; let done = false;
    el.querySelectorAll('button').forEach(b => b.onclick = () => {
      if (done) return;
      const k = b.dataset.i + b.dataset.j, v = opts[(opts.indexOf(cells[k]) + 1) % 3];
      cells[k] = v; b.textContent = v; b.className = v === 'rr' ? 'rr' : 'R'; AU.sfx('pen');
      const all = mom.every((a, i) => dad.every((c, j) => cells['' + i + j]));
      if (!all) return;
      const ok = mom.every((a, i) => dad.every((c, j) => cells['' + i + j] === want(a, c)));
      const msg = el.querySelector('.pn-msg');
      if (ok) {
        done = true; AU.sfx('success');
        const rr = Object.values(cells).filter(v => v === 'rr').length;
        msg.textContent = predict ? L(tr(`Beklenen: 3 yuvarlak : ${rr} buruşuk → 3 : 1`, `Expected: 3 round : ${rr} wrinkled → 3 : 1`)) : L(tr('Hepsi Rr: hepsi yuvarlak görünür ama r’yi taşır.', 'All Rr: they all look round but carry r.'));
        if (onDone) onDone(true);
      } else { msg.textContent = L(tr('Bir kutu yanlış. Her kutuya annenin ve babanın birer aleli gelir.', "One box is wrong. Each box gets one allele from the mother and one from the father.")); AU.sfx('wrong'); }
    });
    return el;
  },

  // counting the F2 harvest
  count() {
    return new Promise(res => {
      const S = G.S, body = h('div', 'kit count');
      const pods = 20, counts = { R: 0, r: 0 }, seeds = [];
      for (let p = 0; p < pods; p++) { const n = 5 + Math.floor(Math.random() * 3); seeds.push(Array.from({ length: n }, () => Math.random() < 0.75 ? 'R' : 'r')); }
      const tot = seeds.flat(), a = tot.filter(s => s === 'R').length;
      if (a === 3 * (tot.length - a)) seeds[0][0] = seeds[0][0] === 'R' ? 'r' : 'R';
      body.innerHTML = `<p class="kit-intro">${L(tr('Yirmi F2 baklası topladın; içlerinde {n} bezelye var. Baklaları tek tek aç ve bezelyeleri say.', "You've picked twenty F2 pods holding {n} peas. Open them one by one and count the peas.")).replace('{n}', tot.length)}</p>
        <div class="pods"></div>
        <div class="tally"><div><b class="tR">0</b><small>${L(tr('yuvarlak', 'round'))}</small></div><div><b class="tr">0</b><small>${L(tr('buruşuk', 'wrinkled'))}</small></div><div><b class="ratio">—</b><small>${L(tr('oran', 'ratio'))}</small></div><div class="tg-c" hidden><b class="tg"></b><small>${L(tr('tahmin: buruşuk', 'guess: wrinkled'))}</small></div></div>
        <div class="kit-ctrl row"><button class="guessb" title="${U.esc(T('rig_pred_b'))}">🤔 ${U.esc(T('rig_pred'))}</button><button class="big all">${L(tr('Kalanların hepsini aç', 'Open all the rest'))}</button></div><div class="kit-msg"></div>`;
      const box = body.querySelector('.pods'); let opened = 0, finished = false, guess = null;
      // predict, then count: the class's guess of the wrinkled peas waits in the tally, and the count is set beside it
      // with what Mendel's 3 : 1 would give for this many peas
      body.querySelector('.guessb').onclick = async () => {
        AU.sfx('click');
        const v = await UI.numPad(body.closest('.modal'), L(tr('Sınıfın tahmini · {n} bezelyeden kaçı buruşuk?', 'The class’s guess · how many of the {n} peas are wrinkled?')).replace('{n}', tot.length));
        if (v == null || finished) return;
        guess = { g: v, n: +v.replace(',', '.') };
        body.querySelector('.tg').textContent = v; body.querySelector('.tg-c').hidden = false;
      };
      const upd = () => {
        body.querySelector('.tR').textContent = counts.R; body.querySelector('.tr').textContent = counts.r;
        body.querySelector('.ratio').textContent = counts.r ? U.num(counts.R / counts.r, 2) + ' : 1' : '—';
        if (opened === pods && !finished) {
          finished = true;
          body.querySelector('.kit-msg').textContent = L(tr('Hepsi sayıldı. Mendel’inkiyle karşılaştır: 5474 : 1850 ≈ 2,96 : 1.', "All counted. Compare with Mendel's: 5474 : 1850 ≈ 2.96 : 1."));
          body.querySelector('.guessb').disabled = true;
          if (guess) {
            const d = guess.n - counts.r, ex = U.num(tot.length / 4, 1);
            body.querySelector('.kit-msg').textContent += ' ' + L(d === 0 ? tr('Tahmininiz {g}, sayılan {r}: tam isabet! 3 : 1’e göre beklenen {e}.', 'Your guess {g}, counted {r}: spot on! 3 : 1 would give {e}.') : d > 0 ? tr('Tahmininiz {g}, sayılan {r}: {d} fazla. 3 : 1’e göre beklenen {e}.', 'Your guess {g}, counted {r}: {d} over. 3 : 1 would give {e}.') : tr('Tahmininiz {g}, sayılan {r}: {d} eksik. 3 : 1’e göre beklenen {e}.', 'Your guess {g}, counted {r}: {d} under. 3 : 1 would give {e}.')).replace('{g}', guess.g).replace('{r}', counts.r).replace('{d}', U.num(Math.abs(d), Number.isInteger(d) ? 0 : 1)).replace('{e}', ex);
          }
          body.appendChild(this.punnett(['R', 'r'], ['R', 'r'], true, tr('Neden 3 : 1? F1 × F1 (Rr × Rr)', 'Why 3 : 1? F1 × F1 (Rr × Rr)')));
          S.mendel.f2 = { R: counts.R, r: counts.r };
          S.journal.exps.push({ title: tr('F2 sayımı', 'F2 count'), code: 'BİY.12.2.5', t: Date.now(), head: [tr('', ''), tr('Yuvarlak', 'Round'), tr('Buruşuk', 'Wrinkled'), tr('Oran', 'Ratio')],
            rows: [[tr('Senin sayımın', 'Your count'), String(counts.R), String(counts.r), U.num(counts.R / counts.r, 2) + ' : 1'], [tr('Mendel (1865)', 'Mendel (1865)'), '5474', '1850', '2,96 : 1']],
            chart: { values: [counts.R, counts.r], labels: [tr('yuvarlak', 'round'), tr('buruşuk', 'wrinkled')], colors: ['#C9D46A', '#8FAE5A'] } });
          G.save();
        }
      };
      const open = (b, i) => {
        if (b.classList.contains('open')) return;
        b.classList.add('open'); opened++;
        b.innerHTML = seeds[i].map(s => `<i class="${s}"></i>`).join('');
        seeds[i].forEach(s => counts[s]++);
        AU.sfx('pop'); upd();
      };
      for (let i = 0; i < pods; i++) { const b = h('button', 'pod'); b.onclick = () => open(b, i); box.appendChild(b); }
      body.querySelector('.all').onclick = () => { [...box.children].forEach((b, i) => setTimeout(() => open(b, i), i * 40)); };
      UI.panel({ title: tr('F2 hasadı', 'The F2 harvest'), code: 'BİY.12.2.5', body, wide: true, onClose: async () => {
        if (!finished) { res(false); return; }
        give('pea_f2');
        if (Q.at('mendel', 'count')) {
          await ask('mendel_ratio', { a: counts.R, b: counts.r, r: U.num(counts.R / counts.r, 2) });
          Q.adv('mendel');
        }
        res(true);
      } });
    });
  },
};
