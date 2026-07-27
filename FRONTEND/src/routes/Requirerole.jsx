import { Navigate } from "react-router-dom";

/**
 * Bloquea el acceso a una ruta hija según el rol del usuario.
 * Usa UNA de las dos props:
 *   - allowed:  ["admin"]              → solo esos roles entran
 *   - excluded: ["anfitrion"]          → todos entran MENOS esos roles
 *
 * Protege a nivel de URL, no solo ocultando el botón de navegación:
 * si un anfitrion escribe /panel/usuarios (o /panel/reservas) directamente,
 * es redirigido.
 *
 * Redirige a "/panel" (no a una tab fija) porque la tab por defecto depende
 * del rol — la resuelve el index route en panelRoutes.jsx.
 */
const RequireRole = ({ user, allowed, excluded, children }) => {
  const isAllowed = allowed
    ? allowed.includes(user.rol)
    : excluded
      ? !excluded.includes(user.rol)
      : true;

  if (!isAllowed) {
    return <Navigate to="/panel" replace />;
  }
  return children;
};

export default RequireRole;