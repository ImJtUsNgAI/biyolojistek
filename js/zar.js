'use strict';
// Songül's bleeding beetroot. Beet discs in four liquids at three temperatures: the red betalain sits in the vacuole
// behind membranes, so the colour of the water is a direct read-out of how intact the phospholipid bilayer still is.
const ZAR = {
  SAMPLES: [
    { id: 'su', icon: '💧', n: tr('Su', 'Water') },
    { id: 'tuzlu', icon: '🧂', n: tr('Tuzlu su (%10)', 'Salt water (10%)') },
    { id: 'alkol', icon: '🧴', n: tr('Alkol', 'Alcohol') },
    { id: 'deterjan', icon: '🫧', n: tr('Deterjanlı su', 'Soapy water') },
  ],
  TESTS: [
    { id: 'soguk', icon: '❄️', n: tr('4 °C', '4 °C') },
    { id: 'oda', icon: '🏠', n: tr('25 °C', '25 °C') },
    { id: 'sicak', icon: '🔥', n: tr('70 °C', '70 °C') },
  ],
  RES: {
    su: {
      soguk: ['intact', tr('Su berrak. Disk sert ve sağlam.', 'The water is clear. The disc is firm.')],
      oda: ['intact', tr('Neredeyse berrak; yalnız kesik yüzeydeki hücrelerden çok soluk bir pembe.', 'Almost clear; only a very faint pink from the cells cut at the surface.')],
      sicak: ['burst', tr('Kıpkırmızı! Isı zarı gevşetti, zar proteinlerini bozdu; koful boyası dışarı aktı.', 'Bright red! Heat loosened the membrane and wrecked its proteins; the vacuole’s dye poured out.')],
    },
    tuzlu: {
      soguk: ['shrink', tr('Su berrak ama disk yumuşadı.', 'The water is clear, but the disc has gone soft.')],
      oda: ['shrink', tr('Su berrak; disk büzüldü, gevşedi. Su hücreden çıktı, boya çıkamadı.', 'The water is clear; the disc shrank and went limp. Water left the cells, the dye couldn’t.')],
      sicak: ['burst', tr('Kıpkırmızı: ısı zarı bozunca tuzun bir önemi kalmadı.', 'Bright red: once heat broke the membrane, the salt no longer mattered.')],
    },
    alkol: {
      soguk: ['leak', tr('Pembe: alkol yağ katmanını yavaş yavaş çözüyor.', 'Pink: alcohol is slowly dissolving the fatty layer.')],
      oda: ['burst', tr('Koyu kırmızı: alkol fosfolipitleri çözdü, zarda delikler açıldı.', 'Deep red: alcohol dissolved the phospholipids and holed the membrane.')],
      sicak: ['burst', tr('Kıpkırmızı, disk soldu.', 'Bright red; the disc has gone pale.')],
    },
    deterjan: {
      soguk: ['leak', tr('Pembe: deterjan zarı yavaşça söküyor.', 'Pink: the detergent is slowly taking the membrane apart.')],
      oda: ['burst', tr('Kırmızı: deterjan, yağı sabun gibi damlacıklara ayırdı; zar dağıldı.', 'Red: the detergent broke the fat into droplets like soap does; the membrane fell apart.')],
      sicak: ['burst', tr('Kıpkırmızı.', 'Bright red.')],
    },
  },
  open() {
    const S = G.S;
    this.st = S.zar || (S.zar = { seen: {} });
    const body = h('div', 'kit hediye zar');
    body.innerHTML = `<div class="hd-grid"></div><div class="zr-fig"></div><div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Songül Abla’nın pancarları · Hücre zarı', 'Songül’s beetroot · The cell membrane'), code: 'BİY.9.2.6', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Her kutu bir tüp: yıkanmış bir pancar diskini o sıvıya, o sıcaklıkta 20 dakika koy.', 'Each box is a tube: put a rinsed beet disc in that liquid at that temperature for 20 minutes.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const k = b.dataset.cell; if (!k || this.st.seen[k]) return;
    this.st.seen[k] = 1;
    const [sid, tid] = k.split(':'), r = this.RES[sid][tid];
    AU.sfx(r[0] === 'burst' ? 'splash' : 'pen');
    this._msg(r[1]);
    this.draw(); G.save();
  },
  has(k) { return !!this.st.seen[k]; },
  draw() {
    const b = this.body, seen = this.st.seen;
    let g = `<div class="hd-h"></div>${this.TESTS.map(t => `<div class="hd-h">${t.icon}<br>${U.esc(L(t.n))}</div>`).join('')}`;
    for (const s of this.SAMPLES) {
      g += `<div class="hd-s">${s.icon} ${U.esc(L(s.n))}</div>`;
      for (const t of this.TESTS) {
        const k = `${s.id}:${t.id}`, r = this.RES[s.id][t.id];
        g += seen[k] ? `<button class="hd-c done r-${r[0]}" data-cell="${k}" disabled>${U.esc(L(r[1]))}</button>`
          : `<button class="hd-c" data-cell="${k}">${L(tr('Diski koy', 'Add disc'))}</button>`;
      }
    }
    b.querySelector('.hd-grid').innerHTML = g;
    // once heat and a solvent have been seen: the bilayer, and what gets through it
    const a = this.analyse();
    let heads = '', tails = '';
    for (let x = 16; x <= 304; x += 12) {
      if (x > 140 && x < 180) continue;
      heads += `<circle cx="${x}" cy="44" r="4.5" class="zr-h"/><circle cx="${x}" cy="88" r="4.5" class="zr-h"/>`;
      tails += `<path d="M${x - 1.5} 49 V64 M${x + 1.5} 49 V64 M${x - 1.5} 83 V68 M${x + 1.5} 83 V68" class="zr-t"/>`;
    }
    b.querySelector('.zr-fig').innerHTML = !(a.heat && a.solvent) ? '' : `<svg viewBox="0 0 320 132">
      ${tails}${heads}<rect x="146" y="36" width="28" height="60" rx="8" class="zr-p"/><rect x="156" y="36" width="8" height="60" class="zr-ch"/>
      <path d="M40 14 V118 M70 14 V118" class="zr-ok"/><path d="M160 14 V118" class="zr-ok"/><path d="M262 118 V100" class="zr-no"/>
      <text x="4" y="10">${L(tr('dışarı', 'outside'))}</text><text x="4" y="129">${L(tr('hücre içi', 'inside'))}</text>
      <text x="76" y="24">H₂O · O₂ · CO₂</text><text x="178" y="24">${L(tr('iyon, glikoz: kanal', 'ions, glucose: channel'))}</text>
      <text x="206" y="112">${L(tr('boya (büyük) ✕', 'dye (big) ✕'))}</text></svg>`;
    this.table();
  },
  analyse() { return { heat: this.SAMPLES.every(s => this.has(`${s.id}:sicak`)), solvent: this.has('alkol:oda') && this.has('deterjan:oda'), select: this.has('tuzlu:oda') && this.has('su:oda') }; },
  table() {
    const a = this.analyse(), S = G.S, b = this.body;
    b.querySelector('.stamps').innerHTML = [[a.heat, tr('Isı', 'Heat')], [a.solvent, tr('Yağ çözücüler', 'Fat solvents')], [a.select, tr('Seçici geçirgenlik', 'Selective permeability')]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    if (a.heat && a.solvent && a.select && !S.flags.zarDone) {
      S.flags.zarDone = true;
      const head = [tr('Sıvı', 'Liquid'), ...this.TESTS.map(t => t.n)];
      const rows = this.SAMPLES.map(s => [s.n, ...this.TESTS.map(t => this.st.seen[`${s.id}:${t.id}`] ? this.RES[s.id][t.id][1] : '—')]);
      S.journal.exps.push({ title: tr('Kanayan pancar: hücre zarı', 'The bleeding beetroot: the cell membrane'), code: 'BİY.9.2.6', t: Date.now(), head, rows,
        note: tr('Hücre zarı iki sıra fosfolipitten yapılır: suyu seven fosfatlı başlar dışa, yağ asidi kuyrukları içe bakar; aralara proteinler gömülüdür. Pancarın kırmızı boyası (betalain) kofulda, zarların ardındadır. Isı zarı gevşetir ve proteinlerini bozar; alkol ve deterjan yağ katmanını çözer: boya sızar. Tuzlu suda ise su osmozla hücreden çıktı, disk büzüldü ama boya çıkamadı: zar sağlam ve seçici geçirgendir. Su, O₂, CO₂ gibi küçük moleküller doğrudan geçer; iyonlar ve glikoz protein kanallarından ya da ATP harcayan pompalarla (aktif taşıma) geçer; büyük moleküller geçemez.', 'The cell membrane is two rows of phospholipids: water-loving phosphate heads face out, fatty-acid tails face in, with proteins set among them. Beetroot’s red dye (betalain) sits in the vacuole, behind membranes. Heat loosens the membrane and wrecks its proteins; alcohol and detergent dissolve the fatty layer, and the dye leaks. In salt water, water left the cells by osmosis and the disc shrank, but the dye stayed in: the membrane was intact and selectively permeable. Small molecules like water, O₂ and CO₂ pass straight through; ions and glucose go through protein channels or ATP-driven pumps (active transport); big molecules can’t get through.') });
      this._msg(tr('Üç damga da tamam! Tablo defterinde.', 'All three stamps! The table is in your journal.'));
      if (Q.at('zar', 'beet')) { UI.stamp(L(tr('ZAR ÇÖZÜLDÜ', 'MEMBRANE CRACKED'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('zar', 'beet') && G.S.flags.zarDone) {
      await ask('zar_heat');
      await ask('zar_select');
      await UI.say('player', tr('Songül Abla’ya pancarın neden kanadığını anlatayım.', 'Let me tell Songül why the beetroot bleeds.'));
      Q.adv('zar');
    }
  },
};
