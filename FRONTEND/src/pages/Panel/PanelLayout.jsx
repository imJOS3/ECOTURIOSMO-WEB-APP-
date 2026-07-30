import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Badge, Spinner } from "../../components/common/ui/index";
import UserAvatar from "../../components/common/UserAvatar";
import { PANEL_TAB_REGISTRY } from "../../routes/PanelRoutes";

/**
 * PanelLayout
 * Única responsabilidad: mostrar el perfil y la navegación entre tabs.
 * NO carga datos de ningún dominio (reservas, pagos, etc).
 * El contenido de cada tab vive en su propia ruta hija (ver <Outlet/>),
 * lo que permite que cada una cargue su propio chunk (React.lazy) y
 * sus propios datos de forma totalmente aislada.
 */
const PanelLayout = ({ user }) => {
  const visibleTabs = PANEL_TAB_REGISTRY.filter((t) => {
    if (t.excludeRoles?.includes(user.rol)) return false;
    return t.roles.includes("*") || t.roles.includes(user.rol);
  });

  return (
    <div>
      <div className="profile-card">
        <UserAvatar user={user} />
        <div>
          <p style={{ fontWeight: 500, fontSize: "1rem" }}>{user.nombre}</p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.email}</p>
          <Badge status={user.rol} />
        </div>
      </div>

      <div className="tabs">
        {visibleTabs.map((t) => (
          <NavLink
            key={t.id}
            to={`/panel/${t.path}`}
            className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <t.icon fontSize="small" /> {t.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Cada tab se monta/desmonta al navegar: solo el chunk activo está en memoria.
          Suspense muestra el Spinner mientras react-router baja el chunk lazy(). */}
      <Suspense fallback={<Spinner />}>
        <Outlet context={{ user }} />
      </Suspense>
    </div>
  );
};

export default PanelLayout;