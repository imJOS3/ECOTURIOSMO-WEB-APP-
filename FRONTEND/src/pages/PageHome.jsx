// src/pages/PageHome.jsx
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import AlojamientoCard from "../components/AlojamientoCard";
import { HomeIcon, UserIcon, CalendarIcon, MapIcon, BrandIcon } from "../components/icons";

const PLACEHOLDERS = [
  { id: 1, titulo: "Cabaña del Páramo", ubicacion: "Boyacá, Colombia", descripcion: "Experiencia única a 3.200 m.s.n.m. rodeado de frailejones y niebla perpetua.", estado_publicacion: "aprobado" },
  { id: 2, titulo: "Eco-Glamping Cocora", ubicacion: "Eje Cafetero, Colombia", descripcion: "Duerme entre palmas de cera, el árbol nacional de Colombia.", estado_publicacion: "aprobado" },
  { id: 3, titulo: "Casa Tayrona", ubicacion: "Magdalena, Colombia", descripcion: "A pasos del Parque Natural Tayrona, brisa marina y selva tropical.", estado_publicacion: "aprobado" },
];

const STATS = [
  { label: "Alojamientos activos", value: "48+", icon: HomeIcon },
  { label: "Turistas satisfechos", value: "1.2k", icon: UserIcon },
  { label: "Reservas exitosas", value: "860", icon: CalendarIcon },
  { label: "Destinos eco", value: "12", icon: MapIcon },
];

const PageHome = ({ user, setPage, onRegister }) => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    apiFetch("/alojamientos")
      .then((d) => setFeatured((Array.isArray(d) ? d : []).slice(0, 3)))
      .catch(() => {});
  }, []);

  const display = featured.length > 0 ? featured : PLACEHOLDERS;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge"><BrandIcon fontSize="small" /> Turismo sostenible en Colombia</div>
          <h1>Descubre la naturaleza, <em>vívela</em></h1>
          <p>Conecta con alojamientos ecológicos únicos. Cada estancia apoya la conservación del medio ambiente y las comunidades locales.</p>
          <div className="hero-actions">
            <button
              className="btn"
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "0.5px solid rgba(255,255,255,0.3)" }}
              onClick={() => setPage("explorar")}
            >
              Explorar alojamientos
            </button>
            {!user && (
              <button className="btn" style={{ background: "white", color: "var(--green)" }} onClick={onRegister}>
                Unirme gratis
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="main">
        {/* Stats */}
        <div className="stats-row">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon"><s.icon fontSize="inherit" /></span>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Featured */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="section-header">
            <h2 className="section-title display">Destacados</h2>
            <button className="btn btn-sm" onClick={() => setPage("explorar")}>Ver todos →</button>
          </div>
          <div className="cards-grid">
            {display.map((a) => <AlojamientoCard key={a.id} item={a} onClick={() => setPage("explorar")} />)}
          </div>
        </div>

        {/* CTA anfitrión */}
        <div style={{ background: "var(--card-bg)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem", textAlign: "center" }}>
          <h3 className="display" style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>¿Tienes un espacio en la naturaleza?</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem", maxWidth: 480, margin: "0 auto 1.25rem" }}>
            Regístrate como anfitrión y comparte tu alojamiento ecológico con viajeros conscientes de todo el mundo.
          </p>
          <button className="btn btn-primary" onClick={onRegister}>Ser anfitrión</button>
        </div>
      </div>
    </>
  );
};

export default PageHome;