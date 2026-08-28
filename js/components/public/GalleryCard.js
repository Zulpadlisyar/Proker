/**
 * SDN 2 Ngeposari - Reusable GalleryCard Component
 * Single source of truth for rendering photo gallery cards.
 */

(function (root) {
  'use strict';

  function createGalleryCard(item, options = {}) {
    if (!item) return '';

    return `
      <div class="gallery-card" data-caption="${item.caption}" data-image="${item.image}">
        <img src="${item.image}" alt="${item.caption}" class="gallery-img" loading="lazy" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.classList.add('img-loaded')">
        <div class="gallery-overlay">
          <div class="gallery-caption">${item.caption}</div>
        </div>
      </div>
    `;
  }

  const SchoolGalleryCard = {
    createGalleryCard
  };

  root.SchoolGalleryCard = SchoolGalleryCard;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolGalleryCard;
  }
})(typeof window !== 'undefined' ? window : global);
