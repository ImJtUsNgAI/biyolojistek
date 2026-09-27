'use strict';
// Sending progress to the teacher. When js/config.js holds the address of the teacher's Google Sheet (YAYINLAMA.md)
// and the student has joined a class with its code, the same report "Send to teacher" downloads is posted there now
// and then while playing. Only the nickname, the class code and a random id travel with it: no e-mail, no real name
// unless the student types one. Practice games from the teacher's picker are never sent.
const SYNC = {
  KEY: 'seedkeeper-class',
  last: 0, busy: false, dirty: false, state: 'idle', at: 0,
  url() { return (typeof CONFIG !== 'undefined' && CONFIG.syncUrl) || ''; },
  on() { return !!(this.url() && G.S && G.S.cls && G.S.sid && !G.demo); },
  code(s) { return String(s || '').toLocaleUpperCase('tr').replace(/İ/g, 'I').replace(/[^A-Z0-9-]/g, '').slice(0, 24); },
  // a ?sinif= link from the teacher: remembered in this browser so "Continue" and a new game both pick it up
  fromLink() {
    const c = this.code(new URLSearchParams(location.search).get('sinif'));
    if (c) try { localStorage.setItem(this.KEY, c); } catch (e) { }
    return c;
  },
  remembered() { try { return this.code(localStorage.getItem(this.KEY)); } catch (e) { return ''; } },
  newId() { const a = new Uint8Array(10); crypto.getRandomValues(a); return [...a].map(b => (b % 36).toString(36)).join(''); },
  // attach the class to the save that is open now (new game, continue, or the journal's "join" box)
  join(code) {
    const S = G.S, c = this.code(code);
    if (!S || G.demo || c.length < 3) return false;
    S.cls = c; S.sid = S.sid || this.newId();
    try { localStorage.setItem(this.KEY, c); } catch (e) { }
    G.save(); this.push();
    return true;
  },
  leave() { const S = G.S; if (!S) return; delete S.cls; this.state = 'idle'; G.save(); },
  // called when a game starts or loads: a class code from the link joins it straight away
  start() {
    const S = G.S; if (!S || G.demo) return;
    const c = this.fromLink();
    if (c && this.url() && c !== S.cls) this.join(c);
    else if (this.on()) { this.dirty = true; this.tick(); }
  },
  // the sheet keeps about 225 000 characters per student. Answers pile up all term (every retry adds one), so a very
  // long game sends only its most recent answers and says how many it left out, instead of being refused for ever
  LIMIT: 200000,
  payload() {
    const S = G.S, data = CURR.report(), body = () => JSON.stringify({ cls: S.cls, sid: S.sid, name: S.name || '', data });
    let s = body();
    const all = data.answers;
    for (let keep = all.length; s.length > this.LIMIT && keep > 0;) {
      keep = Math.floor(keep * 0.8);
      data.answers = all.slice(all.length - keep); data.trimmed = all.length - keep;
      s = body();
    }
    return s;
  },
  touch() { if (this.on()) this.dirty = true; },
  tick() { if (this.on() && this.dirty && !this.busy && Date.now() - this.last > 40000) this.push(); },
  async push() {
    if (!this.on() || this.busy) return false;
    this.busy = true; this.dirty = false; this.last = Date.now(); this.state = 'busy'; this.paint();
    let ok = false;
    try {
      // text/plain keeps it a "simple" request, so the browser sends it straight to Google without asking first
      const r = await fetch(this.url(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: this.payload() });
      ok = r.ok; try { const j = await r.json(); ok = !!j.ok; } catch (e) { }
    } catch (e) { ok = false; }
    this.busy = false; this.state = ok ? 'ok' : 'err';
    if (ok) this.at = Date.now(); else this.dirty = true;
    this.paint();
    return ok;
  },
  // leaving the page or switching tabs: hand the latest state to the browser to deliver
  flush() {
    if (!this.on() || !this.dirty || !navigator.sendBeacon) return;
    try { if (navigator.sendBeacon(this.url(), new Blob([this.payload()], { type: 'text/plain;charset=utf-8' }))) this.dirty = false; } catch (e) { }
  },
  init() {
    setInterval(() => this.tick(), 10000);
    addEventListener('pagehide', () => this.flush());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.flush(); });
  },
  label() {
    const S = G.S, e = U.esc;
    if (!S || !S.cls) return '';
    const when = this.at ? new Date(this.at).toLocaleTimeString(I18N.lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
    const st = { idle: tr('bekliyor', 'waiting'), busy: tr('gönderiliyor…', 'sending…'), ok: tr(`gönderildi ✓ ${when}`, `sent ✓ ${when}`), err: tr('internet yok, sonra yeniden denenecek', 'no connection, will try again later') }[this.state];
    return `${e(L(tr('Sınıf', 'Class')))} <b>${e(S.cls)}</b> · ${e(L(st))}`;
  },
  paint() { const el = document.querySelector('.sync-state'); if (el) el.innerHTML = this.label(); },
  // the journal's box: join a class with a code, or see that the teacher is getting the progress
  box() {
    const S = G.S, box = h('div', 'sync-box');
    const draw = () => {
      if (S.cls) {
        box.innerHTML = `<p class="sync-state">${this.label()}</p><p class="hint">${U.esc(L(tr('İlerlemen öğretmeninin tablosuna kendiliğinden gidiyor: cevapların, çözdüğün vakalar, oyun süren. Yalnızca takma adın görünür.', 'Your progress goes to your teacher’s sheet by itself: your answers, the cases you solved, your play time. Only your nickname is shown.')))}</p>
          <div class="sync-row"><button class="ghost now">${U.esc(L(tr('Şimdi gönder', 'Send now')))}</button><button class="ghost chg">${U.esc(L(tr('Sınıfı değiştir', 'Change class')))}</button></div>`;
        box.querySelector('.now').onclick = () => { AU.sfx('click'); this.push(); };
        box.querySelector('.chg').onclick = () => { AU.sfx('click'); this.leave(); draw(); };
      } else {
        box.innerHTML = `<p><b>${U.esc(L(tr('Öğretmenine bağlan', 'Connect to your teacher')))}</b></p><p class="hint">${U.esc(L(tr('Öğretmeninin verdiği sınıf kodunu yaz; ilerlemen ona kendiliğinden gitsin.', 'Type the class code your teacher gave you, and your progress will go to them by itself.')))}</p>
          <div class="sync-row">${S.name ? '' : `<input class="nm" maxlength="16" autocomplete="off" spellcheck="false" placeholder="${U.esc(L(tr('takma ad', 'nickname')))}">`}<input class="cls" maxlength="24" autocomplete="off" spellcheck="false" placeholder="10A-K7P2" value="${U.esc(this.remembered())}"><button class="yes join">${U.esc(L(tr('Bağlan', 'Connect')))}</button></div>`;
        const inp = box.querySelector('input.cls'), nm = box.querySelector('input.nm');
        const go = () => {
          if (nm && !nm.value.trim()) { AU.sfx('wrong'); nm.focus(); return; }
          if (nm) S.name = nm.value.trim().slice(0, 16);
          if (this.join(inp.value)) { AU.sfx('stamp'); draw(); } else { AU.sfx('wrong'); inp.focus(); }
        };
        if (nm) { nm.onkeydown = ev => ev.stopPropagation(); nm.onkeyup = ev => ev.stopPropagation(); }
        box.querySelector('.join').onclick = go;
        inp.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Enter') go(); };
        inp.onkeyup = ev => ev.stopPropagation();
      }
    };
    draw();
    return box;
  },
};
SYNC.init();
