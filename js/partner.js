'use strict';
// Lab partners (Laboratuvar ortakları), for two: the "microscopist" sees an unlabelled plate on the screen but never the
// key; the "key reader" holds the printed dichotomous key but never looks at the screen. The reader asks the key's
// questions, the microscopist answers from what they see, and together they walk the key down to a name, which the
// microscopist taps. Five samples against the clock, three wrong names and the round is lost. Talking is the only way.

const PARTNER = {
  on: false, el: null, st: null, raf: 0, N: 5, TIME: 300, STRIKES: 3,
  // the key's end points, lettered as on the printed sheet
  ENDS: { A: 'leafcell', B: 'onion', C: 'cheek', D: 'yeast', E: 'blood', F: 'pollen', G: 'spores', H: 'muscle', I: 'rumen', J: 'pond', K: 'roottip', L: 'leaf' },
  // couplet n: [statement a, where it leads], [statement b, where it leads]; a letter is a name, a number the next couplet
  KEY: {
    1: [[tr('Görüntüde birbirine hiç benzemeyen birçok canlı bir arada: iplikler, kıllı ya da kabuklu hücreler, belki bacaklı küçük hayvanlar.', 'Many living things that look nothing alike are together: threads, hairy or shelled cells, perhaps tiny animals with legs.'), 2],
        [tr('Görüntüdeki hücreler birbirine benziyor ya da hepsi aynı dokunun parçası.', 'The cells look alike, or all belong to the same tissue.'), 3]],
    2: [[tr('Aralarında yeşil (kloroplastlı) canlılar var.', 'Some of them are green (they have chloroplasts).'), 'J'],
        [tr('Hiçbiri yeşil değil; canlılar bitki liflerinin arasında.', 'None of them is green; the living things lie among plant fibres.'), 'I']],
    3: [[tr('Yeşil kloroplastlar görülüyor.', 'Green chloroplasts can be seen.'), 4],
        [tr('Hiç yeşil yok.', 'There is no green at all.'), 5]],
    4: [[tr('Bir ya da birkaç büyük hücre; içinde büyük bir koful ve organeller (çok büyük büyütme).', 'One or a few big cells, with a large vacuole and organelles inside (very high magnification).'), 'A'],
        [tr('Katmanlar hâlinde dizilmiş birçok hücre; bir yüzünde küçük gözenekler (stoma) var.', 'Many cells in layers; one surface has small pores (stomata).'), 'L']],
    5: [[tr('Hücreler birbirine yapışık, aralarında kalın ve düz çeperler var (tuğla duvar gibi).', 'The cells are stuck together with thick, straight walls between them (like a brick wall).'), 6],
        [tr('Böyle kalın, düz çeperler yok.', 'There are no thick, straight walls like that.'), 7]],
    6: [[tr('Bir ucunda koruyucu bir başlık, yanlarında tüyler var.', 'There is a protective cap at one end and hairs along the sides.'), 'K'],
        [tr('Başlık ve tüy yok; tek katman, tuğla gibi dizilmiş hücreler.', 'No cap and no hairs; a single layer of cells laid like bricks.'), 'B']],
    7: [[tr('Görüntü baştan sona tekrar eden düzenli bantlarla dolu.', 'The picture is full of regular bands repeating from one side to the other.'), 'H'],
        [tr('Tekrar eden bantlar yok.', 'There are no repeating bands.'), 8]],
    8: [[tr('Küçük taneler, sopa biçimli hücrelerin uçlarında duruyor.', 'Small grains sit on the tips of club-shaped cells.'), 'G'],
        [tr('Taneler ya da hücreler serbestçe dağılmış.', 'The grains or cells are scattered freely.'), 9]],
    9: [[tr('Hücreler kırmızı, yuvarlak, ortası çukur ve çekirdeksiz.', 'The cells are red, round, dimpled and have no nucleus.'), 'E'],
        [tr('Hücreler kırmızı değil.', 'The cells are not red.'), 10]],
    10: [[tr('Kalın, dikenli bir kabuğu olan yuvarlak taneler.', 'Round grains with a thick, spiky coat.'), 'F'],
         [tr('Kabuksuz, yumuşak hücreler.', 'Soft cells with no coat.'), 11]],
    11: [[tr('Küçük, oval hücreler; bazılarının yanından tomurcuk çıkıyor.', 'Small, oval cells; some have a bud growing from their side.'), 'D'],
         [tr('Büyük, yassı, düzensiz hücreler; ortada belirgin bir çekirdek.', 'Big, flat, irregular cells with a clear nucleus in the middle.'), 'C']],
  },
  WORDS: [
    [tr('Kloroplast', 'Chloroplast'), tr('Bitki hücresindeki yeşil, fotosentez yapan küçük cisim.', 'The small green body in a plant cell that carries out photosynthesis.')],
    [tr('Çeper', 'Cell wall'), tr('Bitki hücresini saran kalın, sert dış katman.', 'The thick, stiff outer layer round a plant cell.')],
    [tr('Koful', 'Vacuole'), tr('Bitki hücresinin ortasındaki büyük, sulu kese.', 'The big, watery sac in the middle of a plant cell.')],
    [tr('Stoma', 'Stoma'), tr('Yaprak yüzeyindeki, iki hücrenin arasındaki gözenek.', 'A pore between two cells on the surface of a leaf.')],
    [tr('Tomurcuk', 'Bud'), tr('Bir hücrenin yanından çıkan küçük yavru hücre.', 'A small daughter cell growing out of the side of a cell.')],
  ],
  name(letter) { const s = SAMPLE.get(this.ENDS[letter]); return s ? s.opts[0] : tr('?', '?'); },
  // the couplets that lead to a letter, as "1b → 3b → …"
  path(letter) {
    const walk = (n, trail) => {
      for (const [ab, [, to]] of [['a', this.KEY[n][0]], ['b', this.KEY[n][1]]]) {
        const t = trail.concat(n + ab);
        if (to === letter) return t;
        if (typeof to === 'number') { const r = walk(to, t); if (r) return r; }
      }
      return null;
    };
    return walk(1, []) || [];
  },

  open() {
    if (this.on) return;
    if (STUDY.on) STUDY.close();
    if (LENS.on) LENS.toggle(false);
    this.on = true;
    const el = this.el = h('div', 'modal partner');
    el._key = e => { if (e.code === 'Escape') this.close(); };
    UI._push('partner', el);
    AU.sfx('page');
    this.setup();
  },
  close() {
    if (!this.on) return;
    this.on = false; this.st = null; cancelAnimationFrame(this.raf);
    UI._pop(this.el);
  },
  setup() {
    this.st = null; cancelAnimationFrame(this.raf);
    this.el.innerHTML = `<div class="pt-setup paper">
      <button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      <h2>${U.esc(L(tr('Laboratuvar ortakları', 'Lab partners')))}</h2>
      <div class="pt-roles">
        <div><b>${U.esc(L(tr('1 · Mikroskopçu', '1 · Microscopist')))}</b><p>${U.esc(L(tr('Ekrana bakar, numuneyi ortağına anlatır ve ortağının söylediği ada dokunur. Anahtarı görmek yasak!', 'Looks at the screen, describes the sample to their partner and taps the name the partner gives. No looking at the key!')))}</p></div>
        <div><b>${U.esc(L(tr('2 · Anahtar okuyucu', '2 · Key reader')))}</b><p>${U.esc(L(tr('Basılı tanı anahtarını tutar, sorularını sorar ve numunenin adını bulur. Ekrana bakmak yasak!', 'Holds the printed identification key, asks its questions and works out the sample’s name. No looking at the screen!')))}</p></div>
      </div>
      <p class="pt-how">${U.esc(L(tr(`Beş numune, ${this.TIME / 60} dakika. ${this.STRIKES} yanlış adda tur biter. Sessiz çalışırsanız kazanamazsınız: konuşmak zorundasınız.`, `Five samples, ${this.TIME / 60} minutes. ${this.STRIKES} wrong names and the round is over. You cannot win in silence: you have to talk.`)))}</p>
      <div class="pt-btns"><button class="big pt-print">${U.esc(L(tr('Anahtarı yazdır', 'Print the key')))}</button><button class="pt-show">${U.esc(L(tr('Anahtarı bu ekranda göster', 'Show the key on this screen')))}</button><button class="big yes pt-go">${U.esc(L(tr('Başla ▸', 'Start ▸')))}</button></div>
    </div>`;
    this.el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    this.el.querySelector('.pt-print').onclick = () => { AU.sfx('click'); this.printKey(); };
    this.el.querySelector('.pt-show').onclick = () => { AU.sfx('click'); this.showKey(); };
    this.el.querySelector('.pt-go').onclick = () => { AU.sfx('click'); this.start(); };
  },

  // ---------------------------------------------------------------- the key on paper
  keyHTML() {
    const e = s => U.esc(L(s)), row = (n, ab, [txt, to]) => `<tr><td class="n">${n}${ab}</td><td>${e(txt)}</td><td class="to">${typeof to === 'number' ? '→ ' + to : `<b>${to} · ${e(this.name(to))}</b>`}</td></tr>`;
    return `<!doctype html><html lang="${I18N.lang}"><head><meta charset="utf-8"><title>${e(tr('Tanı anahtarı', 'Identification key'))}</title>
      <style>body{font-family:"Segoe UI",sans-serif;margin:24px;color:#1B1A17}h1{font-size:22px;margin:0 0 4px}p{margin:4px 0 10px;font-size:13px}table{border-collapse:collapse;width:100%;font-size:14px}td{border-bottom:1px solid #bbb;padding:7px 6px;vertical-align:top}td.n{width:36px;font-weight:700}td.to{width:230px;white-space:nowrap}tr.gap td{border-bottom:2px solid #1B1A17}.w{columns:2;font-size:12px;margin-top:14px}.w div{margin-bottom:6px;break-inside:avoid}@media print{body{margin:10mm}}</style></head><body>
      <h1>${e(tr('Tohum Bekçisi · Laboratuvar ortakları · Tanı anahtarı', 'Seedkeeper · Lab partners · Identification key'))}</h1>
      <p>${e(tr('Anahtar okuyucu içindir: ekrana bakma! 1. basamaktan başla. Ortağına iki cümleyi de oku, hangisinin gördüğüne uyduğunu sor, oku izle. Bir harfe ulaşınca adı ortağına söyle.', 'For the key reader: do not look at the screen! Start at step 1. Read your partner both sentences, ask which one matches what they see, and follow the arrow. When you reach a letter, tell your partner the name.'))}</p>
      <table>${Object.keys(this.KEY).map(n => row(n, 'a', this.KEY[n][0]) + row(n, 'b', this.KEY[n][1]).replace('<tr>', '<tr class="gap">')).join('')}</table>
      <div class="w"><b>${e(tr('Küçük sözlük', 'Short glossary'))}</b>${this.WORDS.map(([w, d]) => `<div><b>${e(w)}:</b> ${e(d)}</div>`).join('')}</div>
      <p style="margin-top:14px;font-size:11px;color:#666">BİY.9.1.5 · ${e(tr('Canlıları sınıflandırma: ikili (dikotom) anahtar', 'Classifying living things: a dichotomous key'))}</p></body></html>`;
  },
  printKey() {
    let w = null;
    try { w = window.open('', '_blank'); } catch (e) { }
    if (!w) { this.showKey(); return; }
    w.document.open(); w.document.write(this.keyHTML()); w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch (e) { } }, 400);
  },
  showKey() {
    const body = h('div', 'pt-keyview');
    body.innerHTML = `<p class="pt-warn">${U.esc(L(tr('Mikroskopçu şimdi ekrandan uzaklaşsın! Bu sayfa yalnızca anahtar okuyucu içindir.', 'Microscopist, look away now! This page is for the key reader only.')))}</p><iframe></iframe>`;
    UI.panel({ title: tr('Tanı anahtarı', 'Identification key'), body, wide: true, cls: 'ptkey' });
    const f = body.querySelector('iframe'); f.srcdoc = this.keyHTML();
  },

  // ---------------------------------------------------------------- the round
  start(keys) {
    const items = keys ? keys.map(k => SAMPLE.get(k)) : SAMPLE.pick(this.N, Object.values(this.ENDS).map(k => SAMPLE.get(k)));
    this.st = { items, i: -1, left: this.TIME, strikes: 0, done: [], t: 0, phase: 'play', t0: 0 };
    const letters = Object.keys(this.ENDS);
    this.el.innerHTML = `<div class="pt-play paper">
      <div class="pt-top"><small class="pt-round"></small><div class="pt-time"><i></i><span></span></div><b class="pt-strikes"></b><button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button></div>
      <div class="pt-body">
        <div class="my-plate"><canvas></canvas><span class="my-mag"></span></div>
        <div class="pt-side"><p class="pt-tell">${U.esc(L(tr('Numuneyi ortağına anlat. Ortağın anahtarla bir ad bulunca o ada dokun.', 'Describe the sample to your partner. When they find a name with the key, tap that name.')))}</p>
          <div class="pt-names">${letters.map(k => `<button class="ans" data-k="${k}"><b>${k}</b><span>${U.esc(L(this.name(k)))}</span></button>`).join('')}</div>
          <p class="pt-fb"></p></div>
      </div></div>`;
    this.el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    this.el.querySelectorAll('.pt-names button').forEach(b => b.onclick = () => this.guess(b.dataset.k));
    this.cv = this.el.querySelector('canvas');
    let last = performance.now();
    const loop = now => { if (!this.on || !this.st) return; const dt = U.clamp((now - last) / 1000, 0, 0.05); last = now; this.frame(dt); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.next();
  },
  item() { return this.st.items[this.st.i]; },
  letterOf(it) { return Object.keys(this.ENDS).find(k => this.ENDS[k] === it.k); },
  next() {
    const s = this.st; s.i++; s.t0 = s.t; s.wrong = 0;
    if (s.i >= s.items.length) { this.finish(true); return; }
    this.el.querySelector('.pt-round').textContent = L(tr(`Numune ${s.i + 1} / ${s.items.length}`, `Sample ${s.i + 1} / ${s.items.length}`));
    this.el.querySelector('.my-mag').textContent = SAMPLE.mag(this.item());
    this.el.querySelectorAll('.pt-names button').forEach(b => { b.disabled = false; b.classList.remove('x', 'ok'); });
    this._strikes();
    AU.sfx('chime');
  },
  guess(letter) {
    const s = this.st; if (!s || s.phase !== 'play') return null;
    const it = this.item(), b = this.el.querySelector(`.pt-names [data-k="${letter}"]`), fb = this.el.querySelector('.pt-fb');
    if (this.ENDS[letter] === it.k) {
      b.classList.add('ok'); AU.sfx('success');
      s.done.push({ k: it.k, secs: Math.round(s.t - s.t0), wrong: s.wrong });
      fb.innerHTML = `<b>${U.esc(L(this.name(letter)))}!</b> ${U.esc(L(tr('Anahtardaki yol: ', 'The path through the key: ')))}<code>${this.path(letter).join(' → ')} → ${letter}</code>`;
      s.phase = 'pause';
      setTimeout(() => { if (this.st === s && this.on) { s.phase = 'play'; this.next(); } }, 1600);
      return true;
    }
    b.classList.add('x'); b.disabled = true; AU.sfx('wrong');
    s.strikes++; s.wrong++; this._strikes();
    fb.textContent = L(tr('Bu değil. Anahtarın başına dönün ve soruları yeniden sorun.', 'Not that one. Go back to the start of the key and ask the questions again.'));
    if (s.strikes >= this.STRIKES) this.finish(false);
    return false;
  },
  _strikes() { const s = this.st; this.el.querySelector('.pt-strikes').textContent = '✗'.repeat(s.strikes) + '·'.repeat(Math.max(0, this.STRIKES - s.strikes)); },
  frame(dt) {
    const s = this.st; if (!s || s.phase === 'end') return;
    s.t += dt; s.left = Math.max(0, this.TIME - s.t);
    const bar = this.el.querySelector('.pt-time i'), lab = this.el.querySelector('.pt-time span');
    if (bar) { bar.style.setProperty('--p', (100 * s.left / this.TIME) + '%'); lab.textContent = Math.floor(s.left / 60) + ':' + String(Math.floor(s.left % 60)).padStart(2, '0'); }
    if (s.left <= 0 && s.phase === 'play') { this.finish(false); return; }
    const it = this.item(); if (it) SAMPLE.draw(this.cv, it, G.t + s.t);
  },
  finish(won) {
    const s = this.st, S = G.S; if (!s || s.phase === 'end') return;
    s.phase = 'end'; cancelAnimationFrame(this.raf);
    const used = Math.round(Math.min(this.TIME, s.t));
    S.journal.exps.push({ title: tr('Laboratuvar ortakları · tanı anahtarı', 'Lab partners · identification key'), code: 'BİY.9.1.5', t: Date.now(),
      head: [tr('Numune', 'Sample'), tr('Süre (sn)', 'Time (s)'), tr('Yanlış ad', 'Wrong names')],
      rows: s.done.map(d => [SAMPLE.get(d.k).opts[0], String(d.secs), String(d.wrong)]),
      note: won ? tr(`Beş numune ${used} saniyede adlandırıldı. İkili anahtar, her adımda iki seçenekten birini eleyerek ilerler; iyi bir anahtar herkesi aynı ada götürür.`, `Five samples named in ${used} seconds. A dichotomous key moves forward by ruling out one of two options at each step; a good key leads everyone to the same name.`)
        : tr(`${s.done.length} numune adlandırıldı. İkili anahtarda her soruyu dikkatle sormak, tahmin etmekten hızlıdır.`, `${s.done.length} samples named. With a dichotomous key, asking every question carefully is faster than guessing.`) });
    S.partner = S.partner || { played: 0, won: 0, best: null };
    S.partner.played++; if (won) { S.partner.won++; S.partner.best = S.partner.best == null ? used : Math.min(S.partner.best, used); }
    G.save();
    this.el.innerHTML = `<div class="pt-setup rc-end paper"><button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      <small>${U.esc(L(tr('Laboratuvar ortakları', 'Lab partners')))}</small>
      <h2>${U.esc(L(won ? tr('Harika bir ekip!', 'What a team!') : s.strikes >= this.STRIKES ? tr('Üç yanlış ad', 'Three wrong names') : tr('Süre doldu', "Time's up")))}</h2>
      <div class="rc-final"><b>${s.done.length}</b><span>/</span><b>${s.items.length}</b></div>
      <p>${U.esc(L(won ? tr(`Süre: ${Math.floor(used / 60)}:${String(used % 60).padStart(2, '0')}. Rolleri değiştirip bir daha deneyin!`, `Time: ${Math.floor(used / 60)}:${String(used % 60).padStart(2, '0')}. Swap roles and try again!`) : tr('Rolleri değiştirip bir daha deneyin: bu kez her soruyu sırayla sorun.', 'Swap roles and try again: this time ask every question in order.')))}</p>
      <div class="rc-foot"><button class="pt-again">${U.esc(L(tr('Yeni tur', 'New round')))}</button><button class="big yes pt-close">${U.esc(T('close'))}</button></div></div>`;
    this.el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    this.el.querySelector('.pt-close').onclick = () => { AU.sfx('click'); this.close(); };
    this.el.querySelector('.pt-again').onclick = () => { AU.sfx('click'); this.setup(); };
    if (won) UI.stamp(L(tr('EKİP', 'TEAM')), L(tr('Laboratuvar ortakları', 'Lab partners')));
  },
};
