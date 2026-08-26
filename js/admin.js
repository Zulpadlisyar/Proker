// DESIGN.md Compliance - CMS Admin Logic for SDN 2 Ngeposari Website
// Manages authentication, sidebar panels, dashboard counters, and CRUD editors.

let tempLogoBase64 = null;
let tempHeroBase64 = null;
let tempTeacherBase64 = null;
let tempFacilityBase64 = null;
let tempActivityBase64 = null;
let tempGalleryBase64 = null;

// Compliance Toast Notification
function showAdminToast(message, type = 'success') {
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

// Check Authentication
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
  const loginScreen = document.getElementById('admin-login-screen');
  const mainInterface = document.getElementById('admin-main-interface');
  
  if (isLoggedIn) {
    loginScreen.style.display = 'none';
    mainInterface.style.display = 'block';
    initAdminPanel();
  } else {
    loginScreen.style.display = 'block';
    mainInterface.style.display = 'none';
  }
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
  loadContactForm();
  
  const navBtns = document.querySelectorAll('.admin-nav-btn');
  const panes = document.querySelectorAll('.admin-tab-pane');
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      navBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// Render Dashboard stats
function renderDashboard() {
  const profile = window.SchoolDB.getProfile();
  const teachers = window.SchoolDB.getTeachers();
  const facilities = window.SchoolDB.getFacilities();
  const activities = window.SchoolDB.getActivities();
  const gallery = window.SchoolDB.getGallery();
  
  if (document.getElementById('stat-teachers-count')) {
    document.getElementById('stat-teachers-count').textContent = teachers.length;
  }
  document.getElementById('stat-facilities-count').textContent = facilities.length;
  document.getElementById('stat-activities-count').textContent = activities.length;
  document.getElementById('stat-gallery-count').textContent = gallery.length;
  
  document.getElementById('dash-school-name').textContent = profile.name;
  document.getElementById('dash-school-tagline').textContent = profile.tagline;
}

// Reset DB
document.getElementById('admin-reset-db-btn').addEventListener('click', async () => {
  if (confirm('Apakah Anda yakin ingin mereset seluruh database konten? Semua perubahan data akan hilang.')) {
    await window.SchoolDB.reset();
    showAdminToast('Informasi berhasil diperbarui.', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }
});

// Load Profile
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
}

// File Readers
document.getElementById('upload-logo-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      tempLogoBase64 = await fileToBase64(file);
      document.getElementById('preview-logo-img').src = tempLogoBase64;
      document.getElementById('preview-logo-container').style.display = 'block';
    } catch (err) {
      showAdminToast('Gagal memproses berkas logo.', 'error');
    }
  }
});

document.getElementById('upload-hero-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      tempHeroBase64 = await fileToBase64(file);
      document.getElementById('preview-hero-img').src = tempHeroBase64;
      document.getElementById('preview-hero-container').style.display = 'block';
    } catch (err) {
      showAdminToast('Gagal memproses berkas banner.', 'error');
    }
  }
});

// Submit Profile Form
document.getElementById('form-edit-profile').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('profile-name').value;
  const tagline = document.getElementById('profile-tagline').value;
  const description = document.getElementById('profile-description').value;
  const history = document.getElementById('profile-history').value;
  const vision = document.getElementById('profile-vision').value;
  const missions = document.getElementById('profile-missions').value.split('\n').map(m => m.trim()).filter(m => m.length > 0);
  
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
  
  showAdminToast('Informasi berhasil diperbarui.', 'success');
  renderDashboard();
});

// Teachers CRUD
function renderTeachersTable() {
  const teachers = window.SchoolDB.getTeachers();
  const listBody = document.getElementById('admin-teachers-list');
  if (!listBody) return;
  
  if (teachers.length === 0) {
    listBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada data guru yang dimasukkan.</td></tr>';
    return;
  }
  
  listBody.innerHTML = teachers.map(t => `
    <tr>
      <td><img src="${t.image}" class="admin-thumb" alt="${t.name}"></td>
      <td><strong>${t.name}</strong></td>
      <td>${t.role}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon btn-edit-teacher" data-id="${t.id}" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-teacher" data-id="${t.id}" title="Hapus">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  listBody.querySelectorAll('.btn-edit-teacher').forEach(btn => {
    btn.addEventListener('click', () => openTeacherModal(btn.getAttribute('data-id')));
  });
  
  listBody.querySelectorAll('.btn-delete-teacher').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Hapus data guru ini?')) {
        await window.SchoolDB.deleteTeacher(btn.getAttribute('data-id'));
        showAdminToast('Informasi berhasil diperbarui.', 'success');
        renderTeachersTable();
        renderDashboard();
      }
    });
  });
}

document.getElementById('teacher-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      tempTeacherBase64 = await fileToBase64(file);
      document.getElementById('preview-teacher-img').src = tempTeacherBase64;
      document.getElementById('preview-teacher-container').style.display = 'block';
      document.getElementById('label-teacher-upload').textContent = 'Gambar siap';
    } catch (err) {
      showAdminToast('Gagal memproses berkas.', 'error');
    }
  }
});

function openTeacherModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  
  document.getElementById('form-teacher').style.display = 'block';
  document.getElementById('form-facility').style.display = 'none';
  document.getElementById('form-activity').style.display = 'none';
  document.getElementById('form-gallery').style.display = 'none';
  
  document.getElementById('form-teacher').reset();
  document.getElementById('preview-teacher-container').style.display = 'none';
  document.getElementById('preview-teacher-img').src = '';
  document.getElementById('label-teacher-upload').textContent = 'Klik untuk pilih gambar';
  tempTeacherBase64 = null;
  
  if (id) {
    title.textContent = 'Edit Data Guru';
    const teacher = window.SchoolDB.getTeachers().find(t => t.id === id);
    if (teacher) {
      document.getElementById('teacher-id').value = teacher.id;
      document.getElementById('teacher-name').value = teacher.name;
      document.getElementById('teacher-role').value = teacher.role;
      if (teacher.image) {
        document.getElementById('preview-teacher-img').src = teacher.image;
        document.getElementById('preview-teacher-container').style.display = 'block';
        tempTeacherBase64 = teacher.image;
      }
    }
  } else {
    title.textContent = 'Tambah Guru Baru';
    document.getElementById('teacher-id').value = '';
  }
  
  modal.classList.add('open');
}

document.getElementById('form-teacher').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('teacher-id').value;
  const name = document.getElementById('teacher-name').value;
  const role = document.getElementById('teacher-role').value;
  
  if (id) {
    await window.SchoolDB.updateTeacher(id, { name, role, image: tempTeacherBase64 });
  } else {
    await window.SchoolDB.addTeacher({ name, role, image: tempTeacherBase64 });
  }
  
  showAdminToast('Informasi berhasil diperbarui.', 'success');
  closeModal();
  renderTeachersTable();
  renderDashboard();
});

if (document.getElementById('admin-add-teacher-btn')) {
  document.getElementById('admin-add-teacher-btn').addEventListener('click', () => openTeacherModal());
}

// Facilities CRUD
function renderFacilitiesTable() {
  const facilities = window.SchoolDB.getFacilities();
  const listBody = document.getElementById('admin-facilities-list');
  
  if (facilities.length === 0) {
    listBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada fasilitas yang dimasukkan.</td></tr>';
    return;
  }
  
  listBody.innerHTML = facilities.map(f => `
    <tr>
      <td><img src="${f.image}" class="admin-thumb" alt="${f.name}"></td>
      <td><strong>${f.name}</strong></td>
      <td>${f.description.substring(0, 80)}${f.description.length > 80 ? '...' : ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon btn-edit-facility" data-id="${f.id}" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-facility" data-id="${f.id}" title="Hapus">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  listBody.querySelectorAll('.btn-edit-facility').forEach(btn => {
    btn.addEventListener('click', () => openFacilityModal(btn.getAttribute('data-id')));
  });
  
  listBody.querySelectorAll('.btn-delete-facility').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Hapus fasilitas ini?')) {
        await window.SchoolDB.deleteFacility(btn.getAttribute('data-id'));
        showAdminToast('Informasi berhasil diperbarui.', 'success');
        renderFacilitiesTable();
        renderDashboard();
      }
    });
  });
}

document.getElementById('facility-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      tempFacilityBase64 = await fileToBase64(file);
      document.getElementById('preview-facility-img').src = tempFacilityBase64;
      document.getElementById('preview-facility-container').style.display = 'block';
      document.getElementById('label-facility-upload').textContent = 'Gambar siap';
    } catch (err) {
      showAdminToast('Gagal memproses berkas.', 'error');
    }
  }
});

function openFacilityModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  
  document.getElementById('form-teacher').style.display = 'none';
  document.getElementById('form-facility').style.display = 'block';
  document.getElementById('form-activity').style.display = 'none';
  document.getElementById('form-gallery').style.display = 'none';
  
  document.getElementById('form-facility').reset();
  document.getElementById('preview-facility-container').style.display = 'none';
  document.getElementById('preview-facility-img').src = '';
  document.getElementById('label-facility-upload').textContent = 'Klik untuk pilih gambar';
  tempFacilityBase64 = null;
  
  if (id) {
    title.textContent = 'Edit Fasilitas';
    const facility = window.SchoolDB.getFacilities().find(f => f.id === id);
    if (facility) {
      document.getElementById('facility-id').value = facility.id;
      document.getElementById('facility-name').value = facility.name;
      document.getElementById('facility-desc').value = facility.description;
      if (facility.image) {
        document.getElementById('preview-facility-img').src = facility.image;
        document.getElementById('preview-facility-container').style.display = 'block';
        tempFacilityBase64 = facility.image;
      }
    }
  } else {
    title.textContent = 'Tambah Fasilitas Baru';
    document.getElementById('facility-id').value = '';
  }
  
  modal.classList.add('open');
}

document.getElementById('form-facility').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('facility-id').value;
  const name = document.getElementById('facility-name').value;
  const description = document.getElementById('facility-desc').value;
  
  if (id) {
    await window.SchoolDB.updateFacility(id, { name, description, image: tempFacilityBase64 });
  } else {
    await window.SchoolDB.addFacility({ name, description, image: tempFacilityBase64 });
  }
  
  showAdminToast('Informasi berhasil diperbarui.', 'success');
  closeModal();
  renderFacilitiesTable();
  renderDashboard();
});

document.getElementById('admin-add-facility-btn').addEventListener('click', () => openFacilityModal());

// Activities CRUD
function renderActivitiesTable() {
  const activities = window.SchoolDB.getActivities();
  const listBody = document.getElementById('admin-activities-list');
  
  if (activities.length === 0) {
    listBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Belum ada berita kegiatan saat ini.</td></tr>';
    return;
  }
  
  listBody.innerHTML = activities.map(a => `
    <tr>
      <td><img src="${a.image}" class="admin-thumb" alt="${a.title}"></td>
      <td>${new Date(a.date).toLocaleDateString('id-ID')}</td>
      <td><strong>${a.title}</strong></td>
      <td>${a.excerpt.substring(0, 80)}${a.excerpt.length > 80 ? '...' : ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon btn-edit-activity" data-id="${a.id}" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-activity" data-id="${a.id}" title="Hapus">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  listBody.querySelectorAll('.btn-edit-activity').forEach(btn => {
    btn.addEventListener('click', () => openActivityModal(btn.getAttribute('data-id')));
  });
  
  listBody.querySelectorAll('.btn-delete-activity').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Hapus berita kegiatan ini?')) {
        await window.SchoolDB.deleteActivity(btn.getAttribute('data-id'));
        showAdminToast('Informasi berhasil diperbarui.', 'success');
        renderActivitiesTable();
        renderDashboard();
      }
    });
  });
}

document.getElementById('activity-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      tempActivityBase64 = await fileToBase64(file);
      document.getElementById('preview-activity-img').src = tempActivityBase64;
      document.getElementById('preview-activity-container').style.display = 'block';
      document.getElementById('label-activity-upload').textContent = 'Gambar siap';
    } catch (err) {
      showAdminToast('Gagal memproses berkas.', 'error');
    }
  }
});

function openActivityModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  
  document.getElementById('form-teacher').style.display = 'none';
  document.getElementById('form-facility').style.display = 'none';
  document.getElementById('form-activity').style.display = 'block';
  document.getElementById('form-gallery').style.display = 'none';
  
  document.getElementById('form-activity').reset();
  document.getElementById('preview-activity-container').style.display = 'none';
  document.getElementById('preview-activity-img').src = '';
  document.getElementById('label-activity-upload').textContent = 'Klik untuk pilih gambar';
  tempActivityBase64 = null;
  
  document.getElementById('activity-date').value = new Date().toISOString().split('T')[0];
  
  if (id) {
    title.textContent = 'Edit Kegiatan';
    const activity = window.SchoolDB.getActivities().find(a => a.id === id);
    if (activity) {
      document.getElementById('activity-id').value = activity.id;
      document.getElementById('activity-title').value = activity.title;
      document.getElementById('activity-date').value = activity.date;
      document.getElementById('activity-excerpt').value = activity.excerpt;
      document.getElementById('activity-content').value = activity.content;
      if (activity.image) {
        document.getElementById('preview-activity-img').src = activity.image;
        document.getElementById('preview-activity-container').style.display = 'block';
        tempActivityBase64 = activity.image;
      }
    }
  } else {
    title.textContent = 'Tambah Kegiatan Baru';
    document.getElementById('activity-id').value = '';
  }
  
  modal.classList.add('open');
}

document.getElementById('form-activity').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('activity-id').value;
  const title = document.getElementById('activity-title').value;
  const date = document.getElementById('activity-date').value;
  const excerpt = document.getElementById('activity-excerpt').value;
  const content = document.getElementById('activity-content').value;
  
  if (id) {
    await window.SchoolDB.updateActivity(id, { title, date, excerpt, content, image: tempActivityBase64 });
  } else {
    await window.SchoolDB.addActivity({ title, date, excerpt, content, image: tempActivityBase64 });
  }
  
  showAdminToast('Informasi berhasil diperbarui.', 'success');
  closeModal();
  renderActivitiesTable();
  renderDashboard();
});

document.getElementById('admin-add-activity-btn').addEventListener('click', () => openActivityModal());

// Gallery CRUD
function renderGalleryTable() {
  const gallery = window.SchoolDB.getGallery();
  const listBody = document.getElementById('admin-gallery-list');
  
  if (gallery.length === 0) {
    listBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color: var(--text-muted);">Belum ada dokumentasi yang ditampilkan.</td></tr>';
    return;
  }
  
  listBody.innerHTML = gallery.map(g => `
    <tr>
      <td><img src="${g.image}" class="admin-thumb" alt="${g.caption}"></td>
      <td><strong>${g.caption}</strong></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon btn-edit-gallery" data-id="${g.id}" title="Edit Caption">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-gallery" data-id="${g.id}" title="Hapus">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  listBody.querySelectorAll('.btn-edit-gallery').forEach(btn => {
    btn.addEventListener('click', () => openGalleryModal(btn.getAttribute('data-id')));
  });
  
  listBody.querySelectorAll('.btn-delete-gallery').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Hapus foto galeri ini?')) {
        await window.SchoolDB.deleteGalleryItem(btn.getAttribute('data-id'));
        showAdminToast('Informasi berhasil diperbarui.', 'success');
        renderGalleryTable();
        renderDashboard();
      }
    });
  });
}

document.getElementById('gallery-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      tempGalleryBase64 = await fileToBase64(file);
      document.getElementById('preview-gallery-img').src = tempGalleryBase64;
      document.getElementById('preview-gallery-container').style.display = 'block';
      document.getElementById('label-gallery-upload').textContent = 'Gambar siap';
    } catch (err) {
      showAdminToast('Gagal memproses berkas.', 'error');
    }
  }
});

function openGalleryModal(id = null) {
  const modal = document.getElementById('admin-modal-overlay');
  const title = document.getElementById('admin-modal-title');
  
  document.getElementById('form-teacher').style.display = 'none';
  document.getElementById('form-facility').style.display = 'none';
  document.getElementById('form-activity').style.display = 'none';
  document.getElementById('form-gallery').style.display = 'block';
  
  document.getElementById('form-gallery').reset();
  document.getElementById('preview-gallery-container').style.display = 'none';
  document.getElementById('preview-gallery-img').src = '';
  document.getElementById('label-gallery-upload').textContent = 'Klik untuk pilih gambar';
  tempGalleryBase64 = null;
  
  if (id) {
    title.textContent = 'Edit Keterangan Foto';
    const item = window.SchoolDB.getGallery().find(g => g.id === id);
    if (item) {
      document.getElementById('gallery-id').value = item.id;
      document.getElementById('gallery-caption').value = item.caption;
      if (item.image) {
        document.getElementById('preview-gallery-img').src = item.image;
        document.getElementById('preview-gallery-container').style.display = 'block';
        tempGalleryBase64 = item.image;
      }
    }
  } else {
    title.textContent = 'Tambah Foto Galeri Baru';
    document.getElementById('gallery-id').value = '';
  }
  
  modal.classList.add('open');
}

document.getElementById('form-gallery').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('gallery-id').value;
  const caption = document.getElementById('gallery-caption').value;
  
  if (!tempGalleryBase64 && !id) {
    showAdminToast('Mohon pilih berkas gambar.', 'error');
    return;
  }
  
  if (id) {
    await window.SchoolDB.updateGalleryItem(id, { caption, image: tempGalleryBase64 });
  } else {
    await window.SchoolDB.addGalleryItem({ caption, image: tempGalleryBase64 });
  }
  
  showAdminToast('Informasi berhasil diperbarui.', 'success');
  closeModal();
  renderGalleryTable();
  renderDashboard();
});

document.getElementById('admin-add-gallery-btn').addEventListener('click', () => openGalleryModal());

// Load/Submit Contact
function loadContactForm() {
  const contact = window.SchoolDB.getContact();
  
  document.getElementById('contact-address').value = contact.address;
  document.getElementById('contact-phone').value = contact.phone;
  document.getElementById('contact-email').value = contact.email;
  document.getElementById('contact-maps').value = contact.maps;
  document.getElementById('contact-facebook').value = contact.facebook || '';
  document.getElementById('contact-instagram').value = contact.instagram || '';
  document.getElementById('contact-youtube').value = contact.youtube || '';
}

document.getElementById('form-edit-contact').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const address = document.getElementById('contact-address').value;
  const phone = document.getElementById('contact-phone').value;
  const email = document.getElementById('contact-email').value;
  const maps = document.getElementById('contact-maps').value;
  const facebook = document.getElementById('contact-facebook').value;
  const instagram = document.getElementById('contact-instagram').value;
  const youtube = document.getElementById('contact-youtube').value;
  
  await window.SchoolDB.updateContact({ address, phone, email, maps, facebook, instagram, youtube });
  
  showAdminToast('Informasi berhasil diperbarui.', 'success');
});

function closeModal() {
  document.getElementById('admin-modal-overlay').classList.remove('open');
}

document.getElementById('admin-modal-close-btn').addEventListener('click', closeModal);
document.getElementById('admin-modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('admin-modal-overlay')) closeModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/**
 * Production Image Upload Optimizer for CMS
 * Automatically resizes large camera photos (max 1200px) and compresses to modern WebP/JPEG,
 * reducing payload by up to 90% without visible quality loss.
 */
function fileToBase64(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    if (!file.type.startsWith('image/')) {
      showAdminToast('Format file harus berupa gambar (JPG, PNG, WebP).', 'error');
      return reject(new Error('Invalid image format'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        let { width, height } = img;

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
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// Authentication Forms
document.getElementById('admin-login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('admin-password').value;
  
  if (password === 'admin123') {
    sessionStorage.setItem('admin_logged_in', 'true');
    checkAuth();
    showAdminToast('Siap memperbarui cerita sekolah hari ini?', 'success');
  } else {
    showAdminToast('Kata sandi salah!', 'error');
  }
});

document.getElementById('admin-logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('admin_logged_in');
  showAdminToast('Logout berhasil.', 'success');
  setTimeout(() => window.location.reload(), 500);
});

window.addEventListener('DOMContentLoaded', checkAuth);
