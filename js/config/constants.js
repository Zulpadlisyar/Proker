/**
 * SDN 2 Ngeposari - Global Constants & Initial Seed Data
 * Centralized single source of truth for configuration, navigation, and seed state.
 */

(function (root) {
  'use strict';

  const NAV_ITEMS = [
    { label: 'Beranda', href: 'index.html', id: 'nav-home' },
    { label: 'Tentang', href: 'tentang.html', id: 'nav-about' },
    { label: 'Fasilitas', href: 'fasilitas.html', id: 'nav-facilities' },
    { label: 'Kegiatan', href: 'kegiatan.html', id: 'nav-activities' },
    { label: 'Kontak', href: 'kontak.html', id: 'nav-contact' }
  ];

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB input limit
  const ITEMS_PER_PAGE = 10;

  const STORAGE_KEYS = {
    DB_NAME: 'SDN2NgeposariDB',
    DB_VERSION: 1,
    STORE_NAME: 'siteData',
    BACKUP_LOCAL: 'sdn2_db_data_backup',
    SESSION: 'sdn2_admin_session',
    LOCKOUT_UNTIL: 'sdn2_admin_lockout_until',
    FIREBASE_CONFIG: 'sdn2_firebase_config',
    LAST_CLOUD_SYNC: 'sdn2_last_cloud_sync'
  };

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
    categories: [
      'Akademik',
      'Kepramukaan',
      'Ekstrakurikuler',
      'Prestasi',
      'Sosial & Lingkungan',
      'Umum'
    ],
    activities: [
      {
        id: 'a1',
        title: 'Upacara bendera senin dan latihan pramuka',
        date: '2026-08-17',
        category: 'Kepramukaan',
        views: 248,
        excerpt: 'Kegiatan rutin mingguan untuk meningkatkan kedisiplinan dan jiwa nasionalisme siswa.',
        content: 'Setiap hari Senin pagi, seluruh siswa dan guru melaksanakan Upacara Bendera dengan khidmat. Setelah itu, kegiatan dilanjutkan dengan latihan Pramuka pada sore harinya untuk melatih kemandirian, gotong royong, dan keterampilan dasar kepramukaan.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=960&h=540&fit=crop'
      },
      {
        id: 'a2',
        title: 'Lomba menulis kreatif dan mewarnai',
        date: '2026-08-10',
        category: 'Prestasi',
        views: 185,
        excerpt: 'Wadah bagi siswa untuk menyalurkan bakat seni rupa, menulis indah, dan menuangkan imajinasi mereka.',
        content: 'Dalam rangka memperingati bulan bahasa, SDN 2 Ngeposari menyelenggarakan lomba menulis kreatif dan mewarnai tingkat kelas. Kegiatan ini bertujuan merangsang motorik halus serta imajinasi kreatif anak sejak usia dini.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=960&h=540&fit=crop'
      },
      {
        id: 'a3',
        title: 'Kerja bakti gerakan sekolah hijau',
        date: '2026-08-05',
        category: 'Sosial & Lingkungan',
        views: 312,
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
      { id: 't1', name: 'Bapak Maryanto, M.Pd.', role: 'Kepala Sekolah', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=600&fit=crop' },
      { id: 't2', name: 'Ibu Siti Nurhaliza, S.Pd.', role: 'Guru Kelas 1', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop' },
      { id: 't3', name: 'Bapak Bambang Wijaya, S.Pd.', role: 'Guru PJOK', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop' },
      { id: 't4', name: 'Ibu Tri Wahyuni, S.Pd.', role: 'Guru Pendidikan Agama', image: 'https://images.unsplash.com/photo-1580894732470-349f50e82e5b?w=600&h=600&fit=crop' }
    ]
  };

  const SchoolConstants = {
    NAV_ITEMS,
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_BYTES,
    ITEMS_PER_PAGE,
    STORAGE_KEYS,
    INITIAL_DATA
  };

  root.SchoolConstants = SchoolConstants;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolConstants;
  }
})(typeof window !== 'undefined' ? window : global);
