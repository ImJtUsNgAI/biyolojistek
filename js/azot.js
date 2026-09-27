'use strict';
// Osman's wheat: the strip where chickpeas grew last year is deep green, the other strip is pale, oldest leaves first.
// Dig up a chickpea root and a wheat root, then build the nitrogen cycle arrow by arrow, then point at the arrow
// that made the difference in the field.
const AZOT = {
  NODES: { n2: [170, 22, 'N₂'], nh4: [58, 72, 'NH₄⁺'], no3: [282, 72, 'NO₃⁻'], bitki: [282, 162, tr('Bitki', 'Plant')], hayvan: [170, 190, tr('Hayvan', 'Animal')], olu: [58, 162, tr('Ölü madde', 'Dead matter')] },
  SLOTS: [
    { a: 'n2', b: 'nh4', ans: 'bag', hint: tr('Havadaki N₂’nin üçlü bağı çok sağlam; onu yalnızca bazı bakteriler (ve yıldırım) koparabilir.', 'The triple bond in air’s N₂ is very strong; only some bacteria (and lightning) can break it.') },
    { a: 'nh4', b: 'no3', ans: 'nitr', hint: tr('Amonyum toprakta başka bir iyona çevriliyor; bunu oksijen seven bakteriler yapar.', 'Ammonium is turned into another ion in the soil; oxygen-loving bacteria do it.') },
    { a: 'no3', b: 'bitki', ans: 'alim', hint: tr('Bitki azotu havadan değil, topraktan, suda çözünmüş nitrat olarak alır.', 'The plant takes nitrogen from the soil as dissolved nitrate, not from the air.') },
    { a: 'bitki', b: 'hayvan', ans: 'besl', hint: tr('Hayvan azotu nasıl alır? Proteini yiyerek.', 'How does an animal get nitrogen? By eating protein.') },
    { a: 'hayvan', b: 'olu', ans: 'olum', hint: tr('Canlının azotu toprağa ne zaman geri döner?', 'When does a living thing’s nitrogen go back to the soil?') },
    { a: 'olu', b: 'nh4', ans: 'amon', hint: tr('Ayrıştırıcılar ölü proteini parçalayınca ilk hangi azot bileşiği çıkar?', 'When decomposers break down dead protein, which nitrogen compound comes out first?') },
    { a: 'no3', b: 'n2', ans: 'denit', hint: tr('Su basmış, oksijensiz toprakta bazı bakteriler nitratı havaya geri yollar.', 'In waterlogged, airless soil some bacteria send nitrate back to the air.') },
  ],
  CARDS: {
    bag: tr('Azot bağlama (Rhizobium, yıldırım)', 'Nitrogen fixation (Rhizobium, lightning)'),
    nitr: tr('Nitrifikasyon (Nitrosomonas, Nitrobacter)', 'Nitrification (Nitrosomonas, Nitrobacter)'),
    alim: tr('Kökle alım', 'Uptake by roots'),
    besl: tr('Beslenme (besin zinciri)', 'Feeding (food chain)'),
    olum: tr('Ölüm ve boşaltım (dışkı, idrar)', 'Death and excretion (dung, urine)'),
    amon: tr('Amonifikasyon (ayrıştırıcılar)', 'Ammonification (decomposers)'),
    denit: tr('Denitrifikasyon (oksijensiz toprak)', 'Denitrification (airless soil)'),
    foto: tr('Fotosentez', 'Photosynthesis'),
    terle: tr('Terleme', 'Transpiration'),
  },
  WRONG: { foto: tr('Fotosentez karbonu bağlar, azotu değil.', 'Photosynthesis fixes carbon, not nitrogen.'), terle: tr('Terleme yapraktan su kaybıdır; azotla ilgisi yok.', 'Transpiration is water lost from leaves; nothing to do with nitrogen.') },
  open() {
    const S = G.S;
    this.st = S.azot || (S.azot = { dug: {}, slots: {}, mist: 0, diag: false });
    this.sel = null;
    const body = h('div', 'kit azot');
    body.innerHTML = `<div class="az-roots"></div><div class="az-cycle"></div><div class="az-cards"></div><div class="az-diag"></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Osman’ın tarlası · Azot döngüsü', 'Osman’s field · The nitrogen cycle'), code: 'BİY.10.2.4', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Önce iki şeritten birer kök kaz.', 'First dig up a root from each strip.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const st = this.st, d = b.dataset;
    if (d.dig) {
      st.dug[d.dig] = 1; AU.sfx('dig');
      this._msg(d.dig === 'nohut'
        ? tr('Nohut kökünde boncuk gibi yumrular (nodül). Birini kestin: içi pembe! Bu pembelik leghemoglobinden; içindeki Rhizobium bakterileri havadaki N₂’yi bağlıyor.', 'Bead-like lumps (nodules) on the chickpea root. You cut one open: pink inside! The pink is leghaemoglobin; the Rhizobium bacteria inside are fixing N₂ from the air.')
        : tr('Buğday kökü ince ve saçak; hiç yumru yok. Buğday azotu yalnızca topraktan alabilir.', 'The wheat root is thin and fibrous with no lumps at all. Wheat can only take nitrogen from the soil.'));
    } else if (d.slot != null) { this.sel = +d.slot; AU.sfx('click'); this._msg(tr('Şimdi bu oka uyan süreci seç.', 'Now pick the process that fits this arrow.')); }
    else if (d.card) {
      if (this.sel == null) { this._msg(tr('Önce döngüde boş bir oka bas.', 'First tap an empty arrow in the cycle.')); return; }
      const s = this.SLOTS[this.sel];
      if (d.card === s.ans) { st.slots[this.sel] = s.ans; this.sel = null; AU.sfx('collect'); this._msg(tr('Doğru ok!', 'Right arrow!')); }
      else { st.mist++; AU.sfx('click'); this._msg(this.WRONG[d.card] || s.hint); }
    } else if (d.diag != null) {
      if (+d.diag === 0) { st.diag = true; AU.sfx('success'); this._msg(tr('Evet: geçen yılın nohut nodülleri havadaki azotu bağladı; kökler ve yapraklar çürüyünce bu azot toprağa kaldı, bu yıl buğday onu aldı.', 'Yes: last year’s chickpea nodules fixed nitrogen from the air; when the roots and leaves rotted, that nitrogen stayed in the soil, and this year the wheat took it up.')); }
      else { st.mist++; AU.sfx('click'); this._msg(tr('Bu ok iki şeritte de aynı çalışıyor. Farkı yaratan, yalnızca nohutun köklerinde olan şeydi.', 'That arrow works the same in both strips. The difference is something only the chickpea roots had.')); }
    }
    this.draw(); G.save();
  },
  full() { return this.SLOTS.every((s, i) => this.st.slots[i]); },
  draw() {
    const st = this.st, b = this.body, dug = st.dug.nohut && st.dug.bugday;
    b.querySelector('.az-roots').innerHTML = [['nohut', '🌱', tr('Yeşil şerit (geçen yıl nohut)', 'Green strip (chickpeas last year)')], ['bugday', '🌾', tr('Soluk şerit (yalnız buğday)', 'Pale strip (wheat only)')]]
      .map(([k, ic, n]) => `<button data-dig="${k}" class="${st.dug[k] ? 'on' : ''}" ${st.dug[k] ? 'disabled' : ''}>${ic} ${L(n)}<br><small>${st.dug[k] ? (k === 'nohut' ? L(tr('pembe nodüller ●●●', 'pink nodules ●●●')) : L(tr('yumru yok', 'no nodules'))) : L(tr('⛏ Kök kaz', '⛏ Dig a root'))}</small></button>`).join('');
    const N = this.NODES;
    let svg = `<defs><marker id="azh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="az-hd"/></marker></defs>`;
    this.SLOTS.forEach((s, i) => {
      const [x1, y1] = N[s.a], [x2, y2] = N[s.b], bend = i === 0 ? -1 : i === 6 ? 1 : 0;
      const mx = (x1 + x2) / 2 + bend * 14, my = (y1 + y2) / 2 - Math.abs(bend) * 10, done = st.slots[i], on = this.sel === i;
      svg += `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" class="az-ar ${done ? 'ok' : ''}" marker-end="url(#azh)"/>`;
      svg += `<g class="az-lb ${on ? 'sel' : ''} ${done ? 'ok' : ''}"><circle cx="${mx}" cy="${my}" r="11"/><text x="${mx}" y="${my + 4}" text-anchor="middle">${i + 1}</text></g>`;
    });
    for (const k in N) { const [x, y, t] = N[k]; svg += `<g class="az-nd"><rect x="${x - 34}" y="${y - 12}" width="68" height="24" rx="12"/><text x="${x}" y="${y + 5}" text-anchor="middle">${U.esc(typeof t === 'string' ? t : L(t))}</text></g>`; }
    b.querySelector('.az-cycle').innerHTML = !dug ? '' : `<svg viewBox="0 0 340 210">${svg}</svg><div class="az-slots">${this.SLOTS.map((s, i) => {
      const na = N[s.a][2], nb = N[s.b][2], lab = x => typeof x === 'string' ? x : L(x);
      return `<button data-slot="${i}" class="${this.sel === i ? 'sel' : ''} ${st.slots[i] ? 'on' : ''}" ${st.slots[i] ? 'disabled' : ''}>${i + 1}. ${U.esc(lab(na))} → ${U.esc(lab(nb))}: <b>${st.slots[i] ? U.esc(L(this.CARDS[st.slots[i]])) : '…'}</b></button>`;
    }).join('')}</div>`;
    const used = new Set(Object.values(st.slots));
    b.querySelector('.az-cards').innerHTML = !dug || this.full() ? '' : Object.keys(this.CARDS).filter(k => !used.has(k)).map(k => `<button data-card="${k}">${U.esc(L(this.CARDS[k]))}</button>`).join('');
    b.querySelector('.az-diag').innerHTML = !this.full() || st.diag ? '' : `<p><b>${L(tr('Tarla teşhisi:', 'Field diagnosis:'))}</b> ${L(tr('Geçen yıl nohut ekilen şerit neden bu yıl daha yeşil? Farkı yaratan oku seç.', 'Why is the strip that had chickpeas last year greener this year? Pick the arrow that made the difference.'))}</p>
      ${this.SLOTS.map((s, i) => `<button data-diag="${i}">${i + 1}</button>`).join('')}`;
    this.table();
  },
  table() {
    const st = this.st, S = G.S, b = this.body, nod = st.dug.nohut && st.dug.bugday, full = this.full();
    b.querySelector('.stamps').innerHTML = [[nod, tr('Nodül bulundu', 'Nodules found')], [full, tr('Döngü 7/7', 'Cycle 7/7')], [st.diag, tr('Tarla teşhisi', 'Field diagnosis')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (nod && full && st.diag && !S.flags.azotDone) {
      S.flags.azotDone = true;
      const head = [tr('Ok', 'Arrow'), tr('Süreç', 'Process')], N = this.NODES, lab = x => typeof x === 'string' ? x : x;
      const rows = this.SLOTS.map(s => [`${lab(N[s.a][2])} → ${lab(N[s.b][2])}`, this.CARDS[s.ans]]);
      S.journal.exps.push({ title: tr('Azot döngüsü', 'The nitrogen cycle'), code: 'BİY.10.2.4', t: Date.now(), head, rows,
        note: tr('Havanın %78’i azottur ama bitkiler N₂’yi kullanamaz. Baklagil köklerindeki Rhizobium bakterileri onu amonyuma bağlar; toprak bakterileri amonyumu nitrata çevirir (nitrifikasyon); bitki nitratı kökle alıp protein ve klorofil yapar. Azot besin zinciriyle hayvana geçer, ölüm ve boşaltımla toprağa döner; ayrıştırıcılar onu yeniden amonyuma çevirir. Oksijensiz toprakta nitrat N₂ olarak havaya kaçar (denitrifikasyon). Azot eksik bitki yaşlı yapraklarından başlayarak sararır, çünkü azot yaşlı yapraktan genç yaprağa taşınır. Münavebe (nohut → buğday) bu yüzden işe yarar.', 'Air is 78% nitrogen, but plants can’t use N₂. Rhizobium bacteria in legume roots fix it into ammonium; soil bacteria turn ammonium into nitrate (nitrification); the plant takes nitrate up through its roots to make protein and chlorophyll. Nitrogen passes to animals along the food chain and returns to the soil by death and excretion; decomposers turn it back into ammonium. In airless soil, nitrate escapes to the air as N₂ (denitrification). A nitrogen-starved plant yellows from its oldest leaves first, because nitrogen is moved from old leaves to young ones. That is why crop rotation (chickpea → wheat) works.') });
      this._msg(tr('Üç damga da tamam! Döngü defterinde.', 'All three stamps! The cycle is in your journal.'));
      if (Q.at('azot', 'cycle')) { UI.stamp(L(tr('DÖNGÜ TAMAM', 'CYCLE CLOSED'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('azot', 'cycle') && G.S.flags.azotDone) {
      await ask('azot_yellow');
      await ask('azot_rotate');
      await UI.say('player', tr('Osman Amca’ya anlatayım: gübresi geçen yılın nohutuymuş.', 'Let me tell Osman: his fertiliser was last year’s chickpeas.'));
      Q.adv('azot');
    }
  },
};
