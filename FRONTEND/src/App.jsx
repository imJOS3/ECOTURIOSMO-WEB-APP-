// src/App.jsx — Punto de entrada principal
import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "./utils/api";
import { useTheme } from "./hooks/useTheme";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import PageHome from "./pages/PageHome";
import PageExplorar from "./pages/PageExplorar";
import PagePanel from "./pages/PagePanel";
import { BrandIcon, LockIcon } from "./components/icons";

/* ─── ESTILOS GLOBALES ────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Tema claro (default) ──────────────────────────────────────────────── */
  :root {
    --green:        #3B6D11;
    --green-light:  #EAF3DE;
    --green-mid:    #97C459;
    --teal:         #0F6E56;
    --teal-light:   #E1F5EE;
    --amber:        #854F0B;
    --amber-light:  #FAEEDA;
    --red:          #A32D2D;
    --red-light:    #FCEBEB;

    --text:         #27500A;
    --text-muted:   #5F5E5A;
    --surface:      #F7FAF2;
    --white:        #ffffff;
    --card-bg:      #ffffff;
    --border:       rgba(59,109,17,0.15);
    --border-mid:   rgba(59,109,17,0.3);

    --nav-bg:       #ffffff;
    --nav-border:   rgba(59,109,17,0.3);
    --footer-bg:    #27500A;
    --footer-text:  rgba(255,255,255,0.7);

    --hero-gradient: linear-gradient(135deg,#173404 0%,#3B6D11 50%,#0F6E56 100%);
    --detail-hero-bg: linear-gradient(135deg,var(--green-light),#C0DD97);

    --shadow:     0 2px 12px rgba(59,109,17,0.08);
    --shadow-md:  0 4px 24px rgba(59,109,17,0.12);
    --radius:     12px;
    --radius-sm:  8px;
  }

  /* ── Tema oscuro — Bosque nocturno ─────────────────────────────────────── */
  /*
   * Paleta inspirada en un bosque de noche:
   *   - Fondos profundos verdes muy oscuros (casi negros con tinte verde)
   *   - Verdes apagados y musgo para superficies
   *   - Acentos en verde lima suave, teal y ámbar dorado (como luciérnagas)
   *   - Textos en cremas y verdes claros
   */
  [data-theme="dark"] {
    --green:        #8fc44a;       /* Verde lima suave — acentos principales      */
    --green-light:  #162808;       /* Fondo de chips/badges verdes                */
    --green-mid:    #4d8a1a;
    --teal:         #4dbfa0;       /* Teal más brillante para contraste           */
    --teal-light:   #04201a;
    --amber:        #f0b942;       /* Dorado cálido — luciérnaga                 */
    --amber-light:  #1f1200;
    --red:          #e07575;
    --red-light:    #1e0505;

    --text:         #c8e6a0;       /* Verde crema suave                           */
    --text-muted:   #7aa860;       /* Verde musgo apagado                         */
    --surface:      #080f04;       /* Fondo base: negro-bosque                    */
    --white:        #111a09;       /* "Blanco" en oscuro = verde muy oscuro        */
    --card-bg:      #162208;       /* Cards: verde oscuro con profundidad         */
    --border:       rgba(143,196,74,0.1);
    --border-mid:   rgba(143,196,74,0.22);

    --nav-bg:       #0c1607;
    --nav-border:   rgba(143,196,74,0.18);
    --footer-bg:    #060d03;
    --footer-text:  rgba(200,230,160,0.6);

    --hero-gradient: linear-gradient(135deg,#010802 0%,#0c2206 45%,#041a12 100%);
    --detail-hero-bg: linear-gradient(135deg,#0c2206,#1a3a0a);

    --shadow:     0 2px 16px rgba(0,0,0,0.55);
    --shadow-md:  0 4px 32px rgba(0,0,0,0.65);
  }

  /* ── Base ──────────────────────────────────────────────────────────────── */
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    color: var(--text);
    line-height: 1.6;
    transition: background 0.3s ease, color 0.3s ease;
  }
  .display { font-family: 'Playfair Display', serif; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Navbar ─────────────────────────────────────────────────────────────── */
  .nav {
    background: var(--nav-bg);
    border-bottom: 0.5px solid var(--nav-border);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
    position: sticky; top: 0; z-index: 100;
    transition: background 0.3s ease, border-color 0.3s ease;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; color: var(--green);
    display: flex; align-items: center; gap: 8px;
    cursor: pointer;
  }
  .nav-links { display: flex; gap: 4px; }
  .nav-link {
    padding: 6px 14px; border-radius: var(--radius-sm);
    font-size: 0.875rem; color: var(--text-muted);
    cursor: pointer; border: none; background: transparent;
    transition: all .15s;
  }
  .nav-link:hover { background: var(--green-light); color: var(--green); }
  .nav-link.active { background: var(--green-light); color: var(--green); font-weight: 500; }
  .nav-actions { display: flex; gap: 8px; align-items: center; }

  /* ── Dark mode toggle ───────────────────────────────────────────────────── */
  .theme-toggle {
    font-size: 1rem; padding: 5px 10px;
    transition: transform 0.2s ease;
  }
  .theme-toggle:hover { transform: scale(1.15); }

  /* ── Buttons ─────────────────────────────────────────────────────────────── */
  .btn {
    padding: 8px 18px; border-radius: var(--radius-sm);
    font-size: 0.875rem; font-weight: 500;
    cursor: pointer; border: 0.5px solid var(--border-mid);
    background: transparent; color: var(--green);
    transition: all .15s; font-family: 'DM Sans', sans-serif;
  }
  .btn:hover { background: var(--green-light); }
  .btn-primary { background: var(--green); color: #fff; border-color: var(--green); }
  .btn-primary:hover { filter: brightness(1.12); }
  .btn-sm { padding: 5px 12px; font-size: 0.8rem; }
  .btn-danger { color: var(--red); border-color: rgba(163,45,45,.3); }
  .btn-danger:hover { background: var(--red-light); }
  .btn-teal { background: var(--teal); color: #fff; border-color: var(--teal); }
  .btn-teal:hover { filter: brightness(1.1); }
  .btn:disabled { opacity: .45; cursor: not-allowed; }

  /* ── Hero ────────────────────────────────────────────────────────────────── */
  .hero {
    background: var(--hero-gradient);
    color: white; padding: 5rem 2rem; text-align: center;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  /* Modo oscuro: el hero tiene una textura extra de "estrellas" */
  [data-theme="dark"] .hero::after {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 20% 50%, rgba(143,196,74,0.04) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(77,191,160,0.04) 0%, transparent 50%);
  }
  .hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
  .hero h1 { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 600; line-height: 1.1; margin-bottom: 1rem; }
  .hero h1 em { font-style: italic; color: #9FE1CB; }
  .hero p { font-size: 1.1rem; font-weight: 300; opacity: .85; margin-bottom: 2rem; }
  .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.1); border: 0.5px solid rgba(255,255,255,.2);
    border-radius: 20px; padding: 4px 14px; font-size: .8rem; margin-bottom: 1.5rem;
  }

  /* ── Layout ──────────────────────────────────────────────────────────────── */
  .main { flex: 1; padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  .section-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--text); }
  .section-sub { font-size: .85rem; color: var(--text-muted); }

  /* ── Stat cards ──────────────────────────────────────────────────────────── */
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 12px; margin-bottom: 2rem; }
  .stat-card {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 1rem;
    transition: background 0.3s, border-color 0.3s;
  }
  .stat-label { font-size: .75rem; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .05em; }
  .stat-value { font-size: 1.5rem; font-weight: 500; color: var(--green); }
  .stat-icon { font-size: 1.2rem; float: right; margin-top: 2px; }

  /* ── Cards de alojamiento ────────────────────────────────────────────────── */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1.5rem; }
  .card {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    transition: box-shadow .2s, transform .2s, background 0.3s, border-color 0.3s;
    cursor: pointer;
  }
  .card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .card-img {
    height: 180px;
    background: var(--detail-hero-bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem; position: relative; overflow: hidden;
  }
  .card-img-pattern {
    position: absolute; inset: 0; opacity: .15;
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59,109,17,.3) 10px, rgba(59,109,17,.3) 11px);
  }
  .card-badge {
    position: absolute; top: 12px; right: 12px;
    background: var(--card-bg); color: var(--green);
    font-size: .75rem; font-weight: 500; padding: 3px 10px;
    border-radius: 20px; border: 0.5px solid var(--border-mid);
  }
  .card-body { padding: 1rem 1.25rem; }
  .card-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 4px; color: var(--text); }
  .card-location { font-size: .8rem; color: var(--text-muted); margin-bottom: 8px; }
  .card-desc { font-size: .85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 0.5px solid var(--border); }
  .card-price { font-size: 1rem; font-weight: 500; color: var(--green); }
  .card-price span { font-size: .75rem; font-weight: 400; color: var(--text-muted); }

  /* ── Modals ──────────────────────────────────────────────────────────────── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(5,15,2,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 1rem;
    backdrop-filter: blur(2px);
  }
  .modal {
    background: var(--card-bg); border-radius: var(--radius);
    border: 0.5px solid var(--border-mid);
    padding: 2rem; width: 100%; max-width: 520px; max-height: 90vh;
    overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--text); }
  .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); padding: 4px; line-height: 1; }

  /* ── Forms ───────────────────────────────────────────────────────────────── */
  .form-group { margin-bottom: 1rem; }
  .form-label { display: block; font-size: .8rem; font-weight: 500; margin-bottom: 6px; color: var(--text); }
  .form-input {
    width: 100%; padding: 10px 14px;
    border: 0.5px solid var(--border-mid);
    border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif; font-size: .9rem;
    color: var(--text); background: var(--surface);
    outline: none; transition: border-color .15s, background 0.3s;
  }
  .form-input:focus { border-color: var(--green); background: var(--white); }
  .form-select { appearance: none; cursor: pointer; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-hint { font-size: .75rem; color: var(--text-muted); margin-top: 4px; }

  /* ── Tabs ────────────────────────────────────────────────────────────────── */
  .tabs { display: flex; gap: 4px; border-bottom: 0.5px solid var(--border-mid); margin-bottom: 1.5rem; flex-wrap: wrap; }
  .tab {
    padding: 8px 16px; font-size: .875rem;
    cursor: pointer; border: none; background: none;
    color: var(--text-muted);
    border-bottom: 2px solid transparent;
    transition: all .15s; margin-bottom: -0.5px;
    font-family: 'DM Sans', sans-serif;
  }
  .tab:hover { color: var(--green); }
  .tab.active { color: var(--green); border-bottom-color: var(--green); font-weight: 500; }

  /* ── Tables ──────────────────────────────────────────────────────────────── */
  .table-wrap {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: var(--radius); overflow: auto;
    transition: background 0.3s, border-color 0.3s;
  }
  table { width: 100%; border-collapse: collapse; font-size: .875rem; }
  thead { background: var(--green-light); }
  th { padding: 10px 14px; text-align: left; font-weight: 500; color: var(--green); font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
  td { padding: 10px 14px; border-bottom: 0.5px solid var(--border); color: var(--text); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface); }

  /* ── Badges ──────────────────────────────────────────────────────────────── */
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: .75rem; font-weight: 500; }
  .badge-green { background: var(--green-light); color: var(--green); }
  .badge-amber { background: var(--amber-light); color: var(--amber); }
  .badge-red   { background: var(--red-light); color: var(--red); }
  .badge-teal  { background: var(--teal-light); color: var(--teal); }
  .badge-gray  { background: var(--surface); color: var(--text-muted); border: 0.5px solid var(--border-mid); }
  .badge-blue  { background: #0a1a2a; color: #5aa8e0; }
  [data-theme="light"] .badge-blue { background: #E3F0FF; color: #1a56b0; }

  /* ── Alerts ──────────────────────────────────────────────────────────────── */
  .alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: .875rem; margin-bottom: 1rem; }
  .alert-success { background: var(--green-light); color: var(--green); border: 0.5px solid var(--border-mid); }
  .alert-error   { background: var(--red-light);   color: var(--red);   border: 0.5px solid rgba(163,45,45,.25); }
  .alert-info    { background: var(--teal-light);  color: var(--teal);  border: 0.5px solid rgba(15,110,86,.2); }
  .alert-amber   { background: var(--amber-light); color: var(--amber); border: 0.5px solid rgba(133,79,11,.2); }

  /* ── Detail ──────────────────────────────────────────────────────────────── */
  .detail-hero {
    background: var(--detail-hero-bg);
    height: 260px; border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    font-size: 6rem; position: relative; overflow: hidden; margin-bottom: 1.5rem;
  }
  .detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
  .detail-sidebar { display: flex; flex-direction: column; gap: 1rem; }
  .sidebar-card {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem;
    transition: background 0.3s, border-color 0.3s;
  }
  .sidebar-card-title { font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); margin-bottom: 1rem; }

  /* ── Unit rows ───────────────────────────────────────────────────────────── */
  .unit-row {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 12px 16px;
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 8px; cursor: pointer; transition: box-shadow .15s, background 0.3s;
  }
  .unit-row:hover { box-shadow: var(--shadow); }
  .unit-row.selected { border-color: var(--green); background: var(--green-light); }

  /* ── Profile card ────────────────────────────────────────────────────────── */
  .profile-card {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: var(--radius); padding: 1.5rem;
    display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
    transition: background 0.3s, border-color 0.3s;
  }
  .avatar {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--green-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; font-weight: 600; color: var(--green);
    font-family: 'Playfair Display', serif; flex-shrink: 0;
  }

  /* ── Stars ───────────────────────────────────────────────────────────────── */
  .stars { color: var(--amber); letter-spacing: 2px; }

  /* ── Empty / Loader ──────────────────────────────────────────────────────── */
  .empty { text-align: center; padding: 3rem; color: var(--text-muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .loader { display: flex; align-items: center; justify-content: center; padding: 3rem; }
  .spinner {
    width: 28px; height: 28px;
    border: 2px solid var(--border-mid);
    border-top-color: var(--green);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Footer ──────────────────────────────────────────────────────────────── */
  .footer {
    background: var(--footer-bg); color: var(--footer-text);
    padding: 2rem; text-align: center; font-size: .85rem;
    transition: background 0.3s;
  }
  .footer strong { color: white; font-family: 'Playfair Display', serif; }
  [data-theme="dark"] .footer strong { color: var(--text); }

  /* ── Mod actions ──────────────────────────────────────────────────────────── */
  .mod-actions { display: flex; gap: 6px; flex-wrap: wrap; }

  /* ── Responsivo ───────────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .detail-layout { grid-template-columns: 1fr; }
    .hero h1 { font-size: 2.2rem; }
    .nav-links { display: none; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

/* ─── App Root ────────────────────────────────────────────────────────────── */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage]       = useState("home");
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
      <style>{styles}</style>
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
