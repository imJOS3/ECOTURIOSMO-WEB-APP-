// src/components/ui.jsx
// Componentes reutilizables de interfaz

import { BrandIcon } from "./icons";

export const StarRating = ({ value = 0 }) => (
  <span className="stars">
    {"★".repeat(Math.min(value, 5))}{"☆".repeat(Math.max(0, 5 - value))}
  </span>
);

/** Mapea valores de estado a clases de badge */
export const Badge = ({ status }) => {
  const classMap = {
    pendiente:          "badge-amber",
    confirmada:         "badge-green",
    cancelada:          "badge-red",
    exitoso:            "badge-green",
    fallido:            "badge-red",
    reembolsado:        "badge-gray",
    pendiente_revision: "badge-amber",
    aprobado:           "badge-green",
    rechazado:          "badge-red",
    suspendido:         "badge-gray",
    turista:            "badge-teal",
    anfitrion:          "badge-green",
    admin:              "badge-amber",
  };
  const labelMap = {
    pendiente_revision: "en revisión",
  };
  return (
    <span className={`badge ${classMap[status] || "badge-gray"}`}>
      {labelMap[status] || status}
    </span>
  );
};

export const Spinner = () => (
  <div className="loader">
    <div className="spinner" />
  </div>
);

export const EmptyState = ({ icon = <BrandIcon fontSize="inherit" />, message = "Sin resultados" }) => (
  <div className="empty">
    <div className="empty-icon">{icon}</div>
    <p>{message}</p>
  </div>
);