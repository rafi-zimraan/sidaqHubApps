import { runHealthCheck } from '@/src/utils/appHealth';

jest.mock('@/src/graphql/config', () => ({
  GRAPHQL_URL: 'https://api.sidaqhub.com/graphql',
}));

describe('App Health Check', () => {
  let report: ReturnType<typeof runHealthCheck>;

  beforeAll(() => {
    report = runHealthCheck();
  });

  it('returns a valid report', () => {
    expect(report).toBeDefined();
    expect(report.timestamp).toBeDefined();
    expect(typeof report.score).toBe('number');
  });

  it('has a score between 0 and 100', () => {
    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThanOrEqual(100);
  });

  it('contains issues array', () => {
    expect(Array.isArray(report.issues)).toBe(true);
    expect(report.totalIssues).toBe(report.issues.length);
  });

  it('each issue has required fields', () => {
    for (const issue of report.issues) {
      expect(issue.id).toBeTruthy();
      expect(['critical', 'warning', 'info', 'optimization']).toContain(issue.severity);
      expect(issue.category).toBeTruthy();
      expect(issue.title).toBeTruthy();
      expect(issue.description).toBeTruthy();
      expect(issue.recommendation).toBeTruthy();
      expect(['easy', 'medium', 'hard']).toContain(issue.effort);
    }
  });

  it('counts match filtered arrays', () => {
    const critical = report.issues.filter((i) => i.severity === 'critical');
    const warnings = report.issues.filter((i) => i.severity === 'warning');
    const optimizations = report.issues.filter((i) => i.severity === 'optimization');
    const infos = report.issues.filter((i) => i.severity === 'info');

    expect(critical.length).toBe(report.criticalCount);
    expect(warnings.length).toBe(report.warningCount);
    expect(optimizations.length).toBe(report.optimizationCount);
    expect(infos.length).toBe(report.infoCount);
  });

  it('has summary and verdict', () => {
    expect(report.summary).toBeTruthy();
    expect(typeof report.summary).toBe('string');
    expect(report.verdict).toBeTruthy();
    expect(typeof report.verdict).toBe('string');
  });

  it('categories are diverse', () => {
    const categories = new Set(report.issues.map((i) => i.category));
    expect(categories.size).toBeGreaterThanOrEqual(5);
  });

  it('score is calculated correctly', () => {
    const critical = report.issues.filter((i) => i.severity === 'critical').length;
    const warnings = report.issues.filter((i) => i.severity === 'warning').length;
    const optimizations = report.issues.filter((i) => i.severity === 'optimization').length;
    const expected = Math.max(0, Math.min(100, 100 - critical * 15 - warnings * 8 - optimizations * 3));
    expect(report.score).toBe(expected);
  });

  it('handles repeated calls consistently', () => {
    const report2 = runHealthCheck();
    expect(report2.issues.length).toBe(report.issues.length);
    expect(report2.issues[0].id).toBe(report.issues[0].id);
  });
});
