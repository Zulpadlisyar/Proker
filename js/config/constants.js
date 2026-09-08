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
      name: 'SDN Ngeposari 2',
      tagline: 'Unggul, Berkarakter, dan Berbudaya Lingkungan',
      npsn: '20401876',
      nss: '101040310002',
      akreditasi: 'A',
      totalStudents: 143,
      totalTeachers: 8,
      totalPrincipal: 1,
      totalStaff: 2,
      totalClasses: 6,
      description: 'SDN Ngeposari 2 adalah sekolah dasar negeri terakreditasi A di Mojo RT 01 / RW 13, Ngeposari, Semanu, Gunungkidul yang berkomitmen mencetak generasi cerdas, berkarakter, dan berbudaya lingkungan.',
      history: 'SDN Ngeposari 2 (NPSN: 20401876, NSS: 101040310002) didirikan untuk melayani kebutuhan pendidikan dasar masyarakat di Dusun Mojo, Kalurahan Ngeposari, Kapanewon Semanu, Kabupaten Gunungkidul. Berada di lingkungan yang asri dan kondusif, sekolah ini berstatus negeri dengan akreditasi A, membina 143 siswa dengan didukung oleh 1 Kepala Sekolah, 8 Guru, dan 2 Tenaga Kependidikan dalam 6 ruang kelas pembelajaran aktif.',
      vision: 'Terwujudnya insan yang bertaqwa, berprestasi, terampil, peduli lingkungan dan berkarakter',
      visionYear: 'Tahun Ajaran 2026/2027',
      visionIndicators: [
        'Terwujudnya peserta didik yang taat beribadah kepada Tuhan Yang Maha Esa.',
        'Terwujudnya peserta didik yang unggul dalam prestasi akademik dan non akademik.',
        'Terwujudnya peserta didik yang terampil dalam berkarya dan berkreasi.',
        'Terwujudnya peserta didik yang cinta alam dan memiliki budaya ramah lingkungan.',
        'Terwujudnya peserta didik yang berkarakter, mengimplementasikan Dimensi Profil Lulusan.'
      ],
      missions: [
        'Melaksanakan pembinaan perilaku mulia dalam penghayatan dan pengamalan ajaran agamanya melalui kegiatan pembiasaan untuk penguatan kebiasaan Anak Indonesia Hebat (beribadah dan bermasyarakat). (Representasi visi Bertaqwa & Berkarakter, selaras dimensi Keimanan, Kewargaan, Kolaborasi, dan Komunikasi).',
        'Melaksanakan kegiatan untuk menunjang keberhasilan akademik dengan pendekatan pembelajaran mendalam serta berpusat pada peserta didik. (Representasi visi Berprestasi, selaras dimensi Penalaran Kritis, Kreativitas, dan Kemandirian).',
        'Melaksanakan pembinaan dalam bidang non akademik khususnya olahraga atletik dan seni tari. (Representasi visi Berprestasi & Terampil, selaras dimensi Kreativitas, Komunikasi, dan Kesehatan).',
        'Melaksanakan kegiatan pembiasaan budaya positif dan pengembangan keterampilan berpikir tingkat tinggi (HOTS) melalui kegiatan kokurikuler. (Representasi visi Terampil, selaras dimensi Kreativitas, Kolaborasi, Komunikasi, dan Penalaran Kritis).',
        'Menerapkan program sekolah yang mampu menumbuhkembangkan kesadaran, kepedulian dan cinta lingkungan pada warga sekolah akan pentingnya menjalin hubungan yang harmonis di antara warga sekolah, masyarakat dan alam sekitar. (Representasi visi Peduli Lingkungan, selaras dimensi Kolaborasi, Komunikasi, dan Kesehatan).'
      ],
      values: [
        { title: 'Bertaqwa', desc: 'Pembinaan perilaku mulia, taat beribadah kepada Tuhan YME, dan kebiasaan Anak Indonesia Hebat.' },
        { title: 'Berprestasi', desc: 'Unggul dalam akademik lewat pembelajaran mendalam serta non-akademik atletik & seni tari.' },
        { title: 'Terampil', desc: 'Kreatif berkarya dan berkreasi dengan pembiasaan berpikir tingkat tinggi (HOTS).' },
        { title: 'Peduli Lingkungan', desc: 'Menumbuhkan kesadaran cinta lingkungan hidup yang harmonis dan asri.' },
        { title: 'Berkarakter', desc: 'Menanamkan nilai-nilai luhur dan mengimplementasikan Dimensi Profil Lulusan.' }
      ],
      logo: 'images/logo.webp',
      hero: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=1000&fit=crop',
      principalName: 'Sumarni, S.Pd.SD., M.Pd.',
      principalRole: 'Kepala Sekolah SD Negeri 2 Ngeposari',
      principalImage: 'images/teachers/sumarni.webp',
      principalGreeting: "Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera bagi Kita Semua.\n\nPuji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya. Selamat datang di portal informasi resmi SD Negeri 2 Ngeposari, Kapanewon Semanu, Kabupaten Gunungkidul. Website ini kami hadirkan sebagai jendela keterbukaan informasi, media komunikasi yang hangat, dan sarana silaturahmi antara sekolah, orang tua wali, serta masyarakat luas.\n\nKami meyakini bahwa setiap anak yang melangkah masuk ke gerbang sekolah ini membawa benih potensi dan mimpi yang berharga. Di lingkungan yang asri dan teduh ini, para pendidik berkomitmen mendampingi siswa dengan penuh kesabaran, memadukan pembelajaran bermakna Kurikulum Merdeka, pembiasaan budi pekerti luhur Pancasila, serta kecintaan terhadap kelestarian lingkungan hidup.\n\nMari bersama-sama bergandeng tangan membimbing putra-putri kita menyongsong masa depan yang cerah, cerdas, dan berkarakter mulia."
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
        title: 'Upacara bendera senin dan pembinaan karakter',
        date: '2026-08-17',
        category: 'Akademik',
        views: 0,
        excerpt: 'Kegiatan rutin upacara bendera hari Senin untuk memupuk jiwa nasionalisme, patriotisme, dan kedisiplinan siswa.',
        content: 'Setiap hari Senin pagi, seluruh siswa, dewan guru, dan staf SDN Ngeposari 2 melaksanakan Upacara Bendera dengan khidmat di halaman utama sekolah. Di bawah kibaran bendera merah putih, para siswa dilatih kedisiplinan, kerapian baris-berbaris, serta mendengarkan amanat pembina upacara yang menekankan pentingnya pembentukan karakter budi pekerti luhur dan nilai-nilai Pancasila dalam kehidupan sehari-hari.',
        image: 'images/school/upacara_bendera.webp'
      },
      {
        id: 'a2',
        title: 'Latihan rutin pramuka penggalang dan siaga',
        date: '2026-08-15',
        category: 'Kepramukaan',
        views: 0,
        excerpt: 'Siswa-siswi antusias mengikuti latihan kepramukaan, simpul tali-temali, dan pembentukan jiwa kepemimpinan.',
        content: 'Kegiatan ekstrakurikuler kepramukaan di SDN Ngeposari 2 berlangsung dengan penuh semangat di halaman sekolah. Dipandu oleh para guru pembina, siswa belajar keterampilan kepramukaan seperti baris-berbaris, penggunaan atribut seragam lengkap, semaphore, simpul tali-temali, serta permainan kerja sama regu. Melalui kegiatan ini, siswa dilatih kemandirian, kekompakan gotong royong, dan kecintaan pada alam.',
        image: 'images/school/latihan_pramuka.webp'
      },
      {
        id: 'a3',
        title: 'Latihan seni tari tradisional dan olah kreasi',
        date: '2026-08-10',
        category: 'Prestasi',
        views: 0,
        excerpt: 'Wadah ekspresi kreativitas dan pelestarian seni budaya daerah melalui ekstrakurikuler tari tradisi di kelas.',
        content: 'Sebagai bagian dari penguatan profil pelajar Pancasila yang berkebhinekaan global dan mencintai kearifan lokal, SDN Ngeposari 2 menyelenggarakan latihan seni tari tradisional. Para siswa dengan antusias mempelajari gerak dasar tari, kelenturan ritme, dan kekompakan kelompok di ruang kelas dengan bimbingan guru seni. Kegiatan ini menumbuhkan rasa percaya diri sekaligus melestarikan kekayaan seni tari nusantara.',
        image: 'images/school/latihan_tari.webp'
      },
      {
        id: 'a4',
        title: 'Kerja bakti gerakan sekolah hijau',
        date: '2026-08-05',
        category: 'Sosial & Lingkungan',
        views: 0,
        excerpt: 'Aksi peduli lingkungan bersama guru dan siswa menjaga kebersihan serta menanam pohon di sekolah.',
        content: 'Sebagai sekolah yang berbudaya lingkungan, SDN Ngeposari 2 mengadakan kerja bakti bulanan. Siswa diajarkan memilah sampah organik dan non-organik, serta melakukan penanaman bibit tanaman hias dan apotek hidup di area taman sekolah.',
        image: 'images/school/kegiatan1.webp'
      }
    ],
    gallery: [
      { id: 'g1', caption: 'Suasana pembelajaran aktif & interaktif di kelas', image: 'images/school/kegiatan1.webp' },
      { id: 'g2', caption: 'Gedung utama dan halaman asri SDN 2 Ngeposari', image: 'images/school/hero.webp' },
      { id: 'g3', caption: 'Latihan kepramukaan penggalang membentuk kedisiplinan', image: 'images/school/latihan_pramuka.webp' },
      { id: 'g4', caption: 'Upacara bendera & apel pembinaan karakter', image: 'images/school/upacara_bendera.webp' },
      { id: 'g5', caption: 'Latihan seni tari tradisional siswa di ruang kelas', image: 'images/school/latihan_tari.webp' },
      { id: 'g6', caption: 'Gedung dan lingkungan sekolah asri & teduh', image: 'images/school_hero_bg.webp' }
    ],
    contact: {
      address: 'Mojo RT 01/RW13, Ngeposari, Semanu, Gunungkidul, DI Yogyakarta, 55893',
      phone: '0812-3456-7890',
      email: 'sdngeposari2semanu@gmail.com',
      maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.563823439498!2d110.6473063!3d-7.9734185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7bb5cc01b87119%3A0x75e6f3182387f509!2sSD%20Negeri%20Ngeposari%20II!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
      mapsUrl: 'https://maps.app.goo.gl/y3Gzega74NqFi9N58',
      facebook: 'SD Ngeposari II',
      facebookUrl: 'https://www.facebook.com/search/top?q=SD%20Ngeposari%20II',
      instagram: '@snada_02',
      instagramUrl: 'https://www.instagram.com/snada_02',
      youtube: 'Sdngeposari2',
      youtubeUrl: 'https://www.youtube.com/@sdngeposari2'
    },
    teachers: [
      { id: 't1', name: 'Sumarni, S.Pd.SD., M.Pd.', role: 'Kepala Sekolah', image: 'images/teachers/sumarni.webp' },
      { id: 't2', name: 'Surip Lestari, S.Pd.SD.', role: 'Guru Kelas 1', image: 'images/teachers/surip_lestari.webp' },
      { id: 't3', name: 'Diana Eka Prasetiawati, S.Pd.SD.', role: 'Guru Kelas 2', image: 'images/teachers/diana_eka.webp' },
      { id: 't4', name: 'Ediwaljana, S.Pd.SD.', role: 'Guru Kelas 3', image: 'images/teachers/ediwaljana.webp' },
      { id: 't5', name: 'Isih Subekti, S.Pd.SD.', role: 'Guru Kelas 4', image: 'images/teachers/isih_subekti.webp' },
      { id: 't6', name: 'Maria Rosalina, S.Pd. Mat.', role: 'Guru Kelas 5', image: 'images/teachers/maria_rosalina.webp' },
      { id: 't7', name: 'Wahid Rahmanto, S.Pd.', role: 'Guru Kelas 6', image: 'images/teachers/wahid_rahmanto.webp' },
      { id: 't8', name: 'Winda Hendrawati, S.E.', role: 'Guru PJOK', image: 'images/teachers/winda_hendrawati.webp' },
      { id: 't9', name: 'Nureza Fauziyah, S.Pd.', role: 'Guru Pendidikan Agama Islam', image: 'images/teachers/nureza_fauziyah.webp' },
      { id: 't10', name: 'Retno Untari, S.I.Pust.', role: 'Tenaga Administrasi Perpustakaan', image: 'images/teachers/retno_untari.webp' },
      { id: 't11', name: 'Dzul Jalal', role: 'Tenaga Kependidikan / Penjaga Sekolah', image: 'images/teachers/dzul_jalal.webp' }
    ],
    testimonials: [
      {
        id: 'testi-1',
        name: 'Ibu Purwanti',
        role: 'Orang Tua Wali Kelas IV',
        quote: 'Guru-guru di SDN Ngeposari 2 sangat sabar dan penuh perhatian. Anak saya jadi lebih percaya diri, sopan, dan bersemangat berangkat sekolah setiap pagi.',
        avatar: 'images/avatars/silhouette-female.svg'
      },
      {
        id: 'testi-2',
        name: 'Bapak Sugiyanto',
        role: 'Orang Tua Wali Kelas VI',
        quote: 'Fasilitas perpustakaan dan lab komputer sangat membantu anak-anak belajar teknologi secara sehat. Pembiasaan Pramuka-nya juga melatih kemandirian.',
        avatar: 'images/avatars/silhouette-male.svg'
      },
      {
        id: 'testi-3',
        name: 'Ibu Maryati',
        role: 'Orang Tua Wali Kelas II',
        quote: 'Lingkungan sekolah yang bersih dan hijau membuat anak-anak merasa nyaman. Komunikasi sekolah dengan orang tua wali siswa juga terjalin sangat dekat.',
        avatar: 'images/avatars/silhouette-female.svg'
      }
    ],
    academicCalendar: [
      {
        id: 'cal-1',
        date: '13-15',
        month: 'JUL',
        title: 'Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah Anak',
        desc: 'Pengenalan lingkungan belajar baru, pembiasaan budaya positif, dan adaptasi ramah anak bagi peserta didik baru kelas 1.',
        category: 'Kegiatan',
        semester: 'Gasal',
        target: 'Kelas 1 & Siswa'
      },
      {
        id: 'cal-2',
        date: '17',
        month: 'AGU',
        title: 'Upacara HUT Kemerdekaan RI Ke-81 & Lomba Tradisional',
        desc: 'Upacara bendera peringatan kemerdekaan Republik Indonesia dilanjutkan dengan lomba kreativitas dan kekompakan siswa.',
        category: 'Kegiatan',
        semester: 'Gasal',
        target: 'Semua Siswa & Guru'
      },
      {
        id: 'cal-3',
        date: '15-18',
        month: 'SEP',
        title: 'Asesmen Nasional Berbasis Komputer (ANBK)',
        desc: 'Gladi bersih dan pelaksanaan asesmen kompetensi minimum (AKM) serta survei karakter peserta didik kelas 5 di Lab Komputer.',
        category: 'Ujian',
        semester: 'Gasal',
        target: 'Siswa Kelas 5'
      },
      {
        id: 'cal-4',
        date: '03-04',
        month: 'OKT',
        title: 'Perkemahan Sabtu Minggu (Persami) Pramuka',
        desc: 'Kegiatan kepramukaan kemandirian, latihan simpul tali temali, api unggun, dan penjelajahan alam di bumi perkemahan.',
        category: 'Kegiatan',
        semester: 'Gasal',
        target: 'Regu Penggalang'
      },
      {
        id: 'cal-5',
        date: '19-24',
        month: 'OKT',
        title: 'Penilaian Tengah Semester (PTS) Gasal',
        desc: 'Evaluasi formatif dan asesmen sumatif tengah semester untuk mengukur capaian pembelajaran seluruh jenjang kelas 1-6.',
        category: 'Ujian',
        semester: 'Gasal',
        target: 'Kelas 1 - 6'
      },
      {
        id: 'cal-6',
        date: '01-08',
        month: 'DES',
        title: 'Penilaian Akhir Semester (PAS) Gasal',
        desc: 'Pelaksanaan asesmen sumatif akhir semester gasal tahun ajaran 2026/2027 untuk seluruh mata pelajaran.',
        category: 'Ujian',
        semester: 'Gasal',
        target: 'Kelas 1 - 6'
      },
      {
        id: 'cal-7',
        date: '19',
        month: 'DES',
        title: 'Pembagian Rapor Semester Gasal & Sarasehan Wali Murid',
        desc: 'Penyerahan laporan hasil belajar siswa semester gasal dan sarasehan evaluasi perkembangan anak bersama orang tua wali.',
        category: 'Akademik',
        semester: 'Gasal',
        target: 'Orang Tua & Siswa'
      },
      {
        id: 'cal-8',
        date: '21-02',
        month: 'DES',
        title: 'Libur Akhir Semester Gasal & Tahun Baru',
        desc: 'Masa libur pembelajaran akhir semester gasal dan libur pergantian tahun kalender sekolah.',
        category: 'Libur',
        semester: 'Gasal',
        target: 'Seluruh Siswa'
      },
      {
        id: 'cal-9',
        date: '05',
        month: 'JAN',
        title: 'Hari Pertama Masuk Sekolah Semester Genap',
        desc: 'Awal kegiatan belajar mengajar efektif semester genap tahun ajaran 2026/2027 dan penguatan komitmen belajar.',
        category: 'Akademik',
        semester: 'Genap',
        target: 'Seluruh Siswa'
      },
      {
        id: 'cal-10',
        date: '18-20',
        month: 'FEB',
        title: 'Pekan Olahraga & Seni Antar Kelas (PORSENI)',
        desc: 'Ajang kompetisi olahraga mini atletik, senam, tari tradisional, menggambar, dan menyanyi antar kelas.',
        category: 'Kegiatan',
        semester: 'Genap',
        target: 'Kelas 1 - 6'
      },
      {
        id: 'cal-11',
        date: '08-13',
        month: 'MAR',
        title: 'Penilaian Tengah Semester (PTS) Genap',
        desc: 'Asesmen sumatif tengah semester genap untuk memantau pemahaman materi pembelajaran para peserta didik.',
        category: 'Ujian',
        semester: 'Genap',
        target: 'Kelas 1 - 6'
      },
      {
        id: 'cal-12',
        date: '04-09',
        month: 'MEI',
        title: 'Asesmen Akhir Jenjang Sekolah (Ujian Sekolah Kelas 6)',
        desc: 'Pelaksanaan ujian sumatif kelulusan dan evaluasi capaian kompetensi akhir jenjang bagi siswa kelas 6.',
        category: 'Ujian',
        semester: 'Genap',
        target: 'Siswa Kelas 6'
      },
      {
        id: 'cal-13',
        date: '08-13',
        month: 'JUN',
        title: 'Penilaian Akhir Tahun (PAT) Semester Genap',
        desc: 'Asesmen sumatif akhir tahun ajaran sebagai dasar penentuan kenaikan kelas bagi peserta didik kelas 1 sampai kelas 5.',
        category: 'Ujian',
        semester: 'Genap',
        target: 'Kelas 1 - 5'
      },
      {
        id: 'cal-14',
        date: '20',
        month: 'JUN',
        title: 'Penerimaan Rapor Kenaikan Kelas & Wisuda Kelas 6',
        desc: 'Penyerahan laporan hasil belajar kenaikan kelas serta prosesi pelepasan siswa kelas 6 menuju jenjang SMP.',
        category: 'Akademik',
        semester: 'Genap',
        target: 'Seluruh Warga Sekolah'
      }
    ],
    schoolHabits: [
      {
        id: 'habit-1',
        title: 'Literasi 15 Menit',
        desc: 'Pembiasaan membaca buku sebelum pelajaran dimulai untuk mengasah minat baca dan daya tangkap pengetahuan siswa.',
        category: 'Akademik'
      },
      {
        id: 'habit-2',
        title: 'Karakter Pancasila',
        desc: 'Integrasi nilai-nilai gotong royong, kebhinekaan, dan kejujuran dalam setiap aktivitas pembelajaran Kurikulum Merdeka.',
        category: 'Karakter'
      },
      {
        id: 'habit-3',
        title: 'Sekolah Ramah Anak',
        desc: 'Lingkungan bebas perundungan (anti-bullying) dengan guru pendamping yang hangat, sabar, dan komunikatif.',
        category: 'Lingkungan'
      },
      {
        id: 'habit-4',
        title: 'Pramuka Wajib',
        desc: 'Pembinaan kedisiplinan, kemandirian, kecintaan alam, dan kepemimpinan melalui regu Kepramukaan Penggalang.',
        category: 'Kepemimpinan'
      }
    ],
    comfortStandards: [
      {
        id: 'comfort-1',
        title: 'Sanitasi & Toilet Bersih',
        desc: 'Toilet siswa laki-laki dan perempuan terpisah yang rutin dibersihkan secara berkala setiap hari.'
      },
      {
        id: 'comfort-2',
        title: 'Wastafel Cuci Tangan',
        desc: 'Wastafel cuci tangan lengkap dengan sabun cair tersedia di setiap selasar kelas untuk pembiasaan hidup sehat.'
      },
      {
        id: 'comfort-3',
        title: 'Kantin Sehat Sekolah',
        desc: 'Menyediakan sarana konsumsi makanan dan minuman sehat yang higienis serta aman bagi perkembangan anak.'
      }
    ],
    inquiries: [
      {
        id: 'inq-1',
        name: 'Bapak Ahmad Fauzi',
        email: 'ahmad.fauzi@gmail.com',
        phone: '081298765432',
        subject: 'Informasi Pendaftaran Siswa Baru (PPDB)',
        message: 'Selamat pagi, saya ingin menanyakan jadwal resmi pembukaan PPDB untuk tahun ajaran baru dan persyaratan dokumen yang harus disiapkan. Terima kasih.',
        date: '2026-08-30 09:15',
        isRead: false
      }
    ]
  };

  // Default Centralized Firebase Firestore Configuration
  // Used as the fallback across all domains (sdn2ngeposari.my.id, workers.dev, localhost)
  // Can be customized/overridden dynamically via Admin Panel (saved in localStorage).
  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: '',
    projectId: '',
    appId: '',
    authDomain: ''
  };

  const SchoolConstants = {
    NAV_ITEMS,
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_BYTES,
    ITEMS_PER_PAGE,
    STORAGE_KEYS,
    DEFAULT_FIREBASE_CONFIG,
    INITIAL_DATA
  };

  root.SchoolConstants = SchoolConstants;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolConstants;
  }
})(typeof window !== 'undefined' ? window : global);
