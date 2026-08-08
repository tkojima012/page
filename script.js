/* ============================================================
   健康庵 日々樹 — JavaScript
   Animations & Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- HEADER SCROLL EFFECT ---------- */
  const header = document.getElementById('header');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    const setMenuOpen = (isOpen) => {
      hamburger.classList.toggle('is-open', isOpen);
      nav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('is-open'));
    });

    // Close menu on link click
    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        setMenuOpen(false);
      });
    });
  }

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---------- INTERSECTION OBSERVER — Fade In ---------- */
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation slightly for consecutive elements
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Add staggered delays to siblings within the same parent
    const groups = new Map();
    fadeElements.forEach(el => {
      const parent = el.parentElement;
      if (!groups.has(parent)) {
        groups.set(parent, []);
      }
      groups.get(parent).push(el);
    });

    groups.forEach(children => {
      children.forEach((child, idx) => {
        child.dataset.delay = idx * 100;
      });
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.header__nav-link');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - header.offsetHeight - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('is-active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------- ACCESS PAGE — Station tab toggle ---------- */
  const accessTabs = document.querySelectorAll('.access-route__tab[data-access-tab]');
  const accessPanels = document.querySelectorAll('.access-route__panel[data-access-panel]');

  if (accessTabs.length && accessPanels.length) {
    const activateAccess = (name) => {
      accessTabs.forEach((tab) => {
        const on = tab.dataset.accessTab === name;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });
      accessPanels.forEach((panel) => {
        const show = panel.dataset.accessPanel === name;
        panel.hidden = !show;
      });
    };

    accessTabs.forEach((tab) => {
      tab.addEventListener('click', () => activateAccess(tab.dataset.accessTab));
    });
  }

  /* ---------- TOP — 施術の流れタブ切替 ---------- */
  const flowTabs = document.querySelectorAll('.treatment-flow__tab[data-flow-tab]');
  const flowPanels = document.querySelectorAll('.treatment-flow__panel[data-flow-panel]');

  if (flowTabs.length && flowPanels.length) {
    const activateFlow = (name) => {
      flowTabs.forEach((tab) => {
        const on = tab.dataset.flowTab === name;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });
      flowPanels.forEach((panel) => {
        const show = panel.dataset.flowPanel === name;
        panel.hidden = !show;
      });
    };

    flowTabs.forEach((tab) => {
      tab.addEventListener('click', () => activateFlow(tab.dataset.flowTab));
    });
  }

  /* ---------- CONTACT FORM — Ajax submit + completion modal ---------- */
  const contactForm = document.getElementById('contact-form');
  const contactModal = document.getElementById('contact-modal');

  if (contactForm && contactModal) {
    const submitBtn = document.getElementById('contact-form-submit');
    const errorBox = document.getElementById('contact-form-error');
    const modalPanel = contactModal.querySelector('.contact-modal__panel');
    let lastFocused = null;

    const showError = (msg) => {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.hidden = false;
    };
    const clearError = () => {
      if (!errorBox) return;
      errorBox.hidden = true;
      errorBox.textContent = '';
    };

    const openModal = () => {
      lastFocused = document.activeElement;
      contactModal.hidden = false;
      requestAnimationFrame(() => contactModal.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      if (modalPanel && typeof modalPanel.focus === 'function') {
        modalPanel.focus();
      }
    };
    const closeModal = () => {
      contactModal.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        contactModal.hidden = true;
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        }
      }, 250);
    };

    contactModal.querySelectorAll('[data-contact-modal-close]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !contactModal.hidden) {
        closeModal();
      }
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = '送信中...';
      }

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          contactForm.reset();
          openModal();
        } else {
          let message = '送信に失敗しました。時間をおいて再度お試しください。';
          try {
            const data = await res.json();
            if (Array.isArray(data?.errors) && data.errors.length) {
              message = data.errors.map((err) => err.message).filter(Boolean).join(' / ') || message;
            }
          } catch (_) {}
          showError(message);
        }
      } catch (_) {
        showError('通信エラーが発生しました。ネットワーク状況をご確認のうえ、再度お試しください。');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtn.dataset.originalText) {
            submitBtn.textContent = submitBtn.dataset.originalText;
            delete submitBtn.dataset.originalText;
          }
        }
      }
    });
  }

  /* ---------- PARALLAX-LIKE SUBTLE MOVEMENT ON HERO ---------- */
  const heroBg = document.querySelector('.hero__bg-pattern');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }
});
