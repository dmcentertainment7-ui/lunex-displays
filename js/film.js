/* =========================================================
   LUNEX DISPLAYS — scroll-scrubbed film hero
   (space → visor → dive → Chicago → pixels → LED wall logo)
   ========================================================= */
(() => {
  'use strict';

  const film = document.querySelector('.film');
  const canvas = document.getElementById('filmCanvas');
  if (!film || !canvas) return;

  const FRAME_COUNT = 569;      // user's final cut: commercial.mp4, 23.7s @24fps
  const SHOTS = [7, 8, 6, 6];   // seconds per shot — drives beat-copy windows
  const PX_PER_FRAME = 5;       // scroll distance that advances one frame

  const end = document.getElementById('filmEnd');
  const cue = document.getElementById('filmCue');
  const beats = [0, 1, 2].map((i) => document.getElementById('filmBeat' + i));
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { film.classList.add('film--static'); return; }

  const ctx = canvas.getContext('2d');
  const frames = new Array(FRAME_COUNT).fill(null);
  const FRAMESET = 'v2'; // bump when frames are replaced — filenames repeat across sets
  const src = (i) => 'frames/frame_' + String(i + 1).padStart(4, '0') + '.jpg?' + FRAMESET;

  /* beat-copy windows from shot boundaries (fractions of the whole film) */
  const total = SHOTS.reduce((a, b) => a + b, 0);
  let acc = 0;
  const bounds = SHOTS.map((s) => (acc += s) / total);
  const windows = [
    [0.02, bounds[0] - 0.06],
    [bounds[0] + 0.04, bounds[1] - 0.06],
    [bounds[1] + 0.03, bounds[2] - 0.04],
  ];
  const END_AT = 0.9;

  let current = -1;
  let target = 0;

  function drawFrame(i) {
    let img = null, j = i;
    while (j >= 0 && !(img = frames[j])) j--;
    if (!img) { j = i; while (j < FRAME_COUNT && !(img = frames[j])) j++; }
    if (!img) return;
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / img.width, ch / img.height);
    const w = img.width * s, h = img.height * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    current = i;
  }

  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    if (film.classList.contains('is-live')) {
      film.style.height = (FRAME_COUNT * PX_PER_FRAME + window.innerHeight) + 'px';
    }
    if (current >= 0) drawFrame(current);
  }
  window.addEventListener('resize', layout);

  function setBeats(p) {
    const fade = 0.045;
    beats.forEach((b, k) => {
      if (!b) return;
      const a = windows[k][0], z = windows[k][1];
      let o = 0;
      if (p > a && p < z) o = Math.min((p - a) / fade, (z - p) / fade, 1);
      b.style.opacity = o.toFixed(3);
    });
    if (end) end.classList.toggle('is-on', p >= END_AT);
    if (cue) cue.classList.toggle('is-off', p > 0.02);
  }

  function onScroll() {
    const rect = film.getBoundingClientRect();
    const track = film.offsetHeight - window.innerHeight;
    const p = track > 0 ? Math.min(Math.max(-rect.top / track, 0), 1) : 0;
    const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
    if (idx !== target || current !== idx) { target = idx; drawFrame(idx); }
    setBeats(p);
  }

  /* progressive preload: every 8th frame → every 2nd → all */
  let loaded = 0;
  function load(i) {
    return new Promise((res) => {
      if (frames[i]) return res();
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        frames[i] = img;
        loaded++;
        const q = Math.round((loaded / FRAME_COUNT) * 100);
        if (fill) fill.style.width = q + '%';
        if (pct) pct.textContent = q + '%';
        res();
      };
      img.onerror = () => res();
      img.src = src(i);
    });
  }
  function pass(stride) {
    const jobs = [];
    for (let i = 0; i < FRAME_COUNT; i += stride) jobs.push(load(i));
    return Promise.all(jobs);
  }

  (async () => {
    await load(0);
    layout();
    drawFrame(0);
    await pass(8);
    film.classList.add('is-live');
    layout();
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // self-healing watcher: some environments throttle scroll events;
    // a cheap per-frame scrollY check keeps the film in sync regardless.
    let lastY = -1;
    (function watch() {
      if (window.scrollY !== lastY) { lastY = window.scrollY; onScroll(); }
      requestAnimationFrame(watch);
    })();
    await pass(2);
    await pass(1);
    drawFrame(target);
  })();
})();
