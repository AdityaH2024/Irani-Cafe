/* ============================================
   IRANI CAFE – JavaScript
   Navbar, Scroll Reveal, Menu Tabs,
   Gallery Lightbox, Contact Form
   ============================================ */

(function () {
  'use strict';

  // ── Navbar: solid on scroll + hamburger ──────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Overlay for mobile menu
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function handleNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  function openMenu() {
    navLinks.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // ── Scroll Reveal ─────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children in same parent
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          let delay = 0;
          siblings.forEach(el => {
            if (el === entry.target) {
              el.style.transitionDelay = delay + 'ms';
              el.classList.add('visible');
            }
          });
          // Always reveal
          entry.target.style.transitionDelay = entry.target.style.transitionDelay || '0ms';
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Menu Tabs ─────────────────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.menu-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;

        // Re-trigger reveal for newly shown cards
        panel.querySelectorAll('.reveal').forEach(el => {
          if (!el.classList.contains('visible')) {
            el.classList.add('visible');
          }
        });
      }
    });
  });

  // ── Gallery Lightbox ──────────────────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let currentLbIndex = 0;

  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.dataset.src,
    alt: item.dataset.alt,
  }));

  function openLightbox(index) {
    currentLbIndex = index;
    lbImg.src = galleryData[index].src;
    lbImg.alt = galleryData[index].alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentLbIndex = (currentLbIndex - 1 + galleryData.length) % galleryData.length;
    lbImg.src = galleryData[currentLbIndex].src;
    lbImg.alt = galleryData[currentLbIndex].alt;
  }

  function showNext() {
    currentLbIndex = (currentLbIndex + 1) % galleryData.length;
    lbImg.src = galleryData[currentLbIndex].src;
    lbImg.alt = galleryData[currentLbIndex].alt;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // ── Contact Form ──────────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        contactForm.reset();
        showFormMessage('Thank you! We\'ll get back to you shortly.', 'success');
      }, 1400);
    });
  }

  function showFormMessage(msg, type) {
    // Remove any existing message
    const existing = contactForm.querySelector('.form-feedback');
    if (existing) existing.remove();

    const el = document.createElement('p');
    el.className = 'form-feedback form-note';
    el.textContent = msg;
    el.style.cssText = type === 'success'
      ? 'color: var(--brown); background: rgba(198,167,94,0.15); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--gold); margin-top: 0.75rem; text-align:center;'
      : 'color: #c0392b; background: rgba(192,57,43,0.08); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(192,57,43,0.3); margin-top: 0.75rem; text-align:center;';

    contactForm.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => el.remove(), 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Smooth active link highlight on scroll ────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.style.fontWeight = a.getAttribute('href') === '#' + id ? '600' : '500';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // ── Hero reveal on load ───────────────────────────────────────────
  window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(24px)';
      heroContent.style.transition = 'opacity 1s ease 0.3s, transform 1s ease 0.3s';
      requestAnimationFrame(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'none';
      });
    }
  });

})();
