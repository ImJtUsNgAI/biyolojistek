'use strict';
// The rumen ride: you are a blade of grass travelling through Sarıkız. Steer with a finger, the mouse or W/S.
const RIDE = {
  STAGES: [
    { id: 'mouth', dur: 9, gap: 0.62, amp: 18, bg: ['#5A2A2A', '#2A1414'], wall: '#C96A6A', tex: 'teeth', spawn: 'tooth',
      name: tr('Ağız', 'Mouth'), fact: tr('Sarıkız otu iri iri çiğneyip bol tükürükle yutar. Günde yüz litreyi aşan tükürüğündeki bikarbonat işkembenin asitliğini dengeler.', 'Sarıkız chews the grass roughly and swallows it with lots of saliva. Well over a hundred litres a day: its bicarbonate keeps the rumen from turning too acidic.') },
    { id: 'eso', dur: 8, gap: 0.42, amp: 10, bg: ['#6A3434', '#2E1818'], wall: '#D98A8A', tex: 'rings', spawn: 'squeeze',
      name: tr('Yemek borusu', 'Oesophagus'), fact: tr('Kas halkaları sırayla kasılıp lokmayı aşağı iter. Buna peristaltik hareket denir.', 'Rings of muscle squeeze one after another to push the food down. This is called peristalsis.') },
    { id: 'rumen', dur: 16, gap: 0.8, amp: 30, bg: ['#4E5A2E', '#1E2410'], wall: '#8FA86A', tex: 'papillae', spawn: 'microbe',
      name: tr('İşkembe (rumen)', 'Rumen'), fact: tr('Burada milyarlarca mikrop yaşar. Selülozu parçalayıp yağ asitlerine çevirirler; inek bu yağ asitleriyle beslenir. Mikropları topla!', 'Billions of microbes live here. They break cellulose down into fatty acids, and the cow lives on those fatty acids. Collect the microbes!') },
    { id: 'cud', dur: 6, gap: 0.45, amp: 8, bg: ['#6A3434', '#2E1818'], wall: '#D98A8A', tex: 'rings', spawn: null, reverse: true,
      name: tr('Geviş getirme', 'Chewing the cud'), fact: tr('Lokma ağza geri çıkar, yeniden çiğnenir ve tekrar yutulur. Parçaların küçüldükçe mikroplar daha hızlı çalışır.', 'The cud comes back up to the mouth, is chewed again and swallowed again. The smaller you get, the faster the microbes work.') },
    { id: 'ret', dur: 9, gap: 0.6, amp: 16, bg: ['#5A4A2E', '#241C10'], wall: '#C8913A', tex: 'honeycomb', spawn: 'nail',
      name: tr('Börkenek (retikulum)', 'Reticulum'), fact: tr('Bal peteği gibi duvarı ağır şeyleri tutar. İneklerin yanlışlıkla yuttuğu çiviler burada kalabilir. Dikkat et!', 'Its honeycomb wall catches heavy things. Nails that cows swallow by accident can end up here. Watch out!') },
    { id: 'oma', dur: 9, gap: 0.7, amp: 6, bg: ['#5A3E2A', '#22160E'], wall: '#B07A52', tex: 'folds', spawn: 'page',
      name: tr('Kırkbayır (omasum)', 'Omasum'), fact: tr('Kitap sayfası gibi yüzlerce katı vardır. Sayfaların arasından geçerken suyun ve bazı minerallerin bir kısmı emilir.', 'It has hundreds of folds, like the pages of a book. As you pass between them, some of the water and minerals are absorbed.') },
    { id: 'abo', dur: 10, gap: 0.66, amp: 22, bg: ['#6A2E22', '#2A120C'], wall: '#C87A5A', tex: 'glands', spawn: 'acid',
      name: tr('Şirden (abomasum)', 'Abomasum'), fact: tr('Asıl mide: asit ve enzim salgılar. Seninle gelen mikroplar da burada sindirilir: inek için protein! Asit damlalarından kaç.', 'The true stomach: it makes acid and enzymes. The microbes that came with you are digested here too, which is protein for the cow! Dodge the acid drops.') },
    { id: 'gut', dur: 6, gap: 0.55, amp: 14, bg: ['#6A4A3A', '#2A1C14'], wall: '#D8A078', tex: 'villi', spawn: null,
      name: tr('İnce bağırsak', 'Small intestine'), fact: tr('Parmak gibi tümürler yüzeyi büyütür; besinler buradan kana geçer. Yolculuğun sonu!', 'Finger-like villi enlarge the surface, and nutrients pass into the blood here. The end of the journey!') },
  ],
  start(cb) {
    this.cb = cb;
    Object.assign(this, { t: 0, si: 0, st: 0, y: G.vh / 2, obs: [], parts: [], score: { e: 0, p: 0 }, hits: 0, size: 1, shake: 0, wx: 0, spawnT: 0, over: false, hitCd: 0, first: {} });
    G.mode = 'ride';
    UI.showHud(false);
    AU.music('ride'); AU.sfx('gulp');
  },
  stage() { return this.STAGES[Math.min(this.si, this.STAGES.length - 1)]; },
  gapAt(sx) {
    const s = this.stage(), X = this.wx + sx, cy = G.vh / 2;
    let g = s.gap * G.vh;
    if (s.tex === 'rings') { const w = Math.sin(X * 0.011 - this.t * 3.2); g *= 1 - 0.42 * Math.pow(Math.max(0, w), 10); }
    const off = Math.sin(X * 0.004 + this.si) * s.amp * 2 + Math.sin(X * 0.013) * s.amp * 0.5;
    const k = Math.min(1, this.st / 0.8);
    return [cy - g / 2 + off * k, cy + g / 2 + off * k];
  },
  key(e) { if (e.code === 'Escape') this.end(false); },
  update(dt) {
    if (this.over) return;
    const s = this.stage(), K = G.keys;
    this.t += dt; this.st += dt; this.hitCd -= dt;
    const speed = s.reverse ? -170 : 230;
    this.wx += speed * dt;
    // steering
    const px = G.vw * 0.26;
    let ty = this.y;
    if (K.ArrowUp || K.KeyW) ty -= 420 * dt;
    if (K.ArrowDown || K.KeyS) ty += 420 * dt;
    if (G.mouse.active && !(K.ArrowUp || K.KeyW || K.ArrowDown || K.KeyS)) ty = U.lerp(this.y, G.mouse.y, Math.min(1, dt * 8));
    this.y = ty;
    const r = 14 * this.size, [top, bot] = this.gapAt(px);
    if (this.y - r < top) { this.y = top + r; this.hit(); }
    if (this.y + r > bot) { this.y = bot - r; this.hit(); }
    // spawning
    this.spawnT -= dt;
    if (s.spawn && this.spawnT <= 0 && this.st > 1.2 && this.st < s.dur - 1.5) this.spawn(s);
    for (const o of this.obs) {
      o.x -= (speed + (o.vx || 0)) * dt; o.y += (o.vy || 0) * dt; o.a = (o.a || 0) + dt;
      if (o.kind === 'bubble') o.vy = Math.max(-160, (o.vy || 0) - 90 * dt);
      if (o.kind === 'acid') o.vy = Math.min(220, (o.vy || 0) + 200 * dt);
      const d = Math.hypot(o.x - px, o.y - this.y);
      if (!o.done && d < o.r + r) {
        if (o.good) { o.done = true; this.collect(o); }
        else if (o.kind === 'bubble') { this.y -= 120 * dt * 6; }
        else { o.done = true; this.hit(); }
      }
    }
    this.obs = this.obs.filter(o => o.x > -80 && o.y > -120 && o.y < G.vh + 120 && !(o.done && o.good));
    for (const p of this.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
    this.parts = this.parts.filter(p => p.life > 0);
    if (Math.random() < dt * 20) this.parts.push({ x: speed < 0 ? -10 : G.vw + 10, y: Math.random() * G.vh, vx: -speed * (0.4 + Math.random() * 0.8) - 20, vy: (Math.random() - 0.5) * 20, life: 8, r: 1 + Math.random() * 2.5 });
    this.shake = Math.max(0, this.shake - dt * 3);
    if (this.st >= s.dur) this.next();
  },
  spawn(s) {
    const x = G.vw + 60, [top, bot] = this.gapAt(G.vw + 60), mid = (top + bot) / 2;
    const rnd = (a, b) => a + Math.random() * (b - a);
    if (s.spawn === 'tooth') { const up = Math.random() < 0.5; this.obs.push({ kind: 'tooth', x, y: up ? top + 24 : bot - 24, r: 26, up }); this.spawnT = 0.9; }
    if (s.spawn === 'squeeze') { this.spawnT = 9; }
    if (s.spawn === 'microbe') {
      const kinds = ['bact', 'bact', 'bact', 'proto', 'fungus', 'archaea'];
      this.obs.push({ kind: U.pick(kinds, Math.random()), good: true, x, y: rnd(top + 30, bot - 30), r: 14, vy: rnd(-20, 20) });
      if (Math.random() < 0.5) this.obs.push({ kind: 'bubble', x: x + rnd(0, 80), y: bot - 10, r: rnd(10, 22), vy: -40 });
      this.spawnT = rnd(0.35, 0.6);
    }
    if (s.spawn === 'nail') {
      if (Math.random() < 0.45) this.obs.push({ kind: 'nail', x, y: rnd(top + 50, bot - 50), r: 22, rot: rnd(-0.6, 0.6) });
      else this.obs.push({ kind: 'stone', x, y: rnd(top + 30, bot - 30), r: rnd(12, 20) });
      this.spawnT = rnd(0.8, 1.2);
    }
    if (s.spawn === 'page') { const up = (this._pg = !this._pg); this.obs.push({ kind: 'page', x, y: up ? top : bot, r: 0, up, len: (bot - top) * 0.58 }); this.spawnT = 0.62; }
    if (s.spawn === 'acid') {
      this.obs.push({ kind: 'acid', x: x - rnd(0, G.vw * 0.5), y: top + 10, r: 9, vy: 40 });
      if (Math.random() < 0.6) this.obs.push({ kind: 'bact', good: true, protein: true, x, y: rnd(top + 30, bot - 30), r: 14 });
      this.spawnT = rnd(0.3, 0.55);
    }
  },
  collect(o) {
    const s = this.stage();
    AU.sfx('collect');
    if (o.protein) this.score.p++; else this.score.e++;
    if (s.id === 'rumen' && !o.protein) this.size = Math.max(0.55, this.size - 0.012);
    const txt = o.protein ? L(tr('protein +1', 'protein +1')) : L(tr('yağ asidi +1', 'fatty acid +1'));
    this.parts.push({ x: o.x, y: o.y, vx: -60, vy: -40, life: 1.2, text: txt });
    if (!this.first[o.kind]) {
      this.first[o.kind] = true;
      const note = { bact: tr('Bakteri', 'Bacterium'), proto: tr('Siliyalı', 'Ciliate'), fungus: tr('Anaerob mantar', 'Anaerobic fungus'), archaea: tr('Metan üreten arke', 'Methane-making archaeon') }[o.kind];
      if (note) UI.toast(L(note), '✦');
    }
  },
  hit() {
    if (this.hitCd > 0) return;
    this.hitCd = 0.6; this.hits++; this.shake = 1;
    AU.sfx('hit');
  },
  next() {
    const s = this.stage();
    if (s.id === 'cud') { this.size = Math.max(0.5, this.size * 0.7); AU.sfx('chew'); }
    this.si++; this.st = 0; this.obs = [];
    if (this.si >= this.STAGES.length) { this.end(true); return; }
    AU.sfx('whoosh');
  },
  async end(done) {
    if (this.over) return;
    this.over = true;
    G.mode = 'play';
    UI.showHud(true);
    AU.music('world');
    if (done) {
      G.S.flags.rideDone = true;
      await UI.notice(tr('Yolculuk bitti!', 'Journey complete!'), tr(`Sarıkız bu ottan ${this.score.e} birim yağ asidi ve ${this.score.p} birim mikrop proteini kazandı. Gerçekte bu yolculuk birkaç gün sürer.`, `From this blade of grass, Sarıkız got ${this.score.e} units of fatty acids and ${this.score.p} units of microbial protein. In real life the journey takes a few days.`), 'ride');
      if (this.cb) this.cb();
    }
  },

  // ---------------- drawing ----------------
  draw(ctx) {
    const s = this.stage() || this.STAGES[this.STAGES.length - 1], vw = G.vw, vh = G.vh, dpr = G.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sh = this.shake * 6;
    if (sh) ctx.translate((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh);
    const g = ctx.createRadialGradient(vw / 2, vh / 2, 20, vw / 2, vh / 2, vw * 0.7);
    g.addColorStop(0, s.bg[0]); g.addColorStop(1, s.bg[1]);
    ctx.fillStyle = g; ctx.fillRect(-10, -10, vw + 20, vh + 20);
    // fluid specks
    for (const p of this.parts) {
      if (p.text) { ctx.fillStyle = '#FFF1B8'; ctx.font = '700 13px "Courier Prime", monospace'; ctx.textAlign = 'center'; ctx.fillText(p.text, p.x, p.y); continue; }
      ctx.fillStyle = 'rgba(255,240,210,0.18)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
    }
    // walls
    const step = 10, topPts = [], botPts = [];
    for (let x = -step; x <= vw + step; x += step) { const [a, b] = this.gapAt(x); topPts.push([x, a]); botPts.push([x, b]); }
    for (const [pts, edge] of [[topPts, -1], [botPts, 1]]) {
      ctx.fillStyle = MX.lin(ctx, 0, edge < 0 ? 0 : vh, 0, vh / 2, [[0, U.shade(s.wall, -0.5)], [1, U.shade(s.wall, 0.08)]]);
      ctx.beginPath(); ctx.moveTo(-step, edge < 0 ? -20 : vh + 20);
      for (const p of pts) ctx.lineTo(p[0], p[1]);
      ctx.lineTo(vw + step, edge < 0 ? -20 : vh + 20); ctx.closePath(); ctx.fill();
      this.texture(ctx, s, pts, edge);
      ctx.strokeStyle = 'rgba(255,230,220,0.35)'; ctx.lineWidth = 3;
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - edge * 5) : ctx.moveTo(p[0], p[1] - edge * 5)); ctx.stroke();
      ctx.strokeStyle = 'rgba(30,10,8,0.6)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    }
    // obstacles
    for (const o of this.obs) this.drawObs(ctx, o);
    // the player: a curled blade of grass with a face
    const px = vw * 0.26, py = this.y, k = this.size;
    ctx.save(); ctx.translate(px, py); ctx.scale(k, k); ctx.rotate(Math.sin(this.t * 6) * 0.08);
    ctx.fillStyle = '#9CC06A'; ctx.strokeStyle = '#1B1A17'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-22, 6); ctx.quadraticCurveTo(-6, -18, 18, -10); ctx.quadraticCurveTo(26, -6, 22, 2); ctx.quadraticCurveTo(0, -4, -22, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,70,20,0.6)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-18, 4); ctx.quadraticCurveTo(0, -8, 20, -4); ctx.stroke();
    ctx.fillStyle = '#1B1A17'; ctx.beginPath(); ctx.arc(10, -6, 1.8, 0, TAU); ctx.arc(15, -5, 1.8, 0, TAU); ctx.fill();
    ctx.restore();
    // banner
    const bt = this.st;
    if (bt < 4.2 && !this.over) {
      const a = Math.min(1, bt * 3, (4.2 - bt) * 2);
      ctx.globalAlpha = a;
      const w = Math.min(640, vw - 40), x0 = (vw - w) / 2, y0 = 22;
      ctx.fillStyle = 'rgba(244,238,221,0.95)'; ctx.fillRect(x0, y0, w, 92); ctx.strokeStyle = '#1B1A17'; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, w, 92);
      ctx.fillStyle = '#A0322A'; ctx.font = '700 12px "Courier Prime", monospace'; ctx.textAlign = 'left';
      ctx.fillText((this.si + 1) + ' / ' + this.STAGES.length, x0 + 16, y0 + 22);
      ctx.fillStyle = '#1B1A17'; ctx.font = '700 24px "Bodoni Moda", serif'; ctx.fillText(L(s.name), x0 + 16, y0 + 50);
      ctx.font = '500 13px "Atkinson Hyperlegible Next", sans-serif';
      this.wrap(ctx, L(s.fact), w - 32).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, x0 + 16, y0 + 70 + i * 16));
      ctx.globalAlpha = 1;
    }
    // HUD
    ctx.fillStyle = 'rgba(20,14,10,0.6)'; ctx.fillRect(16, vh - 50, 300, 34);
    ctx.fillStyle = '#F4EEDD'; ctx.font = '700 13px "Courier Prime", monospace'; ctx.textAlign = 'left';
    ctx.fillText(L(tr(`Yağ asidi ${this.score.e} · Protein ${this.score.p}`, `Fatty acid ${this.score.e} · Protein ${this.score.p}`)), 28, vh - 28);
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(244,238,221,0.6)'; ctx.font = '600 12px "Atkinson Hyperlegible Next", sans-serif';
    ctx.fillText(L(tr('Parmağınla, fareyle ya da W/S ile yönlendir · Esc: çık', 'Steer with a finger, the mouse or W/S · Esc: leave')), vw - 18, vh - 22);
    // progress rope
    const tot = this.STAGES.reduce((a, b) => a + b.dur, 0), done = this.STAGES.slice(0, this.si).reduce((a, b) => a + b.dur, 0) + Math.min(this.st, s.dur);
    ctx.fillStyle = 'rgba(244,238,221,0.25)'; ctx.fillRect(vw * 0.3, vh - 12, vw * 0.4, 4);
    ctx.fillStyle = '#E9C74E'; ctx.fillRect(vw * 0.3, vh - 12, vw * 0.4 * done / tot, 4);
  },
  texture(ctx, s, pts, edge) {
    ctx.save();
    ctx.beginPath(); ctx.moveTo(-20, edge < 0 ? -20 : G.vh + 20); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(G.vw + 20, edge < 0 ? -20 : G.vh + 20); ctx.closePath(); ctx.clip();
    const X0 = this.wx, dark = U.shade(s.wall, -0.35), lite = U.shade(s.wall, 0.3), at = x => pts[U.clamp(Math.round((x + 10) / 10), 0, pts.length - 1)][1];
    if (s.tex === 'papillae') {
      // a carpet of tongue-shaped papillae, dark with fermenting feed
      for (let x = -((X0 * 0.999) % 7); x < G.vw + 7; x += 7) {
        const k = Math.floor((x + X0) / 7), l = 11 + 7 * U.hash(k, 3, 1), y = at(x), w = 2.6, bend = (U.hash(k, 5, 1) - 0.5) * 5;
        ctx.fillStyle = U.hash(k, 7, 1) < 0.5 ? U.shade(dark, -0.2) : dark;
        ctx.beginPath(); ctx.moveTo(x - w, y - edge * 2); ctx.quadraticCurveTo(x - w + bend * 0.5, y + edge * l * 0.6, x + bend, y + edge * l); ctx.quadraticCurveTo(x + w + bend * 0.5, y + edge * l * 0.6, x + w, y - edge * 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = U.rgba(lite, 0.35); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x - 0.8, y); ctx.lineTo(x + bend - 0.8, y + edge * (l - 2)); ctx.stroke();
      }
    }
    if (s.tex === 'villi') {
      for (let x = -((X0) % 9); x < G.vw + 9; x += 9) {
        const y = at(x), l = 16;
        ctx.fillStyle = MX.lin(ctx, x - 4, 0, x + 4, 0, [[0, dark], [0.45, lite], [1, dark]]);
        ctx.beginPath(); ctx.moveTo(x - 3.6, y - edge * 2); ctx.lineTo(x - 3.6, y + edge * (l - 3.6)); ctx.arc(x, y + edge * (l - 3.6), 3.6, Math.PI, 0, edge > 0); ctx.lineTo(x + 3.6, y - edge * 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,240,200,0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + edge * (l - 4)); ctx.stroke();
      }
    }
    if (s.tex === 'teeth') {
      // cheek teeth: broad grinding crowns with ridges of enamel
      for (let x = -((X0) % 44); x < G.vw + 44; x += 44) {
        const y = at(x + 18), top = edge < 0 ? y - 30 : y;
        ctx.fillStyle = MX.lin(ctx, x, 0, x + 36, 0, [[0, '#C8BCA0'], [0.4, '#F6F0E2'], [1, '#B8AC90']]);
        U.rr(ctx, x, top, 36, 30, 6); ctx.fill();
        ctx.strokeStyle = 'rgba(120,100,70,0.6)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.strokeStyle = 'rgba(150,130,90,0.55)'; ctx.lineWidth = 1.2;
        for (const dx of [9, 18, 27]) { ctx.beginPath(); ctx.moveTo(x + dx - 3, edge < 0 ? y - 2 : y + 2); ctx.quadraticCurveTo(x + dx + 3, edge < 0 ? y - 8 : y + 8, x + dx - 2, edge < 0 ? y - 14 : y + 14); ctx.stroke(); }
      }
    }
    if (s.tex === 'rings') {
      // muscle rings of the oesophagus: soft bands of light and shade
      for (let x = -((X0) % 26); x < G.vw + 26; x += 26) {
        ctx.fillStyle = MX.lin(ctx, x - 6, 0, x + 12, 0, [[0, 'rgba(0,0,0,0)'], [0.5, U.rgba(dark, 0.45)], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x - 6, 0, 18, G.vh);
        ctx.strokeStyle = U.rgba(lite, 0.3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 12, 0); ctx.lineTo(x + 14, G.vh); ctx.stroke();
      }
    }
    if (s.tex === 'folds') {
      // the omasum's leaves, each one catching the light on its upper face
      for (let x = -((X0) % 18); x < G.vw + 40; x += 18) {
        ctx.fillStyle = U.rgba(dark, 0.5); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 6, 0); ctx.lineTo(x - 24, G.vh); ctx.lineTo(x - 30, G.vh); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = U.rgba(lite, 0.4); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + 7, 0); ctx.lineTo(x - 23, G.vh); ctx.stroke();
      }
      ctx.fillStyle = U.rgba(lite, 0.35);
      for (let i = 0; i < 90; i++) { const k = Math.floor(X0 / 40) + i, x = ((U.hash(k, 1, 4) * 1600 - (X0 % 1600)) + 1600) % 1600 - 100, y = U.hash(k, 2, 4) * G.vh; ctx.beginPath(); ctx.arc(x, y, 1.4, 0, TAU); ctx.fill(); }
    }
    if (s.tex === 'glands') {
      // gastric pits: tiny openings with a pale rim, glistening with mucus
      for (let x = -((X0) % 22); x < G.vw + 22; x += 22) for (let y = 0; y < G.vh; y += 22) {
        const px = x + (y % 44 ? 11 : 0);
        ctx.fillStyle = U.rgba(lite, 0.35); ctx.beginPath(); ctx.ellipse(px, y - 1, 5.5, 4.5, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = U.rgba(U.shade(dark, -0.3), 0.8); ctx.beginPath(); ctx.ellipse(px, y, 3.2, 2.6, 0, 0, TAU); ctx.fill();
      }
    }
    if (s.tex === 'honeycomb') {
      // the reticulum's honeycomb: raised ridges, lit from above, around deep cells
      const Rr = 16, hx = Rr * 1.5, hy = Rr * Math.sqrt(3);
      for (let c = -1; c < G.vw / hx + 2; c++) for (let r = -1; r < G.vh / hy + 2; r++) {
        const cx = c * hx - (X0 % (hx * 2)), cy = r * hy + (c % 2 ? hy / 2 : 0);
        ctx.fillStyle = U.rgba(dark, 0.5); ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; ctx.lineTo(cx + Math.cos(a) * Rr * 0.78, cy + Math.sin(a) * Rr * 0.78); } ctx.closePath(); ctx.fill();
        ctx.strokeStyle = U.rgba(lite, 0.5); ctx.lineWidth = 2.4; ctx.beginPath(); for (let k = 3; k <= 6; k++) { const a = k / 6 * TAU; ctx.lineTo(cx + Math.cos(a) * Rr, cy + Math.sin(a) * Rr); } ctx.stroke();
      }
    }
    ctx.restore();
  },
  drawObs(ctx, o) {
    ctx.save(); ctx.translate(o.x, o.y);
    switch (o.kind) {
      case 'tooth': {
        const s = o.up ? 1 : -1;
        ctx.fillStyle = MX.lin(ctx, -22, 0, 22, 0, [[0, '#C8BCA0'], [0.45, '#FAF6EA'], [1, '#B4A88C']]);
        ctx.beginPath(); ctx.moveTo(-22, -40 * s); ctx.lineTo(22, -40 * s); ctx.bezierCurveTo(24, 0, 20, 18 * s, 10, 28 * s); ctx.quadraticCurveTo(0, 22 * s, -10, 28 * s); ctx.bezierCurveTo(-20, 18 * s, -24, 0, -22, -40 * s); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(110,90,60,0.7)'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.strokeStyle = 'rgba(150,130,90,0.5)'; ctx.beginPath(); ctx.moveTo(-12, 20 * s); ctx.quadraticCurveTo(-4, 8 * s, -10, -6 * s); ctx.moveTo(10, 20 * s); ctx.quadraticCurveTo(4, 8 * s, 10, -6 * s); ctx.stroke();
        break;
      }
      case 'bact': {
        ctx.rotate(o.a * 1.5);
        const c = o.protein ? '#D88A7E' : '#5E86A8';
        ctx.strokeStyle = U.rgba(U.shade(c, -0.3), 0.7); ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(12, 0); for (let k = 1; k <= 8; k++) ctx.lineTo(12 + k * 2, Math.sin(o.a * 12 + k) * 2.5); ctx.stroke();
        ctx.fillStyle = MX.lin(ctx, 0, -6, 0, 6, [[0, U.shade(c, 0.45)], [0.5, c], [1, U.shade(c, -0.35)]]); U.rr(ctx, -12, -5.5, 24, 11, 5.5); ctx.fill();
        ctx.strokeStyle = U.rgba(U.shade(c, -0.5), 0.8); ctx.lineWidth = 0.8; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.45)'; U.rr(ctx, -8, -3.6, 14, 2.2, 1.1); ctx.fill();
        ctx.fillStyle = U.rgba(U.shade(c, -0.4), 0.5); for (const dx of [-5, 1, 6]) { ctx.beginPath(); ctx.arc(dx, 1.5, 1, 0, TAU); ctx.fill(); }
        break;
      }
      case 'proto': {
        // Entodinium: a ciliate with a tuft of cilia at the mouth and spines at the back
        ctx.strokeStyle = 'rgba(80,70,40,0.7)'; ctx.lineWidth = 0.7;
        for (let k = 0; k < 9; k++) { const y = -7 + k * 1.75, w = Math.sin(o.a * 16 - k * 0.7) * 0.6; ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(14 + Math.cos(w) * 7, y + Math.sin(w) * 7); ctx.stroke(); }
        ctx.fillStyle = '#D8CCA0'; for (const [y0, dy] of [[-4, -7], [3, 6]]) { ctx.beginPath(); ctx.moveTo(-15, y0 - 1.5); ctx.lineTo(-24, y0 + dy); ctx.lineTo(-15, y0 + 1.5); ctx.closePath(); ctx.fill(); }
        ctx.fillStyle = MX.rad(ctx, -3, -3, 1, 16, [[0, '#F4EED4'], [1, '#C8B880']]); ctx.beginPath(); ctx.ellipse(0, 0, 15, 10, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(90,80,50,0.8)'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.fillStyle = 'rgba(130,120,90,0.7)'; U.rr(ctx, -8, -6, 14, 3, 1.5); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,245,0.85)'; for (const [x, y] of [[-4, 3], [3, 4], [-9, 0], [7, 0]]) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill(); }
        break;
      }
      case 'fungus': {
        // an anaerobic fungus: a pear-shaped sporangium rooted by branching rhizoids
        ctx.strokeStyle = 'rgba(220,210,170,0.9)'; ctx.lineWidth = 1;
        for (let k = 0; k < 5; k++) { const a = Math.PI * (0.65 + k * 0.17); ctx.beginPath(); ctx.moveTo(0, 6); ctx.quadraticCurveTo(Math.cos(a) * 8, 6 + Math.sin(a) * 6, Math.cos(a) * 16, 6 + Math.sin(a) * 12); ctx.stroke(); }
        ctx.fillStyle = MX.rad(ctx, -2, -6, 1, 11, [[0, '#F2E8C4'], [1, '#B8A870']]); ctx.beginPath(); ctx.moveTo(0, -14); ctx.bezierCurveTo(9, -12, 9, 2, 0, 6); ctx.bezierCurveTo(-9, 2, -9, -12, 0, -14); ctx.fill();
        ctx.strokeStyle = 'rgba(110,94,50,0.8)'; ctx.lineWidth = 0.8; ctx.stroke();
        break;
      }
      case 'archaea': {
        // methane makers: short rods in little chains, with a faint glow
        ctx.fillStyle = 'rgba(140,210,220,0.25)'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill();
        for (const [x, y, a] of [[-6, -3, 0.3], [0, -1, 0.3], [6, 1, 0.3], [-3, 5, -0.5], [3, 7, -0.5]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = MX.lin(ctx, 0, -2.5, 0, 2.5, [[0, '#9A88C0'], [1, '#5A487A']]); U.rr(ctx, -3, -2.2, 6, 4.4, 2.2); ctx.fill(); ctx.restore(); }
        ctx.fillStyle = 'rgba(244,238,221,0.9)'; ctx.font = '700 8px "Courier Prime", monospace'; ctx.textAlign = 'center'; ctx.fillText('CH₄', 0, -12);
        break;
      }
      case 'bubble':
        ctx.fillStyle = MX.rad(ctx, -o.r * 0.3, -o.r * 0.35, o.r * 0.05, o.r, [[0, 'rgba(255,255,255,0.45)'], [0.7, 'rgba(255,255,255,0.08)'], [1, 'rgba(255,255,255,0.3)']]);
        ctx.beginPath(); ctx.arc(0, 0, o.r, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1; ctx.stroke();
        break;
      case 'nail':
        ctx.rotate(o.rot);
        ctx.fillStyle = MX.lin(ctx, 0, -3, 0, 3, [[0, '#D8DCDC'], [0.5, '#8A9090'], [1, '#4A5050']]); ctx.fillRect(-26, -2.6, 46, 5.2);
        ctx.beginPath(); ctx.moveTo(-26, -2.6); ctx.lineTo(-35, 0); ctx.lineTo(-26, 2.6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = MX.lin(ctx, 20, 0, 25, 0, [[0, '#C8CCCC'], [1, '#5A6060']]); U.rr(ctx, 19, -8, 5, 16, 1.5); ctx.fill();
        ctx.fillStyle = 'rgba(150,80,40,0.45)'; for (const dx of [-12, 2, 10]) { ctx.beginPath(); ctx.ellipse(dx, 0.5, 3, 1.8, 0, 0, TAU); ctx.fill(); }
        break;
      case 'stone': {
        const p = U.blob(0, 0, o.r, o.r * 0.8, 8, 0.25, Math.floor(o.x) % 50);
        ctx.fillStyle = MX.lit(ctx, 0, 0, o.r, '#8A7A6A', 0.35, 0.45); ctx.beginPath(); U.path(ctx, p, true); ctx.fill();
        ctx.strokeStyle = 'rgba(40,30,20,0.6)'; ctx.lineWidth = 1; ctx.stroke();
        break;
      }
      case 'page': {
        const l = o.len * (o.up ? 1 : -1);
        ctx.fillStyle = MX.lin(ctx, -8, 0, 8, 0, [[0, '#B8845E'], [0.5, '#E8C8A8'], [1, '#A87450']]);
        ctx.beginPath(); ctx.moveTo(-8, 0); ctx.quadraticCurveTo(-4, l * 0.6, 0, l); ctx.quadraticCurveTo(4, l * 0.6, 8, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(90,50,30,0.6)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = 'rgba(255,230,200,0.5)'; for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.arc(-2 + (k % 2) * 3, l * k / 6.5, 1.2, 0, TAU); ctx.fill(); }
        o.r = 0; const py = this.y - o.y, near = Math.abs(o.x - G.vw * 0.26) < 10 && (o.up ? py > 0 && py < o.len : py < 0 && -py < o.len); if (near && !o.done) { o.done = true; this.hit(); }
        break;
      }
      case 'acid':
        ctx.fillStyle = MX.rad(ctx, -2, -3, 1, 12, [[0, '#F8FCC8'], [0.6, '#D8E05A'], [1, '#A8B030']]);
        ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(9, 2, 0, 9); ctx.quadraticCurveTo(-9, 2, 0, -12); ctx.fill();
        ctx.strokeStyle = 'rgba(90,100,20,0.7)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#3A4010'; ctx.font = '700 7px "Courier Prime", monospace'; ctx.textAlign = 'center'; ctx.fillText('H⁺', 0, 4);
        break;
    }
    ctx.restore();
  },
  wrap(ctx, text, max) {
    const words = text.split(' '), out = []; let line = '';
    for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > max && line) { out.push(line); line = w; } else line = t; }
    if (line) out.push(line);
    return out;
  },
};
