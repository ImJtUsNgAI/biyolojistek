'use strict';
// Story layer: cases and their steps, the question bank, misconceptions, seeds, curriculum map,
// what every NPC says (TALK) and what every object does (USE), plus the small field kits.
const actor = id => W.actors.find(a => a.id === id);
const tr = (t, e) => ({ tr: t, en: e });

// ================================================================ cases
const CASE_ORDER = ['intro', 'bloat', 'willow', 'leaves', 'pond', 'bakery', 'seedbank', 'hardware', 'spring', 'yayla', 'well', 'owl', 'azik', 'hucre', 'asi', 'kabak', 'pas', 'kompost', 'leylek', 'tansiyon', 'eksik', 'yogurt', 'sera', 'hediye', 'azot', 'ekim', 'etilen', 'sindirim', 'kilcal', 'kul', 'zar', 'light', 'mendel', 'festival'];
const CASES = {
  intro: { region: 'hub', noRestore: true, codes: ['BİY.9.1.4', 'BİY.9.1.2'],
    title: tr('Nine’nin mektubu', "Grandma's letter"),
    blurb: tr('Nebahat Nine vadiyi bir mevsimliğine sana bıraktı. Masasında bir mektup ve pirinç bir mercek var.', 'Grandma Nebahat has left the valley in your hands for a season. On her desk: a letter and a brass lens.'),
    steps: [
      { id: 'letter', t: tr('Okuldaki masada duran mektubu oku.', 'Read the letter on the desk in the school.') },
      { id: 'lens', t: tr('Merceği aç, bir canlıya tut ve dokun: İnceleme masasında numaralı bir parçayı incele.', 'Open the lens, hold it over something alive and tap it: study a numbered part on the specimen table.') },
      { id: 'deniz', t: tr('Dışarıda seni bekleyen Alp’la konuş.', 'Talk to Alp, who is waiting outside.') },
    ] },
  bloat: { region: 'barn', codes: ['BİY.10.1.5', 'BİY.10.1.9', 'BİY.9.1.6'],
    title: tr('Sarıkız’ın şişkinliği', "Sarıkız's bloat"),
    blurb: tr('Rıza Dede’nin ineği Sarıkız’ın sol böğrü davul gibi şişmiş. Dün gece yağmurdan sonra ıslak yoncalığa salınmış. Vakit dar.', "Rıza Dede's cow Sarıkız has a left flank swollen like a drum. Last night, after the rain, she was let onto wet clover. Time is short."),
    steps: [
      { id: 'riza', t: tr('Ahırın yanındaki Rıza Dede’yle konuş (köprüden geç, doğuya).', 'Talk to Rıza Dede by the barn (cross the bridge, head east).') },
      { id: 'look', t: tr('Sarıkız’ı merceğinle incele: işkembeyi bul, sonra ×10 katmanına inip köpüğü bul.', 'Examine Sarıkız with your lens: find the rumen, then go down to the ×10 layer and find the foam.') },
      { id: 'diagnose', t: tr('Rıza Dede’ye Sarıkız’a ne olduğunu anlat.', 'Tell Rıza Dede what is wrong with Sarıkız.') },
      { id: 'lead', t: tr('Sarıkız’la konuş, onu yoncalıktan çıkar ve batıdaki çayır ağılına götür.', 'Talk to Sarıkız, lead her out of the clover and take her to the grass paddock to the west.') },
      { id: 'plan', t: tr('Rıza Dede’yle Sarıkız için bir yonca planı yap.', 'Make a clover plan for Sarıkız with Rıza Dede.') },
      { id: 'deniz4', t: tr('Alp’ın sana bir sorusu var.', 'Alp has a question for you.') },
      { id: 'dog', t: tr('Karabaş’ın midesine de merceğinle bak.', "Look at Karabaş's stomach through your lens too.") },
      { id: 'compare', t: tr('Rıza Dede’ye köpekle ineğin sindirimini karşılaştır.', "Compare the dog's and the cow's digestion for Rıza Dede.") },
      { id: 'ride', t: tr('Sarıkız’ı merceğinle incele; ×10 katmanında “İçine dal”a bas.', 'Examine Sarıkız with your lens and press “Dive in” on the ×10 layer.') },
    ],
    reward() { give('chickpea'); } },
  willow: { region: 'hub', codes: ['BİY.10.1.3', 'BİY.10.1.2', 'BİY.9.1.1'],
    title: tr('Nine’nin söğüdü', "Grandma's willow"),
    blurb: tr('Nine beş yıl önce bir söğüt dikip hem fidanı hem toprağı tartmış. Söğüt kocaman oldu. Bu kütle nereden geldi?', 'Five years ago Grandma planted a willow and weighed both the sapling and the soil. The willow is huge now. Where did all that mass come from?'),
    steps: [
      { id: 'note', t: tr('Okulun kapısının yanındaki söğüt saksısına bak.', 'Look at the willow pot by the school door.') },
      { id: 'dig', t: tr('Söğüdü saksıdan dikkatlice çıkar.', 'Carefully lift the willow out of its pot.') },
      { id: 'weigh', t: tr('Söğüdü ve kurutulmuş toprağı tart.', 'Weigh the willow and the dried soil.') },
      { id: 'present', t: tr('Alp’a kanıt göster: söğüt yaprağı merceğin altında ne yapıyor?', 'Show Alp your evidence: what is the willow leaf doing under the lens?') },
    ],
    reward() { give('kavilca'); } },
  leaves: { region: 'farm', codes: ['BİY.10.2.4', 'BİY.9.2.1', 'BİY.10.2.5'],
    title: tr('Sararan siyez', 'The yellowing siyez'),
    blurb: tr('B tarlasındaki ata buğdayı siyezin alt yaprakları sararıyor. Rıza Dede “kuraklık” diyor ama bu bahar yağmur bol yağdı.', "The lower leaves of the heirloom siyez wheat in field B are turning yellow. Rıza Dede says 'drought', but it rained plenty this spring."),
    steps: [
      { id: 'look', t: tr('B tarlasındaki buğdaya merceğinle bak.', 'Look at the wheat in field B through your lens.') },
      { id: 'kit', t: tr('Tarlanın yanındaki alet kulübesinden toprak test setini al.', 'Get the soil test kit from the tool shed by the fields.') },
      { id: 'test', t: tr('B tarlasının toprağını test et (istersen diğerlerini de).', "Test field B's soil (and the others if you like).") },
      { id: 'plan', t: tr('B tarlasına git ve bir plan seç.', 'Go to field B and choose a plan.') },
      { id: 'sleep', t: tr('Okuldaki yatakta uyu; bir mevsim geçsin.', 'Sleep in the bed at the school and let a season pass.') },
    ] },
  pond: { region: 'pond', codes: ['BİY.10.2.6', 'BİY.10.2.1', 'BİY.10.2.4', 'BİY.10.2.8'],
    title: tr('Kokan gölet', 'The smelly pond'),
    blurb: tr('Gölet yeşil ve bulanık, kıyıda ölü balıklar var. Kahvedeki yaşlılar eskiden kurbağa sesinden uyunmadığını söylüyor.', 'The pond is green and murky, with dead fish on the shore. The old men at the teahouse say the frogs used to be too loud to sleep.'),
    steps: [
      { id: 'look', t: tr('Gölet suyuna merceğinle bak.', 'Look at the pond water through your lens.') },
      { id: 'test', t: tr('Gölet kıyısından su örneği alıp test et.', 'Take a water sample at the pond shore and test it.') },
      { id: 'trace', t: tr('Fazla besin nereden geliyor? Nehri tarlalara doğru izle.', 'Where are the extra nutrients coming from? Follow the river up towards the fields.') },
      { id: 'fix', t: tr('Tarla ile nehir arasına bir tampon şerit dik.', 'Plant a buffer strip between the fields and the river.') },
      { id: 'wait', t: tr('Uyu ve bir mevsim geçsin; gölet ne olacak?', 'Sleep and let a season pass. What happens to the pond?') },
    ] },
  bakery: { region: 'clinic', codes: ['BİY.10.1.9', 'BİY.10.1.7', 'BİY.12.1.6', 'BİY.9.1.2'],
    title: tr('Kabarmayan hamur', 'The dough that won’t rise'),
    blurb: tr('Köy fırınında Nazlı Teyze’nin hamuru iki gündür kabarmıyor. Un aynı, tuz aynı, tarif aynı. Bütün köy ekmeksiz kaldı.', 'At the village bakery, Nazlı Teyze’s dough hasn’t risen for two days. Same flour, same salt, same recipe. The whole village has run out of bread.'),
    steps: [
      { id: 'nazli', t: tr('Köy meydanındaki fırında Nazlı Teyze’yle konuş.', 'Talk to Nazlı Teyze at the bakery in the village square.') },
      { id: 'look', t: tr('Teknedeki hamura merceğinle bak. ×400 katmanında mayayı metilen mavisiyle boya.', 'Look at the dough in the trough through your lens. On the ×400 layer, stain the yeast with methylene blue.') },
      { id: 'exp', t: tr('Fırının deney masasında mayayı dene: su sıcaklığını değiştir, balonları karşılaştır, gazı kireç suyuyla test et.', 'Test the yeast at the bakery’s lab table: change the water temperature, compare the balloons and test the gas with limewater.') },
      { id: 'diagnose', t: tr('Nazlı Teyze’ye hamurun neden kabarmadığını anlat.', 'Tell Nazlı Teyze why her dough won’t rise.') },
      { id: 'rise', t: tr('Yeni hamura merceğinle bak: kabarcıklar nerede?', 'Look at the new dough through your lens: where are the bubbles?') },
      { id: 'bake', t: tr('Nazlı Teyze’ye hamurun kabardığını haber ver.', 'Tell Nazlı Teyze the dough has risen.') },
    ],
    reward() { give('corekotu'); } },
  seedbank: { region: 'halt', codes: ['BİY.12.1.12', 'BİY.9.2.8', 'BİY.10.2.8', 'BİY.9.1.2'],
    title: tr('Uyuyan tohumlar', 'The sleeping seeds'),
    blurb: tr('Tren durağının yanındaki taş binada Nine’nin tohum bankası var: raf raf kavanoz, her birinde bir köyün tohumu. En eski kavanozlar hâlâ canlı mı?', 'In the stone building by the train halt is Grandma’s seed bank: shelf after shelf of jars, each holding one village’s seed. Are the oldest jars still alive?'),
    steps: [
      { id: 'ledger', t: tr('Tohum bankasındaki masada Nine’nin defterini oku.', 'Read Grandma’s ledger on the desk in the seed bank.') },
      { id: 'exp', t: tr('Çimlenme masasında tohumun neye ihtiyacı olduğunu bul: suyu, havayı, sıcaklığı ve ışığı teker teker değiştir.', 'Find out what a seed needs at the germination bench: change the water, air, temperature and light one at a time.') },
      { id: 'look', t: tr('Masadaki çimlenen bezelyeye merceğinle bak; ×100 katmanında kök ucunun içini incele.', 'Look at the sprouting pea on the bench with your lens; examine the inside of the root tip on the ×100 layer.') },
      { id: 'viability', t: tr('Üç bezelye kavanozunu da aynı koşulda (nemli, 22 °C) dene ve Nine’nin kuralına göre karar ver.', 'Test all three pea jars under the same conditions (moist, 22 °C) and decide by Grandma’s rule.') },
    ],
    reward() { give('mercimek'); } },
  hardware: { region: 'barn', codes: ['BİY.10.1.5', 'BİY.9.1.4', 'BİY.9.1.2'],
    title: tr('Sarıkız’ın çivisi', 'Sarıkız’s nail'),
    blurb: tr('Sarıkız yine hasta: yemiyor, sütü kesildi, sırtını kamburlaştırmış ve yokuş aşağı yürümek istemiyor. Bu sefer karnı şiş değil.', 'Sarıkız is ill again: she won’t eat, her milk has stopped, her back is arched and she won’t walk downhill. This time her belly isn’t swollen.'),
    steps: [
      { id: 'riza', t: tr('Ahırdaki Rıza Dede’yle konuş.', 'Talk to Rıza Dede at the barn.') },
      { id: 'look', t: tr('Sarıkız’a merceğinle bak: ×1 sistem katmanında börkeneğin yakınında bir şey var mı?', 'Look at Sarıkız with your lens: is there something near the reticulum on the ×1 system layer?') },
      { id: 'ayten', t: tr('Köy meydanındaki Veteriner Ayten’e haber ver.', 'Tell Ayten the vet in the village square.') },
      { id: 'scan', t: tr('Sarıkız’la konuş ve Ayten’in metal dedektörüyle sol yanını tara.', 'Talk to Sarıkız and sweep her left side with Ayten’s metal detector.') },
      { id: 'treat', t: tr('Ayten’e çivinin yerini söyle.', 'Tell Ayten where the nail is.') },
      { id: 'check', t: tr('Sarıkız’a yeniden merceğinle bak: mıknatıs nerede, çivi ne oldu?', 'Look at Sarıkız with your lens again: where is the magnet, and what happened to the nail?') },
      { id: 'prevent', t: tr('Bir daha olmaması için Rıza Dede’yle konuş.', 'Talk to Rıza Dede so it never happens again.') },
    ],
    reward() { give('fig'); } },
  spring: { region: 'cave', codes: ['BİY.10.2.1', 'BİY.10.2.3', 'BİY.9.1.6', 'BİY.9.1.4'],
    title: tr('Gökkuşağı pınarı', 'The rainbow spring'),
    blurb: tr('Mağaranın ağzındaki sıcak pınar çürük yumurta kokuyor, akıntısı sarı, turuncu ve yeşil bantlara boyanmış. Kahvehanede Hasan Dede “Pınar zehirlendi!” diyor, Mehmet Dede “Şifalı!” Hangisi haklı?', 'The hot spring at the cave mouth smells of rotten eggs, and its outflow is painted in yellow, orange and green bands. At the teahouse Grandpa Hasan says “The spring’s been poisoned!” and Grandpa Mehmet says “It heals!” Which of them is right?'),
    steps: [
      { id: 'look', t: tr('Pınara merceğinle bak; ×1000 katmanında renkli örtünün içindeki canlıları incele.', 'Look at the spring through your lens; examine the living things inside the coloured mat on the ×1000 layer.') },
      { id: 'transect', t: tr('Pınarın yanındaki sondayla akıntı boyunca ölç: kaynaktan başla, yeşilin başladığı yeri bul.', 'Measure down the outflow with the probe beside the spring: start at the source and find where the green begins.') },
      { id: 'elders', t: tr('Köy meydanındaki kahvehanede dedelere pınarı anlat.', 'Tell the grandpas at the teahouse in the village square about the spring.') },
    ],
    reward() { give('yarpuz'); } },
  yayla: { region: 'yayla', codes: ['BİY.11.2.7', 'BİY.11.2.6', 'BİY.9.1.2'],
    title: tr('Nefes nefese', 'Out of breath'),
    blurb: tr('Yaylada Çoban Yusuf’un yeğeni Elif dün İzmir’den geldi: başı zonkluyor, iki adımda nefes nefese kalıyor. Yusuf Amca ise bütün gün koyunların peşinde koşuyor, hiç yorulmuyor. Elif hasta mı?', 'Up on the yayla, Shepherd Yusuf’s niece Elif arrived from İzmir yesterday: her head is pounding and two steps leave her out of breath. Uncle Yusuf chases the sheep all day and never tires. Is Elif ill?'),
    steps: [
      { id: 'elif', t: tr('Yayla evinin önündeki Elif’le konuş.', 'Talk to Elif in front of the yayla hut.') },
      { id: 'test', t: tr('Basamak testini üç kişiye uygula: Elif, Yusuf Amca ve sen. Ritmi tut: herkese aynı test!', 'Give the step test to three people: Elif, Uncle Yusuf and yourself. Keep the rhythm: the same test for everyone!') },
      { id: 'look', t: tr('Kan masasındaki örneklere merceğinle bak: tüplerde ve ×1000 yaymada Elif’in kanı Yusuf Amca’nınkinden nasıl farklı?', 'Look at the samples on the blood table with your lens: in the tubes and the ×1000 smear, how does Elif’s blood differ from Uncle Yusuf’s?') },
      { id: 'yusuf', t: tr('Yusuf Amca’ya ne bulduğunu anlat.', 'Tell Uncle Yusuf what you found.') },
    ],
    reward() { give('kekik'); } },
  well: { region: 'meadow', codes: ['BİY.9.2.6', 'BİY.9.2.1', 'BİY.10.2.6', 'BİY.9.1.2'],
    title: tr('Tuzlu kuyu', 'The salty well'),
    blurb: tr('Çayırın kenarındaki bahçede Songül Abla’nın domates fideleri her gün sulanıyor, toprakları hep ıslak. Yine de yaprakları susuz kalmış gibi sarkıyor. Dere bu yaz kuruyunca bahçeye yeni bir kuyu açtırmışlar…', 'In the garden at the edge of the meadow, Songül’s tomato seedlings are watered every day and the soil is always wet. Yet their leaves hang as if they were thirsty. When the stream dried up this summer, the family had a new well dug in the garden…'),
    steps: [
      { id: 'songul', t: tr('Bahçesindeki Songül Abla’yla konuş.', 'Talk to Songül in her garden.') },
      { id: 'look', t: tr('Fidelere merceğinle bak: toprağın yüzünde ve ×400 kök hücrelerinde ne görüyorsun?', 'Look at the seedlings with your lens: what do you see on the soil, and in the ×400 root cells?') },
      { id: 'osmo', t: tr('Bahçedeki masada patates deneyini yap: altı bardak, altı silindir. Kuyu suyu ne kadar tuzlu?', 'Do the potato test on the garden table: six cups, six cylinders. How salty is the well water?') },
      { id: 'tell', t: tr('Songül Abla’ya ne bulduğunu anlat.', 'Tell Songül what you found.') },
    ],
    reward() { give('ayas'); } },
  owl: { region: 'barn', codes: ['BİY.10.2.2', 'BİY.11.1.5', 'BİY.9.1.5', 'BİY.10.2.5', 'BİY.9.1.2'],
    title: tr('Ambardaki baykuş', 'The owl in the barn'),
    blurb: tr('Fareler Rıza Dede’nin ambarını talan etmiş. Dede kasabadan fare zehri almış, yarın her köşeye koyacak. Bir de damda, samanlık kapısında gündüzleri uyuyan beyaz yüzlü bir kuş var… “Uğursuzdur, gitsin,” diyor Dede.', 'Mice have been raiding Rıza Dede’s grain store. He has bought rat poison in town and will put it in every corner tomorrow. And up on the roof, in the hay-loft door, a white-faced bird sleeps all day… “It brings bad luck. It should go,” says Rıza Dede.'),
    steps: [
      { id: 'riza', t: tr('Ahırın önündeki Rıza Dede’yle konuş.', 'Talk to Rıza Dede in front of the barn.') },
      { id: 'look', t: tr('Damdaki baykuşa merceğinle bak: yüzünde ve ×400 retinasında karanlıkta avlanmanın izlerini bul.', 'Look at the owl on the roof with your lens: find how it hunts in the dark, on its face and in its ×400 retina.') },
      { id: 'pellets', t: tr('Samanlığın altındaki gri topakları masada aç: kafatasları anahtarla tanı, avı say.', 'Open the grey lumps from under the hay loft on the table: name the skulls with the key and count the catch.') },
      { id: 'tell', t: tr('Rıza Dede’ye ne bulduğunu anlat.', 'Tell Rıza Dede what you found.') },
    ],
    reward() { give('karakilcik'); } },
  azik: { region: 'hub', codes: ['BİY.10.1.10', 'BİY.10.1.7', 'BİY.11.1.9', 'BİY.9.1.1', 'BİY.9.1.2'],
    title: tr('Dağ azığı', 'Trail food'),
    blurb: tr('Alp’ın sınıfı yarın dört saat yokuş çıkıp yaylaya yürüyecek. Alp’ın azığı: kocaman bir paket lokum. “Şeker en iyi enerjidir!” diyor. Hasan Dede ise “Dağa cevizsiz çıkılmaz,” diye söyleniyor.', 'Alp’s class is walking up to the yayla tomorrow: four hours uphill. Alp’s trail food: a huge packet of lokum. “Sugar is the best energy!” says Alp. Grandpa Hasan grumbles: “You don’t go up a mountain without walnuts.”'),
    steps: [
      { id: 'deniz', t: tr('Saha istasyonunun önündeki Alp’la konuş.', 'Talk to Alp in front of the field station.') },
      { id: 'burn', t: tr('Ceviz ağacının altındaki kalorimetrede beş yiyeceği yak: hangisi gram başına en çok enerjiyi veriyor?', 'Burn the five foods in the calorimeter under the walnut tree: which gives the most energy per gram?') },
      { id: 'look', t: tr('Azığa merceğinle bak: enerji cevizde nerede saklı (Sudan III), kas hücresinde nerede açığa çıkıyor (×20000)?', 'Look at the snacks with your lens: where is the energy stored in a walnut (Sudan III), and where is it released in a muscle cell (×20000)?') },
      { id: 'tell', t: tr('Alp’a azığına ne koyması gerektiğini anlat.', 'Tell Alp what to pack.') },
    ],
    reward() { give('ceviz'); } },
  hucre: { region: 'clinic', codes: ['BİY.9.2.5', 'BİY.9.1.4', 'BİY.9.1.1', 'BİY.9.2.8', 'BİY.9.1.2'],
    title: tr('Soğanın hücresi', 'Does an onion have cells?'),
    blurb: tr('Kahvehanede Mehmet Dede torununun biyoloji kitabına kızmış: “Bütün canlılar hücrelerden oluşurmuş! Yetmiş yıldır soğan doğrarım, bir tane hücre görmedim.” Nine’nin eski mikroskobu kahvenin masasında duruyor.', 'At the teahouse, Mehmet Dede is cross with his grandchild’s biology book: “All living things are made of cells, it says! I’ve been chopping onions for seventy years and never seen a single cell.” Grandma’s old microscope is standing on the teahouse table.'),
    steps: [
      { id: 'mehmet', t: tr('Kahvehanede Mehmet Dede’yle konuş.', 'Talk to Mehmet Dede at the teahouse.') },
      { id: 'slide', t: tr('Kahvenin masasındaki mikroskopla iki temiz preparat hazırla: soğan zarı ve yanak hücreleri.', 'Make two clean slides with the microscope on the teahouse table: onion skin and cheek cells.') },
      { id: 'look', t: tr('Masaya merceğinle bak: ×10000 tükürük bezi hücresinde proteini yapan ve paketleyen organelleri bul.', 'Look at the table with your lens: in the ×10000 salivary gland cell, find the organelles that make and package a protein.') },
      { id: 'tell', t: tr('Mehmet Dede’ye hücreleri göster.', 'Show Mehmet Dede the cells.') },
    ],
    reward() { give('sogan'); } },
  asi: { region: 'farm', codes: ['BİY.12.1.6', 'BİY.12.2.5', 'BİY.10.2.8', 'BİY.9.2.8', 'BİY.9.1.2'],
    title: tr('Son Amasya elması', 'The last Amasya apple'),
    blurb: tr('Çiftlikteki yüz yirmi yaşındaki Amasya elması fırtınada yarılmış; kökü de çürük, bu kışı çıkaramaz. Muhtar “çekirdeklerini ekeriz” diyor. Yaşlı aşıcı Hüseyin Usta’nın elleri titriyor, ama ne yapılacağını biliyor.', 'The 120-year-old Amasya apple tree on the farm has split in a storm; its roots are rotten too, and it won’t last the winter. The mukhtar says “we’ll plant its pips”. Old Hüseyin Usta the grafter has shaky hands, but he knows what must be done.'),
    steps: [
      { id: 'huseyin', t: tr('Yaşlı elma ağacının yanındaki Hüseyin Usta’yla konuş.', 'Talk to Hüseyin Usta by the old apple tree.') },
      { id: 'look', t: tr('Aşı masasına merceğinle bak: dal kesitinde kambiyumu, aşı yerinde yarayı kapatan hücreleri bul.', 'Look at the grafting table with your lens: find the cambium in the twig section, and the cells that close the wound at the graft union.') },
      { id: 'graft', t: tr('Aşı masasında iki tutan aşı yap: kalemi kes, anaca oturt, sar ve bekle.', 'Make two grafts that take at the grafting table: cut the scion, set it on the rootstock, wrap it and wait.') },
      { id: 'tell', t: tr('Fidanları Hüseyin Usta’ya göster.', 'Show Hüseyin Usta the saplings.') },
    ],
    reward() { give('amasya'); } },
  kabak: { region: 'farm', codes: ['BİY.12.1.11', 'BİY.12.2.5', 'BİY.10.2.2', 'BİY.10.2.8', 'BİY.9.1.2'],
    title: tr('Karışan kabaklar', 'The crossed squash'),
    blurb: tr('Fatma Teyze, Nine’nin ata kabağının tohumunu kırk yıldır saklıyor. Bu yıl aynı zarftan ekilen kabaklar tuhaf çıktı: küçük, siğilli, çizgili ve taş gibi sert. Biri de acı çıktı. “Tohum bozuldu” diyor. Oysa geçen yıl tohum aldığı kabak tıpkı atası gibiydi.', 'Fatma Teyze has kept the seed of Grandma’s heirloom squash for forty years. This year the squash grown from the same packet came out strange: small, warty, striped and hard as stone. One was even bitter. “The seed has gone bad,” she says. Yet the squash she took the seed from last year looked just like its ancestors.'),
    steps: [
      { id: 'fatma', t: tr('Tarlaların güneyindeki kabak bahçesinde Fatma Teyze’yle konuş.', 'Talk to Fatma Teyze in the squash patch south of the fields.') },
      { id: 'look', t: tr('Kabak bahçesine merceğinle bak: erkek ve dişi çiçeği bul, sonra ×5 katmanında dişicik tepesini ve yumurtalığı bul.', 'Look at the squash patch with your lens: find the male and the female flower, then on the ×5 layer find the stigma and the ovary.') },
      { id: 'pollinate', t: tr('Bahçedeki tozlama masasında bir dişi çiçeği elle tozla: akşamdan kapat, sabah polen sür, yeniden kapat ve etiketle.', 'At the pollination table in the patch, hand-pollinate a female flower: close it the evening before, brush on pollen in the morning, close it again and tag it.') },
      { id: 'tell', t: tr('Fatma Teyze’ye kabakların neden karıştığını anlat.', 'Tell Fatma Teyze why the squash got crossed.') },
    ],
    reward() { give('atakabak'); } },
  pas: { region: 'farm', codes: ['BİY.10.2.2', 'BİY.10.2.8', 'BİY.9.1.6', 'BİY.10.2.6', 'BİY.9.1.2'],
    title: tr('Paslanan buğday', 'The rusting wheat'),
    blurb: tr('Komşu çiftçi Osman Amca bu yıl bütün tarlasına şehirden aldığı tek bir yüksek verimli buğday çeşidini ekti. Bahar yağmurlarından sonra tarla sarardı; yapraklar turuncu tozla kaplandı, pantolonunun paçaları bile turuncu. Hemen yanındaki Nine’nin karışık yerel buğdayı ise yemyeşil. “Bu ne biçim pas, demir mi yağdı?” diyor.', 'Osman Amca, the farmer next door, sowed his whole field this year with a single high-yield wheat variety from the city. After the spring rains the field turned yellow; the leaves are covered in orange dust, even the hems of his trousers are orange. Right next to it, Grandma’s mixed local wheat is bright green. “What kind of rust is this, did it rain iron?” he says.'),
    steps: [
      { id: 'osman', t: tr('Kabak bahçesinin doğusundaki buğday tarlasında Osman Amca’yla konuş.', 'Talk to Osman Amca in the wheat plot east of the squash patch.') },
      { id: 'look', t: tr('Paslı buğdaya merceğinle bak: ×40 katmanında bir spor kabarcığını, ×400 katmanında mantarın yaprak hücresine soktuğu emeci bul.', 'Look at the rusty wheat with your lens: on the ×40 layer find a spore blister, and on the ×400 layer the haustorium the fungus pushes into a leaf cell.') },
      { id: 'wind', t: tr('Tarlanın yanındaki rüzgâr masasında pasın tek çeşit ve karışık tarlada nasıl yayıldığını karşılaştır.', 'At the wind table beside the plot, compare how rust spreads in a one-variety field and in a mixed field.') },
      { id: 'tell', t: tr('Osman Amca’ya pasın neden onun tarlasını sardığını anlat.', 'Tell Osman Amca why the rust swept through his field.') },
    ],
    reward() { give('karakilcik'); } },
  kompost: { region: 'farm', codes: ['BİY.10.2.4', 'BİY.10.2.1', 'BİY.10.1.7', 'BİY.10.2.5', 'BİY.9.1.2'],
    title: tr('Kokan kompost', 'The smelly compost heap'),
    blurb: tr('Fatma Teyze’nin komşusu Sevim Hanım, bütün yaz bahçesinin biçilmiş çimini çiftliğin avlusuna taşıyıp yeni bir kompost yığını yaptı. Bir ay oldu: yığın ısınmadı, balçık gibi oldu, çürük yumurta ve amonyak kokuyor, üstünde sinekler dönüyor. Hemen yanındaki Nine’nin eski yığını ise buğu buğu tütüyor.', 'Sevim, Fatma Teyze’s neighbour, spent the summer carrying her garden’s grass clippings to the farmyard and built a new compost heap. A month on, the heap hasn’t warmed up; it has turned to slime, smells of rotten eggs and ammonia, and flies circle over it. Right next to it, Grandma’s old heap is steaming away.'),
    steps: [
      { id: 'sevim', t: tr('Çiftlik avlusundaki kompost yığınlarının yanında Sevim Hanım’la konuş.', 'Talk to Sevim by the compost heaps in the farmyard.') },
      { id: 'look', t: tr('Yığınlara merceğinle bak: ×1 katmanında sıcak içteki beyaz iplikleri, ×1000 katmanında ısı seven bakteriyi bul.', 'Look at the heaps with your lens: on the ×1 layer find the white threads in the hot inside, and on the ×1000 layer the heat-loving bacterium.') },
      { id: 'build', t: tr('Avludaki kompost kasasında ısınan bir yığın kur.', 'Build a heap that heats up in the compost bin in the farmyard.') },
      { id: 'tell', t: tr('Sevim Hanım’a yığınının neden koktuğunu anlat.', 'Tell Sevim why her heap smells.') },
    ],
    reward() { give('pembedomates'); } },
  leylek: { region: 'clinic', codes: ['BİY.10.2.3', 'BİY.10.2.2', 'BİY.10.2.5', 'BİY.10.2.6', 'BİY.9.1.2'],
    title: tr('Aç leylek yavrusu', 'The starving stork chick'),
    blurb: tr('Okulun damındaki yuvadan bir leylek yavrusu düşmüş; Veteriner Ayten onu kutuda besliyor. Bir deri bir kemik. Anne babası bütün gün yiyecek arıyor ama gagaları boş dönüyor. Kooperatif geçen hafta okulun yanındaki çayırı ilaçlatmıştı…', 'A stork chick has fallen from the nest on the school roof, and Ayten the vet is feeding it in a box. It is skin and bone. Its parents search for food all day but come back with empty beaks. Last week the cooperative sprayed the meadow next to the school…'),
    steps: [
      { id: 'ayten', t: tr('Köy meydanında Veteriner Ayten’le konuş.', 'Talk to Ayten the vet in the village square.') },
      { id: 'sweep', t: tr('Çayır yolundaki böcek ağıyla iki çayırdan eşit örnek al ve besin piramidini kur.', 'Take equal samples from both meadows with the sweep net on the meadow road, and build the food pyramid.') },
      { id: 'look', t: tr('Böcek ağı tepsisine merceğinle bak: çekirgenin ne yediğini ağzından anla, yaprağın altında bitlerle anlaşan böceği bul.', 'Look at the sweep-net tray with your lens: tell from the grasshopper’s mouth what it eats, and find the insect under the leaf that does a deal with the aphids.') },
      { id: 'tell', t: tr('Ayten’e ne bulduğunu anlat.', 'Tell Ayten what you found.') },
    ],
    reward() { give('gelincik'); } },
  tansiyon: { region: 'clinic', codes: ['BİY.11.2.6', 'BİY.9.2.8', 'BİY.9.2.6', 'BİY.9.1.2'],
    title: tr('Sessiz tehlike', 'The silent danger'),
    blurb: tr('Sağlık ocağında tansiyon taraması günü, ama dijital aletin pili bitmiş. Hemşire Zehra eski usul, manşon ve steteskopla ölçecek; yardıma ihtiyacı var. Sırada Alp, Nazlı Teyze ve “ben hiç hasta olmadım” diyen Hasan Dede var.', 'It’s blood-pressure screening day at the village clinic, but the digital monitor’s batteries are dead. Nurse Zehra will measure the old way, with a cuff and a stethoscope, and she needs a hand. In line: Alp, Nazlı Teyze and Hasan Dede, who says he has never been ill in his life.'),
    steps: [
      { id: 'zehra', t: tr('Sağlık ocağında Hemşire Zehra’yla konuş.', 'Talk to Nurse Zehra in the village clinic.') },
      { id: 'measure', t: tr('Masadaki tansiyon aletiyle üç kişinin tansiyonunu kulakla ölç.', 'Measure three people’s blood pressure by ear with the cuff on the desk.') },
      { id: 'look', t: tr('Raftaki kalp modeline merceğinle bak: en kalın duvarlı odacığı ve atardamar duvarındaki kas katmanını bul.', 'Look at the heart model on the shelf with your lens: find the chamber with the thickest wall, and the muscle layer in an artery’s wall.') },
      { id: 'tell', t: tr('Kahvehanede Hasan Dede’yle konuş.', 'Talk to Hasan Dede at the teahouse.') },
    ],
    reward() { give('reyhan'); } },
  eksik: { region: 'clinic', codes: ['BİY.9.2.2', 'BİY.9.2.1'],
    title: tr('Hemşirenin defteri', 'The nurse’s notebook'),
    blurb: tr('Sağlık ocağında aşı günü; Hemşire Zehra bebeklerin başından ayrılamıyor. Bekleme salonunda dört hasta var, hepsinde bir şey eksik. Zehra sana yıllardır tuttuğu vitamin ve mineral defterini bıraktı.', 'It’s vaccination day at the clinic and Nurse Zehra can’t leave the babies. Four patients sit in the waiting room, each lacking something. Zehra has left you the vitamin and mineral notebook she’s kept for years.'),
    steps: [
      { id: 'zehra', t: tr('Sağlık ocağında Hemşire Zehra’yla konuş.', 'Talk to Nurse Zehra in the village clinic.') },
      { id: 'diagnose', t: tr('Masadaki defterle dört hastanın neyinin eksik olduğunu bul.', 'Use the notebook on the desk to find what each of the four patients is lacking.') },
      { id: 'tell', t: tr('Tanıları Hemşire Zehra’ya anlat.', 'Tell Nurse Zehra your diagnoses.') },
    ] },
  yogurt: { region: 'meadow', codes: ['BİY.10.1.9', 'BİY.10.1.7', 'BİY.9.1.2'],
    title: tr('Tutmayan yoğurt', 'The yogurt that wouldn’t set'),
    blurb: tr('Songül Abla üç gündür yoğurt mayalıyor, üç gündür süt süt olarak kalıyor. Maya aynı maya, süt aynı süt. Değişen ne?', 'Songül has been setting yogurt for three days, and for three days the milk has stayed milk. Same starter, same milk. What changed?'),
    steps: [
      { id: 'songul', t: tr('Songül Abla’yla konuş.', 'Talk to Songül.') },
      { id: 'ferment', t: tr('Songül’ün evinin önündeki mutfak masasında yoğurt deneyi kur: sıcaklık ve maya.', 'Set up the yogurt experiment on the kitchen table outside Songül’s house: temperature and starter.') },
      { id: 'tell', t: tr('Songül Abla’ya yoğurdun neden tutmadığını anlat.', 'Tell Songül why her yogurt didn’t set.') },
    ] },
  sera: { region: 'greenhouse', codes: ['BİY.10.2.6', 'BİY.10.1.3', 'BİY.10.2.4', 'BİY.9.1.2'],
    title: tr('Kavanozdaki gezegen', 'A planet in a jar'),
    blurb: tr('Deniz’in öğretmeni “Karbondioksit Dünya’yı ısıtıyor” demiş. Deniz inanmıyor: “Görünmeyen bir gaz nasıl ısıtır?” Seranın içinde bunu sınayacak kavanozlar, bir lamba ve biraz su bitkisi var.', 'Deniz’s teacher said “Carbon dioxide is warming the Earth.” Deniz isn’t convinced: “How can an invisible gas make anything warm?” The greenhouse has jars, a lamp and some pondweed to test it.'),
    steps: [
      { id: 'deniz', t: tr('Deniz’le konuş.', 'Talk to Deniz.') },
      { id: 'jars', t: tr('Seradaki kavanoz masasında hava ile CO₂’yi karşılaştır; bitki ekle, lambayı kapat.', 'At the jar bench in the greenhouse, compare air with CO₂; add a plant, switch the lamp off.') },
      { id: 'tell', t: tr('Bulduklarını Deniz’e anlat.', 'Tell Deniz what you found.') },
    ] },
  hediye: { region: 'clinic', codes: ['BİY.9.2.2', 'BİY.9.1.2'],
    title: tr('Nazlı Teyze’nin hediyesi', 'Nazlı Teyze’s gift'),
    blurb: tr('Nazlı Teyze’nin Ayvalık’taki kız kardeşi bir teneke zeytinyağı yollamış. Pazardaki satıcı “Buzdolabında bulanıklaşıyorsa hilelidir” demiş. Nazlı Teyze teneke’yi sana veriyor: “Sen bir incele evladım.”', 'Nazlı Teyze’s sister in Ayvalık has sent a tin of olive oil. A trader at the market said “If it goes cloudy in the fridge, it’s been cut with something.” Nazlı Teyze hands you the tin: “Have a look at it for me, child.”'),
    steps: [
      { id: 'nazli', t: tr('Fırının önünde Nazlı Teyze’yle konuş.', 'Talk to Nazlı Teyze outside the bakery.') },
      { id: 'test', t: tr('Nine’nin evinin önündeki masada yağı tereyağı, ayçiçek yağı ve suyla karşılaştır.', 'On the table outside Grandma’s house, compare the oil with butter, sunflower oil and water.') },
      { id: 'tell', t: tr('Sonucu Nazlı Teyze’ye anlat.', 'Tell Nazlı Teyze the result.') },
    ] },
  azot: { region: 'farm', codes: ['BİY.10.2.4', 'BİY.10.2.2', 'BİY.10.2.5'],
    title: tr('Yeşil şerit', 'The green strip'),
    blurb: tr('Osman Amca’nın yeni buğdayı pastan kurtuldu ama bu kez sararıyor. Yalnız geçen yıl nohut ekilen ince bir şerit yemyeşil. Osman Amca bir çuval gübre almaya hazırlanıyor.', 'Osman Amca’s new wheat got over the rust, but now it’s turning yellow. Only a thin strip where chickpeas grew last year is bright green. Osman Amca is about to buy a sack of fertiliser.'),
    steps: [
      { id: 'osman', t: tr('Osman Amca’yla konuş.', 'Talk to Osman Amca.') },
      { id: 'cycle', t: tr('Tarlanın kenarındaki masada kökleri kaz ve azot döngüsünü kur.', 'At the table on the field edge, dig up the roots and build the nitrogen cycle.') },
      { id: 'tell', t: tr('Osman Amca’ya yeşil şeridin sırrını anlat.', 'Tell Osman Amca the secret of the green strip.') },
    ] },
  ekim: { region: 'farm', codes: ['BİY.10.2.1', 'BİY.12.1.12', 'BİY.9.1.2'],
    title: tr('Ne zaman ekilir?', 'When to sow?'),
    blurb: tr('Fatma Teyze’nin yeğeni şehirden gelmiş, bütün tohumları mayısta, “en sıcak zamanda” ekmek istiyor. Fatma Teyze kırk yıllık defterini çıkarıyor: “Sıcak her şey demek değil evladım.”', 'Fatma Teyze’s nephew has come from the city and wants to sow every seed in May, “when it’s warmest”. Fatma Teyze gets out her forty-year notebook: “Warm isn’t everything, child.”'),
    steps: [
      { id: 'fatma', t: tr('Fatma Teyze’yle konuş.', 'Talk to Fatma Teyze.') },
      { id: 'sow', t: tr('Bahçedeki masada dört bitkiyi dört ayda ek; her birine doğru ayı bul.', 'At the garden table, sow four crops in four months; find a right month for each.') },
      { id: 'tell', t: tr('Takvimi Fatma Teyze’ye göster.', 'Show Fatma Teyze the calendar.') },
    ] },
  etilen: { region: 'farm', codes: ['BİY.10.1.7', 'BİY.9.1.2'],
    title: tr('Yeşil domatesler', 'Green tomatoes'),
    blurb: tr('Ayaz gelmeden Hüseyin Usta bir kasa yeşil domates toplamış. “Güneşte bıraksam mı, buzdolabına mı koysam?” diye soruyor. Komşusu Songül ise “Yanlarına bir elma koy” diyor.', 'Before the frost, Hüseyin Usta picked a crate of green tomatoes. “Leave them in the sun, or put them in the fridge?” he asks. His neighbour Songül says “Put an apple in with them.”'),
    steps: [
      { id: 'huseyin', t: tr('Hüseyin Usta’yla konuş.', 'Talk to Hüseyin Usta.') },
      { id: 'ripen', t: tr('Kilerdeki masada torbaları farklı sıcaklıklarda, elmalı ve elmasız beklet.', 'At the larder table, keep bags at different temperatures, with and without an apple.') },
      { id: 'tell', t: tr('Hüseyin Usta’ya domatesleri nasıl kızartacağını anlat.', 'Tell Hüseyin Usta how to ripen his tomatoes.') },
    ] },
  sindirim: { region: 'clinic', codes: ['BİY.10.1.5', 'BİY.9.2.2', 'BİY.9.2.8'],
    title: tr('Bir lokmanın yolculuğu', 'The journey of a mouthful'),
    blurb: tr('Hemşire Zehra okulda sağlık dersi verecek. Çocuklar “Yemek midede erir, biter” diyor. Zehra ise tüplerle bir lokmanın bütün yolculuğunu göstermek istiyor.', 'Nurse Zehra is giving a health lesson at the school. The children say “Food melts in the stomach and that’s it.” Zehra wants to show a mouthful’s whole journey with test tubes.'),
    steps: [
      { id: 'zehra', t: tr('Hemşire Zehra’yla konuş.', 'Talk to Nurse Zehra.') },
      { id: 'digest', t: tr('Revirdeki tüp rafında dört besini dört bölümün salgısıyla karıştır.', 'At the tube rack in the clinic, mix four foods with the juices of four sections.') },
      { id: 'tell', t: tr('Sindirim haritasını Hemşire Zehra’ya göster.', 'Show Nurse Zehra the digestion map.') },
    ] },
  kilcal: { region: 'yayla', codes: ['BİY.9.2.1', 'BİY.9.1.2'],
    title: tr('Yokuş yukarı akan su', 'Water that flows uphill'),
    blurb: tr('Elif yaylada bir şey fark etmiş: kaynağın yanındaki yosunlar ıslak ama su aşağı akıyor. “Su hiç yukarı çıkar mı? Ağaçların tepesine nasıl çıkıyor?”', 'Elif has noticed something on the yayla: the moss above the spring is wet, yet water flows downhill. “Can water ever go up? How does it get to the top of a tree?”'),
    steps: [
      { id: 'elif', t: tr('Elif’le konuş.', 'Talk to Elif.') },
      { id: 'tests', t: tr('Kaynağın yanındaki masada dört deneyi sade suyla ve sabunlu suyla yap.', 'At the table by the spring, do four tests with plain and soapy water.') },
      { id: 'tell', t: tr('Sonuçları Elif’e anlat.', 'Tell Elif what you found.') },
    ] },
  kul: { region: 'greenhouse', codes: ['BİY.9.2.1', 'BİY.9.2.5', 'BİY.9.1.2'],
    title: tr('Yanmayan şey', 'What doesn’t burn'),
    blurb: tr('Deniz’in öğretmeni “Vücudunun yaklaşık %4’ü, yakınca geriye kalan tuzlardır” demiş. Deniz yine ikna olmamış: “Yanmayan şey mi olur? Hem kül işe yarar mı?”', 'Deniz’s teacher said “About 4% of your body is the salt that’s left when you burn it.” Deniz isn’t convinced again: “Is there anything that doesn’t burn? And what use is ash anyway?”'),
    steps: [
      { id: 'deniz', t: tr('Deniz’le konuş.', 'Talk to Deniz.') },
      { id: 'test', t: tr('Deniz’in masasında dört besini yak, külünü tart ve damla testleriyle incele.', 'At Deniz’s table, burn four foods, weigh the ash and test it with drops.') },
      { id: 'tell', t: tr('Külün sırrını Deniz’e anlat.', 'Tell Deniz the secret of the ash.') },
    ] },
  zar: { region: 'meadow', codes: ['BİY.9.2.6', 'BİY.9.2.2', 'BİY.9.1.2'],
    title: tr('Kanayan pancar', 'The bleeding beetroot'),
    blurb: tr('Songül Abla pancar turşusu kuruyor. Haşladığı pancarın suyu kıpkırmızı oluyor, ama çiğ pancarı kesip yıkayınca su berrak kalıyor. Turşu suyu ise birkaç günde pembeleşiyor. Boya pancarın neresinde saklanıyor?', 'Songül is making beetroot pickle. Boiled beetroot turns its water bright red, but raw beetroot, cut and rinsed, leaves the water clear. The pickle brine turns pink in a few days. Where does the beetroot keep its colour?'),
    steps: [
      { id: 'songul', t: tr('Songül Abla’yla konuş.', 'Talk to Songül.') },
      { id: 'beet', t: tr('Evin önündeki tüplerde pancar disklerini dört sıvıda, üç sıcaklıkta dene.', 'At the tubes outside the house, try beet discs in four liquids at three temperatures.') },
      { id: 'tell', t: tr('Songül Abla’ya pancarın neden kanadığını anlat.', 'Tell Songül why the beetroot bleeds.') },
    ] },
  light: { region: 'greenhouse', codes: ['BİY.10.1.3', 'BİY.10.1.2', 'BİY.9.1.2'],
    title: tr('Solgun fideler', 'Pale seedlings'),
    blurb: tr('Seradaki fideler uzun, cılız ve soluk. Belediye geçen yıl lambaları “daha ucuz” diye değiştirmiş.', 'The seedlings in the greenhouse are tall, spindly and pale. Last year the council swapped the lamps for “cheaper” ones.'),
    steps: [
      { id: 'look', t: tr('Seradaki fide tepsilerine yakından bak.', 'Take a close look at the seedling trays in the greenhouse.') },
      { id: 'exp', t: tr('Deney masasında ışık rengini dene: en az 3 renk, her biri 3 tekrar, gerisi sabit.', 'Test light colours at the bench: at least 3 colours, 3 repeats each, everything else fixed.') },
      { id: 'fix', t: tr('Sera lambalarını deneyine göre ayarla.', 'Set the greenhouse lamps based on your experiment.') },
    ] },
  festival: { region: 'clinic', codes: ['BİY.9.1.2', 'BİY.10.2.8'],
    title: tr('Hasat şenliği', 'The harvest festival'),
    blurb: tr('Nebahat Nine döndü! Köy meydanında hasat şenliği var: davul zurna, bilgi yarışması ve tohum takası.', 'Grandma Nebahat is back! There’s a harvest festival in the village square: drums and pipes, a quiz and a seed swap.'),
    steps: [
      { id: 'letter', t: tr('Okulun önündeki posta kutusunda bir mektup var.', 'There’s a letter in the mailbox in front of the school.') },
      { id: 'nine', t: tr('Köy meydanındaki şenliğe git ve Nebahat Nine’yle konuş.', 'Go to the festival in the village square and talk to Grandma Nebahat.') },
      { id: 'quiz', t: tr('Sahnenin önündeki Alp’la konuş: şenlik yarışması başlıyor.', 'Talk to Alp in front of the stage: the festival quiz is starting.') },
      { id: 'swap', t: tr('Tohum takası masasında tohumlarından en az üçünü köylülerle paylaş.', 'Share at least three of your seeds with the villagers at the seed-swap table.') },
    ],
    reward() { Q.later(() => KIT.certificate()); } },
  mendel: { region: 'meadow', codes: ['BİY.12.2.5', 'BİY.12.1.11', 'BİY.12.2.4', 'BİY.9.1.1'],
    title: tr('Nine’nin bezelyeleri', "Grandma's peas"),
    blurb: tr('Nine iki çeşit bezelye saklamış: yuvarlak ve buruşuk. Etiketinde “Mendel gibi dene” yazıyor.', "Grandma kept two kinds of pea: round and wrinkled. The label says: 'Try it like Mendel.'"),
    steps: [
      { id: 'cross', t: tr('Seradaki Mendel masasında yuvarlak × buruşuk çaprazını yap.', 'Cross round × wrinkled at the Mendel bench in the greenhouse.') },
      { id: 'plant', t: tr('F1 tohumlarını okulun yanındaki bezelye yatağına ek.', 'Sow the F1 seeds in the pea bed next to the school.') },
      { id: 'grow', t: tr('Uyu ve bir mevsim bekle.', 'Sleep and wait a season.') },
      { id: 'count', t: tr('F2 baklalarını topla ve bezelyeleri say.', 'Harvest the F2 pods and count the peas.') },
    ] },
};

const MAIL = {
  bloat: tr('Rıza telefonda anlattı: Sarıkız’ı sen kurtarmışsın! Yoncayı yasaklamadığınıza da sevindim; baklagil toprağın dostudur. Rıza sana ambarından nohut verecekmiş, sakla. — N.', "Rıza told me on the phone: you saved Sarıkız! I'm glad you didn't ban the clover; legumes are the soil's friends. Rıza is giving you chickpeas from his barn. Keep them. — N."),
  willow: tr('Van Helmont da 1640’larda aynı söğüdü tarttı ve “hepsi sudan” dedi. Havayı hesaba katmadı. Sen kattın. Sandığın dibinde Kars’tan kavılca tohumu var, senin olsun. — N.', "Van Helmont weighed the same kind of willow in the 1640s and concluded 'it's all water'. He never counted the air. You did. At the bottom of the chest there is kavılca seed from Kars. It's yours. — N."),
  leaves: tr('Siyez sararınca babam “toprak acıkmış” derdi. Haklıymış: azota acıkmış. — N.', "When the siyez yellowed, my father used to say 'the soil is hungry'. He was right: hungry for nitrogen. — N."),
  pond: tr('Kurbağalar döndü mü? Döndüyse gölet iyileşiyordur. Derileriyle de nefes aldıkları için temiz suyun en iyi bekçileridir. — N.', 'Are the frogs back? If so, the pond is healing. They breathe through their skin too, so they are the best guards of clean water. — N.'),
  bakery: tr('Nazlı’nın ekmeği yine kabarmış; kokusu buraya kadar geldi! Pasteur 1850’lerde mayalanmayı canlı mayaların yaptığını göstermişti. Maya da bir canlı: haşlarsan ölür. — N.', 'Nazlı’s bread is rising again; I can smell it from here! In the 1850s Pasteur showed that fermentation is the work of living yeast. Yeast is alive: scald it and it dies. — N.'),
  seedbank: tr('Leningrad kuşatmasında (1941–44) Vavilov’un tohum bankasındaki bilim insanları açlıktan ölürken bile korudukları tohumlara dokunmadılar. Tohum bir sözdür: yarına. Kavanozları tazelediğin için sağ ol. — N.', 'During the siege of Leningrad (1941–44), the scientists at Vavilov’s seed bank would not touch the seeds they guarded, even as they starved. A seed is a promise to tomorrow. Thank you for renewing the jars. — N.'),
  hardware: tr('Rıza anlattı: Sarıkız’ın börkeneğinde artık bir mıknatıs varmış! Eskiden böyle hayvanlar ölür, sebebi bilinmezdi. Bir dedektör, bir mıknatıs ve biraz merak… Bilim bazen bu kadar sade. — N.', 'Rıza told me: Sarıkız has a magnet in her reticulum now! In the old days animals like her died and nobody knew why. A detector, a magnet and a little curiosity… Sometimes science is that simple. — N.'),
  spring: tr('1966’da Thomas Brock, Yellowstone’daki sıcak pınarları senin gibi bir termometreyle ölçtü ve 70 °C’de yaşayan Thermus aquaticus bakterisini buldu. Onun ısıya dayanıklı enzimi bugün PCR testlerinde DNA’yı çoğaltıyor. Küçük bir pınar, büyük bir buluş! Pınarın serin ucunda yarpuz biter; çayına at. — N.', 'In 1966 Thomas Brock measured the hot springs of Yellowstone with a thermometer just like yours and found Thermus aquaticus, a bacterium living at 70 °C. Its heat-proof enzyme copies DNA in PCR tests today. A small spring, a big discovery! Wild mint grows at the cool end of the spring; put some in your tea. — N.'),
  yayla: tr('1875’te Zénith balonu 8000 metreye yükseldi; üç yolcudan ikisi havada öldü. Fizyolog Paul Bert onları uyarmıştı: sorun havadaki oksijenin oranı değil, basıncıydı. Sen de Elif’i ölçerek aynı sonuca vardın. Yayla kekiği senin; çayına bir dal at. — N.', 'In 1875 the balloon Zénith rose to 8,000 metres, and two of its three passengers died in the air. The physiologist Paul Bert had warned them: the problem wasn’t the share of oxygen in the air but its pressure. By measuring Elif you reached the same conclusion. The yayla thyme is yours; put a sprig in your tea. — N.'),
  well: tr('Dört bin yıl önce Mezopotamya’da Sümerler tarlalarını Dicle ile Fırat’tan suladı; su buharlaştı, tuz kaldı. Tabletlerde önce buğdayın azaldığı, yerine tuza dayanıklı arpanın ekildiği, sonunda tarlaların “beyazladığı” yazar. Sen bir bahçeyi zamanında kurtardın. Ayaş domatesinin tohumları senin. — N.', 'Four thousand years ago in Mesopotamia the Sumerians watered their fields from the Tigris and the Euphrates; the water evaporated and the salt stayed. Their tablets tell of wheat dwindling, of hardier barley sown in its place, and at last of fields that “turned white”. You saved a garden in time. The Ayaş tomato seeds are yours. — N.'),
  owl: tr('Malezya’nın palmiye bahçelerinde çiftçiler 1980’lerde fare zehrini bırakıp peçeli baykuşlara yuva astılar. Bugün orada binlerce yuva var ve baykuşlar fareleri zehirsiz kontrol altında tutuyor. Rıza’nın ambarının da artık bir gece bekçisi var. Karakılçık buğdayı senin: fareden kurtardığın ambarın tohumu. — N.', 'In the 1980s, farmers in Malaysia’s oil-palm plantations gave up rat poison and put up nest boxes for barn owls. Today there are thousands of them, and the owls keep the rats down without poison. Rıza’s grain store has a night watchman now too. The Karakılçık wheat is yours: seed from the store you saved from the mice. — N.'),
  azik: tr('1780’lerde Lavoisier ile Laplace, buzla çevrili bir kabın içine bir kobay koydular. Kobayın vücut ısısıyla eriyen buzu, aynı miktarda karbondioksit veren kömürün erittiği buzla karşılaştırdılar: ikisi birbirine çok yakındı. “Solunum, çok yavaş bir yanmadır,” diye yazdılar. Alp’ın cevizi de yarın bacaklarında yavaş yavaş yanacak. Bu ceviz tohumu senin: istasyonun önündeki yaşlı ağaçtan. — N.', 'In the 1780s, Lavoisier and Laplace put a guinea pig inside a vessel packed with ice. They compared the ice melted by the animal’s body heat with the ice melted by burning enough charcoal to give the same amount of carbon dioxide: the two were very close. “Respiration is a very slow combustion,” they wrote. Tomorrow Alp’s walnuts will burn slowly in Alp’s legs. This walnut is yours: from the old tree by the station. — N.'),
  hucre: tr('1665’te Robert Hooke bir mantar tıpasından incecik bir dilim kesip mikroskopla baktı ve gördüğü küçük odacıklara “cell”, yani oda dedi. 1838’de Schleiden bütün bitkilerin, 1839’da Schwann bütün hayvanların hücrelerden yapıldığını gösterdi; 1855’te Virchow “her hücre bir hücreden gelir” diye yazdı. Mehmet’in yetmiş yılda göremediğini sen bir öğleden sonrada gösterdin. Kırmızı soğan tohumu senin. — N.', 'In 1665 Robert Hooke cut a very thin slice of cork, looked at it through a microscope and called the little chambers he saw “cells”, meaning small rooms. In 1838 Schleiden showed that all plants are made of cells, and in 1839 Schwann did the same for animals; in 1855 Virchow wrote that “every cell comes from a cell”. What Mehmet couldn’t see in seventy years, you showed him in one afternoon. The red onion seed is yours. — N.'),
  asi: tr('Aşıyı Çinliler ve Yunanlılar iki bin yıldan uzun zaman önce biliyordu; Anadolu’nun eski bahçeleri de onunla kuruldu. Bugün markette gördüğün elmaların neredeyse hepsi aşılı ağaçlardan gelir: her “Amasya”, ilk Amasya ağacının kopyasının kopyasıdır. Hüseyin’in kalemleri artık sende. Ve unutma: bahçeyi tek bir çeşitle doldurma. — N.', 'The Chinese and the Greeks knew about grafting more than two thousand years ago, and the old orchards of Anatolia were built with it. Almost every apple you see at the market comes from a grafted tree: every “Amasya” is a copy of a copy of the first Amasya tree. Hüseyin’s scions are yours now. And remember: don’t fill an orchard with a single variety. — N.'),
  kabak: tr('1761’de Joseph Kölreuter tütün çiçeklerini elle tozlayıp ilk bilimsel bitki melezlerini yaptı; melezin iki ebeveynin arasında bir şey çıktığını, yani polenin de tohuma bir şey kattığını gösterdi. Böceklerin tozlaşmadaki rolünü de o fark etti. Fatma’nın etiketli kabakları o yolun devamı. — N.', 'In 1761 Joseph Kölreuter hand-pollinated tobacco flowers and made the first scientific plant hybrids; he showed the hybrid came out somewhere between its two parents, so pollen adds something to the seed too. He also noticed the part insects play in pollination. Fatma’s tagged squash carry on his work. — N.'),
  pas: tr('1840’larda İrlanda’da çiftçilerin çoğu aynı patates çeşidini ekiyordu. Mantara benzeyen bir hastalık gelince tarlaların hepsi birden çürüdü ve bir milyon insan açlıktan öldü. 2000 yılında Çin’in Yunnan bölgesinde çiftçiler iki pirinç çeşidini ayrı ayrı değil, karışık ekti: hastalığa açık çeşitte yanıklık hastalığı %94 azaldı ve ilaca gerek kalmadı. Tarladaki çeşitlilik, hastalığa karşı bir sigortadır.', 'In the 1840s most farmers in Ireland grew the same potato variety. When a fungus-like disease arrived, every field rotted at once and a million people died of hunger. In 2000, in China’s Yunnan province, farmers sowed two rice varieties mixed instead of apart: blast disease on the susceptible variety fell by 94% and no spray was needed. Variety in the field is insurance against disease.'),
  kompost: tr('1924–1931 yılları arasında İngiliz tarım bilimci Albert Howard, Hindistan’ın Indore kentinde çiftçilerle birlikte bir yöntem geliştirdi: bitki artıkları, hayvan gübresi ve toprak katman katman yığılıyor, nemli tutuluyor ve düzenli çevriliyordu. Birkaç ayda koyu, verimli bir toprak çıkıyordu. Bugün bahçelerde kurulan kompost yığınlarının çoğu bu “Indore yöntemi”nin torunudur. Çöplüğe giden mutfak ve bahçe artığı ise havasız çürür ve güçlü bir sera gazı olan metan çıkarır.', 'Between 1924 and 1931, the British agricultural scientist Albert Howard worked out a method with farmers in Indore, India: plant waste, animal manure and soil were piled in layers, kept damp and turned regularly. Within a few months they became dark, rich soil. Most compost heaps in gardens today are grandchildren of this “Indore method”. Kitchen and garden waste sent to a landfill, by contrast, rots without air and gives off methane, a strong greenhouse gas.'),
  leylek: tr('Leylekler binlerce yıldır çiftçinin yanında yaşar; tarlada çekirgeyi, kurbağayı, fareyi toplarlar. 1962’de Rachel Carson “Sessiz Bahar”ı yazdı: ilaçlanan tarlalarda böceklerin, sonra kuşların nasıl yok olduğunu anlattı. O kitaptan sonra DDT birçok ülkede yasaklandı. Sen de bir çayırın sesini geri getirdin. Gelincik tohumu senin: tarla kenarına ek, hem arıya hem uğur böceğine yuva olsun. — N.', 'Storks have lived alongside farmers for thousands of years, picking up grasshoppers, frogs and mice in the fields. In 1962 Rachel Carson wrote “Silent Spring”: she told how the insects, and then the birds, vanished from sprayed fields. After that book DDT was banned in many countries. You have brought back the sound of a meadow too. The poppy seed is yours: sow it along a field edge, as a home for bees and ladybirds alike. — N.'),
  tansiyon: tr('Kan basıncını ilk ölçen, 1733’te bir atın bacağındaki atardamara cam bir boru bağlayan İngiliz papaz Stephen Hales’tir: kan boruda iki buçuk metreden fazla yükselmiş! Senin kullandığın kulakla ölçme yöntemini 1905’te Rus cerrah Nikolay Korotkov buldu; o “tık” seslerine bugün hâlâ onun adı verilir. Hasan’a söyle, reyhanı pencerenin önünde yetiştirsin: tuzun yerini kokusu tutar. — N.', 'The first person to measure blood pressure was Stephen Hales, an English clergyman, who in 1733 tied a glass tube into the artery of a horse’s leg: the blood rose more than two and a half metres up the tube! The listening method you used was found in 1905 by the Russian surgeon Nikolai Korotkov, and those taps still carry his name. Tell Hasan to grow the basil on his windowsill: its scent makes up for the salt. — N.'),
  eksik: tr('İlk kontrollü deneylerden biri bir eksiklik deneyiydi. 1747’de gemi doktoru James Lind, iskorbüte yakalanmış on iki denizciyi ikişerli gruplara ayırdı; her gruba başka bir şey verdi: elma şırası, sirke, deniz suyu… Günde iki portakal ve bir limon alan ikisi bir haftada ayağa kalktı. Vitamin sözcüğü ise ancak 1912’de uyduruldu. Recep’e söyle, bahçemdeki kuşburnundan reçel yapsın. — N.', 'One of the first controlled experiments was a deficiency experiment. In 1747 the ship’s surgeon James Lind split twelve sailors with scurvy into pairs and gave each pair something different: cider, vinegar, sea water… The two who got two oranges and a lemon a day were on their feet within a week. The word vitamin was only coined in 1912. Tell Recep to make jam from the rosehips in my garden. — N.'),
  yogurt: tr('Annem mayayı serçe parmağıyla vururdu: parmağını sütte ona kadar sayabiliyorsan maya zamanıdır. Termometre olmadan 45 °C’yi bulmanın yolu buymuş. Sonra tencereyi yün bir örtüye sarardı. — N.', 'My mother tested the milk with her little finger: if you can hold it in the milk while you count to ten, it’s time for the starter. That was how to find 45 °C without a thermometer. Then she wrapped the pot in a wool blanket. — N.'),
  sera: tr('Karbondioksitin ısıyı tuttuğunu ilk gösteren bir kadındı: Eunice Foote, 1856’da iki cam silindiri güneşe koydu, birinde hava, birinde karbondioksit. Karbondioksitli olan daha çok ısındı ve daha geç soğudu. Yazısını toplantıda bir erkek okumak zorunda kaldı. — N.', 'The first person to show that carbon dioxide traps heat was a woman: in 1856 Eunice Foote put two glass cylinders in the sun, one with air, one with carbon dioxide. The CO₂ one got hotter and cooled more slowly. A man had to read her paper out at the meeting. — N.'),
  hediye: tr('Nazlı’nın kız kardeşi Ayvalık’ta zeytin toplar. Kasımda oraya gittim; zeytinyağı ilk sıkıldığında yeşil ve acıdır, boğazı yakar. O acı iyi yağın işaretidir. — N.', 'Nazlı’s sister picks olives in Ayvalık. I went there one November: olive oil is green and bitter when first pressed, and it catches your throat. That bite is the sign of good oil. — N.'),
  azot: tr('Babam buğdaydan sonra hep nohut ya da fiğ ekerdi. “Toprağı dinlendiriyoruz” derdi. Dinlendirmek değilmiş, besliyormuş: nohudun kökündeki bakteriler havadaki azotu toprağa bağlar. — N.', 'After wheat my father always sowed chickpeas or vetch. “We’re resting the soil,” he said. It wasn’t resting, it was feeding: bacteria in the chickpea roots fix nitrogen from the air into the soil. — N.'),
  ekim: tr('Rahmetli kocam “Buğdayı ekimde ekmezsen kış onu uyutmaz, uyumayan buğday başak vermez” derdi. Bilim adamları buna vernalizasyon diyor; Fatma buna “buğdayın kış uykusu” diyor. — N.', 'Fatma’s late husband used to say “If you don’t sow wheat in October, winter won’t put it to sleep, and wheat that hasn’t slept won’t make ears.” Scientists call it vernalisation; Fatma calls it “the wheat’s winter sleep”. — N.'),
  etilen: tr('Annem yeşil domatesleri gazeteye sarıp dolabın dibine koyardı, araya da bir elma. Bir haftaya kıpkırmızı olurlardı. Elmanın “gaz verdiğini” bilirdi ama adını bilmezdi: etilen. — N.', 'My mother wrapped green tomatoes in newspaper and put them at the bottom of the cupboard, with an apple among them. In a week they were bright red. She knew the apple “gave off a gas” but not its name: ethylene. — N.'),
  sindirim: tr('1822’de William Beaumont, karnında kapanmayan bir yara kalan Alexis St. Martin’in midesine iple bağlı et parçaları sarkıttı ve saat saat çıkarıp baktı. Sindirimin kimyasal olduğunu böyle gösterdi. Bizim tüplerimiz daha nazik. — N.', 'In 1822 William Beaumont dangled pieces of meat on a string into the stomach of Alexis St. Martin, whose wound had never closed, and pulled them out hour by hour. That is how he showed digestion is chemical. Our tubes are kinder. — N.'),
  kilcal: tr('Dünyanın en uzun ağacı sekvoyalar 115 metreyi geçer. Hiçbir pompa olmadan su köklerinden tepelerine çıkar: yapraklardan buharlaşan su, kopmayan su sütununu yukarı çeker. — N.', 'The tallest trees in the world, redwoods, pass 115 metres. With no pump at all, water rises from their roots to their tops: water evaporating from the leaves pulls the unbroken column up. — N.'),
  kul: tr('Eskiden köyde kül boşa gitmezdi. Annem çamaşırı kül suyuyla yıkar, babam sobanın külünü bahçeye serperdi. Bitkinin topraktan aldığı tuzlar küle kalır; kül de toprağa döner. — N.', 'In the old days nothing was wasted, not even ash. My mother washed the laundry in ash water and my father spread the stove ash on the garden. The salts a plant takes from the soil stay in its ash, and the ash goes back to the soil. — N.'),
  zar: tr('1925’te iki Hollandalı, Gorter ile Grendel, kırmızı kan hücrelerinin zar yağlarını suyun üstüne yaydılar. Yağ, hücrelerin yüzeyinin neredeyse tam iki katı alan kapladı. Zarın iki kat olduğu böyle anlaşıldı. — N.', 'In 1925 two Dutchmen, Gorter and Grendel, spread the membrane fats of red blood cells on water. The fat covered almost exactly twice the cells’ surface area. That is how we learnt the membrane is two layers thick. — N.'),
  fest_invite: tr('Torunum, dizim iyileşti, dönüyorum! Köy meydanında hasat şenliği var. Rıza davulu getirecek, Nazlı çörekleri. Sen de defterini getir: Alp bir yarışma hazırlamış, sorular senin defterinden! — N.', 'My dear, my knee has healed and I’m coming home! There’s a harvest festival in the village square. Rıza will bring the drum and Nazlı the pastries. Bring your journal: Alp has made a quiz, and the questions come from your notes! — N.'),
  festival: tr('Bu mektubu posta kutusuna kendim koydum; yüz yüze söyleseydim ağlardım. Vadi bir mevsimde yeniden renklendi, çünkü sen her solgunluğun sebebini canlıların içinde aradın ve ölçtün. Mercek artık senin. Tohumlar da: saklamak yetmez, ekmek ve paylaşmak gerekir. Artık sen de bir Tohum Bekçisisin. — Nebahat Nine', 'I put this letter in the mailbox myself; if I’d said it to your face I would have cried. The valley came back to life in one season because you looked for the cause of every fading inside living things, and measured it. The lens is yours now. So are the seeds: keeping them is not enough, they must be sown and shared. You are a Seedkeeper too now. — Grandma Nebahat'),
  light: tr('Seranın lambalarını belediye “ucuz” diye yeşil almıştı. Sen deneyle gösterdin. Tahmin değil, ölçüm! — N.', "The council bought green lamps for the greenhouse because they were 'cheap'. You proved it with an experiment. Not a guess: a measurement! — N."),
  mendel: tr('Mendel de bir manastır bahçesinde, bezelyelerle başladı. 5474’e 1850. Sabrın kalıtımı var mı bilmem ama sende var. — N.', "Mendel started with peas too, in a monastery garden. 5474 to 1850. I don't know if patience is inherited, but you have it. — N."),
};

// ================================================================ seeds
const SEEDS = {
  siyez: { name: tr('Siyez buğdayı', 'Siyez wheat'), latin: 'Triticum monococcum', tint: '#D9B45A', from: tr('Kastamonu', 'Kastamonu'),
    text: tr('Dünyada ekilen ilk buğdaylardan. Yaklaşık 10 000 yıl önce Güneydoğu Anadolu’da, Karacadağ çevresinde evcilleştirildi. Kavuzu taneye sıkıca yapışıktır; yoksul topraklarda bile yetişir.', 'One of the first wheats ever farmed, domesticated about 10,000 years ago around Karacadağ in south-east Anatolia. Its husk clings tightly to the grain, and it grows even in poor soil.'),
    note: tr('Babamın babası da bunu ekerdi. Tohumu satın alma: sakla ve paylaş.', "My grandfather sowed this too. Don't buy seed: keep it and share it.") },
  kavilca: { name: tr('Kavılca buğdayı', 'Kavılca wheat'), latin: 'Triticum dicoccum', tint: '#B98A4A', from: tr('Kars', 'Kars'),
    text: tr('Gernik (emmer) buğdayının Kars ve Ardahan’daki adı. Soğuğa dayanıklı, kavuzlu bir ata buğdayı. Yayla köylerinde hâlâ ekiliyor.', "The name used in Kars and Ardahan for emmer wheat: a hardy, hulled heirloom wheat that stands the cold. It's still sown in highland villages.") },
  chickpea: { name: tr('Nohut', 'Chickpea'), latin: 'Cicer arietinum', tint: '#D8C79A', from: tr('Rıza Dede’nin ambarı', "Rıza Dede's barn"),
    text: tr('Güneydoğu Anadolu’da evcilleştirildi. Kökündeki nodüllerde yaşayan bakteriler havadaki azotu bitkinin kullanabileceği hâle getirir; toprak bir sonraki ekime hazırlanır.', 'Domesticated in south-east Anatolia. Bacteria living in nodules on its roots turn nitrogen from the air into a form the plant can use, getting the soil ready for the next crop.') },
  clover: { name: tr('Çayır üçgülü', 'Red clover'), latin: 'Trifolium pratense', tint: '#C87A9A', from: tr('Rıza Dede’nin yoncalığı', "Rıza Dede's clover field"),
    text: tr('Bir baklagil: kökünde azot bağlayan bakteriler yaşar, çiçeklerini arılar sever. Hayvanlara dikkatle ve yavaş yavaş verilmelidir.', "A legume: nitrogen-fixing bacteria live on its roots, and bees love its flowers. It must be fed to animals carefully and a little at a time.") },
  corekotu: { name: tr('Çörek otu', 'Nigella (black cumin)'), latin: 'Nigella sativa', tint: '#3A3430', from: tr('Nazlı Teyze’nin fırını', 'Nazlı Teyze’s bakery'),
    text: tr('Pidenin ve çöreğin üstüne serpilen siyah, köşeli tohumlar. Açık mavi çiçekli, bir yıllık bir bitkiden gelir; bu topraklarda binlerce yıldır ekilir.', 'The black, angular seeds sprinkled on pide and çörek. They come from an annual plant with pale blue flowers, grown in these lands for thousands of years.'),
    note: tr('Unun iyisi kadar mayanın canlısı da önemli, evladım.', 'Good flour matters, child, but so does live yeast.') },
  fig: { name: tr('Adi fiğ', 'Common vetch'), latin: 'Vicia sativa', tint: '#5A4A3A', from: tr('Rıza Dede’nin ambarı', 'Rıza Dede’s barn'),
    text: tr('Hayvan yemi için ekilen bir baklagil: mor çiçekli, sülükleriyle tutunan bir bitki. Kökündeki bakteriler toprağa azot kazandırır; arpa ya da yulafla karışık ekilince iyi bir kış yemi olur.', 'A legume grown as animal fodder: a purple-flowered plant that climbs with tendrils. Bacteria on its roots add nitrogen to the soil, and sown with barley or oats it makes good winter feed.'),
    note: tr('Yemin iyisi temiz olanıdır.', 'The best feed is clean feed.') },
  mercimek: { name: tr('Kırmızı mercimek', 'Red lentil'), latin: 'Lens culinaris', tint: '#C8643A', from: tr('Nine’nin tohum bankası', 'Grandma’s seed bank'),
    text: tr('Tarımın başladığı ilk bitkilerden biri: yaklaşık 10 000 yıl önce Bereketli Hilal’de, Güneydoğu Anadolu’da evcilleştirildi. Bir baklagildir; kökündeki bakteriler toprağa azot kazandırır.', 'One of the very first crops: domesticated about 10,000 years ago in the Fertile Crescent, including south-east Anatolia. It is a legume, and bacteria on its roots add nitrogen to the soil.'),
    note: tr('Kavanozdaki tohum, ekilmedikçe yalnızca bir hatıradır.', 'A seed in a jar is only a memory until it is sown.') },
  yarpuz: { name: tr('Yarpuz', 'Horse mint'), latin: 'Mentha longifolia', tint: '#6E9A5A', from: tr('Kükürtlü Pınar’ın serin ucu', 'The cool end of the Sulphur Spring'),
    text: tr('Dere kenarlarında ve pınar başlarında biten yabani bir nane. Anadolu’da çayı ve ayranı tatlandırır; kökleri ıslak toprağı tutar, çiçeklerini arılar sever.', 'A wild mint of streamsides and spring heads. In Anatolia it flavours tea and ayran; its roots hold wet soil together and bees love its flowers.'),
    note: tr('Pınar başında biten ot, pınarın bekçisidir.', 'The herb at the spring head is the spring’s keeper.') },
  kekik: { name: tr('Yayla kekiği', 'Wild thyme'), latin: 'Thymus sipyleus', tint: '#9A7AA8', from: tr('Yayla', 'The yayla'),
    text: tr('Taşlık yamaçlarda biten, mor çiçekli, güzel kokulu bir ot. Anadolu’da onlarca kekik türü yetişir; arılar bayılır, yayla balının kokusu buradan gelir.', 'A fragrant, purple-flowered herb of stony slopes. Dozens of kinds of thyme grow in Anatolia; bees love them, and they give yayla honey its scent.'),
    note: tr('Yavaş yürüyen zirveye varır.', 'Walk slowly and you’ll reach the top.') },
  ayas: { name: tr('Ayaş domatesi', 'Ayaş tomato'), latin: 'Solanum lycopersicum', tint: '#C83A2E', from: tr('Songül’ün bahçesi', 'Songül’s garden'),
    text: tr('Ankara’nın Ayaş ilçesinin ince kabuklu, bol sulu yerel domatesi. Ata tohumundan yetişir: her yıl en güzel meyvenin tohumu kurutulup saklanır.', 'The thin-skinned, juicy local tomato of Ayaş, near Ankara. It grows from heirloom seed: each year the seeds of the best fruit are dried and kept.'),
    note: tr('Su bol diye her su iyi değildir.', 'Plenty of water isn’t always good water.') },
  karakilcik: { name: tr('Karakılçık buğdayı', 'Karakılçık wheat'), latin: 'Triticum durum', tint: '#5A4632', from: tr('Rıza Dede’nin ambarı', 'Rıza Dede’s grain store'),
    text: tr('Kılçıkları kapkara olan eski bir Anadolu buğdayı. Kuraklığa dayanıklıdır; köylerde bulgur ve yufka için ekilir.', 'An old Anatolian wheat with jet-black awns. It stands up to drought and is grown in villages for bulgur and yufka bread.'),
    note: tr('Ambarın bekçisi gece uyanır.', 'The grain store’s guard wakes at night.') },
  ceviz: { name: tr('Ceviz', 'Walnut'), latin: 'Juglans regia', tint: '#8A6A44', from: tr('İstasyonun önündeki yaşlı ceviz ağacı', 'The old walnut tree by the station'),
    text: tr('Anadolu’da binlerce yıldır yetiştirilen bir ağaç; iki yüz yıl yaşayabilir. Tohumu yağ dolu olduğundan, dağ yolcularının ve çobanların yüzyıllık azığıdır.', 'A tree grown in Anatolia for thousands of years; it can live for two hundred. Its seed is full of oil, so it has been the trail food of travellers and shepherds for centuries.'),
    note: tr('Küçük tohum, büyük depo.', 'A small seed, a big store.') },
  sogan: { name: tr('Kırmızı soğan', 'Red onion'), latin: 'Allium cepa', tint: '#8A2E5E', from: tr('Mehmet Dede’nin bahçesi', 'Mehmet Dede’s garden'),
    text: tr('Anadolu bahçelerinin vazgeçilmezi. İki yıllıktır: ilk yıl soğanını, ikinci yıl çiçeğini ve tohumunu verir.', 'A must in every Anatolian garden. It lives two years: the first year it makes its bulb, the second its flowers and seed.'),
    note: tr('Her katı bir yaprak, her yaprağı milyonlarca hücre.', 'Every layer a leaf, every leaf millions of cells.') },
  amasya: { name: tr('Amasya elması (aşı kalemi)', 'Amasya apple (scion)'), latin: 'Malus domestica', tint: '#B8342A', from: tr('Çiftlikteki 120 yaşındaki ağaç', 'The 120-year-old tree on the farm'),
    text: tr('Bu kutuda tohum değil, bir dal var: Amasya elması çekirdekten aynı çıkmaz, ancak aşıyla yaşar. Kokulu, gevrek, uzun saklanan eski bir Anadolu çeşidi.', 'This box holds a shoot, not a seed: an Amasya apple doesn’t come true from its pips and lives on only by grafting. An old Anatolian variety: fragrant, crisp and a good keeper.'),
    note: tr('Ağaç ölür, dalı yaşar.', 'The tree dies; its branch lives on.') },
  gelincik: { name: tr('Gelincik', 'Corn poppy'), latin: 'Papaver rhoeas', tint: '#D8302A', from: tr('Ayten’in tarla kenarı şeridi', 'Ayten’s field-margin strip'),
    text: tr('Buğday tarlalarının kenarında kıpkırmızı açan yabani çiçek. Tohumu toprakta yıllarca uyuyabilir, toprak sürülünce uyanır. Çiçekli şeritler tozlayıcıları, uğur böceklerini ve parazit arıları çeker.', 'The scarlet wild flower along the edges of wheat fields. Its seed can lie dormant in the soil for years and wakes when the ground is ploughed. Flower strips draw in pollinators, ladybirds and parasitic wasps.'),
    note: tr('Tarla kenarı boş kalmasın.', 'Don’t leave the field edge bare.') },
  reyhan: { name: tr('Mor reyhan', 'Purple basil'), latin: 'Ocimum basilicum', tint: '#6A3A6A', from: tr('Hasan Dede’nin pencere önü', 'Hasan Dede’s windowsill'),
    text: tr('Anadolu’da pencere önlerinde yetişen, mor yapraklı, kokulu fesleğen. Yemeklere ve şerbetlere koku verir; tuzu azaltınca eksik kalan tadı kokusuyla doldurur.', 'A fragrant, purple-leaved basil grown on Anatolian windowsills. It flavours food and sherbet, and its scent fills the gap when you cut down on salt.'),
    note: tr('Tuzun yerine koku.', 'Scent in place of salt.') },
  pea_round: { name: tr('Yuvarlak bezelye', 'Round pea'), latin: 'Pisum sativum · RR', tint: '#C9C46A', from: tr('Nine’nin sandığı', "Grandma's chest"),
    text: tr('Nişastası bol; kurudukça şeklini korur ve yuvarlak kalır.', 'Rich in starch; it keeps its shape as it dries and stays round.') },
  pea_wrinkled: { name: tr('Buruşuk bezelye', 'Wrinkled pea'), latin: 'Pisum sativum · rr', tint: '#8FAE5A', from: tr('Nine’nin sandığı', "Grandma's chest"),
    text: tr('Nişasta yapan bir enzimin geni bozuk: tohumda daha az nişasta, daha çok şeker olur, bu yüzden tadı tatlıdır. Kururken çok su kaybeder ve buruşur.', 'The gene for a starch-making enzyme is broken, so the seed holds less starch and more sugar and tastes sweet. It loses a lot of water as it dries and shrivels.') },
  pea_f2: { name: tr('F2 bezelyeleri', 'F2 peas'), latin: 'Pisum sativum · RR, Rr, rr', tint: '#A9BC7F', from: tr('Senin bezelye yatağın', 'Your pea bed'),
    text: tr('Senin çaprazının torunları. Her dört bezelyeden yaklaşık biri buruşuk.', 'The grandchildren of your cross. Roughly one pea in four is wrinkled.') },
  atakabak: { name: tr('Ata kabağı', 'Heirloom squash'), latin: 'Cucurbita pepo', tint: '#C8B45A', from: tr('Fatma Teyze’nin bahçesi', 'Fatma Teyze’s garden'),
    text: tr('Açık tozlaşan yerel bir sakız kabağı çeşidi. Tohumu saklanırsa her yıl aynı kabağı verir; yeter ki aynı türden başka kabaklarla karışmasın.', 'An open-pollinated local summer squash. Saved seed gives the same squash every year, as long as it doesn’t cross with other squash of the same species.'),
    note: tr('Etiketli kabağın çekirdeğini ayrı zarfa koy. — F.', 'Keep the tagged squash’s seeds in a packet of their own. — F.') },
  karakilcik: { name: tr('Karakılçık buğdayı', 'Karakılçık wheat'), latin: 'Triticum durum', tint: '#8A7A4A', from: tr('Osman Amca', 'Osman Amca'),
    text: tr('Kara kılçıklı, Anadolu’nun eski bir yerel buğdayı. Nine onu başka yerel buğdaylarla karışık eker: bitkiler birbirinin aynısı olmadığı için bir hastalık hepsini birden saramaz.', 'An old local Anatolian wheat with black awns. Grandma sows it mixed with other local wheats: the plants aren’t all copies of each other, so one disease can’t sweep through them all.'),
    note: tr('Yarısı sende, yarısı bende. Bu güz karışık ekiyorum. — O.', 'Half for you, half for me. This autumn I’m sowing it mixed. — O.') },
  pembedomates: { name: tr('Pembe ata domatesi', 'Pink heirloom tomato'), latin: 'Solanum lycopersicum', tint: '#D86A6A', from: tr('Sevim Hanım', 'Sevim'),
    text: tr('Sevim Hanım’ın annesinden kalma, iri, dilimli, pembe bir domates. Çiçekleri çoğunlukla kendi kendini tozladığı için tohumu saklanırsa her yıl aynı domates çıkar.', 'A big, ribbed, pink tomato handed down from Sevim’s mother. Its flowers mostly pollinate themselves, so saved seed gives the same tomato every year.'),
    note: tr('Gelecek bahar fidelerini kompostlu toprağa dikeceğim! — S.', 'Next spring I’ll plant the seedlings in compost-rich soil! — S.') },
};
function give(id) { const S = G.S; if (S.journal.seeds.includes(id)) return; S.journal.seeds.push(id); AU.sfx('collect'); UI.toast(T('got_item', { i: L(SEEDS[id].name) }), '✉'); }

// ================================================================ misconceptions (for the journal)
const MISC = {
  minerals_give_energy: { wrong: tr('Mineral tuzları vücuda enerji verir.', 'Mineral salts give the body energy.'), right: tr('Tuzlar yanmaz, bu yüzden enerji vermez. Enerji karbonhidrat, yağ ve proteinden gelir; tuzlar yapı taşı ve düzenleyicidir.', 'Salts don’t burn, so they give no energy. Energy comes from carbohydrate, fat and protein; salts are building blocks and regulators.') },
  plants_no_mito: { wrong: tr('Bitki hücresinde kloroplast vardır, mitokondri yoktur.', 'Plant cells have chloroplasts but no mitochondria.'), right: tr('Bitki hücresinde ikisi de vardır: kloroplast şekeri yapar, mitokondri o şekerden ATP üretir.', 'Plant cells have both: the chloroplast makes sugar, the mitochondrion makes ATP from it.') },
  heat_makes_pigment: { wrong: tr('Isı pancarın boyasını çoğaltır.', 'Heat makes more of the beetroot’s dye.'), right: tr('Boya hep oradadır, kofulun içinde. Isı zarı bozar ve boyayı serbest bırakır.', 'The dye is always there, inside the vacuole. Heat damages the membrane and lets it out.') },
  membrane_is_wall: { wrong: tr('Hücre zarı hiçbir şeyi geçirmeyen bir duvardır.', 'The cell membrane is a wall that lets nothing through.'), right: tr('Zar seçici geçirgendir: su gibi küçük moleküller geçer, büyük moleküller geçemez, bazıları kanal ve pompalarla taşınır.', 'The membrane is selectively permeable: small molecules like water pass, big ones don’t, and some are carried by channels and pumps.') },
  warm_always_better: { wrong: tr('Bitki ne kadar sıcakta ekilirse o kadar iyi büyür.', 'The warmer you sow a crop, the better it grows.'), right: tr('Her bitkinin kendi sıcaklık aralığı vardır: ayaz öldürür, aşırı sıcak çiçeği döker, uzun gün ıspanağı tohuma kaçırır.', 'Every crop has its own temperature range: frost kills, too much heat drops the flowers, long days make spinach bolt.') },
  wheat_needs_warmth: { wrong: tr('Buğday soğuktan zarar görür; baharda ekmek daha güvenlidir.', 'Cold harms wheat; sowing in spring is safer.'), right: tr('Kışlık buğday çiçeklenmek için haftalarca soğuk ister (vernalizasyon); baharda ekilirse başak vermez.', 'Winter wheat needs weeks of cold before it can flower (vernalisation); sown in spring it makes no ears.') },
  fridge_ripens: { wrong: tr('Buzdolabı meyveyi olgunlaştırır, taze tutar.', 'The fridge ripens fruit and keeps it fresh.'), right: tr('Soğuk olgunlaşma enzimlerini neredeyse durdurur; domates 4 °C’de yeşil kalır ve soğuk yarası alır.', 'Cold all but stops the ripening enzymes; tomatoes stay green at 4 °C and get chilling injury.') },
  ripening_needs_sun: { wrong: tr('Meyve olgunlaşmak için güneş ışığına ihtiyaç duyar.', 'Fruit needs sunlight to ripen.'), right: tr('Toplanmış domates karanlık torbada da olgunlaşır; olgunlaşmayı etilen ve sıcaklık yönetir.', 'Picked tomatoes ripen in a dark bag too; ethylene and temperature drive ripening.') },
  digestion_only_stomach: { wrong: tr('Sindirim midede olur; yemek orada erir, biter.', 'Digestion happens in the stomach; food melts there and that’s it.'), right: tr('Nişasta ağızda başlar; yağ midede hiç sindirilmez. Sindirimin çoğu ve emilim ince bağırsakta olur.', 'Starch starts in the mouth; fat isn’t digested in the stomach at all. Most digestion and absorption happen in the small intestine.') },
  bile_is_enzyme: { wrong: tr('Safra, yağı parçalayan bir enzimdir.', 'Bile is an enzyme that breaks down fat.'), right: tr('Safra enzim değildir; yağı damlacıklara ayırır (emülsiyon). Yağı lipaz enzimi parçalar.', 'Bile is not an enzyme; it breaks fat into droplets (emulsion). The enzyme lipase splits the fat.') },
  water_climbs_by_suction: { wrong: tr('Su ince boruda havanın emmesiyle yükselir.', 'Water rises in a thin tube because the air sucks it up.'), right: tr('Su camdaki polar yüzeye tutunur (adezyon) ve kendi moleküllerini peşinden çeker (kohezyon); boru inceldikçe daha yükseğe çıkar.', 'Water clings to the polar glass (adhesion) and pulls its own molecules along behind (cohesion); the thinner the tube, the higher it climbs.') },
  soap_makes_stickier: { wrong: tr('Sabun suyu daha yapışkan yapar.', 'Soap makes water stickier.'), right: tr('Sabun yüzeydeki hidrojen bağlarının etkisini azaltır: yüzey gerilimi düşer, ataş batar, damla yayılır.', 'Soap weakens the hydrogen bonding at the surface: tension drops, the clip sinks, the drop spreads.') },
  heat_sets_yogurt: { wrong: tr('Yoğurdu sıcaklık koyulaştırır; süt ne kadar sıcaksa o kadar iyi tutar.', 'Heat is what thickens yogurt; the hotter the milk, the better it sets.'), right: tr('Yoğurdu bakteriler yapar: laktozu laktik aside çevirirler, asit sütü pıhtılaştırır. 70 °C bakterileri öldürür.', 'Bacteria make yogurt: they turn lactose into lactic acid, and the acid curdles the milk. At 70 °C the bacteria die.') },
  ozone_hole_warming: { wrong: tr('Küresel ısınmanın nedeni ozon deliğinden giren güneş ışığıdır.', 'Global warming is caused by sunlight coming in through the ozone hole.'), right: tr('Isınma, CO₂ gibi gazların yeryüzünün yaydığı ısıyı (kızılötesi) tutmasındandır. Ozon deliği ayrı bir sorundur.', 'Warming comes from gases like CO₂ holding in the heat (infrared) the ground gives off. The ozone hole is a separate problem.') },
  plants_no_respiration: { wrong: tr('Bitkiler yalnız CO₂ alır, hiç CO₂ vermez.', 'Plants only take in CO₂; they never give it out.'), right: tr('Bitkiler gece gündüz solunum yapıp CO₂ verir; ışıkta fotosentez bundan fazlasını alır.', 'Plants respire day and night and give out CO₂; in light, photosynthesis takes in more than that.') },
  cloudy_oil_spoiled: { wrong: tr('Buzdolabında bulanıklaşan zeytinyağı bozuk ya da hilelidir.', 'Olive oil that goes cloudy in the fridge is spoiled or fake.'), right: tr('Zeytinyağı çoğunlukla tekli doymamış yağdır ve soğukta bulanıklaşır; ısınınca yine berraklaşır.', 'Olive oil is mostly monounsaturated fat and clouds in the cold; it clears again when it warms.') },
  plants_use_air_n2: { wrong: tr('Bitkiler havadaki azotu yapraklarıyla doğrudan alır.', 'Plants take nitrogen straight from the air through their leaves.'), right: tr('Bitkiler N₂ gazını kullanamaz; azotu kökleriyle amonyum ve nitrat olarak alır. Havadaki azotu yalnız bazı bakteriler bağlar.', 'Plants can’t use N₂ gas; they take nitrogen up through their roots as ammonium and nitrate. Only some bacteria can fix nitrogen from the air.') },
  more_fertiliser_better: { wrong: tr('Gübre ne kadar çok olursa ürün o kadar çok olur.', 'The more fertiliser, the bigger the harvest.'), right: tr('Bitkinin alamadığı nitrat yağmurla kuyulara ve göllere akar, suyu kirletir ve yosun patlamasına yol açar.', 'Nitrate the plants can’t take up washes into wells and lakes, polluting the water and feeding algal blooms.') },
  spinach_tea_iron: { wrong: tr('Ispanakta çok demir var; bol ıspanak yiyen demir eksikliği çekmez.', 'Spinach is full of iron, so anyone who eats plenty of it can’t run short.'), right: tr('Bitkisel demirin azı emilir; yemekle içilen çay emilimi daha da düşürür, C vitamini artırır.', 'Only a little plant iron gets absorbed; tea with meals lowers that further, and vitamin C raises it.') },
  vitamin_more_better: { wrong: tr('Vitaminin fazlası zarar vermez, vücut fazlasını atar.', 'Extra vitamins can’t hurt; the body gets rid of the excess.'), right: tr('Suda çözünen vitaminlerin fazlası idrarla atılır, ama yağda çözünen A ve D vücutta birikip zehirlenme yapabilir.', 'The excess of water-soluble vitamins leaves in urine, but fat-soluble A and D build up in the body and can poison.') },
  milk_enough_bones: { wrong: tr('Kemiklerin sağlamlığı için bol süt içmek yeter.', 'Drinking plenty of milk is enough for strong bones.'), right: tr('Kalsiyumun bağırsaktan emilmesi için D vitamini gerekir; D vitaminini de deri güneşte yapar.', 'Calcium can only be absorbed from the gut with vitamin D, and the skin makes vitamin D in sunlight.') },
  salt_clogs: { wrong: tr('Tuz damarlarda birikip onları tıkar.', 'Salt builds up in the blood vessels and blocks them.'), right: tr('Tuz vücutta su tutarak kan hacmini ve basıncı artırır.', 'Salt makes the body hold on to water, which raises blood volume and pressure.') },
  no_symptom_ok: { wrong: tr('Belirti vermeyen bir hastalık zararsızdır.', 'An illness with no symptoms is harmless.'), right: tr('Yüksek tansiyon çoğu zaman belirti vermeden damarlara, kalbe ve böbreklere zarar verir.', 'High blood pressure usually harms the vessels, heart and kidneys without any symptoms.') },
  veins_high: { wrong: tr('Toplardamarlardaki basınç atardamarlardakinden yüksektir.', 'The pressure in veins is higher than in arteries.'), right: tr('Basınç en yüksek atardamarlarda, en düşük toplardamarlardadır.', 'Pressure is highest in the arteries and lowest in the veins.') },
  energy_all_up: { wrong: tr('Besin zincirinde enerji bir basamaktan ötekine aynen geçer.', 'In a food chain, energy passes unchanged from one level to the next.'), right: tr('Her basamakta enerjinin çoğu ısı olarak kaybolur; kabaca onda biri üste geçer.', 'At every level most of the energy is lost as heat; roughly a tenth passes up.') },
  spray_pests_only: { wrong: tr('Böcek ilacı yalnızca zararlı böcekleri öldürür.', 'Insecticide kills only the pest insects.'), right: tr('İlaç zararlıyla birlikte avcı böcekleri, parazit arıları ve tozlayıcıları da öldürür.', 'Spray kills the hunters, the parasitic wasps and the pollinators along with the pests.') },
  predator_harm: { wrong: tr('Avcı böcekler de tarlanın zararlısıdır.', 'Predatory insects are pests of the field too.'), right: tr('Uğur böceği, örümcek ve parazit arılar zararlıları yiyerek ürünü korur.', 'Ladybirds, spiders and parasitic wasps protect the crop by eating the pests.') },
  center_graft: { wrong: tr('Aşıda kalem anacın tam ortasına oturtulmalıdır.', 'In a graft the scion should sit dead centre on the rootstock.'), right: tr('Kambiyumlar değmelidir; kalem inceyse bir yana kaydırılır.', 'The cambium layers must touch; a thinner scion is set to one side.') },
  seed_clone: { wrong: tr('Tohum, ana ağacın tıpatıp kopyasıdır.', 'A seed is an exact copy of its parent tree.'), right: tr('Tohum eşeyli üremeyle oluşur ve iki ebeveynin genlerini taşır.', 'A seed comes from sexual reproduction and carries the genes of two parents.') },
  fruit_shows_cross: { wrong: tr('Yabancı polen kabağı daha o yıl değiştirir.', 'Foreign pollen changes the squash the same year.'), right: tr('Tozlanan çiçeğin meyvesi anne bitkinin dokusudur; karışma tohumlarda saklıdır ve bir kuşak sonra görünür.', 'The fruit of a pollinated flower is the mother plant’s tissue; the cross hides in the seeds and shows one generation later.') },
  hybrid_breeds_true: { wrong: tr('Melez (F1) tohumdan alınan tohum da aynı bitkiyi verir.', 'Seed saved from a hybrid (F1) plant gives the same plant again.'), right: tr('Melezin tohumları ayrışır: ertesi kuşakta bitkiler birbirinden farklı çıkar.', 'A hybrid’s seeds split apart: the next generation’s plants come out different from one another.') },
  rust_is_iron: { wrong: tr('Yapraklardaki turuncu pas, demirin paslanması gibi cansız bir tozdur.', 'The orange rust on the leaves is a lifeless dust, like rusting iron.'), right: tr('Turuncu toz bir mantarın sporlarıdır; mantar yaprağın içinde yaşar ve canlı hücrelerden beslenir.', 'The orange dust is a fungus’s spores; the fungus lives inside the leaf and feeds on its living cells.') },
  spray_only: { wrong: tr('Bitki hastalığına karşı tek çare sık sık ilaçlamaktır.', 'The only answer to a plant disease is frequent spraying.'), right: tr('Çeşit karışımı, ekim nöbeti ve ölçülü gübre hastalığı ilaçsız da yavaşlatır; ilaç ancak gerektiğinde kullanılır.', 'Variety mixtures, crop rotation and moderate fertiliser slow disease without spraying; a spray is used only when needed.') },
  compost_rot_bad: { wrong: tr('Her kompost kokar; kötü koku iyi çürüdüğünü gösterir.', 'All compost smells; a bad smell shows it is rotting well.'), right: tr('İyi kompost havalıdır ve orman toprağı gibi kokar; kötü koku havasızlığın ve fazla ıslaklığın işaretidir.', 'Good compost is airy and smells like forest soil; a bad smell is a sign of too little air and too much wet.') },
  heat_from_sun: { wrong: tr('Kompost yığınını güneş ısıtır.', 'The sun heats a compost heap.'), right: tr('Isıyı mikropların oksijenli solunumu üretir; bu yüzden yığının içi dışından sıcaktır.', 'The heat comes from the microbes’ aerobic respiration; that’s why the inside of the heap is hotter than the outside.') },
  clone_safe: { wrong: tr('Bütün bitkilerin genetik olarak aynı olması hep avantajdır.', 'It is always an advantage for all the plants to be genetically identical.'), right: tr('Genetik çeşitlilik hastalıklara ve değişen koşullara karşı güvencedir.', 'Genetic diversity is insurance against disease and changing conditions.') },
  bubble_cell: { wrong: tr('Mikroskopta görülen kalın siyah kenarlı yuvarlaklar hücredir.', 'The round shapes with thick black rims under the microscope are cells.'), right: tr('Onlar hava kabarcığıdır; hücreler soluktur ve boyanmış bir çekirdek taşır.', 'They are air bubbles; cells are pale and have a stained nucleus.') },
  plant_only_cells: { wrong: tr('Hücreler yalnızca bitkilerde vardır (ya da yalnızca hayvanlarda).', 'Only plants are made of cells (or only animals).'), right: tr('Bütün canlılar bir ya da daha çok hücreden oluşur.', 'All living things are made of one or more cells.') },
  green_plant: { wrong: tr('Her bitki hücresinde kloroplast vardır.', 'Every plant cell has chloroplasts.'), right: tr('Kloroplast yalnızca ışık alan, fotosentez yapan hücrelerde bulunur.', 'Only cells that get light and photosynthesise have chloroplasts.') },
  nucleus_makes: { wrong: tr('Proteinleri çekirdek yapar.', 'The nucleus makes the proteins.'), right: tr('Çekirdek tarifi saklar; proteinleri ribozomlar yapar.', 'The nucleus keeps the recipe; ribosomes make the proteins.') },
  energy_lost: { wrong: tr('Yanan besinin enerjisinin bir kısmı yok olur.', 'Some of the energy in burning food disappears.'), right: tr('Enerji yok olmaz; ölçemediğimiz kısmı ısı olarak havaya dağılır.', 'Energy doesn’t disappear; the part we can’t measure spreads into the air as heat.') },
  stomach_burns: { wrong: tr('Besinin enerjisi midede, sindirilirken açığa çıkar.', 'Food’s energy is released in the stomach, as it is digested.'), right: tr('Sindirim besini küçük moleküllere ayırır; enerji hücrelerde, mitokondride açığa çıkar.', 'Digestion breaks food into small molecules; the energy is released in cells, in the mitochondria.') },
  food_is_energy: { wrong: tr('Enerji besinden olduğu gibi kana ve kaslara geçer.', 'Energy passes from food straight into the blood and muscles.'), right: tr('Enerji besinin kimyasal bağlarındadır; hücresel solunum onu ATP’ye aktarır.', 'The energy is in the food’s chemical bonds; cellular respiration passes it on to ATP.') },
  sugar_best: { wrong: tr('Uzun yürüyüş için en iyi enerji şekerdir.', 'Sugar is the best energy for a long walk.'), right: tr('Şeker çabuk yükselip çabuk biter; uzun iş için yağ ve nişasta da gerekir.', 'Sugar rises fast and runs out fast; long work needs fat and starch too.') },
  breath_cools: { wrong: tr('Soluduğumuz oksijen vücudu serinletmek içindir.', 'The oxygen we breathe is there to cool the body.'), right: tr('Oksijen, hücresel solunumda besinden enerji çıkarmak için kullanılır.', 'Oxygen is used in cellular respiration to release energy from food.') },
  owl_omen: { wrong: tr('Baykuş uğursuzdur; konduğu eve kötülük getirir.', 'Owls bring bad luck to the house they perch on.'), right: tr('Baykuş gece avlanan bir kuştur; çiftçinin fare avcısıdır.', 'The owl is a bird that hunts at night: the farmer’s mouse-catcher.') },
  see_dark: { wrong: tr('Baykuş zifiri karanlıkta gözüyle görür.', 'Owls see with their eyes in pitch darkness.'), right: tr('Zifiri karanlıkta kulağıyla avlanır; gözü loş ışıkta iyi görür.', 'In pitch darkness it hunts by ear; its eyes are good in dim light.') },
  poison_safe: { wrong: tr('Fare zehri yalnızca fareleri öldürür.', 'Rat poison only kills rats and mice.'), right: tr('Zehirli fareyi yiyen baykuş, kedi ve köpek de zehirlenir.', 'The owl, cat or dog that eats a poisoned mouse is poisoned too.') },
  mice_gone: { wrong: tr('Zehirle fareler tamamen biter.', 'Poison finishes the mice off for good.'), right: tr('Fareler çok hızlı çoğalır; avcıları ölünce sayıları artar.', 'Mice breed very fast; when their hunters die, their numbers grow.') },
  more_well: { wrong: tr('Solan bitkiye her zaman daha çok su gerekir.', 'A wilting plant always needs more water.'), right: tr('Toprak ıslakken solma varsa suyun kendisine bak: tuzlu su bitkiyi susuz bırakır.', 'If a plant wilts in wet soil, look at the water itself: salty water leaves a plant thirsty.') },
  more_fert: { wrong: tr('Solgun bitki gübreyle düzelir.', 'Fertiliser cures a wilting plant.'), right: tr('Gübre de bir tuzdur; tuzlu toprakta durumu kötüleştirir.', 'Fertiliser is a salt too; in salty soil it makes things worse.') },
  salt_poison: { wrong: tr('Tuz bitkiyi yalnızca zehirleyerek öldürür.', 'Salt kills a plant only by poisoning it.'), right: tr('Tuzun ilk etkisi osmotiktir: kök hücreleri su kaybeder.', 'Salt’s first effect is osmotic: the root cells lose water.') },
  boil_salt: { wrong: tr('Kaynatmak suyun tuzunu giderir.', 'Boiling takes the salt out of water.'), right: tr('Kaynayan su buharlaşır, tuz geride kalır; su daha da tuzlanır.', 'Boiling water evaporates and the salt stays behind; the water gets saltier.') },
  o2_percent: { wrong: tr('Dağ havasında oksijenin oranı daha azdır.', 'Mountain air has a smaller share of oxygen.'), right: tr('Oran her yerde yaklaşık %21; yüksekte azalan, havanın basıncıdır.', 'The share is about 21% everywhere; what falls with height is the air pressure.') },
  cold_breath: { wrong: tr('Yaylada nefes nefese kalmanın sebebi soğuktur.', 'Being out of breath on the yayla is caused by the cold.'), right: tr('Sebep düşük basınç: kana daha az oksijen geçer.', 'The cause is low pressure: less oxygen gets into the blood.') },
  altitude_ill: { wrong: tr('Yüksekte nabzı hızlanan kişi hastadır.', 'Anyone whose pulse speeds up at altitude is ill.'), right: tr('Nabız ve solunumun hızlanması vücudun normal dengeleme yanıtıdır.', 'A faster pulse and breathing are the body’s normal balancing response.') },
  lungs_grow: { wrong: tr('Yaylada yaşayanların akciğerleri büyür.', 'People who live on the yayla grow bigger lungs.'), right: tr('Yetişkinde değişen akciğer değil, kandaki alyuvar sayısıdır.', 'In an adult it is not the lungs that change but the number of red cells.') },
  habit_only: { wrong: tr('Yüksekliğe alışmak yalnızca bir alışkanlıktır; vücut değişmez.', 'Getting used to altitude is just habit; the body doesn’t change.'), right: tr('Vücut gerçekten değişir: hematokrit yükselir.', 'The body really changes: the haematocrit rises.') },
  rush_up: { wrong: tr('Yükseğe hızlı çıkan daha çabuk alışır.', 'Climbing fast helps you adapt faster.'), right: tr('Yavaş çıkmak gerekir; uyum haftalar sürer.', 'You must climb slowly; adapting takes weeks.') },
  drink_oxygen: { wrong: tr('Bazı içecekler kana oksijen katar.', 'Some drinks add oxygen to the blood.'), right: tr('Kana oksijen yalnızca akciğerden girer.', 'Oxygen enters the blood only through the lungs.') },
  all_sun: { wrong: tr('Bütün canlılar enerjisini güneşten alır.', 'Every living thing gets its energy from the sun.'), right: tr('Kemosentez yapan bakteriler enerjiyi H₂S gibi kimyasallardan alır.', 'Chemosynthetic bacteria get their energy from chemicals such as H₂S.') },
  heat_food: { wrong: tr('Bazı bakteriler ısıyı besin olarak kullanır.', 'Some bacteria use heat as food.'), right: tr('Isı besin değildir; enerji kimyasal bir tepkimeden gelir.', 'Heat is not food; the energy comes from a chemical reaction.') },
  heat_bleach: { wrong: tr('Pınarın her yerinde aynı canlılar yaşar; sıcak rengini soldurur.', 'The same living things live all along the spring; the heat just bleaches them.'), right: tr('Her sıcaklık bandında başka canlılar yaşar.', 'Each temperature band has its own living things.') },
  no_light_spring: { wrong: tr('Kaynağın yanında yeşil yok, çünkü ışık az.', 'There is no green near the vent because there is too little light.'), right: tr('Işık her yerde aynı; yeşili sınırlayan sıcaklık.', 'The light is the same everywhere; temperature is what limits the green.') },
  spring_poison: { wrong: tr('Kükürtlü pınarın renkleri zehirden gelir.', 'The colours of a sulphur spring come from poison.'), right: tr('Renkler, sıcaklığa göre dizilmiş canlı topluluklarıdır.', 'The colours are living communities sorted by temperature.') },
  soap_ok: { wrong: tr('Pınara sabun ya da deterjan dökmek zararsızdır.', 'Pouring soap or detergent into the spring does no harm.'), right: tr('Deterjan örtüleri bozar ve aşağıda alg patlaması yapar.', 'Detergent spoils the mats and causes an algal bloom downstream.') },
  hot_lifeless: { wrong: tr('Çok sıcak suda hiçbir şey yaşamaz.', 'Nothing can live in very hot water.'), right: tr('Sıcak pınarlarda bakteriler ve arkeler yaşar.', 'Bacteria and archaea live in hot springs.') },
  bloat_water: { wrong: tr('Şişkinlik çok su içmekten olur.', 'Bloat comes from drinking too much water.'), right: tr('Gaz köpüğe hapsolur, inek geğiremez.', "Gas gets trapped in foam, so the cow can't burp.") },
  bloat_poison: { wrong: tr('Yonca zehirlidir.', 'Clover is poisonous.'), right: tr('Sorun miktar ve hız: aç inek, ıslak yonca.', 'The problem is how much, how fast: a hungry cow on wet clover.') },
  bloat_worms: { wrong: tr('Ani şişkinliği kurtlar yapar.', 'Sudden bloat is caused by worms.'), right: tr('Ani şişkinlik işkembedeki mayalanmadan olur.', 'Sudden bloat comes from fermentation in the rumen.') },
  plan_never: { wrong: tr('Yonca hiç verilmemeli.', 'Clover should never be fed.'), right: tr('Yavaş yavaş alıştırarak verilir.', 'It is introduced gradually.') },
  plan_immune: { wrong: tr('Şişkinlik geçiren inek bağışıklık kazanır.', 'A cow that had bloat becomes immune.'), right: tr('Şişkinlik enfeksiyon değil; tekrar olabilir.', "Bloat isn't an infection; it can happen again.") },
  plan_wet: { wrong: tr('Islak yonca daha güvenlidir.', 'Wet clover is safer.'), right: tr('Islak, çiyli yonca riski artırır.', 'Wet, dewy clover raises the risk.') },
  four_stomachs: { wrong: tr('İneğin dört ayrı midesi var.', 'A cow has four separate stomachs.'), right: tr('Tek mide, dört bölme.', 'One stomach, four compartments.') },
  one_chamber: { wrong: tr('İneğin midesi bizimki gibi tek bölmelidir.', "A cow's stomach has one chamber, like ours."), right: tr('Dört bölmeli: işkembe, börkenek, kırkbayır, şirden.', 'Four compartments: rumen, reticulum, omasum, abomasum.') },
  all_acid: { wrong: tr('Dört bölmenin hepsi asit salgılar.', 'All four compartments make acid.'), right: tr('Yalnızca şirden asit ve enzim salgılar.', 'Only the abomasum makes acid and enzymes.') },
  teeth_only: { wrong: tr('Köpekle inek arasındaki fark sadece dişlerdedir.', 'The only difference between a dog and a cow is the teeth.'), right: tr('Asıl fark mide yapısında ve mikroplarda.', 'The real difference is stomach structure and microbes.') },
  size_only: { wrong: tr('Fark sadece mide büyüklüğüdür.', "The only difference is the stomach's size."), right: tr('Yapı farklı: bölmeler ve mayalanma odası.', 'The structure differs: compartments and a fermentation chamber.') },
  dog_cellulose: { wrong: tr('Köpek selülozu yavaşça sindirir.', 'Dogs digest cellulose slowly.'), right: tr('Hayvanlar selülozu kendi enzimleriyle parçalayamaz; mikroplar parçalar.', "Animals can't break cellulose with their own enzymes; microbes do it.") },
  soil_food: { wrong: tr('Bitkiler toprağı yiyerek büyür.', 'Plants grow by eating soil.'), right: tr('Kuru kütlenin çoğu havadaki CO₂’den gelir.', 'Most dry mass comes from CO₂ in the air.') },
  water_only: { wrong: tr('Bitkinin kütlesi sadece sudan gelir.', "A plant's mass comes only from water."), right: tr('Karbon havadaki CO₂’den gelir.', 'The carbon comes from CO₂ in the air.') },
  light_mass: { wrong: tr('Işık bitkide maddeye dönüşür.', 'Light turns into matter in a plant.'), right: tr('Işık enerji verir; madde CO₂ ve sudan gelir.', 'Light gives energy; the matter comes from CO₂ and water.') },
  light_old: { wrong: tr('Yaşlı yapraklar ışıksızlıktan sararır.', 'Old leaves yellow for lack of light.'), right: tr('Azot yaşlı yapraktan genç yaprağa taşınır.', 'Nitrogen is moved from old leaves to young ones.') },
  water_leaf: { wrong: tr('Alt yapraklar susuzluktan sararır.', 'Lower leaves yellow from thirst.'), right: tr('Azot eksikliğinde önce yaşlı yapraklar sararır.', 'With too little nitrogen, old leaves yellow first.') },
  young_nochl: { wrong: tr('Genç yaprakların klorofile ihtiyacı yoktur.', "Young leaves don't need chlorophyll."), right: tr('Bitki azotu büyüyen yapraklara öncelikle verir.', 'The plant gives nitrogen to growing leaves first.') },
  algae_poison: { wrong: tr('Balıkları algler zehirledi.', 'The algae poisoned the fish.'), right: tr('Ölen algleri çürüten ayrıştırıcılar oksijeni tüketti.', 'Decomposers rotting dead algae used up the oxygen.') },
  heat: { wrong: tr('Balıklar sıcaktan öldü.', 'The fish died from heat.'), right: tr('Oksijeni tüketen ayrıştırıcılardı.', 'Decomposers used up the oxygen.') },
  hunger: { wrong: tr('Balıklar açlıktan öldü.', 'The fish starved.'), right: tr('Balıklar oksijensizlikten boğuldu.', 'The fish suffocated without oxygen.') },
  acid_metal: { wrong: tr('Mide asidi yutulan çiviyi eritir.', 'Stomach acid dissolves a swallowed nail.'), right: tr('Çivi börkenekte kalır; asit salgılayan bölme şirdendir ve metali kolayca eritmez.', 'The nail stays in the reticulum; acid is made in the abomasum and doesn’t easily dissolve metal.') },
  cow_iron: { wrong: tr('İnek demire ihtiyacı olduğu için çivi yer.', 'A cow eats nails because it needs iron.'), right: tr('İnek yemi ayıklamadan yutar; metal kazayla gider.', 'A cow gulps its feed without sorting it; the metal goes down by accident.') },
  starve_cow: { wrong: tr('Aç bırakılan inek ne yediğine dikkat eder.', 'A hungry cow is more careful about what it eats.'), right: tr('Aç inek daha hızlı ve seçmeden yer; çare yemi metalden temizlemektir.', 'A hungry cow eats faster and less carefully; the answer is feed free of metal.') },
  magnet_out: { wrong: tr('Yutturulan mıknatıs bir süre sonra çıkarılmalıdır.', 'A swallowed magnet must be taken out after a while.'), right: tr('Mıknatıs ömür boyu börkenekte kalır ve zarar vermez.', 'The magnet stays in the reticulum for life and does no harm.') },
  seed_light: { wrong: tr('Tohum çimlenmek için ışığa ihtiyaç duyar.', 'A seed needs light to germinate.'), right: tr('Bezelye gibi çoğu tohum karanlıkta da çimlenir; ışığa fide ihtiyaç duyar.', 'Most seeds, like peas, germinate in the dark too; it is the seedling that needs light.') },
  water_more: { wrong: tr('Su ne kadar çoksa tohum o kadar iyi çimlenir.', 'The more water, the better a seed germinates.'), right: tr('Su altındaki tohum oksijensiz kalır ve boğulur.', 'A seed under water runs out of oxygen and drowns.') },
  seed_soil: { wrong: tr('Tohum çimlenmek için topraktaki besine muhtaçtır.', 'A seed needs food from the soil to germinate.'), right: tr('Çimlenen tohum çeneklerindeki depo besini kullanır.', 'A germinating seed lives on the food stored in its cotyledons.') },
  seed_immortal: { wrong: tr('Kuru tohum kavanozda sonsuza dek canlı kalır.', 'A dry seed stays alive in a jar forever.'), right: tr('Tohum depoda da yavaş yavaş yaşlanır; canlılığı yıllar içinde düşer.', 'Seeds age slowly even in storage; their viability falls over the years.') },
  seed_throw: { wrong: tr('Az çimlenen eski tohum atılmalıdır.', 'Old seed that germinates poorly should be thrown away.'), right: tr('Az çimlenen tohum ekilip yetiştirilir ve taze tohumla yenilenir; genleri kaybolmaz.', 'Poorly germinating seed is sown, grown and renewed with fresh seed, so its genes are not lost.') },
  one_lot: { wrong: tr('Yalnızca en kötü kavanozu yenilemek yeter.', 'Renewing only the worst jar is enough.'), right: tr('Sınırın (%85) altındaki her kavanoz yenilenir.', 'Every jar below the line (85%) is renewed.') },
  yeast_chem: { wrong: tr('Maya canlı değil, bir kimyasaldır.', 'Yeast isn’t alive; it’s a chemical.'), right: tr('Maya tek hücreli bir mantardır.', 'Yeast is a single-celled fungus.') },
  air_knead: { wrong: tr('Hamurdaki kabarcıklar yoğururken giren havadır.', 'The bubbles in dough are air worked in by kneading.'), right: tr('Kabarcıkları mayanın ürettiği CO₂ şişirir.', 'CO₂ made by the yeast blows up the bubbles.') },
  more_yeast: { wrong: tr('Hamur kabarmazsa daha çok maya koymak yeter.', 'If dough won’t rise, just add more yeast.'), right: tr('Maya ölmüşse ne kadar koysan da gaz çıkmaz.', 'If the yeast is dead, no amount of it makes gas.') },
  alcohol_stays: { wrong: tr('Ekmekte mayalanmadan kalan çok alkol vardır.', 'Bread holds a lot of alcohol left from fermentation.'), right: tr('Alkol fırında buharlaşıp gider.', 'The alcohol evaporates in the oven.') },
  no_alcohol: { wrong: tr('Maya mayalanmada alkol üretmez.', 'Yeast makes no alcohol when it ferments.'), right: tr('Alkol fermantasyonunun ürünleri etil alkol ve CO₂’dir.', 'Alcoholic fermentation makes ethyl alcohol and CO₂.') },
  yeast_o2: { wrong: tr('Maya alkolü oksijenle yakıp yok eder.', 'Yeast burns up the alcohol with oxygen.'), right: tr('Hamurda oksijen azdır; alkolü fırının sıcağı uçurur.', 'There is little oxygen in dough; the oven’s heat drives the alcohol off.') },
  red_low: { wrong: tr('Kırmızı ışıkta fotosentez en yavaştır.', 'Photosynthesis is slowest in red light.'), right: tr('Klorofil kırmızıyı iyi emer; en yavaş yeşilde.', 'Chlorophyll absorbs red well; it is slowest in green.') },
  blue_none: { wrong: tr('Bitkiler mavi ışığı kullanamaz.', "Plants can't use blue light."), right: tr('Mavi en iyi emilen renklerden biridir.', 'Blue is one of the best-absorbed colours.') },
  color_none: { wrong: tr('Işığın rengi fotosentezi etkilemez.', "Light colour doesn't affect photosynthesis."), right: tr('Soğurulan renk hızı belirler.', 'The colour absorbed sets the rate.') },
  blend_lost: { wrong: tr('Çekinik özellik bir kuşakta kaybolur.', 'A recessive trait is lost in one generation.'), right: tr('Çekinik alel saklanır, F2’de yeniden görünür.', 'The recessive allele hides and reappears in F2.') },
  pollen_fail: { wrong: tr('F1 yuvarlaksa buruşuk polen işe yaramamıştır.', 'If F1 is round, the wrinkled pollen failed.'), right: tr('Polen işe yaradı; F1’in hepsi Rr.', 'The pollen worked; every F1 is Rr.') },
  blending: { wrong: tr('Özellikler karışarak kalıtılır.', 'Traits are inherited by blending.'), right: tr('Aleller karışmaz, çiftler hâlinde taşınır.', "Alleles don't blend; they are carried in pairs.") },
  broken: { wrong: tr('Oran tam 3:1 değilse deney bozuktur.', "If the ratio isn't exactly 3:1, the experiment failed."), right: tr('Şans sapma yapar; çok sayınca 3:1’e yaklaşır.', 'Chance causes scatter; big counts approach 3:1.') },
  viability: { wrong: tr('Sapmanın tek sebebi buruşukların ölmesidir.', 'The only reason for scatter is wrinkled seeds dying.'), right: tr('Asıl sebep örneklem büyüklüğü ve şans.', 'The main reason is sample size and chance.') },
  mendel_wrong: { wrong: tr('Mendel yanlış saymıştır.', 'Mendel miscounted.'), right: tr('Sapma olasılıktan gelir.', 'The scatter comes from probability.') },
};

// ================================================================ question bank
const QS = {
  bloat_dx: { case: 'bloat', code: 'BİY.10.1.9', who: 'riza',
    prompt: tr('Sarıkız’ın sol böğrü davul gibi şişmiş. Dün gece yağmurdan sonra ıslak, taze yoncalığa salınmış. Merceğinde işkembede köpük gördün. Ne oluyor?', "Sarıkız's left flank is swollen like a drum. Last night, after the rain, she was let onto wet, fresh clover. Through the lens you saw foam in her rumen. What is happening?"),
    options: [
      { t: tr('Çok su içti; midesi suyla doldu.', 'She drank too much water and her stomach filled up.'), tag: 'bloat_water', fb: tr('Su işkembeden geçip gider, böğrü böyle şişirmez. Merceğinde gördüğün şey su değil, köpüktü.', "Water passes on through; it doesn't blow up the flank like this. What you saw through the lens wasn't water, it was foam.") },
      { t: tr('Taze yonca işkembede köpüklü bir mayalanma yaptı; gaz kabarcıklara hapsoldu, geğiremiyor.', "Fresh clover fermented into a froth in the rumen. The gas is trapped in bubbles and she can't burp."), ok: true },
      { t: tr('Yonca zehirli; Sarıkız zehirlendi.', 'Clover is poisonous; Sarıkız has been poisoned.'), tag: 'bloat_poison', fb: tr('Sarıkız yıllardır yonca yiyor. Sorun yoncanın kendisi değil: aç karnına, bir anda ve ıslakken çok yemesi.', "Sarıkız has eaten clover for years. The clover itself isn't the problem; eating lots of it at once, hungry and wet, is.") },
      { t: tr('Bağırsaklarında kurt var.', 'She has worms in her gut.'), tag: 'bloat_worms', fb: tr('Parazitler ineği hasta edebilir ama bir gecede böyle şişirmez. Merceğinde işkembeyi gördün: sorun orada.', "Parasites can make a cow ill, but not swell up overnight like this. You saw the rumen through your lens: that's where the problem is.") },
    ],
    explain: tr('Doğru. Taze baklagiller işkembede çok hızlı mayalanır ve içlerindeki maddeler kabarcıkları dağılmayan bir köpüğe hapseder. İnek gazı geğirerek atamaz. İşkembe sol tarafta olduğu için sol böğür şişer. Buna köpüklü şişkinlik denir.', "Correct. Fresh legumes ferment very fast in the rumen, and substances in them lock the bubbles into a stable foam. The cow can't burp the gas out. The rumen is on the left, so the left flank swells. This is called frothy bloat.") },
  bloat_plan: { case: 'bloat', code: 'BİY.10.1.5', who: 'riza',
    prompt: tr('Sarıkız iyileşti. Rıza Dede onu yine yoncaya salmak istiyor. En güvenli plan hangisi?', 'Sarıkız is better. Rıza Dede wants to let her back onto the clover. Which plan is safest?'),
    options: [
      { t: tr('Bir daha hiç yonca yemesin, sadece kuru saman.', 'No more clover ever, only dry straw.'), tag: 'plan_never', fb: tr('Yonca değerli bir yem: proteini bol, toprağa da azot kazandırır. Yasaklamak yerine alıştırmak gerek.', 'Clover is valuable feed: rich in protein, and it adds nitrogen to the soil. Get her used to it instead of banning it.') },
      { t: tr('Önce otla ya da samanla karnını doyursun; çiy kuruyunca yoncaya kısa süre çıksın, süreyi günden güne artırsın.', 'Fill her up on grass or hay first; once the dew dries, let her onto the clover for short spells, a little longer each day.'), ok: true },
      { t: tr('Bir kez geçirdi, bağışıklık kazandı; istediği kadar yesin.', 'She has had it once, so she is immune now. Let her eat as much as she likes.'), tag: 'plan_immune', fb: tr('Şişkinlik bir enfeksiyon değil; bağışıklık kazanılmaz. Aynı koşullarda yine olur.', "Bloat isn't an infection, so there's no immunity. Under the same conditions it will happen again.") },
      { t: tr('Yoncayı vermeden önce suya batırıp ıslatsın.', 'Soak the clover in water before feeding it.'), tag: 'plan_wet', fb: tr('Tam tersi: ıslak, çiyli yonca riski artırır.', 'The opposite: wet, dewy clover raises the risk.') },
    ],
    explain: tr('Doğru. İşkembedeki mikropların yeni yeme alışması zaman alır. Aç bir ineği bir anda taze, ıslak yoncaya salmak tehlikelidir. Ot ya da samanla karıştırıp yavaş yavaş vermek riski azaltır.', 'Correct. The microbes in the rumen need time to adjust to a new feed. Turning a hungry cow out onto fresh, wet clover all at once is dangerous. Mixing it with grass or hay and increasing it slowly lowers the risk.') },
  four_stomachs: { case: 'bloat', code: 'BİY.10.1.5', who: 'deniz',
    prompt: tr('Alp: “Ablam ineğin dört midesi olduğunu söyledi. Doğru mu?”', "Alp: 'My sister says a cow has four stomachs. Is that true?'"),
    options: [
      { t: tr('Evet: dört ayrı mide, dört ayrı organ.', 'Yes: four separate stomachs, four organs.'), tag: 'four_stomachs', fb: tr('Çok yaygın bir yanılgı! Merceğine bak: bölmeler birbirine açılıyor. Tek bir organın odaları gibi.', "A very common misconception! Look through your lens: the compartments open into each other, like the rooms of one organ.") },
      { t: tr('Hayır: tek mide var ama dört bölmeli. Bizimkine benzeyen asıl mide sonuncusu, şirden.', 'No: there is one stomach with four compartments. The last one, the abomasum, is the “true” stomach like ours.'), ok: true },
      { t: tr('Hayır: bizimki gibi tek bölmeli bir midesi var.', 'No: it has one chamber, like ours.'), tag: 'one_chamber', fb: tr('Merceğinde dört bölme gördün: işkembe, börkenek, kırkbayır, şirden.', 'You saw four compartments through your lens: rumen, reticulum, omasum, abomasum.') },
      { t: tr('Evet, ve dördü de asit salgılar.', 'Yes, and all four make acid.'), tag: 'all_acid', fb: tr('Sadece şirden asit ve sindirim enzimi salgılar. İşkembe mikroplar için bir mayalanma odasıdır.', 'Only the abomasum makes acid and digestive enzymes. The rumen is a fermentation chamber for microbes.') },
    ],
    explain: tr('Doğru. Geviş getirenlerin midesi dört bölmelidir: işkembe (rumen), börkenek (retikulum), kırkbayır (omasum) ve şirden (abomasum). İlk üçüne ön mide denir.', "Correct. A ruminant's stomach has four compartments: rumen, reticulum, omasum and abomasum. The first three are called the forestomach.") },
  dog_compare: { case: 'bloat', code: 'BİY.10.1.5', who: 'riza',
    prompt: tr('Rıza Dede: “Karabaş da bizim sofradan yer ama ot yiyemez. Sarıkız otla yaşar. Farkları ne?”', "Rıza Dede: 'Karabaş eats from our table too, but he can't live on grass. Sarıkız does. What's the difference?'"),
    options: [
      { t: tr('Köpeğin dişleri otu kesemez, fark bu kadar.', "The dog's teeth can't cut grass, that's all."), tag: 'teeth_only', fb: tr('Dişler bir fark, ama asıl fark içeride. Köpeğin midesinde ne vardı, ne yoktu?', "Teeth are one difference, but the big one is inside. What did the dog's stomach have, and what was missing?") },
      { t: tr('Köpeğin midesi tek bölmeli ve asitli; selülozu parçalayan mikroplar ve uzun bir mayalanma odası yok. İnekte bu işi işkembedeki mikroplar yapar.', "The dog's stomach has one acidic chamber and no fermentation chamber full of cellulose-breaking microbes. In the cow, the microbes in the rumen do that job."), ok: true },
      { t: tr('Köpeğin midesi daha küçük, o kadar.', "The dog's stomach is just smaller."), tag: 'size_only', fb: tr('Büyüklük değil, yapı önemli: bölmeler ve içindeki canlılar.', 'Structure matters, not size: the compartments and what lives inside them.') },
      { t: tr('Köpek de selülozu sindirir, sadece daha yavaş.', 'The dog digests cellulose too, just slower.'), tag: 'dog_cellulose', fb: tr('Hiçbir hayvan selülozu tek başına, kendi enzimleriyle parçalayamaz. İneğe bu işte mikroplar yardım eder.', 'No animal can break down cellulose with its own enzymes alone. The cow has microbes to help.') },
    ],
    explain: tr('Doğru. Etçillerin sindirim kanalı kısadır; midesi tek bölmeli ve asitlidir, et hızla sindirilir. Geviş getirenlerde işkembedeki bakteri, siliyalı ve mantarlar selülozu parçalar. İnek de mikropların ürettiği yağ asitleriyle beslenir.', 'Correct. Carnivores have a short gut with one acidic stomach chamber, and meat digests quickly. In ruminants, bacteria, ciliates and fungi in the rumen break down cellulose, and the cow lives on the fatty acids the microbes make.') },
  willow: { case: 'willow', code: 'BİY.10.1.3', who: 'player',
    prompt: tr('Söğüt beş yılda 74,40 kg kazandı. Toprak yalnızca 0,06 kg (60 g) kaybetti. Ağaca sadece yağmur suyu verildi. Söğüdün kütlesi nereden geldi?', 'In five years the willow gained 74.40 kg. The soil lost only 0.06 kg (60 g). The tree was given nothing but rainwater. Where did its mass come from?'),
    options: [
      { t: tr('Topraktan: ağaç toprağı yiyerek büyür.', 'From the soil: trees grow by eating soil.'), tag: 'soil_food', fb: tr('Tartı bunu çürüttü: toprak yalnızca 60 g kaybetti. O 60 g’ın çoğu mineral; gerekli ama kütlenin çok küçük bir kısmı.', "The scale ruled that out: the soil lost only 60 g. Most of those 60 g are minerals, which the tree needs but which are a tiny part of its mass.") },
      { t: tr('Yalnızca yağmur suyundan.', 'From the rainwater only.'), tag: 'water_only', fb: tr('Su gerçekten kullanılıyor. Ama odunun ana maddesi selüloz ve onun yapısında karbon var. Suda karbon yok. Karbon nereden geldi?', "Water really is used. But wood is mostly cellulose, and cellulose contains carbon. Water has no carbon. Where did the carbon come from?") },
      { t: tr('Havadaki karbondioksitten ve sudan: fotosentezle şekere, sonra selüloza dönüştü.', 'From carbon dioxide in the air, plus water: photosynthesis made sugar, and the sugar became cellulose.'), ok: true },
      { t: tr('Güneş ışığından: ışık maddeye dönüştü.', 'From sunlight: the light turned into matter.'), tag: 'light_mass', fb: tr('Işık enerji verir, madde vermez. Bu enerji CO₂ ve suyu şekere çevirmek için kullanılır.', 'Light gives energy, not matter. That energy is used to turn CO₂ and water into sugar.') },
    ],
    explain: tr('Doğru. 1640’larda Van Helmont da aynı deneyi yaptı ve “hepsi sudan” dedi, çünkü havadaki CO₂’yi bilmiyordu. Bugün biliyoruz: bitkinin kuru kütlesinin çoğu fotosentezle havadan tutulan karbondan yapılır.', "Correct. In the 1640s Van Helmont ran the same experiment and concluded 'it's all water', because he didn't know about CO₂ in the air. Today we know most of a plant's dry mass is built from carbon captured from the air by photosynthesis.") },
  nitrogen: { case: 'leaves', code: 'BİY.10.2.4', who: 'player',
    prompt: tr('B tarlasında önce alttaki yaşlı yapraklar sarardı, üstteki genç yapraklar hâlâ yeşil. Test azotun az olduğunu gösterdi. Neden önce yaşlı yapraklar?', 'In field B, the old lower leaves yellowed first while the young upper ones are still green. The test showed low nitrogen. Why the old leaves first?'),
    options: [
      { t: tr('Yaşlı yapraklar gölgede kalır, daha az ışık alır.', 'Old leaves are shaded and get less light.'), tag: 'light_old', fb: tr('Gölge etkili olabilir ama bu sararma azot testiyle bağlantılı. Azotun bitki içinde ne yaptığını düşün.', 'Shade can matter, but this yellowing goes with the nitrogen result. Think about what nitrogen does inside the plant.') },
      { t: tr('Azot bitkide yer değiştirebilir: bitki onu yaşlı yapraklardan söküp büyüyen genç yapraklara taşır.', 'Nitrogen can move inside the plant: it pulls it out of old leaves and sends it to young, growing ones.'), ok: true },
      { t: tr('Su önce alttaki yapraklardan buharlaşır.', 'Water evaporates from the lower leaves first.'), tag: 'water_leaf', fb: tr('Bu bahar yağmur boldu ve test azotu gösterdi. Susuzluk bütün bitkiyi soldururdu.', 'It rained a lot this spring, and the test pointed to nitrogen. Thirst would wilt the whole plant.') },
      { t: tr('Genç yaprakların klorofile ihtiyacı yok.', "Young leaves don't need chlorophyll."), tag: 'young_nochl', fb: tr('Genç yaprakların da klorofile ihtiyacı var; zaten bu yüzden yeşiller. Azotu kim aldı?', "Young leaves need chlorophyll too; that's why they're green. Who took the nitrogen?") },
    ],
    explain: tr('Doğru. Azot klorofilin ve proteinlerin yapısında bulunur. Azot azalınca bitki onu yaşlı yapraklardan genç yapraklara taşır ve yaşlı yapraklar önce sararır. Demir gibi yer değiştiremeyen besinlerin eksikliğinde ise önce genç yapraklar sararır.', 'Correct. Nitrogen is part of chlorophyll and proteins. When it runs short, the plant moves it from old leaves to young ones, so the old leaves yellow first. When a nutrient that cannot move, such as iron, is missing, the young leaves yellow first instead.') },
  eutro: { case: 'pond', code: 'BİY.10.2.6', who: 'player',
    prompt: tr('Gölette nitrat yüksek, algler patlamış, oksijen düşük ve dipte ölü balıklar var. Balıkları öldüren zincir hangisi?', 'The pond has high nitrate, an algal bloom, low oxygen and dead fish on the bottom. Which chain of events is killing the fish?'),
    options: [
      { t: tr('Algler balıkları zehirliyor.', 'The algae are poisoning the fish.'), tag: 'algae_poison', fb: tr('Bazı siyanobakteriler gerçekten zehir yapabilir. Ama senin testin oksijenin düştüğünü gösteriyor. Oksijen nereye gitti?', 'Some cyanobacteria really can make toxins, but your test shows the oxygen has dropped. Where did the oxygen go?') },
      { t: tr('Fazla besin → algler çoğalır → ölen algleri ayrıştırıcılar çürütür ve suyun oksijenini tüketir → balıklar boğulur.', 'Too many nutrients → algae multiply → decomposers rot the dead algae and use up the oxygen → fish suffocate.'), ok: true },
      { t: tr('Su çok ısındı, balıklar sıcaktan öldü.', 'The water got too warm and the fish died of heat.'), tag: 'heat', fb: tr('Ilık su daha az oksijen tutar, bu doğru. Ama termometre suyun aşırı sıcak olmadığını gösterdi. Oksijeni tüketen başka bir şey var.', "Warm water holds less oxygen, that's true, but the thermometer shows the water isn't very hot. Something else is using up the oxygen.") },
      { t: tr('Algler balıkların yiyeceğini bitirdi.', "The algae ate up the fish's food."), tag: 'hunger', fb: tr('Tersine: suda besin bol. Balıklar açlıktan değil, oksijensizlikten ölüyor.', "The opposite: the water is full of food. The fish aren't starving; they're short of oxygen.") },
    ],
    explain: tr('Doğru. Buna ötrofikasyon denir. Tarlalardan akan fazla gübre suyu besince zenginleştirir. Algler patlar, sonra ölür; onları çürüten ayrıştırıcılar suyun oksijenini tüketir.', 'Correct. This is eutrophication. Extra fertiliser washing off the fields enriches the water with nutrients. The algae bloom and then die, and the decomposers rotting them use up the oxygen in the water.') },
  light: { case: 'light', code: 'BİY.10.1.3', who: 'player',
    prompt: tr('Deneyinde en az kabarcık hangi ışıkta çıktı ve neden?', 'In your experiment, which light gave the fewest bubbles, and why?'),
    options: [
      { t: tr('Yeşil ışıkta: klorofil yeşili en az emer, çoğunu yansıtır. Yapraklar bu yüzden yeşil görünür.', 'Green: chlorophyll absorbs green the least and reflects most of it. That is why leaves look green.'), ok: true },
      { t: tr('Kırmızı ışıkta: kırmızının enerjisi düşüktür.', 'Red: red light has little energy.'), tag: 'red_low', fb: tr('Kırmızı ışığın her bir parçacığının enerjisi daha azdır, doğru. Ama klorofil kırmızıyı çok iyi emer. Tablona bak.', 'Each particle of red light does carry less energy, but chlorophyll absorbs red very well. Look at your table.') },
      { t: tr('Mavi ışıkta: bitkiler maviyi kullanamaz.', "Blue: plants can't use blue."), tag: 'blue_none', fb: tr('Klorofil maviyi en çok emen renklerden biridir. Tablona bak.', 'Blue is one of the colours chlorophyll absorbs best. Look at your table.') },
      { t: tr('Fark yok; renk önemli değil.', "There's no difference; colour doesn't matter."), tag: 'color_none', fb: tr('Ölçümlerin farklı çıktı. Tekrarların ortalamasını karşılaştır.', 'Your measurements differ. Compare the averages of your repeats.') },
    ],
    explain: tr('Doğru. Klorofil a ve b en çok mavi-mor ve kırmızı ışığı emer, yeşili yansıtır. Yeşil ışıkta fotosentez hızı en düşüktür ama sıfır değildir; yaprak yeşilin bir kısmını da emer.', "Correct. Chlorophyll a and b absorb violet-blue and red light best and reflect green. Photosynthesis is slowest in green light, but not zero, because leaves absorb some green too.") },
  yeast_heat: { case: 'bakery', code: 'BİY.10.1.9', who: 'nazli',
    prompt: tr('Nazlı Teyze: “Bu hafta değişen tek şey şu: mayayı çabuk uyansın diye semaverin kaynar suyuyla açtım. Hamurum neden kabarmıyor?”', 'Nazlı Teyze: “The only thing I changed this week: I mixed the yeast with boiling water from the samovar, to wake it up faster. Why won’t my dough rise?”'),
    options: [
      { t: tr('Maya az geldi; iki kat maya koyarsa kabarır.', 'Not enough yeast; with twice as much it would rise.'), tag: 'more_yeast', fb: tr('Kaynar suya ne kadar maya atarsan at, hepsi ölür. Deneyinde 70 °C’deki balon hiç büyümedi.', 'However much yeast goes into boiling water, it all dies. In your experiment the 70 °C balloon never grew.') },
      { t: tr('Kaynar su maya hücrelerini öldürdü. Ölü maya şekeri parçalayıp CO₂ üretemez; gaz olmayınca hamur kabarmaz.', 'The boiling water killed the yeast cells. Dead yeast can’t break sugar down into CO₂, and with no gas the dough can’t rise.'), ok: true },
      { t: tr('Hamur az yoğrulmuş; kabarcıklar yoğururken giren havadır.', 'The dough wasn’t kneaded enough; the bubbles are air worked in by kneading.'), tag: 'air_knead', fb: tr('Yoğurmak glüten ağını güçlendirir ama gazı üreten mayadır. Deney şişelerini kimse yoğurmadı, yine de balonlar şişti.', 'Kneading strengthens the gluten web, but the yeast makes the gas. Nobody kneaded your flasks, and the balloons still grew.') },
      { t: tr('Maya bozulmuş bir kimyasal; raftaki paket bayatlamış.', 'Yeast is a chemical that has gone off; the packet on the shelf is stale.'), tag: 'yeast_chem', fb: tr('Maya bir kimyasal değil, canlı bir mantar. Aynı paketten ılık suya konan maya deneyinde balonu şişirdi.', 'Yeast isn’t a chemical but a living fungus. Yeast from the same packet blew up a balloon in warm water in your experiment.') },
    ],
    explain: tr('Doğru. Maya tek hücreli bir mantardır. Hamurda şekeri etil alkol ve CO₂’ye parçalar (alkol fermantasyonu); CO₂ glüten ağına hapsolur ve hamuru kabartır. Mayanın enzimleri sıcakta bozulur: yaklaşık 55–60 °C’nin üstünde hücreler ölür. En iyisi ılık sudur (30–35 °C): bileğin içine damlatınca ne sıcak ne soğuk.', 'Correct. Yeast is a single-celled fungus. In dough it breaks sugar down into ethyl alcohol and CO₂ (alcoholic fermentation); the gluten web traps the CO₂ and the dough rises. Heat ruins the yeast’s enzymes: above roughly 55–60 °C the cells die. Lukewarm water is best (30–35 °C): neither hot nor cold on the inside of your wrist.') },
  bread_alcohol: { case: 'bakery', code: 'BİY.10.1.9', who: 'nazli',
    prompt: tr('Nazlı Teyze: “Mayalanmada alkol de oluşuyorsa, benim ekmeğimi yiyen sarhoş mu olur?”', 'Nazlı Teyze: “If fermentation makes alcohol too, will people who eat my bread get drunk?”'),
    options: [
      { t: tr('Evet, ekmekte epey alkol kalır; bu yüzden az yemeli.', 'Yes, quite a lot of alcohol stays in bread, so eat only a little.'), tag: 'alcohol_stays', fb: tr('Pişen ekmeğin içi 90 °C’yi geçer; alkol 78 °C’de kaynar. Geriye yalnızca çok az bir iz kalır.', 'The inside of a baking loaf goes past 90 °C, and alcohol boils at 78 °C. Only a trace is left.') },
      { t: tr('Mayalanmada alkol oluşmaz, yalnızca CO₂ oluşur.', 'Fermentation makes no alcohol, only CO₂.'), tag: 'no_alcohol', fb: tr('Oluşur! Alkol fermantasyonunun iki ürünü vardır: etil alkol ve CO₂. Şarabı yapan tepkime de budur.', 'It does! Alcoholic fermentation has two products: ethyl alcohol and CO₂. The same reaction makes wine.') },
      { t: tr('Maya alkolü oksijenle yakar, geriye su kalır.', 'The yeast burns the alcohol with oxygen and leaves water.'), tag: 'yeast_o2', fb: tr('Hamurun içinde oksijen azdır ve maya alkolü yakmaz. Alkolü uzaklaştıran fırının sıcağıdır.', 'There is little oxygen inside dough, and the yeast doesn’t burn the alcohol. The oven’s heat drives it off.') },
      { t: tr('Hayır: alkol 78 °C’de kaynar; fırında ekmeğin içi 90 °C’yi geçince alkol buharlaşıp gider.', 'No: alcohol boils at 78 °C, and once the inside of the loaf passes 90 °C in the oven, the alcohol evaporates away.'), ok: true },
    ],
    explain: tr('Doğru. Alkol fermantasyonu: glikoz → 2 etil alkol + 2 CO₂ (ve 2 ATP). CO₂ hamuru kabartır, alkol fırında buharlaşır. Aynı tepkimeyle şarap da yapılır; ama ekmeğin alkolü fırında uçup gider.', 'Correct. Alcoholic fermentation: glucose → 2 ethyl alcohol + 2 CO₂ (and 2 ATP). The CO₂ raises the dough and the alcohol evaporates in the oven. Wine is made by the same reaction, but bread’s alcohol is baked away.') },
  hardware_why: { case: 'hardware', code: 'BİY.10.1.5', who: 'ayten',
    prompt: tr('Ayten: “Çivi neden işkembede değil de börkenekte takıldı, dersin?”', 'Ayten: “Why do you think the nail got stuck in the reticulum and not in the rumen?”'),
    options: [
      { t: tr('Börkenek asit salgılar ve metali kendine çeker.', 'The reticulum makes acid and pulls metal towards it.'), tag: 'acid_metal', fb: tr('Asit salgılayan bölme şirdendir ve asit metali çekmez. Çivi ağır olduğu için dibe çöktü.', 'The acid-making compartment is the abomasum, and acid doesn’t pull metal. The nail sank because it is heavy.') },
      { t: tr('Börkenek midenin en önünde ve en altında: ağır cisimler oraya çöker, bal peteği duvarı da onları tutar.', 'The reticulum is the frontmost, lowest part of the stomach: heavy things sink into it, and its honeycomb wall holds them.'), ok: true },
      { t: tr('Sarıkız çiviyi bilerek yuttu, çünkü demire ihtiyacı var.', 'Sarıkız swallowed the nail on purpose because she needs iron.'), tag: 'cow_iron', fb: tr('İnekler yemi dudaklarıyla ayıklamaz; otla birlikte ne varsa yutar. Çivi kazayla gitti.', 'Cows don’t sort their feed with their lips; they swallow whatever comes with the grass. The nail went down by accident.') },
      { t: tr('Geviş getirirken ağza geri geldi, sonra oraya düştü.', 'It came back up while she was chewing the cud, then fell in there.'), fb: tr('Geri gelen lokma yumuşak ot parçalarıdır. Ağır çivi geri gelmez, börkeneğin dibinde kalır.', 'What comes back up is soft, chewed grass. A heavy nail doesn’t come up; it stays on the floor of the reticulum.') },
    ],
    explain: tr('Doğru. İnek yemi ayıklamadan hızla yutar; otun içindeki tel ve çivi de gider. Ağır cisimler en öndeki börkeneğe çöker. Börkenek her kasıldığında sivri uç duvara biraz daha batar; en kötü durumda diyaframı geçip kalbin zarına ulaşır. Buna travmatik retikuloperitonit (çivi hastalığı) denir.', 'Correct. A cow gulps its feed without sorting it, so wire and nails in the grass go down too. Heavy things sink into the reticulum at the front. Each time it contracts, the point pushes a little further into the wall; at worst it crosses the diaphragm and reaches the sac around the heart. This is traumatic reticuloperitonitis, or hardware disease.') },
  hardware_prevent: { case: 'hardware', code: 'BİY.10.1.5', who: 'riza',
    prompt: tr('Rıza Dede: “Bir daha olmasın diye ne yapayım?”', 'Rıza Dede: “What should I do so this never happens again?”'),
    options: [
      { t: tr('İneği bir süre aç bırak ki yediğine dikkat etsin.', 'Keep the cow hungry for a while so she minds what she eats.'), tag: 'starve_cow', fb: tr('Aç inek daha hızlı ve seçmeden yer. Sorun iştah değil, yemdeki metal.', 'A hungry cow eats faster and less carefully. The problem isn’t appetite, it’s the metal in the feed.') },
      { t: tr('Mıknatısı bir hafta sonra çıkartın; yoksa çivileri geri bırakır.', 'Have the magnet taken out after a week, or it will let the nails go.'), tag: 'magnet_out', fb: tr('Mıknatıs ömür boyu börkenekte kalır ve zarar vermez; yeni yutulan metalleri de toplar.', 'The magnet stays in the reticulum for life and does no harm; it collects any new metal too.') },
      { t: tr('Eski tel çitleri topla, yemi mıknatıslı bir elekten geçir; genç hayvanlara önceden mıknatıs yutturulabilir.', 'Clear away the old wire fencing, run the feed past a magnet, and give young animals a magnet in advance.'), ok: true },
      { t: tr('Yemden önce ineğe biraz asit ver, metal erisin.', 'Give the cow a little acid before feeding so the metal dissolves.'), tag: 'acid_metal', fb: tr('Hayvana asit vermek onu hasta eder, metal de kolay erimez. Metali yemden uzak tutmak gerekir.', 'Giving the animal acid would make it ill, and metal doesn’t dissolve easily. The metal has to be kept out of the feed.') },
    ],
    explain: tr('Doğru. Balya teli, çivi ve eski çit telleri yemin içine karışır. Yem karma makinelerinde bu yüzden mıknatıs bulunur. Börkenekteki mıknatıs ömür boyu orada kalır ve yeni metalleri de tutar; birçok çiftlik düvelerine önceden mıknatıs yutturur.', 'Correct. Baling wire, nails and old fence wire get mixed into feed, which is why feed mixers carry magnets. A magnet in the reticulum stays there for life and catches new metal too; many farms give their heifers one in advance.') },
  germ_oxygen: { case: 'seedbank', code: 'BİY.12.1.12', who: 'player',
    prompt: tr('Su altında bıraktığın tohumlar şişti ama çimlenmedi. Nemli kâğıttakiler çimlendi. Neden?', 'The seeds you left under water swelled but did not sprout. The ones on moist paper did. Why?'),
    options: [
      { t: tr('Su altında ışık azdı; tohum ışıksız çimlenemez.', 'There was little light under the water; a seed can’t sprout without light.'), tag: 'seed_light', fb: tr('Karanlıkta bıraktığın tabak da çimlendi. Işık fark etmedi.', 'The dish you kept in the dark sprouted too. Light made no difference.') },
      { t: tr('Su havayı kesti. Çimlenen tohum enerjisini oksijenli solunumla üretir; oksijen bitince boğuldu.', 'The water cut off the air. A germinating seed makes its energy by aerobic respiration, and when the oxygen ran out it drowned.'), ok: true },
      { t: tr('Suyun fazlası tohumun besinini yıkayıp götürdü.', 'The extra water washed the seed’s food away.'), tag: 'water_more', fb: tr('Tohumun besini çenek hücrelerinin içinde; su onu yıkayıp götürmez. Sorun, suyun havayı kesmesi.', 'The seed’s food is inside the cells of the cotyledons; water can’t wash it out. The problem is that water cuts off the air.') },
      { t: tr('Tohum çimlenmek için topraktaki minerallere muhtaç; tabakta toprak yoktu.', 'A seed needs minerals from the soil to sprout, and the dish had no soil.'), tag: 'seed_soil', fb: tr('Nemli kâğıtta da toprak yoktu, yine de tohumlar çimlendi. Çimlenen tohum kendi deposunu kullanır.', 'There was no soil on the moist paper either, and those seeds still sprouted. A germinating seed uses its own store.') },
    ],
    explain: tr('Doğru. Tohum su alıp şişer, enzimleri çalışmaya başlar ve çeneklerdeki nişastayı şekere parçalar. Embriyo bu şekerden oksijenli solunumla ATP üretir. Su havayı keserse oksijen biter ve tohum boğulur. Çimlenmek için su, oksijen ve uygun sıcaklık gerekir; bezelyeye ışık gerekmez.', 'Correct. The seed takes up water and swells, its enzymes switch on and break the starch in the cotyledons down into sugar. The embryo makes ATP from that sugar by aerobic respiration. If water cuts off the air, the oxygen runs out and the seed drowns. Germination needs water, oxygen and a suitable temperature; a pea doesn’t need light.') },
  seed_regrow: { case: 'seedbank', code: 'BİY.10.2.8', who: 'player',
    prompt: tr('Nemli kâğıtta, 22 °C’de bir hafta: 2023 kavanozu %{a}, 2011 kavanozu %{b}, 1998 kavanozu %{c} çimlendi. Nine’nin kuralı: “%85’in altına düşen kavanoz yenilenir.” Ne yapmalı?', 'One week on moist paper at 22 °C: the 2023 jar {a}%, the 2011 jar {b}% and the 1998 jar {c}% germinated. Grandma’s rule: “A jar that falls below 85% is renewed.” What should you do?'),
    options: [
      { t: tr('Hiçbir şey: kuru tohum kavanozda sonsuza dek canlı kalır.', 'Nothing: dry seed stays alive in a jar forever.'), tag: 'seed_immortal', fb: tr('Sonuçların öyle demiyor: eski kavanozlar daha az çimlendi. Tohum depoda da yavaş yavaş yaşlanır.', 'Your results say otherwise: the older jars germinated less. Seeds age slowly even in storage.') },
      { t: tr('1998 ve 2011 kavanozlarını çöpe at; yalnızca yenisini sakla.', 'Throw out the 1998 and 2011 jars and keep only the new one.'), tag: 'seed_throw', fb: tr('O kavanozlardaki canlı tohumlar başka hiçbir yerde olmayan genler taşıyor olabilir. Atarsan o çeşit sonsuza dek kaybolabilir.', 'The live seeds in those jars may carry genes found nowhere else. Throw them out and that variety could be lost forever.') },
      { t: tr('1998 ve 2011 tohumlarını ekip yetiştir, yeni hasatla kavanozları tazele ve bir yedeğini başka bir bankaya gönder.', 'Sow and grow the 1998 and 2011 seed, refill those jars from the new harvest, and send a backup to another bank.'), ok: true },
      { t: tr('Yalnızca 1998 kavanozunu yenile; 2011 idare eder.', 'Renew only the 1998 jar; 2011 will do.'), tag: 'one_lot', fb: tr('Kural %85. 2011 kavanozu da bu sınırın altında kaldı.', 'The rule is 85%. The 2011 jar is below that line too.') },
    ],
    explain: tr('Doğru. Gen bankaları kavanozlarını düzenli olarak çimlendirerek dener. Canlılık %85’in altına düşünce tohum ekilir, yetiştirilir ve kavanoz taze tohumla yenilenir. Bunu tohumlar ölmeden yapmak gerekir; yoksa o çeşidin genleri kaybolur. Aynı tohumların bir yedeği başka bir bankada saklanır: Norveç’teki Svalbard Küresel Tohum Deposu dünyanın yedek kasasıdır.', 'Correct. Gene banks test their jars regularly by germinating them. When viability falls below 85%, the seed is sown, grown and the jar is refilled with fresh seed. It has to happen before the seeds die, or the variety’s genes are lost. A backup of the same seed is kept at another bank: the Svalbard Global Seed Vault in Norway is the world’s backup safe.') },
  spring_green: { case: 'spring', code: 'BİY.10.2.1', who: 'player',
    prompt: tr('Işık ölçer her istasyonda aynı güneşi gösterdi; ama yeşil ancak su yaklaşık 73 °C’ye soğuyunca başladı. Neden?', 'The light meter showed the same sun at every station, yet the green only began once the water had cooled to about 73 °C. Why?'),
    options: [
      { t: tr('Kaynağın yanında buhar ışığı kesiyor.', 'Near the vent the steam blocks the light.'), tag: 'no_light_spring', fb: tr('Işık ölçer her istasyonda %96’nın üstündeydi. Işık eksik değil.', 'The light meter read over 96% at every station. There is no shortage of light.') },
      { t: tr('Fotosentez yapan hücrelerin klorofil taşıyan zarları ve proteinleri 73 °C’nin üstünde dağılıyor; orada yalnızca enerjiyi başka yoldan bulanlar yaşayabiliyor.', 'The chlorophyll-carrying membranes and proteins of photosynthesising cells fall apart above 73 °C; only living things that get their energy another way can live there.'), ok: true },
      { t: tr('Sıcak su yeşil rengi soldurur; aynı canlılar orada da var ama beyaz görünüyor.', 'Hot water bleaches the green; the same living things are there but look white.'), tag: 'heat_bleach', fb: tr('×1000 görüntüye bak: kaynağın yanındakiler kükürt bakterileri ve arkeler, siyanobakteri yok. Farklı canlılar.', 'Look at the ×1000 plate: near the vent there are sulphur bacteria and archaea, no cyanobacteria. They are different living things.') },
      { t: tr('H₂S bütün canlıları öldürüyor; kaynağın yanı cansız.', 'H₂S kills everything; the water by the vent is lifeless.'), tag: 'spring_poison', fb: tr('Kaynağın yanı cansız değil: beyaz iplikler H₂S ile yaşayan bakteriler. H₂S onlar için zehir değil, yiyecek.', 'The water by the vent isn’t lifeless: the white streamers are bacteria living on H₂S. For them H₂S isn’t poison but food.') },
    ],
    explain: tr('Doğru. Fotosentez düzeneğinin zarları ve proteinleri çok sıcakta dağılır; bilinen hiçbir fotosentez yapan canlı yaklaşık 73 °C’nin üstünde yaşayamaz. Bu sıcaklığın üstünde yaşam sürer, ama enerjisini ışıktan değil kimyasallardan alır. Sıcaklık, ekosistemdeki canlıları sıraya dizen cansız bir etmendir.', 'Correct. The membranes and proteins of the photosynthesis machinery fall apart when it is very hot; no known photosynthesising organism lives above about 73 °C. Above that temperature life goes on, but it takes its energy from chemicals rather than light. Temperature is a non-living factor that sorts the living things of an ecosystem into order.') },
  spring_energy: { case: 'spring', code: 'BİY.10.2.3', who: 'player',
    prompt: tr('80 °C’deki beyaz ipliklerde hiç klorofil yok. Bu bakteriler besin yapmak için enerjiyi nereden alıyor?', 'The white streamers at 80 °C have no chlorophyll at all. Where do these bacteria get the energy to make food?'),
    options: [
      { t: tr('Güneşten: yeryüzündeki bütün yaşam güneş enerjisiyle yürür.', 'From the sun: all life on Earth runs on solar energy.'), tag: 'all_sun', fb: tr('Klorofil olmadan güneş ışığı yakalanamaz. Burada başka bir enerji kaynağı var: ölçtüğün H₂S kaynağın yanında en yüksek.', 'Without chlorophyll, sunlight can’t be captured. There’s another energy source here: the H₂S you measured is highest near the vent.') },
      { t: tr('Sıcaklığın kendisinden: ısıyı besin olarak kullanıyorlar.', 'From the heat itself: they use heat as food.'), tag: 'heat_food', fb: tr('Isı tepkimeleri hızlandırır ama hücre ısıyı besine çeviremez. Enerji bir kimyasal tepkimeden gelmeli.', 'Heat speeds reactions up, but a cell can’t turn heat into food. The energy has to come from a chemical reaction.') },
      { t: tr('H₂S’yi oksitleyerek: açığa çıkan kimyasal enerjiyle CO₂’den şeker yapıyorlar. Buna kemosentez denir.', 'By oxidising H₂S: they use the chemical energy released to make sugar from CO₂. This is called chemosynthesis.'), ok: true },
      { t: tr('Aşağıdaki yeşil alglerin yaptığı besinle.', 'On food made by the green algae downstream.'), fb: tr('Su aşağı akar, yukarı değil: alglerin yaptığı besin kaynağa geri gidemez.', 'Water flows down, not up: food made by the algae can’t travel back to the vent.') },
    ],
    explain: tr('Doğru. Kükürt bakterileri H₂S’yi oksitleyerek enerji elde eder ve bu enerjiyle CO₂’den organik madde yapar: kemosentez. Onlar da üreticidir. Ölçtüğün H₂S kaynaktan uzaklaştıkça azaldı; kemosentez de en çok kaynağın yanında yürür. Okyanus diplerindeki sıcak bacalarda bütün bir ekosistem böyle, güneşsiz yaşar.', 'Correct. Sulphur bacteria get energy by oxidising H₂S and use it to build organic matter from CO₂: chemosynthesis. They are producers too. The H₂S you measured fell away from the vent, and chemosynthesis runs mostly near the vent. At hot vents on the ocean floor, a whole ecosystem lives this way, without the sun.') },
  spring_report: { case: 'spring', code: 'BİY.10.2.1', who: 'elder1',
    prompt: tr('Hasan Dede: “Söyle bakalım evladım: pınar zehirlendi mi? Bir bidon çamaşır suyu döküp temizleyelim mi?”', 'Grandpa Hasan: “Tell me, child: has the spring been poisoned? Shall we pour in a drum of bleach and clean it?”'),
    options: [
      { t: tr('Evet, renkler zehirden; çamaşır suyuyla temizlenmeli.', 'Yes, the colours are poison; it should be cleaned with bleach.'), tag: 'spring_poison', fb: tr('Renkler zehirden değil, canlılardan. Çamaşır suyu onları öldürür ve eşsiz bir ekosistemi yok eder.', 'The colours come from living things, not poison. Bleach would kill them and destroy a one-of-a-kind ecosystem.') },
      { t: tr('Hayır: renkler sıcaklığa göre dizilmiş canlı toplulukları. Zehirli değil, ama kaynak insanı haşlar ve H₂S uzun süre solunmamalı. Dokunmayalım, koruyalım.', 'No: the colours are living communities sorted by temperature. It isn’t poisoned, but the vent would scald you and H₂S shouldn’t be breathed for long. Let’s leave it alone and protect it.'), ok: true },
      { t: tr('Hayır, orada hiçbir şey yaşamıyor; renkler yalnızca mineral.', 'No, nothing lives there; the colours are just minerals.'), tag: 'hot_lifeless', fb: tr('Ölçtüğün her noktada canlı buldun. Sıcak su cansız değil.', 'You found living things at every station of the transect. Hot water isn’t lifeless.') },
      { t: tr('Zehirli değil; hatta sıcak suda sabunla çamaşır yıkarsak daha iyi temizlenir.', 'It isn’t poisoned; in fact, if we wash clothes there with soap, the hot water will get them cleaner.'), tag: 'soap_ok', fb: tr('Sabun ve deterjandaki fosfat örtüleri bozar ve aşağıdaki nehirde alg patlaması yapar. Gölette ne olduğunu hatırla.', 'Soap and the phosphate in detergent would spoil the mats and cause an algal bloom in the river below. Remember what happened to the pond.') },
    ],
    explain: tr('Doğru. Kükürtlü pınarlar yeryüzünün en eski yaşam biçimlerini barındırır; buradaki bakterilerin ısıya dayanıklı enzimleri PCR gibi testlerin temelidir. Suyu içmemek, kaynağa elle girmemek ve pınara hiçbir şey dökmemek yeterli.', 'Correct. Sulphur springs hold some of the oldest kinds of life on Earth, and heat-proof enzymes from bacteria like these are the basis of tests such as PCR. Don’t drink the water, don’t put your hands in the vent, and don’t pour anything into the spring. That’s all it takes.') },
  altitude_why: { case: 'yayla', code: 'BİY.11.2.7', who: 'player',
    prompt: tr('İzmir’de Elif’in SpO₂’si %98’di; yaylada (2200 m) %91. Nabzı ve solunumu da daha hızlı. Neden?', 'In İzmir Elif’s SpO₂ was 98%; on the yayla (2200 m) it is 91%. Her pulse and breathing are faster too. Why?'),
    options: [
      { t: tr('Yayla havasında oksijenin oranı daha az.', 'Yayla air has a smaller share of oxygen.'), tag: 'o2_percent', fb: tr('Oran aynı: havanın her yerde yaklaşık %21’i oksijendir. Azalan havanın basıncı; her nefeste daha az oksijen molekülü alınıyor.', 'The share is the same: about 21% of air is oxygen everywhere. What drops is the air pressure, so each breath takes in fewer oxygen molecules.') },
      { t: tr('Hava basıncı düşük: her nefeste daha az oksijen molekülü giriyor, hemoglobin tam dolmuyor. Vücut bunu daha hızlı solunumla ve kalp atışıyla dengeliyor.', 'The air pressure is low: each breath brings in fewer oxygen molecules and the haemoglobin doesn’t fill up. The body makes up for it by breathing faster and pumping faster.'), ok: true },
      { t: tr('Yayla soğuk; soğuk hava ciğerleri daraltıyor.', 'The yayla is cold; cold air tightens the lungs.'), tag: 'cold_breath', fb: tr('Sen ve Yusuf Amca da aynı soğukta ölçüldünüz. Fark soğuktan değil: SpO₂ düşük, kana daha az oksijen geçiyor.', 'You and Uncle Yusuf were measured in the same cold. The difference isn’t the cold: the SpO₂ is low, so less oxygen reaches the blood.') },
      { t: tr('Elif hasta; sağlıklı biri yaylada hiçbir şey hissetmez.', 'Elif is ill; a healthy person feels nothing on the yayla.'), tag: 'altitude_ill', fb: tr('Sen de bugün geldin ve senin de nabzın yükseldi. Bu bir hastalık değil, vücudun yeni koşula verdiği normal yanıt: homeostazi.', 'You arrived today too, and your pulse went up as well. It isn’t an illness but the body’s normal response to a new condition: homeostasis.') },
    ],
    explain: tr('Doğru. Yükseldikçe hava basıncı düşer; havanın yine %21’i oksijendir ama her nefeste daha az molekül vardır. Kandaki oksijen azalınca atardamarlardaki algılayıcılar bunu beyne bildirir: solunum ve nabız hızlanır. Vücudun iç dengesini koruma çabasına homeostazi denir.', 'Correct. The higher you go, the lower the air pressure; air is still 21% oxygen, but each breath holds fewer molecules. When blood oxygen falls, sensors in the arteries tell the brain, and breathing and pulse speed up. The body’s effort to keep its inner balance is called homeostasis.') },
  altitude_adapt: { case: 'yayla', code: 'BİY.11.2.6', who: 'yusuf',
    prompt: tr('Yusuf Amca: “Ben de ilk yazımda Elif gibiydim. Şimdi koşsam da yorulmuyorum. Bende ne değişti?”', 'Uncle Yusuf: “I was just like Elif my first summer. Now I can run and not get tired. What changed in me?”'),
    options: [
      { t: tr('Yaylada ciğerleriniz büyüdü.', 'Your lungs grew bigger on the yayla.'), tag: 'lungs_grow', fb: tr('Yetişkinde akciğerler birkaç ayda büyümez. Tüplere bak: değişen, kandaki alyuvar oranı.', 'An adult’s lungs don’t grow in a few months. Look at the tubes: what changed is the share of red cells in the blood.') },
      { t: tr('Birkaç haftada kanınız daha çok alyuvar yaptı: aynı nefesten daha çok oksijen taşıyorsunuz.', 'Within a few weeks your blood made more red cells: you carry more oxygen from the same breath.'), ok: true },
      { t: tr('Sadece alıştınız; bu bir alışkanlık, vücudunuzda bir şey değişmedi.', 'You just got used to it; it’s habit, nothing in your body changed.'), tag: 'habit_only', fb: tr('Alışmak dediğimiz şey ölçülebilir: hematokritiniz %54, Elif’inki %42. Vücudunuz gerçekten değişti.', 'What we call getting used to it can be measured: your haematocrit is 54% and Elif’s is 42%. Your body really did change.') },
      { t: tr('Daha az nefes alarak oksijen biriktiriyorsunuz.', 'You save up oxygen by breathing less.'), fb: tr('Vücut oksijen biriktiremez. Dinlenirken daha yavaş solumanız, her litre kanınızın daha çok oksijen taşımasından.', 'The body can’t store up oxygen. You breathe more slowly at rest because each litre of your blood carries more oxygen.') },
    ],
    explain: tr('Doğru. Kandaki oksijen uzun süre düşük kalınca böbrekler EPO hormonu salgılar; kemik iliği daha çok alyuvar üretir. Birkaç haftada hematokrit yükselir. Köye inen çoban birkaç hafta içinde yine eski değerlerine döner: bu da homeostazidir.', 'Correct. When blood oxygen stays low for a long time, the kidneys release the hormone EPO and the bone marrow makes more red cells. Within a few weeks the haematocrit rises. When the shepherd goes back down to the village, it returns to its old level within weeks: that is homeostasis too.') },
  altitude_advice: { case: 'yayla', code: 'BİY.11.2.7', who: 'elif',
    prompt: tr('Elif: “Yarın zirveye (3100 m) koşarak çıkmak istiyorum! Ne dersin?”', 'Elif: “Tomorrow I want to run up to the summit (3100 m)! What do you think?”'),
    options: [
      { t: tr('Koşarak çık: ne kadar hızlı çıkarsan o kadar çabuk alışırsın.', 'Run up: the faster you climb, the faster you get used to it.'), tag: 'rush_up', fb: tr('Hızlı tırmanmak yükseklik hastalığını ağırlaştırır. Vücudun yeni alyuvar yapması haftalar sürer.', 'Climbing fast makes altitude sickness worse. It takes the body weeks to make new red cells.') },
      { t: tr('Birkaç gün yaylada kal, yavaş çık, bol su iç; baş ağrın ve bulantın artarsa hemen aşağı in.', 'Stay on the yayla a few days, climb slowly and drink plenty of water; if the headache and sickness get worse, come straight back down.'), ok: true },
      { t: tr('Nefesini tutarak alıştır; ciğerlerin güçlenir.', 'Train by holding your breath; your lungs will get stronger.'), fb: tr('Nefes tutmak kandaki oksijeni daha da düşürür.', 'Holding your breath lowers blood oxygen even further.') },
      { t: tr('Bol çay ve kahve iç; kafein kana oksijen katar.', 'Drink lots of tea and coffee; caffeine adds oxygen to the blood.'), tag: 'drink_oxygen', fb: tr('Hiçbir içecek kana oksijen katmaz. Su iyidir, ama oksijen yalnızca akciğerden girer.', 'No drink adds oxygen to the blood. Water is good, but oxygen only gets in through the lungs.') },
    ],
    explain: tr('Doğru. Dağcıların kuralı: yükseğe yavaş çık. Vücuda hem kısa vadeli (solunum, nabız) hem uzun vadeli (alyuvar) uyum için zaman tanı. Belirtiler ağırlaşırsa en iyi ilaç aşağı inmektir.', 'Correct. The climbers’ rule: go up slowly. Give the body time for both the short-term response (breathing, pulse) and the long-term one (red cells). If the symptoms get worse, the best medicine is to go down.') },
  osmo_why: { case: 'well', code: 'BİY.9.2.6', who: 'player',
    prompt: tr('%0 bardağındaki silindir ağırlaştı ve sertleşti; %2’dekiyle kuyu suyundaki hafifledi ve yumuşadı. Neden?', 'The cylinder in the 0% cup got heavier and firmer; the ones in 2% and in the well water got lighter and softer. Why?'),
    options: [
      { t: tr('Tuz silindirin içine girdi; tuzlu bardaktakiler bu yüzden değişti.', 'The salt got into the cylinders; that is why the ones in salty cups changed.'), tag: 'salt_moves', fb: tr('Tuz içeri girseydi silindir ağırlaşırdı. Tuzlu bardaklardakiler hafifledi: dışarı çıkan sudur.', 'If salt had got in, the cylinder would have got heavier. The ones in the salty cups got lighter: what left them was water.') },
      { t: tr('Su, hücre zarından az tuzlu taraftan çok tuzlu tarafa geçti: saf suda hücrelere girdi, tuzlu suda hücrelerden çıktı.', 'Water crossed the cell membranes from the less salty side to the saltier side: in pure water it went into the cells, in salty water it came out of them.'), ok: true },
      { t: tr('Tuz patates hücrelerini öldürdü; ölü hücre hafifler.', 'The salt killed the potato cells; dead cells get lighter.'), tag: 'salt_poison', fb: tr('Temiz suya geri konan silindir yeniden sertleşir; hücreler ölmedi. Fark, suyun hangi yöne gittiğinde.', 'Put back in fresh water, the cylinder turns firm again; the cells didn’t die. The difference is which way the water went.') },
      { t: tr('Patates tuzlu suyu emip buharlaştırdı.', 'The potato soaked up the salty water and evaporated it.'), fb: tr('Silindirler suyun içindeydi; buharlaşma olmadı. Su, hücre zarından geçti.', 'The cylinders were under water; nothing evaporated. The water crossed the cell membranes.') },
    ],
    explain: tr('Doğru. Buna osmoz denir: su, seçici geçirgen zardan çözünmüş maddesi az olan taraftan çok olan tarafa geçer. Çizgi sıfırı %1’in biraz altında kesti: patates hücrelerinin özsuyu bu kadar tuzlu sayılır. Kuyu suyu ondan tuzlu; hücrelerden su çeker.', 'Correct. This is osmosis: water crosses a selectively permeable membrane from the side with less dissolved matter to the side with more. The line crossed zero just under 1%: that is about how salty the potato cells’ sap is. The well water is saltier, so it draws water out of cells.') },
  salt_why: { case: 'well', code: 'BİY.9.2.1', who: 'songul',
    prompt: tr('Songül Abla: “Her sabah suluyorum, toprak hep ıslak. Fidelerim neden susuz gibi?”', 'Songül: “I water every morning and the soil is always wet. Why do my seedlings look thirsty?”'),
    options: [
      { t: tr('Az suluyorsunuz; iki kat su verin.', 'You don’t water enough; give them twice as much.'), tag: 'more_well', fb: tr('Toprak zaten ıslak. Aynı kuyudan daha çok su, toprağa daha çok tuz demek.', 'The soil is already wet. More water from the same well means more salt in the soil.') },
      { t: tr('Kuyu suyu tuzlu: toprak suyu kök hücrelerinden tuzlu olunca su köke giremiyor, tersine kökten çıkıyor. Su var ama fide alamıyor.', 'The well water is salty: once the soil water is saltier than the root cells, water can’t get into the roots; it leaves them instead. The water is there, but the seedlings can’t take it.'), ok: true },
      { t: tr('Tuz yapraklara çıkıp onları yakmış.', 'The salt has climbed into the leaves and burnt them.'), tag: 'salt_poison', fb: tr('Yapraklar yanık değil, pörsük. Kök hücrelerine bak: zarları çeperden ayrılmış, su kaybetmişler.', 'The leaves aren’t burnt, they’re limp. Look at the root cells: their membranes have pulled away from the walls; they have lost water.') },
      { t: tr('Toprağın besini bitmiş; gübre lazım.', 'The soil has run out of food; it needs fertiliser.'), tag: 'more_fert', fb: tr('Gübre de bir tuzdur: toprak suyunu daha da tuzlu yapar ve kökten daha çok su çeker.', 'Fertiliser is a salt too: it makes the soil water even saltier and draws even more water out of the roots.') },
    ],
    explain: tr('Doğru. Su ve mineral tuzlar canlının inorganik bileşenleridir; ikisinin dengesi bozulunca hücre çalışamaz. Toprak ıslakken bitkinin susuz kalmasına fizyolojik kuraklık denir.', 'Correct. Water and mineral salts are a living thing’s inorganic building blocks, and when their balance is upset the cell can’t work. A plant going thirsty in wet soil is called physiological drought.') },
  salt_fix: { case: 'well', code: 'BİY.10.2.6', who: 'songul',
    prompt: tr('Songül Abla: “Peki ne yapayım? Dere kurudu; başka suyum yok sanıyordum.”', 'Songül: “So what do I do? The stream has dried up; I thought I had no other water.”'),
    options: [
      { t: tr('Kuyu suyunu kaynatıp soğutun; tuzu gider.', 'Boil the well water and let it cool; the salt goes away.'), tag: 'boil_salt', fb: tr('Kaynatınca su buharlaşır, tuz kalır: su daha da tuzlanır.', 'Boiling makes the water evaporate and leaves the salt behind: the water gets even saltier.') },
      { t: tr('Kuyudan her gün iki kat su verin; tuz seyrelir.', 'Give twice as much well water every day; the salt will thin out.'), tag: 'more_well', fb: tr('Aynı kuyudan her kova toprağa biraz daha tuz bırakır: su buharlaşır, tuz kalır.', 'Every bucket from the same well leaves a little more salt in the soil: the water evaporates, the salt stays.') },
      { t: tr('Kuyu suyunu bahçeye vermeyin. Çatıdan akan yağmur suyunu bidonda toplayın; önce toprağı bol temiz suyla yıkayıp tuzu köklerin altına indirin, sonra az ve sık sulayın.', 'Keep the well water off the garden. Collect rain water from the roof in a barrel; first wash the soil with plenty of fresh water to carry the salt below the roots, then water little and often.'), ok: true },
      { t: tr('Fidelere daha çok gübre verin; güçlenip tuza dayanırlar.', 'Give the seedlings more fertiliser; they’ll grow strong and stand the salt.'), tag: 'more_fert', fb: tr('Gübre de tuzdur; toprağı daha da tuzlu yapar.', 'Fertiliser is a salt too; it makes the soil saltier still.') },
    ],
    explain: tr('Doğru. Tuzlu suyla sulanan toprak yıldan yıla çoraklaşır; bu, tarımın sürdürülebilirliğini kısıtlayan bir durumdur. Yağmur suyu hasadı, tuzu kök bölgesinden yıkamak ve damla sulama çözümün parçalarıdır. Tuzlu toprak için arpa ya da pancar gibi tuza dayanıklı bitkiler de seçilebilir.', 'Correct. Soil watered with salty water gets more barren year by year, which limits how sustainable the farming can be. Harvesting rain water, washing the salt out of the root zone and drip irrigation are all part of the answer. For salty soil you can also choose salt-tolerant crops such as barley or beet.') },
  owl_dark: { case: 'owl', code: 'BİY.11.1.5', who: 'player',
    prompt: tr('Peçeli baykuş zifiri karanlıkta, otların altındaki fareyi bile yakalayabiliyor. Nasıl?', 'A barn owl can catch a mouse under the grass in pitch darkness. How?'),
    options: [
      { t: tr('Gözleri karanlıkta görür.', 'Its eyes see in the dark.'), tag: 'see_dark', fb: tr('Hiç ışık yoksa göz de göremez. Retinası loş ışık için çok iyi, ama zifiri karanlıkta işi kulakları yapar.', 'With no light at all, no eye can see. Its retina is excellent in dim light, but in pitch darkness its ears do the work.') },
      { t: tr('Yüz diski sesi kulaklara toplar; kulak delikleri farklı yükseklikte olduğu için beyin sesin yerini sağ-sol ve yukarı-aşağı hesaplar.', 'Its facial disc gathers sound to the ears; because the ear openings sit at different heights, the brain works out where the sound is, left–right and up–down.'), ok: true },
      { t: tr('Farenin kokusunu alır.', 'It smells the mouse.'), fb: tr('Baykuşların koku duyusu zayıftır. Yüz diskine ve kulak deliklerine bak.', 'Owls have a poor sense of smell. Look at the facial disc and the ear openings.') },
      { t: tr('Farenin vücut ısısını hisseder.', 'It senses the mouse’s body heat.'), fb: tr('Isıyı algılayan çukurlar bazı yılanlarda vardır, baykuşta yok. Baykuş dinler.', 'Some snakes have heat-sensing pits; owls don’t. The owl listens.') },
    ],
    explain: tr('Doğru. Duyu reseptörleri dış uyarıyı sinir sinyaline çevirir; beyin iki kulaktan gelen sinyallerin zaman ve şiddet farkından bir ses haritası çıkarır. Loş ışıkta ise retinasındaki sayısız çubuk hücresi devreye girer.', 'Correct. Sense receptors turn an outside stimulus into nerve signals, and the brain builds a sound map from the differences in timing and loudness between the two ears. In dim light the countless rods in its retina join in.') },
  owl_count: { case: 'owl', code: 'BİY.10.2.2', who: 'player',
    prompt: tr('Baykuş her gün bir iki kusmuk atar; bu kusmuk yaklaşık bir gecenin avı. Bir baykuş yılda kaç kemirgen yakalar?', 'An owl brings up one or two pellets a day; this pellet is about one night’s catch. How many rodents does one owl catch in a year?'),
    options: [
      { t: tr('30 kadar', 'About 30'), fb: tr('Bu on günlük av bile değil. Hesapla: gecede 3 kemirgen × 365 gece.', 'That isn’t even ten nights’ catch. Work it out: 3 rodents a night × 365 nights.') },
      { t: tr('300 kadar', 'About 300'), fb: tr('Hesapla: gecede 3 kemirgen × 365 gece.', 'Work it out: 3 rodents a night × 365 nights.') },
      { t: tr('1000’den fazla: gecede 3 kemirgen × 365 gece ≈ 1100', 'More than 1,000: 3 rodents a night × 365 nights ≈ 1,100'), ok: true },
      { t: tr('100 000 kadar', 'About 100,000'), fb: tr('Bir köyde o kadar fare bile yok! Gecede 3 × 365 ≈ 1100.', 'There aren’t that many mice in a whole village! 3 a night × 365 ≈ 1,100.') },
    ],
    explain: tr('Doğru. Yavru büyüten bir baykuş çifti yılda 3000’e yakın küçük memeli yakalar. Avcı ile av arasındaki bu ilişki, fare popülasyonunu sınırlayan doğal bir frendir.', 'Correct. A pair of owls raising chicks catches nearly 3,000 small mammals a year. This link between hunter and hunted is a natural brake on the mouse population.') },
  owl_poison: { case: 'owl', code: 'BİY.10.2.5', who: 'riza',
    prompt: tr('Rıza Dede: “Zehri korum, fareler ölür. Baykuşa ne zararı var ki?”', 'Rıza Dede: “I put the poison down and the mice die. What harm does that do the owl?”'),
    options: [
      { t: tr('Zehir yalnızca fareleri öldürür; baykuşa dokunmaz.', 'The poison only kills the mice; it won’t touch the owl.'), tag: 'poison_safe', fb: tr('Zehir farenin vücudunda kalır. Baykuş fareyi bütün yutar: kusmukta kemiklerini gördün, zehrini de yutmuş olur.', 'The poison stays in the mouse’s body. The owl swallows mice whole: you saw their bones in the pellet, so it swallows their poison too.') },
      { t: tr('Zehirlenen fare hemen ölmez, sersemleyip ortada dolaşır; baykuş en kolay onu yakalar. Zehir baykuşu da öldürür, sonra fareler eskisinden hızlı çoğalır.', 'A poisoned mouse doesn’t die at once; it wanders about, dazed, and it is the easiest one for the owl to catch. The poison kills the owl too, and then the mice multiply faster than before.'), ok: true },
      { t: tr('Baykuş zehirli fareyi kokusundan anlar, yemez.', 'The owl can smell a poisoned mouse and won’t eat it.'), fb: tr('Baykuşun koku duyusu zayıftır ve avını bütün yutar; anlayamaz.', 'Owls have a poor sense of smell and swallow their prey whole; it can’t tell.') },
      { t: tr('Zehir fareleri tamamen bitirir; bir daha gelmezler.', 'The poison wipes out the mice; they won’t come back.'), tag: 'mice_gone', fb: tr('Bir fare çifti yılda yüzlerce yavru verebilir. Avcısı olmayan dolu ambar kısa sürede yine fare dolar.', 'One pair of mice can have hundreds of young in a year. A full grain store with no hunter soon fills up with mice again.') },
    ],
    explain: tr('Doğru. Zehir besin zincirinde bir üst basamağa geçer; buna ikincil zehirlenme denir. Yırtıcılar azalınca av popülasyonu kontrolsüz büyür. Sürdürülebilir çözüm, avcıyı koruyup tahılı korumaktır.', 'Correct. The poison moves one step up the food chain; this is called secondary poisoning. When the predators decline, the prey population grows unchecked. The sustainable answer is to protect the hunter and protect the grain.') },
  owl_omen: { case: 'owl', code: 'BİY.9.1.2', who: 'riza',
    prompt: tr('Rıza Dede: “Ama eskiler baykuş uğursuzdur der; damına konduğu eve kötülük gelirmiş.”', 'Rıza Dede: “But the old folk say owls bring bad luck, that trouble comes to the house they sit on.”'),
    options: [
      { t: tr('Haklısınız; baykuşu kovmak en iyisi.', 'You’re right; best to chase the owl away.'), tag: 'owl_omen', fb: tr('Bu bir inanış; kanıta bakalım. Kusmuktaki kemikler bu baykuşun her gece ambarınızın farelerini avladığını gösteriyor.', 'That’s a belief; let’s look at the evidence. The bones in the pellet show this owl hunts your store’s mice every night.') },
      { t: tr('Bu eski bir inanış. Baykuş gece avlanan bir kuş; sesi eşini ve yavrularını çağırmak için. Kanıt ortada: kusmuğu kemirgen kemikleriyle dolu. Ambarınızın bekçisi o.', 'That’s an old belief. The owl is a bird that hunts at night, and its call is for its mate and chicks. The evidence is right here: its pellet is full of rodent bones. It is your grain store’s guard.'), ok: true },
      { t: tr('Baykuş gece öttüğü için hastalık taşır.', 'Owls carry disease because they call at night.'), fb: tr('Ötmesiyle hastalık arasında bir bağ yok. Gece öter, çünkü gece avlanır ve eşiyle haberleşir.', 'There’s no link between its call and disease. It calls at night because it hunts and talks to its mate at night.') },
    ],
    explain: tr('Doğru. Bilim, inanışları kanıtla sınar. Baykuşun karanlıkta duyulan sesi ve ıssız ahırlarda yaşaması bu inanışları doğurmuş olabilir; kusmuktaki kanıt ise onun çiftçinin dostu olduğunu gösteriyor.', 'Correct. Science tests beliefs against evidence. Its call in the dark and its life in empty barns may have given rise to such beliefs; the evidence in the pellet shows it is the farmer’s friend.') },
  owl_fix: { case: 'owl', code: 'BİY.10.2.5', who: 'riza',
    prompt: tr('Rıza Dede: “Peki farelere ne yapayım?”', 'Rıza Dede: “So what do I do about the mice?”'),
    options: [
      { t: tr('Zehri kaldırın; ahırın duvarına bir baykuş yuvası asın, tahılı fare giremeyen kapaklı bidonlarda saklayın.', 'Put the poison away, hang an owl nest box on the barn wall, and keep the grain in lidded bins the mice can’t get into.'), ok: true },
      { t: tr('Daha güçlü bir zehir alın; tek seferde biter.', 'Buy a stronger poison and be done in one go.'), tag: 'poison_safe', fb: tr('Güçlü zehir baykuşu, kediyi, köpeği de öldürür. Karabaş’ı düşünün!', 'A strong poison kills owls, cats and dogs too. Think of Karabaş!') },
      { t: tr('Baykuşu kafese koyup ambara bırakalım.', 'Let’s put the owl in a cage in the store.'), fb: tr('Kafesteki baykuş avlanamaz. Yuvası olursa kendisi kalır, yavrularını da burada büyütür.', 'A caged owl can’t hunt. Give it a nest box and it stays of its own accord, and raises its chicks here.') },
      { t: tr('Tahılı ambardan çıkarıp açıkta bırakalım, fareler dağılsın.', 'Take the grain out and leave it in the open so the mice scatter.'), fb: tr('Açıktaki tahıl daha çok fare ve kuş çeker, yağmurda da çürür.', 'Grain left in the open draws even more mice and birds, and rots in the rain.') },
    ],
    explain: tr('Doğru. Buna biyolojik mücadele denir: zararlının doğal düşmanını korumak. Zehirsizdir, ucuzdur ve besin zincirini bozmaz; ekolojik sürdürülebilirliğin bir örneğidir.', 'Correct. This is called biological control: protecting the pest’s natural enemy. It is poison-free and cheap, and it leaves the food chain intact, an example of ecological sustainability.') },
  azik_loss: { case: 'azik', code: 'BİY.9.1.2', who: 'player',
    prompt: tr('Ölçtüğün değerler, paketlerin üstündeki değerin yarısından da az. Neden?', 'Your measured values are less than half of what the packets say. Why?'),
    options: [
      { t: tr('Isının çoğu suya değil havaya, kutunun metaline ve rüzgâra gitti; basit düzenek enerjinin hepsini yakalayamaz.', 'Most of the heat went into the air, the metal of the can and the wind rather than the water; a simple set-up can’t catch all the energy.'), ok: true },
      { t: tr('Yanarken enerjinin bir kısmı yok oldu.', 'Some of the energy disappeared while it burned.'), tag: 'energy_lost', fb: tr('Enerji yok olmaz, başka yere gider. Alevin yanından geçen havayı eline tut: sıcak! Kaybolan enerji orada.', 'Energy doesn’t disappear; it goes somewhere else. Hold your hand by the air flowing past the flame: it’s hot! That’s where the missing energy is.') },
      { t: tr('Paketlerdeki değerler yanlış yazılmış.', 'The values on the packets are wrong.'), fb: tr('Paket değerleri, besini saf oksijende, yalıtılmış çelik bir kapta yakan kalorimetrelerle ölçülür; ısının neredeyse hepsi yakalanır.', 'Packet values are measured by burning the food in pure oxygen inside an insulated steel vessel, where nearly all the heat is caught.') },
      { t: tr('Deney işe yaramadı; sonuçları atmalıyız.', 'The experiment didn’t work; we should throw the results away.'), fb: tr('Beşi de aynı düzenekte ölçüldü, yani hata hepsini aynı yönde etkiledi. Değerler düşük ama sıralama güvenilir.', 'All five were measured on the same set-up, so the error pushed them all the same way. The values are low, but the ranking can be trusted.') },
    ],
    explain: tr('Doğru. Buna sistematik hata denir: her ölçümü aynı yönde kaydırır. Bilim insanları bu yüzden hem değerleri hem de karşılaştırmaları ayrı ayrı sorgular. Aynı düzenekle ölçülen beş yiyeceği birbiriyle karşılaştırmak adildir; paketteki değerle karşılaştırmak için daha iyi yalıtılmış bir düzenek gerekir.', 'Correct. This is called systematic error: it shifts every measurement the same way. That is why scientists question the values and the comparisons separately. Comparing five foods measured on the same set-up is fair; comparing them with the packet needs a much better insulated set-up.') },
  azik_where: { case: 'azik', code: 'BİY.10.1.7', who: 'deniz',
    prompt: tr('Alp: “Yarın yokuşta yediğim cevizin enerjisi bacaklarımda tam olarak nerede açığa çıkacak?”', 'Alp: “Tomorrow on the climb, where exactly in my legs will the energy from the walnuts be released?”'),
    options: [
      { t: tr('Midende: ceviz sindirilirken enerjisi açığa çıkar, kan onu kaslara taşır.', 'In your stomach: the walnut releases its energy as it is digested, and the blood carries it to the muscles.'), tag: 'stomach_burns', fb: tr('Sindirim cevizi yağ asitlerine ve diğer küçük moleküllere ayırır; kan bu molekülleri taşır, enerjiyi değil. Enerji kas hücresinin içinde açığa çıkar.', 'Digestion splits the walnut into fatty acids and other small molecules; the blood carries these molecules, not the energy. The energy is released inside the muscle cells.') },
      { t: tr('Kas hücrelerinin mitokondrilerinde: yağ asitleri oksijenle adım adım yıkılır, enerji ATP’ye aktarılır ve sarkomerler ATP harcayarak kasılır.', 'In the mitochondria of your muscle cells: fatty acids are broken down step by step with oxygen, the energy passes to ATP, and the sarcomeres spend ATP to contract.'), ok: true },
      { t: tr('Kanında: enerji besinden doğrudan kana geçer.', 'In your blood: the energy passes from food straight into the blood.'), tag: 'food_is_energy', fb: tr('Kanda dolaşan şeker ve yağ asitleridir. Enerji ancak hücre onları solunumla yıktığında kullanılabilir hâle gelir.', 'What circulates in the blood is sugar and fatty acids. The energy only becomes usable once a cell breaks them down in respiration.') },
      { t: tr('Kemiklerinde: kemikler kasları iter.', 'In your bones: the bones push the muscles.'), fb: tr('Kemikler kaldıraçtır, iş yapan kaslardır. Kas hücresinin ×20000 görüntüsüne bak: kıvrımlı yapılar nerede?', 'Bones are levers; the muscles do the work. Look at the ×20000 view of the muscle cell: where are the folded structures?') },
    ],
    explain: tr('Doğru. Hücresel solunumda besin, mitokondride oksijenle yıkılır; açığa çıkan enerjinin bir kısmı ATP’ye aktarılır, kalanı ısı olur. Yokuşta terlemen bu yüzden. Soluduğun oksijen de, verdiğin karbondioksit de bu tepkimeye aittir.', 'Correct. In cellular respiration, food is broken down with oxygen in the mitochondria; part of the energy released passes to ATP and the rest becomes heat. That is why you sweat on a climb. The oxygen you breathe in and the carbon dioxide you breathe out both belong to this reaction.') },
  azik_lavoisier: { case: 'azik', code: 'BİY.9.1.1', who: 'deniz',
    prompt: tr('Alp: “Ama vücudumda ateş yok ki! Kalorimetrede yanan cevizle bacağımda ‘yanan’ ceviz aynı şey mi?”', 'Alp: “But there’s no fire in my body! Is the walnut burning in the calorimeter the same thing as the walnut ‘burning’ in my legs?”'),
    options: [
      { t: tr('Hayır, hiç alakası yok; vücutta enerji başka türlü çıkar.', 'No, nothing to do with each other; the body gets energy some other way.'), fb: tr('İkisinde de aynı maddeler harcanır ve aynı maddeler çıkar: besin ve oksijen girer, karbondioksit ve su çıkar.', 'Both use up the same substances and give off the same ones: food and oxygen go in, carbon dioxide and water come out.') },
      { t: tr('Aynı tepkime: besin oksijenle birleşir, karbondioksit ve su çıkar. Alevde enerji bir anda ısı olur; hücrede enzimler onu adım adım, bir kısmını ATP’ye aktararak serbest bırakır.', 'The same reaction: food combines with oxygen, and carbon dioxide and water come out. In the flame the energy all becomes heat at once; in the cell, enzymes release it step by step, passing part of it to ATP.'), ok: true },
      { t: tr('Oksijeni yalnızca alev kullanır; biz oksijeni vücudumuzu serinletmek için soluruz.', 'Only the flame uses oxygen; we breathe oxygen to cool our bodies down.'), tag: 'breath_cools', fb: tr('Soluduğun oksijen hücrelerine gider ve besini yıkmakta kullanılır. Serinlemek terle olur.', 'The oxygen you breathe goes to your cells and is used to break down food. Cooling down is sweat’s job.') },
    ],
    explain: tr('Doğru. 1780’lerde Lavoisier ve Laplace bunu bir kobayla gösterdi: hayvanın vücut ısısı, aynı miktarda karbondioksit veren kömür yanmasının ısısına çok yakındı. Solunumun yavaş bir yanma olduğunu gösteren bu deney, beslenme biliminin ve metabolizma kavramının başlangıcı sayılır.', 'Correct. In the 1780s Lavoisier and Laplace showed this with a guinea pig: the animal’s body heat was very close to the heat of burning enough charcoal to give the same amount of carbon dioxide. This experiment, showing that respiration is a slow combustion, is seen as the start of nutrition science and of the idea of metabolism.') },
  azik_pack: { case: 'azik', code: 'BİY.10.1.10', who: 'deniz',
    prompt: tr('Alp: “Tamam, ikna oldum. Dört saatlik yokuş için azığıma ne koyayım?”', 'Alp: “OK, you’ve convinced me. What should I pack for four hours uphill?”'),
    options: [
      { t: tr('Yalnızca lokum: şeker en hızlı enerji.', 'Just lokum: sugar is the fastest energy.'), tag: 'sugar_best', fb: tr('Şeker hızlıdır ama çabuk biter: kan şekeri yükselip düşer, yarı yolda yorulursun. Uzun yürüyüşte kaslar enerjinin çoğunu yağdan alır.', 'Sugar is fast but runs out fast: your blood sugar shoots up and drops, and you tire halfway. On a long walk, muscles get most of their energy from fat.') },
      { t: tr('Yalnızca ceviz: gram başına en çok enerjiyi o veriyor.', 'Just walnuts: they give the most energy per gram.'), fb: tr('Az yer kaplayan en iyi yakıt o, ama yağ yavaş sindirilir. Yorulduğun an için hızlı şeker, kasların için protein de lazım.', 'It’s the most compact fuel, but fat is digested slowly. You also need quick sugar for when you tire, and protein for your muscles.') },
      { t: tr('Karışık: yol boyu azar azar ceviz (az yer kaplayan, uzun süren enerji), leblebi (protein ve yavaş nişasta), yorulunca biraz kayısı ya da lokum. Bir de bol su.', 'A mix: a few walnuts along the way (compact, long-lasting energy), leblebi (protein and slow starch), and some apricot or lokum when you tire. And plenty of water.'), ok: true },
      { t: tr('Hiçbir şey: aç yürümek daha çok yağ yakar.', 'Nothing: walking hungry burns more fat.'), fb: tr('Dört saatlik yokuşta kasların glikojeni tükenir ve “duvara çarparsın”: başın döner, bacakların kesilir.', 'On a four-hour climb your muscles run out of glycogen and you “hit the wall”: dizzy, with legs that give out.') },
    ],
    explain: tr('Doğru. Her besin farklı iş görür: yağ yoğun ve uzun süreli yakıt, karbonhidrat hızlı yakıt, protein yapı malzemesidir. Vücut hepsini hücresel solunumda kullanır, ama farklı hızlarda. Çobanların azığında ceviz, peynir ve kuru meyvenin bir arada olması boşuna değil.', 'Correct. Each food does a different job: fat is a dense, long-lasting fuel, carbohydrate a quick fuel, and protein building material. The body uses them all in cellular respiration, but at different speeds. It’s no accident that a shepherd’s pack holds walnuts, cheese and dried fruit together.') },
  hucre_diff: { case: 'hucre', code: 'BİY.9.2.5', who: 'player',
    prompt: tr('İki preparatını yan yana düşün. Soğan zarı hücreleri ile yanak hücreleri arasında hangi farkı gördün?', 'Think of your two slides side by side. What difference did you see between the onion skin cells and the cheek cells?'),
    options: [
      { t: tr('Yanak hücrelerinde çekirdek yoktu.', 'The cheek cells had no nucleus.'), fb: tr('Vardı: metilen mavisiyle koyu maviye boyanan, ortadaki yuvarlak. Olgun alyuvar dışında insan hücrelerinin hepsinde çekirdek vardır.', 'They did: the round body in the middle, stained dark blue by methylene blue. Apart from mature red blood cells, all human cells have a nucleus.') },
      { t: tr('Soğan hücrelerinin dışında kalın bir hücre duvarı vardı, şekilleri düzgün ve dikdörtgendi, ortalarını koca bir koful kaplıyordu. Yanak hücreleri yalnızca zarla çevriliydi, yassı ve düzensizdi.', 'The onion cells had a thick cell wall outside, a regular rectangular shape and a huge vacuole filling the middle. The cheek cells were bounded only by a membrane, flat and irregular.'), ok: true },
      { t: tr('Soğan hücrelerinde kloroplast vardı, çünkü soğan bir bitki.', 'The onion cells had chloroplasts, because an onion is a plant.'), tag: 'green_plant', fb: tr('Soğan zarında tek bir kloroplast bile yoktu: etli yapraklar toprağın altında büyür, ışık görmez.', 'There wasn’t a single chloroplast in the onion skin: the scale leaves grow underground and never see light.') },
      { t: tr('Yanak hücrelerinin zarı yoktu, soğanınkinin vardı.', 'The cheek cells had no membrane; the onion cells did.'), fb: tr('Her canlı hücrenin zarı vardır. Yanak hücresinde en dıştaki sınır zardır; soğanda zar, duvarın hemen içindedir.', 'Every living cell has a membrane. In a cheek cell it is the outer boundary; in onion it lies just inside the wall.') },
    ],
    explain: tr('Doğru. Bitki ve hayvan hücrelerinin ortak parçaları zar, sitoplazma ve çekirdektir. Hücre duvarı ve büyük merkezi koful bitki hücresine özgüdür; kloroplast ise yalnızca ışık alan bitki hücrelerinde bulunur.', 'Correct. Plant and animal cells share a membrane, cytoplasm and a nucleus. A cell wall and a large central vacuole belong to plant cells, and chloroplasts are found only in plant cells that get light.') },
  hucre_protein: { case: 'hucre', code: 'BİY.9.2.5', who: 'player',
    prompt: tr('Bu tükürük bezi hücresi amilaz enzimini yapıp tükürüğe gönderiyor. Enzimin hücre içindeki yolu hangisi?', 'This salivary gland cell makes the enzyme amylase and sends it into the saliva. Which path does the enzyme take inside the cell?'),
    options: [
      { t: tr('Çekirdek yapar → doğrudan hücre zarından çıkar.', 'The nucleus makes it → it leaves straight through the membrane.'), tag: 'nucleus_makes', fb: tr('Çekirdek yalnızca tarifi (DNA’daki bilgiyi) saklar ve kopyasını gönderir. Proteini ribozomlar yapar.', 'The nucleus only keeps the recipe (the information in DNA) and sends out a copy. Ribosomes make the protein.') },
      { t: tr('Ribozom → granüllü ER → Golgi → salgı kofulu → hücre zarı ve dışarı.', 'Ribosome → rough ER → Golgi → secretory vesicle → cell membrane and out.'), ok: true },
      { t: tr('Lizozom yapar → Golgi paketler.', 'Lysosomes make it → the Golgi packages it.'), fb: tr('Lizozomlar sindirir, üretmez. Onların enzimleri de ribozomlarda, ER’de yapılıp Golgi’de paketlenir.', 'Lysosomes digest; they don’t make. Their own enzymes are also made on ribosomes and in the ER and packaged in the Golgi.') },
      { t: tr('Mitokondri yapar → sitoplazmada dışarı akar.', 'Mitochondria make it → it flows out through the cytoplasm.'), fb: tr('Mitokondri bu işin enerjisini (ATP) verir, proteini yapmaz.', 'Mitochondria supply the energy (ATP) for the job; they don’t make the protein.') },
    ],
    explain: tr('Doğru. Organeller bir üretim bandı gibi çalışır: ribozom proteini yapar, ER katlar ve taşır, Golgi paketler ve adresler, salgı kofulu zarla kaynaşıp içeriğini dışarı boşaltır. Mitokondri de bütün bu işin enerjisini sağlar.', 'Correct. The organelles work like a production line: ribosomes make the protein, the ER folds and carries it, the Golgi packages and addresses it, and secretory vesicles fuse with the membrane to empty it outside. Mitochondria supply the energy for all of it.') },
  hucre_bubble: { case: 'hucre', code: 'BİY.9.1.4', who: 'elder2',
    prompt: tr('Mehmet Dede: “İşte! Gördün mü? Kocaman, yusyuvarlak, kenarı kapkara. Hücre bu işte, senin o soluk şeylerin değil!”', 'Mehmet Dede: “There! See? Big, perfectly round, with a pitch-black rim. That’s a cell, not those pale things of yours!”'),
    options: [
      { t: tr('Haklısınız, en belirgin hücre bu.', 'You’re right, that’s the clearest cell.'), tag: 'bubble_cell', fb: tr('İçine bakın: çekirdek yok, sitoplazma yok, bomboş ve parlak. Lameli hızlı bastırınca altında hava kaldı.', 'Look inside it: no nucleus, no cytoplasm, empty and bright. You pressed the coverslip down fast and air got trapped underneath.') },
      { t: tr('Bu bir hava kabarcığı: lamel hızlı kapanınca altında hava kalır. Kenarı ışığın kırılmasından kapkara, içi boş. Hücreler soluk ve boyanmış bir çekirdek taşıyor.', 'That’s an air bubble: when the coverslip comes down fast, air is trapped under it. Its rim is black because light bends there, and it’s empty inside. The cells are pale, with a stained nucleus.'), ok: true },
      { t: tr('Bu soğanın çekirdeği.', 'That’s the onion’s nucleus.'), fb: tr('Çekirdek her hücrenin içinde küçük, boyanmış bir yuvarlaktır; bu kadar büyük ve boş olmaz.', 'A nucleus is a small stained round body inside each cell; it is never this big or empty.') },
    ],
    explain: tr('Doğru. Gözlem de bir beceridir: ne gördüğünü bilmek için neye bakacağını bilmek gerekir. Bilim insanları bu yüzden yeni bir aracın “hayaletlerini” (kabarcık, toz, çizik) önce tanımayı öğrenir.', 'Correct. Observing is a skill too: to know what you see, you need to know what to look for. That’s why scientists first learn to recognise a new instrument’s “ghosts” (bubbles, dust, scratches).') },
  hucre_theory: { case: 'hucre', code: 'BİY.9.1.1', who: 'elder2',
    prompt: tr('Mehmet Dede: “Soğanda gördük, yanakta gördük. Eee, bu şimdi ne demek oluyor?”', 'Mehmet Dede: “We saw them in the onion and in the cheek. So what does that mean, then?”'),
    options: [
      { t: tr('Hücre teorisi: bütün canlılar hücrelerden oluşur, hücre canlılığın en küçük birimidir ve her hücre başka bir hücreden gelir. 1830’larda Schleiden bitkilerde, Schwann hayvanlarda göstermişti.', 'Cell theory: all living things are made of cells, the cell is the smallest unit of life, and every cell comes from another cell. In the 1830s Schleiden showed it for plants and Schwann for animals.'), ok: true },
      { t: tr('Yalnızca bitkiler hücrelidir; yanaktakiler başka bir şey.', 'Only plants are made of cells; the ones in the cheek are something else.'), tag: 'plant_only_cells', fb: tr('Yanaktakilerin de zarı, sitoplazması ve çekirdeği vardı. Duvarları olmasa da onlar da hücre.', 'The cheek ones had a membrane, cytoplasm and a nucleus too. They have no wall, but they are cells.') },
      { t: tr('Hücreleri boya yapıyor; boyamadan önce yoklardı.', 'The stain makes the cells; they weren’t there before staining.'), fb: tr('Boya yalnızca var olanı görünür kılar. Mor soğan zarında hücreler boyasız da görünür.', 'Stain only makes visible what is already there. In red onion skin the cells show even without stain.') },
    ],
    explain: tr('Doğru. Hücre teorisi, mikroskobun icadından iki yüz yıl sonra, pek çok bilim insanının gözlemlerinin birleşmesiyle doğdu. Bugün tıbbın, tarımın ve biyoteknolojinin temelidir: hastalık, iyileşme ve büyüme hep hücrelerde olur.', 'Correct. Cell theory was born two hundred years after the microscope was invented, when the observations of many scientists came together. Today it underpins medicine, farming and biotechnology: disease, healing and growth all happen in cells.') },
  asi_cambium: { case: 'asi', code: 'BİY.9.2.8', who: 'player',
    prompt: tr('Aşıda kalemle anacın hangi katmanları birbirine değmeli ki ikisi kaynaşsın?', 'In a graft, which layers of scion and rootstock must touch for the two to knit together?'),
    options: [
      { t: tr('Öz: ortadaki yumuşak hücreler, merkez merkeze.', 'The pith: the soft cells in the middle, centre to centre.'), tag: 'center_graft', fb: tr('Öz hücreleri bölünmez. Üstelik kalem anaçtan ince olduğu için ortalanırsa kambiyumları hiç değmez.', 'Pith cells don’t divide. And since the scion is thinner than the rootstock, centring it means the cambium layers never touch.') },
      { t: tr('Kambiyum: kabuğun hemen altındaki, bölünebilen ince hücre katmanı. Yaranın iki yanından kallus yapar, sonra kaynaşıp yeni odun ve soymuk üretir.', 'The cambium: the thin layer of dividing cells just under the bark. It makes callus on both sides of the wound, then joins up and makes new wood and phloem.'), ok: true },
      { t: tr('Kabuk: dışarıdan bantla sıkıca yapışınca yeter.', 'The bark: it’s enough for it to stick firmly under the tape.'), fb: tr('Kabuğun dış kısmı ölü mantar hücrelerinden oluşur; korur ama büyümez.', 'The outer bark is made of dead cork cells; it protects but doesn’t grow.') },
      { t: tr('Odun: su boruları uç uca gelsin diye.', 'The wood: so that the water pipes line up.'), fb: tr('Odun hücreleri ölüdür; boru olarak iş görürler ama bölünemezler. Yeni boruları kambiyum yapar.', 'Wood cells are dead; they work as pipes but can’t divide. New pipes are made by the cambium.') },
    ],
    explain: tr('Doğru. Bitkilerde bölünme yeteneğini koruyan dokulara meristem denir; kambiyum gövdeyi kalınlaştıran bir meristemdir. Aşının tutması için iki meristemin yan yana gelip kaynaşması gerekir.', 'Correct. Plant tissues that keep the ability to divide are called meristems; the cambium is a meristem that thickens the stem. For a graft to take, two meristems must meet and fuse.') },
  asi_kinds: { case: 'asi', code: 'BİY.12.1.6', who: 'player',
    prompt: tr('Aşıyla çoğaltılan fidan, yaşlı ağacın tıpatıp kopyasıdır: bu bir eşeysiz üremedir. Aşağıdakilerden hangisi de eşeysiz üremeye örnektir?', 'A sapling made by grafting is an exact copy of the old tree: this is asexual reproduction. Which of these is also an example of asexual reproduction?'),
    options: [
      { t: tr('Buğday tanesinin toprakta çimlenmesi.', 'A grain of wheat sprouting in the soil.'), tag: 'seed_clone', fb: tr('Tohum döllenmeyle oluşur, yani eşeyli üremenin ürünüdür; her tohum yeni bir gen karışımıdır.', 'A seed forms by fertilisation, so it is the product of sexual reproduction; every seed is a new mix of genes.') },
      { t: tr('Patates yumrusunun gözlerinden, çileğin toprağa değen sürgünlerinden yeni bitkiler çıkması.', 'New plants growing from the eyes of a potato, or from a strawberry’s runners where they touch the soil.'), ok: true },
      { t: tr('Arının bir çiçekten öbürüne polen taşıması.', 'A bee carrying pollen from one flower to another.'), fb: tr('Tozlaşma, eşeyli üremenin ilk adımıdır.', 'Pollination is the first step of sexual reproduction.') },
      { t: tr('Kuluçkadaki yumurtadan civciv çıkması.', 'A chick hatching from an incubated egg.'), fb: tr('Döllenmiş yumurta iki ebeveynin genlerini taşır: eşeyli üreme.', 'A fertilised egg carries the genes of two parents: sexual reproduction.') },
    ],
    explain: tr('Doğru. Bitkilerde yumru, sürgün, çelik ve aşıyla yapılan vejetatif üreme, ata bitkinin genetik kopyalarını verir. Mayanın tomurcuklanması ve bakterinin ikiye bölünmesi de eşeysiz üremedir.', 'Correct. Vegetative reproduction in plants, by tubers, runners, cuttings and grafts, gives genetic copies of the parent plant. Yeast budding and bacteria splitting in two are asexual reproduction too.') },
  asi_pips: { case: 'asi', code: 'BİY.12.2.5', who: 'huseyin',
    prompt: tr('Hüseyin Usta: “Muhtar hâlâ ‘çekirdeğini ekelim, aynısı çıkar’ diyor. Söyle ona, neden çıkmaz?”', 'Hüseyin Usta: “The mukhtar still says ‘let’s plant its pips, the same apple will come up’. Tell him why it won’t.”'),
    options: [
      { t: tr('Çıkar; çekirdek ağacın küçük bir kopyasıdır.', 'It will; a pip is a little copy of the tree.'), tag: 'seed_clone', fb: tr('Çekirdek döllenmeyle oluşur: genlerinin yarısı bu ağaçtan, yarısı polenin geldiği başka bir ağaçtan gelir.', 'A pip forms by fertilisation: half its genes come from this tree and half from another tree, where the pollen came from.') },
      { t: tr('Elma çiçeği kendi poleniyle döllenmez; arılar başka bir çeşidin polenini getirir. Her çekirdek iki ağacın genlerinin yeni bir karışımıdır; fidanların her biri farklı bir elma verir, çoğu küçük ve ekşi.', 'An apple flower can’t be fertilised by its own pollen; bees bring pollen from another variety. Every pip is a new mix of two trees’ genes, so each seedling bears a different apple, most of them small and sour.'), ok: true },
      { t: tr('Çekirdekler ölüdür, hiç çimlenmez.', 'The pips are dead and never sprout.'), fb: tr('Çimlenirler; soğukta bir kış geçirince çoğu filizlenir. Ama çıkan ağaç başka bir elma verir.', 'They do sprout; after a cold winter most of them come up. But the tree that grows bears a different apple.') },
      { t: tr('Çıkar ama meyve vermesi yüz yıl sürer.', 'It will, but it takes a hundred years to fruit.'), fb: tr('Çekirdekten büyüyen elma altı ile on yılda meyve verir; ama o meyve Amasya elması olmaz.', 'An apple grown from a pip fruits in six to ten years, but its fruit won’t be an Amasya apple.') },
    ],
    explain: tr('Doğru. Eşeyli üremede iki ebeveynin genleri yeniden birleşir; yavru ikisine de tıpatıp benzemez. Bu, türün çeşitliliğini artırır ama bir çeşidi korumak isteyen bahçıvan için sorundur. Elma, armut, kiraz gibi meyve ağaçları bu yüzden yüzyıllardır aşıyla çoğaltılır.', 'Correct. In sexual reproduction the genes of two parents are recombined, and the offspring is an exact copy of neither. That increases a species’ variety, but it’s a problem for a gardener who wants to keep a variety. That’s why fruit trees like apple, pear and cherry have been grafted for centuries.') },
  asi_clone: { case: 'asi', code: 'BİY.10.2.8', who: 'huseyin',
    prompt: tr('Hüseyin Usta: “İki fidan da aynı ağacın dalından. Bütün bahçeyi böyle doldursak, hepsi aynı olsa, ne sakıncası olur?”', 'Hüseyin Usta: “Both saplings come from the same tree’s branch. If we filled the whole orchard like this, all of them the same, what harm would it do?”'),
    options: [
      { t: tr('Hiç sakıncası yok; aynı olmaları hep avantajdır.', 'No harm at all; being the same is always an advantage.'), tag: 'clone_safe', fb: tr('Aynı genler aynı zayıflıklar demektir. Bir hastalık birine işlerse hepsine işler.', 'The same genes mean the same weaknesses. If a disease takes one, it takes them all.') },
      { t: tr('Hepsi genetik olarak aynı (klon): bir hastalık ya da zararlı birine işlerse hepsine işleyebilir. Bu yüzden bahçede farklı çeşitleri de yaşatmak, yerel çeşitleri korumak gerekir.', 'They are all genetically identical (clones): if a disease or pest gets into one, it can get into them all. So an orchard should keep other varieties alive too, and local varieties should be protected.'), ok: true },
      { t: tr('Aşılı ağaçlar meyve vermez.', 'Grafted trees don’t bear fruit.'), fb: tr('Verir; bugün satılan elmaların neredeyse hepsi aşılı ağaçlardan gelir.', 'They do; almost all the apples sold today come from grafted trees.') },
      { t: tr('Klonlar zamanla birbirine karışıp bozulur.', 'Clones get mixed up and spoil over time.'), fb: tr('Klonlar karışmaz, hepsi aynı kalır. Sorun, aynı olmalarının ta kendisi.', 'Clones don’t mix; they all stay the same. Being the same is the problem itself.') },
    ],
    explain: tr('Doğru. 1840’larda İrlanda’daki patateslerin çoğu tek bir çeşitten, yani birbirinin kopyası bitkilerden oluşuyordu; mantara benzeyen bir hastalık etkeni hepsini çürüttü ve büyük bir kıtlık yaşandı. Genetik çeşitlilik tarımı ve ekosistemleri değişen koşullara karşı dayanıklı kılar.', 'Correct. In the 1840s most of Ireland’s potatoes were a single variety, plants that were copies of one another; a fungus-like disease rotted them all and a great famine followed. Genetic diversity makes farming and ecosystems resilient to changing conditions.') },
  pas_fungus: { case: 'pas', code: 'BİY.9.1.6', who: 'player',
    prompt: tr('Osman Amca’nın buğdayındaki turuncu toz nedir?', 'What is the orange dust on Osman Amca’s wheat?'),
    options: [
      { t: tr('Toprakta demir fazla; demir yaprakta paslanmış.', 'There’s too much iron in the soil; the iron has rusted in the leaf.'), tag: 'rust_is_iron', fb: tr('Mercekte gördüğün toz cansız değil: her tanesi çeperi olan, çimlenebilen bir hücre. Yaprağın içinde de mantar iplikleri var.', 'The dust under your lens isn’t lifeless: every grain is a cell with a wall that can sprout. And there are fungal threads inside the leaf.') },
      { t: tr('Bir mantarın sporları. Mantar yaprağın içinde yaşıyor, emeçleriyle canlı hücrelerin besinini çalıyor; olgunlaşınca yaprağı yırtıp sporlarını rüzgâra bırakıyor.', 'The spores of a fungus. The fungus lives inside the leaf and steals the living cells’ food with its haustoria; when it is ripe it tears the leaf open and lets its spores go on the wind.'), ok: true },
      { t: tr('Güneş yakmış; yanan yerler turuncu olur.', 'The sun has scorched it; burnt spots turn orange.'), fb: tr('Güneş yanığı kuru, kahverengi lekeler yapar; kabarcık ve toz yapmaz. Bu toz parmağına bulaşıyor ve mikroskopta dikenli hücreler olarak görünüyor.', 'Sunscald makes dry brown patches, not blisters and dust. This dust rubs off on your finger and shows up as spiny cells under the microscope.') },
      { t: tr('Böcek yumurtaları.', 'Insect eggs.'), fb: tr('Böcekler yumurtalarını yaprağın üstüne kümeler halinde bırakır; yumurtalar yaprağın derisini içeriden yırtıp çıkmaz. Emeç ve mantar iplikleri bir mantarın işaretidir.', 'Insects lay their eggs in clusters on top of the leaf; eggs don’t tear through the leaf’s skin from inside. Haustoria and fungal threads are the mark of a fungus.') },
    ],
    explain: tr('Doğru. Sarı pas (Puccinia striiformis) bir mantardır. Mantarlar ne bitki ne hayvandır; kendi besinini yapamaz, başka canlılardan beslenir. Pas mantarı bir parazittir: buğdayı hemen öldürmez ama besinini çalar, başaklar cılız kalır. Bir kabarcık binlerce spor saçar ve rüzgâr onları kilometrelerce taşır.', 'Right. Stripe rust (Puccinia striiformis) is a fungus. Fungi are neither plants nor animals; they can’t make their own food and feed on other living things. Rust is a parasite: it doesn’t kill the wheat at once but steals its food, so the ears stay thin. One blister sheds thousands of spores, and the wind carries them for kilometres.') },
  pas_spread: { case: 'pas', code: 'BİY.10.2.8', who: 'player',
    prompt: tr('Aynı sporlar iki tarlaya da uçtu. Pas neden tek çeşit tarlayı sardı da karışık tarlada durdu?', 'The same spores flew into both fields. Why did the rust sweep the one-variety field but stop in the mixed one?'),
    options: [
      { t: tr('Karışık tarlaya daha çok gübre atılmış.', 'The mixed field got more fertiliser.'), fb: tr('Masada iki tarlaya da aynı şey yapıldı; tek fark bitkilerdi. Üstelik fazla azotlu gübre pası çoğu zaman artırır.', 'At the table both fields were treated the same; only the plants differed. And too much nitrogen fertiliser often makes rust worse.') },
      { t: tr('Tek çeşit tarlada bütün bitkiler genetik olarak aynı: biri hastalanabiliyorsa hepsi hastalanabiliyor, pas bitkiden bitkiye atlıyor. Karışık tarlada sporların çoğu dayanıklı bitkilere konup ölüyor, zincir kırılıyor.', 'In the one-variety field every plant is genetically the same: if one can fall ill, they all can, and the rust jumps from plant to plant. In the mixed field most spores land on resistant plants and die, so the chain breaks.'), ok: true },
      { t: tr('Aynı bitkilerin yan yana olması hep iyidir; karışık tarla yalnızca şanslıydı.', 'Having identical plants side by side is always good; the mixed field was just lucky.'), tag: 'clone_safe', fb: tr('Masayı başka bir yerden başlatıp yeniden dene: her seferinde benzer sonuç çıkıyor. Bu şans değil.', 'Start the table from another spot and try again: the result comes out much the same every time. That isn’t luck.') },
      { t: tr('Rüzgâr karışık tarlaya daha az esti.', 'The wind blew less on the mixed field.'), fb: tr('Masada iki tarlaya aynı rüzgârla aynı sporlar gönderildi; uçan turuncu noktalar iki tarlada da aynıydı.', 'At the table the same spores went to both fields on the same wind; the flying orange dots were the same in both.') },
    ],
    explain: tr('Doğru. Hastalığın yayılması için sporun konduğu bitkinin ona açık olması gerekir. Tek çeşit tarla, pas için uçtan uca kurulmuş bir sofra gibidir. Karışık tarlada dayanıklı bitkiler sporları yakalayıp harcar ve hassas bitkileri birbirinden uzak tutar. Buna çeşit karışımı denir ve hastalığı ilaçsız yavaşlatır.', 'Right. For a disease to spread, the plant a spore lands on has to be open to it. A one-variety field is like one long table laid for the rust. In a mixed field, resistant plants catch and waste the spores and keep the open plants apart. This is called a variety mixture, and it slows disease without any spray.') },
  pas_osman: { case: 'pas', code: 'BİY.10.2.8', who: 'osman',
    prompt: tr('Osman Amca: “Peki ben ne yapayım? Her hafta ilaç mı atayım?”', 'Osman Amca: “So what should I do? Spray every week?”'),
    options: [
      { t: tr('Evet, her hafta ilaçlayın; başka çare yok.', 'Yes, spray every week; there’s no other way.'), tag: 'spray_only', fb: tr('Her hafta ilaç pahalıdır, topraktaki ve sudaki canlılara zarar verir ve mantarın ilaca alışmasını hızlandırır. Hastalığı ilaçsız yavaşlatmanın yolları var.', 'Weekly spraying is expensive, harms life in the soil and water, and helps the fungus get used to the spray faster. There are ways to slow the disease without spraying.') },
      { t: tr('Gelecek yıl birkaç farklı çeşidi karışık ekin ya da Nine’nin karışık tohumundan alın. Her yıl aynı tarlaya buğday ekmeyin, gübreyi abartmayın. İlacı ancak gerekirse, bir uzmana danışarak kullanın.', 'Next year sow several different varieties mixed, or take some of Grandma’s mixed seed. Don’t sow wheat in the same field every year, and don’t overdo the fertiliser. Use a spray only if needed, after asking an expert.'), ok: true },
      { t: tr('Paslı tarlayı yakın; gelecek yıl aynı tohumu yeniden ekin.', 'Burn the rusty field and sow the same seed again next year.'), fb: tr('Pas sporları rüzgârla uzaktan da gelir. Aynı hassas çeşidi yeniden ekerseniz tarla yine pas için kurulmuş bir sofra olur.', 'Rust spores also come from far away on the wind. Sow the same susceptible variety again and the field is a table laid for the rust once more.') },
    ],
    explain: tr('Doğru. Çeşit karışımı, ekim nöbeti ve ölçülü gübre hastalığı ilaçsız yavaşlatır. Nine’nin yerel tohumları bu yüzden değerlidir: içlerinde birbirinden farklı genler saklıdır ve yarının yeni hastalığına dayanacak bitki belki onların arasındadır.', 'Right. Variety mixtures, crop rotation and moderate fertiliser slow disease without spraying. That’s why Grandma’s local seeds are precious: they hold many different genes, and the plant that stands up to tomorrow’s new disease may be among them.') },
  kompost_heat: { case: 'kompost', code: 'BİY.10.1.7', who: 'player',
    prompt: tr('Nine’nin yığınının içi neden 60 °C?', 'Why is the inside of Grandma’s heap 60 °C?'),
    options: [
      { t: tr('Güneş ısıtıyor; yığın koyu renkli olduğu için ısıyı tutuyor.', 'The sun heats it; the heap is dark, so it holds the heat.'), tag: 'heat_from_sun', fb: tr('Öyle olsaydı en sıcak yer yığının güneşe bakan yüzeyi olurdu. Oysa en sıcak yer ortası, kışın bile.', 'If so, the hottest spot would be the sunny surface of the heap. But the hottest spot is the middle, even in winter.') },
      { t: tr('Milyarlarca bakteri ve mantar artıkları oksijenle parçalayıp enerji alıyor; bu solunumun açığa çıkardığı ısı yığında birikiyor.', 'Billions of bacteria and fungi break the waste down with oxygen for energy; the heat released by this respiration builds up in the heap.'), ok: true },
      { t: tr('Çürüyen şeyler canlılarla ilgisi olmadan, kendiliğinden ısınır.', 'Rotting things warm up by themselves, with no living things involved.'), fb: tr('Kompostu fırında pişirip içindeki canlıları öldürürsen bir daha ısınmaz. Isıyı canlılar yapıyor.', 'Bake the compost in an oven to kill everything in it, and it never warms up again. Living things make the heat.') },
      { t: tr('Solucanlar kıpırdayarak ısıtıyor.', 'The worms warm it by wriggling.'), fb: tr('Solucanlar sıcağı sevmez; 35 °C’nin üstünde yığının serin kenarlarına kaçarlar. Isıyı çok daha küçük canlılar yapıyor.', 'Worms don’t like heat; above 35 °C they flee to the cool edges of the heap. Much smaller living things make the heat.') },
    ],
    explain: tr('Doğru. Tıpkı bizim hücrelerimiz gibi, mikroplar da besini oksijenle parçalar ve enerjinin bir kısmı ısı olarak açığa çıkar. Tek bir mikrobun ısısı çok azdır ama bir avuç kompostta milyarlarcası vardır ve yığın ısıyı yorgan gibi tutar.', 'Right. Just like our own cells, microbes break food down with oxygen, and part of the energy comes out as heat. One microbe’s heat is tiny, but a handful of compost holds billions of them, and the heap keeps the heat in like a quilt.') },
  kompost_smell: { case: 'kompost', code: 'BİY.10.2.4', who: 'player',
    prompt: tr('Sevim Hanım’ın yığını neden soğuk kaldı ve koktu?', 'Why did Sevim’s heap stay cold and smell?'),
    options: [
      { t: tr('Her kompost kokar; kokması iyi çürüdüğünü gösterir.', 'All compost smells; the smell shows it is rotting well.'), tag: 'compost_rot_bad', fb: tr('Kasada kurduğun yığın ısındı ama kokmadı. İyi kompost orman toprağı gibi kokar.', 'The heap you built in the bin heated up but didn’t smell. Good compost smells like forest soil.') },
      { t: tr('Hava soğuktu; yığın üşüdü.', 'The weather was cold; the heap got chilly.'), fb: tr('Aynı havada Nine’nin yığını buğu buğu tütüyor. Sorun havada değil, yığının içinde.', 'In the same weather Grandma’s heap is steaming. The problem isn’t the weather, it’s inside the heap.') },
      { t: tr('Yalnızca yaş, yeşil çim vardı: sıkışıp havasız kaldı ve çok ıslaktı. Havasız mikroplar yavaş çalışıp amonyak ve kükürtlü gaz çıkardı.', 'It was only wet green grass: it packed down airless and too wet. Airless microbes worked slowly and gave off ammonia and sulphur gas.'), ok: true },
    ],
    explain: tr('Doğru. Kompost bir yemek tarifi gibidir: kahverengi (karbon, hava boşluğu), yeşil (azot, su), nem ve hava. Biri eksik kalırsa mikroplar ya aç kalır ya boğulur.', 'Right. Compost is like a recipe: brown (carbon, air pockets), green (nitrogen, water), damp and air. Leave one out and the microbes either go hungry or suffocate.') },
  kompost_sevim: { case: 'kompost', code: 'BİY.10.2.5', who: 'sevim',
    prompt: tr('Sevim Hanım: “Peki şimdi ne yapayım? Hepsini çöpe mi atayım?”', 'Sevim: “So what do I do now? Throw the lot in the bin?”'),
    options: [
      { t: tr('Üstünü naylonla sıkıca örtün, koku dışarı çıkmasın.', 'Cover it tightly with plastic so the smell stays in.'), fb: tr('Naylon havayı büsbütün keser: koku içeride artar, çürüme durur. Yığının nefes alması gerekiyor.', 'Plastic cuts the air off completely: the smell builds up inside and the rotting stops. The heap needs to breathe.') },
      { t: tr('Atmayın! Çimin üstüne iki katı kuru yaprak ya da saman karıştırın, sıkılmış sünger kadar nemli tutun, haftada bir çatalla karıştırın. Birkaç ayda kara, kokusuz toprak olur.', 'Don’t throw it away! Mix in twice as much dry leaves or straw, keep it as damp as a wrung-out sponge, and turn it with a fork once a week. In a few months it will be dark, sweet-smelling soil.'), ok: true },
      { t: tr('Çöpe atın; bahçeye marketten kimyasal gübre alırsınız.', 'Throw it out; buy chemical fertiliser for the garden.'), fb: tr('Çöplüğe giden bahçe artığı havasız çürür ve metan çıkarır. Kompost olursa aynı besinler bedavaya toprağa döner.', 'Garden waste sent to the landfill rots without air and gives off methane. As compost, the same nutrients go back into the soil for free.') },
    ],
    explain: tr('Doğru. Artığı atmak yerine toprağa geri döndürmek, madde döngüsünü bahçede kapatır: çöp azalır, toprak zenginleşir, gübre parası cepte kalır. Sürdürülebilir tarım buna dayanır.', 'Right. Returning waste to the soil instead of throwing it away closes the matter cycle in the garden: less rubbish, richer soil, and money saved on fertiliser. Sustainable farming rests on this.') },
  kabak_parts: { case: 'kabak', code: 'BİY.12.1.11', who: 'player',
    prompt: tr('Polen dişi çiçeğin hangi yapısına konmalı, kabak ve çekirdekleri nereden gelişir?', 'Where on the female flower must pollen land, and what do the squash and its seeds grow from?'),
    options: [
      { t: tr('Taç yapraklara konar; kabak taç yapraklardan gelişir.', 'On the petals; the squash grows from the petals.'), fb: tr('Taç yapraklar arıyı çeker, sonra solup düşer. Kabak çiçeğin altındaki minik kabaktan, yani yumurtalıktan gelişir.', 'The petals draw the bee in, then wilt and drop. The squash grows from the baby squash under the flower: the ovary.') },
      { t: tr('Dişicik tepesine konar; polen tüpü tohum taslaklarına iner. Döllenen tohum taslakları çekirdek, yumurtalık da kabak olur.', 'On the stigma; a pollen tube grows down to the ovules. The fertilised ovules become the seeds, and the ovary becomes the squash.'), ok: true },
      { t: tr('Nektar halkasına konar; nektar poleni tohuma çevirir.', 'On the nectary; the nectar turns the pollen into seed.'), fb: tr('Nektar arıya verilen şekerli ödüldür. Polen tepeye konmalı.', 'Nectar is the bee’s sugary reward. Pollen has to land on the stigma.') },
      { t: tr('Erkek çiçeğin başçığına konar; kabak erkek çiçekten gelişir.', 'On the male flower’s anthers; the squash grows from the male flower.'), fb: tr('Erkek çiçek polen verir ama hiç kabak yapmaz: yumurtalığı yoktur.', 'The male flower gives pollen but never makes a squash: it has no ovary.') },
    ],
    explain: tr('Doğru. Kabak tek eşeyli çiçekler açar: erkek çiçek polen üretir, dişi çiçeğin altında yumurtalık vardır. Tepeye konan her polen bir tüp uzatır ve bir tohum taslağını döller. Döllenmeden sonra yumurtalık meyveye (kabağa), tohum taslakları tohuma dönüşür.', 'Correct. Squash has separate male and female flowers: the male flower makes pollen, and the female flower has an ovary underneath. Each grain that lands on the stigma grows a tube and fertilises one ovule. After fertilisation the ovary becomes the fruit (the squash) and the ovules become seeds.') },
  kabak_bee: { case: 'kabak', code: 'BİY.10.2.2', who: 'player',
    prompt: tr('Arı kabak çiçeğinden nektar alıyor, kabak da polenini arıya taşıtıyor. Bu ilişkinin adı ne?', 'The bee takes nectar from the squash flower, and the squash has the bee carry its pollen. What is this relationship called?'),
    options: [
      { t: tr('Asalaklık: arı çiçeği sömürür.', 'Parasitism: the bee exploits the flower.'), fb: tr('Asalaklıkta bir taraf zarar görür. Burada çiçek de kazanıyor: tozlanıyor.', 'In parasitism one side is harmed. Here the flower gains too: it gets pollinated.') },
      { t: tr('Mutualizm: iki taraf da kazanır; arı besin alır, bitki tozlanır.', 'Mutualism: both sides gain; the bee gets food and the plant gets pollinated.'), ok: true },
      { t: tr('Kommensalizm: arı kazanır, bitki için fark etmez.', 'Commensalism: the bee gains and it makes no difference to the plant.'), fb: tr('Bitki için büyük fark eder: arı olmadan kabak poleni dişi çiçeğe ulaşamaz.', 'It makes a big difference to the plant: without the bee, squash pollen can’t reach the female flower.') },
      { t: tr('Rekabet: ikisi aynı besin için yarışır.', 'Competition: the two fight over the same food.'), fb: tr('Arı ve kabak aynı kaynağı kullanmıyor; birbirlerine yardım ediyorlar.', 'The bee and the squash don’t use the same resource; they help each other.') },
    ],
    explain: tr('Doğru. İki türün de kazandığı ilişkiye mutualizm denir. Kabak poleni ağır ve yapışkandır, rüzgârla uçmaz; bu yüzden kabak tamamen arılara bağlıdır. Arıya zarar veren bir ilaç kabak hasadını da düşürür.', 'Correct. A relationship where both species gain is called mutualism. Squash pollen is heavy and sticky and doesn’t blow in the wind, so squash depends completely on bees. A spray that harms bees also cuts the squash harvest.') },
  kabak_cross: { case: 'kabak', code: 'BİY.12.2.5', who: 'fatma',
    prompt: tr('Fatma Teyze: “Geçen yıl tohumunu aldığım kabak atası gibiydi, tertemizdi. Ama çekirdeğinden bu siğilli şeyler çıktı. Nasıl olur?”', 'Fatma Teyze: “Last year the squash I took seed from looked just like its ancestors. But its seeds grew these warty things. How can that be?”'),
    options: [
      { t: tr('Tohum eskidiği için bozulmuş; eski tohum hep böyle yapar.', 'The seed went bad with age; old seed always does this.'), fb: tr('Eski tohum daha az çimlenir ama çıkan bitkinin kabağını değiştirmez. Değişen, genler.', 'Old seed sprouts less well, but it doesn’t change the squash the plant bears. What changed is the genes.') },
      { t: tr('Kabağın kendisi anne bitkinin dokusudur, o yüzden değişmedi. Ama içindeki her çekirdeğin genlerinin yarısı polenden geldi: arı süs kabağının polenini getirmiş. Karışma ancak bu yıl, o çekirdeklerden çıkan bitkilerde göründü.', 'The squash itself is the mother plant’s tissue, so it didn’t change. But half the genes in every seed inside came from the pollen: a bee had brought gourd pollen. The cross only showed this year, in the plants grown from those seeds.'), ok: true },
      { t: tr('Yabancı polen konunca kabak daha o yıl değişir; geçen yıl polen gelmemiş.', 'Foreign pollen changes the squash the same year; last year no pollen came.'), tag: 'fruit_shows_cross', fb: tr('Polen gelmeseydi kabak hiç büyümezdi. Tozlanan çiçeğin kabağı anne bitkiye benzer; yabancı genler içindeki çekirdeklerde saklanır.', 'Without pollen the squash wouldn’t have grown at all. The squash of a pollinated flower looks like the mother plant; the foreign genes hide in the seeds inside it.') },
      { t: tr('Toprak değişti; kabağın şeklini toprak belirler.', 'The soil changed; the soil decides the squash’s shape.'), fb: tr('Toprak bitkinin ne kadar büyüdüğünü etkiler ama siğilli, çizgili bir kabak yapmaz. Bu şekil genlerden geliyor.', 'Soil affects how well a plant grows, but it doesn’t make a warty, striped squash. That shape comes from the genes.') },
    ],
    explain: tr('Doğru. Döllenmede tohumdaki embriyo genlerinin yarısını anneden (yumurta hücresi), yarısını polenden alır. Meyvenin eti ise annenin dokusudur. Bu yüzden karışma bir kuşak gecikmeyle görünür. Süs kabağıyla sakız kabağı aynı türdendir (Cucurbita pepo) ve birbirlerini kolayca tozlar. Süs kabağından gelen genler kabağa acılık da taşıyabilir: acı kabak yenmez, zehirli olabilir.', 'Correct. At fertilisation the embryo in the seed gets half its genes from the mother (the egg cell) and half from the pollen. The flesh of the fruit, though, is the mother’s tissue. That is why a cross shows up a generation late. Ornamental gourds and summer squash are the same species (Cucurbita pepo) and pollinate each other easily. Genes from the gourds can also bring bitterness: a bitter squash must not be eaten, as it can be poisonous.') },
  kabak_keep: { case: 'kabak', code: 'BİY.10.2.8', who: 'fatma',
    prompt: tr('Fatma Teyze: “Peki bu ata kabağını bundan sonra nasıl saf tutacağız? Komşu da süs kabağını sökmez.”', 'Fatma Teyze: “So how do we keep this heirloom squash pure from now on? The neighbour won’t pull up her gourds.”'),
    options: [
      { t: tr('Her yıl marketten melez (F1) tohum alırız; o hep aynı çıkar.', 'We buy hybrid (F1) seed from the shop every year; it always comes out the same.'), tag: 'hybrid_breeds_true', fb: tr('Melez tohum bir yıl düzgün çıkar ama onun tohumu ayrışır; her yıl yeniden satın almak gerekir. Üstelik ata kabağı tamamen kaybolur.', 'Hybrid seed comes out even for one year, but its own seed splits apart, so you must buy again every year. And the heirloom squash is lost for good.') },
      { t: tr('Arıları kovmak için bahçeyi ilaçlarız.', 'We spray the garden to keep the bees away.'), fb: tr('Arı olmadan kabak tozlanmaz, hiç ürün olmaz. İlaç çevredeki başka canlılara da zarar verir.', 'Without bees the squash isn’t pollinated and there is no crop at all. The spray harms other living things around too.') },
      { t: tr('Tohumluk kabakları elle tozlayıp etiketleriz, çiçeği kapalı tutarız; tohumu birkaç farklı bitkiden alır, zarfları köyde paylaşır, bir kısmını da tohum bankasına veririz.', 'We hand-pollinate and tag the squash we keep for seed and keep the flowers closed; we take seed from several plants, share the packets around the village and give some to the seed bank.'), ok: true },
      { t: tr('Tohumu en büyük tek kabaktan alırız; büyük kabağın tohumu saf olur.', 'We take seed from the single biggest squash; a big squash has pure seed.'), fb: tr('Büyüklük tohumun hangi polenle döllendiğini göstermez. Tek bir bitkiden tohum almak da çeşidin genetik çeşitliliğini daraltır.', 'Size doesn’t show which pollen fertilised the seed. And taking seed from a single plant narrows the variety’s genetic diversity.') },
    ],
    explain: tr('Doğru. Ata tohumları yüzyıllar boyunca yerel iklime ve toprağa uymuş çeşitlerdir; genetik çeşitliliğin deposudur. Onları korumanın yolu tohumu saf tutmak (elle tozlama, çeşitler arasında mesafe), birçok bitkiden tohum almak ve tohumu paylaşmaktır. Kabakta iki çeşit arasında en az 800 metre olmalıdır; bahçede bu mesafe yoksa elle tozlama tek çaredir.', 'Correct. Heirloom seeds are varieties that have adapted to the local climate and soil over centuries: stores of genetic diversity. The way to protect them is to keep the seed pure (hand-pollinating, distance between varieties), to take seed from many plants, and to share it. With squash there should be at least 800 metres between two varieties; where a garden hasn’t got that distance, hand-pollination is the only way.') },
  leylek_ten: { case: 'leylek', code: 'BİY.10.2.3', who: 'player',
    prompt: tr('Çayırın bitkileri bir yazda güneşten 10 000 birim enerji bağlıyor. Otçulları yiyen etçillere (örümcek, uğur böceği) bu enerjinin yaklaşık ne kadarı ulaşır?', 'In one summer the meadow’s plants capture 10,000 units of energy from the sun. Roughly how much of it reaches the meat-eaters (spiders, ladybirds) that eat the plant-eaters?'),
    options: [
      { t: tr('10 000: enerji basamaktan basamağa aynen geçer.', '10,000: energy passes unchanged from level to level.'), tag: 'energy_all_up', fb: tr('Her basamakta enerjinin çoğu solunumda ısıya dönüşür; bir kısmı yenmeden kalır ya da dışkıyla atılır.', 'At every level most of the energy turns into heat in respiration; some is never eaten, or leaves in droppings.') },
      { t: tr('Yaklaşık 1 000.', 'About 1,000.'), fb: tr('Bu, otçullara ulaşan pay. Etçiller bir basamak daha yukarıda: orada bir kez daha kayıp var.', 'That is the plant-eaters’ share. Meat-eaters are one level higher, and there is another loss on the way.') },
      { t: tr('Yaklaşık 100: her basamakta enerjinin kabaca onda biri bir üst basamağa geçer.', 'About 100: at each level roughly a tenth of the energy passes to the level above.'), ok: true },
      { t: tr('Hiç: etçiller bitki yemez.', 'None: meat-eaters don’t eat plants.'), fb: tr('Etçiller bitkinin enerjisini otçullar aracılığıyla alır; her zincirin başında güneşi yakalayan bitkiler vardır.', 'Meat-eaters get the plants’ energy by way of the plant-eaters; every food chain starts with plants capturing sunlight.') },
    ],
    explain: tr('Doğru. Bitkiler 10 000 → otçullar ~1 000 → etçiller ~100 → leylek gibi üst tüketiciler ~10. Her basamakta daha az birey beslenir ve piramit yukarı doğru daralır. Tabanı ilaçla çöken piramidin tepesinde leylek yavrusu aç kalır.', 'Correct. Plants 10,000 → plant-eaters ~1,000 → meat-eaters ~100 → top consumers like storks ~10. Fewer individuals can be fed at each level, and the pyramid narrows towards the top. When spray knocks out the base, the stork chick at the top goes hungry.') },
  leylek_web: { case: 'leylek', code: 'BİY.10.2.2', who: 'player',
    prompt: tr('Yaprağın altında dört komşu: bitkinin özsuyunu emen bit, biti yiyen uğur böceği, bitten şekerli damla alıp onu koruyan karınca, bitin içinde büyüyen arı larvası. Hangisi doğru eşleşme?', 'Four neighbours under the leaf: the aphid sucking the plant’s sap, the ladybird eating the aphid, the ant taking sugary drops from the aphid and guarding it, and a wasp larva growing inside an aphid. Which pairing is right?'),
    options: [
      { t: tr('Uğur böceği–bit: avcılık; karınca–bit: mutualizm; arı larvası–bit: parazitlik.', 'Ladybird–aphid: predation; ant–aphid: mutualism; wasp larva–aphid: parasitism.'), ok: true },
      { t: tr('Karınca–bit: parazitlik, çünkü karınca bitin şekerini alıyor.', 'Ant–aphid: parasitism, because the ant takes the aphid’s sugar.'), fb: tr('Bit de kazanıyor: karınca onu avcılardan koruyor. İki tarafın kazandığı ilişki mutualizmdir.', 'The aphid gains too: the ant guards it from hunters. A relationship in which both sides gain is mutualism.') },
      { t: tr('Arı larvası–bit: mutualizm, çünkü larva bitin içinde korunuyor.', 'Wasp larva–aphid: mutualism, because the larva is sheltered inside the aphid.'), fb: tr('Bit ölüyor. Bir tarafın zarar gördüğü bu ilişki parazitliktir.', 'The aphid dies. A relationship in which one side is harmed is parasitism.') },
      { t: tr('Uğur böceği ile bit rakiptir: aynı besin için yarışırlar.', 'The ladybird and the aphid are rivals: they compete for the same food.'), tag: 'predator_harm', fb: tr('Uğur böceği bitkiyi değil, bitin kendisini yer: bu avcılıktır. Ürüne de dokunmaz.', 'The ladybird doesn’t eat the plant; it eats the aphid itself, which is predation. It never touches the crop.') },
    ],
    explain: tr('Doğru. Bir komünitede türler yalnızca yiyip yenmez: avcılık, rekabet, mutualizm, kommensalizm ve parazitlik bir arada yürür. Bu ilişkilerin çoğu bitleri dengede tutar; ilaç ise avcıları ve parazit arıları da öldürür ve dengeyi bozar.', 'Correct. In a community, species don’t just eat and get eaten: predation, competition, mutualism, commensalism and parasitism all run side by side. Most of these relationships keep the aphids in check; spray kills the hunters and parasitic wasps too, and upsets the balance.') },
  leylek_spray: { case: 'leylek', code: 'BİY.10.2.5', who: 'ayten',
    prompt: tr('Ayten: “Kooperatif başkanı soruyor: ‘Çekirge ve bit ürünü yiyor. İlaçlamazsak ne yapacağız?’ Ne önerirsin?”', 'Ayten: “The head of the cooperative asks: ‘Grasshoppers and aphids eat the crop. If we don’t spray, what do we do?’ What would you suggest?”'),
    options: [
      { t: tr('Daha güçlü bir ilaçla bütün çayırı yeniden ilaçlamak: böcekler bitsin.', 'Spray the whole meadow again with something stronger, and be done with insects.'), tag: 'spray_pests_only', fb: tr('İlaç zararlıyla avcıyı ayırmaz. Zararlılar avcılardan hızlı çoğaldığı için bir sonraki salgın daha büyük olur; leylek de, arı da aç kalır.', 'Spray can’t tell a pest from a hunter. The pests breed faster than their hunters, so the next outbreak is bigger, and the storks and bees go hungry too.') },
      { t: tr('Tarla kenarlarına ilaçsız, çiçekli şeritler bırakıp avcı böcekleri korumak; zararlıyı düzenli saymak ve ilacı yalnızca gerçekten gerekince, dar alanda, arıların uçmadığı saatte kullanmak.', 'Leave unsprayed flower strips along the field edges to shelter the hunting insects; count the pests regularly, and spray only when truly needed, on a small patch, at an hour when the bees aren’t flying.'), ok: true },
      { t: tr('Leylekleri başka bir köye taşımak.', 'Move the storks to another village.'), fb: tr('Sorun leylekte değil, besin piramidinin tabanında. Leylek aç kalıyorsa kurbağa, kırlangıç ve arı da zarar görüyor.', 'The problem isn’t the storks; it’s the base of the food pyramid. If storks go hungry, so do frogs, swallows and bees.') },
      { t: tr('Uğur böceklerini ve örümcekleri de yok etmek: onlar da çayırın zararlısı.', 'Get rid of the ladybirds and spiders too: they are pests of the meadow as well.'), tag: 'predator_harm', fb: tr('Uğur böceği ve örümcek ürüne dokunmaz, zararlıları yer. Çiftçinin bedava işçileridir.', 'Ladybirds and spiders don’t touch the crop; they eat the pests. They are the farmer’s unpaid workers.') },
    ],
    explain: tr('Doğru. Buna entegre zararlı yönetimi denir: önce doğal düşmanları korumak, zararlıyı saymak, ilacı son çare olarak ve dar alanda kullanmak. Tarla kenarındaki çiçekli şeritler avcı böceklere, parazit arılara ve tozlayıcılara yuva olur. Sürdürülebilir tarım, ürünü korurken ekosistemi de ayakta tutar.', 'Correct. This is called integrated pest management: protect the natural enemies first, count the pests, and use spray as a last resort on a small area. Flower strips along field edges give homes to hunting insects, parasitic wasps and pollinators. Sustainable farming protects the crop while keeping the ecosystem standing.') },
  tansiyon_numbers: { case: 'tansiyon', code: 'BİY.11.2.6', who: 'player',
    prompt: tr('Hasan Dede’nin tansiyonu 164’e 98 çıktı. Bu iki sayı neyi gösterir?', 'Hasan Dede’s blood pressure came out at 164 over 98. What do the two numbers show?'),
    options: [
      { t: tr('164: kalp kasılıp kanı atardamarlara basarken damar duvarına binen basınç (büyük tansiyon). 98: kalp gevşerken damarda kalan basınç (küçük tansiyon).', '164: the pressure on the artery walls while the heart contracts and forces blood into them (systolic). 98: the pressure left while the heart relaxes (diastolic).'), ok: true },
      { t: tr('Birincisi kalp atış sayısı, ikincisi vücut sıcaklığı.', 'The first is the pulse rate, the second the body temperature.'), fb: tr('Nabız ayrıca sayılır. Tansiyon aletinin iki sayısı da milimetre cıva cinsinden basınçtır.', 'The pulse is counted separately. Both numbers on the gauge are pressures, in millimetres of mercury.') },
      { t: tr('164 atardamardaki, 98 toplardamardaki basınç.', '164 is the pressure in an artery, 98 in a vein.'), tag: 'veins_high', fb: tr('İkisi de aynı atardamarda ölçüldü: biri kalbin kasılma anındaki, öbürü gevşeme anındaki basınç. Toplardamarda basınç çok daha düşüktür.', 'Both were measured in the same artery: one while the heart contracts, the other while it relaxes. Pressure in a vein is far lower.') },
    ],
    explain: tr('Doğru. Kalp her kasıldığında atardamarlara kan basar ve basınç yükselir; gevşerken basınç düşer ama sıfıra inmez, çünkü esnek atardamar duvarları geri toplanıp kanı itmeye devam eder. Yetişkinde 120/80’in altı normal sayılır, 140/90 ve üstü yüksektir.', 'Correct. Each time the heart contracts it forces blood into the arteries and the pressure rises; as it relaxes the pressure falls, but not to zero, because the elastic artery walls spring back and keep pushing. In adults, below 120/80 counts as normal and 140/90 or more as high.') },
  tansiyon_wall: { case: 'tansiyon', code: 'BİY.9.2.8', who: 'player',
    prompt: tr('Sol karıncığın duvarı sağınkinden üç kat kalın; atardamarların da kalın, kaslı ve esnek bir duvarı var. Neden?', 'The left ventricle’s wall is three times thicker than the right’s, and arteries have thick, muscular, elastic walls. Why?'),
    options: [
      { t: tr('Sol karıncık kanı bütün vücuda, sağ karıncık yalnızca yakındaki akciğerlere pompalar: soldaki çok daha yüksek basınç üretmek zorundadır. Atardamar duvarı da bu basınca dayanıp her atımda esneyip geri toplanır.', 'The left ventricle pumps blood round the whole body, the right only to the nearby lungs, so the left must make a much higher pressure. The artery wall withstands that pressure, stretching and springing back at every beat.'), ok: true },
      { t: tr('Sol karıncık daha çok kan taşıdığı için büyümüştür.', 'The left ventricle has grown because it carries more blood.'), fb: tr('İki karıncık her atımda aynı miktarda kan pompalar; fark basınçtadır.', 'Both ventricles pump the same amount of blood at each beat; the difference is the pressure.') },
      { t: tr('Toplardamarlarda basınç daha yüksektir; atardamarlar onlardan korunmak için kalındır.', 'Pressure is higher in the veins; arteries are thick to protect themselves from them.'), tag: 'veins_high', fb: tr('Tersine: basınç en yüksek atardamarlarda, en düşük toplardamarlardadır. Toplardamarların ince duvarı ve kapakçıkları vardır.', 'The other way round: pressure is highest in the arteries and lowest in the veins. Veins have thin walls and valves.') },
    ],
    explain: tr('Doğru. Yapı işe uyar: hücreler dokuları, dokular organları kurar. Atardamar duvarı üç katmandır: içte tek sıra endotel, ortada düz kas ve esnek lifler, dışta bağ dokusu. Yüksek tansiyon yıllarca sürerse bu kas katmanı kalınlaşır, damar sertleşir ve iç boşluğu daralır; karşılaştırma modunda görebilirsin.', 'Correct. Structure fits the job: cells build tissues and tissues build organs. An artery’s wall has three layers: a single row of endothelium inside, smooth muscle and elastic fibres in the middle, connective tissue outside. If high pressure goes on for years, the muscle layer thickens, the vessel stiffens and its space narrows; you can see it in compare mode.') },
  tansiyon_silent: { case: 'tansiyon', code: 'BİY.11.2.6', who: 'elder1',
    prompt: tr('Hasan Dede: “Madem hiçbir yerim ağrımıyor, ne diye doktor, perhiz? Başım dönerse düşünürüz.”', 'Hasan Dede: “Since nothing hurts, why bother with doctors and diets? If I get dizzy, we’ll think about it.”'),
    options: [
      { t: tr('Haklısınız: belirti yoksa sorun da yoktur.', 'You’re right: no symptoms, no problem.'), tag: 'no_symptom_ok', fb: tr('Yüksek tansiyonda insanlar çoğu zaman hiçbir şey hissetmez; zarar sessizce birikir.', 'People with high blood pressure usually feel nothing at all; the harm builds up silently.') },
      { t: tr('Yüksek tansiyon çoğu zaman hiç belirti vermez, ama yıllar içinde damar duvarını kalınlaştırıp sertleştirir, kalbi yorar, inme ve kalp krizi riskini artırır. Doktor birkaç ölçümle karar verir; düzenli ölçüm, az tuz ve hareket bu yüzden önemli.', 'High blood pressure usually gives no symptoms at all, but over the years it thickens and stiffens the artery walls, tires the heart and raises the risk of stroke and heart attack. A doctor decides from several readings; that is why regular checks, less salt and exercise matter.'), ok: true },
      { t: tr('Yüksek tansiyonu olan herkes bayılır; bayılmadıysanız ölçüm yanlıştır.', 'Everyone with high blood pressure faints; if you haven’t, the reading is wrong.'), fb: tr('Ölçümü doğru yöntemle yaptın. Yüksek tansiyonun belirtisi çoğu zaman yoktur; bu yüzden ona “sessiz” denir.', 'You measured it the right way. High blood pressure usually has no symptoms, which is why it’s called “silent”.') },
    ],
    explain: tr('Doğru. Yüksek tansiyona “sessiz katil” denir: yetişkinlerin yaklaşık üçte birinde vardır ve pek çoğu bundan habersizdir. Tanıyı doktor, farklı günlerde yapılan birkaç ölçümle koyar. Az tuz, hareket ve sigarayı bırakmak basıncı düşürür.', 'Correct. High blood pressure is called “the silent killer”: about a third of adults have it, and many don’t know. A doctor makes the diagnosis from several readings on different days. Less salt, more exercise and giving up smoking all bring the pressure down.') },
  eksik_fat: { case: 'eksik', code: 'BİY.9.2.2', who: 'player',
    prompt: tr('Defterin son sayfasında Zehra’nın notu: “Vitaminleri ikiye ayır: bir grubu vücut depolar, öbürünü her gün almak gerekir.” Hangisi doğru?', 'On the notebook’s last page, Zehra’s note: “Split the vitamins in two: the body stores one group, and the other must be eaten every day.” Which is right?'),
    options: [
      { t: tr('A, D, E, K yağda çözünür; karaciğerde ve yağ dokusunda depolanır. B’ler ve C suda çözünür; fazlası idrarla atılır, sık sık alınmalı.', 'A, D, E and K dissolve in fat and are stored in the liver and fat tissue. The Bs and C dissolve in water; the excess leaves in urine, so they must be eaten often.'), ok: true },
      { t: tr('B’ler ve C depolanır, A, D, E, K atılır.', 'The Bs and C are stored; A, D, E and K are excreted.'), fb: tr('Tersi. Yağda çözünenler yağ dokusunda saklanabilir; suda çözünenler kanla böbreğe gidip idrarla atılır.', 'It’s the other way round. Fat-soluble ones can hide in fat tissue; water-soluble ones travel in blood to the kidney and leave in urine.') },
      { t: tr('Vücut hiçbir vitamini depolayamaz.', 'The body can’t store any vitamin.'), fb: tr('Karaciğer aylarca yetecek A vitamini, yıllarca yetecek B12 depolayabilir.', 'The liver can store months of vitamin A and even years of B12.') },
    ],
    explain: tr('Doğru. Bu yüzden yağda çözünen vitaminleri almak için yemekte biraz yağ gerekir: havuçtaki beta-karoten zeytinyağıyla daha iyi emilir. Ama aynı nedenle A ve D fazlası birikir ve zehirleyebilir.', 'Right. That is why fat-soluble vitamins need a little fat in the meal: the beta-carotene in carrots is absorbed better with olive oil. For the same reason, too much A or D builds up and can be toxic.') },
  eksik_iron_tea: { case: 'eksik', code: 'BİY.9.2.1', who: 'zehra',
    prompt: tr('Zehra: “Selin’in annesi ‘Her gün ıspanak yiyor, nasıl demiri eksik olur?’ diyor. Selin’e ne önerelim?”', 'Zehra: “Selin’s mother says, ‘She eats spinach every day, how can she be short of iron?’ What should we tell Selin?”'),
    options: [
      { t: tr('Daha çok ıspanak yesin; ıspanakta çok demir var.', 'Eat more spinach; it’s full of iron.'), tag: 'spinach_tea_iron', fb: tr('Ispanaktaki demirin çok azı emilir, üstelik yanındaki çay onu da engelliyor. Miktar değil, emilim sorunu.', 'Very little of spinach’s iron gets absorbed, and the tea blocks even that. The problem is absorption, not amount.') },
      { t: tr('Çayı yemekten bir iki saat sonra içsin; mercimek, nohut gibi baklagillerin yanına limon, biber, maydanoz koysun.', 'Drink tea an hour or two after meals; add lemon, peppers or parsley to legumes like lentils and chickpeas.'), ok: true },
      { t: tr('Demir haplarını çayla içsin.', 'Take iron tablets with tea.'), fb: tr('Çaydaki tanenler haptaki demiri de bağlar. Hap bile olsa suyla ya da portakal suyuyla içilmeli.', 'The tannins in tea bind the iron in tablets too. Even a tablet should be taken with water or orange juice.') },
    ],
    explain: tr('Doğru. Çaydaki tanenler demire bağlanıp emilmesini engeller; C vitamini ise bitkisel demiri emilebilir hâle getirir. Et yemeyen biri için “mercimek çorbasına limon” iyi bir kuraldır.', 'Right. Tannins in tea bind iron and stop it being absorbed; vitamin C turns plant iron into a form the gut can take up. For someone who doesn’t eat meat, “lemon in the lentil soup” is a good rule.') },
  eksik_more_better: { case: 'eksik', code: 'BİY.9.2.2', who: 'zehra',
    prompt: tr('Zehra: “Recep Dede’nin oğlu şehirden aradı: ‘Babama eczaneden her vitaminden koca bir kutu alayım, günde üçer tane içsin, fazlası zarar vermez.’ Doğru mu?”', 'Zehra: “Recep Dede’s son rang from the city: ‘I’ll buy Dad a big box of every vitamin and he can take three of each a day; extra can’t hurt.’ Is he right?”'),
    options: [
      { t: tr('Evet, vücut fazlasını her zaman atar.', 'Yes, the body always gets rid of the excess.'), tag: 'vitamin_more_better', fb: tr('Bu yalnız suda çözünenler için doğru. A ve D yağda depolanır; fazlası karaciğere, kemiğe, böbreğe zarar verebilir.', 'That’s only true of the water-soluble ones. A and D are stored in fat; too much can harm the liver, bones and kidneys.') },
      { t: tr('Hayır. Recep Dede’nin eksiği C vitamini; taze meyve sebze yeter. A ve D gibi yağda çözünen vitaminlerin fazlası birikip zehirleyebilir.', 'No. Recep Dede lacks vitamin C, and fresh fruit and vegetables will fix that. Too much of fat-soluble vitamins like A and D builds up and can poison.'), ok: true },
      { t: tr('Hayır, çünkü vitamin hapları hiç işe yaramaz.', 'No, because vitamin pills never work.'), fb: tr('Doğru kişiye doğru dozda verilince işe yararlar: Ömer’e D damlası verilecek. Sorun gereksiz ve aşırı doz.', 'Given to the right person at the right dose they do work: Ömer will get vitamin D drops. The trouble is unneeded, excessive doses.') },
    ],
    explain: tr('Doğru. Suda çözünen vitaminlerin fazlası idrarla atılır, yağda çözünenler ise birikir. Kutup ayısı ciğeri yiyen kâşifler A vitamini zehirlenmesinden hastalanmıştır. Önce eksiği bul, sonra onu tamamla.', 'Right. The excess of water-soluble vitamins leaves in urine, while fat-soluble ones build up. Explorers who ate polar-bear liver fell ill from vitamin A poisoning. Find the gap first, then fill that one.') },
  eksik_sun: { case: 'eksik', code: 'BİY.9.2.2', who: 'zehra',
    prompt: tr('Zehra: “Ömer’in annesi ağlıyor: ‘Günde üç bardak süt içiriyorum, kemikleri nasıl yumuşak olur?’ Ona ne anlatalım?”', 'Zehra: “Ömer’s mother is crying: ‘I give him three glasses of milk a day, how can his bones be soft?’ What should we tell her?”'),
    options: [
      { t: tr('Süt yetmiyor, günde beş bardağa çıkarsın.', 'Milk isn’t enough; she should go up to five glasses.'), tag: 'milk_enough_bones', fb: tr('Kalsiyum zaten bol. D vitamini olmadan bağırsak onu alamıyor; daha çok süt de alamaz.', 'He already has plenty of calcium. Without vitamin D the gut can’t take it up, and more milk won’t change that.') },
      { t: tr('Kalsiyumun emilmesi için D vitamini lazım; onu da deri güneşte yapar. Ömer’i her gün biraz güneşe çıkarsın; doktor D damlası da verecek.', 'Absorbing calcium takes vitamin D, and the skin makes that in sunlight. Take Ömer out in the sun a little every day; the doctor will give vitamin D drops too.'), ok: true },
      { t: tr('Kemik yumuşaklığı kalıtsaldır, yapacak bir şey yok.', 'Soft bones are inherited; nothing can be done.'), fb: tr('Raşitizm beslenme ve güneş eksikliğinden olur; erken yakalanırsa kemikler düzelir.', 'Rickets comes from lack of diet and sun; caught early, the bones straighten.') },
    ],
    explain: tr('Doğru. Türkiye’de 2005’ten beri her bebeğe bir yaşına kadar ücretsiz D vitamini damlası veriliyor. Kışın, kapalı giyinen ve hep evde kalan herkes D vitamini eksikliği çekebilir.', 'Right. Since 2005 every baby in Türkiye has been given free vitamin D drops until their first birthday. In winter, anyone who is covered up and stays indoors can run short of vitamin D.') },
  yogurt_ph: { case: 'yogurt', code: 'BİY.10.1.9', who: 'player',
    prompt: tr('43 °C’deki mayalı kavanoz tuttu, mayasız olanı ve 70 °C’dekini tutmadı. Süt neden koyulaştı?', 'The 43 °C jar with starter set; the one with no starter and the 70 °C one didn’t. Why did the milk thicken?'),
    options: [
      { t: tr('Sıcaklık sütü koyulaştırdı.', 'The heat thickened the milk.'), tag: 'heat_sets_yogurt', fb: tr('70 °C’deki kavanoz en sıcaktı ama süt olarak kaldı. Mayasız 43 °C de tutmadı.', 'The 70 °C jar was the hottest, yet it stayed milk. The 43 °C jar with no starter didn’t set either.') },
      { t: tr('Bakteriler laktozu laktik aside mayaladı; pH 4,6’ya inince kazein pıhtılaştı.', 'Bacteria fermented lactose into lactic acid; when the pH reached 4.6 the casein curdled.'), ok: true },
      { t: tr('Bakteriler sütteki suyu içti.', 'The bacteria drank the water in the milk.'), fb: tr('Suyun miktarı pek değişmedi; değişen pH oldu. Şeride bak.', 'The amount of water hardly changed; the pH did. Look at the strip.') },
    ],
    explain: tr('Doğru. Bu oksijensiz bir enerji yoludur: laktik asit fermantasyonu. Aynı tepkime koşan birinin kaslarında da olur. Mayasız kontrol olmasa, işi ısının mı bakterinin mi yaptığını bilemezdik.', 'Right. This is a way of getting energy without oxygen: lactic acid fermentation. The same reaction happens in a runner’s muscles. Without the no-starter control, we couldn’t tell whether the heat or the bacteria did the work.') },
  sera_heat: { case: 'sera', code: 'BİY.10.2.6', who: 'deniz',
    prompt: tr('Deniz: “Aynı lamba, aynı kavanoz… CO₂’li olan neden daha çok ısındı?”', 'Deniz: “Same lamp, same jars… why did the CO₂ jar get hotter?”'),
    options: [
      { t: tr('Işık camdan geçip içeriyi ısıtıyor; ısınan yüzeyler ısıyı kızılötesi olarak yayıyor. CO₂ bu kızılötesini tutup geri yayıyor.', 'Light passes through the glass and warms what’s inside; warm surfaces give the heat off as infrared. CO₂ soaks up that infrared and sends it back.'), ok: true },
      { t: tr('Ozon deliğinden daha çok ışık giriyor.', 'More light gets in through the ozone hole.'), tag: 'ozone_hole_warming', fb: tr('İki kavanozda da ozon yok, lamba da aynı. Fark yalnız içindeki gaz.', 'There’s no ozone in either jar and the lamp is the same. The only difference is the gas inside.') },
      { t: tr('CO₂ kendisi sıcak bir gaz.', 'CO₂ is a hot gas itself.'), fb: tr('Başlangıçta iki kavanoz da 20 °C’deydi. Lamba kapalıyken CO₂’li kavanoz da ısınmadı.', 'Both jars started at 20 °C. With the lamp off, the CO₂ jar didn’t warm either.') },
    ],
    explain: tr('Doğru. Atmosferdeki CO₂ 1850’de milyonda 280 idi, bugün 420’yi geçti; çoğu kömür, petrol ve doğalgaz yakmaktan. Kavanozdaki fark küçük ama Dünya’nın tamamında yüzyıllarca birikiyor.', 'Right. Atmospheric CO₂ was 280 parts per million in 1850 and is now over 420, mostly from burning coal, oil and gas. The difference in a jar is small, but across the whole Earth it builds up over centuries.') },
  sera_plant: { case: 'sera', code: 'BİY.10.1.3', who: 'deniz',
    prompt: tr('Deniz: “Işıkta bitkili kavanozun CO₂’si düştü, karanlıkta arttı. Bu ormanlar için ne demek?”', 'Deniz: “In the light the plant jar’s CO₂ went down; in the dark it went up. What does that mean for forests?”'),
    options: [
      { t: tr('Bitkiler hiç CO₂ vermez; ormanlar her zaman CO₂ çeker.', 'Plants never give out CO₂, so forests always draw it down.'), tag: 'plants_no_respiration', fb: tr('Karanlıkta CO₂ arttı: bitki solunum yapıyor. Işıkta fotosentez solunumdan ağır basıyor.', 'In the dark the CO₂ rose: the plant is respiring. In the light, photosynthesis outweighs respiration.') },
      { t: tr('Bitkiler hep solunum yapar ama ışıkta fotosentezle daha fazlasını alır. Orman karbonu odununda saklar; ağaç yanınca geri verir.', 'Plants always respire, but in light photosynthesis takes in more. A forest stores carbon in its wood, and gives it back when the trees burn.'), ok: true },
      { t: tr('Bitkiler CO₂’yi yok eder.', 'Plants destroy CO₂.'), fb: tr('Karbon yok olmaz, şekere ve oduna dönüşür. Çürüyünce ya da yanınca yine CO₂ olur.', 'The carbon isn’t destroyed; it becomes sugar and wood. When that rots or burns, it becomes CO₂ again.') },
    ],
    explain: tr('Doğru. Bu yüzden orman yangınları iki kez zarar verir: sakladığı karbonu salar, bir daha çekecek ağacı da yok eder. Mavi-yeşil-sarı BTB rengi, gözle görülen bir CO₂ ölçeridir.', 'Right. That is why forest fires do harm twice: they release the carbon the forest stored and destroy the trees that would have drawn more down. The blue-green-yellow of BTB is a CO₂ meter you can see.') },
  hediye_cold: { case: 'hediye', code: 'BİY.9.2.2', who: 'nazli',
    prompt: tr('Nazlı Teyze: “Pazardaki adam ‘Buzdolabında bulanıklaşan zeytinyağı hilelidir’ dedi. Bizimki bulanıklaştı mı?”', 'Nazlı Teyze: “The man at the market said ‘Olive oil that clouds in the fridge has been cut.’ Did ours go cloudy?”'),
    options: [
      { t: tr('Bulanıklaştı, demek ki hileli.', 'It went cloudy, so it’s been cut.'), tag: 'cloudy_oil_spoiled', fb: tr('Tersine: karıştırıldığı söylenen ayçiçek yağı soğukta berrak kaldı. Bulanıklaşmak zeytinyağının kendi özelliği.', 'The opposite: the sunflower oil it would be cut with stayed clear in the cold. Clouding is what olive oil itself does.') },
      { t: tr('Bulanıklaştı, çünkü zeytinyağının çoğu tekli doymamış yağ; soğukta kısmen katılaşır. Ayçiçek yağı berrak kalır. Adam yanılıyor.', 'It went cloudy, because olive oil is mostly monounsaturated fat and partly sets in the cold. Sunflower oil stays clear. The man is wrong.'), ok: true },
      { t: tr('Bulanıklaşma yağın bozulduğunu gösterir.', 'Clouding means the oil has gone off.'), tag: 'cloudy_oil_spoiled', fb: tr('Oda sıcaklığına dönünce yine berraklaşır. Bozulan yağ acılaşır ve kokar; bulanıklaşmaz.', 'It clears again at room temperature. Oil that has gone off turns rancid and smells; it doesn’t cloud.') },
    ],
    explain: tr('Doğru. Tek bir test her zaman kesin sonuç vermez; laboratuvarlar yağ asitlerini tek tek ölçer. Ama bu testle, satıcının kuralının tam tersi olduğunu gösterdin.', 'Right. One test isn’t always conclusive; laboratories measure the fatty acids one by one. But with this test you showed the trader’s rule is the wrong way round.') },
  hediye_soap: { case: 'hediye', code: 'BİY.9.2.2', who: 'nazli',
    prompt: tr('Nazlı Teyze: “Yağlı tepsiyi su çıkarmıyor, sabun çıkarıyor. Neden?”', 'Nazlı Teyze: “Water won’t shift a greasy tray, but soap will. Why?”'),
    options: [
      { t: tr('Sabun yağı şeker gibi eritir.', 'Soap dissolves fat the way water dissolves sugar.'), fb: tr('Yağ yok olmadı; süt gibi minik damlacıklar hâlinde suya dağıldı. Bu bir emülsiyon.', 'The fat didn’t vanish; it spread through the water in tiny droplets, like milk. That’s an emulsion.') },
      { t: tr('Sabunun bir ucu suyu, öbür ucu yağı sever. Yağı minik damlacıklara ayırıp suda dağıtır; bağırsakta safra da aynı işi yapar.', 'One end of a soap molecule likes water, the other likes fat. It breaks fat into tiny droplets spread through water; bile does the same job in the gut.'), ok: true },
      { t: tr('Sabun yağı suya dönüştürür.', 'Soap turns fat into water.'), fb: tr('Kimyasal bir dönüşüm olmadı; beklersen damlacıklar yine yağ olarak görünür.', 'There was no chemical change; the droplets are still fat.') },
    ],
    explain: tr('Doğru. Yağlar suda çözünmez; bu yüzden sindirimde önce safra onları damlacıklara ayırır, sonra lipaz enzimi bu damlacıkların yüzeyinden parçalar.', 'Right. Fats don’t dissolve in water, so in digestion bile first breaks them into droplets, and then the enzyme lipase breaks them down from the droplet surfaces.') },
  azot_yellow: { case: 'azot', code: 'BİY.10.2.4', who: 'osman',
    prompt: tr('Osman Amca: “Havanın dörtte üçü azotmuş. Buğdayım o azotun içinde duruyor, nasıl oluyor da azota aç kalıyor?”', 'Osman Amca: “They say three quarters of the air is nitrogen. My wheat is standing right in it, so how can it be starving for nitrogen?”'),
    options: [
      { t: tr('Buğday azotu havadan yaprağıyla alır ama bu yıl rüzgâr az esti.', 'Wheat takes nitrogen from the air through its leaves, but there wasn’t much wind this year.'), tag: 'plants_use_air_n2', fb: tr('Bitkiler N₂ gazını kullanamaz; iki azot atomu arasındaki üçlü bağ çok güçlü.', 'Plants can’t use N₂ gas; the triple bond between the two nitrogen atoms is too strong.') },
      { t: tr('Bitki havadaki N₂’yi kullanamaz. Onu yalnız bazı bakteriler (nohut kökündeki gibi) ve yıldırım amonyum ve nitrata çevirir; buğday azotu kökten böyle alır.', 'Plants can’t use the N₂ in the air. Only some bacteria (like those in chickpea roots) and lightning turn it into ammonium and nitrate, and that is how wheat takes it in through its roots.'), ok: true },
      { t: tr('Buğday azotu fotosentezle yapar.', 'Wheat makes nitrogen by photosynthesis.'), fb: tr('Fotosentez şeker yapar; şekerde azot yoktur. Protein ve DNA için azot topraktan gelmeli.', 'Photosynthesis makes sugar, and sugar has no nitrogen in it. For proteins and DNA the nitrogen has to come from the soil.') },
    ],
    explain: tr('Doğru. Sararma azot eksikliğinin tipik belirtisidir: azot klorofilin ve proteinlerin yapısında var. Bitki önce yaşlı yapraklardaki azotu gençlere taşır, bu yüzden alttaki yapraklar önce sararır.', 'Right. Yellowing is the classic sign of nitrogen shortage: nitrogen is part of chlorophyll and proteins. The plant moves nitrogen from old leaves to young ones, so the lower leaves yellow first.') },
  azot_rotate: { case: 'azot', code: 'BİY.10.2.5', who: 'osman',
    prompt: tr('Osman Amca: “Peki şimdi ne yapayım? Gübreci ‘Ne kadar çok, o kadar iyi’ diyor.”', 'Osman Amca: “So what do I do now? The fertiliser man says ‘The more, the better.’”'),
    options: [
      { t: tr('Bütün tarlaya bol gübre at.', 'Pile fertiliser on the whole field.'), tag: 'more_fertiliser_better', fb: tr('Bitkinin alamadığı nitrat yağmurla yıkanıp kuyuya ve göle gider; suyu kirletir, yosunları azdırır.', 'Nitrate the plants can’t take up washes into the well and the lake, polluting the water and feeding algae.') },
      { t: tr('Ekim nöbeti: sarı kısma bu yıl nohut, mercimek ya da fiğ ek, sonraki yıl buğday. Gübreyi toprak testine göre, az ve zamanında ver.', 'Crop rotation: this year sow chickpeas, lentils or vetch on the yellow part, and wheat the year after. Use fertiliser according to a soil test, a little and at the right time.'), ok: true },
      { t: tr('Tarlayı sürmeyi bırak, kendiliğinden düzelir.', 'Stop ploughing and it will sort itself out.'), fb: tr('Yavaş düzelir ama baklagil ekmeden azot kazancı çok az olur.', 'It would recover slowly, but without legumes very little nitrogen gets added.') },
    ],
    explain: tr('Doğru. Baklagil ile Rhizobium bakterisi arasında bir ortak yaşam (mutualizm) var: bitki bakteriye şeker verir, bakteri bitkiye azot. Hasattan sonra kökler çürüyünce azot toprakta kalır.', 'Right. Legumes and Rhizobium bacteria live in mutualism: the plant gives the bacteria sugar, and the bacteria give the plant nitrogen. After harvest, the rotting roots leave the nitrogen in the soil.') },
  ekim_frost: { case: 'ekim', code: 'BİY.10.2.1', who: 'fatma',
    prompt: tr('Fatma Teyze: “Yeğenim her şeyi mayısta, en sıcakta ekmek istiyor. Doğru mu?”', 'Fatma Teyze: “My nephew wants to sow everything in May, when it’s warmest. Is he right?”'),
    options: [
      { t: tr('Evet; ne kadar sıcak, o kadar iyi büyür.', 'Yes; the warmer, the better it grows.'), tag: 'warm_always_better', fb: tr('Mayısta ıspanak sapa kalktı, nohudun çiçeği temmuz sıcağında döküldü. Sıcak her bitkiye iyi gelmedi.', 'In May the spinach bolted and the chickpea dropped its flowers in the July heat. Warmth wasn’t good for every crop.') },
      { t: tr('Yalnız domates için. Her bitkinin ayaz, sıcaklık ve gün uzunluğuna göre kendi ayı var.', 'Only for the tomato. Each crop has its own month, set by frost, temperature and day length.'), ok: true },
      { t: tr('Hayır; her şeyi ekimde ekmeli, kış bitkileri güçlendirir.', 'No; sow everything in October, winter toughens plants.'), fb: tr('Ekimde ekilen domates ve nohut fideleri ayazda dondu.', 'The tomato and chickpea seedlings sown in October froze.') },
    ],
    explain: tr('Doğru. Sıcaklık, su, ışık ve gün uzunluğu abiyotik etmenlerdir; çiftçi takvimi bunlara göre kurulur. İklim değiştikçe bu takvimler de kayıyor.', 'Right. Temperature, water, light and day length are abiotic factors, and a farming calendar is built around them. As the climate changes, these calendars shift too.') },
  ekim_wheat: { case: 'ekim', code: 'BİY.12.1.12', who: 'fatma',
    prompt: tr('Fatma Teyze: “Martta ektiğimiz buğday yemyeşil oldu ama başak vermedi. Neden?”', 'Fatma Teyze: “The wheat we sowed in March grew bright green but never made ears. Why?”'),
    options: [
      { t: tr('Soğuk buğdaya zarar verir; daha da geç ekmeliydik.', 'Cold harms wheat; we should have sown even later.'), tag: 'wheat_needs_warmth', fb: tr('Mayısta ekilen buğday da başak vermedi. Tam tersi: soğuk eksikti.', 'The May wheat made no ears either. The opposite: it lacked cold.') },
      { t: tr('Kışlık buğday çiçeklenmek için haftalarca soğuk görmeli (vernalizasyon). Martta ekilen kışı görmedi.', 'Winter wheat must feel weeks of cold before it can flower (vernalisation). The March wheat never saw winter.'), ok: true },
      { t: tr('Toprakta azot bitmişti.', 'The soil had run out of nitrogen.'), fb: tr('Yaprakları yemyeşildi; azot eksik olsaydı sararırdı.', 'Its leaves were bright green; short of nitrogen, they would have yellowed.') },
    ],
    explain: tr('Doğru. Soğuk, bitkide çiçeklenmeyi baskılayan bir geni yavaş yavaş kapatır; bitki kışı “sayar” ve baharda çiçeğe hazır olur. Bu yüzden kışlık ve yazlık buğday çeşitleri ayrıdır.', 'Right. The cold slowly switches off a gene that holds back flowering; the plant “counts” the winter and is ready to flower in spring. That is why there are separate winter and spring wheat varieties.') },
  etilen_apple: { case: 'etilen', code: 'BİY.10.1.7', who: 'huseyin',
    prompt: tr('Hüseyin Usta: “Elmalı torbadaki domatesler neden daha çabuk kızardı? Elma dokunmuyor ki!”', 'Hüseyin Usta: “Why did the tomatoes in the apple bag go red faster? The apple isn’t even touching them!”'),
    options: [
      { t: tr('Olgun elma etilen gazı salıyor; etilen domatesin olgunlaşma enzimlerini çalıştırıyor.', 'The ripe apple gives off ethylene gas, and ethylene switches on the tomato’s ripening enzymes.'), ok: true },
      { t: tr('Elma torbayı ısıtıyor.', 'The apple warms the bag.'), fb: tr('Torbalar aynı yerde, aynı sıcaklıktaydı. Fark yalnız elmaydı.', 'The bags were in the same place at the same temperature. The only difference was the apple.') },
      { t: tr('Elma domatese şekerini veriyor.', 'The apple passes its sugar to the tomato.'), fb: tr('Elma domatese dokunmuyordu bile; aradaki şey bir gaz.', 'The apple wasn’t even touching; what passes between them is a gas.') },
    ],
    explain: tr('Doğru. Etilen bir bitki hormonudur. Olgunlaşan meyve daha çok etilen yapar, o da olgunlaşmayı hızlandırır: kendi kendini besleyen bir döngü. “Bir çürük elma bütün sepeti çürütür” sözü buradan.', 'Right. Ethylene is a plant hormone. Ripening fruit makes more ethylene, which speeds up ripening: a loop that feeds itself. That is where “one bad apple spoils the barrel” comes from.') },
  etilen_cold: { case: 'etilen', code: 'BİY.9.1.2', who: 'huseyin',
    prompt: tr('Hüseyin Usta: “Buzdolabına koysam taze kalır, hem de olgunlaşır diye düşünmüştüm.”', 'Hüseyin Usta: “I thought the fridge would keep them fresh and ripen them too.”'),
    options: [
      { t: tr('Buzdolabı meyveyi en hızlı olgunlaştırır.', 'The fridge ripens fruit fastest.'), tag: 'fridge_ripens', fb: tr('4 °C’deki torba on günde neredeyse hiç kızarmadı, üstelik lekelendi.', 'The 4 °C bag barely reddened in ten days, and it got pitted too.') },
      { t: tr('Güneşli pencereye koy; olgunlaşma için güneş şart.', 'Put them in a sunny window; ripening needs sun.'), tag: 'ripening_needs_sun', fb: tr('Torbalar karanlıktı ve yine de kızardı. 30 °C’de ise turuncu kaldı.', 'The bags were dark and still reddened. At 30 °C they stayed orange.') },
      { t: tr('Soğuk olgunlaşma enzimlerini yavaşlatır. Oda sıcaklığında, karanlık bir torbada, yanında bir elmayla bekletmek en iyisi.', 'Cold slows the ripening enzymes. Best is room temperature, in a dark bag, with an apple.'), ok: true },
    ],
    explain: tr('Doğru. Kontrollü deneyde tek bir şeyi değiştirdin: ya sıcaklığı ya elmayı. Aynı sıcaklıkta elmalı ve elmasız torba olmasa, farkı elmaya bağlayamazdık.', 'Right. In a controlled test you changed one thing at a time: the temperature or the apple. Without an apple and a no-apple bag at the same temperature, we couldn’t pin the difference on the apple.') },
  sindirim_stomach: { case: 'sindirim', code: 'BİY.10.1.5', who: 'zehra',
    prompt: tr('Hemşire Zehra: “Çocuklar ‘Yemek midede erir, biter’ diyor. Tüpler ne dedi?”', 'Nurse Zehra: “The children say ‘Food melts in the stomach and that’s it.’ What did the tubes say?”'),
    options: [
      { t: tr('Haklılar; her şey midede sindirilir.', 'They’re right; everything is digested in the stomach.'), tag: 'digestion_only_stomach', fb: tr('Tereyağı midede hiç değişmedi, ekmeğin sindirimi midede durdu.', 'The butter didn’t change at all in the stomach, and the bread’s digestion stopped there.') },
      { t: tr('Mide yalnızca proteini başlatır. Nişasta ağızda başlar, her şey ince bağırsakta biter ve orada emilir.', 'The stomach only starts the protein. Starch starts in the mouth, and everything finishes and is absorbed in the small intestine.'), ok: true },
      { t: tr('Sindirim kalın bağırsakta olur.', 'Digestion happens in the large intestine.'), fb: tr('Kalın bağırsağa gelince geriye nişasta, protein ve yağ kalmamıştı; orada su emiliyor.', 'By the large intestine no starch, protein or fat was left; water is absorbed there.') },
    ],
    explain: tr('Doğru. İnce bağırsak yaklaşık 6 metre ve içi milyonlarca villusla kaplı; açılsa bir odanın tabanını kaplar. Emilim yüzeyi bu kadar büyük olduğu için besinler orada kana geçer.', 'Right. The small intestine is about 6 metres long and lined with millions of villi; spread out, it would cover a room’s floor. With such a large surface, that is where food passes into the blood.') },
  sindirim_fat: { case: 'sindirim', code: 'BİY.9.2.2', who: 'zehra',
    prompt: tr('Hemşire Zehra: “Safra kesesi alınan hastalara yağlı yemeyin deriz. Neden?”', 'Nurse Zehra: “We tell patients who’ve had their gallbladder out to avoid fatty food. Why?”'),
    options: [
      { t: tr('Safra yağı parçalayan enzimdir; o olmadan yağ hiç sindirilmez.', 'Bile is the enzyme that breaks down fat; without it fat isn’t digested at all.'), tag: 'bile_is_enzyme', fb: tr('Yağı parçalayan lipazdı. Safra önce yağı damlacıklara ayırdı.', 'Lipase split the fat. Bile first broke it into droplets.') },
      { t: tr('Safra yağı minik damlacıklara ayırır (emülsiyon); böylece lipazın çalışacağı yüzey büyür. Safra azalınca yağ yavaş sindirilir.', 'Bile breaks fat into tiny droplets (emulsion), so lipase has a bigger surface to work on. With less bile, fat is digested slowly.'), ok: true },
      { t: tr('Yağ midede sindirilir, safra mideyi korur.', 'Fat is digested in the stomach; bile protects the stomach.'), fb: tr('Tereyağı midede neredeyse hiç değişmedi.', 'The butter hardly changed in the stomach.') },
    ],
    explain: tr('Doğru. Safra karaciğerde yapılır, safra kesesinde depolanır. Kese alınınca safra yine gelir ama damla damla; büyük, yağlı bir öğüne yetişemez. Tıpkı Nazlı Teyze’nin tepsisindeki sabun gibi çalışır.', 'Right. Bile is made in the liver and stored in the gallbladder. Without the gallbladder it still comes, but drop by drop, and can’t keep up with a big fatty meal. It works just like the soap on Nazlı Teyze’s tray.') },
  kilcal_climb: { case: 'kilcal', code: 'BİY.9.2.1', who: 'elif',
    prompt: tr('Elif: “İnce boruda su neden kalın borudan daha yükseğe çıktı?”', 'Elif: “Why did water climb higher in the thin tube than in the wide one?”'),
    options: [
      { t: tr('Hava ince boruda suyu daha güçlü emiyor.', 'The air sucks water up harder in a thin tube.'), tag: 'water_climbs_by_suction', fb: tr('Borunun üstü açıktı, emen bir şey yoktu. Su kendisi tırmandı.', 'The tube was open at the top; nothing was sucking. The water climbed on its own.') },
      { t: tr('Su cama tutunuyor (adezyon) ve kendi moleküllerini peşinden çekiyor (kohezyon). İnce boruda taşınacak su az, cam yüzeyi çok.', 'Water clings to the glass (adhesion) and pulls its own molecules along behind (cohesion). In a thin tube there’s little water to lift for a lot of glass.'), ok: true },
      { t: tr('İnce boruda su daha hafif.', 'Water is lighter in a thin tube.'), fb: tr('Su aynı su; değişen, cam yüzeyinin su miktarına oranı.', 'It’s the same water; what changes is how much glass there is for the amount of water.') },
    ],
    explain: tr('Doğru. Kereviz ve ağaç gövdesindeki ksilem boruları saç telinden de incedir. Ama sekvoyanın tepesine su yalnız kılcallıkla çıkmaz: yapraklardan buharlaşan su, kohezyonla kopmayan su sütununu yukarı çeker.', 'Right. The xylem tubes in celery and tree trunks are thinner than a hair. But capillarity alone can’t lift water to the top of a redwood: water evaporating from the leaves pulls the unbroken column up, held together by cohesion.') },
  kilcal_soap: { case: 'kilcal', code: 'BİY.9.1.2', who: 'elif',
    prompt: tr('Elif: “Sabunlu suda ataş neden battı?”', 'Elif: “Why did the paper clip sink in the soapy water?”'),
    options: [
      { t: tr('Sabun suyu daha yapışkan yaptı, ataşı aşağı çekti.', 'Soap made the water stickier and pulled the clip down.'), tag: 'soap_makes_stickier', fb: tr('Yapışkan olsaydı paranın üstünde daha çok damla tutardı; tersine 27’den 9’a düştü.', 'If it were stickier the coin would hold more drops; instead it fell from 27 to 9.') },
      { t: tr('Sabun ataşı ağırlaştırdı.', 'Soap made the clip heavier.'), fb: tr('Ataş aynı ataş; değişen suyun yüzeyi.', 'It’s the same clip; what changed is the water’s surface.') },
      { t: tr('Sabun yüzeydeki su molekülleri arasındaki çekimi (yüzey gerilimini) zayıflattı; “zar” artık ataşı taşıyamadı.', 'Soap weakened the pull between water molecules at the surface (surface tension), so the “skin” could no longer hold the clip.'), ok: true },
    ],
    explain: tr('Doğru. Sabunlu su bir kontroldür: tek bir şeyi, yüzey gerilimini değiştirdi. Her testte aynı yönde bir fark çıkması, sonucun şans olmadığını gösterir. Su örümcekleri de sabunlu suda batar.', 'Right. Soapy water is a control: it changed one thing, the surface tension. A difference in the same direction in every test shows the result isn’t luck. Pond skaters sink in soapy water too.') },
  kul_energy: { case: 'kul', code: 'BİY.9.2.1', who: 'deniz',
    prompt: tr('Deniz: “Kemik 60 gram kül bıraktı, ıspanak 1,5 gram. O zaman en çok enerji kemikte, değil mi?”', 'Deniz: “Bone left 60 grams of ash and spinach 1.5 grams. So bone has the most energy, right?”'),
    options: [
      { t: tr('Evet; kül ne kadar çoksa besin o kadar enerjili.', 'Yes; the more ash, the more energy in the food.'), tag: 'minerals_give_energy', fb: tr('Kül, yanmadan kalan kısım. Enerji yanan kısımdaydı, alev olarak çıktı.', 'Ash is the part that didn’t burn. The energy was in the part that burnt, and left as flame.') },
      { t: tr('Hayır. Kül yanmayan mineral tuzlarıdır; enerji yanan organik maddedeydi. Tuzlar enerji vermez ama yapı ve düzen için şarttır.', 'No. Ash is the mineral salt that doesn’t burn; the energy was in the organic matter that burnt. Salts give no energy but are vital for structure and control.'), ok: true },
      { t: tr('Kül, ateşteki odundan bulaşan kirdir.', 'Ash is dirt from the wood in the fire.'), fb: tr('Besinler kapalı kaplarda yakıldı. Her besinin külü farklı iyonlar gösterdi.', 'The foods were burnt in closed crucibles, and each ash showed different ions.') },
    ],
    explain: tr('Doğru. Su ve mineraller inorganik maddelerdir: hücre onları yapamaz, dışarıdan almalıdır. Vücudun %60’ı su, yaklaşık %4’ü mineraldir; mineralin çoğu da kemikte.', 'Right. Water and minerals are inorganic: the cell can’t make them and has to take them in. The body is about 60% water and about 4% mineral, most of it in bone.') },
  kul_organelle: { case: 'kul', code: 'BİY.9.2.5', who: 'deniz',
    prompt: tr('Deniz: “Ispanaktaki magnezyum kloroplastta, demir mitokondride… Dur, bitkide mitokondri mi var? Onlar fotosentez yapmıyor mu?”', 'Deniz: “The magnesium in spinach is in the chloroplast, the iron in the mitochondrion… Wait, plants have mitochondria? Don’t they do photosynthesis?”'),
    options: [
      { t: tr('Bitkide yalnız kloroplast var; mitokondri hayvanlara özgü.', 'Plants only have chloroplasts; mitochondria are for animals.'), tag: 'plants_no_mito', fb: tr('Bitki karanlıkta da yaşıyor ve CO₂ veriyor: solunum yapıyor. Bunu mitokondri yapar.', 'Plants live through the dark and give out CO₂: they respire. That is the mitochondrion’s job.') },
      { t: tr('Kloroplast, mitokondrinin yeşil hâlidir.', 'A chloroplast is a green mitochondrion.'), fb: tr('İkisi ayrı organel: biri ışıkla şeker yapar, öbürü şekeri yakar.', 'They are separate organelles: one makes sugar with light, the other burns it.') },
      { t: tr('İkisi de var: kloroplast ışıkla şeker yapar, mitokondri o şekerden ATP üretir. Bitki gece gündüz solunum yapar.', 'Both: the chloroplast makes sugar with light and the mitochondrion makes ATP from it. Plants respire day and night.'), ok: true },
    ],
    explain: tr('Doğru. İkisinin de kendi DNA’sı ve çift zarı var; ikisi de bir zamanlar serbest yaşayan bakterilerdi. Hayvan hücresinde kloroplast yok, ama mitokondri her ökaryot hücrede var.', 'Right. Both have their own DNA and a double membrane; both were once free-living bacteria. Animal cells have no chloroplasts, but every eukaryotic cell has mitochondria.') },
  zar_heat: { case: 'zar', code: 'BİY.9.2.2', who: 'songul',
    prompt: tr('Songül Abla: “Haşlayınca pancarın suyu kıpkırmızı oluyor, çiğken yıkayınca olmuyor. Neden?”', 'Songül: “When I boil beetroot the water goes bright red, but when I rinse it raw it doesn’t. Why?”'),
    options: [
      { t: tr('Boya hücrenin kofulunda, zarların ardında. Isı fosfolipit katmanını gevşetip zar proteinlerini bozuyor; boya sızıyor.', 'The dye is in the cell’s vacuole, behind membranes. Heat loosens the phospholipid layer and wrecks the membrane proteins, so the dye leaks out.'), ok: true },
      { t: tr('Isı pancarın boyasını çoğaltıyor.', 'Heat makes more dye in the beetroot.'), tag: 'heat_makes_pigment', fb: tr('Alkol 25 °C’de de suyu kırmızı yaptı. Boya hep oradaydı, yalnızca dışarı çıkamıyordu.', 'Alcohol turned the water red at 25 °C too. The dye was always there; it just couldn’t get out.') },
      { t: tr('Sıcak su pancarın kabuğunu eritiyor.', 'Hot water melts the beetroot’s skin.'), fb: tr('Diskler kabuksuzdu. Fark hücrelerin içinde.', 'The discs had no skin. The difference is inside the cells.') },
    ],
    explain: tr('Doğru. Zar iki sıra fosfolipitten yapılır: suyu seven başlar dışa, yağ gibi kuyruklar içe bakar. Alkol ve deterjan bu yağ katmanını çözer; elini sabunla yıkamak mikropların zarını da böyle dağıtır.', 'Right. The membrane is two rows of phospholipids: water-loving heads face out, fatty tails face in. Alcohol and detergent dissolve that fatty layer; washing your hands with soap breaks up germs’ membranes the same way.') },
  zar_select: { case: 'zar', code: 'BİY.9.2.6', who: 'songul',
    prompt: tr('Songül Abla: “Tuzlu suda disk büzüldü ama su berrak kaldı. Ne oldu?”', 'Songül: “In the salt water the disc shrank, but the water stayed clear. What happened?”'),
    options: [
      { t: tr('Zar hiçbir şey geçirmiyor; disk tuzdan sertleşti.', 'The membrane lets nothing through; the salt just hardened the disc.'), tag: 'membrane_is_wall', fb: tr('Disk küçüldü ve gevşedi, sertleşmedi. Bir şey dışarı çıktı: su.', 'The disc shrank and went limp, not hard. Something came out: water.') },
      { t: tr('Zar seçici geçirgen: küçük su molekülleri tuzlu tarafa çıktı (osmoz), büyük boya molekülleri çıkamadı. Zar sağlam kaldı.', 'The membrane is selectively permeable: small water molecules moved out to the salty side (osmosis), but the big dye molecules couldn’t. The membrane stayed intact.'), ok: true },
      { t: tr('Tuz hücreye girip boyayı içeride kilitledi.', 'The salt went into the cells and locked the dye in.'), fb: tr('Isıtınca tuzlu suda da boya çıktı. Boyayı tutan tuz değil, sağlam zardı.', 'Heated, the salt water went red too. It wasn’t salt holding the dye in, it was the intact membrane.') },
    ],
    explain: tr('Doğru. Su, O₂, CO₂ gibi küçük moleküller zardan doğrudan geçer (difüzyon, osmoz). İyonlar ve glikoz protein kanallarından geçer; bazılarını hücre ATP harcayarak pompalar: aktif taşıma. Turşunun pembeleşmesi, sirkenin zarı yavaş yavaş bozmasındandır.', 'Right. Small molecules like water, O₂ and CO₂ pass straight through the membrane (diffusion, osmosis). Ions and glucose go through protein channels, and the cell pumps some of them using ATP: active transport. The pickle brine turns pink because the vinegar slowly damages the membranes.') },
  tansiyon_salt: { case: 'tansiyon', code: 'BİY.11.2.6', who: 'elder1',
    prompt: tr('Hasan Dede: “Tuzsuz yemek yiyemem, turşusuz sofraya oturmam! Hem tuzun tansiyonla ne ilgisi var?”', 'Hasan Dede: “I can’t eat food without salt, and I won’t sit at a table without pickles! Anyway, what has salt got to do with blood pressure?”'),
    options: [
      { t: tr('Tuz damarlarda birikip onları tıkar.', 'Salt piles up in the vessels and blocks them.'), tag: 'salt_clogs', fb: tr('Tuz kanda çözünmüş hâlde dolaşır; birikip tıkamaz. Yaptığı şey su tutmaktır.', 'Salt travels dissolved in the blood; it doesn’t pile up and block anything. What it does is hold on to water.') },
      { t: tr('Kandaki tuz artınca böbrekler vücutta daha çok su tutar; kanın hacmi artar, aynı damarlara daha çok kan sığdırılır ve basınç yükselir.', 'When blood gets saltier, the kidneys keep more water in the body; blood volume rises, more blood is squeezed into the same vessels, and the pressure goes up.'), ok: true },
      { t: tr('Tuz kalbi hızlandırır.', 'Salt makes the heart beat faster.'), fb: tr('Tuzun asıl etkisi kalp hızında değil, vücuttaki su miktarındadır.', 'Salt’s main effect is not on the heart rate but on the amount of water in the body.') },
    ],
    explain: tr('Doğru. Böbrekler kandaki tuz ve su dengesini ayarlar: bu bir homeostazi örneğidir. Çok tuz yiyen birinin vücudu tuzu seyreltmek için su tutar; kan hacmi artar, basınç yükselir. Dünya Sağlık Örgütü günde 5 gramdan, yani bir çay kaşığından az tuz öneriyor; Türkiye’de bunun yaklaşık iki katı yeniyor.', 'Correct. The kidneys balance the salt and water in the blood: an example of homeostasis. A body fed too much salt holds on to water to dilute it; blood volume rises and so does the pressure. The World Health Organization advises less than 5 grams of salt a day, about a teaspoon; people in Turkey eat about twice that.') },
  mendel_f1: { case: 'mendel', code: 'BİY.12.2.5', who: 'player',
    prompt: tr('Yuvarlak (RR) × buruşuk (rr) çaprazından çıkan bezelyelerin hepsi yuvarlak. Buruşukluk nereye gitti?', 'Every pea from the round (RR) × wrinkled (rr) cross is round. Where did the wrinkling go?'),
    options: [
      { t: tr('Kayboldu; bir daha çıkmaz.', "It's gone for good."), tag: 'blend_lost', fb: tr('Öyle mi? Bir kuşak sonrasını düşün: F1’leri kendi aralarında tozlaştırırsan ne olur?', 'Is it? Think one generation ahead: what happens if the F1 plants pollinate each other?') },
      { t: tr('Saklanıyor: her F1 bezelye Rr. Yuvarlak alel (R) baskın olduğu için yuvarlak görünür ama r’yi taşır.', 'It is hidden: every F1 pea is Rr. The round allele (R) is dominant, so the pea looks round but still carries r.'), ok: true },
      { t: tr('Buruşuk bitkinin poleni işe yaramadı.', "The wrinkled plant's pollen didn't work."), tag: 'pollen_fail', fb: tr('Polen işe yaradı, tohumlar oluştu. Onların genotipini düşün.', 'The pollen worked, since seeds formed. Think about their genotype.') },
      { t: tr('Özellikler karıştı; hepsi yarı buruşuk olmalıydı ama biz fark etmedik.', "The traits blended; they should all be half-wrinkled and we just didn't notice."), tag: 'blending', fb: tr('Bu “karışarak kalıtım” fikri. Mendel’in bezelyeleri ya yuvarlaktı ya buruşuk; ikisinin arası yoktu.', "That's the 'blending inheritance' idea. Mendel's peas were either round or wrinkled, never in between.") },
    ],
    explain: tr('Doğru. Aleller karışmaz; çiftler hâlinde taşınır. F1’in hepsi Rr’dir. Baskın R, çekinik r’yi gizler. F2’de r yeniden görünecek.', 'Correct. Alleles don’t blend; they are carried in pairs. All of F1 is Rr, and the dominant R hides the recessive r. In F2, r will show up again.') },
  mendel_ratio: { case: 'mendel', code: 'BİY.12.2.5', who: 'player',
    prompt: tr('Sen {a} yuvarlak : {b} buruşuk saydın (≈{r} : 1). Mendel 5474 : 1850 saymıştı (≈2,96 : 1). İkisi de neden tam 3 : 1 değil?', 'You counted {a} round : {b} wrinkled (≈{r} : 1). Mendel counted 5474 : 1850 (≈2.96 : 1). Why is neither exactly 3 : 1?'),
    options: [
      { t: tr('Deneyler bozuk.', 'The experiments went wrong.'), tag: 'broken', fb: tr('Bozuk bir deney 3:1’e bu kadar yaklaşmazdı. Her tohumun buruşuk olma şansını düşün.', "A failed experiment wouldn't land so close to 3:1. Think about each seed's chance of being wrinkled.") },
      { t: tr('Olasılık yüzünden: her tohum için buruşuk çıkma şansı 1/4. Ne kadar çok sayarsan oran 3:1’e o kadar yaklaşır.', 'Probability: each seed has a 1-in-4 chance of being wrinkled. The more you count, the closer the ratio gets to 3:1.'), ok: true },
      { t: tr('Buruşuk tohumlar daha çok ölür.', 'Wrinkled seeds die more often.'), tag: 'viability', fb: tr('Olabilir, ama sapma iki yöne de oluyor. Daha iyi bir açıklama örneklem büyüklüğü.', 'Possibly, but the scatter goes both ways. Sample size is a better explanation.') },
      { t: tr('Mendel yanlış saymış.', 'Mendel miscounted.'), tag: 'mendel_wrong', fb: tr('Senin sayımın da tam 3:1 çıkmadı. İkiniz de mi yanlış saydınız?', "Your count wasn't exactly 3:1 either. Did you both miscount?") },
    ],
    explain: tr('Doğru. Her F2 tohumunun buruşuk olma olasılığı 1/4’tür, ama şans az sayıda tohumda büyük sapmalar yapar. Binlerce tohum sayınca oran 3:1’e yaklaşır. Buna büyük sayılar yasası denir.', 'Correct. Each F2 seed has a 1-in-4 chance of being wrinkled, but chance causes big swings in small counts. Count thousands and the ratio approaches 3:1. This is the law of large numbers.') },
};
function ask(id, vars) {
  const q = Object.assign({ id }, QS[id]);
  if (vars) q.prompt = { tr: fill(q.prompt.tr, vars), en: fill(q.prompt.en, vars) };
  return UI.ask(q);
}
function fill(s, vars) { for (const k in vars) s = s.split('{' + k + '}').join(vars[k]); return s; }

// ================================================================ curriculum map (codes from the 2024 TYMM biology programme)
const CURR = {
  themes: [
    { name: tr('9. sınıf · Yaşam', 'Grade 9 · Life'), items: [
      ['BİY.9.1.1', tr('Biyolojideki dönüm noktalarının insan hayatına katkıları', "Milestones in biology and what they gave us")],
      ['BİY.9.1.2', tr('Bilimsel araştırmada bilimin doğası', 'The nature of science in research')],
      ['BİY.9.1.4', tr('Canlıların özelliklerini bilimsel gözlemleme', 'Observing living things scientifically')],
      ['BİY.9.1.5', tr('Canlıları sınıflandırma', 'Classifying living things')],
      ['BİY.9.1.6', tr('Üç üst âlem ve canlıların özellikleri', 'The three domains of life')],
    ] },
    { name: tr('9. sınıf · Organizasyon', 'Grade 9 · Organisation'), items: [
      ['BİY.9.2.1', tr('İnorganik moleküllerin önemi', 'Why inorganic molecules matter')],
      ['BİY.9.2.2', tr('Organik moleküller: karbonhidrat, lipit, protein, vitamin', 'Organic molecules: carbohydrates, lipids, proteins, vitamins')],
      ['BİY.9.2.5', tr('Hücre alt birimleri ve işlevleri', 'Cell parts and their functions')],
      ['BİY.9.2.6', tr('Hücre zarından madde geçişleri', 'Transport across the cell membrane')],
      ['BİY.9.2.8', tr('Hücreden doku, organ ve sisteme', 'From cells to tissues, organs and systems')],
    ] },
    { name: tr('10. sınıf · Enerji', 'Grade 10 · Energy'), items: [
      ['BİY.10.1.2', tr('Fotosentez tepkimelerinin modeli', 'A model of photosynthesis')],
      ['BİY.10.1.3', tr('Fotosentezde kullanılan ve üretilen maddeler (deney)', 'What photosynthesis uses and makes (experiment)')],
      ['BİY.10.1.5', tr('Canlılarda sindirim çeşitleri ve yapıları', 'Types and structures of digestion')],
      ['BİY.10.1.7', tr('Hücresel solunum modeli', 'A model of cellular respiration')],
      ['BİY.10.1.9', tr('Fermantasyon (deney)', 'Fermentation (experiment)')],
      ['BİY.10.1.10', tr('Besin enerjisinin metabolizmaya katkısı', 'How food energy feeds metabolism')],
    ] },
    { name: tr('10. sınıf · Ekoloji', 'Grade 10 · Ecology'), items: [
      ['BİY.10.2.1', tr('Ekosistemin canlı ve cansız bileşenleri', 'Living and non-living parts of an ecosystem')],
      ['BİY.10.2.2', tr('Komünite ve popülasyonlarda etkileşimler', 'Interactions in communities and populations')],
      ['BİY.10.2.3', tr('Ekosistemde enerji akışı', 'Energy flow in ecosystems')],
      ['BİY.10.2.4', tr('Madde döngüleri modeli', 'A model of matter cycles')],
      ['BİY.10.2.5', tr('Ekolojik sürdürülebilirlik', 'Ecological sustainability')],
      ['BİY.10.2.6', tr('Sürdürülebilirliği kısıtlayan durumlar (gözlem)', 'Threats to sustainability (observation)')],
      ['BİY.10.2.8', tr('Doğal kaynakları ve biyoçeşitliliği koruma', 'Protecting resources and biodiversity')],
    ] },
    { name: tr('11. sınıf · Tepki ve homeostazi', 'Grade 11 · Response & homeostasis'), items: [
      ['BİY.11.1.5', tr('Duyu reseptörleri ve duyu organları', 'Sense receptors and sense organs')],
      ['BİY.11.1.9', tr('İskelet, kas ve eklemlerin eş güdümü', 'Bones, muscles and joints working together')],
      ['BİY.11.2.6', tr('Dolaşım sistemi ve homeostazi', 'Circulation and homeostasis')],
      ['BİY.11.2.7', tr('Solunum sistemi ve homeostazi', 'Breathing and homeostasis')],
    ] },
    { name: tr('12. sınıf · Üreme ve kalıtım', 'Grade 12 · Reproduction & inheritance'), items: [
      ['BİY.12.1.6', tr('Eşeysiz üreme çeşitleri', 'Kinds of asexual reproduction')],
      ['BİY.12.1.11', tr('Çiçeğin kısımları ve görevleri', 'Parts of a flower and their jobs')],
      ['BİY.12.1.12', tr('Çimlenmeyi etkileyen etmenler', 'What affects germination')],
      ['BİY.12.2.4', tr('Genetik değişikliklerin canlıya etkileri', 'How genetic changes affect living things')],
      ['BİY.12.2.5', tr('Mendel kalıtım ilkeleri', "Mendel's principles of inheritance")],
    ] },
  ],
  // 0 = not met, 1 = met in the game, 2 = answered correctly on the first try
  status() {
    const S = G.S, st = {};
    for (const id in S.journal.obs) st[OBS[id].code] = Math.max(st[OBS[id].code] || 0, 1);
    for (const id in S.cases) for (const c of CASES[id].codes) st[c] = Math.max(st[c] || 0, 1);
    for (const a of S.answers) st[a.code] = Math.max(st[a.code] || 0, a.ok ? 2 : 1);
    return st;
  },
  report() {
    const S = G.S, st = this.status();
    return {
      game: 'Seedkeeper / Tohum Bekçisi', version: G.version, exported: new Date().toISOString(), language: I18N.lang,
      time: { season: S.season, year: S.year, minutesPlayed: Math.round((S.played || 0) / 60) },
      cases: Object.fromEntries(CASE_ORDER.map(id => [id, { state: Q.state(id), step: Q.stepIndex(id), of: CASES[id].steps.length }])),
      observations: Object.keys(S.journal.obs).map(id => ({ id, code: OBS[id].code })),
      answers: S.answers.map(a => ({ question: a.q, code: a.code, firstTryCorrect: a.ok, tries: a.tries, confident: a.sure, misconception: a.tag, classVotes: a.votes })),
      experiments: S.journal.exps.map(e => ({ title: e.title.en, code: e.code || null })),
      reviews: Object.fromEntries(Object.entries(S.journal.reviews || {}).map(([k, r]) => [k, { bestFirstTry: r.best, questions: r.n, attempts: r.tries }])),
      curriculum: Object.fromEntries(Object.entries(st).map(([k, v]) => [k, ['not met', 'met', 'answered'][v]])),
    };
  },
  export() {
    const data = this.report();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'seedkeeper-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
};

// ================================================================ quest state machine
const Q = {
  _queue: [], _running: false,
  state(id) { const c = G.S && G.S.cases[id]; return !c ? 'locked' : c.done ? 'done' : 'open'; },
  stepIndex(id) { const c = G.S.cases[id]; return c ? c.step : 0; },
  step(id) { const c = G.S && G.S.cases[id]; if (!c || c.done) return null; return CASES[id].steps[c.step].id; },
  at(id, s) { return this.step(id) === s; },
  // Sarıkız counts as delivered once she is in the grass paddock or its east gate and you are close by
  cowAtPaddock(talk) {
    const c = actor('sarikiz'), p = W.player, r = [2860, 2210, 520, 370];
    if (!c || !U.inRect(c.x, c.y, r)) return false;
    return talk || U.inRect(p.x, p.y, r) || Math.hypot(p.x - c.x, p.y - c.y) < 160;
  },
  later(fn) { this._queue.push(fn); },
  open(id, quiet) {
    const S = G.S; if (S.cases[id]) return;
    S.cases[id] = { step: 0, done: false, t: Date.now() };
    S.focus = id;
    if (!quiet) this.later(() => UI.notice(CASES[id].title, CASES[id].blurb));
    G.save();
  },
  adv(id, to) {
    const c = G.S.cases[id]; if (!c || c.done) return;
    const st = CASES[id].steps;
    c.step = to ? Math.max(0, st.findIndex(s => s.id === to)) : c.step + 1;
    G.S.focus = id;
    if (c.step >= st.length) this.solve(id);
    else { AU.sfx('pen'); UI.toast(L(st[c.step].t), '→'); }
    G.save();
  },
  solve(id) {
    const S = G.S, c = S.cases[id], cs = CASES[id];
    c.done = true; c.step = cs.steps.length;
    if (cs.noRestore) return;
    const R = WORLD.regions[cs.region];
    S.restored[cs.region] = 1;
    ART.invalidateRegion(R.x, R.y, R.r);
    S.flags.mail = id; S.flags.mailNew = true;
    this.later(async () => {
      UI.stamp(T('solved'), L(cs.title));
      AU.sfx('success');
      await U.sleep(1500);
      UI.toast(T('restored', { p: L(R.name) }), '✿');
      if (cs.reward) cs.reward();
      await U.sleep(600);
      UI.toast(L({ tr: 'Posta kutusunda bir mektup var.', en: "There's a letter in the mailbox." }), '✉');
    });
  },
  objectiveText() {
    const S = G.S; if (!S) return '';
    const id = S.focus && this.state(S.focus) === 'open' ? S.focus : CASE_ORDER.find(k => this.state(k) === 'open');
    if (!id) return '';
    return L(CASES[id].steps[S.cases[id].step].t);
  },
  // restore actor states after load / new game
  // during the festival Grandma is in the square and Alp hosts from the stage
  _festWorld() {
    const S = G.S, fest = S.cases.festival, nine = actor('nebahat'), dz = actor('deniz');
    if (nine) nine.hidden = !fest;
    if (!dz) return;
    dz._home0 = dz._home0 || dz.home.slice();
    const hm = fest && !fest.done && fest.step >= 1 ? [2480, 2866, 70, 16] : dz._home0;
    if (dz.home[0] !== hm[0] || dz.home[1] !== hm[1]) { dz.home = hm.slice(); [dz.x, dz.y] = W.freeSpot(hm[0] + hm[2] / 2, hm[1] + hm[3] / 2); dz.tx = dz.x; dz.ty = dz.y; dz.state = null; }
  },
  applyWorld() {
    const S = G.S, c = actor('sarikiz');
    this._festWorld();
    if (c) {
      c.bloat = S.flags.cowTreated ? 0 : 1;
      if (S.flags.cowMoved) { c.home = [2900, 2250, 340, 290]; c.x = 3050; c.y = 2400; c.tx = c.x; c.ty = c.y; }
      else if (c.home[0] !== 3540) { c.home = [3540, 2230, 360, 260]; c.x = 3720; c.y = 2350; c.tx = c.x; c.ty = c.y; }
      c.state = null; c.lead = false;
    }
    W.waypoint = S.waypoint || null;
    if (S.player) [W.player.x, W.player.y] = W.freeSpot(S.player[0], S.player[1]);
    W.player.route = null;
    CAM.x = W.player.x; CAM.y = W.player.y;
  },
  update(dt) {
    const S = G.S;
    if (this._queue.length && !this._running && !UI.modal && !G.busy) {
      const f = this._queue.shift(); this._running = true;
      Promise.resolve().then(f).catch(e => console.error(e)).finally(() => { this._running = false; });
    }
    const c = actor('sarikiz');
    if (c) { const tgt = S.flags.cowTreated ? 0 : 1; if (c.bloat > tgt) c.bloat = Math.max(tgt, c.bloat - dt * 0.2); }
    if (this.at('bloat', 'lead') && c.state === 'follow' && !this._scene && this.cowAtPaddock()) {
      this._scene = true; this._ayten().catch(e => console.error(e)).finally(() => { this._scene = false; });
    }
    // cases that open when you arrive somewhere
    if (this.state('intro') === 'done') {
      if (!S.cases.pond && S.visited.pond) this.open('pond');
      if (!S.cases.light && W.inside === 'greenhouse') this.open('light');
      // only beside the bakery itself: the village square is big and you cross it on the way to everything else
      if (!S.cases.bakery && Math.hypot(W.player.x - 3070, W.player.y - 2900) < 240) this.open('bakery');
      if (!S.cases.seedbank && W.inside === 'seedbank') this.open('seedbank');
      // the finale: once most of the valley is well again, Grandma comes home for the harvest festival
      if (!S.cases.festival && CASE_ORDER.filter(k => k !== 'intro' && k !== 'festival' && this.state(k) === 'done').length >= 7) {
        this.open('festival'); S.flags.mail = 'fest_invite'; S.flags.mailNew = true; this._festWorld();
        this.later(() => UI.toast(L(tr('Posta kutusunda bir mektup var.', 'There’s a letter in the mailbox.')), '✉'));
      }
      // a later visit to the barn: Sarıkız has swallowed a nail
      if (!S.cases.hardware && this.state('bloat') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 4 && W.regionAt(W.player.x, W.player.y) === 'barn') this.open('hardware');
      if (!S.cases.spring && W.regionAt(W.player.x, W.player.y) === 'cave') this.open('spring');
      if (!S.cases.yayla && W.regionAt(W.player.x, W.player.y) === 'yayla') this.open('yayla');
      if (!S.cases.owl && this.state('bloat') === 'done' && this.state('hardware') !== 'open' && Math.hypot(W.player.x - 3240, W.player.y - 2170) < 240) this.open('owl');
      if (!S.cases.azik && this.state('bloat') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 3 && Math.hypot(W.player.x - 2520, W.player.y - 1705) < 150) this.open('azik');
      if (!S.cases.hucre && this.state('spring') !== 'open' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 4 && Math.hypot(W.player.x - 2740, W.player.y - 3070) < 170) this.open('hucre');
      if (!S.cases.asi && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 2190, W.player.y - 2540) < 190) this.open('asi');
      // Fatma Teyze's squash patch south of the fields: it opens when you come near once a couple of cases are done
      if (!S.cases.kabak && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 3 && Math.hypot(W.player.x - 1540, W.player.y - 2790) < 230) this.open('kabak');
      // Osman Amca's rusting wheat east of the squash patch
      if (!S.cases.pas && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 3 && Math.hypot(W.player.x - 2000, W.player.y - 2840) < 230) this.open('pas');
      // Sevim's slumped heap beside Grandma's steaming one in the farmyard
      if (!S.cases.kompost && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 4 && Math.hypot(W.player.x - 2290, W.player.y - 2330) < 170) this.open('kompost');
      if (!S.cases.leylek && S.season < 2 && this.state('hardware') !== 'open' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 2760, W.player.y - 2780) < 170) this.open('leylek');
      if (!S.cases.tansiyon && W.inside === 'clinic' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 4) this.open('tansiyon');
      if (!S.cases.eksik && W.inside === 'clinic' && this.state('tansiyon') === 'done') this.open('eksik');
      if (!S.cases.yogurt && this.state('well') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 3120, W.player.y - 1000) < 220) this.open('yogurt');
      if (!S.cases.sera && W.inside === 'greenhouse' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5) this.open('sera');
      if (!S.cases.hediye && this.state('bakery') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 3068, W.player.y - 2962) < 150) this.open('hediye');
      if (!S.cases.azot && this.state('pas') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 2000, W.player.y - 2840) < 230) this.open('azot');
      if (!S.cases.ekim && this.state('kabak') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 1500, W.player.y - 2748) < 230) this.open('ekim');
      if (!S.cases.etilen && this.state('asi') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 2150, W.player.y - 2560) < 230) this.open('etilen');
      if (!S.cases.sindirim && W.inside === 'clinic' && this.state('hediye') === 'done' && this.state('eksik') === 'done') this.open('sindirim');
      if (!S.cases.kul && this.state('sera') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 2330, W.player.y - 1720) < 230) this.open('kul');
      if (!S.cases.zar && this.state('yogurt') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 3150, W.player.y - 1010) < 200) this.open('zar');
      if (!S.cases.kilcal && this.state('yayla') === 'done' && CASE_ORDER.filter(k => this.state(k) === 'done').length >= 5 && Math.hypot(W.player.x - 4462, W.player.y - 350) < 230) this.open('kilcal');
      if (!S.cases.well && Math.hypot(W.player.x - 3230, W.player.y - 990) < 230) this.open('well');
    }
  },
  // a queued scene runs only if the case is still on the step that queued it, so a double tap cannot skip a step
  laterAt(id, step, fn) { this.later(async () => { if (this.at(id, step)) await fn(); }); },
  // a part seen before still counts when a step asks you to look at it again
  onSeen(id) { if (['slime_mat', 'actinomycete', 'compost_mite', 'thermophile', 'actino_chain', 'rust_stripe', 'resistant_leaf', 'spore_dust', 'rust_pustule', 'torn_epidermis', 'urediniospore', 'rust_hypha', 'haustorium', 'male_flower', 'female_flower', 'squash_bee', 'gourd_fence', 'sq_anther', 'sq_stigma', 'nectary', 'sq_ovary', 'sq_ovules', 'hardware', 'magnet_bolus', 'radicle', 'meristem', 'mb_test', 'gas_cells', 'dog_stomach', 'algae_bloom', 'pond_oxygen', 'decomposers', 'pond_plants', 'cyanobacteria', 'spirogyra', 'diatom', 'daphnia', 'paramecium', 'wheat_old_leaf', 'chloroplast_pale', 'cow_rumen', 'rumen_foam', 'mat_bands', 'sulfur_bacteria', 'rbc_column', 'red_cell', 'plasmolysis', 'salt_crust', 'owl_ears', 'rod_cell', 'sudan_test', 'cristae', 'rough_er', 'golgi', 'cambium', 'callus', 'mandible', 'ant', 'left_ventricle', 'smooth_muscle'].includes(id)) this.onObs(id); },
  onObs(id) {
    const S = G.S, has = k => !!S.journal.obs[k];
    if (this.at('intro', 'lens')) this.laterAt('intro', 'lens', async () => { await UI.say('player', tr('Demek böyle çalışıyor: ne görürsem defterime yazılıyor.', "So that's how it works: whatever I find goes into the journal.")); this.adv('intro'); });
    if (this.at('bloat', 'look') && has('cow_rumen') && has('rumen_foam')) this.laterAt('bloat', 'look', async () => { await UI.say('player', tr('İşkembe köpükle dolu… Gaz kabarcıklara hapsolmuş. Rıza Dede’ye söylemeliyim.', "The rumen is full of foam… the gas is trapped in bubbles. I need to tell Rıza Dede.")); this.adv('bloat'); });
    else if (this.at('bloat', 'look') && id === 'cow_rumen') UI.toast(L(tr('Şimdi soldaki ×10 düğmesiyle bir kat derine in.', 'Now use the ×10 button on the left to go one layer deeper.')), '↓');
    if (this.at('bloat', 'dog') && id === 'dog_stomach') this.laterAt('bloat', 'dog', async () => { await UI.say('player', tr('Karabaş’ın midesi tek bölmeli… İşkembe yok. Rıza Dede’ye anlatayım.', "Karabaş's stomach has just one chamber… no rumen. Let me tell Rıza Dede.")); this.adv('bloat'); });
    if (this.at('leaves', 'look') && (id === 'wheat_old_leaf' || id === 'chloroplast_pale')) this.laterAt('leaves', 'look', async () => { await UI.say('player', tr('Önce alttaki yaşlı yapraklar sararmış, üsttekiler yeşil. Toprağı test etmeliyim; kulübede bir set vardı.', "The old lower leaves yellowed first; the top ones are green. I should test the soil. There was a kit in the shed.")); this.adv('leaves'); });
    if (this.at('bakery', 'look') && id === 'mb_test') this.laterAt('bakery', 'look', async () => { await UI.say('player', tr('Hücrelerin çoğu mavi! Boyayı yalnızca ölü hücreler tutar… Maya ölmüş. Ama neden?', 'Most of the cells are blue! Only dead cells keep the dye… The yeast is dead. But why?')); this.adv('bakery'); });
    else if (this.at('bakery', 'look') && id === 'dense_dough') UI.toast(L(tr('Şimdi soldaki ×400 düğmesiyle mayaya in.', 'Now use the ×400 button on the left to go down to the yeast.')), '↓');
    else if (this.at('bakery', 'look') && id === 'yeast_cell') UI.toast(L(tr('Hücreler canlı mı, ölü mü? Masadaki “Metilen mavisi damlat” düğmesine bas.', 'Alive or dead? Press “Add methylene blue” on the table.')), '●');
    if (this.at('bakery', 'rise') && id === 'gas_cells') this.laterAt('bakery', 'rise', async () => { await UI.say('player', tr('Hamur kabarcık dolu! Maya CO₂ üretiyor, glüten ağı da gazı tutuyor. Nazlı Teyze’ye haber vereyim.', 'The dough is full of bubbles! The yeast is making CO₂ and the gluten web is holding it. Let me tell Nazlı Teyze.')); this.adv('bakery'); });
    if (this.at('seedbank', 'look') && has('radicle') && has('meristem')) this.laterAt('seedbank', 'look', async () => { await UI.say('player', tr('Kök ucu: yüksük korur, meristem bölünür, üstünde hücreler uzar. Şimdi Nine’nin eski kavanozlarını deneme zamanı.', 'The root tip: the cap protects, the meristem divides, and above it the cells stretch. Now it’s time to test Grandma’s old jars.')); this.adv('seedbank'); });
    else if (this.at('seedbank', 'look') && (id === 'radicle' || id === 'plumule' || id === 'cotyledon')) UI.toast(L(tr('Şimdi soldaki ×100 düğmesiyle kök ucunun içine in.', 'Now use the ×100 button on the left to go inside the root tip.')), '↓');
    if (this.at('hardware', 'look') && id === 'hardware') this.laterAt('hardware', 'look', async () => { await UI.say('player', tr('Börkenekte bir çivi var! Ucu duvarı delmiş, kalbe doğru ilerliyor. Hemen Ayten Hanım’a haber vermeliyim.', 'There’s a nail in the reticulum! Its point has gone through the wall, towards the heart. I have to tell Ayten right away.')); this.adv('hardware'); });
    if (this.at('hardware', 'check') && id === 'magnet_bolus') this.laterAt('hardware', 'check', async () => { await UI.say('player', tr('Mıknatıs börkeneğin dibine oturmuş, çivi de üstüne yatmış. Artık batamaz. Rıza Dede’ye söyleyeyim.', 'The magnet has settled on the floor of the reticulum, with the nail lying flat on it. It can’t pierce any more. Let me tell Rıza Dede.')); this.adv('hardware'); });
    if (this.at('spring', 'look') && has('mat_bands') && has('sulfur_bacteria')) this.laterAt('spring', 'look', async () => { await UI.say('player', tr('Renkli bantlar canlı! Kaynağın yanında içi parlak damlacıklarla dolu iplikler var, aşağıda yeşil siyanobakteriler. Sondayla sıcaklığı ölçmeliyim.', 'The coloured bands are alive! Near the vent there are threads full of bright droplets, and green cyanobacteria further down. I should measure the temperature with the probe.')); this.adv('spring'); });
    else if (this.at('spring', 'look') && ['hot_source', 'sulfur_crust', 'mat_bands', 'green_mat'].includes(id)) UI.toast(L(tr('Şimdi soldaki ×1000 düğmesiyle örtünün içine in.', 'Now use the ×1000 button on the left to go inside the mat.')), '↓');
    if (this.at('yayla', 'look') && has('rbc_column') && has('red_cell')) this.laterAt('yayla', 'look', async () => { await UI.say('player', tr('Yusuf Amca’nın tüpünde alyuvarlar kanın yarısından fazla; yaymada da onun tarafı alyuvarla dolu. Elif’inki %42. Yusuf Amca’ya anlatmalıyım.', 'In Uncle Yusuf’s tube the red cells fill more than half the blood, and his side of the smear is crowded with them. Elif’s is 42%. I must tell Uncle Yusuf.')); this.adv('yayla'); });
    else if (this.at('yayla', 'look') && ['rbc_column', 'buffy_coat', 'plasma'].includes(id)) UI.toast(L(tr('Şimdi soldaki ×1000 düğmesiyle kan yaymasına in.', 'Now use the ×1000 button on the left to go down to the blood smear.')), '↓');
    if (this.at('tansiyon', 'look') && has('left_ventricle') && has('smooth_muscle')) this.laterAt('tansiyon', 'look', async () => { await ask('tansiyon_wall'); await UI.say('player', tr('Hasan Dede’nin kalbi her atımda bu basınca karşı çalışıyor, damarları da yıllardır bu basıncı taşıyor. Bunu ona anlatmalıyım.', 'Hasan Dede’s heart works against this pressure at every beat, and his arteries have carried it for years. I must tell him.')); this.adv('tansiyon'); });
    else if (this.at('tansiyon', 'look') && !has('smooth_muscle') && ['left_ventricle', 'right_atrium', 'heart_valve', 'aorta', 'vena_cava'].includes(id)) UI.toast(L(tr('Şimdi ×40 damar kesitine in: atardamarın duvarında basıncı taşıyan katmanı bul.', 'Now go down to the ×40 vessel section: find the layer in the artery wall that bears the pressure.')), '↓');
    else if (this.at('tansiyon', 'look') && !has('left_ventricle') && ['artery', 'vein', 'smooth_muscle', 'endothelium', 'capillary', 'red_cell', 'diffusion', 'sarcomere', 'alveolus', 'alveolar_wall', 'gas_exchange', 'type2_cell', 'dust_cell'].includes(id)) UI.toast(L(tr('Bir de ×1 kalp modelinde en kalın duvarlı odacığı bul.', 'Now find the chamber with the thickest wall on the ×1 heart model.')), '↑');
    if (this.at('leylek', 'look') && has('mandible') && has('ant')) this.laterAt('leylek', 'look', async () => { await ask('leylek_web'); await UI.say('player', tr('Çayır koca bir ağ: çiğneyen, emen, avlanan, anlaşan, içten yiyen… İlaç bu ağın hepsini birden kesiyor. Ayten Hanım’a anlatmalıyım.', 'The meadow is one big web: chewers, suckers, hunters, partners, eaters-from-inside… Spray cuts every thread of it at once. I must tell Ayten.')); this.adv('leylek'); });
    else if (this.at('leylek', 'look') && !has('ant') && [...INSECT.KINDS, 'aphid_mummy'].includes(id)) UI.toast(L(tr('Yaprağın altında (×10) bitlerle anlaşan böceği bul.', 'Under the leaf (×10), find the insect that does a deal with the aphids.')), '↓');
    else if (this.at('leylek', 'look') && !has('mandible') && [...INSECT.KINDS, 'ant', 'aphid_mummy'].includes(id)) UI.toast(L(tr('Şimdi çekirgenin başına (×20) in: ot yediğini ağzından nasıl anlarız?', 'Now go down to the grasshopper’s head (×20): how does its mouth tell us it eats grass?')), '↓');
    else if (this.at('leylek', 'look') && !has('ant') && ['mandible', 'antenna', 'hopper_eye', 'palp'].includes(id)) UI.toast(L(tr('Bir de ×10 yaprağın altına dön: bitlerle anlaşan böceği bul.', 'Now go back up to the ×10 leaf underside: find the insect that does a deal with the aphids.')), '↑');
    if (this.at('asi', 'look') && has('cambium') && has('callus')) this.laterAt('asi', 'look', async () => { await ask('asi_cambium'); await UI.say('player', tr('Sır o ince yeşil halkada: bölünebilen tek katman o. Kalemin ve anacın kambiyumu değerse kallus ikisini kaynaştırır. Şimdi aşı masasına.', 'The secret is that thin green ring: it’s the only layer that can divide. If the cambium of scion and rootstock touch, callus knits them together. Now to the grafting table.')); this.adv('asi'); });
    else if (this.at('asi', 'look') && !has('cambium') && ['scion', 'rootstock', 'graft_union', 'apple_pip'].includes(id)) UI.toast(L(tr('Dalın ×40 kesitine in: kabuğun hemen altındaki ince yeşil halkayı bul.', 'Go down to the ×40 twig section: find the thin green ring just under the bark.')), '↓');
    else if (this.at('asi', 'look') && !has('callus') && ['bark', 'phloem', 'cambium', 'xylem_wood', 'pith'].includes(id)) UI.toast(L(tr('Şimdi ×400 aşı yerine in: yarayı kapatan hücreleri bul.', 'Now go down to the ×400 graft union: find the cells that close the wound.')), '↓');
    if (this.at('kabak', 'look') && has('sq_stigma') && has('sq_ovary')) this.laterAt('kabak', 'look', async () => { await ask('kabak_parts'); await UI.say('player', tr('Polen dişi çiçeğin tepesine konmalı; arı ise polenin hangi kabaktan geldiğine bakmıyor. Tozlama masasına gideyim: polenin nereden geleceğini ben seçeceğim.', 'Pollen has to land on the female flower’s stigma, and the bee doesn’t care which squash the pollen comes from. Let me go to the pollination table: I’ll choose where the pollen comes from.')); this.adv('kabak'); W.waypoint = G.S.waypoint = { x: 1430, y: 2830 }; UI.toast(L(tr('Tozlama masasına git (haritada işaretli).', 'Go to the pollination table (marked on the map).')), '➜'); });
    else if (this.at('kabak', 'look') && ['male_flower', 'female_flower', 'squash_bee', 'gourd_fence'].includes(id)) UI.toast(L(tr('Şimdi soldaki ×5 düğmesiyle çiçeklerin içine in: dişicik tepesini ve yumurtalığı bul.', 'Now use the ×5 button on the left to go inside the flowers: find the stigma and the ovary.')), '↓');
    if (this.at('pas', 'look') && has('rust_pustule') && has('haustorium')) this.laterAt('pas', 'look', async () => { await ask('pas_fungus'); await UI.say('player', tr('Bu pas demir değil, canlı: yaprağın içinde yaşayan bir mantar. Peki neden yalnızca Osman Amca’nın tarlasını sardı? Tarlanın yanındaki rüzgâr masasında deneyeyim.', 'This rust isn’t iron, it’s alive: a fungus living inside the leaf. But why did it sweep only Osman Amca’s field? Let me try it at the wind table beside the plot.')); this.adv('pas'); W.waypoint = G.S.waypoint = { x: 2140, y: 2870 }; UI.toast(L(tr('Rüzgâr masasına git (haritada işaretli).', 'Go to the wind table (marked on the map).')), '➜'); });
    else if (this.at('pas', 'look') && !has('rust_pustule') && ['rust_stripe', 'resistant_leaf', 'spore_dust'].includes(id)) UI.toast(L(tr('Şimdi soldaki ×40 düğmesiyle yaprağın yüzüne in: turuncu kabarcıklardan birini bul.', 'Now use the ×40 button on the left to go down to the leaf surface: find one of the orange blisters.')), '↓');
    else if (this.at('pas', 'look') && !has('haustorium') && ['rust_pustule', 'torn_epidermis', 'rust_stripe', 'resistant_leaf', 'spore_dust'].includes(id)) UI.toast(L(tr('Şimdi ×400 kabarcığın kesitine in: mantarın bir yaprak hücresine soktuğu ucu bul.', 'Now go down to the ×400 section through a blister: find the tip the fungus pushes into a leaf cell.')), '↓');
    else if (this.at('pas', 'look') && !has('rust_pustule') && ['urediniospore', 'rust_hypha', 'haustorium'].includes(id)) UI.toast(L(tr('Bir de ×40 katmanında turuncu kabarcıklardan birini bul.', 'Now find one of the orange blisters on the ×40 layer too.')), '↑');
    if (this.at('kompost', 'look') && has('actinomycete') && has('thermophile')) this.laterAt('kompost', 'look', async () => { await ask('kompost_heat'); await UI.say('player', tr('Isıyı yapan milyarlarca minik canlı; ama havasız ve ıslak yerde çalışamıyorlar. Avludaki kasada ısınan bir yığın kurmayı deneyeyim.', 'Billions of tiny living things make the heat, but they can’t work where it’s airless and wet. Let me try building a heap that heats up in the bin in the yard.')); this.adv('kompost'); W.waypoint = G.S.waypoint = { x: 2360, y: 2300 }; UI.toast(L(tr('Kompost kasasına git (haritada işaretli).', 'Go to the compost bin (marked on the map).')), '➜'); });
    else if (this.at('kompost', 'look') && !has('thermophile') && ['slime_mat', 'actinomycete', 'compost_mite'].includes(id)) UI.toast(L(tr('Şimdi en alttaki ×1000 katmanına in: yığının en sıcak yerindeki bakterileri bul.', 'Now go down to the ×1000 layer at the bottom: find the bacteria from the hottest spot in the heap.')), '↓');
    else if (this.at('kompost', 'look') && !has('actinomycete') && ['thermophile', 'actino_chain', 'compost_mite'].includes(id)) UI.toast(L(tr('Bir de ×1 katmanında yığının sıcak içindeki beyaz iplikleri bul.', 'Now find the white threads in the hot inside of the heap on the ×1 layer too.')), '↑');
    if (this.at('hucre', 'look') && has('rough_er') && has('golgi')) this.laterAt('hucre', 'look', async () => { await ask('hucre_protein'); await UI.say('player', tr('İçi boş bir torba değil, koca bir fabrika! Ribozom yapıyor, ER taşıyor, Golgi paketliyor. Mehmet Dede’ye göstermeliyim.', 'Not an empty bag but a whole factory! Ribosomes make, the ER carries, the Golgi packs. I must show Mehmet Dede.')); this.adv('hucre'); });
    else if (this.at('hucre', 'look') && ['onion_scale', 'onion_skin', 'cover_slip', 'air_bubble', 'cytoplasm', 'cell_membrane', 'cheek_cell', 'cell_wall', 'vacuole', 'nucleus'].includes(id)) UI.toast(L(tr('Işık mikroskobu bu kadar. En alttaki ×10000 katmanına in: tükürük bezi hücresi.', 'That’s as far as the light microscope goes. Go down to the ×10000 layer: a salivary gland cell.')), '↓');
    else if (this.at('hucre', 'look') && ['rough_er', 'golgi', 'nucleolus', 'centriole', 'secretory_vesicle', 'lysosome', 'mitochondrion'].includes(id)) UI.toast(L(has('rough_er') ? tr('Şimdi proteini paketleyen yassı kesecik yığınını bul.', 'Now find the stack of flat sacs that packages the protein.') : tr('Şimdi üstü ribozomlarla kaplı zar kanallarını bul.', 'Now find the membrane channels studded with ribosomes.')), '●');
    if (this.at('azik', 'look') && has('sudan_test') && has('cristae')) this.laterAt('azik', 'look', async () => { await UI.say('player', tr('Ceviz enerjisini hücrelerindeki yağ damlacıklarında saklıyor; kas hücresi onu mitokondrinin kıvrımlarında ATP’ye çeviriyor. Alp’a anlatmalıyım.', 'The walnut keeps its energy in the oil droplets in its cells, and a muscle cell turns it into ATP on the folds of its mitochondria. I must tell Alp.')); this.adv('azik'); });
    else if (this.at('azik', 'look') && !has('sudan_test') && ['walnut_kernel', 'lokum_sugar', 'leblebi', 'bread_starch'].includes(id)) UI.toast(L(tr('Cevizin ×400 hücrelerine in ve Sudan III damlat: enerji nerede saklı?', 'Go down to the walnut’s ×400 cells and add Sudan III: where is the energy stored?')), '↓');
    else if (this.at('azik', 'look') && !has('sudan_test') && ['oil_body', 'protein_body'].includes(id)) UI.toast(L(tr('Masadaki Sudan III düğmesiyle boya damlat.', 'Use the Sudan III button on the table to add the dye.')), '●');
    else if (this.at('azik', 'look') && has('sudan_test') && !has('cristae') && ['oil_body', 'protein_body', 'sudan_test', 'sarcomere', 'glycogen', 'lipid_droplet', 'mitochondrion'].includes(id)) UI.toast(L(tr('Kas hücresinde (×20000) mitokondrinin iç zarındaki kıvrımları bul.', 'In the muscle cell (×20000), find the folds of the mitochondrion’s inner membrane.')), '↓');
    if (this.at('owl', 'look') && has('owl_ears') && has('rod_cell')) this.laterAt('owl', 'look', async () => { await ask('owl_dark'); await UI.say('player', tr('Karanlıkta kulağıyla, alacakaranlıkta gözüyle avlanıyor. Peki ne avlıyor? Samanlığın altındaki gri topaklara bakmalıyım.', 'It hunts by ear in the dark and by eye at dusk. But what does it hunt? I must look at those grey lumps under the hay loft.')); this.adv('owl'); });
    else if (this.at('owl', 'look') && !has('rod_cell') && ['facial_disc', 'owl_ears', 'owl_eye', 'silent_feather'].includes(id)) UI.toast(L(tr('Şimdi soldaki ×400 düğmesiyle gözün retinasına in.', 'Now use the ×400 button on the left to go down into the eye’s retina.')), '↓');
    else if (this.at('owl', 'look') && !has('owl_ears') && ['rod_cell', 'cone_cell', 'retina_nerve', 'pigment_layer'].includes(id)) UI.toast(L(tr('Bir de ×1 katmanında kulak deliklerini bul.', 'Now find the ear openings in the ×1 layer too.')), '↑');
    if (this.at('well', 'look') && has('plasmolysis') && has('salt_crust')) this.laterAt('well', 'look', async () => { await UI.say('player', tr('Toprağın yüzü tuz kabuğu tutmuş. Kök hücrelerinin zarı çeperden ayrılmış: hücreler su kaybediyor! Su nereden geliyor? Kuyudan. Kuyu suyunu ölçmeliyim.', 'The soil has a crust of salt on it. In the root cells the membrane has pulled away from the wall: the cells are losing water! Where does the water come from? The well. I must measure the well water.')); this.adv('well'); });
    else if (this.at('well', 'look') && !has('plasmolysis') && ['salt_wilt', 'salt_crust', 'root_hair'].includes(id)) UI.toast(L(tr('Şimdi soldaki ×400 düğmesiyle kök hücrelerine in.', 'Now use the ×400 button on the left to go down to the root cells.')), '↓');
    else if (this.at('well', 'look') && !has('salt_crust') && ['plasmolysis', 'vacuole', 'cell_wall'].includes(id)) UI.toast(L(tr('Bir de ×1 katmanında toprağın yüzündeki beyaz kabuğa bak.', 'Now look at the white crust on the soil in the ×1 layer too.')), '↑');
    // any spot on the pond counts: the student has looked at the water, and the next step is to measure it
    if (this.at('pond', 'look') && ['algae_bloom', 'pond_oxygen', 'decomposers', 'pond_plants', 'cyanobacteria', 'spirogyra', 'diatom', 'daphnia', 'paramecium'].includes(id)) this.laterAt('pond', 'look', async () => {
      await UI.say('player', tr('Su alglerle dolu. Kıyıdan bir şişe su alıp ölçmeliyim.', 'The water is full of algae. I should fill a bottle at the shore and measure it.'));
      this.adv('pond'); W.waypoint = G.S.waypoint = { x: 985, y: 2520 };
      UI.toast(L(tr('Gölet kıyısına git (haritada işaretli).', 'Go to the pond shore (marked on the map).')), '➜');
    });
  },
  canDive() { return this.at('bloat', 'ride') || this.state('bloat') === 'done'; },
  dive() {
    if (STUDY.on) STUDY.close();
    LENS.toggle(false);
    RIDE.start(() => { if (this.at('bloat', 'ride')) this.adv('bloat'); });
  },
  async begin() {
    this.open('intro', true);
    G.busy = true;
    await U.sleep(900);
    await UI.talk([
      ['narrator', tr('Denizli’de bir vadi. Nebahat Nine’nin saha istasyonu: eski köy okulu.', "A valley in Denizli. Grandma Nebahat's field station: the old village school.")],
      ['player', tr('Nine? … Evde kimse yok. Masada bir zarf var.', "Grandma? … Nobody's home. There's an envelope on the desk.")],
    ]);
    G.busy = false;
  },
  async afterSleep() {
    const S = G.S;
    if (this.at('leaves', 'sleep')) {
      if (S.fields.B.n >= 40) {
        await UI.say('player', S.flags.usedFert ? tr('Siyez yeşermiş! Ama nehir de yeşil akıyor… Gübrenin fazlası nereye gitti?', 'The siyez has greened up! But the river is running green too… where did the extra fertiliser go?') : tr('Siyez yeşermiş! Kompost işe yaradı. Hasattan sonra nohut toprağa azot kazandıracak.', 'The siyez is green again! The compost worked. After the harvest the chickpeas will add nitrogen to the soil.'));
        this.adv('leaves');
      } else { await UI.say('player', tr('Bekledim ama siyez daha da sarardı. Bir plan yapmam gerek.', 'I waited, but the siyez only got yellower. I need a plan.')); this.adv('leaves', 'plan'); }
    }
    if (this.at('pond', 'wait')) {
      if (S.pond.algae < 45 && S.pond.oxygen >= 50) { await UI.say('player', tr('Gölet berraklaşıyor. Oksijen yükselmiş… ve kurbağalar geri dönmüş!', 'The pond is clearing. The oxygen is up… and the frogs are back!')); this.adv('pond'); }
      else await UI.say('player', tr('Gölet biraz iyileşmiş ama henüz yeterli değil. Bir mevsim daha beklemeliyim.', "The pond is a little better, but not there yet. I should wait another season."));
    }
    if (this.at('mendel', 'grow')) { S.mendel.bed = 'grown'; this.adv('mendel'); }
    if (!S.cases.pond && this.state('intro') === 'done') this.open('pond');
  },

  // on the yayla: Uncle Yusuf hears what the student found, and Elif asks about the summit
  async _altitude() {
    await UI.say('yusuf', tr('Ee, ne buldun? Elif hasta mı?', 'Well, what did you find? Is Elif ill?'));
    await ask('altitude_adapt');
    await ask('altitude_advice');
    await UI.talk([
      ['elif', tr('Tamam, zirveye koşmak yok. Önce bir hafta yavaş yavaş, Yusuf Amcam gibi.', 'All right, no running to the summit. First a week of taking it slowly, like Uncle Yusuf.')],
      ['yusuf', tr('Aferin evladım: ölçtün, karşılaştırdın, açıkladın. Herkese aynı testi yapmayı da unutmadın.', 'Well done, child: you measured, you compared, you explained. And you remembered to give everyone the same test.')],
    ]);
    this.adv('yayla');
  },
  // in Songül's garden: the student explains why the wet soil leaves the seedlings thirsty, and what to do
  async _garden() {
    await UI.say('songul', tr('Ee, ne buldun? Fidelerim kurtulur mu?', 'Well, what did you find? Can my seedlings be saved?'));
    await ask('salt_why');
    await ask('salt_fix');
    G.S.flags.gardenFixed = true;
    await UI.talk([
      ['songul', tr('Demek su bol diye her su iyi değil… Oluğun altına bir bidon koyalım; kuyunun suyu da yalnızca avluyu yıkasın.', 'So plenty of water isn’t always good water… Let’s put a barrel under the gutter, and the well water can just wash the yard.')],
      ['player', tr('Önce toprağı bol yağmur suyuyla yıkayalım: tuz köklerin altına insin. Sonra az az, sık sık.', 'First let’s wash the soil with plenty of rain water, so the salt sinks below the roots. Then little and often.')],
      ['songul', tr('Patatesle kuyunun tuzunu ölçtün ha! Oğluma da anlatacağım; o da okulda yapsın.', 'You measured the salt in the well with a potato! I’ll tell my son; he should do it at school too.')],
    ]);
    UI.toast(L(tr('Bir hafta sonra: fideler dimdik!', 'A week later: the seedlings stand tall!')), '☂');
    this.adv('well');
  },
  // at the barn: the student shows Rıza Dede the evidence against the poison and the old belief
  async _owl() {
    await UI.say('riza', tr('Ee evladım, ne buldun? Zehri yarın sabah koyacağım.', 'Well, child, what did you find? I’m putting the poison down tomorrow morning.'));
    await ask('owl_poison');
    await ask('owl_omen');
    await ask('owl_fix');
    G.S.flags.owlSafe = true;
    await UI.talk([
      ['riza', tr('Nebahat de hep “baykuş ambarın bekçisidir” derdi, ben inanmazdım… Zehri kaldırıyorum. Duvara bir yuva çakarım.', 'Nebahat always said “the owl is the grain store’s guard”, and I never believed her… I’m putting the poison away. I’ll nail a nest box to the wall.')],
      ['player', tr('Tahılı da kapaklı bidonlara koyalım: fare giremesin, baykuş da gece nöbetini tutsun.', 'And let’s put the grain in lidded bins: the mice can’t get in, and the owl keeps the night watch.')],
      ['riza', tr('Al, karakılçık buğdayı. Bu ambardan çıktı; bekçimiz sayesinde seneye de çıkar.', 'Here, some Karakılçık wheat. It came out of this store, and thanks to our guard there’ll be more next year.')],
    ]);
    this.adv('owl');
  },
  // under the walnut tree: the student shows Alp where the energy is and what to pack
  async _azik() {
    await UI.say('deniz', tr('Ee? Lokum mu, ceviz mi? Yarın sabah yedide yola çıkıyoruz!', 'So? Lokum or walnuts? We set off at seven tomorrow morning!'));
    await ask('azik_where');
    await ask('azik_lavoisier');
    await ask('azik_pack');
    await UI.talk([
      ['deniz', tr('Yani Hasan Dede haklıymış… ama lokum da tamamen gereksiz değilmiş! Yokuşun ortasında bir tane, ödül gibi.', 'So Grandpa Hasan was right… but lokum isn’t totally useless either! One halfway up the hill, as a reward.')],
      ['player', tr('Ceviz yol boyunca, leblebi cebinde, lokum da zor anlar için. Bir de mataranı unutma.', 'Walnuts along the way, leblebi in your pocket, and lokum for the hard bits. And don’t forget your water bottle.')],
      ['deniz', tr('Al, ağaçtan bir avuç ceviz topladım. Birini ek: iki yüz yıl yaşarmış!', 'Here, I picked a handful of walnuts off the tree. Plant one: they live for two hundred years!')],
    ]);
    this.adv('azik');
  },
  // at the teahouse: Mehmet Dede makes his own slide, and meets his first air bubble
  async _hucre() {
    await UI.talk([
      ['elder2', tr('Ee, göster bakalım şu hücreni… Dur, ben de bir tane yapayım. Zar, damla, cam… şak!', 'Well, let’s see this cell of yours… Wait, I’ll make one too. Skin, drop, glass… slap!')],
      ['player', tr('(Mehmet Dede lameli tek hamlede damlanın üstüne bastırıyor ve mikroskoba eğiliyor.)', '(Mehmet Dede slaps the coverslip down on the drop in one go and bends over the microscope.)')],
    ]);
    await ask('hucre_bubble');
    await ask('hucre_theory');
    await UI.talk([
      ['elder2', tr('Soğan tuğla tuğla, benim yanağım da öyle… Yetmiş yıllık soğan, meğer hücreymiş. İçlerinde de koca bir fabrika varmış!', 'The onion is brick upon brick, and so is my cheek… Seventy years of onions, and they were cells all along. With a whole factory inside them!')],
      ['elder1', tr('Mehmet, ben sana dedim: bu çocuk Nebahat’in torunu.', 'Mehmet, I told you: this child is Nebahat’s grandchild.')],
      ['elder2', tr('Al evladım, bizim bahçenin kırmızı soğanının tohumu. Ekersen bir daha doğrarken hücrelerini selamla!', 'Here, child: seed from the red onions in my garden. Plant them, and next time you chop one, say hello to its cells!')],
    ]);
    this.adv('hucre');
  },
  // by the old apple tree: the saplings have taken, and the mukhtar's pips get their answer
  // at the farmyard heaps: why Sevim's heap went bad, and how to rescue it
  async _kompost() {
    await UI.say('sevim', tr('Söyle bakalım, benim çimin nesi eksik? Nebahat Hanım’ın yığınına ne koyduysa ben de onu koydum sanıyordum.', 'Well, tell me, what is my grass missing? I thought I’d put in whatever Nebahat Hanım put in hers.'));
    await ask('kompost_sevim');
    await UI.talk([
      ['sevim', tr('Demek yığının da nefes alması gerekiyormuş… Çim tek başına ıslak bir yorgan gibi üstüne çökmüş.', 'So a heap needs to breathe too… On its own, the grass slumped on it like a wet quilt.')],
      ['player', tr('Karıştırınca birkaç günde ısınır. İçi 55 °C’yi geçince yabancı ot tohumları ve hastalık mikropları da ölür.', 'Once it’s mixed it’ll warm up in a few days. When the inside passes 55 °C, weed seeds and disease germs die too.')],
      ['sevim', tr('O zaman sonbahar yapraklarını da buraya getireceğim. Al, annemin pembe domatesinin tohumu; kompost olunca ilk fideleri oraya dikeceğiz.', 'Then I’ll bring the autumn leaves here too. Here, the seed of my mother’s pink tomato; once it’s compost, we’ll plant the first seedlings in it.')],
    ]);
    G.S.flags.compostFixed = true;
    this.adv('kompost');
  },
  // at Osman Amca's plot: what the orange dust is, and what to sow next year
  async _pas() {
    await UI.say('osman', tr('Eee, söyle bakalım evlat. Demir mi yağdı, tarlama nazar mı değdi?', 'Well, tell me, child. Did it rain iron, or has someone put the evil eye on my field?'));
    await ask('pas_osman');
    await UI.talk([
      ['osman', tr('Demek şehirden aldığım tohumların hepsi birbirinin aynısıymış; pas birini sevdiyse hepsini sevmiş… Nebahat Hanım’ın tarlası da o yüzden yemyeşil.', 'So all the seed I bought in the city was one and the same; if the rust liked one plant, it liked them all… And that’s why Nebahat Hanım’s field is so green.')],
      ['player', tr('Gelecek yıl tarlanın bir kısmına karışık tohum ekin. Hangi bitkilerin daha iyi dayandığını birlikte not ederiz.', 'Next year sow part of your field with mixed seed. We’ll note together which plants hold out best.')],
      ['osman', tr('Anlaştık. Nebahat Hanım geçen güz bana bir torba karakılçık vermişti, “eski usul” diye ekmemiştim. Yarısını al, tohum kutusuna koy; yarısını bu güz ben ekeceğim.', 'Deal. Last autumn Nebahat Hanım gave me a bag of karakılçık seed, and I didn’t sow it because it was “old-fashioned”. Take half for the seed box; I’ll sow the other half this autumn.')],
    ]);
    G.S.flags.rustWise = true;
    this.adv('pas');
  },
  // in the squash patch: what went wrong with the seed, and how to keep the variety pure from now on
  async _kabak() {
    await UI.say('fatma', tr('Eee, anlat bakalım. Tohum mu bozuldu, ben mi yaşlandım?', 'Well, go on. Has the seed gone bad, or have I just got old?'));
    await ask('kabak_cross');
    await ask('kabak_keep');
    await UI.talk([
      ['fatma', tr('Demek kabak aynıydı da çekirdeği karışmıştı… Kırk yıl sakladım, bunu bilmiyordum. Arıya kızacak halim yok ya!', 'So the squash was the same, but its seed was crossed… Forty years I kept it and never knew. I can hardly be cross with the bees!')],
      ['player', tr('Bu yıl etiketli kabağın çekirdeklerini ayrı zarfa koyalım. Birkaç bitkiyi daha elle tozlayalım ki çeşit daralmasın.', 'This year let’s put the tagged squash’s seeds in their own packet. And let’s hand-pollinate a few more plants, so the variety doesn’t narrow.')],
      ['fatma', tr('Sevim’e de söyleyeyim, süs kabağını bahçesinin öbür ucuna diksin. Al şu zarfı, Nebahat’in kutusuna koy. Köye de haber vereyim: acı çıkan kabağı kimse yemesin.', 'I’ll tell Sevim too: she can plant her gourds at the far end of her garden. Take this packet and put it in Nebahat’s box. And I’ll tell the village: nobody is to eat a bitter squash.')],
    ]);
    G.S.flags.squashPure = true;
    this.adv('kabak');
  },
  async _asi() {
    await UI.say('huseyin', tr('İki fidan tutmuş! Gözleri patlamış bile. Muhtar da uğradı az önce, hâlâ aynı şeyi söylüyor…', 'Two saplings have taken! Their buds have burst already. The mukhtar dropped by just now, still saying the same thing…'));
    await ask('asi_pips');
    await ask('asi_clone');
    await UI.talk([
      ['huseyin', tr('Dedem derdi ki: “Ağaç ölür, dalı yaşar.” Bu iki fidan o ağacın ta kendisi; yüz yıl sonra da aynı elmayı verecekler.', 'My grandfather used to say: “The tree dies; its branch lives on.” These two saplings are that very tree; in a hundred years they’ll bear the same apple.')],
      ['player', tr('Birini çiftliğe, birini okulun bahçesine dikelim. Bir de başka eski çeşitlerden kalem toplayalım: hepsi aynı olmasın.', 'Let’s plant one on the farm and one in the school garden. And let’s collect scions from other old varieties too, so they aren’t all the same.')],
      ['huseyin', tr('Aferin sana. Al şu kalemleri de Nebahat’in kutusuna koy: tohum değil ama tohumdan kıymetli.', 'Well done. Take these scions and put them in Nebahat’s box: not seeds, but worth more than seeds.')],
    ]);
    G.S.flags.appleSaved = true;
    this.adv('asi');
  },
  // at the clinic: the sweep-net results, the cooperative's question, and the chick goes home
  async _leylek() {
    await UI.talk([
      ['ayten', tr('Anlat bakalım, çayırda ne buldun?', 'Go on, tell me: what did you find in the meadow?')],
      ['player', tr('İlaçsız çayırda beş süpürmede onlarca hayvan çıktı: çekirge, tırtıl, bit, kelebek, uğur böceği, örümcek. İlaçlı çayırda ancak birkaç tane.', 'Five sweeps in the unsprayed meadow brought up dozens of animals: grasshoppers, caterpillars, aphids, butterflies, ladybirds, spiders. In the sprayed one, only a handful.')],
      ['player', tr('Orada piramidin tabanı çökmüş. Otçul yoksa örümceğe, kurbağaya, leyleğe de besin yok. Anne baba bu yüzden ta dereye kadar uçuyor.', 'The base of the pyramid has collapsed there. With no plant-eaters there’s no food for spiders, frogs or storks either. That’s why the parents fly all the way to the stream.')],
      ['ayten', tr('Tahmin ediyordum… Kooperatif başkanı da burada. Sana bir şey soracak.', 'I thought as much… The head of the cooperative is here too. He has a question for you.')],
    ]);
    await ask('leylek_spray');
    await UI.talk([
      ['ayten', tr('Başkan ikna oldu: çayırın kenarına iki metrelik ilaçsız bir şerit bırakıp gelincik, papatya ekecekler. İlaç da ancak sayım gösterirse.', 'He’s convinced: they’ll leave a two-metre unsprayed strip along the meadow and sow poppies and daisies. And they’ll spray only if a count calls for it.')],
      ['ayten', tr('Yavruya gelince: artık kendi başına yiyebiliyor. Akşam itfaiyenin merdiveniyle yuvasına geri koyacağız; anne babası onu tanır.', 'As for the chick: it can feed itself now. This evening we’ll put it back in its nest with the fire brigade’s ladder; its parents will know it.')],
      ['player', tr('Gelincik tohumunu Nine’nin kutusuna koyayım: tarla kenarı boş kalmasın.', 'I’ll put the poppy seed in Grandma’s box: a field edge shouldn’t be left bare.')],
    ]);
    G.S.flags.chickHome = true;
    this.adv('leylek');
  },
  // at the teahouse: Hasan Dede, his salt cellar, and the numbers he doesn't believe
  async _tansiyon() {
    await UI.talk([
      ['elder1', tr('Geldi bizim doktor! Ne çıktı, yüz altmış mı ne? Bak evladım, ben seksen yaşındayım, bir gün yatağa düşmedim.', 'Here comes our doctor! What was it, a hundred and sixty or something? Look, child, I’m eighty years old and I’ve never spent a day in bed.')],
      ['player', tr('164’e 98, Hasan Dede. Bu yüksek. Ölçerken bir şey hissettiniz mi?', '164 over 98, Hasan Dede. That’s high. Did you feel anything while I measured?')],
      ['elder1', tr('Hiçbir şey! İşte bu yüzden ölçüm yanlış.', 'Nothing at all! That’s exactly why the reading is wrong.')],
    ]);
    await ask('tansiyon_silent');
    await UI.say('elder1', tr('Peki, peki… Ama tuzu bırakamam. Tuzsuz cacık olur mu, tuzsuz turşu olur mu?', 'All right, all right… But I can’t give up salt. What’s cacık without salt, what’s a pickle without salt?'));
    await ask('tansiyon_salt');
    await UI.talk([
      ['elder2', tr('Hasan, çocuk haklı. Rahmetli kardeşim de “hiçbir şeyim yok” derdi…', 'Hasan, the child is right. My late brother used to say “there’s nothing wrong with me” too…')],
      ['elder1', tr('Tamam, tamam! Perşembe günü Zehra Hanım’a gidip doktora görüneceğim. Tuzluğu da… şu rafa kaldırayım.', 'Fine, fine! On Thursday I’ll go to Zehra and see the doctor. And the salt cellar… I’ll put it up on that shelf.')],
      ['player', tr('Yemeklere reyhan koyun: tuzun yerini kokusu tutar. Bir de her akşam dereye kadar yürüyelim mi?', 'Put basil in your food: its scent makes up for the salt. And shall we walk to the stream together every evening?')],
      ['elder1', tr('Sen önden git, ben arkandan gelirim. Yavaş ama, benim tansiyonum var!', 'You lead, I’ll follow. Slowly, mind: I’ve got blood pressure!')],
    ]);
    G.S.flags.hasanChecked = true;
    this.adv('tansiyon');
  },
  async _eksik() {
    await UI.talk([
      ['zehra', tr('Aşılar bitti, kolum koptu! Anlat bakalım: dört hastanın defterinde ne yazdın?', 'The vaccinations are done and my arm’s about to drop off! Tell me: what did you write in the four patients’ notes?')],
      ['player', tr('Selin’de demir, Recep Dede’de C vitamini, Ömer’de D vitamini, Gülsüm Teyze’de iyot eksik.', 'Selin lacks iron, Recep Dede vitamin C, Ömer vitamin D, and Gülsüm Teyze iodine.')],
      ['zehra', tr('Dördü de doğru. Belirtiler tek başına yanıltır: kansızlığı üç ayrı eksiklik yapar, kanamayı iki. Beslenmeyi sormadan tanı konmaz.', 'All four right. One sign alone can fool you: three different deficiencies cause anaemia, two cause bleeding. You can’t diagnose without asking about the diet.')],
    ]);
    await ask('eksik_iron_tea');
    await ask('eksik_more_better');
    await ask('eksik_sun');
    await UI.talk([
      ['zehra', tr('Gülsüm Teyze’ye de iyotlu tuz verdim. Türkiye’de 1999’dan beri sofra tuzuna iyot katılması zorunlu; ondan önce Karadeniz ve Doğu’nun dağ köylerinde guatr çok yaygındı.', 'I gave Gülsüm Teyze iodised salt as well. Since 1999 Türkiye has required iodine in table salt; before that, goitre was very common in the mountain villages of the Black Sea and the East.')],
      ['zehra', tr('İyot toprakta az, denizde çok. Dağda yaşayıp deniz ürünü yemeyen biri iyotu tuzdan almak zorunda. Bir tutam tuz, bir boyun şişliğini önler.', 'There’s little iodine in the soil and a lot in the sea. Someone who lives in the mountains and eats no seafood has to get it from salt. A pinch of salt prevents a swollen neck.')],
    ]);
    G.S.flags.eksikTold = true;
    this.adv('eksik');
  },
  async _yogurt() {
    await UI.talk([
      ['songul', tr('Söyle bakalım, benim yoğurduma ne oldu?', 'Go on then, what happened to my yogurt?')],
      ['player', tr('Mayayı süt kaynar kaynamaz mı koydun? 70 °C’de maya bakterileri ölüyor. 43 °C dolayında en hızlı çalışıyorlar.', 'Did you add the starter as soon as the milk boiled? At 70 °C the starter bacteria die. They work fastest around 43 °C.')],
      ['songul', tr('Aman! Bu hafta acelem vardı, sütü soğutmadan mayaladım. Eskiden serçe parmağımla yoklardım.', 'Oh no! I was in a hurry this week and added the starter before the milk cooled. I used to test it with my little finger.')],
      ['player', tr('Parmağını ona kadar sayarak tutabiliyorsan doğru sıcaklık. Sonra tencereyi sar, 4-6 saat kıpırdatma. Buzdolabı ise yoğurdu durdurur, ekşimesin diye.', 'If you can hold your finger in while you count to ten, it’s the right temperature. Then wrap the pot and leave it for 4 to 6 hours. The fridge stops the yogurt, so it doesn’t go too sour.')],
      ['songul', tr('Yarın sabah sana bir kâse ayırıyorum. Bak, o bakteriler bizim mutfağın işçileri: turşu, boza, ekşi maya ekmeği… hepsi onların işi.', 'I’m keeping you a bowl tomorrow morning. Those bacteria are the workers in our kitchen: pickles, boza, sourdough… all their doing.')],
    ]);
    G.S.flags.yogurtTold = true;
    this.adv('yogurt');
  },
  async _sera() {
    await UI.talk([
      ['deniz', tr('Eee? Görünmeyen gaz ısıttı mı?', 'Well? Did the invisible gas warm anything?')],
      ['player', tr('Isıttı. Aynı lambanın altında CO₂’li kavanoz, havalı olandan birkaç derece daha ısındı. Lamba kapalıyken ikisi de ısınmadı.', 'It did. Under the same lamp the CO₂ jar got a few degrees warmer than the air jar. With the lamp off, neither warmed.')],
      ['deniz', tr('Bitkili kavanoz ne oldu?', 'What about the jar with the plant?')],
      ['player', tr('Işıkta bitki CO₂’yi çekti, BTB maviye döndü. Karanlıkta CO₂ verdi, BTB sarardı.', 'In the light the plant drew the CO₂ down and the BTB turned blue. In the dark it gave CO₂ out and the BTB went yellow.')],
    ]);
    await UI.talk([
      ['deniz', tr('Yani öğretmen haklıymış. Ben de kavanozu okula götürüp sınıfa göstereceğim!', 'So the teacher was right. I’m taking the jars to school to show the class!')],
    ]);
    G.S.flags.seraTold = true;
    this.adv('sera');
  },
  async _hediye() {
    await UI.talk([
      ['nazli', tr('Ne dersin evladım, kardeşim bana hileli yağ mı yollamış?', 'What do you say, child, has my sister sent me fake oil?')],
      ['player', tr('Hayır. Kâğıtta kalıcı leke bıraktı, Sudan boyasıyla kırmızı oldu: yağ. Soğukta bulanıklaştı ama donmadı; ayçiçek yağı ise berrak kaldı.', 'No. It left a lasting spot on paper and went red with Sudan dye: it’s fat. In the cold it clouded but didn’t set; sunflower oil stayed clear.')],
    ]);
    await UI.talk([
      ['nazli', tr('Oh, içim rahatladı! O satıcıya da söyleyeceğim. Al şu küçük şişeyi, Nebahat’e götür; ekmeğini banınca beni anarsın.', 'Oh, what a relief! I’ll tell that trader too. Take this little bottle to Nebahat; think of me when you dip your bread in it.')],
    ]);
    G.S.flags.hediyeTold = true;
    this.adv('hediye');
  },
  async _azot() {
    await UI.talk([
      ['osman', tr('Söyle evlat, gübreyi alayım mı?', 'Tell me, child, should I buy the fertiliser?')],
      ['player', tr('Nohudun köklerinde pembe nodüller var. İçlerindeki Rhizobium bakterileri havadaki azotu amonyuma çeviriyor. Yeşil şeridin sırrı bu.', 'The chickpea roots have pink nodules. The Rhizobium bacteria inside turn nitrogen from the air into ammonium. That’s the secret of the green strip.')],
    ]);
    await UI.talk([
      ['osman', tr('Babam haklıymış… “Toprağı dinlendiriyoruz” derdi. Bu yıl sarı yere nohut, gelecek yıl buğday. Gübreciye de az alacağımı söylerim.', 'My father was right… “We’re resting the soil,” he used to say. This year chickpeas on the yellow part, wheat next year. And I’ll tell the fertiliser man I only need a little.')],
    ]);
    G.S.flags.azotTold = true;
    this.adv('azot');
  },
  async _ekim() {
    await UI.talk([
      ['fatma', tr('Eee, defterimi doldurdun mu? Yeğenim hâlâ “mayısta ekelim” diyor.', 'Well, did you fill in my notebook? My nephew still says “let’s sow in May”.')],
      ['player', tr('Mayıs yalnız domatese uyuyor; ayaz geçmiş, yaz uzun. Nohut martta, ıspanak ekimde ya da martta; mayısta sapa kalkıyor.', 'May only suits the tomato: the frost is over and the summer is long. Chickpeas in March, spinach in October or March; in May it bolts.')],
      ['player', tr('Buğday ise ekimde. Kışı görmeyen buğday başak vermiyor.', 'And wheat in October. Wheat that never sees winter makes no ears.')],
    ]);
    await UI.talk([
      ['fatma', tr('Rahmetli de öyle derdi: “Buğdayın kış uykusu.” Takvimi yeğenime göstereceğim; bir de senin adını yazayım altına.', 'My late husband said the same: “the wheat’s winter sleep.” I’ll show my nephew the calendar, and put your name under it.')],
    ]);
    G.S.flags.ekimTold = true;
    this.adv('ekim');
  },
  async _etilen() {
    await UI.talk([
      ['huseyin', tr('Söyle bakalım, güneş mi, buzdolabı mı?', 'Go on then, sun or fridge?')],
      ['player', tr('İkisi de değil. Buzdolabında yeşil kaldılar ve lekelendiler. 30 °C’de turuncu kaldılar. Oda sıcaklığında, karanlık torbada kızarıyorlar.', 'Neither. In the fridge they stayed green and got pitted. At 30 °C they stayed orange. At room temperature, in a dark bag, they go red.')],
      ['player', tr('Songül Abla da haklı: torbaya olgun bir elma koyunca günler önce kızardılar. Elma etilen gazı salıyor.', 'And Songül is right: with a ripe apple in the bag they reddened days earlier. The apple gives off ethylene gas.')],
    ]);
    await UI.talk([
      ['huseyin', tr('Bir elma, bir kâğıt torba… Kırk yıl bahçıvanlık yaptım, bunu bilmiyordum. Al şu kavanozu, domates reçeli; kışın beni anarsın.', 'An apple and a paper bag… Forty years a gardener and I never knew. Take this jar of tomato jam; think of me in winter.')],
    ]);
    G.S.flags.etilenTold = true;
    this.adv('etilen');
  },
  async _sindirim() {
    await UI.talk([
      ['zehra', tr('Haritayı getirdin mi? Çocuklar yarın “midede erir” diyecek, biliyorum.', 'Did you bring the map? The children will say “it melts in the stomach” tomorrow, I know it.')],
      ['player', tr('Getirdim. Ekmek ağızda başlıyor, midede duruyor. Yumurta akı midede başlıyor. Tereyağı ince bağırsağa kadar hiç değişmiyor.', 'I did. Bread starts in the mouth and stops in the stomach. Egg white starts in the stomach. Butter doesn’t change at all until the small intestine.')],
      ['player', tr('Hepsi ince bağırsakta bitiyor ve villuslardan kana geçiyor. Marulu ise hiç sindiremiyoruz; lif olarak kalın bağırsağa gidiyor.', 'Everything finishes in the small intestine and passes into the blood through the villi. We can’t digest the lettuce at all; it goes on to the large intestine as fibre.')],
    ]);
    await UI.talk([
      ['zehra', tr('Harika. Tüpleri de getireceğim; çocuklara ekmeği uzun uzun çiğnetip tatlandığını fark ettireceğim. En iyi ders kendi ağızlarında!', 'Wonderful. I’ll bring the tubes too, and have the children chew bread for a long time until they notice it turning sweet. The best lesson is in their own mouths!')],
    ]);
    G.S.flags.sindirimTold = true;
    this.adv('sindirim');
  },
  async _kilcal() {
    await UI.talk([
      ['elif', tr('Eee? Su yukarı çıkıyor mu?', 'Well? Does water go up?')],
      ['player', tr('Çıkıyor! Su cama ve bitki liflerine tutunuyor, kendi moleküllerini de peşinden çekiyor. Boru ne kadar inceyse o kadar yükseğe.', 'It does! Water clings to glass and plant fibres, and pulls its own molecules along behind it. The thinner the tube, the higher it goes.')],
      ['player', tr('Kereviz bir saatte maviye boyandı. Yosunların ıslak olması da bu yüzden: aralarındaki ince boşluklar suyu yukarı çekiyor.', 'The celery turned blue in an hour. That’s also why the moss is wet: the tiny gaps between its strands pull the water up.')],
    ]);
    await UI.talk([
      ['elif', tr('Ağaçlar da pipetle içiyor yani, ama pipetleri saç telinden ince! İzmir’e dönünce sınıfa kereviz götüreceğim.', 'So trees drink through straws, but straws thinner than a hair! When I’m back in İzmir I’m taking celery to class.')],
    ]);
    G.S.flags.kilcalTold = true;
    this.adv('kilcal');
  },
  async _kul() {
    await UI.talk([
      ['deniz', tr('Eee? Yanmayan şey varmış mı?', 'Well? Is there such a thing as something that doesn’t burn?')],
      ['player', tr('Varmış: kül. Su buhar oluyor, karbonhidrat, yağ ve protein yanıp gidiyor. Kalan kül mineral tuzları. Kemikten 60 gram kaldı!', 'There is: ash. The water turns to steam and the carbohydrate, fat and protein burn away. The ash that’s left is mineral salt. Bone left 60 grams!')],
      ['player', tr('Enerji vermiyorlar ama her organelde iş görüyorlar: demir mitokondride, magnezyum kloroplastta, fosfat DNA’da, kalsiyum kasta, sodyum-potasyum zardaki pompada.', 'They give no energy, but they work in every organelle: iron in the mitochondrion, magnesium in the chloroplast, phosphate in DNA, calcium in muscle, sodium-potassium in the membrane pump.')],
    ]);
    await UI.talk([
      ['deniz', tr('Yani ben %4 külüm! Bunu sınıfa söyleyince herkes şaşıracak. Öğretmen yine haklı çıktı ama bu sefer kendim buldum.', 'So I’m 4% ash! Everyone in class will be amazed. The teacher was right again, but this time I found it out myself.')],
    ]);
    G.S.flags.kulTold = true;
    this.adv('kul');
  },
  async _zar() {
    await UI.talk([
      ['songul', tr('Söyle bakalım, pancarım neden kanıyor?', 'Go on then, why does my beetroot bleed?')],
      ['player', tr('Kırmızı boya hücrelerin kofulunda, yağdan yapılmış ince zarların ardında. Isı, alkol ya da deterjan o zarları bozunca boya sızıyor.', 'The red dye is in the cells’ vacuoles, behind thin membranes made of fat. When heat, alcohol or detergent damages those membranes, the dye leaks out.')],
      ['player', tr('Tuzlu suda zar sağlam kaldı: su çıktı, boya çıkamadı. Turşu suyunun pembeleşmesi, sirkenin zarı yavaş yavaş bozmasından.', 'In salt water the membrane held: water came out, the dye couldn’t. The brine turns pink because the vinegar slowly damages the membranes.')],
    ]);
    await UI.talk([
      ['songul', tr('O zaman pancarı kabuğuyla, bütün haşlayayım; rengi içinde kalsın. Turşu için de sirkeyi en son koyarım!', 'Then I’ll boil the beetroot whole, in its skin, so the colour stays in. And I’ll add the vinegar last for the pickle!')],
    ]);
    G.S.flags.zarTold = true;
    this.adv('zar');
  },
  // the two grandpas at the teahouse argue about the spring, and the student settles it with the transect
  async _elders() {
    await UI.talk([
      ['elder1', tr('Geldin mi? Şu Mehmet’e söyle: o pınar zehirlendi! Sarı, turuncu, yeşil… Kokusu da cabası.', 'There you are! Tell Mehmet here: that spring has been poisoned! Yellow, orange, green… and the smell on top of it.')],
      ['elder2', tr('Zehir ne gezer! Babam romatizmasını o suyla geçirirdi. Şifalıdır o.', 'Poison, my foot! My father cured his rheumatism with that water. It heals.')],
    ]);
    await ask('spring_report');
    await UI.talk([
      ['elder2', tr('Gördün mü Hasan? Zehir değil, canlı!', 'See, Hasan? It’s not poison, it’s alive!')],
      ['elder1', tr('Sen “şifalı” dedin, “canlı” demedin. … Peki peki, çamaşır suyunu dökmüyoruz. Ama yine de kokuyor!', 'You said “it heals”, not “it’s alive”. … All right, all right, no bleach. But it still stinks!')],
      ['player', tr('Şifalı mı, bilmem: onu ölçmedim. Ama koku H₂S’den; o gaz da kaynaktaki bakterilerin yemeği!', 'Whether it heals, I can’t say: I didn’t measure that. But the smell is H₂S, and that gas is dinner for the bacteria at the vent!')],
    ]);
    this.adv('spring');
  },
  // Ayten gives Sarıkız a magnet: the question first, then everyone is at the paddock
  async _magnet() {
    const S = G.S, c = actor('sarikiz'), a = actor('ayten'), p = W.player;
    await ask('hardware_why');
    await UI.say('ayten', tr('Ameliyat yerine ona bir mıknatıs yutturacağım. Hadi, Sarıkız’a gidelim.', 'Instead of an operation, I’ll give her a magnet to swallow. Come on, let’s go to Sarıkız.'));
    G.busy = true; p.route = null;
    await UI.fade(() => {
      c.state = null; c.tx = c.x; c.ty = c.y; c.idle = 20;
      [a.x, a.y] = W.freeSpot(c.x + 70, c.y + 16); a.dir = 'left'; a.face = -1; a.hidden = false;
      [p.x, p.y] = W.freeSpot(c.x + 20, c.y + 60); CAM.x = p.x; CAM.y = p.y;
    });
    await UI.talk([
      ['narrator', tr('Ayten, parmak büyüklüğündeki mıknatısı uzun bir yutturma aletiyle Sarıkız’ın dilinin gerisine bırakır.', 'Ayten places the finger-sized magnet at the back of Sarıkız’s tongue with a long applicator.')],
    ]);
    AU.sfx('gulp');
    S.flags.magnetIn = true;
    await UI.talk([
      ['ayten', tr('Ağır olduğu için doğruca börkeneğin dibine çökecek ve çiviyi üstünde tutacak. Delik küçük; birkaç günlük ilaçla iyileşir.', 'Being heavy, it’ll sink straight to the floor of the reticulum and hold the nail on itself. The hole is small; a few days of medicine and she’ll heal.')],
      ['ayten', tr('Mıknatıs ömür boyu orada kalır. İnanmazsan merceğinle bak!', 'The magnet stays there for life. Look with your lens if you don’t believe me!')],
    ]);
    G.busy = false;
    ACT.walkTo(a, 2740, 2790, () => { a.state = null; });
    this.adv('hardware');
  },
  // Veterinarian Ayten treats Sarıkız once you have led her to the grass paddock
  async _ayten() {
    const S = G.S, c = actor('sarikiz'), a = actor('ayten'), p = W.player;
    c.state = null; c.lead = false; c.home = [2900, 2250, 340, 290]; c.tx = c.x; c.ty = c.y; c.idle = 20;
    S.flags.cowMoved = true;
    G.busy = true; p.route = null;
    a.x = 3380; a.y = 2560; a.hidden = false;
    await new Promise(r => ACT.walkTo(a, c.x + 70, c.y + 16, r));
    a.dir = 'left'; a.face = -1;
    await UI.talk([
      ['ayten', tr('Geldim, geldim! Rıza Dede aradı. Hmm… Sol böğür gergin. Vurunca davul gibi ses veriyor.', "I'm here! Rıza Dede called. Hmm… the left flank is tight. It sounds like a drum when you tap it.")],
      ['ayten', tr('Köpüklü şişkinlik. Sonda takarsak köpük geçmez; önce köpük kırıcı bir yağ içireceğim.', "Frothy bloat. A stomach tube alone won't get the foam out, so first I'll give her an oil that breaks the foam.")],
      ['narrator', tr('Ayten, Sarıkız’a bir şişe bitkisel yağ içirir ve onu ağılda yavaşça yürütür.', 'Ayten gives Sarıkız a bottle of vegetable oil and walks her slowly around the paddock.')],
    ]);
    S.flags.cowTreated = true;
    AU.sfx('moo', { v: 1 });
    await U.sleep(1800);
    await UI.talk([
      ['ayten', tr('İşte! Köpük kırıldı, kabarcıklar birleşti. Artık geğirebiliyor.', "There! The foam has broken and the bubbles have merged. Now she can burp.")],
      ['ayten', tr('Bu gece gözünüz üstünde olsun. Bir daha olmasın diye Rıza Dede’yle bir yonca planı yapın.', 'Keep an eye on her tonight. And make a clover plan with Rıza Dede so this doesn’t happen again.')],
    ]);
    G.busy = false;
    ACT.walkTo(a, 2740, 2790, () => { a.state = null; });
    this.adv('bloat');
  },
};

// ================================================================ dialogue
const TALK = {
  _i: {},
  _rot(k, lines) { const i = this._i[k] = ((this._i[k] ?? -1) + 1) % lines.length; return lines[i]; },

  async deniz() {
    const S = G.S;
    if (Q.at('festival', 'quiz')) { await USE.stage(); return; }
    if (Q.at('festival', 'nine') || Q.at('festival', 'swap')) { await UI.say('deniz', Q.at('festival', 'nine') ? tr('Önce Nebahat Nine’ye merhaba de! Sonra yarışma başlıyor.', 'Say hello to Grandma Nebahat first! Then the quiz starts.') : tr('Harikaydın! Şimdi takas masasına git; herkes senin tohumlarını bekliyor.', 'You were great! Now go to the swap table; everyone is waiting for your seeds.')); return; }
    if (Q.at('kul', 'deniz')) {
      await UI.talk([
        ['deniz', tr('Öğretmen yine bir şey dedi: “Vücudunun yaklaşık %4’ü, yakınca geriye kalan tuzlardır.” Yanmayan şey mi olur?', 'The teacher said something else: “About 4% of your body is the salt left when you burn it.” Is there such a thing as something that doesn’t burn?')],
        ['deniz', tr('Nazlı Teyze fırında dört şey yaktı bizim için: ıspanak, süt, ciğer ve kemik. Külleri masada, damla şişeleri de yanında.', 'Nazlı Teyze burnt four things in her oven for us: spinach, milk, liver and bone. The ashes are on the table, with the dropper bottles.')],
        ['deniz', tr('Önce tartalım, sonra külün içinde ne var bakalım!', 'Let’s weigh them first, then see what’s in the ash!')],
      ]);
      Q.adv('kul'); return;
    }
    if (Q.at('kul', 'test')) { await UI.say('deniz', tr('Küller masada! Her külü dört testle dene.', 'The ashes are on the table! Try every ash with all four tests.')); return; }
    if (Q.at('kul', 'tell')) { await Q._kul(); return; }
    if (Q.at('sera', 'deniz')) {
      await UI.talk([
        ['deniz', tr('Öğretmen “Karbondioksit Dünya’yı ısıtıyor” dedi. Ama görünmeyen bir gaz nasıl ısıtır? Bence uyduruyorlar.', 'The teacher said “Carbon dioxide is warming the Earth.” But how can an invisible gas warm anything? I think they’re making it up.')],
        ['player', tr('Deneyelim o zaman. Serada kavanozlar, bir lamba, sirke ve karbonat var. Sirke ile karbonat CO₂ yapar.', 'Let’s test it, then. The greenhouse has jars, a lamp, vinegar and baking soda. Vinegar and baking soda make CO₂.')],
        ['deniz', tr('Bir de havuzdan su bitkisi aldım. Suya BTB damlattım: CO₂ artınca sararıyor, azalınca maviye dönüyor.', 'I’ve brought some pondweed from the pond too. I put BTB in the water: it goes yellow when CO₂ rises and blue when it falls.')],
      ]);
      Q.adv('sera'); return;
    }
    if (Q.at('sera', 'jars')) { await UI.say('deniz', tr('Kavanozlar serada! Adil olsun: tek bir şeyi değiştir.', 'The jars are in the greenhouse! Keep it fair: change one thing only.')); return; }
    if (Q.at('sera', 'tell')) { await Q._sera(); return; }
    if (Q.at('intro', 'letter') || Q.at('intro', 'lens')) {
      await UI.say('deniz', Q.at('intro', 'letter') ? tr('Merhaba! Sen Nebahat Nine’nin torunusun, değil mi? Nine masasına sana bir mektup bıraktı. Önce onu oku!', "Hi! You're Grandma Nebahat's grandchild, right? She left you a letter on her desk. Read it first!") : tr('O mercek! Bir şeye tut da görelim. Mercek düğmesine bas, sonra bir canlıya dokun.', "That lens! Point it at something and let's see. Press the lens button, then tap something alive."));
      return;
    }
    if (Q.at('intro', 'deniz')) {
      await UI.talk([
        ['deniz', tr('Ben Alp, komşunuz. Nine gitmeden “Torunum gelince ona yardım et” dedi.', "I'm Alp, from next door. Before she left, Grandma said: 'Help my grandchild when they arrive.'")],
        ['deniz', tr('Çabuk gel: Rıza Dede seni arıyor! Sarıkız’ın karnı davul gibi şişmiş, Rıza Dede çok korkuyor.', "Come quick: Rıza Dede is looking for you! Sarıkız's belly is swollen like a drum, and he's really scared.")],
        ['deniz', tr('Ahır köprünün öbür yanında, doğuda. Pusulan sana yolu gösterir.', 'The barn is across the bridge, to the east. Your compass will show you the way.')],
      ]);
      W.waypoint = G.S.waypoint = { x: 3380, y: 2250 };
      Q.adv('intro');
      Q.open('bloat');
      return;
    }
    if (Q.at('bloat', 'deniz4')) {
      await UI.say('deniz', tr('Sarıkız iyileşti mi? Oh be! Bir şey soracağım…', 'Is Sarıkız better? Phew! I want to ask you something…'));
      await ask('four_stomachs');
      await UI.say('deniz', tr('Tek mide, dört oda… Ev gibi! Peki Karabaş da öyle mi? Ona da bak!', "One stomach, four rooms… like a house! So is Karabaş the same? Check him too!"));
      Q.adv('bloat');
      return;
    }
    if (Q.at('azik', 'deniz')) {
      await UI.talk([
        ['deniz', tr('Yarın sınıfça yaylaya yürüyoruz! Dört saat yokuş. Azığıma bak: kocaman bir paket lokum!', 'Tomorrow our class is walking up to the yayla! Four hours uphill. Look at my trail food: a huge packet of lokum!')],
        ['deniz', tr('Şeker en iyi enerji, değil mi? Hasan Dede “dağa cevizsiz çıkılmaz” diyor, ama ceviz yağ dolu. Yağ kötü değil mi?', 'Sugar is the best energy, right? Grandpa Hasan says “you don’t go up a mountain without walnuts”, but walnuts are full of fat. Isn’t fat bad?')],
        ['player', tr('Tartışmak yerine ölçelim. Ceviz ağacının altında Nine’nin eski kalorimetresi duruyor: yiyeceği yakıp suyu ne kadar ısıttığına bakacağız.', 'Instead of arguing, let’s measure. Grandma’s old calorimeter is under the walnut tree: we’ll burn each food and see how much it warms the water.')],
        ['deniz', tr('Ben de leblebi, ekmek ve kuru kayısı getireyim, hepsini deneyelim!', 'I’ll bring leblebi, bread and dried apricot too, let’s test them all!')],
      ]);
      Q.adv('azik');
      return;
    }
    if (Q.at('azik', 'burn')) { await UI.say('deniz', tr('Kalorimetre ceviz ağacının altında. Rüzgâr çıkınca alevi kutunun altında tutmak zor, dikkat!', 'The calorimeter is under the walnut tree. When the wind picks up it’s hard to keep the flame under the can, careful!')); return; }
    if (Q.at('azik', 'look')) { await UI.say('deniz', tr('Merceğinle yiyeceklere mi bakıyorsun? Enerji nerede saklanıyor, görünüyor mu?', 'Looking at the food with your lens? Can you see where the energy is kept?')); return; }
    if (Q.at('azik', 'tell')) { await Q._azik(); return; }
    if (Q.at('willow', 'present')) {
      const ok = ['willow_stoma', 'co2_in', 'stoma'].some(k => S.journal.obs[k]);
      await UI.say('deniz', tr('Ne? Koca ağaç havadan mı yapılmış? Kanıtla bakalım!', 'What? That huge tree is made of air? Prove it!'));
      if (!ok) { await UI.say('player', tr('Önce söğüdün yaprağına merceğimle bakmalıyım.', 'First I should look at a willow leaf through my lens.')); return; }
      const id = await UI.present(tr('Söğüdün havadan karbon aldığını gösteren gözlem hangisi?', 'Which observation shows the willow taking carbon from the air?'), k => ['willow_stoma', 'co2_in', 'stoma'].includes(k));
      if (!id) return;
      await UI.talk([
        ['deniz', tr('Yaprakta minicik ağızlar var ve CO₂ oradan giriyor… Yani ağaç havayı yiyor!', "There are tiny mouths on the leaf and CO₂ goes in there… so the tree eats air!")],
        ['player', tr('Havayı yemiyor ama havadaki karbonu tutuyor. Işığın enerjisiyle onu şekere, şekeri de oduna çeviriyor.', "It doesn't eat air, but it captures the carbon in it. With energy from light it turns that into sugar, and the sugar into wood.")],
        ['deniz', tr('Bunu sınıfta anlatırsam kimse inanmaz!', 'If I tell this in class, nobody will believe me!')],
      ]);
      Q.adv('willow');
      return;
    }
    await UI.say('deniz', this._rot('deniz', [
      tr('Biliyor musun, leylekler her bahar Afrika’dan aynı yuvaya döner. Bizimkiler okulun damında!', 'Did you know storks come back from Africa to the same nest every spring? Ours live on the school roof!'),
      tr('Gölette eskiden kurbağa çok olurmuş. Ben hiç duymadım.', "There used to be lots of frogs in the pond. I've never heard them."),
      tr('Merceğinle Karabaş’a baktın mı? Bence midesinde kemik vardır.', "Have you looked at Karabaş with your lens? I bet there's a bone in his stomach."),
      tr('Harita için M tuşu. Bir yere tıklarsan pusula oraya döner.', 'Press M for the map. Click a place and your compass will point there.'),
      tr('Nine hep “bilmiyorum demek ayıp değil, merak etmemek ayıp” der.', "Grandma always says: 'It's no shame to say I don't know. The shame is not being curious.'"),
    ]));
  },

  async riza() {
    const S = G.S;
    if (Q.at('hardware', 'riza')) {
      await UI.talk([
        ['riza', tr('Evladım, iyi ki geldin! Sarıkız iki gündür yemiyor, sütü de kesildi.', 'Child, thank goodness you’re here! Sarıkız hasn’t eaten for two days, and her milk has stopped.')],
        ['riza', tr('Bu sefer karnı şiş değil. Ama sırtını kambur tutuyor, yokuş aşağı yürümek istemiyor, yatıp kalkarken inliyor.', 'Her belly isn’t swollen this time. But she keeps her back arched, won’t walk downhill and groans when she lies down or gets up.')],
        ['riza', tr('Geçen hafta ahırın eski tel çitini söktüm, balyaları da oraya yığmıştım… Nebahat’in merceğiyle bir bak, ne olur.', 'Last week I took down the barn’s old wire fence, and I’d stacked the bales right there… Take a look with Nebahat’s lens, please.')],
      ]);
      Q.adv('hardware');
      return;
    }
    if (Q.at('hardware', 'look')) { await UI.say('riza', tr('Merceği Sarıkız’a tut. Nebahat ineğin midesinde dört oda var derdi; en öndekine iyi bak.', 'Hold the lens over Sarıkız. Nebahat used to say a cow’s stomach has four rooms; look hard at the front one.')); return; }
    if (Q.at('hardware', 'ayten') || Q.at('hardware', 'scan') || Q.at('hardware', 'treat')) { await UI.say('riza', tr('Ayten Hanım ne dedi? Ben Sarıkız’ın başından ayrılmıyorum.', 'What did Ayten say? I’m not leaving Sarıkız’s side.')); return; }
    if (Q.at('hardware', 'check')) { await UI.say('riza', tr('Mıknatısı yuttu, gördüm! Merceğinle bak bakalım, yerine oturmuş mu?', 'She swallowed the magnet, I saw it! Look with your lens: has it settled in place?')); return; }
    if (Q.at('hardware', 'prevent')) {
      await ask('hardware_prevent');
      await UI.talk([
        ['riza', tr('Eski teli ahırdan toplayacağım, yemi de mıknatıstan geçireceğim. Buzağılara da Ayten Hanım’a mıknatıs yutturturuz.', 'I’ll clear the old wire out of the barn and run the feed past a magnet. And we’ll have Ayten give the calves a magnet too.')],
        ['riza', tr('Al, bu da fiğ tohumu. Temiz yem temiz tarladan çıkar. Nebahat’e selam söyle.', 'Here, some vetch seed. Clean feed comes from a clean field. Give Nebahat my regards.')],
      ]);
      Q.adv('hardware');
      return;
    }
    if (Q.at('owl', 'riza')) {
      await UI.talk([
        ['riza', tr('Evladım, şu ambara bak! Fareler çuvalları delmiş, tahılın yarısı gitti.', 'Child, look at this grain store! The mice have chewed through the sacks and half the grain is gone.')],
        ['riza', tr('Kasabadan fare zehri aldım, yarın her köşeye koyacağım. Bir de damdaki şu baykuş var… Eskiler uğursuzdur der; gitse iyi olur.', 'I’ve bought rat poison in town and I’ll put it in every corner tomorrow. And then there’s that owl on the roof… The old folk say it brings bad luck; better if it went.')],
        ['player', tr('Samanlık kapısında uyuyan o beyaz yüzlü kuş mu? Zehri koymadan önce bir bakayım. Önce merceğimle baykuşa.', 'The white-faced bird asleep in the hay-loft door? Let me look before the poison goes down. First the owl, with my lens.')],
        ['riza', tr('Samanlığın altında gri topaklar da var; her sabah yenisi düşüyor. Ne olduklarını bilmem. Masaya koydum.', 'There are grey lumps under the hay loft too; a new one drops every morning. I don’t know what they are. I put them on the table.')],
      ]);
      Q.adv('owl');
      return;
    }
    if (Q.at('owl', 'look')) { await UI.say('riza', tr('Baykuşa mı bakıyorsun? Gündüz uyur o; gece ötüp durur.', 'Looking at the owl? It sleeps all day; at night it keeps on screeching.')); return; }
    if (Q.at('owl', 'pellets')) { await UI.say('riza', tr('O gri topaklar masada. İçinden ne çıkacak, merak ediyorum.', 'Those grey lumps are on the table. I wonder what’s inside them.')); return; }
    if (Q.at('owl', 'tell')) { await Q._owl(); return; }
    if (Q.at('bloat', 'riza')) {
      await UI.talk([
        ['riza', tr('Geldin mi evladım! Nebahat’in torunu… Bak şu hayvanın hâline.', "You're here, child! Nebahat's grandchild… Look at the poor animal.")],
        ['riza', tr('Dün gece yağmurdan sonra Sarıkız’ı yoncalığa saldım. Sabah bir baktım, sol böğrü davul gibi. Yemiyor, geğirmiyor.', "Last night, after the rain, I let Sarıkız onto the clover. This morning her left flank was like a drum. She won't eat, won't burp.")],
        ['riza', tr('Nebahat’in o merceğiyle bir içine bak. Ne görürsen söyle, veterinere öyle anlatalım.', "Look inside her with Nebahat's lens. Tell me what you see and we'll tell the vet.")],
      ]);
      Q.adv('bloat');
      return;
    }
    if (Q.at('bloat', 'look')) { await UI.say('riza', tr('Merceği Sarıkız’ın üstüne tut ve incele. Bir kat daha derine inersen işkembenin içi görünürmüş.', "Hold the lens over Sarıkız and examine her. Nebahat said you can see inside the rumen if you go one layer deeper.")); return; }
    if (Q.at('bloat', 'diagnose')) {
      await ask('bloat_dx');
      await UI.talk([
        ['riza', tr('Köpük… Babam da “yonca şişirir” derdi. Veteriner Ayten’i hemen arıyorum.', "Foam… my father always said 'clover blows them up'. I'm calling Ayten the vet right now.")],
        ['riza', tr('Sen Sarıkız’ı yoncalıktan çıkar, batıdaki çayır ağılına götür. Yürümek de iyi gelir. Onunla konuşursan peşinden gelir.', "You lead Sarıkız out of the clover and take her to the grass paddock to the west. Walking helps too. Talk to her and she'll follow you.")],
      ]);
      Q.adv('bloat');
      return;
    }
    if (Q.at('bloat', 'lead')) { await UI.say('riza', tr('Sarıkız’la konuş, seni takip eder. Çayır ağılı ahırın batısında.', "Talk to Sarıkız and she'll follow you. The grass paddock is west of the barn.")); return; }
    if (Q.at('bloat', 'plan')) {
      await UI.say('riza', tr('Allah razı olsun evladım. Ama yoncamı da bırakamam: hayvan onu çok sever, toprağa da iyi gelir.', "Bless you, child. But I can't give up my clover: the animals love it, and it's good for the soil."));
      await ask('bloat_plan');
      await UI.talk([
        ['riza', tr('Önce saman, sonra yonca; azar azar… Tamam, öyle yapacağım.', 'Hay first, then clover, a little at a time… All right, that’s what I’ll do.')],
        ['riza', tr('Bu da benden: yoncalığın tohumu. Bir de şunu söyleyeyim: B tarlasındaki siyez sararıyor. Kuraklık diyorlar ama bu bahar yağmur boldu…', "Here's something from me: clover seed. And one more thing: the siyez in field B is turning yellow. People say drought, but it rained plenty this spring…")],
      ]);
      give('clover');
      Q.adv('bloat');
      Q.open('leaves');
      return;
    }
    if (Q.at('bloat', 'compare')) {
      await ask('dog_compare');
      await UI.talk([
        ['riza', tr('Demek Sarıkız’ın içinde bir köy dolusu mikrop çalışıyor. Ben de onu otla doyuruyorum sanıyordum!', "So Sarıkız has a whole village of microbes working inside her. And I thought I was the one feeding her grass!")],
        ['riza', tr('Nebahat o mercekle işkembenin içine “dalardı”. Merak ediyorsan sen de dal bakalım.', "Nebahat used to 'dive' into the rumen with that lens. If you're curious, dive in yourself.")],
      ]);
      Q.adv('bloat');
      return;
    }
    await UI.say('riza', this._rot('riza', [
      tr('Sarıkız on iki yaşında. Sütü az ama huyu altın.', "Sarıkız is twelve. Not much milk, but a heart of gold."),
      tr('Toprağa ne verirsen onu alırsın, evladım.', 'You reap what you give the soil, child.'),
      tr('Koyunlar da geviş getirir. Merceğinle bak, onların da işkembesi var.', "The sheep chew the cud too. Look with your lens: they've got a rumen as well."),
      tr('Eskiden her köyün tohumu kendineydi. Şimdi herkes aynı torbadan alıyor.', 'Every village used to have its own seed. Now everyone buys from the same sack.'),
    ]));
  },

  async nebahat() {
    const S = G.S;
    if (Q.at('festival', 'letter') || Q.at('festival', 'nine')) {
      await UI.talk([
        ['nebahat', tr('Gel buraya, torunum! Dizim iyileşti; şenliği kaçırır mıyım hiç?', 'Come here, my dear! My knee has healed; how could I miss the festival?')],
        ['nebahat', tr('Rıza anlattı, Nazlı anlattı, Ayten anlattı… Vadide ne solduysa merceğinle içine bakmış, sebebini bulmuşsun.', 'Rıza told me, Nazlı told me, Ayten told me… Whatever faded in the valley, you looked inside it with the lens and found the cause.')],
        ['nebahat', tr('Ben de senin yaşındayken babamın merceğiyle ilk kez bir soğan zarına bakmıştım. O gün bu gündür merak ederim.', 'When I was your age I looked at an onion skin through my father’s lens for the first time. I’ve been curious ever since.')],
        ['nebahat', tr('Hadi, sahneye! Alp köyün yarışmasını sunacak; sorular senin defterinden.', 'Go on, to the stage! Alp is hosting the village quiz, and the questions come from your journal.')],
      ]);
      if (Q.at('festival', 'letter')) Q.adv('festival');
      Q.adv('festival'); Q._festWorld();
      return;
    }
    if (Q.at('festival', 'quiz')) { await UI.say('nebahat', tr('Sahnenin önünde Alp seni bekliyor. Yanlış yapmaktan korkma: yanlış da öğretir.', 'Alp is waiting for you in front of the stage. Don’t be afraid of getting it wrong: mistakes teach too.')); return; }
    if (Q.at('festival', 'swap')) { await UI.say('nebahat', tr('Takas masasına git. Tohum saklanarak değil, ekilip paylaşılarak yaşar.', 'Go to the swap table. Seed lives by being sown and shared, not by being hoarded.')); return; }
    await UI.say('nebahat', this._rot('nebahat', [
      tr('Bilmediğin bir şeye “bilmiyorum” demekten korkma: bilim oradan başlar.', 'Don’t be afraid to say “I don’t know”: that’s where science begins.'),
      tr('Her solgunluğun bir sebebi var, torunum. Sebepler canlıların içinde saklı.', 'Every fading has a cause, my dear. The causes are hidden inside living things.'),
      tr('Mercek artık senin. Neye tutarsan içini gösterir; ama bakmayı sen öğrendin.', 'The lens is yours now. It shows the inside of whatever you hold it over, but you are the one who learned to look.'),
      tr('Gelecek bahar yaylaya çıkarız, oranın çiçekleri başkadır.', 'Next spring we’ll go up to the highland pastures; the flowers there are something else.'),
    ]));
  },
  async ayten() {
    if (Q.at('leylek', 'ayten')) {
      await UI.talk([
        ['ayten', tr('İyi ki geldin! Şu kutuya bak: okulun damındaki yuvadan düşen leylek yavrusu. Bir deri bir kemik.', 'I’m glad you’re here! Look in this box: a stork chick that fell from the nest on the school roof. Skin and bone.')],
        ['ayten', tr('Düşmesi tesadüf değil. Yiyecek azalınca leylekler en zayıf yavruyu yuvadan atar bile. Anne babası bütün gün uçuyor ama gagaları boş dönüyor.', 'Its fall was no accident. When food runs short, storks will even throw the weakest chick out of the nest. Its parents fly all day but come back with empty beaks.')],
        ['player', tr('Ama çayır hemen okulun yanında. Çekirge, kurbağa…', 'But the meadow is right next to the school. Grasshoppers, frogs…')],
        ['ayten', tr('Öyle miydi? Kooperatif geçen hafta çekirge ve bit için okulun yanındaki çayırı ilaçlattı. Arılığın oradaki çayıra dokunmadılar.', 'Was it? Last week the cooperative sprayed the meadow by the school for grasshoppers and aphids. They left the meadow by the beehives alone.')],
        ['ayten', tr('Çayır yolunda böcek sayımı için bir böcek ağıyla tepsi bıraktım. İki çayırı karşılaştır, ama adil olsun: ikisinde de aynı sayıda süpürme. Sonra bana kim kimi yiyor, anlat.', 'I left a sweep net and a tray on the meadow road for counting insects. Compare the two meadows, but make it fair: the same number of sweeps in each. Then tell me who eats whom.')],
      ]);
      UI.toast(T('got_item', { i: L(tr('Böcek ağı', 'Sweep net')) }), '◎');
      W.waypoint = G.S.waypoint = { x: 2985, y: 1290 };
      Q.adv('leylek');
      return;
    }
    if (Q.at('leylek', 'tell')) { await Q._leylek(); return; }
    if (Q.at('hardware', 'riza') || Q.at('hardware', 'look')) { await UI.say('ayten', tr('Sarıkız yine mi hasta? Önce merceğinle bir bak; ne gördüğünü bana söyle.', 'Is Sarıkız ill again? Look at her with your lens first and tell me what you see.')); return; }
    if (Q.at('hardware', 'ayten')) {
      await UI.talk([
        ['player', tr('Sarıkız’ın börkeneğinde bir çivi gördüm! Ucu duvarı delmiş.', 'I saw a nail in Sarıkız’s reticulum! Its point has gone through the wall.')],
        ['ayten', tr('Çivi hastalığı! Adı travmatik retikuloperitonit. İnekler yemi dudaklarıyla ayıklamaz; otun içinde tel, çivi ne varsa yutar.', 'Hardware disease! Its proper name is traumatic reticuloperitonitis. Cows don’t sort their feed with their lips; they swallow any wire or nails in the grass.')],
        ['ayten', tr('Önce yerini doğrulayalım. Al, metal dedektörüm. Sarıkız’ın sol yanını tara; ses sıklaşınca işaretle.', 'Let’s confirm where it is first. Here, take my metal detector. Sweep Sarıkız’s left side, and mark the spot when the beeps come fast.')],
      ]);
      UI.toast(T('got_item', { i: L(tr('Metal dedektörü', 'Metal detector')) }), '◎');
      Q.adv('hardware');
      return;
    }
    if (Q.at('hardware', 'scan')) { await UI.say('ayten', tr('Sarıkız’la konuş ve dedektörü sol yanında gezdir.', 'Talk to Sarıkız and move the detector along her left side.')); return; }
    if (Q.at('hardware', 'treat')) { await Q._magnet(); return; }
    if (Q.at('bloat', 'lead') || Q.at('bloat', 'diagnose')) { await UI.say('ayten', tr('Rıza Dede aradı! Sarıkız’ı çayır ağılına getirin, ben oraya geliyorum.', 'Rıza Dede called! Bring Sarıkız to the grass paddock and I’ll meet you there.')); return; }
    if (Q.at('leylek', 'sweep')) { await UI.say('ayten', tr('Böcek ağıyla tepsi, okuldan çayıra giden yolun ucunda. Hızlı süpür, yoksa çekirgeler kaçar. İki çayırda da aynı sayıda süpürme!', 'The net and tray are at the end of the road from the school to the meadow. Sweep briskly or the grasshoppers get away. The same number of sweeps in both meadows!')); return; }
    if (Q.at('leylek', 'look')) { await UI.say('ayten', tr('Tepsidekilere merceğinle yakından bak. Ağızlarına bak: kim çiğniyor, kim emiyor? Bir de yaprağın altına: orada kim kimle anlaşmış?', 'Look closely at the catch with your lens. Look at their mouths: who chews, who sucks? And under the leaf: who has made a deal with whom?')); return; }
    await UI.say('ayten', this._rot('ayten', [
      tr('Ben bu köyün veterineriyim. Muayenehanem sağlık ocağının hemen yanında.', "I'm the village vet. My practice is right next to the health centre."),
      tr('Geviş getirenler günde sekiz saat kadar geviş getirir. İnekler çok yorgun görünür ama aslında çalışıyorlar!', 'Ruminants can spend around eight hours a day chewing the cud. Cows look lazy, but they’re working!'),
      tr('Köpeklere çikolata vermeyin: içindeki teobromini köpekler bizim gibi parçalayamaz.', "Never give dogs chocolate: they can't break down the theobromine in it the way we can."),
      tr('Tavukların dişi yok; yuttukları küçük taşlarla taşlıkta öğütürler.', "Hens have no teeth; they grind food in their gizzard with little stones they've swallowed."),
    ]));
  },

  async nazli() {
    const S = G.S;
    if (Q.at('hediye', 'nazli')) {
      await UI.talk([
        ['nazli', tr('Evladım, gel! Ayvalık’taki kız kardeşim bir teneke zeytinyağı yollamış, kendi ağaçlarından.', 'Come here, child! My sister in Ayvalık has sent a tin of olive oil from her own trees.')],
        ['nazli', tr('Ama pazardaki adam “Buzdolabında bulanıklaşıyorsa ayçiçek katılmıştır” dedi. Ben de koydum, bulanıklaştı! Kardeşim bana hile yapar mı?', 'But the man at the market said “If it clouds in the fridge, it’s been cut with sunflower oil.” I put it in and it clouded! Would my sister cheat me?')],
        ['nazli', tr('Tenekeyi al, bir de tereyağı ve ayçiçek yağı koydum. Nebahat’in evinin önündeki masada incele.', 'Take the tin; I’ve added some butter and sunflower oil too. Test them on the table outside Nebahat’s house.')],
      ]);
      Q.adv('hediye'); return;
    }
    if (Q.at('hediye', 'test')) { await UI.say('nazli', tr('Yağlar Nebahat’in evinin önündeki masada. Suyu da unutma, karşılaştırmak için!', 'The oils are on the table outside Nebahat’s house. Don’t forget the water, to compare with!')); return; }
    if (Q.at('hediye', 'tell')) { await Q._hediye(); return; }
    if (!S.cases.bakery) Q.open('bakery', true);
    if (Q.at('bakery', 'nazli')) {
      await UI.talk([
        ['nazli', tr('Hoş geldin evladım! Nebahat’in torunu sensin, değil mi? Tam zamanında geldin.', 'Welcome, child! You’re Nebahat’s grandchild, aren’t you? You’ve come just in time.')],
        ['nazli', tr('Otuz yıldır bu fırında ekmek yaparım. İki gündür hamurum kabarmıyor! Tekne dolusu hamur, taş gibi yatıyor.', 'I’ve baked bread in this oven for thirty years. For two days my dough won’t rise! A whole trough of it, lying there like a stone.')],
        ['nazli', tr('Un aynı un, tuz aynı tuz… Nebahat o merceğiyle mayanın içini görürdü. Sen de bir bak, ne olur.', 'Same flour, same salt… Nebahat could see inside the yeast with that lens of hers. Please, you take a look too.')],
      ]);
      W.waypoint = S.waypoint = { x: 3006, y: 2972 };
      Q.adv('bakery');
      return;
    }
    if (Q.at('bakery', 'look')) { await UI.say('nazli', tr('Merceği teknedeki hamura tut. Nebahat, mayayı boyayınca canlısıyla ölüsünün ayrıldığını söylerdi.', 'Hold the lens over the dough in the trough. Nebahat used to say that if you stain the yeast, the living cells and the dead ones look different.')); return; }
    if (Q.at('bakery', 'exp')) { await UI.say('nazli', tr('Mayam ölmüş mü? Aman… Deney masası şurada: şişeler, balonlar, kireç suyu. Nebahat’le geçen yaz kurmuştuk.', 'My yeast is dead? Oh dear… The lab table is right there: flasks, balloons, limewater. Nebahat and I set it up last summer.')); return; }
    if (Q.at('bakery', 'diagnose')) {
      await ask('yeast_heat');
      await UI.talk([
        ['nazli', tr('Vay başıma! Semaverin kaynar suyu… Mayamı haşlamışım!', 'Oh my! The samovar’s boiling water… I scalded my yeast!')],
        ['nazli', tr('Bu sefer ılık suyla açayım: bileğimin içine damlatınca ne sıcak ne soğuk. Bir kaşık da şeker, mayaya yem olsun.', 'This time I’ll use lukewarm water: neither hot nor cold on the inside of my wrist. And a spoonful of sugar to feed the yeast.')],
      ]);
      await UI.fade(() => { S.flags.doughFixed = true; ART.invalidate(); });
      await UI.say('narrator', tr('Bir saat sonra… Hamur teknenin ağzına kadar kabarmış.', 'An hour later… the dough has risen right up to the rim of the trough.'));
      Q.adv('bakery');
      return;
    }
    if (Q.at('bakery', 'rise')) { await UI.say('nazli', tr('Bak şu hamura! Merceğinle içine bak, kabarcıkları gör.', 'Look at that dough! Look inside it with your lens and see the bubbles.')); return; }
    if (Q.at('bakery', 'bake')) {
      await ask('bread_alcohol');
      await UI.talk([
        ['nazli', tr('Hadi bakalım, fırına!', 'Right then, into the oven!')],
        ['narrator', tr('Nazlı Teyze somunları küreğe dizip taş fırına sürer. Meydanı sıcak ekmek kokusu sarar.', 'Nazlı Teyze lines the loaves up on the peel and slides them into the stone oven. The smell of hot bread fills the square.')],
        ['player', tr('Sarıkız’ın işkembesinde de mikroplar mayalanma yapıyordu. Ürünleri farklı ama orada da gaz çıkıyor!', 'Microbes ferment in Sarıkız’s rumen too. The products are different, but there’s gas there as well!')],
        ['nazli', tr('Al, ilk somun senin. Bir de çörek otu; ekmeğin üstüne serpersin.', 'Here, the first loaf is yours. And some nigella seed to sprinkle on your bread.')],
      ]);
      S.flags.baked = true;
      Q.adv('bakery');
      return;
    }
    await UI.say('nazli', this._rot('nazli', [
      tr('Ekşi mayamı her gün beslerim: bir kaşık un, biraz ılık su. Canlı bir şeyi beslemek gibi.', 'I feed my sourdough every day: a spoonful of flour, a little lukewarm water. Like feeding something alive, because it is.'),
      tr('Ekmeğin kabuğu neden kahverengi olur bilir misin? Sıcakta şekerlerle proteinler birleşip renk ve koku verir.', 'Do you know why the crust goes brown? In the heat, sugars and proteins join up and make colour and smell.'),
      tr('Boza da mayalanmayla yapılır. Kışın bir bardak içmeye gel.', 'Boza is made by fermentation too. Come for a glass in winter.'),
      tr('Hamuru soğukta bıraksan ölmez, yalnızca yavaş kabarır. Sıcak öldürür, soğuk uyutur.', 'Leave dough in the cold and it won’t die, it just rises slowly. Heat kills, cold puts to sleep.'),
    ]));
  },

  async elif() {
    if (Q.at('kilcal', 'elif')) {
      await UI.talk([
        ['elif', tr('Artık nefesim kesilmiyor! Ama bir şeye takıldım: kaynağın üstündeki yosunlar hep ıslak. Su aşağı akmaz mı?', 'I don’t get out of breath any more! But something’s bugging me: the moss above the spring is always wet. Doesn’t water flow downhill?')],
        ['elif', tr('Ağaçlar da öyle. Kocaman çamların tepesine su nasıl çıkıyor? Pompaları yok ki!', 'Same with trees. How does water get to the top of those huge pines? They don’t have pumps!')],
        ['elif', tr('Masaya cam borular, bir kereviz, ataş ve bozuk para koydum. Bir de sabun. Hadi deneyelim!', 'I’ve put glass tubes, a celery stalk, a paper clip and a coin on the table. And some soap. Let’s test it!')],
      ]);
      Q.adv('kilcal'); return;
    }
    if (Q.at('kilcal', 'tests')) { await UI.say('elif', tr('Masa kaynağın yanında. Her deneyi sabunlu suyla da yap!', 'The table is by the spring. Do every test with soapy water too!')); return; }
    if (Q.at('kilcal', 'tell')) { await Q._kilcal(); return; }
    if (Q.at('yayla', 'elif')) {
      await UI.talk([
        ['elif', tr('Merhaba… (derin bir nefes) Kusura bakma, iki adım yürüsem nefesim kesiliyor. Başım da zonkluyor.', 'Hi… (a deep breath) Sorry, two steps and I’m out of breath. And my head is pounding.')],
        ['elif', tr('İzmir’de her sabah koşarım! Yusuf Amcam “yaylanın havası incedir” diyor. Hava incelir mi hiç?', 'In İzmir I go running every morning! Uncle Yusuf says “the air is thin up here.” Can air even be thin?')],
        ['player', tr('Ölçelim! Evin önünde bir basamak ve parmağa takılan bir nabız-oksijen ölçer var. Herkese aynı testi yaparız.', 'Let’s measure it! There’s a step in front of the hut and a pulse-oxygen clip for your finger. We’ll give everyone the same test.')],
        ['elif', tr('Çantamda okuldaki beden eğitimi karnem var: İzmir’de aynı testi yapmıştık. Karşılaştırırsın!', 'I’ve got my PE report from school in my bag: we did the same test in İzmir. You can compare!')],
      ]);
      Q.adv('yayla');
      return;
    }
    if (Q.at('yayla', 'yusuf')) { await UI.say('elif', tr('Hadi Yusuf Amcama anlat; ben de çok merak ediyorum!', 'Go on, tell Uncle Yusuf; I really want to know too!')); return; }
    await UI.say('elif', Q.state('yayla') === 'done' ? this._rot('elif', [
      tr('Bugün koyunlarla tepeye kadar yürüdüm, yavaş yavaş. Başım hiç ağrımadı!', 'Today I walked up the hill with the sheep, slowly. No headache at all!'),
      tr('Okula dönünce basamak testini sınıfta da yapacağım. Önce deniz kenarında, sonra teleferikle dağda!', 'When I’m back at school I’ll do the step test with my class. First by the sea, then up the mountain on the cable car!'),
    ]) : tr('Burada nefes almak merdiven çıkmak gibi…', 'Breathing up here feels like climbing stairs…'));
  },
  async yusuf() {
    if (Q.at('yayla', 'yusuf')) { await Q._altitude(); return; }
    await UI.say('yusuf', Q.at('yayla', 'elif') ? tr('Elif’le konuştun mu? Kız dünden beri nefes nefese. Ben alıştım, o daha alışamadı.', 'Have you talked to Elif? The girl’s been out of breath since yesterday. I’m used to it; she isn’t yet.') : this._rot('yusuf', [
      tr('Koyunlar haziranda çıkar, eylülde iner. Yayla otu kısa ama besinlidir.', 'The sheep come up in June and go down in September. Yayla grass is short but nourishing.'),
      tr('Kekiği koparırken kökünden sökme, evladım. Seneye yine bitsin.', 'When you pick thyme, don’t pull it up by the roots, child. Let it grow again next year.'),
      tr('Arıcılar da kovanlarını yazın buraya getirir. Yayla balı başka olur.', 'The beekeepers bring their hives up here in summer too. Yayla honey is something else.'),
    ]));
  },
  async songul() {
    const S = G.S;
    if (Q.at('zar', 'songul')) {
      await UI.talk([
        ['songul', tr('Pancar turşusu kuruyorum, ama şuna bak: haşladığım pancarın suyu kıpkırmızı. Çiğ pancarı kesip yıkayınca su berrak.', 'I’m making beetroot pickle, but look at this: the water I boiled the beetroot in is bright red. Raw beetroot, cut and rinsed, leaves the water clear.')],
        ['songul', tr('Turşu suyu da birkaç günde pembeleşiyor. Boya pancarın neresinde saklanıyor ki?', 'And the brine turns pink in a few days. Where does the beetroot keep its colour?')],
        ['songul', tr('Evin önüne tüpler, pancar diskleri, tuz, alkol ve deterjan koydum. Buzluk da sıcak su da hazır.', 'I’ve put tubes, beet discs, salt, alcohol and detergent outside the house. The ice box and the hot water are ready too.')],
      ]);
      Q.adv('zar'); return;
    }
    if (Q.at('zar', 'beet')) { await UI.say('songul', tr('Tüpler evin önünde. Sade su kontrolünü unutma!', 'The tubes are outside the house. Don’t forget the plain water control!')); return; }
    if (Q.at('zar', 'tell')) { await Q._zar(); return; }
    if (Q.at('yogurt', 'songul')) {
      await UI.talk([
        ['songul', tr('Sen gel de şuna bak! Üç gündür yoğurt mayalıyorum, üç gündür süt süt olarak kalıyor.', 'Come and look at this! Three days I’ve been setting yogurt and three days the milk has stayed milk.')],
        ['songul', tr('Maya aynı maya, dünkü yoğurttan bir kaşık. Süt aynı süt, Sarıkız’ın sütü. Bu hafta tek fark, işe geç kaldığım için acele ettim.', 'Same starter, a spoonful of yesterday’s yogurt. Same milk, from Sarıkız. The only difference this week is that I was late for work and rushed.')],
        ['songul', tr('Evin önündeki masaya dört kavanoz süt koydum. Sıcaklığı değiştirebilirsin, mayayı koyup koymamayı da. Hangisi tutacak, bir bak.', 'I’ve put four jars of milk on the table outside the house. You can change the temperature, and whether they get starter. See which ones set.')],
      ]);
      Q.adv('yogurt'); return;
    }
    if (Q.at('yogurt', 'ferment')) { await UI.say('songul', tr('Kavanozlar evin önündeki masada. Bir kontrol koymayı unutma!', 'The jars are on the table outside the house. Don’t forget a control!')); return; }
    if (Q.at('yogurt', 'tell')) { await Q._yogurt(); return; }
    if (!S.cases.well && Q.state('intro') === 'done') Q.open('well');
    if (Q.at('well', 'songul')) {
      await UI.talk([
        ['songul', tr('Hoş geldin! Şu fidelere bak… Her sabah suluyorum, toprak hep ıslak. Ama yaprakları susuz kalmış gibi sarkıyor.', 'Welcome! Look at these seedlings… I water them every morning and the soil is always wet. But their leaves hang as if they were thirsty.')],
        ['songul', tr('Dere bu yaz kurudu. Bahçenin köşesine derin bir kuyu açtırdık; suyu bol, berrak. Daha mı çok sulasam? Gübre mi atsam?', 'The stream dried up this summer. We had a deep well dug in the corner of the garden; there’s plenty of water and it’s clear. Should I water more? Add fertiliser?')],
        ['player', tr('Toprak ıslakken bitki susuz kalır mı? Önce merceğimle fidelere bakayım.', 'Can a plant go thirsty in wet soil? Let me look at the seedlings with my lens first.')],
        ['songul', tr('Masada oğlumun okuldan getirdiği patates deney takımı da var. İşine yararsa kullan.', 'There’s also a potato test kit my son brought home from school on the table. Use it if it helps.')],
      ]);
      Q.adv('well');
      return;
    }
    if (Q.at('well', 'tell')) { await Q._garden(); return; }
    if (Q.at('well', 'look')) { await UI.say('songul', tr('Merceğinle ne görüyorsun? Kökler çürümüş mü yoksa?', 'What do you see with your lens? Have the roots rotted?')); return; }
    if (Q.at('well', 'osmo')) { await UI.say('songul', tr('Patatesle suyun tuzu ölçülür mü hiç? Doğrusu çok merak ettim.', 'Can you really measure the salt in water with a potato? I’m dying to know.')); return; }
    await UI.say('songul', Q.state('well') === 'done' ? this._rot('songul', [
      tr('Yağmur bidonu dolup taşıyor! Fideler de dimdik.', 'The rain barrel is brimming over! And the seedlings stand tall.'),
      tr('Kuyunun suyunu şimdi yalnızca avluyu yıkamakta kullanıyorum. Taşlarda beyaz lekeler kalıyor, gördün mü?', 'I only use the well water to wash the yard now. It leaves white marks on the stones, see?'),
      tr('Ayaş domatesinin tohumunu her yıl en güzel meyveden alırım. Seninkileri de sakla!', 'Every year I take the Ayaş tomato seed from the best fruit. Keep yours safe too!'),
    ]) : tr('Arılar domates çiçeklerini pek sevmez ama bombus arısı sallayıp tozlaştırır, bilir misin?', 'Honeybees don’t care much for tomato flowers, but bumblebees shake them and pollinate them, did you know?'));
  },
  async owl() {
    await UI.say('player', G.S.flags.owlSafe ? tr('Baykuş yuvasının önünde uyukluyor. Gece vardiyası yaklaşıyor.', 'The owl is dozing by its nest box. The night shift is coming.') : tr('Gündüz uyuyor, gözlerini açmıyor. Rahatsız etmeyeyim; merceğimle uzaktan bakabilirim.', 'It sleeps by day and won’t open its eyes. I won’t disturb it; I can look from here with my lens.'));
  },
  async sevim() {
    const S = G.S;
    if (!S.cases.kompost && Q.state('intro') === 'done') Q.open('kompost', true);
    if (Q.at('kompost', 'sevim')) {
      await UI.talk([
        ['sevim', tr('Ay, iyi ki geldin! Şu yığına bak; kokusundan başım döndü.', 'Oh, I’m glad you came! Look at this heap; the smell is making my head spin.')],
        ['sevim', tr('Bütün yaz bahçemin biçilmiş çimini buraya taşıdım, bir de mutfak artıklarını. Tertemiz, yemyeşil şeyler! Ama bak: ısınmadı, balçık oldu, çürük yumurta gibi kokuyor.', 'All summer I carried my garden’s grass clippings here, and my kitchen scraps. Clean, bright green stuff! But look: it never warmed up, it’s turned to slime, and it smells like rotten eggs.')],
        ['sevim', tr('Nebahat Hanım’ın yığını iki adım ötede, buğu buğu tütüyor, orman gibi kokuyor. Ne farkı var?', 'Nebahat Hanım’s heap is two steps away, steaming away and smelling like a forest. What’s the difference?')],
        ['player', tr('Merceğimle iki yığının içine bakayım. Isıyı yapan bir şey varsa içeride olmalı.', 'Let me look inside both heaps with my lens. If something is making the heat, it must be in there.')],
      ]);
      Q.adv('kompost');
      return;
    }
    if (Q.at('kompost', 'look')) { await UI.say('sevim', tr('Merceğinle bak evlat. Ama önce burnunu tut!', 'Look with your lens, child. But hold your nose first!')); return; }
    if (Q.at('kompost', 'build')) { await UI.say('sevim', tr('Kasa, çatal ve kova avluda. Nebahat Hanım “kompost yemek yapmaya benzer” derdi, hiç anlamazdım.', 'The bin, the fork and the bucket are in the yard. Nebahat Hanım used to say “compost is like cooking”, and I never understood her.')); return; }
    if (Q.at('kompost', 'tell')) { await Q._kompost(); return; }
    await UI.say('sevim', this._rot('sevim', S.flags.compostFixed ? [
      tr('Yığınım ısındı! Sabah elimi soktum, içi hamam gibiydi.', 'My heap has warmed up! I put my hand in this morning and it was like a bathhouse.'),
      tr('Artık çimi saman kasasının yanına biriktiriyorum: bir kat yeşil, iki kat kahverengi.', 'Now I pile the grass up by the straw: one layer green, two layers brown.'),
      tr('Fatma’ya da anlattım. O da kabak saplarını buraya getirecek.', 'I told Fatma too. She’s going to bring her squash vines here.'),
    ] : [
      tr('Kokudan komşular şikâyet edecek diye korkuyorum.', 'I’m afraid the neighbours will complain about the smell.'),
      tr('Çim bahçede de çürür diye düşünmüştüm, ne işime yarar ki?', 'I thought grass would rot in the garden anyway, so what use is it?'),
    ]));
  },
  async osman() {
    const S = G.S;
    if (Q.at('azot', 'osman')) {
      await UI.talk([
        ['osman', tr('Pastan kurtulduk, şimdi de bu! Buğday sararıyor, önce alttaki yapraklar.', 'We beat the rust, and now this! The wheat is yellowing, the lower leaves first.')],
        ['osman', tr('Tuhaf olan şu: geçen yıl nohut ektiğim ince şerit yemyeşil. Gübreci “Azot eksik, çuvalla al” diyor.', 'The strange thing is: the thin strip where I grew chickpeas last year is bright green. The fertiliser man says “It’s short of nitrogen, buy it by the sack.”')],
        ['osman', tr('Tarlanın kenarındaki masaya kürek ve birkaç kart koydum. Köklere bir bak, sonra bana anlat.', 'I’ve put a spade and some cards on the table at the field edge. Have a look at the roots, then tell me.')],
      ]);
      Q.adv('azot'); return;
    }
    if (Q.at('azot', 'cycle')) { await UI.say('osman', tr('Kürek masanın yanında. Önce köklere bak!', 'The spade is by the table. Look at the roots first!')); return; }
    if (Q.at('azot', 'tell')) { await Q._azot(); return; }
    if (!S.cases.pas && Q.state('intro') === 'done') Q.open('pas', true);
    if (Q.at('pas', 'osman')) {
      await UI.talk([
        ['osman', tr('Gel evlat, gel de şu tarlaya bak. Geçen ay yemyeşildi, şimdi sapsarı!', 'Come here, child, come and look at this field. Last month it was bright green, now it’s all yellow!')],
        ['osman', tr('Bu yıl şehirden yeni bir tohum aldım, “en verimlisi bu” dediler. Bütün tarlaya onu ektim. Yağmurlardan sonra yapraklar turuncu tozla kaplandı; bak, paçalarım bile turuncu.', 'This year I bought new seed in the city; they said “this is the highest-yielding one”. I sowed the whole field with it. After the rains the leaves got covered in orange dust; look, even my trouser hems are orange.')],
        ['osman', tr('Nebahat Hanım’ın tarlası iki adım ötede, onun buğdayı yemyeşil! Aynı yağmur, aynı rüzgâr… Toprakta demir mi var, nedir?', 'Nebahat Hanım’s field is two steps away, and her wheat is bright green! Same rain, same wind… Is there iron in the soil, or what?')],
        ['player', tr('Merceğimle yapraklara bakayım. Bu tozun ne olduğunu anlarsak nasıl yayıldığını da anlarız.', 'Let me look at the leaves with my lens. If we find out what this dust is, we’ll understand how it spreads too.')],
      ]);
      Q.adv('pas');
      return;
    }
    if (Q.at('pas', 'look')) { await UI.say('osman', tr('Merceğinle bak evlat. Tozu parmağına bulaştırma, paçana da… gerçi benimkiler gitti.', 'Look with your lens, child. Don’t get the dust on your fingers, or your trousers… though mine are done for.')); return; }
    if (Q.at('pas', 'wind')) { await UI.say('osman', tr('Şu masayı ziraat odası getirdi, rüzgârı gösteriyormuş. Ben anlamadım, sen dene.', 'The farmers’ office brought that table; it’s supposed to show the wind. I couldn’t make head or tail of it, you try.')); return; }
    if (Q.at('pas', 'tell')) { await Q._pas(); return; }
    await UI.say('osman', this._rot('osman', S.flags.rustWise ? [
      tr('Güz gelince tarlanın yarısına karakılçık ekeceğim, yarısına başka bir yerli çeşit. Bakalım pas ne diyecek.', 'When autumn comes I’ll sow half the field with karakılçık and half with another local variety. We’ll see what the rust has to say.'),
      tr('Paçalarımı yıkadım, turuncusu çıktı. Sporları başka tarlaya taşımayayım dedim.', 'I washed my trouser hems and the orange came out. I didn’t want to carry spores to another field.'),
      tr('Babam derdi ki: tek tohuma güvenen tek yağmurda batar. Şimdi anladım.', 'My father used to say: trust one seed and one rain will sink you. Now I get it.'),
    ] : [
      tr('Ne ekersen onu biçersin derler. Ben ne ektim de pas biçiyorum?', 'They say you reap what you sow. What did I sow that I’m reaping rust?'),
      tr('Bu tarla dedemden kalma. Onun zamanında her tarlada üç beş çeşit buğday karışık olurdu.', 'This field came down from my grandfather. In his day every field had a few kinds of wheat mixed together.'),
    ]));
  },
  async fatma() {
    const S = G.S;
    if (!S.cases.kabak && Q.state('intro') === 'done') Q.open('kabak', true);
    if (Q.at('ekim', 'fatma')) {
      await UI.talk([
        ['fatma', tr('Şu işe bak! Yeğenim şehirden geldi, “Teyze, her şeyi mayısta ekelim, en sıcak o zaman” diyor.', 'Would you believe it! My nephew has come from the city and says “Auntie, let’s sow everything in May, that’s when it’s warmest.”')],
        ['fatma', tr('Kırk yıldır bu tarlaya bakarım. Sıcak her şey demek değil ama ben de nedenini anlatamıyorum.', 'I’ve looked after this field for forty years. Warm isn’t everything, but I can’t explain why either.')],
        ['fatma', tr('Bahçedeki masaya defterimi ve dört tohum koydum: buğday, nohut, domates, ıspanak. Her birini dört ayrı ayda ek, bak ne oluyor.', 'I’ve put my notebook and four seeds on the garden table: wheat, chickpea, tomato, spinach. Sow each one in four different months and see what happens.')],
      ]);
      Q.adv('ekim'); return;
    }
    if (Q.at('ekim', 'sow')) { await UI.say('fatma', tr('Defter bahçedeki masada. Her bitkiye en az bir doğru ay bul!', 'The notebook is on the garden table. Find at least one right month for every crop!')); return; }
    if (Q.at('ekim', 'tell')) { await Q._ekim(); return; }
    if (Q.at('kabak', 'fatma')) {
      await UI.talk([
        ['fatma', tr('Gel yavrum, gel. Şu kabaklara bak hele! Nebahat’in ata kabağı bu mu şimdi?', 'Come here, child. Just look at these squash! Is this Nebahat’s heirloom squash now?')],
        ['fatma', tr('Kırk yıldır tohumunu ben saklarım. Her güz en güzel kabağı ayırır, çekirdeğini kurutur, zarfa koyarım. Bu yıl aynı zarftan ektim; bak ne çıktı: siğilli, çizgili, taş gibi.', 'I’ve kept its seed for forty years. Every autumn I set aside the best squash, dry its seeds and put them in a packet. This year I sowed from the same packet, and look what came up: warty, striped, hard as stone.')],
        ['fatma', tr('Birini pişirdim, acı çıktı, tükürdüm. Tohum bozuldu herhalde.', 'I cooked one; it was bitter and I spat it out. The seed must have gone bad.')],
        ['player', tr('Acı kabağı sakın yemeyin, zehirli olabilir. Peki geçen yıl tohum aldığınız kabak nasıldı?', 'Don’t eat a bitter squash: it can be poisonous. But what was the squash you took the seed from like last year?')],
        ['fatma', tr('Tertemizdi! Tıpkı anasının kabağı. Tek fark şu: komşu Sevim geçen bahar çitine şu süs kabaklarını dikti. Güzel görünsün diye.', 'Perfect! Just like its mother’s. The only difference: last spring my neighbour Sevim planted those gourds along her fence. For looks.')],
        ['fatma', tr('Sen biyologsun. Merceğinle çiçeklere bir bak; ben sabahları bu bahçede arıdan başka kimseyi görmüyorum.', 'You’re the biologist. Take a look at the flowers with your lens; in the mornings I see nobody in this garden but the bees.')],
      ]);
      Q.adv('kabak');
      return;
    }
    if (Q.at('kabak', 'look')) { await UI.say('fatma', tr('Çiçeklere bak yavrum. Bazısının altında minik bir kabak var, bazısı uzun saplı ve altı boş.', 'Look at the flowers, child. Some have a tiny squash underneath; some are on long stalks with nothing below.')); return; }
    if (Q.at('kabak', 'pollinate')) { await UI.say('fatma', tr('Mandallar, kâğıt torbalar, etiketler masada. Akşamdan kapatmazsan arı senden önce davranır!', 'The pegs, paper bags and tags are on the table. If you don’t close the flower the evening before, a bee will beat you to it!')); return; }
    if (Q.at('kabak', 'tell')) { await Q._kabak(); return; }
    await UI.say('fatma', this._rot('fatma', S.flags.squashPure ? [
      tr('Etiketli kabaklar büyüyor. Bu güz zarfların üstüne “ELLE” yazacağım.', 'The tagged squash are growing. This autumn I’ll write “HAND” on the packets.'),
      tr('Sevim süs kabaklarını bahçesinin öbür ucuna taşıdı. Arı yine gelir ama daha az.', 'Sevim moved her gourds to the far end of her garden. The bees still come, but less.'),
      tr('Tohumu satın alırsan bir yıl gider. Saklarsan yüz yıl gider.', 'Buy your seed and it lasts a year. Keep it and it lasts a hundred.'),
    ] : [
      tr('Kabak çiçeği sabah açar, öğlene kapanır. Arılar da o yüzden şafakta çalışır.', 'A squash flower opens in the morning and shuts by noon. That’s why the bees work at dawn.'),
      tr('Bu bahçenin tohumu Nebahat’in annesinden kalma.', 'The seed in this garden came down from Nebahat’s mother.'),
    ]));
  },
  async huseyin() {
    const S = G.S;
    if (Q.at('etilen', 'huseyin')) {
      await UI.talk([
        ['huseyin', tr('Ayaz geliyor dediler, bütün domatesleri yeşilken topladım. Bir kasa dolusu!', 'They said frost was coming, so I picked all the tomatoes green. A whole crate!')],
        ['huseyin', tr('Karım “güneşe koy” diyor, oğlum “buzdolabına koy” diyor. Songül de “yanlarına bir elma koy” diyor. Kime inanayım?', 'My wife says “put them in the sun”, my son says “put them in the fridge”. And Songül says “put an apple in with them”. Who do I believe?')],
        ['huseyin', tr('Masada dört kâğıt torba var. Nereye koyacağını ve elma katıp katmayacağını sen seç.', 'There are four paper bags on the table. You choose where they go and whether an apple goes in.')],
      ]);
      Q.adv('etilen'); return;
    }
    if (Q.at('etilen', 'ripen')) { await UI.say('huseyin', tr('Torbalar masada. Elmalıyı elmasızla karşılaştırmayı unutma!', 'The bags are on the table. Don’t forget to compare with and without an apple!')); return; }
    if (Q.at('etilen', 'tell')) { await Q._etilen(); return; }
    if (Q.at('asi', 'huseyin')) {
      await UI.talk([
        ['huseyin', tr('Gel evladım, gel. Bak şu ağaca: Nebahat’in dedesinin diktiği Amasya elması. Yüz yirmi yaşında.', 'Come here, child. Look at this tree: the Amasya apple that Nebahat’s grandfather planted. A hundred and twenty years old.')],
        ['huseyin', tr('Dünkü fırtınada gövdesi yarıldı, kökü de zaten çürüktü. Bu kışı çıkaramaz.', 'Yesterday’s storm split its trunk, and the roots were rotten already. It won’t see out the winter.')],
        ['huseyin', tr('Muhtar “çekirdeklerini ekeriz, olur biter” diyor. Olmaz! Çekirdekten bu elma bir daha çıkmaz.', 'The mukhtar says “we’ll plant its pips and that’s that”. No! This apple will never come up from a pip again.')],
        ['player', tr('Neden çıkmaz?', 'Why not?')],
        ['huseyin', tr('Onu sen bul, biyolog sensin. Ben bildiğimi söyleyeyim: aşı. Kırk yıl bu vadinin bütün ağaçlarını ben aşıladım. Ama ellerim titriyor artık… Sen keseceksin, ben söyleyeceğim.', 'You work that out: you’re the biologist. I’ll tell you what I know: grafting. For forty years I grafted every tree in this valley. But my hands shake now… You’ll do the cutting, I’ll do the telling.')],
        ['huseyin', tr('Önce merceğinle masadaki dala bak. Aşının sırrı kabuğun hemen altında.', 'First look at the twig on the table with your lens. The secret of grafting lies just under the bark.')],
      ]);
      Q.adv('asi');
      return;
    }
    if (Q.at('asi', 'look')) { await UI.say('huseyin', tr('Dalı enine kesilmiş düşün: kabuk, sonra ince yeşil bir halka… İşte o halka. Bir de aşı yerinde yaranın nasıl kapandığına bak.', 'Picture the twig cut across: bark, then a thin green ring… That ring is it. And look at how the wound closes at a graft union.')); return; }
    if (Q.at('asi', 'graft')) { await UI.say('huseyin', tr('Kalemler ve anaçlar masada. Kesiği tek çekişte yap. Kalem ince, anaç kalın: yeşil halkalar değmezse aşı tutmaz.', 'The scions and rootstocks are on the table. Make the cut in one stroke. The scion is thin, the rootstock thick: if the green rings don’t touch, the graft won’t take.')); return; }
    if (Q.at('asi', 'tell')) { await Q._asi(); return; }
    await UI.say('huseyin', this._rot('huseyin', S.flags.appleSaved ? [
      tr('Fidanlar büyüyor. Yaşlı ağaç devrilse de elması yaşayacak.', 'The saplings are growing. Even if the old tree falls, its apple will live on.'),
      tr('Eskiden her bahçede başka bir elma vardı: Amasya, Arapkızı… Şimdi markette üç çeşit görürsün.', 'Every garden used to have a different apple: Amasya, Arapkızı… Now you see three kinds at the market.'),
    ] : [
      tr('Eskiden her bahçede başka bir elma vardı: Amasya, Arapkızı… Şimdi markette üç çeşit görürsün.', 'Every garden used to have a different apple: Amasya, Arapkızı… Now you see three kinds at the market.'),
      tr('Aşının vakti kış sonudur: gözler uyurken kes, özsu yürürken aşıla.', 'Grafting time is the end of winter: cut while the buds sleep, graft as the sap rises.'),
    ]));
  },
  async zehra() {
    const S = G.S;
    if (Q.at('sindirim', 'zehra')) {
      await UI.talk([
        ['zehra', tr('Yarın okulda sağlık dersi veriyorum. Sorduğumda çocukların hepsi “Yemek midede erir, biter” diyor.', 'Tomorrow I’m giving a health lesson at the school. When I ask, every child says “Food melts in the stomach and that’s it.”')],
        ['zehra', tr('Rafa dört besin ve dört salgı koydum: tükürük, mide öz suyu, safra ile pankreas salgısı, bir de kalın bağırsak. Hepsi 37 °C’de.', 'I’ve put four foods and four juices on the rack: saliva, gastric juice, bile with pancreatic juice, and the large intestine. All at 37 °C.')],
        ['zehra', tr('Her besini her salgıyla karıştır. Bir lokmanın bütün yolculuğunu çıkaralım.', 'Mix every food with every juice. Let’s map a mouthful’s whole journey.')],
      ]);
      Q.adv('sindirim'); return;
    }
    if (Q.at('sindirim', 'digest')) { await UI.say('zehra', tr('Tüp rafı revirde. On altı tüpün hepsine bak!', 'The tube rack is in the clinic. Check all sixteen tubes!')); return; }
    if (Q.at('sindirim', 'tell')) { await Q._sindirim(); return; }
    if (Q.at('eksik', 'zehra')) {
      await UI.talk([
        ['zehra', tr('Tam zamanında! Bugün aşı günü, bebeklerin başından ayrılamam. Ama salonda dört hasta bekliyor ve bence hiçbiri gerçekten hasta değil: hepsinde bir şey eksik.', 'Just in time! It’s vaccination day and I can’t leave the babies. But four patients are waiting outside, and I don’t think any of them is really ill: each is missing something.')],
        ['zehra', tr('Masada defterim var. Yıllardır her vitamin ve mineral için bir sayfa tuttum: ne işe yarar, nerede bulunur, eksik kalınca ne olur.', 'My notebook is on the desk. For years I’ve kept a page for every vitamin and mineral: what it does, where it’s found, what happens when it runs short.')],
        ['zehra', tr('Önce muayene et, sonra ne yediklerini sor. Tek bir belirtiye kanma: aynı belirti birkaç eksiklikte görülür.', 'Examine them first, then ask what they eat. Don’t be fooled by a single sign: the same sign turns up in several deficiencies.')],
      ]);
      Q.adv('eksik'); return;
    }
    if (Q.at('eksik', 'diagnose')) { await UI.say('zehra', tr('Defter masada. Bir iğne daha, sonra seninim!', 'The notebook is on the desk. One more jab and I’m all yours!')); return; }
    if (Q.at('eksik', 'tell')) { await Q._eksik(); return; }
    if (Q.at('tansiyon', 'zehra')) {
      await UI.talk([
        ['zehra', tr('Hoş geldin! Nebahat Hanım’ın torunusun, değil mi? Tam zamanında geldin: bugün köyde tansiyon taraması var.', 'Welcome! You’re Nebahat’s grandchild, aren’t you? You’ve come just in time: it’s blood-pressure screening day in the village.')],
        ['zehra', tr('Ama dijital aletin pili bitti, yenisi haftaya gelecek. Eski usul ölçeceğiz: manşon, ibreli saat, steteskop. Kulağın iyidir herhalde?', 'But the digital monitor’s batteries are dead, and new ones won’t come till next week. We’ll measure the old way: cuff, dial gauge, stethoscope. I hope your ears are good?')],
        ['zehra', tr('Manşonu şişirirsin; kol atardamarı sıkışır, kan geçemez, ses yok. Sonra vanayı azıcık açarsın. Kalbin itişi manşonu yendiği an her atımda bir “tık” duyarsın: o büyük tansiyon. Tıklar kesildiği an: küçük tansiyon.', 'You inflate the cuff; the arm’s artery is squeezed shut, no blood gets through, no sound. Then you open the valve a little. The moment the heart’s push beats the cuff, you hear a “tap” at every beat: that’s the big number. The moment the taps stop: the small one.')],
        ['zehra', tr('Vanayı çok açma: saniyede iki üç mmHg. Yoksa iki atım arasında ibre sayıyı atlar.', 'Don’t open the valve too far: two or three mmHg a second. Otherwise the needle skips past the number between two beats.')],
        ['zehra', tr('Sırada Alp, Nazlı Teyze ve Hasan Dede var. Hasan Dede “ben hiç hasta olmadım, ne ölçeceksiniz” diye söylenip duruyor, ama geldi işte.', 'In line are Alp, Nazlı Teyze and Hasan Dede. Hasan Dede keeps grumbling “I’ve never been ill, what are you going to measure?”, but here he is.')],
      ]);
      Q.adv('tansiyon');
      return;
    }
    if (Q.at('tansiyon', 'measure')) { await UI.say('zehra', tr('Alet masada. İlk tık büyük, son tık küçük tansiyon. Acele etme; vana yavaş!', 'The cuff is on the desk. First tap: the big number; last tap: the small one. Don’t rush; slow on the valve!')); return; }
    if (Q.at('tansiyon', 'look')) { await UI.say('zehra', tr('Raftaki kalp modeline merceğinle bak. Hangi odacığın duvarı en kalın? Bir de damar kesitine in: o basıncı taşıyan kas nerede?', 'Look at the heart model on the shelf with your lens. Which chamber has the thickest wall? Then go down to the vessel section: where is the muscle that bears that pressure?')); return; }
    if (Q.at('tansiyon', 'tell')) { await UI.say('zehra', tr('Hasan Dede kahvehaneye döndü. Tuzluğu elinden bırakmıyor; bir de sen konuş.', 'Hasan Dede has gone back to the teahouse. He won’t let go of the salt cellar; you have a word with him too.')); return; }
    await UI.say('zehra', this._rot('zehra', S.flags.hasanChecked ? [
      tr('Hasan Dede her perşembe ölçtürmeye geliyor. Tuzu azaltmış; akşamları da dereye kadar yürüyor.', 'Hasan Dede comes in every Thursday to be measured. He’s cut down on salt, and walks to the stream in the evenings.'),
      tr('Tansiyon ölçerken hasta konuşmasın, bacak bacak üstüne atmasın: ikisi de sayıyı yükseltir.', 'When measuring blood pressure the patient mustn’t talk or cross their legs: both push the number up.'),
    ] : [
      tr('Doktor haftada iki gün gelir; öbür günler aşı, pansuman, ölçüm bende.', 'The doctor comes two days a week; the rest of the time vaccinations, dressings and check-ups are up to me.'),
      tr('Kalbin günde yaklaşık yüz bin kez atar. Bir yılda pompaladığı kanla olimpik bir yüzme havuzu dolar.', 'Your heart beats about a hundred thousand times a day. In a year it pumps enough blood to fill an Olympic swimming pool.'),
      tr('Tansiyon ölçerken hasta konuşmasın, bacak bacak üstüne atmasın: ikisi de sayıyı yükseltir.', 'When measuring blood pressure the patient mustn’t talk or cross their legs: both push the number up.'),
    ]));
  },
  async elder(n) {
    const S = G.S;
    if (Q.at('spring', 'elders')) { await Q._elders(); return; }
    const pond = Q.state('pond'), frogs = S.pond.oxygen >= 50;
    if (Q.at('tansiyon', 'tell')) {
      if (n === 2) { await UI.say('elder2', tr('Hasan’a bir şey söyle evladım; tuzluğu elinden bırakmıyor.', 'Say something to Hasan, child; he won’t let go of the salt cellar.')); return; }
      await Q._tansiyon(); return;
    }
    if (Q.at('hucre', 'mehmet')) {
      if (n === 1) { await UI.say('elder1', tr('Mehmet yine bir şey tutturdu. Git bir dinle, belki sen ikna edersin.', 'Mehmet has got hold of something again. Go and listen; maybe you can talk him round.')); return; }
      await UI.talk([
        ['elder2', tr('Evladım, bizim torunun biyoloji kitabında ne yazıyor biliyor musun? “Bütün canlılar hücrelerden oluşur.” Hadi canım!', 'Child, do you know what my grandchild’s biology book says? “All living things are made of cells.” Come off it!')],
        ['elder2', tr('Yetmiş yıldır soğan doğrarım, bir tane hücre görmedim. Soğan su ile lif; benim yanağım et. İkisi aynı tuğladan mı yapılmış?', 'I’ve been chopping onions for seventy years and never seen one cell. An onion is water and fibre; my cheek is flesh. Are they built from the same bricks?')],
        ['elder1', tr('Mehmet, Nebahat’in mikroskobu şu masada duruyor. Çocuk göstersin de sus artık.', 'Mehmet, Nebahat’s microscope is right there on the table. Let the child show you, and then hush.')],
        ['player', tr('Bir soğan zarı, bir de yanak hücresi hazırlayayım. Kendi gözünüzle görün, Mehmet Dede.', 'I’ll make a slide of onion skin and one of cheek cells. See for yourself, Mehmet Dede.')],
        ['elder2', tr('Görelim bakalım. Ama bana soluk soluk bir şeyler gösterirsen inanmam, ha!', 'We’ll see. But if you show me pale little nothings, I won’t believe a word!')],
      ]);
      Q.adv('hucre');
      return;
    }
    if (Q.at('hucre', 'slide')) { await UI.say(n === 1 ? 'elder1' : 'elder2', n === 1 ? tr('Soğan zarı incecik olur, acele etme. Nebahat de hep yavaş çalışırdı.', 'Onion skin is very thin; don’t rush. Nebahat always worked slowly too.') : tr('Hani hücre? Mikroskop masada, hadi bakalım.', 'So where’s this cell? The microscope is on the table, go on.')); return; }
    if (Q.at('hucre', 'look')) { await UI.say('elder2', tr('Gördüm, gördüm. Duvarlı kutucuklar. Ama içi boş bir torba işte, dedim ben sana!', 'I saw, I saw. Little boxes with walls. But they’re empty bags inside, I told you!')); return; }
    if (Q.at('hucre', 'tell')) { await Q._hucre(); return; }
    if (n === 1 && (Q.at('azik', 'burn') || Q.at('azik', 'look'))) { await UI.say('elder1', tr('Bizim çobanlar yaylaya çıkarken heybeye ceviz, peynir, bir de kuru dut koyardı. Şekerle dağ çıkılmaz evladım!', 'Our shepherds going up to the yayla packed walnuts, cheese and dried mulberries in their saddlebags. You can’t climb a mountain on sugar, child!')); return; }
    const lines = n === 1 ? [
      frogs ? tr('Duyuyor musun? Kurbağalar! Yıllar sonra ilk kez.', 'Hear that? Frogs! First time in years.') : tr('Eskiden gölette kurbağa sesinden uyuyamazdık. Şimdi sessiz. Sessizlik iyiye işaret değil.', 'We used to lie awake from the frogs in the pond. Now it’s silent. Silence is not a good sign.'),
      tr('Leylek damına konan evde bereket olur derler. Bizimkiler okulun damına konar!', 'They say a house with a stork on the roof is blessed. Ours nest on the school roof!'),
      tr('Tarlaya gübreyi çuvalla atan, nehirden balığı kovayla toplar.', 'Pour fertiliser on your field by the sack, and you’ll collect dead fish from the river by the bucket.'),
    ] : [
      tr('Çay içer misin evladım? … Yok mu? Sen bilirsin.', 'Tea, child? … No? Suit yourself.'),
      tr('Mağaradaki pınar kükürt kokar ama suyu şifalıdır derler. Bir gün bak.', 'The spring in the cave smells of sulphur, but they say the water heals. Take a look one day.'),
      tr('Tren haftada bir uğrar. Eskiden yaylaya onunla çıkardık.', 'The train stops once a week. We used to ride it up to the yayla.'),
    ];
    await UI.say(n === 1 ? 'elder1' : 'elder2', this._rot('elder' + n, lines));
  },

  async cow() {
    const c = actor('sarikiz');
    if (Q.at('hardware', 'scan')) {
      if (!await KIT.detector()) return;
      await UI.say('player', tr('Tam burası: sol yanda, alçakta, ön bacağın hemen arkası. Kalbe çok yakın! Ayten Hanım’a söyleyeyim.', 'Right here: low on the left side, just behind the front leg. Very close to the heart! Let me tell Ayten.'));
      Q.adv('hardware');
      return;
    }
    if (G.S.cases.hardware && !G.S.flags.magnetIn) { AU.sfx('moo', { v: 0.6 }); UI.toast(L(tr('Sarıkız sırtını kamburlaştırmış, inliyor.', 'Sarıkız stands with her back arched, groaning.')), '♥'); return; }
    if (Q.at('bloat', 'lead')) {
      if (c.state === 'follow' && Q.cowAtPaddock(true) && !Q._scene) { Q._scene = true; Q._ayten().catch(e => console.error(e)).finally(() => { Q._scene = false; }); return; }
      if (c.state === 'follow') { UI.toast(L(tr('Sarıkız peşinde. Çayır ağılı batıda.', 'Sarıkız is following you. The grass paddock is to the west.')), '♥'); return; }
      c.state = 'follow'; c.lead = true;
      AU.sfx('moo', { v: 1 });
      UI.toast(L(tr('Sarıkız seni takip ediyor.', 'Sarıkız is following you.')), '♥');
      W.waypoint = G.S.waypoint = { x: 3070, y: 2395 };
      return;
    }
    AU.sfx('moo', { v: 0.8 });
    UI.toast(L(G.S.flags.cowTreated ? tr('Sarıkız geviş getiriyor. Sakin ve mutlu.', 'Sarıkız is chewing the cud, calm and happy.') : tr('Sarıkız inliyor. Karnı gergin.', 'Sarıkız groans. Her belly is tight.')), '♥');
  },
  dog() { AU.sfx('bark'); UI.toast(L(Q.at('bloat', 'dog') ? tr('Karabaş kuyruğunu sallıyor. Merceğini ona tut!', 'Karabaş wags his tail. Point your lens at him!') : this._rot('dog', [tr('Karabaş kulaklarını dikti.', 'Karabaş pricks up his ears.'), tr('Karabaş bir Kangal: sürünün bekçisi.', 'Karabaş is a Kangal: guardian of the flock.')])), '♥'); },
  sheep() { AU.sfx('baa'); UI.toast(L(this._rot('sheep', [tr('Koyun geviş getiriyor. Yağlı kuyruğu sallanıyor.', 'The sheep is chewing the cud. Its fat tail wobbles.'), tr('Bu bir Akkaraman koyunu.', "It's an Akkaraman sheep.")])), '♥'); },
  hen() { AU.sfx('cluck'); UI.toast(L(this._rot('hen', [tr('Tavuk yerden küçük taşlar topluyor.', 'The hen is picking up little stones.'), tr('Gıt gıdak!', 'Bawk bawk!')])), '♥'); },
  cat() { UI.toast(L(this._rot('cat', [tr('Kedi gözlerini kıstı: mırr…', 'The cat narrows its eyes: purr…'), tr('Kedi seni umursamadı.', 'The cat ignores you.')])), '♥'); },
  stork() { AU.sfx('clatter'); UI.toast(L(tr('Leylekler gagalarını takırdatıyor. Merceğinle bak!', 'The storks are clattering their beaks. Look with your lens!')), '♥'); },
  frog() { UI.toast(L(tr('Vrak! Kurbağa suya atladı.', 'Ribbit! The frog jumps into the water.')), '♥'); AU.sfx('splash'); },
};

// ================================================================ objects
const USE = {
  async desk() {
    const S = G.S;
    if (!S.flags.letterRead) { await KIT.letter(); return; }
    await UI.say('player', this._deskLine());
  },
  _deskLine() {
    return TALK._rot('desk', [
      tr('Nine’nin masası: kurutulmuş bitkiler, sararmış defterler, soğumuş bir çay.', "Grandma's desk: dried plants, yellowed notebooks, a cold glass of tea."),
      tr('Masanın kenarına kazınmış: “Gözle, ölç, şüphelen, yine gözle.”', "Carved into the edge of the desk: 'Observe, measure, doubt, observe again.'"),
    ]);
  },
  async bed() {
    const S = G.S;
    if (Q.state('bloat') === 'open' && !S.flags.cowTreated) { await UI.say('player', tr('Sarıkız bu hâldeyken uyuyamam.', "I can't sleep while Sarıkız is like this.")); return; }
    if (!S.flags.letterRead) { await UI.say('player', tr('Önce Nine’nin mektubunu okumalıyım.', "First I should read Grandma's letter.")); return; }
    if (!await UI.confirm(T('sleep_q'), T('sleep_yes'))) return;
    G.busy = true;
    AU.sfx('sleep');
    let lines = [];
    await UI.fade(() => { lines = SIM.advance(S); ART.invalidate(); G.save(); });
    G.busy = false;
    await UI.season(lines);
    await Q.afterSleep();
    G.save();
  },
  async chest() {
    const S = G.S;
    if (S.flags.mail === 'willow' || Q.state('willow') === 'done') give('kavilca');
    UI.journal('seeds');
  },
  async board() {
    const i = await UI.choose('player', tr('Tahtada köylülerin soruları asılı. Hangisine bakayım?', 'The villagers’ questions are pinned to the board. What shall I look at?'), [tr('Deneyimi tasarla', 'Design my own experiment'), tr('Vaka defteri', 'The case journal'), tr('Hiçbiri', 'Nothing')]);
    if (i === 0) DESIGN.open(); else if (i === 1) UI.journal('cases');
  },
  radio() {
    const on = AU.mode !== 'world';
    AU.music(on ? 'world' : 'none');
    UI.toast(L(on ? tr('Radyo Denizli: şimdi türkü saati.', 'Radio Denizli: folk-song hour.') : tr('Radyo kapandı.', 'The radio goes quiet.')), '♪');
  },
  async microscope() {
    const i = await UI.choose('player', tr('Mikroskobun yanında etiketsiz lamlar duruyor. Ne yapayım?', 'Unlabelled slides lie next to the microscope. What shall I do?'), [tr('Gizemli numuneler', 'Mystery samples'), tr('Laboratuvar ortakları (iki kişi)', 'Lab partners (two players)'), tr('Gözlem defteri', 'The observation journal'), tr('Hiçbiri', 'Nothing')]);
    if (i === 0) MYSTERY.open(); else if (i === 1) PARTNER.open(); else if (i === 2) UI.journal('obs');
  },
  async oven() {
    await UI.say('player', G.S.flags.baked ? tr('Taş fırından sıcak somunlar çıkıyor; kabukları çıtır çıtır.', 'Hot loaves are coming out of the stone oven, their crusts crackling.') : TALK._rot('oven', [
      tr('Taş fırın gürül gürül yanıyor. Kalın kubbesi ısıyı saatlerce tutar.', 'The stone oven is roaring. Its thick dome holds the heat for hours.'),
      tr('Fırının ağzında boş kürekler bekliyor. Pişecek ekmek yok.', 'Empty peels wait at the mouth of the oven. There’s no bread to bake.'),
    ]));
  },
  async trough() {
    await UI.say('player', G.S.flags.doughFixed ? tr('Hamur teknenin ağzına kadar kabarmış. Merceğimle içine bakabilirim.', 'The dough has risen right up to the rim. I can look inside it with my lens.') : tr('Teknede ağır, yapış yapış bir hamur; hiç kabarmamış. Merceğimle bakabilirim.', 'A heavy, sticky dough in the trough; it hasn’t risen at all. I can look at it with my lens.'));
  },
  ferm() { if (!G.S.cases.bakery) Q.open('bakery'); FERM.open(); },
  async stage() {
    if (Q.at('festival', 'quiz')) { await KIT.festQuiz(); Q.adv('festival'); return; }
    if (Q.at('festival', 'letter') || Q.at('festival', 'nine')) { await UI.say('deniz', tr('Önce Nebahat Nine’ye merhaba de! Yarışma birazdan başlıyor.', 'Say hello to Grandma Nebahat first! The quiz starts soon.')); return; }
    await UI.say('player', G.S.cases.festival ? tr('Sahnede davul duruyor. Yarışma bitti ama şenlik sürüyor.', 'The drum is still on the stage. The quiz is over but the festival goes on.') : tr('Köyün sahnesi. Hasat şenliğinde burada yarışma yapılırmış.', 'The village stage. They hold a quiz here at the harvest festival.'));
  },
  async swap() {
    if (!Q.at('festival', 'swap')) { await UI.say('player', Q.state('festival') === 'done' ? tr('Takas masası boşaldı. Tohumlarım şimdi köyün tarlalarında.', 'The swap table is empty now. My seeds are in the village fields.') : tr('Takas masası. Önce yarışma var.', 'The swap table. The quiz comes first.')); return; }
    if (!await KIT.swap()) return;
    Q.adv('festival'); Q._festWorld();
  },
  async step() {
    if (!G.S.cases.yayla && Q.state('intro') === 'done') Q.open('yayla');
    if (Q.at('yayla', 'elif')) { await UI.say('player', tr('Bir basamak, bir metronom ve bir nabız-oksijen ölçer. Önce Elif’le konuşayım.', 'A step, a metronome and a pulse-oxygen clip. Let me talk to Elif first.')); return; }
    STEP.open();
  },
  async bloodkit() {
    await UI.say('player', Q.at('yayla', 'look') || Q.state('yayla') === 'done' ? tr('Elif’in ve Yusuf Amca’nın parmağından birer damla kan: santrifüjde döndürülmüş iki kılcal tüp ve boyanmış bir yayma. Merceğimle bakabilirim.', 'A drop of blood from Elif’s and Uncle Yusuf’s fingers: two capillary tubes spun in the centrifuge, and a stained smear. I can look with my lens.') : tr('Elle çevrilen bir santrifüj, kılcal tüpler, lamlar. Yusuf Amca her yaz sağlık ocağına örnek götürürmüş.', 'A hand-cranked centrifuge, capillary tubes, slides. Uncle Yusuf takes samples to the clinic every summer.'));
  },
  async station() {
    await UI.say('player', tr('Tren bu hafta gelmedi. Tabelada “Yayla” yazıyor; oraya Kükürtlü Pınar’ın yanındaki patikadan yürüyerek de çıkılıyor.', 'The train didn’t come this week. The sign says “Yayla”; you can also walk up there by the path beside the Sulphur Spring.'));
    const r = WORLD.regions.yayla; W.waypoint = G.S.waypoint = { x: r.x, y: r.y }; UI.toast(T('j_waypoint', { p: L(r.name) }), '➶');
  },
  async tomatoes() {
    const f = G.S.flags.gardenFixed;
    await UI.say('player', f ? tr('Fideler dimdik, ilk domatesler kızarıyor. Damla sulamanın hortumu toprağın üstünde.', 'The seedlings stand tall and the first tomatoes are turning red. The drip hose lies on the soil.') : tr('Toprak ıslak ama yapraklar sarkık. Toprağın yüzünde beyaz lekeler var… Merceğimle yakından bakmalıyım.', 'The soil is wet but the leaves droop. There are white patches on the soil… I should take a closer look with my lens.'));
  },
  async pump() {
    await UI.say('player', G.S.flags.gardenFixed ? tr('Pompaya bir not asılmış: “BAHÇEYE DEĞİL!”', 'There’s a note hanging on the pump: “NOT FOR THE GARDEN!”') : tr('Kolu birkaç kez indirip kaldırdım: su berrak ve serin. Ama kovanın kenarında, kuruyan suyun bıraktığı beyaz bir halka var.', 'I work the handle a few times: the water is clear and cool. But round the bucket’s rim there’s a white ring where the water dried.'));
  },
  async osmo() {
    const S = G.S;
    if (!S.cases.well && Q.state('intro') === 'done') Q.open('well');
    if (Q.at('well', 'songul')) { await UI.say('player', tr('Altı bardak, bir terazi, bir patates ve bir mantar delici. Önce Songül Abla’yla konuşayım.', 'Six cups, a scale, a potato and a cork borer. Let me talk to Songül first.')); return; }
    OSMO.open();
  },
  async pellets() {
    await UI.say('player', G.S.flags.pelletDone ? tr('Baykuş kusmukları. Her biri bir gecenin avı.', 'Owl pellets. Each one is a night’s catch.') : tr('Gri, kıllı topaklar; içlerinden minik kemikler görünüyor. Dışkı değil bunlar: baykuşun sindiremediği kıl ve kemikleri ağzından attığı kusmuklar!', 'Grey, furry lumps with tiny bones poking out. They aren’t droppings: they’re pellets, the fur and bones an owl can’t digest, brought back up through its mouth!'));
  },
  async pelletkit() {
    const S = G.S;
    if (!S.cases.owl || Q.at('owl', 'riza')) { await UI.say('player', tr('Siyah bir tepsi, pens, büyüteç ve bir tanı anahtarı. Rıza Dede neden koymuş bunları buraya?', 'A black tray, forceps, a magnifier and an identification key. Why has Rıza Dede put these here?')); return; }
    if (Q.at('owl', 'look')) { await UI.say('player', tr('Önce baykuşun kendisine merceğimle bakayım: nasıl avlanıyor?', 'First let me look at the owl itself with my lens: how does it hunt?')); return; }
    PELLET.open();
  },
  async calor() {
    const S = G.S;
    if (!S.cases.azik) { await UI.say('player', tr('Bir teneke kutu, termometre, iğne batırılmış bir mantar ve bir kibrit kutusu. Nine’nin eski kalorimetresi! Kim kurmuş bunu buraya?', 'A tin can, a thermometer, a cork with a needle in it and a box of matches. Grandma’s old calorimeter! Who set this up here?')); return; }
    if (Q.at('azik', 'deniz')) { await UI.say('player', tr('Önce Alp’la konuşayım; bu düzeneği ne için kurmuşlar?', 'Let me talk to Alp first: what is this set-up for?')); return; }
    CALOR.open();
  },
  async slide() {
    const S = G.S;
    if (!S.cases.hucre) { await UI.say('player', tr('Nine’nin eski mikroskobu, lamlar, lameller, bir şişe iyot. Kahvehanenin masasında ne işi var bunların?', 'Grandma’s old microscope, slides, coverslips and a bottle of iodine. What are they doing on the teahouse table?')); return; }
    if (Q.at('hucre', 'mehmet')) { await UI.say('player', tr('Önce Mehmet Dede’yi dinleyeyim; neye itiraz ediyor?', 'Let me hear Mehmet Dede out first: what is he objecting to?')); return; }
    SLIDE.open();
  },
  async graft() {
    const S = G.S;
    if (!S.cases.asi) { await UI.say('player', tr('Bir bıçak, bir rulo aşı bandı, saksılarda genç fidanlar. Birisi aşı yapmaya hazırlanmış.', 'A knife, a roll of grafting tape and young saplings in pots. Someone is getting ready to graft.')); return; }
    if (Q.at('asi', 'huseyin')) { await UI.say('player', tr('Önce Hüseyin Usta’yla konuşayım.', 'Let me talk to Hüseyin Usta first.')); return; }
    if (Q.at('asi', 'look')) { await UI.say('player', tr('Hüseyin Usta önce merceğimle dala bakmamı istedi: aşının sırrı kabuğun altında.', 'Hüseyin Usta wanted me to look at the twig with my lens first: the secret is under the bark.')); return; }
    GRAFT.open();
  },
  async compostbin() {
    const S = G.S;
    if (!S.cases.kompost) { await UI.say('player', tr('Boş, tahta çıtalı bir kompost kasası; yanında bir çatal, bir kova ve uzun saplı bir termometre.', 'An empty compost bin made of wooden slats, with a fork, a bucket and a long-stemmed thermometer beside it.')); return; }
    if (Q.at('kompost', 'sevim')) { await UI.say('player', tr('Önce Sevim Hanım’la konuşayım.', 'Let me talk to Sevim first.')); return; }
    if (Q.at('kompost', 'look')) { await UI.say('player', tr('Önce merceğimle yığınların içine bakmalıyım: ısıyı ne yapıyor?', 'First I should look inside the heaps with my lens: what is making the heat?')); return; }
    COMPOST.open();
  },
  async sevimheap() {
    await UI.say('player', G.S.flags.compostFixed ? tr('Sevim Hanım’ın yığını karıştırılmış, arası saman dolu. İçinden hafif bir buğu yükseliyor.', 'Sevim’s heap has been turned and is full of straw. A faint steam is rising from it.') : tr('Yapış yapış, koyu yeşil bir çim yığını. Çürük yumurta ve amonyak kokuyor; sinekler dönüyor.', 'A sticky, dark green heap of grass. It smells of rotten eggs and ammonia, and flies are circling.'));
  },
  async rustsim() {
    const S = G.S;
    if (!S.cases.pas) { await UI.say('player', tr('Üstünde iki küçük tarla maketi ve bir pervane olan bir masa. Ziraat odasının etiketi var: “Rüzgâr masası”.', 'A table with two little model fields and a fan on it. It has the farmers’ office label: “Wind table”.')); return; }
    if (Q.at('pas', 'osman')) { await UI.say('player', tr('Önce Osman Amca’yla konuşayım.', 'Let me talk to Osman Amca first.')); return; }
    if (Q.at('pas', 'look')) { await UI.say('player', tr('Önce merceğimle paslı yapraklara bakmalıyım: bu turuncu toz ne?', 'First I should look at the rusty leaves with my lens: what is this orange dust?')); return; }
    RUST.open();
  },
  async rustplot() {
    await UI.say('player', G.S.flags.rustWise ? tr('Osman Amca paslı sapların arasına bir kazık çakmış, üstüne “GÜZE KARIŞIK” yazmış.', 'Osman Amca has driven a stake in among the rusty stalks and written “MIXED THIS AUTUMN” on it.') : tr('Buğdayın yaprakları sarı çizgili, üstleri turuncu tozla kaplı. Elimi sürünce parmağım turuncu oldu.', 'The wheat leaves have yellow stripes and are covered in orange dust. When I touched one, my finger turned orange.'));
  },
  async pollinate() {
    const S = G.S;
    if (!S.cases.kabak) { await UI.say('player', tr('Kâğıt torbalar, çamaşır mandalları, bir fırça ve boş etiketler. Biri çiçeklerle uğraşıyor.', 'Paper bags, clothes pegs, a brush and blank tags. Someone is busy with flowers.')); return; }
    if (Q.at('kabak', 'fatma')) { await UI.say('player', tr('Önce Fatma Teyze’yle konuşayım.', 'Let me talk to Fatma Teyze first.')); return; }
    if (Q.at('kabak', 'look')) { await UI.say('player', tr('Önce merceğimle çiçeklere bakmalıyım: polen nereye konuyor?', 'First I should look at the flowers with my lens: where does the pollen go?')); return; }
    POLL.open();
  },
  async squash() {
    await UI.say('player', G.S.flags.squashPure ? tr('Mandallı tomurcuklar, etiketli çiçekler. Etiketlerde Fatma Teyze’nin el yazısıyla “ELLE” yazıyor.', 'Clipped buds and tagged flowers. The tags say “HAND” in Fatma Teyze’s writing.') : tr('Kocaman yapraklar, sarı çiçekler. Bazı kabaklar tuhaf: küçük, siğilli ve çizgili. Merceğimle bakabilirim.', 'Huge leaves and yellow flowers. Some of the squash are odd: small, warty and striped. I could look with my lens.'));
  },
  async gourds() {
    await UI.say('player', tr('Komşunun çitine tırmanmış süs kabakları: sarı-yeşil çizgili, turuncu, beyaz. Yenmez ama çok güzel. Çiçekleri ata kabağınınkine tıpatıp benziyor.', 'Ornamental gourds climbing the neighbour’s fence: yellow and green stripes, orange, white. Not for eating, but lovely. Their flowers look exactly like the heirloom squash’s.'));
  },
  async brokenlimb() {
    await UI.say('player', G.S.flags.appleSaved ? tr('Fırtınanın kırdığı dal. Ama bu ağacın iki kopyası artık saksıda büyüyor.', 'The limb the storm broke. But two copies of this tree are growing in pots now.') : tr('Fırtınada kopan koca bir dal; elmaları hâlâ üstünde. Gövde ortasından yarılmış, içi kararmış.', 'A huge limb torn off in the storm, apples still on it. The trunk is split down the middle and blackened inside.'));
  },
  async sweep() {
    const S = G.S;
    if (!S.cases.leylek) { await UI.say('player', tr('Bir böcek ağı, beyaz bir tepsi ve kavanozlar. Birisi çayırdaki böcekleri sayıyor.', 'A sweep net, a white tray and some jars. Someone is counting the insects in the meadow.')); return; }
    if (Q.at('leylek', 'ayten')) { await UI.say('player', tr('Ayten Hanım’ın böcek ağı. Önce onunla konuşayım.', 'Ayten’s sweep net. Let me talk to her first.')); return; }
    SWEEP.open();
  },
  async storkbox() {
    await UI.say('player', Q.at('leylek', 'tell') ? tr('Yavru gagasını açmış, bağırıyor. Ayten Hanım’a ne bulduğumu anlatmalıyım.', 'The chick is gaping and calling. I must tell Ayten what I found.') : tr('Kutuda beyaz ince tüylü, kara gagalı bir leylek yavrusu. Göğüs kemiği tüylerin altından belli oluyor. Ayten Hanım ona kıyılmış balık veriyor.', 'In the box, a stork chick with fine white down and a black beak. Its breastbone shows under the fluff. Ayten is feeding it chopped fish.'));
  },
  async bp() {
    const S = G.S;
    if (!S.cases.tansiyon) { await UI.say('player', tr('Manşonlu, ibreli eski bir tansiyon aleti ve bir steteskop.', 'An old blood-pressure cuff with a dial gauge, and a stethoscope.')); return; }
    if (Q.at('tansiyon', 'zehra')) { await UI.say('player', tr('Önce Hemşire Zehra’yla konuşayım.', 'Let me talk to Nurse Zehra first.')); return; }
    BP.open();
  },
  async yogurtkit() {
    if (!G.S.cases.yogurt) { await UI.say('player', tr('Kavanozlar, bir termometre ve bir kâse yoğurt. Songül Abla’nın mutfak masası.', 'Jars, a thermometer and a bowl of yogurt. Songül’s kitchen table.')); return; }
    if (Q.at('yogurt', 'songul')) { await UI.say('player', tr('Önce Songül Abla’yla konuşayım.', 'Let me talk to Songül first.')); return; }
    YOGURT.open();
  },
  async serakit() {
    if (!G.S.cases.sera) { await UI.say('player', tr('Üç cam kavanoz, termometreler ve güçlü bir lamba.', 'Three glass jars, thermometers and a bright lamp.')); return; }
    if (Q.at('sera', 'deniz')) { await UI.say('player', tr('Önce Deniz’le konuşayım.', 'Let me talk to Deniz first.')); return; }
    SERA.open();
  },
  async hediyekit() {
    if (!G.S.cases.hediye) { await UI.say('player', tr('Nine’nin bahçe masası.', 'Grandma’s garden table.')); return; }
    if (Q.at('hediye', 'nazli')) { await UI.say('player', tr('Önce Nazlı Teyze’yle konuşayım.', 'Let me talk to Nazlı Teyze first.')); return; }
    HEDIYE.open();
  },
  async azotkit() {
    if (!G.S.cases.azot) { await UI.say('player', tr('Bir kürek ve tarla kenarında bir masa.', 'A spade and a table at the field edge.')); return; }
    if (Q.at('azot', 'osman')) { await UI.say('player', tr('Önce Osman Amca’yla konuşayım.', 'Let me talk to Osman Amca first.')); return; }
    AZOT.open();
  },
  async ekimkit() {
    if (!G.S.cases.ekim) { await UI.say('player', tr('Fatma Teyze’nin bahçe masası: tohum zarfları ve eski bir defter.', 'Fatma Teyze’s garden table: seed packets and an old notebook.')); return; }
    if (Q.at('ekim', 'fatma')) { await UI.say('player', tr('Önce Fatma Teyze’yle konuşayım.', 'Let me talk to Fatma Teyze first.')); return; }
    EKIM.open();
  },
  async etilenkit() {
    if (!G.S.cases.etilen) { await UI.say('player', tr('Kâğıt torbalar ve bir sepet elma.', 'Paper bags and a basket of apples.')); return; }
    if (Q.at('etilen', 'huseyin')) { await UI.say('player', tr('Önce Hüseyin Usta’yla konuşayım.', 'Let me talk to Hüseyin Usta first.')); return; }
    ETILEN.open();
  },
  async sindirimkit() {
    if (!G.S.cases.sindirim) { await UI.say('player', tr('Bir tüp rafı ve 37 °C’lik su banyosu.', 'A tube rack and a 37 °C water bath.')); return; }
    if (Q.at('sindirim', 'zehra')) { await UI.say('player', tr('Önce Hemşire Zehra’yla konuşayım.', 'Let me talk to Nurse Zehra first.')); return; }
    SINDIRIM.open();
  },
  async kilcalkit() {
    if (!G.S.cases.kilcal) { await UI.say('player', tr('Cam borular, bir bardak su ve bir sap kereviz.', 'Glass tubes, a glass of water and a celery stalk.')); return; }
    if (Q.at('kilcal', 'elif')) { await UI.say('player', tr('Önce Elif’le konuşayım.', 'Let me talk to Elif first.')); return; }
    KILCAL.open();
  },
  async kulkit() {
    if (!G.S.cases.kul) { await UI.say('player', tr('Deniz’in okul masası: birkaç kroze ve damla şişeleri.', 'Deniz’s school table: a few crucibles and dropper bottles.')); return; }
    if (Q.at('kul', 'deniz')) { await UI.say('player', tr('Önce Deniz’le konuşayım.', 'Let me talk to Deniz first.')); return; }
    KUL.open();
  },
  async zarkit() {
    if (!G.S.cases.zar) { await UI.say('player', tr('Bir kasa pancar ve bir tüp rafı.', 'A crate of beetroot and a tube rack.')); return; }
    if (Q.at('zar', 'songul')) { await UI.say('player', tr('Önce Songül Abla’yla konuşayım.', 'Let me talk to Songül first.')); return; }
    ZAR.open();
  },
  async notebook() {
    if (!G.S.cases.eksik) { await UI.say('player', tr('Hemşire Zehra’nın kalın, yıpranmış defteri. Her sayfada bir vitamin ya da mineral var.', 'Nurse Zehra’s thick, dog-eared notebook. Every page is about a vitamin or a mineral.')); return; }
    if (Q.at('eksik', 'zehra')) { await UI.say('player', tr('Önce Hemşire Zehra’yla konuşayım.', 'Let me talk to Nurse Zehra first.')); return; }
    EKSIK.open();
  },
  async heartmodel() {
    await UI.say('player', tr('Önü açılabilen plastik bir kalp modeli: sağ yarısı mavi, sol yarısı kırmızı boyanmış. Merceğimle yakından bakabilirim.', 'A plastic heart model whose front lifts off: its right half is painted blue, its left half red. I can take a closer look with my lens.'));
  },
  async cave() {
    if (!G.S.cases.spring && Q.state('intro') === 'done') Q.open('spring');
    await UI.say('player', TALK._rot('cave', [
      tr('Mağaradan sıcak, kükürt kokulu bir buhar geliyor. İçerisi karanlık ve boğucu; pınarın ağzı dışarıda, sağda.', 'Warm, sulphur-smelling steam drifts out of the cave. Inside it’s dark and stifling; the spring’s vent is outside, to the right.'),
      tr('Nehir burada, kayanın dibinde doğuyor. Denizli sıcak sularıyla ünlü: Pamukkale’nin bembeyaz travertenleri de yerin derinliğinden gelen böyle sıcak bir kaynağın eseri.', 'The river is born here, at the foot of the rock. Denizli is famous for its hot springs: the white terraces of Pamukkale were built by a hot spring rising from deep underground, just like this one.'),
    ]));
  },
  async hotspring() {
    if (!G.S.cases.spring && Q.state('intro') === 'done') Q.open('spring');
    await UI.say('player', G.S.flags.springTransect ? tr('Kaynakta 90 °C, akıntının ucunda 26 °C. Her renk bir sıcaklık, her sıcaklık başka bir canlı topluluğu.', 'At the vent 90 °C, at the end of the outflow 26 °C. Each colour is a temperature, and each temperature a different community of life.') : TALK._rot('hotspring', [
      tr('Su fokur fokur kaynıyor, çürük yumurta kokuyor. Akıntının rengi bant bant değişiyor. Merceğimle bakmalıyım.', 'The water is bubbling and smells of rotten eggs. The colour of the outflow changes band by band. I should look through my lens.'),
      tr('Elimi sokmayayım: kaynağın yanı haşlayacak kadar sıcak.', 'I won’t put my hand in: by the vent it’s hot enough to scald.'),
    ]));
  },
  thermo() { if (!G.S.cases.spring) Q.open('spring'); THERMO.open(); },
  germ() { if (!G.S.cases.seedbank) Q.open('seedbank'); GERM.open(); },
  async ledger() {
    if (!G.S.cases.seedbank) Q.open('seedbank', true);
    await KIT.ledger();
    if (Q.at('seedbank', 'ledger')) {
      await UI.say('player', tr('Önce masadaki dört tabakla başlayayım: su, hava, sıcaklık, ışık. Her seferinde tek bir şeyi değiştireceğim.', 'I’ll start with the four dishes on the bench: water, air, temperature, light. One change at a time.'));
      Q.adv('seedbank');
    }
  },
  async jars() {
    const l = G.S.germLots;
    await UI.talk([
      ['player', tr('Raf raf kavanoz: siyez 2019, kavılca 2016, nohut 2021, mercimek 2005… Bezelyeden üç kavanoz var: 2023, 2011 ve 1998.', 'Shelf after shelf of jars: siyez 2019, kavılca 2016, chickpea 2021, lentil 2005… There are three jars of pea: 2023, 2011 and 1998.')],
      ['player', l ? tr(`Deneyimin sonuçları etiketlerde: 2023 %${l['2023']}, 2011 %${l['2011']}, 1998 %${l['1998']}.`, `My results are on the labels: 2023 ${l['2023']}%, 2011 ${l['2011']}%, 1998 ${l['1998']}%.`) : tr('Her kavanozun dibinde bir kese silika jel: tohumu kuru tutuyor. Kuru tohum yavaş yaşlanır.', 'At the bottom of each jar is a sachet of silica gel keeping the seed dry. Dry seed ages slowly.')],
    ]);
  },
  async coldbox() {
    await UI.talk([
      ['player', tr('Soğuk dolap: eksi 18 derece. Kapağında Nine’nin yazısı: “Önce kurut, sonra dondur!”', 'The cold cabinet: minus 18 degrees. On the lid in Grandma’s writing: “Dry first, then freeze!”')],
      ['player', tr('Mantıklı. Islak tohum donarsa hücrelerindeki su buz kristaline dönüşüp zarları yırtar. Kurutulmuş tohum ise soğukta onlarca yıl uyuyabilir.', 'Makes sense. If a wet seed freezes, the water in its cells turns into ice crystals that tear the membranes. A dried seed can sleep in the cold for decades.')],
    ]);
  },
  rig() { if (!G.S.cases.light) Q.open('light'); RIG.open(); },
  async mendel() {
    if (Q.state('light') !== 'done' && !G.S.cases.mendel) { await UI.say('player', tr('Masada iki kavanoz bezelye ve Nine’nin notu var: “Önce seradaki fideleri kurtar.”', "Two jars of peas on the bench, and a note from Grandma: 'Save the seedlings in the greenhouse first.'")); return; }
    if (!G.S.cases.mendel) { Q.open('mendel'); give('pea_round'); give('pea_wrinkled'); }
    MENDEL.open();
  },
  async trays() {
    const S = G.S;
    if (!S.cases.light) Q.open('light');
    if (Q.at('light', 'look')) {
      await UI.talk([
        ['player', tr('Fideler upuzun ve soluk; sanki ışığa uzanmaya çalışıyorlar. Tepede yeşil lambalar yanıyor.', "The seedlings are tall and pale, as if they're stretching towards the light. Green lamps are glowing overhead.")],
        ['player', tr('Işığın rengi fark eder mi? Tahmin etmek yerine ölçeyim: deney masasında su bitkisi ve lambalar var.', "Does the colour of light matter? Better to measure than guess: the bench has a water plant and lamps.")],
      ]);
      Q.adv('light');
      return;
    }
    if (Q.at('light', 'fix')) {
      const i = await UI.choose('player', tr('Sera lambalarını ne yapayım?', 'What should I do with the greenhouse lamps?'), [tr('Yeşil kalsın', 'Keep them green'), tr('Kırmızı + mavi yap', 'Switch to red + blue'), tr('Tamamen kapat', 'Turn them off')]);
      if (i === 1) {
        S.flags.lightsSet = true;
        AU.sfx('success');
        await UI.say('player', tr('Kırmızı ve mavi: klorofilin en iyi emdiği renkler. Sera pembe bir ışıkla doldu.', 'Red and blue: the colours chlorophyll absorbs best. The greenhouse fills with a pinkish glow.'));
        Q.adv('light');
      } else await UI.say('player', i === 0 ? tr('Deneyim yeşilin en kötüsü olduğunu gösterdi…', 'My experiment showed green was the worst…') : tr('Kışın ışıksız kalırlarsa fideler hiç büyümez.', "Without light in winter, the seedlings won't grow at all."));
      return;
    }
    await UI.say('player', S.flags.lightsSet ? tr('Fideler koyu yeşil ve tıknaz. Pembe ışığın altında mutlu görünüyorlar.', 'The seedlings are dark green and sturdy. They look happy under the pink light.') : tr('Soluk, cılız fideler.', 'Pale, spindly seedlings.'));
  },
  async peabed() {
    const S = G.S;
    if (Q.at('mendel', 'plant')) { S.mendel.bed = 'F1'; AU.sfx('dig'); await UI.say('player', tr('F1 tohumlarını ektim. Bir mevsim sonra kendi kendilerini tozlaştırıp bakla verecekler.', "I've sown the F1 seeds. In a season they'll self-pollinate and make pods.")); Q.adv('mendel'); return; }
    if (Q.at('mendel', 'count')) { await MENDEL.count(); return; }
    await UI.say('player', S.mendel.bed === 'grown' ? tr('Bezelyeler çiçek açmış; baklalar dolgun.', 'The peas are in flower and the pods are plump.') : S.mendel.bed ? tr('Filizler çıkıyor.', 'Shoots are coming up.') : tr('Boş bir bezelye yatağı. Nine’nin notu: “Mendel için.”', "An empty pea bed. Grandma's note: 'For Mendel.'"));
  },
  async willow() {
    const S = G.S;
    if (!S.cases.willow) Q.open('willow');
    if (Q.at('willow', 'note')) { await KIT.willowNote(); Q.adv('willow'); return; }
    if (Q.at('willow', 'dig')) {
      if (!await UI.confirm(tr('Söğüdü köklerini koparmadan saksıdan çıkarayım mı?', 'Lift the willow out of the pot without tearing the roots?'), L(tr('Çıkar', 'Lift it')))) return;
      AU.sfx('dig'); S.flags.willowDug = true; ART.invalidate();
      await UI.say('player', tr('Kökleri toprağı sımsıkı sarmış. Şimdi ikisini de kurutup tartmalıyım.', 'The roots are wrapped tight around the soil. Now I need to dry both and weigh them.'));
      Q.adv('willow');
      return;
    }
    if (Q.at('willow', 'weigh')) {
      const done = await KIT.scale();
      if (!done) return;
      await ask('willow');
      await UI.say('player', tr('Bunu Alp’a anlatmalıyım. Ama önce kanıt lazım: söğüdün yaprağına merceğimle bakayım.', "I have to tell Alp. But I need evidence first: let me look at a willow leaf through my lens."));
      Q.adv('willow');
      return;
    }
    await UI.say('player', tr('Nine’nin söğüdü. Merceğimle yaprağına bakabilirim.', "Grandma's willow. I can look at its leaves through my lens."));
  },
  async mailbox() {
    const S = G.S;
    if (Q.at('festival', 'letter')) {
      if (S.flags.mail === 'fest_invite') S.flags.mailNew = false;
      AU.sfx('page'); await KIT.postcard(MAIL.fest_invite);
      Q.adv('festival'); Q._festWorld(); G.save();
      return;
    }
    if (S.flags.mailNew && S.flags.mail && MAIL[S.flags.mail]) { S.flags.mailNew = false; AU.sfx('page'); await KIT.postcard(MAIL[S.flags.mail]); G.save(); return; }
    await UI.say('player', tr('Posta kutusu boş.', 'The mailbox is empty.'));
  },
  async field(id) {
    const S = G.S, f = S.fields[id];
    if (Q.at('leaves', 'test') && S.flags.soilKit) {
      const tested = await KIT.soil(id);
      if (tested && id === 'B' && Q.at('leaves', 'test')) {
        await ask('nitrogen');
        Q.adv('leaves');
        if (!S.cases.pond) Q.open('pond');
      }
      return;
    }
    if (Q.at('leaves', 'plan') && id === 'B') {
      const i = await UI.choose('player', tr('B tarlası için ne yapayım?', 'What should I do with field B?'), [
        tr('Suni azotlu gübre at: hızlı yeşerir.', 'Spread chemical nitrogen fertiliser: fast green-up.'),
        tr('Kompost karıştır; hasattan sonra nohut ek.', 'Mix in compost, then sow chickpeas after the harvest.'),
        tr('Hiçbir şey yapma, bekle.', 'Do nothing and wait.'),
      ]);
      f.plan = ['fert', 'both', null][i];
      await UI.say('player', [tr('Gübre torbaları kulübede. Yağmur yağarsa fazlası nereye gider acaba?', 'The fertiliser sacks are in the shed. If it rains, I wonder where the extra goes?'), tr('Kompost yavaş çalışır ama toprağı besler. Nohudun kökleri de azot kazandıracak.', 'Compost works slowly but it feeds the soil, and the chickpea roots will add nitrogen.'), tr('Belki kendiliğinden düzelir…', 'Maybe it will sort itself out…')][i]);
      Q.adv('leaves');
      return;
    }
    const crop = { wheat: tr('siyez buğdayı', 'siyez wheat'), chickpea: tr('nohut', 'chickpeas'), fallow: tr('nadasa bırakılmış', 'left fallow') }[f.crop];
    await UI.say('player', L(tr(`${id} tarlası: `, `Field ${id}: `)) + L(crop) + (f.yellow ? L(tr('. Alt yapraklar sararmış.', '. The lower leaves are yellow.')) : '.'));
  },
  async shed() {
    const S = G.S;
    if (Q.at('leaves', 'kit')) { S.flags.soilKit = true; AU.sfx('collect'); UI.toast(T('got_item', { i: L(tr('Toprak test seti', 'Soil test kit')) }), '⚗'); Q.adv('leaves'); return; }
    await UI.say('player', tr('Kürekler, tırmıklar, gübre torbaları ve bir toprak test seti.', 'Shovels, rakes, fertiliser sacks and a soil test kit.'));
  },
  async compost() {
    await UI.say('player', TALK._rot('compost', [
      tr('Kompost yığını ılık ve buğulu. İçeride mikroplar ve mantarlar çalışıyor; sıcaklık 60 °C’ye kadar çıkabilir.', 'The compost heap is warm and steaming. Microbes and fungi are at work inside; it can reach 60 °C.'),
      tr('Yaprak, sap, gübre: ayrıştırıcılar hepsini humusa çevirir ve azot toprağa döner.', 'Leaves, stalks, manure: decomposers turn it all into humus, and the nitrogen goes back into the soil.'),
    ]));
  },
  async pond() {
    const S = G.S;
    if (!S.cases.pond) Q.open('pond');
    if (Q.at('pond', 'test')) {
      if (!await KIT.water()) return;
      await ask('eutro');
      await UI.say('player', tr('Fazla besin bir yerden geliyor olmalı. Nehir tarlaların yanından akıyor…', "The extra nutrients must be coming from somewhere. The river flows past the fields…"));
      Q.adv('pond');
      W.waypoint = G.S.waypoint = { x: 1560, y: 2090 };
      return;
    }
    await UI.say('player', S.pond.algae > 45 ? tr('Su yeşil ve bulanık, çürük yumurta gibi kokuyor.', 'The water is green and murky and smells like rotten eggs.') : tr('Su berrak. Kıyıda kurbağalar var.', 'The water is clear. There are frogs on the bank.'));
    if (Q.at('pond', 'look')) UI.toast(L(tr('Önce göletin suyuna merceğinle bak (Büyüteç düğmesi ya da L tuşu).', 'First look at the pond water through your lens (the magnifier button or the L key).')), '🔍');
  },
  async runoff() {
    const S = G.S;
    if (Q.at('pond', 'trace')) {
      await UI.talk([
        ['player', tr('Tarlalardan inen bir hendek var. Suyu yeşilimsi ve köpüklü; doğrudan nehre dökülüyor.', 'There’s a ditch coming down from the fields. Its water is greenish and foamy, and it pours straight into the river.')],
        ['player', S.flags.usedFert ? tr('Gübre kokusu… Tarlaya attığım gübrenin fazlası yağmurla buraya akmış.', 'It smells of fertiliser… the extra from my field has washed down here with the rain.') : tr('Tarlaların gübresi yağmurla buraya akıyor. Kıyıda suyu süzecek hiçbir bitki yok.', "Fertiliser from the fields washes down here with the rain. There are no plants on the bank to filter it.")],
      ]);
      Q.adv('pond');
      return;
    }
    if (Q.at('pond', 'fix')) {
      if (!await UI.confirm(tr('Tarla ile nehir arasına söğüt çelikleri ve saz dikeyim mi? Kökleri suyu süzer, besinleri tutar.', 'Plant willow cuttings and reeds between the field and the river? Their roots filter the water and hold on to nutrients.'), L(tr('Dik', 'Plant')))) return;
      S.buffer = true; AU.sfx('dig'); ART.invalidate();
      await UI.say('player', tr('Tampon şerit hazır. Şimdi zaman lazım: bir mevsim bekleyelim.', 'The buffer strip is in. Now it needs time: let’s wait a season.'));
      Q.adv('pond');
      return;
    }
    await UI.say('player', S.buffer ? tr('Sazlar ve genç söğütler kıyıyı tutuyor.', 'Reeds and young willows hold the bank.') : tr('Nehir kıyısı.', 'The riverbank.'));
  },
  async closed(place) {
    const txt = {
      clinic: tr('Veteriner Ayten’in muayenehanesi. Camdan bir inek iskeleti ve kocaman bir mide modeli görünüyor.', "Ayten the vet's practice. Through the window: a cow skeleton and a huge stomach model."),
      cave: tr('Kükürt kokusu… Sıcak bir pınar. Burada güneş ışığı olmadan, kimyasal enerjiyle yaşayan bakteriler var.', 'A smell of sulphur… a warm spring. Bacteria live here on chemical energy, with no sunlight at all.'),
      halt: tr('Tren haftada bir uğrar. Tabelada “Yayla · Tohum Bankası” yazıyor.', "The train stops once a week. The sign says 'Yayla · Seed Bank'."),
    }[place];
    await UI.say('player', txt);
    UI.toast(T('coming'), '⌛');
  },
  async hives() {
    await UI.say('player', G.S.season === 3 ? tr('Arılar kovanda salkım olup birbirini ısıtarak kışı geçiriyor.', 'The bees are clustered in the hive, keeping each other warm through the winter.') : TALK._rot('hives', [
      tr('Kovanlar vızıldıyor. Merceğimle bir arıya bakabilirim.', 'The hives are buzzing. I can look at a bee through my lens.'),
      tr('Bir arı ömründe bir çay kaşığının onda biri kadar bal yapar.', 'A bee makes about a tenth of a teaspoon of honey in its whole life.'),
    ]));
  },
  async fountain() {
    AU.sfx('splash');
    await UI.say('player', tr('Taş çeşmenin üstünde bir kitabe: “Hayrat, 1893.” Su buz gibi.', "An inscription on the stone fountain: 'A gift to all, 1893.' The water is ice cold."));
  },
  async sign(p) {
    const opts = p.to.map(k => WORLD.regions[k].name);
    const i = await UI.choose('player', tr('Tabela. Pusulayı nereye çevireyim?', 'A signpost. Where should my compass point?'), opts.concat([tr('Hiçbir yere', 'Nowhere')]));
    if (i < p.to.length) { const r = WORLD.regions[p.to[i]]; W.waypoint = G.S.waypoint = { x: r.x, y: r.y }; UI.toast(T('j_waypoint', { p: L(r.name) }), '➶'); }
  },
};

// ================================================================ field kits: letter, note, scale, soil test, water test, postcard
const KIT = {
  letter() {
    return new Promise(res => {
      const S = G.S;
      const text = L(tr(
        `Sevgili torunum,

Bu mektubu okuyorsan ben Rize’de, teyzenin yanındayım. Dizim iyileşene kadar vadi sana emanet.

Son yıllarda vadi soldu. Gölet kokuyor, kurbağalar sustu, tarladaki siyez sararıyor. Köylüler “kuraklık” diyor ama bence her solgunluğun bir sebebi var ve sebepler canlıların içinde saklı.

Masadaki pirinç merceği al. Babamdan kaldı; neye tutarsan içini gösterir. Ne görürsen defterime yaz. Bilmediğin bir şeye “bilmiyorum” demekten korkma, bilim oradan başlar.

Kapının yanındaki saksıda bir söğüt var. 2021 baharında diktim; toprağı da fidanı da tartıp not ettim. Beş yıl oldu. Bir de sen tart.

Rıza Dede, Alp ve Veteriner Ayten sana yardım eder.

Seni çok seven,
Nebahat Nine

Not: Leylekler bu bahar da okulun damına döndü. Onlara selam söyle.`,
        `My dear grandchild,

If you're reading this, I'm in Rize with your aunt. Until my knee heals, the valley is in your hands.

The valley has faded these last years. The pond smells, the frogs have gone quiet, the siyez in the field is turning yellow. The villagers say 'drought', but I think every fading has a cause, and the causes are hidden inside living things.

Take the brass lens on the desk. It was my father's; whatever you hold it over, it shows you the inside. Write down everything you see in my journal. Don't be afraid to write 'I don't know': that's where science begins.

There's a willow in the pot by the door. I planted it in the spring of 2021 and weighed both the soil and the sapling. It's been five years. Weigh them again.

Rıza Dede, Alp and Ayten the vet will help you.

With all my love,
Grandma Nebahat

P.S. The storks came back to the school roof again this spring. Say hello to them for me.`));
      const body = h('div', 'letter-paper hand', text.split('\n\n').map(p => `<p>${U.esc(p).replace(/\n/g, '<br>')}</p>`).join(''));
      const pn = UI.panel({ title: tr('Nine’nin mektubu', "Grandma's letter"), body, cls: 'letter', onClose: async () => {
        S.flags.letterRead = true; S.flags.gotLens = true; S.flags.gotJournal = true;
        ART.invalidate();
        UI.toast(T('got_item', { i: L(tr('Pirinç mercek', 'Brass lens')) }), '◎');
        setTimeout(() => UI.toast(T('got_item', { i: L(tr('Nine’nin defteri', "Grandma's journal")) }), '✎'), 700);
        Q.adv('intro');
        Q.open('willow', true);
        Q.later(() => UI.notice(tr('Pirinç mercek', 'The brass lens'), tr('Mercek düğmesi (ya da L): merceği aç ve bir canlının üstüne getir. Merceğe dokununca İnceleme masası açılır: numaralı her parçaya dokun, büyütülür ve anlatılır. Bir katmandaki her şeyi inceleyince tekrar soruları gelir.', 'The lens button (or L) opens the lens; hold it over something alive. Tap the lens to open the specimen table: tap each numbered part to enlarge it and read about it. Once you have explored everything on a layer, review questions follow.'), 'item'));
        G.save(); res();
      } });
      AU.sfx('page');
    });
  },
  willowNote() {
    return new Promise(res => {
      const body = h('div', 'note-card hand', L(tr('<b>Söğüt deneyi</b><br>Nisan 2021<br><br>Fırında kurutulmuş toprak: <u>90,00 kg</u><br>Söğüt fidanı: <u>2,30 kg</u><br><br>Saksının ağzını tel örgüyle kapattım: toz girmesin. Sadece yağmur suyu vereceğim.<br><br>2026’da ikisini de yeniden tart. — N.', "<b>Willow experiment</b><br>April 2021<br><br>Oven-dried soil: <u>90.00 kg</u><br>Willow sapling: <u>2.30 kg</u><br><br>I've covered the pot with wire mesh so no dust gets in. Rainwater only.<br><br>Weigh both again in 2026. — N.")));
      UI.panel({ title: tr('Saksıdaki not', 'The note on the pot'), body, cls: 'note', onClose: res });
      AU.sfx('page');
    });
  },
  // the festival quiz: one question per solved case, the one this player found hardest, asked by the villager it belongs to
  async festQuiz() {
    const S = G.S, solved = CASE_ORDER.filter(k => k !== 'intro' && k !== 'festival' && Q.state(k) === 'done');
    const hard = id => { const a = S.answers.filter(x => x.q === id); return a.length ? (a[0].ok ? 1 : 0) + Math.min(a.length, 9) * 0.01 : 0.5; };
    let pick = [];
    for (const c of solved) { const qs = Object.keys(QS).filter(id => QS[id].case === c).sort((a, b) => hard(a) - hard(b)); if (qs.length) pick.push(qs[0]); }
    // straight into the festival from a teacher link: any case will do
    if (!pick.length) pick = Object.keys(QS).filter(id => QS[id].case && QS[id].case !== 'intro');
    pick = pick.sort((a, b) => hard(a) - hard(b)).slice(0, 6);
    await UI.talk([
      ['deniz', tr('Hoş geldiniz, hoş geldiniz! Hasat Şenliği Bilgi Yarışması başlıyor!', 'Welcome, welcome! The Harvest Festival Quiz is starting!')],
      ['deniz', tr(`Soruları köylülerimiz soracak. ${pick.length} soru var; alkışlar yarışmacımıza!`, `Our villagers will ask the questions. There are ${pick.length} of them; a round of applause for our contestant!`)],
    ]);
    let right = 0;
    for (const id of pick) { const n0 = S.answers.length; await ask(id); const a = S.answers[n0]; if (a && a.ok) { right++; AU.sfx('success'); } }
    S.flags.festScore = [right, pick.length];
    const n = pick.length;
    await UI.talk([
      ['deniz', right === n ? tr(`${n} sorunun hepsi doğru! Vay be!`, `All ${n} right! Wow!`) : tr(`${n} sorudan ${right} doğru! Alkışlar!`, `${right} out of ${n} right! Applause!`)],
      ['nebahat', right >= n - 1 ? tr('Defterini iyi tutmuşsun, torunum.', 'You kept your journal well, my dear.') : tr('Yanlışlar da öğretir. Hangisini yanlış bildiysen, bir daha merceğinle bak.', 'Mistakes teach too. Whatever you got wrong, go and look again with your lens.')],
    ]);
  },
  // the seed swap: every packet goes to a villager
  swap() {
    return new Promise(res => {
      const S = G.S, sh = S.flags.shared || (S.flags.shared = {}), ids = S.journal.seeds.filter(id => SEEDS[id]), need = Math.min(3, ids.length);
      const who = ['riza', 'nazli', 'ayten', 'elder1', 'elder2', 'deniz', 'nebahat'];
      const lines = [
        tr('Bunu tarlama ekerim; hasadından sana da getiririm.', 'I’ll sow this in my field and bring you some of the harvest.'),
        tr('Babamın ektiği tohumun aynısı! Nerede buldun?', 'The very seed my father used to sow! Where did you find it?'),
        tr('Komşu köye de götüreyim; onlarınki kurudu.', 'I’ll take some to the next village too; theirs dried out.'),
        tr('Tohumu satın alma: sakla ve paylaş. Nebahat hep böyle der.', 'Don’t buy seed: keep it and share it. Nebahat always says so.'),
      ];
      let done = false, pn = null;
      const body = h('div', 'swap');
      const draw = () => {
        const n = ids.filter(id => sh[id]).length;
        body.innerHTML = `<p class="kit-msg">${L(tr('Her paket bir köylüye gider. Tohum saklanarak değil, ekilip paylaşılarak yaşar.', 'Each packet goes to a villager. Seed lives by being sown and shared, not by being hoarded.'))}</p>
          <div class="swap-grid">${ids.map(id => `<div class="packet ${sh[id] ? 'done' : ''}" style="--tint:${SEEDS[id].tint}"><i></i><b>${U.esc(L(SEEDS[id].name))}</b><small>${U.esc(SEEDS[id].latin)}</small><button data-id="${id}">${sh[id] ? '✓ ' + L(tr('Paylaşıldı', 'Shared')) : L(tr('Paylaş', 'Share'))}</button></div>`).join('')}</div>
          <div class="swap-foot"><span>${L(tr(`${n} paket paylaşıldı`, `${n} packets shared`))}</span><button class="big fin" ${n >= need ? '' : 'disabled'}>${L(tr('Takası bitir', 'Finish the swap'))}</button></div>`;
        body.querySelectorAll('.packet button').forEach(b => b.onclick = () => {
          const id = b.dataset.id; if (sh[id]) return;
          sh[id] = true; AU.sfx('collect');
          const k = ids.filter(x => sh[x]).length - 1;
          UI.toast(`${speakerName(who[k % who.length])}: “${L(lines[k % lines.length])}”`, '✿');
          draw();
        });
        body.querySelector('.fin').onclick = () => { done = true; if (pn) pn.close(); };
      };
      draw();
      pn = UI.panel({ title: tr('Tohum takası', 'Seed swap'), body, wide: true, cls: 'swappanel', onClose: () => { G.save(); res(done); } });
    });
  },
  // the last page: a certificate with the player's own numbers
  certificate() {
    return new Promise(res => {
      const S = G.S, main = CASE_ORDER.filter(k => k !== 'intro' && k !== 'festival'), solved = main.filter(k => Q.state(k) === 'done').length;
      const ans = S.answers.length, first = ans ? Math.round(S.answers.filter(a => a.ok).length / ans * 100) : 0;
      const tags = new Set(S.answers.filter(a => a.tag).map(a => a.tag)).size, fs = S.flags.festScore;
      const cell = (n, t) => `<div class="cert-n"><b>${n}</b><span>${U.esc(L(t))}</span></div>`;
      const body = h('div', 'cert', `<div class="cert-seal">✿</div>
        <p class="cert-k">${L(tr('Denizli', 'Denizli'))}</p>
        <h2>${L(tr('Tohum Bekçisi Belgesi', 'Seedkeeper Certificate'))}</h2>
        <p class="cert-name hand">${U.esc(S.name || L(tr('Nebahat’in torunu', 'Nebahat’s grandchild')))}</p>
        <p class="cert-t">${L(tr('vadideki her solgunluğun sebebini canlıların içinde aradığı, ölçtüğü ve bulduklarını paylaştığı için bu belgeyi almaya hak kazanmıştır.', 'has earned this certificate for looking for the cause of every fading in the valley inside living things, measuring it, and sharing what they found.'))}</p>
        <div class="cert-grid">${cell(solved + '/' + main.length, tr('vaka çözüldü', 'cases solved'))}${cell(Object.keys(S.journal.obs).length + '/' + Object.keys(OBS).length, tr('yapı incelendi', 'structures studied'))}${cell(S.journal.exps.length, tr('deney kaydedildi', 'experiments recorded'))}${cell(S.journal.seeds.length + '/' + Object.keys(SEEDS).length, tr('tohum toplandı', 'seeds collected'))}${cell('%' + first, tr('ilk denemede doğru', 'right first time'))}${cell(tags, tr('yanılgıyla yüzleşildi', 'misconceptions faced'))}</div>
        ${fs ? `<p class="cert-t">${L(tr(`Şenlik yarışması: ${fs[1]} sorudan ${fs[0]} doğru.`, `Festival quiz: ${fs[0]} of ${fs[1]} right.`))}</p>` : ''}
        <p class="cert-sig hand">Nebahat Nine</p>`);
      UI.panel({ title: tr('Belge', 'Certificate'), body, cls: 'certpanel', onClose: res });
      AU.sfx('success');
    });
  },
  // Ayten's metal detector over Sarıkız's left side: the beeps quicken near the nail
  DET: { s: 3, ox: 260, oy: 250 },
  _detSig() {
    const d = this.det, D = this.DET, body = ACT.cowBody(0).map(([x, y]) => [D.ox + x * D.s, D.oy + y * D.s]);
    if (!U.inPoly(d.x, d.y, body)) return 0;
    const r = Math.hypot(d.x - d.t[0], d.y - d.t[1]);
    return Math.exp(-r * r / (2 * 17 * 17));
  },
  detector() {
    return new Promise(res => {
      const D = this.DET, body = h('div', 'kit detector');
      body.innerHTML = `<canvas width="920" height="520"></canvas><div class="det-row"><p class="kit-msg">${L(tr('Dedektörü Sarıkız’ın sol yanında gezdir. Sinyal güçlenip ses sıklaşınca “İşaretle”ye bas.', 'Move the detector along Sarıkız’s left side. When the signal is strong and the beeps come fast, press “Mark”.'))}</p><button class="big mark">${L(tr('İşaretle', 'Mark'))}</button></div>`;
      const cv = body.querySelector('canvas'), msg = body.querySelector('.kit-msg');
      const d = this.det = { x: 400, y: 60, t: [D.ox - 28 * D.s, D.oy - 34 * D.s], found: false, beep: 0, sig: 0, marks: [], t0: performance.now() };
      const move = e => { const r = cv.getBoundingClientRect(); d.x = (e.clientX - r.left) / r.width * 460; d.y = (e.clientY - r.top) / r.height * 260; };
      cv.onpointermove = move; cv.onpointerdown = move;
      body.querySelector('.mark').onclick = () => {
        if (d.found) return;
        d.sig = this._detSig();
        if (d.sig > 0.72) {
          d.found = true; AU.sfx('success'); body.querySelector('.mark').disabled = true;
          msg.textContent = L(tr('Buldun! Çivi börkeneğin ön duvarında. Diyaframın öbür yanında kalp var.', 'Found it! The nail is in the front wall of the reticulum. On the other side of the diaphragm is the heart.'));
          setTimeout(() => pn.close(), 2400);
        } else {
          d.marks.push([d.x, d.y]); AU.sfx('wrong');
          msg.textContent = L(d.sig > 0.3 ? tr('Yaklaştın ama tam burası değil: ses daha da sıklaşmalı.', 'Close, but not quite: the beeps should come even faster.') : tr('Burada metal yok. Börkenek karnın en önünde ve alçakta.', 'No metal here. The reticulum is at the very front of the belly, low down.'));
        }
        this._detDraw(cv);
      };
      const pn = UI.panel({ title: tr('Metal dedektörü', 'Metal detector'), code: 'BİY.10.1.5', body, wide: true, cls: 'rigpanel', onClose: () => res(d.found) });
      let last = performance.now();
      const tick = now => {
        if (pn.closed) return;
        const dt = U.clamp((now - last) / 1000, 0, 0.05); last = now;
        d.sig = this._detSig();
        if (!d.found && d.sig > 0.02) { d.beep -= dt; if (d.beep <= 0) { AU.sfx('beep', { f: 900 + d.sig * 1000 }); d.beep = 0.62 - d.sig * 0.54; } }
        this._detDraw(cv, now / 1000);
        requestAnimationFrame(tick);
      };
      this._detDraw(cv); requestAnimationFrame(tick);
    });
  },
  _detDraw(cv, t = 0) {
    const x = cv.getContext('2d'), d = this.det, D = this.DET, S = D.s, P = ([px, py]) => [D.ox + px * S, D.oy + py * S];
    x.setTransform(2, 0, 0, 2, 0, 0);
    // the barn: planks behind, straw underfoot
    x.fillStyle = MX.lin(x, 0, 0, 0, 260, [[0, '#8A6A48'], [0.72, '#6E5236'], [0.73, '#C8B07A'], [1, '#B09868']]); x.fillRect(0, 0, 460, 260);
    x.strokeStyle = 'rgba(40,24,10,0.35)'; x.lineWidth = 1; for (let k = 0; k < 460; k += 23) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k, 187); x.stroke(); }
    x.strokeStyle = 'rgba(120,96,50,0.5)'; x.lineWidth = 0.7; for (let k = 0; k < 90; k++) { const sx = U.hash(k, 1, 4) * 460, sy = 192 + U.hash(k, 2, 4) * 66, a = U.hash(k, 3, 4) * 3; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(a) * 9, sy + Math.sin(a) * 3); x.stroke(); }
    // Sarıkız, left side
    x.fillStyle = 'rgba(30,20,10,0.25)'; x.beginPath(); x.ellipse(D.ox, D.oy + 2, 150, 9, 0, 0, TAU); x.fill();
    for (const [lx] of ACT.cowLegs(0, false)) { x.fillStyle = '#C9A55A'; x.fillRect(D.ox + (lx - 3.5) * S, D.oy - 24 * S, 7 * S, 24 * S); x.fillStyle = '#3A3028'; x.fillRect(D.ox + (lx - 3.5) * S, D.oy - 3 * S, 7 * S, 3 * S); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.2; x.strokeRect(D.ox + (lx - 3.5) * S, D.oy - 24 * S, 7 * S, 24 * S); }
    const body = ACT.cowBody(0).map(P), head = ACT.cowHead(0).map(P);
    x.fillStyle = '#DDB966'; x.beginPath(); U.path(x, body, true); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.6; x.stroke();
    x.fillStyle = '#F2E8D2'; for (const [px, py, rx, ry] of [[20, -42, 11, 7], [-4, -30, 8, 5]]) { const [qx, qy] = P([px, py]); x.beginPath(); x.ellipse(qx, qy, rx * S, ry * S, 0.2, 0, TAU); x.fill(); }
    x.fillStyle = '#DDB966'; x.beginPath(); U.path(x, head, true); x.fill(); x.stroke();
    const [ex, ey] = P([-55, -46]); x.fillStyle = '#1B1A17'; x.beginPath(); x.arc(ex, ey, 2.2, 0, TAU); x.fill();
    const [hx, hy] = P([-44, -54]); x.strokeStyle = '#E8E0CC'; x.lineWidth = 3; x.beginPath(); x.moveTo(hx, hy); x.quadraticCurveTo(hx + 4, hy - 16, hx + 14, hy - 18); x.stroke();
    const [tx, ty] = P([48, -48]); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(tx, ty); x.quadraticCurveTo(tx + 14, ty + 30, tx + 8, ty + 70); x.stroke();
    // once found: a window into her side
    if (d.found) {
      x.save(); x.globalAlpha = 0.85;
      x.strokeStyle = '#A0322A'; x.lineWidth = 1.2; x.setLineDash([4, 3]); const dia = [P([-31, -55]), P([-33, -40]), P([-30, -24])]; x.beginPath(); x.moveTo(dia[0][0], dia[0][1]); x.quadraticCurveTo(dia[1][0], dia[1][1], dia[2][0], dia[2][1]); x.stroke(); x.setLineDash([]);
      const [rx, ry] = P([-24, -33]); x.fillStyle = 'rgba(200,145,58,0.8)'; x.beginPath(); x.ellipse(rx, ry, 8 * S, 6.5 * S, 0, 0, TAU); x.fill(); x.strokeStyle = '#1B1A17'; x.lineWidth = 1; x.stroke();
      const [kx, ky] = P([-38, -42]); x.fillStyle = 'rgba(179,68,59,0.85)'; x.beginPath(); x.ellipse(kx, ky, 5 * S, 6 * S, 0.3, 0, TAU); x.fill(); x.stroke();
      const [n0x, n0y] = P([-23, -30]), [n1x, n1y] = P([-36, -40]); x.strokeStyle = '#2A3038'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(n0x, n0y); x.lineTo(n1x, n1y); x.stroke();
      x.restore();
      const tag = (s, px, py) => { x.font = '700 9px "Courier Prime", monospace'; const w = x.measureText(s).width + 8; x.fillStyle = '#F4EEDD'; x.fillRect(px - w / 2, py - 7, w, 13); x.strokeStyle = '#1B1A17'; x.lineWidth = 0.8; x.strokeRect(px - w / 2, py - 7, w, 13); x.fillStyle = '#1B1A17'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, px, py); };
      tag(L(tr('BÖRKENEK', 'RETICULUM')), rx + 10, ry + 34); tag(L(tr('KALP', 'HEART')), kx - 14, ky - 30); tag(L(tr('DİYAFRAM', 'DIAPHRAGM')), dia[0][0] + 10, dia[0][1] - 12);
    }
    for (const [mx, my] of d.marks) { x.strokeStyle = 'rgba(40,30,20,0.7)'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(mx - 4, my - 4); x.lineTo(mx + 4, my + 4); x.moveTo(mx + 4, my - 4); x.lineTo(mx - 4, my + 4); x.stroke(); }
    // the signal meter
    x.fillStyle = '#F4EEDD'; x.fillRect(338, 10, 112, 58); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.2; x.strokeRect(338, 10, 112, 58);
    x.strokeStyle = '#1B1A17'; x.lineWidth = 1; x.beginPath(); x.arc(394, 60, 38, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
    x.strokeStyle = '#A0322A'; x.lineWidth = 3; x.beginPath(); x.arc(394, 60, 38, Math.PI * 1.72, Math.PI * 1.9); x.stroke();
    const s = d.found ? 1 : d.sig, na = Math.PI * (1.12 + 0.76 * U.clamp(s + Math.sin(t * 23) * 0.02 * s, 0, 1));
    x.strokeStyle = '#1B1A17'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(394, 60); x.lineTo(394 + Math.cos(na) * 34, 60 + Math.sin(na) * 34); x.stroke();
    x.fillStyle = '#1B1A17'; x.font = '700 8px "Courier Prime", monospace'; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillText(L(tr('SİNYAL', 'SIGNAL')), 344, 22);
    // the detector: a coil on a stick
    if (!d.found) {
      x.strokeStyle = '#3A3430'; x.lineWidth = 3; x.beginPath(); x.moveTo(d.x + 9, d.y + 9); x.lineTo(d.x + 44, d.y + 58); x.stroke();
      x.fillStyle = s > 0.72 ? '#E0402A' : s > 0.3 ? '#E8B030' : '#6E9A4A'; x.beginPath(); x.arc(d.x + 30, d.y + 38, 3, 0, TAU); x.fill();
      x.strokeStyle = '#1B1A17'; x.lineWidth = 3.2; x.beginPath(); x.ellipse(d.x, d.y, 14, 12, 0, 0, TAU); x.stroke();
      x.strokeStyle = '#C8A24E'; x.lineWidth = 1.4; x.beginPath(); x.ellipse(d.x, d.y, 11, 9, 0, 0, TAU); x.stroke();
      if (s > 0.05) { x.strokeStyle = `rgba(224,64,42,${(s * 0.8).toFixed(2)})`; x.lineWidth = 1.2; const k = (t * 2) % 1; x.beginPath(); x.ellipse(d.x, d.y, 14 + k * 14, 12 + k * 12, 0, 0, TAU); x.stroke(); }
    }
  },
  ledger() {
    return new Promise(res => {
      const body = h('div', 'note-card hand', L(tr('<b>Denizli Tohum Bankası</b><br>1987’den beri<br><br>Her kavanoz bir köyün, bir tarlanın hatırası. Kuru ve serin tutarsan tohum yıllarca uyur. Ama sonsuza dek değil!<br><br><u>Kural:</u> Her kavanozdan on tohumu nemli kâğıda koy, bir hafta bekle, say. Ondan en az dokuzu çimlenmeli (%85). Daha azsa o tohumu hemen ek, yetiştir, kavanozu tazele.<br><br>Önce tohumun neye ihtiyacı olduğunu kendin bul: masada dört tabak var. Her seferinde tek bir şeyi değiştir.<br><br>Bezelye kavanozlarına, özellikle 1998’e çok geç kalmış olabilirim. — N.', '<b>Denizli Seed Bank</b><br>since 1987<br><br>Every jar is the memory of a village, of a field. Keep seed dry and cool and it sleeps for years. But not forever!<br><br><u>The rule:</u> Put ten seeds from each jar on moist paper, wait a week, count. At least nine should sprout (85%). If fewer do, sow that seed at once, grow it and refill the jar.<br><br>First find out for yourself what a seed needs: there are four dishes on the bench. Change one thing at a time.<br><br>I may be very late with the pea jars, especially 1998. — N.')));
      UI.panel({ title: tr('Nine’nin defteri', 'Grandma’s ledger'), body, cls: 'note', onClose: res });
      AU.sfx('page');
    });
  },
  postcard(text) {
    return new Promise(res => {
      const body = h('div', 'letter-paper hand', `<p>${U.esc(L(text))}</p>`);
      UI.panel({ title: tr('Nine’den kartpostal', 'A postcard from Grandma'), body, cls: 'letter', onClose: res });
    });
  },
  // the willow scale: needle dial + precise readout
  scale() {
    return new Promise(res => {
      const S = G.S, body = h('div', 'kit scale');
      body.innerHTML = `<canvas width="840" height="520"></canvas>
        <div class="kit-ctrl"><button class="big" data-w="tree">${L(tr('Söğüdü tart', 'Weigh the willow'))}</button><button class="big" data-w="soil">${L(tr('Toprağı kurut ve tart', 'Dry and weigh the soil'))}</button></div>
        <table class="exp-table"><tr><th></th><th>2021</th><th>2026</th><th>${L(tr('Fark', 'Change'))}</th></tr>
        <tr data-r="tree"><td>${L(tr('Söğüt', 'Willow'))}</td><td>2,30 kg</td><td>?</td><td>?</td></tr>
        <tr data-r="soil"><td>${L(tr('Toprak (kuru)', 'Soil (dry)'))}</td><td>90,00 kg</td><td>?</td><td>?</td></tr></table>`;
      const cv = body.querySelector('canvas'), x = cv.getContext('2d');
      const vals = { tree: 76.70, soil: 89.94 }, done = {};
      let needle = 0, target = 0, vel = 0, what = null, raf = 0;
      const draw = () => {
        // drawn at twice its 420 x 260 size, so the dial's numbers stay sharp when the board shows it big
        const w = 420, hh = 260, cx = w / 2, cy = 170, R = 120;
        x.setTransform(2, 0, 0, 2, 0, 0); x.clearRect(0, 0, w, hh);
        x.fillStyle = '#E8DCC0'; x.fillRect(0, 0, w, hh);
        x.fillStyle = '#6E5A44'; x.fillRect(cx - 150, 220, 300, 26); x.strokeStyle = '#1B1A17'; x.lineWidth = 1.5; x.strokeRect(cx - 150, 220, 300, 26);
        x.fillStyle = '#F4EEDD'; x.beginPath(); x.arc(cx, cy, R, Math.PI, 0); x.closePath(); x.fill(); x.stroke();
        x.font = '700 11px "Courier Prime", monospace'; x.fillStyle = '#1B1A17'; x.textAlign = 'center';
        for (let k = 0; k <= 100; k += 5) { const a = Math.PI + k / 100 * Math.PI, r0 = k % 10 ? R - 10 : R - 18; x.beginPath(); x.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); x.stroke(); if (k % 20 === 0) x.fillText(k, cx + Math.cos(a) * (R - 30), cy + Math.sin(a) * (R - 30) + 4); }
        const a = Math.PI + needle / 100 * Math.PI;
        x.strokeStyle = '#A0322A'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * (R - 8), cy + Math.sin(a) * (R - 8)); x.stroke();
        x.fillStyle = '#1B1A17'; x.beginPath(); x.arc(cx, cy, 6, 0, TAU); x.fill();
        x.fillStyle = '#1B1A17'; x.fillRect(cx - 70, cy + 12, 140, 30);
        x.fillStyle = '#9FE0A0'; x.font = '700 18px "Courier Prime", monospace';
        x.fillText(what ? U.num(Math.abs(needle - target) < 0.05 ? target : needle, 2) + ' kg' : '— kg', cx, cy + 33);
        x.fillStyle = '#1B1A17'; x.font = '600 12px "Atkinson Hyperlegible Next", sans-serif';
        x.fillText(what === 'tree' ? L(tr('söğüt (kökleriyle)', 'willow (with roots)')) : what === 'soil' ? L(tr('kurutulmuş toprak', 'dried soil')) : L(tr('kefe boş', 'the pan is empty')), cx, 26);
      };
      const tick = () => {
        vel += (target - needle) * 0.03; vel *= 0.86; needle += vel;
        draw();
        if (Math.abs(vel) > 0.005 || Math.abs(target - needle) > 0.005) raf = requestAnimationFrame(tick);
        else { needle = target; draw(); if (what && !done[what]) finish(what); }
      };
      const finish = k => {
        done[k] = true;
        const row = body.querySelector(`[data-r="${k}"]`).children, old = k === 'tree' ? 2.3 : 90, d = vals[k] - old;
        row[2].textContent = U.num(vals[k], 2) + ' kg'; row[3].textContent = (d > 0 ? '+' : '−') + U.num(Math.abs(d), 2) + ' kg';
        row[3].classList.add(d > 0 ? 'up' : 'down');
        AU.sfx('stamp');
        if (done.tree && done.soil) {
          S.journal.exps.push({ title: tr('Söğüt deneyi (Van Helmont)', 'Willow experiment (Van Helmont)'), code: 'BİY.10.1.3', t: Date.now(),
            head: [tr('', ''), tr('2021', '2021'), tr('2026', '2026'), tr('Fark', 'Change')],
            rows: [[tr('Söğüt', 'Willow'), '2,30 kg', '76,70 kg', '+74,40 kg'], [tr('Toprak', 'Soil'), '90,00 kg', '89,94 kg', '−0,06 kg']],
            note: tr('Ağaç 74 kg’dan fazla kazandı, toprak yalnızca 60 g kaybetti!', 'The tree gained over 74 kg; the soil lost only 60 g!') });
          G.save();
          setTimeout(() => pn.close(), 1600);
        }
      };
      body.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { if (done[b.dataset.w]) return; what = b.dataset.w; target = vals[what]; AU.sfx('clatter'); b.disabled = true; cancelAnimationFrame(raf); tick(); });
      const pn = UI.panel({ title: tr('Kantar', 'The scales'), code: 'BİY.10.1.3', body, wide: true, onClose: () => { cancelAnimationFrame(raf); res(!!(done.tree && done.soil)); } });
      draw();
    });
  },
  // soil test: reagent → colour → match it against the chart
  soil(id) {
    return new Promise(res => {
      const S = G.S, f = S.fields[id];
      const lvl = n => n < 20 ? 0 : n < 40 ? 1 : n < 60 ? 2 : n < 80 ? 3 : 4;
      const levels = { N: lvl(f.n), P: { A: 2, B: 2, C: 3, D: 2 }[id], K: { A: 3, B: 3, C: 3, D: 4 }[id] };
      const cols = { N: ['#F4EDEA', '#EFC7CF', '#E49AAE', '#CF6A8C', '#A83C6A'], P: ['#EEF1F2', '#C9DCEB', '#98BEDD', '#5E93C4', '#2E5E9A'], K: ['#F6F1DC', '#EEE3B0', '#E3CF80', '#D1B650', '#B89A30'] };
      const names = { N: tr('Azot (N)', 'Nitrogen (N)'), P: tr('Fosfor (P)', 'Phosphorus (P)'), K: tr('Potasyum (K)', 'Potassium (K)') };
      const words = [tr('çok az', 'very low'), tr('az', 'low'), tr('orta', 'medium'), tr('yeterli', 'good'), tr('bol', 'high')];
      const body = h('div', 'kit soil');
      body.innerHTML = `<p class="kit-intro">${L(tr(`${id} tarlasından bir avuç toprak aldın. Tüpe su ve bir ayıraç ekle, rengini karttakiyle eşleştir.`, `You've taken a handful of soil from field ${id}. Add water and a reagent to the tube, then match its colour to the chart.`))}</p>
        <div class="kit-row"><div class="tube"><div class="liquid"></div><div class="sediment"></div></div>
        <div class="kit-ctrl"><div class="reagents">${['N', 'P', 'K'].map(k => `<button data-n="${k}">${L(names[k])}</button>`).join('')}</div>
        <div class="chart"></div><div class="kit-msg"></div></div></div>
        <table class="exp-table"><tr><th>${L(tr('Besin', 'Nutrient'))}</th><th>${L(tr('Sonuç', 'Result'))}</th></tr>${['N', 'P', 'K'].map(k => `<tr data-r="${k}"><td>${L(names[k])}</td><td>—</td></tr>`).join('')}</table>`;
      const liq = body.querySelector('.liquid'), chart = body.querySelector('.chart'), msg = body.querySelector('.kit-msg'), got = {};
      let cur = null;
      body.querySelectorAll('[data-n]').forEach(b => b.onclick = () => {
        cur = b.dataset.n; AU.sfx('bubble');
        body.querySelectorAll('[data-n]').forEach(x => x.classList.toggle('on', x === b));
        liq.style.transition = 'none'; liq.style.background = '#EDEBE4'; void liq.offsetWidth;
        liq.style.transition = 'background 1.8s ease'; liq.style.background = cols[cur][levels[cur]];
        chart.innerHTML = cols[cur].map((c, i) => `<button class="sw" data-i="${i}" style="background:${c}"><small>${L(words[i])}</small></button>`).join('');
        msg.textContent = L(tr('Tüpün rengi karttaki hangi renge benziyor?', 'Which colour on the chart matches the tube?'));
        chart.querySelectorAll('.sw').forEach(s => s.onclick = () => {
          const i = +s.dataset.i;
          if (i !== levels[cur]) { AU.sfx('wrong'); msg.textContent = L(i < levels[cur] ? tr('Tekrar bak: tüp bundan daha koyu.', 'Look again: the tube is darker than that.') : tr('Tekrar bak: tüp bundan daha açık.', 'Look again: the tube is lighter than that.')); return; }
          AU.sfx('pen'); got[cur] = i;
          body.querySelector(`[data-r="${cur}"]`).children[1].textContent = L(words[i]);
          msg.textContent = L(tr('Kaydedildi.', 'Recorded.'));
          if (got.N != null && got.P != null && got.K != null) finish();
        });
      });
      let recorded = false;
      const finish = () => {
        if (recorded) return; recorded = true;
        f.tested = true;
        S.journal.exps.push({ title: tr(`Toprak testi · ${id} tarlası`, `Soil test · field ${id}`), code: 'BİY.10.2.4', t: Date.now(), head: [tr('Besin', 'Nutrient'), tr('Sonuç', 'Result')], rows: ['N', 'P', 'K'].map(k => [names[k], words[got[k]]]),
          note: got.N <= 1 ? tr('Azot düşük! Fosfor ve potasyum yeterli.', 'Nitrogen is low! Phosphorus and potassium are fine.') : tr('Besinler dengeli.', 'Nutrients look balanced.') });
        G.save();
        msg.textContent = L(tr('Test tamam, defterine yazıldı.', 'Test complete and written in your journal.'));
        setTimeout(() => pn.close(), 1300);
      };
      const pn = UI.panel({ title: tr('Toprak test seti', 'Soil test kit'), code: 'BİY.10.2.4', body, wide: true, onClose: () => res(got.N != null) });
    });
  },
  // water test: nitrate strip, dissolved-oxygen drops, thermometer
  water() {
    return new Promise(res => {
      const S = G.S, P = S.pond;
      const nitrate = Math.round(P.nitrate * 0.9), dox = Math.max(1, Math.round(P.oxygen / 10)), temp = [14, 23, 13, 4][S.season];
      const scale = [0, 10, 25, 50, 100], stripCol = ['#F5F0EE', '#F0D0DA', '#E3A0B8', '#C8648E', '#9A2E62'];
      const near = scale.reduce((b, v, i) => Math.abs(v - nitrate) < Math.abs(scale[b] - nitrate) ? i : b, 0);
      const body = h('div', 'kit water');
      body.innerHTML = `<p class="kit-intro">${L(tr('Kıyıdan bir şişe su aldın. Üç test yap.', "You've filled a bottle at the shore. Run three tests."))}</p>
        <div class="tests">
          <div class="test" data-t="n"><h4>${L(tr('Nitrat şeridi', 'Nitrate strip'))}</h4><div class="strip"><i></i></div><div class="chart">${scale.map((v, i) => `<button class="sw" data-i="${i}" style="background:${stripCol[i]}"><small>${v}</small></button>`).join('')}</div><small class="unit">mg/L</small></div>
          <div class="test" data-t="o"><h4>${L(tr('Çözünmüş oksijen', 'Dissolved oxygen'))}</h4><div class="vial"><i></i></div><button class="drop">${L(tr('Bir damla ekle', 'Add a drop'))}</button><small class="drops">0</small></div>
          <div class="test" data-t="t"><h4>${L(tr('Sıcaklık', 'Temperature'))}</h4><div class="thermo"><i></i></div><button class="dip">${L(tr('Suya daldır', 'Dip it in'))}</button><small class="temp">— °C</small></div>
        </div><div class="kit-msg"></div>`;
      const got = {}, msg = body.querySelector('.kit-msg');
      const check = () => {
        if (got.n == null || got.o == null || got.t == null) return;
        S.pond.tested = true;
        S.journal.exps.push({ title: tr('Gölet suyu testi', 'Pond water test'), code: 'BİY.10.2.6', t: Date.now(), head: [tr('Test', 'Test'), tr('Sonuç', 'Result'), tr('Sağlıklı gölet', 'Healthy pond')],
          rows: [[tr('Nitrat', 'Nitrate'), scale[got.n] + ' mg/L', '< 10 mg/L'], [tr('Çözünmüş oksijen', 'Dissolved oxygen'), got.o + ' mg/L', '> 5 mg/L'], [tr('Sıcaklık', 'Temperature'), got.t + ' °C', '—']],
          note: tr('Nitrat çok yüksek, oksijen balıklar için fazla düşük.', 'Nitrate is far too high and oxygen is too low for fish.') });
        G.save();
        msg.textContent = L(tr('Üç test tamam, defterine yazıldı.', 'All three tests done and written in your journal.'));
        setTimeout(() => pn.close(), 1500);
      };
      const strip = body.querySelector('.strip i');
      setTimeout(() => { strip.style.background = stripCol[near]; }, 400);
      body.querySelectorAll('[data-t="n"] .sw').forEach(s => s.onclick = () => {
        if (got.n != null) return;
        const i = +s.dataset.i;
        if (i !== near) { AU.sfx('wrong'); msg.textContent = L(tr('Şeridin rengine tekrar bak.', "Look at the strip's colour again.")); return; }
        got.n = i; AU.sfx('pen'); s.classList.add('on'); msg.textContent = L(tr(`Nitrat ≈ ${scale[i]} mg/L. Sağlıklı bir gölette genellikle 10’un altındadır.`, `Nitrate ≈ ${scale[i]} mg/L. In a healthy pond it is usually below 10.`)); check();
      });
      let drops = 0;
      const vial = body.querySelector('.vial i');
      body.querySelector('.drop').onclick = () => {
        if (got.o != null) return;
        drops++; AU.sfx('bubble');
        body.querySelector('.drops').textContent = drops;
        vial.style.background = drops >= dox ? '#F4F4EE' : U.mix('#C89A4A', '#F4F4EE', drops / dox * 0.6);
        if (drops >= dox) { got.o = dox; msg.textContent = L(tr(`Renk açıldı: ${dox} damla = ${dox} mg/L oksijen. Balıklar için 5’in üstü gerekir.`, `The colour cleared: ${dox} drops = ${dox} mg/L of oxygen. Fish need more than 5.`)); AU.sfx('pen'); check(); }
      };
      body.querySelector('.dip').onclick = () => {
        if (got.t != null) return;
        AU.sfx('splash');
        body.querySelector('.thermo i').style.height = (20 + temp * 2.4) + '%';
        setTimeout(() => { got.t = temp; body.querySelector('.temp').textContent = temp + ' °C'; AU.sfx('pen'); check(); }, 900);
      };
      const pn = UI.panel({ title: tr('Su test çantası', 'Water test kit'), code: 'BİY.10.2.6', body, wide: true, onClose: () => res(got.n != null && got.o != null && got.t != null) });
    });
  },
};
