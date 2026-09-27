'use strict';
// The X-ray layer of the other animals the brass lens looks into: Karabaş the Kangal, a fat-tailed Akkaraman ewe,
// a village hen and the white storks on their nest. Each is a painting like the cow's (plates-cow.js): the
// animal in its own coat or plumage, the body cavity see-through. A painting is drawn in painting units with the
// feet at y 0 and scaled into the sprite's local units by K, so the X-ray lies over the animal in the valley;
// XCACHE keeps it as a bitmap at three sizes.

const XP = {
  // a soft round patch of light or shade
  soft(s, x, y, rx, ry, col, a, rot = 0) {
    s.fillStyle = MX.rad(s, 0, 0, 0, 1, [[0, U.rgba(col, a)], [1, U.rgba(col, 0)]]);
    s.save(); s.translate(x, y); s.rotate(rot); s.scale(rx, ry); s.beginPath(); s.arc(0, 0, 1, 0, TAU); s.fill(); s.restore();
  },
  // one outline round a figure of overlapping parts: stroke them all, then fill them all
  figure(o, parts, fill, edge, w) { for (const p of parts) MX.line(o, p, edge, w, true); for (const p of parts) MX.fill(o, p, fill); },
  // a sheet of light and shade laid over the figure and trimmed to it
  shade(o, parts, fn) { MX.layer(o, s => { fn(s); MX.layer(s, m => { for (const p of parts) MX.fill(m, p, '#000'); }, 0, 1, 'destination-in'); }); },
  // a band of width w0 at the start narrowing to w1 at the end, as a closed outline
  band(pts, w0, w1) {
    const n = pts.length, L = [], Rr = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
      L.push([pts[i][0] + Math.cos(ang - Math.PI / 2) * w, pts[i][1] + Math.sin(ang - Math.PI / 2) * w]);
      Rr.push([pts[i][0] + Math.cos(ang + Math.PI / 2) * w, pts[i][1] + Math.sin(ang + Math.PI / 2) * w]);
    }
    return L.concat(Rr.reverse());
  },
  // an outline with scalloped edges: the locks of a fleece
  lumpy(poly, amp, seed) {
    const c = MX.centroid(poly), out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 7));
      for (let q = 0; q < n; q++) {
        const t = q / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, d = Math.hypot(x - c[0], y - c[1]) || 1, k = out.length;
        const off = amp * (Math.abs(Math.sin(k * 1.3 + seed)) * 0.8 + U.hash(k, seed, 3) * 0.4);
        out.push([x + (x - c[0]) / d * off, y + (y - c[1]) / d * off]);
      }
    }
    return out;
  },
  // short hairs lying one way along the body
  hair(o, R, poly, n, base, l0, l1, ang, spread = 0.5, w = 0.5, a = 0.5) {
    o.save(); MX.path(o, poly); o.clip();
    const bb = U.bbox(poly);
    for (let k = 0; k < n; k++) {
      const x = bb[0] + R() * bb[2], y = bb[1] + R() * bb[3], l = l0 + R() * (l1 - l0), t = ang + (R() - 0.5) * spread;
      o.strokeStyle = U.rgba(U.shade(base, R() < 0.5 ? 0.2 : -0.24), a); o.lineWidth = w;
      o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(t) * l, y + Math.sin(t) * l); o.stroke();
    }
    o.restore();
  },
  // contour feathers overlapping like roof tiles, each a rounded vane with a pale shaft, lying back along the bird
  feathers(o, R, poly, n, base, size, ang, vary = 0.25) {
    o.save(); MX.path(o, poly); o.clip();
    const bb = U.bbox(poly), pts = [], back = Math.cos(ang);
    for (let k = 0; k < n; k++) pts.push([bb[0] + R() * bb[2], bb[1] + R() * bb[3]]);
    // the feathers nearer the head lie over the ones behind them
    pts.sort((p, q) => (q[0] - p[0]) * back);
    for (const [x, y] of pts) {
      const r = size * (0.7 + R() * 0.5), c = U.shade(base, (R() - 0.5) * vary);
      o.save(); o.translate(x, y); o.rotate(ang + (R() - 0.5) * 0.4);
      o.fillStyle = c; o.beginPath(); o.moveTo(-r, -r * 0.62); o.quadraticCurveTo(r * 0.9, -r * 0.72, r, 0); o.quadraticCurveTo(r * 0.9, r * 0.72, -r, r * 0.62); o.closePath(); o.fill();
      o.strokeStyle = U.rgba(U.shade(base, -0.5), 0.5); o.lineWidth = Math.max(0.3, r * 0.06); o.beginPath(); o.moveTo(r * 0.1, -r * 0.64); o.quadraticCurveTo(r * 0.95, -r * 0.42, r, 0); o.quadraticCurveTo(r * 0.95, r * 0.42, r * 0.1, r * 0.64); o.stroke();
      o.strokeStyle = U.rgba(U.shade(base, 0.35), 0.35); o.lineWidth = Math.max(0.25, r * 0.04); o.beginPath(); o.moveTo(-r * 0.6, 0); o.lineTo(r * 0.8, 0); o.stroke();
      o.restore();
    }
    o.restore();
  },
  // the see-through: everything under the skin on its own sheet, faded out towards the edges of the body cavity
  inside(o, wins, paint) {
    MX.layer(o, x => { paint(x); MX.layer(x, m => { for (const p of wins) MX.fill(m, MX.inset(p, 2.5), '#000'); }, 3.2, 1, 'destination-in'); });
  },
  flesh(o, wins, y0, y1) { for (const p of wins) MX.fill(o, p, MX.lin(o, 0, y0, 0, y1, [[0, '#6E3026'], [1, '#43180F']])); },
  // loops of small intestine, wandering about inside an outline
  loops(o, R, box, n, w, cols, len = [10, 18]) {
    const bb = U.bbox(box);
    o.save(); MX.path(o, box); o.clip();
    for (let k = 0; k < n; k++) {
      const x = bb[0] + R() * bb[2], y = bb[1] + R() * bb[3], a = R() * TAU, l = len[0] + R() * (len[1] - len[0]), pts = [];
      for (let q = 0; q <= 6; q++) { const t = q / 6, aa = a + Math.sin(t * Math.PI * 2 + k) * 1.4; pts.push([x + Math.cos(aa) * l * (t - 0.5), y + Math.sin(aa) * l * (t - 0.5) + Math.sin(t * 7 + k) * w * 0.5]); }
      MX.tube(o, pts, w, cols[k % cols.length], { hiA: 0.45 });
    }
    o.restore();
  },
  // a windpipe: a pale tube ringed with cartilage
  trachea(o, pts, w, n) {
    MX.tube(o, pts, w, '#E2D2C0', { hi: '#FFFFFF' });
    for (let k = 1; k < n; k++) {
      const t = k / n, [x, y] = MX.along(pts, t), [x2, y2] = MX.along(pts, Math.min(1, t + 0.01)), a = Math.atan2(y2 - y, x2 - x) + Math.PI / 2;
      MX.line(o, [[x - Math.cos(a) * w * 0.42, y - Math.sin(a) * w * 0.42], [x + Math.cos(a) * w * 0.42, y + Math.sin(a) * w * 0.42]], 'rgba(150,120,100,0.6)', Math.max(0.4, w * 0.12));
    }
  },
  // the backbone as a row of vertebrae
  spine(o, pts, n, r) {
    for (let k = 0; k <= n; k++) {
      const [x, y] = MX.along(pts, k / n);
      o.fillStyle = 'rgba(236,224,200,0.34)'; o.beginPath(); o.ellipse(x, y, r, r * 0.72, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(255,250,236,0.25)'; o.lineWidth = r * 0.18; o.stroke();
    }
  },
  // ribs, faint as on an X-ray
  ribs(o, list, w) { for (const pts of list) { MX.line(o, pts, 'rgba(246,238,220,0.2)', w); MX.line(o, pts, 'rgba(255,255,255,0.12)', w * 0.3); } },
  // lungs: pink and lobulated
  lungs(o, R, pts, n, gap) {
    COWP.organ(o, pts, '#E4A29C', {
      hi: 0.2, paint: () => {
        const bb = U.bbox(pts), cells = MX.voronoi(MX.scatter(R, n, gap, bb), [[bb[0], bb[1]], [bb[0] + bb[2], bb[1]], [bb[0] + bb[2], bb[1] + bb[3]], [bb[0], bb[1] + bb[3]]]);
        for (const c of cells) { if (!c || c.length < 3) continue; MX.fill(o, c, U.rgba(R() < 0.5 ? '#C87478' : '#F2B8B0', 0.3)); MX.line(o, c, 'rgba(150,80,90,0.4)', 0.4, true); }
      },
    });
  },
  heart(o, x, y, rx, ry, rot, seed) {
    COWP.organ(o, MX.blob(x, y, rx, ry, { rot, wob: 0.07, seed }), '#8E2A24', {
      paint: (cx, cy) => { MX.line(o, [[cx - rx * 0.8, cy - ry * 0.45], [cx, cy - ry * 0.35], [cx + rx * 0.7, cy - ry * 0.6]], 'rgba(234,212,138,0.75)', rx * 0.14); MX.line(o, [[cx - rx * 0.1, cy - ry * 0.35], [cx + rx * 0.1, cy + ry * 0.4], [cx + rx * 0.3, cy + ry * 0.8]], 'rgba(150,40,34,0.6)', rx * 0.07); },
    });
  },
  diaphragm(o, pts) { o.save(); MX.blur(o, 0.8); MX.line(o, pts, 'rgba(150,40,34,0.55)', 5); o.restore(); MX.line(o, pts, 'rgba(226,230,236,0.3)', 1.6); MX.line(o, pts, 'rgba(60,14,10,0.35)', 0.6); },
  // an eye: a dark iris (or a coloured one), the pupil, the glint of the sky in it
  eye(o, x, y, rx, ry, iris, pupil = null) {
    o.fillStyle = 'rgba(30,18,10,0.9)'; o.beginPath(); o.ellipse(x, y, rx + 0.8, ry + 0.8, 0, 0, TAU); o.fill();
    o.fillStyle = MX.rad(o, x - rx * 0.2, y - ry * 0.2, 0.2, rx, [[0, U.shade(iris, 0.25)], [1, U.shade(iris, -0.35)]]); o.beginPath(); o.ellipse(x, y, rx, ry, 0, 0, TAU); o.fill();
    if (pupil === 'slit') { o.fillStyle = '#0E0806'; U.rr(o, x - rx * 0.62, y - ry * 0.2, rx * 1.24, ry * 0.4, ry * 0.2); o.fill(); }
    else if (pupil) { o.fillStyle = '#0E0806'; o.beginPath(); o.arc(x, y, Math.min(rx, ry) * pupil, 0, TAU); o.fill(); }
    o.fillStyle = 'rgba(255,255,255,0.9)'; o.beginPath(); o.arc(x - rx * 0.35, y - ry * 0.35, Math.min(rx, ry) * 0.24, 0, TAU); o.fill();
  },
  spots(K, list) { return list.map(([id, x, y]) => [id, Math.round(x * K * 10) / 10, Math.round(y * K * 10) / 10]); },
  draw(x, id, A) { XCACHE.draw(x, id, 0, { bb: A.BB, K: A.K, ox: 0, oy: 0, paint: o => A.paint(o) }); },
  shadow(o, x, w) { o.fillStyle = MX.rad(o, x, 2, 4, w, [[0, 'rgba(40,30,20,0.3)'], [1, 'rgba(40,30,20,0)']]); o.beginPath(); o.ellipse(x, 2, w, 6, 0, 0, TAU); o.fill(); },
};

// ================================================================ Karabaş, the Kangal (head to the left)
// A big livestock guardian: a fawn double coat, the black mask over the muzzle and ears, the tail curled over the
// back. Inside: one simple stomach (a dog is a carnivore), a long small intestine, a short large intestine.
const DOGX = {
  K: 0.2, BB: [-198, -202, 340, 212],
  TRUNK: [[-96, -122], [-72, -138], [-36, -142], [0, -140], [36, -138], [72, -140], [98, -136], [114, -124], [118, -106], [110, -88], [94, -76], [70, -74], [44, -78], [16, -76], [-12, -68], [-40, -60], [-66, -58], [-88, -66], [-102, -84], [-104, -104]],
  NECK: [[-80, -136], [-98, -152], [-114, -162], [-128, -158], [-136, -140], [-130, -116], [-116, -96], [-100, -80], [-94, -108]],
  HEAD: [[-108, -168], [-122, -176], [-140, -176], [-154, -170], [-164, -160], [-178, -154], [-188, -146], [-188, -134], [-180, -126], [-162, -122], [-144, -116], [-128, -114], [-114, -122], [-106, -140], [-104, -156]],
  EAR: [[-124, -172], [-110, -170], [-104, -158], [-106, -140], [-114, -134], [-122, -148]],
  FORE: [[-88, -96], [-62, -98], [-58, -70], [-60, -40], [-60, -14], [-56, -6], [-57, 0], [-81, 0], [-81, -7], [-78, -40], [-80, -70]],
  HIND: [[56, -128], [100, -124], [112, -100], [104, -78], [92, -58], [100, -30], [103, -8], [105, 0], [83, 0], [83, -8], [80, -30], [74, -56], [62, -86]],
  TAIL: [[106, -126], [122, -144], [128, -164], [120, -182], [104, -186], [94, -176], [98, -166]],
  CAV: [[-92, -118], [-70, -132], [-36, -134], [0, -132], [36, -130], [72, -132], [96, -128], [108, -114], [108, -100], [98, -86], [70, -82], [44, -84], [16, -82], [-12, -74], [-40, -66], [-66, -64], [-86, -72], [-96, -88], [-98, -104]],
  THR: [[-100, -146], [-116, -154], [-128, -142], [-124, -118], [-110, -100], [-96, -92], [-90, -120]],
  OESO: [[-126, -138], [-116, -130], [-104, -122], [-88, -118], [-66, -118], [-46, -118], [-28, -116]],
  spots() { return XP.spots(this.K, [['dog_stomach', -8, -108], ['dog_small_int', 40, -98], ['dog_large_int', 84, -121], ['dog_esophagus', -104, -122]]); },
  draw(x) { XP.draw(x, 'dog', this); },
  paint(o) {
    const R = MX.rng(3131), H = '#C9A064', parts = [this.TRUNK, this.NECK, this.HEAD, this.FORE, this.HIND];
    COWA.lx = -0.35;
    XP.shadow(o, -20, 124);
    // the far legs, in shadow
    for (const [leg, dx] of [[this.FORE, 16], [this.HIND, -14]]) {
      const p = leg.map(([x, y]) => [x + dx, y - 3]);
      MX.fill(o, p, MX.lin(o, 0, -100, 0, 0, [[0, U.shade(H, -0.42)], [1, U.shade(H, -0.55)]])); MX.line(o, p, 'rgba(40,26,12,0.6)', 0.8, true);
      XP.hair(o, R, p, 160, U.shade(H, -0.45), 1.6, 3, 1.5, 0.4);
    }
    XP.figure(o, parts, MX.lin(o, 0, -176, 0, 0, [[0, U.shade(H, -0.12)], [0.3, H], [0.55, U.shade(H, 0.1)], [0.85, U.shade(H, 0.04)], [1, U.shade(H, -0.2)]]), 'rgba(52,34,16,0.85)', 2);
    XP.shade(o, parts, s => {
      for (let k = 0; k < 60; k++) { const x = -180 + R() * 300, y = -180 + R() * 170; s.fillStyle = U.rgba(R() < 0.5 ? '#FFE8B0' : '#5A3410', 0.07); s.beginPath(); s.ellipse(x, y, 6 + R() * 14, 4 + R() * 9, R() * 3, 0, TAU); s.fill(); }
      // the round barrel lit from above, its underside in shade; shoulder, thigh and the hollow of the flank
      XP.soft(s, 0, -128, 92, 16, '#FFF0C8', 0.26); XP.soft(s, 0, -76, 90, 14, '#3A2008', 0.3);
      XP.soft(s, -80, -112, 16, 26, '#FFF0C8', 0.2, -0.3); XP.soft(s, 86, -110, 22, 24, '#FFF0C8', 0.22, 0.2); XP.soft(s, 58, -96, 12, 14, '#3A2008', 0.2);
      s.save(); MX.blur(s, 2.4); MX.line(s, [[-66, -126], [-60, -100], [-66, -76]], 'rgba(50,24,8,0.25)', 3); MX.line(s, [[62, -122], [58, -100], [66, -84]], 'rgba(50,24,8,0.25)', 3); s.restore();
      // the thick ruff of the neck, and the throat in shade
      XP.soft(s, -112, -140, 20, 18, '#FFF0C8', 0.18); XP.soft(s, -112, -104, 16, 14, '#3A2008', 0.22);
      // the black mask of a Kangal: the muzzle, round the eyes, fading up the forehead
      s.save(); MX.blur(s, 2.6); MX.fill(s, [[-192, -150], [-178, -160], [-160, -166], [-150, -152], [-148, -130], [-160, -118], [-192, -122]], 'rgba(28,22,16,0.94)'); s.restore();
      XP.soft(s, -146, -156, 12, 9, '#1E1812', 0.7); XP.soft(s, -132, -168, 16, 8, '#2A2016', 0.25);
      // the legs: elbow and hock as bony points, paws a touch darker
      XP.soft(s, -70, -70, 8, 7, '#FFF0C8', 0.22); XP.soft(s, 94, -56, 7, 8, '#FFF0C8', 0.22);
      s.fillStyle = MX.lin(s, 0, -16, 0, 0, [[0, 'rgba(40,24,10,0)'], [1, 'rgba(40,24,10,0.35)']]); s.fillRect(-200, -16, 340, 18);
      // a rim of light along the top line
      s.save(); MX.blur(s, 1.4); MX.line(s, [[-176, -158], [-152, -172], [-124, -176], [-104, -160], [-80, -142], [-36, -145], [36, -141], [98, -139]], 'rgba(255,244,214,0.45)', 2); s.restore();
    });
    // the double coat: hair lies back along the body, down the legs, forward on the face
    XP.hair(o, R, this.TRUNK, 2600, H, 2, 4, 0.18, 0.5);
    XP.hair(o, R, this.NECK, 900, H, 2.4, 4.6, 0.9, 0.6);
    XP.hair(o, R, this.HEAD, 420, U.shade(H, -0.3), 1.2, 2.2, 0.1, 0.5);
    for (const leg of [this.FORE, this.HIND]) XP.hair(o, R, leg, 380, H, 1.4, 2.8, 1.5, 0.4);
    // the see-through body
    XP.inside(o, [this.CAV, this.THR], x => this.organs(x, R));
    // paws: toes and dark nails
    for (const [x0, x1] of [[-81, -57], [83, 105]]) {
      for (let k = 1; k < 4; k++) MX.line(o, [[x0 + (x1 - x0) * k / 4, -7], [x0 + (x1 - x0) * k / 4, 0]], 'rgba(60,40,20,0.6)', 0.7);
      for (let k = 0; k < 4; k++) { o.fillStyle = '#2A2018'; o.beginPath(); o.ellipse(x0 + (x1 - x0) * (k + 0.5) / 4 - 3, 0, 1.6, 1, 0, 0, TAU); o.fill(); }
    }
    // the tail curled over the back, a darker tip
    MX.taper(o, this.TAIL, 17, 9, H, 'rgba(52,34,16,0.8)');
    for (let k = 0; k < 160; k++) { const t = R(), [x, y] = MX.along(this.TAIL, t), a = R() * TAU; MX.line(o, [[x, y], [x + Math.cos(a) * (4 + R() * 4), y + Math.sin(a) * (3 + R() * 3)]], U.rgba(t > 0.75 ? '#3A2A1A' : U.shade(H, R() < 0.5 ? 0.2 : -0.25), 0.55), 0.6); }
    // head: the nose, mouth, eye and the hanging ear
    o.fillStyle = MX.rad(o, -186, -142, 0.5, 8, [[0, '#4A3E38'], [1, '#141010']]); o.beginPath(); o.ellipse(-186, -141, 6, 7, 0.2, 0, TAU); o.fill();
    o.fillStyle = 'rgba(255,255,255,0.3)'; o.beginPath(); o.ellipse(-187, -145, 2.4, 1.2, 0.3, 0, TAU); o.fill();
    o.fillStyle = '#080606'; o.beginPath(); o.ellipse(-189.5, -140, 1.2, 2, 0.4, 0, TAU); o.fill();
    MX.line(o, [[-187, -128], [-174, -124], [-158, -122]], '#140E0A', 1);
    for (let k = 0; k < 7; k++) { o.fillStyle = 'rgba(10,8,6,0.8)'; o.beginPath(); o.arc(-178 + (k % 4) * 4, -134 + Math.floor(k / 4) * 4, 0.6, 0, TAU); o.fill(); }
    XP.eye(o, -146, -156, 4.6, 3.2, '#6A4020', 0.5);
    MX.line(o, [[-152, -158], [-146, -160.5], [-140, -158]], 'rgba(20,12,6,0.8)', 0.8);
    MX.fill(o, this.EAR, MX.lin(o, -124, -170, -106, -136, [[0, '#3A2C20'], [1, '#1E1812']])); MX.line(o, this.EAR, 'rgba(20,12,6,0.8)', 1, true);
    XP.hair(o, R, this.EAR, 120, '#2A2016', 1, 2, 1.2, 0.5, 0.4);
  },
  organs(o, R) {
    XP.flesh(o, [this.CAV, this.THR], -140, -60);
    XP.spine(o, [[-100, -128], [-60, -133], [0, -134], [60, -132], [108, -124]], 24, 3.2);
    const ribs = [];
    for (let k = 0; k < 13; k++) { const xt = -86 + k * 8.4, ft = k > 9; ribs.push([[xt, -130], [xt - 6, -110], [xt - 12 - k * 0.4, ft ? -96 : -84], [xt - 16 - k * 0.6, ft ? -90 : -70 + k * 0.4]]); }
    XP.ribs(o, ribs, 3);
    // windpipe in the neck, dropping into the chest; the lungs, the heart low between them
    XP.trachea(o, [[-128, -128], [-118, -116], [-106, -106], [-92, -100], [-78, -98]], 5, 12);
    XP.lungs(o, R, [[-92, -116], [-72, -128], [-50, -126], [-42, -110], [-46, -88], [-62, -80], [-82, -84], [-94, -98]], 60, 5);
    XP.heart(o, -68, -86, 12, 14, 0.5, 12);
    MX.tube(o, [[-64, -96], [-62, -110], [-50, -118], [-26, -122], [10, -124]], 3.6, '#B8342C', { hiA: 0.4 });
    XP.diaphragm(o, [[-40, -130], [-46, -112], [-50, -92], [-52, -72]]);
    // one simple stomach, J-shaped, its folds faint through the wall; the liver in front of it
    const ST = [[-32, -124], [-12, -128], [6, -122], [12, -108], [6, -94], [-8, -90], [-22, -96], [-30, -110]];
    COWP.organ(o, ST, '#D8A090', { hi: 0.28, paint: (cx, cy) => { for (let k = 0; k < 6; k++) MX.line(o, [[cx - 16 + k * 5, cy - 12], [cx - 13 + k * 5, cy], [cx - 15 + k * 5, cy + 12]], 'rgba(150,70,60,0.3)', 0.9); COWP.vessels(o, R, cx + 16, cy + 14, -2.4, 16, 0.8, 'rgba(160,40,40,0.5)', 2); } });
    MX.tube(o, [[8, -98], [16, -92], [22, -100], [22, -110]], 4.4, '#D89888', { hiA: 0.4 });
    COWP.organ(o, [[-46, -126], [-30, -128], [-20, -118], [-18, -100], [-28, -82], [-44, -74], [-52, -96]], '#7A2A22', { hi: 0.25 });
    // kidney high under the spine, the bladder at the back of the belly
    COWP.organ(o, MX.blob(50, -126, 9, 5.5, { seed: 6, rot: 0.1 }), '#7A2E26', { sh: 2 });
    COWP.organ(o, MX.blob(97, -88, 9, 8, { seed: 5 }), '#E6D48A', { hi: 0.3, sh: 2 });
    // the long small intestine, coiled under its fatty veil in the middle of the belly
    const GUT = MX.blob(40, -99, 32, 17, { wob: 0.08, seed: 71, rot: 0.05 });
    COWP.organ(o, GUT, '#E8D2A8', { hi: 0.15, sh: 3, gloss: false });
    XP.loops(o, R, GUT, 24, 4.4, ['#D89888', '#E0A898', '#D08C80']);
    MX.fill(o, GUT, 'rgba(240,226,190,0.16)');
    // the short large intestine: up, across under the spine, and back to the rectum
    MX.tube(o, [[20, -106], [24, -118], [42, -123], [66, -124], [86, -121], [100, -114], [113, -106]], 7, '#B88A74', { hiA: 0.4 });
    // the oesophagus: from the throat, down the neck and through the chest to the stomach
    MX.tube(o, this.OESO, 4.6, '#D88A80', { hi: '#F8C8BC' });
    XP.ribs(o, ribs.slice(0, 9), 2.2);
  },
};

// ================================================================ an Akkaraman ewe (head to the left)
// The fat-tailed white sheep of the Anatolian steppe: a thick crimped fleece, a clean pale face with a few dark
// freckles, and the broad tail that stores fat for the lean winter. A ruminant like the cow, so the four-chambered
// stomach fills the belly, the rumen biggest of all on the left side.
const SHEEPX = {
  K: 1 / 6, BB: [-148, -202, 304, 212],
  BODY: [[-100, -120], [-92, -154], [-66, -176], [-30, -184], [10, -184], [50, -180], [88, -168], [114, -146], [124, -118], [120, -88], [104, -66], [78, -54], [40, -50], [0, -50], [-40, -52], [-74, -60], [-96, -80], [-104, -100]],
  HEAD: [[-66, -142], [-86, -152], [-106, -148], [-120, -138], [-130, -124], [-136, -108], [-132, -98], [-120, -94], [-104, -98], [-86, -106], [-70, -118]],
  EAR: [[-78, -140], [-60, -148], [-48, -142], [-60, -134], [-76, -132]],
  FORE: [[-64, -70], [-46, -70], [-45, -36], [-46, -8], [-44, -1], [-59, -1], [-59, -8], [-61, -36]],
  HIND: [[58, -76], [84, -78], [86, -52], [79, -32], [81, -8], [83, -1], [68, -1], [68, -8], [66, -30], [63, -52]],
  TAIL: [[92, -128], [122, -126], [140, -108], [144, -84], [134, -62], [114, -52], [94, -58], [86, -82], [86, -110]],
  CAV: [[-84, -120], [-72, -150], [-40, -164], [0, -166], [40, -162], [76, -150], [98, -126], [102, -96], [90, -76], [60, -66], [20, -64], [-20, -66], [-56, -72], [-80, -90]],
  THR: [[-70, -140], [-62, -150], [-54, -128], [-62, -108], [-78, -106], [-84, -124]],
  spots() { return XP.spots(this.K, [['sheep_rumen', 18, -122], ['sheep_tail', 112, -90]]); },
  draw(x) { XP.draw(x, 'sheep', this); },
  paint(o) {
    const R = MX.rng(5151), W = '#E6DCC4', F = '#E4D8C0', fleece = XP.lumpy(this.BODY, 5, 2);
    COWA.lx = -0.35;
    XP.shadow(o, 0, 120);
    // the legs, clean of wool, pale with dark cloven hooves; the far pair in shadow
    const leg = (p, dark) => {
      const c = dark ? U.shade(F, -0.4) : F;
      MX.fill(o, p, MX.lin(o, 0, -70, 0, 0, [[0, U.shade(c, -0.1)], [0.6, c], [1, U.shade(c, -0.15)]])); MX.line(o, p, 'rgba(70,56,40,0.7)', 0.8, true);
      XP.hair(o, R, p, 90, c, 1, 2, 1.55, 0.3, 0.4);
      const bot = p.filter(q => q[1] > -8).map(q => q[0]), x0 = Math.min(...bot), x1 = Math.max(...bot);
      o.fillStyle = MX.lin(o, 0, -7, 0, 0, [[0, '#3A302A'], [1, '#141010']]); o.beginPath(); o.moveTo(x0 - 1, 0); o.lineTo(x0 + 0.5, -7); o.lineTo(x1 - 0.5, -7); o.lineTo(x1 + 1, 0); o.closePath(); o.fill();
      MX.line(o, [[(x0 + x1) / 2, -6.5], [(x0 + x1) / 2, 0]], 'rgba(0,0,0,0.7)', 0.6);
    };
    leg(this.FORE.map(([x, y]) => [x + 24, y - 3]), true); leg(this.HIND.map(([x, y]) => [x + 22, y - 3]), true);
    leg(this.FORE, false); leg(this.HIND, false);
    // the fleece: one outline of scalloped locks, the crimped wool in staples, dirt and lanolin yellowing the tips
    MX.line(o, fleece, 'rgba(96,82,58,0.8)', 1.6, true);
    MX.fill(o, fleece, MX.lin(o, 0, -190, 0, -50, [[0, '#F4ECD8'], [0.45, '#E8DCC0'], [0.85, '#CFC0A0'], [1, '#B4A480']]));
    o.save(); MX.path(o, fleece); o.clip();
    // the locks: rounded clumps with dark crevices between them
    for (const [x, y] of MX.scatter(R, 170, 12, U.bbox(fleece), (x, y) => U.inPoly(x, y, fleece))) {
      const r = 7 + R() * 5, sh = (y + 120) / 140;
      o.fillStyle = MX.rad(o, x - r * 0.3, y - r * 0.35, 0.5, r * 1.1, [[0, 'rgba(255,250,236,0.55)'], [0.7, 'rgba(236,226,200,0.15)'], [1, `rgba(90,74,48,${(0.18 + sh * 0.12).toFixed(2)})`]]);
      o.beginPath(); o.ellipse(x, y, r, r * 0.86, R() * 3, 0, TAU); o.fill();
    }
    // crimp: the tiny waves of each fibre bundle
    for (let k = 0; k < 2600; k++) {
      const bb = U.bbox(fleece), x = bb[0] + R() * bb[2], y = bb[1] + R() * bb[3], r = 1.2 + R() * 1.6, a = R() * TAU;
      o.strokeStyle = U.rgba(R() < 0.55 ? '#FFFAEC' : '#9A8660', 0.4); o.lineWidth = 0.4;
      o.beginPath(); o.arc(x, y, r, a, a + 2.2); o.stroke();
    }
    o.restore();
    XP.shade(o, [fleece], s => {
      XP.soft(s, -10, -172, 100, 18, '#FFFFFF', 0.3); XP.soft(s, 0, -58, 110, 18, '#3A2A14', 0.3);
      XP.soft(s, 96, -120, 26, 34, '#FFFFFF', 0.2); XP.soft(s, -84, -116, 18, 30, '#FFFFFF', 0.18);
    });
    // the see-through body
    XP.inside(o, [this.CAV, this.THR], x => this.organs(x, R));
    // the head, held low and forward
    MX.line(o, this.HEAD, 'rgba(70,56,40,0.85)', 1.6, true);
    MX.fill(o, this.HEAD, MX.lin(o, -136, -150, -66, -100, [[0, U.shade(W, 0.05)], [1, U.shade(W, -0.12)]]));
    XP.shade(o, [this.HEAD], s => {
      XP.soft(s, -104, -138, 20, 10, '#FFFFFF', 0.35); XP.soft(s, -110, -100, 22, 8, '#5A4830', 0.25);
      // Akkaraman freckles: dark patches round the eye and on the muzzle
      for (const [x, y, r] of [[-98, -130, 7], [-124, -112, 5], [-130, -104, 3.4], [-116, -120, 2.4], [-88, -140, 3]]) { s.save(); MX.blur(s, 0.8); MX.fill(s, MX.blob(x, y, r, r * 0.8, { seed: x, wob: 0.25, n: 10 }), 'rgba(44,32,24,0.85)'); s.restore(); }
    });
    XP.hair(o, R, this.HEAD, 320, W, 1, 2, 0.15, 0.5, 0.4);
    XP.eye(o, -100, -130, 4.4, 3.2, '#B8862E', 'slit');
    MX.line(o, [[-105, -132.5], [-100, -134.5], [-95, -132.5]], 'rgba(40,28,20,0.8)', 0.8);
    o.fillStyle = '#3A2A26'; o.beginPath(); o.ellipse(-133, -108, 1.4, 3, 0.6, 0, TAU); o.fill();
    MX.line(o, [[-134, -101], [-128, -99], [-120, -99]], 'rgba(50,36,30,0.8)', 0.9);
    MX.fill(o, this.EAR, MX.lin(o, -78, 0, -48, 0, [[0, U.shade(W, -0.2)], [1, W]])); MX.line(o, this.EAR, 'rgba(70,56,40,0.8)', 0.9, true);
    MX.fill(o, MX.inset(this.EAR, 2), 'rgba(220,160,150,0.4)');
    // the fat tail: broad and heavy under a short fleece, a groove down the middle, a small tip at the bottom;
    // seen through, the fat stored in it in pale lobules round the little tail vertebrae
    MX.line(o, this.TAIL, 'rgba(96,82,58,0.8)', 1.4, true);
    MX.fill(o, this.TAIL, MX.lit(o, 112, -96, 36, '#E4D6B6', 0.3, 0.35, -0.35, -0.4));
    XP.hair(o, R, this.TAIL, 900, '#E4D6B6', 1, 2, 1.4, 1.2, 0.4);
    MX.layer(o, x => {
      const bb = U.bbox(this.TAIL), cells = MX.voronoi(MX.scatter(R, 60, 5, bb), [[bb[0], bb[1]], [bb[0] + bb[2], bb[1]], [bb[0] + bb[2], bb[1] + bb[3]], [bb[0], bb[1] + bb[3]]]);
      for (const c of cells) { if (!c || c.length < 3) continue; MX.fill(x, c, U.rgba(R() < 0.5 ? '#F4E4A8' : '#EAD48C', 0.95)); MX.line(x, c, 'rgba(200,150,110,0.7)', 0.6, true); }
      for (let k = 0; k < 7; k++) { x.fillStyle = 'rgba(244,236,220,0.9)'; x.beginPath(); x.ellipse(113, -118 + k * 9, 3.4 - k * 0.2, 2.6, 0, 0, TAU); x.fill(); }
      MX.layer(x, m => MX.fill(m, MX.inset(this.TAIL, 7), '#000'), 4, 1, 'destination-in');
    }, 0, 0.8);
    MX.line(o, [[113, -124], [114, -96], [113, -64]], 'rgba(120,100,70,0.45)', 1.4);
    MX.taper(o, [[114, -56], [116, -48], [115, -42]], 6, 3, '#D8C8A6', 'rgba(96,82,58,0.8)');
  },
  organs(o, R) {
    XP.flesh(o, [this.CAV, this.THR], -160, -60);
    XP.spine(o, [[-84, -144], [-40, -162], [20, -164], [80, -154]], 22, 3.4);
    const ribs = [];
    for (let k = 0; k < 13; k++) { const xt = -72 + k * 8; ribs.push([[xt, -160], [xt - 5, -130], [xt - 10, -100], [xt - 14, k < 8 ? -72 : -86 - k]]); }
    XP.ribs(o, ribs, 3);
    // windpipe and oesophagus down the neck; the lungs and heart in the chest
    XP.trachea(o, [[-74, -122], [-66, -112], [-58, -104], [-48, -100]], 4.6, 8);
    XP.lungs(o, R, [[-80, -122], [-66, -148], [-46, -150], [-38, -132], [-40, -110], [-52, -98], [-72, -100]], 50, 5);
    XP.heart(o, -58, -92, 11, 13, 0.5, 21);
    XP.diaphragm(o, [[-34, -156], [-38, -130], [-42, -104], [-46, -76]]);
    // the rumen: most of the left side, the grooves between its sacs padded with fat, vessels running over it
    const RU = [[-30, -150], [0, -160], [40, -160], [72, -150], [92, -126], [90, -98], [74, -78], [40, -70], [0, -70], [-24, -80], [-34, -104], [-36, -130]];
    COWP.organ(o, RU, '#C8A89A', {
      hi: 0.3, paint: () => {
        COWP.groove(o, [[-30, -114], [0, -112], [30, -114], [60, -110], [86, -106]], 3.4);
        COWP.groove(o, [[70, -150], [78, -128], [86, -108]], 2.6);
        COWP.vessels(o, R, -8, -140, 0.1, 30, 0.9, 'rgba(150,40,40,0.45)', 3);
        COWP.vessels(o, R, 10, -86, -0.2, 30, 0.9, 'rgba(150,40,40,0.45)', 3);
      },
    });
    // the spleen lies flat on the front of the rumen
    COWP.organ(o, [[-34, -150], [-18, -158], [-8, -154], [-16, -140], [-30, -134]], '#6A3C5A', { hi: 0.25, sh: 2 });
    // the reticulum against the diaphragm, its honeycomb lining faint through the wall
    COWP.organ(o, MX.blob(-30, -88, 12, 11, { seed: 13, wob: 0.05 }), '#BE9A86', {
      hi: 0.2, sh: 3, paint: (cx, cy) => { o.strokeStyle = 'rgba(110,80,60,0.4)'; o.lineWidth = 0.6; for (let q = -3; q <= 3; q++) for (let r = -3; r <= 3; r++) { const x = cx + q * 4.2, y = cy + r * 3.6 + (q % 2 ? 1.8 : 0); o.beginPath(); for (let k = 0; k <= 6; k++) { const a = k / 6 * TAU; k ? o.lineTo(x + Math.cos(a) * 2.1, y + Math.sin(a) * 2.1) : o.moveTo(x + 2.1, y); } o.stroke(); } },
    });
    // the abomasum along the belly floor, and a few coils of gut showing behind the rumen
    COWP.organ(o, [[-22, -74], [10, -71], [40, -69], [52, -64], [20, -60], [-12, -62]], '#D48C80', { hi: 0.2, sh: 2 });
    const GUT = MX.blob(90, -84, 12, 12, { wob: 0.08, seed: 17 });
    XP.loops(o, R, GUT, 8, 3.4, ['#D89888', '#E0A898']);
    MX.tube(o, [[-72, -130], [-60, -130], [-48, -134], [-36, -136], [-28, -134]], 4, '#D88A80', { hi: '#F8C8BC' });
    XP.ribs(o, ribs.slice(0, 8), 2.2);
  },
};

// ================================================================ a village hen (head to the left)
// Red-brown plumage with golden hackles on the neck, a red comb and wattles. No teeth: the food waits in the crop
// at the base of the neck, is softened in the glandular stomach, then ground up with swallowed grit in the
// muscular gizzard.
const HENX = {
  K: 1 / 12, BB: [-150, -236, 296, 246],
  BODY: [[-58, -118], [-38, -138], [-6, -146], [30, -144], [62, -138], [86, -132], [104, -110], [100, -86], [84, -64], [58, -46], [22, -38], [-14, -40], [-44, -54], [-62, -76], [-68, -98]],
  TAIL: [[66, -132], [90, -164], [108, -190], [124, -198], [136, -186], [134, -156], [122, -126], [104, -104], [86, -110]],
  NECK: [[-36, -136], [-50, -166], [-64, -186], [-86, -190], [-100, -174], [-98, -150], [-86, -126], [-70, -104], [-56, -110]],
  HEAD: [[-62, -182], [-76, -196], [-96, -196], [-108, -184], [-112, -168], [-106, -154], [-92, -148], [-74, -152], [-64, -164]],
  WING: [[-28, -126], [8, -136], [46, -132], [76, -118], [92, -100], [78, -84], [46, -78], [10, -82], [-18, -94], [-32, -110]],
  COMB: [[-106, -186], [-112, -204], [-100, -198], [-98, -218], [-88, -202], [-82, -222], [-74, -202], [-66, -214], [-64, -196], [-54, -200], [-60, -184]],
  CAV: [[-54, -116], [-36, -134], [-6, -140], [30, -138], [62, -130], [84, -110], [86, -90], [70, -66], [44, -52], [12, -46], [-20, -50], [-46, -64], [-60, -86], [-62, -104]],
  THR: [[-62, -170], [-80, -178], [-92, -166], [-88, -146], [-72, -126], [-56, -114], [-46, -132]],
  spots() { return XP.spots(this.K, [['hen_crop', -54, -114], ['hen_gizzard', 24, -84]]); },
  draw(x) { XP.draw(x, 'chicken', this); },
  paint(o) {
    const R = MX.rng(7171), B = '#9A4E24', G = '#D8963E', parts = [this.BODY, this.NECK, this.HEAD];
    COWA.lx = -0.35;
    XP.shadow(o, 10, 80);
    // the far leg, then the tail
    this.leg(o, R, -8, true);
    MX.line(o, this.TAIL, 'rgba(20,16,12,0.9)', 1.6, true);
    MX.fill(o, this.TAIL, MX.lin(o, 70, -130, 130, -190, [[0, '#3A2A1C'], [1, '#18140E']]));
    o.save(); MX.path(o, this.TAIL); o.clip();
    for (let k = 0; k < 9; k++) { const a = -0.95 - k * 0.07; MX.line(o, [[76 + k * 3, -118 + k * 2], [76 + k * 3 + Math.cos(a) * 90, -118 + k * 2 + Math.sin(a) * 90]], 'rgba(90,140,90,0.28)', 3); MX.line(o, [[76 + k * 3, -118 + k * 2], [76 + k * 3 + Math.cos(a) * 90, -118 + k * 2 + Math.sin(a) * 90]], 'rgba(0,0,0,0.5)', 0.6); }
    o.restore();
    XP.figure(o, parts, MX.lin(o, 0, -200, 0, -38, [[0, U.shade(B, 0.1)], [0.5, B], [1, U.shade(B, -0.3)]]), 'rgba(40,20,8,0.85)', 1.8);
    // the plumage: body feathers lying back, the golden hackles falling down the neck, small feathers on the head
    XP.feathers(o, R, this.BODY, 820, B, 9, 0.35);
    XP.feathers(o, R, this.NECK, 220, G, 7, 1.15, 0.3);
    XP.hair(o, R, this.NECK, 420, G, 8, 14, 1.2, 0.3, 1.1, 0.55);
    XP.hair(o, R, this.NECK, 140, '#4A2A10', 6, 10, 1.2, 0.3, 0.5, 0.5);
    XP.feathers(o, R, this.HEAD, 120, U.shade(G, -0.1), 3.4, 0.2);
    XP.shade(o, parts, s => {
      XP.soft(s, 0, -134, 70, 14, '#FFF0C8', 0.28); XP.soft(s, 10, -52, 80, 14, '#1E0E04', 0.35);
      XP.soft(s, -54, -96, 16, 26, '#FFF0C8', 0.18); XP.soft(s, -80, -176, 14, 10, '#FFF0C8', 0.2);
    });
    // the folded wing: rows of coverts over the long flight feathers
    MX.line(o, this.WING, 'rgba(40,20,8,0.8)', 1.2, true);
    MX.fill(o, this.WING, MX.lin(o, 0, -136, 0, -78, [[0, U.shade(B, 0.05)], [1, U.shade(B, -0.2)]]));
    o.save(); MX.path(o, this.WING); o.clip();
    for (let k = 0; k < 9; k++) { const y = -96 + k * 2.2; MX.line(o, [[-20 + k * 6, y - 4], [40 + k * 4, y - 2], [92, y + 2]], 'rgba(30,14,4,0.55)', 0.8); MX.line(o, [[-20 + k * 6, y - 3], [40 + k * 4, y - 1], [92, y + 3]], 'rgba(220,150,90,0.25)', 0.6); }
    o.restore();
    XP.feathers(o, R, [[-28, -126], [8, -136], [46, -132], [60, -120], [30, -108], [0, -104], [-24, -110]], 160, U.shade(B, 0.08), 6.5, 0.3);
    // the see-through body
    XP.inside(o, [this.CAV, this.THR], x => this.organs(x, R));
    this.leg(o, R, 22, false);
    // head: comb, wattles, the red earlobe, the eye with its orange iris, the horn-coloured beak
    const red = MX.lin(o, 0, -222, 0, -186, [[0, '#E0402E'], [1, '#A82018']]);
    MX.line(o, this.COMB, 'rgba(90,10,8,0.8)', 1, true); MX.fill(o, this.COMB, red);
    for (let k = 0; k < 60; k++) { o.fillStyle = 'rgba(120,10,8,0.3)'; o.beginPath(); o.arc(-104 + R() * 46, -210 + R() * 22, 0.6, 0, TAU); o.fill(); }
    XP.soft(o, -86, -206, 10, 5, '#FFD0C0', 0.35);
    const wat = MX.blob(-104, -142, 7, 11, { seed: 4, wob: 0.1 });
    MX.fill(o, wat, MX.lit(o, -104, -142, 11, '#C8281E', 0.3, 0.35)); MX.line(o, wat, 'rgba(90,10,8,0.8)', 0.8, true);
    MX.fill(o, MX.blob(-78, -164, 5, 6, { seed: 8 }), MX.lit(o, -78, -164, 6, '#C83A2A', 0.3, 0.3));
    MX.fill(o, [[-108, -180], [-126, -172], [-138, -164], [-124, -162], [-108, -160]], MX.lin(o, -108, 0, -138, 0, [[0, '#C89A48'], [1, '#E8C878']]));
    MX.fill(o, [[-108, -160], [-124, -161], [-116, -155], [-106, -154]], '#B08434');
    MX.line(o, [[-108, -180], [-126, -172], [-138, -164], [-124, -162], [-108, -160]], 'rgba(80,50,10,0.8)', 0.8, true);
    o.fillStyle = '#4A3010'; o.beginPath(); o.ellipse(-116, -170, 2, 1, -0.3, 0, TAU); o.fill();
    XP.eye(o, -90, -174, 4.4, 4.4, '#E08A20', 0.45);
  },
  // the scaly yellow shank and the four toes spread on the ground
  leg(o, R, x, dark) {
    const col = dark ? '#A8842A' : '#E0B040', edge = 'rgba(90,60,10,0.8)';
    for (const [tx, ty] of [[x - 32, -1], [x - 20, 3], [x - 6, 2.5], [x + 14, -1]]) MX.taper(o, [[x, -8], [(x + tx) / 2, (ty - 8) / 2 - 1], [tx, ty]], 5.4, 2.6, col, edge);
    MX.taper(o, [[x + 5, -50], [x + 2, -28], [x, -7]], 9.5, 7, col, edge);
    for (let k = 0; k < 8; k++) { const y = -44 + k * 4.8; MX.line(o, [[x - 2.4, y], [x + 1, y + 1.6], [x + 4.4, y]], 'rgba(120,80,10,0.55)', 0.5); }
    for (const [tx, ty] of [[x - 32, -1], [x - 20, 3], [x - 6, 2.5], [x + 14, -1]]) { o.fillStyle = '#5A4A2A'; o.beginPath(); o.arc(tx, ty, 1.3, 0, TAU); o.fill(); }
    // the feathered thigh above it
    MX.fill(o, MX.blob(x + 6, -54, 14, 12, { seed: x + 50, wob: 0.1 }), U.shade('#9A4E24', dark ? -0.4 : -0.1));
  },
  organs(o, R) {
    XP.flesh(o, [this.CAV, this.THR], -150, -40);
    XP.spine(o, [[-44, -134], [0, -138], [40, -134], [84, -120]], 14, 3.6);
    XP.ribs(o, [0, 1, 2, 3, 4, 5].map(k => [[-20 + k * 12, -136], [-26 + k * 12, -110], [-36 + k * 11, -84], [-46 + k * 10, -64]]), 3.4);
    // down the neck: the windpipe, and the oesophagus beside it to the crop
    XP.trachea(o, [[-96, -164], [-86, -146], [-74, -128], [-62, -112], [-46, -104]], 5.2, 14);
    MX.tube(o, [[-92, -168], [-80, -152], [-70, -138], [-62, -126]], 5, '#D88A80', { hi: '#F8C8BC' });
    // the lungs, bright pink, pressed up into the ribs; the air sacs as faint glassy bubbles below them
    XP.lungs(o, R, [[-30, -130], [-4, -136], [24, -132], [20, -122], [-8, -120], [-28, -122]], 26, 4);
    for (const [x, y, rx, ry] of [[40, -120, 22, 10], [-2, -108, 16, 8]]) { o.fillStyle = 'rgba(214,230,240,0.18)'; o.beginPath(); o.ellipse(x, y, rx, ry, 0, 0, TAU); o.fill(); o.strokeStyle = 'rgba(230,240,248,0.4)'; o.lineWidth = 0.6; o.stroke(); }
    // the heart low in front, cradled by the two lobes of the liver
    XP.heart(o, -34, -92, 10, 13, 0.3, 31);
    COWP.organ(o, [[-54, -94], [-40, -104], [-24, -100], [-14, -82], [-20, -62], [-38, -56], [-54, -70]], '#7A2A22', { hi: 0.25 });
    // behind them the glandular stomach, and the gizzard: a thick disc of dark muscle round a shining tendon,
    // opened to show the grit that grinds the grain
    MX.tube(o, [[-40, -108], [-24, -108], [-8, -104], [4, -100]], 5, '#D88A80', { hi: '#F8C8BC' });
    COWP.organ(o, MX.blob(8, -98, 12, 7, { seed: 41, rot: 0.3 }), '#D89A88', { hi: 0.3, sh: 2 });
    // intestine loops, the two long caeca, the cloaca at the vent
    const GUT = MX.blob(58, -86, 26, 18, { wob: 0.1, seed: 43 });
    XP.loops(o, R, GUT, 14, 4, ['#D89888', '#E0A898', '#D08C80']);
    for (const d of [0, 5]) MX.tube(o, [[40, -70 + d], [60, -76 + d], [78, -96 + d], [82, -110 + d]], 4.2, '#C8907C', { hiA: 0.4 });
    MX.tube(o, [[70, -92], [82, -94], [92, -98]], 6, '#B88A74', { hiA: 0.4 });
    const GZ = MX.blob(24, -84, 22, 18, { seed: 45, wob: 0.05, rot: 0.2 });
    COWP.organ(o, GZ, '#7A2420', {
      hi: 0.3, paint: (cx, cy) => {
        o.fillStyle = MX.rad(o, cx - 4, cy - 4, 1, 12, [[0, 'rgba(236,240,250,0.9)'], [1, 'rgba(180,196,220,0.2)']]); o.beginPath(); o.ellipse(cx - 2, cy - 2, 11, 8, 0.3, 0, TAU); o.fill();
        const win = MX.blob(cx + 3, cy + 2, 8.5, 6.5, { seed: 46, wob: 0.08 });
        MX.fill(o, win, '#8A7A5A');
        o.save(); MX.path(o, win); o.clip();
        for (let k = 0; k < 40; k++) { const x = cx - 6 + R() * 18, y = cy - 5 + R() * 14; MX.fill(o, MX.blob(x, y, 1 + R() * 1.4, 0.8 + R() * 1, { seed: k, wob: 0.3, n: 8 }), ['#B8B0A0', '#8A8478', '#D8D0C0', '#6A6258'][k % 4]); }
        for (let k = 0; k < 18; k++) { o.fillStyle = 'rgba(230,200,110,0.8)'; o.beginPath(); o.ellipse(cx - 6 + R() * 18, cy - 5 + R() * 14, 1, 0.6, R() * 3, 0, TAU); o.fill(); }
        o.restore();
        MX.line(o, win, '#3A1008', 1.4, true); MX.line(o, win, '#C87A6A', 0.6, true);
      },
    });
    // the crop at the base of the neck: a thin-walled pouch, the grain the hen swallowed showing through it
    const CROP = MX.blob(-54, -114, 20, 16, { seed: 47, wob: 0.06 });
    COWP.organ(o, CROP, '#E8C0A8', {
      hi: 0.35, paint: (cx, cy) => {
        for (let k = 0; k < 70; k++) { const x = cx + (R() - 0.5) * 34, y = cy + (R() - 0.5) * 26; o.fillStyle = U.rgba(k % 3 ? '#E0B040' : '#C89A58', 0.55); o.beginPath(); o.ellipse(x, y, 2 + R(), 1.4 + R() * 0.6, R() * 3, 0, TAU); o.fill(); }
        COWP.vessels(o, R, cx - 16, cy - 6, 0.2, 14, 0.6, 'rgba(170,50,50,0.45)', 2);
      },
    });
  },
};

// ================================================================ the white stork (head to the right)
// White with black flight feathers, the long red bill and legs. Everything about it is built for flight: the deep
// keel of the breastbone anchors the huge flight muscles, and air sacs fill the body and even the bones, keeping
// it light and pumping air through the lungs in one direction.
const STORKX = {
  K: 1 / 6, BB: [-146, -242, 330, 250],
  BODY: [[-100, -56], [-70, -80], [-34, -96], [6, -104], [44, -106], [72, -100], [94, -86], [100, -68], [88, -50], [60, -38], [20, -32], [-20, -34], [-60, -40], [-96, -46]],
  NECKP: [[56, -96], [78, -120], [90, -148], [92, -176], [86, -204]],
  HEAD: [[72, -212], [80, -228], [96, -232], [108, -224], [112, -210], [102, -200], [84, -198]],
  WING: [[-30, -90], [20, -100], [62, -96], [84, -80], [70, -58], [30, -46], [-20, -42], [-70, -44], [-118, -48], [-138, -54], [-110, -60], [-66, -74]],
  CAV: [[-70, -66], [-36, -86], [4, -94], [44, -96], [70, -90], [86, -76], [86, -60], [68, -46], [30, -40], [-10, -38], [-44, -42], [-68, -52]],
  spots() { return XP.spots(this.K, [['bird_airsac', -12, -72], ['bird_keel', 36, -44]]); },
  draw(x) { XP.draw(x, 'stork', this); },
  paint(o) {
    const R = MX.rng(9191), Wh = '#F2F0E8', neck = XP.band(this.NECKP, 46, 26), parts = [this.BODY, neck, this.HEAD];
    COWA.lx = -0.35;
    // the short white tail under the long black wing tips
    const TAILF = [[-90, -58], [-124, -58], [-132, -50], [-96, -44]];
    MX.fill(o, TAILF, '#E8E6DE'); MX.line(o, TAILF, 'rgba(60,60,56,0.6)', 0.8, true);
    XP.figure(o, parts, MX.lin(o, 0, -232, 0, -32, [[0, '#FAF8F2'], [0.6, Wh], [1, '#C8C6BE']]), 'rgba(60,58,52,0.8)', 1.8);
    XP.feathers(o, R, this.BODY, 560, Wh, 8, Math.PI + 0.2, 0.1);
    XP.hair(o, R, neck, 260, Wh, 5, 10, 1.9, 0.4, 0.8, 0.35);
    XP.feathers(o, R, this.HEAD, 80, Wh, 3, Math.PI - 0.3, 0.08);
    XP.shade(o, parts, s => {
      XP.soft(s, 20, -96, 70, 12, '#FFFFFF', 0.4); XP.soft(s, 10, -36, 90, 12, '#40403A', 0.3);
      XP.soft(s, 80, -150, 10, 50, '#40403A', 0.15, 0.2); XP.soft(s, 72, -76, 18, 22, '#FFFFFF', 0.25);
    });
    // the folded wing: white coverts in front, the black flight feathers behind, the longest primaries reaching
    // past the tail
    MX.line(o, this.WING, 'rgba(20,20,18,0.85)', 1.4, true);
    MX.fill(o, this.WING, MX.lin(o, 84, 0, -138, 0, [[0, '#F0EEE6'], [0.3, '#E4E2DA'], [0.42, '#26241F'], [1, '#141310']]));
    o.save(); MX.path(o, this.WING); o.clip();
    XP.feathers(o, R, [[-30, -90], [20, -100], [62, -96], [84, -80], [70, -60], [30, -62], [0, -70], [-20, -80]], 180, '#ECEAE2', 7, Math.PI + 0.1, 0.08);
    for (let k = 0; k < 11; k++) { const y = -76 + k * 3; MX.line(o, [[10 - k * 2, y - 6], [-60, y - 4 + k * 0.4], [-140 + k * 3, y + 2 + k * 0.6]], 'rgba(90,90,84,0.5)', 0.7); MX.line(o, [[10 - k * 2, y - 5], [-60, y - 3 + k * 0.4], [-140 + k * 3, y + 3 + k * 0.6]], 'rgba(0,0,0,0.6)', 0.5); }
    XP.soft(o, -40, -66, 40, 10, '#6A6A70', 0.25);
    o.restore();
    // the see-through body and neck
    XP.inside(o, [this.CAV, XP.band(this.NECKP, 26, 14)], x => this.organs(x, R));
    // head: black bare skin round the dark eye, the long red bill
    const BEAK = [[104, -224], [140, -212], [178, -197], [176, -192], [140, -200], [102, -204]];
    MX.fill(o, BEAK, MX.lin(o, 104, -214, 178, -195, [[0, '#B8301E'], [0.7, '#DA4A30'], [1, '#E8745A']])); MX.line(o, BEAK, 'rgba(100,20,10,0.8)', 0.8, true);
    MX.line(o, [[104, -214], [140, -206], [176, -194.5]], 'rgba(100,20,10,0.6)', 0.6);
    MX.line(o, [[108, -222], [140, -211], [170, -199]], 'rgba(255,220,200,0.4)', 0.8);
    o.fillStyle = 'rgba(20,18,16,0.9)'; o.beginPath(); o.ellipse(99, -218, 7, 5, -0.2, 0, TAU); o.fill();
    XP.eye(o, 98, -218, 3.4, 3.4, '#3A2A1E', 0.6);
  },
  organs(o, R) {
    XP.flesh(o, [this.CAV, XP.band(this.NECKP, 26, 14)], -110, -30);
    // the long neck's many vertebrae, and the backbone
    XP.spine(o, [[-70, -70], [-20, -90], [30, -98], [60, -96]], 16, 3.6);
    XP.spine(o, [[60, -100], [80, -124], [90, -152], [90, -180], [86, -200]], 14, 4);
    // down the neck: the long ringed windpipe, the oesophagus beside it
    XP.trachea(o, [[92, -196], [96, -176], [94, -148], [84, -122], [70, -100], [56, -86]], 5, 24);
    MX.tube(o, [[84, -198], [86, -176], [84, -150], [74, -124], [58, -102], [40, -86]], 4.4, '#D88A80', { hi: '#F8C8BC' });
    // the lungs: small, spongy, fixed up against the ribs
    XP.lungs(o, R, [[-4, -92], [22, -98], [46, -96], [40, -86], [14, -84], [-6, -86]], 24, 4);
    // the air sacs: thin glassy bags filling most of the body cavity
    for (const [x, y, rx, ry, r] of [[-12, -72, 34, 18, 0.1], [16, -76, 16, 11, 0], [52, -88, 12, 8, 0.3], [-50, -58, 18, 10, 0.2]]) {
      o.fillStyle = MX.rad(o, x - rx * 0.3, y - ry * 0.3, 1, rx, [[0, 'rgba(236,244,250,0.55)'], [0.7, 'rgba(190,210,226,0.3)'], [1, 'rgba(160,190,210,0.45)']]);
      o.beginPath(); o.ellipse(x, y, rx, ry, r, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(236,244,250,0.7)'; o.lineWidth = 0.7; o.stroke();
      o.fillStyle = 'rgba(255,255,255,0.7)'; o.beginPath(); o.ellipse(x - rx * 0.4, y - ry * 0.45, rx * 0.2, ry * 0.12, -0.4, 0, TAU); o.fill();
      COWP.vessels(o, R, x + rx * 0.6, y + ry * 0.2, Math.PI + 0.3, rx * 0.5, 0.4, 'rgba(170,60,60,0.35)', 2);
    }
    // the heart at the front of the chest, the gizzard and a few loops of gut low behind
    XP.heart(o, 70, -68, 9, 11, -0.3, 61);
    COWP.organ(o, MX.blob(-24, -50, 10, 8, { seed: 62 }), '#7A2420', { hi: 0.3, sh: 2 });
    XP.loops(o, R, MX.blob(-56, -48, 14, 6, { seed: 63 }), 6, 3, ['#D89888', '#E0A898']);
    // the breastbone and its deep keel along the underside, the dark flight muscles packed above it
    COWP.organ(o, [[88, -84], [82, -60], [56, -46], [16, -42], [22, -56], [52, -70], [72, -82]], '#8A2A26', { hi: 0.25, gloss: false, paint: () => { for (let k = 0; k < 12; k++) MX.line(o, [[80 - k * 5, -80 + k * 2], [70 - k * 5, -52 + k * 0.6]], 'rgba(60,10,8,0.3)', 0.6); } });
    const KEEL = [[92, -68], [76, -50], [44, -38], [8, -36], [4, -42], [40, -46], [72, -58]];
    MX.fill(o, KEEL, MX.lin(o, 0, -60, 0, -36, [[0, '#F4ECDC'], [1, '#D8CCB4']])); MX.line(o, KEEL, 'rgba(120,100,80,0.8)', 0.8, true);
    MX.line(o, [[88, -64], [44, -42], [8, -38]], 'rgba(255,255,255,0.6)', 0.8);
  },
};
