/* ============================================
   MDT Student Wiki
   ============================================ */

(function () {
  'use strict';

  // ── DOM refs ──────────────────────────────
  const sidebar   = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('overlay');
  const navLinks  = document.querySelectorAll('.nav-link[data-page]');
  const inlineLinks = document.querySelectorAll('.nav-link-inline[data-page]');

  // ── Page switching ─────────────────────────
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
    }

    // Update active nav link
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  inlineLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // Card grid clickable
  document.querySelectorAll('.card.clickable[data-goto]').forEach(card => {
    card.addEventListener('click', () => {
      showPage(card.dataset.goto);
    });
  });

  // ── Mobile sidebar ─────────────────────────
  function openSidebar() {
    sidebar.classList.add('open');
    hamburger.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  // ── Module filter ──────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const moduleItems = document.querySelectorAll('.module-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      moduleItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          const cats = (item.dataset.cat || '').split(' ');
          item.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });

  // ── Hash routing ───────────────────────────
  function routeFromHash() {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home','modules','professors','language','budget','faq','contribute'];
    if (hash && validPages.includes(hash)) {
      showPage(hash);
    } else {
      showPage('home');
    }
  }

  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();

  // ── Voice bubble auto-summaries ────────────
  document.querySelectorAll('.voice-bubble').forEach(bubble => {
    const p = bubble.querySelector('p');
    if (!p) return;

    const fullText = p.textContent.trim();
    const preview = fullText.split(' ').slice(0, 8).join(' ') + '...';

    const summary = document.createElement('summary');
    summary.textContent = `"${preview}"`;
    bubble.insertBefore(summary, p);
  });

})();