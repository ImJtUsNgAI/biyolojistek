'use strict';
// Nurse Zehra's notebook in the village clinic. She is busy with the vaccination day, so four patients wait for you.
// Each shows a complaint; examining them and asking what they eat reveals the rest. The notebook holds a page for
// every vitamin and mineral: what it does, where it comes from, what goes wrong without it. Match the patient to the
// page. The tempting near-miss (B12 for iron, K for C, calcium for D) gets its own answer, so a wrong pick still teaches.
const EKSIK = {
  NOTE: [
    { id: 'A', k: 'vit', fat: true, n: tr('A vitamini', 'Vitamin A'),
      does: tr('Gözde loş ışıkta görmeyi sağlayan pigmentin parçasıdır; deriyi ve solunum yollarının iç yüzünü sağlam tutar, bağışıklığa yardım eder.', 'It is part of the pigment that lets the eye see in dim light; it keeps the skin and the lining of the airways healthy and helps immunity.'),
      src: tr('Karaciğer, yumurta sarısı, tereyağı; havuç, balkabağı, ıspanak (beta-karoten olarak).', 'Liver, egg yolk, butter; carrots, pumpkin, spinach (as beta-carotene).'),
      low: tr('Alacakaranlıkta görememe, göz ve derinin kuruması, sık enfeksiyon.', 'Not seeing at dusk, dry eyes and skin, frequent infections.'),
      dis: tr('Gece körlüğü', 'Night blindness') },
    { id: 'D', k: 'vit', fat: true, n: tr('D vitamini', 'Vitamin D'),
      does: tr('Bağırsaktan kalsiyum ve fosfor emilmesini sağlar; böylece kemik sertleşir.', 'It lets the gut absorb calcium and phosphorus, so bones can harden.'),
      src: tr('Güneş ışığı alan deri kendisi yapar. Yağlı balık, yumurta sarısı.', 'Skin makes it in sunlight. Oily fish, egg yolk.'),
      low: tr('Çocukta yumuşak, eğrilen kemikler, geç yürüme, geç diş; yetişkinde kemik ağrısı.', 'In children, soft bones that bend, late walking and late teeth; in adults, bone pain.'),
      dis: tr('Raşitizm (çocuk), osteomalazi (yetişkin)', 'Rickets (child), osteomalacia (adult)') },
    { id: 'E', k: 'vit', fat: true, n: tr('E vitamini', 'Vitamin E'),
      does: tr('Antioksidandır: hücre zarındaki yağları bozulmaktan korur.', 'An antioxidant: it protects the fats in cell membranes from damage.'),
      src: tr('Fındık, ceviz, ayçiçeği çekirdeği, bitkisel yağlar, zeytinyağı.', 'Hazelnuts, walnuts, sunflower seeds, vegetable oils, olive oil.'),
      low: tr('Seyrek görülür: kas güçsüzlüğü, sinir hasarı, alyuvarların kolay parçalanması.', 'Rare: weak muscles, nerve damage, red cells that break easily.'),
      dis: tr('Özel adı yok; çoğu zaman yağ sindirimi bozuk olanlarda', 'No special name; usually in people who cannot digest fat') },
    { id: 'K', k: 'vit', fat: true, n: tr('K vitamini', 'Vitamin K'),
      does: tr('Karaciğerin kan pıhtılaştırma proteinlerini yapmasını sağlar.', 'It lets the liver make the proteins that clot blood.'),
      src: tr('Yeşil yapraklı sebzeler; kalın bağırsaktaki bakteriler de yapar.', 'Green leafy vegetables; bacteria in the large intestine make it too.'),
      low: tr('Kanın geç pıhtılaşması, burun kanaması, kolay morarma. Yenidoğana bu yüzden K iğnesi yapılır.', 'Slow clotting, nosebleeds, easy bruising. That is why newborns get a vitamin K shot.'),
      dis: tr('Pıhtılaşma bozukluğu', 'Clotting disorder') },
    { id: 'B1', k: 'vit', n: tr('B1 vitamini (tiamin)', 'Vitamin B1 (thiamine)'),
      does: tr('Karbonhidratlardan enerji elde eden enzimlere yardım eder; sinir ve kalp için şarttır.', 'It helps the enzymes that get energy from carbohydrates; nerves and heart depend on it.'),
      src: tr('Tam tahıl, bulgur, kuru baklagiller, et.', 'Whole grains, bulgur, dried legumes, meat.'),
      low: tr('El ve ayaklarda güçsüzlük, sinir hasarı, kalp yetmezliği.', 'Weak hands and feet, nerve damage, heart failure.'),
      dis: tr('Beriberi (kabuğu soyulmuş pirinçle beslenenlerde)', 'Beriberi (in people living on polished rice)') },
    { id: 'B3', k: 'vit', n: tr('B3 vitamini (niasin)', 'Vitamin B3 (niacin)'),
      does: tr('Hücre solunumunda elektron taşıyan NAD molekülünün parçasıdır.', 'It is part of NAD, the molecule that carries electrons in cellular respiration.'),
      src: tr('Et, balık, fıstık, tam tahıl.', 'Meat, fish, peanuts, whole grains.'),
      low: tr('Üç D: dermatit (güneşte kızaran deri), diyare (ishal), demans (unutkanlık).', 'The three Ds: dermatitis (skin that burns in the sun), diarrhoea, dementia.'),
      dis: tr('Pellagra (yalnız mısırla beslenenlerde)', 'Pellagra (in people living on maize alone)') },
    { id: 'B9', k: 'vit', n: tr('Folik asit (B9)', 'Folate (B9)'),
      does: tr('DNA yapımında ve hücre bölünmesinde gerekir; en çok hızlı bölünen hücreler etkilenir.', 'Needed to make DNA and divide cells, so fast-dividing cells suffer first.'),
      src: tr('Yeşil yapraklı sebzeler, mercimek, nohut, portakal.', 'Green leafy vegetables, lentils, chickpeas, oranges.'),
      low: tr('Büyük hücreli kansızlık; hamilelikte bebekte omurilik kapanma kusuru.', 'Anaemia with large red cells; in pregnancy, a baby whose spinal cord does not close.'),
      dis: tr('Megaloblastik anemi', 'Megaloblastic anaemia') },
    { id: 'B12', k: 'vit', n: tr('B12 vitamini', 'Vitamin B12'),
      does: tr('Alyuvar yapımında ve sinirlerin yalıtım kılıfının (miyelin) korunmasında gerekir.', 'Needed to make red cells and to keep the insulating sheath of nerves (myelin).'),
      src: tr('Yalnız hayvansal besinler: et, balık, yumurta, süt.', 'Only animal foods: meat, fish, eggs, milk.'),
      low: tr('Kansızlık ve yorgunluk, ama ayrıca el ve ayaklarda uyuşma, karıncalanma, unutkanlık.', 'Anaemia and tiredness, but also numbness and tingling in hands and feet, and forgetfulness.'),
      dis: tr('Pernisiyöz anemi', 'Pernicious anaemia') },
    { id: 'C', k: 'vit', n: tr('C vitamini', 'Vitamin C'),
      does: tr('Diş eti, deri, damar duvarı ve yarayı bir arada tutan kolajenin yapımında gerekir; bitkisel demirin emilimini artırır.', 'Needed to make collagen, which holds together gums, skin, vessel walls and healing wounds; it boosts the absorption of plant iron.'),
      src: tr('Taze meyve ve sebze: biber, maydanoz, limon, portakal, kuşburnu. Pişince azalır.', 'Fresh fruit and vegetables: peppers, parsley, lemon, orange, rosehip. Cooking destroys some.'),
      low: tr('Şişip kanayan diş eti, nedensiz morluklar, geç kapanan yaralar, eklem ağrısı, kıl diplerinde kırmızı noktalar.', 'Swollen bleeding gums, bruises from nothing, wounds that will not heal, sore joints, red dots around hair roots.'),
      dis: tr('İskorbüt', 'Scurvy') },
    { id: 'Fe', k: 'min', n: tr('Demir', 'Iron'),
      does: tr('Alyuvarlardaki hemoglobinin merkezindedir: oksijeni akciğerden dokulara taşır.', 'It sits at the heart of haemoglobin in red cells, carrying oxygen from lungs to tissues.'),
      src: tr('Kırmızı et, ciğer, mercimek, nohut, kuru kayısı. C vitamini emilimini artırır; yemekle içilen çay azaltır.', 'Red meat, liver, lentils, chickpeas, dried apricots. Vitamin C helps it in; tea with meals keeps it out.'),
      low: tr('Solgunluk, yorgunluk, merdivende nefes nefese kalma, soğuk eller, ince kaşık gibi tırnaklar, buz çiğneme isteği.', 'Paleness, tiredness, breathlessness on stairs, cold hands, thin spoon-shaped nails, a craving to chew ice.'),
      dis: tr('Demir eksikliği anemisi', 'Iron-deficiency anaemia') },
    { id: 'Ca', k: 'min', n: tr('Kalsiyum', 'Calcium'),
      does: tr('Kemik ve dişin sert maddesi; kas kasılması, sinir iletimi ve kan pıhtılaşması için de gerekir.', 'The hard stuff of bones and teeth; also needed for muscle contraction, nerve signals and blood clotting.'),
      src: tr('Süt, yoğurt, peynir, tahin, yeşil yapraklı sebzeler.', 'Milk, yoghurt, cheese, tahini, green leafy vegetables.'),
      low: tr('Kas krampları; yıllar içinde kemik erimesi ve kolay kırılan kemikler.', 'Muscle cramps; over the years, thinning bones that break easily.'),
      dis: tr('Osteoporoz (kemik erimesi)', 'Osteoporosis') },
    { id: 'I', k: 'min', n: tr('İyot', 'Iodine'),
      does: tr('Tiroit bezi onunla metabolizmayı ve büyümeyi ayarlayan hormonları yapar.', 'The thyroid gland uses it to make the hormones that set metabolism and growth.'),
      src: tr('İyotlu sofra tuzu, deniz balığı, süt.', 'Iodised table salt, sea fish, milk.'),
      low: tr('Boynun önünde şişlik (guatr), yorgunluk, üşüme, kilo alma; bebekte zekâ geriliği.', 'A swelling at the front of the neck (goitre), tiredness, feeling cold, weight gain; in babies, learning disability.'),
      dis: tr('Guatr', 'Goitre') },
    { id: 'Zn', k: 'min', n: tr('Çinko', 'Zinc'),
      does: tr('Yüzlerce enzimin parçasıdır: büyüme, bağışıklık, yara iyileşmesi, tat ve koku alma.', 'Part of hundreds of enzymes: growth, immunity, wound healing, taste and smell.'),
      src: tr('Et, kabak çekirdeği, baklagiller, tam tahıl.', 'Meat, pumpkin seeds, legumes, whole grains.'),
      low: tr('Çocukta büyüme geriliği, tat ve koku kaybı, saç dökülmesi, sık enfeksiyon.', 'Stunted growth in children, loss of taste and smell, hair loss, frequent infections.'),
      dis: tr('Özel adı yok', 'No special name') },
    { id: 'Mg', k: 'min', n: tr('Magnezyum', 'Magnesium'),
      does: tr('Kas ve sinirlerin gevşemesinde, enerji üreten yüzlerce enzimde görev alır.', 'It helps muscles and nerves relax and works in hundreds of energy-making enzymes.'),
      src: tr('Fındık, badem, tam tahıl, yeşil yapraklı sebzeler.', 'Hazelnuts, almonds, whole grains, green leafy vegetables.'),
      low: tr('Kas seğirmesi ve krampları, düzensiz kalp atışı.', 'Twitching and cramping muscles, an irregular heartbeat.'),
      dis: tr('Özel adı yok', 'No special name') },
  ],
  PAT: [
    { id: 'selin', ans: 'Fe', n: tr('Selin, 16', 'Selin, 16'),
      c: tr('“Hep yorgunum. Okulun merdivenini çıkınca nefes nefese kalıyorum, derste kafam durmuyor.”', '“I’m always tired. I’m out of breath after the school stairs, and I can’t concentrate in class.”'),
      ex: tr('Göz kapağının içi soluk pembe. Tırnaklar ince, kaşık gibi çukur. Eller soğuk, nabız hızlı. El ve ayaklarda uyuşma yok.', 'The inside of her eyelid is pale. Her nails are thin and dished like spoons. Cold hands, a fast pulse. No numbness in hands or feet.'),
      diet: tr('Bir yıldır et yemiyor; süt, yumurta yiyor. “Demir için” ıspanak yiyor ama her yemekle iki bardak çay içiyor. Buz çiğnemeyi çok seviyor.', 'She stopped eating meat a year ago but eats milk and eggs. She eats spinach “for the iron”, but drinks two glasses of tea with every meal. She loves chewing ice.'),
      miss: { B12: tr('B12 eksikliği de kansızlık yapar, ama el ve ayaklarda uyuşma, karıncalanma olurdu. Selin’de yok; üstelik süt ve yumurtadan B12 alıyor.', 'B12 deficiency also causes anaemia, but with numb, tingling hands and feet. Selin has none, and she gets B12 from milk and eggs.'),
        B9: tr('Folik asit eksikliği de kansızlık yapar, ama Selin bol yeşil yaprak yiyor. Kaşık tırnak ve buz isteği başka bir şeyi gösteriyor.', 'Folate deficiency also causes anaemia, but Selin eats plenty of greens. The spoon nails and the ice craving point elsewhere.') } },
    { id: 'recep', ans: 'C', n: tr('Recep Dede, 78', 'Recep Dede, 78'),
      c: tr('“Dişimi fırçalayınca diş etim kanıyor. Bacaklarımda morluklar var, bir yere çarpmadım. Elimdeki kesik üç haftadır kapanmadı.”', '“My gums bleed when I brush. I’ve bruises on my legs and I haven’t knocked anything. The cut on my hand hasn’t closed in three weeks.”'),
      ex: tr('Diş etleri şiş, mor. Bacaklarda kıl diplerinde küçük kırmızı noktalar, kıllar kıvrık. Dizler ağrılı.', 'His gums are swollen and purple. Small red dots around the hair roots on his legs; the hairs are curled. Sore knees.'),
      diet: tr('Eşi öldüğünden beri yemek yapmıyor: ekmek, peynir, çay, makarna. Aylardır meyve, sebze yemedi.', 'Since his wife died he hasn’t cooked: bread, cheese, tea, pasta. No fruit or vegetables for months.'),
      miss: { K: tr('K eksikliği de kanama ve morluk yapar, ama diş etini şişirmez, yarayı açık bırakmaz, kılları kıvırmaz. Bunlar kolajenin yapılamadığını gösterir.', 'Vitamin K deficiency also causes bleeding and bruises, but it doesn’t swell gums, keep wounds open or curl hairs. Those show that collagen isn’t being made.'),
        Zn: tr('Çinko da yara iyileşmesinde gerekir, ama çinko eksikliği diş etini kanatmaz; Recep Dede peynirden, ekmekten çinko alıyor.', 'Zinc helps wounds heal too, but its lack doesn’t make gums bleed, and Recep Dede gets zinc from cheese and bread.') } },
    { id: 'omer', ans: 'D', n: tr('Ömer, 18 aylık', 'Ömer, 18 months'),
      c: tr('Annesi: “Yaşıtları yürüyor, o daha yürümüyor. Bacakları da dışa doğru eğri. Geceleri başı terliyor.”', 'His mother: “Children his age are walking and he isn’t. His legs bow outwards. His head sweats at night.”'),
      ex: tr('O biçimli bacaklar, kalın bilekler, kaburgalar boyunca boncuk gibi şişlikler. Bıngıldak hâlâ açık, iki dişi var.', 'Bowed legs, thick wrists, bead-like bumps along the ribs. The soft spot on his skull is still open; he has two teeth.'),
      diet: tr('Kışın doğdu, şehirde apartmanda, sıkıca sarılı hep evde kaldı; balkona bile çıkmadı. Günde üç bardak süt içiyor.', 'Born in winter, in a city flat, always indoors and bundled up; not even out on the balcony. Drinks three glasses of milk a day.'),
      miss: { Ca: tr('Kemiği kalsiyum yapar, ama Ömer bol süt içiyor. Sorun kalsiyumu bağırsaktan alamaması. Bunu hangi vitamin sağlar, o da nerede yapılır?', 'Calcium builds bone, but Ömer drinks plenty of milk. The trouble is getting it out of the gut. Which vitamin does that, and where is it made?') } },
    { id: 'gulsum', ans: 'I', n: tr('Gülsüm Teyze, 45', 'Gülsüm Teyze, 45'),
      c: tr('“Boynumdaki şişlik yıllardır büyüyor, yakam dar geliyor. Hep üşüyorum, yoruluyorum, kilo aldım.”', '“The lump in my neck has been growing for years and my collar feels tight. I’m always cold and tired, and I’ve put on weight.”'),
      ex: tr('Boynun önünde ağrısız, yumuşak bir şişlik; yutkununca yukarı kalkıyor. Deri kuru, nabız yavaş.', 'A soft painless swelling at the front of her neck that rises when she swallows. Dry skin, a slow pulse.'),
      diet: tr('Yaylada yaşıyor. Tuzu hep yayladaki kaya tuzundan, iri iri kullanıyor. Deniz balığı hiç yemedi.', 'She lives up on the yayla. Her salt is always coarse rock salt from the mountain. She has never eaten sea fish.'),
      miss: {} },
  ],

  open() {
    const S = G.S;
    const run = S.eksik || (S.eksik = { done: {}, seen: {}, wrong: 0, full: 0 });
    this.st = { run, p: Math.max(0, this.PAT.findIndex(p => !run.done[p.id])), tab: 'vit', page: null };
    const body = h('div', 'kit eksik');
    body.innerHTML = `<div class="ek-who"></div><div class="ek-grid"><div class="ek-pat"></div><div class="ek-book"></div></div>
      <div class="rig-bottom"><div class="stamps"></div><div class="rig-table"></div></div><p class="kit-msg"></p>`;
    this.body = body;
    this.pn = UI.panel({ title: tr('Hemşire Zehra’nın defteri · Eksiklik tanısı', 'Nurse Zehra’s notebook · Spotting a deficiency'), code: 'BİY.9.2.2', body, wide: true, cls: 'rigpanel', onClose: () => this.close() });
    body.addEventListener('click', e => this._click(e));
    this._msg(tr('Hastayı muayene et, ne yediğini sor, sonra defterde belirtileri uyan sayfayı bul.', 'Examine the patient, ask what they eat, then find the notebook page whose signs match.'));
    this.draw();
  },
  _click(e) {
    const b = e.target.closest('button'); if (!b) return;
    const st = this.st, run = st.run, p = this.PAT[st.p], d = b.dataset;
    AU.sfx('click');
    if (d.p != null) { st.p = +d.p; st.page = null; }
    else if (d.tab) { st.tab = d.tab; st.page = null; }
    else if (d.page) st.page = d.page;
    else if (d.back) st.page = null;
    else if (d.clue) { (run.seen[p.id] || (run.seen[p.id] = {}))[d.clue] = true; }
    else if (d.dx) {
      const n = this.NOTE.find(x => x.id === d.dx);
      if (d.dx === p.ans) {
        const full = run.seen[p.id] && run.seen[p.id].ex && run.seen[p.id].diet;
        run.done[p.id] = d.dx; if (full) run.full++;
        this._msg(tr(`Doğru: ${L(n.n)} eksikliği, ${L(n.dis).toLocaleLowerCase('tr')}. Zehra Hanım gelince reçeteyi yazacak.`, `Right: ${L(n.n)} deficiency, ${L(n.dis).toLowerCase()}. Nurse Zehra will write the prescription when she’s free.`));
        const next = this.PAT.findIndex(x => !run.done[x.id]); if (next >= 0) { st.p = next; st.page = null; }
      } else {
        run.wrong++;
        this._msg(p.miss[d.dx] || tr(`${L(n.n)} eksikliğinde beklenen: ${L(n.low)} Hastanın belirtileri buna uymuyor.`, `With too little ${L(n.n)} you would expect: ${L(n.low)} The patient’s signs don’t fit.`));
      }
    }
    this.draw(); G.save();
  },
  draw() {
    const st = this.st, run = st.run, p = this.PAT[st.p], seen = run.seen[p.id] || {}, b = this.body;
    b.querySelector('.ek-who').innerHTML = this.PAT.map((x, i) => `<button data-p="${i}" class="${i === st.p ? 'on' : ''} ${run.done[x.id] ? 'done' : ''}">${U.esc(L(x.n))}</button>`).join('');
    b.querySelector('.ek-pat').innerHTML = `<h4>${U.esc(L(p.n))}</h4><p>${U.esc(L(p.c))}</p>
      ${seen.ex ? `<p><b>${L(tr('Muayene', 'Examination'))}:</b> ${U.esc(L(p.ex))}</p>` : `<button data-clue="ex">🩺 ${L(tr('Muayene et', 'Examine'))}</button>`}
      ${seen.diet ? `<p><b>${L(tr('Beslenme', 'Diet'))}:</b> ${U.esc(L(p.diet))}</p>` : `<button data-clue="diet">🍞 ${L(tr('Ne yediğini sor', 'Ask what they eat'))}</button>`}
      ${run.done[p.id] ? `<p class="ek-ok">✓ ${U.esc(L(this.NOTE.find(n => n.id === run.done[p.id]).n))}</p>` : ''}`;
    const tabs = `<div class="ek-tabs"><button data-tab="vit" class="${st.tab === 'vit' ? 'on' : ''}">${L(tr('Vitaminler', 'Vitamins'))}</button><button data-tab="min" class="${st.tab === 'min' ? 'on' : ''}">${L(tr('Mineraller', 'Minerals'))}</button></div>`;
    const n = st.page && this.NOTE.find(x => x.id === st.page);
    b.querySelector('.ek-book').innerHTML = tabs + (n ? `<div class="ek-page"><h4>${U.esc(L(n.n))}${n.k === 'vit' ? ` <small>${L(n.fat ? tr('yağda çözünür', 'fat-soluble') : tr('suda çözünür', 'water-soluble'))}</small>` : ''}</h4>
        <p><b>${L(tr('Ne yapar', 'What it does'))}:</b> ${U.esc(L(n.does))}</p><p><b>${L(tr('Nerede bulunur', 'Where it is found'))}:</b> ${U.esc(L(n.src))}</p>
        <p><b>${L(tr('Eksikliğinde', 'When it is lacking'))}:</b> ${U.esc(L(n.low))}</p><p><b>${L(tr('Hastalık', 'Disease'))}:</b> ${U.esc(L(n.dis))}</p>
        <div class="ek-act"><button data-back="1">← ${L(tr('Dizin', 'Index'))}</button>${run.done[p.id] ? '' : `<button data-dx="${n.id}" class="primary">${L(tr(`Tanı: ${L(n.n)} eksikliği`, `Diagnose: too little ${L(n.n)}`))}</button>`}</div></div>`
      : `<div class="ek-index">${this.NOTE.filter(x => x.k === st.tab).map(x => `<button data-page="${x.id}"><b>${U.esc(L(x.n))}</b><span>${U.esc(L(x.dis))}</span></button>`).join('')}</div>`);
    this.table();
  },
  analyse() { const run = this.st.run, n = this.PAT.filter(p => run.done[p.id]).length; return { n, done: n === this.PAT.length, full: run.full >= this.PAT.length, clean: n > 0 && !run.wrong }; },
  table() {
    const a = this.analyse(), S = G.S, run = this.st.run, b = this.body;
    b.querySelector('.stamps').innerHTML = [[a.full, tr('Tam muayene', 'Full work-up')], [a.clean, tr('İlk seferde', 'First time')], [a.done, tr(`Dört hasta (${a.n}/4)`, `Four patients (${a.n}/4)`)]]
      .map(([ok, t]) => `<span class="ms ${ok ? '' : 'no'}">${ok ? '✓' : '○'} ${L(t)}</span>`).join('');
    const nt = id => this.NOTE.find(x => x.id === id);
    b.querySelector('.rig-table').innerHTML = `<table class="exp-table"><tr><th>${L(tr('Hasta', 'Patient'))}</th><th>${L(tr('Eksik', 'Lacking'))}</th><th>${L(tr('Hastalık', 'Disease'))}</th></tr>${this.PAT.map(p => `<tr><td><b>${U.esc(L(p.n))}</b></td><td>${run.done[p.id] ? U.esc(L(nt(p.ans).n)) : '?'}</td><td>${run.done[p.id] ? U.esc(L(nt(p.ans).dis)) : '–'}</td></tr>`).join('')}</table>`;
    if (a.done && !S.flags.eksikDone) {
      S.flags.eksikDone = true;
      S.journal.exps.push({ title: tr('Eksiklik tanısı', 'Spotting deficiencies'), code: 'BİY.9.2.2', t: Date.now(),
        head: [tr('Hasta', 'Patient'), tr('Eksik', 'Lacking'), tr('Hastalık', 'Disease')],
        rows: this.PAT.map(p => [p.n, nt(p.ans).n, nt(p.ans).dis]),
        note: tr('Aynı belirti birden çok eksiklikte görülebilir: kansızlığı demir, B12 ve folik asit eksikliği yapar; kanamayı hem C hem K. Tanıyı belirtilerin hepsi ve beslenme birlikte koyar. A, D, E, K yağda çözünür ve vücutta birikir; B’ler ve C suda çözünür, fazlası atılır.', 'One sign can come from several deficiencies: anaemia from too little iron, B12 or folate; bleeding from too little C or K. The whole set of signs plus the diet makes the diagnosis. A, D, E and K dissolve in fat and build up in the body; the Bs and C dissolve in water and the excess is lost.') });
      this._msg(tr('Dört hasta, dört tanı! Sonuçlar defterinde.', 'Four patients, four diagnoses! The results are in your journal.'));
      if (Q.at('eksik', 'diagnose')) { UI.stamp(L(tr('TANI', 'DIAGNOSIS'))); { const pn = this.pn; setTimeout(() => pn && pn.close(), 1800); } }
    }
  },
  _msg(t) { const el = this.body && this.body.querySelector('.kit-msg'); if (el) el.textContent = L(t); },
  async close() {
    this.pn = null;
    if (Q.at('eksik', 'diagnose') && G.S.flags.eksikDone) {
      await ask('eksik_fat');
      await UI.say('player', tr('Zehra Hanım aşıları bitirmiş olmalı. Ona anlatayım.', 'Nurse Zehra should be done with the vaccinations. Let me tell her.'));
      Q.adv('eksik');
    }
  },
};
