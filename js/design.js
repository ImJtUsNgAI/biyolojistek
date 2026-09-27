'use strict';
// Design your own experiment (Deneyini tasarla). A villager asks a question about sprouting chickpeas; the student
// writes a hypothesis, sets up petri dishes (salt, temperature, light, water and seed year for each one), runs a
// week in a few seconds, reads the results and picks the claim the data support. Grandma's review then marks the
// design itself: the question's variable changed, nothing else changed, a control, repeats, conditions that gave
// the seeds a chance, and a claim that fits the data. A flawed design is allowed to run: finding out why its
// result cannot be trusted is the lesson. The mistakes are logged as misconceptions for the teacher's dashboard.

const DESIGN = {
  on: false, el: null, st: null, raf: 0, SEEDS: 10, MAXD: 12, DUR: 4,
  VARS: {
    salt: { name: tr('Tuz', 'Salt'), levels: [0, 0.5, 1, 2], ctrl: 0, fmt: (v, lg = I18N.lang) => lg === 'tr' ? '%' + String(v).replace('.', ',') : v + '%' },
    temp: { name: tr('Sıcaklık', 'Temperature'), levels: [5, 15, 25, 35], ctrl: 25, fmt: v => v + ' °C' },
    light: { name: tr('Işık', 'Light'), levels: ['light', 'dark'], ctrl: 'light', fmt: (v, lg = I18N.lang) => (v === 'light' ? tr('aydınlık', 'light') : tr('karanlık', 'dark'))[lg] },
    water: { name: tr('Su', 'Water'), levels: ['dry', 'damp', 'flooded'], ctrl: 'damp', fmt: (v, lg = I18N.lang) => ({ dry: tr('kuru', 'dry'), damp: tr('nemli', 'damp'), flooded: tr('su altında', 'under water') }[v])[lg] },
    seed: { name: tr('Tohum yılı', 'Seed year'), levels: [2023, 2011, 1998], ctrl: 2023, fmt: v => String(v) },
  },
  ORDER: ['salt', 'temp', 'light', 'water', 'seed'],
  // how likely one chickpea is to sprout in a week: the seed's age, then each condition as a factor
  P: { seed: { 2023: 0.92, 2011: 0.62, 1998: 0.14 }, water: { dry: 0, damp: 1, flooded: 0.22 }, temp: { 5: 0.12, 15: 0.72, 25: 1, 35: 0.38 }, salt: { 0: 1, 0.5: 0.78, 1: 0.42, 2: 0.06 }, light: { light: 1, dark: 1 } },
  QUESTIONS: [
    { k: 'salt', who: 'songul', iv: 'salt',
      q: tr('Kuyumuzun tuzlu suyu tohumlarımın çimlenmesini engelliyor mu?', 'Is the salty water from our well stopping my seeds from sprouting?'),
      why: [tr('tuzlu su tohumdan su çeker (osmoz)', 'salty water draws water out of the seed (osmosis)'), tr('tuz tohumu besler', 'salt feeds the seed'), tr('tuz tohumu ısıtır', 'salt warms the seed')],
      thanks: tr('Demek tuzlu su tohumu çimlendirmiyor. Fideleri bundan sonra yağmur suyuyla başlatacağım!', 'So salty water stops the seeds sprouting. From now on I’ll start my seedlings with rainwater!') },
    { k: 'light', who: 'riza', iv: 'light',
      q: tr('Tohum çimlenmek için ışık ister mi? Ben ambarın karanlığında filizlendiklerini gördüm.', 'Does a seed need light to sprout? I’ve seen them sprouting in the dark of the barn.'),
      why: [tr('tohum çimlenirken çeneğindeki besini kullanır; henüz ışığa ihtiyacı yoktur', 'a sprouting seed lives on the food in its cotyledons and needs no light yet'), tr('bitkiler her zaman ışığa ihtiyaç duyar', 'plants always need light'), tr('karanlıkta tohum uyumaya devam eder', 'in the dark a seed stays asleep')],
      thanks: tr('Ben demiştim! Karanlıkta da çimleniyor. Ama filiz toprağın üstüne çıkınca ışık ister, o başka.', 'I told you so! They sprout in the dark too. Mind you, once the shoot is above the soil it needs light, and that’s another story.') },
    { k: 'temp', who: 'nazli', iv: 'temp',
      q: tr('Nohudu sıcak fırının dibinde mi, serin kilerde mi çimlendireyim?', 'Should I sprout my chickpeas by the hot oven or in the cool pantry?'),
      why: [tr('çimlenmeyi yürüten enzimler belli bir sıcaklıkta en hızlı çalışır', 'the enzymes that drive sprouting work fastest at a certain temperature'), tr('sıcaklık arttıkça her şey daha hızlı olur', 'the hotter it is, the faster everything goes'), tr('soğuk tohumu korur ve güçlendirir', 'cold protects the seed and makes it stronger')],
      thanks: tr('Ne kiler ne fırın: ılık mutfak en iyisi! Çok sıcakta da, çok soğukta da tohum küsüyor.', 'Neither pantry nor oven: the warm kitchen is best! Too hot or too cold and the seed sulks.') },
    { k: 'seed', who: 'huseyin', iv: 'seed',
      q: tr('Eski tohum yenisi kadar çimlenir mi? Sandıkta otuz yıllık nohut var.', 'Does old seed sprout as well as new? There are thirty-year-old chickpeas in the chest.'),
      why: [tr('eski tohumdaki embriyo zamanla canlılığını yitirir', 'the embryo in an old seed slowly loses its life'), tr('eski tohum daha çok besin biriktirmiştir', 'an old seed has stored more food'), tr('tohum yaşlandıkça sertleşir ve güçlenir', 'a seed grows harder and stronger with age')],
      thanks: tr('Eski tohum az çimleniyor. Tohum bankasının birkaç yılda bir tohumları yenilemesi boşuna değilmiş.', 'Old seed sprouts poorly. No wonder the seed bank renews its seeds every few years.') },
    { k: 'water', who: 'ayten', iv: 'water',
      q: tr('Tohumu suya ne kadar çok batırırsam o kadar iyi çimlenir mi?', 'The more I soak a seed, the better it sprouts, doesn’t it?'),
      why: [tr('su altındaki tohum oksijensiz kalır', 'a seed under water runs out of oxygen'), tr('su ne kadar çoksa tohum o kadar iyi beslenir', 'the more water, the better the seed is fed'), tr('kuru tohum daha hızlı çimlenir', 'a dry seed sprouts faster')],
      thanks: tr('Suyun fazlası da zarar: tohum boğuluyor. Nemli tutmak yetiyor.', 'Too much water does harm too: the seed drowns. Keeping it damp is enough.') },
  ],
  // what can be claimed about each variable; the levels are listed from "least" to "most" (the seed from new to old)
  CLAIM: {
    salt: { down: tr('Tuz arttıkça çimlenen tohum sayısı azaldı.', 'The more salt, the fewer seeds sprouted.'), up: tr('Tuz arttıkça çimlenen tohum sayısı arttı.', 'The more salt, the more seeds sprouted.'), none: tr('Tuz, çimlenmeyi belirgin biçimde değiştirmedi.', 'Salt made no clear difference to sprouting.'), over: tr('Bu deney, tuzun bütün bitkileri her yaşta öldürdüğünü kanıtlar.', 'This experiment proves that salt kills every plant at any age.') },
    temp: { down: tr('Sıcaklık arttıkça çimlenme azaldı.', 'The warmer it was, the fewer seeds sprouted.'), up: tr('Sıcaklık arttıkça çimlenme arttı.', 'The warmer it was, the more seeds sprouted.'), none: tr('Sıcaklık, çimlenmeyi belirgin biçimde değiştirmedi.', 'Temperature made no clear difference to sprouting.'), over: tr('Bu deney, bütün tohumların en iyi 25 °C’de çimlendiğini kanıtlar.', 'This experiment proves that every seed sprouts best at 25 °C.') },
    light: { down: tr('Karanlıkta daha az tohum çimlendi.', 'Fewer seeds sprouted in the dark.'), up: tr('Karanlıkta daha çok tohum çimlendi.', 'More seeds sprouted in the dark.'), none: tr('Işık çimlenmeyi etkilemedi: karanlıkta da aydınlıkta da benzer sayıda tohum çimlendi.', 'Light made no difference: about as many seeds sprouted in the dark as in the light.'), over: tr('Bu deney, hiçbir bitkinin ışığa ihtiyacı olmadığını kanıtlar.', 'This experiment proves that no plant needs light.') },
    water: { down: tr('Su arttıkça çimlenme azaldı.', 'The more water, the fewer seeds sprouted.'), up: tr('Su arttıkça çimlenme arttı.', 'The more water, the more seeds sprouted.'), none: tr('Suyun miktarı çimlenmeyi belirgin biçimde değiştirmedi.', 'The amount of water made no clear difference.'), over: tr('Bu deney, suyun her bitkiye her zaman zarar verdiğini kanıtlar.', 'This experiment proves that water always harms every plant.') },
    seed: { down: tr('Tohum eskidikçe çimlenme azaldı.', 'The older the seed, the fewer sprouted.'), up: tr('Tohum eskidikçe çimlenme arttı.', 'The older the seed, the more sprouted.'), none: tr('Tohumun yaşı çimlenmeyi belirgin biçimde değiştirmedi.', 'The seed’s age made no clear difference.'), over: tr('Bu deney, otuz yıllık bir tohumun asla çimlenmeyeceğini kanıtlar.', 'This experiment proves that a thirty-year-old seed will never sprout.') },
  },
  low(v, lg) { const n = this.VARS[v].name[lg]; return lg === 'tr' ? n.toLocaleLowerCase('tr') : n.toLowerCase(); },
  base() { return { salt: 0, temp: 25, light: 'light', water: 'damp', seed: 2023 }; },
  p(d) { const P = this.P; return P.seed[d.seed] * P.water[d.water] * P.temp[d.temp] * P.salt[d.salt] * P.light[d.light]; },

  // ---------------------------------------------------------------- opening and the steps
  open(qk) {
    if (this.on) return;
    if (STUDY.on) STUDY.close();
    if (LENS.on) LENS.toggle(false);
    this.on = true;
    const el = this.el = h('div', 'modal design');
    el._key = e => { if (e.code === 'Escape') this.close(); };
    UI._push('design', el);
    AU.sfx('page');
    this.st = { phase: 'pick', q: null, hyp: { dir: null, why: null }, dishes: [this.base()], counts: null, anim: 0, claim: null };
    el.innerHTML = `<div class="dz-wrap paper"><button class="x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      <div class="dz-steps"></div><div class="dz-body"></div></div>`;
    el.querySelector('.x').onclick = () => { AU.sfx('click'); this.close(); };
    if (qk) this.pick(qk); else this.view();
    let last = performance.now();
    const loop = now => { if (!this.on) return; const dt = U.clamp((now - last) / 1000, 0, 0.05); last = now; this.step(dt); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  },
  close() { if (!this.on) return; this.on = false; cancelAnimationFrame(this.raf); UI._pop(this.el); },
  STEPS: [['pick', tr('Soru', 'Question')], ['hyp', tr('Hipotez', 'Hypothesis')], ['setup', tr('Düzenek', 'Set-up')], ['run', tr('Deney', 'Run')], ['claim', tr('Sonuç', 'Conclusion')], ['review', tr('Değerlendirme', 'Review')]],
  view() {
    const s = this.st, body = this.el.querySelector('.dz-body'), at = this.STEPS.findIndex(x => x[0] === s.phase);
    this.el.querySelector('.dz-steps').innerHTML = this.STEPS.map(([k, t], i) => `<span class="${i < at ? 'done' : i === at ? 'on' : ''}">${i + 1}. ${U.esc(L(t))}</span>`).join('');
    body.innerHTML = '';
    const pane = this['_' + s.phase](), prev = this.BACK[s.phase], foot = pane.querySelector('.dz-foot');
    if (prev && foot) {
      const b = h('button', 'dz-back'); b.textContent = L(tr('◂ Geri', '◂ Back'));
      b.onclick = () => { AU.sfx('click'); if (prev !== 'hyp' && prev !== 'pick') Object.assign(s, { counts: null, claim: null }); s.phase = prev; this.view(); };
      foot.insertBefore(b, foot.firstChild);
    }
    body.appendChild(pane);
  },
  BACK: { hyp: 'pick', setup: 'hyp', run: 'setup', claim: 'setup' },
  pick(qk) {
    const q = this.QUESTIONS.find(x => x.k === qk); if (!q) return;
    Object.assign(this.st, { q, phase: 'hyp', hyp: { dir: null, why: null }, dishes: [this.base()], counts: null, claim: null });
    this.view();
  },
  hypothesis(dir, why) {
    this.st.hyp = { dir, why };
    this.st.phase = 'setup'; this.view();
  },
  setDishes(list) { this.st.dishes = list.slice(0, this.MAXD).map(d => Object.assign(this.base(), d)); if (this.st.phase === 'setup') this.view(); },
  // a week in the dishes; seed fixes the dice for the self-test
  run(seed) {
    const s = this.st, R = MX.rng(seed == null ? (Date.now() & 0xffff) : seed);
    s.counts = s.dishes.map(d => { let n = 0; const p = this.p(d); for (let k = 0; k < this.SEEDS; k++) if (R() < p) n++; return n; });
    s.days = s.dishes.map(() => Array.from({ length: this.SEEDS }, () => 1 + R() * 3.5));
    s.anim = 0; s.phase = 'run'; this.view();
  },
  step(dt) {
    const s = this.st; if (!s || s.phase !== 'run') return;
    s.anim = Math.min(1, s.anim + dt / this.DUR);
    this._drawDishes();
    const day = this.el.querySelector('.dz-day'); if (day) day.textContent = L(tr(`Gün ${Math.round(s.anim * 7)} / 7`, `Day ${Math.round(s.anim * 7)} / 7`));
    if (s.anim >= 1 && !s.ran) { s.ran = true; const b = this.el.querySelector('.dz-toclaim'); if (b) b.classList.remove('hidden'); }
  },
  skip() { if (this.st.phase === 'run') { this.st.anim = 1; this.step(0); } },

  // ---------------------------------------------------------------- reading the design and the data
  analyse() {
    const s = this.st, D = s.dishes, varied = this.ORDER.filter(v => new Set(D.map(d => d[v])).size > 1);
    // dishes grouped by their whole set of conditions
    const groups = {};
    D.forEach((d, i) => { const key = this.ORDER.map(v => d[v]).join('|'); (groups[key] = groups[key] || { d, idx: [], n: [] }).idx.push(i); if (s.counts) groups[key].n.push(s.counts[i]); });
    const G = Object.values(groups).map(g => Object.assign(g, { mean: g.n.length ? g.n.reduce((a, b) => a + b, 0) / g.n.length : 0 }));
    const out = { varied, fair: varied.length === 1, groups: G, reps: Math.min(...G.map(g => g.idx.length)), trend: null, v: varied.length === 1 ? varied[0] : null };
    if (out.fair && s.counts) {
      const V = this.VARS[out.v], lv = V.levels.filter(l => G.some(g => g.d[out.v] === l)), m = lv.map(l => G.find(g => g.d[out.v] === l).mean);
      out.levels = lv; out.means = m;
      const hi = Math.max(...m), lo = Math.min(...m), top = m.indexOf(hi);
      out.trend = hi - lo < 2 ? 'none' : m.length > 2 && top > 0 && top < m.length - 1 && hi - Math.max(m[0], m[m.length - 1]) >= 1.5 ? 'peak' : m[m.length - 1] < m[0] ? 'down' : 'up';
      out.best = lv[top];
    }
    const ctl = this.VARS[s.q.iv].ctrl;
    out.control = D.some(d => d[s.q.iv] === ctl);
    const cg = G.filter(g => g.d[s.q.iv] === ctl);
    out.ctlMean = cg.length ? Math.max(...cg.map(g => g.mean)) : Math.max(...G.map(g => g.mean));
    return out;
  },
  claimText(v, trend, best) {
    if (trend === 'peak') { const F = this.VARS[v].fmt; return tr(`Çimlenme en çok ${F(best, 'tr')} koşulunda oldu; iki yanında azaldı.`, `Sprouting was highest at ${F(best, 'en')} and fell off on either side.`); }
    return this.CLAIM[v][trend];
  },
  // four claims to choose from, exactly one of which the design and data support
  claims() {
    const s = this.st, a = this.analyse(), iv = s.q.iv, nT = a.varied.map(v => this.low(v, 'tr')).join(', '), nE = a.varied.map(v => this.low(v, 'en')).join(', ');
    const cannot = { t: tr('Bu deneyden hiçbir sonuç çıkarılamaz.', 'Nothing at all can be concluded from this experiment.'), k: 'cannot' };
    let list;
    if (a.varied.length === 0) list = [{ t: tr('Bütün kaplar aynıydı; bu deney hiçbir şeyi karşılaştırmıyor.', 'Every dish was the same, so this experiment compares nothing.'), ok: true, k: 'same' }, { t: this.CLAIM[iv].down, k: 'down' }, { t: this.CLAIM[iv].none, k: 'none' }, { t: this.CLAIM[iv].over, k: 'over' }];
    else if (!a.fair) list = [{ t: tr(`Aynı anda birden çok şeyi (${nT}) değiştirdim; farkın hangisinden geldiğini bilemem.`, `I changed more than one thing at once (${nE}), so I can’t tell which one caused the difference.`), ok: true, k: 'mixed' }, { t: this.CLAIM[iv].down, k: 'down' }, { t: this.CLAIM[iv].up, k: 'up' }, { t: this.CLAIM[iv].over, k: 'over' }];
    else {
      const v = a.v, opp = { down: 'up', up: 'down', none: 'down', peak: 'none' }[a.trend];
      list = [{ t: this.claimText(v, a.trend, a.best), ok: true, k: a.trend }, { t: this.claimText(v, opp, a.best), k: opp }, { t: this.CLAIM[v].over, k: 'over' }, cannot];
    }
    return list;
  },
  choose(i) {
    const s = this.st; if (s.phase !== 'claim') return;
    s.claim = s.claimList[i];
    s.phase = 'review'; this.view();
    this.record();
  },
  // Grandma's marking: one line per point of a good experiment
  review() {
    const s = this.st, a = this.analyse(), q = s.q, V = this.VARS[q.iv], iT = this.low(q.iv, 'tr'), iE = this.low(q.iv, 'en'), rows = [];
    const vT = a.varied.map(v => this.VARS[v].name.tr).join(', '), vE = a.varied.map(v => this.VARS[v].name.en).join(', ');
    const add = (ok, good, bad, tag) => rows.push({ ok, t: ok ? good : bad, tag: ok ? null : tag });
    add(a.varied.includes(q.iv), tr(`Sorunun değişkenini (${iT}) değiştirdin.`, `You changed the variable in the question (${iE}).`),
      tr(`Soru ${iT} hakkındaydı, ama bütün kaplarda ${iT} aynıydı.`, `The question was about ${iE}, but the ${iE} was the same in every dish.`), null);
    add(a.fair, tr('Adil test: yalnızca bir şey değişti, gerisi bütün kaplarda aynıydı.', 'A fair test: only one thing changed and everything else was the same in every dish.'),
      a.varied.length ? tr(`Aynı anda ${a.varied.length} şeyi değiştirdin (${vT}): farkın nedeni belli olmaz.`, `You changed ${a.varied.length} things at once (${vE}), so the cause of any difference is unclear.`)
        : tr('Hiçbir şeyi değiştirmedin: karşılaştıracak bir şey yok.', 'You changed nothing, so there is nothing to compare.'), 'two_vars');
    add(a.control, tr(`Kontrol grubun vardı (${V.fmt(V.ctrl, 'tr')}): öteki kapları onunla karşılaştırabildin.`, `You had a control group (${V.fmt(V.ctrl, 'en')}) to compare the other dishes with.`),
      tr(`Kontrol grubu yoktu: ${V.fmt(V.ctrl, 'tr')} bir kap, farkı ölçmek için başlangıç noktası olurdu.`, `There was no control group: a dish at ${V.fmt(V.ctrl, 'en')} would have been the starting point for measuring the difference.`), 'no_control');
    add(a.reps >= 3, tr('Her koşulda en az 3 kap vardı: tek bir kabın şansı sonucu bozamaz.', 'Every condition had at least 3 dishes, so one lucky or unlucky dish can’t spoil the result.'),
      tr('Bazı koşullarda 3’ten az kap vardı: tek bir kap şans eseri iyi ya da kötü çıkabilir.', 'Some conditions had fewer than 3 dishes: a single dish can come out well or badly by chance.'), 'one_is_enough');
    add(a.ctlMean >= 4, tr('Sabit tuttuğun koşullar tohumlara çimlenme şansı verdi.', 'The conditions you kept the same gave the seeds a chance to sprout.'),
      tr('En iyi kaplarda bile çok az tohum çimlendi: sabit tuttuğun bir koşul (kuru kâğıt, soğuk, eski tohum…) her şeyi durdurdu.', 'Even the best dishes barely sprouted: a condition you kept the same (a dry paper, the cold, old seed…) stopped everything.'), null);
    add(!!(s.claim && s.claim.ok), tr('Sonuç cümlen verilerle ve deneyin düzeniyle uyumlu.', 'Your conclusion fits the data and the way the experiment was set up.'),
      s.claim && s.claim.k === 'over' ? tr('Sonuç cümlen fazla genel: bu deney yalnızca nohut tohumunun bu koşullarda çimlenmesini sınadı.', 'Your conclusion goes too far: this experiment only tested chickpea seeds sprouting in these conditions.')
        : tr('Sonuç cümlen verilerin söylediğiyle uyuşmuyor.', 'Your conclusion does not match what the data say.'), s.claim && s.claim.k === 'over' ? 'overclaim' : null);
    const stars = rows.filter(r => r.ok).length;
    let hyp = null;
    if (a.fair && a.v === q.iv && s.hyp.dir && a.trend) {
      const ok = s.hyp.dir === a.trend;
      hyp = a.trend === 'peak' ? tr('Veriler ne “artar” ne “azalır” dedi: çimlenme önce arttı, sonra azaldı. Demek ki en uygun bir değer var; bu, yeni bir hipotez için iyi bir başlangıç.', 'The data said neither “goes up” nor “goes down”: sprouting rose and then fell. So there is a best value, and that is a good start for a new hypothesis.')
        : ok ? tr('Verilerin hipotezini destekledi.', 'Your data supported your hypothesis.') : tr('Verilerin hipotezini desteklemedi. Bu da değerli bir sonuç: bilim, desteklenmeyen hipotezlerden de öğrenir.', 'Your data did not support your hypothesis. That is a valuable result too: science learns from unsupported hypotheses as well.');
    }
    return { rows, stars, hyp, happy: stars >= 5 && a.fair && a.v === q.iv };
  },
  record() {
    const s = this.st, S = G.S, a = this.analyse(), r = this.review();
    const lab = g => this.ORDER.filter(v => a.varied.includes(v)).map(v => this.VARS[v].fmt(g.d[v])).join(' · ') || L(tr('hepsi aynı', 'all the same'));
    S.journal.exps.push({ title: tr(`Deney tasarımı: ${s.q.q.tr}`, `Experiment design: ${s.q.q.en}`), code: 'BİY.9.1.2', t: Date.now(),
      head: [tr('Koşul', 'Condition'), tr('Kap', 'Dishes'), tr('Ortalama çimlenen (10 tohumda)', 'Mean sprouted (of 10 seeds)')],
      rows: a.groups.map(g => [lab(g), String(g.idx.length), g.mean.toFixed(1)]),
      chart: { values: a.groups.map(g => Math.round(g.mean * 10)), labels: a.groups.map(g => lab(g)), colors: a.groups.map(() => '#6E8F4E'), unit: tr('çimlenen %', '% sprouted') },
      note: { tr: `Değerlendirme: ${r.stars} / 6. ` + r.rows.filter(x => !x.ok).map(x => x.t.tr).join(' '), en: `Review: ${r.stars} / 6. ` + r.rows.filter(x => !x.ok).map(x => x.t.en).join(' ') } });
    const tag = (r.rows.find(x => !x.ok && x.tag) || {}).tag || null;
    S.answers.push({ q: 'design:' + s.q.k, code: 'BİY.9.1.2', case: null, first: 0, ok: r.stars === 6, tries: 1, sure: false, tag, t: Date.now() });
    S.design = S.design || { runs: 0, best: 0 }; S.design.runs++; S.design.best = Math.max(S.design.best, r.stars);
    G.save();
  },

  // ---------------------------------------------------------------- views
  _pick() {
    const box = h('div', 'dz-pick');
    box.innerHTML = `<h2>${U.esc(L(tr('Köylülerin soruları', 'The villagers’ questions')))}</h2><p class="dz-lead">${U.esc(L(tr('Bir soru seç. Deneyi sen tasarlayacaksın: ne değişecek, ne sabit kalacak, kaç kap kuracaksın? Her kaba 10 nohut tohumu konur.', 'Pick a question. You will design the experiment: what changes, what stays the same, how many dishes you set up. Each dish gets 10 chickpea seeds.')))}</p>
      <div class="dz-qs">${this.QUESTIONS.map(q => `<button class="dz-q" data-k="${q.k}"><canvas width="96" height="96"></canvas><div><b>${U.esc(L(ACT.names[q.who]))}</b><span>“${U.esc(L(q.q))}”</span></div></button>`).join('')}</div>`;
    box.querySelectorAll('.dz-q').forEach(b => { const q = this.QUESTIONS.find(x => x.k === b.dataset.k); try { ACT.portrait(b.querySelector('canvas'), q.who); } catch (e) { } b.onclick = () => { AU.sfx('page'); this.pick(q.k); }; });
    return box;
  },
  _hyp() {
    const s = this.st, q = s.q, V = this.VARS[q.iv], box = h('div', 'dz-hyp');
    const dirs = [['down', tr('azalır', 'goes down')], ['up', tr('artar', 'goes up')], ['none', tr('değişmez', 'stays the same')]];
    box.innerHTML = `<h2>${U.esc(L(tr('Hipotezin', 'Your hypothesis')))}</h2><p class="dz-lead">“${U.esc(L(q.q))}” · <b>${U.esc(L(ACT.names[q.who]))}</b></p>
      <p class="dz-sent">${U.esc(L(tr(`Tahminim: ${this.low(q.iv, 'tr')} değişince çimlenen tohum sayısı`, `My prediction: when the ${this.low(q.iv, 'en')} changes, the number of seeds that sprout`)))}
        <span class="seg dz-dir">${dirs.map(([k, t]) => `<button data-d="${k}">${U.esc(L(t))}</button>`).join('')}</span>
        ${U.esc(L(tr('çünkü', 'because')))}</p>
      <div class="dz-why">${shuffle(q.why.map((w, i) => i)).map(i => `<button class="ans" data-w="${i}">${U.esc(L(q.why[i]))}</button>`).join('')}</div>
      <p class="dz-note">${U.esc(L(tr('Hipotez bir tahmindir; doğru çıkması gerekmez. Önemli olan, deneyle sınanabilmesi.', 'A hypothesis is a prediction; it does not have to turn out right. What matters is that an experiment can test it.')))}</p>
      <div class="dz-foot"><button class="big yes dz-next" disabled>${U.esc(L(tr('Düzeneği kur ▸', 'Set up the dishes ▸')))}</button></div>`;
    let dir = null, why = null;
    const upd = () => { box.querySelector('.dz-next').disabled = dir == null || why == null; };
    // coming back from the set-up keeps the earlier choices
    setTimeout(() => { const o = s.hyp || {}; if (o.dir != null) box.querySelector(`.dz-dir [data-d="${o.dir}"]`)?.click(); if (o.why != null) box.querySelector(`.dz-why [data-w="${o.why}"]`)?.click(); });
    box.querySelectorAll('.dz-dir button').forEach(b => b.onclick = () => { AU.sfx('click'); dir = b.dataset.d; box.querySelectorAll('.dz-dir button').forEach(x => x.classList.toggle('on', x === b)); upd(); });
    box.querySelectorAll('.dz-why .ans').forEach(b => b.onclick = () => { AU.sfx('pen'); why = +b.dataset.w; box.querySelectorAll('.dz-why .ans').forEach(x => x.classList.toggle('on', x === b)); upd(); });
    box.querySelector('.dz-next').onclick = () => { AU.sfx('page'); this.hypothesis(dir, why); };
    return box;
  },
  _setup() {
    const s = this.st, box = h('div', 'dz-setup');
    box.innerHTML = `<h2>${U.esc(L(tr('Düzeneğini kur', 'Set up your dishes')))}</h2><p class="dz-lead">“${U.esc(L(s.q.q))}” ${U.esc(L(tr('Her kap için koşulları seç. “Kopyala” aynı koşullarda bir kap daha ekler (tekrar).', 'Choose the conditions for each dish. “Copy” adds another dish with the same conditions (a repeat).')))}</p>
      <div class="dz-dishes"></div>
      <div class="dz-foot"><span class="dz-count"></span><button class="dz-add">${U.esc(L(tr('+ Kap ekle', '+ Add a dish')))}</button><button class="big yes dz-go">${U.esc(L(tr('Bir hafta bekle ▸', 'Wait a week ▸')))}</button></div>`;
    const list = box.querySelector('.dz-dishes');
    const draw = () => {
      list.innerHTML = '';
      s.dishes.forEach((d, i) => {
        const c = h('div', 'dz-dish');
        c.innerHTML = `<div class="dz-dh"><b>${U.esc(L(tr('Kap', 'Dish')))} ${i + 1}</b><button data-a="copy" title="${U.esc(L(tr('Kopyala', 'Copy')))}">⧉</button><button data-a="del" title="${U.esc(L(tr('Sil', 'Remove')))}">✕</button></div>` +
          this.ORDER.map(v => `<label><span>${U.esc(L(this.VARS[v].name))}</span><select data-v="${v}">${this.VARS[v].levels.map(l => `<option value="${l}"${String(d[v]) === String(l) ? ' selected' : ''}>${U.esc(this.VARS[v].fmt(l))}</option>`).join('')}</select></label>`).join('');
        c.querySelectorAll('select').forEach(sel => sel.onchange = () => { const v = sel.dataset.v, l = this.VARS[v].levels.find(x => String(x) === sel.value); d[v] = l; AU.sfx('click'); });
        c.querySelector('[data-a="copy"]').onclick = () => { if (s.dishes.length >= this.MAXD) return; AU.sfx('pen'); s.dishes.splice(i + 1, 0, Object.assign({}, d)); draw(); };
        c.querySelector('[data-a="del"]').onclick = () => { if (s.dishes.length <= 1) return; AU.sfx('click'); s.dishes.splice(i, 1); draw(); };
        list.appendChild(c);
      });
      box.querySelector('.dz-count').textContent = L(tr(`${s.dishes.length} kap · en çok ${this.MAXD}`, `${s.dishes.length} dishes · at most ${this.MAXD}`));
      box.querySelector('.dz-add').disabled = s.dishes.length >= this.MAXD;
    };
    box.querySelector('.dz-add').onclick = () => { if (s.dishes.length >= this.MAXD) return; AU.sfx('pen'); s.dishes.push(Object.assign({}, s.dishes[s.dishes.length - 1])); draw(); };
    box.querySelector('.dz-go').onclick = () => { AU.sfx('page'); this.run(); };
    draw();
    return box;
  },
  _run() {
    const box = h('div', 'dz-run');
    box.innerHTML = `<h2>${U.esc(L(tr('Bir hafta sonra…', 'A week later…')))}</h2><p class="dz-day"></p><canvas class="dz-cv"></canvas>
      <div class="dz-foot"><button class="dz-skip">${U.esc(L(tr('Atla ▸▸', 'Skip ▸▸')))}</button><button class="big yes dz-toclaim hidden">${U.esc(L(tr('Sonuçları oku ▸', 'Read the results ▸')))}</button></div>`;
    box.querySelector('.dz-skip').onclick = () => this.skip();
    box.querySelector('.dz-toclaim').onclick = () => { AU.sfx('page'); this.st.phase = 'claim'; this.view(); };
    this.st.ran = false;
    return box;
  },
  _drawDishes() {
    const s = this.st, cv = this.el.querySelector('.dz-cv'); if (!cv) return;
    const n = s.dishes.length, cols = Math.min(4, n), rows = Math.ceil(n / cols), r = cv.getBoundingClientRect(), dpr = G.dpr;
    if (!r.width) return;
    const H = Math.min(r.width / cols, 170) * rows; if (Math.abs(r.height - H) > 1) { cv.style.height = H + 'px'; }
    const w = r.width, cw = w / cols, ch = H / rows;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(H * dpr); }
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, H);
    const day = s.anim * 7;
    s.dishes.forEach((d, i) => {
      const cx = (i % cols + 0.5) * cw, cy = (Math.floor(i / cols) + 0.5) * ch - 8, rr = Math.min(cw, ch) * 0.36, R = MX.rng(900 + i);
      c.fillStyle = 'rgba(0,0,0,0.18)'; c.beginPath(); c.ellipse(cx + 3, cy + 5, rr + 2, rr * 0.92 + 2, 0, 0, TAU); c.fill();
      c.fillStyle = d.water === 'dry' ? '#EFE8DA' : d.water === 'flooded' ? '#BCD4E0' : '#DCE4D8'; c.beginPath(); c.ellipse(cx, cy, rr, rr * 0.92, 0, 0, TAU); c.fill();
      if (d.salt > 0) { c.fillStyle = `rgba(255,255,255,${0.12 + d.salt * 0.12})`; for (let k = 0; k < 30; k++) { c.beginPath(); c.arc(cx + (R() - 0.5) * rr * 1.6, cy + (R() - 0.5) * rr * 1.4, 1 + R() * 1.4, 0, TAU); c.fill(); } }
      const grown = s.counts ? s.counts[i] : 0;
      for (let k = 0; k < this.SEEDS; k++) {
        const a = k / this.SEEDS * TAU + 0.3, sx = cx + Math.cos(a) * rr * 0.55, sy = cy + Math.sin(a) * rr * 0.5, dd = s.days[i][k], sprout = k < grown && day > dd;
        if (sprout) { const L2 = Math.min(1, (day - dd) / 3) * rr * 0.42; c.strokeStyle = '#F6F2E6'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + Math.cos(a) * L2 * 0.6 + 4, sy + Math.sin(a) * L2 * 0.6, sx + Math.cos(a + 0.4) * L2, sy + Math.sin(a + 0.4) * L2); c.stroke(); }
        c.fillStyle = sprout ? '#D8B878' : '#C8A468'; c.beginPath(); c.arc(sx, sy, rr * 0.1, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(90,60,30,0.6)'; c.lineWidth = 0.8; c.stroke();
      }
      c.strokeStyle = 'rgba(120,140,150,0.8)'; c.lineWidth = 2; c.beginPath(); c.ellipse(cx, cy, rr, rr * 0.92, 0, 0, TAU); c.stroke();
      if (d.light === 'dark') { c.fillStyle = 'rgba(20,20,26,0.55)'; c.beginPath(); c.ellipse(cx, cy, rr, rr * 0.92, 0, Math.PI * 0.05, Math.PI * 0.95); c.fill(); }
      c.fillStyle = '#1B1A17'; c.font = '700 12px "Courier Prime", monospace'; c.textAlign = 'center';
      c.fillText(`${L(tr('Kap', 'Dish'))} ${i + 1}` + (s.anim >= 1 ? ` · ${grown}/10` : ''), cx, cy + rr + 16);
      c.font = '600 10px "Atkinson Hyperlegible Next", sans-serif'; c.fillStyle = '#4A4436';
      c.fillText([this.VARS.salt.fmt(d.salt), this.VARS.temp.fmt(d.temp), this.VARS.water.fmt(d.water), this.VARS.light.fmt(d.light), d.seed].join(' · '), cx, cy + rr + 29);
    });
  },
  _claim() {
    const s = this.st, a = this.analyse(), box = h('div', 'dz-claim');
    const lab = g => this.ORDER.filter(v => a.varied.includes(v)).map(v => this.VARS[v].fmt(g.d[v])).join(' · ') || L(tr('hepsi aynı', 'all the same'));
    s.claimList = shuffle(this.claims());
    box.innerHTML = `<h2>${U.esc(L(tr('Sonuçlar', 'Results')))}</h2>
      <div class="dz-res"><table class="exp-table"><tr><th>${U.esc(L(tr('Koşul', 'Condition')))}</th><th>${U.esc(L(tr('Kaplar (çimlenen / 10)', 'Dishes (sprouted / 10)')))}</th><th>${U.esc(L(tr('Ortalama', 'Mean')))}</th></tr>
        ${a.groups.map(g => `<tr><td>${U.esc(lab(g))}</td><td>${g.n.join(', ')}</td><td><b>${g.mean.toFixed(1)}</b></td></tr>`).join('')}</table><canvas class="dz-chart"></canvas></div>
      <p class="dz-lead">${U.esc(L(tr('Verilerin hangi sonucu destekliyor?', 'Which conclusion do your data support?')))}</p>
      <div class="dz-claims">${s.claimList.map((c, i) => `<button class="ans" data-i="${i}">${U.esc(L(c.t))}</button>`).join('')}</div>`;
    box.querySelectorAll('.dz-claims .ans').forEach(b => b.onclick = () => { AU.sfx('stamp'); this.choose(+b.dataset.i); });
    requestAnimationFrame(() => this._chart(box.querySelector('.dz-chart'), a, lab));
    return box;
  },
  // bars for the group means with a dot for every dish, so the spread between repeats shows
  _chart(cv, a, lab) {
    if (!cv) return;
    const r = cv.getBoundingClientRect(), dpr = G.dpr, w = r.width || 360, H = 170;
    cv.width = Math.round(w * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const G2 = a.groups, n = G2.length, x0 = 34, y0 = 12, ph = H - 44, bw = (w - x0 - 8) / n;
    c.strokeStyle = '#1B1A17'; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y0 + ph); c.lineTo(w - 4, y0 + ph); c.stroke();
    c.fillStyle = '#4A4436'; c.font = '600 10px "Courier Prime", monospace'; c.textAlign = 'right';
    for (const v of [0, 5, 10]) { const y = y0 + ph - v / 10 * ph; c.fillText(String(v), x0 - 5, y + 3); c.strokeStyle = 'rgba(0,0,0,0.12)'; c.beginPath(); c.moveTo(x0, y); c.lineTo(w - 4, y); c.stroke(); }
    G2.forEach((g, i) => {
      const bx = x0 + i * bw + bw * 0.2, bh = g.mean / 10 * ph;
      c.fillStyle = '#9CC06A'; c.fillRect(bx, y0 + ph - bh, bw * 0.6, bh); c.strokeStyle = '#3F5A2A'; c.strokeRect(bx, y0 + ph - bh, bw * 0.6, bh);
      g.n.forEach((v, j) => { c.fillStyle = '#1B1A17'; c.beginPath(); c.arc(bx + bw * 0.3 + (j - (g.n.length - 1) / 2) * 5, y0 + ph - v / 10 * ph, 2.6, 0, TAU); c.fill(); });
      c.fillStyle = '#1B1A17'; c.textAlign = 'center'; c.font = '600 10px "Atkinson Hyperlegible Next", sans-serif';
      c.fillText(lab(g).slice(0, 22), bx + bw * 0.3, y0 + ph + 14);
    });
  },
  _review() {
    const s = this.st, r = this.review(), box = h('div', 'dz-review'), q = s.q;
    box.innerHTML = `<h2>${U.esc(L(tr('Nebahat Nine’nin notu', 'Grandma Nebahat’s marking')))}</h2>
      <div class="dz-stars">${'★'.repeat(r.stars)}${'☆'.repeat(6 - r.stars)}</div>
      <ul class="dz-rubric">${r.rows.map(x => `<li class="${x.ok ? 'ok' : 'no'}"><i>${x.ok ? '✓' : '✗'}</i>${U.esc(L(x.t))}</li>`).join('')}</ul>
      ${r.hyp ? `<p class="dz-hypres">${U.esc(L(r.hyp))}</p>` : ''}
      ${s.hyp.why != null && s.hyp.why !== 0 ? `<p class="dz-note">${U.esc(L(tr('Gerekçene bir daha bak: ', 'Look again at your reason: ')))}${U.esc(L(q.why[0]))}.</p>` : ''}
      <p class="dz-say"><b>${U.esc(L(ACT.names[q.who]))}:</b> “${U.esc(L(r.happy ? q.thanks : tr('Hmm, bundan emin olamadım. Deneyini düzeltip bir daha dener misin?', 'Hmm, I’m not sure about that. Could you fix your experiment and try again?')))}”</p>
      <div class="dz-foot"><button class="dz-again">${U.esc(L(tr('Düzeneği değiştir', 'Change the set-up')))}</button><button class="dz-other">${U.esc(L(tr('Başka soru', 'Another question')))}</button><button class="big yes dz-done">${U.esc(T('close'))}</button></div>`;
    box.querySelector('.dz-again').onclick = () => { AU.sfx('click'); Object.assign(s, { phase: 'setup', counts: null, claim: null }); this.view(); };
    box.querySelector('.dz-other').onclick = () => { AU.sfx('click'); Object.assign(s, { phase: 'pick', q: null, counts: null, claim: null }); this.view(); };
    box.querySelector('.dz-done').onclick = () => { AU.sfx('click'); this.close(); };
    if (r.stars === 6) UI.stamp(L(tr('BİLİM İNSANI', 'SCIENTIST')), '★★★★★★');
    return box;
  },
};
