import request from 'supertest';
import app from '../../app.js';

describe('Reservas API', () => {

  it('should fail without auth', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({
        alojamiento_id: 1
      });

    expect(res.statusCode).toBe(401);
  });

});