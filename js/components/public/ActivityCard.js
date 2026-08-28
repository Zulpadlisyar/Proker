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
    const category = activity.category || 'Umum';
    const views = typeof activity.views === 'number' ? activity.views : 0;
    const excerpt = activity.excerpt || (activity.content ? format.truncateText(activity.content, 110) : '');

    const eyeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;

    if (variant === 'list') {
      return `
        <div class="news-card">
          <div class="news-img-wrapper">
            <img src="${activity.image}" alt="${activity.title}" class="news-img" loading="lazy" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.onerror=null; this.src='images/logo.webp'; this.classList.add('img-loaded');">
            <span class="news-badge-tag">${category}</span>
          </div>
          <div class="news-info">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <span class="news-date">${activity.date ? formattedDate.toUpperCase() : 'TERBARU'}</span>
              <span style="font-size:0.78rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px;" title="${views} kali dibaca">
                ${eyeIconSvg} ${views}
              </span>
            </div>
            <h3 class="news-title">${activity.title}</h3>
            <p class="news-excerpt">${excerpt}</p>
            <a href="detail-kegiatan.html?id=${activity.id}" class="btn-tertiary">Baca selengkapnya →</a>
          </div>
        </div>
      `;
    }

    return `
      <article class="news-card-item">
        <div class="news-img-wrap">
          <img src="${activity.image}" alt="${activity.title}" width="960" height="540" loading="lazy" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.onerror=null; this.src='images/logo.webp'; this.classList.add('img-loaded');">
          <span class="news-badge-tag">${category}</span>
        </div>
        <div class="news-body-content">
          <div class="news-meta-row" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${formattedDate}</span>
            <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.78rem; color:var(--text-muted);" title="${views} kali dibaca">
              ${eyeIconSvg} ${views}
            </span>
          </div>
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
