import { OAuth2Client } from 'google-auth-library';

let client;

const getClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw { status: 503, message: 'Google Sign-In no está configurado en el servidor' };
  }
  if (!client) {
    client = new OAuth2Client(clientId);
  }
  return { client, clientId };
};

/**
 * Verifica el JWT de Google Identity Services y devuelve el perfil.
 */
export const verifyGoogleCredential = async (credential) => {
  if (!credential) {
    throw { status: 400, message: 'Token de Google requerido' };
  }

  const { client, clientId } = getClient();

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
  } catch {
    throw { status: 401, message: 'Token de Google inválido o expirado' };
  }

  const payload = ticket.getPayload();
  if (!payload?.email || !payload?.sub) {
    throw { status: 401, message: 'No se pudo obtener el perfil de Google' };
  }

  if (payload.email_verified === false) {
    throw { status: 401, message: 'El correo de Google no está verificado' };
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    nombre: payload.name || payload.email.split('@')[0],
    avatarUrl: payload.picture || null,
  };
};
