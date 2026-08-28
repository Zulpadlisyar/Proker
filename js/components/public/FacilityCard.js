/**
 * SDN 2 Ngeposari - Reusable FacilityCard Component
 * Single source of truth for rendering facility cards across public pages.
 */

(function (root) {
  'use strict';

  function createFacilityCard(facility, options = {}) {
    if (!facility) return '';

    return `
      <div class="facility-card">
        <div class="facility-img-wrapper">
          <img src="${facility.image}" alt="${facility.name}" class="facility-img" loading="lazy" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.classList.add('img-loaded')">
        </div>
        <div class="facility-info">
          <h3>${facility.name}</h3>
          <p>${facility.description}</p>
        </div>
      </div>
    `;
  }

  const SchoolFacilityCard = {
    createFacilityCard
  };

  root.SchoolFacilityCard = SchoolFacilityCard;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolFacilityCard;
  }
})(typeof window !== 'undefined' ? window : global);
