'use strict';
// Plates for the bats of the sulphur-spring cave: the roost on the cave ceiling under a red torch (surveyors use red
// light, which bats barely notice), a crumbled bat dropping under the stereo microscope (glittering with moth scales
// and insect legs: the proof of what they eat), and a slice through the inner ear, where hair cells turn sound into
// nerve signals.

// ================================================================ ×1 greater horseshoe bats hanging from the ceiling
// spots: nose leaf (-20,36), ear (-46,64), wing (118,10), pup (-84,2)
const ROOST = { face: [-20, -30], wing: [80, -28], mum: [-92, -40] };
plate('roost', {
  still(o) {
    const R = MX.rng(2727);
    // red torchlight on damp rock
    o.fillStyle = MX.rad(o, 0, 10, 20, 210, [[0, '#6A3A2E'], [0.6, '#3A2220'], [1, '#1A1210']]); o.fillRect(-141, -141, 282, 282);
    for (let k = 0; k < 120; k++) { o.fillStyle = `rgba(${140 + R() * 60 | 0},${70 + R() * 30 | 0},${50 + R() * 20 | 0},0.18)`; o.beginPath(); o.arc(-141 + R() * 282, -141 + R() * 282, 2 + R() * 8, 0, TAU); o.fill(); }
    // the ceiling: a band of rock with little knobs the bats' feet hook into
    const ceil = [[-150, -141], [150, -141], [150, -112]]; for (let x = 150; x >= -150; x -= 12) ceil.push([x, -110 + Math.sin(x * 0.09) * 5 + R() * 4]);
    MX.fill(o, ceil, MX.lin(o, 0, -141, 0, -100, [[0, '#2A1A16'], [1, '#5A3A2E']]));
    for (let k = 0; k < 10; k++) { const x = -130 + k * 28 + R() * 10; o.fillStyle = 'rgba(200,150,120,0.35)'; o.beginPath(); o.arc(x, -108 + R() * 4, 1.4, 0, TAU); o.fill(); }
    // a hanging bat: feet hooked on the rock, body wrapped in its wings, head at the bottom
    const hang = (cx, top, len, wid, col, face) => {
      MX.line(o, [[cx - 3, top - 4], [cx - 2, top + 4]], '#2A1A14', 1.6); MX.line(o, [[cx + 3, top - 4], [cx + 2, top + 4]], '#2A1A14', 1.6);
      const body = MX.blob(cx, top + len / 2, wid / 2, len / 2, { wob: 0.04, seed: cx | 0 });
      MX.fill(o, body, MX.lit(o, cx, top + len / 2, len * 0.6, col)); MX.line(o, body, 'rgba(20,10,8,0.8)', 1, true);
      for (let k = 1; k < 5; k++) MX.line(o, [[cx - wid / 2 + 3, top + len * 0.2 * k], [cx - wid * 0.1, top + len * 0.2 * k + 6]], 'rgba(20,10,8,0.35)', 0.8);
      if (!face) return;
      // the face at the bottom: two big ears, the horseshoe-shaped nose leaf between them, tiny eyes
      const fy = top + len;
      for (const s of [-1, 1]) { const ear = [[cx + s * 6, fy - 12], [cx + s * 26, fy + 14], [cx + s * 22, fy + 30], [cx + s * 10, fy + 12]]; MX.fill(o, ear, '#8A5A48'); MX.line(o, ear, 'rgba(30,15,10,0.8)', 1, true); for (let k = 0; k < 4; k++) MX.line(o, [[cx + s * (10 + k * 3), fy + 2 + k * 3], [cx + s * (20 + k), fy + 8 + k * 4]], 'rgba(40,20,14,0.5)', 0.6); }
      MX.fill(o, MX.blob(cx, fy - 4, 16, 14, { wob: 0.05, seed: 4 }), MX.lit(o, cx, fy - 4, 16, '#9A6A56'));
      o.strokeStyle = '#E8B8A0'; o.lineWidth = 3; o.beginPath(); o.arc(cx, fy - 10, 8, 0.15 * Math.PI, 0.85 * Math.PI, true); o.stroke();
      o.fillStyle = '#C88A74'; o.beginPath(); o.ellipse(cx, fy - 13, 3, 5, 0, 0, TAU); o.fill();
      o.fillStyle = '#1A0E0A'; for (const s of [-1, 1]) { o.beginPath(); o.arc(cx + s * 7, fy + 2, 1.4, 0, TAU); o.fill(); }
    };
    // the far cluster first, then the three near bats
    for (let k = 0; k < 7; k++) hang(-128 + k * 18 + R() * 6, -108, 34 + R() * 10, 16, '#5A3A30', false);
    hang(ROOST.mum[0], -108, 92, 44, '#6E4A3C', false);
    // her pup: pinkish, hairless, eyes shut, clinging to her belly
    { const px = -84, py = 2; MX.fill(o, MX.blob(px, py, 11, 16, { wob: 0.05, seed: 7, rot: 0.2 }), MX.lit(o, px, py, 14, '#C8948A')); o.strokeStyle = 'rgba(80,40,30,0.8)'; o.lineWidth = 0.8; o.beginPath(); o.arc(px + 2, py + 10, 3, 0.2, Math.PI - 0.2); o.stroke(); MX.line(o, [[px - 6, py - 6], [px - 12, py - 10]], '#C8948A', 2); }
    hang(ROOST.face[0], -108, 118, 58, '#7A5040', true);
    // a bat stretching one wing: the "hand" bones fanned out, skin between them
    { const [wx, wy] = [100, -30], tips = [[140, -70], [142, -18], [132, 34], [104, 64]];
      hang(ROOST.wing[0], -108, 70, 34, '#6A4638', false);
      const mem = [[wx - 16, wy - 20], ...tips, [wx - 10, wy + 40]];
      MX.fill(o, mem, 'rgba(120,70,56,0.72)'); MX.line(o, mem, 'rgba(40,20,14,0.7)', 0.8, true);
      for (const t of tips) MX.line(o, [[wx, wy], [(wx + t[0]) / 2 + 3, (wy + t[1]) / 2], t], '#3A2018', 1.6);
      MX.line(o, [[wx - 16, wy - 20], [wx, wy]], '#3A2018', 2.4);
      o.fillStyle = '#2A1410'; o.beginPath(); o.moveTo(wx, wy - 2); o.lineTo(wx - 5, wy - 8); o.lineTo(wx + 1, wy - 5); o.closePath(); o.fill();
    }
    MX.vignette(o, 0.2, '20,8,4'); MX.grain(o, 0.04);
    MX.scaleBar(o, 36, '2 cm');
  },
});

// ================================================================ ×40 a bat dropping, crumbled on a white dish
// Dark, dry, and full of glitter: moth-wing scales, a jointed insect leg with spines, a shard of beetle wing case.
// spots: dropping (-30,16), moth scales (64,-52), insect leg (-76,-66), wing case (80,70)
plate('guano', {
  still(o) {
    const R = MX.rng(3838);
    o.fillStyle = MX.rad(o, -20, -20, 20, 210, [[0, '#FBFBF8'], [1, '#DCDCD4']]); o.fillRect(-141, -141, 282, 282);
    // the crumbled pellet: dark brown granules, some still stuck together
    MX.fill(o, MX.blob(-30, 16, 58, 30, { wob: 0.12, seed: 3, rot: -0.3 }), MX.lit(o, -30, 16, 60, '#4A3A2E'));
    for (let k = 0; k < 90; k++) { const a = R() * TAU, r = R() * 80; o.fillStyle = `rgba(${50 + R() * 40 | 0},${36 + R() * 30 | 0},${26 + R() * 20 | 0},0.9)`; o.beginPath(); o.arc(-30 + Math.cos(a) * r * 1.2, 16 + Math.sin(a) * r * 0.7, 1 + R() * 3.4, 0, TAU); o.fill(); }
    // glinting fragments all through it
    for (let k = 0; k < 60; k++) { const x = -90 + R() * 130, y = -20 + R() * 70; o.fillStyle = `hsla(${180 + R() * 120},60%,70%,0.8)`; o.fillRect(x, y, 1.6, 1); }
    // moth scales: little shingles with fine ridges, some still overlapping as on the wing
    for (let k = 0; k < 14; k++) {
      const x = 44 + (k % 5) * 11 + R() * 4, y = -72 + Math.floor(k / 5) * 16 + R() * 4, a = -0.4 + R() * 0.3;
      o.save(); o.translate(x, y); o.rotate(a);
      o.fillStyle = `hsl(${30 + R() * 20},30%,${62 + R() * 18}%)`; o.beginPath(); o.moveTo(-5, -7); o.lineTo(5, -7); o.lineTo(4, 5); o.quadraticCurveTo(0, 9, -4, 5); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(80,60,40,0.5)'; o.lineWidth = 0.4; for (let j = -3; j <= 3; j += 1.5) { o.beginPath(); o.moveTo(j, -6); o.lineTo(j * 0.8, 5); o.stroke(); }
      o.strokeStyle = 'rgba(160,220,255,0.35)'; o.lineWidth = 1; o.beginPath(); o.moveTo(-4, -6); o.lineTo(3, 4); o.stroke();
      o.restore();
    }
    // an insect leg: jointed, with stiff spines
    { const pts = [[-110, -94], [-86, -74], [-60, -58], [-36, -50]]; MX.line(o, pts, '#6A4A2A', 4.5); MX.line(o, pts, 'rgba(255,220,160,0.35)', 1.2);
      for (let k = 0; k < 8; k++) { const t = k / 8, x = -86 + t * 50, y = -74 + t * 24; MX.line(o, [[x, y], [x + 4, y - 7]], '#4A301A', 0.9); }
      for (const [x, y] of [[-86, -74], [-60, -58]]) { o.fillStyle = '#3A2414'; o.beginPath(); o.arc(x, y, 3, 0, TAU); o.fill(); } }
    // a shard of a beetle's wing case, bronze-green and pitted
    { const sh = [[62, 54], [104, 50], [112, 82], [70, 96]]; MX.fill(o, sh, MX.lin(o, 62, 54, 112, 96, [[0, '#4A6A3A'], [0.5, '#A08A3A'], [1, '#3A5A4A']]));
      for (let k = 0; k < 30; k++) { o.fillStyle = 'rgba(20,30,20,0.45)'; o.beginPath(); o.arc(70 + R() * 36, 58 + R() * 32, 0.9, 0, TAU); o.fill(); }
      MX.line(o, sh, 'rgba(20,20,10,0.8)', 0.8, true); }
    MX.vignette(o, 0.1); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '1 mm');
  },
});

// ================================================================ ×400 the organ of hearing, cut across
// On the basilar membrane stand one inner and three outer hair cells, each crowned with a tuft of stiff hairs that
// touch the jelly-like tectorial membrane above. Sound shakes the membrane, the tufts bend, the cells fire, and the
// signal leaves along the nerve fibres of the auditory nerve.
// spots: hair cell (36,-6), basilar membrane (70,70), auditory nerve (-96,92), tectorial (-40,-78)
plate('cochlea', {
  still(o) {
    const R = MX.rng(4949);
    o.fillStyle = '#F4E6EE'; o.fillRect(-141, -141, 282, 282);
    // fluid spaces above and below, faintly pink
    o.fillStyle = 'rgba(250,240,248,0.9)'; o.fillRect(-141, -141, 282, 90);
    // the basilar membrane: a firm band running across
    MX.fill(o, [[-150, 56], [150, 50], [150, 72], [-150, 80]], '#D86A9A');
    for (let x = -140; x < 150; x += 6) MX.line(o, [[x, 56 - x * 0.02], [x + 3, 76 - x * 0.02]], 'rgba(150,40,90,0.35)', 0.6);
    // supporting cells: pale columns and the tunnel between them
    for (let k = 0; k < 9; k++) { const x = -70 + k * 22; MX.fill(o, [[x - 9, 54], [x + 9, 54], [x + 7, 0], [x - 7, 0]], k === 3 ? 'rgba(250,244,248,0.9)' : 'rgba(236,200,220,0.8)'); o.fillStyle = 'rgba(90,40,120,0.7)'; o.beginPath(); o.ellipse(x, 40, 4, 3, 0, 0, TAU); o.fill(); }
    // the hair cells: one flask-shaped inner cell, three rows of tall outer cells, each with a tuft of stiff hairs
    const cell = (x, top, w, h) => {
      MX.fill(o, MX.blob(x, top + h / 2, w / 2, h / 2, { wob: 0.03, seed: x | 0 }), MX.lit(o, x, top + h / 2, h, '#E890B4'));
      o.fillStyle = 'rgba(90,40,120,0.85)'; o.beginPath(); o.ellipse(x, top + h * 0.7, w * 0.3, w * 0.28, 0, 0, TAU); o.fill();
      for (let k = -3; k <= 3; k++) MX.line(o, [[x + k * 1.6, top + 1], [x + k * 1.6 + 1, top - 6 - (3 - Math.abs(k)) * 1.6]], '#7A2A5A', 0.9);
      MX.line(o, [[x, top + h], [x - 20, top + h + 30], [-96, 92]], 'rgba(110,60,150,0.55)', 1);
    };
    cell(-52, -14, 18, 30);
    for (const x of [14, 36, 58]) cell(x, -18, 12, 40);
    // the tectorial membrane: a soft, jelly-like flap lying over the tufts
    MX.fill(o, [[-150, -58], [-40, -44], [40, -30], [80, -28], [90, -22], [40, -22], [-40, -30], [-150, -40]], 'rgba(230,170,210,0.75)');
    MX.line(o, [[-150, -58], [-40, -44], [40, -30], [80, -28], [90, -22]], 'rgba(150,60,110,0.6)', 1);
    // nerve fibres gathering into the auditory nerve, and its cell bodies
    for (let k = 0; k < 10; k++) MX.line(o, [[-60 + k * 3, 80], [-80 - k * 2, 100 + k * 2], [-150, 104 + k * 3]], 'rgba(110,60,150,0.5)', 1.2);
    for (let k = 0; k < 7; k++) { const x = -120 + R() * 40, y = 108 + R() * 26; o.fillStyle = '#B888C8'; o.beginPath(); o.arc(x, y, 6, 0, TAU); o.fill(); o.fillStyle = 'rgba(80,30,110,0.9)'; o.beginPath(); o.arc(x, y, 2.2, 0, TAU); o.fill(); }
    MX.vignette(o, 0.14, '100,40,80'); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '10 µm');
  },
});
