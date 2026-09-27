'use strict';
// Stripe rust (case "pas"): a rusty leaf from the one-variety field beside a resistant leaf from Grandma's mixed field,
// the leaf surface with its rows of spore blisters, and a section through a blister: spores bursting out, fungal
// threads between the leaf cells and a haustorium drawing food from one of them.
// Spots, in plate units, live in RUSTP so lens.js SPECS.rust points at the right thing.
const RUSTP = {
  leaf: { stripe: [-40, -20], resistant: [96, 0], dust: [10, 108] },
  surf: { pustule: [-20, -30], torn: [82, 44], stoma: [-80, 90] },
  sect: { spore: [30, 112], hypha: [74, -20], haustorium: [-40, -40], mesophyll: [-100, -76] },

  // a wheat leaf blade along a path: parallel veins, a paler midrib, and (when sick) yellow bands studded with orange blisters
  blade(o, R, path, w0, sick) {
    const n = path.length, wid = t => w0 * (1 - Math.pow(t, 2.2)) * (0.72 + 0.28 * Math.min(1, t * 6));
    const at = (i, f) => {
      const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), w = wid(i / (n - 1)) / 2;
      return [path[i][0] - Math.sin(ang) * f * w, path[i][1] + Math.cos(ang) * f * w, ang];
    };
    const edge = f => path.map((_, i) => at(i, f).slice(0, 2));
    const out = edge(1).concat(edge(-1).reverse());
    MX.layer(o, x => { x.fillStyle = 'rgba(20,30,10,0.45)'; x.beginPath(); MX.curve(x, out.map(p => [p[0] + 4, p[1] + 6])); x.fill(); }, 3);
    MX.fill(o, out, MX.lin(o, path[0][0], path[0][1], path[n - 1][0], path[n - 1][1], [[0, sick ? '#8AA040' : '#5E8E36'], [0.6, sick ? '#A8B048' : '#6E9E3E'], [1, sick ? '#B89A48' : '#88A84A']]));
    o.save(); o.beginPath(); MX.curve(o, out); o.clip();
    for (let f = -0.84; f <= 0.85; f += 0.21) MX.line(o, edge(f), f === 0 ? 'rgba(230,240,200,0.55)' : 'rgba(210,230,170,0.35)', Math.abs(f) < 0.05 ? 1.4 : 0.6);
    if (sick) {
      for (const f of [-0.63, -0.42, -0.21, 0.21, 0.42, 0.63]) {
        const band = edge(f).slice(Math.round(n * 0.12), Math.round(n * 0.92));
        MX.line(o, band, 'rgba(232,214,90,0.7)', w0 * 0.1);
        for (let i = Math.round(n * 0.14); i < Math.round(n * 0.9); i++) for (let q = 0; q < 3; q++) {
          if (R() < 0.18) continue;
          const t = i + q / 3, i0 = Math.floor(t), fr = t - i0, p0 = at(i0, f), p1 = at(Math.min(n - 1, i0 + 1), f);
          const px = p0[0] + (p1[0] - p0[0]) * fr, py = p0[1] + (p1[1] - p0[1]) * fr;
          o.fillStyle = MX.rad(o, px - 0.4, py - 0.4, 0.1, 1.8, [[0, '#FFC050'], [0.6, '#E8862A'], [1, '#B8601A']]);
          o.beginPath(); o.ellipse(px, py, 1.9, 0.9, p0[2], 0, TAU); o.fill();
        }
      }
      // the leaf tip is dying back
      o.fillStyle = MX.lin(o, path[n - 1][0], path[n - 1][1], path[Math.round(n * 0.7)][0], path[Math.round(n * 0.7)][1], [[0, 'rgba(140,100,50,0.9)'], [1, 'rgba(140,100,50,0)']]); o.fillRect(-150, -150, 300, 300);
    } else {
      // a resistant leaf: the odd spore that landed killed a few of its own cells, leaving tiny brown flecks
      for (let k = 0; k < 9; k++) { const i = 2 + Math.floor(R() * (n - 4)), [px, py] = at(i, (R() - 0.5) * 1.4); o.fillStyle = 'rgba(230,220,110,0.6)'; o.beginPath(); o.arc(px, py, 1.8, 0, TAU); o.fill(); o.fillStyle = '#5A3A1A'; o.beginPath(); o.arc(px, py, 0.8, 0, TAU); o.fill(); }
    }
    o.fillStyle = MX.lin(o, -100, -100, 100, 100, [[0, 'rgba(255,255,240,0.18)'], [0.5, 'rgba(255,255,240,0)'], [1, 'rgba(0,0,0,0.12)']]); o.fillRect(-150, -150, 300, 300);
    o.restore();
    o.strokeStyle = 'rgba(40,60,20,0.6)'; o.lineWidth = 0.5; o.beginPath(); MX.curve(o, out); o.stroke();
  },
  // a rust spore: round, thick-walled, orange, its wall covered in fine spines
  spore(o, R, x, y, r) {
    o.fillStyle = 'rgba(90,50,10,0.3)'; o.beginPath(); o.arc(x + 1, y + 1.4, r, 0, TAU); o.fill();
    MX.ball(o, x, y, r, '#E8922E', 0.45, 0.4);
    o.strokeStyle = 'rgba(150,80,20,0.8)'; o.lineWidth = r * 0.14; o.beginPath(); o.arc(x, y, r * 0.93, 0, TAU); o.stroke();
    o.fillStyle = 'rgba(140,70,14,0.7)'; for (let k = 0; k < 16; k++) { const a = R() * TAU, d = Math.sqrt(R()) * r * 0.85; o.beginPath(); o.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.06, 0, TAU); o.fill(); }
    o.fillStyle = 'rgba(255,230,170,0.6)'; o.beginPath(); o.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, TAU); o.fill();
  },
};

// ---------------------------------------------------------------- ×1: a rusty leaf, a resistant leaf and a dusty fingertip
plate('rustleaf', {
  still(o) {
    const R = MX.rng(711), P = RUSTP;
    // the wheat field behind, out of focus
    MX.layer(o, x => {
      x.fillStyle = MX.lin(x, 0, -141, 0, 141, [[0, '#CAD8CC'], [0.3, '#A4B676'], [1, '#6E8642']]); x.fillRect(-141, -141, 282, 282);
      for (let k = 0; k < 60; k++) { const bx = -150 + R() * 300, lean = (R() - 0.5) * 0.3; x.strokeStyle = `rgba(${100 + R() * 70 | 0},${120 + R() * 50 | 0},${50 + R() * 30 | 0},0.7)`; x.lineWidth = 2 + R() * 2.5; x.beginPath(); x.moveTo(bx, 150); x.quadraticCurveTo(bx + lean * 60, 20, bx + lean * 120, -60 - R() * 60); x.stroke(); }
      for (let k = 0; k < 22; k++) { const ex = -150 + R() * 300, ey = -126 + R() * 70; x.fillStyle = R() < 0.4 ? 'rgba(200,150,60,0.8)' : 'rgba(196,196,120,0.8)'; x.beginPath(); x.ellipse(ex, ey, 4.5, 15, (R() - 0.5) * 0.4, 0, TAU); x.fill(); }
    }, 5);
    P.blade(o, R, [[160, 96], [124, 54], [100, 2], [92, -52], [100, -108], [116, -146]], 26, false);
    P.blade(o, R, [[-160, 78], [-104, 36], [-50, -12], [2, -62], [50, -108], [84, -146]], 36, true);
    // a fingertip that has brushed a rusty leaf, orange with spores
    const tip = [[-18, 150], [-20, 112], [-12, 88], [6, 80], [24, 88], [32, 112], [30, 150]];
    MX.layer(o, x => { x.fillStyle = 'rgba(20,14,8,0.45)'; x.beginPath(); MX.curve(x, tip.map(p => [p[0] + 5, p[1] + 5])); x.fill(); }, 3);
    MX.fill(o, tip, MX.lin(o, -20, 0, 32, 0, [[0, '#C88A66'], [0.4, '#E8B08E'], [1, '#B87A58']]));
    o.save(); o.beginPath(); MX.curve(o, tip); o.clip();
    o.strokeStyle = 'rgba(150,90,60,0.4)'; o.lineWidth = 0.45; for (let k = 1; k < 14; k++) { o.beginPath(); o.ellipse(7, 104, k * 2.2, k * 1.7, 0, Math.PI * 1.05, Math.PI * 1.95); o.stroke(); }
    MX.dots(o, R, 380, [-16, 88, 44, 42], 0.3, 0.9, 'rgba(232,134,40,0.85)', (x, y) => Math.hypot(x - 8, (y - 106) * 1.3) < 18);
    MX.dots(o, R, 90, [-16, 88, 44, 42], 0.3, 0.7, 'rgba(255,190,90,0.9)', (x, y) => Math.hypot(x - 8, (y - 106) * 1.3) < 14);
    o.restore();
    MX.vignette(o, 0.14); MX.grain(o, 0.04);
    MX.scaleBar(o, 34, '1 cm');
  },
});

// ---------------------------------------------------------------- ×40: the leaf surface, blisters bursting in rows along the veins
plate('rustpustule', {
  still(o) {
    const R = MX.rng(712), P = RUSTP;
    MX.field(o, '#8EAA52', '#C8C458', 16, 0.015, 90);
    // long epidermis cells in rows along the leaf, with a row of dumbbell-shaped grass stomata every few rows
    for (let y = -146, row = 0; y < 146; y += 8, row++) {
      const stom = row % 5 === 2;
      for (let x = -150 + (row % 2) * 14; x < 150; x += stom ? 20 : 28) {
        if (stom) {
          o.fillStyle = 'rgba(214,226,170,0.9)'; U.rr(o, x + 1, y + 0.6, 18, 6.8, 2.6); o.fill();
          o.fillStyle = 'rgba(96,130,56,0.95)'; U.rr(o, x + 5, y + 2, 10, 1.6, 0.8); o.fill(); U.rr(o, x + 5, y + 4.4, 10, 1.6, 0.8); o.fill();
          o.fillStyle = 'rgba(40,50,24,0.9)'; o.fillRect(x + 7, y + 3.6, 6, 0.8);
          o.strokeStyle = 'rgba(80,100,40,0.5)'; o.lineWidth = 0.4; U.rr(o, x + 1, y + 0.6, 18, 6.8, 2.6); o.stroke();
        } else {
          o.fillStyle = `rgba(${196 + R() * 20 | 0},${214 + R() * 16 | 0},${130 + R() * 30 | 0},0.55)`; U.rr(o, x + 0.5, y + 0.5, 27, 7, 2); o.fill();
          o.strokeStyle = 'rgba(80,100,40,0.55)'; o.lineWidth = 0.5; U.rr(o, x + 0.5, y + 0.5, 27, 7, 2); o.stroke();
        }
      }
    }
    // a stoma exactly where the callout points
    { const [sx, sy] = P.surf.stoma; o.fillStyle = 'rgba(214,226,170,1)'; U.rr(o, sx - 10, sy - 4, 20, 8, 3); o.fill(); o.fillStyle = 'rgba(80,120,44,1)'; U.rr(o, sx - 6, sy - 2.4, 12, 1.8, 0.9); o.fill(); U.rr(o, sx - 6, sy + 0.6, 12, 1.8, 0.9); o.fill(); o.fillStyle = '#26301A'; o.fillRect(sx - 4, sy - 0.5, 8, 1); }
    // yellow bands along the veins where the fungus grows inside, and the blisters on them
    for (const vy of [-30, 50]) MX.line(o, [[-150, vy], [150, vy + 2]], 'rgba(236,214,90,0.55)', 26);
    const blisters = [[-128, -31, 18], [-70, -30, 22], [-20, -30, 26], [40, -29, 22], [100, -28, 20], [-110, 50, 20], [-50, 51, 24], [10, 51, 20], [70, 52, 26], [126, 52, 16]];
    for (const [bx, by, l] of blisters) {
      // the torn leaf skin curled back at both edges
      for (const s of [-1, 1]) {
        const flap = [[bx - l / 2, by], [bx - l * 0.3, by + s * 7.5], [bx + l * 0.3, by + s * 8], [bx + l / 2, by], [bx + l * 0.3, by + s * 4.6], [bx - l * 0.3, by + s * 4.2]];
        MX.fill(o, flap, 'rgba(236,240,210,0.85)');
        o.strokeStyle = 'rgba(120,130,80,0.7)'; o.lineWidth = 0.5; o.beginPath(); MX.curve(o, flap); o.stroke();
      }
      o.fillStyle = MX.rad(o, bx, by, 1, l * 0.5, [[0, '#FFB84A'], [0.6, '#E8862A'], [1, '#B8601A']]); o.beginPath(); o.ellipse(bx, by, l / 2, 4.6, 0, 0, TAU); o.fill();
      for (let k = 0; k < l * 3; k++) { const px = bx + (R() - 0.5) * l * 0.9, py = by + (R() - 0.5) * 8; o.fillStyle = R() < 0.5 ? 'rgba(255,200,110,0.9)' : 'rgba(190,100,30,0.8)'; o.beginPath(); o.arc(px, py, 0.6 + R() * 0.5, 0, TAU); o.fill(); }
      for (let k = 0; k < 10; k++) { o.fillStyle = 'rgba(232,140,50,0.8)'; o.beginPath(); o.arc(bx + (R() - 0.5) * l * 1.6, by + (R() - 0.5) * 26, 0.7, 0, TAU); o.fill(); }
    }
    MX.soften(o, 0.4, 0.35);
    MX.vignette(o, 0.18); MX.grain(o, 0.05);
    MX.scaleBar(o, 40, '0,5 mm');
  },
});

// ---------------------------------------------------------------- ×400: a section through a blister
plate('rustspore', {
  still(o) {
    const R = MX.rng(713), P = RUSTP, S = P.sect;
    MX.field(o, '#F2F0E6', '#DCD8C4', 18, 0.012, 40);
    // upper epidermis with its waxy cuticle
    o.fillStyle = 'rgba(220,230,196,0.95)'; o.fillRect(-141, -141, 282, 22);
    for (let x = -141; x < 141; x += 16 + R() * 4) { o.strokeStyle = 'rgba(90,110,60,0.7)'; o.lineWidth = 0.7; o.strokeRect(x, -140, 16, 20); }
    o.fillStyle = 'rgba(240,230,170,0.9)'; o.fillRect(-141, -142, 282, 2.6);
    // mesophyll: round cells crowded with chloroplasts, air spaces between them
    const cells = [];
    for (const [cx, cy] of MX.scatter(R, 40, 30, [-150, -112, 300, 176])) cells.push([cx, cy, 12 + R() * 4]);
    cells.push([S.mesophyll[0], S.mesophyll[1], 15], [S.haustorium[0], S.haustorium[1], 17]);
    for (const [cx, cy, r] of cells) {
      if (Math.hypot(cx - S.haustorium[0], cy - S.haustorium[1]) < 22 && !(cx === S.haustorium[0] && cy === S.haustorium[1])) continue;
      if (Math.hypot(cx - S.mesophyll[0], cy - S.mesophyll[1]) < 20 && !(cx === S.mesophyll[0] && cy === S.mesophyll[1])) continue;
      const cell = MX.blob(cx, cy, r, r * 0.9, { wob: 0.08, seed: cx * 3 + cy });
      MX.fill(o, cell, 'rgba(226,238,206,0.95)');
      o.strokeStyle = 'rgba(90,120,60,0.8)'; o.lineWidth = 0.7; o.beginPath(); MX.curve(o, cell); o.stroke();
      for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + R() * 0.2, d = r * 0.78; o.fillStyle = MX.lit(o, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.9, 2.6, '#5E9A3A', 0.35, 0.3); o.beginPath(); o.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.9, 2.6, 1.6, a + 1.57, 0, TAU); o.fill(); }
      o.fillStyle = 'rgba(150,130,160,0.5)'; o.beginPath(); o.arc(cx + r * 0.2, cy - r * 0.3, 2.4, 0, TAU); o.fill();
    }
    // fungal threads winding through the air spaces, with cross walls
    const hyphae = [[[-150, 30], [-110, 14], [-70, 22], [-54, -6], [-44, -24]], [[150, -40], [110, -30], [S.hypha[0], S.hypha[1]], [40, 0], [10, 30], [-10, 64]], [[-120, 66], [-80, 58], [-40, 62], [0, 66], [40, 64], [90, 60], [150, 66]], [[20, -100], [36, -70], [60, -52], [S.hypha[0] + 4, S.hypha[1] - 10]]];
    for (const h of hyphae) {
      MX.line(o, h, 'rgba(120,110,80,0.7)', 3.4); MX.line(o, h, 'rgba(250,246,230,0.95)', 2.4);
      for (let k = 1; k < 6; k++) { const [x, y, a] = MX.along(h, k / 6); o.strokeStyle = 'rgba(120,110,80,0.8)'; o.lineWidth = 0.5; o.beginPath(); o.moveTo(x - Math.sin(a) * 1.4, y + Math.cos(a) * 1.4); o.lineTo(x + Math.sin(a) * 1.4, y - Math.cos(a) * 1.4); o.stroke(); }
    }
    // the haustorium: the hypha pushes a narrow neck through the cell wall and swells into a lobed feeding body inside
    { const [hx, hy] = S.haustorium;
      o.fillStyle = 'rgba(250,246,230,0.95)'; o.strokeStyle = 'rgba(120,110,80,0.8)'; o.lineWidth = 0.6;
      o.beginPath(); o.moveTo(hx - 4, hy + 16); o.lineTo(hx - 2, hy + 6); o.lineTo(hx + 2, hy + 6); o.lineTo(hx + 4, hy + 16); o.fill(); o.stroke();
      const body = MX.blob(hx, hy, 8, 6.4, { wob: 0.25, n: 20, seed: 5, fq: 3 });
      o.fillStyle = 'rgba(210,230,236,0.6)'; o.beginPath(); MX.curve(o, body.map(p => [hx + (p[0] - hx) * 1.3, hy + (p[1] - hy) * 1.3])); o.fill();
      MX.fill(o, body, 'rgba(252,248,232,0.98)'); o.beginPath(); MX.curve(o, body); o.stroke();
      o.fillStyle = 'rgba(140,110,150,0.8)'; o.beginPath(); o.arc(hx - 2, hy, 1.4, 0, TAU); o.fill(); o.beginPath(); o.arc(hx + 2.4, hy - 1, 1.2, 0, TAU); o.fill(); }
    // the lower epidermis torn open, and a mass of spores bursting out on short stalks
    o.fillStyle = 'rgba(220,230,196,0.95)'; o.fillRect(-141, 78, 72, 16); o.fillRect(92, 78, 60, 16);
    for (const s of [-1, 1]) { const ex = s < 0 ? -69 : 92; o.save(); o.translate(ex, 86); o.rotate(s * 0.9); o.fillStyle = 'rgba(220,230,196,0.95)'; o.fillRect(s < 0 ? 0 : -16, -8, 16, 16); o.strokeStyle = 'rgba(90,110,60,0.7)'; o.lineWidth = 0.7; o.strokeRect(s < 0 ? 0 : -16, -8, 16, 16); o.restore(); }
    MX.line(o, [[-70, 74], [-30, 70], [20, 72], [60, 70], [92, 74]], 'rgba(230,200,150,0.9)', 5);
    for (let k = 0; k < 36; k++) {
      const x = -60 + R() * 146, base = 72, y = base + 14 + R() * 60 + Math.abs(x - 12) * -0.2, r = 7 + R() * 2.6;
      MX.line(o, [[x + (R() - 0.5) * 4, base], [x, y - r]], 'rgba(230,214,170,0.9)', 1.6);
      P.spore(o, R, x, y, r);
    }
    P.spore(o, R, S.spore[0], S.spore[1], 10);
    MX.vignette(o, 0.14); MX.grain(o, 0.04);
    MX.scaleBar(o, 36, '20 µm');
  },
});
