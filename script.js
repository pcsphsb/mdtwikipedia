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

  // ── Budget auto-total ──────────────────────
  const budgetRows = document.querySelectorAll('.budget-table tbody tr[data-low]');
  let low = 0, mid = 0, high = 0;

  budgetRows.forEach(row => {
    low  += parseInt(row.dataset.low  || 0);
    mid  += parseInt(row.dataset.mid  || 0);
    high += parseInt(row.dataset.high || 0);
  });

  const fmt = n => '~' + n.toLocaleString('de-DE') + '+';

  const tl = document.getElementById('total-low');
  const tm = document.getElementById('total-mid');
  const th = document.getElementById('total-high');

  if (tl) tl.textContent = fmt(low);
  if (tm) tm.textContent = fmt(mid);
  if (th) th.textContent = fmt(high);

  // ── Hash routing ───────────────────────────
  function routeFromHash() {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home','modules','professors','language','budget','faq','contribute','portals','schedule','glossary','links'];
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

  // ── Schedule view toggle ────────────────────
  const weeklyBtn   = document.getElementById('weeklyBtn');
  const monthlyBtn  = document.getElementById('monthlyBtn');
  const weeklyView  = document.getElementById('weeklyView');
  const monthlyView = document.getElementById('monthlyView');

  if (weeklyBtn && monthlyBtn) {
    weeklyBtn.addEventListener('click', () => {
      weeklyView.classList.remove('hidden');
      monthlyView.classList.add('hidden');
      weeklyBtn.classList.add('active');
      monthlyBtn.classList.remove('active');
    });

    monthlyBtn.addEventListener('click', () => {
      monthlyView.classList.remove('hidden');
      weeklyView.classList.add('hidden');
      monthlyBtn.classList.add('active');
      weeklyBtn.classList.remove('active');
    });
  }

  // ── Theme toggle ───────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '☾';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '☾' : '☀';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // ── Search ─────────────────────────────────
  const searchToggle  = document.getElementById('searchToggle');
  const searchBar     = document.getElementById('searchBar');
  const searchInput   = document.getElementById('searchInput');
  const searchClear   = document.getElementById('searchClear');
  const searchResults = document.getElementById('searchResults');
  const mainEl        = document.getElementById('main');

  // Index — add any searchable content here
  const searchIndex = [
    // Modules
    { title: 'Business Models and Innovation', page: 'modules', context: 'Core · Digital — Business Model Canvas, Business Pitch, Group projects' },
    { title: 'Supply Chain Management and Digital Transformation', page: 'modules', context: 'Core · Digital — Research paper, defense, case studies' },
    { title: 'Digital Sales and Marketing Strategies', page: 'modules', context: 'Core · Digital — Traditional exam, class activities' },
    { title: 'Cyber Risks and Data Protection', page: 'modules', context: 'Core · Digital — Final essay, case studies' },
    { title: 'Data Science and Methods', page: 'modules', context: 'Core · Digital — Traditional exam, homeworks, class activities, case studies' },
    { title: 'Communication & Presentation', page: 'modules', context: 'Elective — Presentations' },
    // FAQ
    { title: 'Is the program fully in English?', page: 'faq', context: 'Core lectures in English, some electives in German' },
    { title: 'How hard is it to find housing?', page: 'faq', context: 'WG-Gesucht, Immoscout24, Studierendenwerk dorms' },
    { title: 'Can I work while studying?', page: 'faq', context: 'Werkstudent, 120 full days for non-EU students' },
    { title: 'Do I need a German bank account?', page: 'faq', context: 'Commerzbank student accounts' },
    { title: 'How do I get an Anmeldung?', page: 'faq', context: 'City registration within 14 days' },
    { title: 'Are exams retakeable?', page: 'faq', context: 'Prüfungsordnung, second attempt rules' },
    // Professors
    { title: 'Professor Profiles', page: 'professors', context: 'Teaching styles, exam approach, communication tips' },
    // Budget
    { title: 'Monthly Cost Breakdown', page: 'budget', context: 'Rent, groceries, transport, health insurance estimates' },
    { title: 'Student Discounts', page: 'budget', context: 'BahnCard, Spotify, Adobe, Microsoft 365' },
    { title: 'Side Income Options', page: 'budget', context: 'Werkstudent, HiWi, freelancing, visa conditions' },
    { title: 'Scholarships & Funding', page: 'budget', context: 'DAAD, Deutschlandstipendium, foundation scholarships' },
    // Language
    { title: 'University Language Center (SZHB)', page: 'language', context: 'Free German courses for enrolled students' },
    { title: 'Free Online German Courses', page: 'language', context: 'Deutsche Welle, Language Transfer, Duolingo' },
  ];

  function runSearch(query) {
    searchResults.innerHTML = '';
    if (!query.trim()) return;

    const q = query.toLowerCase();
    const hits = searchIndex.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.context.toLowerCase().includes(q)
    );

    if (hits.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found.</div>';
      return;
    }

    hits.slice(0, 6).forEach(item => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      el.innerHTML = `
        <span class="search-result-page">${item.page}</span>
        <span class="search-result-title">${item.title}</span>
        <span class="search-result-context">${item.context}</span>
      `;
      el.addEventListener('click', () => {
        showPage(item.page);
        closeSearch();
      });
      searchResults.appendChild(el);
    });
  }

  function closeSearch() {
    searchBar.classList.remove('visible');
    mainEl.classList.remove('search-open');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    searchBar.classList.toggle('visible');
    mainEl.classList.toggle('search-open');
    if (searchBar.classList.contains('visible')) {
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', () => runSearch(searchInput.value));
  searchClear.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  // ── Glossary search ─────────────────────────
  const glossarySearch = document.getElementById('glossarySearch');

  if (glossarySearch) {
    glossarySearch.addEventListener('input', () => {
      const q = glossarySearch.value.toLowerCase().trim();
      document.querySelectorAll('.glossary-item').forEach(item => {
        const term = item.querySelector('.gterm').textContent.toLowerCase();
        const def  = item.querySelector('.gdef').textContent.toLowerCase();
        item.classList.toggle('hidden', q && !term.includes(q) && !def.includes(q));
      });

      // Hide empty sections
      document.querySelectorAll('.glossary-section').forEach(section => {
        const visible = [...section.querySelectorAll('.glossary-item')]
          .some(i => !i.classList.contains('hidden'));
        section.style.display = visible ? '' : 'none';
      });
    });
  }

  // ── Last updated via GitHub API ─────────────
  fetch('https://api.github.com/repos/pcsphsb/mdtwikipedia/commits?per_page=1')
    .then(r => r.json())
    .then(data => {
      const date = new Date(data[0].commit.author.date);
      const formatted = date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      const el = document.getElementById('lastUpdated');
      if (el) el.textContent = 'Last updated: ' + formatted;
    })
    .catch(() => {});

    // ── Lightbox ────────────────────────────────
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');

  document.querySelectorAll('.screenshot-slot img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightbox.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('visible');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── Auto-span last card in grid ─────────────
  function fixLastCard() {
    const grid = document.querySelector('.cards-grid');
    if (!grid) return;

    const cards = [...grid.querySelectorAll('.card')];
    const last = cards[cards.length - 1];
    if (!last) return;

    // Reset first
    last.style.gridColumn = '';

    // Get computed column count
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const remainder = cards.length % cols;

    if (remainder !== 0) {
      last.style.gridColumn = `span ${cols - remainder + 1}`;
    }
  }

  fixLastCard();
  window.addEventListener('resize', fixLastCard);

})();