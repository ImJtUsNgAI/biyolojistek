'use strict';
// Season simulation: crops, soil nitrogen, the pond's nitrate → algae → oxygen → fish chain.
const SIM = {
  newState(name, look) {
    return {
      v: 1, name: name || '', look: look || 0,
      season: 0, year: 1,
      // soil N is 0..100; wheat yellows below ~40
      fields: {
        A: { crop: 'fallow', stage: 0, n: 45, yellow: false, plan: null },
        B: { crop: 'wheat', stage: 1, n: 22, yellow: true, plan: null, tested: false },
        C: { crop: 'wheat', stage: 1, n: 52, yellow: false, plan: null },
        D: { crop: 'chickpea', stage: 1, n: 60, yellow: false, plan: null },
      },
      pond: { nitrate: 50, algae: 55, oxygen: 40, fish: 3, dead: 2, tested: false },
      buffer: false, fertRunoff: 0,
      flags: {}, restored: {}, visited: {}, cases: {}, answers: [],
      journal: { obs: {}, exps: [], seeds: ['siyez'], notes: [], reviews: {}, seen: {} },
      mendel: { step: 0, bed: null, f1: null, f2: null },
      waypoint: null, player: null, t0: Date.now(),
    };
  },

  // Runs when the player sleeps. Returns lines for the season postcard.
  advance(S) {
    const out = [];
    const nextSeason = (S.season + 1) % 4;
    // --- fields
    let runoff = 0;
    for (const id in S.fields) {
      const f = S.fields[id];
      if (f.plan === 'fert') { f.n = Math.min(100, f.n + 45); runoff += 30; S.flags.usedFert = true; out.push({ tr: `${id} tarlasına suni gübre atıldı: bitki çabuk yeşillendi, fazlası yağmurla nehre aktı.`, en: `Field ${id} got chemical fertiliser: the crop greened fast, and the extra washed into the river with the rain.` }); }
      if (f.plan === 'compost') { f.n = Math.min(100, f.n + 30); out.push({ tr: `${id} tarlasına kompost karıştırıldı: yavaş ama kalıcı azot.`, en: `Compost went into field ${id}: slow but lasting nitrogen.` }); }
      if (f.plan === 'legume') { f.crop = 'chickpea'; f.stage = 0; out.push({ tr: `${id} tarlasına nohut ekildi. Köklerindeki nodüller toprağa azot kazandıracak.`, en: `Chickpeas were sown in field ${id}. The nodules on their roots will add nitrogen to the soil.` }); }
      if (f.plan === 'both') { f.n = Math.min(100, f.n + 30); f.legumeNext = true; out.push({ tr: `${id} tarlası: kompost şimdi, hasattan sonra nohut. Toprak dinlenecek.`, en: `Field ${id}: compost now, chickpeas after the harvest. The soil will get a rest.` }); }
      f.plan = null;
      if (f.crop === 'chickpea') f.n = Math.min(100, f.n + 14);
      if (f.crop === 'wheat') f.n = Math.max(0, f.n - 8);
      if (f.crop === 'fallow') f.n = Math.min(100, f.n + 3);
      if (nextSeason === 3) { f.stage = f.crop === 'fallow' ? 0 : 4; }
      else if (nextSeason === 0) {
        if (f.crop === 'wheat' && f.legumeNext) { f.crop = 'chickpea'; f.legumeNext = false; }
        f.stage = f.crop === 'fallow' ? 0 : 1;
      }
      else f.stage = Math.min(3, f.stage + (f.crop === 'fallow' ? 0 : 1));
      f.yellow = f.crop === 'wheat' && f.n < 40 && f.stage < 4;
    }
    // --- harvest estimate for the postcard
    if (nextSeason === 2) {
      const B = S.fields.B;
      const kg = Math.round(180 + B.n * 3.2);
      S.lastHarvest = kg;
      out.push({ tr: `B tarlasının hasadı: dönüm başına ~${kg} kg siyez.`, en: `Field B harvest: about ${kg} kg of siyez per dönüm.` });
    }
    // --- pond chain
    const P = S.pond;
    const inflow = S.buffer ? runoff * 0.25 : runoff;
    P.nitrate = U.clamp(P.nitrate * (S.buffer ? 0.55 : 0.85) + inflow + (S.buffer ? 0 : 6), 0, 100);
    const warm = nextSeason === 1 ? 1.2 : nextSeason === 3 ? 0.5 : 1;
    P.algae = U.clamp(P.algae + (P.nitrate - 30) * 0.8 * warm - (S.buffer ? 12 : 0), 5, 100);
    P.oxygen = U.clamp(95 - P.algae * 0.9 + (nextSeason === 3 ? 10 : 0), 5, 100);
    if (P.oxygen < 35) { const d = Math.min(P.fish, 1 + (P.oxygen < 20 ? 1 : 0)); P.fish -= d; P.dead += d; if (d) out.push({ tr: 'Gölette yine ölü balık var. Su oksijensiz kalıyor.', en: 'More dead fish in the pond. The water is running out of oxygen.' }); }
    else { P.dead = Math.max(0, P.dead - 2); if (P.oxygen > 60 && P.fish < 6) P.fish++; }
    if (inflow > 0 && !S.buffer) out.push({ tr: 'Nehir bu mevsim yeşil ve bulanık aktı.', en: 'The river ran green and cloudy this season.' });
    if (S.buffer && P.algae < 40) out.push({ tr: 'Kıyıdaki sazlar ve söğütler suyu süzüyor; gölet berraklaşıyor.', en: 'The reeds and willows on the bank are filtering the water, and the pond is clearing.' });
    // --- storks and frogs
    if (nextSeason === 2) out.push({ tr: 'Leylekler güneye, Afrika’ya uçtu. Bahara dönecekler.', en: 'The storks flew south to Africa. They will be back in spring.' });
    if (nextSeason === 0 && S.season === 3) out.push({ tr: 'Leylekler döndü! Aynı yuvaya, okulun damına.', en: 'The storks are back! Same nest, on the school roof.' });
    S.season = nextSeason;
    if (nextSeason === 0) S.year++;
    return out;
  },
};
