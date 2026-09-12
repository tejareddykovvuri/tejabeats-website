/**
 * TejaBeats Download Website — Premium interactions
 */

(function () {
  'use strict';

  const FALLBACK_CONFIG = {
    repoUrl: '',
    releasesUrl: '',
    licenseUrl: '',
    licenseName: 'GPL-2.0',
    release: { version: '3.0.4', date: '2026-09-16', notes: [] },
    android: { url: 'https://github.com/tejareddykovvuri/TejaBeats/releases/download/v3.0.4/TejaBeats.apk', version: '3.0.4', size: '—', label: 'Download APK', requirements: 'Android 5.0+' },
    windows: { url: 'https://github.com/tejareddykovvuri/TejaBeats/releases/download/v3.0.4/TejaBeats-Windows.zip', version: '3.0.4', size: '—', label: 'Download for Windows', requirements: 'Windows 10/11', format: 'ZIP' },
    ios: { appStoreUrl: '', testFlightUrl: '', status: 'Coming Soon', appStoreLabel: 'App Store', testFlightLabel: 'TestFlight' }
  };

  const CONFIG = (typeof window !== 'undefined' && window.DOWNLOAD_CONFIG)
    ? window.DOWNLOAD_CONFIG
    : FALLBACK_CONFIG;

  // Safe storage helper
  const safeStorage = {
    _memory: {},
    get(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? undefined : JSON.parse(raw);
      } catch (e) {
        return this._memory[key];
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        this._memory[key] = value;
      }
    }
  };

  // DOM helpers
  function $(selector, context = document) { return context.querySelector(selector); }
  function $$(selector, context = document) { return Array.from(context.querySelectorAll(selector)); }
  function setText(el, text) { if (el) el.textContent = text; }
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Toast
  const toastEl = $('#toast');
  let toastTimer;
  function showToast(message) {
    if (!toastEl) return;
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
  }

  // Device detection
  function detectDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    if (/windows/i.test(ua)) return 'windows';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
    return 'other';
  }
  function osName(os) {
    switch (os) {
      case 'android': return 'Android';
      case 'ios': return 'iPhone / iPad';
      case 'windows': return 'Windows';
      default: return 'your device';
    }
  }

  // ============================================================
  // Ambient background effects (sound waves + minimal particles)
  // ============================================================
  function initAmbientEffects() {
    if (prefersReducedMotion()) return;

    const mobile = isMobile();
    const hero = $('.hero');

    if (hero && !$('.sound-waves')) {
      const waves = document.createElement('div');
      waves.className = 'sound-waves';
      const waveCount = mobile ? 2 : 3;
      for (let i = 0; i < waveCount; i++) {
        const wave = document.createElement('div');
        wave.className = 'sound-wave';
        waves.appendChild(wave);
      }
      hero.insertBefore(waves, hero.firstChild);
    }

    if (!$('.particles')) {
      const container = document.createElement('div');
      container.className = 'particles';
      container.setAttribute('aria-hidden', 'true');
      const baseCount = mobile ? Math.min(8, Math.max(5, Math.floor(window.innerWidth / 140))) : Math.min(18, Math.max(10, Math.floor(window.innerWidth / 120)));
      for (let i = 0; i < baseCount; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDuration = `${(mobile ? 28 : 18) + Math.random() * (mobile ? 12 : 16)}s`;
        p.style.animationDelay = `${-Math.random() * 20}s`;
        p.style.opacity = `${(mobile ? 0.25 : 0.3) + Math.random() * 0.25}`;
        container.appendChild(p);
      }
      document.body.appendChild(container);
    }
  }

  // ============================================================
  // Button ripple effect
  // ============================================================
  function initButtonRipples() {
    if (prefersReducedMotion()) return;

    $$('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
        btn.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);
        btn.classList.remove('is-rippling');
        void btn.offsetWidth;
        btn.classList.add('is-rippling');
        setTimeout(() => btn.classList.remove('is-rippling'), 600);
      });
    });
  }

  // ============================================================
  // Navbar scroll state
  // ============================================================
  function initHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;
    let ticking = false;

    function update() {
      const scrolled = window.scrollY > 20;
      header.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  // ============================================================
  // Mobile navigation
  // ============================================================
  function initNavigation() {
    const toggle = $('.nav-toggle');
    const menu = $('#nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // Magnetic buttons
  // ============================================================
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    $$('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============================================================
  // Mobile waveform visualizer
  // ============================================================
  function initMobileWaveform() {
    if (!isMobile() || prefersReducedMotion()) return;
    const heroVisuals = $('.hero-visuals');
    if (!heroVisuals || $('.mobile-waveform')) return;

    const waveform = document.createElement('div');
    waveform.className = 'mobile-waveform';
    waveform.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 12; i++) {
      const bar = document.createElement('span');
      waveform.appendChild(bar);
    }
    heroVisuals.appendChild(waveform);
  }

  // ============================================================
  // Scroll reveal
  // ============================================================
  function initScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const threshold = isMobile() ? 0.08 : 0.12;
    const rootMargin = isMobile() ? '0px 0px -30px 0px' : '0px 0px -50px 0px';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin });

    $$('[data-reveal]').forEach(el => observer.observe(el));
  }

  // ============================================================
  // Apply device detection and download config
  // ============================================================
  function applyDeviceAndConfig() {
    const os = detectDevice();

    const recommendedCard = $(`#card-${os === 'other' ? '' : os}`);
    if (recommendedCard) {
      recommendedCard.classList.add('is-recommended');
      if (!recommendedCard.querySelector('.recommended-tag')) {
        const tag = document.createElement('span');
        tag.className = 'recommended-tag';
        tag.textContent = 'Recommended';
        tag.setAttribute('aria-hidden', 'true');
        recommendedCard.appendChild(tag);
      }
    }

    const cfg = CONFIG;

    // Hero note
    const heroNote = $('#hero-note');
    if (heroNote) {
      setText(heroNote, `Latest version: v${cfg.release.version} • ${formatDate(cfg.release.date)}`);
    }

    // Android
    const androidVersionDate = $('#android-version-date');
    const androidSize = $('#android-size');
    const androidReq = $('#android-requirements');
    const androidBtn = $('#android-download');
    const androidCard = $('#card-android');
    const androidIcon = androidCard ? $('.android-icon', androidCard) : null;

    setText(androidReq, cfg.android.requirements || 'Android 5.0+');
    setText(androidVersionDate, `v${cfg.android.version || cfg.release.version}`);
    setText(androidSize, cfg.android.size);

    if (androidBtn) {
      androidBtn.href = cfg.android.url || '#';
    }
    if (androidIcon && androidBtn) {
      androidIcon.style.cursor = 'pointer';
      androidIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        androidBtn.click();
      });
    }

    // Windows
    const windowsVersionDate = $('#windows-version-date');
    const windowsSize = $('#windows-size');
    const windowsReq = $('#windows-requirements');
    const windowsMeta = $('#windows-meta');
    const windowsBtn = $('#windows-download');
    const windowsCard = $('#card-windows');
    const windowsIcon = windowsCard ? $('.windows-icon', windowsCard) : null;

    setText(windowsReq, cfg.windows.requirements || 'Windows 10/11');
    setText(windowsVersionDate, `v${cfg.windows.version || cfg.release.version}`);
    setText(windowsSize, cfg.windows.size);
    setText(windowsMeta, `${cfg.windows.format || 'ZIP'} • Run TejaBeats.exe inside`);

    if (windowsBtn) {
      windowsBtn.href = cfg.windows.url || '#';
    }
    if (windowsIcon && windowsBtn) {
      windowsIcon.style.cursor = 'pointer';
      windowsIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        windowsBtn.click();
      });
    }

    // iOS
    const iosStatus = $('#ios-status-text');
    const appStoreBtn = $('#appstore-download');
    const testFlightBtn = $('#testflight-download');
    const iosFootnote = $('#ios-footnote');

    setText(iosStatus, cfg.ios.status);

    if (appStoreBtn) {
      appStoreBtn.href = cfg.ios.appStoreUrl || '#';
      appStoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cfg.ios.appStoreUrl) window.open(cfg.ios.appStoreUrl, '_blank', 'noopener,noreferrer');
        else showToast('App Store link is not configured yet.');
      });
    }

    if (testFlightBtn) {
      testFlightBtn.href = cfg.ios.testFlightUrl || '#';
      testFlightBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cfg.ios.testFlightUrl) window.open(cfg.ios.testFlightUrl, '_blank', 'noopener,noreferrer');
        else showToast('TestFlight link is not configured yet.');
      });
    }

    if (!cfg.ios.appStoreUrl && !cfg.ios.testFlightUrl) {
      setText(iosFootnote, 'No official IPA, App Store, or TestFlight link exists yet.');
    }

    // Release section
    const releaseVersion = $('#release-version');
    const releaseDate = $('#release-date');
    const releaseNotes = $('#release-notes');
    const releaseAndroid = $('#release-android-link');
    const releaseWindows = $('#release-windows-link');

    setText(releaseVersion, 'v' + cfg.release.version);
    setText(releaseDate, 'Released on ' + formatDate(cfg.release.date));

    if (Array.isArray(cfg.release.notes) && cfg.release.notes.length) {
      releaseNotes.innerHTML = '<ul>' + cfg.release.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('') + '</ul>';
    }

    if (releaseAndroid) {
      releaseAndroid.href = cfg.android.url || '#download';
    }
    if (releaseWindows) {
      releaseWindows.href = cfg.windows.url || '#download';
    }
  }

  // ============================================================
  // Screenshot carousel
  // ============================================================
  function initPreviewCarousel() {
    const track = $('#screen-track');
    const prev = $('#preview-prev');
    const next = $('#preview-next');
    const dotsContainer = $('#preview-dots');
    const caption = $('#preview-caption');
    const frame = $('.phone-frame');
    if (!track || !prev || !next) return;

    const slides = $$('img', track);
    if (slides.length === 0) return;

    const captions = [
      'Player',
      'Home / Discover',
      'Charts & Queue',
      'Sleep Timer',
      'Song Options'
    ];

    let current = 0;

    function updateActiveClasses() {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === current);
      });
    }

    function update() {
      track.style.transform = `translateX(-${current * 100}%)`;
      updateActiveClasses();
      if (caption) {
        caption.style.opacity = '0';
        caption.style.transform = 'translateY(8px)';
        setTimeout(() => {
          setText(caption, captions[current] || '');
          caption.style.opacity = '1';
          caption.style.transform = 'translateY(0)';
        }, 250);
      }
      if (dotsContainer) {
        $$('.preview-dot', dotsContainer).forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === current);
        });
      }
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;

      if (frame && !prefersReducedMotion()) {
        frame.style.transform = `rotateY(${current % 2 === 0 ? -3 : 3}deg) translateY(-4px)`;
        setTimeout(() => { frame.style.transform = ''; }, 700);
      }
    }

    if (dotsContainer) {
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'preview-dot';
        dot.setAttribute('aria-label', `Go to screenshot ${idx + 1}`);
        dot.addEventListener('click', () => { current = idx; update(); });
        dotsContainer.appendChild(dot);
      });
    }

    prev.addEventListener('click', () => { if (current > 0) { current--; update(); } });
    next.addEventListener('click', () => { if (current < slides.length - 1) { current++; update(); } });

    updateActiveClasses();
    update();

    // Subtle auto-advance when idle (only if user hasn't interacted)
    if (!prefersReducedMotion()) {
      let idleTimer;
      function resetIdle() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (document.visibilityState === 'visible') {
            current = (current + 1) % slides.length;
            update();
          }
          resetIdle();
        }, 6000);
      }
      resetIdle();
      [prev, next, dotsContainer].forEach(el => {
        if (el) el.addEventListener('pointerenter', () => clearTimeout(idleTimer));
      });
    }
  }

  // ============================================================
  // FAQ accordion enhancements
  // ============================================================
  function initFaq() {
    const items = $$('.faq-item');
    items.forEach(item => {
      const summary = item.querySelector('summary');
      if (!summary) return;
      summary.setAttribute('aria-expanded', String(item.open));

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const willOpen = !item.open;
        items.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
            other.querySelector('summary').setAttribute('aria-expanded', 'false');
          }
        });
        item.open = willOpen;
        summary.setAttribute('aria-expanded', String(willOpen));
      });
    });
  }

  // ============================================================
  // Hero parallax on mouse move
  // ============================================================
  function initHeroParallax() {
    if (prefersReducedMotion() || isMobile()) return;
    const hero = $('.hero');
    if (!hero) return;

    const stack = $('.phone-stack');
    const content = $('.hero-content');

    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      if (stack) {
        stack.style.transform = `translateY(-50%) translate(${x * 14}px, ${y * 10}px) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
      }
      if (content) {
        content.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
      }
    });

    hero.addEventListener('mouseleave', () => {
      if (stack) stack.style.transform = '';
      if (content) content.style.transform = '';
    });
  }

  // ============================================================
  // View Source buttons feedback
  // ============================================================
  function initViewSourceButtons() {
    // No source buttons present on the site
  }

  // ============================================================
  // Footer year
  // ============================================================
  function initFooter() {
    const yearEl = $('#year');
    if (yearEl) setText(yearEl, new Date().getFullYear());
  }

  // ============================================================
  // Optional visit record
  // ============================================================
  function recordVisit() {
    try { safeStorage.set('tejabeats-visited', new Date().toISOString()); }
    catch (e) { /* ignore */ }
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    applyDeviceAndConfig();
    initAmbientEffects();
    initMobileWaveform();
    initHeaderScroll();
    initNavigation();
    initMagneticButtons();
    initButtonRipples();
    initScrollReveal();
    initPreviewCarousel();
    initFaq();
    initHeroParallax();
    initViewSourceButtons();
    initFooter();
    recordVisit();

    // eslint-disable-next-line no-console
    console.log('%cTejaBeats', 'color:#ff2d78;font-weight:bold;font-size:18px', 'Premium download website loaded.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
