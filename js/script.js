/* ============================================================
   MoDuLeTech — script.js
============================================================ */

(function () {
  'use strict';

  /* ── SMOOTH SCROLL ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = document.getElementById('nav-header').offsetHeight;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // Close mobile menu if open
      closeMobileMenu();
    });
  });


  /* ── NAVIGATION SCROLL ───────────────────────────────────── */
  var navHeader = document.getElementById('nav-header');

  function updateNav() {
    if (window.scrollY > 40) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ── MOBILE MENU ─────────────────────────────────────────── */
  var hamburger  = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var overlay    = document.getElementById('mobile-menu-overlay');
  var closeBtn   = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  closeBtn.addEventListener('click', closeMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  /* ── HERO STAGGER ANIMATION ──────────────────────────────── */
  var heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    requestAnimationFrame(function () {
      setTimeout(function () {
        heroGrid.classList.add('hero-loaded');
      }, 80);
    });
  }


  /* ── INTERSECTION OBSERVER — REVEAL ─────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ── BACK TO TOP ─────────────────────────────────────────── */
  var backBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── CONTACT FORM ────────────────────────────────────────── */
  var form    = document.getElementById('contact-form');
  var formMsg = document.getElementById('form-msg');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = form.querySelector('#f-name').value.trim();
      var email   = form.querySelector('#f-email').value.trim();
      var message = form.querySelector('#f-message').value.trim();

      formMsg.className = 'form-msg';
      formMsg.textContent = '';

      if (!name || !email || !message) {
        formMsg.textContent = 'Please fill in your name, email and message.';
        formMsg.classList.add('error');
        return;
      }

      var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(email)) {
        formMsg.textContent = 'Please enter a valid email address.';
        formMsg.classList.add('error');
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Simulated send — replace with real endpoint when ready
      setTimeout(function () {
        formMsg.textContent = 'Message sent! We\'ll be in touch soon.';
        formMsg.classList.add('success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Start a Conversation <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12,5 19,12 12,19"></polyline></svg>';
      }, 1200);
    });
  }


  /* ── SERVICE CARD KEYBOARD ───────────────────────────────── */
  document.querySelectorAll('.svc-card[tabindex]').forEach(function (card) {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('focus-active');
      }
    });
  });


  /* ── ACTIVE NAV LINK ON SCROLL ───────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  var sectionObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) { link.removeAttribute('aria-current'); });
        var active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (active) active.setAttribute('aria-current', 'page');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function (section) { sectionObs.observe(section); });


  /* ── SUBTLE PARALLAX ON HERO IMAGE ──────────────────────── */
  var heroImg = document.querySelector('.hero-image-wrap');

  if (heroImg && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImg.style.transform = 'translateY(' + scrolled * 0.08 + 'px)';
      }
    }, { passive: true });
  }


  /* ── PROJECT PREVIEW MODAL ──────────────────────────────── */
  var projectModal = document.getElementById('project-modal');
  var projectModalClose = document.getElementById('project-modal-close');
  var projectModalBackdrop = document.getElementById('project-modal-backdrop');
  var openArchmakBtn = document.getElementById('open-archmak-preview');
  var csArchmakBtn = document.getElementById('cs-archmak-preview-btn');
  var modalStartProj = document.getElementById('modal-start-proj');

  function openProjectModal() {
    if (!projectModal) return;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openArchmakBtn) {
    openArchmakBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openProjectModal();
    });
  }

  if (csArchmakBtn) {
    csArchmakBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openProjectModal();
    });
  }

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', closeProjectModal);
  }

  if (modalStartProj) {
    modalStartProj.addEventListener('click', function () {
      closeProjectModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

})();

