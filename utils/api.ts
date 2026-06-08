// ============================================================================
// API LAYER (MOCK) — tanpa backend / URL.
// Semua pemanggilan dikembalikan dari data dummy lokal (utils/mock.ts).
// Tanda tangan fungsi sengaja dipertahankan supaya screen tidak perlu diubah.
// ============================================================================
import { resolveGet, resolveMutation } from './mock';

// delay kecil agar loading state & RefreshControl tetap terlihat saat review
const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const apiGet = (path: string) => delay(resolveGet(path));
export const apiPost = (path: string, body?: unknown) =>
  delay(resolveMutation('POST', path, body));
export const apiPut = (path: string, body?: unknown) =>
  delay(resolveMutation('PUT', path, body));
export const apiDelete = (path: string) =>
  delay(resolveMutation('DELETE', path));
