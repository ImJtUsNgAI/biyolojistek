'use strict';
// Trail-food plates: Alp's snacks on a cloth, a walnut's seed-leaf cells (stainable with Sudan III on the table),
// and the muscle that will burn them, under the electron microscope.

// ================================================================ ×1 the snacks on a cloth
// spots: walnut (-62,-44), lokum (62,-50), leblebi (-56,62), bread (64,58)
plate('snack', {
  still(o) {
    const R = MX.rng(606);
    // a gingham cotton cloth: fine weave, red checks where the stripes cross darker, two soft folds
    o.fillStyle = '#F2ECDD'; o.fillRect(-141, -141, 282, 282);
    for (let k = -141; k < 141; k += 1.3) { o.fillStyle = `rgba(150,130,100,${(0.05 + R() * 0.06).toFixed(3)})`; o.fillRect(-141, k, 282, 0.45); o.fillRect(k, -141, 0.45, 282); }
    for (let k = -141; k < 141; k += 26) { o.fillStyle = 'rgba(184,52,46,0.34)'; o.fillRect(k, -141, 13, 282); o.fillRect(-141, k, 282, 13); }
    for (let k = -141; k < 141; k += 26) for (let j = -141; j < 141; j += 1.3) { o.fillStyle = 'rgba(255,250,240,0.12)'; o.fillRect(k, j, 13, 0.4); }
    MX.layer(o, x => {
      for (const [x0, y0, x1, y1] of [[-150, -30, 150, -100], [-60, 150, 40, -150]]) {
        x.strokeStyle = 'rgba(255,255,250,0.45)'; x.lineWidth = 10; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
        x.strokeStyle = 'rgba(80,60,40,0.22)'; x.lineWidth = 7; x.beginPath(); x.moveTo(x0 + 7, y0 + 5); x.lineTo(x1 + 7, y1 + 5); x.stroke();
      }
    }, 5);
    // soft shadows under everything
    MX.layer(o, x => {
      x.fillStyle = 'rgba(40,26,14,0.5)';
      for (const [cx, cy, rx, ry] of [[-60, -38, 28, 20], [-82, -12, 26, 20], [-36, -12, 26, 20], [66, -44, 20, 16], [96, -24, 16, 14], [44, -18, 16, 14], [90, -64, 16, 14], [-54, 68, 34, 26], [68, 64, 48, 36], [-8, 108, 14, 10], [18, 114, 14, 10]]) { x.beginPath(); x.ellipse(cx + 3, cy + 5, rx, ry, 0, 0, TAU); x.fill(); }
    }, 3.5);
    // walnut halves: a woody half-shell holding the wrinkled, two-lobed kernel with its brown skin
    for (const [cx, cy, a, sd] of [[-62, -44, -0.3, 1], [-84, -18, 0.5, 2], [-38, -18, 2.2, 3]]) {
      o.save(); o.translate(cx, cy); o.rotate(a);
      const shell = MX.blob(0, 0, 25, 20, { wob: 0.05, seed: 4 + sd });
      MX.fill(o, shell, MX.lin(o, -25, -20, 25, 20, [[0, '#A07A4E'], [0.5, '#7E5A36'], [1, '#5A3E22']]));
      for (let k = 0; k < 18; k++) { const t = k / 18 * TAU; MX.line(o, [[Math.cos(t) * 21, Math.sin(t) * 16.5], [Math.cos(t + 0.12) * 24.4, Math.sin(t + 0.12) * 19.6]], 'rgba(60,36,16,0.6)', 0.6); }
      MX.line(o, shell, 'rgba(50,30,14,0.8)', 0.8, true);
      for (const sgn of [-1, 1]) {
        const lobe = MX.blob(sgn * 10.5, 0, 11.4, 16, { wob: 0.18, n: 26, seed: 7 + sgn + sd * 3, fq: 4.5 });
        MX.fill(o, lobe, MX.rad(o, sgn * 8, -5, 1, 17, [[0, '#E2BE84'], [0.55, '#C4945A'], [1, '#8A5E32']]));
        o.save(); MX.path(o, lobe); o.clip();
        for (let k = 0; k < 9; k++) {
          const p = MX.strand(R, sgn * (3 + R() * 16), -16 + k * 4 + R() * 2, (R() - 0.5) * 1.2 + (sgn > 0 ? 0 : Math.PI), 14 + R() * 8, 1.6, 0.7);
          MX.line(o, p, 'rgba(96,56,24,0.75)', 0.9); MX.line(o, p.map(q => [q[0] - 0.5, q[1] - 0.6]), 'rgba(250,226,180,0.45)', 0.45);
        }
        o.restore();
        MX.line(o, lobe, 'rgba(100,62,28,0.8)', 0.6, true);
      }
      MX.fill(o, [[-1.4, -17], [1.4, -17], [1.2, 17], [-1.2, 17]], '#6E4A28');
      o.restore();
    }
    // lokum: soft cubes, rose and plain, a little translucent, dusted with powdered sugar
    for (const [cx, cy, col, a] of [[62, -50, '#E6A0B2', 0.2], [92, -30, '#F2EAD4', -0.3], [40, -24, '#E6A0B2', 0.6], [86, -70, '#F2EAD4', 0.1]]) {
      o.save(); o.translate(cx, cy); o.rotate(a);
      const top = [[-11, -12], [11, -12], [13, -1], [-9, -1]], side = [[-9, -1], [13, -1], [13, 10], [-9, 10]], end = [[11, -12], [13, -1], [13, 10], [11.5, -1.5]];
      MX.fill(o, MX.soft(side, 0.12), MX.lin(o, 0, -1, 0, 10, [[0, U.shade(col, -0.06)], [1, U.shade(col, -0.28)]]));
      MX.fill(o, MX.soft(end, 0.15), U.shade(col, -0.18));
      MX.fill(o, MX.soft(top, 0.12), MX.lin(o, -11, -12, 13, -1, [[0, U.shade(col, 0.12)], [1, col]]));
      o.fillStyle = 'rgba(255,255,255,0.85)'; for (let k = 0; k < 90; k++) { const u = R(), v = R(); o.fillRect(-11 + u * 22 + v * 2, -12 + v * 11, 0.7, 0.7); }
      o.fillStyle = 'rgba(255,255,255,0.55)'; for (let k = 0; k < 30; k++) o.fillRect(-9 + R() * 22, -1 + R() * 11, 0.6, 0.6);
      o.fillStyle = 'rgba(255,255,255,0.35)'; o.fillRect(-9, 1, 20, 1.2);
      o.restore();
    }
    // leblebi: roasted chickpeas, cream-yellow and a little wrinkled, each with its small beak
    for (let k = 0; k < 17; k++) {
      const a = k * 2.4, r = 5 + (k % 5) * 5, cx = -56 + Math.cos(a) * r, cy = 62 + Math.sin(a) * r * 0.8, sz = 5.6 + R() * 1.2;
      const pea = MX.blob(cx, cy, sz, sz * 0.94, { wob: 0.1, seed: k + 20, fq: 3 });
      MX.fill(o, pea, MX.lit(o, cx, cy, sz * 1.1, '#E4BE72', 0.4, 0.45));
      o.save(); MX.path(o, pea); o.clip();
      for (let q = 0; q < 3; q++) MX.line(o, MX.strand(R, cx + (R() - 0.5) * sz, cy + (R() - 0.5) * sz, R() * 6, sz, 1, 0.8), 'rgba(150,100,40,0.45)', 0.5);
      o.fillStyle = 'rgba(160,90,30,0.25)'; o.beginPath(); o.arc(cx + sz * 0.3, cy + sz * 0.3, sz * 0.5, 0, TAU); o.fill();
      o.restore();
      const bx = cx + Math.cos(a) * sz * 0.8, by = cy + Math.sin(a) * sz * 0.8;
      MX.fill(o, [[bx - Math.sin(a) * 1.6, by + Math.cos(a) * 1.6], [bx + Math.cos(a) * 2.6, by + Math.sin(a) * 2.6], [bx + Math.sin(a) * 1.6, by - Math.cos(a) * 1.6]], '#C89A4E');
    }
    // a slice of village bread: a dark crust and an open, holey crumb
    const br = MX.blob(64, 58, 44, 34, { wob: 0.06, seed: 12, rot: 0.2 }), crumb = MX.blob(64, 58, 38.5, 28.5, { wob: 0.07, seed: 13, rot: 0.2 });
    MX.fill(o, br, MX.lin(o, 20, 24, 108, 92, [[0, '#A8642A'], [0.5, '#7A4618'], [1, '#5A3010']]));
    MX.fill(o, crumb, MX.rad(o, 58, 52, 4, 44, [[0, '#F2E2BA'], [1, '#E0C890']]));
    o.save(); MX.path(o, crumb); o.clip();
    for (let k = 0; k < 110; k++) {
      const x = 26 + R() * 76, y = 30 + R() * 56, rx = 0.8 + R() * R() * 5, ry = rx * (0.6 + R() * 0.4), rot = R() * 3;
      o.fillStyle = 'rgba(150,110,60,0.55)'; o.beginPath(); o.ellipse(x, y, rx, ry, rot, 0, TAU); o.fill();
      o.fillStyle = 'rgba(255,248,226,0.5)'; o.beginPath(); o.ellipse(x - rx * 0.25, y + ry * 0.35, rx * 0.8, ry * 0.5, rot, 0, TAU); o.fill();
    }
    MX.dots(o, R, 40, [26, 30, 76, 56], 0.3, 0.7, 'rgba(255,255,250,0.8)');
    o.restore();
    MX.line(o, crumb, 'rgba(120,70,30,0.5)', 0.7, true);
    // dried apricots: glossy, wrinkled orange
    for (const [cx, cy] of [[-10, 104], [16, 110]]) {
      const ap = MX.blob(cx, cy, 12, 9, { wob: 0.22, n: 22, seed: cx + 40 });
      MX.fill(o, ap, MX.lit(o, cx, cy, 12, '#DC7428', 0.35, 0.45));
      o.save(); MX.path(o, ap); o.clip();
      for (let q = 0; q < 6; q++) MX.line(o, MX.strand(R, cx + (R() - 0.5) * 16, cy + (R() - 0.5) * 10, R() * 6, 10, 1.5, 0.6), 'rgba(140,50,10,0.55)', 0.7);
      o.fillStyle = 'rgba(255,230,190,0.55)'; o.beginPath(); o.ellipse(cx - 4, cy - 3, 4, 1.8, -0.4, 0, TAU); o.fill();
      o.restore();
    }
    MX.vignette(o, 0.16); MX.grain(o, 0.04);
    MX.scaleBar(o, 36, '2 cm');
  },
});

// ================================================================ ×400 walnut seed-leaf cells, stainable with Sudan III
// Thin-walled cells stuffed with oil bodies and a few grey protein bodies. Unstained the oil is pale yellow; the
// Sudan III drop on the study table (st.stain) turns every oil body orange-red.
// spots: oil body (-20,10), protein body (NUTCELL.protein), stain (40,-60)
const NUTCELL = {
  protein: [74, 58],
  BOUND: [[-160, -160], [160, -160], [160, 160], [-160, 160]],
  sites() { const R = MX.rng(5151); return MX.relax(MX.scatter(R, 30, 40, [-160, -160, 320, 320]), this.BOUND, 2); },
};
plate('nutcell', {
  key: st => st.stain ? 1 : 0,
  still(o, st) {
    const R = MX.rng(5252), red = !!st.stain;
    o.fillStyle = red ? '#F6E8E0' : '#F4F0DC'; o.fillRect(-141, -141, 282, 282);
    const cells = MX.voronoi(NUTCELL.sites(), NUTCELL.BOUND);
    for (const c of cells) {
      if (!c || c.length < 3) continue;
      const inner = MX.inset(c, 2.4);
      if (!inner || inner.length < 3) continue;
      MX.fill(o, MX.soft(inner, 0.2), red ? '#F2DCD0' : '#EFE8C8');
      // oil bodies of many sizes packed into the cell
      o.save(); MX.path(o, MX.soft(inner, 0.2)); o.clip();
      const [cx, cy] = MX.centroid(c);
      for (let k = 0; k < 46; k++) {
        const x = cx + (R() - 0.5) * 70, y = cy + (R() - 0.5) * 70, r = 1.8 + R() * 4.2;
        o.fillStyle = red ? MX.rad(o, x - r * 0.3, y - r * 0.3, 0, r, [[0, '#FF9A6A'], [1, '#D8341E']]) : MX.rad(o, x - r * 0.3, y - r * 0.3, 0, r, [[0, '#FFFBEA'], [1, '#E8DCA0']]);
        o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
        o.strokeStyle = red ? 'rgba(140,30,20,0.4)' : 'rgba(150,130,70,0.45)'; o.lineWidth = 0.4; o.stroke();
      }
      o.restore();
      MX.line(o, MX.soft(inner, 0.2), 'rgba(120,100,70,0.75)', 1.2, true);
    }
    // a few protein bodies: grey, granular; one of them fixed for the callout
    for (const [x, y] of [NUTCELL.protein, [-80, -70], [20, 96], [-104, 60]]) {
      o.fillStyle = 'rgba(150,146,140,0.95)'; o.beginPath(); o.arc(x, y, 7, 0, TAU); o.fill();
      for (let k = 0; k < 10; k++) { o.fillStyle = 'rgba(90,86,80,0.6)'; o.beginPath(); o.arc(x + (R() - 0.5) * 9, y + (R() - 0.5) * 9, 0.9, 0, TAU); o.fill(); }
      o.strokeStyle = 'rgba(70,66,60,0.8)'; o.lineWidth = 0.6; o.beginPath(); o.arc(x, y, 7, 0, TAU); o.stroke();
    }
    // the oil body the callout points at
    o.fillStyle = red ? MX.rad(o, -22, 8, 0, 7, [[0, '#FF9A6A'], [1, '#D8341E']]) : MX.rad(o, -22, 8, 0, 7, [[0, '#FFFBEA'], [1, '#E8DCA0']]);
    o.beginPath(); o.arc(-20, 10, 6.5, 0, TAU); o.fill(); o.strokeStyle = red ? 'rgba(140,30,20,0.6)' : 'rgba(150,130,70,0.6)'; o.lineWidth = 0.6; o.stroke();
    MX.vignette(o, 0.12, red ? '60,20,10' : '40,36,20'); MX.grain(o, 0.03);
    MX.scaleBar(o, 32, '20 µm');
  },
});

// ================================================================ ×20000 skeletal muscle, transmission electron microscope
// Myofibrils run across the plate, striped into sarcomeres by dark Z lines. Between them, rows of mitochondria
// with folded inner membranes (cristae), black glycogen granules and a lipid droplet: the fuel beside the furnace.
// spots: sarcomere (36,-100), mitochondrion (-48,-10), cristae (-18,-10), glycogen MUSCLE.gly, lipid MUSCLE.lip
const MUSCLE = {
  ROWS: [-100, -40, 20, 80], ZX: 72, mito: [-30, -10], lip: [84, 50], gly: [-86, 50],
};
plate('muscle', {
  still(o) {
    const R = MX.rng(7373);
    o.fillStyle = '#C8C8C4'; o.fillRect(-141, -141, 282, 282);
    // myofibrils: bands of A (dark), I (light), Z lines, M line
    for (const ry of MUSCLE.ROWS) {
      const y0 = ry - 22, h = 44;
      o.fillStyle = '#B4B4AE'; o.fillRect(-141, y0, 282, h);
      for (let zx = -144 - MUSCLE.ZX; zx < 150; zx += MUSCLE.ZX) {
        o.fillStyle = '#6E6E6A'; o.fillRect(zx + 14, y0, MUSCLE.ZX - 28, h);
        o.fillStyle = '#8A8A84'; o.fillRect(zx + MUSCLE.ZX / 2 - 8, y0, 16, h);
        o.fillStyle = '#5E5E5A'; o.fillRect(zx + MUSCLE.ZX / 2 - 1, y0, 2, h);
        o.fillStyle = '#1E1E1C'; o.fillRect(zx - 1.4, y0, 2.8, h);
      }
      for (let k = 0; k < 220; k++) { o.fillStyle = 'rgba(40,40,38,0.25)'; o.fillRect(-141 + R() * 282, y0 + R() * h, 2.2, 0.5); }
    }
    // the gaps between myofibrils: mitochondria in rows, glycogen granules, a lipid droplet
    for (const gy of [-70, -10, 50, 110]) {
      o.fillStyle = '#D8D8D2'; o.fillRect(-141, gy - 8, 282, 16);
      for (let mx = -130 + (gy % 3) * 8; mx < 140; mx += 56 + R() * 14) {
        if ((gy === MUSCLE.mito[1] && Math.abs(mx - MUSCLE.mito[0]) < 52) || (gy === MUSCLE.lip[1] && Math.abs(mx - MUSCLE.lip[0]) < 30) || (gy === MUSCLE.gly[1] && Math.abs(mx - MUSCLE.gly[0]) < 26)) continue;
        const cx = mx, cy = gy, rx = 18 + R() * 6, ry = 7.5;
        MX.fill(o, MX.blob(cx, cy, rx, ry, { wob: 0.06, seed: Math.floor(mx) }), '#8E8E88');
        o.save(); o.beginPath(); o.ellipse(cx, cy, rx - 1.2, ry - 1.2, 0, 0, TAU); o.clip();
        o.fillStyle = '#B8B8B0'; o.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
        for (let k = -rx + 3; k < rx; k += 4.2) { o.strokeStyle = '#3A3A36'; o.lineWidth = 1.1; o.beginPath(); o.moveTo(cx + k, cy - ry + (k % 2 ? 1 : 0)); o.quadraticCurveTo(cx + k + 2, cy, cx + k, cy + ry - 2); o.stroke(); }
        o.restore();
        o.strokeStyle = '#2A2A26'; o.lineWidth = 1.2; o.beginPath(); o.ellipse(cx, cy, rx, ry, 0, 0, TAU); o.stroke();
      }
      for (let k = 0; k < 40; k++) { o.fillStyle = '#141412'; o.beginPath(); o.arc(-141 + R() * 282, gy + (R() - 0.5) * 12, 0.9 + R() * 0.6, 0, TAU); o.fill(); }
    }
    // the fixed mitochondrion for the callouts, drawn larger
    { const [cx, cy] = MUSCLE.mito, rx = 26, ry = 9;
      MX.fill(o, MX.blob(cx, cy, rx + 1, ry + 1, { wob: 0.04, seed: 9 }), '#8E8E88');
      o.save(); o.beginPath(); o.ellipse(cx, cy, rx - 1.2, ry - 1.2, 0, 0, TAU); o.clip();
      o.fillStyle = '#BCBCB4'; o.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
      for (let k = -rx + 3; k < rx; k += 4.4) { o.strokeStyle = '#2E2E2A'; o.lineWidth = 1.3; o.beginPath(); o.moveTo(cx + k, cy - ry); o.quadraticCurveTo(cx + k + 2.4, cy, cx + k, cy + ry - 2); o.stroke(); }
      o.restore();
      o.strokeStyle = '#1E1E1A'; o.lineWidth = 1.4; o.beginPath(); o.ellipse(cx, cy, rx, ry, 0, 0, TAU); o.stroke(); }
    // a clump of glycogen granules
    for (let k = 0; k < 60; k++) { const a = R() * TAU, r = R() * 12; o.fillStyle = '#0E0E0C'; o.beginPath(); o.arc(MUSCLE.gly[0] + Math.cos(a) * r, MUSCLE.gly[1] + Math.sin(a) * r * 0.5, 1 + R() * 0.7, 0, TAU); o.fill(); }
    // a lipid droplet, pale and smooth, pressed against a mitochondrion
    { const [lx, ly] = MUSCLE.lip; o.fillStyle = MX.rad(o, lx - 3, ly - 3, 1, 12, [[0, '#E4E4DE'], [1, '#A8A8A0']]); o.beginPath(); o.arc(lx, ly, 10, 0, TAU); o.fill(); o.strokeStyle = '#4A4A46'; o.lineWidth = 0.9; o.stroke(); }
    MX.vignette(o, 0.16, '10,10,10'); MX.grain(o, 0.06);
    MX.scaleBar(o, 36, '0,5 µm');
  },
});
