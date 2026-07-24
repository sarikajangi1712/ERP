const request = require('supertest');
const app = require('../src/app');

describe('API Health & Authentication Tests', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });

  it('POST /api/auth/login with invalid credentials should return 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid_unregistered_user_random_xyz99@erp.com', password: 'definitely_wrong_password_999' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/customers without auth token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toEqual(401);
  });
});
