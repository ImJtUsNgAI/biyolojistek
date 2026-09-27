'use strict';
// Painted world: watercolour ground in cached chunks, ink-outlined sprites, seasonal palettes.
const PAL_BASE = {
  grass: '#8EA35A', grass2: '#A5B86A', grass3: '#6D8747', grassHi: '#B9C77E', meadow: '#B4BE6E', forestFloor: '#5E7340',
  rock: '#A59A86', rockDark: '#6F6556', soil: '#8A6A48', soilDark: '#6A4E36', furrow: '#5F452F', yard: '#C8B48C',
  path: '#D2BF96', pathEdge: '#A99470', bank: '#B59C72', water: '#5E8E95', waterDeep: '#3C6874', waterHi: '#D8EAE2', ice: '#DDE8EA',
  leaf: '#6F8F3C', leafDark: '#4B6A2C', leafHi: '#A2BC5E', pine: '#43614A', pineDark: '#2C4636', bark: '#6A5441', barkGrey: '#8C8478',
  willow: '#8FA85C', willowHi: '#B7C68A', poplar: '#6C8C3A', poplarHi: '#9DB65A',
  flowers: ['#F1EAD2', '#E3A0AE', '#E9CB5A', '#A99AD6', '#F7F4EA'], stone: '#D4C9B1', stoneDark: '#B3A68A', roof: '#A9543A', roofDark: '#86402C',
  wood: '#8B6443', woodDark: '#5E4330', woodLight: '#B08A5E', ink: '#2A2620', snow: '#F5F6F2', clover: '#5F8A3E', cloverFlower: '#D99AB0',
  wheatGreen: '#7FA04A', wheatGold: '#C9A24E', wheatEar: '#B07A3B', yellowed: '#D9C35A', fruit: '#E07A3A', blossom: '#F4D9DE',
};
const PALS = [
  Object.assign({}, PAL_BASE),
  Object.assign({}, PAL_BASE, { grass: '#9FA05A', grass2: '#B3AE69', grass3: '#7D8446', grassHi: '#C4BE7C', meadow: '#C2B96A', forestFloor: '#5C6B3C', leaf: '#5F7F37', leafDark: '#44602A', leafHi: '#8FAA4E', flowers: ['#F2E6C2', '#E7C24F', '#D06A55', '#EFEFEF'], water: '#5A8A8E', clover: '#57803A', poplar: '#5E7E33', poplarHi: '#8BA64F', willow: '#86A055' }),
  Object.assign({}, PAL_BASE, { grass: '#A8955A', grass2: '#B99F68', grass3: '#8A7645', grassHi: '#C8B07A', meadow: '#B89E64', forestFloor: '#6E5A38', leaf: '#C0843A', leafDark: '#8E5A2A', leafHi: '#DDAA55', flowers: ['#E0B060', '#C87850'], water: '#5C8285', clover: '#7C7A3C', poplar: '#D2AE43', poplarHi: '#E8CC6A', willow: '#B7B45E', willowHi: '#D4CB82', fruit: '#D9A240' }),
  Object.assign({}, PAL_BASE, { grass: '#AEB19F', grass2: '#C9CBC0', grass3: '#8F957F', grassHi: '#DADBD2', meadow: '#B8B9A8', forestFloor: '#77806A', water: '#7E9BA2', clover: '#8C9278', yard: '#CFC6B0', path: '#D6CDB6', soil: '#8E7A62' }),
];

const ART = {
  CH: 512, cache: new Map(), sprites: new Map(), scale: 1, sscale: 1.5, grain: null, _pd: null,
  pal() { return PALS[G.S ? G.S.season : 0]; },
  invalidate() { this.cache.clear(); this.sprites.clear(); },
  invalidateRegion(x, y, r) {
    for (const k of [...this.cache.keys()]) {
      const [cx, cy] = k.split(',').map(Number), mx = (cx + 0.5) * this.CH, my = (cy + 0.5) * this.CH;
      if (Math.hypot(mx - x, my - y) < r + this.CH) this.cache.delete(k);
    }
  },
  setScale(z) {
    const s = Math.min(1.25, Math.max(0.6, Math.round(z * 4) / 4)), ss = Math.min(2, Math.max(1, Math.round(z * 4) / 4));
    if (s !== this.scale || ss !== this.sscale) { this.scale = s; this.sscale = ss; this.invalidate(); }
  },
  makeGrain() {
    const n = 256, c = U.canvas(n, n), x = c.getContext('2d'), im = x.createImageData(n, n);
    for (let i = 0; i < n * n; i++) {
      const px = i % n, py = (i / n) | 0;
      const v = 255 - (U.hash(px, py, 4) * 16 + U.noise(px / 6, py / 6, 2) * 10);
      im.data[i * 4] = v; im.data[i * 4 + 1] = v - 2; im.data[i * 4 + 2] = v - 6; im.data[i * 4 + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    x.strokeStyle = 'rgba(120,100,70,0.08)';
    for (let i = 0; i < 60; i++) { const a = U.hash(i, 1, 8) * TAU, x0 = U.hash(i, 2, 8) * n, y0 = U.hash(i, 3, 8) * n; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + Math.cos(a) * 20, y0 + Math.sin(a) * 20); x.stroke(); }
    this.grain = c;
  },
  paths() {
    if (!this._pd) this._pd = WORLD.paths.map((p, i) => ({ w: p.w, main: p.main, d: U.catmull(U.jitter(p.pts, 6, 40 + i), 10) }));
    return this._pd;
  },

  // ============ ground ============
  drawGround(ctx, v) {
    const S = this.CH;
    const a = Math.max(0, Math.floor(v.x0 / S)), b = Math.max(0, Math.floor(v.y0 / S));
    const c = Math.min(Math.ceil(WORLD.W / S) - 1, Math.floor(v.x1 / S)), d = Math.min(Math.ceil(WORLD.H / S) - 1, Math.floor(v.y1 / S));
    for (let j = b; j <= d; j++) for (let i = a; i <= c; i++) ctx.drawImage(this.chunk(i, j), i * S, j * S, S + 0.6, S + 0.6);
  },
  chunk(cx, cy) {
    const key = cx + ',' + cy;
    let c = this.cache.get(key);
    if (c) { this.cache.delete(key); this.cache.set(key, c); return c; }
    const s = this.scale, S = this.CH;
    c = U.canvas(S * s, S * s);
    const x = c.getContext('2d');
    x.setTransform(s, 0, 0, s, -cx * S * s, -cy * S * s);
    this.paintGround(x, cx * S, cy * S, S);
    this.cache.set(key, c);
    if (this.cache.size > 48) this.cache.delete(this.cache.keys().next().value);
    return c;
  },
  paintGround(x, ox, oy, S) {
    const P = this.pal(), Wd = WORLD, season = G.S.season;
    const hit = bb => !(bb[0] > ox + S + 40 || bb[1] > oy + S + 40 || bb[0] + bb[2] < ox - 40 || bb[1] + bb[3] < oy - 40);
    x.fillStyle = P.grass;
    x.fillRect(ox - 2, oy - 2, S + 4, S + 4);
    // large watercolour blooms (global grid → seamless)
    const cell = 150;
    for (let gy = Math.floor((oy - 280) / cell); gy <= Math.floor((oy + S + 280) / cell); gy++)
      for (let gx = Math.floor((ox - 280) / cell); gx <= Math.floor((ox + S + 280) / cell); gx++) {
        const bx = (gx + U.hash(gx, gy, 12)) * cell, by = (gy + U.hash(gx, gy, 13)) * cell, r = 90 + U.hash(gx, gy, 11) * 190;
        if (bx + r < ox || bx - r > ox + S || by + r < oy || by - r > oy + S) continue;
        const col = [P.grass2, P.grass3, P.grassHi][Math.floor(U.hash(gx, gy, 14) * 3)];
        const g = x.createRadialGradient(bx, by, 0, bx, by, r);
        g.addColorStop(0, U.rgba(col, 0.26 + 0.24 * U.hash(gx, gy, 15)));
        g.addColorStop(0.7, U.rgba(col, 0.12));
        g.addColorStop(1, U.rgba(col, 0));
        x.fillStyle = g;
        x.fillRect(bx - r, by - r, r * 2, r * 2);
      }
    // hills: contour hatching near the top and edges
    x.save();
    x.strokeStyle = U.rgba(P.grass3, 0.5);
    x.lineWidth = 2;
    for (let k = 0; k < 5; k++) {
      const pts = [];
      for (let px = ox - 60; px <= ox + S + 60; px += 60) pts.push([px, 175 + k * 42 + Math.sin(px * 0.004 + k) * 22 + U.noise(px * 0.01, k, 3) * 20]);
      if (pts[0][1] > oy - 40 && pts[0][1] < oy + S + 40) { x.beginPath(); U.path(x, pts, false); x.stroke(); }
    }
    x.restore();
    const rb = U.bbox(Wd.forestPoly);
    if (hit(rb)) {
      U.wash(x, Wd.forestPoly, P.forestFloor, { alpha: 0.5, edge: 0.18, seed: 3, amp: 10 });
      for (let i = 0; i < 260; i++) {
        const px = rb[0] + U.hash(i, 1, 31) * rb[2], py = rb[1] + U.hash(i, 2, 31) * rb[3];
        if (px < ox - 20 || px > ox + S + 20 || py < oy - 20 || py > oy + S + 20 || !U.inPoly(px, py, Wd.forestPoly)) continue;
        x.fillStyle = U.rgba(season === 2 ? '#B0703A' : P.leafDark, 0.35);
        U.ellipse(x, px, py, 4 + U.hash(i, 3, 31) * 5, 2 + U.hash(i, 4, 31) * 2, U.hash(i, 5, 31) * 3); x.fill();
      }
    }
    if (hit(U.bbox(Wd.meadowPoly))) U.wash(x, Wd.meadowPoly, P.meadow, { alpha: 0.45, edge: 0.1, seed: 7, amp: 12 });
    // rock & mountain
    const rk = U.bbox(Wd.rockPoly);
    if (hit(rk)) {
      U.wash(x, Wd.rockPoly, P.rock, { edge: 0.4, seed: 9, amp: 6 });
      x.save(); x.beginPath(); U.path(x, Wd.rockPoly, true); x.clip();
      x.strokeStyle = U.rgba(P.rockDark, 0.45); x.lineWidth = 2;
      for (let k = 0; k < 16; k++) { const y0 = 40 + k * 42; x.beginPath(); U.path(x, [[3780, y0 + 30], [4100, y0 + U.hash(k, 1, 4) * 30], [4450, y0 + 20], [4820, y0 - 10]], false); x.stroke(); }
      for (let i = 0; i < 70; i++) { const px = 3850 + U.hash(i, 1, 5) * 950, py = 20 + U.hash(i, 2, 5) * 640; U.wash(x, U.blob(px, py, 10 + U.hash(i, 3, 5) * 26, 8 + U.hash(i, 4, 5) * 16, 8, 0.2, i), U.mix(P.rock, P.rockDark, U.hash(i, 5, 5) * 0.6), { edge: 0.4, seed: i }); }
      // sulphur staining around the spring
      const g = x.createRadialGradient(4180, 600, 0, 4180, 600, 160);
      g.addColorStop(0, 'rgba(226,200,80,0.55)'); g.addColorStop(1, 'rgba(226,200,80,0)');
      x.fillStyle = g; x.fillRect(4000, 440, 360, 320);
      x.restore();
      U.ink(x, Wd.rockPoly, { closed: true, w: 1.8, alpha: 0.7, seed: 12, amp: 3 });
    }
    // the yayla: a high meadow held in a hollow of the rock, late snow lingering in its shady corners
    const yp = Wd.yaylaPoly, yb = U.bbox(yp);
    if (hit(yb)) {
      U.wash(x, yp, season === 3 ? '#E9ECE8' : '#93A45C', { edge: 0.3, seed: 41, amp: 5 });
      x.save(); x.beginPath(); U.path(x, yp, true); x.clip();
      for (let i = 0; i < 620; i++) {
        const px = yb[0] + U.hash(i, 1, 43) * yb[2], py = yb[1] + U.hash(i, 2, 43) * yb[3];
        if (px < ox - 10 || px > ox + S + 10 || py < oy - 10 || py > oy + S + 10) continue;
        if (season === 3) { if (U.hash(i, 3, 43) < 0.3) { x.fillStyle = 'rgba(190,200,214,0.45)'; U.ellipse(x, px, py, 6, 2); x.fill(); } continue; }
        x.strokeStyle = U.hash(i, 3, 43) < 0.5 ? '#6E8440' : '#B0C070'; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (U.hash(i, 4, 43) - 0.5) * 5, py - 5); x.stroke();
        if (season < 2 && U.hash(i, 5, 43) < 0.3) { x.fillStyle = ['#3E5AA8', '#E8C84E', '#D86A8A', '#F4F2EA', '#8A5AB8'][i % 5]; x.beginPath(); x.arc(px + 1, py - 5, 2, 0, TAU); x.fill(); }
      }
      if (season !== 1) for (const [sx, sy, r] of [[4420, 212, 44], [4700, 206, 50], [4730, 300, 30]]) U.wash(x, U.blob(sx, sy, r, r * 0.5, 10, 0.25, sx), '#F4F6F2', { alpha: 0.9, edge: 0.4, seed: sx });
      x.restore();
      U.ink(x, yp, { closed: true, w: 1.6, alpha: 0.55, seed: 42, amp: 2 });
    }
    // packed-earth yards
    Wd.yards.forEach((yd, i) => { if (hit(U.bbox(yd))) { U.wash(x, yd, P.yard, { alpha: 0.85, edge: 0.3, seed: 60 + i, amp: 5 }); } });
    // river banks
    const rp = W.riverPts, rw = W.riverW;
    x.save();
    x.lineCap = 'round'; x.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) {
      x.strokeStyle = pass ? P.bank : U.shade(P.bank, -0.18);
      for (let i = 0; i < rp.length - 1; i++) {
        const mx = rp[i][0], my = rp[i][1];
        if (mx < ox - 200 || mx > ox + S + 200 || my < oy - 200 || my > oy + S + 200) continue;
        x.lineWidth = rw[i] + (pass ? 30 : 42);
        x.beginPath(); x.moveTo(rp[i][0], rp[i][1]); x.lineTo(rp[i + 1][0], rp[i + 1][1]); x.stroke();
      }
    }
    x.restore();
    const pb = U.bbox(W.pondPts);
    if (hit(pb)) {
      const big = W.pondPts.map(p => [Wd.pond.x + (p[0] - Wd.pond.x) * 1.13, Wd.pond.y + (p[1] - Wd.pond.y) * 1.13]);
      U.wash(x, big, P.bank, { edge: 0.35, seed: 14, amp: 5 });
    }
    // fields
    for (const f of Wd.fields) {
      if (!hit([f.x - 20, f.y - 20, f.w + 40, f.h + 40])) continue;
      const pts = [[f.x, f.y], [f.x + f.w, f.y + 4], [f.x + f.w - 3, f.y + f.h], [f.x + 4, f.y + f.h - 3]];
      U.wash(x, pts, season === 3 ? U.mix(P.soil, '#FFFFFF', 0.25) : P.soil, { edge: 0.35, seed: f.id.charCodeAt(0), amp: 3 });
      x.save(); x.beginPath(); U.poly(x, pts, true); x.clip();
      x.strokeStyle = U.rgba(P.furrow, 0.55); x.lineWidth = 3;
      for (let k = -4; k < f.h / 13 + 4; k++) {
        const y0 = f.y + k * 13;
        x.beginPath(); x.moveTo(f.x - 20, y0 + Math.tan(f.ang) * -20);
        for (let px = f.x; px <= f.x + f.w + 20; px += 40) x.lineTo(px, y0 + Math.tan(f.ang) * (px - f.x) + Math.sin(px * 0.05 + k) * 1.2);
        x.stroke();
      }
      x.restore();
      U.ink(x, pts, { closed: true, w: 1.4, alpha: 0.55, seed: 5, smooth: false, amp: 1.5 });
      // grassy margin
      x.strokeStyle = U.rgba(P.grass3, 0.7); x.lineWidth = 1.2;
      for (let k = 0; k < (f.w + f.h) * 2; k += 9) {
        let px, py;
        if (k < f.w) { px = f.x + k; py = f.y; } else if (k < f.w + f.h) { px = f.x + f.w; py = f.y + k - f.w; } else if (k < 2 * f.w + f.h) { px = f.x + f.w - (k - f.w - f.h); py = f.y + f.h; } else { px = f.x; py = f.y + f.h - (k - 2 * f.w - f.h); }
        x.beginPath(); x.moveTo(px, py); x.lineTo(px + (U.hash(k, 1, 6) - 0.5) * 6, py - 5 - U.hash(k, 2, 6) * 4); x.stroke();
      }
    }
    // clover paddock carpet
    const cl = Wd.paddocks[0];
    if (hit([cl.x, cl.y, cl.w, cl.h])) {
      U.wash(x, U.rectPts(cl.x + 4, cl.y + 4, cl.w - 8, cl.h - 8), U.mix(P.clover, P.grass, 0.4), { edge: 0.2, seed: 17, amp: 4 });
      for (let i = 0; i < 900; i++) {
        const px = cl.x + 8 + U.hash(i, 1, 41) * (cl.w - 16), py = cl.y + 8 + U.hash(i, 2, 41) * (cl.h - 16);
        if (px < ox - 10 || px > ox + S + 10 || py < oy - 10 || py > oy + S + 10) continue;
        x.fillStyle = U.rgba(P.clover, 0.85);
        for (let l = 0; l < 3; l++) { const a = l * 2.1 + i; x.beginPath(); x.arc(px + Math.cos(a) * 2.6, py + Math.sin(a) * 2.2, 2.2, 0, TAU); x.fill(); }
        if (season < 2 && U.hash(i, 3, 41) < 0.12) { x.fillStyle = U.hash(i, 4, 41) < 0.6 ? P.cloverFlower : '#F2EFE4'; x.beginPath(); x.arc(px + 1, py - 3, 2.6, 0, TAU); x.fill(); }
      }
    }
    // paths
    for (const p of this.paths()) {
      const bb = U.bbox(p.d);
      if (!hit([bb[0] - p.w, bb[1] - p.w, bb[2] + p.w * 2, bb[3] + p.w * 2])) continue;
      x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
      x.strokeStyle = U.rgba(P.pathEdge, 0.5); x.lineWidth = p.w + 12; x.beginPath(); U.poly(x, p.d, false); x.stroke();
      x.strokeStyle = U.rgba(P.ink, 0.35); x.lineWidth = p.w + 3; x.stroke();
      x.strokeStyle = P.path; x.lineWidth = p.w; x.stroke();
      if (p.main) {
        x.strokeStyle = U.rgba(P.pathEdge, 0.45); x.lineWidth = 3;
        for (const s of [-9, 9]) { x.beginPath(); U.poly(x, U.offsetLine(p.d, s), false); x.stroke(); }
      }
      x.restore();
      for (let i = 0; i < p.d.length; i += 2) {
        const q = p.d[i];
        if (q[0] < ox - 30 || q[0] > ox + S + 30 || q[1] < oy - 30 || q[1] > oy + S + 30) continue;
        if (U.hash(i, 7, p.w) < 0.45) {
          const px = q[0] + (U.hash(i, 8, p.w) - 0.5) * p.w * 0.8, py = q[1] + (U.hash(i, 9, p.w) - 0.5) * p.w * 0.8;
          x.fillStyle = U.rgba(P.pathEdge, 0.7); U.ellipse(x, px, py, 2 + U.hash(i, 1, 2) * 2, 1.5 + U.hash(i, 2, 2)); x.fill();
        }
      }
    }
    // tufts and flowers
    const tc = 30, restored = (G.S.restored || {});
    for (let gy = Math.floor(oy / tc); gy <= Math.floor((oy + S) / tc); gy++)
      for (let gx = Math.floor(ox / tc); gx <= Math.floor((ox + S) / tc); gx++) {
        const h = U.hash(gx, gy, 21);
        if (h > 0.62) continue;
        const px = (gx + U.hash(gx, gy, 22)) * tc, py = (gy + U.hash(gx, gy, 23)) * tc;
        const ter = W.terrainAt(px, py);
        if (ter !== 'grass' && ter !== 'meadow' && ter !== 'forest') continue;
        if (W._inBuilding(px, py, 4) || Wd.yards.some(yd => U.inPoly(px, py, yd)) || this.paths().some(p => U.distPoly(px, py, p.d) < p.w / 2 + 4)) continue;
        const reg = W.regionAt(px, py), lush = reg && restored[reg] >= 1 ? 1 : 0;
        if (h < 0.4) {
          x.strokeStyle = U.rgba(U.mix(P.grass3, P.ink, 0.25), 0.55); x.lineWidth = 1.1;
          x.beginPath();
          const n = 3 + Math.floor(U.hash(gx, gy, 24) * 3);
          for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (k - n / 2) * 0.28; x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a) * 4, py - 4, px + Math.cos(a) * 7, py + Math.sin(a) * (5 + U.hash(k, gx, gy) * 4)); }
          x.stroke();
        }
        const fl = (ter === 'meadow' ? 0.5 : 0.1) + lush * 0.25;
        if (season < 2 && U.hash(gx, gy, 25) < fl) {
          const col = U.pick(P.flowers, U.hash(gx, gy, 26));
          const fx = px + 6, fy = py - 2;
          x.fillStyle = col;
          for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; x.beginPath(); x.arc(fx + Math.cos(a) * 2.2, fy + Math.sin(a) * 2.2, 1.7, 0, TAU); x.fill(); }
          x.fillStyle = '#E9C74E'; x.beginPath(); x.arc(fx, fy, 1.2, 0, TAU); x.fill();
        }
      }
    // winter snow patches
    if (season === 3) {
      for (let gy = Math.floor((oy - 200) / 110); gy <= Math.floor((oy + S + 200) / 110); gy++)
        for (let gx = Math.floor((ox - 200) / 110); gx <= Math.floor((ox + S + 200) / 110); gx++) {
          if (U.hash(gx, gy, 51) > 0.55) continue;
          const bx = (gx + U.hash(gx, gy, 52)) * 110, by = (gy + U.hash(gx, gy, 53)) * 110;
          if (W.onWater(bx, by)) continue;
          U.wash(x, U.blob(bx, by, 40 + U.hash(gx, gy, 54) * 60, 20 + U.hash(gx, gy, 55) * 30, 12, 0.25, gx * 31 + gy), P.snow, { alpha: 0.75, edge: 0.12, seed: gx + gy });
        }
    }
    // paper grain
    if (!this.grain) this.makeGrain();
    x.save();
    x.globalCompositeOperation = 'multiply';
    x.globalAlpha = 0.55;
    x.fillStyle = x.createPattern(this.grain, 'repeat');
    x.fillRect(ox, oy, S, S);
    x.restore();
  },

  // ============ water ============
  drawWater(ctx, t, v) {
    const P = this.pal(), S = G.S, rp = W.riverPts, rw = W.riverW, frozen = S.season === 3;
    if (!this._rl) { this._rl = U.offsetLine(rp, i => rw[i] / 2); this._rr = U.offsetLine(rp, i => -rw[i] / 2); this._rpoly = this._rl.concat(this._rr.slice().reverse()); }
    ctx.save();
    ctx.fillStyle = frozen ? U.mix(P.water, P.ice, 0.35) : P.water;
    ctx.beginPath(); U.poly(ctx, this._rpoly, true); ctx.fill();
    ctx.strokeStyle = U.rgba(P.waterDeep, 0.35); ctx.lineCap = 'round';
    for (let i = 0; i < rp.length - 1; i += 1) { ctx.lineWidth = rw[i] * 0.4; ctx.beginPath(); ctx.moveTo(rp[i][0], rp[i][1]); ctx.lineTo(rp[i + 1][0], rp[i + 1][1]); ctx.stroke(); }
    // flow highlights
    if (!frozen) {
      ctx.strokeStyle = P.waterHi; ctx.lineWidth = 1.6;
      for (let i = 0; i < rp.length - 2; i++) {
        const a = rp[i], b = rp[i + 1];
        if (a[0] < v.x0 - 100 || a[0] > v.x1 + 100 || a[1] < v.y0 - 100 || a[1] > v.y1 + 100) continue;
        for (let k = 0; k < 2; k++) {
          const ph = (t * 0.45 + U.hash(i, k, 3)) % 1, off = (U.hash(i, k, 4) - 0.5) * rw[i] * 0.7;
          const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
          const px = a[0] + dx * ph + nx * off, py = a[1] + dy * ph + ny * off;
          ctx.globalAlpha = Math.sin(ph * Math.PI) * 0.7;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dx / l * 12, py + dy / l * 12); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
      for (let i = 0; i < rp.length - 1; i += 4) { const a = rp[i]; ctx.beginPath(); ctx.moveTo(a[0] - 10, a[1] - 6); ctx.lineTo(a[0] + 8, a[1] + 3); ctx.lineTo(a[0] + 14, a[1] - 2); ctx.stroke(); }
    }
    U.ink(ctx, this._rl, { w: 1.5, alpha: 0.55, seed: 3, amp: 0.8 });
    U.ink(ctx, this._rr, { w: 1.5, alpha: 0.55, seed: 4, amp: 0.8 });
    // pond
    const pond = S.pond, alg = U.clamp(pond.algae / 100, 0, 1);
    const pcol = frozen ? P.ice : U.mix(P.water, '#7C9A3A', alg * 0.85);
    ctx.fillStyle = pcol;
    ctx.beginPath(); U.path(ctx, W.pondPts, true); ctx.fill();
    ctx.save(); ctx.beginPath(); U.path(ctx, W.pondPts, true); ctx.clip();
    const g = ctx.createRadialGradient(WORLD.pond.x - 40, WORLD.pond.y - 30, 10, WORLD.pond.x, WORLD.pond.y, 260);
    g.addColorStop(0, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(0,30,40,0.2)');
    ctx.fillStyle = g; ctx.fillRect(WORLD.pond.x - 300, WORLD.pond.y - 220, 600, 440);
    if (!frozen) {
      // fish
      for (let i = 0; i < pond.fish; i++) {
        const a = t * (0.25 + i * 0.04) + i * 1.7, px = WORLD.pond.x + Math.cos(a) * (70 + i * 22), py = WORLD.pond.y + Math.sin(a * 1.3) * (40 + i * 9);
        ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI / 2); ctx.globalAlpha = 0.55 - alg * 0.35;
        ctx.fillStyle = i % 2 ? '#D9823A' : '#B8C0B8'; U.ellipse(ctx, 0, 0, 8, 3.2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-12, -3.5); ctx.lineTo(-12, 3.5); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      // algal scum
      if (alg > 0.4) {
        for (let i = 0; i < 16; i++) {
          const px = WORLD.pond.x + (U.hash(i, 1, 7) - 0.5) * 420, py = WORLD.pond.y + (U.hash(i, 2, 7) - 0.5) * 280;
          U.wash(ctx, U.blob(px, py, 26 + U.hash(i, 3, 7) * 40, 14 + U.hash(i, 4, 7) * 18, 10, 0.3, i), '#9DBA4C', { alpha: (alg - 0.4) * 1.5, edge: 0.3, seed: i, inner: false });
        }
      }
      // dead fish floating
      for (let i = 0; i < pond.dead; i++) {
        const px = WORLD.pond.x - 120 + i * 60 + Math.sin(t * 0.5 + i) * 4, py = WORLD.pond.y + 70 + (i % 2) * 30;
        ctx.save(); ctx.translate(px, py); ctx.rotate(0.3 * i);
        ctx.fillStyle = '#D9DDD6'; U.ellipse(ctx, 0, 0, 9, 3.4); ctx.fill();
        ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-13, -4); ctx.lineTo(-13, 4); ctx.closePath(); ctx.fillStyle = '#D9DDD6'; ctx.fill(); ctx.stroke();
        ctx.fillStyle = P.ink; ctx.font = '7px sans-serif'; ctx.fillText('x', 4, 2);
        ctx.restore();
      }
      // lily pads when healthy
      if (alg < 0.5 && S.season < 2) {
        for (let i = 0; i < 9; i++) {
          const px = WORLD.pond.x - 150 + U.hash(i, 1, 9) * 300, py = WORLD.pond.y - 90 + U.hash(i, 2, 9) * 180, r = 9 + U.hash(i, 3, 9) * 6;
          ctx.fillStyle = '#6E9A4A'; ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, r, 0.3, TAU - 0.1); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = U.rgba(P.ink, 0.5); ctx.lineWidth = 1; ctx.stroke();
          if (i % 3 === 0 && S.season === 1) { ctx.fillStyle = '#F4E6EC'; ctx.beginPath(); ctx.arc(px + 2, py - 2, 3.5, 0, TAU); ctx.fill(); }
        }
      }
      // ripples
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.4 + i / 3) % 1, px = WORLD.pond.x - 80 + U.hash(Math.floor(t * 0.4 + i / 3), i, 2) * 160, py = WORLD.pond.y - 40 + U.hash(Math.floor(t * 0.4 + i / 3), i, 3) * 80;
        ctx.strokeStyle = `rgba(230,245,240,${(1 - ph) * 0.5})`; ctx.lineWidth = 1;
        U.ellipse(ctx, px, py, 4 + ph * 22, 2 + ph * 10); ctx.stroke();
      }
    }
    ctx.restore();
    U.ink(ctx, W.pondPts, { closed: true, w: 1.6, alpha: 0.6, seed: 8, amp: 1 });
    // reeds around the pond, and the buffer strip if planted
    this._reeds(ctx, t, P);
    ctx.restore();
  },
  _reeds(ctx, t, P) {
    if (!this._reedPts) {
      this._reedPts = [];
      const pp = W.pondPts;
      for (let i = 0; i < pp.length; i++) for (let k = 0; k < 3; k++) {
        const a = pp[i], b = pp[(i + 1) % pp.length], f = (k + U.hash(i, k, 6)) / 3;
        const px = U.lerp(a[0], b[0], f), py = U.lerp(a[1], b[1], f);
        const dx = px - WORLD.pond.x, dy = py - WORLD.pond.y, l = Math.hypot(dx, dy);
        if (U.hash(i, k, 7) < 0.55) this._reedPts.push([px + dx / l * 14, py + dy / l * 10]);
      }
      this._bufferPts = [];
      for (let x = 1340; x < 2080; x += 26) { const y = 2070 - (x - 1340) * 0.09 + (x > 1700 ? -12 : 0); this._bufferPts.push([x + U.hash(x, 1, 3) * 8, y + U.hash(x, 2, 3) * 10]); }
    }
    const list = G.S.buffer ? this._reedPts.concat(this._bufferPts) : this._reedPts;
    const dry = G.S.season === 3;
    ctx.lineCap = 'round';
    for (const [px, py] of list) {
      const sw = Math.sin(t * 1.4 + px * 0.05) * 2;
      ctx.strokeStyle = dry ? '#B8A77A' : '#6E8A3E'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let k = -2; k <= 2; k++) { ctx.moveTo(px + k * 2, py); ctx.quadraticCurveTo(px + k * 3, py - 12, px + k * 4 + sw, py - 22 - Math.abs(k) * -2); }
      ctx.stroke();
      ctx.fillStyle = '#6B4A30'; U.ellipse(ctx, px + sw + 1, py - 22, 1.8, 5); ctx.fill();
    }
  },
  drawBridges(ctx) {
    const P = this.pal();
    for (const b of WORLD.bridges) {
      if (b.nx == null) continue;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.atan2(b.ny, b.nx));
      const L = b.len / 2, H = b.w / 2;
      ctx.fillStyle = 'rgba(30,40,40,0.25)'; ctx.fillRect(-L + 6, -H + 8, b.len, b.w);
      ctx.fillStyle = P.woodLight; ctx.fillRect(-L, -H, b.len, b.w);
      ctx.strokeStyle = U.rgba(P.woodDark, 0.8); ctx.lineWidth = 1.2;
      for (let s = -L; s <= L; s += 11) { ctx.beginPath(); ctx.moveTo(s, -H); ctx.lineTo(s + 0.5, H); ctx.stroke(); }
      ctx.fillStyle = P.woodDark;
      for (const side of [-1, 1]) {
        ctx.fillRect(-L, side * H - (side > 0 ? 5 : 0), b.len, 5);
        for (let s = -L; s <= L; s += 38) ctx.fillRect(s - 3, side * H - 4, 7, 8);
      }
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1.4; ctx.strokeRect(-L, -H, b.len, b.w);
      ctx.restore();
    }
  },

  // ============ crops ============
  drawCrops(ctx, t, v) {
    const P = this.pal(), S = G.S;
    for (const f of WORLD.fields) {
      if (f.x > v.x1 + 40 || f.x + f.w < v.x0 - 40 || f.y > v.y1 + 60 || f.y + f.h < v.y0 - 40) continue;
      const st = S.fields[f.id];
      if (!st || !st.crop) continue;
      const cols = Math.floor(f.w / 22), rows = Math.floor(f.h / 24);
      const stems = new Path2D(), yel = new Path2D(), ears = new Path2D(), awns = new Path2D(), leaves = new Path2D();
      const ripe = st.stage >= 3 && st.crop === 'wheat';
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const px = f.x + 11 + i * 22 + (U.hash(i, j, 3) - 0.5) * 7, py = f.y + 18 + j * 24 + Math.tan(f.ang) * (i * 22) + (U.hash(i, j, 4) - 0.5) * 6;
        const sw = Math.sin(t * 1.6 + px * 0.02 + py * 0.013) * 1.8;
        if (st.crop === 'wheat') {
          if (st.stage === 0) { stems.moveTo(px, py); stems.lineTo(px + 1, py - 4); stems.moveTo(px + 3, py); stems.lineTo(px + 3, py - 3); continue; }
          if (st.stage >= 4) { yel.moveTo(px, py); yel.lineTo(px + 1, py - 4); yel.moveTo(px + 3, py); yel.lineTo(px + 3.5, py - 3); continue; }
          const h = st.stage === 1 ? 10 : 20 + U.hash(i, j, 5) * 4;
          for (let k = -2; k <= 2; k++) {
            const tx = px + k * 2.2 + sw * (h / 20), ty = py - h + Math.abs(k) * 2;
            const lower = st.yellow && Math.abs(k) === 2;
            const path = ripe ? yel : lower ? yel : stems;
            path.moveTo(px + k, py); path.quadraticCurveTo(px + k * 1.5, py - h * 0.5, tx, ty);
            if (st.stage >= 2 && Math.abs(k) < 2) {
              ears.moveTo(tx + 2.2, ty); ears.ellipse(tx, ty, 2.2, 4.2, 0.1 * k, 0, TAU);
              if (ripe) { awns.moveTo(tx, ty - 3); awns.lineTo(tx + sw * 0.5 + k, ty - 11); }
            }
          }
        } else if (st.crop === 'chickpea') {
          const r = [2, 4, 6.5, 7.5, 5][Math.min(4, st.stage)];
          leaves.moveTo(px + r, py - r); leaves.ellipse(px + sw * 0.3, py - r, r, r * 0.8, 0, 0, TAU);
          if (st.stage >= 3) { ears.moveTo(px + 3, py - r); ears.ellipse(px + 2, py - r - 1, 2.2, 1.5, 0.4, 0, TAU); }
        } else if (st.crop === 'fallow') {
          if (U.hash(i, j, 9) < 0.3) { stems.moveTo(px, py); stems.lineTo(px - 2, py - 5); stems.moveTo(px, py); stems.lineTo(px + 2, py - 6); }
        }
      }
      ctx.save();
      ctx.lineCap = 'round';
      const green = st.crop === 'fallow' ? P.grass3 : P.wheatGreen;
      if (st.crop === 'chickpea') {
        ctx.fillStyle = '#6F9448'; ctx.fill(leaves);
        ctx.strokeStyle = U.rgba(P.ink, 0.45); ctx.lineWidth = 0.8; ctx.stroke(leaves);
        ctx.fillStyle = '#D8C79A'; ctx.fill(ears);
      } else {
        ctx.strokeStyle = green; ctx.lineWidth = 1.3; ctx.stroke(stems);
        ctx.strokeStyle = ripe ? P.wheatGold : P.yellowed; ctx.lineWidth = 1.3; ctx.stroke(yel);
        ctx.fillStyle = ripe ? P.wheatEar : U.mix(P.wheatGreen, P.wheatGold, 0.3); ctx.fill(ears);
        ctx.strokeStyle = U.rgba(P.ink, 0.35); ctx.lineWidth = 0.6; ctx.stroke(ears);
        ctx.strokeStyle = U.rgba(P.wheatEar, 0.8); ctx.lineWidth = 0.7; ctx.stroke(awns);
      }
      ctx.restore();
    }
  },

  // ============ sprites ============
  spr(key, w, h, ax, ay, draw) {
    let s = this.sprites.get(key);
    if (!s) {
      const sc = this.sscale, c = U.canvas(w * sc, h * sc), x = c.getContext('2d');
      x.setTransform(sc, 0, 0, sc, ax * sc, ay * sc);
      x.lineCap = 'round'; x.lineJoin = 'round';
      draw(x);
      s = { c, w, h, ax, ay };
      this.sprites.set(key, s);
    }
    return s;
  },
  blit(ctx, s, x, y, k = 1) { ctx.drawImage(s.c, x - s.ax * k, y - s.ay * k, s.w * k, s.h * k); },
  shadow(x, rx, ry, dx = 8) {
    x.fillStyle = 'rgba(40,48,30,0.26)';
    U.ellipse(x, dx, 2, rx, ry); x.fill();
  },

  // ---------------- trees ----------------
  drawTree(ctx, tr, t) {
    const season = G.S.season, v = tr.seed % 3;
    const dims = { oak: [170, 190, 85, 170], pine: [140, 210, 70, 196], poplar: [80, 260, 40, 246], willow: [170, 170, 85, 150], walnut: [200, 200, 100, 180], fruit: [100, 120, 50, 104] }[tr.type];
    const s = this.spr(`t_${tr.type}_${v}_${season}`, dims[0], dims[1], dims[2], dims[3], x => this['tree_' + tr.type](x, this.pal(), tr.seed % 3 * 13 + 3, season));
    const sw = G.reduceMotion ? 0 : Math.sin(t * 0.9 + tr.seed) * 0.018;
    ctx.save();
    ctx.translate(tr.x, tr.y);
    ctx.transform(1, 0, sw, 1, 0, 0);
    this.blit(ctx, s, 0, 0, tr.s);
    ctx.restore();
  },
  _trunk(x, w, h, col, seed, lean = 0) {
    const pts = [[-w, 0], [-w * 0.7 + lean * 0.5, -h * 0.5], [-w * 0.55 + lean, -h], [w * 0.55 + lean, -h], [w * 0.7 + lean * 0.5, -h * 0.5], [w, 0]];
    x.fillStyle = col; x.beginPath(); U.path(x, pts, true); x.fill();
    x.strokeStyle = U.rgba(U.shade(col, -0.4), 0.6); x.lineWidth = 1;
    for (let i = 0; i < 4; i++) { const px = (U.hash(i, 1, seed) - 0.5) * w; x.beginPath(); x.moveTo(px, -2); x.lineTo(px + lean * 0.4, -h * (0.4 + U.hash(i, 2, seed) * 0.5)); x.stroke(); }
    U.ink(x, pts.slice(0, 3), { w: 1.3, amp: 0.4, seed }); U.ink(x, pts.slice(3), { w: 1.3, amp: 0.4, seed: seed + 1 });
  },
  _branches(x, x0, y0, len, ang, depth, w, seed, snow) {
    if (depth <= 0 || len < 5) return;
    const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
    x.lineWidth = w; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
    if (snow && depth < 3 && U.hash(depth, seed, 2) < 0.6) { x.save(); x.strokeStyle = '#F7F7F2'; x.lineWidth = w * 0.8 + 1; x.beginPath(); x.moveTo(x0, y0 - 1); x.lineTo(x1, y1 - 1.5); x.stroke(); x.restore(); }
    this._branches(x, x1, y1, len * 0.72, ang - 0.42 + (U.hash(seed, 1, depth) - 0.5) * 0.35, depth - 1, w * 0.66, seed * 3 + 1, snow);
    this._branches(x, x1, y1, len * 0.7, ang + 0.4 + (U.hash(seed, 2, depth) - 0.5) * 0.35, depth - 1, w * 0.66, seed * 3 + 2, snow);
  },
  _bare(x, P, trunkH, len, seed) {
    x.strokeStyle = U.mix(P.bark, P.ink, 0.35);
    this._branches(x, 0, -trunkH, len, -Math.PI / 2, 5, 5, seed, true);
  },
  _crown(x, cx, cy, R, ry, cols, seed, n = 7) {
    U.wash(x, U.blob(cx, cy + 5, R, ry, 20, 0.14, seed), cols[0], { seed, edge: 0.35, amp: 2.5 });
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + U.hash(i, 1, seed), d = R * 0.42;
      U.wash(x, U.blob(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8 - 5, R * 0.46, ry * 0.42, 12, 0.22, seed + i), cols[1], { seed: seed + i, edge: 0.28, amp: 1.4 });
    }
    for (let i = 0; i < 5; i++) {
      const px = cx - R * 0.35 + U.hash(i, 3, seed) * R * 0.5, py = cy - ry * 0.55 + U.hash(i, 4, seed) * ry * 0.45;
      U.wash(x, U.blob(px, py, R * 0.22, ry * 0.18, 9, 0.25, seed + 40 + i), cols[2], { seed: seed + i, edge: 0.15, alpha: 0.85, inner: false });
    }
    x.fillStyle = U.rgba(cols[0], 0.6);
    for (let i = 0; i < 46; i++) {
      const a = U.hash(i, 5, seed) * TAU, d = Math.sqrt(U.hash(i, 6, seed)) * R * 0.9;
      U.ellipse(x, cx + Math.cos(a) * d, cy + Math.sin(a) * d * (ry / R), 2.6, 1.6, a); x.fill();
    }
    U.ink(x, U.blob(cx, cy + 2, R * 1.03, ry * 1.04, 22, 0.14, seed + 99), { closed: true, w: 1.4, alpha: 0.72, seed });
  },
  tree_oak(x, P, seed, season) {
    this.shadow(x, 50, 15);
    this._trunk(x, 10, 58, P.bark, seed);
    if (season === 3) return this._bare(x, P, 50, 34, seed);
    this._crown(x, 0, -100, 58, 50, [P.leafDark, P.leaf, P.leafHi], seed, 8);
  },
  tree_walnut(x, P, seed, season) {
    this.shadow(x, 62, 18);
    this._trunk(x, 12, 62, P.barkGrey, seed);
    if (season === 3) return this._bare(x, P, 56, 40, seed);
    const c = season === 2 ? ['#9A7A34', '#C4A24C', '#E2C877'] : [P.leafDark, U.mix(P.leaf, '#3F6B3A', 0.3), P.leafHi];
    this._crown(x, 0, -112, 76, 58, c, seed + 5, 9);
  },
  tree_fruit(x, P, seed, season) {
    this.shadow(x, 30, 10, 5);
    this._trunk(x, 6, 36, P.bark, seed, 3);
    if (season === 3) return this._bare(x, P, 34, 20, seed);
    this._crown(x, 2, -62, 38, 30, [P.leafDark, P.leaf, P.leafHi], seed, 6);
    if (season === 0 || season === 1) {
      for (let i = 0; i < 26; i++) {
        const a = U.hash(i, 1, seed) * TAU, d = Math.sqrt(U.hash(i, 2, seed)) * 32;
        x.fillStyle = season === 0 ? (i % 3 ? P.blossom : '#FFFFFF') : P.fruit;
        x.beginPath(); x.arc(2 + Math.cos(a) * d, -62 + Math.sin(a) * d * 0.8, season === 0 ? 2.6 : 3, 0, TAU); x.fill();
        if (season === 1) { x.strokeStyle = U.rgba(P.ink, 0.5); x.lineWidth = 0.7; x.stroke(); }
      }
    }
  },
  tree_pine(x, P, seed, season) {
    this.shadow(x, 40, 12);
    this._trunk(x, 7, 110, U.mix(P.bark, '#8A5A3A', 0.4), seed, 4);
    const layers = [[-96, 50, 22], [-130, 58, 24], [-160, 46, 20], [-184, 30, 15]];
    layers.forEach(([cy, R, ry], i) => {
      U.wash(x, U.blob(4 + (i % 2 ? -6 : 6), cy, R, ry, 16, 0.22, seed + i), i % 2 ? P.pine : P.pineDark, { seed: seed + i, edge: 0.35 });
      x.fillStyle = U.rgba(U.shade(P.pine, 0.25), 0.6);
      for (let k = 0; k < 10; k++) { const px = (U.hash(k, i, seed) - 0.5) * R * 1.4, py = cy - ry * 0.4 + U.hash(k, i + 9, seed) * ry * 0.5; U.ellipse(x, px, py, 4, 1.8, -0.2); x.fill(); }
      if (season === 3) { x.fillStyle = '#F6F7F2'; U.ellipse(x, 4, cy - ry * 0.55, R * 0.7, ry * 0.35); x.fill(); }
      U.ink(x, U.blob(4 + (i % 2 ? -6 : 6), cy, R * 1.02, ry * 1.05, 16, 0.22, seed + i + 50), { closed: true, w: 1.2, alpha: 0.65, seed: seed + i });
    });
  },
  tree_poplar(x, P, seed, season) {
    this.shadow(x, 22, 8, 5);
    this._trunk(x, 5, 40, P.barkGrey, seed);
    if (season === 3) {
      x.strokeStyle = U.mix(P.barkGrey, P.ink, 0.3); x.lineWidth = 1.2;
      for (let i = 0; i < 16; i++) { const sx = (U.hash(i, 1, seed) - 0.5) * 8; x.beginPath(); x.moveTo(sx, -36); x.quadraticCurveTo(sx * 2, -120, sx * 3 + (U.hash(i, 2, seed) - 0.5) * 20, -170 - U.hash(i, 3, seed) * 60); x.stroke(); }
      return;
    }
    const cy = -140, rx = 20, ry = 96;
    U.wash(x, U.blob(0, cy, rx, ry, 20, 0.08, seed), U.shade(P.poplar, -0.15), { seed, edge: 0.35, amp: 1.5 });
    for (let i = 0; i < 120; i++) {
      const fy = U.hash(i, 1, seed) * 2 - 1, wmax = rx * Math.sqrt(Math.max(0, 1 - fy * fy));
      const px = (U.hash(i, 2, seed) * 2 - 1) * wmax * 0.9, py = cy + fy * ry * 0.95;
      x.strokeStyle = U.hash(i, 3, seed) < 0.3 ? P.poplarHi : U.hash(i, 3, seed) < 0.7 ? P.poplar : U.shade(P.poplar, -0.25);
      x.lineWidth = 2.4; x.beginPath(); x.moveTo(px, py + 4); x.lineTo(px + (px < 0 ? -1 : 1) * 1.5, py - 5); x.stroke();
    }
    U.ink(x, U.blob(0, cy, rx + 1, ry + 1, 22, 0.07, seed + 3), { closed: true, w: 1.3, alpha: 0.7, seed });
  },
  tree_willow(x, P, seed, season) {
    this.shadow(x, 56, 15);
    this._trunk(x, 10, 50, P.barkGrey, seed, 8);
    if (season === 3) {
      x.strokeStyle = '#B99F64'; x.lineWidth = 0.9;
      for (let i = 0; i < 40; i++) { const a = Math.PI + (i / 40) * Math.PI, sx = 8 + Math.cos(a) * 50, sy = -78 + Math.sin(a) * 34; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + 4, sy + 30, sx + 2, sy + 60); x.stroke(); }
      x.strokeStyle = U.mix(P.barkGrey, P.ink, 0.3); this._branches(x, 8, -50, 26, -Math.PI / 2, 3, 4, seed, true);
      return;
    }
    U.wash(x, U.blob(8, -84, 60, 40, 18, 0.12, seed), U.shade(P.willow, -0.2), { seed, edge: 0.3 });
    x.lineWidth = 1.5;
    for (let i = 0; i < 70; i++) {
      const a = Math.PI * 1.05 + (i / 70) * Math.PI * 0.9 + (U.hash(i, 1, seed) - 0.5) * 0.1;
      const sx = 8 + Math.cos(a) * 56 * (0.6 + U.hash(i, 2, seed) * 0.4), sy = -84 + Math.sin(a) * 36 * 0.8 + 18;
      x.strokeStyle = U.hash(i, 3, seed) < 0.4 ? P.willowHi : P.willow;
      const len = 36 + U.hash(i, 4, seed) * 44;
      x.beginPath(); x.moveTo(sx, sy - 20); x.quadraticCurveTo(sx + (sx - 8) * 0.1, sy + len * 0.4, sx + (sx - 8) * 0.06, sy + len * 0.9); x.stroke();
    }
    U.ink(x, U.blob(8, -86, 60, 38, 18, 0.12, seed + 7).filter((p, i) => i > 8 || i < 1), { w: 1.2, alpha: 0.6, seed });
  },

  // ---------------- buildings ----------------
  drawBuilding(ctx, b, t) {
    const season = G.S.season, fade = b.fade || 0, see = 1 - 0.55 * (b.ghost || 0);
    const body = this.spr(`b_${b.id}_${season}_${I18N.lang}`, b.w + 60, b.d + b.h + 110, 30, b.h + 90, x => this.buildingBody(x, b, season));
    const front = this.spr(`bf_${b.id}_${season}_${I18N.lang}`, b.w + 20, b.h + 20, 10, b.h + 4, x => this.buildingFront(x, b, season));
    ctx.save();
    ctx.globalAlpha = (1 - 0.93 * fade) * see;
    this.blit(ctx, body, b.x, b.y);
    ctx.globalAlpha = (1 - 0.7 * fade) * see;
    this.blit(ctx, front, b.x, b.y + b.d);
    ctx.restore();
    if (b.id === 'hub' && fade > 0.4) this._chalk(ctx, b);
  },
  _stones(x, x0, y0, w, h, base, seed) {
    x.fillStyle = base; x.fillRect(x0, y0, w, h);
    const rows = Math.max(2, Math.round(h / 12));
    for (let r = 0; r < rows; r++) {
      let cx = x0 - (r % 2) * 9;
      const rh = h / rows;
      while (cx < x0 + w) {
        const sw = 14 + U.hash(r, Math.floor(cx), seed) * 14;
        const col = U.mix(base, U.hash(r, Math.floor(cx), seed + 1) < 0.5 ? '#FFFFFF' : '#8C7E68', U.hash(r, Math.floor(cx), seed + 2) * 0.2);
        x.fillStyle = col;
        U.rr(x, Math.max(x0, cx + 1), y0 + r * rh + 1, Math.min(sw - 2, x0 + w - cx - 1), rh - 2, 3); x.fill();
        x.strokeStyle = 'rgba(60,50,40,0.35)'; x.lineWidth = 0.8; x.stroke();
        cx += sw;
      }
    }
  },
  _tiles(x, x0, y0, w, h, col, seed, snow) {
    x.fillStyle = col; x.fillRect(x0, y0, w, h);
    x.strokeStyle = U.rgba(U.shade(col, -0.35), 0.7); x.lineWidth = 1.2;
    for (let yy = y0 + 9; yy < y0 + h; yy += 9) {
      x.beginPath();
      for (let xx = x0; xx < x0 + w; xx += 10) x.arc(xx + 5, yy - 2, 5, 0.1, Math.PI - 0.1);
      x.stroke();
    }
    for (let i = 0; i < 14; i++) { x.fillStyle = U.rgba(U.hash(i, 1, seed) < 0.5 ? U.shade(col, 0.2) : U.shade(col, -0.2), 0.35); x.fillRect(x0 + U.hash(i, 2, seed) * w, y0 + U.hash(i, 3, seed) * h, 16, 7); }
    if (snow) { U.wash(x, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h * 0.8], [x0 + w * 0.6, y0 + h * 0.9], [x0 + w * 0.2, y0 + h * 0.75], [x0, y0 + h * 0.85]], '#F4F5F0', { edge: 0.12, alpha: 0.92, seed }); }
  },
  _window(x, cx, cy, w, h, frame, flowers) {
    x.fillStyle = frame; x.fillRect(cx - w / 2 - 3, cy - h / 2 - 3, w + 6, h + 6);
    const g = x.createLinearGradient(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);
    g.addColorStop(0, '#CFE0E2'); g.addColorStop(1, '#7E9CA6');
    x.fillStyle = g; x.fillRect(cx - w / 2, cy - h / 2, w, h);
    x.strokeStyle = frame; x.lineWidth = 2.5; x.beginPath(); x.moveTo(cx, cy - h / 2); x.lineTo(cx, cy + h / 2); x.moveTo(cx - w / 2, cy); x.lineTo(cx + w / 2, cy); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,0.6)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx - w / 2 + 3, cy - 2); x.lineTo(cx - 2, cy - h / 2 + 3); x.stroke();
    x.strokeStyle = '#2A2620'; x.lineWidth = 1.2; x.strokeRect(cx - w / 2 - 3, cy - h / 2 - 3, w + 6, h + 6);
    if (flowers) {
      x.fillStyle = '#9A8B7A'; x.fillRect(cx - w / 2 - 2, cy + h / 2 + 2, w + 4, 6);
      for (let i = 0; i < 3; i++) {
        const px = cx - w / 2 + 5 + i * (w - 6) / 2;
        x.fillStyle = '#A7A9A4'; x.fillRect(px - 3, cy + h / 2 - 3, 7, 7);
        x.fillStyle = '#4F7A3A'; x.beginPath(); x.arc(px, cy + h / 2 - 6, 5, 0, TAU); x.fill();
        x.fillStyle = '#D2413A'; x.beginPath(); x.arc(px - 1, cy + h / 2 - 8, 2.4, 0, TAU); x.arc(px + 2.5, cy + h / 2 - 6, 2.2, 0, TAU); x.fill();
      }
    }
  },
  _sign(x, cx, cy, txt, bg = '#E9DFC6', fg = '#2A2620', size = 9) {
    x.font = `700 ${size}px "Courier Prime", monospace`;
    const w = x.measureText(txt).width + 12;
    x.fillStyle = bg; x.fillRect(cx - w / 2, cy - size, w, size * 1.7);
    x.strokeStyle = '#2A2620'; x.lineWidth = 1; x.strokeRect(cx - w / 2, cy - size, w, size * 1.7);
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, cx, cy - size + size * 0.85);
  },
  buildingBody(x, b, season) {
    const P = this.pal(), snow = season === 3, w = b.w, d = b.d, h = b.h;
    const sh = 'rgba(40,40,30,0.22)';
    x.fillStyle = sh; x.fillRect(8, 6, w, d + 6);
    const ry0 = -h - 10, ry1 = d - h + 8;
    if (b.kind === 'glass') {
      x.fillStyle = 'rgba(205,230,228,0.38)'; x.fillRect(-8, ry0, w + 16, ry1 - ry0);
      x.strokeStyle = 'rgba(245,250,248,0.9)'; x.lineWidth = 2.2;
      for (let xx = -8; xx <= w + 8; xx += 30) { x.beginPath(); x.moveTo(xx, ry0); x.lineTo(xx, ry1); x.stroke(); }
      x.beginPath(); x.moveTo(-8, (ry0 + ry1) / 2); x.lineTo(w + 8, (ry0 + ry1) / 2); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,0.5)'; x.lineWidth = 6;
      for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(20 + k * 90, ry0 + 6); x.lineTo(60 + k * 90, ry1 - 6); x.stroke(); }
      if (snow) { x.fillStyle = 'rgba(245,247,242,0.8)'; x.fillRect(-8, ry0, w + 16, 14); }
      x.strokeStyle = P.ink; x.lineWidth = 1.5; x.strokeRect(-8, ry0, w + 16, ry1 - ry0);
      return;
    }
    if (b.kind === 'yayla') {
      // a flat roof of packed earth and turf with grass growing on it, and a stone chimney
      U.wash(x, U.rectPts(-10, ry0, w + 20, ry1 - ry0), snow ? '#EEF0EC' : '#7E8A4E', { edge: 0.25, seed: 23, amp: 2 });
      if (!snow) for (let k = 0; k < 90; k++) { const px = -6 + U.hash(k, 1, 23) * (w + 12), py = ry0 + 4 + U.hash(k, 2, 23) * (ry1 - ry0 - 8); x.strokeStyle = U.hash(k, 3, 23) < 0.5 ? '#5E6E36' : '#9AAA5E'; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (U.hash(k, 4, 23) - 0.5) * 4, py - 4); x.stroke(); }
      x.fillStyle = '#6E5A3A'; x.fillRect(-10, ry1 - 6, w + 20, 6);
      U.ink(x, U.rectPts(-10, ry0, w + 20, ry1 - ry0), { closed: true, w: 1.5, smooth: false, amp: 0.8 });
      this._stones(x, w * 0.7 - 10, ry0 - 20, 20, 26, P.stone, 77); x.fillStyle = '#5A5048'; x.fillRect(w * 0.7 - 12, ry0 - 24, 24, 5);
      return;
    }
    const roofCol = b.kind === 'barn' ? '#7A6A5C' : b.kind === 'shed' ? '#6E655A' : b.kind === 'station' ? '#5F6B72' : b.kind === 'vault' ? '#5E6660' : P.roof;
    const mid = (ry0 + ry1) / 2;
    this._tiles(x, -12, ry0, w + 24, mid - ry0, U.shade(roofCol, -0.12), 3, snow);
    this._tiles(x, -12, mid, w + 24, ry1 - mid, roofCol, 5, snow);
    x.strokeStyle = U.shade(roofCol, -0.45); x.lineWidth = 3; x.beginPath(); x.moveTo(-12, mid); x.lineTo(w + 12, mid); x.stroke();
    U.ink(x, U.rectPts(-12, ry0, w + 24, ry1 - ry0), { closed: true, w: 1.6, smooth: false, amp: 0.8 });
    // chimneys
    const chim = (cx, cy) => {
      this._stones(x, cx - 11, cy - 34, 22, 34, P.stone, cx);
      x.fillStyle = '#5A5048'; x.fillRect(cx - 13, cy - 38, 26, 6);
      U.ink(x, U.rectPts(cx - 11, cy - 34, 22, 34), { closed: true, w: 1.2, smooth: false, amp: 0.5 });
      if (snow) { x.fillStyle = '#F6F7F2'; x.fillRect(cx - 13, cy - 42, 26, 5); }
    };
    if (b.kind === 'school') { chim(120, mid - 8); chim(380, mid - 8); }
    if (b.kind === 'house' || b.kind === 'kahve' || b.kind === 'clinic' || b.kind === 'bakery') chim(w * 0.72, mid - 4);
    if (b.kind === 'barn') {
      x.fillStyle = '#D9C27A'; x.fillRect(w / 2 - 24, mid - 10, 48, 14);
      x.strokeStyle = '#B89A4A'; for (let i = 0; i < 16; i++) { x.beginPath(); x.moveTo(w / 2 - 24 + i * 3, mid + 4); x.lineTo(w / 2 - 26 + i * 3 + U.hash(i, 1, 2) * 6, mid - 14); x.stroke(); }
    }
  },
  buildingFront(x, b, season) {
    const P = this.pal(), w = b.w, h = b.h;
    const y0 = -h;
    if (b.kind === 'glass') {
      x.fillStyle = 'rgba(205,232,230,0.42)'; x.fillRect(0, y0, w, h);
      x.strokeStyle = 'rgba(248,252,250,0.95)'; x.lineWidth = 2.4;
      for (let xx = 0; xx <= w; xx += 30) { x.beginPath(); x.moveTo(xx, y0); x.lineTo(xx, 0); x.stroke(); }
      x.beginPath(); x.moveTo(0, y0 + h * 0.45); x.lineTo(w, y0 + h * 0.45); x.stroke();
      x.fillStyle = '#6E7B72'; x.fillRect(0, -8, w, 8);
      x.fillStyle = 'rgba(245,250,248,0.2)'; x.fillRect(b.door - b.x - 32, y0 + 8, 64, h - 8);
      x.strokeStyle = P.ink; x.lineWidth = 1.5; x.strokeRect(0, y0, w, h); x.strokeRect(b.door - b.x - 32, y0 + 8, 64, h - 8);
      return;
    }
    if (b.kind === 'school') {
      this._stones(x, 0, y0, w, h, P.stone, 11);
      x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(0, y0, w, 8);
      [60, 140, 300, 380].forEach(cx => this._window(x, cx, y0 + h * 0.45, 34, 30, '#4F7A7A', true));
      const dx = b.door - b.x;
      x.fillStyle = '#6B4A32'; x.beginPath(); x.moveTo(dx - 26, 0); x.lineTo(dx - 26, y0 + 22); x.arc(dx, y0 + 22, 26, Math.PI, 0); x.lineTo(dx + 26, 0); x.closePath(); x.fill();
      x.strokeStyle = '#4A3222'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(dx, y0 + 0); x.lineTo(dx, 0); x.stroke();
      for (let k = 0; k < 5; k++) { x.beginPath(); x.moveTo(dx - 24, y0 + 30 + k * 9); x.lineTo(dx + 24, y0 + 30 + k * 9); x.stroke(); }
      x.strokeStyle = P.ink; x.lineWidth = 1.5; x.stroke();
      this._sign(x, dx, y0 - 2, 'PINARBAŞI KÖY OKULU · 1938', '#EDE3CC', '#2A2620', 9);
    } else if (b.kind === 'barn') {
      x.fillStyle = '#8B4A36'; x.fillRect(0, y0, w, h);
      for (let xx = 0; xx < w; xx += 12) { x.fillStyle = U.rgba(U.hash(xx, 1, 4) < 0.5 ? '#A45A42' : '#6E3A2A', 0.5); x.fillRect(xx, y0, 11, h); x.strokeStyle = 'rgba(40,20,10,0.5)'; x.lineWidth = 1; x.beginPath(); x.moveTo(xx, y0); x.lineTo(xx, 0); x.stroke(); }
      this._stones(x, 0, -14, w, 14, '#B9AE98', 7);
      const dx = w / 2;
      x.fillStyle = '#6E3A2A'; x.fillRect(dx - 44, y0 + 18, 88, h - 18);
      x.strokeStyle = '#EFE6D2'; x.lineWidth = 3; x.strokeRect(dx - 44, y0 + 18, 88, h - 18);
      x.beginPath(); x.moveTo(dx - 44, y0 + 18); x.lineTo(dx, 0); x.lineTo(dx + 44, y0 + 18); x.moveTo(dx - 44, 0); x.lineTo(dx, y0 + 18); x.lineTo(dx + 44, 0); x.moveTo(dx, y0 + 18); x.lineTo(dx, 0); x.stroke();
      this._window(x, 60, y0 + 34, 26, 22, '#EFE6D2', false); this._window(x, w - 60, y0 + 34, 26, 22, '#EFE6D2', false);
      x.strokeStyle = P.ink; x.lineWidth = 1.5; x.strokeRect(0, y0, w, h);
    } else if (b.kind === 'shed') {
      x.fillStyle = '#8F7050'; x.fillRect(0, y0, w, h);
      for (let xx = 0; xx < w; xx += 10) { x.strokeStyle = 'rgba(50,30,15,0.45)'; x.beginPath(); x.moveTo(xx, y0); x.lineTo(xx, 0); x.stroke(); }
      x.fillStyle = '#5E4330'; x.fillRect(w / 2 - 16, y0 + 12, 32, h - 12);
      x.strokeStyle = '#3A2A1E'; x.lineWidth = 2; x.beginPath(); x.moveTo(w - 16, 0); x.lineTo(w - 10, y0 + 6); x.moveTo(w - 8, 0); x.lineTo(w - 4, y0 + 10); x.stroke();
      x.strokeStyle = P.ink; x.lineWidth = 1.4; x.strokeRect(0, y0, w, h);
    } else if (b.kind === 'vault') {
      // thick stone walls, small barred windows, an iron door painted green
      this._stones(x, 0, y0, w, h, '#B4AA96', 31);
      x.fillStyle = '#7E7666'; x.fillRect(0, y0, w, 7); x.fillRect(0, -9, w, 9);
      for (const cx of [44, w - 44]) {
        this._window(x, cx, y0 + h * 0.42, 22, 16, '#3E5A3A', false);
        x.strokeStyle = '#2A2620'; x.lineWidth = 1.4; for (let k = -1; k <= 1; k++) { x.beginPath(); x.moveTo(cx + k * 6, y0 + h * 0.42 - 9); x.lineTo(cx + k * 6, y0 + h * 0.42 + 9); x.stroke(); }
      }
      const dx = b.door - b.x;
      x.fillStyle = '#8E8472'; x.beginPath(); x.moveTo(dx - 30, 0); x.lineTo(dx - 30, y0 + 24); x.arc(dx, y0 + 24, 30, Math.PI, 0); x.lineTo(dx + 30, 0); x.closePath(); x.fill();
      x.fillStyle = '#3E5A3A'; x.beginPath(); x.moveTo(dx - 24, 0); x.lineTo(dx - 24, y0 + 26); x.arc(dx, y0 + 26, 24, Math.PI, 0); x.lineTo(dx + 24, 0); x.closePath(); x.fill();
      x.strokeStyle = '#26382A'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(dx, y0 + 2); x.lineTo(dx, 0); x.stroke();
      x.fillStyle = '#B8B09A'; for (let k = 0; k < 4; k++) for (const s of [-1, 1]) { x.beginPath(); x.arc(dx + s * 18, y0 + 30 + k * 9, 1.2, 0, TAU); x.fill(); }
      x.fillStyle = '#C8A24E'; x.beginPath(); x.arc(dx + 6, y0 + 42, 2.2, 0, TAU); x.arc(dx - 6, y0 + 42, 2.2, 0, TAU); x.fill();
      // a carved sheaf over the door, and the year it was built
      x.strokeStyle = '#6E6452'; x.lineWidth = 1; for (let k = -3; k <= 3; k++) { x.beginPath(); x.moveTo(dx, y0 + 16); x.lineTo(dx + k * 3, y0 + 4); x.stroke(); }
      x.strokeStyle = P.ink; x.lineWidth = 1.4; x.beginPath(); x.moveTo(dx - 30, 0); x.lineTo(dx - 30, y0 + 24); x.arc(dx, y0 + 24, 30, Math.PI, 0); x.lineTo(dx + 30, 0); x.stroke();
      this._sign(x, dx, y0 - 3, L({ tr: 'TOHUM BANKASI', en: 'TOHUM BANKASI · SEED BANK' }), '#3E5A3A', '#F4EEDD', 9);
      x.fillStyle = '#5E5646'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText('1987', w - 44, y0 + h * 0.42 + 20);
      x.strokeStyle = P.ink; x.lineWidth = 1.4; x.strokeRect(0, y0, w, h);
    } else if (b.kind === 'yayla') {
      // dry-stone walls, one small window, a low door hung with a woven curtain
      this._stones(x, 0, y0, w, h, '#A89C86', 41);
      this._window(x, 30, y0 + h * 0.45, 18, 16, '#5E4A32', false);
      const dx = w / 2 + 16;
      x.fillStyle = '#3A2E22'; x.fillRect(dx - 15, y0 + 14, 30, h - 14);
      x.fillStyle = '#9A3A2E'; x.fillRect(dx - 13, y0 + 16, 26, h - 20);
      x.strokeStyle = '#E8C84E'; x.lineWidth = 1; for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(dx - 13, y0 + 24 + k * 10); x.lineTo(dx, y0 + 20 + k * 10); x.lineTo(dx + 13, y0 + 24 + k * 10); x.stroke(); }
      this._sign(x, w / 2, y0 - 3, L({ tr: 'YAYLA EVİ · 2200 m', en: 'YAYLA HUT · 2200 m' }), '#5E4A32', '#F4EEDD', 8);
      x.strokeStyle = P.ink; x.lineWidth = 1.4; x.strokeRect(0, y0, w, h);
    } else if (b.kind === 'station') {
      x.fillStyle = '#E6D6B4'; x.fillRect(0, y0, w, h);
      x.fillStyle = '#4E6E8A'; x.fillRect(0, -10, w, 10);
      this._window(x, 36, y0 + h * 0.45, 26, 24, '#4E6E8A', false);
      x.fillStyle = '#4E6E8A'; x.fillRect(w - 64, y0 + 16, 34, h - 16);
      x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(w / 2 + 6, y0 + 16, 9, 0, TAU); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 1; x.stroke();
      x.beginPath(); x.moveTo(w / 2 + 6, y0 + 16); x.lineTo(w / 2 + 6, y0 + 10); x.moveTo(w / 2 + 6, y0 + 16); x.lineTo(w / 2 + 10, y0 + 17); x.stroke();
      this._sign(x, w / 2, y0 - 4, 'PINARBAŞI', '#2F4E6E', '#F4EEDD', 10);
      x.strokeStyle = P.ink; x.lineWidth = 1.4; x.strokeRect(0, y0, w, h);
    } else {
      const tints = ['#E9E1CF', '#D9C6A0', '#E7D9C4', '#CFD6CF'];
      const wall = b.kind === 'clinic' ? '#F1EEE6' : b.kind === 'kahve' ? '#DCCBAA' : b.kind === 'bakery' ? '#F3ECDA' : tints[b.tint || 0];
      x.fillStyle = wall; x.fillRect(0, y0, w, h);
      for (let i = 0; i < 30; i++) { x.fillStyle = U.rgba(U.hash(i, 1, b.w) < 0.5 ? '#FFFFFF' : '#9A8A70', 0.12); U.ellipse(x, U.hash(i, 2, b.w) * w, y0 + U.hash(i, 3, b.w) * h, 10, 5); x.fill(); }
      this._stones(x, 0, -12, w, 12, '#B9AE98', b.w);
      const trim = b.kind === 'clinic' ? '#3E6C9A' : b.kind === 'kahve' ? '#6B4A32' : b.kind === 'bakery' ? '#8A4A2A' : ['#5E7A6A', '#6B4A32', '#4F6F8A', '#7A5A3A'][b.tint || 0];
      this._window(x, 34, y0 + h * 0.42, 24, 22, trim, b.kind !== 'clinic');
      this._window(x, w - 34, y0 + h * 0.42, 24, 22, trim, b.kind === 'house');
      x.fillStyle = trim; x.fillRect(w / 2 - 16, y0 + 18, 32, h - 18);
      x.strokeStyle = P.ink; x.lineWidth = 1.2; x.strokeRect(w / 2 - 16, y0 + 18, 32, h - 18);
      x.fillStyle = '#C9A24E'; x.beginPath(); x.arc(w / 2 + 9, y0 + 40, 2, 0, TAU); x.fill();
      if (b.kind === 'clinic') this._sign(x, w / 2, y0 + 6, 'SAĞLIK OCAĞI', '#F4F1EA', '#A0322A', 9);
      if (b.kind === 'kahve') {
        this._sign(x, w / 2, y0 + 6, 'KAHVEHANE', '#6B4A32', '#F4EEDD', 9);
        x.fillStyle = '#A0322A'; x.beginPath(); x.moveTo(-6, y0 + 18); x.lineTo(w + 6, y0 + 18); x.lineTo(w + 14, y0 + 34); x.lineTo(-14, y0 + 34); x.closePath(); x.fill();
        x.fillStyle = '#F4EEDD'; for (let k = 0; k < w + 20; k += 24) { x.beginPath(); x.moveTo(k - 6, y0 + 18); x.lineTo(k + 6, y0 + 18); x.lineTo(k + 10, y0 + 34); x.lineTo(k - 2, y0 + 34); x.closePath(); x.fill(); }
      }
      if (b.kind === 'bakery') {
        this._sign(x, w / 2, y0 + 6, L({ tr: 'FIRIN', en: 'FIRIN · BAKERY' }), '#8A4A2A', '#F4EEDD', 10);
        // the shop window, warm inside, with loaves on a shelf and simit on the sill
        const wx = 12, wy = y0 + h * 0.3, ww = 48, wh = 26;
        x.fillStyle = '#8A4A2A'; x.fillRect(wx - 3, wy - 3, ww + 6, wh + 6);
        x.fillStyle = MX.lin(x, 0, wy, 0, wy + wh, [[0, '#FBE8BC'], [1, '#E8C88A']]); x.fillRect(wx, wy, ww, wh);
        x.fillStyle = '#6B4A32'; x.fillRect(wx, wy + 13, ww, 2);
        for (let k = 0; k < 4; k++) { x.fillStyle = k % 2 ? '#B06A32' : '#C4843E'; U.ellipse(x, wx + 7 + k * 11.5, wy + 9.5, 5.2, 3.6); x.fill(); x.strokeStyle = 'rgba(250,230,190,0.8)'; x.lineWidth = 0.7; x.beginPath(); x.moveTo(wx + 4 + k * 11.5, wy + 9); x.lineTo(wx + 9 + k * 11.5, wy + 8); x.stroke(); }
        x.strokeStyle = '#A8642E'; x.lineWidth = 2; for (const k of [0, 1, 2]) { x.beginPath(); x.arc(wx + 10 + k * 14, wy + 20, 4, 0, TAU); x.stroke(); }
        x.fillStyle = 'rgba(255,255,255,0.35)'; x.beginPath(); x.moveTo(wx + 2, wy + wh - 2); x.lineTo(wx + 14, wy + 2); x.lineTo(wx + 20, wy + 2); x.lineTo(wx + 8, wy + wh - 2); x.fill();
        x.strokeStyle = P.ink; x.lineWidth = 1.2; x.strokeRect(wx - 3, wy - 3, ww + 6, wh + 6);
        // a wheat sheaf hung by the door
        x.strokeStyle = '#C8A24E'; x.lineWidth = 1; for (let k = -3; k <= 3; k++) { x.beginPath(); x.moveTo(w / 2 + 26, y0 + 40); x.lineTo(w / 2 + 26 + k * 2.4, y0 + 22); x.stroke(); x.fillStyle = '#D8B45A'; U.ellipse(x, w / 2 + 26 + k * 2.4, y0 + 20, 1.4, 3); x.fill(); }
        x.fillStyle = '#A0322A'; x.fillRect(w / 2 + 23, y0 + 34, 6, 3);
      }
      if (b.kind === 'house' && (b.tint || 0) % 2 === 1) {
        x.fillStyle = '#7A5A3A'; x.fillRect(w * 0.2, y0 - 8, w * 0.6, 12);
        x.strokeStyle = '#4A3222'; x.lineWidth = 1.5; for (let k = w * 0.2; k <= w * 0.8; k += 8) { x.beginPath(); x.moveTo(k, y0 - 8); x.lineTo(k, y0 + 4); x.stroke(); }
      }
      x.strokeStyle = P.ink; x.lineWidth = 1.4; x.strokeRect(0, y0, w, h);
    }
    if (season === 3) { x.fillStyle = 'rgba(246,247,242,0.9)'; U.rr(x, -4, y0 - 4, w + 8, 7, 3); x.fill(); }
  },
  _chalk(ctx, b) {
    const txt = Q.objectiveText() || T('no_objective');
    ctx.save();
    ctx.globalAlpha = U.clamp((b.fade - 0.4) * 2, 0, 1);
    ctx.fillStyle = 'rgba(240,240,230,0.85)';
    ctx.font = '600 11px "Caveat", cursive';
    ctx.textAlign = 'center';
    const lines = U.wrapText(ctx, txt, 140).slice(0, 2);
    lines.forEach((l, i) => ctx.fillText(l, 2400, 1318 + i * 11));
    ctx.restore();
  },

  // ---------------- interiors ----------------
  drawInteriors(ctx, v) {
    for (const b of WORLD.buildings) {
      if (!b.enter) continue;
      if (b.x > v.x1 || b.x + b.w < v.x0 || b.y > v.y1 || b.y + b.d < v.y0) continue;
      const s = this.spr(`in_${b.id}`, b.w, b.d, 0, 0, x => (b.id === 'hub' ? this.hubInterior(x, b) : b.id === 'seedbank' ? this.sbInterior(x, b) : b.id === 'clinic' ? this.clinicInterior(x, b) : this.ghInterior(x, b)));
      this.blit(ctx, s, b.x, b.y);
      if (b.id === 'greenhouse') this._trays(ctx, b);
      if (b.id === 'hub' && G.S && !G.S.flags.letterRead) {
        ctx.fillStyle = '#F4EEDD'; ctx.save(); ctx.translate(2300, 1360); ctx.rotate(-0.15); ctx.fillRect(-9, -6, 18, 12); ctx.strokeStyle = '#A0322A'; ctx.lineWidth = 1; ctx.strokeRect(-9, -6, 18, 12); ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(0, 1); ctx.lineTo(9, -6); ctx.stroke(); ctx.restore();
      }
    }
  },
  hubInterior(x, b) {
    const w = b.w, d = b.d;
    // floor boards
    x.fillStyle = '#A77B52'; x.fillRect(0, 0, w, d);
    for (let yy = 40; yy < d; yy += 14) {
      x.fillStyle = U.rgba(U.hash(yy, 1, 2) < 0.5 ? '#B98C60' : '#8E6642', 0.6); x.fillRect(0, yy, w, 13);
      x.strokeStyle = 'rgba(60,40,20,0.45)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, yy); x.lineTo(w, yy); x.stroke();
      for (let xx = (yy * 7) % 90; xx < w; xx += 90) { x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx, yy + 14); x.stroke(); }
    }
    // back wall face
    x.fillStyle = '#E8DDC8'; x.fillRect(0, 0, w, 44);
    x.fillStyle = '#8E6642'; x.fillRect(0, 28, w, 16);
    x.strokeStyle = 'rgba(40,30,20,0.5)'; x.lineWidth = 1; x.strokeRect(0, 28, w, 16);
    // window light patches
    x.fillStyle = 'rgba(255,240,200,0.18)';
    [60, 140, 300, 380].forEach(cx => { x.beginPath(); x.moveTo(cx - 20, d - 70); x.lineTo(cx + 20, d - 70); x.lineTo(cx + 34, d - 130); x.lineTo(cx - 6, d - 130); x.closePath(); x.fill(); });
    // bookshelf
    x.fillStyle = '#6B4A32'; x.fillRect(6, 4, 124, 36);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 16; k++) { x.fillStyle = ['#8E3B2E', '#34466B', '#C89B45', '#4F6B3A', '#EDE3CC', '#6B3E5E'][(k * 7 + r * 3) % 6]; x.fillRect(10 + k * 7.4, 6 + r * 11, 5.5, 9); }
    // blackboard
    x.fillStyle = '#6B4A32'; x.fillRect(w / 2 - 82, 2, 164, 36);
    x.fillStyle = '#2F4A3A'; x.fillRect(w / 2 - 78, 5, 156, 30);
    // herbarium frames
    [[160, 10], [300, 10], [330, 10]].forEach(([fx, fy], i) => {
      x.fillStyle = '#EFE7D4'; x.fillRect(fx, fy, 18, 22); x.strokeStyle = '#5E4330'; x.lineWidth = 2; x.strokeRect(fx, fy, 18, 22);
      x.strokeStyle = '#5F7F3A'; x.lineWidth = 1; x.beginPath(); x.moveTo(fx + 9, fy + 19); x.quadraticCurveTo(fx + 6 + i, fy + 11, fx + 9, fy + 4); x.stroke();
      x.fillStyle = '#6F8F3C'; U.ellipse(x, fx + 6, fy + 10, 3, 1.6, -0.5); x.fill(); U.ellipse(x, fx + 12, fy + 13, 3, 1.6, 0.5); x.fill();
    });
    // kilim rug
    this._kilim(x, w / 2 - 80, 120, 160, 96);
    // desk & chair
    x.fillStyle = 'rgba(0,0,0,0.18)'; x.fillRect(40, 58, 120, 50);
    x.fillStyle = '#5E4330'; x.fillRect(35, 50, 120, 44); x.fillStyle = '#4A3222'; x.fillRect(35, 88, 120, 10);
    x.strokeStyle = '#2A2620'; x.lineWidth = 1.2; x.strokeRect(35, 50, 120, 48);
    x.fillStyle = '#F2ECDD'; x.save(); x.translate(80, 70); x.rotate(-0.08); x.fillRect(-18, -11, 36, 22); x.strokeStyle = '#8A7A60'; x.strokeRect(-18, -11, 36, 22); x.beginPath(); x.moveTo(0, -11); x.lineTo(0, 11); x.stroke();
    x.strokeStyle = 'rgba(40,60,100,0.5)'; for (let k = -7; k < 8; k += 3) { x.beginPath(); x.moveTo(-15, k); x.lineTo(-3, k); x.moveTo(3, k); x.lineTo(15, k); x.stroke(); } x.restore();
    x.fillStyle = '#C8A24E'; x.beginPath(); x.arc(135, 60, 7, 0, TAU); x.fill(); x.strokeStyle = '#2A2620'; x.stroke();
    x.fillStyle = 'rgba(255,230,160,0.25)'; x.beginPath(); x.arc(135, 66, 26, 0, TAU); x.fill();
    x.fillStyle = '#E9E2D2'; x.beginPath(); x.ellipse(110, 82, 6, 3.5, 0, 0, TAU); x.fill(); x.fillStyle = 'rgba(160,50,30,0.8)'; x.beginPath(); x.ellipse(110, 80, 3, 2, 0, 0, TAU); x.fill();
    x.fillStyle = '#6B4A32'; x.fillRect(80, 104, 26, 20); x.strokeStyle = '#2A2620'; x.strokeRect(80, 104, 26, 20);
    // microscope bench
    x.fillStyle = '#6B5A48'; x.fillRect(4, 130, 56, 80); x.strokeStyle = '#2A2620'; x.strokeRect(4, 130, 56, 80);
    x.fillStyle = '#2C2E30'; x.fillRect(22, 150, 16, 26); x.beginPath(); x.arc(30, 150, 7, 0, TAU); x.fill();
    x.fillStyle = '#C8C4B8'; x.fillRect(14, 184, 30, 6); x.fillStyle = '#9FC0C8'; x.fillRect(12, 196, 36, 8);
    // stove with teapot
    x.fillStyle = '#2E2C2A'; x.beginPath(); x.arc(182, 162, 20, 0, TAU); x.fill(); x.strokeStyle = '#1A1918'; x.lineWidth = 3; x.beginPath(); x.moveTo(182, 142); x.lineTo(182, 44); x.stroke();
    x.fillStyle = '#C0C4C4'; x.beginPath(); x.arc(182, 158, 9, 0, TAU); x.fill(); x.fillStyle = '#D8DCDC'; x.beginPath(); x.arc(182, 152, 6, 0, TAU); x.fill();
    x.strokeStyle = '#2A2620'; x.lineWidth = 1; x.stroke();
    // seed chest
    x.fillStyle = 'rgba(0,0,0,0.2)'; x.fillRect(262, 166, 66, 34);
    x.fillStyle = '#7A5230'; x.fillRect(258, 158, 66, 34); x.fillStyle = '#8E6642'; x.fillRect(258, 158, 66, 12);
    x.fillStyle = '#3A3430'; [264, 288, 312].forEach(sx => x.fillRect(sx, 158, 4, 34));
    x.fillStyle = '#C8A24E'; x.fillRect(288, 172, 6, 7); x.strokeStyle = '#2A2620'; x.lineWidth = 1.2; x.strokeRect(258, 158, 66, 34);
    // bed
    x.fillStyle = '#5E4330'; x.fillRect(350, 10, 82, 116);
    x.fillStyle = '#F2ECDD'; x.fillRect(356, 16, 70, 22);
    const quilt = ['#9E3B2E', '#C89B45', '#34466B', '#EDE3CC', '#4F6B3A'];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { x.fillStyle = quilt[(r + c * 2) % 5]; x.fillRect(356 + c * 17.5, 40 + r * 16.5, 17.5, 16.5); }
    x.strokeStyle = '#2A2620'; x.lineWidth = 1.2; x.strokeRect(350, 10, 82, 116);
    // radio
    x.fillStyle = '#6B4A32'; x.fillRect(396, 166, 40, 28); x.fillStyle = '#8A6A48'; x.fillRect(398, 160, 36, 20);
    x.fillStyle = '#EAD9A8'; x.fillRect(402, 164, 20, 10); x.fillStyle = '#2A2620'; x.beginPath(); x.arc(428, 170, 3, 0, TAU); x.fill(); x.strokeRect(398, 160, 36, 20);
    // pots
    [[18, 240], [420, 236]].forEach(([px, py]) => { x.fillStyle = '#B5653E'; x.fillRect(px - 7, py - 4, 14, 12); x.fillStyle = '#4F7A3A'; x.beginPath(); x.arc(px, py - 8, 9, 0, TAU); x.fill(); x.fillStyle = '#D2413A'; x.beginPath(); x.arc(px - 3, py - 11, 2.6, 0, TAU); x.arc(px + 3, py - 7, 2.4, 0, TAU); x.fill(); });
    x.strokeStyle = '#2A2620'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, d - 2);
  },
  // the seed bank: stone floor, shelves of jars along the back wall, a cold cabinet and Grandma's desk
  // the village clinic inside: tiled floor and walls, an eye chart, the medicine cabinet, a couch, the nurse's desk
  clinicInterior(x, b) {
    const w = b.w, d = b.d;
    for (let yy = 44; yy < d; yy += 16) for (let xx = 0; xx < w; xx += 16) { x.fillStyle = ((xx + yy) / 16) % 2 ? '#D6DDD4' : '#C6CFC4'; x.fillRect(xx, yy, 16, 16); }
    x.fillStyle = '#F4F4F0'; x.fillRect(0, 0, w, 44);
    x.strokeStyle = 'rgba(150,160,160,0.45)'; x.lineWidth = 0.6;
    for (let xx = 0; xx < w; xx += 10) { x.beginPath(); x.moveTo(xx, 0); x.lineTo(xx, 30); x.stroke(); }
    for (let yy = 0; yy < 30; yy += 10) { x.beginPath(); x.moveTo(0, yy); x.lineTo(w, yy); x.stroke(); }
    x.fillStyle = '#3E6C9A'; x.fillRect(0, 30, w, 4); x.fillStyle = '#E4E6E0'; x.fillRect(0, 34, w, 10);
    // eye chart
    x.fillStyle = '#FFFFFF'; x.fillRect(12, 3, 22, 26); x.strokeStyle = '#8A8A84'; x.lineWidth = 0.8; x.strokeRect(12, 3, 22, 26);
    x.fillStyle = '#1B1A17'; x.textAlign = 'center'; for (const [s, t, y] of [[9, 'E', 11], [6, 'F P', 17], [4.5, 'T O Z', 22], [3.5, 'L P E D', 26.5]]) { x.font = `700 ${s}px "Courier Prime", monospace`; x.fillText(t, 23, y); }
    // medicine cabinet
    x.fillStyle = '#F8F8F4'; x.fillRect(44, 4, 40, 28); x.strokeStyle = '#6A7A8A'; x.strokeRect(44, 4, 40, 28); x.beginPath(); x.moveTo(64, 4); x.lineTo(64, 32); x.stroke();
    for (let k = 0; k < 8; k++) { x.fillStyle = ['#C8A040', '#8A5A3A', '#FFFFFF', '#6A8AB8'][k % 4]; x.fillRect(47 + (k % 4) * 4 + (k > 3 ? 20 : 0), 8 + (k % 2) * 11, 3, 7); }
    x.fillStyle = '#C83A32'; x.fillRect(44, 4, 40, 2);
    // circulation poster: a red loop and a blue loop through a heart
    x.fillStyle = '#FBF6EA'; x.fillRect(98, 3, 34, 26); x.strokeStyle = '#8A8A84'; x.lineWidth = 0.8; x.strokeRect(98, 3, 34, 26);
    x.lineWidth = 1.4; x.strokeStyle = '#C83A32'; x.beginPath(); x.ellipse(115, 11, 11, 5, 0, Math.PI, TAU); x.stroke(); x.beginPath(); x.ellipse(115, 21, 12, 6, 0, 0, Math.PI); x.stroke();
    x.strokeStyle = '#3A5AA8'; x.beginPath(); x.ellipse(115, 11, 11, 5, 0, 0, Math.PI); x.stroke(); x.beginPath(); x.ellipse(115, 21, 12, 6, 0, Math.PI, TAU); x.stroke();
    x.fillStyle = '#C83A32'; x.beginPath(); x.arc(115, 16, 3, 0, TAU); x.fill();
    // the shelf the heart model stands on
    x.fillStyle = '#8A6A48'; x.fillRect(150, 26, 60, 4); x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(150, 30, 60, 3);
    // window light on the floor
    x.fillStyle = 'rgba(255,245,210,0.2)';
    for (const cx of [40, 200]) { x.beginPath(); x.moveTo(cx - 14, d - 10); x.lineTo(cx + 14, d - 10); x.lineTo(cx + 26, d - 60); x.lineTo(cx - 2, d - 60); x.closePath(); x.fill(); }
    // examination couch with a paper roll
    x.fillStyle = 'rgba(0,0,0,0.15)'; x.fillRect(20, 64, 80, 30);
    x.fillStyle = '#8A9098'; x.fillRect(20, 80, 4, 12); x.fillRect(92, 80, 4, 12);
    x.fillStyle = '#4E7294'; U.rr(x, 16, 58, 84, 26, 4); x.fill(); x.strokeStyle = '#2A3A4E'; x.lineWidth = 1; x.stroke();
    x.fillStyle = '#F6F4EE'; x.fillRect(30, 60, 60, 22); x.fillStyle = '#E8E4DA'; x.fillRect(16, 58, 16, 26);
    // the nurse's desk: the old cuff, the dial gauge, a stethoscope, a notebook; a chair for the patient
    x.fillStyle = 'rgba(0,0,0,0.15)'; x.fillRect(154, 72, 76, 30);
    x.fillStyle = '#B89A70'; x.fillRect(150, 66, 76, 30); x.strokeStyle = '#6A5236'; x.lineWidth = 1; x.strokeRect(150, 66, 76, 30);
    x.fillStyle = '#34486A'; U.rr(x, 158, 72, 24, 10, 3); x.fill();
    x.fillStyle = '#2A2E30'; x.beginPath(); x.arc(196, 78, 8, 0, TAU); x.fill(); x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(196, 78, 6.4, 0, TAU); x.fill();
    x.strokeStyle = '#B8201A'; x.lineWidth = 1; x.beginPath(); x.moveTo(196, 78); x.lineTo(192, 74); x.stroke();
    x.strokeStyle = '#2A2E30'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(182, 77); x.quadraticCurveTo(186, 90, 196, 86); x.stroke();
    x.strokeStyle = '#3A3E42'; x.beginPath(); x.moveTo(208, 72); x.quadraticCurveTo(222, 80, 212, 90); x.stroke(); x.fillStyle = '#C8CCD0'; x.beginPath(); x.arc(212, 90, 3, 0, TAU); x.fill();
    x.fillStyle = '#F2ECDD'; x.fillRect(160, 84, 16, 10);
    x.fillStyle = '#6A5236'; x.fillRect(176, 102, 18, 14); x.strokeStyle = '#3A2A1E'; x.strokeRect(176, 102, 18, 14);
    // bathroom scales by the door
    x.fillStyle = '#E8E8E4'; U.rr(x, 16, 110, 22, 16, 3); x.fill(); x.strokeStyle = '#8A8A84'; x.stroke(); x.fillStyle = '#2A2E30'; x.fillRect(22, 114, 10, 4);
  },
  sbInterior(x, b) {
    const w = b.w, d = b.d;
    x.fillStyle = '#8E8676'; x.fillRect(0, 0, w, d);
    for (let yy = 44, r = 0; yy < d; yy += 22, r++) for (let xx = -(r % 2) * 17; xx < w; xx += 34) {
      x.fillStyle = U.mix('#A49C8A', U.hash(xx, yy, 7) < 0.5 ? '#B8B0A0' : '#8A8272', U.hash(yy, xx, 8));
      U.rr(x, xx + 1.5, yy + 1.5, 31, 19, 3); x.fill();
    }
    // light from the small windows
    x.fillStyle = 'rgba(255,244,210,0.14)'; for (const cx of [44, w - 44]) { x.beginPath(); x.moveTo(cx - 12, d - 12); x.lineTo(cx + 12, d - 12); x.lineTo(cx + 26, d - 70); x.lineTo(cx + 2, d - 70); x.closePath(); x.fill(); }
    // back wall: three shelves of jars
    this._stones(x, 0, 0, w, 44, '#B4AA96', 21);
    x.fillStyle = 'rgba(40,30,20,0.25)'; x.fillRect(6, 2, w - 12, 40);
    const seed = ['#D9B45A', '#D8C79A', '#C8643A', '#9AAE5A', '#8A4A3A', '#E8C040', '#3A3430', '#B98A4A', '#6E7A3A', '#E6DCC0'];
    for (let r = 0; r < 3; r++) {
      const sy = 4 + r * 13;
      for (let k = 0, jx = 9; jx < w - 16; k++, jx += 10 + U.hash(k, r, 3) * 2) {
        const c = seed[Math.floor(U.hash(k, r, 5) * seed.length)], lvl = 0.45 + U.hash(k, r, 6) * 0.45;
        x.fillStyle = 'rgba(214,230,232,0.55)'; U.rr(x, jx, sy, 8, 10, 2); x.fill();
        x.fillStyle = c; x.fillRect(jx + 0.8, sy + 10 - 9 * lvl, 6.4, 9 * lvl - 0.8);
        x.fillStyle = U.hash(k, r, 9) < 0.3 ? '#A0322A' : '#8A8A86'; x.fillRect(jx - 0.4, sy - 1.2, 8.8, 2.4);
        x.fillStyle = '#F4EEDD'; x.fillRect(jx + 1.5, sy + 4, 5, 3);
        x.strokeStyle = 'rgba(40,40,40,0.55)'; x.lineWidth = 0.5; U.rr(x, jx, sy, 8, 10, 2); x.stroke();
      }
      x.fillStyle = '#6B4A32'; x.fillRect(6, sy + 10, w - 12, 2.6);
    }
    // cold cabinet: white enamel, frosty seal, a dial reading -18
    x.fillStyle = 'rgba(0,0,0,0.22)'; x.fillRect(16, 64, 50, 48);
    x.fillStyle = '#EDEDE6'; x.fillRect(12, 58, 50, 38); x.fillStyle = '#CFCFC6'; x.fillRect(12, 96, 50, 12);
    x.strokeStyle = 'rgba(200,226,240,0.9)'; x.lineWidth = 2; x.strokeRect(14, 60, 46, 34);
    x.fillStyle = '#8A8A86'; x.fillRect(30, 97, 14, 3);
    x.fillStyle = '#F4F1EA'; x.beginPath(); x.arc(52, 102, 4, 0, TAU); x.fill(); x.strokeStyle = '#2A2620'; x.lineWidth = 0.8; x.stroke();
    x.strokeStyle = '#3E6C9A'; x.beginPath(); x.moveTo(52, 102); x.lineTo(49.5, 100); x.stroke();
    x.strokeStyle = '#2A2620'; x.lineWidth = 1.2; x.strokeRect(12, 58, 50, 50);
    x.fillStyle = '#F4EEDD'; x.fillRect(20, 68, 22, 10); x.fillStyle = '#2A2620'; x.font = '700 6px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText('-18 °C', 31, 75);
    // Grandma's desk: the ledger open, an inkpot, a lamp
    x.fillStyle = 'rgba(0,0,0,0.2)'; x.fillRect(20, 116, 62, 26);
    x.fillStyle = '#5E4330'; x.fillRect(16, 112, 62, 22); x.fillStyle = '#4A3222'; x.fillRect(16, 134, 62, 5);
    x.strokeStyle = '#2A2620'; x.lineWidth = 1.1; x.strokeRect(16, 112, 62, 27);
    x.fillStyle = '#F2ECDD'; x.save(); x.translate(40, 123); x.rotate(0.06); x.fillRect(-14, -8, 28, 16); x.strokeStyle = '#8A7A60'; x.lineWidth = 0.8; x.strokeRect(-14, -8, 28, 16); x.beginPath(); x.moveTo(0, -8); x.lineTo(0, 8); x.stroke();
    x.strokeStyle = 'rgba(40,60,100,0.5)'; for (let k = -5; k < 6; k += 2.5) { x.beginPath(); x.moveTo(-12, k); x.lineTo(-2, k); x.moveTo(2, k); x.lineTo(12, k); x.stroke(); } x.restore();
    x.fillStyle = '#1B1A17'; x.beginPath(); x.arc(64, 118, 2.6, 0, TAU); x.fill();
    x.fillStyle = '#C8A24E'; x.beginPath(); x.arc(70, 128, 4, 0, TAU); x.fill(); x.fillStyle = 'rgba(255,230,160,0.22)'; x.beginPath(); x.arc(66, 126, 16, 0, TAU); x.fill();
    // sacks of seed waiting to be sown, in the corner by the bench
    for (const [sx, sy, c] of [[214, 128, '#C8B48A'], [226, 142, '#B8A47A']]) { x.fillStyle = 'rgba(0,0,0,0.2)'; U.ellipse(x, sx + 2, sy + 4, 10, 5); x.fill(); x.fillStyle = c; U.rr(x, sx - 9, sy - 10, 18, 14, 5); x.fill(); x.strokeStyle = '#2A2620'; x.lineWidth = 0.9; x.stroke(); x.fillStyle = '#8A4A3A'; x.fillRect(sx - 4, sy - 12, 8, 3); }
    x.strokeStyle = '#2A2620'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, d - 2);
  },
  _kilim(x, x0, y0, w, h) {
    const red = '#9E3B2E', ind = '#34466B', och = '#C89B45', ivo = '#EDE3CC';
    x.fillStyle = red; x.fillRect(x0, y0, w, h);
    x.fillStyle = ivo; x.fillRect(x0 + 6, y0 + 6, w - 12, h - 12);
    x.fillStyle = ind; x.fillRect(x0 + 10, y0 + 10, w - 20, h - 20);
    for (let k = 0; k < 3; k++) {
      const cx = x0 + w * (0.22 + k * 0.28), cy = y0 + h / 2;
      x.fillStyle = k === 1 ? red : och;
      x.beginPath(); x.moveTo(cx, cy - 28); x.lineTo(cx + 18, cy); x.lineTo(cx, cy + 28); x.lineTo(cx - 18, cy); x.closePath(); x.fill();
      x.fillStyle = ivo; x.beginPath(); x.moveTo(cx, cy - 14); x.lineTo(cx + 9, cy); x.lineTo(cx, cy + 14); x.lineTo(cx - 9, cy); x.closePath(); x.fill();
      x.strokeStyle = ivo; x.lineWidth = 2;
      x.beginPath(); x.moveTo(cx - 18, cy); x.lineTo(cx - 24, cy - 6); x.moveTo(cx + 18, cy); x.lineTo(cx + 24, cy + 6); x.stroke();
    }
    x.fillStyle = och;
    for (let k = x0 + 14; k < x0 + w - 14; k += 10) { x.beginPath(); x.moveTo(k, y0 + 10); x.lineTo(k + 5, y0 + 15); x.lineTo(k + 10, y0 + 10); x.fill(); x.beginPath(); x.moveTo(k, y0 + h - 10); x.lineTo(k + 5, y0 + h - 15); x.lineTo(k + 10, y0 + h - 10); x.fill(); }
    x.strokeStyle = '#EDE3CC'; x.lineWidth = 1;
    for (let k = x0; k < x0 + w; k += 4) { x.beginPath(); x.moveTo(k, y0 + h); x.lineTo(k, y0 + h + 4); x.stroke(); x.beginPath(); x.moveTo(k, y0); x.lineTo(k, y0 - 4); x.stroke(); }
  },
  ghInterior(x, b) {
    const w = b.w, d = b.d;
    x.fillStyle = '#8E7A5E'; x.fillRect(0, 0, w, d);
    for (let i = 0; i < 400; i++) { x.fillStyle = U.rgba(U.hash(i, 1, 3) < 0.5 ? '#A89276' : '#6E5E48', 0.6); U.ellipse(x, U.hash(i, 2, 3) * w, U.hash(i, 3, 3) * d, 2, 1.4); x.fill(); }
    x.fillStyle = '#B98A62'; x.fillRect(w / 2 - 34, 90, 68, d - 90);
    for (let yy = 94; yy < d; yy += 10) { x.strokeStyle = 'rgba(90,50,30,0.5)'; x.beginPath(); x.moveTo(w / 2 - 34, yy); x.lineTo(w / 2 + 34, yy); x.stroke(); }
    // benches
    const bench = (bx, by, bw, bh) => { x.fillStyle = '#7A6A58'; x.fillRect(bx, by, bw, bh); x.strokeStyle = '#2A2620'; x.lineWidth = 1.2; x.strokeRect(bx, by, bw, bh); };
    bench(15, 30, 125, 40); bench(225, 30, 125, 40);
    // rig: lamp, beaker with elodea, ruler
    x.fillStyle = '#E4EEF0'; x.fillRect(40, 38, 14, 24); x.strokeStyle = '#2A2620'; x.strokeRect(40, 38, 14, 24);
    x.strokeStyle = '#4F8A3A'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(47, 60); x.quadraticCurveTo(44, 50, 48, 42); x.stroke();
    x.fillStyle = '#2C2E30'; x.fillRect(90, 36, 8, 26); x.fillStyle = '#C8A24E'; x.beginPath(); x.arc(94, 36, 8, Math.PI, 0); x.fill();
    x.fillStyle = '#EAD9A8'; x.fillRect(58, 58, 30, 4);
    ['#C84A3A', '#3A6AB0', '#4A9A4A'].forEach((c, i) => { x.fillStyle = c; x.fillRect(110 + i * 8, 44, 6, 12); });
    // mendel bench: pots, brush
    for (let i = 0; i < 4; i++) { x.fillStyle = '#B5653E'; x.fillRect(236 + i * 28, 44, 16, 14); x.fillStyle = '#6F9448'; x.beginPath(); x.arc(244 + i * 28, 40, 8, 0, TAU); x.fill(); x.fillStyle = '#F4F1EA'; x.beginPath(); x.arc(246 + i * 28, 36, 2.4, 0, TAU); x.fill(); }
    x.strokeStyle = '#6B4A32'; x.lineWidth = 2; x.beginPath(); x.moveTo(340, 60); x.lineTo(330, 44); x.stroke();
    // tray bench
    bench(120, 105, 125, 40);
    x.strokeStyle = '#2A2620'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, d - 2);
  },
  _trays(ctx, b) {
    const healthy = G.S.flags.lightsSet;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) {
      const px = b.x + 128 + i * 24, py = b.y + 114 + j * 11;
      ctx.fillStyle = '#5E4A36'; ctx.fillRect(px - 8, py - 3, 16, 7);
      ctx.strokeStyle = healthy ? '#5E9A3A' : '#B8B45A'; ctx.lineWidth = 1.2;
      const hgt = healthy ? 8 : 12, lean = healthy ? 0 : 3;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + lean, py - hgt); ctx.stroke();
      ctx.fillStyle = healthy ? '#6FAA44' : '#CBC67A';
      U.ellipse(ctx, px + lean - 3, py - hgt, 3, 1.6, -0.4); ctx.fill(); U.ellipse(ctx, px + lean + 3, py - hgt, 3, 1.6, 0.4); ctx.fill();
    }
    if (healthy) {
      const g = ctx.createRadialGradient(b.x + 182, b.y + 120, 5, b.x + 182, b.y + 120, 90);
      g.addColorStop(0, 'rgba(220,90,200,0.28)'); g.addColorStop(1, 'rgba(220,90,200,0)');
      ctx.fillStyle = g; ctx.fillRect(b.x + 90, b.y + 60, 190, 120);
    }
  },

  // ---------------- props ----------------
  drawProp(ctx, p, t) {
    const P = this.pal(), season = G.S.season;
    switch (p.kind) {
      case 'rock': this.blit(ctx, this.spr('rock' + (p.seed % 3) + season, 60, 40, 30, 30, x => { this.shadow(x, 24, 7, 4); U.wash(x, U.blob(0, -10, 24, 16, 10, 0.2, p.seed), P.rock, { edge: 0.4, seed: p.seed }); x.fillStyle = U.rgba('#FFFFFF', 0.25); U.ellipse(x, -6, -16, 9, 4); x.fill(); U.ink(x, U.blob(0, -10, 24, 16, 10, 0.2, p.seed), { closed: true, w: 1.3, seed: p.seed }); if (season === 3) { x.fillStyle = '#F6F7F2'; U.ellipse(x, 0, -20, 18, 6); x.fill(); } }), p.x, p.y); return;
      case 'well': this.blit(ctx, this.spr('well' + season, 70, 90, 35, 70, x => this.p_well(x, P, season)), p.x, p.y); return;
      case 'hay': this.blit(ctx, this.spr('hay' + season, 70, 60, 35, 40, x => this.p_hay(x, P, season)), p.x, p.y); return;
      case 'compost': this.blit(ctx, this.spr('compost', 80, 50, 40, 36, x => this.p_compost(x, P)), p.x, p.y); return;
      case 'cart': this.blit(ctx, this.spr('cart', 90, 60, 45, 44, x => this.p_cart(x, P)), p.x, p.y); return;
      case 'scarecrow': this.p_scarecrow(ctx, p, t, P); return;
      case 'trough': this.blit(ctx, this.spr('trough', 90, 40, 45, 26, x => this.p_trough(x, P)), p.x, p.y); return;
      case 'bench': this.blit(ctx, this.spr('bench', 70, 40, 35, 28, x => { x.fillStyle = P.wood; x.fillRect(-28, -18, 56, 8); x.fillRect(-28, -8, 56, 6); x.fillStyle = P.woodDark; x.fillRect(-24, -2, 5, 8); x.fillRect(19, -2, 5, 8); U.ink(x, U.rectPts(-28, -18, 56, 14), { closed: true, smooth: false, w: 1.2, amp: 0.4 }); }), p.x, p.y); return;
      case 'mailbox': this.blit(ctx, this.spr('mailbox', 30, 50, 15, 44, x => { x.fillStyle = P.woodDark; x.fillRect(-2, -26, 4, 26); x.fillStyle = '#C8A24E'; U.rr(x, -10, -40, 20, 16, 5); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 1.2; x.stroke(); x.fillStyle = '#A0322A'; x.fillRect(8, -40, 3, 8); }), p.x, p.y); return;
      case 'sign': this.blit(ctx, this.spr('sign' + p.x + I18N.lang, 180, 110, 90, 100, x => this.p_sign(x, P, p)), p.x, p.y); return;
      case 'fountain': this.blit(ctx, this.spr('fountain' + season, 90, 110, 45, 92, x => this.p_fountain(x, P)), p.x, p.y); this._fountainWater(ctx, p, t); return;
      case 'laundry': this.p_laundry(ctx, p, t, P); return;
      case 'tables': this.blit(ctx, this.spr('tables', 160, 60, 80, 40, x => this.p_tables(x, P)), p.x, p.y); return;
      case 'oven': this.blit(ctx, this.spr('oven' + season, 130, 112, 65, 92, x => this.p_oven(x, P, season)), p.x, p.y); this._ovenGlow(ctx, p, t); return;
      case 'kneadtrough': { const up = G.S.flags.doughFixed ? 1 : 0; this.blit(ctx, this.spr('knead' + up, 96, 60, 48, 44, x => this.p_knead(x, P, up)), p.x, p.y); return; }
      case 'stage': { const f = G.S.cases && G.S.cases.festival ? 1 : 0; this.blit(ctx, this.spr('stage' + f + I18N.lang, 150, 110, 75, 90, x => this.p_stage(x, P, f)), p.x, p.y); return; }
      case 'swaptable': if (!G.S.cases || !G.S.cases.festival) return; this.blit(ctx, this.spr('swaptable' + I18N.lang, 110, 90, 55, 74, x => this.p_swaptable(x, P)), p.x, p.y); return;
      case 'festival': if (G.S.cases && G.S.cases.festival) this._festival(ctx, t); return;
      case 'labtable': this.blit(ctx, this.spr('labtable', 90, 80, 45, 66, x => this.p_labtable(x, P)), p.x, p.y); return;
      case 'germbench': this.blit(ctx, this.spr('germbench', 130, 100, 65, 82, x => this.p_germbench(x, P)), p.x, p.y); return;
      case 'hive': this.blit(ctx, this.spr('hive' + season, 40, 50, 20, 40, x => this.p_hive(x, P, season)), p.x, p.y); if (season < 3 && Math.random() < 0.1) PART.add({ kind: 'sparkle', x: p.x + (Math.random() - 0.5) * 60, y: p.y - 30 - Math.random() * 30, life: 0.5, c: '#E9C74E' }); return;
      case 'willowpot': this.p_willowpot(ctx, p, t, P, season); return;
      case 'scale': this.blit(ctx, this.spr('scale', 60, 70, 30, 56, x => this.p_scale(x, P)), p.x, p.y); return;
      case 'peabed': this.p_peabed(ctx, p, t, P); return;
      case 'mushrooms': this.blit(ctx, this.spr('mush' + p.x, 60, 40, 30, 30, x => this.p_mush(x, P, p.x)), p.x, p.y); return;
      case 'hotspring': this.blit(ctx, this.spr('hotspring', 260, 110, 200, 70, x => this.p_hotspring(x, P)), p.x, p.y); this._springBubbles(ctx, p, t); return;
      case 'thermokit': this.blit(ctx, this.spr('thermokit', 50, 56, 22, 48, x => this.p_thermokit(x, P)), p.x, p.y); return;
      case 'steptest': this.blit(ctx, this.spr('steptest', 70, 44, 32, 38, x => this.p_steptest(x, P)), p.x, p.y); return;
      case 'bloodkit': this.blit(ctx, this.spr('bloodkit', 76, 56, 38, 48, x => this.p_bloodkit(x, P)), p.x, p.y); return;
      case 'tomatobed': { const f = G.S.flags.gardenFixed ? 1 : 0; this.blit(ctx, this.spr('tomatobed' + f, 140, 70, 70, 56, x => this.p_tomatobed(x, P, f)), p.x, p.y); return; }
      case 'handpump': this.blit(ctx, this.spr('handpump', 44, 64, 22, 56, x => this.p_handpump(x, P)), p.x, p.y); return;
      case 'osmokit': this.blit(ctx, this.spr('osmokit', 76, 56, 38, 48, x => this.p_osmokit(x, P)), p.x, p.y); return;
      case 'rainbarrel': if (!G.S.flags.gardenFixed) return; this.blit(ctx, this.spr('rainbarrel', 40, 70, 20, 64, x => this.p_rainbarrel(x, P)), p.x, p.y); return;
      case 'pellets': this.blit(ctx, this.spr('pellets', 44, 22, 22, 14, x => this.p_pellets(x, P)), p.x, p.y); return;
      case 'pelletkit': this.blit(ctx, this.spr('pelletkit', 76, 56, 38, 48, x => this.p_pelletkit(x, P)), p.x, p.y); return;
      case 'owlbox': if (!G.S.flags.owlSafe) return; this.blit(ctx, this.spr('owlbox', 40, 92, 20, 86, x => this.p_owlbox(x, P)), p.x, p.y); return;
      case 'calorkit': this.blit(ctx, this.spr('calorkit', 76, 70, 38, 62, x => this.p_calorkit(x, P)), p.x, p.y); return;
      case 'slidekit': this.blit(ctx, this.spr('slidekit', 76, 76, 38, 68, x => this.p_slidekit(x, P)), p.x, p.y); return;
      case 'graftkit': this.blit(ctx, this.spr('graftkit', 80, 64, 40, 56, x => this.p_graftkit(x, P)), p.x, p.y); return;
      case 'squashpatch': { const f = G.S.flags.squashPure ? 1 : 0; this.blit(ctx, this.spr('squashpatch' + f, 200, 90, 100, 72, x => this.p_squashpatch(x, P, f)), p.x, p.y); return; }
      case 'gourdfence': this.blit(ctx, this.spr('gourdfence', 150, 96, 75, 80, x => this.p_gourdfence(x, P)), p.x, p.y); return;
      case 'sevimheap': { const f = G.S.flags.compostFixed ? 1 : 0; this.blit(ctx, this.spr('sevimheap' + f, 70, 50, 35, 38, x => this.p_sevimheap(x, P, f)), p.x, p.y); return; }
      case 'compostkit': this.blit(ctx, this.spr('compostkit', 90, 60, 45, 50, x => this.p_compostkit(x, P)), p.x, p.y); return;
      case 'rustplot': { const f = G.S.flags.rustWise ? 1 : 0; this.blit(ctx, this.spr('rustplot' + f, 210, 100, 105, 80, x => this.p_rustplot(x, P, f)), p.x, p.y); return; }
      case 'rustboard': this.blit(ctx, this.spr('rustboard', 80, 70, 40, 62, x => this.p_rustboard(x, P)), p.x, p.y); return;
      case 'pollkit': this.blit(ctx, this.spr('pollkit', 80, 64, 40, 56, x => this.p_pollkit(x, P)), p.x, p.y); return;
      case 'brokenlimb': this.blit(ctx, this.spr('brokenlimb', 110, 50, 55, 36, x => this.p_brokenlimb(x, P)), p.x, p.y); return;
      case 'notebook': this.blit(ctx, this.spr('notebook', 44, 34, 22, 30, x => this.p_notebook(x, P)), p.x, p.y); return;
      case 'yogurtkit': this.blit(ctx, this.spr('yogurtkit', 64, 48, 32, 42, x => this.p_yogurtkit(x, P)), p.x, p.y); return;
      case 'serakit': this.blit(ctx, this.spr('serakit', 64, 60, 32, 54, x => this.p_serakit(x, P)), p.x, p.y); return;
      case 'hediyekit': this.blit(ctx, this.spr('hediyekit', 64, 48, 32, 42, x => this.p_hediyekit(x, P)), p.x, p.y); return;
      case 'azotkit': this.blit(ctx, this.spr('azotkit', 70, 56, 35, 48, x => this.p_azotkit(x, P)), p.x, p.y); return;
      case 'ekimkit': this.blit(ctx, this.spr('ekimkit', 64, 48, 32, 42, x => this.p_ekimkit(x, P)), p.x, p.y); return;
      case 'etilenkit': this.blit(ctx, this.spr('etilenkit', 64, 48, 32, 42, x => this.p_etilenkit(x, P)), p.x, p.y); return;
      case 'sindirimkit': this.blit(ctx, this.spr('sindirimkit', 64, 48, 32, 42, x => this.p_sindirimkit(x, P)), p.x, p.y); return;
      case 'kulkit': this.blit(ctx, this.spr('kulkit', 64, 48, 32, 42, x => this.p_kulkit(x, P)), p.x, p.y); return;
      case 'zarkit': this.blit(ctx, this.spr('zarkit', 64, 48, 32, 42, x => this.p_zarkit(x, P)), p.x, p.y); return;
      case 'kilcalkit': this.blit(ctx, this.spr('kilcalkit', 64, 48, 32, 42, x => this.p_kilcalkit(x, P)), p.x, p.y); return;
      case 'heartmodel': this.blit(ctx, this.spr('heartmodel', 40, 60, 20, 56, x => this.p_heartmodel(x, P)), p.x, p.y); return;
      case 'sweepkit': this.blit(ctx, this.spr('sweepkit', 90, 84, 45, 76, x => this.p_sweepkit(x, P)), p.x, p.y); return;
      case 'storkbox': if (!G.S.cases.leylek || G.S.flags.chickHome) return; this.blit(ctx, this.spr('storkbox', 56, 60, 28, 52, x => this.p_storkbox(x, P)), p.x, p.y); return;
      case 'cavemouth': this.blit(ctx, this.spr('cave' + season, 170, 120, 85, 100, x => this.p_cave(x, P, season)), p.x, p.y); return;
      case 'rails': this.blit(ctx, this.spr('rails', 1110, 60, 10, 30, x => this.p_rails(x, P)), p.x, p.y); return;
      case 'stationsign': return;
      case 'nest': this.p_nest(ctx, p, t); return;
    }
  },
  p_well(x, P, season) {
    this.shadow(x, 30, 8, 4);
    this._stones(x, -24, -30, 48, 30, P.stone, 3);
    x.fillStyle = '#2A3A40'; U.ellipse(x, 0, -30, 22, 8); x.fill();
    x.fillStyle = P.stone; U.ellipse(x, 0, -30, 24, 9); x.strokeStyle = P.ink; x.lineWidth = 1.2; x.stroke();
    x.fillStyle = '#2A3A40'; U.ellipse(x, 0, -30, 19, 6.5); x.fill();
    x.fillStyle = P.woodDark; x.fillRect(-22, -70, 5, 40); x.fillRect(17, -70, 5, 40); x.fillRect(-24, -72, 48, 5);
    x.strokeStyle = '#8A7A5A'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, -67); x.lineTo(0, -44); x.stroke();
    x.fillStyle = '#8A8A86'; x.fillRect(-5, -46, 10, 9); x.strokeStyle = P.ink; x.strokeRect(-5, -46, 10, 9);
    U.ink(x, U.rectPts(-24, -30, 48, 30), { closed: true, smooth: false, w: 1.2, amp: 0.4 });
    if (season === 3) { x.fillStyle = '#F6F7F2'; x.fillRect(-26, -76, 52, 5); }
  },
  p_hay(x, P, season) {
    this.shadow(x, 28, 8, 4);
    x.fillStyle = '#D6B866'; U.rr(x, -26, -34, 52, 34, 14); x.fill();
    x.strokeStyle = '#B0923E'; x.lineWidth = 1;
    for (let i = 0; i < 18; i++) { const px = -24 + U.hash(i, 1, 5) * 48, py = -30 + U.hash(i, 2, 5) * 28; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 7, py - 2); x.stroke(); }
    x.strokeStyle = '#8A6A3A'; x.lineWidth = 2; x.beginPath(); x.moveTo(-26, -16); x.lineTo(26, -16); x.stroke();
    x.strokeStyle = P.ink; x.lineWidth = 1.3; U.rr(x, -26, -34, 52, 34, 14); x.stroke();
    if (season === 3) { x.fillStyle = '#F6F7F2'; U.ellipse(x, 0, -32, 22, 6); x.fill(); }
  },
  p_compost(x, P) {
    this.shadow(x, 34, 8, 3);
    U.wash(x, [[-34, 0], [-26, -18], [-8, -28], [12, -26], [30, -14], [34, 0]], '#4E3B2A', { edge: 0.35, seed: 4 });
    x.fillStyle = '#7A8A3A'; for (let i = 0; i < 10; i++) { U.ellipse(x, -24 + U.hash(i, 1, 3) * 48, -18 + U.hash(i, 2, 3) * 14, 4, 2, U.hash(i, 3, 3)); x.fill(); }
    x.fillStyle = '#C8A24E'; for (let i = 0; i < 6; i++) { U.ellipse(x, -20 + U.hash(i, 4, 3) * 40, -14 + U.hash(i, 5, 3) * 10, 3, 1.5); x.fill(); }
    U.ink(x, [[-34, 0], [-26, -18], [-8, -28], [12, -26], [30, -14], [34, 0]], { w: 1.3, seed: 4 });
    x.strokeStyle = P.woodDark; x.lineWidth = 2.5; x.beginPath(); x.moveTo(26, -4); x.lineTo(36, -34); x.stroke();
  },
  p_cart(x, P) {
    this.shadow(x, 36, 8, 4);
    x.fillStyle = P.wood; x.fillRect(-34, -34, 60, 18); x.strokeStyle = P.ink; x.lineWidth = 1.2; x.strokeRect(-34, -34, 60, 18);
    for (let k = -30; k < 26; k += 10) { x.beginPath(); x.moveTo(k, -34); x.lineTo(k, -16); x.stroke(); }
    x.fillStyle = P.woodDark; x.beginPath(); x.arc(-18, -12, 12, 0, TAU); x.fill(); x.stroke();
    x.strokeStyle = '#C8A876'; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; x.beginPath(); x.moveTo(-18, -12); x.lineTo(-18 + Math.cos(a) * 10, -12 + Math.sin(a) * 10); x.stroke(); }
    x.strokeStyle = P.woodDark; x.lineWidth = 3; x.beginPath(); x.moveTo(26, -24); x.lineTo(44, -18); x.stroke();
    x.fillStyle = '#E07A3A'; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(-26 + i * 11, -38, 5, 0, TAU); x.fill(); }
  },
  p_trough(x, P) {
    this.shadow(x, 40, 6, 3);
    x.fillStyle = '#8C8A84'; x.fillRect(-40, -20, 80, 18); x.fillStyle = '#5E8E95'; x.fillRect(-36, -18, 72, 8);
    x.strokeStyle = P.ink; x.lineWidth = 1.2; x.strokeRect(-40, -20, 80, 18);
  },
  p_sign(x, P, p) {
    this.shadow(x, 12, 4, 3);
    x.fillStyle = P.woodDark; x.fillRect(-3, -86, 6, 86);
    U.ink(x, [[-3, 0], [-3, -86]], { w: 1.1, smooth: false }); U.ink(x, [[3, 0], [3, -86]], { w: 1.1, smooth: false });
    x.font = '700 10px "Courier Prime", monospace';
    p.to.slice(0, 4).forEach((k, i) => {
      const r = WORLD.regions[k], name = L(r.name).toLocaleUpperCase(I18N.lang === 'tr' ? 'tr-TR' : 'en'), dir = r.x < p.x ? -1 : 1;
      const w = Math.min(84, x.measureText(name).width + 18), y = -82 + i * 17;
      x.fillStyle = ['#E9DFC6', '#E2D3B0', '#EADFC9', '#DCCFB0'][i];
      x.beginPath();
      if (dir > 0) { x.moveTo(0, y); x.lineTo(w, y); x.lineTo(w + 8, y + 7); x.lineTo(w, y + 14); x.lineTo(0, y + 14); }
      else { x.moveTo(0, y); x.lineTo(-w, y); x.lineTo(-w - 8, y + 7); x.lineTo(-w, y + 14); x.lineTo(0, y + 14); }
      x.closePath(); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 1; x.stroke();
      x.fillStyle = '#2A2620'; x.textBaseline = 'middle'; x.textAlign = dir > 0 ? 'left' : 'right';
      x.save(); x.beginPath(); x.rect(dir > 0 ? 2 : -w, y, w - 2, 14); x.clip();
      x.fillText(name, dir > 0 ? 5 : -5, y + 7.5); x.restore();
    });
  },
  p_fountain(x, P) {
    this.shadow(x, 38, 8, 3);
    x.fillStyle = '#5E8E95'; U.ellipse(x, 0, -6, 34, 10); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 1.2; x.stroke();
    this._stones(x, -30, -84, 60, 76, '#DCD2BC', 9);
    x.fillStyle = '#DCD2BC'; x.beginPath(); x.moveTo(-34, -84); x.lineTo(0, -100); x.lineTo(34, -84); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#C9BEA5'; x.beginPath(); x.moveTo(-14, -30); x.lineTo(-14, -56); x.arc(0, -56, 14, Math.PI, 0); x.lineTo(14, -30); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#EDE3CC'; x.fillRect(-18, -80, 36, 14); x.strokeRect(-18, -80, 36, 14);
    x.strokeStyle = '#6B5A48'; x.lineWidth = 0.8; for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(-14, -76 + k * 4); x.bezierCurveTo(-6, -79 + k * 4, 4, -73 + k * 4, 14, -76 + k * 4); x.stroke(); }
    x.fillStyle = '#9A8A76'; x.fillRect(-2, -34, 4, 6);
    U.ink(x, U.rectPts(-30, -84, 60, 76), { closed: true, smooth: false, w: 1.3, amp: 0.4 });
  },
  _fountainWater(ctx, p, t) {
    if (G.S.season === 3) return;
    ctx.strokeStyle = 'rgba(220,240,245,0.85)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(p.x, p.y - 28); ctx.quadraticCurveTo(p.x + 1, p.y - 20, p.x, p.y - 8); ctx.stroke();
    const ph = (t * 3) % 1; ctx.strokeStyle = `rgba(230,245,245,${1 - ph})`; U.ellipse(ctx, p.x, p.y - 6, 3 + ph * 10, 1 + ph * 3); ctx.stroke();
  },
  p_laundry(ctx, p, t, P) {
    ctx.save();
    ctx.strokeStyle = P.woodDark; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(p.x - 70, p.y); ctx.lineTo(p.x - 70, p.y - 60); ctx.moveTo(p.x + 70, p.y); ctx.lineTo(p.x + 70, p.y - 60); ctx.stroke();
    ctx.strokeStyle = '#6A6A64'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x - 70, p.y - 56); ctx.quadraticCurveTo(p.x, p.y - 48, p.x + 70, p.y - 56); ctx.stroke();
    const cols = ['#C84A3A', '#EDE3CC', '#3E6C9A', '#E0B040', '#6F8F3C'];
    for (let i = 0; i < 5; i++) {
      const cx = p.x - 52 + i * 26, top = p.y - 54 + Math.abs(i - 2) * 1.6, sw = Math.sin(t * 2 + i) * 3;
      ctx.fillStyle = cols[i];
      ctx.beginPath(); ctx.moveTo(cx - 9, top); ctx.lineTo(cx + 9, top); ctx.lineTo(cx + 9 + sw, top + 20 + (i % 2) * 6); ctx.lineTo(cx - 9 + sw, top + 20 + (i % 2) * 6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = U.rgba(P.ink, 0.7); ctx.stroke();
    }
    ctx.restore();
  },
  p_tables(x, P) {
    for (const cx of [-45, 45]) {
      this.shadow(x, 24, 6, 3);
      x.fillStyle = P.woodDark; x.fillRect(cx - 2, -26, 4, 26);
      x.fillStyle = '#EDE3CC'; U.ellipse(x, cx, -28, 24, 9); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 1.2; x.stroke();
      x.fillStyle = '#A0322A'; x.fillRect(cx - 10, -34, 20, 10);
      x.strokeStyle = '#EDE3CC'; x.lineWidth = 1; for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(cx - 9, -32 + k * 3); x.lineTo(cx + 9, -32 + k * 3); x.stroke(); }
      for (const gx of [-14, 12]) { x.fillStyle = 'rgba(200,230,240,0.7)'; x.beginPath(); x.moveTo(cx + gx - 3, -38); x.lineTo(cx + gx + 3, -38); x.lineTo(cx + gx + 2, -34); x.lineTo(cx + gx + 3, -30); x.lineTo(cx + gx - 3, -30); x.lineTo(cx + gx - 2, -34); x.closePath(); x.fill(); x.fillStyle = '#9E3B1E'; x.fillRect(cx + gx - 2, -35, 4, 4); }
    }
  },
  // the village's wood-fired oven: a whitewashed clay dome on a stone plinth
  p_oven(x, P, season) {
    this.shadow(x, 50, 9, 5);
    this._stones(x, -46, -22, 92, 22, P.stone, 41);
    U.ink(x, U.rectPts(-46, -22, 92, 22), { closed: true, w: 1.2, smooth: false, amp: 0.5 });
    x.fillStyle = '#6E655A'; x.fillRect(18, -88, 9, 30); x.fillStyle = '#4A4038'; x.fillRect(16, -91, 13, 4);
    const g = x.createRadialGradient(-14, -60, 4, 0, -36, 52); g.addColorStop(0, '#FCF8EE'); g.addColorStop(0.6, '#EDE3CC'); g.addColorStop(1, '#C9BB9A');
    x.fillStyle = g; x.beginPath(); x.moveTo(-42, -22); x.bezierCurveTo(-46, -76, 46, -76, 42, -22); x.closePath(); x.fill();
    U.ink(x, [[-42, -22], [-38, -46], [-22, -63], [0, -68], [22, -63], [38, -46], [42, -22]], { w: 1.4 });
    x.strokeStyle = 'rgba(150,130,100,0.35)'; x.lineWidth = 0.8; for (let k = 0; k < 6; k++) { x.beginPath(); x.moveTo(-30 + k * 11, -30 - (k % 2) * 6); x.lineTo(-26 + k * 11, -40 - (k % 3) * 5); x.stroke(); }
    x.fillStyle = '#23150C'; x.beginPath(); x.moveTo(-16, -22); x.lineTo(-16, -34); x.arc(0, -34, 16, Math.PI, 0); x.lineTo(16, -22); x.closePath(); x.fill();
    const e = x.createRadialGradient(0, -23, 1, 0, -25, 16); e.addColorStop(0, '#FFD98A'); e.addColorStop(0.45, '#E8762C'); e.addColorStop(1, 'rgba(120,30,10,0)');
    x.fillStyle = e; x.fillRect(-16, -42, 32, 20);
    x.strokeStyle = '#8A7A66'; x.lineWidth = 3.2; x.beginPath(); x.arc(0, -34, 18, Math.PI, 0); x.stroke();
    x.strokeStyle = P.ink; x.lineWidth = 1; x.beginPath(); x.arc(0, -34, 19.8, Math.PI, 0); x.stroke();
    x.strokeStyle = '#8A6844'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(-40, -4); x.lineTo(-54, -62); x.stroke();
    x.fillStyle = '#B08A5A'; U.ellipse(x, -56, -68, 7, 10, -0.25); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 0.8; x.stroke();
    for (let k = 0; k < 5; k++) { const lx = 34 + (k % 3) * 7 + (k > 2 ? 3.5 : 0), ly = -4 - (k > 2 ? 6 : 0); x.fillStyle = k % 2 ? '#7A5A3A' : '#8E6A44'; U.ellipse(x, lx, ly, 4, 3); x.fill(); x.fillStyle = '#C8A878'; U.ellipse(x, lx, ly, 2, 1.5); x.fill(); }
    if (season === 3) { x.fillStyle = '#F6F7F2'; x.beginPath(); x.ellipse(0, -60, 30, 8, 0, Math.PI, 0); x.fill(); }
  },
  _ovenGlow(ctx, p, t) {
    const f = 0.2 + 0.08 * Math.sin(t * 9) + 0.05 * Math.sin(t * 23);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(p.x, p.y - 26, 2, p.x, p.y - 26, 34); g.addColorStop(0, `rgba(255,170,80,${f.toFixed(2)})`); g.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = g; ctx.fillRect(p.x - 34, p.y - 60, 68, 60); ctx.restore();
  },
  // a kneading trough (hamur teknesi) hollowed from a log, on two legs
  p_knead(x, P, up) {
    this.shadow(x, 40, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-30, -14, 5, 14); x.fillRect(25, -14, 5, 14);
    x.fillStyle = MX.lin(x, 0, -32, 0, -12, [[0, '#A87C50'], [1, '#7A5634']]); x.beginPath(); x.moveTo(-42, -32); x.lineTo(42, -32); x.lineTo(33, -13); x.lineTo(-33, -13); x.closePath(); x.fill();
    x.fillStyle = '#5E4028'; U.ellipse(x, 0, -32, 42, 7); x.fill();
    if (up) {
      x.fillStyle = MX.lin(x, 0, -50, 0, -30, [[0, '#FBF3DE'], [1, '#E6D6B0']]); x.beginPath(); x.moveTo(-38, -32); x.bezierCurveTo(-34, -52, 34, -52, 38, -32); x.closePath(); x.fill();
      x.fillStyle = 'rgba(160,130,90,0.5)'; for (let k = 0; k < 9; k++) { U.ellipse(x, -24 + k * 6, -40 - (k % 3) * 2.5, 1.1, 0.8); x.fill(); }
      x.fillStyle = 'rgba(255,255,255,0.55)'; U.ellipse(x, -12, -44, 12, 3.5, -0.1); x.fill();
    } else {
      x.fillStyle = MX.lin(x, 0, -36, 0, -28, [[0, '#EFE4C6'], [1, '#D8C69C']]); U.ellipse(x, 0, -32, 36, 5); x.fill();
      x.strokeStyle = 'rgba(140,110,70,0.5)'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(-20, -32); x.quadraticCurveTo(0, -30, 18, -33); x.stroke();
    }
    U.ink(x, [[-42, -32], [42, -32], [33, -13], [-33, -13]], { closed: true, w: 1.2, smooth: false, amp: 0.4 });
    x.fillStyle = 'rgba(250,246,234,0.7)'; for (let k = 0; k < 16; k++) { U.ellipse(x, -44 + U.hash(k, 1, 7) * 88, -2 + U.hash(k, 2, 7) * 8, 1.4, 0.6); x.fill(); }
  },
  // Nebahat's and Nazlı's lab table: three flasks with balloons, a jar of limewater
  // the germination bench: an incubator, four petri dishes and a tray of sprouting peas
  p_germbench(x, P) {
    this.shadow(x, 54, 7, 3);
    x.fillStyle = P.woodDark; x.fillRect(-50, -32, 4, 32); x.fillRect(46, -32, 4, 32);
    x.fillStyle = P.wood; x.fillRect(-56, -48, 112, 14); x.fillStyle = U.shade(P.wood, -0.25); x.fillRect(-56, -34, 112, 4);
    U.ink(x, U.rectPts(-56, -48, 112, 18), { closed: true, w: 1.1, smooth: false, amp: 0.3 });
    x.fillStyle = '#E8E6DE'; x.fillRect(-54, -72, 26, 26); x.fillStyle = '#9FB8C0'; x.fillRect(-50, -68, 18, 13);
    x.fillStyle = '#D2413A'; x.beginPath(); x.arc(-33, -50, 1.5, 0, TAU); x.fill();
    x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-54, -72, 26, 26);
    for (let i = 0; i < 4; i++) {
      const cx = -20 + i * 14, cy = -41;
      x.fillStyle = '#E4DCC6'; U.ellipse(x, cx, cy, 6, 3.4); x.fill();
      x.fillStyle = '#B8B266'; for (let k = 0; k < 5; k++) { U.ellipse(x, cx - 3.5 + k * 1.8, cy - 0.6 + (k % 2) * 1.4, 0.9, 0.7); x.fill(); }
      x.strokeStyle = 'rgba(236,246,250,0.95)'; x.lineWidth = 1; U.ellipse(x, cx, cy, 6, 3.4); x.stroke();
    }
    x.fillStyle = '#7A5A3A'; x.fillRect(34, -52, 20, 10); x.strokeStyle = P.ink; x.lineWidth = 0.9; x.strokeRect(34, -52, 20, 10);
    for (let k = 0; k < 5; k++) {
      const sx = 37 + k * 3.6;
      x.strokeStyle = '#D8DC9C'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(sx, -50); x.quadraticCurveTo(sx - 1, -60 - (k % 2) * 3, sx + 2, -61 - (k % 2) * 3); x.stroke();
      x.fillStyle = '#8FAA4E'; U.ellipse(x, sx + 2.4, -61 - (k % 2) * 3, 2, 1.1, 0.4); x.fill();
      x.strokeStyle = '#F4F0E0'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(sx, -42); x.quadraticCurveTo(sx + 1, -36, sx - 0.5, -31 + (k % 3)); x.stroke();
    }
  },
  // the village stage: bare boards all year, dressed up for the harvest festival
  p_stage(x, P, f) {
    this.shadow(x, 58, 8, 4);
    x.fillStyle = P.woodDark; x.fillRect(-52, -14, 104, 14);
    x.fillStyle = P.wood; x.fillRect(-54, -30, 108, 16);
    x.strokeStyle = 'rgba(60,40,20,0.45)'; x.lineWidth = 0.8;
    for (let k = -54; k < 54; k += 12) { x.beginPath(); x.moveTo(k, -30); x.lineTo(k + 2, -14); x.stroke(); }
    for (let k = -50; k < 52; k += 9) { x.beginPath(); x.moveTo(k, -14); x.lineTo(k, 0); x.stroke(); }
    x.fillStyle = P.wood; x.fillRect(54, -20, 12, 7); x.fillRect(54, -10, 17, 10);
    U.ink(x, U.rectPts(-54, -30, 108, 30), { closed: true, w: 1.3, smooth: false, amp: 0.4 });
    U.ink(x, U.rectPts(54, -20, 12, 20), { closed: true, w: 1, smooth: false, amp: 0.3 });
    if (!f) return;
    x.fillStyle = '#6B4A32'; x.fillRect(-51, -82, 3, 54); x.fillRect(48, -82, 3, 54);
    x.fillStyle = '#A0322A'; x.fillRect(-48, -82, 96, 16); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-48, -82, 96, 16);
    x.fillStyle = '#F4EEDD'; x.font = '700 9px "Courier Prime", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(L({ tr: 'HASAT ŞENLİĞİ', en: 'HARVEST FESTIVAL' }), 0, -73.5);
    for (let k = -52, i = 0; k < 52; k += 13, i++) { x.fillStyle = i % 2 ? '#F4EEDD' : '#C23A2C'; x.beginPath(); x.arc(k + 6.5, -14, 6.5, 0, Math.PI); x.fill(); }
    x.fillStyle = '#B5653E'; x.beginPath(); x.ellipse(-26, -36, 9, 7, 0, 0, TAU); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 1; x.stroke();
    x.fillStyle = '#EDE4CE'; x.beginPath(); x.ellipse(-26, -40, 9, 3.4, 0, 0, TAU); x.fill(); x.stroke();
    x.strokeStyle = '#6B4A32'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(-16, -48); x.lineTo(-22, -40); x.stroke();
  },
  p_swaptable(x, P) {
    this.shadow(x, 46, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-40, -26, 4, 26); x.fillRect(36, -26, 4, 26);
    x.fillStyle = '#E8DCC0'; x.fillRect(-46, -40, 92, 14);
    x.fillStyle = '#C23A2C'; for (let k = -46; k < 46; k += 8) x.fillRect(k, -26, 4, 6);
    U.ink(x, U.rectPts(-46, -40, 92, 20), { closed: true, w: 1.1, smooth: false, amp: 0.3 });
    ['#D9B45A', '#C8643A', '#9AAE5A', '#3A3430', '#B98A4A'].forEach((c, i) => {
      const jx = -40 + i * 12;
      x.fillStyle = 'rgba(214,230,232,0.75)'; x.fillRect(jx, -52, 9, 12); x.fillStyle = c; x.fillRect(jx + 1, -47, 7, 6.5);
      x.fillStyle = '#8A8A86'; x.fillRect(jx - 0.5, -54, 10, 2.5); x.strokeStyle = 'rgba(40,40,40,0.6)'; x.lineWidth = 0.6; x.strokeRect(jx, -52, 9, 12);
    });
    for (let i = 0; i < 4; i++) {
      x.save(); x.translate(26 + (i % 2) * 10, -37 + (i >> 1) * 4); x.rotate(-0.2 + i * 0.15);
      x.fillStyle = '#F4EEDD'; x.fillRect(-4, -5, 8, 10); x.fillStyle = ['#6E9A4A', '#C8A24E', '#A0322A', '#5E6E8A'][i]; x.fillRect(-4, -1, 8, 3);
      x.strokeStyle = P.ink; x.lineWidth = 0.5; x.strokeRect(-4, -5, 8, 10); x.restore();
    }
    this._sign(x, 0, -62, L({ tr: 'TOHUM TAKASI', en: 'SEED SWAP' }), '#4F6B3A', '#F4EEDD', 8);
  },
  // bunting and lanterns strung across the square
  _festival(ctx, t) {
    const cols = ['#C23A2C', '#F4EEDD', '#D6A02A', '#4F7A3A', '#2F68B4'];
    const at = (a, b, sag, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + sag * 4 * u * (1 - u)];
    const line = (a, b, sag, seed) => {
      const n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 13));
      ctx.strokeStyle = '#3A3028'; ctx.lineWidth = 1; ctx.beginPath();
      for (let i = 0; i <= 24; i++) { const [px, py] = at(a, b, sag, i / 24); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.stroke();
      for (let i = 1; i < n; i++) {
        const [px, py] = at(a, b, sag, i / n);
        ctx.save(); ctx.translate(px, py); ctx.rotate(Math.sin(t * 2.2 + i * 0.9 + seed) * 0.18);
        ctx.fillStyle = cols[(i + seed) % cols.length]; ctx.beginPath(); ctx.moveTo(-4.5, 0); ctx.lineTo(4.5, 0); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(27,26,23,0.5)'; ctx.lineWidth = 0.6; ctx.stroke(); ctx.restore();
      }
    };
    const A = [2464, 2763], B = [2990, 2748];
    line(A, B, 36, 0);
    line([2566, 2763], [2700, 2692], 14, 2);
    for (const u of [0.22, 0.45, 0.68, 0.86]) {
      const [px, py] = at(A, B, 36, u), g = 0.75 + Math.sin(t * 3 + u * 10) * 0.12;
      ctx.strokeStyle = '#3A3028'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + 8); ctx.stroke();
      ctx.fillStyle = `rgba(240,170,60,${g.toFixed(2)})`; U.ellipse(ctx, px, py + 14, 5, 7); ctx.fill(); ctx.strokeStyle = '#8A4A2A'; ctx.lineWidth = 1; ctx.stroke();
    }
  },
  p_labtable(x, P) {
    this.shadow(x, 36, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-30, -28, 4, 28); x.fillRect(26, -28, 4, 28);
    x.fillStyle = P.wood; x.fillRect(-38, -34, 76, 7);
    U.ink(x, U.rectPts(-38, -34, 76, 7), { closed: true, w: 1.1, smooth: false, amp: 0.3 });
    ['#C23A2C', '#2F68B4', '#D6A02A'].forEach((c, i) => {
      const cx = -24 + i * 16;
      x.fillStyle = '#D8C9A4'; x.beginPath(); x.moveTo(cx - 6, -35); x.lineTo(cx + 6, -35); x.lineTo(cx + 4, -40); x.lineTo(cx - 4, -40); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(40,50,60,0.8)'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(cx - 1.6, -50); x.lineTo(cx - 1.6, -45); x.lineTo(cx - 6.5, -35); x.lineTo(cx + 6.5, -35); x.lineTo(cx + 1.6, -45); x.lineTo(cx + 1.6, -50); x.stroke();
      x.fillStyle = c; x.beginPath(); x.ellipse(cx + (i - 1) * 1.5, -56 - i * 1.5, 4 + i, 5 + i * 1.2, 0, 0, TAU); x.fill(); x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 0.6; x.stroke();
      x.fillStyle = 'rgba(255,255,255,0.5)'; U.ellipse(x, cx - 1.5 + (i - 1) * 1.5, -58 - i * 1.5, 1.2, 1.8); x.fill();
    });
    x.fillStyle = 'rgba(226,236,240,0.7)'; U.rr(x, 20, -48, 12, 14, 2); x.fill(); x.strokeStyle = 'rgba(40,50,60,0.7)'; x.lineWidth = 0.7; x.stroke();
    x.fillStyle = '#6B4A32'; x.fillRect(19, -50, 14, 3);
  },
  p_hive(x, P, season) {
    this.shadow(x, 16, 5, 3);
    x.fillStyle = P.woodDark; x.fillRect(-12, -10, 4, 10); x.fillRect(8, -10, 4, 10);
    x.fillStyle = '#F1EEE4'; x.fillRect(-14, -34, 28, 24);
    x.fillStyle = '#6F8F9A'; x.fillRect(-16, -38, 32, 6);
    x.strokeStyle = P.ink; x.lineWidth = 1.1; x.strokeRect(-14, -34, 28, 24); x.strokeRect(-16, -38, 32, 6);
    x.beginPath(); x.moveTo(-14, -22); x.lineTo(14, -22); x.stroke();
    x.fillStyle = '#2A2620'; x.fillRect(-5, -13, 10, 2);
    if (season === 3) { x.fillStyle = '#F6F7F2'; x.fillRect(-17, -42, 34, 5); }
  },
  p_willowpot(ctx, p, t, P, season) {
    const dug = G.S.flags.willowDug;
    const s = this.spr('wpot' + season + (dug ? 'd' : ''), 190, 200, 95, 184, x => {
      this.shadow(x, 34, 9, 4);
      if (!dug) { x.save(); x.translate(0, -44); x.scale(0.75, 0.75); this.tree_willow(x, P, 17, season); x.restore(); }
      x.fillStyle = '#B5653E';
      x.beginPath(); x.moveTo(-26, -46); x.bezierCurveTo(-36, -30, -30, -4, -16, 0); x.lineTo(16, 0); x.bezierCurveTo(30, -4, 36, -30, 26, -46); x.closePath(); x.fill();
      x.fillStyle = '#9A5230'; x.fillRect(-28, -50, 56, 7);
      x.fillStyle = '#5A4230'; U.ellipse(x, 0, -48, 24, 5); x.fill();
      x.strokeStyle = 'rgba(255,230,200,0.35)'; x.lineWidth = 3; x.beginPath(); x.moveTo(-20, -38); x.quadraticCurveTo(-24, -22, -14, -8); x.stroke();
      U.ink(x, [[-26, -46], [-33, -24], [-16, 0], [16, 0], [33, -24], [26, -46]], { w: 1.3, seed: 3 });
      x.fillStyle = '#F4EEDD'; x.save(); x.translate(22, -30); x.rotate(0.2); x.fillRect(-8, -6, 16, 12); x.strokeStyle = '#6B5A48'; x.lineWidth = 0.8; x.strokeRect(-8, -6, 16, 12);
      x.beginPath(); for (let k = -3; k < 5; k += 3) { x.moveTo(-5, k); x.lineTo(5, k); } x.stroke(); x.restore();
    });
    this.blit(ctx, s, p.x, p.y);
    if (dug) {
      ctx.save(); ctx.translate(p.x + 60, p.y + 20); ctx.rotate(-1.35); ctx.scale(0.5, 0.5);
      const w = this.spr('wlay' + season, 170, 170, 85, 150, x => this.tree_willow(x, P, 17, season));
      this.blit(ctx, w, 0, 0); ctx.restore();
    }
  },
  p_scale(x, P) {
    this.shadow(x, 22, 6, 3);
    x.fillStyle = '#6E6A62'; x.fillRect(-20, -8, 40, 8);
    x.fillStyle = '#8A857A'; x.fillRect(-3, -46, 6, 38);
    x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(0, -46, 12, 0, TAU); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 1.2; x.stroke();
    x.beginPath(); for (let k = 0; k < 8; k++) { const a = Math.PI + k / 7 * Math.PI; x.moveTo(Math.cos(a) * 9, -46 + Math.sin(a) * 9); x.lineTo(Math.cos(a) * 11, -46 + Math.sin(a) * 11); } x.stroke();
    x.strokeStyle = '#A0322A'; x.beginPath(); x.moveTo(0, -46); x.lineTo(6, -53); x.stroke();
    U.ink(x, U.rectPts(-20, -8, 40, 8), { closed: true, smooth: false, w: 1.2, amp: 0.3 });
  },
  p_peabed(ctx, p, t, P) {
    const s = this.spr('peabed', 170, 60, 85, 40, x => {
      this.shadow(x, 74, 8, 3);
      x.fillStyle = P.woodDark; x.fillRect(-74, -22, 148, 22); x.fillStyle = '#5A4230'; x.fillRect(-70, -20, 140, 14);
      x.strokeStyle = P.ink; x.lineWidth = 1.2; x.strokeRect(-74, -22, 148, 22);
    });
    this.blit(ctx, s, p.x, p.y);
    const m = G.S.mendel || {};
    const n = m.bed ? 8 : 0;
    for (let i = 0; i < n; i++) {
      const px = p.x - 62 + i * 17.5, py = p.y - 16, grown = m.bed === 'grown';
      const h = grown ? 30 : 10, sw = Math.sin(t * 1.5 + i) * 1.2;
      ctx.strokeStyle = '#8A6A3A'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + 4, py); ctx.lineTo(px + 4, py - 34); ctx.stroke();
      ctx.strokeStyle = '#5F8F3A'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 5, py - h / 2, px + sw, py - h); ctx.stroke();
      ctx.fillStyle = '#7FAA4A';
      for (let k = 1; k < (grown ? 5 : 2); k++) { U.ellipse(ctx, px + (k % 2 ? -4 : 4) + sw * k / 5, py - k * 6, 3.4, 2, k % 2 ? -0.6 : 0.6); ctx.fill(); }
      if (grown) {
        ctx.fillStyle = '#9CC46A'; U.ellipse(ctx, px + 5, py - 18, 2.4, 6, 0.3); ctx.fill(); ctx.strokeStyle = U.rgba(P.ink, 0.6); ctx.lineWidth = 0.7; ctx.stroke();
        if (season_(G.S) < 2) { ctx.fillStyle = '#F4F1EA'; ctx.beginPath(); ctx.arc(px - 3 + sw, py - h - 1, 2.4, 0, TAU); ctx.fill(); }
      }
    }
    function season_(S) { return S.season; }
  },
  p_mush(x, P, seed) {
    for (let i = 0; i < 4; i++) {
      const px = -16 + i * 11 + U.hash(i, 1, seed) * 5, h = 8 + U.hash(i, 2, seed) * 8, r = 5 + U.hash(i, 3, seed) * 4;
      x.fillStyle = '#EDE3CC'; x.fillRect(px - 1.5, -h, 3, h);
      x.fillStyle = i % 2 ? '#B5653E' : '#C89B45'; x.beginPath(); x.ellipse(px, -h, r, r * 0.6, 0, Math.PI, 0); x.fill();
      x.strokeStyle = P.ink; x.lineWidth = 1; x.stroke();
      x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(px - r * 0.3, -h - r * 0.3, 1, 0, TAU); x.fill();
    }
  },
  // the hot spring by the cave: a vent pool crusted with sulphur, its outflow striped by temperature down to the river
  p_hotspring(x, P) {
    const ch = [[-24, -14], [-50, -6], [-86, -3], [-122, -12], [-150, -26], [-172, -40]];
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.strokeStyle = '#CFC6B0'; x.lineWidth = 40; x.beginPath(); U.poly(x, ch.slice(0, 5), false); x.stroke();
    x.fillStyle = '#CFC6B0'; U.ellipse(x, 0, -22, 54, 34); x.fill();
    x.fillStyle = 'rgba(226,200,80,0.45)'; U.ellipse(x, 0, -22, 50, 30); x.fill();
    for (let i = 0, n = 40; i < n; i++) {
      const t = i / n, [ax, ay] = MX.along(ch, t), [bx, by] = MX.along(ch, (i + 1) / n);
      x.globalAlpha = t > 0.85 ? 1 - (t - 0.85) * 4 : 1;
      x.strokeStyle = SPRING.COL[SPRING.mat(SPRING.T(t))]; x.lineWidth = 14 + t * 10;
      x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
    }
    x.globalAlpha = 1; x.lineWidth = 1;
    for (let k = 0; k < 90; k++) {
      const t = U.hash(k, 1, 71) * 0.85, [sx, sy, a] = MX.along(ch, t), off = (U.hash(k, 2, 71) - 0.5) * (12 + t * 8), m = SPRING.mat(SPRING.T(t));
      x.strokeStyle = SPRING.STR[m][k % 2]; x.beginPath(); x.moveTo(sx - Math.sin(a) * off, sy + Math.cos(a) * off); x.lineTo(sx - Math.sin(a) * off + Math.cos(a) * 6, sy + Math.cos(a) * off + Math.sin(a) * 6); x.stroke();
    }
    x.fillStyle = '#E2CC5E'; U.ellipse(x, 0, -22, 40, 24); x.fill();
    x.fillStyle = '#FFF3A8'; for (let k = 0; k < 30; k++) { const a = U.hash(k, 3, 71) * TAU; U.ellipse(x, Math.cos(a) * 36, -22 + Math.sin(a) * 21, 1.6, 1); x.fill(); }
    const g = x.createRadialGradient(3, -20, 2, 0, -22, 32); g.addColorStop(0, '#0B2E4E'); g.addColorStop(0.5, '#15628A'); g.addColorStop(0.85, '#3AA4B4'); g.addColorStop(1, '#A8D4C4');
    x.fillStyle = g; U.ellipse(x, 0, -22, 32, 18); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.3)'; U.ellipse(x, -12, -30, 10, 3, -0.2); x.fill();
    U.ink(x, U.blob(0, -22, 40, 24, 16, 0.06, 5), { closed: true, w: 1.2, alpha: 0.6, seed: 8, amp: 0.8 });
  },
  _springBubbles(ctx, p, t) {
    ctx.save(); ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) { const k = (t * 0.6 + i * 0.27) % 1, a = i * 2.2; ctx.strokeStyle = `rgba(255,255,255,${(0.8 * (1 - k)).toFixed(2)})`; ctx.beginPath(); ctx.ellipse(p.x + Math.cos(a) * 14, p.y - 22 + Math.sin(a) * 8, 1.5 + k * 5, 1 + k * 3, 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
  },
  // the transect kit by the spring: a surveyor's stake, the probe with its dial, a clipboard on a flat stone
  p_thermokit(x, P) {
    this.shadow(x, 20, 5, 3);
    U.wash(x, U.blob(6, -4, 16, 7, 10, 0.15, 3), P.rock, { edge: 0.3, seed: 3 });
    x.save(); x.translate(6, -9); x.rotate(-0.15);
    x.fillStyle = '#F4EEDD'; x.fillRect(-8, -5, 16, 11); x.fillStyle = '#8A6A3A'; x.fillRect(-3, -6, 6, 2);
    x.strokeStyle = 'rgba(60,90,120,0.5)'; x.lineWidth = 0.5; for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(-6, -2 + k * 3); x.lineTo(6, -2 + k * 3); x.stroke(); }
    x.restore();
    x.fillStyle = '#E8E0CC'; x.fillRect(-14, -40, 4, 40); x.fillStyle = '#B03A2E'; x.fillRect(-14, -40, 4, 10); x.strokeStyle = P.ink; x.lineWidth = 0.9; x.strokeRect(-14, -40, 4, 40);
    x.strokeStyle = '#B8BCC0'; x.lineWidth = 2; x.beginPath(); x.moveTo(-4, 0); x.lineTo(-10, -30); x.stroke();
    x.fillStyle = '#2A2620'; x.beginPath(); x.arc(-11, -34, 5.5, 0, TAU); x.fill(); x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(-11, -34, 4, 0, TAU); x.fill();
    x.strokeStyle = '#A0322A'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(-11, -34); x.lineTo(-8.5, -36); x.stroke();
  },
  // the step test by the yayla hut: a wooden box, and a stool with the metronome and the finger clip
  p_steptest(x, P) {
    this.shadow(x, 30, 6, 3);
    x.fillStyle = '#A07848'; x.fillRect(-26, -16, 34, 16); x.fillStyle = '#C8986A'; x.fillRect(-26, -19, 34, 4);
    x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-26, -19, 34, 19);
    x.fillStyle = P.woodDark; x.fillRect(14, -14, 3, 14); x.fillRect(24, -14, 3, 14); x.fillStyle = P.wood; x.fillRect(12, -18, 18, 5);
    x.fillStyle = '#6E4A2E'; x.beginPath(); x.moveTo(15, -18); x.lineTo(18, -32); x.lineTo(22, -32); x.lineTo(25, -18); x.closePath(); x.fill();
    x.strokeStyle = '#2A2620'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(20, -20); x.lineTo(23, -31); x.stroke();
    x.fillStyle = '#2E6AA0'; x.fillRect(26, -22, 5, 4);
  },
  // the blood table: a hand-cranked centrifuge, a rack of capillary tubes and two stained slides
  p_bloodkit(x, P) {
    this.shadow(x, 34, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-28, -22, 3, 22); x.fillRect(25, -22, 3, 22);
    x.fillStyle = '#E8E4D8'; x.fillRect(-32, -28, 64, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-32, -28, 64, 7);
    x.fillStyle = '#8A9098'; U.ellipse(x, -14, -32, 10, 5); x.fill(); x.fillStyle = '#6E747C'; x.fillRect(-24, -32, 20, 4);
    x.strokeStyle = '#4A4E54'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(-14, -34); x.lineTo(-14, -42); x.lineTo(-6, -42); x.stroke();
    x.fillStyle = '#6B4A32'; x.fillRect(4, -34, 14, 6);
    for (let k = 0; k < 4; k++) { x.fillStyle = '#F4DC7E'; x.fillRect(6 + k * 3, -42, 1.6, 9); x.fillStyle = '#A8202A'; x.fillRect(6 + k * 3, -38, 1.6, 5); }
    x.fillStyle = 'rgba(236,246,250,0.9)'; x.fillRect(20, -31, 10, 3); x.fillStyle = '#C86A8A'; x.fillRect(23, -31, 4, 3);
  },
  // Songül's tomato bed: limp, pale plants on a white salt crust, or, after the fix, firm plants with red fruit and a drip line
  p_tomatobed(x, P, f) {
    this.shadow(x, 62, 7, 3);
    x.fillStyle = P.woodDark; x.fillRect(-60, -16, 120, 16); x.fillStyle = '#5A4230'; x.fillRect(-56, -14, 112, 9);
    x.strokeStyle = P.ink; x.lineWidth = 1.1; x.strokeRect(-60, -16, 120, 16);
    if (!f) { x.fillStyle = 'rgba(246,246,238,0.92)'; for (let k = 0; k < 16; k++) { U.ellipse(x, -52 + U.hash(k, 1, 7) * 104, -11 + U.hash(k, 2, 7) * 5, 3 + U.hash(k, 3, 7) * 5, 1.2); x.fill(); } }
    else { x.strokeStyle = '#2A2A2A'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(-56, -12); x.lineTo(56, -12); x.stroke(); }
    for (let i = 0; i < 5; i++) {
      const px = -44 + i * 22, py = -12, lean = f ? 0 : (i % 2 ? 5 : -4), h = f ? 36 : 26;
      x.strokeStyle = '#8A6A3A'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(px + 5, py); x.lineTo(px + 5, py - 40); x.stroke();
      x.strokeStyle = f ? '#4E8A36' : '#7A9A4A'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + lean * 0.3, py - h / 2, px + lean, py - h); x.stroke();
      for (let k = 1; k < 6; k++) {
        const side = k % 2 ? -1 : 1, lx = px + lean * k / 6, ly = py - k * h / 6;
        x.fillStyle = f ? '#4E8A36' : '#8AA456'; U.ellipse(x, lx + side * 5, ly + (f ? -1 : 3), 5, f ? 2.4 : 1.8, side * (f ? -0.5 : 0.9)); x.fill();
      }
      if (f) { const ty = py - 14 - (i % 2) * 7; x.fillStyle = '#C83A2E'; x.beginPath(); x.arc(px + 3, ty, 3.4, 0, TAU); x.fill(); x.fillStyle = 'rgba(255,255,255,0.5)'; x.beginPath(); x.arc(px + 2, ty - 1, 1, 0, TAU); x.fill(); }
    }
  },
  // the well: a cast-iron hand pump on a concrete block, and a bucket with a white ring where water dried
  p_handpump(x, P) {
    this.shadow(x, 16, 4, 2);
    x.fillStyle = '#A8A49A'; x.fillRect(-10, -8, 20, 8); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-10, -8, 20, 8);
    x.fillStyle = '#3E5A6A'; x.fillRect(-3, -40, 6, 32); x.strokeRect(-3, -40, 6, 32); x.fillRect(3, -33, 8, 3);
    x.strokeStyle = '#2E4450'; x.lineWidth = 2; x.beginPath(); x.moveTo(-1, -41); x.lineTo(-15, -50); x.stroke();
    x.fillStyle = '#2E4450'; x.beginPath(); x.arc(0, -42, 3, 0, TAU); x.fill();
    x.fillStyle = '#8A9098'; x.strokeStyle = P.ink; x.lineWidth = 0.8; x.beginPath(); x.moveTo(6, -13); x.lineTo(17, -13); x.lineTo(16, 0); x.lineTo(7, 0); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#F4F4EE'; x.fillRect(6.8, -11, 9.6, 1.5);
  },
  // the potato test: six little cups and a pocket scale on a garden table
  p_osmokit(x, P) {
    this.shadow(x, 34, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-28, -22, 3, 22); x.fillRect(25, -22, 3, 22);
    x.fillStyle = P.wood; x.fillRect(-32, -28, 64, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-32, -28, 64, 7);
    for (let i = 0; i < 6; i++) { x.fillStyle = i === 5 ? 'rgba(206,210,180,0.95)' : 'rgba(200,226,240,0.9)'; x.fillRect(-29 + i * 7, -36, 5, 8); x.strokeStyle = 'rgba(40,50,60,0.8)'; x.lineWidth = 0.6; x.strokeRect(-29 + i * 7, -36, 5, 8); }
    x.fillStyle = '#D8DCE0'; x.fillRect(14, -34, 14, 6); x.fillStyle = '#20302A'; x.fillRect(16, -32, 8, 3);
    x.fillStyle = '#C09A5A'; U.ellipse(x, 21, -36, 5, 2); x.fill();
  },
  // after the fix: a rain barrel under the gutter of Songül's house
  p_rainbarrel(x, P) {
    this.shadow(x, 14, 4, 2);
    x.fillStyle = '#3E6A8A'; x.fillRect(-11, -34, 22, 34); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-11, -34, 22, 34);
    x.strokeStyle = 'rgba(20,30,40,0.6)'; x.beginPath(); x.moveTo(-11, -24); x.lineTo(11, -24); x.moveTo(-11, -10); x.lineTo(11, -10); x.stroke();
    x.fillStyle = '#6E8AA0'; U.ellipse(x, 0, -34, 11, 3); x.fill(); x.strokeStyle = P.ink; x.stroke();
    x.fillStyle = '#8A9098'; x.fillRect(3, -62, 4, 28); x.strokeRect(3, -62, 4, 28);
  },
  // owl pellets: grey felted lumps with a bone showing here and there
  p_pellets(x, P) {
    for (const [px, py, r] of [[-11, -2, 5], [0, 1, 4], [10, -1, 4.6], [4, -5, 3.6]]) {
      x.fillStyle = '#6A625C'; U.ellipse(x, px, py, r * 1.5, r); x.fill();
      x.strokeStyle = 'rgba(40,36,32,0.7)'; x.lineWidth = 0.6; x.stroke();
      x.fillStyle = '#EDE6D6'; x.fillRect(px - 1, py - 1, 2.4, 0.9);
    }
  },
  // the pellet table: a black dissection tray, a pellet, forceps and the key card
  p_pelletkit(x, P) {
    this.shadow(x, 34, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-28, -22, 3, 22); x.fillRect(25, -22, 3, 22);
    x.fillStyle = P.wood; x.fillRect(-32, -28, 64, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-32, -28, 64, 7);
    x.fillStyle = '#1E1E22'; x.fillRect(-27, -33, 32, 6); x.fillStyle = '#6A625C'; U.ellipse(x, -11, -31, 7, 3); x.fill();
    x.fillStyle = '#EDE6D6'; x.fillRect(-21, -32, 3, 1); x.fillRect(-4, -31, 2, 1);
    x.strokeStyle = '#B8BCC0'; x.lineWidth = 1; x.beginPath(); x.moveTo(8, -30); x.lineTo(20, -34); x.stroke();
    x.fillStyle = '#F4EEDD'; x.fillRect(10, -31, 16, 3);
  },
  // after the case: a nest box on the barn wall
  p_owlbox(x, P) {
    x.fillStyle = '#8A6A44'; x.fillRect(-12, -70, 24, 26); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-12, -70, 24, 26);
    x.fillStyle = '#6E5234'; x.beginPath(); x.moveTo(-15, -70); x.lineTo(0, -80); x.lineTo(15, -70); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#1A1410'; x.beginPath(); x.arc(0, -58, 5.5, 0, TAU); x.fill();
    x.fillStyle = '#5A4230'; x.fillRect(-4, -48, 8, 2);
  },
  // the calorimeter table: a retort stand with a tin can, a cork with a needle, and Alp's snacks on a cloth
  p_calorkit(x, P) {
    this.shadow(x, 34, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-28, -22, 3, 22); x.fillRect(25, -22, 3, 22);
    x.fillStyle = P.wood; x.fillRect(-32, -28, 64, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-32, -28, 64, 7);
    x.fillStyle = '#3A3A3E'; x.fillRect(-26, -31, 12, 3); x.fillRect(-22, -56, 2, 26); x.fillRect(-22, -50, 12, 2);
    x.fillStyle = '#B8BCC0'; x.fillRect(-14, -50, 9, 11); x.strokeStyle = '#5A5E64'; x.lineWidth = 0.7; x.strokeRect(-14, -50, 9, 11);
    x.fillStyle = '#B08050'; x.fillRect(-12, -32, 5, 3);
    x.fillStyle = '#F2ECE0'; x.fillRect(2, -32, 24, 4);
    x.fillStyle = '#C89A5A'; x.beginPath(); x.arc(7, -33, 2, 0, TAU); x.fill(); x.fillStyle = '#E8A0B0'; x.fillRect(12, -35, 3, 3); x.fillStyle = '#E2B85A'; x.beginPath(); x.arc(19, -33, 1.5, 0, TAU); x.arc(22, -33, 1.5, 0, TAU); x.fill();
  },
  // Grandma's old brass microscope on a teahouse side table, slides and an iodine bottle beside it
  p_slidekit(x, P) {
    this.shadow(x, 30, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-24, -22, 3, 22); x.fillRect(21, -22, 3, 22);
    x.fillStyle = P.wood; x.fillRect(-28, -28, 56, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-28, -28, 56, 7);
    x.fillStyle = '#2A2A2E'; x.fillRect(-18, -32, 20, 4); x.fillRect(-12, -52, 4, 20);
    x.fillStyle = '#B8903A'; x.save(); x.translate(-6, -52); x.rotate(-0.35); x.fillRect(-3, -14, 7, 18); x.fillStyle = '#2A2A2E'; x.fillRect(-2, -18, 5, 5); x.restore();
    x.fillStyle = '#3A3A3E'; x.fillRect(-16, -40, 16, 2);
    x.fillStyle = 'rgba(210,230,236,0.85)'; x.fillRect(6, -31, 14, 3); x.fillRect(8, -33, 14, 2);
    x.fillStyle = '#5A3A1A'; x.fillRect(20, -38, 5, 9); x.fillStyle = '#2A2620'; x.fillRect(21, -41, 3, 3);
  },
  // Hüseyin Usta's grafting table: rootstocks in pots, a knife, a roll of tape
  p_graftkit(x, P) {
    this.shadow(x, 34, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-28, -22, 3, 22); x.fillRect(25, -22, 3, 22);
    x.fillStyle = P.wood; x.fillRect(-32, -28, 64, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-32, -28, 64, 7);
    for (const px of [-22, -8, 6]) {
      x.fillStyle = '#A8583A'; x.beginPath(); x.moveTo(px - 5, -40); x.lineTo(px + 5, -40); x.lineTo(px + 4, -29); x.lineTo(px - 4, -29); x.closePath(); x.fill();
      x.fillStyle = '#6E5A40'; x.fillRect(px - 1, -52, 2.4, 12);
    }
    x.fillStyle = '#C8D2BE'; x.beginPath(); x.arc(20, -32, 4, 0, TAU); x.fill(); x.fillStyle = '#8A948A'; x.beginPath(); x.arc(20, -32, 1.6, 0, TAU); x.fill();
    x.fillStyle = '#B8BCC0'; x.fillRect(12, -30, 12, 1.6); x.fillStyle = '#5A3A22'; x.fillRect(24, -30.4, 5, 2.4);
  },
  // Fatma Teyze's squash patch: a mulched bed, big lobed leaves and yellow flowers; odd warty fruit until the case is solved
  p_squashpatch(x, P, f) {
    this.shadow(x, 92, 10, 3);
    x.fillStyle = '#5A4230'; x.beginPath(); x.ellipse(0, -6, 92, 16, 0, 0, TAU); x.fill();
    x.fillStyle = 'rgba(214,184,110,0.6)'; for (let k = 0; k < 70; k++) { const a = U.hash(k, 1, 3) * TAU, d = U.hash(k, 2, 3); x.fillRect(Math.cos(a) * d * 86, -6 + Math.sin(a) * d * 14, 4, 1); }
    const R = MX.rng(55);
    for (let i = 0; i < 9; i++) SQUASH.leaf(x, R, -78 + i * 19.5 + (R() - 0.5) * 6, -16 - (i % 3) * 7, 13 + R() * 4, R() * 6, 0.6, i % 2);
    for (const [fx, fy] of [[-60, -30], [-18, -40], [30, -30], [66, -38]]) { SQUASH.bloom(x, R, fx, fy, 6.5, 0.8, R()); x.fillStyle = '#B8661A'; x.beginPath(); x.arc(fx, fy, 1.4, 0, TAU); x.fill(); }
    if (!f) { SQUASH.gourd(x, R, -38, -8, 6, 0); SQUASH.gourd(x, R, 48, -6, 5, 3); }
    else {
      for (const bx of [-18, 66]) { x.fillStyle = '#C8A06A'; x.fillRect(bx - 5, -46, 10, 2.4); x.fillStyle = '#F4EEDD'; x.fillRect(bx + 2, -38, 8, 5); x.strokeStyle = P.ink; x.lineWidth = 0.5; x.strokeRect(bx + 2, -38, 8, 5); }
      x.fillStyle = '#A8C476'; U.ellipse(x, -34, -8, 12, 5, -0.2); x.fill(); U.ellipse(x, 44, -6, 11, 4.6, 0.3); x.fill();
    }
  },
  // the neighbour's fence with ornamental gourds climbing it
  p_gourdfence(x, P) {
    this.shadow(x, 70, 6, 3);
    const R = MX.rng(66);
    for (let i = 0; i < 8; i++) { const px = -66 + i * 17.5; x.fillStyle = i % 2 ? '#9C927E' : '#8E8674'; x.fillRect(px, -56, 12, 56); x.beginPath(); x.moveTo(px, -56); x.lineTo(px + 6, -62); x.lineTo(px + 12, -56); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(px, -56, 12, 56); }
    x.fillStyle = '#6E6656'; x.fillRect(-70, -44, 142, 4); x.fillRect(-70, -16, 142, 4);
    for (let v = 0; v < 3; v++) { const p = MX.strand(R, -60 + v * 50, -2, -1.2, 70, 5, 0.9); MX.line(x, p, '#5E8034', 1.4); for (let k = 1; k < p.length; k += 2) SQUASH.leaf(x, R, p[k][0], p[k][1], 5 + R() * 3, R() * 6, 0.8, k % 2); }
    [[-50, -30, 5, 0], [-18, -20, 4.5, 1], [10, -38, 5.5, 3], [40, -24, 5, 2], [60, -40, 4, 0]].forEach(([gx, gy, gr, k]) => SQUASH.gourd(x, R, gx, gy, gr, k));
  },
  // Sevim's heap: wet grass slumped into a dark, glistening mound; once rescued, turned and full of straw
  p_sevimheap(x, P, f) {
    this.shadow(x, 30, 7, 3);
    const hill = [[-30, 0], [-24, -14], [-8, -22], [10, -20], [26, -10], [30, 0]];
    U.wash(x, hill, f ? '#5A4630' : '#2E3A1C', { edge: 0.35, seed: 7 });
    if (f) { x.strokeStyle = '#D8B870'; x.lineWidth = 1; for (let i = 0; i < 24; i++) { const px = -24 + U.hash(i, 1, 7) * 48, py = -16 + U.hash(i, 2, 7) * 14, a = U.hash(i, 3, 7) * 3; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * 5, py + Math.sin(a) * 2); x.stroke(); } }
    else {
      x.fillStyle = '#4A5A28'; for (let i = 0; i < 12; i++) { U.ellipse(x, -22 + U.hash(i, 4, 7) * 44, -16 + U.hash(i, 5, 7) * 12, 4, 1.6, U.hash(i, 6, 7)); x.fill(); }
      x.fillStyle = 'rgba(220,240,200,0.45)'; for (let i = 0; i < 7; i++) { U.ellipse(x, -18 + U.hash(i, 8, 7) * 36, -14 + U.hash(i, 9, 7) * 10, 2.4, 0.7, 0.2); x.fill(); }
      x.fillStyle = '#1A1A1A'; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(-12 + i * 8, -30 - (i % 2) * 5, 1, 0, TAU); x.fill(); }
    }
    U.ink(x, hill, { w: 1.2, seed: 7 });
  },
  // the compost bin: an open slatted box with a dial thermometer pushed into it, a fork and a bucket
  p_compostkit(x, P) {
    this.shadow(x, 32, 7, 3);
    x.fillStyle = '#3A2A1A'; x.fillRect(-24, -26, 48, 26);
    for (let y = -26; y < 0; y += 7) { x.fillStyle = P.wood; x.fillRect(-26, y, 52, 4.5); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(-26, y, 52, 4.5); }
    x.fillStyle = P.woodDark; x.fillRect(-27, -30, 3.5, 30); x.fillRect(23.5, -30, 3.5, 30);
    x.strokeStyle = '#8A9098'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(6, -26); x.lineTo(10, -40); x.stroke();
    x.fillStyle = '#F4F2EC'; x.beginPath(); x.arc(10, -43, 4.5, 0, TAU); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 0.7; x.stroke();
    x.strokeStyle = '#A0322A'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(10, -43); x.lineTo(12.5, -45); x.stroke();
    x.strokeStyle = '#8A6A44'; x.lineWidth = 2; x.beginPath(); x.moveTo(30, 0); x.lineTo(36, -40); x.stroke();
    x.fillStyle = '#6A7078'; for (const dx of [-3, 0, 3]) x.fillRect(29 + dx, -2, 1.2, 6);
    x.fillStyle = '#6A8AA0'; U.rr(x, -40, -12, 12, 12, 2); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 0.7; x.stroke();
  },
  // Osman Amca's plot: one variety, every stalk alike and every leaf striped yellow and orange
  p_rustplot(x, P, f) {
    this.shadow(x, 98, 10, 3);
    x.fillStyle = '#6A5236'; x.beginPath(); x.ellipse(0, -4, 98, 16, 0, 0, TAU); x.fill();
    const R = MX.rng(91);
    x.lineCap = 'round';
    for (let row = 0; row < 7; row++) {
      const y = -17 + row * 4, half = Math.sqrt(Math.max(0, 1 - ((y + 4) / 17) ** 2)) * 92;
      for (let px = -half + 2; px < half - 2; px += 5 + R() * 2) {
        const h = 30 + R() * 9, lean = 3 + (R() - 0.5) * 4, top = [px + lean, y - h];
        x.strokeStyle = R() < 0.6 ? '#B8A848' : '#A89C44'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(px, y); x.quadraticCurveTo(px + lean * 0.3, y - h * 0.6, top[0], top[1]); x.stroke();
        for (const s of [-1, 1]) {
          const ly = y - h * (0.3 + R() * 0.25), ex = px + s * (7 + R() * 4), ey = ly + 4 + R() * 3;
          x.strokeStyle = R() < 0.5 ? '#C8B444' : '#B4A640'; x.lineWidth = 1.8; x.beginPath(); x.moveTo(px + lean * 0.2, ly); x.quadraticCurveTo(px + s * 4, ly - 3, ex, ey); x.stroke();
          x.fillStyle = '#E0862A'; for (let q = 1; q < 4; q++) x.fillRect(px + (ex - px) * q / 4 - 0.5, ly + (ey - ly) * q / 4 - 1.6, 1.2, 1);
        }
        x.fillStyle = R() < 0.5 ? '#C8A858' : '#B89848'; x.beginPath(); x.ellipse(top[0], top[1], 1.8, 4.4, 0.1, 0, TAU); x.fill();
      }
      // an orange haze of spores over the stalks
      x.fillStyle = 'rgba(224,134,42,0.12)'; x.fillRect(-half, y - 30, half * 2, 14);
    }
    if (f) {
      x.fillStyle = '#8A6A44'; x.fillRect(58, -52, 2.4, 44);
      x.fillStyle = '#F4EEDD'; x.fillRect(46, -62, 28, 12); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(46, -62, 28, 12);
      x.fillStyle = '#3E6A3A'; x.font = '700 5px "Courier Prime", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(L(tr('GÜZE KARIŞIK', 'MIXED')), 60, -56);
    }
  },
  // the farmers' office wind table: two model fields and a little fan
  p_rustboard(x, P) {
    this.shadow(x, 34, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-28, -24, 3, 24); x.fillRect(25, -24, 3, 24);
    x.fillStyle = P.wood; x.fillRect(-32, -30, 64, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-32, -30, 64, 7);
    for (const [bx, rusty] of [[-28, 1], [2, 0]]) {
      x.fillStyle = '#6A5236'; x.fillRect(bx, -38, 26, 8);
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { x.fillStyle = rusty ? ((i + j) % 3 ? '#D89A3A' : '#C8B050') : ((i * 2 + j) % 5 ? '#6E9A3E' : '#D89A3A'); x.fillRect(bx + 2 + i * 4, -37 + j * 3.4, 2.4, 2.8); }
    }
    x.fillStyle = '#5A6070'; x.fillRect(-33, -50, 2, 12);
    x.strokeStyle = '#3A3E48'; x.lineWidth = 1; x.beginPath(); x.arc(-32, -52, 6, 0, TAU); x.stroke();
    x.fillStyle = '#9AA4B4'; for (let k = 0; k < 3; k++) { const a = k * TAU / 3; x.beginPath(); x.ellipse(-32 + Math.cos(a) * 3, -52 + Math.sin(a) * 3, 3, 1.4, a, 0, TAU); x.fill(); }
    x.fillStyle = P.woodDark; x.fillRect(14, -49, 1.4, 11);
    x.fillStyle = '#F4EEDD'; x.fillRect(4, -58, 22, 9); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(4, -58, 22, 9);
    x.fillStyle = '#A0322A'; x.fillRect(7, -55, 16, 1.2); x.fillRect(7, -52.5, 11, 1.2);
  },
  // the pollination table: paper bags, clothes pegs, a roll of tags and a soft brush
  p_pollkit(x, P) {
    this.shadow(x, 32, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-26, -22, 3, 22); x.fillRect(23, -22, 3, 22);
    x.fillStyle = P.wood; x.fillRect(-30, -28, 60, 7); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-30, -28, 60, 7);
    for (const [bx, hh] of [[-22, 14], [-12, 12]]) { x.fillStyle = '#D8C8A0'; x.fillRect(bx, -28 - hh, 9, hh); x.strokeStyle = 'rgba(80,60,30,0.6)'; x.lineWidth = 0.6; x.strokeRect(bx, -28 - hh, 9, hh); x.beginPath(); x.moveTo(bx, -25 - hh); x.lineTo(bx + 9, -25 - hh); x.stroke(); }
    for (let k = 0; k < 4; k++) { x.fillStyle = k % 2 ? '#C8A06A' : '#B8905A'; x.fillRect(2 + k * 4, -34, 2.4, 6); }
    x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(22, -32, 4, 0, TAU); x.fill(); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.stroke(); x.fillStyle = '#A0322A'; x.fillRect(20, -33, 4, 1.4);
    x.fillStyle = '#6A4A30'; x.fillRect(4, -30, 12, 1.6); x.fillStyle = '#E8C44A'; x.fillRect(15, -31, 4, 3.2);
  },
  // the storm-torn limb of the old apple tree, fruit still on it
  p_brokenlimb(x, P) {
    this.shadow(x, 48, 7, 3);
    x.strokeStyle = '#5A4230'; x.lineCap = 'round'; x.lineWidth = 7; x.beginPath(); x.moveTo(-46, -4); x.quadraticCurveTo(-4, -10, 42, -20); x.stroke();
    x.lineWidth = 3.4; for (const [a, b, c, d] of [[-14, -8, -6, -26], [8, -12, 20, -30], [26, -16, 44, -34]]) { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); }
    x.fillStyle = '#E4D2A4'; x.beginPath(); x.ellipse(-47, -4, 3, 4, 0, 0, TAU); x.fill();
    for (let k = 0; k < 16; k++) { const lx = -30 + (k * 37) % 80, ly = -18 - (k * 13) % 20; x.fillStyle = k % 3 ? P.leaf || '#6A8A3A' : P.leafDark || '#4E6A2A'; x.beginPath(); x.ellipse(lx, ly, 6, 3, (k % 5) - 2, 0, TAU); x.fill(); }
    for (const [ax, ay] of [[-10, -14], [14, -22], [34, -26], [-24, 2]]) { x.fillStyle = '#C8402A'; x.beginPath(); x.arc(ax, ay, 3.4, 0, TAU); x.fill(); }
  },
  // Ayten's insect count on the meadow road: a folding table, a white tray, jars, and a sweep net leaning on it
  // the clinic's anatomical heart model on its shelf: blue on one side, red on the other
  p_heartmodel(x, P) {
    x.fillStyle = '#6A4A30'; x.fillRect(-9, -27, 18, 3);
    x.fillStyle = '#B8963E'; x.fillRect(-1, -31, 2, 4);
    x.fillStyle = '#B04A44'; x.beginPath(); x.ellipse(0, -38, 8, 9.5, -0.5, 0, TAU); x.fill();
    x.fillStyle = '#E8A89C'; x.beginPath(); x.ellipse(-1, -37, 5, 6.5, -0.5, 0, TAU); x.fill();
    x.fillStyle = '#6A86C0'; x.beginPath(); x.ellipse(-3, -38, 2, 3, 0, 0, TAU); x.fill();
    x.lineCap = 'round'; x.strokeStyle = '#C83A32'; x.lineWidth = 3; x.beginPath(); x.moveTo(1, -45); x.quadraticCurveTo(2, -51, 7, -50); x.stroke();
    x.strokeStyle = '#5A78B8'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(-4, -45); x.lineTo(-5, -51); x.stroke();
  },
  p_table(x, P) {
    this.shadow(x, 28, 6, 2);
    x.fillStyle = P.woodDark; x.fillRect(-24, -16, 3, 16); x.fillRect(21, -16, 3, 16);
    x.fillStyle = P.wood; x.fillRect(-27, -21, 54, 5); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-27, -21, 54, 5);
  },
  p_yogurtkit(x, P) {
    this.p_table(x, P);
    for (let i = 0; i < 4; i++) {
      const cx = -20 + i * 11;
      x.fillStyle = 'rgba(210,230,240,0.85)'; x.fillRect(cx, -32, 8, 11);
      x.fillStyle = i === 2 ? '#F4EEDC' : '#FBFAF4'; x.fillRect(cx + 1, -29 + (i === 2 ? 0 : 2), 6, i === 2 ? 8 : 6);
      x.fillStyle = ['#C23A2C', '#2F68B4', '#3E8A4A', '#D6A02A'][i]; x.fillRect(cx - 0.5, -34, 9, 2.5);
      x.strokeStyle = P.ink; x.lineWidth = 0.7; x.strokeRect(cx, -32, 8, 11);
    }
    x.fillStyle = '#E8E4DA'; x.fillRect(21, -38, 2, 16); x.fillStyle = '#C23A2C'; x.fillRect(21, -28, 2, 6);
  },
  p_serakit(x, P) {
    this.p_table(x, P);
    x.strokeStyle = P.ink; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-22, -21); x.lineTo(-22, -48); x.lineTo(-6, -48); x.stroke();
    x.fillStyle = '#F4D24A'; x.beginPath(); x.arc(-4, -45, 4, 0, Math.PI * 2); x.fill();
    const w = ['#4A7AC8', '#6AA84A', '#D8B030'];
    for (let i = 0; i < 3; i++) {
      const cx = -14 + i * 13;
      x.fillStyle = w[i]; x.fillRect(cx + 1, -27, 9, 5);
      x.fillStyle = 'rgba(210,235,245,0.45)'; x.fillRect(cx, -36, 11, 15);
      x.strokeStyle = P.ink; x.lineWidth = 0.7; x.strokeRect(cx, -36, 11, 15);
      x.fillStyle = '#C23A2C'; x.fillRect(cx + 8, -34, 1.5, 10);
    }
    x.fillStyle = '#3E8A4A'; x.fillRect(12, -32, 2, 6); x.fillRect(10, -30, 2, 3);
  },
  p_hediyekit(x, P) {
    this.p_table(x, P);
    x.fillStyle = '#3F6A3A'; x.fillRect(-22, -38, 14, 17); x.fillStyle = '#D6B040'; x.fillRect(-22, -32, 14, 5);
    x.strokeStyle = P.ink; x.lineWidth = 0.8; x.strokeRect(-22, -38, 14, 17);
    x.fillStyle = '#F2D860'; x.fillRect(-3, -26, 10, 5); x.fillStyle = '#E8C23A'; x.fillRect(10, -33, 5, 12); x.fillStyle = '#A8C8E0'; x.fillRect(18, -33, 5, 12);
    x.strokeRect(10, -33, 5, 12); x.strokeRect(18, -33, 5, 12); x.strokeRect(-3, -26, 10, 5);
  },
  p_azotkit(x, P) {
    this.p_table(x, P);
    x.strokeStyle = '#6A4A2A'; x.lineWidth = 1; x.beginPath();
    x.moveTo(-10, -22); x.lineTo(-12, -30); x.moveTo(-10, -22); x.lineTo(-6, -29); x.moveTo(-10, -22); x.lineTo(-16, -26); x.stroke();
    x.fillStyle = '#3E8A4A'; x.beginPath(); x.ellipse(-10, -36, 5, 7, 0, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#E88AA0'; for (const [a, b] of [[-12, -29], [-7, -28], [-15, -26]]) { x.beginPath(); x.arc(a, b, 1.6, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#F6F0DC'; x.fillRect(2, -34, 16, 12); x.strokeStyle = P.ink; x.lineWidth = 0.7; x.strokeRect(2, -34, 16, 12);
    x.strokeStyle = '#2F68B4'; x.beginPath(); x.arc(10, -28, 4, 0, Math.PI * 1.7); x.stroke();
    x.fillStyle = '#8A8A8A'; x.fillRect(26, -46, 2, 30); x.fillStyle = '#6A6A6A'; x.fillRect(24, -18, 6, 8);
  },
  p_kulkit(x, P) {
    this.p_table(x, P);
    const ash = ['#9A9A92', '#E8E6E0', '#8A8680', '#FBFAF6'];
    for (let i = 0; i < 4; i++) { const cx = -22 + i * 10; x.fillStyle = '#D8D0C0'; x.fillRect(cx, -27, 8, 6); x.fillStyle = ash[i]; x.fillRect(cx + 1, -28, 6, 2); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(cx, -27, 8, 6); }
    const c = ['#F4F4F4', '#E8C23A', '#C23A2C'];
    for (let i = 0; i < 3; i++) { x.fillStyle = '#6A4A2A'; x.fillRect(19 + i * 3, -30, 2.5, 9); x.fillStyle = c[i]; x.fillRect(19 + i * 3, -33, 2.5, 3); }
  },
  p_zarkit(x, P) {
    this.p_table(x, P);
    x.fillStyle = '#A8C8E0'; x.fillRect(-26, -27, 26, 6); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(-26, -27, 26, 6);
    const c = ['rgba(240,236,240,0.9)', 'rgba(240,200,215,0.9)', 'rgba(200,40,74,0.9)', 'rgba(170,20,60,0.95)'];
    for (let i = 0; i < 4; i++) { const cx = -24 + i * 6; x.fillStyle = 'rgba(230,240,245,0.9)'; x.fillRect(cx, -38, 4, 13); x.fillStyle = c[i]; x.fillRect(cx, -32, 4, 7); x.strokeRect(cx, -38, 4, 13); }
    x.fillStyle = '#8A1A3A'; x.beginPath(); x.arc(14, -26, 6, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#3E8A4A'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(14, -32); x.lineTo(12, -39); x.moveTo(14, -32); x.lineTo(17, -38); x.stroke();
  },
  p_ekimkit(x, P) {
    this.p_table(x, P);
    const c = ['#D6A02A', '#C8A870', '#C23A2C', '#3E8A4A'];
    for (let i = 0; i < 4; i++) { x.fillStyle = '#F6F0DC'; x.fillRect(-22 + i * 9, -31, 7, 10); x.fillStyle = c[i]; x.fillRect(-21 + i * 9, -28, 5, 4); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(-22 + i * 9, -31, 7, 10); }
    x.fillStyle = '#7A4A2A'; x.fillRect(15, -30, 10, 9); x.fillStyle = '#F6F0DC'; x.fillRect(16, -29, 8, 7);
    x.strokeStyle = '#8A8478'; x.lineWidth = 0.5; for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(17, -27 + k * 2); x.lineTo(23, -27 + k * 2); x.stroke(); }
  },
  p_etilenkit(x, P) {
    this.p_table(x, P);
    for (let i = 0; i < 3; i++) { x.fillStyle = '#C8A870'; x.fillRect(-24 + i * 12, -33, 10, 12); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(-24 + i * 12, -33, 10, 12); }
    for (const [a, col] of [[-20, '#5E9A48'], [-8, '#D88A3A'], [4, '#C23A2C']]) { x.fillStyle = col; x.beginPath(); x.arc(a + 1, -35, 3.2, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#B8322A'; x.beginPath(); x.arc(20, -25, 4, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#5A3A1A'; x.lineWidth = 1; x.beginPath(); x.moveTo(20, -29); x.lineTo(21, -32); x.stroke();
  },
  p_sindirimkit(x, P) {
    this.p_table(x, P);
    x.fillStyle = '#A8C8E0'; x.fillRect(-26, -27, 22, 6); x.strokeStyle = P.ink; x.lineWidth = 0.6; x.strokeRect(-26, -27, 22, 6);
    const c = ['#E8DCA8', '#F4F0E0', '#F2D860', '#7AAA5A'];
    for (let i = 0; i < 4; i++) { const cx = -24 + i * 5; x.fillStyle = 'rgba(230,240,245,0.9)'; x.fillRect(cx, -38, 3.5, 13); x.fillStyle = c[i]; x.fillRect(cx, -31, 3.5, 6); x.strokeRect(cx, -38, 3.5, 13); }
    x.fillStyle = '#8A7A6A'; x.fillRect(4, -33, 20, 12); x.fillStyle = '#9CC8E0'; x.fillRect(6, -31, 16, 6);
    x.fillStyle = '#C23A2C'; x.font = '5px sans-serif'; x.fillText('37°', 8, -22.5);
  },
  p_kilcalkit(x, P) {
    this.p_table(x, P);
    x.fillStyle = 'rgba(142,195,230,0.8)'; x.fillRect(-24, -29, 18, 8); x.strokeStyle = '#5A6A72'; x.lineWidth = 0.8; x.strokeRect(-24, -34, 18, 13);
    x.strokeRect(-20, -46, 2, 20); x.strokeRect(-12, -42, 4, 16);
    x.fillStyle = '#2F68B4'; x.fillRect(-20, -40, 2, 11); x.fillRect(-12, -32, 4, 3);
    x.fillStyle = 'rgba(142,195,230,0.8)'; x.fillRect(6, -30, 10, 9); x.strokeRect(6, -30, 10, 9);
    x.strokeStyle = '#6AA84A'; x.lineWidth = 2; x.beginPath(); x.moveTo(11, -24); x.lineTo(13, -44); x.stroke();
    x.fillStyle = '#4A88C0'; x.beginPath(); x.ellipse(15, -45, 5, 3, -0.4, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#C8A850'; x.beginPath(); x.arc(22, -23, 3, 0, Math.PI * 2); x.fill();
  },
  p_notebook(x, P) {
    this.shadow(x, 20, 5, 2);
    x.fillStyle = P.woodDark; x.fillRect(-16, -14, 3, 14); x.fillRect(13, -14, 3, 14);
    x.fillStyle = P.wood; x.fillRect(-19, -19, 38, 5); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-19, -19, 38, 5);
    x.fillStyle = '#7A2E2A'; x.fillRect(-14, -24, 28, 5);
    x.fillStyle = '#F6F0DC'; x.fillRect(-13, -26, 12.5, 6); x.fillRect(0.5, -26, 12.5, 6);
    x.strokeStyle = '#8A8478'; x.lineWidth = 0.6; x.beginPath();
    for (let i = 0; i < 3; i++) { x.moveTo(-11, -24.5 + i * 1.6); x.lineTo(-2.5, -24.5 + i * 1.6); x.moveTo(2.5, -24.5 + i * 1.6); x.lineTo(11, -24.5 + i * 1.6); }
    x.stroke();
    x.strokeStyle = '#3A6A9A'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(8, -21); x.lineTo(15, -27); x.stroke();
  },
  p_sweepkit(x, P) {
    this.shadow(x, 32, 6, 3);
    x.fillStyle = P.woodDark; x.fillRect(-24, -20, 3, 20); x.fillRect(21, -20, 3, 20);
    x.fillStyle = P.wood; x.fillRect(-28, -26, 56, 6); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-28, -26, 56, 6);
    x.fillStyle = '#F4F2EC'; x.fillRect(-24, -31, 30, 5); x.strokeStyle = '#9A9A92'; x.lineWidth = 0.8; x.strokeRect(-24, -31, 30, 5);
    for (let k = 0; k < 7; k++) { x.fillStyle = ['#6A8A30', '#8A3A20', '#3A3A30'][k % 3]; x.fillRect(-21 + k * 3.8, -29.6 + (k % 2), 1.8, 1.3); }
    for (const jx of [10, 18]) { x.fillStyle = 'rgba(200,222,232,0.8)'; x.fillRect(jx, -36, 6, 10); x.fillStyle = '#C8A040'; x.fillRect(jx, -37.6, 6, 2); }
    x.strokeStyle = '#8A6A40'; x.lineWidth = 2; x.lineCap = 'round'; x.beginPath(); x.moveTo(34, 0); x.lineTo(16, -56); x.stroke();
    x.fillStyle = 'rgba(244,242,236,0.9)'; x.beginPath(); x.moveTo(3, -64); x.quadraticCurveTo(4, -42, 14, -38); x.quadraticCurveTo(24, -46, 23, -62); x.closePath(); x.fill();
    x.strokeStyle = '#5A5A58'; x.lineWidth = 1.6; x.beginPath(); x.ellipse(13, -63, 10, 4.5, -0.15, 0, TAU); x.stroke();
  },
  // the stork chick in a straw-lined box by the clinic door
  p_storkbox(x, P) {
    this.shadow(x, 22, 5, 3);
    x.fillStyle = '#B08858'; x.beginPath(); x.moveTo(-18, -22); x.lineTo(-25, -30); x.lineTo(-12, -30); x.lineTo(-7, -22); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(18, -22); x.lineTo(25, -30); x.lineTo(12, -30); x.lineTo(7, -22); x.closePath(); x.fill();
    x.fillStyle = '#F2F0EA'; x.beginPath(); x.ellipse(0, -24, 11, 7, 0, 0, TAU); x.fill();
    x.strokeStyle = '#F2F0EA'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(-2, -26); x.quadraticCurveTo(-4, -36, 2, -42); x.stroke();
    x.fillStyle = '#F6F4EE'; x.beginPath(); x.ellipse(3, -43, 5, 4.2, 0, 0, TAU); x.fill();
    x.fillStyle = '#26221E'; x.beginPath(); x.moveTo(7, -44.5); x.lineTo(18, -41); x.lineTo(7, -41.2); x.closePath(); x.fill();
    x.beginPath(); x.arc(4, -44.4, 0.9, 0, TAU); x.fill();
    x.fillStyle = '#C8A070'; x.fillRect(-18, -22, 36, 22); x.strokeStyle = P.ink; x.lineWidth = 1; x.strokeRect(-18, -22, 36, 22);
    x.strokeStyle = '#E0C870'; x.lineWidth = 1; for (let k = 0; k < 9; k++) { x.beginPath(); x.moveTo(-16 + k * 4, -21); x.lineTo(-13 + k * 4 + (k % 2) * 2, -26); x.stroke(); }
    x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(-18, -8, 36, 8);
  },
  p_cave(x, P, season) {
    U.wash(x, [[-80, 0], [-70, -60], [-30, -92], [30, -90], [72, -56], [80, 0]], P.rockDark, { edge: 0.4, seed: 3 });
    x.fillStyle = '#1E1C1A'; x.beginPath(); x.moveTo(-34, 0); x.bezierCurveTo(-36, -40, -16, -58, 0, -58); x.bezierCurveTo(16, -58, 36, -40, 34, 0); x.closePath(); x.fill();
    x.fillStyle = 'rgba(230,205,80,0.5)'; U.ellipse(x, 0, -4, 30, 6); x.fill();
    x.fillStyle = '#EFEDE4'; for (let i = 0; i < 12; i++) { U.ellipse(x, -24 + U.hash(i, 1, 4) * 48, -6 - U.hash(i, 2, 4) * 20, 5, 2); x.fill(); }
    U.ink(x, [[-34, 0], [-35, -38], [-16, -57], [16, -57], [35, -38], [34, 0]], { w: 1.8, seed: 5 });
    U.ink(x, [[-80, 0], [-70, -60], [-30, -92], [30, -90], [72, -56], [80, 0]], { w: 1.4, alpha: 0.7, seed: 6 });
    if (season === 3) { x.fillStyle = '#F6F7F2'; U.ellipse(x, 0, -86, 50, 8); x.fill(); }
  },
  p_rails(x, P) {
    x.fillStyle = '#8C8272'; x.fillRect(0, -18, 1100, 36);
    x.fillStyle = '#6B5A48'; for (let k = 0; k < 1100; k += 18) x.fillRect(k, -16, 8, 32);
    x.strokeStyle = '#4A4A4A'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, -9); x.lineTo(1100, -9); x.moveTo(0, 9); x.lineTo(1100, 9); x.stroke();
    x.fillStyle = '#CFC6B0'; x.fillRect(380, -48, 220, 24); x.strokeStyle = P.ink; x.lineWidth = 1.2; x.strokeRect(380, -48, 220, 24);
  },
  p_scarecrow(ctx, p, t, P) {
    const sw = Math.sin(t * 1.3) * 0.05;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(sw);
    ctx.fillStyle = 'rgba(40,48,30,0.22)'; U.ellipse(ctx, 6, 2, 14, 4); ctx.fill();
    ctx.strokeStyle = P.woodDark; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -54); ctx.moveTo(-22, -40); ctx.lineTo(22, -40); ctx.stroke();
    ctx.fillStyle = '#5E6E8A'; ctx.beginPath(); ctx.moveTo(-18, -42); ctx.lineTo(18, -42); ctx.lineTo(14, -18); ctx.lineTo(-14, -18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = P.ink; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#E9D8A8'; ctx.beginPath(); ctx.arc(0, -52, 8, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6B4A32'; ctx.beginPath(); ctx.ellipse(0, -58, 13, 4, 0, 0, TAU); ctx.fill(); ctx.fillRect(-7, -66, 14, 8);
    ctx.fillStyle = P.ink; ctx.fillRect(-4, -53, 2, 2); ctx.fillRect(2, -53, 2, 2);
    ctx.strokeStyle = '#D6B866'; ctx.lineWidth = 1; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 20, -40); ctx.lineTo(s * 26, -36); ctx.moveTo(s * 20, -40); ctx.lineTo(s * 25, -43); ctx.stroke(); }
    ctx.restore();
  },
  p_nest(ctx, p, t) {
    const hub = WORLD.buildings[0], a = 1 - 0.9 * (hub.fade || 0);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = '#6B5A3A'; U.ellipse(ctx, p.x + 2, p.y - 6, 22, 9); ctx.fill();
    ctx.strokeStyle = '#4A3A22'; ctx.lineWidth = 1.2;
    for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU; ctx.beginPath(); ctx.moveTo(p.x + 2 + Math.cos(a0) * 16, p.y - 6 + Math.sin(a0) * 6); ctx.lineTo(p.x + 2 + Math.cos(a0 + 0.5) * 24, p.y - 6 + Math.sin(a0 + 0.5) * 9); ctx.stroke(); }
    ctx.restore();
  },
  drawFence(ctx, f) {
    const P = this.pal();
    ctx.save();
    ctx.lineCap = 'round';
    const post = (x, y) => { ctx.fillStyle = P.woodDark; ctx.fillRect(x - 2.5, y - 20, 5, 22); ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.strokeRect(x - 2.5, y - 20, 5, 22); };
    if (!f.gate) {
      ctx.strokeStyle = P.wood; ctx.lineWidth = 3;
      for (const h of [15, 7]) { ctx.beginPath(); ctx.moveTo(f.a[0], f.a[1] - h); ctx.lineTo(f.b[0], f.b[1] - h); ctx.stroke(); }
      ctx.strokeStyle = U.rgba(P.ink, 0.6); ctx.lineWidth = 0.8;
      for (const h of [16.5, 8.5]) { ctx.beginPath(); ctx.moveTo(f.a[0], f.a[1] - h); ctx.lineTo(f.b[0], f.b[1] - h); ctx.stroke(); }
    } else {
      ctx.strokeStyle = P.woodLight; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(f.a[0], f.a[1] - 14); ctx.lineTo(f.a[0] - 18, f.a[1] - 2); ctx.moveTo(f.a[0], f.a[1] - 6); ctx.lineTo(f.a[0] - 18, f.a[1] + 5); ctx.stroke();
    }
    post(f.a[0], f.a[1]);
    ctx.restore();
  },
};
