import {
  PACKS, SECTORS, TYPES, VAT_RATE, byId, img, offers, bedOptions, priceOf,
  line, plural, livingFor, contentsFor, piecesFor, basePieces, catalogue, changesOf, money, money2,
} from './data.js';
import { createHero } from './hero-gl.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const two = (n) => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const icon = (id) => `<svg class="ico" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const sizeLabel = (type, beds) => `${beds}-bedroom ${TYPES[type].noun}`;
const shortSize = (type, beds) => `${beds}-bed ${TYPES[type].noun}`;
document.documentElement.classList.add('js');

// Every visit opens on the drawing, not wherever the last visit stopped.
if ('scrollRestoration' in history && !location.hash) {
  history.scrollRestoration = 'manual';
  scrollTo(0, 0);
}

const state = { pack: PACKS[0].id, beds: 1 };
const anyDialogOpen = () => $$('dialog').some((d) => d.open);

/* ================================================================== */
/* Smooth scroll (Lenis) with a plain fallback                         */

let lenis = null;
if (window.Lenis && !reduceMotion) {
  lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  const raf = (t) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}
// Short hops glide. Long jumps (the nav, "Send my quote") fade softly through the page colour and
// land straight on the section, instead of dragging the visitor through everything in between.
const veil = document.createElement('div');
veil.className = 'veil';
veil.setAttribute('aria-hidden', 'true');
document.body.append(veil);
function scrollToEl(el, offset = -84) {
  if (!el) return;
  // A pinned section can ask to be landed part-way through, where its content has settled (the steps of
  // "How it works", all in view), rather than at its top.
  const yOf = () => el.getBoundingClientRect().top + scrollY + (el.dataset.landAt && el.classList.contains('is-pinned')
    ? (el.offsetHeight - innerHeight) * Number(el.dataset.landAt)
    : offset);
  const target = yOf();
  if (Math.abs(target - scrollY) > innerHeight * 1.5 && !reduceMotion) {
    veil.classList.add('is-on');
    setTimeout(() => {
      // Measure again at the moment of the jump: images and the pinned section can change the page height.
      lenis?.resize?.();
      const y = yOf();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else scrollTo(0, y);
      requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.remove('is-on')));
    }, 240);
    return;
  }
  if (lenis) lenis.scrollTo(target, { duration: 1.1 });
  else scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href').length < 2) return;
  const el = document.getElementById(a.getAttribute('href').slice(1));
  if (!el) return;
  e.preventDefault();
  scrollToEl(el, el.id === 'top' ? 0 : -84);
});

/* ================================================================== */
/* No loading screen: the first room shows at once, its photo underneath until the renderer draws */

let heroReady = false;
/* ================================================================== */
/* Hero: the pack's room as a live drawing, inked in by the cursor     */

const hero = $('#top');
const heroUI = $('.hero-ui', hero);
const heroName = $('#hero-name');
const heroCanvas = $('#hero-gl');
const heroFallback = $('#hero-fallback');
let gl = null;
try {
  gl = createHero(heroCanvas, { reduceMotion });
  // has-gl is set once the first room has been drawn, so the backup photo covers the wait.
} catch (err) {
  console.error(err);
  gl = null;
}

$('#hero-packs').innerHTML = '<span class="pk-glide" aria-hidden="true"></span>' + PACKS.map((pk, i) => `<button class="pk" type="button" data-pack="${pk.id}" aria-current="false"><small>${two(i + 1)}</small>${pk.name}<span class="pk-progress" aria-hidden="true"></span></button>`).join('');
const pkButtons = $$('#hero-packs .pk');
const glide = $('#hero-packs .pk-glide');
function placeGlide(btn) {
  if (!btn) return;
  glide.style.setProperty('--x', `${btn.offsetLeft}px`);
  glide.style.setProperty('--w', `${btn.offsetWidth}px`);
}
addEventListener('resize', () => placeGlide($('#hero-packs [aria-current="true"]')));
document.fonts?.ready.then(() => placeGlide($('#hero-packs [aria-current="true"]')));

function setName(text, animate) {
  const html = [...text].map((ch, i) => `<i style="--i:${i}">${esc(ch)}</i>`).join('');
  heroName.setAttribute('aria-label', text);
  if (!animate || reduceMotion) {
    heroName.innerHTML = html;
    return;
  }
  heroName.classList.add('is-leaving');
  setTimeout(() => {
    heroName.classList.remove('is-leaving');
    heroName.classList.add('is-entering');
    heroName.innerHTML = html;
    void heroName.offsetWidth;
    heroName.classList.remove('is-entering');
  }, 520);
}

function setPack(id, { animate = true } = {}) {
  const pk = byId[id];
  const changed = state.pack !== id;
  state.pack = id;
  const opts = bedOptions(pk, 'apartment');
  if (!opts.includes(state.beds)) state.beds = opts[opts.length - 1];
  if (changed || !heroName.textContent) setName(pk.name, animate && changed);
  const peek = $('.hero-peek');
  const fill = () => {
    $('#hero-peek-name').textContent = pk.name;
    $('#hero-tone').textContent = pk.tone;
    $('#hero-line').textContent = pk.line;
    peek.classList.remove('is-swapping');
  };
  if (animate && changed && !reduceMotion) {
    peek.classList.add('is-swapping');
    setTimeout(fill, 420);
  } else fill();
  pkButtons.forEach((b) => b.setAttribute('aria-current', String(b.dataset.pack === id)));
  // The white pill glides to the chosen name; the row scrolls it into view, never the page.
  const bar = $('#hero-packs');
  const btn = $(`#hero-packs [data-pack="${id}"]`);
  placeGlide(btn);
  if (btn && bar.scrollWidth > bar.clientWidth) {
    bar.scrollTo({ left: btn.offsetLeft - bar.clientWidth / 2 + btn.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  heroFallback.src = img(pk.hero);
  gl?.setImage(img(pk.hero)).then(() => { heroReady = true; hero.classList.add('has-gl'); }, () => (heroReady = true));
  if (!gl) heroReady = true;
  restartProgress();
}

const step = (d) => {
  const i = PACKS.findIndex((pk) => pk.id === state.pack);
  setPack(PACKS[(i + d + PACKS.length) % PACKS.length].id);
};
$('#hero-prev').addEventListener('click', () => { stopCycle(); step(-1); });
$('#hero-next').addEventListener('click', () => { stopCycle(); step(1); });
$('#hero-packs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-pack]');
  if (!b) return;
  stopCycle();
  setPack(b.dataset.pack);
});
const originOf = (e) => ({ x: e.clientX || innerWidth / 2, y: e.clientY || innerHeight / 2 });
$('#hero-explore').addEventListener('click', (e) => openSheet(state.pack, { origin: originOf(e) }));

// Auto-advance until someone takes over; it pauses while they play with the ink.
const CYCLE_MS = 9000;
let cycleTimer = 0;
let cycleStopped = reduceMotion;
let cycleHeld = false;
function restartProgress() {
  hero.classList.remove('is-cycling');
  if (cycleStopped || cycleHeld) return;
  void hero.offsetWidth;
  hero.classList.add('is-cycling');
  clearTimeout(cycleTimer);
  // Only advances while someone can actually see the hero.
  cycleTimer = setTimeout(() => (!document.hidden && !anyDialogOpen() && heroVisible ? step(1) : restartProgress()), CYCLE_MS);
}
function stopCycle() {
  cycleStopped = true;
  clearTimeout(cycleTimer);
  hero.classList.remove('is-cycling');
}
function holdCycle(on) {
  if (cycleStopped || cycleHeld === on) return;
  cycleHeld = on;
  if (on) {
    clearTimeout(cycleTimer);
    hero.classList.remove('is-cycling');
  } else restartProgress();
}
hero.style.setProperty('--cycle', `${CYCLE_MS}ms`);

// Pointer: the ink follows the cursor and dries behind it.
const rel = (e) => {
  const r = hero.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
};
hero.addEventListener('pointermove', (e) => {
  const p = rel(e);
  gl?.move(p.x, p.y);
  if (e.pointerType === 'mouse') holdCycle(true);
});
hero.addEventListener('pointerleave', () => {
  gl?.leave();
  holdCycle(false);
});
hero.addEventListener('pointerup', (e) => {
  if (e.pointerType !== 'mouse') gl?.leave();
});

// Touch: swipe sideways to change pack.
let swipe = null;
hero.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse') swipe = { x: e.clientX, y: e.clientY };
});
hero.addEventListener('pointerup', (e) => {
  if (!swipe) return;
  const dx = e.clientX - swipe.x;
  const dy = e.clientY - swipe.y;
  swipe = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    stopCycle();
    step(dx < 0 ? 1 : -1);
  }
});

// Keyboard: arrows change pack while the hero is on screen.
let heroVisible = true;
addEventListener('keydown', (e) => {
  if (!heroVisible || hero.classList.contains('is-away') || anyDialogOpen() || e.target.closest('input, textarea, select, [contenteditable]')) return;
  if (e.key === 'ArrowRight') { stopCycle(); step(1); }
  if (e.key === 'ArrowLeft') { stopCycle(); step(-1); }
});
new IntersectionObserver(([en]) => {
  heroVisible = en.intersectionRatio > 0.4;
  gl?.setRunning(en.isIntersecting && !document.hidden);
}, { threshold: [0, 0.4] }).observe(hero);
document.addEventListener('visibilitychange', () => gl?.setRunning(!document.hidden && hero.getBoundingClientRect().bottom > 0));
addEventListener('resize', () => gl?.resize());

/* Magnetic buttons: they lean toward the pointer */
if (fineHover && !reduceMotion) {
  for (const el of $$('.magnetic')) {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate3d(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px, 0)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  }
}

/* ================================================================== */
/* Pack sheet: price by size, contents, both rooms and the full view   */

const sheet = $('#sheet');
const cardsEl = $('#cards');
const sheetState = { pack: null, beds: 1, type: 'apartment', qty: 1 };

function openSheet(id, { beds, type = 'apartment', qty = 1, origin } = {}) {
  stopCycle();
  // The panel ripples open from wherever it was asked for.
  const o = origin || { x: innerWidth / 2, y: innerHeight / 2 };
  const panel = $('.sheet-panel', sheet);
  panel.style.setProperty('--ox', `${o.x - 14}px`);
  panel.style.setProperty('--oy', `${o.y - 14}px`);
  const pk = byId[id];
  sheetState.pack = id;
  sheetState.type = offers(pk, type) ? type : 'apartment';
  sheetState.qty = qty;
  const opts = bedOptions(pk, sheetState.type);
  sheetState.beds = beds && opts.includes(beds) ? beds : opts.includes(sheetState.beds) ? sheetState.beds : opts[0];
  $('#sheet-count').textContent = `${two(PACKS.indexOf(pk) + 1)} / ${two(PACKS.length)}`;
  $('#sheet-tone').textContent = pk.tone;
  $('#sheet-name').textContent = pk.name;
  $('#sheet-line').textContent = pk.line;
  const alts = [];
  if (pk.prices.hmo) alts.push(`HMOs (4 to 6 bedrooms) from ${money(Math.min(...Object.values(pk.prices.hmo)))}`);
  if (pk.prices.serviced) alts.push(`serviced lets from ${money(Math.min(...Object.values(pk.prices.serviced)))}`);
  $('#sheet-alt').textContent = sheetState.type === 'apartment' && alts.length ? `Also priced for ${alts.join(' and ')}.` : '';
  $('#sheet-beds').innerHTML = opts.map((n) => `<button type="button" data-beds="${n}" aria-pressed="${n === sheetState.beds}">${n}</button>`).join('');
  renderSheetPrice();
  renderCards(pk);
  [...$$('.sheet-info > *', sheet), ...$$('.card', cardsEl)].forEach((el, i) => el.style.setProperty('--d', i));
  sheet.classList.remove('is-closing');
  if (!sheet.open) sheet.showModal();
  panel.scrollTop = 0;
  lenis?.stop();
}

let closing = 0;
function closeSheet(then) {
  if (!sheet.open || closing) return;
  if (reduceMotion) {
    sheet.close();
    then?.();
    return;
  }
  sheet.classList.add('is-closing');
  closing = setTimeout(() => {
    closing = 0;
    sheet.close();
    sheet.classList.remove('is-closing');
    then?.();
  }, 560);
}

function renderSheetPrice() {
  const pk = byId[sheetState.pack];
  const b = sheetState.beds;
  const { type, qty } = sheetState;
  const unit = priceOf(pk, type, b);
  // Opened from the pricing sentence, the sheet keeps its sector and quantity, so the figures match.
  $('#sheet-amt').textContent = money(unit * qty);
  $('#sheet-unit').textContent = qty > 1
    ? `ex VAT, for ${qty} × ${sizeLabel(type, b)}s at ${money(unit)} each. Delivery, assembly and packaging removal included.`
    : `ex VAT, for a ${sizeLabel(type, b)}. Delivery, assembly and packaging removal included.`;
  setAddBtn($('#sheet-add'), inQuote(pk.id, type, b), qty > 1 ? `Add ${qty} to quote` : 'Add to quote');
  $('#sheet-contents').innerHTML = contentsFor(pk, type, b)
    .map((g) => `<div><h3>${esc(g.label)}</h3><ul>${g.items.map((it) => `<li>${esc(line(it))}</li>`).join('')}</ul></div>`).join('');
  const kicker = $('[data-room="bedroom"] .card-kicker', cardsEl);
  if (kicker) kicker.textContent = b > 1 ? `Bedroom · × ${b}` : 'Bedroom';
  const living = $('[data-room="living"] .card-items', cardsEl);
  if (living) living.textContent = livingText(pk, b);
}

$('#sheet-beds').addEventListener('click', (e) => {
  const b = e.target.closest('[data-beds]');
  if (!b) return;
  sheetState.beds = Number(b.dataset.beds);
  $$('button', e.currentTarget).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderSheetPrice();
});
$('#sheet-add').addEventListener('click', (e) => {
  if (e.currentTarget.classList.contains('is-added')) return closeSheet(() => setTimeout(() => scrollToEl($('#quote')), 40));
  addLine({ pack: sheetState.pack, type: sheetState.type, beds: sheetState.beds, qty: sheetState.qty });
  renderSheetPrice();
});
$('#sheet-quote').addEventListener('click', () => {
  if (!inQuote(sheetState.pack, sheetState.type, sheetState.beds)) addLine({ pack: sheetState.pack, type: sheetState.type, beds: sheetState.beds, qty: sheetState.qty }, { quiet: true });
  closeSheet(() => setTimeout(() => scrollToEl($('#quote')), 40));
});
$('#sheet-close').addEventListener('click', () => closeSheet());
sheet.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeSheet();
});
sheet.addEventListener('close', () => lenis?.start());
sheet.addEventListener('click', (e) => {
  if (e.target === sheet) closeSheet();
});

// HMO packs furnish the bedrooms only, so the living-room card says so rather than listing pieces.
const livingText = (pk, b) => (sheetState.type === 'hmo' ? 'Not part of HMO packs, which furnish every bedroom.' : livingFor(pk, b).map(line).join(', '));

function cardHTML(pk, roomKey) {
  const slides = pk.gallery[roomKey];
  const isBed = roomKey === 'bedroom';
  const b = sheetState.beds;
  const items = isBed ? pk.bed : null;
  return `
  <article class="card" data-room="${roomKey}">
    <div class="shell"><div class="core">
      <header class="card-head">
        <p class="card-kicker">${isBed ? (b > 1 ? `Bedroom · × ${b}` : 'Bedroom') : 'Living and dining'}</p>
        <h3 class="card-title">${isBed ? 'The bedroom' : 'Living and dining'}</h3>
        <p class="card-items">${esc(items ? items.map(line).join(', ') : livingText(pk, b))}</p>
      </header>
      <button class="icon-btn card-expand" type="button" data-expand="${roomKey}" aria-label="See every ${isBed ? 'bedroom' : 'living room'} photo">${icon('plus')}</button>
      <div class="card-media">
        <div class="slides" tabindex="0" aria-label="${pk.name} ${isBed ? 'bedroom' : 'living room'} photos">
          ${slides.map((s, i) => `<figure class="slide${s.kind === 'piece' ? ' is-piece' : ''}"><img src="${img(s.src, 1100)}" alt="${esc(s.alt)}" ${i ? 'loading="lazy"' : ''} decoding="async"></figure>`).join('')}
        </div>
        <div class="media-nav">
          <button class="icon-btn" type="button" data-step="-1" aria-label="Previous photo">${icon('left')}</button>
          <button class="icon-btn" type="button" data-step="1" aria-label="Next photo">${icon('right')}</button>
        </div>
      </div>
      <footer class="card-foot"><span class="card-cap">${esc(slides[0].kind === 'piece' ? slides[0].name : 'Room photo')}</span><span class="num"><span data-i>1</span> / ${slides.length}</span></footer>
    </div></div>
  </article>`;
}

function renderCards(pk) {
  cardsEl.innerHTML = cardHTML(pk, 'bedroom') + cardHTML(pk, 'living');
  for (const card of $$('.card', cardsEl)) {
    const slidesEl = $('.slides', card);
    const list = pk.gallery[card.dataset.room];
    let queued = false;
    slidesEl.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const i = clamp(Math.round(slidesEl.scrollLeft / slidesEl.clientWidth), 0, list.length - 1);
        $('[data-i]', card).textContent = i + 1;
        $('.card-cap', card).textContent = list[i].kind === 'piece' ? list[i].name : 'Room photo';
      });
    }, { passive: true });
  }
}

cardsEl.addEventListener('click', (e) => {
  const stepBtn = e.target.closest('[data-step]');
  if (stepBtn) {
    const slidesEl = $('.slides', stepBtn.closest('.card'));
    const w = slidesEl.clientWidth;
    const n = slidesEl.children.length;
    const i = Math.round(slidesEl.scrollLeft / w);
    slidesEl.scrollTo({ left: ((i + Number(stepBtn.dataset.step) + n) % n) * w, behavior: reduceMotion ? 'auto' : 'smooth' });
    return;
  }
  const ex = e.target.closest('[data-expand]');
  if (ex) {
    const slidesEl = $('.slides', ex.closest('.card'));
    openViewer(sheetState.pack, ex.dataset.expand, Math.round(slidesEl.scrollLeft / slidesEl.clientWidth));
  }
});


/* ================================================================== */
/* Who it's for, then one pack at a time: living room, pack, bedroom   */

const WHO = { letting: 'Homes to let', hmo: 'HMOs', serviced: 'Serviced apartments', student: 'Student lets', social: 'Social and supported housing' };
const NOUN = { letting: 'home to let', hmo: 'HMO', serviced: 'serviced apartment', student: 'student let', social: 'social or supported home' };

const show = { sector: SECTORS[0].id, order: [], i: 0, beds: 1 };
const stage = $('#show');
const showName = $('#show-name');
const doors = $$('.door', stage);
$$('.door-hint', stage).forEach((p) => (p.textContent = fineHover ? 'Click to see every photo' : 'Tap again to see every photo'));

// Inside the pack section: who it's for is a word in the price line, every pack in that category along the bottom.
const CAT = { letting: 'Homes to let', hmo: 'HMOs', serviced: 'Serviced', student: 'Student', social: 'Social housing' };
const whoBtn = $('#show-who');
const whoMenu = $('#show-who-menu');
const pidx = $('#pidx');
whoMenu.innerHTML = SECTORS.map((s) => {
  const from = Math.min(...s.packs.map((id) => Math.min(...bedOptions(byId[id], s.type).map((n) => priceOf(byId[id], s.type, n)))));
  return `<button type="button" role="menuitemradio" aria-checked="false" data-sector="${s.id}"><b>${esc(CAT[s.id])}</b><small>${s.packs.length} packs from ${money(from)}</small>${icon('check')}</button>`;
}).join('');
// The list floats above every section (it lives at the end of the page), so no edge can clip it and no
// section can cover it; it stays attached to its word as the page moves.
document.body.append(whoMenu);
function placeWhoMenu() {
  const b = whoBtn.getBoundingClientRect();
  const w = whoMenu.offsetWidth;
  const h = whoMenu.offsetHeight;
  let top = b.bottom + 10;
  if (top + h > innerHeight - 16 && b.top - h - 10 > 16) top = b.top - h - 10;
  whoMenu.style.left = `${clamp(b.left + b.width / 2 - w / 2, 16, innerWidth - w - 16)}px`;
  whoMenu.style.top = `${top}px`;
}
function setWhoMenu(open) {
  whoMenu.hidden = !open;
  whoBtn.setAttribute('aria-expanded', String(open));
  // On phones the call-and-quote bar steps aside while the list is open, so it never covers a choice.
  if (open) mbarState.hidden.add(whoMenu); else mbarState.hidden.delete(whoMenu);
  syncBar();
  if (!open) return;
  placeWhoMenu();
  ($('[aria-checked="true"]', whoMenu) || $('button', whoMenu)).focus({ preventScroll: true });
}
let whoRaf = 0;
const followWho = () => { if (!whoMenu.hidden && !whoRaf) whoRaf = requestAnimationFrame(() => { whoRaf = 0; placeWhoMenu(); }); };
addEventListener('scroll', followWho, { passive: true });
addEventListener('resize', followWho);
whoBtn.addEventListener('click', () => setWhoMenu(whoMenu.hidden));
whoMenu.addEventListener('click', (e) => {
  const b = e.target.closest('[data-sector]');
  if (!b) return;
  setWhoMenu(false);
  whoBtn.focus({ preventScroll: true });
  if (b.dataset.sector !== show.sector) setWho(b.dataset.sector);
});
whoMenu.addEventListener('keydown', (e) => {
  const items = $$('button', whoMenu);
  const i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  }
  if (e.key === 'Escape' || e.key === 'Tab') { setWhoMenu(false); if (e.key === 'Escape') whoBtn.focus(); }
});
document.addEventListener('pointerdown', (e) => { if (!whoMenu.hidden && !e.target.closest('.who') && !whoMenu.contains(e.target)) setWhoMenu(false); });
// The underline draws itself once, when the word first reaches the middle of the screen.
new IntersectionObserver(([en], ob) => {
  if (!en.isIntersecting) return;
  whoBtn.closest('.who').classList.add('is-cued');
  ob.disconnect();
}, { rootMargin: '-30% 0px -30% 0px' }).observe(whoBtn);

// A pill glides to the chosen button; the row scrolls it into view, never the page.
function glideTo(track, btn) {
  const g = $('.glide', track);
  if (!g || !btn) return;
  g.style.setProperty('--x', `${btn.offsetLeft}px`);
  g.style.setProperty('--w', `${btn.offsetWidth}px`);
  if (track.scrollWidth > track.clientWidth + 1) {
    track.scrollTo({ left: btn.offsetLeft - track.clientWidth / 2 + btn.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}
const reglide = () => glideTo(pidx, $('[aria-pressed="true"]', pidx));
addEventListener('resize', reglide);
document.fonts?.ready.then(reglide);

function sectorOf() { return SECTORS.find((s) => s.id === show.sector); }
const lowest = (pk, type) => Math.min(...bedOptions(pk, type).map((n) => priceOf(pk, type, n)));
const roomPhoto = (pk, room) => (pk.gallery[room].find((s) => s.kind === 'room') || pk.gallery[room][0]).src;

// Packs run from the lowest starting price, so the arrows walk up the range.
function setWho(id, { animate = true } = {}) {
  show.sector = id;
  const sector = sectorOf();
  const current = show.order[show.i];
  show.order = sector.packs.map((p) => byId[p]).sort((a, b) => lowest(a, sector.type) - lowest(b, sector.type) || PACKS.indexOf(a) - PACKS.indexOf(b)).map((pk) => pk.id);
  const keep = show.order.indexOf(current);
  show.i = keep >= 0 ? keep : Math.max(0, show.order.indexOf(sector.highlight));
  $$('button', whoMenu).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.sector === id)));
  whoBtn.setAttribute('aria-label', `${NOUN[id]}: change who you're furnishing for`);
  pidx.innerHTML = '<span class="glide" aria-hidden="true"></span>' + show.order.map((pid, i) => {
    const pk = byId[pid];
    return `<button type="button" data-i="${i}" aria-pressed="false"><img src="${img(pk.hero, 100)}" alt="" loading="lazy" decoding="async"><span><b>${pk.name}</b><small></small></span></button>`;
  }).join('');
  renderShow({ dir: animate && keep < 0 ? 1 : 0 });
}

let nameTimer = 0;
function slideName(text, animate) {
  const html = [...text].map((ch, i) => `<i style="--i:${i}">${esc(ch)}</i>`).join('');
  clearTimeout(nameTimer);
  showName.setAttribute('aria-label', text);
  if (!animate || reduceMotion) {
    showName.innerHTML = html;
    return;
  }
  showName.classList.add('is-leaving');
  nameTimer = setTimeout(() => {
    showName.classList.replace('is-leaving', 'is-entering');
    showName.innerHTML = html;
    void showName.offsetWidth;
    showName.classList.remove('is-entering');
  }, 460);
}

function fillDoor(door, pk, type, animate) {
  const room = door.dataset.room;
  const im = $('img', door);
  const src = img(roomPhoto(pk, room), 1000);
  if (im.getAttribute('src') !== src) {
    const swap = () => {
      im.src = src;
      const done = () => door.classList.remove('is-swapping');
      if (im.complete) done();
      else { im.onload = done; im.onerror = done; }
    };
    if (animate && !reduceMotion && im.getAttribute('src')) {
      door.classList.add('is-swapping');
      setTimeout(swap, 380);
    } else swap();
  }
  im.alt = `The ${pk.name} ${room === 'living' ? 'living room' : 'bedroom'}`;
  const [bedroom] = contentsFor(pk, type, show.beds);
  const items = room === 'bedroom' ? bedroom.items.map(line) : type === 'hmo' ? ['Not part of HMO packs, which furnish every bedroom'] : livingFor(pk, show.beds).map(line);
  $('h3', door).textContent = room === 'bedroom' ? (show.beds > 1 ? `Each of ${show.beds} bedrooms` : 'The bedroom') : 'Living and dining';
  $('ul', door).innerHTML = items.map((t, i) => `<li style="--i:${i}">${esc(t)}</li>`).join('');
}

function renderShow({ dir = 0 } = {}) {
  const sector = sectorOf();
  const type = sector.type;
  const pk = byId[show.order[show.i]];
  const opts = bedOptions(pk, type);
  if (!opts.includes(show.beds)) show.beds = opts.reduce((a, b) => (Math.abs(b - show.beds) < Math.abs(a - show.beds) ? b : a));
  const changed = stage.dataset.pack !== pk.id;
  stage.dataset.pack = pk.id;
  if (changed) slideName(pk.name, Boolean(dir));
  $('#show-tone').textContent = pk.tone;
  // The strip shows every pack's price at this size (or its lowest, where it doesn't come in this size).
  $$('button', pidx).forEach((b) => {
    const p = byId[show.order[Number(b.dataset.i)]];
    const on = Number(b.dataset.i) === show.i;
    const at = priceOf(p, type, show.beds);
    $('small', b).textContent = at != null ? money(at) : `from ${money(lowest(p, type))}`;
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', `${p.name}, ${$('small', b).textContent}`);
  });
  glideTo(pidx, $(`[data-i="${show.i}"]`, pidx));
  $('#show-price').textContent = money(priceOf(pk, type, show.beds));
  $('#show-noun').textContent = NOUN[show.sector];
  $('#bed-n').textContent = show.beds;
  $('#bed-minus').disabled = show.beds <= opts[0];
  $('#bed-plus').disabled = show.beds >= opts[opts.length - 1];
  doors.forEach((d) => fillDoor(d, pk, type, changed && Boolean(dir)));
  document.dispatchEvent(new Event('fp:change'));
}

const stepShow = (d) => {
  show.i = (show.i + d + show.order.length) % show.order.length;
  renderShow({ dir: d });
};
const stepBeds = (d) => {
  const opts = bedOptions(byId[show.order[show.i]], sectorOf().type);
  show.beds = opts[clamp(opts.indexOf(show.beds) + d, 0, opts.length - 1)];
  renderShow();
};

pidx.addEventListener('click', (e) => {
  const b = e.target.closest('[data-i]');
  if (!b || Number(b.dataset.i) === show.i) return;
  const to = Number(b.dataset.i);
  const d = Math.sign(to - show.i);
  show.i = to;
  renderShow({ dir: d });
});
$('#show-prev').addEventListener('click', () => stepShow(-1));
$('#show-next').addEventListener('click', () => stepShow(1));
$('#bed-minus').addEventListener('click', () => stepBeds(-1));
$('#bed-plus').addEventListener('click', () => stepBeds(1));
$('#show-explore').addEventListener('click', (e) => openSheet(show.order[show.i], { type: sectorOf().type, beds: show.beds, origin: originOf(e) }));
$('#show-add').addEventListener('click', (e) => {
  if (e.currentTarget.classList.contains('is-added')) return scrollToEl($('#quote'));
  addLine({ pack: show.order[show.i], type: sectorOf().type, beds: show.beds, qty: 1 });
});

// A swipe across the pack moves to the next one on touch screens.
let packSwipe = null;
const centre = $('#show-centre');
centre.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') packSwipe = { x: e.clientX, y: e.clientY }; });
centre.addEventListener('pointerup', (e) => {
  if (!packSwipe) return;
  const dx = e.clientX - packSwipe.x;
  const dy = e.clientY - packSwipe.y;
  packSwipe = null;
  // Only a clearly sideways swipe changes pack; scrolling the page up or down never does.
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) stepShow(dx < 0 ? 1 : -1);
});
centre.addEventListener('pointercancel', () => (packSwipe = null));

// Doors: hovering opens one wide with its contents; a click then shows every photo of that room.
// On touch, the first tap opens the door and the second shows the photos.
function openDoor(room) {
  stage.classList.toggle('is-living', room === 'living');
  stage.classList.toggle('is-bedroom', room === 'bedroom');
  doors.forEach((d) => {
    const on = d.dataset.room === room;
    d.classList.toggle('is-open', on);
    $('.door-hit', d).setAttribute('aria-expanded', String(on));
  });
}
doors.forEach((d) => {
  const hit = $('.door-hit', d);
  d.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') openDoor(d.dataset.room); });
  d.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') openDoor(null); });
  hit.addEventListener('focus', () => openDoor(d.dataset.room));
  hit.addEventListener('blur', () => { if (!d.matches(':hover')) openDoor(null); });
  hit.addEventListener('click', () => {
    if (!d.classList.contains('is-open')) openDoor(d.dataset.room);
    else openViewer(show.order[show.i], d.dataset.room, 0);
  });
});
document.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' && !e.target.closest('.door')) openDoor(null); });

setWho(show.sector, { animate: false });

/* ================================================================== */
/* How it works: the customer's own order, step by step                */

const journey = $('#how');
const jrSteps = $$('.jstep', journey);
const jrDays = $('#jr-days');
const jrDate = $('#deliv-week');
// `reached` is the furthest step the customer has been sent to, so each step hands on to the next in turn.
const jr = { day: '', done: [], reached: 0 };
const fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const fmtMonth = new Intl.DateTimeFormat('en-GB', { month: 'short' });
const fmtLong = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayOf = (s) => new Date(`${s}T12:00:00`);

// The earliest day is 48 hours away, as the site promises; the quote confirms the actual date.
const firstDay = new Date();
firstDay.setHours(12, 0, 0, 0);
firstDay.setDate(firstDay.getDate() + 2);
const lastDay = new Date(firstDay);
lastDay.setFullYear(lastDay.getFullYear() + 1);
// Deliveries are booked by the week. Each choice is a week, named by its Monday ("w/c 19 Oct");
// the earliest is the week holding the first day we can deliver.
const mondayOf = (d) => {
  const m = new Date(d);
  m.setHours(12, 0, 0, 0);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
};
const firstWeek = mondayOf(firstDay);
const stripDays = Array.from({ length: 10 }, (_, i) => {
  const d = new Date(firstWeek);
  d.setDate(firstWeek.getDate() + i * 7);
  return isoDay(d);
});
const fmtWeek = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' });
const dayChip = (s) => {
  const d = dayOf(s);
  return `<button class="jr-day" type="button" role="radio" aria-checked="false" data-day="${s}" aria-label="Week commencing ${fmtLong.format(d)}"><small>w/c</small><b>${d.getDate()}</b><small>${fmtMonth.format(d)}</small></button>`;
};
// Ten weeks to tap. A week picked from the calendar joins the end of the row, so the choice is always visible.
function renderDays() {
  const extra = jr.day && !stripDays.includes(jr.day) ? jr.day : '';
  if (jrDays.dataset.extra === extra && jrDays.children.length) return;
  jrDays.dataset.extra = extra;
  jrDays.innerHTML = stripDays.map(dayChip).join('') + (extra ? dayChip(extra) : '');
}
const minDay = isoDay(firstWeek);
const maxDay = isoDay(lastDay);
// The quote's own week list: every week we can deliver, a year ahead, the year named once it changes.
const fmtWeekYear = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const weekName = (d) => (d.getFullYear() === firstWeek.getFullYear() ? fmtWeek : fmtWeekYear).format(d);
const longYear = (d) => `${fmtLong.format(d)} ${d.getFullYear()}`;
{
  const opts = ['<option value="">To be agreed</option>'];
  for (let d = new Date(firstWeek); isoDay(d) <= maxDay; d.setDate(d.getDate() + 7)) {
    opts.push(`<option value="${isoDay(d)}">w/c ${weekName(d)}</option>`);
  }
  jrDate.innerHTML = opts.join('');
}
renderDays();

// The three dots in the card's corner expand it into a month calendar where each row is a week:
// tap anywhere on a row to choose that week. Choosing folds it away again.
const cal = { open: false, y: firstDay.getFullYear(), m: firstDay.getMonth() };
const jrCal = $('#jr-cal');
const jrCalBtn = $('#jr-cal-btn');
const fmtMonthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
function renderCal() {
  jrCal.hidden = !cal.open;
  jrDays.hidden = cal.open;
  jrCalBtn.setAttribute('aria-expanded', String(cal.open));
  jrCalBtn.setAttribute('aria-label', cal.open ? 'Close the calendar' : 'More weeks: open the calendar');
  if (!cal.open) return;
  const first = new Date(cal.y, cal.m, 1, 12);
  const last = new Date(cal.y, cal.m + 1, 0, 12);
  const rows = [];
  for (let mon = mondayOf(first); mon <= last; mon = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 7, 12)) {
    const s = isoDay(mon);
    const off = s < minDay || s > maxDay;
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i, 12);
      return `<span${d.getMonth() !== cal.m ? ' class="is-out"' : ''}>${d.getDate()}</span>`;
    }).join('');
    rows.push(`<button type="button" class="jr-cal-row" data-cal-day="${s}" aria-pressed="${s === jr.day}" aria-label="Week commencing ${fmtLong.format(mon)}"${off ? ' disabled' : ''}>${days}</button>`);
  }
  const atStart = cal.y === firstDay.getFullYear() && cal.m === firstDay.getMonth();
  const atEnd = cal.y === lastDay.getFullYear() && cal.m === lastDay.getMonth();
  jrCal.innerHTML = `
    <div class="jr-cal-head">
      <button type="button" data-cal-step="-1" aria-label="Previous month"${atStart ? ' disabled' : ''}>${icon('left')}</button>
      <b aria-live="polite">${fmtMonthYear.format(first)}</b>
      <button type="button" data-cal-step="1" aria-label="Next month"${atEnd ? ' disabled' : ''}>${icon('right')}</button>
    </div>
    <div class="jr-cal-week" aria-hidden="true">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w) => `<span>${w}</span>`).join('')}</div>
    <div class="jr-cal-rows">${rows.join('')}</div>`;
}
jrCalBtn.addEventListener('click', () => {
  cal.open = !cal.open;
  if (cal.open) {
    const at = jr.day ? dayOf(jr.day) : firstDay;
    cal.y = at.getFullYear();
    cal.m = at.getMonth();
  }
  renderCal();
});
jrCal.addEventListener('click', (e) => {
  const step = e.target.closest('[data-cal-step]');
  if (step) {
    const d = new Date(cal.y, cal.m + Number(step.dataset.calStep), 1);
    cal.y = d.getFullYear();
    cal.m = d.getMonth();
    renderCal();
    $(`[data-cal-step="${step.dataset.calStep}"]`, jrCal)?.focus();
    return;
  }
  const b = e.target.closest('[data-cal-day]');
  if (!b) return;
  cal.open = false;
  pickDay(b.dataset.calDay);
  renderCal();
  jrCalBtn.focus();
});

function swapImg(im, src, holder = im) {
  if (im.getAttribute('src') === src) return;
  if (reduceMotion) { im.src = src; return; }
  holder.classList.add('is-swapping');
  setTimeout(() => {
    im.src = src;
    const done = () => holder.classList.remove('is-swapping');
    if (im.complete) done();
    else { im.onload = done; im.onerror = done; }
  }, 420);
}

function renderJourney() {
  const sector = sectorOf();
  const pk = byId[show.order[show.i]];
  const unit = priceOf(pk, sector.type, show.beds);

  // 1. The pack they're looking at above, with its price for their size
  $('#jr-pack-name').textContent = pk.name;
  $('#jr-pack-price').textContent = `${money(unit)} for a ${show.beds}-bedroom ${NOUN[show.sector]}`;
  swapImg($('#jr-pack-img'), img(pk.hero, 160));
  $('#quote-pill').src = img(pk.hero, 140);

  // Behind the order sit the packs the customer has chosen (up to four, one panel each);
  // until they add one, the pack they're looking at. The room that becomes "Ready to let" is the first of them.
  const chosen = docket.lines.length ? [...new Set(docket.lines.map((l) => l.pack))].slice(0, 4) : [pk.id];
  const bg = $('#jr-bg');
  const key = chosen.join(',');
  if (bg.dataset.key !== key) {
    const paint = () => {
      bg.innerHTML = chosen.map((id) => `<figure class="jr-panel"><img src="${img(roomPhoto(byId[id], 'living'), 900)}" alt="" decoding="async"><figcaption>${esc(byId[id].name)}</figcaption></figure>`).join('');
      bg.classList.remove('is-swapping');
    };
    if (bg.dataset.key && !reduceMotion) {
      bg.classList.add('is-swapping');
      setTimeout(paint, 420);
    } else paint();
    bg.dataset.key = key;
  }
  const lead = byId[chosen[0]];
  $('#jr-ready-img').src = img(roomPhoto(lead, 'bedroom'), 700);
  $('#jr-fly img').src = img(roomPhoto(lead, 'bedroom'));

  // 2. Their quote so far, and one tap to add the pack
  const t = totals();
  const lines = docket.lines.length;
  $('#jr-quote-total').textContent = lines ? money(t.sub) : '£0';
  $('#jr-quote-sub').textContent = lines
    ? `${t.props} ${t.props === 1 ? 'property' : 'properties'} on ${lines} ${lines === 1 ? 'line' : 'lines'}, ex VAT.`
    : 'Nothing added yet.';
  setAddBtn($('#jr-add'), inQuote(pk.id, sector.type, show.beds), `Add ${pk.name}`);
  renderMore();

  // 3 and 4. The day they choose, and when the property is ready to let
  renderDays();
  $$('.jr-day[data-day]', jrDays).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.day === jr.day)));
  const day = jr.day ? dayOf(jr.day) : null;
  $('#jr-ready-day').textContent = day ? `w/c ${day.getDate()} ${fmtMonth.format(day)}` : 'Pick a week';
  $('#how-title').innerHTML = day ? `Ready to let the week of <em>${fmtWeek.format(day)}.</em>` : 'Ready to let in as little as <em>48 hours.</em>';

  // Picking a pack into the quote completes steps 1 and 2 together; the week completes step 3.
  const done = [lines > 0, lines > 0, Boolean(day)];
  done.push(done[1] && done[2]);
  const next = done.indexOf(false);
  jrSteps.forEach((el, i) => {
    el.classList.toggle('is-done', done[i]);
    el.classList.toggle('is-next', i === next);
    // A step that has just been completed gives a small spring, so progress feels earned.
    if (done[i] && jr.done[i] === false && !reduceMotion) {
      el.classList.remove('is-pop');
      void el.offsetWidth;
      el.classList.add('is-pop');
    }
  });
  pinLast.until = performance.now() + 1200;
  // When a step is finished, the line's point of light sends out a ripple and the line brightens.
  const rail = $('#jr-rail');
  const count = done.filter(Boolean).length;
  const advanced = jr.done.length && count > jr.done.filter(Boolean).length;
  if (advanced && !reduceMotion) {
    rail.classList.remove('is-surge');
    void rail.offsetWidth;
    rail.classList.add('is-surge');
  }
  // The first pack sends the customer to step 2 (their quote), not past it; choosing a week sends them to step 4.
  if (jr.done.length) {
    if (done[0] && !jr.done[0]) jr.reached = Math.max(jr.reached, 1);
    if (done[2] && !jr.done[2]) jr.reached = 3;
  }
  jr.done = done;
  // A finished step hands the front to the next one.
  if (advanced) jrFront.manual = -1;
  frontStep();
  rail.style.setProperty('--done', (count / 4).toFixed(2));
  $('#jr-go').classList.toggle('is-ready', done[3]);
  $('#jr-hint').textContent = done[3]
    ? 'Delivered, built and cleared away. Add your details and send it.'
    : !done[1] && !done[2] ? 'Add a pack and pick a week, and your quote is ready to send.'
      : !done[1] ? 'Add a pack, and your quote is ready to send.' : 'Pick a week, and your quote is ready to send.';
}

// Bring the chosen day into view inside its own row, without moving the page.
function showDay() {
  const b = $(`.jr-day[data-day="${jr.day}"]`, jrDays);
  if (b) jrDays.scrollTo({ left: b.offsetLeft - jrDays.clientWidth / 2 + b.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
}
function pickDay(s) {
  // Any real calendar day is turned into its week (the Monday); malformed dates like 30 February are ignored.
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(s || '') && isoDay(dayOf(s)) === s;
  const mon = ok ? isoDay(mondayOf(dayOf(s))) : '';
  jr.day = mon && mon >= minDay && mon <= maxDay ? mon : '';
  // The chosen week goes straight onto the quote.
  jrDate.value = jr.day;
  $('#deliv').classList.toggle('is-set', Boolean(jr.day));
  renderJourney();
  showDay();
}
jrDays.addEventListener('click', (e) => {
  const b = e.target.closest('[data-day]');
  if (b) pickDay(jr.day === b.dataset.day ? '' : b.dataset.day);
});
jrDate.addEventListener('change', () => pickDay(jrDate.value));
// Adds any pack at the chosen size (or its nearest size), and a small "+1 Malvern" tag rises from
// whatever was tapped, so adding a pack feels like progress.
const nearestBeds = (pk, type) => {
  const opts = bedOptions(pk, type);
  return opts.includes(show.beds) ? show.beds : opts.reduce((a, b) => (Math.abs(b - show.beds) < Math.abs(a - show.beds) ? b : a));
};
function addFromStep(packId, from, type = sectorOf().type) {
  // Measured first: the tile that was tapped leaves the list once its pack is in the quote.
  const card = from.closest('.jstep');
  const a = from.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  addLine({ pack: packId, type, beds: nearestBeds(byId[packId], type), qty: 1 });
  if (reduceMotion) return;
  const tag = document.createElement('span');
  tag.className = 'jr-float';
  tag.textContent = `+1 ${byId[packId].name}`;
  tag.style.left = `${clamp(a.left - c.left, 12, c.width - 120)}px`;
  tag.style.top = `${a.top - c.top - 34}px`;
  tag.style.bottom = 'auto';
  card.append(tag);
  tag.addEventListener('animationend', () => tag.remove());
}
$('#jr-add').addEventListener('click', (e) => {
  if (e.currentTarget.classList.contains('is-added')) return scrollToEl($('#quote'));
  addFromStep(show.order[show.i], e.currentTarget);
});

// The plus opens the categories; choosing one swaps them for a back arrow and that category's packs,
// all in view at once. One tap adds a pack and it leaves the list, so nothing is ever added twice.
const jrMore = { open: false, sector: '' };
const jrMoreEl = $('#jr-more');
const jrMoreBtn = $('#jr-more-btn');
// The packs of a category not yet in the quote for that category, cheapest first.
const packsLeft = (s) => s.packs
  .filter((id) => !docket.lines.some((l) => l.pack === id && l.type === s.type))
  .sort((a, b) => lowest(byId[a], s.type) - lowest(byId[b], s.type) || PACKS.indexOf(byId[a]) - PACKS.indexOf(byId[b]));
function renderMore(dir = 0) {
  // The card changes height, so the pinned room photo keeps measuring for a moment.
  pinLast.until = performance.now() + 1200;
  jrMoreEl.hidden = !jrMore.open;
  jrMoreBtn.closest('.jstep').classList.toggle('is-picking', jrMore.open);
  jrMoreBtn.setAttribute('aria-expanded', String(jrMore.open));
  jrMoreBtn.setAttribute('aria-label', jrMore.open ? 'Close the list of packs' : 'More packs: choose a category');
  if (!jrMore.open) return;
  const s = SECTORS.find((x) => x.id === jrMore.sector);
  let key;
  let body;
  if (!s) {
    const counts = SECTORS.map((x) => packsLeft(x).length);
    key = `cats|${counts.join(',')}`;
    body = `<div class="jr-picks is-cats" role="group" aria-label="Choose a category">${SECTORS.map((x, i) => `<button class="jr-pick jr-cat" type="button" data-sector="${x.id}"><img src="${img(x.photo, 64)}" alt="" decoding="async"><span><b>${CAT[x.id]}</b><small>${counts[i] ? `${counts[i]} ${counts[i] === 1 ? 'pack' : 'packs'}` : 'All in your quote'}</small></span>${icon('right')}</button>`).join('')}</div>`;
  } else {
    const left = packsLeft(s);
    key = `${s.id}|${show.beds}|${left.join(',')}`;
    const tile = (pk) => {
      const price = money(priceOf(pk, s.type, nearestBeds(pk, s.type)));
      return `<button class="jr-pick" type="button" data-pack="${pk.id}" aria-label="Add ${esc(pk.name)}, ${price}"><img src="${img(pk.hero, 64)}" alt="" decoding="async"><span><b>${esc(pk.name)}</b><small>${price}</small></span>${icon('plus')}</button>`;
    };
    body = `<div class="jr-more-head"><button class="jr-back" type="button" data-back aria-label="Back to the categories">${icon('left')}</button><b>${CAT[s.id]}</b></div>${left.length
      ? `<div class="jr-picks" role="group" aria-label="${CAT[s.id]} packs not in your quote yet">${left.map((id) => tile(byId[id])).join('')}</div>`
      : '<p class="jr-more-empty">Every pack here is in your quote.</p>'}`;
  }
  if (jrMoreEl.dataset.key === key) return;
  jrMoreEl.dataset.key = key;
  jrMoreEl.innerHTML = `${body}<a class="jstep-link" href="#quote">Build your own in the quote${icon('arrow-d')}</a>`;
  // Forward into a category slides in from the right; back to the categories, from the left.
  if (dir && !reduceMotion) {
    jrMoreEl.animate([{ opacity: 0, transform: `translate3d(${dir * 16}px, 0, 0)` }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
  }
}
jrMoreBtn.addEventListener('click', () => {
  jrMore.open = !jrMore.open;
  // The plus always opens on the categories.
  jrMore.sector = '';
  // Folding the list away lets the order move on to whichever step is next.
  if (!jrMore.open) jrFront.manual = -1;
  renderMore();
  frontStep();
});

// The step the customer is on comes forward and widens, the others stay in view behind it.
// It moves on by itself as each step is done; a tap (or the keyboard) brings any step forward,
// and a step with its list or calendar open stays in front until it is closed.
const jrList = $('.journey-steps', journey);
const jrFront = { manual: -1, pointer: false };
function frontStep() {
  // In front: a step with its list or calendar open; else one the customer chose; else the step they have
  // been sent to, unless an earlier step still needs doing.
  const todo = jr.done.indexOf(false);
  const busy = jrMore.open ? 0 : cal.open ? 2 : -1;
  const i = busy >= 0 ? busy : jrFront.manual >= 0 ? jrFront.manual : Math.min(jr.reached, todo < 0 ? 3 : todo);
  journey.classList.toggle('ready-back', i !== 3 && readyCard.classList.contains('is-on'));
  if (jrList.dataset.active === String(i)) return;
  jrList.dataset.active = String(i);
  jrSteps.forEach((el, k) => el.classList.toggle('is-back', k !== i));
  pinLast.until = performance.now() + 1400;
}
// The moment the customer touches a step, every step appears at once (no waiting for them to scroll in),
// and the page glides on to where the room has landed in step 4, so the next step and its "Next" are in view.
function engageJourney() {
  if (!journey.classList.contains('is-pinned')) return;
  journey.classList.add('is-engaged');
  pinLast.until = performance.now() + 1400;
  const r = journey.getBoundingClientRect();
  if (-r.top / Math.max(1, r.height - innerHeight) < 0.58) scrollToEl(journey);
}
// Capture runs before the step's own buttons, so a finished step can still hand the front on.
jrList.addEventListener('click', (e) => {
  const el = e.target.closest('.jstep');
  if (!el) return;
  engageJourney();
  jrFront.manual = jrSteps.indexOf(el);
  frontStep();
}, true);
jrList.addEventListener('pointerdown', () => (jrFront.pointer = true));
addEventListener('pointerup', () => setTimeout(() => (jrFront.pointer = false)));
jrList.addEventListener('focusin', (e) => {
  if (jrFront.pointer) return;
  engageJourney();
  jrFront.manual = jrSteps.indexOf(e.target.closest('.jstep'));
  frontStep();
});

// "Next" on a finished step sends the customer straight to the following one: any open list or calendar
// folds away, that step comes forward, the page brings it into view if needed, and focus moves into it.
function bringStepIntoView(i) {
  if (journey.classList.contains('is-pinned')) {
    // Pinned: all four steps are on screen once the room has landed; glide there if the visitor is short of it.
    const r = journey.getBoundingClientRect();
    const p = -r.top / Math.max(1, r.height - innerHeight);
    if (p < 0.58 || p > 0.97) scrollToEl(journey);
    return;
  }
  const c = jrSteps[i].getBoundingClientRect();
  if (c.top < 90 || c.bottom > innerHeight - 96) scrollToEl(jrSteps[i], -110);
}
jrList.addEventListener('click', (e) => {
  const nx = e.target.closest('[data-next]');
  if (!nx) return;
  const to = Number(nx.dataset.next);
  if (jrMore.open) { jrMore.open = false; renderMore(); }
  if (cal.open) { cal.open = false; renderCal(); }
  jr.reached = Math.max(jr.reached, to);
  jrFront.manual = to;
  frontStep();
  bringStepIntoView(to);
  [...jrSteps[to].querySelectorAll('button, a')].find((el) => el.offsetParent)?.focus({ preventScroll: true });
});
jrMoreEl.addEventListener('click', (e) => {
  const cat = e.target.closest('[data-sector]');
  if (cat) {
    jrMore.sector = cat.dataset.sector;
    renderMore(1);
    return $('[data-back]', jrMoreEl)?.focus();
  }
  if (e.target.closest('[data-back]')) {
    const was = jrMore.sector;
    jrMore.sector = '';
    renderMore(-1);
    return $(`[data-sector="${was}"]`, jrMoreEl)?.focus();
  }
  const b = e.target.closest('[data-pack]');
  if (!b) return;
  const i = $$('[data-pack]', jrMoreEl).indexOf(b);
  addFromStep(b.dataset.pack, b, SECTORS.find((x) => x.id === jrMore.sector).type);
  // Focus stays in the list, on the tile that took the added one's place.
  const rest = $$('[data-pack]', jrMoreEl);
  (rest[Math.min(i, rest.length - 1)] || $('[data-back]', jrMoreEl) || jrMoreBtn).focus();
});
jrSteps.forEach((el) => el.addEventListener('animationend', () => el.classList.remove('is-pop')));
document.addEventListener('fp:change', renderJourney);
new IntersectionObserver(([en]) => {
  if (en.isIntersecting) journey.classList.add('is-in');
}, { threshold: 0.18 }).observe(journey);
// The quote is set up further down this file, so the first render waits until the module has run.
queueMicrotask(renderJourney);

// The way in, as on landonorris.com: the finished room fills the screen, then pulls back into the
// "Ready to let" card while the steps arrive one at a time. It pins only where the whole tracker fits;
// on smaller screens the room pulls back into a card in CSS as it scrolls past.
const jrStage = $('#jr-stage');
const fly = $('#jr-fly');
const flyCap = $('.jr-cap', fly);
const jrFades = $$('.jr-fade', journey);
const readyCard = $('.jstep-ready', journey);
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
let pinLoop = false;

function setPinned() {
  const want = !reduceMotion && innerWidth > 960 && innerHeight >= 680;
  if (want === journey.classList.contains('is-pinned')) return;
  journey.classList.toggle('is-pinned', want);
  if (!want) {
    fly.removeAttribute('style');
    flyCap.style.opacity = '';
    jrFades.forEach((el) => (el.style.opacity = ''));
    jrSteps.forEach((el) => el.classList.remove('is-on'));
  }
}

// The loop keeps measuring for a moment after the customer acts (a card may grow or spring).
const pinLast = { p: -1, w: 0, until: 0 };
function pinFrame() {
  if (!pinLoop) return;
  requestAnimationFrame(pinFrame);
  if (!journey.classList.contains('is-pinned')) return;
  const r = journey.getBoundingClientRect();
  const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
  // Nothing has moved since the last frame: skip the measuring and drawing entirely.
  if (p === pinLast.p && innerWidth === pinLast.w && performance.now() > pinLast.until) return;
  pinLast.p = p;
  pinLast.w = innerWidth;
  // Measured when anything moves, because the headline and the card can change size as the customer acts.
  const st = jrStage.getBoundingClientRect();
  const c = readyCard.getBoundingClientRect();
  // It starts as large as the photo allows while staying sharp: full screen where the photo is big
  // enough, otherwise a large framed close-up. It is never blown up past its own pixels.
  const flyImg = fly.firstElementChild;
  const lim = (devicePixelRatio >= 2 ? 1.3 : 1.15) / devicePixelRatio;
  const aspect = st.width / st.height;
  const w0 = Math.min(st.width, lim * (flyImg.naturalWidth || 1200), aspect * lim * (flyImg.naturalHeight || 900));
  const h0 = w0 / aspect;
  const r0 = w0 < st.width - 1 ? 28 : 0;
  const z = easeIO(clamp((p - 0.08) / 0.5, 0, 1));
  fly.style.left = `${lerp((st.width - w0) / 2, c.left - st.left, z).toFixed(1)}px`;
  fly.style.top = `${lerp((st.height - h0) / 2, c.top - st.top, z).toFixed(1)}px`;
  fly.style.width = `${lerp(w0, c.width, z).toFixed(1)}px`;
  fly.style.height = `${lerp(h0, c.height, z).toFixed(1)}px`;
  fly.style.borderRadius = `${lerp(r0, 28, z).toFixed(1)}px`;
  flyCap.style.opacity = String(1 - clamp((p - 0.04) / 0.16, 0, 1));
  const head = clamp((p - 0.4) / 0.14, 0, 1);
  jrFades.forEach((el) => (el.style.opacity = String(head)));
  // The steps pop in one at a time; the last card lands with the room inside it.
  // Once the customer has touched a step, every step stays in view; scrolling back to the start resets it.
  const engaged = journey.classList.contains('is-engaged');
  if (engaged && p < 0.3) journey.classList.remove('is-engaged');
  jrSteps.forEach((el, i) => el.classList.toggle('is-on', (engaged && p >= 0.3) || p >= (i < 3 ? 0.46 + i * 0.06 : 0.58)));
  // Once the room has landed in its card, it steps back with the card when another step is in front.
  journey.classList.toggle('ready-back', jrList.dataset.active !== '3' && readyCard.classList.contains('is-on'));
}

setPinned();
addEventListener('resize', setPinned);
new IntersectionObserver(([en]) => {
  pinLoop = en.isIntersecting;
  if (pinLoop) requestAnimationFrame(pinFrame);
}).observe(journey);

/* ================================================================== */
/* Quote docket: lines, totals with VAT, and every piece added up      */

const docket = { lines: [], uid: 0, open: new Set(), ref: `FP-${Math.floor(1000 + Math.random() * 9000)}` };
const linesEl = $('#lines');
$('#docket-ref').textContent = `Ref ${docket.ref}`;
const hasChanges = (l) => changesOf(l).length > 0;

function sizeOptions(pk) {
  return Object.keys(TYPES).flatMap((type) => (offers(pk, type) ? bedOptions(pk, type).map((b) => ({ type, beds: b })) : []));
}

// A pack at a size that is already in the quote is never added twice: its button says
// "In your quote" and takes the customer there, where the number of properties is changed.
function inQuote(pack, type, beds) {
  return docket.lines.some((l) => l.pack === pack && l.type === type && l.beds === beds);
}
function setAddBtn(btn, added, label) {
  btn.classList.toggle('is-added', added);
  btn.firstChild.nodeValue = added ? 'In your quote' : label;
  btn.querySelector('.btn-ico use')?.setAttribute('href', added ? '#i-check' : '#i-plus');
}
document.addEventListener('fp:change', () => setAddBtn($('#show-add'), inQuote(show.order[show.i], sectorOf().type, show.beds), 'Add to quote'));
function addLine(l, { quiet = false } = {}) {
  const same = docket.lines.find((x) => x.pack === l.pack && x.type === l.type && x.beds === l.beds && !hasChanges(x));
  if (same) same.qty = clamp(same.qty + l.qty, 1, 500);
  else docket.lines.push({ ...l, mods: {}, extras: [], id: ++docket.uid });
  renderDocket();
  if (!quiet) toast(`Added ${byId[l.pack].name}, ${sizeLabel(l.type, l.beds)} × ${l.qty}`);
}

const signed = (d) => (d > 0 ? `+${d}` : `−${-d}`);
const changeText = (c) => `${signed(c.d)} ${plural(Math.abs(c.d), c.name)}${c.from ? ` from ${c.from}` : ''}`;

// Every piece gets its own product photo where the site has one. Exact names first, then the same
// kind of piece from the same pack (the Hoxton wardrobe for "Hoxton two-door wardrobe"). Where no
// photo exists, the card says so in type rather than borrowing a photo of a different product.
const PIECE_PICS = PACKS.flatMap((pk) => ['bedroom', 'living'].flatMap((r) => pk.gallery[r]
  .filter((s) => s.kind === 'piece').map((s) => ({ pack: pk.id, name: s.name.toLowerCase(), src: s.src }))));
const PIECE_KINDS = [
  ['desk', /desk/], ['dining set', /dining (table )?set|table and chairs/], ['dining table', /dining table/],
  ['armchair', /armchair/], ['dining chair', /dining chair|\bchair\b/], ['coffee table', /coffee table/],
  ['wardrobe', /wardrobe/], ['chest', /chest/], ['bedside', /bedside/], ['mattress', /mattress/], ['bed', /\bbed\b/], ['sofa', /sofa/],
];
const kindOf = (n) => (PIECE_KINDS.find(([, re]) => re.test(n)) || [''])[0];
const picCache = new Map();
function piecePic(name, packId) {
  const key = `${packId}|${name}`;
  if (picCache.has(key)) return picCache.get(key);
  const n = name.toLowerCase();
  const kind = kindOf(n);
  const same = PIECE_PICS.filter((p) => p.pack === packId);
  const hit = same.find((p) => p.name === n)
    || PIECE_PICS.find((p) => p.name === n)
    || same.find((p) => p.name.startsWith(n) || n.startsWith(p.name))
    || (kind && !['desk', 'mattress', 'armchair'].includes(kind)
      && (same.find((p) => kindOf(p.name) === kind && p.name.includes(n.split(' ')[0])) || same.find((p) => kindOf(p.name) === kind)));
  const src = hit ? hit.src : null;
  picCache.set(key, src);
  return src;
}
const picHTML = (name, packId) => {
  const src = piecePic(name, packId);
  return src
    ? `<span class="cu-pic"><img src="${img(src, 320)}" alt="" loading="lazy" decoding="async"></span>`
    : `<span class="cu-pic is-none" aria-hidden="true"><em>${esc(kindOf(name.toLowerCase()) || name)}</em></span>`;
};
const cuStepper = (attr, name, v, max, minDisabled) => `
  <span class="stepper stepper-sm">
    <button class="icon-btn" type="button" ${attr} data-d="-1" aria-label="One fewer ${esc(name)}"${minDisabled ? ' disabled' : ''}>${icon('minus')}</button>
    <span class="cu-val num">${v}</span>
    <button class="icon-btn" type="button" ${attr} data-d="1" aria-label="One more ${esc(name)}"${v >= max ? ' disabled' : ''}>${icon('plus')}</button>
  </span>`;

// Like ordering at a counter: every piece is a picture you can add or take away,
// and any piece from any other pack can be added the same way.
function customHTML(l) {
  const base = basePieces(byId[l.pack], l.type, l.beds);
  const cards = [...base].map(([name, n]) => {
    const d = l.mods[name] || 0;
    const v = Math.max(0, n + d);
    return `
      <li class="cu-card${d ? ' is-changed' : ''}${v === 0 ? ' is-out' : ''}">
        ${picHTML(name, l.pack)}
        <span class="cu-name">${esc(name)}</span>
        ${d ? `<span class="cu-tag">${d > 0 ? signed(d) : v === 0 ? 'Removed' : signed(d)}</span>` : ''}
        ${cuStepper(`data-mod="${esc(name)}"`, name, v, n + 20, v <= 0)}
      </li>`;
  }).join('');
  const extras = l.extras.map((x, i) => `
      <li class="cu-card is-changed">
        ${picHTML(x.name, x.pack)}
        <span class="cu-name">${esc(x.name)}<small>${x.pack === l.pack ? 'Extra' : `From ${byId[x.pack].name}`}</small></span>
        ${cuStepper(`data-extra="${i}"`, x.name, x.n, 20, false)}
      </li>`).join('');
  const pickPack = l.pick || l.pack;
  const shop = catalogue(byId[pickPack]).map((name) => `
      <li class="cu-card cu-shop">
        ${picHTML(name, pickPack)}
        <span class="cu-name">${esc(name)}</span>
        <button class="cu-add-btn" type="button" data-add-piece="${esc(name)}" aria-label="Add ${esc(name)} from ${byId[pickPack].name}">${icon('plus')}Add</button>
      </li>`).join('');
  return `
    <div class="custom" id="custom-${l.id}">
      <h4>In each property</h4>
      <ul class="cu-grid">${cards}</ul>
      ${extras ? `<h4>Your extras</h4><ul class="cu-grid">${extras}</ul>` : ''}
      <h4>Add a piece from any pack</h4>
      <div class="cu-packs" role="group" aria-label="Pack to add a piece from">${PACKS.map((p) => `<button type="button" data-pick-pack="${p.id}" aria-pressed="${p.id === pickPack}"><img src="${img(p.hero, 64)}" alt="" loading="lazy" decoding="async">${p.name}</button>`).join('')}</div>
      <ul class="cu-grid">${shop}</ul>
      <p class="cu-note">Changes apply to every property on this line. Removed pieces lower the price and extra pieces add to it; we confirm the figure in your quote.</p>
    </div>`;
}

function lineHTML(l) {
  const pk = byId[l.pack];
  const unit = priceOf(pk, l.type, l.beds);
  const ch = changesOf(l);
  const open = docket.open.has(l.id);
  return `
  <div class="ln-wrap${open ? ' is-open' : ''}" data-id="${l.id}">
    <div class="ln">
      <span class="ln-pic"><img src="${img(pk.hero, 120)}" alt="" loading="lazy" decoding="async"></span>
      <div class="select"><select aria-label="Pack" data-field="pack">${PACKS.map((p) => `<option value="${p.id}"${p.id === l.pack ? ' selected' : ''}>${p.name}</option>`).join('')}</select></div>
      <div class="select"><select aria-label="Size" data-field="size">${sizeOptions(pk).map((o) => `<option value="${o.type}:${o.beds}"${o.type === l.type && o.beds === l.beds ? ' selected' : ''}>${esc(shortSize(o.type, o.beds))}</option>`).join('')}</select></div>
      <div class="stepper">
        <button class="icon-btn" type="button" data-qty="-1" aria-label="One fewer property"${l.qty <= 1 ? ' disabled' : ''}>${icon('minus')}</button>
        <input type="number" inputmode="numeric" min="1" max="500" value="${l.qty}" aria-label="Number of properties" data-field="qty">
        <button class="icon-btn" type="button" data-qty="1" aria-label="One more property"${l.qty >= 500 ? ' disabled' : ''}>${icon('plus')}</button>
      </div>
      <div class="ln-total">${money(unit * l.qty)}<small>${money(unit)} each${ch.length ? ', before changes' : ''}</small></div>
      <button class="icon-btn" type="button" data-remove aria-label="Remove ${pk.name} from the quote">${icon('x')}</button>
    </div>
    <div class="ln-sub">
      <button class="ln-custom" type="button" data-custom aria-expanded="${open}" aria-controls="custom-${l.id}">
        <svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg>${ch.length ? `Customised · ${ch.length} ${ch.length === 1 ? 'change' : 'changes'}` : 'Customise this pack'}
      </button>
      ${ch.length ? `<p class="ln-changes">${ch.map((c) => `<span>${esc(changeText(c))}</span>`).join('')}</p>` : ''}
    </div>
    ${open ? customHTML(l) : ''}
  </div>`;
}

function totals() {
  const sub = docket.lines.reduce((s, l) => s + priceOf(byId[l.pack], l.type, l.beds) * l.qty, 0);
  const vat = Math.round(sub * VAT_RATE * 100) / 100;
  return { sub, vat, total: sub + vat, props: docket.lines.reduce((s, l) => s + l.qty, 0), changed: docket.lines.filter(hasChanges).length };
}

function renderDocket(focusSel) {
  linesEl.innerHTML = docket.lines.length
    ? docket.lines.map(lineHTML).join('')
    : '<p class="empty">Your quote is empty. Add a pack from above, or add one here.</p>';
  const t = totals();
  const note = t.changed ? ', before changes' : '';
  $('#totals').innerHTML = `
    <div><dt>Subtotal, ex VAT${note}</dt><dd>${money2(t.sub)}</dd></div>
    <div><dt>VAT at ${Math.round(VAT_RATE * 100)}%</dt><dd>${money2(t.vat)}</dd></div>
    ${t.changed ? `<div class="changes-row"><dt>Changes on ${t.changed} ${t.changed === 1 ? 'line' : 'lines'}</dt><dd>Priced in your quote</dd></div>` : ''}
    <div class="grand"><dt>Total, inc VAT${note}</dt><dd>${money2(t.total)}</dd></div>`;
  const pcs = piecesFor(docket.lines).sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));
  const count = pcs.reduce((s, [n]) => s + n, 0);
  $('#pieces-title').textContent = count ? `Every piece we'll deliver · ${count} pieces` : 'Every piece we will deliver';
  $('#pieces-list').innerHTML = pcs.map(([n, name]) => `<li><b>${n}</b>${esc(name)}</li>`).join('');
  $('#pieces').hidden = !count;
  document.dispatchEvent(new Event('fp:change'));
  $('#nav-count').textContent = t.props;
  $('#nav-count').hidden = !t.props;
  $('#nav').classList.toggle('has-quote', t.props > 0);
  if (focusSel) $(focusSel, linesEl)?.focus();
}

const lineOf = (el) => docket.lines.find((x) => x.id === Number(el.closest('.ln-wrap')?.dataset.id));

linesEl.addEventListener('change', (e) => {
  const l = lineOf(e.target);
  if (!l) return;
  const f = e.target.dataset.field;
  // Only values the page itself offers are accepted; anything else leaves the line as it was.
  if (f === 'pack') {
    if (!byId[e.target.value]) return renderDocket();
    l.pack = e.target.value;
    l.mods = {};
    const opts = sizeOptions(byId[l.pack]);
    const keep = opts.find((o) => o.type === l.type && o.beds === l.beds) || opts.find((o) => o.type === l.type) || opts[0];
    l.type = keep.type;
    l.beds = keep.beds;
  } else if (f === 'size') {
    const [type, beds] = e.target.value.split(':');
    if (!sizeOptions(byId[l.pack]).some((o) => o.type === type && o.beds === Number(beds))) return renderDocket();
    l.type = type;
    l.beds = Number(beds);
  } else if (f === 'qty') {
    l.qty = clamp(Math.round(Number(e.target.value)) || 1, 1, 500);
  }
  renderDocket(`.ln-wrap[data-id="${l.id}"] [data-field="${f}"]`);
});

linesEl.addEventListener('click', (e) => {
  const l = lineOf(e.target);
  if (!l) return;
  const at = (sel) => `.ln-wrap[data-id="${l.id}"] ${sel}`;
  const q = e.target.closest('[data-qty]');
  if (q) {
    l.qty = clamp(l.qty + Number(q.dataset.qty), 1, 500);
    return renderDocket(at(`[data-qty="${q.dataset.qty}"]`));
  }
  if (e.target.closest('[data-remove]')) {
    docket.lines.splice(docket.lines.indexOf(l), 1);
    docket.open.delete(l.id);
    renderDocket();
    return ($('#lines [data-remove]') || $('#add-line')).focus();
  }
  if (e.target.closest('[data-custom]')) {
    const opening = !docket.open.has(l.id);
    if (opening) docket.open.add(l.id);
    else docket.open.delete(l.id);
    renderDocket(at('[data-custom]'));
    if (opening && !reduceMotion) {
      $(`#custom-${l.id}`)?.animate(
        [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      );
    }
    return;
  }
  const mod = e.target.closest('[data-mod]');
  if (mod) {
    const name = mod.dataset.mod;
    const base = basePieces(byId[l.pack], l.type, l.beds).get(name) || 0;
    const d = clamp((l.mods[name] || 0) + Number(mod.dataset.d), -base, 20);
    if (d) l.mods[name] = d;
    else delete l.mods[name];
    return renderDocket(at(`[data-mod="${CSS.escape(name)}"][data-d="${mod.dataset.d}"]`));
  }
  const ex = e.target.closest('[data-extra]');
  if (ex) {
    const i = Number(ex.dataset.extra);
    const x = l.extras[i];
    x.n = clamp(x.n + Number(ex.dataset.d), 0, 20);
    if (!x.n) l.extras.splice(i, 1);
    return renderDocket(x.n ? at(`[data-extra="${i}"][data-d="${ex.dataset.d}"]`) : at('[data-add-extra]'));
  }
  const pp = e.target.closest('[data-pick-pack]');
  if (pp) {
    l.pick = pp.dataset.pickPack;
    return renderDocket(at(`[data-pick-pack="${l.pick}"]`));
  }
  const add = e.target.closest('[data-add-piece]');
  if (add) {
    const pack = l.pick || l.pack;
    const name = add.dataset.addPiece;
    const found = l.extras.find((x) => x.pack === pack && x.name === name);
    if (found) found.n = clamp(found.n + 1, 1, 20);
    else l.extras.push({ pack, name, n: 1 });
    renderDocket(at(`[data-add-piece="${CSS.escape(name)}"]`));
    toast(`Added ${name}${pack === l.pack ? '' : ` from ${byId[pack].name}`} to ${byId[l.pack].name}`);
  }
});

$('#add-line').addEventListener('click', () => {
  // A new line starts on a pack that isn't in the quote yet.
  const pk = PACKS.find((p) => !docket.lines.some((l) => l.pack === p.id)) || byId[state.pack];
  const opts = sizeOptions(pk);
  const o = opts.find((x) => x.type === 'apartment' && x.beds === 1) || opts[0];
  addLine({ pack: pk.id, type: o.type, beds: o.beds, qty: 1 }, { quiet: true });
  $('#lines .ln-wrap:last-child select')?.focus();
});

function quoteText() {
  const t = totals();
  const ls = docket.lines.flatMap((l) => {
    const unit = priceOf(byId[l.pack], l.type, l.beds);
    const head = `${byId[l.pack].name}, ${sizeLabel(l.type, l.beds)} × ${l.qty} at ${money(unit)} = ${money(unit * l.qty)}`;
    const ch = changesOf(l).map((c) => `   ${changeText(c)} in each property`);
    return [head, ...ch];
  });
  const pcs = piecesFor(docket.lines).map(([n, name]) => `${n} × ${name}`);
  return [
    `Furnishing Packs quote ${docket.ref}`,
    ...ls,
    `Delivery, assembly and packaging removal: included, ${jr.day ? `week commencing ${longYear(dayOf(jr.day))}` : 'week to be agreed'}`,
    `Subtotal ex VAT${t.changed ? ' (before changes)' : ''}: ${money2(t.sub)}`,
    `VAT at ${Math.round(VAT_RATE * 100)}%: ${money2(t.vat)}`,
    `Total inc VAT${t.changed ? ' (before changes)' : ''}: ${money2(t.total)}`,
    ...(t.changed ? ['Changes are priced and confirmed in the quote.'] : []),
    '',
    'Pieces:',
    ...pcs,
  ].join('\n');
}

$('#copy-quote').addEventListener('click', async () => {
  const status = $('#copy-status');
  try {
    await navigator.clipboard.writeText(quoteText());
    status.textContent = 'Copied. Paste it into an email or your purchase order.';
  } catch {
    status.textContent = 'Copying is not allowed here. Select the quote above and copy it instead.';
  }
});

renderDocket();

/* Contact form */

const form = $('#q-form');
const done = $('#q-done');
const rules = {
  'f-name': (v) => (v.trim() ? '' : 'Enter your name.'),
  'f-email': (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter an email address, like name@company.co.uk.'),
  'f-phone': (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with at least 10 digits.'),
};
function check(input) {
  const msg = rules[input.id](input.value);
  let err = document.getElementById(`${input.id}-err`);
  if (!msg) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    err?.remove();
    return true;
  }
  if (!err) {
    err = document.createElement('p');
    err.className = 'f-error';
    err.id = `${input.id}-err`;
    input.after(err);
  }
  err.textContent = msg;
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', err.id);
  return false;
}
form.addEventListener('input', (e) => {
  if (rules[e.target.id] && e.target.getAttribute('aria-invalid') === 'true') check(e.target);
});
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = Object.keys(rules).map((id) => document.getElementById(id));
  const ok = inputs.map(check);
  if (ok.includes(false)) return inputs[ok.indexOf(false)].focus();
  if (!docket.lines.length) {
    toast('Add at least one pack to the quote first');
    return $('#add-line').focus();
  }
  const t = totals();
  const when = jr.day ? `, delivered the week commencing ${weekName(dayOf(jr.day))}` : '';
  $('#q-summary').textContent = `Ref ${docket.ref}: ${docket.lines.length} ${docket.lines.length === 1 ? 'line' : 'lines'}, ${t.props} ${t.props === 1 ? 'property' : 'properties'}, ${money2(t.total)} including VAT${when}.`;
  // Until the form is connected to an inbox, the request is composed as an email to the team, with
  // the customer's details and the whole quote, so no enquiry is ever lost.
  const v = (id) => $(`#${id}`).value.trim();
  const body = [
    `Name: ${v('f-name')}`,
    v('f-company') && `Company: ${v('f-company')}`,
    `Email: ${v('f-email')}`,
    `Phone: ${v('f-phone')}`,
    v('f-postcode') && `Delivery postcode: ${v('f-postcode')}`,
    v('f-notes') && `Notes: ${v('f-notes')}`,
    '',
    quoteText(),
  ].filter((x) => x !== '' && x !== false).join('\n');
  // Email apps cap a link's length; the full list of pieces is dropped first if it would not fit.
  const compact = body.length > 1800 ? body.replace(/\n+Pieces:\n[\s\S]*$/, '') : body;
  const subject = `Quote request ${docket.ref}${v('f-company') ? `, ${v('f-company')}` : ''}`;
  location.href = `mailto:info@furnishingpacks.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compact)}`;
  form.hidden = true;
  done.hidden = false;
  done.focus();
});
$('#q-again').addEventListener('click', () => {
  done.hidden = true;
  form.hidden = false;
  $('#f-name').focus();
});

/* ================================================================== */
/* Full view: every photo of a room                                   */

const viewer = $('#viewer');
const vState = { pack: null, room: 'bedroom', i: 0 };

function photosFor(pk, room) {
  const list = [...pk.gallery[room]];
  if (pk.board) list.push({ kind: 'piece', src: pk.board, alt: `The full ${pk.name} pack`, name: `The full ${pk.name} pack` });
  return list;
}

function renderViewer() {
  const pk = byId[vState.pack];
  $('#v-name').textContent = pk.name;
  $$('#v-rooms button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.room === vState.room)));
  const strip = $('#v-strip');
  const list = photosFor(pk, vState.room);
  vState.i = clamp(vState.i, 0, list.length - 1);
  const s = list[vState.i];
  const ph = $('#v-photo');
  ph.src = img(s.src);
  ph.alt = s.alt;
  ph.classList.toggle('is-room', s.kind === 'room');
  $('#v-cap').textContent = `${s.kind === 'piece' ? s.name : 'Room photo'} · ${vState.i + 1} of ${list.length}`;
  strip.innerHTML = list.map((x, i) => `<button class="thumb${x.kind === 'piece' ? ' is-piece' : ''}" type="button" data-i="${i}" aria-current="${i === vState.i}" aria-label="${esc(x.kind === 'piece' ? x.name : 'Room photo')}"><img src="${img(x.src, 160)}" alt="" loading="lazy"></button>`).join('');
  $(`.thumb[aria-current="true"]`, strip)?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
}

function openViewer(packId, room, i = 0) {
  Object.assign(vState, { pack: packId, room, i });
  if (!viewer.open) viewer.showModal();
  renderViewer();
}
$('#v-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (e) => {
  if (e.target === viewer) viewer.close();
});
$('#v-rooms').addEventListener('click', (e) => {
  const b = e.target.closest('[data-room]');
  if (!b) return;
  vState.room = b.dataset.room;
  vState.i = 0;
  renderViewer();
});
$('#v-strip').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]');
  if (!t) return;
  vState.i = Number(t.dataset.i);
  renderViewer();
});
const stepPhoto = (d) => {
  const n = photosFor(byId[vState.pack], vState.room).length;
  vState.i = (vState.i + d + n) % n;
  renderViewer();
};
$('#v-prev').addEventListener('click', () => stepPhoto(-1));
$('#v-next').addEventListener('click', () => stepPhoto(1));
viewer.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') stepPhoto(-1);
  if (e.key === 'ArrowRight') stepPhoto(1);
});

/* ================================================================== */
/* The catalogue: every pack and every piece, page by page              */

// A cover and contents, then two pages per pack: the whole bedroom with what the pack is, and
// every piece in it, its prices by size and a way to add it to the quote. It is built when the
// browser is idle, so it never holds up the page, and its photos load only as their pages come near.
const bookTrack = $('#book-track');
// One turn is one spread: the cover with the contents, then one per pack. Where two pages can't sit side
// by side, a spread's pages stack, so a turn always moves from one whole pack to the next.
const book = { s: 0, built: false };
// The packs run cheapest first, as in the pack section.
const BOOK = [...PACKS].sort((a, b) => lowest(a, 'apartment') - lowest(b, 'apartment') || PACKS.indexOf(a) - PACKS.indexOf(b));
const BOOK_SPREADS = 1 + BOOK.length;
const BOOK_PRICES = { apartment: 'Homes, student and social', hmo: 'HMOs', serviced: 'Serviced' };
const bedsText = (n) => `${n} ${n === 1 ? 'bed' : 'beds'}`;
const roomImg = (src, alt, sizes = '(max-width: 1100px) 60vw, 46vw') => `<img src="${img(src, 1000)}" srcset="${img(src, 640)} 640w, ${img(src, 1000)} 1000w" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" decoding="async" data-zoom tabindex="0" role="button" aria-label="${esc(alt)}: see it larger">`;

function bookPiece(name, pk) {
  const src = piecePic(name, pk.id);
  return `<li class="bk-piece"><span class="bk-pic${src ? '' : ' is-none'}">${src
    ? `<img src="${img(src, 240)}" alt="${esc(`${pk.name} pack: ${name}`)}" loading="lazy" decoding="async" data-zoom tabindex="0" role="button" aria-label="${esc(name)}: see it larger">`
    : `<em aria-hidden="true">${esc(kindOf(name.toLowerCase()) || name)}</em>`}</span><span>${esc(name)}</span></li>`;
}

function bookPackPages(pk) {
  // The main photo is always a whole room: the bedroom, or the living room where there is no bedroom shot.
  // The second is the living room, or else the pack's own board of every piece.
  const bedRoom = pk.gallery.bedroom.find((s) => s.kind === 'room');
  const livingRoom = pk.gallery.living.find((s) => s.kind === 'room');
  const bed = bedRoom || livingRoom || { src: pk.hero, alt: `The ${pk.name} pack` };
  const inset = bedRoom && livingRoom
    ? { src: livingRoom.src, alt: livingRoom.alt, title: 'The living room' }
    : pk.board ? { src: pk.board, alt: `Every piece of the ${pk.name} pack`, title: 'The whole pack', board: true } : null;
  const suits = SECTORS.filter((s) => s.packs.includes(pk.id));
  const bedNames = pk.bed.map(([, n]) => n);
  const livingNames = catalogue(pk).filter((n) => !bedNames.includes(n) && n !== 'Orthopaedic mattress');
  const notes = [];
  if (pk.hmoMattress) notes.push('HMO packs add an orthopaedic mattress to every bedroom.');
  if (suits.some((s) => s.type === 'student')) notes.push('Student lets add a desk and desk chair to every bedroom.');
  const prices = Object.entries(pk.prices).map(([t, list]) => `<div><dt>${BOOK_PRICES[t] || TYPES[t]?.label || t}</dt><dd>${Object.entries(list).map(([b, v]) => `${bedsText(Number(b))} ${money(v)}`).join(' · ')}</dd></div>`).join('');
  const opts = sizeOptions(pk);
  const pref = opts.find((o) => o.type === sectorOf().type && o.beds === show.beds) || opts[0];
  const sizes = opts.map((o) => `<option value="${o.type}:${o.beds}"${o === pref ? ' selected' : ''}>${shortSize(o.type, o.beds)} · ${money(priceOf(pk, o.type, o.beds))}</option>`).join('');
  return `
    <article class="page bk-left" aria-labelledby="bk-${pk.id}"><div class="bk-left-in${inset ? '' : ' no-inset'}">
      <figure class="bk-photo">${roomImg(bed.src, bed.alt)}</figure>
      <h3 class="bk-name" id="bk-${pk.id}">${esc(pk.name)}</h3>
      <p class="bk-line">${esc(pk.line)}</p>
      <div class="bk-suits" role="group" aria-label="See ${esc(pk.name)} for">${suits.map((s) => `<button type="button" data-bk-sector="${s.id}" data-bk-pack="${pk.id}">${CAT[s.id]}</button>`).join('')}</div>
      ${inset ? `<figure class="bk-living${inset.board ? ' is-board' : ''}"><figcaption><b>${inset.title}</b></figcaption><span class="bk-photo">${roomImg(inset.src, inset.alt, '(max-width: 1100px) 30vw, 26vw')}</span></figure>` : ''}
      </div>
    </article>
    <section class="page" aria-label="${esc(pk.name)}: every piece and every price">
      <h4 class="bk-h">In every bedroom</h4>
      <ul class="bk-pieces" style="--n:${clamp(bedNames.length, 4, 6)}">${bedNames.map((n) => bookPiece(n, pk)).join('')}</ul>
      <h4 class="bk-h">Living and dining</h4>
      <ul class="bk-pieces" style="--n:${clamp(livingNames.length, 4, 6)}">${livingNames.map((n) => bookPiece(n, pk)).join('')}</ul>
      ${notes.length ? `<p class="bk-note">${notes.join(' ')}</p>` : ''}
      <h4 class="bk-h">Prices, ex VAT</h4>
      <dl class="bk-prices">${prices}</dl>
      <div class="bk-add">
        <div class="select"><select data-bk-size="${pk.id}" aria-label="Size of ${esc(pk.name)}">${sizes}</select></div>
        <button class="btn btn-ink btn-sm" type="button" data-bk-add="${pk.id}">Add to quote<span class="btn-ico">${icon('plus')}</span></button>
      </div>
    </section>`;
}

function buildBook() {
  if (book.built) return;
  book.built = true;
  const cover = byId.alba || PACKS[0];
  bookTrack.innerHTML = `<div class="spread">
    <div class="page bk-cover">
      <img src="${img(cover.hero, 1000)}" alt="" loading="lazy" decoding="async">
      <div class="bk-cover-in">
        <p class="bk-mast" aria-label="Furnishing Packs">furnishing packs<i></i></p>
        <p class="bk-lines"><span>The catalogue</span><b>Every room,<br>ready to let</b><span>${new Date().getFullYear()}</span></p>
        <p class="bk-foot-line"><span>${['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'][BOOK.length] || BOOK.length} packs</span><i></i><span>Every piece</span><i></i><span>Every price</span></p>
      </div>
    </div>
    <nav class="page" aria-label="Contents">
      <p class="bk-kicker"><b>Contents</b><span>From, ex VAT</span></p>
      <div class="bk-contents">${BOOK.map((pk, i) => `<button type="button" data-bk-go="${i + 1}"><i>${two(i + 1)}</i><b>${esc(pk.name)}<small>${esc(pk.tone)}</small></b><span>${money(lowest(pk, 'apartment'))}</span></button>`).join('')}</div>
    </nav></div>
    ${BOOK.map((pk) => `<div class="spread">${bookPackPages(pk)}</div>`).join('')}`;
  [...bookTrack.children].forEach((sp) => bookSizes.observe(sp));
  syncBookAdds();
  bookWhere();
  fitBook();
}
// Whenever the spread in view changes size (the window, a font arriving, a line wrapping), the book refits
// to it, so a page is never cut off; it would rather be taller than clipped.
const bookSizes = new ResizeObserver((entries) => {
  if (!book.turning && entries.some((en) => en.target === bookTrack.children[book.s])) fitBook();
});

function syncBookAdds() {
  if (!book.built) return;
  $$('[data-bk-add]', bookTrack).forEach((btn) => {
    const [type, beds] = $(`[data-bk-size="${btn.dataset.bkAdd}"]`, bookTrack).value.split(':');
    setAddBtn(btn, inQuote(btn.dataset.bkAdd, type, Number(beds)), 'Add to quote');
  });
}

// The arrows, the keyboard and a swipe all turn a whole spread.
function bookGo(s) {
  const to = clamp(s, 0, BOOK_SPREADS - 1);
  const left = to * bookTrack.clientWidth;
  const far = Math.abs(to - book.s) > 1;
  clearTimeout(bookSettle);
  settleBook();
  // The book knows where it is going at once, so a quick second click carries on from there.
  bookLabels(to);
  book.turning = true;
  bookSettle = setTimeout(landBook, 900);
  // The next spread slides in; a far one (from the contents) fades through, instead of racing past every page between.
  if (far && !reduceMotion) {
    bookTrack.classList.add('is-turning');
    setTimeout(() => {
      bookTrack.scrollTo({ left, behavior: 'auto' });
      requestAnimationFrame(() => bookTrack.classList.remove('is-turning'));
    }, 220);
    return;
  }
  bookTrack.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
}
// The book takes the height of the spread in view and glides to the next one's as the page turns,
// so a short spread never sits in a tall, empty frame.
function fitBook() {
  if (!book.built) return;
  const from = bookTrack.offsetHeight;
  bookTrack.classList.add('is-measuring');
  const spread = bookTrack.children[book.s];
  // Spreads off screen aren't laid out (content-visibility), so the one in view is laid out for real to be measured.
  spread.style.contentVisibility = 'visible';
  const h = spread.offsetHeight;
  spread.style.contentVisibility = '';
  bookTrack.classList.remove('is-measuring');
  book.h = h || from;
  if (!h || Math.abs(h - from) < 2) { bookTrack.style.height = `${book.h}px`; return; }
  bookTrack.style.height = `${from}px`;
  void bookTrack.offsetHeight;
  bookTrack.style.height = `${h}px`;
}
// Once the page has landed: where the book is, read back from its scroll position, and its height fitted.
function landBook() {
  book.turning = false;
  bookWhere();
  fitBook();
}
// A height still gliding when the next turn starts would make the browser cancel the turn, so it lands at once.
function settleBook() {
  if (!book.h) return;
  bookTrack.style.transition = 'none';
  bookTrack.style.height = `${book.h}px`;
  void bookTrack.offsetHeight;
  bookTrack.style.transition = '';
}
// Where the book is, from its scroll position (a swipe), or set at once by a click on an arrow or the contents.
function bookWhere() {
  bookLabels(clamp(Math.round(bookTrack.scrollLeft / bookTrack.clientWidth), 0, BOOK_SPREADS - 1));
}
function bookLabels(s) {
  book.s = s;
  const label = (q) => (q < 1 ? 'Contents' : BOOK[q - 1].name);
  // Said to screen readers only, and only when the spread changes: the page itself shows where you are.
  const said = s === 0 ? 'The catalogue: contents' : `${label(s)}, pack ${s} of ${BOOK.length}`;
  if ($('#book-where').textContent !== said) $('#book-where').textContent = said;
  $('#book-home').disabled = s === 0;
  // The next pack by name, above the book and (where pages stack) under it.
  const tn = $('#book-next');
  tn.disabled = s >= BOOK_SPREADS - 1;
  $('#book-next-name').textContent = tn.disabled ? '' : label(s + 1);
  tn.setAttribute('aria-label', tn.disabled ? 'Last page' : `Next: ${label(s + 1)}`);
  const tp = $('#book-prev');
  tp.disabled = s <= 0;
  tp.setAttribute('aria-label', tp.disabled ? 'First page' : `Previous: ${label(s - 1)}`);
  const fn = $('#book-foot-next');
  fn.hidden = tn.disabled;
  if (!fn.hidden) fn.firstElementChild.innerHTML = `Next: <b>${esc(label(s + 1))}</b>`;
  const fp = $('#book-foot-prev');
  fp.hidden = tp.disabled;
  if (!fp.hidden) fp.lastElementChild.innerHTML = s - 1 < 1 ? 'Contents' : `<b>${esc(label(s - 1))}</b>`;
}
let bookRaf = 0;
let bookSettle = 0;
bookTrack.addEventListener('scroll', () => {
  // A swipe updates where the book is as it moves; during a click's turn the destination is already known.
  if (!book.turning && !bookRaf) bookRaf = requestAnimationFrame(() => { bookRaf = 0; bookWhere(); });
  // Resizing mid-turn would make the browser snap back, so the book fits the new spread once the page has landed.
  clearTimeout(bookSettle);
  bookSettle = setTimeout(landBook, 160);
}, { passive: true });
addEventListener('resize', () => { if (book.built) { bookTrack.scrollTo({ left: book.s * bookTrack.clientWidth, behavior: 'auto' }); bookWhere(); fitBook(); } });
// Every turn starts the reader at the top of the new spread, wherever they were reading on the last one.
const turn = (s) => {
  bookGo(s);
  if ($('#book').getBoundingClientRect().top < 0) scrollToEl($('#book'), -84);
};
$('#book-prev').addEventListener('click', () => turn(book.s - 1));
$('#book-next').addEventListener('click', () => turn(book.s + 1));
$('#book-home').addEventListener('click', () => turn(0));
$('#book-foot-next').addEventListener('click', () => turn(book.s + 1));
$('#book-foot-prev').addEventListener('click', () => turn(book.s - 1));
bookTrack.addEventListener('keydown', (e) => {
  if (e.target.closest('select')) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); bookGo(book.s + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); bookGo(book.s - 1); }
});
bookTrack.addEventListener('change', (e) => { if (e.target.matches('[data-bk-size]')) syncBookAdds(); });
// Any photo in the catalogue opens large in the full view, on that very picture, with the rest of
// that room's photos to step through; a closer look for the customer, one tap away.
function zoomPhoto(el) {
  const s = [...bookTrack.children].indexOf(el.closest('.spread'));
  const own = BOOK[s - 1];
  const packs = own ? [own, ...PACKS.filter((p) => p !== own)] : PACKS;
  for (const pk of packs) {
    for (const room of ['bedroom', 'living']) {
      const i = photosFor(pk, room).findIndex((p) => el.currentSrc.includes(p.src) || el.src.includes(p.src));
      if (i >= 0) return openViewer(pk.id, room, i);
    }
  }
}
bookTrack.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-zoom]')) { e.preventDefault(); zoomPhoto(e.target); }
});
bookTrack.addEventListener('click', (e) => {
  const zoom = e.target.closest('[data-zoom]');
  if (zoom) return zoomPhoto(zoom);
  const go = e.target.closest('[data-bk-go]');
  if (go) return turn(Number(go.dataset.bkGo));
  // A category on a pack's page opens that pack, in that category, in the pack section above.
  const suit = e.target.closest('[data-bk-sector]');
  if (suit) {
    if (show.sector !== suit.dataset.bkSector) setWho(suit.dataset.bkSector, { animate: false });
    const at = show.order.indexOf(suit.dataset.bkPack);
    if (at >= 0 && at !== show.i) { show.i = at; renderShow(); }
    return scrollToEl($('#price'));
  }
  const add = e.target.closest('[data-bk-add]');
  if (!add) return;
  if (add.classList.contains('is-added')) return scrollToEl($('#quote'));
  const [type, beds] = $(`[data-bk-size="${add.dataset.bkAdd}"]`, bookTrack).value.split(':');
  addLine({ pack: add.dataset.bkAdd, type, beds: Number(beds), qty: 1 });
});
document.addEventListener('fp:change', syncBookAdds);
if ('requestIdleCallback' in window) requestIdleCallback(buildBook, { timeout: 2500 });
else setTimeout(buildBook, 1200);
new IntersectionObserver(([en], ob) => { if (en.isIntersecting) { buildBook(); ob.disconnect(); } }, { rootMargin: '1200px 0px' }).observe($('#catalogue'));
// Measured again as the book comes into view, in case the page width changed while it was away.
new IntersectionObserver(([en]) => { if (en.isIntersecting) fitBook(); }, { rootMargin: '200px 0px' }).observe($('#book'));

/* ================================================================== */
/* Shared: nav tone, reveals, toast                                    */

const nav = $('#nav');
const tonedSections = $$('main > section[data-tone], footer[data-tone]');
let toneQueued = false;
function queueTone() {
  if (toneQueued) return;
  toneQueued = true;
  requestAnimationFrame(() => {
    toneQueued = false;
    // Whichever section sits under the nav's lower edge sets its colours.
    const y = nav.getBoundingClientRect().bottom;
    const under = tonedSections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= y && r.bottom > y;
    });
    nav.dataset.tone = under?.dataset.tone || 'ink';
    // The front page's own controls step away as soon as the visitor scrolls on, and return at the top.
    const away = scrollY > 64;
    if (away !== hero.classList.contains('is-away')) {
      hero.classList.toggle('is-away', away);
      heroUI.inert = away;
    }
    // Once the hero is mostly behind the visitor, the island folds to the top left, out of the page's way.
    const compact = hero.getBoundingClientRect().bottom < innerHeight * 0.55;
    if (compact !== nav.classList.contains('is-compact')) setNav({ compact });
    else if (nav.classList.contains('is-open') && Math.abs(scrollY - navOpenAt) > 160) setNav({ open: false });
  });
}
addEventListener('resize', queueTone);
addEventListener('scroll', queueTone, { passive: true });

// The folded island: the arrow opens Packs, Pricing, How it works and FAQ, and they fold away
// again on a link, on Escape, on a tap elsewhere or once the page has moved on.
const navMore = $('#nav-more');
const navLinks = $('#nav-links');
let navOpenAt = 0;
function setNav({ compact = nav.classList.contains('is-compact'), open = false } = {}) {
  const isOpen = compact && open;
  nav.classList.toggle('is-compact', compact);
  nav.classList.toggle('is-open', isOpen);
  $('#nav-more-wrap').inert = !compact;
  navLinks.inert = compact ? !isOpen : innerWidth <= 960;
  // Folded: the phone number and Quote go with the links (on phones they live in the bottom bar).
  $('#nav-act').inert = compact && (!isOpen || innerWidth <= 960);
  navMore.setAttribute('aria-expanded', String(isOpen));
  navMore.setAttribute('aria-label', isOpen ? 'Close the menu' : 'Open the menu');
  if (isOpen) navOpenAt = scrollY;
}
navMore.addEventListener('click', () => setNav({ open: !nav.classList.contains('is-open') }));
navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setNav({ open: false }); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    setNav({ open: false });
    navMore.focus();
  }
});
document.addEventListener('pointerdown', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target)) setNav({ open: false }); });
addEventListener('resize', () => setNav({ open: nav.classList.contains('is-open') }));
setNav({ compact: false });

// On phones the call and quote bar appears once the visitor is past the hero,
// and steps aside at the quote and the footer, where the same actions are already on screen.
const mbar = $('#mbar');
const mbarState = { pastHero: false, hidden: new Set() };
const syncBar = () => mbar.classList.toggle('is-on', mbarState.pastHero && !mbarState.hidden.size);
new IntersectionObserver(([en]) => {
  mbarState.pastHero = en.intersectionRatio < 0.35;
  syncBar();
}, { threshold: [0, 0.35] }).observe(hero);
new IntersectionObserver((entries) => {
  entries.forEach((en) => (en.isIntersecting ? mbarState.hidden.add(en.target) : mbarState.hidden.delete(en.target)));
  syncBar();
}, { rootMargin: '0px 0px -30% 0px' }).observe($('#quote'));
document.querySelectorAll('.foot').forEach((el) => new IntersectionObserver(([en]) => {
  if (en.isIntersecting) mbarState.hidden.add(el); else mbarState.hidden.delete(el);
  syncBar();
}).observe(el));

const toastEl = $('#toast');
let toastTimer = 0;
function toast(text) {
  $('#toast-text').textContent = text;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 3400);
}

/* ================================================================== */
/* Start                                                               */

setPack(state.pack, { animate: false });
queueTone();
requestAnimationFrame(() => {
  queueTone();
  hero.classList.add('is-in');
  heroName.classList.add('is-entering');
  void heroName.offsetWidth;
  heroName.classList.remove('is-entering');
});
