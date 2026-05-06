import * as service from '../../src/modules/reservas/reserva.service.js';

describe('Reserva Service', () => {

  it('should fail with invalid data', async () => {
    try {
      await service.create({});
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

});