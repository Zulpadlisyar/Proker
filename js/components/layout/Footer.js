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
      email: 'sdngeposari2semanu@gmail.com'
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#FFFFFF !important; stroke:#FFFFFF !important; flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style="color: #FFFFFF !important; line-height: 1.5;">${schoolContact.address}</span>
            </div>
            <div class="footer-contact-item" style="color: #FFFFFF !important;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#FFFFFF !important; stroke:#FFFFFF !important; flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:${(schoolContact.phone || '').replace(/[^0-9+]/g, '')}" style="color: #FFFFFF !important; text-decoration: none;">${schoolContact.phone}</a>
            </div>
            <div class="footer-contact-item" style="color: #FFFFFF !important;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#FFFFFF !important; stroke:#FFFFFF !important; flex-shrink: 0;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <a href="mailto:${schoolContact.email}" style="color: #FFFFFF !important; text-decoration: none; word-break: break-all;">${schoolContact.email}</a>
            </div>

            <!-- Social Media Row -->
            <div style="display: flex; gap: 10px; margin-top: 8px; align-items: center;">
              <a href="${schoolContact.instagramUrl || 'https://www.instagram.com/snada_02'}" target="_blank" rel="noopener noreferrer" aria-label="Instagram SDN Ngeposari 2" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); color: #FFFFFF; text-decoration: none; transition: background 200ms ease;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="${schoolContact.facebookUrl || 'https://www.facebook.com/search/top?q=SD%20Ngeposari%20II'}" target="_blank" rel="noopener noreferrer" aria-label="Facebook SDN Ngeposari 2" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); color: #FFFFFF; text-decoration: none; transition: background 200ms ease;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="${schoolContact.youtubeUrl || 'https://www.youtube.com/@sdngeposari2'}" target="_blank" rel="noopener noreferrer" aria-label="YouTube SDN Ngeposari 2" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); color: #FFFFFF; text-decoration: none; transition: background 200ms ease;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
              </a>
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
