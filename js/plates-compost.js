'use strict';
// Compost (case "kompost"): a spade-cut face through the farm's heap beside Sevim's slumped one, the small animals and
// fungi on a rotting leaf, and the microbes from the hottest part of the heap under phase contrast.
// Spots, in plate units, live in COMPOSTP so lens.js SPECS.compost points at the right thing.
const COMPOSTP = {
  heap: { slime: [-92, 30], actino: [40, -22], worm: [70, 86], humus: [-20, 112] },
  life: { springtail: [-62, -44], mite: [74, -64], mycelium: [22, 30], nematode: [-84, 84] },
  micro: { thermophile: [-52, -34], chain: [62, 46], bacteria: [-74, 92] },

  // a straw, a grass blade or a strip of leaf lying in the heap
  bit(o, R, x, y, len, a, col, w) {
    const p = [[x, y], [x + Math.cos(a) * len * 0.5 + (R() - 0.5) * 3, y + Math.sin(a) * len * 0.5 + (R() - 0.5) * 3], [x + Math.cos(a) * len, y + Math.sin(a) * len]];
    MX.line(o, p, col, w);
  },
  // a red compost worm: a ringed, tapering tube with a paler saddle a third of the way along
  worm(o, R, pts, w) {
    MX.taper(o, pts, w, w * 0.6, '#B04A4A', 'rgba(60,20,20,0.6)');
    for (let t = 0.04; t < 0.98; t += 0.035) { const [x, y, a] = MX.along(pts, t); o.strokeStyle = 'rgba(90,30,30,0.45)'; o.lineWidth = 0.4; o.beginPath(); o.moveTo(x - Math.sin(a) * w * 0.45, y + Math.cos(a) * w * 0.45); o.lineTo(x + Math.sin(a) * w * 0.45, y - Math.cos(a) * w * 0.45); o.stroke(); }
    for (let t = 0.28; t < 0.36; t += 0.01) { const [x, y] = MX.along(pts, t); o.fillStyle = 'rgba(230,150,140,0.5)'; o.beginPath(); o.arc(x, y, w * 0.48, 0, TAU); o.fill(); }
    MX.line(o, pts.map(([x, y]) => [x - w * 0.18, y - w * 0.22]), 'rgba(255,220,210,0.5)', w * 0.18);
  },
  // a springtail: a long soft body, six short legs, long antennae, and the folded jumping fork under its tail
  springtail(o, x, y, a, s) {
    o.save(); o.translate(x, y); o.rotate(a); o.scale(s, s);
    o.strokeStyle = '#5A5A6A'; o.lineWidth = 0.9; o.lineCap = 'round';
    for (const k of [-1, 0, 1]) for (const sd of [-1, 1]) { o.beginPath(); o.moveTo(k * 4, sd * 2.5); o.lineTo(k * 4 + 2, sd * 6); o.lineTo(k * 4 + 3.5, sd * 7.5); o.stroke(); }
    for (const sd of [-1, 1]) { o.beginPath(); o.moveTo(9, sd * 1.4); o.quadraticCurveTo(14, sd * 4, 18, sd * 7); o.stroke(); }
    o.fillStyle = MX.lin(o, 0, -4, 0, 4, [[0, '#A8A8BC'], [0.5, '#7A7A92'], [1, '#4A4A5E']]);
    o.beginPath(); o.ellipse(0, 0, 11, 3.6, 0, 0, TAU); o.fill();
    o.beginPath(); o.ellipse(9.5, 0, 3, 2.8, 0, 0, TAU); o.fill();
    o.fillStyle = '#1A1A22'; for (const sd of [-1, 1]) { o.beginPath(); o.arc(10.5, sd * 1.6, 0.8, 0, TAU); o.fill(); }
    o.strokeStyle = '#6A6A7E'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(-10, 1.5); o.quadraticCurveTo(-4, 4.5, 2, 3.4); o.stroke();
    o.fillStyle = 'rgba(255,255,255,0.35)'; o.beginPath(); o.ellipse(-2, -1.6, 7, 1, 0, 0, TAU); o.fill();
    o.restore();
  },
  // a mite: a round, glossy brown body and eight legs
  mite(o, x, y, s) {
    o.save(); o.translate(x, y); o.scale(s, s);
    o.strokeStyle = '#6A4020'; o.lineWidth = 0.9; o.lineCap = 'round';
    for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) { const a = (sd > 0 ? 0 : Math.PI) + (k - 1.5) * 0.55 * sd; const b0 = [Math.cos(a) * 5, Math.sin(a) * 5 - 2], kn = [Math.cos(a) * 9, Math.sin(a) * 9 - 4], tp = [Math.cos(a) * 12, Math.sin(a) * 12 + 1]; o.beginPath(); o.moveTo(...b0); o.lineTo(...kn); o.lineTo(...tp); o.stroke(); }
    MX.ball(o, 0, 0, 6.5, '#8A4E22', 0.5, 0.45);
    o.fillStyle = '#6A3A18'; o.beginPath(); o.ellipse(0, -6.4, 2.6, 1.8, 0, 0, TAU); o.fill();
    o.fillStyle = 'rgba(255,240,220,0.8)'; o.beginPath(); o.ellipse(-2, -2.6, 1.6, 0.9, -0.5, 0, TAU); o.fill();
    o.restore();
  },
  // a rod bacterium under phase contrast: dark body with a bright halo; a thermophile carries a phase-bright spore
  rod(o, x, y, a, l, spore) {
    o.save(); o.translate(x, y); o.rotate(a);
    o.strokeStyle = 'rgba(250,250,245,0.55)'; o.lineWidth = 3.6; o.lineCap = 'round'; o.beginPath(); o.moveTo(-l / 2, 0); o.lineTo(l / 2, 0); o.stroke();
    o.strokeStyle = '#3A3E40'; o.lineWidth = 2.4; o.beginPath(); o.moveTo(-l / 2, 0); o.lineTo(l / 2, 0); o.stroke();
    if (spore) { o.fillStyle = '#F4F6EA'; o.beginPath(); o.ellipse(l * 0.28, 0, 1.6, 1.05, 0, 0, TAU); o.fill(); o.strokeStyle = 'rgba(40,40,40,0.8)'; o.lineWidth = 0.3; o.stroke(); }
    o.restore();
  },
};

// ---------------------------------------------------------------- ×1: a spade cut through the heap
plate('heapcut', {
  still(o) {
    const R = MX.rng(811), P = COMPOSTP;
    MX.field(o, '#4A3624', '#2E2016', 31, 0.02, 120);
    // the middle: warm, dark, half-rotted leaves and stalks
    const mid = U.rgb('#6A4A2E');
    MX.tex(o, -141, -80, 282, 150, (x, y) => [mid[0], mid[1], mid[2], U.fbm(x * 0.06, y * 0.06, 4, 5) * 150], 160);
    for (let k = 0; k < 260; k++) { const x = -150 + R() * 300, y = -70 + R() * 130; P.bit(o, R, x, y, 6 + R() * 14, (R() - 0.5) * 1.2, `rgba(${90 + R() * 50 | 0},${60 + R() * 30 | 0},${30 + R() * 20 | 0},0.8)`, 1 + R() * 1.6); }
    // white actinomycete threads, like a dusting of ash, strongest where it is hottest
    for (let k = 0; k < 34; k++) {
      const cx = P.heap.actino[0] + (R() - 0.5) * 150, cy = P.heap.actino[1] + (R() - 0.5) * 70, d = Math.hypot(cx - P.heap.actino[0], (cy - P.heap.actino[1]) * 1.8);
      if (d > 80 || cx < -40) continue;
      for (let j = 0; j < 10; j++) MX.line(o, MX.strand(R, cx, cy, R() * TAU, 6 + R() * 10, 2, 1.2), 'rgba(236,232,220,0.75)', 0.45);
      o.fillStyle = 'rgba(240,236,226,0.35)'; o.beginPath(); o.ellipse(cx, cy, 6 + R() * 5, 3 + R() * 3, R(), 0, TAU); o.fill();
    }
    MX.dots(o, R, 200, [P.heap.actino[0] - 40, P.heap.actino[1] - 20, 80, 40], 0.3, 0.8, 'rgba(244,240,230,0.7)');
    // the top: this week's straw, grass, peel and eggshell
    MX.layer(o, x => {
      for (let k = 0; k < 420; k++) { const g = R() < 0.45; P.bit(x, R, -150 + R() * 300, -141 + R() * 70, 10 + R() * 22, (R() - 0.5) * 0.9, g ? `rgb(${80 + R() * 40 | 0},${130 + R() * 50 | 0},${40 + R() * 30 | 0})` : `rgb(${200 + R() * 40 | 0},${170 + R() * 40 | 0},${90 + R() * 40 | 0})`, 1.2 + R() * 1.4); }
      for (let k = 0; k < 7; k++) { const px = -130 + R() * 260, py = -128 + R() * 50; x.fillStyle = '#E8862A'; x.beginPath(); x.ellipse(px, py, 8 + R() * 5, 3.5, R() * 3, 0, TAU); x.fill(); x.fillStyle = 'rgba(255,240,200,0.6)'; x.beginPath(); x.ellipse(px, py + 1, 6, 1.4, 0, 0, TAU); x.fill(); }
      for (let k = 0; k < 5; k++) { const px = -130 + R() * 260, py = -120 + R() * 40; x.fillStyle = '#F4EEE2'; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 7, py - 3); x.lineTo(px + 9, py + 3); x.lineTo(px + 2, py + 5); x.fill(); x.strokeStyle = 'rgba(120,100,80,0.5)'; x.lineWidth = 0.4; x.stroke(); }
    }, 0.4);
    o.fillStyle = MX.lin(o, 0, -82, 0, -64, [[0, 'rgba(40,28,18,0)'], [1, 'rgba(40,28,18,0.35)']]); o.fillRect(-141, -82, 282, 18);
    // Sevim's side: grass pressed into a slimy, airless mat
    const mat = [[-150, -6], [-100, -12], [-54, -4], [-34, 20], [-44, 58], [-90, 66], [-150, 62]];
    MX.fill(o, mat, MX.lin(o, 0, -10, 0, 66, [[0, '#3E4A22'], [0.5, '#2A3218'], [1, '#1E2412']]));
    o.save(); o.beginPath(); MX.curve(o, mat); o.clip();
    for (let y = -10; y < 70; y += 3 + R() * 2) MX.line(o, [[-150, y], [-100, y + (R() - 0.5) * 3], [-40, y + (R() - 0.5) * 4]], `rgba(${60 + R() * 30 | 0},${80 + R() * 30 | 0},${30 + R() * 20 | 0},0.7)`, 1.2);
    for (let k = 0; k < 40; k++) { const x = -145 + R() * 100, y = -8 + R() * 70; o.strokeStyle = 'rgba(230,240,210,0.45)'; o.lineWidth = 0.6; o.beginPath(); o.moveTo(x, y); o.lineTo(x + 4 + R() * 6, y + (R() - 0.5)); o.stroke(); }
    o.restore();
    for (let k = 0; k < 6; k++) { const x = -140 + R() * 90, y = 58 + R() * 8; o.fillStyle = 'rgba(40,50,20,0.7)'; o.beginPath(); o.ellipse(x, y + 4, 1.8, 4, 0, 0, TAU); o.fill(); o.fillStyle = 'rgba(220,240,200,0.5)'; o.beginPath(); o.arc(x - 0.6, y + 2.5, 0.6, 0, TAU); o.fill(); }
    // the bottom: dark crumbly humus, finished compost
    const hum = U.rgb('#241810');
    MX.tex(o, -141, 66, 282, 76, (x, y) => [hum[0], hum[1], hum[2], 150 + U.fbm(x * 0.1, y * 0.1, 3, 9) * 100], 140);
    for (let k = 0; k < 340; k++) { const x = -145 + R() * 290, y = 70 + R() * 72, r = 1.2 + R() * 2.6; o.fillStyle = `rgba(${50 + R() * 30 | 0},${34 + R() * 20 | 0},${20 + R() * 12 | 0},0.95)`; o.beginPath(); o.ellipse(x, y, r, r * 0.8, R() * 3, 0, TAU); o.fill(); o.fillStyle = 'rgba(160,120,80,0.25)'; o.beginPath(); o.arc(x - r * 0.3, y - r * 0.3, r * 0.4, 0, TAU); o.fill(); }
    P.worm(o, R, [[20, 100], [44, 88], [70, 86], [96, 92], [118, 84]], 5.2);
    P.worm(o, R, [[-120, 118], [-100, 108], [-78, 112], [-60, 124]], 4.2);
    P.worm(o, R, [[96, 128], [110, 118], [130, 122]], 3.6);
    // steam rising off the warm middle
    MX.layer(o, x => { for (let k = 0; k < 6; k++) { const sx = -10 + k * 26, sy = -100; x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 6; x.beginPath(); x.moveTo(sx, sy + 20); x.bezierCurveTo(sx - 8, sy, sx + 10, sy - 20, sx, sy - 40); x.stroke(); } }, 5, 0.5);
    MX.soften(o, 0.35, 0.3);
    MX.vignette(o, 0.2); MX.grain(o, 0.05);
    MX.scaleBar(o, 40, '5 cm', true);
  },
});

// ---------------------------------------------------------------- ×40: life on a rotting leaf
plate('compostlife', {
  still(o) {
    const R = MX.rng(812), P = COMPOSTP, L = P.life;
    MX.field(o, '#3A2A1C', '#1E140C', 33, 0.02, 110);
    for (let k = 0; k < 90; k++) { const x = -150 + R() * 300, y = -150 + R() * 300; P.bit(o, R, x, y, 10 + R() * 30, R() * TAU, `rgba(${80 + R() * 50 | 0},${56 + R() * 30 | 0},${30 + R() * 20 | 0},0.7)`, 2 + R() * 3); }
    // a skeletonised leaf fragment: the soft tissue eaten away between the veins
    const leaf = [[-130, -90], [-40, -120], [80, -110], [136, -40], [120, 60], [40, 110], [-70, 96], [-136, 20]];
    MX.fill(o, leaf, MX.lin(o, -130, -120, 130, 110, [[0, '#8A5A2E'], [0.5, '#744A24'], [1, '#5A3A1C']]));
    o.save(); o.beginPath(); MX.curve(o, leaf); o.clip();
    MX.line(o, [[-140, 60], [0, -10], [140, -80]], '#A67A48', 4);
    for (let k = 0; k < 9; k++) { const t = 0.1 + k * 0.1, [x, y] = MX.along([[-140, 60], [0, -10], [140, -80]], t); for (const s of [-1, 1]) MX.line(o, [[x, y], [x + 30 * s, y + 40 * s + 10], [x + 50 * s, y + 70 * s]], '#9A6E3E', 1.6); }
    for (let k = 0; k < 16; k++) { const x = -110 + R() * 220, y = -90 + R() * 180; o.fillStyle = 'rgba(30,20,12,0.85)'; o.beginPath(); MX.curve(o, MX.blob(x, y, 5 + R() * 9, 4 + R() * 7, { seed: k + 3, wob: 0.3 })); o.fill(); }
    o.restore();
    // fungal mycelium: a white cottony web spreading over one side
    for (let k = 0; k < 90; k++) { const a = R() * TAU, d = R() * 70; MX.line(o, MX.strand(R, L.mycelium[0] + Math.cos(a) * d, L.mycelium[1] + Math.sin(a) * d * 0.7, R() * TAU, 20 + R() * 30, 3, 0.7), 'rgba(246,244,236,0.55)', 0.5); }
    MX.layer(o, x => { x.fillStyle = 'rgba(250,248,240,0.4)'; x.beginPath(); x.ellipse(L.mycelium[0], L.mycelium[1], 46, 30, 0.3, 0, TAU); x.fill(); }, 4);
    // a nematode: a clear, thread-thin worm
    { const p = MX.strand(R, L.nematode[0] - 30, L.nematode[1] - 10, 0.4, 70, 4, 0.9); MX.line(o, p, 'rgba(240,236,220,0.55)', 2.6); MX.line(o, p, 'rgba(255,255,250,0.8)', 0.6); }
    P.springtail(o, L.springtail[0], L.springtail[1], -0.4, 2.3);
    P.springtail(o, 90, 90, 2.4, 1.6);
    P.mite(o, L.mite[0], L.mite[1], 1.7);
    P.mite(o, -20, -96, 1.1);
    MX.soften(o, 0.3, 0.25);
    MX.vignette(o, 0.28); MX.grain(o, 0.04);
    MX.scaleBar(o, 56, '1 mm', true);
  },
});

// ---------------------------------------------------------------- ×1000: microbes from the hottest part of the heap (phase contrast)
plate('compostmicro', {
  still(o) {
    const R = MX.rng(813), P = COMPOSTP, M = P.micro;
    o.fillStyle = MX.rad(o, 0, 0, 20, 200, [[0, '#B8BCB4'], [1, '#8A8E86']]); o.fillRect(-141, -141, 282, 282);
    MX.dots(o, R, 600, [-141, -141, 282, 282], 0.3, 0.9, 'rgba(90,92,86,0.35)');
    // bits of plant cell wall the microbes are feeding on
    for (let k = 0; k < 6; k++) { const x = -120 + R() * 240, y = -120 + R() * 240; o.strokeStyle = 'rgba(70,72,64,0.5)'; o.lineWidth = 1.2; o.beginPath(); MX.curve(o, MX.blob(x, y, 14 + R() * 12, 8 + R() * 8, { seed: k, wob: 0.3 })); o.stroke(); }
    // actinomycetes: branched threads ending in chains of spores
    const tree = (x, y, a, len, depth) => {
      const p = MX.strand(R, x, y, a, len, 3, 0.25);
      o.strokeStyle = 'rgba(250,250,244,0.5)'; o.lineWidth = 2.2; o.beginPath(); U.poly(o, p, false); o.stroke();
      o.strokeStyle = '#3E4240'; o.lineWidth = 1; o.beginPath(); U.poly(o, p, false); o.stroke();
      const [ex, ey] = p[p.length - 1];
      if (depth > 0) { for (const s of [-0.6, 0.55]) { const [bx, by, ba] = MX.along(p, 0.45 + R() * 0.3); tree(bx, by, ba + s, len * 0.6, depth - 1); } }
      else { const ea = Math.atan2(ey - p[p.length - 2][1], ex - p[p.length - 2][0]); for (let k = 1; k <= 7; k++) { const cx = ex + Math.cos(ea + Math.sin(k) * 0.3) * k * 2.6, cy = ey + Math.sin(ea + Math.sin(k) * 0.3) * k * 2.6; o.fillStyle = '#F2F4EA'; o.beginPath(); o.arc(cx, cy, 1.3, 0, TAU); o.fill(); o.strokeStyle = '#3A3E3C'; o.lineWidth = 0.5; o.stroke(); } }
    };
    tree(140, 120, -2.5, 70, 2); tree(-150, -110, 0.7, 60, 1); tree(M.chain[0] - 40, M.chain[1] + 40, -0.8, 40, 0);
    // heat-loving rods, many carrying a bright spore; small rods and round cells of other kinds
    for (let k = 0; k < 40; k++) P.rod(o, -141 + R() * 282, -141 + R() * 282, R() * TAU, 7 + R() * 5, R() < 0.6);
    P.rod(o, M.thermophile[0], M.thermophile[1], 0.5, 11, true);
    P.rod(o, M.thermophile[0] + 12, M.thermophile[1] + 7, 0.5, 10, false);
    for (let k = 0; k < 60; k++) { const x = -141 + R() * 282, y = -141 + R() * 282; o.fillStyle = 'rgba(250,250,244,0.5)'; o.beginPath(); o.arc(x, y, 1.9, 0, TAU); o.fill(); o.fillStyle = '#43474A'; o.beginPath(); o.arc(x, y, 1.2, 0, TAU); o.fill(); }
    for (let k = 0; k < 14; k++) { const x = M.bacteria[0] + (R() - 0.5) * 50, y = M.bacteria[1] + (R() - 0.5) * 36; P.rod(o, x, y, R() * TAU, 4 + R() * 2, false); }
    MX.soften(o, 0.4, 0.45);
    MX.vignette(o, 0.22, '10,10,10'); MX.grain(o, 0.07);
    MX.scaleBar(o, 40, '5 µm');
  },
});
