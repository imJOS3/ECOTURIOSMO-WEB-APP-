import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import RequireRole from "./RequireRole";
import {
  CalendarIcon, HomeIcon, BedIcon, PaymentIcon,
  TagIcon, GroupIcon, AdminIcon, ReviewIcon, ChatIcon,
} from "../components/common/icons/icons";

// ── Lazy imports: cada tab es su propio chunk JS, agrupados por rol ────────
// Esto evita que "todo cargue en la misma ruta": el navegador solo descarga
// el código de la tab que el usuario realmente visita.

// turista
const TabMisReservas       = lazy(() => import("../pages/Panel/tabs/turista/TabMisReservas"));

// anfitrion
const TabReservasAnfitrion = lazy(() => import("../pages/Panel/tabs/anfitrion/TabReservasAnfitrion"));

// admin
const TabCategorias        = lazy(() => import("../pages/Panel/tabs/admin/TabCategorias"));
const TabServicios         = lazy(() => import("../pages/Panel/tabs/admin/TabServicios"));
const TabUsuarios          = lazy(() => import("../pages/Panel/tabs/admin/TabUsuarios"));
const TabModeracion        = lazy(() => import("../components/panels/TabModeracion").then(m => ({ default: m.TabModeracion })));
const TabModeracionLog     = lazy(() => import("../components/panels/TabModeracion").then(m => ({ default: m.TabModeracionLog })));

// shared (más de un rol)
const TabAlojamientosPanel = lazy(() => import("../pages/Panel/tabs/shared/TabAlojamientosPanel"));
const TabPagos             = lazy(() => import("../pages/Panel/tabs/shared/TabPagos"));
const TabMensajes          = lazy(() => import("../pages/Panel/tabs/shared/TabMensajes"));



// ── Registro agrupado por rol (fuente única de verdad para nav + rutas) ────
const TURISTA_TABS = [
  { id: "reservas", path: "reservas", label: "Mis Reservas", icon: CalendarIcon, roles: ["turista"] },
];

const ANFITRION_TABS = [
  { id: "reservas_recibidas", path: "reservas-recibidas", label: "Reservas recibidas", icon: CalendarIcon, roles: ["anfitrion"] },
];

const ADMIN_TABS = [
  { id: "categorias",          path: "categorias",          label: "Categorías",        icon: TagIcon,     roles: ["admin"] },
  { id: "servicios",           path: "servicios",           label: "Servicios",         icon: BedIcon,     roles: ["admin"] },
  { id: "usuarios",            path: "usuarios",            label: "Usuarios",          icon: GroupIcon,   roles: ["admin"] },
  { id: "moderacion",          path: "moderacion",          label: "Mod. Alojamientos", icon: AdminIcon,   roles: ["admin"] },
  { id: "moderacion_log",      path: "moderacion-log",      label: "Log moderación",    icon: ReviewIcon,  roles: ["admin"] },
];

const SHARED_TABS = [
  { id: "alojamientos", path: "alojamientos", label: "Alojamientos", icon: HomeIcon,    roles: ["anfitrion", "admin"] },
  { id: "mensajes",     path: "mensajes",     label: "Mensajes",     icon: ChatIcon,    roles: ["turista", "anfitrion", "admin"] },
  { id: "pagos",        path: "pagos",        label: "Pagos",        icon: PaymentIcon, roles: ["turista", "anfitrion", "admin"] },
];

/**
 * Orden de aparición en el nav (PanelLayout la filtra por user.rol).
 * Agregar una tab nueva = agregar un objeto al array de su rol. Nada más.
 */
export const PANEL_TAB_REGISTRY = [
  ...TURISTA_TABS,
  ...ANFITRION_TABS,
  SHARED_TABS[0], // alojamientos
  SHARED_TABS[1], // mensajes
  SHARED_TABS[2], // pagos
  ...ADMIN_TABS,
];

/**
 * Tab de aterrizaje por defecto según el rol.
 * - turista   → sus reservas
 * - anfitrion → reservas recibidas (su primer punto de atención)
 * - admin     → moderación (su tarea principal: aprobar solicitudes)
 */
export function getDefaultPanelPath(user) {
  if (user.rol === "anfitrion") return "reservas-recibidas";
  if (user.rol === "admin") return "moderacion";
  return "reservas";
}

/**
 * Rutas hijas de /panel/*.
 * Cada tab queda protegida por rol a nivel de RUTA (no solo ocultando el
 * botón de nav) — así nadie llega a /panel/usuarios tecleando la URL si
 * no es admin.
 *
 * Úsalo dentro de tu <Route path="/panel" element={<PanelLayout user={user} />}>
 * así:
 *
 *   <Route path="/panel" element={<PanelLayout user={user} />}>
 *     {buildPanelChildRoutes(user)}
 *   </Route>
 */
export function buildPanelChildRoutes(user) {
  return [
    <Route key="index" index element={<Navigate to={getDefaultPanelPath(user)} replace />} />,

    // ── turista ──
    <Route
      key="reservas" path="reservas"
      element={<RequireRole user={user} allowed={["turista"]}><TabMisReservas /></RequireRole>}
    />,

    // ── anfitrion ──
    <Route
      key="reservas_recibidas" path="reservas-recibidas"
      element={<RequireRole user={user} allowed={["anfitrion"]}><TabReservasAnfitrion /></RequireRole>}
    />,
    // ── shared ──
    <Route
      key="alojamientos" path="alojamientos"
      element={<RequireRole user={user} allowed={["anfitrion", "admin"]}><TabAlojamientosPanel /></RequireRole>}
    />,
    <Route
      key="pagos" path="pagos"
      element={<RequireRole user={user} allowed={["turista", "anfitrion", "admin"]}><TabPagos /></RequireRole>}
    />,
    <Route
      key="mensajes" path="mensajes"
      element={<RequireRole user={user} allowed={["turista", "anfitrion", "admin"]}><TabMensajes /></RequireRole>}
    />,

    // ── admin ──
    <Route
      key="categorias" path="categorias"
      element={<RequireRole user={user} allowed={["admin"]}><TabCategorias /></RequireRole>}
    />,
    <Route
      key="servicios" path="servicios"
      element={<RequireRole user={user} allowed={["admin"]}><TabServicios /></RequireRole>}
    />,
    <Route
      key="usuarios" path="usuarios"
      element={<RequireRole user={user} allowed={["admin"]}><TabUsuarios /></RequireRole>}
    />,
    <Route
      key="moderacion" path="moderacion"
      element={<RequireRole user={user} allowed={["admin"]}><TabModeracion tipoInicial="alojamientos" /></RequireRole>}
    />,

    <Route
      key="moderacion_log" path="moderacion-log"
      element={<RequireRole user={user} allowed={["admin"]}><TabModeracionLog /></RequireRole>}
    />,
  ];
}