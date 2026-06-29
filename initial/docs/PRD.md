# PRD — Product Requirements Document

## SidaqHub Application

### 1. Screens & Spesifikasi

#### 1.1 Auth Flow
| Screen | Route | Key Requirements |
|--------|-------|-----------------|
| **Login** | `/(auth)/login` | Input email + password toggle, remember me, forgot password (coming soon), login Google/Facebook (coming soon), auto-login mock |
| **Register** | `/(auth)/register` | Name, city, email, password (min 8 chars), confirm password dengan validation mismatch, terms & privacy links (coming soon) |
| **Onboarding** | `/(auth)/onboarding` | 3-step: Pilih role → Pilih Juz count → Pilih interests. Step tracker (dot). Wajib pilih role di step 1. Finish → save profile_completed=true |
| **Auth Handler** | `app/index.tsx` | Gate logic: no user → login, !profile_completed → onboarding, else → home |

#### 1.2 Home (Feed)
| Requirement | Detail |
|-------------|--------|
| Stories bar | Horizontal scroll, avatar ring (gold untuk unviewed), "Kamu" button untuk tambah story |
| Composer | Avatar + input placeholder "Apa yang ingin kamu bagikan hari ini?" + "Posting" button → /post/create |
| Filter tabs | Foto, Ayat, Tilawah — toggle filter on/off |
| Post card | Avatar, name, role, juz badge / komunitas badge. Content with highlight #hashtag. AyatBox / TilawahCard / HalaqahEmbed / AchievementBar berdasarkan tipe |
| Reactions | "Aamiin" button + count. Reaction cluster (tumpuk emoji) |
| Comments | Top 2 comment preview dengan avatar |
| Empty state | Ilustrasi + "Buat Postingan" CTA |
| Refresh | Pull-to-refresh |

#### 1.3 Profile
| Requirement | Detail |
|-------------|--------|
| Cover | Linear gradient + decorative circles + avatar dengan glow ring |
| Profile card | Edit Profil button, name, username, badge pill, bio, meta info, stats row (pengikut, mengikuti, juz, sertifikat) |
| Progres Hafalan | Circle progress, JuzGrid 1-30 (hafal/sedang/belum), legend |
| Sertifikasi | Horizontal scroll cards (title, org, year) |
| Keahlian & Bakat | Chip grid dengan highlight |
| Pengalaman | List items (role, place, period) |
| Logout | Alert konfirmasi → redirect ke login |

#### 1.4 Network (Jejaring)
| Requirement | Detail |
|-------------|--------|
| Header | Search bar + filter chips (Semua, Huffadz, Komunitas, Halaqah, Pesantren) |
| Stats row | Pengikut, Mengikuti, Komunitas, Halaqah |
| Saran Koneksi | Horizontal scroll cards, follow/unfollow toggle |
| Komunitas Populer | Horizontal scroll cards, join toggle |
| Halaqah Aktif | Cards dengan platform badge, slot bar, Gabung button |
| Huffadz Dekat | Location-based rows (dummy distance "mutasi"), follow toggle |
| Animasi | Micro-interactions spring scale on PressBtn |

#### 1.5 Community & Halaqah
| Requirement | Detail |
|-------------|--------|
| Tabs | Halaqah tab / Komunitas tab |
| Halaqah list | Platform badge, slot tersisa / "Penuh", progress bar slot, schedule, description |
| Community list | Avatar, name, verified badge, description, member count, join/ikuti toggle |
| Create Halaqah | Form: title, juz range, description, platform (Zoom/Meet/Offline), link, date, time, max slots |
| Empty state | Ilustrasi + Create CTAs |

#### 1.6 Notifications
| Requirement | Detail |
|-------------|--------|
| Types | follow, reaction, comment, halaqah_register — each with emoji icon |
| Unread | Gold dot indicator + blue left border + "X belum dibaca" header |
| Mark read | Per-item tap & "Tandai semua dibaca" button |
| Empty state | Ilustrasi + pesan "Notifikasi akan muncul..." |

#### 1.7 Create Post
| Requirement | Detail |
|-------------|--------|
| Type selector | Teks / Ayat — toggle |
| Ayat mode | Teks Arab (right-aligned, Amiri font), reference, translation |
| Content textarea | Min 120px height |
| Hashtags | Comma-separated input |
| Visibility | Publik / Koneksi |
| Submit | Validasi + spinner |

#### 1.8 Edit Profile
| Requirement | Detail |
|-------------|--------|
| Avatar | Tap to pick from gallery (expo-image-picker) with camera badge overlay |
| Fields | Name, city, bio, juz count, role selector, interests chip |
| Save | apiPut ke /api/users/me, update context, alert success |

### 2. Data Layer Requirements
- Semua API call melalui `src/utils/api.ts` (wrapper dengan delay 250ms)
- Data bersumber dari `src/utils/mock.ts` — satu sumber kebenaran
- Tidak ada integrasi backend nyata saat ini
- Token disimpan di memory state (AuthContext), tidak persistent

### 3. Non-Functional Requirements
| Aspek | Target |
|-------|--------|
| Loading state | Skeleton/indicator di semua screen |
| Error handling | Try/catch di semua async operation, tidak crash |
| Animation | Fade-in 220ms on screen focus |
| Platform | Android, iOS, Web (via react-native-web) |
| Font fallback | Tidak blocking render saat font CDN lambat |
