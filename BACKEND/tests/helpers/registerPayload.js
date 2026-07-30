/**
 * Payload mínimo válido para POST /api/auth/register en tests.
 * `suffix` debe ser único por usuario (ej. Date.now() + índice).
 */
export const registerPayload = ({
  nombre = 'Usuario Test',
  email,
  password = 'Test1234!',
  rol = 'turista',
  suffix = Date.now(),
  ...rest
} = {}) => ({
  nombre,
  email: email || `user+${suffix}@test.com`,
  password,
  telefono: `+57300${String(suffix).slice(-7).padStart(7, '0')}`,
  fecha_nacimiento: '1995-06-15',
  ciudad: 'Medellín',
  acepta_terminos: true,
  rol,
  ...rest,
});
