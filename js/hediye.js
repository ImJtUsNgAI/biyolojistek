'use strict';
// Nazlı Teyze's gift: a tin of olive oil from her sister's grove in Ayvalık. Before it goes on the shelf we test it
// against butter, sunflower oil and plain water (the control) on four simple benches. Every cell is one observation.
const HEDIYE = {
  SAMPLES: [
    { id: 'zeytin', icon: '🫒', n: tr('Zeytinyağı (hediye)', 'Olive oil (the gift)') },
    { id: 'tere', icon: '🧈', n: tr('Tereyağı', 'Butter') },
    { id: 'aycicek', icon: '🌻', n: tr('Ayçiçek yağı', 'Sunflower oil') },
    { id: 'su', icon: '💧', n: tr('Su (kontrol)', 'Water (control)') },
  ],
  TESTS: [
    { id: 'kagit', icon: '📄', n: tr('Kese kâğıdı lekesi', 'Brown-paper spot') },
    { id: 'sudan', icon: '🔴', n: tr('Sudan III boyası', 'Sudan III stain') },
    { id: 'dolap', icon: '❄️', n: tr('Buzdolabı, 4 °C', 'Fridge, 4 °C') },
    { id: 'emul', icon: '🫧', n: tr('Su + sabunla çalkala', 'Shake with water + soap') },
  ],
  RES: {
    zeytin: {
      kagit: ['fat', tr('Yarı saydam leke; kuruyunca da kalıyor.', 'A see-through spot that stays when dry.')],
      sudan: ['fat', tr('Boya yağa geçti: üstte kırmızı bir yağ tabakası.', 'The dye went into the oil: a red oily layer on top.')],
      dolap: ['cloud', tr('Bulanıklaştı, dipte beyaz topaklar. Tam donmadı.', 'Went cloudy with white clumps at the bottom. Not fully solid.')],
      emul: ['emul', tr('Sabunsuz iki kat ayrıldı; sabunla süt gibi karıştı ve öyle kaldı.', 'Without soap it split in two; with soap it went milky and stayed mixed.')],
    },
    tere: {
      kagit: ['fat', tr('Parmakla sürünce yarı saydam leke; kalıcı.', 'Rubbed on, it leaves a see-through spot that stays.')],
      sudan: ['fat', tr('Eritince boya yağa geçti, kırmızı tabaka.', 'Once melted, the dye went into the fat: a red layer.')],
      dolap: ['solid', tr('Taş gibi sert bir kalıp.', 'A rock-hard block.')],
      emul: ['emul', tr('Önce eritmek gerekti; sonra sabunla süt gibi karıştı.', 'It had to be melted first; then with soap it went milky.')],
    },
    aycicek: {
      kagit: ['fat', tr('Yarı saydam leke; kuruyunca da kalıyor.', 'A see-through spot that stays when dry.')],
      sudan: ['fat', tr('Boya yağa geçti: üstte kırmızı bir yağ tabakası.', 'The dye went into the oil: a red oily layer on top.')],
      dolap: ['liquid', tr('Pırıl pırıl berrak, hâlâ akıyor.', 'Crystal clear and still runny.')],
      emul: ['emul', tr('Sabunsuz iki kat ayrıldı; sabunla süt gibi karıştı ve öyle kaldı.', 'Without soap it split in two; with soap it went milky and stayed mixed.')],
    },
    su: {
      kagit: ['none', tr('Islak leke, ama kuruyunca kayboldu.', 'A wet patch, but it vanished when dry.')],
      sudan: ['none', tr('Boya suda çözünmedi; kırmızı zerrecikler dibe çöktü.', 'The dye did not dissolve; red specks sank to the bottom.')],
      dolap: ['liquid', tr('Soğudu ama sıvı. Su 0 °C’de donar.', 'Cold but liquid. Water freezes at 0 °C.')],
      emul: ['none', tr('Tek bir berrak katman; köpükten başka bir şey yok.', 'One clear layer; nothing but suds.')],
    },
  },
  open() {
    const S = G.S;
    this.st = S.hediye || (S.hediye = { seen: {} });
    const body = h('div', 'kit hediye');
    body.innerHTML = `<div class="hd-grid"></div><div class="hd-mol"></div><div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Nazlı Teyze’nin hediyesi · Yağ deneyleri', 'Nazlı Teyze’s gift · Testing fats'), code: 'BİY.9.2.2', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her kutuya bas: o örneğe o testi uygula. Su, yağ olmayan kontroldür.', 'Tap a box to run that test on that sample. Water is the no-fat control.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const k = b.dataset.cell; if (!k || this.st.seen[k]) return;
    this.st.seen[k] = 1;
    const [, tid] = k.split(':');
    AU.sfx(tid === 'emul' ? 'splash' : tid === 'dolap' ? 'collect' : 'pen');
    const [sid] = k.split(':'), r = this.RES[sid][tid];
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
          : `<button class="hd-c" data-cell="${k}">${L(tr('Dene', 'Test'))}</button>`;
      }
    }
    b.querySelector('.hd-grid').innerHTML = g;
    // once the fridge column is complete, show why: straight chains stack, kinked ones don't
    b.querySelector('.hd-mol').innerHTML = !this.col('dolap') ? '' : `<svg viewBox="0 0 320 110">
      <rect x="6" y="12" width="26" height="86" rx="4" class="hd-gly"/><text x="19" y="58" text-anchor="middle" transform="rotate(-90 19 58)">${L(tr('gliserol', 'glycerol'))}</text>
      <path d="M32 26 H140" class="hd-fa"/><path d="M32 55 H80 L96 72 H150" class="hd-fa kink"/><path d="M32 84 H70 L86 100 H112 L128 84 H150" class="hd-fa kink"/>
      <text x="160" y="30">${L(tr('doymuş: düz zincir, sıkı dizilir → katı (tereyağı)', 'saturated: straight chain, packs tight → solid (butter)'))}</text>
      <text x="160" y="60">${L(tr('tekli doymamış: bir kırık (zeytinyağı)', 'monounsaturated: one kink (olive oil)'))}</text>
      <text x="160" y="90">${L(tr('çoklu doymamış: çok kırık → sıvı (ayçiçek)', 'polyunsaturated: many kinks → liquid (sunflower)'))}</text></svg>`;
    this.table();
  },
  analyse() { return { lipid: this.col('kagit') && this.col('sudan'), cold: this.col('dolap'), emul: this.col('emul') }; },
  table() {
    const a = this.analyse(), S = G.S, b = this.body;
    b.querySelector('.stamps').innerHTML = [[a.lipid, tr('Yağ testleri', 'Fat tests')], [a.cold, tr('Soğukta karşılaştırma', 'Cold comparison')], [a.emul, tr('Emülsiyon', 'Emulsion')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.lipid && a.cold && a.emul && !S.flags.hediyeDone) {
      S.flags.hediyeDone = true;
      const head = [tr('Örnek', 'Sample'), ...this.TESTS.map(t => t.n)];
      const rows = this.SAMPLES.map(s => [s.n, ...this.TESTS.map(t => this.RES[s.id][t.id][1])]);
      S.journal.exps.push({ title: tr('Nazlı Teyze’nin zeytinyağı', 'Nazlı Teyze’s olive oil'), code: 'BİY.9.2.2', t: Date.now(), head, rows,
        note: tr('Yağlar (trigliseritler) bir gliserol ile üç yağ asidinden oluşur ve suda çözünmez: kâğıtta kalıcı leke bırakır, Sudan III ile kırmızı boyanır. Doymuş yağ asitlerinin zinciri düzdür, sıkı dizilir, oda sıcaklığında katıdır (tereyağı ~%65 doymuş). Zeytinyağı çoğunlukla tekli doymamış oleik asittir (~%75): buzdolabında bulanıklaşır ama tam donmaz. Ayçiçek yağı çoğunlukla çoklu doymamıştır, soğukta bile sıvı kalır. Sabun (ya da safra) yağı küçük damlacıklara ayırıp suda dağıtır: emülsiyon.', 'Fats (triglycerides) are one glycerol plus three fatty acids and do not dissolve in water: they leave a lasting spot on paper and stain red with Sudan III. Saturated fatty acids have straight chains that pack tightly, so they are solid at room temperature (butter is ~65% saturated). Olive oil is mostly monounsaturated oleic acid (~75%): it clouds in the fridge but does not set hard. Sunflower oil is mostly polyunsaturated and stays liquid even when cold. Soap (or bile) breaks fat into tiny droplets spread through water: an emulsion.') });
      this._msg(tr('On altı gözlem tamam! Tablo defterinde.', 'All sixteen observations! The table is in your journal.'));
      if (Q.at('hediye', 'test')) { UI.stamp(L(tr('HALİS ZEYTİNYAĞI', 'PURE OLIVE OIL'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('hediye', 'test') && G.S.flags.hediyeDone) {
      await ask('hediye_cold');
      await ask('hediye_soap');
      await UI.say('player', tr('Nazlı Teyze’ye teşekkür edip ne bulduğumu söyleyeyim.', 'Let me thank Nazlı Teyze and tell her what I found.'));
      Q.adv('hediye');
    }
  },
};
