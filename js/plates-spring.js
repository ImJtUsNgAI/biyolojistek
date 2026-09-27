'use strict';
// Sulphur Spring plates: the hot outflow seen from above with its coloured mats, and a smear of the mat at ×1000.

// ================================================================ ×1 the spring and its outflow, from above
// Water leaves the vent at about 90 °C carrying H₂S. Where the gas meets the air, yellow sulphur crystallises on the
// rim. Down the outflow the water cools and the mat changes colour band by band: white streamers of bacteria that
// live on H₂S, a yellow band, then orange and brown where cyanobacteria (hidden green under orange carotenoids)
// take over, and finally green algae where the water is cool enough for insect larvae and snails.
// spots: vent (-66,-62), crust (-26,-98), colour bands (30,20), green mat (112,104)
const SPRING = {
  pool: [-66, -62],
  ch: [[-38, -40], [-14, -20], [8, 0], [30, 18], [52, 38], [74, 60], [96, 84], [118, 108], [146, 138]],
  // water temperature along the channel: t = 0 at the vent's lip, 1 about 40 m downstream
  T(t) { return 90 - 64 * t; },
  mat(T) { return T >= 84 ? 'source' : T >= 76 ? 'white' : T >= 73 ? 'yellow' : T >= 55 ? 'orange' : T >= 45 ? 'brown' : 'green'; },
  COL: { source: '#A9D2D6', white: '#F1ECDF', yellow: '#E4C94E', orange: '#D8803A', brown: '#8E6A36', green: '#5A8A38' },
  // streamer colours: a lighter and a darker shade of each band
  STR: { source: ['#DCEFEF', '#8CBFC6'], white: ['#FFFFFA', '#D8CDBE'], yellow: ['#F6E48A', '#B8962A'], orange: ['#F0A860', '#9A4E1E'], brown: ['#B8904E', '#5E4222'], green: ['#8ABE56', '#2E5A1E'] },
  // the channel outline, widening downstream, with a wobbly bank
  bank(pad) {
    const L = [], Rr = [], n = 40;
    for (let i = 0; i <= n; i++) {
      const t = i / n, [x, y, a] = MX.along(this.ch, t), w = (15 + 22 * t + pad) * (1 + 0.14 * MX.n(t * 7, pad * 0.1 + 1));
      L.push([x + Math.cos(a - Math.PI / 2) * w, y + Math.sin(a - Math.PI / 2) * w]);
      Rr.push([x + Math.cos(a + Math.PI / 2) * w * (1 + 0.12 * MX.n(t * 9, 4)), y + Math.sin(a + Math.PI / 2) * w * (1 + 0.12 * MX.n(t * 9, 4))]);
    }
    return L.concat(Rr.reverse());
  },
};
plate('spring', {
  still(o) {
    const R = MX.rng(301), S = SPRING, [px, py] = S.pool;
    // bare volcanic ground, grey and ochre; nothing grows near the hot water
    MX.field(o, '#9E9482', '#5E564A', 9, 0.013, 80);
    for (let k = 0; k < 40; k++) { const b = MX.blob((R() - 0.5) * 290, (R() - 0.5) * 290, 4 + R() * 12, 3 + R() * 8, { rot: R() * TAU, seed: k + 20 }); MX.fill(o, b, `rgba(${R() < 0.5 ? '70,64,56' : '176,166,146'},${(0.35 + R() * 0.35).toFixed(2)})`); }
    // a pale apron of sinter (mineral crust) around the pool and along the channel
    MX.fill(o, MX.blob(px, py, 70, 62, { seed: 3, wob: 0.12 }), '#CFC7B4');
    MX.fill(o, S.bank(16), '#CFC7B4');
    o.fillStyle = MX.rad(o, px, py, 20, 120, [[0, 'rgba(226,200,80,0.6)'], [1, 'rgba(226,200,80,0)']]); o.fillRect(-141, -141, 282, 282);
    // grass and moss only far from the heat
    for (let k = 0; k < 160; k++) {
      const x = (R() - 0.5) * 290, y = (R() - 0.5) * 290, d = Math.hypot(x - px, y - py);
      if (d < 150 || R() > (d - 150) / 90) continue;
      const g = R() < 0.5 ? '#6E8A3E' : '#8AA24E';
      for (let j = 0; j < 4; j++) MX.line(o, [[x, y], [x + (R() - 0.5) * 5, y - 3 - R() * 5]], g, 0.8);
    }
    // the outflow: wet sinter first, then the living mat band by band
    const bank = S.bank(0);
    MX.fill(o, bank.map(([x, y]) => [x + 2, y + 3]), 'rgba(40,34,26,0.35)');
    MX.fill(o, bank, '#E8E2D4');
    o.save(); MX.path(o, bank); o.clip();
    for (let t = -0.04; t <= 1.02; t += 0.004) {
      const [x, y] = MX.along(S.ch, U.clamp(t, 0, 1)), w = 22 + 30 * t;
      o.globalAlpha = 0.28; o.fillStyle = S.COL[S.mat(S.T(t))]; o.beginPath(); o.arc(x, y, w, 0, TAU); o.fill();
    }
    o.globalAlpha = 1;
    // streamers lie along the current; in the cool part they are long green threads
    for (let k = 0; k < 900; k++) {
      const t = R(), [x, y, a] = MX.along(S.ch, t), side = (R() - 0.5) * (30 + 44 * t), m = S.mat(S.T(t));
      const sx = x + Math.cos(a + Math.PI / 2) * side, sy = y + Math.sin(a + Math.PI / 2) * side, l = m === 'green' ? 10 + R() * 14 : m === 'white' ? 6 + R() * 10 : 3 + R() * 5;
      MX.line(o, MX.strand(R, sx, sy, a + (R() - 0.5) * 0.4, l, 2, 0.35), S.STR[m][R() < 0.55 ? 0 : 1], m === 'green' ? 0.9 : 0.7 + R() * 0.6);
    }
    // little terraces: each lip is a thin pale rim of mineral where the water spills over
    for (let t = 0.08; t < 1; t += 0.055 + R() * 0.03) {
      const [x, y, a] = MX.along(S.ch, t), w = 18 + 26 * t, c = Math.cos(a + Math.PI / 2), s = Math.sin(a + Math.PI / 2);
      const lip = []; for (let u = -1; u <= 1.001; u += 0.25) lip.push([x + c * u * w + Math.cos(a) * (1 - u * u) * 5, y + s * u * w + Math.sin(a) * (1 - u * u) * 5]);
      MX.line(o, lip.map(([lx, ly]) => [lx + Math.cos(a) * 1.4, ly + Math.sin(a) * 1.4]), 'rgba(60,40,20,0.3)', 1.2);
      MX.line(o, lip, 'rgba(250,246,232,0.7)', 0.9);
    }
    // a film of flowing water: bright glints and a blue sheen near the vent
    for (let k = 0; k < 70; k++) { const t = R(), [x, y, a] = MX.along(S.ch, t), side = (R() - 0.5) * (24 + 36 * t); MX.line(o, [[x + Math.cos(a + Math.PI / 2) * side, y + Math.sin(a + Math.PI / 2) * side], [x + Math.cos(a + Math.PI / 2) * side + Math.cos(a) * 7, y + Math.sin(a + Math.PI / 2) * side + Math.sin(a) * 7]], 'rgba(255,255,255,0.45)', 0.6); }
    // snails and a caddis case in the cool green part
    for (let k = 0; k < 7; k++) { const t = 0.8 + R() * 0.18, [x, y, a] = MX.along(S.ch, t), side = (R() - 0.5) * 50, sx = x + Math.cos(a + Math.PI / 2) * side, sy = y + Math.sin(a + Math.PI / 2) * side; o.fillStyle = MX.lit(o, sx, sy, 2.2, '#5A4A3A'); o.beginPath(); o.arc(sx, sy, 2.2, 0, TAU); o.fill(); o.strokeStyle = 'rgba(230,220,200,0.5)'; o.lineWidth = 0.4; o.beginPath(); o.arc(sx, sy, 1.2, 0, 4.5); o.stroke(); }
    o.restore();
    MX.line(o, bank, 'rgba(70,60,44,0.55)', 0.8, true);
    // the vent: a crust of sulphur crystals on the rim, then clear water going deep blue
    const rim = MX.blob(px, py, 50, 44, { seed: 7, wob: 0.1 }), pool = MX.blob(px, py, 40, 35, { seed: 8, wob: 0.07 });
    MX.fill(o, rim, '#E2CC5E');
    o.save(); MX.path(o, rim); o.clip();
    const lt = U.rgb('#FFF3A8'), dk = U.rgb('#B4962E');
    MX.tex(o, px - 54, py - 50, 108, 100, (x, y) => { const v = U.fbm(x * 0.12, y * 0.12, 3, 31); return v > 0.55 ? [lt[0], lt[1], lt[2], (v - 0.55) * 500] : [dk[0], dk[1], dk[2], (0.55 - v) * 180]; }, 120);
    for (let k = 0; k < 120; k++) { const a = R() * TAU, r = 36 + R() * 14, x = px + Math.cos(a) * r, y = py + Math.sin(a) * r * 0.88; o.fillStyle = R() < 0.6 ? 'rgba(255,248,190,0.9)' : 'rgba(250,250,240,0.8)'; o.save(); o.translate(x, y); o.rotate(R() * TAU); o.fillRect(-0.9, -0.9, 1.8, 1.8); o.restore(); }
    o.restore();
    MX.line(o, rim, 'rgba(120,96,30,0.7)', 0.8, true);
    MX.fill(o, pool, MX.rad(o, px + 4, py + 4, 2, 42, [[0, '#0B2E4E'], [0.35, '#12587E'], [0.7, '#2E9AAE'], [0.9, '#86C8BE'], [1, '#D6DCA6']]));
    o.save(); MX.path(o, pool); o.clip();
    o.strokeStyle = 'rgba(255,255,255,0.18)'; o.lineWidth = 0.6;
    for (let k = 1; k < 6; k++) { o.beginPath(); o.ellipse(px + 3, py + 2, k * 7, k * 6, 0, 0, TAU); o.stroke(); }
    o.fillStyle = 'rgba(255,255,255,0.28)'; o.beginPath(); o.ellipse(px - 16, py - 16, 12, 4, -0.6, 0, TAU); o.fill();
    o.restore();
    MX.line(o, pool, 'rgba(250,250,236,0.8)', 1.2, true);
    // survey stakes along the bank every 10 m, the same stations as the thermometer transect
    for (const [t, lab] of [[0, '0 m'], [0.25, '10 m'], [0.5, '20 m'], [0.75, '30 m']]) {
      const [x, y, a] = MX.along(S.ch, t), w = 26 + 22 * t, sx = x + Math.cos(a - Math.PI / 2) * w, sy = y + Math.sin(a - Math.PI / 2) * w;
      o.fillStyle = 'rgba(30,24,16,0.4)'; o.beginPath(); o.ellipse(sx + 2, sy + 1.5, 2.6, 1.3, 0, 0, TAU); o.fill();
      o.fillStyle = '#E8E0CC'; o.fillRect(sx - 1.4, sy - 11, 2.8, 11); o.fillStyle = '#B03A2E'; o.fillRect(sx - 1.4, sy - 11, 2.8, 4);
      o.strokeStyle = 'rgba(30,24,16,0.7)'; o.lineWidth = 0.4; o.strokeRect(sx - 1.4, sy - 11, 2.8, 11);
      MX.text(o, lab, sx + 4, sy - 12, 6.5, '#2A2418', 'left');
    }
    MX.vignette(o, 0.14); MX.grain(o, 0.04);
    MX.scaleBar(o, 32, '5 m');
  },
  // steam drifting off the hot water, and bubbles of gas breaking the surface
  live(x, st, t) {
    const [px, py] = SPRING.pool;
    for (let i = 0; i < 9; i++) {
      const k = (t * 0.16 + i / 9) % 1, sx = px - 20 + (i * 17) % 50 + k * 26 + Math.sin(t * 0.7 + i) * 4, sy = py + 12 - (i % 3) * 8 - k * 70, r = 10 + k * 22;
      x.fillStyle = MX.rad(x, sx, sy, 0, r, [[0, `rgba(250,250,248,${(0.32 * Math.sin(k * Math.PI)).toFixed(3)})`], [1, 'rgba(250,250,248,0)']]);
      x.beginPath(); x.arc(sx, sy, r, 0, TAU); x.fill();
    }
    for (let i = 0; i < 5; i++) {
      const k = (t * 0.7 + i * 0.37) % 1, a = i * 2.4, r0 = 6 + (i * 7) % 22, bx = px + Math.cos(a) * r0, by = py + Math.sin(a) * r0 * 0.8;
      x.strokeStyle = `rgba(255,255,255,${(0.7 * (1 - k)).toFixed(2)})`; x.lineWidth = 0.6; x.beginPath(); x.arc(bx, by, 1 + k * 5, 0, TAU); x.stroke();
    }
  },
});

// ================================================================ ×1000 a smear of the mat near the vent
// Long filaments of sulphur bacteria, their cells packed with bright droplets of sulphur they stripped from H₂S;
// short blue-green rods of cyanobacteria from just below the green line; and small lobed cells of archaea, which
// look like bacteria but belong to a domain of their own.
// spots: sulphur bacteria (-58,-44), granules loupe (94,-92), cyanobacteria (64,72), archaea (-72,80)
const MAT = {
  f1: [[-150, -92], [-112, -72], [-84, -58], [-58, -44], [-30, -34], [-2, -28], [30, -22], [62, -12], [96, -6], [150, -12]],
  f2: [[-150, 4], [-104, -2], [-62, -4], [-22, 6], [8, 24], [26, 46], [34, 74], [30, 104], [18, 150]],
  f3: [[-40, -150], [-44, -120], [-36, -96], [-18, -80], [8, -72], [40, -74], [72, -90], [110, -118], [130, -150]],
  // a chain of cells, each carrying a few bright sulphur droplets
  filament(o, R, pts, w) {
    MX.line(o, pts, 'rgba(60,56,40,0.35)', w + 3);
    MX.tube(o, pts, w, '#CFC9B2', { edge: '#6A6450', hiA: 0.5 });
    const n = Math.round(this._len(pts) / (w * 0.9));
    for (let i = 1; i < n; i++) {
      const [x, y, a] = MX.along(pts, i / n), c = Math.cos(a + Math.PI / 2) * w * 0.42, s = Math.sin(a + Math.PI / 2) * w * 0.42;
      MX.line(o, [[x - c, y - s], [x + c, y + s]], 'rgba(90,84,64,0.6)', 0.4);
      for (let j = 0; j < 3; j++) {
        if (R() < 0.25) continue;
        const [gx, gy] = MX.along(pts, (i - 0.2 - R() * 0.6) / n), off = (R() - 0.5) * w * 0.5, g = 0.8 + R() * 1.1;
        const qx = gx + Math.cos(a + Math.PI / 2) * off, qy = gy + Math.sin(a + Math.PI / 2) * off;
        o.fillStyle = 'rgba(70,60,30,0.75)'; o.beginPath(); o.arc(qx, qy, g + 0.35, 0, TAU); o.fill();
        o.fillStyle = '#FFFBE4'; o.beginPath(); o.arc(qx - 0.15, qy - 0.15, g, 0, TAU); o.fill();
      }
    }
  },
  _len(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; },
  archaeon(o, R, x, y, r) {
    const b = MX.blob(x, y, r, r * (0.85 + R() * 0.2), { rot: R() * TAU, wob: 0.22, n: 14, fq: 2.6, seed: Math.floor(R() * 99) });
    MX.fill(o, b.map(([bx, by]) => [bx + 0.6, by + 0.8]), 'rgba(50,40,50,0.3)');
    MX.fill(o, b, MX.lit(o, x, y, r, '#B89AAE', 0.35, 0.3));
    MX.line(o, b, 'rgba(80,50,74,0.8)', 0.45, true);
  },
  cyano(o, x, y, a, l) {
    MX.rod(o, x + 0.6, y + 0.8, a, l, 5.4, 'rgba(30,50,40,0.3)');
    MX.rod(o, x, y, a, l, 5.4, '#4E9270', 'rgba(20,60,40,0.9)');
    MX.rod(o, x, y, a, l * 0.72, 2.2, 'rgba(170,220,190,0.55)');
  },
  // the loupe: one filament close up, its sulphur droplets like pearls
  close(o, R) {
    o.fillStyle = MX.lin(o, -50, -50, 50, 50, [[0, '#E2E6DE'], [1, '#C4CAC0']]); o.fillRect(-50, -50, 100, 100);
    o.save(); o.rotate(-0.25);
    o.fillStyle = 'rgba(60,56,40,0.3)'; o.fillRect(-60, -13, 120, 30);
    o.fillStyle = MX.lin(o, 0, -14, 0, 14, [[0, '#9A947C'], [0.25, '#D8D2BC'], [0.75, '#CCC6AE'], [1, '#8A846C']]); o.fillRect(-60, -14, 120, 28);
    for (let x = -60; x < 60; x += 17) {
      MX.line(o, [[x, -13], [x + 0.5, 13]], 'rgba(90,84,64,0.8)', 0.8);
      for (let j = 0; j < 3; j++) {
        const gx = x + 3 + R() * 11, gy = (R() - 0.5) * 14, g = 2.2 + R() * 2;
        o.fillStyle = 'rgba(70,60,30,0.8)'; o.beginPath(); o.arc(gx, gy, g + 0.7, 0, TAU); o.fill();
        o.fillStyle = MX.rad(o, gx - g * 0.35, gy - g * 0.35, 0.2, g, [[0, '#FFFFFF'], [0.6, '#FFF6CC'], [1, '#E6D38A']]); o.beginPath(); o.arc(gx, gy, g, 0, TAU); o.fill();
      }
    }
    o.restore();
  },
};
plate('mat', {
  still(o) {
    const R = MX.rng(415), M = MAT;
    MX.field(o, '#DCE0D8', '#A8B0A2', 13, 0.014, 60);
    // loose flakes of sulphur and mineral grains in the smear
    for (let k = 0; k < 14; k++) {
      const x = (R() - 0.5) * 270, y = (R() - 0.5) * 270, s = 3 + R() * 5;
      o.save(); o.translate(x, y); o.rotate(R() * TAU);
      o.fillStyle = 'rgba(230,206,90,0.75)'; o.beginPath(); o.moveTo(0, -s); o.lineTo(s * 0.7, 0); o.lineTo(0, s); o.lineTo(-s * 0.7, 0); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(140,110,30,0.7)'; o.lineWidth = 0.5; o.stroke();
      o.restore();
    }
    MX.dots(o, R, 160, [-140, -140, 280, 280], 0.3, 0.9, 'rgba(90,90,80,0.4)');
    // archaea in a loose crowd, lower left
    for (let k = 0; k < 26; k++) { const a = R() * TAU, d = Math.sqrt(R()) * 44; M.archaeon(o, R, -72 + Math.cos(a) * d, 80 + Math.sin(a) * d * 0.8, 3.4 + R() * 1.8); }
    // cyanobacteria, lower right
    for (let k = 0; k < 34; k++) { const a = R() * TAU, d = Math.sqrt(R()) * 48, x = 66 + Math.cos(a) * d, y = 76 + Math.sin(a) * d * 0.8; if (Math.hypot(x - 32, y - 76) < 10) continue; M.cyano(o, x, y, R() * TAU, 12 + R() * 6); }
    // the filaments over everything
    M.filament(o, R, M.f3, 6);
    M.filament(o, R, M.f2, 7);
    M.filament(o, R, M.f1, 8);
    MX.loupe(o, 94, -92, 40, [30, -22], '×4000', x => M.close(x, R));
    MX.vignette(o, 0.16); MX.grain(o, 0.04);
    MX.scaleBar(o, 40, '10 µm');
  },
});
