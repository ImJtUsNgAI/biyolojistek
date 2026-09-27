'use strict';
// Meadow plates for the starving stork chick: the sweep-net catch on a white tray (sprayed meadow or not, side by
// side on the study table), a grasshopper's head with the chewing jaws of a plant-eater, and the underside of a
// leaf where four kinds of neighbour meet: aphids, the ladybird that eats them, the ant that milks them, and a
// wasp's mummy that ate one from inside.

// ---------------------------------------------------------------- small painters, shared with the sweep-net bench
const INSECT = {
  KINDS: ['grasshopper', 'caterpillar', 'aphid', 'butterfly', 'ladybird', 'spider'],
  // a jointed leg: thigh then shin, each a tapering stroke
  _leg(o, pts, w, col) {
    o.strokeStyle = col; o.lineCap = 'round'; o.lineJoin = 'round';
    for (let i = 1; i < pts.length; i++) { o.lineWidth = w * (1 - (i - 1) / pts.length * 0.5); o.beginPath(); o.moveTo(pts[i - 1][0], pts[i - 1][1]); o.lineTo(pts[i][0], pts[i][1]); o.stroke(); }
  },
  draw(o, kind, x, y, s = 1, a = 0) {
    o.save(); o.translate(x, y); o.rotate(a); o.scale(s, s);
    o.lineCap = 'round'; o.lineJoin = 'round';
    const leg = (pts, w, col) => this._leg(o, pts, w, col);
    if (kind === 'grasshopper') {
      // side view, head to the left: long drumstick hind legs, folded wings, a saddle over the thorax
      leg([[3, -0.4], [11, -4.6], [5.5, 3.2], [7.5, 3.6]], 1.6, '#4E6E26');
      leg([[-4, 1.6], [-6, 5.2], [-5, 6.4]], 0.6, '#5E7E2E'); leg([[-1, 1.8], [0, 5.6], [1.6, 6.4]], 0.6, '#5E7E2E');
      o.fillStyle = MX.lin(o, 0, -3, 0, 3, [[0, '#9ABC52'], [0.6, '#7AA23E'], [1, '#5A8028']]);
      o.beginPath(); o.moveTo(0, -2); o.bezierCurveTo(6, -2.6, 11, -1.8, 13.5, -0.2); o.bezierCurveTo(12, 1.2, 6, 2.6, 0, 2.2); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(60,90,30,0.6)'; o.lineWidth = 0.3; for (let k = 2; k < 13; k += 1.8) { o.beginPath(); o.moveTo(k, -2 + k * 0.1); o.quadraticCurveTo(k + 0.6, 0, k, 2.2 - k * 0.12); o.stroke(); }
      o.fillStyle = 'rgba(150,160,90,0.8)'; o.beginPath(); o.moveTo(-3, -2.4); o.bezierCurveTo(4, -3.6, 10, -2.6, 14.5, -1.2); o.bezierCurveTo(10, -1.4, 4, -1.2, -3, -1); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(80,80,40,0.5)'; o.lineWidth = 0.2; o.beginPath(); o.moveTo(-2, -1.9); o.lineTo(14, -1.3); o.stroke();
      o.fillStyle = MX.lin(o, 0, -3, 0, 3, [[0, '#8AB448'], [1, '#5E862C']]);
      o.beginPath(); o.moveTo(-6.4, -2.4); o.bezierCurveTo(-3, -3.4, 0, -3, 0.6, -1.6); o.lineTo(0.6, 2); o.bezierCurveTo(-2, 2.8, -5, 2.6, -6.4, 2); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(230,240,190,0.7)'; o.lineWidth = 0.3; o.beginPath(); o.moveTo(-6, -0.6); o.lineTo(0.4, -0.8); o.stroke();
      o.fillStyle = MX.rad(o, -9.5, -1.5, 0.4, 5, [[0, '#A2C45C'], [1, '#6A942E']]);
      o.beginPath(); o.moveTo(-6.2, -2.6); o.bezierCurveTo(-9, -3.6, -12.4, -2, -12, 1.2); o.bezierCurveTo(-11.6, 3.2, -8, 3.2, -6.2, 2.2); o.closePath(); o.fill();
      o.fillStyle = MX.rad(o, -9.6, -1.4, 0.1, 2, [[0, '#B89A60'], [1, '#5A4424']]); o.beginPath(); o.ellipse(-9.2, -1, 1.6, 2, 0.2, 0, TAU); o.fill();
      o.fillStyle = 'rgba(255,255,255,0.7)'; o.beginPath(); o.arc(-9.7, -1.7, 0.4, 0, TAU); o.fill();
      o.fillStyle = '#6A5A30'; o.beginPath(); o.ellipse(-11.3, 2.4, 1, 0.7, 0.4, 0, TAU); o.fill();
      o.strokeStyle = '#6A8A3A'; o.lineWidth = 0.35; o.beginPath(); o.moveTo(-10.6, -2.6); o.quadraticCurveTo(-15, -8, -20, -9.4); o.stroke();
      // the near hind leg: a thick patterned thigh and a spiny shin
      o.fillStyle = MX.lin(o, 0, -4, 0, 2, [[0, '#A6C45E'], [1, '#6A922E']]);
      o.beginPath(); o.moveTo(1.6, 1); o.bezierCurveTo(5, -2.2, 9, -4.6, 11.4, -4); o.bezierCurveTo(11.6, -2.8, 7, 0.4, 2.4, 2.2); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(70,100,30,0.6)'; o.lineWidth = 0.25; for (let k = 0; k < 6; k++) { const t = 0.2 + k * 0.12, px = 1.6 + t * 9.8, py = 1 - t * 5; o.beginPath(); o.moveTo(px, py - 0.8); o.lineTo(px + 0.8, py); o.lineTo(px, py + 0.8); o.stroke(); }
      o.fillStyle = '#3A3A20'; o.beginPath(); o.arc(11.2, -4, 0.8, 0, TAU); o.fill();
      leg([[11.2, -4], [4.6, 4.6], [7, 5]], 0.8, '#5A7A2A');
      o.strokeStyle = '#3A4A20'; o.lineWidth = 0.2; for (let k = 1; k < 6; k++) { const px = 11.2 - k * 1.1, py = -4 + k * 1.44; o.beginPath(); o.moveTo(px, py); o.lineTo(px + 0.7, py + 0.1); o.stroke(); }
    } else if (kind === 'caterpillar') {
      // head to the left: segments with a pale side stripe and black breathing holes, stubby prolegs, a hard head
      const seg = []; for (let k = 0; k < 9; k++) seg.push([-8.4 + k * 2.6, Math.sin(k * 0.9) * 1]);
      o.fillStyle = '#5E7E2E'; for (const k of [2, 3, 4, 5, 8]) { o.beginPath(); o.ellipse(seg[k][0], seg[k][1] + 2.4, 0.9, 1, 0, 0, TAU); o.fill(); }
      for (let k = seg.length - 1; k >= 0; k--) { const [sx, sy] = seg[k]; o.fillStyle = MX.lin(o, 0, sy - 2.8, 0, sy + 2.8, [[0, '#A6CC5C'], [0.55, '#86B044'], [1, '#5E8A2C']]); o.beginPath(); o.ellipse(sx, sy, 1.8, 2.8, 0, 0, TAU); o.fill(); }
      o.strokeStyle = 'rgba(240,244,200,0.8)'; o.lineWidth = 0.35; o.beginPath(); seg.forEach(([sx, sy], i) => i ? o.lineTo(sx, sy + 1) : o.moveTo(sx, sy + 1)); o.stroke();
      o.fillStyle = '#1A1A10'; for (const [sx, sy] of seg.slice(1)) { o.beginPath(); o.arc(sx, sy + 0.2, 0.28, 0, TAU); o.fill(); }
      o.strokeStyle = 'rgba(210,220,180,0.7)'; o.lineWidth = 0.12; for (const [sx, sy] of seg) for (const d of [-1, 1]) { o.beginPath(); o.moveTo(sx + d * 0.6, sy - 2.4); o.lineTo(sx + d * 1.2, sy - 3.6); o.stroke(); }
      o.fillStyle = MX.rad(o, -11.4, -0.6, 0.2, 2.6, [[0, '#8A7A40'], [1, '#4A4020']]); o.beginPath(); o.ellipse(-11, 0.2, 2.2, 2.4, 0, 0, TAU); o.fill();
      o.fillStyle = '#1A1A10'; o.beginPath(); o.arc(-12.3, 1.2, 0.4, 0, TAU); o.fill();
    } else if (kind === 'aphid') {
      // head to the right: a pear-shaped, see-through green body with its young inside, two little tail pipes
      leg([[0.6, 1.4], [1.6, 2.8], [2.4, 3.2]], 0.22, '#6A8A4A'); leg([[-0.4, 1.6], [-0.6, 3.2], [-0.2, 3.8]], 0.22, '#6A8A4A'); leg([[-1.4, 1.4], [-2.8, 2.8], [-3, 3.4]], 0.22, '#6A8A4A');
      leg([[0.6, -1.4], [1.6, -2.8], [2.4, -3.2]], 0.22, '#6A8A4A'); leg([[-0.4, -1.6], [-0.6, -3.2], [-0.2, -3.8]], 0.22, '#6A8A4A'); leg([[-1.4, -1.4], [-2.8, -2.8], [-3, -3.4]], 0.22, '#6A8A4A');
      o.strokeStyle = '#7A9A5A'; o.lineWidth = 0.3; for (const sgn of [-1, 1]) { o.beginPath(); o.moveTo(-2.4, sgn * 1); o.lineTo(-3.9, sgn * 1.7); o.stroke(); }
      o.fillStyle = MX.rad(o, 0, -0.6, 0.2, 3, [[0, 'rgba(200,232,150,0.95)'], [0.7, 'rgba(150,196,100,0.92)'], [1, 'rgba(110,160,70,0.9)']]); o.beginPath(); o.ellipse(-0.4, 0, 2.9, 2.1, 0, 0, TAU); o.fill();
      o.fillStyle = 'rgba(90,140,60,0.45)'; for (const [ex, ey] of [[-1.2, 0.4], [0, -0.5], [-0.4, 0.9]]) { o.beginPath(); o.ellipse(ex, ey, 0.6, 0.45, 0.3, 0, TAU); o.fill(); }
      o.fillStyle = MX.rad(o, 2.6, -0.3, 0.1, 1.3, [[0, '#B8D884'], [1, '#86AE58']]); o.beginPath(); o.ellipse(2.5, 0, 1.2, 1.1, 0, 0, TAU); o.fill();
      o.fillStyle = '#8A2A20'; for (const sgn of [-1, 1]) { o.beginPath(); o.arc(2.9, sgn * 0.8, 0.28, 0, TAU); o.fill(); }
      o.strokeStyle = '#8AA86A'; o.lineWidth = 0.14; for (const sgn of [-1, 1]) { o.beginPath(); o.moveTo(3.2, sgn * 0.5); o.quadraticCurveTo(3.4, sgn * 2.6, 0.6, sgn * 3.4); o.lineTo(-2, sgn * 3.6); o.stroke(); }
      o.fillStyle = 'rgba(255,255,255,0.55)'; o.beginPath(); o.ellipse(-0.8, -1, 1.2, 0.5, -0.2, 0, TAU); o.fill();
    } else if (kind === 'butterfly') {
      // a clouded yellow from above: saffron wings with black borders and veins, a dark spot on each forewing
      for (const sgn of [-1, 1]) {
        o.save(); o.scale(sgn, 1);
        const fw = [[0.8, -1.8], [4, -6], [9, -7.4], [11.6, -5.4], [10, -1.4], [6, 0.6], [1, 0.4]], hw = [[0.8, 0.6], [5.6, 0.8], [8.6, 3], [7.4, 6.8], [3.4, 7.6], [1, 4.6]];
        for (const w of [hw, fw]) {
          MX.fill(o, w, MX.rad(o, 2, 0, 0.5, 11, [[0, '#E89A20'], [0.7, '#F0B238'], [1, '#E4A02A']]));
          o.save(); MX.path(o, w); o.clip(); o.strokeStyle = '#2A1E12'; o.lineWidth = 2.4; MX.path(o, w); o.stroke();
          o.strokeStyle = 'rgba(80,50,20,0.55)'; o.lineWidth = 0.18; for (let k = 0; k < 6; k++) { const t = -0.9 + k * 0.4; o.beginPath(); o.moveTo(1, w === fw ? -0.6 : 1.8); o.lineTo(1 + Math.cos(t) * 12, (w === fw ? -0.6 : 1.8) + Math.sin(t) * 12 * (w === fw ? 1 : -1)); o.stroke(); }
          o.fillStyle = 'rgba(255,250,210,0.8)'; if (w === fw) for (let k = 0; k < 4; k++) { o.beginPath(); o.arc(8 + k * 0.9, -5.6 + k * 1.1, 0.35, 0, TAU); o.fill(); }
          o.restore();
        }
        o.fillStyle = '#2A1E12'; o.beginPath(); o.arc(5.6, -3.4, 0.8, 0, TAU); o.fill();
        o.fillStyle = '#F6A850'; o.beginPath(); o.arc(4.6, 3.4, 0.7, 0, TAU); o.fill();
        o.strokeStyle = '#2A2018'; o.lineWidth = 0.18; o.beginPath(); o.moveTo(0.3, -4.6); o.quadraticCurveTo(1.6, -8, 2.6, -9.4); o.stroke(); o.fillStyle = '#2A2018'; o.beginPath(); o.arc(2.7, -9.5, 0.4, 0, TAU); o.fill();
        o.restore();
      }
      o.fillStyle = MX.lin(o, -1, 0, 1, 0, [[0, '#2A2018'], [0.5, '#5A4A32'], [1, '#2A2018']]); U.rr(o, -0.8, -4.8, 1.6, 10, 0.8); o.fill();
      o.fillStyle = 'rgba(200,190,150,0.5)'; o.beginPath(); o.ellipse(0, -2.4, 0.9, 1.6, 0, 0, TAU); o.fill();
    } else if (kind === 'ladybird') {
      // head to the left: black head and neck shield with white patches, domed red wing cases with seven spots
      o.strokeStyle = '#141412'; o.lineWidth = 0.45; for (const [x0, y0, x1, y1] of [[-2, -2.4, -3.6, -4.2], [0.6, -3.4, 0.4, -5.2], [3, -3.2, 4.6, -4.8], [-2, 2.4, -3.6, 4.2], [0.6, 3.4, 0.4, 5.2], [3, 3.2, 4.6, 4.8]]) { o.beginPath(); o.moveTo(x0, y0); o.lineTo(x1, y1); o.stroke(); }
      o.fillStyle = '#141412'; o.beginPath(); o.ellipse(-3.2, 0, 2, 2.6, 0, 0, TAU); o.fill();
      o.fillStyle = '#F4F2EA'; for (const sgn of [-1, 1]) { o.beginPath(); o.ellipse(-3.2, sgn * 1.7, 0.8, 0.7, 0, 0, TAU); o.fill(); }
      o.fillStyle = '#141412'; o.beginPath(); o.ellipse(-4.9, 0, 1, 1.3, 0, 0, TAU); o.fill();
      o.fillStyle = MX.rad(o, 0, -1.8, 0.2, 5.4, [[0, '#FF7A5A'], [0.45, '#E8402A'], [1, '#A8180E']]); o.beginPath(); o.ellipse(1.3, 0, 4.6, 4.1, 0, 0, TAU); o.fill();
      o.strokeStyle = '#1A0A08'; o.lineWidth = 0.35; o.beginPath(); o.moveTo(-1.6, 0); o.lineTo(5.8, 0); o.stroke();
      o.fillStyle = '#141412'; for (const [sx, sy, r] of [[-1, 0, 1.1], [1.6, -2.2, 0.85], [1.6, 2.2, 0.85], [4, -1.4, 0.75], [4, 1.4, 0.75], [2.8, -3.4, 0.5], [2.8, 3.4, 0.5]]) { o.beginPath(); o.arc(sx, sy, r, 0, TAU); o.fill(); }
      o.fillStyle = 'rgba(255,255,255,0.7)'; o.beginPath(); o.ellipse(0.4, -2.2, 1.4, 0.6, -0.3, 0, TAU); o.fill();
    } else if (kind === 'spider') {
      // a wolf spider from above: eight jointed, banded legs, a striped front body and a patterned abdomen
      // four legs a side fanning out from the front body, each bent outward at the knee
      for (let k = 0; k < 4; k++) for (const sgn of [-1, 1]) {
        const th = sgn * [2.45, 2.0, 1.15, 0.7][k], b0 = [-1.6 + Math.cos(th) * 1.8, Math.sin(th) * 1.6];
        const kn = [b0[0] + Math.cos(th - sgn * 0.35) * 4.6, b0[1] + Math.sin(th - sgn * 0.35) * 4.6], tp = [kn[0] + Math.cos(th + sgn * 0.45) * 4.8, kn[1] + Math.sin(th + sgn * 0.45) * 4.8];
        leg([b0, kn, tp], 0.7, '#4A3622');
        o.fillStyle = 'rgba(200,170,120,0.7)'; o.beginPath(); o.arc(kn[0], kn[1], 0.32, 0, TAU); o.fill();
      }
      o.fillStyle = MX.rad(o, 4, -1, 0.3, 4.4, [[0, '#8A6A48'], [1, '#4A3620']]); o.beginPath(); o.ellipse(3.8, 0, 3.8, 3, 0, 0, TAU); o.fill();
      o.fillStyle = 'rgba(40,26,14,0.8)'; o.beginPath(); o.moveTo(1, 0); o.bezierCurveTo(2.6, -1.8, 5, -1.4, 7, 0); o.bezierCurveTo(5, 1.4, 2.6, 1.8, 1, 0); o.fill();
      o.fillStyle = MX.rad(o, -1.8, -0.6, 0.2, 2.6, [[0, '#7A5E40'], [1, '#3E2C1A']]); o.beginPath(); o.ellipse(-1.6, 0, 2.4, 2.1, 0, 0, TAU); o.fill();
      o.fillStyle = 'rgba(210,180,130,0.7)'; o.fillRect(-3.6, -0.3, 3.8, 0.6);
      o.fillStyle = '#0E0A06'; for (const [ex, ey] of [[-3.6, -0.6], [-3.6, 0.6], [-3, -1.1], [-3, 1.1]]) { o.beginPath(); o.arc(ex, ey, 0.32, 0, TAU); o.fill(); }
    }
    o.restore();
  },
};

// ================================================================ ×1 a sweep-net catch on a white tray
// Unsprayed meadow: dozens of animals of six kinds. Sprayed meadow (st.sprayed): a couple of stragglers.
// spots (meadow): TRAY.spot; (sprayed): grasshopper and spider only
const TRAY = {
  spot: { grasshopper: [-70, -62], caterpillar: [62, -76], butterfly: [-72, 62], ladybird: [68, 58], spider: [2, 8], aphid: [-8, -96] },
  thin: { grasshopper: [-40, 20], spider: [52, -30] },
  lay(sprayed) {
    const R = MX.rng(sprayed ? 2323 : 2424), out = [];
    const n = sprayed ? { grasshopper: 1, spider: 1, aphid: 2 } : { grasshopper: 7, caterpillar: 4, aphid: 16, butterfly: 2, ladybird: 3, spider: 4 };
    const spot = sprayed ? this.thin : this.spot;
    for (const k in n) for (let i = 0; i < n[k]; i++) {
      const [sx, sy] = i === 0 && spot[k] ? spot[k] : [-110 + R() * 220, -110 + R() * 220];
      out.push([k, sx, sy, R() * TAU]);
    }
    return out;
  },
};
plate('catchtray', {
  key: st => st.sprayed ? 1 : 0,
  still(o, st) {
    const R = MX.rng(2525);
    // the grass the tray was set down on, and the enamel tray: blue rim, sloping white sides, a flat floor
    MX.field(o, '#6E8A4A', '#4E6A32', 7, 0.02, 90);
    for (let k = 0; k < 160; k++) { const x = -150 + R() * 300, y = -150 + R() * 300, a = -1.2 + R() * 0.8; MX.line(o, [[x, y], [x + Math.cos(a) * 12, y + Math.sin(a) * 12]], `rgba(${140 + R() * 60 | 0},${170 + R() * 40 | 0},${90 + R() * 30 | 0},0.5)`, 0.8); }
    MX.layer(o, x => { x.fillStyle = 'rgba(10,20,6,0.6)'; U.rr(x, -128, -124, 262, 262, 14); x.fill(); }, 5);
    o.fillStyle = '#2E4E7A'; U.rr(o, -132, -132, 264, 264, 14); o.fill();
    o.fillStyle = MX.lin(o, -128, -128, 128, 128, [[0, '#FFFFFF'], [0.5, '#EEF0EE'], [1, '#D8DCDA']]); U.rr(o, -128, -128, 256, 256, 12); o.fill();
    o.fillStyle = MX.lin(o, 0, -118, 0, 118, [[0, '#F4F6F4'], [1, '#FAFBFA']]); U.rr(o, -116, -116, 232, 232, 8); o.fill();
    o.strokeStyle = 'rgba(150,156,152,0.6)'; o.lineWidth = 0.8; U.rr(o, -116, -116, 232, 232, 8); o.stroke();
    o.fillStyle = 'rgba(40,40,40,0.35)'; for (let k = 0; k < 5; k++) { o.beginPath(); o.arc(-124 + R() * 248, R() < 0.5 ? -126 : 126, 0.8 + R() * 1.4, 0, TAU); o.fill(); }
    // bits of grass and seed heads swept up with the catch
    for (let k = 0; k < (st.sprayed ? 30 : 22); k++) { const x = -106 + R() * 212, y = -106 + R() * 212, a = R() * TAU, l = 6 + R() * 16; MX.taper(o, [[x, y], [x + Math.cos(a) * l * 0.5, y + Math.sin(a) * l * 0.5 + 1], [x + Math.cos(a) * l, y + Math.sin(a) * l]], 1.6, 0.3, st.sprayed ? 'rgba(170,150,90,0.8)' : 'rgba(110,150,60,0.8)'); }
    const lay = TRAY.lay(!!st.sprayed);
    MX.layer(o, x => { x.fillStyle = 'rgba(40,40,30,0.35)'; for (const [k, px, py] of lay) { const r = k === 'aphid' ? 5 : k === 'butterfly' ? 18 : 12; x.beginPath(); x.ellipse(px + 2, py + 3, r, r * 0.6, 0, 0, TAU); x.fill(); } }, 2);
    for (const [k, px, py, a] of lay) INSECT.draw(o, k, px, py, k === 'aphid' ? 2.2 : 2.4, st.sprayed && k !== 'aphid' ? a : a * 0.3);
    if (st.sprayed) { // the dead lie on their backs, legs curled
      o.strokeStyle = 'rgba(60,50,30,0.6)'; o.lineWidth = 1; for (const [px, py] of [TRAY.thin.grasshopper]) { o.beginPath(); o.arc(px, py - 10, 5, 0, Math.PI); o.stroke(); }
    }
    MX.vignette(o, 0.12); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '2 cm');
  },
});

// ================================================================ ×10 a grasshopper's head, face on
// Big compound eyes, simple eyes (ocelli) between them, thread-like antennae, and chewing mouthparts: two heavy
// toothed jaws (mandibles) under a lip, with feeler-like palps: the kit of a leaf-eater.
// spots: compound eye (-58,-30), antenna (-40,-112), mandible (0,86), palp (54,104)
plate('hopperhead', {
  still(o) {
    const R = MX.rng(6161), G = '#86A84A';
    // behind the head: a grass blade far out of focus
    o.fillStyle = MX.rad(o, 0, 0, 20, 200, [[0, '#DCE8CC'], [1, '#A8BC90']]); o.fillRect(-141, -141, 282, 282);
    MX.layer(o, x => { MX.fill(x, [[-141, 60], [-60, -141], [-20, -141], [-120, 141], [-141, 141]], 'rgba(120,160,70,0.5)'); MX.fill(x, [[90, -141], [141, -141], [141, 60]], 'rgba(90,130,60,0.35)'); }, 14);
    // the head capsule: a tall shield of cuticle, lit from the upper left, finely pitted and faintly glossy
    const head = MX.blob(0, 6, 78, 104, { wob: 0.02, seed: 3 });
    MX.line(o, head, 'rgba(40,56,20,0.9)', 1.8, true);
    MX.fill(o, head, MX.lit(o, 0, 6, 104, G, 0.35, 0.45));
    o.save(); MX.path(o, head); o.clip();
    MX.layer(o, x => {
      // the brownish flush on the cheeks, the paler face, a dark band behind the eye
      XP.soft(x, -60, 40, 30, 50, '#8A6A30', 0.35); XP.soft(x, 60, 40, 30, 50, '#8A6A30', 0.3); XP.soft(x, 0, 10, 36, 60, '#D8E6A8', 0.35);
      XP.soft(x, -30, -84, 40, 20, '#FFFFFF', 0.25);
    }, 0);
    for (let k = 0; k < 1400; k++) { const x = -78 + R() * 156, y = -98 + R() * 208, r = 0.4 + R() * 0.7; o.fillStyle = 'rgba(40,60,16,0.3)'; o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill(); o.fillStyle = 'rgba(240,255,200,0.25)'; o.beginPath(); o.arc(x - r * 0.4, y - r * 0.4, r * 0.4, 0, TAU); o.fill(); }
    // the ridges and seams of the capsule: the keel down the face, the suture over the crown, the cheek grooves
    for (const [pts, w] of [[[[0, -96], [1, -60], [0, -20], [-1, 30], [0, 52]], 2.4], [[[-40, -84], [-20, -94], [0, -96], [20, -94], [40, -84]], 1.4], [[[-44, 10], [-36, 40], [-30, 60]], 1.4], [[[44, 10], [36, 40], [30, 60]], 1.4]]) {
      MX.line(o, pts, 'rgba(30,44,12,0.45)', w); MX.line(o, pts.map(([x, y]) => [x - w * 0.5, y - w * 0.3]), 'rgba(236,250,200,0.45)', w * 0.45);
    }
    o.restore();
    // compound eyes: thousands of facets, banded brown, a dark false pupil where the facets look straight at us
    for (const s of [-1, 1]) {
      const cx = s * 58, cy = -30;
      o.fillStyle = MX.rad(o, cx - s * 6, cy - 10, 2, 34, [[0, '#A89068'], [0.6, '#7A6040'], [1, '#3E2E1C']]); o.beginPath(); o.ellipse(cx, cy, 22, 32, s * 0.2, 0, TAU); o.fill();
      o.save(); o.beginPath(); o.ellipse(cx, cy, 21, 31, s * 0.2, 0, TAU); o.clip();
      for (let b = -3; b <= 3; b++) { o.fillStyle = 'rgba(50,34,18,0.28)'; o.save(); o.translate(cx, cy + b * 9); o.rotate(s * 0.2 - 0.3); o.fillRect(-30, -2.2, 60, 4.4); o.restore(); }
      const hx = 2.4, hy = hx * 0.866;
      for (let r = -15; r <= 15; r++) for (let q = -10; q <= 10; q++) {
        const x = cx + q * hx * 1.5, y = cy + r * hy * 2 + (q & 1 ? hy : 0);
        o.strokeStyle = 'rgba(30,22,12,0.35)'; o.lineWidth = 0.3; o.beginPath();
        for (let k = 0; k <= 6; k++) { const a = k / 6 * TAU; k ? o.lineTo(x + Math.cos(a) * hx, y + Math.sin(a) * hx) : o.moveTo(x + hx, y); }
        o.stroke();
      }
      o.fillStyle = MX.rad(o, cx + s * 2, cy + 2, 0.5, 7, [[0, 'rgba(10,6,2,0.9)'], [1, 'rgba(10,6,2,0)']]); o.beginPath(); o.arc(cx + s * 2, cy + 2, 7, 0, TAU); o.fill();
      o.restore();
      o.strokeStyle = 'rgba(30,22,10,0.8)'; o.lineWidth = 1; o.beginPath(); o.ellipse(cx, cy, 22, 32, s * 0.2, 0, TAU); o.stroke();
      o.fillStyle = 'rgba(255,255,255,0.55)'; o.beginPath(); o.ellipse(cx - s * 8, cy - 14, 4, 7, s * 0.3, 0, TAU); o.fill();
      o.fillStyle = 'rgba(255,255,255,0.25)'; o.beginPath(); o.ellipse(cx - s * 4, cy - 4, 9, 14, s * 0.3, 0, TAU); o.fill();
    }
    // three simple eyes (ocelli): small glassy domes between the big ones
    for (const [x, y] of [[0, -58], [-20, -40], [20, -40]]) { o.fillStyle = MX.rad(o, x - 1, y - 1, 0.3, 3.6, [[0, '#FFF8E0'], [0.6, '#D8C898'], [1, '#6A5A38']]); o.beginPath(); o.arc(x, y, 3.4, 0, TAU); o.fill(); o.strokeStyle = '#3A2A18'; o.lineWidth = 0.7; o.stroke(); o.fillStyle = '#FFF'; o.beginPath(); o.arc(x - 1.1, y - 1.2, 0.8, 0, TAU); o.fill(); }
    // antennae: thread-like, a chain of short segments from a socket beside each eye
    for (const s of [-1, 1]) {
      const pts = []; for (let k = 0; k <= 14; k++) pts.push([s * (22 + k * 1.6), -62 - k * 6 + (k * k) * 0.08]);
      o.fillStyle = '#4A3A20'; o.beginPath(); o.ellipse(pts[0][0], pts[0][1] + 2, 5, 4, 0, 0, TAU); o.fill();
      for (let k = 0; k < 14; k++) { const a = pts[k], b = pts[k + 1], w = 3.6 - k * 0.1; MX.tube(o, [[a[0] + (b[0] - a[0]) * 0.08, a[1] + (b[1] - a[1]) * 0.08], [b[0] - (b[0] - a[0]) * 0.08, b[1] - (b[1] - a[1]) * 0.08]], w, k < 2 ? '#6A8A3A' : '#8A7A48', { hiA: 0.5 }); }
    }
    // the lip (labrum) and, under it, the dark toothed mandibles meeting in the middle
    const lip = MX.blob(0, 64, 30, 14, { wob: 0.05, seed: 8 });
    MX.fill(o, lip, MX.lit(o, 0, 64, 30, '#A8BE6A', 0.35, 0.4)); MX.line(o, lip, 'rgba(50,70,30,0.9)', 1.2, true);
    MX.line(o, [[0, 52], [0, 76]], 'rgba(60,80,30,0.5)', 0.8);
    for (const s of [-1, 1]) {
      o.beginPath(); o.moveTo(s * 34, 74); o.quadraticCurveTo(s * 30, 100, s * 2, 98); o.lineTo(s * 2, 84); o.quadraticCurveTo(s * 16, 78, s * 34, 74); o.closePath();
      o.fillStyle = MX.lin(o, s * 34, 74, s * 2, 98, [[0, '#6A5430'], [0.6, '#3A2C1A'], [1, '#1A140C']]); o.fill();
      o.strokeStyle = 'rgba(20,14,6,0.9)'; o.lineWidth = 0.8; o.stroke();
      MX.line(o, [[s * 30, 78], [s * 20, 82], [s * 8, 86]], 'rgba(255,240,200,0.35)', 1);
      o.fillStyle = '#140E08'; for (let k = 0; k < 4; k++) { o.beginPath(); o.moveTo(s * (3 + k * 3), 98); o.lineTo(s * (4.5 + k * 3), 103); o.lineTo(s * (6 + k * 3), 98); o.closePath(); o.fill(); }
    }
    // palps: jointed feelers either side of the mouth, pale at each joint
    for (const s of [-1, 1]) {
      const pts = [[s * 30, 92], [s * 44, 100], [s * 54, 104], [s * 58, 114]];
      for (let k = 0; k < 3; k++) MX.tube(o, [pts[k], pts[k + 1]], 3.4 - k * 0.3, '#8AA050', { hiA: 0.5 });
      for (const [x, y] of pts.slice(1, 3)) { o.fillStyle = 'rgba(230,240,200,0.8)'; o.beginPath(); o.arc(x, y, 1.2, 0, TAU); o.fill(); }
    }
    MX.vignette(o, 0.14, '30,40,20'); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '1 mm');
  },
});

// ================================================================ ×10 under a bean leaf: four kinds of neighbours
// Aphids suck the leaf's sap; a ladybird eats one (predation); an ant strokes another for its sugary honeydew and
// guards the colony (mutualism); a swollen, papery aphid has a wasp larva growing inside it (parasitism).
// spots: aphid (-30,-20), ladybird LEAF.lady, ant LEAF.ant, mummy LEAF.mummy
const LEAF = { lady: [70, 50], ant: [-78, 62], mummy: [40, -86] };
plate('aphidleaf', {
  still(o) {
    const R = MX.rng(7171);
    o.fillStyle = '#6A8A40'; o.fillRect(-141, -141, 282, 282);
    // leaf underside: pale green, net of veins
    o.fillStyle = MX.rad(o, 0, 0, 30, 200, [[0, '#B8D08A'], [1, '#98B86A']]); o.fillRect(-141, -141, 282, 282);
    MX.line(o, [[-141, 10], [141, -6]], 'rgba(220,236,190,0.9)', 7);
    for (let k = -4; k <= 4; k++) { const x = k * 34; MX.line(o, [[x, 4 - x * 0.06], [x + 40, -141]], 'rgba(214,230,180,0.8)', 3); MX.line(o, [[x, 4 - x * 0.06], [x + 40, 141]], 'rgba(214,230,180,0.8)', 3); }
    for (let k = 0; k < 400; k++) { o.fillStyle = 'rgba(255,255,255,0.18)'; o.fillRect(-141 + R() * 282, -141 + R() * 282, 0.8, 2.4); }
    // the aphid colony, drawn big at this scale; honeydew droplets glisten
    for (let k = 0; k < 26; k++) { const x = -60 + R() * 110, y = -60 + R() * 110; if (Math.hypot(x - LEAF.lady[0], y - LEAF.lady[1]) < 30 || Math.hypot(x - LEAF.ant[0], y - LEAF.ant[1]) < 30) continue; INSECT.draw(o, 'aphid', x, y, 3.2 + R() * 2, R() * TAU); }
    INSECT.draw(o, 'aphid', -30, -20, 5.4, 0.4);
    for (let k = 0; k < 8; k++) { const x = -60 + R() * 120, y = -60 + R() * 120; o.fillStyle = 'rgba(255,255,255,0.75)'; o.beginPath(); o.arc(x, y, 2 + R() * 2, 0, TAU); o.fill(); }
    // ladybird with an aphid in its jaws
    INSECT.draw(o, 'ladybird', LEAF.lady[0], LEAF.lady[1], 5, -0.6);
    INSECT.draw(o, 'aphid', LEAF.lady[0] - 26, LEAF.lady[1] + 16, 4.2, 0.8);
    // an ant stroking an aphid with its antennae
    { const [x, y] = LEAF.ant;
      o.fillStyle = '#2A1A12'; for (const [dx, r1, r2] of [[-12, 6, 5], [0, 4, 3.4], [12, 7, 5.6]]) { o.beginPath(); o.ellipse(x + dx, y, r1, r2, 0, 0, TAU); o.fill(); }
      o.strokeStyle = '#2A1A12'; o.lineWidth = 1.2; for (let k = -1; k <= 1; k++) for (const s of [-1, 1]) { o.beginPath(); o.moveTo(x + k * 3, y); o.lineTo(x + k * 6, y + s * 12); o.stroke(); }
      o.beginPath(); o.moveTo(x - 16, y - 3); o.lineTo(x - 24, y - 12); o.lineTo(x - 32, y - 8); o.stroke();
      INSECT.draw(o, 'aphid', x - 40, y - 6, 4.6, 0); }
    // a mummy: a swollen, papery, bronze aphid with a round exit hole
    { const [x, y] = LEAF.mummy;
      o.fillStyle = MX.rad(o, x - 3, y - 3, 1, 14, [[0, '#E8C890'], [1, '#A88048']]); o.beginPath(); o.ellipse(x, y, 13, 9, 0.3, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(90,60,30,0.8)'; o.lineWidth = 0.8; o.stroke();
      o.fillStyle = '#3A2A18'; o.beginPath(); o.arc(x + 6, y - 2, 3, 0, TAU); o.fill(); }
    MX.vignette(o, 0.14, '20,40,10'); MX.grain(o, 0.03);
    MX.scaleBar(o, 36, '2 mm');
  },
});
