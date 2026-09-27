'use strict';
// Yayla plates: two haematocrit tubes after the centrifuge, and a stained blood smear split down the middle,
// Elif's blood (one day at 2200 m) on the left and Uncle Yusuf's (three months up here) on the right.

// ================================================================ ×1 haematocrit: two capillary tubes on a reading card
// Spun blood separates by weight: packed red cells at the bottom, a thin white buffy coat of white cells and
// platelets, and straw-yellow plasma on top. The red share of the column is the haematocrit: 42% for Elif, 54% for
// Yusuf, whose marrow has been making extra red cells since June.
// spots: packed red cells (40,50), buffy coat (40,-6), plasma (-40,-40)
const HCT = {
  base: 96, top: -90, tubes: [{ x: -40, name: 'ELİF', v: 0.42 }, { x: 40, name: 'YUSUF', v: 0.54 }],
  y(v) { return this.base + (this.top - this.base) * v; },
};
plate('hematocrit', {
  still(o) {
    const R = MX.rng(512), H = HCT;
    // a lab table of scrubbed pine
    MX.field(o, '#C9A676', '#8E6A44', 5, 0.02, 70);
    for (let k = 0; k < 40; k++) { const y = -140 + k * 7 + R() * 3; MX.line(o, [[-141, y], [-40, y + (R() - 0.5) * 3], [60, y + (R() - 0.5) * 3], [141, y]], `rgba(110,76,40,${(0.1 + R() * 0.15).toFixed(2)})`, 0.6 + R()); }
    // the reading card: 0% at the top of the clay, 100% at the top of the blood
    o.fillStyle = 'rgba(40,30,20,0.3)'; o.fillRect(-104, -128, 214, 262);
    o.fillStyle = '#F7F3E8'; o.fillRect(-108, -132, 214, 262);
    o.strokeStyle = 'rgba(60,90,140,0.22)'; o.lineWidth = 0.35;
    for (let x = -104; x < 106; x += 4) { o.beginPath(); o.moveTo(x, -128); o.lineTo(x, 126); o.stroke(); }
    for (let y = -128; y < 128; y += 4) { o.beginPath(); o.moveTo(-104, y); o.lineTo(104, y); o.stroke(); }
    for (let p = 0; p <= 100; p += 10) {
      const y = H.y(p / 100);
      o.strokeStyle = p % 50 ? 'rgba(30,40,70,0.45)' : 'rgba(160,50,42,0.8)'; o.lineWidth = p % 50 ? 0.5 : 0.9;
      o.beginPath(); o.moveTo(-100, y); o.lineTo(100, y); o.stroke();
      MX.text(o, String(p), -96, y - 3, 5.5, '#2A3050', 'left');
      MX.text(o, String(p), 98, y - 3, 5.5, '#2A3050', 'right');
    }
    MX.text(o, '%', -96, -116, 6, '#2A3050', 'left');
    for (const T of H.tubes) {
      const x = T.x, red = H.y(T.v), buf = red - 2.2;
      o.fillStyle = 'rgba(40,30,20,0.25)'; o.fillRect(x - 4, -116, 11, 232);
      // air, plasma with its meniscus, the white line, packed red cells, and the clay plug
      o.fillStyle = MX.lin(o, x - 5, 0, x + 5, 0, [[0, '#E4C458'], [0.5, '#F4DC7E'], [1, '#D8B448']]); o.fillRect(x - 4, H.top, 8, buf - H.top);
      o.fillStyle = '#F8F4EA'; o.fillRect(x - 4, buf, 8, red - buf);
      o.fillStyle = MX.lin(o, x - 5, 0, x + 5, 0, [[0, '#6E0E14'], [0.45, '#A8202A'], [1, '#5E0A10']]); o.fillRect(x - 4, red, 8, H.base - red);
      for (let k = 0; k < 20; k++) { o.fillStyle = 'rgba(40,0,6,0.25)'; o.fillRect(x - 4 + R() * 7, red + R() * (H.base - red), 0.6, 2); }
      o.fillStyle = MX.lin(o, x - 6, 0, x + 6, 0, [[0, '#A8482A'], [0.5, '#D8704A'], [1, '#98401E']]); o.fillRect(x - 5, H.base, 10, 16);
      for (let k = 0; k < 14; k++) { o.fillStyle = 'rgba(80,30,10,0.35)'; o.beginPath(); o.arc(x - 4 + R() * 8, H.base + 2 + R() * 13, 0.5 + R() * 0.8, 0, TAU); o.fill(); }
      o.strokeStyle = 'rgba(120,90,30,0.7)'; o.lineWidth = 0.6; o.beginPath(); o.moveTo(x - 4, H.top + 1.4); o.quadraticCurveTo(x, H.top - 1.6, x + 4, H.top + 1.4); o.stroke();
      // the glass wall and its highlights
      o.strokeStyle = 'rgba(160,190,200,0.9)'; o.lineWidth = 1.2; o.strokeRect(x - 5, -118, 10, 230);
      o.fillStyle = 'rgba(255,255,255,0.55)'; o.fillRect(x - 3.4, -116, 1.3, 226);
      o.fillStyle = 'rgba(255,255,255,0.25)'; o.fillRect(x + 2, -116, 0.8, 226);
      // masking-tape label, and the reading pencilled beside the tube
      o.save(); o.translate(x, -124); o.rotate((R() - 0.5) * 0.08);
      o.fillStyle = '#EDE0B8'; o.fillRect(-17, -6, 34, 11); o.strokeStyle = 'rgba(120,100,60,0.5)'; o.lineWidth = 0.4; o.strokeRect(-17, -6, 34, 11);
      MX.text(o, T.name, 0, 0, 6.5, '#2A2418');
      o.restore();
      MX.line(o, [[x + 6, red], [x + 18, red]], 'rgba(60,60,70,0.8)', 0.6);
      o.save(); o.translate(x + 30, red - 1); o.rotate(-0.06);
      MX.text(o, '%' + Math.round(T.v * 100), 0, 0, 10, '#3A3A44');
      o.restore();
    }
    // a lancet and a cotton swab left on the card
    o.save(); o.translate(84, 108); o.rotate(-0.5);
    o.fillStyle = '#E8ECEE'; o.fillRect(-12, -2, 18, 4); o.fillStyle = '#B8C0C4'; o.beginPath(); o.moveTo(6, -1.4); o.lineTo(12, 0); o.lineTo(6, 1.4); o.closePath(); o.fill();
    o.restore();
    MX.fill(o, MX.blob(-86, 110, 8, 6, { seed: 4, wob: 0.2 }), '#FBFAF6'); MX.fill(o, MX.blob(-84, 111, 2.5, 2, { seed: 5 }), 'rgba(170,40,50,0.6)');
    MX.vignette(o, 0.12); MX.grain(o, 0.03);
    MX.scaleBar(o, 34, '1 cm');
  },
});

// ================================================================ ×1000 a stained smear, split down the middle
// Red cells: pink discs with pale centres, no nucleus. A neutrophil with its lobed nucleus, a lymphocyte whose round
// nucleus nearly fills it, and tiny purple platelets. Yusuf's side is crowded with red cells.
// spots: red cell (-30,40), neutrophil (-60,-50), lymphocyte (70,60), platelet (-90,80)
const SMEAR = {
  fixed: [[-30, 40, 7.4]],
  // a red cell is a biconcave disc: the thick rim takes the eosin deeply, the thin middle shows as a pale "central
  // pallor" about a third of the width. Where two cells overlap on the smear the stain doubles, so they multiply.
  rbc(o, x, y, r, R) {
    o.save(); o.translate(x, y); o.rotate(R() * 3); o.scale(1, 0.9 + R() * 0.12);
    o.globalCompositeOperation = 'multiply';
    o.fillStyle = 'rgba(190,120,140,0.14)'; o.beginPath(); o.arc(0.4, 0.6, r + 0.9, 0, TAU); o.fill();
    o.fillStyle = MX.rad(o, 0, 0, 0, r, [[0, '#FAEAE4'], [0.28, '#F4CEC6'], [0.52, '#EBA6A4'], [0.8, '#DE848A'], [0.94, '#D0707A'], [1, '#BC5C6C']]);
    o.beginPath(); o.arc(0, 0, r, 0, TAU); o.fill();
    // the far slope of the dimple a touch darker, the lamp catching the near rim
    o.strokeStyle = 'rgba(170,70,90,0.22)'; o.lineWidth = 0.9; o.beginPath(); o.arc(0, 0, r * 0.4, 0.4, 2.6); o.stroke();
    o.globalCompositeOperation = 'source-over';
    o.strokeStyle = 'rgba(255,240,236,0.4)'; o.lineWidth = 0.6; o.beginPath(); o.arc(0, 0, r - 1, 3.6, 5.4); o.stroke();
    o.strokeStyle = 'rgba(150,50,70,0.55)'; o.lineWidth = 0.4; o.beginPath(); o.arc(0, 0, r, 0, TAU); o.stroke();
    o.restore();
  },
  // twice a red cell across: pale lilac cytoplasm dusted with fine granules, a nucleus of three or four dark
  // lobes with clumped chromatin, joined by threads
  neutrophil(o, R, x, y) {
    const cell = MX.blob(x, y, 12.8, 12.2, { wob: 0.06, n: 18, seed: 21 });
    MX.fill(o, cell, MX.rad(o, x - 3, y - 3, 1, 14, [[0, '#F6E8EE'], [1, '#E4CADC']]));
    MX.dots(o, R, 280, [x - 13, y - 13, 26, 26], 0.14, 0.34, 'rgba(176,110,160,0.45)', (px, py) => Math.hypot(px - x, py - y) < 11.4);
    MX.line(o, cell, 'rgba(150,100,150,0.55)', 0.45, true);
    const L = [[x - 6, y - 3, 4, 3.2, 0.6], [x - 1, y + 3.8, 3.8, 3, -0.3], [x + 4.6, y + 0.4, 3.4, 3.3, 0.2], [x + 5.8, y - 5.4, 3, 2.5, 0.9]];
    MX.line(o, L.map(([a, b]) => [a, b]), '#4A2A6A', 0.8);
    L.forEach(([a, b, rx, ry, rot], i) => {
      const lb = MX.blob(a, b, rx, ry, { rot, wob: 0.14, n: 12, seed: 60 + i });
      MX.fill(o, lb, MX.rad(o, a - 1, b - 1, 0.3, rx + 1, [[0, '#7A58A0'], [0.6, '#4E2E74'], [1, '#341A54']]));
      MX.dots(o, R, 16, [a - rx, b - ry, rx * 2, ry * 2], 0.35, 0.8, 'rgba(28,8,48,0.55)', (px, py) => Math.hypot((px - a) / rx, (py - b) / ry) < 0.8);
      MX.line(o, lb, 'rgba(40,16,60,0.6)', 0.35, true);
    });
  },
  // barely bigger than a red cell: a round, dense, dark nucleus nearly filling it, a thin rim of sky-blue cytoplasm
  lymphocyte(o, R, x, y) {
    const cell = MX.blob(x, y, 9.4, 9, { wob: 0.05, n: 16, seed: 33 });
    MX.fill(o, cell, MX.rad(o, x + 2, y + 2, 1, 10, [[0, '#CADCF2'], [1, '#98B6E0']]));
    MX.line(o, cell, 'rgba(70,90,150,0.6)', 0.45, true);
    const nu = MX.blob(x - 0.8, y - 0.4, 7.4, 7, { wob: 0.08, n: 16, seed: 34, rot: 0.4 });
    MX.fill(o, nu, MX.rad(o, x - 2, y - 2, 0.5, 8, [[0, '#6A4C90'], [0.7, '#3E2462'], [1, '#2A1446']]));
    MX.dots(o, R, 60, [x - 8, y - 8, 16, 16], 0.3, 0.9, 'rgba(18,6,34,0.5)', (px, py) => Math.hypot(px - x + 0.8, py - y + 0.4) < 6.4);
    o.fillStyle = 'rgba(232,240,252,0.5)'; o.beginPath(); o.ellipse(x + 6.2, y + 3.6, 2, 1.3, 0.5, 0, TAU); o.fill();
  },
  // fragments of a bone-marrow giant cell: a pale rim round a purple granular middle
  platelet(o, R, x, y) {
    const b = MX.blob(x, y, 1.5 + R() * 0.9, 1.2 + R() * 0.7, { rot: R() * TAU, wob: 0.3, n: 9, seed: Math.floor(R() * 50) });
    MX.fill(o, b, 'rgba(190,160,214,0.85)'); MX.dots(o, R, 6, [x - 1.1, y - 0.9, 2.2, 1.8], 0.22, 0.45, '#4E2270');
  },
};
plate('blood', {
  still(o) {
    const R = MX.rng(611), S = SMEAR;
    MX.field(o, '#F4ECEE', '#D8C6D2', 17, 0.014, 50);
    const white = [[-60, -50, 15], [70, 60, 12]], keep = (x, y, g) => white.every(([a, b, r]) => Math.hypot(x - a, y - b) > r + g) && S.fixed.every(([a, b]) => Math.hypot(x - a, y - b) > 13);
    // the two halves: fewer red cells for Elif (left), a crowd for Yusuf (right)
    const left = MX.scatter(R, 44, 16.5, [-136, -112, 132, 250], (x, y) => keep(x, y, 8) && !(x > -100 && x < -80 && y > 70 && y < 90));
    const right = MX.scatter(R, 78, 12.6, [4, -112, 132, 250], (x, y) => keep(x, y, 8));
    for (const [x, y] of left.concat(right)) S.rbc(o, x, y, 6.6 + R() * 1, R);
    for (const [x, y, r] of S.fixed) S.rbc(o, x, y, r, R);
    S.neutrophil(o, R, -60, -50);
    S.lymphocyte(o, R, 70, 60);
    // platelets: a small clump on Elif's side, others scattered
    for (let k = 0; k < 6; k++) S.platelet(o, R, -90 + (R() - 0.5) * 9, 80 + (R() - 0.5) * 7);
    for (let k = 0; k < 16; k++) S.platelet(o, R, (R() - 0.5) * 270, -110 + R() * 240);
    // the divide and the two names
    o.setLineDash([5, 4]); MX.line(o, [[0, -140], [0, 140]], 'rgba(40,30,50,0.55)', 0.9); o.setLineDash([]);
    for (const [x, t] of [[-70, 'ELİF · %42'], [70, 'YUSUF · %54']]) {
      o.font = '700 7.5px "Courier Prime", monospace'; const tw = o.measureText(t).width;
      o.fillStyle = 'rgba(27,26,23,0.82)'; U.rr(o, x - tw / 2 - 4, -130, tw + 8, 12, 3); o.fill();
      MX.text(o, t, x, -123.5, 7.5, '#F4EEDD');
    }
    MX.vignette(o, 0.16, '60,30,50'); MX.grain(o, 0.03);
    MX.scaleBar(o, 19, '10 µm');
  },
});
