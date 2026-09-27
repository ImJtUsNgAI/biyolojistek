'use strict';
// Micrograph toolkit. Specimen plates are painted once into an offscreen bitmap at the resolution they are shown
// at, then reused; only small moving parts (cilia, bubbles, a heartbeat) are drawn live on top.
// Everything here works in plate units (-140..140). While a plate is being painted, MX.s is pixels per unit.
const MX = {
  s: 1,
  rng: seed => U.rng(seed),
  n: (x, y, s = 0) => U.noise(x, y, s) * 2 - 1,
  f: (x, y, o = 4, s = 0) => U.fbm(x, y, o, s) * 2 - 1,

  // ---------------------------------------------------------------- paths
  // smooth curve through points (Catmull-Rom written as Béziers)
  curve(o, p, closed = true, move = true) {
    const n = p.length; if (n < 2) return;
    const P = i => closed ? p[(i + n) % n] : p[U.clamp(i, 0, n - 1)];
    if (move) o.moveTo(p[0][0], p[0][1]);
    for (let i = 0, m = closed ? n : n - 1; i < m; i++) {
      const a = P(i - 1), b = P(i), c = P(i + 1), d = P(i + 2);
      o.bezierCurveTo(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6, c[0], c[1]);
    }
    if (closed) o.closePath();
  },
  // an organic closed outline
  blob(cx, cy, rx, ry, opt = {}) {
    const { rot = 0, wob = 0.08, n = 28, seed = 1, fq = 1.6 } = opt, cr = Math.cos(rot), sr = Math.sin(rot), pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, k = 1 + wob * this.n(Math.cos(a) * fq + seed * 7.31, Math.sin(a) * fq + seed * 3.17, seed);
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
      pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
    }
    return pts;
  },
  // points a quarter of the way in from each corner: a curve through them is a softly rounded polygon
  soft(poly, k = 0.25) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], [a[0] + (b[0] - a[0]) * (1 - k), a[1] + (b[1] - a[1]) * (1 - k)]);
    }
    return out;
  },
  // wandering line (roots, hyphae, fibres)
  strand(R, x, y, a, len, step = 3, curl = 0.25, pull = null) {
    const p = [[x, y]];
    for (let s = 0; s < len; s += step) {
      a += (R() - 0.5) * curl;
      if (pull) a += Math.atan2(Math.sin(pull - a), Math.cos(pull - a)) * 0.08;
      x += Math.cos(a) * step; y += Math.sin(a) * step; p.push([x, y]);
    }
    return p;
  },
  along(pts, t) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = t * L;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? d / seg[i] : 0, a = pts[i], b = pts[i + 1]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.atan2(b[1] - a[1], b[0] - a[0])]; }
      d -= seg[i];
    }
    return [pts[0][0], pts[0][1], 0];
  },

  // ---------------------------------------------------------------- convex polygons and cell packing
  area(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; a += q[0] * r[1] - r[0] * q[1]; } return a / 2; },
  centroid(p) {
    let a = 0, x = 0, y = 0;
    for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length], c = q[0] * r[1] - r[0] * q[1]; a += c; x += (q[0] + r[0]) * c; y += (q[1] + r[1]) * c; }
    if (Math.abs(a) < 1e-9) { const n = p.length || 1; return [p.reduce((s, q) => s + q[0], 0) / n, p.reduce((s, q) => s + q[1], 0) / n]; }
    return [x / (3 * a), y / (3 * a)];
  },
  // keep the side where (v - m)·n <= 0
  clip(poly, mx, my, nx, ny) {
    const out = [], f = v => (v[0] - mx) * nx + (v[1] - my) * ny;
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k], b = poly[(k + 1) % poly.length], fa = f(a), fb = f(b);
      if (fa <= 0) out.push(a);
      if ((fa <= 0) !== (fb <= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  },
  voronoi(sites, bound) {
    return sites.map((p, i) => {
      let poly = bound.map(q => q.slice());
      const order = [];
      for (let j = 0; j < sites.length; j++) if (j !== i) order.push([j, (sites[j][0] - p[0]) ** 2 + (sites[j][1] - p[1]) ** 2]);
      order.sort((a, b) => a[1] - b[1]);
      for (const [j, d2] of order) {
        let r2 = 0; for (const v of poly) r2 = Math.max(r2, (v[0] - p[0]) ** 2 + (v[1] - p[1]) ** 2);
        if (d2 > 4 * r2) break;
        const q = sites[j];
        poly = this.clip(poly, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, q[0] - p[0], q[1] - p[1]);
        if (poly.length < 3) break;
      }
      return poly;
    });
  },
  relax(sites, bound, k = 2) {
    for (let i = 0; i < k; i++) sites = this.voronoi(sites, bound).map((c, j) => c.length > 2 ? this.centroid(c) : sites[j]);
    return sites;
  },
  // blue-noise scatter inside a test region
  scatter(R, n, gap, bb, inside = null, tries = 30) {
    const pts = [];
    for (let t = 0; t < n * tries && pts.length < n; t++) {
      const x = bb[0] + R() * bb[2], y = bb[1] + R() * bb[3];
      if (inside && !inside(x, y)) continue;
      let ok = true; for (const q of pts) if ((q[0] - x) ** 2 + (q[1] - y) ** 2 < gap * gap) { ok = false; break; }
      if (ok) pts.push([x, y]);
    }
    return pts;
  },
  // shrink a convex polygon by d; falls back to scaling when the polygon is too small for that
  inset(poly, d) {
    const n = poly.length; if (n < 3 || !d) return poly;
    const c = this.centroid(poly), L = [];
    let rin = 1e9;
    for (let k = 0; k < n; k++) {
      const a = poly[k], b = poly[(k + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
      if (l < 1e-6) continue;
      let nx = -dy / l, ny = dx / l, dd = (c[0] - a[0]) * nx + (c[1] - a[1]) * ny;
      if (dd < 0) { nx = -nx; ny = -ny; dd = -dd; }
      rin = Math.min(rin, dd);
      L.push([a[0] + nx * d, a[1] + ny * d, dx, dy, nx, ny]);
    }
    const shrink = () => { const k = Math.max(0.08, 1 - d / Math.max(rin, 1e-6)); return poly.map(v => [c[0] + (v[0] - c[0]) * k, c[1] + (v[1] - c[1]) * k]); };
    if (d >= rin * 0.92) return shrink();
    const out = [];
    for (let k = 0; k < L.length; k++) {
      const A = L[(k - 1 + L.length) % L.length], B = L[k], den = A[2] * B[3] - A[3] * B[2];
      if (Math.abs(den) < 1e-9) { out.push([B[0], B[1]]); continue; }
      const t = ((B[0] - A[0]) * B[3] - (B[1] - A[1]) * B[2]) / den;
      out.push([A[0] + A[2] * t, A[1] + A[3] * t]);
    }
    for (const v of out) for (const l of L) if ((v[0] - l[0]) * l[4] + (v[1] - l[1]) * l[5] < -0.01) return shrink();
    return out;
  },
  // every wall once: [a, b, key]
  edges(cells) {
    const seen = new Set(), out = [], kf = v => Math.round(v[0] * 10) + ',' + Math.round(v[1] * 10);
    for (const c of cells) for (let i = 0; i < c.length; i++) {
      const a = c[i], b = c[(i + 1) % c.length], ka = kf(a), kb = kf(b), k = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      if (ka === kb || seen.has(k)) continue;
      seen.add(k); out.push([a, b, k]);
    }
    return out;
  },
  // a wall that meanders between its two fixed ends (the jigsaw walls of leaf epidermis)
  wavy(a, b, amp, waves, seed) {
    const pts = [], l = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / (l || 1), ny = (b[0] - a[0]) / (l || 1), n = Math.max(6, Math.round(l / 2));
    const ph = U.hash(seed, 3, 9) * TAU;
    for (let i = 0; i <= n; i++) {
      const t = i / n, e = Math.sin(Math.PI * t), w = amp * e * (Math.sin(t * waves * Math.PI + ph) * 0.8 + 0.35 * Math.sin(t * waves * 2.3 * Math.PI + ph * 1.7));
      pts.push([a[0] + (b[0] - a[0]) * t + nx * w, a[1] + (b[1] - a[1]) * t + ny * w]);
    }
    return pts;
  },

  // ---------------------------------------------------------------- painting
  blur(o, u) { o.filter = u > 0 ? `blur(${(u * this.s).toFixed(2)}px)` : 'none'; },
  // paint on a separate sheet and lay it down once: out-of-focus depth costs a single blur this way
  layer(o, paint, blur = 0, alpha = 1, comp = null) {
    const c = U.canvas(o.canvas.width, o.canvas.height), x = c.getContext('2d');
    x.setTransform(o.getTransform());
    paint(x);
    o.save(); o.setTransform(1, 0, 0, 1, 0, 0); o.globalAlpha = alpha;
    if (comp) o.globalCompositeOperation = comp;
    o.filter = blur > 0 ? `blur(${(blur * this.s).toFixed(2)}px)` : 'none';
    o.drawImage(c, 0, 0); o.restore();
  },
  path(o, pts, closed = true) { o.beginPath(); this.curve(o, pts, closed); },
  fill(o, pts, col, closed = true) { o.fillStyle = col; o.beginPath(); this.curve(o, pts, closed); o.fill(); },
  line(o, pts, col, w, closed = false) { o.strokeStyle = col; o.lineWidth = w; o.lineCap = 'round'; o.lineJoin = 'round'; o.beginPath(); this.curve(o, pts, closed); o.stroke(); },
  // a round thing lit from the upper left
  lit(o, cx, cy, r, base, hi = 0.45, lo = 0.35, lx = -0.35, ly = -0.4) {
    const g = o.createRadialGradient(cx + r * lx, cy + r * ly, r * 0.04, cx, cy, r * 1.05);
    g.addColorStop(0, U.shade(base, hi)); g.addColorStop(0.5, base); g.addColorStop(1, U.shade(base, -lo));
    return g;
  },
  ball(o, cx, cy, r, base, hi, lo) { o.fillStyle = this.lit(o, cx, cy, r, base, hi, lo); o.beginPath(); o.arc(cx, cy, r, 0, TAU); o.fill(); },
  lin(o, x0, y0, x1, y1, stops) { const g = o.createLinearGradient(x0, y0, x1, y1); stops.forEach(([t, c]) => g.addColorStop(t, c)); return g; },
  rad(o, x, y, r0, r1, stops) { const g = o.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([t, c]) => g.addColorStop(t, c)); return g; },
  // per-pixel texture painted at a modest resolution and smoothed up
  tex(o, x0, y0, w, h, fn, maxPx = 256) {
    const pw = Math.max(2, Math.min(maxPx, Math.round(w * this.s / 2))), ph = Math.max(2, Math.round(pw * h / w));
    const c = U.canvas(pw, ph), x = c.getContext('2d'), id = x.createImageData(pw, ph), d = id.data;
    for (let j = 0; j < ph; j++) for (let i = 0; i < pw; i++) {
      const px = fn(x0 + (i + 0.5) / pw * w, y0 + (j + 0.5) / ph * h);
      if (!px) continue;
      const k = (j * pw + i) * 4; d[k] = px[0]; d[k + 1] = px[1]; d[k + 2] = px[2]; d[k + 3] = px[3] == null ? 255 : px[3];
    }
    x.putImageData(id, 0, 0);
    o.save(); o.imageSmoothingEnabled = true; o.imageSmoothingQuality = 'high'; o.drawImage(c, x0, y0, w, h); o.restore();
  },
  // the microscope field: base colour, uneven illumination, soft vignette
  field(o, base, blotch, seed = 1, sc = 0.012, amt = 90) {
    o.fillStyle = base; o.fillRect(-141, -141, 282, 282);
    const b = U.rgb(blotch);
    this.tex(o, -141, -141, 282, 282, (x, y) => [b[0], b[1], b[2], U.fbm(x * sc + seed * 3.3, y * sc - seed, 3, seed) * amt], 72);
  },
  // soft focus: lay a blurred copy of what is painted so far over itself, so crisp vector edges read like a photograph
  soften(o, u = 0.5, a = 0.5) {
    const c = o.canvas, t = U.canvas(c.width, c.height); t.getContext('2d').drawImage(c, 0, 0);
    o.save(); o.setTransform(1, 0, 0, 1, 0, 0); o.globalAlpha = a; o.filter = `blur(${(u * this.s).toFixed(2)}px)`; o.drawImage(t, 0, 0); o.restore();
  },
  vignette(o, k = 0.2, col = '20,16,10') {
    o.fillStyle = this.rad(o, 0, 0, 90, 205, [[0, `rgba(${col},0)`], [1, `rgba(${col},${k})`]]);
    o.fillRect(-141, -141, 282, 282);
  },
  _grain: null,
  grain(o, amt = 0.05) {
    if (!this._grain) {
      const c = U.canvas(128, 128), x = c.getContext('2d'), id = x.createImageData(128, 128), R = this.rng(99);
      for (let i = 0; i < id.data.length; i += 4) { const v = R() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      x.putImageData(id, 0, 0); this._grain = c;
    }
    const p = o.createPattern(this._grain, 'repeat'), k = 1.4 / this.s;
    if (p.setTransform) p.setTransform(new DOMMatrix([k, 0, 0, k, 0, 0]));
    o.save(); o.globalAlpha = amt; o.globalCompositeOperation = 'overlay'; o.fillStyle = p; o.fillRect(-141, -141, 282, 282); o.restore();
  },
  // granules, bacteria and other specks
  dots(o, R, n, bb, r0, r1, col, inside = null) {
    o.fillStyle = col;
    for (let i = 0, k = 0; i < n && k < n * 6; k++) {
      const x = bb[0] + R() * bb[2], y = bb[1] + R() * bb[3];
      if (inside && !inside(x, y)) continue;
      i++; o.beginPath(); o.arc(x, y, r0 + R() * (r1 - r0), 0, TAU); o.fill();
    }
  },
  rod(o, x, y, a, l, w, col, edge) {
    o.save(); o.translate(x, y); o.rotate(a);
    o.fillStyle = col; U.rr(o, -l / 2, -w / 2, l, w, w / 2); o.fill();
    if (edge) { o.strokeStyle = edge; o.lineWidth = Math.min(0.5, w * 0.25); o.stroke(); }
    o.restore();
  },
  // a thick shaded tube along a path (roots, stems, hyphae, filaments)
  tube(o, pts, w, base, opt = {}) {
    const { edge = U.shade(base, -0.35), hi = U.shade(base, 0.35), hiA = 0.55 } = opt;
    this.line(o, pts, edge, w);
    this.line(o, pts, base, w * 0.78);
    o.globalAlpha = hiA; this.line(o, pts.map(p => [p[0] - w * 0.14, p[1] - w * 0.16]), hi, w * 0.22); o.globalAlpha = 1;
  },
  // a tapering tube: width goes from w0 at the start to w1 at the end
  taper(o, pts, w0, w1, col, edge) {
    const n = pts.length; if (n < 2) return;
    const L = [], Rr = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
      L.push([pts[i][0] + Math.cos(ang - Math.PI / 2) * w, pts[i][1] + Math.sin(ang - Math.PI / 2) * w]);
      Rr.push([pts[i][0] + Math.cos(ang + Math.PI / 2) * w, pts[i][1] + Math.sin(ang + Math.PI / 2) * w]);
    }
    const poly = L.concat(Rr.reverse());
    o.fillStyle = col; o.beginPath(); this.curve(o, poly, true); o.fill();
    if (edge) { o.strokeStyle = edge; o.lineWidth = Math.max(0.35, Math.min(w0, 3) * 0.18); o.stroke(); }
  },
  text(o, s, x, y, size = 7, col = '#1B1A17', align = 'center', weight = 700) {
    o.fillStyle = col; o.font = `${weight} ${size}px "Courier Prime", monospace`; o.textAlign = align; o.textBaseline = 'middle'; o.fillText(s, x, y);
  },
  // diagram arrows over a realistic plate: a pale halo keeps them readable on any background
  note(o, pts, col, w = 2, label = '', at = null) {
    this.line(o, pts, 'rgba(255,255,255,0.75)', w + 2.4);
    this.line(o, pts, col, w);
    const b = pts[pts.length - 1], a = pts[pts.length - 2], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 4 + w * 1.6;
    o.fillStyle = col; o.strokeStyle = 'rgba(255,255,255,0.75)'; o.lineWidth = 1.2;
    o.beginPath(); o.moveTo(b[0] + Math.cos(ang) * h * 0.4, b[1] + Math.sin(ang) * h * 0.4);
    o.lineTo(b[0] + Math.cos(ang + 2.6) * h, b[1] + Math.sin(ang + 2.6) * h); o.lineTo(b[0] + Math.cos(ang - 2.6) * h, b[1] + Math.sin(ang - 2.6) * h); o.closePath(); o.stroke(); o.fill();
    if (label) {
      const [lx, ly] = at || pts[0];
      o.font = '700 8px "Courier Prime", monospace'; const tw = o.measureText(label).width;
      o.fillStyle = 'rgba(255,255,255,0.8)'; U.rr(o, lx - tw / 2 - 3, ly - 6, tw + 6, 12, 3); o.fill();
      this.text(o, label, lx, ly + 0.5, 8, col);
    }
  },
  // magnifier inset: a round window showing the same place at higher power
  loupe(o, cx, cy, r, to, label, paint) {
    if (to) {
      o.strokeStyle = 'rgba(20,18,14,0.75)'; o.lineWidth = 0.9; o.setLineDash([3, 2]);
      const a = Math.atan2(to[1] - cy, to[0] - cx);
      o.beginPath(); o.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); o.lineTo(to[0], to[1]); o.stroke(); o.setLineDash([]);
      o.fillStyle = 'rgba(20,18,14,0.85)'; o.beginPath(); o.arc(to[0], to[1], 2, 0, TAU); o.fill();
      o.strokeStyle = 'rgba(255,255,255,0.8)'; o.lineWidth = 0.8; o.beginPath(); o.arc(to[0], to[1], 5, 0, TAU); o.stroke();
    }
    o.save(); o.fillStyle = 'rgba(0,0,0,0.3)'; o.beginPath(); o.arc(cx + 2, cy + 3, r + 3, 0, TAU); o.fill(); o.restore();
    o.save(); o.beginPath(); o.arc(cx, cy, r, 0, TAU); o.clip(); o.translate(cx, cy); paint(o); o.restore();
    o.save(); o.fillStyle = this.rad(o, cx, cy, r * 0.6, r, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.28)']]); o.beginPath(); o.arc(cx, cy, r, 0, TAU); o.fill(); o.restore();
    o.strokeStyle = '#2A2620'; o.lineWidth = 2.2; o.beginPath(); o.arc(cx, cy, r, 0, TAU); o.stroke();
    o.strokeStyle = '#C8A24E'; o.lineWidth = 1.1; o.beginPath(); o.arc(cx, cy, r - 1.4, 0, TAU); o.stroke();
    if (label) {
      o.font = '700 7px "Courier Prime", monospace'; const tw = o.measureText(label).width, ly = cy + r - 7;
      o.fillStyle = 'rgba(27,26,23,0.85)'; U.rr(o, cx - tw / 2 - 3, ly - 5, tw + 6, 10, 2); o.fill();
      this.text(o, label, cx, ly + 0.5, 7, '#F4EEDD');
    }
  },
  // every plate carries a scale bar: students learn sizes from these pictures
  // every scale bar drawn is remembered by plate, so the specimen table's ruler can turn plate units into µm or cm
  scales: {}, _cur: null,
  scaleBar(o, units, label, light = false) {
    if (this._cur) this.scales[this._cur] = [units, label];
    const x = -130, y = 128, fg = light ? '#F4F1E8' : '#1B1A17', bg = light ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.7)';
    o.font = '700 7.5px "Courier Prime", monospace'; const tw = o.measureText(label).width, w = Math.max(units, tw) + 8;
    o.fillStyle = bg; U.rr(o, x - 4, y - 14, w, 19, 3); o.fill();
    o.fillStyle = fg; o.fillRect(x, y, units, 2.2); o.fillRect(x, y - 2, 0.9, 6.2); o.fillRect(x + units - 0.9, y - 2, 0.9, 6.2);
    this.text(o, label, x + units / 2, y - 6.5, 7.5, fg);
  },

  // ---------------------------------------------------------------- shared specimens
  // a chloroplast as seen with the light microscope: a green lens with darker grana
  chloro(o, R, x, y, a, rx, ry, pal) {
    o.save(); o.translate(x, y); o.rotate(a);
    const g = o.createRadialGradient(-rx * 0.3, -ry * 0.45, 0.3, 0, 0, rx);
    g.addColorStop(0, pal[2]); g.addColorStop(0.5, pal[0]); g.addColorStop(1, pal[1]);
    o.fillStyle = g; o.beginPath(); o.ellipse(0, 0, rx, ry, 0, 0, TAU); o.fill();
    o.fillStyle = U.rgba(pal[1], pal[3] == null ? 0.8 : pal[3]);
    const n = Math.round(rx * (pal[4] || 1.1));
    for (let i = 0; i < n; i++) { const u = (R() * 2 - 1) * rx * 0.78, v = (R() * 2 - 1) * ry * 0.62 * Math.sqrt(Math.max(0, 1 - (u / rx) ** 2)); o.beginPath(); o.ellipse(u, v, rx * 0.075 + 0.35, ry * 0.12 + 0.25, 0, 0, TAU); o.fill(); }
    if (R() < 0.35) { o.fillStyle = 'rgba(248,246,226,0.7)'; o.beginPath(); o.ellipse((R() - 0.5) * rx * 0.7, (R() - 0.5) * ry * 0.3, rx * 0.2, ry * 0.36, 0, 0, TAU); o.fill(); }
    o.strokeStyle = U.rgba(pal[1], 0.9); o.lineWidth = 0.45; o.beginPath(); o.ellipse(0, 0, rx, ry, 0, 0, TAU); o.stroke();
    o.restore();
  },
};

// ---------------------------------------------------------------- the plate cache
const PLATES = {};
const PLATE_CACHE = {
  _m: new Map(), used: 0, budget: 24e6,
  // three sizes: journal thumbnails, the lens in the valley, and the specimen table (which zooms in a long way)
  res(x) { const m = x.getTransform(), px = Math.hypot(m.a, m.b) * 280; return px <= 330 ? 384 : px <= 800 ? 896 : 2240; },
  get(name, def, st, res) {
    const fonts = document.fonts && document.fonts.status === 'loaded' ? 1 : 0;
    const key = name + '|' + (def.key ? def.key(st) : '') + '|' + (st.lang || 'tr') + '|' + fonts + '|' + res;
    let c = this._m.get(key);
    if (c) { this._m.delete(key); this._m.set(key, c); return c; }
    c = U.canvas(res, res);
    const o = c.getContext('2d'), s = res / 280;
    o.setTransform(s, 0, 0, s, res / 2, res / 2);
    MX.s = s; const cur0 = MX._cur; MX._cur = name;
    try { def.still(o, st); } catch (e) { if (typeof reportError === 'function') reportError(e); else console.error(e); }
    MX._cur = cur0;
    o.filter = 'none';
    this._m.set(key, c); this.used += res * res;
    for (const [k, v] of this._m) { if (this.used <= this.budget) break; if (v === c) continue; this._m.delete(k); this.used -= v.width * v.height; }
    return c;
  },
  // the specimen table zooms past even the largest sheet (a board at twice the pixel density shows a plate three or
  // four times bigger than 2240 px). Once the view has rested, the part on screen is drawn again at screen sharpness
  // and laid over the sheet. It lives in chart units, so a small pan stays sharp; one such tile at a time
  // only when the sheet would be stretched at least 1.5 times: below that the softness is hard to see, and the redraw
  // (a fraction of a second on a slow board computer) is not worth it
  tile: null, _want: null, TILE_PX: 6e6, TILE_UP: 1.5, TILE_REST: 300,
  sharp(x, name, def, st) {
    const m = x.getTransform(), d = m.a;
    if (d * 280 <= 2240 * this.TILE_UP || Math.abs(m.b) > 1e-6 || Math.abs(m.c) > 1e-6 || !x.canvas) return;
    const key = name + '|' + (def.key ? def.key(st) : '') + '|' + (st.lang || 'tr');
    const inv = m.inverse(), a = inv.transformPoint({ x: 0, y: 0 }), b = inv.transformPoint({ x: x.canvas.width, y: x.canvas.height });
    const x0 = Math.max(-140, Math.min(a.x, b.x)), y0 = Math.max(-140, Math.min(a.y, b.y)), x1 = Math.min(140, Math.max(a.x, b.x)), y1 = Math.min(140, Math.max(a.y, b.y));
    if (x1 - x0 < 1 || y1 - y0 < 1) return;
    const t = this.tile && this.tile.key === key ? this.tile : null;
    if (t && t.dq > d * 0.7) x.drawImage(t.c, t.x0, t.y0, t.x1 - t.x0, t.y1 - t.y0);
    if (t && t.dq >= d * 0.9 && t.x0 <= x0 + 0.5 && t.y0 <= y0 + 0.5 && t.x1 >= x1 - 0.5 && t.y1 >= y1 - 0.5) { this._want = null; return; }
    // wait until the view has stayed put for a moment, so a pinch or a pan never pays for a redraw mid-gesture
    const w = this._want, now = performance.now(), tol = 3 / d;
    if (!w || w.key !== key || Math.abs(w.d / d - 1) > 0.01 || Math.abs(w.x0 - x0) > tol || Math.abs(w.y0 - y0) > tol) { this._want = { key, d, x0, y0, since: now }; return; }
    if (now - w.since < this.TILE_REST) return;
    this._want = null;
    const px = (x1 - x0) * 0.12, py = (y1 - y0) * 0.12;
    const X0 = Math.max(-140, x0 - px), Y0 = Math.max(-140, y0 - py), X1 = Math.min(140, x1 + px), Y1 = Math.min(140, y1 + py);
    const dd = Math.min(d, Math.sqrt(this.TILE_PX / ((X1 - X0) * (Y1 - Y0))));
    const c = U.canvas(Math.ceil((X1 - X0) * dd), Math.ceil((Y1 - Y0) * dd)), o = c.getContext('2d');
    o.setTransform(dd, 0, 0, dd, -X0 * dd, -Y0 * dd);
    o.beginPath(); o.rect(-140, -140, 280, 280); o.clip();
    const s0 = MX.s, cur0 = MX._cur; MX.s = dd; MX._cur = name;
    try { def.still(o, st); } catch (e) { if (typeof reportError === 'function') reportError(e); else console.error(e); }
    MX.s = s0; MX._cur = cur0;
    this.tile = { key, dq: d, x0: X0, y0: Y0, x1: X0 + c.width / dd, y1: Y0 + c.height / dd, c };
    x.drawImage(c, this.tile.x0, this.tile.y0, this.tile.x1 - this.tile.x0, this.tile.y1 - this.tile.y0);
  },
  clear() { this._m.clear(); this.used = 0; this.tile = null; this._want = null; },
};
function plate(name, def) {
  const fn = (x, st) => {
    const c = PLATE_CACHE.get(name, def, st, PLATE_CACHE.res(x));
    x.save(); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(c, -140, -140, 280, 280);
    PLATE_CACHE.sharp(x, name, def, st);
    x.restore();
    if (def.live) { x.save(); def.live(x, st, st.t || 0); x.restore(); }
  };
  fn.def = def; fn.plateName = name;
  PLATES[name] = fn;
}
