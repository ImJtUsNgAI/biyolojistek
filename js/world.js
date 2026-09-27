'use strict';
// The valley: layout data, collision grid, pathfinding, camera, particles, interaction and the render pipeline.
const WORLD = {
  W: 4800, H: 3200,
  riverCtl: [[4130, 650], [3960, 780], [3760, 960], [3520, 1150], [3300, 1320], [3080, 1470], [2880, 1600], [2680, 1720], [2460, 1820], [2230, 1890], [1990, 1935], [1760, 1955], [1520, 1985], [1300, 2065], [1110, 2185], [940, 2320], [820, 2430]],
  pond: { x: 700, y: 2540, rx: 250, ry: 175 },
  bridges: [
    { x: 2230, y: 1893, len: 190, w: 64 },
    { x: 2790, y: 1668, len: 190, w: 64 },
  ],
  paths: [
    { w: 46, main: true, pts: [[2400, 1600], [2360, 1660], [2290, 1750], [2212, 1822], [2248, 1978], [2215, 2090], [2230, 2200], [2260, 2300]] },
    { w: 46, main: true, pts: [[2440, 1640], [2560, 1640], [2690, 1600], [2744, 1591], [2836, 1745], [2960, 1880], [3140, 2010], [3300, 2140], [3380, 2200], [3380, 2420], [3380, 2620]] },
    { w: 40, pts: [[2330, 1600], [2200, 1560], [2080, 1420], [1980, 1300], [1880, 1225]] },
    { w: 40, pts: [[2560, 1620], [2700, 1480], [2860, 1300], [3050, 1150], [3240, 1070]] },
    { w: 34, pts: [[1800, 1230], [1560, 1170], [1300, 1060], [1080, 930], [880, 780]] },
    { w: 32, pts: [[3300, 1040], [3520, 900], [3760, 770], [3960, 690], [4100, 610]] },
    { w: 36, pts: [[2250, 2330], [2150, 2395], [1720, 2398], [1310, 2400], [1120, 2440], [1000, 2500]] },
    { w: 40, pts: [[3380, 2620], [3200, 2660], [3000, 2720], [2820, 2790], [2640, 2800], [2520, 2760], [2420, 2560], [2360, 2380]] },
    { w: 36, pts: [[3380, 2620], [3620, 2700], [3880, 2800], [4120, 2890]] },
    { w: 28, pts: [[2644, 1500], [2664, 1330], [2652, 1215], [2585, 1180]] },
    { w: 30, pts: [[2930, 2760], [2932, 2900], [2962, 2990], [3100, 3002], [3236, 2990]] },
    { w: 30, pts: [[4150, 2880], [4270, 2830], [4390, 2790], [4410, 2740]] },
    { w: 28, pts: [[4450, 790], [4462, 700], [4468, 630], [4494, 566], [4540, 505], [4566, 440]] },
  ],
  fields: [
    { id: 'A', x: 1330, y: 2150, w: 360, h: 220, ang: 0.08 },
    { id: 'B', x: 1740, y: 2110, w: 360, h: 230, ang: -0.05 },
    { id: 'C', x: 1330, y: 2440, w: 360, h: 220, ang: 0.02 },
    { id: 'D', x: 1740, y: 2420, w: 360, h: 230, ang: -0.1 },
  ],
  paddocks: [
    { id: 'clover', x: 3500, y: 2190, w: 430, h: 330, gate: { side: 'w', a: 2300, b: 2390 } },
    { id: 'grass', x: 2880, y: 2230, w: 380, h: 330, gate: { side: 'e', a: 2290, b: 2460 } },
  ],
  yards: [
    [[2150, 1600], [2650, 1600], [2690, 1760], [2140, 1770]],
    [[2380, 1060], [2690, 1060], [2700, 1196], [2370, 1196]],
    [[1660, 1205], [2080, 1205], [2100, 1290], [1650, 1285]],
    [[2140, 2140], [2400, 2130], [2410, 2390], [2140, 2400]],
    [[3260, 2130], [3500, 2130], [3500, 2640], [3260, 2640]],
    [[2400, 2640], [2900, 2640], [2960, 3000], [2380, 3010]],
    [[3980, 2760], [4320, 2760], [4320, 2960], [3980, 2960]],
  ],
  buildings: [
    { id: 'hub', kind: 'school', x: 2180, y: 1290, w: 440, d: 300, h: 78, door: 2400, enter: true },
    { id: 'greenhouse', kind: 'glass', x: 1690, y: 1000, w: 360, d: 210, h: 64, door: 1870, enter: true },
    { id: 'barn', kind: 'barn', x: 3120, y: 1880, w: 380, d: 250, h: 92 },
    { id: 'riza', kind: 'house', x: 3560, y: 1800, w: 220, d: 160, h: 64, tint: 0 },
    { id: 'shed', kind: 'shed', x: 2200, y: 2150, w: 120, d: 80, h: 50 },
    { id: 'clinic', kind: 'clinic', x: 2620, y: 2600, w: 240, d: 150, h: 64, door: 2740, enter: true },
    { id: 'h1', kind: 'house', x: 2280, y: 2760, w: 180, d: 130, h: 60, tint: 1 },
    { id: 'firin', kind: 'bakery', x: 2980, y: 2800, w: 180, d: 120, h: 60 },
    { id: 'kahve', kind: 'kahve', x: 2660, y: 2900, w: 220, d: 120, h: 58 },
    { id: 'h3', kind: 'house', x: 2420, y: 3000, w: 190, d: 120, h: 58, tint: 3 },
    { id: 'songul', kind: 'house', x: 3000, y: 860, w: 170, d: 110, h: 56, tint: 2 },
    { id: 'station', kind: 'station', x: 4080, y: 2780, w: 170, d: 100, h: 60 },
    { id: 'seedbank', kind: 'vault', x: 4290, y: 2560, w: 240, d: 160, h: 66, door: 4410, enter: true },
    { id: 'yaylaevi', kind: 'yayla', x: 4420, y: 222, w: 150, d: 92, h: 52 },
  ],
  regions: {
    hub: { x: 2400, y: 1450, r: 560, name: { tr: 'Saha İstasyonu', en: 'Field Station' } },
    greenhouse: { x: 1870, y: 1100, r: 430, name: { tr: 'Sera', en: 'Greenhouse' } },
    farm: { x: 1720, y: 2390, r: 660, name: { tr: 'Ata Tohumu Çiftliği', en: 'Heirloom Seed Farm' } },
    barn: { x: 3380, y: 2200, r: 640, name: { tr: 'Ahır ve Mera', en: 'Barn & Pasture' } },
    pond: { x: 720, y: 2520, r: 520, name: { tr: 'Gölet', en: 'Pond' } },
    meadow: { x: 3300, y: 1000, r: 560, name: { tr: 'Çayır ve Arılık', en: 'Meadow & Apiary' } },
    forest: { x: 720, y: 620, r: 780, name: { tr: 'Orman Kıyısı', en: 'Forest Edge' } },
    clinic: { x: 2740, y: 2840, r: 500, name: { tr: 'Köy Meydanı', en: 'Village Square' } },
    cave: { x: 4250, y: 560, r: 520, name: { tr: 'Kükürtlü Pınar', en: 'Sulphur Spring' } },
    yayla: { x: 4570, y: 330, r: 240, name: { tr: 'Yayla', en: 'The Yayla' } },
    halt: { x: 4240, y: 2780, r: 460, name: { tr: 'Tohum Bankası ve Durak', en: 'Seed Bank & Halt' } },
  },
  meadowPoly: null, forestPoly: null, rockPoly: null,
  // the yayla: a high meadow in a hollow of the rock, and the corridor the path climbs through from the spring
  yaylaPoly: [[4380, 200], [4560, 180], [4735, 190], [4745, 330], [4730, 480], [4640, 530], [4540, 545], [4505, 570], [4498, 650], [4436, 650], [4440, 570], [4410, 520], [4372, 420], [4366, 300]],
};

// ---------------------------------------------------------------- camera & particles
const CAM = { x: 2400, y: 1700, z: 1, tx: 0, ty: 0 };

const PART = {
  list: [],
  add(p) { if (this.list.length < 420) this.list.push(Object.assign({ t: 0, life: 2, vx: 0, vy: 0, s: 1, a: 1 }, p)); },
  // how high above its ground point each small life is drawn (its body, where a finger aims)
  LIFT: { butterfly: 24, bee: 18, dragonfly: 30, frog: 3, snail: 2 },
  // a critter drawn big on its own, for the sighting card and the journal
  icon(cv, kind) {
    const x = cv.getContext('2d'), k = cv.width / 72;
    const sc = { butterfly: 5, bee: 6.5, dragonfly: 3.4, bird: 4.2, stork: 2.3, ladybug: 8, snail: 5, frog: 4.6 }[kind] * k, ox = kind === 'bird' ? 2.5 : kind === 'dragonfly' ? 3 : 0;
    const seed = { bird: 5.59, stork: 4.43 }[kind] || 1.1;   // wings spread wide for the portrait
    x.clearRect(0, 0, cv.width, cv.height);
    x.save(); x.translate(cv.width / 2, cv.height / 2); x.scale(sc, sc); x.translate(ox, this.LIFT[kind] || 0);
    this.draw.call({ list: [{ kind, x: 0, y: 0, t: 0.95, life: 10, solid: true, a: 1, s: 1, vx: 0, vy: 0, seed, c: '#E8A040', dir: -0.35 }] }, x);
    x.restore();
  },
  // small lives that come back with the land: butterflies, bees at the hives, dragonflies on the pond, birds passing over
  critter(kind, x, y, o = {}) {
    const R = Math.random, p = { kind, x, y, solid: true, seed: R() * 9 };
    if (kind === 'butterfly') Object.assign(p, { life: 9 + R() * 6, dx: (R() - 0.5) * 30, c: ['#F2E6A0', '#F4F2EA', '#E8A040', '#A8C8EC', '#F0B8C8'][R() * 5 | 0] });
    else if (kind === 'bee') Object.assign(p, { life: 5 + R() * 4, hx: x, hy: y, r: 18 + R() * 46, w: (R() < 0.5 ? -1 : 1) * (1.6 + R() * 1.6) });
    else if (kind === 'dragonfly') Object.assign(p, { life: 9 + R() * 6, hx: x, hy: y, nt: 0, dir: R() * TAU });
    else if (kind === 'snail') Object.assign(p, { life: 40 + R() * 20, dir: R() * TAU, sp: 3 + R() * 2 });
    else if (kind === 'ladybug') Object.assign(p, { life: 18 + R() * 10, dir: R() * TAU });
    else if (kind === 'frog') Object.assign(p, { life: 25 + R() * 15, nt: 1 + R() * 2, hop: 0, face: R() < 0.5 ? -1 : 1 });
    else Object.assign(p, { life: 12, vx: kind === 'stork' ? 70 : 130, vy: -6 });
    this.add(Object.assign(p, o));
  },
  update(dt) {
    for (const p of this.list) {
      p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.kind === 'smoke') { p.vx += 6 * dt; p.s += dt * 0.8; }
      if (p.kind === 'leaf') { p.vx = 20 + Math.sin(p.t * 3 + p.seed) * 25; }
      if (p.kind === 'bubble') p.vx = Math.sin(p.t * 6 + p.seed) * 8;
      if (p.kind === 'butterfly') { p.vx = p.dx + Math.sin(p.t * 1.3 + p.seed) * 30; p.vy = Math.cos(p.t * 1.9 + p.seed * 2) * 20 - 3; }
      if (p.kind === 'bee') { const a = p.t * p.w + p.seed; p.x = p.hx + Math.cos(a) * p.r + Math.sin(p.t * 9) * 4; p.y = p.hy + Math.sin(a) * p.r * 0.55 + Math.cos(p.t * 11) * 3; }
      if (p.kind === 'dragonfly') {
        // darts, hangs still, darts again, never far from the water
        if ((p.nt -= dt) <= 0) {
          p.nt = 0.5 + Math.random() * 1.1;
          const far = Math.hypot(p.hx - p.x, p.hy - p.y) > 160, a = Math.atan2(p.hy - p.y, p.hx - p.x) + (Math.random() - 0.5) * (far ? 1 : 5), sp = far ? 130 : 40 + Math.random() * 120;
          p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp * 0.6;
        }
        const damp = Math.max(0, 1 - dt * 2.5); p.vx *= damp; p.vy *= damp;
        if (Math.hypot(p.vx, p.vy) > 6) p.dir = Math.atan2(p.vy, p.vx);
      }
      // the ground lives: a snail inching along, a ladybird wandering, a frog that sits and then hops
      if (p.kind === 'snail' || p.kind === 'ladybug') {
        const sn = p.kind === 'snail', s = sn ? p.sp * (0.6 + 0.4 * Math.sin(p.t * 2.2 + p.seed)) : 9;
        p.dir += (sn ? Math.sin(p.t * 0.3 + p.seed) * 0.2 : Math.sin(p.t * 1.7 + p.seed * 3) * 2.2) * dt;
        p.vx = Math.cos(p.dir) * s; p.vy = Math.sin(p.dir) * s * 0.65;
        if (W.onWater(p.x, p.y) || W.solid(p.x, p.y)) { p.x -= p.vx * dt * 2; p.y -= p.vy * dt * 2; p.dir += Math.PI; }
      }
      if (p.kind === 'frog') {
        if (p.hop > 0) {
          p.hop -= dt;
          if (p.hop <= 0) {
            p.hop = 0; p.vx = p.vy = 0;
            // a hop into the pond: a small splash and it is gone under the water
            if (W.onWater(p.x, p.y)) { PART.add({ kind: 'splash', x: p.x, y: p.y, life: 0.6 }); p.life = Math.min(p.life, p.t + 0.25); }
          }
        } else if ((p.nt -= dt) <= 0) {
          const a = Math.random() * TAU;
          p.nt = 1.5 + Math.random() * 2.5; p.hop = 0.35; p.vx = Math.cos(a) * 80; p.vy = Math.sin(a) * 50; p.face = p.vx < 0 ? -1 : 1;
        }
      }
    }
    this.list = this.list.filter(p => p.t < p.life);
  },
  draw(ctx) {
    for (const p of this.list) {
      const k = p.t / p.life, fade = p.solid ? Math.min(1, p.t * 2, (p.life - p.t) * 2) : Math.min(1, k * 5) * (1 - k);
      ctx.save();
      ctx.globalAlpha = fade * p.a;
      switch (p.kind) {
        case 'smoke':
          ctx.fillStyle = 'rgba(235,232,222,0.5)';
          U.ellipse(ctx, p.x, p.y, 7 * p.s, 5 * p.s); ctx.fill();
          break;
        case 'sparkle':
          ctx.strokeStyle = p.c || '#FFF4C8'; ctx.lineWidth = 1.5;
          const r = 3 + 3 * Math.sin(k * Math.PI);
          ctx.beginPath(); ctx.moveTo(p.x - r, p.y); ctx.lineTo(p.x + r, p.y); ctx.moveTo(p.x, p.y - r); ctx.lineTo(p.x, p.y + r); ctx.stroke();
          break;
        case 'petal':
          ctx.fillStyle = p.c || '#F2D4DA';
          U.ellipse(ctx, p.x, p.y, 3, 1.8, p.t * 3 + p.seed); ctx.fill();
          break;
        case 'leaf':
          ctx.fillStyle = p.c || '#C08A3E';
          U.ellipse(ctx, p.x, p.y, 4, 2, p.t * 4 + p.seed); ctx.fill();
          break;
        case 'bubble':
          ctx.strokeStyle = 'rgba(240,250,255,0.8)'; ctx.lineWidth = 1;
          U.ellipse(ctx, p.x, p.y, 2.5, 2.5); ctx.stroke();
          break;
        case 'steam':
          ctx.fillStyle = 'rgba(250,245,200,0.35)';
          U.ellipse(ctx, p.x, p.y, 9 * (1 + k), 6 * (1 + k)); ctx.fill();
          break;
        case 'note':
          ctx.fillStyle = '#2A2620'; ctx.font = '600 16px "Bodoni Moda", serif'; ctx.fillText(p.txt || '♪', p.x, p.y);
          break;
        case 'dust':
          ctx.fillStyle = 'rgba(160,140,100,0.5)'; U.ellipse(ctx, p.x, p.y, 3 + 5 * k, 2 + 3 * k); ctx.fill();
          break;
        case 'splash':
          ctx.strokeStyle = 'rgba(225,235,245,0.75)'; ctx.lineWidth = 1; U.ellipse(ctx, p.x, p.y, 2 + 9 * k, 1 + 4 * k); ctx.stroke();
          break;
        case 'butterfly': {
          // it flies a little above the grass, so its shadow sits apart on the ground
          const f = Math.abs(Math.sin(p.t * 13 + p.seed)), wx = 0.8 + 2.6 * f;
          ctx.fillStyle = 'rgba(40,30,20,0.16)'; U.ellipse(ctx, p.x, p.y, 2.6, 1.2); ctx.fill();
          ctx.translate(p.x, p.y - 24);
          ctx.fillStyle = p.c; ctx.strokeStyle = 'rgba(42,38,32,0.75)'; ctx.lineWidth = 0.6;
          for (const sd of [-1, 1]) { U.ellipse(ctx, sd * wx * 0.9, -1.3, wx, 2.5); ctx.fill(); ctx.stroke(); U.ellipse(ctx, sd * wx * 0.6, 1.5, wx * 0.7, 1.7); ctx.fill(); ctx.stroke(); }
          ctx.fillStyle = '#2A2620'; U.ellipse(ctx, 0, 0, 0.8, 3); ctx.fill();
          break;
        }
        case 'bee':
          ctx.translate(p.x, p.y - 18);
          ctx.fillStyle = 'rgba(255,255,255,0.75)'; U.ellipse(ctx, -1.2, -2, 1.9, 1.2, -0.4); ctx.fill(); U.ellipse(ctx, 1.2, -2, 1.9, 1.2, 0.4); ctx.fill();
          ctx.fillStyle = '#E0A820'; U.ellipse(ctx, 0, 0, 2.6, 1.8); ctx.fill();
          ctx.fillStyle = '#2A2620'; ctx.fillRect(-0.7, -1.7, 1.2, 3.4);
          break;
        case 'dragonfly': {
          const f = 0.55 + 0.45 * Math.abs(Math.sin(p.t * 40));
          ctx.fillStyle = 'rgba(40,30,20,0.14)'; U.ellipse(ctx, p.x, p.y, 5, 1.4, p.dir); ctx.fill();
          ctx.translate(p.x, p.y - 30); ctx.rotate(p.dir);
          ctx.fillStyle = 'rgba(214,236,250,0.6)';
          for (const ox of [2, -1.5]) for (const sd of [-1, 1]) { U.ellipse(ctx, ox, sd * 4.2 * f, 1.5, 4.2 * f, sd * 0.25); ctx.fill(); }
          ctx.strokeStyle = '#2E7A8A'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(3, 0); ctx.lineTo(-10, 0); ctx.stroke();
          ctx.fillStyle = '#1E5A6A'; U.ellipse(ctx, 4.4, 0, 1.7, 1.5); ctx.fill();
          break;
        }
        case 'snail': {
          const st = 1 + 0.12 * Math.sin(p.t * 2.2 + p.seed), f = Math.cos(p.dir || 0) < 0 ? -1 : 1;
          ctx.translate(p.x, p.y); ctx.scale(f, 1);
          ctx.fillStyle = 'rgba(40,30,20,0.16)'; U.ellipse(ctx, 0, 1.5, 6.4, 1.6); ctx.fill();
          ctx.fillStyle = '#C9B89A'; U.ellipse(ctx, 1 * st, 0.3, 5.2 * st, 1.5); ctx.fill();
          ctx.strokeStyle = '#8E7C62'; ctx.lineWidth = 0.6; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(5 * st, -0.4); ctx.lineTo(6.6 * st, -3.2); ctx.moveTo(4.3 * st, -0.2); ctx.lineTo(5.2 * st, -2.7); ctx.stroke();
          ctx.fillStyle = '#9A6A3A'; ctx.beginPath(); ctx.arc(-0.6, -2.4, 3.3, 0, TAU); ctx.fill();
          ctx.strokeStyle = '#5E3E20'; ctx.lineWidth = 0.7; ctx.beginPath();
          for (let i = 0; i <= 26; i++) { const a = i / 26 * TAU * 1.7, r = 2.9 * (1 - i / 30), X = -0.6 + Math.cos(a) * r, Y = -2.4 + Math.sin(a) * r; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
          ctx.stroke();
          break;
        }
        case 'ladybug': {
          ctx.fillStyle = 'rgba(40,30,20,0.16)'; U.ellipse(ctx, p.x, p.y + 1, 2.8, 1.3); ctx.fill();
          ctx.translate(p.x, p.y); ctx.rotate(p.dir || 0);
          ctx.fillStyle = '#1E1A16'; U.ellipse(ctx, 2.2, 0, 1.1, 1.2); ctx.fill();
          ctx.fillStyle = '#D0302A'; U.ellipse(ctx, 0, 0, 2.4, 2); ctx.fill();
          ctx.strokeStyle = '#1E1A16'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.moveTo(-2.4, 0); ctx.lineTo(1.4, 0); ctx.stroke();
          ctx.fillStyle = '#1E1A16';
          for (const [sx, sy] of [[-1.1, -0.9], [-1.1, 0.9], [0.5, -1.1], [0.5, 1.1]]) { ctx.beginPath(); ctx.arc(sx, sy, 0.42, 0, TAU); ctx.fill(); }
          break;
        }
        case 'frog': {
          const hk = p.hop > 0 ? 1 - p.hop / 0.35 : 0, lift = Math.sin(Math.PI * hk) * 9, str = p.hop > 0 ? 1.3 : 1;
          ctx.fillStyle = 'rgba(40,30,20,0.18)'; U.ellipse(ctx, p.x, p.y + 1, 5.6 - lift * 0.2, 1.8); ctx.fill();
          ctx.translate(p.x, p.y - lift); ctx.scale(p.face || 1, 1);
          ctx.fillStyle = '#4E7A3A'; U.ellipse(ctx, -3.1 * str, 0.4, 2.6 * str, 1.4); ctx.fill();
          ctx.fillStyle = '#5E9444'; U.ellipse(ctx, 0, -1.6, 4.4, 3); ctx.fill();
          ctx.fillStyle = '#7FAE5A'; U.ellipse(ctx, 0.6, -0.4, 2.6, 1.2); ctx.fill();
          ctx.fillStyle = '#3E6630'; U.ellipse(ctx, 2.7, 0.7, 1.4, 1); ctx.fill();
          for (const ex of [2.6, 0.8]) {
            ctx.fillStyle = '#E8E0B0'; ctx.beginPath(); ctx.arc(ex, -4.1, 1.3, 0, TAU); ctx.fill();
            ctx.fillStyle = '#1E1A16'; ctx.beginPath(); ctx.arc(ex + 0.2, -4.2, 0.6, 0, TAU); ctx.fill();
          }
          break;
        }
        case 'bird': case 'stork': {
          // high overhead: swallows as quick dark ticks, storks in autumn as big white V's with black wingtips
          const st = p.kind === 'stork', z = st ? 13 : 7, f = Math.sin(p.t * (st ? 3.6 : 9) + p.seed);
          ctx.translate(p.x, p.y); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          const tipY = z * (0.55 + 0.45 * f);
          if (st) {
            ctx.strokeStyle = '#8A2A1E'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-z * 1.1, 0); ctx.stroke();
            ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 4.4;
            ctx.beginPath(); ctx.moveTo(-z * 0.3, -tipY); ctx.lineTo(-z * 0.1, -tipY * 0.45); ctx.moveTo(-z * 0.3, tipY); ctx.lineTo(-z * 0.1, tipY * 0.45); ctx.stroke();
            ctx.strokeStyle = '#F4F0E6'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-z * 0.1, -tipY * 0.45); ctx.lineTo(0, 0); ctx.lineTo(-z * 0.1, tipY * 0.45); ctx.moveTo(0, 0); ctx.lineTo(z * 0.75, 0); ctx.stroke();
            ctx.strokeStyle = '#C8402A'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(z * 0.75, 0); ctx.lineTo(z * 1.05, 0); ctx.stroke();
          } else {
            ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(-z * 0.3, -tipY); ctx.lineTo(0, 0); ctx.lineTo(-z * 0.3, tipY); ctx.moveTo(0, 0); ctx.lineTo(-z * 0.7, 0); ctx.stroke();
          }
          break;
        }
      }
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- world systems
const W = {
  GS: 16, gw: 0, gh: 0, grid: null, PG: 32, pgw: 0, pgh: 0, pgrid: null,
  trees: [], props: [], fences: [], actors: [], inters: [],
  riverPts: [], riverW: [], crumbs: [], waypoint: null, target: null, clouds: [], rain: 0, rainGoal: 0, _rainNext: 120,

  init() {
    const Wd = WORLD;
    this.riverPts = U.catmull(Wd.riverCtl, 10);
    const n = this.riverPts.length;
    this.riverW = this.riverPts.map((p, i) => U.lerp(54, 104, i / (n - 1)));
    this.pondPts = U.blob(Wd.pond.x, Wd.pond.y, Wd.pond.rx, Wd.pond.ry, 16, 0.1, 5);
    Wd.meadowPoly = U.blob(3300, 1010, 470, 290, 14, 0.14, 21);
    Wd.forestPoly = [[40, 120], [1400, 120], [1350, 560], [1240, 860], [1080, 1020], [760, 1080], [420, 1120], [40, 1150]];
    Wd.rockPoly = [[3820, 0], [4800, 0], [4800, 700], [4520, 640], [4330, 560], [4240, 610], [4120, 580], [4000, 470], [3880, 330], [3800, 150]];
    this.gw = Math.ceil(Wd.W / this.GS); this.gh = Math.ceil(Wd.H / this.GS);
    this.grid = new Uint8Array(this.gw * this.gh);
    this._placeTrees();
    this._placeProps();
    this._placeFences();
    this._rasterize();
    this._buildPathGrid();
    this._placeActors();
    this._placeInters();
    for (let i = 0; i < 7; i++) this.clouds.push({ x: Math.random() * Wd.W, y: Math.random() * Wd.H, r: 380 + Math.random() * 420, s: 14 + Math.random() * 10 });
  },

  // ---------------- placement ----------------
  _placeTrees() {
    const T = this.trees, R = U.rng(77), Wd = WORLD;
    const ok = (x, y, d) => T.every(t => Math.hypot(t.x - x, t.y - y) > d);
    const nearPath = (x, y, m) => Wd.paths.some(p => U.distPoly(x, y, p.pts) < p.w / 2 + m);
    // forest
    for (let i = 0; i < 900 && T.length < 95; i++) {
      const x = 60 + R() * 1320, y = 140 + R() * 1000;
      if (!U.inPoly(x, y, Wd.forestPoly)) continue;
      if (Math.hypot(x - 820, y - 720) < 190) continue;
      if (nearPath(x, y, 30)) continue;
      if (!ok(x, y, 62)) continue;
      const r = R();
      T.push({ type: r < 0.5 ? 'oak' : r < 0.85 ? 'pine' : 'walnut', x, y, s: 0.85 + R() * 0.4, seed: i });
    }
    // poplar rows along two roads and the farm windbreak
    const row = (pts, side, step, off) => {
      const d = U.catmull(pts, 12);
      let acc = 0;
      for (let i = 1; i < d.length; i++) {
        acc += Math.hypot(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]);
        if (acc > step) {
          acc = 0;
          const o = U.offsetLine([d[i - 1], d[i]], side * off)[1];
          if (!this._inBuilding(o[0], o[1], 40) && ok(o[0], o[1], 50)) T.push({ type: 'poplar', x: o[0], y: o[1], s: 0.95 + U.hash(i, 9, 3) * 0.25, seed: i * 7 });
        }
      }
    };
    row(Wd.paths[2].pts, 1, 95, 48);
    row(Wd.paths[3].pts, -1, 95, 46);
    for (let x = 1320; x < 2120; x += 80) T.push({ type: 'poplar', x, y: 2715 + U.hash(x, 1, 2) * 12, s: 1 + U.hash(x, 2, 2) * 0.2, seed: x });
    // willows on the river banks
    const rp = this.riverPts;
    for (let i = 6; i < rp.length - 4; i += 11) {
      const side = i % 22 < 11 ? 1 : -1;
      const o = U.offsetLine([rp[i - 1], rp[i]], side * (this.riverW[i] / 2 + 46))[1];
      if (this._nearBridge(o[0], o[1], 150) || this._inBuilding(o[0], o[1], 60) || nearPath(o[0], o[1], 20) || this._inField(o[0], o[1], 30)) continue;
      T.push({ type: 'willow', x: o[0], y: o[1], s: 0.9 + U.hash(i, 5, 1) * 0.25, seed: i });
    }
    // named trees
    T.push({ type: 'walnut', x: 2605, y: 1682, s: 1.25, seed: 901, named: 'walnut' });
    T.push({ type: 'fruit', x: 2180, y: 2500, s: 1.4, seed: 777, named: 'apple' });
    [[2250, 2700], [2500, 2690], [3205, 2765], [2330, 2990], [3700, 1712], [3830, 1990], [2990, 1010], [3620, 1180], [3480, 760]].forEach((p, i) => T.push({ type: i > 5 ? 'oak' : 'fruit', x: p[0], y: p[1], s: 0.9, seed: 500 + i }));
    [[1500, 1560], [1320, 1700], [3900, 1400], [4300, 1200], [4500, 1700], [4300, 2300], [1000, 1700], [620, 1900], [300, 2200], [350, 2800], [1200, 2950], [4600, 2500], [3700, 3050], [3200, 3050], [1700, 2950], [900, 3050]].forEach((p, i) => {
      if (ok(p[0], p[1], 60)) T.push({ type: i % 3 === 0 ? 'oak' : i % 3 === 1 ? 'walnut' : 'pine', x: p[0], y: p[1], s: 0.9 + (i % 4) * 0.08, seed: 600 + i });
    });
  },
  _placeProps() {
    const P = this.props;
    const add = (kind, x, y, o = {}) => { const p = Object.assign({ kind, x, y }, o); P.push(p); return p; };
    // Grandma's willow and its scale in the yard north of the school: clear of the roof, which hid them when they stood behind it
    add('willowpot', 2515, 1160, { lens: 'willow', col: [34, 18] });
    add('scale', 2610, 1172, { col: [24, 12] });
    add('well', 2190, 2300, { col: [26, 16] });
    add('compost', 2340, 2340, { col: [34, 14], lens: 'compost' });
    // Sevim's slumped heap beside Grandma's, and the compost bin to try it properly
    add('sevimheap', 2265, 2352, { col: [28, 12], lens: 'compost' });
    add('compostkit', 2360, 2262, { col: [28, 8] });
    add('cart', 2090, 2345, { col: [36, 12] });
    add('scarecrow', 1920, 2240);
    add('trough', 3440, 2290, { col: [40, 10] });
    add('hay', 3070, 1840, { col: [30, 14] });
    add('hay', 3455, 2160, { col: [30, 14] });
    add('hay', 2900, 2190, { col: [30, 14] });
    add('bench', 2270, 1690, { col: [30, 8] });
    add('mailbox', 2480, 1650, { col: [8, 6] });
    add('sign', 2455, 1735, { to: ['farm', 'barn', 'greenhouse', 'meadow'] });
    add('sign', 2400, 2420, { to: ['pond', 'hub', 'clinic'] });
    add('sign', 3335, 2600, { to: ['halt', 'clinic', 'barn'] });
    add('sign', 1770, 1260, { to: ['forest', 'hub'] });
    add('fountain', 2560, 2700, { col: [34, 14] });
    add('laundry', 2330, 2930);
    add('tables', 2760, 3060);
    add('stage', 2515, 2845, { col: [54, 12] });
    add('swaptable', 2905, 2812);
    add('festival', 2720, 2905, { sortY: 2905 });
    add('oven', 3206, 2930, { col: [40, 14] });
    add('kneadtrough', 3006, 2968, { col: [36, 8], lens: 'dough' });
    add('labtable', 3132, 2972, { col: [32, 8] });
    add('peabed', 2160, 1165, { col: [70, 20] });
    add('mushrooms', 830, 720, { lens: 'mushroom' });
    add('mushrooms', 610, 460, { lens: 'mushroom' });
    add('cavemouth', 4180, 585);
    add('hotspring', 4290, 712, { col: [40, 46], lens: 'spring', sortY: 600 });
    add('thermokit', 4364, 760, { col: [16, 8] });
    add('steptest', 4520, 380, { col: [30, 8] });
    add('bloodkit', 4648, 372, { col: [32, 8], lens: 'blood' });
    add('bench', 4462, 356, { col: [30, 8] });
    // Songül's tomato bed east of her house, the well pump, and the potato test table
    add('tomatobed', 3240, 972, { col: [62, 12], lens: 'garden' });
    add('handpump', 3190, 956, { col: [10, 6] });
    add('osmokit', 3262, 1034, { col: [30, 8] });
    add('rainbarrel', 3158, 986);
    // under the barn's hay-loft door: owl pellets on the ground, a table to take them apart, and (after the case) a nest box
    add('pellets', 3262, 2146, { sortY: 2100 });
    // Alp's trail food: a calorimeter on a table by the school, under the walnut tree's shade (on the bank, not in the river)
    add('calorkit', 2520, 1696, { col: [30, 8], lens: 'snack' });
    // Mehmet Dede's doubt: Grandma's microscope on a side table by the teahouse
    add('slidekit', 2652, 3064, { col: [28, 8], lens: 'onion' });
    // the last Amasya apple tree on the farm: its storm-torn limb and Hüseyin Usta's grafting table
    add('brokenlimb', 2232, 2524, { col: [40, 8] });
    add('graftkit', 2280, 2568, { col: [30, 8], lens: 'apple' });
    // Fatma Teyze's squash patch south of the fields, the neighbour's gourd fence beside it, and the pollination table
    add('squashpatch', 1560, 2790, { col: [84, 14], lens: 'squash' });
    add('gourdfence', 1770, 2770, { col: [66, 8] });
    add('pollkit', 1430, 2806, { col: [30, 8] });
    // Osman Amca's one-variety wheat, rusting, east of the squash patch, and the farmers' office wind table beside it
    add('rustplot', 2000, 2850, { col: [90, 16], lens: 'rust' });
    add('rustboard', 2140, 2830, { col: [28, 8] });
    // Ayten's insect count at the end of the meadow road, and the fallen stork chick's box by the clinic
    add('sweepkit', 2985, 1275, { col: [30, 8], lens: 'sweep' });
    add('storkbox', 2884, 2760, { sortY: 2762 });
    // inside the village clinic: the anatomical heart model on its shelf
    add('heartmodel', 2790, 2652, { lens: 'heart', inside: 'clinic' });
    add('notebook', 2690, 2692, { inside: 'clinic' });
    add('yogurtkit', 3050, 1015);
    add('serakit', 1990, 1160, { inside: 'greenhouse' });
    add('hediyekit', 2340, 1480);
    add('azotkit', 1900, 2850);
    add('ekimkit', 1580, 2700);
    add('etilenkit', 2200, 2610);
    add('sindirimkit', 2650, 2640, { inside: 'clinic' });
    add('kilcalkit', 4400, 420);
    add('kulkit', 2200, 1740);
    add('zarkit', 3100, 1085);
    add('pelletkit', 3172, 2168, { col: [30, 8] });
    add('owlbox', 3470, 2129, { sortY: 2140 });
    add('sign', 4420, 790, { to: ['yayla', 'cave'] });
    [[4712, 446], [4686, 470]].forEach(p => add('hive', p[0], p[1], { col: [16, 10], lens: 'bee' }));
    add('sign', 4000, 640, { to: ['cave', 'yayla'] });
    add('rails', 3700, 2935);
    add('stationsign', 4180, 2905);
    add('germbench', 4470, 2652, { col: [52, 10], lens: 'sprout', inside: 'seedbank' });
    [[3380, 950], [3450, 935], [3520, 950], [3450, 1000]].forEach(p => add('hive', p[0], p[1], { col: [16, 10], lens: 'bee' }));
    [[3650, 520], [3500, 620], [4050, 900], [1500, 700], [260, 1300], [4600, 1000], [4420, 3000], [180, 3000]].forEach((p, i) => add('rock', p[0], p[1], { seed: i, col: [22, 12] }));
    add('nest', 2560, 1262, { sortY: 1640 });
    this.nest = P[P.length - 1];
  },
  _placeFences() {
    const F = this.fences;
    for (const pd of WORLD.paddocks) {
      const { x, y, w, h, gate } = pd;
      const edges = {
        n: [[x, y], [x + w, y]], s: [[x, y + h], [x + w, y + h]],
        w: [[x, y], [x, y + h]], e: [[x + w, y], [x + w, y + h]],
      };
      for (const side in edges) {
        const [a, b] = edges[side];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(len / 55);
        for (let i = 0; i < n; i++) {
          const p0 = [U.lerp(a[0], b[0], i / n), U.lerp(a[1], b[1], i / n)], p1 = [U.lerp(a[0], b[0], (i + 1) / n), U.lerp(a[1], b[1], (i + 1) / n)];
          if (gate.side === side) {
            const my = (p0[1] + p1[1]) / 2;
            if (my > gate.a && my < gate.b) { F.push({ a: p0, b: p1, gate: true, pd: pd.id }); continue; }
          }
          F.push({ a: p0, b: p1 });
        }
      }
    }
  },
  _placeActors() {
    const A = this.actors;
    const add = o => { const a = Object.assign({ face: 1, dir: 'down', vx: 0, vy: 0, phase: 0, idle: 1, state: 'wander', speed: 60, blink: 0, anim: 0 }, o); a.tx = a.x; a.ty = a.y; A.push(a); return a; };
    this.player = add({ id: 'player', kind: 'human', look: PEOPLE.player[0], x: 2400, y: 1700, speed: 210, state: 'player' });
    add({ id: 'deniz', kind: 'human', look: PEOPLE.deniz, x: 2330, y: 1720, home: [2290, 1670, 160, 90], speed: 80, talk: () => TALK.deniz() });
    add({ id: 'riza', kind: 'human', look: PEOPLE.riza, x: 3380, y: 2250, home: [3290, 2180, 180, 180], speed: 45, talk: () => TALK.riza() });
    add({ id: 'ayten', kind: 'human', look: PEOPLE.ayten, x: 2740, y: 2790, home: [2690, 2780, 90, 40], speed: 90, hidden: false, talk: () => TALK.ayten() });
    add({ id: 'elder1', kind: 'human', look: PEOPLE.elder1, x: 2735, y: 3070, home: null, speed: 0, sit: true, talk: () => TALK.elder(1) });
    add({ id: 'elder2', kind: 'human', look: PEOPLE.elder2, x: 2800, y: 3072, home: null, speed: 0, sit: true, face: -1, dir: 'left', talk: () => TALK.elder(2) });
    add({ id: 'sarikiz', kind: 'cow', x: 3720, y: 2350, home: [3540, 2230, 360, 260], speed: 26, lens: 'cow', bloat: 1, talk: () => TALK.cow() });
    add({ id: 'karabas', kind: 'dog', x: 3330, y: 2320, home: [3290, 2250, 160, 260], speed: 70, lens: 'dog', talk: () => TALK.dog() });
    [[3000, 2350], [3090, 2420], [2960, 2480], [3150, 2330], [3040, 2510]].forEach((p, i) => add({ id: 'sheep' + i, kind: 'sheep', x: p[0], y: p[1], home: [2910, 2260, 320, 270], speed: 22, lens: 'sheep', talk: () => TALK.sheep() }));
    [[2270, 2230], [2310, 2260], [2180, 2210], [2350, 2200]].forEach((p, i) => add({ id: 'hen' + i, kind: 'chicken', x: p[0], y: p[1], home: [2150, 2180, 230, 120], speed: 40, lens: 'chicken', talk: () => TALK.hen() }));
    add({ id: 'nebahat', kind: 'human', look: PEOPLE.nebahat, x: 2620, y: 2836, home: [2600, 2826, 40, 20], speed: 25, hidden: true, talk: () => TALK.nebahat() });
    add({ id: 'yusuf', kind: 'human', look: PEOPLE.yusuf, x: 4700, y: 330, home: [4684, 280, 46, 120], speed: 26, talk: () => TALK.yusuf() });
    add({ id: 'songul', kind: 'human', look: PEOPLE.songul, x: 3150, y: 1010, home: [3110, 996, 64, 30], speed: 18, talk: () => TALK.songul() });
    add({ id: 'elif', kind: 'human', look: PEOPLE.elif, x: 4462, y: 350, home: null, speed: 0, sit: true, talk: () => TALK.elif() });
    [[4600, 250], [4650, 280], [4700, 240], [4630, 220]].forEach((p, i) => add({ id: 'ysheep' + i, kind: 'sheep', x: p[0], y: p[1], home: [4580, 210, 150, 110], speed: 18, lens: 'sheep', talk: () => TALK.sheep() }));
    add({ id: 'huseyin', kind: 'human', look: PEOPLE.huseyin, x: 2150, y: 2560, home: [2120, 2545, 70, 30], speed: 18, talk: () => TALK.huseyin() });
    add({ id: 'sevim', kind: 'human', look: PEOPLE.sevim, x: 2290, y: 2300, home: [2262, 2290, 70, 18], speed: 18, talk: () => TALK.sevim() });
    add({ id: 'osman', kind: 'human', look: PEOPLE.osman, x: 1990, y: 2800, home: [1940, 2786, 110, 22], speed: 18, talk: () => TALK.osman() });
    add({ id: 'fatma', kind: 'human', look: PEOPLE.fatma, x: 1500, y: 2748, home: [1470, 2732, 90, 30], speed: 18, talk: () => TALK.fatma() });
    add({ id: 'zehra', kind: 'human', look: PEOPLE.zehra, x: 2724, y: 2712, home: [2700, 2702, 50, 20], speed: 20, talk: () => TALK.zehra() });
    add({ id: 'nazli', kind: 'human', look: PEOPLE.nazli, x: 3068, y: 2962, home: [3050, 2950, 40, 20], speed: 30, talk: () => TALK.nazli() });
    add({ id: 'cat1', kind: 'cat', x: 2590, y: 2860, home: [2530, 2815, 110, 60], speed: 40, talk: () => TALK.cat() });
    add({ id: 'owl', kind: 'owl', x: 3310, y: 1912, home: null, speed: 0, perch: true, lens: 'owl', talk: () => TALK.owl() });
    add({ id: 'stork1', kind: 'stork', x: 2552, y: 1250, home: null, speed: 0, perch: true, lens: 'stork', talk: () => TALK.stork() });
    add({ id: 'stork2', kind: 'stork', x: 2572, y: 1253, home: null, speed: 0, perch: true, face: -1, lens: 'stork', talk: () => TALK.stork() });
    [[830, 2470], [610, 2640]].forEach((p, i) => add({ id: 'frog' + i, kind: 'frog', x: p[0], y: p[1], home: [p[0] - 30, p[1] - 20, 60, 40], speed: 0, lens: 'frog', talk: () => TALK.frog() }));
  },
  _placeInters() {
    const I = this.inters;
    const add = o => { I.push(Object.assign({ r: 64 }, o)); };
    // Field Station interior
    add({ id: 'desk', x: 2275, y: 1375, inside: 'hub', label: { tr: 'Masa', en: 'Desk' }, verb: 'p_use', use: () => USE.desk() });
    add({ id: 'bed', x: 2570, y: 1355, inside: 'hub', label: { tr: 'Yatak', en: 'Bed' }, verb: 'p_use', use: () => USE.bed() });
    add({ id: 'chest', x: 2470, y: 1470, inside: 'hub', label: { tr: 'Tohum sandığı', en: 'Seed chest' }, verb: 'p_use', use: () => USE.chest() });
    add({ id: 'board', x: 2400, y: 1318, inside: 'hub', r: 70, label: { tr: 'Kara tahta', en: 'Blackboard' }, verb: 'p_read', use: () => USE.board() });
    add({ id: 'radio', x: 2595, y: 1470, inside: 'hub', r: 50, label: { tr: 'Radyo', en: 'Radio' }, verb: 'p_use', use: () => USE.radio() });
    add({ id: 'microscope', x: 2215, y: 1455, inside: 'hub', r: 56, label: { tr: 'Mikroskop', en: 'Microscope' }, verb: 'p_use', use: () => USE.microscope() });
    // greenhouse
    add({ id: 'rig', x: 1765, y: 1070, inside: 'greenhouse', label: { tr: 'Deney masası', en: 'Experiment bench' }, verb: 'p_use', use: () => USE.rig() });
    add({ id: 'mendel', x: 1975, y: 1070, inside: 'greenhouse', label: { tr: 'Mendel masası', en: "Mendel's bench" }, verb: 'p_use', use: () => USE.mendel() });
    // seed bank
    add({ id: 'ledger', x: 4338, y: 2702, inside: 'seedbank', r: 56, label: { tr: 'Nine’nin defteri', en: 'Grandma’s ledger' }, verb: 'p_read', use: () => USE.ledger() });
    add({ id: 'jars', x: 4410, y: 2610, inside: 'seedbank', r: 70, label: { tr: 'Tohum kavanozları', en: 'Seed jars' }, verb: 'p_look', use: () => USE.jars() });
    add({ id: 'coldbox', x: 4328, y: 2650, inside: 'seedbank', r: 52, label: { tr: 'Soğuk dolap', en: 'Cold cabinet' }, verb: 'p_look', use: () => USE.coldbox() });
    add({ id: 'germ', x: 4470, y: 2666, inside: 'seedbank', r: 56, label: { tr: 'Çimlenme masası', en: 'Germination bench' }, verb: 'p_use', use: () => USE.germ() });
    add({ id: 'trays', x: 1870, y: 1130, inside: 'greenhouse', label: { tr: 'Fide tepsileri', en: 'Seedling trays' }, verb: 'p_look', use: () => USE.trays() });
    add({ id: 'peabed', x: 2160, y: 1175, r: 80, label: { tr: 'Bezelye yatağı', en: 'Pea bed' }, verb: 'p_use', use: () => USE.peabed() });
    // yard
    add({ id: 'willowpot', x: 2515, y: 1170, r: 70, label: { tr: 'Nebahat’ın söğüdü', en: "Nebahat's willow" }, verb: 'p_look', use: () => USE.willow() });
    add({ id: 'mailbox', x: 2480, y: 1655, r: 50, label: { tr: 'Posta kutusu', en: 'Mailbox' }, verb: 'p_look', use: () => USE.mailbox() });
    // farm
    for (const f of WORLD.fields) add({ id: 'field' + f.id, rect: [f.x, f.y, f.w, f.h], pad: 34, x: f.x + f.w / 2, y: f.y + f.h / 2, label: { tr: f.id + ' tarlası', en: 'Field ' + f.id }, verb: 'p_look', use: () => USE.field(f.id) });
    add({ id: 'shed', x: 2260, y: 2245, r: 60, label: { tr: 'Alet kulübesi', en: 'Tool shed' }, verb: 'p_use', use: () => USE.shed() });
    add({ id: 'compost', x: 2340, y: 2350, r: 50, label: { tr: 'Kompost yığını', en: 'Compost heap' }, verb: 'p_look', use: () => USE.compost() });
    add({ id: 'runoff', x: 1560, y: 2090, r: 90, label: { tr: 'Nehir kıyısı', en: 'Riverbank' }, verb: 'p_look', use: () => USE.runoff(), show: () => Q.at('pond', 'trace') || Q.at('pond', 'fix') });
    add({ id: 'oven', x: 3206, y: 2935, r: 58, label: { tr: 'Taş fırın', en: 'Stone oven' }, verb: 'p_look', use: () => USE.oven() });
    add({ id: 'trough', x: 3006, y: 2972, r: 50, label: { tr: 'Hamur teknesi', en: 'Dough trough' }, verb: 'p_look', use: () => USE.trough() });
    add({ id: 'ferm', x: 3132, y: 2976, r: 50, label: { tr: 'Deney masası', en: 'Lab table' }, verb: 'p_use', use: () => USE.ferm() });
    add({ id: 'pondshore', x: 985, y: 2520, r: 90, label: { tr: 'Gölet kıyısı', en: 'Pond shore' }, verb: 'p_look', use: () => USE.pond() });
    // village & edges
    add({ id: 'cave', x: 4180, y: 640, r: 90, label: { tr: 'Mağara', en: 'Cave' }, verb: 'p_look', use: () => USE.cave() });
    add({ id: 'hotspring', x: 4290, y: 722, r: 70, label: { tr: 'Sıcak pınar', en: 'Hot spring' }, verb: 'p_look', use: () => USE.hotspring() });
    add({ id: 'thermo', x: 4364, y: 770, r: 54, label: { tr: 'Sıcaklık sondası', en: 'Temperature probe' }, verb: 'p_use', use: () => USE.thermo() });
    add({ id: 'step', x: 4520, y: 392, r: 56, label: { tr: 'Basamak testi', en: 'Step test' }, verb: 'p_use', use: () => USE.step() });
    add({ id: 'bloodkit', x: 4648, y: 384, r: 56, label: { tr: 'Kan masası', en: 'Blood table' }, verb: 'p_look', use: () => USE.bloodkit() });
    add({ id: 'tomatobed', x: 3240, y: 980, r: 60, label: { tr: 'Domates fideleri', en: 'Tomato seedlings' }, verb: 'p_look', use: () => USE.tomatoes() });
    add({ id: 'pump', x: 3190, y: 964, r: 36, label: { tr: 'Kuyu pompası', en: 'Well pump' }, verb: 'p_use', use: () => USE.pump() });
    add({ id: 'osmo', x: 3262, y: 1044, r: 50, label: { tr: 'Patates deneyi', en: 'Potato test' }, verb: 'p_use', use: () => USE.osmo() });
    add({ id: 'pelletkit', x: 3172, y: 2178, r: 50, label: { tr: 'Kusmuk masası', en: 'Pellet table' }, verb: 'p_use', use: () => USE.pelletkit() });
    add({ id: 'pellets', x: 3262, y: 2152, r: 34, label: { tr: 'Gri topaklar', en: 'Grey lumps' }, verb: 'p_look', use: () => USE.pellets() });
    add({ id: 'calor', x: 2520, y: 1708, r: 50, label: { tr: 'Kalorimetre', en: 'Calorimeter' }, verb: 'p_use', use: () => USE.calor() });
    add({ id: 'slide', x: 2652, y: 3076, r: 46, label: { tr: 'Mikroskop', en: 'Microscope' }, verb: 'p_use', use: () => USE.slide() });
    add({ id: 'graft', x: 2280, y: 2580, r: 46, label: { tr: 'Aşı masası', en: 'Grafting table' }, verb: 'p_use', use: () => USE.graft() });
    add({ id: 'pollkit', x: 1430, y: 2818, r: 46, label: { tr: 'Tozlama masası', en: 'Pollination table' }, verb: 'p_use', use: () => USE.pollinate() });
    add({ id: 'squash', x: 1560, y: 2800, r: 60, label: { tr: 'Kabak bahçesi', en: 'Squash patch' }, verb: 'p_look', use: () => USE.squash() });
    add({ id: 'compostkit', x: 2360, y: 2274, r: 46, label: { tr: 'Kompost kasası', en: 'Compost bin' }, verb: 'p_use', use: () => USE.compostbin() });
    add({ id: 'sevimheap', x: 2265, y: 2364, r: 44, label: { tr: 'Sevim’in yığını', en: 'Sevim’s heap' }, verb: 'p_look', use: () => USE.sevimheap() });
    add({ id: 'rustboard', x: 2140, y: 2842, r: 46, label: { tr: 'Rüzgâr masası', en: 'Wind table' }, verb: 'p_use', use: () => USE.rustsim() });
    add({ id: 'rustplot', x: 2000, y: 2862, r: 64, label: { tr: 'Osman’ın buğdayı', en: 'Osman’s wheat' }, verb: 'p_look', use: () => USE.rustplot() });
    add({ id: 'gourds', x: 1770, y: 2782, r: 44, label: { tr: 'Süs kabakları', en: 'Ornamental gourds' }, verb: 'p_look', use: () => USE.gourds() });
    add({ id: 'brokenlimb', x: 2232, y: 2530, r: 40, label: { tr: 'Kırık dal', en: 'Broken limb' }, verb: 'p_look', use: () => USE.brokenlimb() });
    add({ id: 'sweep', x: 2985, y: 1287, r: 46, label: { tr: 'Böcek ağı ve tepsi', en: 'Sweep net and tray' }, verb: 'p_use', use: () => USE.sweep() });
    add({ id: 'storkbox', x: 2884, y: 2768, r: 38, label: { tr: 'Leylek yavrusu', en: 'Stork chick' }, verb: 'p_look', use: () => USE.storkbox(), show: () => !!(G.S && G.S.cases.leylek && !G.S.flags.chickHome) });
    add({ id: 'yogurtkit', x: 3050, y: 1017, r: 44, label: { tr: 'Yoğurt masası', en: 'Yogurt table' }, verb: 'p_use', use: () => USE.yogurtkit() });
    add({ id: 'serakit', x: 1990, y: 1162, inside: 'greenhouse', r: 44, label: { tr: 'Kavanoz masası', en: 'Jar bench' }, verb: 'p_use', use: () => USE.serakit() });
    add({ id: 'hediyekit', x: 2340, y: 1482, r: 44, label: { tr: 'Yağ masası', en: 'Oil table' }, verb: 'p_use', use: () => USE.hediyekit() });
    add({ id: 'azotkit', x: 1900, y: 2852, r: 44, label: { tr: 'Kök masası', en: 'Root table' }, verb: 'p_use', use: () => USE.azotkit() });
    add({ id: 'ekimkit', x: 1580, y: 2702, r: 44, label: { tr: 'Tohum masası', en: 'Seed table' }, verb: 'p_use', use: () => USE.ekimkit() });
    add({ id: 'etilenkit', x: 2200, y: 2612, r: 44, label: { tr: 'Domates torbaları', en: 'Tomato bags' }, verb: 'p_use', use: () => USE.etilenkit() });
    add({ id: 'sindirimkit', x: 2650, y: 2642, inside: 'clinic', r: 44, label: { tr: 'Tüp rafı', en: 'Tube rack' }, verb: 'p_use', use: () => USE.sindirimkit() });
    add({ id: 'kilcalkit', x: 4400, y: 422, r: 44, label: { tr: 'Su masası', en: 'Water table' }, verb: 'p_use', use: () => USE.kilcalkit() });
    add({ id: 'kulkit', x: 2200, y: 1742, r: 44, label: { tr: 'Kül masası', en: 'Ash table' }, verb: 'p_use', use: () => USE.kulkit() });
    add({ id: 'zarkit', x: 3100, y: 1087, r: 44, label: { tr: 'Pancar tüpleri', en: 'Beetroot tubes' }, verb: 'p_use', use: () => USE.zarkit() });
    add({ id: 'notebook', x: 2690, y: 2694, inside: 'clinic', r: 40, label: { tr: 'Zehra’nın defteri', en: 'Zehra’s notebook' }, verb: 'p_use', use: () => USE.notebook() });
    add({ id: 'bp', x: 2806, y: 2712, inside: 'clinic', r: 40, label: { tr: 'Tansiyon aleti', en: 'Blood-pressure cuff' }, verb: 'p_use', use: () => USE.bp() });
    add({ id: 'heartmodel', x: 2790, y: 2656, inside: 'clinic', r: 36, label: { tr: 'Kalp modeli', en: 'Heart model' }, verb: 'p_look', use: () => USE.heartmodel() });
    add({ id: 'station', x: 4165, y: 2900, r: 80, label: { tr: 'İstasyon', en: 'Station' }, verb: 'p_look', use: () => USE.station() });
    add({ id: 'hives', x: 3450, y: 990, r: 90, label: { tr: 'Arı kovanları', en: 'Beehives' }, verb: 'p_look', use: () => USE.hives() });
    add({ id: 'stage', x: 2515, y: 2872, r: 70, label: { tr: 'Köy sahnesi', en: 'Village stage' }, verb: 'p_look', use: () => USE.stage() });
    add({ id: 'swap', x: 2905, y: 2830, r: 60, label: { tr: 'Tohum takası', en: 'Seed swap' }, verb: 'p_use', use: () => USE.swap(), show: () => !!(G.S && G.S.cases.festival) });
    add({ id: 'fountain', x: 2560, y: 2720, r: 60, label: { tr: 'Çeşme', en: 'Fountain' }, verb: 'p_look', use: () => USE.fountain() });
    for (const p of this.props) if (p.kind === 'sign') add({ id: 'sign', x: p.x, y: p.y + 10, r: 56, label: { tr: 'Tabela', en: 'Signpost' }, verb: 'p_read', use: () => USE.sign(p) });
  },

  // ---------------- collision ----------------
  _inBuilding(x, y, m = 0) { return WORLD.buildings.some(b => x > b.x - m && x < b.x + b.w + m && y > b.y - m - b.h && y < b.y + b.d + m); },
  _inField(x, y, m = 0) { return WORLD.fields.some(f => x > f.x - m && x < f.x + f.w + m && y > f.y - m && y < f.y + f.h + m); },
  _nearBridge(x, y, m) { return WORLD.bridges.some(b => Math.hypot(b.x - x, b.y - y) < m); },
  _mark(x0, y0, x1, y1, v = 1) {
    const G_ = this.GS;
    const a = Math.max(0, Math.floor(x0 / G_)), b = Math.max(0, Math.floor(y0 / G_));
    const c = Math.min(this.gw - 1, Math.floor(x1 / G_)), d = Math.min(this.gh - 1, Math.floor(y1 / G_));
    for (let j = b; j <= d; j++) for (let i = a; i <= c; i++) this.grid[j * this.gw + i] = v;
  },
  _rasterize() {
    const g = this.grid, GS = this.GS, gw = this.gw, gh = this.gh, Wd = WORLD;
    // borders
    this._mark(0, 0, Wd.W, 150); this._mark(0, Wd.H - 60, Wd.W, Wd.H); this._mark(0, 0, 50, Wd.H); this._mark(Wd.W - 50, 0, Wd.W, Wd.H);
    // rock / mountain
    const rb = U.bbox(Wd.rockPoly);
    for (let j = Math.floor(rb[1] / GS); j <= Math.min(gh - 1, (rb[1] + rb[3]) / GS); j++)
      for (let i = Math.floor(rb[0] / GS); i <= Math.min(gw - 1, (rb[0] + rb[2]) / GS); i++)
        if (U.inPoly(i * GS + 8, j * GS + 8, Wd.rockPoly) && !U.inPoly(i * GS + 8, j * GS + 8, Wd.yaylaPoly)) g[j * gw + i] = 1;
    // river
    const rp = this.riverPts, bb = U.bbox(rp);
    for (let j = Math.floor((bb[1] - 70) / GS); j <= (bb[1] + bb[3] + 70) / GS; j++)
      for (let i = Math.floor((bb[0] - 70) / GS); i <= (bb[0] + bb[2] + 70) / GS; i++) {
        if (i < 0 || j < 0 || i >= gw || j >= gh) continue;
        const x = i * GS + 8, y = j * GS + 8, [d, si] = U.nearSeg(x, y, rp);
        if (d < this.riverW[si] / 2 - 2) g[j * gw + i] = 1;
      }
    // pond
    const pb = U.bbox(this.pondPts);
    for (let j = Math.floor(pb[1] / GS); j <= (pb[1] + pb[3]) / GS; j++)
      for (let i = Math.floor(pb[0] / GS); i <= (pb[0] + pb[2]) / GS; i++)
        if (U.inPoly(i * GS + 8, j * GS + 8, this.pondPts)) g[j * gw + i] = 1;
    // bridges re-open the river
    for (const b of Wd.bridges) {
      const [, si] = U.nearSeg(b.x, b.y, rp);
      const a = rp[si], c = rp[si + 1];
      const tx = c[0] - a[0], ty = c[1] - a[1], tl = Math.hypot(tx, ty);
      const ux = tx / tl, uy = ty / tl; // along river
      b.nx = -uy; b.ny = ux; b.ux = ux; b.uy = uy;
      for (let s = -b.len / 2; s <= b.len / 2; s += 6)
        for (let w = -b.w / 2 + 12; w <= b.w / 2 - 12; w += 6) {
          const x = b.x + b.nx * s + ux * w, y = b.y + b.ny * s + uy * w;
          const i = Math.floor(x / GS), j = Math.floor(y / GS);
          if (i >= 0 && j >= 0 && i < gw && j < gh) g[j * gw + i] = 0;
        }
    }
    // buildings
    for (const b of Wd.buildings) {
      if (b.enter) {
        const t = 14;
        this._mark(b.x, b.y - 10, b.x + b.w, b.y + 44);
        this._mark(b.x, b.y, b.x + t, b.y + b.d);
        this._mark(b.x + b.w - t, b.y, b.x + b.w, b.y + b.d);
        this._mark(b.x, b.y + b.d - t, b.door - 40, b.y + b.d);
        this._mark(b.door + 40, b.y + b.d - t, b.x + b.w, b.y + b.d);
      } else this._mark(b.x, b.y - 4, b.x + b.w, b.y + b.d);
    }
    // interior furniture
    [[2215, 1340, 2335, 1395], [2185, 1295, 2310, 1318], [2530, 1300, 2610, 1400], [2440, 1450, 2505, 1485], [2185, 1420, 2240, 1500], [2340, 1430, 2385, 1470], [2575, 1455, 2615, 1485],
     [1705, 1030, 1830, 1070], [1915, 1030, 2040, 1070], [1810, 1105, 1935, 1145],
     [4302, 2620, 4352, 2668], [4306, 2672, 4368, 2698],
     [2636, 2658, 2720, 2690], [2770, 2664, 2846, 2698], [2636, 2710, 2658, 2726]].forEach(r => this._mark(r[0], r[1], r[2], r[3]));
    // fences
    for (const f of this.fences) if (!f.gate) {
      const n = Math.ceil(Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]) / 6);
      for (let k = 0; k <= n; k++) { const x = U.lerp(f.a[0], f.b[0], k / n), y = U.lerp(f.a[1], f.b[1], k / n); this._mark(x - 5, y - 5, x + 5, y + 5); }
    }
    // trees & props
    for (const t of this.trees) { const r = (t.type === 'poplar' ? 9 : 13) * t.s; this._mark(t.x - r, t.y - r * 0.6, t.x + r, t.y + r * 0.4); }
    for (const p of this.props) if (p.col) this._mark(p.x - p.col[0], p.y - p.col[1], p.x + p.col[0], p.y + p.col[1] * 0.6);
  },
  blockedAt(x, y) {
    const i = Math.floor(x / this.GS), j = Math.floor(y / this.GS);
    if (i < 0 || j < 0 || i >= this.gw || j >= this.gh) return true;
    return this.grid[j * this.gw + i] === 1;
  },
  // nearest walkable spot (used after loading a save or a scripted placement)
  freeSpot(x, y) {
    if (!this.solid(x, y)) return [x, y];
    for (let r = 8; r < 400; r += 8) for (let a = 0; a < TAU; a += 0.35) {
      const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      if (!this.solid(px, py)) return [px, py];
    }
    return [x, y];
  },
  trapped(x, y) {
    return this.solid(x + 12, y) && this.solid(x - 12, y) && this.solid(x, y + 12) && this.solid(x, y - 12);
  },
  solid(x, y) {
    return this.blockedAt(x - 9, y - 4) || this.blockedAt(x + 9, y - 4) || this.blockedAt(x - 9, y + 4) || this.blockedAt(x + 9, y + 4) || this.blockedAt(x, y);
  },
  onWater(x, y) {
    const [d, si] = U.nearSeg(x, y, this.riverPts);
    if (d < this.riverW[si] / 2) return 'river';
    if (U.inPoly(x, y, this.pondPts)) return 'pond';
    return null;
  },
  terrainAt(x, y) {
    const w = this.onWater(x, y);
    if (w) return w;
    for (const f of WORLD.fields) if (x > f.x && x < f.x + f.w && y > f.y && y < f.y + f.h) return 'field' + f.id;
    for (const p of WORLD.paddocks) if (x > p.x && x < p.x + p.w && y > p.y && y < p.y + p.h) return p.id === 'clover' ? 'clover' : 'grass';
    if (U.inPoly(x, y, WORLD.forestPoly)) return 'forest';
    if (U.inPoly(x, y, WORLD.meadowPoly)) return 'meadow';
    return 'grass';
  },
  regionAt(x, y) {
    let best = null, bd = 1e9;
    for (const k in WORLD.regions) { const r = WORLD.regions[k], d = Math.hypot(r.x - x, r.y - y) / r.r; if (d < 1 && d < bd) { bd = d; best = k; } }
    return best;
  },
  insideOf(x, y) {
    for (const b of WORLD.buildings) if (b.enter && x > b.x + 8 && x < b.x + b.w - 8 && y > b.y && y < b.y + b.d - 4) return b.id;
    return null;
  },

  // ---------------- pathfinding (A* on a 32px grid) ----------------
  _buildPathGrid() {
    const k = this.PG / this.GS;
    this.pgw = Math.ceil(this.gw / k); this.pgh = Math.ceil(this.gh / k);
    this.pgrid = new Uint8Array(this.pgw * this.pgh);
    for (let j = 0; j < this.pgh; j++) for (let i = 0; i < this.pgw; i++) {
      let b = 0;
      for (let a = 0; a < k; a++) for (let c = 0; c < k; c++) {
        const gi = i * k + c, gj = j * k + a;
        if (gi >= this.gw || gj >= this.gh || this.grid[gj * this.gw + gi]) b++;
      }
      this.pgrid[j * this.pgw + i] = b > 1 ? 1 : 0;
    }
  },
  findPath(ax, ay, bx, by) {
    const P = this.PG, gw = this.pgw, gh = this.pgh, grid = this.pgrid;
    let si = Math.floor(ax / P), sj = Math.floor(ay / P), ei = Math.floor(bx / P), ej = Math.floor(by / P);
    const free = (i, j) => i >= 0 && j >= 0 && i < gw && j < gh && !grid[j * gw + i];
    if (!free(ei, ej)) {
      let best = null, bd = 1e9;
      for (let r = 1; r < 6 && !best; r++) for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
        if (free(ei + di, ej + dj)) { const d = di * di + dj * dj; if (d < bd) { bd = d; best = [ei + di, ej + dj]; } }
      }
      if (!best) return null;
      [ei, ej] = best; bx = ei * P + P / 2; by = ej * P + P / 2;
    }
    if (!free(si, sj)) { for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (free(si + di, sj + dj)) { si += di; sj += dj; break; } }
    const N = gw * gh, gs = new Float32Array(N).fill(1e9), from = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    const heap = [], push = (n, f) => { heap.push([f, n]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    const s = sj * gw + si, e = ej * gw + ei;
    gs[s] = 0; push(s, 0);
    const h = n => { const i = n % gw, j = (n / gw) | 0, dx = Math.abs(i - ei), dy = Math.abs(j - ej); return Math.max(dx, dy) + 0.414 * Math.min(dx, dy); };
    let found = false, it = 0;
    while (heap.length && it++ < 40000) {
      const [, n] = pop();
      if (n === e) { found = true; break; }
      if (closed[n]) continue;
      closed[n] = 1;
      const i = n % gw, j = (n / gw) | 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ni = i + di, nj = j + dj;
        if (!free(ni, nj)) continue;
        if (di && dj && (!free(i + di, j) || !free(i, j + dj))) continue;
        const m = nj * gw + ni, c = gs[n] + (di && dj ? 1.414 : 1);
        if (c < gs[m]) { gs[m] = c; from[m] = n; push(m, c + h(m)); }
      }
    }
    if (!found) return null;
    const pts = [];
    for (let n = e; n !== -1 && n !== s; n = from[n]) pts.push([(n % gw) * P + P / 2, ((n / gw) | 0) * P + P / 2]);
    pts.reverse();
    if (pts.length) pts[pts.length - 1] = [bx, by];
    // string-pull
    const out = [];
    let cur = [ax, ay];
    for (let i = 0; i < pts.length; i++) {
      if (i === pts.length - 1 || !this._los(cur[0], cur[1], pts[i + 1][0], pts[i + 1][1])) { out.push(pts[i]); cur = pts[i]; }
    }
    return out;
  },
  _los(ax, ay, bx, by) {
    const d = Math.hypot(bx - ax, by - ay), n = Math.ceil(d / 10);
    for (let k = 1; k <= n; k++) { const x = U.lerp(ax, bx, k / n), y = U.lerp(ay, by, k / n); if (this.solid(x, y)) return false; }
    return true;
  },

  // ---------------- update ----------------
  update(dt) {
    const p = this.player;
    // player movement
    let mx = 0, my = 0;
    const K = G.keys;
    if (!G.busy && !UI.modal) {
      if (K.ArrowLeft || K.KeyA) mx -= 1;
      if (K.ArrowRight || K.KeyD) mx += 1;
      if (K.ArrowUp || K.KeyW) my -= 1;
      if (K.ArrowDown || K.KeyS) my += 1;
      if (G.joy && !mx && !my) { mx = G.joy.x; my = G.joy.y; }
    }
    if (mx || my) { p.route = null; this.target = null; }
    if (!mx && !my && p.route && p.route.length && !G.busy) {
      const wp = p.route[0], dx = wp[0] - p.x, dy = wp[1] - p.y, d = Math.hypot(dx, dy);
      if (d < 8) p.route.shift(); else { mx = dx / d; my = dy / d; }
      if (!p.route.length) p.route = null;
    }
    const run = K.ShiftLeft || K.ShiftRight ? 1.5 : 1;
    const l = Math.hypot(mx, my);
    if (l > 0) {
      const sp = p.speed * run * dt / l, nx = p.x + mx * sp, ny = p.y + my * sp;
      // slide along walls; if we are somehow inside a collider, let the player walk out
      const stuck = this.solid(p.x, p.y);
      let moved = false;
      if (stuck || !this.solid(nx, p.y)) { p.x = nx; moved = true; }
      if (stuck || !this.solid(p.x, ny)) { p.y = ny; moved = true; }
      // corner assist: sidestep perpendicular to the input when a clipped corner blocks both axes
      if (!moved) for (const s of [1, -1]) {
        const qx = p.x - my * sp * s, qy = p.y + mx * sp * s;
        if (!this.solid(qx, qy) && !this.solid(qx + mx * sp, qy + my * sp)) { p.x = qx; p.y = qy; moved = true; break; }
      }
      // pocket rescue: boxed in on all sides for a second -> hop to the nearest open ground
      p._stuckT = moved ? 0 : (p._stuckT || 0) + dt;
      if (p._stuckT > 1 && this.trapped(p.x, p.y)) {
        p._stuckT = 0;
        for (let r = 16, done = false; r < 400 && !done; r += 8) for (let a = 0; a < TAU; a += 0.35) {
          const px = p.x + Math.cos(a) * r, py = p.y + Math.sin(a) * r;
          if (!this.solid(px, py) && !this.trapped(px, py)) { p.x = px; p.y = py; done = true; break; }
        }
      }
      if (!moved && p.route) p.route = null;
      p.vx = mx; p.vy = my;
      p.phase += dt * 9 * run;
      p.dir = Math.abs(mx) > Math.abs(my) ? (mx < 0 ? 'left' : 'right') : my < 0 ? 'up' : 'down';
      p.moving = true;
      const last = this.crumbs[this.crumbs.length - 1];
      if (!last || Math.hypot(last[0] - p.x, last[1] - p.y) > 10) { this.crumbs.push([p.x, p.y]); if (this.crumbs.length > 60) this.crumbs.shift(); }
      p._step = (p._step || 0) + dt * run;
      if (p._step > 0.33) { p._step = 0; AU.sfx('step'); }
    } else p.moving = false;
    // arrive at clicked interactable
    if (this.target && !p.route) {
      const it = this.target;
      this.target = null;
      if (this._reach(it, p.x, p.y, 30)) this.use(it);
    }
    // actors
    for (const a of this.actors) if (a !== p) ACT.update(a, dt);
    // camera
    CAM.x += (p.x - CAM.x) * Math.min(1, dt * 5);
    CAM.y += (p.y - 30 - CAM.y) * Math.min(1, dt * 5);
    const hw = G.vw / 2 / CAM.z, hh = G.vh / 2 / CAM.z;
    CAM.x = U.clamp(CAM.x, hw, WORLD.W - hw); CAM.y = U.clamp(CAM.y, hh, WORLD.H - hh);
    // buildings fade when you are inside
    const inside = this.insideOf(p.x, p.y);
    for (const b of WORLD.buildings) b.fade = U.lerp(b.fade || 0, b.id === inside ? 1 : 0, Math.min(1, dt * 6));
    // walking behind a building (between its back wall and the top of its roof): the roof goes see-through so you never lose yourself
    for (const b of WORLD.buildings) {
      const behind = b.id !== inside && p.x > b.x - 24 && p.x < b.x + b.w + 24 && p.y < b.y + 6 && p.y > b.y - b.h - 24;
      b.ghost = U.lerp(b.ghost || 0, behind ? 1 : 0, Math.min(1, dt * 6));
    }
    this.inside = inside;
    // visiting
    const reg = this.regionAt(p.x, p.y);
    if (reg && G.S && !G.S.visited[reg]) { G.S.visited[reg] = 1; UI.toast(L(WORLD.regions[reg].name), '✦'); }
    this.region = reg;
    // restoration animation
    if (G.S) for (const k in G.S.restored) {
      const tgt = G.S.restored[k], cur = (this._rs || (this._rs = {}))[k] || 0;
      this._rs[k] = Math.min(tgt, cur + dt * 0.35);
      if (tgt > cur && cur < 0.02) this._burst(k);
    }
    // clouds
    for (const c of this.clouds) { c.x += c.s * dt; if (c.x - c.r > WORLD.W) c.x = -c.r; }
    // showers in spring and autumn: a while of rain now and then, which builds up, falls and clears
    const wet = (G.S.season === 0 || G.S.season === 2) && !G.reduceMotion;
    if ((this._rainNext -= dt) <= 0) {
      if (this.rainGoal > 0) { this.rainGoal = 0; this._rainNext = 150 + Math.random() * 200; }
      else if (wet) { this.rainGoal = 0.6 + Math.random() * 0.4; this._rainNext = 35 + Math.random() * 35; }
      else this._rainNext = 60;
    }
    if (!wet) this.rainGoal = 0;
    this.rain += U.clamp(this.rainGoal - this.rain, -dt * 0.12, dt * 0.12);
    this._ambientParticles(dt);
    PART.update(dt);
    // ambience
    if (G.frame % 8 === 0) {
      const [rd] = U.nearSeg(p.x, p.y, this.riverPts);
      const pd = Math.hypot(p.x - WORLD.pond.x, p.y - WORLD.pond.y) - 250;
      const hv = Math.hypot(p.x - 3450, p.y - 960);
      AU.amb({ rain: this.rain, water: U.clamp(1 - Math.min(rd, pd) / 380, 0, 1), bees: U.clamp(1 - hv / 420, 0, 1) * (G.S.season === 3 ? 0 : 1), indoor: !!inside, season: G.S.season, life: this.restoredAmount() });
    }
    this.hover = this.nearest();
  },
  restoredAmount() { let s = 0, n = 0; for (const k in WORLD.regions) { s += (this._rs && this._rs[k]) || 0; n++; } return s / n; },
  _burst(k) {
    const r = WORLD.regions[k];
    for (let i = 0; i < 40; i++) { const a = Math.random() * TAU, d = Math.random() * r.r * 0.7; PART.add({ kind: i % 2 ? 'sparkle' : 'petal', x: r.x + Math.cos(a) * d, y: r.y + Math.sin(a) * d, vy: -10, life: 2 + Math.random() * 2, seed: i, c: i % 3 ? '#F2D4DA' : '#FFF1B8' }); }
  },
  _ambientParticles(dt) {
    const S = G.S, t = G.t;
    // chimney smoke
    if (Math.random() < dt * 2) PART.add({ kind: 'smoke', x: 2300, y: 1150, vy: -18, life: 3.5 });
    if (Math.random() < dt * 1.5) PART.add({ kind: 'smoke', x: 3720, y: 1680, vy: -16, life: 3 });
    if (Math.random() < dt * 2.2) PART.add({ kind: 'smoke', x: 3226, y: 2846, vy: -20, life: 3.5 });
    // cave steam
    if (Math.random() < dt * 3) PART.add({ kind: 'steam', x: 4180 + Math.random() * 40 - 20, y: 600, vy: -14, life: 3 });
    // the hot spring steams, harder in the cold
    if (Math.random() < dt * (S.season === 3 ? 5 : 2.5)) PART.add({ kind: 'steam', x: 4290 + Math.random() * 50 - 25, y: 686, vy: -14, life: 3 });
    // compost steam
    if (Math.random() < dt * 0.8) PART.add({ kind: 'steam', x: 2340, y: 2320, vy: -10, life: 2.2, a: 0.6 });
    if (S.flags.compostFixed && Math.random() < dt * 0.5) PART.add({ kind: 'steam', x: 2265, y: 2336, vy: -9, life: 2, a: 0.45 });
    // season extras around the camera
    const vx = CAM.x + (Math.random() - 0.5) * G.vw / CAM.z, vy = CAM.y + (Math.random() - 0.5) * G.vh / CAM.z;
    if (S.season === 2 && Math.random() < dt * 4) PART.add({ kind: 'leaf', x: vx, y: vy - 200, vy: 30, life: 6, seed: Math.random() * 9, c: Math.random() < 0.5 ? '#C08A3E' : '#D9A95A' });
    if (S.season === 0 && Math.random() < dt * 1.2) PART.add({ kind: 'petal', x: vx, y: vy - 100, vy: 18, vx: 12, life: 5, seed: Math.random() * 9 });
    // life comes back with the land: butterflies only over ground that has been restored, bees at the hives,
    // dragonflies on the pond in the warm months, swallows passing over, and storks going south in autumn
    const sn = S.season, R = Math.random, dry = this.rain < 0.25;
    // in a shower the small lives shelter, and the rain rings the ground and the water around you
    if (this.rain > 0.15) for (let i = 0; i < 3; i++) if (R() < dt * 14 * this.rain) PART.add({ kind: 'splash', x: CAM.x + (R() - 0.5) * G.vw / CAM.z, y: CAM.y + (R() - 0.5) * G.vh / CAM.z, life: 0.5 });
    // the wet grass brings the snails out, in the rain and for a couple of minutes after it
    if (this.rain > 0.3) this._wet = 150; else if (this._wet > 0) this._wet -= dt;
    if (sn !== 3 && (this._wet > 0 || this.rain > 0.2) && R() < dt * 0.5 && this._count('snail') < 4) this._onGround('snail', vx, vy);
    if (!dry) return;
    // ladybirds on restored ground in the warm months, frogs on the pond's shore just out of the water
    if (sn < 2 && R() < dt * 0.3 && this._count('ladybug') < 3) {
      const k = this.regionAt(vx, vy), alive = k ? (this._rs && this._rs[k]) || 0 : 0.35;
      if (R() < alive) this._onGround('ladybug', vx, vy);
    }
    if (sn < 2 && R() < dt * 0.25 && this._count('frog') < 3 && Math.hypot(CAM.x - WORLD.pond.x, CAM.y - WORLD.pond.y) < 1100) {
      const a = R() * TAU;
      for (let f = 0.85; f < 1.6; f += 0.05) {
        const x = WORLD.pond.x + Math.cos(a) * WORLD.pond.rx * f, y = WORLD.pond.y + Math.sin(a) * WORLD.pond.ry * f;
        if (!this.onWater(x, y)) { this._onGround('frog', x, y); break; }
      }
    }
    if (sn < 2 && R() < dt * 0.9) {
      const k = this.regionAt(vx, vy), alive = k ? (this._rs && this._rs[k]) || 0 : 0.35;
      if (R() < alive) PART.critter('butterfly', vx, vy);
    }
    if (sn < 3 && R() < dt * 1.1) {
      const hives = this._hives || (this._hives = this.props.filter(p => p.kind === 'hive'));
      const hv = hives.filter(p => Math.hypot(p.x - CAM.x, p.y - CAM.y) < 1000);
      if (hv.length) { const h = hv[R() * hv.length | 0]; PART.critter('bee', h.x + (R() - 0.5) * 40, h.y - 10 + (R() - 0.5) * 30); }
    }
    if (sn < 2 && R() < dt * (sn === 1 ? 0.4 : 0.15) && Math.hypot(CAM.x - WORLD.pond.x, CAM.y - WORLD.pond.y) < 1300) {
      PART.critter('dragonfly', WORLD.pond.x + (R() - 0.5) * WORLD.pond.rx * 1.4, WORLD.pond.y + (R() - 0.5) * WORLD.pond.ry * 1.4);
    }
    if (sn < 3 && R() < dt * (sn === 2 ? 0.05 : 0.03)) {
      const hw = G.vw / CAM.z / 2, hh = G.vh / CAM.z / 2, st = sn === 2, kind = st ? 'stork' : 'bird';
      const x0 = CAM.x - hw - 60, y0 = CAM.y + (R() - 0.6) * hh * 1.3, sp = st ? 70 : 125 + R() * 30, n = st ? 7 : 3 + (R() * 4 | 0);
      for (let i = 0; i < n; i++) {
        const row = Math.ceil(i / 2), side = i % 2 ? 1 : -1, j = st ? 0 : (R() - 0.5) * 30;
        PART.critter(kind, x0 - row * (st ? 38 : 26) + j, y0 + side * row * (st ? 24 : 18) + j, { vx: sp + (st ? 0 : R() * 20), life: (hw * 2 + 400) / sp, seed: i * 1.7 });
      }
    }
  },

  // ---------------- interaction ----------------
  _reach(it, x, y, extra = 0) {
    if (it.rect) {
      const r = it.rect, dx = Math.max(r[0] - x, 0, x - (r[0] + r[2])), dy = Math.max(r[1] - y, 0, y - (r[1] + r[3]));
      return Math.hypot(dx, dy) < it.pad + extra;
    }
    return Math.hypot(it.x - x, it.y - y) < (it.r || 64) + extra;
  },
  _usable(it) {
    if (it.hidden) return false;
    if (it.show && !it.show()) return false;
    if (it.inside && this.inside !== it.inside) return false;
    return true;
  },
  allInters() {
    const out = this.inters.filter(i => this._usable(i));
    for (const a of this.actors) if (a.talk && !a.hidden && a !== this.player) out.push({ id: a.id, x: a.x, y: a.y - 10, r: a.kind === 'cow' ? 90 : 70, actor: a, label: ACT.label(a), verb: 'p_talk', use: a.talk });
    return out;
  },
  nearest() {
    const p = this.player;
    let best = null, bd = 1e9;
    for (const it of this.allInters()) {
      if (!this._reach(it, p.x, p.y)) continue;
      const d = it.rect ? 60 : Math.hypot(it.x - p.x, it.y - p.y);
      if (d < bd) { bd = d; best = it; }
    }
    return best;
  },
  use(it) {
    if (!it || G.busy) return;
    const a = it.actor;
    if (a) { const p = this.player; p.dir = Math.abs(a.x - p.x) > Math.abs(a.y - p.y) ? (a.x < p.x ? 'left' : 'right') : a.y < p.y ? 'up' : 'down'; if (a.kind === 'human' && !a.sit) { a.dir = p.dir === 'left' ? 'right' : p.dir === 'right' ? 'left' : p.dir === 'up' ? 'down' : 'up'; a.idle = 3; a.tx = a.x; a.ty = a.y; } }
    AU.sfx('click');
    Promise.resolve(it.use()).catch(e => console.error(e));
  },
  interact() { if (this.hover) this.use(this.hover); },
  // tapping one of the valley's small lives notes a sighting in the journal, with one thing worth knowing about it
  CRITTERS: ['butterfly', 'bee', 'dragonfly', 'bird', 'stork', 'ladybug', 'snail', 'frog'],
  _count(kind) { let n = 0; for (const p of PART.list) if (p.kind === kind) n++; return n; },
  _onGround(kind, x, y) { if (!this.onWater(x, y) && !this.solid(x, y)) PART.critter(kind, x, y); },
  spotAt(wx, wy) {
    if (!G.S || this._hitAt(wx, wy)) return false;
    let best = null, bd = G.set.board ? 56 : 40;
    for (const q of PART.list) {
      if (!q.solid || q.spotted || !this.CRITTERS.includes(q.kind)) continue;
      const d = Math.hypot(q.x - wx, q.y - (PART.LIFT[q.kind] || 0) - wy);
      if (d < bd) { bd = d; best = q; }
    }
    if (!best) return false;
    const p = best, by = p.y - (PART.LIFT[p.kind] || 0);
    // it notices you and leaves: the butterfly flutters off, the dragonfly darts away, the rest fade
    p.spotted = true; p.life = Math.min(p.life, p.t + 1.3);
    if (p.kind === 'butterfly') p.dx = (p.x < wx ? -1 : 1) * 120;
    else if (p.kind === 'dragonfly') { p.hx = p.x + (Math.random() < 0.5 ? -1 : 1) * 420; p.nt = 0; }
    else if (p.kind === 'frog') p.nt = 0;
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; PART.add({ kind: 'sparkle', x: p.x + Math.cos(a) * 16, y: by + Math.sin(a) * 12, life: 0.7, c: '#F2C84A' }); }
    const J = G.S.journal, n = ((J.critters = J.critters || {})[p.kind] || 0) + 1;
    J.critters[p.kind] = n;
    UI.spotted(p.kind, n);
    G.save();
    return true;
  },
  _hitAt(wx, wy) {
    let hit = null, bd = 1e9;
    for (const it of this.allInters()) {
      let d;
      if (it.rect) { const r = it.rect; d = U.inRect(wx, wy, r) ? 10 : 1e9; }
      else { const hr = it.actor ? (it.actor.kind === 'cow' ? 55 : 32) : 40; d = Math.hypot(it.x - wx, it.y - 10 - wy); if (d > hr) d = 1e9; }
      if (d < bd) { bd = d; hit = it; }
    }
    return hit;
  },
  clickWorld(wx, wy) {
    const p = this.player, hit = this._hitAt(wx, wy);
    if (hit) {
      if (this._reach(hit, p.x, p.y)) { this.use(hit); return; }
      const tx = hit.rect ? U.clamp(p.x, hit.rect[0], hit.rect[0] + hit.rect[2]) : hit.x, ty = hit.rect ? (p.y < hit.rect[1] ? hit.rect[1] - 20 : hit.rect[1] + hit.rect[3] + 20) : hit.y + 26;
      p.route = this.findPath(p.x, p.y, tx, ty);
      this.target = hit;
      return;
    }
    p.route = this.findPath(p.x, p.y, wx, wy);
    this.target = null;
    if (p.route) PART.add({ kind: 'sparkle', x: wx, y: wy, life: 0.6, c: '#2A2620' });
  },

  // ---------------- rendering ----------------
  view() {
    const hw = G.vw / 2 / CAM.z, hh = G.vh / 2 / CAM.z;
    return { x0: CAM.x - hw, y0: CAM.y - hh, x1: CAM.x + hw, y1: CAM.y + hh };
  },
  toScreen(wx, wy) { return [(wx - CAM.x) * CAM.z + G.vw / 2, (wy - CAM.y) * CAM.z + G.vh / 2]; },
  toWorld(sx, sy) { return [(sx - G.vw / 2) / CAM.z + CAM.x, (sy - G.vh / 2) / CAM.z + CAM.y]; },
  worldXform(ctx) {
    const z = CAM.z * G.dpr, v = this.view();
    ctx.setTransform(z, 0, 0, z, -v.x0 * z, -v.y0 * z);
  },
  render(ctx) {
    const t = G.t, v = this.view(), m = 260;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#7C8A5A';
    ctx.fillRect(0, 0, G.cw, G.ch);
    this.worldXform(ctx);
    ART.drawGround(ctx, v);
    ART.drawInteriors(ctx, v);
    ART.drawWater(ctx, t, v);
    ART.drawBridges(ctx);
    ART.drawCrops(ctx, t, v);
    this._drawDrought(ctx);
    this.worldXform(ctx);
    // y-sorted scene
    const list = [];
    const vis = (x, y, r = 200) => x > v.x0 - r && x < v.x1 + r && y > v.y0 - r && y < v.y1 + r + 260;
    for (const tr of this.trees) if (vis(tr.x, tr.y)) list.push({ y: tr.y, k: 0, o: tr });
    for (const b of WORLD.buildings) if (vis(b.x + b.w / 2, b.y + b.d / 2, b.w)) list.push({ y: (b.fade || 0) > 0.5 ? b.y : b.y + b.d, k: 1, o: b });
    for (const p of this.props) if (vis(p.x, p.y)) list.push({ y: p.sortY != null ? p.sortY : p.y + (p.kind === 'rails' ? -400 : 0), k: 2, o: p });
    for (const f of this.fences) if (vis(f.a[0], f.a[1])) list.push({ y: Math.max(f.a[1], f.b[1]) + 1, k: 3, o: f });
    for (const a of this.actors) if (!a.hidden && vis(a.x, a.y)) list.push({ y: a.y + (a.perch ? 400 : 0), k: 4, o: a });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) {
      if (it.k === 0) ART.drawTree(ctx, it.o, t);
      else if (it.k === 1) ART.drawBuilding(ctx, it.o, t);
      else if (it.k === 2) ART.drawProp(ctx, it.o, t);
      else if (it.k === 3) ART.drawFence(ctx, it.o);
      else ACT.draw(ctx, it.o, t);
    }
    PART.draw(ctx);
    this._drawCloudShadows(ctx, v);
    // hover marker
    if (this.hover && !LENS.on && !G.busy && !UI.modal) this._drawMarker(ctx, this.hover, t);
    if (this.player.route && this.player.route.length) {
      const e = this.player.route[this.player.route.length - 1];
      ctx.strokeStyle = 'rgba(42,38,32,0.5)'; ctx.lineWidth = 1.5; U.ellipse(ctx, e[0], e[1], 10 + Math.sin(t * 6) * 2, 5); ctx.stroke();
    }
    // screen-space post
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (G.S.season === 3) this._drawSnow(ctx, t);
    if (this.rain > 0.01) this._drawRain(ctx, t);
    this._post(ctx);
    this._drawWaypoint(ctx, t);
    LENS.draw(ctx);
  },
  _drawMarker(ctx, it, t) {
    let x = it.x, y = it.y - (it.actor ? (it.actor.kind === 'cow' ? 80 : it.actor.kind === 'human' ? 70 : 50) : 40);
    if (it.rect) { x = it.rect[0] + it.rect[2] / 2; y = it.rect[1] - 10; }
    const b = Math.sin(t * 4) * 3;
    ctx.save();
    ctx.fillStyle = '#F4EEDD'; ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x - 7, y - 12 + b); ctx.lineTo(x + 7, y - 12 + b); ctx.lineTo(x, y - 2 + b); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  },
  _drawDrought(ctx) {
    // desaturate regions that are not restored yet
    const k = 4, w = Math.ceil(G.cw / k), h = Math.ceil(G.ch / k);
    if (!this._dm || this._dm.width !== w || this._dm.height !== h) { this._dm = U.canvas(w, h); }
    const m = this._dm.getContext('2d');
    m.globalCompositeOperation = 'source-over';
    m.clearRect(0, 0, w, h);
    const base = G.S.season === 3 ? 0.35 : 0.62;
    m.fillStyle = `rgba(128,128,128,${base})`;
    m.fillRect(0, 0, w, h);
    m.globalCompositeOperation = 'destination-out';
    const z = CAM.z * G.dpr / k;
    for (const key in WORLD.regions) {
      const val = (this._rs && this._rs[key]) || 0;
      if (val <= 0.001) continue;
      const r = WORLD.regions[key], [sx, sy] = this.toScreen(r.x, r.y);
      const rad = r.r * z * U.easeOut(val) * 1.15;
      const g = m.createRadialGradient(sx * G.dpr / k, sy * G.dpr / k, rad * 0.55, sx * G.dpr / k, sy * G.dpr / k, rad);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      m.fillStyle = g; m.beginPath(); m.arc(sx * G.dpr / k, sy * G.dpr / k, rad, 0, TAU); m.fill();
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'saturation';
    ctx.drawImage(this._dm, 0, 0, G.cw, G.ch);
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#E8D6A8';
    ctx.drawImage(this._dm, 0, 0, G.cw, G.ch);
    ctx.restore();
  },
  _drawCloudShadows(ctx, v) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    for (const c of this.clouds) {
      if (c.x + c.r < v.x0 || c.x - c.r > v.x1 || c.y + c.r < v.y0 || c.y - c.r > v.y1) continue;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      g.addColorStop(0, `rgba(70,80,110,${(0.13 + 0.15 * this.rain).toFixed(3)})`); g.addColorStop(1, 'rgba(70,80,110,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(c.x, c.y, c.r, c.r * 0.6, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  _drawSnow(ctx, t) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 140; i++) {
      const x = ((U.hash(i, 1, 9) * G.cw + t * (20 + 30 * U.hash(i, 2, 9)) * G.dpr + Math.sin(t + i) * 10) % G.cw + G.cw) % G.cw;
      const y = ((U.hash(i, 3, 9) * G.ch + t * (40 + 40 * U.hash(i, 4, 9)) * G.dpr) % G.ch);
      ctx.beginPath(); ctx.arc(x, y, (1 + 2 * U.hash(i, 5, 9)) * G.dpr, 0, TAU); ctx.fill();
    }
  },
  // a shower: the light dims and cools a little, and thin streaks slant down across the screen (less of it indoors)
  _drawRain(ctx, t) {
    const r = this.rain * (this.inside ? 0.35 : 1), w = G.cw, h = G.ch, d = G.dpr;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgba(150,165,185,${(0.45 * r).toFixed(3)})`; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = `rgba(215,228,240,${(0.42 * r).toFixed(3)})`; ctx.lineWidth = 1.2 * d; ctx.lineCap = 'round';
    const n = Math.round(260 * r), len = 22 * d, sx = -0.28, W0 = w + 200 * d, H0 = h + len, m = (a, b) => ((a % b) + b) % b;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const sp = (700 + 500 * U.hash(i, 2, 7)) * d, y = m(U.hash(i, 3, 7) * H0 + t * sp, H0) - len, x = m(U.hash(i, 1, 7) * W0 + t * sp * sx, W0) - 100 * d;
      ctx.moveTo(x, y); ctx.lineTo(x + sx * len, y + len);
    }
    ctx.stroke();
    ctx.restore();
  },
  _post(ctx) {
    const w = G.cw, h = G.ch;
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = ['rgba(255,236,190,0.22)', 'rgba(255,214,150,0.28)', 'rgba(255,190,130,0.25)', 'rgba(190,210,255,0.22)'][G.S.season];
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(40,30,20,0)'); g.addColorStop(1, 'rgba(40,30,20,0.38)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },
  _drawWaypoint(ctx, t) {
    const wp = this.waypoint;
    if (!wp) return;
    const p = this.player;
    if (Math.hypot(wp.x - p.x, wp.y - p.y) < 200) { this.waypoint = null; return; }
    const [sx, sy] = this.toScreen(wp.x, wp.y);
    const cx = G.vw / 2, cy = G.vh / 2, ang = Math.atan2(sy - cy, sx - cx);
    const inView = sx > 40 && sy > 40 && sx < G.vw - 40 && sy < G.vh - 40;
    let x, y;
    if (inView) { x = sx; y = sy - 40 + Math.sin(t * 4) * 5; }
    else { const r = Math.min(G.vw, G.vh) / 2 - 60; x = cx + Math.cos(ang) * r; y = cy + Math.sin(ang) * r; }
    ctx.save();
    ctx.scale(G.dpr, G.dpr);
    ctx.translate(x, y);
    ctx.rotate(inView ? Math.PI / 2 : ang);
    ctx.fillStyle = '#A0322A'; ctx.strokeStyle = '#F4EEDD'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-10, -10); ctx.lineTo(-4, 0); ctx.lineTo(-10, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  },
};
