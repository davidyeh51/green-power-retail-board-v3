const slides = [...document.querySelectorAll('.slide')];
const current = document.getElementById('currentPage');
const total = document.getElementById('totalPages');
const progress = document.getElementById('progressBar');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
const overview = document.getElementById('overviewBtn');
let active = 0;

if (total) total.textContent = String(slides.length).padStart(2, '0');

function go(index) {
  active = Math.max(0, Math.min(slides.length - 1, index));
  slides[active].scrollIntoView({ behavior: 'smooth', block: 'start' });
  update(active);
}

function update(index) {
  active = index;
  if (current) current.textContent = String(index + 1).padStart(2, '0');
  if (progress) progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  document.title = `${String(index + 1).padStart(2, '0')}｜${slides[index].dataset.title || '簡報'}｜進能服售電業評估 v3 董事會簡報`;
  if (prev) prev.disabled = index === 0;
  if (next) next.disabled = index === slides.length - 1;
}

const observer = new IntersectionObserver((entries) => {
  if (document.body.classList.contains('overview')) return;
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio > .55) update(slides.indexOf(entry.target));
  });
}, { threshold: [.55, .75] });

slides.forEach((slide) => observer.observe(slide));

if (prev) prev.addEventListener('click', () => go(active - 1));
if (next) next.addEventListener('click', () => go(active + 1));

document.addEventListener('keydown', (event) => {
  if (document.body.classList.contains('overview') && event.key !== 'Escape') return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(active + 1); }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); go(active - 1); }
  if (event.key === 'Home') { event.preventDefault(); go(0); }
  if (event.key === 'End') { event.preventDefault(); go(slides.length - 1); }
  if (event.key === 'Escape') toggleOverview(false);
});

function toggleOverview(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !document.body.classList.contains('overview');
  document.body.classList.toggle('overview', shouldOpen);
  if (overview) overview.textContent = shouldOpen ? '返回簡報' : '總覽';
  if (!shouldOpen) setTimeout(() => go(active), 10);
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (overview) overview.addEventListener('click', () => toggleOverview());
slides.forEach((slide, index) => slide.addEventListener('click', () => {
  if (!document.body.classList.contains('overview')) return;
  active = index;
  toggleOverview(false);
}));

let touchStartX = null;
document.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (event) => {
  if (touchStartX === null || document.body.classList.contains('overview')) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 70) go(active + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

update(0);
