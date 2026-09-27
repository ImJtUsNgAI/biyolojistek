'use strict';
// The Cross-Section Lens: a brass magnifier that shows the inside of living things in wall-chart style.
// Level 0 of an animal is an X-ray aligned to the animal itself; deeper levels are chart plates.
const C = {
  ground: '#EFE9DA', ink: '#1B1A17', muscle: '#B3443B', organ: '#C8913A', rumen: '#6E8F4E', rumenL: '#A9BC7F', vessel: '#2F5E8C',
  bone: '#E9E1CC', skin: '#F6F1E4', pink: '#E3A69A', plant: '#5E8F3E', plantL: '#9CC06A', cell: '#DDE8C0', water: '#BFD8DC',
  soil: '#8A6A48', yellow: '#D9C35A', purple: '#7A5A9A', fat: '#F2E2B0', blue: '#8FB3D0',
};

// [id, title tr, title en, text tr, text en, curriculum code]
const OBS_RAW = [
  ['cow_rumen', 'İşkembe (rumen)', 'Rumen', 'Midenin en büyük bölmesi: 150 litreye kadar alır. İçindeki mikroplar otu mayalar (fermantasyon).', 'The biggest compartment, holding up to about 150 litres. Microbes inside ferment the grass.', 'BİY.10.1.5'],
  ['cow_reticulum', 'Börkenek (reticulum)', 'Reticulum', 'Duvarı bal peteği gibi. Ağır parçaları (bazen yutulmuş çivileri!) tutar, lokmayı geviş için yukarı yollar.', 'Its wall looks like a honeycomb. It catches heavy bits (sometimes swallowed nails!) and sends the cud back up.', 'BİY.10.1.5'],
  ['cow_omasum', 'Kırkbayır (omasum)', 'Omasum', 'Kitap sayfası gibi katlanmış duvarlar sudan ve minerallerden bir kısmını emer. Sağ tarafta durur.', 'Walls folded like the pages of a book absorb some water and minerals. It sits on the right side.', 'BİY.10.1.5'],
  ['cow_abomasum', 'Şirden (abomasum)', 'Abomasum', 'Asıl mide: bizimki gibi asit ve sindirim enzimi salgılar. Sağ tarafta, karnın altında.', 'The “true” stomach: it makes acid and digestive enzymes, like ours. Right side, low in the belly.', 'BİY.10.1.5'],
  ['cow_esophagus', 'Yemek borusu', 'Oesophagus', 'İki yönlü çalışır: otu işkembeye indirir, geviş getirirken lokmayı ağza geri çıkarır.', 'It works both ways: it carries grass down to the rumen and brings the cud back up to be chewed again.', 'BİY.10.1.5'],
  ['cow_intestine', 'Bağırsaklar', 'Intestines', 'Besin monomerlerinin çoğu burada emilip kana geçer.', 'Most food monomers are absorbed into the blood here.', 'BİY.10.1.5'],
  ['cow_lung', 'Akciğer', 'Lung', 'Pembe ve süngerimsi, küçük loblara bölünmüş. Kalbin üstünde, göğsün sırt tarafını doldurur.', 'Pink and spongy, divided into small lobules. It fills the upper chest above the heart.', 'BİY.11.2.7'],
  ['cow_heart', 'Kalp', 'Heart', 'Kalp zarının içinde, göğsün alt tarafında, dirseklerin arasında. Ucu diyaframa ve börkeneğe doğru bakar.', 'Inside its sac, low in the chest between the elbows. Its tip points back towards the diaphragm and the reticulum.', 'BİY.11.2.6'],
  ['cow_diaphragm', 'Diyafram', 'Diaphragm', 'Göğüs ile karın arasındaki kubbe biçimli kas. Ortası parlak, sert bir kiriştir.', 'The dome of muscle between the chest and the belly. Its centre is a shiny sheet of tendon.', 'BİY.11.2.7'],
  ['cow_spleen', 'Dalak', 'Spleen', 'İşkembenin sol üst yüzüne yapışık, yassı, mor-mavi bir organ.', 'A flat, bluish-purple organ lying on the upper left surface of the rumen.', 'BİY.11.2.6'],
  ['cow_liver', 'Karaciğer', 'Liver', 'En büyük bez. İnekte işkembe onu tamamen sağ tarafa itmiştir. Altında yeşil safra kesesi asılı.', 'The largest gland. In a cow the rumen has pushed it entirely to the right side. The green gall bladder hangs beneath it.', 'BİY.10.1.5'],
  ['cow_kidney', 'Böbrek', 'Kidney', 'Belin altında, yağa gömülü. İneğin böbreği üzüm salkımı gibi loplara bölünmüştür.', 'Under the loin, embedded in fat. A cow’s kidney is divided into lobes like a bunch of grapes.', 'BİY.9.2.8'],
  ['cow_colon', 'Sarmal kolon', 'Spiral colon', 'Kalın bağırsağın bir bölümü, düz bir disk gibi kendi üstüne sarılmıştır.', 'Part of the large intestine, wound up on itself like a flat disc.', 'BİY.10.1.5'],
  ['reticulum_crests', 'Petek gözleri', 'Honeycomb cells', 'Börkeneğin iç duvarındaki altıgen gözler; kenarlarında küçük sivri çıkıntılar var.', 'The hexagonal cells of the reticulum’s inner wall, their rims set with little points.', 'BİY.10.1.5'],
  ['reticular_groove', 'Börkenek oluğu', 'Reticular groove', 'Yemek borusunun ağzından kırkbayıra uzanan iki kalın, kaslı dudak.', 'Two thick, muscular lips running from the end of the oesophagus to the omasum.', 'BİY.10.1.5'],
  ['omasal_laminae', 'Kırkbayır yaprakları', 'Omasal leaves', 'Dört ayrı boyda yaklaşık yüz ince yaprak; yüzleri küçük sivriliklerle pürüzlü.', 'About a hundred thin leaves in four sizes, their faces rough with small horny points.', 'BİY.10.1.5'],
  ['abomasal_folds', 'Sarmal kıvrımlar', 'Spiral folds', 'Şirdenin kırmızımsı, parlak iç yüzeyindeki büyük, yumuşak kıvrımlar.', 'Large, soft folds on the reddish, glistening inner surface of the abomasum.', 'BİY.10.1.5'],
  ['rumen_gas', 'Gaz tabakası', 'Gas cap', 'Mayalanmadan çıkan karbondioksit ve metan. İnek bunu geğirerek dışarı atar.', 'Carbon dioxide and methane from fermentation. The cow gets rid of it by burping.', 'BİY.10.1.9'],
  ['rumen_fiber', 'Lif yatağı', 'Fibre mat', 'Yarı sindirilmiş ot keçesi. Mikroplar en çok burada çalışır.', 'A floating felt of half-digested grass. Microbes work hardest here.', 'BİY.10.1.5'],
  ['rumen_fluid', 'İşkembe sıvısı', 'Rumen fluid', 'Mikrop dolu bir çorba: bir damlasında milyarlarca bakteri var.', 'A microbial soup: one drop holds billions of bacteria.', 'BİY.10.1.5'],
  ['rumen_papillae', 'Papillalar', 'Papillae', 'Duvardaki parmak gibi çıkıntılar yüzeyi büyütür; mikropların ürettiği yağ asitleri buradan kana geçer. İneğin asıl enerjisi bu.', 'Finger-like bumps enlarge the wall’s surface. Fatty acids made by the microbes pass into the blood here. This is the cow’s main energy.', 'BİY.10.1.5'],
  ['rumination', 'Geviş getirme', 'Chewing the cud', 'Lokma ağza geri gelir ve yeniden çiğnenir. Parçalar küçüldükçe mikroplar daha hızlı çalışır.', 'The cud comes back up and is chewed again. The smaller the pieces, the faster the microbes work.', 'BİY.10.1.5'],
  ['rumen_foam', 'Hapsolmuş köpük', 'Trapped foam', 'Taze yonca köpüklü bir mayalanma yapar: gaz kabarcıklara hapsolur, inek geğiremez. Bu şişkinliktir.', 'Fresh clover ferments into a stable froth. The gas gets trapped in bubbles and the cow can’t burp it out. That is bloat.', 'BİY.10.1.9'],
  ['cellulose', 'Selüloz', 'Cellulose', 'Bitki hücre çeperinin ana maddesi. İnek onu kendi enzimleriyle parçalayamaz; mikroplar parçalar.', 'The main material of plant cell walls. A cow cannot break it down with its own enzymes. Microbes do it.', 'BİY.10.1.5'],
  ['rumen_bacteria', 'Bakteriler', 'Bacteria', 'Selülozu parçalayıp yağ asitlerine çeviren asıl işçiler.', 'The main workers: they break cellulose into fatty acids.', 'BİY.10.1.9'],
  ['rumen_protozoa', 'Siliyalılar', 'Ciliates', 'Tüylü (sil’li) tek hücreli ökaryotlar; bakteri ve nişasta yerler.', 'Hairy (ciliated) single-celled eukaryotes. They eat bacteria and starch.', 'BİY.9.1.6'],
  ['rumen_fungi', 'Anaerob mantarlar', 'Anaerobic fungi', 'Uzun iplikleriyle sert bitki liflerini delip açarlar.', 'Their long threads pierce and open up tough plant fibres.', 'BİY.9.1.6'],
  ['methanogen', 'Metan üreten arkeler', 'Methane-making archaea', 'Ne bakteri ne ökaryot: üçüncü üst âlem, Archaea. Hidrojeni metana çevirirler.', 'Neither bacteria nor eukaryotes: the third domain, Archaea. They turn hydrogen into methane.', 'BİY.9.1.6'],
  ['dog_stomach', 'Tek bölmeli mide', 'Single-chambered stomach', 'Karabaş etçil: midesi tek bölmeli ve asitli, proteini hızla sindirir. Otu mayalayacak bir mikrop odası yok.', 'Karabaş is a carnivore: one acidic chamber that digests protein fast. There is no microbe chamber for fermenting grass.', 'BİY.10.1.5'],
  ['dog_small_int', 'İnce bağırsak', 'Small intestine', 'Sindirimin çoğu ve emilim burada olur.', 'Most digestion and absorption happen here.', 'BİY.10.1.5'],
  ['dog_large_int', 'Kısa kalın bağırsak', 'Short large intestine', 'Etçillerde kısadır: et hızlı sindirilir, uzun bir mayalanma odasına gerek yoktur.', 'Short in carnivores: meat digests quickly, so no long fermentation chamber is needed.', 'BİY.10.1.5'],
  ['dog_esophagus', 'Tek yönlü yemek borusu', 'One-way oesophagus', 'Köpek geviş getirmez; lokma yalnızca aşağı iner.', 'Dogs do not chew the cud. Food only goes down.', 'BİY.10.1.5'],
  ['gastric_gland', 'Mide bezleri', 'Gastric glands', 'Hidroklorik asit ve pepsinojen salgılar; pepsin proteinleri parçalar.', 'They release hydrochloric acid and pepsinogen. Pepsin breaks proteins apart.', 'BİY.10.1.5'],
  ['gastric_mucus', 'Mukus tabakası', 'Mucus layer', 'Midenin kendi asidinde sindirilmesini önler.', 'Stops the stomach from digesting itself in its own acid.', 'BİY.10.1.5'],
  ['stomach_muscle', 'Kas katmanları', 'Muscle layers', 'Üç yönde kasılarak besini karıştırır.', 'They contract in three directions to churn the food.', 'BİY.9.2.8'],
  ['sheep_rumen', 'Koyunun işkembesi', "The sheep's rumen", 'Koyun da geviş getirir: midesi ineğinki gibi dört bölmelidir.', 'Sheep chew the cud too: four compartments, just like the cow.', 'BİY.10.1.5'],
  ['sheep_tail', 'Yağlı kuyruk', 'Fat tail', 'Anadolu koyunları kuyrukta yağ depolar: kıtlık günleri için enerji.', 'Anatolian sheep store fat in their tails: energy for lean times.', 'BİY.10.1.10'],
  ['hen_crop', 'Kursak', 'Crop', 'Yutulan tahıl önce burada bekler ve yumuşar.', 'Swallowed grain waits and softens here first.', 'BİY.10.1.5'],
  ['hen_gizzard', 'Taşlık', 'Gizzard', 'Dişi olmayan tavuk, yuttuğu küçük taşlarla tahılı bu kaslı odada öğütür.', 'Hens have no teeth: this muscular chamber grinds grain with swallowed grit.', 'BİY.10.1.5'],
  ['bird_airsac', 'Hava keseleri', 'Air sacs', 'Akciğerlere bağlı keseler sayesinde hava tek yönde akar: uçuş için bol oksijen.', 'Sacs linked to the lungs keep air flowing one way: plenty of oxygen for flight.', 'BİY.11.2.7'],
  ['bird_keel', 'Göğüs kemiği ve uçuş kasları', 'Keel and flight muscles', 'Göğüs kemiğindeki çıkıntıya bağlı büyük kaslar kanadı çırpar. Leylekler Afrika’dan binlerce kilometre uçar.', 'Huge muscles anchored to the keel flap the wings. Storks fly thousands of kilometres from Africa.', 'BİY.11.1.9'],
  ['hollow_bone', 'İçi boş kemik', 'Hollow bone', 'İçi destek çubuklarıyla güçlendirilmiş hafif kemik.', 'A light bone braced inside by thin struts.', 'BİY.11.1.9'],
  ['frog_skin', 'Kurbağa derisi', 'Frog skin', 'İnce ve nemli: kurbağa derisinden de solunum yapar. Kirli su onu hemen etkiler.', 'Thin and moist: frogs also breathe through their skin, so dirty water hits them first.', 'BİY.11.2.7'],
  ['frog_lung', 'Kese akciğerler', 'Sac-like lungs', 'Basit keseler; derideki solunuma yardım eder.', 'Simple sacs that help the breathing done by the skin.', 'BİY.11.2.7'],
  ['frog_heart', 'Üç odalı kalp', 'Three-chambered heart', 'İki kulakçık ve bir karıncık.', 'Two atria and one ventricle.', 'BİY.11.2.6'],
  ['fish_gills', 'Solungaçlar', 'Gills', 'Sudaki çözünmüş oksijeni kana geçiren ince tabakalar.', 'Thin plates that pass oxygen dissolved in the water into the blood.', 'BİY.11.2.7'],
  ['swim_bladder', 'Yüzme kesesi', 'Swim bladder', 'Gaz dolu kese: balığın yüzmeden asılı kalmasını sağlar.', 'A gas-filled sac that lets the fish hover without swimming.', 'BİY.9.2.8'],
  ['fish_heart', 'İki odalı kalp', 'Two-chambered heart', 'Bir kulakçık ve bir karıncık: kanı solungaçlara pompalar.', 'One atrium and one ventricle that pump blood to the gills.', 'BİY.11.2.6'],
  ['algae_bloom', 'Alg patlaması', 'Algal bloom', 'Fazla azot ve fosfor algleri hızla çoğaltır: ötrofikasyon başlar.', 'Too much nitrogen and phosphorus makes algae multiply fast: eutrophication begins.', 'BİY.10.2.6'],
  ['pond_oxygen', 'Oksijen', 'Oxygen', 'Ölen algler çürürken ayrıştırıcılar suyun oksijenini tüketir; balıklar boğulur.', 'As dead algae rot, decomposers use up the oxygen in the water and fish suffocate.', 'BİY.10.2.1'],
  ['decomposers', 'Ayrıştırıcılar', 'Decomposers', 'Dipteki bakteri ve mantarlar ölü maddeyi çözer ve maddeyi döngüye geri verir.', 'Bacteria and fungi on the bottom break down dead matter and return it to the cycle.', 'BİY.10.2.4'],
  ['pond_plants', 'Su bitkileri', 'Water plants', 'Fotosentezle suya oksijen verir.', 'They add oxygen to the water by photosynthesis.', 'BİY.10.1.3'],
  ['spirogyra', 'Spirogyra', 'Spirogyra', 'İpliksi yeşil alg; kloroplastı sarmal şeklinde.', 'A filament-shaped green alga with a spiral chloroplast.', 'BİY.9.1.5'],
  ['diatom', 'Diyatom', 'Diatom', 'Camdan (silika) kabuklu tek hücreli alg.', 'A single-celled alga with a glass (silica) shell.', 'BİY.9.1.6'],
  ['daphnia', 'Su piresi (Daphnia)', 'Water flea (Daphnia)', 'Alg yiyen minik kabuklu; kalbini mikroskopta atarken görebilirsin.', 'A tiny crustacean that eats algae. You can watch its heart beat under a microscope.', 'BİY.10.2.3'],
  ['paramecium', 'Paramecium', 'Paramecium', 'Sil’leriyle yüzen terlik biçimli tek hücreli.', 'A slipper-shaped single cell that swims with its cilia.', 'BİY.9.1.6'],
  ['cyanobacteria', 'Siyanobakteriler', 'Cyanobacteria', 'Fotosentez yapan bakteriler. Kirli, ılık suda patlama yapar; bazıları zehir üretir.', 'Bacteria that photosynthesise. They bloom in warm, polluted water, and some make toxins.', 'BİY.9.1.6'],
  ['wheat_roots', 'Saçak kök', 'Fibrous roots', 'Buğday gibi tek çenekliler saçak kök yapar.', 'Monocots like wheat grow fibrous roots.', 'BİY.9.1.5'],
  ['wheat_leaf', 'Paralel damarlı yaprak', 'Parallel-veined leaf', 'Tek çeneklilerin işareti: damarlar yan yana uzanır.', 'The sign of a monocot: veins run side by side.', 'BİY.9.1.5'],
  ['wheat_ear', 'Başak', 'Ear', 'Tanelerin dizildiği yer. Siyezin taneleri kavuzuna sıkı sarılıdır.', 'Where the grains sit. Siyez grains are wrapped tightly in their husks.', 'BİY.12.1.11'],
  ['wheat_old_leaf', 'Sararan yaşlı yaprak', 'Yellowing old leaf', 'Azot eksikse bitki azotu yaşlı yapraktan alıp genç yaprağa taşır; yaşlı yaprak sararır.', 'When nitrogen runs short, the plant moves it from old leaves to young ones, so the old leaves turn yellow.', 'BİY.10.2.4'],
  ['epidermis', 'Epidermis', 'Epidermis', 'Yaprağı saran koruyucu tek hücre katmanı.', 'The protective one-cell layer around the leaf.', 'BİY.9.2.8'],
  ['mesophyll', 'Mezofil', 'Mesophyll', 'Fotosentezin yapıldığı, kloroplast dolu hücreler.', 'Chloroplast-packed cells where photosynthesis happens.', 'BİY.10.1.2'],
  ['xylem', 'Ksilem', 'Xylem', 'Kökten yaprağa su ve mineral taşır.', 'Carries water and minerals from root to leaf.', 'BİY.9.2.8'],
  ['phloem', 'Floem', 'Phloem', 'Yaprakta yapılan şekeri bitkinin her yerine taşır.', 'Carries sugar made in the leaf to every part of the plant.', 'BİY.9.2.8'],
  ['stoma', 'Stoma', 'Stoma', 'Bekçi hücreleri açılıp kapanır: CO₂ girer, O₂ ve su buharı çıkar.', 'Guard cells open and close it: CO₂ goes in, O₂ and water vapour come out.', 'BİY.10.1.3'],
  ['cell_wall', 'Hücre çeperi', 'Cell wall', 'Selülozdan sert dış duvar; hayvan hücresinde yoktur.', 'A tough outer wall of cellulose. Animal cells don’t have one.', 'BİY.9.2.5'],
  ['vacuole', 'Koful', 'Vacuole', 'Su dolu büyük kese; hücreyi dik tutar.', 'A big water-filled sac that keeps the cell firm.', 'BİY.9.2.5'],
  ['nucleus', 'Çekirdek', 'Nucleus', 'DNA’yı saklar ve hücreyi yönetir.', 'Holds the DNA and runs the cell.', 'BİY.9.2.5'],
  ['chloroplast', 'Kloroplast', 'Chloroplast', 'Işık enerjisini şekerin içine bağlayan organel.', 'The organelle that stores light energy in sugar.', 'BİY.9.2.5'],
  ['chloroplast_pale', 'Soluk kloroplast', 'Pale chloroplast', 'Klorofil yapmak için azot gerekir. Azot azsa kloroplastlar solar, yaprak sararır.', 'Making chlorophyll needs nitrogen. Short of nitrogen, chloroplasts fade and the leaf turns yellow.', 'BİY.10.2.4'],
  ['mitochondrion', 'Mitokondri', 'Mitochondrion', 'Hücresel solunum burada: şekerden ATP üretilir. Bitkilerde de var!', 'Cellular respiration happens here: sugar becomes ATP. Plants have them too!', 'BİY.10.1.7'],
  ['thylakoid', 'Tilakoit (granum)', 'Thylakoid (granum)', 'Işığa bağlı tepkimeler burada: su parçalanır, O₂ açığa çıkar.', 'The light-dependent reactions happen here: water is split and O₂ is released.', 'BİY.10.1.2'],
  ['stroma', 'Stroma', 'Stroma', 'Işıktan bağımsız tepkimeler (Calvin döngüsü): CO₂ şekere bağlanır.', 'The light-independent reactions (Calvin cycle): CO₂ is built into sugar.', 'BİY.10.1.2'],
  ['starch', 'Nişasta tanesi', 'Starch grain', 'Fazla şeker nişasta olarak saklanır.', 'Extra sugar is stored as starch.', 'BİY.10.1.2'],
  ['nodule', 'Kök nodülü', 'Root nodule', 'Baklagillerin köklerindeki yumrular; içlerinde bakteriler yaşar.', 'Lumps on the roots of legumes, with bacteria living inside.', 'BİY.10.2.4'],
  ['root_hair', 'Emici tüyler', 'Root hairs', 'Kök yüzeyini büyütüp su ve mineral alır.', 'They enlarge the root surface to take up water and minerals.', 'BİY.9.2.6'],
  ['compound_leaf', 'Bileşik yaprak', 'Compound leaf', 'Nohudun yaprağı birçok küçük yaprakçıktan oluşur.', 'A chickpea leaf is made of many small leaflets.', 'BİY.9.1.5'],
  ['nodule_bacteria', 'Nodül bakterileri', 'Nodule bacteria', 'Havadaki azotu bitkinin kullanabileceği azota çevirir; bitki de onlara şeker verir. İkisi de kazanır.', 'They turn nitrogen from the air into a form the plant can use, and the plant feeds them sugar. Both win.', 'BİY.10.2.2'],
  ['nodule_pink', 'Pembe iç', 'Pink centre', 'Nodülün içindeki pembe renk, oksijeni tutan bir proteinden gelir.', 'The pink colour inside comes from a protein that holds on to oxygen.', 'BİY.10.2.4'],
  ['clover_flower', 'Yonca çiçeği', 'Clover flower', 'Onlarca küçük çiçekten oluşan bir baş; arılar tozlaştırır.', 'A head made of dozens of tiny flowers, pollinated by bees.', 'BİY.12.1.11'],
  ['clover_leaf', 'Üçlü yaprak', 'Three-part leaf', 'Yonca bir baklagildir: kökünde de nodül bulunur.', 'Clover is a legume: its roots carry nodules too.', 'BİY.10.2.4'],
  ['petal', 'Taç yaprak', 'Petal', 'Tozlayıcıları çeker. Bezelyede en üstteki büyük yaprak bayrak gibidir.', 'It attracts pollinators. In a pea, the big top petal stands like a flag.', 'BİY.12.1.11'],
  ['anther', 'Başçık (anter)', 'Anther', 'Polenin yapıldığı yer: erkek organın (stamen) ucu.', 'Where pollen is made: the tip of the male part (stamen).', 'BİY.12.1.11'],
  ['stigma', 'Tepecik (stigma)', 'Stigma', 'Polenin konduğu yapışkan uç: dişi organın (pistil) başı.', 'The sticky tip where pollen lands: the top of the female part (pistil).', 'BİY.12.1.11'],
  ['ovary', 'Yumurtalık', 'Ovary', 'Döllenmeden sonra meyveye (bakla) dönüşür.', 'After fertilisation it becomes the fruit (the pod).', 'BİY.12.1.11'],
  ['ovule', 'Tohum taslağı', 'Ovule', 'Döllenince tohum olur.', 'Becomes a seed once fertilised.', 'BİY.12.1.11'],
  ['pod', 'Bakla (meyve)', 'Pod (fruit)', 'Yumurtalık duvarından gelişen meyve.', 'The fruit, grown from the ovary wall.', 'BİY.12.1.11'],
  ['seed_shape', 'Tohum şekli', 'Seed shape', 'Yuvarlak (R) buruşuğa (r) baskındır. Rr tohum da yuvarlaktır.', 'Round (R) is dominant over wrinkled (r). An Rr seed is round too.', 'BİY.12.2.5'],
  ['starch_grain', 'Nişasta taneleri', 'Starch grains', 'Yuvarlak tohumda bol. Buruşuk tohumda nişasta yapan bir enzimin geni bozuk: daha az nişasta, daha çok şeker. Tohum kururken su kaybedip buruşur.', 'Plentiful in round seeds. In wrinkled seeds, the gene for a starch-making enzyme is broken: less starch, more sugar, and the seed shrivels as it dries.', 'BİY.12.2.4'],
  ['dense_dough', 'Sıkı hamur', 'Dense dough', 'Gaz boşluğu çok az: hamur kabarmamış. Maya gaz üretmiyor.', 'Hardly any gas pockets: the dough has not risen. The yeast is making no gas.', 'BİY.10.1.9'],
  ['gas_cells', 'Gaz boşlukları', 'Gas pockets', 'Mayanın ürettiği CO₂ hamurda binlerce kabarcık açar. Ekmeğin gözenekleri bunlardır.', 'CO₂ made by the yeast blows thousands of bubbles in the dough. They become the holes in bread.', 'BİY.10.1.9'],
  ['gluten', 'Glüten ağı', 'Gluten network', 'Buğday proteinleri suyla esnek bir ağ kurar ve gazı içinde tutar.', 'With water, wheat proteins build a stretchy network that holds the gas in.', 'BİY.10.1.9'],
  ['yeast_cell', 'Maya hücresi', 'Yeast cell', 'Tek hücreli bir mantar: çekirdekli (ökaryot) bir canlı.', 'A single-celled fungus: a living thing whose cells have a nucleus (a eukaryote).', 'BİY.9.1.6'],
  ['budding', 'Tomurcuklanma', 'Budding', 'Maya, ana hücreden küçük bir tomurcuk çıkararak eşeysiz ürer.', 'Yeast reproduces asexually by growing a small bud from the parent cell.', 'BİY.12.1.6'],
  ['flour_starch', 'Un nişastası', 'Flour starch', 'Unun çoğu nişastadır. Hamurdaki enzimler onu mayanın yiyeceği şekere parçalar.', 'Flour is mostly starch. Enzymes in the dough break it down into sugar for the yeast.', 'BİY.10.1.10'],
  ['mb_test', 'Metilen mavisi testi', 'Methylene blue test', 'Canlı maya boyayı renksizleştirir; ölü hücreler mavi kalır.', 'Living yeast turns the dye colourless; dead cells stay blue.', 'BİY.9.1.4'],
  ['iodine_test', 'İyot testi', 'Iodine test', 'Lugol çözeltisi nişastayı mavi-siyaha boyar. Buruşuk tohum daha açık ve lekeli boyanır: nişastası azdır.', 'Lugol’s iodine stains starch blue-black. A wrinkled seed stains paler and patchy: it holds less starch.', 'BİY.12.2.4'],
  ['embryo', 'Embriyo', 'Embryo', 'Tohumun içindeki minik bitki.', 'The tiny plant inside the seed.', 'BİY.12.1.12'],
  ['seed_coat', 'Tohum kabuğu', 'Seed coat', 'Embriyoyu korur; çimlenmede su alıp yumuşar.', 'Protects the embryo, and softens as it takes up water during germination.', 'BİY.12.1.12'],
  ['mushroom_gills', 'Lameller', 'Gills', 'Şapkanın altındaki ince tabakalar; milyonlarca spor buradan saçılır.', 'Thin plates under the cap that release millions of spores.', 'BİY.12.1.6'],
  ['mycelium', 'Miselyum', 'Mycelium', 'Toprağın altındaki ip ağı: mantarın asıl gövdesi. Ölü yaprakları çözer.', 'The web of threads underground is the real body of the fungus. It breaks down dead leaves.', 'BİY.10.2.4'],
  ['decomposer_leaf', 'Çürüyen yaprak', 'Rotting leaf', 'Ayrıştırıcılar yaprağı çözer; azot ve karbon toprağa döner.', 'Decomposers break the leaf down, returning nitrogen and carbon to the soil.', 'BİY.10.2.4'],
  ['spores', 'Sporlar', 'Spores', 'Mantarın üreme hücreleri; rüzgârla uzağa gider.', 'Reproductive cells of the fungus, carried far by the wind.', 'BİY.12.1.6'],
  ['basidium', 'Basidium', 'Basidium', 'Sporları taşıyan sopa biçimli hücre.', 'The club-shaped cell that carries the spores.', 'BİY.9.1.6'],
  ['humus', 'Humus', 'Humus', 'Çürümüş organik madde; toprağı koyu ve verimli yapar.', 'Rotted organic matter that makes soil dark and fertile.', 'BİY.10.2.1'],
  ['earthworm', 'Solucan', 'Earthworm', 'Toprağı havalandırır ve organik maddeyi karıştırır.', 'Airs the soil and mixes in organic matter.', 'BİY.10.2.1'],
  ['roots_soil', 'Kökler', 'Roots', 'Toprağı tutar, erozyonu önler.', 'Hold the soil in place and prevent erosion.', 'BİY.10.2.8'],
  ['soil_bacteria', 'Toprak bakterileri', 'Soil bacteria', 'Bir gram toprakta milyonlarca, hatta milyarlarcası yaşar.', 'A single gram of soil holds millions, even billions, of them.', 'BİY.9.1.6'],
  ['nematode', 'Nematod', 'Nematode', 'Toprakta yaşayan minik yuvarlak solucan.', 'A tiny roundworm living in the soil.', 'BİY.9.1.5'],
  ['springtail', 'Kuyruk sıçrayan', 'Springtail', 'Mantar iplikleriyle beslenen minik eklembacaklı.', 'A tiny arthropod that grazes on fungal threads.', 'BİY.9.1.5'],
  ['bark', 'Kabuk', 'Bark', 'Ağacı korur.', 'Protects the tree.', 'BİY.9.2.8'],
  ['cambium', 'Kambiyum', 'Cambium', 'İnce büyüme katmanı: içe odun (ksilem), dışa floem yapar.', 'A thin growing layer: it makes wood (xylem) inwards and phloem outwards.', 'BİY.9.2.8'],
  ['growth_rings', 'Yıllık halkalar', 'Growth rings', 'Her yıl bir halka eklenir: sayarsan ağacın yaşını bulursun. Kurak yıllarda halka incedir.', 'One ring a year: count them to find the tree’s age. Dry years leave thin rings.', 'BİY.9.1.4'],
  ['xylem_wood', 'Odun (ksilem)', 'Wood (xylem)', 'Suyu yukarı taşıyan borular; ağacın gövdesini de taşır.', 'Tubes that carry water upwards and hold the tree up.', 'BİY.9.2.8'],
  ['willow_stoma', 'Söğüt yaprağındaki stomalar', 'Stomata on a willow leaf', 'Karbondioksit buradan girer. Ağacın kütlesinin çoğu bu havadaki karbondan yapılır!', 'Carbon dioxide enters here. Most of a tree’s mass is built from this carbon in the air!', 'BİY.10.1.2'],
  ['co2_in', 'CO₂ girişi', 'CO₂ in', 'Fotosentezde CO₂ ve su, ışık enerjisiyle şekere dönüşür.', 'In photosynthesis, CO₂ and water become sugar using light energy.', 'BİY.10.1.3'],
  ['o2_out', 'O₂ çıkışı', 'O₂ out', 'Suyun parçalanmasından açığa çıkan oksijen.', 'Oxygen released when water is split.', 'BİY.10.1.3'],
  ['bee_eye', 'Bileşik göz', 'Compound eye', 'Binlerce gözcükten oluşur; morötesi ışığı da görür.', 'Made of thousands of little eyes; it can see ultraviolet light too.', 'BİY.11.1.5'],
  ['pollen_basket', 'Polen sepeti', 'Pollen basket', 'Arka bacaktaki kıllı çukur; polen topakları burada taşınır.', 'A hairy hollow on the hind leg that carries pollen loads.', 'BİY.12.1.11'],
  ['honey_stomach', 'Bal midesi', 'Honey stomach', 'Nektarı kovana taşıyan ayrı bir kese.', 'A separate sac for carrying nectar home.', 'BİY.10.1.5'],
  ['bee_wings', 'Kanatlar', 'Wings', 'İki çift kanat saniyede 200’den fazla çırpar; vızıltı buradan gelir.', 'Two pairs of wings beat more than 200 times a second. That’s the buzz.', 'BİY.11.1.9'],
  ['hardware', 'Yutulmuş çivi', 'Swallowed nail', 'Otla birlikte yutulan çivi börkeneğe çökmüş; sivri ucu duvara batıyor.', 'A nail swallowed with the fodder has sunk into the reticulum; its sharp tip is piercing the wall.', 'BİY.10.1.5'],
  ['magnet_bolus', 'Mıknatıs', 'Magnet bolus', 'Yutturulan mıknatıs börkeneğin dibine çöker ve çiviyi üstünde yatık tutar; bir daha batamaz.', 'The swallowed magnet sinks to the floor of the reticulum and holds the nail flat against itself, so it can’t pierce again.', 'BİY.10.1.5'],
  ['radicle', 'Kökçük', 'Radicle', 'Tohumdan ilk çıkan yapı: aşağı doğru büyüyüp genç kökü oluşturur.', 'The first thing out of the seed: it grows down and becomes the young root.', 'BİY.12.1.12'],
  ['plumule', 'Sürgüncük', 'Plumule', 'Kanca gibi kıvrık genç sürgün; toprağı yararken ucunu korur.', 'The young shoot, bent like a hook, which protects its tip as it pushes through the soil.', 'BİY.12.1.12'],
  ['cotyledon', 'Çenek', 'Cotyledon', 'Tohumun besin deposu: fide kendi yaprağıyla besin yapana kadar onu besler.', 'The seed’s food store: it feeds the seedling until its own leaves can make food.', 'BİY.12.1.12'],
  ['root_cap', 'Kök yüksüğü', 'Root cap', 'Kök ucunu bir yüksük gibi örter; toprağa sürtünen hücreleri sürekli yenilenir.', 'Covers the root tip like a thimble; its cells rub off in the soil and are always being replaced.', 'BİY.9.2.8'],
  ['meristem', 'Meristem', 'Meristem', 'Küçük, sık hücreler durmadan bölünür: kökü büyüten yeni hücreler buradan gelir.', 'Small, packed cells that keep dividing: the new cells that make the root grow come from here.', 'BİY.9.2.8'],
  ['elongation_zone', 'Uzama bölgesi', 'Elongation zone', 'Yeni hücreler su alıp boyuna uzar ve kök ucunu toprağın derinine iter.', 'New cells take up water and stretch lengthwise, pushing the root tip deeper into the soil.', 'BİY.9.2.8'],
  ['hot_source', 'Kaynak ağzı', 'Vent', 'Su yerin derininden yaklaşık 90 °C’de çıkar ve H₂S taşır. Bu sıcaklıkta yalnızca arkeler yaşar.', 'Water rises from deep underground at about 90 °C, carrying H₂S. At this heat only archaea live.', 'BİY.10.2.1'],
  ['sulfur_crust', 'Kükürt kabuğu', 'Sulphur crust', 'H₂S havayla karşılaşınca sarı kükürt kristalleri çöker. Çürük yumurta kokusu bu gazdan.', 'When H₂S meets the air, yellow sulphur crystals settle out. The rotten-egg smell is that gas.', 'BİY.10.2.1'],
  ['mat_bands', 'Renkli mikrop örtüsü', 'Coloured microbial mat', 'Su soğudukça renk değişir: her sıcaklıkta başka mikroplar yaşar. Renkler onların pigmentleri.', 'As the water cools the colour changes: each temperature has its own microbes, and the colours are their pigments.', 'BİY.10.2.1'],
  ['green_mat', 'Yeşil alg örtüsü', 'Green algal mat', 'Serin suda yeşil algler ve onları otlayan larvalar, salyangozlar: fotosentezle başlayan bir besin zinciri.', 'In the cool water, green algae and the larvae and snails that graze them: a food chain that starts with photosynthesis.', 'BİY.10.2.3'],
  ['sulfur_bacteria', 'Kükürt bakterileri', 'Sulphur bacteria', 'Işık olmadan, H₂S’yi oksitleyerek enerji elde eder ve CO₂’den besin yaparlar: kemosentez.', 'With no light at all, they get energy by oxidising H₂S and build food from CO₂: chemosynthesis.', 'BİY.10.2.3'],
  ['sulfur_granule', 'Kükürt damlacıkları', 'Sulphur droplets', 'Bakteri, H₂S’den kopardığı kükürdü hücresinde parlak damlacıklar hâlinde depolar.', 'The bacterium stores the sulphur it strips from H₂S as bright droplets inside its cells.', 'BİY.10.2.3'],
  ['archaea', 'Arkeler', 'Archaea', 'Bakteriye benzer ama ayrı bir üst âlemdir: zarları ve genleri farklıdır. En sıcak suyu onlar sever.', 'They look like bacteria but form a domain of their own, with different membranes and genes. They love the hottest water.', 'BİY.9.1.6'],
  ['rbc_column', 'Alyuvar sütunu', 'Packed red cells', 'Santrifüjde en ağır olan alyuvarlar dibe çöker. Sütunun bütün kana oranı hematokrittir.', 'In the centrifuge the heaviest part, the red cells, sinks to the bottom. Their share of the whole column is the haematocrit.', 'BİY.11.2.6'],
  ['buffy_coat', 'Akyuvar tabakası', 'Buffy coat', 'Alyuvarların üstündeki ince beyaz çizgi: akyuvarlar ve kan pulcukları.', 'The thin white line above the red cells: white cells and platelets.', 'BİY.11.2.6'],
  ['plasma', 'Kan plazması', 'Blood plasma', 'Kanın sıvı kısmı: çoğu su; içinde tuzlar, besinler, proteinler ve hormonlar taşınır.', 'The liquid part of blood: mostly water, carrying salts, nutrients, proteins and hormones.', 'BİY.11.2.6'],
  ['red_cell', 'Alyuvar', 'Red blood cell', 'Çekirdeksiz, iki yüzü çukur bir disk; içi oksijen taşıyan hemoglobinle dolu.', 'A disc with no nucleus, dimpled on both faces and packed with oxygen-carrying haemoglobin.', 'BİY.11.2.7'],
  ['neutrophil', 'Nötrofil', 'Neutrophil', 'Parçalı çekirdekli bir akyuvar: mikropları yutup yok eder.', 'A white cell with a lobed nucleus that swallows and destroys microbes.', 'BİY.11.2.6'],
  ['lymphocyte', 'Lenfosit', 'Lymphocyte', 'Büyük, yuvarlak çekirdekli akyuvar: antikor yapar, mikropları hatırlar.', 'A white cell with a big round nucleus: it makes antibodies and remembers microbes.', 'BİY.11.2.6'],
  ['platelet', 'Kan pulcuğu', 'Platelet', 'Hücre parçacıkları: yara yerinde toplanıp pıhtılaşmayı başlatır.', 'Cell fragments that gather at a wound and start the clot.', 'BİY.11.2.6'],
  ['salt_wilt', 'Islak toprakta solgunluk', 'Wilting in wet soil', 'Toprak ıslak ama yapraklar susuz gibi sarkık: kök su alamıyor.', 'The soil is wet, yet the leaves hang as if thirsty: the roots can’t take water in.', 'BİY.9.2.6'],
  ['salt_crust', 'Tuz kabuğu', 'Salt crust', 'Sulama suyu buharlaşınca toprağın yüzünde kalan beyaz tuz.', 'The white salt left on the soil when the watering water evaporates.', 'BİY.10.2.6'],
  ['plasmolysis', 'Plazmoliz', 'Plasmolysis', 'Tuzlu suda hücre su kaybetmiş; zar ve sitoplazma çeperden ayrılmış.', 'In salty water the cell has lost water; the membrane and cytoplasm have pulled away from the wall.', 'BİY.9.2.6'],
  ['turgor', 'Turgor', 'Turgor', 'Suyla dolu koful hücreyi çepere bastırır; yaprak dik durur.', 'The water-filled vacuole presses the cell against its wall; the leaf stands firm.', 'BİY.9.2.6'],
  ['facial_disc', 'Yüz diski', 'Facial disc', 'Kalp biçimli tüy çanağı sesi toplayıp kulaklara yöneltir.', 'A heart-shaped dish of feathers that gathers sound and steers it to the ears.', 'BİY.11.1.5'],
  ['owl_ears', 'Kulak delikleri', 'Ear openings', 'İki kulak deliği aynı hizada değil: baykuş sesin yerini yukarı-aşağı da bulur.', 'The two ear openings aren’t level, so the owl can tell whether a sound is high or low.', 'BİY.11.1.5'],
  ['owl_eye', 'Baykuş gözü', 'Owl eye', 'Büyük, öne bakan, boru biçimli göz; yuvasında dönmez, baykuş başını çevirir.', 'A big, forward-facing, tube-shaped eye; it can’t turn, so the owl turns its head.', 'BİY.11.1.5'],
  ['silent_feather', 'Sessiz kanat tüyü', 'Silent flight feather', 'Ön kenardaki tarak havayı böler: baykuş sessiz uçar, fare duymaz.', 'The comb on its leading edge breaks up the air: the owl flies silently and the mouse doesn’t hear.', 'BİY.10.2.2'],
  ['rod_cell', 'Çubuk hücreleri', 'Rod cells', 'Loş ışığa çok duyarlı, renk ayırt etmeyen ışık reseptörleri.', 'Light receptors that are very sensitive to dim light but can’t tell colours apart.', 'BİY.11.1.5'],
  ['cone_cell', 'Koni hücresi', 'Cone cell', 'Renkleri ayırt eden, parlak ışıkta çalışan reseptör.', 'The receptor that tells colours apart and works in bright light.', 'BİY.11.1.5'],
  ['retina_nerve', 'Ganglion hücreleri', 'Ganglion cells', 'Reseptörlerin sinyalini toplar; uzantıları görme sinirini oluşturur.', 'They collect the receptors’ signals; their fibres form the optic nerve.', 'BİY.11.1.5'],
  ['pigment_layer', 'Pigment tabakası', 'Pigment layer', 'Retinanın arkasındaki koyu tabaka saçılan ışığı emer.', 'The dark layer behind the retina soaks up stray light.', 'BİY.11.1.5'],
  ['left_ventricle', 'Sol karıncık', 'Left ventricle', 'Kanı aorta ile bütün vücuda pompalayan, en kalın duvarlı odacık.', 'The chamber with the thickest wall, which pumps blood into the aorta and round the whole body.', 'BİY.11.2.6'],
  ['right_atrium', 'Sağ kulakçık', 'Right atrium', 'Vücuttan dönen, oksijeni azalmış kanı toplayan odacık.', 'The chamber that collects the oxygen-poor blood coming back from the body.', 'BİY.11.2.6'],
  ['heart_valve', 'Kalp kapakçığı', 'Heart valve', 'Kanın yalnızca bir yönde akmasını sağlayan ince kapaklar.', 'Thin flaps that let blood flow one way only.', 'BİY.11.2.6'],
  ['aorta', 'Aort', 'Aorta', 'Sol karıncıktan çıkan en büyük atardamar.', 'The largest artery, leaving the left ventricle.', 'BİY.11.2.6'],
  ['vena_cava', 'Üst ana toplardamar', 'Vena cava', 'Baştan ve kollardan dönen kanı sağ kulakçığa getiren büyük toplardamar.', 'The big vein that brings blood back from the head and arms to the right atrium.', 'BİY.11.2.6'],
  ['artery', 'Atardamar', 'Artery', 'Kanı kalpten götüren, kalın ve esnek duvarlı damar.', 'A thick, elastic-walled vessel carrying blood away from the heart.', 'BİY.9.2.8'],
  ['vein', 'Toplardamar', 'Vein', 'Kanı kalbe geri getiren, ince duvarlı, geniş damar.', 'A wide, thin-walled vessel bringing blood back to the heart.', 'BİY.9.2.8'],
  ['smooth_muscle', 'Düz kas', 'Smooth muscle', 'Damar duvarının ortasındaki, istemsiz kasılan iğ biçimli hücreler.', 'Spindle-shaped cells in the middle of a vessel wall that contract without our control.', 'BİY.9.2.8'],
  ['endothelium', 'Endotel', 'Endothelium', 'Damarların içini döşeyen tek sıra yassı hücre.', 'The single layer of flat cells lining the inside of blood vessels.', 'BİY.9.2.8'],
  ['capillary', 'Kılcal damar', 'Capillary', 'Alyuvarların tek sıra geçebildiği, duvarı tek hücre kalınlığında damar.', 'A vessel so narrow that red cells pass in single file, with a wall one cell thick.', 'BİY.11.2.6'],
  ['alveolus', 'Alveol', 'Alveolus', 'Akciğerin en küçük hava keseciği; milyonlarcası üzüm salkımı gibi en ince hava yollarının ucunda durur.', 'The lung’s smallest air sac; millions of them sit like bunches of grapes at the ends of the finest airways.', 'BİY.11.2.7'],
  ['alveolar_wall', 'Alveol duvarı', 'Alveolar wall', 'Tek sıra yassı hücreden yapılmış, kâğıttan çok daha ince duvar: hava ile kan arasındaki tek engel.', 'A wall of one layer of flat cells, far thinner than paper: the only thing between air and blood.', 'BİY.11.2.7'],
  ['gas_exchange', 'Gaz alışverişi', 'Gas exchange', 'Oksijen alveoldeki havadan kana, karbondioksit kandan alveole difüzyonla geçer.', 'Oxygen passes from the air in the alveolus into the blood, and carbon dioxide from the blood into the alveolus, by diffusion.', 'BİY.11.2.7'],
  ['type2_cell', 'Sürfaktan hücresi', 'Surfactant cell', 'Köşelerdeki tombul hücreler; alveolün içini ince bir sıvı zarla kaplayıp keseciklerin sönmesini önler.', 'Plump cells in the corners; they coat the inside of the alveolus with a thin film that keeps the sacs from collapsing.', 'BİY.11.2.7'],
  ['dust_cell', 'Toz hücresi', 'Dust cell', 'Alveolün içinde gezinen bir akyuvar (makrofaj); içeri giren tozu ve kurumu yutar.', 'A white blood cell (a macrophage) roaming inside the alveolus; it swallows the dust and soot that get in.', 'BİY.11.2.7'],
  ['diffusion', 'Difüzyon', 'Diffusion', 'Oksijenin kandan dokuya, karbondioksitin dokudan kana kendiliğinden geçişi.', 'Oxygen passing by itself from blood to tissue, and carbon dioxide from tissue to blood.', 'BİY.9.2.6'],
  ['grasshopper', 'Çekirge', 'Grasshopper', 'Sıçrayan arka bacaklarıyla, çiğneyici ağzıyla ot yiyen böcek.', 'A grass-eating insect with jumping hind legs and chewing mouthparts.', 'BİY.10.2.3'],
  ['caterpillar', 'Tırtıl', 'Caterpillar', 'Kelebeklerin ve güvelerin yaprak yiyen larvası.', 'The leaf-eating larva of a butterfly or moth.', 'BİY.10.2.3'],
  ['aphid', 'Yaprak biti', 'Aphid', 'Bitkinin özsuyunu emen küçük, yumuşak böcek.', 'A small, soft insect that sucks a plant’s sap.', 'BİY.10.2.3'],
  ['butterfly', 'Kelebek', 'Butterfly', 'Nektar içen, çiçekten çiçeğe polen taşıyan böcek.', 'An insect that drinks nectar and carries pollen from flower to flower.', 'BİY.10.2.2'],
  ['ladybird', 'Uğur böceği', 'Ladybird', 'Yaprak bitlerini avlayan benekli böcek.', 'A spotted beetle that hunts aphids.', 'BİY.10.2.2'],
  ['spider', 'Örümcek', 'Spider', 'Ağıyla ya da pusuyla böcek avlayan sekiz bacaklı avcı.', 'An eight-legged hunter that catches insects with a web or by ambush.', 'BİY.10.2.3'],
  ['mandible', 'Çene', 'Mandible', 'Çekirgenin yaprak doğrayan, dişli iki güçlü çenesi.', 'The grasshopper’s two strong, toothed jaws that chop up leaves.', 'BİY.10.2.3'],
  ['antenna', 'Anten', 'Antenna', 'Koku ve dokunmayla çevreyi yoklayan ince, eklemli duyarga.', 'A thin, jointed feeler that senses smell and touch.', 'BİY.10.2.2'],
  ['hopper_eye', 'Bileşik göz', 'Compound eye', 'Binlerce küçük gözcükten oluşan böcek gözü.', 'An insect eye made of thousands of tiny units.', 'BİY.10.2.3'],
  ['palp', 'Palp', 'Palp', 'Ağzın iki yanında besini yoklayan küçük, eklemli uzantılar.', 'Small jointed feelers either side of the mouth that test the food.', 'BİY.10.2.3'],
  ['ant', 'Karınca', 'Ant', 'Yaprak bitlerinden şekerli damla alıp karşılığında onları koruyan böcek.', 'An insect that takes sugary drops from aphids and guards them in return.', 'BİY.10.2.2'],
  ['aphid_mummy', 'Mumyalaşmış bit', 'Aphid mummy', 'İçinde bir parazit arı larvası büyümüş, kabuğu kurumuş yaprak biti.', 'An aphid dried to a shell around a parasitic wasp larva growing inside it.', 'BİY.10.2.2'],
  ['scion', 'Aşı kalemi', 'Scion', 'Yaşlı ağaçtan kesilen, gözleri olan bir yıllık dal: meyveyi o belirler.', 'A one-year shoot with buds cut from the old tree: it decides the fruit.', 'BİY.12.1.6'],
  ['rootstock', 'Anaç', 'Rootstock', 'Kökü veren genç fidan: kalem onun üstünde büyür.', 'The young sapling that gives the roots: the scion grows on top of it.', 'BİY.12.1.6'],
  ['graft_union', 'Aşı yeri', 'Graft union', 'Kalemle anacın kaynaştığı, bantla sarılı yer.', 'The taped place where scion and rootstock knit together.', 'BİY.12.1.6'],
  ['apple_pip', 'Elma çekirdeği', 'Apple pip', 'Tohum: iki ayrı ağacın genlerinin yeni bir karışımı.', 'A seed: a new mix of the genes of two different trees.', 'BİY.12.2.5'],
  ['pith', 'Öz', 'Pith', 'Dalın ortasındaki yumuşak, açık renkli hücreler.', 'The soft, pale cells at the centre of a twig.', 'BİY.9.2.8'],
  ['callus', 'Kallus', 'Callus', 'Yaranın iki yanından çoğalan, henüz özelleşmemiş hücreler.', 'Unspecialised cells that multiply on both sides of a wound.', 'BİY.12.1.6'],
  ['cell_division', 'Bölünen hücre', 'Dividing cell', 'Kromozomları ortada dizilmiş, ikiye ayrılmak üzere bir hücre.', 'A cell with its chromosomes lined up, about to split in two.', 'BİY.12.1.6'],
  ['onion_scale', 'Etli yaprak', 'Fleshy scale leaf', 'Soğanın halkaları aslında yapraktır: güneş görmeyen, besin depolayan yapraklar.', 'An onion’s rings are really leaves: leaves that store food and never see the sun.', 'BİY.9.2.8'],
  ['onion_skin', 'Soğan zarı', 'Onion skin', 'Etli yaprağın iç yüzündeki, tek hücre kalınlığında deri.', 'The skin on the inner face of a scale leaf, just one cell thick.', 'BİY.9.1.4'],
  ['cover_slip', 'Lamel', 'Coverslip', 'Örneği düzleştiren, kurumasını önleyen incecik cam.', 'A very thin glass that flattens the sample and keeps it from drying.', 'BİY.9.1.4'],
  ['air_bubble', 'Hava kabarcığı', 'Air bubble', 'Kalın siyah kenarlı, içi parlak bir yuvarlak: hücre değil!', 'A round shape with a thick black rim and a bright middle: not a cell!', 'BİY.9.1.4'],
  ['cytoplasm', 'Sitoplazma', 'Cytoplasm', 'Hücre zarının içini dolduran, organelleri taşıyan jel kıvamlı sıvı.', 'The jelly-like fluid inside the membrane that holds the organelles.', 'BİY.9.2.5'],
  ['cell_membrane', 'Hücre zarı', 'Cell membrane', 'Hücreyi saran, neyin girip çıkacağını seçen ince zar.', 'The thin membrane around a cell that chooses what goes in and out.', 'BİY.9.2.5'],
  ['cheek_cell', 'Yanak hücresi', 'Cheek cell', 'Ağzın içini döşeyen yassı, düzensiz hücreler.', 'Flat, irregular cells lining the inside of the mouth.', 'BİY.9.2.8'],
  ['nucleolus', 'Çekirdekçik', 'Nucleolus', 'Çekirdeğin içindeki koyu bölge: ribozomların yapıldığı yer.', 'The dark spot inside the nucleus where ribosomes are made.', 'BİY.9.2.5'],
  ['rough_er', 'Granüllü ER', 'Rough ER', 'Üstü ribozomlarla kaplı zar kanalları: proteinler burada yapılır.', 'Membrane channels studded with ribosomes, where proteins are made.', 'BİY.9.2.5'],
  ['golgi', 'Golgi cisimciği', 'Golgi body', 'Proteinleri paketleyip adresleyen yassı kesecik yığını.', 'A stack of flat sacs that packages proteins and sends them on.', 'BİY.9.2.5'],
  ['secretory_vesicle', 'Salgı kofulu', 'Secretory vesicle', 'Hücre dışına gönderilecek enzimle dolu kesecik.', 'A small sac full of enzyme, waiting to be sent out of the cell.', 'BİY.9.2.5'],
  ['lysosome', 'Lizozom', 'Lysosome', 'Sindirim enzimleriyle dolu kese: hücrenin geri dönüşüm merkezi.', 'A sac of digestive enzymes: the cell’s recycling centre.', 'BİY.9.2.5'],
  ['centriole', 'Sentrozom', 'Centrosome', 'Birbirine dik iki sentriyol: bölünmede iğ ipliklerini düzenler.', 'Two centrioles at right angles, which organise the spindle when the cell divides.', 'BİY.9.2.5'],
  ['walnut_kernel', 'Ceviz içi', 'Walnut kernel', 'Ağırlığının üçte ikisi yağdır: gram başına en çok enerji.', 'Two thirds of its weight is fat: the most energy per gram.', 'BİY.10.1.10'],
  ['lokum_sugar', 'Lokum', 'Lokum', 'Şeker ve nişasta: hızlı ama çabuk biten enerji.', 'Sugar and starch: quick energy that soon runs out.', 'BİY.10.1.10'],
  ['leblebi', 'Leblebi', 'Leblebi', 'Kavrulmuş nohut: nişasta ve bol protein.', 'Roasted chickpeas: starch and plenty of protein.', 'BİY.10.1.10'],
  ['bread_starch', 'Köy ekmeği', 'Village bread', 'Çoğu nişasta ve su; su enerji vermez.', 'Mostly starch and water; water gives no energy.', 'BİY.10.1.10'],
  ['oil_body', 'Yağ damlacıkları', 'Oil bodies', 'Tohum hücreleri enerjiyi yağ damlacıkları hâlinde depolar.', 'Seed cells store energy as tiny droplets of oil.', 'BİY.10.1.10'],
  ['protein_body', 'Protein cisimciği', 'Protein body', 'Çimlenecek fidenin yapı malzemesi deposu.', 'A store of building material for the seedling to come.', 'BİY.10.1.10'],
  ['sudan_test', 'Sudan III testi', 'Sudan III test', 'Yağlar bu boyayı çözer ve turuncu-kırmızıya boyanır.', 'Fats dissolve this dye and turn orange-red.', 'BİY.10.1.10'],
  ['sarcomere', 'Sarkomer', 'Sarcomere', 'Kasın kasılma birimi: iki Z çizgisi arasındaki bölüm.', 'The muscle’s unit of contraction: the stretch between two Z lines.', 'BİY.11.1.9'],
  ['cristae', 'Kristalar', 'Cristae', 'Mitokondrinin kıvrım kıvrım iç zarı: ATP burada üretilir.', 'The folded inner membrane of a mitochondrion, where ATP is made.', 'BİY.10.1.7'],
  ['glycogen', 'Glikojen', 'Glycogen', 'Kasın hazır şeker deposu: hızlı enerji.', 'The muscle’s ready store of sugar: quick energy.', 'BİY.10.1.10'],
  ['lipid_droplet', 'Yağ damlası', 'Lipid droplet', 'Mitokondrinin hemen yanında duran yakıt deposu.', 'A fuel store sitting right beside a mitochondrion.', 'BİY.10.1.10'],
  ['pollen', 'Polen taneleri', 'Pollen grains', 'Dikenli yüzeyleri arının kıllarına tutunur ve çiçekten çiçeğe taşınır.', 'Their spiky surface clings to bee hairs, travelling from flower to flower.', 'BİY.12.1.11'],
  ['male_flower', 'Erkek çiçek', 'Male flower', 'Uzun ince sapın ucunda açar; ortasında polenle kaplı tek bir sütun var. Kabak vermez.', 'Opens on a long thin stalk, with a single pollen-covered column in the middle. It never makes a squash.', 'BİY.12.1.11'],
  ['female_flower', 'Dişi çiçek', 'Female flower', 'Taç yapraklarının altında minik bir kabak taşır. Polen gelirse bu minik kabak büyür.', 'Carries a tiny squash under its petals. If pollen arrives, the tiny squash grows.', 'BİY.12.1.11'],
  ['squash_bee', 'Tozlayıcı arı', 'Pollinating bee', 'Nektar için çiçekten çiçeğe gezer; kıllarına yapışan polenleri de taşır.', 'Moves from flower to flower for nectar, carrying the pollen stuck to its hairs.', 'BİY.10.2.2'],
  ['gourd_fence', 'Süs kabakları', 'Ornamental gourds', 'Komşunun çitine tırmanan siğilli, çizgili kabaklar. Ata kabağıyla aynı türden oldukları için birbirlerini tozlayabilirler.', 'Warty, striped gourds climbing the neighbour’s fence. They are the same species as the heirloom squash, so they can pollinate each other.', 'BİY.12.2.5'],
  ['sq_anther', 'Başçık sütunu', 'Anther column', 'Erkek çiçeğin ortasında birbirine kaynamış başçıklar: yüzeyi iri, yapışkan polenle kaplı.', 'The fused anthers in the middle of the male flower, covered in big, sticky pollen.', 'BİY.12.1.11'],
  ['sq_stigma', 'Dişicik tepesi', 'Stigma', 'Dişi çiçeğin ortasındaki kalın, loplu tepe: polen buraya konmalı.', 'The thick, lobed top in the middle of the female flower: pollen has to land here.', 'BİY.12.1.11'],
  ['nectary', 'Nektar halkası', 'Nectary', 'Dişiciğin dibinde şekerli sıvı salgılayan halka: arıyı çiçeğin içine kadar çeker.', 'A ring at the base that makes a sugary liquid: it draws the bee right into the flower.', 'BİY.10.2.2'],
  ['sq_ovary', 'Yumurtalık (minik kabak)', 'Ovary (baby squash)', 'Çiçeğin altında duran minik kabak. Döllenince büyüyüp kabak olur.', 'The baby squash under the flower. Once fertilised it swells into the squash.', 'BİY.12.1.11'],
  ['sq_ovules', 'Tohum taslakları', 'Ovules', 'Yumurtalığın içinde sıra sıra dizili. Her biri bir polenle döllenirse tohum olur.', 'Lined up in rows inside the ovary. Each becomes a seed if a pollen grain fertilises it.', 'BİY.12.1.11'],
  ['sq_pollen', 'Kabak poleni', 'Squash pollen', 'Polenlerin en irilerinden: dikenli ve yapışkan. Rüzgârla uçamayacak kadar ağır; onu arı taşır.', 'One of the biggest pollens there is: spiny and sticky. Too heavy to blow in the wind, so bees carry it.', 'BİY.12.1.11'],
  ['pollen_tube', 'Polen tüpü', 'Pollen tube', 'Tepeye konan polenin uzattığı tüp: dişicik boyunca inip tohum taslağına ulaşır.', 'The tube a pollen grain grows once it lands: it runs down the style to an ovule.', 'BİY.12.1.11'],
  ['stigma_papillae', 'Tepe tüyleri', 'Stigma papillae', 'Tepeyi kaplayan parmak gibi yapışkan hücreler: poleni tutar ve çimlenmesine yardım eder.', 'Sticky, finger-like cells covering the stigma: they hold the pollen and help it germinate.', 'BİY.12.1.11'],
  ['cross_pollen', 'Arının getirdiği polen', 'Pollen from a bee', 'Arının kıllarından dökülen polen. Süs kabağından da gelmiş olabilir, ata kabağından da: mikroskopta ayırt edilemez.', 'Pollen shed from a bee’s hairs. It may come from the gourds or from the heirloom squash: under the microscope you can’t tell.', 'BİY.12.2.5'],
  ['rust_stripe', 'Sarı pas çizgileri', 'Stripe rust', 'Yaprağın damarları boyunca uzanan sarı şeritler ve üstlerinde sıra sıra turuncu kabarcıklar. Buğdayın bir mantar hastalığı.', 'Yellow bands running along the leaf’s veins, with rows of orange blisters on them. A fungal disease of wheat.', 'BİY.10.2.2'],
  ['resistant_leaf', 'Dayanıklı yaprak', 'Resistant leaf', 'Nine’nin tarlasından bir yaprak. Üstüne spor konmuş ama tutunamamış: yalnızca birkaç minik kahverengi benek kalmış.', 'A leaf from Grandma’s field. Spores landed on it but couldn’t take hold: only a few tiny brown flecks are left.', 'BİY.10.2.8'],
  ['spore_dust', 'Parmaktaki turuncu toz', 'Orange dust on a finger', 'Paslı yaprağa değen parmak turuncuya boyanıyor. Bu toz, rüzgârla uçan milyonlarca spor.', 'A finger that brushes a rusty leaf turns orange. This dust is millions of spores that fly on the wind.', 'BİY.10.2.6'],
  ['rust_pustule', 'Spor kabarcığı', 'Spore blister', 'Yaprak derisinin altında büyüyüp onu yırtan turuncu kabarcık. İçi sporla dolu.', 'An orange blister that grows under the leaf’s skin and tears it open. It is full of spores.', 'BİY.10.2.2'],
  ['torn_epidermis', 'Yırtılmış yaprak derisi', 'Torn leaf skin', 'Kabarcığın iki yanında kıvrılmış deri parçaları. Yaprak artık suyunu içeride tutamıyor.', 'Curled flaps of skin on both sides of the blister. The leaf can no longer hold its water in.', 'BİY.9.2.8'],
  ['urediniospore', 'Pas sporu', 'Rust spore', 'Kalın çeperli, dikenli, turuncu tek bir hücre. Rüzgârla yüzlerce kilometre uçabilir.', 'A single thick-walled, spiny, orange cell. It can fly hundreds of kilometres on the wind.', 'BİY.9.1.6'],
  ['rust_hypha', 'Mantar ipliği', 'Fungal thread', 'Yaprağın içinde, hücrelerin arasındaki boşluklarda dolanan ince, bölmeli iplikler. Mantarın gövdesi bunlar.', 'Thin threads with cross walls winding through the spaces between the leaf’s cells. They are the fungus’s body.', 'BİY.9.1.6'],
  ['haustorium', 'Emeç (haustoryum)', 'Haustorium', 'Mantar ipliğinin bir yaprak hücresinin çeperinden içeri soktuğu loplu uç. Hücrenin besinini buradan emer.', 'The lobed tip a fungal thread pushes in through a leaf cell’s wall. It sucks up the cell’s food from here.', 'BİY.10.2.2'],
  ['slime_mat', 'Havasız çürüyen çim', 'Airless rotting grass', 'Sıkışıp yapışmış, koyu yeşil-siyah, kaygan bir çim tabakası. İçine hava girmediği için çürük yumurta ve amonyak kokar.', 'A pressed, stuck-together, dark green-black, slimy layer of grass. No air gets in, so it smells of rotten eggs and ammonia.', 'BİY.10.2.4'],
  ['actinomycete', 'Ak iplikler (aktinomisetler)', 'White threads (actinomycetes)', 'Yığının sıcak içinde kül gibi görünen beyaz, ince iplikler. İplik yapan bakterilerdir; toprağın o güzel kokusunu onlar verir.', 'Fine white threads that look like ash in the hot inside of the heap. They are thread-forming bacteria, and they give soil its lovely smell.', 'BİY.10.2.1'],
  ['compost_mite', 'Akar', 'Mite', 'Toplu iğne başından küçük, sekiz bacaklı, parlak kahverengi bir hayvan. Mantar ve çürüyen yaprakla beslenir.', 'A shiny brown, eight-legged animal smaller than a pinhead. It feeds on fungi and rotting leaves.', 'BİY.10.2.1'],
  ['thermophile', 'Isı seven bakteri', 'Heat-loving bacterium', 'Yığın 60 °C’ye ısınınca çoğalan çubuk bakteri. İçindeki parlak oval, sıcağa ve kuraklığa dayanan bir spor.', 'A rod bacterium that multiplies when the heap heats up to 60 °C. The bright oval inside it is a spore that survives heat and drought.', 'BİY.10.1.7'],
  ['actino_chain', 'Spor zinciri', 'Spore chain', 'Ak ipliklerin ucunda boncuk gibi dizilmiş sporlar. Havaya karışıp yeni yığınlara taşınırlar.', 'Spores strung like beads on the tips of the white threads. They drift on the air to new heaps.', 'BİY.10.2.1'],
];
const OBS = {};
OBS_RAW.forEach(r => { OBS[r[0]] = { id: r[0], title: { tr: r[1], en: r[2] }, text: { tr: r[3], en: r[4] }, code: r[5] }; });

// ---------------------------------------------------------------- chart drawing helpers
const CH = {
  fill(x, pts, col, o = {}) {
    x.fillStyle = col; x.beginPath(); (o.poly ? U.poly : U.path)(x, pts, true); x.fill();
    if (o.hatch) this.hatch(x, pts, o.hatch, o.hatchCol || 'rgba(27,26,23,0.25)', o.poly);
    if (o.ink !== false) { x.strokeStyle = C.ink; x.lineWidth = o.lw || 1.4; if (o.dash) x.setLineDash(o.dash); x.beginPath(); (o.poly ? U.poly : U.path)(x, pts, true); x.stroke(); x.setLineDash([]); }
  },
  hatch(x, pts, gap, col, poly) {
    const bb = U.bbox(pts);
    x.save(); x.beginPath(); (poly ? U.poly : U.path)(x, pts, true); x.clip();
    x.strokeStyle = col; x.lineWidth = 0.8;
    for (let k = -bb[3]; k < bb[2] + bb[3]; k += gap) { x.beginPath(); x.moveTo(bb[0] + k, bb[1]); x.lineTo(bb[0] + k - bb[3], bb[1] + bb[3]); x.stroke(); }
    x.restore();
  },
  circ(x, cx, cy, r, col, lw = 1.2, ink = true) { x.fillStyle = col; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill(); if (ink) { x.strokeStyle = C.ink; x.lineWidth = lw; x.stroke(); } },
  ell(x, cx, cy, rx, ry, rot, col, lw = 1.2) { x.fillStyle = col; U.ellipse(x, cx, cy, rx, ry, rot); x.fill(); x.strokeStyle = C.ink; x.lineWidth = lw; x.stroke(); },
  tube(x, pts, w, col) {
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.strokeStyle = C.ink; x.lineWidth = w + 2.4; x.beginPath(); U.path(x, pts, false); x.stroke();
    x.strokeStyle = col; x.lineWidth = w; x.beginPath(); U.path(x, pts, false); x.stroke();
  },
  text(x, s, px, py, size = 8, col = C.ink, align = 'center', font = 'Courier Prime') {
    x.fillStyle = col; x.font = `700 ${size}px "${font}", monospace`; x.textAlign = align; x.textBaseline = 'middle'; x.fillText(s, px, py);
  },
  arrow(x, x0, y0, x1, y1, col = C.ink, w = 1.4) {
    x.strokeStyle = col; x.fillStyle = col; x.lineWidth = w;
    x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0);
    x.beginPath(); x.moveTo(x1, y1); x.lineTo(x1 - Math.cos(a - 0.4) * 6, y1 - Math.sin(a - 0.4) * 6); x.lineTo(x1 - Math.cos(a + 0.4) * 6, y1 - Math.sin(a + 0.4) * 6); x.closePath(); x.fill();
  },
  bg(x, col = C.ground) { x.fillStyle = col; x.fillRect(-140, -140, 280, 280); },
};

// Plates (the realistic specimen pictures) live in mx.js, plates-plant.js, plates-animal.js and plates-eco.js.

// ---------------------------------------------------------------- X-ray layers (entity local space)
const XRAY = {
  // the cow is a painting now (plates-cow.js, COWX): the whole animal with a see-through chest and belly
  cow(x, st) { COWX.draw(x, st); },
  // the others are paintings too (plates-xray.js)
  dog(x) { DOGX.draw(x); },
  sheep(x) { SHEEPX.draw(x); },
  chicken(x) { HENX.draw(x); },
  stork(x) { STORKX.draw(x); },
};

// ---------------------------------------------------------------- specs
const SPECS = {
  cow: { name: { tr: 'Sarıkız · inek', en: 'Sarıkız · cow' }, dive: 4, levels: [
    { tag: { tr: '×1 Sistem', en: '×1 System' }, mode: 'xray', mag: 1.2, draw: XRAY.cow, callouts: st => COWX.spots(st) },
    // the anatomy atlas: both sides opened, then the four chambers cut open (plates-cow.js)
    { tag: { tr: '×1 Sol yan', en: '×1 Left side' }, mode: 'plate', draw: PLATES.cowleft, callouts: st => { const s = COWA.leftSpots(st), c = [['cow_esophagus', ...s.eso], ['cow_lung', ...s.lung], ['cow_heart', ...s.heart], ['cow_diaphragm', ...s.dia], ['cow_spleen', ...s.spleen], ['cow_reticulum', ...s.ret], ['cow_rumen', ...s.rumen]]; if (st.nail) c.push(['hardware', ...s.nail]); if (st.magnet) c.push(['magnet_bolus', ...s.magnet]); return c; } },
    { tag: { tr: '×1 Sağ yan', en: '×1 Right side' }, mode: 'plate', draw: PLATES.cowright, callouts: (s => [['cow_liver', ...s.liver], ['cow_kidney', ...s.kidney], ['cow_omasum', ...s.omasum], ['cow_abomasum', ...s.abomasum], ['cow_intestine', ...s.gut], ['cow_colon', ...s.colon]])(COWA.rightSpots()) },
    { tag: { tr: '×1 Mide içi', en: '×1 Linings' }, mode: 'plate', draw: PLATES.cowlining, callouts: (s => [['rumen_papillae', ...s.papillae], ['reticulum_crests', ...s.crests], ['reticular_groove', ...s.groove], ['omasal_laminae', ...s.leaves], ['abomasal_folds', ...s.folds]])(COWA.lining) },
    { tag: { tr: '×10 Organ', en: '×10 Organ' }, mode: 'plate', draw: PLATES.rumen, callouts: st => st.bloat > 0.3 ? [['rumen_foam', 0, -20], ['rumen_papillae', 96, -12], ['rumination', -104, -100]] : [['rumen_gas', 20, -66], ['rumen_fiber', 10, -26], ['rumen_fluid', 20, 44], ['rumen_papillae', 96, -12], ['rumination', -104, -100]] },
    { tag: { tr: '×1000 Mikrop', en: '×1000 Microbe' }, mode: 'plate', draw: PLATES.microbes, callouts: [['cellulose', -100, -59], ['rumen_bacteria', -28, -76], ['rumen_protozoa', -66, 52], ['rumen_fungi', 64, 70], ['methanogen', 10, 10]] },
  ] },
  sheep: { name: { tr: 'Koyun', en: 'Sheep' }, levels: [
    { tag: { tr: '×1 Sistem', en: '×1 System' }, mode: 'xray', mag: 2.6, draw: XRAY.sheep, callouts: SHEEPX.spots() },
    { tag: { tr: '×10 Organ', en: '×10 Organ' }, mode: 'plate', draw: PLATES.rumen, callouts: [['rumen_papillae', 96, -12], ['rumination', -104, -100]] },
  ] },
  dog: { name: { tr: 'Karabaş · Kangal', en: 'Karabaş · Kangal dog' }, levels: [
    { tag: { tr: '×1 Sistem', en: '×1 System' }, mode: 'xray', mag: 2.4, draw: XRAY.dog, callouts: DOGX.spots() },
    { tag: { tr: '×100 Doku', en: '×100 Tissue' }, mode: 'plate', draw: PLATES.stomachWall, callouts: [['gastric_gland', -58, -50], ['gastric_mucus', 20, -120], ['stomach_muscle', 40, 62]] },
  ] },
  chicken: { name: { tr: 'Tavuk', en: 'Hen' }, levels: [
    { tag: { tr: '×1 Sistem', en: '×1 System' }, mode: 'xray', mag: 5, draw: XRAY.chicken, callouts: HENX.spots() },
  ] },
  stork: { name: { tr: 'Leylek', en: 'Stork' }, levels: [
    { tag: { tr: '×1 Sistem', en: '×1 System' }, mode: 'xray', mag: 3.2, draw: XRAY.stork, callouts: STORKX.spots() },
    { tag: { tr: '×10 Kemik', en: '×10 Bone' }, mode: 'plate', draw: PLATES.boneSection, callouts: [['hollow_bone', 0, 0]] },
  ] },
  frog: { name: { tr: 'Kurbağa', en: 'Frog' }, levels: [
    { tag: { tr: '×5 Sistem', en: '×5 System' }, mode: 'plate', draw: PLATES.frog, callouts: [['frog_skin', -42, 40], ['frog_lung', 30, -2], ['frog_heart', 0, -18]] },
  ] },
  fish: { name: { tr: 'Balık', en: 'Fish' }, levels: [
    { tag: { tr: '×5 Sistem', en: '×5 System' }, mode: 'plate', draw: PLATES.fish, callouts: [['fish_gills', -60, 0], ['swim_bladder', 20, -12], ['fish_heart', -54, 28]] },
  ] },
  pond: { name: { tr: 'Gölet suyu', en: 'Pond water' }, levels: [
    { tag: { tr: '×1 Ekosistem', en: '×1 Ecosystem' }, mode: 'plate', draw: PLATES.pond, callouts: st => { const c = [['pond_oxygen', 106, -56], ['decomposers', 0, 110]]; if (st.algae > 40 || (typeof G !== 'undefined' && G.S && Q.at('pond', 'look'))) c.push(['algae_bloom', -60, -98]); if (st.algae < 60) c.push(['pond_plants', -100, 30]); return c; } },
    { tag: { tr: '×400 Damla', en: '×400 Drop' }, mode: 'plate', draw: PLATES.drop, callouts: st => { const c = [['spirogyra', -30, -56], ['diatom', 92, -80], ['daphnia', -70, 76], ['paramecium', 40, 10]]; if (st.algae > 40) c.push(['cyanobacteria', 84, 96]); return c; } },
  ] },
  wheat: { name: { tr: 'Siyez buğdayı', en: 'Siyez wheat' }, levels: [
    { tag: { tr: '×1 Bitki', en: '×1 Plant' }, mode: 'plate', draw: PLATES.wheatPlant, callouts: st => { const c = [['wheat_roots', -40, 100], ['wheat_leaf', 62, -26], ['wheat_ear', 4, -112]]; if (st.pale) c.push(['wheat_old_leaf', -57, 8]); return c; } },
    { tag: { tr: '×100 Doku', en: '×100 Tissue' }, mode: 'plate', draw: PLATES.leafSection, callouts: [['epidermis', -110, -76], ['mesophyll', -55, -20], ['xylem', -8, -3], ['phloem', 0, 11], ['stoma', 58, 71]] },
    { tag: { tr: '×1000 Hücre', en: '×1000 Cell' }, mode: 'plate', draw: PLATES.plantCell, callouts: st => [['cell_wall', -110, -10], ['vacuole', -10, 10], ['nucleus', 62, -50], [st.pale ? 'chloroplast_pale' : 'chloroplast', -12, -83], ['mitochondrion', 83, 37]] },
    { tag: { tr: '×20 000 Organel', en: '×20,000 Organelle' }, mode: 'plate', draw: PLATES.chloroplast, callouts: [['thylakoid', -30, 24], ['stroma', -44, -30], ['starch', 22, 40]] },
  ] },
  chickpea: { name: { tr: 'Nohut', en: 'Chickpea' }, levels: [
    { tag: { tr: '×1 Bitki', en: '×1 Plant' }, mode: 'plate', draw: PLATES.chickpea, callouts: [['nodule', -40, 70], ['root_hair', 58, 100], ['compound_leaf', -40, -36]] },
    { tag: { tr: '×100 Nodül', en: '×100 Nodule' }, mode: 'plate', draw: PLATES.nodule, callouts: [['nodule_pink', -40, -6], ['nodule_bacteria', 78, -60]] },
  ] },
  clover: { name: { tr: 'Yonca', en: 'Clover' }, levels: [
    { tag: { tr: '×1 Bitki', en: '×1 Plant' }, mode: 'plate', draw: PLATES.clover, callouts: [['clover_flower', 30, -80], ['nodule', -40, 70], ['clover_leaf', -6, -100]] },
    { tag: { tr: '×100 Nodül', en: '×100 Nodule' }, mode: 'plate', draw: PLATES.nodule, callouts: [['nodule_pink', -40, -6], ['nodule_bacteria', 78, -60]] },
  ] },
  pea: { name: { tr: 'Bezelye', en: 'Pea' }, levels: [
    { tag: { tr: '×5 Çiçek', en: '×5 Flower' }, mode: 'plate', draw: PLATES.peaFlower, callouts: [['petal', 30, -92], ['anther', 66, 4], ['stigma', 94, -30], ['ovary', -28, 42], ['ovule', 25, 25]] },
    { tag: { tr: '×2 Bakla', en: '×2 Pod' }, mode: 'plate', draw: PLATES.peaPod, callouts: [['pod', -96, -20], ['seed_shape', -16, -4]] },
    { tag: { tr: '×40 Tohum', en: '×40 Seed' }, mode: 'plate', draw: PLATES.peaSeed, callouts: st => { const c = [['starch_grain', 84, -66], ['embryo', -100, 44], ['seed_coat', 62, 80]]; if (st.stain) c.push(['iodine_test', -40, -20]); return c; } },
  ] },
  mushroom: { name: { tr: 'Mantar', en: 'Mushroom' }, levels: [
    { tag: { tr: '×1 Organizma', en: '×1 Organism' }, mode: 'plate', draw: PLATES.mushroom, callouts: [['mushroom_gills', 30, -40], ['mycelium', -30, 70], ['decomposer_leaf', -100, 14]] },
    { tag: { tr: '×400 Lamel', en: '×400 Gill' }, mode: 'plate', draw: PLATES.gill, callouts: [['basidium', -31, -40], ['spores', 13, 30]] },
  ] },
  soil: { name: { tr: 'Toprak', en: 'Soil' }, levels: [
    { tag: { tr: '×1 Profil', en: '×1 Profile' }, mode: 'plate', draw: PLATES.soil, callouts: [['humus', 90, -60], ['earthworm', -70, -34], ['roots_soil', 56, -40]] },
    { tag: { tr: '×40 Mikro', en: '×40 Micro' }, mode: 'plate', draw: PLATES.soilMicro, callouts: [['soil_bacteria', -84, -96], ['nematode', -20, -46], ['springtail', 70, 86]] },
  ] },
  tree: { name: { tr: 'Ağaç gövdesi', en: 'Tree trunk' }, levels: [
    { tag: { tr: '×1 Kesit', en: '×1 Section' }, mode: 'plate', draw: PLATES.rings, callouts: [['bark', 0, -116], ['cambium', 74, -76], ['growth_rings', -60, 20], ['xylem_wood', 58, 56]] },
  ] },
  willow: { name: { tr: 'Söğüt', en: 'Willow' }, levels: [
    { tag: { tr: '×400 Yaprak altı', en: '×400 Leaf underside' }, mode: 'plate', draw: PLATES.willowLeaf, callouts: [['willow_stoma', 0, -4], ['co2_in', -62, 52], ['o2_out', 62, 52]] },
    { tag: { tr: '×1000 Hücre', en: '×1000 Cell' }, mode: 'plate', draw: PLATES.plantCell, callouts: [['cell_wall', -110, -10], ['chloroplast', -12, -83], ['mitochondrion', 83, 37]] },
  ] },
  bee: { name: { tr: 'Bal arısı', en: 'Honeybee' }, levels: [
    { tag: { tr: '×20 Organizma', en: '×20 Organism' }, mode: 'plate', draw: PLATES.bee, callouts: [['bee_eye', -84, -18], ['pollen_basket', 22, 60], ['honey_stomach', 30, 0], ['bee_wings', 20, -68]] },
    { tag: { tr: '×500 Polen', en: '×500 Pollen' }, mode: 'plate', draw: PLATES.pollen, callouts: [['pollen', -40, -30]] },
  ] },
  dough: { name: { tr: 'Nazlı Teyze’nin hamuru', en: 'Nazlı Teyze’s dough' }, levels: [
    { tag: { tr: '×1 Hamur', en: '×1 Dough' }, mode: 'plate', draw: PLATES.dough, callouts: st => st.risen ? [['gas_cells', -38, -4], ['gluten', 84, -84]] : [['dense_dough', -40, 30], ['gluten', 84, -84]] },
    { tag: { tr: '×400 Maya', en: '×400 Yeast' }, mode: 'plate', draw: PLATES.yeast, callouts: st => { const c = [['yeast_cell', 40, 30], ['budding', -50, -44], ['flour_starch', 84, -72]]; if (st.stain) c.push(['mb_test', -66, 66]); return c; } },
  ] },
  sprout: { name: { tr: 'Çimlenen bezelye', en: 'Sprouting pea' }, levels: [
    { tag: { tr: '×2 Fide', en: '×2 Sprout' }, mode: 'plate', draw: PLATES.sprout, callouts: [['seed_coat', 70, -72], ['cotyledon', 14, -12], ['radicle', -33, 50], ['plumule', -56, -74], ['root_hair', 86, 78]] },
    { tag: { tr: '×100 Kök ucu', en: '×100 Root tip' }, mode: 'plate', draw: PLATES.roottip, callouts: [['root_cap', 0, 112], ['meristem', 0, 68], ['elongation_zone', 0, -22], ['root_hair', 98, -112]] },
  ] },
  spring: { name: { tr: 'Kükürtlü Pınar', en: 'Sulphur Spring' }, levels: [
    { tag: { tr: '×1 Pınar', en: '×1 Spring' }, mode: 'plate', draw: PLATES.spring, callouts: [['hot_source', -66, -62], ['sulfur_crust', -34, -92], ['mat_bands', 30, 20], ['green_mat', 112, 104]] },
    { tag: { tr: '×1000 Örtü', en: '×1000 Mat' }, mode: 'plate', draw: PLATES.mat, callouts: [['sulfur_bacteria', -58, -44], ['sulfur_granule', 94, -92], ['cyanobacteria', 64, 72], ['archaea', -72, 80]] },
  ] },
  garden: { name: { tr: 'Songül’ün domates fideleri', en: 'Songül’s tomato seedlings' }, levels: [
    { tag: { tr: '×1 Fide', en: '×1 Seedling' }, mode: 'plate', draw: PLATES.garden, callouts: st => st.salty ? [['salt_wilt', 100, -96], ['salt_crust', 64, -12], ['root_hair', 28, 70]] : [['turgor', 100, -96], ['root_hair', 28, 70]] },
    { tag: { tr: '×400 Kök hücreleri', en: '×400 Root cells' }, mode: 'plate', draw: PLATES.plasmolysis, callouts: st => { const n = CORTEX.cell(-72, 68, !!st.salty); return [['cell_wall', -72, -34], ['vacuole', 0, 0], ['nucleus', n.nx, n.ny], [st.salty ? 'plasmolysis' : 'turgor', 82, -34]]; } },
  ] },
  owl: { name: { tr: 'Peçeli baykuş', en: 'Barn owl' }, levels: [
    { tag: { tr: '×1 Baş', en: '×1 Head' }, mode: 'plate', draw: PLATES.owlhead, callouts: [['facial_disc', ...OWLF.at(-30, 46)], ['owl_ears', ...OWLF.at(-86, -40)], ['owl_eye', ...OWLF.at(-28, -16)], ['silent_feather', 100, -100]] },
    { tag: { tr: '×400 Retina', en: '×400 Retina' }, mode: 'plate', draw: PLATES.retina, callouts: st => st.human ? [['cone_cell', -40, 66], ['retina_nerve', -60, -100], ['pigment_layer', 0, 114]] : [['rod_cell', -40, 66], ['cone_cell', 62, 70], ['retina_nerve', -60, -100], ['pigment_layer', 0, 114]] },
  ] },
  heart: { name: { tr: 'Kalp, damarlar ve akciğer', en: 'Heart, vessels and lungs' }, levels: [
    { tag: { tr: '×1 Kalp modeli', en: '×1 Heart model' }, mode: 'plate', draw: PLATES.heartmodel, callouts: [['right_atrium', -54, -28], ['heart_valve', -42, 12], ['left_ventricle', 40, 58], ['aorta', 56, -118], ['vena_cava', -66, -112]] },
    { tag: { tr: '×40 Damar kesiti', en: '×40 Vessel section' }, mode: 'plate', draw: PLATES.vessels, callouts: st => { const s = VESSEL.spots(!!st.hyper); return [['artery', ...s.artery], ['smooth_muscle', ...s.muscle], ['endothelium', ...s.endo], ['vein', ...s.vein], ['red_cell', ...s.rbc]]; } },
    { tag: { tr: '×400 Kılcal damar', en: '×400 Capillary' }, mode: 'plate', draw: PLATES.capillary, callouts: [['capillary', ...CAPIL.spot.wall], ['red_cell', ...CAPIL.spot.rbc], ['endothelium', ...CAPIL.spot.endo], ['diffusion', ...CAPIL.spot.diff], ['sarcomere', ...CAPIL.spot.sarc]] },
    { tag: { tr: '×400 Akciğer: alveoller', en: '×400 Lung: alveoli' }, mode: 'plate', draw: PLATES.alveoli, callouts: [['alveolus', -100, 0], ['alveolar_wall', 50, 0], ['capillary', -25, -44], ['red_cell', 0, 87], ['gas_exchange', 100, -87], ['type2_cell', -100, 58], ['dust_cell', 62, 96]] },
  ] },
  sweep: { name: { tr: 'Böcek ağı tepsisi', en: 'Sweep-net tray' }, levels: [
    { tag: { tr: '×1 Böcek ağı tepsisi', en: '×1 Sweep-net tray' }, mode: 'plate', draw: PLATES.catchtray, callouts: st => st.sprayed ? [['grasshopper', ...TRAY.thin.grasshopper], ['spider', ...TRAY.thin.spider]] : INSECT.KINDS.map(k => [k, ...TRAY.spot[k]]) },
    { tag: { tr: '×10 Yaprak altı', en: '×10 Leaf underside' }, mode: 'plate', draw: PLATES.aphidleaf, callouts: [['aphid', -30, -20], ['ladybird', ...LEAF.lady], ['ant', ...LEAF.ant], ['aphid_mummy', ...LEAF.mummy]] },
    { tag: { tr: '×20 Çekirge başı', en: '×20 Grasshopper head' }, mode: 'plate', draw: PLATES.hopperhead, callouts: [['hopper_eye', -58, -30], ['antenna', -36, -106], ['mandible', -16, 90], ['palp', 54, 104]] },
  ] },
  apple: { name: { tr: 'Amasya elması', en: 'Amasya apple' }, levels: [
    { tag: { tr: '×1 Aşılı fidan', en: '×1 Grafted sapling' }, mode: 'plate', draw: PLATES.orchard, callouts: [['scion', -67, -64], ['graft_union', -62, 18], ['rootstock', -59, 66], ['apple_pip', ...APPLE.pip]] },
    { tag: { tr: '×40 Dal kesiti', en: '×40 Twig section' }, mode: 'plate', draw: PLATES.twig, callouts: [['bark', ...TWIG.at(-135, 114)], ['phloem', ...TWIG.at(-45, 86)], ['cambium', ...TWIG.at(45, 78.5)], ['xylem_wood', ...TWIG.at(135, 52)], ['pith', 0, 0]] },
    { tag: { tr: '×400 Aşı yeri', en: '×400 Graft union' }, mode: 'plate', draw: PLATES.callus, callouts: [['callus', 92, 48], ['cell_division', ...CALLUS.div], ['cambium', -72, -86], ['xylem_wood', -38, 82]] },
  ] },
  squash: { name: { tr: 'Ata kabağı · Fatma Teyze’nin bahçesi', en: 'Heirloom squash · Fatma Teyze’s garden' }, levels: [
    { tag: { tr: '×1 Kabak bahçesi', en: '×1 Squash patch' }, mode: 'plate', draw: PLATES.squashpatch, callouts: [['male_flower', ...SQUASH.patch.male], ['female_flower', ...SQUASH.patch.female], ['squash_bee', ...SQUASH.patch.bee], ['gourd_fence', ...SQUASH.patch.fence]] },
    { tag: { tr: '×5 Çiçeklerin içi', en: '×5 Inside the flowers' }, mode: 'plate', draw: PLATES.squashflowers, callouts: [['sq_anther', ...SQUASH.flowers.anther], ['sq_stigma', ...SQUASH.flowers.stigma], ['nectary', ...SQUASH.flowers.nectary], ['sq_ovules', ...SQUASH.flowers.ovules], ['sq_ovary', ...SQUASH.flowers.ovary]] },
    { tag: { tr: '×400 Tepede polen', en: '×400 Pollen on the stigma' }, mode: 'plate', draw: PLATES.squashpollen, callouts: [['sq_pollen', ...SQUASH.pollen.grain], ['pollen_tube', ...SQUASH.pollen.tube], ['stigma_papillae', ...SQUASH.pollen.papillae], ['cross_pollen', ...SQUASH.pollen.cross]] },
  ] },
  rust: { name: { tr: 'Sarı pas · Osman Amca’nın buğdayı', en: 'Stripe rust · Osman Amca’s wheat' }, levels: [
    { tag: { tr: '×1 Paslı yaprak', en: '×1 Rusty leaf' }, mode: 'plate', draw: PLATES.rustleaf, callouts: [['rust_stripe', ...RUSTP.leaf.stripe], ['resistant_leaf', ...RUSTP.leaf.resistant], ['spore_dust', ...RUSTP.leaf.dust]] },
    { tag: { tr: '×40 Yaprağın yüzü', en: '×40 Leaf surface' }, mode: 'plate', draw: PLATES.rustpustule, callouts: [['rust_pustule', ...RUSTP.surf.pustule], ['torn_epidermis', ...RUSTP.surf.torn], ['stoma', ...RUSTP.surf.stoma]] },
    { tag: { tr: '×400 Kabarcığın kesiti', en: '×400 Section through a blister' }, mode: 'plate', draw: PLATES.rustspore, callouts: [['urediniospore', ...RUSTP.sect.spore], ['rust_hypha', ...RUSTP.sect.hypha], ['haustorium', ...RUSTP.sect.haustorium], ['mesophyll', ...RUSTP.sect.mesophyll]] },
  ] },
  compost: { name: { tr: 'Kompost · Çiftlik avlusundaki yığınlar', en: 'Compost · The heaps in the farmyard' }, levels: [
    { tag: { tr: '×1 Yığının kesiti', en: '×1 Cut through the heap' }, mode: 'plate', draw: PLATES.heapcut, callouts: [['slime_mat', ...COMPOSTP.heap.slime], ['actinomycete', ...COMPOSTP.heap.actino], ['earthworm', ...COMPOSTP.heap.worm], ['humus', ...COMPOSTP.heap.humus]] },
    { tag: { tr: '×40 Çürüyen yaprak', en: '×40 A rotting leaf' }, mode: 'plate', draw: PLATES.compostlife, callouts: [['springtail', ...COMPOSTP.life.springtail], ['compost_mite', ...COMPOSTP.life.mite], ['mycelium', ...COMPOSTP.life.mycelium], ['nematode', ...COMPOSTP.life.nematode]] },
    { tag: { tr: '×1000 En sıcak yer', en: '×1000 The hottest spot' }, mode: 'plate', draw: PLATES.compostmicro, callouts: [['thermophile', ...COMPOSTP.micro.thermophile], ['actino_chain', ...COMPOSTP.micro.chain], ['soil_bacteria', ...COMPOSTP.micro.bacteria]] },
  ] },
  onion: { name: { tr: 'Soğan zarı ve yanak hücresi', en: 'Onion skin and cheek cells' }, levels: [
    { tag: { tr: '×1 Soğan ve lam', en: '×1 Onion and slide' }, mode: 'plate', draw: PLATES.onion, callouts: [['onion_scale', -64, 14], ['onion_skin', 50, -60], ['cover_slip', 64, 72]] },
    { tag: { tr: '×400 Hücreler', en: '×400 Cells' }, mode: 'plate', draw: PLATES.cells, callouts: st => { const s = CELLS.spots(!!st.cheek); return st.cheek ? [['cheek_cell', ...s.cell], ['cell_membrane', ...s.membrane], ['nucleus', ...s.nucleus], ['cytoplasm', ...s.cytoplasm]] : [['cell_wall', ...s.wall], ['nucleus', ...s.nucleus], ['cytoplasm', ...s.cytoplasm], ['vacuole', ...s.vacuole], ['air_bubble', ...s.bubble]]; } },
    { tag: { tr: '×10000 Tükürük bezi hücresi', en: '×10000 Salivary gland cell' }, mode: 'plate', draw: PLATES.gland, callouts: [['nucleolus', ...GLAND.nucleolus], ['rough_er', ...GLAND.er], ['golgi', ...GLAND.golgi], ['centriole', ...GLAND.centriole], ['secretory_vesicle', ...GLAND.granule], ['mitochondrion', ...GLAND.mito], ['lysosome', ...GLAND.lyso]] },
  ] },
  snack: { name: { tr: 'Alp’ın azığı', en: 'Alp’s trail food' }, levels: [
    { tag: { tr: '×1 Azık', en: '×1 Snacks' }, mode: 'plate', draw: PLATES.snack, callouts: [['walnut_kernel', -62, -44], ['lokum_sugar', 62, -50], ['leblebi', -56, 62], ['bread_starch', 64, 58]] },
    { tag: { tr: '×400 Ceviz hücreleri', en: '×400 Walnut cells' }, mode: 'plate', draw: PLATES.nutcell, callouts: st => { const c = [['oil_body', -20, 10], ['protein_body', ...NUTCELL.protein]]; if (st.stain) c.push(['sudan_test', 40, -60]); return c; } },
    { tag: { tr: '×20000 Kas hücresi', en: '×20000 Muscle cell' }, mode: 'plate', draw: PLATES.muscle, callouts: [['sarcomere', 36, -100], ['mitochondrion', -48, -10], ['cristae', -18, -10], ['glycogen', ...MUSCLE.gly], ['lipid_droplet', ...MUSCLE.lip]] },
  ] },
  blood: { name: { tr: 'Kan örnekleri · Elif ve Yusuf', en: 'Blood samples · Elif and Yusuf' }, levels: [
    { tag: { tr: '×1 Hematokrit', en: '×1 Haematocrit' }, mode: 'plate', draw: PLATES.hematocrit, callouts: [['rbc_column', 40, 50], ['buffy_coat', 40, -6], ['plasma', -40, -40]] },
    { tag: { tr: '×1000 Yayma', en: '×1000 Smear' }, mode: 'plate', draw: PLATES.blood, callouts: [['red_cell', -30, 40], ['neutrophil', -60, -50], ['lymphocyte', 70, 60], ['platelet', -90, 80]] },
  ] },
};

// ---------------------------------------------------------------- the lens itself
// In the valley the lens is a finder: it shows a live peek inside whatever it covers. Tapping (or clicking) the
// glass opens the specimen table (STUDY), where the actual learning happens. With a mouse it follows the cursor;
// on a touch screen it sits in front of the player and a tap anywhere else moves it there.
const LENS = {
  on: false, x: 0, y: 0, level: 0, target: null, lock: null, anim: 0, hover: null, _lvlT: 1,
  R() { return Math.min(G.set.board ? 190 : 165, Math.max(110, Math.min(G.vw, G.vh) * (G.set.board ? 0.27 : 0.24))); },
  toggle(v) {
    if (!G.S.flags.gotLens) { UI.toast(L({ tr: 'Merceğin henüz yok. Okuldaki masaya bak.', en: "You don't have the lens yet. Check the desk in the schoolhouse." }), '!'); return; }
    this.on = v == null ? !this.on : v;
    this.level = 0; this.lock = null; this.hover = null;
    if (this.on && G.pointer !== 'mouse') { const [sx, sy] = this._ahead(); this.x = sx; this.y = sy; }
    AU.sfx('lens');
    UI.lensHud();
    if (this.on && !G.demo && !G.S.flags.lensMarkHint) { G.S.flags.lensMarkHint = true; UI.toast(L({ tr: 'Altın halkalar henüz incelemediğin numuneleri gösteriyor.', en: 'Gold rings show specimens you haven’t examined yet.' }), '◎'); }
  },
  _ahead() { const p = W.player; return W.toScreen(p.x + ({ left: -80, right: 80 }[p.dir] || 0), p.y - 30 + ({ up: -70, down: 60 }[p.dir] || 0)); },
  state(tg) {
    const S = G.S, st = { lang: I18N.lang, t: G.t };
    if (!tg) return st;
    if (tg.ent) st.bloat = tg.ent.bloat || 0;
    if (tg.spec === 'pond') Object.assign(st, { algae: S.pond.algae, oxygen: S.pond.oxygen, fish: S.pond.fish, dead: S.pond.dead });
    if (tg.spec === 'river' || tg.river) Object.assign(st, { algae: 10, oxygen: 90, fish: 3, dead: 0 });
    if (tg.field) { const f = S.fields[tg.field]; st.pale = !!(f && f.yellow); st.ripe = f && f.stage >= 3; }
    if (tg.spec === 'pea') { st.seeds = tg.seeds || ['R', 'R', 'R', 'R', 'R', 'R']; st.wrinkled = st.seeds.filter(s => s === 'r').length > 3; }
    if (tg.spec === 'tree') st.rings = tg.rings || 30;
    if (tg.spec === 'cow') { st.nail = !!S.cases.hardware && !S.flags.magnetIn; st.magnet = !!S.flags.magnetIn; }
    if (tg.spec === 'dough') { st.risen = !!S.flags.doughFixed; st.yeastDead = !S.flags.doughFixed; }
    if (tg.spec === 'garden') st.salty = !S.flags.gardenFixed;
    if (tg.stain) st.stain = 1;
    return st;
  },
  pick(wx, wy) {
    const S = G.S;
    for (const a of W.actors) {
      if (a.hidden || !a.lens) continue;
      const box = { cow: [60, 72], dog: [30, 40], sheep: [26, 30], chicken: [12, 20], stork: [20, 42], frog: [12, 14], owl: [14, 32] }[a.kind] || [20, 30];
      if (Math.abs(wx - a.x) < box[0] && wy < a.y + 6 && wy > a.y - box[1]) return { spec: a.lens === 'frog' ? 'frog' : a.lens, ent: a, xray: SPECS[a.lens].levels[0].mode === 'xray' };
    }
    for (const a of W.actors) if (!a.hidden && a.kind === 'human' && Math.abs(wx - a.x) < 16 && wy < a.y + 4 && wy > a.y - 52) return { spec: 'nope', ent: a };
    for (const p of W.props) {
      if (!p.lens || (p.inside && W.inside !== p.inside)) continue;
      const h = p.kind === 'willowpot' ? 150 : 50;
      if (Math.abs(wx - p.x) < (p.kind === 'willowpot' ? 60 : 40) && wy < p.y + 10 && wy > p.y - h) return { spec: p.lens };
    }
    if (U.inRect(wx, wy, [2085, 1110, 150, 70]) && S.mendel && S.mendel.bed) return { spec: 'pea', seeds: MENDEL.podSeeds('bed') };
    if (W.inside === 'greenhouse' && U.inRect(wx, wy, [1905, 1015, 145, 60])) return { spec: 'pea', seeds: MENDEL.podSeeds('bench') };
    for (const tr of W.trees) {
      if (Math.abs(wx - tr.x) < 40 * tr.s && wy < tr.y + 4 && wy > tr.y - (tr.type === 'poplar' ? 240 : 170) * tr.s) return { spec: tr.type === 'willow' ? 'willow' : 'tree', rings: 18 + Math.floor(U.hash(tr.seed, 1, 1) * 50) };
    }
    const ter = W.terrainAt(wx, wy);
    if (ter === 'pond') return { spec: 'pond' };
    if (ter === 'river') return { spec: 'pond', river: true };
    if (ter.startsWith('field')) {
      const id = ter.slice(5), f = S.fields[id];
      if (f && f.crop === 'wheat') return { spec: 'wheat', field: id };
      if (f && f.crop === 'chickpea') return { spec: 'chickpea', field: id };
      return { spec: 'soil' };
    }
    if (ter === 'clover') return { spec: 'clover' };
    return { spec: 'soil' };
  },
  update(dt) {
    this.anim = U.clamp(this.anim + (this.on ? dt : -dt) * 5, 0, 1);
    this._lvlT = Math.min(1, this._lvlT + dt * 4);
    if (!this.on) return;
    const mouse = G.pointer === 'mouse' && G.mouse.active;
    // a soft lock (set by the wheel) lets go once the mouse wanders off the glass
    if (this.lock && this.lock.soft && mouse && Math.hypot(G.mouse.x - this.x, G.mouse.y - this.y) > this.R() * 1.3) { this.lock = null; this.level = 0; }
    let gx, gy;
    if (this.lock) [gx, gy] = this.lock.ent ? W.toScreen(this.lock.ent.x + this.lock.dx, this.lock.ent.y + this.lock.dy) : W.toScreen(this.lock.wx, this.lock.wy);
    else if (mouse) { gx = G.mouse.x; gy = G.mouse.y; }
    else [gx, gy] = this._ahead();
    const k = this.lock || !mouse ? 1 - Math.exp(-dt * 12) : 1;
    this.x += (gx - this.x) * k; this.y += (gy - this.y) * k;
    const [wx, wy] = W.toWorld(this.x, this.y), tg = this.pick(wx, wy);
    if (!this.target || !tg || tg.spec !== this.target.spec || tg.ent !== this.target.ent || tg.field !== this.target.field) { this.target = tg; this.level = 0; }
    this.hover = null;
    if (mouse && this.target && SPECS[this.target.spec]) {
      let best = 18;
      for (const c of this.callouts()) { const d = Math.hypot(c.sx - G.mouse.x, c.sy - G.mouse.y); if (d < best) { best = d; this.hover = c; } }
    }
  },
  callouts() {
    const tg = this.target, spec = tg && SPECS[tg.spec];
    if (!spec) return [];
    const lv = spec.levels[this.level], st = this.state(tg);
    const list = typeof lv.callouts === 'function' ? lv.callouts(st) : lv.callouts;
    return list.map(([id, px, py], i) => { const [sx, sy] = this._toScreen(lv, px, py); return { id, n: i + 1, sx, sy }; });
  },
  _toScreen(lv, px, py) {
    const R = this.R();
    if (lv.mode === 'plate') return [this.x + px * R / 130, this.y + py * R / 130];
    const e = this.target.ent, fl = this._flip(e);
    const [ex, ey] = W.toScreen(e.x + px * fl, e.y + py);
    const m = lv.mag || 1.3;
    return [this.x + (ex - this.x) * m, this.y + (ey - this.y) * m];
  },
  _flip(e) { if (e.kind === 'stork') return (e.face || 1) < 0 ? -1 : 1; return (e.face || -1) < 0 ? 1 : -1; },
  wheel(d) {
    if (!this.on || !this.target) return;
    const spec = SPECS[this.target.spec];
    if (!spec) return;
    const nl = U.clamp(this.level + d, 0, spec.levels.length - 1);
    if (nl === this.level) return;
    this.level = nl; this._lvlT = 0;
    if (nl > 0 && !this.lock) { const [wx, wy] = W.toWorld(this.x, this.y), e = this.target.ent; this.lock = e ? { ent: e, dx: wx - e.x, dy: wy - e.y, soft: true } : { wx, wy, soft: true }; }
    if (nl === 0 && this.lock && this.lock.soft) this.lock = null;
    AU.sfx('zoom', { up: d > 0 });
  },
  // a tap or click in the valley while the lens is out
  click(sx, sy, touch) {
    if (!this.on) return false;
    if (Math.hypot(sx - this.x, sy - this.y) < this.R() + 12) { this.openStudy(this.hover ? this.hover.id : null); return true; }
    if (touch) { this.place(sx, sy); return true; }
    if (this.lock) { this.lock = null; this.level = 0; return true; }
    return false;
  },
  place(sx, sy) {
    const [wx, wy] = W.toWorld(sx, sy), tg = this.pick(wx, wy);
    this.lock = tg && tg.ent ? { ent: tg.ent, dx: wx - tg.ent.x, dy: wy - tg.ent.y } : { wx, wy };
    this.level = 0;
    AU.sfx('click');
  },
  openStudy(focus) {
    const tg = this.target;
    if (!tg || !SPECS[tg.spec]) { AU.sfx('wrong'); return false; }
    return STUDY.open(tg, this.level, focus, [this.x, this.y]);
  },

  // ---------------- drawing ----------------
  // on a big board it isn't obvious what is worth a look: while the lens is out, everything that has a specimen gets a
  // small pulsing ring with a magnifier in it, gold if that specimen has never been opened, pale if it has
  _marks(ctx) {
    const S = G.S, dpr = G.dpr, seen = (S && S.journal.seen) || {}, t = G.t || 0, out = [], R0 = this.R();
    for (const a of W.actors) if (!W.inside && !a.hidden && a.lens && SPECS[a.lens]) out.push([a.x, a.y - 30, a.lens]);
    for (const p of W.props) if (p.lens && SPECS[p.lens] && (p.inside ? W.inside === p.inside : !W.inside)) out.push([p.x, p.y - 28, p.lens]);
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = 'round';
    for (const [wx, wy, sp] of out) {
      const [sx, sy] = W.toScreen(wx, wy);
      if (sx < -30 || sy < -30 || sx > G.vw + 30 || sy > G.vh + 30 || Math.hypot(sx - this.x, sy - this.y) < R0 * 0.95) continue;
      const fresh = !seen[sp], k = 0.5 + 0.5 * Math.sin(t * 3 + wx * 0.013), r = (G.set.board ? 19 : 14) + k * 3;
      ctx.globalAlpha = this.anim * (fresh ? 0.95 : 0.6);
      ctx.fillStyle = 'rgba(27,26,23,0.35)'; ctx.beginPath(); ctx.arc(sx, sy, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = fresh ? '#F2C744' : '#F7F2E4'; ctx.lineWidth = fresh ? 3 : 2; ctx.beginPath(); ctx.arc(sx, sy, r, 0, TAU); ctx.stroke();
      const g = r * 0.34; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(sx - g * 0.35, sy - g * 0.35, g, 0, TAU); ctx.moveTo(sx + g * 0.4, sy + g * 0.4); ctx.lineTo(sx + g * 1.3, sy + g * 1.3); ctx.stroke();
    }
    ctx.restore();
  },
  draw(ctx) {
    if (this.anim <= 0) return;
    this._marks(ctx);
    const R = this.R() * (0.6 + 0.4 * U.easeOutBack(this.anim)), dpr = G.dpr, lx = this.x, ly = this.y;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = this.anim;
    // shadow
    ctx.fillStyle = 'rgba(20,15,10,0.35)'; ctx.beginPath(); ctx.arc(lx + 6, ly + 8, R + 8, 0, TAU); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(lx, ly, R, 0, TAU); ctx.clip();
    ctx.fillStyle = C.ground; ctx.fillRect(lx - R, ly - R, R * 2, R * 2);
    ctx.strokeStyle = 'rgba(60,90,120,0.08)'; ctx.lineWidth = 1;
    for (let k = -R; k < R; k += 16) { ctx.beginPath(); ctx.moveTo(lx + k, ly - R); ctx.lineTo(lx + k, ly + R); ctx.moveTo(lx - R, ly + k); ctx.lineTo(lx + R, ly + k); ctx.stroke(); }
    const tg = this.target, spec = tg && SPECS[tg.spec];
    if (spec) {
      const lv = spec.levels[this.level], st = this.state(tg), k = U.easeOut(this._lvlT);
      ctx.save();
      ctx.globalAlpha *= k;
      if (lv.mode === 'plate') {
        ctx.translate(lx, ly); const s = R / 130 * (0.85 + 0.15 * k); ctx.scale(s, s);
        lv.draw(ctx, st);
      } else {
        const e = tg.ent, m = (lv.mag || 1.3) * (0.9 + 0.1 * k), [ex, ey] = W.toScreen(e.x, e.y);
        ctx.translate(lx, ly); ctx.scale(m, m); ctx.translate(-lx, -ly);
        ctx.translate(ex, ey); ctx.scale(CAM.z, CAM.z); ctx.scale(this._flip(e), 1);
        lv.draw(ctx, st);
      }
      ctx.restore();
      // numbered spots: a preview of what the table will explain
      for (const c of this.callouts()) {
        const found = !!G.S.journal.obs[c.id], hov = this.hover && this.hover.id === c.id;
        ctx.fillStyle = found ? C.ink : '#F7F2E4';
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(c.sx, c.sy, hov ? 10 : 8.5, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = found ? '#F7F2E4' : C.ink; ctx.font = '700 10px "Courier Prime", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(found ? String(c.n) : '?', c.sx, c.sy + 0.5);
        if (hov) {
          const txt = found ? L(OBS[c.id].title) : T('lens_found') + ' ' + c.n;
          ctx.font = '600 11px "Atkinson Hyperlegible Next", sans-serif';
          const w = ctx.measureText(txt).width + 10, tx = c.sx + 12, ty = c.sy - 8;
          ctx.fillStyle = 'rgba(247,242,228,0.92)'; ctx.fillRect(tx, ty, w, 16);
          ctx.strokeStyle = C.ink; ctx.lineWidth = 0.8; ctx.strokeRect(tx, ty, w, 16);
          ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText(txt, tx + 5, ty + 8.5);
        }
      }
    } else if (tg && tg.spec === 'nope') {
      ctx.fillStyle = C.ink; ctx.font = '600 15px "Caveat", cursive'; ctx.textAlign = 'center';
      ctx.fillText(tg.ent.id === 'deniz' ? L({ tr: '“Hey! Önce izin iste!”', en: '“Hey! Ask first!”' }) : L({ tr: '“İnsanlara bakmak? Sağlık ocağında, doktorla.”', en: '“Looking inside people? At the clinic, with the doctor.”' }), lx, ly);
    } else {
      ctx.fillStyle = 'rgba(27,26,23,0.55)'; ctx.font = '600 15px "Caveat", cursive'; ctx.textAlign = 'center';
      ctx.fillText(T('lens_nothing'), lx, ly);
    }
    // glass highlight
    const g = ctx.createRadialGradient(lx - R * 0.4, ly - R * 0.45, 2, lx - R * 0.4, ly - R * 0.45, R * 0.9);
    g.addColorStop(0, 'rgba(255,255,255,0.28)'); g.addColorStop(0.4, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(40,30,20,0.18)');
    ctx.fillStyle = g; ctx.fillRect(lx - R, ly - R, R * 2, R * 2);
    ctx.restore();
    // brass rim and handle
    const hx = lx + Math.cos(0.8) * R, hy = ly + Math.sin(0.8) * R;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(0.8);
    ctx.fillStyle = '#5E4330'; U.rr(ctx, 8, -8, 70, 16, 7); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,230,190,0.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, -4); ctx.lineTo(70, -4); ctx.stroke();
    ctx.fillStyle = '#C8A24E'; ctx.fillRect(0, -9, 12, 18); ctx.strokeStyle = C.ink; ctx.strokeRect(0, -9, 12, 18);
    ctx.restore();
    const rg = ctx.createLinearGradient(lx - R, ly - R, lx + R, ly + R);
    rg.addColorStop(0, '#E9CF7A'); rg.addColorStop(0.45, '#9A7428'); rg.addColorStop(0.7, '#D8B45A'); rg.addColorStop(1, '#6E5218');
    ctx.strokeStyle = rg; ctx.lineWidth = 11; ctx.beginPath(); ctx.arc(lx, ly, R + 4, 0, TAU); ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(lx, ly, R - 1.5, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(lx, ly, R + 9.5, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(60,40,10,0.7)'; ctx.lineWidth = 1;
    for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, r0 = R + (i % 4 ? 2 : 0.5), r1 = R + 6.5; ctx.beginPath(); ctx.moveTo(lx + Math.cos(a) * r0, ly + Math.sin(a) * r0); ctx.lineTo(lx + Math.cos(a) * r1, ly + Math.sin(a) * r1); ctx.stroke(); }
    // level pips on the rim
    if (spec) {
      const n = spec.levels.length;
      for (let i = 0; i < n; i++) { const a = -Math.PI / 2 - (n - 1) * 0.09 + i * 0.18, px = lx + Math.cos(a) * (R + 4), py = ly + Math.sin(a) * (R + 4); ctx.fillStyle = i === this.level ? '#A0322A' : '#F4EEDD'; ctx.beginPath(); ctx.arc(px, py, 4, 0, TAU); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.stroke(); }
    }
    // name tag, and under it the invitation to open the specimen table
    const name = spec ? L(spec.name) + ' · ' + L(spec.levels[this.level].tag) : '';
    ctx.font = '700 12px "Courier Prime", monospace';
    const tw = Math.max(ctx.measureText(name).width, 40) + 18, tx = lx - tw / 2, ty = ly + R + 16;
    if (name) {
      ctx.fillStyle = '#F4EEDD'; ctx.fillRect(tx, ty, tw, 22); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.strokeRect(tx, ty, tw, 22);
      ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(name.toLocaleUpperCase(I18N.lang === 'tr' ? 'tr-TR' : 'en'), lx, ty + 11.5);
      const label = T(G.pointer === 'mouse' ? 'lens_click' : 'lens_tap') + ' ▸';
      ctx.font = `700 ${G.set.board ? 15 : 13}px "Atkinson Hyperlegible Next", sans-serif`;
      const bh = G.set.board ? 32 : 26, bw = ctx.measureText(label).width + 28, bx = lx - bw / 2, by = ty + 30, pulse = G.reduceMotion ? 0 : Math.sin(G.t * 3) * 0.5 + 0.5;
      ctx.fillStyle = '#A0322A'; U.rr(ctx, bx, by, bw, bh, bh / 2); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.strokeStyle = `rgba(160,50,42,${0.5 * (1 - pulse)})`; ctx.lineWidth = 2; U.rr(ctx, bx - 3 - pulse * 4, by - 3 - pulse * 4, bw + 6 + pulse * 8, bh + 6 + pulse * 8, bh / 2 + 3 + pulse * 4); ctx.stroke();
      ctx.fillStyle = '#F4EEDD'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, lx, by + bh / 2 + 0.5);
    }
    ctx.restore();
  },
  // journal thumbnail of one plate or X-ray
  thumb(cv, specId, level, extra) {
    const spec = SPECS[specId]; if (!spec) return;
    const lv = spec.levels[Math.min(level, spec.levels.length - 1)], x = cv.getContext('2d'), w = cv.width, h = cv.height;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = C.ground; x.fillRect(0, 0, w, h);
    const st = Object.assign({ lang: I18N.lang, t: 1, bloat: 0, algae: G.S.pond.algae, oxygen: G.S.pond.oxygen, fish: 4, dead: 0, rings: 34 }, extra || {});
    x.save();
    if (lv.mode === 'plate') { x.translate(w / 2, h / 2); x.scale(w / 270, w / 270); lv.draw(x, st); }
    else { const sc = { cow: 1.3, sheep: 4, dog: 3.3, chicken: 7, stork: 4.2 }[specId] || 2; x.translate(w / 2, h * 0.8); x.scale(sc * w / 180, sc * w / 180); if (specId === 'cow') x.translate(8, 6); lv.draw(x, st); }
    x.restore();
    x.strokeStyle = C.ink; x.lineWidth = 1.5; x.strokeRect(0.5, 0.5, w - 1, h - 1);
  },
};
