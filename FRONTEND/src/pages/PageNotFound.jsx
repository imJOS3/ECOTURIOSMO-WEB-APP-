import { useNavigate } from "react-router-dom";
import { BrandIcon, ExplorerIcon, HomeIcon } from "../components/common/icons/icons";
import "../styles/page-404.css";

/**
 * Página 404 — “te saliste del sendero” (ecoturismo).
 */
const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="nf-page" aria-labelledby="nf-title">
      <div className="nf-sky" aria-hidden>
        <span className="nf-cloud nf-cloud-a" />
        <span className="nf-cloud nf-cloud-b" />
        <span className="nf-leaf nf-leaf-1" />
        <span className="nf-leaf nf-leaf-2" />
        <span className="nf-leaf nf-leaf-3" />
      </div>

      <div className="nf-content">
        <p className="nf-brand">
          <BrandIcon fontSize="small" /> EcoTurismo
        </p>

        <div className="nf-code" aria-hidden>
          <span className="nf-digit">4</span>
          <span className="nf-compass">
            <svg viewBox="0 0 64 64" width="72" height="72" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
              <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.25" strokeDasharray="3 4" />
              <path
                className="nf-needle"
                d="M32 12 L38 32 L32 52 L26 32 Z"
                fill="currentColor"
              />
              <circle cx="32" cy="32" r="4" fill="var(--amber)" />
            </svg>
          </span>
          <span className="nf-digit">4</span>
        </div>

        <h1 id="nf-title" className="nf-title display">
          Te saliste del <em>sendero</em>
        </h1>
        <p className="nf-lead">
          Esta página se fue de caminata por el páramo y no dejó mapa.
          Respira, mira el paisaje… y elige un nuevo rumbo.
        </p>

        <div className="nf-trail" aria-hidden>
          <span /><span /><span /><span /><span />
        </div>

        <div className="nf-actions">
          <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
            <span className="nf-btn-inner">
              <HomeIcon fontSize="small" /> Volver al campamento base
            </span>
          </button>
          <button type="button" className="btn" onClick={() => navigate("/explorar")}>
            <span className="nf-btn-inner">
              <ExplorerIcon fontSize="small" /> Explorar alojamientos
            </span>
          </button>
        </div>

        <p className="nf-tip">
          Tip del guía: si llegaste por un enlace viejo, el destino pudo mudarse
          de cabaña. Prueba buscarlo desde Explorar.
        </p>
      </div>

      <div className="nf-horizon" aria-hidden>
        <svg className="nf-hills" viewBox="0 0 1200 180" preserveAspectRatio="none">
          <path
            className="nf-hill nf-hill-back"
            d="M0 120 C180 40 320 160 480 90 C640 20 780 140 960 70 C1080 30 1140 100 1200 80 L1200 180 L0 180 Z"
          />
          <path
            className="nf-hill nf-hill-front"
            d="M0 140 C140 80 280 160 420 110 C560 60 700 150 860 100 C1000 60 1100 130 1200 110 L1200 180 L0 180 Z"
          />
        </svg>
      </div>
    </main>
  );
};

export default PageNotFound;
