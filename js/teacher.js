'use strict';
// Teacher dashboard (teacher.html): reads the progress files students send from the journal ("Send to teacher") and
// shows the class as a whole: which misconceptions came up, which outcomes were met, where the cases stand, which
// questions were hardest. Files are read in this browser only; nothing leaves the computer.
const TCH = {
  KEY: 'seedkeeper-teacher',
  list: [], demo: false, opened: new Set(), sort: 'name',
  S: {
    title: tr('Öğretmen paneli', 'Teacher dashboard'),
    sub: tr('Tohum Bekçisi · sınıfın ilerleme dosyaları', 'Seedkeeper · the class’s progress files'),
    drop: tr('Öğrencilerin oyundaki “Öğretmene gönder” düğmesiyle indirdiği <b>.json</b> dosyalarını buraya bırak ya da seç.', 'Drop the <b>.json</b> files your students downloaded with “Send to teacher” in the game here, or choose them.'),
    pick: tr('Dosya seç', 'Choose files'),
    hLive: tr('Canlı sınıf', 'Live class'),
    pLive: tr('Öğrenciler oyuna sınıf koduyla girince ilerlemeleri sizin Google tablonuza kendiliğinden gelir. Kodu yazın, şifrenizle getirin; sayfa her dakika yenilenir.', 'When students join the game with the class code, their progress reaches your Google Sheet by itself. Type the code and fetch it with your password; the page refreshes every minute.'),
    liveOff: tr('Canlı sınıf henüz kurulmadı. Kurmak için oyun klasöründeki <b>YAYINLAMA.md</b> dosyasındaki adımları izleyin (yaklaşık 10 dakika). O zamana kadar aşağıdaki dosya yöntemi çalışır.', 'The live class is not set up yet. To set it up, follow the steps in <b>YAYINLAMA.md</b> in the game folder (about 10 minutes). Until then the file method below works.'),
    lCls: tr('Sınıf kodu', 'Class code'), newCls: tr('Yeni kod üret', 'Make a new code'), lKey: tr('Öğretmen şifresi', 'Teacher password'), fetch: tr('Sınıfı getir', 'Fetch the class'),
    lLink: tr('Öğrencilere bu bağlantıyı verin (kod içinde):', 'Give your students this link (the code is built in):'), copy: tr('Kopyala', 'Copy'), copied: tr('Kopyalandı ✓', 'Copied ✓'),
    auto: tr('Her dakika kendiliğinden yenile', 'Refresh by itself every minute'),
    loading: tr('Getiriliyor…', 'Fetching…'), needKey: tr('Önce öğretmen şifresini yazın.', 'Type the teacher password first.'),
    badKey: tr('Şifre yanlış. Google tablosundaki Apps Script kodunda yazdığınız şifreyi girin.', 'Wrong password. Use the password you wrote into the Apps Script code of your Google Sheet.'),
    liveErr: tr('Tabloya ulaşılamadı. İnternet bağlantısını ve js/config.js içindeki adresi kontrol edin.', 'Couldn’t reach the sheet. Check the internet connection and the address in js/config.js.'),
    liveOk: tr('{c}: {n} öğrenci · {t} itibarıyla', '{c}: {n} students · as of {t}'), allCls: tr('Bütün sınıflar', 'All classes'),
    privacy: tr('Dosyalar yalnızca bu tarayıcıda okunur; hiçbir yere gönderilmez. Dosyalarda isim ya da e-posta yoktur; dosyayı öğrencinin adıyla kaydettirirseniz burada o ad görünür.', 'Files are read in this browser only and sent nowhere. They hold no names or e-mails; if students save the file under their name, that name shows here.'),
    demoBtn: tr('Örnek sınıfla dene', 'Try a sample class'),
    demoNote: tr('ÖRNEK VERİ: bu sayfa uydurma 24 öğrenciyle dolduruldu, gerçek öğrenci verisi değildir.', 'SAMPLE DATA: this page is filled with 24 made-up students, not real student data.'),
    clear: tr('Temizle', 'Clear'), print: tr('Yazdır', 'Print'), csv: tr('CSV indir', 'Download CSV'),
    empty: tr('Henüz dosya yok.', 'No files yet.'),
    bad: tr('Tohum Bekçisi dosyası değil, atlandı:', 'Not a Seedkeeper file, skipped:'),
    dup: tr('Bu dosya zaten yüklü, atlandı:', 'Already loaded, skipped:'),
    kStudents: tr('öğrenci', 'students'), kMinutes: tr('dk ortalama oyun', 'min average play'), kCases: tr('vaka ortalama çözüldü', 'cases solved on average'),
    kFirst: tr('ilk denemede doğru', 'right on the first try'), kSure: tr('“emin” ama yanlış cevap', '“sure” but wrong answers'),
    hMisc: tr('Sınıfın yanılgıları', 'The class’s misconceptions'),
    pMisc: tr('Bir sorunun ilk denemesinde seçilen yanlış seçenekler, arkasındaki yanlış fikre göre gruplandı. Çubuk, bu yanılgıya en az bir kez düşen öğrencilerin oranı.', 'Wrong options picked on the first try of a question, grouped by the wrong idea behind them. The bar is the share of students who fell for it at least once.'),
    wrong: tr('Yanlış fikir', 'Wrong idea'), right: tr('Doğrusu', 'What is right'), where: tr('Nerede çıktı', 'Where it came up'), open: tr('Tahtada aç', 'Open on the board'),
    sureN: tr('emin', 'sure'),
    noMisc: tr('Hiçbir yanılgı etiketi yok: ya herkes ilk denemede doğru bildi, ya da henüz soru cevaplanmadı.', 'No misconception tags: either everyone was right first time, or no questions have been answered yet.'),
    hNext: tr('Sonraki derse öneri', 'For the next lesson'),
    hBoard: tr('Akıllı tahtada bir ders', 'A lesson on the smart board'),
    hVotes: tr('Tahtadaki sınıf oyları', 'Class votes on the board'),
    pVotes: tr('Akıllı tahtada ✋ Sınıf oyu ile sorulan sorular: sınıf ilk el kaldırmada nasıl bölündü? Yeşil satır doğru şık. Yanlış şıkların altında, onları seçtiren yanlış fikir yazar.', 'Questions put to the class with ✋ Class vote on the board: how did the first show of hands split? The green row is the right option; under each wrong one is the wrong idea that makes it tempting.'),
    hands: tr('el', 'hands'),
    pBoard: tr('Oyunu tahtaya yansıtıp sınıfça oynamak için kısa bir yol haritası. Açmak için dokunun.', 'A short road map for playing on the board with the whole class. Tap to open.'),
    bHelp: tr('Mercek masasındaki yuvarlak **?** düğmesi bütün araçları simgeleri ve kısayol tuşlarıyla anlatır.', 'The round **?** button at the specimen table explains every tool with its icon and key.'),
    pNext: tr('En yaygın üç yanılgı. Bağlantı oyunu doğrudan o vakayla ya da numuneyle açar; tahtaya yansıtıp sınıfça tartışabilirsiniz.', 'The three most common misconceptions. The link opens the game straight on that case or specimen, ready to project and discuss as a class.'),
    hCurr: tr('Müfredat kapsamı', 'Curriculum coverage'),
    pCurr: tr('Maarif 2024 biyoloji kazanımları. Koyu: soruyu ilk denemede doğru cevapladı. Açık: oyunda karşılaştı. Boş: henüz karşılaşmadı. Sağdaki yüzde, o kazanımın sorularında ilk deneme başarısı.', 'Maarif 2024 biology outcomes. Dark: answered a question on it right first time. Light: met it in the game. Blank: not met yet. The percentage on the right is the first-try success on that outcome’s questions.'),
    lAns: tr('doğru cevapladı', 'answered right'), lMet: tr('karşılaştı', 'met'), lNot: tr('karşılaşmadı', 'not met'),
    hCases: tr('Vakalar', 'Cases'),
    lDone: tr('çözdü', 'solved'), lOpen: tr('devam ediyor', 'in progress'), lLocked: tr('açılmadı', 'not opened'),
    hQ: tr('En zor sorular', 'The hardest questions'),
    pQ: tr('İlk deneme başarısına göre sıralı, en zor en üstte.', 'Sorted by first-try success, hardest first.'),
    cQ: tr('Soru', 'Question'), cN: tr('Cevap', 'Answers'), cFirst: tr('İlk deneme', 'First try'), cTries: tr('Ort. deneme', 'Avg tries'), cSure: tr('Emin ama yanlış', 'Sure but wrong'),
    hStudents: tr('Öğrenciler', 'Students'),
    cFile: tr('Öğrenci', 'Student'), cMin: tr('Dakika', 'Minutes'), cCases: tr('Çözülen vaka', 'Cases solved'), cAnswers: tr('Cevap', 'Answers'), cMisc: tr('Yanılgılar', 'Misconceptions'), cDate: tr('Gönderildi', 'Sent'),
    find: tr('parçayı bul', 'find the part'), which: tr('hangi parça?', 'which part?'),
    remove: tr('Çıkar', 'Remove'),
    pStudents: tr('Bir öğrencinin adına dokunun: ilk denemede yanlış bildiği soruları ve seçtiği yanlış fikirleri görürsünüz. Yeşil nokta: şu an oynuyor.', 'Tap a student’s name to see the questions they missed on the first try and the wrong ideas they picked. Green dot: playing right now.'),
    sortName: tr('A–Z', 'A–Z'), sortFirst: tr('En düşük doğru oranı', 'Lowest first-try rate'),
    needHelp: tr('desteğe ihtiyacı olabilir', 'may need support'), active: tr('şu an oynuyor', 'playing now'),
    dSolved: tr('Çözdüğü vakalar:', 'Cases solved:'), dOpen: tr('Devam eden:', 'In progress:'), dRight: tr('İlk denemede doğru:', 'Right on the first try:'),
    dMiss: tr('İlk denemede yanlış bildiği sorular', 'Questions missed on the first try'), dIdea: tr('Seçtiği yanlış fikir', 'The wrong idea picked'),
    noMiss: tr('İlk denemede yanlış bildiği soru yok.', 'No questions missed on the first try.'),
    trimmed: tr('Çok uzun oynandığı için en eski {n} cevap tabloya sığmadı; oranlar son cevaplardan hesaplandı.', 'Played so long that the oldest {n} answers did not fit the sheet; the rates come from the recent ones.'),
    dVote: tr('sınıf oyu:', 'class vote:'),
  },

  init() {
    try { const s = JSON.parse(localStorage.getItem(this.KEY) || 'null'); if (s && Array.isArray(s.list)) { this.list = s.list; this.demo = !!s.demo; } } catch (e) { }
    try { const l = localStorage.getItem(this.KEY + '-lang'); if (l === 'en' || l === 'tr') I18N.lang = l; } catch (e) { }
    // ?ornek=1 fills the page with the sample class straight away
    if (/[?&]ornek=1/.test(location.search)) { this.demoAct(); if (/[?&]acik=1/.test(location.search) && this.list[0]) { this.opened.add(this.skey(this.list[0])); this.render(); } } else this.render();
    this.liveStart();
    document.documentElement.dataset.booted = '1';
  },
  // ---------------------------------------------------------------- the live class (the teacher's Google Sheet, CONFIG.syncUrl)
  liveUrl() { return (typeof CONFIG !== 'undefined' && CONFIG.syncUrl) || ''; },
  liveCfg() {
    if (!this.lv) { try { this.lv = JSON.parse(localStorage.getItem(this.KEY + '-live') || 'null'); } catch (e) { } this.lv = this.lv || { cls: '', key: '', auto: true }; }
    return this.lv;
  },
  code(s) { return String(s || '').toLocaleUpperCase('tr').replace(/İ/g, 'I').replace(/[^A-Z0-9-]/g, '').slice(0, 24); },
  readLive() {
    const lv = this.liveCfg(), c = document.getElementById('lv-cls'), k = document.getElementById('lv-key'), a = document.getElementById('lv-auto');
    if (c) lv.cls = this.code(c.value); if (k) lv.key = k.value.trim(); if (a) lv.auto = a.checked;
    try { localStorage.setItem(this.KEY + '-live', JSON.stringify(lv)); } catch (e) { }
    return lv;
  },
  studentLink(cls) { return new URL('index.html?sinif=' + encodeURIComponent(cls), location.href).href; },
  liveHtml() {
    const e = U.esc, t = k => this.t(k), lv = this.liveCfg();
    if (!this.liveUrl()) return `<section class="live off"><h2>${e(t('hLive'))}</h2><p class="small">${t('liveOff')}</p></section>`;
    const link = lv.cls ? this.studentLink(lv.cls) : '';
    return `<section class="live"><h2>${e(t('hLive'))}</h2><p class="lead">${e(t('pLive'))}</p>
      <div class="live-row">
        <label><span>${e(t('lCls'))}</span><input id="lv-cls" maxlength="24" value="${e(lv.cls)}" placeholder="10A-K7P2" autocomplete="off" spellcheck="false"></label>
        <button class="btn ghost" data-act="newCls">${e(t('newCls'))}</button>
        <label><span>${e(t('lKey'))}</span><input id="lv-key" type="password" value="${e(lv.key)}" autocomplete="current-password"></label>
        <button class="btn big" data-act="fetch">${e(t('fetch'))}</button>
      </div>
      ${link ? `<p class="live-link">${e(t('lLink'))}<br><a href="${e(link)}" target="_blank" rel="noopener">${e(link)}</a> <button class="btn small" data-act="copy">${e(this.copied ? t('copied') : t('copy'))}</button></p>` : ''}
      <label class="small auto"><input type="checkbox" id="lv-auto" ${lv.auto ? 'checked' : ''}> ${e(t('auto'))}</label>
      ${this.liveMsg ? `<p class="live-msg">${e(this.liveMsg)}</p>` : ''}</section>`;
  },
  newClsAct() {
    const lv = this.readLive(), a = new Uint8Array(4); crypto.getRandomValues(a);
    const base = (lv.cls.split('-')[0] || 'SINIF').slice(0, 12);
    lv.cls = base + '-' + [...a].map(b => 'ABCDEFGHJKLMNPRSTUVYZ23456789'[b % 29]).join('');
    this.copied = false;
    try { localStorage.setItem(this.KEY + '-live', JSON.stringify(lv)); } catch (e) { }
    this.render();
  },
  async copyAct() {
    const lv = this.liveCfg();
    try { await navigator.clipboard.writeText(this.studentLink(lv.cls)); this.copied = true; } catch (e) { }
    this.render();
  },
  async fetchAct(quiet) {
    const lv = quiet ? this.liveCfg() : this.readLive(), t = k => this.t(k);
    if (!this.liveUrl()) return;
    if (!lv.key) { this.liveMsg = t('needKey'); this.render(); return; }
    if (!quiet) { this.liveMsg = t('loading'); this.render(); }
    try {
      const u = this.liveUrl() + '?key=' + encodeURIComponent(lv.key) + '&class=' + encodeURIComponent(lv.cls) + '&_=' + Date.now();
      const j = await (await fetch(u)).json();
      if (!j.ok) { this.liveMsg = j.err === 'sifre' ? t('badKey') : t('liveErr'); this.render(); return; }
      this.list = (j.students || []).filter(s => s.data && s.data.cases).map(s => ({ name: s.name || '#' + String(s.sid).slice(0, 5), data: s.data, live: true, cls: s.cls, sid: s.sid }));
      this.demo = false; this.save();
      const time = new Date().toLocaleTimeString(I18N.lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
      this.liveMsg = this.t('liveOk').replace('{n}', this.list.length).replace('{t}', time).replace('{c}', lv.cls || this.t('allCls'));
    } catch (e) { this.liveMsg = t('liveErr'); }
    this.render();
  },
  liveStart() {
    const lv = this.liveCfg();
    if (!this.liveUrl()) return;
    if (lv.auto && lv.key) this.fetchAct(true);
    setInterval(() => { const l = this.liveCfg(); if (l.auto && l.key && !document.hidden) this.fetchAct(true); }, 60000);
  },
  save() { try { localStorage.setItem(this.KEY, JSON.stringify({ list: this.list, demo: this.demo })); } catch (e) { } },
  t(k) { return L(this.S[k]); },

  // ---------------------------------------------------------------- reading files
  async read(files) {
    const notes = [];
    if (this.demo) { this.list = []; this.demo = false; }
    for (const f of files) {
      let d = null;
      try { d = JSON.parse(await f.text()); } catch (e) { }
      if (!d || typeof d !== 'object' || !/Seedkeeper/.test(d.game || '') || !d.cases) { notes.push(this.t('bad') + ' ' + f.name); continue; }
      if (this.list.some(s => s.data.exported === d.exported && s.name === f.name)) { notes.push(this.t('dup') + ' ' + f.name); continue; }
      this.list.push({ name: f.name.replace(/\.json$/i, ''), data: d });
    }
    this.save(); this.render(notes);
  },

  // ---------------------------------------------------------------- the class, added up
  stats() {
    const L_ = this.list, n = L_.length, misc = {}, qs = {}, curr = {}, cases = {};
    let ans = 0, first = 0, sure = 0, min = 0, solved = 0;
    for (const s of L_) {
      const d = s.data, seen = new Set();
      min += (d.time && d.time.minutesPlayed) || 0;
      for (const id in d.cases || {}) {
        const c = d.cases[id]; (cases[id] = cases[id] || { done: 0, open: 0, locked: 0 })[c.state] = (cases[id][c.state] || 0) + 1;
        if (c.state === 'done' && id !== 'intro') solved++;
      }
      for (const a of d.answers || []) {
        ans++; if (a.firstTryCorrect) first++; if (a.confident && !a.firstTryCorrect) sure++;
        const q = qs[a.question] = qs[a.question] || { id: a.question, code: a.code, n: 0, first: 0, tries: 0, sure: 0 };
        q.n++; q.tries += a.tries || 1; if (a.firstTryCorrect) q.first++; if (a.confident && !a.firstTryCorrect) q.sure++;
        const cc = curr[a.code] = curr[a.code] || { n: 0, first: 0 }; cc.n++; if (a.firstTryCorrect) cc.first++;
        if (a.misconception) {
          const m = misc[a.misconception] = misc[a.misconception] || { tag: a.misconception, students: new Set(), times: 0, sure: 0, qs: new Set() };
          m.times++; m.qs.add(a.question); if (a.confident) m.sure++;
          if (!seen.has(a.misconception)) { seen.add(a.misconception); m.students.add(s); }
        }
      }
    }
    const status = {};
    for (const s of L_) for (const [code, v] of Object.entries(s.data.curriculum || {})) { const r = status[code] = status[code] || { answered: 0, met: 0 }; if (v === 'answered') r.answered++; else if (v === 'met') r.met++; }
    return { n, misc: Object.values(misc).sort((a, b) => b.students.size - a.students.size || b.times - a.times), qs: Object.values(qs), curr, status, cases, ans, first, sure, min: n ? min / n : 0, solved: n ? solved / n : 0 };
  },
  // where a question lives in the game, what it asked, and a link that opens it on the board
  qInfo(id) {
    const q = QS[id];
    if (q) return { text: L(q.prompt), where: q.case && CASES[q.case] ? L(CASES[q.case].title) : '', link: q.case ? `index.html?ders=${q.case}&tahta=1` : null };
    const m = /^rev:(\w+):(\d+)(?::(find|which))?$/.exec(id || '');
    if (m) {
      const sp = SPECS[m[1]], lv = sp && sp.levels[+m[2]], key = m[1] + ':' + m[2];
      const where = sp ? `${L(sp.name)} · ${L(lv.tag)}` : key;
      return { text: !m[3] && REVIEW[key] ? L(REVIEW[key].prompt) : `${where}: ${this.t(m[3] === 'find' ? 'find' : 'which')}`, where, link: sp ? `index.html?numune=${m[1]}&tahta=1` : null };
    }
    // a design the student made for one of the villagers' questions (design.js)
    const d = /^design:(\w+)$/.exec(id || ''), dq = d && typeof DESIGN !== 'undefined' && DESIGN.QUESTIONS.find(x => x.k === d[1]);
    if (dq) return { text: L(dq.q), where: L(tr('Deneyini tasarla', 'Design your own experiment')), link: null };
    return { text: id, where: '', link: null };
  },

  // ---------------------------------------------------------------- a lesson on the smart board
  // a short road map through the board tools, in the order a 40-minute lesson might use them. A step is a lead sentence,
  // then "\n- " lines: one tool a line with its name in bold, easy to find in a hurry before class
  BOARD: [
    [tr('Hazırlık', 'Before the lesson'), tr('Oyunda Ayarlar → **Akıllı tahta modu**nu açın (aynı düğme **Vaka ve deney seç** penceresinin en üstünde de var). Düğmeler parmak boyuna büyür; vadide Yarış, Süre · Kura ve Tam ekran düğmeleri çıkar.\n- **Projektörde canlı renk**: renkler projektörde soluk görünürse bunu da açın (tahta modunun hemen altında).\n- **Kalem** sekmesi (sol kenarın ortası): her ekranın (tezgâh, soru kartı, mektup, vadi) üstüne çizer. Üç renk, fosforlu kalem, lazer, Geri al ve Temizle. Mercek masasındaki gibi, çizginin sonunda parmak yarım saniye beklerse şekil düzelir (düz çizgi, elips, dikdörtgen). Çizim o ekrana aittir; pencere kapanınca silinir.\n- **Vaka ve deney seç**: istediğiniz vakayı ya da deneyi doğrudan açar. Bu uygulama oyunları kaydedilmez, öğrencilerin ilerlemesini bozmaz. Arama kutusunun altındaki tür düğmeleri (Vakalar, Deneyler, Mikroskop, Etkinlikler) listede o bölüme atlar.\n- **Görünümler**: göstermek istediğiniz yerleri mercek masasında **Görünüm → + Bu görünümü kaydet** ile önceden kaydedin. Her görünümün altındaki ✎ ile bir soru ya da not yazın (sunumda altta büyük görünür), ◀ ▶ ile sırasını değiştirin. Derste **Görünüm → ▶ Sırayla göster** bunları slayt gibi tek tek açar; sunum kumandası da çalışır.\n- **🔗 Bağlantıyı al**: evde hazırladıysanız bağlantıyı kendinize gönderin ve tahtadaki bilgisayarda açın (yayınlanan sürümde).\n- **Sunum kumandası**: kumandanın ileri tuşu (PageDown, bazılarında →) hikâyeyi de yürütür: konuşmayı ilerletir, bilgi kartını ve mevsim kartpostalını kapatır, düşünme süresini bitirip şıkları açar, cevaplanmış sorudan devam eder, Yarış’ta sonraki hedefe geçer. Şık seçmez: cevabı sınıf oyu ya da tahtaya gelen öğrenci verir. Geri tuşu (PageUp ya da ←) ve konuşma kutusundaki **↶** düğmesi, kaçıran öğrenciler için önceki satırları konuşanıyla yeniden gösterir (her basışta bir satır daha geri); ileri tuşu ya da karta dokunmak, bir şey atlamadan o anki satıra döner.', 'In the game, open Settings → **Smartboard mode** (the same switch sits at the top of **Pick a case or experiment**). Buttons grow to finger size; Race, Timer · Draw and Full screen appear in the valley.\n- **Vivid colour for projectors**: turn it on too if colours look washed out on the projector (just below the smartboard switch).\n- The **pen** tab (halfway down the left edge): draws over any screen (a bench, a question card, a letter, the valley). Three inks, the highlighter, the laser, Undo and Clear. As on the specimen table, a line held still for half a second at its end tidies up (a straight line, an ellipse, a rectangle). The ink belongs to that screen and goes when the window closes.\n- **Pick a case or experiment**: opens any case or bench directly. These practice games are never saved and never touch the students’ progress. The kind buttons under the search box (Cases, Experiments, Microscope, Activities) jump to that part of the list.\n- **Views**: save the spots you want to show at the specimen table with **Views → + Save this view**. Write a question or note on each with ✎ (shown big when presenting) and change their order with ◀ ▶. In the lesson, **Views → ▶ Present in order** opens them one by one like slides; a presentation clicker works too.\n- **🔗 Get a link**: if you prepared at home, send it to yourself and open it on the board’s computer (on the published version).\n- **Presentation clicker**: its forward key (PageDown, → on some) runs the story too: it moves the dialogue on, closes an info card and the season postcard, ends the thinking time so the options open, goes on from an answered question and moves the Race to its next target. It never picks an option: the class vote or the student at the board gives the answer. The back key (PageUp or ←) and the **↶** button in the dialogue box bring back the lines just said, with who said them, for pupils who missed one (one line further back a press); the forward key or a tap on the card returns to the current line without skipping anything.')],
    [tr('Açılış · 5 dk', 'Opening · 5 min'), tr('Bir vakanın ilk sorusunu tahtada açın.\n- ✋ **Sınıf oyu** (soru kartında): el kaldıranları sayın; en çok oy alan şık sınıfın cevabı olur ve oyların dağılımı kaydedilir. Böylece sınıftaki yanılgıları ilk dakikada görürsünüz. Yanlış sayılan bir eli **↶ Son eli geri al** düzeltir; sayılan el toplamını sınıf mevcuduyla karşılaştırabilirsiniz.\n- **Sınıfa düşünme süresi** (Ayarlar): şıkları birkaç saniye kilitler, herkes önce düşünür.\n- **Yakın çekim** (mercek masası): görüntü bir parçanın çok yakınından, adlar gizli başlar; sınıf ne olduğunu tahmin eder.\n- **Perde** (mercek masası): görüntü örtülür, sınıf parmakla açılan deliklerden tahmin eder.', 'Open a case’s first question on the board.\n- ✋ **Class vote** (on the question card): count raised hands; the top option becomes the class’s answer and the split is saved, so the class’s misconceptions show in the first minute. **↶ Undo last hand** fixes a miscount, and the running total can be checked against the class size.\n- **Thinking time for the class** (Settings): locks the options for a few seconds so everyone thinks first.\n- **Close-up** (specimen table): the view begins very near one part with the names hidden, and the class guesses what it is.\n- **Curtain** (specimen table): the chart is covered and the class guesses from the holes rubbed in it.')],
    [tr('Gözlem · 15 dk', 'Looking · 15 min'), tr('Mercek masasında:\n- **Işık**: her yeri karartıp tek parçayı aydınlatır (daire küçük, orta ya da büyük).\n- **Büyüteç**: ayrıntıyı 2, 3 ya da 5 kat büyütür. Parmak kalkınca cam yerinde kalır; siz kenara çekilip anlatırken sınıf ayrıntıya bakar (camı tutup kaydırabilirsiniz).\n- **Kalem** şeridi: dört renk, **Fosforlu** kalem, **Lazer** (çizgisi bir iki saniyede kendiliğinden kaybolur; konuşurken göstermek içindir), düz **Ok** ve **Numara** (görüntüye 1, 2, 3 diye işaret koyar: “2 numara ne?”).\n- **Şekil düzeltme**: çizginin sonunda parmak yarım saniye beklerse titrek çizgi dümdüz, yuvarlak düzgün bir elips, kutu düzgün bir dikdörtgen olur; bir parçanın çevresine temiz bir halka çizmek için.\n- **Geri al** yalnızca son çizgiyi siler; **Silgi** parmağın üstünden geçtiği çizgileri siler, ötekiler kalır.\n- **Say**: öğrenciler tahtaya gelip hücreleri tek tek sayar. İki tür ayrı sayılır (canlı ve ölü maya, bölünen ve bölünmeyen hücre), toplam ve yüzde köşede büyük yazılır. Her öğrencinin sayımı **Kaydet** ile bir tabloya yazılır; **Tablo** ortalamayı ve bütün sayımların yüzdesini verir, hesap tablosuna da kopyalanır.\n- **Cetvel**: gerçek uzunluğu ölçek çubuğundan hesaplar: "Bu hücre kaç µm?" Yakınlaşınca sağ alt köşede yakınlığa göre değişen bir ölçek çubuğu da çıkar.\n- **Yan yana**: iki görüntüyü birlikte gösterir, örneğin soğan zarı ile yanak hücresini.\n- **Karşılaştır → Kaydırmalı** (karşılaştırması olan katmanlarda, üstteki şeritten): hasta ve sağlıklı hâl aynı görüntüde durur; ortadaki çizgiyi sürükleyin, fark tam çizginin geçtiği yerde görünür.\n- **Göz** (G, alt çubukta): parçaların halkalarını gizler, sınıf numuneye çıplak bakar.\n- **Kareler** (K): görüntüye harfli ve numaralı kareler koyar: “C4 karesine bakın” diye yer tarif edilir. Ölçeği olan görüntülerde bir karenin gerçek boyu yazar; kaç kare kapladığını sayıp alan tahmin edilir.\n- **Sade** (F): başlığı ve çubukları gizler, numune bütün tahtayı kaplar; soldaki küçük şeritte temel araçlar kalır, Esc hepsini geri getirir.\n- **Görünümler**: kaydettiğiniz görünümlere tek dokunuşla dönersiniz; aynı karttan başka bir numuneye de geçilir.\n- **Çerçevele** (B): tahta iki parmakla yakınlaştırmayı iyi algılamıyorsa basın ve bakmak istediğiniz yerin çevresine parmakla bir çerçeve çizin; görüntü o çerçeveyi dolduracak kadar yaklaşır.\n- **Genel bakış**: çok yakınlaşınca sol altta küçük bir harita çıkar; numunenin tamamını ve nereye bakıldığını gösterir, dokunulan yere görüntüyü götürür.\n- **⏸ Durdur · ½ Yavaşlat** (D ve Y): hareketli görüntülerde (kılcal damarda ve alveollerde O₂ ile CO₂, düşen mantar sporları) görüntünün sağ üst köşesinde çıkar. Hareketi dondurup tek bir noktayı gösterin ya da yarı hıza indirip sınıfın bir noktanın yolunu izlemesini sağlayın.', 'At the specimen table:\n- **Spotlight**: darkens everything but one part (a small, medium or large circle).\n- **Magnifier**: enlarges a detail 2, 3 or 5 times. Lift your finger and the glass stays put, so the class keeps looking while you step aside (hold the glass to slide it).\n- The **Pen** strip: four inks, a **Highlight** pen, a **Laser** whose line fades by itself in a second or two (for pointing while you talk), a straight **Arrow** and **Number** pins that put 1, 2, 3 on the chart (“what is number 2?”).\n- **Shape tidying**: hold the finger still for half a second at the end of a line and a shaky line turns straight, a loop into a clean ellipse, a box into a clean rectangle; for a neat ring round a part.\n- **Undo** takes back only the last line; **Eraser** lifts just the lines the finger sweeps across and leaves the rest.\n- **Count**: students come up and count cells one by one. Two kinds are counted apart (live and dead yeast, dividing and resting cells), and the total and the share are written big in the corner. **Save** writes each student’s count into a table; **Table** gives the mean and the share over all counts, and copies into a spreadsheet.\n- **Ruler**: works out real lengths from the scale bar (“how many µm is this cell?”). Zoom in and a scale bar in the bottom-right corner keeps up with the zoom.\n- **Side by side**: shows two charts together, e.g. onion skin and a cheek cell.\n- **Compare → Slider** (on layers with a comparison, from the strip above): the sick and the healthy state share one picture, and the difference shows right where you drag the line.\n- The **eye** (G, in the footer): hides the part rings so the class sees the bare specimen.\n- **Grid** (K): lays lettered, numbered squares over the chart: “look at C4”. On charts with a scale it gives one square’s real size, so an area can be estimated by counting squares.\n- **Clean** (F): hides the title and the bars so the specimen fills the board; a small strip on the left keeps the basic tools, and Esc brings everything back.\n- **Views**: your saved views are one tap away, and the same card switches to another specimen.\n- **Frame** (B): if the board reads a two-finger pinch badly, press it and draw a box round what you want to see; the view zooms in until the box fills it.\n- **Overview**: zoom in far and a small map appears bottom left; it shows the whole specimen and where you are, and takes the view wherever you tap.\n- **⏸ Stop · ½ Slow** (D and Y): on moving charts (O₂ and CO₂ at the capillary and the alveoli, falling mushroom spores) they sit in the view’s top right corner. Freeze the movement to point at one dot, or halve its speed so the class can follow one dot’s path.')],
    [tr('Deney · 10 dk', 'Experiment · 10 min'), tr('Deney masalarında hiçbir deney başarısız olamaz: büyük düğme her zaman bir sonraki doğru adımı yapar. Öğrencileri sırayla tahtaya çağırın; kimin geleceğini **Süre · Kura** panelindeki **Bir ad çek** seçsin (sınıf listesi bir kez yazılır, herkes çekilene kadar kimse iki kez çıkmaz). Sınıf ne olacağını önceden tahmin etsin.\n- **Sonuçlar ↓** (kartın sağ alt köşesi): tahtada sonuç tablosu ve grafik resmin altındadır; bu düğme oraya iner (yeni bir sonuç gelince yanıp söner), **Resim ↑** geri çıkar. Tablodaki en yeni satır, bir sonraki sonuca kadar sarıdır.\n- **⤢** (mesajın sağında): deneyin resmini ekranı dolduracak kadar büyütür. Mesaj ve büyük düğmeler (Başlat gibi) yanında kalır, resme dokunmak da çalışır. Resmin altındaki sarı şerit son sonucu tablodaki başlıklarıyla yazar; **Küçült** geri getirir. Şeride dokunmak (📈) bütün sonuçların grafiğini resmin yerine büyük ve keskin gösterir; yeni sonuç gelince grafik kendini günceller, 💾 o sırada grafiği kaydeder, grafiğe dokunmak resme döner. **?** (büyük görünümün sol üst köşesinde, ya da H tuşu) bu düğmelerin hepsini birer satırla anlatır.\n- **⏸ · ½ · 1×** (büyük görünümde): **⏸** deneyi dondurur (resmin üstüne çizip konuşmak için), **½** yarı hızda oynatır, **1×** normale döner. Donmuşken **⏭** deneyi bir an (onda bir saniye kadar) ilerletip yeniden dondurur: kabarcıkları tek tek saymak, balonun şişişini adım adım izlemek için.\n- **🤔 Tahmin** (büyük görünümde, Küçült’ün yanında): deneyi başlatmadan önce sınıfın tahminini parmak boyundaki sayı tuşlarıyla girin (örneğin kaç kabarcık çıkacak). Tahmin alttaki sarı şeridin ucunda bekler; deney bitince sonucun yanına yazılır ve fark gösterilir (“Tahmin 12 → çıkan 9: 3 fazla”). Birden çok satırlık sonuçta tahmine en yakın satır söylenir. Üstüne dokunmak (✕) tahmini siler. Önce tahmin, sonra gözlem, sonra açıklama. Mendel’in F2 hasadında da aynı düğme var: bezelyeler sayılmadan önce sınıf kaçının buruşuk çıkacağını tahmin eder; sayım bitince tahmin, sayım ve 3 : 1’e göre beklenen sayı yan yana yazılır.\n- **📷 Anı al** (büyük görünümde): o anı saklar (son üçü, tezgâh açık kaldıkça). Küçük resmine dokununca o an resmin sol yarısına gelir, sağ yarıda canlısı durur. Aradaki sarı çizgiyi sürükleyerek önceyi ve şimdiyi karşılaştırın: çimlenen tohum, şişen balon. Anıya dokununca canlıya dönülür.\n- **🔍** (büyük görünümde, 📷’nin yanında): büyüteç. Açıkken resme dokunan parmağın hemen üstünde, resmi üç kat yakından gösteren yuvarlak bir pencere açılır ve parmağı izler; hareket eden deney de, üstteki anı da içinde görünür. Açıkken resim dokunuşa cevap vermez (büyük düğmeler çalışır). Parmak kalkınca pencere olduğu yerde kalır; öğretmen kenara çekilip anlatabilir. Pencereyi parmakla sürüklemek onu kaydırır, resmin başka bir yerine dokunmak oraya taşır; kenarındaki yuvarlak düğme büyütmeyi değiştirir (2×, 3×, 5×); yeniden 🔍 kapatır. Metal dedektörü, terazi ve Mendel masasında büyük görünüm yok; orada 🔍 resmin sağ üst köşesindedir (dedektörde sol üst, çünkü sağ üstte sinyal göstergesi var) ve aynı işi görür.\n- **Klavye ya da sunum kumandası** (büyük görünümde): **→** (kumandanın ileri tuşu, PageDown) deneyi dondurur, sonra her basışta bir an ilerletir; **←** (geri tuşu, PageUp) yeniden oynatır. **K** dondurur ya da oynatır, **M** büyüteci açıp kapatır, **Esc** resmi küçültür. Basılan tuşun düğmesi bir an yanar; öğretmen sınıfın arasında dolaşırken de deneyi kumandayla adım adım gösterebilir.', 'No experiment on the benches can fail: the big button always does the next right step. Call students up in turn, and let **Draw a name** in the **Timer · Draw** panel pick who comes (type the class list once; nobody comes up twice until everyone has). Let the class predict first.\n- **Results ↓** (the card’s bottom-right corner): on the board the results table and chart sit below the picture; this goes down to them (it flashes when a new result comes in), and **Picture ↑** goes back up. The newest row of the table stays yellow until the next result.\n- **⤢** (at the end of the message line): blows the bench’s picture up to fill the screen. The message and the big buttons (such as Start) stay beside it, and taps on the picture still work. The yellow strip under the picture gives the latest result under the table’s headings; **Smaller** brings it back. A tap on the strip (📈) shows the chart of all the results big and sharp in the picture’s place; it redraws itself when a new result comes in, 💾 saves the chart meanwhile, and a tap on the chart goes back to the picture. **?** (the big view’s top-left corner, or the H key) explains all these buttons, a line each.\n- **⏸ · ½ · 1×** (in the big view): **⏸** freezes the experiment (to draw on it and talk), **½** plays it at half speed and **1×** goes back to normal. While frozen, **⏭** moves the experiment on by a moment (about a tenth of a second) and freezes it again: to count bubbles one at a time, or watch a balloon swell a breath at a time.\n- **🤔 Guess** (in the big view, beside Smaller): before starting, type in the class’s guess on the fingertip number pad (how many bubbles, say). The guess waits at the end of the yellow strip below; when the run ends it is set beside the result with the gap (“Guess 12 → got 9: 3 over”). For a result of several rows it names the row nearest the guess. A tap on it (✕) clears it. Predict, observe, then explain. Mendel’s F2 harvest has the same button: before the peas are counted, the class guesses how many will be wrinkled; once counted, the guess, the count and what 3 : 1 would give are set side by side.\n- **📷 Snapshot** (in the big view): keeps the moment (the last three, while the bench stays open). Tap its thumbnail and that moment fills the left half of the picture with the live one on the right. Drag the yellow divider to compare then and now: a seed that sprouted, a balloon that swelled. Tap the snapshot to go back to live.\n- **🔍** (in the big view, beside 📷): the magnifier. While it is on, a round window three times closer opens just above the finger touching the picture and follows it; the moving experiment and a snapshot laid over it both show in it. While it is on the picture takes no taps (the big buttons still work). Where the finger lifts, the window stays, so the teacher can step aside and talk; dragging the window slides it along, and a touch elsewhere on the picture takes it there; the round chip on its rim changes the power (2×, 3×, 5×); 🔍 again turns it off. The metal detector, the scale and Mendel’s bench have no big view; there 🔍 sits in the picture’s top-right corner (top-left on the detector, whose signal gauge is top-right) and does the same.\n- **Keyboard or presentation clicker** (in the big view): **→** (the clicker’s forward key, PageDown) freezes the experiment, then each press moves it on by a moment; **←** (its back key, PageUp) plays it again. **K** freezes or plays, **M** turns the magnifier on or off, **Esc** makes the picture small again. The button for the key lights up for a moment; the teacher can walk among the class and still step the experiment on with the clicker.')],
    [tr('Pekiştirme · 7 dk', 'Practice · 7 min'), tr('- **Etiketle**: adlar görüntüdeki halkalara sürüklenir; iki yanlıştan sonra doğru halka parlar.\n- **Tekrar soruları** (mercek masası): burada da ✋ Sınıf oyu var.\n- **Süre**: 2 dakika verin, öğrenciler şemayı defterlerine çizsin.', '- **Label it**: the names are dragged onto the rings; after two misses the right ring glows.\n- **Review questions** (specimen table): the ✋ Class vote works here too.\n- **Timer**: give 2 minutes for the students to draw the chart in their notebooks.')],
    [tr('Kapanış · 3 dk', 'Closing · 3 min'), tr('- **Fotoğraf**: tahtadaki şemayı çizimleriyle birlikte resim olarak kaydeder; sınıf sayfasına ya da ödev kâğıdına koyabilirsiniz.\n- **💾** (tezgâhın büyük görünümünde, 🔍’nin yanında): deneyin o anki resmini üstüne çizilenlerle, son sonuçla ve sınıfın tahminiyle birlikte tek bir resim olarak kaydeder (İndirilenler klasörüne). Üstte bir anı açıksa önce-şimdi karşılaştırması da resme girer.\n- Bir sonraki derse bu paneldeki "Sonraki derse öneri" listesiyle başlayın.', '- **Photo**: saves the board’s chart with its ink as a picture for the class page or a worksheet.\n- **💾** (in a bench’s big view, beside 🔍): saves the experiment as it is now as one picture, with what was drawn on it, the latest result and the class’s guess (to the Downloads folder). With a snapshot laid over it, the then-and-now comparison goes in too.\n- Start the next lesson with “For the next lesson” on this panel.')]
  ],
  // questions put to the whole class with ✋ on the board: how the first show of hands split, and the wrong idea
  // behind each wrong option, so the next lesson can start from the most popular one
  votesHtml() {
    const e = U.esc, t = k => this.t(k), rows = [];
    const optsOf = id => { if (QS[id]) return QS[id]; const m = /^rev:(\w+:\d+)$/.exec(id || ''); return m && REVIEW[m[1]] ? REVIEW[m[1]] : null; };
    for (const s of this.list) for (const a of s.data.answers || []) if (Array.isArray(a.classVotes) && optsOf(a.question)) rows.push({ s, a, q: optsOf(a.question) });
    if (!rows.length) return '';
    return `<section><h2>${e(t('hVotes'))}</h2><p class="lead">${e(t('pVotes'))}</p><div class="votes">${rows.slice(-12).reverse().map(({ s, a, q }) => {
      const v = a.classVotes, mx = Math.max(1, ...v), sum = v.reduce((x, y) => x + (y || 0), 0), qi = this.qInfo(a.question);
      return `<div class="vq"><p class="vq-t">${e(qi.text)}<small>${qi.where ? e(qi.where) + ' · ' : ''}${e(s.name)} · ${sum} ${e(t('hands'))}</small></p>${q.options.map((o, i) => {
        const n = v[i] || 0, mi = !o.ok && o.tag && MISC[o.tag];
        return `<div class="vb${o.ok ? ' ok' : ''}"><b>${'ABCD'[i]}</b><span class="vl">${e(L(o.t))}${mi ? `<em>${e(L(mi.wrong))}</em>` : ''}</span><span class="vbar"><i style="width:${Math.round(n / mx * 100)}%"></i></span><span class="vn">${n}</span></div>`;
      }).join('')}</div>`;
    }).join('')}</div></section>`;
  },
  boardHtml(open) {
    const e = U.esc, t = k => this.t(k), md = s => e(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    return `<section class="guide"><details${open ? ' open' : ''}><summary><h2>${e(t('hBoard'))}</h2><span class="small">${e(t('pBoard'))}</span></summary>
      <ol class="steps">${this.BOARD.map(([h, x]) => { const [p, ...li] = ('\n' + L(x)).split('\n- '); return `<li><b class="st">${e(L(h))}</b><div>${p.trim() ? `<p>${md(p.trim())}</p>` : ''}${li.length ? `<ul class="sb">${li.map(y => `<li>${md(y)}</li>`).join('')}</ul>` : ''}</div></li>`; }).join('')}</ol>
      <p class="small">${md(t('bHelp'))}</p></details></section>`;
  },

  // ---------------------------------------------------------------- page
  render(notes = []) {
    const app = document.getElementById('app'), st = this.stats(), n = st.n, e = U.esc, t = k => this.t(k);
    document.documentElement.lang = I18N.lang;
    document.title = `${t('title')} · Tohum Bekçisi`;
    const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
    let html = `<header class="top"><div><h1>${e(t('title'))}</h1><p class="sub">${e(t('sub'))}</p></div>
      <div class="tools">
        <div class="seg"><button data-lang="tr" class="${I18N.lang === 'tr' ? 'on' : ''}">TR</button><button data-lang="en" class="${I18N.lang === 'en' ? 'on' : ''}">EN</button></div>
        ${n ? `<button class="btn" data-act="csv">${e(t('csv'))}</button><button class="btn" data-act="print">${e(t('print'))}</button><button class="btn ghost" data-act="clear">${e(t('clear'))}</button>` : ''}
      </div></header>`;
    if (this.demo) html += `<div class="demo-note">${e(t('demoNote'))}</div>`;
    html += this.liveHtml();
    html += this.boardHtml(!n);
    html += `<section class="drop" id="drop"><p>${t('drop')}</p>
      <label class="btn big"><input type="file" accept=".json,application/json" multiple hidden>${e(t('pick'))}</label>
      ${n ? '' : `<button class="btn ghost" data-act="demo">${e(t('demoBtn'))}</button>`}
      <p class="small">${e(t('privacy'))}</p>
      ${notes.length ? `<ul class="notes">${notes.map(x => `<li>${e(x)}</li>`).join('')}</ul>` : ''}</section>`;
    if (!n) { app.innerHTML = html + `<p class="empty">${e(t('empty'))}</p>`; this.wire(); return; }

    // numbers at a glance
    html += `<section class="cards">
      <div class="card"><b>${n}</b><span>${e(t('kStudents'))}</span></div>
      <div class="card"><b>${Math.round(st.min)}</b><span>${e(t('kMinutes'))}</span></div>
      <div class="card"><b>${st.solved.toFixed(1)}</b><span>${e(t('kCases'))}</span></div>
      <div class="card"><b>%${pct(st.first, st.ans)}</b><span>${e(t('kFirst'))}</span></div>
      <div class="card warn"><b>${st.sure}</b><span>${e(t('kSure'))}</span></div></section>`;

    // what to do next lesson
    const top = st.misc.slice(0, 3);
    if (top.length) {
      html += `<section><h2>${e(t('hNext'))}</h2><p class="lead">${e(t('pNext'))}</p><ol class="next">${top.map(m => {
        const mi = MISC[m.tag], qi = this.qInfo([...m.qs][0]);
        return `<li><div><span class="wrong">“${e(mi ? L(mi.wrong) : m.tag)}”</span> <span class="pc">%${pct(m.students.size, n)}</span></div>
          <div class="right">→ ${e(mi ? L(mi.right) : '')}</div>
          ${qi.link ? `<a class="btn small" href="${e(qi.link)}" target="_blank" rel="noopener">${e(t('open'))}: ${e(qi.where)}</a>` : ''}</li>`;
      }).join('')}</ol></section>`;
    }

    // misconceptions
    html += `<section><h2>${e(t('hMisc'))}</h2><p class="lead">${e(t('pMisc'))}</p>`;
    if (!st.misc.length) html += `<p class="empty">${e(t('noMisc'))}</p>`;
    else html += `<table class="misc"><thead><tr><th></th><th>${e(t('wrong'))}</th><th>${e(t('right'))}</th><th>${e(t('where'))}</th></tr></thead><tbody>${st.misc.map(m => {
      const mi = MISC[m.tag], p = pct(m.students.size, n), wh = [...new Set([...m.qs].map(q => this.qInfo(q).where).filter(Boolean))];
      return `<tr><td class="bar-cell"><div class="bar"><i style="width:${p}%"></i></div><b>%${p}</b><small>${m.students.size}/${n}${m.sure ? ` · ${m.sure} ${e(t('sureN'))}` : ''}</small></td>
        <td class="wrong">${e(mi ? L(mi.wrong) : m.tag)}</td><td class="right">${e(mi ? L(mi.right) : '')}</td><td class="where">${e(wh.join(' · '))}</td></tr>`;
    }).join('')}</tbody></table>`;
    html += `</section>`;

    // curriculum
    html += this.votesHtml();
    html += `<section><h2>${e(t('hCurr'))}</h2><p class="lead">${e(t('pCurr'))}</p>
      <p class="legend"><i class="ans"></i>${e(t('lAns'))} <i class="met"></i>${e(t('lMet'))} <i class="not"></i>${e(t('lNot'))}</p>`;
    for (const th of CURR.themes) {
      html += `<h3>${e(L(th.name))}</h3><table class="curr">${th.items.map(([code, name]) => {
        const s = st.status[code] || { answered: 0, met: 0 }, a = pct(s.answered, n), m = pct(s.met, n), c = st.curr[code];
        return `<tr><td class="code">${e(code)}</td><td class="nm">${e(L(name))}</td>
          <td class="stack"><div class="bar3"><i class="ans" style="width:${a}%"></i><i class="met" style="width:${m}%"></i></div></td>
          <td class="num">${c ? '%' + pct(c.first, c.n) : '–'}</td></tr>`;
      }).join('')}</table>`;
    }
    html += `</section>`;

    // cases
    html += `<section><h2>${e(t('hCases'))}</h2>
      <p class="legend"><i class="ans"></i>${e(t('lDone'))} <i class="met"></i>${e(t('lOpen'))} <i class="not"></i>${e(t('lLocked'))}</p>
      <table class="curr">${CASE_ORDER.filter(id => id !== 'intro').map(id => {
        const c = st.cases[id] || {}, d = c.done || 0, o = c.open || 0;
        return `<tr><td class="nm">${e(L(CASES[id].title))}</td><td class="stack"><div class="bar3"><i class="ans" style="width:${pct(d, n)}%"></i><i class="met" style="width:${pct(o, n)}%"></i></div></td>
          <td class="num">${d}/${n}</td><td class="lnk"><a href="index.html?ders=${id}&tahta=1" target="_blank" rel="noopener">${e(t('open'))}</a></td></tr>`;
      }).join('')}</table></section>`;

    // questions
    const qrows = st.qs.filter(q => q.n).sort((a, b) => a.first / a.n - b.first / b.n || b.n - a.n);
    html += `<section><h2>${e(t('hQ'))}</h2><p class="lead">${e(t('pQ'))}</p><table class="qs"><thead><tr><th>${e(t('cQ'))}</th><th>${e(t('cN'))}</th><th>${e(t('cFirst'))}</th><th>${e(t('cTries'))}</th><th>${e(t('cSure'))}</th></tr></thead><tbody>${qrows.map(q => {
      const qi = this.qInfo(q.id), p = pct(q.first, q.n);
      return `<tr><td><span class="qt">${e(qi.text)}</span><small>${e(q.code || '')}${qi.where ? ' · ' + e(qi.where) : ''}</small></td><td class="num">${q.n}</td>
        <td class="num"><span class="pill ${p < 40 ? 'lo' : p < 70 ? 'mid' : 'hi'}">%${p}</span></td><td class="num">${(q.tries / q.n).toFixed(1)}</td><td class="num">${q.sure || ''}</td></tr>`;
    }).join('')}</tbody></table></section>`;

    // students
    // one row per student; tap a name to see which questions they missed and which wrong idea they picked
    const order = this.list.map((s, i) => i);
    if (this.sort === 'first') order.sort((a, b) => this.row(this.list[a]).first - this.row(this.list[b]).first);
    else order.sort((a, b) => String(this.list[a].name).localeCompare(String(this.list[b].name), I18N.lang));
    html += `<section><div class="sec-head"><h2>${e(t('hStudents'))}</h2><div class="seg"><button data-sort="name" class="${this.sort === 'first' ? '' : 'on'}">${e(t('sortName'))}</button><button data-sort="first" class="${this.sort === 'first' ? 'on' : ''}">${e(t('sortFirst'))}</button></div></div>
      <p class="lead">${e(t('pStudents'))}</p><table class="qs students"><thead><tr><th>${e(t('cFile'))}</th><th>${e(t('cDate'))}</th><th>${e(t('cMin'))}</th><th>${e(t('cCases'))}</th><th>${e(t('cAnswers'))}</th><th>${e(t('cFirst'))}</th><th>${e(t('cMisc'))}</th><th></th></tr></thead><tbody>${order.map(i => {
      const s = this.list[i], r = this.row(s), k = this.skey(s), isOpen = this.opened.has(k), weak = r.ans >= 5 && r.first < 50;
      const ago = Date.now() - Date.parse(s.data.exported || 0), active = s.live && ago >= 0 && ago < 5 * 60000;
      const when = s.live && s.data.exported ? new Date(s.data.exported).toLocaleString(I18N.lang === 'tr' ? 'tr-TR' : 'en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : r.date;
      return `<tr class="${weak ? 'weak' : ''} ${isOpen ? 'isopen' : ''}"><td><button class="who" data-open="${e(k)}" aria-expanded="${isOpen}">${active ? `<i class="live-dot" title="${e(t('active'))}"></i>` : ''}${e(s.name)} <span class="car">${isOpen ? '▾' : '▸'}</span></button>${weak ? `<small class="help">${e(t('needHelp'))}</small>` : ''}</td>
        <td class="num">${e(when)}</td><td class="num">${r.min}</td><td class="num">${r.solved}</td><td class="num">${r.ans}</td><td class="num"><span class="pill ${r.first < 40 ? 'lo' : r.first < 70 ? 'mid' : 'hi'}">%${r.first}</span></td>
        <td class="mini">${r.misc.map(tg => e(MISC[tg] ? L(MISC[tg].wrong) : tg)).join('<br>')}</td><td><button class="x" data-rm="${i}" title="${e(t('remove'))}">×</button></td></tr>
        ${isOpen ? `<tr class="detail"><td colspan="8">${this.detail(s)}</td></tr>` : ''}`;
    }).join('')}</tbody></table></section>`;

    app.innerHTML = html;
    this.wire();
  },
  // a student opened up: the cases, then the questions missed on the first try with the wrong idea behind each
  skey(s) { return String(s.sid || s.name || ''); },
  detail(s) {
    const d = s.data, e = U.esc, t = k => this.t(k), a = d.answers || [];
    const cs = Object.entries(d.cases || {}).filter(([id]) => id !== 'intro' && CASES[id]);
    const done = cs.filter(([, c]) => c.state === 'done'), open = cs.filter(([, c]) => c.state === 'open');
    const miss = a.filter(x => !x.firstTryCorrect), right = a.length - miss.length;
    let h = `<div class="det"><p><b>${e(t('dSolved'))}</b> ${done.map(([id]) => e(L(CASES[id].title))).join(', ') || '–'}`;
    if (open.length) h += `<br><b>${e(t('dOpen'))}</b> ${open.map(([id, c]) => `${e(L(CASES[id].title))} (${(c.step || 0) + 1}/${c.of || '?'})`).join(', ')}`;
    h += `<br><b>${e(t('dRight'))}</b> ${right}/${a.length}</p>`;
    if (d.trimmed) h += `<p class="small">${e(t('trimmed').replace('{n}', d.trimmed))}</p>`;
    if (!miss.length) return h + `<p class="empty">${e(t('noMiss'))}</p></div>`;
    h += `<h3>${e(t('dMiss'))}</h3><table class="qs det-q"><thead><tr><th>${e(t('cQ'))}</th><th>${e(t('cTries'))}</th><th>${e(t('dIdea'))}</th></tr></thead><tbody>${miss.map(x => {
      const qi = this.qInfo(x.question), mi = x.misconception && MISC[x.misconception];
      return `<tr><td><span class="qt">${e(qi.text)}</span><small>${e(x.code || '')}${qi.where ? ' · ' + e(qi.where) : ''}${x.classVotes ? ' · ' + e(t('dVote')) + ' ' + x.classVotes.map((v, j) => 'ABCD'[j] + ' ' + v).join(', ') : ''}</small></td><td class="num">${x.tries || 1}${x.confident ? ` <span class="sure">${e(t('sureN'))}</span>` : ''}</td><td class="mini">${mi ? e(L(mi.wrong)) : ''}</td></tr>`;
    }).join('')}</tbody></table></div>`;
    return h;
  },
  row(s) {
    const d = s.data, a = d.answers || [];
    return {
      date: (d.exported || '').slice(0, 10), min: (d.time && d.time.minutesPlayed) || 0,
      solved: Object.entries(d.cases || {}).filter(([id, c]) => id !== 'intro' && c.state === 'done').length,
      ans: a.length, first: a.length ? Math.round(a.filter(x => x.firstTryCorrect).length / a.length * 100) : 0,
      misc: [...new Set(a.map(x => x.misconception).filter(Boolean))],
    };
  },
  wire() {
    const app = document.getElementById('app'), dz = document.getElementById('drop');
    app.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { I18N.lang = b.dataset.lang; try { localStorage.setItem(this.KEY + '-lang', I18N.lang); } catch (e) { } this.render(); });
    const inp = app.querySelector('input[type=file]'); if (inp) inp.onchange = () => this.read([...inp.files]);
    const lc = document.getElementById('lv-cls'); if (lc) lc.onchange = () => { this.copied = false; this.readLive(); this.render(); };
    const lk = document.getElementById('lv-key'); if (lk) { lk.onchange = () => this.readLive(); lk.onkeydown = ev => { if (ev.key === 'Enter') this.fetchAct(); }; }
    const la = document.getElementById('lv-auto'); if (la) la.onchange = () => this.readLive();
    if (dz) {
      dz.ondragover = e => { e.preventDefault(); dz.classList.add('over'); };
      dz.ondragleave = () => dz.classList.remove('over');
      dz.ondrop = e => { e.preventDefault(); dz.classList.remove('over'); this.read([...e.dataTransfer.files]); };
    }
    app.querySelectorAll('[data-act]').forEach(b => b.onclick = () => this[b.dataset.act + 'Act']());
    app.querySelectorAll('[data-open]').forEach(b => b.onclick = () => { const k = b.dataset.open; if (this.opened.has(k)) this.opened.delete(k); else this.opened.add(k); this.render(); });
    app.querySelectorAll('[data-sort]').forEach(b => b.onclick = () => { this.sort = b.dataset.sort; this.render(); });
    app.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { this.list.splice(+b.dataset.rm, 1); if (!this.list.length) this.demo = false; this.save(); this.render(); });
  },
  clearAct() { this.list = []; this.demo = false; this.save(); this.render(); },
  printAct() { window.print(); },
  csvAct() {
    const q = v => `"${String(v).replace(/"/g, '""')}"`, t = k => this.t(k);
    const lines = [[t('cFile'), t('cDate'), t('cMin'), t('cCases'), t('cAnswers'), t('cFirst') + ' %', t('cMisc')].map(q).join(';')];
    for (const s of this.list) { const r = this.row(s); lines.push([s.name, r.date, r.min, r.solved, r.ans, r.first, r.misc.map(tg => MISC[tg] ? L(MISC[tg].wrong) : tg).join(' | ')].map(q).join(';')); }
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'seedkeeper-sinif-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
  // a made-up class so the page can be tried before any student has sent a file; it is labelled as sample data
  demoAct() {
    const R = U.rng(2026), out = [], rkeys = Object.keys(REVIEW), order = CASE_ORDER.filter(id => id !== 'intro');
    // some wrong ideas are simply more tempting than others
    const pull = o => 0.4 + U.hash((o.tag || L(o.t)).length, 3, 7) * 2.2;
    const answer = (id, q, skill) => {
      const ok = R() < skill, wrong = q.options.filter(o => !o.ok);
      let pick = null;
      if (!ok) { let w = R() * wrong.reduce((s, o) => s + pull(o), 0); for (const o of wrong) { w -= pull(o); if (w <= 0) { pick = o; break; } } pick = pick || wrong[0]; }
      return { question: id, code: q.code, firstTryCorrect: ok, tries: ok ? 1 : 2 + Math.floor(R() * 2), confident: R() < (ok ? 0.55 : 0.3), misconception: pick && pick.tag ? pick.tag : null };
    };
    for (let s = 0; s < 24; s++) {
      const skill = 0.3 + R() * 0.6, done = 1 + Math.floor(R() * order.length);
      const cases = { intro: { state: 'done', step: 3, of: 3 } };
      order.forEach((id, i) => { const of = CASES[id].steps.length, stt = i < done ? 'done' : i === done ? 'open' : 'locked'; cases[id] = { state: stt, step: stt === 'done' ? of : stt === 'open' ? Math.floor(R() * of) : 0, of }; });
      const answers = [];
      for (const id in QS) { const q = QS[id]; if (q.case && cases[q.case] && cases[q.case].state === 'done') answers.push(answer(id, q, skill)); }
      for (const k of rkeys) if (R() < 0.45) answers.push(answer('rev:' + k, REVIEW[k], skill + 0.1));
      const curriculum = {};
      for (const id of order) if (cases[id].state !== 'locked') for (const c of CASES[id].codes) curriculum[c] = 'met';
      for (const a of answers) if (a.firstTryCorrect) curriculum[a.code] = 'answered'; else if (!curriculum[a.code]) curriculum[a.code] = 'met';
      const day = new Date(2026, 9, 1 + Math.floor(R() * 12));
      out.push({ name: L(tr('Örnek öğrenci ', 'Sample student ')) + (s + 1), data: { game: 'Seedkeeper / Tohum Bekçisi', version: 'demo', exported: day.toISOString(), language: 'tr', time: { season: 1, year: 1, minutesPlayed: Math.round(35 + R() * 150) }, cases, answers, curriculum } });
    }
    const src = out.reduce((a, b) => b.data.answers.length > a.data.answers.length ? b : a), bd = JSON.parse(JSON.stringify(src));
    bd.name = L(tr('Örnek sınıf · tahta', 'Sample class · board'));
    const qOf = id => QS[id] || (/^rev:/.test(id) && REVIEW[id.slice(4)]) || null;
    bd.data.answers = [...bd.data.answers.filter(a => QS[a.question]).slice(0, 6), ...bd.data.answers.filter(a => /^rev:/.test(a.question) && qOf(a.question)).slice(0, 2)].map(a => {
      const q = qOf(a.question), v = q.options.map(o => o.ok ? 6 + Math.floor(R() * 12) : Math.floor(R() * 3.2 * pull(o))), top = q.options[v.indexOf(Math.max(...v))];
      return Object.assign(a, { classVotes: v, firstTryCorrect: !!top.ok, misconception: top.ok ? null : top.tag || null });
    });
    out.push(bd);
    this.list = out; this.demo = true; this.save(); this.render();
  },
};
TCH.init();
