'use strict';
// Hüseyin Usta's green tomatoes, picked before the frost. Four paper bags: choose where each is kept and whether a ripe
// apple goes in with it, then wind the clock on two days at a time and watch the colour.
const ETILEN = {
  TEMPS: [20, 4, 30],
  END: 10, // days
  // tomatoes are climacteric: once ripening starts they make their own ethylene, which speeds more ripening (autocatalytic,
  // an S-curve). Near 20 °C is fastest; at 4 °C it all but stops; a ripe apple adds ethylene and brings it forward.
  k(j) { return (j.temp === 20 ? 0.9 : j.temp === 30 ? 0.7 : 0.05) * (j.apple ? 1.8 : 1); },
  ripe(j, t) { const s = x => 1 / (1 + Math.exp(5 - x)), s0 = s(0); return Math.max(0, (s(this.k(j) * t) - s0) / (1 - s0)); },
  tex(j, t) {
    const r = this.ripe(j, t);
    if (j.temp === 4 && t >= 6) return tr('yeşil; soğuk yarası: lekeli, tatsız', 'green; chill damage: pitted, no flavour');
    if (r < 0.15) return tr('yeşil, sert', 'green, hard');
    if (r < 0.5) return tr('kırmızı çizgiler başladı', 'first red streaks');
    if (r < 0.8) return tr('pembe, yumuşuyor', 'pink, softening');
    return j.temp === 30 ? tr('turuncu-sarı; kırmızı olmadı', 'orange-yellow; never went red') : tr('kıpkırmızı, olgun', 'deep red, ripe');
  },
  colour(j, t) {
    const r = this.ripe(j, t), a = [78, 138, 58], z = j.temp === 30 ? [232, 150, 42] : [210, 58, 42];
    return `rgb(${a.map((v, i) => Math.round(v + (z[i] - v) * r)).join(',')})`;
  },

  open() {
    const S = G.S;
    const run = S.etilen || (S.etilen = { control: false, temps: false, ripe: false, runs: 0 });
    this.st = { run, t: 0, j: [0, 1, 2, 3].map(() => ({ temp: 20, apple: false })) };
    const body = h('div', 'kit yogurt etilen');
    body.innerHTML = `<div class="yg-jars"></div><div class="yg-ctl"></div><svg class="yg-plot" viewBox="0 0 320 150"></svg>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Hüseyin Usta’nın kilerinde · Yeşil domatesler', 'Hüseyin Usta’s larder · Green tomatoes'), code: 'BİY.10.1.7', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her torbanın nerede duracağını ve içine elma konup konmayacağını seç, sonra günleri ilerlet.', 'Choose where each bag is kept and whether an apple goes in, then move the days on.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const st = this.st, run = st.run, d = b.dataset;
    AU.sfx('click');
    if (d.temp != null) { const j = st.j[+d.temp]; j.temp = this.TEMPS[(this.TEMPS.indexOf(j.temp) + 1) % this.TEMPS.length]; }
    else if (d.apple != null) { const j = st.j[+d.apple]; j.apple = !j.apple; }
    else if (d.go) {
      st.t = Math.min(this.END, st.t + 2); AU.sfx('pen');
      if (st.t === this.END) {
        run.runs++;
        if (this.TEMPS.some(tp => st.j.some(j => j.temp === tp && j.apple) && st.j.some(j => j.temp === tp && !j.apple))) run.control = true;
        if (new Set(st.j.map(j => j.temp)).size >= 3) run.temps = true;
        if (st.j.some(j => j.temp !== 30 && this.ripe(j, this.END) >= 0.8)) run.ripe = true;
        this._msg(this._verdict());
      } else this._msg(tr(`${st.t}. gün. Torbaları aç, renge bak.`, `Day ${st.t}. Open the bags and check the colour.`));
    } else if (d.reset) { st.t = 0; this._msg(tr('Yeni yeşil domatesler torbalara kondu.', 'Fresh green tomatoes into the bags.')); }
    this.draw(); G.save();
  },
  _verdict() {
    const st = this.st, ok = st.j.filter(j => j.temp !== 30 && this.ripe(j, this.END) >= 0.8);
    if (!ok.length) return tr('On gün geçti, kıpkırmızı olan yok. Ya çok soğuk, ya çok sıcak.', 'Ten days and none is deep red. Too cold, or too hot.');
    const first = ok.map(j => ({ j, d: [2, 4, 6, 8, 10].find(t => this.ripe(j, t) >= 0.8) })).sort((a, b) => a.d - b.d)[0];
    return tr(`İlk olgunlaşan: ${first.j.temp} °C${first.j.apple ? ', elmalı' : ''}, ${first.d}. gün.`, `First to ripen: ${first.j.temp} °C${first.j.apple ? ', with apple' : ''}, day ${first.d}.`);
  },
  draw() {
    const st = this.st, b = this.body, run0 = st.t > 0;
    b.querySelector('.yg-jars').innerHTML = st.j.map((j, i) => {
      const r = this.ripe(j, st.t);
      return `<div class="yg-jar"><span class="et-tom" style="background:${this.colour(j, st.t)}"></span><b>${Math.round(r * 100)}%</b><small>${U.esc(L(this.tex(j, st.t)))}</small>
        <button data-temp="${i}" ${run0 ? 'disabled' : ''}>${j.temp === 4 ? '❄️' : j.temp === 30 ? '🔥' : '🏠'} ${j.temp} °C</button>
        <button data-apple="${i}" ${run0 ? 'disabled' : ''} class="${j.apple ? 'on' : ''}">${L(j.apple ? tr('🍎 elmalı', '🍎 apple') : tr('✗ elmasız', '✗ no apple'))}</button></div>`;
    }).join('');
    b.querySelector('.yg-ctl').innerHTML = `<b>📅 ${st.t} / ${this.END} ${L(tr('gün', 'days'))}</b>
      <button data-go="1" class="primary" ${st.t >= this.END ? 'disabled' : ''}>${L(tr('+2 gün bekle', 'Wait 2 days'))}</button>
      <button data-reset="1" ${run0 ? '' : 'disabled'}>${L(tr('Yeniden kur', 'Set up again'))}</button>`;
    const X = t => 30 + t / this.END * 280, Y = r => 130 - r * 115, col = ['#C23A2C', '#2F68B4', '#3E8A4A', '#D6A02A'];
    let svg = `<line x1="30" y1="${Y(0.8)}" x2="310" y2="${Y(0.8)}" class="yg-cut"/><text x="306" y="${Y(0.8) - 4}" text-anchor="end">${L(tr('olgun', 'ripe'))}</text>
      <line x1="30" y1="10" x2="30" y2="130" class="yg-ax"/><line x1="30" y1="130" x2="310" y2="130" class="yg-ax"/><text x="4" y="${Y(1) + 4}">100%</text><text x="12" y="${Y(0) + 4}">0</text><text x="292" y="146">${this.END} ${L(tr('gün', 'd'))}</text>`;
    st.j.forEach((j, i) => {
      const pts = []; for (let t = 0; t <= st.t; t += 0.25) pts.push(`${X(t).toFixed(1)},${Y(this.ripe(j, t)).toFixed(1)}`);
      svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="${col[i]}" stroke-width="2"/>`;
    });
    b.querySelector('.yg-plot').innerHTML = svg;
    this.table();
  },
  analyse() { const r = this.st.run; return { done: r.control && r.temps && r.ripe }; },
  table() {
    const a = this.analyse(), S = G.S, r = this.st.run, b = this.body, st = this.st;
    b.querySelector('.stamps').innerHTML = [[r.temps, tr('Üç ortam', 'Three places')], [r.control, tr('Elmasız kontrol', 'No-apple control')], [r.ripe, tr('Olgun domates', 'A ripe tomato')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const pc = (j, t) => `${Math.round(this.ripe(j, t) * 100)}%`;
    const rows = st.j.map(j => [`${j.temp} °C`, j.apple ? tr('var', 'yes') : tr('yok', 'no'), pc(j, 4), pc(j, 8), pc(j, 10), this.tex(j, 10)]);
    const head = [tr('Ortam', 'Place'), tr('Elma', 'Apple'), tr('4. gün', 'Day 4'), tr('8. gün', 'Day 8'), tr('10. gün', 'Day 10'), tr('Sonuç', 'Result')];
    b.querySelector('.rig-table').innerHTML = st.t < this.END ? '' : `<table class="exp-table"><tr>${head.map(x => `<th>${U.esc(L(x))}</th>`).join('')}</tr>${rows.map(rw => `<tr>${rw.map(c => `<td>${U.esc(typeof c === 'string' ? c : L(c))}</td>`).join('')}</tr>`).join('')}</table>`;
    if (a.done && !S.flags.etilenDone) {
      S.flags.etilenDone = true;
      S.journal.exps.push({ title: tr('Yeşil domatesleri olgunlaştırmak', 'Ripening green tomatoes'), code: 'BİY.10.1.7', t: Date.now(), head, rows,
        note: tr('Domates, muz, elma gibi klimakterik meyveler olgunlaşırken etilen gazı üretir; etilen de olgunlaşmayı hızlandırır, bu yüzden süreç kendi kendini besler. Olgun bir elma torbaya etilen ekler, domatesler günler önce kızarır. Olgunlaşma enzimlerle yürür ve sıcaklığa bağlıdır: 20 °C dolayında en hızlı, 4 °C’de neredeyse durur (üstelik soğuk yarası oluşur). 30 °C’nin üstünde kırmızı pigment likopen yapılamaz, domates turuncu-sarı kalır. Güneş gerekmez: karanlık torbada da olgunlaşır.', 'Climacteric fruits such as tomato, banana and apple give off ethylene gas as they ripen, and ethylene speeds up ripening, so the process feeds itself. A ripe apple adds ethylene to the bag and the tomatoes redden days earlier. Ripening runs on enzymes and depends on temperature: fastest around 20 °C, almost stopped at 4 °C (with chilling injury too). Above about 30 °C the red pigment lycopene is not made and the tomato stays orange-yellow. No sunlight is needed: they ripen in a dark bag.') });
      this._msg(tr('Üç damga da tamam! Sonuçlar defterinde.', 'All three stamps! The results are in your journal.'));
      if (Q.at('etilen', 'ripen')) { UI.stamp(L(tr('KIPKIRMIZI', 'RED RIPE'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('etilen', 'ripen') && G.S.flags.etilenDone) {
      await ask('etilen_apple');
      await ask('etilen_cold');
      await UI.say('player', tr('Hüseyin Usta’ya domateslerini nasıl kızartacağını anlatayım.', 'Let me tell Hüseyin Usta how to ripen his tomatoes.'));
      Q.adv('etilen');
    }
  },
};
