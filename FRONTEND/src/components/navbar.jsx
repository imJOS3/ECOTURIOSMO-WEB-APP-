// src/components/Navbar.jsx

import { BrandIcon, ExplorerIcon, HomeIcon } from "./icons";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";

const Navbar = ({ user, page, setPage, onLogin, onRegister, onLogout, dark, onToggleTheme }) => (
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
      {/* Toggle modo nocturno */}
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
          <div className="avatar" style={{ width: 32, height: 32, fontSize: "0.85rem" }}>
            {user.nombre?.[0]}
          </div>
          <button className="btn btn-sm" onClick={onLogout}>Salir</button>
        </>
      ) : (
        <>
          <button className="btn btn-sm" onClick={onLogin}>Ingresar</button>
          <button className="btn btn-primary btn-sm" onClick={onRegister}>Registrarse</button>
        </>
      )}
    </div>
  </nav>
);

export default Navbar;