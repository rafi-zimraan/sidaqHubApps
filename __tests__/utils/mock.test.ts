import { resolveGet, resolveMutation, POSTS, USERS, COMMUNITIES, HALAQAHS } from '@/src/utils/mock';

describe('resolveGet', () => {
  it('returns posts feed', () => {
    const result = resolveGet('/api/posts/feed');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('post_id');
  });

  it('returns stories', () => {
    const result = resolveGet('/api/stories');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns communities', () => {
    const result = resolveGet('/api/communities');
    expect(result).toEqual(COMMUNITIES);
  });

  it('returns halaqahs', () => {
    const result = resolveGet('/api/halaqahs');
    expect(result).toEqual(HALAQAHS);
  });

  it('returns notifications', () => {
    const result = resolveGet('/api/notifications');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns connections', () => {
    const result = resolveGet('/api/network/connections');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns suggestions', () => {
    const result = resolveGet('/api/network/suggestions');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns current user', () => {
    const result = resolveGet('/api/users/me');
    expect(result).toHaveProperty('user_id', 'me');
  });

  it('returns post by id', () => {
    const result = resolveGet('/api/posts/p1');
    expect(result).toHaveProperty('post_id', 'p1');
  });

  it('returns fallback post for non-existent id', () => {
    const result = resolveGet('/api/posts/nonexistent');
    expect(result).toHaveProperty('post_id');
  });

  it('returns comments for a post', () => {
    const result = resolveGet('/api/posts/p1/comments');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns user by id', () => {
    const result = resolveGet('/api/users/u1');
    expect(result).toHaveProperty('user_id', 'u1');
  });

  it('returns current user for "me"', () => {
    const result = resolveGet('/api/users/me');
    expect(result).toHaveProperty('user_id', 'me');
  });

  it('returns user posts for "me"', () => {
    const result = resolveGet('/api/users/me/posts');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns halaqah by id', () => {
    const result = resolveGet('/api/halaqahs/h1');
    expect(result).toHaveProperty('halaqah_id', 'h1');
  });

  it('returns empty array for unknown path', () => {
    const result = resolveGet('/api/unknown/path');
    expect(result).toEqual([]);
  });
});

describe('resolveMutation', () => {
  it('updates user profile on PUT /api/users/me', () => {
    const result = resolveMutation('PUT', '/api/users/me', { bio: 'updated bio' });
    expect(result).toHaveProperty('bio', 'updated bio');
    expect(result).toHaveProperty('user_id', 'me');
  });

  it('creates comment on POST', () => {
    const result = resolveMutation('POST', '/api/posts/p1/comments', { content: 'test comment' });
    expect(result).toHaveProperty('comment_id');
    expect(result).toHaveProperty('content', 'test comment');
    expect(result).toHaveProperty('created_at');
  });

  it('returns empty object for unknown mutation', () => {
    const result = resolveMutation('DELETE', '/api/unknown');
    expect(result).toEqual({});
  });
});
