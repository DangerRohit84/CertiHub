/**
 * QA regression tests for "Failed to sync system analytics" fix.
 * - Role-based auth: student 403, admin/institution 200 (legacy email allowlist retained)
 * - Timestamp fallback chain: missing doc.createTime must NOT 500
 * - Frontend guard: (recentActivity || []).filter + (title || '')
 */
const fs = require('fs');
const path = require('path');

jest.mock('firebase-admin', () => ({
  apps: [{}],
  firestore: jest.fn(),
}));

const admin = require('firebase-admin');
const { getAdminStats } = require('../controllers/adminController');
const { checkRole } = require('../middleware/auth');

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((payload) => {
    res.body = payload;
    return res;
  });
  return res;
}

function mockFirestore(certDocs, userDocs) {
  const col = (docs) => ({
    limit: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({ docs }),
    })),
  });
  admin.firestore.mockReturnValue({
    collection: jest.fn((name) => {
      if (name === 'certificates') return col(certDocs);
      if (name === 'users') return col(userDocs);
      return col([]);
    }),
  });
}

const certDoc = (id, data, createTime) => ({
  id,
  data: () => data,
  ...(createTime !== undefined ? { createTime } : {}),
});

describe('QA: admin analytics auth (role-based)', () => {
  beforeEach(() => jest.clearAllMocks());

  test('checkRole middleware: student blocked 403, admin/institution pass', () => {
    const mw = checkRole(['admin', 'institution']);

    const blocked = mockRes();
    let nextCalled = false;
    mw({ user: { role: 'student' } }, blocked, () => { nextCalled = true; });
    expect(blocked.status).toHaveBeenCalledWith(403);
    expect(nextCalled).toBe(false);

    for (const role of ['admin', 'institution']) {
      const okRes = mockRes();
      let okNext = false;
      mw({ user: { role } }, okRes, () => { okNext = true; });
      expect(okNext).toBe(true);
    }
  });

  test('getAdminStats: student + non-allowlist email => 403', async () => {
    mockFirestore([], []);
    const req = { user: { email: 'student@test.com', role: 'student' }, query: {} };
    const res = mockRes();
    await getAdminStats(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.body.error).toMatch(/Access denied/);
  });

  test('getAdminStats: admin role => 200', async () => {
    mockFirestore([], [{ id: 'u1', data: () => ({ isVerified: true }) }]);
    const req = { user: { email: 'real-admin@college.edu', role: 'admin' }, query: {} };
    const res = mockRes();
    await getAdminStats(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalCertificates');
    expect(res.body).toHaveProperty('recentActivity');
  });

  test('getAdminStats: institution role => 200', async () => {
    mockFirestore([], []);
    const req = { user: { email: 'dept@college.edu', role: 'institution' }, query: {} };
    const res = mockRes();
    await getAdminStats(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('getAdminStats: legacy allowlist email still passes (backwards compat)', async () => {
    mockFirestore([], []);
    const req = { user: { email: 'admin@certihub.com', role: 'student' }, query: {} };
    const res = mockRes();
    await getAdminStats(req, res);
    // Legacy demo/bootstrap accounts retained via OR gate
    expect(res.json).toHaveBeenCalled();
  });

  test('no hardcoded email-ONLY gate remains (must be role OR email)', () => {
    const src = fs.readFileSync(path.join(__dirname, '../controllers/adminController.js'), 'utf8');
    expect(src).not.toContain("if (req.user.email !== 'admin@certihub.com'");
    expect(src).toContain('hasAnalyticsRole');
    expect(src).toContain("req.user.role === 'admin'");
    expect(src).toContain("req.user.role === 'institution'");
  });
});

describe('QA: timestamp fallback chain (was 500 on missing createTime)', () => {
  beforeEach(() => jest.clearAllMocks());

  test('docs with missing/invalid createTime do NOT 500 — fallback to createdAt/now', async () => {
    const docs = [
      // Firestore Timestamp-like createdAt
      certDoc('c1', { title: 'T1', issuer: 'I1', createdAt: { toDate: () => new Date('2024-01-15') } }),
      // ISO string createdAt
      certDoc('c2', { title: 'T2', issuer: 'I2', createdAt: '2024-06-01' }),
      // valid snapshot createTime
      certDoc('c3', { title: 'T3', issuer: 'I3' }, { toDate: () => new Date('2025-03-10') }),
      // no timestamps at all — must fallback to now, not throw
      certDoc('c4', { title: 'T4', issuer: 'I4' }),
      // throwing toDate — must fallback to now, not throw
      certDoc('c5', { title: 'T5', issuer: 'I5' }, { toDate: () => { throw new Error('bad'); } }),
      // null title to exercise frontend (title || '') path on backend default
      certDoc('c6', { issuer: 'I6' }),
    ];
    mockFirestore(docs, []);
    const req = { user: { email: 'a@x.com', role: 'admin' }, query: { range: 'ALL' } };
    const res = mockRes();
    await getAdminStats(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body.totalCertificates).toBe(6);
    expect(res.body.recentActivity.length).toBeGreaterThan(0);
    // every recentActivity.createdAt must be a valid date
    for (const a of res.body.recentActivity) {
      expect(new Date(a.createdAt).toString()).not.toBe('Invalid Date');
    }
  });

  test('range filter does not crash on fallback dates', async () => {
    const docs = [certDoc('c1', { title: 'T', issuer: 'I' })];
    mockFirestore(docs, []);
    const req = { user: { email: 'a@x.com', role: 'admin' }, query: { range: '7D' } };
    const res = mockRes();
    await getAdminStats(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.body).toHaveProperty('growthData');
  });
});

describe('QA: frontend guard (was crash on undefined recentActivity/title)', () => {
  test('AdminDashboard.jsx uses guarded filter', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '../../frontend/src/pages/AdminDashboard.jsx'),
      'utf8'
    );
    expect(src).toContain('(stats?.recentActivity || [])');
    expect(src).toContain("(a.title || '')");
    expect(src).not.toContain('stats?.recentActivity.filter(a => a.title.toLowerCase()');
  });

  test('guarded filter logic handles undefined/null safely', () => {
    const statsUndefined = undefined;
    expect(() => {
      const out = (statsUndefined?.recentActivity || [])
        .filter((a) => (a.title || '').toLowerCase().includes('test'));
      expect(out).toEqual([]);
    }).not.toThrow();

    const statsNullTitles = { recentActivity: [{ title: null }, {}, { title: 'Test Cert' }] };
    const filtered = (statsNullTitles?.recentActivity || []).filter((a) =>
      (a.title || '').toLowerCase().includes('test')
    );
    expect(filtered.length).toBe(1);
  });
});

describe('QA: Groq migration ad4d412 no regression', () => {
  test('aiService + careerController use new models, no retired IDs in code', () => {
    const ai = fs.readFileSync(path.join(__dirname, '../utils/aiService.js'), 'utf8');
    const career = fs.readFileSync(path.join(__dirname, '../controllers/careerController.js'), 'utf8');
    expect(ai).toContain('openai/gpt-oss-120b');
    expect(ai).toContain('qwen/qwen3.8-27b');
    expect(career).toContain('openai/gpt-oss-120b');
    // retired IDs must appear only in comments, never as active model strings
    const stripComments = (s) => s.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
    expect(stripComments(ai)).not.toContain('llama-3.3-70b-versatile');
    expect(stripComments(ai)).not.toContain('qwen/qwen3.6-27b');
    expect(stripComments(career)).not.toContain('llama-3.3-70b-versatile');
  });
});
