'use strict';
// Nurse Zehra's digestion bench. Four foods, four stops along the gut: each cell mixes that food with the juice of that
// stop (the right enzyme, the right pH) at 37 °C and shows what is left. Starch starts in the mouth, protein in the
// stomach, fat only in the small intestine after bile — and nobody digests the lettuce.
const SINDIRIM = {
  SAMPLES: [
    { id: 'ekmek', icon: '🍞', n: tr('Ekmek (nişasta)', 'Bread (starch)') },
    { id: 'yumurta', icon: '🥚', n: tr('Haşlanmış yumurta akı (protein)', 'Boiled egg white (protein)') },
    { id: 'tere', icon: '🧈', n: tr('Tereyağı (yağ)', 'Butter (fat)') },
    { id: 'marul', icon: '🥬', n: tr('Marul (selüloz)', 'Lettuce (cellulose)') },
  ],
  TESTS: [
    { id: 'agiz', icon: '👄', n: tr('Ağız · tükürük, pH 7', 'Mouth · saliva, pH 7') },
    { id: 'mide', icon: '🫃', n: tr('Mide · mide öz suyu, pH 2', 'Stomach · gastric juice, pH 2') },
    { id: 'ince', icon: '〰️', n: tr('İnce bağırsak · safra + pankreas, pH 8', 'Small intestine · bile + pancreas, pH 8') },
    { id: 'kalin', icon: '🌀', n: tr('Kalın bağırsak', 'Large intestine') },
  ],
  RES: {
    ekmek: {
      agiz: ['part', tr('Başladı! İyot mavisi soluyor, çiğnenen ekmek tatlanıyor: amilaz nişastayı maltoza parçalıyor.', 'It starts! The iodine blue fades and chewed bread turns sweet: amylase breaks starch into maltose.')],
      mide: ['stop', tr('Durdu. Asitte tükürük amilazı çalışmaz; iyot hâlâ mavi.', 'Stopped. Salivary amylase does not work in acid; the iodine stays blue.')],
      ince: ['full', tr('Bitti. Pankreas amilazı + bağırsak maltazı → glikoz; villuslardan kana geçti.', 'Finished. Pancreatic amylase + gut maltase → glucose, absorbed through the villi.')],
      kalin: ['none', tr('Geriye nişasta kalmadı. Burada sadece su emiliyor.', 'No starch is left. Only water is absorbed here.')],
    },
    yumurta: {
      agiz: ['none', tr('Sadece küçük parçalara ayrıldı. Tükürükte protein sindiren enzim yok.', 'Only chopped into bits. Saliva has no protein-digesting enzyme.')],
      mide: ['part', tr('Başladı! Pepsin pH 2’de akı peptitlere parçalıyor; küpler kenardan saydamlaşıyor.', 'It starts! Pepsin at pH 2 cuts the white into peptides; the cubes turn clear at the edges.')],
      ince: ['full', tr('Bitti. Tripsin (pH 8) ve peptidazlar → amino asitler; kana geçti.', 'Finished. Trypsin (pH 8) and peptidases → amino acids, absorbed.')],
      kalin: ['none', tr('Protein kalmadı.', 'No protein is left.')],
    },
    tere: {
      agiz: ['none', tr('Eridi ama sindirilmedi: hâlâ yağ.', 'Melted but not digested: still fat.')],
      mide: ['none', tr('Üstte yağ tabakası olarak yüzüyor; neredeyse hiç değişmedi.', 'Floats as an oily layer on top; almost unchanged.')],
      ince: ['full', tr('Önce safra yağı minik damlacıklara ayırdı (enzim değil!), sonra lipaz → yağ asidi + gliserol.', 'First bile broke the fat into tiny droplets (not an enzyme!), then lipase → fatty acids + glycerol.')],
      kalin: ['none', tr('Yağ kalmadı.', 'No fat is left.')],
    },
    marul: {
      agiz: ['none', tr('Çiğnendi, parçalandı; kimyasal olarak değişmedi.', 'Chewed to bits; chemically unchanged.')],
      mide: ['none', tr('Değişmedi.', 'Unchanged.')],
      ince: ['none', tr('Hâlâ değişmedi: insanda selülozu parçalayan enzim yok.', 'Still unchanged: humans have no enzyme for cellulose.')],
      kalin: ['fibre', tr('Bakteriler bir kısmını mayaladı, su emildi; kalan lif dışkıya hacim veriyor.', 'Bacteria fermented some of it and water was absorbed; the rest is fibre that bulks the stool.')],
    },
  },
  open() {
    const S = G.S;
    this.st = S.sindirim || (S.sindirim = { seen: {} });
    const body = h('div', 'kit hediye sindirim');
    body.innerHTML = `<div class="hd-grid"></div><div class="sd-ph"></div><div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Revir · Bir lokmanın yolculuğu', 'Clinic · The journey of a mouthful'), code: 'BİY.10.1.5', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her kutu bir tüp: o besini o bölümün salgısıyla 37 °C’de karıştır.', 'Each box is a tube: mix that food with that section’s juice at 37 °C.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const k = b.dataset.cell; if (!k || this.st.seen[k]) return;
    this.st.seen[k] = 1;
    const [sid, tid] = k.split(':'), r = this.RES[sid][tid];
    AU.sfx(r[0] === 'full' ? 'collect' : 'splash');
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
          : `<button class="hd-c" data-cell="${k}">${L(tr('Karıştır', 'Mix'))}</button>`;
      }
    }
    b.querySelector('.hd-grid').innerHTML = g;
    // once the stomach and small-intestine columns are done: the pH along the gut and which enzyme works where
    const Y = p => 14 + (9 - p) * 11;
    b.querySelector('.sd-ph').innerHTML = !(this.col('mide') && this.col('ince')) ? '' : `<svg viewBox="0 0 320 120">
      <line x1="30" y1="${Y(7)}" x2="310" y2="${Y(7)}" class="yg-cut"/><text x="306" y="${Y(7) - 3}" text-anchor="end">pH 7</text>
      <polyline points="40,${Y(7)} 100,${Y(7)} 120,${Y(2)} 190,${Y(2)} 210,${Y(8)} 300,${Y(8)}" class="sd-line"/>
      <text x="70" y="${Y(7) + 16}" text-anchor="middle">${L(tr('amilaz', 'amylase'))}</text>
      <text x="155" y="${Y(2) - 6}" text-anchor="middle">${L(tr('pepsin (pH 2)', 'pepsin (pH 2)'))}</text>
      <text x="255" y="${Y(8) - 26}" text-anchor="middle">${L(tr('safra → emülsiyon', 'bile → emulsion'))}</text>
      <text x="255" y="${Y(8) - 14}" text-anchor="middle">${L(tr('amilaz · tripsin · lipaz', 'amylase · trypsin · lipase'))}</text>
      <text x="70" y="112" text-anchor="middle">${L(tr('ağız', 'mouth'))}</text><text x="155" y="112" text-anchor="middle">${L(tr('mide', 'stomach'))}</text><text x="255" y="112" text-anchor="middle">${L(tr('ince bağırsak', 'small intestine'))}</text></svg>`;
    this.table();
  },
  analyse() { return { upper: this.col('agiz') && this.col('mide'), small: this.col('ince'), large: this.col('kalin') }; },
  table() {
    const a = this.analyse(), S = G.S, b = this.body;
    b.querySelector('.stamps').innerHTML = [[a.upper, tr('Ağız ve mide', 'Mouth and stomach')], [a.small, tr('İnce bağırsak', 'Small intestine')], [a.large, tr('Kalın bağırsak', 'Large intestine')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.upper && a.small && a.large && !S.flags.sindirimDone) {
      S.flags.sindirimDone = true;
      const head = [tr('Besin', 'Food'), ...this.TESTS.map(t => t.n)];
      const rows = this.SAMPLES.map(s => [s.n, ...this.TESTS.map(t => this.RES[s.id][t.id][1])]);
      S.journal.exps.push({ title: tr('Bir lokmanın yolculuğu', 'The journey of a mouthful'), code: 'BİY.10.1.5', t: Date.now(), head, rows,
        note: tr('Kimyasal sindirim enzimlerle olur ve her enzim kendi pH’ında çalışır. Nişasta ağızda tükürük amilazıyla başlar, midede durur, ince bağırsakta biter. Protein midede pepsinle (pH 2) başlar, ince bağırsakta tripsin ve peptidazlarla (pH 8) amino asitlere kadar iner. Yağ ince bağırsakta önce safrayla emülsiyon olur (safra enzim değildir), sonra lipazla yağ asidi ve gliserole ayrılır. Sindirimin çoğu ve emilimin neredeyse tamamı ince bağırsakta, villuslardan olur. Selülozu sindiremeyiz; kalın bağırsakta su emilir, lif dışkıya hacim verir.', 'Chemical digestion is done by enzymes, each working at its own pH. Starch starts in the mouth with salivary amylase, stops in the stomach and finishes in the small intestine. Protein starts in the stomach with pepsin (pH 2) and is taken down to amino acids in the small intestine by trypsin and peptidases (pH 8). Fat is first emulsified by bile in the small intestine (bile is not an enzyme), then split by lipase into fatty acids and glycerol. Most digestion and nearly all absorption happen in the small intestine, through the villi. We cannot digest cellulose; the large intestine absorbs water and fibre bulks the stool.') });
      this._msg(tr('On altı tüp tamam! Tablo defterinde.', 'All sixteen tubes! The table is in your journal.'));
      if (Q.at('sindirim', 'digest')) { UI.stamp(L(tr('YOLCULUK TAMAM', 'JOURNEY MAPPED'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('sindirim', 'digest') && G.S.flags.sindirimDone) {
      await ask('sindirim_stomach');
      await ask('sindirim_fat');
      await UI.say('player', tr('Hemşire Zehra’ya haritayı göstereyim.', 'Let me show Nurse Zehra the map.'));
      Q.adv('sindirim');
    }
  },
};
