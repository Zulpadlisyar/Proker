// DESIGN.md Compliance - Client-Side Rendering & Core Logic for SDN 2 Ngeposari Website
// Integrates with SchoolDB in js/db.js to render site elements dynamically.

// Vercel Speed Insights Integration
(function initSpeedInsights() {
  if (typeof window !== 'undefined') {
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    if (!document.querySelector('script[src*="/_vercel/speed-insights/script.js"]')) {
      const script = document.createElement('script');
      script.src = '/_vercel/speed-insights/script.js';
      script.defer = true;
      document.head.appendChild(script);
    }
  }
})();

// Alert/Toast Utility
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  
  document.getElementById('toast-container').appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 220ms forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

// Common UI Elements (Header, Footer, Dialog container)
async function renderCommonUI() {
  let profile = { name: 'SDN 2 Ngeposari', logo: 'images/logo.png', tagline: 'Semanu, Gunungkidul' };
  let contact = { address: 'Ngeposari, Semanu, Gunungkidul', phone: '(0274) 123456', email: 'info@sdn2ngeposari.sch.id' };
  
  try {
    if (window.SchoolDB) {
      const p = window.SchoolDB.getProfile();
      const c = window.SchoolDB.getContact();
      if (p) profile = p;
      if (c) contact = c;
    }
  } catch (e) {
    console.warn('SchoolDB fallback used:', e);
  }
  
  // 1. Render Header (Navbar: Height 76px, solid background, border-bottom, exactly 5 links)
  const headerContainer = document.getElementById('main-header');
  if (headerContainer) {
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    
    headerContainer.innerHTML = `
      <div class="header-container">
        <a href="index.html" class="logo-link">
          <img src="${profile.logo}" alt="Logo ${profile.name}" class="logo-img">
          <div class="logo-text">
            <span class="logo-title">${profile.name}</span>
            <p>${profile.tagline}</p>
          </div>
        </a>
        
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <nav>
            <ul class="nav-menu" id="nav-menu">
              <li><a href="index.html" class="nav-link ${pageName === 'index.html' ? 'active' : ''}">Beranda</a></li>
              <li><a href="tentang.html" class="nav-link ${pageName === 'tentang.html' ? 'active' : ''}">Tentang</a></li>
              <li><a href="fasilitas.html" class="nav-link ${pageName === 'fasilitas.html' ? 'active' : ''}">Fasilitas</a></li>
              <li><a href="kegiatan.html" class="nav-link ${pageName === 'kegiatan.html' ? 'active' : ''}">Kegiatan</a></li>
              <li><a href="kontak.html" class="nav-link ${pageName === 'kontak.html' ? 'active' : ''}">Kontak</a></li>
            </ul>
          </nav>

          <button class="menu-toggle" id="menu-toggle" aria-label="Toggle Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    // Add mobile toggle behavior
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
      
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('open');
        }
      });
    }
  }

  // 2. Render Footer (Sincere, Simple, links including CMS portal link)
  const footerContainer = document.getElementById('main-footer');
  if (footerContainer) {
    footerContainer.innerHTML = `
      <div class="footer-container">
        <div class="footer-brand">
          <h3>${profile.name}</h3>
          <p>${profile.description}</p>
          <p style="color: var(--accent); font-weight: 700;">${profile.tagline}</p>
        </div>
        <div class="footer-links">
          <h4>Navigasi</h4>
          <ul>
            <li><a href="index.html">Beranda</a></li>
            <li><a href="tentang.html">Tentang Sekolah</a></li>
            <li><a href="fasilitas.html">Fasilitas</a></li>
            <li><a href="kegiatan.html">Kegiatan & Berita</a></li>
            <li><a href="kontak.html">Kontak & Lokasi</a></li>
            <li><a href="admin.html" style="font-weight:700;">Portal CMS Admin</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Hubungi Kami</h4>
          <div class="footer-contact-list">
            <div class="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${contact.address}</span>
            </div>
            <div class="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>${contact.phone}</span>
            </div>
            <div class="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>${contact.email}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${profile.name}. KKN 73 Reguler Unit 113. All Rights Reserved.</p>
        <p>Developed by Zulpadli Syarif Harahap (Informatika)</p>
      </div>
    `;
  }

  // 3. Create dialog markup in body
  if (!document.getElementById('dialog-overlay')) {
    const dialog = document.createElement('div');
    dialog.id = 'dialog-overlay';
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
      <div class="dialog-box" id="dialog-box">
        <div class="dialog-header">
          <h4 id="dialog-title-text" style="font-size:1.15rem; font-family: var(--font-heading);">Detail Kegiatan</h4>
          <button class="dialog-close" id="dialog-close-btn" aria-label="Close dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="dialog-body" id="dialog-body-content"></div>
      </div>
    `;
    document.body.appendChild(dialog);
    
    const closeBtn = document.getElementById('dialog-close-btn');
    const overlay = document.getElementById('dialog-overlay');
    
    const closeDialog = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDialog();
    });
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeDialog();
      }
    });
  }
}

// Dialog opener
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

// ----------------------------------------------------
// PAGE SPECIFIC RENDERING
// ----------------------------------------------------

// 1. Beranda (index.html)
function renderHomePage() {
  const profile = window.SchoolDB.getProfile();
  const activities = window.SchoolDB.getActivities();
  const contact = window.SchoolDB.getContact();
  
  // Dynamic Headline in Ghibli Hero Section
  const ghibliHeadline = document.querySelector('.ghibli-hero-headline');
  if (ghibliHeadline && profile.name) {
    ghibliHeadline.innerHTML = `${profile.name}<br><em>Tempat Belajar</em> &amp; Tumbuh Penuh Inspirasi`;
  }
  const ghibliSubtitle = document.querySelector('.ghibli-hero-subtitle');
  if (ghibliSubtitle && profile.description) {
    ghibliSubtitle.textContent = profile.description;
  }

  // Only render split hero if not using full-screen hero markup
  const heroSection = document.getElementById('hero-section');
  if (heroSection && !heroSection.classList.contains('hero-fullscreen-section')) {
    const latestAct = activities[0] || { title: 'Pekan Kreativitas Siswa', date: new Date().toISOString() };
    
    heroSection.innerHTML = `
      <div class="hero-container">
        <div class="hero-image-container">
          <img src="${profile.hero || 'images/teachers/guru1.jpg'}" alt="Foto lingkungan ${profile.name}" class="hero-image">
          
          <!-- Overlapping Side Feature Panel §15 -->
          <div class="hero-side-panel">
            <div class="hero-side-date">${new Date(latestAct.date).toLocaleDateString('id-ID', {month: 'long', year: 'numeric'}).toUpperCase()}</div>
            <h4>${latestAct.title}</h4>
            <a href="kegiatan.html" class="hero-side-link">Lihat kegiatan →</a>
          </div>
        </div>

        <div>
          <span class="hero-eyebrow">TENTANG SEKOLAH KAMI</span>
          <h1 class="hero-headline">${profile.name}<br>Tempat belajar,<br>dan bertumbuh.</h1>
          <p class="hero-subtitle">${profile.description}</p>
          <div class="hero-buttons">
            <a href="tentang.html" class="btn btn-primary">Tentang Sekolah</a>
            <a href="kontak.html" class="btn btn-secondary">Kontak</a>
          </div>
        </div>
      </div>
    `;
  }

  // Latest News & Activities Layout (Editorial Grid)
  const newsContainer = document.getElementById('news-editorial-grid') || document.getElementById('news-grid-container');
  if (newsContainer) {
    if (activities.length === 0) {
      newsContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">Belum ada kegiatan yang ditampilkan.</div>`;
    } else {
      const latestActivities = activities.slice(0, 3);
      newsContainer.innerHTML = latestActivities.map(a => `
        <article class="news-card-item">
          <div class="news-img-wrap">
            <img src="${a.image}" alt="${a.title}" width="960" height="540" loading="lazy" decoding="async">
            <span class="news-badge-tag">${a.category || 'Kegiatan'}</span>
          </div>
          <div class="news-body-content">
            <div class="news-meta-row">${new Date(a.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
            <h3 class="news-title">${a.title}</h3>
            <p class="news-snippet-text">${a.excerpt || (a.content ? a.content.substring(0, 110) + '...' : '')}</p>
            <a href="detail-kegiatan.html?id=${a.id}" class="news-read-more">Baca selengkapnya &rarr;</a>
          </div>
        </article>
      `).join('');
    }
  }

  // Render Academic Calendar Widget
  const calendarWidget = document.getElementById('academic-calendar-widget');
  if (calendarWidget) {
    const calendarEvents = window.SchoolDB.getCalendar();
    calendarWidget.innerHTML = `
      <div class="calendar-widget-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <h3 style="font-size: 18px; font-weight: 700; color: var(--primary);">Agenda & Kalender Akademik Mendatang</h3>
          <a href="kegiatan.html" class="btn-text-link" style="font-size:12px;">Lihat kegiatan →</a>
        </div>
        ${calendarEvents.map(ev => `
          <div class="calendar-item-row">
            <div class="calendar-date-badge">
              <div class="day">${ev.day}</div>
              <div class="month">${ev.month}</div>
            </div>
            <div class="calendar-info">
              <span>${ev.category}</span>
              <h4>${ev.title}</h4>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Contact CTA Details on Homepage
  const ctaBox = document.getElementById('contact-cta-box');
  if (ctaBox && contact) {
    const addrEl = ctaBox.querySelector('.contact-detail-row:nth-child(1) span');
    const phoneEl = ctaBox.querySelector('.contact-detail-row:nth-child(2) span');
    const emailEl = ctaBox.querySelector('.contact-detail-row:nth-child(3) span');
    if (addrEl && contact.address) addrEl.innerHTML = `<strong>Alamat:</strong> ${contact.address}`;
    if (phoneEl && contact.phone) phoneEl.innerHTML = `<strong>Telepon:</strong> ${contact.phone}`;
    if (emailEl && contact.email) emailEl.innerHTML = `<strong>Email:</strong> ${contact.email}`;
  }
}

// 2. Tentang (tentang.html)
function renderAboutPage() {
  const profile = window.SchoolDB.getProfile();
  
  // A. Sejarah
  const historyText = document.getElementById('history-text');
  if (historyText) {
    historyText.innerHTML = `
      <p style="font-size: 1.05rem; line-height: 1.75; margin-bottom: 1.5rem; color: var(--text-muted);">${profile.history}</p>
    `;
  }
  
  // B. Visi & Misi
  const visionText = document.getElementById('vision-text');
  if (visionText) {
    visionText.textContent = profile.vision;
  }
  
  const missionList = document.getElementById('mission-list');
  if (missionList) {
    missionList.innerHTML = profile.missions.map((m, index) => `
      <li class="mission-item">
        <span class="mission-number">${index + 1}</span>
        <span class="mission-text-item">${m}</span>
      </li>
    `).join('');
  }
  
  // C. Nilai-Nilai Sekolah
  const valuesGrid = document.getElementById('values-grid');
  if (valuesGrid) {
    valuesGrid.innerHTML = profile.values.map(v => `
      <div class="value-card">
        <h4>${v.title}</h4>
        <p>${v.desc}</p>
      </div>
    `).join('');
  }
  
  renderTeachersSection();
}

// Render Teachers & Staff Section (Sereth Editorial Cards)
function renderTeachersSection() {
  const teachers = window.SchoolDB.getTeachers();
  const teachersGrid = document.getElementById('teachers-grid');
  
  if (teachersGrid) {
    if (teachers.length === 0) {
      teachersGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 3rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--border);">
          <p style="font-size:1rem; color:var(--text-muted);">Belum ada data guru yang ditampilkan.</p>
        </div>
      `;
      return;
    }
    
    teachersGrid.innerHTML = teachers.map(t => `
      <div class="editorial-card-wrapper">
        <div class="editorial-card-img-container">
          <img src="${t.image}" alt="${t.name}" class="editorial-card-img" loading="lazy" decoding="async">
        </div>
        <div class="editorial-card-body">
          <h3>${t.name}</h3>
          <p>${t.role}</p>
        </div>
      </div>
    `).join('');
  }
}

// 3. Fasilitas (fasilitas.html)
function renderFacilitiesPage() {
  const facilities = window.SchoolDB.getFacilities();
  const facilityGrid = document.getElementById('facility-grid');
  
  if (facilityGrid) {
    if (facilities.length === 0) {
      facilityGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 4rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border);">
          <p style="font-size:1rem; color:var(--text-muted);">Belum ada fasilitas yang dimasukkan.</p>
        </div>
      `;
      return;
    }
    
    facilityGrid.innerHTML = facilities.map(f => `
      <div class="facility-card">
        <div class="facility-img-wrapper">
          <img src="${f.image}" alt="${f.name}" class="facility-img" loading="lazy" decoding="async">
        </div>
        <div class="facility-info">
          <h3>${f.name}</h3>
          <p>${f.description}</p>
        </div>
      </div>
    `).join('');
  }
}

// 4. Kegiatan & Berita (kegiatan.html)
function renderActivitiesPage() {
  const activities = window.SchoolDB.getActivities();
  const gallery = window.SchoolDB.getGallery();
  
  const newsGrid = document.getElementById('news-grid');
  const searchInput = document.getElementById('news-search-input');
  const filterTagBtns = document.querySelectorAll('.filter-tag-btn');
  
  let currentCategory = 'Semua';
  let currentSearch = '';

  function applyNewsFilter() {
    if (!newsGrid) return;
    
    let filtered = activities;
    
    if (currentCategory !== 'Semua') {
      filtered = filtered.filter(a => {
        const text = (a.title + ' ' + (a.excerpt || '') + ' ' + (a.content || '')).toLowerCase();
        return text.includes(currentCategory.toLowerCase());
      });
    }
    
    if (currentSearch.trim() !== '') {
      const q = currentSearch.toLowerCase().trim();
      filtered = filtered.filter(a => {
        const text = (a.title + ' ' + (a.excerpt || '') + ' ' + (a.content || '')).toLowerCase();
        return text.includes(q);
      });
    }

    if (filtered.length === 0) {
      newsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 4rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-card); border: 1px solid var(--border);">
          <p style="font-size:1rem; color:var(--text-muted);">Tidak ada kegiatan yang sesuai dengan filter pencarian.</p>
        </div>
      `;
      return;
    }

    newsGrid.innerHTML = filtered.map(act => `
      <div class="news-card">
        <div class="news-img-wrapper">
          <img src="${act.image}" alt="${act.title}" class="news-img" loading="lazy" decoding="async">
        </div>
        <div class="news-info">
          <span class="news-date">${act.date ? new Date(act.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).toUpperCase() : '15 AGUSTUS 2026'}</span>
          <h3 class="news-title">${act.title}</h3>
          <p class="news-excerpt">${act.excerpt || ''}</p>
          <a href="detail-kegiatan.html?id=${act.id}" class="btn-tertiary">Baca selengkapnya →</a>
        </div>
      </div>
    `).join('');
  }

  // Attach search & category listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      applyNewsFilter();
    });
  }

  if (filterTagBtns.length > 0) {
    filterTagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTagBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        applyNewsFilter();
      });
    });
  }

  applyNewsFilter();

  // Render Tab Galeri
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    if (gallery.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 4rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-card); border: 1px solid var(--border);">
          <p style="font-size:1rem; color:var(--text-muted);">Belum ada dokumentasi yang ditampilkan.</p>
        </div>
      `;
    } else {
      galleryGrid.innerHTML = gallery.map(g => `
        <div class="gallery-card" data-caption="${g.caption}" data-image="${g.image}">
          <img src="${g.image}" alt="${g.caption}" class="gallery-img" loading="lazy" decoding="async">
          <div class="gallery-overlay">
            <div class="gallery-caption">${g.caption}</div>
          </div>
        </div>
      `).join('');
      
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

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // URL tab query params parse
  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get('tab') || localStorage.getItem('active_tab');
  if (activeTab === 'gallery') {
    localStorage.removeItem('active_tab');
    const galleryTabBtn = document.querySelector('.tab-btn[data-tab="tab-gallery"]');
    if (galleryTabBtn) {
      galleryTabBtn.click();
    }
  } else {
    const firstTabBtn = document.querySelector('.tab-btn');
    if (firstTabBtn && !firstTabBtn.classList.contains('active')) {
      firstTabBtn.click();
    }
  }
}

// 5. Kontak (kontak.html)
function renderContactPage() {
  const contact = window.SchoolDB.getContact();
  const profile = window.SchoolDB.getProfile();
  
  const addrEl = document.getElementById('contact-address-val');
  const phoneEl = document.getElementById('contact-phone-val');
  const emailEl = document.getElementById('contact-email-val');
  const mapFrame = document.getElementById('contact-map-frame');

  if (addrEl && contact.address) addrEl.textContent = contact.address;
  if (phoneEl && contact.phone) phoneEl.textContent = contact.phone;
  if (emailEl && contact.email) emailEl.textContent = contact.email;
  if (mapFrame && contact.maps) mapFrame.src = contact.maps;
  
  const mapContainer = document.getElementById('map-container');
  if (mapContainer && contact.maps) {
    mapContainer.innerHTML = `
      <iframe 
        src="${contact.maps}" 
        width="100%" 
        height="100%" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        title="Peta Lokasi ${profile.name}">
      </iframe>
    `;
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;
      
      if (name && email && subject && message) {
        showToast('Pesan berhasil terkirim! Terima kasih.', 'success');
        contactForm.reset();
      } else {
        showToast('Mohon lengkapi semua kolom formulir.', 'error');
      }
    });
  }
}

// ----------------------------------------------------
// GSAP & MICRO-INTERACTIONS ENGINE
// ----------------------------------------------------
function initGSAPAnimations() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (typeof gsap === 'undefined') {
    initScrollRevealFallback();
    return;
  }

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

    // Hero Background Parallax Scroll Effect
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroBg && typeof ScrollTrigger !== 'undefined') {
      gsap.to(heroBg, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  // 2. Scroll-Triggered Stagger Animations for Cards & Sections
  if (typeof ScrollTrigger !== 'undefined') {
    // Section Headlines Fade-In-Up
    gsap.utils.toArray('.section-headline, .section-label, .section-supporting').forEach(el => {
      gsap.fromTo(el, 
        { y: 25, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Information & Pillar Cards Stagger
    const cardGrids = document.querySelectorAll('.info-cards-grid, .pillars-grid, .services-cards-grid, .facilities-grid, #teachers-grid, #gallery-grid, #news-grid, #values-grid');
    cardGrids.forEach(grid => {
      const cards = grid.children;
      if (cards.length > 0) {
        gsap.fromTo(cards, 
          { y: 35, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.75, 
            stagger: 0.12, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // 3. Dynamic Number Counters for Stats Section
    document.querySelectorAll('.stat-number, .fact-number, .counter-anim').forEach(counter => {
      const targetText = counter.textContent.trim();
      const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
      
      if (!isNaN(targetNumber) && targetNumber > 0) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetNumber,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          onUpdate: () => {
            counter.textContent = Math.floor(obj.val) + (targetText.includes('+') ? '+' : '');
          }
        });
      }
    });

    // 4. Smooth Parallax on Highlight Banners & CTA Boxes
    const bannerBox = document.querySelector('.banner-highlight-section, .contact-cta-box');
    if (bannerBox) {
      gsap.fromTo(bannerBox, 
        { y: 30, opacity: 0.9 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.9, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bannerBox,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // 5. Interactive Magnetic & Elevation Hover on Cards & Buttons
  const interactiveCards = document.querySelectorAll('.editorial-card-wrapper, .facility-card, .news-card, .btn-ghibli-solid, .btn-ghibli-glass');
  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -4, duration: 0.25, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.35, ease: 'power2.out' });
    });
  });


// Fallback if GSAP is not loaded
function initScrollRevealFallback() {
  const elements = document.querySelectorAll('.section-header, .fact-card, .facility-card, .news-card, .teacher-card, .gallery-card, .vision-card, .mission-card, .value-card');
  
  elements.forEach((el, index) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      const delayClass = `reveal-delay-${(index % 4) + 1}`;
      el.classList.add(delayClass);
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal-active'));
  }
}

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

// ----------------------------------------------------
// BOOTSTRAPPING
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.SchoolDB.init();
  } catch (e) {
    console.warn('SchoolDB init warning:', e);
  }
  
  await renderCommonUI();
  
  // Element-based page detection guarantees rendering on all path formats
  if (document.getElementById('hero-section')) {
    renderHomePage();
  }
  if (document.getElementById('history-sec')) {
    renderAboutPage();
  }
  if (document.getElementById('facility-grid')) {
    renderFacilitiesPage();
  }
  if (document.getElementById('activities-page-sec')) {
    renderActivitiesPage();
  }
  if (document.getElementById('detail-kegiatan-sec')) {
    renderActivityDetailPage();
  }
  if (document.getElementById('contact-info-sec')) {
    renderContactPage();
  }
  
  // Initialize Micro-Interactions & Floating Widgets
  initHeaderScrollBehavior();
  setTimeout(() => {
    initGSAPAnimations();
    renderWhatsAppFloatingButton();
  }, 100);
});

// Robust navbar scroll controller: Transparent ONLY on top of hero, Solid White everywhere else
function initHeaderScrollBehavior() {
  const mainHeader = document.getElementById('main-header');
  const heroSec = document.getElementById('hero-section');
  
  if (!mainHeader) return;
  
  // If not on hero-page (i.e. other subpages), ensure it's always solid white
  if (!document.body.classList.contains('hero-page') || !heroSec) {
    mainHeader.classList.add('scrolled');
    return;
  }

  const updateNavbarState = () => {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;
    
    // Transparent ONLY when user is at the very top of hero (scrollPos <= 50)
    // As soon as user scrolls down onto other sections (scrollPos > 50), navbar turns solid white
    if (scrollPos > 50) {
      if (!mainHeader.classList.contains('scrolled')) {
        mainHeader.classList.add('scrolled');
      }
    } else {
      if (mainHeader.classList.contains('scrolled')) {
        mainHeader.classList.remove('scrolled');
      }
    }
  };

  // Immediate invocation
  updateNavbarState();

  // Scroll listeners across all browser engines
  window.addEventListener('scroll', updateNavbarState, { passive: true });
  document.addEventListener('scroll', updateNavbarState, { passive: true });
  window.addEventListener('resize', updateNavbarState, { passive: true });
  window.addEventListener('touchmove', updateNavbarState, { passive: true });
  
  // RequestAnimationFrame tick for smooth scrolling
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbarState();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Render Activity Detail Page (detail-kegiatan.html)
function renderActivityDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const actId = params.get('id');
  
  const activities = window.SchoolDB.getActivities();
  let act = null;
  if (actId) {
    act = activities.find(n => n.id === actId);
  }
  if (!act && activities.length > 0) {
    act = activities[0];
  }
  
  if (!act) return;
  
  const titleEl = document.getElementById('article-title');
  const catDateEl = document.getElementById('article-category-date');
  const imgEl = document.getElementById('article-img');
  const bodyEl = document.getElementById('article-body');
  
  if (titleEl) titleEl.textContent = act.title;
  if (catDateEl) {
    const formattedDate = act.date ? new Date(act.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).toUpperCase() : 'TERBARU';
    catDateEl.textContent = `KEGIATAN SEKOLAH • ${formattedDate}`;
  }
  if (imgEl && act.image) {
    imgEl.src = act.image;
    imgEl.alt = act.title;
  }
  
  if (bodyEl && act.content) {
    const paragraphs = act.content.split('\n\n');
    bodyEl.innerHTML = paragraphs.map(p => `<p style="margin-bottom: 1.5rem;">${p}</p>`).join('');
  }
}
