'use strict';
// Fungus, soil and pond plates: the decomposers and the small life of a drop of water. Spot coordinates are listed
// above each plate.

const ECO = {
  // a fallen leaf; `holes` are patches eaten down to the veins (skeletonised)
  leaf(o, R, x, y, a, len, col, holes = 0, under = '#2A1E14') {
    o.save(); o.translate(x, y); o.rotate(a);
    const w = t => len * 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08)), 0.75) * (1 + 0.05 * Math.sin(t * 44));
    const side = s => { const p = []; for (let i = 0; i <= 18; i++) { const t = i / 18; p.push([t * len - len / 2, s * w(t)]); } return p; };
    const out = side(-1).concat(side(1).reverse());
    o.fillStyle = MX.lin(o, -len / 2, -len * 0.3, len / 2, len * 0.3, [[0, U.shade(col, -0.18)], [0.5, col], [1, U.shade(col, 0.12)]]); o.beginPath(); U.poly(o, out, true); o.fill();
    const veins = (c, lw) => {
      MX.line(o, [[-len / 2 - len * 0.14, 0], [-len / 2, 0], [len / 2 - 1, 0]], c, lw * 1.6);
      for (let k = 1; k < 8; k++) for (const s of [-1, 1]) { const t = k / 8.5, t2 = Math.min(1, t + 0.16); MX.line(o, [[t * len - len / 2, 0], [t2 * len - len / 2, s * w(t2) * 0.88]], c, lw); }
    };
    for (let i = 0; i < holes; i++) {
      const hx = (R() - 0.5) * len * 0.7, hw = w(hx / len + 0.5), hy = (R() - 0.5) * hw;
      const hole = MX.blob(hx, hy, 2 + R() * len * 0.08, 1.6 + R() * hw * 0.3, { seed: i + 3, wob: 0.35, n: 10 });
      o.save(); o.beginPath(); U.poly(o, out, true); o.clip();
      MX.fill(o, hole, under);
      o.save(); MX.path(o, hole); o.clip(); veins('rgba(214,184,130,0.9)', 0.45);
      for (let k = 0; k < 10; k++) MX.line(o, MX.strand(R, hx + (R() - 0.5) * 6, hy + (R() - 0.5) * 4, R() * TAU, 5, 1.5, 1), 'rgba(200,170,120,0.7)', 0.25);
      o.restore(); o.restore();
    }
    veins(U.rgba(U.shade(col, -0.35), 0.7), 0.4);
    o.strokeStyle = U.rgba(U.shade(col, -0.45), 0.6); o.lineWidth = 0.35; o.beginPath(); U.poly(o, out, true); o.stroke();
    o.restore();
  },
  // the white fuzz of fungal threads on rotting matter
  fuzz(o, R, cx, cy, rx, ry, n) {
    o.fillStyle = MX.rad(o, cx, cy, 0, Math.max(rx, ry), [[0, 'rgba(250,248,240,0.6)'], [1, 'rgba(250,248,240,0)']]); o.beginPath(); o.ellipse(cx, cy, rx, ry, 0, 0, TAU); o.fill();
    o.strokeStyle = 'rgba(252,250,244,0.65)'; o.lineWidth = 0.28;
    for (let i = 0; i < n; i++) { const a = R() * TAU, d = Math.sqrt(R()), px = cx + Math.cos(a) * rx * d, py = cy + Math.sin(a) * ry * d, b = R() * TAU, l = 1 + R() * 3; o.beginPath(); o.moveTo(px, py); o.quadraticCurveTo(px + Math.cos(b + 0.6) * l * 0.6, py + Math.sin(b + 0.6) * l * 0.6, px + Math.cos(b) * l, py + Math.sin(b) * l); o.stroke(); }
  },
  stone(o, R, x, y, r, base) {
    const p = MX.blob(x, y, r, r * (0.55 + R() * 0.4), { seed: Math.round(x * 7 + y * 3), wob: 0.25, n: 11, rot: R() * 3, fq: 1.1 });
    o.fillStyle = 'rgba(0,0,0,0.3)'; o.beginPath(); U.poly(o, p.map(([a, b]) => [a + r * 0.12, b + r * 0.16]), true); o.fill();
    o.fillStyle = MX.lit(o, x, y, r, base, 0.35, 0.45); o.beginPath(); U.poly(o, p, true); o.fill();
    return p;
  },
};

// ================================================================ ×1 a field mushroom on the forest floor, soil cut away
// Above ground, the fruiting body: cap, gills, ring and stalk. Below, the fungus itself: a web of white threads
// spreading through the soil and into the leaves it is rotting.
// spots: gills (30,-40) · mycelium (-30,70) · decomposing leaf (-100,14)
plate('mushroom', {
  still(o, st) {
    const R = MX.rng(201), surf = x => 10 + MX.n(x * 0.03, 3) * 2.5;
    // the wood behind, out of focus
    o.fillStyle = MX.lin(o, 0, -141, 0, 14, [[0, '#6E7E52'], [0.55, '#46523A'], [1, '#2E3424']]); o.fillRect(-141, -141, 282, 156);
    MX.layer(o, x => {
      for (let i = 0; i < 7; i++) { const tx = -150 + i * 46 + R() * 20, w = 8 + R() * 18; x.fillStyle = U.pick(['#262A1E', '#34321F', '#403C2A'], R()); x.fillRect(tx, -141, w, 160); }
      for (let i = 0; i < 70; i++) { x.fillStyle = U.rgba(U.pick(['#8EA860', '#6E8A48', '#C8D8A0', '#E8F0C0'], R()), 0.25 + R() * 0.35); x.beginPath(); x.arc(-140 + R() * 280, -140 + R() * 130, 3 + R() * 10, 0, TAU); x.fill(); }
      for (let i = 0; i < 30; i++) { x.fillStyle = U.rgba(U.pick(['#4E6A2E', '#6A8A3A'], R()), 0.8); x.beginPath(); x.ellipse(-140 + R() * 280, 2 + R() * 10, 6 + R() * 10, 3 + R() * 4, 0, 0, TAU); x.fill(); }
    }, 5, 1);
    // the soil face: dark and crumbly at the top, fading to mineral soil below
    MX.tex(o, -141, 4, 282, 137, (x, y) => {
      const f = U.fbm(x * 0.06, y * 0.06, 4, 11), n = U.noise(x * 0.4, y * 0.4, 12), d = U.clamp((y - 10) / 130, 0, 1);
      const k = 0.72 + f * 0.45 + (n - 0.5) * 0.3;
      return [(46 + 60 * d) * k, (34 + 40 * d) * k, (22 + 24 * d) * k, 255];
    }, 220);
    MX.dots(o, R, 400, [-141, 16, 282, 125], 0.3, 1.2, 'rgba(20,14,8,0.55)');
    for (let i = 0; i < 70; i++) MX.ball(o, -140 + R() * 280, 20 + R() * 120, 0.6 + R() * 1.6, U.pick(['#6A5438', '#8A7050', '#4A3A26'], R()), 0.35, 0.3);
    for (let i = 0; i < 10; i++) ECO.stone(o, R, -135 + R() * 270, 50 + R() * 90, 2.5 + R() * 5, U.pick(['#8A8070', '#A09480', '#6E665A'], R()));
    // a tree root passing through
    MX.tube(o, [[-141, 44], [-100, 52], [-60, 48], [-20, 58]], 7, '#6A4A30');
    // the mycelium: cords of hyphae from the stalk's base, fanning out through the soil
    const cords = [
      [[-2, 18], [-10, 34], [-22, 52], [-30, 70], [-44, 92], [-52, 118], [-60, 140]],
      [[2, 18], [14, 38], [34, 56], [52, 80], [60, 108], [76, 136]],
      [[0, 18], [2, 44], [-4, 76], [6, 104], [2, 136]],
      [[-4, 16], [-30, 22], [-60, 20], [-86, 18], [-104, 20]],
      [[4, 16], [36, 24], [70, 32], [104, 30], [140, 40]],
      [[-6, 18], [-40, 40], [-80, 60], [-120, 88], [-141, 96]],
    ];
    o.strokeStyle = 'rgba(245,242,230,0.55)'; o.lineWidth = 0.35;
    for (const c of cords) for (let i = 0; i < 26; i++) {
      const [bx, by, a] = MX.along(c, R()), s = MX.strand(R, bx, by, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.9), 12 + R() * 34, 2, 0.7);
      MX.line(o, s, 'rgba(245,242,230,' + (0.35 + R() * 0.35).toFixed(2) + ')', 0.3 + R() * 0.3);
    }
    for (const c of cords) { MX.taper(o, c, 2.4, 0.9, 'rgba(242,238,226,0.9)'); MX.line(o, c, 'rgba(255,255,255,0.5)', 0.4); }
    ECO.fuzz(o, R, -30, 70, 12, 9, 90);
    // leaf litter on the surface
    for (let i = 0; i < 26; i++) { const x = -150 + R() * 300; if (Math.abs(x + 100) < 20) continue; ECO.leaf(o, R, x, surf(x) + 1 + R() * 3, (R() - 0.5) * 0.6 + (R() < 0.5 ? Math.PI : 0), 10 + R() * 14, U.pick(['#8A5A2A', '#A8743A', '#6E4A26', '#B88A48', '#5A3E22'], R())); }
    for (let i = 0; i < 6; i++) { const x = -140 + R() * 280; MX.tube(o, [[x, surf(x) + 2], [x + 12 + R() * 20, surf(x) + R() * 3]], 1.8, '#4A3A28'); }
    for (let i = 0; i < 10; i++) { const x = -140 + R() * 280; o.fillStyle = U.pick(['#4E7A2E', '#6A8E3A'], R()); o.beginPath(); o.ellipse(x, surf(x) - 1, 5 + R() * 6, 2.4, 0, Math.PI, TAU); o.fill(); }
    // the dead leaf the fungus is rotting: holes eaten down to the veins, white threads spreading over it
    ECO.leaf(o, R, -100, 13, 0.18, 44, '#8E6434', 7, '#2E2216');
    ECO.fuzz(o, R, -110, 13, 9, 3.5, 70); ECO.fuzz(o, R, -86, 15, 7, 3, 50);
    // stalk with its ring
    const stalk = MX.lin(o, -9, 0, 9, 0, [[0, '#BDB39E'], [0.35, '#F4F0E6'], [0.7, '#E4DDCE'], [1, '#A89E8A']]);
    MX.taper(o, [[0, -44], [0.5, -20], [0, 0], [0, 12], [0, 16]], 12.5, 18, stalk, 'rgba(110,100,80,0.6)');
    for (let i = 0; i < 16; i++) { const x = -5 + R() * 10; MX.line(o, [[x, -40 + R() * 20], [x + (R() - 0.5), -10 + R() * 20]], 'rgba(160,150,130,0.35)', 0.3); }
    o.fillStyle = MX.lin(o, 0, -34, 0, -20, [[0, '#FAF8F2'], [1, '#D6CEBC']]);
    o.beginPath(); o.moveTo(-7, -33); o.bezierCurveTo(-12, -30, -14, -24, -12, -21); o.bezierCurveTo(-5, -18, 5, -18, 12, -21); o.bezierCurveTo(14, -24, 12, -30, 7, -33); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(130,120,100,0.6)'; o.lineWidth = 0.4; o.stroke();
    for (let k = -3; k <= 3; k++) MX.line(o, [[k * 2, -32], [k * 3.4, -20]], 'rgba(170,160,140,0.5)', 0.3);
    // gills: seen from just below the rim, radiating from the stalk to the edge
    o.save(); o.beginPath(); o.ellipse(0, -44, 66, 13, 0, 0, TAU); o.clip();
    o.fillStyle = MX.rad(o, 0, -44, 4, 66, [[0, '#5A3A2E'], [0.6, '#8A5A48'], [1, '#B07E68']]); o.fillRect(-70, -60, 140, 32);
    for (let i = 0; i < 150; i++) {
      const a = (i + 0.5) / 150 * TAU, r0 = i % 2 ? 0.1 : (i % 4 === 2 ? 0.45 : 0.72), ex = Math.cos(a) * 66, ey = -44 + Math.sin(a) * 13;
      MX.line(o, [[ex * r0, -44 + (ey + 44) * r0], [ex, ey]], i % 2 ? 'rgba(60,34,26,0.75)' : 'rgba(80,48,36,0.6)', 0.45);
      MX.line(o, [[ex * r0 + 0.4, -44 + (ey + 44) * r0 + 0.2], [ex + 0.4, ey + 0.2]], 'rgba(214,170,150,0.3)', 0.25);
    }
    o.restore();
    // the stalk hides the far gills below the centre
    MX.taper(o, [[0, -44], [0.3, -36]], 12.5, 12.6, stalk);
    // cap: a pale dome with brown fibrous scales, the edge still fringed with torn veil
    const top = []; for (let i = 0; i <= 40; i++) { const x = -68 + i * 3.4; top.push([x, -44 - 58 * Math.pow(Math.max(0, 1 - (x / 68) ** 2), 0.55)]); }
    const capPath = () => { o.beginPath(); o.moveTo(top[0][0], top[0][1]); for (const p of top) o.lineTo(p[0], p[1]); o.ellipse(0, -44, 68, 13.5, 0, 0, -Math.PI, true); o.closePath(); };
    o.fillStyle = 'rgba(20,14,8,0.3)'; o.save(); o.translate(4, 6); capPath(); o.fill(); o.restore();
    o.fillStyle = MX.lit(o, -10, -80, 78, '#D2B894', 0.38, 0.5, -0.4, -0.5); capPath(); o.fill();
    o.save(); capPath(); o.clip();
    for (let i = 0; i < 700; i++) {
      const x = (R() - 0.5) * 136, yTop = -44 - 58 * Math.pow(Math.max(0, 1 - (x / 68) ** 2), 0.55), y = yTop + R() * (-44 - 13 * Math.sqrt(Math.max(0, 1 - (x / 68) ** 2)) - yTop + 2);
      const dx = x, dy = y + 102, d = Math.hypot(dx, dy) || 1, near = Math.exp(-d / 40), l = 1.2 + R() * 3;
      o.strokeStyle = `rgba(${100 + R() * 30 | 0},${62 + R() * 20 | 0},${38},${(0.25 + near * 0.55).toFixed(2)})`; o.lineWidth = 0.5 + R() * 0.7;
      o.beginPath(); o.moveTo(x, y); o.lineTo(x + dx / d * l, y + dy / d * l); o.stroke();
    }
    o.restore();
    o.strokeStyle = 'rgba(90,64,40,0.6)'; o.lineWidth = 0.5; capPath(); o.stroke();
    for (let i = 0; i < 26; i++) { const a = Math.PI + (i + 0.5) / 26 * Math.PI, x = Math.cos(a) * 67, y = -44 + Math.sin(a) * 13.2; o.fillStyle = 'rgba(246,242,232,0.85)'; o.beginPath(); o.moveTo(x - 2, y); o.lineTo(x + (R() - 0.5) * 2, y + 2 + R() * 2.5); o.lineTo(x + 2, y); o.closePath(); o.fill(); }
    // a young button pushing up beside it
    MX.taper(o, [[58, 12], [58, 2]], 7, 6, stalk);
    o.fillStyle = MX.lit(o, 56, -2, 12, '#E2D2B6', 0.4, 0.4); o.beginPath(); o.ellipse(58, 0, 11, 8.5, 0, Math.PI, TAU); o.quadraticCurveTo(58, 6, -11 + 58, 0); o.fill();
    o.strokeStyle = 'rgba(110,90,60,0.5)'; o.lineWidth = 0.4; o.stroke();
    // leaves lying against the stalk's foot
    for (const [x, a] of [[-12, 0.2], [10, -0.3], [4, 3.1]]) ECO.leaf(o, R, x, surf(x) + 3, a, 12, U.pick(['#8A5A2A', '#A8743A', '#6E4A26'], R()));
    MX.vignette(o, 0.14); MX.grain(o, 0.04);
    MX.scaleBar(o, 34, '2 cm');
  },
});

// ================================================================ ×400 section through two gills
// Each gill is a sheet of interwoven hyphae; its surfaces are lined with club-shaped basidia, each growing four
// spores on thin prongs. Ripe spores drop into the gap and fall out of the cap.
// spots: basidium (-31,-40) · spores (13,30)
const GILL = {
  basid(o, R, x0, y0, d, L, mature) {
    o.save(); o.translate(x0, y0); o.scale(d, 1);
    const w0 = 1.8, w1 = mature ? 3.9 : 3.3;
    o.fillStyle = MX.lin(o, 0, -w1, 0, w1, [[0, '#DCCCA8'], [0.4, '#F6EEDA'], [1, '#CDB892']]);
    o.beginPath(); o.moveTo(0, -w0); o.bezierCurveTo(L * 0.4, -w0, L * 0.55, -w1, L - w1, -w1); o.arc(L - w1, 0, w1, -Math.PI / 2, Math.PI / 2); o.bezierCurveTo(L * 0.55, w1, L * 0.4, w0, 0, w0); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(110,84,50,0.75)'; o.lineWidth = 0.32; o.stroke();
    for (let i = 0; i < 7; i++) { o.fillStyle = R() < 0.3 ? 'rgba(255,250,230,0.8)' : 'rgba(150,120,70,0.35)'; o.beginPath(); o.arc(L * 0.3 + R() * L * 0.6, (R() - 0.5) * w1 * 1.2, 0.3 + R() * 0.35, 0, TAU); o.fill(); }
    if (mature) {
      for (const [dy, vis] of [[-0.9, 0.4], [2.6, 0.4], [-2.6, 1], [0.9, 1]]) {
        const ex = L + 3.4, ey = dy * 1.3;
        o.globalAlpha = vis; o.strokeStyle = '#C4AE82'; o.lineWidth = 0.6; o.lineCap = 'round';
        o.beginPath(); o.moveTo(L - 0.8, dy * 0.7); o.quadraticCurveTo(L + 2, dy * 1.05, ex, ey); o.stroke();
        o.save(); o.translate(ex + 2, ey + dy * 0.25); o.rotate(dy * 0.12);
        o.fillStyle = MX.lit(o, 0, 0, 2.4, '#5A3A2C', 0.3, 0.4); o.beginPath(); o.ellipse(0, 0, 2.3, 1.55, 0, 0, TAU); o.fill();
        o.strokeStyle = 'rgba(40,24,16,0.8)'; o.lineWidth = 0.2; o.stroke();
        o.restore(); o.globalAlpha = 1;
      }
    }
    o.restore();
  },
  spore(o, x, y, a, k = 1) {
    o.save(); o.translate(x, y); o.rotate(a);
    o.fillStyle = MX.lit(o, 0, 0, 2.4 * k, '#5A3A2C', 0.3, 0.4); o.beginPath(); o.ellipse(0, 0, 2.3 * k, 1.55 * k, 0, 0, TAU); o.fill();
    o.fillStyle = 'rgba(40,24,16,0.8)'; o.beginPath(); o.arc(-2.2 * k, 0.4 * k, 0.4 * k, 0, TAU); o.fill();
    o.restore();
  },
  drift: [[13, 30], [8, 25], [18, 24], [10, 36], [17, 35], [4, 31], [-12, -60], [-4, -18], [-16, 72], [6, 108], [14, -96], [-8, 128]],
};
plate('gill', {
  still(o, st) {
    const R = MX.rng(211);
    MX.field(o, '#F1EBDD', '#D8CDB6', 21, 0.012, 60);
    MX.layer(o, x => { for (let i = 0; i < 40; i++) GILL.spore(x, -20 + R() * 40, -140 + R() * 280, R() * 3, 1.2); }, 2.4, 0.45);
    for (const s of [-1, 1]) {
      const cx = s * 80, half = 28, d = -s, face = cx + d * half;
      // trama: long hyphal cells running down the gill, loosely interwoven
      o.save(); o.beginPath(); o.rect(cx - half, -141, 2 * half, 282); o.clip();
      o.fillStyle = '#E0D2B0'; o.fillRect(cx - half, -141, 2 * half, 282);
      for (let col = cx - half - 2; col < cx + half + 2; col += 4.6) {
        for (let y = -150 + R() * 20; y < 150;) {
          const l = 16 + R() * 18, a = Math.PI / 2 + (R() - 0.5) * 0.25, x = col + (R() - 0.5) * 2;
          MX.rod(o, x, y + l / 2, a, l, 4.2, U.mix('#EEE4CA', '#D6C49E', R()), 'rgba(130,104,64,0.6)');
          y += l + 0.4;
        }
      }
      o.restore();
      // subhymenium: a band of small rounded cells
      const sites = MX.scatter(R, 260, 2.6, [face - (d > 0 ? 7 : 0), -141, 7, 282]);
      for (const c of MX.voronoi(sites, U.rectPts(face - (d > 0 ? 7 : 0), -145, 7, 290))) { if (c.length < 3) continue; const sh = MX.soft(MX.inset(c, 0.35), 0.3); MX.fill(o, sh, '#F0E6CC'); o.strokeStyle = 'rgba(130,104,64,0.5)'; o.lineWidth = 0.25; MX.path(o, sh); o.stroke(); }
      // the hymenium: young cells first, then the ripe basidia on top
      const row = [];
      for (let y = -143; y < 146; y += 3.9 + R() * 0.8) row.push([y, R() < 0.38]);
      if (s < 0) { for (const r of row) if (Math.abs(r[0] + 40) < 3) r[1] = false; row.push([-40, 'hero']); }
      for (const [y, m] of row) if (!m) GILL.basid(o, R, face - d * 1.5, y, d, 11 + R() * 5, false);
      for (const [y, m] of row) if (m) GILL.basid(o, R, face - d * 1.5, y, d, m === 'hero' ? 23.5 : 19 + R() * 4, true);
      // a few long, pointed sterile cells (cystidia) poke out beyond the rest
      for (let k = 0; k < 4; k++) { const y = -120 + k * 70 + R() * 20; if (Math.abs(y + 40) < 10) continue; MX.taper(o, [[face - d * 1.5, y], [face + d * 14, y + 0.5], [face + d * 28, y]], 3.6, 0.6, 'rgba(246,242,228,0.85)', 'rgba(120,100,70,0.6)'); }
    }
    // spores that have been shot off, falling through the gap
    for (const [x, y] of GILL.drift) GILL.spore(o, x, y, R() * 3);
    MX.vignette(o, 0.18); MX.grain(o, 0.05);
    MX.scaleBar(o, 50, '50 µm');
  },
  live(x, st, t) {
    for (let i = 0; i < 7; i++) { const y = -150 + ((t * 9 + i * 43) % 300), px = -14 + (i * 13) % 28 + Math.sin(t * 0.8 + i) * 2; GILL.spore(x, px, y, t * 0.5 + i, 1); }
  },
});

// ================================================================ ×1 a soil pit face
// Leaf litter (O), dark topsoil rich in humus (A), browner subsoil where clay and iron collect (B), and broken-up
// parent rock (C), with a worm in its burrow and plant roots reaching down.
// spots: humus (90,-60) · earthworm (-70,-34) · roots (56,-40)
const SOILP = {
  g0: x => -100 + MX.n(x * 0.02, 1) * 2.5,
  g1: x => -91 + MX.n(x * 0.05, 2) * 2.5,
  g2: x => -6 + MX.n(x * 0.012, 3) * 9 + MX.n(x * 0.08, 33) * 2.5,
  g3: x => 74 + MX.n(x * 0.015, 4) * 10 + MX.n(x * 0.09, 44) * 3,
  burrow: [[-104, -99], [-99, -82], [-91, -64], [-80, -47], [-66, -35], [-50, -30], [-36, -20], [-30, -2], [-34, 18], [-30, 40]],
  tap: [[56, -100], [55, -80], [57, -60], [56, -40], [54, -20], [57, 0], [55, 20], [52, 44]],
};
plate('soil', {
  still(o, st) {
    const R = MX.rng(221), S = SOILP;
    // sky and the meadow beyond
    o.fillStyle = MX.lin(o, 0, -141, 0, -100, [[0, '#A9C6D6'], [1, '#E2ECE6']]); o.fillRect(-141, -141, 282, 45);
    MX.layer(o, x => {
      for (let i = 0; i < 6; i++) { x.fillStyle = U.pick(['#5E7A42', '#4A6636', '#6E8A4E'], R()); x.beginPath(); x.ellipse(-150 + i * 60 + R() * 20, -118, 20 + R() * 16, 10 + R() * 8, 0, 0, TAU); x.fill(); }
      x.fillStyle = '#8AA466'; x.beginPath(); x.moveTo(-141, -112); for (let px = -141; px <= 141; px += 6) x.lineTo(px, -113 + MX.n(px * 0.02, 9) * 4); x.lineTo(141, -96); x.lineTo(-141, -96); x.closePath(); x.fill();
    }, 3, 1);
    // the cut face, one texture: colour follows depth, the horizon boundaries are wavy and diffuse, and the
    // subsoil carries rusty iron mottles
    const Oc = [44, 32, 22], Ac = [54, 40, 28], Bc = [142, 100, 60], Cc = [178, 160, 126];
    MX.tex(o, -141, -104, 282, 245, (x, y) => {
      if (y < S.g0(x) - 1) return null;
      const f = U.fbm(x * 0.05, y * 0.05, 4, 5), n = U.noise(x * 0.35, y * 0.35, 6), j = (f - 0.5) * 14;
      let c;
      if (y < S.g1(x)) c = Oc;
      else {
        const tAB = U.clamp((y - S.g2(x) - j) / 16 + 0.5, 0, 1), tBC = U.clamp((y - S.g3(x) - j) / 12 + 0.5, 0, 1);
        const mott = U.clamp((U.fbm(x * 0.08 + 9, y * 0.08, 3, 7) - 0.6) * 5, 0, 1) * (1 - tBC);
        const a = Ac.map(v => v * (1 + (y + 91) / 260)), b = Bc.map((v, i) => v + [50, 8, -24][i] * mott);
        c = a.map((v, i) => v + (b[i] - v) * tAB).map((v, i) => v + (Cc[i] - v) * tBC);
      }
      const k = 0.78 + f * 0.36 + (n - 0.5) * 0.22;
      return [c[0] * k, c[1] * k, c[2] * k, 255];
    }, 240);
    const inA = (x, y) => y > S.g1(x) + 2 && y < S.g2(x) - 4, inB = (x, y) => y > S.g2(x) + 4 && y < S.g3(x) - 4, inC = (x, y) => y > S.g3(x) + 3;
    // topsoil: crumbs, pores and specks of humus
    for (let i = 0; i < 900; i++) {
      const x = -141 + R() * 282, y = -92 + R() * 90; if (!inA(x, y)) continue;
      const r = 0.6 + R() * 2.2; o.fillStyle = MX.lit(o, x, y, r, U.pick(['#4A3624', '#5E4630', '#3A2A1C', '#6A5236'], R()), 0.3, 0.4); o.beginPath(); o.ellipse(x, y, r, r * (0.6 + R() * 0.4), R() * 3, 0, TAU); o.fill();
    }
    MX.dots(o, R, 500, [-141, -92, 282, 92], 0.3, 1.1, 'rgba(10,6,2,0.7)', inA);
    for (let i = 0; i < 120; i++) { const x = 60 + R() * 70, y = -86 + R() * 60; if (!inA(x, y)) continue; o.fillStyle = U.pick(['#1E140C', '#2A1C10', '#6A4A26'], R()); o.beginPath(); MX.curve(o, MX.blob(x, y, 0.8 + R() * 1.8, 0.5 + R(), { seed: i, wob: 0.4, n: 7 })); o.fill(); }
    for (let i = 0; i < 18; i++) { const x = 50 + R() * 80, y = -88 + R() * 70; if (!inA(x, y)) continue; ECO.leaf(o, R, x, y, R() * TAU, 3 + R() * 3, U.pick(['#5A3E22', '#4A3018'], R())); }
    // subsoil: blocky structure with cracks, and a few stones
    for (let i = 0; i < 16; i++) { const x0 = -135 + i * 18 + R() * 8; MX.line(o, MX.strand(R, x0, S.g2(x0) + 2, Math.PI / 2 + (R() - 0.5) * 0.3, 40 + R() * 40, 4, 0.5, Math.PI / 2), 'rgba(50,30,16,0.55)', 0.4 + R() * 0.5); }
    for (let i = 0; i < 26; i++) { const x = -141 + R() * 282, y = -4 + R() * 80; if (!inB(x, y)) continue; MX.line(o, [[x, y], [x + (R() - 0.5) * 14, y + (R() - 0.5) * 4]], 'rgba(50,30,16,0.4)', 0.4); }
    for (let i = 0; i < 16; i++) { const x = -141 + R() * 282, y = -4 + R() * 80; if (inB(x, y)) ECO.stone(o, R, x, y, 1.5 + R() * 3, U.pick(['#9A8C74', '#B0A48C', '#7A6E5C'], R())); }
    // weathered parent rock
    const rocks = MX.scatter(R, 60, 11, [-150, 60, 300, 90], inC);
    for (const [x, y] of rocks) { const r = 4 + R() * 10, p = ECO.stone(o, R, x, y, r, U.pick(['#B8AC94', '#A09682', '#C8BCA2', '#8A806E', '#9C8E76'], R())); if (R() < 0.5) MX.line(o, [p[1], MX.centroid(p), p[6]], 'rgba(60,50,40,0.4)', 0.35); }
    // roots: fine grass roots from the turf, and a taproot with its side roots
    for (let i = 0; i < 60; i++) { const x = -141 + R() * 282; MX.line(o, MX.strand(R, x, S.g0(x) + 2, Math.PI / 2 + (R() - 0.5) * 0.6, 20 + R() * R() * 100, 3, 0.45, Math.PI / 2), 'rgba(214,196,156,' + (0.5 + R() * 0.35).toFixed(2) + ')', 0.3 + R() * 0.45); }
    MX.taper(o, S.tap, 5, 1, MX.lin(o, 50, 0, 62, 0, [[0, '#B09470'], [0.4, '#E6D2AA'], [1, '#A88A62']]), 'rgba(90,70,40,0.6)');
    for (let k = 0; k < 14; k++) { const [x, y, a] = MX.along(S.tap, 0.15 + k * 0.058), s = k % 2 ? 1 : -1; MX.line(o, MX.strand(R, x, y, a + s * (1 + R() * 0.4), 12 + R() * 20, 2.5, 0.5, Math.PI / 2), 'rgba(222,204,164,0.85)', 0.5); }
    // the earthworm's burrow and the worm inside it
    MX.line(o, S.burrow, 'rgba(60,40,24,0.8)', 8.5); MX.line(o, S.burrow, '#140C06', 6.2);
    const worm = []; for (let t = 0.16; t <= 0.64; t += 0.02) { const [x, y] = MX.along(S.burrow, t); worm.push([x, y]); }
    MX.taper(o, worm, 3.2, 4.4, MX.lin(o, -90, -64, -40, -26, [[0, '#A8605A'], [1, '#C07C70']]), 'rgba(70,30,26,0.7)');
    for (let k = 1; k < 60; k++) { const [x, y, a] = MX.along(worm, k / 60), w = k / 60 > 0.68 && k / 60 < 0.8 ? 2.6 : 2, n = a + Math.PI / 2; o.strokeStyle = 'rgba(80,36,32,0.4)'; o.lineWidth = 0.28; o.beginPath(); o.moveTo(x + Math.cos(n) * w, y + Math.sin(n) * w); o.lineTo(x - Math.cos(n) * w, y - Math.sin(n) * w); o.stroke(); }
    MX.taper(o, worm.slice(Math.round(worm.length * 0.68), Math.round(worm.length * 0.82)), 5.2, 5.2, 'rgba(222,150,130,0.85)');
    MX.line(o, worm.map(([x, y]) => [x - 0.6, y - 1.1]), 'rgba(255,225,215,0.45)', 0.8);
    // casts at the burrow mouth
    for (let k = 0; k < 7; k++) MX.tube(o, [[-110 + k * 1.5, -100 - k * 1.2], [-104 + k, -103 - k * 1.3], [-98 - k * 0.5, -100 - k * 1.1]], 3, '#3A2A1C');
    // leaf litter and turf on top
    for (let i = 0; i < 60; i++) { const x = -150 + R() * 300; ECO.leaf(o, R, x, S.g0(x) + 3 + R() * 5, R() * TAU, 5 + R() * 7, U.pick(['#7A5028', '#9A6A34', '#5E3E20', '#B08040'], R())); }
    for (let i = 0; i < 260; i++) {
      const x = -141 + R() * 282, y = S.g0(x) + 1, h = 8 + R() * 22, b = (R() - 0.5) * 8;
      o.strokeStyle = U.pick(['#5E8A34', '#7AA244', '#4A7428', '#8EB058'], R()); o.lineWidth = 0.5 + R() * 0.6; o.lineCap = 'round';
      o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + b * 0.3, y - h * 0.6, x + b, y - h); o.stroke();
    }
    // the plant on the taproot: a dandelion rosette with a flower
    for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.45; MX.taper(o, [[56, -100], [56 + Math.cos(a) * 10, -100 + Math.sin(a) * 8], [56 + Math.cos(a) * 20, -100 + Math.sin(a) * 14]], 1, 4, '#4E8030', 'rgba(40,70,20,0.6)'); }
    MX.line(o, [[56, -100], [58, -116], [60, -128]], '#6A9A3A', 1);
    for (let k = 0; k < 18; k++) { const a = k / 18 * TAU; MX.line(o, [[60, -130], [60 + Math.cos(a) * 5, -130 + Math.sin(a) * 3.2]], k % 2 ? '#F2C22A' : '#E8A818', 1.2); }
    MX.ball(o, 60, -130, 1.8, '#E8A818', 0.3, 0.3);
    // horizon letters, as a soil scientist marks a pit
    for (const [l, y] of [['O', -95.5], ['A', -52], ['B', 34], ['C', 104]]) { o.fillStyle = 'rgba(244,240,228,0.9)'; U.rr(o, -136, y - 5.5, 11, 11, 2); o.fill(); MX.text(o, l, -130.5, y + 0.5, 8, '#1B1A17'); }
    MX.vignette(o, 0.12); MX.grain(o, 0.05);
    MX.scaleBar(o, 46, '10 cm');
  },
});

// ================================================================ ×40 a pinch of soil under the dissecting microscope
// Mineral grains of every kind, rotting plant scraps, fungal threads, a roundworm and a springtail; the bacteria
// are far too small at this power, so a window shows them at ×1000.
// spots: bacteria (-84,-96) · nematode (-20,-46) · springtail (70,86)
const SOILM = {
  // the worm's resting line; it wriggles about it
  nema: { x: -20, y: -46, a: 0.32, L: 130 },
  nemaPts(t) {
    const N = SOILM.nema, ca = Math.cos(N.a), sa = Math.sin(N.a), p = [];
    for (let i = 0; i <= 40; i++) { const u = (i / 40 - 0.5) * N.L, w = Math.sin(u * 0.09 - t * 3.2) * 7 * (0.4 + Math.abs(u) / N.L); p.push([N.x + u * ca - w * sa, N.y + u * sa + w * ca]); }
    return p;
  },
  nemaDraw(x, t) {
    const p = SOILM.nemaPts(t);
    MX.taper(x, p.slice(0, 21), 0.8, 4.2, 'rgba(236,228,204,0.8)', 'rgba(90,76,50,0.8)');
    MX.taper(x, p.slice(20), 4.2, 0.5, 'rgba(236,228,204,0.8)', 'rgba(90,76,50,0.8)');
    MX.line(x, p.slice(6, 38), 'rgba(120,96,56,0.55)', 1.2);
    const [bx, by] = p[36]; x.fillStyle = 'rgba(140,110,70,0.8)'; x.beginPath(); x.arc(bx, by, 1.5, 0, TAU); x.fill();
    MX.line(x, p.slice(36, 40), 'rgba(120,96,56,0.6)', 0.5);
  },
};
plate('soilMicro', {
  still(o, st) {
    const R = MX.rng(231);
    MX.field(o, '#46382A', '#221A12', 23, 0.012, 130);
    MX.layer(o, x => { MX.dots(x, R, 500, [-141, -141, 282, 282], 0.5, 1.8, 'rgba(160,130,90,0.5)'); for (let i = 0; i < 20; i++) ECO.stone(x, R, -141 + R() * 282, -141 + R() * 282, 4 + R() * 10, '#6A5A44'); }, 2.2, 0.8);
    // mineral grains lit from above: glassy quartz, rust-coated grains, dark mica and pink feldspar
    const grains = MX.scatter(R, 46, 30, [-150, -150, 300, 300], (x, y) => Math.hypot(x - 72, y - 86) > 40 && Math.hypot(x + 84, y + 96) > 30);
    for (const [gx, gy] of grains) {
      const kind = R(), r = 7 + R() * 15, p = MX.blob(gx, gy, r, r * (0.6 + R() * 0.35), { seed: Math.round(gx * 3 + gy), wob: 0.2, n: 12, rot: R() * 3, fq: 1.2 });
      o.fillStyle = 'rgba(0,0,0,0.4)'; o.beginPath(); U.poly(o, p.map(([a, b]) => [a + r * 0.1, b + r * 0.15]), true); o.fill();
      if (kind < 0.45) {
        o.fillStyle = MX.rad(o, gx - r * 0.25, gy - r * 0.3, r * 0.1, r * 1.1, [[0, 'rgba(250,246,232,0.95)'], [0.5, 'rgba(214,202,176,0.85)'], [1, 'rgba(120,104,80,0.9)']]);
        o.beginPath(); U.poly(o, p, true); o.fill();
        for (let k = 0; k < 2; k++) MX.line(o, MX.strand(R, gx + (R() - 0.5) * r, gy + (R() - 0.5) * r * 0.5, R() * TAU, r * 0.8, 2, 0.6), 'rgba(255,255,255,0.4)', 0.3);
      } else if (kind < 0.7) { o.fillStyle = MX.lit(o, gx, gy, r, '#A85E34', 0.3, 0.5); o.beginPath(); U.poly(o, p, true); o.fill(); MX.dots(o, R, 20, [gx - r, gy - r, r * 2, r * 2], 0.3, 0.8, 'rgba(70,30,10,0.5)', (x, y) => U.inPoly(x, y, p)); }
      else if (kind < 0.85) { o.fillStyle = MX.lit(o, gx, gy, r, '#3A342E', 0.4, 0.4); o.beginPath(); U.poly(o, p, true); o.fill(); for (let k = -2; k <= 2; k++) MX.line(o, [[gx - r * 0.6, gy + k * r * 0.18], [gx + r * 0.6, gy + k * r * 0.18 + 1]], 'rgba(200,200,190,0.25)', 0.4); }
      else { o.fillStyle = MX.lit(o, gx, gy, r, '#D2AE96', 0.3, 0.45); o.beginPath(); U.poly(o, p, true); o.fill(); for (let k = -2; k <= 2; k++) MX.line(o, [[gx + k * r * 0.2 - 2, gy - r * 0.5], [gx + k * r * 0.2 + 2, gy + r * 0.5]], 'rgba(140,100,80,0.35)', 0.35); }
      o.fillStyle = 'rgba(255,255,255,0.75)'; o.beginPath(); o.ellipse(gx - r * 0.35, gy - r * 0.3, r * 0.14, r * 0.07, -0.6, 0, TAU); o.fill();
    }
    // rotting plant scraps, their cell walls still showing
    for (let i = 0; i < 6; i++) {
      const cx = -120 + R() * 240, cy = -120 + R() * 240; if (Math.hypot(cx - 72, cy - 86) < 45 || Math.hypot(cx + 84, cy + 96) < 42) continue;
      const a = R() * 3, l = 20 + R() * 20;
      o.save(); o.translate(cx, cy); o.rotate(a);
      const p = MX.blob(0, 0, l / 2, 5 + R() * 3, { seed: i + 50, wob: 0.25, n: 14 });
      MX.fill(o, p, MX.lin(o, 0, -6, 0, 6, [[0, '#6A4A26'], [1, '#4A3218']]));
      o.save(); MX.path(o, p); o.clip();
      for (let u = -l / 2; u < l / 2; u += 3.5) MX.line(o, [[u, -8], [u + 0.5, 8]], 'rgba(150,110,60,0.5)', 0.35);
      for (const v of [-2.5, 0, 2.5]) MX.line(o, [[-l / 2, v], [l / 2, v]], 'rgba(150,110,60,0.5)', 0.35);
      o.restore(); o.restore();
    }
    // fungal threads spanning the grains
    for (let i = 0; i < 16; i++) { const s = MX.strand(R, -150 + R() * 300, -150 + R() * 300, R() * TAU, 60 + R() * 120, 3, 0.35); MX.line(o, s, 'rgba(236,230,214,0.55)', 0.55); for (let k = 0; k < 3; k++) { const [x, y, a] = MX.along(s, R()); MX.line(o, MX.strand(R, x, y, a + (R() - 0.5) * 2, 10 + R() * 20, 2, 0.4), 'rgba(236,230,214,0.45)', 0.4); } }
    // springtail, side view: antennae forward, forked jumping organ (furcula) folded under the belly
    o.save(); o.translate(74, 88); o.rotate(-0.08);
    const body = [[-46, -4], [-38, -12], [-24, -14], [-6, -15], [14, -16], [32, -14], [46, -8], [50, 0], [44, 8], [26, 11], [6, 11], [-14, 10], [-30, 9], [-42, 6], [-50, 2]];
    for (const [lx, ly, a] of [[-28, 8, 1.9], [-16, 9, 1.7], [-4, 10, 1.5]]) { MX.taper(o, [[lx, ly], [lx + Math.cos(a) * 8, ly + Math.sin(a) * 8], [lx + Math.cos(a) * 8 - 4, ly + 16]], 3, 1.2, '#8E8AA0', 'rgba(40,36,50,0.6)'); }
    MX.fill(o, body, MX.lin(o, 0, -16, 0, 11, [[0, '#5E5A74'], [0.55, '#9A96AE'], [1, '#D8D6E2']]));
    o.save(); MX.path(o, body); o.clip();
    for (let k = 0; k < 9; k++) { const x = -34 + k * 10; MX.line(o, [[x, -18], [x - 1, 12]], 'rgba(40,36,56,0.45)', 0.5); }
    MX.dots(o, R, 70, [-50, -16, 100, 16], 0.5, 1.6, 'rgba(40,34,60,0.55)');
    o.restore();
    o.strokeStyle = 'rgba(230,228,240,0.6)'; o.lineWidth = 0.3; for (let k = 0; k < 50; k++) { const [x, y, a] = MX.along(body.concat([body[0]]), R()); o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a - 1.2) * 2.6, y + Math.sin(a - 1.2) * 2.6); o.stroke(); }
    MX.taper(o, [[32, 11], [18, 15], [-2, 16], [-10, 15]], 2.6, 1.4, 'rgba(210,206,222,0.95)', 'rgba(60,56,76,0.7)');
    MX.taper(o, [[-30, 9], [-30, 13]], 3, 3.6, '#C8C4D6');
    for (const [a0, a1] of [[-2.9, -2.6], [-2.7, -2.95]]) { const pts = [[-48, -6]]; for (let k = 1; k <= 4; k++) pts.push([-48 + Math.cos(a0 + (a1 - a0) * k / 4) * 9 * k, -6 + Math.sin(a0 + (a1 - a0) * k / 4) * 9 * k]); MX.taper(o, pts, 2.4, 1.2, '#6E6A86', 'rgba(30,26,40,0.7)'); }
    o.fillStyle = '#141018'; o.beginPath(); o.ellipse(-40, -6, 3, 2.2, 0, 0, TAU); o.fill();
    o.restore();
    // bacteria window
    MX.loupe(o, -84, -96, 36, [-44, -58], '×1000', x => {
      x.fillStyle = '#7A6A56'; x.fillRect(-40, -40, 80, 80);
      x.fillStyle = MX.lin(x, 0, -10, 0, 40, [[0, '#C8B894'], [1, '#9A8A6C']]); x.beginPath(); x.moveTo(-40, 6); x.bezierCurveTo(-10, -4, 12, 10, 40, 0); x.lineTo(40, 40); x.lineTo(-40, 40); x.closePath(); x.fill();
      x.fillStyle = 'rgba(230,236,220,0.35)'; x.beginPath(); x.ellipse(-6, 4, 22, 8, -0.1, 0, TAU); x.fill();
      for (let i = 0; i < 60; i++) { const bx = -34 + R() * 68, by = -2 + R() * 16 - Math.abs(bx) * 0.08; if (R() < 0.35) MX.ball(x, bx, by, 1, '#3A3026', 0.3, 0.3); else MX.rod(x, bx, by, R() * TAU, 3.6, 1.4, '#3A3026', 'rgba(255,255,255,0.3)'); }
      for (let i = 0; i < 3; i++) { const s = MX.strand(R, -30 + R() * 60, -30 + R() * 20, R() * TAU, 30, 2, 0.5); MX.line(x, s, 'rgba(60,50,40,0.8)', 0.7); const [px, py, a] = MX.along(s, 0.5); MX.line(x, [[px, py], [px + Math.cos(a + 0.8) * 8, py + Math.sin(a + 0.8) * 8]], 'rgba(60,50,40,0.8)', 0.6); }
    });
    MX.vignette(o, 0.3); MX.grain(o, 0.06);
    MX.scaleBar(o, 50, '0.5 mm', true);
  },
  live(x, st, t) { SOILM.nemaDraw(x, t); },
});

// ================================================================ ×400 a drop of pond water
// spots: Spirogyra (-30,-56) · diatom (92,-80) · Paramecium (40,10) · Daphnia (-70,76) · cyanobacteria (84,96)
const DROP = {
  para: { x: 40, y: 10, a: 0.35, L: 76, W: 25 },
  daph: { x: -118, y: 112, a: -0.75 },
  paraBody() {
    const P = DROP.para, pts = [];
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * TAU, c = Math.cos(a), s = Math.sin(a), x = c * P.L / 2;
      let y = s * P.W / 2 * (1 + 0.14 * c) * (1 - 0.1 * Math.pow(Math.max(0, -c), 3));
      if (s > 0) y -= P.W * 0.16 * Math.exp(-(((x + 4) / 13) ** 2));
      pts.push([x, y]);
    }
    return pts;
  },
  spiro(o, R, a, b, w, cellL) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    o.save(); o.translate(a[0], a[1]); o.rotate(Math.atan2(b[1] - a[1], b[0] - a[0]));
    o.fillStyle = MX.lin(o, 0, -w / 2, 0, w / 2, [[0, 'rgba(130,180,110,0.4)'], [0.5, 'rgba(226,244,214,0.3)'], [1, 'rgba(120,170,100,0.45)']]); o.fillRect(0, -w / 2, L, w);
    const walls = [0]; for (let u = cellL * (0.4 + R() * 0.6); u < L; u += cellL * (0.85 + R() * 0.3)) walls.push(u); walls.push(L);
    for (let c = 0; c < walls.length - 1; c++) {
      const u0 = walls[c] + 1, u1 = walls[c + 1] - 1, ph = R() * TAU, pitch = 11 + R() * 2, amp = w / 2 - 2.4;
      const pt = u => [u, amp * Math.sin((u - u0) / pitch * TAU + ph)], front = u => Math.cos((u - u0) / pitch * TAU + ph) > 0;
      for (const pass of [false, true]) {
        o.lineCap = 'round';
        for (let u = u0; u < u1; u += 0.7) {
          if (front(u) !== pass) continue;
          const p = pt(u), q = pt(Math.min(u1, u + 0.8));
          o.strokeStyle = pass ? '#3A8A2C' : 'rgba(90,150,70,0.35)'; o.lineWidth = pass ? 2.6 : 2.2;
          o.beginPath(); o.moveTo(p[0], p[1]); o.lineTo(q[0], q[1]); o.stroke();
        }
      }
      for (let u = u0 + 2; u < u1; u += 5.5) if (front(u)) { const [px, py] = pt(u); o.fillStyle = 'rgba(236,250,226,0.9)'; o.beginPath(); o.arc(px, py, 0.8, 0, TAU); o.fill(); o.strokeStyle = 'rgba(40,80,30,0.7)'; o.lineWidth = 0.2; o.stroke(); }
      const m = (u0 + u1) / 2; o.fillStyle = 'rgba(200,210,190,0.7)'; o.beginPath(); o.ellipse(m, 0, 2.6, 1.8, 0, 0, TAU); o.fill(); o.strokeStyle = 'rgba(80,90,70,0.6)'; o.lineWidth = 0.3; o.stroke();
      for (const s of [-1, 1]) MX.line(o, [[m + s * 2.4, 0], [m + s * 6, s * 3], [m + s * 9, s * (w / 2 - 1)]], 'rgba(160,190,150,0.35)', 0.3);
    }
    for (const u of walls.slice(1, -1)) MX.line(o, [[u, -w / 2], [u, w / 2]], 'rgba(60,100,50,0.7)', 0.5);
    for (const s of [-1, 1]) { MX.line(o, [[0, s * w / 2], [L, s * w / 2]], 'rgba(60,100,50,0.8)', 0.6); MX.line(o, [[0, s * (w / 2 - 0.7)], [L, s * (w / 2 - 0.7)]], 'rgba(255,255,255,0.4)', 0.4); }
    o.restore();
  },
  // lateral view of a water flea, head towards +x; parts outside the field are simply cut off
  daphnia(o, R) {
    const D = DROP.daph;
    o.save(); o.translate(D.x, D.y); o.rotate(D.a);
    const cara = [[36, -30], [10, -36], [-24, -36], [-50, -30], [-60, -22], [-58, 0], [-50, 22], [-30, 38], [0, 44], [24, 38], [38, 22], [44, 4]];
    const head = MX.blob(50, -6, 24, 22, { seed: 61, wob: 0.05, n: 24 });
    // the swimming antennae, branched and fringed with bristles
    for (const [base, a0] of [[[44, -24], -1.9], [[40, -26], -2.3]]) {
      const shaft = [base, [base[0] + Math.cos(a0) * 16, base[1] + Math.sin(a0) * 16], [base[0] + Math.cos(a0) * 30, base[1] + Math.sin(a0) * 30]];
      MX.taper(o, shaft, 5, 3.4, 'rgba(226,214,170,0.75)', 'rgba(110,90,50,0.8)');
      const tip = shaft[2];
      for (const da of [-0.35, 0.35]) {
        const br = [tip, [tip[0] + Math.cos(a0 + da) * 12, tip[1] + Math.sin(a0 + da) * 12], [tip[0] + Math.cos(a0 + da * 1.3) * 24, tip[1] + Math.sin(a0 + da * 1.3) * 24]];
        MX.taper(o, br, 3, 1.8, 'rgba(226,214,170,0.75)', 'rgba(110,90,50,0.8)');
        for (let k = 0; k < 3; k++) { const [x, y] = br[2]; const b = a0 + da + (k - 1) * 0.25; MX.line(o, [[x, y], [x + Math.cos(b) * 26, y + Math.sin(b) * 26]], 'rgba(120,100,60,0.6)', 0.4); }
      }
    }
    MX.fill(o, cara, 'rgba(226,216,176,0.5)');
    o.save(); MX.path(o, cara); o.clip();
    const cells = MX.voronoi(MX.scatter(R, 120, 7, [-62, -40, 110, 86]), U.rectPts(-64, -42, 112, 90));
    for (const c of cells) { o.strokeStyle = 'rgba(130,110,60,0.22)'; o.lineWidth = 0.3; o.beginPath(); U.poly(o, c, true); o.stroke(); }
    // gut full of green algae, brood pouch with eggs, the comb-like filtering legs
    MX.tube(o, [[44, -2], [30, -12], [0, -18], [-30, -14], [-50, -6]], 6, '#6E8A34');
    for (let i = 0; i < 16; i++) { const [x, y] = MX.along([[44, -2], [30, -12], [0, -18], [-30, -14], [-50, -6]], R()); o.fillStyle = 'rgba(40,70,20,0.6)'; o.beginPath(); o.arc(x + (R() - 0.5) * 3, y + (R() - 0.5) * 3, 0.8 + R(), 0, TAU); o.fill(); }
    for (let k = 0; k < 4; k++) MX.ball(o, -34 + k * 10, -26 + (k % 2) * 3, 4.4, '#A8B070', 0.3, 0.35);
    for (let k = 0; k < 5; k++) { const bx = 20 - k * 12; for (let j = 0; j < 7; j++) MX.line(o, [[bx, 6], [bx - 3 + j, 24 + j]], 'rgba(120,100,60,0.4)', 0.3); MX.taper(o, [[bx, 2], [bx - 2, 14], [bx - 5, 28]], 3, 1.5, 'rgba(200,184,130,0.6)'); }
    o.restore();
    o.strokeStyle = 'rgba(110,90,50,0.85)'; o.lineWidth = 0.6; MX.path(o, cara); o.stroke();
    MX.line(o, [[-50, -30], [-72, -38], [-92, -44]], 'rgba(170,150,100,0.9)', 2.2);
    // head: compound eye and the small eyespot, beak (rostrum) pointing down
    MX.fill(o, head, 'rgba(230,220,180,0.55)'); o.strokeStyle = 'rgba(110,90,50,0.85)'; o.lineWidth = 0.6; MX.path(o, head); o.stroke();
    MX.fill(o, [[60, 10], [70, 22], [64, 26], [52, 16]], 'rgba(226,214,170,0.6)');
    o.fillStyle = '#141414'; o.beginPath(); o.arc(58, -8, 7, 0, TAU); o.fill();
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; MX.ball(o, 58 + Math.cos(a) * 6.2, -8 + Math.sin(a) * 6.2, 1.3, '#D8D4C0', 0.5, 0.3); }
    o.fillStyle = '#1E1E1E'; o.beginPath(); o.arc(56, 4, 1.4, 0, TAU); o.fill();
    o.restore();
  },
  heart(x, t) {
    const D = DROP.daph, k = 1 + 0.25 * Math.max(0, Math.sin(t * 20));
    x.save(); x.translate(D.x, D.y); x.rotate(D.a);
    x.fillStyle = 'rgba(200,120,100,0.5)'; x.beginPath(); x.ellipse(22, -30, 4.5 * k, 3 * k, 0.2, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(140,70,60,0.6)'; x.lineWidth = 0.4; x.stroke();
    x.restore();
  },
};
plate('drop', {
  key: st => (st.algae || 0) > 40 ? 'bloom' : 'clear',
  still(o, st) {
    const R = MX.rng(241), bloom = (st.algae || 0) > 40;
    MX.field(o, '#E8EFE8', '#C8D6CC', 24, 0.012, 60);
    MX.layer(o, x => { MX.dots(x, R, 160, [-141, -141, 282, 282], 0.6, 2.6, 'rgba(120,130,110,0.4)'); DROP.spiro(x, R, [-150, 60], [60, 150], 15, 34); }, 2.6, 0.5);
    // tiny green cells, many more in a bloom
    for (let i = 0; i < (bloom ? 260 : 60); i++) MX.ball(o, -141 + R() * 282, -141 + R() * 282, 0.9 + R() * 1.2, '#5E9A3A', 0.4, 0.3);
    DROP.spiro(o, R, [-160, -14], [160, -118], 16, 34);
    // diatoms: a boat-shaped Navicula in glass, with two golden plastids; a round one and a needle
    const diatom = (x, y, a, l, w) => {
      o.save(); o.translate(x, y); o.rotate(a);
      const p = []; for (let i = 0; i < 32; i++) { const b = i / 32 * TAU; p.push([Math.cos(b) * l / 2, Math.sin(b) * w / 2 * Math.pow(Math.abs(Math.sin(b)), 0.1) * (1 - 0.3 * Math.cos(b) ** 4)]); }
      MX.fill(o, p, 'rgba(240,236,214,0.7)');
      for (const s of [-1, 1]) MX.fill(o, MX.blob(0, s * w * 0.2, l * 0.36, w * 0.17, { seed: s + 71, wob: 0.1, n: 14 }), 'rgba(176,138,48,0.85)');
      for (let u = -l / 2 + 2; u < l / 2 - 1; u += 1.1) MX.line(o, [[u, -w / 2 + 0.6], [u, w / 2 - 0.6]], 'rgba(120,100,60,0.3)', 0.22);
      MX.line(o, [[-l / 2 + 1.5, 0], [-1.5, 0]], 'rgba(90,70,40,0.8)', 0.35); MX.line(o, [[1.5, 0], [l / 2 - 1.5, 0]], 'rgba(90,70,40,0.8)', 0.35);
      o.fillStyle = 'rgba(90,70,40,0.6)'; o.beginPath(); o.ellipse(0, 0, 1.4, 1.8, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(70,60,40,0.9)'; o.lineWidth = 0.5; MX.path(o, p); o.stroke();
      o.strokeStyle = 'rgba(255,255,255,0.55)'; o.lineWidth = 0.4; o.save(); o.translate(-0.4, -0.5); MX.path(o, p); o.stroke(); o.restore();
      o.restore();
    };
    diatom(92, -80, 0.5, 32, 9); diatom(-112, 36, -0.2, 22, 6.5);
    o.fillStyle = 'rgba(236,230,206,0.7)'; o.beginPath(); o.arc(120, 20, 7, 0, TAU); o.fill(); o.strokeStyle = 'rgba(90,70,40,0.7)'; o.lineWidth = 0.4; o.stroke();
    for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; MX.line(o, [[120 + Math.cos(a) * 3, 20 + Math.sin(a) * 3], [120 + Math.cos(a) * 6.5, 20 + Math.sin(a) * 6.5]], 'rgba(110,90,50,0.45)', 0.3); }
    MX.ball(o, 120, 20, 2.4, '#B08A30', 0.3, 0.3);
    MX.rod(o, 10, 90, 1.2, 60, 3, 'rgba(236,230,206,0.8)', 'rgba(90,70,40,0.7)');
    // cyanobacteria: jelly colonies packed with tiny cells (Microcystis)
    if (bloom) for (const [cx, cy, r] of [[84, 96, 18], [118, 116, 11], [58, 124, 9], [-20, 124, 12], [120, 62, 8]]) {
      const p = MX.blob(cx, cy, r, r * 0.8, { seed: cx + cy, wob: 0.25, n: 16, rot: R() * 3 });
      MX.fill(o, p, 'rgba(200,226,196,0.35)'); o.strokeStyle = 'rgba(100,130,90,0.4)'; o.lineWidth = 0.3; MX.path(o, p); o.stroke();
      MX.dots(o, R, Math.round(r * r * 1.5), [cx - r, cy - r, r * 2, r * 2], 0.6, 0.95, '#2E4A2E', (x, y) => U.inPoly(x, y, p) && U.distPoly(x, y, p.concat([p[0]])) > 1.2);
    }
    // Paramecium
    const P = DROP.para, body = DROP.paraBody();
    o.save(); o.translate(P.x, P.y); o.rotate(P.a);
    o.strokeStyle = 'rgba(255,255,255,0.6)'; o.lineWidth = 3; MX.path(o, body); o.stroke();
    MX.fill(o, body, MX.rad(o, -8, -4, 3, P.L / 2, [[0, 'rgba(236,236,220,0.9)'], [1, 'rgba(206,210,186,0.9)']]));
    o.save(); MX.path(o, body); o.clip();
    MX.dots(o, R, 380, [-P.L / 2, -P.W / 2, P.L, P.W], 0.2, 0.55, 'rgba(110,110,80,0.35)');
    MX.line(o, [[-26, 10], [-12, 7], [-2, 3], [4, 0]], 'rgba(120,110,80,0.6)', 2.4);
    MX.line(o, [[-26, 10.8], [-10, 8], [2, 3.6]], 'rgba(255,255,255,0.4)', 0.6);
    for (const [x, y, r, c] of [[-6, -6, 3, '#9A8A5A'], [10, -3, 2.6, '#6E9A4A'], [18, 5, 3.2, '#A8906A'], [-20, 3, 2.2, '#8AA85A'], [26, -5, 2.4, '#9A8A5A']]) { o.fillStyle = 'rgba(245,245,230,0.8)'; o.beginPath(); o.arc(x, y, r + 0.6, 0, TAU); o.fill(); MX.dots(o, R, 6, [x - r, y - r, r * 2, r * 2], 0.4, 0.8, U.rgba(c, 0.8), (a, b) => Math.hypot(a - x, b - y) < r); }
    o.fillStyle = 'rgba(160,150,180,0.55)'; o.beginPath(); MX.curve(o, MX.blob(4, 1, 11, 5.5, { seed: 81, wob: 0.1, rot: -0.1 })); o.fill();
    o.strokeStyle = 'rgba(100,90,120,0.6)'; o.lineWidth = 0.35; o.stroke();
    MX.ball(o, 15, 4, 1.6, '#8A809E', 0.3, 0.3);
    o.restore();
    o.strokeStyle = 'rgba(100,100,70,0.85)'; o.lineWidth = 0.6; MX.path(o, body); o.stroke();
    o.strokeStyle = 'rgba(100,100,70,0.3)'; o.lineWidth = 0.3; o.save(); o.scale(0.93, 0.85); MX.path(o, body); o.stroke(); o.restore();
    o.restore();
    DROP.daphnia(o, R);
    MX.vignette(o, 0.2); MX.grain(o, 0.05);
    MX.scaleBar(o, 35, '100 µm');
  },
  live(x, st, t) {
    const P = DROP.para, body = DROP.paraBody();
    x.save(); x.translate(P.x, P.y); x.rotate(P.a);
    x.strokeStyle = 'rgba(110,110,80,0.5)'; x.lineWidth = 0.3;
    for (let i = 0; i < body.length; i++) {
      const [bx, by] = body[i], [nx, ny] = body[(i + 1) % body.length], a = Math.atan2(ny - by, nx - bx) - Math.PI / 2 + Math.sin(t * 10 - i * 0.5) * 0.55;
      for (const f of [0, 0.5]) { const px = bx + (nx - bx) * f, py = by + (ny - by) * f; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * 3.4, py + Math.sin(a) * 3.4); x.stroke(); }
    }
    // the two contractile vacuoles fill slowly and empty in a snap
    for (const [cx, ph] of [[-24, 0], [24, 1.6]]) {
      const k = ((t * 0.5 + ph) % 1), r = k < 0.85 ? 1 + k * 3 : 1;
      x.fillStyle = 'rgba(250,252,250,0.95)'; x.beginPath(); x.arc(cx, -5, r, 0, TAU); x.fill(); x.strokeStyle = 'rgba(100,110,100,0.6)'; x.lineWidth = 0.3; x.stroke();
      for (let j = 0; j < 7; j++) { const a = j / 7 * TAU; MX.line(x, [[cx + Math.cos(a) * (r + 0.5), -5 + Math.sin(a) * (r + 0.5)], [cx + Math.cos(a) * (r + 5 - k * 3), -5 + Math.sin(a) * (r + 4 - k * 2)]], 'rgba(240,248,244,0.8)', 0.9); }
    }
    x.restore();
    DROP.heart(x, t);
  },
});

// ================================================================ ×1 the pond, cut open below the surface
// What the numbers in the pond case mean, made visible: clear water with pondweed, fish and light, or a green
// scum that shuts out the light, dying weed, fish gasping at the surface and sludge on the bottom.
// spots: oxygen probe (106,-56) · decomposers (0,110) · algae scum (-60,-98) · pondweed (-100,30)
const POND = {
  surf: -104,
  bed: x => 94 + MX.n(x * 0.02, 5) * 5,
  vals(st) { return { alg: U.clamp((st.algae != null ? st.algae : 20) / 100, 0, 1), ox: U.clamp((st.oxygen != null ? st.oxygen : 80) / 100, 0, 1), dead: Math.min(st.dead || 0, 4), fish: Math.min(st.fish != null ? st.fish : 5, 5) }; },
  weeds: [
    { stem: [[-100, 96], [-104, 60], [-99, 30], [-102, 0], [-96, -34], [-100, -70], [-96, -96]], kind: 'elodea' },
    { stem: [[-78, 98], [-74, 64], [-80, 30], [-76, -4], [-80, -40], [-76, -70]], kind: 'elodea' },
    { stem: [[-122, 98], [-126, 70], [-120, 40], [-124, 10]], kind: 'elodea' },
    { stem: [[96, 98], [100, 70], [94, 40], [98, 10], [94, -20]], kind: 'crispus' },
  ],
  fish(x, cx, cy, dir, L, t, k, dead) {
    x.save(); x.translate(cx, cy); x.scale(dir, dead ? -1 : 1);
    const H = L * 0.3, beat = dead ? 0 : Math.sin(t * 7 + k) * 0.22, fin = dead ? 'rgba(220,214,200,0.8)' : 'rgba(206,92,56,0.8)';
    x.save(); x.translate(-L * 0.4, 0); x.rotate(beat);
    x.fillStyle = fin; x.beginPath(); x.moveTo(2, 0); x.quadraticCurveTo(-L * 0.1, -H * 0.2, -L * 0.22, -H * 0.62); x.quadraticCurveTo(-L * 0.15, 0, -L * 0.22, H * 0.62); x.quadraticCurveTo(-L * 0.1, H * 0.2, 2, 0); x.fill();
    x.restore();
    x.fillStyle = fin;
    x.beginPath(); x.moveTo(-L * 0.02, -H * 0.44); x.lineTo(-L * 0.1, -H * 0.86); x.lineTo(-L * 0.22, -H * 0.36); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(L * 0.02, H * 0.42); x.lineTo(-L * 0.02, H * 0.74); x.lineTo(-L * 0.1, H * 0.4); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(-L * 0.2, H * 0.34); x.lineTo(-L * 0.26, H * 0.62); x.lineTo(-L * 0.32, H * 0.26); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(L * 0.5, 0); x.bezierCurveTo(L * 0.44, -H * 0.46, L * 0.12, -H * 0.56, -L * 0.1, -H * 0.46); x.bezierCurveTo(-L * 0.28, -H * 0.36, -L * 0.36, -H * 0.16, -L * 0.42, -H * 0.1); x.lineTo(-L * 0.42, H * 0.1); x.bezierCurveTo(-L * 0.34, H * 0.2, -L * 0.2, H * 0.42, 0, H * 0.46); x.bezierCurveTo(L * 0.24, H * 0.46, L * 0.44, H * 0.3, L * 0.5, 0); x.closePath();
    x.fillStyle = dead ? MX.lin(x, 0, -H * 0.5, 0, H * 0.5, [[0, '#9A9A8E'], [0.5, '#D8D8CC'], [1, '#EEEEE4']]) : MX.lin(x, 0, -H * 0.5, 0, H * 0.5, [[0, '#34422E'], [0.3, '#7E8C76'], [0.55, '#CCD4C8'], [1, '#F0F0E6']]);
    x.fill();
    x.strokeStyle = 'rgba(40,50,40,0.4)'; x.lineWidth = 0.3; x.stroke();
    x.strokeStyle = 'rgba(60,70,60,0.5)'; x.beginPath(); x.moveTo(L * 0.26, -H * 0.36); x.quadraticCurveTo(L * 0.2, 0, L * 0.26, H * 0.34); x.stroke();
    x.beginPath(); x.moveTo(L * 0.24, -H * 0.06); x.quadraticCurveTo(0, -H * 0.02, -L * 0.38, -H * 0.02); x.stroke();
    x.fillStyle = dead ? '#C8C8BC' : '#D84A2A'; x.beginPath(); x.arc(L * 0.36, -H * 0.1, L * 0.05, 0, TAU); x.fill();
    x.fillStyle = dead ? '#E8E8E0' : '#101010'; x.beginPath(); x.arc(L * 0.36, -H * 0.1, L * 0.028, 0, TAU); x.fill();
    x.restore();
  },
  weed(o, R, w, sick) {
    const col = sick ? ['#8A8A3A', '#9A8A48', '#6E6A30'] : ['#3E7A2E', '#4E8A34', '#5E9A3E'];
    MX.line(o, w.stem, sick ? '#7A7A3A' : '#3E6E2A', 1.3);
    for (let t = 0.02; t < 0.99; t += w.kind === 'elodea' ? 0.022 : 0.07) {
      const [x, y, a] = MX.along(w.stem, t);
      if (sick && R() < 0.4) continue;
      if (w.kind === 'elodea') for (const s of [-1, 1, 0]) {
        const b = a + s * 1.1 - (s === 0 ? 0 : 0.4 * s) + (R() - 0.5) * 0.3, l = s === 0 ? 3 : 6 + R();
        MX.taper(o, [[x, y], [x + Math.cos(b) * l * 0.5, y + Math.sin(b) * l * 0.5], [x + Math.cos(b) * l, y + Math.sin(b) * l]], 1.2, 1.8, U.pick(col, R()), 'rgba(30,60,20,0.5)');
      } else {
        const s = Math.round(t * 100) % 2 ? 1 : -1, b = a + s * 0.8, l = 16;
        const pts = []; for (let k = 0; k <= 8; k++) pts.push([x + Math.cos(b) * l * k / 8 + Math.sin(k * 2.2) * 1.2 * Math.cos(b + 1.57), y + Math.sin(b) * l * k / 8 + Math.sin(k * 2.2) * 1.2 * Math.sin(b + 1.57)]);
        MX.taper(o, pts, 2, 3.2, U.pick(col, R()), 'rgba(30,60,20,0.6)');
      }
    }
  },
};
plate('pond', {
  key: st => { const v = POND.vals(st); return Math.round(v.alg * 10) + '|' + Math.round(v.ox * 20) + '|' + v.dead; },
  still(o, st) {
    const R = MX.rng(251), v = POND.vals(st), S = POND.surf, murky = U.clamp((v.alg - 0.3) / 0.6, 0, 1);
    // air above: sky, the far bank, reeds
    o.fillStyle = MX.lin(o, 0, -141, 0, S, [[0, '#B4CCD8'], [1, '#E4ECE6']]); o.fillRect(-141, -141, 282, 40);
    MX.layer(o, x => {
      x.fillStyle = '#6E8A4A'; x.beginPath(); x.moveTo(-141, -114); for (let px = -141; px <= 141; px += 6) x.lineTo(px, -116 + MX.n(px * 0.03, 5) * 4); x.lineTo(141, S); x.lineTo(-141, S); x.closePath(); x.fill();
      for (let i = 0; i < 5; i++) { x.fillStyle = U.pick(['#4E6A34', '#5E7A40'], R()); x.beginPath(); x.ellipse(-150 + i * 70 + R() * 20, -122, 22, 12, 0, 0, TAU); x.fill(); }
    }, 2.5, 1);
    for (let i = 0; i < 40; i++) { const x = -141 + R() * 70, h = 14 + R() * 22; o.strokeStyle = U.pick(['#6A8A3A', '#8A9A4A', '#5A7A30'], R()); o.lineWidth = 0.9; o.beginPath(); o.moveTo(x, S + 2); o.quadraticCurveTo(x + 1, S - h * 0.6, x + (R() - 0.5) * 5, S - h); o.stroke(); }
    for (const x of [-128, -112]) { MX.line(o, [[x, S + 2], [x + 1, S - 30]], '#6A7A3A', 0.8); MX.rod(o, x + 1, S - 30, Math.PI / 2, 9, 3, '#5A3A22'); }
    // water: clear and blue-green, or pea-soup green in a bloom
    o.fillStyle = MX.lin(o, 0, S, 0, 141, [[0, U.mix('#8CC2C4', '#9CB058', murky)], [0.5, U.mix('#4E8A8C', '#5E7A30', murky)], [1, U.mix('#24484A', '#28341A', murky)]]); o.fillRect(-141, S, 282, 245);
    if (murky < 0.6) MX.layer(o, x => { for (let i = 0; i < 9; i++) { const x0 = -150 + i * 36 + R() * 20; x.fillStyle = 'rgba(255,255,230,0.5)'; x.beginPath(); x.moveTo(x0, S); x.lineTo(x0 + 10, S); x.lineTo(x0 + 50, 100); x.lineTo(x0 + 30, 100); x.closePath(); x.fill(); } }, 6, 0.35 * (1 - murky / 0.6), 'lighter');
    MX.layer(o, x => { x.fillStyle = U.mix('#3E6A4A', '#4A5A26', murky); for (let i = 0; i < 6; i++) { const bx = -40 + i * 30 + R() * 10; MX.line(x, [[bx, 100], [bx + (R() - 0.5) * 10, 40], [bx + (R() - 0.5) * 16, -20 - R() * 40]], U.mix('#3E6A4A', '#4A5A26', murky), 3); } }, 4, 0.5);
    // the bottom: a skin of brown sediment over black mud, with rotting leaves
    const bedPts = []; for (let x = -145; x <= 145; x += 5) bedPts.push([x, POND.bed(x)]);
    o.fillStyle = MX.lin(o, 0, 88, 0, 141, [[0, '#5A4A34'], [0.15, '#3A2E22'], [0.5, '#1E1812'], [1, '#141008']]); o.beginPath(); U.poly(o, bedPts.concat([[145, 145], [-145, 145]]), true); o.fill();
    MX.line(o, bedPts, 'rgba(120,100,70,0.6)', 1.6);
    MX.dots(o, R, 260, [-141, 96, 282, 45], 0.3, 1.2, 'rgba(90,76,56,0.6)', (x, y) => y > POND.bed(x) + 1);
    for (let i = 0; i < 18; i++) { const x = -140 + R() * 280; ECO.stone(o, R, x, POND.bed(x) + 2 + R() * 30, 1.5 + R() * 4, U.pick(['#6A6254', '#8A806E', '#4E483E'], R())); }
    for (let i = 0; i < 14; i++) { const x = -140 + R() * 280; ECO.leaf(o, R, x, POND.bed(x) + 1, (R() - 0.5) * 0.4 + (R() < 0.5 ? Math.PI : 0), 10 + R() * 8, U.pick(['#5A3E22', '#6E4A26', '#4A3218'], R()), 2, '#2A2016'); }
    // where the decomposers work: a half-buried leaf pile furred with bacteria and fungi, gas bubbles in the mud
    for (const [x, y, a] of [[-10, 104, 0.3], [8, 108, 2.8], [2, 114, -0.2]]) ECO.leaf(o, R, x, y, a, 20, '#5A4026', 4, '#1E1812');
    ECO.fuzz(o, R, 0, 108, 16, 7, 160); ECO.fuzz(o, R, -18, 104, 6, 3, 30);
    for (let i = 0; i < 8; i++) { const x = -30 + R() * 60, y = 118 + R() * 18; o.fillStyle = 'rgba(200,210,200,0.5)'; o.beginPath(); o.arc(x, y, 0.8 + R() * 1.4, 0, TAU); o.fill(); }
    // pondweed; with little light under a scum it yellows and falls apart
    const sick = v.alg > 0.6;
    for (const w of POND.weeds) POND.weed(o, R, w, sick);
    // fish that have died, lying on the bottom and growing mould
    for (let i = 0; i < v.dead; i++) { const x = -44 + i * 34, y = POND.bed(x) - 3; POND.fish(o, x, y, i % 2 ? 1 : -1, 34, 0, 0, true); ECO.fuzz(o, R, x, y - 1, 7, 3, 40); }
    // floating life: specks and green cells, far more in a bloom; the water loses its clarity
    MX.dots(o, R, Math.round(80 + v.alg * 500), [-141, S, 282, 200], 0.3, 1.1, U.rgba('#6E9A2A', 0.3 + v.alg * 0.4));
    if (murky > 0) { o.fillStyle = `rgba(90,118,48,${(murky * 0.45).toFixed(2)})`; o.fillRect(-141, S, 282, 245); }
    // the green scum on top, and strands of filamentous algae hanging down from it
    if (v.alg > 0.35) {
      const th = 5 + (v.alg - 0.35) * 18;
      MX.tex(o, -141, S - 3, 282, th + 3, (x, y) => { const f = U.fbm(x * 0.15, y * 0.3, 3, 17); return [60 + f * 90, 100 + f * 80, 30 + f * 20, 255 * U.clamp((0.95 - Math.abs((y - S) / (th + 2) - 0.3) * 1.2) + f * 0.2, 0, 1)]; }, 200);
      for (let i = 0; i < Math.round(v.alg * 40); i++) { const x = -140 + R() * 280; MX.line(o, MX.strand(R, x, S + th - 1, Math.PI / 2 + (R() - 0.5) * 0.4, 8 + R() * 30, 2.5, 0.3, Math.PI / 2), 'rgba(90,130,40,0.7)', 0.6); }
      for (let i = 0; i < 20; i++) { const x = -140 + R() * 280; o.strokeStyle = 'rgba(240,250,230,0.8)'; o.lineWidth = 0.35; o.beginPath(); o.arc(x, S + 1, 1 + R() * 2, 0, TAU); o.stroke(); }
    }
    MX.line(o, [[-141, S], [141, S]], 'rgba(255,255,255,0.65)', 0.9);
    // the dissolved-oxygen meter: probe in the water, reading on the bank
    const mg = (Math.round(v.ox * 20) / 2).toFixed(1), low = v.ox < 0.4;
    MX.line(o, [[116, -118], [122, -110], [114, -98], [106, -82]], '#1E1E1E', 1.2);
    o.fillStyle = MX.lin(o, 101, 0, 111, 0, [[0, '#5A5E62'], [0.4, '#B8BEC2'], [1, '#4A4E52']]); U.rr(o, 101, -82, 10, 34, 2); o.fill();
    o.fillStyle = '#E8C04A'; o.fillRect(101, -54, 10, 3); o.fillStyle = '#2A2A2A'; U.rr(o, 102, -51, 8, 5, 2); o.fill();
    o.fillStyle = '#2E3236'; U.rr(o, 88, -140, 44, 24, 3); o.fill(); o.strokeStyle = '#111'; o.lineWidth = 0.6; o.stroke();
    o.fillStyle = low ? '#3A1410' : '#1E2A1A'; U.rr(o, 91, -137, 38, 14, 1.5); o.fill();
    MX.text(o, mg + ' mg/L', 110, -130.5, 7, low ? '#FF6A4A' : '#9AF08A');
    MX.text(o, 'O₂', 95, -120, 5, '#C8CCD0', 'left');
    MX.vignette(o, 0.14); MX.grain(o, 0.04);
    MX.scaleBar(o, 40, '20 cm', true);
  },
  live(x, st, t) {
    const v = POND.vals(st), S = POND.surf, sick = v.alg > 0.6;
    // oxygen streaming off the pondweed in the light
    x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineWidth = 0.5;
    const n = sick ? 1 : Math.round(1 + v.ox * 4);
    POND.weeds.forEach((w, j) => {
      for (let i = 0; i < n; i++) {
        const [bx, by] = MX.along(w.stem, 0.3 + ((i * 0.37 + j * 0.21) % 0.6)), span = by - S, y = by - ((t * 16 + i * 29 + j * 13) % span);
        x.beginPath(); x.arc(bx + Math.sin(t * 2 + i) * 1.5, y, 0.9 + (i % 2) * 0.5, 0, TAU); x.stroke();
      }
    });
    // gas from the rotting mud when the pond is overloaded
    if (v.alg > 0.5) for (let i = 0; i < 3; i++) { const bx = -20 + i * 18, by = 96, y = by - ((t * 12 + i * 60) % (by - S)); x.fillStyle = 'rgba(230,236,220,0.6)'; x.beginPath(); x.arc(bx, y, 1.6, 0, TAU); x.fill(); }
    // fish: cruising at depth in good water, gulping at the surface when oxygen is short
    const gasp = v.ox < 0.35;
    for (let i = 0; i < v.fish; i++) {
      const dir = i % 2 ? -1 : 1, sp = gasp ? 3 : 9 + i * 2, span = 320, px = ((t * sp * dir + i * 67) % span + span) % span - 160;
      const py = gasp ? S + 6 + (i % 2) * 3 + Math.sin(t * 3 + i) * 1.5 : -50 + i * 26 + Math.sin(t * 0.8 + i) * 5;
      POND.fish(x, px, py, dir, 32 + (i % 3) * 7, t, i * 1.7, false);
    }
  },
});
