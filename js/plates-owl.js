'use strict';
// Barn owl plates: the owl's face as a sound dish, and a slice of its retina, which can be set beside a human fovea.

// ================================================================ ×1 the barn owl's head and shoulders
// A heart-shaped facial disc of stiff white feathers bounded by a ruff; the ruff is parted on both sides to show
// the ear openings: the left one above eye level, the right one below it. A loupe shows the comb on the leading
// edge of a flight feather.
// The head is drawn at 0.86 scale, 6 units down (OWLF.at maps head units to plate units for the callouts).
// spots: facial disc OWLF.at(-30,46), left ear OWLF.at(-86,-40), eye OWLF.at(-28,-16), feather loupe (100,-100)
const OWLF = {
  EYE: 18, EAR_L: [-86, -40], EAR_R: [88, 8], K: 0.86, DY: 6,
  at(x, y) { return [Math.round(x * this.K), Math.round(y * this.K + this.DY)]; },
  // the heart outline of the disc (the ruff line): a notch on the crown, widest at the eyes, a rounded chin
  HEART: [[0, -72], [40, -96], [78, -78], [96, -40], [98, -4], [86, 34], [60, 66], [30, 90], [0, 102], [-30, 90], [-60, 66], [-86, 34], [-98, -4], [-96, -40], [-78, -78], [-40, -96]],
  disc(k = 1) { return this.HEART.map(([x, y]) => [x * k, y * k - (k - 1) * 20]); },
  // the same outline, densely sampled, for the ruff's feathers
  dense() { const H = this.HEART, out = []; for (let i = 0; i < H.length; i++) { const a = H[i], b = H[(i + 1) % H.length]; for (let j = 0; j < 8; j++) out.push([a[0] + (b[0] - a[0]) * j / 8, a[1] + (b[1] - a[1]) * j / 8]); } return out; },
};
plate('owlhead', {
  still(o) {
    const R = MX.rng(4040);
    // the dim loft behind: beams and straw
    o.fillStyle = MX.lin(o, 0, -140, 0, 140, [[0, '#3A2E22'], [1, '#221A12']]); o.fillRect(-141, -141, 282, 282);
    for (let k = 0; k < 5; k++) { o.fillStyle = `rgba(120,90,56,${(0.15 + R() * 0.1).toFixed(2)})`; o.fillRect(-141, -130 + k * 58, 282, 12); }
    for (let k = 0; k < 60; k++) MX.line(o, [[-140 + R() * 280, 100 + R() * 40], [-140 + R() * 280, 100 + R() * 40]], `rgba(210,180,110,${(0.2 + R() * 0.3).toFixed(2)})`, 0.6);
    // shoulders and folded wings: golden-buff with grey veils and fine white-and-black dots
    const body = [[-138, 141], [-122, 64], [-86, 34], [86, 34], [122, 64], [138, 141]];
    MX.fill(o, MX.soft(body, 0.3), MX.lin(o, 0, 30, 0, 140, [[0, '#D4AE72'], [1, '#B08A56']]));
    for (let k = 0; k < 140; k++) { const x = -130 + R() * 260, y = 50 + R() * 90; if (Math.abs(x) < 52 && y > 60) continue; o.fillStyle = `rgba(150,150,150,${(0.15 + R() * 0.2).toFixed(2)})`; o.beginPath(); o.ellipse(x, y, 4 + R() * 6, 1.5 + R() * 2, -0.4 + R() * 0.8, 0, TAU); o.fill(); }
    for (let k = 0; k < 70; k++) { const x = -130 + R() * 260, y = 50 + R() * 90; o.fillStyle = '#F8F4EA'; o.beginPath(); o.arc(x, y, 0.9, 0, TAU); o.fill(); o.fillStyle = '#2A2218'; o.beginPath(); o.arc(x + 0.9, y + 0.5, 0.6, 0, TAU); o.fill(); }
    // flight feathers of the right wing, with the comb on their leading edge
    for (let k = 0; k < 4; k++) { const x0 = 92 + k * 10; MX.line(o, [[x0, 60], [x0 + 12, 141]], 'rgba(90,70,40,0.6)', 0.7); }
    // white chest
    MX.fill(o, MX.blob(0, 110, 58, 60, { wob: 0.06, n: 20, seed: 4 }), '#F4EEE2');
    for (let k = 0; k < 26; k++) { o.fillStyle = 'rgba(70,50,30,0.55)'; o.beginPath(); o.arc(-44 + R() * 88, 70 + R() * 70, 0.9, 0, TAU); o.fill(); }
    // the head: buff crown, the disc, the ruff
    o.save(); o.translate(0, OWLF.DY); o.scale(OWLF.K, OWLF.K);
    MX.fill(o, OWLF.disc(1.14), '#C89E62');
    for (let k = 0; k < 80; k++) { const a = R() * TAU, r = 90 + R() * 12; o.fillStyle = 'rgba(245,240,230,0.6)'; o.beginPath(); o.arc(Math.cos(a) * r * 0.95, Math.sin(a) * r - 18, 0.8, 0, TAU); o.fill(); }
    const disc = OWLF.disc(1);
    MX.fill(o, disc, MX.rad(o, 0, -6, 10, 96, [[0, '#FFFDF8'], [0.75, '#F6EEE0'], [1, '#E6D2B2']]));
    // the disc feathers radiate from the eyes like the ribs of a dish
    o.save(); MX.path(o, disc); o.clip();
    for (const side of [-1, 1]) for (let k = 0; k < 70; k++) {
      const a = k / 70 * TAU, cx = side * 28, cy = -16, r0 = OWLF.EYE + 3, r1 = 60 + R() * 40;
      MX.line(o, [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a + 0.12 * side) * r1, cy + Math.sin(a + 0.12 * side) * r1]], 'rgba(170,150,120,0.28)', 0.5);
    }
    o.restore();
    // the ruff: a rim of short, dense, darker feathers
    for (const [x, y] of OWLF.dense()) { const a = Math.atan2(y - 4, x); MX.line(o, [[x - Math.cos(a) * 4, y - Math.sin(a) * 4], [x + Math.cos(a) * 3, y + Math.sin(a) * 3]], '#8A6436', 2.4); }
    MX.line(o, disc, '#6A4A26', 1.2, true);
    // the ear openings, where the ruff is parted: left high, right low
    for (const [ex, ey, flip] of [[...OWLF.EAR_L, -1], [...OWLF.EAR_R, 1]]) {
      o.save(); o.translate(ex, ey); o.rotate(flip * 0.25);
      MX.fill(o, MX.blob(0, 0, 7, 15, { wob: 0.1, n: 16, seed: ex > 0 ? 2 : 1 }), '#E8C8B0');
      MX.fill(o, MX.blob(flip * 1.5, 0, 4, 11, { wob: 0.1, n: 14, seed: 5 }), '#5A2E24');
      for (let k = -3; k <= 3; k++) MX.line(o, [[-flip * 7, k * 4], [-flip * 15, k * 4.6]], '#8A6436', 1.6);
      o.restore();
    }
    // eye level, dashed, so the difference in height shows
    o.strokeStyle = 'rgba(40,60,120,0.75)'; o.lineWidth = 0.9; o.setLineDash([4, 3]);
    o.beginPath(); o.moveTo(-104, -16); o.lineTo(104, -16); o.stroke(); o.setLineDash([]);
    // eyes: big, dark, facing forward, fixed in their sockets
    for (const side of [-1, 1]) {
      const cx = side * 28, cy = -16;
      MX.fill(o, MX.blob(cx, cy, OWLF.EYE + 3, OWLF.EYE, { wob: 0.05, seed: side + 3 }), '#6A4A2E');
      o.fillStyle = MX.rad(o, cx - 4, cy - 5, 1, OWLF.EYE, [[0, '#3A2A22'], [1, '#0A0706']]); o.beginPath(); o.arc(cx, cy, OWLF.EYE - 3, 0, TAU); o.fill();
      o.fillStyle = 'rgba(255,255,255,0.85)'; o.beginPath(); o.ellipse(cx - 5, cy - 6, 3.2, 2.2, -0.5, 0, TAU); o.fill();
    }
    // the ridge between the eyes and the hooked beak
    MX.fill(o, [[-6, -34], [6, -34], [9, 4], [0, 16], [-9, 4]], '#D8B888');
    MX.fill(o, [[-6, 6], [6, 6], [4, 26], [0, 34], [-4, 26]], '#E8DCC4'); MX.line(o, [[-6, 6], [-4, 26], [0, 34], [4, 26], [6, 6]], 'rgba(90,70,50,0.8)', 0.8);
    o.restore();
    // a loupe on the leading edge of a flight feather: a comb of free barb tips breaks up the rush of air
    MX.loupe(o, 100, -100, 32, [104, 96], '×10', x => {
      x.fillStyle = '#BFA27A'; x.fillRect(-40, -40, 80, 80);
      MX.line(x, [[-40, 10], [40, -18]], '#6A5030', 2.6);
      for (let k = 0; k < 17; k++) {
        const bx = -38 + k * 5, by = 10 - (k * 5 + 2) * 0.35;
        MX.line(x, [[bx, by], [bx - 3, by + 24]], 'rgba(90,70,44,0.8)', 0.8);
        MX.line(x, [[bx, by], [bx + 5, by - 7], [bx + 7, by - 9]], '#F0E4CC', 0.9);
      }
    });
    MX.vignette(o, 0.2); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '2 cm', true);
  },
});

// ================================================================ ×400 retina, vertical section
// Light comes from the top and passes through the nerve layers to the photoreceptors at the back. The owl's
// retina is packed with slender rods (dim light) and has few cones, each with a coloured oil droplet as in all
// birds. The human fovea (st.human) is the reverse: stubby cones side by side, no rods, and the inner layers
// pushed aside into a pit.
// spots: rods (-40,66) or cones (-40,66 human), a cone (62,74), ganglion layer (-60,-104), pigment layer (0,124)
const RETINA = {
  cones: [-104, -58, 62, 104],
};
plate('retina', {
  key: st => st.human ? 1 : 0,
  still(o, st) {
    const R = MX.rng(st.human ? 91 : 90), human = !!st.human;
    // vitreous at the top, pale
    o.fillStyle = '#F4ECEE'; o.fillRect(-141, -141, 282, 282);
    const pit = x => human ? 30 * Math.exp(-(x * x) / 2600) : 0;
    // nerve fibre layer and ganglion cells
    for (let k = 0; k < 14; k++) { const y = -130 + k * 1.4; MX.line(o, [[-141, y + pit(-141) * 0.8], [-60, y + 2], [0, y + pit(0) * 0.8], [60, y + 2], [141, y]], 'rgba(214,140,170,0.5)', 0.8); }
    for (let x = -136; x <= 136; x += 11 + R() * 5) {
      const y = -104 + pit(x) * 0.9 + (R() - 0.5) * 4;
      if (human && Math.abs(x) < 22) continue;
      o.fillStyle = '#E4B8CC'; o.beginPath(); o.ellipse(x, y, 6, 5, 0, 0, TAU); o.fill();
      o.fillStyle = '#6A3A84'; o.beginPath(); o.arc(x, y, 3, 0, TAU); o.fill();
    }
    // inner plexiform layer, a pink felt
    for (let k = 0; k < 500; k++) { const x = -140 + R() * 280, y = -92 + R() * 18 + pit(x) * 0.8; o.fillStyle = 'rgba(210,130,160,0.35)'; o.fillRect(x, y, 1.2, 1.2); }
    // inner nuclear layer: bipolar cells, dense purple nuclei
    for (let k = 0; k < 420; k++) { const x = -140 + R() * 280, y = -70 + R() * 30 + pit(x) * 0.6; if (human && Math.abs(x) < 18) continue; o.fillStyle = R() < 0.5 ? '#5A2E78' : '#7A4A94'; o.beginPath(); o.ellipse(x, y, 2.2, 1.8, 0, 0, TAU); o.fill(); }
    // outer plexiform
    for (let k = 0; k < 260; k++) { const x = -140 + R() * 280, y = -36 + R() * 8 + pit(x) * 0.3; o.fillStyle = 'rgba(210,130,160,0.35)'; o.fillRect(x, y, 1.1, 1.1); }
    // outer nuclear layer: the photoreceptors' own nuclei, many rows deep in the owl
    for (let k = 0; k < (human ? 520 : 1100); k++) { const x = -140 + R() * 280, y = -24 + R() * 50; o.fillStyle = R() < 0.6 ? '#3E2060' : '#5A3478'; o.beginPath(); o.ellipse(x, y, 1.7, 2.1, 0, 0, TAU); o.fill(); }
    // outer limiting line
    MX.line(o, [[-141, 30], [141, 30]], 'rgba(120,60,90,0.6)', 0.8);
    if (!human) {
      // rods: slender, pale, packed side by side
      for (let x = -140; x <= 140; x += 3.1) {
        if (RETINA.cones.some(c => Math.abs(x - c) < 6)) continue;
        const j = (R() - 0.5) * 1.4;
        o.fillStyle = '#EAC2CE'; o.fillRect(x - 1 + j, 32, 2, 34);
        o.fillStyle = '#D896AE'; o.fillRect(x - 0.9 + j, 66, 1.8, 40);
        o.strokeStyle = 'rgba(140,70,100,0.5)'; o.lineWidth = 0.3; o.strokeRect(x - 1 + j, 32, 2, 74);
      }
      // a few cones, each with its oil droplet
      for (const [i, cx] of RETINA.cones.entries()) {
        MX.fill(o, [[cx - 4.5, 32], [cx + 4.5, 32], [cx + 3.5, 66], [cx + 1.2, 84], [cx - 1.2, 84], [cx - 3.5, 66]], '#E8B0C2');
        MX.line(o, [[cx - 4.5, 32], [cx - 3.5, 66], [cx - 1.2, 84], [cx + 1.2, 84], [cx + 3.5, 66], [cx + 4.5, 32]], 'rgba(120,50,80,0.8)', 0.5);
        o.fillStyle = ['#E0402A', '#F2C23A', '#E0402A', '#F2C23A'][i]; o.beginPath(); o.arc(cx, 64, 2.6, 0, TAU); o.fill();
      }
    } else {
      // cones only, thin and tall at the fovea's floor
      for (let x = -140; x <= 140; x += 5) {
        const j = (R() - 0.5) * 1.2;
        MX.fill(o, [[x - 2.2 + j, 32], [x + 2.2 + j, 32], [x + 1.8 + j, 62], [x + 0.8 + j, 100], [x - 0.8 + j, 100], [x - 1.8 + j, 62]], '#E8B0C2');
        MX.line(o, [[x - 2.2 + j, 32], [x - 1.8 + j, 62], [x - 0.8 + j, 100]], 'rgba(120,50,80,0.6)', 0.4);
      }
    }
    // the pigment epithelium: a dark band of melanin that soaks up stray light
    o.fillStyle = '#4A2A1E'; o.fillRect(-141, 106, 282, 16);
    for (let k = 0; k < 300; k++) { o.fillStyle = R() < 0.5 ? '#2A160E' : '#6A3E28'; o.fillRect(-140 + R() * 280, 106 + R() * 15, 1.2, 1.2); }
    // choroid below, with blood vessels
    o.fillStyle = '#C8849A'; o.fillRect(-141, 122, 282, 20);
    for (let k = 0; k < 6; k++) { o.fillStyle = '#B03A4A'; o.beginPath(); o.ellipse(-120 + k * 48 + R() * 10, 132, 9, 4, 0, 0, TAU); o.fill(); }
    // incoming light
    for (const x of [-110, 110]) { o.strokeStyle = 'rgba(230,180,40,0.9)'; o.lineWidth = 1.6; o.beginPath(); o.moveTo(x, -140); o.lineTo(x, -118); o.stroke(); o.fillStyle = 'rgba(230,180,40,0.9)'; o.beginPath(); o.moveTo(x - 4, -120); o.lineTo(x + 4, -120); o.lineTo(x, -113); o.closePath(); o.fill(); }
    MX.vignette(o, 0.12, '60,20,40'); MX.grain(o, 0.03);
    MX.scaleBar(o, 32, '20 µm');
  },
});
