/**
 * SDN 2 Ngeposari - Reusable ActivityCard Component
 * Single source of truth for rendering activity / news cards on Home and Activities pages.
 */

(function (root) {
  'use strict';

  function createActivityCard(activity, options = {}) {
    if (!activity) return '';

    const variant = options.variant || 'editorial';
    const format = root.SchoolFormatters || {
      formatDate: (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      truncateText: (s, l) => (s && s.length > l ? s.substring(0, l) + '...' : s)
    };

    const formattedDate = format.formatDate(activity.date);
    const category = activity.category || 'Kegiatan';
    const excerpt = activity.excerpt || (activity.content ? format.truncateText(activity.content, 110) : '');

    if (variant === 'list') {
      return `
        <div class="news-card">
          <div class="news-img-wrapper">
            <img src="${activity.image}" alt="${activity.title}" class="news-img" loading="lazy" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.classList.add('img-loaded')">
          </div>
          <div class="news-info">
            <span class="news-date">${activity.date ? formattedDate.toUpperCase() : 'TERBARU'}</span>
            <h3 class="news-title">${activity.title}</h3>
            <p class="news-excerpt">${activity.excerpt || ''}</p>
            <a href="detail-kegiatan.html?id=${activity.id}" class="btn-tertiary">Baca selengkapnya →</a>
          </div>
        </div>
      `;
    }

    return `
      <article class="news-card-item">
        <div class="news-img-wrap">
          <img src="${activity.image}" alt="${activity.title}" width="960" height="540" loading="lazy" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.classList.add('img-loaded')">
          <span class="news-badge-tag">${category}</span>
        </div>
        <div class="news-body-content">
          <div class="news-meta-row">${formattedDate}</div>
          <h3 class="news-title">${activity.title}</h3>
          <p class="news-snippet-text">${excerpt}</p>
          <a href="detail-kegiatan.html?id=${activity.id}" class="news-read-more">Baca selengkapnya &rarr;</a>
        </div>
      </article>
    `;
  }

  const SchoolActivityCard = {
    createActivityCard
  };

  root.SchoolActivityCard = SchoolActivityCard;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolActivityCard;
  }
})(typeof window !== 'undefined' ? window : global);
