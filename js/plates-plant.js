'use strict';
// Plant plates. Each is painted the way a student would really see it: a fresh section under the light
// microscope, an electron micrograph, or a botanical plate of the whole plant dug out of the soil.
// The coordinates noted beside each plate are the ones the numbered spots in lens.js point at.

const PLANT_PAL = {
  // [body, dark edge / grana, highlight, grana alpha, grana density]
  chl: ['#3E8A2E', '#1F5A1A', '#86C062', 0.8, 1.1],
  chlPale: ['#C2C672', '#9CA24C', '#E6E4AC', 0.4, 0.45],
};

const PLANT = {
  mito(o, R, x, y, a, l = 9.5, w = 4.4) {
    o.save(); o.translate(x, y); o.rotate(a);
    o.fillStyle = MX.lin(o, 0, -w / 2, 0, w / 2, [[0, '#EADCBC'], [1, '#BDA274']]);
    U.rr(o, -l / 2, -w / 2, l, w, w / 2); o.fill();
    o.strokeStyle = 'rgba(104,80,46,0.85)'; o.lineWidth = 0.45; o.stroke();
    o.strokeStyle = 'rgba(118,88,52,0.75)'; o.lineWidth = 0.32;
    for (let u = -l / 2 + 1.5; u < l / 2 - 1.1; u += 1.35) { const s = R() < 0.5 ? -1 : 1; o.beginPath(); o.moveTo(u, s * w * 0.44); o.lineTo(u + 0.3, s * w * 0.02); o.stroke(); }
    o.restore();
  },
  nucleus(o, R, x, y, r, col = '#C6C8B4') {
    o.save(); o.beginPath(); o.arc(x, y, r, 0, TAU); o.clip();
    o.fillStyle = MX.lit(o, x, y, r, col, 0.22, 0.18); o.fillRect(x - r, y - r, r * 2, r * 2);
    const c = U.rgb('#6C705A');
    MX.tex(o, x - r, y - r, r * 2, r * 2, (u, v) => { const k = U.fbm(u * 0.42 + 9, v * 0.42, 3, 12); return [c[0], c[1], c[2], Math.max(0, k - 0.46) * 520]; }, 96);
    MX.ball(o, x + r * 0.22, y - r * 0.16, r * 0.3, '#878270', 0.35, 0.3);
    o.restore();
    o.strokeStyle = 'rgba(64,68,52,0.85)'; o.lineWidth = 0.9; o.beginPath(); o.arc(x, y, r, 0, TAU); o.stroke();
    o.strokeStyle = 'rgba(236,238,222,0.7)'; o.lineWidth = 0.45; o.beginPath(); o.arc(x, y, r - 1.1, 0, TAU); o.stroke();
    o.strokeStyle = 'rgba(236,238,222,0.95)'; o.lineWidth = 0.9;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + R() * 0.2; o.beginPath(); o.arc(x, y, r - 0.4, a, a + 0.05); o.stroke(); }
  },
  // an obovate leaflet with a toothed edge, its base at the origin pointing along +x
  leaflet(o, x, y, a, l, w, col, teeth = true) {
    o.save(); o.translate(x, y); o.rotate(a);
    const pts = [], n = 22;
    for (let i = 0; i < n; i++) {
      const t = i / n * TAU, c = Math.cos(t), s = Math.sin(t), k = teeth && c > -0.1 ? 1 + 0.1 * (i % 2) : 1;
      pts.push([l / 2 + c * l / 2 * k, s * w / 2 * (0.72 + 0.28 * c) * k]);
    }
    o.fillStyle = MX.lin(o, 0, -w / 2, 0, w / 2, [[0, U.shade(col, 0.18)], [1, U.shade(col, -0.18)]]);
    o.beginPath(); MX.curve(o, pts); o.fill();
    o.strokeStyle = U.rgba(U.shade(col, -0.45), 0.7); o.lineWidth = 0.35; o.stroke();
    o.strokeStyle = U.rgba(U.shade(col, 0.4), 0.6); o.lineWidth = 0.3; o.beginPath(); o.moveTo(0.5, 0); o.lineTo(l * 0.9, 0); o.stroke();
    o.restore();
  },
  // a pinnate leaf: leaflets in pairs along a rachis, one at the end
  pinnate(o, R, rachis, l, col) {
    MX.line(o, rachis, U.shade(col, -0.25), 0.9, false);
    for (let t = 0.12; t < 0.9; t += 0.15) {
      const [x, y, a] = MX.along(rachis, t);
      PLANT.leaflet(o, x, y, a - 1.05, l, l * 0.58, col); PLANT.leaflet(o, x, y, a + 1.05, l, l * 0.58, col);
    }
    const [x, y, a] = MX.along(rachis, 1); PLANT.leaflet(o, x, y, a, l, l * 0.58, col);
  },
  // root nodules: little glossy pinkish lobes, paler at the growing tip
  nodules(o, R, x, y, a, n) {
    for (let i = 0; i < n; i++) {
      const b = a + (i - (n - 1) / 2) * 0.6, l = 4.5 + R() * 2.5, cx = x + Math.cos(b) * l * 0.7, cy = y + Math.sin(b) * l * 0.7, w = 2.8 + R() * 0.8;
      o.save(); o.translate(cx, cy); o.rotate(b);
      o.fillStyle = MX.lit(o, 0, 0, l, '#D69E86', 0.32, 0.35); o.beginPath(); o.ellipse(0, 0, l, w, 0, 0, TAU); o.fill();
      o.fillStyle = 'rgba(250,240,225,0.7)'; o.beginPath(); o.ellipse(l * 0.68, 0, l * 0.28, w * 0.55, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(110,70,50,0.6)'; o.lineWidth = 0.4; o.beginPath(); o.ellipse(0, 0, l, w, 0, 0, TAU); o.stroke();
      o.restore();
    }
  },
};

// helpers for the whole-plant plates: backdrop, soil cut open, grass blades
const BOT = {
  sky(o, y1) { o.fillStyle = MX.lin(o, 0, -141, 0, y1, [[0, '#E4EAEC'], [1, '#F1EEE1']]); o.fillRect(-141, -141, 282, y1 + 141); },
  soil(o, R, y0, base = '#7A5A3E') {
    o.fillStyle = MX.lin(o, 0, y0, 0, 141, [[0, U.shade(base, -0.12)], [1, U.shade(base, 0.08)]]); o.fillRect(-141, y0, 282, 141 - y0);
    const d = U.rgb(U.shade(base, -0.45)), l = U.rgb(U.shade(base, 0.3));
    MX.tex(o, -141, y0, 282, 141 - y0, (x, y) => { const v = U.fbm(x * 0.09, y * 0.09, 4, 5); return v > 0.55 ? [d[0], d[1], d[2], (v - 0.55) * 500] : v < 0.38 ? [l[0], l[1], l[2], (0.38 - v) * 380] : null; }, 220);
    for (let i = 0; i < 70; i++) {
      const x = -140 + R() * 280, y = y0 + 4 + R() * (137 - y0), r = 0.8 + R() * 2.6;
      o.fillStyle = MX.lit(o, x, y, r, U.pick(['#9A8266', '#B5A088', '#6E5642', '#C8B8A0'], R()), 0.3, 0.3);
      o.beginPath(); MX.curve(o, MX.blob(x, y, r, r * (0.6 + R() * 0.4), { seed: i, wob: 0.25, n: 8, rot: R() * 3 })); o.fill();
    }
    MX.dots(o, R, 160, [-140, y0 + 2, 280, 139 - y0], 0.3, 1, 'rgba(30,20,12,0.45)');
    o.strokeStyle = 'rgba(40,28,18,0.6)'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(-141, y0);
    for (let x = -141; x <= 141; x += 6) o.lineTo(x, y0 + MX.n(x * 0.08, 3) * 1.5);
    o.stroke();
  },
  quad(P0, P1, P2, t) { const u = 1 - t; return [u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]]; },
  // a grass leaf blade: a long strap with parallel veins, narrowing to the tip
  blade(o, P0, P1, P2, w, fill, tipPow = 0.6) {
    const N = 48, C = [], Lf = [], Rt = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, [x, y] = this.quad(P0, P1, P2, t), [x2, y2] = this.quad(P0, P1, P2, Math.min(1, t + 0.01)), [x1, y1] = this.quad(P0, P1, P2, Math.max(0, t - 0.01));
      const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
      const ww = w * 0.5 * Math.min(1, 0.45 + t * 5) * Math.pow(1 - t, tipPow);
      C.push([x, y, nx, ny, ww]); Lf.push([x + nx * ww, y + ny * ww]); Rt.push([x - nx * ww, y - ny * ww]);
    }
    const poly = Lf.concat(Rt.reverse());
    o.fillStyle = fill; o.beginPath(); U.poly(o, poly, true); o.fill();
    for (const f of [-0.64, -0.34, 0.34, 0.64]) {
      o.strokeStyle = 'rgba(255,255,236,0.2)'; o.lineWidth = 0.35; o.beginPath();
      C.forEach(([x, y, nx, ny, ww], i) => i ? o.lineTo(x + nx * ww * f, y + ny * ww * f) : o.moveTo(x + nx * ww * f, y + ny * ww * f)); o.stroke();
    }
    o.strokeStyle = 'rgba(255,255,226,0.42)'; o.lineWidth = 0.7; o.beginPath(); C.forEach(([x, y], i) => i ? o.lineTo(x, y) : o.moveTo(x, y)); o.stroke();
    o.strokeStyle = 'rgba(30,50,20,0.55)'; o.lineWidth = 0.45; o.beginPath(); U.poly(o, poly, true); o.stroke();
    return C;
  },
};

// ================================================================ ×1000 plant cell
// A leaf mesophyll cell seen with the light microscope: a thin layer of cytoplasm pressed against the wall by a
// huge vacuole, chloroplasts lining the walls, the nucleus in a pocket of cytoplasm, neighbours out of focus.
// spots: cell wall (-110,-10) · vacuole (-10,10) · nucleus (62,-50) · chloroplast (-12,-83) · mitochondrion (83,37)
const PLANT_CELL = [[-104, -62], [-58, -94], [34, -96], [100, -70], [112, 6], [92, 78], [10, 100], [-78, 90], [-114, 30]];
// the loop the chloroplasts stream along: just inside the walls, its corners cut round. `at(s)` is the point s units
// along it, facing along the flow (read over a short chord, so a chloroplast turns smoothly at a corner)
const PLANT_STREAM = {
  path() {
    if (this._p) return this._p;
    const poly = MX.soft(MX.inset(PLANT_CELL, 12), 0.3), seg = [];
    let len = 0;
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, l, len]); len += l; }
    const pos = s => {
      s = ((s % len) + len) % len;
      const q = seg.find(g => s < g[3] + g[2]) || seg[seg.length - 1], u = q[2] ? (s - q[3]) / q[2] : 0;
      return [q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u];
    };
    const at = s => { const p = pos(s), a = pos(s - 7), b = pos(s + 7); return [p[0], p[1], Math.atan2(b[1] - a[1], b[0] - a[0])]; };
    return (this._p = { len, n: Math.round(len / 30), at });
  },
  // each streaming chloroplast is painted once into a little picture of its own (8 px a unit: sharp up to about
  // an 8× zoom, a little soft beyond) and after that only moved: painting its grana afresh every frame cost ten times any other moving plate
  sprite(i, pal) {
    const S = this._s || (this._s = new Map()), L = S.get(pal) || (S.set(pal, []), S.get(pal));
    if (L[i]) return L[i];
    const k = 8, c = U.canvas(30 * k, 15 * k), o = c.getContext('2d');
    o.setTransform(k, 0, 0, k, 15 * k, 7.5 * k);
    MX.chloro(o, MX.rng(300 + i), 0, 0, 0, 13.5, 6.2, pal);
    return (L[i] = c);
  },
};
plate('plantCell', {
  key: st => st.pale ? 'pale' : 'green',
  still(o, st) {
    const R = MX.rng(7), pal = st.pale ? PLANT_PAL.chlPale : PLANT_PAL.chl, cell = PLANT_CELL, N = [62, -50];
    const cyto = st.pale ? '#DCDFC3' : '#D2DFBA';
    const out = cell.map(([x, y]) => { const a = Math.atan2(y, x) + (R() - 0.5) * 0.45; return [x + Math.cos(a) * 300, y + Math.sin(a) * 300]; });
    const nbrs = cell.map((p, i) => { const j = (i + 1) % cell.length; return [p, cell[j], out[j], out[i]]; });
    const inward = (a, b, c) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
      let nx = -dy / l, ny = dx / l; if ((c[0] - a[0]) * nx + (c[1] - a[1]) * ny < 0) { nx = -nx; ny = -ny; }
      return [nx, ny, l, dx, dy];
    };
    // chloroplast places along the inside of every wall of a cell
    const ring = (poly, off, gap, skip) => {
      const c = MX.centroid(poly), res = [];
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length], [nx, ny, l, dx, dy] = inward(a, b, c), n = Math.max(1, Math.round(l / gap));
        for (let k = 0; k < n; k++) { const t = (k + 0.5) / n, x = a[0] + dx * t + nx * off, y = a[1] + dy * t + ny * off; if (!skip || !skip(x, y)) res.push([x, y, Math.atan2(dy, dx)]); }
      }
      return res;
    };
    // the walls are the bright network left between the cells
    o.fillStyle = '#F1F4E4'; o.fillRect(-141, -141, 282, 282);
    // neighbouring cells, just out of focus
    MX.layer(o, x => {
      for (const nb of nbrs) {
        MX.fill(x, MX.soft(MX.inset(nb, 2.8), 0.08), cyto);
        MX.fill(x, MX.soft(MX.inset(nb, 22), 0.3), '#E4EBDD');
        for (const [cx, cy, a] of ring(nb, 12, 30, (px, py) => Math.abs(px) > 152 || Math.abs(py) > 152)) MX.chloro(x, R, cx, cy, a, 13, 6, pal);
      }
    }, 1.4, 0.92);
    // middle lamella: the glue line in the middle of each wall
    o.strokeStyle = 'rgba(118,132,92,0.55)'; o.lineWidth = 0.55; o.beginPath();
    cell.forEach((p, i) => { o.moveTo(p[0], p[1]); o.lineTo(out[i][0], out[i][1]); });
    o.moveTo(cell[0][0], cell[0][1]); cell.forEach(p => o.lineTo(p[0], p[1])); o.closePath(); o.stroke();
    // the cell in focus: cytoplasm pressed against the wall
    const inner = MX.soft(MX.inset(cell, 2.8), 0.08);
    MX.fill(o, inner, cyto);
    o.save(); MX.path(o, inner); o.clip(); MX.dots(o, R, 1400, [-120, -100, 240, 205], 0.22, 0.55, 'rgba(84,104,62,0.32)'); o.restore();
    o.strokeStyle = 'rgba(70,92,58,0.55)'; o.lineWidth = 0.45; MX.path(o, inner); o.stroke();
    // pit fields: thin places in the wall crossed by plasmodesmata
    for (let i = 0; i < cell.length; i++) {
      const a = cell[i], b = cell[(i + 1) % cell.length], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      for (const t of [0.3, 0.72]) {
        o.save(); o.translate(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t); o.rotate(ang);
        o.fillStyle = 'rgba(250,252,244,0.9)'; o.fillRect(-3.5, -2.4, 7, 4.8);
        o.strokeStyle = 'rgba(80,96,60,0.7)'; o.lineWidth = 0.3;
        for (let u = -2.6; u <= 2.7; u += 1.3) { o.beginPath(); o.moveTo(u, -2.6); o.lineTo(u, 2.6); o.stroke(); }
        o.restore();
      }
    }
    // the vacuole fills the middle; the nucleus sits in a pocket of cytoplasm, and a strand crosses the sap
    const vac = MX.soft(MX.inset(cell, 23), 0.28);
    MX.fill(o, vac, MX.rad(o, -14, 4, 8, 110, [[0, '#F4F7F2'], [1, '#E3EADF']]));
    o.strokeStyle = 'rgba(92,118,90,0.5)'; o.lineWidth = 0.6; MX.path(o, vac); o.stroke();
    const cushion = MX.blob(N[0] - 2, N[1] + 2, 29, 27, { seed: 4, wob: 0.07 }), strand = [[48, -28], [58, 6], [56, 44], [42, 86]];
    MX.fill(o, cushion, cyto);
    MX.taper(o, strand, 7.5, 5, cyto);
    o.save(); MX.path(o, vac); o.clip();
    o.strokeStyle = 'rgba(92,118,90,0.5)'; o.lineWidth = 0.6; MX.path(o, cushion); o.stroke();
    MX.taper(o, strand, 7.5, 5, 'rgba(0,0,0,0)', 'rgba(92,118,90,0.5)');
    MX.dots(o, R, 60, [36, -30, 34, 120], 0.3, 0.7, 'rgba(84,104,62,0.5)', (x, y) => U.distPoly(x, y, strand) < 2.2);
    o.restore();
    // the chloroplasts along the walls stream round the cell and are drawn live (below); this one rides the strand
    MX.chloro(o, R, 57, 20, 1.5, 8, 4, pal);
    // mitochondria in the gaps, just inside the chloroplasts
    for (let i = 0; i < cell.length; i++) {
      const a = cell[i], b = cell[(i + 1) % cell.length], [nx, ny, l, dx, dy] = inward(a, b, [0, 0]), n = Math.max(1, Math.round(l / 30));
      for (let k = 1; k < n; k++) { const x = a[0] + dx * k / n + nx * 20, y = a[1] + dy * k / n + ny * 20; if (Math.hypot(x - N[0], y - N[1]) > 24) PLANT.mito(o, R, x, y, Math.atan2(dy, dx), 9.5, 4.4); }
    }
    PLANT.mito(o, R, 40, -38, 2.2, 8, 3.8);
    PLANT.nucleus(o, R, N[0], N[1], 18.5);
    MX.vignette(o, 0.16); MX.grain(o, 0.05);
    MX.scaleBar(o, 46.7, '10 µm');
  },
  // cytoplasmic streaming: the thin cytoplasm flows round the cell along its walls and carries the chloroplasts with
  // it, about 3 µm a second (14 units; a lap in about 40 s). Beside the nucleus they slip out of focus behind its
  // cushion of cytoplasm. Each keeps its own grain pattern, so the eye can follow one all the way round
  live(x, st, t) {
    const P = PLANT_STREAM.path(), pal = st.pale ? PLANT_PAL.chlPale : PLANT_PAL.chl, a0 = x.globalAlpha, off = t * 14;
    for (let i = 0; i < P.n; i++) {
      const [px, py, a] = P.at(i / P.n * P.len + off), al = U.clamp((Math.hypot(px - 62, py + 50) - 18) / 14, 0, 1);
      if (al <= 0) continue;
      x.globalAlpha = a0 * al;
      x.save(); x.translate(px, py); x.rotate(a + ((i * 0.37) % 0.12) - 0.06); x.drawImage(PLANT_STREAM.sprite(i, pal), -15, -7.5, 30, 15); x.restore();
    }
    x.globalAlpha = a0;
  },
});

// ================================================================ ×20 000 chloroplast (electron micrograph, lightly coloured)
// spots: thylakoids / granum (-30,24) · stroma (-44,-30) · starch grain (22,40)
const CHLORO = {
  body(d = 0) {
    const p = [];
    for (let i = 0; i < 80; i++) { const t = i / 80 * TAU, c = Math.cos(t), s = Math.sin(t), k = 1 + 0.018 * MX.n(c * 2 + 3, s * 2 + 1, 4); p.push([(124 - d) * c * k, (64 - d) * s * k + 14 * c * c - 7]); }
    return p;
  },
  lam: (k, x) => 10 * k + 14 * (x / 124) ** 2 - 7 + MX.n(x * 0.04, k * 3.1, 7) * 1.4,
  starch: [[22, 40, 26, 12, -0.08], [-78, -10, 17, 10, 0.12]],
  granum(o, x, y, ang, w, n) {
    o.save(); o.translate(x, y); o.rotate(ang);
    const h = 1.28, y0 = -(n - 1) * h / 2;
    for (let j = 0; j < n; j++) {
      const e = Math.abs(j - (n - 1) / 2) / Math.max(1, n / 2), ww = w * (1 - 0.12 * e * e) + MX.n(j * 0.7, x * 0.1) * 1.2;
      o.fillStyle = '#28301F'; U.rr(o, -ww / 2, y0 + j * h - 0.5, ww, 1.0, 0.5); o.fill();
      o.fillStyle = 'rgba(150,160,132,0.9)'; o.fillRect(-ww / 2 + 1, y0 + j * h - 0.13, ww - 2, 0.26);
    }
    o.restore();
  },
};
plate('chloroplast', {
  key: st => st.pale ? 'pale' : 'green',
  still(o, st) {
    const R = MX.rng(21), pale = !!st.pale;
    MX.field(o, '#BCC0B2', '#9CA293', 5, 0.02, 110);
    MX.dots(o, R, 2200, [-141, -141, 282, 282], 0.3, 0.62, 'rgba(58,62,52,0.5)');
    // endoplasmic reticulum in the cytoplasm around it
    for (let i = 0; i < 7; i++) {
      const p = MX.strand(R, -140 + R() * 280, R() < 0.5 ? -120 + R() * 30 : 96 + R() * 30, R() * TAU, 50 + R() * 50, 3, 0.25);
      MX.line(o, p, 'rgba(52,58,46,0.6)', 1.6); MX.line(o, p, 'rgba(206,210,198,0.9)', 0.5);
    }
    // a slice of the cell wall across one corner, the vacuole in the other
    o.save(); o.beginPath(); o.moveTo(-141, -40); o.lineTo(-40, -141); o.lineTo(-141, -141); o.closePath(); o.clip();
    o.fillStyle = '#D3D6CC'; o.fillRect(-141, -141, 110, 110);
    o.strokeStyle = 'rgba(96,100,88,0.35)'; o.lineWidth = 0.45;
    for (let k = 0; k < 40; k++) { const d = -185 - k * 2.6; o.beginPath(); for (let x = -141; x < -30; x += 4) o.lineTo(x, d - x + MX.n(x * 0.1, k) * 1.2); o.stroke(); }
    o.restore();
    o.strokeStyle = 'rgba(40,44,36,0.85)'; o.lineWidth = 0.9; o.beginPath(); o.moveTo(-141, -40); o.lineTo(-40, -141); o.stroke();
    o.save(); o.beginPath(); o.moveTo(141, 59); o.lineTo(59, 141); o.lineTo(141, 141); o.closePath(); o.clip();
    o.fillStyle = '#E2E4DD'; o.fillRect(40, 40, 110, 110); o.restore();
    o.strokeStyle = 'rgba(52,56,46,0.75)'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(141, 59); o.lineTo(59, 141); o.stroke();
    // a mitochondrion cut across nearby
    o.save(); o.translate(-104, 104); o.rotate(-0.5);
    o.fillStyle = '#AEB3A4'; o.beginPath(); o.ellipse(0, 0, 26, 12, 0, 0, TAU); o.fill();
    o.strokeStyle = '#2E3428'; o.lineWidth = 0.8; o.stroke();
    o.strokeStyle = 'rgba(40,46,34,0.8)'; o.lineWidth = 0.7;
    for (let u = -18; u <= 18; u += 5) { o.beginPath(); o.moveTo(u, (u % 10 ? -1 : 1) * 10.5); o.quadraticCurveTo(u + 2, 0, u + 1, (u % 10 ? 1 : -1) * 3); o.stroke(); }
    o.restore();
    // the envelope: two membranes with a thin space between
    const outer = CHLORO.body(0), inner = CHLORO.body(2.4);
    MX.fill(o, outer, '#CDD1C4');
    o.strokeStyle = '#2E3428'; o.lineWidth = 0.9; MX.path(o, outer); o.stroke();
    MX.fill(o, inner, pale ? '#A9AE9A' : '#97A188');
    o.strokeStyle = '#2E3428'; o.lineWidth = 0.8; MX.path(o, inner); o.stroke();
    o.save(); MX.path(o, inner); o.clip();
    // stroma: granular ground substance, ribosomes, pale DNA regions with fibrils
    const sd = U.rgb('#5E6852');
    MX.tex(o, -130, -80, 260, 160, (x, y) => [sd[0], sd[1], sd[2], U.fbm(x * 0.3, y * 0.3, 3, 8) * 90], 256);
    for (const [x, y] of [[-10, -36], [70, 16], [-100, 30]]) {
      MX.fill(o, MX.blob(x, y, 9, 6, { seed: x + 3, wob: 0.3, n: 12 }), 'rgba(214,220,204,0.6)');
      for (let i = 0; i < 6; i++) MX.line(o, MX.strand(R, x - 5 + R() * 10, y - 3 + R() * 6, R() * TAU, 8, 1.5, 1.2), 'rgba(90,96,80,0.5)', 0.25);
    }
    MX.dots(o, R, 1400, [-130, -80, 260, 160], 0.28, 0.5, 'rgba(40,46,34,0.55)');
    // thylakoids: stroma lamellae running the length, grana stacked on them like piles of coins
    const inStarch = (x, y, m) => CHLORO.starch.some(([sx, sy, rx, ry]) => ((x - sx) / (rx + m)) ** 2 + ((y - sy) / (ry + m)) ** 2 < 1);
    const ks = pale ? [-5, -3, -1, 1, 3, 5] : [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
    for (const k of ks) {
      const pts = []; for (let x = -134; x <= 134; x += 3) pts.push([x, CHLORO.lam(k, x)]);
      MX.line(o, pts, '#353D2C', 1.05); MX.line(o, pts, '#B7BFA8', 0.32);
    }
    for (const k of ks) {
      const xs = k === 3 ? [-30] : [];
      for (let x = -128 + R() * 20; x < 128; x += 20 + R() * 16) if (!xs.some(v => Math.abs(v - x) < 24)) xs.push(x);
      for (const x of xs) {
        const y = CHLORO.lam(k, x);
        if (!U.inPoly(x - 11, y, inner) || !U.inPoly(x + 11, y, inner) || inStarch(x, y, 7) || Math.hypot(x + 44, y + 30) < 13) continue;
        const n = pale ? 2 + Math.floor(R() * 4) : 8 + Math.floor(R() * 9);
        CHLORO.granum(o, x, y, Math.atan(28 * x / 15376), 14 + R() * 8, n);
      }
    }
    // starch grains: electron-lucent, the membranes pushed round them
    for (const [sx, sy, rx, ry, rot] of CHLORO.starch) {
      o.save(); o.translate(sx, sy); o.rotate(rot);
      o.strokeStyle = '#2E3428'; o.lineWidth = 1.4; o.beginPath(); o.ellipse(0, 0, rx + 1.2, ry + 1.2, 0, 0, TAU); o.stroke();
      o.fillStyle = MX.rad(o, -rx * 0.2, -ry * 0.3, 1, rx, [[0, '#F6F7F1'], [1, '#DDE0D5']]); o.beginPath(); o.ellipse(0, 0, rx, ry, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(150,154,140,0.35)'; o.lineWidth = 0.35;
      for (let k = 1; k < 5; k++) { o.beginPath(); o.ellipse(rx * 0.05, 0, rx * k / 5, ry * k / 5, 0, 0, TAU); o.stroke(); }
      o.restore();
    }
    // plastoglobuli: dark lipid droplets, many more in a starved leaf
    for (let i = 0; i < (pale ? 30 : 12); i++) {
      const x = -110 + R() * 220, k = ks[Math.floor(R() * ks.length)], y = CHLORO.lam(k, x) + (R() - 0.5) * 4;
      if (!U.inPoly(x, y, inner) || inStarch(x, y, 3)) continue;
      MX.ball(o, x, y, 1.4 + R() * 1.8, '#1E231A', 0.25, 0.2);
    }
    o.restore();
    MX.vignette(o, 0.22); MX.grain(o, 0.1);
    MX.scaleBar(o, 40, '1 µm');
  },
});

// ================================================================ ×100 wheat leaf, cut across (fresh section)
// Grass leaf anatomy: ribs over the veins, bulliform cells in the furrows, a uniform mesophyll with air spaces,
// vascular bundles in two sheaths braced by fibre girders, stomata on both faces.
// spots: epidermis (-110,-76) · mesophyll (-55,-20) · xylem vessel (-8,-3) · phloem (0,11) · stoma (58,71)
const LEAF_X = {
  top: x => -78 - 11 * Math.exp(-((x / 26) ** 2)) - 6 * Math.exp(-(((x - 96) / 20) ** 2)) - 6 * Math.exp(-(((x + 96) / 20) ** 2))
    + 7 * Math.exp(-(((x - 48) / 12) ** 2)) + 7 * Math.exp(-(((x + 48) / 12) ** 2)) + 5 * Math.exp(-(((x - 142) / 12) ** 2)) + 5 * Math.exp(-(((x + 142) / 12) ** 2)),
  bot: x => 76 + 5 * Math.exp(-((x / 28) ** 2)) + 2 * Math.exp(-(((x - 96) / 20) ** 2)) + 2 * Math.exp(-(((x + 96) / 20) ** 2)),
  bundles: [[0, 2, 1], [-96, -2, 0.62], [96, -2, 0.62]],
  stLow: [-128, -40, 58, 128], stUp: [-68, 30], furrows: [-142, -48, 48, 142],
  bundle(o, R, bx, by, s) {
    const L = LEAF_X, wall = 'rgba(92,104,70,0.6)';
    // fibre girders brace the bundle against both epidermises
    const fibres = poly => {
      o.fillStyle = '#F1EDD2'; o.beginPath(); U.poly(o, poly, true); o.fill();
      const bb = U.bbox(poly);
      for (const [x, y] of MX.scatter(R, 90, 3.3 * s + 0.6, bb, (px, py) => U.inPoly(px, py, poly))) {
        const r = (1.5 + R() * 0.7) * Math.max(0.75, s);
        o.fillStyle = '#F8F5E2'; o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
        o.strokeStyle = 'rgba(150,138,86,0.75)'; o.lineWidth = 0.5; o.stroke();
        o.fillStyle = 'rgba(120,110,70,0.55)'; o.beginPath(); o.arc(x, y, 0.45, 0, TAU); o.fill();
      }
    };
    const t0 = L.top(bx) + 11, b0 = L.bot(bx) - 8, st = by - 30 * s, sb = by + 33 * s;
    fibres([[bx - 8 * s, t0], [bx + 8 * s, t0], [bx + 12 * s, st + 5 * s], [bx - 12 * s, st + 5 * s]]);
    fibres([[bx - 12 * s, sb - 5 * s], [bx + 12 * s, sb - 5 * s], [bx + 7 * s, b0], [bx - 7 * s, b0]]);
    // outer bundle sheath: a ring of large, pale parenchyma cells
    const nS = Math.round(13 * s + 3);
    for (let i = 0; i < nS; i++) {
      const a = i / nS * TAU, cx = bx + Math.cos(a) * 24 * s, cy = by + Math.sin(a) * 28 * s, r = 7.2 * s;
      const c = MX.blob(cx, cy, r, r * 0.92, { seed: i + bx, wob: 0.08, n: 12, rot: a });
      MX.fill(o, c, '#E4ECCF'); o.strokeStyle = wall; o.lineWidth = 0.5; MX.path(o, c); o.stroke();
      for (let k = 0; k < 3; k++) { const b = a + Math.PI + (k - 1) * 0.6; o.fillStyle = '#6FA04E'; o.beginPath(); o.ellipse(cx + Math.cos(b) * r * 0.55, cy + Math.sin(b) * r * 0.55, 1.6 * s + 0.4, 1 * s + 0.3, b, 0, TAU); o.fill(); }
    }
    // vascular tissue inside the thick-walled mestome sheath
    o.fillStyle = '#F2F3E8'; o.beginPath(); o.ellipse(bx, by, 17.5 * s, 21.5 * s, 0, 0, TAU); o.fill();
    const nM = Math.round(24 * s + 4);
    for (let i = 0; i < nM; i++) {
      const a = i / nM * TAU, x = bx + Math.cos(a) * 16.5 * s, y = by + Math.sin(a) * 20 * s;
      o.fillStyle = '#EFE7C2'; o.beginPath(); o.arc(x, y, 2.4 * s, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(140,120,60,0.85)'; o.lineWidth = 0.65 * s + 0.1; o.stroke();
    }
    // phloem: small thin-walled sieve tubes and companion cells, on the lower side
    const pc = [bx, by + 9 * s], ps = MX.scatter(R, 14, 3.6 * s, [pc[0] - 11 * s, pc[1] - 7 * s, 22 * s, 14 * s], (x, y) => ((x - pc[0]) / (10.5 * s)) ** 2 + ((y - pc[1]) / (7 * s)) ** 2 < 1);
    o.save(); o.beginPath(); o.ellipse(pc[0], pc[1], 10.5 * s, 7 * s, 0, 0, TAU); o.clip();
    o.fillStyle = '#F6F6EE'; o.fillRect(pc[0] - 12 * s, pc[1] - 8 * s, 24 * s, 16 * s);
    for (const c of MX.voronoi(ps, U.rectPts(pc[0] - 12 * s, pc[1] - 8 * s, 24 * s, 16 * s))) { o.strokeStyle = 'rgba(110,120,90,0.65)'; o.lineWidth = 0.35; o.beginPath(); U.poly(o, c, true); o.stroke(); }
    o.restore();
    // xylem, on the upper side: two big metaxylem vessels, a small protoxylem and its lacuna
    for (const k of [-1, 1]) {
      const x = bx + k * 8 * s, y = by - 5 * s, r = 6.3 * s;
      o.fillStyle = '#FAFBF6'; o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
      o.strokeStyle = '#A89A5C'; o.lineWidth = 1.3 * s + 0.2; o.stroke();
      o.strokeStyle = 'rgba(60,54,30,0.6)'; o.lineWidth = 0.3; o.beginPath(); o.arc(x, y, r - 0.7 * s, 0, TAU); o.stroke();
    }
    o.fillStyle = '#FAFBF6'; o.beginPath(); o.arc(bx, by - 13.5 * s, 2.7 * s, 0, TAU); o.fill(); o.strokeStyle = '#A89A5C'; o.lineWidth = 0.8 * s; o.stroke();
    for (const [dx, dy] of [[-3.5, -9], [3.5, -9], [0, 0.5], [-13, -4], [13, -4]]) { o.strokeStyle = 'rgba(120,120,90,0.5)'; o.lineWidth = 0.35; o.beginPath(); o.arc(bx + dx * s, by + dy * s, 1.7 * s, 0, TAU); o.stroke(); }
  },
  epidermis(o, R, up) {
    const L = LEAF_X, f = up ? L.top : L.bot, sgn = up ? 1 : -1, stom = up ? L.stUp : L.stLow;
    let x = -148;
    while (x < 148) {
      const fz = up ? L.furrows.find(c => Math.abs(x - c) < 13) : null;
      let w = fz != null ? 8.5 + R() * 3 : 8 + R() * 6;
      const s = stom.find(c => x < c + 8 && x + w > c - 8);
      if (s != null) { if (x < s - 8) w = s - 8 - x; else { x = s + 8; continue; } }
      const x1 = x + w, h = xx => fz != null ? 11 + 13 * Math.max(0, 1 - Math.abs(xx - fz) / 13) : (up ? 11.5 : 9) + MX.n(xx * 0.3, up ? 1 : 2) * 1.2;
      const q = [[x, f(x)], [x1, f(x1)], [x1, f(x1) + sgn * h(x1)], [x, f(x) + sgn * h(x)]];
      const sh = MX.soft(MX.inset(q, 0.45), fz != null ? 0.35 : 0.16);
      MX.fill(o, sh, fz != null ? '#F1F6F2' : '#F4F5EA');
      o.strokeStyle = 'rgba(80,98,62,0.6)'; o.lineWidth = 0.55; MX.path(o, sh); o.stroke();
      x = x1;
    }
    // outer wall and waxy cuticle
    const edge = []; for (let xx = -142; xx <= 142; xx += 2) edge.push([xx, f(xx)]);
    MX.line(o, edge, '#D9D09A', 1.9); MX.line(o, edge.map(([a, b]) => [a, b - sgn * 1.0]), 'rgba(70,80,50,0.65)', 0.45);
    // silica prickle hairs on the ribs of the upper face
    if (up) for (const px of [-104, -90, -8, 6, 18, 88, 102]) {
      const y = f(px);
      o.fillStyle = '#F6F4E4'; o.strokeStyle = 'rgba(90,96,66,0.7)'; o.lineWidth = 0.4;
      o.beginPath(); o.moveTo(px - 2, y + 0.5); o.quadraticCurveTo(px + 1, y - 3, px + 5, y - 6); o.quadraticCurveTo(px + 2, y - 2, px + 2, y + 0.5); o.closePath(); o.fill(); o.stroke();
    }
  },
  stoma(o, x, y) {
    for (const k of [-1, 1]) {
      o.fillStyle = MX.lit(o, x + k * 3.9, y, 3.6, '#B6CE88', 0.25, 0.25); o.beginPath(); o.arc(x + k * 3.9, y, 3.5, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(70,90,50,0.7)'; o.lineWidth = 0.45; o.stroke();
      o.strokeStyle = 'rgba(248,248,232,0.95)'; o.lineWidth = 1.2; o.beginPath(); o.arc(x + k * 3.9, y, 2.6, k < 0 ? -0.9 : Math.PI - 0.9, k < 0 ? 0.9 : Math.PI + 0.9); o.stroke();
      o.fillStyle = '#4E8A36'; for (const d of [-1.2, 1.2]) { o.beginPath(); o.arc(x + k * 4.6, y + d, 0.7, 0, TAU); o.fill(); }
      o.fillStyle = '#F2F4E8'; o.strokeStyle = 'rgba(80,98,62,0.6)'; o.lineWidth = 0.5;
      U.rr(o, x + k * 9 - 2.5, y - 4, 5, 8, 2.2); o.fill(); o.stroke();
    }
    o.fillStyle = '#2C3824'; o.beginPath(); o.ellipse(x, y, 0.8, 2.2, 0, 0, TAU); o.fill();
  },
};
plate('leafSection', {
  key: st => st.pale ? 'pale' : 'green',
  still(o, st) {
    const R = MX.rng(51), pal = st.pale ? PLANT_PAL.chlPale : PLANT_PAL.chl, L = LEAF_X;
    MX.field(o, '#ECEEE6', '#D9DDD0', 2, 0.015, 60);
    MX.dots(o, R, 40, [-141, -141, 282, 282], 0.4, 1.4, 'rgba(120,120,100,0.25)');
    const top = [], bot = [];
    for (let x = -142; x <= 142; x += 2) { top.push([x, L.top(x)]); bot.push([x, L.bot(x)]); }
    // air spaces show through between the mesophyll cells
    o.fillStyle = '#E4E8D8'; o.beginPath(); U.poly(o, top.concat(bot.slice().reverse()), true); o.fill();
    const zone = (x, y) => {
      if (y < L.top(x) + 13 || y > L.bot(x) - 10) return false;
      for (const [bx, by, s] of L.bundles) { if (((x - bx) / (31 * s)) ** 2 + ((y - by) / (35 * s)) ** 2 < 1 || Math.abs(x - bx) < 10 * s) return false; }
      for (const sx of L.stLow) if (Math.hypot(x - sx, y - (L.bot(sx) - 16)) < 9) return false;
      for (const sx of L.stUp) if (Math.hypot(x - sx, y - (L.top(sx) + 18)) < 8) return false;
      return true;
    };
    const bound = U.rectPts(-150, -110, 300, 210);
    const sites = MX.relax(MX.scatter(R, 330, 10, [-150, -100, 300, 190], zone), bound, 1).filter(p => zone(p[0], p[1]));
    const cyto = st.pale ? '#DADDB8' : '#CFDDB0', chlCol = pal[0], chlEdge = pal[1];
    for (const c of MX.voronoi(sites, bound)) {
      if (c.length < 3) continue;
      const sh = MX.soft(MX.inset(c, 1.1 + R() * 1.7), 0.3), cc = MX.centroid(c);
      MX.fill(o, sh, cyto);
      o.strokeStyle = 'rgba(78,98,60,0.55)'; o.lineWidth = 0.5; MX.path(o, sh); o.stroke();
      // chloroplasts pressed against the inside of the wall
      const ring = sh.concat([sh[0]]), n = Math.max(5, Math.round(ring.length * 0.9));
      for (let i = 0; i < n; i++) {
        const [x, y, a] = MX.along(ring, (i + R() * 0.3) / n), dx = cc[0] - x, dy = cc[1] - y, d = Math.hypot(dx, dy) || 1;
        o.fillStyle = chlCol; o.strokeStyle = chlEdge; o.lineWidth = 0.3;
        o.beginPath(); o.ellipse(x + dx / d * 2.3, y + dy / d * 2.3, 2.1, 1.3, a, 0, TAU); o.fill(); o.stroke();
      }
      if (R() < 0.22) { o.fillStyle = 'rgba(150,150,125,0.55)'; o.beginPath(); o.arc(cc[0] + (R() - 0.5) * 3, cc[1] + (R() - 0.5) * 3, 2.3, 0, TAU); o.fill(); }
    }
    // substomatal chambers: air under each stoma
    for (const sx of L.stLow) MX.fill(o, MX.blob(sx, L.bot(sx) - 15, 9, 7, { seed: sx + 200, wob: 0.2, n: 12 }), '#E4E8D8');
    for (const sx of L.stUp) MX.fill(o, MX.blob(sx, L.top(sx) + 17, 8, 6, { seed: sx + 300, wob: 0.2, n: 12 }), '#E4E8D8');
    for (const [bx, by, s] of L.bundles) L.bundle(o, R, bx, by, s);
    L.epidermis(o, R, true); L.epidermis(o, R, false);
    for (const sx of L.stLow) L.stoma(o, sx, L.bot(sx) - 4.5);
    for (const sx of L.stUp) L.stoma(o, sx, L.top(sx) + 5);
    MX.vignette(o, 0.14); MX.grain(o, 0.04);
    MX.scaleBar(o, 80, '100 µm');
  },
});

// ================================================================ ×400 willow leaf underside (epidermal peel)
// Jigsaw-shaped pavement cells, kidney-shaped guard cells with chloroplasts, silky hairs, green tissue glowing
// through from below. Arrows show which way the gases go through an open stoma.
// spots: stoma (0,-4) · CO₂ arrow (-62,52) · O₂ arrow (62,52)
const WILLOW_ST = [[0, -4, 0.3, 1.15], [-96, -80, 1.2, 1], [74, -96, -0.4, 1], [-104, 34, 0.2, 0.95], [100, 24, 1.9, 1], [-30, 98, 0.8, 0.95], [60, 104, -1.1, 1], [-46, -52, 2.3, 0.9], [118, -40, 0.9, 0.9], [22, -118, 1.5, 0.9]];
const WILLOW = {
  stoma(o, R, x, y, a, k) {
    o.save(); o.translate(x, y); o.rotate(a); o.scale(k, k);
    // two subsidiary cells lying alongside the guard cells
    const ringP = MX.blob(0, 0, 26, 21, { seed: Math.round(x) + 50, wob: 0.05, n: 20 });
    MX.fill(o, ringP, 'rgba(244,246,236,0.96)');
    o.strokeStyle = 'rgba(84,104,70,0.6)'; o.lineWidth = 1.2; MX.path(o, ringP); o.stroke();
    o.beginPath(); o.moveTo(-15, 0); o.lineTo(-25.5, 0); o.moveTo(15, 0); o.lineTo(25.5, 0); o.stroke();
    // guard cells: two kidneys round the pore
    const pore = 2.3;
    for (const s of [-1, 1]) {
      o.beginPath();
      o.ellipse(0, 0, 15, 11, 0, s < 0 ? Math.PI : 0, s < 0 ? TAU : Math.PI, false);
      o.ellipse(0, 0, 10.5, pore, 0, s < 0 ? TAU : Math.PI, s < 0 ? Math.PI : 0, true);
      o.closePath();
      o.fillStyle = MX.lin(o, 0, s * 11, 0, 0, [[0, '#7FA85A'], [1, '#B4D286']]); o.fill();
      o.fillStyle = 'rgba(160,160,130,0.45)'; o.beginPath(); o.ellipse(0, s * 6.6, 2.6, 1.8, 0, 0, TAU); o.fill();
      for (let i = 0; i < 10; i++) {
        const t = Math.PI * (0.12 + 0.76 * R()), u = 0.25 + 0.55 * R(), cx = Math.cos(t) * (10.5 + 4.5 * u) * (s < 0 ? -1 : 1), cy = s * Math.sin(t) * (pore + (11 - pore) * u);
        o.fillStyle = '#4A8A34'; o.beginPath(); o.ellipse(cx, cy, 1.3, 0.9, t, 0, TAU); o.fill();
      }
    }
    o.fillStyle = MX.lin(o, 0, -pore, 0, pore, [[0, '#101A0E'], [0.5, '#2E3E28'], [1, '#101A0E']]); o.beginPath(); o.ellipse(0, 0, 10.5, pore, 0, 0, TAU); o.fill();
    o.strokeStyle = '#F6F8EC'; o.lineWidth = 1.5; o.beginPath(); o.ellipse(0, 0, 10.9, pore + 0.5, 0, 0, TAU); o.stroke();
    o.strokeStyle = 'rgba(50,70,40,0.9)'; o.lineWidth = 0.45; o.beginPath(); o.ellipse(0, 0, 11.6, pore + 1.2, 0, 0, TAU); o.stroke();
    o.strokeStyle = 'rgba(60,90,45,0.85)'; o.lineWidth = 0.6; o.beginPath(); o.ellipse(0, 0, 15, 11, 0, 0, TAU); o.stroke();
    o.restore();
  },
};
plate('willowLeaf', {
  still(o, st) {
    const R = MX.rng(61);
    MX.field(o, '#E8EEDF', '#CBD8BC', 4, 0.012, 70);
    // the green tissue under the peel, out of focus
    MX.layer(o, x => {
      for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(${90 + R() * 30 | 0},${140 + R() * 30 | 0},${70 + R() * 20 | 0},${0.25 + R() * 0.2})`; x.beginPath(); x.ellipse(-150 + R() * 300, -150 + R() * 300, 10 + R() * 12, 8 + R() * 10, R() * 3, 0, TAU); x.fill(); }
      MX.line(x, [[-160, 60], [-40, 30], [60, -40], [160, -120]], 'rgba(70,110,50,0.35)', 22);
    }, 7, 0.55);
    // pavement cells
    const clear = (x, y) => WILLOW_ST.every(([sx, sy, , k]) => Math.hypot(x - sx, y - sy) > 24 * k);
    const bound = U.rectPts(-165, -165, 330, 330);
    const cells = MX.voronoi(MX.relax(MX.scatter(R, 120, 23, [-160, -160, 320, 320], clear), bound, 2), bound);
    for (const c of cells) { if (c.length < 3) continue; const t = R(); o.fillStyle = `rgba(${240 + t * 8 | 0},${244 + t * 6 | 0},${230 + t * 10 | 0},0.72)`; o.beginPath(); U.poly(o, c, true); o.fill(); }
    for (const c of cells) if (c.length > 2 && R() < 0.35) { const [cx, cy] = MX.centroid(c); if (!clear(cx, cy)) continue; o.fillStyle = 'rgba(150,150,130,0.32)'; o.beginPath(); o.ellipse(cx + (R() - 0.5) * 8, cy + (R() - 0.5) * 8, 3.2, 2.4, R() * 3, 0, TAU); o.fill(); }
    // their walls wander like jigsaw pieces
    for (const [a, b] of MX.edges(cells)) {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1) continue;
      const pts = MX.wavy(a, b, 2.4, Math.max(1, Math.round(l / 9)), Math.round(a[0] * 13 + b[1] * 7));
      MX.line(o, pts, 'rgba(84,104,70,0.55)', 1.35); MX.line(o, pts, 'rgba(246,248,238,0.8)', 0.45);
    }
    for (const [x, y, a, k] of WILLOW_ST) WILLOW.stoma(o, R, x, y, a, k);
    // silky hairs lying across the surface
    MX.layer(o, x => {
      for (const [x0, y0, a0] of [[-150, -104, -0.25], [150, 70, -2.3]]) MX.taper(x, MX.strand(R, x0, y0, a0, 190, 4, 0.12), 5.5, 0.6, 'rgba(250,252,246,0.8)', 'rgba(120,130,110,0.6)');
    }, 0.7, 0.9);
    MX.vignette(o, 0.15); MX.grain(o, 0.04);
    // which way the gases go through an open stoma in daylight
    MX.note(o, [[-120, 96], [-80, 70], [-40, 36], [-9, 6]], '#2F5E8C', 2.2, 'CO₂', [-122, 84]);
    MX.note(o, [[9, 6], [40, 36], [80, 70], [120, 96]], '#A0322A', 2.2, 'O₂', [118, 84]);
    MX.note(o, [[6, -14], [36, -48], [70, -66], [106, -76]], '#5A8AB0', 1.6, 'H₂O', [120, -90]);
    MX.scaleBar(o, 56, '50 µm');
  },
});

// ================================================================ ×1 siyez (einkorn) wheat, with the soil cut away
// spots: roots (-40,100) · leaf (62,-26) · ear (4,-112) · oldest leaf (-57,8)
plate('wheatPlant', {
  key: st => (st.pale ? 'p' : 'g') + (st.ripe ? 'r' : ''),
  still(o, st) {
    const R = MX.rng(31), pale = !!st.pale, ripe = !!st.ripe;
    BOT.sky(o, 62); BOT.soil(o, R, 62);
    // a fibrous root system; one root is followed down to its tip
    const roots = [[[0, 62], [-20, 80], [-40, 100], [-52, 126]]];
    for (let i = 0; i < 22; i++) roots.push(MX.strand(R, (R() - 0.5) * 8, 64, Math.PI / 2 + (R() - 0.5) * 2.2, 40 + R() * 60, 3, 0.35, Math.PI / 2));
    roots.forEach((r, i) => {
      MX.taper(o, r, i ? 1.5 : 2.4, 0.5, '#E8DCBC', 'rgba(120,96,62,0.7)');
      for (let k = 0; k < 3; k++) { const [x, y, a] = MX.along(r, 0.25 + R() * 0.6); MX.taper(o, MX.strand(R, x, y, a + (R() < 0.5 ? -1 : 1) * (0.8 + R() * 0.6), 8 + R() * 14, 2, 0.4), 0.8, 0.25, '#E8DCBC'); }
      const tip = r.slice(-7); o.strokeStyle = 'rgba(240,232,210,0.75)'; o.lineWidth = 0.22;
      for (let k = 0; k < 22; k++) { const [x, y, a] = MX.along(tip, R() * 0.8), s = R() < 0.5 ? -1 : 1, l = 1.5 + R() * 2.5; o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a + s * 1.4) * l, y + Math.sin(a + s * 1.4) * l); o.stroke(); }
    });
    const G = ripe ? ['#D9B868', '#B98E3E'] : pale ? ['#B7C66A', '#8FA048'] : ['#5E9A3E', '#3F7A2C'];
    const leafFill = (a, b) => MX.lin(o, a[0], a[1], b[0], b[1], [[0, G[1]], [0.5, G[0]], [1, U.shade(G[0], 0.15)]]);
    // a side shoot (tiller) at the base
    BOT.blade(o, [-3, 58], [-22, 22], [-64, -6], 5, leafFill([-3, 58], [-64, -6]));
    BOT.blade(o, [4, 58], [30, 34], [76, 28], 5, leafFill([4, 58], [76, 28]));
    // the stem, jointed at the nodes
    const sx = y => U.lerp(0, 3, (62 - y) / 146);
    MX.taper(o, [[0, 62], [1, 20], [2, -30], [3, -84]], 5, 3.2, ripe ? '#E0C47A' : '#A6C878', 'rgba(60,80,30,0.6)');
    for (const ny of [36, -2, -44]) {
      o.fillStyle = MX.lin(o, sx(ny) - 3.6, 0, sx(ny) + 3.6, 0, [[0, ripe ? '#A8883E' : '#5E8A3A'], [0.5, ripe ? '#C8A457' : '#86B058'], [1, ripe ? '#98782E' : '#4E7A2E']]);
      U.rr(o, sx(ny) - 3.6, ny - 1.9, 7.2, 3.8, 1.8); o.fill();
      o.fillStyle = 'rgba(160,190,110,0.35)'; o.fillRect(sx(ny) - 3.2, ny - 20, 6.4, 18);
    }
    // the oldest leaf: when nitrogen runs short it yellows first, from the tip back along the midrib
    const oldFill = pale ? MX.lin(o, -2, 48, -126, 24, [[0, '#9FB24E'], [0.45, '#D8C75C'], [0.85, '#DCC062'], [0.93, '#9A7038'], [1, '#6E4E28']]) : leafFill([-2, 48], [-126, 24]);
    BOT.blade(o, [-2, 48], [-50, -20], [-126, 24], 7.5, oldFill);
    BOT.blade(o, [2, 22], [60, -60], [128, -4], 8, leafFill([2, 22], [128, -4]));
    BOT.blade(o, [2, -30], [-40, -100], [-96, -70], 7, leafFill([2, -30], [-96, -70]));
    BOT.blade(o, [3, -58], [30, -110], [70, -104], 5.5, leafFill([3, -58], [70, -104]));
    // the ear: einkorn carries one grain per spikelet, in two flat rows, each with a long awn
    const rach = [[3, -84], [4.5, -108], [6, -132]];
    MX.line(o, rach, ripe ? '#A8823A' : '#6E9040', 1.3);
    for (let i = 0; i < 12; i++) {
      const [x, y] = MX.along(rach, 0.04 + i / 12 * 0.92), s = i % 2 ? 1 : -1, cx = x + s * 3.6, cy = y + 1;
      o.strokeStyle = ripe ? '#C9A45A' : '#A9C070'; o.lineWidth = 0.45;
      o.beginPath(); o.moveTo(cx + s * 1.5, cy - 5); o.quadraticCurveTo(cx + s * 6, cy - 18, cx + s * (10 + i * 0.3), cy - 30); o.stroke();
      o.save(); o.translate(cx, cy); o.rotate(s * 0.32);
      o.fillStyle = MX.lit(o, 0, 0, 6, ripe ? '#D0A452' : '#9DC064', 0.3, 0.35); o.beginPath(); o.ellipse(0, 0, 3.4, 6.2, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(60,70,30,0.6)'; o.lineWidth = 0.4; o.stroke();
      o.beginPath(); o.moveTo(0, -5.5); o.lineTo(0, 5.5); o.stroke();
      o.restore();
    }
    MX.vignette(o, 0.1);
    MX.scaleBar(o, 17, '5 cm');
  },
});

// ================================================================ ×1 chickpea, roots dug out
// spots: nodules (-40,70) · root hairs (58,100) · compound leaf (-40,-36)
plate('chickpea', {
  still(o, st) {
    const R = MX.rng(41), rc = '#E4D3AE', re = 'rgba(122,96,60,0.7)';
    BOT.sky(o, 30); BOT.soil(o, R, 30, '#806046');
    MX.taper(o, [[0, 30], [2, 70], [-2, 110], [0, 142]], 5, 1.4, rc, re);
    const A = [[0, 46], [-30, 62], [-56, 84], [-76, 108]], B = [[0, 70], [30, 82], [52, 96], [70, 112]], Cc = [[0, 90], [-26, 108], [-46, 126]], D = [[1, 56], [34, 62], [64, 76]];
    for (const r of [A, B, Cc, D]) MX.taper(o, r, 2.4, 0.7, rc, re);
    for (let i = 0; i < 16; i++) { const [x, y, a] = MX.along([A, B, Cc, D][i % 4], 0.2 + R() * 0.7); MX.taper(o, MX.strand(R, x, y, a + (R() < 0.5 ? -1 : 1) * (0.7 + R() * 0.7), 10 + R() * 22, 2, 0.4), 1, 0.3, rc); }
    // root hairs: a white fuzz just behind the growing tip
    o.strokeStyle = 'rgba(246,240,222,0.8)'; o.lineWidth = 0.22;
    for (let k = 0; k < 150; k++) {
      const [x, y, a] = MX.along(B, 0.55 + R() * 0.36), s = R() < 0.5 ? -1 : 1, l = 2 + R() * 4;
      o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + Math.cos(a + s * 1.3) * l * 0.6, y + Math.sin(a + s * 1.3) * l * 0.6, x + Math.cos(a + s * 1.5) * l, y + Math.sin(a + s * 1.5) * l); o.stroke();
    }
    // chickpea nodules are elongated and often branched
    for (const [x, y, a, n] of [[-40, 70, -0.6, 3], [-50, 78, 0.9, 2], [-28, 62, 2.2, 2], [-62, 88, 0.2, 1], [20, 78, 1.9, 2], [-16, 102, 0.4, 1], [44, 64, 2.6, 1]]) PLANT.nodules(o, R, x, y, a, n);
    // the shoot, hairy all over
    const stem = [[0, 30], [-2, -20], [2, -70], [4, -124]];
    MX.taper(o, stem, 4.2, 1.6, '#6E9A4A', 'rgba(40,60,20,0.6)');
    o.strokeStyle = 'rgba(220,235,200,0.6)'; o.lineWidth = 0.2;
    for (let k = 0; k < 120; k++) { const [x, y, a] = MX.along(stem, R()), s = R() < 0.5 ? -1 : 1; o.beginPath(); o.moveTo(x + Math.cos(a + s * 1.57) * 1.6, y + Math.sin(a + s * 1.57) * 1.6); o.lineTo(x + Math.cos(a + s * 1.2) * 3.4, y + Math.sin(a + s * 1.2) * 3.4); o.stroke(); }
    // a pod, and a flower opening at the top
    MX.line(o, [[2, -58], [26, -56], [44, -60]], '#6E9A4A', 1);
    o.save(); o.translate(58, -60); o.rotate(0.25);
    o.fillStyle = MX.lit(o, 0, 0, 14, '#A9B868', 0.3, 0.35); o.beginPath(); o.ellipse(0, 0, 13, 8, 0, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(90,100,50,0.7)'; o.lineWidth = 0.5; o.stroke();
    o.strokeStyle = 'rgba(240,240,220,0.55)'; o.lineWidth = 0.2;
    for (let a = 0; a < TAU; a += 0.12) { o.beginPath(); o.moveTo(Math.cos(a) * 13, Math.sin(a) * 8); o.lineTo(Math.cos(a) * 15, Math.sin(a) * 9.8); o.stroke(); }
    o.strokeStyle = '#8A9A4A'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(13, 0); o.quadraticCurveTo(17, -1, 19, -4); o.stroke();
    o.restore();
    MX.line(o, [[2, -74], [20, -80], [38, -84]], '#6E9A4A', 0.9);
    o.save(); o.translate(42, -86);
    o.fillStyle = '#5E8A3E'; o.beginPath(); o.moveTo(-4, 2); o.lineTo(-1, -2); o.lineTo(2, 2); o.closePath(); o.fill();
    o.fillStyle = MX.lit(o, 2, -4, 8, '#F6E6EE', 0.2, 0.25); o.beginPath(); o.ellipse(2, -5, 6, 7, 0.3, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(160,90,130,0.45)'; o.lineWidth = 0.3; for (let k = -2; k <= 2; k++) { o.beginPath(); o.moveTo(0, 0); o.lineTo(2 + k * 2, -10); o.stroke(); }
    o.fillStyle = '#F2DCE6'; o.beginPath(); o.ellipse(6, 0, 4, 2.6, 0.4, 0, TAU); o.fill();
    o.restore();
    // compound leaves: many small toothed leaflets on each stalk
    PLANT.pinnate(o, R, [[-1, -38], [-22, -40], [-42, -43], [-60, -50]], 9, '#78A254');
    PLANT.pinnate(o, R, [[0, -4], [24, -10], [44, -18], [62, -30]], 9, '#709C4E');
    PLANT.pinnate(o, R, [[1, -72], [-18, -80], [-36, -90], [-52, -104]], 8, '#7EA85A');
    PLANT.pinnate(o, R, [[3, -104], [18, -112], [32, -124]], 6.5, '#86AE60');
    PLANT.pinnate(o, R, [[-1, 14], [-24, 12], [-44, 4]], 7.5, '#6A964A');
    MX.vignette(o, 0.1);
    MX.scaleBar(o, 35, '5 cm');
  },
});

// ================================================================ ×1 white clover
// spots: flower head (30,-80) · nodules (-40,70) · leaf (-6,-100)
const CLOVER = {
  leaf(o, R, x, y, r, rot) {
    for (let i = 0; i < 3; i++) {
      const a = rot - Math.PI / 2 + (i - 1) * 2.1;
      o.save(); o.translate(x, y); o.rotate(a);
      const pts = [];
      for (let k = 0; k < 24; k++) { const t = k / 24 * TAU, c = Math.cos(t), s = Math.sin(t), notch = c > 0.9 ? 1 - (c - 0.9) * 2.2 * (1 - Math.abs(s) * 3) : 1; pts.push([r * 0.55 + c * r * 0.55 * notch, s * r * 0.42 * (0.7 + 0.3 * c)]); }
      o.fillStyle = MX.lin(o, 0, -r * 0.4, 0, r * 0.4, [[0, '#4E8A3E'], [1, '#2F6A2C']]); o.beginPath(); MX.curve(o, pts); o.fill();
      o.strokeStyle = 'rgba(20,50,20,0.6)'; o.lineWidth = 0.4; o.stroke();
      // the pale chevron typical of white clover
      o.strokeStyle = 'rgba(210,228,196,0.8)'; o.lineWidth = r * 0.07; o.beginPath(); o.moveTo(r * 0.3, -r * 0.24); o.lineTo(r * 0.56, 0); o.lineTo(r * 0.3, r * 0.24); o.stroke();
      o.strokeStyle = 'rgba(190,220,170,0.5)'; o.lineWidth = 0.35; o.beginPath(); o.moveTo(0, 0); o.lineTo(r * 1.02, 0); o.stroke();
      for (let k = 1; k < 6; k++) { o.beginPath(); o.moveTo(r * k * 0.18, 0); o.lineTo(r * (k * 0.18 + 0.14), -r * 0.3); o.moveTo(r * k * 0.18, 0); o.lineTo(r * (k * 0.18 + 0.14), r * 0.3); o.stroke(); }
      o.restore();
    }
  },
};
plate('clover', {
  still(o, st) {
    const R = MX.rng(45), rc = '#E6D8B6', re = 'rgba(122,96,60,0.7)';
    BOT.sky(o, 40); BOT.soil(o, R, 40, '#7E5E44');
    // creeping stem (stolon) rooting at its nodes
    const stolon = [[-150, 42], [-100, 38], [-40, 38], [20, 36], [80, 36], [150, 34]];
    for (const nx of [-100, -40, 20, 80]) {
      for (let k = 0; k < 5; k++) MX.taper(o, MX.strand(R, nx, 40, Math.PI / 2 + (R() - 0.5) * 1.4, 30 + R() * 50, 3, 0.3, Math.PI / 2), 1.6, 0.4, rc, re);
    }
    const main = [[-40, 40], [-44, 60], [-38, 84], [-46, 112]];
    MX.taper(o, main, 2.2, 0.6, rc, re);
    for (const [x, y] of [[-40, 70], [-45, 64], [-36, 76], [-43, 90], [-38, 98], [-102, 66], [-94, 80], [22, 62], [16, 76], [84, 70]]) {
      o.fillStyle = MX.lit(o, x, y, 2.8, '#D9A08A', 0.35, 0.35); o.beginPath(); o.arc(x, y, 2.4 + R() * 0.8, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(110,70,50,0.6)'; o.lineWidth = 0.35; o.stroke();
    }
    MX.tube(o, stolon, 3.2, '#8DAE5E');
    // leaves on long stalks, and a flower head
    const leaves = [[[20, 36], [4, -30], [-6, -90]], [[-100, 38], [-104, -10], [-92, -40]], [[80, 36], [84, -8], [70, -30]], [[-40, 38], [-50, 10], [-56, -12]], [[80, 36], [104, 0], [110, -60]]];
    for (const p of leaves) MX.line(o, p, '#7FA256', 1.4);
    MX.line(o, [[80, 36], [50, -20], [30, -64]], '#86A85A', 1.6);
    CLOVER.leaf(o, R, -6, -100, 16, 0.1); CLOVER.leaf(o, R, -92, -46, 13, -0.4); CLOVER.leaf(o, R, 70, -36, 12, 0.5);
    CLOVER.leaf(o, R, -56, -18, 11, -0.2); CLOVER.leaf(o, R, 110, -66, 12, 0.3);
    // the "flower" is a head of dozens of tiny florets; the lowest ones are already fading and turning down
    const fx = 30, fy = -80;
    for (let i = 0; i < 70; i++) {
      const a = R() * TAU, d = Math.sqrt(R()) * 15, x = fx + Math.cos(a) * d, y = fy + Math.sin(a) * d, old = y > fy + 8;
      o.save(); o.translate(x, y); o.rotate(Math.atan2(y - fy, x - fx) + (old ? 0.6 : 0));
      o.fillStyle = old ? '#C8A890' : U.pick(['#F7F2EA', '#F4ECE4', '#F2E4E6'], R()); o.beginPath(); o.ellipse(2.5, 0, 3.2, 1.4, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(150,120,110,0.5)'; o.lineWidth = 0.25; o.stroke();
      o.restore();
    }
    o.fillStyle = 'rgba(255,255,255,0.18)'; o.beginPath(); o.arc(fx - 4, fy - 5, 8, 0, TAU); o.fill();
    MX.vignette(o, 0.1);
    MX.scaleBar(o, 23, '2 cm');
  },
});

// ================================================================ ×100 root nodule cut lengthwise, with a ×1000 window
// Zones from the tip down: meristem, infection zone, the pink nitrogen-fixing zone, the greenish old base.
// spots: pink tissue (-40,-6) · bacteroids in the window (78,-60)
const NODULE = {
  cx: -30,
  outline(d = 0) {
    const right = [];
    for (let i = 0; i <= 44; i++) {
      const t = i / 44, y = -106 + d + t * (206 - d * 1.2);
      const w = Math.max(0, 66 * Math.pow(Math.sin(Math.min(1, t * 1.6) * Math.PI / 2), 0.6) * (1 - 0.42 * Math.max(0, (t - 0.72) / 0.28) ** 1.4) - d);
      right.push([NODULE.cx + w, y]);
    }
    return right.concat(right.slice().reverse().map(([x, y]) => [2 * NODULE.cx - x, y]));
  },
  zoom(o, R) {
    o.fillStyle = '#E6B2B0'; o.fillRect(-60, -60, 120, 120);
    const sites = [[-30, -26], [26, -30], [-24, 30], [34, 24], [0, 0], [-62, 0], [62, 0], [0, -62], [0, 62]];
    const cells = MX.voronoi(sites, U.rectPts(-70, -70, 140, 140));
    cells.forEach((c, i) => {
      const sh = MX.soft(MX.inset(c, 1.6), 0.2), infected = i !== 1 && i !== 6;
      if (infected) {
        MX.fill(o, sh, MX.rad(o, sites[i][0], sites[i][1], 2, 40, [[0, '#DC7A82'], [1, '#C45864']]));
        o.save(); MX.path(o, sh); o.clip();
        for (let k = 0; k < 170; k++) {
          const x = sites[i][0] - 34 + R() * 68, y = sites[i][1] - 34 + R() * 68, a = R() * TAU;
          o.fillStyle = 'rgba(248,196,200,0.55)'; o.beginPath(); o.ellipse(x, y, 2.9, 1.4, a, 0, TAU); o.fill();
          MX.rod(o, x, y, a, 3.4 + R() * 1.2, 1.15, '#8A2638');
        }
        if (i === 4) PLANT.nucleus(o, R, 6, 4, 6.5, '#B8A0A6');
        for (let k = 0; k < 2; k++) { o.fillStyle = 'rgba(250,236,236,0.8)'; o.beginPath(); o.arc(sites[i][0] - 8 + R() * 16, sites[i][1] - 8 + R() * 16, 2 + R() * 2, 0, TAU); o.fill(); }
        o.restore();
      } else {
        MX.fill(o, sh, '#F3E6DE');
        MX.fill(o, MX.soft(MX.inset(c, 7), 0.3), '#F8F1EC');
        const ring = sh.concat([sh[0]]);
        for (let k = 0; k < 14; k++) { const [x, y] = MX.along(ring, k / 14 + R() * 0.02), [cx, cy] = MX.centroid(c), dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy) || 1; MX.ball(o, x + dx / d * 4, y + dy / d * 4, 1.4 + R(), '#FBF8EE', 0.1, 0.25); }
      }
      o.strokeStyle = '#F7EFE8'; o.lineWidth = 1.5; MX.path(o, sh); o.stroke();
      o.strokeStyle = 'rgba(120,70,60,0.5)'; o.lineWidth = 0.35; MX.path(o, sh); o.stroke();
    });
  },
};
plate('nodule', {
  still(o, st) {
    const R = MX.rng(71), cx = NODULE.cx;
    MX.field(o, '#F1EEE4', '#DCD6C4', 6, 0.012, 60);
    // the parent root runs along the bottom, cut lengthwise
    o.fillStyle = MX.lin(o, 0, 102, 0, 141, [[0, '#E9DCC0'], [0.4, '#F1E8CE'], [0.5, '#EADFAE'], [0.62, '#F1E8CE'], [1, '#DDCCA4']]); o.fillRect(-141, 102, 282, 40);
    o.strokeStyle = 'rgba(140,116,76,0.4)'; o.lineWidth = 0.35;
    for (let row = 0; row < 7; row++) { const y = 104 + row * 5.6; for (let x = -141 + (row % 2) * 6; x < 141; x += 11 + R() * 3) { o.strokeRect(x, y, 11, 5.6); } }
    o.strokeStyle = 'rgba(150,130,70,0.55)'; o.lineWidth = 0.5;
    for (const y of [120, 124]) { o.beginPath(); for (let x = -141; x < 141; x += 2) o.lineTo(x, y + Math.sin(x * 0.9) * 0.8); o.stroke(); }
    // the nodule: an outer cortex, then the central tissue in four zones
    const body = NODULE.outline(0), core = NODULE.outline(12);
    MX.fill(o, body, '#E6D5B2');
    o.save(); o.beginPath(); U.poly(o, body, true); o.clip();
    const cs = MX.scatter(R, 420, 5, [cx - 70, -110, 140, 214], (x, y) => U.inPoly(x, y, body) && !U.inPoly(x, y, core));
    for (const c of MX.voronoi(cs, U.rectPts(cx - 75, -115, 150, 225))) { o.strokeStyle = 'rgba(140,110,70,0.35)'; o.lineWidth = 0.3; o.beginPath(); U.poly(o, c, true); o.stroke(); }
    o.restore();
    o.save(); o.beginPath(); U.poly(o, core, true); o.clip();
    const zoneOf = (x, y) => { const yy = y + MX.n(x * 0.05, 4) * 6; return yy < -84 ? 0 : yy < -58 ? 1 : yy < 60 ? 2 : 3; };
    const sites = MX.scatter(R, 700, 6.4, [cx - 60, -100, 120, 200], (x, y) => U.inPoly(x, y, core));
    const cells = MX.voronoi(sites, U.rectPts(cx - 70, -110, 140, 214));
    cells.forEach((c, i) => {
      if (c.length < 3) return;
      const [x, y] = sites[i], z = zoneOf(x, y), sh = MX.soft(MX.inset(c, 0.35), 0.18);
      let col;
      if (z === 0) col = '#F4EEDC';
      else if (z === 1) col = U.mix('#F0CFC6', '#E8B4AE', R());
      else if (z === 2) col = R() < 0.72 ? U.mix('#D05866', '#BF4656', R()) : '#F2DAD2';
      else col = U.mix('#9EA56C', '#8A8E58', R());
      MX.fill(o, sh, col);
      if (z === 2 && col !== '#F2DAD2') MX.dots(o, R, 10, U.bbox(c), 0.25, 0.5, 'rgba(120,30,44,0.5)', (px, py) => U.inPoly(px, py, c));
      if (z === 2 && col === '#F2DAD2') MX.dots(o, R, 4, U.bbox(c), 0.5, 0.9, 'rgba(255,252,244,0.95)', (px, py) => U.inPoly(px, py, c));
      o.strokeStyle = 'rgba(110,60,50,0.3)'; o.lineWidth = 0.3; MX.path(o, sh); o.stroke();
    });
    // infection threads carry the bacteria in from the root hair
    for (let i = 0; i < 6; i++) MX.line(o, MX.strand(R, cx - 36 + R() * 72, -84, Math.PI / 2 + (R() - 0.5) * 0.8, 30 + R() * 16, 2, 0.6), 'rgba(110,50,50,0.55)', 0.5);
    o.restore();
    // vascular bundles in the inner cortex, one down each side
    for (const s of [-1, 1]) {
      const pts = NODULE.outline(6).filter(([, y]) => y > -84 && y < 96).filter(([x]) => (x - cx) * s > 0);
      MX.line(o, pts, '#EFE3A6', 2.4); MX.line(o, pts, 'rgba(150,130,70,0.6)', 0.4);
    }
    o.strokeStyle = 'rgba(120,90,60,0.55)'; o.lineWidth = 0.6; o.beginPath(); U.poly(o, core, true); o.stroke();
    o.strokeStyle = 'rgba(90,64,40,0.85)'; o.lineWidth = 1.1; o.beginPath(); U.poly(o, body, true); o.stroke();
    MX.loupe(o, 78, -60, 52, [-6, -30], '×1000', x => NODULE.zoom(x, R));
    MX.vignette(o, 0.12); MX.grain(o, 0.04);
    MX.scaleBar(o, 46.7, '0.5 mm');
  },
});

// ================================================================ ×5 pea flower cut lengthwise
// spots: banner petal (30,-92) · anthers (66,4) · stigma (94,-30) · ovary (-28,42) · ovule (25,25)
plate('peaFlower', {
  still(o, st) {
    const R = MX.rng(91), ax = s => [-34 + 0.952 * s, 44 - 0.304 * s], pr = [0.304, 0.952];
    MX.field(o, '#EEF0E8', '#D8DED0', 9, 0.01, 50);
    MX.taper(o, [[-150, 132], [-118, 100], [-88, 76], [-66, 62]], 6, 4.4, '#7AA24E', 'rgba(40,60,20,0.6)');
    const petal = (pts, g, veinFrom) => {
      MX.fill(o, pts, g);
      if (veinFrom) {
        o.save(); o.beginPath(); MX.curve(o, pts); o.clip();
        o.strokeStyle = 'rgba(140,165,120,0.35)'; o.lineWidth = 0.45;
        for (let i = 0; i < 18; i++) { const a = -2.6 + i * 0.13, p = MX.strand(R, veinFrom[0], veinFrom[1], a, 170, 5, 0.08); o.beginPath(); MX.curve(o, p, false); o.stroke(); }
        o.restore();
      }
      o.strokeStyle = 'rgba(110,112,90,0.6)'; o.lineWidth = 0.6; o.beginPath(); MX.curve(o, pts); o.stroke();
    };
    // banner (standard) at the back, wing and the far half of the keel in front of it
    petal([[-58, 30], [-72, -20], [-60, -78], [-22, -120], [20, -132], [34, -126], [48, -134], [88, -116], [118, -70], [112, -16], [80, 14], [30, 26]], MX.rad(o, 30, -40, 10, 150, [[0, '#FCFBF6'], [0.7, '#F1EFE6'], [1, '#DEDCD0']]), [-40, 24]);
    petal([[-44, 44], [-20, 8], [30, -6], [84, 0], [104, 18], [88, 42], [40, 54], [-10, 58]], MX.lin(o, 0, -6, 0, 58, [[0, '#F7F6F0'], [1, '#E4E2D8']]), [-40, 46]);
    petal([[-40, 64], [-6, 44], [40, 30], [76, 16], [98, -2], [106, -14], [98, 6], [84, 28], [50, 48], [4, 66]], MX.lin(o, 0, 10, 0, 66, [[0, '#F2F5EA'], [1, '#DDE4D0']]), null);
    // calyx: five pointed green sepals, finely hairy
    const cal = [[-86, 72], [-80, 44], [-74, 20], [-66, 40], [-56, 22], [-50, 42], [-40, 30], [-38, 52], [-30, 46], [-34, 66], [-60, 84]];
    o.fillStyle = MX.lin(o, -80, 20, -40, 80, [[0, '#8AB45E'], [1, '#5E8A3A']]); o.beginPath(); U.poly(o, cal, true); o.fill();
    o.strokeStyle = 'rgba(40,60,20,0.7)'; o.lineWidth = 0.5; o.stroke();
    // staminal tube: nine filaments fused into a sheath round the ovary
    const tube = [...[-4, 20, 45, 70, 92].map(s => { const [x, y] = ax(s); return [x - pr[0] * 13, y - pr[1] * 13]; }), ...[92, 70, 45, 20, -4].map(s => { const [x, y] = ax(s); return [x + pr[0] * 13, y + pr[1] * 13]; })];
    o.fillStyle = 'rgba(246,245,234,0.8)'; o.beginPath(); U.poly(o, tube, true); o.fill();
    o.strokeStyle = 'rgba(150,150,120,0.35)'; o.lineWidth = 0.3;
    for (let k = -10; k <= 10; k += 2.5) { const a = ax(-4), b = ax(92); o.beginPath(); o.moveTo(a[0] + pr[0] * k, a[1] + pr[1] * k); o.lineTo(b[0] + pr[0] * k, b[1] + pr[1] * k); o.stroke(); }
    // the ovary, cut open to show the ovules in a row
    const ov = [...[-2, 20, 50, 80, 98].map(s => { const [x, y] = ax(s); return [x - pr[0] * 9.5, y - pr[1] * 9.5]; }), ...[98, 80, 50, 20, -2].map(s => { const [x, y] = ax(s); return [x + pr[0] * 9.5, y + pr[1] * 9.5]; })];
    MX.fill(o, ov, MX.lin(o, 0, 20, 0, 50, [[0, '#B8D486'], [1, '#86AE58']]));
    const cav = [...[4, 40, 92].map(s => { const [x, y] = ax(s); return [x - pr[0] * 6, y - pr[1] * 6]; }), ...[92, 40, 4].map(s => { const [x, y] = ax(s); return [x + pr[0] * 6, y + pr[1] * 6]; })];
    MX.fill(o, cav, '#E2EECB');
    for (let i = 0; i < 7; i++) {
      const [x, y] = ax(12 + i * 12.5);
      o.strokeStyle = '#8AB060'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(x - pr[0] * 6, y - pr[1] * 6); o.lineTo(x - pr[0] * 2.5, y - pr[1] * 2.5); o.stroke();
      MX.ball(o, x + pr[0] * 1, y + pr[1] * 1, 4.8, '#C6DC92', 0.35, 0.25);
      o.strokeStyle = 'rgba(90,120,50,0.6)'; o.lineWidth = 0.35; o.beginPath(); o.arc(x + pr[0] * 1, y + pr[1] * 1, 4.8, 0, TAU); o.stroke();
    }
    o.strokeStyle = 'rgba(70,100,40,0.7)'; o.lineWidth = 0.6; o.beginPath(); MX.curve(o, ov); o.stroke();
    // the style bends up to the stigma, bearded along its inner side
    const sty = [ax(97), [76, 6], [88, -10], [94, -28]];
    MX.taper(o, sty, 3, 2, '#C6DC98', 'rgba(90,120,50,0.6)');
    o.strokeStyle = 'rgba(255,255,250,0.85)'; o.lineWidth = 0.25;
    for (let k = 0; k < 26; k++) { const [x, y, a] = MX.along(sty, 0.45 + R() * 0.5); o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a - 1.3) * 3.2, y + Math.sin(a - 1.3) * 3.2); o.stroke(); }
    MX.ball(o, 94, -30, 3.2, '#DCE8A6', 0.5, 0.2);
    o.fillStyle = 'rgba(255,255,255,0.8)'; o.beginPath(); o.arc(93, -31.2, 0.8, 0, TAU); o.fill();
    // ten stamens: filaments curving up out of the tube, anthers clustered below the stigma
    const anthers = [[58, 2], [62, -4], [66, 6], [70, -2], [74, 8], [61, 10], [68, 13], [76, 1], [72, -8], [64, 16]];
    anthers.forEach(([x, y], i) => {
      const [bx, by] = ax(82 + i * 1.2);
      o.strokeStyle = '#EDEEDC'; o.lineWidth = 0.7; o.beginPath(); o.moveTo(bx, by); o.quadraticCurveTo(bx + 4, by - 4, x, y + 3); o.stroke();
      o.save(); o.translate(x, y); o.rotate(0.3 + R() * 0.4);
      o.fillStyle = MX.lit(o, 0, 0, 4, '#E8C640', 0.35, 0.3); o.beginPath(); o.ellipse(0, 0, 2.5, 3.9, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(130,100,20,0.7)'; o.lineWidth = 0.35; o.stroke(); o.beginPath(); o.moveTo(0, -3.6); o.lineTo(0, 3.6); o.stroke();
      o.restore();
    });
    MX.dots(o, R, 40, [56, -10, 26, 26], 0.4, 0.7, '#E9C54A');
    MX.vignette(o, 0.1);
    MX.scaleBar(o, 60, '5 mm');
  },
});

// ================================================================ ×2 open pea pod
// spots: pod (-96,-20) · a seed (-16,-4)
plate('peaPod', {
  key: st => (st.seeds || []).join(''),
  still(o, st) {
    const R = MX.rng(101), seeds = st.seeds || ['R', 'R', 'R', 'R', 'R', 'R'];
    MX.field(o, '#EEEEE6', '#D6D8CC', 10, 0.01, 50);
    o.fillStyle = 'rgba(40,40,20,0.16)'; o.beginPath(); o.ellipse(6, 12, 132, 40, 0, 0, TAU); o.fill();
    // stalk and the withered calyx at the stem end
    MX.taper(o, [[-150, -40], [-138, -30], [-124, -10]], 4, 3, '#7FA850', 'rgba(40,60,20,0.6)');
    o.fillStyle = '#9AAE62'; for (let k = 0; k < 5; k++) { o.beginPath(); o.ellipse(-122 + k * 2, -8 + (k - 2) * 3.5, 6, 2, (k - 2) * 0.35, 0, TAU); o.fill(); }
    // the far valve: its inside face is a pale papery lining
    const back = [[-122, -4], [-100, -36], [-40, -48], [40, -46], [100, -30], [128, -8], [110, 12], [60, 26], [-40, 30], [-100, 22]];
    MX.fill(o, back, MX.lin(o, 0, -48, 0, 30, [[0, '#8DBA55'], [0.3, '#A8CC70'], [1, '#6E9A3C']]));
    const lining = back.map(([x, y]) => [x * 0.9, y * 0.8 - 1]);
    MX.fill(o, lining, MX.lin(o, 0, -40, 0, 24, [[0, '#E8F2D2'], [1, '#D2E4B2']]));
    o.save(); o.beginPath(); MX.curve(o, lining); o.clip();
    o.strokeStyle = 'rgba(150,180,110,0.35)'; o.lineWidth = 0.35;
    for (let i = 0; i < 26; i++) { const x = -110 + i * 9; o.beginPath(); o.moveTo(x, -40); o.quadraticCurveTo(x + 6, -10, x - 2, 26); o.stroke(); }
    o.restore();
    o.strokeStyle = 'rgba(50,80,30,0.7)'; o.lineWidth = 0.7; o.beginPath(); MX.curve(o, back); o.stroke();
    // the seeds hang from the upper seam on short stalks
    seeds.forEach((sd, i) => {
      const cx = -76 + i * 30, cy = -4;
      o.strokeStyle = '#86AC52'; o.lineWidth = 1.6; o.beginPath(); o.moveTo(cx - 2, -36); o.quadraticCurveTo(cx - 4, -24, cx, cy - 11); o.stroke();
      o.fillStyle = 'rgba(40,50,20,0.25)'; o.beginPath(); o.ellipse(cx + 3, cy + 10, 11, 4, 0, 0, TAU); o.fill();
      if (sd === 'R') {
        MX.ball(o, cx, cy, 12.5, '#B5D168', 0.5, 0.42);
        o.fillStyle = 'rgba(255,255,255,0.75)'; o.beginPath(); o.ellipse(cx - 4.5, cy - 5, 2.6, 1.6, -0.6, 0, TAU); o.fill();
      } else {
        const b = MX.blob(cx, cy, 12, 11.5, { seed: i + 11, wob: 0.12, fq: 5, n: 30 });
        MX.fill(o, b, MX.lit(o, cx, cy, 12, '#A6B45E', 0.25, 0.4));
        o.save(); o.beginPath(); MX.curve(o, b); o.clip();
        for (let k = 0; k < 7; k++) MX.line(o, MX.strand(R, cx - 8 + R() * 16, cy - 8 + R() * 16, R() * TAU, 10 + R() * 8, 2, 0.9), 'rgba(80,90,30,0.45)', 0.7);
        o.restore();
      }
      o.fillStyle = 'rgba(80,70,30,0.6)'; o.beginPath(); o.ellipse(cx, cy - 11, 2, 1.1, 0, 0, TAU); o.fill();
    });
    // the near valve, seen edge-on along the bottom
    const front = [[-122, -2], [-100, 24], [-40, 32], [60, 28], [110, 14], [128, -6], [114, 18], [60, 38], [-40, 42], [-104, 32]];
    MX.fill(o, front, MX.lin(o, 0, 14, 0, 42, [[0, '#9CC662'], [1, '#5E8A34']]));
    o.strokeStyle = 'rgba(220,240,190,0.6)'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(-100, 27); o.quadraticCurveTo(0, 38, 110, 17); o.stroke();
    o.strokeStyle = 'rgba(40,70,20,0.7)'; o.lineWidth = 0.6; o.beginPath(); MX.curve(o, front); o.stroke();
    MX.line(o, [[124, -8], [134, -14], [138, -24]], '#8AA858', 1.4);
    MX.vignette(o, 0.1);
    MX.scaleBar(o, 31, '1 cm');
  },
});

// ================================================================ ×10 pea seed cut in half, with a ×400 window
// Round (R) seeds are packed with big smooth starch grains; wrinkled (rr) seeds make less, fissured starch and
// hold more sugar and water, so they shrivel as they dry.
// spots: starch grains (84,-66) · embryo (-100,44) · seed coat (62,80)
const PEASEED = {
  // stained: Lugol's iodine turns the starch grains blue-black and the cytoplasm around them amber
  zoom(o, R, wr, sn) {
    o.fillStyle = sn ? '#E2C584' : '#EDE5BE'; o.fillRect(-60, -60, 120, 120);
    const sites = MX.relax(MX.scatter(R, 11, 26, [-66, -66, 132, 132]), U.rectPts(-70, -70, 140, 140), 2);
    for (const c of MX.voronoi(sites, U.rectPts(-70, -70, 140, 140))) {
      if (c.length < 3) continue;
      const sh = MX.soft(MX.inset(c, 1.3), 0.2), bb = U.bbox(c);
      MX.fill(o, sh, sn ? (wr ? '#E8D29A' : '#E4CB8C') : wr ? '#EEE3B6' : '#F3EDCB');
      o.save(); MX.path(o, sh); o.clip();
      MX.dots(o, R, 60, bb, 0.35, 0.7, 'rgba(170,150,80,0.5)');
      const n = wr ? 16 : 7, cc = MX.centroid(c);
      for (let k = 0; k < n; k++) {
        const x = cc[0] + (R() - 0.5) * bb[2] * 0.7, y = cc[1] + (R() - 0.5) * bb[3] * 0.7, a = R() * TAU;
        o.save(); o.translate(x, y); o.rotate(a);
        if (!wr) {
          const rx = 6.5 + R() * 3, ry = 4.6 + R() * 1.4;
          o.fillStyle = MX.rad(o, -rx * 0.3, -ry * 0.3, 0.5, rx, sn ? [[0, '#6C64AC'], [0.6, '#302A62'], [1, '#17132E']] : [[0, '#FFFFFB'], [1, '#E6E0C6']]); o.beginPath(); o.ellipse(0, 0, rx, ry, 0, 0, TAU); o.fill();
          o.strokeStyle = 'rgba(150,140,100,0.55)'; o.lineWidth = 0.35; o.stroke();
          for (let r = 0.35; r < 1; r += 0.22) { o.strokeStyle = 'rgba(170,160,120,0.25)'; o.beginPath(); o.ellipse(0, 0, rx * r, ry * r, 0, 0, TAU); o.stroke(); }
          o.strokeStyle = 'rgba(110,100,60,0.6)'; o.lineWidth = 0.4; o.beginPath(); o.moveTo(-rx * 0.45, 0); o.lineTo(rx * 0.45, 0.3); o.stroke();
        } else {
          const r = 2.6 + R() * 2;
          o.fillStyle = sn ? '#8078B4' : '#FBF8EC'; o.beginPath(); MX.curve(o, MX.blob(0, 0, r, r * 0.85, { seed: k, wob: 0.3, n: 8 })); o.fill();
          o.strokeStyle = 'rgba(130,120,80,0.6)'; o.lineWidth = 0.3; o.stroke();
          o.strokeStyle = 'rgba(110,100,60,0.55)'; for (let j = 0; j < 3; j++) { const b = j * 2.1 + R(); o.beginPath(); o.moveTo(0, 0); o.lineTo(Math.cos(b) * r * 0.8, Math.sin(b) * r * 0.8); o.stroke(); }
        }
        o.restore();
      }
      o.restore();
      o.strokeStyle = '#F8F4E0'; o.lineWidth = 1.3; MX.path(o, sh); o.stroke();
      o.strokeStyle = 'rgba(120,110,70,0.5)'; o.lineWidth = 0.3; MX.path(o, sh); o.stroke();
    }
  },
};
plate('peaSeed', {
  key: st => (st.wrinkled ? 'r' : 'R') + (st.stain ? 's' : ''),
  still(o, st) {
    const R = MX.rng(81), wr = !!st.wrinkled, sn = !!st.stain, c0 = [-18, 14];
    MX.field(o, '#EFECE2', '#D6D0BE', 8, 0.012, 50);
    o.fillStyle = 'rgba(40,30,20,0.18)'; o.beginPath(); o.ellipse(c0[0] + 6, c0[1] + 10, 106, 100, 0, 0, TAU); o.fill();
    const opt = { seed: 3, wob: wr ? 0.07 : 0.015, fq: wr ? 4.5 : 1.2, n: 90 };
    const outer = MX.blob(c0[0], c0[1], 104, 101, opt), cut = MX.blob(c0[0], c0[1], 99, 96, Object.assign({}, opt, { wob: opt.wob * 0.93 }));
    // seed coat (testa)
    MX.fill(o, outer, MX.lit(o, c0[0], c0[1], 104, wr ? '#A7AE68' : '#BAC47A', 0.3, 0.3));
    // cut face of the two cotyledons: the seed leaves that store the food
    MX.fill(o, cut, wr ? '#D4CE86' : '#E2DA96');
    o.save(); MX.path(o, cut); o.clip();
    const dk = U.rgb(wr ? '#A8A058' : '#C4BA70'), lt = U.rgb('#F6F0C4');
    MX.tex(o, -130, -94, 224, 216, (x, y) => { const v = U.fbm(x * 0.12, y * 0.12, 4, wr ? 7 : 3); return v > 0.5 ? [dk[0], dk[1], dk[2], (v - 0.5) * (wr ? 380 : 220)] : [lt[0], lt[1], lt[2], (0.5 - v) * 160]; }, 240);
    MX.dots(o, R, 900, [-122, -90, 210, 210], 0.2, 0.5, 'rgba(255,252,230,0.55)');
    if (wr) for (let k = 0; k < 9; k++) MX.line(o, MX.strand(R, c0[0] + (R() - 0.5) * 140, c0[1] + (R() - 0.5) * 140, R() * TAU, 20 + R() * 30, 3, 0.5), 'rgba(120,110,50,0.4)', 0.8);
    // the line where the two cotyledons meet
    const split = [[-116, 30], [-60, 26], [0, 16], [50, 6], [90, -4]];
    MX.line(o, split, 'rgba(120,110,60,0.65)', 1.3); MX.line(o, split.map(([x, y]) => [x, y - 1]), 'rgba(255,250,220,0.5)', 0.6);
    if (sn) {
      // iodine test: a round seed's cotyledons go evenly blue-black; a wrinkled (rr) seed has little starch and stains pale and patchy
      const ink = U.rgb(wr ? '#51467E' : '#1D1736');
      MX.tex(o, -130, -94, 224, 216, (x, y) => { const v = U.fbm(x * 0.05, y * 0.05, 3, 11); return [ink[0], ink[1], ink[2], wr ? 70 + v * 170 : 200 + v * 50]; }, 200);
      MX.line(o, split, 'rgba(110,60,10,0.7)', 2.2);
    }
    o.fillStyle = 'rgba(255,255,255,0.12)'; o.beginPath(); o.ellipse(-50, -30, 60, 40, -0.4, 0, TAU); o.fill();
    o.restore();
    // the embryo: a young root (radicle) near the scar, a tiny shoot tucked between the cotyledons
    // (the embryo axis stores little starch, so under iodine it stays amber)
    MX.taper(o, [[-120, 47], [-106, 44], [-92, 40], [-84, 36]], 3, 11, sn ? '#D29A48' : '#F2EBC4', 'rgba(140,120,60,0.7)');
    o.save(); o.translate(-80, 32); o.rotate(-0.25);
    for (const s of [-1, 1]) { o.fillStyle = '#C8D88A'; o.beginPath(); o.ellipse(6, s * 2, 7, 2.6, s * 0.3, 0, TAU); o.fill(); o.strokeStyle = 'rgba(90,110,40,0.6)'; o.lineWidth = 0.4; o.stroke(); }
    o.restore();
    // hilum: the scar where the seed was attached to the pod
    o.fillStyle = '#5A4A2A'; o.beginPath(); o.ellipse(-122, 56, 3, 8, 0.3, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(40,60,20,0.55)'; o.lineWidth = 0.6; o.beginPath(); MX.curve(o, outer); o.stroke();
    if (sn) { o.strokeStyle = 'rgba(160,95,20,0.4)'; o.lineWidth = 3; o.beginPath(); MX.curve(o, cut); o.stroke(); }
    MX.loupe(o, 84, -66, 50, [40, -24], '×400', x => PEASEED.zoom(x, R, wr, sn));
    MX.vignette(o, 0.1); MX.grain(o, 0.03);
    MX.scaleBar(o, 52, '2 mm');
  },
});

// ================================================================ ×500 pollen caught on a bee's hair (coloured SEM)
// Bee hairs are branched, and insect-carried pollen is spiky and sticky; a smooth wind-carried grain for contrast.
// spot: pollen grain (-40,-30)
const POLLEN = {
  grain(o, R, x, y, r, kind) {
    o.fillStyle = 'rgba(0,0,0,0.45)'; o.beginPath(); o.ellipse(x + r * 0.18, y + r * 0.22, r * 1.02, r, 0, 0, TAU); o.fill();
    o.fillStyle = MX.rad(o, x - r * 0.35, y - r * 0.4, r * 0.08, r * 1.04, [[0, kind === 's' ? '#F4E4B0' : '#FFE6A6'], [0.55, kind === 's' ? '#D8B870' : '#E0A233'], [0.9, kind === 's' ? '#8A7040' : '#9A6418'], [1, kind === 's' ? '#D8C090' : '#E8B85A']]);
    o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
    o.save(); o.beginPath(); o.arc(x, y, r, 0, TAU); o.clip();
    MX.dots(o, R, Math.round(r * r * 0.5), [x - r, y - r, r * 2, r * 2], 0.15, 0.35, 'rgba(80,50,10,0.45)');
    o.restore();
    if (kind === 's') {
      o.fillStyle = 'rgba(60,40,10,0.7)'; o.beginPath(); o.arc(x + r * 0.2, y + r * 0.1, r * 0.12, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(255,240,200,0.8)'; o.lineWidth = r * 0.06; o.beginPath(); o.arc(x + r * 0.2, y + r * 0.1, r * 0.17, 0, TAU); o.stroke();
      return;
    }
    // three pores
    for (let k = 0; k < 3; k++) {
      const a = -0.6 + k * 2.1, px = x + Math.cos(a) * r * 0.55, py = y + Math.sin(a) * r * 0.5;
      o.fillStyle = 'rgba(70,40,5,0.75)'; o.beginPath(); o.ellipse(px, py, r * 0.09, r * 0.13, a, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(255,236,180,0.7)'; o.lineWidth = r * 0.025; o.stroke();
    }
    // spines: spread evenly over the sphere; only the near side shows, foreshortened toward the middle
    const n = Math.round(r * 4.4), sp = [];
    for (let i = 0; i < n; i++) {
      const k = i + 0.5, phi = Math.acos(1 - 2 * k / n), th = Math.PI * (1 + Math.sqrt(5)) * k;
      const px = Math.sin(phi) * Math.cos(th), py = Math.sin(phi) * Math.sin(th), pz = Math.cos(phi);
      if (pz > -0.05) sp.push([px, py, pz]);
    }
    sp.sort((a, b) => a[2] - b[2]);
    for (const [px, py, pz] of sp) {
      const bx = x + px * r, by = y + py * r, L = r * 0.17, tx = x + px * (r + L), ty = y + py * (r + L), w = r * 0.07, nx = -py, ny = px, nl = Math.hypot(nx, ny) || 1;
      if (Math.hypot(px, py) < 0.25) { MX.ball(o, bx, by, w * 0.9, '#F2BE58', 0.45, 0.35); continue; }
      o.fillStyle = MX.lin(o, bx + nx / nl * w, by + ny / nl * w, bx - nx / nl * w, by - ny / nl * w, [[0, '#FFE2A0'], [1, '#A86E1C']]);
      o.beginPath(); o.moveTo(bx + nx / nl * w, by + ny / nl * w); o.lineTo(tx, ty); o.lineTo(bx - nx / nl * w, by - ny / nl * w); o.closePath(); o.fill();
    }
  },
};
plate('pollen', {
  still(o, st) {
    const R = MX.rng(111);
    o.fillStyle = MX.rad(o, -20, -10, 20, 220, [[0, '#3A342A'], [1, '#141210']]); o.fillRect(-141, -141, 282, 282);
    // branched (plumose) bee hairs
    for (const [x, y, a, len, w] of [[-150, 112, -0.55, 300, 5.5], [150, 124, -2.4, 260, 5], [-24, 150, -1.35, 170, 4]]) {
      const p = MX.strand(R, x, y, a, len, 4, 0.08);
      MX.taper(o, p, w, 1.2, '#9A8C74', 'rgba(20,16,10,0.6)');
      MX.line(o, p.map(([px, py]) => [px - 0.8, py - 0.8]), 'rgba(230,220,196,0.45)', 0.7);
      for (let t = 0.04; t < 0.95; t += 0.028) {
        const [bx, by, ba] = MX.along(p, t), s = Math.round(t * 71) % 2 ? 1 : -1;
        MX.taper(o, MX.strand(R, bx, by, ba + s * (0.6 + R() * 0.3), 8 + R() * 9, 2, 0.15), 1.4, 0.25, '#8A7E68');
      }
    }
    POLLEN.grain(o, R, 84, -80, 20, 'e');
    POLLEN.grain(o, R, -10, 84, 24, 'e');
    POLLEN.grain(o, R, 98, 94, 16, 's');
    POLLEN.grain(o, R, 60, 30, 30, 'e');
    // pollenkitt: the oily glue that sticks grains to the hair
    for (const [x, y, r] of [[-12, 4, 5], [40, 8, 3.5], [-70, -2, 4]]) MX.ball(o, x, y, r, '#D8A850', 0.6, 0.3);
    POLLEN.grain(o, R, -40, -30, 44, 'e');
    MX.vignette(o, 0.35, '0,0,0'); MX.grain(o, 0.08);
    MX.scaleBar(o, 29, '10 µm', true);
  },
});

// ================================================================ ×1 tree trunk, cut across
// spots: bark (0,-116) · cambium (74,-76) · growth rings (-60,20) · sapwood (58,56)
plate('rings', {
  key: st => String(st.rings || 34),
  still(o, st) {
    const R = MX.rng(121), n = st.rings || 34;
    MX.field(o, '#E9E4D6', '#CFC6B0', 11, 0.01, 50);
    o.fillStyle = 'rgba(40,30,20,0.25)'; o.beginPath(); o.arc(5, 7, 126, 0, TAU); o.fill();
    // ring widths follow the weather: young rings are wide, a few drought years stand out as narrow ones
    const w = []; for (let i = 0; i < n; i++) w.push((0.6 + U.fbm(i * 0.35, 2, 2, n) * 0.9) * (U.hash(i, 7, n) < 0.12 ? 0.35 : 1) * (1 + 0.8 * Math.exp(-i / 5)));
    const tot = w.reduce((a, b) => a + b, 0), rr = [0]; for (let i = 0; i < n; i++) rr.push(rr[i] + w[i] / tot * 104.8);
    const ringPath = (r, seed) => { const p = []; for (let i = 0; i < 90; i++) { const a = i / 90 * TAU, k = r + MX.n(Math.cos(a) * 1.3 + seed * 0.1, Math.sin(a) * 1.3, 3) * 0.8 * Math.min(1, r / 30); p.push([-3 * (1 - r / 110) + Math.cos(a) * k, 2 * (1 - r / 110) + Math.sin(a) * k]); } return p; };
    const heart = 104.8 * 0.56;
    for (let i = n - 1; i >= 0; i--) {
      const ro = rr[i + 1], late = Math.max(0.35, (rr[i + 1] - rr[i]) * 0.28), hw = ro < heart;
      MX.fill(o, ringPath(ro, i), hw ? '#8E5A30' : '#C99A5C');
      MX.fill(o, ringPath(Math.max(0.2, ro - late), i + 0.5), hw ? '#B8834E' : '#EBD2A0');
    }
    // rays and fibre texture
    o.save(); MX.path(o, ringPath(104.8, 0)); o.clip();
    for (let i = 0; i < 160; i++) { const a = R() * TAU, r0 = R() * 40; o.strokeStyle = `rgba(255,240,210,${0.15 + R() * 0.2})`; o.lineWidth = 0.3; o.beginPath(); o.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); o.lineTo(Math.cos(a) * 106, Math.sin(a) * 106); o.stroke(); }
    const ft = U.rgb('#6A4424');
    MX.tex(o, -106, -106, 212, 212, (x, y) => [ft[0], ft[1], ft[2], Math.max(0, U.noise(Math.atan2(y, x) * 40, Math.hypot(x, y) * 0.8, 5) - 0.6) * 160], 256);
    // a drying crack running in from the edge
    o.fillStyle = 'rgba(30,20,10,0.85)'; o.beginPath(); o.moveTo(96, 36); o.lineTo(60, 22); o.lineTo(95, 40); o.closePath(); o.fill();
    o.restore();
    o.fillStyle = '#5A3A1E'; o.beginPath(); o.arc(-3, 2, 1.8, 0, TAU); o.fill();
    // cambium: a thin wet green line, the only part of the trunk that divides
    const cam = ringPath(105.7, 0); MX.line(o, cam, '#A4AE5C', 1.8, true); MX.line(o, cam, 'rgba(255,255,220,0.4)', 0.4, true);
    // inner bark (living phloem), then the dead, cracked outer bark
    const ib0 = ringPath(106.6, 1), ib1 = ringPath(110, 1);
    o.fillStyle = '#D6B48A'; o.beginPath(); MX.curve(o, ib1); MX.curve(o, ib0.slice().reverse()); o.fill('evenodd');
    const bark = []; for (let i = 0; i < 120; i++) { const a = i / 120 * TAU, k = 124 + MX.n(Math.cos(a) * 6, Math.sin(a) * 6, 8) * 3.5; bark.push([Math.cos(a) * k, Math.sin(a) * k]); }
    o.fillStyle = MX.rad(o, -30, -40, 90, 130, [[0, '#7A6452'], [1, '#4E3E30']]); o.beginPath(); MX.curve(o, bark); MX.curve(o, ib1.slice().reverse()); o.fill('evenodd');
    for (let i = 0; i < 46; i++) { const a = R() * TAU, d = 2 + R() * 5; o.fillStyle = 'rgba(24,18,12,0.7)'; o.beginPath(); o.moveTo(Math.cos(a - 0.03) * 124, Math.sin(a - 0.03) * 124); o.lineTo(Math.cos(a) * (124 - d * 2.4), Math.sin(a) * (124 - d * 2.4)); o.lineTo(Math.cos(a + 0.03) * 124, Math.sin(a + 0.03) * 124); o.fill(); }
    o.strokeStyle = 'rgba(30,20,12,0.8)'; o.lineWidth = 0.8; o.beginPath(); MX.curve(o, bark); o.stroke();
    MX.vignette(o, 0.12); MX.grain(o, 0.04);
    MX.scaleBar(o, 41, '5 cm');
  },
});
