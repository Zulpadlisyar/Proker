/**
 * SDN 2 Ngeposari - Reusable TeacherCard Component
 * Single source of truth for rendering teacher / staff profiles.
 */

(function (root) {
  'use strict';

  function createTeacherCard(teacher, options = {}) {
    if (!teacher) return '';

    return `
      <div class="editorial-card-wrapper">
        <div class="editorial-card-img-container">
          <img src="${teacher.image}" alt="${teacher.name}" class="editorial-card-img" loading="lazy" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.classList.add('img-loaded')">
        </div>
        <div class="editorial-card-body">
          <h3>${teacher.name}</h3>
          <p>${teacher.role}</p>
        </div>
      </div>
    `;
  }

  const SchoolTeacherCard = {
    createTeacherCard
  };

  root.SchoolTeacherCard = SchoolTeacherCard;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolTeacherCard;
  }
})(typeof window !== 'undefined' ? window : global);
