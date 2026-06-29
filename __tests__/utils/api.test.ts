import { apiGet, apiPost, apiPut, apiDelete } from '@/src/utils/api';

jest.mock('@/src/utils/mock', () => ({
  resolveGet: jest.fn(() => [{ id: 'post1' }]),
  resolveMutation: jest.fn(() => ({ success: true })),
}));

describe('apiGet', () => {
  it('returns resolved data after delay', async () => {
    const data = await apiGet('/api/posts/feed');
    expect(data).toEqual([{ id: 'post1' }]);
  });
});

describe('apiPost', () => {
  it('returns mutation result after delay', async () => {
    const result = await apiPost('/api/posts', { content: 'test' });
    expect(result).toEqual({ success: true });
  });
});

describe('apiPut', () => {
  it('returns mutation result after delay', async () => {
    const result = await apiPut('/api/users/me', { name: 'new name' });
    expect(result).toEqual({ success: true });
  });
});

describe('apiDelete', () => {
  it('returns mutation result after delay', async () => {
    const result = await apiDelete('/api/posts/p1');
    expect(result).toEqual({ success: true });
  });
});
