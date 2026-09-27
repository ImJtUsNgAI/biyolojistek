'use strict';
// The specimen table (İnceleme masası): a full-screen, touch-first wall chart of one specimen.
// Tapping a numbered part glides the chart in on it and slides in a card that explains it. Once every part of a
// layer has been explored, the table offers review questions. Built for classroom smartboards: large targets,
// nothing hidden behind hover, right-click or the wheel, and every control sits in the lower two thirds.

// the part of the shallower layer that each deeper layer grows out of (the dive transition flies through it)
const DIVE_FROM = {
  'cow:1': ['cow_rumen', 'cow_reticulum'], 'cow:3': ['cow_omasum', 'cow_abomasum'], 'cow:4': ['rumen_papillae'], 'cow:5': ['rumen_fluid', 'rumen_foam'], 'sheep:1': ['sheep_rumen'], 'dog:1': ['dog_stomach'],
  'stork:1': ['bird_keel'], 'pond:1': ['algae_bloom', 'pond_oxygen'], 'wheat:1': ['wheat_leaf'], 'wheat:2': ['mesophyll'],
  'wheat:3': ['chloroplast', 'chloroplast_pale'], 'chickpea:1': ['nodule'], 'clover:1': ['nodule'], 'pea:1': ['ovary'],
  'pea:2': ['seed_shape'], 'mushroom:1': ['mushroom_gills'], 'soil:1': ['humus'], 'willow:1': ['willow_stoma'], 'bee:1': ['pollen_basket'],
  'dough:1': ['dense_dough', 'gas_cells'],
  'sprout:1': ['radicle', 'root_hair'], 'spring:1': ['mat_bands'], 'blood:1': ['rbc_column'], 'garden:1': ['root_hair'], 'owl:1': ['owl_eye'], 'snack:1': ['walnut_kernel'], 'onion:1': ['onion_skin'], 'onion:2': ['cytoplasm'], 'apple:1': ['scion'], 'apple:2': ['cambium'], 'sweep:1': ['aphid', 'ladybird'], 'heart:1': ['left_ventricle', 'aorta'], 'heart:2': ['artery'], 'snack:2': ['oil_body', 'sudan_test'],
};

// [tr, en] → current language; **bold** and *italic* markup → HTML
const LX = a => a ? a[I18N.lang === 'en' ? 1 : 0] : '';
const md = s => U.esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
const plain = s => String(s).replace(/\*/g, '');
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const currText = code => { for (const th of CURR.themes) for (const [c, t] of th.items) if (c === code) return L(t); return ''; };
// hide a part's own name inside a clue, Turkish suffixes, compounds ("sapwood") and dotted capitals included
function maskName(text, title) {
  let out = text;
  for (const w of title.replace(/[()·,]/g, ' ').split(/\s+/).filter(w => w.length >= 4)) {
    const stem = w.toLocaleLowerCase('tr').slice(0, Math.max(4, w.length - 2));
    const pat = [...stem].map(ch => /\p{L}/u.test(ch) ? `[${ch}${ch.toLocaleUpperCase('tr')}${ch.toUpperCase()}]` : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('');
    out = out.replace(new RegExp('\\p{L}*' + pat + '\\p{L}*', 'gu'), '▢▢▢');
  }
  return out;
}
// layers seen through a light microscope: the first time, the student has to bring them into focus
const SCOPE = { 'wheat:1': 1, 'wheat:2': 1, 'chickpea:1': 1, 'clover:1': 1, 'pea:2': 1, 'cow:5': 1, 'dog:1': 1, 'mushroom:1': 1, 'soil:1': 1, 'pond:1': 1, 'willow:0': 1, 'willow:1': 1, 'bee:1': 1, 'dough:1': 1, 'sprout:1': 1, 'spring:1': 1, 'blood:1': 1, 'garden:1': 1, 'owl:1': 1, 'snack:1': 1, 'onion:1': 1, 'apple:2': 1, 'sweep:2': 1, 'heart:1': 1, 'heart:2': 1 };
// layers that can be stained on the table, and with what
const STAIN = {
  'pea:2': { part: 'iodine_test', at: [-40, -20], ink: 'rgba(150,82,18,0.95)', label: 'st_stain', msg: st => st.wrinkled ? 'st_stain_pale' : 'st_stain_dark' },
  'snack:1': { part: 'sudan_test', at: [40, -60], ink: 'rgba(214,52,30,0.95)', label: 'st_stain_sudan', msg: () => 'st_sudan_red' },
  'dough:1': { part: 'mb_test', at: [-66, 66], ink: 'rgba(36,70,176,0.95)', label: 'st_stain_mb', msg: st => st.yeastDead ? 'st_mb_dead' : 'st_mb_live' },
};
// layers whose plate changes with the specimen's health: the table can show both states side by side
const HEALTHY = tr('Sağlıklı', 'Healthy');
const COMPARE = {
  'cow:1': { a: { bloat: 1 }, b: { bloat: 0 }, la: tr('Şişkin', 'Bloated'), lb: HEALTHY },
  'cow:4': { a: { bloat: 1 }, b: { bloat: 0 }, la: tr('Şişkin', 'Bloated'), lb: HEALTHY },
  'wheat:0': { a: { pale: true }, b: { pale: false }, la: tr('Azot eksik', 'Short of nitrogen'), lb: HEALTHY },
  'wheat:2': { a: { pale: true }, b: { pale: false }, la: tr('Azot eksik', 'Short of nitrogen'), lb: HEALTHY },
  'pond:0': { a: { algae: 85, oxygen: 15, fish: 2, dead: 3 }, b: { algae: 10, oxygen: 95, fish: 5, dead: 0 }, la: tr('Ötrofik', 'Eutrophic'), lb: HEALTHY },
  'pond:1': { a: { algae: 85, oxygen: 15, fish: 2, dead: 3 }, b: { algae: 10, oxygen: 95, fish: 5, dead: 0 }, la: tr('Ötrofik', 'Eutrophic'), lb: HEALTHY },
  'pea:2': { a: { wrinkled: true }, b: { wrinkled: false }, la: tr('Buruşuk (rr)', 'Wrinkled (rr)'), lb: tr('Yuvarlak (RR, Rr)', 'Round (RR, Rr)') },
  'dough:0': { a: { risen: false }, b: { risen: true }, la: tr('Ölü maya', 'Dead yeast'), lb: tr('Canlı maya', 'Live yeast') },
  'dough:1': { a: { yeastDead: true }, b: { yeastDead: false }, la: tr('Ölü maya', 'Dead yeast'), lb: tr('Canlı maya', 'Live yeast') },
  'garden:0': { a: { salty: true }, b: { salty: false }, la: tr('Kuyu suyu', 'Well water'), lb: tr('Yağmur suyu', 'Rain water') },
  'onion:1': { a: { cheek: false }, b: { cheek: true }, la: tr('Soğan zarı', 'Onion skin'), lb: tr('Yanak', 'Cheek') },
  'heart:1': { a: { hyper: true }, b: { hyper: false }, la: tr('Yıllarca yüksek tansiyon', 'Years of high pressure'), lb: tr('Normal tansiyon', 'Normal pressure') },
  'sweep:0': { a: { sprayed: true }, b: { sprayed: false }, la: tr('İlaçlı çayır', 'Sprayed meadow'), lb: tr('İlaçsız çayır', 'Unsprayed meadow') },
  'owl:1': { a: { human: false }, b: { human: true }, la: tr('Baykuş', 'Owl'), lb: tr('İnsan · sarı benek', 'Human · fovea') },
  'garden:1': { a: { salty: true }, b: { salty: false }, la: tr('Kuyu suyu', 'Well water'), lb: tr('Yağmur suyu', 'Rain water') },
};
const easeIO = k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

const STUDY = {
  on: false, el: null, cv: null, ctx: null, card: null, hsEl: null, tg: null, specId: null, level: 0, sel: null, mode: 'explore',
  cam: { x: 0, y: 0, z: 1, ax: 0, ay: 0 }, alpha: 1, ringT: 0, focusT: 0, w: 0, h: 0,
  _lwk: 1, _tw: [], _bbox: {}, _hs: {}, _offered: {}, _busy: false, _pending: null, _onFind: null, _opt: {}, scope: null, blur: 0, eye: 0, stainT: -1, cmp: false,
  // smart-board tools: the active tool, names shown on every spot, the teacher's ink per chart, live pointers and gesture
  tool: 'pan', names: false, _ink: {}, _spot: null, inkCol: 0, INKS: ['#C8302A', '#26306A', '#16898E', '#D89A10'], _pt: new Map(), _g: null, _loupe: null, _stroke: null, _lastTap: null,

  // ================================================================ data
  partsOf(specId, l, tg) {
    const lv = SPECS[specId].levels[l], st = LENS.state(tg || { spec: specId });
    const list = typeof lv.callouts === 'function' ? lv.callouts(st) : lv.callouts;
    return list.map(([id, px, py], i) => ({ id, n: i + 1, px, py }));
  },
  parts(l = this.level) { return this.partsOf(this.specId, l, this.tg); },
  found(id) { return !!G.S.journal.obs[id]; },
  prog(l = this.level) { const p = this.parts(l); return { a: p.filter(q => this.found(q.id)).length, b: p.length }; },
  specProgress(specId) {
    const ids = new Set();
    SPECS[specId].levels.forEach((lv, l) => this.partsOf(specId, l).forEach(p => ids.add(p.id)));
    const all = [...ids];
    return { a: all.filter(id => this.found(id)).length, b: all.length };
  },
  reviewOf(specId, l) { const r = G.S.journal.reviews; return r ? r[specId + ':' + l] : null; },
  canOpen(specId) { const S = G.S; return !!(G.set.board || S.flags.lesson || (S.journal.seen && S.journal.seen[specId])); },
  key(l = this.level) { return this.specId + ':' + l; },
  spec() { return SPECS[this.specId]; },
  lv() { return this.spec().levels[this.level]; },
  st() { const st = LENS.state(this.tg); st.t = this._mt; return st; },
  splitTag(tag) { const s = L(tag), m = /^(×[\d\s.,]*\d)\s+(\D.*)$/.exec(s); return m ? [m[1], m[2]] : [s, '']; },

  // ================================================================ open / close
  open(tg, level = 0, focus = null, from = null, opt = {}) {
    if (this.on || !tg || !SPECS[tg.spec] || !G.S) return false;
    const S = G.S;
    (S.journal.seen = S.journal.seen || {})[tg.spec] = 1;
    Object.assign(this, { tg, specId: tg.spec, level: U.clamp(level || 0, 0, SPECS[tg.spec].levels.length - 1), sel: null, mode: 'explore', on: true,
      _tw: [], ringT: 0, focusT: 0, alpha: 1, _busy: false, _pending: null, _onFind: null, _opt: opt || {},
      tool: 'pan', _pt: new Map(), _g: null, _loupe: null, _stroke: null, _lastTap: null, pair: null, cover: null, _scrub: null, bare: false, _zb: null,
      _mt: 0, _still: false, _rate: 1, _moA: null });
    if (window.speechSynthesis) speechSynthesis.cancel();
    this._inkLoad();
    this._build(from);
    this._layout();
    Object.assign(this.cam, this._fitCam(false));
    this.cmp = false;
    this._hotspots();
    Object.assign(this.cam, this._fitCam(false));   // again, now that the title has made room for the tools
    this.scope = null; this.stainT = -1;
    if (!focus && !(opt && opt.noFocus)) this._maybeFocus();
    this.eye = this.scope ? 1 : 0;
    this.frame(0);
    AU.sfx('lens');
    if ((this._ink[this.key()] || []).length) setTimeout(() => { if (this.on) UI.toast(T('st_ink_kept'), '✎'); }, 700);
    if (focus && this.parts().some(p => p.id === focus)) setTimeout(() => { if (this.on && !this.sel) this.focus(focus); }, G.reduceMotion ? 0 : 450);
    return true;
  },
  close() {
    if (!this.on) return;
    PLATE_CACHE.tile = null; PLATE_CACHE._want = null;   // the sharp tile can be tens of megabytes
    this._mapImg = null;
    if (!this._reopen) this._pres = null;
    this.on = false; this.scope = null;
    this._abortQuiz();
    if (window.speechSynthesis) speechSynthesis.cancel();
    UI._pop(this.el);
    AU.sfx('lens');
    G.save();
    const cb = this._opt.onClose;
    this._opt = {};
    if (cb) setTimeout(cb, 300);
  },
  resize() {
    if (!this.on) return;
    this._layout();
    Object.assign(this.cam, this.sel ? this._focusCam(this.sel) : this._fitCam(this.card.classList.contains('show')));
  },
  _build(from) {
    const el = this.el = h('div', 'modal study');
    if (from) { el.style.setProperty('--ox', Math.round(from[0]) + 'px'); el.style.setProperty('--oy', Math.round(from[1]) + 'px'); }
    el.innerHTML = `<div class="st-sheet">
      <canvas class="st-cv"></canvas>
      <div class="st-map" title="${U.esc(T('st_map_t'))}"><canvas></canvas></div>
      <div class="st-motion hidden" role="toolbar" aria-label="${U.esc(T('st_mo_n'))}"><button class="mo-p"></button><button class="mo-s">½</button></div>
      <div class="st-hs"></div>
      <header class="st-head"><small class="st-kicker"></small><h2 class="st-name"></h2></header>
      <nav class="st-rail"></nav>
      <aside class="st-card"></aside>
      <footer class="st-foot">
        <button class="st-back">${ICON.back}<span></span></button>
        <button class="st-help" aria-label="${U.esc(T('st_help_t'))}">?</button>
        <button class="st-tm only-board" aria-label="${U.esc(T('hud_timer'))}">${ICON.clock}</button>
        <button class="st-eye" aria-label="${U.esc(T('st_marks'))}" title="${U.esc(T('st_marks'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><path class="sl" d="M4 20 20 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
        <button class="st-grid" aria-label="${U.esc(T('st_grid_t'))}" title="${U.esc(T('st_grid_t'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="9" width="6" height="6" fill="#C8302A" opacity="0.75"/></svg></button>
        <div class="st-mid"><div class="st-bar"><i></i></div><p class="st-hint"></p></div>
        <button class="st-cmp hidden"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="8.5" height="14" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="5" width="8.5" height="14" fill="currentColor"/></svg><span>${T('st_cmp')}</span></button>
        <button class="st-stain hidden"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2h6v3h-2v4l3 2v6a4 4 0 0 1-8 0v-6l3-2V5H9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 14h6v3a3 3 0 0 1-6 0z" fill="currentColor"/></svg><span></span></button>
        <button class="st-cov hidden"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h18M4.5 3v10c0 3 2 5 4 6M19.5 3v10c0 3-2 5-4 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 3c.5 5 1.5 9 4 12 2.5-3 3.5-7 4-12" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="20" r="1.4" fill="currentColor"/></svg><span></span></button>
        <button class="st-mys hidden"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.2 15.2 21 21" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M7.9 8.3a2.2 2.2 0 1 1 3.1 2c-.7.3-1 .8-1 1.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="14.1" r="0.95" fill="currentColor"/></svg><span>${T('st_mys')}</span></button>
        <button class="st-lab hidden"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12.5V4h8.5l9.5 9.5-8.5 8.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7.5" cy="8.5" r="1.7" fill="currentColor"/></svg><span>${T('st_lab')}</span></button>
        <button class="st-rev hidden">${ICON.quiz}<span>${T('st_review')}</span></button>
        <button class="st-dive hidden"><span>${T('lens_dive')}</span></button>
      </footer>
      <div class="st-scope hidden"></div>
      <div class="st-tools" role="toolbar"><button data-t="pan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12.5V5.8a1.6 1.6 0 0 1 3.2 0V11M11.2 10.4V4.3a1.6 1.6 0 0 1 3.2 0v6.2M14.4 10.5V5.6a1.6 1.6 0 0 1 3.2 0v6M17.6 11.2V8.4a1.6 1.6 0 0 1 3.2 0v6c0 4-3 6.9-6.9 6.9h-1.2c-2.9 0-4.4-1.4-5.9-3.9l-2.6-4.5a1.6 1.6 0 0 1 2.7-1.6L8 13.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${T('st_t_pan')}</span></button><button data-t="loupe"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15l6 6" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M7 10h6M10 7v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span>${T('st_t_loupe')}</span></button><button data-t="pen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 6.6l3.4 3.4" stroke="currentColor" stroke-width="1.8"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="#C8302A"/></svg><span>${T('st_t_pen')}</span></button><button data-t="spot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 2h20v20H2z" fill="currentColor" opacity="0.28"/><circle cx="12" cy="12" r="6.2" fill="#F4E4A0" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span>${T('st_t_spot')}</span></button><button data-t="ruler"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 15.5 15.5 2.5l6 6-13 13z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6.5 11.5l2 2M9.5 8.5l1.5 1.5M12.5 5.5l2 2M5 13l1.5 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span>${T('st_t_ruler')}</span></button><button data-t="count"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 4.5v15M9.5 4.5v15M13.5 4.5v15M17.5 4.5v15" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M3 16.5 20.5 7.5" stroke="#C8302A" stroke-width="2.3" stroke-linecap="round"/></svg><span>${T('st_t_count')}</span></button><button data-a="wipe" class="wipe hidden"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20h12M5.2 14.8l8-8a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8L13 19H9.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11l5 5" stroke="currentColor" stroke-width="1.8"/></svg><span>${T('st_t_wipe')}</span></button><i></i><button data-z="-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>${T('st_t_out')}</span></button><button data-z="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>${T('st_t_in')}</span></button><button data-a="zbox"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="13.5" height="11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2.8 2.2"/><circle cx="16.2" cy="16.2" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19.3 19.3l2.6 2.6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>${T('st_t_zbox')}</span></button><button data-a="fit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${T('st_t_fit')}</span></button><button data-a="names"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7.4" cy="8.4" r="1.7" fill="currentColor"/></svg><span>${T('st_t_names')}</span></button><button data-a="pair"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="9" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="5" width="9" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6.5" cy="12" r="2.2" fill="currentColor"/><path d="M15.5 10.5l2 3 2.5-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${T('st_t_pair')}</span></button><button data-a="shot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h4l1.8-2.6h6.4L17 8h4v11H3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13.3" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg><span>${T('st_t_shot')}</span></button><button data-a="views"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 7.2l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="currentColor"/></svg><span>${T('st_t_views')}</span></button><button data-a="bare"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8.5V3h5.5M21 8.5V3h-5.5M3 15.5V21h5.5M21 15.5V21h-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="7.5" y="7.5" width="9" height="9" fill="currentColor" opacity="0.35"/></svg><span>${T('st_t_bare')}</span></button></div><div class="st-pens hidden" role="toolbar">${this.INKS.map((c, i) => `<button data-c="${i}" aria-label="${U.esc(T('st_t_ink'))} ${i + 1}"><b class="dot" style="background:${c}"></b></button>`).join('')}<button data-c="4" class="hl"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 21.5h10" stroke="#F2CC1D" stroke-width="3.4" stroke-linecap="round"/><path d="M14.6 2.8l6.6 6.6-8.4 8.4-6.6-6.6z" fill="#FFE14D" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6.2 11.2 3.4 17l3.6 3.6 5.8-2.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span>${T('st_hl')}</span></button><button data-c="5" class="lz"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18c3-1 5-6 8-7s5 2 8-2" fill="none" stroke="#E8402A" stroke-width="2.4" stroke-linecap="round" opacity="0.45"/><circle cx="19" cy="9" r="3.4" fill="#FF5A3C"/><circle cx="19" cy="9" r="1.4" fill="#FFF4E8"/></svg><span>${T('st_lz')}</span></button><button data-c="6" class="ar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 16.8 7.2" stroke="#C8302A" stroke-width="2.6" stroke-linecap="round"/><path d="M20.5 3.5l-2.4 8-5.6-5.6z" fill="#C8302A" stroke="#C8302A" stroke-width="1.2" stroke-linejoin="round"/></svg><span>${T('st_ar')}</span></button><button data-c="7" class="pn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22.5C12 22.5 4.6 14.6 4.6 9.3a7.4 7.4 0 0 1 14.8 0c0 5.3-7.4 13.2-7.4 13.2z" fill="#26306A" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><text x="12" y="12.6" text-anchor="middle" font-size="9" font-weight="700" fill="#F4EEDD" font-family="monospace">1</text></svg><span>${T('st_pn')}</span></button><button data-c="8" class="er"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.6 15.6 6.8 10.8a1.8 1.8 0 0 1 0-2.5l4.9-4.9a1.8 1.8 0 0 1 2.5 0l4.8 4.8a1.8 1.8 0 0 1 0 2.5l-4.9 4.9a1.8 1.8 0 0 1-2.5 0z" fill="#F2B8B0" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.4 5.7l7.4 7.4" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 21c1.5-2.2 3-2.2 4.5 0s3 2.2 4.5 0" fill="none" stroke="#C8302A" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2 2.2"/></svg><span>${T('st_er')}</span></button><i></i><button class="undo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v5.2h5.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6 9.2A8 8 0 1 1 6.3 17.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg><span>${T('st_t_undo')}</span></button></div><div class="st-pens st-opts hidden" role="toolbar"><div class="o-spot">${[4, 7, 10].map((r, i) => `<button data-o="spot" data-v="${i}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="${r}" fill="#F4E4A0" stroke="currentColor" stroke-width="1.8"/></svg><span>${T('st_sz' + i)}</span></button>`).join('')}</div><div class="o-loupe">${this.LOUPE_K.map((k, i) => `<button data-o="loupe" data-v="${i}"><b class="kx">${String(k).replace('.', ',')}×</b></button>`).join('')}</div><div class="o-count"><button data-o="count" data-v="0"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="#C8302A" stroke="currentColor" stroke-width="1.6"/></svg><span class="cn">0</span></button><button data-o="count" data-v="1"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.6" fill="none" stroke="#26306A" stroke-width="3.4"/></svg><span class="cn">0</span></button><button class="cnt-save"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11M7.5 9.5 12 14l4.5-4.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 14.5V20h16v-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span>${T('st_cnt_save')}</span></button><button class="cnt-table"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 9h18M3 14h18M9 4v16" stroke="currentColor" stroke-width="1.5"/></svg><span>${T('st_cnt_table')}</span></button><button class="cnt-reset"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><path d="M4 3.5v4.8h4.8" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${T('st_cnt_reset')}</span></button></div><div class="o-cmp"><button data-o="cmp" data-v="0"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="8.5" height="14" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="5" width="8.5" height="14" fill="currentColor"/></svg><span>${T('st_cmp_side')}</span></button><button data-o="cmp" data-v="1"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="16" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="12" y="4" width="9.5" height="16" fill="currentColor" opacity="0.3"/><path d="M12 4v16" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.6" fill="#FBF7EC" stroke="currentColor" stroke-width="1.6"/><path d="M7.4 10.4 5.6 12l1.8 1.6M16.6 10.4l1.8 1.6-1.8 1.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${T('st_cmp_slide')}</span></button></div></div>
      <button class="st-x x" aria-label="${U.esc(T('close'))}">${ICON.close}</button>
      <nav class="st-mini" role="toolbar"></nav>
      <div class="st-pres hidden" role="toolbar"><button class="pp" aria-label="${U.esc(T('st_pres_prev'))}">◀</button><div class="pi"><b class="pn"></b><span class="pt"></span></div><button class="px yes" aria-label="${U.esc(T('st_pres_next'))}">▶</button><button class="pe" aria-label="${U.esc(T('st_pres_end'))}">${ICON.close}</button></div>
    </div>`;
    this.cv = el.querySelector('.st-cv'); this.ctx = this.cv.getContext('2d'); this._patchLW(this.ctx);
    this.hsEl = el.querySelector('.st-hs'); this.card = el.querySelector('.st-card');
    // the clean view's strip: the same icons as the toolbar, so nothing new to learn
    const mini = el.querySelector('.st-mini'), svg = s => el.querySelector('.st-tools ' + s + ' svg').outerHTML;
    mini.innerHTML = `<button class="out" aria-label="${U.esc(T('st_bare_out'))}" title="${U.esc(T('st_bare_out'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 3v5.5H3M15.5 3v5.5H21M8.5 21v-5.5H3M15.5 21v-5.5H21" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><i></i>`
      + ['pan', 'pen', 'spot', 'loupe', 'count'].map(t => `<button data-t="${t}" aria-label="${U.esc(T('st_t_' + t))}">${svg(`[data-t=${t}]`)}</button>`).join('') + '<i></i>'
      + [['z', '-1', 'st_t_out'], ['z', '1', 'st_t_in'], ['a', 'zbox', 'st_t_zbox'], ['a', 'fit', 'st_t_fit']].map(([k, v, l]) => `<button data-${k}="${v}" aria-label="${U.esc(T(l))}">${svg(`[data-${k}="${v}"]`)}</button>`).join('');
    for (const b of mini.querySelectorAll('button')) b.onclick = e => {
      e.stopPropagation();
      const d = b.dataset;
      if (d.t) this.setTool(d.t);
      else if (d.z) this._zoomBtn(+d.z > 0 ? 1.6 : 1 / 1.6);
      else if (d.a === 'fit') this.fit();
      else if (d.a === 'zbox') this.zoomBox();
      else this.setBare(false);
    };
    // the overview map: a tap sends the view there, a drag carries it along
    const mp = this._mapEl = el.querySelector('.st-map'), mc = this._mapCv = mp.querySelector('canvas');
    Object.assign(this, { _mapK: null, _mapPt: null, _mapSig: null, _mapD: null, _mapXY: null, _mapA: null });
    const mo = this._moEl = el.querySelector('.st-motion');
    mo.querySelector('.mo-p').onclick = () => this.freeze();
    mo.querySelector('.mo-s').onclick = () => this.slow();
    this._moSync();
    mc.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation();
      if (!mp.classList.contains('show')) return;
      try { mc.setPointerCapture(e.pointerId); } catch (er) { }
      this._mapPt = e.pointerId; this._mapGo(e, true);
    });
    mc.addEventListener('pointermove', e => { if (this._mapPt === e.pointerId) this._mapGo(e, false); });
    for (const t of ['pointerup', 'pointercancel']) mc.addEventListener(t, e => { if (this._mapPt === e.pointerId) this._mapPt = null; });
    el.querySelector('.st-back span').textContent = T(this._opt.onClose ? 'st_back_j' : 'st_back');
    el.querySelector('.st-back').onclick = () => { AU.sfx('click'); this.close(); };
    el.querySelector('.st-x').onclick = () => { AU.sfx('click'); this.close(); };
    el.querySelector('.st-rev').onclick = () => { AU.sfx('page'); this.review(); };
    el.querySelector('.st-lab').onclick = () => this.label();
    el.querySelector('.st-mys').onclick = () => this.mystery();
    el.querySelector('.st-help').onclick = () => this.help();
    el.querySelector('.st-eye').onclick = () => this.toggleMarks();
    el.querySelector('.st-grid').onclick = () => this.toggleGrid();
    el.querySelector('.st-pres .pp').onclick = e => { e.stopPropagation(); this._presStep(-1); };
    el.querySelector('.st-pres .px').onclick = e => { e.stopPropagation(); this._presStep(1); };
    el.querySelector('.st-pres .pe').onclick = e => { e.stopPropagation(); AU.sfx('click'); this.presentEnd(); };
    el.querySelector('.st-cov').onclick = () => this.curtain(!this.cover);
    el.querySelector('.st-tm').onclick = () => { AU.sfx('click'); UI.timerPick(); };
    el.querySelector('.st-stain').onclick = () => this.stain();
    el.querySelector('.st-cmp').onclick = () => { AU.sfx('click'); this.compare(!this.cmp); };
    el.querySelector('.st-dive').onclick = () => { this.close(); Q.dive(); };
    const cv = this.cv;
    cv.addEventListener('pointerdown', e => this._pdown(e));
    cv.addEventListener('pointermove', e => this._pmove(e));
    cv.addEventListener('pointerup', e => this._pup(e));
    cv.addEventListener('pointercancel', e => this._pup(e, true));
    cv.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !this._pt.has(e.pointerId)) this._setLoupe(null); });
    cv.addEventListener('wheel', e => { e.preventDefault(); if (this._busy || this._mysLock()) return; const p = this._xy(e); this._zoomAt(p.x, p.y, Math.pow(1.0018, -e.deltaY)); }, { passive: false });
    for (const b of el.querySelectorAll('.st-tools button')) b.onclick = e => {
      e.stopPropagation();
      const d = b.dataset;
      if (d.t) this.setTool(d.t);
      else if (d.z) this._zoomBtn(+d.z > 0 ? 1.6 : 1 / 1.6);
      else if (d.a === 'fit') this.fit();
      else if (d.a === 'zbox') this.zoomBox();
      else if (d.a === 'names') { AU.sfx('click'); this.names = !this.names; this._refresh(); }
      else if (d.a === 'wipe') this.wipe();
      else if (d.a === 'shot') this.savePhoto();
      else if (d.a === 'views') { AU.sfx('click'); this.views(); }
      else if (d.a === 'bare') this.setBare(true);
      else if (d.a === 'pair') { AU.sfx('click'); if (this.pair) this.pairWith(null); else this._pairPicker(); }
    };
    // the pen strip: tap a colour (or the highlighter) to draw with it; Undo takes back the last line only
    for (const b of el.querySelectorAll('.st-opts [data-o]')) b.onclick = e => { e.stopPropagation(); this._setOpt(b.dataset.o, +b.dataset.v); };
    el.querySelector('.cnt-reset').onclick = e => { e.stopPropagation(); this._countReset(); };
    el.querySelector('.cnt-save').onclick = e => { e.stopPropagation(); this._countSave(); };
    el.querySelector('.cnt-table').onclick = e => { e.stopPropagation(); this._countTable(); };
    for (const b of el.querySelectorAll('.st-pens:not(.st-opts) button')) b.onclick = e => {
      e.stopPropagation();
      if (b.dataset.c) { this.inkCol = +b.dataset.c; AU.sfx('click'); this._refresh(); } else this.undo();
    };
    this._holdTips(el);
    el._key = e => this._key(e);
    UI._push('study', el);
  },
  // on a board the toolbar often shows icons only: holding a button a moment shows its name and what it is for, and
  // letting go then does not use it. A mouse gets the name as a tooltip
  _holdTips(el) {
    for (const b of el.querySelectorAll('.st-tools button, .st-mini button')) {
      const nm = (b.querySelector('span') && b.querySelector('span').textContent) || b.getAttribute('aria-label') || '';
      if (nm && !b.title) b.title = nm;
      let t = null;
      b.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse') return;
        clearTimeout(t); b._held = false;
        t = setTimeout(() => { b._held = true; this._tip(b, nm); }, 480);
      });
      const end = () => { clearTimeout(t); if (b._held) this._tipLater(); };
      b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end); b.addEventListener('pointerleave', end);
      b.addEventListener('click', e => { if (b._held) { b._held = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    }
  },
  _tip(b, nm) {
    const sh = this.el.querySelector('.st-sheet'), tip = this.el.querySelector('.st-tip') || sh.appendChild(h('div', 'st-tip'));
    const d = b.dataset, id = d.t || d.a || null, row = id && this.HELP.find(r => r[1] === id);
    const txt = row ? L(row[2]).split(/(?<=[.!?])\s/)[0] : '';
    tip.innerHTML = `<b>${U.esc(nm)}</b>${txt ? `<p>${U.esc(txt)}</p>` : ''}`;
    const r = b.getBoundingClientRect(), s = sh.getBoundingClientRect();
    tip.classList.add('show');
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = r.left - s.left + r.width / 2 - tw / 2, y = r.bottom - s.top + 10;
    if (y + th > s.height - 8) y = r.top - s.top - th - 10;
    // a button on the left strip: the tip goes beside it
    if (b.closest('.st-mini')) { x = r.right - s.left + 12; y = r.top - s.top + r.height / 2 - th / 2; }
    tip.style.left = Math.round(U.clamp(x, 8, s.width - tw - 8)) + 'px'; tip.style.top = Math.round(U.clamp(y, 8, s.height - th - 8)) + 'px';
    clearTimeout(this._tipT);
    AU.sfx('click');
  },
  _tipLater() { clearTimeout(this._tipT); this._tipT = setTimeout(() => { const tp = this.el && this.el.querySelector('.st-tip'); if (tp) tp.classList.remove('show'); }, 1800); },
  // the plates were drawn for a small lens; at wall-chart size their ink would turn to rope, so strokes thin out as we zoom
  _patchLW(c) {
    const d = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'lineWidth'), self = this;
    if (!d || !d.set) return;
    try { Object.defineProperty(c, 'lineWidth', { configurable: true, get() { return d.get.call(this) / self._lwk; }, set(v) { d.set.call(this, v * self._lwk); } }); } catch (e) { }
  },

  // ================================================================ geometry
  _layout() {
    const sh = this.el.querySelector('.st-sheet'), dpr = G.dpr;
    this.w = sh.clientWidth || G.vw; this.h = sh.clientHeight || G.vh;
    this.cv.width = Math.round(this.w * dpr); this.cv.height = Math.round(this.h * dpr);
    this.cv.style.width = this.w + 'px'; this.cv.style.height = this.h + 'px';
    this._fitHead(); this._fitFoot(); this._stackStrips(); this._fitRail(); this._fitMini();
  },
  // the clean view's strip on a short board: its buttons come down to a fingertip and close up before it runs off the sheet
  _fitMini() {
    const mini = this.el && this.el.querySelector('.st-mini'); if (!mini) return;
    mini.classList.remove('squeeze');
    if (this.bare && mini.offsetHeight > this.h - 16) mini.classList.add('squeeze');
  },
  // a tall rail (a specimen with many levels on a short board) ran into the title or the footer's Back button: it now
  // keeps to the free band between them, and its buttons shrink (still finger-sized) when even that band is too short
  _fitRail() {
    const q = s => this.el && this.el.querySelector(s), nav = q('.st-rail'), head = q('.st-head'), foot = q('.st-foot');
    if (!nav || !head || !foot) return;
    nav.classList.remove('squeeze'); nav.style.top = ''; nav.style.transform = ''; nav.style.removeProperty('--lv'); nav.style.removeProperty('--lk');
    if (!nav.offsetHeight || getComputedStyle(nav).flexDirection === 'row') return;
    const n = nav.querySelectorAll('.st-lv').length;
    // with the largest text on a short board even fingertip buttons can overrun the band: then it comes closer to the
    // title and the footer, and the links between the buttons get shorter still
    const tight = head.offsetHeight + foot.offsetHeight + 28 + n * 56 + (n - 1) * 4 > nav.parentNode.clientHeight - head.offsetTop;
    const m = tight ? 6 : 14, y0 = head.offsetTop + head.offsetHeight + m, y1 = foot.offsetTop - m, band = y1 - y0;
    if (band < 120) return;
    if (nav.offsetHeight > band && n > 1) {
      // the buttons shrink first (never below a fingertip), then the links between them shorten
      const s = U.clamp(Math.floor((band - (n - 1) * 8) / n), 56, 70), lk = U.clamp(Math.floor((band - n * s) / (n - 1)), tight ? 1 : 4, 24);
      nav.style.setProperty('--lv', s + 'px'); nav.style.setProperty('--lk', lk + 'px'); nav.classList.add('squeeze');
    }
    // centred on the sheet where it fits, as before; otherwise it slides into the band
    const rh = nav.offsetHeight, top = U.clamp(nav.parentNode.clientHeight / 2 - rh / 2, y0, Math.max(y0, y1 - rh));
    nav.style.top = Math.round(top) + 'px'; nav.style.transform = 'none';
  },
  // the tools and the title share the top edge: on a 1366-wide board the title wraps beside the tools instead of
  // hiding under them. Room is kept for the Erase button, so drawing never pushes the tools over the title
  _fitHead() {
    const tb = this.el && this.el.querySelector('.st-tools'), hd = this.el && this.el.querySelector('.st-head');
    if (!tb || !hd) return;
    const room = () => {
      const tr = tb.getBoundingClientRect(), hr = hd.getBoundingClientRect();
      if (!tr.width || tr.top > hr.top + 60) return null;
      const pan = tb.querySelector('[data-t=pan]'), gap = parseFloat(getComputedStyle(tb).columnGap) || 4;
      const spare = [...tb.querySelectorAll('[data-a=wipe]')].filter(b => b.classList.contains('hidden')).length * (pan.offsetWidth + gap);
      return tr.left - spare - hr.left - 18;
    };
    // a crowded top edge: the tools drop their words (the icons stay finger-sized) before the title gets squeezed
    tb.classList.remove('compact', 'tight');
    let r = room();
    if (r !== null && r < 260) { tb.classList.add('compact'); r = room(); }
    // still crowded (a 1366 board with every button out): the gaps close up and the buttons come down to a fingertip
    if (r !== null && r < 200) { tb.classList.add('tight'); r = room(); }
    hd.style.maxWidth = r === null ? '' : Math.round(Math.max(180, Math.min(this.w * 0.48, r))) + 'px';
  },
  _area(card) {
    const q = s => this.el.querySelector(s), rail = q('.st-rail'), head = q('.st-head'), foot = q('.st-foot');
    if (this.bare) {
      // the clean view: only the little strip on the left (and an open card on the right) take room
      const mini = q('.st-mini'), bx0 = mini.offsetLeft + mini.offsetWidth + 14, bx1 = card ? this.card.offsetLeft - 22 : this.w - 22;
      const pr = q('.st-pres'), by1 = pr && !pr.classList.contains('hidden') && pr.offsetHeight ? pr.offsetTop - 10 : this.h - 16;
      return { x0: bx0, y0: 16, x1: Math.max(bx0 + 120, bx1), y1: Math.max(136, by1) };
    }
    // a hint floating above a crowded footer takes its own strip off the bottom of the view
    const fh = foot.classList.contains('cramped') ? foot.querySelector('.st-hint') : null, lift = fh && fh.offsetHeight ? fh.offsetHeight + 8 : 0;
    const x0 = rail.offsetLeft + rail.offsetWidth + 14, y0 = head.offsetTop + head.offsetHeight + 6, y1 = foot.offsetTop - 10 - lift;
    const x1 = card ? this.card.offsetLeft - 22 : this.w - 22;
    return { x0, y0, x1: Math.max(x0 + 120, x1), y1: Math.max(y0 + 120, y1) };
  },
  // the drawing's extent in its own units: plates are fixed, X-rays are measured once by rendering them offscreen
  _frame(l = this.level) {
    const lv = this.spec().levels[l];
    if (((this.cmp && !this.cmpSlide) || this.pair) && l === this.level && lv.mode === 'plate') return [-300, -176, 600, 326];
    if (lv.mode !== 'xray') return [-140, -140, 280, 280];
    const st = this.st(), k = this.specId + ':' + l + ':' + (st.bloat > 0.3 ? 1 : 0);
    if (this._bbox[k]) return this._bbox[k];
    const S = 3, W0 = 600, H0 = 480, ox = 300, oy = 390, c = U.canvas(W0, H0), x = c.getContext('2d');
    x.translate(ox, oy); x.scale(S, S); lv.draw(x, st);
    let d = null; try { d = x.getImageData(0, 0, W0, H0).data; } catch (e) { }
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    if (d) for (let y = 0; y < H0; y += 2) for (let xx = 0; xx < W0; xx += 2) if (d[(y * W0 + xx) * 4 + 3] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    let b = x1 > x0 ? [(x0 - ox) / S, (y0 - oy) / S, (x1 + 2 - x0) / S, (y1 + 2 - y0) / S] : [-60, -90, 120, 90];
    for (const p of this.parts(l)) { const nx = Math.min(b[0], p.px - 6), ny = Math.min(b[1], p.py - 6); b = [nx, ny, Math.max(b[0] + b[2], p.px + 6) - nx, Math.max(b[1] + b[3], p.py + 6) - ny]; }
    const pad = Math.max(b[2], b[3]) * 0.08;
    return this._bbox[k] = [b[0] - pad, b[1] - pad, b[2] + pad * 2, b[3] + pad * 2];
  },
  _fitZ(A) { const f = this._frame(); return Math.min((A.x1 - A.x0) / f[2], (A.y1 - A.y0) / f[3]); },
  _fitCam(card) {
    const A = this._area(card), f = this._frame();
    return { x: f[0] + f[2] / 2, y: f[1] + f[3] / 2, z: this._fitZ(A) * 0.96, ax: (A.x0 + A.x1) / 2, ay: (A.y0 + A.y1) / 2 };
  },
  _focusCam(p) {
    const A = this._area(true);
    return { x: p.px, y: p.py, z: this._fitZ(A) * (this.lv().mode === 'xray' ? 2.4 : 2.1), ax: (A.x0 + A.x1) / 2, ay: (A.y0 + A.y1) / 2 };
  },
  toScreen(px, py) { const c = this.cam; return [c.ax + (px - c.x) * c.z, c.ay + (py - c.y) * c.z]; },
  toWorld(sx, sy) { const c = this.cam; return [c.x + (sx - c.ax) / c.z, c.y + (sy - c.ay) / c.z]; },

  // ================================================================ touch: pan, pinch, wheel, double tap, magnifier, pen
  _xy(e) { const r = this.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (this.w / (r.width || this.w)), y: (e.clientY - r.top) * (this.h / (r.height || this.h)) }; },
  _stopCam() { for (const t of this._tw.filter(t => t.tag === 'cam')) { this._tw.splice(this._tw.indexOf(t), 1); t.res(); } },
  _clampTo(t) { const f = this._frame(); t.x = U.clamp(t.x, f[0], f[0] + f[2]); t.y = U.clamp(t.y, f[1], f[1] + f[3]); return t; },
  // zoom by k about a screen point, which stays under the finger; never further out than half the fit, nor in past five times it
  _zoomTarget(sx, sy, k) {
    const c = this.cam, [wx, wy] = this.toWorld(sx, sy), fz = this._fitZ(this._area(false)), z = U.clamp(c.z * k, fz * 0.5, fz * 5);
    return this._clampTo({ x: wx - (sx - c.ax) / z, y: wy - (sy - c.ay) / z, z });
  },
  _zoomAt(sx, sy, k) { this._stopCam(); Object.assign(this.cam, this._zoomTarget(sx, sy, k)); },
  _pan(dx, dy) { const c = this.cam; this._stopCam(); Object.assign(c, this._clampTo({ x: c.x - dx / c.z, y: c.y - dy / c.z })); },
  _zoomBtn(k) {
    if (this._busy || this._mysLock()) return;
    const A = this._area(this.card.classList.contains('show'));
    AU.sfx('zoom', { up: k > 1 });
    this.camTo(this._zoomTarget((A.x0 + A.x1) / 2, (A.y0 + A.y1) / 2, k), 0.35);
  },
  // Frame: the next drag draws a box and the view zooms until the box fills it. Made for boards that read a two-finger
  // pinch badly: one finger says both where and how close. One box, then it steps aside; a tap zooms in about that point
  zoomBox(on = !this._zb) {
    if (!this.on) return;
    if (on && (this._busy || this._mysLock() || this.cover)) return;
    this._zb = on ? { a: null, b: null } : null;
    if (on) this._setLoupe(null);
    AU.sfx('click');
    this._refresh();
  },
  _zbEnd(cancel) {
    const zb = this._zb; this._zb = null; this._refresh();
    if (!zb || !zb.a || cancel || this._busy) return;
    AU.sfx('zoom', { up: true });
    if (Math.abs(zb.b[0] - zb.a[0]) < 24 && Math.abs(zb.b[1] - zb.a[1]) < 24) { this.camTo(this._zoomTarget(zb.a[0], zb.a[1], 2.2), 0.4); return; }
    this.camTo(this._zbTarget(zb), 0.55);
  },
  _zbTarget(zb) {
    const A = this._area(this.card.classList.contains('show')), fz = this._fitZ(this._area(false));
    const [x0, y0] = this.toWorld(Math.min(zb.a[0], zb.b[0]), Math.min(zb.a[1], zb.b[1])), [x1, y1] = this.toWorld(Math.max(zb.a[0], zb.b[0]), Math.max(zb.a[1], zb.b[1]));
    const z = U.clamp(Math.min((A.x1 - A.x0) / Math.max(x1 - x0, 1e-3), (A.y1 - A.y0) / Math.max(y1 - y0, 1e-3)) * 0.94, fz * 0.5, fz * 5);
    return this._clampTo({ x: (x0 + x1) / 2, y: (y0 + y1) / 2, z, ax: (A.x0 + A.x1) / 2, ay: (A.y0 + A.y1) / 2 });
  },
  fit() {
    if (this._busy || this._mysLock()) return;
    AU.sfx('zoom', { up: false });
    this.camTo(this.sel ? this._focusCam(this.sel) : this._fitCam(this.card.classList.contains('show')), 0.6);
  },
  setTool(t) {
    if (this.cover && t !== 'pan') return;
    this.tool = this.tool === t ? 'pan' : t;
    this._setLoupe(null); this._stroke = null;
    // the spotlight starts in the middle of the view and goes out with any other tool
    this._spot = this.tool === 'spot' ? this.toWorld(this.w / 2, this.h / 2) : null;
    this._rule = null; this._zb = null; this._mapA = null;
    AU.sfx('click');
    this._refresh();
  },
  wipe() {
    const k = this.key(), ink = this._ink[k];
    if (ink && ink.length) this._wiped = { k, ink };
    this._erased = null;
    delete this._ink[k]; this._inkSave(); AU.sfx('page'); this._tools();
    if (ink && ink.length) UI.toast(T('st_wiped'), '↶');
  },
  _wiped: null,
  undo() {
    const k = this.key(), ink = this._ink[k];
    // the eraser's last sweep comes back first, each line in its old place
    if (this._erased && this._erased.k === k) {
      const arr = this._ink[k] = ink || [];
      for (const [s, i] of this._erased.ss.slice().reverse()) arr.splice(Math.min(i, arr.length), 0, s);
      this._erased = null; this._inkSave(); AU.sfx('page'); this._tools(); return;
    }
    // nothing left to take back but a whole drawing just erased: Undo brings it all back
    if ((!ink || !ink.length) && this._wiped && this._wiped.k === k) { this._ink[k] = this._wiped.ink; this._wiped = null; this._inkSave(); AU.sfx('page'); this._tools(); return; }
    if (!ink || !ink.length) return;
    ink.pop(); if (!ink.length) delete this._ink[k];
    this._stroke = null; this._inkSave(); AU.sfx('page'); this._tools();
  },
  // the teacher's drawings stay with each chart from one lesson to the next (on this computer), until Erase
  INK_KEY: 'seedkeeper-ink',
  _inkLoad() {
    if (this._inkLoaded) return;
    this._inkLoaded = true;
    try {
      const o = JSON.parse(localStorage.getItem(this.INK_KEY) || '{}');
      for (const k in o) if (!this._ink[k]) this._ink[k] = o[k].map(s => { const a = []; for (let i = 0; i + 1 < s.p.length; i += 2) a.push([s.p[i], s.p[i + 1]]); a.col = s.c || 0; return a; });
    } catch (e) { /* no storage, or an old format: start clean */ }
  },
  _inkSave() {
    try {
      const o = {};
      for (const k in this._ink) { const ss = this._ink[k]; if (ss && ss.length) o[k] = ss.map(s => ({ c: s.col || 0, p: s.flatMap(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]) })); }
      const j = JSON.stringify(o);
      if (j.length < 400000) localStorage.setItem(this.INK_KEY, j);
    } catch (e) { /* storage full or blocked: the ink still lives until the page closes */ }
  },
  // the spotlight's size and the magnifier's power: small, medium, large · 2×, 3×, 5×. [ and ] step through them
  SPOT_R: [0.11, 0.2, 0.31], LOUPE_K: [2, 3, 5], spotK: 1, loupeK: 1,
  _setOpt(kind, v) {
    if (kind === 'cmp') { this._cmpMode(!!v); return; }
    if (kind === 'count') { this.countC = v ? 1 : 0; AU.sfx('click'); this._tools(); return; }
    if (kind === 'spot') this.spotK = U.clamp(v, 0, this.SPOT_R.length - 1); else this.loupeK = U.clamp(v, 0, this.LOUPE_K.length - 1);
    AU.sfx('click'); this._tools();
  },
  // comparing on a slider: both states on one plate, the sick one left of a line and the healthy one right of it.
  // Drag the line (or tap the plate, or press ← →) and the difference shows exactly where the line passes
  cmpSlide: false, _slideX: 0,
  _cmpMode(slide) {
    if (!this.cmp || this._busy) return;
    AU.sfx('click');
    if (slide !== this.cmpSlide) { this.cmpSlide = slide; this._slideX = 0; this.camTo(this._fitCam(false), 0.5); }
    this._refresh();
  },
  _slideOn() { return !!this.cmp && this.cmpSlide && this.lv().mode === 'plate' && !!COMPARE[this.key()]; },
  _slideHit(x, y) {
    if (!this._slideOn() || this.tool !== 'pan') return false;
    const [lx, ty] = this.toScreen(this._slideX, -140), by = this.toScreen(0, 140)[1];
    return Math.abs(x - lx) < (G.set.board ? 52 : 38) && y > ty - 40 && y < by + 40;
  },
  _slideStop() { for (const t of this._tw.filter(t => t.tag === 'slide')) { this._tw.splice(this._tw.indexOf(t), 1); t.res(); } },
  _slideTo(sx) { this._slideStop(); this._slideX = U.clamp(this.toWorld(sx, 0)[0], -140, 140); },
  _slideGlide(wx) {
    this._slideStop();
    const a = this._slideX, b = U.clamp(wx, -140, 140);
    AU.sfx('click');
    this.tween(0.3, k => { this._slideX = U.lerp(a, b, easeIO(k)); }, 'slide');
  },
  _slideKey(d) { if (!this._slideOn()) return false; this._slideGlide(this._slideX + d * 28); return true; },
  _drawSlide(c, cp) {
    const b = G.set.board ? 1.25 : 1, [lx, ty] = this.toScreen(U.clamp(this._slideX, -140, 140), -140), by = this.toScreen(0, 140)[1];
    c.save();
    c.lineCap = 'butt';
    c.strokeStyle = 'rgba(251,247,236,0.95)'; c.lineWidth = 7; c.beginPath(); c.moveTo(lx, ty); c.lineTo(lx, by); c.stroke();
    c.strokeStyle = C.ink; c.lineWidth = 2.2; c.stroke();
    // a round knob with two arrows, halfway down the part of the line that is on screen
    const ky = U.clamp((Math.max(ty, 0) + Math.min(by, this.h)) / 2, ty + 30, by - 30), R = 24 * b;
    c.fillStyle = 'rgba(20,12,4,0.28)'; c.beginPath(); c.arc(lx + 2, ky + 4, R, 0, TAU); c.fill();
    c.fillStyle = '#FBF7EC'; c.strokeStyle = C.ink; c.lineWidth = 2.5; c.beginPath(); c.arc(lx, ky, R, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = C.ink; c.beginPath();
    c.moveTo(lx - 4 * b, ky - 8 * b); c.lineTo(lx - 14 * b, ky); c.lineTo(lx - 4 * b, ky + 8 * b); c.closePath();
    c.moveTo(lx + 4 * b, ky - 8 * b); c.lineTo(lx + 14 * b, ky); c.lineTo(lx + 4 * b, ky + 8 * b); c.closePath(); c.fill();
    // each state's name on its own side of the line, above the plate
    c.font = `700 ${G.set.board ? 17 : 15}px "Courier Prime", monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
    const y = Math.max(ty - 22, 20);
    for (const [t, col, side] of [[cp.la, '#A0322A', -1], [cp.lb, '#3E6A3A', 1]]) {
      const s = L(t).toLocaleUpperCase(I18N.lang === 'tr' ? 'tr-TR' : 'en'), bw = c.measureText(s).width + 24;
      const x = U.clamp(side < 0 ? lx - 10 - bw : lx + 10, 6, this.w - 6 - bw);
      c.fillStyle = col; U.rr(c, x, y - 13, bw, 26, 4); c.fill();
      c.fillStyle = '#F4EEDD'; c.fillText(s, x + bw / 2, y + 0.5);
    }
    c.restore();
  },
  // the clean view: the title, the toolbar, the layer rail and the footer step aside and the chart takes the whole sheet.
  // A small strip on the left keeps move, pen, spotlight, magnifier and zoom; its top button, Esc or F bring it all back.
  // A chart shown whole stays whole (only bigger); a zoomed-in view keeps its middle and its zoom
  setBare(on) {
    if (!this.on || !!on === this.bare) return;
    const cs = this.card.classList.contains('show'), A0 = this._area(cs), c = this.cam;
    const wasFit = c.z <= this._fitZ(A0) * 1.05, [wx, wy] = this.toWorld((A0.x0 + A0.x1) / 2, (A0.y0 + A0.y1) / 2);
    this.bare = !!on; this.el.classList.toggle('bare', this.bare); this._mapA = null;
    if (!this.bare && this._pres) { this._pres = null; this._presUI(); }
    AU.sfx('click');
    this._layout();
    const A = this._area(cs);
    if (this.sel) this.camTo(this._focusCam(this.sel), 0.45);
    else if (wasFit) this.camTo(this._fitCam(cs), 0.45);
    else this.camTo({ x: wx, y: wy, z: c.z, ax: (A.x0 + A.x1) / 2, ay: (A.y0 + A.y1) / 2 }, 0.45);
    this._tools();
  },
  // the counter: a tap marks one cell (or seed, spore, insect), a tap on a mark takes it back, a drag still moves the
  // chart. Two kinds are counted apart (live and dead yeast, dividing and resting cells) and the board shows both, the
  // total and the share of the first kind, big enough for the back row. Marks stay with their chart until Reset
  CNT: ['#C8302A', '#26306A'], countC: 0, _counts: {},
  tally(k = this.key()) { const L = this._counts[k] || []; let a = 0; for (const m of L) if (!m.c) a++; return { a, b: L.length - a }; },
  _countTap(sx, sy) {
    const k = this.key(), L = this._counts[k] || (this._counts[k] = []), [wx, wy] = this.toWorld(sx, sy), R = (G.set.board ? 18 : 13) / this.cam.z;
    let best = -1, bd = R;
    L.forEach((m, i) => { const d = Math.hypot(m.x - wx, m.y - wy); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { L.splice(best, 1); AU.sfx('page'); } else { L.push({ x: wx, y: wy, c: this.countC }); AU.sfx('click'); }
    this._countUI();
  },
  // the class's counts: each student (or group) counts another part of the view and Save writes it into a table, so
  // the class sees how much single counts differ and why a mean of several is worth more than any one of them
  _cntRows: {},
  _countSave() {
    const k = this.key(), t = this.tally(); if (!t.a && !t.b) return;
    const R = this._cntRows[k] || (this._cntRows[k] = []);
    R.push({ a: t.a, b: t.b });
    delete this._counts[k];
    AU.sfx('success'); UI.toast(T('st_cnt_saved', { n: R.length }), '▦');
    this._countUI();
  },
  _countTable() {
    const k = this.key(), R = this._cntRows[k] || []; if (!R.length || !this.on) return;
    const f = v => { const s = String(Math.round(v * 10) / 10); return I18N.lang === 'tr' ? s.replace('.', ',') : s; }, pct = x => '%' + Math.round(100 * x);
    const n = R.length, sa = R.reduce((s, r) => s + r.a, 0), sb = R.reduce((s, r) => s + r.b, 0), tot = R.map(r => r.a + r.b);
    const box = h('div', 'st-offer cnt');
    box.innerHTML = `<small class="st-qk">${T('st_t_count')}</small><h3>${T('st_cnt_t')}</h3><p class="st-fh">${T('st_cnt_h')}</p>
      <table class="cnt-tab"><thead><tr><th>#</th><th><i class="cd a"></i></th><th><i class="cd b"></i></th><th>=</th><th>% <i class="cd a"></i></th></tr></thead>
      <tbody>${R.map((r, i) => `<tr><th>${i + 1}</th><td>${r.a}</td><td>${r.b}</td><td>${r.a + r.b}</td><td>${pct(r.a / (r.a + r.b))}</td></tr>`).join('')}</tbody>
      <tfoot><tr><th>${T('st_cnt_mean')}</th><td>${f(sa / n)}</td><td>${f(sb / n)}</td><td>${f((sa + sb) / n)}</td><td></td></tr>
      <tr><th>${T('st_cnt_all')}</th><td>${sa}</td><td>${sb}</td><td>${sa + sb}</td><td>${pct(sa / (sa + sb))}</td></tr></tfoot></table>
      ${n > 1 ? `<p class="small">${T('st_cnt_range', { a: Math.min(...tot), b: Math.max(...tot) })}</p>` : ''}
      <div class="st-c-foot"><button class="cnt-del">${T('st_cnt_del')}</button><button class="cnt-copy">${T('st_cnt_copy')}</button><button class="later">${T('st_close_card')}</button></div>`;
    box.querySelector('.cnt-del').onclick = () => { R.pop(); AU.sfx('page'); this._countUI(); if (R.length) this._countTable(); else { this._hideCard(); this._refresh(); } };
    box.querySelector('.cnt-copy').onclick = () => {
      // tab-separated, so it pastes straight into a spreadsheet's columns
      const rows = [['#', T('st_cnt_k1'), T('st_cnt_k2'), T('st_cnt_sum'), '% ' + T('st_cnt_k1')].join('\t')].concat(R.map((r, i) => [i + 1, r.a, r.b, r.a + r.b, Math.round(100 * r.a / (r.a + r.b))].join('\t')));
      AU.sfx('click');
      try { navigator.clipboard.writeText(rows.join('\n')).then(() => UI.toast(T('st_cnt_copied'), '▦'), () => { }); } catch (e) { /* no clipboard on this page: the table is still on screen */ }
    };
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._hideCard(); this._refresh(); };
    AU.sfx('page');
    if (this.sel) this.unfocus();
    this._showCard(box);
  },
  _countUndo() { const L = this._counts[this.key()]; if (L && L.length) { L.pop(); AU.sfx('page'); this._countUI(); } },
  _countReset() {
    const b = this.el.querySelector('.cnt-reset');
    // one tap arms it, a second within three seconds clears: a whole class's count is not lost to a stray finger
    if (!b.classList.contains('armed')) {
      if (!(this._counts[this.key()] || []).length) return;
      b.classList.add('armed'); b.querySelector('span').textContent = T('st_cnt_sure'); AU.sfx('click');
      clearTimeout(this._cntArm);
      this._cntArm = setTimeout(() => { b.classList.remove('armed'); b.querySelector('span').textContent = T('st_cnt_reset'); }, 3000);
      return;
    }
    clearTimeout(this._cntArm);
    b.classList.remove('armed'); b.querySelector('span').textContent = T('st_cnt_reset');
    delete this._counts[this.key()]; AU.sfx('page'); this._countUI();
  },
  _countUI() {
    const oc = this.el && this.el.querySelector('.o-count'); if (!oc) return;
    const t = this.tally(), cn = oc.querySelectorAll('.cn'), n = (this._cntRows[this.key()] || []).length, tb = oc.querySelector('.cnt-table');
    cn[0].textContent = t.a; cn[1].textContent = t.b;
    oc.querySelector('.cnt-save').disabled = !(t.a + t.b);
    tb.disabled = !n; tb.querySelector('span').textContent = n ? `${T('st_cnt_table')} (${n})` : T('st_cnt_table');
  },
  _drawCount(c) {
    const L = this._counts[this.key()]; if (!L || !L.length) return;
    const k = G.set.board ? 1.3 : 1, r = 7 * k;
    c.save();
    for (const m of L) {
      const [x, y] = this.toScreen(m.x, m.y);
      c.beginPath(); c.arc(x, y, r, 0, TAU);
      if (m.c) { c.strokeStyle = 'rgba(255,250,236,0.95)'; c.lineWidth = 7 * k; c.stroke(); c.strokeStyle = this.CNT[1]; c.lineWidth = 3.4 * k; c.stroke(); }
      else { c.fillStyle = this.CNT[0]; c.fill(); c.strokeStyle = 'rgba(255,250,236,0.95)'; c.lineWidth = 2.5 * k; c.stroke(); }
    }
    // the tally in the top corner of the view: ● a  ○ b  = n  and the first kind's share once both are counted
    const t = this.tally(), n = t.a + t.b, fs = Math.round(22 * k), A = (this._mapA && this._mapA.A) || this._area(false);
    const segs = [[0, String(t.a)], [1, String(t.b)], [-1, '= ' + n]];
    if (t.a && t.b) segs.push([0, '%' + Math.round(100 * t.a / n)]);
    c.font = `700 ${fs}px "Courier Prime", monospace`; c.textBaseline = 'middle'; c.textAlign = 'left';
    const ir = fs * 0.36, gap = fs * 0.9;
    let w = 16;
    segs.forEach(([kk, s], i) => { w += (kk >= 0 ? ir * 2 + 8 : 0) + c.measureText(s).width + (i < segs.length - 1 ? gap : 0); });
    w += 16;
    const x0 = A.x0 + 4, y0 = A.y0 + 4, hh = fs * 1.8, cy = y0 + hh / 2;
    c.fillStyle = 'rgba(27,26,23,0.9)'; U.rr(c, x0, y0, w, hh, 6); c.fill();
    let x = x0 + 16;
    segs.forEach(([kk, s], i) => {
      if (kk === 0) { c.fillStyle = this.CNT[0]; c.strokeStyle = '#F4EEDD'; c.lineWidth = 2; c.beginPath(); c.arc(x + ir, cy, ir, 0, TAU); c.fill(); c.stroke(); x += ir * 2 + 8; }
      else if (kk === 1) { c.strokeStyle = '#8FA2F0'; c.lineWidth = 3.4; c.beginPath(); c.arc(x + ir, cy, ir - 1, 0, TAU); c.stroke(); x += ir * 2 + 8; }
      c.fillStyle = '#F4EEDD'; c.fillText(s, x, cy + 1); x += c.measureText(s).width + (i < segs.length - 1 ? gap : 0);
    });
    c.restore();
  },
  // the part rings cover a good piece of the plate on a board: the eye in the footer (or G) hides them, and the
  // specimen is seen bare. The choice stays while the page is open
  hideMarks: false,
  // the grid: 8 lettered columns of square cells over the whole chart and numbered rows, for telling the class where to
  // look ("the cell in C4") and, on a plate with a scale, for estimating an area by counting squares. The letters and
  // numbers keep to the edges of the view as it zooms, so there is always one to read. It stays on from chart to chart
  grid: false,
  toggleGrid() {
    if (!this.on) return;
    this.grid = !this.grid; AU.sfx('click'); this._refresh();
    const gi = this.grid && this._gridInfo();
    if (gi && gi.cap) UI.toast(T('st_grid_cell', { s: gi.cap }), '#');
  },
  _gridInfo() {
    const f = this._frame(), cols = 8, cell = f[2] / cols, rows = Math.max(1, Math.round(f[3] / cell)), ch = f[3] / rows, z = this.cam.z;
    const [gx0, gy0] = this.toScreen(f[0], f[1]), cw = cell * z, chs = ch * z, gx1 = gx0 + cw * cols, gy1 = gy0 + chs * rows;
    const A = (this._mapA && this._mapA.A) || this._area(this.card.classList.contains('show'));
    const fs = Math.round(15 * (G.set.board ? 1.3 : 1)), bw = fs * 1.7, bh = fs * 1.5, cl = [], rl = [];
    if (gy1 > A.y0 && gy0 < A.y1 && gx1 > A.x0 && gx0 < A.x1) {
      const ly = U.clamp(gy0 - bh / 2 - 4, A.y0 + bh / 2, Math.max(A.y0 + bh / 2, gy1 - bh / 2));
      for (let i = 0; i < cols; i++) { const x = gx0 + (i + 0.5) * cw; if (x > A.x0 + bw / 2 && x < A.x1 - bw / 2) cl.push({ t: String.fromCharCode(65 + i), x, y: ly }); }
      const lx = U.clamp(gx0 - bw / 2 - 4, A.x0 + bw / 2, Math.max(A.x0 + bw / 2, gx1 - bw / 2));
      for (let j = 0; j < rows; j++) {
        const y = gy0 + (j + 0.5) * chs;
        if (y > A.y0 + bh / 2 && y < A.y1 - bh / 2 && !cl.some(q => Math.abs(q.x - lx) < bw && Math.abs(q.y - y) < bh)) rl.push({ t: String(j + 1), x: lx, y });
      }
    }
    const sc = this._scale();
    return { cols, rows, cw, ch: chs, gx0, gy0, gx1, gy1, labels: cl.concat(rl), fs, bw, bh, A, cap: sc ? this._len(cell * sc.per, sc.unit) : null };
  },
  _drawGrid(c, w, hh) {
    const g = this._gridInfo(), vx0 = Math.max(g.gx0, 0), vx1 = Math.min(g.gx1, w), vy0 = Math.max(g.gy0, 0), vy1 = Math.min(g.gy1, hh);
    c.save();
    if (vx1 > vx0 && vy1 > vy0) {
      c.beginPath();
      for (let i = 0; i <= g.cols; i++) { const x = g.gx0 + i * g.cw; if (x >= -1 && x <= w + 1) { c.moveTo(x, vy0); c.lineTo(x, vy1); } }
      for (let j = 0; j <= g.rows; j++) { const y = g.gy0 + j * g.ch; if (y >= -1 && y <= hh + 1) { c.moveTo(vx0, y); c.lineTo(vx1, y); } }
      // a pale edge under a dark line: readable on a pale plate and on a dark X-ray alike
      c.lineWidth = 3.6; c.strokeStyle = 'rgba(251,247,236,0.42)'; c.stroke();
      c.lineWidth = 1.4; c.strokeStyle = 'rgba(27,26,23,0.6)'; c.stroke();
    }
    c.font = `700 ${g.fs}px "Courier Prime", monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const l of g.labels) {
      c.fillStyle = 'rgba(27,26,23,0.8)'; U.rr(c, l.x - g.bw / 2, l.y - g.bh / 2, g.bw, g.bh, 4); c.fill();
      c.fillStyle = '#F4EEDD'; c.fillText(l.t, l.x, l.y + 1);
    }
    // one square's real size, low on the left (above the overview map when that is out)
    if (g.cap && this.tool !== 'count') {
      const s = T('st_grid_cell', { s: g.cap }), tw = c.measureText(s).width + 20, mp = this._mapEl;
      const y1 = mp && mp.classList.contains('show') ? mp.offsetTop - 8 : g.A.y1 - 4, x = g.A.x0 + g.bw + 8;
      c.fillStyle = 'rgba(27,26,23,0.8)'; U.rr(c, x, y1 - g.bh, tw, g.bh, 4); c.fill();
      c.fillStyle = '#F4EEDD'; c.fillText(s, x + tw / 2, y1 - g.bh / 2 + 1);
    }
    c.restore();
  },
  toggleMarks() {
    if (!this.on || this.mode !== 'explore') return;
    this.hideMarks = !this.hideMarks;
    AU.sfx('click');
    this._refresh();
  },
  _toolOpt(d) { if (this.tool === 'spot') this._setOpt('spot', this.spotK + d); else if (this.tool === 'loupe') this._setOpt('loupe', this.loupeK + d); else if (this.tool === 'count') this._setOpt('count', d > 0 ? 1 : 0); },
  // the pen's colour: red, blue, teal, yellow, so two ideas can be marked apart on the board. The third is a blue-green
  // rather than a leaf green: next to the red, a leaf green looks the same to the one or two colour-blind pupils in most classes
  inkColor() { this.inkCol = (this.inkCol + 1) % this.INKS.length; AU.sfx('click'); this._tools(); },
  // ink 4 is the highlighter: a wide see-through yellow band under the pen lines, for shading a whole region
  HL: 'rgba(255, 219, 40, 0.42)',
  // ink 5 is the laser: for pointing while you talk. It glows, fades a second after the finger lifts, and is never saved
  LASER: 5, LASER_HOLD: 0.7, LASER_FADE: 0.9, _laser: [],
  // ink 6 is a straight arrow (from where the finger lands to where it lifts), ink 7 a numbered pin dropped where the
  // finger taps and dragged into place: 1, 2, 3 on the chart, so the teacher can ask "what is number 2?". Both are kept
  // like ink, Undo takes back the last one, and the pins count up in the order they were put down
  ARROW: 6, PIN: 7, ARROW_COL: '#C8302A', PIN_COL: '#26306A',
  // ink 8 is the eraser: a finger swept across the chart lifts only the lines it touches (a tap takes a pin), and Undo
  // puts the last sweep back, each line where it was. Between Undo (the last line) and Erase (all of them)
  ERASER: 8, _erased: null, _erasePt: null,
  _eraseAt(x, y, g) {
    const k = this.key(), ink = this._ink[k]; this._erasePt = { x, y };
    if (!ink || !ink.length) return;
    const kk = G.set.board ? 1.3 : 1, R = 17 * kk;
    for (let i = ink.length - 1; i >= 0; i--) {
      const s = ink[i]; let hit = false;
      if (s.col === this.PIN) { const [px, py] = this.toScreen(s[0][0], s[0][1]); hit = Math.hypot(x - px, y - py) < R || Math.hypot(x - px, y - py + 28.5 * kk) < R + 15 * kk; }
      else {
        const pad = R + (s.col === 4 ? 13 * kk : 0);
        for (let j = 0; j < s.length && !hit; j++) {
          const [ax, ay] = this.toScreen(s[j][0], s[j][1]), [bx, by] = j + 1 < s.length ? this.toScreen(s[j + 1][0], s[j + 1][1]) : [ax, ay];
          const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy, t = l2 ? U.clamp(((x - ax) * dx + (y - ay) * dy) / l2, 0, 1) : 0;
          hit = Math.hypot(x - ax - t * dx, y - ay - t * dy) < pad;
        }
      }
      if (hit) { g.erase.push([s, i]); ink.splice(i, 1); }
    }
    if (!ink.length) delete this._ink[k];
  },
  _eraseEnd(g) {
    this._erasePt = null;
    if (g.erase.length) { this._erased = { k: this.key(), ss: g.erase }; this._inkSave(); AU.sfx('page'); }
    this._tools();
  },
  _drawMarks(c, ink, k) {
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    for (const s of ink) {
      if (s.col !== this.ARROW || s.length < 2) continue;
      const [ax, ay] = this.toScreen(s[0][0], s[0][1]), [bx, by] = this.toScreen(s[1][0], s[1][1]), len = Math.hypot(bx - ax, by - ay);
      if (len < 2) continue;
      const an = Math.atan2(by - ay, bx - ax), ca = Math.cos(an), sa = Math.sin(an), hl = Math.min(28 * k, len * 0.5), hw = hl * 0.62;
      const ex = bx - ca * hl * 0.7, ey = by - sa * hl * 0.7, hx = bx - ca * hl, hy = by - sa * hl;
      for (const [col, wd, edge] of [['rgba(255,250,236,0.92)', 11, 5], [this.ARROW_COL, 5.5, 0]]) {
        c.strokeStyle = col; c.lineWidth = wd * k; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ex, ey); c.stroke();
        c.fillStyle = col; c.beginPath(); c.moveTo(bx, by); c.lineTo(hx + sa * hw, hy - ca * hw); c.lineTo(hx - sa * hw, hy + ca * hw); c.closePath();
        if (edge) { c.lineWidth = edge * k; c.stroke(); }
        c.fill();
      }
    }
    let n = 0;
    for (const s of ink) {
      if (s.col !== this.PIN || !s.length) continue;
      n++;
      const [x, y] = this.toScreen(s[0][0], s[0][1]), r = 15 * k, d = r * 1.9, cy = y - d, t = Math.acos(r / d);
      c.fillStyle = 'rgba(20,12,4,0.3)'; c.beginPath(); c.ellipse(x + 1, y + 1, r * 0.5, r * 0.2, 0, 0, TAU); c.fill();
      c.beginPath(); c.moveTo(x, y); c.arc(x, cy, r, Math.PI / 2 + t, Math.PI / 2 - t); c.closePath();
      c.fillStyle = this.PIN_COL; c.fill();
      c.strokeStyle = '#F4EEDD'; c.lineWidth = 2.5; c.stroke();
      c.fillStyle = '#F4EEDD'; c.font = `700 ${Math.round((n > 9 ? 13 : 16) * k)}px "Courier Prime", monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(String(n), x, cy + 1);
    }
    c.restore();
  },
  _setLoupe(v) { this._loupe = v; if (this.hsEl) this.hsEl.classList.toggle('peek', !!v); },
  _tools() {
    const bar = this.el && this.el.querySelector('.st-tools'); if (!bar) return;
    for (const b of bar.querySelectorAll('[data-t]')) b.classList.toggle('on', b.dataset.t === this.tool);
    for (const b of this.el.querySelectorAll('.st-mini [data-t]')) b.classList.toggle('on', b.dataset.t === this.tool);
    bar.querySelector('[data-a=bare]').classList.toggle('on', !!this.bare);
    bar.querySelector('[data-a=names]').classList.toggle('on', !!this.names);
    const pb = bar.querySelector('[data-a=pair]'); pb.classList.toggle('on', !!this.pair); pb.classList.toggle('hidden', !!this.cover || (!this.pair && !this.canPair()));
    bar.querySelector('[data-a=wipe]').classList.toggle('hidden', !(this._ink[this.key()] || []).length);
    const pens = this.el.querySelector('.st-pens:not(.st-opts)');
    pens.classList.toggle('hidden', this.tool !== 'pen');
    const op = this.el.querySelector('.st-opts'), ot = ['spot', 'loupe', 'count'].includes(this.tool) ? this.tool : null, oc = !!this.cmp && !!COMPARE[this.key()];
    op.classList.toggle('hidden', !ot && !oc);
    op.querySelector('.o-spot').classList.toggle('hidden', ot !== 'spot'); op.querySelector('.o-loupe').classList.toggle('hidden', ot !== 'loupe');
    op.querySelector('.o-cmp').classList.toggle('hidden', !oc);
    op.querySelector('.o-count').classList.toggle('hidden', ot !== 'count');
    this._countUI();
    const ov = { spot: this.spotK, loupe: this.loupeK, cmp: this.cmpSlide ? 1 : 0, count: this.countC };
    op.querySelectorAll('[data-o]').forEach(b => b.classList.toggle('on', +b.dataset.v === ov[b.dataset.o]));
    pens.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('on', +b.dataset.c === this.inkCol));
    pens.querySelector('.undo').disabled = !(this._ink[this.key()] || []).length && !(this._wiped && this._wiped.k === this.key()) && !(this._erased && this._erased.k === this.key());
    this.hsEl.classList.toggle('spotting', this.tool === 'spot');
    // the ruler needs a scale bar; on an X-ray or a split view it steps aside
    const canRule = !!this._scale();
    bar.querySelector('[data-t=ruler]').classList.toggle('hidden', !canRule);
    if (!canRule && this.tool === 'ruler') { this.tool = 'pan'; this._rule = null; bar.querySelector('[data-t=ruler]').classList.remove('on'); bar.querySelector('[data-t=pan]').classList.add('on'); }
    this.el.dataset.tool = this.tool;
    this.hsEl.classList.toggle('inking', this.tool !== 'pan' || !!this._zb);
    this.el.classList.toggle('zboxing', !!this._zb);
    this.el.querySelectorAll('[data-a=zbox]').forEach(b => b.classList.toggle('on', !!this._zb));
    this._fitHead();
    this._stackStrips();
  },
  // the pen strip and the options strip share a corner: when both are out (the pen while comparing), the options
  // strip steps below the pen's (or above it, where the pen's sits at the bottom on a small screen)
  _stackStrips() {
    const pens = this.el && this.el.querySelector('.st-pens:not(.st-opts)'), op = this.el && this.el.querySelector('.st-opts');
    if (!pens || !op) return;
    op.style.top = ''; op.style.bottom = '';
    if (pens.classList.contains('hidden') || op.classList.contains('hidden') || !pens.offsetHeight) return;
    const sh = this.el.querySelector('.st-sheet'), top = pens.offsetTop;
    op.style.top = (top < sh.clientHeight / 2 ? top + pens.offsetHeight + 8 : Math.max(8, top - op.offsetHeight - 8)) + 'px';
    op.style.bottom = 'auto';
  },
  _pdown(e) {
    if (!this.on || this._busy || this._mysLock()) return;
    const p = this._xy(e);
    try { this.cv.setPointerCapture(e.pointerId); } catch (_) { }
    this._pt.set(e.pointerId, p);
    if (this._pt.size === 2) {
      // a second finger: whatever the first one was doing becomes a pinch
      if (this._g) clearTimeout(this._g.hold);
      if (this._stroke) { const ink = this._stroke.laser ? this._laser : this._ink[this.key()], i = ink ? ink.indexOf(this._stroke) : -1; if (i >= 0 && this._stroke.length < 3) ink.splice(i, 1); this._stroke = null; }
      if (this._rule && this._rule.live) this._rule = null;
      if (this._zb && this._zb.a) { this._zb = null; this._refresh(); }
      this._scrub = null;
      if (!(this._loupe && this._loupe.pin)) this._setLoupe(null);
      if (this._g && this._g.erase) this._eraseEnd(this._g);
      const [a, b] = [...this._pt.values()];
      this._g = { pinch: true, d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
      this._stopCam();
      return;
    }
    if (this._pt.size > 2) return;
    const g = this._g = { x0: p.x, y0: p.y, moved: false, touch: e.pointerType !== 'mouse' };
    if (this._zb) { g.box = true; this._zb.a = [p.x, p.y]; this._zb.b = [p.x, p.y]; return; }
    if (this._slideHit(p.x, p.y)) { g.slide = true; this._slideTo(p.x); return; }
    if (this.cover && !this.cover.lifting) { const s = [this.toWorld(p.x, p.y)]; s.r = (G.set.board ? 42 : 32) / this.cam.z; this.cover.strokes.push(s); this._scrub = s; return; }
    if (this.tool === 'pen' && this.inkCol === this.ERASER) { g.erase = []; this._eraseAt(p.x, p.y, g); }
    else if (this.tool === 'pen') {
      this._erased = null;
      this._stroke = [this.toWorld(p.x, p.y)]; this._stroke.col = this.inkCol;
      if (this.inkCol === this.PIN) AU.sfx('click');
      if (this.inkCol === this.LASER) { Object.assign(this._stroke, { laser: true, key: this.key() }); this._laser.push(this._stroke); }
      else (this._ink[this.key()] = this._ink[this.key()] || []).push(this._stroke);
    }
    else if (this.tool === 'spot') this._spot = this.toWorld(p.x, p.y);
    else if (this.tool === 'ruler') { const w = this.toWorld(p.x, p.y); this._rule = { a: w, b: w.slice(), live: true, key: this.key() }; }
    else if (this.tool === 'loupe') {
      const lp = this._loupe;
      // a finger on the left-behind lens slides it along; anywhere else the lens jumps there
      if (lp && lp.pin && lp.R && Math.hypot(p.x - lp.cx, p.y - lp.cy) < lp.R) g.lens = { x: p.x, y: p.y, sx: lp.x, sy: lp.y };
      else this._setLoupe({ x: p.x, y: p.y, touch: g.touch });
    }
    // with the move tool, holding still opens the magnifier where the finger rests
    else g.hold = setTimeout(() => { if (this._g === g && !g.moved && this._pt.size === 1) { g.held = true; this._setLoupe({ x: g.x0, y: g.y0, touch: g.touch }); } }, 450);
  },
  _pmove(e) {
    if (!this.on) return;
    const p = this._xy(e);
    if (!this._pt.has(e.pointerId)) { if (this.tool === 'loupe' && e.pointerType === 'mouse' && !this._busy) this._setLoupe({ x: p.x, y: p.y, touch: false }); if (this.tool === 'spot' && e.pointerType === 'mouse' && !this._busy) this._spot = this.toWorld(p.x, p.y); return; }
    const prev = this._pt.get(e.pointerId), g = this._g;
    this._pt.set(e.pointerId, p);
    if (!g) return;
    if (g.slide && !g.pinch) { this._slideTo(p.x); return; }
    if (g.box && !g.pinch) { if (this._zb) this._zb.b = [p.x, p.y]; return; }
    if (this._scrub && !g.pinch) { const w = this.toWorld(p.x, p.y), l = this._scrub[this._scrub.length - 1]; if (Math.hypot(w[0] - l[0], w[1] - l[1]) * this.cam.z > 4) this._scrub.push(w); return; }
    if (g.pinch) {
      if (this._pt.size < 2) return;
      const [a, b] = [...this._pt.values()], d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      this._pan(mx - g.mx, my - g.my); this._zoomAt(mx, my, d / g.d);
      g.d = d; g.mx = mx; g.my = my;
      return;
    }
    if (!g.moved && Math.hypot(p.x - g.x0, p.y - g.y0) > 9) {
      g.moved = true; clearTimeout(g.hold);
      if ((this.tool === 'pan' || this.tool === 'count') && !g.held) { this._pan(p.x - g.x0, p.y - g.y0); return; }
    }
    // a quick sweep jumps many pixels between two events: the eraser fills the gap, so no line slips through
    if (g.erase) { const n = Math.max(1, Math.ceil(Math.hypot(p.x - prev.x, p.y - prev.y) / 10)); for (let i = 1; i <= n; i++) this._eraseAt(prev.x + (p.x - prev.x) * i / n, prev.y + (p.y - prev.y) * i / n, g); return; }
    if (this._stroke && this._stroke.col === this.PIN) { this._stroke[0] = this.toWorld(p.x, p.y); return; }
    if (this._stroke && this._stroke.col === this.ARROW) { this._stroke[1] = this.toWorld(p.x, p.y); return; }
    if (this._stroke) {
      if (this._stroke.snapped) return;
      const w = this.toWorld(p.x, p.y), l = this._stroke[this._stroke.length - 1]; if (Math.hypot(w[0] - l[0], w[1] - l[1]) * this.cam.z > 2.5) this._stroke.push(w);
      if (!this._stroke.laser) this._snapArm(g, p.x, p.y);
      return;
    }
    if (this.tool === 'spot') { this._spot = this.toWorld(p.x, p.y); return; }
    if (this.tool === 'ruler' && this._rule && this._rule.live) { this._rule.b = this.toWorld(p.x, p.y); return; }
    if (g.lens) { const lp = this._loupe; if (lp) { lp.x = g.lens.sx + p.x - g.lens.x; lp.y = g.lens.sy + p.y - g.lens.y; lp.w = this.toWorld(lp.x, lp.y); } return; }
    if (this._loupe) { this._loupe.x = p.x; this._loupe.y = p.y; return; }
    if (g.moved && (this.tool === 'pan' || this.tool === 'count')) this._pan(p.x - prev.x, p.y - prev.y);
  },
  _pup(e, cancel) {
    if (!this._pt.has(e.pointerId)) return;
    this._pt.delete(e.pointerId);
    const g = this._g;
    if (this._pt.size) {
      // one finger lifted from a pinch: the other carries on as a drag
      if (g && g.pinch && this._pt.size === 1) { const [a] = [...this._pt.values()]; this._g = { x0: a.x, y0: a.y, moved: true, after: true }; }
      return;
    }
    this._g = null;
    if (g && g.slide) return;
    if (g && g.box) { this._zbEnd(cancel); return; }
    if (g && g.erase) { this._eraseEnd(g); return; }
    if (this._scrub) { this._scrub = null; if (g) clearTimeout(g.hold); return; }
    if (g) clearTimeout(g.hold);
    if (this._stroke) {
      const s = this._stroke; this._stroke = null; clearTimeout(this._snapT);
      if (s.laser) { s.end = performance.now(); return; }
      // an arrow needs a direction: a tap (or a very short one) leaves nothing behind
      if (s.col === this.ARROW && (s.length < 2 || Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]) * this.cam.z < 14)) {
        const k = this.key(), ink = this._ink[k], i = ink ? ink.indexOf(s) : -1;
        if (i >= 0) ink.splice(i, 1);
        if (ink && !ink.length) delete this._ink[k];
        this._tools();
        return;
      }
      if (s.length === 1 && s.col !== this.PIN) s.push([s[0][0] + 0.4 / this.cam.z, s[0][1]]);
      this._inkSave();
      this._tools();
      return;
    }
    if (this._rule && this._rule.live) {
      const r = this._rule; r.live = false;
      if (Math.hypot(r.b[0] - r.a[0], r.b[1] - r.a[1]) * this.cam.z < 6) this._rule = null; else AU.sfx('click');
      return;
    }
    if (this._loupe && !(this.tool === 'loupe' && e.pointerType === 'mouse')) {
      // with the Magnifier the lens stays where the finger leaves it, pinned to that spot of the chart, so the teacher
      // can step aside and talk; it goes with the Magnifier button, Esc, or another tool
      if (this.tool === 'loupe' && !cancel) { this._loupe.w = this.toWorld(this._loupe.x, this._loupe.y); this._loupe.pin = true; AU.sfx('click'); return; }
      this._setLoupe(null); return;
    }
    if (this.tool === 'count') { if (g && !g.moved && !g.pinch && !g.after && !g.held && !cancel) this._countTap(g.x0, g.y0); return; }
    if (!g || g.moved || g.pinch || g.after || g.held || cancel || this.tool !== 'pan') return;
    const now = performance.now(), lt = this._lastTap;
    if (lt && now - lt.t < 330 && Math.hypot(g.x0 - lt.x, g.y0 - lt.y) < 44) { this._lastTap = null; this._dbl(g.x0, g.y0); return; }
    this._lastTap = { t: now, x: g.x0, y: g.y0 };
    // on the slider, a tap on the plate sends the line there
    if (this._slideOn()) { const [wx, wy] = this.toWorld(g.x0, g.y0); if (Math.abs(wx) <= 140 && Math.abs(wy) <= 140) { this._slideGlide(wx); return; } }
    this._tap();
  },
  // a pen line held still at its end for half a second tidies up: a nearly straight one becomes straight, a loop a clean
  // ellipse (tilted with it), a box a clean rectangle. Nothing to switch on; drawing on without the pause stays freehand
  _snapArm(g, x, y) {
    if (g.sx !== undefined && Math.hypot(x - g.sx, y - g.sy) < 6) return;
    g.sx = x; g.sy = y; clearTimeout(this._snapT);
    const s = this._stroke;
    this._snapT = setTimeout(() => { if (this._stroke === s && this._g === g) this._snap(s); }, 550);
  },
  _snap(s) {
    if (!s || s.snapped || s.laser || s.col === this.ARROW || s.col === this.PIN || s.length < 8) return false;
    const sh = this._shapeOf(s); if (!sh) return false;
    s.length = 0; for (const p of sh.pts) s.push(p);
    s.snapped = sh.kind;
    AU.sfx('click');
    return true;
  },
  // z turns chart units into screen pixels (the screen pen draws in pixels already and passes 1)
  _shapeOf(s, z = this.cam.z) {
    const n = s.length, a = s[0], b = s[n - 1];
    let len = 0, mx = 0, my = 0;
    for (let i = 0; i < n; i++) { mx += s[i][0] / n; my += s[i][1] / n; if (i) len += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); }
    if (len * z < 40) return null;
    // a line: the path hardly longer than the chord, and nothing strays far from it
    const cl = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (cl * z > 30 && len < cl * 1.2) {
      let d = 0; for (const [x, y] of s) d = Math.max(d, Math.abs((b[0] - a[0]) * (a[1] - y) - (a[0] - x) * (b[1] - a[1])) / cl);
      return d < Math.max(cl * 0.07, 4 / z) ? { kind: 'line', pts: [a.slice(), b.slice()] } : null;
    }
    // a closed shape: it comes back near where it started, having gone round
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [x, y] of s) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const bw = x1 - x0, bh = y1 - y0, span = Math.max(bw, bh);
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > span * 0.3 || len < span * 2.2 || Math.min(bw, bh) * z < 16) return null;
    // the rectangle: every point near an edge of the box round it
    let re = 0; for (const [x, y] of s) re += Math.min(x - x0, x1 - x, y - y0, y1 - y) / Math.min(bw, bh) / n;
    // the ellipse: along the stroke's own long axis, so a tilted oval stays tilted
    let sxx = 0, syy = 0, sxy = 0; for (const [x, y] of s) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); }
    const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), co = Math.cos(th), si = Math.sin(th);
    let u0 = 1e9, v0 = 1e9, u1 = -1e9, v1 = -1e9;
    const uv = s.map(([x, y]) => { const u = (x - mx) * co + (y - my) * si, v = -(x - mx) * si + (y - my) * co; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); return [u, v]; });
    const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2, ru = Math.max((u1 - u0) / 2, 1e-3), rv = Math.max((v1 - v0) / 2, 1e-3);
    let ee = 0; for (const [u, v] of uv) ee += Math.abs(Math.hypot((u - cu) / ru, (v - cv) / rv) - 1) / n;
    const eS = ee / 0.12, rS = re / 0.06;
    if (Math.min(eS, rS) >= 1) return null;
    if (rS < eS) return { kind: 'rect', pts: [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]] };
    const pts = [], ox = mx + cu * co - cv * si, oy = my + cu * si + cv * co;
    for (let i = 0; i <= 72; i++) { const t = i / 72 * TAU, u = Math.cos(t) * ru, v = Math.sin(t) * rv; pts.push([ox + u * co - v * si, oy + u * si + v * co]); }
    return { kind: 'ellipse', pts };
  },
  _tap() {
    if (this._busy || this.mode !== 'explore') return;
    if (this.sel) this.unfocus(); else if (this.card.classList.contains('show')) this._later();
  },
  // double tap: in to 2.2 times about that point, or back out to the whole chart when already close
  _dbl(x, y) {
    if (this._busy) return;
    if (this.cam.z > this._fitZ(this._area(false)) * 1.7) { this.fit(); return; }
    AU.sfx('zoom', { up: true });
    this.camTo(this._zoomTarget(x, y, 2.2), 0.4);
  },

  // ================================================================ animation
  tween(dur, fn, tag) {
    return new Promise(res => this._tw.push({ t: 0, dur: G.reduceMotion ? 0 : dur, fn, res, tag }));
  },
  camTo(to, dur) {
    this._stopCam();
    const from = Object.assign({}, this.cam);
    return this.tween(dur, k => {
      const e = easeIO(k);
      for (const p in to) this.cam[p] = p === 'z' ? from.z * Math.pow(to.z / from.z, e) : U.lerp(from[p], to[p], e);
    }, 'cam');
  },
  frame(dt) {
    if (!this.on) return;
    if (!this._still) this._mt += dt * this._rate;
    for (const t of this._tw.slice()) {
      t.t += dt;
      const k = t.dur > 0 ? Math.min(1, t.t / t.dur) : 1;
      t.fn(k);
      if (k >= 1) { const i = this._tw.indexOf(t); if (i >= 0) this._tw.splice(i, 1); t.res(); }
    }
    this.focusT = U.clamp(this.focusT + (this.sel && this.mode === 'explore' ? dt : -dt) * 3.2, 0, 1);
    const sc = this.scope;
    this.blur = this._focusBlur();
    if (sc && !this._busy) { if (this.blur < 0.9) { sc.ok += dt; if (sc.ok > 0.35) this._focused(false); } else sc.ok = 0; }
    this.eye = U.clamp(this.eye + (this.scope ? dt : -dt) * 1.8, 0, 1);
    if (this.stainT >= 0 && this.stainT < 1) { this.stainT = Math.min(1, this.stainT + dt / (G.reduceMotion ? 0.2 : 2)); if (this.stainT >= 1) this._stained(); }
    this.draw();
    this._place();
    this._mapDraw();
    this._moPlace();
  },

  // ================================================================ moving specimens: stop and slow
  // some plates move (O₂ and CO₂ crossing a wall, spores falling from a gill, cilia beating). A small pair of buttons
  // in the top right corner of the view stops the movement, so the teacher can point at one dot while the class looks,
  // or slows it to half speed so the class can follow one dot all the way. The table keeps its own clock for this:
  // nothing else in the game waits
  moving() { const lv = this.lv(); return lv.mode === 'plate' && !!(lv.draw && lv.draw.def && lv.draw.def.live); },
  freeze(on = !this._still) { if (!this.on || !this.moving()) return; this._still = !!on; AU.sfx('click'); this._moSync(); },
  slow(on = this._rate === 1) { if (!this.on || !this.moving()) return; this._rate = on ? 0.5 : 1; if (on) this._still = false; AU.sfx('click'); this._moSync(); },
  _moSync() {
    const mo = this._moEl; if (!mo) return;
    const p = mo.querySelector('.mo-p'), s = mo.querySelector('.mo-s'), pl = T(this._still ? 'st_mo_go' : 'st_mo_stop') + ' (D)', sl = T('st_mo_slow') + ' (Y)';
    p.textContent = this._still ? '▶' : '⏸'; p.classList.toggle('on', this._still); p.setAttribute('aria-label', pl); p.title = pl;
    s.classList.toggle('on', this._rate < 1); s.setAttribute('aria-pressed', String(this._rate < 1)); s.setAttribute('aria-label', sl); s.title = sl;
  },
  // the top right corner of the free view: the overview map has the bottom left and the zoom's scale bar the bottom
  // right. The page is read only now and then (a layout each time), and the pair steps down below the tools or the
  // close button if either reaches that far
  _moPlace() {
    const el = this._moEl; if (!el) return;
    const on = this.moving() && !this._busy && !this.scope && !this.cover && this.mode !== 'mystery' && this.alpha > 0.5;
    if (el.classList.contains('hidden') === on) { el.classList.toggle('hidden', !on); this._moA = null; }
    if (!on) return;
    const cs = this.card.classList.contains('show'), now = performance.now();
    if (!this._moA || this._moA.cs !== cs || now - this._moA.t > 400) {
      const A = this._area(cs), w = el.offsetWidth, x = Math.round(A.x1 - w - 4);
      let y = A.y0 + 4;
      for (const s of ['.st-tools', '.st-x']) {
        const b = this.el.querySelector(s);
        if (b && b.offsetParent && b.offsetLeft < x + w && b.offsetLeft + b.offsetWidth > x) y = Math.max(y, b.offsetTop + b.offsetHeight + 8);
      }
      this._moA = { cs, t: now, xy: `translate(${x}px, ${Math.round(y)}px)` };
    }
    if (el.style.transform !== this._moA.xy) el.style.transform = this._moA.xy;
  },

  // ================================================================ drawing
  draw() {
    const c = this.ctx, dpr = G.dpr, w = this.w, hh = this.h, cam = this.cam, lv = this.lv();
    this._lwk = 1;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = C.ground; c.fillRect(0, 0, w, hh);
    // chart grid, drifting with the camera
    const step = 20 * cam.z;
    if (step > 7) {
      const ox = ((cam.ax - cam.x * cam.z) % step + step) % step, oy = ((cam.ay - cam.y * cam.z) % step + step) % step;
      c.strokeStyle = 'rgba(60,90,120,0.09)'; c.lineWidth = 1; c.beginPath();
      for (let x = ox; x < w; x += step) { c.moveTo(x, 0); c.lineTo(x, hh); }
      for (let y = oy; y < hh; y += step) { c.moveTo(0, y); c.lineTo(w, y); }
      c.stroke();
    }
    // the plate or X-ray
    c.save();
    c.globalAlpha = this.alpha;
    c.translate(cam.ax, cam.ay); c.scale(cam.z, cam.z); c.translate(-cam.x, -cam.y);
    this._lwk = cam.z > 1.6 ? Math.pow(1.6 / cam.z, 0.55) : 1;
    const st = this.st();
    this._paint(c, lv, st);
    c.restore();
    this._lwk = 1;
    if (this.cover && lv.mode === 'plate') this._drawCover(c);
    if (this.cmp && lv.mode === 'plate' && COMPARE[this.key()]) {
      const cp = COMPARE[this.key()];
      if (this.cmpSlide) this._drawSlide(c, cp); else for (const [dx, t, col] of [[-150, cp.la, '#A0322A'], [150, cp.lb, '#3E6A3A']]) {
        const [sx, sy] = this.toScreen(dx, -140), s = L(t).toLocaleUpperCase(I18N.lang === 'tr' ? 'tr-TR' : 'en');
        c.font = '700 15px "Courier Prime", monospace'; const tw = c.measureText(s).width;
        c.fillStyle = col; U.rr(c, sx - tw / 2 - 12, sy - 34, tw + 24, 26, 4); c.fill();
        c.fillStyle = '#F4EEDD'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, sx, sy - 20.5);
      }
    }
    if (this.pair && lv.mode === 'plate') {
      for (const [dx, s, col] of [[-150, `${L(this.spec().name)} · ${L(lv.tag)}`, '#26306A'], [150, this._pairName(this.pair), '#7A4A1A']]) {
        const [sx, sy] = this.toScreen(dx, -140);
        c.font = `700 ${G.set.board ? 17 : 14}px "Courier Prime", monospace`;
        let tx = s; while (c.measureText(tx).width > 140 * cam.z * 1.9 && tx.length > 8) tx = tx.slice(0, -2);
        if (tx !== s) tx = tx.trimEnd() + '…';
        const tw = c.measureText(tx).width;
        c.fillStyle = col; U.rr(c, sx - tw / 2 - 12, sy - 34, tw + 24, 26, 4); c.fill();
        c.fillStyle = '#F4EEDD'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tx, sx, sy - 20.5);
      }
    }
    // looking down the eyepiece: a round bright field in the dark, which opens out once the image is sharp
    if (this.eye > 0.01 && lv.mode === 'plate') {
      const [ex, ey] = this.toScreen(0, 0), e = easeIO(this.eye), r = 152 * cam.z * (1 + (1 - e) * 1.6), a = (0.93 * e).toFixed(2);
      const g = c.createRadialGradient(ex, ey, r * 0.88, ex, ey, r * 1.04);
      g.addColorStop(0, 'rgba(10,8,6,0)'); g.addColorStop(1, `rgba(10,8,6,${a})`);
      c.fillStyle = g; c.beginPath(); c.arc(ex, ey, r * 1.04, 0, TAU); c.fill();
      c.fillStyle = `rgba(10,8,6,${a})`; c.beginPath(); c.rect(0, 0, w, hh); c.moveTo(ex + r * 1.04, ey); c.arc(ex, ey, r * 1.04, 0, TAU, true); c.fill();
    }
    // plate caption, only in the overview
    const cap = 1 - Math.max(this.focusT, this.card && this.card.classList.contains('show') ? 1 : 0);
    if (cap > 0.02 && this.alpha > 0.5) {
      const f = this._frame(), [sx, sy] = this.toScreen(f[0], f[1] + f[3]);
      c.globalAlpha = cap * this.alpha;
      c.fillStyle = 'rgba(27,26,23,0.7)'; c.font = '700 12px "Courier Prime", monospace'; c.textAlign = 'left'; c.textBaseline = 'top';
      c.fillText((L(this.spec().name) + ' · ' + L(lv.tag)).toLocaleUpperCase(I18N.lang === 'tr' ? 'tr-TR' : 'en'), sx, sy + 8);
      c.globalAlpha = 1;
    }
    // spotlight on the focused part: the rest of the chart dims, a red pen ring draws itself, a leader runs to the card
    if (this.sel && this.focusT > 0.001) {
      const [sx, sy] = this.toScreen(this.sel.px, this.sel.py), e = this.focusT, r = Math.max(64, Math.min(w, hh) * 0.15);
      c.fillStyle = `rgba(24,18,12,${0.4 * e})`;
      c.beginPath(); c.rect(0, 0, w, hh); c.moveTo(sx + r, sy); c.arc(sx, sy, r, 0, TAU, true); c.fill();
      c.strokeStyle = `rgba(244,238,221,${0.85 * e})`; c.lineWidth = 5; c.beginPath(); c.arc(sx, sy, r + 1.5, 0, TAU); c.stroke();
      const a0 = -Math.PI / 2, rk = this.ringT;
      if (rk > 0) { c.strokeStyle = '#A0322A'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.arc(sx, sy, r + 6, a0, a0 + TAU * rk); c.stroke(); }
      if (this.card.classList.contains('show')) {
        const cx = this.card.offsetLeft - 4, cy = this.card.offsetTop + 58, ang = Math.atan2(cy - sy, cx - sx);
        const bx = sx + Math.cos(ang) * (r + 6), by = sy + Math.sin(ang) * (r + 6), le = U.clamp(rk * 1.5 - 0.5, 0, 1) * e;
        if (le > 0 && cx > bx) {
          const ex = bx + (cx - bx) * le, ey = by + (cy - by) * le;
          c.strokeStyle = C.ink; c.lineWidth = 1.6; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(bx, by); c.lineTo(ex, ey); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.ink; c.beginPath(); c.arc(ex, ey, 4, 0, TAU); c.fill();
        }
      }
    }
    if (this.grid && this.alpha > 0.05) this._drawGrid(c, w, hh);
    // the teacher's pen: strokes are kept in chart units, so a circle stays on its part while the chart moves
    const ink = this._ink[this.key()];
    if (ink && ink.length) {
      const k = G.set.board ? 1.3 : 1;
      c.lineCap = 'round'; c.lineJoin = 'round';
      const hl = ink.filter(s => s.col === 4);
      if (hl.length) {
        c.strokeStyle = this.HL; c.lineWidth = 26 * k; c.beginPath();
        for (const s of hl) s.forEach(([x, y], i) => { const [sx, sy] = this.toScreen(x, y); if (i) c.lineTo(sx, sy); else c.moveTo(sx, sy); });
        c.stroke();
      }
      for (const [col, wd] of [['rgba(255,250,236,0.9)', 9], [null, 4.5]]) this.INKS.forEach((ic, ci) => {
        const ss = ink.filter(s => (s.col || 0) === ci); if (!ss.length) return;
        c.strokeStyle = col || ic; c.lineWidth = wd * k; c.beginPath();
        for (const s of ss) s.forEach(([x, y], i) => { const [sx, sy] = this.toScreen(x, y); if (i) c.lineTo(sx, sy); else c.moveTo(sx, sy); });
        c.stroke();
      });
      this._drawMarks(c, ink, k);
    }
    this._drawCount(c);
    this._drawScale(c);
    // the laser: bright while drawn, then fading away on its own
    if (this._laser.length) {
      const now = performance.now(), k = G.set.board ? 1.3 : 1;
      this._laser = this._laser.filter(s => !s.end || (now - s.end) / 1000 < this.LASER_HOLD + this.LASER_FADE);
      c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
      for (const s of this._laser) {
        if (s.key !== this.key() || s.length < 2) continue;
        const age = s.end ? (now - s.end) / 1000 : 0, a = U.clamp(1 - (age - this.LASER_HOLD) / this.LASER_FADE, 0, 1);
        c.beginPath(); s.forEach(([x, y], i) => { const [sx, sy] = this.toScreen(x, y); if (i) c.lineTo(sx, sy); else c.moveTo(sx, sy); });
        c.globalAlpha = a; c.shadowColor = 'rgba(255, 70, 40, 0.9)'; c.shadowBlur = 14 * k * G.dpr;
        c.strokeStyle = 'rgba(255, 80, 50, 0.95)'; c.lineWidth = 6 * k; c.stroke();
        c.shadowBlur = 0; c.strokeStyle = 'rgba(255, 246, 232, 0.95)'; c.lineWidth = 2 * k; c.stroke();
      }
      c.restore();
    }
    // the ruler: a measured line with its real length written above it
    if (this.tool === 'ruler' && this._rule && this._rule.key === this.key()) {
      const sc = this._scale(), A = this._rule.a, B = this._rule.b, d = Math.hypot(B[0] - A[0], B[1] - A[1]);
      if (sc && d * this.cam.z > 4) {
        const [ax, ay] = this.toScreen(A[0], A[1]), [bx, by] = this.toScreen(B[0], B[1]);
        const an = Math.atan2(by - ay, bx - ax), nx = -Math.sin(an) * 10, ny = Math.cos(an) * 10;
        c.save(); c.lineCap = 'round';
        for (const [col, lw] of [['rgba(20,15,8,0.85)', 6.5], ['#F4DE9A', 2.8]]) {
          c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
          c.moveTo(ax, ay); c.lineTo(bx, by);
          c.moveTo(ax - nx, ay - ny); c.lineTo(ax + nx, ay + ny); c.moveTo(bx - nx, by - ny); c.lineTo(bx + nx, by + ny);
          c.stroke();
        }
        const txt = this._measure(d * sc.per, sc.unit), fs = G.set.board ? 24 : 18;
        c.font = `700 ${fs}px "Courier Prime", monospace`;
        const tw = c.measureText(txt).width + 20, mx = (ax + bx) / 2, my = Math.min(ay, by) - fs - 10;
        c.fillStyle = 'rgba(20,15,8,0.9)'; U.rr(c, mx - tw / 2, my - fs * 0.8, tw, fs * 1.6, 6); c.fill();
        c.fillStyle = '#F4DE9A'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, mx, my + 1);
        c.restore();
      }
    }
    // the eraser's ring under the finger while it sweeps
    if (this._erasePt && this.tool === 'pen' && this.inkCol === this.ERASER) {
      const R = 17 * (G.set.board ? 1.3 : 1);
      c.save(); c.fillStyle = 'rgba(242,184,176,0.4)'; c.strokeStyle = 'rgba(20,15,8,0.8)'; c.lineWidth = 2;
      c.beginPath(); c.arc(this._erasePt.x, this._erasePt.y, R, 0, TAU); c.fill(); c.stroke(); c.restore();
    }
    // Frame: the box being drawn, with the rest dimmed and its corners marked
    const zb = this._zb;
    if (zb && zb.a && (Math.abs(zb.b[0] - zb.a[0]) > 6 || Math.abs(zb.b[1] - zb.a[1]) > 6)) {
      const x = Math.min(zb.a[0], zb.b[0]), y = Math.min(zb.a[1], zb.b[1]), bw = Math.abs(zb.b[0] - zb.a[0]), bh = Math.abs(zb.b[1] - zb.a[1]);
      const k = G.set.board ? 1.3 : 1, cl = Math.min(26 * k, bw / 3, bh / 3);
      c.save();
      c.beginPath(); c.rect(0, 0, w, hh); c.rect(x, y, bw, bh); c.fillStyle = 'rgba(12,9,5,0.4)'; c.fill('evenodd');
      c.lineWidth = 4.5; c.strokeStyle = 'rgba(20,15,8,0.85)'; c.strokeRect(x, y, bw, bh);
      c.setLineDash([10, 7]); c.lineWidth = 2.2; c.strokeStyle = '#F4DE9A'; c.strokeRect(x, y, bw, bh); c.setLineDash([]);
      c.lineCap = 'square';
      for (const [col, lw] of [['rgba(20,15,8,0.9)', 8 * k], ['#F4DE9A', 4 * k]]) {
        c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
        for (const [px, py, sx, sy] of [[x, y, 1, 1], [x + bw, y, -1, 1], [x, y + bh, 1, -1], [x + bw, y + bh, -1, -1]]) { c.moveTo(px + sx * cl, py); c.lineTo(px, py); c.lineTo(px, py + sy * cl); }
        c.stroke();
      }
      c.restore();
    }
    // the spotlight: everything goes dark except the circle the teacher is pointing at, so the class looks at one part
    if (this.tool === 'spot' && this._spot) {
      const [sx, sy] = this.toScreen(...this._spot), R = Math.round(Math.min(w, hh) * this.SPOT_R[this.spotK] * (G.set.board ? 1 : 0.85));
      c.save();
      c.beginPath(); c.rect(0, 0, w, hh); c.arc(sx, sy, R, 0, TAU, true); c.fillStyle = 'rgba(12,9,5,0.8)'; c.fill('evenodd');
      const sg = c.createRadialGradient(sx, sy, R * 0.8, sx, sy, R); sg.addColorStop(0, 'rgba(12,9,5,0)'); sg.addColorStop(1, 'rgba(12,9,5,0.5)');
      c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, R, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,236,170,0.85)'; c.lineWidth = 2.5; c.beginPath(); c.arc(sx, sy, R, 0, TAU); c.stroke();
      c.restore();
    }
    // the magnifier: a round window lifted above the finger (so the hand does not hide it) showing that spot 2.6 times larger
    const lp = this._loupe;
    if (lp) {
      if (lp.w) { const [sx, sy] = this.toScreen(lp.w[0], lp.w[1]); lp.x = sx; lp.y = sy; }
      const R = Math.round(Math.min(w, hh) * (G.set.board ? 0.21 : 0.17)), K = this.LOUPE_K[this.loupeK], [wx, wy] = this.toWorld(lp.x, lp.y), z = cam.z * K;
      let lx = lp.x, ly = lp.y;
      if (lp.touch) { ly = lp.y - R - 40; if (ly - R < 6) ly = lp.y + R + 40; }
      lx = U.clamp(lx, R + 6, w - R - 6); ly = U.clamp(ly, R + 6, hh - R - 6);
      lp.cx = lx; lp.cy = ly; lp.R = R;
      c.fillStyle = 'rgba(20,12,4,0.32)'; c.beginPath(); c.arc(lx + 4, ly + 8, R + 3, 0, TAU); c.fill();
      c.save();
      c.beginPath(); c.arc(lx, ly, R, 0, TAU); c.clip();
      c.fillStyle = C.ground; c.fillRect(lx - R, ly - R, R * 2, R * 2);
      c.translate(lx, ly); c.scale(z, z); c.translate(-wx, -wy);
      this._lwk = z > 1.6 ? Math.pow(1.6 / z, 0.55) : 1;
      this._paint(c, lv, st);
      this._lwk = 1;
      c.restore();
      c.strokeStyle = C.ink; c.lineWidth = 6; c.beginPath(); c.arc(lx, ly, R, 0, TAU); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2; c.beginPath(); c.arc(lx, ly, R - 5, -2.6, -1.2); c.stroke();
      c.strokeStyle = 'rgba(160,50,42,0.85)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(lx - 12, ly); c.lineTo(lx - 4, ly); c.moveTo(lx + 4, ly); c.lineTo(lx + 12, ly); c.moveTo(lx, ly - 12); c.lineTo(lx, ly - 4); c.moveTo(lx, ly + 4); c.lineTo(lx, ly + 12); c.stroke();
      if (lp.touch) { c.strokeStyle = C.ink; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.arc(lp.x, lp.y, 16, 0, TAU); c.stroke(); c.setLineDash([]); }
      // the name of the part under the cross, once it has been found (or the teacher shows all names)
      let near = null, nd = 46;
      for (const p of this.parts()) { const d = Math.hypot(p.px - wx, p.py - wy) * cam.z; if (d < nd) { nd = d; near = p; } }
      if (near && (this.found(near.id) || this.names) && OBS[near.id]) {
        const s = L(OBS[near.id].title), fs = G.set.board ? 20 : 15;
        c.font = `700 ${fs}px "Courier Prime", monospace`; const tw = c.measureText(s).width;
        c.fillStyle = 'rgba(27,26,23,0.88)'; U.rr(c, lx - tw / 2 - 12, ly + R - fs * 2.6, tw + 24, fs * 1.7, 4); c.fill();
        c.fillStyle = '#F4EEDD'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, lx, ly + R - fs * 1.75);
      }
    }
  },
  // the specimen itself in chart units: a plate (clipped, maybe blurred, stained or split to compare) or an X-ray
  _paint(c, lv, st) {
    const dpr = G.dpr;
    if (lv.mode === 'plate') {
      if (!this.cmp && !this.pair) { c.fillStyle = 'rgba(40,25,10,0.14)'; c.fillRect(-135, -134, 280, 280); }
      c.save(); c.beginPath(); c.rect(-140, -140, 280, 280); c.clip();
      if (this.blur > 0.3) c.filter = `blur(${(this.blur * dpr).toFixed(1)}px)`;
      const sk = this.stainT >= 0 && this.stainT < 1 ? this.stainT : -1, sp = STAIN[this.key()], cp = this.cmp && COMPARE[this.key()];
      if (this.pair && !cp) {
        // this layer on the left, the chosen one on the right
        c.restore();
        const pl = SPECS[this.pair.spec].levels[this.pair.level], pst = Object.assign(LENS.state({ spec: this.pair.spec }), { t: st.t });
        for (const [dx, dl, ds] of [[-150, lv, st], [150, pl, pst]]) {
          c.save(); c.translate(dx, 0);
          c.fillStyle = 'rgba(40,25,10,0.14)'; c.fillRect(-135, -134, 280, 280);
          c.save(); c.beginPath(); c.rect(-140, -140, 280, 280); c.clip(); dl.draw(c, ds); c.restore();
          c.strokeStyle = C.ink; c.lineWidth = 1.5; c.strokeRect(-140, -140, 280, 280);
          c.restore();
        }
        c.save();
      } else if (cp && this.cmpSlide) {
        // one plate: the sick state left of the line, the healthy one right of it
        c.restore();
        const sx = U.clamp(this._slideX, -140, 140);
        c.fillStyle = 'rgba(40,25,10,0.14)'; c.fillRect(-135, -134, 280, 280);
        for (const [x0, x1, over] of [[-140, sx, cp.a], [sx, 140, cp.b]]) {
          if (x1 - x0 < 0.05) continue;
          c.save(); c.beginPath(); c.rect(x0, -140, x1 - x0, 280); c.clip(); lv.draw(c, Object.assign({}, st, over)); c.restore();
        }
        c.strokeStyle = C.ink; c.lineWidth = 1.5; c.strokeRect(-140, -140, 280, 280);
        c.save();
      } else if (cp) {
        // two plates, the sick state on the left and the healthy one on the right
        c.restore();
        for (const [dx, over] of [[-150, cp.a], [150, cp.b]]) {
          c.save(); c.translate(dx, 0);
          c.fillStyle = 'rgba(40,25,10,0.14)'; c.fillRect(-135, -134, 280, 280);
          c.save(); c.beginPath(); c.rect(-140, -140, 280, 280); c.clip(); lv.draw(c, Object.assign({}, st, over)); c.restore();
          c.strokeStyle = C.ink; c.lineWidth = 1.5; c.strokeRect(-140, -140, 280, 280);
          c.restore();
        }
        c.save();
      } else if (sk >= 0 && sp) {
        // a drop falls, lands, and the colour soaks outward from where it hit
        const [dx, dy] = sp.at, fall = U.clamp(sk / 0.18, 0, 1), soak = U.clamp((sk - 0.18) / 0.82, 0, 1);
        lv.draw(c, Object.assign({}, st, { stain: 0 }));
        if (soak > 0) { c.save(); c.beginPath(); c.arc(dx, dy, 8 + 180 * (1 - Math.pow(1 - soak, 2.2)), 0, TAU); c.clip(); lv.draw(c, st); c.restore(); }
        if (fall < 1) { const y = dy - 150 * (1 - fall * fall); c.fillStyle = sp.ink; c.beginPath(); c.moveTo(dx, y - 13); c.bezierCurveTo(dx + 7, y - 4, dx + 7, y + 6, dx, y + 6); c.bezierCurveTo(dx - 7, y + 6, dx - 7, y - 4, dx, y - 13); c.fill(); }
        else if (soak < 0.5) { c.strokeStyle = sp.ink; c.globalAlpha = 0.8 * (1 - soak * 2); c.lineWidth = 2; c.beginPath(); c.arc(dx, dy, 6 + soak * 60, 0, TAU); c.stroke(); }
      } else lv.draw(c, st);
      if (this.blur > 0.3 && !('filter' in c)) { c.fillStyle = `rgba(236,232,220,${Math.min(0.85, this.blur / 30).toFixed(2)})`; c.fillRect(-140, -140, 280, 280); }
      c.restore();
      if (!this.cmp && !this.pair) { c.strokeStyle = C.ink; c.lineWidth = 1.5; c.strokeRect(-140, -140, 280, 280); }
    } else lv.draw(c, st);
  },

  // ================================================================ the overview map
  // deep inside a chart the class loses the whole of it: a small map in the corner shows the entire specimen with a
  // frame round the part on screen. Tap or drag on it and the view goes there. It keeps out of the guessing games
  MAP_S: 150, MAP_SB: 190,
  MAP_ICON: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="16" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 17l4.2-5.2 3.2 3.2 2.4-2.6L19 17" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><rect x="10.5" y="7" width="7.5" height="6.5" fill="none" stroke="#A0322A" stroke-width="2.2"/></svg>',
  _mapOn() {
    if (!this.on || this._busy || this.scope || this.eye > 0.01 || this.cover || this.mode === 'mystery' || this.alpha < 0.9) return null;
    // the view's edges are read from the page only now and then; reading them every frame would cost a layout each time
    const cs = this.card.classList.contains('show'), now = performance.now();
    if (!this._mapA || this._mapA.cs !== cs || now - this._mapA.t > 400) this._mapA = { A: this._area(cs), cs, t: now };
    const f = this._frame(), A = this._mapA.A, [x0, y0] = this.toWorld(A.x0, A.y0), [x1, y1] = this.toWorld(A.x1, A.y1);
    const ix = Math.max(0, Math.min(x1, f[0] + f[2]) - Math.max(x0, f[0])), iy = Math.max(0, Math.min(y1, f[1] + f[3]) - Math.max(y0, f[1]));
    return ix * iy < f[2] * f[3] * 0.6 ? { f, A, v: [x0, y0, x1, y1] } : null;
  },
  _mapDraw() {
    const mp = this._mapEl; if (!mp) return;
    const o = this._mapOn();
    if (!o) { if (mp.classList.contains('show')) mp.classList.remove('show'); this._mapPt = null; return; }
    const { f, A, v } = o, k = (G.set.board ? this.MAP_SB : this.MAP_S) / Math.max(f[2], f[3]), mw = Math.round(f[2] * k), mh = Math.round(f[3] * k);
    const dpr = G.dpr, cv = this._mapCv, W = Math.round(mw * dpr), H = Math.round(mh * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; cv.style.width = mw + 'px'; cv.style.height = mh + 'px'; this._mapD = null; }
    const xy = `translate(${Math.round(A.x0 + 4)}px, ${Math.round(A.y1 - mh - 4)}px)`;
    if (this._mapXY !== xy) { this._mapXY = xy; mp.style.transform = xy; }
    if (!mp.classList.contains('show')) mp.classList.add('show');
    this._mapK = { f, k, mw, mh };
    const base = this._mapBase(mw, mh, k, f);
    const rx = (v[0] - f[0]) * k, ry = (v[1] - f[1]) * k, rw = (v[2] - v[0]) * k, rh = (v[3] - v[1]) * k;
    const d = [rx, ry, rw, rh].map(n => n.toFixed(1)).join() + '|' + (this.sel ? this.sel.id : '') + '|' + this._mapSig;
    if (d === this._mapD) return;
    this._mapD = d;
    const c = cv.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.drawImage(base, 0, 0);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    // everything outside the view is shaded, and the view itself gets a red frame
    c.fillStyle = 'rgba(27, 22, 14, 0.4)'; c.beginPath(); c.rect(0, 0, mw, mh); c.rect(rx, ry, rw, rh); c.fill('evenodd');
    c.lineWidth = 4.5; c.strokeStyle = 'rgba(251, 247, 236, 0.92)'; c.strokeRect(rx, ry, rw, rh);
    c.lineWidth = 2.2; c.strokeStyle = '#A0322A'; c.strokeRect(rx, ry, rw, rh);
    if (this.sel) {
      const sx = (this.sel.px - f[0]) * k, sy = (this.sel.py - f[1]) * k;
      c.fillStyle = '#A0322A'; c.strokeStyle = '#FBF7EC'; c.lineWidth = 2; c.beginPath(); c.arc(sx, sy, 4.5, 0, TAU); c.fill(); c.stroke();
    }
  },
  // the whole specimen, small: drawn again only when what it shows changes (layer, stain, split view, language)
  _mapBase(mw, mh, k, f) {
    const dpr = G.dpr, st = this.st();
    const sig = [this.key(), this.cmp ? (this.cmpSlide ? 's' + this._slideX.toFixed(1) : 1) : 0, this.pair ? this.pair.spec + ':' + this.pair.level : '', I18N.lang, mw, mh, dpr,
      Object.keys(st).filter(n => n !== 't').map(n => n + ':' + (st[n] && typeof st[n] === 'object' ? JSON.stringify(st[n]) : st[n])).join()].join('|');
    if (this._mapImg && this._mapSig === sig) return this._mapImg;
    const cv = this._mapImg || (this._mapImg = document.createElement('canvas'));
    cv.width = Math.round(mw * dpr); cv.height = Math.round(mh * dpr);
    const x = cv.getContext('2d'), blur = this.blur, sk = this.stainT;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = C.ground; x.fillRect(0, 0, mw, mh);
    x.save(); x.scale(k, k); x.translate(-f[0], -f[1]);
    this.blur = 0; this.stainT = -1;
    try { this._paint(x, this.lv(), st); } catch (e) { }
    this.blur = blur; this.stainT = sk;
    x.restore();
    this._mapSig = sig;
    return cv;
  },
  _mapGo(e, first) {
    const m = this._mapK; if (!m || this._busy || this._mysLock()) return;
    const r = this._mapCv.getBoundingClientRect();
    const mx = U.clamp((e.clientX - r.left) * (m.mw / (r.width || m.mw)), 0, m.mw), my = U.clamp((e.clientY - r.top) * (m.mh / (r.height || m.mh)), 0, m.mh);
    // the tapped point goes to the middle of the free view (left of the card, when a card is open)
    const A = this._area(this.card.classList.contains('show')), c = this.cam, wx = m.f[0] + mx / m.k, wy = m.f[1] + my / m.k;
    const t = this._clampTo({ x: wx - ((A.x0 + A.x1) / 2 - c.ax) / c.z, y: wy - ((A.y0 + A.y1) / 2 - c.ay) / c.z });
    if (first) { AU.sfx('click'); this.camTo(t, 0.3); } else { this._stopCam(); Object.assign(c, t); }
  },

  // ================================================================ hotspots
  _hotspots() {
    this.hsEl.innerHTML = ''; this._hs = {};
    for (const p of this.parts()) {
      const b = h('button', 'hs', `<i></i><span class="lab"></span>`);
      b.dataset.id = p.id;
      b.onclick = e => { e.stopPropagation(); this._tapPart(p.id, b); };
      this.hsEl.appendChild(b);
      this._hs[p.id] = { b, p, x: -1e4, y: -1e4 };
    }
    this._refresh();
  },
  _place() {
    for (const id in this._hs) {
      const o = this._hs[id], [x, y] = this.toScreen(o.p.px, o.p.py);
      if (Math.abs(x - o.x) > 0.25 || Math.abs(y - o.y) > 0.25) {
        o.x = x; o.y = y;
        o.b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        o.b.classList.toggle('left', x > this.w * 0.62);
      }
    }
  },
  _tapPart(id, b) {
    if (this._busy || this.scope || this.cmp) return;
    if (this.mode === 'review') { if (this._onFind) this._onFind(id, b); return; }
    if (this.mode === 'label') { this._labDrop(id); return; }
    AU.sfx('click');
    if (this.sel && this.sel.id === id) this.unfocus(); else this.focus(id);
  },
  _refresh() {
    if (!this.on) return;
    const quiz = this.mode === 'review' || this.mode === 'label' || this.mode === 'mystery', pr = this.prog(), named = this.names && !quiz;
    let coach = !G.S.flags.studyCoach && !quiz;
    for (const id in this._hs) {
      const { b, p } = this._hs[id], f = this.found(id), marked = b.classList.contains('good') || b.classList.contains('bad');
      b.classList.toggle('found', f && !quiz);
      b.classList.toggle('sel', !!this.sel && this.sel.id === id);
      b.classList.toggle('dim', !!this.sel && this.sel.id !== id);
      b.classList.toggle('quiz', quiz);
      if (!quiz) b.classList.remove('good', 'bad', 'hint', 'near');
      b.classList.toggle('coach', coach && !f);
      b.classList.toggle('named', named && !f);
      if (coach && !f) coach = false;
      b.querySelector('i').textContent = quiz ? '' : f ? p.n : '?';
      if (!quiz || !marked) b.querySelector('.lab').textContent = (f || named) && !quiz ? L(OBS[id].title) : '';
      b.setAttribute('aria-label', f ? L(OBS[id].title) : T('lens_found') + ' ' + p.n);
    }
    const q = s => this.el.querySelector(s);
    q('.st-kicker').textContent = T('st_table');
    q('.st-name').innerHTML = this.cover && !this.cover.lifting ? `${U.esc(T('st_cov_q'))} <em>${U.esc(this.splitTag(this.lv().tag)[0])}</em>` : `${U.esc(L(this.spec().name))} <em>${U.esc(L(this.lv().tag))}</em>`;
    const cvb = q('.st-cov'); cvb.classList.toggle('hidden', !this.cover && !this.canCover()); cvb.classList.toggle('on', !!this.cover);
    cvb.querySelector('span').textContent = T(this.cover ? 'st_cov_open' : 'st_cov');
    q('.st-bar i').style.transform = `scaleX(${pr.b ? pr.a / pr.b : 0})`;
    q('.st-hint').textContent = this._zb ? T('st_hint_zbox') : this.tool === 'pen' ? T(this.inkCol === this.ERASER ? 'st_hint_er' : 'st_hint_pen') : this.tool === 'loupe' ? T('st_hint_loupe') : this.tool === 'spot' ? T('st_hint_spot') : this.tool === 'ruler' ? T('st_hint_ruler') : this.tool === 'count' ? T('st_hint_count') : this.cover ? T('st_hint_cov') : this.mode === 'label' ? T('st_hint_lab') : quiz ? T('st_hint_quiz') : this.sel ? T('st_hint_sel') : T('st_found', pr) + ' · ' + T(pr.a === pr.b ? 'st_hint_done' : 'st_hint');
    const sp = STAIN[this.key()];
    q('.st-stain').classList.toggle('hidden', !sp || !!this.tg.stain || quiz || !!this.scope || this._busy || this.cmp || !!this.pair);
    const cb = q('.st-cmp'); cb.classList.toggle('hidden', !COMPARE[this.key()] || quiz || !!this.scope || !!this.pair || (this._busy && !this.cmp)); cb.classList.toggle('on', this.cmp);
    if (sp) q('.st-stain span').textContent = T(sp.label);
    const rev = q('.st-rev'), done = pr.b > 0 && pr.a === pr.b;
    rev.classList.toggle('hidden', !done || quiz || this.cmp || !!this.pair);
    const hb = q('.st-help'); hb.classList.toggle('hidden', quiz); hb.classList.toggle('pulse', !!G.set.board && !G.S.flags.studyHelp);
    q('.st-lab').classList.toggle('hidden', quiz || !this.canLabel() || !!this.scope || this.cmp || !!this.pair || !!this.cover || this._busy);
    q('.st-mys').classList.toggle('hidden', quiz || !this.canMystery());
    rev.classList.toggle('pulse', done && !this.reviewOf(this.specId, this.level));
    q('.st-dive').classList.toggle('hidden', quiz || this.spec().dive !== this.level || !Q.canDive());
    if (this.cover) ['.st-rev', '.st-stain', '.st-cmp', '.st-dive'].forEach(s => q(s).classList.add('hidden'));
    // the rings step aside while the class just looks; every game that needs them brings them back
    q('.st-grid').classList.toggle('on', !!this.grid);
    const eye = q('.st-eye'); eye.classList.toggle('on', !!this.hideMarks); eye.classList.toggle('hidden', quiz);
    this.hsEl.classList.toggle('nomarks', !!this.hideMarks && !quiz);
    this._rail();
    this._tools();
    this._fitFoot();
    this._fitRail();
  },
  _rail() {
    const nav = this.el.querySelector('.st-rail'), sp = this.spec();
    nav.innerHTML = '';
    nav.classList.toggle('single', sp.levels.length < 2);
    nav.classList.toggle('many', sp.levels.length > 4);
    sp.levels.forEach((lv, l) => {
      const [mag, lab] = this.splitTag(lv.tag), pr = this.prog(l), rv = this.reviewOf(this.specId, l);
      const b = h('button', 'st-lv' + (l === this.level ? ' on' : ''), `<b>${U.esc(mag)}</b><span>${U.esc(lab)}</span><small>${pr.a}/${pr.b}</small>${rv ? `<em title="${U.esc(T('st_sum_p', { a: rv.best, b: rv.n }))}">${rv.best >= rv.n ? '★' : '✓'}</em>` : ''}`);
      b.style.setProperty('--p', pr.b ? pr.a / pr.b : 0);
      b.onclick = () => { if (l !== this.level) { AU.sfx('click'); this.setLevel(l); } };
      nav.appendChild(b);
      if (l < sp.levels.length - 1) nav.appendChild(h('i', 'st-link'));
    });
  },

  // ================================================================ focusing on a part
  focus(id) {
    if (!this.on || this._busy || this.mode !== 'explore') return;
    if (this.scope) this._focused(true);
    if (this.cmp) this.compare(false);
    const p = this.parts().find(q => q.id === id); if (!p) return;
    const first = !this.found(id);
    this.sel = p; this.ringT = 0;
    if (first) this._record(id); else Q.onSeen(id);
    G.S.flags.studyCoach = true;
    this._showCard(this._partCard(p, first));
    this.camTo(this._focusCam(p), 0.8);
    this.tween(1, k => { this.ringT = U.clamp(k * 1.6 - 0.45, 0, 1); });
    AU.sfx('zoom', { up: true });
    this._refresh();
    if (G.set.tts) this._speakPart(p);
  },
  unfocus() {
    if (!this.sel) return;
    this.sel = null;
    this._hideCard();
    this.camTo(this._fitCam(false), 0.7);
    AU.sfx('zoom', { up: false });
    if (window.speechSynthesis) speechSynthesis.cancel();
    this._refresh();
    this._maybeOffer();
  },
  _record(id) {
    const S = G.S;
    S.journal.obs[id] = { t: Date.now(), spec: this.specId, lvl: this.level };
    AU.sfx('pen');
    Q.onObs(id);
    G.save();
  },
  _step(dir) {
    const parts = this.parts(), i = this.sel ? parts.findIndex(q => q.id === this.sel.id) : -1;
    return parts[(i + dir + parts.length) % parts.length];
  },
  _nextPart() {
    const parts = this.parts(), i = parts.findIndex(q => q.id === this.sel.id);
    return parts.slice(i + 1).concat(parts.slice(0, i)).find(q => !this.found(q.id)) || (i < parts.length - 1 ? parts[i + 1] : null);
  },
  _speakPart(p) {
    const a = ATLAS[p.id] || {};
    UI.speak(plain([L(OBS[p.id].title), LX(a.what) || L(OBS[p.id].text), LX(a.how), LX(a.role), LX(a.fact)].filter(Boolean).join('. ')), true);
  },
  _partCard(p, first) {
    const o = OBS[p.id], a = ATLAS[p.id] || {}, n = this.parts().length, deeper = this._deeperFor(p.id), nx = this._nextPart();
    const sec = (k, icon, cls = '') => a[k] ? `<section class="st-sec ${cls}"><h4><i>${icon}</i>${T('st_' + k)}</h4><p>${md(LX(a[k]))}</p></section>` : '';
    const box = h('div', 'st-part');
    box.innerHTML = `
      <div class="st-c-head"><span class="st-num">${p.n}</span><div><small>${T('st_part', { i: p.n, n })} · ${U.esc(L(this.lv().tag))}</small><h3>${U.esc(L(o.title))}</h3></div></div>
      <div class="st-code"><span>${U.esc(currText(o.code))}</span></div>
      ${a.what ? sec('what', '?') + sec('how', '⚙') + sec('role', '❦') + sec('fact', '✦', 'fact') : `<section class="st-sec"><p>${U.esc(L(o.text))}</p></section>`}
      ${deeper != null ? `<button class="st-deeper">${U.esc(T('st_deeper', { t: L(this.spec().levels[deeper].tag) }))} ▸</button>` : ''}
      ${first ? `<div class="st-new">✎ ${T('st_new')}</div>` : ''}
      <div class="st-c-foot"><button class="tts" aria-label="${U.esc(T('read_aloud'))}">${ICON.speaker}</button><button class="prev">◀ <span>${T('st_prev')}</span></button><button class="next yes">${nx ? `<span>${T('st_next')}</span> ▶` : `${T('st_finish')} ✓`}</button></div>`;
    box.querySelector('.tts').onclick = () => this._speakPart(p);
    box.querySelector('.prev').onclick = () => { AU.sfx('page'); this.focus(this._step(-1).id); };
    box.querySelector('.next').onclick = () => { AU.sfx('page'); if (nx) this.focus(nx.id); else this.unfocus(); };
    const dp = box.querySelector('.st-deeper'); if (dp) dp.onclick = () => { AU.sfx('click'); this.setLevel(deeper); };
    return box;
  },
  _deeperFor(id) {
    const l = this.level + 1;
    if (l >= this.spec().levels.length) return null;
    const ids = DIVE_FROM[this.specId + ':' + l];
    return ids && ids.includes(id) ? l : null;
  },
  _showCard(inner) {
    const c = this.card;
    c.innerHTML = ''; c.appendChild(inner); c.scrollTop = 0;
    if (!c.classList.contains('show')) { c.classList.add('show'); this.el.classList.add('carded'); }
  },
  _hideCard() { this.card.classList.remove('show'); this.el.classList.remove('carded'); },
  _later() { this._hideCard(); this.camTo(this._fitCam(false), 0.6); this._refresh(); },

  // ================================================================ changing layer
  async setLevel(l) {
    const sp = this.spec();
    if (!this.on || this._busy || l === this.level || l < 0 || l >= sp.levels.length) return;
    this._abortQuiz();
    this._busy = true;
    const down = l > this.level, via = down ? this._via(l) : null;
    this.sel = null; this._hideCard(); this.hsEl.classList.add('gone'); this.cmp = false; this.pair = null; this.cover = null; this._scrub = null; this._setLoupe(null);
    this.scope = null; this.el.querySelector('.st-scope').classList.add('hidden');
    if (window.speechSynthesis) speechSynthesis.cancel();
    AU.sfx('zoom', { up: down });
    const out = down ? { x: via ? via.px : this.cam.x, y: via ? via.py : this.cam.y, z: this.cam.z * 3.2 } : { z: this.cam.z * 0.4 };
    await Promise.all([this.camTo(out, 0.45), this.tween(0.45, k => { this.alpha = 1 - k; })]);
    if (!this.on) return;
    this.level = l;
    this._hotspots();
    this._maybeFocus();
    const fit = this._fitCam(false), back = down ? null : this._via(l + 1);
    Object.assign(this.cam, fit, down ? { z: fit.z * 0.35 } : back ? { x: back.px, y: back.py, z: fit.z * 3.2 } : { z: fit.z * 2.5 });
    this._place();
    await Promise.all([this.camTo(fit, 0.6), this.tween(0.5, k => { this.alpha = k; })]);
    if (!this.on) return;
    if (!this.scope) this.hsEl.classList.remove('gone');
    this._busy = false;
    this._refresh();
  },
  _via(l) {
    const ids = DIVE_FROM[this.specId + ':' + l];
    return ids ? this.parts(l - 1).find(p => ids.includes(p.id)) || null : null;
  },

  // ================================================================ sick and healthy side by side
  compare(on) {
    if (!this.on || this.mode !== 'explore' || this.scope || !COMPARE[this.key()] || on === this.cmp || (this._busy && on)) return;
    if (on && this.sel) { this.sel = null; this._hideCard(); }
    this.cmp = on; this._slideX = 0;
    this.hsEl.classList.toggle('gone', on);
    this.camTo(this._fitCam(false), 0.6);
    AU.sfx('zoom', { up: !on });
    this._refresh();
  },

  // ================================================================ staining a layer on the table
  stain() {
    const sp = STAIN[this.key()];
    if (!this.on || !sp || this.tg.stain || this._busy || this.mode !== 'explore') return;
    if (this.scope) this._focused(true);
    if (this.sel) { this.sel = null; this._hideCard(); this.camTo(this._fitCam(false), 0.5); }
    this.tg = Object.assign({}, this.tg, { stain: 1 });
    this._busy = true; this.stainT = 0; this.hsEl.classList.add('gone');
    AU.sfx('bubble');
    this._refresh();
  },
  _stained() {
    const sp = STAIN[this.key()];
    this._busy = false; this.stainT = -1;
    this._hotspots(); this._place(); this.hsEl.classList.remove('gone');
    AU.sfx('chime');
    if (sp) UI.toast(T(sp.msg(this.st())), '●');
    if (sp) this.focus(sp.part);
  },

  // ================================================================ bringing a microscope layer into focus
  // Both knobs move the same stage: the coarse one a long way, the fine one a little. At x1000 the coarse knob is
  // locked, as in a real lab, because the objective sits so close to the slide that it could crack it.
  _mag(l = this.level) { const m = /\d[\d\s.,]*/.exec(this.splitTag(this.spec().levels[l].tag)[0]); return m ? +m[0].replace(/\D/g, '') : 1; },
  _maybeFocus() {
    const key = this.key(), done = G.S.journal.focused || {}, box = this.el.querySelector('.st-scope');
    this.scope = null; box.classList.add('hidden');
    if (!SCOPE[key] || done[key] || this.lv().mode !== 'plate') return;
    const high = this._mag() >= 1000, tz = 0.3 + Math.random() * 0.5;
    const sc = this.scope = { tz, high, c: high ? tz + (Math.random() < 0.5 ? -1 : 1) * 0.075 : 0.03, f: 0.5, ok: 0 };
    this.hsEl.classList.add('gone');
    box.innerHTML = `<h4>${T('sc_title')} <small>${U.esc(this.splitTag(this.lv().tag)[0])}</small></h4><p>${T(high ? 'sc_high' : 'sc_how')}</p>
      <label class="sc-row${high ? ' off' : ''}"><span>${T('sc_coarse')}</span><input type="range" class="sc-c" min="0" max="1" step="0.002" value="${sc.c}"${high ? ' disabled' : ''}></label>
      <label class="sc-row"><span>${T('sc_fine')}</span><input type="range" class="sc-f" min="0" max="1" step="0.002" value="0.5"></label>
      <button class="sc-skip">${T('sc_skip')}</button>`;
    box.querySelector('.sc-c').addEventListener('input', e => { if (this.scope) this.scope.c = +e.target.value; });
    box.querySelector('.sc-f').addEventListener('input', e => { if (this.scope) this.scope.f = +e.target.value; });
    box.querySelector('.sc-skip').onclick = () => { AU.sfx('click'); this._focused(true); };
    box.classList.remove('hidden');
  },
  // how far the stage is from focus, as a blur radius in CSS pixels
  _focusBlur() { const s = this.scope; return s ? 32 * Math.min(1, Math.abs(s.c + (s.f - 0.5) * 0.2 - s.tz) * 3.2) : 0; },
  _focused(skipped) {
    if (!this.scope) return;
    (G.S.journal.focused = G.S.journal.focused || {})[this.key()] = 1;
    this.scope = null;
    this.el.querySelector('.st-scope').classList.add('hidden');
    if (!this._busy) this.hsEl.classList.remove('gone');
    if (!skipped) { AU.sfx('chime'); UI.toast(T('sc_sharp'), '◎'); }
    G.save(); this._refresh();
  },

  // ================================================================ review questions
  _maybeOffer() {
    const k = this.key(), pr = this.prog();
    if (!pr.b || pr.a < pr.b || this._offered[k] || this.mode !== 'explore') return;
    this._offered[k] = true;
    setTimeout(() => {
      if (!this.on || this.sel || this.mode !== 'explore' || this.key() !== k || this._busy) return;
      const n = this._questions(this.parts()).length, box = h('div', 'st-offer');
      box.innerHTML = `<div class="st-medal"><b>${pr.a}/${pr.b}</b><small>✓</small></div><h3>${T('st_done_t')}</h3><p>${T('st_done_p', { n })}</p>
        <button class="big yes go">${T('st_start')} ▸</button><button class="later">${T('st_later')}</button>`;
      box.querySelector('.go').onclick = () => { AU.sfx('page'); this.review(); };
      box.querySelector('.later').onclick = () => { AU.sfx('click'); this._later(); };
      this._showCard(box);
      this.camTo(this._fitCam(true), 0.6);
      AU.sfx('chime');
    }, G.reduceMotion ? 0 : 700);
  },
  _questions(parts) {
    const key = this.key(), ids = parts.map(p => p.id), pool = shuffle(ids.slice()), qs = [];
    if (ids.length >= 3) qs.push({ kind: 'find', id: 'rev:' + key + ':find', target: pool[0], code: OBS[pool[0]].code });
    const wq = this._whichQ(pool[ids.length >= 3 ? 1 : 0], ids, key);
    if (wq) qs.push(wq);
    const nq = ids.length >= 3 && this._whatQ(pool[2], ids, key);
    if (nq) qs.push(nq);
    if (REVIEW[key]) qs.push(Object.assign({ kind: 'mc', id: 'rev:' + key }, REVIEW[key]));
    // the finding question stays first, the rest come in a new order each time
    return qs[0] && qs[0].kind === 'find' ? [qs[0], ...shuffle(qs.slice(1))] : shuffle(qs);
  },
  // "which part works like this?": the clue is the part's own how-it-works text with its name masked out
  _whichQ(t, ids, key) {
    const a = ATLAS[t]; if (!a) return null;
    const ok = x => x !== t && ATLAS[x] && OBS[x] && L(OBS[x].title) !== L(OBS[t].title);
    const near = shuffle(ids.filter(ok)), far = [];
    this.spec().levels.forEach((lv, l) => this.parts(l).forEach(p => { if (ok(p.id) && !near.includes(p.id) && !far.includes(p.id)) far.push(p.id); }));
    for (const id in OBS) if (ok(id) && OBS[id].code === OBS[t].code && !near.includes(id) && !far.includes(id)) far.push(id);
    const dis = near.concat(shuffle(far)).slice(0, 3);
    if (!dis.length) return null;
    const ti = OBS[t].title;
    // the clue is picked at random from how it works, what it is for, or a field fact, so a repeat is not a rerun
    const f = shuffle(['how', 'role', 'fact'].filter(k => a[k]))[0];
    return {
      kind: 'mc', id: 'rev:' + key + ':which', code: OBS[t].code,
      prompt: { how: { tr: 'Hangi yapı böyle çalışır?', en: 'Which part works like this?' }, role: { tr: 'Bu görevi hangi yapı yapar?', en: 'Which part does this job?' }, fact: { tr: 'Bu bilgi hangi yapıyla ilgili?', en: 'Which part is this fact about?' } }[f],
      quote: { tr: maskName(a[f][0], ti.tr), en: maskName(a[f][1], ti.en) },
      options: shuffle([t, ...dis]).map(x => x === t ? { t: OBS[x].title, ok: true } : { t: OBS[x].title, fb: { tr: OBS[x].title.tr + ': ' + plain(ATLAS[x].what[0]), en: OBS[x].title.en + ': ' + plain(ATLAS[x].what[1]) } }),
      explain: { tr: ti.tr + ': ' + plain(a.role[0]), en: ti.en + ': ' + plain(a.role[1]) },
    };
  },
  // the other way round: the part is named, the four options are descriptions and only one is its own
  _whatQ(t, ids, key) {
    const a = ATLAS[t]; if (!a || !a.what || !OBS[t]) return null;
    const ti = OBS[t].title, one = (x, i) => plain(maskName(ATLAS[x].what[i], OBS[x].title[i ? 'en' : 'tr'])).split(/(?<=[.!?])\s/)[0];
    const dis = shuffle(ids.filter(x => x !== t && ATLAS[x] && ATLAS[x].what && OBS[x] && L(OBS[x].title) !== L(ti))).slice(0, 3);
    if (dis.length < 2) return null;
    return {
      kind: 'mc', id: 'rev:' + key + ':what', code: OBS[t].code,
      prompt: { tr: ti.tr + ' hangisidir?', en: 'Which one describes the ' + ti.en.toLowerCase() + '?' },
      options: shuffle([t, ...dis]).map(x => ({ t: { tr: one(x, 0), en: one(x, 1) }, ok: x === t || undefined, fb: x === t ? null : { tr: OBS[x].title.tr + ': ' + one(x, 0), en: OBS[x].title.en + ': ' + one(x, 1) } })),
      explain: { tr: ti.tr + ': ' + plain(a.what[0]), en: ti.en + ': ' + plain(a.what[1]) },
    };
  },
  async review() {
    if (!this.on || this.mode !== 'explore' || this._busy) return;
    if (this.scope) this._focused(true);
    if (this.cmp) this.compare(false);
    if (this.pair) this.pairWith(null);
    const key = this.key(), parts = this.parts();
    if (!parts.length) return;
    this.sel = null; this.mode = 'review';
    if (window.speechSynthesis) speechSynthesis.cancel();
    this.camTo(this._fitCam(true), 0.6);
    const qs = this._questions(parts);
    let good = 0;
    for (let i = 0; i < qs.length; i++) {
      const r = await (qs[i].kind === 'find' ? this._askFind(qs[i], i, qs.length) : this._askMC(qs[i], i, qs.length));
      if (r === null || !this.on || this.mode !== 'review' || this.key() !== key) return;
      if (r) good++;
    }
    const S = G.S, rv = S.journal.reviews = S.journal.reviews || {}, prev = rv[key];
    rv[key] = { best: Math.max(good, prev ? prev.best : 0), n: qs.length, last: good, tries: (prev ? prev.tries : 0) + 1, t: Date.now() };
    G.save();
    this.mode = 'explore';
    this._showCard(this._summaryCard(good, qs.length));
    this._refresh();
    UI.stamp(T('st_sum_t'), T('st_sum_p', { a: good, b: qs.length }));
    AU.sfx('success');
  },
  // ================================================================ the curtain: "what is it?"
  // a board game for the start of a lesson: the plate hides under paper and its name under "What is it?"; fingers rub
  // holes in the paper and the class guesses from the bits that show, then Reveal lifts the curtain
  canCover() { return this.lv().mode === 'plate' && this.mode === 'explore' && !this.scope && !this.cmp && !this.pair && !!(G.set.board || G.S.flags.lesson); },
  curtain(on) {
    if (!this.on || this._busy) return;
    if (on) {
      if (this.cover || !this.canCover()) return;
      this.setTool('pan');
      if (this.sel) this.unfocus();
      this._hideCard();
      this.cover = { strokes: [], open: 0 };
      this.hsEl.classList.add('gone');
      this.camTo(this._fitCam(false), 0.5);
      AU.sfx('page');
      this._refresh();
      return;
    }
    if (!this.cover || this.cover.lifting) return;
    const cv = this.cover; cv.lifting = true;
    AU.sfx('success');
    this.tween(0.7, k => { cv.open = k; }).then(() => {
      if (this.cover !== cv) return;
      this.cover = null; this._scrub = null;
      this.hsEl.classList.remove('gone');
      this._refresh();
    });
    this._refresh();
  },
  _drawCover(c) {
    const dpr = G.dpr, cv = this._coverCv || (this._coverCv = U.canvas(1, 1)), cov = this.cover;
    if (cv.width !== this.cv.width || cv.height !== this.cv.height) { cv.width = this.cv.width; cv.height = this.cv.height; }
    const o = cv.getContext('2d');
    o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, cv.width, cv.height);
    o.setTransform(dpr, 0, 0, dpr, 0, 0);
    // warm paper over the plate's square (it rolls up when revealed), faint ruled lines and a big question mark
    const [x0, y0] = this.toScreen(-141, -141), [x1, y1] = this.toScreen(141, 141), hgt = (y1 - y0) * (1 - easeIO(cov.open));
    if (hgt > 0.5) {
      o.fillStyle = '#E9DDC0'; o.fillRect(x0, y0, x1 - x0, hgt);
      o.strokeStyle = 'rgba(120,90,50,0.13)'; o.lineWidth = 1; o.beginPath();
      for (let y = y0 + 10; y < y0 + hgt; y += 11) { o.moveTo(x0, y); o.lineTo(x1, y); }
      o.stroke();
      o.fillStyle = '#8A5F2A'; o.fillRect(x0 - 4, y0 + hgt - 7, x1 - x0 + 8, 9);
      if (cov.open < 0.3) {
        o.fillStyle = 'rgba(90,60,30,0.28)'; o.textAlign = 'center'; o.textBaseline = 'middle';
        o.font = `700 ${Math.round((y1 - y0) * 0.42)}px "Bodoni Moda", serif`; o.fillText('?', (x0 + x1) / 2, (y0 + y1) / 2);
      }
      // the rubbed-away holes
      o.globalCompositeOperation = 'destination-out'; o.lineCap = 'round'; o.lineJoin = 'round'; o.strokeStyle = '#000';
      o.shadowColor = '#000'; o.shadowBlur = 12 * dpr;
      for (const s of cov.strokes) {
        o.lineWidth = s.r * 2 * this.cam.z; o.beginPath();
        s.forEach(([x, y], i) => { const [sx, sy] = this.toScreen(x, y); if (i) o.lineTo(sx, sy); else o.moveTo(sx, sy); });
        if (s.length === 1) { const [sx, sy] = this.toScreen(s[0][0], s[0][1]); o.lineTo(sx + 0.1, sy); }
        o.stroke();
      }
      o.globalCompositeOperation = 'source-over'; o.shadowBlur = 0;
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(cv, 0, 0); c.restore();
  },

  // ================================================================ the tools, explained on the board
  // every tool with its own icon (copied from the bar, so the two always match), what it is for, and its key
  HELP: [
    ['t', 'pan', { tr: 'Sürükle: görüntü kayar. İki parmakla açıp kapat: yakınlaşır. Bir noktaya çift dokun: oraya yaklaşır. Parmağını basılı tut: büyüteç açılır.', en: 'Drag to move the chart. Pinch to zoom. Double-tap a point to zoom in there. Press and hold: the magnifier opens.' }, ''],
    ['t', 'loupe', { tr: 'Parmağının altındaki yer yuvarlak bir camda büyür. Küçük ayrıntıyı sınıfa göstermek için. Parmağını kaldırınca cam orada kalır; kenara çekilip anlatabilirsin. Camı parmakla tutup kaydır ya da başka bir yere dokun, oraya geçer. Büyüteç düğmesine yeniden basınca kapanır. Altındaki şeritten gücü seçilir: 2×, 3× ya da 5× ([ ve ] tuşları).', en: 'The spot under your finger grows in a round glass. For showing the class a small detail. Lift your finger and the glass stays there, so you can step aside and talk. Hold the glass to slide it, or tap somewhere else and it moves there. Press Magnifier again to close it. The strip under it sets the power: 2×, 3× or 5× (the [ and ] keys).' }, 'M'],
    ['t', 'pen', { tr: 'Görüntünün üstüne çiz. Kalemin altındaki şeritten dört renkten biri, fosforlu kalem ya da lazer seçilir. Lazerin çizgisi parlar ve bir iki saniyede kendiliğinden kaybolur; göstermek içindir, saklanmaz. Çizginin sonunda parmağını yarım saniye bekletirsen şekil düzelir: titrek çizgi dümdüz, yuvarlak düzgün bir elips, kutu düzgün bir dikdörtgen olur. Ok düz bir ok çizer. Numara, dokunduğun yere 1, 2, 3 diye numaralı bir işaret koyar; sürükleyip yerine oturt, sonra sınıfa sor: “2 numara ne?” Silgi yalnızca parmağının üstünden geçtiği çizgileri siler (numaraya dokunmak yeter). Geri al (Ctrl+Z) son çizgiyi ya da silginin son sildiklerini geri getirir, Sil bu görüntüdeki bütün çizgileri siler.', en: 'Draw over the chart. The strip under the pen picks one of four inks, the highlighter or the laser. The laser’s line glows and fades by itself in a second or two; it is for pointing and is never kept. Hold your finger still for half a second at the end of a line and it tidies up: a shaky line turns straight, a loop into a clean ellipse, a box into a clean rectangle. Arrow draws a straight arrow. Number drops a numbered pin (1, 2, 3) where you tap; drag it into place, then ask the class: “what is number 2?” Eraser lifts only the lines your finger sweeps across (a tap takes a number pin). Undo (Ctrl+Z) takes back the last line, or brings back what the eraser last lifted; Erase clears every line on this chart.' }, 'P'],
    ['t', 'spot', { tr: 'Her yer kararır, yalnızca parmağının altındaki daire aydınlık kalır. Sınıfın gözünü tek bir parçaya topla. Altındaki şeritten dairenin boyu seçilir: küçük, orta ya da büyük ([ ve ] tuşları).', en: 'Everything goes dark except the circle under your finger. Gather the class’s eyes on one part. The strip under it sets the circle’s size: small, medium or large (the [ and ] keys).' }, 'I'],
    ['t', 'ruler', { tr: 'Bir uçtan öbür uca sürükle: gerçek uzunluk, görüntünün ölçek çubuğundan hesaplanıp yazılır. Yakınlaşınca sağ alt köşede, yakınlığa göre değişen bir ölçek çubuğu da çıkar.', en: 'Drag from end to end: the real length is worked out from the scale bar and written on. Zoom in and a scale bar in the bottom right corner keeps up with the zoom.' }, 'R'],
    ['t', 'count', { tr: 'Say: her hücreye (ya da tohuma, spora, böceğe) dokun, sayılır; yanlış işarete yeniden dokun, silinir. Sürükleyince görüntü kayar. Altındaki şeritten ikinci tür seçilir, örneğin canlı ve ölü maya ya da bölünen ve bölünmeyen hücre. İki türün sayısı, toplamı ve birinci türün yüzdesi görüntünün köşesinde büyük yazılır. Sıfırla iki dokunuş ister. Kaydet sayımı sınıfın tablosuna yazar ve yeni bir sayım başlar; Tablo her sayımı, ortalamayı ve bütün sayımların yüzdesini gösterir.', en: 'Count: tap each cell (or seed, spore, insect) and it is counted; tap a mark again to take it back. A drag still moves the chart. The strip under it picks a second kind, e.g. live and dead yeast, or dividing and resting cells. Both counts, the total and the first kind’s share are written big in the corner of the view. Reset needs two taps. Save writes the count into the class’s table and starts a fresh one; Table shows every count, the mean and the share over all counts.' }, 'N'],
    ['a', 'zbox', { tr: 'Çerçevele: düğmeye bas, sonra yakından bakmak istediğin yerin çevresine parmağınla bir çerçeve çiz. Görüntü o çerçeveyi dolduracak kadar yaklaşır. İki parmakla yakınlaştırmayı iyi algılamayan tahtalar için. Çizmek yerine tek dokunursan oraya yaklaşır.', en: 'Frame: press it, then draw a box with your finger round what you want to see. The view zooms in until the box fills it. For boards that read a two-finger pinch badly. A single tap instead zooms in about that point.' }, 'B'],
    ['a', 'fit', { tr: 'Görüntünün tamamına geri dön.', en: 'Back to the whole chart.' }, '0'],
    ['f', 'map', { tr: 'Genel bakış: çok yakınlaşınca görüntünün sol altında küçük bir harita çıkar. Numunenin tamamını gösterir; kırmızı çerçeve şu an bakılan yerdir. Haritaya dokun ya da üstünde sürükle: görüntü oraya gider. Yakın çekim oyununda ve perdede gizlenir.', en: 'Overview: once you zoom in far, a small map appears at the bottom left of the view. It shows the whole specimen; the red frame is the part on screen. Tap or drag on the map and the view goes there. It hides during the close-up game and the curtain.' }, ''],
    ['a', 'names', { tr: 'Bütün parçaların adlarını göster ya da gizle.', en: 'Show or hide the names of every part.' }, ''],
    ['f', 'cmp', { tr: 'Karşılaştır (bazı katmanlarda): hasta ve sağlıklı hâl iki ayrı görüntüde, yan yana. Üstteki şeritten Kaydırmalı seçilirse ikisi aynı görüntüde durur: çizginin solunda biri, sağında öbürü. Ortadaki düğmeyi sürükle ya da görüntüye dokun, çizgi oraya gider (← ve → tuşları). Fark tam çizginin geçtiği yerde görünür.', en: 'Compare (on some layers): the sick and the healthy state as two pictures side by side. Pick Slider on the strip above and both share one picture: one left of a line, the other right of it. Drag the knob or tap the picture and the line goes there (the ← and → keys). The difference shows right where the line passes.' }, ''],
    ['a', 'pair', { tr: 'Başka bir görüntüyü sağına koy; neyin aynı, neyin farklı olduğunu birlikte bulun.', en: 'Put another chart beside this one and find together what is alike and what differs.' }, ''],
    ['a', 'bare', { tr: 'Sade görünüm: başlık, araç çubuğu, katman şeridi ve alt çubuk gizlenir, numune bütün tahtayı kaplar. Soldaki küçük şeritte Taşı, Kalem, Işık, Büyüteç ve yakınlaştırma kalır. Şeridin en üstteki düğmesi ya da Esc hepsini geri getirir.', en: 'Clean view: the title, the toolbar, the layer rail and the footer step aside and the specimen fills the board. A small strip on the left keeps Move, Pen, Spotlight, Magnifier and zoom. The strip’s top button or Esc brings everything back.' }, 'F'],
    ['f', 'eye', { tr: 'Halkalar (alt çubuktaki göz): parçaların numaralı halkalarını gizler, numune çıplak görünür. Sınıf önce yalnızca görüntüye baksın; yeniden basınca halkalar geri gelir. Etiketle, Yakın çekim ve Tekrar soruları sırasında halkalar hep görünür. Fotoğrafa da halkasız çıkar.', en: 'Rings (the eye in the footer): hides the numbered rings of the parts so the specimen is seen bare. Let the class just look first; press again and the rings come back. During Label it, Close-up and Review questions the rings always show. The photo leaves them out too.' }, 'G'],
    ['f', 'grid', { tr: 'Kareler (alt çubukta, gözün yanında): görüntünün üstüne harfli sütunlar ve numaralı satırlar koyar. Sınıfa yer tarif etmek için: “C4 karesindeki hücreye bakın.” Yakınlaşınca harfler ve numaralar görüntünün kenarında kalır. Ölçeği olan görüntülerde sol altta bir karenin gerçek boyu yazar; bir yaprağın ya da lekenin kaç kare kapladığını sayıp alanını tahmin edin.', en: 'Grid (in the footer, next to the eye): puts lettered columns and numbered rows over the chart. For telling the class where to look: “look at the cell in C4.” Zoomed in, the letters and numbers stay at the edges of the view. On charts with a scale, the bottom left gives one square’s real size; count how many squares a leaf or a spot covers to estimate its area.' }, 'K'],
    ['f', 'mo', { tr: 'Durdur ve yavaşlat (yalnızca hareketli görüntülerde, görüntünün sağ üst köşesinde): ⏸ hareketi dondurur, bir noktayı rahatça gösterirsiniz; ▶ yeniden başlatır. ½ hareketi yarı hıza indirir, sınıf tek bir noktanın bütün yolunu izler. Örneğin kılcal damarda ve alveollerde O₂ ile CO₂, mantarın düşen sporları, işkembe sıvısındaki kirpikli hücreler.', en: 'Stop and slow (only on moving charts, in the view’s top right corner): ⏸ freezes the movement so you can point at one dot at leisure; ▶ starts it again. ½ halves the speed so the class can follow one dot all the way. For instance O₂ and CO₂ at the capillary and the alveoli, the spores falling from a mushroom’s gills, the ciliates in rumen fluid.' }, 'D · Y'],
    ['a', 'shot', { tr: 'Görüntüyü çizimleri ve adlarıyla birlikte resim olarak kaydet (İndirilenler klasörü).', en: 'Save the chart with its ink and names as a picture (Downloads folder).' }, ''],
    ['f', 'lab', { tr: 'Etiketle: adları doğru halkalara sürükle. İki yanlıştan sonra doğru halka parlar.', en: 'Label it: drag the names onto the right rings. After two misses the right ring glows.' }, ''],
    ['f', 'rev', { tr: 'Tekrar soruları: bu katmandaki bütün parçalar bulununca açılır.', en: 'Review questions: they open once every part on this layer is found.' }, ''],
    ['c', 'timer', { tr: 'Sınıf için büyük bir geri sayım ve kura (akıllı tahta modunda, ? düğmesinin yanında ve vadideki üst çubukta). Süre bitince zil çalar; kura, sınıf listesinden tahtaya gelecek kişiyi seçer.', en: 'A big countdown and a name draw for the class (smart-board mode, next to the ? button and on the valley’s top bar). A bell rings when time is up; the draw picks who comes to the board.' }, ''],
    ['a', 'views', { tr: 'Görünüm: şu anki görüntüyü (numune, katman, yer ve yakınlık) küçük bir resimle kaydeder. Dersten önce hazırlayın, derste tek dokunuşla oraya dönün. En fazla 12 görünüm, bu bilgisayarda. Sırayla göster, kayıtlı görünümleri slayt gibi sade görünümde tek tek açar; ◀ ▶, sunum kumandası ya da ← → ile ilerlenir. Kartta her görünümün altındaki ✎ bir soru ya da not yazar (sunumda altta görünür), ◀ ▶ sırasını değiştirir. Aynı kartta bütün numuneler de var: birine dokununca masa o numuneyle açılır.', en: 'Views: saves what is on screen now (specimen, layer, place and zoom) with a small picture. Prepare them before the lesson and jump back with one tap. Up to 12, on this computer. Present in order opens the saved views one by one, like slides, in the clean view; step with ◀ ▶, a presentation clicker or ← →. On the card, ✎ under a view writes a question or note on it (shown in the presentation) and ◀ ▶ change its place. The same card lists every specimen: tap one to open the table on it.' }, 'V'],
    ['f', 'mys', { tr: 'Yakın çekim: görüntü bir parçanın çok yakınından başlar, adlar gizlidir. Sınıf tahmin eder; her yanlış tahminde ya da "Biraz uzaklaş"ta görüntü bir adım uzaklaşır. Ne kadar erken bilinirse o kadar çok yıldız.', en: 'Close-up: the view starts very near one part with the names hidden. The class guesses; each wrong guess, or "Step back", pulls the view back a step. The earlier it is guessed, the more stars.' }, ''],
    ['f', 'cov', { tr: 'Perde (akıllı tahta modunda): görüntü kâğıtla, adı "Bu ne?" ile örtülür. Parmakla silerek delik açın, sınıf açılan parçalardan tahmin etsin; Aç perdeyi kaldırır. Derse giriş için.', en: 'Curtain (smart-board mode): the chart hides under paper and its name under “What is it?”. Rub holes with a finger, let the class guess from the bits that show; Reveal lifts it. A lesson opener.' }, ''],
    ['v', 'vote', { tr: 'Soru kartlarında (akıllı tahta modunda): el kaldıranları say, en çok oy alan şık sınıfın cevabı olur.', en: 'On question cards (smart-board mode): count the raised hands, the top option becomes the class’s answer.' }, ''],
  ],
  help() {
    if (!this.on || this._busy || this.mode !== 'explore') return;
    if (this.sel) this.unfocus();
    G.S.flags.studyHelp = 1;
    const bar = this.el.querySelector('.st-tools'), icon = (k, id) =>
      k === 't' ? bar.querySelector(`[data-t=${id}] svg`).outerHTML : k === 'a' ? bar.querySelector(`[data-a=${id}] svg`).outerHTML
        : id === 'lab' ? this.el.querySelector('.st-lab svg').outerHTML : id === 'mys' ? this.el.querySelector('.st-mys svg').outerHTML : id === 'cov' ? this.el.querySelector('.st-cov svg').outerHTML : id === 'rev' ? ICON.quiz : id === 'map' ? this.MAP_ICON : id === 'eye' ? this.el.querySelector('.st-eye svg').outerHTML : id === 'grid' ? this.el.querySelector('.st-grid svg').outerHTML : id === 'cmp' ? this.el.querySelector('.st-cmp svg').outerHTML : id === 'timer' ? ICON.clock : id === 'mo' ? '⏸' : '✋';
    const name = (k, id) => k === 't' || k === 'a' ? T('st_t_' + id) : id === 'lab' ? T('st_lab') : id === 'mys' ? T('st_mys') : id === 'cov' ? T('st_cov') : id === 'rev' ? T('st_review') : id === 'map' ? T('st_map') : id === 'eye' ? T('st_marks_n') : id === 'grid' ? T('st_grid_n') : id === 'cmp' ? T('st_cmp') : id === 'timer' ? T('hud_timer') : id === 'mo' ? T('st_mo_n') : T('vote_btn');
    const box = h('div', 'st-offer help');
    box.innerHTML = `<small class="st-qk">?</small><h3>${T('st_help_t')}</h3>
      <div class="help-list">${[['t', 'st_hg_t'], ['a', 'st_hg_a'], ['f', 'st_hg_f'], ['cv', 'st_hg_c']].map(([ks, hk]) => {
        const rows = this.HELP.filter(r => ks.includes(r[0]));
        return rows.length ? `<h4 class="help-h">${T(hk)}</h4>` + rows.map(([k, id, txt, key]) => `<div class="help-row"><span class="hi">${icon(k, id)}</span><div><b>${U.esc(name(k, id))}</b>${key ? `<kbd>${key}</kbd>` : ''}<p>${U.esc(L(txt))}</p></div></div>`).join('') : '';
      }).join('')}</div>
      <p class="help-keys">${T('st_help_keys')}</p><p class="help-keys">${T('st_help_hold')}</p><div class="st-c-foot"><button class="later">${T('st_close_card')}</button></div>`;
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._later(); };
    AU.sfx('page');
    this._showCard(box);
    this._refresh();
  },

  // ================================================================ side by side
  // any other drawn layer beside this one (an onion skin cell beside a cheek cell, a healthy leaf beside a rusty one),
  // so the class can point out what is the same and what differs. The second plate is only for looking: pen, light
  // and photo work over both, the spots and the ruler step aside
  canPair() { return this.lv().mode === 'plate' && this.mode === 'explore' && !this.scope; },
  pairWith(sel) {
    if (!this.on || this._busy || (sel && !this.canPair())) return;
    if (sel && this.cmp) this.compare(false);
    if (sel && this.sel) { this.sel = null; }
    this.pair = sel || null;
    this._hideCard();
    this.hsEl.classList.toggle('gone', !!this.pair || this.cmp);
    this.camTo(this._fitCam(false), 0.6);
    AU.sfx('zoom', { up: !sel });
    this._refresh();
  },
  _pairName(p) { const sp = SPECS[p.spec]; return `${L(sp.name)} · ${L(sp.levels[p.level].tag)}`; },
  _pairPicker() {
    if (!this.canPair()) return;
    const S = G.S, me = this.specId, lvl = this.level, magOf = t => { const m = /\d[\d\s.,]*/.exec(this.splitTag(t)[0]); return m ? m[0].replace(/\s/g, '') : ''; };
    const mine = magOf(this.lv().tag), rows = [];
    for (const id in SPECS) {
      if (!(G.set.board || S.flags.lesson || (S.journal.seen && S.journal.seen[id]))) continue;
      const lv = SPECS[id].levels.map((v, i) => ({ v, i })).filter(({ v, i }) => v.mode === 'plate' && !(id === me && i === lvl));
      if (lv.length) rows.push({ id, lv });
    }
    const chip = (id, i) => `<button class="pair-opt${magOf(SPECS[id].levels[i].tag) === mine ? ' same' : ''}" data-s="${id}" data-l="${i}">${U.esc(L(SPECS[id].levels[i].tag))}</button>`;
    const box = h('div', 'st-offer pairpick');
    box.innerHTML = `<small class="st-qk">${T('st_t_pair')}</small><h3>${T('st_pair_t')}</h3><p class="st-fh">${T('st_pair_hint')}</p>
      <div class="pair-list">${rows.map(r => `<div class="pair-row"><b>${U.esc(L(SPECS[r.id].name))}</b><div>${r.lv.map(({ i }) => chip(r.id, i)).join('')}</div></div>`).join('')}</div>
      <div class="st-c-foot"><button class="later">${T('st_close_card')}</button></div>`;
    box.querySelectorAll('.pair-opt').forEach(b => b.onclick = () => { AU.sfx('click'); this.pairWith({ spec: b.dataset.s, level: +b.dataset.l }); });
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._later(); };
    if (this.sel) this.unfocus();
    this._showCard(box);
  },
  // ================================================================ saved views
  // the teacher saves the spots worth showing before the lesson (which chart, which layer, where, how close) and comes
  // back to each with one tap. Kept on this computer; the place is stored in chart units, so any screen size works
  VIEWS_KEY: 'seedkeeper-views', VIEWS_MAX: 12,
  _views() { try { const v = JSON.parse(localStorage.getItem(this.VIEWS_KEY) || '[]'); return Array.isArray(v) ? v.filter(x => x && SPECS[x.s] && SPECS[x.s].levels[x.l]) : []; } catch (e) { return []; } },
  _viewsPut(v) {
    try { localStorage.setItem(this.VIEWS_KEY, JSON.stringify(v)); return true; }
    catch (e) { try { localStorage.setItem(this.VIEWS_KEY, JSON.stringify(v.map(x => Object.assign({}, x, { img: '' })))); return true; } catch (e2) { return false; } }
  },
  _viewName(v) { return `${L(SPECS[v.s].name)} · ${L(SPECS[v.s].levels[v.l].tag)}`; },
  // the saved views shown in order, like slides: the clean view, a bar with ◀ 3 / 7 ▶, and a presentation clicker's
  // keys (Page Down / Page Up, or the arrows) step through them, across specimens. Esc or ✕ ends it
  _pres: null,
  present(i) {
    const list = this._views();
    if (!this.on || !list.length || this.mode !== 'explore') return;
    this._pres = { list, i: U.clamp(i || 0, 0, list.length - 1) };
    AU.sfx('page');
    this._presGo();
  },
  _presGo() {
    const p = this._pres; if (!p) return;
    this._presUI();
    this._viewGo(p.list[p.i]);
    this._presUI();   // the table may have opened again on another specimen
  },
  _presStep(d) {
    const p = this._pres; if (!p || this._busy) return;
    const n = p.i + d;
    if (n < 0 || n >= p.list.length) { AU.sfx('click'); return; }
    p.i = n; AU.sfx('page'); this._presGo();
  },
  presentEnd() { if (!this._pres) return; this._pres = null; this.setBare(false); this._presUI(); },
  _presUI() {
    const bar = this.el && this.el.querySelector('.st-pres'); if (!bar || !this.on) return;
    const p = this._pres;
    bar.classList.toggle('hidden', !p);
    if (!p) return;
    if (!this.bare) this.setBare(true);
    const v = p.list[p.i];
    bar.querySelector('.pn').textContent = `${p.i + 1} / ${p.list.length}`;
    const pt = bar.querySelector('.pt'); pt.textContent = v.c || this._viewName(v); pt.classList.toggle('cap', !!v.c);
    bar.querySelector('.pp').disabled = p.i === 0; bar.querySelector('.px').disabled = p.i === p.list.length - 1;
  },
  views() {
    if (!this.on || this._busy || this.mode !== 'explore') return;
    const list = this._views(), box = h('div', 'st-offer views');
    box.innerHTML = `<small class="st-qk">${T('st_t_views')}</small><h3>${T('st_views_t')}</h3><p class="st-fh">${T('st_views_hint')}</p>
      ${list.length > 1 ? `<button class="views-play yes">▶ ${T('st_views_play')}</button>` : ''}<button class="views-save">${T('st_views_save')}</button><p class="views-note small hidden"></p>
      <div class="view-list">${list.length ? list.map((v, i) => `<div class="view-opt${v.s === this.specId && v.l === this.level ? ' here' : ''}"><button class="vgo2" data-i="${i}">${v.img ? `<img src="${v.img}" alt="">` : '<i></i>'}<b class="vno">${i + 1}</b><span>${U.esc(this._viewName(v))}</span>${v.c ? `<em class="vc">${U.esc(v.c)}</em>` : ''}</button><button class="vdel" data-i="${i}" aria-label="${U.esc(T('st_views_del'))}">✕</button><div class="vmv"><button class="vup" data-i="${i}" aria-label="${U.esc(T('st_views_up'))}"${i ? '' : ' disabled'}>◀</button><button class="vcap" data-i="${i}" aria-label="${U.esc(T('st_views_cap'))}">✎</button><button class="vdn" data-i="${i}" aria-label="${U.esc(T('st_views_dn'))}"${i < list.length - 1 ? '' : ' disabled'}>▶</button></div></div>`).join('') : `<p class="hint">${T('st_views_none')}</p>`}</div>
      <h4 class="sj-h">${T('st_views_specs')}</h4>
      <div class="spec-jump">${this._jumpable().map(id => `<button class="sj${id === this.specId ? ' here' : ''}" data-s="${id}"><canvas width="160" height="120"></canvas><span>${U.esc(L(SPECS[id].name))}</span></button>`).join('')}</div>
      ${list.length ? `<div class="views-link"><button class="vlink">${T('st_views_link')}</button><p class="small">${T(location.protocol === 'file:' ? 'st_views_link_file' : 'st_views_link_hint')}</p><textarea class="vl-text hidden" readonly rows="3"></textarea></div>` : ''}
      <div class="st-c-foot"><button class="later">${T('st_close_card')}</button></div>`;
    box.querySelector('.views-save').onclick = () => this._viewSave(box);
    const vp = box.querySelector('.views-play'); if (vp) vp.onclick = () => this.present(0);
    const vl = box.querySelector('.vlink');
    if (vl) vl.onclick = () => {
      const link = this.viewsLink(), ta = box.querySelector('.vl-text');
      AU.sfx('click');
      ta.value = link; ta.classList.remove('hidden'); ta.focus(); ta.select();
      try { navigator.clipboard.writeText(link).then(() => UI.toast(T('st_views_copied'), '🔗'), () => { }); } catch (e) { /* no clipboard here: the link is selected, ready for Ctrl+C */ }
    };
    box.querySelectorAll('.vgo2').forEach(b => b.onclick = () => { AU.sfx('click'); this._viewGo(list[+b.dataset.i]); });
    // the lesson's order: ◀ moves a view earlier, ▶ later; ✎ writes a question or a note on it
    const move = (i, d) => { const v = this._views(), j = i + d; if (j < 0 || j >= v.length) return; [v[i], v[j]] = [v[j], v[i]]; this._viewsPut(v); AU.sfx('click'); this.views(); };
    box.querySelectorAll('.vup').forEach(b => b.onclick = () => move(+b.dataset.i, -1));
    box.querySelectorAll('.vdn').forEach(b => b.onclick = () => move(+b.dataset.i, 1));
    box.querySelectorAll('.vcap').forEach(b => b.onclick = () => this._viewCap(box, +b.dataset.i));
    box.querySelectorAll('.sj').forEach(b => b.onclick = () => { AU.sfx('click'); this._jump(b.dataset.s); });
    // the little pictures are drawn one at a time after the card is up, so it opens at once even with 30 specimens
    const cvs = [...box.querySelectorAll('.sj canvas')];
    const next = () => { const cv = cvs.shift(); if (!cv || !box.isConnected) return; try { LENS.thumb(cv, cv.parentNode.dataset.s, 0); } catch (e) { } setTimeout(next, 16); };
    setTimeout(next, 30);
    box.querySelectorAll('.vdel').forEach(b => b.onclick = () => { AU.sfx('page'); const v = this._views(); v.splice(+b.dataset.i, 1); this._viewsPut(v); this.views(); });
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._later(); };
    if (this.sel) this.unfocus();
    this._showCard(box);
  },
  _viewSave(box) {
    const note = box.querySelector('.views-note');
    if (this.pair || this.cmp || this.cover) { AU.sfx('wrong'); note.textContent = T('st_views_no'); note.classList.remove('hidden'); return; }
    // the place is the chart point in the middle of the free view, and the zoom is kept relative to "fit"
    const A = this._area(false), [x, y] = this.toWorld((A.x0 + A.x1) / 2, (A.y0 + A.y1) / 2), zr = this.cam.z / this._fitZ(A);
    const cur = this._views();
    if (cur.length >= this.VIEWS_MAX) { AU.sfx('wrong'); note.textContent = T('st_views_full', { n: this.VIEWS_MAX }); note.classList.remove('hidden'); return; }
    const img = this._thumb();
    const v = [...cur, { s: this.specId, l: this.level, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, zr: Math.round(zr * 1000) / 1000, img, t: Date.now() }];
    this._viewsPut(v);
    AU.sfx('success');
    this.el.classList.remove('flash'); void this.el.offsetWidth; this.el.classList.add('flash');
    setTimeout(() => this.el && this.el.classList.remove('flash'), 500);
    UI.toast(T('st_views_ok'), '★');
    this.views();
  },
  _viewCap(box, i) {
    const opt = box.querySelectorAll('.view-opt')[i], v = this._views()[i];
    if (!opt || !v || opt.querySelector('input')) return;
    const inp = document.createElement('input');
    inp.type = 'text'; inp.maxLength = 80; inp.value = v.c || ''; inp.placeholder = T('st_views_cap_ph'); inp.className = 'vc-in';
    opt.appendChild(inp);
    let done = false;
    const save = keep => {
      if (done) return; done = true;
      if (keep) {
        const list = this._views(), c = inp.value.trim().slice(0, 80);
        if (list[i]) { if (c) list[i].c = c; else delete list[i].c; this._viewsPut(list); }
        AU.sfx('click');
      }
      if (this.on && this.card.contains(box)) this.views();
    };
    // the key must stop here: once the card is redrawn the box is gone, and the game would take Enter for its own
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); save(true); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); save(false); } });
    inp.addEventListener('blur', () => save(true));
    try { inp.focus(); } catch (e) { }
  },
  _thumb() {
    try {
      const tw = 240, th = Math.max(60, Math.round(tw * this.h / this.w)), tc = U.canvas(tw, th), tx = tc.getContext('2d');
      tx.fillStyle = '#E9E1CC'; tx.fillRect(0, 0, tw, th); tx.drawImage(this.cv, 0, 0, tw, th);
      return tc.toDataURL('image/jpeg', 0.72);
    } catch (e) { return ''; }   // a tainted or empty canvas: the view is kept without a picture
  },
  _jumpable() { return Object.keys(SPECS).filter(id => SPECS[id].levels && SPECS[id].levels.length && this.canOpen(id)); },
  _jump(id) {
    if (!SPECS[id] || id === this.specId) { this._later(); return; }
    const opt = Object.assign({}, this._opt, { noFocus: true });
    this._opt = {};
    this.close();
    this.open({ spec: id }, 0, null, null, opt);
  },
  _viewSame(a, b) { return a.s === b.s && a.l === b.l && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5; },
  // a link carries the whole list (without pictures) to another computer: prepared at home, opened on the board
  _viewsCode(list) { return list.map(v => [v.s, v.l, v.x, v.y, v.zr].concat(v.c ? [encodeURIComponent(v.c).replace(/~/g, '%7E')] : []).join(',')).join('~'); },
  viewsLink() { return `${location.href.split('#')[0].split('?')[0]}?tahta=1&gorunumler=${encodeURIComponent(this._viewsCode(this._views()))}`; },
  importViews(code) {
    const got = [];
    for (const part of String(code || '').split('~').slice(0, this.VIEWS_MAX)) {
      const [s, l, x, y, zr, c] = part.split(','), v = { s, l: +l, x: +x, y: +y, zr: +zr, img: '', t: Date.now() };
      if (!SPECS[s] || !SPECS[s].levels[v.l] || ![v.x, v.y, v.zr].every(Number.isFinite) || v.zr <= 0) continue;
      if (c) { try { const cc = decodeURIComponent(c).trim().slice(0, 80); if (cc) v.c = cc; } catch (e) { /* a broken caption: the view comes without it */ } }
      got.push(v);
    }
    if (!got.length) return [];
    // the link's order comes first (it is the lesson's order); a view already here keeps its picture
    const mine = this._views(), merged = got.map(g => { const m = mine.find(v => this._viewSame(v, g)); if (!m) return g; if (g.c) m.c = g.c; return m; });
    this._viewsPut([...merged, ...mine.filter(v => !merged.includes(v))].slice(0, this.VIEWS_MAX));
    return merged;
  },
  _viewGo(v) {
    if (!v || !SPECS[v.s]) return;
    const fly = () => {
      if (!this.on) return;
      if (this._busy) { setTimeout(fly, 80); return; }
      this._hideCard();
      const A = this._area(false), to = this._clampTo({ x: v.x, y: v.y, z: v.zr * this._fitZ(A), ax: (A.x0 + A.x1) / 2, ay: (A.y0 + A.y1) / 2 });
      AU.sfx('zoom', { up: to.z > this.cam.z });
      this.camTo(to, 0.8).then(() => {
        // a view that came by link has no picture yet: it gets one the first time it is visited
        if (!this.on || this.specId !== v.s || this.level !== v.l || Math.abs(this.cam.z / to.z - 1) > 0.02) return;
        const list = this._views(), i = list.findIndex(w => this._viewSame(w, v) && !w.img);
        if (i >= 0) { list[i].img = this._thumb(); this._viewsPut(list); }
      });
      this._refresh();
    };
    if (!this.on) { this.open({ spec: v.s }, v.l, null, null, { noFocus: true }); setTimeout(fly, 60); return; }
    this._hideCard();
    if (v.s !== this.specId) {
      // another chart: the table is reopened on it (without the focusing step), keeping whatever waits for it to close
      const opt = Object.assign({}, this._opt, { noFocus: true });
      this._opt = {};
      this._reopen = true; this.close(); this.open({ spec: v.s }, v.l, null, null, opt); this._reopen = false;
      setTimeout(fly, 60);
    } else if (v.l !== this.level) { this.setLevel(v.l); setTimeout(fly, 60); }
    else fly();
  },
  // ================================================================ ruler
  // the plate's own scale bar says how many plate units make, say, 10 µm; the ruler turns any line into a real length
  _scale() {
    const lv = this.lv(), nm = lv.mode === 'plate' && !this.cmp && !this.pair && lv.draw && lv.draw.plateName;
    if (!nm || !PLATES[nm]) return null;
    if (!(nm in MX.scales)) { MX.scales[nm] = null; PLATE_CACHE.get(nm, PLATES[nm].def, this.st(), 384); }
    const s = MX.scales[nm], m = s && /^([\d.,]+)\s*(nm|µm|μm|mm|cm|m)$/.exec(String(s[1]).trim());
    if (!m) return null;
    return { per: parseFloat(m[1].replace(',', '.')) / s[0], unit: m[2] === 'μm' ? 'µm' : m[2] };
  },
  // a scale bar that keeps up with the zoom: the plate's own bar sits in its corner and is soon off screen (or huge),
  // so once the view is zoomed in a round length (1, 2 or 5 of something) waits in the bottom corner of the view
  _liveBar() {
    if (!this.on || this.cover || this.scope || this.eye > 0.01 || this.alpha < 0.9) return null;
    const sc = this._scale(); if (!sc) return null;
    const A = (this._mapA && this._mapA.A) || this._area(false);
    if (this.cam.z < this._fitZ(A) * 1.3) return null;
    const target = G.set.board ? 170 : 130, raw = target * sc.per / this.cam.z, e = Math.pow(10, Math.floor(Math.log10(raw))), b = raw / e;
    const L = (b >= 5 ? 5 : b >= 2 ? 2 : 1) * e;
    return { L, px: L / sc.per * this.cam.z, label: this._len(L, sc.unit), A };
  },
  _len(v, unit) {
    const F = { nm: 1e-9, 'µm': 1e-6, mm: 1e-3, cm: 1e-2, m: 1 }, mtr = v * F[unit];
    const u = mtr >= 1 ? 'm' : mtr >= 0.01 ? 'cm' : mtr >= 0.001 ? 'mm' : mtr >= 1e-6 ? 'µm' : 'nm', txt = String(+(mtr / F[u]).toPrecision(3));
    return (I18N.lang === 'tr' ? txt.replace('.', ',') : txt) + ' ' + u;
  },
  _drawScale(c) {
    const lb = this._liveBar(); if (!lb) return;
    const k = G.set.board ? 1.25 : 1, fs = Math.round(15 * k), A = lb.A;
    c.save();
    c.font = `700 ${fs}px "Courier Prime", monospace`;
    const tw = c.measureText(lb.label).width, w = Math.max(lb.px, tw) + 28, hh = fs + 24 * k;
    const x0 = A.x1 - w - 6, y0 = A.y1 - hh - 6, bx = x0 + (w - lb.px) / 2, by = y0 + hh - 9 * k;
    c.fillStyle = 'rgba(27,26,23,0.82)'; U.rr(c, x0, y0, w, hh, 6); c.fill();
    c.fillStyle = '#F4EEDD';
    c.fillRect(bx, by - 2 * k, lb.px, 4 * k);
    c.fillRect(bx, by - 7 * k, 2 * k, 14 * k); c.fillRect(bx + lb.px - 2 * k, by - 7 * k, 2 * k, 14 * k);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(lb.label, x0 + w / 2, y0 + 5 * k + fs / 2);
    c.restore();
  },
  _measure(v, unit) {
    const F = { nm: 1e-9, 'µm': 1e-6, mm: 1e-3, cm: 1e-2, m: 1 }, mtr = v * F[unit];
    const u = mtr >= 1 ? 'm' : mtr >= 0.01 ? 'cm' : mtr >= 0.001 ? 'mm' : mtr >= 1e-6 ? 'µm' : 'nm', x = mtr / F[u];
    const txt = x >= 10 ? String(Math.round(x)) : x.toFixed(1);
    return '≈ ' + (I18N.lang === 'tr' ? txt.replace('.', ',') : txt) + ' ' + u;
  },

  // ================================================================ photo of the chart
  // the chart as the class sees it right now, the teacher's ink and the found names included, with a caption strip,
  // saved as a picture so it can go on the class's page or into a worksheet
  snapshot() {
    if (!this.on) return null;
    const dpr = G.dpr, w = this.w, hh = this.h, foot = 56, o = U.canvas(Math.round(w * dpr), Math.round((hh + foot) * dpr)), c = o.getContext('2d');
    c.drawImage(this.cv, 0, 0);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const font = getComputedStyle(document.body).fontFamily, big = G.set.board ? 1.2 : 1, quiz = this.mode !== 'explore';
    // the spots are buttons over the canvas, so they are drawn in by hand: numbered rings and the names showing
    if (this.tool !== 'spot' && !this.hsEl.classList.contains('gone') && !this.hsEl.classList.contains('nomarks')) for (const id in this._hs) {
      const { x, y, p, b } = this._hs[id];
      if (x < 0 || y < 0 || x > w || y > hh) continue;
      const f = this.found(id), done = b.classList.contains('good');
      const name = quiz ? (done ? L(OBS[id].title) : '') : f || this.names ? L(OBS[id].title) : '', r = 14 * big;
      c.beginPath(); c.arc(x, y, r, 0, TAU);
      c.fillStyle = done ? '#4E7A3A' : f && !quiz ? '#2A2620' : '#F7F2E4'; c.fill();
      c.lineWidth = 2; c.strokeStyle = '#2A2620'; c.stroke();
      c.fillStyle = done || (f && !quiz) ? '#F7F2E4' : '#2A2620'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `700 ${Math.round(13 * big)}px ${font}`;
      c.fillText(done ? '✓' : quiz ? '•' : f ? String(p.n) : '?', x, y + 0.5);
      if (!name) continue;
      c.font = `700 ${Math.round(13 * big)}px ${font}`;
      const tw = c.measureText(name).width + 14, ty = y + r + 6;
      c.fillStyle = 'rgba(247,242,228,0.95)'; c.fillRect(x - tw / 2, ty, tw, 22 * big);
      c.lineWidth = 1.2; c.strokeRect(x - tw / 2, ty, tw, 22 * big);
      c.fillStyle = '#2A2620'; c.fillText(name, x, ty + 11 * big + 0.5);
    }
    // the caption strip: what, how close, when
    c.fillStyle = '#F7F2E4'; c.fillRect(0, hh, w, foot);
    c.fillStyle = '#2A2620'; c.fillRect(0, hh, w, 2);
    c.textBaseline = 'middle'; c.textAlign = 'left';
    c.font = `700 ${Math.round(20 * big)}px ${font}`;
    c.fillText(`${L(this.spec().name)} · ${L(this.lv().tag)}${this.pair ? '  ⟷  ' + this._pairName(this.pair) : ''}`, 18, hh + foot / 2);
    c.textAlign = 'right'; c.font = `400 ${Math.round(14 * big)}px ${font}`;
    c.fillText(`${T('title')} · ${new Date().toLocaleDateString(I18N.lang === 'tr' ? 'tr-TR' : 'en-GB')}`, w - 18, hh + foot / 2);
    return o;
  },
  savePhoto() {
    const o = this.snapshot(); if (!o) return;
    this.el.classList.remove('flash'); void this.el.offsetWidth; this.el.classList.add('flash');
    setTimeout(() => this.el && this.el.classList.remove('flash'), 500);
    AU.sfx('page');
    const name = `tohum-bekcisi-${this.specId}-${this.level + 1}.png`;
    try {
      o.toBlob(bl => {
        if (!bl) { UI.toast(T('st_shot_no'), '!'); return; }
        const a = document.createElement('a'), u = URL.createObjectURL(bl);
        a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(u), 5000);
        UI.toast(T('st_shot_ok'), '✦');
      }, 'image/png');
    } catch (err) { UI.toast(T('st_shot_no'), '!'); }
  },

  // ================================================================ label the chart
  // a smart-board game: the names lie in the card and the class drags each one onto its ring (or taps a name, then
  // a ring). A wrong ring shakes and the name goes back; after two misses the right ring glows, so it always ends
  // ---------------------------------------------------------------- close-up: guess the part from very near
  // the view starts deep inside one part with every name hidden; each wrong guess (or "Step back") pulls the camera
  // back a step, so nobody can fail, but guessing it early earns more stars. Pan and zoom wait until it is solved
  MYS_Z: [5, 3, 1.8, 0.96],
  canMystery() { return this.canLabel() && !this.scope && !this.cmp && !this.pair && !this.cover && !this._busy; },
  _mysLock() { return this.mode === 'mystery' && !!this._mys && !this._mys.done; },
  mystery() {
    if (!this.on || this._busy || this.mode !== 'explore' || !this.canMystery()) return;
    const parts = this.parts().filter(p => OBS[p.id]); if (parts.length < 3) return;
    this.setTool('pan');
    this.sel = null; this.mode = 'mystery';
    if (window.speechSynthesis) speechSynthesis.cancel();
    for (const id in this._hs) this._hs[id].b.classList.remove('good', 'bad', 'hint', 'near');
    // a new part each round until every part has had its turn
    const m = this._mys && this._mys.key === this.key() ? this._mys : (this._mys = { key: this.key(), used: new Set() });
    let pool = parts.filter(p => !m.used.has(p.id)); if (!pool.length) { m.used.clear(); pool = parts; }
    const p = pool[Math.random() * pool.length | 0]; m.used.add(p.id);
    Object.assign(m, { p, step: 0, done: false });
    const opts = shuffle([p, ...shuffle(parts.filter(q => q.id !== p.id)).slice(0, 3)]), letters = 'ABCD', last = this.MYS_Z.length - 1;
    const box = h('div', 'st-quiz mys');
    box.innerHTML = `<small class="st-qk">${T('st_mys')}</small><h3>${T('st_mys_t')}</h3><p class="st-fh">${T('st_mys_hint')}</p>
      <div class="mys-steps" aria-hidden="true">${this.MYS_Z.map(() => '<i></i>').join('')}</div>
      <div class="answers">${opts.map((o, k) => `<button class="ans" data-i="${k}"><b>${letters[k]}</b><span>${U.esc(L(OBS[o.id].title))}</span></button>`).join('')}</div>
      <div class="fb hidden"></div>
      <div class="st-c-foot"><button class="mys-out">${T('st_mys_out')}</button><button class="go yes hidden">${T('st_mys_next')} ▶</button><button class="later">${T('st_mys_end')}</button></div>`;
    const fb = box.querySelector('.fb'), outB = box.querySelector('.mys-out'), vk = UI.voteKit(box, fb);
    const paint = () => { box.querySelectorAll('.mys-steps i').forEach((x, i) => x.classList.toggle('on', i <= m.step)); outB.disabled = m.step >= last; };
    const back = () => { if (m.step >= last) return; m.step++; paint(); AU.sfx('zoom', { up: false }); this.camTo(this._mysCam(), 0.7); };
    outB.onclick = () => { if (!m.done) back(); };
    box.querySelectorAll('.ans').forEach(b => b.onclick = () => {
      if (m.done || b.classList.contains('x') || this.mode !== 'mystery') return;
      const k = +b.dataset.i;
      if (vk && vk.take(k)) return;
      if (opts[k].id === p.id) {
        m.done = true; b.classList.add('ok'); AU.sfx('success'); if (vk) vk.done();
        const stars = Math.max(1, 3 - m.step);
        fb.className = 'fb good';
        fb.innerHTML = `<b>✓ ${U.esc(T('st_mys_ok', { t: L(OBS[p.id].title) }))} <span class="mys-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span></b><p>${ATLAS[p.id] ? md(LX(ATLAS[p.id].what)) : U.esc(L(OBS[p.id].text))}</p>`;
        box.querySelector('.go').classList.remove('hidden'); outB.classList.add('hidden');
        this._mysReveal();
      } else {
        b.classList.add('x'); AU.sfx('wrong');
        fb.className = 'fb bad'; fb.innerHTML = `<b>${T(m.step >= last ? 'st_mys_no2' : 'st_mys_no')}</b>`;
        back();
      }
    });
    box.querySelector('.go').onclick = () => { AU.sfx('page'); this.mode = 'explore'; this.mystery(); };
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._abortQuiz(); this._later(); };
    this.hsEl.classList.add('gone');
    this._showCard(box);
    paint();
    this._refresh();
    this.camTo(this._mysCam(), 0.8);
    AU.sfx('page');
    if (G.set.tts) UI.speak(T('st_mys_t'), true);
  },
  // each step back widens the view and drifts from the part towards the middle of the chart
  _mysCam() {
    const m = this._mys, A = this._area(true), f = this._frame(), t = m.step / (this.MYS_Z.length - 1);
    return this._clampTo({ x: U.lerp(m.p.px, f[0] + f[2] / 2, t), y: U.lerp(m.p.py, f[1] + f[3] / 2, t), z: this._fitZ(A) * this.MYS_Z[m.step], ax: (A.x0 + A.x1) / 2, ay: (A.y0 + A.y1) / 2 });
  },
  _mysReveal() {
    const m = this._mys, hs = this._hs[m.p.id];
    this.hsEl.classList.remove('gone');
    if (hs) { hs.b.classList.add('good'); hs.b.querySelector('.lab').textContent = L(OBS[m.p.id].title); }
    this.camTo(this._focusCam(m.p), 0.9);
  },
  // the footer holds up to eight buttons. When they crowd the hint into a tall thin column (which also shrinks the
  // view), the hint steps aside first; only if the buttons still barely fit do their words go, leaving the icons
  _fitFoot() {
    const f = this.el && this.el.querySelector('.st-foot'); if (!f) return;
    f.classList.remove('tight', 'cramped');
    const mid = f.querySelector('.st-mid');
    if (mid && mid.offsetWidth < 240) f.classList.add('cramped');
    if ((mid && mid.offsetWidth < 70) || f.scrollWidth > f.clientWidth + 2) f.classList.add('tight');
  },
  canLabel() { const pr = this.prog(); return pr.b >= 3 && (pr.a === pr.b || !!G.set.board || !!G.S.flags.lesson); },
  label() {
    if (!this.on || this._busy || this.mode !== 'explore') return;
    if (this.scope) this._focused(true);
    if (this.cmp) this.compare(false);
    if (this.pair) this.pairWith(null);
    const parts = this.parts(); if (parts.length < 2) return;
    this.setTool('pan');
    this.sel = null; this.mode = 'label';
    if (window.speechSynthesis) speechSynthesis.cancel();
    for (const id in this._hs) this._hs[id].b.classList.remove('good', 'bad', 'hint', 'near');
    const names = shuffle(parts.map(p => p.id));
    this._lab = { left: new Set(names), placed: new Set(), miss: {}, first: 0, n: names.length, pick: null };
    const box = h('div', 'st-quiz labels');
    box.innerHTML = `<small class="st-qk">${T('st_lab')}</small><h3>${T('st_lab_t')}</h3><p class="st-fh">${T('st_lab_hint')}</p>
      <div class="lab-tray">${names.map(id => `<button class="lab-chip" data-id="${id}">${U.esc(L(OBS[id].title))}</button>`).join('')}</div>
      <div class="fb hidden"></div><div class="st-c-foot"><button class="later">${T('st_close_card')}</button></div>`;
    box.querySelectorAll('.lab-chip').forEach(c => this._labChip(c));
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._abortQuiz(); this._later(); };
    this._showCard(box);
    this.camTo(this._fitCam(true), 0.6);
    this._refresh();
    AU.sfx('page');
    if (G.set.tts) UI.speak(T('st_lab_t'), true);
  },
  // a name tag: a short tap picks it, a drag carries a copy of it over the chart and drops it on the nearest ring
  _labChip(c) {
    let st = null;
    const end = () => { if (this._labG) { this._labG.remove(); this._labG = null; } c.classList.remove('lifted'); this._labNear(null); };
    c.onpointerdown = e => {
      if (e.button > 0 || !this._lab) return;
      e.preventDefault();
      try { c.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointers have nothing to capture */ }
      st = { x: e.clientX, y: e.clientY, moved: false };
    };
    c.onpointermove = e => {
      if (!st) return;
      if (!st.moved) {
        if (Math.hypot(e.clientX - st.x, e.clientY - st.y) < 10) return;
        st.moved = true; c.classList.add('lifted');
        this._labG = h('div', 'lab-ghost', U.esc(c.textContent)); document.body.appendChild(this._labG);
      }
      this._labG.style.left = e.clientX + 'px'; this._labG.style.top = e.clientY + 'px';
      this._labNear(this._labTarget(e));
    };
    c.onpointerup = c.onpointercancel = e => {
      if (!st) return;
      const moved = st.moved; st = null;
      const t = moved && e.type === 'pointerup' ? this._labTarget(e) : null;
      end();
      if (!this._lab) return;
      if (!moved) { AU.sfx('click'); this._labPick(this._lab.pick === c.dataset.id ? null : c.dataset.id); }
      else if (t) this._labDrop(t, c.dataset.id);
    };
  },
  _labTarget(e) {
    if (!this._lab) return null;
    const p = this._xy(e);
    let best = null, bd = Math.max(48, Math.min(this.w, this.h) * 0.075);
    for (const id in this._hs) {
      if (this._lab.placed.has(id)) continue;
      const o = this._hs[id], d = Math.hypot(o.x - p.x, o.y - p.y);
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  },
  _labNear(id) { for (const k in this._hs) this._hs[k].b.classList.toggle('near', k === id); },
  _labPick(id) {
    if (!this._lab) return;
    this._lab.pick = id;
    this.card.querySelectorAll('.lab-chip').forEach(c => c.classList.toggle('picked', c.dataset.id === id));
  },
  _labSay(cls, html) { const fb = this.card.querySelector('.labels .fb'); if (fb) { fb.className = 'fb ' + cls; fb.innerHTML = html; } },
  // a name dropped on a ring: right, it sticks there with its name; wrong, the ring shakes and the name goes back
  _labDrop(tid, cid = this._lab && this._lab.pick) {
    const lb = this._lab;
    if (!lb || this.mode !== 'label' || !this._hs[tid] || lb.placed.has(tid)) return false;
    if (!cid) { AU.sfx('click'); this._labSay('', `<b>${T('st_lab_pick')}</b>`); return false; }
    const b = this._hs[tid].b, chip = this.card.querySelector(`.lab-chip[data-id="${cid}"]`);
    if (L(OBS[tid].title) === L(OBS[cid].title)) {
      lb.placed.add(tid); lb.left.delete(cid);
      if (lb.pick === cid) this._labPick(null);
      if (!lb.miss[cid]) lb.first++;
      b.classList.remove('bad', 'hint', 'near'); b.classList.add('good');
      b.querySelector('.lab').textContent = L(OBS[tid].title);
      if (chip) chip.remove();
      this._labSay('good', `<b>✓ ${U.esc(L(OBS[tid].title))}</b>`);
      if (lb.left.size) AU.sfx('chime'); else this._labDone();
      return true;
    }
    lb.miss[cid] = (lb.miss[cid] || 0) + 1;
    b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
    setTimeout(() => b.classList.remove('bad'), 700);
    if (chip) { chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake'); }
    AU.sfx('wrong');
    let glow = false;
    if (lb.miss[cid] >= 2) {
      const right = Object.keys(this._hs).find(id => !lb.placed.has(id) && L(OBS[id].title) === L(OBS[cid].title));
      if (right) { this._hs[right].b.classList.add('hint'); glow = true; }
    }
    this._labSay('bad', `<b>${T('think_again')}</b><p>${T('st_lab_no')}${glow ? ' ' + T('st_lab_glow') : ''}</p>`);
    return false;
  },
  _labDone() {
    const lb = this._lab, box = h('div', 'st-offer sum');
    box.innerHTML = `<div class="st-medal"><b>${lb.first}/${lb.n}</b><small>${T('st_lab_first')}</small></div>
      <h3>${T('st_lab_done')}</h3><p>${T('st_lab_p', { a: lb.first, b: lb.n })}</p>
      <button class="big again">${T('st_again')}</button><button class="later">${T('st_close_card')}</button>`;
    box.querySelector('.again').onclick = () => { AU.sfx('page'); this.mode = 'explore'; this._lab = null; this.label(); };
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._abortQuiz(); this._later(); };
    this._showCard(box);
    UI.stamp(T('st_lab_done'), T('st_lab_p', { a: lb.first, b: lb.n }));
    AU.sfx('success');
  },
  _abortQuiz() {
    this._onFind = null;
    if (this._pending) { const p = this._pending; this._pending = null; p(null); }
    if (this._labG) { this._labG.remove(); this._labG = null; }
    if (this.mode === 'mystery' && this.hsEl) this.hsEl.classList.remove('gone');
    if (this.mode === 'review' || this.mode === 'label' || this.mode === 'mystery') { this.mode = 'explore'; this._lab = null; this._hideCard(); if (this.on) this._refresh(); }
  },
  _think(box) {
    const s = +G.set.think || 0, th = box.querySelector('.st-think');
    if (!s || !th) return;
    th.classList.remove('hidden'); box.classList.add('thinking');
    const bar = th.querySelector('.st-tbar i');
    bar.style.transition = `transform ${s}s linear`;
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transform = 'scaleX(0)'; }));
    const end = () => { if (!box.classList.contains('thinking')) return; box.classList.remove('thinking'); th.classList.add('hidden'); AU.sfx('chime'); };
    const tm = setTimeout(end, s * 1000);
    th.querySelector('button').onclick = () => { clearTimeout(tm); end(); };
  },
  _thinkHTML() { return `<div class="st-think hidden"><div class="st-tbar"><i></i></div><span>${T('st_think')}</span><button>${T('st_ready')} ▸</button></div>`; },
  _askMC(q, i, n) {
    return new Promise(res => {
      this._pending = res;
      const letters = 'ABCD', box = h('div', 'st-quiz');
      box.innerHTML = `<small class="st-qk">${T('st_q', { i: i + 1, n })} · <b>${U.esc(currText(q.code))}</b></small><h3>${U.esc(L(q.prompt))}</h3>
        ${q.quote ? `<blockquote>${md(L(q.quote))}</blockquote>` : ''}${this._thinkHTML()}
        <div class="answers">${q.options.map((o, k) => `<button class="ans" data-i="${k}"><b>${letters[k]}</b><span>${U.esc(L(o.t))}</span></button>`).join('')}</div>
        <div class="fb hidden"></div>
        <div class="st-c-foot"><button class="tts" aria-label="${U.esc(T('read_aloud'))}">${ICON.speaker}</button><button class="go yes hidden">${T('next')} ▶</button></div>`;
      let tries = 0, first = null, tag = null, done = false;
      const fb = box.querySelector('.fb'), go = box.querySelector('.go'), vk = UI.voteKit(box, fb);
      box.querySelectorAll('.ans').forEach(b => b.onclick = () => {
        if (done || b.classList.contains('x') || box.classList.contains('thinking')) return;
        const k = +b.dataset.i, o = q.options[k];
        if (vk && vk.take(k)) return;
        tries++;
        if (first === null) { first = k; if (!o.ok) tag = o.tag || null; }
        if (o.ok) {
          done = true; b.classList.add('ok'); AU.sfx('success');
          fb.className = 'fb good'; fb.innerHTML = `<b>✓ ${T('correct')}</b><p>${U.esc(L(q.explain || ''))}</p>`;
          go.classList.remove('hidden');
          if (vk) vk.done();
          G.S.answers.push({ q: q.id, code: q.code, case: null, first, ok: first === k, tries, sure: false, tag, votes: (vk && vk.tally) || undefined, t: Date.now() });
          G.save();
        } else {
          b.classList.add('x'); AU.sfx('wrong');
          fb.className = 'fb bad'; fb.innerHTML = `<b>${T('think_again')}</b><p>${U.esc(L(o.fb || ''))}</p>`;
        }
      });
      box.querySelector('.tts').onclick = () => UI.speak(plain(L(q.prompt) + '. ' + (q.quote ? L(q.quote) + '. ' : '') + q.options.map((o, k) => letters[k] + ': ' + L(o.t)).join('. ')), true);
      go.onclick = () => { AU.sfx('page'); this._pending = null; res(!!q.options[first].ok); };
      this._showCard(box);
      this._think(box);
      this._refresh();
      if (G.set.tts) UI.speak(plain(L(q.prompt)), true);
    });
  },
  _askFind(q, i, n) {
    return new Promise(res => {
      this._pending = res;
      const box = h('div', 'st-quiz find');
      box.innerHTML = `<small class="st-qk">${T('st_q', { i: i + 1, n })} · ${T('st_find')}</small><h3 class="st-target">${U.esc(L(OBS[q.target].title))}</h3>
        <p class="st-fh">${T('st_find_hint')}</p>${this._thinkHTML()}<div class="fb hidden"></div><div class="st-c-foot"><button class="go yes hidden">${T('next')} ▶</button></div>`;
      let tries = 0, first = null, done = false;
      const fb = box.querySelector('.fb'), go = box.querySelector('.go');
      this._onFind = (id, b) => {
        if (done || box.classList.contains('thinking')) return;
        tries++;
        if (first === null) first = id;
        const what = ATLAS[id] ? md(LX(ATLAS[id].what)) : U.esc(L(OBS[id].text));
        if (id === q.target) {
          done = true; b.classList.add('good'); b.querySelector('.lab').textContent = L(OBS[id].title); AU.sfx('success');
          fb.className = 'fb good'; fb.innerHTML = `<b>✓ ${T('correct')}</b><p>${what}</p>`;
          go.classList.remove('hidden');
          G.S.answers.push({ q: q.id, code: q.code, case: null, first, ok: first === q.target, tries, sure: false, tag: null, t: Date.now() });
          G.save();
        } else {
          b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
          b.querySelector('.lab').textContent = L(OBS[id].title);
          AU.sfx('wrong');
          fb.className = 'fb bad'; fb.innerHTML = `<b>${T('think_again')}</b><p>${U.esc(T('st_this_is', { t: L(OBS[id].title) }))} ${what}</p>`;
        }
      };
      go.onclick = () => { AU.sfx('page'); this._onFind = null; this._pending = null; res(first === q.target); };
      this._showCard(box);
      this._think(box);
      this._refresh();
      if (G.set.tts) UI.speak(T('st_find') + ': ' + L(OBS[q.target].title), true);
    });
  },
  _summaryCard(good, n) {
    const sp = this.spec(), nextL = this.level + 1 < sp.levels.length ? this.level + 1 : null, box = h('div', 'st-offer sum');
    box.innerHTML = `<div class="st-medal"><b>${good}/${n}</b><small>${'★'.repeat(good)}${'☆'.repeat(Math.max(0, n - good))}</small></div>
      <h3>${T('st_sum_t')}</h3><p>${T('st_sum_p', { a: good, b: n })}</p>
      ${nextL != null ? `<button class="big yes nextl">${U.esc(T('st_next_lv', { t: L(sp.levels[nextL].tag) }))} ▸</button>` : ''}
      <button class="big again">${T('st_again')}</button><button class="later">${T('st_close_card')}</button>`;
    const nb = box.querySelector('.nextl'); if (nb) nb.onclick = () => { AU.sfx('click'); this.setLevel(nextL); };
    box.querySelector('.again').onclick = () => { AU.sfx('page'); this.review(); };
    box.querySelector('.later').onclick = () => { AU.sfx('click'); this._later(); };
    return box;
  },

  // ================================================================ keys
  _key(e) {
    if (this.mode === 'mystery') {
      const box = this.card.querySelector('.st-quiz.mys');
      if (e.code === 'Escape') { this._abortQuiz(); this._later(); return; }
      if (!box) return;
      if (/^Digit[1-4]$/.test(e.code)) { const b = box.querySelectorAll('.ans')[+e.code.slice(5) - 1]; if (b) b.click(); return; }
      if (['Enter', 'Space', 'Minus', 'NumpadSubtract'].includes(e.code)) { const g = box.querySelector('.go:not(.hidden)') || box.querySelector('.mys-out:not(.hidden)'); if (g) g.click(); }
      return;
    }
    if (this.mode === 'label') {
      if (e.code === 'Escape') { this._abortQuiz(); this._later(); return; }
      if (!/^(Equal|NumpadAdd|Minus|NumpadSubtract|Digit0|Numpad0)$/.test(e.code)) return;
    }
    if (this.mode === 'review') {
      const box = this.card.querySelector('.st-quiz');
      if (/^Digit[1-4]$/.test(e.code) && box) { const b = box.querySelectorAll('.ans')[+e.code.slice(5) - 1]; if (b) b.click(); return; }
      if (UI.fwd(e.code)) { const g = this.card.querySelector('.go:not(.hidden)') || this.card.querySelector('.st-think:not(.hidden) button'); if (g) g.click(); return; }
      if (e.code === 'Escape') this.close();
      return;
    }
    if (this._pres) {
      if (['ArrowRight', 'PageDown', 'Space'].includes(e.code)) { this._presStep(1); return; }
      if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.code)) { this._presStep(-1); return; }
      if (e.code === 'Escape' && this.tool === 'pan' && !this._zb && !this.sel && !this.card.classList.contains('show')) { AU.sfx('click'); this.presentEnd(); return; }
    }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') { if (this.tool === 'count') this._countUndo(); else this.undo(); return; }
    const top = this.card.classList.contains('show') && !this.sel ? this.card.querySelector('.go, .nextl') : null;
    switch (e.code) {
      case 'Equal': case 'NumpadAdd': this._zoomBtn(1.6); break;
      case 'Minus': case 'NumpadSubtract': this._zoomBtn(1 / 1.6); break;
      case 'Digit0': case 'Numpad0': this.fit(); break;
      case 'KeyP': this.setTool('pen'); break;
      case 'KeyM': this.setTool('loupe'); break;
      case 'KeyI': this.setTool('spot'); break;
      case 'KeyR': if (this._scale()) this.setTool('ruler'); break;
      case 'KeyN': this.setTool('count'); break;
      case 'KeyG': this.toggleMarks(); break;
      case 'KeyK': this.toggleGrid(); break;
      case 'KeyH': this.help(); break;
      case 'BracketLeft': this._toolOpt(-1); break;
      case 'BracketRight': this._toolOpt(1); break;
      case 'KeyV': this.views(); break;
      case 'KeyB': this.zoomBox(); break;
      case 'Escape': if (this._zb) this.zoomBox(false); else if (this.tool !== 'pan') this.setTool('pan'); else if (this.sel) this.unfocus(); else if (this.card.classList.contains('show')) this._later(); else if (this.bare) this.setBare(false); else this.close(); break;
      case 'KeyF': this.setBare(!this.bare); break;
      case 'ArrowRight': if (!this._slideKey(1)) this.focus(this._step(1).id); break;
      case 'ArrowLeft': if (!this._slideKey(-1)) this.focus(this._step(-1).id); break;
      case 'ArrowUp': case 'KeyZ': case 'PageUp': this.setLevel(this.level - 1); break;
      case 'ArrowDown': case 'KeyX': case 'PageDown': this.setLevel(this.level + 1); break;
      case 'Enter': case 'Space': case 'KeyE': if (top) top.click(); else if (this.sel) { const nb = this.card.querySelector('.next'); if (nb) nb.click(); } else { const p = this.parts().find(q => !this.found(q.id)) || this.parts()[0]; if (p) this.focus(p.id); } break;
      case 'KeyL': this.close(); break;
      case 'KeyC': this.compare(!this.cmp); break;
      case 'KeyD': this.freeze(); break;
      case 'KeyY': this.slow(); break;
      default: if (/^Digit[1-9]$/.test(e.code)) { const p = this.parts()[+e.code.slice(5) - 1]; if (p) this.focus(p.id); }
    }
  },
};
