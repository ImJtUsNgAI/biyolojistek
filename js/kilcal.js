'use strict';
// Elif's water tricks at the spring. Four little tests, each done with plain water and with soapy water (the soap
// breaks up the hydrogen bonds at the surface). Cohesion holds water to water; adhesion pulls it onto glass and cellulose.
const KILCAL = {
  SAMPLES: [
    { id: 'su', icon: '💧', n: tr('Kaynak suyu', 'Spring water') },
    { id: 'sabun', icon: '🫧', n: tr('Sabunlu su', 'Soapy water') },
  ],
  TESTS: [
    { id: 'para', icon: '🪙', n: tr('Madeni paraya damla', 'Drops on a coin') },
    { id: 'atas', icon: '📎', n: tr('Suya ataş bırak', 'A paper clip on water') },
    { id: 'boru', icon: '🧪', n: tr('İnce ve kalın cam boru', 'Thin and wide glass tubes') },
    { id: 'kereviz', icon: '🌿', n: tr('Boyalı suda kereviz', 'Celery in dyed water') },
  ],
  RES: {
    su: {
      para: ['coh', tr('27 damla! Su paranın üstünde kubbe gibi kabardı, sonra taştı.', '27 drops! The water domed up over the coin before it spilled.')],
      atas: ['coh', tr('Ataş yüzeyde duruyor; su yüzeyi gerilmiş bir zar gibi çukurlaştı.', 'The clip sits on top; the surface dips like a stretched skin.')],
      boru: ['adh', tr('İnce boruda su 3 cm yükseldi, kalında 0,5 cm. Ne kadar ince, o kadar yüksek.', 'In the thin tube water rose 3 cm, in the wide one 0.5 cm. The thinner, the higher.')],
      kereviz: ['adh', tr('Bir saatte yaprak damarları maviye boyandı: su, gövdedeki ince borulardan çıktı.', 'In an hour the leaf veins turned blue: water climbed the fine tubes of the stalk.')],
    },
    sabun: {
      para: ['weak', tr('Sadece 9 damla; kubbe olmadan hemen yayılıp taştı.', 'Only 9 drops; it spread and spilled with no dome.')],
      atas: ['weak', tr('Ataş hemen battı. Sabun yüzey gerilimini bozdu.', 'The clip sank at once. Soap broke the surface tension.')],
      boru: ['weak', tr('İnce boruda yalnızca 1,2 cm. Yüzey gerilimi azalınca daha az yükseliyor.', 'Only 1.2 cm in the thin tube. Less surface tension, less rise.')],
      kereviz: ['weak', tr('Yine yükseldi ama daha yavaş, damarlar soluk.', 'It still rose but more slowly; the veins are pale.')],
    },
  },
  open() {
    const S = G.S;
    this.st = S.kilcal || (S.kilcal = { seen: {} });
    const body = h('div', 'kit hediye kilcal');
    body.innerHTML = `<div class="hd-grid"></div><div class="kc-fig"></div><div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Elif’in su numaraları · Kohezyon ve adezyon', 'Elif’s water tricks · Cohesion and adhesion'), code: 'BİY.9.2.1', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her deneyi hem sade suyla hem sabunlu suyla yap.', 'Do each test with plain water and with soapy water.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const k = b.dataset.cell; if (!k || this.st.seen[k]) return;
    this.st.seen[k] = 1;
    const [sid, tid] = k.split(':'), r = this.RES[sid][tid];
    AU.sfx(sid === 'sabun' ? 'splash' : 'pen');
    this._msg(r[1]);
    this.draw(); G.save();
  },
  col(tid) { return this.SAMPLES.every(s => this.st.seen[`${s.id}:${tid}`]); },
  draw() {
    const b = this.body, seen = this.st.seen;
    let g = `<div class="hd-h"></div>${this.TESTS.map(t => `<div class="hd-h">${t.icon}<br>${U.esc(L(t.n))}</div>`).join('')}`;
    for (const s of this.SAMPLES) {
      g += `<div class="hd-s">${s.icon} ${U.esc(L(s.n))}</div>`;
      for (const t of this.TESTS) {
        const k = `${s.id}:${t.id}`, r = this.RES[s.id][t.id];
        g += seen[k] ? `<button class="hd-c done r-${r[0]}" data-cell="${k}" disabled>${U.esc(L(r[1]))}</button>`
          : `<button class="hd-c" data-cell="${k}">${L(tr('Dene', 'Try'))}</button>`;
      }
    }
    b.querySelector('.hd-grid').innerHTML = g;
    // once the tube column is done: two tubes, the meniscus, and the pulls on a water molecule
    b.querySelector('.kc-fig').innerHTML = !this.col('boru') ? '' : `<svg viewBox="0 0 320 120">
      <rect x="10" y="84" width="110" height="28" class="kc-w"/>
      <rect x="30" y="20" width="8" height="84" class="kc-g"/><rect x="31" y="46" width="6" height="66" class="kc-w"/><path d="M31 48 Q34 42 37 48" class="kc-m"/>
      <rect x="70" y="20" width="26" height="84" class="kc-g"/><rect x="71" y="80" width="24" height="32" class="kc-w"/><path d="M71 82 Q83 74 95 82" class="kc-m"/>
      <circle cx="190" cy="60" r="9" class="kc-o"/><circle cx="160" cy="60" r="7" class="kc-o"/><circle cx="220" cy="60" r="7" class="kc-o"/><circle cx="190" cy="92" r="7" class="kc-o"/>
      <path d="M181 60 H168 M199 60 H212 M190 69 V84" class="kc-h"/><rect x="240" y="20" width="6" height="84" class="kc-g"/><path d="M226 60 H240" class="kc-a"/>
      <text x="160" y="22">${L(tr('– – kohezyon: su ↔ su', '– – cohesion: water ↔ water'))}</text>
      <text x="160" y="36">${L(tr('―― adezyon: su ↔ cam', '―― adhesion: water ↔ glass'))}</text>
      <text x="10" y="14">${L(tr('ince boruda yüksek', 'higher in a thin tube'))}</text></svg>`;
    this.table();
  },
  analyse() { return { coh: this.col('para') && this.col('atas'), adh: this.col('boru'), plant: this.col('kereviz') }; },
  table() {
    const a = this.analyse(), S = G.S, b = this.body;
    b.querySelector('.stamps').innerHTML = [[a.coh, tr('Kohezyon', 'Cohesion')], [a.adh, tr('Kılcallık', 'Capillarity')], [a.plant, tr('Bitkide', 'In a plant')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.coh && a.adh && a.plant && !S.flags.kilcalDone) {
      S.flags.kilcalDone = true;
      const head = [tr('Su', 'Water'), ...this.TESTS.map(t => t.n)];
      const rows = this.SAMPLES.map(s => [s.n, ...this.TESTS.map(t => this.RES[s.id][t.id][1])]);
      S.journal.exps.push({ title: tr('Suyun yapışkanlığı', 'Sticky water'), code: 'BİY.9.2.1', t: Date.now(), head, rows,
        note: tr('Su molekülleri polardır ve birbirine hidrojen bağlarıyla tutunur: kohezyon. Bu yüzden yüzeyde gerilim oluşur; para üstünde kubbe yapar, ataşı taşır. Su, cam ve selüloz gibi polar yüzeylere de tutunur: adezyon. İkisi birlikte suyu ince borularda yukarı çeker (kılcallık); boru inceldikçe su daha yükseğe çıkar. Bitkilerde ksilem boruları, kohezyon ve adezyon sayesinde su sütununu kopmadan yapraklara taşır. Sabun hidrojen bağlarının yüzeydeki etkisini azaltır: gerilim düşer, ataş batar.', 'Water molecules are polar and cling to one another by hydrogen bonds: cohesion. That gives the surface a tension: water domes on a coin and holds up a paper clip. Water also clings to polar surfaces such as glass and cellulose: adhesion. Together they pull water up narrow tubes (capillarity); the narrower the tube, the higher it rises. In plants the xylem vessels carry an unbroken column of water up to the leaves thanks to cohesion and adhesion. Soap weakens the hydrogen bonding at the surface: tension drops and the clip sinks.') });
      this._msg(tr('Sekiz deney tamam! Tablo defterinde.', 'All eight tests! The table is in your journal.'));
      if (Q.at('kilcal', 'tests')) { UI.stamp(L(tr('YAPIŞKAN SU', 'STICKY WATER'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('kilcal', 'tests') && G.S.flags.kilcalDone) {
      await ask('kilcal_climb');
      await ask('kilcal_soap');
      await UI.say('player', tr('Elif’e sonuçları anlatayım.', 'Let me tell Elif what I found.'));
      Q.adv('kilcal');
    }
  },
};
