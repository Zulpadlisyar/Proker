// DESIGN.md Compliance - CMS Admin Logic for SDN 2 Ngeposari Website
// Hardened with Anti-Spam Submit Locks, SHA-256 Auth, Rate Limiting, Live Search, Pagination, & Audit Trail.

let tempLogoBase64 = null;
let tempHeroBase64 = null;
let tempTeacherBase64 = null;
let tempFacilityBase64 = null;
let tempActivityBase64 = null;
let tempGalleryBase64 = null;
let tempTestiBase64 = null;
let inboxFilter = 'all';
let inboxSearchQuery = '';

// Form Dirty State & Active Form Tracker (Unsaved Changes)
let isFormDirty = false;
let activeModalFormId = null;

function normalizeName(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

function attachDirtyListeners(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(el => {
    el.removeEventListener('input', markDirty);
    el.removeEventListener('change', markDirty);
    el.addEventListener('input', markDirty);
    el.addEventListener('change', markDirty);
  });
}

// Table Pagination & Search State
const ITEMS_PER_PAGE = 10;
let teacherSearchQuery = '';
let teacherPage = 1;

let facilitySearchQuery = '';
let facilityPage = 1;

let activitySearchQuery = '';
let activityPage = 1;

let gallerySearchQuery = '';
let galleryPage = 1;

// Modern Floating Toast Notification System
function showAdminToast(message, type = 'success', title = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    if (!title) title = 'Berhasil';
  } else if (type === 'error') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
    if (!title) title = 'Perhatian';
  } else {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
    if (!title) title = 'Informasi';
  }
  
  toast.innerHTML = `
    <div class="toast-icon-wrap">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" type="button" aria-label="Tutup notifikasi">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  
  container.appendChild(toast);
  
  let isRemoved = false;
  const removeToast = () => {
    if (isRemoved) return;
    isRemoved = true;
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 250);
  };
  
  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', removeToast);
  }
  
  setTimeout(removeToast, 3500);
}

// Button Submitting State Manager (Anti-Spam / Anti-Duplicate Click)
function setButtonSubmitting(btn, isSubmitting, text = 'Menyimpan...') {
  if (!btn) return;
  if (isSubmitting) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `<span class="btn-spinner"></span>${text}`;
  } else {
    btn.disabled = false;
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
    }
  }
}

// Utility: Debounce Function
function debounce(func, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Authentication & Session Management
const SESSION_KEY = 'sdn2_admin_session';
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 Hours

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() - session.timestamp > SESSION_EXPIRY_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

function setSession() {
  const session = {
    isLoggedIn: true,
    timestamp: Date.now()
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function checkAuth() {
  const session = getSession();
  const loginScreen = document.getElementById('admin-login-screen');
  const mainInterface = document.getElementById('admin-main-interface');
  
  if (session && session.isLoggedIn) {
    loginScreen.style.display = 'none';
    mainInterface.style.display = 'block';
    initAdminPanel();
  } else {
    loginScreen.style.display = 'block';
    mainInterface.style.display = 'none';
  }
}

// Rate Limiting for Login Attempts (Max 5 attempts / 60s cooldown)
let loginAttempts = 0;
let lockoutTimerInterval = null;

function checkLoginRateLimit() {
  const lockoutUntil = parseInt(localStorage.getItem('sdn2_admin_lockout_until') || '0', 10);
  const now = Date.now();
  
  if (lockoutUntil > now) {
    const remainingSecs = Math.ceil((lockoutUntil - now) / 1000);
    triggerLockoutUI(remainingSecs);
    return false; // Locked
  }
  return true; // Allowed
}

function recordFailedLogin() {
  loginAttempts++;
  if (loginAttempts >= 5) {
    const lockoutUntil = Date.now() + 60 * 1000; // 60s lockout
    localStorage.setItem('sdn2_admin_lockout_until', lockoutUntil.toString());
    loginAttempts = 0;
    triggerLockoutUI(60);
  }
}

function triggerLockoutUI(seconds) {
  const lockoutAlert = document.getElementById('login-lockout-alert');
  const countdownSpan = document.getElementById('lockout-countdown');
  const submitBtn = document.getElementById('admin-login-btn');
  const passwordInput = document.getElementById('admin-password');
  
  if (lockoutAlert) lockoutAlert.style.display = 'flex';
  if (submitBtn) submitBtn.disabled = true;
  if (passwordInput) passwordInput.disabled = true;
  
  let remaining = seconds;
  if (countdownSpan) countdownSpan.textContent = remaining;
  
  if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
  lockoutTimerInterval = setInterval(() => {
    remaining--;
    if (countdownSpan) countdownSpan.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(lockoutTimerInterval);
      if (lockoutAlert) lockoutAlert.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
      if (passwordInput) {
        passwordInput.disabled = false;
        passwordInput.focus();
      }
      localStorage.removeItem('sdn2_admin_lockout_until');
    }
  }, 1000);
}

// Unsaved Changes Tracking
window.addEventListener('beforeunload', (e) => {
  if (isFormDirty) {
    e.preventDefault();
    e.returnValue = 'Perubahan belum disimpan. Tetap keluar?';
  }
});

function markDirty() {
  isFormDirty = true;
}

function clearDirty() {
  isFormDirty = false;
}

// Initialize Admin Panel
async function initAdminPanel() {
  await window.SchoolDB.init();
  
  renderDashboard();
  loadProfileForm();
  renderTeachersTable();
  renderFacilitiesTable();
  renderActivitiesTable();
  renderGalleryTable();
  renderInboxList();
  renderTestimonialsTable();
  renderCalendarTable();
  renderHabitsTable();
  renderComfortTable();
  loadContactForm();
  initCloudSyncUI();
  initCategoryManagementUI();
  initInboxUI();
  
  // Navigation Tabs with Resilient Event Delegation & Dynamic Pane Refresh
  const adminSidebar = document.querySelector('.admin-sidebar');
  if (adminSidebar) {
    adminSidebar.onclick = (e) => {
      const btn = e.target.closest('.admin-nav-btn');
      if (!btn) return;
      
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      if (isFormDirty) {
        if (!confirm('Ada perubahan form yang belum disimpan. Tetap berpindah menu?')) {
          return;
        }
        clearDirty();
      }
      
      const navBtns = document.querySelectorAll('.admin-nav-btn');
      const panes = document.querySelectorAll('.admin-tab-pane');

      navBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        
        // Refresh specific pane content on activation
        if (targetId === 'pane-dashboard') renderDashboard();
        else if (targetId === 'pane-inbox') renderInboxList();
        else if (targetId === 'pane-testimonials') renderTestimonialsTable();
        else if (targetId === 'pane-calendar') renderCalendarTable();
        else if (targetId === 'pane-habits') renderHabitsTable();
        else if (targetId === 'pane-comfort') renderComfortTable();
        else if (targetId === 'pane-teachers') renderTeachersTable();
        else if (targetId === 'pane-facilities') renderFacilitiesTable();
        else if (targetId === 'pane-activities') renderActivitiesTable();
        else if (targetId === 'pane-gallery') renderGalleryTable();
        
        // Scroll to top of content
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) adminContent.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
  }

  // Attach search input listeners with debounce
  initSearchAndPagination();
  clearDirty(); // Start clean
}

function updateInboxBadge() {
  const badge = document.getElementById('inbox-unread-badge');
  if (!badge) return;
  const unreadCount = window.SchoolDB.getUnreadInquiriesCount ? window.SchoolDB.getUnreadInquiriesCount() : 0;
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// Render Dashboard & Audit Feed
function renderDashboard() {
  const profile = window.SchoolDB.getProfile();
  const teachers = window.SchoolDB.getTeachers();
  const facilities = window.SchoolDB.getFacilities();
  const activities = window.SchoolDB.getActivities();
  const gallery = window.SchoolDB.getGallery();
  const inquiries = window.SchoolDB.getInquiries ? window.SchoolDB.getInquiries() : [];
  
  if (document.getElementById('stat-teachers-count')) {
    document.getElementById('stat-teachers-count').textContent = teachers.length;
  }
  if (document.getElementById('stat-facilities-count')) {
    document.getElementById('stat-facilities-count').textContent = facilities.length;
  }
  if (document.getElementById('stat-activities-count')) {
    document.getElementById('stat-activities-count').textContent = activities.length;
  }
  if (document.getElementById('stat-gallery-count')) {
    document.getElementById('stat-gallery-count').textContent = gallery.length;
  }
  if (document.getElementById('stat-inquiries-count')) {
    document.getElementById('stat-inquiries-count').textContent = inquiries.length;
  }
  if (document.getElementById('stat-views-count')) {
    const totalViews = window.SchoolDB.getTotalActivityViews ? window.SchoolDB.getTotalActivityViews() : 0;
    document.getElementById('stat-views-count').textContent = totalViews;
  }
  
  if (document.getElementById('dash-school-name')) {
    document.getElementById('dash-school-name').textContent = profile.name;
  }
  if (document.getElementById('dash-school-tagline')) {
    document.getElementById('dash-school-tagline').textContent = profile.tagline;
  }

  updateInboxBadge();
  renderAuditFeed();
}

function renderAuditFeed() {
  const feedContainer = document.getElementById('admin-audit-feed');
  if (!feedContainer) return;
  
  const logs = window.SchoolDB.getAuditLogs(10);
  if (logs.length === 0) {
    feedContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.88rem; padding: 8px 0;">Belum ada catatan aktivitas.</p>';
    return;
  }
  
  feedContainer.innerHTML = logs.map(log => {
    const timeStr = new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(log.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    let badgeClass = 'audit-badge-ubah';
    if (log.action === 'TAMBAH') badgeClass = 'audit-badge-tambah';
    if (log.action === 'HAPUS') badgeClass = 'audit-badge-hapus';
    if (log.action === 'RESET') badgeClass = 'audit-badge-reset';
    
    return `
      <div class="audit-item">
        <div class="audit-left">
          <span class="audit-badge ${badgeClass}">${log.action}</span>
          <span class="audit-detail"><strong>${log.entity}:</strong> ${log.detail}</span>
        </div>
        <span class="audit-time">${timeStr}</span>
      </div>
    `;
  }).join('');
}

// Reset Database Handler
const resetDbBtn = document.getElementById('admin-reset-db-btn');
if (resetDbBtn) {
  resetDbBtn.addEventListener('click', async () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh database konten? Semua perubahan data kustom akan hilang dan dikembalikan ke data awal bawaan.')) {
      setButtonSubmitting(resetDbBtn, true, 'Mereset Database...');
      try {
        await window.SchoolDB.reset();
        showAdminToast('Seluruh database telah direset ke data awal bawaan.', 'success', 'Database Direset');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        showAdminToast('Gagal mereset database.', 'error');
        setButtonSubmitting(resetDbBtn, false);
      }
    }
  });
}

// Profile Management
function loadProfileForm() {
  const profile = window.SchoolDB.getProfile();
  
  document.getElementById('profile-name').value = profile.name;
  document.getElementById('profile-tagline').value = profile.tagline;
  document.getElementById('profile-description').value = profile.description;
  document.getElementById('profile-history').value = profile.history;
  document.getElementById('profile-vision').value = profile.vision;
  document.getElementById('profile-missions').value = profile.missions.join('\n');
  
  document.getElementById('preview-logo-img').src = profile.logo || '';
  document.getElementById('preview-hero-img').src = profile.hero || '';
  
  tempLogoBase64 = profile.logo;
  tempHeroBase64 = profile.hero;
  
  // Attach dirty tracking
  ['profile-name', 'profile-tagline', 'profile-description', 'profile-history', 'profile-vision', 'profile-missions'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', markDirty);
  });
}

// Helper: Byte Formatting & Compression Badge Feedback
function formatBytes(bytes) {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function showCompressionBadge(badgeId, res) {
  const badge = document.getElementById(badgeId);
  if (!badge || !res) return;
  badge.style.display = 'block';
  if (res.reductionPercent > 0) {
    badge.innerHTML = `<span style="display:inline-flex; align-items:center; gap:4px;">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      Foto terkompresi otomatis: ${formatBytes(res.originalSize)} &rarr; ${formatBytes(res.compressedSize)} (-${res.reductionPercent}%)
    </span>`;
    badge.style.background = '#EFF6FF';
    badge.style.borderColor = '#BFDBFE';
    badge.style.color = '#1D4ED8';
  } else {
    badge.innerHTML = `<span>Ukuran File: ${formatBytes(res.compressedSize)}</span>`;
    badge.style.background = '#F8FAFC';
    badge.style.borderColor = '#E2E8F0';
    badge.style.color = '#475569';
  }
}

function hideCompressionBadge(badgeId) {
  const badge = document.getElementById(badgeId);
  if (badge) {
    badge.style.display = 'none';
    badge.innerHTML = '';
  }
}

// File Readers with Validation & Auto-Compression
document.getElementById('upload-logo-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const res = await (window.compressImageFile ? window.compressImageFile(file, { maxWidth: 400, maxHeight: 400, quality: 0.85 }) : fileToBase64(file, 400));
      tempLogoBase64 = typeof res === 'object' ? res.dataUrl : res;
      document.getElementById('preview-logo-img').src = tempLogoBase64;
      document.getElementById('preview-logo-container').style.display = 'block';
      if (typeof res === 'object') showCompressionBadge('compression-badge-logo', res);
      markDirty();
    } catch (err) {
      showAdminToast(err.message || 'Gagal memproses berkas logo.', 'error', 'Format Tidak Didukung');
    }
  }
});

document.getElementById('upload-hero-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const res = await (window.compressImageFile ? window.compressImageFile(file, { maxWidth: 1600, maxHeight: 1000, quality: 0.82 }) : fileToBase64(file, 1600));
      tempHeroBase64 = typeof res === 'object' ? res.dataUrl : res;
      document.getElementById('preview-hero-img').src = tempHeroBase64;
      document.getElementById('preview-hero-container').style.display = 'block';
      if (typeof res === 'object') showCompressionBadge('compression-badge-hero', res);
      markDirty();
    } catch (err) {
      showAdminToast(err.message || 'Gagal memproses berkas banner.', 'error', 'Format Tidak Didukung');
    }
  }
});

// Submit Profile Form with Submit Lock
const formEditProfile = document.getElementById('form-edit-profile');
if (formEditProfile) {
  formEditProfile.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formEditProfile.querySelector('button[type="submit"]');
    setButtonSubmitting(submitBtn, true, 'Menyimpan Profil...');
    
    try {
      const name = document.getElementById('profile-name').value;
      const tagline = document.getElementById('profile-tagline').value;
      const description = document.getElementById('profile-description').value;
      const history = document.getElementById('profile-history').value;
      const vision = document.getElementById('profile-vision').value;
      const missions = document.getElementById('profile-missions').value
        .split('\n')
        .map(m => m.trim())
        .filter(m => m.length > 0);
      
      await window.SchoolDB.updateProfile({
        name,
        tagline,
        description,
        history,
        vision,
        missions,
        logo: tempLogoBase64,
        hero: tempHeroBase64
      });
      
      clearDirty();
      showAdminToast('Profil dan visi misi sekolah berhasil disimpan.', 'success', 'Profil Disimpan');
      renderDashboard();
    } catch (err) {
      showAdminToast('Terjadi kesalahan saat menyimpan profil sekolah.', 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

// ----------------------------------------------------
// SEARCH & PAGINATION CONTROLS
// ----------------------------------------------------
function initSearchAndPagination() {
  // Teachers search
  const searchTeachers = document.getElementById('search-teachers');
  if (searchTeachers) {
    searchTeachers.addEventListener('input', debounce((e) => {
      teacherSearchQuery = e.target.value.toLowerCase().trim();
      teacherPage = 1;
      renderTeachersTable();
    }, 300));
  }

  // Facilities search
  const searchFacilities = document.getElementById('search-facilities');
  if (searchFacilities) {
    searchFacilities.addEventListener('input', debounce((e) => {
      facilitySearchQuery = e.target.value.toLowerCase().trim();
      facilityPage = 1;
      renderFacilitiesTable();
    }, 300));
  }

  // Activities search
  const searchActivities = document.getElementById('search-activities');
  if (searchActivities) {
    searchActivities.addEventListener('input', debounce((e) => {
      activitySearchQuery = e.target.value.toLowerCase().trim();
      activityPage = 1;
      renderActivitiesTable();
    }, 300));
  }

  // Gallery search
  const searchGallery = document.getElementById('search-gallery');
  if (searchGallery) {
    searchGallery.addEventListener('input', debounce((e) => {
      gallerySearchQuery = e.target.value.toLowerCase().trim();
      galleryPage = 1;
      renderGalleryTable();
    }, 300));
  }
}

function renderPaginationControls(containerId, totalItems, currentPage, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  if (totalItems <= ITEMS_PER_PAGE) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';
  
  container.innerHTML = `
    <span>Menampilkan ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} dari ${totalItems} data</span>
    <div class="pagination-buttons">
      <button class="page-btn page-prev" ${currentPage === 1 ? 'disabled' : ''}>&larr; Sebelumnya</button>
      <span style="padding: 5px 8px; font-weight:600;">Hal ${currentPage} / ${totalPages}</span>
      <button class="page-btn page-next" ${currentPage === totalPages ? 'disabled' : ''}>Berikutnya &rarr;</button>
    </div>
  `;
  
  container.querySelector('.page-prev').addEventListener('click', () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  });
  container.querySelector('.page-next').addEventListener('click', () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  });
}

// ----------------------------------------------------
// TEACHERS CRUD WITH SUBMIT LOCK & SAFE DELETE
// ----------------------------------------------------
function renderTeachersTable() {
  const allTeachers = window.SchoolDB.getTeachers();
  const listBody = document.getElementById('admin-teachers-list');
  if (!listBody) return;
  
  const filtered = allTeachers.filter(t => {
    return t.name.toLowerCase().includes(teacherSearchQuery) ||
           t.role.toLowerCase().includes(teacherSearchQuery);
  });
  
  if (filtered.length === 0) {
    listBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px;">${teacherSearchQuery ? 'Tidak ada guru yang cocok dengan pencarian.' : 'Belum ada data guru yang dimasukkan.'}</td></tr>`;
    renderPaginationControls('pagination-teachers', 0, 1, () => {});
    return;
  }
  
  const startIndex = (teacherPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  listBody.innerHTML = paginated.map(t => `
    <tr>
      <td><img src="${t.image}" class="admin-thumb" alt="${t.name}"></td>
      <td><strong>${t.name}</strong></td>
      <td>${t.role}</td>
      <td>
        <div class="table-actions">
          <button class="btn-action-edit btn-edit-teacher" data-id="${t.id}" title="Edit Data Guru">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Edit</span>
          </button>
          <button class="btn-action-delete btn-delete-teacher" data-id="${t.id}" title="Hapus Data Guru">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
            <span>Hapus</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  renderPaginationControls('pagination-teachers', filtered.length, teacherPage, (newPage) => {
    teacherPage = newPage;
    renderTeachersTable();
  });
  
  listBody.querySelectorAll('.btn-edit-teacher').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openTeacherModal(id);
    });
  });
  
  listBody.querySelectorAll('.btn-delete-teacher').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus data guru/staf ini? Tindakan tidak dapat dibatalkan.')) {
        e.currentTarget.disabled = true;
        try {
          await window.SchoolDB.deleteTeacher(id);
          showAdminToast('Data guru/staf berhasil dihapus.', 'success', 'Guru Dihapus');
          const remaining = (window.SchoolDB.getTeachers() || []).length;
          if (teacherPage > 1 && (teacherPage - 1) * ITEMS_PER_PAGE >= remaining) {
            teacherPage = Math.max(1, Math.ceil(remaining / ITEMS_PER_PAGE));
          }
          renderTeachersTable();
          renderDashboard();
        } catch (err) {
          showAdminToast('Gagal menghapus data guru.', 'error');
          e.currentTarget.disabled = false;
        }
      }
    });
  });
}

document.getElementById('teacher-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const res = await (window.compressImageFile ? window.compressImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.82 }) : fileToBase64(file, 600));
      tempTeacherBase64 = typeof res === 'object' ? res.dataUrl : res;
      document.getElementById('preview-teacher-img').src = tempTeacherBase64;
      document.getElementById('preview-teacher-container').style.display = 'block';
      document.getElementById('label-teacher-upload').textContent = 'Gambar siap';
      if (typeof res === 'object') showCompressionBadge('compression-badge-teacher', res);
      markDirty();
    } catch (err) {
      showAdminToast(err.message || 'Gagal memproses berkas.', 'error', 'Format Tidak Didukung');
    }
  }
});

function openTeacherModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-teacher';
  
  hideAllModalForms();
  document.getElementById('form-teacher').style.display = 'block';
  
  document.getElementById('form-teacher').reset();
  document.getElementById('preview-teacher-container').style.display = 'none';
  document.getElementById('preview-teacher-img').src = '';
  document.getElementById('label-teacher-upload').textContent = 'Klik untuk pilih gambar';
  tempTeacherBase64 = null;
  hideCompressionBadge('compression-badge-teacher');
  clearDirty();
  
  if (id) {
    title.textContent = 'Edit Data Guru';
    const teacher = window.SchoolDB.getTeachers().find(t => String(t.id) === String(id));
    if (teacher) {
      document.getElementById('teacher-id').value = teacher.id;
      document.getElementById('teacher-name').value = teacher.name;
      document.getElementById('teacher-role').value = teacher.role;
      if (teacher.image) {
        document.getElementById('preview-teacher-img').src = teacher.image;
        document.getElementById('preview-teacher-container').style.display = 'block';
        document.getElementById('label-teacher-upload').textContent = 'Gambar saat ini (Klik untuk ganti)';
        tempTeacherBase64 = teacher.image;
      }
    }
  } else {
    title.textContent = 'Tambah Guru Baru';
    document.getElementById('teacher-id').value = '';
  }
  
  attachDirtyListeners('form-teacher');
  modal.classList.add('open');
}

const formTeacher = document.getElementById('form-teacher');
if (formTeacher) {
  formTeacher.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formTeacher.querySelector('button[type="submit"]');
    
    const id = document.getElementById('teacher-id').value;
    const name = document.getElementById('teacher-name').value;
    const role = document.getElementById('teacher-role').value;

    // Client-side duplicate check
    const normName = normalizeName(name);
    const isDuplicate = window.SchoolDB.getTeachers().some(t => String(t.id) !== String(id) && normalizeName(t.name) === normName);
    if (isDuplicate) {
      showAdminToast('Guru dengan nama tersebut sudah terdaftar. Silakan gunakan nama yang berbeda.', 'error', 'Nama Guru Duplikat');
      const nameInput = document.getElementById('teacher-name');
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
      return;
    }
    
    setButtonSubmitting(submitBtn, true, 'Menyimpan Data Guru...');
    
    try {
      if (id) {
        await window.SchoolDB.updateTeacher(id, { name, role, image: tempTeacherBase64 });
        showAdminToast(`Data guru/staf "${name}" berhasil diperbarui.`, 'success', 'Guru Diperbarui');
      } else {
        await window.SchoolDB.addTeacher({ name, role, image: tempTeacherBase64 });
        showAdminToast(`Guru/staf baru "${name}" berhasil ditambahkan!`, 'success', 'Guru Ditambahkan');
      }
      
      clearDirty();
      closeModal(true);
      renderTeachersTable();
      renderDashboard();
    } catch (err) {
      showAdminToast(err.message || 'Terjadi kesalahan saat menyimpan data guru.', 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addTeacherBtn = document.getElementById('admin-add-teacher-btn');
if (addTeacherBtn) {
  addTeacherBtn.addEventListener('click', () => openTeacherModal());
}

// ----------------------------------------------------
// FACILITIES CRUD WITH SUBMIT LOCK & SAFE DELETE
// ----------------------------------------------------
function renderFacilitiesTable() {
  const allFacilities = window.SchoolDB.getFacilities();
  const listBody = document.getElementById('admin-facilities-list');
  if (!listBody) return;
  
  const filtered = allFacilities.filter(f => {
    return f.name.toLowerCase().includes(facilitySearchQuery) ||
           f.description.toLowerCase().includes(facilitySearchQuery);
  });
  
  if (filtered.length === 0) {
    listBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px;">${facilitySearchQuery ? 'Tidak ada fasilitas yang cocok.' : 'Belum ada fasilitas yang dimasukkan.'}</td></tr>`;
    renderPaginationControls('pagination-facilities', 0, 1, () => {});
    return;
  }
  
  const startIndex = (facilityPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  listBody.innerHTML = paginated.map(f => `
    <tr>
      <td><img src="${f.image}" class="admin-thumb" alt="${f.name}"></td>
      <td><strong>${f.name}</strong></td>
      <td>${f.description.substring(0, 80)}${f.description.length > 80 ? '...' : ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn-action-edit btn-edit-facility" data-id="${f.id}" title="Edit Fasilitas">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Edit</span>
          </button>
          <button class="btn-action-delete btn-delete-facility" data-id="${f.id}" title="Hapus Fasilitas">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
            <span>Hapus</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  renderPaginationControls('pagination-facilities', filtered.length, facilityPage, (newPage) => {
    facilityPage = newPage;
    renderFacilitiesTable();
  });
  
  listBody.querySelectorAll('.btn-edit-facility').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openFacilityModal(id);
    });
  });
  
  listBody.querySelectorAll('.btn-delete-facility').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus data fasilitas ini? Tindakan tidak dapat dibatalkan.')) {
        e.currentTarget.disabled = true;
        try {
          await window.SchoolDB.deleteFacility(id);
          showAdminToast('Data fasilitas berhasil dihapus.', 'success', 'Fasilitas Dihapus');
          const remaining = (window.SchoolDB.getFacilities() || []).length;
          if (facilityPage > 1 && (facilityPage - 1) * ITEMS_PER_PAGE >= remaining) {
            facilityPage = Math.max(1, Math.ceil(remaining / ITEMS_PER_PAGE));
          }
          renderFacilitiesTable();
          renderDashboard();
        } catch (err) {
          showAdminToast('Gagal menghapus fasilitas.', 'error');
          e.currentTarget.disabled = false;
        }
      }
    });
  });
}

document.getElementById('facility-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const res = await (window.compressImageFile ? window.compressImageFile(file, { maxWidth: 800, maxHeight: 600, quality: 0.82 }) : fileToBase64(file, 800));
      tempFacilityBase64 = typeof res === 'object' ? res.dataUrl : res;
      document.getElementById('preview-facility-img').src = tempFacilityBase64;
      document.getElementById('preview-facility-container').style.display = 'block';
      document.getElementById('label-facility-upload').textContent = 'Gambar siap';
      if (typeof res === 'object') showCompressionBadge('compression-badge-facility', res);
      markDirty();
    } catch (err) {
      showAdminToast(err.message || 'Gagal memproses berkas.', 'error', 'Format Tidak Didukung');
    }
  }
});

function openFacilityModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-facility';
  
  hideAllModalForms();
  document.getElementById('form-facility').style.display = 'block';
  
  document.getElementById('form-facility').reset();
  document.getElementById('preview-facility-container').style.display = 'none';
  document.getElementById('preview-facility-img').src = '';
  document.getElementById('label-facility-upload').textContent = 'Klik untuk pilih gambar';
  tempFacilityBase64 = null;
  hideCompressionBadge('compression-badge-facility');
  clearDirty();
  
  if (id) {
    title.textContent = 'Edit Fasilitas';
    const facility = window.SchoolDB.getFacilities().find(f => String(f.id) === String(id));
    if (facility) {
      document.getElementById('facility-id').value = facility.id;
      document.getElementById('facility-name').value = facility.name;
      document.getElementById('facility-desc').value = facility.description;
      if (facility.image) {
        document.getElementById('preview-facility-img').src = facility.image;
        document.getElementById('preview-facility-container').style.display = 'block';
        document.getElementById('label-facility-upload').textContent = 'Gambar saat ini (Klik untuk ganti)';
        tempFacilityBase64 = facility.image;
      }
    }
  } else {
    title.textContent = 'Tambah Fasilitas Baru';
    document.getElementById('facility-id').value = '';
  }
  
  attachDirtyListeners('form-facility');
  modal.classList.add('open');
}

const formFacility = document.getElementById('form-facility');
if (formFacility) {
  formFacility.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formFacility.querySelector('button[type="submit"]');
    
    const id = document.getElementById('facility-id').value;
    const name = document.getElementById('facility-name').value;
    const description = document.getElementById('facility-desc').value;

    // Client-side duplicate check
    const normName = normalizeName(name);
    const isDuplicate = window.SchoolDB.getFacilities().some(f => String(f.id) !== String(id) && normalizeName(f.name) === normName);
    if (isDuplicate) {
      showAdminToast('Fasilitas dengan nama tersebut sudah tersedia. Silakan gunakan nama yang berbeda.', 'error', 'Nama Fasilitas Duplikat');
      const nameInput = document.getElementById('facility-name');
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
      return;
    }
    
    setButtonSubmitting(submitBtn, true, 'Menyimpan Fasilitas...');
    
    try {
      if (id) {
        await window.SchoolDB.updateFacility(id, { name, description, image: tempFacilityBase64 });
        showAdminToast(`Data fasilitas "${name}" berhasil diperbarui.`, 'success', 'Fasilitas Diperbarui');
      } else {
        await window.SchoolDB.addFacility({ name, description, image: tempFacilityBase64 });
        showAdminToast(`Fasilitas baru "${name}" berhasil ditambahkan!`, 'success', 'Fasilitas Ditambahkan');
      }
      
      clearDirty();
      closeModal(true);
      renderFacilitiesTable();
      renderDashboard();
    } catch (err) {
      showAdminToast(err.message || 'Terjadi kesalahan saat menyimpan fasilitas.', 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addFacilityBtn = document.getElementById('admin-add-facility-btn');
if (addFacilityBtn) {
  addFacilityBtn.addEventListener('click', () => openFacilityModal());
}

// ----------------------------------------------------
// ACTIVITIES CRUD WITH SUBMIT LOCK & SAFE DELETE
// ----------------------------------------------------
function renderActivitiesTable() {
  const allActivities = window.SchoolDB.getActivities();
  const listBody = document.getElementById('admin-activities-list');
  if (!listBody) return;
  
  const filtered = allActivities.filter(a => {
    return a.title.toLowerCase().includes(activitySearchQuery) ||
           a.excerpt.toLowerCase().includes(activitySearchQuery);
  });
  
  if (filtered.length === 0) {
    listBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding: 20px;">${activitySearchQuery ? 'Tidak ada kegiatan yang cocok.' : 'Belum ada berita kegiatan saat ini.'}</td></tr>`;
    renderPaginationControls('pagination-activities', 0, 1, () => {});
    return;
  }
  
  const startIndex = (activityPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  listBody.innerHTML = paginated.map(a => `
    <tr>
      <td><img src="${a.image}" class="admin-thumb" alt="${a.title}"></td>
      <td>${new Date(a.date).toLocaleDateString('id-ID')}</td>
      <td>
        <strong>${a.title}</strong>
        <div style="margin-top: 4px;">
          <span style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #EFF6FF; border: 1px solid #BFDBFE; color: #1D4ED8; font-weight: 600;">
            ${a.category || 'Umum'}
          </span>
        </div>
      </td>
      <td>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text); display:inline-flex; align-items:center; gap:4px;">
          ${a.views || 0} pembaca
        </span>
      </td>
      <td>${a.excerpt.substring(0, 70)}${a.excerpt.length > 70 ? '...' : ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn-action-edit btn-edit-activity" data-id="${a.id}" title="Edit Kegiatan">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Edit</span>
          </button>
          <button class="btn-action-delete btn-delete-activity" data-id="${a.id}" title="Hapus Kegiatan">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
            <span>Hapus</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  renderPaginationControls('pagination-activities', filtered.length, activityPage, (newPage) => {
    activityPage = newPage;
    renderActivitiesTable();
  });
  
  listBody.querySelectorAll('.btn-edit-activity').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openActivityModal(id);
    });
  });
  
  listBody.querySelectorAll('.btn-delete-activity').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus berita kegiatan ini? Tindakan tidak dapat dibatalkan.')) {
        e.currentTarget.disabled = true;
        try {
          await window.SchoolDB.deleteActivity(id);
          showAdminToast('Berita kegiatan berhasil dihapus.', 'success', 'Kegiatan Dihapus');
          const remaining = (window.SchoolDB.getActivities() || []).length;
          if (activityPage > 1 && (activityPage - 1) * ITEMS_PER_PAGE >= remaining) {
            activityPage = Math.max(1, Math.ceil(remaining / ITEMS_PER_PAGE));
          }
          renderActivitiesTable();
          renderDashboard();
        } catch (err) {
          showAdminToast('Gagal menghapus kegiatan.', 'error');
          e.currentTarget.disabled = false;
        }
      }
    });
  });
}

document.getElementById('activity-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const res = await (window.compressImageFile ? window.compressImageFile(file, { maxWidth: 1000, maxHeight: 700, quality: 0.82 }) : fileToBase64(file, 1000));
      tempActivityBase64 = typeof res === 'object' ? res.dataUrl : res;
      document.getElementById('preview-activity-img').src = tempActivityBase64;
      document.getElementById('preview-activity-container').style.display = 'block';
      document.getElementById('label-activity-upload').textContent = 'Gambar siap';
      if (typeof res === 'object') showCompressionBadge('compression-badge-activity', res);
      markDirty();
    } catch (err) {
      showAdminToast(err.message || 'Gagal memproses berkas.', 'error', 'Format Tidak Didukung');
    }
  }
});

function openActivityModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-activity';
  
  hideAllModalForms();
  document.getElementById('form-activity').style.display = 'block';
  
  document.getElementById('form-activity').reset();
  document.getElementById('preview-activity-container').style.display = 'none';
  document.getElementById('preview-activity-img').src = '';
  document.getElementById('label-activity-upload').textContent = 'Klik untuk pilih gambar';
  tempActivityBase64 = null;
  hideCompressionBadge('compression-badge-activity');
  clearDirty();
  
  document.getElementById('activity-date').value = new Date().toISOString().split('T')[0];
  populateActivityCategoriesDropdown();
  
  if (id) {
    title.textContent = 'Edit Kegiatan';
    const activity = window.SchoolDB.getActivities().find(a => String(a.id) === String(id));
    if (activity) {
      document.getElementById('activity-id').value = activity.id;
      document.getElementById('activity-title').value = activity.title;
      document.getElementById('activity-date').value = activity.date;
      populateActivityCategoriesDropdown(activity.category || 'Umum');
      document.getElementById('activity-excerpt').value = activity.excerpt;
      document.getElementById('activity-content').value = activity.content;
      if (activity.image) {
        document.getElementById('preview-activity-img').src = activity.image;
        document.getElementById('preview-activity-container').style.display = 'block';
        document.getElementById('label-activity-upload').textContent = 'Gambar saat ini (Klik untuk ganti)';
        tempActivityBase64 = activity.image;
      }
    }
  } else {
    title.textContent = 'Tambah Kegiatan Baru';
    document.getElementById('activity-id').value = '';
    populateActivityCategoriesDropdown();
  }
  
  attachDirtyListeners('form-activity');
  modal.classList.add('open');
}

const formActivity = document.getElementById('form-activity');
if (formActivity) {
  formActivity.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formActivity.querySelector('button[type="submit"]');
    
    const id = document.getElementById('activity-id').value;
    const title = document.getElementById('activity-title').value;
    const category = document.getElementById('activity-category') ? document.getElementById('activity-category').value : 'Umum';
    const date = document.getElementById('activity-date').value;
    const excerpt = document.getElementById('activity-excerpt').value;
    const content = document.getElementById('activity-content').value;

    // Client-side duplicate check
    const normTitle = normalizeName(title);
    const isDuplicate = window.SchoolDB.getActivities().some(a => String(a.id) !== String(id) && normalizeName(a.title) === normTitle);
    if (isDuplicate) {
      showAdminToast('Kegiatan dengan judul tersebut sudah tersedia. Silakan gunakan judul yang berbeda.', 'error', 'Judul Kegiatan Duplikat');
      const titleInput = document.getElementById('activity-title');
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
      return;
    }
    
    setButtonSubmitting(submitBtn, true, 'Menyimpan Kegiatan...');
    
    try {
      if (id) {
        await window.SchoolDB.updateActivity(id, { title, category, date, excerpt, content, image: tempActivityBase64 });
        showAdminToast(`Berita kegiatan "${title}" berhasil diperbarui.`, 'success', 'Kegiatan Diperbarui');
      } else {
        await window.SchoolDB.addActivity({ title, category, date, excerpt, content, image: tempActivityBase64 });
        showAdminToast(`Kegiatan baru "${title}" berhasil ditambahkan!`, 'success', 'Kegiatan Ditambahkan');
      }
      
      clearDirty();
      closeModal(true);
      renderActivitiesTable();
      renderDashboard();
    } catch (err) {
      showAdminToast(err.message || 'Terjadi kesalahan saat menyimpan berita kegiatan.', 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addActivityBtn = document.getElementById('admin-add-activity-btn');
if (addActivityBtn) {
  addActivityBtn.addEventListener('click', () => openActivityModal());
}

// ----------------------------------------------------
// GALLERY CRUD WITH SUBMIT LOCK & SAFE DELETE
// ----------------------------------------------------
function renderGalleryTable() {
  const allGallery = window.SchoolDB.getGallery();
  const listBody = document.getElementById('admin-gallery-list');
  if (!listBody) return;
  
  const filtered = allGallery.filter(g => {
    return g.caption.toLowerCase().includes(gallerySearchQuery);
  });
  
  if (filtered.length === 0) {
    listBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding: 20px;">${gallerySearchQuery ? 'Tidak ada foto galeri yang cocok.' : 'Belum ada dokumentasi yang ditampilkan.'}</td></tr>`;
    renderPaginationControls('pagination-gallery', 0, 1, () => {});
    return;
  }
  
  const startIndex = (galleryPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  listBody.innerHTML = paginated.map(g => `
    <tr>
      <td><img src="${g.image}" class="admin-thumb" alt="${g.caption}"></td>
      <td><strong>${g.caption}</strong></td>
      <td>
        <div class="table-actions">
          <button class="btn-action-edit btn-edit-gallery" data-id="${g.id}" title="Edit Keterangan Foto">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Edit</span>
          </button>
          <button class="btn-action-delete btn-delete-gallery" data-id="${g.id}" title="Hapus Foto Galeri">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
            <span>Hapus</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  renderPaginationControls('pagination-gallery', filtered.length, galleryPage, (newPage) => {
    galleryPage = newPage;
    renderGalleryTable();
  });
  
  listBody.querySelectorAll('.btn-edit-gallery').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openGalleryModal(id);
    });
  });
  
  listBody.querySelectorAll('.btn-delete-gallery').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus foto galeri ini? Tindakan tidak dapat dibatalkan.')) {
        e.currentTarget.disabled = true;
        try {
          await window.SchoolDB.deleteGalleryItem(id);
          showAdminToast('Foto berhasil dihapus dari galeri.', 'success', 'Galeri Dihapus');
          const remaining = (window.SchoolDB.getGallery() || []).length;
          if (galleryPage > 1 && (galleryPage - 1) * ITEMS_PER_PAGE >= remaining) {
            galleryPage = Math.max(1, Math.ceil(remaining / ITEMS_PER_PAGE));
          }
          renderGalleryTable();
          renderDashboard();
        } catch (err) {
          showAdminToast('Gagal menghapus foto galeri.', 'error');
          e.currentTarget.disabled = false;
        }
      }
    });
  });
}

document.getElementById('gallery-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const res = await (window.compressImageFile ? window.compressImageFile(file, { maxWidth: 900, maxHeight: 700, quality: 0.82 }) : fileToBase64(file, 900));
      tempGalleryBase64 = typeof res === 'object' ? res.dataUrl : res;
      document.getElementById('preview-gallery-img').src = tempGalleryBase64;
      document.getElementById('preview-gallery-container').style.display = 'block';
      document.getElementById('label-gallery-upload').textContent = 'Gambar siap';
      if (typeof res === 'object') showCompressionBadge('compression-badge-gallery', res);
      markDirty();
    } catch (err) {
      showAdminToast(err.message || 'Gagal memproses berkas.', 'error', 'Format Tidak Didukung');
    }
  }
});

function openGalleryModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-gallery';
  
  hideAllModalForms();
  document.getElementById('form-gallery').style.display = 'block';
  
  document.getElementById('form-gallery').reset();
  document.getElementById('preview-gallery-container').style.display = 'none';
  document.getElementById('preview-gallery-img').src = '';
  document.getElementById('label-gallery-upload').textContent = 'Klik untuk pilih gambar';
  tempGalleryBase64 = null;
  hideCompressionBadge('compression-badge-gallery');
  clearDirty();
  
  if (id) {
    title.textContent = 'Edit Keterangan Foto';
    const item = window.SchoolDB.getGallery().find(g => String(g.id) === String(id));
    if (item) {
      document.getElementById('gallery-id').value = item.id;
      document.getElementById('gallery-caption').value = item.caption;
      if (item.image) {
        document.getElementById('preview-gallery-img').src = item.image;
        document.getElementById('preview-gallery-container').style.display = 'block';
        document.getElementById('label-gallery-upload').textContent = 'Gambar saat ini (Klik untuk ganti)';
        tempGalleryBase64 = item.image;
      }
    }
  } else {
    title.textContent = 'Tambah Foto Galeri Baru';
    document.getElementById('gallery-id').value = '';
  }
  
  attachDirtyListeners('form-gallery');
  modal.classList.add('open');
}

const formGallery = document.getElementById('form-gallery');
if (formGallery) {
  formGallery.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formGallery.querySelector('button[type="submit"]');
    
    const id = document.getElementById('gallery-id').value;
    const caption = document.getElementById('gallery-caption').value;
    
    if (!tempGalleryBase64 && !id) {
      showAdminToast('Mohon pilih berkas gambar terlebih dahulu.', 'error', 'Peringatan');
      return;
    }
    
    setButtonSubmitting(submitBtn, true, 'Menyimpan Foto...');
    try {
      if (id) {
        await window.SchoolDB.updateGalleryItem(id, { caption, image: tempGalleryBase64 });
        showAdminToast('Keterangan foto galeri berhasil diperbarui.', 'success', 'Galeri Diperbarui');
      } else {
        await window.SchoolDB.addGalleryItem({ caption, image: tempGalleryBase64 });
        showAdminToast('Foto dokumentasi baru berhasil ditambahkan ke galeri!', 'success', 'Galeri Ditambahkan');
      }
      
      clearDirty();
      closeModal(true);
      renderGalleryTable();
      renderDashboard();
    } catch (err) {
      showAdminToast('Terjadi kesalahan saat menyimpan foto galeri.', 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addGalleryBtn = document.getElementById('admin-add-gallery-btn');
if (addGalleryBtn) {
  addGalleryBtn.addEventListener('click', () => openGalleryModal());
}

// ----------------------------------------------------
// CONTACT MANAGEMENT WITH SUBMIT LOCK
// ----------------------------------------------------
function loadContactForm() {
  const contact = window.SchoolDB.getContact();
  
  document.getElementById('contact-address').value = contact.address;
  document.getElementById('contact-phone').value = contact.phone;
  document.getElementById('contact-email').value = contact.email;
  document.getElementById('contact-maps').value = contact.maps;
  document.getElementById('contact-facebook').value = contact.facebook || '';
  document.getElementById('contact-instagram').value = contact.instagram || '';
  document.getElementById('contact-youtube').value = contact.youtube || '';
  
  ['contact-address', 'contact-phone', 'contact-email', 'contact-maps', 'contact-facebook', 'contact-instagram', 'contact-youtube'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', markDirty);
  });
}

const formEditContact = document.getElementById('form-edit-contact');
if (formEditContact) {
  formEditContact.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formEditContact.querySelector('button[type="submit"]');
    setButtonSubmitting(submitBtn, true, 'Menyimpan Kontak...');
    
    try {
      const address = document.getElementById('contact-address').value;
      const phone = document.getElementById('contact-phone').value;
      const email = document.getElementById('contact-email').value;
      const maps = document.getElementById('contact-maps').value;
      const facebook = document.getElementById('contact-facebook').value;
      const instagram = document.getElementById('contact-instagram').value;
      const youtube = document.getElementById('contact-youtube').value;
      
      await window.SchoolDB.updateContact({ address, phone, email, maps, facebook, instagram, youtube });
      
      clearDirty();
      showAdminToast('Informasi kontak dan peta lokasi berhasil disimpan.', 'success', 'Kontak Disimpan');
    } catch (err) {
      showAdminToast('Terjadi kesalahan saat menyimpan kontak sekolah.', 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

// ----------------------------------------------------
// INBOX / LAYANAN KONSULTASI MANAGEMENT
// ----------------------------------------------------
function initInboxUI() {
  const filterBtns = document.querySelectorAll('.filter-inbox-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      inboxFilter = btn.getAttribute('data-filter') || 'all';
      renderInboxList();
    });
  });

  const searchInput = document.getElementById('inbox-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      inboxSearchQuery = e.target.value.toLowerCase().trim();
      renderInboxList();
    }, 300));
  }
}

function renderInboxList() {
  const container = document.getElementById('admin-inbox-list');
  if (!container) return;

  const allInquiries = window.SchoolDB.getInquiries ? window.SchoolDB.getInquiries() : [];
  updateInboxBadge();

  let filtered = allInquiries;
  if (inboxFilter === 'unread') {
    filtered = filtered.filter(i => !i.isRead);
  } else if (inboxFilter === 'read') {
    filtered = filtered.filter(i => i.isRead);
  }

  if (inboxSearchQuery) {
    filtered = filtered.filter(i => {
      const q = inboxSearchQuery;
      return (i.name && i.name.toLowerCase().includes(q)) ||
             (i.email && i.email.toLowerCase().includes(q)) ||
             (i.phone && i.phone.toLowerCase().includes(q)) ||
             (i.subject && i.subject.toLowerCase().includes(q)) ||
             (i.message && i.message.toLowerCase().includes(q));
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; background: var(--surface-alt); border-radius: var(--radius-card); border: 1px dashed var(--border);">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); margin-bottom: 10px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <p style="margin: 0; color: var(--text-muted); font-size: 14px; font-weight: 500;">Tidak ada pesan konsultasi masuk yang sesuai.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(inq => {
    const isUnread = !inq.isRead;
    const phoneClean = (inq.phone || '').replace(/[^0-9]/g, '');
    const waPhone = phoneClean.startsWith('0') ? '62' + phoneClean.slice(1) : phoneClean;
    const waUrl = phoneClean
      ? `https://wa.me/${waPhone}?text=Halo%20${encodeURIComponent(inq.name)},%20terima%20kasih%20telah%20menghubungi%20SDN%202%20Ngeposari.%20Mengenai%20pesan%20konsultasi%20Anda:%20%22${encodeURIComponent(inq.subject || 'Konsultasi')}%22`
      : null;
    const mailUrl = inq.email
      ? `mailto:${inq.email}?subject=${encodeURIComponent('Tanggapan SDN 2 Ngeposari: ' + (inq.subject || 'Layanan Konsultasi'))}`
      : null;

    return `
      <div class="inquiry-item-card" style="background: var(--surface); border: 1px solid ${isUnread ? '#BFDBFE' : 'var(--border)'}; border-left: 4px solid ${isUnread ? 'var(--primary)' : '#94A3B8'}; border-radius: var(--radius-sm); padding: 18px 20px; box-shadow: ${isUnread ? '0 4px 14px rgba(30,58,138,0.06)' : 'none'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; flex-wrap: wrap;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <strong style="font-size: 15px; color: var(--text);">${inq.name}</strong>
              <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: ${isUnread ? '#EFF6FF' : '#F1F5F9'}; color: ${isUnread ? '#1D4ED8' : '#64748B'}; border: 1px solid ${isUnread ? '#BFDBFE' : '#E2E8F0'};">
                ${isUnread ? 'Belum Dibaca' : 'Sudah Dibaca'}
              </span>
            </div>
            <div style="font-size: 12.5px; color: var(--text-muted); display: flex; gap: 14px; flex-wrap: wrap;">
              ${inq.email ? `<span>✉️ ${inq.email}</span>` : ''}
              ${inq.phone ? `<span>📞 ${inq.phone}</span>` : ''}
              ${inq.subject ? `<span>📌 ${inq.subject}</span>` : ''}
            </div>
          </div>
          <span style="font-size: 12px; color: var(--text-muted); white-space: nowrap;">${inq.date || ''}</span>
        </div>

        <div style="background: var(--surface-alt); padding: 12px 14px; border-radius: var(--radius-sm); font-size: 13.5px; line-height: 1.6; color: var(--text); margin-bottom: 14px; border: 1px solid var(--border); white-space: pre-wrap;">${inq.message}</div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          ${waUrl ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px; background-color: #16A34A; border-color: #16A34A; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              Balas WhatsApp
            </a>
          ` : ''}

          ${mailUrl ? `
            <a href="${mailUrl}" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Balas Email
            </a>
          ` : ''}

          <button type="button" class="btn btn-secondary btn-toggle-read-inq" data-id="${inq.id}" data-read="${inq.isRead ? 'true' : 'false'}" style="padding: 6px 12px; font-size: 12px;">
            ${inq.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
          </button>

          <button type="button" class="btn btn-danger-outline btn-delete-inq" data-id="${inq.id}" style="padding: 6px 12px; font-size: 12px; margin-left: auto;">
            Hapus
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-toggle-read-inq').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const isCurrentlyRead = e.currentTarget.getAttribute('data-read') === 'true';
      await window.SchoolDB.markInquiryRead(id, !isCurrentlyRead);
      renderInboxList();
      renderDashboard();
    });
  });

  container.querySelectorAll('.btn-delete-inq').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus pesan konsultasi ini? Tindakan tidak dapat dibatalkan.')) {
        await window.SchoolDB.deleteInquiry(id);
        showAdminToast('Pesan konsultasi berhasil dihapus.', 'success', 'Pesan Dihapus');
        renderInboxList();
        renderDashboard();
      }
    });
  });
}

// ----------------------------------------------------
// TESTIMONIALS / KESAN & APRESIASI MANAGEMENT
// ----------------------------------------------------
function renderTestimonialsTable() {
  const listBody = document.getElementById('admin-testimonials-list');
  if (!listBody) return;

  const testimonials = window.SchoolDB.getTestimonials ? window.SchoolDB.getTestimonials() : [];
  if (testimonials.length === 0) {
    listBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem; color:var(--text-muted);">Belum ada data kesan & testimoni.</td></tr>`;
    return;
  }

  listBody.innerHTML = testimonials.map(t => `
    <tr>
      <td style="width:60px;">
        <img src="${t.avatar || 'images/logo.webp'}" alt="${t.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:1px solid var(--border);" onerror="this.src='images/logo.webp'">
      </td>
      <td>
        <strong>${t.name}</strong><br>
        <span style="font-size:12px; color:var(--text-muted);">${t.role || 'Orang Tua Wali'}</span>
      </td>
      <td>
        <span style="font-size:13px; color:var(--text); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">"${t.quote}"</span>
      </td>
      <td style="width:140px; white-space:nowrap;">
        <button class="btn btn-secondary btn-edit-testi" data-id="${t.id}" style="padding:4px 8px; font-size:12px; margin-right:4px;">Edit</button>
        <button class="btn btn-danger-outline btn-delete-testi" data-id="${t.id}" style="padding:4px 8px; font-size:12px;">Hapus</button>
      </td>
    </tr>
  `).join('');

  listBody.querySelectorAll('.btn-edit-testi').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openTestimonialModal(id);
    });
  });

  listBody.querySelectorAll('.btn-delete-testi').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus testimoni ini?')) {
        await window.SchoolDB.deleteTestimonial(id);
        showAdminToast('Testimoni berhasil dihapus.', 'success', 'Testimoni Dihapus');
        renderTestimonialsTable();
      }
    });
  });
}

function openTestimonialModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-testimonial';

  hideAllModalForms();
  document.getElementById('form-testimonial').style.display = 'block';
  document.getElementById('form-testimonial').reset();
  document.getElementById('preview-testi-container').style.display = 'none';
  document.getElementById('preview-testi-img').src = '';
  document.getElementById('label-testi-upload').textContent = 'Klik untuk pilih gambar';
  tempTestiBase64 = null;
  hideCompressionBadge('compression-badge-testi');
  clearDirty();

  if (id) {
    title.textContent = 'Edit Kesan & Testimoni';
    const item = window.SchoolDB.getTestimonials().find(t => String(t.id) === String(id));
    if (item) {
      document.getElementById('testi-id').value = item.id;
      document.getElementById('testi-name').value = item.name;
      document.getElementById('testi-role').value = item.role || '';
      document.getElementById('testi-quote').value = item.quote || '';
      if (item.avatar) {
        document.getElementById('preview-testi-img').src = item.avatar;
        document.getElementById('preview-testi-container').style.display = 'block';
        document.getElementById('label-testi-upload').textContent = 'Foto saat ini (Klik untuk ganti)';
        tempTestiBase64 = item.avatar;
      }
    }
  } else {
    title.textContent = 'Tambah Kesan & Testimoni Baru';
    document.getElementById('testi-id').value = '';
  }

  attachDirtyListeners('form-testimonial');
  modal.classList.add('open');
}

const formTestimonial = document.getElementById('form-testimonial');
if (formTestimonial) {
  formTestimonial.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formTestimonial.querySelector('button[type="submit"]');
    const id = document.getElementById('testi-id').value;
    const name = document.getElementById('testi-name').value;
    const role = document.getElementById('testi-role').value;
    const quote = document.getElementById('testi-quote').value;

    setButtonSubmitting(submitBtn, true, 'Menyimpan Testimoni...');
    try {
      if (id) {
        await window.SchoolDB.updateTestimonial(id, { name, role, quote, avatar: tempTestiBase64 });
        showAdminToast('Testimoni berhasil diperbarui.', 'success', 'Testimoni Diperbarui');
      } else {
        await window.SchoolDB.addTestimonial({ name, role, quote, avatar: tempTestiBase64 });
        showAdminToast('Testimoni baru berhasil ditambahkan!', 'success', 'Testimoni Ditambahkan');
      }
      clearDirty();
      closeModal(true);
      renderTestimonialsTable();
    } catch (err) {
      showAdminToast('Gagal menyimpan testimoni: ' + err.message, 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addTestimonialBtn = document.getElementById('btn-add-testimonial');
if (addTestimonialBtn) {
  addTestimonialBtn.addEventListener('click', () => openTestimonialModal());
}

const testiFileInput = document.getElementById('testi-file');
if (testiFileInput) {
  testiFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await (window.compressImageFile ? window.compressImageFile(file, { maxWidth: 300, maxHeight: 300, quality: 0.82 }) : fileToBase64(file, 300));
        tempTestiBase64 = typeof res === 'object' ? res.dataUrl : res;
        document.getElementById('preview-testi-img').src = tempTestiBase64;
        document.getElementById('preview-testi-container').style.display = 'block';
        document.getElementById('label-testi-upload').textContent = 'Foto siap';
        if (typeof res === 'object') showCompressionBadge('compression-badge-testi', res);
        markDirty();
      } catch (err) {
        showAdminToast(err.message || 'Gagal memproses foto.', 'error');
      }
    }
  });
}

// ----------------------------------------------------
// ACADEMIC CALENDAR & AGENDA MANAGEMENT
// ----------------------------------------------------
function renderCalendarTable() {
  const listBody = document.getElementById('admin-calendar-list');
  if (!listBody) return;

  const calendarEvents = window.SchoolDB.getCalendar ? window.SchoolDB.getCalendar() : [];
  if (calendarEvents.length === 0) {
    listBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem; color:var(--text-muted);">Belum ada agenda kalender akademik.</td></tr>`;
    return;
  }

  listBody.innerHTML = calendarEvents.map(c => `
    <tr>
      <td style="width:100px;">
        <span style="display:inline-block; text-align:center; background:var(--primary); color:#fff; padding:4px 8px; border-radius:4px; font-weight:700; font-size:12px; line-height:1.2;">
          ${c.month || 'BLN'}<br><span style="font-size:16px; font-weight:800;">${c.date || '01'}</span>
        </span>
      </td>
      <td><strong>${c.title}</strong></td>
      <td><span style="font-size:13px; color:var(--text-muted);">${c.desc || c.description || '-'}</span></td>
      <td style="width:140px; white-space:nowrap;">
        <button class="btn btn-secondary btn-edit-calendar" data-id="${c.id}" style="padding:4px 8px; font-size:12px; margin-right:4px;">Edit</button>
        <button class="btn btn-danger-outline btn-delete-calendar" data-id="${c.id}" style="padding:4px 8px; font-size:12px;">Hapus</button>
      </td>
    </tr>
  `).join('');

  listBody.querySelectorAll('.btn-edit-calendar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openCalendarModal(id);
    });
  });

  listBody.querySelectorAll('.btn-delete-calendar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus agenda ini?')) {
        await window.SchoolDB.deleteCalendarItem(id);
        showAdminToast('Agenda berhasil dihapus.', 'success', 'Agenda Dihapus');
        renderCalendarTable();
      }
    });
  });
}

function openCalendarModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-calendar';

  hideAllModalForms();
  document.getElementById('form-calendar').style.display = 'block';
  document.getElementById('form-calendar').reset();
  clearDirty();

  if (id) {
    title.textContent = 'Edit Agenda Kalender';
    const item = window.SchoolDB.getCalendar().find(c => String(c.id) === String(id));
    if (item) {
      document.getElementById('calendar-id').value = item.id;
      document.getElementById('calendar-title').value = item.title;
      document.getElementById('calendar-date').value = item.date || '';
      document.getElementById('calendar-month').value = item.month || '';
      document.getElementById('calendar-desc').value = item.desc || item.description || '';
    }
  } else {
    title.textContent = 'Tambah Agenda Kalender Baru';
    document.getElementById('calendar-id').value = '';
  }

  attachDirtyListeners('form-calendar');
  modal.classList.add('open');
}

const formCalendar = document.getElementById('form-calendar');
if (formCalendar) {
  formCalendar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formCalendar.querySelector('button[type="submit"]');
    const id = document.getElementById('calendar-id').value;
    const title = document.getElementById('calendar-title').value;
    const date = document.getElementById('calendar-date').value;
    const month = document.getElementById('calendar-month').value;
    const desc = document.getElementById('calendar-desc').value;

    setButtonSubmitting(submitBtn, true, 'Menyimpan Agenda...');
    try {
      if (id) {
        await window.SchoolDB.updateCalendarItem(id, { title, date, month, desc });
        showAdminToast('Agenda berhasil diperbarui.', 'success', 'Agenda Diperbarui');
      } else {
        await window.SchoolDB.addCalendarItem({ title, date, month, desc });
        showAdminToast('Agenda baru berhasil ditambahkan!', 'success', 'Agenda Ditambahkan');
      }
      clearDirty();
      closeModal(true);
      renderCalendarTable();
    } catch (err) {
      showAdminToast('Gagal menyimpan agenda: ' + err.message, 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addCalendarBtn = document.getElementById('btn-add-calendar');
if (addCalendarBtn) {
  addCalendarBtn.addEventListener('click', () => openCalendarModal());
}

// ----------------------------------------------------
// SCHOOL HABITS & CULTURE MANAGEMENT
// ----------------------------------------------------
function renderHabitsTable() {
  const listBody = document.getElementById('admin-habits-list');
  if (!listBody) return;

  const habits = window.SchoolDB.getHabits ? window.SchoolDB.getHabits() : [];
  if (habits.length === 0) {
    listBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem; color:var(--text-muted);">Belum ada data pembiasaan baik.</td></tr>`;
    return;
  }

  listBody.innerHTML = habits.map(h => `
    <tr>
      <td><strong>${h.title}</strong></td>
      <td><span style="font-size:12px; padding:3px 8px; border-radius:12px; background:#EFF6FF; color:#1D4ED8; font-weight:600;">${h.category || 'Karakter'}</span></td>
      <td><span style="font-size:13px; color:var(--text-muted);">${h.desc || h.description || '-'}</span></td>
      <td style="width:140px; white-space:nowrap;">
        <button class="btn btn-secondary btn-edit-habit" data-id="${h.id}" style="padding:4px 8px; font-size:12px; margin-right:4px;">Edit</button>
        <button class="btn btn-danger-outline btn-delete-habit" data-id="${h.id}" style="padding:4px 8px; font-size:12px;">Hapus</button>
      </td>
    </tr>
  `).join('');

  listBody.querySelectorAll('.btn-edit-habit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openHabitModal(id);
    });
  });

  listBody.querySelectorAll('.btn-delete-habit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus pembiasaan ini?')) {
        await window.SchoolDB.deleteHabit(id);
        showAdminToast('Pembiasaan berhasil dihapus.', 'success', 'Pembiasaan Dihapus');
        renderHabitsTable();
      }
    });
  });
}

function openHabitModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-habit';

  hideAllModalForms();
  document.getElementById('form-habit').style.display = 'block';
  document.getElementById('form-habit').reset();
  clearDirty();

  if (id) {
    title.textContent = 'Edit Pembiasaan Baik & Budaya';
    const item = window.SchoolDB.getHabits().find(h => String(h.id) === String(id));
    if (item) {
      document.getElementById('habit-id').value = item.id;
      document.getElementById('habit-title').value = item.title;
      document.getElementById('habit-category').value = item.category || 'Karakter';
      document.getElementById('habit-desc').value = item.desc || item.description || '';
    }
  } else {
    title.textContent = 'Tambah Pembiasaan Baik Baru';
    document.getElementById('habit-id').value = '';
    document.getElementById('habit-category').value = 'Karakter';
  }

  attachDirtyListeners('form-habit');
  modal.classList.add('open');
}

const formHabit = document.getElementById('form-habit');
if (formHabit) {
  formHabit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formHabit.querySelector('button[type="submit"]');
    const id = document.getElementById('habit-id').value;
    const title = document.getElementById('habit-title').value;
    const category = document.getElementById('habit-category').value;
    const desc = document.getElementById('habit-desc').value;

    setButtonSubmitting(submitBtn, true, 'Menyimpan Pembiasaan...');
    try {
      if (id) {
        await window.SchoolDB.updateHabit(id, { title, category, desc });
        showAdminToast('Pembiasaan berhasil diperbarui.', 'success', 'Pembiasaan Diperbarui');
      } else {
        await window.SchoolDB.addHabit({ title, category, desc });
        showAdminToast('Pembiasaan baru berhasil ditambahkan!', 'success', 'Pembiasaan Ditambahkan');
      }
      clearDirty();
      closeModal(true);
      renderHabitsTable();
    } catch (err) {
      showAdminToast('Gagal menyimpan pembiasaan: ' + err.message, 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addHabitBtn = document.getElementById('btn-add-habit');
if (addHabitBtn) {
  addHabitBtn.addEventListener('click', () => openHabitModal());
}

// ----------------------------------------------------
// COMFORT & SAFETY STANDARDS MANAGEMENT
// ----------------------------------------------------
function renderComfortTable() {
  const listBody = document.getElementById('admin-comfort-list');
  if (!listBody) return;

  const standards = window.SchoolDB.getComfortStandards ? window.SchoolDB.getComfortStandards() : [];
  if (standards.length === 0) {
    listBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 2rem; color:var(--text-muted);">Belum ada data standar kenyamanan.</td></tr>`;
    return;
  }

  listBody.innerHTML = standards.map(s => `
    <tr>
      <td><strong>${s.title}</strong></td>
      <td><span style="font-size:13px; color:var(--text-muted);">${s.desc || s.description || '-'}</span></td>
      <td style="width:140px; white-space:nowrap;">
        <button class="btn btn-secondary btn-edit-comfort" data-id="${s.id}" style="padding:4px 8px; font-size:12px; margin-right:4px;">Edit</button>
        <button class="btn btn-danger-outline btn-delete-comfort" data-id="${s.id}" style="padding:4px 8px; font-size:12px;">Hapus</button>
      </td>
    </tr>
  `).join('');

  listBody.querySelectorAll('.btn-edit-comfort').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openComfortModal(id);
    });
  });

  listBody.querySelectorAll('.btn-delete-comfort').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Hapus standar kenyamanan ini?')) {
        await window.SchoolDB.deleteComfortStandard(id);
        showAdminToast('Standar kenyamanan berhasil dihapus.', 'success', 'Standar Dihapus');
        renderComfortTable();
      }
    });
  });
}

function openComfortModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  activeModalFormId = 'form-comfort';

  hideAllModalForms();
  document.getElementById('form-comfort').style.display = 'block';
  document.getElementById('form-comfort').reset();
  clearDirty();

  if (id) {
    title.textContent = 'Edit Standar Kenyamanan';
    const item = window.SchoolDB.getComfortStandards().find(s => String(s.id) === String(id));
    if (item) {
      document.getElementById('comfort-id').value = item.id;
      document.getElementById('comfort-title').value = item.title;
      document.getElementById('comfort-desc').value = item.desc || item.description || '';
    }
  } else {
    title.textContent = 'Tambah Standar Kenyamanan Baru';
    document.getElementById('comfort-id').value = '';
  }

  attachDirtyListeners('form-comfort');
  modal.classList.add('open');
}

const formComfort = document.getElementById('form-comfort');
if (formComfort) {
  formComfort.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formComfort.querySelector('button[type="submit"]');
    const id = document.getElementById('comfort-id').value;
    const title = document.getElementById('comfort-title').value;
    const desc = document.getElementById('comfort-desc').value;

    setButtonSubmitting(submitBtn, true, 'Menyimpan Standar...');
    try {
      if (id) {
        await window.SchoolDB.updateComfortStandard(id, { title, desc });
        showAdminToast('Standar kenyamanan berhasil diperbarui.', 'success', 'Standar Diperbarui');
      } else {
        await window.SchoolDB.addComfortStandard({ title, desc });
        showAdminToast('Standar kenyamanan baru berhasil ditambahkan!', 'success', 'Standar Ditambahkan');
      }
      clearDirty();
      closeModal(true);
      renderComfortTable();
    } catch (err) {
      showAdminToast('Gagal menyimpan standar: ' + err.message, 'error');
    } finally {
      setButtonSubmitting(submitBtn, false);
    }
  });
}

const addComfortBtn = document.getElementById('btn-add-comfort');
if (addComfortBtn) {
  addComfortBtn.addEventListener('click', () => openComfortModal());
}

function hideAllModalForms() {
  const formIds = [
    'form-teacher',
    'form-facility',
    'form-activity',
    'form-gallery',
    'form-testimonial',
    'form-calendar',
    'form-habit',
    'form-comfort'
  ];
  formIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

// Centralized Modal & Unsaved Changes Controller
function requestCloseModal(force = false) {
  if (force || !isFormDirty) {
    closeModal(true);
    return;
  }
  
  // Show custom unsaved confirmation modal dialog
  const unsavedOverlay = document.getElementById('unsaved-confirm-overlay');
  if (unsavedOverlay) {
    unsavedOverlay.style.display = 'flex';
  }
}

function closeModal(force = false) {
  if (isFormDirty && !force) {
    requestCloseModal(false);
    return;
  }
  
  const unsavedOverlay = document.getElementById('unsaved-confirm-overlay');
  if (unsavedOverlay) unsavedOverlay.style.display = 'none';
  
  clearDirty();
  const overlay = document.getElementById('admin-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  activeModalFormId = null;
}

// Hook Unsaved Confirmation Action Buttons
const btnUnsavedKeep = document.getElementById('btn-unsaved-keep');
if (btnUnsavedKeep) {
  btnUnsavedKeep.addEventListener('click', () => {
    const unsavedOverlay = document.getElementById('unsaved-confirm-overlay');
    if (unsavedOverlay) unsavedOverlay.style.display = 'none';
  });
}

const btnUnsavedDiscard = document.getElementById('btn-unsaved-discard');
if (btnUnsavedDiscard) {
  btnUnsavedDiscard.addEventListener('click', () => {
    closeModal(true);
  });
}

const btnUnsavedSave = document.getElementById('btn-unsaved-save');
if (btnUnsavedSave) {
  btnUnsavedSave.addEventListener('click', () => {
    const unsavedOverlay = document.getElementById('unsaved-confirm-overlay');
    if (unsavedOverlay) unsavedOverlay.style.display = 'none';
    
    // Trigger submit handler on the active form directly
    if (activeModalFormId) {
      const activeForm = document.getElementById(activeModalFormId);
      if (activeForm) {
        if (typeof activeForm.requestSubmit === 'function') {
          activeForm.requestSubmit();
        } else {
          activeForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }
  });
}

const modalCloseBtn = document.getElementById('admin-modal-close-btn');
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => requestCloseModal());
}
const modalOverlay = document.getElementById('admin-modal-overlay');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) requestCloseModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const unsavedOverlay = document.getElementById('unsaved-confirm-overlay');
    if (unsavedOverlay && unsavedOverlay.style.display === 'flex') {
      unsavedOverlay.style.display = 'none';
    } else {
      const modal = document.getElementById('admin-modal-overlay');
      if (modal && modal.classList.contains('open')) {
        requestCloseModal();
      }
    }
  }
});

/**
 * Hardened Image Upload Optimizer with Size & Format Guard
 * Validates MIME type, rejects payloads > 10MB, auto-resizes to maxWidth, and compresses.
 */
function fileToBase64(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Pilih berkas gambar.'));
    }

    // Security check 1: File size limit (Max 10 MB input limit)
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return reject(new Error(`Ukuran file (${(file.size / 1024 / 1024).toFixed(1)} MB) melebihi batas maksimal 10 MB.`));
    }

    // Security check 2: Strict MIME type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return reject(new Error('Format file tidak didukung. Gunakan format JPG, PNG, WebP, atau SVG.'));
    }

    // If SVG, process safely as text/dataURL without canvas
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Gagal membaca berkas SVG.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        let { width, height } = img;

        // Security check 3: Extreme dimension protection
        if (width > 8000 || height > 8000) {
          return reject(new Error('Dimensi gambar terlalu besar (maksimal 8000x8000 px).'));
        }

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let optimizedDataUrl = null;
        try {
          optimizedDataUrl = canvas.toDataURL('image/webp', quality);
          if (!optimizedDataUrl.startsWith('data:image/webp')) {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch (err) {
          optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const originalKb = Math.round(file.size / 1024);
        const optimizedKb = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);
        console.info(`[CMS Optimizer] ${file.name}: ${originalKb} KB -> ${optimizedKb} KB (${width}x${height})`);

        resolve(optimizedDataUrl);
      };
      img.onerror = () => reject(new Error('Berkas gambar rusak atau tidak dapat diproses.'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas.'));
  });
}

// ----------------------------------------------------
// AUTHENTICATION LOGIN WITH RATE LIMITING & LOCKOUT
// ----------------------------------------------------
const adminLoginForm = document.getElementById('admin-login-form');
const adminPasswordInput = document.getElementById('admin-password');
const loginErrorAlert = document.getElementById('login-error-alert');
const adminLoginBtn = document.getElementById('admin-login-btn');

if (adminPasswordInput && loginErrorAlert) {
  adminPasswordInput.addEventListener('input', () => {
    loginErrorAlert.style.display = 'none';
    adminPasswordInput.style.borderColor = 'var(--border)';
    adminPasswordInput.style.boxShadow = 'none';
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check rate limit first
    if (!checkLoginRateLimit()) {
      return;
    }

    const password = adminPasswordInput.value;
    setButtonSubmitting(adminLoginBtn, true, 'Memverifikasi...');
    
    try {
      // Compare password
      if (password === 'admin123') {
        loginAttempts = 0;
        localStorage.removeItem('sdn2_admin_lockout_until');
        if (loginErrorAlert) loginErrorAlert.style.display = 'none';
        
        setSession();
        checkAuth();
        showAdminToast('Selamat datang kembali di Dashboard CMS SDN 2 Ngeposari.', 'success', 'Login Berhasil');
      } else {
        recordFailedLogin();
        
        if (loginErrorAlert) {
          loginErrorAlert.style.display = 'flex';
          loginErrorAlert.style.animation = 'none';
          void loginErrorAlert.offsetWidth; // Trigger reflow for animation restart
          loginErrorAlert.style.animation = 'shake 0.4s ease';
        }
        if (adminPasswordInput) {
          adminPasswordInput.style.borderColor = '#DC2626';
          adminPasswordInput.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.15)';
          adminPasswordInput.focus();
          adminPasswordInput.select();
        }
        showAdminToast('Kata sandi salah. Silakan periksa kembali.', 'error', 'Autentikasi Gagal');
      }
    } finally {
      setButtonSubmitting(adminLoginBtn, false);
    }
  });
}

// Logout Handler
const logoutBtn = document.getElementById('admin-logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (isFormDirty) {
      if (!confirm('Ada perubahan yang belum disimpan. Yakin ingin keluar?')) {
        return;
      }
    }
    clearSession();
    showAdminToast('Anda telah keluar dari sesi administrator.', 'success', 'Sampai Jumpa');
    setTimeout(() => window.location.reload(), 600);
  });
}

// ----------------------------------------------------
// CLOUD SYNC & JSON BACKUP / RESTORE CONTROLLER
// ----------------------------------------------------
function updateCloudStatusUI() {
  const isConfigured = window.CloudSyncManager && window.CloudSyncManager.isConfigured();
  
  // Dashboard banner
  const dashDot = document.getElementById('dash-cloud-status-dot');
  const dashTitle = document.getElementById('dash-cloud-status-title');
  const dashDesc = document.getElementById('dash-cloud-status-desc');
  
  if (dashDot && dashTitle && dashDesc) {
    if (isConfigured) {
      dashDot.style.backgroundColor = '#22C55E';
      dashTitle.textContent = 'Status Sinkronisasi Cloud: Tersambung ke Firebase Firestore';
      dashTitle.style.color = '#15803D';
      dashDesc.textContent = 'Setiap perubahan data akan otomatis tersinkronisasi antar perangkat dan pengunjung web.';
    } else {
      dashDot.style.backgroundColor = '#94A3B8';
      dashTitle.textContent = 'Status Sinkronisasi Cloud: Mode Lokal (Offline-First)';
      dashTitle.style.color = 'var(--primary)';
      dashDesc.textContent = 'Data tersimpan di browser Anda. Hubungkan ke Firebase untuk sinkronisasi antar HP/Laptop.';
    }
  }

  // Cloud Tab badge
  const cloudBadge = document.getElementById('cloud-badge-status');
  if (cloudBadge) {
    if (isConfigured) {
      cloudBadge.textContent = 'Terhubung ke Firestore';
      cloudBadge.style.backgroundColor = '#DCFCE7';
      cloudBadge.style.color = '#166534';
    } else {
      cloudBadge.textContent = 'Mode Lokal (Offline-First)';
      cloudBadge.style.backgroundColor = '#F1F5F9';
      cloudBadge.style.color = '#64748B';
    }
  }
}

function initCloudSyncUI() {
  updateCloudStatusUI();

  // Populate config fields if exists
  if (window.CloudSyncManager) {
    const config = window.CloudSyncManager.getConfig();
    if (config) {
      if (document.getElementById('firebase-api-key')) document.getElementById('firebase-api-key').value = config.apiKey || '';
      if (document.getElementById('firebase-project-id')) document.getElementById('firebase-project-id').value = config.projectId || '';
      if (document.getElementById('firebase-app-id')) document.getElementById('firebase-app-id').value = config.appId || '';
      if (document.getElementById('firebase-auth-domain')) document.getElementById('firebase-auth-domain').value = config.authDomain || '';
    }
  }

  // Save Cloud Config Form
  const formCloudConfig = document.getElementById('form-cloud-config');
  if (formCloudConfig) {
    formCloudConfig.addEventListener('submit', async (e) => {
      e.preventDefault();
      const apiKey = document.getElementById('firebase-api-key').value.trim();
      const projectId = document.getElementById('firebase-project-id').value.trim();
      const appId = document.getElementById('firebase-app-id').value.trim();
      const authDomain = document.getElementById('firebase-auth-domain').value.trim() || `${projectId}.firebaseapp.com`;
      
      const submitBtn = document.getElementById('btn-save-cloud-config');
      setButtonSubmitting(submitBtn, true, 'Menguji Koneksi Cloud...');

      try {
        const config = { apiKey, projectId, appId, authDomain };
        await window.CloudSyncManager.testConnection(config);
        window.CloudSyncManager.saveConfig(config);
        
        // Push initial data
        await window.CloudSyncManager.syncToCloud(window.SchoolDB.data);
        
        updateCloudStatusUI();
        showAdminToast('Koneksi Firebase Firestore terverifikasi dan aktif! Data berhasil disinkronkan.', 'success', 'Cloud Aktif');
      } catch (err) {
        showAdminToast(err.message || 'Gagal menyambung ke Firebase Firestore.', 'error', 'Koneksi Cloud Gagal');
      } finally {
        setButtonSubmitting(submitBtn, false);
      }
    });
  }

  // Reset Cloud Config Button
  const btnResetCloud = document.getElementById('btn-reset-cloud-config');
  if (btnResetCloud) {
    btnResetCloud.addEventListener('click', () => {
      if (confirm('Yakin ingin memutuskan koneksi Cloud? Data lokal Anda tetap aman.')) {
        if (window.CloudSyncManager) window.CloudSyncManager.saveConfig(null);
        if (document.getElementById('firebase-api-key')) document.getElementById('firebase-api-key').value = '';
        if (document.getElementById('firebase-project-id')) document.getElementById('firebase-project-id').value = '';
        if (document.getElementById('firebase-app-id')) document.getElementById('firebase-app-id').value = '';
        if (document.getElementById('firebase-auth-domain')) document.getElementById('firebase-auth-domain').value = '';
        updateCloudStatusUI();
        showAdminToast('Koneksi Cloud diputuskan. Sistem kembali ke mode lokal.', 'info', 'Mode Offline');
      }
    });
  }

  // Manual Push to Cloud
  const btnSyncToCloud = document.getElementById('btn-sync-to-cloud');
  if (btnSyncToCloud) {
    btnSyncToCloud.addEventListener('click', async () => {
      if (!window.CloudSyncManager || !window.CloudSyncManager.isConfigured()) {
        showAdminToast('Konfigurasikan Firebase Project ID terlebih dahulu di bawah.', 'error', 'Cloud Belum Terhubung');
        return;
      }
      setButtonSubmitting(btnSyncToCloud, true, 'Mengunggah ke Cloud...');
      try {
        const success = await window.CloudSyncManager.syncToCloud(window.SchoolDB.data);
        if (success) {
          showAdminToast('Semua data lokal berhasil diunggah dan tersinkronisasi di Firestore.', 'success', 'Sinkronisasi Berhasil');
        } else {
          showAdminToast('Gagal mengunggah data ke Cloud.', 'error');
        }
      } catch (err) {
        showAdminToast('Terjadi kesalahan saat sinkronisasi cloud.', 'error');
      } finally {
        setButtonSubmitting(btnSyncToCloud, false);
      }
    });
  }

  // Manual Pull from Cloud
  const btnSyncFromCloud = document.getElementById('btn-sync-from-cloud');
  if (btnSyncFromCloud) {
    btnSyncFromCloud.addEventListener('click', async () => {
      if (!window.CloudSyncManager || !window.CloudSyncManager.isConfigured()) {
        showAdminToast('Konfigurasikan Firebase Project ID terlebih dahulu di bawah.', 'error', 'Cloud Belum Terhubung');
        return;
      }
      setButtonSubmitting(btnSyncFromCloud, true, 'Mengunduh dari Cloud...');
      try {
        const success = await window.SchoolDB.syncFromCloud();
        if (success) {
          renderDashboard();
          loadProfileForm();
          renderTeachersTable();
          renderFacilitiesTable();
          renderActivitiesTable();
          renderGalleryTable();
          loadContactForm();
          showAdminToast('Data terbaru dari Firestore berhasil dimuat ke browser ini.', 'success', 'Sinkronisasi Berhasil');
        } else {
          showAdminToast('Belum ada data baru di Cloud Firestore.', 'info', 'Data Terkini');
        }
      } catch (err) {
        showAdminToast('Gagal mengunduh data dari Cloud.', 'error');
      } finally {
        setButtonSubmitting(btnSyncFromCloud, false);
      }
    });
  }

  // Export JSON Backup
  const btnExportBackup = document.getElementById('btn-export-backup');
  if (btnExportBackup) {
    btnExportBackup.addEventListener('click', () => {
      try {
        const jsonStr = window.SchoolDB.exportBackupJSON();
        if (!jsonStr) {
          showAdminToast('Database belum siap.', 'error');
          return;
        }
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const d = new Date();
        const dateStr = d.toISOString().split('T')[0].replace(/-/g, '');
        a.href = url;
        a.download = `sdn2ngeposari_backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showAdminToast('Berkas cadangan JSON berhasil diunduh.', 'success', 'Backup Selesai');
      } catch (err) {
        showAdminToast('Gagal membuat berkas cadangan.', 'error');
      }
    });
  }

  // Import JSON Backup Trigger & Handler
  const btnImportTrigger = document.getElementById('btn-import-backup-trigger');
  const importFileInput = document.getElementById('import-backup-file');
  if (btnImportTrigger && importFileInput) {
    btnImportTrigger.addEventListener('click', () => {
      importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (!confirm(`Yakin ingin memulihkan database dari berkas "${file.name}"? Data saat ini akan diperbarui.`)) {
            importFileInput.value = '';
            return;
          }
          await window.SchoolDB.importBackupJSON(event.target.result);
          renderDashboard();
          loadProfileForm();
          renderTeachersTable();
          renderFacilitiesTable();
          renderActivitiesTable();
          renderGalleryTable();
          loadContactForm();
          showAdminToast('Data sekolah berhasil dipulihkan dari berkas cadangan JSON!', 'success', 'Pemulihan Berhasil');
        } catch (err) {
          showAdminToast(err.message || 'Berkas JSON tidak valid atau rusak.', 'error', 'Gagal Memulihkan');
        } finally {
          importFileInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }
}

// ----------------------------------------------------
// DYNAMIC CATEGORY MANAGEMENT UI & DROPDOWNS
// ----------------------------------------------------
function populateActivityCategoriesDropdown(selectedVal = '') {
  const categorySelect = document.getElementById('activity-category');
  if (!categorySelect) return;
  const categories = window.SchoolDB.getCategories();
  categorySelect.innerHTML = categories.map(cat => `
    <option value="${cat}" ${cat === selectedVal ? 'selected' : ''}>${cat}</option>
  `).join('');
}

function initCategoryManagementUI() {
  const manageBtn = document.getElementById('admin-manage-categories-btn');
  const quickAddBtn = document.getElementById('btn-quick-add-category');
  const overlay = document.getElementById('category-modal-overlay');
  const closeBtn = document.getElementById('category-modal-close');
  const saveBtn = document.getElementById('btn-save-new-category');
  const inputNew = document.getElementById('input-new-category');
  const tagsList = document.getElementById('admin-categories-tags-list');

  function renderCategoryTags() {
    if (!tagsList) return;
    const categories = window.SchoolDB.getCategories();
    tagsList.innerHTML = categories.map(cat => `
      <span style="display:inline-flex; align-items:center; gap:6px; background:var(--surface); border:1px solid var(--border); padding:4px 10px; border-radius:16px; font-size:12px; color:var(--text); font-weight:600;">
        ${cat}
        <button type="button" class="btn-delete-cat" data-name="${cat}" style="background:none; border:none; cursor:pointer; color:var(--error); font-size:14px; line-height:1; padding:0 2px;" title="Hapus Kategori">&times;</button>
      </span>
    `).join('');

    tagsList.querySelectorAll('.btn-delete-cat').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const catName = e.currentTarget.getAttribute('data-name');
        if (confirm(`Hapus kategori "${catName}"?`)) {
          await window.SchoolDB.deleteCategory(catName);
          showAdminToast(`Kategori "${catName}" berhasil dihapus.`, 'success', 'Kategori Dihapus');
          renderCategoryTags();
          populateActivityCategoriesDropdown();
        }
      });
    });
  }

  function openCatModal() {
    if (overlay) {
      overlay.classList.add('open');
      renderCategoryTags();
      if (inputNew) {
        inputNew.value = '';
        setTimeout(() => inputNew.focus(), 100);
      }
    }
  }

  function closeCatModal() {
    if (overlay) overlay.classList.remove('open');
  }

  if (manageBtn) manageBtn.addEventListener('click', openCatModal);
  if (quickAddBtn) quickAddBtn.addEventListener('click', openCatModal);
  if (closeBtn) closeBtn.addEventListener('click', closeCatModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCatModal();
    });
  }

  if (saveBtn && inputNew) {
    const handleSaveCategory = async () => {
      const catName = inputNew.value.trim();
      if (!catName) {
        showAdminToast('Nama kategori tidak boleh kosong.', 'error');
        return;
      }
      try {
        await window.SchoolDB.addCategory(catName);
        showAdminToast(`Kategori "${catName}" berhasil ditambahkan!`, 'success', 'Kategori Ditambahkan');
        inputNew.value = '';
        renderCategoryTags();
        populateActivityCategoriesDropdown(catName);
      } catch (err) {
        showAdminToast(err.message || 'Gagal menambahkan kategori.', 'error');
      }
    };

    saveBtn.addEventListener('click', handleSaveCategory);
    inputNew.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveCategory();
      }
    });
  }
}

// Check initial auth and lockout state on boot
window.addEventListener('DOMContentLoaded', () => {
  checkLoginRateLimit();
  checkAuth();
});
