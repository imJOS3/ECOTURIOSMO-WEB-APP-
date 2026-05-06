import request from 'supertest';
import app from '../../app.js';

describe('Reseñas API', () => {

  it('should fail without auth', async () => {
    const res = await request(app)
      .post('/api/resenas')
      .send({
        comentario: 'Muy bueno',
        puntuacion: 5
      });

    expect(res.statusCode).toBe(401);
  });

});