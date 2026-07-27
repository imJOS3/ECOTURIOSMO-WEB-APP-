import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "./utils/api";
import { useTheme } from "./hooks/useTheme";
import Navbar from "./components/layout/Navbar";
import AuthModal from "./components/auth/AuthModal";
import MessagesDrawer from "./components/chat/MessagesDrawer";
import useMensajesStore from "./stores/useMensajesStore";
import PageHome from "./pages/home/PageHome";
import PageExplorar from "./pages/Discover/PageExplorar";
import PanelLayout from "./pages/Panel/PanelLayout";
import { buildPanelChildRoutes } from "./routes/PanelRoutes";
import { BrandIcon, LockIcon } from "./components/common/icons/icons";
import PageAlojamientoDetail from "./pages/Alojamiento/PageAlojamientoDetail";
import AlojamientoFormPage from "./pages/Alojamiento/AlojamientoFormPage";
import PagePerfil from "./pages/cuenta/PagePerfil";
import PageSoporte from "./pages/cuenta/PageSoporte";
import useAuthStore from "./stores/useAuthStore";

import "./styles/global.css";


/* ─── App Root ────────────────────────────────────────────────────────────── */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setPage]          = useState("home");
  const [user, setUser]       = useState(getUser);
  const [authMode, setAuthMode] = useState(null);
  const { dark, toggle }       = useTheme();
  const logoutStore = useAuthStore((s) => s.logout);

  const drawerOpen = useMensajesStore((s) => s.drawerOpen);
  const setDrawerOpen = useMensajesStore((s) => s.setDrawerOpen);
  const resetMensajes = useMensajesStore((s) => s.reset);

  const currentPage = location.pathname.startsWith("/panel")
    ? "panel"
    : location.pathname.startsWith("/explorar")
      ? "explorar"
      : location.pathname.startsWith("/cuenta/perfil")
        ? "perfil"
        : location.pathname.startsWith("/cuenta/soporte")
          ? "soporte"
          : "home";

  const goToPage = (nextPage) => {
    setPage(nextPage);
    if (nextPage === "home") navigate("/");
    else if (nextPage === "perfil") navigate("/cuenta/perfil");
    else if (nextPage === "soporte") navigate("/cuenta/soporte");
    else navigate(`/${nextPage}`);
  };

  const logout = () => {
    localStorage.removeItem("eco_token");
    localStorage.removeItem("eco_user");
    logoutStore();
    resetMensajes();
    setUser(null);
    goToPage("home");
  };

  const onAuth = (u) => {
    setUser(u);
    setAuthMode(null);
    goToPage("panel");
  };
  const onRequireAuth = () => setAuthMode("login");

  return (
    <>
      <div className="app">
        <Navbar
          user={user}
          page={currentPage}
          setPage={goToPage}
          onLogin={() => setAuthMode("login")}
          onRegister={() => setAuthMode("register")}
          onLogout={logout}
          dark={dark}
          onToggleTheme={toggle}
        />

        <Routes>
          <Route
            path="/"
            element={<PageHome user={user} setPage={goToPage} onRegister={() => setAuthMode("register")} />}
          />
          <Route
            path="/explorar"
            element={(
              <div className="main">
                <PageExplorar user={user} onRequireAuth={onRequireAuth} />
              </div>
            )}
          />

          <Route path="/panel/alojamientos/nuevo" element={<AlojamientoFormPage />} />
          <Route path="/panel/alojamientos/:id/editar" element={<AlojamientoFormPage />} />

          {/* ── Panel: layout + tabs como rutas hijas (lazy, cada una su chunk) ── */}
          <Route
            path="/panel"
            element={user ? (
              <div className="main">
                <PanelLayout user={user} />
              </div>
            ) : (
              <div className="main">
                <div className="empty">
                  <div className="empty-icon"><LockIcon fontSize="inherit" /></div>
                  <p>Inicia sesión para acceder a tu panel.</p>
                  <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setAuthMode("login")}>
                    Ingresar
                  </button>
                </div>
              </div>
            )}
          >
            {user && buildPanelChildRoutes(user)}
          </Route>

          <Route
            path="/alojamientos/:id"
            element={(
              <div className="main">
                <PageAlojamientoDetail user={user} onRequireAuth={onRequireAuth} />
              </div>
            )}
          />

          <Route
            path="/cuenta/perfil"
            element={(
              <div className="main">
                <PagePerfil
                  user={user}
                  onUserUpdated={setUser}
                  onRequireAuth={onRequireAuth}
                />
              </div>
            )}
          />
          <Route
            path="/cuenta/soporte"
            element={(
              <div className="main">
                <PageSoporte user={user} onRequireAuth={onRequireAuth} />
              </div>
            )}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="footer">
          <strong style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><BrandIcon fontSize="small" /> EcoTurismo</strong> — Plataforma de turismo sostenible · {new Date().getFullYear()}
        </footer>
      </div>

      {user && (
        <MessagesDrawer
          user={user}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onAuth={onAuth} />
      )}
    </>
  );
}
