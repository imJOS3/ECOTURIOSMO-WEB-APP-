const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

export const normalizePhone = (value = '') => String(value).replace(/[^\d+]/g, '').trim();

export const calcAge = (fechaNacimiento) => {
  const birth = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

export const validateStrongPassword = (password = '') => {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (!/[a-z]/.test(password)) return 'La contraseña debe incluir al menos una letra minúscula.';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe incluir al menos una letra mayúscula.';
  if (!/\d/.test(password)) return 'La contraseña debe incluir al menos un número.';
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'La contraseña debe incluir al menos un símbolo.';
  }
  return '';
};

/**
 * Valida y normaliza el payload de registro.
 * @returns {{ data: object } | { error: string }}
 */
export const validateRegisterPayload = (body = {}) => {
  const nombre = String(body.nombre || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const telefono = normalizePhone(body.telefono);
  const fecha_nacimiento = String(body.fecha_nacimiento || '').trim();
  const ciudad = String(body.ciudad || '').trim();
  const acepta_terminos = Boolean(body.acepta_terminos);

  if (!nombre || nombre.length < 3) {
    return { error: 'Ingresa tu nombre completo (mínimo 3 caracteres).' };
  }
  if (!nombre.includes(' ')) {
    return { error: 'Ingresa nombre y apellido.' };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { error: 'Ingresa un correo electrónico válido.' };
  }

  const passwordError = validateStrongPassword(password);
  if (passwordError) return { error: passwordError };

  if (!fecha_nacimiento) {
    return { error: 'La fecha de nacimiento es obligatoria.' };
  }
  const age = calcAge(fecha_nacimiento);
  if (age == null) {
    return { error: 'Fecha de nacimiento inválida.' };
  }
  if (age < 18) {
    return { error: 'Debes ser mayor de 18 años para registrarte.' };
  }
  if (age > 120) {
    return { error: 'Fecha de nacimiento inválida.' };
  }

  if (!telefono || telefono.replace(/\D/g, '').length < 7) {
    return { error: 'Ingresa un teléfono válido (mínimo 7 dígitos).' };
  }
  if (!PHONE_RE.test(body.telefono || '')) {
    return { error: 'Formato de teléfono no válido.' };
  }

  if (!ciudad || ciudad.length < 2) {
    return { error: 'Ingresa tu ciudad de residencia.' };
  }

  if (!acepta_terminos) {
    return { error: 'Debes aceptar los términos y la política de privacidad.' };
  }

  return {
    data: {
      nombre,
      email,
      password,
      telefono,
      fecha_nacimiento,
      ciudad,
      acepta_terminos,
      rol: body.rol,
    },
  };
};
