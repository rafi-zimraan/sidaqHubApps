describe('GRAPHQL_URL config', () => {
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it('uses EXPO_PUBLIC_GRAPHQL_URL env var when set', () => {
    process.env.EXPO_PUBLIC_GRAPHQL_URL = 'https://custom.api.com/graphql';
    const { GRAPHQL_URL } = require('@/src/graphql/config');
    expect(GRAPHQL_URL).toBe('https://custom.api.com/graphql');
  });

  it('falls back to default URL when env var not set', () => {
    delete process.env.EXPO_PUBLIC_GRAPHQL_URL;
    const { GRAPHQL_URL } = require('@/src/graphql/config');
    expect(GRAPHQL_URL).toBe('https://api.sidaqhub.com/graphql');
  });

  it('uses fallback when env var is empty string', () => {
    process.env.EXPO_PUBLIC_GRAPHQL_URL = '';
    const { GRAPHQL_URL } = require('@/src/graphql/config');
    expect(GRAPHQL_URL).toBe('https://api.sidaqhub.com/graphql');
  });
});
