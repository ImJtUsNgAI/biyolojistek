'use strict';
// The teacher's picker: jump to any case, experiment or specimen from the title desk or the flask button on the HUD.
// Whatever opens from here runs in a practice copy of the valley that is never saved; the real game waits untouched
// and the tag at the top of the screen ("Back to my game") returns to it. Class activities open in the current game.
const DEMO = {
  pn: null, tab: 'case', q: '',
  // each case begins beside the first person or thing it sends you to, so a lesson starts without a walk across the valley
  START: {
    bloat: [3380, 2300], willow: [2515, 1215], leaves: [1920, 2090], pond: [985, 2560], bakery: [3060, 3000], seedbank: [4400, 2690],
    hardware: [3380, 2300], spring: [4330, 800], yayla: [4540, 420], well: [3150, 1050], owl: [3380, 2300], azik: [2440, 1700],
    hucre: [2770, 3110], asi: [2180, 2600], kabak: [1455, 2745], pas: [2060, 2790], kompost: [2310, 2310], leylek: [2760, 2830], tansiyon: [2740, 2700], eksik: [2700, 2720], yogurt: [3150, 1050], sera: [2330, 1760], hediye: [3060, 3000], azot: [2060, 2790], ekim: [1455, 2745], etilen: [2180, 2600], sindirim: [2700, 2720], kilcal: [4540, 420], kul: [2330, 1760], zar: [3150, 1050], light: [1870, 1160], festival: [2700, 2790], mendel: [1975, 1110],
  },
  // every hands-on bench: the case and step it belongs to, where you stand, and how it opens. It opens through the case's
  // own USE handler, so finishing it carries the case on exactly as in the game.
  BENCH: [
    { k: 'ride', c: 'bloat', step: 'ride', at: 'cow', go: () => Q.dive(),
      t: tr('İşkembe yolculuğu', 'Rumen ride'), d: tr('Bir ot parçası olarak ağızdan ince bağırsağa: dört mide bölmesi ve mikroplar.', 'Ride a mouthful of grass from the mouth to the small intestine: four stomach chambers and their microbes.') },
    { k: 'detector', c: 'hardware', step: 'scan', at: 'cow', go: () => TALK.cow(),
      t: tr('Metal dedektörü', 'Metal detector'), d: tr('Sarıkız’ın yuttuğu çiviyi sinyal ve sesle bul.', 'Find the nail Sarıkız swallowed by signal and sound.') },
    { k: 'scale', c: 'willow', step: 'weigh', at: [2515, 1215], prep: S => { S.flags.willowDug = true; }, go: () => USE.willow(),
      t: tr('Söğüt ve terazi', 'Willow and scale'), d: tr('Van Helmont’un deneyi: ağaç beş yılda ne kadar ağırlaştı, toprak ne kadar hafifledi?', 'Van Helmont’s experiment: how much did the tree gain in five years, and how much did the soil lose?') },
    { k: 'soil', c: 'leaves', step: 'test', at: [1920, 2090], prep: S => { S.flags.soilKit = true; }, go: () => USE.field('B'),
      t: tr('Toprak testi', 'Soil test'), d: tr('B tarlasında azot, fosfor ve potasyumu renk kartıyla ölç.', 'Measure nitrogen, phosphorus and potassium in field B against a colour chart.') },
    { k: 'water', c: 'pond', step: 'test', at: [985, 2560], go: () => USE.pond(),
      t: tr('Gölet suyu testi', 'Pond water test'), d: tr('Nitrat, çözünmüş oksijen ve sıcaklık: ötrofikasyonun izleri.', 'Nitrate, dissolved oxygen and temperature: the traces of eutrophication.') },
    { k: 'rig', c: 'light', step: 'exp', at: [1765, 1110], go: () => USE.rig(),
      t: tr('Işığın rengi ve fotosentez', 'Light colour and photosynthesis'), d: tr('Su vebasının kabarcıklarını farklı renkte ışıkta say.', 'Count a pondweed’s bubbles under different colours of light.') },
    { k: 'mendel', c: 'mendel', step: 'cross', at: [1975, 1110], prep: () => { give('pea_round'); give('pea_wrinkled'); }, go: () => USE.mendel(),
      t: tr('Mendel çaprazlaması', 'Mendel’s crosses'), d: tr('Yuvarlak ve buruşuk bezelyeyi çaprazla, F1 ve F2’yi say.', 'Cross round and wrinkled peas and count F1 and F2.') },
    { k: 'ferm', c: 'bakery', step: 'exp', at: [3132, 3010], go: () => USE.ferm(),
      t: tr('Maya ve balonlar', 'Yeast and balloons'), d: tr('Maya şekerle ve sıcaklıkla ne kadar gaz üretir? Kireç suyu hangi gazı gösterir?', 'How much gas does yeast make with sugar and warmth? Which gas does limewater reveal?') },
    { k: 'germ', c: 'seedbank', step: 'exp', at: [4470, 2700], go: () => USE.germ(),
      t: tr('Çimlenme masası', 'Germination bench'), d: tr('Su, hava, sıcaklık, ışık: tohumun çimlenmesi için hangisi gerçekten gerekli?', 'Water, air, warmth, light: which one does a seed really need to germinate?') },
    { k: 'thermo', c: 'spring', step: 'transect', at: [4364, 800], go: () => USE.thermo(),
      t: tr('Pınarda sıcaklık ölçümü', 'Temperature transect'), d: tr('Kaynaktan akıntının ucuna dokuz noktada sıcaklık ve canlı topluluğu.', 'Temperature and living community at nine points from the vent down the outflow.') },
    { k: 'step', c: 'yayla', step: 'test', at: [4520, 420], go: () => USE.step(),
      t: tr('Basamak testi', 'Step test'), d: tr('Yüksekte nabız ve oksijen doygunluğu: ritmi tut, ölç, karşılaştır.', 'Pulse and oxygen saturation up high: keep the rhythm, measure, compare.') },
    { k: 'osmo', c: 'well', step: 'osmo', at: [3262, 1080], go: () => USE.osmo(),
      t: tr('Patates deneyi', 'Potato test'), d: tr('Tuzlu suda patates silindirleri: osmozla kuyunun tuzluluğunu bul.', 'Potato cylinders in salt water: find the well’s saltiness by osmosis.') },
    { k: 'pellet', c: 'owl', step: 'pellets', at: [3172, 2210], go: () => USE.pelletkit(),
      t: tr('Baykuş kusmuğu', 'Owl pellet'), d: tr('Kemikleri ayıkla, ikili anahtarla hangi hayvana ait olduklarını bul.', 'Pick out the bones and use a dichotomous key to name the animals.') },
    { k: 'calor', c: 'azik', step: 'burn', at: [2500, 1730], go: () => USE.calor(),
      t: tr('Kalorimetre', 'Calorimeter'), d: tr('Fındık mı, kuru üzüm mü? Yakıp suyu ısıt, enerjiyi hesapla.', 'Hazelnut or raisin? Burn them under water and work out the energy.') },
    { k: 'slide', c: 'hucre', step: 'slide', at: [2652, 3110], go: () => USE.slide(),
      t: tr('Preparat hazırlama', 'Making a slide'), d: tr('Soğan zarı ve yanak hücresi: lamel, boya, kabarcıksız bir preparat.', 'Onion skin and cheek cells: coverslip, stain and a slide with no bubbles.') },
    { k: 'graft', c: 'asi', step: 'graft', at: [2280, 2615], go: () => USE.graft(),
      t: tr('Aşı masası', 'Grafting bench'), d: tr('Düz kes, kambiyumları buluştur, bantla: yaşlı elma ağacını çoğalt.', 'Cut straight, match the cambium, tape it: copy the old apple tree.') },
    { k: 'poll', c: 'kabak', step: 'pollinate', at: [1430, 2850], go: () => USE.pollinate(),
      t: tr('Elle tozlama', 'Hand pollination'), d: tr('Kabak çiçeğini akşamdan kapat, sabah aynı çeşidin poleniyle tozla ve etiketle; gelecek yılın kabaklarını karşılaştır.', 'Close a squash flower the evening before, pollinate it next morning with pollen of the same variety and tag it; then compare next year’s squash.') },
    { k: 'rust', c: 'pas', step: 'wind', at: [2140, 2870], go: () => USE.rustsim(),
      t: tr('Rüzgâr masası', 'Wind table'), d: tr('Tek çeşit ve karışık iki tarlaya aynı rüzgârla aynı pas sporlarını gönder; hangisinde yayıldığını karşılaştır.', 'Send the same rust spores on the same wind into a one-variety field and a mixed field; compare where it spreads.') },
    { k: 'compost', c: 'kompost', step: 'build', at: [2360, 2300], go: () => USE.compostbin(),
      t: tr('Kompost kasası', 'Compost bin'), d: tr('Kahverengi ve yeşil katmanlarla bir yığın kur, sula, karıştır; termometre 55 °C’yi geçene kadar haftaları izle.', 'Build a heap from brown and green layers, water it, turn it, and watch the weeks until the thermometer passes 55 °C.') },
    { k: 'sweep', c: 'leylek', step: 'sweep', at: [2985, 1320], go: () => USE.sweep(),
      t: tr('Böcek ağı', 'Sweep net'), d: tr('İlaçlı ve ilaçsız çayırda böcekleri say, besin zincirini kur.', 'Count the insects in a sprayed and an unsprayed meadow and build the food chain.') },
    { k: 'yogurtkit', c: 'yogurt', step: 'ferment', at: [3050, 1060], go: () => USE.yogurtkit(),
      t: tr('Yoğurt mayalama', 'Setting yogurt'), d: tr('Sıcaklık ve mayayla oyna, pH’ın saat saat düşüşünü izle.', 'Change the temperature and starter, and watch the pH fall hour by hour.') },
    { k: 'serakit', c: 'sera', step: 'jars', at: [1990, 1195], go: () => USE.serakit(),
      t: tr('Kavanozda sera etkisi', 'Greenhouse effect in a jar'), d: tr('Hava ve CO₂ dolu kavanozları lambayla ısıt; bitki ve BTB ile CO₂’yi izle.', 'Warm air and CO₂ jars under a lamp; track CO₂ with a plant and BTB.') },
    { k: 'hediyekit', c: 'hediye', step: 'test', at: [2340, 1525], go: () => USE.hediyekit(),
      t: tr('Yağ testleri', 'Testing fats'), d: tr('Zeytinyağı, tereyağı, ayçiçek yağı ve suyu dört testle karşılaştır.', 'Compare olive oil, butter, sunflower oil and water with four tests.') },
    { k: 'azotkit', c: 'azot', step: 'cycle', at: [1900, 2895], go: () => USE.azotkit(),
      t: tr('Azot döngüsü', 'The nitrogen cycle'), d: tr('Nohut köklerindeki nodülleri bul, azot döngüsünün yedi okunu yerleştir.', 'Find the nodules on chickpea roots and place the seven arrows of the nitrogen cycle.') },
    { k: 'kulkit', c: 'kul', step: 'test', at: [2200, 1785], go: () => USE.kulkit(),
      t: tr('Kül analizi', 'Ash analysis'), d: tr('Dört besini yak, külü tart ve dört iyonu damla testleriyle bul; sonra her tuzu organeline yerleştir.', 'Burn four foods, weigh the ash, find four ions with drop tests, then match each salt to its organelle.') },
    { k: 'zarkit', c: 'zar', step: 'beet', at: [3100, 1130], go: () => USE.zarkit(),
      t: tr('Pancar ve hücre zarı', 'Beetroot and the cell membrane'), d: tr('Pancar disklerini dört sıvıda, üç sıcaklıkta dene: zar ne zaman sızdırır?', 'Try beet discs in four liquids at three temperatures: when does the membrane leak?') },
    { k: 'ekimkit', c: 'ekim', step: 'sow', at: [1580, 2745], go: () => USE.ekimkit(),
      t: tr('Ekim takvimi', 'Sowing calendar'), d: tr('Dört bitkiyi dört ayda ek; ayaz, soğuk ve gün uzunluğunun etkisini gör.', 'Sow four crops in four months; see what frost, cold and day length do.') },
    { k: 'etilenkit', c: 'etilen', step: 'ripen', at: [2200, 2655], go: () => USE.etilenkit(),
      t: tr('Etilen ve olgunlaşma', 'Ethylene and ripening'), d: tr('Yeşil domatesleri farklı sıcaklıkta, elmalı ve elmasız beklet.', 'Keep green tomatoes at different temperatures, with and without an apple.') },
    { k: 'sindirimkit', c: 'sindirim', step: 'digest', at: [2650, 2642], go: () => USE.sindirimkit(),
      t: tr('Sindirim yolculuğu', 'The digestion journey'), d: tr('Dört besini ağız, mide, ince ve kalın bağırsak salgılarıyla karıştır.', 'Mix four foods with the juices of the mouth, stomach, small and large intestine.') },
    { k: 'kilcalkit', c: 'kilcal', step: 'tests', at: [4400, 465], go: () => USE.kilcalkit(),
      t: tr('Kohezyon ve adezyon', 'Cohesion and adhesion'), d: tr('Para, ataş, cam boru ve kereviz: sade suyla ve sabunlu suyla.', 'Coin, paper clip, glass tubes and celery: with plain and soapy water.') },
    { k: 'notebook', c: 'eksik', step: 'diagnose', at: [2690, 2694], go: () => USE.notebook(),
      t: tr('Eksiklik tanısı', 'Spotting deficiencies'), d: tr('Hemşirenin vitamin-mineral defteriyle dört hastanın neyinin eksik olduğunu bul.', 'Use the nurse’s vitamin and mineral notebook to find what four patients are lacking.') },
    { k: 'bp', c: 'tansiyon', step: 'measure', at: [2790, 2712], go: () => USE.bp(),
      t: tr('Tansiyon ölçümü', 'Blood pressure'), d: tr('Manşon, ibreli saat ve steteskopla üç kişinin tansiyonunu kulakla ölç.', 'Measure three people’s blood pressure by ear with a cuff, a dial and a stethoscope.') },
  ],
  // class activities: they run inside the game that is open (or a practice game when opened from the title desk)
  ACTS: [
    { k: 'mystery', topic: 'cell', go: () => MYSTERY.open(), codes: ['BİY.9.1.4', 'BİY.9.1.5', 'BİY.9.2.8'],
      t: tr('Gizemli numune', 'Mystery sample'), d: tr('Etiketsiz bir görüntü: ne olduğunu bul, sonra kanıtı göster. Başka vakalarda öğrendiklerini kullan.', 'An unlabelled plate: work out what it is, then point to the proof. Use what you learned in other cases.') },
    { k: 'partner', topic: 'cell', go: () => PARTNER.open(), codes: ['BİY.9.1.5', 'BİY.9.1.4'],
      t: tr('Laboratuvar ortakları', 'Lab partners'), d: tr('İki kişilik: biri ekrandaki numuneyi anlatır, öteki basılı tanı anahtarıyla adını bulur. Ekranı gören anahtarı göremez!', 'For two: one describes the sample on the screen, the other names it with the printed key. The one at the screen may not see the key!') },
    { k: 'design', topic: 'science', go: () => DESIGN.open(), codes: ['BİY.9.1.2', 'BİY.12.1.12'],
      t: tr('Deneyini tasarla', 'Design your own experiment'), d: tr('Köylülerin sorularından birini seç: neyi değiştireceğine, neyi sabit tutacağına ve kaç tekrar yapacağına sen karar ver.', 'Pick one of the villagers’ questions: you decide what to change, what to keep the same and how many repeats to run.') },
    { k: 'race', topic: 'cell', go: () => RACE.open(), codes: ['BİY.9.1.4'],
      t: tr('Sınıf yarışı', 'Class race'), d: tr('Tahta ikiye bölünür: iki takım aynı görüntüde adı verilen yapıyı ilk bulmak için yarışır.', 'The board splits in two: two teams race to touch the named part on the same plate first.') },
  ],


  // ---------------------------------------------------------------- the picker, sorted by what a lesson is about
  // A teacher picks a topic (plain words, with the grade it belongs to), then what to open. Each entry says in one
  // line what happens and, under it, what the students learn: the programme's learning outcomes written out, no codes.
  TOPICS: [
    { k: 'all', t: tr('Hepsi', 'Everything'), g: '' },
    { k: 'cell', t: tr('Hücre ve mikroskop', 'Cells and the microscope'), g: tr('9. sınıf', 'Grade 9'), d: tr('Hücreyi mikroskopta görmek, preparat hazırlamak, canlıları tanıyıp gruplamak.', 'Seeing cells under the microscope, making slides, recognising and grouping living things.') },
    { k: 'science', t: tr('Bilim nasıl yapılır?', 'How science works'), g: tr('9. sınıf', 'Grade 9'), d: tr('Soru sormak, adil deney kurmak, kontrol grubu, tekrar ve sonuç çıkarmak.', 'Asking questions, setting up a fair test, control groups, repeats and drawing conclusions.') },
    { k: 'digest', t: tr('Beslenme ve sindirim', 'Food and digestion'), g: tr('10. sınıf', 'Grade 10'), d: tr('Geviş getirenlerin dört bölmeli midesi, tek mideli hayvanlar, besinlerdeki enerji.', 'The four-chambered stomach of ruminants, animals with one stomach, the energy in food.') },
    { k: 'energy', t: tr('Fotosentez, solunum, mayalanma', 'Photosynthesis, respiration, fermentation'), g: tr('10. sınıf', 'Grade 10'), d: tr('Bitki kütlesini havadan yapar; ışığın rengi; maya ve oksijensiz solunum.', 'A plant builds its mass from the air; the colour of light; yeast and respiration without oxygen.') },
    { k: 'ecology', t: tr('Ekoloji ve çevre', 'Ecology and the environment'), g: tr('10. sınıf', 'Grade 10'), d: tr('Gübre ve göletler, toprağın besinleri, böcekler ve ilaç, sıcak pınardaki yaşam.', 'Fertiliser and ponds, the nutrients in soil, insects and pesticides, life in a hot spring.') },
    { k: 'body', t: tr('Kalp, kan, solunum ve duyular', 'Heart, blood, breathing and senses'), g: tr('11. sınıf', 'Grade 11'), d: tr('Tansiyon ölçmek, yüksekte kan ve nabız, baykuşun kulağı ve gözü.', 'Measuring blood pressure, blood and pulse up high, the owl’s ears and eyes.') },
    { k: 'plants', t: tr('Bitkiler: su, tohum ve çoğalma', 'Plants: water, seeds and new plants'), g: tr('9–12. sınıf', 'Grades 9–12'), d: tr('Tuzlu su ve kökler, tohumun çimlenmesi, aşıyla ağaç çoğaltmak, ata tohumları.', 'Salty water and roots, how seeds sprout, copying a tree by grafting, heirloom seeds.') },
    { k: 'heredity', t: tr('Kalıtım', 'Inheritance'), g: tr('12. sınıf', 'Grade 12'), d: tr('Mendel’in bezelyeleri: baskın ve çekinik özellikler, oranlar.', 'Mendel’s peas: dominant and recessive traits, ratios.') },
  ],
  CASE_TOPIC: { kompost: 'ecology', pas: 'ecology', bloat: 'digest', hardware: 'digest', azik: 'digest', willow: 'energy', light: 'energy', bakery: 'energy', leaves: 'ecology', pond: 'ecology', spring: 'ecology', leylek: 'ecology', yayla: 'body', tansiyon: 'body', owl: 'body', hucre: 'cell', eksik: 'cell', yogurt: 'energy', sera: 'ecology', hediye: 'cell', azot: 'ecology', ekim: 'ecology', etilen: 'energy', sindirim: 'cell', kilcal: 'cell', kul: 'cell', zar: 'cell', well: 'plants', seedbank: 'plants', asi: 'plants', kabak: 'plants', mendel: 'heredity', festival: 'science' },
  SPEC_TOPIC: { compost: 'ecology', rust: 'ecology', squash: 'plants', cow: 'digest', sheep: 'digest', dog: 'digest', chicken: 'digest', snack: 'digest', stork: 'body', frog: 'body', fish: 'body', owl: 'body', heart: 'body', blood: 'body', pond: 'ecology', wheat: 'ecology', chickpea: 'ecology', clover: 'ecology', soil: 'ecology', mushroom: 'ecology', bee: 'ecology', spring: 'ecology', sweep: 'ecology', tree: 'plants', sprout: 'plants', garden: 'plants', apple: 'plants', willow: 'energy', dough: 'energy', pea: 'heredity', onion: 'cell' },
  topicOf(kind, id) {
    if (kind === 'case') return this.CASE_TOPIC[id] || 'plants';
    if (kind === 'bench') { const b = this.BENCH.find(x => x.k === id); return b ? this.topicOf('case', b.c) : 'science'; }
    if (kind === 'act') { const a = this.ACTS.find(x => x.k === id); return (a && a.topic) || 'cell'; }
    return this.SPEC_TOPIC[id] || 'cell';
  },
  // the learning outcomes of a list of codes, in words
  learn(codes) {
    if (!this._curr) { this._curr = {}; for (const th of CURR.themes) for (const [c, t] of th.items) this._curr[c] = t; }
    return (codes || []).map(c => this._curr[c]).filter(Boolean).map(L);
  },
  KINDS: [
    ['case', tr('Hikâyeli vakalar', 'Story cases'), tr('Öğrenci bir köylünün sorununu adım adım çözer (20–40 dk).', 'Students solve a villager’s problem step by step (20–40 min).')],
    ['bench', tr('Deneyler', 'Experiments'), tr('Doğrudan deney masası açılır (5–15 dk).', 'Opens straight onto the lab bench (5–15 min).')],
    ['spec', tr('Mikroskopla inceleme', 'Look closer'), tr('Tahtaya yansıtıp sınıfça incelemek için: büyüt, parçalara dokun.', 'To project and study as a class: zoom in, touch the parts.')],
    ['act', tr('Sınıf etkinlikleri', 'Class activities'), tr('Takımlar ya da ikililer için.', 'For teams or pairs.')],
  ],

  topic: 'all', grade: 0,
  GRADE: { cell: 9, science: 9, digest: 10, energy: 10, ecology: 10, body: 11, heredity: 12 },
  // search folds case and Turkish letters (ş→s, ı→i …) and looks through every text an entry holds, not just its card
  fold: s => String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i'),
  words(o, out = [], seen = new Set()) {
    if (typeof o === 'string') out.push(o);
    else if (o && typeof o === 'object' && !seen.has(o)) { seen.add(o); for (const v of Object.values(o)) this.words(v, out, seen); }
    return out;
  },
  // everything a case holds below its card: its questions and the misconceptions behind their wrong answers, the lines
  // people say while it runs, its benches (samples, tests, result tables, the notes they write) and the observations it
  // asks for. So a word met only deep inside a case or bench still finds it.
  deep(c) {
    this._deep = this._deep || {};
    if (this._deep[c]) return this._deep[c];
    const out = [CASES[c]], lits = [];
    const qs = Object.values(QS).filter(q => q.case === c); out.push(qs);
    for (const q of qs) for (const o of q.options || []) if (o.tag && MISC[o.tag]) out.push(MISC[o.tag]);
    // the case's branches in everyone's dialogue and in the things you use
    let code = '';
    const block = (s, i) => { const o = s.indexOf('{', i); if (o < 0 || o - i > 90 || s.slice(i, o).includes(';')) return ''; let d = 0; for (let j = o; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}' && !--d) return s.slice(o, j + 1); } return ''; };
    const mark = new RegExp(`Q\\.(?:at|state)\\('${c}'`, 'g');
    for (const o of [TALK, USE]) for (const f of Object.values(o)) if (typeof f === 'function') { const s = String(f); for (const m of s.matchAll(mark)) code += block(s, m.index); }
    for (const b of this.BENCH) if (b.c === c) code += String(b.go);
    // one step further: the tell-scene, handlers and bench modules those branches call
    const seen = new Set(), glob = n => { try { return (0, eval)(`typeof ${n} === 'undefined' ? null : ${n}`); } catch (e) { return null; } };
    const follow = s => {
      let more = '';
      for (const m of s.matchAll(/\b(Q|USE|KIT|TALK)\.(\w+)\(/g)) { const f = { Q, USE, KIT, TALK }[m[1]][m[2]], k = m[1] + '.' + m[2]; if (typeof f === 'function' && !seen.has(k) && !/^(at|state|adv|later|dive)$/.test(m[2])) { seen.add(k); more += String(f); } }
      for (const m of s.matchAll(/\b([A-Z][A-Z0-9]{1,})\.open\(/g)) { const o = !/^(UI|STUDY|LENS|DEMO|INK|CAM|ART|G|W|AU)$/.test(m[1]) && glob(m[1]); if (o && !seen.has(m[1])) { seen.add(m[1]); out.push(this.data(o)); for (const f of Object.values(o)) if (typeof f === 'function') more += String(f); } }
      return more;
    };
    code += follow(code); code += follow(code);
    for (const m of code.matchAll(/\btr\(\s*(['"])((?:(?!\1)[^\\]|\\.)*)\1\s*,\s*(['"])((?:(?!\3)[^\\]|\\.)*)\3/g)) lits.push(m[2], m[4]);
    for (const id in OBS) if (code.includes(`'${id}'`)) out.push(OBS[id]);
    return (this._deep[c] = out.concat(lits));
  },
  // a bench module's own data: plain objects and arrays only (not its live state, panel or elements)
  data(o) {
    const r = [];
    for (const [k, v] of Object.entries(o)) if (!/^(st|pn|body|el|cv|ctx)$/.test(k) && v && typeof v === 'object' && (Array.isArray(v) || Object.getPrototypeOf(v) === Object.prototype)) r.push(v);
    return r;
  },
  hay(it) {
    this._hay = this._hay || {};
    const key = it.kind + ':' + it.id;
    if (this._hay[key] == null) {
      const src = [it.h, it.s, it.sub, it.learn, it.codes];
      if (it.kind === 'case') src.push(this.deep(it.id));
      if (it.kind === 'bench') { const b = this.BENCH.find(x => x.k === it.id); src.push(b.t, b.d, this.deep(b.c)); }
      if (it.kind === 'act') { const a = this.ACTS.find(x => x.k === it.id); src.push(a.t, a.d); }
      if (it.kind === 'spec') { src.push(SPECS[it.id]); if (typeof ATLAS !== 'undefined') for (const k in ATLAS) if (k.startsWith(it.id + '_')) src.push(ATLAS[k]); }
      this._hay[key] = this.fold(this.words(src).join(' '));
    }
    return this._hay[key];
  },
  open() {
    if (this.pn) return;
    if (LENS.on) LENS.toggle(false);
    const body = h('div', 'demo');
    body.innerHTML = `<div class="dm-board"><b>${T('s_board')}</b><button class="tog ${G.set.board ? 'on' : ''}" data-k="board">${T(G.set.board ? 's_on' : 's_off')}</button><small>${T('dm_board_d')}</small><b>${T('s_vivid')}</b><button class="tog ${G.set.vivid ? 'on' : ''}" data-k="vivid">${T(G.set.vivid ? 's_on' : 's_off')}</button><small>${T('dm_vivid_d')}</small></div><p class="dm-note">${U.esc(L(tr('1) Soldan bir konu seçin. 2) Açmak istediğinize dokunun. Burada açılan her şey ayrı bir deneme oyununda çalışır; öğrencinin kayıtlı oyunu değişmez. Bitince üstteki “Oyunuma dön” düğmesine basın.', '1) Pick a topic on the left. 2) Touch what you want to open. Everything opened here runs in a separate practice game, so the student’s saved game never changes. When you are done, press “Back to my game” at the top.')))}</p>
      <div class="dm-wrap"><div class="dm-topics">${this.TOPICS.map(o => `<button data-t="${o.k}"><b>${U.esc(L(o.t))}</b>${o.g ? `<small>${U.esc(L(o.g))}</small>` : ''}</button>`).join('')}</div>
      <div class="dm-main"><div class="dm-grade">${[0, 9, 10, 11, 12].map(g => `<button data-g="${g}">${g ? g + '.' : U.esc(L(tr('Tüm sınıflar', 'All grades')))}</button>`).join('')}</div><input class="dm-find" type="search" placeholder="${U.esc(L(tr('Ara: ör. kalp, maya, tohum', 'Search: e.g. heart, yeast, seed')))}" autocomplete="off" spellcheck="false"><div class="dm-jump"></div><div class="dm-list"></div></div></div>`;
    this.pn = UI.panel({ title: tr('Vaka ve deney seç', 'Choose a case or experiment'), body, wide: true, cls: 'demopanel', onClose: () => { this.pn = null; } });
    body.querySelectorAll('.dm-board .tog').forEach(bt => bt.onclick = () => {
      const k = bt.dataset.k; G.set[k] = !G.set[k]; G.applySettings(); G.saveSettings(); AU.sfx('click');
      bt.classList.toggle('on', !!G.set[k]); bt.textContent = T(G.set[k] ? 's_on' : 's_off');
    });
    // on the board the whole card scrolls (the list no longer scrolls inside it): a topic brings its list up under the
    // title bar, and a chip in the corner leads back up to the topics once they are out of sight
    const card = this.pn.el.querySelector('.card'), up = h('div', 'dm-up away'), wrap = body.querySelector('.dm-wrap');
    up.innerHTML = `<button>${U.esc(T('dm_up'))}</button>`; card.appendChild(up);
    // the kinds row sticks just under the title bar; the bar's height is read late (its display font may still be loading
    // when the picker opens, and it grows when it arrives)
    const pin = () => body.querySelector('.dm-jump').style.setProperty('--dm-top', card.querySelector('.panel-head').offsetHeight + 'px');
    const upSet = () => { pin(); up.classList.toggle('away', body.querySelector('.dm-topics').getBoundingClientRect().bottom > card.getBoundingClientRect().top + 110); };
    card.addEventListener('scroll', upSet, { passive: true });
    up.firstChild.onclick = () => { AU.sfx('click'); card.scrollTo({ top: 0, behavior: G.reduceMotion ? 'auto' : 'smooth' }); };
    pin(); setTimeout(pin, 400);
    body.querySelectorAll('.dm-topics button').forEach(b => b.onclick = () => {
      AU.sfx('page'); this.topic = b.dataset.t; this._fill();
      if (G.set.board) card.scrollTo({ top: Math.max(0, wrap.offsetTop - card.querySelector('.panel-head').offsetHeight - 10), behavior: G.reduceMotion ? 'auto' : 'smooth' });
    });
    body.querySelectorAll('.dm-grade button').forEach(b => b.onclick = () => { AU.sfx('click'); this.grade = +b.dataset.g; const g = this.GRADE[this.topic]; if (this.grade && g && g !== this.grade) this.topic = 'all'; this._fill(); });
    const f = body.querySelector('.dm-find'); f.value = this.q; f.oninput = () => { this.q = f.value; this._fill(); };
    this._fill();
  },
  // the entries of one tab, as plain data (the self-test reads these)
  items(tab = this.tab) {
    const add = (list, kind) => list.map(it => Object.assign(it, { kind, topic: this.topicOf(kind, it.id), learn: this.learn(it.codes) }));
    if (tab === 'case') return add(Object.keys(CASES).filter(k => k !== 'intro').map(k => { const C = CASES[k]; return { id: k, h: L(C.title), s: L(C.blurb), sub: L(WORLD.regions[C.region].name), codes: C.codes }; }), 'case');
    if (tab === 'bench') return add(this.BENCH.map(b => ({ id: b.k, h: L(b.t), s: L(b.d), sub: L(tr('Vaka: ', 'Case: ')) + L(CASES[b.c].title), codes: CASES[b.c].codes })), 'bench');
    if (tab === 'act') return add(this.ACTS.map(a => ({ id: a.k, h: L(a.t), s: L(a.d), sub: '', codes: a.codes })), 'act');
    return add(Object.keys(SPECS).filter(k => SPECS[k].levels && SPECS[k].levels.length).map(k => ({ id: k, h: L(SPECS[k].name), s: L(tr('Büyütmeler: ', 'Zoom levels: ')) + SPECS[k].levels.map(l => L(l.tag)).join(' · '), sub: '', codes: [] })), 'spec');
  },
  _fill() {
    if (!this.pn) return;
    const body = this.pn.body, list = body.querySelector('.dm-list'), q = this.fold(this.q.trim()), gOk = t => !this.grade || !this.GRADE[t] || this.GRADE[t] === this.grade;
    body.querySelectorAll('.dm-topics button').forEach(b => { b.classList.toggle('on', b.dataset.t === this.topic); b.hidden = b.dataset.t !== 'all' && !gOk(b.dataset.t); });
    body.querySelectorAll('.dm-grade button').forEach(b => b.classList.toggle('on', +b.dataset.g === this.grade));
    const top = this.TOPICS.find(o => o.k === this.topic) || this.TOPICS[0];
    let html = top.d ? `<p class="dm-about"><b>${U.esc(L(top.t))}</b> · ${U.esc(L(top.d))}</p>` : '', n = 0;
    const kinds = [];
    for (const [kind, name, how] of this.KINDS) {
      const items = this.items(kind).filter(it => (this.topic === 'all' || it.topic === this.topic) && gOk(it.topic) && (!q || q.split(/\s+/).every(w => this.hay(it).includes(w))));
      if (!items.length) continue;
      n += items.length; kinds.push([kind, name, items.length]);
      html += `<h4 class="dm-kind" data-k="${kind}">${U.esc(L(name))} <small>${U.esc(L(how))}</small></h4><div class="dm-grid">` + items.map(it => `<button class="dm-item" data-kind="${kind}" data-id="${it.id}"><b>${U.esc(it.h)}</b>${it.sub ? `<em>${U.esc(it.sub)}</em>` : ''}<small>${U.esc(it.s)}</small>${it.learn.length ? `<span class="dm-learn"><u>${U.esc(L(tr('Öğrenilenler', 'Students learn')))}</u>${it.learn.map(t => `<i>${U.esc(t)}</i>`).join('')}</span>` : ''}</button>`).join('') + '</div>';
    }
    list.innerHTML = n ? html : `<p class="dm-none">${U.esc(L(tr('Bu aramayla eşleşen bir şey yok.', 'Nothing matches that search.')))}</p>`;
    list.querySelectorAll('.dm-item').forEach(b => b.onclick = () => { AU.sfx('stamp'); this.go(b.dataset.kind, b.dataset.id); });
    // the kinds on show, with their counts: a tap brings that kind's heading to the top of the list (on the board, of the
    // card, just under the title bar and this row)
    const jr = body.querySelector('.dm-jump');
    jr.innerHTML = kinds.length > 1 ? kinds.map(([k, name, c]) => `<button data-k="${k}">${U.esc(L(name))}<b>${c}</b></button>`).join('') : '';
    jr.querySelectorAll('button').forEach(b => b.onclick = () => {
      const hd = list.querySelector(`.dm-kind[data-k="${b.dataset.k}"]`); if (!hd) return;
      AU.sfx('page');
      const card = this.pn.el.querySelector('.card'), sc = G.set.board ? card : list, hh = card.querySelector('.panel-head').offsetHeight;
      jr.style.setProperty('--dm-top', hh + 'px');
      const off = G.set.board ? hh + jr.offsetHeight + 10 : 4;
      sc.scrollTo({ top: sc.scrollTop + hd.getBoundingClientRect().top - sc.getBoundingClientRect().top - off, behavior: G.reduceMotion ? 'auto' : 'smooth' });
    });
  },

  // ---------------------------------------------------------------- jumping
  go(tab, id) {
    if (this.pn) { const p = this.pn; this.pn = null; p.close(); }
    if (tab === 'act') {
      const a = this.ACTS.find(x => x.k === id); if (!a) return;
      // from the title desk there is no valley yet: open a practice one behind the activity
      if (G.mode !== 'play') { G.specimen(null); setTimeout(() => a.go(), 350); } else a.go();
      return;
    }
    if (G.mode === 'play' && !G.demo) G.save();
    Q._queue.length = 0; G.busy = false; UI.hideDlg();
    if (LENS.on) LENS.toggle(false);
    UI.fade(() => this.jump(tab, id), 350);
  },
  // the jump itself, without the fade (the self-test calls this)
  jump(tab, id) {
    if (tab === 'case') G.lesson(id);
    else if (tab === 'spec') G.specimen(id);
    else this.bench(id);
  },
  bench(k) {
    const b = this.BENCH.find(x => x.k === k); if (!b) return;
    G.lesson(b.c);
    const S = G.S;
    if (b.prep) b.prep(S);
    Q.adv(b.c, b.step); Q._queue.length = 0;
    const c = actor('sarikiz'), at = b.at === 'cow' ? [c.x - 80, c.y + 16] : b.at;
    [W.player.x, W.player.y] = W.freeSpot(at[0], at[1]); W.player.route = null;
    CAM.x = W.player.x; CAM.y = W.player.y;
    W.waypoint = S.waypoint = null;
    ART.invalidate();
    setTimeout(() => { if (G.mode === 'play' && !UI.modal && !G.busy) b.go(); }, 120);
  },
  // leave the practice game: back to the saved one, or to the title desk if there is none
  back() {
    if (G.busy || UI.modal || !G.demo) return;
    AU.sfx('page');
    Q._queue.length = 0; if (LENS.on) LENS.toggle(false);
    UI.fade(() => { if (!G.load()) { G.toTitle(); G.demo = false; } }, 350);
  },

  // the "practice mode" tag on the HUD
  tag() {
    if (!UI.hud) return;
    let el = UI.hud.querySelector('.demo-tag');
    if (!el) {
      el = h('div', 'demo-tag hidden'); UI.hud.appendChild(el);
      el.onclick = e => { const b = e.target.closest('button'); if (!b) return; AU.sfx('click'); if (b.dataset.k === 'back') this.back(); else if (!G.busy && !UI.modal) this.open(); };
    }
    el.classList.toggle('hidden', !G.demo);
    if (!G.demo) return;
    el.innerHTML = `<b>${U.esc(L(tr('Uygulama modu', 'Practice mode')))}</b><span>${U.esc(L(tr('burada yapılanlar kaydedilmez', 'nothing here is saved')))}</span>
      <button data-k="pick">${U.esc(L(tr('Başka seç', 'Pick another')))}</button><button data-k="back" class="yes">${U.esc(L(G.hasSave() ? tr('Oyunuma dön', 'Back to my game') : tr('Ana menü', 'Main menu')))}</button>`;
  },
};
