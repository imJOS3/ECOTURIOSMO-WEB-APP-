
export const PLACEHOLDER_META = {
  huespedes: 4,
  habitaciones: 1,
  camas: 2,
  banos: 1,
};

export const PLACEHOLDER_HOST = {
  nombre: "Anfitrión EcoTurismo",
  avatarUrl: null, // null → se muestra la inicial del nombre en un círculo
  desde: "2025-06-01", // fecha ficticia, solo para simular "X meses anfitrionando"
  verificado: true,
  esSuperanfitrion: true,
  numResenas: 67,
  calificacion: 4.9,
  ocupacion: "Guía de turismo local",
  ciudad: "Santa Marta",
  pais: "Colombia",
  indiceRespuesta: 100, // %
  tiempoRespuesta: "menos de una hora",
};

// "Lo que debes saber" — política de cancelación, reglas de la casa y
// seguridad. Contenido genérico de plantilla; en producción normalmente
// cada anfitrión define esto por alojamiento.
export const PLACEHOLDER_RULES = {
  cancelacion: {
    titulo: "Cancelación flexible",
    descripcion: "Cancelación gratuita hasta 48 horas antes del check-in. Después de ese plazo, se aplican las políticas del anfitrión.",
  },
  reglas: [
    "Máximo de huéspedes según la capacidad indicada",
    "No se permiten fiestas ni eventos",
    "Prohibido fumar dentro del alojamiento",
  ],
  seguridad: [
    "Detector de humo",
    "Botiquín de primeros auxilios",
    "Extintor disponible",
  ],
};

// "A dónde irás": coordenadas de plantilla, solo se usan si el alojamiento
// todavía no tiene latitud/longitud guardadas. Santa Marta, Colombia, a
// modo de ejemplo (coincide con la ciudad de plantilla del anfitrión).
export const PLACEHOLDER_LOCATION = {
  lat: 11.2408,
  lon: -74.2110,
};