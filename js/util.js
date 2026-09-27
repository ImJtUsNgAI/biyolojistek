'use strict';
// Shared helpers: math, seeded noise, colour, and the hand-inked drawing primitives.
const TAU = Math.PI * 2;

const U = {
  clamp: (v, a, b) => (v < a ? a : v > b ? b : v),
  lerp: (a, b, t) => a + (b - a) * t,
  smooth: t => t * t * (3 - 2 * t),
  dist: (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay),
  easeOut: t => 1 - Math.pow(1 - t, 3),
  easeInOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },

  rng(seed) {
    let s = (seed >>> 0) || 1;
    return () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },
  hash(x, y, s = 0) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  },
  noise(x, y, s = 0) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = U.hash(xi, yi, s), b = U.hash(xi + 1, yi, s), c = U.hash(xi, yi + 1, s), d = U.hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  },
  fbm(x, y, o = 4, s = 0) {
    let f = 0, a = 0.5, n = 0;
    for (let i = 0; i < o; i++) { f += a * U.noise(x, y, s + i * 17); n += a; x *= 2.03; y *= 2.03; a *= 0.5; }
    return f / n;
  },
  pick(arr, r) { return arr[Math.floor(r * arr.length) % arr.length]; },

  // ---- colour ----
  _rgb: {},
  rgb(hex) {
    let c = U._rgb[hex];
    if (c) return c;
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    c = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    U._rgb[hex] = c;
    return c;
  },
  hex(r, g, b) {
    return '#' + [r, g, b].map(v => U.clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  },
  mix(a, b, t) {
    const A = U.rgb(a), B = U.rgb(b);
    return U.hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  },
  shade(hex, k) { return k >= 0 ? U.mix(hex, '#ffffff', k) : U.mix(hex, '#000000', -k); },
  rgba(hex, a) { const c = U.rgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; },
  desat(hex, k) {
    const c = U.rgb(hex), l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
    return U.hex(c[0] + (l - c[0]) * k, c[1] + (l - c[1]) * k, c[2] + (l - c[2]) * k);
  },

  // ---- geometry ----
  distSeg(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
    let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return Math.hypot(px - ax - dx * t, py - ay - dy * t);
  },
  distPoly(px, py, pts) {
    let m = 1e9;
    for (let i = 0; i < pts.length - 1; i++) {
      const d = U.distSeg(px, py, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      if (d < m) m = d;
    }
    return m;
  },
  // index of nearest segment and distance, for variable-width rivers
  nearSeg(px, py, pts) {
    let m = 1e9, mi = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const d = U.distSeg(px, py, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      if (d < m) { m = d; mi = i; }
    }
    return [m, mi];
  },
  inPoly(x, y, pts) {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  },
  inRect(x, y, r) { return x >= r[0] && y >= r[1] && x <= r[0] + r[2] && y <= r[1] + r[3]; },
  bbox(pts) {
    let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
    for (const p of pts) { if (p[0] < a) a = p[0]; if (p[1] < b) b = p[1]; if (p[0] > c) c = p[0]; if (p[1] > d) d = p[1]; }
    return [a, b, c - a, d - b];
  },
  // dense Catmull-Rom sampling (open curve)
  catmull(pts, seg = 8) {
    const out = [], n = pts.length;
    const g = i => pts[U.clamp(i, 0, n - 1)];
    for (let i = 0; i < n - 1; i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      for (let k = 0; k < seg; k++) {
        const t = k / seg, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
        ]);
      }
    }
    out.push(pts[n - 1].slice());
    return out;
  },
  offsetLine(pts, d) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const l = Math.hypot(nx, ny) || 1;
      const dd = typeof d === 'function' ? d(i) : d;
      out.push([pts[i][0] + (nx / l) * dd, pts[i][1] + (ny / l) * dd]);
    }
    return out;
  },

  // ---- hand-inked drawing ----
  path(ctx, pts, closed) {
    const n = pts.length;
    if (n < 2) return;
    ctx.moveTo(pts[0][0], pts[0][1]);
    if (n === 2 && !closed) { ctx.lineTo(pts[1][0], pts[1][1]); return; }
    const get = i => (closed ? pts[(i + n) % n] : pts[U.clamp(i, 0, n - 1)]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      ctx.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]
      );
    }
    if (closed) ctx.closePath();
  },
  poly(ctx, pts, closed) {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (closed) ctx.closePath();
  },
  jitter(pts, amp, seed) {
    if (!amp) return pts;
    return pts.map((p, i) => [p[0] + (U.hash(i, 1, seed) - 0.5) * 2 * amp, p[1] + (U.hash(i, 2, seed) - 0.5) * 2 * amp]);
  },
  blob(cx, cy, rx, ry, n, irr, seed, rot = 0) {
    const pts = [], c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU, k = 1 + (U.hash(i, 3, seed) - 0.5) * 2 * irr;
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
      pts.push([cx + x * c - y * s, cy + x * s + y * c]);
    }
    return pts;
  },
  rectPts(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; },
  // ink stroke: a crisp line plus a softer, slightly offset second pass
  ink(ctx, pts, o = {}) {
    const { closed = false, color = '#2A2620', w = 1.6, amp = 1.1, seed = 1, alpha = 1, smooth = true } = o;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = w;
    ctx.beginPath();
    (smooth ? U.path : U.poly)(ctx, U.jitter(pts, amp, seed), closed);
    ctx.stroke();
    ctx.globalAlpha *= 0.3;
    ctx.lineWidth = w * 2;
    ctx.beginPath();
    (smooth ? U.path : U.poly)(ctx, U.jitter(pts, amp * 1.4, seed + 7), closed);
    ctx.stroke();
    ctx.restore();
  },
  // watercolour wash: flat fill with pigment pooling at the edge
  wash(ctx, pts, color, o = {}) {
    const { seed = 1, edge = 0.28, alpha = 1, amp = 1.5, inner = true } = o;
    ctx.save();
    ctx.globalAlpha *= alpha;
    const p = U.jitter(pts, amp, seed);
    ctx.fillStyle = color;
    ctx.beginPath();
    U.path(ctx, p, true);
    ctx.fill();
    if (edge > 0) {
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = U.shade(color, -0.3);
      ctx.globalAlpha *= edge;
      ctx.lineWidth = 8;
      ctx.beginPath();
      U.path(ctx, p, true);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
    if (inner) {
      const bb = U.bbox(p);
      const g = ctx.createRadialGradient(bb[0] + bb[2] * 0.4, bb[1] + bb[3] * 0.35, 0, bb[0] + bb[2] * 0.4, bb[1] + bb[3] * 0.35, Math.max(bb[2], bb[3]) * 0.6);
      g.addColorStop(0, 'rgba(255,255,240,0.16)');
      g.addColorStop(1, 'rgba(255,255,240,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      U.path(ctx, p, true);
      ctx.fill();
    }
    ctx.restore();
  },
  ellipse(ctx, x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU); },
  rr(ctx, x, y, w, h, r) {
    if (w < 0) { x += w; w = -w; }
    if (h < 0) { y += h; h = -h; }
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  },
  canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  },
  wrapText(ctx, text, maxW) {
    const words = String(text).split(' '), lines = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  },
  // line boil: ink outlines re-jitter ~8 times a second
  boil(extra = 0) { return G.reduceMotion ? 1 + extra : (Math.floor(G.t * 8) % 4) + 1 + extra; },
  num(x, d = 0) {
    const s = Number(x).toFixed(d);
    return I18N.lang === 'tr' ? s.replace('.', ',') : s;
  },
  esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },
  sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
};
