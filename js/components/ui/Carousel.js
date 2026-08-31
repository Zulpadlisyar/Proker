/**
 * SDN 2 Ngeposari - Universal Adaptive Carousel Component
 * Automatically switches between standard CSS grid (if count <= threshold)
 * and interactive smooth-snapping Carousel with navigation & pagination (if count > threshold).
 */

(function (root) {
  'use strict';

  function renderAdaptive(options) {
    const {
      containerId,
      items,
      threshold = 4,
      renderItem,
      gridClass = '',
      itemClass = '',
      ariaLabel = 'Carousel',
      carouselItemWidth = null
    } = options;

    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container || !Array.isArray(items)) return;

    if (items.length === 0) {
      container.innerHTML = '';
      return;
    }

    // 1. If item count <= threshold: Render standard responsive grid
    if (items.length <= threshold) {
      container.className = gridClass;
      container.innerHTML = items.map((item, idx) => renderItem(item, idx)).join('');
      return;
    }

    // 2. If item count > threshold: Render high-performance scroll-snap carousel
    container.className = 'carousel-adaptive-wrapper';
    container.innerHTML = `
      <div class="carousel-viewport-container" role="region" aria-roledescription="carousel" aria-label="${ariaLabel}">
        <button class="carousel-nav-btn carousel-prev" aria-label="Slide sebelumnya" title="Sebelumnya">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <div class="carousel-track ${gridClass ? 'carousel-track-' + gridClass : ''}" tabindex="0" aria-live="polite">
          ${items.map((item, idx) => `
            <div class="carousel-slide-item ${itemClass}" role="group" aria-roledescription="slide" aria-label="${idx + 1} dari ${items.length}" data-index="${idx}">
              ${renderItem(item, idx)}
            </div>
          `).join('')}
        </div>

        <button class="carousel-nav-btn carousel-next" aria-label="Slide berikutnya" title="Berikutnya">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div class="carousel-dots-wrapper" role="tablist" aria-label="Pilih slide">
          ${items.map((_, idx) => `
            <button class="carousel-dot ${idx === 0 ? 'active' : ''}" role="tab" aria-selected="${idx === 0}" aria-label="Slide ${idx + 1}" data-index="${idx}"></button>
          `).join('')}
        </div>
      </div>
    `;

    // 3. Attach interactive events
    initCarouselControls(container, items.length);
  }

  function initCarouselControls(wrapper, totalItems) {
    const track = wrapper.querySelector('.carousel-track');
    const prevBtn = wrapper.querySelector('.carousel-prev');
    const nextBtn = wrapper.querySelector('.carousel-next');
    const dots = wrapper.querySelectorAll('.carousel-dot');
    if (!track || !prevBtn || !nextBtn) return;

    let isScrolling = false;

    function getSlideWidth() {
      const firstSlide = track.querySelector('.carousel-slide-item');
      if (firstSlide) {
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 16;
        return firstSlide.offsetWidth + gap;
      }
      return track.clientWidth * 0.8;
    }

    function updateControls() {
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;

      // Update button disabled state
      prevBtn.disabled = scrollLeft <= 4;
      nextBtn.disabled = scrollLeft >= maxScroll - 4;

      // Update active dot
      const slideWidth = getSlideWidth();
      const currentIndex = Math.min(totalItems - 1, Math.max(0, Math.round(scrollLeft / slideWidth)));

      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    // Scroll buttons
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const slideWidth = getSlideWidth();
      track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const slideWidth = getSlideWidth();
      track.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });

    // Dot navigation
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        const slideWidth = getSlideWidth();
        track.scrollTo({ left: targetIndex * slideWidth, behavior: 'smooth' });
      });
    });

    // Track scroll listener with debounced update
    track.addEventListener('scroll', () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          updateControls();
          isScrolling = false;
        });
        isScrolling = true;
      }
    }, { passive: true });

    // Keyboard arrow controls when focused
    track.addEventListener('keydown', (e) => {
      const slideWidth = getSlideWidth();
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    });

    // Initial check
    setTimeout(updateControls, 50);
  }

  const SchoolCarousel = {
    renderAdaptive,
    initCarouselControls
  };

  root.SchoolCarousel = SchoolCarousel;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolCarousel;
  }
})(typeof window !== 'undefined' ? window : global);
