'use strict';
// Deniz's ash question. Four foods burnt in Nazlı Teyze's oven: weigh what is left, then drop-test the ash for four
// ions. What doesn't burn is the mineral salts: no energy in them, but every organelle needs one of them to work.
const KUL = {
  SAMPLES: [
    { id: 'ispanak', icon: '🥬', n: tr('Ispanak', 'Spinach') },
    { id: 'sut', icon: '🥛', n: tr('Süt', 'Milk') },
    { id: 'ciger', icon: '🍖', n: tr('Ciğer', 'Liver') },
    { id: 'kemik', icon: '🦴', n: tr('Kemik', 'Bone') },
  ],
  TESTS: [
    { id: 'yak', icon: '⚖️', n: tr('Yak ve tart', 'Burn and weigh') },
    { id: 'cl', icon: '⚪', n: tr('Klorür · gümüş nitrat', 'Chloride · silver nitrate') },
    { id: 'ca', icon: '🤍', n: tr('Kalsiyum · oksalat', 'Calcium · oxalate') },
    { id: 'po', icon: '🟡', n: tr('Fosfat · molibdat', 'Phosphate · molybdate') },
    { id: 'fe', icon: '🔴', n: tr('Demir · tiyosiyanat', 'Iron · thiocyanate') },
  ],
  RES: {
    ispanak: {
      yak: ['ash', tr('100 g → 1,5 g gri kül. Kalanı suydu (91 g) ya da yanıp gitti.', '100 g → 1.5 g of grey ash. The rest was water (91 g) or burnt away.')],
      cl: ['weak', tr('Hafif beyaz bulanıklık: biraz klorür.', 'A faint white haze: a little chloride.')],
      ca: ['pos', tr('Beyaz çökelti: kalsiyum var. (Ama ıspanağın oksalatı onu bağlar, vücut azını alır.)', 'White precipitate: calcium. (But spinach’s oxalate binds it, so the body takes up little.)')],
      po: ['weak', tr('Soluk sarı: biraz fosfat.', 'Pale yellow: a little phosphate.')],
      fe: ['pos', tr('Kırmızı: demir var.', 'Red: iron is there.')],
    },
    sut: {
      yak: ['ash', tr('100 g → 0,7 g beyaz kül. Sütün %87’si suymuş.', '100 g → 0.7 g of white ash. Milk is 87% water.')],
      cl: ['pos', tr('Beyaz bulut: klorür var.', 'A white cloud: chloride.')],
      ca: ['strong', tr('Bol beyaz çökelti: çok kalsiyum.', 'Lots of white precipitate: plenty of calcium.')],
      po: ['strong', tr('Koyu sarı: çok fosfat.', 'Deep yellow: plenty of phosphate.')],
      fe: ['neg', tr('Renk değişmedi: sütte demir çok az.', 'No colour: milk has very little iron.')],
    },
    ciger: {
      yak: ['ash', tr('100 g → 1,3 g kül.', '100 g → 1.3 g of ash.')],
      cl: ['pos', tr('Beyaz bulut: klorür var.', 'A white cloud: chloride.')],
      ca: ['weak', tr('Çok az çökelti.', 'Very little precipitate.')],
      po: ['strong', tr('Koyu sarı: çok fosfat. Ciğer hücreleri DNA ve ATP dolu.', 'Deep yellow: plenty of phosphate. Liver cells are full of DNA and ATP.')],
      fe: ['strong', tr('Kan kırmızısı! Ciğer vücudun demir deposudur.', 'Blood red! The liver is the body’s iron store.')],
    },
    kemik: {
      yak: ['ash', tr('100 g → 60 g bembeyaz kül! Kemiğin çoğu yanmayan tuz.', '100 g → 60 g of bright white ash! Most of bone is salt that doesn’t burn.')],
      cl: ['neg', tr('Neredeyse hiç bulanıklık yok.', 'Hardly any haze.')],
      ca: ['strong', tr('Tüp bembeyaz çökeltiyle doldu.', 'The tube filled with white precipitate.')],
      po: ['strong', tr('Koyu sarı. Kemik, kalsiyum fosfattan örülmüş.', 'Deep yellow. Bone is built of calcium phosphate.')],
      fe: ['neg', tr('Renk yok.', 'No colour.')],
    },
  },
  ORG: { mito: tr('Mitokondri', 'Mitochondrion'), klor: tr('Kloroplast', 'Chloroplast'), cek: tr('Çekirdek', 'Nucleus'), rib: tr('Ribozom', 'Ribosome'), lizo: tr('Lizozom', 'Lysosome'), golgi: tr('Golgi', 'Golgi body'), er: tr('Endoplazmik retikulum', 'Endoplasmic reticulum'), zar: tr('Hücre zarı', 'Cell membrane'), ceper: tr('Hücre çeperi', 'Cell wall') },
  MATCH: [
    { id: 'fe', ion: 'Fe²⁺', ok: 'mito', opts: ['golgi', 'mito', 'lizo'],
      no: tr('Demir, oksijenle enerji üreten organelde çalışır.', 'Iron works in the organelle that makes energy with oxygen.'),
      why: tr('Mitokondride elektron taşıyan sitokromların merkezinde demir var; hücre solunumu onsuz durur.', 'Iron sits at the heart of the cytochromes that pass electrons along in the mitochondrion; cell respiration stops without it.') },
    { id: 'mg', ion: 'Mg²⁺', ok: 'klor', opts: ['klor', 'cek', 'lizo'],
      no: tr('Magnezyum yeşil pigmentin tam ortasında. Yeşil organel hangisi?', 'Magnesium sits in the middle of the green pigment. Which organelle is green?'),
      why: tr('Her klorofil molekülünün ortasında bir magnezyum atomu var. Magnezyum eksik yaprak sararır.', 'Every chlorophyll molecule has a magnesium atom at its centre. Leaves short of magnesium turn yellow.') },
    { id: 'po', ion: 'PO₄³⁻', ok: 'cek', opts: ['ceper', 'lizo', 'cek'],
      no: tr('DNA’nın iskeletinde fosfat var. DNA en çok nerede?', 'Phosphate is in the backbone of DNA. Where is most DNA?'),
      why: tr('DNA’nın iskeleti şeker-fosfat zinciridir. Fosfat ayrıca her ATP’de ve her zarın fosfolipitinde var.', 'DNA’s backbone is a sugar-phosphate chain. Phosphate is also in every ATP and in the phospholipids of every membrane.') },
    { id: 'ca', ion: 'Ca²⁺', ok: 'er', opts: ['rib', 'er', 'cek'],
      no: tr('Kas hücresinde kalsiyumu depolayıp sinyal gelince salan kanal ağı hangisi?', 'In a muscle cell, which network of channels stores calcium and lets it out on a signal?'),
      why: tr('Kas hücresinde ER kalsiyum depolar; sinir sinyali gelince salar ve kas kasılır.', 'In a muscle cell the ER stores calcium; when a nerve signal arrives it lets it out and the muscle contracts.') },
    { id: 'na', ion: 'Na⁺ / K⁺', ok: 'zar', opts: ['rib', 'klor', 'zar'],
      no: tr('Bu iki iyon hücrenin içiyle dışı arasında pompalanır. Sınır neresi?', 'These two ions are pumped between the inside and outside of the cell. Where is the border?'),
      why: tr('Hücre zarındaki Na⁺/K⁺ pompası ATP harcayarak iyonları taşır: aktif taşıma. Sinirler bu farkla çalışır.', 'The Na⁺/K⁺ pump in the cell membrane moves the ions using ATP: active transport. Nerves run on this difference.') },
  ],
  open() {
    const S = G.S;
    this.st = S.kul || (S.kul = { seen: {}, match: {} });
    const body = h('div', 'kit hediye kul');
    body.innerHTML = `<div class="hd-grid"></div><div class="kl-match"></div><div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Deniz’in kül deneyi · Yanmayan şey', 'Deniz’s ash test · What doesn’t burn'), code: 'BİY.9.2.1', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Önce her besini yakıp külünü tart, sonra külü dört damla testiyle incele.', 'First burn each food and weigh the ash, then test the ash with four drop tests.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const d = b.dataset;
    if (d.ion) {
      const m = this.MATCH.find(x => x.id === d.ion);
      if (d.org === m.ok) { this.st.match[m.id] = 1; AU.sfx('collect'); this._msg(m.why); } else { AU.sfx('pen'); this._msg(m.no); }
      this.draw(); G.save(); return;
    }
    const k = d.cell; if (!k || this.st.seen[k]) return;
    this.st.seen[k] = 1;
    const [sid, tid] = k.split(':'), r = this.RES[sid][tid];
    AU.sfx(tid === 'yak' ? 'pen' : 'splash');
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
          : `<button class="hd-c" data-cell="${k}">${L(t.id === 'yak' ? tr('Yak', 'Burn') : tr('Damlat', 'Add drops'))}</button>`;
      }
    }
    b.querySelector('.hd-grid').innerHTML = g;
    // once the four ion columns are done: where does each salt work in the cell?
    const a = this.analyse(), mt = this.st.match;
    b.querySelector('.kl-match').innerHTML = !a.ions ? '' : `<p class="kl-q">${L(tr('Bu tuzlar hücrede nerede iş görür?', 'Where in the cell do these salts work?'))}</p>`
      + this.MATCH.map(m => `<div class="kl-row"><b>${m.ion}</b>${m.opts.map(o => `<button data-ion="${m.id}" data-org="${o}" ${mt[m.id] ? 'disabled' : ''} class="${mt[m.id] && o === m.ok ? 'on' : ''}">${U.esc(L(this.ORG[o]))}</button>`).join('')}</div>`).join('');
    this.table();
  },
  analyse() { return { ash: this.col('yak'), ions: ['cl', 'ca', 'po', 'fe'].every(t => this.col(t)), org: this.MATCH.every(m => this.st.match[m.id]) }; },
  table() {
    const a = this.analyse(), S = G.S, b = this.body;
    b.querySelector('.stamps').innerHTML = [[a.ash, tr('Kül', 'Ash')], [a.ions, tr('Dört iyon', 'Four ions')], [a.org, tr('Hücrede yerleri', 'Their place in the cell')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.ash && a.ions && a.org && !S.flags.kulDone) {
      S.flags.kulDone = true;
      const head = [tr('Besin', 'Food'), ...this.TESTS.map(t => t.n)];
      const rows = this.SAMPLES.map(s => [s.n, ...this.TESTS.map(t => this.RES[s.id][t.id][1])]);
      S.journal.exps.push({ title: tr('Yanmayan şey: kül analizi', 'What doesn’t burn: ash analysis'), code: 'BİY.9.2.1', t: Date.now(), head, rows,
        note: tr('Bir besin yakılınca su buharlaşır, organik maddeler (karbonhidrat, yağ, protein) CO₂ ve suya yanar. Geriye kalan kül, inorganik mineral tuzlarıdır. Tuzlar enerji vermez ama hücrenin her yerinde iş görür: Fe²⁺ mitokondride solunumda, Mg²⁺ kloroplastta klorofilin ortasında, fosfat çekirdekte DNA’da ve her ATP’de, Ca²⁺ kasta ER’den salınarak kasılmada, Na⁺/K⁺ hücre zarındaki pompada. Kemik ağırlığının yarısından çoğu kalsiyum fosfattır.', 'When a food is burnt, the water evaporates and the organic matter (carbohydrate, fat, protein) burns to CO₂ and water. The ash left behind is the inorganic mineral salts. Salts give no energy but work all over the cell: Fe²⁺ in respiration in the mitochondrion, Mg²⁺ at the centre of chlorophyll in the chloroplast, phosphate in DNA in the nucleus and in every ATP, Ca²⁺ released from the ER to make muscle contract, Na⁺/K⁺ in the pump in the cell membrane. More than half of bone’s weight is calcium phosphate.') });
      this._msg(tr('Kül çözüldü! Tablo defterinde.', 'The ash is solved! The table is in your journal.'));
      if (Q.at('kul', 'test')) { UI.stamp(L(tr('KÜL KONUŞTU', 'THE ASH SPOKE'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('kul', 'test') && G.S.flags.kulDone) {
      await ask('kul_energy');
      await ask('kul_organelle');
      await UI.say('player', tr('Deniz’e külün sırrını anlatayım.', 'Let me tell Deniz the secret of the ash.'));
      Q.adv('kul');
    }
  },
};
