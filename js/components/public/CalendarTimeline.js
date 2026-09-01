/**
 * SDN 2 Ngeposari - Academic Calendar Vertical Timeline Component
 * Handles chronological filtering, countdown badges, and Google Calendar export deep-links.
 */

(function (root) {
  'use strict';

  const MONTH_MAP = {
    'JAN': { num: 1, year: 2027 }, 'PEB': { num: 2, year: 2027 }, 'FEB': { num: 2, year: 2027 },
    'MAR': { num: 3, year: 2027 }, 'APR': { num: 4, year: 2027 }, 'MEI': { num: 5, year: 2027 },
    'JUN': { num: 6, year: 2027 }, 'JUL': { num: 7, year: 2026 }, 'AGU': { num: 8, year: 2026 },
    'SEP': { num: 9, year: 2026 }, 'OKT': { num: 10, year: 2026 }, 'NOV': { num: 11, year: 2026 },
    'DES': { num: 12, year: 2026 }
  };

  function getEventStartDate(ev) {
    const mKey = (ev.month || '').toUpperCase().trim();
    const mInfo = MONTH_MAP[mKey] || { num: 9, year: 2026 };
    let day = 1;
    if (ev.date) {
      const m = String(ev.date).match(/\d+/);
      if (m) day = parseInt(m[0], 10);
    }
    return new Date(mInfo.year, mInfo.num - 1, day);
  }

  function getEventEndDate(ev) {
    const mKey = (ev.month || '').toUpperCase().trim();
    const mInfo = MONTH_MAP[mKey] || { num: 9, year: 2026 };
    let day = 1;
    if (ev.date) {
      const nums = String(ev.date).match(/\d+/g);
      day = nums && nums.length > 1 ? parseInt(nums[1], 10) : (nums ? parseInt(nums[0], 10) : 1);
    }
    return new Date(mInfo.year, mInfo.num - 1, day, 23, 59, 59);
  }

  function getReferenceDate() {
    const now = new Date();
    return now.getFullYear() >= 2026 ? now : new Date(2026, 8, 1);
  }

  function createGoogleCalendarUrl(ev) {
    const s = getEventStartDate(ev);
    const e = getEventEndDate(ev);
    const pad = n => String(n).padStart(2, '0');
    const startStr = `${s.getFullYear()}${pad(s.getMonth() + 1)}${pad(s.getDate())}`;
    const nextDay = new Date(e);
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;

    const title = encodeURIComponent(`${ev.title} — SDN Ngeposari 2`);
    const details = encodeURIComponent(`${ev.desc || ev.description || 'Agenda Resmi SDN Ngeposari 2'}\n\nKategori: ${ev.category || 'Akademik'}\nSasaran: ${ev.target || 'Seluruh Siswa'}`);
    const location = encodeURIComponent('SDN Ngeposari 2, Mojo RT 01/RW13, Ngeposari, Semanu, Gunungkidul, DIY 55893');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  }

  function getCountdownText(ev) {
    const s = getEventStartDate(ev);
    const diffMs = s - getReferenceDate();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari Ini';
    if (diffDays > 0 && diffDays <= 7) return `${diffDays} hari lagi`;
    if (diffDays > 7 && diffDays <= 30) return `${Math.ceil(diffDays / 7)} minggu lagi`;
    if (diffDays > 30) return `${Math.round(diffDays / 30)} bulan lagi`;
    return null;
  }

  function getCategoryMeta(cat, title) {
    const c = ((cat || '') + ' ' + (title || '')).toLowerCase();
    if (c.includes('ujian') || c.includes('anbk') || c.includes('pts') || c.includes('pas') || c.includes('pat') || c.includes('asesmen')) {
      return { theme: 'theme-amber', badgeClass: 'badge-ujian', label: 'Ujian & Asesmen' };
    }
    if (c.includes('pramuka') || c.includes('mpls') || c.includes('porseni') || c.includes('lomba') || c.includes('kegiatan')) {
      return { theme: 'theme-green', badgeClass: 'badge-kegiatan', label: 'Kegiatan & Lomba' };
    }
    if (c.includes('libur')) {
      return { theme: 'theme-red', badgeClass: 'badge-libur', label: 'Hari Libur' };
    }
    return { theme: 'theme-blue', badgeClass: 'badge-akademik', label: 'Akademik' };
  }

  function renderTimeline({ containerId = 'calendar-vertical-list', filterTabsId = 'calendar-filter-tabs', searchInputId = 'calendar-search-input', events = [] }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filterTabs = document.getElementById(filterTabsId);
    const searchInput = document.getElementById(searchInputId);

    let currentFilter = 'nearest';
    let currentSearch = '';
    const refDate = getReferenceDate();

    const listWithDates = events.map(e => ({
      ...e,
      _startDate: getEventStartDate(e),
      _endDate: getEventEndDate(e)
    })).sort((a, b) => a._startDate - b._startDate);

    function applyFilter() {
      let filtered = listWithDates;
      const isNearest = (currentFilter === 'nearest');

      if (isNearest) {
        const upcoming = listWithDates.filter(e => e._endDate >= refDate || e._startDate >= refDate);
        filtered = (upcoming.length > 0 ? upcoming : listWithDates).slice(0, 5);
      } else if (currentFilter !== 'all') {
        filtered = filtered.filter(ev => {
          const cat = (ev.category || '').toLowerCase();
          const sem = (ev.semester || '').toLowerCase();
          const title = (ev.title || '').toLowerCase();
          const month = (ev.month || '').toLowerCase();

          if (currentFilter === 'gasal' || currentFilter === 'ganjil') {
            return sem.includes('gasal') || sem.includes('ganjil') || ['jul', 'agu', 'sep', 'okt', 'nov', 'des'].includes(month);
          }
          if (currentFilter === 'genap') {
            return sem.includes('genap') || ['jan', 'feb', 'mar', 'apr', 'mei', 'jun'].includes(month);
          }
          if (currentFilter === 'ujian') {
            return cat.includes('ujian') || title.includes('anbk') || title.includes('pts') || title.includes('pas') || title.includes('pat') || title.includes('asesmen');
          }
          if (currentFilter === 'kegiatan') {
            return cat.includes('kegiatan') || title.includes('pramuka') || title.includes('mpls') || title.includes('porseni') || title.includes('lomba');
          }
          if (currentFilter === 'libur') {
            return cat.includes('libur') || title.includes('libur');
          }
          return true;
        });
      }

      if (currentSearch.trim() !== '') {
        const q = currentSearch.toLowerCase().trim();
        filtered = filtered.filter(ev => {
          const str = ((ev.title || '') + ' ' + (ev.desc || ev.description || '') + ' ' + (ev.month || '') + ' ' + (ev.date || '') + ' ' + (ev.category || '')).toLowerCase();
          return str.includes(q);
        });
      }

      if (filtered.length === 0) {
        container.innerHTML = window.SchoolEmptyState
          ? window.SchoolEmptyState.createEmptyState({ title: 'Agenda tidak ditemukan', description: 'Tidak ada jadwal agenda yang cocok dengan filter atau kata kunci pencarian Anda.' })
          : `<div style="text-align:center; padding: 3rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-card); border: 1px solid var(--border);"><p style="font-size:1rem; color:var(--text-muted);">Tidak ada agenda yang sesuai dengan filter pencarian.</p></div>`;
        return;
      }

      const statusBarHtml = isNearest
        ? `
          <div class="calendar-status-bar">
            <span class="calendar-status-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>Menampilkan <strong>5 Agenda Terdekat</strong> Tahun Ajaran 2026/2027</span>
            </span>
            <button type="button" class="calendar-toggle-all-btn" id="btn-show-all-cal">Lihat Semua Agenda (${events.length}) →</button>
          </div>
        `
        : (currentFilter === 'all' && !currentSearch
          ? `
            <div class="calendar-status-bar">
              <span class="calendar-status-text">
                <span>Menampilkan seluruh <strong>${events.length} agenda akademik</strong> tahunan</span>
              </span>
              <button type="button" class="calendar-toggle-all-btn" id="btn-show-nearest-cal">⚡ Tampilkan 5 Terdekat</button>
            </div>
          `
          : '');

      const cardsHtml = filtered.map((ev, idx) => {
        const meta = getCategoryMeta(ev.category, ev.title);
        const semesterText = ev.semester ? `Semester ${ev.semester}` : (['JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'].includes((ev.month || '').toUpperCase()) ? 'Semester Gasal' : 'Semester Genap');
        const targetText = ev.target || 'Semua Kelas';
        const countdown = getCountdownText(ev);
        const gCalUrl = createGoogleCalendarUrl(ev);

        return `
          <div class="calendar-vertical-card ${idx === 0 && isNearest ? 'is-nearest' : ''}">
            <div class="calendar-vertical-left">
              <div class="academic-date-block ${meta.theme}">
                <span class="month-txt">${ev.month || 'BLN'}</span>
                <span class="date-num">${ev.date || '01'}</span>
              </div>
            </div>
            <div class="calendar-vertical-content">
              <div class="calendar-meta-row">
                <span class="academic-tag-badge ${meta.badgeClass}">${ev.category || meta.label}</span>
                <span class="academic-target-pill">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  ${targetText}
                </span>
                ${countdown ? `<span class="calendar-countdown-badge">⏳ ${countdown}</span>` : ''}
              </div>
              <h3 class="calendar-vertical-title">${ev.title}</h3>
              <p class="calendar-vertical-desc">${ev.desc || ev.description || 'Agenda pembelajaran, evaluasi capaian belajar, dan pembiasaan positif di SDN Ngeposari 2.'}</p>
            </div>
            <div class="calendar-vertical-right">
              <a href="${gCalUrl}" target="_blank" rel="noopener noreferrer" class="calendar-add-btn" title="Simpan agenda ini ke Google Kalender Anda">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
                <span>+ Google Kalender</span>
              </a>
              <span class="academic-semester-label">${semesterText}</span>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = statusBarHtml + cardsHtml;

      const btnShowAll = document.getElementById('btn-show-all-cal');
      if (btnShowAll && filterTabs) {
        btnShowAll.addEventListener('click', () => {
          const allBtn = filterTabs.querySelector('[data-cal-filter="all"]');
          if (allBtn) allBtn.click();
        });
      }

      const btnShowNearest = document.getElementById('btn-show-nearest-cal');
      if (btnShowNearest && filterTabs) {
        btnShowNearest.addEventListener('click', () => {
          const nearestBtn = filterTabs.querySelector('[data-cal-filter="nearest"]');
          if (nearestBtn) nearestBtn.click();
        });
      }
    }

    if (filterTabs) {
      filterTabs.querySelectorAll('.filter-tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterTabs.querySelectorAll('.filter-tag-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.getAttribute('data-cal-filter') || 'all';
          applyFilter();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        applyFilter();
      });
    }

    applyFilter();
  }

  const SchoolCalendarTimeline = {
    getEventStartDate,
    getEventEndDate,
    createGoogleCalendarUrl,
    getCountdownText,
    getCategoryMeta,
    renderTimeline
  };

  root.SchoolCalendarTimeline = SchoolCalendarTimeline;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolCalendarTimeline;
  }
})(typeof window !== 'undefined' ? window : global);
