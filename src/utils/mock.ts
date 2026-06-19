// ============================================================================
// MOCK DATA — sumber data dummy lokal (tanpa backend).
// Semua screen mengambil data dari sini lewat utils/api.ts.
// Ganti / tambah isi di sini untuk mengubah tampilan saat review UI.
// ============================================================================

/** Buat ISO timestamp "n menit lalu" agar formatTime() menampilkan relatif. */
const minsAgo = (n: number) => new Date(Date.now() - n * 60000).toISOString();
/** Buat ISO timestamp "n hari ke depan" untuk jadwal halaqah. */
const daysAhead = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

// ---------- USER SAAT INI (auto-login) ----------
export const CURRENT_USER = {
  user_id: 'me',
  email: 'huffadz@sidaqhub.id',
  name: 'Ahmad Fauzi Al-Hafiz',
  avatar_url: '',
  juz_count: 15,
  role: 'huffadz',
  city: 'Bandung',
  bio: 'Penghafal Al-Quran, alhamdulillah 15 juz. Sedang murajaah istiqamah setiap hari. 🌙',
  interests: ['Tahfidz', 'Tajwid', 'Tilawah'],
  followers_count: 248,
  following_count: 132,
  posts_count: 12,
  profile_completed: true,
};

export const MOCK_TOKEN = 'mock-token-local';

// ---------- USER LAIN ----------
export const USERS: any[] = [
  {
    user_id: 'u1', name: 'Ustadz Abdullah Hanif', role: 'ustadz', city: 'Jakarta',
    juz_count: 30, avatar_url: '', bio: 'Pembimbing tahfidz & pengajar tajwid. Lillahi ta\'ala.',
    interests: ['Tahfidz', 'Tajwid', 'Tafsir'],
    followers_count: 1240, following_count: 86, posts_count: 58, is_following: true,
    profile_completed: true,
  },
  {
    user_id: 'u2', name: 'Fatimah Az-Zahra', role: 'santri', city: 'Surabaya',
    juz_count: 8, avatar_url: '', bio: 'Santri tahfidz, target 30 juz insya Allah.',
    interests: ['Tahfidz', 'Qiraah'],
    followers_count: 96, following_count: 210, posts_count: 24, is_following: false,
    profile_completed: true,
  },
  {
    user_id: 'u3', name: 'Muhammad Rizki', role: 'huffadz', city: 'Yogyakarta',
    juz_count: 30, avatar_url: '', bio: 'Hafiz 30 juz. Yuk saling murajaah!',
    interests: ['Tahfidz', 'Tilawah', 'Hadits'],
    followers_count: 540, following_count: 120, posts_count: 41, is_following: false,
    profile_completed: true,
  },
  {
    user_id: 'u4', name: 'Aisyah Nuraini', role: 'santri', city: 'Depok',
    juz_count: 5, avatar_url: '', bio: 'Bismillah, memulai perjalanan hafalan.',
    interests: ['Tahfidz', 'Bahasa Arab'],
    followers_count: 32, following_count: 88, posts_count: 7, is_following: false,
    profile_completed: true,
  },
  {
    user_id: 'u5', name: 'Ustadz Salman Faris', role: 'ustadz', city: 'Bandung',
    juz_count: 30, avatar_url: '', bio: 'Mengajar halaqah online & offline.',
    interests: ['Tafsir', 'Fiqh'],
    followers_count: 870, following_count: 64, posts_count: 33, is_following: true,
    profile_completed: true,
  },
];

const userById = (id: string) => USERS.find((u) => u.user_id === id);

// ---------- POSTS ----------
export const POSTS: any[] = [
  {
    post_id: 'p1', type: 'ayat',
    content: 'Semoga kita semua diberi kemudahan dalam menghafal. Aamiin 🤲 #Tahfidz',
    ayat_text: 'وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ',
    ayat_reference: 'Al-Qamar: 17',
    translation: 'Dan sungguh telah Kami mudahkan Al-Quran untuk peringatan, maka adakah orang yang mau mengambil pelajaran?',
    hashtags: ['Tahfidz', 'Quran'],
    created_at: minsAgo(12), reactions_count: 1243, comments_count: 2, my_reaction: null,
    user: USERS[0],
    top_comments: [
      { comment_id: 'c1', content: 'Aamiin ya Rabb 🤲', created_at: minsAgo(8), user: { name: 'Fatimah Az-Zahra', role: 'santri' } },
      { comment_id: 'c2', content: 'Barakallahu fiik ustadz', created_at: minsAgo(5), user: { name: 'Muhammad Rizki', role: 'huffadz' } },
    ],
  },
  {
    post_id: 'p2', type: 'text',
    content: 'Alhamdulillah hari ini berhasil murajaah Juz 8 tanpa kesalahan. Perjalanan masih panjang tapi nikmat. #Murajaah #Istiqamah',
    hashtags: ['Murajaah', 'Istiqamah'],
    created_at: minsAgo(45), reactions_count: 312, comments_count: 1, my_reaction: 'aamiin',
    user: USERS[1], achievement_juz: 8,
    top_comments: [
      { comment_id: 'c3', content: 'MasyaAllah, semangat terus!', created_at: minsAgo(30), user: { name: 'Aisyah Nuraini', role: 'santri' } },
    ],
  },
  {
    post_id: 'p3', type: 'tilawah',
    content: 'Tilawah Surah Ar-Rahman pagi ini. Semoga menenangkan hati yang mendengar. 🎧',
    ayat_reference: 'Surah Ar-Rahman 1-13', audio_duration: '4:18',
    hashtags: ['Tilawah'],
    created_at: minsAgo(120), reactions_count: 689, comments_count: 0, my_reaction: null,
    user: USERS[2],
  },
  {
    post_id: 'p4', type: 'text',
    content: 'Pendaftaran halaqah murajaah malam ini sudah dibuka. Yuk gabung, slot terbatas!',
    created_at: minsAgo(180), reactions_count: 154, comments_count: 0, my_reaction: null,
    community: { name: 'Komunitas Huffadz Nusantara', members_count: 8420 },
    halaqah: { halaqah_id: 'h1', title: 'Murajaah Juz 1-5 Bersama', registered_count: 18, max_slots: 25 },
  },
  {
    post_id: 'p5', type: 'text',
    content: 'Tips menjaga hafalan: ulangi minimal 1 juz setiap hari, jangan menunda. Konsistensi mengalahkan intensitas. #TipsHafalan',
    hashtags: ['TipsHafalan', 'Tahfidz'],
    created_at: minsAgo(300), reactions_count: 921, comments_count: 0, my_reaction: null,
    user: USERS[4],
  },
];

// ---------- STORIES ----------
export const STORIES: any[] = [
  { user: USERS[0], has_unviewed: true },
  { user: USERS[2], has_unviewed: true },
  { user: USERS[1], has_unviewed: false },
  { user: USERS[4], has_unviewed: true },
];

// ---------- COMMENTS (dipakai untuk semua detail post) ----------
export const COMMENTS: any[] = [
  { comment_id: 'c1', content: 'Aamiin ya Rabb 🤲 Barakallahu fiik.', created_at: minsAgo(8), user: USERS[1] },
  { comment_id: 'c2', content: 'MasyaAllah, jazakallahu khairan atas pengingatnya.', created_at: minsAgo(5), user: USERS[2] },
  { comment_id: 'c3', content: 'Semoga kita semua istiqamah. 🌙', created_at: minsAgo(2), user: USERS[3] },
];

// ---------- COMMUNITIES ----------
export const COMMUNITIES: any[] = [
  {
    community_id: 'cm1', name: 'Komunitas Huffadz Nusantara',
    description: 'Wadah silaturahmi & murajaah bersama para penghafal Al-Quran se-Indonesia.',
    avatar_url: '', members_count: 8420, is_member: true, is_verified: true,
  },
  {
    community_id: 'cm2', name: 'Santri Tahfidz Jawa Barat',
    description: 'Komunitas santri tahfidz wilayah Jawa Barat. Saling menyemangati hafalan.',
    avatar_url: '', members_count: 3210, is_member: false, is_verified: false,
  },
  {
    community_id: 'cm3', name: 'One Day One Juz',
    description: 'Gerakan membaca & murajaah satu juz setiap hari.',
    avatar_url: '', members_count: 15600, is_member: false, is_verified: true,
  },
  {
    community_id: 'cm4', name: 'Tilawah & Qiraah Indonesia',
    description: 'Belajar tilawah, tahsin, dan ragam qiraah bersama para qari.',
    avatar_url: '', members_count: 2040, is_member: false, is_verified: false,
  },
];

// ---------- HALAQAHS ----------
export const HALAQAHS: any[] = [
  {
    halaqah_id: 'h1', title: 'Murajaah Juz 1-5 Bersama',
    description: 'Halaqah murajaah rutin untuk menjaga hafalan Juz 1 sampai 5. Setoran bergiliran dan koreksi tajwid.',
    juz_range: 'Juz 1-5', platform: 'Zoom', platform_link: 'https://zoom.us/j/1234567890',
    max_slots: 25, registered_count: 18, is_registered: false,
    schedule: daysAhead(1), ustadz_name: 'Ustadz Abdullah Hanif', ustadz: USERS[0],
  },
  {
    halaqah_id: 'h2', title: 'Tahsin & Tajwid untuk Pemula',
    description: 'Kelas dasar memperbaiki bacaan sesuai kaidah tajwid. Cocok untuk yang baru memulai.',
    juz_range: 'Juz 30', platform: 'Google Meet', platform_link: 'https://meet.google.com/abc-defg-hij',
    max_slots: 20, registered_count: 20, is_registered: false,
    schedule: daysAhead(2), ustadz_name: 'Ustadz Salman Faris', ustadz: USERS[4],
  },
  {
    halaqah_id: 'h3', title: 'Setoran Hafalan Juz 28-30',
    description: 'Halaqah setoran hafalan juz akhir. Target khatam murajaah dalam 3 bulan.',
    juz_range: 'Juz 28-30', platform: 'Offline', platform_link: '',
    max_slots: 15, registered_count: 9, is_registered: true,
    schedule: daysAhead(3), ustadz_name: 'Muhammad Rizki', ustadz: USERS[2],
  },
  {
    halaqah_id: 'h4', title: 'Murajaah Malam Pekanan',
    description: 'Murajaah bersama setiap malam Ahad. Menjaga hafalan agar tidak hilang.',
    juz_range: 'Bebas', platform: 'Zoom', platform_link: 'https://zoom.us/j/9876543210',
    max_slots: 30, registered_count: 12, is_registered: false,
    schedule: daysAhead(5), ustadz_name: 'Ustadz Abdullah Hanif', ustadz: USERS[0],
  },
];

// ---------- NOTIFICATIONS ----------
export const NOTIFICATIONS: any[] = [
  { notification_id: 'n1', type: 'reaction', message: 'Ustadz Abdullah Hanif mengucap Aamiin pada postinganmu', created_at: minsAgo(5), is_read: false },
  { notification_id: 'n2', type: 'comment', message: 'Fatimah Az-Zahra mengomentari postinganmu', created_at: minsAgo(40), is_read: false },
  { notification_id: 'n3', type: 'follow', message: 'Muhammad Rizki mulai mengikutimu', created_at: minsAgo(150), is_read: false },
  { notification_id: 'n4', type: 'halaqah_register', message: 'Pendaftaran halaqah "Murajaah Juz 1-5" berhasil', created_at: minsAgo(400), is_read: true },
  { notification_id: 'n5', type: 'reaction', message: 'Aisyah Nuraini mengucap Aamiin pada postinganmu', created_at: minsAgo(800), is_read: true },
];

// ---------- NETWORK ----------
export const CONNECTIONS: any[] = [USERS[0], USERS[4]];
export const SUGGESTIONS: any[] = [USERS[1], USERS[2], USERS[3]];

// ============================================================================
// RESOLVER — dipetakan dari path API ke data dummy di atas.
// ============================================================================

export function resolveGet(path: string): any {
  // exact matches
  switch (path) {
    case '/api/posts/feed': return POSTS;
    case '/api/stories': return STORIES;
    case '/api/communities': return COMMUNITIES;
    case '/api/halaqahs': return HALAQAHS;
    case '/api/notifications': return NOTIFICATIONS;
    case '/api/network/connections': return CONNECTIONS;
    case '/api/network/suggestions': return SUGGESTIONS;
    case '/api/users/me': return CURRENT_USER;
  }

  let m: RegExpMatchArray | null;

  // /api/posts/:id/comments
  if ((m = path.match(/^\/api\/posts\/([^/]+)\/comments$/))) return COMMENTS;

  // /api/posts/:id
  if ((m = path.match(/^\/api\/posts\/([^/]+)$/))) {
    return POSTS.find((p) => p.post_id === m![1]) ?? POSTS[0];
  }

  // /api/users/:id/posts
  if ((m = path.match(/^\/api\/users\/([^/]+)\/posts$/))) {
    if (m[1] === 'me' || m[1] === CURRENT_USER.user_id) return POSTS.slice(0, 3);
    return POSTS.slice(0, 2);
  }

  // /api/users/:id
  if ((m = path.match(/^\/api\/users\/([^/]+)$/))) {
    if (m[1] === 'me' || m[1] === CURRENT_USER.user_id) return CURRENT_USER;
    return userById(m[1]) ?? USERS[0];
  }

  // /api/halaqahs/:id
  if ((m = path.match(/^\/api\/halaqahs\/([^/]+)$/))) {
    return HALAQAHS.find((h) => h.halaqah_id === m![1]) ?? HALAQAHS[0];
  }

  // default: list kosong agar screen tidak error
  return [];
}

/** Untuk POST/PUT/DELETE — kembalikan objek yang dibutuhkan screen. */
export function resolveMutation(method: string, path: string, body?: any): any {
  // Update profil → kembalikan user hasil merge
  if (path === '/api/users/me') {
    Object.assign(CURRENT_USER, body || {});
    return CURRENT_USER;
  }
  // Tambah komentar → kembalikan objek komentar baru
  if (/^\/api\/posts\/[^/]+\/comments$/.test(path) && method === 'POST') {
    return {
      comment_id: `c-${Date.now()}`,
      content: (body && body.content) || '',
      created_at: new Date().toISOString(),
    };
  }
  // sisanya cukup sukses
  return {};
}
