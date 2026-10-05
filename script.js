// ===== DARK MODE =====
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) html.setAttribute('data-theme', saved);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) html.setAttribute('data-theme', 'dark');
toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== SECTION REVEAL =====
const sections = document.querySelectorAll('.section');
sections.forEach(s => s.classList.add('reveal-ready'));
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
sections.forEach(s => revealObs.observe(s));

// ===== STAT COUNTERS =====
const statEls = document.querySelectorAll('.stat-item[data-count]');
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = parseInt(el.dataset.count, 10), span = el.querySelector('.count');
    const dur = 800, start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      span.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObs.unobserve(el);
  });
}, { threshold: 0.4 });
statEls.forEach(el => statObs.observe(el));

// ===== SMOOTH PROJECT FILTER =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const emptyState = document.getElementById('emptyState');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    let visibleCount = 0;

    projectCards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
      const shouldShow = filter === 'All' || tags.includes(filter);

      if (shouldShow && card.classList.contains('hidden')) {
        // Show: remove hidden, add showing animation
        card.classList.remove('hidden', 'hiding');
        card.classList.add('showing');
        card.addEventListener('animationend', () => card.classList.remove('showing'), { once: true });
        visibleCount++;
      } else if (shouldShow) {
        // Already visible
        visibleCount++;
      } else if (!shouldShow && !card.classList.contains('hidden')) {
        // Hide: animate out, then set display none
        card.classList.add('hiding');
        setTimeout(() => {
          card.classList.add('hidden');
          card.classList.remove('hiding');
        }, 300);
      }
    });

    emptyState.classList.toggle('visible', visibleCount === 0);
  });
});

// ===== PROJECT EXPAND =====
projectCards.forEach(card => {
  const head = card.querySelector('.project-head');
  const label = card.querySelector('.toggle-label');
  head.addEventListener('click', () => {
    const isOpen = card.classList.contains('open');
    projectCards.forEach(c => { c.classList.remove('open'); c.querySelector('.toggle-label').textContent = '+ Detail'; });
    if (!isOpen) { card.classList.add('open'); label.textContent = '— Close'; }
  });
});

// ===== BEFORE / AFTER METRICS =====
const modeButtons = document.querySelectorAll('.mode-btn');
const metrics = document.querySelectorAll('.metric');
function applyMode(mode) {
  metrics.forEach(m => {
    m.querySelector('.metric-fill').style.width = (mode === 'after' ? m.dataset.afterWidth : m.dataset.beforeWidth) + '%';
    m.querySelector('.metric-val').textContent = mode === 'after' ? m.dataset.afterText : m.dataset.beforeText;
  });
}
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyMode(btn.dataset.mode);
  });
});
const metricsPanel = document.querySelector('.metrics-panel');
if (metricsPanel) {
  const mObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { applyMode('before'); mObs.unobserve(e.target); } });
  }, { threshold: 0.25 });
  mObs.observe(metricsPanel);
}

// ===== BLOB PARALLAX =====
const blobs = document.querySelectorAll('.blob');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      [0.03, -0.02, 0.015].forEach((s, i) => { if (blobs[i]) blobs[i].style.marginTop = (y * s) + 'px'; });
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ===== NAV HIGHLIGHT =====
const navLinks = document.querySelectorAll('.nav a');
const sectionEls = document.querySelectorAll('section[id]');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navLinks.forEach(l => { l.style.color = l.getAttribute('href') === '#' + id ? 'var(--accent)' : ''; });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
sectionEls.forEach(s => navObs.observe(s));
