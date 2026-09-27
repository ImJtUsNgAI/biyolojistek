'use strict';
// Yogurt bench beside Songül's house. Four jars of boiled milk: pick the temperature each is kept at and whether it
// gets a spoon of starter, then wind the clock on two hours at a time and read the pH strip and the spoon test.
const YOGURT = {
  TEMPS: [4, 25, 43, 70],
  END: 12, // hours
  // lactic acid bacteria (L. bulgaricus + S. thermophilus) work fastest near 43 °C, crawl in the cold, die at 70 °C.
  // With no starter only a few stray bacteria are there, so the milk barely changes in half a day.
  rate(j) { return (j.temp === 43 ? 1 : j.temp === 25 ? 0.25 : j.temp === 4 ? 0.02 : 0) * (j.start ? 1 : 0.04); },
  ph(j, t) { return 4.2 + 2.4 * Math.exp(-this.rate(j) * t / 3); },
  // casein curdles near its isoelectric point, pH 4.6; above ~5.6 the milk is still runny
  tex(j, t) {
    const p = this.ph(j, t);
    if (p > 5.6) return tr('sıvı süt', 'runny milk');
    if (p > 4.8) return tr('koyulaşıyor', 'thickening');
    if (t >= 10 && j.temp === 43) return tr('çok ekşi, su saldı', 'very sour, weeping whey');
    return tr('tuttu: kaşık dik durur', 'set: a spoon stands up');
  },
  strip(p) { return p > 6 ? '#3E7A6A' : p > 5.2 ? '#8AA040' : p > 4.7 ? '#D8B030' : '#D8702A'; },

  open() {
    const S = G.S;
    const run = S.yogurt || (S.yogurt = { control: false, temps: false, set: false, runs: 0 });
    this.st = { run, t: 0, j: [43, 43, 43, 43].map(temp => ({ temp, start: true })) };
    const body = h('div', 'kit yogurt');
    body.innerHTML = `<div class="yg-jars"></div><div class="yg-ctl"></div><svg class="yg-plot" viewBox="0 0 320 150"></svg>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Songül’ün mutfağı · Yoğurt mayalama', 'Songül’s kitchen · Setting yogurt'), code: 'BİY.10.1.9', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her kavanozun sıcaklığını ve maya konup konmayacağını seç, sonra saati ileri al.', 'Choose each jar’s temperature and whether it gets starter, then wind the clock on.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const st = this.st, run = st.run, d = b.dataset;
    AU.sfx('click');
    if (d.temp != null) { const j = st.j[+d.temp]; j.temp = this.TEMPS[(this.TEMPS.indexOf(j.temp) + 1) % this.TEMPS.length]; }
    else if (d.start != null) { const j = st.j[+d.start]; j.start = !j.start; }
    else if (d.go) {
      st.t = Math.min(this.END, st.t + 2); AU.sfx('pen');
      if (st.t === this.END) {
        run.runs++;
        if (st.j.some(j => !j.start && j.temp === 43)) run.control = true;
        if (new Set(st.j.filter(j => j.start).map(j => j.temp)).size >= 3) run.temps = true;
        if (st.j.some(j => this.ph(j, this.END) <= 4.6)) run.set = true;
        this._msg(this._verdict());
      } else this._msg(tr(`${st.t}. saat. Kavanozları kaşıkla yokla, pH şeridine bak.`, `Hour ${st.t}. Test the jars with a spoon and check the pH strip.`));
    } else if (d.reset) { st.t = 0; this._msg(tr('Yeni süt kaynatıldı. Kavanozları yeniden kur.', 'Fresh milk boiled. Set up the jars again.')); }
    this.draw(); G.save();
  },
  _verdict() {
    const st = this.st, ok = st.j.filter(j => this.ph(j, this.END) <= 4.6);
    if (!ok.length) return tr('On iki saat geçti, hiçbir kavanoz tutmadı. Bakteri ya çok soğukta, ya çok sıcakta, ya da hiç yok.', 'Twelve hours and not one jar has set. The bacteria were too cold, too hot, or not there at all.');
    return tr(`Tutan kavanozlar: ${ok.map(j => `${j.temp} °C`).join(', ')}. Mayasız ve 70 °C’lik süt süt olarak kaldı.`, `Jars that set: ${ok.map(j => `${j.temp} °C`).join(', ')}. Milk with no starter, or at 70 °C, stayed milk.`);
  },
  draw() {
    const st = this.st, b = this.body, run0 = st.t > 0;
    b.querySelector('.yg-jars').innerHTML = st.j.map((j, i) => {
      const p = this.ph(j, st.t), thick = Math.max(0, Math.min(1, (6.6 - p) / 2));
      return `<div class="yg-jar"><div class="yg-glass" style="--k:${thick.toFixed(2)}"><i></i></div>
        <span class="yg-strip" style="background:${this.strip(p)}"></span><b>pH ${p.toFixed(1)}</b><small>${U.esc(L(this.tex(j, st.t)))}</small>
        <button data-temp="${i}" ${run0 ? 'disabled' : ''}>🌡 ${j.temp} °C</button>
        <button data-start="${i}" ${run0 ? 'disabled' : ''} class="${j.start ? 'on' : ''}">${L(j.start ? tr('🥄 mayalı', '🥄 starter') : tr('✗ mayasız', '✗ no starter'))}</button></div>`;
    }).join('');
    b.querySelector('.yg-ctl').innerHTML = `<b>⏱ ${st.t} / ${this.END} ${L(tr('saat', 'h'))}</b>
      <button data-go="1" class="primary" ${st.t >= this.END ? 'disabled' : ''}>${L(tr('+2 saat bekle', 'Wait 2 hours'))}</button>
      <button data-reset="1" ${run0 ? '' : 'disabled'}>${L(tr('Yeniden kur', 'Set up again'))}</button>`;
    // pH against time, one line per jar, with the curdling line at 4.6
    const X = t => 30 + t / this.END * 280, Y = p => 10 + (6.8 - p) / 2.8 * 120, col = ['#C23A2C', '#2F68B4', '#3E8A4A', '#D6A02A'];
    let svg = `<line x1="30" y1="${Y(4.6)}" x2="310" y2="${Y(4.6)}" class="yg-cut"/><text x="306" y="${Y(4.6) - 4}" text-anchor="end">${L(tr('kazein pıhtılaşır', 'casein curdles'))} 4.6</text>
      <line x1="30" y1="10" x2="30" y2="130" class="yg-ax"/><line x1="30" y1="130" x2="310" y2="130" class="yg-ax"/><text x="4" y="${Y(6.6) + 4}">6.6</text><text x="4" y="${Y(4.2) + 4}">4.2</text><text x="300" y="146">${this.END} ${L(tr('sa', 'h'))}</text>`;
    st.j.forEach((j, i) => {
      const pts = []; for (let t = 0; t <= st.t; t += 0.5) pts.push(`${X(t).toFixed(1)},${Y(this.ph(j, t)).toFixed(1)}`);
      svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="${col[i]}" stroke-width="2"/>`;
    });
    b.querySelector('.yg-plot').innerHTML = svg;
    this.table();
  },
  analyse() { const r = this.st.run; return { done: r.control && r.temps && r.set }; },
  table() {
    const a = this.analyse(), S = G.S, r = this.st.run, b = this.body, st = this.st;
    b.querySelector('.stamps').innerHTML = [[r.temps, tr('Üç sıcaklık', 'Three temperatures')], [r.control, tr('Mayasız kontrol', 'No-starter control')], [r.set, tr('Yoğurt tuttu', 'Yogurt set')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const rows = st.j.map(j => [`${j.temp} °C`, j.start ? tr('var', 'yes') : tr('yok', 'no'), this.ph(j, 4).toFixed(1), this.ph(j, 8).toFixed(1), this.ph(j, 12).toFixed(1), this.tex(j, 12)]);
    const head = [tr('Sıcaklık', 'Temp.'), tr('Maya', 'Starter'), 'pH 4 sa', 'pH 8 sa', 'pH 12 sa', tr('Sonuç', 'Result')];
    b.querySelector('.rig-table').innerHTML = st.t < this.END ? '' : `<table class="exp-table"><tr>${head.map(x => `<th>${U.esc(L(x))}</th>`).join('')}</tr>${rows.map(rw => `<tr>${rw.map(c => `<td>${U.esc(typeof c === 'string' ? c : L(c))}</td>`).join('')}</tr>`).join('')}</table>`;
    if (a.done && !S.flags.yogurtDone) {
      S.flags.yogurtDone = true;
      S.journal.exps.push({ title: tr('Yoğurt mayalama', 'Setting yogurt'), code: 'BİY.10.1.9', t: Date.now(), head, rows,
        note: tr('Laktik asit bakterileri sütteki laktozu laktik aside mayalar. Asit arttıkça pH düşer; pH 4,6 dolayında süt proteini kazein pıhtılaşır ve süt koyulaşır. En hızlı 43 °C’de olur; soğukta çok yavaşlar, 70 °C’de bakteriler ölür. Mayasız kontrol, değişimi bakterinin yaptığını gösterir.', 'Lactic acid bacteria ferment the lactose in milk to lactic acid. As acid builds, the pH falls; near pH 4.6 the milk protein casein curdles and the milk thickens. It is fastest at 43 °C, very slow in the cold, and at 70 °C the bacteria die. The no-starter control shows it is the bacteria doing the work.') });
      this._msg(tr('Üç damga da tamam! Sonuçlar defterinde.', 'All three stamps! The results are in your journal.'));
      if (Q.at('yogurt', 'ferment')) { UI.stamp(L(tr('TUTTU', 'SET'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('yogurt', 'ferment') && G.S.flags.yogurtDone) {
      await ask('yogurt_ph');
      await UI.say('player', tr('Songül Abla’ya neden tutmadığını anlatayım.', 'Let me tell Songül why it didn’t set.'));
      Q.adv('yogurt');
    }
  },
};
