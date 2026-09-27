'use strict';
// Salty-well plates: Songül's tomato seedling cut away with its soil, and a slice of its root cortex at ×400. Both
// have two states: watered from the salty well (st.salty) or with rain water after the fix.

// ================================================================ ×1 a seedling in its bed, the soil cut away
// Salty: leaves hanging limp although the soil is wet, a white crust where the well water dried, salt specks in
// the soil water. Fixed: firm leaves, clean soil, a drip line of rain water.
// spots: leaf loupe (100,-96), salt crust (64,-12), root hairs (28,70)
const BED = {
  ROOT: [[2, -6], [6, 14], [14, 36], [22, 56], [28, 72], [33, 92], [36, 114], [38, 132]],
  // a tomato leaf: a midrib with paired leaflets; bend > 0 curls it clockwise, limp leaves bend a lot
  leaf(o, x, y, a, len, bend, limp) {
    const pts = []; let ang = a;
    for (let i = 0; i <= 6; i++) { pts.push([x, y]); ang += bend; x += Math.cos(ang) * len / 6; y += Math.sin(ang) * len / 6; }
    MX.line(o, pts, limp ? '#6A8A3E' : '#4E7A32', 1.6);
    const col = limp ? '#86A052' : '#4E8A36';
    for (let i = 1; i < 6; i++) {
      const [px, py, pa] = MX.along(pts, i / 6), s = 6 - i * 0.55;
      for (const side of [-1, 1]) {
        const la = pa + side * (limp ? 0.7 : 1.05), cx = px + Math.cos(la) * s, cy = py + Math.sin(la) * s + (limp ? 1.6 : 0);
        const lf = MX.blob(cx, cy, s, s * (limp ? 0.42 : 0.56), { rot: la, wob: limp ? 0.28 : 0.14, n: 12, seed: i * 13 + side + 40 });
        MX.fill(o, lf, col); MX.line(o, lf, 'rgba(30,60,20,0.6)', 0.4, true);
      }
    }
    const [tx, ty, ta] = MX.along(pts, 1);
    MX.fill(o, MX.blob(tx + Math.cos(ta) * 4, ty + Math.sin(ta) * 4, 5, 3, { rot: ta, wob: 0.15, n: 12, seed: 3 }), col);
  },
};
plate('garden', {
  key: st => st.salty ? 1 : 0,
  still(o, st) {
    const R = MX.rng(707), salty = !!st.salty;
    // air above the bed, soft light through the garden
    o.fillStyle = MX.lin(o, 0, -140, 0, -10, [[0, '#D2E2CA'], [1, '#EEF0E0']]); o.fillRect(-141, -141, 282, 132);
    for (let k = 0; k < 16; k++) { o.fillStyle = `rgba(120,160,90,${(0.08 + R() * 0.1).toFixed(2)})`; o.beginPath(); o.arc(-140 + R() * 280, -140 + R() * 90, 10 + R() * 22, 0, TAU); o.fill(); }
    // the soil, cut away: dark and damp in both states (the plant is thirsty in wet soil)
    o.fillStyle = MX.lin(o, 0, -10, 0, 140, [[0, '#5A4230'], [1, '#3E2E22']]); o.fillRect(-141, -10, 282, 151);
    for (let k = 0; k < 420; k++) { const x = -140 + R() * 280, y = -8 + R() * 148; o.fillStyle = R() < 0.5 ? 'rgba(120,96,70,0.5)' : 'rgba(30,20,14,0.45)'; o.beginPath(); o.ellipse(x, y, 1 + R() * 3, 0.8 + R() * 2, R() * 3, 0, TAU); o.fill(); }
    for (let k = 0; k < 90; k++) {
      const x = -140 + R() * 280, y = R() * 136, sp = R();
      o.fillStyle = 'rgba(170,200,220,0.35)'; o.beginPath(); o.ellipse(x, y, 2 + R() * 3, 1 + R() * 1.5, R() * 3, 0, TAU); o.fill();
      if (salty && sp < 0.6) { o.fillStyle = 'rgba(250,250,250,0.9)'; o.fillRect(x - 0.6, y - 0.6, 1.2, 1.2); }
    }
    // roots, fine and white; the one the callout points at is drawn by hand so its hairs are always there
    const roots = [];
    for (let k = 0; k < 6; k++) roots.push(MX.strand(R, (R() - 0.5) * 6, -6, Math.PI / 2 + (k < 3 ? k - 3 : k - 2) * 0.34, 60 + R() * 70, 4, 0.35));
    roots.push(BED.ROOT);
    for (const r of roots) {
      for (let i = 2; i < r.length - 1; i++) {
        const [x, y] = r[i], a = Math.atan2(r[i + 1][1] - r[i - 1][1], r[i + 1][0] - r[i - 1][0]);
        for (let h = 0; h < (r === BED.ROOT ? 5 : 2); h++) {
          const s = h & 1 ? 1 : -1, l = 3 + R() * 4, j = R() * 3;
          MX.line(o, [[x + Math.cos(a) * j, y + Math.sin(a) * j], [x + Math.cos(a) * j + Math.cos(a + s * 1.35) * l, y + Math.sin(a) * j + Math.sin(a + s * 1.35) * l]], 'rgba(240,236,220,0.6)', 0.35);
        }
      }
      MX.line(o, r, '#EDE6D2', r === BED.ROOT ? 1.9 : 1.5);
    }
    // the soil surface: a white salt crust from the well, or a drip line of rain water after the fix
    MX.line(o, [[-141, -10], [-60, -12], [0, -9], [70, -11], [141, -10]], '#2E2218', 2);
    if (salty) {
      for (let k = 0; k < 22; k++) { const x = -130 + R() * 260; if (Math.abs(x) < 12) continue; MX.fill(o, MX.blob(x, -11 - R() * 2, 5 + R() * 10, 1.6 + R() * 1.4, { wob: 0.3, n: 14, seed: k }), `rgba(246,246,240,${(0.7 + R() * 0.25).toFixed(2)})`); }
      MX.fill(o, MX.blob(64, -12, 26, 3.4, { wob: 0.3, n: 16, seed: 77 }), 'rgba(250,250,246,0.95)');
      for (let k = 0; k < 50; k++) { o.fillStyle = '#FFFFFF'; o.fillRect(40 + R() * 50, -15 - R() * 3, 1.3, 1.3); }
    } else {
      o.fillStyle = '#2A2A2A'; o.fillRect(-141, -19, 282, 4);
      o.fillStyle = '#3A3A3A'; o.fillRect(-12, -21, 8, 7);
      MX.fill(o, MX.blob(-8, -9, 20, 3, { wob: 0.2, seed: 9 }), 'rgba(30,22,14,0.4)');
    }
    // the seedling: firm and upright, or limp with every leaf hanging
    const lean = salty ? 14 : 0, stem = [[0, -10], [lean * 0.2, -46], [lean * 0.6, -82], [lean, -114]];
    MX.taper(o, stem, 6.5, 3, salty ? '#78984A' : '#5E9A3A', 'rgba(30,60,20,0.8)');
    for (let k = 0; k < 40; k++) { const [x, y] = MX.along(stem, R()); MX.line(o, [[x, y], [x + (R() - 0.5) * 5, y - 2]], 'rgba(240,250,230,0.6)', 0.3); }
    for (const [t, a, len] of [[0.3, -2.6, 48], [0.46, -0.55, 46], [0.66, -2.75, 40], [0.8, -0.35, 34], [0.97, -1.7, 20]]) {
      const [x, y] = MX.along(stem, t), side = Math.cos(a) < 0 ? -1 : 1;
      BED.leaf(o, x, y, a + (salty ? side * 0.35 : 0), len, side * (salty ? 0.22 : 0.035), salty);
    }
    // a loupe on a leaf: plump cells full of water, or slack, crumpled ones
    MX.loupe(o, 100, -96, 34, [-40, -62], '×100', x => {
      x.fillStyle = salty ? '#E4E8CC' : '#DDE8C8'; x.fillRect(-40, -40, 80, 80);
      for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) {
        const cx = i * 12 + (j & 1) * 6, cy = j * 12;
        const b = MX.blob(cx, cy, salty ? 4.6 : 5.8, salty ? 4 : 5.4, { wob: salty ? 0.22 : 0.05, n: 12, seed: i * 7 + j + 30 });
        MX.fill(x, b, salty ? '#B4C88E' : '#8FBE62'); MX.line(x, b, 'rgba(40,70,30,0.7)', 0.5, true);
      }
    });
    MX.vignette(o, 0.14); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '2 cm');
  },
  live(x, st, t) {
    if (st.salty) return;
    // a drop falls from the drip line every couple of seconds
    const k = (t * 0.6) % 1;
    x.fillStyle = `rgba(170,210,235,${(0.9 - k * 0.5).toFixed(2)})`; x.beginPath(); x.ellipse(-8, -14 + k * 5, 1.8, 2.4, 0, 0, TAU); x.fill();
  },
});

// ================================================================ ×400 root cortex stained with neutral red
// The dye collects in the vacuoles. In salty soil water each cell has lost water to the outside: the vacuole has
// shrunk and darkened, and the membrane has pulled away from the wall (plasmolysis), the gap filled with the salty
// solution. With rain water the vacuoles are full and press the cell against its wall (turgor).
// spots: wall (-72,-34), vacuole (0,0), nucleus (CORTEX.cell(-72,68).nx), gap / turgor (82,-34)
const CORTEX = {
  // a few cells have fixed insets so the callouts always land on them
  FIX: { '108,-34': [18, 10], '-72,68': [10, 12], '0,0': [11, 11] },
  cell(cx, cy, salty) {
    if (!salty) return { l: cx - 34.4, r: cx + 34.4, t: cy - 15.4, b: cy + 15.4, k: 0.12, nx: cx - 27, ny: cy + 4 };
    const f = this.FIX[cx + ',' + cy], il = f ? f[0] : 8 + U.hash(cx, cy, 5) * 10, ir = f ? f[1] : 8 + U.hash(cx, cy, 6) * 10, iy = 4.5 + U.hash(cx, cy, 7) * 2;
    return { l: cx - 34 + il, r: cx + 34 - ir, t: cy - 15 + iy, b: cy + 15 - iy, k: 0.36, nx: cx - 34 + il + 6.5, ny: cy + 4 };
  },
};
plate('plasmolysis', {
  key: st => st.salty ? 1 : 0,
  still(o, st) {
    const salty = !!st.salty, R = MX.rng(salty ? 7301 : 7302);
    // bright field; the pale cellulose walls show wherever there are no cell contents
    o.fillStyle = MX.rad(o, 0, 0, 10, 220, [[0, '#F0E6DE'], [1, '#D4C2B6']]); o.fillRect(-141, -141, 282, 282);
    // real walls are never ruler-straight: each row boundary waves a little, each end wall leans a little.
    // Neighbours share the same edge function and the same corner, so the walls still meet.
    const edge = (x, yb) => yb + 2 * Math.sin(x * 0.045 + yb * 0.13);
    const lean = (x, cy, s) => x + (U.hash(x, cy, s) - 0.5) * 5;
    const air = [];
    for (let r = -5; r <= 5; r++) {
      const cy = r * 34, off = (r & 1) ? 36 : 0;
      for (let cx = -216 + off; cx <= 216; cx += 72) {
        const y0 = cy - 17, y1 = cy + 17, c = CORTEX.cell(cx, cy, salty), v = U.hash(cx, cy, 12);
        const xa = lean(cx - 36, cy, 3), xb = lean(cx + 36, cy, 3), xc = lean(cx + 36, cy, 4), xd = lean(cx - 36, cy, 4), poly = [];
        for (let t = 0; t <= 1.001; t += 0.125) { const x = xa + (xb - xa) * t; poly.push([x, edge(x, y0)]); }
        for (let t = 0; t <= 1.001; t += 0.125) { const x = xc + (xd - xc) * t; poly.push([x, edge(x, y1)]); }
        const lum = MX.inset(poly, 1.5);
        if (U.hash(cx, cy, 13) < 0.4) air.push([xa, edge(xa, y0)]);
        if (salty) {
          // between wall and membrane: the clear salty solution that came in through the wall
          MX.fill(o, lum, MX.rad(o, cx, cy, 4, 40, [[0, '#F6F8F6'], [1, '#E6ECEA']]));
          const prot = MX.soft([[c.l, c.t], [c.r, c.t + U.hash(cx, cy, 8) * 3 - 1.5], [c.r, c.b], [c.l, c.b - (U.hash(cx, cy, 9) * 3 - 1.5)]], c.k);
          // threads of membrane still stuck to the wall (Hechtian strands)
          for (const [px, py, wx, wy] of [[c.l, c.t + 2, xa + 2.5, edge(xa, y0) + 2.5], [c.r, c.b - 2, xc - 2.5, edge(xc, y1) - 2.5], [c.l, c.b - 3, xd + 2.5, edge(xd, y1) - 2.5]]) MX.line(o, [[px, py], [(px + wx) / 2 + (R() - 0.5) * 2, (py + wy) / 2], [wx, wy]], 'rgba(150,110,116,0.5)', 0.35);
          // the shrunken protoplast: a thin grainy skin of cytoplasm round a small, dark, concentrated vacuole
          MX.fill(o, prot, 'rgba(206,190,190,0.95)');
          for (let k = 0; k < 40; k++) { o.fillStyle = 'rgba(120,90,96,0.5)'; o.fillRect(c.l + R() * (c.r - c.l), R() < 0.5 ? c.t + 0.6 + R() * 1.2 : c.b - 1.8 + R() * 1.2, 0.6, 0.6); }
          const vac = MX.soft([[c.l + 2, c.t + 2], [c.r - 2, c.t + 2], [c.r - 2, c.b - 2], [c.l + 2, c.b - 2]], c.k);
          MX.fill(o, vac, MX.rad(o, (c.l + c.r) / 2 - 6, cy - 4, 2, 40, [[0, U.shade('#B8203C', v * 0.12)], [0.7, '#8A1430'], [1, '#620A22']]));
          MX.line(o, vac, 'rgba(255,220,226,0.35)', 0.4, true);
          MX.line(o, prot, 'rgba(96,56,66,0.8)', 0.5, true);
        } else {
          // turgid: the vacuole is full and presses the thin cytoplasm flat against the wall
          MX.fill(o, lum, 'rgba(214,196,190,1)');
          for (let k = 0; k < 60; k++) { const t = R(); o.fillStyle = 'rgba(130,96,100,0.45)'; o.fillRect(xa + t * (xb - xa), R() < 0.5 ? edge(xa + t * (xb - xa), y0) + 1.7 + R() * 1.2 : edge(xa + t * (xb - xa), y1) - 2.8 + R() * 1.2, 0.6, 0.6); }
          const vac = MX.inset(lum, 2.2);
          MX.fill(o, vac, MX.rad(o, cx - 8, cy - 5, 2, 44, [[0, U.shade('#F0A2B2', v * 0.1 - 0.05)], [0.6, U.shade('#DC7890', v * 0.1 - 0.05)], [1, '#C45872']]));
          MX.line(o, vac, 'rgba(150,70,90,0.35)', 0.4, true);
        }
        // the nucleus, pushed into the thin cytoplasm at one end, with its nucleolus
        o.fillStyle = MX.rad(o, c.nx - 1, c.ny - 1, 0.2, 3.6, [[0, 'rgba(176,150,158,0.95)'], [1, 'rgba(110,86,96,0.95)']]); o.beginPath(); o.ellipse(c.nx, c.ny, 3.4, 2.6, 0, 0, TAU); o.fill();
        o.strokeStyle = 'rgba(70,44,56,0.7)'; o.lineWidth = 0.35; o.stroke();
        o.fillStyle = 'rgba(60,34,48,0.85)'; o.beginPath(); o.arc(c.nx + 0.6, c.ny - 0.3, 0.9, 0, TAU); o.fill();
        // the wall: the middle lamella a fine dark line between neighbours, the cellulose either side of it pale
        MX.line(o, poly, 'rgba(96,70,62,0.6)', 0.45, true);
        MX.line(o, lum, 'rgba(255,248,240,0.45)', 0.4, true);
      }
    }
    // air trapped in the little spaces where three cells meet: dark in bright field, with a bright point
    for (const [x, y] of air) { o.fillStyle = 'rgba(48,32,34,0.75)'; o.beginPath(); o.ellipse(x, y, 2.4, 1.5, 0, 0, TAU); o.fill(); o.fillStyle = 'rgba(255,255,255,0.6)'; o.beginPath(); o.arc(x - 0.5, y - 0.4, 0.5, 0, TAU); o.fill(); }
    MX.vignette(o, 0.14, '40,20,26'); MX.grain(o, 0.03);
    MX.scaleBar(o, 40, '50 µm');
  },
});
