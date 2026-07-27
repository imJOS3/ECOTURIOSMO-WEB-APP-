import { useEffect, useState } from "react";
import { BrandIcon, ExplorerIcon, HomeIcon, ChatIcon } from "../common/icons/icons";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import useMensajesStore from "../../stores/useMensajesStore";
import { formatUnreadBadge } from "../chat/chatHelpers";
import ProfileMenu from "./ProfileMenu";
import LogoutConfirmModal from "./LogoutConfirmModal";

const Navbar = ({ user, page, setPage, onLogin, onRegister, onLogout, dark, onToggleTheme }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const unreadTotal = useMensajesStore((s) => s.unreadTotal);
  const drawerOpen = useMensajesStore((s) => s.drawerOpen);
  const toggleDrawer = useMensajesStore((s) => s.toggleDrawer);
  const fetchConversaciones = useMensajesStore((s) => s.fetchConversaciones);
  const badge = formatUnreadBadge(unreadTotal);

  useEffect(() => {
    if (!user) return undefined;
    fetchConversaciones({ silent: true }).catch(() => {});
    const timer = setInterval(() => {
      fetchConversaciones({ silent: true }).catch(() => {});
    }, 20000);
    return () => clearInterval(timer);
  }, [user, fetchConversaciones]);

  return (
    <>
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>
          <BrandIcon fontSize="small" /> EcoTurismo
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${page === "explorar" ? "active" : ""}`}
            onClick={() => setPage("explorar")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ExplorerIcon fontSize="small" /> Explorar
            </span>
          </button>
          {user && (
            <button
              className={`nav-link ${page === "panel" ? "active" : ""}`}
              onClick={() => setPage("panel")}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <HomeIcon fontSize="small" /> Mi panel
              </span>
            </button>
          )}
        </div>
        <div className="nav-actions">
          <button
            className="btn btn-sm theme-toggle"
            onClick={onToggleTheme}
            title={dark ? "Modo día" : "Modo noche"}
            aria-label={dark ? "Cambiar a modo día" : "Cambiar a modo noche"}
          >
            {dark ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
          </button>

          {user ? (
            <>
              <button
                type="button"
                className={`nav-msg-btn ${drawerOpen ? "active" : ""}`}
                onClick={() => {
                  if (!drawerOpen) toggleDrawer();
                }}
                title="Mensajes"
                aria-label="Abrir mensajes"
              >
                <ChatIcon fontSize="small" />
                <span className="nav-msg-label">Mensajes</span>
                {badge && <span className="nav-msg-badge">{badge}</span>}
              </button>
              <ProfileMenu
                user={user}
                onConfigurarPerfil={() => setPage("perfil")}
                onSoporte={() => setPage("soporte")}
                onRequestLogout={() => setConfirmLogout(true)}
              />
            </>
          ) : (
            <>
              <button className="btn btn-sm" onClick={onLogin}>
                Ingresar
              </button>
              <button className="btn btn-primary btn-sm" onClick={onRegister}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      <LogoutConfirmModal
        open={confirmLogout}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          onLogout?.();
        }}
      />
    </>
  );
};

export default Navbar;
