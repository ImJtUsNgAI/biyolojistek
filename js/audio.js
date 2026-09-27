'use strict';
// Procedural audio: no sound files. Kaval (end-blown flute) and bağlama (plucked, Karplus-Strong)
// play in makam Hüseyni with real microtonal intervals; darbuka for the rumen ride; synthesized ambience.
const AU = {
  ctx: null, ok: false, vol: { music: 0.55, sfx: 0.8 },
  mode: 'none', _timer: null, _next: 0, _ks: {}, _amb: null, _deg: 4, _phrase: 0, _bar: 0,

  // Hüseyni on A: segah is a comma flat, eviç sits between F and F#
  cents: [0, 180, 294, 498, 702, 882, 996, 1200, 1380, 1494, 1698, 1902],
  f(deg, base = 440) { const o = Math.floor(deg / 7), d = ((deg % 7) + 7) % 7; return base * Math.pow(2, (this.cents[d] + 1200 * o) / 1200); },

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    let c; try { c = new AC({ latencyHint: 'playback' }); } catch (e) { c = new AC(); }
    this.ctx = c;
    this.master = c.createGain(); this.master.gain.value = 0.8; this.master.connect(c.destination);
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 6; comp.attack.value = 0.002; comp.release.value = 0.2; comp.connect(this.master);
    this.bus = comp;
    this.mus = c.createGain(); this.sfxG = c.createGain(); this.ambG = c.createGain();
    this.mus.connect(comp); this.sfxG.connect(comp); this.ambG.connect(comp);
    // small room reverb from a generated impulse
    const len = Math.floor(c.sampleRate * 1.4), ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    this.rev = c.createConvolver(); this.rev.buffer = ir;
    this.revG = c.createGain(); this.revG.gain.value = 0.32;
    this.rev.connect(this.revG); this.revG.connect(comp);
    this.mus.connect(this.rev);
    const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noiseBuf = nb;
    this.ok = true;
    this.setVol();
    this._startAmb();
  },
  unlock() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  setVol() {
    if (!this.ok) return;
    this.mus.gain.value = this.vol.music * 0.55;
    this.sfxG.gain.value = this.vol.sfx;
    this.ambG.gain.value = this.vol.sfx * 0.9;
  },
  _noise(t, dur, filt, fq, q, gain, dest, att = 0.005) {
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = filt; f.frequency.value = fq; f.Q.value = q;
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + att); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || this.sfxG);
    s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    return f;
  },
  _tone(t, type, f0, f1, dur, gain, dest, att = 0.005) {
    const c = this.ctx, o = c.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + att); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(dest || this.sfxG); o.start(t); o.stop(t + dur + 0.05);
    return o;
  },

  // ---------- Karplus-Strong bağlama ----------
  _ksBuf(f) {
    const key = Math.round(f * 10);
    if (this._ks[key]) return this._ks[key];
    const c = this.ctx, sr = c.sampleRate, len = Math.floor(sr * 2.2), N = Math.max(2, Math.round(sr / f));
    const buf = c.createBuffer(1, len, sr), d = buf.getChannelData(0), ring = new Float32Array(N);
    let prev = 0;
    for (let i = 0; i < N; i++) { const r = Math.random() * 2 - 1; ring[i] = 0.55 * r + 0.45 * prev; prev = ring[i]; }
    let idx = 0;
    for (let i = 0; i < len; i++) {
      const a = ring[idx], b = ring[(idx + 1) % N];
      const v = 0.4985 * (a + b);
      d[i] = a + 0.18 * Math.tanh(a * 3); // a touch of metallic buzz
      ring[idx] = v; idx = (idx + 1) % N;
    }
    this._ks[key] = buf;
    return buf;
  },
  pluck(t, f, vel = 0.5, pan = 0, dest) {
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this._ksBuf(f);
    const g = c.createGain(); g.gain.setValueAtTime(vel, t); g.gain.setValueAtTime(vel, t + 1.9); g.gain.linearRampToValueAtTime(0, t + 2.15);
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    s.connect(g);
    if (p) { p.pan.value = pan; g.connect(p); p.connect(dest || this.mus); } else g.connect(dest || this.mus);
    s.start(t);
  },

  // ---------- kaval ----------
  kaval(t, f, dur, vel = 0.16, fromF = 0) {
    const c = this.ctx, o = c.createOscillator(), o2 = c.createOscillator();
    o.type = 'sine'; o2.type = 'triangle';
    if (fromF) { o.frequency.setValueAtTime(fromF, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.07); o2.frequency.setValueAtTime(fromF, t); o2.frequency.exponentialRampToValueAtTime(f, t + 0.07); }
    else { o.frequency.setValueAtTime(f, t); o2.frequency.setValueAtTime(f, t); }
    const g = c.createGain(), g2 = c.createGain();
    const a = Math.min(0.1, dur * 0.3);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + a);
    g.gain.setValueAtTime(vel * 0.92, Math.max(t + a, t + dur - 0.14)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    g2.gain.value = 0.22;
    if (dur > 0.35) {
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 5.3;
      lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.011, t + Math.min(dur, 0.7));
      lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency); lfo.start(t); lfo.stop(t + dur + 0.1);
    }
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(this.mus);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    // breath
    const bf = this._noise(t, dur, 'bandpass', f * 2, 3, vel * 0.22, this.mus, a);
    bf.frequency.value = f * 2.02;
  },
  drum(t, kind, vel = 0.6) {
    if (kind === 'dum') { this._tone(t, 'sine', 120, 55, 0.32, vel, this.mus); this._noise(t, 0.08, 'lowpass', 400, 1, vel * 0.4, this.mus); }
    else if (kind === 'tek') { this._noise(t, 0.07, 'highpass', 2600, 1, vel * 0.55, this.mus); this._tone(t, 'sine', 980, 900, 0.05, vel * 0.25, this.mus); }
    else this._noise(t, 0.04, 'bandpass', 3800, 2, vel * 0.3, this.mus);
  },

  // ---------- music scheduler ----------
  music(mode) {
    if (!this.ok || mode === this.mode) return;
    this.mode = mode;
    clearInterval(this._timer);
    this._next = this.ctx.currentTime + 0.3;
    this._bar = 0; this._phrase = 0; this._deg = 4;
    if (mode === 'none') return;
    this._timer = setInterval(() => this._tick(), 60);
  },
  _tick() {
    const c = this.ctx;
    while (this._next < c.currentTime + 0.5) {
      if (this.mode === 'ride') this._rideBar(); else this._phrase_();
    }
  },
  // free-rhythm uzun hava: phrases wander around the güçlü (E) and settle on the karar (A)
  _phrase_() {
    const t0 = this._next, r = Math.random;
    const lowBase = 110;
    // drone strum: open strings A and E
    this.pluck(t0, lowBase, 0.22, -0.3);
    this.pluck(t0 + 0.09, lowBase * 1.5, 0.16, -0.2);
    this.pluck(t0 + 0.18, lowBase * 2, 0.12, -0.1);
    let t = t0 + 0.6, deg = this._deg, prevF = 0;
    const notes = 3 + Math.floor(r() * 5);
    const high = this._phrase % 4 < 2;
    for (let i = 0; i < notes; i++) {
      const step = r() < 0.72 ? (r() < 0.5 ? -1 : 1) : (r() < 0.5 ? -2 : 2);
      deg = U.clamp(deg + step + (high && deg < 5 ? 1 : 0) - (!high && deg > 5 ? 1 : 0), 0, 10);
      const f = this.f(deg);
      if (r() < 0.35) { const gf = this.f(deg + 1); this.kaval(t, gf, 0.12, 0.1, prevF); t += 0.1; prevF = gf; }
      const dur = r() < 0.4 ? 0.28 + r() * 0.3 : 0.9 + r() * 1.6;
      this.kaval(t, f, dur, 0.13 + r() * 0.05, prevF);
      if (r() < 0.25) this.pluck(t, f / 2, 0.14, 0.3);
      prevF = f; t += dur * 0.97;
    }
    // cadence
    const end = this._phrase % 3 === 2 ? 0 : 4;
    const ef = this.f(end);
    this.kaval(t, this.f(end + 1), 0.16, 0.11, prevF);
    this.kaval(t + 0.15, ef, 2.2 + r(), 0.14, this.f(end + 1));
    this.pluck(t + 0.15, ef / 2, 0.16, 0.25);
    this._deg = end === 0 ? 4 : 5;
    this._phrase++;
    this._next = t + 3.6 + r() * 3;
  },
  // 9/8 karşılama (2+2+2+3) for the ride
  _rideBar() {
    const t0 = this._next, e = 0.135, r = Math.random;
    const pat = ['dum', 0, 'tek', 0, 'dum', 0, 'tek', 'ka', 'tek'];
    pat.forEach((k, i) => { if (k) this.drum(t0 + i * e, k, k === 'dum' ? 0.55 : 0.4); });
    const motif = this._bar % 4 === 3 ? [4, 3, 2, 1, 0, 1, 2, 1, 0] : [0, 2, 4, 2, 3, 4, 5, 4, 2];
    motif.forEach((d, i) => { if (i % 2 === 0 || r() < 0.6) this.pluck(t0 + i * e, this.f(d, 220), 0.2, 0.2); });
    if (this._bar % 2 === 0) {
      let tt = t0, pf = 0;
      for (let i = 0; i < 4; i++) { const f = this.f(4 + Math.floor(r() * 5)); const d = e * (i === 3 ? 3 : 2); this.kaval(tt, f, d * 0.95, 0.1, pf); pf = f; tt += d; }
    }
    this._bar++;
    this._next = t0 + e * 9;
  },

  // ---------- sound effects ----------
  sfx(name, o = {}) {
    if (!this.ok) return;
    const c = this.ctx, t = c.currentTime + 0.01, r = Math.random;
    switch (name) {
      case 'click': this._tone(t, 'triangle', 1400, 900, 0.05, 0.12); break;
      case 'hover': this._tone(t, 'sine', 1800, 1700, 0.03, 0.04); break;
      case 'page': { const f = this._noise(t, 0.32, 'bandpass', 900, 0.8, 0.22); f.frequency.linearRampToValueAtTime(3200, t + 0.25); break; }
      case 'pen': for (let i = 0; i < 4; i++) this._noise(t + i * 0.07 + r() * 0.02, 0.05, 'highpass', 3500 + r() * 2000, 1, 0.07); break;
      case 'stamp': this._tone(t, 'sine', 140, 48, 0.22, 0.55); this._noise(t, 0.09, 'lowpass', 900, 1, 0.5); this._noise(t + 0.01, 0.03, 'highpass', 3000, 1, 0.12); break;
      case 'beep': this._tone(t, 'square', o.f || 1500, o.f || 1500, 0.035, 0.05); break;
      case 'pop': this._tone(t, 'sine', 520, 980, 0.07, 0.16); break;
      case 'chime': [0, 2, 4, 7].forEach((d, i) => this.pluck(t + i * 0.09, this.f(d, 440), 0.35, 0, this.sfxG)); break;
      case 'success': [0, 4, 7].forEach((d, i) => this.pluck(t + i * 0.12, this.f(d, 440), 0.4, 0, this.sfxG)); this.kaval(t + 0.36, this.f(7), 0.8, 0.12); break;
      case 'wrong': this.pluck(t, this.f(1, 220), 0.35, 0, this.sfxG); this.pluck(t + 0.16, this.f(0, 220) * 0.94, 0.3, 0, this.sfxG); break;
      case 'moo': {
        const o1 = c.createOscillator(); o1.type = 'sawtooth';
        o1.frequency.setValueAtTime(128, t); o1.frequency.linearRampToValueAtTime(150, t + 0.35); o1.frequency.linearRampToValueAtTime(96, t + 1.25);
        const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.setValueAtTime(420, t); f1.frequency.linearRampToValueAtTime(760, t + 0.4); f1.frequency.linearRampToValueAtTime(380, t + 1.2); f1.Q.value = 3;
        const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5 * (o.v || 1), t + 0.15); g.gain.linearRampToValueAtTime(0.35 * (o.v || 1), t + 1.0); g.gain.linearRampToValueAtTime(0, t + 1.35);
        o1.connect(f1); f1.connect(g); g.connect(this.sfxG); o1.start(t); o1.stop(t + 1.4);
        break;
      }
      case 'bark': for (let i = 0; i < 2; i++) { const tt = t + i * 0.22; this._tone(tt, 'sawtooth', 520, 260, 0.12, 0.18); this._noise(tt, 0.1, 'bandpass', 900, 2, 0.25); } break;
      case 'baa': {
        const o1 = c.createOscillator(); o1.type = 'sawtooth'; o1.frequency.setValueAtTime(360, t); o1.frequency.linearRampToValueAtTime(330, t + 0.6);
        const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 13; lg.gain.value = 0.2; lfo.connect(lg);
        const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.14, t + 0.05); g.gain.linearRampToValueAtTime(0, t + 0.65);
        lg.connect(g.gain);
        const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 1100; f1.Q.value = 2;
        o1.connect(f1); f1.connect(g); g.connect(this.sfxG); o1.start(t); lfo.start(t); o1.stop(t + 0.7); lfo.stop(t + 0.7);
        break;
      }
      case 'cluck': for (let i = 0; i < 3; i++) this._tone(t + i * 0.09, 'square', 700 + r() * 200, 500, 0.05, 0.05); break;
      case 'clatter': for (let i = 0; i < 14; i++) this._noise(t + i * 0.045, 0.025, 'bandpass', 1800, 4, 0.18); break;
      case 'bubble': this._tone(t, 'sine', 300 + r() * 200, 900 + r() * 400, 0.08, 0.1); break;
      case 'splash': this._noise(t, 0.5, 'lowpass', 1400, 0.7, 0.3); break;
      case 'whoosh': { const f = this._noise(t, 0.6, 'bandpass', 300, 1, 0.3, null, 0.2); f.frequency.linearRampToValueAtTime(2400, t + 0.5); break; }
      case 'chew': for (let i = 0; i < 3; i++) this._noise(t + i * 0.11, 0.07, 'bandpass', 1400 + r() * 800, 1.5, 0.25); break;
      case 'gulp': this._tone(t, 'sine', 260, 90, 0.25, 0.3); break;
      case 'thump': this._tone(t, 'sine', 120, 60, 0.09, 0.4); this._noise(t, 0.06, 'lowpass', 260, 1, 0.3); break;
      case 'hit': this._tone(t, 'square', 180, 70, 0.18, 0.12); this._noise(t, 0.12, 'lowpass', 700, 1, 0.3); break;
      case 'collect': this.pluck(t, this.f(4 + Math.floor(r() * 4), 440), 0.35, 0, this.sfxG); break;
      case 'step': this._noise(t, 0.05, 'lowpass', 500, 1, 0.05); break;
      case 'lens': this._tone(t, 'sine', 700, 1200, 0.12, 0.08); this._noise(t, 0.12, 'bandpass', 5000, 3, 0.05); break;
      case 'zoom': this._tone(t, 'sine', 900 + (o.up ? 300 : -200), 1100 + (o.up ? 400 : -300), 0.08, 0.06); break;
      case 'dig': for (let i = 0; i < 3; i++) this._noise(t + i * 0.18, 0.14, 'lowpass', 600, 1, 0.3); break;
      case 'sleep': [7, 4, 2, 0].forEach((d, i) => this.pluck(t + i * 0.25, this.f(d, 440), 0.3, 0, this.sfxG)); break;
    }
  },

  // ---------- ambience ----------
  _startAmb() {
    const c = this.ctx;
    const mk = (type, fq, q) => {
      const s = c.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true;
      const f = c.createBiquadFilter(); f.type = type; f.frequency.value = fq; f.Q.value = q;
      const g = c.createGain(); g.gain.value = 0;
      s.connect(f); f.connect(g); g.connect(this.ambG); s.start();
      return { f, g };
    };
    const wind = mk('lowpass', 420, 0.5), water = mk('bandpass', 1300, 0.6), rain = mk('highpass', 2600, 0.3);
    const b1 = c.createOscillator(), b2 = c.createOscillator(); b1.type = b2.type = 'sawtooth'; b1.frequency.value = 196; b2.frequency.value = 203;
    const bf = c.createBiquadFilter(); bf.type = 'lowpass'; bf.frequency.value = 800;
    const bg = c.createGain(); bg.gain.value = 0;
    b1.connect(bf); b2.connect(bf); bf.connect(bg); bg.connect(this.ambG); b1.start(); b2.start();
    this._amb = { wind, water, rain, bees: bg, birdT: 0 };
  },
  amb(p) {
    if (!this.ok || !this._amb) return;
    const c = this.ctx, t = c.currentTime, a = this._amb;
    if (t < (a.upd || 0)) return; // automation only 5x a second: per-frame events starve weak audio threads
    a.upd = t + 0.2;
    const wv = (p.indoor ? 0.012 : 0.04) + 0.02 * Math.sin(t * 0.23) + (p.season === 3 ? 0.03 : 0);
    a.wind.g.gain.setTargetAtTime(wv, t, 0.5);
    a.wind.f.frequency.setTargetAtTime(380 + 160 * Math.sin(t * 0.17), t, 0.5);
    a.water.g.gain.setTargetAtTime(p.water * 0.09, t, 0.3);
    a.bees.gain.setTargetAtTime(p.bees * 0.035 * (1 - (p.rain || 0)), t, 0.3);
    a.rain.g.gain.setTargetAtTime((p.rain || 0) * (p.indoor ? 0.025 : 0.07), t, 0.6);
    if (!p.indoor && p.season !== 3 && (p.rain || 0) < 0.3 && t > a.birdT) {
      a.birdT = t + 1.2 + Math.random() * (5 - 3 * p.life);
      this._bird(t + 0.05, Math.random() * 1.6 - 0.8);
    }
  },
  _bird(t, pan) {
    const c = this.ctx, n = 2 + Math.floor(Math.random() * 5), base = 2200 + Math.random() * 1800;
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    const g = c.createGain(); g.gain.value = 0.05;
    if (p) { p.pan.value = pan; g.connect(p); p.connect(this.ambG); } else g.connect(this.ambG);
    for (let i = 0; i < n; i++) {
      const tt = t + i * (0.08 + Math.random() * 0.07), o = c.createOscillator(), og = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(base * (0.9 + Math.random() * 0.3), tt);
      o.frequency.exponentialRampToValueAtTime(base * (1.1 + Math.random() * 0.5), tt + 0.06);
      og.gain.setValueAtTime(0, tt); og.gain.linearRampToValueAtTime(1, tt + 0.01); og.gain.exponentialRampToValueAtTime(0.001, tt + 0.08);
      o.connect(og); og.connect(g); o.start(tt); o.stop(tt + 0.1);
    }
  },
};
