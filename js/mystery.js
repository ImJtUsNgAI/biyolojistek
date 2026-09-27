'use strict';
// Mystery sample (Gizemli numune): an unlabelled plate from the lens atlas. First say what it is, then tap the one
// structure that proves it; a wrong structure is named and explained, so every miss still teaches. The samples are
// chosen in look-alike pairs (onion skin / cheek, pollen / spores, artery / twig, pond / rumen) so the answer has to
// come from structures learned in other cases, not from a guess. SAMPLE is shared with the lab-partner game.

const SAMPLE = {
  // spec + level (+ plate state), the answer first then three look-alikes, the structures that prove it
  LIST: [
    { k: 'leafcell', spec: 'wheat', l: 2, proof: ['chloroplast', 'cell_wall'],
      opts: [tr('Bitki yaprağı hücresi', 'A plant leaf cell'), tr('Hayvan hücresi', 'An animal cell'), tr('Bakteri', 'A bacterium'), tr('Maya hücresi', 'A yeast cell')],
      clue: tr('Hücrenin dışında kalın bir çeper var mı? Yeşil bir şey görüyor musun?', 'Is there a thick wall round the cell? Can you see anything green?'),
      why: tr('Kalın bir hücre çeperi ve yeşil kloroplastlar: fotosentez yapan bir bitki hücresi. Hayvan hücresinde çeper, mayada kloroplast yoktur; bakterinin ise çekirdeği yoktur.', 'A thick cell wall and green chloroplasts: a plant cell that photosynthesises. Animal cells have no wall, yeast has no chloroplasts, and a bacterium has no nucleus.') },
    { k: 'cheek', spec: 'onion', l: 1, st: { cheek: 1 }, proof: ['cell_membrane', 'cheek_cell'],
      opts: [tr('Hayvan hücresi (yanak)', 'An animal cell (cheek)'), tr('Soğan zarı hücresi', 'An onion skin cell'), tr('Bakteri', 'A bacterium'), tr('Kan hücresi', 'A blood cell')],
      clue: tr('Hücrelerin kenarı düz ve kalın mı, yoksa ince ve düzensiz mi?', 'Are the cells’ edges straight and thick, or thin and irregular?'),
      why: tr('Yassı, düzensiz hücreler; dışlarında çeper yok, yalnızca ince bir zar var ve çekirdek belirgin. Yanağın iç yüzünden kazınmış hayvan hücreleri.', 'Flat, irregular cells with no wall, only a thin membrane, and a clear nucleus: animal cells scraped from the inside of a cheek.') },
    { k: 'onion', spec: 'onion', l: 1, st: { cheek: 0 }, proof: ['cell_wall', 'vacuole'],
      opts: [tr('Bitki hücresi (soğan zarı)', 'A plant cell (onion skin)'), tr('Yanak hücresi', 'A cheek cell'), tr('Yaprak hücresi', 'A leaf cell'), tr('Maya', 'Yeast')],
      clue: tr('Çeper var ama yeşil bir şey yok. Bitkinin hangi parçası hiç ışık görmez?', 'There is a wall but nothing green. Which part of a plant never sees the light?'),
      why: tr('Tuğla gibi dizilmiş hücreler, kalın çeper ve büyük koful: bitki hücresi. Kloroplast yok, çünkü soğan zarı ışık görmez; yaprak hücresi olsaydı yeşil kloroplastlarla dolu olurdu.', 'Cells laid like bricks, a thick wall and a big vacuole: a plant cell. There are no chloroplasts because onion skin never sees the light; a leaf cell would be full of green chloroplasts.') },
    { k: 'yeast', spec: 'dough', l: 1, st: { risen: true, yeastDead: false }, proof: ['budding', 'yeast_cell'],
      opts: [tr('Maya (tek hücreli mantar)', 'Yeast (a single-celled fungus)'), tr('Bakteri', 'Bacteria'), tr('Kan hücreleri', 'Blood cells'), tr('Polen', 'Pollen')],
      clue: tr('Hücreler ikiye mi bölünüyor, yoksa yanlarından tomurcuk mu çıkarıyor?', 'Are the cells splitting in two, or growing a bud from their side?'),
      why: tr('Oval hücrelerin bazılarının yanından küçük bir tomurcuk çıkıyor: maya böyle ürer (tomurcuklanma). Bakteriden çok daha büyüktür ve çekirdeği vardır.', 'Some of the oval cells have a small bud growing from their side: that is how yeast reproduces (budding). It is far bigger than a bacterium and has a nucleus.') },
    { k: 'pond', spec: 'pond', l: 1, proof: ['spirogyra', 'daphnia', 'diatom'],
      opts: [tr('Gölet suyu damlası', 'A drop of pond water'), tr('İşkembe sıvısı', 'Rumen fluid'), tr('Kan yayması', 'A blood smear'), tr('Toprak örneği', 'A soil sample')],
      clue: tr('Yeşil, fotosentez yapan canlılar var mı? Işık alan bir yerden mi geliyor?', 'Are there green, photosynthesising organisms? Does it come from somewhere with light?'),
      why: tr('Sarmal kloroplastlı ipliksi bir alg (spirogira), cam kabuklu diyatomeler ve bir su piresi: ışık alan tatlı su canlıları. İşkembede ışık yoktur, oradaki mikroplar fotosentez yapmaz.', 'A filamentous alga with spiral chloroplasts (Spirogyra), glass-shelled diatoms and a water flea: freshwater life that gets light. There is no light in the rumen, and nothing there photosynthesises.') },
    { k: 'rumen', spec: 'cow', l: 5, proof: ['cellulose', 'rumen_protozoa'],
      opts: [tr('İşkembe sıvısı', 'Rumen fluid'), tr('Gölet suyu', 'Pond water'), tr('Ekmek hamuru', 'Bread dough'), tr('Kaplıca suyu', 'Hot-spring water')],
      clue: tr('Mikropların çevresinde ne var: bitki lifleri mi, yeşil algler mi?', 'What are the microbes surrounded by: plant fibres or green algae?'),
      why: tr('Selüloz lifleri ve onları kemiren siliyalılar, bakteriler, mantar iplikleri; hiçbiri yeşil değil. Karanlık, oksijensiz ve ot dolu bir yer: işkembe.', 'Cellulose fibres and the ciliates, bacteria and fungal threads gnawing at them, and nothing green. A dark, oxygen-free place full of grass: the rumen.') },
    { k: 'blood', spec: 'blood', l: 1, proof: ['red_cell'],
      opts: [tr('Memeli kanı', 'Mammal blood'), tr('Kuş kanı', 'Bird blood'), tr('Bakteri kültürü', 'A bacterial culture'), tr('Maya', 'Yeast')],
      clue: tr('Kırmızı hücrelerin çekirdeği var mı?', 'Do the red cells have a nucleus?'),
      why: tr('Alyuvarlar yuvarlak, ortası çukur ve **çekirdeksiz**: bu memelilere özgüdür. Kuşların, kurbağaların ve balıkların alyuvarları ovaldir ve çekirdeklidir. Arada çekirdekli birkaç akyuvar da var.', 'The red cells are round, dimpled and have **no nucleus**: that is unique to mammals. Birds, frogs and fish have oval red cells with a nucleus. A few white cells with nuclei are mixed in.') },
    { k: 'vessels', spec: 'heart', l: 1, proof: ['smooth_muscle', 'red_cell', 'artery'],
      opts: [tr('Atardamar ve toplardamar kesiti', 'A section of an artery and a vein'), tr('Ağaç dalı kesiti', 'A section of a twig'), tr('Bitki kökü kesiti', 'A section of a plant root'), tr('Yaprak kesiti', 'A section of a leaf')],
      clue: tr('Boruların içinde ne var? Duvarları neden yapılmış?', 'What is inside the tubes? What are their walls made of?'),
      why: tr('Kalın, kaslı duvarlı yuvarlak bir boru ve yanında ince duvarlı, alyuvar dolu bir boru: atardamar ve toplardamar. Dal kesitindeki halkalar odundan (ksilem) oluşur, içinde kan olmaz.', 'A round tube with a thick muscular wall beside a thin-walled tube full of red cells: an artery and a vein. The rings in a twig are wood (xylem), with no blood in them.') },
    { k: 'twig', spec: 'apple', l: 1, proof: ['xylem_wood', 'cambium', 'pith'],
      opts: [tr('Odunsu dal kesiti', 'A section of a woody twig'), tr('Atardamar kesiti', 'A section of an artery'), tr('Kök ucu', 'A root tip'), tr('Mantar sapı', 'A mushroom stalk')],
      clue: tr('Ortası boş mu, yoksa dolu bir öz mü var?', 'Is the centre hollow, or is there a solid pith?'),
      why: tr('Ortada öz, çevresinde odun (ksilem) halkası, ince bir kambiyum, sonra soymuk ve kabuk: iki çenekli bir bitkinin dalı. Atardamarın duvarı kastır ve ortası boştur.', 'Pith in the middle, a ring of wood (xylem) round it, a thin cambium, then phloem and bark: the twig of a dicot. An artery’s wall is muscle and its centre is hollow.') },
    { k: 'leaf', spec: 'wheat', l: 1, proof: ['stoma', 'mesophyll'],
      opts: [tr('Yaprak kesiti', 'A leaf section'), tr('Kök kesiti', 'A root section'), tr('Deri kesiti', 'A section of skin'), tr('Kas kesiti', 'A section of muscle')],
      clue: tr('Gaz alışverişi için açıklıklar var mı?', 'Are there openings for gas exchange?'),
      why: tr('Kloroplast dolu mezofil hücreleri, bir iletim demeti ve alt yüzde gözenekler (stoma): gaz alışverişi yapıp fotosentez yapan bir yaprak. Kökte kloroplast ve stoma olmaz.', 'Mesophyll cells packed with chloroplasts, a vascular bundle and pores (stomata) on the lower side: a leaf that exchanges gases and photosynthesises. A root has no chloroplasts and no stomata.') },
    { k: 'roottip', spec: 'sprout', l: 1, proof: ['root_cap', 'root_hair'],
      opts: [tr('Kök ucu', 'A root tip'), tr('Gövde ucu', 'A shoot tip'), tr('Yaprak', 'A leaf'), tr('Çiçek tomurcuğu', 'A flower bud')],
      clue: tr('Ucunda koruyucu bir başlık var mı? Tüyler nerede?', 'Is there a protective cap at the tip? Where are the hairs?'),
      why: tr('Ucunda koruyucu bir kök yüksüğü, arkasında bölünen hücreler (meristem), uzama bölgesi ve emici tüyler: toprağı delerek ilerleyen bir kök ucu.', 'A protective root cap at the tip, dividing cells (meristem) behind it, a zone of elongation and absorbing hairs: a root tip pushing through the soil.') },
    { k: 'spores', spec: 'mushroom', l: 1, proof: ['basidium', 'spores'],
      opts: [tr('Mantar sporları (lamel yüzeyi)', 'Fungal spores (gill surface)'), tr('Polen taneleri', 'Pollen grains'), tr('Bakteri kolonisi', 'A bacterial colony'), tr('Maya', 'Yeast')],
      clue: tr('Tanecikler bir hücrenin ucunda mı duruyor?', 'Are the grains sitting on the tip of a cell?'),
      why: tr('Sopa biçimli hücrelerin (bazidyum) ucunda dörderli sporlar: şapkalı mantarın lamellerinde spor üretimi. Polen ise çiçekte oluşur ve tek tek dağılır.', 'Club-shaped cells (basidia) carrying spores in fours at their tips: spore production on a mushroom’s gills. Pollen forms in flowers and is shed grain by grain.') },
    { k: 'pollen', spec: 'bee', l: 1, proof: ['pollen'],
      opts: [tr('Polen taneleri', 'Pollen grains'), tr('Mantar sporları', 'Fungal spores'), tr('Maya hücreleri', 'Yeast cells'), tr('Kan hücreleri', 'Blood cells')],
      clue: tr('Tanelerin yüzeyi düz mü, dikenli mi?', 'Is the surface of the grains smooth or spiky?'),
      why: tr('Dikenli, kalın kabuklu yuvarlak taneler: çiçeğin erkek üreme hücrelerini taşıyan polen. Bir arının bacağındaki polen sepetinden alınmış.', 'Round grains with a thick, spiky coat: pollen, which carries a flower’s male sex cells. Taken from the pollen basket on a bee’s leg.') },
    { k: 'retina', spec: 'owl', l: 1, proof: ['rod_cell'],
      opts: [tr('Gece avcısının retinası', 'The retina of a night hunter'), tr('Gündüz kuşunun retinası', 'The retina of a daytime bird'), tr('Deri kesiti', 'A section of skin'), tr('Kök kesiti', 'A section of a root')],
      clue: tr('Çomak hücresi mi çok, koni hücresi mi?', 'Are there more rods or more cones?'),
      why: tr('Işığa duyarlı hücrelerin neredeyse hepsi çomak; renk gören koni hücresi çok az. Çomaklar loş ışıkta görmeyi sağlar: bu bir baykuşun retinası.', 'Almost all the light-sensitive cells are rods, with very few colour-seeing cones. Rods let an animal see in dim light: this is an owl’s retina.') },
    { k: 'ruminant', spec: 'cow', l: 3, proof: ['omasal_laminae', 'reticulum_crests', 'reticular_groove'],
      opts: [tr('Geviş getiren bir hayvanın midesi', 'The stomach of a ruminant'), tr('Köpeğin midesi', 'A dog’s stomach'), tr('Tavuğun taşlığı', 'A hen’s gizzard'), tr('İnsan bağırsağı', 'A human intestine')],
      clue: tr('Kaç ayrı bölme görüyorsun? İç yüzeyleri birbirine benziyor mu?', 'How many separate chambers can you see? Do their linings look alike?'),
      why: tr('Dört ayrı bölme: papillalı işkembe, petekli börkenek, yapraklı kırkbayır ve kıvrımlı şirden. Yalnızca geviş getirenlerin (inek, koyun, keçi) midesi böyledir; köpeğin midesi tek bölmelidir.', 'Four separate chambers: the rumen with papillae, the honeycombed reticulum, the leafy omasum and the folded abomasum. Only ruminants (cattle, sheep, goats) have a stomach like this; a dog’s stomach has a single chamber.') },
    { k: 'hotspring', spec: 'spring', l: 1, proof: ['sulfur_granule', 'archaea'],
      opts: [tr('Sıcak su kaynağının mikrobiyal örtüsü', 'The microbial mat of a hot spring'), tr('Gölet suyu', 'Pond water'), tr('İşkembe sıvısı', 'Rumen fluid'), tr('Toprak', 'Soil')],
      clue: tr('Hücrelerin içinde parlak sarı taneler var mı?', 'Are there shiny yellow grains inside the cells?'),
      why: tr('Hücrelerin içinde parlak kükürt taneleri, arkeler ve siyanobakteriler: sıcak, kükürtlü suda yaşayan bir topluluk. Gölet suyunda kükürt biriktiren bakteriler bu kadar bol olmaz.', 'Shiny grains of sulphur inside cells, archaea and cyanobacteria: a community living in hot, sulphurous water. Pond water would not be crowded with sulphur-storing bacteria.') },
    { k: 'muscle', spec: 'snack', l: 2, proof: ['sarcomere', 'mitochondrion'],
      opts: [tr('Kas hücresi', 'A muscle cell'), tr('Bitki hücresi', 'A plant cell'), tr('Bakteri', 'A bacterium'), tr('Sinir hücresi', 'A nerve cell')],
      clue: tr('Tekrar eden bantlar görüyor musun?', 'Can you see repeating bands?'),
      why: tr('Düzenli bantlar hâlinde dizilmiş kasılma birimleri (sarkomerler) ve aralarında bol mitokondri: çok enerji harcayan bir kas hücresi, elektron mikroskobuyla ×20 000 büyütülmüş.', 'Contraction units lined up in regular bands (sarcomeres), with plenty of mitochondria between them: a muscle cell that spends a lot of energy, magnified ×20,000 with an electron microscope.') },
    { k: 'soil', spec: 'soil', l: 1, proof: ['springtail', 'nematode'],
      opts: [tr('Toprak örneği', 'A soil sample'), tr('Gölet damlası', 'A drop of pond water'), tr('İşkembe sıvısı', 'Rumen fluid'), tr('Hamur', 'Dough')],
      clue: tr('Tanelerin arasında kimler yaşıyor?', 'Who lives between the grains?'),
      why: tr('Kum ve kil tanelerinin arasında bakteriler, kıl kurtları (nematod) ve kuyruğuyla sıçrayan küçük eklembacaklılar: toprağın ayrıştırıcıları.', 'Among grains of sand and clay: bacteria, roundworms (nematodes) and tiny arthropods that jump with their tails. The decomposers of the soil.') },
  ],
  get(k) { return this.LIST.find(s => s.k === k); },
  state(it) { return Object.assign(LENS.state({ spec: it.spec }), it.st || {}); },
  parts(it) { const lv = SPECS[it.spec].levels[it.l], st = this.state(it), list = typeof lv.callouts === 'function' ? lv.callouts(st) : lv.callouts; return list.map(([id, px, py]) => ({ id, px, py })); },
  // only the magnification: the layer's own label would give the answer away
  mag(it) { return STUDY.splitTag(SPECS[it.spec].levels[it.l].tag)[0]; },
  // the plate fitted into a canvas; returns the fit so taps can be mapped back to plate units
  draw(cv, it, t, over) {
    const r = cv.getBoundingClientRect(), dpr = G.dpr;
    if (!r.width || !r.height) return null;
    if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) { cv.width = Math.max(2, Math.round(r.width * dpr)); cv.height = Math.max(2, Math.round(r.height * dpr)); }
    const f = { z: Math.min(r.width, r.height) * 0.96 / 280, cx: r.width / 2, cy: r.height / 2 }, c = cv.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, r.width, r.height);
    c.save(); c.translate(f.cx, f.cy); c.scale(f.z, f.z);
    const st = this.state(it); st.t = t;
    c.save(); c.beginPath(); c.rect(-140, -140, 280, 280); c.clip(); SPECS[it.spec].levels[it.l].draw(c, st); c.restore();
    c.strokeStyle = '#1B1A17'; c.lineWidth = 2 / f.z; c.strokeRect(-140, -140, 280, 280);
    if (over) over(c, f.z);
    c.restore();
    return f;
  },
  toPlate(cv, f, e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left - f.cx) / f.z, (e.clientY - r.top - f.cy) / f.z]; },
  // rounds from different specimens, never two plates of the same animal or plant in one go
  pick(n, from = this.LIST) {
    const out = [], used = new Set();
    for (const s of shuffle(from.slice())) { if (used.has(s.spec)) continue; used.add(s.spec); out.push(s); if (out.length >= n) break; }
    return out;
  },
};

const MYSTERY = {
  on: false, el: null, st: null, raf: 0, N: 5,
  open(opt = {}) {
    if (this.on) return;
    if (STUDY.on) STUDY.close();
    if (LENS.on) LENS.toggle(false);
    this.on = true;
    const el = this.el = h('div', 'modal mystery');
    el._key = e => { if (e.code === 'Escape') this.close(); };
    UI._push('mystery', el);
    AU.sfx('page');
    const items = opt.items ? opt.items.map(k => SAMPLE.get(k)) : SAMPLE.pick(this.N);
    this.st = { items, i: -1, score: 0, max: items.length * 4, log: [], t: 0 };
    el.innerHTML = `<div class="my-wrap paper">
      <button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      <div class="my-top"><small class="my-round"></small><b class="my-score"></b></div>
      <div class="my-body">
        <div class="my-plate"><canvas></canvas><span class="my-mag"></span></div>
        <div class="my-side"><p class="my-kick"></p><h3 class="my-q"></h3><div class="my-opts"></div><p class="my-fb"></p>
          <div class="my-foot"><button class="my-hint">${U.esc(L(tr('İpucu (−1)', 'Hint (−1)')))}</button><button class="big yes my-next hidden"></button></div></div>
      </div></div>`;
    el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    el.querySelector('.my-hint').onclick = () => this.hint();
    el.querySelector('.my-next').onclick = () => { AU.sfx('click'); this.next(); };
    this.cv = el.querySelector('.my-plate canvas');
    this.cv.addEventListener('pointerdown', e => { e.preventDefault(); if (this.st.fit) this.tap(...SAMPLE.toPlate(this.cv, this.st.fit, e)); });
    let last = performance.now();
    const loop = now => { if (!this.on) return; const dt = U.clamp((now - last) / 1000, 0, 0.05); last = now; this.frame(dt); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.next();
  },
  close() {
    if (!this.on) return;
    this.on = false; cancelAnimationFrame(this.raf);
    UI._pop(this.el);
  },
  item() { return this.st.items[this.st.i]; },
  next() {
    const s = this.st; s.i++;
    if (s.i >= s.items.length) { this.finish(); return; }
    const it = this.item();
    Object.assign(s, { phase: 'id', tries: 0, ptries: 0, hinted: false, got: 0, mark: null, miss: [] });
    s.opts = shuffle(it.opts.map((t, j) => ({ t, ok: j === 0 })));
    const q = s => this.el.querySelector(s);
    q('.my-round').textContent = L(tr(`Gizemli numune ${s.i + 1} / ${s.items.length}`, `Mystery sample ${s.i + 1} / ${s.items.length}`));
    q('.my-mag').textContent = SAMPLE.mag(it);
    q('.my-kick').textContent = L(tr('1. adım · Tanı', 'Step 1 · Identify'));
    q('.my-q').textContent = L(tr('Bu numune ne olabilir?', 'What could this sample be?'));
    q('.my-fb').innerHTML = ''; q('.my-next').classList.add('hidden'); q('.my-hint').classList.remove('hidden'); q('.my-hint').disabled = false;
    const box = q('.my-opts'); box.innerHTML = '';
    s.opts.forEach((o, j) => { const b = h('button', 'ans', U.esc(L(o.t))); b.onclick = () => this.choose(j); box.appendChild(b); });
    this._score();
  },
  hint() {
    const s = this.st; if (s.hinted || s.phase === 'done') return;
    s.hinted = true; s.score = Math.max(0, s.score - 1); AU.sfx('page');
    this.el.querySelector('.my-fb').innerHTML = `<i>${U.esc(L(tr('İpucu: ', 'Hint: ')))}</i>${U.esc(L(this.item().clue))}`;
    this.el.querySelector('.my-hint').disabled = true; this._score();
  },
  // step 1: the identification
  choose(j) {
    const s = this.st; if (s.phase !== 'id') return;
    const o = s.opts[j], b = this.el.querySelectorAll('.my-opts .ans')[j];
    s.tries++;
    if (!o.ok) {
      b.classList.add('x'); b.disabled = true; AU.sfx('wrong');
      this.el.querySelector('.my-fb').innerHTML = U.esc(L(tr('Tam değil. Görüntüye bir daha bak: ', 'Not quite. Look at the plate again: '))) + U.esc(L(this.item().clue));
      return;
    }
    b.classList.add('ok'); AU.sfx('success');
    s.got += s.tries === 1 ? 2 : s.tries === 2 ? 1 : 0; s.score += s.tries === 1 ? 2 : s.tries === 2 ? 1 : 0;
    this.el.querySelectorAll('.my-opts .ans').forEach(x => { x.disabled = true; });
    s.phase = 'proof';
    this.el.querySelector('.my-kick').textContent = L(tr('2. adım · Kanıt', 'Step 2 · Evidence'));
    this.el.querySelector('.my-q').textContent = L(tr(`Evet: ${L(o.t)}. Şimdi görüntüde bunu kanıtlayan yapıya dokun.`, `Yes: ${L(o.t)}. Now tap the structure on the plate that proves it.`));
    this.el.querySelector('.my-fb').textContent = L(tr('Yuvarlak işaretler yapıların yerini gösteriyor. Hangisi bu numuneyi ötekilerden ayırıyor?', 'The rings show where the structures are. Which one sets this sample apart from the others?'));
    this._score();
  },
  // step 2: the evidence, in plate units
  tap(px, py) {
    const s = this.st; if (!s || s.phase !== 'proof') return null;
    const it = this.item(), parts = SAMPLE.parts(it);
    let best = null, bd = 24;
    for (const p of parts) { const d = Math.hypot(p.px - px, p.py - py); if (d < bd) { bd = d; best = p; } }
    const fb = this.el.querySelector('.my-fb');
    if (!best) { fb.textContent = L(tr('Orada işaretli bir yapı yok: halkalardan birine dokun.', 'There is no marked structure there: tap one of the rings.')); return null; }
    s.ptries++;
    if (it.proof.includes(best.id)) {
      const pts = s.ptries === 1 ? 2 : s.ptries === 2 ? 1 : 0;
      s.got += pts; s.score += pts; s.mark = { p: best, ok: true }; s.phase = 'done'; AU.sfx('success');
      fb.innerHTML = `<b>${U.esc(L(OBS[best.id].title))}.</b> ${md(L(it.why))}`;
      s.log.push({ k: it.k, got: s.got, hinted: s.hinted });
      this.el.querySelector('.my-hint').classList.add('hidden');
      const nx = this.el.querySelector('.my-next'); nx.textContent = s.i + 1 >= s.items.length ? L(tr('Sonuç ▸', 'Results ▸')) : L(tr('Sonraki numune ▸', 'Next sample ▸')); nx.classList.remove('hidden');
      this._score();
      return true;
    }
    s.miss.push(best.id); s.mark = { p: best, ok: false }; AU.sfx('wrong');
    fb.innerHTML = `<b>${U.esc(L(OBS[best.id].title))}:</b> ${U.esc(L(OBS[best.id].text))} ${U.esc(L(tr('Bu yapı başka numunelerde de bulunur; bunu tek başına kanıtlamaz. Başka bir yapı dene.', 'This structure turns up in other samples too, so on its own it proves nothing. Try another.')))}`;
    return false;
  },
  frame(dt) {
    const s = this.st; if (!s || s.phase === 'end') return;
    s.t += dt;
    const it = this.item(); if (!it) return;
    s.fit = SAMPLE.draw(this.cv, it, G.t + s.t, (c, z) => {
      if (s.phase === 'id') return;
      for (const p of SAMPLE.parts(it)) {
        const hit = s.mark && s.mark.p.id === p.id, col = hit ? (s.mark.ok ? '#3F8A3A' : '#B8402E') : s.miss.includes(p.id) ? '#B8402E' : '#FFFFFF';
        c.lineWidth = (hit ? 3.2 : 2) / z; c.strokeStyle = 'rgba(0,0,0,0.55)'; c.beginPath(); c.arc(p.px, p.py, 9 + 1 / z, 0, TAU); c.stroke();
        c.strokeStyle = col; c.beginPath(); c.arc(p.px, p.py, 9, 0, TAU); c.stroke();
      }
    });
  },
  _score() { this.el.querySelector('.my-score').textContent = '★ ' + this.st.score + ' / ' + this.st.max; },
  finish() {
    const s = this.st, S = G.S;
    s.phase = 'end';
    const rows = s.items.map(it => { const lg = s.log.find(q => q.k === it.k); return [it.opts[0], String(lg ? lg.got : 0) + ' / 4']; });
    S.mystery = S.mystery || { played: 0, best: 0 };
    S.mystery.played++; S.mystery.best = Math.max(S.mystery.best, s.score);
    S.journal.exps.push({ title: tr('Gizemli numuneler', 'Mystery samples'), code: 'BİY.9.1.5', t: Date.now(),
      head: [tr('Numune', 'Sample'), tr('Puan', 'Score')], rows,
      chart: { values: s.items.map(it => { const lg = s.log.find(q => q.k === it.k); return lg ? lg.got : 0; }), labels: s.items.map(it => it.opts[0]), colors: s.items.map(() => '#6E8F4E') },
      note: tr('Her numunede: doğru tanı 2 puan, doğru kanıt 2 puan; ipucu 1 puan götürür. Bir canlıyı adıyla değil, ona özgü yapılarıyla tanırız.', 'For each sample: the right identification scores 2, the right evidence 2; a hint costs 1. We recognise a living thing by the structures only it has, not by its name.') });
    G.save();
    const pct = s.score / s.max;
    this.el.querySelector('.my-body').innerHTML = `<div class="my-end"><h2>${U.esc(L(pct >= 0.8 ? tr('Usta gözlemci!', 'Master observer!') : pct >= 0.5 ? tr('İyi iş!', 'Good work!') : tr('Gözün alışıyor', 'Your eye is getting used to it')))}</h2>
      <div class="my-final">★ ${s.score} / ${s.max}</div>
      <ol>${s.items.map((it, j) => `<li><b>${U.esc(L(it.opts[0]))}</b> · ${U.esc(rows[j][1])}</li>`).join('')}</ol>
      <p>${U.esc(L(tr('Sonuçlar defterinin Deneyler sayfasında.', 'The results are on the Experiments page of your journal.')))}</p>
      <div class="my-foot"><button class="my-again">${U.esc(L(tr('Yeni numuneler', 'New samples')))}</button><button class="big yes my-close">${U.esc(T('close'))}</button></div></div>`;
    this.el.querySelector('.my-again').onclick = () => { AU.sfx('click'); this.close(); this.open(); };
    this.el.querySelector('.my-close').onclick = () => { AU.sfx('click'); this.close(); };
    this.el.querySelector('.my-top .my-round').textContent = L(tr('Gizemli numuneler bitti', 'Mystery samples done'));
    UI.stamp(L(tr('GÖZLEMCİ', 'OBSERVER')), '★ ' + s.score + ' / ' + s.max);
  },
};
