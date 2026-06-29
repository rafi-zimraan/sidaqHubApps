jest.mock('@apollo/client', () => ({
  gql: jest.fn((strings: TemplateStringsArray, ...values: string[]) => {
    let result = '';
    for (let i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i < values.length) result += values[i];
    }
    return result;
  }),
}));

import { LOGIN_MUTATION, REGISTER_MUTATION, UPDATE_PROFILE_MUTATION } from '@/src/graphql/mutations';

describe('GraphQL Mutations', () => {
  it('LOGIN_MUTATION is defined', () => {
    expect(LOGIN_MUTATION).toBeDefined();
    expect(typeof LOGIN_MUTATION).toBe('string');
  });

  it('LOGIN_MUTATION contains Login keyword', () => {
    expect(LOGIN_MUTATION).toContain('Login');
  });

  it('LOGIN_MUTATION requests token and user', () => {
    expect(LOGIN_MUTATION).toContain('token');
    expect(LOGIN_MUTATION).toContain('user');
  });

  it('LOGIN_MUTATION includes all user fields', () => {
    const fields = ['id', 'name', 'email', 'role', 'uniqueId', 'username', 'phone', 'birthday'];
    for (const f of fields) expect(LOGIN_MUTATION).toContain(f);
  });

  it('LOGIN_MUTATION includes huffadzProfile', () => {
    expect(LOGIN_MUTATION).toContain('huffadzProfile');
    expect(LOGIN_MUTATION).toContain('juzProgress');
    expect(LOGIN_MUTATION).toContain('verifiedJuz');
    expect(LOGIN_MUTATION).toContain('badge_tier: badgeTier');
    expect(LOGIN_MUTATION).toContain('gender');
    expect(LOGIN_MUTATION).toContain('interests');
    expect(LOGIN_MUTATION).toContain('hobbies');
    expect(LOGIN_MUTATION).toContain('skillsList');
    expect(LOGIN_MUTATION).toContain('experiences');
  });

  it('REGISTER_MUTATION is defined', () => {
    expect(REGISTER_MUTATION).toBeDefined();
    expect(REGISTER_MUTATION).toContain('Register');
  });

  it('REGISTER_MUTATION includes all user fields', () => {
    const fields = ['id', 'name', 'email', 'role', 'uniqueId', 'username', 'phone', 'birthday'];
    for (const f of fields) expect(REGISTER_MUTATION).toContain(f);
  });

  it('REGISTER_MUTATION includes huffadzProfile fields', () => {
    expect(REGISTER_MUTATION).toContain('juzProgress');
    expect(REGISTER_MUTATION).toContain('bio');
    expect(REGISTER_MUTATION).toContain('skillsList');
    expect(REGISTER_MUTATION).toContain('showSkills');
  });

  it('UPDATE_PROFILE_MUTATION is defined', () => {
    expect(UPDATE_PROFILE_MUTATION).toBeDefined();
    expect(UPDATE_PROFILE_MUTATION).toContain('UpdateProfile');
  });

  it('UPDATE_PROFILE_MUTATION includes all user fields', () => {
    const fields = ['id', 'name', 'email', 'role', 'uniqueId', 'username', 'phone', 'birthday'];
    for (const f of fields) expect(UPDATE_PROFILE_MUTATION).toContain(f);
  });

  it('all mutations have different content', () => {
    expect(LOGIN_MUTATION).not.toBe(REGISTER_MUTATION);
    expect(REGISTER_MUTATION).not.toBe(UPDATE_PROFILE_MUTATION);
  });
});
