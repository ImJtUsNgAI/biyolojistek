'use strict';
// Animal plates: organs cut open, micrographs of tissue and of the rumen's microbes, and see-through anatomy
// of whole animals in the style of a textbook plate. Spot coordinates are listed above each plate.

// ================================================================ ×10 rumen, cut open
// Muscular wall, a carpet of papillae, and the contents in layers: gas on top, a floating mat of chewed
// forage, fluid below. In bloat the gas is trapped in a stable froth instead.
// spots (normal): gas (20,-66) · fibre mat (10,-26) · fluid (20,44) · papillae (96,-12) · rumination (-104,-100)
// spots (bloat): foam (0,-20) · papillae · rumination
const RUMEN = {
  inner: () => MX.blob(0, 8, 106, 86, { seed: 31, wob: 0.035, n: 60 }),
  outer: () => MX.blob(0, 10, 124, 104, { seed: 31, wob: 0.035, n: 60 }),
  eso: [[-152, -140], [-118, -112], [-90, -88], [-66, -64]],
  _in: null,
};
plate('rumen', {
  key: st => st.bloat > 0.3 ? 'bloat' : 'ok',
  still(o, st) {
    const R = MX.rng(131), bloat = st.bloat > 0.3, inner = RUMEN.inner(), outer = RUMEN.outer();
    MX.field(o, '#E4DCCB', '#C8BCA4', 13, 0.01, 60);
    o.fillStyle = 'rgba(40,20,10,0.22)'; o.beginPath(); MX.curve(o, outer.map(([x, y]) => [x + 5, y + 7])); o.fill();
    // the muscular wall, its fibres running round the organ
    o.fillStyle = MX.rad(o, -30, -30, 40, 160, [[0, '#C66A56'], [1, '#8E3A2E']]); o.beginPath(); MX.curve(o, outer); o.fill();
    for (let k = 1; k < 16; k++) {
      const u = k / 16 + (R() - 0.5) * 0.02, p = inner.map((q, i) => [q[0] + (outer[i][0] - q[0]) * u, q[1] + (outer[i][1] - q[1]) * u]);
      MX.line(o, p, k % 2 ? 'rgba(90,24,16,0.3)' : 'rgba(236,150,130,0.25)', 0.55, true);
    }
    MX.line(o, outer, 'rgba(252,222,212,0.55)', 1.3, true);
    MX.line(o, outer, 'rgba(70,24,16,0.8)', 0.7, true);
    // contents
    o.save(); o.beginPath(); MX.curve(o, inner); o.clip();
    if (bloat) {
      o.fillStyle = MX.lin(o, 0, -80, 0, 94, [[0, '#DCE0B8'], [1, '#A8B078']]); o.fillRect(-112, -82, 224, 182);
      for (let i = 0; i < 120; i++) { const x = -110 + R() * 220, y = -80 + R() * 175; o.fillStyle = U.pick(['#6E8A3A', '#8EA84A', '#5E7A30'], R()); o.beginPath(); o.ellipse(x, y, 2 + R() * 3, 0.8, R() * 3, 0, TAU); o.fill(); }
      const bubble = (x, y, r) => {
        o.fillStyle = MX.rad(o, x - r * 0.3, y - r * 0.35, r * 0.1, r, [[0, 'rgba(255,255,250,0.85)'], [0.7, 'rgba(230,236,200,0.35)'], [1, 'rgba(120,130,70,0.5)']]);
        o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
        o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = Math.min(0.5, r * 0.15); o.stroke();
      };
      for (let i = 0; i < 950; i++) { const y = -80 + R() * 175; bubble(-110 + R() * 220, y, (1.2 + R() * R() * 6) * (1.25 - (y + 80) / 330)); }
      for (let i = 0; i < 9; i++) bubble(-80 + R() * 160, -70 + R() * 90, 9 + R() * 7);
    } else {
      o.fillStyle = MX.lin(o, 0, -80, 0, -46, [[0, '#E8ECEA'], [1, '#D2D6CA']]); o.fillRect(-112, -82, 224, 38);
      o.fillStyle = MX.lin(o, 0, -8, 0, 96, [[0, '#9C9656'], [1, '#6A6434']]); o.fillRect(-112, -8, 224, 106);
      MX.dots(o, R, 800, [-110, -4, 220, 100], 0.25, 0.8, 'rgba(56,52,22,0.4)');
      for (let i = 0; i < 60; i++) { const x = -90 + R() * 180, y = 78 + R() * 16; o.fillStyle = MX.lit(o, x, y, 2.5, '#C8B67A', 0.3, 0.3); o.beginPath(); o.ellipse(x, y, 1.6 + R() * 1.4, 1 + R(), R() * 3, 0, TAU); o.fill(); }
      for (let i = 0; i < 14; i++) { const x = -90 + R() * 180, y = 4 + R() * 80, r = 0.8 + R() * 1.6; o.strokeStyle = 'rgba(240,240,220,0.8)'; o.lineWidth = 0.4; o.beginPath(); o.arc(x, y, r, 0, TAU); o.stroke(); }
      // the floating mat of chewed forage
      const top = x => -50 + MX.n(x * 0.05, 2) * 4, bot = x => -4 + MX.n(x * 0.04, 5) * 5, mat = [];
      for (let x = -112; x <= 112; x += 4) mat.push([x, top(x)]);
      for (let x = 112; x >= -112; x -= 4) mat.push([x, bot(x)]);
      o.fillStyle = '#86783E'; o.beginPath(); U.poly(o, mat, true); o.fill();
      o.save(); o.beginPath(); U.poly(o, mat, true); o.clip();
      for (let i = 0; i < 760; i++) {
        const x = -112 + R() * 224, y = top(x) + R() * (bot(x) - top(x)), a = (R() - 0.5) * 1.2 + (R() < 0.15 ? 1.4 : 0), l = 6 + R() * 16;
        o.strokeStyle = U.pick(['#C8B060', '#8E7A38', '#6E8A3E', '#B89A50', '#5E6A2E', '#D6C278'], R()); o.lineWidth = 0.6 + R() * 1.5; o.lineCap = 'round';
        o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2 - 1.5, x + Math.cos(a) * l, y + Math.sin(a) * l); o.stroke();
      }
      for (let i = 0; i < 40; i++) { const x = -100 + R() * 200, y = top(x) + 3 + R() * 36, r = 0.8 + R() * 1.8; o.fillStyle = 'rgba(245,245,230,0.6)'; o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill(); }
      o.restore();
    }
    o.restore();
    // the lining: a dark mucosa carpeted with papillae, sparse and short on the roof, long and dense on the floor
    MX.line(o, inner, '#4A3C28', 3, true);
    const ring = inner.concat([inner[0]]);
    for (let i = 0; i < 280; i++) {
      const [x, y, a] = MX.along(ring, i / 280), cx = -x, cy = 8 - y, d = Math.hypot(cx, cy), nx = cx / d, ny = cy / d, v = (y - 8) / 86;
      if (v < -0.55 && R() < 0.55) continue;
      const L = (5 + R() * 4) * (1.2 + 0.6 * v), w = 2.2 + R() * 1.2, tx = Math.cos(a) * w / 2, ty = Math.sin(a) * w / 2, bend = (R() - 0.5) * 2.5;
      const tip = [x + nx * L + Math.cos(a) * bend, y + ny * L + Math.sin(a) * bend];
      o.fillStyle = MX.lin(o, x, y, tip[0], tip[1], [[0, '#3A2E1E'], [1, '#806E4A']]);
      o.beginPath(); o.moveTo(x + tx, y + ty); o.quadraticCurveTo(x + tx + nx * L * 0.6, y + ty + ny * L * 0.6, tip[0], tip[1]); o.quadraticCurveTo(x - tx + nx * L * 0.6, y - ty + ny * L * 0.6, x - tx, y - ty); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(210,190,150,0.3)'; o.lineWidth = 0.3; o.beginPath(); o.moveTo(x, y); o.lineTo(tip[0] - nx * 0.8, tip[1] - ny * 0.8); o.stroke();
    }
    // the oesophagus opens at the top; chewing the cud sends a bolus back up it
    MX.tube(o, RUMEN.eso, 16, '#D48C7C');
    for (const d of [-3.5, 0, 3.5]) MX.line(o, U.offsetLine(RUMEN.eso, d), 'rgba(140,60,50,0.35)', 0.5);
    o.save(); o.translate(-110, -104); o.rotate(-2.4 + Math.PI);
    o.fillStyle = MX.lit(o, 0, 0, 9, '#8E8A48', 0.3, 0.35); o.beginPath(); o.ellipse(0, 0, 9.5, 6, 0, 0, TAU); o.fill();
    for (let k = 0; k < 12; k++) { o.strokeStyle = U.pick(['#C8B060', '#6E8A3E', '#5E5A2A'], R()); o.lineWidth = 0.5; o.beginPath(); o.moveTo(-7 + R() * 14, -4 + R() * 8); o.lineTo(-7 + R() * 14, -4 + R() * 8); o.stroke(); }
    o.restore();
    MX.note(o, [[-72, -90], [-96, -114], [-116, -134]], '#A0322A', 1.6);
    MX.vignette(o, 0.12); MX.grain(o, 0.04);
    MX.scaleBar(o, 23, '10 cm');
  },
  live(x, st, t) {
    if (st.bloat > 0.3) return;
    const inn = RUMEN._in || (RUMEN._in = RUMEN.inner());
    x.save(); x.beginPath(); MX.curve(x, inn); x.clip();
    x.strokeStyle = 'rgba(245,245,230,0.75)'; x.lineWidth = 0.5;
    for (let i = 0; i < 12; i++) { const y = 90 - ((t * 14 + i * 23) % 150), bx = -80 + (i * 37) % 160 + Math.sin(t * 2 + i) * 2; if (y < -48) continue; x.beginPath(); x.arc(bx, y, 1 + (i % 3) * 0.5, 0, TAU); x.stroke(); }
    x.restore();
  },
});

// ================================================================ ×1000 rumen fluid under the microscope
// Chewed plant fragments colonised by bacteria, a ciliate protozoan full of swallowed starch, methane-making
// archaea beside a gas bubble, and an anaerobic fungus rooting into a fibre.
// spots: cellulose fibre (-100,-59) · bacteria (-28,-76) · protozoan (-66,52) · methanogens (10,10) · fungus (64,70)
const MICROBE = {
  ento: { x: -66, y: 52, a: -0.5, rx: 37, ry: 25 },
  iso: { x: 84, y: -54, a: 0.4, rx: 28, ry: 19 },
  fibre(o, R, a, b, w, spiral) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    o.save(); o.translate(a[0], a[1]); o.rotate(ang);
    const top = [], bot = [];
    for (let u = 0; u <= L; u += 6) { top.push([u, -w / 2 + MX.n(u * 0.08, 1) * 2.2]); bot.push([u, w / 2 + MX.n(u * 0.08, 2) * 2.2]); }
    const poly = top.concat(bot.slice().reverse());
    o.strokeStyle = 'rgba(255,255,245,0.55)'; o.lineWidth = 3; o.beginPath(); U.poly(o, poly, true); o.stroke();
    o.fillStyle = MX.lin(o, 0, -w / 2, 0, w / 2, spiral ? [[0, 'rgba(236,228,190,0.5)'], [0.5, 'rgba(246,242,220,0.35)'], [1, 'rgba(226,216,176,0.55)']] : [[0, '#B89A58'], [0.5, '#D8C68E'], [1, '#B08E4E']]);
    o.beginPath(); U.poly(o, poly, true); o.fill();
    o.save(); o.beginPath(); U.poly(o, poly, true); o.clip();
    if (!spiral) {
      // long cells with their walls, eaten into along one edge
      for (let k = -1; k <= 1; k++) MX.line(o, [[0, k * w / 4], [L / 2, k * w / 4 + 1], [L, k * w / 4]], 'rgba(120,90,40,0.75)', 0.9);
      for (let k = -2; k < 2; k++) for (let u = R() * 20; u < L; u += 16 + R() * 12) { o.strokeStyle = 'rgba(120,90,40,0.6)'; o.lineWidth = 0.7; o.beginPath(); o.moveTo(u, k * w / 4); o.lineTo(u + 1, (k + 1) * w / 4); o.stroke(); }
      for (let i = 0; i < 26; i++) { const u = R() * L; o.fillStyle = 'rgba(236,230,200,0.85)'; o.beginPath(); MX.curve(o, MX.blob(u, w / 2 - 1.5, 2 + R() * 3, 1.5 + R() * 2, { seed: i, wob: 0.3, n: 8 })); o.fill(); }
    } else {
      // a water vessel: a clear tube stiffened by a spiral band
      MX.line(o, [[0, -w * 0.42], [L, -w * 0.42]], 'rgba(150,120,60,0.5)', 0.6); MX.line(o, [[0, w * 0.42], [L, w * 0.42]], 'rgba(150,120,60,0.5)', 0.6);
      for (let u = 0; u < L; u += 5) {
        o.strokeStyle = 'rgba(190,170,120,0.35)'; o.lineWidth = 1; o.beginPath(); o.moveTo(u + 3.5, -w * 0.42); o.lineTo(u, w * 0.42); o.stroke();
        o.strokeStyle = '#A88A48'; o.lineWidth = 1.5; o.beginPath(); o.moveTo(u, -w * 0.42); o.lineTo(u + 3.5, w * 0.42); o.stroke();
      }
    }
    o.restore();
    o.strokeStyle = 'rgba(90,70,30,0.8)'; o.lineWidth = 0.7; o.beginPath(); U.poly(o, poly, true); o.stroke();
    o.restore();
  },
  protozoan(o, R, p, full) {
    o.save(); o.translate(p.x, p.y); o.rotate(p.a);
    const body = MX.blob(0, 0, p.rx, p.ry, { seed: full ? 9 : 5, wob: 0.04, n: 40 }).map(([x, y]) => full ? [x, y] : [x > p.rx * 0.75 ? p.rx * 0.75 + (x - p.rx * 0.75) * 0.35 : x, y]);
    o.strokeStyle = 'rgba(255,255,248,0.6)'; o.lineWidth = 3.2; MX.path(o, body); o.stroke();
    MX.fill(o, body, MX.rad(o, -p.rx * 0.2, -p.ry * 0.3, 2, p.rx, [[0, '#EEEAD4'], [1, '#CEC5A0']]));
    o.save(); MX.path(o, body); o.clip();
    MX.dots(o, R, 260, [-p.rx, -p.ry, p.rx * 2, p.ry * 2], 0.25, 0.6, 'rgba(110,100,60,0.35)');
    for (let i = 0; i < (full ? 10 : 24); i++) {
      const x = (R() - 0.5) * p.rx * 1.3, y = (R() - 0.5) * p.ry * 1.2, r = 1.6 + R() * 1.8;
      o.fillStyle = MX.rad(o, x - r * 0.3, y - r * 0.3, 0.2, r, [[0, '#FFFFFA'], [1, '#E8E4CE']]); o.beginPath(); o.ellipse(x, y, r * 1.2, r, R() * 3, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(90,80,50,0.6)'; o.lineWidth = 0.3; o.stroke();
    }
    for (let i = 0; i < 8; i++) { o.fillStyle = U.pick(['rgba(150,120,60,0.7)', 'rgba(110,130,60,0.6)'], R()); o.beginPath(); MX.curve(o, MX.blob((R() - 0.5) * p.rx, (R() - 0.5) * p.ry, 1.6 + R() * 2, 1 + R() * 1.4, { seed: i + 30, wob: 0.4, n: 6 })); o.fill(); }
    o.restore();
    o.strokeStyle = 'rgba(90,80,50,0.85)'; o.lineWidth = 0.8; MX.path(o, body); o.stroke();
    // macronucleus, micronucleus, contractile vacuole
    o.fillStyle = MX.lin(o, 0, -p.ry * 0.62, 0, -p.ry * 0.38, [[0, '#B4AA88'], [1, '#948A68']]); U.rr(o, -p.rx * 0.55, -p.ry * 0.62, p.rx * 1.05, p.ry * 0.24, p.ry * 0.12); o.fill();
    o.strokeStyle = 'rgba(70,60,40,0.7)'; o.lineWidth = 0.4; o.stroke();
    MX.ball(o, p.rx * 0.2, -p.ry * 0.3, 1.6, '#8A806A', 0.3, 0.3);
    o.fillStyle = 'rgba(250,252,248,0.9)'; o.beginPath(); o.arc(-p.rx * 0.5, p.ry * 0.35, 3.6, 0, TAU); o.fill(); o.strokeStyle = 'rgba(100,100,80,0.6)'; o.lineWidth = 0.4; o.stroke();
    if (!full) {
      // the mouth at the front, spines at the back
      o.fillStyle = 'rgba(120,108,70,0.6)'; o.beginPath(); o.moveTo(p.rx * 0.78, -p.ry * 0.3); o.quadraticCurveTo(p.rx * 0.5, 0, p.rx * 0.78, p.ry * 0.3); o.closePath(); o.fill();
      for (const [y0, dy] of [[-6, -9], [4, 6]]) MX.taper(o, [[-p.rx + 2, y0], [-p.rx - 6, y0 + dy * 0.4], [-p.rx - 15, y0 + dy]], 3.4, 0.3, '#DCD4B4', 'rgba(90,80,50,0.7)');
    }
    o.restore();
  },
  cilia(x, p, t, full) {
    x.save(); x.translate(p.x, p.y); x.rotate(p.a);
    x.strokeStyle = 'rgba(90,84,60,0.55)'; x.lineWidth = 0.35;
    if (full) {
      for (let i = 0; i < 70; i++) { const a = i / 70 * TAU, bx = Math.cos(a) * p.rx, by = Math.sin(a) * p.ry, w = Math.sin(t * 12 - i * 0.5) * 0.5; x.beginPath(); x.moveTo(bx, by); x.lineTo(bx + Math.cos(a + w) * 3.6, by + Math.sin(a + w) * 3.6); x.stroke(); }
    } else {
      for (let i = 0; i < 18; i++) { const y = (i / 17 - 0.5) * p.ry * 1.1, bx = p.rx * 0.76, w = Math.sin(t * 14 - i * 0.6) * 0.6; x.beginPath(); x.moveTo(bx, y); x.lineTo(bx + Math.cos(w) * 7, y + Math.sin(w) * 7); x.stroke(); }
    }
    x.restore();
  },
};
plate('microbes', {
  still(o, st) {
    const R = MX.rng(141);
    MX.field(o, '#DAD6C2', '#BDB79C', 14, 0.015, 80);
    MX.layer(o, x => MX.dots(x, R, 160, [-141, -141, 282, 282], 0.6, 2.2, 'rgba(120,110,80,0.35)'), 1.8, 1);
    MICROBE.fibre(o, R, [-160, -20], [40, -150], 44, false);
    MICROBE.fibre(o, R, [36, 150], [160, 40], 30, true);
    // bacteria everywhere, and crowded into a film on the fibre they are digesting
    const rod = (x, y, a, l) => { o.fillStyle = 'rgba(250,250,240,0.5)'; o.beginPath(); o.ellipse(x, y, l / 2 + 0.8, 1.9, a, 0, TAU); o.fill(); MX.rod(o, x, y, a, l, 2.1, '#4A4636'); };
    for (let i = 0; i < 320; i++) { const x = -140 + R() * 280, y = -140 + R() * 280; if (R() < 0.3) { o.fillStyle = '#4A4636'; o.beginPath(); o.arc(x, y, 1.2, 0, TAU); o.fill(); } else rod(x, y, R() * TAU, 4.5 + R() * 2.5); }
    for (let i = 0; i < 300; i++) {
      const t = R() < 0.5 ? 0.45 + R() * 0.3 : 0.05 + R() * 0.9, x = -160 + 200 * t, y = -20 - 130 * t, off = 20 + R() * 6;
      rod(x + 0.545 * off + (R() - 0.5) * 3, y + 0.838 * off + (R() - 0.5) * 3, -0.58 + (R() - 0.5) * 1.4, 4 + R() * 2.4);
    }
    // anaerobic fungus: a pear-shaped sporangium on a stalk, its rhizoids rooting into the vessel
    for (let i = 0; i < 7; i++) MX.taper(o, MX.strand(R, 70, 82, 0.72 + (R() - 0.5) * 1.2, 22 + R() * 22, 2, 0.6), 1.1, 0.2, 'rgba(154,138,96,0.9)');
    MX.line(o, [[66, 78], [70, 82], [74, 88]], '#9A8A60', 1.4);
    o.save(); o.translate(62, 66); o.rotate(-0.85);
    o.fillStyle = MX.rad(o, -3, -4, 1, 16, [[0, '#E6DAB0'], [1, '#B8A874']]); o.beginPath(); MX.curve(o, [[0, -17], [9, -9], [10, 4], [5, 13], [0, 16], [-5, 13], [-10, 4], [-9, -9]]); o.fill();
    o.strokeStyle = 'rgba(100,84,50,0.8)'; o.lineWidth = 0.6; o.stroke();
    o.save(); o.clip(); MX.dots(o, R, 80, [-10, -17, 20, 33], 0.4, 0.9, 'rgba(130,110,60,0.5)'); o.restore();
    o.restore();
    for (const [x, y] of [[40, 40], [30, 54], [96, 60]]) { o.fillStyle = '#E4DAB8'; o.beginPath(); o.ellipse(x, y, 2.6, 2, 0, 0, TAU); o.fill(); o.strokeStyle = 'rgba(100,90,60,0.7)'; o.lineWidth = 0.35; o.stroke(); }
    // methane makers (archaea) crowd round a gas bubble; they glow faintly blue under UV light
    o.fillStyle = MX.rad(o, -4, -2, 2, 9, [[0, '#FFFFFF'], [0.7, '#F2F4F0'], [0.86, '#3A3A30'], [1, '#8A8A78']]); o.beginPath(); o.arc(-4, -2, 8.5, 0, TAU); o.fill();
    o.fillStyle = 'rgba(120,200,210,0.28)'; o.beginPath(); o.ellipse(12, 12, 13, 10, 0.6, 0, TAU); o.fill();
    for (let i = 0; i < 16; i++) {
      const a = R() * TAU, d = R() * 9, x = 12 + Math.cos(a) * d, y = 12 + Math.sin(a) * d * 0.8, ang = R() * TAU, n = 2 + Math.floor(R() * 3);
      for (let k = 0; k < n; k++) MX.rod(o, x + Math.cos(ang) * k * 3.6, y + Math.sin(ang) * k * 3.6, ang, 3.2, 1.7, '#3E4A40');
    }
    MICROBE.protozoan(o, R, MICROBE.iso, true);
    MICROBE.protozoan(o, R, MICROBE.ento, false);
    MX.vignette(o, 0.22); MX.grain(o, 0.06);
    MX.scaleBar(o, 28, '10 µm');
  },
  live(x, st, t) {
    MICROBE.cilia(x, MICROBE.iso, t, true);
    MICROBE.cilia(x, MICROBE.ento, t, false);
    x.strokeStyle = 'rgba(80,74,54,0.6)'; x.lineWidth = 0.3;
    for (const [px, py] of [[40, 40], [30, 54], [96, 60]]) { x.beginPath(); x.moveTo(px - 2.4, py); for (let k = 1; k < 8; k++) x.lineTo(px - 2.4 - k * 1.6, py + Math.sin(t * 16 + k + px) * 1.2); x.stroke(); }
  },
});

// ================================================================ ×100 stomach wall (H&E stained section)
// From the inside out: mucus, surface cells and pits, gastric glands (pink acid-making parietal cells above,
// purple enzyme-making chief cells below), then submucosa with vessels, and two layers of smooth muscle.
// spots: mucus (20,-120) · gastric gland (-58,-50) · muscle (40,62)
plate('stomachWall', {
  still(o, st) {
    const R = MX.rng(151), E = '#EDA9C2', H = '#4B3A86';
    o.fillStyle = '#F6EFF3'; o.fillRect(-141, -141, 282, 282);
    // mucus gel over the surface
    o.fillStyle = MX.lin(o, 0, -141, 0, -100, [[0, 'rgba(220,214,232,0.2)'], [1, '#D8D0E6']]); o.fillRect(-141, -141, 282, 42);
    for (let i = 0; i < 18; i++) MX.line(o, MX.strand(R, -150 + R() * 300, -132 + R() * 26, (R() - 0.5) * 0.4, 60 + R() * 60, 5, 0.12), 'rgba(170,150,200,0.35)', 0.6);
    for (let i = 0; i < 6; i++) { const x = -120 + R() * 240, y = -128 + R() * 18; o.fillStyle = 'rgba(230,170,200,0.7)'; o.beginPath(); o.ellipse(x, y, 3, 2, R() * 3, 0, TAU); o.fill(); o.fillStyle = H; o.beginPath(); o.arc(x, y, 0.9, 0, TAU); o.fill(); }
    // lamina propria, the pink connective tissue everything else sits in
    o.fillStyle = '#EBC4D7'; o.fillRect(-141, -100, 282, 104);
    MX.dots(o, R, 260, [-141, -100, 282, 100], 0.5, 1.1, 'rgba(75,58,134,0.7)');
    // gastric glands and the pits they open into
    const surf = x => -104 + 3 * Math.sin(x * 0.09);
    for (let k = 0; k < 12; k++) {
      const gx = -128.35 + 23.3 * k, w = 8.6;
      // columnar mucous cells line the surface and the pit
      for (let x = gx - 11.6; x < gx + 11.6; x += 3.1) {
        const y0 = surf(x), pit = Math.abs(x - gx) < 3.5, y1 = pit ? -84 : y0 + 10;
        o.fillStyle = '#F4DCE8'; o.fillRect(x, y0, 2.9, y1 - y0);
        o.strokeStyle = 'rgba(160,90,140,0.4)'; o.lineWidth = 0.25; o.strokeRect(x, y0, 2.9, y1 - y0);
        o.fillStyle = H; o.beginPath(); o.ellipse(x + 1.45, y1 - 1.8, 0.9, 1.4, 0, 0, TAU); o.fill();
      }
      // the gland tube, cell by cell down both sides of a narrow lumen
      for (let y = -84; y < -4; y += 6.6) {
        for (const s of [-1, 1]) {
          const deep = (y + 84) / 80, parietal = R() < (deep < 0.5 ? 0.72 : 0.22), cx = gx + s * w / 2, cy = y + 3.3;
          const cell = MX.blob(cx, cy, parietal ? 4.8 : 4.2, 3.4, { seed: k * 40 + y | 0, wob: 0.12, n: 10 });
          MX.fill(o, cell, parietal ? U.mix('#E98AB0', '#F2A6C4', R()) : U.mix('#9C82C2', '#8A72B4', R()));
          o.strokeStyle = 'rgba(120,60,110,0.45)'; o.lineWidth = 0.3; MX.path(o, cell); o.stroke();
          if (parietal) { o.fillStyle = 'rgba(255,240,248,0.5)'; o.beginPath(); o.arc(cx, cy, 2.4, 0, TAU); o.fill(); o.fillStyle = H; o.beginPath(); o.arc(cx, cy, 1.25, 0, TAU); o.fill(); }
          else { o.fillStyle = '#3E2E78'; o.beginPath(); o.arc(cx + s * 2.2, cy, 1.2, 0, TAU); o.fill(); }
        }
      }
      MX.line(o, [[gx, -86], [gx + 0.6, -44], [gx, -4]], 'rgba(252,246,250,0.95)', 0.9);
    }
    // capillaries between the glands
    for (let i = 0; i < 30; i++) { const x = -128 + 23.3 * Math.floor(R() * 12) + 11.6, y = -80 + R() * 72; o.fillStyle = '#D0443A'; o.beginPath(); o.ellipse(x, y, 1.1, 0.8, R() * 3, 0, TAU); o.fill(); }
    // muscularis mucosae
    o.fillStyle = '#D98AAE'; o.fillRect(-141, 0, 282, 8);
    for (let i = 0; i < 60; i++) { o.fillStyle = H; o.beginPath(); o.ellipse(-140 + R() * 280, 1 + R() * 6, 2, 0.5, 0, 0, TAU); o.fill(); }
    // submucosa: loose wavy collagen, an artery, a vein and a cluster of fat cells
    o.fillStyle = '#F4D8E6'; o.fillRect(-141, 8, 282, 34);
    for (let i = 0; i < 70; i++) MX.line(o, MX.strand(R, -150 + R() * 300, 10 + R() * 30, (R() - 0.5) * 0.6, 20 + R() * 30, 3, 0.6), 'rgba(226,150,190,0.7)', 0.6);
    const vessel = (x, y, rx, ry, wall) => {
      o.fillStyle = '#E27FA6'; o.beginPath(); o.ellipse(x, y, rx, ry, 0, 0, TAU); o.fill();
      o.fillStyle = '#FBF2F6'; o.beginPath(); o.ellipse(x, y, rx - wall, ry - wall, 0, 0, TAU); o.fill();
      for (let i = 0; i < rx * ry * 0.4; i++) { const a = R() * TAU, d = Math.sqrt(R()) * 0.8; o.fillStyle = '#D24B40'; o.beginPath(); o.ellipse(x + Math.cos(a) * (rx - wall) * d, y + Math.sin(a) * (ry - wall) * d, 1.3, 1, R() * 3, 0, TAU); o.fill(); }
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; o.fillStyle = H; o.beginPath(); o.ellipse(x + Math.cos(a) * (rx - wall / 2), y + Math.sin(a) * (ry - wall / 2), 1.2, 0.5, a + 1.57, 0, TAU); o.fill(); }
    };
    vessel(-60, 25, 9, 8, 3.6); vessel(40, 24, 13, 9, 1.4);
    for (let i = 0; i < 9; i++) { const x = 96 + (i % 3) * 9 + R() * 2, y = 16 + Math.floor(i / 3) * 8; o.fillStyle = '#FDF8FA'; o.beginPath(); o.arc(x, y, 4.4, 0, TAU); o.fill(); o.strokeStyle = 'rgba(200,120,160,0.7)'; o.lineWidth = 0.5; o.stroke(); }
    // inner muscle layer: fibres cut along their length, cigar-shaped nuclei
    o.fillStyle = '#D66F97'; o.fillRect(-141, 42, 282, 42);
    for (let i = 0; i < 160; i++) { const x = -150 + R() * 300, y = 43 + R() * 40, l = 20 + R() * 16; o.strokeStyle = U.pick(['rgba(240,150,185,0.6)', 'rgba(190,80,125,0.5)'], R()); o.lineWidth = 1.4; o.beginPath(); o.moveTo(x, y); o.lineTo(x + l, y + (R() - 0.5) * 2); o.stroke(); }
    for (let i = 0; i < 90; i++) { o.fillStyle = H; o.beginPath(); o.ellipse(-140 + R() * 280, 44 + R() * 38, 2.8, 0.6, (R() - 0.5) * 0.1, 0, TAU); o.fill(); }
    // a nerve ganglion between the muscle layers: it keeps the stomach churning
    o.fillStyle = '#F2D0E0'; o.fillRect(-141, 84, 282, 5);
    o.fillStyle = '#F6DCE8'; o.beginPath(); o.ellipse(-30, 87, 16, 7, 0, 0, TAU); o.fill();
    for (let i = 0; i < 5; i++) { const x = -42 + i * 6, y = 86 + (i % 2) * 2; o.fillStyle = '#E7A6C4'; o.beginPath(); o.arc(x, y, 2.6, 0, TAU); o.fill(); o.fillStyle = H; o.beginPath(); o.arc(x, y, 0.9, 0, TAU); o.fill(); }
    // outer layer: fibres cut across
    o.fillStyle = '#CF6A92'; o.fillRect(-141, 89, 282, 35);
    const ms = MX.scatter(R, 260, 4.4, [-145, 89, 290, 35]);
    for (const c of MX.voronoi(ms, U.rectPts(-145, 89, 290, 35))) { o.strokeStyle = 'rgba(245,190,212,0.8)'; o.lineWidth = 0.4; o.beginPath(); U.poly(o, c, true); o.stroke(); if (R() < 0.35) { const [x, y] = MX.centroid(c); o.fillStyle = H; o.beginPath(); o.arc(x, y, 0.8, 0, TAU); o.fill(); } }
    // serosa
    o.fillStyle = '#F2C4D8'; o.fillRect(-141, 124, 282, 6);
    for (let i = 0; i < 20; i++) { o.fillStyle = H; o.beginPath(); o.ellipse(-140 + i * 14.5, 129.5, 2.6, 0.6, 0, 0, TAU); o.fill(); }
    MX.vignette(o, 0.1); MX.grain(o, 0.04);
    MX.scaleBar(o, 23, '100 µm');
  },
});

// ================================================================ ×10 a bird's wing bone, cut lengthwise
// spot: the air-filled hollow (0,0)
plate('boneSection', {
  still(o, st) {
    const R = MX.rng(161);
    MX.field(o, '#E8E6E0', '#C9C6BC', 15, 0.01, 50);
    const top = x => -38 - 26 * Math.exp(-(((x + 125) / 30) ** 2)) - 30 * Math.exp(-(((x - 125) / 32) ** 2)) + 3 * Math.sin(x * 0.01);
    const bot = x => 38 + 24 * Math.exp(-(((x + 125) / 30) ** 2)) + 28 * Math.exp(-(((x - 125) / 32) ** 2));
    const outl = []; for (let x = -150; x <= 150; x += 3) outl.push([x, top(x)]); for (let x = 150; x >= -150; x -= 3) outl.push([x, bot(x)]);
    o.fillStyle = 'rgba(40,30,20,0.2)'; o.beginPath(); U.poly(o, outl.map(([x, y]) => [x + 4, y + 6]), true); o.fill();
    o.fillStyle = MX.lin(o, 0, -70, 0, 70, [[0, '#F4ECD8'], [0.5, '#E9DFC6'], [1, '#D8CCAE']]); o.beginPath(); U.poly(o, outl, true); o.fill();
    // the hollow: air, braced by thin struts
    const cav = []; for (let x = -100; x <= 100; x += 3) cav.push([x, top(x) + 6]); for (let x = 100; x >= -100; x -= 3) cav.push([x, bot(x) - 6]);
    o.fillStyle = MX.lin(o, 0, -32, 0, 32, [[0, '#C8CCCC'], [0.25, '#EEF2F3'], [0.75, '#EEF2F3'], [1, '#C4C6C4']]); o.beginPath(); MX.curve(o, cav); o.fill();
    // spongy bone fills both ends
    for (const side of [-1, 1]) {
      const sites = MX.scatter(R, 90, 6.5, [side < 0 ? -150 : 92, -70, 58, 140], (x, y) => y > top(x) + 5 && y < bot(x) - 5 && Math.abs(x) > 94);
      o.save(); o.beginPath(); U.poly(o, outl, true); o.clip();
      for (const c of MX.voronoi(sites, U.rectPts(side < 0 ? -155 : 88, -75, 67, 150))) {
        if (c.length < 3) continue;
        const sh = MX.soft(MX.inset(c, 1.1), 0.3);
        MX.fill(o, sh, MX.rad(o, MX.centroid(c)[0], MX.centroid(c)[1], 0.5, 6, [[0, '#F4F6F4'], [1, '#C8C6BC']]));
      }
      o.restore();
    }
    // struts crossing the shaft in a truss, the way engineers brace a bridge
    const strut = (x0, x1, dir) => {
      const a = [x0, dir > 0 ? top(x0) + 5 : bot(x0) - 5], b = [x1, dir > 0 ? bot(x1) - 5 : top(x1) + 5];
      MX.taper(o, [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b], 3.2, 3.2, '#E6DCC2', 'rgba(120,100,70,0.6)');
      for (const p of [a, b]) MX.ball(o, p[0], p[1], 3.2, '#E6DCC2', 0.3, 0.3);
    };
    strut(-95, -70, 1); strut(-70, -44, -1); strut(-44, -26, 1);
    strut(30, 50, -1); strut(50, 72, 1); strut(72, 96, -1);
    // the thin compact wall: layered bone with the tiny spaces where bone cells live
    for (const f of [top, bot]) {
      const s = f === top ? 1 : -1;
      for (let k = 0; k < 5; k++) { const p = []; for (let x = -150; x <= 150; x += 4) p.push([x, f(x) + s * (0.8 + k * 1.1)]); MX.line(o, p, 'rgba(170,150,110,0.35)', 0.3); }
      for (let i = 0; i < 140; i++) { const x = -145 + R() * 290, y = f(x) + s * (1 + R() * 4.2); o.fillStyle = 'rgba(90,70,40,0.55)'; o.beginPath(); o.ellipse(x, y, 0.9, 0.35, 0, 0, TAU); o.fill(); }
    }
    // the opening where an air sac reaches into the bone
    o.fillStyle = '#2E2A22'; o.beginPath(); o.ellipse(-82, top(-82) + 3, 5, 3, 0, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(80,60,40,0.8)'; o.lineWidth = 0.9; o.beginPath(); U.poly(o, outl, true); o.stroke();
    o.strokeStyle = 'rgba(120,110,90,0.5)'; o.lineWidth = 0.5; o.beginPath(); MX.curve(o, cav); o.stroke();
    // cross-section window
    MX.loupe(o, 84, -92, 34, null, st.lang === 'en' ? 'cross-section' : 'enine kesit', x => {
      x.fillStyle = '#D8D6CE'; x.fillRect(-40, -40, 80, 80);
      x.fillStyle = MX.rad(x, -6, -6, 4, 28, [[0, '#F4ECD8'], [1, '#D8CCAE']]); x.beginPath(); x.arc(0, 0, 26, 0, TAU); x.fill();
      x.fillStyle = MX.rad(x, 3, 3, 2, 22, [[0, '#F2F5F5'], [1, '#C8CAC8']]); x.beginPath(); x.arc(0, 0, 21.5, 0, TAU); x.fill();
      MX.taper(x, [[-16, -14], [0, 0], [15, 15]], 2.6, 2.6, '#E6DCC2', 'rgba(120,100,70,0.6)');
      MX.taper(x, [[-18, 10], [-4, 4], [8, -19]], 2, 2, '#E6DCC2', 'rgba(120,100,70,0.6)');
      x.strokeStyle = 'rgba(80,60,40,0.7)'; x.lineWidth = 0.7; x.beginPath(); x.arc(0, 0, 26, 0, TAU); x.stroke();
    });
    MX.vignette(o, 0.1); MX.grain(o, 0.04);
    MX.scaleBar(o, 35, '5 mm');
  },
});

// ================================================================ ×5 carp, body wall made see-through
// spots: gills (-60,0) · swim bladder (20,-12) · heart (-54,28)
const FISHP = {
  body: [[-128, -2], [-122, -14], [-108, -26], [-84, -38], [-50, -48], [-10, -52], [30, -48], [62, -38], [86, -24], [98, -12], [102, -6], [102, 6], [96, 14], [80, 24], [50, 34], [10, 40], [-30, 40], [-66, 36], [-94, 28], [-114, 16], [-126, 6]],
  fin(o, pts, base, rays) {
    o.fillStyle = U.rgba(base, 0.7); o.beginPath(); MX.curve(o, pts); o.fill();
    o.strokeStyle = U.rgba(U.shade(base, -0.4), 0.7); o.lineWidth = 0.4; o.stroke();
    if (rays) { const [bx, by] = rays; o.strokeStyle = U.rgba(U.shade(base, -0.3), 0.55); o.lineWidth = 0.45; for (let i = 1; i < pts.length - 1; i++) { o.beginPath(); o.moveTo(bx, by); o.lineTo(pts[i][0], pts[i][1]); o.stroke(); } }
  },
};
plate('fish', {
  still(o, st) {
    const R = MX.rng(171), F = FISHP;
    MX.field(o, '#E6ECEE', '#C8D2D6', 17, 0.01, 50);
    o.fillStyle = 'rgba(30,40,50,0.16)'; o.beginPath(); MX.curve(o, F.body.map(([x, y]) => [x + 4, y + 8])); o.fill();
    // fins behind the body
    F.fin(o, [[98, -8], [112, -26], [132, -46], [140, -40], [126, -18], [120, 0], [126, 18], [140, 40], [132, 46], [112, 28], [98, 8]], '#C88A6A', [100, 0]);
    F.fin(o, [[-14, -52], [-6, -76], [4, -72], [20, -64], [40, -58], [58, -44], [52, -40], [30, -48]], '#B89478', [20, -46]);
    F.fin(o, [[-6, 38], [10, 52], [20, 56], [18, 46], [6, 40]], '#D08A6A', [2, 40]);
    F.fin(o, [[52, 32], [62, 48], [72, 52], [76, 42], [66, 30]], '#D08A6A', [58, 32]);
    // flesh
    MX.fill(o, F.body, MX.lin(o, 0, -52, 0, 40, [[0, '#E2BCA8'], [0.5, '#F0D2C4'], [1, '#EAD6CC']]));
    o.save(); MX.path(o, F.body); o.clip();
    // muscle blocks (myomeres) in the tail
    for (let x = 34; x < 104; x += 7) MX.line(o, [[x - 4, -46], [x + 3, -22], [x - 2, 0], [x + 3, 22], [x - 4, 40]], 'rgba(170,110,90,0.35)', 0.6);
    // backbone, ribs and spines
    for (let x = -78; x < 98; x += 5.2) { const y = -24 + (x + 78) * 0.11; o.fillStyle = '#F3ECDD'; U.rr(o, x, y - 2.4, 4.6, 4.8, 1.2); o.fill(); o.strokeStyle = 'rgba(140,120,90,0.5)'; o.lineWidth = 0.35; o.stroke(); MX.line(o, [[x + 2.3, y - 2.4], [x + 5, y - 14], [x + 9, y - 22]], 'rgba(236,226,206,0.8)', 0.6); }
    for (let x = -66; x < 34; x += 7) { const y = -21 + (x + 78) * 0.11; MX.line(o, [[x, y], [x - 4, y + 18], [x + 2, y + 36]], 'rgba(236,226,206,0.55)', 0.8); }
    // kidney along the backbone
    MX.taper(o, [[-72, -18], [-30, -18], [10, -14], [44, -10]], 5, 3, '#8A2A2E', 'rgba(60,10,14,0.6)');
    // liver and gut
    MX.fill(o, MX.blob(-30, 16, 26, 11, { seed: 3, wob: 0.15, rot: 0.1 }), MX.lit(o, -30, 16, 26, '#9A4E3A', 0.2, 0.3));
    const gut = [[-40, 24], [-10, 28], [16, 22], [30, 14], [18, 8], [-2, 14], [8, 22], [30, 26], [48, 30]];
    MX.tube(o, gut, 5, '#C8A870');
    // swim bladder: two silvery chambers joined by a narrow duct
    for (const [x, y, rx, ry] of [[-26, -15, 19, 11], [22, -11, 28, 12.5]]) {
      o.fillStyle = MX.rad(o, x - rx * 0.3, y - ry * 0.4, 1, rx * 1.1, [[0, '#FFFFFF'], [0.4, '#E8EEF0'], [1, '#A8B8BE']]); o.beginPath(); o.ellipse(x, y, rx, ry, 0.05, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(90,110,120,0.7)'; o.lineWidth = 0.6; o.stroke();
    }
    MX.line(o, [[-8, -13], [-4, -12]], '#C8D4D8', 3);
    o.restore();
    // gills: four arches of feathery red filaments under the gill cover
    for (let k = 0; k < 4; k++) {
      const arch = [[-74 + k * 5, -24], [-66 + k * 5, -2], [-70 + k * 5, 22]];
      for (let t = 0; t <= 1; t += 0.03) { const [x, y, a] = MX.along(arch, t); o.strokeStyle = t * 17 % 2 < 1 ? '#C23038' : '#9A1E2A'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a - 1.57) * -9, y + Math.sin(a - 1.57) * -9); o.stroke(); }
      MX.line(o, arch, '#F2E6D6', 1.4);
    }
    // heart: pale bulbus in front, dark ventricle and atrium behind, the aorta running forward to the gills
    MX.line(o, [[-60, 26], [-70, 18], [-76, 8]], '#E4A4A4', 2);
    MX.fill(o, MX.blob(-50, 30, 7, 5.5, { seed: 8, wob: 0.1 }), MX.lit(o, -50, 30, 7, '#6A1A2A', 0.2, 0.3));
    MX.fill(o, MX.blob(-56, 28, 7, 6, { seed: 7, wob: 0.1 }), MX.lit(o, -56, 28, 7, '#8E1E28', 0.3, 0.3));
    MX.ball(o, -63, 24, 3.6, '#EBC0C0', 0.4, 0.3);
    // gill cover edge, eye and brain
    MX.line(o, [[-84, -34], [-74, -14], [-72, 6], [-78, 28]], 'rgba(110,90,80,0.7)', 1);
    MX.fill(o, MX.blob(-98, -26, 9, 5, { seed: 4, wob: 0.1 }), '#EAB8B0');
    o.fillStyle = MX.rad(o, -104, -12, 1, 7.5, [[0, '#E8ECEE'], [0.6, '#B8C4C8'], [1, '#6E7A7E']]); o.beginPath(); o.arc(-104, -12, 7.5, 0, TAU); o.fill();
    MX.ball(o, -104.5, -12, 3.8, '#101418', 0.25, 0.1);
    o.fillStyle = 'rgba(255,255,255,0.85)'; o.beginPath(); o.arc(-106, -14, 1.1, 0, TAU); o.fill();
    // skin: scales in rows and the lateral line, laid over the flesh like a veil
    o.save(); MX.path(o, F.body); o.clip();
    o.fillStyle = MX.lin(o, 0, -52, 0, 40, [[0, 'rgba(70,80,70,0.45)'], [0.3, 'rgba(190,196,186,0.15)'], [0.7, 'rgba(230,232,226,0.08)'], [1, 'rgba(250,250,245,0.35)']]); o.fillRect(-130, -55, 240, 100);
    // a carp's big round scales in overlapping rows: the free edge of each is pale and catches the light, its
    // pigmented base shows as a darker crescent, so the whole flank carries a fine net pattern
    for (let row = 0; row < 16; row++) for (let x = 100 - (row % 2) * 4.5; x > -84; x -= 9) {
      const y = -50 + row * 6.2, back = Math.max(0, 1 - (y + 50) / 50);
      o.strokeStyle = `rgba(70,60,30,${(0.12 + back * 0.2).toFixed(2)})`; o.lineWidth = 1.4; o.beginPath(); o.arc(x - 1.2, y, 4.6, -1.2, 1.2); o.stroke();
      o.strokeStyle = `rgba(250,236,190,${(0.16 + back * 0.12).toFixed(2)})`; o.lineWidth = 0.5; o.beginPath(); o.arc(x, y, 5, -1.1, 1.1); o.stroke();
    }
    for (let x = -78; x < 98; x += 3.6) { o.fillStyle = 'rgba(60,70,60,0.5)'; o.beginPath(); o.arc(x, -6 + (x + 78) * 0.04, 0.6, 0, TAU); o.fill(); }
    o.restore();
    F.fin(o, [[-78, 18], [-60, 26], [-44, 40], [-56, 42], [-74, 32]], '#D8987A', [-76, 22]);
    o.strokeStyle = 'rgba(70,60,50,0.8)'; o.lineWidth = 0.8; MX.path(o, F.body); o.stroke();
    MX.vignette(o, 0.1); MX.grain(o, 0.03);
    MX.scaleBar(o, 25, '2 cm');
  },
});

// ================================================================ ×5 frog seen from below, skin made see-through
// spots: skin with its blood vessels (-42,40) · lung (30,-2) · heart (0,-18)
plate('frog', {
  still(o, st) {
    const R = MX.rng(181);
    MX.field(o, '#E8ECE2', '#CCD4C2', 18, 0.01, 50);
    const skin = '#EAE0BC', dorsal = '#7F9A52';
    // a limb seen from below: the pale underside, the green back and its dark crossbars showing at the edges,
    // a soft highlight along the round of the muscle
    const limb = (pts, w0, w1) => {
      MX.taper(o, pts, w0 + 3, w1 + 2.4, U.shade(dorsal, -0.2), 'rgba(40,50,20,0.7)');
      for (let k = 1; k < 6; k++) { const [x, y] = MX.along(pts, k / 6); o.fillStyle = 'rgba(40,46,20,0.5)'; o.beginPath(); o.ellipse(x, y, (w0 + (w1 - w0) * k / 6) * 0.6, 1.6, Math.atan2(pts[2][1] - pts[0][1], pts[2][0] - pts[0][0]) + 1.4, 0, TAU); o.fill(); }
      MX.taper(o, pts, w0, w1, skin);
      MX.line(o, pts.map(([x, y]) => [x - 1, y - w0 * 0.18]), 'rgba(255,252,236,0.45)', Math.max(1, w0 * 0.2));
      MX.line(o, pts.map(([x, y]) => [x + 0.6, y + w0 * 0.3]), 'rgba(160,140,90,0.3)', Math.max(1, w0 * 0.2));
    };
    const toes = (x, y, a, n, l) => { for (let i = 0; i < n; i++) { const b = a + (i - (n - 1) / 2) * 0.32; MX.taper(o, [[x, y], [x + Math.cos(b) * l * 0.5, y + Math.sin(b) * l * 0.5], [x + Math.cos(b) * l, y + Math.sin(b) * l]], 2.4, 1.2, skin, 'rgba(90,80,50,0.6)'); MX.ball(o, x + Math.cos(b) * l, y + Math.sin(b) * l, 1.3, '#F2E8C8', 0.3, 0.2); } };
    // legs
    for (const s of [-1, 1]) {
      limb([[s * 38, 62], [s * 70, 70], [s * 94, 80]], 20, 12);
      limb([[s * 94, 80], [s * 80, 98], [s * 58, 112]], 11, 8);
      limb([[s * 58, 112], [s * 80, 122], [s * 104, 130]], 8, 5);
      o.fillStyle = 'rgba(200,190,150,0.6)'; o.beginPath(); o.moveTo(s * 100, 128); o.lineTo(s * 128, 118); o.lineTo(s * 130, 138); o.lineTo(s * 112, 141); o.closePath(); o.fill();
      toes(s * 104, 130, s > 0 ? -0.3 : Math.PI + 0.3, 5, 22);
      limb([[s * 40, -30], [s * 66, -18], [s * 84, -2]], 12, 8);
      limb([[s * 84, -2], [s * 88, 12], [s * 88, 24]], 8, 6);
      toes(s * 88, 24, Math.PI / 2 - s * 0.4, 4, 12);
    }
    // head and body
    const bodyP = MX.blob(0, 8, 56, 66, { seed: 2, wob: 0.03, n: 40 }), head = MX.blob(0, -64, 50, 30, { seed: 3, wob: 0.03, n: 30 });
    MX.fill(o, head, U.shade(dorsal, -0.15)); MX.fill(o, MX.blob(0, -62, 47, 27, { seed: 3, wob: 0.03, n: 30 }), MX.lit(o, 0, -62, 47, skin, 0.3, 0.3));
    MX.fill(o, bodyP, U.shade(dorsal, -0.15)); MX.fill(o, MX.blob(0, 8, 53, 63, { seed: 2, wob: 0.03, n: 40 }), MX.lit(o, 0, 8, 63, skin, 0.3, 0.35));
    // the belly skin is granular: tiny rounded bumps, each with its own glint, and faint grey speckling on the throat
    for (let k = 0; k < 700; k++) {
      const x = -52 + R() * 104, y = -88 + R() * 160;
      if (!(((x / 50) ** 2 + ((y - 8) / 60) ** 2 < 1) || ((x / 46) ** 2 + ((y + 62) / 26) ** 2 < 1))) continue;
      const r = 0.5 + R() * 0.8; o.fillStyle = 'rgba(150,130,80,0.3)'; o.beginPath(); o.arc(x + 0.3, y + 0.3, r, 0, TAU); o.fill(); o.fillStyle = 'rgba(255,252,236,0.5)'; o.beginPath(); o.arc(x - r * 0.3, y - r * 0.3, r * 0.45, 0, TAU); o.fill();
    }
    MX.dots(o, R, 90, [-44, -86, 88, 44], 0.4, 1.1, 'rgba(110,106,90,0.35)', (x, y) => (x / 46) ** 2 + ((y + 62) / 26) ** 2 < 1);
    // the skin breathes: a dense net of capillaries just under its surface
    o.save(); MX.path(o, MX.blob(0, 8, 53, 63, { seed: 2, wob: 0.03, n: 40 })); o.clip();
    for (let i = 0; i < 40; i++) { const s = R() < 0.5 ? -1 : 1; MX.line(o, MX.strand(R, s * (38 + R() * 14), -30 + R() * 90, R() * TAU, 20 + R() * 20, 2, 1.1), 'rgba(196,60,70,0.55)', 0.35); }
    o.restore();
    // organs seen through the belly
    const win = MX.blob(0, 8, 42, 50, { seed: 5, wob: 0.03, n: 36 });
    MX.fill(o, win, 'rgba(236,212,196,0.9)');
    o.save(); MX.path(o, win); o.clip();
    // lungs: thin-walled sacs with a honeycomb of pockets and blood vessels
    for (const s of [-1, 1]) {
      const lx = s * 28, lung = MX.blob(lx, -2, 12, 24, { seed: s + 9, wob: 0.08, n: 24 });
      MX.fill(o, lung, MX.lit(o, lx, -2, 24, '#E8A0A0', 0.35, 0.3));
      o.save(); MX.path(o, lung); o.clip();
      const cells = MX.voronoi(MX.scatter(R, 60, 4, [lx - 13, -27, 26, 50]), U.rectPts(lx - 14, -28, 28, 52));
      for (const c of cells) { o.strokeStyle = 'rgba(160,60,70,0.45)'; o.lineWidth = 0.35; o.beginPath(); U.poly(o, c, true); o.stroke(); }
      MX.line(o, [[lx - s * 4, -24], [lx, -6], [lx + s * 2, 16]], 'rgba(90,40,120,0.5)', 0.8);
      o.restore();
      o.strokeStyle = 'rgba(140,60,60,0.6)'; o.lineWidth = 0.5; MX.path(o, lung); o.stroke();
    }
    // liver lobes, gall bladder, stomach, gut, fat bodies
    for (const [x, y, rx, ry, rot] of [[-20, 14, 18, 11, 0.3], [20, 14, 18, 11, -0.3], [0, 20, 12, 9, 0]]) MX.fill(o, MX.blob(x, y, rx, ry, { seed: x + 40, wob: 0.1, rot }), MX.lit(o, x, y, rx, '#7A2E26', 0.25, 0.3));
    MX.ball(o, 6, 12, 3.2, '#5E8A3A', 0.4, 0.3);
    MX.tube(o, [[-10, 24], [-26, 30], [-24, 42], [-8, 44]], 7, '#E8C4B4');
    MX.tube(o, [[-8, 44], [10, 40], [18, 50], [2, 56], [-10, 52], [0, 62], [0, 70]], 4.4, '#E6C8A8');
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) MX.taper(o, [[s * 20, 42], [s * (24 + k * 3), 52], [s * (22 + k * 4), 62]], 3, 1.6, '#F0D878', 'rgba(160,130,40,0.6)');
    // heart: two dark atria above a single muscular ventricle, the arteries leaving through the conus
    for (const s of [-1, 1]) MX.taper(o, [[s * 2, -30], [s * 10, -38], [s * 20, -44]], 3.2, 2, '#F0D8D8', 'rgba(140,90,90,0.6)');
    MX.ball(o, -6, -28, 6.5, '#6E2438', 0.25, 0.3); MX.ball(o, 6, -28, 6.5, '#6E2438', 0.25, 0.3);
    o.fillStyle = MX.lit(o, 0, -18, 10, '#A02834', 0.3, 0.35); o.beginPath(); o.moveTo(-9, -24); o.quadraticCurveTo(0, -30, 9, -24); o.quadraticCurveTo(8, -12, 0, -5); o.quadraticCurveTo(-8, -12, -9, -24); o.fill();
    o.strokeStyle = 'rgba(80,20,30,0.7)'; o.lineWidth = 0.5; o.stroke();
    MX.taper(o, [[2, -24], [4, -30], [2, -34]], 3.4, 3, '#E8C0C0', 'rgba(140,90,90,0.6)');
    o.restore();
    o.strokeStyle = 'rgba(140,110,90,0.5)'; o.lineWidth = 0.6; MX.path(o, win); o.stroke();
    // eyes bulge at the sides of the head, the wide mouth in front
    for (const s of [-1, 1]) { o.fillStyle = U.shade(dorsal, -0.2); o.beginPath(); o.ellipse(s * 34, -74, 11, 9, 0, 0, TAU); o.fill(); MX.ball(o, s * 34, -75, 7, '#C8A838', 0.4, 0.4); o.fillStyle = '#101010'; o.beginPath(); o.ellipse(s * 34, -75, 4.5, 2.4, 0, 0, TAU); o.fill(); }
    MX.line(o, [[-40, -84], [0, -94], [40, -84]], 'rgba(90,80,50,0.6)', 0.9);
    MX.vignette(o, 0.1); MX.grain(o, 0.03);
    MX.scaleBar(o, 28, '1 cm');
  },
});

// ================================================================ ×20 honeybee worker (side view, wings raised)
// spots: compound eye (-84,-18) · pollen basket (22,60) · honey stomach (30,0) · wings (20,-78)
plate('bee', {
  still(o, st) {
    const R = MX.rng(191), cut = '#2A2018', hairC = ['#C89A5A', '#A87838', '#D8B878', '#8A6A3A'];
    MX.field(o, '#EDEBE2', '#D2CEC0', 19, 0.01, 50);
    const hairs = (cx, cy, rx, ry, n, len, cols, rot = 0) => {
      for (let i = 0; i < n; i++) {
        const a = R() * TAU, d = Math.sqrt(R()), x = cx + Math.cos(a) * rx * d * Math.cos(rot) - Math.sin(a) * ry * d * Math.sin(rot), y = cy + Math.cos(a) * rx * d * Math.sin(rot) + Math.sin(a) * ry * d * Math.cos(rot);
        const b = Math.atan2(y - cy, x - cx) + (R() - 0.5) * 0.8, l = len * (0.6 + R() * 0.6);
        o.strokeStyle = U.pick(cols, R()); o.lineWidth = 0.35; o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + Math.cos(b) * l * 0.6, y + Math.sin(b) * l * 0.6 - 0.8, x + Math.cos(b) * l, y + Math.sin(b) * l); o.stroke();
      }
    };
    const leg = (pts, w0, w1) => { MX.taper(o, pts, w0, w1, cut, 'rgba(0,0,0,0.5)'); o.strokeStyle = 'rgba(200,170,120,0.6)'; o.lineWidth = 0.3; for (let k = 0; k < 16; k++) { const [x, y, a] = MX.along(pts, R()); o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a + 1.2) * 3, y + Math.sin(a + 1.2) * 3); o.stroke(); } };
    // far legs, in shadow
    o.globalAlpha = 0.55; leg([[-54, 14], [-58, 44], [-64, 70], [-70, 88]], 3, 1.4); leg([[-30, 18], [-20, 46], [-12, 72], [-10, 92]], 3, 1.4); o.globalAlpha = 1;
    // wings: clear membranes stiffened by brown veins (hind wing under the fore wing)
    const hw = [[-24, -34], [10, -46], [50, -70], [66, -74], [62, -64], [30, -46], [-4, -34]];
    const fw = [[-34, -36], [-10, -58], [30, -90], [70, -114], [94, -118], [100, -108], [80, -86], [40, -58], [0, -40]];
    for (const w of [hw, fw]) {
      o.fillStyle = MX.lin(o, -30, -40, 100, -118, [[0, 'rgba(210,220,230,0.55)'], [0.5, 'rgba(230,236,244,0.35)'], [0.8, 'rgba(236,220,240,0.35)'], [1, 'rgba(220,236,230,0.4)']]);
      o.beginPath(); MX.curve(o, w); o.fill(); o.strokeStyle = 'rgba(90,70,40,0.75)'; o.lineWidth = 0.55; o.stroke();
    }
    for (const v of [[[-34, -36], [0, -62], [40, -94], [74, -114]], [[-30, -38], [10, -58], [44, -82], [62, -92], [80, -104]], [[-24, -38], [20, -56], [44, -70], [60, -80]], [[-20, -40], [24, -52], [48, -62]], [[44, -82], [48, -70], [44, -62]], [[62, -92], [64, -80], [58, -72]], [[80, -104], [86, -96], [82, -88]], [[-18, -36], [14, -46], [40, -62], [58, -70]]]) MX.line(o, v, 'rgba(110,80,40,0.8)', 0.7);
    // abdomen: amber and dark bands with pale bands of hair, the sting at the tip
    o.save(); o.translate(48, 4); o.rotate(0.18);
    const abd = MX.blob(0, 0, 50, 30, { seed: 6, wob: 0.02, n: 40 });
    MX.fill(o, abd, MX.lit(o, 0, 0, 50, '#C8862A', 0.3, 0.45));
    o.save(); MX.path(o, abd); o.clip();
    for (let k = 0; k < 5; k++) { const x = -32 + k * 17; o.fillStyle = MX.lin(o, x, 0, x + 12, 0, [[0, 'rgba(58,36,18,0)'], [0.4, 'rgba(58,36,18,0.9)'], [1, 'rgba(58,36,18,0.95)']]); o.beginPath(); o.ellipse(x + 8, 0, 8, 34, 0, 0, TAU); o.fill(); o.strokeStyle = 'rgba(240,220,170,0.35)'; o.lineWidth = 1.6; o.beginPath(); o.ellipse(x - 1, 0, 3, 32, 0, -1.4, 1.4); o.stroke(); }
    o.restore();
    o.strokeStyle = 'rgba(30,20,10,0.7)'; o.lineWidth = 0.6; MX.path(o, abd); o.stroke();
    o.restore();
    hairs(48, 4, 46, 26, 220, 2.6, ['#E6D0A0', '#C8A870'], 0.18);
    MX.taper(o, [[96, 14], [102, 16], [108, 18]], 2, 0.2, '#3A2A18');
    // a window into the abdomen: the honey stomach, swollen with nectar
    o.save(); o.beginPath(); o.ellipse(30, 0, 17, 12, 0.18, 0, TAU); o.clip();
    o.fillStyle = '#6A4020'; o.fillRect(10, -14, 40, 28);
    o.fillStyle = MX.rad(o, 26, -3, 1, 13, [[0, '#FFE58A'], [0.6, '#F0B838'], [1, '#B87818']]); o.beginPath(); o.ellipse(30, 0, 13, 9, 0.18, 0, TAU); o.fill();
    o.fillStyle = 'rgba(255,255,240,0.7)'; o.beginPath(); o.ellipse(25, -4, 4, 1.6, 0.18, 0, TAU); o.fill();
    o.restore();
    o.strokeStyle = 'rgba(250,240,220,0.9)'; o.lineWidth = 0.8; o.setLineDash([2, 1.5]); o.beginPath(); o.ellipse(30, 0, 17, 12, 0.18, 0, TAU); o.stroke(); o.setLineDash([]);
    // waist and thorax, thick with branched golden hairs
    MX.ball(o, -8, -2, 5, '#3A2A1A', 0.3, 0.3);
    MX.fill(o, MX.blob(-40, -8, 32, 30, { seed: 7, wob: 0.03 }), MX.lit(o, -40, -8, 32, '#4A3620', 0.3, 0.4));
    hairs(-40, -8, 34, 32, 700, 4.5, hairC);
    // head with its huge compound eye, three small eyes on top, elbowed antenna and folded tongue
    MX.fill(o, MX.blob(-88, -14, 17, 24, { seed: 8, wob: 0.03, rot: 0.15 }), MX.lit(o, -88, -14, 24, '#3A2A1A', 0.25, 0.3));
    hairs(-90, -10, 16, 22, 160, 3, ['#C8A870', '#A88858']);
    o.save(); o.beginPath(); o.ellipse(-84, -18, 10, 18, 0.15, 0, TAU); o.clip();
    o.fillStyle = MX.rad(o, -88, -24, 1, 20, [[0, '#6A6258'], [1, '#1E1A16']]); o.fillRect(-96, -38, 24, 40);
    for (let y = -38; y < 2; y += 1.9) for (let x = -96 + (Math.round(y * 10) % 2 ? 1.1 : 0); x < -72; x += 2.2) { o.fillStyle = 'rgba(255,255,255,0.12)'; o.beginPath(); o.arc(x, y, 0.8, 0, TAU); o.fill(); o.strokeStyle = 'rgba(0,0,0,0.4)'; o.lineWidth = 0.25; o.stroke(); }
    o.fillStyle = 'rgba(255,255,255,0.35)'; o.beginPath(); o.ellipse(-87, -26, 3, 6, 0.3, 0, TAU); o.fill();
    o.restore();
    for (const [x, y] of [[-82, -38], [-76, -37], [-86, -36]]) MX.ball(o, x, y, 1.3, '#2A241E', 0.7, 0.2);
    MX.taper(o, [[-100, -24], [-106, -36], [-110, -48]], 2.2, 1.8, cut);
    const flag = [[-110, -48], [-118, -46], [-126, -40], [-132, -30], [-134, -20]];
    MX.taper(o, flag, 1.8, 1.4, cut);
    for (let k = 1; k < 11; k++) { const [x, y, a] = MX.along(flag, k / 11); o.strokeStyle = 'rgba(160,140,110,0.6)'; o.lineWidth = 0.3; o.beginPath(); o.moveTo(x + Math.cos(a + 1.57), y + Math.sin(a + 1.57)); o.lineTo(x - Math.cos(a + 1.57), y - Math.sin(a + 1.57)); o.stroke(); }
    MX.fill(o, [[-104, 2], [-110, 8], [-104, 12], [-98, 8]], '#5A3A1A');
    MX.taper(o, [[-98, 8], [-92, 14], [-82, 16], [-72, 14]], 2.2, 1.2, '#5A4428');
    // near legs; the hind leg's flattened shin carries a load of pollen, held by a fringe of long hairs
    leg([[-60, 16], [-72, 40], [-76, 64], [-86, 82]], 3.6, 1.6);
    leg([[-40, 20], [-36, 48], [-30, 74], [-34, 94]], 3.6, 1.6);
    leg([[-20, 18], [0, 44]], 4.6, 4);
    o.fillStyle = cut; o.beginPath(); o.moveTo(-2, 40); o.lineTo(34, 64); o.lineTo(36, 74); o.lineTo(0, 50); o.closePath(); o.fill();
    leg([[36, 72], [48, 84], [54, 90]], 4.2, 3.2); leg([[54, 90], [60, 98], [66, 104]], 2, 1.2);
    const pel = MX.blob(22, 60, 11.5, 9, { seed: 12, wob: 0.14, n: 18, rot: 0.6 });
    MX.fill(o, pel, MX.lit(o, 22, 60, 12, '#E89A20', 0.4, 0.35));
    o.save(); MX.path(o, pel); o.clip(); MX.dots(o, R, 140, [10, 49, 24, 22], 0.4, 0.9, 'rgba(150,80,10,0.4)'); MX.dots(o, R, 60, [10, 49, 24, 22], 0.4, 0.8, 'rgba(255,220,140,0.5)'); o.restore();
    o.strokeStyle = 'rgba(200,170,120,0.7)'; o.lineWidth = 0.35;
    for (let k = 0; k < 18; k++) { const t = k / 17, x = -2 + 36 * t, y = 40 + 24 * t, s = k % 2 ? -1 : 1; o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + s * 3 + 6, y - 8, x + 10, y + (s > 0 ? -14 : 12)); o.stroke(); }
    MX.vignette(o, 0.1); MX.grain(o, 0.03);
    MX.scaleBar(o, 31, '2 mm');
  },
});
