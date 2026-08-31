/* ============================================================
   MoDuLeTech — script.js
============================================================ */

(function () {
  'use strict';

  /* ── NAVIGATION ELEMENTS ─────────────────────────────────── */
  var navHeader   = document.getElementById('nav-header');
  var hamburger   = document.getElementById('nav-hamburger');
  var mobileMenu  = document.getElementById('mobile-menu');
  var overlay     = document.getElementById('mobile-menu-overlay');
  var closeBtn    = document.getElementById('mobile-menu-close');
  var allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  var sections    = document.querySelectorAll('section[id]');


  /* ── SMOOTH SCROLL & ACTIVE LINK ON CLICK ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || !href) return;
      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var navH = navHeader ? navHeader.offsetHeight : 70;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: top, behavior: 'smooth' });

      // Update active nav state immediately
      var targetId = href.replace('#', '');
      setActiveNav(targetId);

      // Close mobile menu if open
      closeMobileMenu();
    });
  });


  /* ── HEADER BACKGROUND ON SCROLL ─────────────────────────── */
  function updateNavBackground() {
    if (window.scrollY > 40) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }


  /* ── ACTIVE NAV HIGHLIGHTING ON SCROLL ───────────────────── */
  function setActiveNav(activeId) {
    allNavLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + activeId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateActiveNavOnScroll() {
    var scrollPosition = window.scrollY;
    var navH = navHeader ? navHeader.offsetHeight : 70;
    var windowHeight = window.innerHeight;
    var docHeight = document.documentElement.scrollHeight;
    var currentSectionId = '';

    // If reached bottom of page, highlight contact section
    if (windowHeight + scrollPosition >= docHeight - 60) {
      currentSectionId = 'contact';
    } else {
      sections.forEach(function (section) {
        var sectionTop = section.offsetTop - navH - 80;
        var sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.id;
        }
      });
    }

    if (currentSectionId) {
      setActiveNav(currentSectionId);
    } else if (scrollPosition < 200) {
      // Top of page / hero
      setActiveNav('home');
    }
  }

  // Combined scroll listener with throttling
  var isScrolling = false;
  window.addEventListener('scroll', function () {
    if (!isScrolling) {
      window.requestAnimationFrame(function () {
        updateNavBackground();
        updateActiveNavOnScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Initialize nav states on load
  updateNavBackground();
  updateActiveNavOnScroll();


  /* ── MOBILE MENU ─────────────────────────────────────────── */
  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('show');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
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
  if (backBtn) {
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
  }


  /* ── CONTACT FORM VALIDATION & HANDLING ──────────────────── */
  var form       = document.getElementById('contact-form');
  var formMsg    = document.getElementById('form-msg');
  var submitBtn  = document.getElementById('form-submit-btn');

  var nameInput    = document.getElementById('f-name');
  var emailInput   = document.getElementById('f-email');
  var phoneInput   = document.getElementById('f-phone');
  var messageInput = document.getElementById('f-message');

  var errName    = document.getElementById('err-name');
  var errEmail   = document.getElementById('err-email');
  var errPhone   = document.getElementById('err-phone');
  var errMessage = document.getElementById('err-message');

  function setFieldError(inputEl, errorEl, message) {
    if (!inputEl) return;
    var group = inputEl.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      group.classList.remove('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
    inputEl.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(inputEl, errorEl) {
    if (!inputEl) return;
    var group = inputEl.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
      if (inputEl.value.trim().length > 0) {
        group.classList.add('is-valid');
      } else {
        group.classList.remove('is-valid');
      }
    }
    if (errorEl) {
      errorEl.textContent = '';
    }
    inputEl.removeAttribute('aria-invalid');
  }

  function validateName() {
    if (!nameInput) return true;
    var val = nameInput.value.trim();
    if (!val) {
      setFieldError(nameInput, errName, 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      setFieldError(nameInput, errName, 'Name must be at least 2 characters long.');
      return false;
    }
    var namePattern = /^[a-zA-Z\s.'\-\u00C0-\u024F]+$/;
    if (!namePattern.test(val)) {
      setFieldError(nameInput, errName, 'Please enter a valid name (letters only).');
      return false;
    }
    clearFieldError(nameInput, errName);
    return true;
  }

  function validateEmail() {
    if (!emailInput) return true;
    var val = emailInput.value.trim();
    if (!val) {
      setFieldError(emailInput, errEmail, 'Please enter your email address.');
      return false;
    }
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(val)) {
      setFieldError(emailInput, errEmail, 'Please enter a valid email address (e.g. name@domain.com).');
      return false;
    }
    clearFieldError(emailInput, errEmail);
    return true;
  }

  function validatePhone() {
    if (!phoneInput) return true;
    var val = phoneInput.value.trim();
    if (!val) {
      // Optional field, clear error if empty
      clearFieldError(phoneInput, errPhone);
      return true;
    }
    // Check if phone has at least 7 digits and standard allowed symbols (+, -, space, parens)
    var digitsOnly = val.replace(/\D/g, '');
    var phonePattern = /^[+0-9\s\-()]{7,20}$/;
    if (!phonePattern.test(val) || digitsOnly.length < 7) {
      setFieldError(phoneInput, errPhone, 'Please enter a valid phone number (e.g. +267 74 511 376).');
      return false;
    }
    clearFieldError(phoneInput, errPhone);
    return true;
  }

  function validateMessage() {
    if (!messageInput) return true;
    var val = messageInput.value.trim();
    if (!val) {
      setFieldError(messageInput, errMessage, 'Please write your message or project requirements.');
      return false;
    }
    if (val.length < 10) {
      setFieldError(messageInput, errMessage, 'Message is too short. Please provide at least 10 characters.');
      return false;
    }
    clearFieldError(messageInput, errMessage);
    return true;
  }

  // Real-time inline feedback on blur and input
  if (nameInput) {
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function () {
      if (nameInput.closest('.form-group').classList.contains('has-error')) {
        validateName();
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function () {
      if (emailInput.closest('.form-group').classList.contains('has-error')) {
        validateEmail();
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('input', function () {
      if (phoneInput.closest('.form-group').classList.contains('has-error')) {
        validatePhone();
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', function () {
      if (messageInput.closest('.form-group').classList.contains('has-error')) {
        validateMessage();
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isNameValid    = validateName();
      var isEmailValid   = validateEmail();
      var isPhoneValid   = validatePhone();
      var isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
        if (formMsg) {
          formMsg.className = 'form-msg error';
          formMsg.textContent = 'Please correct the highlighted errors before submitting.';
        }

        // Trigger shake animation
        form.classList.remove('shake');
        void form.offsetWidth; // trigger reflow
        form.classList.add('shake');
        setTimeout(function () {
          form.classList.remove('shake');
        }, 500);

        // Focus the first invalid input
        var firstInvalid = form.querySelector('.form-group.has-error input, .form-group.has-error textarea');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Form is fully valid
      if (formMsg) {
        formMsg.className = 'form-msg';
        formMsg.textContent = '';
      }

      var originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Start a Conversation';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Message…</span>';
      }

      // Real email submission via FormSubmit AJAX
      var formData = new FormData(form);

      fetch('https://formsubmit.co/ajax/moduletech3@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network error or submission failed');
        }
        return response.json();
      })
      .then(function (data) {
        if (formMsg) {
          formMsg.className = 'form-msg success';
          formMsg.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
        }
        form.reset();

        // Clear valid indicators after reset
        form.querySelectorAll('.form-group').forEach(function (group) {
          group.classList.remove('is-valid', 'has-error');
        });
      })
      .catch(function (error) {
        console.error('Contact form submission error:', error);
        if (formMsg) {
          formMsg.className = 'form-msg error';
          formMsg.textContent = 'Oops! There was a problem sending your message. Please try again or email us directly at moduletech3@gmail.com.';
        }
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      });
    });
  }


  /* ── SERVICE CARD KEYBOARD ACCESSIBILITY ─────────────────── */
  document.querySelectorAll('.svc-card[tabindex]').forEach(function (card) {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('focus-active');
      }
    });
  });


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
  var projectModal       = document.getElementById('project-modal');
  var projectModalClose  = document.getElementById('project-modal-close');
  var projectModalBackdrop = document.getElementById('project-modal-backdrop');
  var openArchmakBtn     = document.getElementById('open-archmak-preview');
  var csArchmakBtn       = document.getElementById('cs-archmak-preview-btn');
  var modalStartProj     = document.getElementById('modal-start-proj');

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
