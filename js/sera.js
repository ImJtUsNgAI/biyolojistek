'use strict';
// "Kavanoz Dünya" in the greenhouse: three sealed jars under a lamp, a thermometer in each. Fill a jar with plain air or
// with CO₂ from vinegar + baking soda, drop in a sprig of pondweed or not, then run the lamp (the Sun) or leave it dark.
// Bromothymol blue in each jar shows the CO₂: blue = little, green = some, yellow = a lot.
const SERA = {
  END: 30, // minutes
  open() {
    const S = G.S;
    const run = S.sera || (S.sera = { fair: false, plant: false, dark: false, runs: 0 });
    this.st = { run, t: 0, lamp: true, j: [{ gas: 'air', plant: false }, { gas: 'co2', plant: false }, { gas: 'co2', plant: true }] };
    const body = h('div', 'kit sera');
    body.innerHTML = `<div class="sr-lamp"></div><div class="sr-jars"></div><div class="yg-ctl sr-ctl"></div><svg class="yg-plot" viewBox="0 0 320 150"></svg>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Sera · Kavanoz Dünya', 'Greenhouse · Jar Earth'), code: 'BİY.10.2.6', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her kavanoza hava mı CO₂ mi dolduracağını, içine su bitkisi koyup koymayacağını seç. Lambayı aç ya da kapat, sonra bekle.', 'Choose air or CO₂ for each jar and whether it gets a pondweed sprig. Switch the lamp on or off, then wait.'));
    this.draw();
  },
  // relative CO₂ after t minutes: air = 1, vinegar + soda ≈ 10. A lit plant photosynthesises it down;
  // a plant in the dark only respires and adds a little.
  co2(j, t, lamp) {
    let c = j.gas === 'co2' ? 10 : 1;
    if (j.plant) for (let k = 5; k <= t; k += 5) c = lamp ? c * 0.8 : c + 0.5;
    return c;
  },
  // CO₂ lets light in but holds back the heat the warm jar gives off, so a CO₂-rich jar settles warmer
  temp(j, t, lamp) {
    if (!lamp) return 20;
    const top = 6 + 1.3 * Math.log(Math.max(1, this.co2(j, t, lamp)));
    return 20 + top * (1 - Math.exp(-t / 10));
  },
  btb(c) { return c <= 1.2 ? ['#3A6CC8', tr('mavi', 'blue')] : c < 3 ? ['#4E9E5A', tr('yeşil', 'green')] : ['#D8BE38', tr('sarı', 'yellow')]; },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const st = this.st, run = st.run, d = b.dataset;
    AU.sfx('click');
    if (d.gas != null) { const j = st.j[+d.gas]; j.gas = j.gas === 'air' ? 'co2' : 'air'; if (j.gas === 'co2') AU.sfx('splash'); }
    else if (d.plant != null) { const j = st.j[+d.plant]; j.plant = !j.plant; }
    else if (d.lamp) st.lamp = !st.lamp;
    else if (d.go) {
      st.t = Math.min(this.END, st.t + 5); AU.sfx('pen');
      if (st.t === this.END) {
        run.runs++;
        const air = st.j.find(j => j.gas === 'air' && !j.plant), co = st.j.find(j => j.gas === 'co2' && !j.plant);
        if (st.lamp && air && co) run.fair = true;
        if (st.lamp && st.j.some(j => j.plant && this.co2(j, this.END, true) < (j.gas === 'co2' ? 10 : 1))) run.plant = true;
        if (!st.lamp && st.j.some(j => j.plant)) run.dark = true;
        this._msg(this._verdict());
      } else this._msg(tr(`${st.t}. dakika. Termometrelere ve suyun rengine bak.`, `Minute ${st.t}. Look at the thermometers and the colour of the water.`));
    } else if (d.reset) { st.t = 0; this._msg(tr('Kavanozlar havalandırıldı. Yeniden kur.', 'Jars aired out. Set them up again.')); }
    this.draw(); G.save();
  },
  _verdict() {
    const st = this.st;
    if (!st.lamp) return st.j.some(j => j.plant)
      ? tr('Karanlıkta hiçbir kavanoz ısınmadı. Bitkili kavanozun suyu sarıya kaydı: ışık yokken bitki yalnızca solunum yapar, CO₂ verir.', 'In the dark no jar warmed up. The plant jar’s water went yellower: with no light the plant only respires and gives off CO₂.')
      : tr('Karanlıkta hiçbir kavanoz ısınmadı. Isıyı getiren ışıktır; CO₂ sadece onu içeride tutar.', 'In the dark no jar warmed up. The light brings the heat; CO₂ only keeps it in.');
    const ts = st.j.map(j => this.temp(j, this.END, true)), hi = ts.indexOf(Math.max(...ts)), lo = ts.indexOf(Math.min(...ts));
    return tr(`En sıcak ${hi + 1}. kavanoz (${ts[hi].toFixed(1)} °C), en serin ${lo + 1}. kavanoz (${ts[lo].toFixed(1)} °C). Aynı lamba, aynı kavanoz: fark içindeki gazda.`,
      `Warmest is jar ${hi + 1} (${ts[hi].toFixed(1)} °C), coolest is jar ${lo + 1} (${ts[lo].toFixed(1)} °C). Same lamp, same jars: the difference is the gas inside.`);
  },
  draw() {
    const st = this.st, b = this.body, run0 = st.t > 0;
    b.querySelector('.sr-lamp').innerHTML = `<button data-lamp="1" class="${st.lamp ? 'on' : ''}" ${run0 ? 'disabled' : ''}>${L(st.lamp ? tr('💡 Lamba açık (Güneş)', '💡 Lamp on (the Sun)') : tr('🌑 Lamba kapalı (gece)', '🌑 Lamp off (night)'))}</button>`;
    b.querySelector('.sr-jars').innerHTML = st.j.map((j, i) => {
      const c = this.co2(j, st.t, st.lamp), T = this.temp(j, st.t, st.lamp), [col, name] = this.btb(c);
      return `<div class="yg-jar sr-jar ${st.lamp ? 'lit' : ''}"><div class="sr-glass" style="--w:${col}">${j.plant ? '<i>🌿</i>' : ''}<em style="--h:${Math.min(100, (T - 18) * 6)}%"></em></div>
        <b>${T.toFixed(1)} °C</b><small>BTB: ${U.esc(L(name))}</small>
        <button data-gas="${i}" ${run0 ? 'disabled' : ''} class="${j.gas === 'co2' ? 'on' : ''}">${L(j.gas === 'co2' ? tr('🫧 CO₂ (sirke+soda)', '🫧 CO₂ (vinegar+soda)') : tr('💨 normal hava', '💨 plain air'))}</button>
        <button data-plant="${i}" ${run0 ? 'disabled' : ''} class="${j.plant ? 'on' : ''}">${L(j.plant ? tr('🌿 su bitkisi var', '🌿 pondweed in') : tr('✗ bitki yok', '✗ no plant'))}</button></div>`;
    }).join('');
    b.querySelector('.sr-ctl').innerHTML = `<b>⏱ ${st.t} / ${this.END} ${L(tr('dk', 'min'))}</b>
      <button data-go="1" class="primary" ${st.t >= this.END ? 'disabled' : ''}>${L(tr('+5 dakika', '+5 minutes'))}</button>
      <button data-reset="1" ${run0 ? '' : 'disabled'}>${L(tr('Yeniden kur', 'Set up again'))}</button>`;
    const X = t => 30 + t / this.END * 280, Y = T => 130 - (T - 20) / 10 * 120, col = ['#2F68B4', '#C23A2C', '#3E8A4A'];
    let svg = `<line x1="30" y1="10" x2="30" y2="130" class="yg-ax"/><line x1="30" y1="130" x2="310" y2="130" class="yg-ax"/>
      <text x="4" y="134">20°</text><text x="4" y="14">30°</text><text x="292" y="146">${this.END} ${L(tr('dk', 'min'))}</text>`;
    st.j.forEach((j, i) => {
      const pts = []; for (let t = 0; t <= st.t; t += 1) pts.push(`${X(t).toFixed(1)},${Y(this.temp(j, t, st.lamp)).toFixed(1)}`);
      svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="${col[i]}" stroke-width="2"/><text x="${X(st.t) + 3}" y="${Y(this.temp(j, st.t, st.lamp)) + 4}" fill="${col[i]}">${i + 1}</text>`;
    });
    b.querySelector('.yg-plot').innerHTML = svg;
    this.table();
  },
  analyse() { const r = this.st.run; return { done: r.fair && r.plant && r.dark }; },
  table() {
    const a = this.analyse(), S = G.S, r = this.st.run, b = this.body, st = this.st;
    b.querySelector('.stamps').innerHTML = [[r.fair, tr('Hava ↔ CO₂ adil test', 'Air vs CO₂ fair test')], [r.plant, tr('Bitki CO₂’yi azalttı', 'Plant drew CO₂ down')], [r.dark, tr('Karanlık deneme', 'Dark run')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const head = [tr('Kavanoz', 'Jar'), tr('Gaz', 'Gas'), tr('Bitki', 'Plant'), tr('Lamba', 'Lamp'), tr('Son sıcaklık', 'Final temp.'), 'BTB'];
    const rows = st.j.map((j, i) => [String(i + 1), j.gas === 'co2' ? 'CO₂' : tr('hava', 'air'), j.plant ? tr('var', 'yes') : tr('yok', 'no'), st.lamp ? tr('açık', 'on') : tr('kapalı', 'off'),
      this.temp(j, this.END, st.lamp).toFixed(1) + ' °C', this.btb(this.co2(j, this.END, st.lamp))[1]]);
    b.querySelector('.rig-table').innerHTML = st.t < this.END ? '' : `<table class="exp-table"><tr>${head.map(x => `<th>${U.esc(L(x))}</th>`).join('')}</tr>${rows.map(rw => `<tr>${rw.map(c => `<td>${U.esc(typeof c === 'string' ? c : L(c))}</td>`).join('')}</tr>`).join('')}</table>`;
    if (a.done && !S.flags.seraDone) {
      S.flags.seraDone = true;
      S.journal.exps.push({ title: tr('Kavanoz Dünya', 'Jar Earth'), code: 'BİY.10.2.6', t: Date.now(), head, rows,
        note: tr('Işık kavanoza girer, kavanozu ısıtır; ısınan kavanoz ısıyı kızılötesi olarak geri yayar. CO₂ bu kızılötesini tutar, bu yüzden CO₂’li kavanoz daha sıcak kalır: sera etkisi. Işıkta su bitkisi fotosentezle CO₂’yi azaltır (BTB maviye döner); karanlıkta yalnızca solunum yapar, CO₂ verir. 1856’da Eunice Foote cam silindirlerle aynı deneyi yapıp CO₂’li silindirin güneşte daha çok ısındığını yazdı.', 'Light gets into the jar and warms it; the warm jar gives the heat back out as infrared. CO₂ holds that infrared in, so the CO₂ jar stays warmer: the greenhouse effect. In light, pondweed photosynthesises CO₂ away (BTB turns blue); in the dark it only respires and gives CO₂ off. In 1856 Eunice Foote did the same test with glass cylinders and wrote that the CO₂ one heated most in the sun.') });
      this._msg(tr('Üç damga da tamam! Sonuçlar defterinde.', 'All three stamps! The results are in your journal.'));
      if (Q.at('sera', 'jars')) { UI.stamp(L(tr('SERA ETKİSİ', 'GREENHOUSE EFFECT'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('sera', 'jars') && G.S.flags.seraDone) {
      await ask('sera_heat');
      await ask('sera_plant');
      await UI.say('player', tr('Alp’e anlatayım: kavanozlarımız küçük bir Dünya’ydı.', 'Let me tell Alp: our jars were a little Earth.'));
      Q.adv('sera');
    }
  },
};
