import request from 'supertest';
import app from '../../app.js';

describe('Usuarios API', () => {

  it('should fail without token', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.statusCode).toBe(401);
  });

});