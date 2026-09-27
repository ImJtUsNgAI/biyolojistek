'use strict';
// People and animals: looks, behaviour, and hand-inked drawing with line boil.
const PEOPLE = {
  player: [
    { skin: '#E8C39E', hair: '#4A3222', style: 'short', top: '#5E7A4A', pants: '#3E4A5E', pack: '#8A5A3A' },
    { skin: '#C98E62', hair: '#2A1E16', style: 'pony', top: '#3E6C9A', pants: '#4A4038', pack: '#C89B45' },
    { skin: '#F0D2B4', hair: '#B8753A', style: 'curly', top: '#A0443A', pants: '#3E4A5E', pack: '#4F6B3A' },
    { skin: '#9A6A48', hair: '#1A1410', style: 'scarf', scarf: '#6B3E5E', top: '#C8A24E', pants: '#3E3A34', pack: '#5E6E8A' },
  ],
  deniz: { skin: '#EAC7A0', hair: '#6B4A32', style: 'short', cap: '#E0B040', top: '#E8E1D0', stripes: '#3E6C9A', pants: '#5E6E8A', kid: true },
  riza: { skin: '#C99A72', hair: '#9A958C', style: 'short', kasket: '#4A4038', top: '#B59C72', cloak: true, pants: '#4A4038', staff: true, stache: '#8A857C' },
  ayten: { skin: '#E2B894', hair: '#2A1E16', style: 'bun', top: '#F4F2EC', coat: true, pants: '#3E4A5E', steth: true, bag: '#6B3E3E' },
  nazli: { skin: '#D6A47C', hair: '#3A2A1E', style: 'scarf', scarf: '#EDE4CE', top: '#F4F1E8', coat: true, pants: '#6B5440' },
  nebahat: { skin: '#E0B48E', hair: '#EDEAE2', style: 'scarf', scarf: '#8A6AA0', top: '#6B4A5E', pants: '#4A4038', staff: true },
  elder1: { skin: '#D2A77E', hair: '#EDEAE2', style: 'short', kasket: '#5A5048', top: '#5E5A50', pants: '#3E3A34', stache: '#EDEAE2', tea: true },
  yusuf: { skin: '#B98A5E', hair: '#3A3028', style: 'short', kasket: '#3E3A34', top: '#6E5A3A', cloak: true, pants: '#3E3A34', staff: true, stache: '#3A3028' },
  elif: { skin: '#EAC4A0', hair: '#5A3A22', style: 'pony', top: '#C8503A', pants: '#3A4A6A', bag: '#3E6C9A' },
  songul: { skin: '#D8A880', hair: '#3A2A1E', style: 'scarf', scarf: '#3E8A6A', top: '#B8563A', pants: '#4A4038', bag: '#8A6A3A' },
  huseyin: { skin: '#C8966E', hair: '#CFCBC2', style: 'short', kasket: '#6A5A44', top: '#4E5E44', pants: '#3E3A34', stache: '#CFCBC2', staff: true },
  sevim: { skin: '#E0B08A', hair: '#6A4A32', style: 'scarf', scarf: '#B85A6A', top: '#5A7A9A', pants: '#4A4038', bag: '#8A6A3A' },
  osman: { skin: '#C08A60', hair: '#3A3028', style: 'short', kasket: '#5A4A3A', top: '#7A6A4A', pants: '#3E4A5E', stache: '#3A3028' },
  fatma: { skin: '#D8A47E', hair: '#5A4636', style: 'scarf', scarf: '#C8A24E', top: '#6A8A5A', pants: '#4A4038', bag: '#B8763A' },
  zehra: { skin: '#E6BC98', hair: '#4A2E1E', style: 'pony', top: '#DDEBF2', coat: true, pants: '#3E6C9A', steth: true },
  elder2: { skin: '#B98A62', hair: '#DAD6CC', style: 'bald', top: '#7A5A3A', pants: '#3E3A34', stache: '#5A5048', tea: true },
};

const ACT = {
  names: {
    player: { tr: 'Sen', en: 'You' }, deniz: { tr: 'Alp', en: 'Alp' }, riza: { tr: 'Rıza Dede', en: 'Rıza Dede' },
    ayten: { tr: 'Veteriner Ayten', en: 'Ayten the vet' }, sarikiz: { tr: 'Sarıkız', en: 'Sarıkız' }, karabas: { tr: 'Karabaş', en: 'Karabaş' },
    elder1: { tr: 'Hasan Dede', en: 'Grandpa Hasan' }, nazli: { tr: 'Nazlı Teyze', en: 'Nazlı Teyze' }, elder2: { tr: 'Mehmet Dede', en: 'Grandpa Mehmet' }, nebahat: { tr: 'Nebahat Nine', en: 'Grandma Nebahat' },
    yusuf: { tr: 'Çoban Yusuf', en: 'Yusuf the shepherd' }, elif: { tr: 'Elif', en: 'Elif' }, songul: { tr: 'Songül Abla', en: 'Songül' }, huseyin: { tr: 'Hüseyin Usta', en: 'Hüseyin Usta' }, fatma: { tr: 'Fatma Teyze', en: 'Fatma Teyze' }, zehra: { tr: 'Hemşire Zehra', en: 'Nurse Zehra' }, osman: { tr: 'Osman Amca', en: 'Osman Amca' }, sevim: { tr: 'Sevim Hanım', en: 'Sevim' },
  },
  kinds: { sheep: { tr: 'Koyun', en: 'Sheep' }, chicken: { tr: 'Tavuk', en: 'Hen' }, cat: { tr: 'Kedi', en: 'Cat' }, stork: { tr: 'Leylek', en: 'Stork' }, frog: { tr: 'Kurbağa', en: 'Frog' }, owl: { tr: 'Peçeli baykuş', en: 'Barn owl' } },
  label(a) { return this.names[a.id] || this.kinds[a.kind] || { tr: a.id, en: a.id }; },

  // ---------------- behaviour ----------------
  update(a, dt) {
    const S = G.S, p = W.player;
    a.blink -= dt;
    if (a.blink < -0.12) a.blink = 2 + Math.random() * 4;
    if (a.kind === 'stork') { a.hidden = S.season >= 2; if (!a.hidden && Math.random() < dt * 0.05) { a.clatter = 1.2; if (Math.hypot(p.x - a.x, p.y - a.y) < 500) AU.sfx('clatter'); } a.clatter = Math.max(0, (a.clatter || 0) - dt); return; }
    if (a.kind === 'frog') { a.hidden = S.season === 3 || S.pond.oxygen < 35; a.jump = Math.max(0, (a.jump || 0) - dt); if (!a.jump && Math.random() < dt * 0.1) a.jump = 0.6; return; }
    if (a.sit) return;
    if (a.state === 'follow') {
      const c = W.crumbs, idx = Math.max(0, c.length - 7), tgt = c[idx] || [p.x, p.y];
      this._moveTo(a, tgt[0], tgt[1], dt, Math.hypot(p.x - a.x, p.y - a.y) > 70 ? p.speed * 0.95 : 0);
      return;
    }
    if (a.state === 'script') {
      if (!a.route || !a.route.length) { a.state = 'idle'; a.moving = false; const cb = a.onArrive; a.onArrive = null; if (cb) cb(); return; }
      const wp = a.route[0];
      if (this._moveTo(a, wp[0], wp[1], dt, a.speed)) a.route.shift();
      return;
    }
    if (a.state === 'idle') { a.moving = false; return; }
    // wander
    if (a.idle > 0) { a.idle -= dt; a.moving = false; a.anim += dt; return; }
    if (!a.home) return;
    if (this._moveTo(a, a.tx, a.ty, dt, a.speed)) {
      a.idle = 1.5 + Math.random() * (a.kind === 'cow' || a.kind === 'sheep' ? 7 : 4);
      const h = a.home;
      a.tx = h[0] + Math.random() * h[2]; a.ty = h[1] + Math.random() * h[3];
      a.graze = (a.kind === 'cow' || a.kind === 'sheep') && Math.random() < 0.7;
      if (a.kind === 'chicken') a.graze = Math.random() < 0.8;
    }
    const d = Math.hypot(p.x - a.x, p.y - a.y);
    if (a.kind === 'cow' && d < 520 && Math.random() < dt * (a.bloat > 0.5 ? 0.12 : 0.03)) AU.sfx('moo', { v: U.clamp(1 - d / 520, 0.15, 1) });
    if (a.kind === 'sheep' && d < 380 && Math.random() < dt * 0.02) AU.sfx('baa');
    if (a.kind === 'chicken' && d < 300 && Math.random() < dt * 0.03) AU.sfx('cluck');
  },
  _moveTo(a, x, y, dt, speed) {
    const dx = x - a.x, dy = y - a.y, d = Math.hypot(dx, dy);
    if (d < 4 || !speed) { a.moving = false; return d < 4; }
    const s = Math.min(d, speed * dt);
    a.x += (dx / d) * s; a.y += (dy / d) * s;
    a.moving = true; a.graze = false;
    a.phase += dt * (a.kind === 'human' ? 9 : 7);
    if (Math.abs(dx) > 1) a.face = dx < 0 ? -1 : 1;
    a.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
    return false;
  },
  walkTo(a, x, y, cb) {
    a.route = W.findPath(a.x, a.y, x, y) || [[x, y]];
    a.state = 'script';
    a.onArrive = cb;
  },

  // ---------------- drawing ----------------
  draw(ctx, a, t) {
    ctx.save();
    if (a.perch) ctx.globalAlpha = 1 - 0.9 * (WORLD.buildings[0].fade || 0);
    switch (a.kind) {
      case 'human': this.human(ctx, a, t); break;
      case 'cow': this.cow(ctx, a, t); break;
      case 'dog': this.dog(ctx, a, t); break;
      case 'sheep': this.sheep(ctx, a, t); break;
      case 'chicken': this.chicken(ctx, a, t); break;
      case 'cat': this.cat(ctx, a, t); break;
      case 'stork': this.stork(ctx, a, t); break;
      case 'frog': this.frog(ctx, a, t); break;
      case 'owl': this.owl(ctx, a, t); break;
    }
    ctx.restore();
  },
  _ell(ctx, x, y, rx, ry, fill, rot = 0, lw = 1.3) {
    ctx.fillStyle = fill;
    U.ellipse(ctx, x, y, rx, ry, rot); ctx.fill();
    const b = U.boil(Math.round(x + y));
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = lw;
    U.ellipse(ctx, x + (U.hash(b, 1, 3) - 0.5) * 0.7, y + (U.hash(b, 2, 3) - 0.5) * 0.7, rx + (U.hash(b, 3, 3) - 0.5) * 0.6, ry + (U.hash(b, 4, 3) - 0.5) * 0.6, rot); ctx.stroke();
  },
  _shape(ctx, pts, fill, lw = 1.3, closed = true) {
    if (fill) { ctx.fillStyle = fill; ctx.beginPath(); U.path(ctx, pts, closed); ctx.fill(); }
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = lw;
    ctx.beginPath(); U.path(ctx, U.jitter(pts, 0.45, U.boil(pts.length)), closed); ctx.stroke();
  },
  _shadow(ctx, rx, ry = rx * 0.35) { ctx.fillStyle = 'rgba(40,40,30,0.24)'; U.ellipse(ctx, 3, 1, rx, ry); ctx.fill(); },

  human(ctx, a, t) {
    const L = a.look, dir = a.dir || 'down', mv = a.moving, ph = a.phase || 0;
    const k = L.kid ? 0.84 : 1;
    ctx.translate(a.x, a.y);
    ctx.scale(k, k);
    this._shadow(ctx, 12, 4.4);
    const bob = mv ? -Math.abs(Math.sin(ph)) * 1.7 : Math.sin(t * 2 + a.x) * 0.35;
    const side = dir === 'left' || dir === 'right', fx = dir === 'left' ? -1 : 1;
    if (a.sit) {
      ctx.fillStyle = '#6B4A32'; ctx.fillRect(-9, -12, 18, 4); ctx.fillRect(-8, -8, 3, 8); ctx.fillRect(5, -8, 3, 8);
      this._ell(ctx, -4, -13, 4, 3, L.pants); this._ell(ctx, 4, -13, 4, 3, L.pants);
      ctx.translate(0, 8);
    } else {
      const sw = mv ? Math.sin(ph) * 4 : 0;
      if (side) {
        this._ell(ctx, -3 + sw * fx * 0.6, -6, 3.2, 6.5, L.pants);
        this._ell(ctx, 3 - sw * fx * 0.6, -6, 3.2, 6.5, U.shade(L.pants, -0.15));
        this._ell(ctx, -3 + sw * fx * 0.6 + fx * 1.5, -0.5, 3.6, 2, '#3A302A');
        this._ell(ctx, 3 - sw * fx * 0.6 + fx * 1.5, -0.5, 3.6, 2, '#3A302A');
      } else {
        this._ell(ctx, -4, -6 - Math.max(0, sw) * 0.5, 3.4, 6.5, L.pants);
        this._ell(ctx, 4, -6 - Math.max(0, -sw) * 0.5, 3.4, 6.5, L.pants);
        this._ell(ctx, -4, -0.5 - Math.max(0, sw) * 0.5, 3.4, 2, '#3A302A');
        this._ell(ctx, 4, -0.5 - Math.max(0, -sw) * 0.5, 3.4, 2, '#3A302A');
      }
    }
    ctx.translate(0, bob);
    // backpack behind when facing down/side
    if (L.pack && dir !== 'up') { if (side) this._ell(ctx, -fx * 9, -22, 5, 8, L.pack); }
    if (L.staff) { ctx.strokeStyle = '#5E4330'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(13, -46); ctx.quadraticCurveTo(13, -52, 8, -51); ctx.stroke(); }
    // torso
    const tw = L.cloak ? 13 : 10;
    const torso = [[-tw, -30], [tw, -30], [tw - 1, -12], [-tw + 1, -12]];
    if (L.coat) { this._shape(ctx, [[-11, -30], [11, -30], [12, -6], [-12, -6]], L.top); }
    else this._shape(ctx, torso, L.top);
    if (L.stripes) { ctx.strokeStyle = L.stripes; ctx.lineWidth = 2; for (let yy = -27; yy < -13; yy += 5) { ctx.beginPath(); ctx.moveTo(-9, yy); ctx.lineTo(9, yy); ctx.stroke(); } }
    if (L.cloak) { ctx.strokeStyle = 'rgba(80,60,40,0.5)'; ctx.lineWidth = 1; for (let xx = -10; xx <= 10; xx += 5) { ctx.beginPath(); ctx.moveTo(xx, -29); ctx.lineTo(xx * 1.05, -13); ctx.stroke(); } }
    if (L.coat) { ctx.strokeStyle = '#C9C6BC'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -29); ctx.lineTo(0, -7); ctx.stroke(); }
    if (L.steth && dir !== 'up') { ctx.strokeStyle = '#3A3A44'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-5, -30); ctx.quadraticCurveTo(-6, -20, 0, -19); ctx.quadraticCurveTo(6, -20, 5, -30); ctx.stroke(); ctx.fillStyle = '#9AA0A8'; ctx.beginPath(); ctx.arc(0, -18, 2, 0, TAU); ctx.fill(); }
    if (L.pack && dir === 'up') this._ell(ctx, 0, -22, 8, 8, L.pack);
    if (L.pack && dir === 'down') { ctx.strokeStyle = U.shade(L.pack, -0.3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-6, -30); ctx.lineTo(-7, -18); ctx.moveTo(6, -30); ctx.lineTo(7, -18); ctx.stroke(); }
    // arms
    const as = mv ? Math.sin(ph) * 5 : 0;
    if (!a.sit) {
      if (side) this._ell(ctx, fx * 2 - as * fx * 0.5, -21, 3, 7, U.shade(L.top, -0.12), as * 0.04);
      else { this._ell(ctx, -tw - 1.5, -21 + as * 0.3, 3, 7, U.shade(L.top, -0.12)); this._ell(ctx, tw + 1.5, -21 - as * 0.3, 3, 7, U.shade(L.top, -0.12)); }
    } else if (L.tea) {
      this._ell(ctx, 8, -18, 3, 5, U.shade(L.top, -0.12));
      ctx.fillStyle = 'rgba(210,235,240,0.85)'; ctx.fillRect(9, -24, 4, 6); ctx.fillStyle = '#9E3B1E'; ctx.fillRect(9.5, -22, 3, 3.5);
    }
    if (L.bag && !a.sit) { this._ell(ctx, side ? -fx * 4 : 14, -12, 5, 4, L.bag); }
    // head
    const hy = -39;
    this._ell(ctx, 0, hy, 9.5, 9.5, L.skin);
    // hair / hats
    const H = L.hair;
    ctx.fillStyle = H;
    if (L.style === 'scarf') {
      ctx.fillStyle = L.scarf;
      ctx.beginPath(); ctx.arc(0, hy, 11, Math.PI * 0.92, Math.PI * 2.08); ctx.lineTo(8, hy + 12); ctx.lineTo(-8, hy + 12); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 1.2; ctx.stroke();
      if (dir !== 'up') { ctx.fillStyle = L.skin; U.ellipse(ctx, side ? fx * 2 : 0, hy + 1.5, 6.5, 7.2); ctx.fill(); }
    } else if (L.style !== 'bald') {
      if (dir === 'up') { ctx.beginPath(); ctx.arc(0, hy, 9.8, 0, TAU); ctx.fill(); }
      // side view: draw the right-facing cap and mirror it, so the hair stays on top of the head both ways
      else if (side) { ctx.save(); ctx.scale(fx, 1); ctx.beginPath(); ctx.arc(-1.5, hy - 1.5, 9.8, Math.PI * 0.95, Math.PI * 2.05); ctx.fill(); ctx.fillRect(-9, hy - 2, 6, 8); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(0, hy - 1, 9.9, Math.PI * 1.02, Math.PI * 1.98); ctx.fill(); ctx.fillRect(-9.5, hy - 2, 3, 6); ctx.fillRect(6.5, hy - 2, 3, 6); }
      if (L.style === 'curly') for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.arc(-8 + k * 2.7, hy - 8 + Math.sin(k) * 1.2, 2.6, 0, TAU); ctx.fill(); }
      if (L.style === 'pony' && dir !== 'down') { ctx.beginPath(); ctx.ellipse(side ? -fx * 10 : 0, hy + 2, 3, 7, side ? -fx * 0.4 : 0, 0, TAU); ctx.fill(); }
      if (L.style === 'bun') { ctx.beginPath(); ctx.arc(side ? -fx * 7 : 0, hy - 9, 4, 0, TAU); ctx.fill(); }
    } else { ctx.beginPath(); ctx.arc(0, hy + 1, 9.6, Math.PI * 0.05, Math.PI * 0.95); ctx.fill(); }
    if (L.cap) { ctx.fillStyle = L.cap; ctx.beginPath(); ctx.arc(0, hy - 2, 10, Math.PI, 0); ctx.fill(); ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 1.2; ctx.stroke(); if (dir !== 'up') { ctx.beginPath(); ctx.ellipse(side ? fx * 8 : 0, hy - 2, side ? 7 : 9, 2.6, 0, 0, TAU); ctx.fill(); ctx.stroke(); } }
    if (L.kasket) { ctx.fillStyle = L.kasket; ctx.beginPath(); ctx.ellipse(0, hy - 5, 10.5, 5.5, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 1.2; ctx.stroke(); if (dir !== 'up') { ctx.beginPath(); ctx.ellipse(side ? fx * 7 : 0, hy - 4, side ? 6 : 8, 2.2, 0, 0, TAU); ctx.fill(); ctx.stroke(); } }
    // face
    if (dir !== 'up') {
      const blink = a.blink < 0;
      ctx.fillStyle = '#2A2620';
      const ex = side ? [fx * 4.5] : [-3.4, 3.4];
      for (const e of ex) { if (blink) ctx.fillRect(e - 1.3, hy + 1, 2.6, 0.9); else { ctx.beginPath(); ctx.arc(e, hy + 1, 1.25, 0, TAU); ctx.fill(); } }
      ctx.fillStyle = 'rgba(210,110,90,0.35)'; for (const e of (side ? [fx * 3] : [-5.5, 5.5])) { ctx.beginPath(); ctx.arc(e, hy + 4.5, 1.8, 0, TAU); ctx.fill(); }
      if (L.stache) { ctx.fillStyle = L.stache; ctx.beginPath(); ctx.ellipse(side ? fx * 4 : 0, hy + 5, side ? 3.5 : 5, 1.6, 0, 0, TAU); ctx.fill(); }
      else if (!side) { ctx.strokeStyle = 'rgba(60,40,30,0.7)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(0, hy + 4.2, 1.8, 0.2, Math.PI - 0.2); ctx.stroke(); }
      if (side) { ctx.strokeStyle = 'rgba(60,40,30,0.5)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(fx * 9, hy + 1); ctx.lineTo(fx * 10.5, hy + 3); ctx.lineTo(fx * 9, hy + 4); ctx.stroke(); }
    }
    if (a.id === 'player' && G.S && G.S.flags.gotLens && dir === 'down') {
      ctx.strokeStyle = '#8A6A28'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-4, -30); ctx.lineTo(3, -17); ctx.stroke();
      ctx.fillStyle = '#C8A24E'; ctx.beginPath(); ctx.arc(3.5, -15.5, 2.6, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2A2620'; ctx.stroke();
    }
  },

  // cow silhouette in local coordinates (facing left, feet on y=0); shared with the lens X-ray
  cowBody(bloat = 0) {
    const b = bloat * 9;
    return [[-30, -54], [-8, -58], [16, -58 - b * 0.5], [30, -58 - b], [42, -55 - b * 0.4], [49, -44], [46, -30], [36, -22], [10, -20], [-14, -21], [-30, -26], [-37, -40]];
  },
  cowHead(graze = 0) {
    const g = graze * 20;
    return [[-32, -50], [-44, -55 + g * 0.3], [-58, -52 + g * 0.8], [-67, -42 + g], [-66, -34 + g], [-57, -31 + g], [-46, -37 + g * 0.5], [-34, -36]];
  },
  cowLegs(ph, mv) {
    const s = mv ? Math.sin(ph) : 0;
    return [[-27, s * 5], [-17, -s * 5], [29, -s * 5], [39, s * 5]];
  },
  cow(ctx, a, t) {
    const face = a.face || -1, ph = a.phase || 0, mv = a.moving;
    ctx.translate(a.x, a.y);
    this._shadow(ctx, 46, 9);
    ctx.scale(face < 0 ? 1 : -1, 1);
    const base = '#C99A5A', light = '#EAD6AE', dark = '#8C6438';
    const bloat = a.bloat || 0, puff = bloat * (0.85 + Math.sin(t * 2.4) * 0.15);
    const graze = a.graze && !mv ? (0.6 + Math.sin(t * 1.2) * 0.4) : 0;
    // far legs
    const legs = this.cowLegs(ph, mv);
    for (const [lx, sw] of [legs[1], legs[3]]) this._shape(ctx, [[lx - 3, -24], [lx + 3, -24], [lx + 2.5 + sw * 0.4, -3], [lx - 2.5 + sw * 0.4, -3]], dark, 1.1, true);
    // tail
    const ts = Math.sin(t * 2.2 + a.x) * 6;
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(47, -50); ctx.quadraticCurveTo(54 + ts * 0.3, -38, 51 + ts, -22); ctx.stroke();
    ctx.strokeStyle = dark; ctx.lineWidth = 1.2; ctx.stroke();
    this._ell(ctx, 51 + ts, -20, 3, 5, '#5A4028');
    // body
    this._shape(ctx, this.cowBody(puff), base, 1.5);
    ctx.save(); ctx.beginPath(); U.path(ctx, this.cowBody(puff), true); ctx.clip();
    ctx.fillStyle = light; U.ellipse(ctx, -6, -24, 26, 8); ctx.fill(); U.ellipse(ctx, 26, -46, 12, 9, 0.4); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,210,0.25)'; U.ellipse(ctx, 0, -52, 30, 6); ctx.fill();
    ctx.restore();
    // udder
    this._ell(ctx, 24, -20, 7, 4, '#E8B0A0', 0, 1.1);
    // near legs
    for (const [lx, sw] of [legs[0], legs[2]]) {
      this._shape(ctx, [[lx - 3.5, -26], [lx + 3.5, -26], [lx + 3 + sw * 0.5, -3], [lx - 3 + sw * 0.5, -3]], base, 1.2, true);
      this._ell(ctx, lx + sw * 0.5, -2, 4, 2.3, '#3A302A', 0, 1);
    }
    // head
    const hd = this.cowHead(graze);
    this._shape(ctx, hd, base, 1.5);
    const g = graze * 20;
    this._ell(ctx, -63, -38 + g, 5.5, 5, '#E8B0A0', 0, 1.1);
    ctx.fillStyle = '#2A2620'; ctx.beginPath(); ctx.arc(-65, -39 + g, 0.9, 0, TAU); ctx.arc(-62, -36 + g, 0.9, 0, TAU); ctx.fill();
    ctx.fillStyle = light; U.ellipse(ctx, -52, -46 + g * 0.6, 5, 4, -0.3); ctx.fill();
    if (a.blink >= 0) { ctx.fillStyle = '#2A2620'; ctx.beginPath(); ctx.arc(-50, -47 + g * 0.5, 1.6, 0, TAU); ctx.fill(); }
    const ear = Math.sin(t * 3 + a.y) > 0.9 ? -3 : 0;
    this._shape(ctx, [[-40, -52 + g * 0.3], [-33, -57 + ear], [-36, -50 + g * 0.3]], dark, 1.1);
    ctx.strokeStyle = '#E8E0CC'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-45, -55 + g * 0.3); ctx.quadraticCurveTo(-44, -62 + g * 0.3, -39, -63 + g * 0.3); ctx.stroke();
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 0.8; ctx.stroke();
    if (bloat > 0.3) {
      ctx.strokeStyle = 'rgba(160,50,40,0.7)'; ctx.lineWidth = 1.2;
      for (let k = 0; k < 3; k++) { const a0 = -1.2 + k * 0.5; ctx.beginPath(); ctx.arc(30, -54 - bloat * 9, 12 + k * 3 + Math.sin(t * 4) * 1.5, a0, a0 + 0.35); ctx.stroke(); }
    }
    if (a.lead) { ctx.strokeStyle = '#8A5A3A'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-58, -42); ctx.quadraticCurveTo(-72, -20, -80, -26); ctx.stroke(); }
  },
  dogBody() { return [[-18, -26], [4, -28], [18, -26], [22, -19], [18, -12], [-4, -12], [-18, -14]]; },
  dog(ctx, a, t) {
    const face = a.face || -1, ph = a.phase || 0, mv = a.moving;
    ctx.translate(a.x, a.y);
    this._shadow(ctx, 22, 5);
    ctx.scale(face < 0 ? 1 : -1, 1);
    const fawn = '#CDA56B', dark = '#2F2A26';
    const s = mv ? Math.sin(ph) * 4 : 0;
    const lie = !mv && a.idle > 2.5 ? 1 : 0;
    ctx.translate(0, lie * 6);
    for (const [lx, sw] of [[-12, -s], [14, s]]) this._shape(ctx, [[lx - 2, -14], [lx + 2, -14], [lx + 1.5 + sw * 0.4, -1], [lx - 1.5 + sw * 0.4, -1]], U.shade(fawn, -0.15), 1, true);
    const wag = Math.sin(t * (mv ? 10 : 3)) * 3;
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(19, -24); ctx.quadraticCurveTo(28, -34 + wag, 20, -38 + wag); ctx.stroke();
    ctx.strokeStyle = fawn; ctx.lineWidth = 2.2; ctx.stroke();
    this._shape(ctx, this.dogBody(), fawn, 1.3);
    for (const [lx, sw] of [[-16, s], [12, -s]]) { this._shape(ctx, [[lx - 2.2, -14], [lx + 2.2, -14], [lx + 2 + sw * 0.5, -1], [lx - 2 + sw * 0.5, -1]], fawn, 1.1, true); }
    const head = [[-16, -26], [-22, -34], [-30, -34], [-36, -28], [-35, -24], [-26, -21], [-17, -20]];
    this._shape(ctx, head, fawn, 1.3);
    ctx.fillStyle = dark; ctx.beginPath(); U.path(ctx, [[-30, -33], [-36, -28], [-35, -24], [-28, -22], [-26, -28]], true); ctx.fill();
    this._shape(ctx, [[-22, -34], [-19, -28], [-24, -26]], dark, 1);
    ctx.fillStyle = '#F4EEDD'; ctx.beginPath(); ctx.arc(-27, -30, 1.3, 0, TAU); ctx.fill();
    ctx.fillStyle = '#6B5A48'; ctx.fillRect(-20, -26, 5, 3);
    ctx.fillStyle = '#C8C4B8'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(-19 + k * 1.8, -24, 0.8, 0, TAU); ctx.fill(); }
    if (a.bark > 0) { a.bark -= 0.016; ctx.fillStyle = '#2A2620'; ctx.font = '700 9px "Courier Prime", monospace'; ctx.fillText('hav!', -40, -40); }
  },
  sheep(ctx, a, t) {
    const face = a.face || -1, ph = a.phase || 0, mv = a.moving;
    ctx.translate(a.x, a.y);
    this._shadow(ctx, 20, 5);
    ctx.scale(face < 0 ? 1 : -1, 1);
    const s = mv ? Math.sin(ph) * 3 : 0, graze = a.graze && !mv ? 1 : 0;
    for (const [lx, sw] of [[-9, s], [-4, -s], [9, -s], [14, s]]) { ctx.strokeStyle = '#2F2A26'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(lx, -12); ctx.lineTo(lx + sw * 0.4, -1); ctx.stroke(); }
    this._ell(ctx, 17, -15, 6, 5, '#E4DCC8');
    const wool = '#EFEAE0';
    ctx.fillStyle = wool;
    const bumps = [[-10, -20], [-3, -24], [5, -24], [12, -21], [14, -14], [5, -12], [-4, -12], [-11, -14]];
    for (const [bx, by] of bumps) { ctx.beginPath(); ctx.arc(bx, by, 6.5, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 1.1;
    for (const [bx, by] of bumps) { ctx.beginPath(); ctx.arc(bx, by, 6.5, Math.atan2(by + 18, bx - 1) - 1.1, Math.atan2(by + 18, bx - 1) + 1.1); ctx.stroke(); }
    ctx.fillStyle = wool; U.ellipse(ctx, 1, -18, 12, 6); ctx.fill();
    const hy = graze ? -8 : -20;
    this._ell(ctx, -16, hy, 5.5, 4.2, '#3A322C', graze ? 0.6 : 0.2);
    this._ell(ctx, -13, hy - 3, 2.5, 1.5, '#3A322C', 0.8);
    ctx.fillStyle = '#EDE3CC'; ctx.beginPath(); ctx.arc(-18, hy - 1, 0.9, 0, TAU); ctx.fill();
  },
  chicken(ctx, a, t) {
    const face = a.face || -1, mv = a.moving;
    ctx.translate(a.x, a.y);
    this._shadow(ctx, 7, 2.5);
    ctx.scale(face < 0 ? 1 : -1, 1);
    const peck = !mv && a.graze ? Math.max(0, Math.sin(t * 6 + a.x)) * 4 : 0;
    const col = a.id === 'hen1' || a.id === 'hen3' ? '#B7703A' : '#F1ECE0';
    ctx.strokeStyle = '#D08A2A'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-1, -4); ctx.lineTo(-1, 0); ctx.moveTo(2, -4); ctx.lineTo(2, 0); ctx.stroke();
    this._shape(ctx, [[8, -12], [6, -5], [-4, -4], [-7, -9]], col, 1);
    this._ell(ctx, 1, -8, 7, 5, col, 0, 1.1);
    this._ell(ctx, -6, -13 + peck, 3.4, 3.2, col, 0, 1);
    ctx.fillStyle = '#C8342A'; ctx.beginPath(); ctx.arc(-6, -17 + peck, 1.8, 0, TAU); ctx.arc(-4.5, -16.5 + peck, 1.4, 0, TAU); ctx.fill();
    ctx.fillStyle = '#E0A030'; ctx.beginPath(); ctx.moveTo(-9, -13 + peck); ctx.lineTo(-12, -12 + peck); ctx.lineTo(-9, -11 + peck); ctx.fill();
    ctx.fillStyle = '#2A2620'; ctx.beginPath(); ctx.arc(-6.5, -14 + peck, 0.7, 0, TAU); ctx.fill();
  },
  cat(ctx, a, t) {
    const face = a.face || -1, ph = a.phase || 0, mv = a.moving;
    ctx.translate(a.x, a.y);
    this._shadow(ctx, 10, 3);
    ctx.scale(face < 0 ? 1 : -1, 1);
    const s = mv ? Math.sin(ph) * 2.5 : 0;
    for (const lx of [-6, 6]) { ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(lx, -6); ctx.lineTo(lx + s * 0.4, 0); ctx.stroke(); }
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(9, -8); ctx.quadraticCurveTo(16, -12, 14, -20 + Math.sin(t * 2) * 2); ctx.stroke();
    ctx.strokeStyle = '#E09A4A'; ctx.lineWidth = 1.5; ctx.stroke();
    this._ell(ctx, 1, -8, 10, 4.5, '#F2ECE0', 0, 1.1);
    ctx.fillStyle = '#E09A4A'; U.ellipse(ctx, 4, -9, 4, 2.6); ctx.fill(); ctx.fillStyle = '#2A2620'; U.ellipse(ctx, -2, -9.5, 3, 2); ctx.fill();
    this._ell(ctx, -10, -12, 4.5, 4, '#F2ECE0', 0, 1.1);
    ctx.fillStyle = '#E09A4A'; U.ellipse(ctx, -9, -14, 2.4, 1.6); ctx.fill();
    this._shape(ctx, [[-14, -14], [-13, -19], [-11, -15]], '#2A2620', 0.8);
    this._shape(ctx, [[-9, -15], [-7, -19], [-6, -14]], '#E09A4A', 0.8);
    ctx.fillStyle = '#4F7A3A'; ctx.beginPath(); ctx.arc(-12, -12, 0.9, 0, TAU); ctx.fill();
  },
  stork(ctx, a, t) {
    const face = a.face || 1;
    ctx.translate(a.x, a.y);
    ctx.scale(face < 0 ? -1 : 1, 1);
    const c = a.clatter > 0 ? 1 : 0, bob = Math.sin(t * 1.3 + a.x) * 0.8;
    this._shape(ctx, [[-12, -14 + bob], [10, -18 + bob], [16, -12 + bob], [6, -6], [-10, -6]], '#F4F2EA', 1.2);
    ctx.fillStyle = '#2A2620'; ctx.beginPath(); ctx.moveTo(-12, -12 + bob); ctx.lineTo(4, -8); ctx.lineTo(-4, -6); ctx.lineTo(-14, -8); ctx.closePath(); ctx.fill();
    const hx = c ? 12 : 14, hy = c ? -34 : -36;
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 4.2; ctx.beginPath(); ctx.moveTo(10, -16 + bob); ctx.quadraticCurveTo(c ? 6 : 16, -26, hx, hy); ctx.stroke();
    ctx.strokeStyle = '#F4F2EA'; ctx.lineWidth = 2.6; ctx.stroke();
    this._ell(ctx, hx, hy, 3.6, 3, '#F4F2EA', 0, 1);
    ctx.strokeStyle = '#D8442E'; ctx.lineWidth = 2; ctx.beginPath();
    if (c) { const o = Math.sin(t * 30) * 2; ctx.moveTo(hx, hy - 1); ctx.lineTo(hx - 3, hy - 13); ctx.moveTo(hx + 1, hy); ctx.lineTo(hx + 1 + o, hy - 13); }
    else { ctx.moveTo(hx + 3, hy); ctx.lineTo(hx + 15, hy + 4); }
    ctx.stroke();
    ctx.fillStyle = '#2A2620'; ctx.beginPath(); ctx.arc(hx + 1, hy - 1, 0.8, 0, TAU); ctx.fill();
  },
  // the barn owl asleep in the hay-loft door: now and then it opens an eye or turns its heart-shaped face
  owl(ctx, a, t) {
    ctx.translate(a.x, a.y);
    const bob = Math.sin(t * 0.9 + a.x) * 0.4, look = Math.sin(t * 0.21 + a.x) > 0.9, peek = Math.sin(t * 0.63 + 1) > 0.96;
    this._shape(ctx, [[-8, -1], [-9.5, -13], [-7, -21 + bob], [7, -21 + bob], [9.5, -13], [8, -1], [0, 1]], '#D6B072', 1.1);
    ctx.fillStyle = '#F6F0E4'; U.ellipse(ctx, 0, -9, 5.4, 7.4); ctx.fill();
    ctx.fillStyle = 'rgba(120,120,120,0.35)'; for (const s of [-1, 1]) { U.ellipse(ctx, s * 7, -13, 2.2, 6, s * 0.2); ctx.fill(); }
    ctx.fillStyle = 'rgba(60,50,40,0.6)'; for (let k = 0; k < 6; k++) ctx.fillRect(-3 + (k % 3) * 3, -12 + Math.floor(k / 3) * 5, 0.9, 0.9);
    ctx.save(); ctx.translate(0, -26 + bob); if (look) ctx.scale(0.7, 1);
    this._ell(ctx, 0, 0, 7.8, 7.2, '#D6B072', 0, 1);
    ctx.fillStyle = '#FBF8F0'; ctx.beginPath(); ctx.moveTo(0, -4.5); ctx.bezierCurveTo(-3, -8, -8, -5, -6.6, 0); ctx.bezierCurveTo(-5.6, 4, -2, 6, 0, 7);
    ctx.bezierCurveTo(2, 6, 5.6, 4, 6.6, 0); ctx.bezierCurveTo(8, -5, 3, -8, 0, -4.5); ctx.fill();
    ctx.strokeStyle = '#8A6436'; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.strokeStyle = '#2A2620'; ctx.lineWidth = 0.9;
    for (const s of [-1, 1]) {
      if (peek) { ctx.fillStyle = '#140E0A'; ctx.beginPath(); ctx.arc(s * 2.8, -0.5, 1.4, 0, TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.moveTo(s * 1.6, -0.6); ctx.quadraticCurveTo(s * 2.8, 0.6, s * 4, -0.6); ctx.stroke(); }
    }
    ctx.fillStyle = '#E2CFA8'; ctx.beginPath(); ctx.moveTo(-0.9, 1); ctx.lineTo(0.9, 1); ctx.lineTo(0, 3.4); ctx.closePath(); ctx.fill();
    ctx.restore();
  },
  frog(ctx, a, t) {
    const j = a.jump > 0 ? Math.sin((0.6 - a.jump) / 0.6 * Math.PI) * 10 : 0;
    ctx.translate(a.x, a.y);
    this._shadow(ctx, 6, 2);
    ctx.translate(0, -j);
    this._ell(ctx, 0, -4, 6.5, 4.2, '#6E8F3E', 0, 1);
    ctx.fillStyle = '#4B6A2C'; ctx.beginPath(); ctx.arc(-2, -5, 1.2, 0, TAU); ctx.arc(2, -3, 1, 0, TAU); ctx.fill();
    this._ell(ctx, -3, -8, 2, 2, '#8FB05A', 0, 0.8); this._ell(ctx, 3, -8, 2, 2, '#8FB05A', 0, 0.8);
    ctx.fillStyle = '#2A2620'; ctx.beginPath(); ctx.arc(-3, -8.3, 0.8, 0, TAU); ctx.arc(3, -8.3, 0.8, 0, TAU); ctx.fill();
  },

  // ---------------- portraits for dialogue ----------------
  portrait(cv, who) {
    const x = cv.getContext('2d'), w = cv.width, h = cv.height;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, w, h);
    x.fillStyle = '#E6DCC4'; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(160,140,100,0.25)'; x.beginPath(); x.arc(w / 2, h * 0.62, w * 0.42, 0, TAU); x.fill();
    const k = w / 120;
    const fake = { id: who, x: 0, y: 0, dir: 'down', phase: 0, moving: false, blink: 1, face: -1, anim: 0, graze: false };
    if (typeof who === 'number') fake.look = PEOPLE.player[who];
    else if (who === 'player') fake.look = W.player ? W.player.look : PEOPLE.player[0];
    else if (PEOPLE[who]) fake.look = PEOPLE[who];
    x.save();
    if (fake.look) { x.translate(w / 2, h * 1.18); x.scale(2.7 * k, 2.7 * k); fake.kind = 'human'; this.human(x, fake, 0); }
    else if (who === 'sarikiz') { x.translate(w * 0.85, h * 1.2); x.scale(1.9 * k, 1.9 * k); this.cow(x, Object.assign(fake, { bloat: 0 }), 0); }
    else if (who === 'karabas') { x.translate(w * 0.62, h * 1.02); x.scale(3 * k, 3 * k); this.dog(x, fake, 0); }
    else if (who === 'nebahat') {
      x.translate(w / 2, h * 1.18); x.scale(2.7 * k, 2.7 * k);
      this.human(x, Object.assign(fake, { look: { skin: '#E4BE9A', hair: '#CFC8BA', style: 'bun', top: '#5E6E8A', pants: '#3E3A34' } }), 0);
      x.strokeStyle = '#2A2620'; x.lineWidth = 0.9; x.beginPath(); x.arc(-3.4, -38, 2.4, 0, TAU); x.arc(3.4, -38, 2.4, 0, TAU); x.moveTo(-1, -38); x.lineTo(1, -38); x.stroke();
    }
    x.restore();
    x.strokeStyle = '#2A2620'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, h - 2);
  },
};
