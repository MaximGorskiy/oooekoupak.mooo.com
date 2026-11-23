/* VIRIDI GROUP — interactions */
(function () {
  'use strict';

  var topbar = document.getElementById('topbar');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  /* header shadow */
  function onScroll() {
    if (window.scrollY > 6) topbar.classList.add('scrolled');
    else topbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* video cards: click poster to start, click again to pause */
  document.querySelectorAll('[data-video]').forEach(function (card) {
    var btn = card.querySelector('.video-play');
    var video = card.querySelector('video');
    var badge = card.querySelector('.play-btn');
    if (!btn || !video) return;

    btn.addEventListener('click', function () {
      if (video.paused) {
        video.muted = false;
        var p = video.play();
        if (p && p.catch) p.catch(function () { video.muted = true; video.play().catch(function () {}); });
        if (badge) badge.style.opacity = '0';
      } else {
        video.pause();
        if (badge) badge.style.opacity = '';
      }
    });

    video.addEventListener('pause', function () { if (badge) badge.style.opacity = ''; });
    video.addEventListener('play', function () { if (badge) badge.style.opacity = '0'; });
    video.addEventListener('ended', function () { if (badge) badge.style.opacity = ''; });
  });

  /* gallery lightbox */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');

  function closeLb() {
    if (!lb) return;
    lb.hidden = true;
    document.body.style.overflow = '';
  }
  if (lb && lbImg) {
    document.querySelectorAll('#gallery img').forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || '';
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbClose) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  /* reveal on scroll */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.card, .ba, .g-item, .video-card, .scope-item, .hero-facts li');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('in'); t.style.opacity = '1'; t.style.transform = 'none'; });
  } else {
    targets.forEach(function (t) { t.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }
})();
