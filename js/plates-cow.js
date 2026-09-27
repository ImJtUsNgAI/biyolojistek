'use strict';
// Sarıkız's insides as a veterinary anatomy atlas shows them. Three plates:
//  cowleft   her left side opened: lung, heart in its sac, the diaphragm, the spleen lying on the rumen, the rumen
//            filling the whole left belly (its grooves padded with fat), the reticulum pressed against the diaphragm
//            a hand's breadth from the heart, and the oesophagus with the windpipe in the neck.
//            st.bloat swells the rumen and pushes the diaphragm into the chest; st.nail / st.magnet show the wire.
//  cowright  her right side opened (mirrored, head to the right): liver and gall bladder, the lobed kidney, the
//            round omasum, the abomasum on the floor, the intestines under the fatty veil of the omentum, the
//            spiral colon.
//  cowlining the four chambers slit open on a dissecting tray, numbered in the order food meets them: papillae,
//            honeycomb with the reticular groove, the leaves of the omasum, the spiral folds of the abomasum.
// Coordinates are in the left view with the head to the left; COWA.O shifts the whole animal inside the plate.

const COWA = {
  O: [5, 4], lx: -0.35,
  HIDE: '#C8923E',
  trunk: [[-60, -66], [-30, -61], [10, -60], [46, -60], [70, -64], [86, -60], [98, -59], [106, -50], [106, -30], [102, -8], [92, 10], [78, 16], [56, 18], [30, 24], [0, 26], [-30, 22], [-54, 16], [-70, 12], [-80, 4], [-84, -12], [-80, -30], [-70, -50]],
  neck: [[-56, -64], [-74, -70], [-92, -78], [-106, -86], [-114, -88], [-122, -82], [-130, -68], [-136, -54], [-139, -44], [-139, -37], [-133, -33], [-123, -35], [-113, -42], [-103, -44], [-95, -34], [-88, -18], [-84, -4], [-78, 4], [-72, -22], [-64, -46]],
  fore: [[-78, 6], [-56, 4], [-54, 16], [-58, 36], [-60, 50], [-59, 70], [-57, 80], [-58, 86], [-72, 86], [-71, 74], [-71, 52], [-74, 36], [-77, 18]],
  hind: [[96, -44], [106, -40], [106, -20], [100, 4], [96, 28], [96, 44], [92, 56], [91, 74], [93, 86], [80, 86], [81, 74], [82, 58], [80, 44], [72, 26], [68, 12], [78, 0], [90, -20]],
  win: [[-66, -52], [-40, -54], [-10, -54], [20, -54], [50, -54], [74, -55], [89, -46], [93, -26], [89, -4], [80, 8], [60, 14], [30, 19], [0, 21], [-30, 18], [-50, 13], [-62, 8], [-72, -6], [-76, -28]],
  neckWin: [[-106, -60], [-96, -60], [-82, -42], [-72, -20], [-72, -8], [-80, -10], [-92, -32], [-104, -50]],
  // the diaphragm: dome bulging towards the head; a bloated rumen shoves its middle forward into the chest
  diaphragm(bloat) { const D = [[6, -56], [-2, -38], [-14, -20], [-28, -4], [-42, 8], [-54, 16]]; return D.map(([x, y], i) => [x - (bloat ? 8 : 0) * Math.sin(Math.PI * i / (D.length - 1)), y]); },
  lung(bloat) { const b = bloat ? 8 : 0; return [[-72, -50], [-40, -54], [-10, -54], [4, -52], [-4 - b, -36], [-14 - b, -22], [-26 - b * 0.8, -11], [-34 - b * 0.5, -9], [-42, -14], [-48, -20], [-56, -16], [-64, -6], [-71, -10], [-76, -28]]; },
  rumen(bloat) {
    const R = [[4, -48], [24, -52], [50, -53], [72, -51], [86, -42], [91, -28], [88, -14], [84, -8], [90, -2], [90, 8], [82, 14], [62, 17], [36, 19], [8, 19], [-16, 16], [-28, 10], [-26, 0], [-14, -6], [-8, -18], [-2, -32]];
    return bloat ? R.map(([x, y]) => [40 + (x - 40) * 1.06 - (y < -20 ? 3 : 0), y < 0 ? y * 1.12 - 3 : y + 1]) : R;
  },
  spleen: { c: [3, -27], rx: 6.5, ry: 21, rot: 0.55 },
  ret: { c: [-26, 6], rx: 15, ry: 11, rot: -0.3 },
  heart: { c: [-52, -1], rx: 13, ry: 16, rot: -0.45 },
  // callout positions, already shifted by O
  at(x, y) { return [x + this.O[0], y + this.O[1]]; },
  leftSpots(st) {
    const b = st.bloat > 0.3;
    return { eso: this.at(-86, -34), lung: this.at(-38, -40), heart: this.at(-54, 2), dia: this.at(b ? -24 : -18, -14), spleen: this.at(4, -34), ret: this.at(-22, 10), rumen: this.at(46, -20), nail: this.at(-33, 4), magnet: this.at(-28, 9) };
  },
  // the right view is drawn in the same frame and mirrored, so its callouts flip x
  rightSpots() { const m = ([x, y]) => [-(x + this.O[0]), y + this.O[1]]; return { liver: m([-6, -30]), kidney: m([38, -48]), omasum: m([-14, 6]), abomasum: m([10, 16]), gut: m([72, 4]), colon: m([52, -20]), lung: m([-44, -38]) }; },
  lining: { papillae: [-70, -62], crests: [42, -84], groove: [104, -58], leaves: [-70, 72], folds: [72, 64] },
};

// ---------------------------------------------------------------- painting helpers
const COWP = {
  // a fleshy organ: soft shadow under it, a lit fill, a darker rim and a wet highlight
  organ(o, pts, base, opt = {}) {
    const [cx, cy] = MX.centroid(pts), r = opt.r || Math.max(...pts.map(p => Math.hypot(p[0] - cx, p[1] - cy)));
    o.save(); o.shadowColor = 'rgba(30,8,4,0.55)'; o.shadowBlur = (opt.sh || 5) * MX.s; o.shadowOffsetX = 1.2 * MX.s; o.shadowOffsetY = 2.2 * MX.s;
    MX.fill(o, pts, base); o.restore();
    MX.fill(o, pts, MX.lit(o, cx, cy, r, base, opt.hi == null ? 0.32 : opt.hi, opt.lo == null ? 0.38 : opt.lo, COWA.lx, -0.45));
    if (opt.paint) { o.save(); MX.path(o, pts); o.clip(); opt.paint(cx, cy, r); o.restore(); }
    MX.line(o, pts, U.rgba(U.shade(base, -0.55), 0.85), opt.edge || 0.9, true);
    if (opt.gloss !== false) this.gloss(o, pts, cx, cy, r);
  },
  gloss(o, pts, cx, cy, r) {
    o.save(); MX.path(o, pts); o.clip();
    const gx = cx + COWA.lx * r * 0.9, gy = cy - r * 0.42;
    o.fillStyle = MX.rad(o, gx, gy, 0, r * 0.55, [[0, 'rgba(255,255,255,0.34)'], [0.5, 'rgba(255,255,255,0.08)'], [1, 'rgba(255,255,255,0)']]);
    o.beginPath(); o.ellipse(gx, gy, r * 0.55, r * 0.3, COWA.lx < 0 ? -0.5 : 0.5, 0, TAU); o.fill();
    MX.line(o, MX.inset(pts, 1.6).map(([x, y]) => [x + COWA.lx * 1.2, y - 1]), 'rgba(255,255,255,0.12)', 0.9, true);
    o.restore();
  },
  // fine blood vessels branching over a serous surface
  vessels(o, R, x, y, a, len, w, col, depth = 3) {
    if (depth <= 0 || len < 3) return;
    const pts = [[x, y]]; let px = x, py = y, pa = a;
    for (let k = 0; k < 5; k++) { pa += (R() - 0.5) * 0.7; px += Math.cos(pa) * len / 5; py += Math.sin(pa) * len / 5; pts.push([px, py]); }
    MX.line(o, pts, col, w);
    for (let k = 1; k < 4; k++) if (R() < 0.7) { const p = pts[k]; this.vessels(o, R, p[0], p[1], pa + (R() < 0.5 ? -1 : 1) * (0.6 + R() * 0.6), len * 0.55, w * 0.62, col, depth - 1); }
  },
  // a furrow on the rumen: sunk into shadow, padded with yellow fat, an artery and a vein running in it
  groove(o, pts, w = 3.4) {
    MX.line(o, pts, 'rgba(60,30,20,0.55)', w + 1.6);
    MX.line(o, pts, '#D9B654', w);
    MX.line(o, pts.map(([x, y]) => [x, y - w * 0.18]), 'rgba(255,240,170,0.7)', w * 0.35);
    MX.line(o, pts.map(([x, y]) => [x, y + w * 0.12]), '#B8322A', 0.95);
    MX.line(o, pts.map(([x, y]) => [x, y + w * 0.34]), '#4A4E86', 0.8);
  },
  // short hairs of the hide, lying back along the body
  hair(o, R, pts, n, base) {
    o.save(); MX.path(o, pts); o.clip();
    const bb = U.bbox(pts);
    for (let k = 0; k < n; k++) {
      const x = bb[0] + R() * bb[2], y = bb[1] + R() * bb[3], l = 1.4 + R() * 1.6, a = 0.25 + (R() - 0.5) * 0.5;
      o.strokeStyle = U.rgba(U.shade(base, R() < 0.5 ? 0.18 : -0.2), 0.5); o.lineWidth = 0.45;
      o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); o.stroke();
    }
    o.restore();
  },
  // the edge of an incision through the body wall: hide, a line of yellow fat, red muscle
  cutEdge(o, pts) {
    MX.line(o, pts, '#3A2418', 3.4, true);
    MX.line(o, pts, '#E4C878', 2.1, true);
    MX.line(o, MX.inset(pts, 1.4), '#9A3A2C', 1.6, true);
    MX.line(o, MX.inset(pts, 2.4), 'rgba(40,10,6,0.6)', 0.7, true);
  },
  // a rib cut through: a pale ring of bone round red marrow
  ribEnd(o, x, y, a) {
    o.save(); o.translate(x, y); o.rotate(a);
    o.fillStyle = '#EFE6CF'; o.beginPath(); o.ellipse(0, 0, 3.2, 2, 0, 0, TAU); o.fill();
    o.fillStyle = '#B8584A'; o.beginPath(); o.ellipse(0, 0, 1.7, 0.9, 0, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(80,60,40,0.7)'; o.lineWidth = 0.4; o.beginPath(); o.ellipse(0, 0, 3.2, 2, 0, 0, TAU); o.stroke();
    o.restore();
  },
};

// the whole standing cow; inside(o) paints what shows through the flank window (clipped to it)
function cowFigure(o, R, inside, opt = {}) {
  const C = COWA, H = C.HIDE, dx = opt.dx || 0, dy = opt.dy || 0, shift = pts => pts.map(([x, y]) => [x + dx, y + dy]);
  const body = shift(C.trunk), neck = shift(C.neck), fore = shift(C.fore), hind = shift(C.hind), parts = [body, neck, fore, hind];
  // the far side's legs, in shadow
  for (const [leg, ox] of [[C.fore, 10], [C.hind, -11]]) {
    const p = shift(leg).map(([x, y]) => [x + ox, y - 2]);
    MX.fill(o, p, MX.lin(o, 0, 0, 0, 86, [[0, U.shade(H, -0.45)], [0.7, U.shade(H, -0.6)], [1, '#221810']])); MX.line(o, p, 'rgba(40,24,10,0.6)', 0.7, true);
    o.fillStyle = '#1E1610'; o.beginPath(); o.ellipse(MX.centroid(p.slice(6, 10))[0], 85, 7, 2.4, 0, 0, TAU); o.fill();
  }
  // tail hanging from the rump, its switch of long dark hair
  MX.line(o, shift([[98, -58], [106, -50], [110, -24], [111, 10], [110, 34]]), 'rgba(50,30,14,0.7)', 3.8);
  MX.line(o, shift([[98, -58], [106, -50], [110, -24], [111, 10], [110, 34]]), U.shade(H, -0.18), 2.6);
  for (let k = 0; k < 34; k++) { const x = 110 + (R() - 0.5) * 3; MX.line(o, shift([[x, 28], [x + (R() - 0.5) * 6, 44 + R() * 9]]), R() < 0.5 ? '#3A2618' : '#5A3A22', 0.6); }
  // one outline round the whole animal: stroke every part, then fill them all so only the outer half of the line is left
  for (const p of parts) MX.line(o, p, 'rgba(52,30,14,0.85)', 1.9, true);
  const coat = MX.lin(o, 0, -96 + dy, 0, 90 + dy, [[0, U.shade(H, 0.2)], [0.3, U.shade(H, 0.06)], [0.5, H], [0.62, U.shade(H, -0.14)], [0.8, U.shade(H, -0.36)], [0.93, U.shade(H, -0.55)], [1, '#2A1E14']]);
  for (const p of parts) MX.fill(o, p, coat);
  // light and shade on the coat: a sheet of soft shapes, trimmed to the animal's outline
  MX.layer(o, s => {
    // big soft mottling, as a real coat is never one flat colour
    for (let k = 0; k < 70; k++) { const x = -140 + R() * 250, y = -95 + R() * 180; s.fillStyle = U.rgba(R() < 0.5 ? '#FFE8B0' : '#6A3A14', 0.07); s.beginPath(); s.ellipse(x, y, 6 + R() * 16, 4 + R() * 10, R() * 3, 0, TAU); s.fill(); }
    const soft = (x, y, rx, ry, col, a, rot = 0) => { s.fillStyle = MX.rad(s, 0, 0, 0, 1, [[0, U.rgba(col, a)], [1, U.rgba(col, 0)]]); s.save(); s.translate(x + dx, y + dy); s.rotate(rot); s.scale(rx, ry); s.beginPath(); s.arc(0, 0, 1, 0, TAU); s.fill(); s.restore(); };
    // the round of the barrel catches the light; its underside falls into shade
    soft(20, -40, 80, 26, '#FFF0C8', 0.22); soft(14, 12, 90, 16, '#2A1608', 0.3);
    // shoulder blade and the point of the shoulder; the hollow behind them
    soft(-64, -36, 16, 26, '#FFF0C8', 0.22, -0.3); soft(-74, -2, 9, 9, '#FFF0C8', 0.2);
    s.save(); MX.blur(s, 2.4); MX.line(s, shift([[-50, -60], [-47, -40], [-50, -18], [-56, 4]]), 'rgba(50,24,8,0.3)', 3); s.restore();
    // the hip: the hook bone and pin bone stand out, the thigh swells below them, a fold where it meets the flank
    soft(84, -58, 9, 6, '#FFF0C8', 0.35); soft(101, -54, 6, 5, '#FFF0C8', 0.3); soft(92, -18, 16, 24, '#FFF0C8', 0.18, 0.2);
    s.save(); MX.blur(s, 2.2); MX.line(s, shift([[70, -52], [68, -30], [70, -6], [74, 12]]), 'rgba(50,24,8,0.32)', 3.2); MX.line(s, shift([[62, -60], [56, -50], [58, -44]]), 'rgba(50,24,8,0.2)', 2.4); s.restore();
    // the flank hollow in front of the hip, over the rumen: it fills out when she is bloated
    soft(58, -48, 12, 9, opt.bloat ? '#FFF0C8' : '#3A1C08', opt.bloat ? 0.3 : 0.22);
    // neck: the dewlap hangs in soft folds, wrinkles where the neck bends
    for (let k = 0; k < 4; k++) { s.save(); MX.blur(s, 1.4); MX.line(s, shift([[-108 + k * 7, -40 + k * 5], [-102 + k * 7, -30 + k * 7], [-98 + k * 7, -18 + k * 7]]), 'rgba(60,30,10,0.18)', 1.4); s.restore(); }
    soft(-96, -64, 14, 8, '#FFF0C8', 0.2, -0.5);
    // face: a darker mask round the eye and down the face, the pale ring round the dark muzzle
    soft(-120, -68, 8, 7, '#3A1E0C', 0.35); soft(-128, -56, 10, 12, '#4A2810', 0.25, 0.4);
    s.save(); MX.blur(s, 0.9); MX.line(s, shift([[-131, -49], [-127, -40], [-131, -32]]), 'rgba(250,236,210,0.8)', 2.2); s.restore();
    // legs: knees and hocks as bony knobs, dark socks down to the hoof, a tendon line down the back of each cannon
    soft(-65, 50, 7, 5, '#FFF0C8', 0.25); soft(87, 46, 6, 6, '#FFF0C8', 0.25);
    for (const [x0, x1] of [[-58, -57], [81, 80]]) { s.save(); MX.blur(s, 0.6); MX.line(s, shift([[x0, 56], [x1, 74]]), 'rgba(255,240,210,0.3)', 1.1); s.restore(); }
    s.fillStyle = MX.lin(s, 0, 60 + dy, 0, 86 + dy, [[0, 'rgba(30,18,10,0)'], [1, 'rgba(30,18,10,0.55)']]); s.fillRect(-150, 60 + dy, 300, 30);
    // a rim of light along the top line, from the poll to the tail head
    s.save(); MX.blur(s, 1.2); MX.line(s, shift([[-112, -86], [-92, -76], [-60, -64], [-20, -60], [30, -59], [70, -62], [96, -58]]), 'rgba(255,244,214,0.5)', 1.6); s.restore();
    MX.layer(s, m => { for (const p of parts) MX.fill(m, p, '#000'); }, 0, 1, 'destination-in');
  });
  for (const p of parts) COWP.hair(o, R, p, p === body ? 1500 : p === neck ? 700 : 280, H);
  // head: the wet dark muzzle and nostril, the mouth line, the eye with its lashes, ear and short horns
  o.fillStyle = MX.rad(o, -135 + dx, -42 + dy, 0.5, 7, [[0, '#6A5448'], [1, '#2E221C']]); o.beginPath(); o.ellipse(-135 + dx, -41 + dy, 5.4, 7, 0.3, 0, TAU); o.fill();
  o.fillStyle = 'rgba(255,255,255,0.35)'; o.beginPath(); o.ellipse(-136.5 + dx, -46 + dy, 1.8, 0.8, 0.3, 0, TAU); o.fill();
  o.fillStyle = '#140E0A'; o.beginPath(); o.ellipse(-137.5 + dx, -43 + dy, 1.3, 2, 0.4, 0, TAU); o.fill();
  MX.line(o, shift([[-139, -37], [-131, -35], [-124, -36]]), '#2A1E16', 0.8);
  o.fillStyle = '#F2E8D8'; o.beginPath(); o.ellipse(-119 + dx, -70 + dy, 3.1, 2.5, -0.2, 0, TAU); o.fill();
  o.fillStyle = MX.rad(o, -119.6 + dx, -70.4 + dy, 0.2, 2, [[0, '#3A2A1E'], [1, '#0E0806']]); o.beginPath(); o.arc(-119.4 + dx, -70 + dy, 1.8, 0, TAU); o.fill();
  o.fillStyle = '#FFF'; o.beginPath(); o.arc(-120 + dx, -70.9 + dy, 0.55, 0, TAU); o.fill();
  MX.line(o, shift([[-122.5, -71.8], [-119, -73], [-115.6, -72]]), '#1E120C', 0.7);
  for (let k = 0; k < 5; k++) MX.line(o, shift([[-121.5 + k * 1.4, -72.6], [-122.4 + k * 1.5, -74.4]]), '#1E120C', 0.35);
  MX.fill(o, shift([[-108, -80], [-96, -78], [-90, -72], [-99, -72], [-108, -76]]), MX.lin(o, -108 + dx, 0, -90 + dx, 0, [[0, U.shade(H, -0.2)], [1, U.shade(H, 0.05)]]));
  MX.fill(o, shift([[-104, -78.5], [-96, -77], [-93, -73.5], [-100, -74.5]]), 'rgba(230,170,140,0.6)');
  MX.line(o, shift([[-107, -78], [-95, -75]]), 'rgba(60,30,10,0.5)', 0.6);
  MX.taper(o, shift([[-111, -86], [-108, -93], [-103, -98]]), 3, 1.2, '#E8DCC0', 'rgba(90,70,50,0.8)');
  MX.line(o, shift([[-104.5, -97], [-102.6, -98.6]]), '#3A3028', 1.4);
  // what shows inside: a see-through body, or incisions through the body wall
  if (opt.ghost) opt.ghost(o);
  else { const win = shift(C.win), nw = shift(C.neckWin); for (const w of [win, nw]) { o.save(); MX.path(o, w); o.clip(); inside(o, w === nw); o.restore(); COWP.cutEdge(o, w); } }
  // the udder and teats under the belly, and the hooves
  const ud = MX.blob(72 + dx, 27 + dy, 12, 9, { wob: 0.05, seed: 3 });
  MX.fill(o, ud, MX.lit(o, 70 + dx, 24 + dy, 13, '#D8A48A', 0.25, 0.3, COWA.lx)); MX.line(o, ud, 'rgba(90,50,40,0.6)', 0.7, true);
  for (let k = 0; k < 12; k++) MX.line(o, [[62 + dx + k * 1.8, 21 + dy], [63 + dx + k * 1.7, 30 + dy]], 'rgba(160,90,70,0.25)', 0.4);
  for (const tx of [66, 76]) MX.tube(o, [[tx + dx, 33 + dy], [tx + 0.4 + dx, 39 + dy]], 2.6, '#C88A74');
  for (const leg of [hind, fore]) {
    const hx = MX.centroid(leg.slice(6, 10))[0];
    o.fillStyle = MX.lin(o, 0, 79 + dy, 0, 87 + dy, [[0, '#3A2C22'], [1, '#120C08']]); o.beginPath(); o.moveTo(hx - 6.5, 87 + dy); o.lineTo(hx - 5, 79.5 + dy); o.lineTo(hx + 5.5, 79.5 + dy); o.lineTo(hx + 6.5, 87 + dy); o.closePath(); o.fill();
    MX.line(o, [[hx - 5, 80 + dy], [hx + 5.5, 80 + dy]], 'rgba(255,240,220,0.25)', 0.5);
    MX.line(o, [[hx + 0.3, 80.5 + dy], [hx + 0.3, 87 + dy]], 'rgba(0,0,0,0.6)', 0.5);
  }
}

// ---------------------------------------------------------------- ×1 left side
plate('cowleft', {
  key: st => (st.bloat > 0.3 ? 1 : 0) + (st.nail ? 2 : 0) + (st.magnet ? 4 : 0),
  still(o, st) {
    const R = MX.rng(7070), C = COWA, bloat = st.bloat > 0.3;
    COWA.lx = -0.35;
    o.fillStyle = MX.rad(o, -10, -30, 20, 230, [[0, '#EEE9DE'], [1, '#C9C1B0']]); o.fillRect(-141, -141, 282, 282);
    o.fillStyle = MX.rad(o, 10, 92, 4, 120, [[0, 'rgba(40,30,20,0.28)'], [1, 'rgba(40,30,20,0)']]); o.beginPath(); o.ellipse(10, 92, 118, 10, 0, 0, TAU); o.fill();
    o.save(); o.translate(C.O[0], C.O[1]);
    cowFigure(o, R, (o, isNeck) => {
      if (isNeck) {
        // the jugular groove opened: the windpipe with its cartilage rings, the oesophagus above it, the jugular vein
        o.fillStyle = '#6A2A22'; o.fillRect(-120, -70, 60, 70);
        MX.tube(o, [[-106, -50], [-96, -38], [-86, -24], [-76, -10]], 7, '#E6D6C4', { hi: '#FFFFFF' });
        for (let k = 0; k < 11; k++) { const t = k / 10, x = -106 + 30 * t, y = -50 + 40 * t; MX.line(o, [[x - 2.6, y + 2.2], [x + 2.4, y - 2.6]], 'rgba(150,120,100,0.7)', 0.7); }
        MX.tube(o, [[-104, -58], [-94, -46], [-84, -32], [-74, -18]], 5.6, '#C9706A');
        MX.line(o, [[-100, -60], [-90, -48], [-80, -34], [-70, -20]], '#4A4E8E', 1.6);
        return;
      }
      // the chest and belly wall seen from inside: dark flesh, the ribs showing as pale bands
      o.fillStyle = MX.lin(o, 0, -60, 0, 24, [[0, '#5A221C'], [1, '#3A1410']]); o.fillRect(-90, -60, 190, 90);
      for (let k = 0; k < 12; k++) { const x = -66 + k * 9.5; MX.line(o, [[x + 6, -54], [x + 1, -30], [x - 6, -6], [x - 10, 14]], 'rgba(220,190,170,0.18)', 3.4); }
      const D = C.diaphragm(bloat);
      // heart in its sac, low in the chest between the elbows, its tip pointing back towards the reticulum
      const hp = MX.blob(C.heart.c[0], C.heart.c[1], C.heart.rx, C.heart.ry, { rot: C.heart.rot, wob: 0.07, seed: 51 });
      COWP.organ(o, MX.blob(C.heart.c[0], C.heart.c[1], C.heart.rx + 2.5, C.heart.ry + 2.5, { rot: C.heart.rot, wob: 0.05, seed: 52 }), '#D8B8A4', { hi: 0.2, sh: 4, gloss: true });
      COWP.organ(o, hp, '#8E2A24', {
        paint: (cx, cy) => {
          MX.line(o, [[cx - 12, cy - 8], [cx - 2, cy - 5], [cx + 10, cy - 10]], '#EAD48A', 3.6);
          MX.line(o, [[cx - 2, cy - 5], [cx + 1, cy + 6], [cx + 6, cy + 14]], '#E6CC7A', 2.2);
          MX.line(o, [[cx - 2, cy - 4.5], [cx + 1, cy + 6], [cx + 6, cy + 14]], '#B8322A', 0.8);
        },
      });
      MX.tube(o, [[-58, -14], [-60, -24], [-58, -34]], 6, '#C8403A');
      // left lung: pink, cut into small lobules as a cow's lung is; its lower edge leaves the heart uncovered
      const L = C.lung(bloat);
      COWP.organ(o, L, '#E09A96', {
        hi: 0.22, paint: (cx, cy) => {
          const bb = U.bbox(L), cells = MX.voronoi(MX.scatter(R, 90, 5, bb), [[bb[0], bb[1]], [bb[0] + bb[2], bb[1]], [bb[0] + bb[2], bb[1] + bb[3]], [bb[0], bb[1] + bb[3]]]);
          for (const c of cells) { if (!c || c.length < 3) continue; MX.fill(o, c, U.rgba(R() < 0.5 ? '#C87478' : '#F0B4AE', 0.35)); MX.line(o, c, 'rgba(150,80,90,0.45)', 0.45, true); }
          MX.line(o, [[-46, -52], [-40, -34], [-46, -18]], 'rgba(110,50,60,0.7)', 1);
        },
      });
      // the diaphragm, a sheet of red muscle round a silvery tendon, seen edge-on
      MX.line(o, D, 'rgba(40,10,6,0.6)', 7.5);
      MX.line(o, D, '#A8382E', 6);
      MX.line(o, D.slice(1, 5), '#D8DCE0', 3.2);
      MX.line(o, D.map(([x, y]) => [x - 1, y - 0.6]), 'rgba(255,255,255,0.3)', 0.9);
      // a sliver of abomasum on the floor, then the rumen over the whole left belly
      COWP.organ(o, MX.blob(-8, 19, 13, 4.5, { seed: 61 }), '#C88478', { sh: 3 });
      const RU = C.rumen(bloat);
      COWP.organ(o, RU, bloat ? '#D6C4B6' : '#C8AE9C', {
        hi: 0.25, paint: (cx, cy) => {
          o.fillStyle = MX.lin(o, 0, -54, 0, 20, [[0, 'rgba(120,140,90,0.2)'], [0.45, 'rgba(120,140,90,0.05)'], [1, 'rgba(90,60,50,0.15)']]); o.fillRect(-40, -60, 140, 82);
          for (let k = 0; k < 7; k++) COWP.vessels(o, R, -6 + k * 13 + R() * 6, -5, -Math.PI / 2 + (R() - 0.5) * 0.6, 20 + R() * 12, 0.9, 'rgba(170,50,50,0.4)');
          for (let k = 0; k < 6; k++) COWP.vessels(o, R, 2 + k * 14 + R() * 6, -4, Math.PI / 2 + (R() - 0.5) * 0.6, 14 + R() * 8, 0.8, 'rgba(170,50,50,0.35)');
          if (bloat) { o.fillStyle = MX.rad(o, 40, -34, 4, 46, [[0, 'rgba(255,250,240,0.45)'], [1, 'rgba(255,250,240,0)']]); o.fillRect(-10, -80, 110, 80); }
        },
      });
      // grooves: the long one splitting the upper and lower sacs, the coronary grooves round the blind sacs at the back
      const g = (pts) => COWP.groove(o, bloat ? pts.map(([x, y]) => [40 + (x - 40) * 1.06, y < 0 ? y * 1.12 - 3 : y + 1]) : pts);
      g([[-12, -5], [10, -7], [40, -6], [66, -7], [84, -7]]);
      g([[64, -50], [60, -34], [66, -18], [84, -8]]);
      g([[84, -7], [72, 1], [68, 10], [72, 17]]);
      g([[-12, -5], [-19, 3], [-21, 12]]);
      if (bloat) { o.setLineDash([2, 2]); MX.line(o, C.rumen(false), 'rgba(40,20,10,0.55)', 0.8, true); o.setLineDash([]); }
      // the spleen: a flat bluish-purple tongue lying on the rumen just behind the diaphragm
      const sp = C.spleen, SP = MX.blob(sp.c[0] - (bloat ? 3 : 0), sp.c[1] - (bloat ? 3 : 0), sp.rx, sp.ry, { rot: sp.rot, wob: 0.05, seed: 71 });
      COWP.organ(o, SP, '#6E4674', { hi: 0.3, sh: 3 });
      // the reticulum, pressed against the diaphragm; its honeycomb faintly showing through the thin wall
      const rt = C.ret, RT = MX.blob(rt.c[0], rt.c[1], rt.rx, rt.ry, { rot: rt.rot, wob: 0.05, seed: 81 });
      COWP.organ(o, RT, '#BE9A86', {
        paint: (cx, cy) => {
          const s = 3.2;
          for (let q = -6; q < 7; q++) for (let r = -5; r < 6; r++) {
            const x = cx + q * s * 1.5, y = cy + r * s * 1.732 + (q % 2 ? s * 0.866 : 0);
            o.strokeStyle = 'rgba(120,80,60,0.2)'; o.lineWidth = 0.5; o.beginPath();
            for (let k = 0; k <= 6; k++) { const a = k / 6 * TAU; k ? o.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s) : o.moveTo(x + s, y); }
            o.stroke();
          }
        },
      });
      if (st.nail || st.magnet) {
        // a window cut into the reticulum wall: the honeycomb inside, and the wire
        const wx = -30, wy = 6, wr = 7.5;
        o.save(); o.beginPath(); o.arc(wx, wy, wr, 0, TAU); o.clip();
        o.fillStyle = '#6A5236'; o.fillRect(wx - wr, wy - wr, wr * 2, wr * 2);
        for (let q = -3; q < 4; q++) for (let r = -3; r < 4; r++) {
          const s = 2.4, x = wx + q * s * 1.5, y = wy + r * s * 1.732 + (q % 2 ? s * 0.866 : 0);
          o.strokeStyle = '#C8AE84'; o.lineWidth = 0.8; o.beginPath();
          for (let k = 0; k <= 6; k++) { const a = k / 6 * TAU; k ? o.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s) : o.moveTo(x + s, y); }
          o.stroke();
        }
        if (st.magnet) {
          o.fillStyle = MX.lin(o, 0, wy + 1, 0, wy + 5, [[0, '#9AA0A8'], [0.4, '#DDE2E6'], [1, '#4A5058']]); U.rr(o, wx - 5, wy + 1.4, 10, 4, 1.8); o.fill();
          MX.line(o, [[wx - 5, wy + 0.6], [wx + 5, wy + 0.2]], '#6A6E74', 0.9);
        }
        o.restore();
        o.strokeStyle = '#5A2A1E'; o.lineWidth = 1; o.beginPath(); o.arc(wx, wy, wr, 0, TAU); o.stroke();
        if (st.nail) {
          // the nail has worked through the wall: its point in the diaphragm, the tissue round it inflamed
          o.fillStyle = MX.rad(o, -39, 3, 0, 8, [[0, 'rgba(220,70,40,0.7)'], [1, 'rgba(220,70,40,0)']]); o.beginPath(); o.arc(-39, 3, 8, 0, TAU); o.fill();
          MX.line(o, [[-25, 9], [-41, 2]], '#3A3A40', 1.6); MX.line(o, [[-25, 8.4], [-40, 1.6]], '#B8BEC6', 0.5);
          o.fillStyle = '#4A4A50'; o.beginPath(); o.ellipse(-24.6, 9.2, 0.9, 2.4, 0.4, 0, TAU); o.fill();
        }
      }
      // the end of the large intestine running back to the tail above the rumen
      MX.tube(o, [[76, -50], [86, -48], [96, -46]], 5, '#B89484');
      // the ribs that were cut away: their stumps along the top and bottom of the opening
      for (let k = 0; k < 11; k++) { const x = -60 + k * 8.6; COWP.ribEnd(o, x + 2, -52, 0.1); if (x < -12) COWP.ribEnd(o, x - 14, 12 - (x + 60) * 0.1, -0.3); }
      // where the ribs reach: the last rib's arch, dotted
      o.setLineDash([2.2, 2.2]); MX.line(o, [[34, -54], [18, -30], [-4, -6], [-26, 12]], 'rgba(255,245,225,0.6)', 0.8, false); o.setLineDash([]);
    }, { bloat });
    o.restore();
    MX.vignette(o, 0.1); MX.grain(o, 0.025);
    MX.scaleBar(o, 52, '50 cm');
  },
});

// ---------------------------------------------------------------- ×1 right side (mirrored: the head points right)
plate('cowright', {
  still(o) {
    const R = MX.rng(7171), C = COWA;
    o.fillStyle = MX.rad(o, 10, -30, 20, 230, [[0, '#EEE9DE'], [1, '#C9C1B0']]); o.fillRect(-141, -141, 282, 282);
    o.fillStyle = MX.rad(o, -10, 92, 4, 120, [[0, 'rgba(40,30,20,0.28)'], [1, 'rgba(40,30,20,0)']]); o.beginPath(); o.ellipse(-10, 92, 118, 10, 0, 0, TAU); o.fill();
    o.save(); o.scale(-1, 1); o.translate(C.O[0], C.O[1]);
    COWA.lx = 0.35;
    cowFigure(o, R, (o, isNeck) => {
      if (isNeck) {
        o.fillStyle = '#6A2A22'; o.fillRect(-120, -70, 60, 70);
        MX.tube(o, [[-106, -50], [-96, -38], [-86, -24], [-76, -10]], 7, '#E6D6C4', { hi: '#FFFFFF' });
        for (let k = 0; k < 11; k++) { const t = k / 10, x = -106 + 30 * t, y = -50 + 40 * t; MX.line(o, [[x - 2.6, y + 2.2], [x + 2.4, y - 2.6]], 'rgba(150,120,100,0.7)', 0.7); }
        MX.line(o, [[-100, -60], [-90, -48], [-80, -34], [-70, -20]], '#4A4E8E', 1.6);
        return;
      }
      o.fillStyle = MX.lin(o, 0, -60, 0, 24, [[0, '#5A221C'], [1, '#3A1410']]); o.fillRect(-90, -60, 190, 90);
      for (let k = 0; k < 12; k++) { const x = -66 + k * 9.5; MX.line(o, [[x + 6, -54], [x + 1, -30], [x - 6, -6], [x - 10, 14]], 'rgba(220,190,170,0.18)', 3.4); }
      const D = C.diaphragm(false);
      // the right lung is the bigger one; only a little of the heart shows on this side
      COWP.organ(o, MX.blob(-54, 4, 11, 12, { rot: -0.4, seed: 53 }), '#8E2A24', { sh: 3 });
      COWP.organ(o, [[-72, -50], [-40, -54], [-10, -54], [4, -52], [-4, -36], [-14, -22], [-26, -10], [-36, -4], [-44, -6], [-52, -10], [-60, -6], [-68, 2], [-74, -8], [-77, -28]], '#E09A96', {
        hi: 0.22, paint: () => {
          const bb = [-80, -56, 90, 60], cells = MX.voronoi(MX.scatter(R, 100, 5, bb), [[-80, -56], [10, -56], [10, 4], [-80, 4]]);
          for (const c of cells) { if (!c || c.length < 3) continue; MX.fill(o, c, U.rgba(R() < 0.5 ? '#C87478' : '#F0B4AE', 0.35)); MX.line(o, c, 'rgba(150,80,90,0.45)', 0.45, true); }
          MX.line(o, [[-50, -54], [-44, -34], [-50, -14]], 'rgba(110,50,60,0.7)', 1);
        },
      });
      MX.line(o, D, 'rgba(40,10,6,0.6)', 7.5); MX.line(o, D, '#A8382E', 6); MX.line(o, D.slice(1, 5), '#D8DCE0', 3.2);
      // the intestines packed into the back half of the belly: coils of small intestine, the spiral colon above,
      // the caecum's blind end reaching back towards the pelvis
      o.fillStyle = '#E2CC8C'; MX.fill(o, [[20, -46], [60, -50], [88, -44], [92, -20], [88, 6], [70, 16], [30, 18], [16, 0]], '#D9C07C');
      for (let k = 0; k < 34; k++) {
        const x = 30 + R() * 58, y = -18 + R() * 32, a = R() * TAU, l = 10 + R() * 8;
        const p = [[x, y], [x + Math.cos(a) * l * 0.5, y + Math.sin(a) * l * 0.5 + 2], [x + Math.cos(a) * l, y + Math.sin(a) * l]];
        MX.tube(o, p, 5.2, R() < 0.5 ? '#D89A8A' : '#CC8C7E');
      }
      COWP.organ(o, MX.blob(52, -20, 15, 12, { seed: 91 }), '#C8987E', {
        sh: 3, paint: (cx, cy) => {
          for (let r = 2; r < 15; r += 2.6) { o.strokeStyle = 'rgba(110,60,40,0.55)'; o.lineWidth = 1.1; o.beginPath(); o.ellipse(cx, cy, r, r * 0.8, 0.2, 0.3, TAU - 0.2); o.stroke(); o.strokeStyle = 'rgba(255,230,210,0.3)'; o.lineWidth = 0.5; o.beginPath(); o.ellipse(cx - 0.4, cy - 0.5, r, r * 0.8, 0.2, 0.3, TAU - 0.4); o.stroke(); }
        },
      });
      MX.tube(o, [[70, -34], [82, -36], [92, -30], [96, -24]], 7, '#C89A84');
      // the fatty veil of the greater omentum hanging over the lower coils
      o.save(); MX.path(o, [[16, -4], [40, -8], [70, -6], [90, 0], [88, 12], [60, 18], [24, 20], [12, 10]]); o.clip();
      for (let k = 0; k < 170; k++) { const x = 10 + R() * 84, y = -10 + R() * 32; o.fillStyle = `rgba(250,236,190,${0.3 + R() * 0.3})`; o.beginPath(); o.ellipse(x, y, 1 + R() * 2.2, 0.8 + R() * 1.4, R() * 3, 0, TAU); o.fill(); }
      for (let k = 0; k < 18; k++) { const x = 14 + R() * 76; MX.line(o, MX.wavy([x, -8], [x + (R() - 0.5) * 12, 20], 1.4, 3, k), 'rgba(250,236,190,0.55)', 0.9); }
      o.restore();
      // the kidney high under the loin, lobed like a bunch of grapes and wrapped in fat
      COWP.organ(o, MX.blob(38, -47, 13, 7, { rot: -0.1, seed: 95 }), '#E6D29A', { sh: 2, hi: 0.2 });
      const kid = MX.blob(38, -47, 10, 5.4, { rot: -0.1, seed: 96 });
      COWP.organ(o, kid, '#7A3028', {
        sh: 1, paint: () => { for (let k = 0; k < 9; k++) { const x = 30 + k * 2.1; MX.line(o, [[x, -52], [x + 0.6, -42]], 'rgba(40,10,8,0.5)', 0.5); } },
      });
      // the liver: the biggest gland, a deep red-brown lobe lying on the diaphragm; its gall bladder hangs below
      const LV = [[-2, -54], [16, -52], [24, -44], [22, -30], [16, -18], [6, -10], [-8, -6], [-18, -10], [-12, -24], [-4, -38]];
      COWP.organ(o, LV, '#6E2A22', { hi: 0.36 });
      COWP.organ(o, MX.blob(14, -9, 4, 6, { rot: 0.3, seed: 97 }), '#6E8A48', { sh: 2, hi: 0.4 });
      // the duodenum leaving the abomasum, climbing to the liver and running back along the flank
      MX.tube(o, [[34, 10], [36, -6], [28, -22], [34, -34], [50, -34], [66, -38]], 5, '#D8A28E');
      // the omasum: a firm round ball, and the abomasum lying along the floor from it to the pylorus
      COWP.organ(o, MX.blob(-14, 5, 13.5, 12.5, { wob: 0.04, seed: 98 }), '#B89080', {
        paint: (cx, cy) => { for (let k = -4; k <= 4; k++) { o.strokeStyle = 'rgba(120,80,60,0.18)'; o.lineWidth = 0.6; o.beginPath(); o.ellipse(cx + k * 2.6, cy, 1.6, 11, 0, 0, TAU); o.stroke(); } },
      });
      const AB = [[-26, 12], [-12, 12], [6, 11], [22, 8], [32, 6], [38, 10], [34, 16], [18, 19], [0, 20], [-18, 19], [-30, 17]];
      COWP.organ(o, AB, '#CC7C6C', {
        paint: () => { for (let k = 0; k < 6; k++) COWP.vessels(o, R, -24 + k * 10, 19, -Math.PI / 2 + (R() - 0.5), 7, 0.7, 'rgba(160,40,40,0.5)'); },
      });
      for (let k = 0; k < 11; k++) { const x = -60 + k * 8.6; COWP.ribEnd(o, x + 2, -52, 0.1); if (x < -12) COWP.ribEnd(o, x - 14, 12 - (x + 60) * 0.1, -0.3); }
      o.setLineDash([2.2, 2.2]); MX.line(o, [[34, -54], [18, -30], [-4, -6], [-26, 12]], 'rgba(255,245,225,0.6)', 0.8, false); o.setLineDash([]);
    });
    COWA.lx = -0.35;
    o.restore();
    MX.vignette(o, 0.1); MX.grain(o, 0.025);
    MX.scaleBar(o, 52, '50 cm');
  },
});

// ---------------------------------------------------------------- the four chambers opened on a dissecting tray
// spots: COWA.lining (papillae, honeycomb crests, reticular groove, omasal leaves, abomasal folds)
const LINING = {
  panels: [[-134, -128, 128, 122], [6, -128, 128, 122], [-134, 4, 128, 122], [6, 4, 128, 122]],
  shape(i) { const [x, y, w, h] = this.panels[i]; return MX.blob(x + w / 2, y + h / 2, w / 2 - 2, h / 2 - 2, { wob: 0.05, seed: 200 + i, n: 36 }).map(([px, py]) => [U.clamp(px, x + 1, x + w - 1), U.clamp(py, y + 1, y + h - 1)]); },
};
plate('cowlining', {
  still(o) {
    const R = MX.rng(7272);
    // the steel tray
    o.fillStyle = MX.lin(o, -140, -140, 140, 140, [[0, '#B8C0C6'], [0.5, '#9AA4AC'], [1, '#7E8890']]); o.fillRect(-141, -141, 282, 282);
    for (let k = 0; k < 40; k++) { const y = -140 + R() * 280; MX.line(o, [[-141, y], [141, y + (R() - 0.5) * 4]], 'rgba(255,255,255,0.05)', 0.6); }
    const wall = (i, paint) => {
      const P = LINING.shape(i), [cx, cy] = MX.centroid(P);
      o.save(); o.shadowColor = 'rgba(20,20,30,0.5)'; o.shadowBlur = 5 * MX.s; o.shadowOffsetY = 2 * MX.s; MX.fill(o, P, '#8A5040'); o.restore();
      o.save(); MX.path(o, MX.inset(P, 3.2)); o.clip(); paint(cx, cy);
      // wet sheen over the whole lining
      o.fillStyle = MX.rad(o, cx - 30, cy - 34, 4, 90, [[0, 'rgba(255,255,255,0.16)'], [1, 'rgba(255,255,255,0)']]); o.fillRect(cx - 70, cy - 70, 140, 140);
      o.restore();
      // the cut wall: pale outer skin (serosa), red muscle, then the lining
      MX.line(o, P, '#E8D8C8', 2.2, true); MX.line(o, MX.inset(P, 1.6), '#A0443A', 2, true); MX.line(o, MX.inset(P, 3), 'rgba(40,14,8,0.65)', 0.8, true);
    };
    const hexes = (x0, y0, w, h, s, fn) => { for (let q = -1; q * s * 1.5 < w + s; q++) for (let r = -1; r * s * 1.732 < h + s; r++) fn(x0 + q * s * 1.5, y0 + r * s * 1.732 + (q % 2 ? s * 0.866 : 0)); };
    const hexPath = (x, y, s) => { o.beginPath(); for (let k = 0; k <= 6; k++) { const a = k / 6 * TAU; k ? o.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s) : o.moveTo(x + s, y); } };

    // 1 rumen: a shaggy carpet of tongue-shaped papillae, brown-green from the fermenting feed
    wall(0, (cx, cy) => {
      o.fillStyle = '#4A3C24'; o.fillRect(cx - 70, cy - 70, 140, 140);
      const pts = MX.scatter(R, 2600, 2.1, [cx - 66, cy - 64, 132, 128]);
      pts.sort((a, b) => a[1] - b[1]);
      for (const [x, y] of pts) {
        const l = 3 + R() * 3.4 + (y - cy) * 0.012, w = 0.9 + R() * 0.7, a = 1.25 + (R() - 0.5) * 0.9, col = R() < 0.3 ? '#8A7244' : R() < 0.6 ? '#6E5A34' : '#5A4A2C';
        o.save(); o.translate(x, y); o.rotate(a);
        o.fillStyle = 'rgba(20,14,6,0.45)'; o.beginPath(); o.ellipse(l * 0.5 + 0.5, 0.5, l * 0.55, w, 0, 0, TAU); o.fill();
        o.fillStyle = MX.lin(o, 0, -w, 0, w, [[0, U.shade(col, 0.35)], [0.5, col], [1, U.shade(col, -0.35)]]); o.beginPath(); o.ellipse(l * 0.5, 0, l * 0.55, w, 0, 0, TAU); o.fill();
        o.restore();
      }
      for (let k = 0; k < 16; k++) { const x = cx - 60 + R() * 120, y = cy - 58 + R() * 116, a = R() * TAU; MX.line(o, MX.wavy([x, y], [x + Math.cos(a) * 18, y + Math.sin(a) * 18], 1.4, 2, k), 'rgba(170,180,90,0.75)', 0.9); }
    });
    // 2 reticulum: the honeycomb, its crests edged with little points; along one side the two lips of the reticular
    // groove run down to the opening into the omasum
    wall(1, (cx, cy) => {
      o.fillStyle = '#5A4630'; o.fillRect(cx - 70, cy - 70, 140, 140);
      const s = 7.4;
      hexes(cx - 70, cy - 70, 140, 140, s, (x, y) => {
        o.fillStyle = MX.rad(o, x - 1, y - 1.5, 0.5, s, [[0, '#6E5638'], [1, '#3E2E1C']]); hexPath(x, y, s * 0.9); o.fill();
        for (let k = 0; k < 5; k++) { o.fillStyle = 'rgba(190,160,110,0.5)'; o.beginPath(); o.arc(x + (R() - 0.5) * s, y + (R() - 0.5) * s, 0.45, 0, TAU); o.fill(); }
        MX.line(o, [[x - s * 0.35, y + s * 0.1], [x + s * 0.35, y - s * 0.1]], 'rgba(160,130,90,0.4)', 0.6);
      });
      hexes(cx - 70, cy - 70, 140, 140, s, (x, y) => {
        hexPath(x + 0.5, y + 0.7, s); o.strokeStyle = 'rgba(20,12,6,0.6)'; o.lineWidth = 1.9; o.stroke();
        hexPath(x, y, s); o.strokeStyle = '#C8AE84'; o.lineWidth = 1.3; o.stroke();
        hexPath(x - 0.3, y - 0.4, s); o.strokeStyle = 'rgba(250,236,200,0.45)'; o.lineWidth = 0.4; o.stroke();
        for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + 0.5, px = x + Math.cos(a) * s * 0.93, py = y + Math.sin(a) * s * 0.93; o.fillStyle = '#E0CCA0'; o.beginPath(); o.arc(px, py, 0.5, 0, TAU); o.fill(); }
      });
      // the groove's lips: two smooth rolled folds with a channel between, ending at the reticulo-omasal opening
      const gx = cx + 36, lip = (dx) => [[gx + dx + 6, cy - 66], [gx + dx + 4, cy - 30], [gx + dx - 2, cy + 6], [gx + dx - 10, cy + 34]];
      MX.line(o, lip(0).map(([x, y]) => [x + 1, y]), '#2A1A10', 6);
      for (const dx of [-5, 5]) { MX.tube(o, lip(dx), 5.4, '#D8BCA0', { hi: '#FFF4E4' }); }
      o.fillStyle = MX.rad(o, gx - 12, cy + 40, 1, 9, [[0, '#120804'], [0.7, '#2A1810'], [1, '#6A4A34']]); o.beginPath(); o.ellipse(gx - 12, cy + 40, 8, 6, 0.3, 0, TAU); o.fill();
      for (let k = 0; k < 10; k++) { const a = k / 10 * TAU, px = gx - 12 + Math.cos(a) * 8.6, py = cy + 40 + Math.sin(a) * 6.4; MX.line(o, [[px, py], [px - Math.cos(a) * 3, py - Math.sin(a) * 2.4]], '#E8D4B0', 1.1); }
    });
    // 3 omasum: a sheaf of leaves of four sizes, their faces rough with small horny points, feed pressed between
    wall(2, (cx, cy) => {
      o.fillStyle = '#3A2A1C'; o.fillRect(cx - 70, cy - 70, 140, 140);
      const n = 26;
      for (let k = 0; k < n; k++) {
        const t = k / (n - 1), a = -2.5 + t * 1.9, big = k % 4 === 0 ? 1 : k % 2 === 0 ? 0.78 : k % 4 === 1 ? 0.6 : 0.5, L = 108 * big;
        const bx = cx + (t - 0.5) * 24, by = cy + 62, tip = [bx + Math.cos(a) * L, by + Math.sin(a) * L], mid = [bx + Math.cos(a) * L * 0.5 + 5, by + Math.sin(a) * L * 0.5];
        const nx = -Math.sin(a), ny = Math.cos(a), w = 3.2;
        const leaf = [[bx - nx * w, by - ny * w], [mid[0] - nx * w, mid[1] - ny * w], [tip[0], tip[1]], [mid[0] + nx * w * 0.6, mid[1] + ny * w * 0.6], [bx + nx * w * 0.6, by + ny * w * 0.6]];
        o.save(); o.shadowColor = 'rgba(10,6,2,0.6)'; o.shadowBlur = 3 * MX.s; o.shadowOffsetX = 1 * MX.s; MX.fill(o, leaf, '#8A6A4C'); o.restore();
        MX.fill(o, leaf, MX.lin(o, bx - nx * w, by - ny * w, bx + nx * w, by + ny * w, [[0, '#C8A884'], [0.5, '#9A7A58'], [1, '#6A4E36']]));
        for (let q = 0; q < 14 * big; q++) { const u = 0.1 + R() * 0.85, px = bx + (tip[0] - bx) * u + nx * (R() - 0.5) * w, py = by + (tip[1] - by) * u + ny * (R() - 0.5) * w; o.fillStyle = 'rgba(240,220,180,0.55)'; o.beginPath(); o.arc(px, py, 0.4, 0, TAU); o.fill(); }
        if (R() < 0.35) { const u = 0.3 + R() * 0.5; o.fillStyle = 'rgba(60,64,30,0.7)'; o.beginPath(); o.ellipse(bx + (tip[0] - bx) * u + nx * 3.5, by + (tip[1] - by) * u + ny * 3.5, 4, 1.6, a, 0, TAU); o.fill(); }
      }
    });
    // 4 abomasum: soft red-pink glandular lining thrown into great spiral folds, glistening with mucus
    wall(3, (cx, cy) => {
      o.fillStyle = MX.lin(o, cx - 60, cy - 60, cx + 60, cy + 60, [[0, '#C0645A'], [0.7, '#D08878'], [1, '#E0B0A0']]); o.fillRect(cx - 70, cy - 70, 140, 140);
      for (let k = 0; k < 900; k++) { const x = cx - 66 + R() * 132, y = cy - 66 + R() * 132; o.fillStyle = 'rgba(255,220,210,0.18)'; o.beginPath(); o.arc(x, y, 0.5 + R() * 0.6, 0, TAU); o.fill(); }
      for (let k = 0; k < 7; k++) {
        const y0 = cy - 64 + k * 19, pts = [[cx - 72, y0 - 10], [cx - 36, y0 - 2], [cx, y0 + 6 + Math.sin(k) * 4], [cx + 36, y0 + 4], [cx + 72, y0 + 12]];
        MX.line(o, pts.map(([x, y]) => [x + 1.4, y + 3]), 'rgba(80,20,16,0.45)', 8);
        MX.line(o, pts, '#B85A50', 7.2);
        MX.line(o, pts.map(([x, y]) => [x, y - 1.6]), '#E0948A', 3.6);
        MX.line(o, pts.map(([x, y]) => [x - 1, y - 2.6]), 'rgba(255,240,236,0.55)', 1);
      }
      for (let k = 0; k < 10; k++) { const x = cx - 60 + R() * 120, y = cy - 60 + R() * 120; MX.line(o, MX.wavy([x, y], [x + 10 + R() * 14, y + 4], 1.2, 2, k + 40), 'rgba(250,250,250,0.4)', 0.9); }
      // the pylorus, the exit to the intestine, with its muscular cushion
      COWP.organ(o, MX.blob(cx + 44, cy + 44, 12, 9, { seed: 211 }), '#D8A090', { sh: 3 });
      o.fillStyle = MX.rad(o, cx + 46, cy + 46, 0.5, 5, [[0, '#200806'], [1, '#6A2A22']]); o.beginPath(); o.ellipse(cx + 46, cy + 46, 4.2, 3, 0.4, 0, TAU); o.fill();
    });
    // the way food goes: 1 → 2 → 3 → 4, and from 2 back up to be chewed again
    const arrow = (x0, y0, x1, y1) => {
      const a = Math.atan2(y1 - y0, x1 - x0);
      for (const [c, w] of [['#1B1A17', 4.2], ['#FFFFFF', 2.2]]) {
        MX.line(o, [[x0, y0], [x1 - Math.cos(a) * 3, y1 - Math.sin(a) * 3]], c, w);
        o.fillStyle = c; o.beginPath(); o.moveTo(x1 + Math.cos(a) * (w - 2), y1 + Math.sin(a) * (w - 2)); o.lineTo(x1 - 7 * Math.cos(a - 0.5), y1 - 7 * Math.sin(a - 0.5)); o.lineTo(x1 - 7 * Math.cos(a + 0.5), y1 - 7 * Math.sin(a + 0.5)); o.closePath(); o.fill();
      }
    };
    arrow(-14, -70, 14, -70); arrow(20, -10, -20, 16); arrow(-14, 64, 14, 64);
    [[-128, -122], [12, -122], [-128, 10], [12, 10]].forEach(([x, y], i) => {
      o.fillStyle = '#F4EEDD'; o.beginPath(); o.arc(x + 6, y + 6, 6.4, 0, TAU); o.fill(); o.strokeStyle = '#1B1A17'; o.lineWidth = 1; o.stroke();
      MX.text(o, String(i + 1), x + 6, y + 8.6, 8.5, '#1B1A17');
    });
    MX.grain(o, 0.025);
    MX.scaleBar(o, 25, '5 cm');
  },
});

// ---------------------------------------------------------------- painted X-ray layers, kept as bitmaps
// A painting of a whole animal is too slow to repaint every frame, so it is kept as a bitmap at three widths. The
// specimen table zooms a long way; a bigger bitmap is painted only after the camera has stopped, and until then the
// best one already made stands in. (Painting it mid-zoom froze the zoom halfway, which is the bug this avoids.)
// P = { bb: [x, y, w, h] in painting units, K: local units per painting unit, ox, oy: where painting 0,0 lands, paint(o) }
const XCACHE = {
  _m: new Map(), _todo: new Set(), SIZES: [420, 1000, 2200],
  draw(x, id, key, P) {
    const m = x.getTransform(), need = P.bb[2] * P.K * Math.hypot(m.a, m.b), last = this.SIZES.length - 1;
    const want = this.SIZES.find(w => w >= need) || this.SIZES[last], base = id + '|' + key + '|';
    let c = this._m.get(base + want);
    if (!c) {
      const have = this.SIZES.slice().reverse().map(w => this._m.get(base + w)).find(Boolean);
      if (have) { c = have; this._later(base + want, () => this._make(base + want, want, P)); }
      else {
        const first = Math.min(want, this.SIZES[1]);
        c = this._make(base + first, first, P);
        if (first < want) this._later(base + want, () => this._make(base + want, want, P));
      }
    }
    const [bx, by, bw, bh] = P.bb;
    x.save(); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(c, P.ox + bx * P.K, P.oy + by * P.K, bw * P.K, bh * P.K); x.restore();
  },
  _make(k, W, P) {
    const [bx, by, bw, bh] = P.bb, s = W / bw, c = U.canvas(W, Math.ceil(bh * s)), o = c.getContext('2d');
    o.setTransform(s, 0, 0, s, -bx * s, -by * s); MX.s = s;
    try { P.paint(o); } catch (e) { if (typeof reportError === 'function') reportError(e); else console.error(e); }
    o.filter = 'none';
    this._m.set(k, c);
    if (this._m.size > 16) this._m.delete(this._m.keys().next().value);
    return c;
  },
  _later(k, fn) {
    if (this._todo.has(k)) return;
    this._todo.add(k);
    const go = () => {
      if (typeof STUDY !== 'undefined' && STUDY._tw && STUDY._tw.length) { setTimeout(go, 160); return; }
      this._todo.delete(k); if (!this._m.has(k)) fn();
    };
    setTimeout(go, 160);
  },
};

// ---------------------------------------------------------------- ×1 digestive system: the see-through cow
// The first layer of the cow, and what the brass lens shows over Sarıkız in the valley. The whole animal in her
// hide, the chest and belly fading into a see-through view of the digestive tract: the oesophagus down the neck and
// through the chest to the stomach, the rumen opened to show what floats in it (gas, a mat of fibre, fluid; or a
// stable froth when she is bloated), the honeycombed reticulum against the diaphragm, the round omasum, the
// abomasum on the belly floor, the coiled small intestine, the spiral colon and the rectum. Lungs, heart and ribs
// are there for bearings. It is drawn in cow-local units (feet at y 0, as the sprite stands), so COWX.map turns the
// painting's units into the sprite's, and the painting is kept as a bitmap at three sizes.
const COWX = {
  K: 0.5,
  map(x, y) { return [this.K * (x + 15) - 9, this.K * (y - 88)]; },
  // the painted area in painting units
  BB: [-146, -104, 266, 200],
  RUMEN: [[0, -46], [20, -51], [44, -53], [64, -51], [78, -44], [83, -32], [79, -20], [70, -10], [58, -4], [44, 0], [28, 4], [14, 6], [4, 2], [-2, -8], [-4, -22], [-2, -36]],
  rumen(bloat) { return bloat ? this.RUMEN.map(([x, y]) => [38 + (x - 38) * 1.07, y < -10 ? y * 1.1 - 3 : y + 1]) : this.RUMEN; },
  ABOM: [[2, 8], [18, 9], [34, 9], [48, 10], [56, 13], [52, 17], [36, 18], [18, 19], [4, 19], [-5, 15]],
  THROAT: [[-124, -62], [-108, -67], [-92, -63], [-78, -51], [-66, -34], [-62, -18], [-70, -4], [-82, -6], [-90, -22], [-100, -40], [-112, -46], [-124, -50]],
  OESO: [[-126, -55], [-114, -57], [-102, -55], [-92, -48], [-84, -38], [-76, -29], [-64, -26], [-48, -25], [-32, -23], [-18, -19], [-6, -14]],
  spots(st) {
    const b = st.bloat > 0.3, P = { cow_esophagus: [-100, -54], cow_rumen: [40, b ? -34 : -28], cow_reticulum: [-24, 0], cow_omasum: [-1, 5], cow_abomasum: [30, 14], cow_intestine: [72, 2] };
    if (st.nail) P.hardware = [-41, 3];
    if (st.magnet) P.magnet_bolus = [-24, 13];
    return Object.entries(P).map(([id, [x, y]]) => [id, ...this.map(x, y).map(v => Math.round(v * 10) / 10)]);
  },

  // ---------------- the painting, in painting units (head to the left, feet at y 86)
  paint(o, st) {
    const R = MX.rng(4242), C = COWA, bloat = st.bloat > 0.3;
    COWA.lx = -0.35;
    // a soft shadow on the ground
    o.fillStyle = MX.rad(o, -10, 88, 4, 120, [[0, 'rgba(40,30,20,0.3)'], [1, 'rgba(40,30,20,0)']]); o.beginPath(); o.ellipse(-10, 88, 116, 8, 0, 0, TAU); o.fill();
    cowFigure(o, R, null, { bloat, ghost: o => MX.layer(o, x => this.inside(x, R, bloat, st), 0, 1) });
  },
  // everything under the skin, on its own sheet, then faded out towards the edges of the body
  inside(o, R, bloat, st) {
    const C = COWA, cav = C.win, thr = this.THROAT;
    // the body cavity: dark flesh with the ribs showing as pale bands
    for (const poly of [cav, thr]) MX.fill(o, poly, MX.lin(o, 0, -64, 0, 24, [[0, '#6E3026'], [1, '#43180F']]));
    for (let k = 0; k < 13; k++) { const x = -64 + k * 8; MX.line(o, [[x + 7, -56], [x + 2, -30], [x - 5, -6], [x - 9, 14]], 'rgba(230,200,180,0.14)', 3.6); }
    // windpipe (ringed) under the oesophagus in the neck, dropping into the chest
    const tr = [[-122, -47], [-110, -48], [-100, -45], [-91, -37], [-83, -27], [-74, -19], [-64, -16]];
    MX.tube(o, tr, 5.6, '#E2D2C0', { hi: '#FFFFFF' });
    for (let k = 0; k < 16; k++) { const t = k / 15, i = Math.min(tr.length - 2, Math.floor(t * (tr.length - 1))), f = t * (tr.length - 1) - i, x = tr[i][0] + (tr[i + 1][0] - tr[i][0]) * f, y = tr[i][1] + (tr[i + 1][1] - tr[i][1]) * f; MX.line(o, [[x - 1.6, y - 2.2], [x + 1.8, y + 2]], 'rgba(150,120,100,0.6)', 0.6); }
    // lungs, pink and lobulated, with the heart low in the chest between them
    const Lg = C.lung(bloat);
    COWP.organ(o, Lg, '#E4A29C', {
      hi: 0.2, paint: () => {
        const bb = U.bbox(Lg), cells = MX.voronoi(MX.scatter(R, 80, 5.5, bb), [[bb[0], bb[1]], [bb[0] + bb[2], bb[1]], [bb[0] + bb[2], bb[1] + bb[3]], [bb[0], bb[1] + bb[3]]]);
        for (const c of cells) { if (!c || c.length < 3) continue; MX.fill(o, c, U.rgba(R() < 0.5 ? '#C87478' : '#F2B8B0', 0.3)); MX.line(o, c, 'rgba(150,80,90,0.4)', 0.4, true); }
      },
    });
    COWP.organ(o, MX.blob(C.heart.c[0], C.heart.c[1], C.heart.rx + 2, C.heart.ry + 2, { rot: C.heart.rot, wob: 0.05, seed: 52 }), '#D8BCA8', { hi: 0.18, sh: 3 });
    COWP.organ(o, MX.blob(C.heart.c[0], C.heart.c[1], C.heart.rx, C.heart.ry, { rot: C.heart.rot, wob: 0.07, seed: 51 }), '#8E2A24', {
      paint: (cx, cy) => { MX.line(o, [[cx - 11, cy - 7], [cx - 2, cy - 5], [cx + 9, cy - 9]], 'rgba(234,212,138,0.75)', 1.8); MX.line(o, [[cx - 2, cy - 5], [cx + 1, cy + 6], [cx + 4, cy + 12]], 'rgba(150,40,34,0.6)', 0.9); },
    });
    MX.tube(o, [[-56, -15], [-58, -26], [-52, -34], [-40, -38], [-20, -40], [4, -42]], 4.4, '#B8342C', { hiA: 0.4 });
    // the diaphragm, edge-on: red muscle round a silvery tendon; a bloated rumen shoves it into the chest
    const D = C.diaphragm(bloat);
    o.save(); MX.blur(o, 0.8); MX.line(o, D, 'rgba(150,40,34,0.55)', 5.5); o.restore(); MX.line(o, D.slice(1, 5), 'rgba(226,230,236,0.45)', 2); MX.line(o, D, 'rgba(60,14,10,0.35)', 0.6);
    // behind the rumen on the right: the coiled small intestine under its fatty veil, the spiral colon, the rectum
    const gutBox = MX.blob(74, 3, 24, 12, { wob: 0.08, seed: 91, rot: -0.12 });
    COWP.organ(o, gutBox, '#E8D2A8', { hi: 0.15, sh: 3, gloss: false });
    o.save(); MX.path(o, gutBox); o.clip();
    for (let k = 0; k < 13; k++) {
      const x = 50 + R() * 44, y = -10 + R() * 22, a = R() * TAU, l = 9 + R() * 8, pts = [];
      for (let q = 0; q <= 6; q++) { const t = q / 6, aa = a + Math.sin(t * Math.PI * 2 + k) * 1.4; pts.push([x + Math.cos(aa) * l * (t - 0.5), y + Math.sin(aa) * l * (t - 0.5) + Math.sin(t * 7 + k) * 2]); }
      MX.tube(o, pts, 4, R() < 0.5 ? '#D89888' : '#E0A898', { hiA: 0.45 });
    }
    MX.fill(o, gutBox, 'rgba(240,226,190,0.22)');
    o.restore();
    // the spiral colon: a flat coil of gut, then the rectum running back to the tail
    const sc = [80, -34];
    for (let r = 10; r > 2; r -= 2.6) { const pts = []; for (let a = 0; a <= TAU * 1.02; a += 0.3) pts.push([sc[0] + Math.cos(a) * r * 1.25, sc[1] + Math.sin(a) * r * 0.8]); MX.tube(o, pts, 3.2, '#C49A84', { hiA: 0.4 }); }
    MX.tube(o, [[86, -40], [94, -44], [101, -46], [106, -46]], 4.4, '#B88878');
    // the rumen, opened to show what floats in it
    const RU = this.rumen(bloat), rb = U.bbox(RU);
    o.save(); o.shadowColor = 'rgba(30,8,4,0.55)'; o.shadowBlur = 5 * MX.s; o.shadowOffsetY = 2 * MX.s; MX.fill(o, RU, '#7A6A3A'); o.restore();
    o.save(); MX.path(o, RU); o.clip();
    if (bloat) {
      // a stable froth right through: gas trapped in countless small bubbles, no gas cap to burp up
      o.fillStyle = MX.lin(o, 0, rb[1], 0, rb[1] + rb[3], [[0, '#C8CC9A'], [0.6, '#A8B070'], [1, '#86904E']]); o.fillRect(rb[0], rb[1], rb[2], rb[3]);
      const bub = MX.scatter(R, 900, 1.2, rb, (x, y) => U.inPoly(x, y, RU));
      for (const [x, y] of bub) {
        const r = 0.7 + R() * R() * 3.2;
        o.fillStyle = 'rgba(250,248,232,0.5)'; o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
        o.strokeStyle = 'rgba(96,104,54,0.55)'; o.lineWidth = 0.28; o.stroke();
        o.fillStyle = 'rgba(255,255,255,0.8)'; o.beginPath(); o.arc(x - r * 0.35, y - r * 0.4, r * 0.28, 0, TAU); o.fill();
      }
      // a few flecks of clover leaf caught in the froth
      for (let k = 0; k < 40; k++) { const x = rb[0] + R() * rb[2], y = rb[1] + R() * rb[3]; if (!U.inPoly(x, y, RU)) continue; MX.fill(o, MX.blob(x, y, 1.6, 0.9, { rot: R() * 3, seed: k, n: 10 }), 'rgba(90,120,50,0.75)'); }
    } else {
      // three layers: a cap of gas, a floating mat of chewed fibre, and fluid below
      const gasY = rb[1] + rb[3] * 0.22, matY = rb[1] + rb[3] * 0.62;
      o.fillStyle = MX.lin(o, 0, rb[1], 0, gasY, [[0, '#E4E8E4'], [1, '#CCD4D0']]); o.fillRect(rb[0], rb[1], rb[2], gasY - rb[1] + 1);
      o.fillStyle = MX.lin(o, 0, gasY, 0, matY, [[0, '#B8A058'], [1, '#8E7A3C']]); o.fillRect(rb[0], gasY, rb[2], matY - gasY + 1);
      for (let k = 0; k < 520; k++) {
        const x = rb[0] + R() * rb[2], y = gasY + 1 + R() * (matY - gasY - 1), a = (R() - 0.5) * 1.4, l = 2 + R() * 5;
        o.strokeStyle = U.rgba(['#D8C680', '#7A6A30', '#A89048', '#6E8A3A', '#E4D494'][k % 5], 0.8); o.lineWidth = 0.35 + R() * 0.45;
        o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); o.stroke();
      }
      MX.line(o, MX.wavy([rb[0], gasY], [rb[0] + rb[2], gasY], 1.2, 9, 3), 'rgba(90,70,30,0.6)', 0.8);
      o.fillStyle = MX.lin(o, 0, matY, 0, rb[1] + rb[3], [[0, '#7E7A3A'], [1, '#5E5A28']]); o.fillRect(rb[0], matY, rb[2], rb[3]);
      MX.line(o, MX.wavy([rb[0], matY], [rb[0] + rb[2], matY], 1, 11, 5), 'rgba(220,210,150,0.55)', 0.7);
      for (let k = 0; k < 160; k++) { const x = rb[0] + R() * rb[2], y = matY + 1.5 + R() * (rb[1] + rb[3] - matY); o.fillStyle = U.rgba(R() < 0.5 ? '#B8A860' : '#4A4620', 0.6); o.beginPath(); o.ellipse(x, y, 0.4 + R() * 0.9, 0.3 + R() * 0.4, R() * 3, 0, TAU); o.fill(); }
      // a few rising gas bubbles in the fluid
      for (let k = 0; k < 24; k++) { const x = rb[0] + R() * rb[2], y = matY + 2 + R() * (rb[1] + rb[3] - matY - 4); o.strokeStyle = 'rgba(230,230,200,0.55)'; o.lineWidth = 0.3; o.beginPath(); o.arc(x, y, 0.5 + R() * 0.9, 0, TAU); o.stroke(); }
    }
    // the lining just inside the cut wall: a fringe of papillae
    o.strokeStyle = 'rgba(90,60,40,0.55)'; o.lineWidth = 0.5;
    const inner = MX.inset(RU, 1.8);
    for (let i = 0; i < inner.length; i++) {
      const a = inner[i], b = inner[(i + 1) % inner.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.4));
      for (let q = 0; q < n; q++) { const t = q / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; o.beginPath(); o.moveTo(x, y); o.lineTo(x + (R() - 0.5) * 1.2, y + (R() - 0.5) * 1.2); o.stroke(); }
    }
    o.restore();
    // the cut edge of the rumen wall
    MX.line(o, RU, '#5A2A20', 2.8, true); MX.line(o, RU, '#C89A86', 1.5, true); MX.line(o, MX.inset(RU, 1), 'rgba(40,14,8,0.45)', 0.6, true);
    // the abomasum on the belly floor, its spiral folds faint through the wall
    COWP.organ(o, this.ABOM, '#D48C80', {
      hi: 0.25, sh: 3, paint: () => { for (let k = 0; k < 9; k++) { const x = 2 + k * 6; MX.line(o, [[x, 10], [x + 3, 14], [x + 1, 18]], 'rgba(150,60,50,0.35)', 0.8); } },
    });
    // the omasum, round and firm, its leaves showing as fine arcs
    const OM = MX.blob(-1, 5, 9.5, 9, { wob: 0.04, seed: 33 });
    COWP.organ(o, OM, '#B89478', { hi: 0.28, sh: 3, paint: (cx, cy) => { for (let k = -3; k <= 3; k++) MX.line(o, [[cx - 7, cy + k * 2.4], [cx, cy + k * 2.4 - 1.5], [cx + 7, cy + k * 2.4]], 'rgba(100,70,50,0.45)', 0.55); } });
    // the reticulum against the diaphragm, opened to its honeycomb
    const RT = MX.blob(-26, 6, 12.5, 10.5, { rot: -0.3, wob: 0.05, seed: 81 });
    COWP.organ(o, RT, '#BE9A86', { hi: 0.2, sh: 3, gloss: false });
    o.save(); MX.path(o, MX.inset(RT, 1.6)); o.clip();
    o.fillStyle = '#6A5236'; o.fillRect(-40, -6, 28, 24);
    for (let q = -6; q < 7; q++) for (let r = -4; r < 5; r++) {
      const s = 2.3, x = -26 + q * s * 1.5, y = 6 + r * s * 1.732 + (q % 2 ? s * 0.866 : 0);
      o.fillStyle = 'rgba(60,40,24,0.5)'; o.beginPath(); o.arc(x, y, s * 0.6, 0, TAU); o.fill();
      o.strokeStyle = '#D0B48A'; o.lineWidth = 0.7; o.beginPath();
      for (let k = 0; k <= 6; k++) { const a = k / 6 * TAU; k ? o.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s) : o.moveTo(x + s, y); }
      o.stroke();
    }
    o.restore();
    MX.line(o, RT, '#5A2A20', 2.2, true); MX.line(o, RT, '#C8A08A', 1.1, true);
    if (st.magnet) {
      o.fillStyle = MX.lin(o, 0, 11, 0, 15, [[0, '#9AA0A8'], [0.4, '#E2E6EA'], [1, '#4A5058']]); U.rr(o, -31, 11, 11, 4, 1.8); o.fill();
      o.fillStyle = '#A0322A'; o.fillRect(-31, 11, 2, 4);
      MX.line(o, [[-31, 10.4], [-20, 10]], '#5A5E64', 1.1);
    }
    if (st.nail) {
      // the nail through the front wall of the reticulum, its point in the diaphragm, the tissue round it inflamed
      o.fillStyle = MX.rad(o, -40, 2, 0, 9, [[0, 'rgba(230,70,40,0.75)'], [1, 'rgba(230,70,40,0)']]); o.beginPath(); o.arc(-40, 2, 9, 0, TAU); o.fill();
      MX.line(o, [[-24, 8], [-42, 1.5]], '#2E2E34', 1.8); MX.line(o, [[-24, 7.4], [-41, 1]], '#C8CED6', 0.55);
      o.fillStyle = '#3A3A40'; o.beginPath(); o.ellipse(-23.6, 8.2, 1, 2.6, 0.4, 0, TAU); o.fill();
    }
    // the oesophagus: from the throat, down the neck above the windpipe, through the chest to the stomach
    MX.tube(o, this.OESO, 4.8, '#D88A80', { hi: '#F8C8BC' });
    for (let k = 1; k < this.OESO.length - 1; k += 2) { const [x, y] = this.OESO[k]; MX.line(o, [[x - 1.2, y - 1.8], [x + 1.2, y + 1.8]], 'rgba(140,60,50,0.35)', 0.5); }
    // the ribs over it all, faint as on an X-ray, ending on the costal arch
    for (let k = 0; k < 13; k++) {
      const xt = -60 + k * 7.6, yb = k < 7 ? 14 - k * 0.6 : 12 - (k - 6) * 11, xb = k < 7 ? -66 + k * 6 : -26 + (k - 6) * 9.5;
      MX.line(o, [[xt, -58], [xt + 2 + (xb - xt) * 0.3, (yb - 58) / 2 - 4], [xb, yb]], 'rgba(246,238,220,0.2)', 2.6);
      MX.line(o, [[xt, -58], [xt + 2 + (xb - xt) * 0.3, (yb - 58) / 2 - 4], [xb, yb]], 'rgba(255,255,255,0.12)', 0.8);
    }
    // fade the whole sheet out towards the edge of the body, so the hide closes softly over it
    MX.layer(o, m => { MX.fill(m, MX.inset(cav, 2.5), '#000'); MX.fill(m, thr, '#000'); }, 3.2, 1, 'destination-in');
  },

  // ---------------- drawn from a cached bitmap in cow-local units (see XCACHE)
  draw(x, st) {
    const s = { bloat: st.bloat > 0.3 ? 1 : 0, nail: !!st.nail, magnet: !!st.magnet }, K = this.K;
    XCACHE.draw(x, 'cow', s.bloat + (s.nail ? 2 : 0) + (s.magnet ? 4 : 0), { bb: this.BB, K, ox: 15 * K - 9, oy: -88 * K, paint: o => this.paint(o, s) });
  },
};
