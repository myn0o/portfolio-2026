/* =========================================================
   Portfolio Emma Nguyen
   GSAP + ScrollTrigger + SplitText + Lenis
   Les projets sont chargés depuis data/projects.json
   ========================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var body = document.body;
  var PAGE = body.dataset.page;
  var NO_CATEGORY_ROTATION = PAGE === 'creation-digitale';
  var PROJECTS_URL = new URL('./data/projects.json', window.location.href).href;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.config({ nullTargetWarn: false });

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function safe(name, fn) {
    try { return fn(); } catch (err) { console.warn('[' + name + ']', err); }
  }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5v15l12.5-7.5z"/></svg>',
    upright: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>',
    swirl: '<svg class="swirl" viewBox="0 0 42 20" aria-hidden="true"><path d="M1 13c6 0 8-9 14-9s6 10 0 10-4-9 5-9 9 6 21 6"/></svg>'
  };

  /* ---------------------------------------------------------
     Smooth scroll (Lenis) relié à ScrollTrigger
     --------------------------------------------------------- */
  var lenis = null;

  function initScroll() {
    if (REDUCE || typeof Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target, immediate) {
    var offset = target === 0 ? 0 : -30;
    if (lenis) {
      lenis.scrollTo(target, { offset: offset, duration: 1.5, immediate: !!immediate });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    } else {
      target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
    }
  }

  /* ---------------------------------------------------------
     Fond : blobs lumineux qui respirent et suivent le scroll
     --------------------------------------------------------- */
  function initBackground() {
    var bg = $('.bg');
    var blobs = $$('.bg__blob');
    if (!bg || REDUCE) return;

    blobs.forEach(function (b, i) {
      gsap.to(b, {
        xPercent: gsap.utils.random(-22, 22),
        yPercent: gsap.utils.random(-20, 20),
        scale: gsap.utils.random(0.8, 1.25),
        rotation: NO_CATEGORY_ROTATION ? 0 : gsap.utils.random(-28, 28),
        duration: gsap.utils.random(6, 10),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4
      });
    });

    var blue = $('.bg__blob--blue'), teal = $('.bg__blob--teal'), light = $('.bg__blob--light'), deep = $('.bg__blob--deep');
    gsap.timeline({
      scrollTrigger: { trigger: body, start: 'top top', end: 'bottom bottom', scrub: 2 }
    })
      .to(blue, { x: function () { return innerWidth * 0.45; }, y: function () { return innerHeight * 0.7; }, ease: 'none' }, 0)
      .to(light, { x: function () { return -innerWidth * 0.55; }, y: function () { return innerHeight * 0.6; }, ease: 'none' }, 0)
      .to(teal, { x: function () { return innerWidth * 0.4; }, y: function () { return innerHeight * 0.75; }, ease: 'none' }, 0)
      .to(deep, { x: function () { return -innerWidth * 0.3; }, y: function () { return -innerHeight * 0.65; }, ease: 'none' }, 0);

    if (!TOUCH) {
      gsap.set(bg, { scale: 1.1 });
      var bx = gsap.quickTo(bg, 'x', { duration: 1.2, ease: 'power3' });
      var by = gsap.quickTo(bg, 'y', { duration: 1.2, ease: 'power3' });
      window.addEventListener('pointermove', function (e) {
        bx((e.clientX / innerWidth - 0.5) * -64);
        by((e.clientY / innerHeight - 0.5) * -48);
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------
     Curseur personnalisé
     --------------------------------------------------------- */
  function initCursor() {
    if (TOUCH || REDUCE) return;
    var c = $('.cursor'), d = $('.cursor-dot'), label = $('.cursor__label');
    if (!c) return;
    gsap.set([c, d], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    var cx = gsap.quickTo(c, 'x', { duration: 0.5, ease: 'power3' });
    var cy = gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3' });
    var dx = gsap.quickTo(d, 'x', { duration: 0.08 });
    var dy = gsap.quickTo(d, 'y', { duration: 0.08 });

    window.addEventListener('pointermove', function (e) {
      cx(e.clientX); cy(e.clientY); dx(e.clientX); dy(e.clientY);
    }, { passive: true });

    var LABELS = [
      ['[data-cursor]', null],
      ['.phone, .play-btn, [data-video], [data-video-carousel]', 'Lecture'],
      ['.photo, .work__img, .browsers-grid .browser, .film__frames .browser', 'Zoom'],
      ['.folder', 'Ouvrir']
    ];

    document.addEventListener('pointerover', function (e) {
      var t = e.target;
      for (var i = 0; i < LABELS.length; i++) {
        var el = t.closest(LABELS[i][0]);
        if (el) {
          label.textContent = LABELS[i][1] || el.getAttribute('data-cursor') || 'Voir';
          c.classList.add('is-label');
          c.classList.remove('is-hover');
          gsap.to(d, { scale: 0, duration: 0.2 });
          return;
        }
      }
      c.classList.remove('is-label');
      gsap.to(d, { scale: 1, duration: 0.2 });
      if (t.closest('a, button, [role="button"]')) c.classList.add('is-hover');
      else c.classList.remove('is-hover');
    });

    document.addEventListener('pointerdown', function () { gsap.to(c, { scale: 0.8, duration: 0.15 }); });
    document.addEventListener('pointerup', function () { gsap.to(c, { scale: 1, duration: 0.4, ease: 'back.out(3)' }); });
    document.addEventListener('mouseleave', function () { gsap.to([c, d], { opacity: 0, duration: 0.3 }); });
    document.addEventListener('mouseenter', function () { gsap.to([c, d], { opacity: 1, duration: 0.3 }); });
  }

  /* ---------------------------------------------------------
     Transitions de page (rideau bleu + noir)
     --------------------------------------------------------- */
  var T = {};

  function initTransitionLayers() {
    T.blue = $('.transition__layer--blue');
    T.dark = $('.transition__layer--dark');
    T.logo = $('.transition__layer--dark img');
    gsap.set([T.blue, T.dark], { y: 0, yPercent: 0 });
  }

  function revealPage() {
    return gsap.timeline({
      onComplete: function () {
        gsap.set([T.blue, T.dark], { yPercent: 100 });
        html.classList.remove('is-transitioning');
      }
    })
      .to(T.logo, { opacity: 1, scale: 1, duration: 0.01 })
      .to(T.logo, { opacity: 0, scale: 0.6, rotation: NO_CATEGORY_ROTATION ? 0 : 20, duration: 0.35, ease: 'power2.in' })
      .to(T.dark, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.1)
      .to(T.blue, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.25);
  }

  function leavePage(href) {
    html.classList.add('is-transitioning');
    if (lenis) lenis.stop();
    gsap.timeline({ onComplete: function () { window.location.href = href; } })
      .fromTo(T.blue, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' })
      .fromTo(T.dark, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' }, 0.12)
      .fromTo(T.logo, { opacity: 0, scale: 0.5, rotation: NO_CATEGORY_ROTATION ? 0 : -25 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.2)' }, 0.55);
  }

  function initLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || e.defaultPrevented) return;
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (/^(mailto|tel):/i.test(href)) return;

      if (href.charAt(0) === '#') {
        var t = $(href);
        if (t) { e.preventDefault(); closeMenu(); scrollToTarget(t); }
        return;
      }

      var url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      var samePage = url.pathname === window.location.pathname;
      if (samePage && url.hash) {
        var target = $(url.hash);
        if (target) { e.preventDefault(); closeMenu(); scrollToTarget(target); }
        return;
      }
      if (!/\.html?$/i.test(url.pathname) && !/\/$/.test(url.pathname)) return;
      e.preventDefault();
      closeMenu();
      leavePage(a.href);
    });

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        html.classList.remove('is-transitioning');
        gsap.set([T.blue, T.dark], { yPercent: 100 });
        if (lenis) lenis.start();
      }
    });
  }

  /* ---------------------------------------------------------
     Préloader (accueil, une fois par session)
     --------------------------------------------------------- */
  function runPreloader() {
    var pre = $('.preloader');
    if (!pre || REDUCE) return null;
    var seen = false;
    try { seen = sessionStorage.getItem('en-preloader') === '1'; sessionStorage.setItem('en-preloader', '1'); } catch (err) { /* stockage indisponible */ }
    if (seen) return null;

    html.classList.add('show-preloader');
    gsap.set([T.blue, T.dark], { yPercent: 100 });
    if (lenis) lenis.stop();

    return new Promise(function (resolve) {
      var count = $('.preloader__count span');
      var o = { v: 0 };
      gsap.timeline({
        onComplete: function () {
          html.classList.remove('show-preloader');
          if (lenis) lenis.start();
        }
      })
        .from('.preloader__name', { yPercent: 120, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .to(o, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: function () { count.textContent = Math.round(o.v); } }, 0)
        .to('.preloader__bar', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
        .to('.preloader__count, .preloader__name', { yPercent: -60, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.05 }, '+=0.1')
        .to(pre, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.15')
        .call(resolve, null, '-=0.65');
    });
  }

  /* ---------------------------------------------------------
     Header : masquage au scroll, état actif, menu mobile
     --------------------------------------------------------- */
  var menuTl = null;
  var menuOpen = false;

  function initNav() {
    var header = $('.header');
    var burger = $('.burger');
    var menu = $('.mobile-menu');

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (self) {
        var y = self.scroll();
        header.classList.toggle('is-scrolled', y > 30);
      }
    });

    if (menu && burger) {
      var links = $$('a span', menu);
      menuTl = gsap.timeline({ paused: true })
        .set(menu, { visibility: 'visible' })
        .fromTo(menu, { clipPath: 'circle(0% at calc(100% - 46px) 46px)' }, { clipPath: 'circle(150% at calc(100% - 46px) 46px)', duration: 0.8, ease: 'expo.inOut' })
        .from(links, { yPercent: 110, rotation: NO_CATEGORY_ROTATION ? 0 : 6, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.35)
        .from('.mobile-menu__foot', { opacity: 0, y: 10, duration: 0.4 }, 0.6);

      burger.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
    }

    if (PAGE === 'index') {
      var map = [['#accueil', 0], ['#competences', 1], ['#projets', 2], ['#contact', 4]];
      var navLinks = $$('.nav__link');
      map.forEach(function (m) {
        var sec = $(m[0]);
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: function (self) {
            if (!self.isActive) return;
            navLinks.forEach(function (l, i) { l.classList.toggle('is-active', i === m[1]); });
          }
        });
      });
    }
  }

  function openMenu() {
    if (!menuTl) return;
    menuOpen = true;
    html.classList.add('menu-open');
    $('.burger').setAttribute('aria-expanded', 'true');
    $('.mobile-menu').setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    menuTl.timeScale(1).play();
  }

  function closeMenu() {
    if (!menuTl || !menuOpen) return;
    menuOpen = false;
    html.classList.remove('menu-open');
    $('.burger').setAttribute('aria-expanded', 'false');
    $('.mobile-menu').setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
    menuTl.timeScale(1.6).reverse();
  }

  /* ---------------------------------------------------------
     Utilitaires d'animation
     --------------------------------------------------------- */
  function splitChars(el) {
    if (!el) return { chars: [] };
    gsap.set(el, { perspective: 600 });
    return SplitText.create(el, { type: 'words,chars' });
  }

  function drawPath(path) {
    var len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    return len;
  }

  function magnetic(el) {
    if (TOUCH || REDUCE) return;
    var strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
    var xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    var yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    });
    el.addEventListener('pointerleave', function () {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
    });
  }

  function tilt(trigger, target, max) {
    if (TOUCH || REDUCE) return;
    max = max || 8;
    gsap.set(target, { transformPerspective: 900 });
    var rx = gsap.quickTo(target, 'rotationX', { duration: 0.7, ease: 'power3' });
    var ry = gsap.quickTo(target, 'rotationY', { duration: 0.7, ease: 'power3' });
    trigger.addEventListener('pointermove', function (e) {
      var r = trigger.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
      rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
    });
    trigger.addEventListener('pointerleave', function () { rx(0); ry(0); });
  }

  /* ---------------------------------------------------------
     HERO accueil : composition, texture et animation
     --------------------------------------------------------- */
  function introHome(delay) {
    var tl = gsap.timeline({ delay: delay });
    var wrap = $('.hero__card-wrap');
    var titleRows = $$('.hero__title-row');

    tl.from(wrap, { opacity: 0, scale: 0.97, y: 28, duration: 1.5, ease: 'power3.out' })
      .from(titleRows, { yPercent: 50, opacity: 0, stagger: 0.24, duration: 1.25, ease: 'expo.out' }, 0.75)
      .from('.hero__sub', { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out' }, 1.35)
      .from('.hero__projects-link', { opacity: 0, y: 14, duration: 1, ease: 'power3.out' }, 1.55)
      .from('.hero__avatar', { opacity: 0, y: 18, scale: 0.96, duration: 1.6, ease: 'power3.out' }, 0.85)
      .from('.hero__tool-badge', { opacity: 0, y: 20, scale: 0.82, stagger: 0.28, duration: 1.25, ease: 'back.out(1.6)' }, 1.1)
      .from('.header__logo, .nav > *, .burger', { y: -24, opacity: 0, stagger: 0.07, duration: 0.85, ease: 'power3.out' }, 0.4);

    if (!REDUCE) {
      gsap.to('.hero__avatar img', { y: -5, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    // Parallaxe au scroll
    var mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', function () {
      gsap.to('.hero__content', { yPercent: 25, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    return tl;
  }

  function introPage(delay) {
    var tl = gsap.timeline({ delay: delay });
    var years = splitChars($('.page-hero__years'));
    var title = splitChars($('.page-hero__title'));
    var textEl = $('.page-hero__text');
    var lines = textEl ? SplitText.create(textEl, { type: 'lines', mask: 'lines' }) : { lines: [] };

    tl.from('.header__logo, .nav > *, .burger', { y: -24, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out' }, 0)
      .from(years.chars, { opacity: 0, y: 26, rotation: NO_CATEGORY_ROTATION ? 0 : -20, stagger: 0.04, duration: 0.6, ease: 'back.out(2.5)' }, 0.1)
      .from(title.chars, { yPercent: 110, opacity: 0, rotationX: NO_CATEGORY_ROTATION ? 0 : -95, transformOrigin: '50% 100%', stagger: 0.035, duration: 1, ease: 'expo.out' }, 0.25)
      .from(lines.lines, { yPercent: 105, duration: 1, stagger: 0.1, ease: 'expo.out', onComplete: function () { if (lines.revert) lines.revert(); } }, 0.65);
    return tl;
  }

  /* ---------------------------------------------------------
     Titres de section + révélations génériques
     --------------------------------------------------------- */
  function initSectionTitles() {
    $$('.sec-title').forEach(function (h) {
      var text = $('.sec-title__text', h);
      var split = splitChars(text);
      var paths = $$('.swirl path', h);
      paths.forEach(drawPath);
      gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 85%' } })
        .from($$('.sec-title__line', h), { scaleX: 0, duration: 1.1, ease: 'expo.out' })
        .to(paths, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.15)
        .from(split.chars, { yPercent: 100, opacity: 0, rotationX: NO_CATEGORY_ROTATION ? 0 : -90, stagger: 0.03, duration: 0.7, ease: 'back.out(2)' }, 0.2);
    });

    $$('.hand-title').forEach(function (h) {
      var text = $('.hand-title__text', h);
      var path = $('.swirl path', h);
      if (path) drawPath(path);
      gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 88%' } })
        .fromTo(text, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' })
        .to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.8)
        .from($('.hand-title__line', h), { scaleX: 0, duration: 1, ease: 'expo.out' }, 1);
    });
  }

  function initReveals() {
    $$('[data-reveal]').forEach(function (el) {
      gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    $$('[data-split]').forEach(function (el) {
      var s = splitChars(el);
      gsap.from(s.chars, {
        yPercent: 100, opacity: 0, rotationX: NO_CATEGORY_ROTATION ? 0 : -80, stagger: 0.025, duration: 0.8, ease: 'back.out(1.8)',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    $$('.lead').forEach(function (el) {
      gsap.set(el, { opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          var s = SplitText.create(el, { type: 'lines', mask: 'lines' });
          gsap.set(el, { opacity: 1 });
          gsap.from(s.lines, { yPercent: 105, duration: 1, stagger: 0.08, ease: 'expo.out', onComplete: function () { s.revert(); } });
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Accueil : dossiers, cartes projets, contact
     --------------------------------------------------------- */
  function initFolders() {
    var folders = $$('.folder');
    if (!folders.length) return;

    folders.forEach(function (f, i) {
      var front = $('.folder__front', f);
      var icons = $$('.folder__icons img', f);
      var inner = $('.folder__inner', f);
      gsap.set(icons, { y: 40, scale: 0.4, opacity: 0 });

      var tl = gsap.timeline({ paused: true })
        .to(front, { rotationX: -30, y: 4, duration: 0.8, ease: 'power3.inOut', transformPerspective: 700 }, 0)
        .to(icons, {
          y: function (k) { return -42 - (k % 2) * 12; },
          rotation: function (k) { return [-14, 10, -6, 14][k % 4]; },
          scale: 1,
          opacity: 1,
          stagger: 0.11,
          duration: 0.85,
          ease: 'power3.out'
        }, 0.05);

      var open = function () { tl.timeScale(1).play(); };
      var close = function () { tl.timeScale(0.82).reverse(); };

      if (!TOUCH) {
        f.addEventListener('mouseenter', open);
        f.addEventListener('mouseleave', close);
      }
      f.addEventListener('focus', open);
      f.addEventListener('blur', close);

      if (!REDUCE) {
        gsap.to(inner, {
          y: i % 2 ? -18 : 16,
          rotation: i % 2 ? -0.8 : 0.8,
          ease: 'none',
          scrollTrigger: { trigger: '.skills', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      }
    });

    gsap.from(folders, {
      y: 64,
      scale: 0.96,
      opacity: 0,
      stagger: 0.16,
      duration: 1.25,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.folders', start: 'top 85%', once: true }
    });
  }

  function initHomeProjects() {
    var panel = $('.projects .glass-panel');
    if (!panel) return;
    var cards = $$('.cat-card');

    gsap.from(panel, {
      opacity: 0, y: 36, duration: 1.15, ease: 'power3.out',
      scrollTrigger: { trigger: panel, start: 'top 82%', once: true }
    });

    cards.forEach(function (card, i) {
      var body = $('.cat-card__body', card);
      var rule = $('.cat-card__rule', card);
      var title = $('.cat-card__title', card);
      var meta = $('.cat-card__text', card);

      gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
        .from(card, {
          opacity: 0, x: i % 2 ? 36 : -36, y: 24, scale: 0.97,
          duration: 1.1, ease: 'power3.out'
        })
        .from(rule, { scaleX: 0, duration: 0.65, ease: 'power2.out' }, 0.18)
        .from(title, { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0.24)
        .from(meta, { opacity: 0, y: 12, duration: 0.65, ease: 'power2.out' }, 0.42);

      tilt(card, body, 2);

      if (!TOUCH && !REDUCE) {
        var hover = gsap.timeline({ paused: true })
          .to(body, { y: -7, scale: 1.018, duration: 0.65, ease: 'power3.out' }, 0)
          .to(title, { x: 4, duration: 0.55, ease: 'power2.out' }, 0)
          .to(rule, { scaleX: 1.55, duration: 0.55, ease: 'power2.out' }, 0.04);
        card.addEventListener('pointerenter', function () { hover.play(); });
        card.addEventListener('pointerleave', function () { hover.reverse(); });
        card.addEventListener('focus', function () { hover.play(); });
        card.addEventListener('blur', function () { hover.reverse(); });
      }
    });

  }

  function parallaxTexture(panel) {
    var tex = $('.glass-panel__tex', panel);
    if (!tex || REDUCE) return;
    gsap.fromTo(tex, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  function initContact() {
    var card = $('.contact__card');
    if (!card) return;
    var logo = $('img', card);

    gsap.timeline({ scrollTrigger: { trigger: '.contact', start: 'top 80%' } })
      .from(card, { opacity: 0, scale: 0.75, rotation: NO_CATEGORY_ROTATION ? 0 : -8, y: 60, duration: 1.2, ease: 'expo.out' })
      .from(logo, { scale: 0, rotation: NO_CATEGORY_ROTATION ? 0 : -120, duration: 1, ease: 'back.out(2)' }, 0.35);

    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
    card.addEventListener('mouseenter', function () {
      if (NO_CATEGORY_ROTATION) return;
      gsap.fromTo(logo, { rotation: 0, scale: 1 }, { keyframes: { rotation: [0, -14, 12, -6, 0], scale: [1, 1.12, 1.08, 1.04, 1] }, duration: 0.9, ease: 'power1.inOut' });
    });
    card.addEventListener('click', function () {
      if (NO_CATEGORY_ROTATION) return;
      gsap.fromTo(logo, { rotation: 0 }, { rotation: 360, duration: 1, ease: 'expo.inOut' });
    });
  }

  function initBackToTop() {
    var btn = $('.to-top');
    if (!btn) return;
    var bar = $('.to-top__ring .bar');
    var shown = false;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (self) {
        bar.style.strokeDashoffset = 157 * (1 - self.progress);
        var show = self.scroll() > 600;
        if (show !== shown) {
          shown = show;
          gsap.to(btn, { autoAlpha: show ? 1 : 0, scale: show ? 1 : 0.6, rotation: NO_CATEGORY_ROTATION ? 0 : (show ? 0 : -90), duration: 0.5, ease: show ? 'back.out(2)' : 'power2.in' });
        }
      }
    });
    btn.addEventListener('click', function () { scrollToTarget(0); });
    magnetic(btn);
  }

  /* ---------------------------------------------------------
     Rendu des pages projets depuis le JSON
     --------------------------------------------------------- */
  function loadData() {
    return fetch(PROJECTS_URL, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' pour ' + r.url);
      return r.json().catch(function () {
        throw new Error('Réponse JSON invalide depuis ' + r.url);
      });
    });
  }

  function handTitle(t) {
    return '<h2 class="hand-title"><span class="hand-title__text">' + esc(t) + '</span>' +
      '<span class="hand-title__trail">' + ICON.swirl + '<span class="hand-title__line"></span></span></h2>';
  }

  function browserMarkup(inner, attrs) {
    return '<div class="browser"' + (attrs || '') + '><div class="browser__bar"><i></i><i></i><i></i><b></b></div>' +
      '<div class="browser__view">' + inner + '</div></div>';
  }

  function img(src, alt, extra) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" decoding="async"' + (extra || '') + '>';
  }

  function lbAttrs(group, src, alt, caption) {
    return ' data-lightbox="' + esc(group) + '" data-src="' + esc(src) + '" data-alt="' + esc(alt || '') + '"' +
      (caption ? ' data-caption="' + esc(caption) + '"' : '') + ' tabindex="0" role="button"';
  }

  function videoAttrs(it, vertical) {
    return ' data-video="' + esc(it.video || '') + '" data-poster="' + esc(it.poster || it.src || '') + '" data-title="' + esc(it.title || '') + '"' +
      (vertical ? ' data-vertical="1"' : '');
  }

  function videoCover(it, vertical) {
    var cover = it.posterFrame && it.video
      ? '<img class="video-card__cover-frame" data-video-frame="' + esc(it.video) + '" alt="Première image de ' + esc(it.title) + '">'
      : it.poster
      ? img(it.poster, it.title)
      : '<span class="video-card__placeholder"><span class="video-card__placeholder-kind">' + (vertical ? 'REEL' : 'COURT-MÉTRAGE') + '</span><strong>' + esc(it.title) + '</strong><span class="video-card__placeholder-year">PORTFOLIO · 2026</span></span>';
    var previewAttr = !vertical && it.video ? ' data-hover-preview="' + esc(it.video) + '"' : '';
    return '<button class="video-card__cover' + (vertical ? ' video-card__cover--vertical' : '') + '" type="button"' + videoAttrs(it, vertical) + previewAttr + ' aria-label="Lire ' + esc(it.title) + '">' +
      cover + '<span class="video-card__play">' + ICON.play + '</span></button>';
  }

  function meta(arr) {
    return arr && arr.length ? '<p class="meta">' + arr.map(esc).join(' • ') + '</p>' : '';
  }

  function linkOrSpan(url, label, cls) {
    return url
      ? '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + label + '</a>'
      : '<span class="' + cls + ' is-disabled" title="Lien bientôt disponible">' + label + '</span>';
  }

  var R = {
    reels: function (s) {
      return '<div class="video-grid video-grid--reels">' + s.items.map(function (it) {
        return '<article class="video-card video-card--vertical">' + videoCover(it, true) +
          '<div class="video-card__body"><h3 class="video-card__title">' + esc(it.title) + '</h3>' +
          '<p class="video-card__text">' + esc(it.text) + '</p>' + meta(it.meta) + '</div></article>';
      }).join('') + '</div>';
    },

    films: function (s, si) {
      return '<div class="video-grid video-grid--films">' + s.items.map(function (it, k) {
        var extraFrames = '';
        var cover;
        if (it.layout === 'carousel') {
          var carouselCover = it.poster
            ? img(it.poster, it.title)
            : '<img class="video-card__cover-frame" data-video-frame="' + esc(it.videos[0]) + '" alt="Première image du court métrage ' + esc(it.title) + '">';
          cover = '<button class="video-card__cover video-card__cover--carousel" type="button" data-video-carousel="' + esc(it.videos.join('|')) + '" data-hover-preview="' + esc(it.videos[0]) + '" data-title="' + esc(it.title) + '" aria-label="Lire le carrousel des ' + it.videos.length + ' extraits de ' + esc(it.title) + '">' +
            carouselCover + '<span class="video-card__carousel-count">' + it.videos.length + ' extraits <svg viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h21m-5-5 5 5-5 5M6 1 1 6l5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
            '<span class="video-card__play">' + ICON.play + '</span></button>';
        } else if (it.layout === 'frames') {
          var group = 'film-' + si + '-' + k;
          var first = it.frames[0];
          cover = '<button class="video-card__cover" type="button" data-lightbox="' + esc(group) + '" data-src="' + esc(first) + '" data-alt="' + esc(it.title + ' — extrait 1') + '" aria-label="Voir les extraits de ' + esc(it.title) + '">' +
            img(first, it.title + ' — extrait 1') + '<span class="video-card__play">' + ICON.play + '</span></button>';
          extraFrames = '<div class="video-card__frames">' + it.frames.slice(1).map(function (f, n) {
            return '<button class="video-card__frame" type="button" data-lightbox="' + esc(group) + '" data-src="' + esc(f) + '" data-alt="' + esc(it.title + ' — extrait ' + (n + 2)) + '" aria-label="Voir l’extrait ' + (n + 2) + ' de ' + esc(it.title) + '">' + img(f, '') + '</button>';
          }).join('') + '</div>';
        } else {
          cover = videoCover(it, false);
        }
        return '<article class="video-card video-card--film' + (extraFrames ? ' video-card--gallery' : '') + '">' + cover + extraFrames +
          '<div class="video-card__body"><h3 class="video-card__title">' + esc(it.title) + '</h3>' +
          (it.text ? '<p class="video-card__text">' + esc(it.text) + '</p>' : '') + meta(it.meta) + '</div></article>';
      }).join('') + '</div>';
    },

    photos: function (s) {
      return '<div class="photo-frame"><div class="photo-frame__ornament">' + ICON.swirl + '<span></span><small>' + s.items.length + ' photographies · 2025—2026</small></div><div class="photo-grid">' + s.items.map(function (p) {
        var dimensions = ' width="' + (parseInt(p.width, 10) || '') + '" height="' + (parseInt(p.height, 10) || '') + '"';
        var ratio = /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(p.ratio || '') ? p.ratio : '4 / 3';
        return '<figure class="photo" style="--photo-ratio: ' + esc(ratio) + '"' + lbAttrs('photos', p.src, p.alt) + '>' + img(p.src, p.alt, dimensions) + '</figure>';
      }).join('') + '</div></div>';
    },

    panels: function (s, si) {
      return s.panels.map(function (p, pi) {
        var group = 'panel-' + si + '-' + pi;
        return '<div class="glass-panel panel"><div class="glass-panel__tex"></div>' +
          '<div class="panel__grid' + (p.expand ? ' panel__grid--expand' : '') + '" style="--cols: ' + (p.cols || 3) + '">' +
          p.items.map(function (it) {
            var style = p.expand ? '' : ' style="aspect-ratio: ' + esc(p.ratio || '3 / 4') + '"';
            return '<figure class="work"><div class="work__img"' + style + lbAttrs(group, it.src, it.alt, it.caption) + '>' + img(it.src, it.alt) + '</div>' +
              '<figcaption class="work__cap">' + esc(it.caption) + (it.caption2 ? '<small>' + esc(it.caption2) + '</small>' : '') + '</figcaption></figure>';
          }).join('') + '</div></div>';
      }).join('');
    },

    browsers: function (s, si) {
      var group = 'browsers-' + si;
      return '<div class="browsers-grid browsers-grid--arvie">' + s.items.map(function (it, index) {
        var number = index + 1 < 10 ? '0' + (index + 1) : String(index + 1);
        return '<figure class="browser-case">' + browserMarkup(img(it.src, it.alt), lbAttrs(group, it.src, it.alt)) +
          '<figcaption class="browser-case__caption"><span>' + number + '</span><strong>' + esc(it.caption || it.alt) + '</strong></figcaption></figure>';
      }).join('') + '</div>';
    },

    duo: function (s, si) {
      var group = 'duo-' + si;
      return '<div class="duo">' + s.items.map(function (it) {
        var isVideo = Object.prototype.hasOwnProperty.call(it, 'video');
        var attrs = isVideo ? videoAttrs(it, true) + ' tabindex="0" role="button"' : lbAttrs(group, it.src, it.alt, it.caption);
        var fig = '<figure class="work"><div class="work__img" style="aspect-ratio: 3 / 4"' + attrs + '>' + img(it.src, it.alt) + '</div>' +
          '<figcaption class="work__cap">' + esc(it.caption) + (it.caption2 ? '<small>' + esc(it.caption2) + '</small>' : '') + '</figcaption></figure>';
        if (isVideo) fig += '<button class="play-btn" type="button"' + videoAttrs(it, true) + ' aria-label="Lire la vidéo">' + ICON.play + '</button>';
        return fig;
      }).join('') + '</div>';
    },

    site: function (s, si) {
      var number = si + 1 < 10 ? '0' + (si + 1) : String(si + 1);
      var group = 'site-' + si;
      return '<article class="site-project' + (si % 2 ? ' site-project--reverse' : '') + '">' +
        '<div class="site-project__visual"><span class="site-project__index">' + number + ' / PROJET WEB</span>' +
        '<div class="site-project__mockup">' + browserMarkup(img(s.image, s.alt), lbAttrs(group, s.image, s.alt, s.title)) + '</div></div>' +
        '<div class="site-project__content"><p class="site-project__eyebrow">Création web' + (s.tool ? ' · ' + esc(s.tool) : '') + '</p>' +
        '<h2 class="site-project__title">' + esc(s.title) + '</h2>' +
        '<p class="site-project__description">' + esc(s.text) + '</p>' +
        '<div class="site-project__actions">' + linkOrSpan(s.url, esc(s.linkLabel || 'Voir le projet') + ' ' + ICON.upright, 'pill pill--upper site-project__cta') +
        (s.note ? '<p class="site-project__note">' + esc(s.note) + '</p>' : '') + '</div></div></article>';
    },

    links: function (s) {
      var b = s.button || {};
      var number = s.title === 'Vlogs' ? '01' : '02';
      return '<article class="about-project"><div class="about-project__meta"><span class="about-project__number">' + number + '</span></div>' +
        '<div class="about-project__body"><h2 class="about-project__title">' + esc(s.title) + '</h2><p class="about-project__text">' + esc(s.text) + '</p>' +
        '<div class="about-block__cta">' + linkOrSpan(b.url, esc(b.label || 'Playlist') + ' ' + ICON.upright, 'pill pill--upper') + '</div></div></article>';
    }
  };

  function renderPage(data) {
    var root = $('[data-render]');
    if (!root) return;
    var page = data.pages && data.pages[PAGE];
    if (!page) { root.innerHTML = ''; return; }
    root.innerHTML = page.sections.map(function (s, si) {
      var fn = R[s.type];
      if (!fn) return '';
      return '<section class="block block--' + esc(s.type) + (s.title === 'Arvie' ? ' block--arvie' : '') + (s.title === 'Vibetune' ? ' block--vibetune' : '') + (s.type === 'links' ? ' about-block' : '') + '"><div class="wrap">' +
        (s.type === 'site' || s.type === 'links' ? '' : (s.title ? handTitle(s.title) : '')) +
        (s.type === 'site' || s.type === 'links' || !s.text ? '' : '<p class="lead">' + esc(s.text) + '</p>') +
        fn(s, si) + '</div></section>';
    }).join('');

    $$('[data-video-frame]', root).forEach(createVideoFrame);
    initVideoPreviews(root);

    // Rafraîchit ScrollTrigger quand les images arrivent
    var refresh = debounce(function () { ScrollTrigger.refresh(); }, 200);
    $$('img', root).forEach(function (im) { if (!im.complete) im.addEventListener('load', refresh, { once: true }); });
  }

  function createVideoFrame(image) {
    var video = document.createElement('video');
    var finished = false;
    video.muted = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.addEventListener('loadedmetadata', function () {
      if (video.duration > 0) video.currentTime = Math.min(0.04, video.duration / 2);
    }, { once: true });
    function capture() {
      if (finished || !video.videoWidth || !video.videoHeight) return;
      finished = true;
      var scale = Math.min(1, 1600 / video.videoWidth, 900 / video.videoHeight);
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      try {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        image.src = canvas.toDataURL('image/jpeg', 0.84);
        image.classList.add('is-ready');
      } catch (err) {
        console.warn('Image de couverture vidéo indisponible', err);
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    video.addEventListener('loadeddata', capture, { once: true });
    video.addEventListener('seeked', capture, { once: true });
    video.addEventListener('error', function () { console.warn('Première image vidéo indisponible : ' + image.dataset.videoFrame); }, { once: true });
    video.src = image.dataset.videoFrame;
    video.load();
  }

  function initVideoPreviews(root) {
    if (TOUCH || REDUCE) return;
    $$('[data-hover-preview]', root).forEach(function (cover) {
      var preview = document.createElement('video');
      preview.className = 'video-card__preview';
      preview.muted = true;
      preview.defaultMuted = true;
      preview.loop = true;
      preview.playsInline = true;
      preview.preload = 'none';
      preview.setAttribute('aria-hidden', 'true');
      preview.src = cover.dataset.hoverPreview;
      cover.appendChild(preview);
      var hovering = false;

      cover.addEventListener('pointerenter', function () {
        hovering = true;
        try { preview.currentTime = 0; } catch (err) {}
        var playback = preview.play();
        if (playback && playback.then) {
          playback.then(function () {
            if (hovering) cover.classList.add('is-previewing');
          }).catch(function () {});
        }
      });
      cover.addEventListener('pointerleave', function () {
        hovering = false;
        preview.pause();
        cover.classList.remove('is-previewing');
        try { preview.currentTime = 0; } catch (err) {}
      });
    });
  }

  function renderError() {
    var root = $('[data-render]');
    if (!root) return;
    root.innerHTML = '<p class="data-error">Les projets n\'ont pas pu être chargés.<br>Consultez la console du navigateur pour connaître la cause.</p>';
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  /* ---------------------------------------------------------
     Animations des pages projets
     --------------------------------------------------------- */
  function animateProjects() {
    var mm = gsap.matchMedia();

    // Reels : entrée souple par le bas. Courts-métrages : révélation plus cinématographique.
    $$('.video-grid').forEach(function (grid) {
      var cards = $$('.video-card', grid);
      var isReels = grid.classList.contains('video-grid--reels');
      var reelsText = isReels && grid.closest('.block').querySelector('.lead');
      if (reelsText) {
        var textLines = SplitText.create(reelsText, { type: 'lines', mask: 'lines' });
        gsap.from(textLines.lines, {
          yPercent: 125,
          opacity: 0,
          rotationX: -55,
          transformOrigin: '50% 100%',
          stagger: 0.24,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: reelsText,
            start: 'top 88%',
            once: true,
            onLeave: function () { if (textLines.revert) textLines.revert(); }
          }
        });
      }
      gsap.from(cards, {
        opacity: 0,
        y: isReels ? 72 : 68,
        scale: isReels ? 0.9 : 0.97,
        rotation: isReels ? function (index) { return index % 2 ? 3 : -3; } : 0,
        rotationY: isReels ? 0 : 7,
        transformPerspective: 1200,
        stagger: isReels ? 0.36 : 0.2,
        duration: isReels ? 1.8 : 1.25,
        ease: isReels ? 'back.out(1.25)' : 'expo.out',
        scrollTrigger: { trigger: grid, start: 'top 86%' }
      });
      cards.forEach(function (card) {
        var cover = $('.video-card__cover', card);
        tilt(card, cover, isReels ? 4 : 2.5);
        gsap.from(cover, {
          clipPath: 'inset(0% 0% 100% 0% round 14px)',
          duration: isReels ? 0.9 : 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: card, start: 'top 88%' }
        });
      });
    });

    // Photos
    var photos = $$('.photo');
    if (photos.length) {
      gsap.from('.photo-frame', { opacity: 0, scale: 0.96, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.photo-frame', start: 'top 90%' } });
      gsap.set(photos, { clipPath: 'inset(100% 0% 0% 0%)' });
      ScrollTrigger.batch(photos, {
        start: 'top 92%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, stagger: 0.09, ease: 'expo.out' });
        }
      });
    }

    // Panneaux de création
    $$('.panel').forEach(function (panel) {
      var works = $$('.work', panel);
        gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top 82%' } })
        .from(panel, { opacity: 0, y: 80, scale: 0.96, duration: 1.1, ease: 'expo.out' })
        .from(works, { opacity: 0, y: 70, rotation: NO_CATEGORY_ROTATION ? 0 : function (i) { return i % 2 ? 4 : -4; }, scale: 0.9, stagger: 0.08, duration: 1, ease: 'expo.out' }, 0.2);
      if (!NO_CATEGORY_ROTATION) works.forEach(function (w) { tilt(w, $('.work__img', w), 6); });
      parallaxTexture(panel);
    });

    // Navigateurs (Arvie)
    $$('.browsers-grid').forEach(function (grid) {
      var items = $$('.browser-case', grid);
      gsap.from(items, {
        opacity: 0, y: 90, rotationY: NO_CATEGORY_ROTATION ? 0 : function (i) { return i % 2 ? -18 : 18; }, transformPerspective: 1000,
        stagger: 0.14, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: grid, start: 'top 82%' }
      });
      if (!NO_CATEGORY_ROTATION) items.forEach(function (b) { tilt(b, $('.browser', b), 5); });
    });

    // Duo (Yummy Lips)
    $$('.duo').forEach(function (duo) {
      gsap.timeline({ scrollTrigger: { trigger: duo, start: 'top 82%' } })
        .from($$('.work', duo), { opacity: 0, x: -60, rotation: NO_CATEGORY_ROTATION ? 0 : -5, stagger: 0.15, duration: 1.1, ease: 'expo.out' })
        .from($$('.play-btn', duo), { scale: 0, rotation: NO_CATEGORY_ROTATION ? 0 : -180, duration: 0.8, ease: 'back.out(2.5)' }, 0.6);
      if (!NO_CATEGORY_ROTATION) $$('.work', duo).forEach(function (w) { tilt(w, $('.work__img', w), 7); });
    });

    // Site web : animations au défilement des projets (le hero reste intact)
    if (PAGE === 'site-web') $$('.site-project').forEach(function (project) {
      var visual = $('.site-project__visual', project);
      var index = $('.site-project__index', project);
      var mockup = $('.site-project__mockup', project);
      var eyebrow = $('.site-project__eyebrow', project);
      var title = $('.site-project__title', project);
      var description = $('.site-project__description', project);
      var actions = $('.site-project__actions', project);
      var titleSplit = SplitText.create(title, { type: 'chars', charsClass: 'site-title-char' });
      gsap.timeline({ scrollTrigger: { trigger: project, start: 'top 84%', once: true } })
        .from(project, { opacity: 0, y: 48, duration: 0.9, ease: 'power3.out' })
        .from(index, { opacity: 0, x: -18, duration: 0.55, ease: 'power2.out' }, 0.12)
        .from(visual, { clipPath: 'inset(0 0 100% 0 round 18px)', duration: 1.1, ease: 'power3.inOut' }, 0.16)
        .from(mockup, { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' }, 0.28)
        .from(eyebrow, { opacity: 0, y: 14, duration: 0.55, ease: 'power2.out' }, 0.25)
        .from(titleSplit.chars, { opacity: 0, yPercent: 75, stagger: 0.025, duration: 0.65, ease: 'power3.out' }, 0.34)
        .from(description, { opacity: 0, y: 18, duration: 0.65, ease: 'power2.out' }, 0.58)
        .from(actions, { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' }, 0.72);
    });

    // À propos
    $$('.about-project').forEach(function (project) {
      var number = $('.about-project__number', project);
      var content = $$('.about-project__body > *', project);
      gsap.timeline({ scrollTrigger: { trigger: project, start: 'top 86%', once: true } })
        .from(project, { opacity: 0, y: 62, scale: 0.96, duration: 1.35, ease: 'power3.out' })
        .from(number, { opacity: 0, y: 36, scale: 0.7, rotation: -5, duration: 1.15, ease: 'back.out(1.5)' }, 0.18)
        .from(content, { opacity: 0, y: 28, stagger: 0.2, duration: 1.05, ease: 'power2.out' }, 0.34);
    });

    $$('.play-btn, .about-block__cta .pill').forEach(magnetic);
  }

  /* ---------------------------------------------------------
     Visionneuse (images + vidéos)
     --------------------------------------------------------- */
  var LB = { items: [], i: 0, open: false };

  function initLightbox() {
    LB.el = $('.lightbox');
    LB.stage = $('.lightbox__stage');
    LB.count = $('.lightbox__count');
    if (!LB.el) return;

    document.addEventListener('click', function (e) {
      var carousel = e.target.closest('[data-video-carousel]');
      if (carousel) {
        e.preventDefault();
        var videos = carousel.dataset.videoCarousel.split('|').filter(Boolean);
        openLB(videos.map(function (src, i) {
          return { type: 'video', src: src, title: carousel.dataset.title + ' — extrait ' + (i + 1) };
        }), 0);
        return;
      }
      var v = e.target.closest('[data-video]');
      if (v) {
        e.preventDefault();
        openLB([{ type: 'video', src: v.dataset.video, poster: v.dataset.poster, title: v.dataset.title, vertical: !!v.dataset.vertical }], 0);
        return;
      }
      var t = e.target.closest('[data-lightbox]');
      if (t) {
        e.preventDefault();
        var group = $$('[data-lightbox="' + t.dataset.lightbox + '"]');
        openLB(group.map(function (n) { return { type: 'image', src: n.dataset.src, alt: n.dataset.alt }; }), group.indexOf(t));
      }
    });

    document.addEventListener('keydown', function (e) {
      if (LB.open) {
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowRight') stepLB(1);
        if (e.key === 'ArrowLeft') stepLB(-1);
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.matches('[data-lightbox], [data-video]')) {
        e.preventDefault();
        document.activeElement.click();
      }
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    $('.lightbox__close').addEventListener('click', closeLB);
    $('.lightbox__bg').addEventListener('click', closeLB);
    $('.lightbox__prev').addEventListener('click', function () { stepLB(-1); });
    $('.lightbox__next').addEventListener('click', function () { stepLB(1); });

    var sx = null;
    LB.el.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    LB.el.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) stepLB(dx < 0 ? 1 : -1);
    });
  }

  function embedUrl(src) {
    var m = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1&rel=0';
    m = src.match(/vimeo\.com\/(\d+)/);
    if (m) return 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1';
    return null;
  }

  function itemMarkup(it) {
    if (it.type === 'image') return '<img src="' + esc(it.src) + '" alt="' + esc(it.alt) + '">';
    if (!it.src) {
      return '<div class="lightbox__soon">' + (it.poster ? '<img src="' + esc(it.poster) + '" alt="">' : '') +
        '<strong>' + esc(it.title || 'Vidéo') + '</strong><p>Vidéo bientôt disponible.</p></div>';
    }
    var embed = embedUrl(it.src);
    if (embed) return '<iframe src="' + esc(embed) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + esc(it.title) + '"></iframe>';
    return '<video src="' + esc(it.src) + '"' + (it.poster ? ' poster="' + esc(it.poster) + '"' : '') + ' controls autoplay playsinline' + (it.vertical ? ' class="is-vertical"' : '') + '></video>';
  }

  function showLB(dir) {
    var it = LB.items[LB.i];
    var old = LB.stage.firstElementChild;
    var oldVideo = old && (old.matches('video') ? old : old.querySelector('video'));
    if (oldVideo) oldVideo.pause();
    var next = document.createElement('div');
    next.innerHTML = itemMarkup(it);
    var node = next.firstElementChild;
    LB.count.textContent = (LB.i + 1) + ' / ' + LB.items.length;
    if (old) {
      gsap.to(old, { x: -dir * 80, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: function () { old.remove(); } });
    }
    LB.stage.appendChild(node);
    gsap.fromTo(node, { x: dir * 80, opacity: 0, scale: dir ? 1 : 0.85 }, {
      x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', delay: old ? 0.15 : 0.1
    });
  }

  function openLB(items, index) {
    LB.items = items;
    LB.i = Math.max(0, index);
    LB.open = true;
    LB.stage.innerHTML = '';
    LB.el.classList.toggle('is-single', items.length < 2);
    if (lenis) lenis.stop();
    gsap.to(LB.el, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo('.lightbox__btn', { scale: 0 }, { scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(2)', delay: 0.15 });
    showLB(0);
    $('.lightbox__close').focus({ preventScroll: true });
  }

  function stepLB(dir) {
    if (!LB.open || LB.items.length < 2) return;
    LB.i = (LB.i + dir + LB.items.length) % LB.items.length;
    showLB(dir);
  }

  function closeLB() {
    if (!LB.open) return;
    LB.open = false;
    gsap.to(LB.el, {
      autoAlpha: 0, duration: 0.35, ease: 'power2.in',
      onComplete: function () { LB.stage.innerHTML = ''; }
    });
    if (lenis) lenis.start();
  }

  /* ---------------------------------------------------------
     Démarrage
     --------------------------------------------------------- */
  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    // Charge toutes les polices déclarées avant de découper les textes (SplitText)
    var list = [];
    document.fonts.forEach(function (f) { list.push(f.load().catch(function () {})); });
    var all = Promise.all(list).then(function () { return document.fonts.ready; }).then(function () {
      return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });
    });
    return Promise.race([all, new Promise(function (r) { setTimeout(r, 2000); })]);
  }

  function boot() {
    safe('transition', initTransitionLayers);
    safe('scroll', initScroll);
    safe('links', initLinks);
    safe('background', initBackground);
    safe('cursor', initCursor);
    safe('nav', initNav);
    safe('lightbox', initLightbox);
    var isHome = PAGE === 'index';
    var preloader = isHome ? safe('preloader', runPreloader) : null;

    var dataStep = isHome ? Promise.resolve() : loadData().then(function (data) {
      try {
        renderPage(data);
      } catch (err) {
        console.error('Erreur pendant le rendu des projets', err);
        renderError();
      }
    }).catch(function (err) {
      console.error('Erreur pendant le chargement de ' + PROJECTS_URL, err);
      renderError();
    });

    Promise.all([dataStep, fontsReady()]).then(function () {
      html.classList.add('is-ready');
      var start = preloader ? preloader : Promise.resolve(safe('reveal', revealPage));

      safe('titles', initSectionTitles);
      safe('reveals', initReveals);
      safe('folders', initFolders);
      safe('home-projects', initHomeProjects);
      safe('contact', initContact);
      safe('projects', animateProjects);
      safe('to-top', initBackToTop);
      $$('[data-magnetic]').forEach(magnetic);

      // L'intro démarre pendant que le rideau se lève
      var introDelay = preloader ? 0 : 0.45;
      Promise.resolve(preloader).then(function () {
        safe('intro', function () { isHome ? introHome(introDelay) : introPage(introDelay); });
      });

      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
      setTimeout(function () { ScrollTrigger.refresh(); }, 600);

      if (window.location.hash) {
        var target = safe('hash', function () { return $(window.location.hash); });
        if (target) Promise.resolve(start).then(function () { setTimeout(function () { scrollToTarget(target); }, 300); });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
