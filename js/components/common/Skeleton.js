/**
 * SDN 2 Ngeposari - Reusable Skeleton Loading Component
 * Provides synchronized shimmer placeholder cards to eliminate cumulative layout shift (CLS).
 */

(function (root) {
  'use strict';

  function createActivitySkeleton(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="news-card-item skeleton-card" style="pointer-events:none;">
          <div class="news-img-wrap shimmer-box" style="aspect-ratio: 16/9; background-color: var(--surface-alt);"></div>
          <div class="news-body-content">
            <div class="shimmer-box" style="height: 14px; width: 30%; border-radius: 4px; margin-bottom: 10px; background-color: var(--surface-alt);"></div>
            <div class="shimmer-box" style="height: 20px; width: 85%; border-radius: 4px; margin-bottom: 8px; background-color: var(--surface-alt);"></div>
            <div class="shimmer-box" style="height: 14px; width: 100%; border-radius: 4px; margin-bottom: 6px; background-color: var(--surface-alt);"></div>
            <div class="shimmer-box" style="height: 14px; width: 65%; border-radius: 4px; background-color: var(--surface-alt);"></div>
          </div>
        </div>
      `;
    }
    return html;
  }

  function createFacilitySkeleton(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="facility-card skeleton-card" style="pointer-events:none;">
          <div class="facility-img-wrapper shimmer-box" style="aspect-ratio: 16/10; background-color: var(--surface-alt);"></div>
          <div class="facility-info">
            <div class="shimmer-box" style="height: 20px; width: 70%; border-radius: 4px; margin-bottom: 8px; background-color: var(--surface-alt);"></div>
            <div class="shimmer-box" style="height: 14px; width: 95%; border-radius: 4px; margin-bottom: 6px; background-color: var(--surface-alt);"></div>
            <div class="shimmer-box" style="height: 14px; width: 50%; border-radius: 4px; background-color: var(--surface-alt);"></div>
          </div>
        </div>
      `;
    }
    return html;
  }

  function createTeacherSkeleton(count = 4) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="editorial-card-wrapper skeleton-card" style="pointer-events:none;">
          <div class="editorial-card-img-container shimmer-box" style="aspect-ratio: 1/1; background-color: var(--surface-alt);"></div>
          <div class="editorial-card-body">
            <div class="shimmer-box" style="height: 18px; width: 80%; border-radius: 4px; margin: 0 auto 6px; background-color: var(--surface-alt);"></div>
            <div class="shimmer-box" style="height: 13px; width: 60%; border-radius: 4px; margin: 0 auto; background-color: var(--surface-alt);"></div>
          </div>
        </div>
      `;
    }
    return html;
  }

  const SchoolSkeleton = {
    createActivitySkeleton,
    createFacilitySkeleton,
    createTeacherSkeleton
  };

  root.SchoolSkeleton = SchoolSkeleton;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolSkeleton;
  }
})(typeof window !== 'undefined' ? window : global);
