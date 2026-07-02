/* =========================================================
   LUNEX DISPLAYS — site interactions
   ========================================================= */
(() => {
  'use strict';

  // Always begin at the hero — stop the browser from restoring a mid-page scroll on reload.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.getElementById('loader');

  /* ---------- loader: fade out once the page (and hero image) is ready ---------- */
  function dismissLoader() {
    if (!loader || loader.classList.contains('is-done')) return;
    loader.classList.add('is-done');
    setTimeout(openGateway, 350);
  }
  const heroImg = document.getElementById('heroImg');
  if (loader) {
    if (heroImg) {
      if (heroImg.complete) dismissLoader();
      else { heroImg.addEventListener('load', dismissLoader); heroImg.addEventListener('error', dismissLoader); }
    }
    // safety net so the loader never gets stuck
    setTimeout(dismissLoader, 1800);
  }

  /* ---------- hero parallax (lightweight, replaces the old scroll-canvas film) ---------- */
  const heroParallax = document.getElementById('heroParallax');
  if (heroParallax && !reduceMotion) {
    let ticking = false;
    const onScrollParallax = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroParallax.style.transform = `translateY(${y * 0.32}px)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  }

  /* =========================================================
     NAV: stuck state + mobile menu
     ========================================================= */
  const siteHeader = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  const onScrollNav = () => siteHeader && siteHeader.classList.toggle('is-stuck', window.scrollY > 20);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navMobile.hidden = open;
  });
  navMobile.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMobile.hidden = true;
    })
  );

  /* =========================================================
     GATEWAY (Rent vs Buy)
     ========================================================= */
  const gateway = document.getElementById('gateway');
  const gatewaySkip = document.getElementById('gatewaySkip');
  function openGateway() {
    if (!gateway) return;
    try { if (sessionStorage.getItem('lx_gw')) return; sessionStorage.setItem('lx_gw', '1'); } catch (e) {}
    gateway.classList.add('is-on');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeGateway() {
    if (!gateway) return;
    gateway.classList.remove('is-on');
    document.documentElement.style.overflow = '';
  }
  if (gatewaySkip) gatewaySkip.addEventListener('click', closeGateway);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGateway(); });

  /* =========================================================
     REVEAL on scroll
     ========================================================= */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const el = e.target;
        setTimeout(() => el.classList.add('is-in'), reduceMotion ? 0 : (i % 4) * 70);
        io.unobserve(el);
        const c = el.matches('[data-count]') ? el : el.querySelector?.('[data-count]');
        if (c) animateCount(c);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));

  /* ---------- number count up (keeps any suffix child, e.g. <b>+</b>) ---------- */
  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const end = parseInt(el.dataset.count, 10) || 0;
    const setVal = (v) => {
      const txt = String(v);
      if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.nodeValue = txt;
      else el.insertBefore(document.createTextNode(txt), el.firstChild);
    };
    if (reduceMotion) { setVal(end); return; }
    const dur = 1400, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* =========================================================
     CONVERSION: promo dismiss · quote form · scroll lead popup
     ========================================================= */
  const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // POST a form to Web3Forms (free, no backend). Paste your access key in the
  // hidden "access_key" input to start receiving emails. Until then it runs in
  // demo mode (shows success without sending) so the form is testable.
  function sendForm(form) {
    const data = new FormData(form);
    const key = data.get('access_key');
    if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      return new Promise((r) => setTimeout(() => r(true), 450));
    }
    return fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      .then((res) => res.json()).then((j) => !!j.success).catch(() => false);
  }

  // urgency strip dismiss
  const promo = document.getElementById('promo');
  const promoX = document.getElementById('promoX');
  if (promoX) promoX.addEventListener('click', () => promo.classList.add('is-hidden'));

  // quote / lead form
  const qForm = document.getElementById('quoteForm');
  const qMsg = document.getElementById('quoteMsg');
  if (qForm) {
    const fields = ['q-name', 'q-email', 'q-phone'].map((id) => document.getElementById(id));
    qForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const [name, em, ph] = fields;
      let bad = null;
      if (!name.value.trim()) bad = name;
      else if (!emailOK(em.value.trim())) bad = em;
      else if (ph.value.trim().replace(/\D/g, '').length < 6) bad = ph;
      fields.forEach((f) => f.removeAttribute('aria-invalid'));
      if (bad) {
        bad.setAttribute('aria-invalid', 'true');
        qMsg.classList.add('is-error');
        qMsg.textContent = 'Please add your name, a valid email, and a phone number.';
        bad.focus();
        return;
      }
      qMsg.classList.remove('is-error');
      qMsg.textContent = 'Sending…';
      sendForm(qForm).then((ok) => {
        if (ok) { qMsg.textContent = '✓ Thanks! Your free quote & 3D mockup are on the way — we’ll reply within 24 hours.'; qForm.reset(); }
        else { qMsg.classList.add('is-error'); qMsg.textContent = 'Something went wrong — please call us at +1 (312) 555-0142.'; }
      });
    });
  }

  // scroll-triggered lead popup (once per session)
  const leadPop = document.getElementById('leadPop');
  const leadX = document.getElementById('leadX');
  const leadForm = document.getElementById('leadForm');
  const leadEmail = document.getElementById('lead-email');
  const leadFine = document.getElementById('leadFine');
  let leadShown = false;
  try { leadShown = !!sessionStorage.getItem('lx_lead'); } catch (e) {}

  function openLead() {
    if (leadShown || !leadPop) return;
    leadShown = true;
    try { sessionStorage.setItem('lx_lead', '1'); } catch (e) {}
    leadPop.classList.add('is-on');
  }
  function closeLead() { if (leadPop) leadPop.classList.remove('is-on'); }

  const leadWatch = () => {
    if (window.scrollY + window.innerHeight > document.body.scrollHeight * 0.55) {
      openLead();
      window.removeEventListener('scroll', leadWatch);
    }
  };
  if (leadPop) {
    window.addEventListener('scroll', leadWatch, { passive: true });
    leadPop.addEventListener('click', (e) => { if (e.target === leadPop) closeLead(); });
    if (leadX) leadX.addEventListener('click', closeLead);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLead(); });
    if (leadForm) leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!emailOK(leadEmail.value.trim())) { leadEmail.setAttribute('aria-invalid', 'true'); leadEmail.focus(); return; }
      leadFine.textContent = 'Sending…';
      sendForm(leadForm).then((ok) => {
        if (ok) { leadForm.innerHTML = ''; leadFine.textContent = '✓ Done! Check your inbox for the 2026 catalog & your quote.'; }
        else { leadFine.textContent = 'Something went wrong — please email hello@lunexdisplays.com.'; }
      });
    });
  }
})();
