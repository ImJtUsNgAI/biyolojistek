'use strict';
// Step test at the yayla hut: step up and down a wooden box in time with the metronome (up, up, down, down) while
// a clip on the finger reads the pulse and the oxygen in the blood. Tap on every beat; miss too many and the test
// does not count, because everyone must get exactly the same test.
const STEP = {
  BEATS: 16, LEAD: 4, BEAT: 0.625, REC: 4, HIT: 0.2,
  WHO: {
    elif: { name: tr('Elif', 'Elif'), note: tr('dün geldi', 'arrived yesterday'), rest: 88, peak: 158, after: 132, spo2: 91, low: 86, br: [20, 34] },
    yusuf: { name: tr('Yusuf Amca', 'Uncle Yusuf'), note: tr('üç aydır yaylada', 'three months up here'), rest: 64, peak: 124, after: 86, spo2: 94, low: 92, br: [14, 24] },
    me: { name: tr('Sen', 'You'), note: tr('bugün geldin', 'arrived today'), rest: 84, peak: 150, after: 124, spo2: 92, low: 87, br: [18, 32] },
  },
  // Elif's school record: the same test at sea level in İzmir
  SEA: { rest: 72, peak: 128, after: 98, spo2: 98, low: 97, br: [14, 26] },
  COL: { sea: '#6E9AB8', elif: '#C8503A', me: '#8A6AA0', yusuf: '#5E7A3A' },

  open() {
    const S = G.S;
    this.st = { who: 'elif', phase: 'idle', t: 0, taps: [], hits: new Set(), pose: 0, hr: this.WHO.elif.rest, sp: this.WHO.elif.spo2, run: null, curve: [], msg: null, auto: false };
    this.runs = S.stepRuns || (S.stepRuns = []);
    const body = h('div', 'kit rig ferm steptest');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Kim test ediliyor?', 'Who is being tested?'))}</label>
        <div class="seg st-who">${Object.keys(this.WHO).map(k => `<button data-w="${k}">${U.esc(L(this.WHO[k].name))}</button>`).join('')}</div>
        <p class="fm-const">${L(tr('Herkese aynı test: 40 cm’lik basamak, dakikada 96 vuruşluk metronom (yukarı, yukarı, aşağı, aşağı), aynı süre. Her vuruşta ADIM’a bas.', 'The same test for everyone: a 40 cm step, a metronome at 96 beats a minute (up, up, down, down), the same length of time. Press STEP on every beat.'))}</p>
        <button class="big run">${L(tr('Başla ▶', 'Start ▶'))}</button>
        <button class="big stepbtn" disabled>${L(tr('ADIM ⬆', 'STEP ⬆'))}</button>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div><canvas class="rig-chart" width="360" height="170"></canvas></div>
      <p class="kit-msg">${L(tr('İpucu: önce Elif’i dene. Karnesindeki İzmir sonucu tabloda hazır.', 'Tip: try Elif first. The İzmir result from her report is already in the table.'))}</p>`;
    body.querySelectorAll('.st-who button').forEach(b => b.onclick = () => this.pick(b.dataset.w));
    body.querySelector('.run').onclick = () => this.start();
    const stepBtn = body.querySelector('.stepbtn');
    stepBtn.addEventListener('pointerdown', e => { e.preventDefault(); this.tap(); });
    this.body = body; this.cv = body.querySelector('canvas');
    this.cv.addEventListener('pointerdown', () => { if (this.st.phase === 'step' || this.st.phase === 'lead') this.tap(); });
    this._key = e => {
      if (!this.pn || !(e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp')) return;
      if (this.st.phase === 'step' || this.st.phase === 'lead') { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) this.tap(); }
    };
    window.addEventListener('keydown', this._key, true);
    this.pn = UI.panel({ title: tr('Yayla evi · Basamak testi', 'Yayla hut · Step test'), code: 'BİY.11.2.7', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._sync(); this.table(); this.loop();
  },
  pick(w) {
    const st = this.st;
    if (st.phase !== 'idle' && st.phase !== 'done') return;
    st.who = w; st.phase = 'idle'; st.hr = this.WHO[w].rest; st.sp = this.WHO[w].spo2; st.curve = []; st.pose = 0;
    AU.sfx('click'); this._sync();
  },
  start() {
    const st = this.st;
    if (st.phase !== 'idle' && st.phase !== 'done') return;
    const P = this.WHO[st.who], R = MX.rng(Math.floor(Math.random() * 1e6)), n = s => Math.round((R() - 0.5) * 2 * s);
    st.run = { who: st.who, rest: P.rest + n(2), peak: P.peak + n(3), after: P.after + n(3), spo2: P.spo2 + n(1), low: P.low + n(1), br: [P.br[0] + n(1), P.br[1] + n(2)] };
    st.phase = 'lead'; st.t = 0; st.taps = []; st.hits = new Set(); st.pose = 0; st.curve = []; st.beatSeen = -1;
    AU.sfx('click'); this._sync();
  },
  // the clock of the test: lead-in clicks, 16 stepping beats, then a speeded-up minute of recovery
  get stepStart() { return this.LEAD * this.BEAT; },
  get stepEnd() { return (this.LEAD + this.BEATS) * this.BEAT; },
  tap() {
    const st = this.st;
    if (st.phase !== 'step' && st.phase !== 'lead') return;
    const t = st.t + (performance.now() - (this._clock || performance.now())) / 1000;
    st.taps.push(t);
    const k = Math.round((t - this.stepStart) / this.BEAT);
    if (k >= 0 && k < this.BEATS && Math.abs(t - (this.stepStart + k * this.BEAT)) <= this.HIT && !st.hits.has(k)) { st.hits.add(k); st.pose = (k + 1) % 4; AU.sfx('click'); }
  },
  step(dt) {
    const st = this.st;
    this._clock = performance.now();
    if (st.phase === 'idle' || st.phase === 'done') return;
    const t0 = st.t; st.t += dt;
    const run = st.run, b = Math.floor(st.t / this.BEAT);
    if (b !== st.beatSeen && st.t < this.stepEnd) { st.beatSeen = b; AU.sfx('beep', { f: b < this.LEAD ? 1000 : 1500 }); }
    if (st.auto && st.phase === 'step') { const k = Math.floor((st.t - this.stepStart) / this.BEAT + 1e-9), tb = this.stepStart + k * this.BEAT; if (tb > t0 - 1e-9 && tb <= st.t && k < this.BEATS && !st.hits.has(k)) { st.hits.add(k); st.taps.push(tb); st.pose = (k + 1) % 4; } }
    if (st.phase === 'lead') { st.hr = run.rest; st.sp = run.spo2; if (st.t >= this.stepStart - this.HIT) st.phase = 'step'; }
    if (st.phase === 'step') {
      const u = U.clamp((st.t - this.stepStart) / (this.stepEnd - this.stepStart), 0, 1);
      st.hr = run.rest + (run.peak - run.rest) * (1 - Math.exp(-3.2 * u)) / (1 - Math.exp(-3.2));
      st.sp = run.spo2 + (run.low - run.spo2) * u;
      if (st.t >= this.stepEnd) { st.phase = 'rec'; st.pose = 0; }
    }
    if (st.phase === 'rec') {
      const u = U.clamp((st.t - this.stepEnd) / this.REC, 0, 1);
      st.hr = run.peak + (run.after - run.peak) * (1 - Math.exp(-3 * u)) / (1 - Math.exp(-3));
      st.sp = run.low + (run.spo2 - run.low) * Math.min(1, u * 1.6);
      if (u >= 1) this.finish();
    }
    if (st.phase !== 'done') st.curve.push([st.t, st.hr]);
  },
  finish() {
    const st = this.st, run = st.run;
    run.acc = st.hits.size / this.BEATS; run.valid = run.acc >= 0.7;
    st.phase = 'done'; st.hr = run.after; st.sp = run.spo2;
    this.runs.push(run);
    st.msg = run.valid ? null : tr(`Ritim tutmadı (${st.hits.size}/${this.BEATS} vuruş): bu test sayılmaz. Herkese aynı hızda uygulamalıyız, yeniden dene!`, `The rhythm slipped (${st.hits.size}/${this.BEATS} beats): this test doesn’t count. Everyone must step at the same pace; try again!`);
    AU.sfx(run.valid ? 'pen' : 'click');
    this._sync(); this.table(); G.save();
  },
  loop() {
    let last = performance.now();
    const tick = now => {
      if (!this.pn || this.pn.closed) return;
      this.step(U.clamp((now - last) / 1000, 0, 0.05)); last = now;
      this.draw();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
  _sync() {
    const st = this.st, busy = st.phase !== 'idle' && st.phase !== 'done';
    this.body.querySelectorAll('.st-who button').forEach(b => { b.classList.toggle('on', b.dataset.w === st.who); b.disabled = busy; });
    this.body.querySelector('.run').disabled = busy;
    this.body.querySelector('.stepbtn').disabled = !busy;
  },
  best(w) { const r = this.runs.filter(x => x.who === w && x.valid); return r[r.length - 1] || null; },
  analyse() {
    const o = { elif: this.best('elif'), yusuf: this.best('yusuf'), me: this.best('me') };
    o.fair = !!(o.elif && o.yusuf && o.me);
    return o;
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, W = this.WHO;
    const row = (name, place, r, cls) => `<tr class="${cls || ''}"><td>${U.esc(L(name))}</td><td>${U.esc(L(place))}</td><td><b>${r.rest} → ${r.peak} → ${r.after}</b></td><td>%${r.spo2} → %${r.low}</td><td>${r.br[0]} → ${r.br[1]}</td></tr>`;
    const up = tr('Yayla · 2200 m', 'Yayla · 2200 m');
    let rows = row(tr('Elif (karne)', 'Elif (report)'), tr('İzmir · 0 m', 'İzmir · 0 m'), this.SEA, 'st-rec');
    for (const k of ['elif', 'me', 'yusuf']) if (a[k]) rows += row(W[k].name, up, a[k]);
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Kim', 'Who'))}</th><th>${L(tr('Yer', 'Where'))}</th><th>${L(tr('Nabız: dinlenme → test → 1 dk', 'Pulse: rest → test → 1 min'))}</th><th>SpO₂</th><th>${L(tr('Solunum /dk', 'Breaths /min'))}</th></tr>${rows}</table>`;
    body.querySelector('.stamps').innerHTML = [
      [a.elif, W.elif.name], [a.yusuf, W.yusuf.name], [a.me, W.me.name], [a.fair, tr('Adil test', 'Fair test')],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const bars = [['sea', tr('E·İzmir', 'E·İzmir'), this.SEA]].concat(['elif', 'me', 'yusuf'].filter(k => a[k]).map(k => [k, k === 'elif' ? tr('Elif', 'Elif') : k === 'me' ? tr('Sen', 'You') : tr('Yusuf', 'Yusuf'), a[k]]));
    UI._chart(body.querySelector('.rig-chart'), { values: bars.map(b => b[2].peak), labels: bars.map(b => b[1]), colors: bars.map(b => this.COL[b[0]]), unit: tr('test sonrası nabız', 'pulse after the test') });
    let msg = this.st.msg;
    if (a.fair && !S.flags.stepDone) {
      S.flags.stepDone = true;
      S.journal.exps.push({ title: tr('Yaylada basamak testi', 'Step test on the yayla'), code: 'BİY.11.2.7', t: Date.now(),
        head: [tr('Kim', 'Who'), tr('Yer', 'Where'), tr('Nabız', 'Pulse'), 'SpO₂', tr('Solunum', 'Breaths')],
        rows: [[tr('Elif (karne)', 'Elif (report)'), 'İzmir · 0 m', `${this.SEA.rest} → ${this.SEA.peak} → ${this.SEA.after}`, `%${this.SEA.spo2}`, `${this.SEA.br[0]} → ${this.SEA.br[1]}`]]
          .concat(['elif', 'me', 'yusuf'].map(k => [W[k].name, up, `${a[k].rest} → ${a[k].peak} → ${a[k].after}`, `%${a[k].spo2} → %${a[k].low}`, `${a[k].br[0]} → ${a[k].br[1]}`])),
        chart: { values: bars.map(b => b[2].peak), labels: bars.map(b => b[1]), colors: bars.map(b => this.COL[b[0]]), unit: tr('test sonrası nabız', 'pulse after the test') },
        stamps: [{ t: tr('Aynı basamak', 'Same step'), ok: true }, { t: tr('Aynı ritim', 'Same rhythm'), ok: true }, { t: tr('Aynı süre', 'Same time'), ok: true }],
        note: tr('Yaylada Elif’in kanındaki oksijen (SpO₂) İzmir’dekinden düşük; nabzı ve solunumu daha hızlı, toparlanması yavaş. Yusuf Amca aynı yükseklikte daha az zorlanıyor: vücudu aylar içinde uyum sağlamış.', 'On the yayla Elif’s blood oxygen (SpO₂) is lower than in İzmir; her pulse and breathing are faster and she recovers slowly. Uncle Yusuf struggles less at the same height: his body has adapted over the months.') });
      msg = tr('Üç kişi, aynı test! Sonuçlar defterinde.', 'Three people, the same test! The results are in your journal.');
      if (Q.at('yayla', 'test')) { UI.stamp(L(tr('ADİL TEST', 'FAIR TEST'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
    if (msg) body.querySelector('.kit-msg').textContent = L(msg);
  },
  async close() {
    this.pn = null;
    window.removeEventListener('keydown', this._key, true);
    if (Q.at('yayla', 'test') && G.S.flags.stepDone) {
      await ask('altitude_why');
      await UI.say('player', tr('Demek hava “incelmiyor”: basıncı düşüyor. Peki Yusuf Amca neden hiç yorulmuyor? Kan masasındaki örneklere bakmalıyım.', 'So the air doesn’t get “thin”: its pressure drops. But why doesn’t Uncle Yusuf get tired? I should look at the samples on the blood table.'));
      Q.adv('yayla');
    }
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    const R = MX.rng(33);
    // sky, far snowy ridges, the high meadow
    b.fillStyle = MX.lin(b, 0, 0, 0, 180, [[0, '#8FB8D8'], [1, '#D8E6EE']]); b.fillRect(0, 0, 460, 300);
    const ridge = (y0, amp, col, snow) => {
      const pts = [[0, 300]]; for (let x = 0; x <= 460; x += 10) pts.push([x, y0 - Math.abs(Math.sin(x * 0.019 + y0)) * amp - U.fbm(x * 0.03, y0, 3, 3) * amp * 0.6]); pts.push([460, 300]);
      b.fillStyle = col; b.beginPath(); U.poly(b, pts, true); b.fill();
      if (snow) { b.save(); b.beginPath(); U.poly(b, pts, true); b.clip(); b.fillStyle = 'rgba(250,252,255,0.85)'; for (let x = 0; x < 460; x += 3) { const top = pts[1 + Math.round(x / 10)] ? pts[1 + Math.round(x / 10)][1] : y0; b.fillRect(x, top, 3, 8 + U.hash(x, 1, 3) * 10); } b.restore(); }
    };
    ridge(120, 60, '#8A96A8', true); ridge(150, 34, '#6E8058', false);
    b.fillStyle = MX.lin(b, 0, 160, 0, 300, [[0, '#8EA656'], [1, '#6E8A42']]); b.fillRect(0, 170, 460, 130);
    for (let k = 0; k < 260; k++) { const x = R() * 460, y = 172 + R() * 128; b.strokeStyle = R() < 0.5 ? '#5E7A36' : '#A8BC6A'; b.lineWidth = 0.7; b.beginPath(); b.moveTo(x, y); b.lineTo(x + (R() - 0.5) * 3, y - 3 - R() * 4); b.stroke(); }
    for (let k = 0; k < 40; k++) { b.fillStyle = ['#3E5AA8', '#E8C84E', '#D86A8A', '#F4F2EA'][k % 4]; b.beginPath(); b.arc(R() * 460, 180 + R() * 110, 1.2, 0, TAU); b.fill(); }
    // the stone wall of the hut on the left, with its door
    b.fillStyle = '#A89C86'; b.fillRect(0, 60, 70, 180);
    for (let y = 60; y < 240; y += 12) for (let x = ((y / 12) % 2) * 10 - 10; x < 70; x += 20) { b.strokeStyle = 'rgba(60,50,40,0.45)'; b.lineWidth = 0.6; b.strokeRect(x, y, 20, 12); }
    b.fillStyle = '#4A3A2A'; b.fillRect(16, 130, 36, 110); b.fillStyle = '#6E7A4A'; b.fillRect(-4, 52, 80, 12);
    b.fillStyle = '#6E5A3A'; b.fillRect(76, 232, 384, 6);
    this._bc = c; return c;
  },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // the wooden step
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(186, 234, 90, 5);
    x.fillStyle = '#A07848'; x.fillRect(180, 200, 90, 34); x.fillStyle = '#C8986A'; x.fillRect(180, 196, 90, 6);
    x.strokeStyle = '#4A3420'; x.lineWidth = 0.9; x.strokeRect(180, 196, 90, 38);
    for (let k = 0; k < 3; k++) { x.strokeStyle = 'rgba(70,50,30,0.4)'; x.beginPath(); x.moveTo(184, 206 + k * 9); x.lineTo(266, 206 + k * 9); x.stroke(); }
    this._person(x);
    this._metronome(x);
    this._oxi(x);
    this._graph(x);
    this._lane(x);
  },
  // the person stepping: feet follow the taps (up, up, down, down)
  _person(x) {
    const st = this.st, look = st.who === 'me' ? W.player.look : PEOPLE[st.who];
    const pose = st.pose, floor = 234, box = 196;
    st.pp = st.pp || [0, 0]; const tgt = [pose === 1 || pose === 2 ? 1 : 0, pose === 2 || pose === 3 ? 1 : 0];
    for (let i = 0; i < 2; i++) st.pp[i] += (tgt[i] - st.pp[i]) * 0.35;
    const foot = i => { const u = st.pp[i]; return [150 + i * 10 + u * (60 + i * 8), floor + (box - floor) * u - Math.sin(u * Math.PI) * 10]; };
    const f0 = foot(0), f1 = foot(1), hipX = (f0[0] + f1[0]) / 2 - 2, hipY = Math.min(f0[1], f1[1]) - 44 + Math.abs(f0[1] - f1[1]) * 0.35;
    x.fillStyle = 'rgba(0,0,0,0.18)'; x.beginPath(); x.ellipse(hipX + 4, floor + 2, 22, 3, 0, 0, TAU); x.fill();
    for (const [fx, fy] of [f1, f0]) {
      const kx = (hipX + fx) / 2 + 9, ky = (hipY + fy) / 2 - 2;
      x.strokeStyle = look.pants || '#3E4A5E'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(hipX, hipY); x.lineTo(kx, ky); x.lineTo(fx, fy - 3); x.stroke();
      x.fillStyle = '#3A2A1E'; x.beginPath(); x.ellipse(fx + 3, fy - 1, 6, 3, 0, 0, TAU); x.fill();
    }
    const sway = Math.sin(st.t * Math.PI / this.BEAT) * (st.phase === 'step' ? 4 : 0);
    x.strokeStyle = look.top || '#5E7A4A'; x.lineWidth = 16; x.beginPath(); x.moveTo(hipX, hipY + 2); x.lineTo(hipX + 3, hipY - 34); x.stroke();
    x.strokeStyle = look.skin; x.lineWidth = 4.5;
    for (const s of [-1, 1]) { x.beginPath(); x.moveTo(hipX + 3, hipY - 30); x.lineTo(hipX + 3 + s * sway + 4, hipY - 14); x.lineTo(hipX + 3 + s * sway * 1.6 + 7, hipY - 4); x.stroke(); }
    const hx = hipX + 4, hy = hipY - 48;
    x.fillStyle = look.skin; x.beginPath(); x.arc(hx, hy, 10, 0, TAU); x.fill();
    if (look.style === 'scarf') { x.fillStyle = look.scarf; x.beginPath(); x.arc(hx, hy - 1, 11.5, Math.PI * 0.95, Math.PI * 2.05); x.fill(); }
    else if (look.style !== 'bald') { x.fillStyle = look.hair; x.beginPath(); x.arc(hx, hy - 2, 10.5, Math.PI * 1.05, Math.PI * 1.95); x.fill(); if (look.style === 'long' || look.style === 'pony') { x.beginPath(); x.ellipse(hx - 8, hy + 4, 3.5, 9, 0.2, 0, TAU); x.fill(); } }
    if (look.kasket) { x.fillStyle = look.kasket; x.beginPath(); x.ellipse(hx, hy - 7, 11, 5, 0, Math.PI, 0); x.fill(); x.fillRect(hx, hy - 8, 12, 2.5); }
    x.fillStyle = '#1B1A17'; x.beginPath(); x.arc(hx + 4, hy - 1, 1.1, 0, TAU); x.fill();
    // breath puffs in the cold air once the pulse is up
    if (st.hr > 110) { const k = (st.t * 1.4) % 1; x.fillStyle = `rgba(250,252,255,${(0.5 * (1 - k)).toFixed(2)})`; x.beginPath(); x.arc(hx + 14 + k * 12, hy + 2 - k * 4, 3 + k * 5, 0, TAU); x.fill(); }
    // the clip on the finger and its lead up to the meter
    x.strokeStyle = 'rgba(40,40,40,0.6)'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(hipX + 10, hipY - 4); x.quadraticCurveTo(300, 150, 332, 96); x.stroke();
    x.fillStyle = '#2E6AA0'; x.fillRect(hipX + 7, hipY - 7, 7, 5);
  },
  _metronome(x) {
    const st = this.st, cx = 412, cy = 206, on = st.phase === 'lead' || st.phase === 'step';
    x.fillStyle = '#6E4A2E'; x.beginPath(); x.moveTo(cx - 20, cy + 26); x.lineTo(cx - 9, cy - 34); x.lineTo(cx + 9, cy - 34); x.lineTo(cx + 20, cy + 26); x.closePath(); x.fill();
    x.strokeStyle = '#2A1E14'; x.lineWidth = 0.9; x.stroke();
    x.fillStyle = '#F4EEDD'; x.fillRect(cx - 7, cy - 26, 14, 40);
    const ph = on ? Math.cos(st.t / this.BEAT * Math.PI) : 0, a = ph * 0.5;
    x.strokeStyle = '#2A2620'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(cx, cy + 16); x.lineTo(cx + Math.sin(a) * 40, cy + 16 - Math.cos(a) * 40); x.stroke();
    x.fillStyle = '#C8A24E'; x.fillRect(cx + Math.sin(a) * 28 - 3, cy + 16 - Math.cos(a) * 28 - 2, 6, 4);
    const flash = on && (st.t % this.BEAT) < 0.1;
    x.fillStyle = flash ? '#E84A3A' : '#5A2A22'; x.beginPath(); x.arc(cx, cy + 22, 3, 0, TAU); x.fill();
    x.fillStyle = '#1B1A17'; x.font = '700 7px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText('96', cx, cy + 36);
    if (st.phase === 'lead') { const n = this.LEAD - Math.floor(st.t / this.BEAT); x.fillStyle = 'rgba(27,26,23,0.8)'; x.font = '700 40px "Courier Prime", monospace'; x.fillText(n > 0 ? String(n) : '↑', 230, 120); }
  },
  // the pulse oximeter: pulse, oxygen and a beating trace
  _oxi(x) {
    const st = this.st, X = 320, Y = 14;
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(X + 3, Y + 3, 126, 82);
    x.fillStyle = '#E8E6DE'; x.fillRect(X, Y, 126, 82); x.strokeStyle = '#2A2620'; x.lineWidth = 1; x.strokeRect(X, Y, 126, 82);
    x.fillStyle = '#12201C'; x.fillRect(X + 6, Y + 6, 114, 58);
    const hr = Math.round(st.hr), sp = Math.round(st.sp), low = sp < 90;
    x.fillStyle = '#6AE08A'; x.font = '700 9px "Courier Prime", monospace'; x.textAlign = 'left'; x.fillText('♥ /dk', X + 10, Y + 17); x.fillText('SpO₂ %', X + 70, Y + 17);
    x.font = '700 24px "Courier Prime", monospace'; x.fillText(String(hr), X + 10, Y + 42);
    x.fillStyle = low ? '#F0B040' : '#6AD0F0'; x.fillText(String(sp), X + 70, Y + 42);
    // a pleth wave scrolling with the pulse
    x.strokeStyle = '#6AE08A'; x.lineWidth = 0.9; x.beginPath();
    for (let i = 0; i <= 100; i++) { const tt = st.t - (100 - i) * 0.02, ph = (tt * st.hr / 60) % 1, v = ph < 0.15 ? Math.sin(ph / 0.15 * Math.PI / 2) : Math.exp(-(ph - 0.15) * 4) * (1 + 0.15 * Math.sin((ph - 0.15) * 30)); const px = X + 12 + i * 1.02, py = Y + 60 - v * 12; if (i) x.lineTo(px, py); else x.moveTo(px, py); }
    x.stroke();
    x.fillStyle = '#2A2620'; x.font = '700 7px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(L(this.WHO[st.who].name).toUpperCase() + ' · ' + L(this.WHO[st.who].note), X + 63, Y + 76);
  },
  // the pulse over the test so far, with the rest, stepping and recovery phases shaded
  _graph(x) {
    const st = this.st, X = 84, Y = 14, Wd = 220, Hd = 64, T = this.stepEnd + this.REC;
    x.fillStyle = 'rgba(244,238,221,0.92)'; x.fillRect(X, Y, Wd, Hd); x.strokeStyle = '#2A2620'; x.lineWidth = 0.8; x.strokeRect(X, Y, Wd, Hd);
    const sx = t => X + t / T * Wd, sy = v => Y + Hd - (v - 50) / 130 * Hd;
    x.fillStyle = 'rgba(200,80,58,0.12)'; x.fillRect(sx(this.stepStart), Y, sx(this.stepEnd) - sx(this.stepStart), Hd);
    x.fillStyle = '#6A6458'; x.font = '600 6.5px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'center';
    x.fillText(L(tr('dinlenme', 'rest')), (X + sx(this.stepStart)) / 2, Y + Hd - 3); x.fillText(L(tr('basamak', 'stepping')), (sx(this.stepStart) + sx(this.stepEnd)) / 2, Y + Hd - 3); x.fillText(L(tr('1 dakika', '1 minute')), (sx(this.stepEnd) + X + Wd) / 2, Y + Hd - 3);
    x.strokeStyle = 'rgba(60,90,120,0.2)'; for (const v of [60, 100, 140, 180]) { x.beginPath(); x.moveTo(X, sy(v)); x.lineTo(X + Wd, sy(v)); x.stroke(); x.fillStyle = '#6A6458'; x.textAlign = 'left'; x.fillText(String(v), X + 2, sy(v) - 1); }
    if (st.curve.length > 1) { x.strokeStyle = this.COL[st.who]; x.lineWidth = 1.6; x.beginPath(); st.curve.forEach(([t, v], i) => i ? x.lineTo(sx(t), sy(v)) : x.moveTo(sx(t), sy(v))); x.stroke(); }
  },
  // the rhythm lane: beat marks slide in from the right; tap as each one crosses the line
  _lane(x) {
    const st = this.st, Y = 252, X0 = 90, speed = 90;
    x.fillStyle = 'rgba(27,26,23,0.78)'; x.fillRect(0, Y, 460, 44);
    x.strokeStyle = '#F4EEDD'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(X0, Y + 4); x.lineTo(X0, Y + 40); x.stroke();
    x.fillStyle = '#F4EEDD'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'left';
    if (st.phase === 'idle' || st.phase === 'done') {
      const txt = st.phase === 'done' && st.run ? (st.run.valid ? tr(`Ritim: ${st.hits.size}/${this.BEATS} ✓`, `Rhythm: ${st.hits.size}/${this.BEATS} ✓`) : tr(`Ritim: ${st.hits.size}/${this.BEATS}: geçersiz`, `Rhythm: ${st.hits.size}/${this.BEATS}: not valid`)) : tr('Başla’ya bas; dört tık sayılır, sonra her vuruşta ADIM!', 'Press Start; four clicks count you in, then STEP on every beat!');
      x.fillText(L(txt), X0 + 10, Y + 25); return;
    }
    for (let k = 0; k < this.BEATS; k++) {
      const tb = this.stepStart + k * this.BEAT, px = X0 + (tb - st.t) * speed;
      if (px < -10 || px > 470) continue;
      const hit = st.hits.has(k), past = st.t > tb + this.HIT;
      x.fillStyle = hit ? '#6AE08A' : past ? '#E84A3A' : '#F4EEDD';
      x.beginPath(); x.arc(px, Y + 22, 9, 0, TAU); x.fill();
      x.fillStyle = '#1B1A17'; x.font = '700 10px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(k % 4 < 2 ? '↑' : '↓', px, Y + 26);
    }
  },
};
