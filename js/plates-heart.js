'use strict';
// Plates for the village blood-pressure screening: the clinic's anatomical heart model cut open (four chambers,
// the valves, the great vessels), a stained section with an artery and its vein side by side (st.hyper: the
// artery of a long-untreated high blood pressure, its muscular wall thickened and the lumen narrowed), and a
// capillary threading between muscle fibres, one red cell wide, where oxygen leaves the blood.

// ================================================================ ×1 the anatomical heart model, front half lifted off
// Drawn as anatomy books do: the heart's right side on the viewer's left. Blue for the side that carries blood
// back from the body, red for the side that sends it out.
// spots: right atrium (-54,-28), valve (-42,12), left ventricle (40,58), aorta (56,-118), vena cava (-66,-112)
plate('heartmodel', {
  still(o) {
    const R = MX.rng(8181);
    o.fillStyle = MX.rad(o, 0, -20, 20, 220, [[0, '#E4E8EA'], [1, '#AEB8BE']]); o.fillRect(-141, -141, 282, 282);
    // the stand: a turned wooden base and a brass rod behind the model
    o.fillStyle = '#6A4A30'; U.rr(o, -74, 120, 148, 24, 6); o.fill(); o.fillStyle = 'rgba(255,255,255,0.12)'; o.fillRect(-70, 122, 140, 4);
    o.fillStyle = '#B8963E'; o.fillRect(-3, 96, 6, 26);
    // great vessels behind: the aorta's arch and its three branches, the vena cava coming down into the right atrium
    const tube = (pts, w, col) => { MX.line(o, pts, U.shade(col, -0.35), w + 3); MX.line(o, pts, col, w); MX.line(o, pts.map(([x, y]) => [x - w * 0.18, y - w * 0.18]), 'rgba(255,255,255,0.25)', w * 0.25); };
    for (const bx of [22, 40, 58]) tube([[bx, -118], [bx - 4 + (bx - 40) * 0.2, -141]], 7, '#C83A32');
    tube([[24, -22], [18, -80], [26, -112], [56, -122], [80, -104], [86, -74]], 24, '#C83A32');
    tube([[-62, -141], [-64, -96], [-58, -58]], 20, '#5A78B8');
    tube([[-74, 30], [-84, 80], [-88, 108]], 16, '#5A78B8');
    // the outer surface of the heart, and the cut face of its muscle
    const heart = MX.blob(4, 16, 90, 102, { wob: 0.05, seed: 4, rot: -0.5 });
    MX.fill(o, heart, MX.lit(o, -10, 0, 120, '#B04A44')); MX.line(o, heart, 'rgba(60,20,20,0.9)', 1.6, true);
    const cut = MX.blob(4, 18, 82, 94, { wob: 0.05, seed: 4, rot: -0.5 });
    MX.fill(o, cut, MX.rad(o, 0, 10, 10, 110, [[0, '#E8A89C'], [1, '#D88A80']]));
    for (let k = 0; k < 160; k++) { const x = -80 + R() * 170, y = -70 + R() * 170; o.strokeStyle = 'rgba(160,70,64,0.22)'; o.lineWidth = 0.6; o.beginPath(); o.moveTo(x, y); o.lineTo(x + 5, y + 3); o.stroke(); }
    // coronary vessels on the surface rim
    MX.line(o, [[-40, -52], [-70, -10], [-72, 40], [-50, 90]], 'rgba(200,60,50,0.8)', 2);
    MX.line(o, [[30, -60], [70, -20], [84, 30]], 'rgba(200,60,50,0.8)', 2);
    // the four chambers: the left ventricle's cavity narrow inside a wall three times as thick as the right's
    const cav = (b, col) => { const [cx, cy] = MX.centroid(b); MX.fill(o, b, MX.rad(o, cx - 6, cy - 8, 4, 44, [[0, U.shade(col, 0.25)], [1, col]])); MX.line(o, b, 'rgba(60,20,30,0.7)', 1.2, true); };
    cav(MX.blob(-50, -28, 30, 30, { wob: 0.08, seed: 11 }), '#6A86C0');
    cav(MX.blob(-36, 48, 22, 38, { wob: 0.08, seed: 12, rot: 0.35 }), '#5E7AB6');
    cav(MX.blob(42, -40, 26, 21, { wob: 0.08, seed: 13 }), '#C8544C');
    cav(MX.blob(38, 54, 14, 34, { wob: 0.06, seed: 14, rot: -0.3 }), '#B8403A');
    // the septum between the ventricles, and a dotted line showing how thick the left wall is
    MX.line(o, [[4, -6], [6, 40], [12, 96]], 'rgba(150,60,56,0.5)', 5);
    o.setLineDash([2, 2]); MX.line(o, [[52, 46], [84, 34]], 'rgba(60,20,20,0.6)', 1); o.setLineDash([]);
    // valves: pale flaps held by thin cords to the muscle below, so they open one way only
    const valve = (cx, cy, n, cordTo) => {
      for (let k = 0; k < n; k++) { const x = cx - 14 + k * (28 / (n - 1 || 1)); o.fillStyle = '#F4EAD4'; o.beginPath(); o.moveTo(x - 6, cy - 4); o.quadraticCurveTo(x, cy + 12, x + 6, cy - 4); o.closePath(); o.fill(); o.strokeStyle = 'rgba(120,80,60,0.7)'; o.lineWidth = 0.7; o.stroke();
        MX.line(o, [[x, cy + 6], [cordTo[0] + (k - (n - 1) / 2) * 4, cordTo[1]]], 'rgba(250,240,220,0.8)', 0.7); }
      o.fillStyle = '#C87870'; o.beginPath(); o.ellipse(cordTo[0], cordTo[1] + 4, 6, 8, 0, 0, TAU); o.fill();
    };
    valve(-42, 8, 3, [-34, 60]);
    valve(40, -16, 2, [34, 72]);
    // the pulmonary trunk crossing in front, blue, splitting for the two lungs
    tube([[-12, -30], [-8, -76], [-30, -94], [-62, -86]], 15, '#5A78B8');
    tube([[-8, -76], [14, -96], [40, -94]], 11, '#5A78B8');
    // flow arrows painted on the model
    const arrow = (x0, y0, x1, y1, col) => { MX.line(o, [[x0, y0], [x1, y1]], col, 2.2); const a = Math.atan2(y1 - y0, x1 - x0); o.fillStyle = col; o.beginPath(); o.moveTo(x1, y1); o.lineTo(x1 - 7 * Math.cos(a - 0.4), y1 - 7 * Math.sin(a - 0.4)); o.lineTo(x1 - 7 * Math.cos(a + 0.4), y1 - 7 * Math.sin(a + 0.4)); o.closePath(); o.fill(); };
    arrow(-52, -44, -46, -16, '#F4F2EC'); arrow(-36, 30, -36, 62, '#F4F2EC'); arrow(40, 70, 34, 34, '#F4F2EC'); arrow(22, -36, 18, -70, '#F4F2EC');
    MX.vignette(o, 0.12); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '2 cm');
  },
});

// ================================================================ ×40 an artery and its vein, stained pink and purple
// The artery: a thick ring of smooth muscle wrapped round a round lumen, a wavy elastic line inside, a one-cell
// lining (endothelium). The vein beside it: a thin wall, a wide, sagging lumen full of red cells.
// st.hyper: years of high pressure have thickened the artery's muscle and narrowed its lumen.
const VESSEL = {
  art: [-58, -10], vein: [64, 32],
  dims(hyper) { return hyper ? { lumen: 18, media: 55, adv: 64 } : { lumen: 28, media: 51, adv: 61 }; },
  spots(hyper) {
    const d = this.dims(hyper), [ax, ay] = this.art, at = (deg, r) => [Math.round(ax + Math.cos(deg * Math.PI / 180) * r), Math.round(ay + Math.sin(deg * Math.PI / 180) * r)];
    return { artery: at(-90, d.adv - 4), muscle: at(35, (d.lumen + d.media) / 2 + 3), endo: at(200, d.lumen + 1), vein: [64, -4], rbc: [70, 36] };
  },
};
plate('vessels', {
  key: st => st.hyper ? 1 : 0,
  still(o, st) {
    const R = MX.rng(9191), d = VESSEL.dims(!!st.hyper), [ax, ay] = VESSEL.art, [vx, vy] = VESSEL.vein;
    // loose connective tissue: pale pink fibres, scattered nuclei, fat cells in the corners
    o.fillStyle = '#F4DDE4'; o.fillRect(-141, -141, 282, 282);
    for (let k = 0; k < 140; k++) { const x = -141 + R() * 282, y = -141 + R() * 282, a = R() * TAU; MX.line(o, [[x, y], [x + Math.cos(a) * 14, y + Math.sin(a) * 14 + 3], [x + Math.cos(a) * 26, y + Math.sin(a) * 26]], 'rgba(214,120,160,0.35)', 1); }
    for (const [cx, cy] of [[-120, 110], [-96, 124], [118, -118], [96, -128], [124, 118]]) { o.fillStyle = '#FCF6F8'; o.beginPath(); o.arc(cx, cy, 14 + R() * 5, 0, TAU); o.fill(); o.strokeStyle = 'rgba(200,110,150,0.6)'; o.lineWidth = 0.8; o.stroke(); }
    for (let k = 0; k < 70; k++) { o.fillStyle = 'rgba(100,50,140,0.6)'; o.beginPath(); o.ellipse(-141 + R() * 282, -141 + R() * 282, 2.4, 1.2, R() * 3, 0, TAU); o.fill(); }
    // the vein: thin wall, wide lumen, crowded with red cells
    const vOut = MX.blob(vx, vy, 54, 38, { wob: 0.1, seed: 21, rot: 0.15 }), vIn = MX.inset(vOut, 6);
    MX.fill(o, vOut, '#E08AAA'); MX.fill(o, vIn, '#FBF0F2');
    for (let k = 0; k < 40; k++) { const x = vx - 44 + R() * 88, y = vy - 28 + R() * 56; if (!U.inPoly(x, y, vIn)) continue; o.fillStyle = '#D8403A'; o.beginPath(); o.ellipse(x, y, 3.6, 3, R() * 3, 0, TAU); o.fill(); o.fillStyle = 'rgba(255,200,190,0.5)'; o.beginPath(); o.arc(x, y, 1.2, 0, TAU); o.fill(); }
    for (let k = 0; k < 20; k++) { const a = k / 20 * TAU, x = vx + Math.cos(a) * 51, y = vy + Math.sin(a) * 35; o.fillStyle = 'rgba(100,50,140,0.7)'; o.beginPath(); o.ellipse(x, y, 2.2, 1, a + Math.PI / 2, 0, TAU); o.fill(); }
    MX.line(o, vOut, 'rgba(150,60,110,0.7)', 1, true);
    // the artery: adventitia, muscular media, wavy elastic line, endothelium, open lumen
    o.fillStyle = '#EAA2BE'; o.beginPath(); o.arc(ax, ay, d.adv, 0, TAU); o.fill();
    for (let k = 0; k < 60; k++) { const a = R() * TAU, r = d.media + 1 + R() * (d.adv - d.media - 2); MX.line(o, [[ax + Math.cos(a) * r, ay + Math.sin(a) * r], [ax + Math.cos(a + 0.12) * r, ay + Math.sin(a + 0.12) * r]], 'rgba(190,90,140,0.6)', 0.8); }
    o.fillStyle = '#D66A96'; o.beginPath(); o.arc(ax, ay, d.media, 0, TAU); o.fill();
    for (let r = d.lumen + 4; r < d.media - 1; r += 3.2) for (let k = 0; k < Math.floor(r * 0.9); k++) {
      const a = k / Math.floor(r * 0.9) * TAU + r, x = ax + Math.cos(a) * r, y = ay + Math.sin(a) * r;
      o.fillStyle = 'rgba(90,40,120,0.75)'; o.beginPath(); o.ellipse(x, y, 2.4, 0.8, a + Math.PI / 2, 0, TAU); o.fill();
    }
    o.strokeStyle = '#F6C2DA'; o.lineWidth = 1.4; o.beginPath();
    for (let k = 0; k <= 180; k++) { const a = k / 180 * TAU, r = d.lumen + 2 + Math.sin(k * 1.4) * 1.2; k ? o.lineTo(ax + Math.cos(a) * r, ay + Math.sin(a) * r) : o.moveTo(ax + Math.cos(a) * r, ay + Math.sin(a) * r); }
    o.stroke();
    o.fillStyle = '#FCF4F6'; o.beginPath(); o.arc(ax, ay, d.lumen, 0, TAU); o.fill();
    for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, x = ax + Math.cos(a) * (d.lumen + 0.5), y = ay + Math.sin(a) * (d.lumen + 0.5); o.fillStyle = 'rgba(90,40,120,0.85)'; o.beginPath(); o.ellipse(x, y, 2.6, 0.9, a + Math.PI / 2, 0, TAU); o.fill(); }
    for (let k = 0; k < 3; k++) { const a = R() * TAU, r = R() * d.lumen * 0.6; o.fillStyle = '#D8403A'; o.beginPath(); o.ellipse(ax + Math.cos(a) * r, ay + Math.sin(a) * r, 3.4, 2.8, R() * 3, 0, TAU); o.fill(); }
    MX.vignette(o, 0.14, '120,40,80'); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '0,25 mm');
  },
});

// ================================================================ ×400 a capillary between muscle fibres
// A tube so narrow that red cells pass in single file, bent like little parachutes. Its wall is one flat cell
// thick: oxygen diffuses out to the muscle, carbon dioxide diffuses in.
// spots: CAPIL.spot (capillary wall, red cell, endothelial nucleus, diffusion, sarcomere)
// a gas molecule on its way across a wall, drawn live over the stained section: O₂ red, CO₂ blue. It fades in, glides
// from a to b with an ease and fades out where it arrives, so the eye reads a flow rather than a swarm.
const GAS = {
  dot(x, a, b, ph, o2, r = 1.5) {
    const e = ph * ph * (3 - 2 * ph), al = Math.sin(ph * Math.PI) * 0.9, px = a[0] + (b[0] - a[0]) * e, py = a[1] + (b[1] - a[1]) * e;
    if (Math.abs(px) > 138 - r || Math.abs(py) > 138 - r) return; // (the section is a 280-unit square: nothing spills past it)
    x.fillStyle = o2 ? `rgba(206,34,34,${al.toFixed(2)})` : `rgba(44,72,168,${al.toFixed(2)})`;
    x.beginPath(); x.arc(px, py, r, 0, TAU); x.fill();
  },
};
const CAPIL = {
  k: -0.42, r: 15,
  // a point x along the capillary's centre line, pushed off it sideways (positive: down and right)
  at(x, off = 0) { const n = Math.hypot(1, this.k); return [Math.round((x - this.k * off / n) * 10) / 10, Math.round((this.k * x + off / n) * 10) / 10]; },
  get spot() { return { wall: this.at(6, this.r), rbc: this.at(-46), endo: this.at(62, -this.r - 3), diff: this.at(-30, this.r + 30), sarc: [-96, -92] }; },
};
plate('capillary', {
  still(o) {
    const R = MX.rng(1919), C = CAPIL, n = Math.hypot(1, C.k), ux = 1 / n, uy = C.k / n;
    // H&E stain, drawn in the capillary's own frame: t along it, s across it (positive: down and right).
    // At this magnification one muscle fibre is wider than the field, so each side shows a fibre or two.
    o.save(); o.rotate(Math.atan2(uy, ux));
    const nuc = (t, s, L, W, dark) => {
      o.fillStyle = MX.rad(o, t - L * 0.3, s - W * 0.3, 0.3, L, [[0, dark ? '#6A3E8E' : '#8A5AA8'], [1, dark ? '#321456' : '#4A2270']]);
      o.beginPath(); o.ellipse(t, s, L, W, 0, 0, TAU); o.fill();
      MX.dots(o, R, Math.round(L), [t - L, s - W, 2 * L, 2 * W], 0.25, 0.55, 'rgba(26,6,46,0.5)', (a, b) => ((a - t) / L) ** 2 + ((b - s) / W) ** 2 < 0.7);
    };
    // the endomysium between the fibres: pale loose connective tissue with wavy collagen threads
    o.fillStyle = '#F4E0DE'; o.fillRect(-214, -214, 428, 428);
    for (let k = 0; k < 90; k++) { const s = (R() - 0.5) * 420, t = (R() - 0.5) * 420; MX.line(o, [[t, s], [t + 10, s + (R() - 0.5) * 3], [t + 20, s + (R() - 0.5) * 3]], 'rgba(220,150,170,0.5)', 0.4); }
    // skeletal muscle fibres: eosin pink, fine myofibrils along them, cross-striped by the sarcomeres, their
    // nuclei flat and pushed out to the edge just under the membrane
    [[-300, -158, 1], [-152, -21, 2], [21, 126, 3], [134, 300, 4]].forEach(([s0, s1, seed]) => {
      const e0 = t => s0 + 1.8 * Math.sin(t * 0.021 + seed), e1 = t => s1 + 1.8 * Math.sin(t * 0.017 + seed * 2), poly = [];
      for (let t = -214; t <= 214; t += 8) poly.push([t, e0(t)]);
      for (let t = 214; t >= -214; t -= 8) poly.push([t, e1(t)]);
      MX.fill(o, poly, MX.lin(o, 0, s0, 0, s1, [[0, '#DC8498'], [0.5, '#E89CAE'], [1, '#DA8296']]));
      o.save(); MX.path(o, poly); o.clip();
      for (let s = s0; s < s1; s += 2.4 + R() * 0.8) MX.line(o, [[-214, s], [214, s + (R() - 0.5) * 2]], 'rgba(170,60,96,0.12)', 0.4);
      // dark A bands, pale I bands each split by a thin Z line; neighbouring myofibrils drift a little out of
      // step, so a band steps slightly as it crosses the fibre
      for (let s = s0; s < s1; s += 12) {
        const sh = 1.6 * Math.sin(s * 0.05 + seed * 2) + (R() - 0.5) * 0.6;
        for (let t = -222 + sh; t < 214; t += 9.2) {
          o.fillStyle = 'rgba(146,36,78,0.34)'; o.fillRect(t, s, 5, 12.4);
          o.fillStyle = 'rgba(255,236,242,0.24)'; o.fillRect(t + 5, s, 4.2, 12.4);
          o.fillStyle = 'rgba(110,26,60,0.42)'; o.fillRect(t + 6.9, s, 0.5, 12.4);
        }
      }
      for (const [edge, dir] of [[s0, 1], [s1, -1]]) for (let k = 0; k < 3; k++) nuc(-170 + k * 130 + R() * 60, edge + dir * 4.2, 9 + R() * 3, 2.2, true);
      o.restore();
      MX.line(o, poly, 'rgba(150,56,90,0.55)', 0.7, true);
    });
    // a fibroblast lying in the connective tissue between two fibres
    nuc(40, -155, 8, 1.3, true); nuc(-90, 130, 7, 1.2, true);
    // the capillary: pale plasma inside a wall one flat endothelial cell thick
    o.fillStyle = '#F6E6DE'; o.fillRect(-214, -C.r, 428, 2 * C.r);
    for (const s of [-1, 1]) { o.fillStyle = 'rgba(200,116,146,0.9)'; o.fillRect(-214, s > 0 ? C.r - 1.8 : -C.r, 428, 1.8); MX.line(o, [[-214, s * (C.r + 0.3)], [214, s * (C.r + 0.3)]], 'rgba(130,50,90,0.6)', 0.4); }
    // endothelial nuclei: long, flat, bulging from the wall (one at the callout)
    for (const [t, s] of [[62, -1], [-120, 1], [176, -1]]) nuc(t, s * 16.4, 11, 2.8, false);
    // red cells in single file, bent into parachutes by a tube barely wider than they are: orange-red with eosin,
    // paler where the cell folds thin
    for (let k = -5; k <= 7; k++) {
      o.save(); o.translate(-46 + k * 25 + (k ? (R() - 0.5) * 5 : 0), k ? (R() - 0.5) * 2 : 0);
      o.beginPath(); o.moveTo(-6, -12); o.quadraticCurveTo(8, -13, 8, 0); o.quadraticCurveTo(8, 13, -6, 12); o.quadraticCurveTo(2, 0, -6, -12); o.closePath();
      o.fillStyle = MX.rad(o, 3, -4, 0.5, 13, [[0, '#F08662'], [0.6, '#DA4E36'], [1, '#B8322A']]); o.fill();
      o.strokeStyle = 'rgba(120,20,20,0.55)'; o.lineWidth = 0.5; o.stroke();
      o.fillStyle = 'rgba(255,206,186,0.35)'; o.beginPath(); o.ellipse(2.4, 0, 2.2, 6.5, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(255,230,210,0.4)'; o.lineWidth = 0.5; o.beginPath(); o.moveTo(1, -10.5); o.quadraticCurveTo(6.5, -10, 7, -3); o.stroke();
      o.restore();
    }
    o.restore();
    // diffusion: O2 out to the muscle, CO2 back in (blue dots in, red dots out)
    const arrow = (a, b, col) => {
      MX.line(o, [a, b], col, 1.4); const t = Math.atan2(b[1] - a[1], b[0] - a[0]);
      o.fillStyle = col; o.beginPath(); o.moveTo(b[0], b[1]); o.lineTo(b[0] - 5 * Math.cos(t - 0.5), b[1] - 5 * Math.sin(t - 0.5)); o.lineTo(b[0] - 5 * Math.cos(t + 0.5), b[1] - 5 * Math.sin(t + 0.5)); o.closePath(); o.fill();
    };
    for (let k = 0; k < 3; k++) {
      const c = -54 + k * 24;
      arrow(C.at(c, C.r + 2), C.at(c, C.r + 40), 'rgba(200,40,40,0.9)');
      arrow(C.at(c + 12, C.r + 42), C.at(c + 12, C.r + 4), 'rgba(60,80,160,0.9)');
    }
    const [dx, dy] = C.spot.diff;
    o.font = '700 10px "Courier Prime", monospace'; o.textAlign = 'center';
    o.fillStyle = '#A0282A'; o.fillText('O₂', dx - 34, dy + 30); o.fillStyle = '#34487E'; o.fillText('CO₂', dx + 34, dy + 22);
    MX.vignette(o, 0.14, '100,40,60'); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '10 µm');
  },
  // oxygen leaves the red cells for the muscle on both sides, carbon dioxide comes back into the blood
  live(x, st, t) {
    const C = CAPIL;
    for (let i = 0; i < 28; i++) {
      const o2 = i % 2 === 0, side = i % 4 < 2 ? 1 : -1, along = -150 + ((i * 53) % 300), ph = (t * 0.28 + i * 0.382) % 1;
      const inner = C.at(along, side * (C.r - 4)), outer = C.at(along + 6, side * (C.r + 38));
      GAS.dot(x, o2 ? inner : outer, o2 ? outer : inner, ph, o2, 2);
    }
  },
});

// ================================================================ ×400 the lung: alveoli (BİY.11.2.7)
// H&E again. The air sacs are the empty, near-white spaces packed like a honeycomb; the walls between them are thin
// and pink, and each carries a capillary with red cells in single file. Flat type I cells line every sac (their thin
// nuclei lie along the rims), plump surfactant cells sit in the corners where three sacs meet, and a dust cell full
// of swallowed soot wanders in one sac. Across one wall, O₂ goes in and CO₂ comes out.
const ALV = {
  r: 44,
  // the sac centres, 100 apart (the field is ±140; the outer ones only show in part)
  get sacs() { const a = []; for (let row = -2; row <= 2; row++) for (let i = -3; i <= 3; i++) { const x = i * 100 + (row % 2 ? 50 : 0), y = row * 87; if (Math.abs(x) < 260) a.push([x, y]); } return a; },
  // the walls the callouts point at: [one sac, its neighbour] (the red cells there are placed on purpose)
  WALLS: { cap: [[-50, -87], [0, 0]], rbc: [[-50, 87], [50, 87]], gas: [[50, -87], [150, -87]] },
  // every wall that shows in the field: its middle, the way across it (from one sac to the next) and the way along it
  get walls() {
    if (this._w) return this._w;
    const S = this.sacs, w = [];
    S.forEach((a, i) => S.forEach((b, j) => {
      if (j <= i || Math.hypot(a[0] - b[0], a[1] - b[1]) > 110) return;
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
      if (Math.abs(m[0]) < 140 && Math.abs(m[1]) < 140) w.push({ m, d, u: [-d[1], d[0]] });
    }));
    return (this._w = w);
  },
};
plate('alveoli', {
  still(o) {
    const R = MX.rng(2718), S = ALV.sacs, r0 = ALV.r;
    const rad = (k, th) => r0 * (1 + 0.05 * Math.sin(3 * th + k * 1.7) + 0.035 * Math.sin(5 * th + k * 2.9));
    const ring = k => { const [cx, cy] = S[k], p = []; for (let j = 0; j < 48; j++) { const th = j / 48 * TAU, rr = rad(k, th); p.push([cx + rr * Math.cos(th), cy + rr * Math.sin(th)]); } return p; };
    const inSac = (x, y, pad = 0) => S.some(([cx, cy], k) => Math.hypot(x - cx, y - cy) < rad(k, Math.atan2(y - cy, x - cx)) + pad);
    // the walls: eosin pink with a haze of fine fibres and nuclei
    o.fillStyle = '#E4A6B6'; o.fillRect(-150, -150, 300, 300);
    MX.dots(o, R, 700, [-150, -150, 300, 300], 0.25, 0.6, 'rgba(150,50,100,0.35)', (x, y) => !inSac(x, y, 1));
    // the sacs: empty air with the faintest blush at the rim, each lined by flat type I cells
    S.forEach((c, k) => {
      const p = ring(k);
      MX.fill(o, p, MX.rad(o, c[0], c[1], r0 * 0.5, r0 * 1.05, [[0, '#FDF9F7'], [1, '#F8EDEE']]));
      MX.line(o, p, 'rgba(176,70,110,0.6)', 0.7, true);
      for (let q = 0; q < 2; q++) {
        const th = R() * TAU, rr = rad(k, th) + 0.6;
        o.save(); o.translate(c[0] + rr * Math.cos(th), c[1] + rr * Math.sin(th)); o.rotate(th + Math.PI / 2);
        o.fillStyle = '#5E2C7C'; o.beginPath(); o.ellipse(0, 0, 3.6, 0.9, 0, 0, TAU); o.fill(); o.restore();
      }
    });
    // the capillaries: a paler channel along the middle of each wall, red cells in single file (bright orange-red,
    // paler at the centre where the disc is thin)
    const same = (a, b) => Math.abs(a[0] - b[0]) < 1 && Math.abs(a[1] - b[1]) < 1;
    const forced = w => [ALV.WALLS.cap, ALV.WALLS.rbc, ALV.WALLS.gas].find(f => (same(f[0], w[0]) && same(f[1], w[1])) || (same(f[0], w[1]) && same(f[1], w[0])));
    const rbc = (x, y, ang) => {
      o.save(); o.translate(x, y); o.rotate(ang);
      o.fillStyle = MX.rad(o, -0.5, -0.3, 0.2, 2.7, [[0, '#F4907A'], [0.6, '#D8503A'], [1, '#B4302A']]);
      o.beginPath(); o.ellipse(0, 0, 2.4, 1.55, 0, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(110,20,20,0.5)'; o.lineWidth = 0.3; o.stroke();
      o.fillStyle = 'rgba(255,214,196,0.45)'; o.beginPath(); o.ellipse(0, 0, 1.1, 0.7, 0, 0, TAU); o.fill();
      o.restore();
    };
    S.forEach((a, i) => S.forEach((b, j) => {
      if (j <= i || Math.hypot(a[0] - b[0], a[1] - b[1]) > 110) return;
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, ux = Math.cos(ang), uy = Math.sin(ang);
      MX.line(o, [[mx - ux * 22, my - uy * 22], [mx + ux * 22, my + uy * 22]], 'rgba(246,214,218,0.85)', 4.2);
      const f = forced([a, b]), roll = R(), n = f ? (f === ALV.WALLS.gas ? 2 : 3) : roll < 0.35 ? 0 : 1 + Math.floor(R() * 3);
      for (let k = 0; k < n; k++) { const t = (k - (n - 1) / 2) * 5.6; rbc(mx + ux * t, my + uy * t, ang); }
    }));
    // surfactant cells: plump, foamy (their stored surfactant) with a round nucleus, in the corners where three sacs
    // meet; one sits at the callout's corner
    const t2 = (x, y) => {
      o.fillStyle = MX.rad(o, x - 1.5, y - 1.5, 0.5, 6.5, [[0, '#F7E4EC'], [1, '#E2B8C8']]); o.beginPath(); o.arc(x, y, 5.6, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(140,60,100,0.6)'; o.lineWidth = 0.5; o.stroke();
      MX.dots(o, R, 7, [x - 4.5, y - 4.5, 9, 9], 0.5, 0.9, 'rgba(255,255,255,0.85)', (a, b) => Math.hypot(a - x, b - y) < 4.2);
      o.fillStyle = '#4A2270'; o.beginPath(); o.arc(x + 1.2, y + 1.4, 2.1, 0, TAU); o.fill();
    };
    for (const [x, y] of [[-100, 58], [0, -58], [150, 29], [-100, -116], [100, 116], [-150, -29]]) t2(x, y);
    // a dust cell (an alveolar macrophage) in one sac: a ragged body, a kidney-shaped nucleus, and soot swallowed
    // from the air as dark brown grains
    {
      const x = 62, y = 96;
      o.fillStyle = MX.rad(o, x - 2, y - 2, 1, 9, [[0, '#EFD4C6'], [1, '#D9A99A']]);
      o.beginPath();
      for (let j = 0; j < 14; j++) { const th = j / 14 * TAU, rr = 7.5 + 1.4 * Math.sin(j * 2.3), px = x + rr * Math.cos(th), py = y + rr * Math.sin(th); if (j) o.lineTo(px, py); else o.moveTo(px, py); }
      o.closePath(); o.fill(); o.strokeStyle = 'rgba(120,60,50,0.6)'; o.lineWidth = 0.5; o.stroke();
      o.fillStyle = '#5A2E7A'; o.beginPath(); o.ellipse(x - 2.4, y + 1, 2.6, 1.8, 0.5, 0, TAU); o.fill();
      MX.dots(o, R, 26, [x - 7, y - 7, 14, 14], 0.35, 0.8, 'rgba(58,40,24,0.85)', (a, b) => Math.hypot(a - x, b - y) < 6.2);
    }
    // gas exchange across one wall: O₂ from the air on both sides into the capillary, CO₂ out (red in, blue out)
    const arrow = (a, b, col) => {
      MX.line(o, [a, b], col, 1.1); const t = Math.atan2(b[1] - a[1], b[0] - a[0]);
      o.fillStyle = col; o.beginPath(); o.moveTo(b[0], b[1]); o.lineTo(b[0] - 3.6 * Math.cos(t - 0.5), b[1] - 3.6 * Math.sin(t - 0.5)); o.lineTo(b[0] - 3.6 * Math.cos(t + 0.5), b[1] - 3.6 * Math.sin(t + 0.5)); o.closePath(); o.fill();
    };
    const red = 'rgba(200,40,40,0.9)', blue = 'rgba(60,80,160,0.9)';
    arrow([84, -79], [97, -79], red); arrow([116, -95], [103, -95], red);
    arrow([97, -99], [84, -99], blue); arrow([103, -75], [116, -75], blue);
    o.font = '700 7px "Courier Prime", monospace'; o.textAlign = 'center';
    o.fillStyle = '#A0282A'; o.fillText('O₂', 76, -77); o.fillStyle = '#34487E'; o.fillText('CO₂', 126, -72);
    MX.vignette(o, 0.14, '100,40,60'); MX.grain(o, 0.03);
    MX.scaleBar(o, 29, '50 µm');
  },
  // every wall breathes at once: O₂ drifts out of the air on both sides into its capillary, CO₂ the other way
  live(x, st, t) {
    ALV.walls.forEach((w, k) => {
      for (let j = 0; j < 3; j++) {
        const h = k * 3 + j, o2 = j !== 1, side = (h * 7) % 2 ? 1 : -1, s = ((h * 37) % 25) - 12, ph = (t * 0.24 + h * 0.618) % 1;
        const air = [w.m[0] + w.d[0] * side * 27 + w.u[0] * s, w.m[1] + w.d[1] * side * 27 + w.u[1] * s], cap = [w.m[0] + w.u[0] * s * 0.7, w.m[1] + w.u[1] * s * 0.7];
        GAS.dot(x, o2 ? air : cap, o2 ? cap : air, ph, o2, 1.5);
      }
    });
  },
});
