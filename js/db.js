// DESIGN.md Compliance - Database Wrapper for SDN 2 Ngeposari Website
// Handles LocalStorage for text/metadata and IndexedDB for images.

const DB_NAME = 'SDN2NgeposariDB';
const DB_VERSION = 1;
const STORE_NAME = 'siteData';

// Dynamic Clean Flat Editorial SVG Mockups for SDN 2 Ngeposari
function generateSVGPlaceholder(type, title) {
  let icon = '';
  let bgFill = '#F8F8F5';
  let iconColor = '#1E40AF';
  let textColor = '#171717';
  let borderStroke = '#E7E7E2';

  if (type === 'library') {
    icon = '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 6h10M6 10h10M6 14h10" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1E40AF';
  } else if (type === 'computer') {
    icon = '<rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1E40AF';
  } else if (type === 'sports') {
    icon = '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 12a6 6 0 0 1 12 0M12 6a6 6 0 0 1 0 12" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#FEF3C7'; iconColor = '#D97706';
  } else if (type === 'health') {
    icon = '<path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v6M9 12h6" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#FEE2E2'; iconColor = '#C94A4A';
  } else if (type === 'scout') {
    icon = '<path d="M12 2L2 7l10 5 10-5-10-5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#ECFDF5'; iconColor = '#2F7D5B';
  } else if (type === 'art') {
    icon = '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/>';
    bgFill = '#FDF2F8'; iconColor = '#DB2777';
  } else if (type === 'garden') {
    icon = '<path d="M12 2a15 15 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 15 15 0 0 0-9-9Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12a3 3 0 1 0 6 0" stroke="currentColor" stroke-width="2"/><path d="M12 2v18" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#ECFDF5'; iconColor = '#2F7D5B';
  } else if (type === 'upacara') {
    icon = '<path d="M4 22V2m0 2h14l-3 4 3 4H4" fill="none" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1E40AF';
  } else if (type === 'kelas') {
    icon = '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#F8F8F5'; iconColor = '#171717';
  } else if (type === 'perpus') {
    icon = '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" fill="none" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1E40AF';
  } else if (type === 'pramuka') {
    icon = '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-1.5-3-1.5-3s-1.5 1.62-1.5 3a2.5 2.5 0 0 0 2.5 2.5z" fill="currentColor"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#FEF2F2'; iconColor = '#C94A4A';
  } else if (type === 'senam') {
    icon = '<circle cx="12" cy="5" r="2" fill="currentColor"/><path d="M6 22V12h12v10M12 7v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    bgFill = '#F5F3FF'; iconColor = '#1E40AF';
  } else if (type === 'juara') {
    icon = '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#FEF3C7'; iconColor = '#D97706';
  } else {
    icon = '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#F8F8F5'; iconColor = '#666666';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${bgFill}" />
    <rect x="15" y="15" width="370" height="220" rx="16" fill="none" stroke="${borderStroke}" stroke-width="1.5" />
    <g transform="translate(170, 75) scale(2.8)" color="${iconColor}">
      ${icon}
    </g>
    <text x="50%" y="82%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="700" font-size="14">
      ${title}
    </text>
  </svg>`;

  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// School Logo SVG compliance (sincere, bold outline design)
function generateLogoSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="#1E40AF" rx="16" />
    <path d="M30 75 L30 45 L50 25 L70 45 L70 75 Z" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
    <path d="M50 75 L50 50" stroke="#D97706" stroke-width="4" />
    <circle cx="50" cy="25" r="5" fill="#D97706" />
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

// School Hero SVG compliance (clean outline structure, real school photo fallback mockup)
function generateHeroSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="100%" height="100%">
    <rect width="100%" height="100%" fill="#F8F8F5" />
    <rect x="40" y="40" width="1120" height="520" rx="28" fill="none" stroke="#E7E7E2" stroke-width="2" />
    <line x1="40" y1="300" x2="1160" y2="300" stroke="#E7E7E2" stroke-width="1.5" stroke-dasharray="8 6" />
    <line x1="600" y1="40" x2="600" y2="560" stroke="#E7E7E2" stroke-width="1.5" stroke-dasharray="8 6" />
    
    <!-- Simple warm visual shapes -->
    <rect x="750" y="160" width="300" height="280" rx="20" fill="#1E40AF" opacity="0.08" />
    <circle cx="900" cy="300" r="110" fill="none" stroke="#D97706" stroke-width="3" stroke-dasharray="6 8" />
    <path d="M850 250 L950 350 M950 250 L850 350" stroke="#1E40AF" stroke-width="4" opacity="0.3" />
    
    <g transform="translate(80, 160)">
      <text x="0" y="40" fill="#1E40AF" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" letter-spacing="2px">
        SEKOLAH YANG TUMBUH BERSAMA
      </text>
      <text x="0" y="110" fill="#171717" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" letter-spacing="-1px">
        Tempat belajar, bertumbuh,
      </text>
      <text x="0" y="165" fill="#171717" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" letter-spacing="-1px">
        dan menemukan hal baru.
      </text>
      <text x="0" y="240" fill="#666666" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="18">
        Kenali lingkungan sekolah, kegiatan, fasilitas, dan cerita
      </text>
      <text x="0" y="270" fill="#666666" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="18">
        di balik aktivitas sehari-hari kami di SDN 2 Ngeposari.
      </text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Generate the initial data set
const INITIAL_DATA = {
  profile: {
    name: 'SDN 2 Ngeposari',
    tagline: 'Unggul, Berkarakter, dan Berbudaya Lingkungan',
    description: 'SDN 2 Ngeposari berkomitmen untuk memberikan pendidikan berkualitas tinggi bagi anak-anak, memadukan keunggulan akademik dengan pembentukan karakter yang luhur dan kepedulian terhadap lingkungan sekitar.',
    history: 'SDN 2 Ngeposari didirikan untuk melayani kebutuhan pendidikan masyarakat Ngeposari dan sekitarnya. Sejak awal berdiri, sekolah ini terus mengukir prestasi baik di bidang akademik maupun non-akademik, menjadi salah satu sekolah dasar pilihan di wilayahnya.',
    vision: 'Terwujudnya peserta didik yang bertaqwa, berprestasi, berkarakter pancasila, dan peduli lingkungan.',
    missions: [
      'Melaksanakan pembelajaran yang aktif, kreatif, efektif, dan menyenangkan.',
      'Menumbuhkan penghayatan dan pengamalan terhadap ajaran agama yang dianut.',
      'Membentuk kepribadian yang berbudi pekerti luhur sesuai dengan nilai-nilai Pancasila.',
      'Mewujudkan lingkungan sekolah yang bersih, sehat, rindang, dan asri.',
      'Mengembangkan minat, bakat, dan kreativitas siswa melalui kegiatan ekstrakurikuler.'
    ],
    values: [
      { title: 'Bertaqwa', desc: 'Mengedepankan nilai-nilai religius dan ketuhanan.' },
      { title: 'Berkarakter', desc: 'Jujur, disiplin, bertanggung jawab, dan toleran.' },
      { title: 'Berprestasi', desc: 'Semangat belajar tinggi untuk meraih hasil terbaik.' },
      { title: 'Peduli Lingkungan', desc: 'Menjaga kebersihan dan kelestarian lingkungan sekolah.' }
    ],
    logo: 'images/logo.webp',
    hero: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=1000&fit=crop'
  },
  facilities: [
    {
      id: 'f1',
      name: 'Perpustakaan Pintar',
      description: 'Koleksi buku lengkap mulai dari buku pelajaran, cerita anak, hingga ensiklopedia menarik.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=500&fit=crop'
    },
    {
      id: 'f2',
      name: 'Laboratorium Komputer',
      description: 'Ruang komputer modern dengan koneksi internet untuk menunjang literasi digital siswa.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop'
    },
    {
      id: 'f3',
      name: 'Lapangan Serbaguna',
      description: 'Area luas untuk kegiatan olahraga seperti senam, sepak bola, bulu tangkis, dan upacara bendera.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=500&fit=crop'
    },
    {
      id: 'f4',
      name: 'Unit Kesehatan Sekolah (UKS)',
      description: 'Ruang kesehatan darurat yang dilengkapi dengan obat-obatan dasar dan perlengkapan P3K.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop'
    }
  ],
  activities: [
    {
      id: 'a1',
      title: 'Upacara bendera senin dan latihan pramuka',
      date: '2026-08-17',
      excerpt: 'Kegiatan rutin mingguan untuk meningkatkan kedisiplinan dan jiwa nasionalisme siswa.',
      content: 'Setiap hari Senin pagi, seluruh siswa dan guru melaksanakan Upacara Bendera dengan khidmat. Setelah itu, kegiatan dilanjutkan dengan latihan Pramuka pada sore harinya untuk melatih kemandirian, gotong royong, dan keterampilan dasar kepramukaan.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=960&h=540&fit=crop'
    },
    {
      id: 'a2',
      title: 'Lomba menulis kreatif dan mewarnai',
      date: '2026-08-10',
      excerpt: 'Wadah bagi siswa untuk menyalurkan bakat seni rupa, menulis indah, dan menuangkan imajinasi mereka.',
      content: 'Dalam rangka memperingati bulan bahasa, SDN 2 Ngeposari menyelenggarakan lomba menulis kreatif dan mewarnai tingkat kelas. Kegiatan ini bertujuan merangsang motorik halus serta imajinasi kreatif anak sejak usia dini.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=960&h=540&fit=crop'
    },
    {
      id: 'a3',
      title: 'Kerja bakti gerakan sekolah hijau',
      date: '2026-08-05',
      excerpt: 'Aksi peduli lingkungan bersama guru dan siswa menjaga kebersihan serta menanam pohon di sekolah.',
      content: 'Sebagai sekolah yang berbudaya lingkungan, SDN 2 Ngeposari mengadakan kerja bakti bulanan. Siswa diajarkan memilah sampah organik dan non-organik, serta melakukan penanaman bibit tanaman hias dan apotek hidup di area taman sekolah.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=960&h=540&fit=crop'
    }
  ],
  gallery: [
    { id: 'g1', caption: 'Belajar bersama di ruang kelas', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop' },
    { id: 'g2', caption: 'Upacara memperingati HUT RI ke-81', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop' },
    { id: 'g3', caption: 'Kegiatan membaca bersama di perpustakaan', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop' },
    { id: 'g4', caption: 'Praktik komputer dan literasi digital siswa', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop' },
    { id: 'g5', caption: 'Aktivitas olahraga di lapangan sekolah', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop' },
    { id: 'g6', caption: 'Kerja bakti taman dan tanaman apotek hidup', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop' }
  ],
  contact: {
    address: 'Jl. Karangmojo - Semanu, Ngeposari, Semanu, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55891',
    phone: '081234567890',
    email: 'info@sdn2ngeposari.sch.id',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.563823439498!2d110.6473063!3d-7.9734185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a372132eb2c0b%3A0xc48cd4d0ee0ca2df!2sSD%20Negeri%202%20Ngeposari!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    facebook: 'SDN 2 Ngeposari',
    instagram: 'sdn2ngeposari',
    youtube: 'SDN 2 Ngeposari Official'
  },
  teachers: [
    {
      id: 't1',
      name: 'Ibu Rahmawati, S.Pd.SD',
      role: 'Guru Kelas & Tenaga Pendidik',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=750&fit=crop'
    },
    {
      id: 't2',
      name: 'Bapak Hartono, S.Pd.',
      role: 'Kepala Sekolah',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=750&fit=crop'
    },
    {
      id: 't3',
      name: 'Bapak Triyono, S.Pd.',
      role: 'Guru PJOK & Pembina Pramuka',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop'
    },
    {
      id: 't4',
      name: 'Ibu Siti Nurhaliza, S.Pd.',
      role: 'Guru Agama & Karakter',
      image: 'https://images.unsplash.com/photo-1580894732413-87b1c31274cf?w=600&h=750&fit=crop'
    }
  ],
  calendar: [
    { id: 'c1', day: '01', month: 'SEP 2026', title: 'Asesmen Nasional Berbasis Komputer (ANBK)', category: 'Akademik' },
    { id: 'c2', day: '15', month: 'SEP 2026', title: 'Perkemahan Sabtu Minggu (Persami) Pramuka', category: 'Kepramukaan' },
    { id: 'c3', day: '28', month: 'SEP 2026', title: 'Penilaian Tengah Semester (PTS) Ganjil', category: 'Ujian' },
    { id: 'c4', day: '20', month: 'OKT 2026', title: 'Peringatan Bulan Bahasa & Pentas Seni Siswa', category: 'Acara' }
  ]
};

// IndexedDB Helper class to handle rich uploads
class IndexedStore {
  constructor() {
    this.db = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return resolve(null);
      }
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  set(key, val) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('DB not initialized'));
      }
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(val, key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

const idbStore = new IndexedStore();

// Core DB Management Object with Security & Integrity Hardening
window.SchoolDB = {
  data: null,
  isInitialized: false,
  _recentMutations: new Map(),

  // Strict Sanitization to Prevent XSS
  sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .trim();
  },

  sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    // Strip dangerous script, iframe, object, embed, javascript: protocols
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:[^"']*/gi, '')
      .trim();
  },

  // Audit Logging
  async logAudit(action, entity, detail) {
    if (!this.data) return;
    if (!Array.isArray(this.data.auditLogs)) {
      this.data.auditLogs = [];
    }
    
    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      action: action, // 'TAMBAH', 'UBAH', 'HAPUS', 'RESET'
      entity: entity, // 'Profil', 'Guru', 'Fasilitas', 'Kegiatan', 'Galeri', 'Kontak'
      detail: detail,
      user: 'Administrator'
    };
    
    this.data.auditLogs.unshift(newLog);
    // Keep max 50 recent audit logs
    if (this.data.auditLogs.length > 50) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 50);
    }
    await this.save();
  },

  getAuditLogs(limit = 10) {
    if (!this.data || !Array.isArray(this.data.auditLogs)) {
      return [];
    }
    return this.data.auditLogs.slice(0, limit);
  },

  // Idempotency Check
  _checkIdempotency(key) {
    const now = Date.now();
    // Clean old keys > 5s
    for (const [k, time] of this._recentMutations.entries()) {
      if (now - time > 5000) this._recentMutations.delete(k);
    }
    if (this._recentMutations.has(key)) {
      console.warn(`[SchoolDB] Duplicate mutation blocked for key: ${key}`);
      return true; // Duplicate detected
    }
    this._recentMutations.set(key, now);
    return false;
  },

  async init() {
    if (this.isInitialized) return this;

    try {
      await idbStore.init();
      let savedData = await idbStore.get('siteData');
      
      if (!savedData) {
        const localRaw = localStorage.getItem('sdn2_db_data');
        if (localRaw) {
          try {
            savedData = JSON.parse(localRaw);
            await idbStore.set('siteData', savedData);
          } catch (e) {
            console.error('Error parsing localStorage backup data:', e);
          }
        }
      }

      if (!savedData) {
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.data.auditLogs = [
          {
            id: 'log_init',
            timestamp: new Date().toISOString(),
            action: 'RESET',
            entity: 'Sistem',
            detail: 'Inisialisasi database awal bawaan',
            user: 'Sistem'
          }
        ];
        await this.save();
      } else {
        this.data = savedData;
        this.data.profile = { ...INITIAL_DATA.profile, ...this.data.profile };
        if (!this.data.profile.logo || this.data.profile.logo.startsWith('data:image/svg+xml')) {
          this.data.profile.logo = 'images/logo.webp';
        }
        this.data.contact = { ...INITIAL_DATA.contact, ...this.data.contact };
        if (!Array.isArray(this.data.facilities)) this.data.facilities = JSON.parse(JSON.stringify(INITIAL_DATA.facilities));
        if (!Array.isArray(this.data.activities)) this.data.activities = JSON.parse(JSON.stringify(INITIAL_DATA.activities));
        if (!Array.isArray(this.data.gallery)) this.data.gallery = JSON.parse(JSON.stringify(INITIAL_DATA.gallery));
        if (!Array.isArray(this.data.teachers)) this.data.teachers = JSON.parse(JSON.stringify(INITIAL_DATA.teachers));
        if (!Array.isArray(this.data.auditLogs)) this.data.auditLogs = [];
        await this.save();
      }

      this.isInitialized = true;
      console.log('Database initialized successfully with security rules.');
      return this;
    } catch (err) {
      console.error('Database failed to initialize:', err);
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
      this.data.auditLogs = [];
      this.isInitialized = true;
      return this;
    }
  },

  async save() {
    if (!this.data) return;
    try {
      await idbStore.set('siteData', this.data);
      try {
        localStorage.setItem('sdn2_db_data_backup', JSON.stringify({
          profile: { ...this.data.profile, logo: '', hero: '' }, 
          contact: this.data.contact
        }));
        localStorage.setItem('sdn2_db_loaded', 'true');
      } catch (e) {
        console.warn('LocalStorage backup quota exceeded or blocked.');
      }
    } catch (err) {
      console.error('Error saving data to database:', err);
    }
  },

  async reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.data.auditLogs = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'RESET',
        entity: 'Sistem',
        detail: 'Mereset seluruh database ke pengaturan awal',
        user: 'Administrator'
      }
    ];
    await this.save();
    console.log('Database has been reset to defaults.');
    return this.data;
  },

  // GETTERS
  getProfile() {
    return this.data.profile;
  },

  getFacilities() {
    return this.data.facilities;
  },

  getActivities() {
    return [...this.data.activities].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getNews() {
    return this.getActivities();
  },

  getGallery() {
    return this.data.gallery;
  },

  getContact() {
    return this.data.contact;
  },

  getCalendar() {
    return this.data.calendar || INITIAL_DATA.calendar;
  },

  getTeachers() {
    return this.data.teachers || INITIAL_DATA.teachers;
  },

  // SETTERS / UPDATERS WITH VALIDATION & AUDIT LOGGING
  async updateProfile(profileData) {
    const sanitized = {
      name: this.sanitizeText(profileData.name || this.data.profile.name),
      tagline: this.sanitizeText(profileData.tagline || this.data.profile.tagline),
      description: this.sanitizeText(profileData.description || this.data.profile.description),
      history: this.sanitizeText(profileData.history || this.data.profile.history),
      vision: this.sanitizeText(profileData.vision || this.data.profile.vision),
      missions: Array.isArray(profileData.missions) ? profileData.missions.map(m => this.sanitizeText(m)) : this.data.profile.missions,
      logo: profileData.logo || this.data.profile.logo,
      hero: profileData.hero || this.data.profile.hero
    };

    this.data.profile = { ...this.data.profile, ...sanitized };
    await this.save();
    await this.logAudit('UBAH', 'Profil', `Memperbarui profil sekolah "${sanitized.name}"`);
  },

  async updateContact(contactData) {
    const sanitized = {
      address: this.sanitizeText(contactData.address || this.data.contact.address),
      phone: this.sanitizeText(contactData.phone || this.data.contact.phone),
      email: this.sanitizeText(contactData.email || this.data.contact.email),
      maps: contactData.maps || this.data.contact.maps,
      facebook: this.sanitizeText(contactData.facebook || ''),
      instagram: this.sanitizeText(contactData.instagram || ''),
      youtube: this.sanitizeText(contactData.youtube || '')
    };

    this.data.contact = { ...this.data.contact, ...sanitized };
    await this.save();
    await this.logAudit('UBAH', 'Kontak', 'Memperbarui informasi kontak dan media sosial');
  },

  normalizeName(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
  },

  // Facilities CRUD
  async addFacility(facility) {
    if (!Array.isArray(this.data.facilities)) this.data.facilities = [];
    const name = this.sanitizeText(facility.name || 'Fasilitas Baru');
    const desc = this.sanitizeText(facility.description || '');

    const normName = this.normalizeName(name);
    const isDuplicate = this.data.facilities.some(f => this.normalizeName(f.name) === normName);
    if (isDuplicate) {
      throw new Error('Fasilitas dengan nama tersebut sudah tersedia.');
    }

    const newFacility = {
      id: 'f_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      description: desc,
      image: facility.image || generateSVGPlaceholder('general', name)
    };
    this.data.facilities.push(newFacility);
    await this.save();
    await this.logAudit('TAMBAH', 'Fasilitas', `Menambahkan fasilitas "${newFacility.name}"`);
    return newFacility;
  },

  async updateFacility(id, updatedFields) {
    if (!Array.isArray(this.data.facilities)) this.data.facilities = INITIAL_DATA.facilities;
    const index = this.data.facilities.findIndex(f => String(f.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.name !== undefined) {
        sanitized.name = this.sanitizeText(updatedFields.name);
        const normName = this.normalizeName(sanitized.name);
        const isDuplicate = this.data.facilities.some(f => String(f.id) !== String(id) && this.normalizeName(f.name) === normName);
        if (isDuplicate) {
          throw new Error('Fasilitas dengan nama tersebut sudah tersedia.');
        }
      }
      if (updatedFields.description !== undefined) sanitized.description = this.sanitizeText(updatedFields.description);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.facilities[index] = { ...this.data.facilities[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Fasilitas', `Memperbarui fasilitas "${this.data.facilities[index].name}"`);
      return true;
    }
    return false;
  },

  async deleteFacility(id) {
    if (!Array.isArray(this.data.facilities)) return false;
    const target = this.data.facilities.find(f => String(f.id) === String(id));
    if (!target) return false;

    this.data.facilities = this.data.facilities.filter(f => String(f.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Fasilitas', `Menghapus fasilitas "${target.name}"`);
    return true;
  },

  // Activities CRUD
  async addActivity(activity) {
    if (!Array.isArray(this.data.activities)) this.data.activities = [];
    const title = this.sanitizeText(activity.title || 'Kegiatan Baru');
    const date = activity.date || new Date().toISOString().split('T')[0];

    const normTitle = this.normalizeName(title);
    const isDuplicate = this.data.activities.some(a => this.normalizeName(a.title) === normTitle);
    if (isDuplicate) {
      throw new Error('Kegiatan dengan nama tersebut sudah tersedia.');
    }

    const newActivity = {
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title,
      date: date,
      excerpt: this.sanitizeText(activity.excerpt || ''),
      content: this.sanitizeHTML(activity.content || ''),
      image: activity.image || generateSVGPlaceholder('general', title)
    };
    this.data.activities.push(newActivity);
    await this.save();
    await this.logAudit('TAMBAH', 'Kegiatan', `Menambahkan berita/kegiatan "${newActivity.title}"`);
    return newActivity;
  },

  async updateActivity(id, updatedFields) {
    if (!Array.isArray(this.data.activities)) this.data.activities = INITIAL_DATA.activities;
    const index = this.data.activities.findIndex(a => String(a.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.title !== undefined) {
        sanitized.title = this.sanitizeText(updatedFields.title);
        const normTitle = this.normalizeName(sanitized.title);
        const isDuplicate = this.data.activities.some(a => String(a.id) !== String(id) && this.normalizeName(a.title) === normTitle);
        if (isDuplicate) {
          throw new Error('Kegiatan dengan nama tersebut sudah tersedia.');
        }
      }
      if (updatedFields.date !== undefined) sanitized.date = updatedFields.date;
      if (updatedFields.excerpt !== undefined) sanitized.excerpt = this.sanitizeText(updatedFields.excerpt);
      if (updatedFields.content !== undefined) sanitized.content = this.sanitizeHTML(updatedFields.content);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.activities[index] = { ...this.data.activities[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Kegiatan', `Memperbarui berita/kegiatan "${this.data.activities[index].title}"`);
      return true;
    }
    return false;
  },

  async deleteActivity(id) {
    if (!Array.isArray(this.data.activities)) return false;
    const target = this.data.activities.find(a => String(a.id) === String(id));
    if (!target) return false;

    this.data.activities = this.data.activities.filter(a => String(a.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Kegiatan', `Menghapus berita/kegiatan "${target.title}"`);
    return true;
  },

  // Gallery CRUD
  async addGalleryItem(item) {
    if (!Array.isArray(this.data.gallery)) this.data.gallery = [];
    const caption = this.sanitizeText(item.caption || 'Foto Galeri');

    const newItem = {
      id: 'g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      caption: caption,
      image: item.image || generateSVGPlaceholder('general', caption)
    };
    this.data.gallery.push(newItem);
    await this.save();
    await this.logAudit('TAMBAH', 'Galeri', `Menambahkan foto galeri "${newItem.caption}"`);
    return newItem;
  },

  async updateGalleryItem(id, updatedFields) {
    if (!Array.isArray(this.data.gallery)) this.data.gallery = INITIAL_DATA.gallery;
    const index = this.data.gallery.findIndex(g => String(g.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.caption !== undefined) sanitized.caption = this.sanitizeText(updatedFields.caption);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.gallery[index] = { ...this.data.gallery[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Galeri', `Memperbarui foto galeri "${this.data.gallery[index].caption}"`);
      return true;
    }
    return false;
  },

  async deleteGalleryItem(id) {
    if (!Array.isArray(this.data.gallery)) return false;
    const target = this.data.gallery.find(g => String(g.id) === String(id));
    if (!target) return false;

    this.data.gallery = this.data.gallery.filter(g => String(g.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Galeri', `Menghapus foto galeri "${target.caption}"`);
    return true;
  },

  // Teachers CRUD
  async addTeacher(teacher) {
    if (!Array.isArray(this.data.teachers)) this.data.teachers = [];
    const name = this.sanitizeText(teacher.name || 'Guru Baru');
    const role = this.sanitizeText(teacher.role || 'Tenaga Pendidik');

    const normName = this.normalizeName(name);
    const isDuplicate = this.data.teachers.some(t => this.normalizeName(t.name) === normName);
    if (isDuplicate) {
      throw new Error('Guru dengan nama tersebut sudah terdaftar.');
    }

    const newTeacher = {
      id: 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      role: role,
      image: teacher.image || generateSVGPlaceholder('class', name)
    };
    this.data.teachers.push(newTeacher);
    await this.save();
    await this.logAudit('TAMBAH', 'Guru', `Menambahkan guru/staf "${newTeacher.name}" (${newTeacher.role})`);
    return newTeacher;
  },

  async updateTeacher(id, updatedFields) {
    if (!Array.isArray(this.data.teachers)) this.data.teachers = INITIAL_DATA.teachers;
    const index = this.data.teachers.findIndex(t => String(t.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.name !== undefined) {
        sanitized.name = this.sanitizeText(updatedFields.name);
        const normName = this.normalizeName(sanitized.name);
        const isDuplicate = this.data.teachers.some(t => String(t.id) !== String(id) && this.normalizeName(t.name) === normName);
        if (isDuplicate) {
          throw new Error('Guru dengan nama tersebut sudah terdaftar.');
        }
      }
      if (updatedFields.role !== undefined) sanitized.role = this.sanitizeText(updatedFields.role);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.teachers[index] = { ...this.data.teachers[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Guru', `Memperbarui guru/staf "${this.data.teachers[index].name}"`);
      return true;
    }
    return false;
  },

  async deleteTeacher(id) {
    if (!Array.isArray(this.data.teachers)) return false;
    const target = this.data.teachers.find(t => String(t.id) === String(id));
    if (!target) return false;

    this.data.teachers = this.data.teachers.filter(t => String(t.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Guru', `Menghapus guru/staf "${target.name}"`);
    return true;
  }
};
