import request from 'supertest';
import app from '../../app.js';

describe('Pagos API', () => {

  it('should fail without token', async () => {
    const res = await request(app)
      .post('/api/pagos')
      .send({
        monto: 100
      });

    expect(res.statusCode).toBe(401);
  });

});