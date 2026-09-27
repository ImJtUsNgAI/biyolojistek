'use strict';
// Grafting plates for the last Amasya apple tree: a young grafted tree beside a halved apple (the pips that will
// never give the same apple), a one-year twig cut across (the cambium that makes grafting possible), and the graft
// union a few weeks on, where callus from both sides has bridged the cut and new cambium joins up.
// The two sections are painted as a stained slide looks under the microscope: safranin turns woody (lignified)
// walls red, fast green turns living cellulose walls blue-green.

// ================================================================ ×1 a freshly grafted rootstock, a halved apple
// spots: scion (-67,-64), graft union (-62,18), rootstock (-59,66), pip APPLE.pip
const APPLE = { core: [70, 40], pip: [70, 24] };
plate('orchard', {
  still(o) {
    const R = MX.rng(3131);
    // a weathered potting bench: grey-brown planks with grain, knots and dark gaps
    for (let i = 0; i < 5; i++) {
      const y0 = -141 + i * 57, tone = ['#9A8468', '#A68E70', '#94806A', '#A08A6C', '#988266'][i];
      o.fillStyle = MX.lin(o, 0, y0, 0, y0 + 56, [[0, U.shade(tone, 0.12)], [0.5, tone], [1, U.shade(tone, -0.14)]]); o.fillRect(-141, y0, 282, 56);
      for (let k = 0; k < 16; k++) { const p = MX.strand(R, -150, y0 + 3 + R() * 50, (R() - 0.5) * 0.04, 300, 10, 0.05); MX.line(o, p, `rgba(70,54,36,${(0.12 + R() * 0.16).toFixed(2)})`, 0.4 + R() * 0.8); }
      if (R() < 0.7) { const kx = -120 + R() * 240, ky = y0 + 14 + R() * 28; o.fillStyle = MX.rad(o, kx, ky, 0.5, 6, [[0, 'rgba(60,40,24,0.7)'], [1, 'rgba(60,40,24,0)']]); o.beginPath(); o.ellipse(kx, ky, 9, 4.5, 0, 0, TAU); o.fill(); }
      o.fillStyle = 'rgba(30,22,14,0.75)'; o.fillRect(-141, y0 + 55.5, 282, 1.6);
    }
    // soft shadows under the pot and the apples
    MX.layer(o, x => {
      x.fillStyle = 'rgba(20,14,8,0.55)';
      x.beginPath(); x.ellipse(-50, 136, 54, 12, 0, 0, TAU); x.fill();
      x.beginPath(); x.ellipse(104, -60, 30, 10, 0, 0, TAU); x.fill();
      x.beginPath(); x.ellipse(80, 90, 54, 16, 0, 0, TAU); x.fill();
    }, 4);
    // a grafting knife on the bench
    o.save(); o.translate(112, 118); o.rotate(-0.35);
    o.fillStyle = MX.lin(o, 0, -4, 0, 4, [[0, '#6A4A2E'], [0.5, '#8A6440'], [1, '#4A3220']]); U.rr(o, -8, -4, 38, 8, 3); o.fill();
    o.fillStyle = MX.lin(o, 0, -4, 0, 3, [[0, '#E8ECEE'], [0.6, '#B8C0C4'], [1, '#8A9296']]); o.beginPath(); o.moveTo(-8, -3); o.lineTo(-44, -1); o.quadraticCurveTo(-48, 1, -44, 3); o.lineTo(-8, 3); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = 0.5; o.beginPath(); o.moveTo(-10, -2.2); o.lineTo(-42, -0.6); o.stroke();
    o.restore();
    // the terracotta pot and its soil
    o.fillStyle = MX.lin(o, -104, 0, -16, 0, [[0, '#8A4228'], [0.3, '#C06E46'], [0.55, '#B8643E'], [1, '#7A3A22']]);
    o.beginPath(); o.moveTo(-100, 104); o.lineTo(-20, 104); o.lineTo(-26, 150); o.lineTo(-94, 150); o.closePath(); o.fill();
    MX.dots(o, R, 120, [-100, 104, 80, 40], 0.3, 0.9, 'rgba(90,40,20,0.3)');
    o.fillStyle = MX.lin(o, -106, 0, -14, 0, [[0, '#94482C'], [0.35, '#D07C52'], [0.6, '#C2704A'], [1, '#823E24']]); U.rr(o, -106, 92, 92, 14, 3); o.fill();
    o.strokeStyle = 'rgba(255,220,190,0.45)'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(-104, 93.5); o.lineTo(-16, 93.5); o.stroke();
    o.fillStyle = MX.rad(o, -60, 96, 4, 44, [[0, '#4A3624'], [1, '#2E2016']]); o.beginPath(); o.ellipse(-60, 96, 42, 5.5, 0, 0, TAU); o.fill();
    MX.dots(o, R, 70, [-98, 91, 76, 9], 0.4, 1.3, 'rgba(120,94,64,0.8)', (x, y) => ((x + 60) / 42) ** 2 + ((y - 96) / 5.5) ** 2 < 1);
    MX.dots(o, R, 10, [-98, 91, 76, 9], 0.5, 1, 'rgba(240,240,232,0.9)', (x, y) => ((x + 60) / 42) ** 2 + ((y - 96) / 5.5) ** 2 < 1);
    // a stem painted as a lit cylinder: bark colour, a lighter left side, lenticels and fine lengthwise lines
    const stem = (pts, w0, w1, base, dark, lent) => {
      const xs = pts.map(p => p[0]), cx = (Math.min(...xs) + Math.max(...xs)) / 2;
      MX.taper(o, pts, w0, w1, MX.lin(o, cx - w0 / 2 - 2, 0, cx + w0 / 2 + 2, 0, [[0, dark], [0.28, U.shade(base, 0.22)], [0.55, base], [1, dark]]), 'rgba(30,20,12,0.8)');
      for (let k = 0; k < lent; k++) { const [x, y] = MX.along(pts, 0.05 + R() * 0.9); o.fillStyle = 'rgba(226,210,180,0.8)'; o.beginPath(); o.ellipse(x + (R() - 0.5) * w1 * 0.6, y, 0.9, 0.35, 0, 0, TAU); o.fill(); }
      for (let k = 0; k < 4; k++) { const d = (k - 1.5) * w1 * 0.2; MX.line(o, pts.map(p => [p[0] + d + (R() - 0.5) * 0.4, p[1]]), 'rgba(40,26,16,0.2)', 0.3); }
    };
    stem([[-58, 97], [-59, 64], [-61, 32]], 10.5, 9.5, '#7A6448', '#4A3A28', 18);
    stem([[-62, 30], [-66, -30], [-70, -104]], 6.6, 5, '#8A4E32', '#4E2A1A', 22);
    // buds: pointed, scaly, alternate up the scion, each above a crescent leaf scar
    for (const [x, y, s] of [[-65, -20, 1], [-68, -52, -1], [-70, -84, 1]]) {
      o.fillStyle = 'rgba(210,190,150,0.8)'; o.beginPath(); o.ellipse(x + s * 2.6, y + 4, 2.4, 0.9, 0, 0, Math.PI); o.fill();
      const bud = [[x + s * 2.4, y + 3], [x + s * 6.5, y - 0.5], [x + s * 8.6, y - 7.5], [x + s * 5.2, y - 3.5], [x + s * 3, y - 1]];
      MX.fill(o, bud, MX.lin(o, x, y - 8, x + s * 8, y + 3, [[0, '#6A3E22'], [0.6, '#8A5A36'], [1, '#4A2A16']]));
      for (let k = 0; k < 3; k++) MX.line(o, [[x + s * (3 + k * 1.4), y + 1.5 - k * 2], [x + s * (5 + k * 1.4), y - 1 - k * 2]], 'rgba(40,20,10,0.6)', 0.35);
      o.fillStyle = 'rgba(220,220,210,0.7)'; o.beginPath(); o.arc(x + s * 8.2, y - 7, 0.9, 0, TAU); o.fill();
    }
    // the cut top sealed with red grafting wax
    MX.fill(o, MX.blob(-70, -106, 5.4, 3.6, { seed: 4, wob: 0.15, rot: -0.2 }), MX.lit(o, -70, -106, 5, '#B82A2A', 0.5, 0.4));
    o.fillStyle = 'rgba(255,255,255,0.7)'; o.beginPath(); o.ellipse(-72, -107.4, 1.6, 0.8, -0.3, 0, TAU); o.fill();
    // the union wrapped in translucent grafting tape, turn over turn
    for (let k = 0; k < 6; k++) {
      o.save(); o.translate(-61.5, 8 + k * 5.4); o.rotate(-0.28);
      o.fillStyle = 'rgba(226,234,214,0.82)'; U.rr(o, -9.4, -2.8, 18.8, 5.6, 1.2); o.fill();
      o.fillStyle = 'rgba(255,255,255,0.55)'; o.fillRect(-8, -2.2, 12, 1);
      o.strokeStyle = 'rgba(120,130,110,0.55)'; o.lineWidth = 0.35; U.rr(o, -9.4, -2.8, 18.8, 5.6, 1.2); o.stroke();
      o.restore();
    }
    // an Amasya apple: small and a little flat, red streaks over yellow-green, pale lenticels, a russet stalk cavity
    const apple = (cx, cy, rx, ry) => {
      const body = MX.blob(cx, cy, rx, ry, { wob: 0.035, seed: 8 });
      MX.fill(o, body, MX.lit(o, cx, cy, rx, '#D8C860', 0.3, 0.35));
      o.save(); MX.path(o, body); o.clip();
      o.fillStyle = MX.rad(o, cx + rx * 0.2, cy + ry * 0.1, 2, rx * 1.1, [[0, 'rgba(176,40,34,0.9)'], [0.7, 'rgba(186,52,40,0.6)'], [1, 'rgba(186,52,40,0)']]); o.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
      for (let k = 0; k < 22; k++) { const a = -Math.PI / 2 + (k / 22 - 0.5) * 2.6, w = 0.6 + R() * 1.6; MX.line(o, [[cx, cy - ry * 0.7], [cx + Math.cos(a) * rx * 0.7, cy + ry * 0.1], [cx + Math.cos(a) * rx * 0.9, cy + ry]], `rgba(${150 + R() * 30 | 0},30,28,${(0.4 + R() * 0.4).toFixed(2)})`, w); }
      MX.dots(o, R, 60, [cx - rx, cy - ry, rx * 2, ry * 2], 0.3, 0.7, 'rgba(250,236,180,0.75)');
      o.fillStyle = MX.rad(o, cx - rx * 0.38, cy - ry * 0.42, 1, rx * 0.45, [[0, 'rgba(255,255,255,0.75)'], [1, 'rgba(255,255,255,0)']]); o.beginPath(); o.arc(cx - rx * 0.38, cy - ry * 0.42, rx * 0.45, 0, TAU); o.fill();
      o.restore();
      o.fillStyle = MX.rad(o, cx + 1, cy - ry * 0.72, 0.5, 8, [[0, 'rgba(110,80,40,0.9)'], [1, 'rgba(110,80,40,0)']]); o.beginPath(); o.ellipse(cx + 1, cy - ry * 0.72, 9, 4, 0, 0, TAU); o.fill();
      MX.line(o, [[cx + 1, cy - ry * 0.72], [cx + 2, cy - ry * 0.95], [cx + 5, cy - ry * 1.15]], '#4A3220', 2);
    };
    apple(98, -88, 30, 26);
    // the other apple cut across its middle: striped skin, creamy flesh, a ring of ten vessels, the star of five chambers
    const [cx, cy] = APPLE.core;
    MX.fill(o, MX.blob(cx, cy, 52, 48, { wob: 0.03, seed: 9 }), MX.lin(o, cx - 52, cy - 48, cx + 52, cy + 48, [[0, '#C43A2C'], [0.5, '#D8B050'], [1, '#A82E24']]));
    MX.fill(o, MX.blob(cx, cy, 49.2, 45.2, { wob: 0.03, seed: 9 }), MX.rad(o, cx - 10, cy - 12, 4, 52, [[0, '#FCF6E2'], [0.7, '#F4E8C4'], [1, '#EAD8A6']]));
    o.save(); MX.path(o, MX.blob(cx, cy, 49.2, 45.2, { wob: 0.03, seed: 9 })); o.clip();
    for (let k = 0; k < 140; k++) { const a = R() * TAU, r0 = 30 + R() * 16; MX.line(o, [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * (r0 + 3), cy + Math.sin(a) * (r0 + 3)]], 'rgba(214,196,150,0.25)', 0.5); }
    o.fillStyle = 'rgba(255,255,255,0.3)'; o.beginPath(); o.ellipse(cx - 18, cy - 20, 18, 8, -0.6, 0, TAU); o.fill();
    o.restore();
    o.strokeStyle = 'rgba(190,160,100,0.45)'; o.lineWidth = 0.7; o.beginPath(); o.ellipse(cx, cy, 30, 28, 0, 0, TAU); o.stroke();
    for (let k = 0; k < 10; k++) { const a = k * TAU / 10 + 0.3; o.fillStyle = 'rgba(170,150,90,0.7)'; o.beginPath(); o.arc(cx + Math.cos(a) * 30, cy + Math.sin(a) * 28, 1.2, 0, TAU); o.fill(); }
    o.fillStyle = 'rgba(234,220,176,0.9)'; o.beginPath(); for (let k = 0; k <= 10; k++) { const a = -Math.PI / 2 + k * TAU / 10, r = k % 2 ? 9 : 24; o.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } o.closePath(); o.fill();
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + k * TAU / 5, px = cx + Math.cos(a) * 15, py = cy + Math.sin(a) * 15;
      o.save(); o.translate(px, py); o.rotate(a + Math.PI / 2);
      o.fillStyle = MX.lin(o, -6, 0, 6, 0, [[0, '#E0CC98'], [0.5, '#F2E6C2'], [1, '#D4BE88']]); o.beginPath(); o.ellipse(0, 0, 5.8, 9.8, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(170,140,80,0.8)'; o.lineWidth = 0.6; o.stroke();
      o.fillStyle = MX.lit(o, 0, 0.6, 5, '#4A2614', 0.4, 0.3); o.beginPath(); o.moveTo(0, -6.4); o.quadraticCurveTo(3.8, -1, 3.2, 3.4); o.quadraticCurveTo(0, 6.8, -3.2, 3.4); o.quadraticCurveTo(-3.8, -1, 0, -6.4); o.fill();
      o.fillStyle = 'rgba(255,240,220,0.6)'; o.beginPath(); o.ellipse(-1.2, -1, 0.8, 2.2, 0.2, 0, TAU); o.fill();
      o.restore();
    }
    MX.vignette(o, 0.16); MX.grain(o, 0.04);
    MX.scaleBar(o, 36, '2 cm');
  },
});

// ================================================================ ×40 a one-year apple twig, cut across
// Outside in: cork, green cortex, phloem with fibre caps, the thin cambium, wood in radial rows split by rays, pith.
// spots: bark TWIG.at(-135,114), phloem TWIG.at(-45,86), cambium TWIG.at(45,78.5), wood TWIG.at(135,52), pith (0,0)
const TWIG = { R: 120, CORT: 106, PHL: 90, CAMB: 80, WOOD: 77, PITH: 24, at(deg, r) { const a = deg * Math.PI / 180; return [Math.round(Math.cos(a) * r * 10) / 10, Math.round(Math.sin(a) * r * 10) / 10]; } };
plate('twig', {
  still(o) {
    const R = MX.rng(4141), T = TWIG;
    MX.field(o, '#EEEDF0', '#DCD8E4', 3, 0.012, 40);
    // cells in polar rows: each is the patch between two radii and two angles, with a little wobble
    const rows = (r0, r1, dr, wid, fill, wall, lw) => {
      for (let r = r0; r < r1 - 0.2; r += dr) {
        const n = Math.max(12, Math.round(TAU * (r + dr / 2) / wid)), off = R() * TAU, r2 = Math.min(r1, r + dr);
        o.beginPath();
        for (let i = 0; i < n; i++) {
          const a0 = off + i / n * TAU, a1 = a0 + TAU / n * (0.9 + R() * 0.1), j = () => (R() - 0.5) * 0.3, ra = r2 + j(), rb = r + j();
          o.moveTo(Math.cos(a0) * ra, Math.sin(a0) * ra); o.arc(0, 0, ra, a0, a1); o.arc(0, 0, rb, a1, a0, true); o.closePath();
        }
        o.fillStyle = typeof fill === 'function' ? fill(r) : fill; o.fill();
        o.strokeStyle = wall; o.lineWidth = lw; o.stroke();
      }
    };
    // cork: flattened, brown, suberised cells in neat radial files; the outermost ones torn and ragged
    rows(T.CORT, T.R - 3, 2.6, 4.2, (r) => `rgba(${130 - (r - T.CORT) * 2 | 0},${86 - (r - T.CORT) * 1.5 | 0},${54 - (r - T.CORT) | 0},0.92)`, 'rgba(60,32,18,0.8)', 0.35);
    for (let k = 0; k < 40; k++) { const a = R() * TAU, l = 0.08 + R() * 0.2; o.strokeStyle = 'rgba(90,56,32,0.8)'; o.lineWidth = 1.4; o.beginPath(); o.arc(0, 0, T.R - 1.5 + R() * 2, a, a + l); o.stroke(); }
    // cortex: rounded living cells with fast-green walls, chloroplasts in the outer layers
    for (let r = T.PHL + 1.5; r < T.CORT - 1; r += 4.2) {
      const n = Math.round(TAU * r / 4.6), off = R() * TAU, dots = [];
      o.beginPath();
      for (let i = 0; i < n; i++) {
        const a = off + i / n * TAU + (R() - 0.5) * 0.02, x = Math.cos(a) * (r + 1.8), y = Math.sin(a) * (r + 1.8), rx = 2.3 + R() * 0.3;
        o.moveTo(x + Math.cos(a) * rx, y + Math.sin(a) * rx); o.ellipse(x, y, rx, 1.9, a, 0, TAU);
        if (r > T.PHL + 6) for (let q = 0; q < 3; q++) dots.push([x + (R() - 0.5) * 2.6, y + (R() - 0.5) * 2.2]);
      }
      o.fillStyle = 'rgba(214,226,206,0.95)'; o.fill(); o.strokeStyle = 'rgba(40,120,110,0.75)'; o.lineWidth = 0.35; o.stroke();
      o.fillStyle = 'rgba(70,140,60,0.7)'; o.beginPath(); for (const [x, y] of dots) { o.moveTo(x + 0.35, y); o.arc(x, y, 0.35, 0, TAU); } o.fill();
    }
    // phloem: small cells in radial files, and on its outside the thick red-walled fibre caps
    rows(T.CAMB, T.PHL - 3, 1.7, 2.2, 'rgba(232,236,226,0.95)', 'rgba(40,120,120,0.6)', 0.25);
    for (let k = 0; k < 14; k++) {
      const a = k / 14 * TAU + 0.1;
      const f = []; for (let q = 0; q < 26; q++) { const aa = a + R() * 0.24, rr = T.PHL - 4.4 + R() * 4; f.push([Math.cos(aa) * rr, Math.sin(aa) * rr]); }
      o.fillStyle = '#C23A48'; o.beginPath(); for (const [x, y] of f) { o.moveTo(x + 1.05, y); o.arc(x, y, 1.05, 0, TAU); } o.fill();
      o.fillStyle = 'rgba(250,236,236,0.95)'; o.beginPath(); for (const [x, y] of f) { o.moveTo(x + 0.3, y); o.arc(x, y, 0.3, 0, TAU); } o.fill();
    }
    // cambium: two or three rows of thin, flattened, darkly stained dividing cells
    rows(T.WOOD, T.CAMB, 1, 2.4, 'rgba(160,190,196,0.95)', 'rgba(30,90,100,0.85)', 0.3);
    // wood: red lignified walls, pale lumens in radial rows, larger vessels scattered, uniseriate rays
    o.fillStyle = '#C44A4E'; o.beginPath(); o.arc(0, 0, T.WOOD, 0, TAU); o.arc(0, 0, T.PITH + 1, 0, TAU, true); o.fill();
    o.fillStyle = 'rgba(250,238,236,0.97)'; o.beginPath();
    for (let r = T.PITH + 2.2; r < T.WOOD - 0.8; r += 2.3) {
      const n = Math.round(TAU * r / 2.4), off = (r * 0.37) % 1;
      for (let i = 0; i < n; i++) { const a = (i + off) / n * TAU, x = Math.cos(a) * r, y = Math.sin(a) * r; o.moveTo(x + Math.cos(a) * 0.8, y + Math.sin(a) * 0.8); o.ellipse(x, y, 0.8, 0.72, a, 0, TAU); }
    }
    o.fill();
    for (let k = 0; k < 150; k++) {
      const a = R() * TAU, r = T.PITH + 5 + R() * (T.WOOD - T.PITH - 8), s = 1.3 + (1 - (r - T.PITH) / (T.WOOD - T.PITH)) * 1.4 + R() * 0.5, x = Math.cos(a) * r, y = Math.sin(a) * r;
      o.fillStyle = '#A8323A'; o.beginPath(); o.arc(x, y, s + 0.55, 0, TAU); o.fill();
      o.fillStyle = MX.rad(o, x - s * 0.3, y - s * 0.3, 0.1, s, [[0, '#FFFFFF'], [1, '#F2E4E2']]); o.beginPath(); o.arc(x, y, s, 0, TAU); o.fill();
    }
    for (const [lo, hi, col] of [[T.PITH + 2, T.WOOD, 'rgba(236,214,196,0.97)'], [T.WOOD, T.PHL - 2, 'rgba(214,226,212,0.9)']]) {
      o.fillStyle = col; o.beginPath();
      for (let k = 0; k < 40; k++) { const a = k / 40 * TAU + U.hash(k, 7, 3) * 0.02; for (let r = lo; r < hi; r += 2.6) { const x = Math.cos(a) * r, y = Math.sin(a) * r; o.moveTo(x + Math.cos(a) * 1.2, y + Math.sin(a) * 1.2); o.ellipse(x, y, 1.2, 0.55, a, 0, TAU); } }
      o.fill();
    }
    // pith: big thin-walled cells, some filled with dark tannin
    o.save(); o.beginPath(); o.arc(0, 0, T.PITH + 1, 0, TAU); o.clip();
    o.fillStyle = '#E8ECE4'; o.fillRect(-T.PITH - 2, -T.PITH - 2, T.PITH * 2 + 4, T.PITH * 2 + 4);
    const B = [[-30, -30], [30, -30], [30, 30], [-30, 30]], sites = MX.relax(MX.scatter(R, 30, 7, [-26, -26, 52, 52], (x, y) => x * x + y * y < 27 * 27), B, 2);
    MX.voronoi(sites, B).forEach((c, i) => {
      if (!c || c.length < 3) return;
      const inn = MX.inset(c, 0.5); if (!inn || inn.length < 3) return;
      MX.fill(o, MX.soft(inn, 0.3), i % 7 === 3 ? 'rgba(120,70,40,0.75)' : 'rgba(244,246,240,0.97)');
      MX.line(o, MX.soft(inn, 0.3), 'rgba(40,110,110,0.7)', 0.4, true);
    });
    o.restore();
    o.fillStyle = 'rgba(190,60,70,0.9)'; for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; o.beginPath(); o.arc(Math.cos(a) * (T.PITH + 2), Math.sin(a) * (T.PITH + 2), 1.6, 0, TAU); o.fill(); }
    // the section's edge on the slide, and the microscope's light
    o.strokeStyle = 'rgba(70,40,24,0.6)'; o.lineWidth = 0.8; o.beginPath(); o.arc(0, 0, T.R - 0.6, 0, TAU); o.stroke();
    MX.vignette(o, 0.18, '40,30,50'); MX.grain(o, 0.035);
    MX.scaleBar(o, 36, '0,5 mm');
  },
});

// ================================================================ ×400 the graft union, four weeks on (section along the stem)
// Scion above, rootstock below, a dark line of crushed cells where the two cut faces met. Callus has swelled from
// both sides and filled the gap; in the bridge a new cambium joins up and fresh vessels already run through.
// spots: callus (92,48), dividing cell CALLUS.div, cambium (-72,-86), new wood (-38,82)
const CALLUS = { div: [34, -34], div2: [104, -44] };
plate('callus', {
  still(o) {
    const R = MX.rng(5151);
    MX.field(o, '#EDEDF0', '#DAD6E2', 5, 0.012, 40);
    // long living cells of the scion (top) and rootstock (bottom) in files along the stem, each with a nucleus
    for (const [y0, y1] of [[-141, -12], [12, 141]]) {
      for (let x = -144; x < 141; x += 10 + R() * 2) {
        if (x > -80 && x < -24) continue;
        let y = y0 - R() * 20;
        while (y < y1) {
          const h = 20 + R() * 10, w = 9 + R() * 1.4, top = Math.max(y, y0), bot = Math.min(y + h, y1);
          if (bot - top > 3) {
            o.fillStyle = 'rgba(236,240,232,0.95)'; U.rr(o, x + 0.6, top + 0.5, w - 1.2, bot - top - 1, 2.4); o.fill();
            o.strokeStyle = 'rgba(40,120,110,0.7)'; o.lineWidth = 0.55; o.stroke();
            if (R() < 0.55) { o.fillStyle = 'rgba(110,60,120,0.55)'; o.beginPath(); o.ellipse(x + w / 2 + (R() - 0.5) * 2, (top + bot) / 2 + (R() - 0.5) * 6, 1.8, 2.4, 0, 0, TAU); o.fill(); }
          }
          y += h;
        }
      }
    }
    // the cambium: a continuous band of narrow, darkly stained cells, now joined across the union
    const cam = []; for (let y = -141; y <= 141; y += 6) cam.push([-72 + Math.sin(y * 0.03) * 4 + (Math.abs(y) < 20 ? 6 * Math.cos(y / 20 * Math.PI / 2) : 0), y]);
    MX.line(o, cam, 'rgba(160,196,200,0.95)', 7);
    for (let y = -141; y < 141; y += 3.2) { const [x] = MX.along(cam, (y + 141) / 282); for (const dx of [-2.4, 0, 2.4]) { o.strokeStyle = 'rgba(30,90,100,0.8)'; o.lineWidth = 0.4; o.strokeRect(x + dx - 1.1, y, 2.2, 3); } }
    // new wood: vessels with red spiral thickenings and fibres, running straight through the bridge
    o.fillStyle = 'rgba(214,120,124,0.35)'; o.fillRect(-60, -141, 34, 282);
    for (const vx of [-44, -32]) {
      o.fillStyle = 'rgba(252,246,244,0.97)'; o.fillRect(vx - 4.2, -141, 8.4, 282);
      for (let y = -141; y < 141; y += 3) MX.line(o, [[vx - 4, y], [vx + 4, y + 2.2]], 'rgba(176,50,60,0.85)', 0.9);
      MX.line(o, [[vx - 4.2, -141], [vx - 4.2, 141]], 'rgba(150,40,50,0.9)', 0.9); MX.line(o, [[vx + 4.2, -141], [vx + 4.2, 141]], 'rgba(150,40,50,0.9)', 0.9);
    }
    for (const fx of [-56, -52, -24]) MX.line(o, [[fx, -141], [fx, 141]], 'rgba(170,50,60,0.6)', 1.2);
    // the brown line of crushed dead cells where the two cut faces met, broken where the bridge has formed
    const nec = []; for (let x = 6; x <= 146; x += 7) nec.push([x, (R() - 0.5) * 5]);
    MX.line(o, nec, 'rgba(120,80,40,0.35)', 6); MX.line(o, nec, 'rgba(96,58,26,0.9)', 2.2);
    for (let k = 0; k < 30; k++) { const [x, y] = MX.along(nec, R()); o.fillStyle = 'rgba(80,46,20,0.8)'; o.beginPath(); o.ellipse(x, y + (R() - 0.5) * 3, 1.6, 0.7, (R() - 0.5) * 0.6, 0, TAU); o.fill(); }
    // callus: big, round, thin-walled cells piled across the gap, each with a big nucleus
    const box = [[0, -60], [141, -60], [141, 80], [0, 80]];
    const cells = MX.voronoi(MX.relax(MX.scatter(R, 42, 16, [0, -60, 141, 140]), box, 2), box);
    for (const c of cells) {
      if (!c || c.length < 3) continue;
      const inn = MX.inset(c, 1.4); if (!inn || inn.length < 3) continue;
      const sh = MX.soft(inn, 0.4), [mx, my] = MX.centroid(inn);
      MX.fill(o, sh, MX.rad(o, mx - 3, my - 3, 1, 16, [[0, 'rgba(250,250,246,0.98)'], [1, 'rgba(226,232,224,0.96)']]));
      MX.line(o, sh, 'rgba(40,120,110,0.8)', 0.8, true);
      if (Math.hypot(mx - CALLUS.div[0], my - CALLUS.div[1]) > 16 && Math.hypot(mx - CALLUS.div2[0], my - CALLUS.div2[1]) > 16) {
        o.fillStyle = 'rgba(120,64,130,0.6)'; o.beginPath(); o.arc(mx + (R() - 0.5) * 3, my + (R() - 0.5) * 3, 2.8, 0, TAU); o.fill();
        o.fillStyle = 'rgba(80,30,90,0.8)'; o.beginPath(); o.arc(mx + 0.6, my - 0.4, 0.8, 0, TAU); o.fill();
        MX.dots(o, R, 8, [mx - 6, my - 6, 12, 12], 0.2, 0.45, 'rgba(120,130,110,0.5)');
      }
    }
    // two cells caught dividing: chromosomes lined up on the spindle (metaphase), and pulled to the poles (anaphase)
    { const [x, y] = CALLUS.div;
      o.fillStyle = 'rgba(252,250,244,1)'; o.beginPath(); o.ellipse(x, y, 16, 12, 0, 0, TAU); o.fill(); o.strokeStyle = 'rgba(40,120,110,0.85)'; o.lineWidth = 0.9; o.stroke();
      for (let k = -4; k <= 4; k++) MX.line(o, [[x - 13, y], [x - 1, y + k * 1.9], [x + 13, y]], 'rgba(130,120,140,0.35)', 0.45);
      for (let k = -3; k <= 3; k++) { o.save(); o.translate(x + (R() - 0.5) * 0.8, y + k * 2.5); o.rotate(0.2 * k); o.fillStyle = '#5A1E5A'; U.rr(o, -1.3, -1.9, 2.6, 3.8, 1); o.fill(); o.restore(); } }
    { const [x, y] = CALLUS.div2;
      o.fillStyle = 'rgba(252,250,244,1)'; o.beginPath(); o.ellipse(x, y, 17, 11, 0.3, 0, TAU); o.fill(); o.strokeStyle = 'rgba(40,120,110,0.85)'; o.lineWidth = 0.9; o.stroke();
      for (let k = -2; k <= 2; k++) MX.line(o, [[x - 12 * Math.cos(0.3), y - 12 * Math.sin(0.3) + k * 1.4], [x + 12 * Math.cos(0.3), y + 12 * Math.sin(0.3) + k * 1.4]], 'rgba(130,120,140,0.3)', 0.4);
      for (const s of [-1, 1]) for (let k = -2; k <= 2; k++) { o.save(); o.translate(x + s * 9 * Math.cos(0.3), y + s * 9 * Math.sin(0.3) + k * 2.2); o.rotate(0.3 + s * 0.4); o.fillStyle = '#5A1E5A'; o.beginPath(); o.moveTo(-1.6 * s, -1.2); o.lineTo(1.4 * s, 0); o.lineTo(-1.6 * s, 1.2); o.lineWidth = 1.1; o.strokeStyle = '#5A1E5A'; o.stroke(); o.restore(); } }
    MX.vignette(o, 0.16, '40,30,50'); MX.grain(o, 0.035);
    MX.scaleBar(o, 32, '50 µm');
  },
});
