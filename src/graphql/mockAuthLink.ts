import { ApolloLink, Observable, type FetchResult } from '@apollo/client';
import type { RawUser } from '@/src/context/AuthContext';

// Dummy login/register response — aktif sementara selagi field LoginInput/RegisterInput
// asli dari backend belum dikonfirmasi tim backend (lihat internal/docs/auth-tuning-plan.md).
// Matikan dengan EXPO_PUBLIC_USE_MOCK_AUTH=false setelah schema real terkonfirmasi.
export const USE_MOCK_AUTH = process.env.EXPO_PUBLIC_USE_MOCK_AUTH !== 'false';

const DUMMY_RAW_USER: RawUser = {
  id: 'dummy-1',
  name: 'Ahmad Fauzi Al-Hafiz',
  email: 'huffadz@sidaqhub.id',
  role: 'huffadz',
  uniqueId: 'sidaq-0001',
  photo_url: null,
  cover_photo_url: null,
  username: 'ahmadfauzi',
  phone: '081234567890',
  birthday: '1998-04-12',
  province_id: 1,
  city_id: 1,
  verification_level: 'basic',
  huffadzProfile: {
    city: 'Bandung',
    province: 'Jawa Barat',
    bio: 'Penghafal Al-Quran, alhamdulillah 15 juz. Sedang murajaah istiqamah setiap hari.',
    verifiedJuz: 15,
    badge_tier: 'gold',
    gender: 'L',
    interests: ['Tahfidz', 'Tajwid', 'Tilawah'],
    hobbies: ['Membaca'],
    juzProgress: 15,
    experiences: [],
    certificationsList: [],
    skillsList: [],
    showSkills: true,
    showExperiences: true,
  },
  city: { id: 1, name: 'Bandung' },
  province: { id: 1, name: 'Jawa Barat' },
};

const MOCKED_OPERATIONS: Record<string, string> = {
  Login: 'login',
  Register: 'register',
};

export const mockAuthLink = new ApolloLink((operation, forward) => {
  const responseKey = MOCKED_OPERATIONS[operation.operationName ?? ''];
  if (!USE_MOCK_AUTH || !responseKey) {
    return forward(operation);
  }

  return new Observable<FetchResult>((observer) => {
    const input = operation.variables?.input ?? {};
    const timer = setTimeout(() => {
      observer.next({
        data: {
          [responseKey]: {
            token: `dummy-token-${Date.now()}`,
            user: {
              ...DUMMY_RAW_USER,
              name: input.name?.trim() || DUMMY_RAW_USER.name,
              email: input.email?.trim() || DUMMY_RAW_USER.email,
            },
          },
        },
      });
      observer.complete();
    }, 400);
    return () => clearTimeout(timer);
  });
});
