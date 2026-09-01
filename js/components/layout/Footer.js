/**
 * SDN 2 Ngeposari - Reusable Footer Component
 * Single source of truth for public footer, school branding, contact items, and CMS portal navigation.
 */

(function (root) {
  'use strict';

  function renderFooter(containerId = 'main-footer', profile = null, contact = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const schoolProfile = profile || (root.SchoolDB ? root.SchoolDB.getProfile() : {
      name: 'SDN Ngeposari 2',
      description: 'Sekolah Dasar Negeri di Semanu, Gunungkidul. Tempat belajar, bertumbuh, dan membentuk nalar luhur peserta didik.',
      tagline: 'Unggul, Berkarakter, dan Berbudaya Lingkungan',
      logo: 'images/logo.webp'
    });

    const schoolContact = contact || (root.SchoolDB ? root.SchoolDB.getContact() : {
      address: 'Mojo RT 01 / RW 13, Ngeposari, Semanu, Gunungkidul, DIY 55893',
      phone: '0812-3456-7890',
      email: 'info@sdnngeposari2.sch.id'
    });

    const currentYear = new Date().getFullYear();
    const logoSrc = schoolProfile.logo || 'images/logo.webp';

    container.innerHTML = `
      <div class="footer-container">
        <div class="footer-brand">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
            <img src="${logoSrc}" alt="Logo ${schoolProfile.name}" style="width: auto; height: 50px; max-width: 52px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.35));" width="44" height="50" onerror="this.onerror=null;this.src='images/logo.png';">
            <h3 style="margin: 0; font-size: 1.35rem; color: #FFFFFF !important;">${schoolProfile.name}</h3>
          </div>
          <p style="color: #FFFFFF !important;">${schoolProfile.description}</p>
          <p class="footer-tagline" style="color: #FFFFFF !important; font-weight: 700; opacity: 1 !important;">${schoolProfile.tagline || 'Unggul, Berkarakter, dan Berbudaya Lingkungan'}</p>
        </div>
        <div class="footer-links">
          <h4 style="color: #FFFFFF !important;">Navigasi</h4>
          <ul>
            <li><a href="index.html" style="color: #FFFFFF !important;">Beranda</a></li>
            <li><a href="tentang.html" style="color: #FFFFFF !important;">Tentang Sekolah</a></li>
            <li><a href="fasilitas.html" style="color: #FFFFFF !important;">Fasilitas</a></li>
            <li><a href="kegiatan.html" style="color: #FFFFFF !important;">Kegiatan & Berita</a></li>
            <li><a href="kontak.html" style="color: #FFFFFF !important;">Kontak & Lokasi</a></li>
            <li><a href="admin.html" style="font-weight:700; color: #FFFFFF !important;">Portal CMS Admin</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4 style="color: #FFFFFF !important;">Hubungi Kami</h4>
          <div class="footer-contact-list">
            <div class="footer-contact-item" style="color: #FFFFFF !important;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#FFFFFF !important; stroke:#FFFFFF !important;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style="color: #FFFFFF !important;">${schoolContact.address}</span>
            </div>
            <div class="footer-contact-item" style="color: #FFFFFF !important;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#FFFFFF !important; stroke:#FFFFFF !important;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span style="color: #FFFFFF !important;">${schoolContact.phone}</span>
            </div>
            <div class="footer-contact-item" style="color: #FFFFFF !important;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#FFFFFF !important; stroke:#FFFFFF !important;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span style="color: #FFFFFF !important;">${schoolContact.email}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom" style="color: #FFFFFF !important;">
        <p style="color: #FFFFFF !important;">&copy; ${currentYear} ${schoolProfile.name}. KKN 73 Reguler Unit 113. All Rights Reserved.</p>
        <p style="color: #FFFFFF !important;">Developed by Zulpadli Syarif Harahap (Informatika)</p>
      </div>
    `;
  }

  const SchoolFooter = {
    renderFooter
  };

  root.SchoolFooter = SchoolFooter;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolFooter;
  }
})(typeof window !== 'undefined' ? window : global);
