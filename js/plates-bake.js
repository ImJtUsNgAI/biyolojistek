'use strict';
// Bakery plates: a loaf of dough cut through the middle, and a drop of the dough's water under the microscope.

// ================================================================ ×1 the dough, cut through
// Risen dough is a foam: CO₂ made by the yeast, blown into bubbles and held by stretched gluten films. Dough whose
// yeast has died stays a heavy, close slab with only a few pinholes of air from the kneading.
// spots: dense: dense dough (-40,30), gluten (84,-84) · risen: gas pockets (-38,-4), gluten (84,-84)
const DOUGH = {
  outline(up) {
    const rx = up ? 124 : 128, base = 78, H = up ? 172 : 96, pts = [];
    for (let i = 0; i <= 36; i++) { const a = Math.PI * i / 36; pts.push([-rx * Math.cos(a), base - H * Math.pow(Math.sin(a), up ? 0.62 : 0.4)]); }
    pts.push([rx * 0.94, base + 3], [0, base + 5], [-rx * 0.94, base + 3]);
    return pts;
  },
  // a bubble in the crumb is a hollow: its upper wall falls in shadow, its lower wall catches the light
  cell(o, x, y, rx, ry, a) {
    if (rx < 2.2) { o.fillStyle = 'rgba(140,112,70,0.75)'; o.beginPath(); o.ellipse(x, y, rx, ry, a, 0, TAU); o.fill(); return; }
    o.save(); o.translate(x, y); o.rotate(a);
    o.fillStyle = MX.lin(o, 0, -ry, 0, ry, [[0, '#8E7852'], [0.45, '#C4AE84'], [1, '#F4E8CA']]);
    o.beginPath(); o.ellipse(0, 0, rx, ry, 0, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(96,74,40,0.55)'; o.lineWidth = Math.min(0.9, rx * 0.12); o.beginPath(); o.ellipse(0, 0, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95); o.stroke();
    o.strokeStyle = 'rgba(255,250,232,0.85)'; o.lineWidth = Math.min(0.8, rx * 0.1); o.beginPath(); o.ellipse(0, 0, rx * 0.97, ry * 0.97, 0, Math.PI * 0.12, Math.PI * 0.88); o.stroke();
    o.restore();
  },
  // ×40: stretched gluten strands with starch granules caught in them, around the gas
  gluten(o, R, up) {
    o.fillStyle = '#E8D8B0'; o.fillRect(-60, -60, 120, 120);
    const holes = up ? [[-18, -14, 17], [20, 10, 13], [-8, 26, 9], [26, -24, 8], [-30, 18, 6]] : [[-14, -8, 2.6], [12, 14, 2], [20, -16, 1.6], [-22, 18, 1.8]];
    for (const [x, y, r] of holes) { o.fillStyle = MX.rad(o, x - r * 0.3, y - r * 0.35, r * 0.1, r, [[0, 'rgba(120,96,56,0.55)'], [0.7, 'rgba(170,140,90,0.35)'], [1, 'rgba(255,248,226,0.9)']]); o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill(); }
    for (let k = 0; k < (up ? 36 : 54); k++) {
      let x = (R() - 0.5) * 110, y = (R() - 0.5) * 110, a = R() * TAU;
      const h = holes.find(([hx, hy, r]) => Math.hypot(x - hx, y - hy) < r + 4);
      if (h && up) { a = Math.atan2(y - h[1], x - h[0]) + Math.PI / 2; }
      const s = MX.strand(R, x, y, a, 18 + R() * 26, 2.5, up ? 0.12 : 0.5);
      MX.line(o, s, 'rgba(196,160,78,0.42)', up ? 1.1 : 1.8);
      MX.line(o, s.map(([px, py]) => [px - 0.4, py - 0.5]), 'rgba(255,246,214,0.5)', 0.35);
    }
    for (let k = 0; k < 70; k++) {
      const x = (R() - 0.5) * 112, y = (R() - 0.5) * 112, r = 1.2 + R() * 2.4;
      if (holes.some(([hx, hy, hr]) => Math.hypot(x - hx, y - hy) < hr + r)) continue;
      o.save(); o.translate(x, y); o.rotate(R() * TAU);
      o.fillStyle = '#FBF7EA'; o.beginPath(); o.ellipse(0, 0, r, r * (0.55 + R() * 0.4), 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(140,120,80,0.6)'; o.lineWidth = 0.3; o.stroke();
      o.restore();
    }
  },
};
plate('dough', {
  key: st => st.risen ? 'r' : 'd',
  still(o, st) {
    const R = MX.rng(57), up = !!st.risen;
    // floured board
    MX.field(o, '#B48C5C', '#6E4C2C', 4, 0.01, 110);
    for (let i = 0; i < 22; i++) { const y = -140 + i * 13 + R() * 6; MX.line(o, [[-141, y], [-60, y + (R() - 0.5) * 4], [40, y + (R() - 0.5) * 4], [141, y + (R() - 0.5) * 3]], `rgba(70,44,20,${(0.12 + R() * 0.16).toFixed(2)})`, 0.5 + R() * 0.8); }
    MX.dots(o, R, 700, [-141, -141, 282, 282], 0.3, 1.1, 'rgba(250,246,234,0.45)');
    o.fillStyle = 'rgba(248,244,230,0.35)'; for (let i = 0; i < 8; i++) { o.beginPath(); o.ellipse((R() - 0.5) * 260, 90 + R() * 40, 20 + R() * 30, 4 + R() * 5, (R() - 0.5) * 0.3, 0, TAU); o.fill(); }
    const out = DOUGH.outline(up);
    o.fillStyle = 'rgba(40,24,10,0.38)'; o.beginPath(); o.ellipse(6, 82, up ? 128 : 132, 9, 0, 0, TAU); o.fill();
    // the cut face
    MX.fill(o, out, MX.lin(o, 0, up ? -96 : -18, 0, 82, [[0, '#F4E8CC'], [0.6, '#ECDDBB'], [1, '#D8C49A']]));
    o.save(); MX.path(o, out); o.clip();
    const lt = U.rgb('#FFF8E6'), dk = U.rgb('#B89A66');
    MX.tex(o, -130, up ? -98 : -20, 260, up ? 184 : 106, (x, y) => { const v = U.fbm(x * 0.06, y * 0.06, 3, 9); return v > 0.55 ? [dk[0], dk[1], dk[2], (v - 0.55) * 160] : [lt[0], lt[1], lt[2], (0.55 - v) * 90]; }, 200);
    MX.dots(o, R, 120, [-130, -100, 260, 190], 0.25, 0.6, 'rgba(120,80,40,0.5)');
    const cells = [];
    const fits = (x, y, r) => U.inPoly(x, y - r - 3, out) && U.inPoly(x, y + r + 3, out) && U.inPoly(x - r - 3, y, out) && U.inPoly(x + r + 3, y, out) && cells.every(c => Math.hypot(c[0] - x, c[1] - y) > c[2] + r + (up ? 1.2 : 3));
    if (up) {
      // the pocket the callout points at, then the rest of the foam: many small, a few large, stretched upward
      cells.push([-38, -4, 15]); DOUGH.cell(o, -38, -4, 13, 16.5, 0.1);
      for (let t = 0; t < 4000 && cells.length < 190; t++) {
        const x = (R() - 0.5) * 248, y = -100 + R() * 180, r = 1.4 + 12 * Math.pow(R(), 3.2);
        if (!fits(x, y, r)) continue;
        cells.push([x, y, r]);
        const st = 1 + 0.35 * U.clamp((60 - y) / 120, 0, 1);
        DOUGH.cell(o, x, y, r / Math.sqrt(st), r * Math.sqrt(st) * 1.05, (R() - 0.5) * 0.5);
      }
    } else {
      for (let t = 0; t < 2500 && cells.length < 95; t++) {
        const x = (R() - 0.5) * 252, y = -16 + R() * 92, r = 0.7 + 2.4 * Math.pow(R(), 2.2);
        if (!fits(x, y, r)) continue;
        cells.push([x, y, r]);
        DOUGH.cell(o, x, y, r * 1.2, r * 0.75, (R() - 0.5) * 0.3);
      }
    }
    // the bottom of a loaf is pressed flat and closer
    o.fillStyle = MX.lin(o, 0, 50, 0, 84, [[0, 'rgba(160,130,80,0)'], [1, 'rgba(150,120,70,0.35)']]); o.fillRect(-140, 50, 280, 36);
    o.restore();
    // the smooth skin over the top
    const skin = out.slice(0, 37);
    MX.line(o, skin, 'rgba(255,252,238,0.8)', 2.6);
    MX.line(o, out, 'rgba(96,70,36,0.65)', 0.9, true);
    MX.loupe(o, 84, -84, 42, up ? [44, -34] : [40, 18], '×40', x => DOUGH.gluten(x, R, up));
    MX.vignette(o, 0.14); MX.grain(o, 0.035);
    MX.scaleBar(o, 50, '5 cm');
  },
});

// ================================================================ ×400 a drop of dough water (wet mount)
// Baker's yeast (Saccharomyces cerevisiae): oval cells 5–8 µm long, many with buds; wheat starch granules, big
// lens-shaped A-granules and tiny round B-granules. With methylene blue, living cells turn the dye colourless and
// stay clear; dead cells cannot, and stain deep blue.
// spots: yeast cell (40,30), budding (-50,-44), flour starch (84,-72), methylene blue test (-66,66, stained only)
const YEAST = {
  cell(o, R, x, y, rx, ry, a, dead, stain, bud) {
    o.save(); o.translate(x, y); o.rotate(a);
    const blue = dead && stain;
    const body = (bx, by, brx, bry, seed) => {
      const pts = MX.blob(bx, by, brx, bry, { seed, wob: dead ? 0.1 : 0.025, n: 20 });
      o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = 0.8; o.beginPath(); MX.curve(o, MX.blob(bx, by, brx + 0.9, bry + 0.9, { seed, wob: dead ? 0.1 : 0.025, n: 20 })); o.stroke();
      o.fillStyle = blue ? MX.rad(o, bx - brx * 0.3, by - bry * 0.3, 0.3, brx * 1.1, [[0, '#6C88D2'], [0.6, '#2E4EA6'], [1, '#18307A']])
        : MX.rad(o, bx - brx * 0.3, by - bry * 0.3, 0.3, brx * 1.1, dead ? [[0, '#DCD8C8'], [1, '#B8B2A0']] : [[0, '#F6F5EE'], [0.7, '#E6E4DA'], [1, '#CFCEC4']]);
      o.beginPath(); MX.curve(o, pts); o.fill();
      o.strokeStyle = blue ? '#122466' : stain ? 'rgba(70,96,150,0.85)' : dead ? 'rgba(60,58,50,0.95)' : 'rgba(70,72,66,0.85)';
      o.lineWidth = dead ? 1.1 : 0.85; o.beginPath(); MX.curve(o, pts); o.stroke();
      return pts;
    };
    if (bud) {
      // the bud grows from one end of the mother cell
      const bx = rx + bud * 0.72;
      body(bx, 0, bud, bud * 0.88, 7);
      o.fillStyle = blue ? '#2E4EA6' : '#E6E4DA'; o.fillRect(rx - 1.6, -bud * 0.32, 2.2, bud * 0.64);
    }
    body(0, 0, rx, ry, 3);
    if (!dead) {
      // the vacuole, a clear space; a few granules in the cytoplasm
      o.fillStyle = stain ? 'rgba(238,244,252,0.9)' : 'rgba(252,253,250,0.9)'; o.beginPath(); o.ellipse(rx * 0.12, -ry * 0.05, rx * 0.42, ry * 0.45, 0.3, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(120,124,118,0.45)'; o.lineWidth = 0.35; o.stroke();
      o.fillStyle = 'rgba(80,82,74,0.5)'; for (let k = 0; k < 14; k++) { o.beginPath(); o.arc((R() - 0.7) * rx * 0.9, (R() - 0.5) * ry * 1.1, 0.2 + R() * 0.3, 0, TAU); o.fill(); }
      // a refractile lipid droplet, and on older mothers the ring-shaped scar left by an earlier bud
      o.fillStyle = 'rgba(255,255,244,0.9)'; o.beginPath(); o.arc(-rx * 0.5, ry * 0.3, 0.8, 0, TAU); o.fill(); o.strokeStyle = 'rgba(60,60,52,0.6)'; o.lineWidth = 0.3; o.stroke();
      if (R() < 0.4) { o.strokeStyle = 'rgba(90,92,84,0.55)'; o.lineWidth = 0.35; o.beginPath(); o.ellipse(-rx * 0.9, 0, 0.7, 1.4, 0, 0, TAU); o.stroke(); }
    } else {
      o.fillStyle = blue ? 'rgba(10,20,70,0.6)' : 'rgba(70,64,50,0.6)'; for (let k = 0; k < 9; k++) { o.beginPath(); o.arc((R() - 0.5) * rx * 1.3, (R() - 0.5) * ry * 1.2, 0.3 + R() * 0.45, 0, TAU); o.fill(); }
    }
    o.fillStyle = 'rgba(255,255,255,0.45)'; o.beginPath(); o.ellipse(-rx * 0.4, -ry * 0.45, rx * 0.22, ry * 0.14, -0.5, 0, TAU); o.fill();
    o.restore();
  },
  // a wheat A-granule, face on: a flat lens with a bright rim, sometimes the equatorial groove seen edge on
  granule(o, x, y, r, a, edge) {
    o.save(); o.translate(x, y); o.rotate(a);
    const ry = edge ? r * 0.38 : r * 0.94;
    o.strokeStyle = 'rgba(255,255,255,0.8)'; o.lineWidth = 1; o.beginPath(); o.ellipse(0, 0, r + 1, ry + 1, 0, 0, TAU); o.stroke();
    o.fillStyle = MX.rad(o, -r * 0.25, -ry * 0.3, 0.5, r, [[0, '#FAFAF4'], [0.75, '#E8E8DE'], [1, '#C8C8BC']]);
    o.beginPath(); o.ellipse(0, 0, r, ry, 0, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(90,92,86,0.7)'; o.lineWidth = 0.8; o.stroke();
    if (edge) { o.strokeStyle = 'rgba(110,110,100,0.55)'; o.lineWidth = 0.5; o.beginPath(); o.moveTo(-r * 0.85, 0); o.lineTo(r * 0.85, 0); o.stroke(); }
    else { o.strokeStyle = 'rgba(150,150,140,0.3)'; o.lineWidth = 0.4; for (const k of [0.45, 0.72]) { o.beginPath(); o.ellipse(0, 0, r * k, ry * k, 0, 0, TAU); o.stroke(); } }
    o.restore();
  },
};
plate('yeast', {
  key: st => (st.yeastDead ? 'x' : 'o') + (st.stain ? 's' : ''),
  still(o, st) {
    const R = MX.rng(64), dead = !!st.yeastDead, sn = !!st.stain;
    if (sn) MX.field(o, '#D2DEEE', '#98AED0', 6, 0.014, 70); else MX.field(o, '#E2E6E2', '#AEB9BC', 6, 0.014, 70);
    // out of focus: things drifting above and below the focal plane
    MX.layer(o, x => { MX.dots(x, R, 26, [-140, -140, 280, 280], 3, 8, sn ? 'rgba(60,90,160,0.18)' : 'rgba(90,96,90,0.18)'); }, 3);
    const taken = [[84, -72, 30], [40, 30, 16], [-50, -44, 20], [-66, 64, 20]];
    const free = (x, y, r) => Math.abs(x) < 134 - r && Math.abs(y) < 134 - r && !(x < -96 && y > 100) && taken.every(([tx, ty, tr]) => Math.hypot(tx - x, ty - y) > tr + r + 3);
    // small round B-granules of starch
    for (let k = 0, n = 0; k < 900 && n < 70; k++) {
      const x = (R() - 0.5) * 270, y = (R() - 0.5) * 270, r = 1.2 + R() * 2.2;
      if (!free(x, y, r)) continue;
      n++; taken.push([x, y, r]);
      o.fillStyle = '#F2F2EA'; o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill(); o.strokeStyle = 'rgba(96,98,92,0.6)'; o.lineWidth = 0.45; o.stroke();
    }
    // big lens-shaped A-granules
    YEAST.granule(o, 84, -72, 24, 0.3, false);
    for (let k = 0, n = 0; k < 400 && n < 6; k++) {
      const x = (R() - 0.5) * 250, y = (R() - 0.5) * 250, r = 12 + R() * 11;
      if (!free(x, y, r)) continue;
      n++; taken.push([x, y, r]); YEAST.granule(o, x, y, r, R() * TAU, R() < 0.3);
    }
    // the yeast: mostly dead in the baker's scalded batch, healthy and budding in the new one. A wet mount is
    // deeper than the focal plane, so about one cell in five floats above or below it and shows soft
    const cells = [];
    for (let k = 0, n = 0; k < 2000 && n < 64; k++) {
      const x = (R() - 0.5) * 262, y = (R() - 0.5) * 262, rx = 6.5 + R() * 3, a = R() * TAU, isDead = R() < (dead ? 0.8 : 0.06);
      const bud = !isDead && R() < (dead ? 0.25 : 0.45) ? rx * (0.35 + R() * 0.35) : 0;
      if (!free(x, y, rx + (bud ? bud * 1.6 : 0))) continue;
      n++; taken.push([x, y, rx + (bud ? bud * 1.6 : 0)]);
      cells.push([x, y, isDead ? rx * 0.9 : rx, (isDead ? rx * 0.9 : rx) * (0.78 + R() * 0.1), a, isDead, sn, bud, R() < 0.2]);
    }
    MX.layer(o, x => { for (const c of cells) if (c[8]) YEAST.cell(x, R, ...c.slice(0, 8)); }, 1.6, 0.85);
    for (const c of cells) if (!c[8]) YEAST.cell(o, R, ...c.slice(0, 8));
    // the cells the callouts point at
    YEAST.cell(o, R, 40, 30, 9.5, 8, 0.5, false, sn, 0);
    YEAST.cell(o, R, -54, -46, 9, 7.4, 0.35, false, sn, 5.4);
    [[-72, 66, 0.2], [-58, 72, 1.3], [-66, 56, 2.2]].forEach(([x, y, a], i) => YEAST.cell(o, R, x, y, 7.6, 6.2, a, dead || i === 1, sn, 0));
    MX.vignette(o, 0.12); MX.grain(o, 0.04);
    MX.scaleBar(o, 25, '10 µm');
  },
});
