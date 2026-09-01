/**
 * SDN 2 Ngeposari - Public Website Main Orchestrator
 * Composes declarative page layouts using reusable cards, navigation, footer, and GSAP micro-interactions.
 */

(function () {
  'use strict';

  // 2. Toast / Notification Primitive
  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 220ms forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }

  // 3. Dialog Modal Helper
  function openDialog(title, htmlContent) {
    const overlay = document.getElementById('dialog-overlay');
    const bodyContent = document.getElementById('dialog-body-content');
    const titleText = document.getElementById('dialog-title-text');

    if (overlay && bodyContent && titleText) {
      titleText.textContent = title;
      bodyContent.innerHTML = htmlContent;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function initDialogOverlay() {
    if (!document.getElementById('dialog-overlay')) {
      const dialog = document.createElement('div');
      dialog.id = 'dialog-overlay';
      dialog.className = 'dialog-overlay';
      dialog.innerHTML = `
        <div class="dialog-modal">
          <div class="dialog-header">
            <h3 id="dialog-title-text" style="font-size: 1.15rem; font-weight:700; color:var(--primary); margin:0;"></h3>
            <button class="dialog-close-btn" id="dialog-close-btn" aria-label="Tutup Dialog">&times;</button>
          </div>
          <div class="dialog-body" id="dialog-body-content" style="padding: 1.5rem;"></div>
        </div>
      `;
      document.body.appendChild(dialog);

      const closeBtn = document.getElementById('dialog-close-btn');
      const closeDialog = () => {
        dialog.classList.remove('open');
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', closeDialog);
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeDialog();
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog.classList.contains('open')) closeDialog();
      });
    }
  }

  // 4. Common Layout (Navbar, Footer, Contact CTAs)
  async function renderCommonUI() {
    let profile = { name: 'SDN Ngeposari 2', logo: 'images/logo.webp', tagline: 'Semanu, Gunungkidul' };
    let contact = { address: 'Mojo RT 01 / RW 13, Ngeposari, Semanu, Gunungkidul, DIY 55893', phone: '0812-3456-7890', email: 'info@sdnngeposari2.sch.id' };

    try {
      if (window.SchoolDB) {
        profile = window.SchoolDB.getProfile() || profile;
        contact = window.SchoolDB.getContact() || contact;
      }
    } catch (e) {
      console.warn('SchoolDB fallback used:', e);
    }

    // Render Navbar & Footer via Reusable Components
    if (window.SchoolNavbar) {
      window.SchoolNavbar.renderNavbar('main-header', profile);
    }
    if (window.SchoolFooter) {
      window.SchoolFooter.renderFooter('main-footer', profile, contact);
    }

    // Sync any CTA boxes
    const ctaBoxes = document.querySelectorAll('.contact-cta-box');
    ctaBoxes.forEach(box => {
      const addrEl = box.querySelector('.contact-detail-row:nth-child(1) span');
      const phoneEl = box.querySelector('.contact-detail-row:nth-child(2) span');
      const emailEl = box.querySelector('.contact-detail-row:nth-child(3) span');
      if (addrEl && contact.address) addrEl.innerHTML = `<strong>Alamat:</strong> ${contact.address}`;
      if (phoneEl && contact.phone) phoneEl.innerHTML = `<strong>Telepon:</strong> ${contact.phone}`;
      if (emailEl && contact.email) emailEl.innerHTML = `<strong>Email:</strong> ${contact.email}`;
    });

    initDialogOverlay();
  }

  // 5. Beranda (index.html)
  function renderHomePage() {
    const profile = window.SchoolDB.getProfile();
    const activities = window.SchoolDB.getActivities();
    const contact = window.SchoolDB.getContact();

    // Dynamic Hero Typography
    const heroHeadline = document.querySelector('.school-hero-headline') || document.querySelector('.ghibli-hero-headline');
    if (heroHeadline) {
      heroHeadline.textContent = 'Tempat Belajar & Tumbuh Penuh Inspirasi';
    }
    const heroSubtitle = document.querySelector('.school-hero-subtitle') || document.querySelector('.ghibli-hero-subtitle');
    if (heroSubtitle && profile.description) {
      heroSubtitle.textContent = profile.description;
    }

    // Editorial News Grid
    const newsContainer = document.getElementById('news-editorial-grid') || document.getElementById('news-grid-container');
    if (newsContainer) {
      if (activities.length === 0) {
        newsContainer.innerHTML = window.SchoolEmptyState
          ? window.SchoolEmptyState.createEmptyState({ title: 'Belum ada kegiatan', description: 'Belum ada kegiatan yang ditampilkan.' })
          : `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">Belum ada kegiatan yang ditampilkan.</div>`;
      } else {
        const latestActivities = activities.slice(0, 3);
        newsContainer.innerHTML = latestActivities.map(a => window.SchoolActivityCard.createActivityCard(a, { variant: 'editorial' })).join('');
      }
    }

    // Dynamic School Habits / Pembiasaan Baik (Adaptive Carousel: Threshold > 4)
    const pillarsContainer = document.getElementById('pillars-grid');
    if (pillarsContainer) {
      const habits = window.SchoolDB.getHabits() || [];
      if (window.SchoolCarousel) {
        window.SchoolCarousel.renderAdaptive({
          containerId: pillarsContainer,
          items: habits,
          threshold: 4,
          gridClass: 'pillars-grid',
          itemClass: 'pillar-slide',
          ariaLabel: 'Pembiasaan Baik dan Budaya Sekolah',
          renderItem: (h) => `
            <div class="pillar-card">
              <div class="pillar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/></svg>
              </div>
              <h4>${h.title}</h4>
              <p>${h.desc || h.description || ''}</p>
            </div>
          `
        });
      } else if (habits.length > 0) {
        pillarsContainer.innerHTML = habits.map(h => `
          <div class="pillar-card">
            <div class="pillar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/></svg>
            </div>
            <h4>${h.title}</h4>
            <p>${h.desc || h.description || ''}</p>
          </div>
        `).join('');
      }
    }

    // Dynamic Academic Calendar (Adaptive Carousel: Threshold > 4)
    const calendarContainer = document.getElementById('academic-calendar-grid');
    if (calendarContainer) {
      const calendarEvents = window.SchoolDB.getCalendar() || [];
      if (window.SchoolCarousel) {
        window.SchoolCarousel.renderAdaptive({
          containerId: calendarContainer,
          items: calendarEvents,
          threshold: 4,
          gridClass: 'academic-calendar-grid',
          itemClass: 'calendar-slide',
          ariaLabel: 'Agenda dan Kalender Akademik',
          renderItem: (ev) => `
            <div class="calendar-card-item" style="display: flex; gap: 16px; align-items: center; padding: 16px; background-color: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-sm); height: 100%; box-sizing: border-box;">
              <div style="background-color: var(--primary); color: #fff; text-align: center; border-radius: var(--radius-sm); padding: 8px 12px; min-width: 50px; flex-shrink: 0;">
                <div style="font-size: 11px; text-transform: uppercase; font-weight: 700;">${ev.month || 'BLN'}</div>
                <div style="font-size: 18px; font-weight: 800; line-height: 1;">${ev.date || '01'}</div>
              </div>
              <div>
                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 2px; color: var(--text);">${ev.title}</h4>
                <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${ev.desc || ev.description || ''}</p>
              </div>
            </div>
          `
        });
      } else if (calendarEvents.length > 0) {
        calendarContainer.innerHTML = calendarEvents.map(ev => `
          <div style="display: flex; gap: 16px; align-items: center; padding: 16px; background-color: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-sm);">
            <div style="background-color: var(--primary); color: #fff; text-align: center; border-radius: var(--radius-sm); padding: 8px 12px; min-width: 50px; flex-shrink: 0;">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700;">${ev.month || 'BLN'}</div>
              <div style="font-size: 18px; font-weight: 800; line-height: 1;">${ev.date || '01'}</div>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 2px; color: var(--text);">${ev.title}</h4>
              <p style="font-size: 12px; color: var(--text-muted);">${ev.desc || ev.description || ''}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // Dynamic Testimonials / Kesan & Apresiasi (Adaptive Carousel: Threshold > 3)
    const testimonialsContainer = document.getElementById('testimonials-grid');
    if (testimonialsContainer) {
      const testimonials = window.SchoolDB.getTestimonials() || [];
      if (window.SchoolCarousel) {
        window.SchoolCarousel.renderAdaptive({
          containerId: testimonialsContainer,
          items: testimonials,
          threshold: 3,
          gridClass: 'testimonials-grid',
          itemClass: 'testimonial-slide',
          ariaLabel: 'Kesan dan Apresiasi Wali Murid',
          renderItem: (t) => `
            <div class="testimonial-card">
              <p class="testimonial-quote">"${t.quote}"</p>
              <div class="testimonial-author">
                <img src="${t.avatar || 'images/logo.png'}" alt="${t.name}" class="testimonial-avatar" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='images/logo.png';">
                <div>
                  <div class="testimonial-name">${t.name}</div>
                  <div class="testimonial-role">${t.role || 'Orang Tua Wali'}</div>
                </div>
              </div>
            </div>
          `
        });
      } else if (testimonials.length > 0) {
        testimonialsContainer.innerHTML = testimonials.map(t => `
          <div class="testimonial-card">
            <p class="testimonial-quote">"${t.quote}"</p>
            <div class="testimonial-author">
              <img src="${t.avatar || 'images/logo.png'}" alt="${t.name}" class="testimonial-avatar" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='images/logo.png';">
              <div>
                <div class="testimonial-name">${t.name}</div>
                <div class="testimonial-role">${t.role || 'Orang Tua Wali'}</div>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // 6. Tentang (tentang.html)
  function renderAboutPage() {
    const profile = window.SchoolDB.getProfile();
    const contact = window.SchoolDB.getContact();

    const historyText = document.getElementById('history-text');
    if (historyText && profile.history) {
      historyText.innerHTML = `<p style="font-size: 1.05rem; line-height: 1.75; margin-bottom: 1.5rem; color: var(--text-muted);">${profile.history}</p>`;
    }

    const visionText = document.getElementById('vision-text');
    if (visionText) {
      visionText.textContent = profile.vision || '-';
    }

    // Dynamic Official School Identity Bindings
    const identitasNama = document.getElementById('identitas-nama');
    if (identitasNama && profile.name) identitasNama.textContent = profile.name;
    const identitasNpsn = document.getElementById('identitas-npsn');
    if (identitasNpsn && profile.npsn) identitasNpsn.textContent = profile.npsn;
    const identitasNss = document.getElementById('identitas-nss');
    if (identitasNss && profile.nss) identitasNss.textContent = profile.nss;
    const identitasAkreditasi = document.getElementById('identitas-akreditasi');
    if (identitasAkreditasi && profile.akreditasi) identitasAkreditasi.textContent = `${profile.akreditasi} (Unggul)`;
    const identitasSiswa = document.getElementById('identitas-siswa');
    if (identitasSiswa && profile.totalStudents) identitasSiswa.textContent = `${profile.totalStudents} Siswa`;
    const identitasGuru = document.getElementById('identitas-guru');
    if (identitasGuru) {
      const gCount = profile.totalTeachers || 8;
      const ksCount = profile.totalPrincipal || 1;
      const tCount = profile.totalStaff || 2;
      identitasGuru.textContent = `${gCount + ksCount + tCount} Orang (${gCount} Guru, ${ksCount} KS, ${tCount} Tendik)`;
    }
    const identitasKelas = document.getElementById('identitas-kelas');
    if (identitasKelas && profile.totalClasses) identitasKelas.textContent = `${profile.totalClasses} Ruang Kelas`;
    const identitasAlamat = document.getElementById('identitas-alamat');
    if (identitasAlamat && contact && contact.address) identitasAlamat.textContent = contact.address;

    const missionList = document.getElementById('mission-list');
    if (missionList && Array.isArray(profile.missions)) {
      missionList.innerHTML = profile.missions.map((m, index) => `
        <li class="mission-item">
          <span class="mission-number">${index + 1}</span>
          <span class="mission-text-item">${m}</span>
        </li>
      `).join('');
    }

    const valuesGrid = document.getElementById('values-grid');
    if (valuesGrid) {
      const habits = (window.SchoolDB.getHabits && window.SchoolDB.getHabits()) || profile.values || [];
      if (window.SchoolCarousel) {
        window.SchoolCarousel.renderAdaptive({
          containerId: valuesGrid,
          items: habits,
          threshold: 4,
          gridClass: 'values-grid',
          itemClass: 'value-slide',
          ariaLabel: 'Nilai dan Budaya Sekolah',
          renderItem: (h) => `
            <div class="value-card">
              <h4>${h.title}</h4>
              <p>${h.desc || h.description || ''}</p>
            </div>
          `
        });
      } else if (habits.length > 0) {
        valuesGrid.innerHTML = habits.map(h => `
          <div class="value-card">
            <h4>${h.title}</h4>
            <p>${h.desc || h.description || ''}</p>
          </div>
        `).join('');
      }
    }

    renderTeachersSection();
  }

  function renderTeachersSection() {
    const teachers = window.SchoolDB.getTeachers();
    const teachersGrid = document.getElementById('teachers-grid');

    if (teachersGrid) {
      if (teachers.length === 0) {
        teachersGrid.innerHTML = window.SchoolEmptyState
          ? window.SchoolEmptyState.createEmptyState({ title: 'Belum ada data guru', description: 'Belum ada data guru yang ditampilkan.' })
          : `<div style="grid-column: 1/-1; text-align:center; padding: 3rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--border);"><p style="font-size:1rem; color:var(--text-muted);">Belum ada data guru yang ditampilkan.</p></div>`;
        return;
      }
      teachersGrid.innerHTML = teachers.map(t => window.SchoolTeacherCard.createTeacherCard(t)).join('');
    }
  }

  // 7. Fasilitas (fasilitas.html)
  function renderFacilitiesPage() {
    const facilities = window.SchoolDB.getFacilities();
    const facilityGrid = document.getElementById('facility-grid');

    if (facilityGrid) {
      if (facilities.length === 0) {
        facilityGrid.innerHTML = window.SchoolEmptyState
          ? window.SchoolEmptyState.createEmptyState({ title: 'Belum ada fasilitas', description: 'Belum ada fasilitas yang dimasukkan.' })
          : `<div style="grid-column: 1/-1; text-align:center; padding: 4rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border);"><p style="font-size:1rem; color:var(--text-muted);">Belum ada fasilitas yang dimasukkan.</p></div>`;
      } else {
        facilityGrid.innerHTML = facilities.map(f => window.SchoolFacilityCard.createFacilityCard(f)).join('');
      }
    }

    // Dynamic Comfort Standards Grid
    const comfortGrid = document.getElementById('comfort-standards-grid');
    if (comfortGrid) {
      const standards = window.SchoolDB.getComfortStandards();
      if (standards && standards.length > 0) {
        comfortGrid.innerHTML = standards.map(s => `
          <div style="background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 24px;">
            <h4 style="font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">${s.title}</h4>
            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.55;">${s.desc || s.description || ''}</p>
          </div>
        `).join('');
      }
    }
  }

  // 8. Kegiatan (kegiatan.html)
  function renderActivitiesPage() {
    const activities = window.SchoolDB.getActivities();
    const gallery = window.SchoolDB.getGallery();
    const categories = window.SchoolDB.getCategories();

    const newsGrid = document.getElementById('news-grid');
    const searchInput = document.getElementById('news-search-input');
    const filterTagsWrap = document.querySelector('.filter-tags-list') || document.querySelector('.filter-tags-wrap');

    let currentCategory = 'Semua';
    let currentSearch = '';

    // Render Dynamic Category Filter Buttons
    if (filterTagsWrap) {
      const allCategories = ['Semua', ...categories];
      const isList = filterTagsWrap.tagName.toLowerCase() === 'ul';
      filterTagsWrap.innerHTML = allCategories.map((cat, idx) => {
        const btnHtml = `<button class="filter-tag-btn ${idx === 0 ? 'active' : ''}" data-category="${cat}">${cat === 'Semua' ? 'Semua Kategori' : cat}</button>`;
        return isList ? `<li>${btnHtml}</li>` : btnHtml;
      }).join('');

      filterTagsWrap.querySelectorAll('.filter-tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterTagsWrap.querySelectorAll('.filter-tag-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = btn.getAttribute('data-category');
          applyNewsFilter();
        });
      });
    }

    function applyNewsFilter() {
      if (!newsGrid) return;
      let filtered = activities;

      if (currentCategory !== 'Semua') {
        filtered = filtered.filter(a => {
          const actCategory = a.category || 'Umum';
          const matchCategory = actCategory.toLowerCase() === currentCategory.toLowerCase();
          const text = (a.title + ' ' + (a.excerpt || '') + ' ' + (a.content || '')).toLowerCase();
          return matchCategory || text.includes(currentCategory.toLowerCase());
        });
      }

      if (currentSearch.trim() !== '') {
        const q = currentSearch.toLowerCase().trim();
        filtered = filtered.filter(a => {
          const text = (a.title + ' ' + (a.excerpt || '') + ' ' + (a.content || '') + ' ' + (a.category || '')).toLowerCase();
          return text.includes(q);
        });
      }

      if (filtered.length === 0) {
        newsGrid.innerHTML = window.SchoolEmptyState
          ? window.SchoolEmptyState.createEmptyState({ title: 'Kegiatan tidak ditemukan', description: 'Tidak ada kegiatan yang sesuai dengan filter atau kata kunci pencarian.' })
          : `<div style="grid-column: 1/-1; text-align:center; padding: 4rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-card); border: 1px solid var(--border);"><p style="font-size:1rem; color:var(--text-muted);">Tidak ada kegiatan yang sesuai dengan filter pencarian.</p></div>`;
        return;
      }

      newsGrid.innerHTML = filtered.map(act => window.SchoolActivityCard.createActivityCard(act, { variant: 'list' })).join('');
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        applyNewsFilter();
      });
    }

    applyNewsFilter();

    // Render Tab Galeri
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
      if (gallery.length === 0) {
        galleryGrid.innerHTML = window.SchoolEmptyState
          ? window.SchoolEmptyState.createEmptyState({ title: 'Belum ada dokumentasi', description: 'Belum ada dokumentasi galeri yang ditampilkan.' })
          : `<div style="grid-column: 1/-1; text-align:center; padding: 4rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-card); border: 1px solid var(--border);"><p style="font-size:1rem; color:var(--text-muted);">Belum ada dokumentasi yang ditampilkan.</p></div>`;
      } else {
        galleryGrid.innerHTML = gallery.map(g => window.SchoolGalleryCard.createGalleryCard(g)).join('');
        galleryGrid.querySelectorAll('.gallery-card').forEach(card => {
          card.addEventListener('click', () => {
            const img = card.getAttribute('data-image');
            const caption = card.getAttribute('data-caption');
            openDialog(caption, `
              <img src="${img}" alt="${caption}" style="width:100%; border-radius: var(--radius-sm); margin-bottom: 0;">
              <p style="margin-top:1rem; font-weight:600; text-align:center; color:var(--text);">${caption}</p>
            `);
          });
        });
      }
    }

    // Render Full Academic Calendar Section
    // Render Academic Calendar Timeline (Delegated to modular SchoolCalendarTimeline component)
    const fullCalendarContainer = document.getElementById('calendar-vertical-list');
    if (fullCalendarContainer) {
      const allCalendarEvents = (window.SchoolDB ? window.SchoolDB.getCalendar() : []) || [];
      if (window.SchoolCalendarTimeline) {
        window.SchoolCalendarTimeline.renderTimeline({
          containerId: 'calendar-vertical-list',
          filterTabsId: 'calendar-filter-tabs',
          searchInputId: 'calendar-search-input',
          events: allCalendarEvents
        });
      }
    }

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPane = document.getElementById(tabId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || localStorage.getItem('active_tab');
    if (activeTab === 'gallery') {
      localStorage.removeItem('active_tab');
      const galleryTabBtn = document.querySelector('.tab-btn[data-tab="tab-gallery"]');
      if (galleryTabBtn) galleryTabBtn.click();
    } else {
      const firstTabBtn = document.querySelector('.tab-btn');
      if (firstTabBtn && !firstTabBtn.classList.contains('active')) firstTabBtn.click();
    }
  }

  // 9. Detail Kegiatan (detail-kegiatan.html)
  async function renderActivityDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const actId = params.get('id');

    const activities = window.SchoolDB.getActivities();
    let act = null;
    if (actId) {
      act = activities.find(n => String(n.id) === String(actId));
    }
    if (!act && !actId && activities.length > 0) {
      act = activities[0];
    }
    
    if (!act) {
      const articleContainer = document.querySelector('.article-container') || document.querySelector('.section') || document.body;
      if (articleContainer) {
        articleContainer.innerHTML = window.SchoolEmptyState
          ? window.SchoolEmptyState.createErrorState({
              title: 'Berita atau Kegiatan Tidak Ditemukan',
              description: 'Artikel kegiatan yang Anda cari mungkin telah dihapus atau tautan tidak valid.',
              retryCallback: "window.location.href='kegiatan.html'",
              retryLabel: 'Kembali ke Daftar Kegiatan'
            })
          : '<div style="text-align:center; padding:4rem;"><p>Kegiatan tidak ditemukan.</p><a href="kegiatan.html">Kembali</a></div>';
      }
      return;
    }

    // Increment view count
    if (act.id) {
      const newViews = await window.SchoolDB.incrementActivityViews(act.id);
      act.views = newViews;
    }

    const titleEl = document.getElementById('article-title');
    const catDateEl = document.getElementById('article-category-date');
    const imgEl = document.getElementById('article-img');
    const bodyEl = document.getElementById('article-body');

    if (titleEl) titleEl.textContent = act.title;
    if (catDateEl) {
      const formattedDate = act.date ? new Date(act.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : 'TERBARU';
      const category = (act.category || 'KEGIATAN').toUpperCase();
      const viewsText = typeof act.views === 'number' ? ` • ${act.views} pembaca` : '';
      catDateEl.innerHTML = `<span style="color:var(--primary); font-weight:700;">${category}</span> • ${formattedDate}${viewsText}`;
    }
    if (imgEl && act.image) {
      imgEl.src = act.image;
      imgEl.alt = act.title;
      imgEl.onload = () => imgEl.classList.add('img-loaded');
      imgEl.onerror = () => {
        imgEl.src = 'images/logo.webp';
        imgEl.classList.add('img-loaded');
      };
      if (imgEl.complete) imgEl.classList.add('img-loaded');
    }
    if (bodyEl && act.content) {
      const paragraphs = act.content.split('\n\n');
      bodyEl.innerHTML = paragraphs.map(p => `<p style="margin-bottom: 1.5rem;">${p}</p>`).join('');
    }
  }

  // 10. Kontak (kontak.html)
  function renderContactPage() {
    const contact = window.SchoolDB.getContact();
    const profile = window.SchoolDB.getProfile();

    const addrEl = document.getElementById('contact-address-val');
    const phoneEl = document.getElementById('contact-phone-val');
    const emailEl = document.getElementById('contact-email-val');
    const mapFrame = document.getElementById('contact-map-frame');

    if (addrEl && contact.address) addrEl.textContent = contact.address;
    if (phoneEl && contact.phone) phoneEl.textContent = contact.phone;
    if (emailEl && contact.email) {
      emailEl.textContent = contact.email;
      const emailLink = document.getElementById('contact-email-link');
      if (emailLink) emailLink.href = `mailto:${contact.email}`;
    }
    if (mapFrame && contact.maps) mapFrame.src = contact.maps;
    const mapBtn = document.getElementById('contact-maps-btn');
    if (mapBtn) {
      mapBtn.href = contact.mapsUrl || 'https://maps.app.goo.gl/y3Gzega74NqFi9N58';
    }

    // Dynamic Social Media Links
    const igVal = document.getElementById('contact-instagram-val');
    const igLink = document.getElementById('contact-instagram-link');
    if (igVal && contact.instagram) {
      igVal.textContent = contact.instagram.startsWith('@') ? contact.instagram : '@' + contact.instagram;
      if (igLink) {
        const cleanIg = contact.instagram.replace(/^@/, '');
        igLink.href = contact.instagramUrl || `https://www.instagram.com/${cleanIg}`;
      }
    }

    const fbVal = document.getElementById('contact-facebook-val');
    const fbLink = document.getElementById('contact-facebook-link');
    if (fbVal && contact.facebook) {
      fbVal.textContent = contact.facebook;
      if (fbLink) {
        fbLink.href = contact.facebookUrl || `https://www.facebook.com/search/top?q=${encodeURIComponent(contact.facebook)}`;
      }
    }

    const ytVal = document.getElementById('contact-youtube-val');
    const ytLink = document.getElementById('contact-youtube-link');
    if (ytVal && contact.youtube) {
      ytVal.textContent = contact.youtube;
      if (ytLink) {
        const cleanYt = contact.youtube.startsWith('@') ? contact.youtube : '@' + contact.youtube;
        ytLink.href = contact.youtubeUrl || `https://www.youtube.com/${cleanYt}`;
      }
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name')?.value?.trim() || '';
        const email = document.getElementById('form-email')?.value?.trim() || '';
        const phone = document.getElementById('form-subject')?.value?.trim() || '';
        const message = document.getElementById('form-message')?.value?.trim() || '';

        if (name && email && phone && message) {
          const submitBtn = contactForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Mengirim Pesan...';
          }
          try {
            await window.SchoolDB.addInquiry({
              name,
              email,
              phone,
              subject: 'Layanan Konsultasi Publik',
              message
            });
            showToast('Pesan konsultasi Anda berhasil dikirim ke Admin Sekolah! Terima kasih.', 'success');
            contactForm.reset();
          } catch (err) {
            showToast('Gagal mengirim pesan: ' + err.message, 'error');
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = `<span>Kirim Pesan Sekarang</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
            }
          }
        } else {
          showToast('Mohon lengkapi semua kolom bertanda bintang (*).', 'error');
        }
      });
    }
  }

  // 11. GSAP & Micro-Interactions
  function initGSAPAnimations() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const heroBg = document.querySelector('.hero-bg-img');
      if (heroBg) {
        gsap.to(heroBg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom top', scrub: true }
        });
      }

      gsap.utils.toArray('.section-headline, .section-label, .section-supporting').forEach(el => {
        gsap.fromTo(el, { y: 25, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
      });

      const cardGrids = document.querySelectorAll('.info-cards-grid, .pillars-grid, .services-cards-grid, .facilities-grid, #teachers-grid, #gallery-grid, #news-grid, #values-grid');
      cardGrids.forEach(grid => {
        const cards = grid.children;
        if (cards.length > 0) {
          gsap.fromTo(cards, { y: 35, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' }
          });
        }
      });

      document.querySelectorAll('.stat-number, .fact-number, .counter-anim').forEach(counter => {
        const targetText = counter.textContent.trim();
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(targetNumber) && targetNumber > 0) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetNumber, duration: 1.8, ease: 'power2.out',
            scrollTrigger: { trigger: counter, start: 'top 90%', toggleActions: 'play none none none' },
            onUpdate: () => { counter.textContent = Math.floor(obj.val) + (targetText.includes('+') ? '+' : ''); }
          });
        }
      });
    }

    const interactiveCards = document.querySelectorAll('.editorial-card-wrapper, .facility-card, .news-card, .btn-ghibli-solid, .btn-ghibli-glass');
    interactiveCards.forEach(card => {
      card.addEventListener('mouseenter', () => gsap.to(card, { y: -4, duration: 0.25, ease: 'power2.out' }));
      card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, duration: 0.35, ease: 'power2.out' }));
    });
  }

  // 12. Floating WhatsApp Widget & Header Scroll
  function renderWhatsAppFloatingButton() {
    if (document.getElementById('whatsapp-floating-btn')) return;
    const contact = window.SchoolDB.getContact();
    const phone = contact && contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '6281234567890';
    const waBtn = document.createElement('a');
    waBtn.id = 'whatsapp-floating-btn';
    waBtn.className = 'whatsapp-floating-btn';
    waBtn.href = `https://wa.me/${phone}?text=Halo%20SDN%202%20Ngeposari,%20saya%20ingin%20bertanya%20mengenai%20informasi%20sekolah.`;
    waBtn.target = '_blank';
    waBtn.setAttribute('aria-label', 'Chat WhatsApp');
    waBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
      <span>Chat WA</span>
    `;
    document.body.appendChild(waBtn);
  }

  function initHeaderScrollBehavior() {
    const mainHeader = document.getElementById('main-header');
    const heroSec = document.getElementById('hero-section');
    if (!mainHeader) return;

    if (!document.body.classList.contains('hero-page') || !heroSec) {
      mainHeader.classList.add('scrolled');
      return;
    }

    const updateNavbarState = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;
      if (scrollPos > 50) {
        if (!mainHeader.classList.contains('scrolled')) mainHeader.classList.add('scrolled');
      } else {
        if (mainHeader.classList.contains('scrolled')) mainHeader.classList.remove('scrolled');
      }
    };

    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
    window.addEventListener('resize', updateNavbarState, { passive: true });
  }

  function revealLoadedImages() {
    document.querySelectorAll('img').forEach(img => {
      if (img.complete) {
        img.classList.add('img-loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
        img.addEventListener('error', () => img.classList.add('img-loaded'), { once: true });
      }
    });
  }

  // 13. Page Initialization & Bootstrapping
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      if (window.SchoolDB) {
        await window.SchoolDB.init();
      }
    } catch (e) {
      console.warn('SchoolDB init warning:', e);
    }

    await renderCommonUI();

    if (document.getElementById('hero-section')) renderHomePage();
    if (document.getElementById('history-sec')) renderAboutPage();
    if (document.getElementById('facility-grid')) renderFacilitiesPage();
    if (document.getElementById('activities-page-sec')) renderActivitiesPage();
    if (document.getElementById('detail-kegiatan-sec')) renderActivityDetailPage();
    if (document.getElementById('contact-info-sec')) renderContactPage();

    revealLoadedImages();
    initHeaderScrollBehavior();
    initGSAPAnimations();
    renderWhatsAppFloatingButton();
  });

  // Listen to Cloud Sync / Backup Import updates
  window.addEventListener('schooldb-synced', async () => {
    console.info('[SchoolDB] Real-time synced event received. Refreshing page components...');
    await renderCommonUI();
    if (document.getElementById('teachers-grid')) renderAboutPage();
    if (document.getElementById('facility-grid')) renderFacilitiesPage();
    if (document.getElementById('activities-page-sec')) renderActivitiesPage();
    if (document.getElementById('news-editorial-grid')) renderHomePage();
    if (document.getElementById('article-title')) renderActivityDetailPage();
  });

  // Export showToast and openDialog for global scope compatibility
  window.showToast = showToast;
  window.openDialog = openDialog;
})();
