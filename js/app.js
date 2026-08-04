/* ==========================================================================
   進能服 (6692) 綠電售電業評估 v3 — 互動腳本與 Chart.js 圖表引擎
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let currentSlideIndex = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const slideViewport = document.getElementById('slideViewport');
  const currentSlideEl = document.getElementById('currentSlideNum');
  const totalSlidesEl = document.getElementById('totalSlidesNum');
  
  if (totalSlidesEl) totalSlidesEl.textContent = totalSlides;

  // Function to Update Slide View
  function updateSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentSlideIndex = index;

    if (slideViewport) {
      slideViewport.style.transform = `translateX(-${currentSlideIndex * 100}vw)`;
    }

    if (currentSlideEl) {
      currentSlideEl.textContent = currentSlideIndex + 1;
    }
  }

  // Next / Prev Buttons
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');

  if (prevBtn) prevBtn.addEventListener('click', () => updateSlide(currentSlideIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateSlide(currentSlideIndex + 1));

  // Keyboard Navigation (Arrow Keys)
  document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('dashboard-active')) return;
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      updateSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      updateSlide(currentSlideIndex - 1);
    }
  });

  // Mode Switcher (Slide Deck vs Executive Dashboard)
  const modeDeckBtn = document.getElementById('modeDeckBtn');
  const modeDashboardBtn = document.getElementById('modeDashboardBtn');

  if (modeDeckBtn && modeDashboardBtn) {
    modeDeckBtn.addEventListener('click', () => {
      document.body.classList.remove('dashboard-active');
      modeDeckBtn.classList.add('active');
      modeDashboardBtn.classList.remove('active');
      updateSlide(currentSlideIndex);
    });

    modeDashboardBtn.addEventListener('click', () => {
      document.body.classList.add('dashboard-active');
      modeDashboardBtn.classList.add('active');
      modeDeckBtn.classList.remove('active');
    });
  }

  // Theme Switcher (Dark / Light)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      themeToggleBtn.textContent = newTheme === 'light' ? '🌙 深色模式' : '☀️ 淺色模式';
      // Re-render charts for theme compatibility if needed
    });
  }

  // Fullscreen Button
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Initialize Chart.js Graphics
  initCharts();
});

function initCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart 1: Unit Economics Breakdown
  const ctxUnit = document.getElementById('unitEconomicsChart');
  if (ctxUnit) {
    new Chart(ctxUnit.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['毛價差 (0.76)', '轉供費 (-0.31)', '備用容量 (-0.05)', '作業成本 (-0.10)', '餘電與補量 (-0.13)', '信用與融資 (-0.06)', '每度淨貢獻 (+0.11)'],
        datasets: [{
          label: '元／度 (TWD/kWh)',
          data: [0.76, -0.3052, -0.05, -0.10, -0.13, -0.06, 0.11],
          backgroundColor: [
            'rgba(16, 185, 129, 0.85)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(59, 130, 246, 0.9)'
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'v3 雙軌加權每度淨貢獻拆解 (單位：元／度)', color: '#f0f6fc', font: { size: 14 } }
        },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } }
        }
      }
    });
  }

  // Chart 2: Annual P&L Scenarios
  const ctxPL = document.getElementById('profitScenarioChart');
  if (ctxPL) {
    new Chart(ctxPL.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['A. 僅訂閱 POXA', 'B. 含平台共建 (400萬)', 'C. 餘電聚合達 40%', 'D. 25 GWh 樂觀試算'],
        datasets: [
          {
            label: '年貢獻 (萬)',
            data: [220, 220, 440, 875],
            backgroundColor: 'rgba(16, 185, 129, 0.8)'
          },
          {
            label: '固定成本 (萬)',
            data: [-685, -818, -818, -818],
            backgroundColor: 'rgba(239, 68, 68, 0.7)'
          },
          {
            label: '年淨損益 (萬)',
            data: [-465, -598, -378, 57],
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            type: 'line',
            borderColor: '#3b82f6',
            borderWidth: 3,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f0f6fc' } },
          title: { display: true, text: '20 GWh 規模下 4 大損益情境比較 (單位：萬元／年)', color: '#f0f6fc', font: { size: 14 } }
        },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }

  // Chart 3: Budget Distribution (3000萬)
  const ctxBudget = document.getElementById('budgetDoughnutChart');
  if (ctxBudget) {
    new Chart(ctxBudget.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['團隊人力 (1,238萬)', '系統與代操 (260萬)', '平台共建 (400萬)', '法務顧問申照 (230萬)', '保證金 (150萬)', '營運資金與虧損緩衝 (730萬)'],
        datasets: [{
          data: [1238, 260, 400, 230, 150, 730],
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#8b5cf6',
            '#f59e0b',
            '#06b6d4',
            '#64748b'
          ],
          borderWidth: 2,
          borderColor: '#132235'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#f0f6fc', font: { size: 12 } } },
          title: { display: true, text: '三年 3,000 萬封頂預算拆解 (選項丙構想)', color: '#f0f6fc', font: { size: 14 } }
        }
      }
    });
  }
}
