'use strict';
// Blood-pressure bench in the village clinic. The digital monitor's batteries are dead on screening day, so it is
// done the old way, by ear. Squeeze the bulb until the cuff presses the arm's artery shut and the pulse falls silent,
// then open the valve a little. At the first tapping sound the heart's push just beats the cuff: that is the big
// number (systolic). When the taps fade away, blood flows smoothly again: the small number (diastolic). Let the air
// out too fast and the needle jumps past the answer between two heartbeats. Three villagers, each within 6 mmHg.
const BP = {
  WHO: [
    { id: 'deniz', sys: 108, dia: 68, hr: 84 },
    { id: 'nazli', sys: 128, dia: 84, hr: 74 },
    { id: 'elder1', sys: 164, dia: 98, hr: 66 },
  ],
  TOL: 6,
  PUMP: 60,          // mmHg a second while the bulb is squeezed
  LEAK: 0.4,         // the old cuff leaks a little even with the valve shut
  GOOD: 4,           // mmHg a second: slow enough to read between beats
  rate(v = this.st.valve) { return 1 + 15 * v; },

  open() {
    const S = G.S;
    const run = S.bp || (S.bp = { done: {}, log: [] });
    this.st = { run, t: 0, who: this.WHO.findIndex(p => !run.done[p.id]), P: 0, peak: 0, pumping: false, valve: 0.2, beat: 0, sound: 0, sounds: 0, jig: 0, phase: 'ready', marks: { sys: null, dia: null }, trace: [], tr: 0, rates: [], pumpT: 0 };
    if (this.st.who < 0) this.st.who = 0;
    const body = h('div', 'kit rig ferm bp');
    body.innerHTML = `<div class="rig-top"><canvas width="920" height="600"></canvas>
      <div class="kit-ctrl">
        <label>${L(tr('Sıradaki', 'Next in line'))}</label>
        <div class="bp-who">${this.WHO.map((p, i) => `<button data-i="${i}">${U.esc(L(ACT.names[p.id]))}</button>`).join('')}</div>
        <button class="bp-pump">${L(tr('Pompala (basılı tut)', 'Pump (hold)'))} ●</button>
        <label>${L(tr('Vana', 'Valve'))} · <span class="bp-rate"></span></label>
        <input type="range" class="bp-valve" min="0" max="100" value="20">
        <div class="bp-mk"><button class="bp-sys">${L(tr('İlk ses', 'First sound'))} ♪</button><button class="bp-dia">${L(tr('Son ses', 'Last sound'))} ♪</button></div>
        <p class="fm-const">${L(tr('Hasta beş dakikadır oturuyor, konuşmuyor; kolu kalp hizasında, manşon dirseğin iki parmak üstünde.', 'The patient has sat quietly for five minutes; the arm rests at heart level, the cuff two fingers above the elbow.'))}</p>
      </div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div>
      <p class="kit-msg"></p>`;
    const hold = (el, on, off) => {
      el.addEventListener('pointerdown', e => { e.preventDefault(); on(); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) el.addEventListener(ev, off);
    };
    hold(body.querySelector('.bp-pump'), () => this.pumpOn(), () => this.pumpOff());
    body.querySelector('.bp-valve').oninput = e => this.setValve(e.target.value / 100);
    body.querySelector('.bp-sys').onclick = () => this.mark('sys');
    body.querySelector('.bp-dia').onclick = () => this.mark('dia');
    body.querySelectorAll('.bp-who button').forEach(b => b.onclick = () => this.pick(+b.dataset.i));
    this.body = body; this.cv = body.querySelector('canvas');
    // space squeezes the bulb; captured so it doesn't walk the player about
    this._key = e => {
      if (!this.pn || e.code !== 'Space') return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.type === 'keydown' && !e.repeat) this.pumpOn(); else if (e.type === 'keyup') this.pumpOff();
    };
    window.addEventListener('keydown', this._key, true); window.addEventListener('keyup', this._key, true);
    this.pn = UI.panel({ title: tr('Tansiyon aleti · Kulakla ölçmek', 'Blood-pressure cuff · Measuring by ear'), code: 'BİY.11.2.6', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    this._msg(this.hint()); this._sync(); this.table(); this.loop();
  },
  who() { return this.WHO[this.st.who]; },
  hint() {
    const st = this.st;
    if (st.phase === 'ready') return tr(`${L(ACT.names[this.who().id])}. Pompayı basılı tut: manşonu nabız sesi tamamen kaybolana kadar şişir.`, `${L(ACT.names[this.who().id])}. Hold the pump: inflate the cuff until the pulse sound is completely gone.`);
    if (st.phase === 'pump') return tr('Şişiyor… Sesler kesildikten sonra 20–30 mmHg daha.', 'Inflating… 20–30 mmHg more once the sounds have stopped.');
    return st.marks.sys == null ? tr('Hava yavaşça çıkıyor. İlk “tık” sesini duyunca “İlk ses”e bas.', 'The air is going out slowly. Press “First sound” at the first tap you hear.') : tr('Sesler sürüyor… Kesildikleri anda “Son ses”e bas.', 'The taps go on… Press “Last sound” the moment they stop.');
  },
  reset() {
    const st = this.st;
    Object.assign(st, { P: 0, peak: 0, pumping: false, phase: 'ready', marks: { sys: null, dia: null }, trace: [], rates: [], sound: 0 });
    this._msg(this.hint()); this._sync();
  },
  pick(i) {
    const st = this.st;
    if (!this.WHO[i] || i === st.who) return;
    if (st.phase !== 'ready' && st.P > 20) { this._msg(tr('Önce manşonun havasını boşalt: ölçüm yarıda kaldı.', 'Let the air out of the cuff first: this reading isn’t finished.')); return; }
    st.who = i; AU.sfx('click'); this.reset();
  },
  pumpOn() {
    const st = this.st;
    if (st.phase === 'release' && (st.marks.sys != null || st.P < st.peak - 10)) { st.marks = { sys: null, dia: null }; st.trace = []; st.rates = []; this._msg(tr('Yeniden şişirdin: ölçüm baştan başlıyor.', 'You pumped again: the reading starts over.')); }
    st.pumping = true; st.phase = 'pump'; this._sync();
  },
  pumpOff() {
    const st = this.st;
    if (!st.pumping) return;
    st.pumping = false;
    if (st.P > 20) { st.phase = 'release'; this._msg(this.hint()); } else st.phase = 'ready';
    this._sync();
  },
  setValve(v) { this.st.valve = U.clamp(v, 0, 1); this._sync(); },
  mark(kind) {
    const st = this.st;
    if (st.phase !== 'release') { this._msg(tr('Önce manşonu şişir, sonra vanayı açıp dinle.', 'Inflate the cuff first, then open the valve and listen.')); return; }
    if (kind === 'dia' && st.marks.sys == null) { this._msg(tr('Önce ilk sesi işaretle.', 'Mark the first sound first.')); return; }
    if (st.marks[kind] != null) return;
    st.marks[kind] = Math.round(st.P / 2) * 2; AU.sfx('pen');
    if (kind === 'sys') this._msg(tr(`İlk ses: ${st.marks.sys} mmHg. Dinlemeye devam…`, `First sound: ${st.marks.sys} mmHg. Keep listening…`));
    else this.finish();
  },
  // one heartbeat: the cuff squeezes the artery shut above systolic; between the two pressures the artery snaps
  // open at each beat and the rushing blood taps against the stethoscope; below diastolic it stays open and quiet
  onBeat() {
    const st = this.st, p = this.who();
    st.jig = 1;
    if (st.phase !== 'ready' && st.P < p.sys && st.P > p.dia) { st.sound = 1; st.sounds++; AU.sfx('thump'); st.trace.push([st.t, st.P, 1]); }
  },
  step(dt) {
    const st = this.st;
    st.t += dt;
    if (st.pumping) { st.P = Math.min(300, st.P + this.PUMP * dt); st.peak = Math.max(st.peak, st.P); st.pumpT += dt; if (st.pumpT > 0.3) { st.pumpT = 0; AU.sfx('step'); } }
    else if (st.phase === 'release') { const r = this.rate() + this.LEAK; st.P = Math.max(0, st.P - r * dt); st.rates.push(r); }
    st.beat += dt;
    const period = 60 / this.who().hr;
    if (st.beat >= period) { st.beat -= period; this.onBeat(); }
    st.sound = Math.max(0, st.sound - dt * 5); st.jig = Math.max(0, st.jig - dt * 6);
    st.tr += dt; if (st.tr > 0.05 && st.phase !== 'ready') { st.tr = 0; st.trace.push([st.t, st.P, 0]); if (st.trace.length > 900) st.trace.splice(0, st.trace.length - 900); }
    if (st.phase === 'release' && st.P <= 20) this.finish();
  },
  // read the result against the patient's real pressures, and say why a reading went wrong
  finish() {
    const st = this.st, p = this.who(), m = st.marks, run = st.run;
    const rate = st.rates.length ? st.rates.reduce((a, b) => a + b, 0) / st.rates.length : this.rate();
    const eS = m.sys == null ? null : m.sys - p.sys, eD = m.dia == null ? null : m.dia - p.dia;
    let why = null;
    if (st.peak < p.sys + 4) why = 'low';
    else if (m.sys == null || m.dia == null) why = 'miss';
    // too fast a deflation is refused even when it happens to land close: at that speed the reading is luck
    else if (rate > this.GOOD + 2) why = 'fast';
    else if (Math.abs(eS) > this.TOL || Math.abs(eD) > this.TOL) why = eS > this.TOL ? 'early' : eS < -this.TOL ? 'late' : eD > this.TOL ? 'diaEarly' : 'diaLate';
    const ok = !why, name = L(ACT.names[p.id]);
    run.log.push({ who: p.id, sys: m.sys, dia: m.dia, rate: Math.round(rate * 10) / 10, ok, why });
    const period = 60 / p.hr, drop = Math.round(rate * period);
    const slower = rate > this.GOOD ? tr(` Vanayı biraz kıs: iki atım arasında ibre ${drop} mmHg düşüyor.`, ` Close the valve a little: the needle falls ${drop} mmHg between two beats.`) : tr('', '');
    const say = {
      low: tr('Manşonu yeterince şişirmedin: sesler en baştan vardı, yani ilk sesi çoktan kaçırmıştın. Seslerin kaybolduğu yerin 20–30 mmHg üstüne çık.', 'You didn’t inflate the cuff enough: the taps were there from the start, so the first one was already gone. Go 20–30 mmHg above where the sounds disappear.'),
      miss: tr('Manşon boşaldı ama iki işaret de yok. İlk sesi ve son sesi işaretlemelisin.', 'The cuff emptied, but the marks are missing. You need to mark the first sound and the last.'),
      fast: tr(`Vana çok açıktı: saniyede ${Math.round(rate)} mmHg. İki kalp atışı arasında ibre ${drop} mmHg düşüyor; bu hızda doğru sayıyı ancak şans eseri yakalarsın. Saniyede 2–3 mmHg yeter.`, `The valve was too open: ${Math.round(rate)} mmHg a second. The needle falls ${drop} mmHg between two heartbeats; at that speed you only hit the right number by luck. 2–3 mmHg a second is enough.`),
      early: tr('İlk sesi duymadan işaretledin: büyük tansiyonu yüksek okudun.', 'You marked before hearing the first tap: the big number came out too high.'),
      late: tr('İlk sesi geç işaretledin: büyük tansiyonu düşük okudun.', 'You marked the first tap late: the big number came out too low.'),
      diaEarly: tr('Sesler bitmeden “son ses” dedin: küçük tansiyonu yüksek okudun.', 'You called “last sound” while the taps were still going: the small number came out too high.'),
      diaLate: tr('Son sesten sonra çok bekledin: küçük tansiyonu düşük okudun.', 'You waited too long after the last tap: the small number came out too low.'),
    };
    if (why && why !== 'fast' && why !== 'low' && why !== 'miss') say[why] = tr(say[why].tr + slower.tr, say[why].en + slower.en);
    if (ok) {
      run.done[p.id] = [m.sys, m.dia]; AU.sfx('success');
      this._msg(tr(`${name}: ${m.sys}/${m.dia} mmHg · ${L(this.grade(m.sys, m.dia))}.`, `${name}: ${m.sys}/${m.dia} mmHg · ${L(this.grade(m.sys, m.dia))}.`));
      const next = this.WHO.findIndex(q => !run.done[q.id]);
      st.phase = 'ready'; st.P = 0; st.pumping = false; st.marks = { sys: null, dia: null }; st.rates = [];
      if (next >= 0) st.who = next;
    } else {
      AU.sfx('wrong'); this._msg(say[why]);
      st.phase = 'ready'; st.P = 0; st.pumping = false; st.marks = { sys: null, dia: null }; st.rates = [];
    }
    this._sync(); this.table(); G.save();
  },
  grade(s, d) { return s >= 140 || d >= 90 ? tr('yüksek', 'high') : s >= 120 || d >= 80 ? tr('sınırda', 'borderline') : tr('normal', 'normal'); },
  analyse() {
    const run = this.st.run, n = this.WHO.filter(p => run.done[p.id]).length;
    return { n, done: n === this.WHO.length, slow: run.log.some(l => l.ok && l.rate <= this.GOOD), fast: run.log.some(l => l.why === 'fast'), high: !!run.done.elder1 };
  },
  table() {
    const a = this.analyse(), body = this.body, S = G.S, run = this.st.run;
    const rows = this.WHO.map(p => { const d = run.done[p.id]; return `<tr${d && this.grade(...d).en === 'high' ? ' class="cl-bad"' : ''}><td><b>${U.esc(L(ACT.names[p.id]))}</b></td><td>${d ? d[0] : '–'}</td><td>${d ? d[1] : '–'}</td><td>${d ? L(this.grade(...d)) : '?'}</td></tr>`; }).join('');
    const last = run.log.slice(-1)[0];
    body.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Kişi', 'Person'))}</th><th>${L(tr('Büyük', 'Systolic'))}</th><th>${L(tr('Küçük', 'Diastolic'))}</th><th>${L(tr('Sınıf', 'Class'))}</th></tr>${rows}</table>${last ? `<p class="fm-const">${L(tr('Son deneme', 'Last try'))}: ${last.sys ?? '–'}/${last.dia ?? '–'} · ${last.rate} mmHg/s ${last.ok ? '✓' : '✗'}</p>` : ''}`;
    body.querySelector('.stamps').innerHTML = [
      [a.slow, tr('Yavaş vana', 'Slow valve')], [a.high, tr('Sessiz yüksek tansiyon', 'Silent high pressure')], [a.done, tr(`Üç kişi (${a.n}/3)`, `Three people (${a.n}/3)`)],
    ].map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.done && !S.flags.bpDone) {
      S.flags.bpDone = true;
      S.journal.exps.push({ title: tr('Tansiyon taraması', 'Blood-pressure screening'), code: 'BİY.11.2.6', t: Date.now(),
        head: [tr('Kişi', 'Person'), tr('Büyük (mmHg)', 'Systolic (mmHg)'), tr('Küçük (mmHg)', 'Diastolic (mmHg)'), tr('Sınıf', 'Class')],
        rows: this.WHO.map(p => [ACT.names[p.id], String(run.done[p.id][0]), String(run.done[p.id][1]), this.grade(...run.done[p.id])]),
        chart: { values: this.WHO.map(p => run.done[p.id][0]), labels: this.WHO.map(p => ACT.names[p.id]), colors: ['#7AA640', '#D8A040', '#B8401A'] },
        note: tr('Büyük sayı, kalp kasılırken damar duvarına binen basınç; küçük sayı, kalp gevşerken kalan basınç. Hasan Dede’nin tansiyonu yüksek çıktı, ama kendini gayet iyi hissediyor: yüksek tansiyon çoğu zaman hiçbir belirti vermez. Ölçmeden bilinmez.', 'The big number is the pressure on the artery walls while the heart contracts; the small one is what remains while it relaxes. Hasan Dede’s pressure came out high, yet he feels perfectly well: high blood pressure usually gives no symptoms at all. Only measuring tells.') });
      this._msg(tr('Üç ölçüm tamam! Hasan Dede’nin tansiyonu yüksek, ama hiçbir şikâyeti yok. Sonuçlar defterinde.', 'All three readings done! Hasan Dede’s pressure is high, yet he has no complaints at all. The results are in your journal.'));
      if (Q.at('tansiyon', 'measure')) { UI.stamp(L(tr('TANSİYON', 'PRESSURE'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  async close() {
    this.pn = null;
    window.removeEventListener('keydown', this._key, true); window.removeEventListener('keyup', this._key, true);
    if (this.st) this.st.pumping = false;
    if (Q.at('tansiyon', 'measure') && G.S.flags.bpDone) {
      await ask('tansiyon_numbers');
      await UI.say('player', tr('Hasan Dede “ben turp gibiyim” diyordu. Aletler başka söylüyor. Önce şu kalp modeline bir bakayım: bu basınç damarlara ne yapıyor?', 'Hasan Dede kept saying he’s “fit as a fiddle”. The instruments say otherwise. First let me look at that heart model: what does this pressure do to the arteries?'));
      Q.adv('tansiyon');
    }
  },
  loop() {
    let last = performance.now();
    const tick = now => {
      if (!this.pn || this.pn.closed) return;
      this.step(U.clamp((now - last) / 1000, 0, 0.05) * UI.benchPace(this.cv)); last = now;
      this.draw(); this._syncRate();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
  _msg(t) { if (this.body) this.body.querySelector('.kit-msg').textContent = L(t); },
  _syncRate() { const el = this.body && this.body.querySelector('.bp-rate'); if (el) el.textContent = `${Math.round(this.rate() * 10) / 10} mmHg/s`; },
  _sync() {
    const b = this.body, st = this.st, run = st.run;
    if (!b) return;
    b.querySelectorAll('.bp-who button').forEach(el => { const i = +el.dataset.i; el.classList.toggle('on', st.who === i); el.classList.toggle('done', !!run.done[this.WHO[i].id]); });
    b.querySelector('.bp-pump').classList.toggle('on', st.pumping);
    b.querySelector('.bp-sys').disabled = st.phase !== 'release' || st.marks.sys != null;
    b.querySelector('.bp-dia').disabled = st.phase !== 'release' || st.marks.sys == null;
    const vr = b.querySelector('.bp-valve'); if (+vr.value !== Math.round(st.valve * 100)) vr.value = Math.round(st.valve * 100);
    this._syncRate();
  },

  // ---------------------------------------------------------------- drawing (460 × 300 logical, painted at 2×)
  _back() {
    if (this._bc) return this._bc;
    const c = U.canvas(920, 600), b = c.getContext('2d'); b.scale(2, 2);
    b.fillStyle = MX.lin(b, 0, 0, 0, 172, [[0, '#E8EEF0'], [1, '#C8D4D8']]); b.fillRect(0, 0, 460, 172);
    b.strokeStyle = 'rgba(255,255,255,0.5)'; b.lineWidth = 0.6; for (let x = 0; x < 460; x += 20) { b.beginPath(); b.moveTo(x, 0); b.lineTo(x, 172); b.stroke(); } for (let y = 0; y < 172; y += 20) { b.beginPath(); b.moveTo(0, y); b.lineTo(460, y); b.stroke(); }
    b.fillStyle = '#EFE8D6'; b.fillRect(0, 172, 460, 128); b.fillStyle = 'rgba(0,0,0,0.25)'; b.fillRect(0, 172, 460, 2);
    b.strokeStyle = 'rgba(60,90,120,0.14)'; b.lineWidth = 0.5; for (let y = 186; y < 300; y += 12) { b.beginPath(); b.moveTo(8, y); b.lineTo(452, y); b.stroke(); }
    // the gauge's face: 0–300 mmHg, 270° of sweep
    const gx = 372, gy = 88, gr = 66;
    b.fillStyle = '#2A2E30'; b.beginPath(); b.arc(gx, gy, gr + 6, 0, TAU); b.fill();
    b.fillStyle = MX.rad(b, gx - 10, gy - 14, 4, gr, [[0, '#FFFFFF'], [1, '#E8E6DE']]); b.beginPath(); b.arc(gx, gy, gr, 0, TAU); b.fill();
    b.font = '700 8px "Courier Prime", monospace'; b.textAlign = 'center'; b.textBaseline = 'middle';
    for (let v = 0; v <= 300; v += 2) {
      const a = this._ang(v), big = v % 20 === 0, mid = v % 10 === 0, r0 = gr - (big ? 9 : mid ? 6 : 3);
      b.strokeStyle = '#1B1A17'; b.lineWidth = big ? 1.2 : 0.5; b.beginPath(); b.moveTo(gx + Math.cos(a) * r0, gy + Math.sin(a) * r0); b.lineTo(gx + Math.cos(a) * (gr - 1), gy + Math.sin(a) * (gr - 1)); b.stroke();
      if (big) { b.fillStyle = '#1B1A17'; b.fillText(String(v), gx + Math.cos(a) * (gr - 17), gy + Math.sin(a) * (gr - 17)); }
    }
    b.fillStyle = '#6A6A64'; b.font = '600 7px "Atkinson Hyperlegible Next", sans-serif'; b.fillText('mmHg', gx, gy + 24);
    b.textBaseline = 'alphabetic';
    this._bc = c;
    return c;
  },
  _ang(v) { return (135 + v / 300 * 270) * Math.PI / 180; },
  draw() {
    if (!this.cv) return;
    const x = this.cv.getContext('2d'), st = this.st, p = this.who(), t = st.t;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(this._back(), 0, 0);
    x.setTransform(2, 0, 0, 2, 0, 0);
    // the arm, the cuff on the upper arm, the stethoscope's bell in the elbow crease
    x.fillStyle = '#E2B894'; x.beginPath(); x.moveTo(-10, 78); x.quadraticCurveTo(120, 70, 250, 90); x.lineTo(252, 128); x.quadraticCurveTo(120, 136, -10, 140); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(120,70,40,0.6)'; x.lineWidth = 1; x.stroke();
    const sq = U.clamp(st.P / 200, 0, 1);
    x.fillStyle = '#34486A'; U.rr(x, 20, 70 + sq * 3, 120, 72 - sq * 6, 6); x.fill(); x.strokeStyle = '#1E2A40'; x.lineWidth = 1.2; x.stroke();
    x.strokeStyle = 'rgba(255,255,255,0.25)'; x.lineWidth = 0.8; for (let k = 0; k < 5; k++) { x.beginPath(); x.moveTo(26 + k * 24, 74 + sq * 3); x.lineTo(26 + k * 24, 138 - sq * 3); x.stroke(); }
    // rubber tubes: cuff to gauge, cuff to the bulb (squeezed while pumping)
    x.strokeStyle = '#2A2E30'; x.lineWidth = 2.4;
    x.beginPath(); x.moveTo(132, 104); x.quadraticCurveTo(230, 168, 310, 128); x.stroke();
    x.beginPath(); x.moveTo(24, 134); x.quadraticCurveTo(14, 148, 22, 154); x.stroke();
    x.fillStyle = '#2A2E30'; x.beginPath(); x.ellipse(24, 160, st.pumping ? 8 : 10, st.pumping ? 6 : 8, 0.2, 0, TAU); x.fill();
    // the artery under the skin, in a cut-away window past the cuff: shut, snapping open, or open
    const wx = 150, wy = 104, wwid = 92;
    x.strokeStyle = '#3A3E42'; x.lineWidth = 2; x.beginPath(); x.moveTo(wx + wwid - 10, wy - 28); x.quadraticCurveTo(wx + wwid + 12, 44, 262, 0); x.stroke();
    x.fillStyle = '#F2D2BE'; U.rr(x, wx, wy - 14, wwid, 28, 5); x.fill(); x.strokeStyle = 'rgba(120,70,40,0.5)'; x.lineWidth = 0.8; x.stroke();
    const shut = st.phase !== 'ready' && st.P >= p.sys, open = st.phase === 'ready' || st.P <= p.dia;
    const gap = shut ? 0.8 : open ? 7 : 1 + st.sound * 6;
    x.fillStyle = '#B8302A'; x.fillRect(wx + 4, wy - gap - 2, wwid - 8, 2 * gap + 4);
    x.fillStyle = '#E86A5A'; x.fillRect(wx + 4, wy - gap, wwid - 8, 2 * gap);
    if (!shut && !open && st.sound > 0.2) { x.strokeStyle = `rgba(255,240,230,${st.sound})`; x.lineWidth = 1; for (let k = 0; k < 4; k++) { const cx = wx + 20 + k * 18; x.beginPath(); x.arc(cx, wy, 2 + st.sound * 2, 0, Math.PI * 1.5); x.stroke(); } }
    x.fillStyle = '#1B1A17'; x.font = '600 7px "Atkinson Hyperlegible Next", sans-serif'; x.textAlign = 'left';
    x.fillText(L(shut ? tr('atardamar kapalı', 'artery shut') : open ? tr('kan rahat akıyor', 'blood flows freely') : tr('her atımda açılıyor: TIK', 'snaps open each beat: TAP')), wx + 2, wy + 24);
    x.fillStyle = '#C8CCD0'; x.beginPath(); x.arc(wx + wwid - 10, wy - 20, 9, 0, TAU); x.fill(); x.strokeStyle = '#2A2E30'; x.lineWidth = 1.2; x.stroke();
    // the stethoscope's sound: a strip of the last few seconds, a tick for every tap
    x.fillStyle = 'rgba(20,24,28,0.85)'; U.rr(x, 44, 8, 200, 34, 4); x.fill();
    x.strokeStyle = '#7AE08A'; x.lineWidth = 1; x.beginPath();
    const taps = st.trace.filter(q => q[2] && q[0] > t - 5.1);
    for (let i = 0; i <= 100; i++) { const tt = t - 5 + i * 0.05, hit = taps.some(q => Math.abs(q[0] - tt) < 0.05); const y = 25 + (hit ? -12 * Math.sin(i) : Math.sin(tt * 40 + i) * 0.6); i ? x.lineTo(46 + i * 1.96, y) : x.moveTo(46, y); }
    x.stroke();
    x.fillStyle = '#F4EEDD'; x.font = '600 7px "Atkinson Hyperlegible Next", sans-serif'; x.fillText(L(tr('Steteskop', 'Stethoscope')), 48, 16);
    // the heart ticking along, and the patient's name
    const hb = 1 + st.jig * 0.25;
    x.save(); x.translate(282, 24); x.scale(hb, hb); x.fillStyle = '#C83A32'; x.beginPath(); x.moveTo(0, 6); x.bezierCurveTo(-12, -2, -6, -12, 0, -5); x.bezierCurveTo(6, -12, 12, -2, 0, 6); x.fill(); x.restore();
    x.fillStyle = '#1B1A17'; x.font = '700 10px "Atkinson Hyperlegible Next", sans-serif'; x.fillText(L(ACT.names[p.id]), 262, 50);
    // the gauge's needle and the marks
    const gx = 372, gy = 88, gr = 66;
    for (const [k, col] of [['sys', '#C83A32'], ['dia', '#3A5AA8']]) if (st.marks[k] != null) { const a = this._ang(st.marks[k]); x.strokeStyle = col; x.lineWidth = 2.4; x.beginPath(); x.moveTo(gx + Math.cos(a) * (gr - 12), gy + Math.sin(a) * (gr - 12)); x.lineTo(gx + Math.cos(a) * (gr - 2), gy + Math.sin(a) * (gr - 2)); x.stroke(); }
    const a = this._ang(st.P + (st.phase !== 'ready' && st.P > p.dia - 20 && st.P < p.sys + 20 ? st.jig * 2.2 : 0));
    x.strokeStyle = '#B8201A'; x.lineWidth = 1.8; x.beginPath(); x.moveTo(gx - Math.cos(a) * 10, gy - Math.sin(a) * 10); x.lineTo(gx + Math.cos(a) * (gr - 8), gy + Math.sin(a) * (gr - 8)); x.stroke();
    x.fillStyle = '#2A2E30'; x.beginPath(); x.arc(gx, gy, 4, 0, TAU); x.fill();
    x.fillStyle = '#1B1A17'; x.font = '700 11px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(String(Math.round(st.P)), gx, gy + 40);
    // the notebook page: pressure against time, a red dot for each tap, the two marks as lines
    const g0 = 24, g1 = 440, gyT = 184, gyB = 286, span = 30, Pmax = 200, now = t;
    const X = tt => g0 + (tt - (now - span)) / span * (g1 - g0), Y = v => gyB - U.clamp(v, 0, Pmax) / Pmax * (gyB - gyT);
    x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(g0, gyT); x.lineTo(g0, gyB); x.lineTo(g1, gyB); x.stroke();
    x.fillStyle = '#6A6A64'; x.font = '600 7px "Courier Prime", monospace'; x.textAlign = 'right';
    for (let v = 0; v <= Pmax; v += 50) { x.fillText(String(v), g0 - 3, Y(v) + 2); x.strokeStyle = 'rgba(0,0,0,0.08)'; x.beginPath(); x.moveTo(g0, Y(v)); x.lineTo(g1, Y(v)); x.stroke(); }
    const line = st.trace.filter(q => !q[2] && q[0] > now - span);
    if (line.length > 1) { x.strokeStyle = '#34486A'; x.lineWidth = 1.4; x.beginPath(); line.forEach((q, i) => i ? x.lineTo(X(q[0]), Y(q[1])) : x.moveTo(X(q[0]), Y(q[1]))); x.stroke(); }
    for (const q of st.trace) if (q[2] && q[0] > now - span) { x.fillStyle = '#C83A32'; x.beginPath(); x.arc(X(q[0]), Y(q[1]), 2.2, 0, TAU); x.fill(); }
    x.setLineDash([4, 3]); x.lineWidth = 1;
    for (const [k, col] of [['sys', '#C83A32'], ['dia', '#3A5AA8']]) if (st.marks[k] != null) { x.strokeStyle = col; x.beginPath(); x.moveTo(g0, Y(st.marks[k])); x.lineTo(g1, Y(st.marks[k])); x.stroke(); x.fillStyle = col; x.textAlign = 'left'; x.fillText(`${st.marks[k]}`, g1 - 22, Y(st.marks[k]) - 3); }
    x.setLineDash([]);
  },
};
