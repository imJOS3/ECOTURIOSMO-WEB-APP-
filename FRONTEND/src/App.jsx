
import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "./utils/api";
import { useTheme } from "./hooks/useTheme";
import Navbar from "./components/layout/Navbar";
import AuthModal from "./components/auth/AuthModal";
import PageHome from "./pages/PageHome";
import PageExplorar from "./pages/PageExplorar";
import PagePanel from "./pages/PagePanel";
import { BrandIcon, LockIcon } from "./components/common/icons/icons";
import PageAlojamientoDetail from "./pages/PageAlojamientoDetail";
import PageUnidadDetail from "./pages/PageUnidadDetail";
import AlojamientoFormPage from "./pages/AlojamientoFormPage";
import PageUnidadForm from "./pages/PageUnidadForm";
import "./styles/global.css";


/* ─── App Root ────────────────────────────────────────────────────────────── */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setPage]          = useState("home");
  const [user, setUser]       = useState(getUser);
  const [authMode, setAuthMode] = useState(null);
  const { dark, toggle }       = useTheme();

  const currentPage = location.pathname.startsWith("/panel")
    ? "panel"
    : location.pathname.startsWith("/explorar")
      ? "explorar"
      : "home";

  const goToPage = (nextPage) => {
    setPage(nextPage);
    navigate(nextPage === "home" ? "/" : `/${nextPage}`);
  };

  const logout = () => {
    localStorage.removeItem("eco_token");
    localStorage.removeItem("eco_user");
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
          <Route path="/panel/alojamientos/:alojamientoId/unidades/nueva" element={<PageUnidadForm />} />
          <Route path="/panel/alojamientos/:alojamientoId/unidades/:id/editar" element={<PageUnidadForm />} />
          <Route
            path="/panel"
            element={user ? (
              <div className="main">
                <PagePanel user={user} />
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
          />
          <Route
            path="/alojamientos/:id"
            element={(
              <div className="main">
                <PageAlojamientoDetail user={user} onRequireAuth={onRequireAuth} />
              </div>
            )}
          />
          <Route
            path="/alojamientos/:id/unidades/:unidadId"
            element={(
              <div className="main">
                <PageUnidadDetail user={user} onRequireAuth={onRequireAuth} />
              </div>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="footer">
          <strong style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><BrandIcon fontSize="small" /> EcoTurismo</strong> — Plataforma de turismo sostenible · {new Date().getFullYear()}
        </footer>
      </div>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onAuth={onAuth} />
      )}
    </>
  );
}