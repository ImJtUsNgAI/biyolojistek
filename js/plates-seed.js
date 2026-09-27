'use strict';
// Seed bank plates: a pea sprouting on wet blotting paper, and a thin section through the tip of its young root.

// ================================================================ ×2 a pea on day four
// The soaked seed has swollen and its coat has torn beside the scar (hilum). The young root came out first and
// grows down; behind its tip a band of root hairs; the young shoot comes out bent like a hook, which protects its
// tip as it pushes up through soil. Through the tear the two fat seed leaves (cotyledons) show.
// spots: seed coat (70,-72), cotyledon (14,-12), radicle (-33,50), plumule (-56,-74), root hairs loupe (86,78)
const SPROUT = {
  root: [[-24, -12], [-31, 14], [-35, 42], [-31, 72], [-20, 98], [-4, 114], [14, 121]],
  shoot: [[-30, -22], [-44, -40], [-55, -64], [-55, -88], [-44, -101], [-32, -97]],
  // ×40 the root surface: long epidermal cells, each hair is one of them grown out into a tube
  hairs(o, R) {
    o.fillStyle = MX.lin(o, -60, -60, 60, 60, [[0, '#D8DCCF'], [1, '#C4CABB']]); o.fillRect(-60, -60, 120, 120);
    o.save(); o.rotate(-0.5);
    // the root runs across the bottom of the loupe
    o.fillStyle = MX.lin(o, 0, 8, 0, 60, [[0, '#F6F2E2'], [1, '#E2DCC4']]); o.fillRect(-80, 8, 160, 60);
    for (let x = -84, k = 0; x < 84; k++) {
      const w = 14 + R() * 8;
      o.strokeStyle = 'rgba(120,112,86,0.55)'; o.lineWidth = 0.5; o.strokeRect(x, 8, w, 11);
      o.strokeRect(x - w * 0.4, 19, w, 11); o.strokeRect(x + w * 0.2, 30, w, 12);
      // a hair grows from the outer wall of most epidermal cells
      if (R() < 0.8) {
        const hx = x + w * (0.3 + R() * 0.4), s = MX.strand(R, hx, 8, -Math.PI / 2 + (R() - 0.5) * 0.5, 40 + R() * 26, 3, 0.18);
        MX.line(o, s, 'rgba(150,146,120,0.8)', 2.8);
        MX.line(o, s, '#FBFAF2', 2);
        const [nx, ny] = MX.along(s, 0.8);
        o.fillStyle = 'rgba(120,110,80,0.7)'; o.beginPath(); o.ellipse(nx, ny, 0.9, 1.4, 0, 0, TAU); o.fill();
      }
      x += w;
    }
    o.strokeStyle = 'rgba(120,112,86,0.7)'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(-84, 8); o.lineTo(84, 8); o.stroke();
    MX.dots(o, R, 30, [-60, -60, 120, 60], 0.6, 1.6, 'rgba(160,170,150,0.35)');
    o.restore();
  },
};
plate('sprout', {
  still(o) {
    const R = MX.rng(88), S = SPROUT;
    // damp blotting paper: soft fibres, a darker wet patch around the seed
    MX.field(o, '#E8E2D2', '#BDB39A', 3, 0.012, 60);
    for (let k = 0; k < 260; k++) MX.line(o, MX.strand(R, (R() - 0.5) * 290, (R() - 0.5) * 290, R() * TAU, 8 + R() * 18, 2, 0.5), `rgba(250,248,240,${(0.2 + R() * 0.3).toFixed(2)})`, 0.35 + R() * 0.4);
    o.fillStyle = MX.rad(o, 0, -10, 20, 150, [[0, 'rgba(120,110,86,0.28)'], [1, 'rgba(120,110,86,0)']]); o.fillRect(-140, -140, 280, 280);
    // shadows
    o.fillStyle = 'rgba(60,50,30,0.22)';
    o.beginPath(); o.ellipse(32, -38, 56, 50, -0.2, 0, TAU); o.fill();
    MX.line(o, S.root.map(([x, y]) => [x + 4, y + 4]), 'rgba(60,50,30,0.2)', 10);
    // the young shoot: pale, because it grew in the dark; a hooked tip with tiny folded leaves
    MX.taper(o, S.shoot, 8, 5.5, '#DCDFA6', 'rgba(110,120,60,0.8)');
    MX.line(o, S.shoot.map(([x, y]) => [x - 1.4, y - 1]), 'rgba(255,255,236,0.6)', 1.2);
    o.save(); o.translate(-32, -97); o.rotate(0.9);
    for (const s of [-1, 1]) { o.fillStyle = '#C8D488'; o.beginPath(); o.ellipse(3, s * 2.5, 6, 3, s * 0.4, 0, TAU); o.fill(); o.strokeStyle = 'rgba(96,110,50,0.8)'; o.lineWidth = 0.5; o.stroke(); }
    o.restore();
    // the young root: thick and smooth near the seed, root hairs behind the tip, a pale cap on the tip itself
    for (let k = 0; k < 240; k++) {
      const t = 0.5 + R() * 0.36, [px, py, a] = MX.along(S.root, t), side = R() < 0.5 ? -1 : 1, w = 10 - t * 5;
      const b = a + side * (Math.PI / 2 + (R() - 0.5) * 0.9), bx = px + Math.cos(a + side * Math.PI / 2) * w * 0.45, by = py + Math.sin(a + side * Math.PI / 2) * w * 0.45;
      const l = (5 + R() * 9) * (1 - Math.abs(t - 0.68) * 2.4);
      MX.line(o, [[bx, by], [bx + Math.cos(b) * l * 0.5, by + Math.sin(b) * l * 0.5 + (R() - 0.5)], [bx + Math.cos(b) * l, by + Math.sin(b) * l]], `rgba(252,252,246,${(0.45 + R() * 0.4).toFixed(2)})`, 0.35);
    }
    MX.taper(o, S.root, 14, 5, '#F7F2DE', 'rgba(130,118,84,0.85)');
    MX.line(o, S.root.slice(0, 6).map(([x, y]) => [x - 2.4, y - 1]), 'rgba(255,255,250,0.8)', 2);
    const [tx, ty, ta] = MX.along(S.root, 0.97);
    o.fillStyle = 'rgba(214,196,120,0.75)'; o.beginPath(); o.ellipse(tx + Math.cos(ta) * 2, ty + Math.sin(ta) * 2, 4.5, 3, ta, 0, TAU); o.fill();
    // the seed: swollen coat, mottled and loose, torn along the lower side
    const coat = MX.blob(26, -46, 55, 48, { rot: -0.2, wob: 0.035, seed: 5 });
    MX.fill(o, coat, MX.lit(o, 26, -46, 58, '#C6BE7C', 0.4, 0.4));
    o.save(); MX.path(o, coat); o.clip();
    const lt = U.rgb('#E6DEA4'), dk = U.rgb('#8E8A4A');
    MX.tex(o, -32, -98, 118, 104, (x, y) => { const v = U.fbm(x * 0.09, y * 0.09, 3, 5); return v > 0.58 ? [dk[0], dk[1], dk[2], (v - 0.58) * 300] : [lt[0], lt[1], lt[2], (0.58 - v) * 120]; }, 160);
    // wrinkles where the soaked coat has gone loose
    for (let k = 0; k < 16; k++) { const a = -2.6 + R() * 2.2, r0 = 20 + R() * 20; MX.line(o, [[26 + Math.cos(a) * r0, -46 + Math.sin(a) * r0], [26 + Math.cos(a + 0.2) * (r0 + 14), -46 + Math.sin(a + 0.2) * (r0 + 14)], [26 + Math.cos(a + 0.1) * (r0 + 28), -46 + Math.sin(a + 0.1) * (r0 + 28)]], 'rgba(110,100,50,0.35)', 0.7); }
    // the tear: the two cotyledons bulge through, a seam between them
    const gap = [[-18, -14], [-4, -24], [18, -26], [44, -18], [56, -4], [34, 2], [8, 0], [-10, -4]];
    o.fillStyle = 'rgba(80,70,30,0.5)'; o.beginPath(); MX.curve(o, gap.map(([x, y]) => [x, y + 1.5])); o.fill();
    MX.fill(o, gap, MX.lin(o, 0, -26, 0, 2, [[0, '#F6EEB4'], [0.6, '#E8DE92'], [1, '#CCC074']]));
    MX.line(o, [[-14, -10], [4, -12], [24, -12], [50, -8]], 'rgba(120,110,50,0.7)', 0.8);
    MX.line(o, gap, 'rgba(90,80,36,0.8)', 0.8, true);
    MX.line(o, [[-2, -21], [22, -22], [40, -16]], 'rgba(255,255,236,0.8)', 1.2);
    o.restore();
    MX.line(o, coat, 'rgba(90,84,40,0.85)', 1, true);
    // the hilum, the scar where the seed hung from the pod
    o.fillStyle = '#3E3620'; o.beginPath(); o.ellipse(-22, -24, 3, 7, 0.5, 0, TAU); o.fill();
    o.fillStyle = 'rgba(255,255,255,0.5)'; o.beginPath(); o.ellipse(8, -80, 18, 7, -0.5, 0, TAU); o.fill();
    MX.loupe(o, 86, 78, 44, [-26, 90], '×40', x => S.hairs(x, R));
    MX.vignette(o, 0.12); MX.grain(o, 0.03);
    MX.scaleBar(o, 60, '5 mm');
  },
});

// ================================================================ ×100 the root tip, cut lengthwise and stained
// From the tip upward: the root cap, a thimble of loose cells that wears away as the root pushes through soil and
// whose middle cells carry heavy starch grains that sink to show which way is down; the meristem, small cubic
// cells full of dye with big nuclei, many of them dividing; the elongation zone, where the same cells fill with
// water and stretch; higher up the cells stop growing and the outer ones send out root hairs.
// spots: root cap (0,112), meristem (0,68), elongation (0,-22), root hairs (98,-112)
const ROOTTIP = {
  B(y) { return y < 50 ? 50 : 50 * Math.sqrt(Math.max(0, 1 - ((y - 50) / 46) ** 2)); },
  // row height: small cells in the meristem, stretching through the elongation zone
  h(y) { return y > 30 ? 5 : y > -70 ? 5 + (30 - y) / 100 * 21 : 27; },
  zone(y) { return y > 30 ? 'm' : y > -70 ? 'e' : 'r'; },
  N: 16,
  nucleus(o, R, x, y, w, h, z) {
    const r = z === 'm' ? Math.min(w, h) * 0.34 : z === 'e' ? 1.6 : 1.4;
    const cx = x + w / 2 + (z === 'm' ? (R() - 0.5) * w * 0.1 : (R() - 0.5) * w * 0.4), cy = y + h / 2 + (z === 'm' ? (R() - 0.5) * h * 0.1 : (R() - 0.5) * h * 0.5);
    o.fillStyle = MX.rad(o, cx - r * 0.3, cy - r * 0.3, r * 0.1, r * 1.1, z === 'm' ? [[0, '#7A4A9C'], [1, '#3E1460']] : [[0, '#946AB0'], [1, '#5E2E80']]);
    o.beginPath(); o.ellipse(cx, cy, r, r * 0.9, R() * 3, 0, TAU); o.fill();
    // the chromatin in grains, and in the meristem a dark nucleolus or two
    MX.dots(o, R, z === 'm' ? 7 : 3, [cx - r, cy - r, 2 * r, 2 * r], r * 0.07, r * 0.15, 'rgba(30,6,50,0.55)', (px, py) => Math.hypot(px - cx, py - cy) < r * 0.8);
    if (z === 'm') { o.fillStyle = '#240A3A'; o.beginPath(); o.arc(cx + r * 0.2, cy - r * 0.1, r * 0.3, 0, TAU); o.fill(); }
  },
  // a cell caught while dividing (k: 0 prophase, 1 metaphase, 2 anaphase, 3 telophase). The spindle runs along the
  // root, so the chromosomes line up across it and are pulled towards the tip and the base.
  division(o, R, x, y, w, h, k) {
    const cx = x + w / 2, cy = y + h / 2, s = Math.min(w, h);
    o.lineCap = 'round';
    if (k === 1 || k === 2) { o.strokeStyle = 'rgba(90,50,120,0.3)'; o.lineWidth = 0.12; for (let i = -2; i <= 2; i++) { o.beginPath(); o.moveTo(cx, y + h * 0.08); o.quadraticCurveTo(cx + i * w * 0.14, cy, cx, y + h * 0.92); o.stroke(); } }
    o.strokeStyle = '#2A0A44';
    if (k === 0) {
      // prophase: a swollen nucleus, the chromatin condensing into tangled threads
      o.fillStyle = 'rgba(150,110,180,0.8)'; o.beginPath(); o.ellipse(cx, cy, s * 0.4, s * 0.37, 0, 0, TAU); o.fill();
      o.lineWidth = s * 0.06; for (let i = 0; i < 5; i++) { const a = R() * TAU, b = a + 1 + R() * 2; o.beginPath(); o.arc(cx + (R() - 0.5) * s * 0.2, cy + (R() - 0.5) * s * 0.2, s * (0.12 + R() * 0.14), a, b); o.stroke(); }
    } else if (k === 1) {
      // metaphase: the chromosomes lined up across the middle of the cell
      o.lineWidth = s * 0.08; for (let i = -3; i <= 3; i++) { const lx = cx + i * w * 0.1; o.beginPath(); o.moveTo(lx - s * 0.03, cy - h * 0.13); o.lineTo(lx + s * 0.03, cy + h * 0.13); o.moveTo(lx + s * 0.03, cy - h * 0.13); o.lineTo(lx - s * 0.03, cy + h * 0.13); o.stroke(); }
    } else if (k === 2) {
      // anaphase: the two sets pulled apart, arms trailing behind like a V
      o.lineWidth = s * 0.07; for (const d of [-1, 1]) for (let i = -2; i <= 2; i++) { const lx = cx + i * w * 0.1; o.beginPath(); o.moveTo(lx - w * 0.04, cy + d * h * 0.14); o.lineTo(lx, cy + d * h * 0.3); o.lineTo(lx + w * 0.04, cy + d * h * 0.14); o.stroke(); }
    } else {
      // telophase: two dense daughter nuclei at the ends, the new wall (cell plate) forming between them
      for (const d of [-1, 1]) { o.fillStyle = '#3A1258'; o.beginPath(); o.ellipse(cx, cy + d * h * 0.27, w * 0.3, h * 0.13, 0, 0, TAU); o.fill(); }
      MX.line(o, [[x + w * 0.2, cy], [x + w * 0.8, cy]], 'rgba(90,40,110,0.7)', s * 0.05);
    }
  },
};
plate('roottip', {
  still(o) {
    const R = MX.rng(131), T = ROOTTIP;
    MX.field(o, '#F2EEF2', '#D6CCDA', 7, 0.012, 50);
    // root hairs in the upper part, outside the root: drawn first so the root lies over their bases
    for (const s of [-1, 1]) for (let y = -150; y < -70; y += 5 + R() * 5) {
      if (R() < 0.3) continue;
      const st = MX.strand(R, s * 50, y, (s > 0 ? 0 : Math.PI) + (R() - 0.5) * 0.5 - s * 0.25, 30 + R() * 70, 3, 0.22);
      MX.line(o, st, 'rgba(120,70,140,0.6)', 3.2);
      MX.line(o, st, '#EDE0F0', 2.2);
      const [nx, ny] = MX.along(st, 0.85); o.fillStyle = '#6A3A86'; o.beginPath(); o.arc(nx, ny, 1.1, 0, TAU); o.fill();
    }
    // the root cap: bands of cells around the tip, loose ones peeling off the outside
    for (let k = 0; k < 5; k++) {
      const band = (kk, a) => [50 * Math.cos(a) * (1 + kk * 0.04), 50 + Math.sin(a) * (46 + kk * 7)];
      for (let a = 0.02; a < Math.PI - 0.02; a += 0.17) {
        const a2 = Math.min(Math.PI - 0.02, a + 0.17), q = [band(k, a), band(k, a2), band(k + 1, a2), band(k + 1, a)];
        const mid = Math.abs(a + 0.085 - Math.PI / 2) < 0.45 && k < 3;
        MX.fill(o, MX.inset(q, 0.3), k === 4 ? 'rgba(232,214,236,0.8)' : mid ? '#DCC4E4' : '#E6D4EA');
        MX.line(o, q, 'rgba(110,60,130,0.55)', 0.45, true);
        // columella cells: starch grains that have sunk to the lower wall
        if (mid) { const [cx, cy] = MX.centroid(q); o.fillStyle = '#5A2E78'; for (let i = 0; i < 4; i++) { o.beginPath(); o.arc(cx + (i - 1.5) * 1.6, cy + 1.5 + R() * 0.6, 0.8, 0, TAU); o.fill(); } }
      }
    }
    for (let k = 0; k < 9; k++) {
      const a = 0.3 + R() * (Math.PI - 0.6), r = 1.05 + R() * 0.15, x = 60 * Math.cos(a) * r, y = 50 + 81 * Math.sin(a) * r;
      if (y > 134) continue;
      MX.fill(o, MX.blob(x, y, 4 + R() * 2, 3 + R() * 1.5, { rot: R() * TAU, seed: k + 3 }), 'rgba(226,206,232,0.85)');
      MX.line(o, MX.blob(x, y, 4 + R() * 2, 3 + R() * 1.5, { rot: R() * TAU, seed: k + 3 }), 'rgba(110,60,130,0.5)', 0.4, true);
    }
    // the root body, cell by cell, in files that narrow into the tip
    const out = [];
    for (let y = -150; y <= 96; y += 3) out.push([T.B(y), y]);
    for (let y = 96; y >= -150; y -= 3) out.push([-T.B(y), y]);
    o.save(); o.beginPath(); U.poly(o, out, true); o.clip();
    // the walls: wherever there are no cell contents the stained cellulose shows, a fine dark mesh
    o.fillStyle = '#9C74B0'; o.fillRect(-60, -150, 120, 250);
    let y = 96;
    while (y > -150) {
      const hh = T.h(y), z = T.zone(y), f = Math.max(0.4, T.B(y - hh / 2) / 50);
      for (let i = 0; i < T.N; i++) {
        const w = 100 / T.N * f, x = (-50 + (i + (i > 0 && i < T.N - 1 ? (R() - 0.5) * 0.15 : 0)) * 100 / T.N) * f, yy = y - hh - (i % 2) * hh * 0.5;
        const stele = Math.abs(i - (T.N - 1) / 2) < 2.2, epi = i === 0 || i === T.N - 1;
        const tone = z === 'm' ? (stele ? '#BA92CE' : '#CAA6DA') : z === 'e' ? (stele ? '#D2B6E0' : '#E4D2EC') : (stele ? '#D8C2E4' : '#EEE2F2');
        // a living cell is never a ruled box: its corners round off and shift a little
        const g = z === 'm' ? 0.4 : 0.5, j = () => (R() - 0.5) * Math.min(w, hh) * 0.1;
        const q = MX.soft([[x + g + j(), yy + g + j()], [x + w - g + j(), yy + g + j()], [x + w - g + j(), yy + hh - g + j()], [x + g + j(), yy + hh - g + j()]], 0.2);
        MX.fill(o, q, MX.rad(o, x + w * 0.35, yy + hh * 0.35, 0.2, Math.max(w, hh) * 0.75, [[0, U.shade(tone, 0.12)], [1, U.shade(tone, -0.06)]]));
        // the cytoplasm is grainy; dense in the meristem, a thin film round the vacuole higher up
        MX.dots(o, R, z === 'm' ? 8 : z === 'e' ? 6 : 3, [x + 0.6, yy + 0.6, w - 1.2, hh - 1.2], 0.12, 0.26, 'rgba(96,44,126,0.35)');
        // big vacuoles make the stretched cells look empty
        if (z !== 'm' && hh > 9) MX.fill(o, MX.inset(q, Math.min(w, hh) * 0.2), 'rgba(250,246,252,0.55)');
        // xylem: a central vessel with spiral thickening, only where the cells have stopped growing
        if (z === 'r' && Math.abs(i - (T.N - 1) / 2) < 0.6) {
          o.strokeStyle = 'rgba(90,40,110,0.7)'; o.lineWidth = 0.6;
          for (let s = yy; s < yy + hh; s += 2.4) { o.beginPath(); o.moveTo(x + 0.6, s); o.lineTo(x + w - 0.6, s + 1.2); o.stroke(); }
        } else if (z === 'm' && !epi && R() < 0.1 && y < 90) T.division(o, R, x, yy, w, hh, Math.floor(R() * 4));
        else if (R() < (z === 'm' ? 0.95 : 0.55)) T.nucleus(o, R, x, yy, w, hh, z);
      }
      y -= hh;
    }
    o.restore();
    MX.line(o, out, 'rgba(90,40,110,0.8)', 1, true);
    MX.vignette(o, 0.1, '40,20,50'); MX.grain(o, 0.03);
    MX.scaleBar(o, 32, '200 µm');
  },
});
