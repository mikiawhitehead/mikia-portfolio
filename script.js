// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Animated hero stat counters ----------
const statEls = document.querySelectorAll('.stat[data-count]');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const countSpan = el.querySelector('.count');
    let current = 0;
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      current = Math.round(target * progress);
      countSpan.textContent = current;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.4 });
statEls.forEach(el => statObserver.observe(el));

// ---------- Project filter ----------
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
      const match = filter === 'All' || tags.includes(filter);
      card.classList.toggle('hidden', !match);
      if (match) visibleCount++;
    });
    emptyState.classList.toggle('visible', visibleCount === 0);
  });
});

// ---------- Project expand / collapse (one open at a time) ----------
projectCards.forEach(card => {
  const head = card.querySelector('.project-head');
  const toggleLabel = card.querySelector('.toggle-label');
  head.addEventListener('click', () => {
    const isOpen = card.classList.contains('open');
    projectCards.forEach(c => {
      c.classList.remove('open');
      c.querySelector('.toggle-label').textContent = '+ Detail';
    });
    if (!isOpen) {
      card.classList.add('open');
      toggleLabel.textContent = '— Close';
    }
  });
});

// ---------- Before / after metrics toggle ----------
const modeButtons = document.querySelectorAll('.mode-btn');
const metrics = document.querySelectorAll('.metric');

function applyMode(mode) {
  metrics.forEach(metric => {
    const fill = metric.querySelector('.metric-fill');
    const val = metric.querySelector('.metric-val');
    const width = mode === 'after' ? metric.dataset.afterWidth : metric.dataset.beforeWidth;
    const text = mode === 'after' ? metric.dataset.afterText : metric.dataset.beforeText;
    fill.style.width = width + '%';
    val.textContent = text;
  });
}

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyMode(btn.dataset.mode);
  });
});

// Animate metric bars in once the panel scrolls into view, starting at "before"
const metricsPanel = document.querySelector('.metrics-panel');
if (metricsPanel) {
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        applyMode('before');
        metricsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  metricsObserver.observe(metricsPanel);
}

// ---------- Active nav link highlighting on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.5, rootMargin: '-80px 0px -50% 0px' });

sections.forEach(section => navObserver.observe(section));
