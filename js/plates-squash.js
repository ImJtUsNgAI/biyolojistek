'use strict';
// The crossed squash (case "kabak"): Grandma's heirloom squash patch with the neighbour's gourd fence behind it,
// the two kinds of squash flower cut lengthwise, and pollen grains germinating on a stigma.
// Spots, in plate units, live in SQUASH so the lens (lens.js SPECS.squash) points at the right thing.
const SQUASH = {
  patch: { male: [-62, -40], female: [74, 24], bee: [24, -34], fence: [-10, -112] },
  flowers: { anther: [-72, -38], stigma: [76, -50], nectary: [76, 6], ovules: [68, 66], ovary: [110, 96] },
  pollen: { grain: [-50, -40], tube: [24, 34], papillae: [-88, 96], cross: [104, -98] },

  // an open squash flower seen from above and in front: five fused petals flaring to points, a dark orange throat
  bloom(o, R, cx, cy, r, tilt, rot) {
    o.save(); o.translate(cx, cy); o.rotate(rot); o.scale(1, tilt);
    o.fillStyle = 'rgba(40,30,10,0.22)'; o.beginPath(); o.arc(r * 0.06, r * 0.1, r * 1.02, 0, TAU); o.fill();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * TAU / 5 + (R() - 0.5) * 0.14, w = 1 + (R() - 0.5) * 0.12;
      const P = (da, k) => [Math.cos(a + da * w) * r * k, Math.sin(a + da * w) * r * k];
      const pts = [P(-0.64, 0.12), P(-0.58, 0.52), P(-0.4, 0.84), P(-0.16, 0.96), P(0, 1.08), P(0.16, 0.96), P(0.4, 0.84), P(0.58, 0.52), P(0.64, 0.12)];
      MX.fill(o, pts, MX.rad(o, 0, 0, r * 0.08, r * 1.05, [[0, '#C8620C'], [0.3, '#EC9A1C'], [0.72, '#F7C636'], [1, '#F4DC78']]));
      o.save(); MX.path(o, pts); o.clip();
      o.strokeStyle = 'rgba(196,104,18,0.34)'; o.lineWidth = 0.45;
      for (let k = -3; k <= 3; k++) { const b = a + k * 0.1; o.beginPath(); o.moveTo(Math.cos(a) * r * 0.14, Math.sin(a) * r * 0.14); o.quadraticCurveTo(Math.cos(b) * r * 0.55, Math.sin(b) * r * 0.55, Math.cos(b + k * 0.04) * r * 1.02, Math.sin(b + k * 0.04) * r * 1.02); o.stroke(); }
      o.strokeStyle = 'rgba(255,244,196,0.55)'; o.lineWidth = 0.9; o.beginPath(); o.moveTo(Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2); o.lineTo(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98); o.stroke();
      // the crinkled edge catches the light
      o.fillStyle = 'rgba(255,250,220,0.3)'; o.beginPath(); o.arc(Math.cos(a - 0.3) * r * 0.8, Math.sin(a - 0.3) * r * 0.8, r * 0.14, 0, TAU); o.fill();
      o.restore();
      o.strokeStyle = 'rgba(160,90,16,0.55)'; o.lineWidth = 0.5; MX.path(o, pts); o.stroke();
    }
    o.fillStyle = MX.rad(o, 0, 0, 0, r * 0.46, [[0, 'rgba(120,44,6,0.92)'], [0.55, 'rgba(206,104,18,0.6)'], [1, 'rgba(230,140,30,0)']]);
    o.beginPath(); o.arc(0, 0, r * 0.46, 0, TAU); o.fill();
    o.restore();
  },
  // the male flower's heart: anthers fused into one knobbly yellow column, dusted with pollen
  column(o, R, cx, cy, r) {
    o.fillStyle = 'rgba(90,40,6,0.45)'; U.ellipse(o, cx + r * 0.05, cy + r * 0.08, r * 0.2, r * 0.1, 0); o.fill();
    const w = r * 0.19, h = r * 0.34;
    o.fillStyle = MX.lin(o, cx - w, 0, cx + w, 0, [[0, '#C8961C'], [0.35, '#F6D44A'], [0.7, '#EFC23A'], [1, '#B8861A']]);
    U.rr(o, cx - w, cy - h, w * 2, h + r * 0.04, w * 0.9); o.fill();
    o.strokeStyle = 'rgba(150,100,10,0.7)'; o.lineWidth = 0.5;
    for (let k = 0; k < 4; k++) { o.beginPath(); for (let t = 0; t <= 1; t += 0.1) { const x = cx - w * 0.8 + k * w * 0.52 + Math.sin(t * 12 + k) * w * 0.14, y = cy - h * 0.94 + t * h; if (t) o.lineTo(x, y); else o.moveTo(x, y); } o.stroke(); }
    MX.dots(o, R, 40, [cx - w, cy - h, w * 2, h], 0.35, 0.9, 'rgba(255,236,150,0.9)');
  },
  // the female flower's heart: a short style and a thick stigma of three two-lobed pads
  stigma(o, R, cx, cy, r) {
    o.fillStyle = 'rgba(90,40,6,0.45)'; U.ellipse(o, cx, cy + r * 0.08, r * 0.24, r * 0.1, 0); o.fill();
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + i * TAU / 3;
      for (const s of [-1, 1]) {
        const x = cx + Math.cos(a + s * 0.36) * r * 0.13, y = cy - r * 0.12 + Math.sin(a + s * 0.36) * r * 0.1;
        MX.ball(o, x, y, r * 0.1, '#EAAE2A', 0.4, 0.35);
        MX.dots(o, R, 8, [x - r * 0.08, y - r * 0.08, r * 0.16, r * 0.16], 0.25, 0.5, 'rgba(255,240,180,0.7)');
      }
    }
  },
  // a heirloom summer squash leaf: five shallow lobes, a notch for the stalk, fine teeth and silver blotches along the veins
  leaf(o, R, cx, cy, r, rot, squash, tone = 0) {
    const pts = [];
    for (let i = 0; i < 120; i++) {
      const t = i / 120 * TAU, d = Math.atan2(Math.sin(t - Math.PI / 2), Math.cos(t - Math.PI / 2));
      const lobe = 0.72 + 0.28 * Math.pow(Math.abs(Math.cos(t * 2.5)), 0.6), notch = 1 - 0.5 * Math.exp(-((d / 0.3) ** 2));
      const rr = r * lobe * notch * (1 + 0.028 * Math.sin(t * 64) + 0.02 * (R() - 0.5));
      pts.push([Math.cos(t) * rr, Math.sin(t) * rr]);
    }
    o.save(); o.translate(cx, cy); o.rotate(rot); o.scale(1, squash);
    o.fillStyle = 'rgba(20,30,10,0.3)'; o.beginPath(); U.poly(o, pts.map(p => [p[0] + r * 0.05, p[1] + r * 0.08]), true); o.fill();
    const base = tone ? '#4E7E30' : '#3E6C28';
    o.fillStyle = MX.rad(o, -r * 0.2, -r * 0.3, r * 0.1, r * 1.1, [[0, U.shade(base, 0.25)], [0.6, base], [1, U.shade(base, -0.25)]]);
    o.beginPath(); U.poly(o, pts, true); o.fill();
    o.save(); o.beginPath(); U.poly(o, pts, true); o.clip();
    // silver mottling where the veins fork, as on most pepo squash
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.95;
      for (let k = 0; k < 6; k++) { const d = r * (0.18 + k * 0.1), s = r * (0.07 - k * 0.006); o.fillStyle = `rgba(214,226,200,${(0.3 - k * 0.035).toFixed(2)})`; o.beginPath(); o.ellipse(Math.cos(a) * d + (R() - 0.5) * r * 0.06, Math.sin(a) * d + (R() - 0.5) * r * 0.06, s * 1.4, s, a, 0, TAU); o.fill(); }
    }
    o.strokeStyle = 'rgba(200,220,170,0.6)'; o.lineWidth = r * 0.018;
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.95, p = MX.strand(R, 0, r * 0.12, a, r * 0.86, r * 0.08, 0.12);
      o.beginPath(); MX.curve(o, p, false); o.stroke();
      o.save(); o.lineWidth = r * 0.008;
      for (let k = 2; k < p.length - 1; k += 2) for (const s of [-1, 1]) { const q = MX.strand(R, p[k][0], p[k][1], a + s * 0.8, r * 0.22, r * 0.05, 0.3); o.beginPath(); MX.curve(o, q, false); o.stroke(); }
      o.restore();
    }
    // a couple of chewed holes and the light sheen across the blade
    for (let k = 0; k < 2; k++) { o.fillStyle = 'rgba(40,30,16,0.55)'; const hx = (R() - 0.5) * r * 0.9, hy = (R() - 0.7) * r * 0.8; o.beginPath(); U.poly(o, MX.blob(hx, hy, r * 0.03, r * 0.022, { seed: k + 3, wob: 0.3 }), true); o.fill(); }
    o.fillStyle = MX.lin(o, -r, -r, r, r, [[0, 'rgba(255,255,230,0.14)'], [0.45, 'rgba(255,255,230,0)'], [1, 'rgba(0,0,0,0.12)']]); o.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);
    o.restore();
    o.strokeStyle = 'rgba(30,50,16,0.6)'; o.lineWidth = 0.5; o.beginPath(); U.poly(o, pts, true); o.stroke();
    o.restore();
  },
  // a hairy squash stem
  stem(o, R, pts, w) {
    MX.tube(o, pts, w, '#6E9A3E', { hiA: 0.4 });
    o.strokeStyle = 'rgba(230,240,210,0.55)'; o.lineWidth = 0.3;
    for (let k = 0; k < pts.length * 5; k++) { const [x, y, a] = MX.along(pts, R()); const s = R() < 0.5 ? -1 : 1, l = w * (0.3 + R() * 0.3); o.beginPath(); o.moveTo(x + Math.cos(a + s * 1.57) * w * 0.45, y + Math.sin(a + s * 1.57) * w * 0.45); o.lineTo(x + Math.cos(a + s * 1.2) * (w * 0.45 + l), y + Math.sin(a + s * 1.2) * (w * 0.45 + l)); o.stroke(); }
  },
  // the young fruit under a female flower: a small striped squash
  baby(o, R, x0, y0, x1, y1, w) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
    o.save(); o.translate(x0, y0); o.rotate(a);
    const body = [[0, -w * 0.4], [L * 0.3, -w * 0.52], [L * 0.8, -w * 0.5], [L, -w * 0.28], [L * 1.03, 0], [L, w * 0.28], [L * 0.8, w * 0.5], [L * 0.3, w * 0.52], [0, w * 0.4]];
    MX.fill(o, body, MX.lin(o, 0, -w * 0.5, 0, w * 0.5, [[0, '#A6C878'], [0.4, '#7EA650'], [1, '#4E7430']]));
    o.save(); MX.path(o, body); o.clip();
    o.strokeStyle = 'rgba(214,232,180,0.55)'; o.lineWidth = w * 0.07;
    for (const k of [-0.3, 0, 0.3]) { o.beginPath(); o.moveTo(0, k * w); o.bezierCurveTo(L * 0.3, k * w * 1.2, L * 0.7, k * w * 1.2, L, k * w * 0.5); o.stroke(); }
    MX.dots(o, R, 30, [0, -w * 0.5, L, w], 0.3, 0.7, 'rgba(230,240,200,0.6)');
    o.restore();
    o.strokeStyle = 'rgba(40,70,20,0.6)'; o.lineWidth = 0.5; MX.path(o, body); o.stroke();
    o.restore();
  },
  // an ornamental gourd: warty, striped or two-coloured
  gourd(o, R, x, y, r, kind) {
    const pal = [['#E8C43A', '#4E7A2E'], ['#E07A1E', '#3E6A2A'], ['#EFE8CC', '#A8B488'], ['#D8B83A', '#E8742A']][kind % 4];
    const pts = kind === 1 ? MX.blob(x, y + r * 0.2, r * 0.8, r * 1.1, { seed: kind + 11, wob: 0.06 }) : MX.blob(x, y, r, r * 0.92, { seed: kind + 5, wob: 0.07 });
    o.fillStyle = MX.lit(o, x, y, r * 1.1, pal[0], 0.35, 0.4); o.beginPath(); MX.curve(o, pts); o.fill();
    o.save(); o.beginPath(); MX.curve(o, pts); o.clip();
    if (kind !== 2) { o.strokeStyle = U.rgba(pal[1], 0.75); o.lineWidth = r * 0.16; for (let k = -2; k <= 2; k++) { o.beginPath(); o.moveTo(x + k * r * 0.34, y - r * 1.3); o.quadraticCurveTo(x + k * r * 0.52, y, x + k * r * 0.34, y + r * 1.3); o.stroke(); } }
    if (kind === 1) { o.fillStyle = U.rgba(pal[1], 0.9); o.fillRect(x - r * 1.2, y + r * 0.3, r * 2.4, r * 1.2); }
    for (let k = 0; k < 14; k++) { const wx = x + (R() - 0.5) * r * 1.5, wy = y + (R() - 0.5) * r * 1.5; MX.ball(o, wx, wy, r * (0.06 + R() * 0.06), pal[0], 0.5, 0.45); }
    o.restore();
    o.strokeStyle = 'rgba(60,50,20,0.5)'; o.lineWidth = 0.4; o.beginPath(); MX.curve(o, pts); o.stroke();
    o.fillStyle = '#6A5A30'; o.fillRect(x - 1, y - r * 1.02 - 4, 2, 5);
  },
};

// ---------------------------------------------------------------- ×1: the squash patch at sunrise, the gourd fence behind
plate('squashpatch', {
  still(o) {
    const R = MX.rng(611), SQ = SQUASH;
    // the neighbour's garden behind, out of focus: a weathered fence, gourd vines and their fruit
    MX.layer(o, x => {
      x.fillStyle = MX.lin(x, 0, -141, 0, -40, [[0, '#DCE6E4'], [1, '#C8D4B8']]); x.fillRect(-141, -141, 282, 110);
      for (let i = -7; i <= 7; i++) {
        const sx = i * 20 + (R() - 0.5) * 3;
        x.fillStyle = MX.lin(x, sx - 8, 0, sx + 8, 0, [[0, '#8A8272'], [0.5, '#A89E88'], [1, '#7A7262']]); x.fillRect(sx - 8.5, -150, 17, 104);
        x.strokeStyle = 'rgba(60,54,44,0.35)'; x.lineWidth = 0.4; for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(sx - 6 + k * 3.6, -150); x.lineTo(sx - 6 + k * 3.6 + (R() - 0.5) * 2, -46); x.stroke(); }
      }
      x.fillStyle = '#6E6656'; x.fillRect(-141, -124, 282, 7); x.fillRect(-141, -72, 282, 7);
      for (let v = 0; v < 3; v++) {
        const p = MX.strand(R, -150 + v * 110, -60, -0.9, 150, 5, 0.6);
        MX.line(x, p, '#5E8034', 2.2);
        for (let k = 1; k < p.length; k += 3) SQUASH.leaf(x, R, p[k][0] + (R() - 0.5) * 8, p[k][1] + (R() - 0.5) * 8, 7 + R() * 5, R() * 6, 0.8, 1);
      }
      [[-100, -96, 11, 0], [-52, -84, 9, 1], [-10, -112, 12, 3], [36, -90, 10, 2], [84, -108, 11, 0], [122, -80, 8, 1]].forEach(([gx, gy, gr, k]) => SQUASH.gourd(x, R, gx, gy, gr, k));
    }, 1.4);
    // soil and straw mulch
    o.fillStyle = MX.lin(o, 0, -50, 0, 141, [[0, '#6A5238'], [1, '#4A3826']]); o.fillRect(-141, -52, 282, 194);
    MX.dots(o, R, 900, [-141, -52, 282, 194], 0.3, 1.2, 'rgba(30,20,10,0.35)');
    for (let k = 0; k < 260; k++) { const x = -145 + R() * 290, y = -50 + R() * 190, a = (R() - 0.5) * 1.6; o.strokeStyle = `rgba(${200 + R() * 40 | 0},${170 + R() * 30 | 0},${90 + R() * 40 | 0},${(0.5 + R() * 0.4).toFixed(2)})`; o.lineWidth = 0.6 + R() * 0.6; o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a) * (6 + R() * 10), y + Math.sin(a) * (6 + R() * 10)); o.stroke(); }
    // the vine and the big leaves, back to front
    SQ.stem(o, R, [[-150, 60], [-90, 70], [-20, 58], [50, 70], [150, 60]], 6);
    SQ.leaf(o, R, -104, 8, 50, -0.3, 0.72);
    SQ.leaf(o, R, 110, -26, 46, 0.4, 0.7, 1);
    SQ.leaf(o, R, -10, 40, 56, 0.1, 0.62);
    // the male flower on its long thin stalk
    SQ.stem(o, R, [[-80, 96], [-86, 50], [-76, 10], [-64, -22]], 2.6);
    SQ.bloom(o, R, ...SQ.patch.male, 36, 0.78, 0.12);
    SQ.column(o, R, SQ.patch.male[0], SQ.patch.male[1] + 3, 36);
    // the female flower sitting on its baby squash
    SQ.stem(o, R, [[118, 78], [112, 52], [104, 40]], 3.4);
    SQ.baby(o, R, 104, 40, 58, 8, 17);
    SQ.bloom(o, R, 44, -6, 32, 0.8, -0.2);
    SQ.stigma(o, R, 44, -3, 32);
    // a bee working the female flower, pollen on its legs
    o.save(); o.translate(SQ.patch.bee[0], SQ.patch.bee[1] + 4); o.rotate(0.5);
    o.fillStyle = 'rgba(230,240,250,0.55)'; U.ellipse(o, -3, -6, 7, 3.4, -0.5); o.fill(); U.ellipse(o, 3, -6, 7, 3.4, 0.5); o.fill();
    o.fillStyle = MX.lin(o, -8, 0, 8, 0, [[0, '#C8962E'], [0.25, '#3A2A1A'], [0.45, '#D8A63A'], [0.65, '#3A2A1A'], [0.85, '#D8A63A'], [1, '#3A2A1A']]); U.ellipse(o, 0, 0, 9, 4.6, 0); o.fill();
    o.fillStyle = '#2A1E12'; o.beginPath(); o.arc(-9, 0, 3.2, 0, TAU); o.fill();
    o.fillStyle = '#F2C23A'; o.beginPath(); o.arc(2, 5, 2, 0, TAU); o.fill();
    o.restore();
    // a second leaf in front, and the warm morning light
    SQ.leaf(o, R, -40, 118, 48, -0.2, 0.55, 1);
    SQ.leaf(o, R, 96, 124, 44, 0.5, 0.58);
    o.fillStyle = MX.rad(o, 100, -140, 10, 260, [[0, 'rgba(255,220,140,0.2)'], [1, 'rgba(255,220,140,0)']]); o.fillRect(-141, -141, 282, 282);
    MX.vignette(o, 0.22); MX.grain(o, 0.05);
    MX.scaleBar(o, 36, '5 cm', true);
  },
});

// ---------------------------------------------------------------- ×5: the two flowers cut lengthwise
plate('squashflowers', {
  still(o) {
    const R = MX.rng(612), SQ = SQUASH, F = SQ.flowers;
    MX.field(o, '#F1EEE2', '#DCD6C0', 12, 0.01, 40);
    o.strokeStyle = 'rgba(120,110,90,0.3)'; o.setLineDash([3, 3]); o.lineWidth = 0.6; o.beginPath(); o.moveTo(-2, -134); o.lineTo(-2, 134); o.stroke(); o.setLineDash([]);
    // a funnel of petals cut in half: outer face pale and hairy, inner face deep yellow, lobes flaring at the top
    const corolla = (cx, y0, y1, w0, w1) => {
      for (const s of [-1, 1]) {
        const out = [[cx + s * w0 * 0.5, y0], [cx + s * w0 * 0.62, y0 - (y0 - y1) * 0.4], [cx + s * w1 * 0.38, y1 + 12], [cx + s * w1 * 0.5, y1 - 4], [cx + s * w1 * 0.56, y1 - 14]];
        const inn = [[cx + s * w1 * 0.46, y1 - 10], [cx + s * w1 * 0.42, y1 - 2], [cx + s * w1 * 0.3, y1 + 16], [cx + s * w0 * 0.46, y0 - (y0 - y1) * 0.4], [cx + s * w0 * 0.34, y0]];
        MX.fill(o, out.concat(inn), MX.lin(o, cx, y1, cx + s * w1 * 0.5, y0, [[0, '#F2B72E'], [0.6, '#F6CC4A'], [1, '#D8A640']]));
        MX.fill(o, [[cx + s * w0 * 0.34, y0], [cx + s * w0 * 0.46, y0 - (y0 - y1) * 0.4], [cx + s * w1 * 0.3, y1 + 16], [cx + s * w1 * 0.42, y1 - 2], [cx + s * w1 * 0.34, y1 + 20], [cx + s * w0 * 0.3, y0 - (y0 - y1) * 0.3], [cx + s * w0 * 0.22, y0]], MX.lin(o, cx, y1, cx, y0, [[0, '#E89A1C'], [1, '#B8580E']]));
        o.strokeStyle = 'rgba(200,120,30,0.35)'; o.lineWidth = 0.4;
        for (let k = 0; k < 5; k++) { const t = 0.2 + k * 0.16; o.beginPath(); o.moveTo(cx + s * w0 * (0.3 + t * 0.2), y0 - 2); o.quadraticCurveTo(cx + s * w0 * (0.5 + t * 0.2), y0 - (y0 - y1) * 0.5, cx + s * w1 * (0.3 + t * 0.2), y1 + 4); o.stroke(); }
        o.strokeStyle = 'rgba(250,244,220,0.7)'; o.lineWidth = 0.35;
        for (let k = 0; k < 26; k++) { const t = R(), x = cx + s * (w0 * 0.62 + (w1 * 0.4 - w0 * 0.62) * t), y = y0 - (y0 - y1) * (0.1 + t * 0.7); o.beginPath(); o.moveTo(x, y); o.lineTo(x + s * 3, y - 1.5); o.stroke(); }
        o.strokeStyle = 'rgba(140,90,20,0.55)'; o.lineWidth = 0.5; o.beginPath(); MX.curve(o, out.concat(inn)); o.stroke();
      }
    };
    const sepals = (cx, y) => { for (const s of [-1, 1]) MX.fill(o, [[cx + s * 6, y + 2], [cx + s * 22, y - 8], [cx + s * 30, y - 16], [cx + s * 20, y - 4], [cx + s * 8, y + 6]], '#6E9A3E'); };
    // ♂ left: long stalk, sepals, petals, and the column of fused anthers on a short thick stalk
    const mx = -72;
    SQ.stem(o, R, [[mx - 4, 150], [mx - 2, 90], [mx, 34]], 7);
    sepals(mx, 34);
    corolla(mx, 30, -104, 34, 120);
    MX.fill(o, [[mx - 18, 30], [mx - 14, 14], [mx + 14, 14], [mx + 18, 30]], MX.lin(o, 0, 14, 0, 30, [[0, '#F0A43A'], [1, '#C86A18']]));
    for (let k = 0; k < 5; k++) { o.fillStyle = 'rgba(255,255,255,0.7)'; o.beginPath(); o.arc(mx - 12 + k * 6, 16 + R() * 6, 1.1, 0, TAU); o.fill(); }
    MX.fill(o, [[mx - 5, 16], [mx - 6, -20], [mx + 6, -20], [mx + 5, 16]], MX.lin(o, mx - 6, 0, mx + 6, 0, [[0, '#D8DCA8'], [0.5, '#F2F2D4'], [1, '#C8CC98']]));
    SQ.column(o, R, mx, -20, 96);
    MX.text(o, '♂', mx, -124, 13, '#5A4A30');
    // ♀ right: the baby squash under the flower, cut open with its seed-buds, a nectar ring, a short style and the stigma
    const fx = 76;
    const ov = [[fx - 26, 18], [fx - 32, 50], [fx - 34, 96], [fx - 26, 130], [fx, 140], [fx + 26, 130], [fx + 34, 96], [fx + 32, 50], [fx + 26, 18]];
    MX.fill(o, ov, MX.lin(o, fx - 34, 0, fx + 34, 0, [[0, '#4E7430'], [0.1, '#7EA650'], [0.2, '#E6EECB'], [0.8, '#E6EECB'], [0.9, '#7EA650'], [1, '#4E7430']]));
    o.save(); MX.path(o, ov); o.clip();
    for (const pl of [-14, 0, 14]) {
      o.strokeStyle = 'rgba(170,196,120,0.8)'; o.lineWidth = 2.4; o.beginPath(); o.moveTo(fx + pl, 24); o.lineTo(fx + pl * 1.2, 134); o.stroke();
      for (let k = 0; k < 9; k++) for (const s of [-1, 1]) { const y = 34 + k * 11, x = fx + pl * (1 + (y - 24) / 550) + s * 5; MX.ball(o, x, y, 3.2, '#F8F6E6', 0.3, 0.2); o.strokeStyle = 'rgba(130,150,90,0.5)'; o.lineWidth = 0.3; o.beginPath(); U.ellipse(o, x, y, 3.2, 2.2, 0); o.stroke(); }
    }
    o.restore();
    o.strokeStyle = 'rgba(40,70,20,0.7)'; o.lineWidth = 0.6; MX.path(o, ov); o.stroke();
    SQ.stem(o, R, [[fx, 138], [fx + 2, 160]], 7);
    sepals(fx, 18);
    corolla(fx, 16, -100, 30, 118);
    // nectar ring round the base of the style, glistening
    MX.fill(o, [[fx - 22, 14], [fx - 18, -2], [fx + 18, -2], [fx + 22, 14]], MX.lin(o, 0, -2, 0, 14, [[0, '#F4B04A'], [1, '#C8701C']]));
    for (let k = 0; k < 6; k++) { const x = fx - 15 + k * 6, y = 2 + R() * 6; o.fillStyle = 'rgba(255,255,255,0.8)'; o.beginPath(); o.arc(x, y, 1.4, 0, TAU); o.fill(); o.fillStyle = 'rgba(255,220,140,0.6)'; o.beginPath(); o.arc(x + 0.5, y + 0.6, 1.8, 0, TAU); o.fill(); }
    MX.fill(o, [[fx - 7, -2], [fx - 8, -34], [fx + 8, -34], [fx + 7, -2]], MX.lin(o, fx - 8, 0, fx + 8, 0, [[0, '#E0C070'], [0.5, '#F4DC90'], [1, '#D0AE58']]));
    SQ.stigma(o, R, fx, -34, 150);
    MX.text(o, '♀', fx, -124, 13, '#5A4A30');
    MX.vignette(o, 0.12); MX.grain(o, 0.04);
    MX.scaleBar(o, 56, '1 cm');
  },
});

// ---------------------------------------------------------------- ×400: pollen grains on the stigma's sticky papillae
plate('squashpollen', {
  still(o) {
    const R = MX.rng(613), P = SQUASH.pollen;
    MX.field(o, '#F4EEDA', '#E2D6AE', 14, 0.012, 60);
    // three depths of papillae: finger-like cells rising from the stigma, the far ones soft
    const papillae = (x, n, blur, a) => MX.layer(o, q => {
      for (let i = 0; i < n; i++) {
        const bx = -150 + i * (300 / n) + (R() - 0.5) * 6, top = -4 + R() * 40 + Math.abs(bx) * 0.12, lean = (R() - 0.5) * 0.3;
        const pts = [[bx, 150], [bx + lean * 40, 90], [bx + lean * 70, top + 20], [bx + lean * 76, top]];
        MX.taper(q, pts, 13 + R() * 3, 10 + R() * 3, `rgba(${236 - x * 14},${222 - x * 14},${180 - x * 16},0.92)`, 'rgba(140,118,70,0.65)');
        const [tx, ty] = pts[3];
        q.fillStyle = MX.rad(q, tx - 2, ty + 2, 0.5, 7, [[0, 'rgba(255,255,245,0.8)'], [1, 'rgba(255,255,245,0)']]); q.beginPath(); q.arc(tx - 2, ty + 3, 6, 0, TAU); q.fill();
        q.strokeStyle = 'rgba(150,126,76,0.5)'; q.lineWidth = 0.5; q.beginPath(); U.ellipse(q, tx + lean * 10, ty + 22, 2.6, 3.6, 0); q.stroke();
        MX.dots(q, R, 10, [tx - 5, ty + 4, 10, 60], 0.3, 0.7, 'rgba(160,130,70,0.35)');
      }
    }, blur, a);
    papillae(2, 22, 2.2, 0.85); papillae(1, 20, 1, 0.95); papillae(0, 17, 0, 1);
    // a pollen grain: big, round, spiny, with lidded pores and an oily coat
    const grain = (cx, cy, r) => {
      o.fillStyle = 'rgba(80,60,20,0.25)'; o.beginPath(); o.arc(cx + 3, cy + 5, r * 1.02, 0, TAU); o.fill();
      MX.ball(o, cx, cy, r, '#E6C06A', 0.42, 0.42);
      o.save(); o.beginPath(); o.arc(cx, cy, r * 0.98, 0, TAU); o.clip();
      MX.dots(o, R, 340, [cx - r, cy - r, r * 2, r * 2], 0.3, 1, 'rgba(150,100,30,0.22)');
      for (let k = 0; k < 7; k++) { const a = R() * TAU, d = R() * r * 0.8, px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.9, pr = r * 0.1 * (1 - d / r * 0.5); o.fillStyle = 'rgba(248,232,180,0.9)'; o.beginPath(); U.ellipse(o, px, py, pr, pr * (1 - d / r * 0.6), a); o.fill(); o.strokeStyle = 'rgba(140,96,30,0.7)'; o.lineWidth = 0.6; o.stroke(); }
      for (let k = 0; k < 10; k++) { const px = cx + (R() - 0.5) * r * 1.2, py = cy + (R() - 0.5) * r * 1.2; o.fillStyle = 'rgba(255,250,220,0.75)'; o.beginPath(); o.arc(px, py, 0.8 + R() * 1.2, 0, TAU); o.fill(); }
      o.restore();
      for (let k = 0; k < 90; k++) {
        const a = R() * TAU, d = Math.sqrt(R()), bx = cx + Math.cos(a) * d * r * 0.96, by = cy + Math.sin(a) * d * r * 0.96, L = r * 0.2 * d + r * 0.03;
        const tx = bx + Math.cos(a) * L, ty = by + Math.sin(a) * L, px = -Math.sin(a) * 1.1, py = Math.cos(a) * 1.1;
        o.fillStyle = d > 0.9 ? '#B8862E' : 'rgba(170,120,40,0.75)'; o.beginPath(); o.moveTo(bx + px, by + py); o.lineTo(tx, ty); o.lineTo(bx - px, by - py); o.closePath(); o.fill();
      }
      o.fillStyle = MX.rad(o, cx - r * 0.35, cy - r * 0.4, 1, r * 0.5, [[0, 'rgba(255,255,255,0.5)'], [1, 'rgba(255,255,255,0)']]); o.beginPath(); o.arc(cx - r * 0.35, cy - r * 0.4, r * 0.5, 0, TAU); o.fill();
    };
    // the pollen tube of a grain that has germinated, winding down between the papillae
    const tube = [[30, -44], [26, -14], [30, 14], [22, 40], [28, 70], [18, 100], [22, 150]];
    MX.line(o, tube, 'rgba(120,100,50,0.5)', 7.4);
    MX.line(o, tube, 'rgba(246,238,210,0.95)', 5.6);
    MX.line(o, tube.map(p => [p[0] - 1.2, p[1]]), 'rgba(255,255,255,0.7)', 1.2);
    MX.dots(o, R, 30, [14, -40, 20, 180], 0.3, 0.8, 'rgba(170,140,70,0.45)');
    for (const y of [104, 116]) { o.fillStyle = 'rgba(120,70,120,0.5)'; U.ellipse(o, 19 + (y - 104) * 0.1, y, 1.6, 3, 0.1); o.fill(); }
    grain(-50, -40, 34);
    grain(38, -70, 32);
    grain(-118, 6, 26);
    // a bee's leg reaching in from the corner, its branched hairs loaded with more grains
    o.save(); o.translate(150, -150); o.rotate(2.55);
    o.fillStyle = MX.lin(o, 0, -12, 0, 12, [[0, '#4A3420'], [0.5, '#2A1C10'], [1, '#1A120A']]); U.rr(o, -10, -12, 112, 24, 10); o.fill();
    o.strokeStyle = 'rgba(236,222,190,0.8)'; o.lineWidth = 0.6;
    for (let k = 0; k < 70; k++) { const x = R() * 100, s = R() < 0.5 ? -1 : 1, l = 10 + R() * 14; o.beginPath(); o.moveTo(x, s * 11); o.lineTo(x + 3, s * (11 + l)); o.stroke(); o.beginPath(); o.moveTo(x + 1.5, s * (11 + l * 0.5)); o.lineTo(x + 5, s * (11 + l * 0.7)); o.stroke(); }
    o.restore();
    grain(P.cross[0], P.cross[1], 22);
    MX.vignette(o, 0.16); MX.grain(o, 0.05);
    MX.scaleBar(o, 42, '100 µm');
  },
});
