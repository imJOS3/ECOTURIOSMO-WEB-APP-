// src/components/common/ui/EmptyState.jsx
//
// Única responsabilidad: mensaje + icono cuando una lista/resultado está vacío.
import { BrandIcon } from "../icons/icons";

export const EmptyState = ({ icon = <BrandIcon fontSize="inherit" />, message = "Sin resultados" }) => (
  <div className="empty">
    <div className="empty-icon">{icon}</div>
    <p>{message}</p>
  </div>
);

export default EmptyState;