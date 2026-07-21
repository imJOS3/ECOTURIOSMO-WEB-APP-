// src/components/common/ui/Badge.jsx
//
// Única responsabilidad: mapear un valor de estado a su badge visual.

const STATUS_CLASS_MAP = {
  pendiente: "badge-amber",
  confirmada: "badge-green",
  cancelada: "badge-red",
  exitoso: "badge-green",
  fallido: "badge-red",
  reembolsado: "badge-gray",
  pendiente_revision: "badge-amber",
  aprobado: "badge-green",
  rechazado: "badge-red",
  suspendido: "badge-gray",
  turista: "badge-teal",
  anfitrion: "badge-green",
  admin: "badge-amber",
};

const STATUS_LABEL_MAP = {
  pendiente_revision: "en revisión",
};

export const Badge = ({ status }) => (
  <span className={`badge ${STATUS_CLASS_MAP[status] || "badge-gray"}`}>
    {STATUS_LABEL_MAP[status] || status}
  </span>
);

export default Badge;