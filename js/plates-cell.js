'use strict';
// Cell plates for Mehmet Dede's doubt: an onion and the slide made from it, onion skin and cheek cells side by side
// under the light microscope (the same painter draws the slide bench's eyepiece view, bubbles and all), and a
// salivary gland cell under the electron microscope, full of the organelles that make and ship out a protein.

// ================================================================ ×1 a halved red onion, the peeled skin, the slide
// spots: scale leaf (-64,14), onion skin (50,-60), coverslip (64,72)
plate('onion', {
  still(o) {
    const R = MX.rng(8181);
    // a worn cutting board
    o.fillStyle = '#C8A070'; o.fillRect(-141, -141, 282, 282);
    for (let k = 0; k < 26; k++) { const y = -141 + k * 11 + R() * 4; MX.line(o, [[-141, y], [141, y + (R() - 0.5) * 6]], 'rgba(120,80,40,0.18)', 0.8 + R()); }
    for (let k = 0; k < 14; k++) { const x = -120 + R() * 240, y = -120 + R() * 240; MX.line(o, [[x, y], [x + 14 + R() * 20, y + (R() - 0.5) * 4]], 'rgba(90,60,30,0.3)', 0.6); }
    // the halved onion: concentric scale leaves, purple skin at each ring's edge
    const cx = -64, cy = 14;
    MX.fill(o, MX.blob(cx + 4, cy + 6, 66, 60, { wob: 0.03, seed: 2 }), 'rgba(60,30,20,0.3)');
    for (let k = 0; k < 8; k++) {
      const rx = 62 - k * 7.4, ry = 57 - k * 6.8;
      if (rx < 6) break;
      o.fillStyle = k === 0 ? '#7A2E4E' : '#A8487A'; o.beginPath(); o.ellipse(cx, cy, rx, ry, 0, 0, TAU); o.fill();
      o.fillStyle = MX.rad(o, cx - rx * 0.2, cy - ry * 0.2, 0, rx, [[0, '#FBF4F6'], [1, '#EEDCE4']]);
      o.beginPath(); o.ellipse(cx, cy, rx - (k === 0 ? 3.2 : 1.6), ry - (k === 0 ? 3.2 : 1.6), 0, 0, TAU); o.fill();
    }
    o.fillStyle = '#E8D8A8'; o.beginPath(); o.ellipse(cx, cy + 44, 16, 6, 0, 0, TAU); o.fill();
    for (let k = 0; k < 7; k++) MX.line(o, [[cx - 12 + k * 4, cy + 48], [cx - 16 + k * 5, cy + 60 + R() * 4]], 'rgba(150,120,70,0.7)', 0.8);
    // one scale leaf lifted out, the paper-thin inner skin peeled off it with forceps
    const sl = MX.blob(40, -30, 26, 12, { wob: 0.06, seed: 5, rot: -0.5 });
    MX.fill(o, sl, MX.lit(o, 40, -30, 26, '#F2E4EA')); MX.line(o, sl, 'rgba(140,60,100,0.8)', 1.2, true);
    const film = [[42, -44], [64, -76], [80, -70], [60, -40]];
    MX.fill(o, MX.soft(film, 0.3), 'rgba(250,250,255,0.55)'); MX.line(o, MX.soft(film, 0.3), 'rgba(160,170,190,0.9)', 0.7, true);
    for (let k = 0; k < 5; k++) MX.line(o, [[48 + k * 5, -48 - k * 3], [64 + k * 3, -72 + k * 2]], 'rgba(170,180,200,0.4)', 0.4);
    // forceps holding the skin
    MX.taper(o, [[74, -74], [96, -104], [118, -128]], 2.4, 3.6, '#B8BCC0', 'rgba(60,64,70,0.9)');
    MX.taper(o, [[80, -72], [104, -100], [122, -124]], 2.4, 3.6, '#C8CCD0', 'rgba(60,64,70,0.9)');
    // a glass slide with a drop, the coverslip half lowered on it, an iodine bottle and a toothpick
    o.fillStyle = 'rgba(210,230,236,0.55)'; o.fillRect(10, 52, 116, 40); o.strokeStyle = 'rgba(90,120,130,0.8)'; o.lineWidth = 1; o.strokeRect(10, 52, 116, 40);
    o.fillStyle = 'rgba(255,255,255,0.35)'; o.fillRect(12, 54, 112, 4);
    o.fillStyle = 'rgba(176,122,42,0.45)'; o.beginPath(); o.ellipse(64, 72, 14, 10, 0, 0, TAU); o.fill();
    o.fillStyle = 'rgba(230,240,245,0.45)'; o.fillRect(50, 58, 28, 28); o.strokeStyle = 'rgba(120,150,160,0.9)'; o.lineWidth = 0.8; o.strokeRect(50, 58, 28, 28);
    o.fillStyle = '#5A3A1A'; U.rr(o, 104, 104, 22, 30, 4); o.fill(); o.fillStyle = '#E8E0D0'; o.fillRect(106, 114, 18, 10);
    o.fillStyle = '#2A2620'; o.fillRect(110, 92, 10, 12); o.fillStyle = '#C8C0B0'; o.beginPath(); o.ellipse(115, 90, 5, 3, 0, 0, TAU); o.fill();
    MX.taper(o, [[-20, 112], [30, 104]], 1.6, 1.2, '#E2C890', 'rgba(120,90,40,0.8)');
    MX.vignette(o, 0.12); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '2 cm');
  },
});

// ================================================================ ×400 onion skin (iodine) or cheek cells (methylene blue)
// Onion: long brick-shaped cells in one layer, stained walls, a thin lining of cytoplasm, a brown nucleus pressed to
// the side, a big clear vacuole, no chloroplasts (the scale leaf grows in the dark). Cheek: loose, flat, irregular
// cells with a membrane only, a dark blue central nucleus and a few mouth bacteria. CELLS.paint also draws the slide
// bench's eyepiece view, with that student's own air bubbles and, for a clumsy peel, a second blurred layer.
const CELLS = {
  BUB: { x: 72, y: -74, r: 24 },
  CHEEK: [[-70, -62, 42, 30], [46, -86, 38, 28], [-18, 26, 44, 34], [88, 36, 36, 30], [-94, 96, 36, 28], [36, 108, 42, 28]],
  _lay: {},
  layout(cheek) {
    const k = cheek ? 'c' : 'o';
    if (this._lay[k]) return this._lay[k];
    const R = MX.rng(cheek ? 4411 : 4422), cells = [];
    if (cheek) {
      this.CHEEK.forEach(([cx, cy, rx, ry], i) => {
        const poly = MX.blob(cx, cy, rx, ry, { wob: 0.16, n: 11, seed: 30 + i, rot: R() * 3 });
        cells.push({ poly, cx, cy, nx: cx + (R() - 0.5) * 8, ny: cy + (R() - 0.5) * 6, nr: 6.5 });
      });
    } else {
      for (let y = -166, row = 0; y < 160; y += 34 + R() * 6, row++) {
        const h = 32 + R() * 5;
        for (let x = -170 - R() * 90; x < 160;) {
          const w = 84 + R() * 56, side = R() < 0.5 ? -1 : 1;
          // a rounded brick: two points near each corner keep the long edges straight through MX's smooth curve
          const a = x + 1.8, b = x + w - 1.8, t = y + 1.8 + (R() - 0.5) * 1.5, u = y + h - 1.8 + (R() - 0.5) * 1.5, c = 4;
          const poly = [[a + c, t], [b - c, t], [b, t + c], [b, u - c], [b - c, u], [a + c, u], [a, u - c], [a, t + c]];
          const nx = side < 0 ? x + 16 + R() * 12 : x + w - 16 - R() * 12;
          cells.push({ poly, x0: x, x1: x + w, y0: y, y1: y + h, cx: x + w / 2, cy: y + h / 2, nx, ny: y + h / 2 + (R() - 0.5) * 6, nr: 6.5, side });
          x += w;
        }
      }
    }
    return (this._lay[k] = cells);
  },
  near(cheek, x, y) { let b = null, d = 1e9; for (const c of this.layout(cheek)) { const e = Math.hypot(c.cx - x, c.cy - y); if (e < d) { d = e; b = c; } } return b; },
  // the fixed callout spots, spread over different cells so the labels don't crowd
  spots(cheek) {
    if (cheek) {
      const L = this.layout(true), a = L[0], b = L[2], c = L[3], d = L[1];
      return { cell: [a.cx + 12, a.cy + 14], nucleus: [b.nx, b.ny], membrane: [c.cx + 34, c.cy], cytoplasm: [d.cx - 18, d.cy + 8] };
    }
    const n = this.near(false, -60, -40), w = this.near(false, -96, -110), v = this.near(false, -30, 70), cy = this.near(false, 50, 92);
    return { nucleus: [n.nx, n.ny], wall: [w.x1, w.cy], vacuole: [v.cx - v.side * (v.x1 - v.x0) * 0.18, v.cy], cytoplasm: [cy.side < 0 ? cy.x1 - 5 : cy.x0 + 5, cy.cy], bubble: [this.BUB.x, this.BUB.y] };
  },
  bubble(o, b) {
    // an air bubble: a thick black rim from total reflection, a bright empty centre
    o.fillStyle = MX.rad(o, b.x, b.y, b.r * 0.2, b.r, [[0, 'rgba(255,255,255,0.95)'], [0.55, 'rgba(236,236,230,0.9)'], [0.78, 'rgba(90,90,86,0.95)'], [0.92, 'rgba(20,20,18,1)'], [1, 'rgba(60,60,56,0.6)']]);
    o.beginPath(); o.arc(b.x, b.y, b.r, 0, TAU); o.fill();
    o.fillStyle = 'rgba(255,255,255,0.9)'; o.beginPath(); o.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.14, 0, TAU); o.fill();
  },
  paint(o, { cheek = false, bubbles = [], thick = false } = {}) {
    const R = MX.rng(cheek ? 5511 : 5522);
    // bright field: the lamp is brightest in the middle, and the stain tints the whole mount faintly
    o.fillStyle = MX.rad(o, 0, 0, 10, 230, cheek ? [[0, '#F7FAFC'], [1, '#D8E2EC']] : [[0, '#FBF4DE'], [1, '#E6D4A2']]); o.fillRect(-170, -170, 340, 340);
    const layer = (dx, dy, alpha) => {
      o.save(); o.translate(dx, dy); o.globalAlpha = alpha;
      if (cheek) {
        // squamous cells scraped off the cheek: flat, thin, irregular, creased where the smear folded them; the
        // cytoplasm faintly blue and finely grained, a small round nucleus near the middle taking the stain hard
        const cells = this.layout(true);
        for (const c of cells) {
          MX.fill(o, c.poly, MX.rad(o, c.cx - 10, c.cy - 8, 4, 52, [[0, 'rgba(206,222,242,0.85)'], [1, 'rgba(162,188,228,0.9)']]));
          o.save(); MX.path(o, c.poly); o.clip();
          for (let k = 0; k < 480; k++) { const a = R() * TAU, r = Math.sqrt(R()) * 50; o.fillStyle = U.rgba(R() < 0.7 ? '#6A8AC8' : '#2E4C9A', 0.14 + R() * 0.2); o.fillRect(c.cx + Math.cos(a) * r, c.cy + Math.sin(a) * r * 0.8, 0.6 + R() * 0.6, 0.6 + R() * 0.6); }
          // folds: a darker crease with the bright edge of the fold beside it
          for (let k = 0; k < 2; k++) {
            const a = R() * TAU, r0 = 14 + R() * 10, pts = [[c.cx + Math.cos(a) * r0, c.cy + Math.sin(a) * r0 * 0.8], [c.cx + Math.cos(a + 0.3) * (r0 + 14), c.cy + Math.sin(a + 0.3) * (r0 + 12) * 0.8], [c.cx + Math.cos(a + 0.2) * (r0 + 30), c.cy + Math.sin(a + 0.2) * (r0 + 26) * 0.8]];
            MX.line(o, pts, 'rgba(50,80,150,0.3)', 1.4); MX.line(o, pts.map(([x, y]) => [x + 1.2, y + 1]), 'rgba(255,255,255,0.4)', 0.6);
          }
          o.restore();
          MX.line(o, c.poly, 'rgba(44,72,140,0.72)', 0.9, true);
          MX.line(o, MX.inset(c.poly, 1.2), 'rgba(255,255,255,0.4)', 0.6, true);
          // the nucleus: a pale halo, the dark chromatin in grains, a glint from the lamp
          o.fillStyle = 'rgba(120,150,210,0.3)'; o.beginPath(); o.ellipse(c.nx, c.ny, c.nr + 3, c.nr * 0.85 + 3, 0.3, 0, TAU); o.fill();
          o.fillStyle = MX.rad(o, c.nx - 2, c.ny - 2, 0.5, c.nr + 1, [[0, '#5474C4'], [0.7, '#243C90'], [1, '#18286A']]);
          o.beginPath(); o.ellipse(c.nx, c.ny, c.nr, c.nr * 0.85, 0.3, 0, TAU); o.fill();
          for (let k = 0; k < 26; k++) { const a = R() * TAU, r = Math.sqrt(R()) * c.nr * 0.8; o.fillStyle = 'rgba(14,20,60,0.5)'; o.beginPath(); o.arc(c.nx + Math.cos(a) * r, c.ny + Math.sin(a) * r * 0.85, 0.5 + R() * 0.5, 0, TAU); o.fill(); }
          o.fillStyle = 'rgba(255,255,255,0.3)'; o.beginPath(); o.ellipse(c.nx - c.nr * 0.35, c.ny - c.nr * 0.35, c.nr * 0.3, c.nr * 0.18, -0.5, 0, TAU); o.fill();
        }
        // mouth bacteria: clusters of tiny dark cocci and a few short rods lying on the cells
        for (let k = 0; k < 22; k++) {
          const c = cells[k % cells.length], x = c.cx + (R() - 0.5) * 60, y = c.cy + (R() - 0.5) * 44;
          for (let j = 0; j < 9; j++) { o.fillStyle = 'rgba(24,40,110,0.8)'; o.beginPath(); o.arc(x + (R() - 0.5) * 10, y + (R() - 0.5) * 10, 0.7 + R() * 0.3, 0, TAU); o.fill(); }
          if (R() < 0.4) { const a = R() * 3; MX.line(o, [[x + 8, y], [x + 8 + Math.cos(a) * 3, y + Math.sin(a) * 3]], 'rgba(24,40,110,0.8)', 1); }
        }
      } else {
        // onion epidermis: one layer of long cells, each almost filled by its clear vacuole. The shared walls are
        // thin, a sharp dark line with a bright rim of bent light; the cytoplasm is a granular film along the walls
        // with strands across the vacuole to the nucleus, which is pressed to one side and takes the iodine brown.
        o.fillStyle = '#A8884A'; o.fillRect(-170, -170, 340, 340);
        for (const c of this.layout(false)) {
          const tint = R() * 0.08;
          MX.fill(o, c.poly, MX.lin(o, 0, c.y0, 0, c.y1, [[0, U.shade('#EFDFB0', tint)], [0.5, U.shade('#F7ECCC', tint)], [1, U.shade('#E9D6A2', tint)]]));
          o.save(); MX.path(o, c.poly); o.clip();
          // the cytoplasm lining the wall, a little darker and full of fine granules
          o.strokeStyle = 'rgba(196,158,86,0.45)'; o.lineWidth = 4.5; o.beginPath(); MX.path(o, c.poly); o.stroke();
          for (let k = 0; k < 90; k++) { const t = R(), top = R() < 0.5; o.fillStyle = U.rgba(R() < 0.5 ? '#8A6A2A' : '#C8A060', 0.5); o.fillRect(c.x0 + t * (c.x1 - c.x0), top ? c.y0 + 2.2 + R() * 2 : c.y1 - 4.2 - R() * 2, 0.8, 0.8); }
          // strands of cytoplasm across the vacuole, meeting at the nucleus
          for (let k = 0; k < 3; k++) { const ex = c.nx - c.side * (20 + R() * (c.x1 - c.x0 - 30)), ey = R() < 0.5 ? c.y0 + 3 : c.y1 - 3; MX.line(o, [[c.nx, c.ny], [(c.nx + ex) / 2, (c.ny + ey) / 2 + (R() - 0.5) * 6], [ex, ey]], 'rgba(176,136,70,0.3)', 0.7); }
          // refractile droplets in the cytoplasm
          for (let k = 0; k < 4; k++) { const x = c.x0 + 6 + R() * (c.x1 - c.x0 - 12), y = R() < 0.5 ? c.y0 + 4 : c.y1 - 5; o.fillStyle = 'rgba(255,255,240,0.8)'; o.beginPath(); o.arc(x, y, 0.9, 0, TAU); o.fill(); o.strokeStyle = 'rgba(120,90,40,0.5)'; o.lineWidth = 0.35; o.stroke(); }
          o.restore();
          // the wall: a crisp dark line, and the bright line of light it bends just inside
          MX.line(o, c.poly, 'rgba(96,70,26,0.85)', 0.8, true);
          MX.line(o, MX.inset(c.poly, 1), 'rgba(255,252,236,0.55)', 0.5, true);
          // the nucleus: a halo of cytoplasm, the stained body with grainy chromatin, one or two dark nucleoli
          o.fillStyle = 'rgba(200,160,90,0.4)'; o.beginPath(); o.ellipse(c.nx, c.ny, c.nr + 4, c.nr + 2.4, 0, 0, TAU); o.fill();
          o.fillStyle = MX.rad(o, c.nx - 2, c.ny - 2, 0.4, c.nr + 1.5, [[0, '#D8A858'], [0.6, '#A87424'], [1, '#7A4A12']]);
          o.beginPath(); o.ellipse(c.nx, c.ny, c.nr + 1.4, c.nr, 0, 0, TAU); o.fill();
          for (let k = 0; k < 22; k++) { const a = R() * TAU, r = Math.sqrt(R()) * c.nr * 0.85; o.fillStyle = 'rgba(90,50,10,0.45)'; o.beginPath(); o.arc(c.nx + Math.cos(a) * r, c.ny + Math.sin(a) * r * 0.75, 0.45 + R() * 0.4, 0, TAU); o.fill(); }
          o.strokeStyle = 'rgba(80,44,8,0.8)'; o.lineWidth = 0.6; o.beginPath(); o.ellipse(c.nx, c.ny, c.nr + 1.4, c.nr, 0, 0, TAU); o.stroke();
          o.fillStyle = '#4A2608'; o.beginPath(); o.arc(c.nx + 1.5, c.ny - 1, 1.7, 0, TAU); o.fill();
          if (R() < 0.4) { o.beginPath(); o.arc(c.nx - 2, c.ny + 1.6, 1.1, 0, TAU); o.fill(); }
          o.fillStyle = 'rgba(255,255,255,0.35)'; o.beginPath(); o.ellipse(c.nx - 2.4, c.ny - 2.4, 2, 1.1, -0.5, 0, TAU); o.fill();
        }
      }
      o.restore();
    };
    layer(0, 0, 1);
    if (thick) { o.save(); o.filter = 'blur(1.2px)'; layer(19, 13, 0.55); o.restore(); o.fillStyle = 'rgba(110,80,40,0.12)'; o.fillRect(-160, -160, 320, 320); }
    for (const b of bubbles) this.bubble(o, b);
  },
};
plate('cells', {
  key: st => st.cheek ? 1 : 0,
  still(o, st) {
    CELLS.paint(o, { cheek: !!st.cheek, bubbles: st.cheek ? [] : [CELLS.BUB] });
    MX.vignette(o, 0.14, st.cheek ? '20,30,50' : '50,36,10'); MX.grain(o, 0.03);
    MX.scaleBar(o, 32, '20 µm');
  },
});

// ================================================================ ×10000 salivary gland cell, transmission electron microscope
// The cell that makes the starch-splitting enzyme in saliva. A big nucleus with a dark nucleolus; rough ER stacked
// with ribosomes; the Golgi's curved stack beside the centrosome; dense secretory granules waiting at the membrane;
// mitochondria for the energy, lysosomes for the clean-up.
// spots: nucleolus GLAND.nucleolus, rough ER (30,-84), Golgi (52,44), centrosome (2,40), secretory granule (106,70),
// mitochondrion (-70,-94), lysosome (-12,112)
const GLAND = { nucleus: [-74, 26, 56], nucleolus: [-84, 38], er: [30, -84], golgi: [52, 44], centriole: [2, 40], granule: [106, 70], mito: [-70, -94], lyso: [-12, 112] };
plate('gland', {
  still(o) {
    const R = MX.rng(9191);
    // cytoplasm as the electron beam sees it: mottled grey, finely granular
    MX.field(o, '#B4B4AE', '#8A8A84', 21, 0.018, 70);
    MX.dots(o, R, 1400, [-141, -141, 282, 282], 0.3, 0.8, 'rgba(40,40,38,0.22)');
    // free ribosomes: fine black specks, many of them in little rosettes (polysomes) reading the same message
    MX.dots(o, R, 380, [-141, -141, 282, 282], 0.5, 0.9, 'rgba(20,20,18,0.7)');
    o.fillStyle = 'rgba(18,18,16,0.8)';
    for (let k = 0; k < 60; k++) { const x = -141 + R() * 282, y = -141 + R() * 282, n = 4 + (R() * 4 | 0), r = 2 + R(); o.beginPath(); for (let j = 0; j < n; j++) { const a = j / n * TAU + R() * 0.3; o.moveTo(x + Math.cos(a) * r + 0.8, y + Math.sin(a) * r); o.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 0.8, 0, TAU); } o.fill(); }
    // the neighbouring cell beyond the membrane, and the membrane itself, a fine double line
    o.fillStyle = '#A4A49E'; o.beginPath(); o.moveTo(141, -141); o.lineTo(128, -141); for (let y = -141; y <= 141; y += 8) o.lineTo(130 + Math.sin(y * 0.05) * 4, y); o.lineTo(141, 141); o.closePath(); o.fill();
    for (const d of [0, 2.6]) { o.strokeStyle = '#2A2A26'; o.lineWidth = 0.9; o.beginPath(); for (let y = -141; y <= 141; y += 4) { const x = 128 + d + Math.sin(y * 0.05) * 4; y === -141 ? o.moveTo(x, y) : o.lineTo(x, y); } o.stroke(); }
    // nucleus: double envelope with pores, chromatin clumped at the rim, a dark nucleolus
    { const [nx, ny, nr] = GLAND.nucleus;
      o.fillStyle = '#C4C4BC'; o.beginPath(); o.arc(nx, ny, nr, 0, TAU); o.fill();
      for (let k = 0; k < 26; k++) { const a = R() * TAU, r = nr - 6 - R() * 8; MX.fill(o, MX.blob(nx + Math.cos(a) * r, ny + Math.sin(a) * r, 6 + R() * 6, 3 + R() * 3, { wob: 0.3, n: 10, seed: k, rot: a }), 'rgba(60,60,56,0.55)'); }
      for (let k = 0; k < 20; k++) { const a = R() * TAU, r = R() * (nr - 18); MX.fill(o, MX.blob(nx + Math.cos(a) * r, ny + Math.sin(a) * r, 3 + R() * 4, 2 + R() * 2, { wob: 0.3, n: 8, seed: 50 + k }), 'rgba(70,70,66,0.35)'); }
      const [ox, oy] = GLAND.nucleolus;
      MX.fill(o, MX.blob(ox, oy, 15, 13, { wob: 0.18, n: 16, seed: 77 }), '#262622');
      for (let k = 0; k < 30; k++) { o.fillStyle = 'rgba(120,120,112,0.5)'; o.beginPath(); o.arc(ox + (R() - 0.5) * 20, oy + (R() - 0.5) * 18, 0.9, 0, TAU); o.fill(); }
      for (const d of [0, 3.2]) {
        o.strokeStyle = '#2A2A26'; o.lineWidth = 1.1;
        for (let a = 0; a < TAU; a += 0.42) { o.beginPath(); o.arc(nx, ny, nr + d, a + 0.05, a + 0.37); o.stroke(); }
      }
    }
    // rough ER: long flattened sacs in parallel, studded with ribosomes
    for (let k = 0; k < 6; k++) {
      const pts = []; for (let t = 0; t <= 1.001; t += 0.1) pts.push([-18 + t * 100, -118 + k * 13 + Math.sin(t * 3 + k) * 5 + t * 10]);
      MX.line(o, pts, '#3A3A36', 4.2); MX.line(o, pts, '#D2D2CA', 2.2);
      for (const [x, y] of pts) for (let j = 0; j < 3; j++) { o.fillStyle = '#121210'; o.beginPath(); o.arc(x + (R() - 0.5) * 9, y + (R() < 0.5 ? -2.8 : 2.8), 0.95, 0, TAU); o.fill(); }
    }
    // Golgi: a curved stack of smooth cisternae, vesicles budding at the ends
    { const [gx, gy] = GLAND.golgi;
      for (let k = 0; k < 5; k++) {
        const r = 22 + k * 5, pts = []; for (let a = -0.9; a <= 0.901; a += 0.15) pts.push([gx - 26 + Math.cos(a) * r, gy + Math.sin(a) * r]);
        MX.line(o, pts, '#3A3A36', 3.6); MX.line(o, pts, '#DADAD2', 1.6);
        for (const s of [-1, 1]) { const a = 0.98 * s; o.strokeStyle = '#3A3A36'; o.lineWidth = 1; o.fillStyle = '#D6D6CE'; o.beginPath(); o.arc(gx - 26 + Math.cos(a) * r + 2, gy + Math.sin(a) * r + s * 3, 2.4, 0, TAU); o.fill(); o.stroke(); }
      }
    }
    // the centrosome: two centrioles at right angles, one cut across (nine triplets), one along its length
    { const [cx, cy] = GLAND.centriole;
      for (let k = 0; k < 9; k++) { const a = k / 9 * TAU; o.save(); o.translate(cx - 6 + Math.cos(a) * 6.5, cy + Math.sin(a) * 6.5); o.rotate(a + 0.6); o.fillStyle = '#1E1E1C'; o.fillRect(-2.2, -0.7, 4.4, 1.4); o.restore(); }
      o.save(); o.translate(cx + 10, cy - 6); o.rotate(0.5); o.fillStyle = 'rgba(40,40,36,0.8)'; o.fillRect(-3.5, -9, 7, 18); o.fillStyle = '#C8C8C0'; o.fillRect(-1.6, -8, 3.2, 16); o.restore(); }
    // secretory granules: dense, round, crowding towards the membrane
    for (const [x, y, r] of [GLAND.granule.concat(11), [110, 36, 9], [96, 100, 10], [114, 124, 8], [100, -20, 8], [112, -52, 10], [90, 10, 7]]) {
      o.fillStyle = MX.rad(o, x - r * 0.3, y - r * 0.3, 0, r, [[0, '#6A6A64'], [1, '#34342F']]); o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
      o.strokeStyle = '#1A1A18'; o.lineWidth = 0.8; o.stroke();
    }
    // mitochondria, one of them fixed for the callout
    for (const [cx, cy, rx, ry, rot] of [GLAND.mito.concat(26, 9.5, 0.1), [-128, 104, 20, 8, 1.2], [58, 112, 20, 8, -0.3], [-40, -128, 18, 7, 0.2]]) {
      o.save(); o.translate(cx, cy); o.rotate(rot);
      o.fillStyle = '#8E8E88'; o.beginPath(); o.ellipse(0, 0, rx + 1, ry + 1, 0, 0, TAU); o.fill();
      o.save(); o.beginPath(); o.ellipse(0, 0, rx - 1.2, ry - 1.2, 0, 0, TAU); o.clip();
      o.fillStyle = '#BCBCB4'; o.fillRect(-rx, -ry, rx * 2, ry * 2);
      for (let k = -rx + 3; k < rx; k += 4.4) { o.strokeStyle = '#2E2E2A'; o.lineWidth = 1.2; o.beginPath(); o.moveTo(k, -ry); o.quadraticCurveTo(k + 2.2, 0, k, ry - 2); o.stroke(); }
      o.restore(); o.strokeStyle = '#1E1E1A'; o.lineWidth = 1.3; o.beginPath(); o.ellipse(0, 0, rx, ry, 0, 0, TAU); o.stroke();
      o.restore();
    }
    // lysosomes: small, very dense, lumpy inside
    for (const [x, y, r] of [GLAND.lyso.concat(8), [18, 98, 5.5], [-40, 96, 5]]) {
      o.fillStyle = '#2A2A26'; o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill();
      for (let k = 0; k < 6; k++) { o.fillStyle = 'rgba(150,150,140,0.5)'; o.beginPath(); o.arc(x + (R() - 0.5) * r, y + (R() - 0.5) * r, 1, 0, TAU); o.fill(); }
    }
    MX.soften(o, 0.45, 0.5);
    MX.vignette(o, 0.18, '10,10,10'); MX.grain(o, 0.1);
    MX.scaleBar(o, 36, '1 µm');
  },
});
