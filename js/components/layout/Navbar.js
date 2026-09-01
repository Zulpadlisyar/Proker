/**
 * SDN 2 Ngeposari - Reusable Navbar Component & Mobile Drawer
 * Single source of truth for public navigation links, active states, and mobile menu interaction.
 */

(function (root) {
  'use strict';

  function renderNavbar(containerId = 'main-header', profile = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const schoolProfile = profile || (root.SchoolDB ? root.SchoolDB.getProfile() : { name: 'SDN Ngeposari 2', tagline: 'Semanu, Gunungkidul', logo: 'images/logo.webp' });
    const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    const isBeranda = currentPath === '/' || currentPath === '' || lastSegment === 'index.html' || lastSegment === 'index' || lastSegment === '';
    const isTentang = lastSegment === 'tentang.html' || lastSegment === 'tentang' || currentPath.includes('tentang');
    const isFasilitas = lastSegment === 'fasilitas.html' || lastSegment === 'fasilitas' || currentPath.includes('fasilitas');
    const isKegiatan = lastSegment === 'kegiatan.html' || lastSegment === 'kegiatan' || lastSegment === 'detail-kegiatan.html' || lastSegment === 'detail-kegiatan' || currentPath.includes('kegiatan');
    const isKontak = lastSegment === 'kontak.html' || lastSegment === 'kontak' || currentPath.includes('kontak');

    const logoSrc = schoolProfile.logo || 'images/logo.webp';

    container.innerHTML = `
      <div class="header-container">
        <a href="index.html" class="logo-link">
          <img src="${logoSrc}" alt="Logo ${schoolProfile.name}" class="logo-img" width="40" height="46" onerror="this.onerror=null;this.src='images/logo.png';">
          <div class="logo-text">
            <span class="logo-title">${schoolProfile.name}</span>
            <p>${schoolProfile.tagline}</p>
          </div>
        </a>
        
        <div style="display: flex; align-items: center; gap: var(--space-4);">
          <nav>
            <ul class="nav-menu" id="nav-menu">
              <li><a href="index.html" class="nav-link ${isBeranda ? 'active' : ''}">Beranda</a></li>
              <li><a href="tentang.html" class="nav-link ${isTentang ? 'active' : ''}">Tentang</a></li>
              <li><a href="fasilitas.html" class="nav-link ${isFasilitas ? 'active' : ''}">Fasilitas</a></li>
              <li><a href="kegiatan.html" class="nav-link ${isKegiatan ? 'active' : ''}">Kegiatan</a></li>
              <li><a href="kontak.html" class="nav-link ${isKontak ? 'active' : ''}">Kontak</a></li>
            </ul>
          </nav>

          <a href="kontak.html" class="header-cta-btn header-cta-desktop" style="display: inline-flex;">Hubungi Kami</a>

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

    // Mobile drawer toggle listeners
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
      menuToggle.setAttribute('aria-expanded', 'false');
      
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu when clicking any nav-link on mobile
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
          if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
  }

  const SchoolNavbar = {
    renderNavbar
  };

  root.SchoolNavbar = SchoolNavbar;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolNavbar;
  }
})(typeof window !== 'undefined' ? window : global);
