'use strict';
// Fatma Teyze's sowing calendar. Four crops, four sowing months: each cell is one season in the notebook. The point is
// that "warmer is better" is wrong — frost kills, but winter wheat needs the cold and spinach bolts in long days.
const EKIM = {
  SAMPLES: [
    { id: 'bugday', icon: '🌾', n: tr('Kışlık buğday', 'Winter wheat') },
    { id: 'nohut', icon: '🫘', n: tr('Nohut', 'Chickpea') },
    { id: 'domates', icon: '🍅', n: tr('Domates', 'Tomato') },
    { id: 'ispanak', icon: '🥬', n: tr('Ispanak', 'Spinach') },
  ],
  TESTS: [
    { id: 'ekim', icon: '🍂', n: tr('Ekim', 'October') },
    { id: 'mart', icon: '🌱', n: tr('Mart', 'March') },
    { id: 'mayis', icon: '🌼', n: tr('Mayıs', 'May') },
    { id: 'temmuz', icon: '☀️', n: tr('Temmuz', 'July') },
  ],
  RES: {
    bugday: {
      ekim: ['ok', tr('Kışı fide olarak geçirdi, soğuk onu başağa hazırladı. Haziranda dolgun başak.', 'Wintered as a seedling; the cold primed it to flower. Full ears in June.')],
      mart: ['noear', tr('Yemyeşil çimen gibi büyüdü ama başak vermedi: kış soğuğunu hiç görmedi.', 'Grew lush like a lawn but never made ears: it never felt the winter cold.')],
      mayis: ['noear', tr('Ot gibi uzadı, başak yok. Soğuk isteği karşılanmadı.', 'Grew grassy, no ears. Its need for cold was never met.')],
      temmuz: ['dry', tr('Kuru, kavruk toprakta tohum çimlenmedi bile.', 'In the dry, baked soil the seed never even sprouted.')],
    },
    nohut: {
      ekim: ['frost', tr('Çimlendi, ocak ayazında fideler dondu.', 'Sprouted, then the seedlings froze in the January cold.')],
      mart: ['ok', tr('Toprak ısınınca çıktı, yazın başında bakla doldu.', 'Came up as the soil warmed; pods filled by early summer.')],
      mayis: ['poor', tr('Temmuz sıcağında çiçekler döküldü: az bakla.', 'The July heat dropped the flowers: few pods.')],
      temmuz: ['frost', tr('Geç kaldı; bakla dolmadan ekim ayazı geldi.', 'Too late; the October frost came before the pods filled.')],
    },
    domates: {
      ekim: ['frost', tr('Fideler ilk ayazda kapkara oldu.', 'The seedlings went black at the first frost.')],
      mart: ['frost', tr('Nisan sonundaki bir gece ayazı fidelerin hepsini öldürdü.', 'One late-April night frost killed every seedling.')],
      mayis: ['ok', tr('Ayaz geçti, sıcak uzun yaz: ağustosta kıpkırmızı domates.', 'Frost over, a long warm summer: bright red tomatoes in August.')],
      temmuz: ['late', tr('Büyüdü ama ekim ayazı geldiğinde domatesler hâlâ yeşildi.', 'It grew, but the tomatoes were still green when the October frost came.')],
    },
    ispanak: {
      ekim: ['ok', tr('Soğuğa dayanıklı: kışın yaprak verdi, baharda bol hasat.', 'Cold-hardy: leaves all winter, a big harvest in spring.')],
      mart: ['ok', tr('Serin, kısa günlerde bol yaprak. Mayısta toplandı.', 'Lots of leaves in cool, short days. Picked in May.')],
      mayis: ['bolt', tr('Günler uzayınca hemen sapa kalktı, çiçek açtı; yapraklar acı ve az.', 'As the days grew long it shot up a stalk and flowered; few, bitter leaves.')],
      temmuz: ['bolt', tr('Uzun gün + sıcak: fide hâlindeyken bile tohuma kaçtı.', 'Long days + heat: it ran to seed while still tiny.')],
    },
  },
  TEMP: [0, 2, 6, 11, 16, 20, 23, 23, 18, 12, 6, 2],
  DAY: [9.5, 10.5, 12, 13, 14.3, 14.9, 14.6, 13.6, 12.4, 11.1, 10, 9.3],
  open() {
    const S = G.S;
    this.st = S.ekim || (S.ekim = { seen: {} });
    const body = h('div', 'kit hediye ekim');
    body.innerHTML = `<div class="hd-grid"></div><div class="ekm-cal"></div><div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Fatma Teyze’nin defteri · Ne zaman ekilir?', 'Fatma Teyze’s notebook · When to sow?'), code: 'BİY.10.2.1', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her kutu bir sezon: o bitkiyi o ay ek ve ne olduğunu gör.', 'Each box is one season: sow that crop in that month and see what happens.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const k = b.dataset.cell; if (!k || this.st.seen[k]) return;
    this.st.seen[k] = 1;
    const [sid, tid] = k.split(':'), r = this.RES[sid][tid];
    AU.sfx(r[0] === 'ok' ? 'collect' : 'pen');
    this._msg(r[1]);
    this.draw(); G.save();
  },
  has(cls) { return this.SAMPLES.some(s => this.TESTS.some(t => this.st.seen[`${s.id}:${t.id}`] && this.RES[s.id][t.id][0] === cls)); },
  draw() {
    const b = this.body, seen = this.st.seen;
    let g = `<div class="hd-h"></div>${this.TESTS.map(t => `<div class="hd-h">${t.icon}<br>${U.esc(L(t.n))}</div>`).join('')}`;
    for (const s of this.SAMPLES) {
      g += `<div class="hd-s">${s.icon} ${U.esc(L(s.n))}</div>`;
      for (const t of this.TESTS) {
        const k = `${s.id}:${t.id}`, r = this.RES[s.id][t.id];
        g += seen[k] ? `<button class="hd-c done r-${r[0]}" data-cell="${k}" disabled>${U.esc(L(r[1]))}</button>`
          : `<button class="hd-c" data-cell="${k}">${L(tr('Ek', 'Sow'))}</button>`;
      }
    }
    b.querySelector('.hd-grid').innerHTML = g;
    // once both "surprises" are seen, show the year: temperature bars, day-length line, frost months shaded
    const a = this.analyse();
    const mo = L(tr('O Ş M N M H T A E E K A', 'J F M A M J J A S O N D')).split(' ');
    const X = i => 30 + i * 24, YT = c => 100 - c * 3.2, YD = d => 100 - (d - 8) * 12;
    b.querySelector('.ekm-cal').innerHTML = !(a.frost && a.cold) ? '' : `<svg viewBox="0 0 330 124">
      ${this.TEMP.map((c, i) => (c <= 6 || i === 3 || i === 9 ? `<rect x="${X(i) - 12}" y="4" width="24" height="96" class="ekm-frost"/>` : '')).join('')}
      ${this.TEMP.map((c, i) => `<rect x="${X(i) - 7}" y="${YT(c)}" width="14" height="${100 - YT(c)}" class="ekm-t"/>`).join('')}
      <polyline points="${this.DAY.map((d, i) => `${X(i)},${YD(d).toFixed(1)}`).join(' ')}" class="ekm-d"/>
      <line x1="18" y1="100" x2="312" y2="100" class="yg-ax"/>
      ${mo.map((m, i) => `<text x="${X(i)}" y="113" text-anchor="middle">${m}</text>`).join('')}
      <text x="20" y="122">${L(tr('▮ ortalama °C (0–23)   ― gün uzunluğu (9–15 sa)   ░ ayaz riski', '▮ mean °C (0–23)   ― day length (9–15 h)   ░ frost risk'))}</text></svg>`;
    this.table();
  },
  analyse() {
    const okAll = this.SAMPLES.every(s => this.TESTS.some(t => this.st.seen[`${s.id}:${t.id}`] && this.RES[s.id][t.id][0] === 'ok'));
    return { frost: this.has('frost'), cold: this.has('noear') || this.has('bolt'), ok: okAll };
  },
  table() {
    const a = this.analyse(), S = G.S, b = this.body;
    b.querySelector('.stamps').innerHTML = [[a.frost, tr('Ayaz', 'Frost')], [a.cold, tr('Soğuk ve gün uzunluğu', 'Cold and day length')], [a.ok, tr('Her bitkiye doğru ay', 'A right month for every crop')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.frost && a.cold && a.ok && !S.flags.ekimDone) {
      S.flags.ekimDone = true;
      const head = [tr('Bitki', 'Crop'), ...this.TESTS.map(t => t.n)];
      const rows = this.SAMPLES.map(s => [s.n, ...this.TESTS.map(t => this.st.seen[`${s.id}:${t.id}`] ? this.RES[s.id][t.id][1] : '—')]);
      S.journal.exps.push({ title: tr('Ekim takvimi', 'Sowing calendar'), code: 'BİY.10.2.1', t: Date.now(), head, rows,
        note: tr('Çimlenme ve büyüme sıcaklığa, suya ve ışığa bağlıdır; ama “ne kadar sıcak o kadar iyi” değildir. Ayaz, don hassası bitkileri (domates, nohut fidesi) öldürür. Kışlık buğday çiçeklenmek için birkaç hafta soğuk ister (vernalizasyon): baharda ekilirse başak vermez. Ispanak uzun günlerde (≈14 saatten fazla) sapa kalkıp tohuma kaçar. Her bitkinin ekim zamanı, bu abiyotik etmenlere göre seçilir.', 'Germination and growth depend on temperature, water and light, but “warmer is always better” is wrong. Frost kills frost-tender plants (tomato, chickpea seedlings). Winter wheat needs several weeks of cold before it can flower (vernalisation): sown in spring it never makes ears. Spinach bolts to seed in long days (more than ≈14 hours). Each crop’s sowing time is chosen around these abiotic factors.') });
      this._msg(tr('Her bitkinin doğru ayı bulundu! Takvim defterinde.', 'A right month for every crop! The calendar is in your journal.'));
      if (Q.at('ekim', 'sow')) { UI.stamp(L(tr('TAKVİM HAZIR', 'CALENDAR READY'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('ekim', 'sow') && G.S.flags.ekimDone) {
      await ask('ekim_frost');
      await ask('ekim_wheat');
      await UI.say('player', tr('Fatma Teyze’ye takvimi göstereyim.', 'Let me show Fatma Teyze the calendar.'));
      Q.adv('ekim');
    }
  },
};
