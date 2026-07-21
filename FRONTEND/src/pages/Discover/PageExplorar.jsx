import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlojamientoCard from "../../components/Alojamiento/AlojamientoCard";
import { Spinner, EmptyState } from "../../components/common/ui/index";
import { BrandIcon } from "../../components/common/icons/icons";
import { useAlojamientosStore } from "../../stores/useAlojamientosStore";

const PageExplorar = ({ onRequireAuth }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const alojamientos = useAlojamientosStore((state) => state.items);
  const loading = useAlojamientosStore((state) => state.loading);
  const error = useAlojamientosStore((state) => state.error);
  const fetchAlojamientos = useAlojamientosStore((state) => state.fetchAlojamientos);

  useEffect(() => {
    fetchAlojamientos().catch(() => {});
  }, [fetchAlojamientos]);

  const filtered = alojamientos
    .filter((a) => (a.estado || a.estado_publicacion) === "aprobado")
    .filter(
      (a) =>
        a.titulo?.toLowerCase().includes(search.toLowerCase()) ||
        a.ubicacion?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title display">Alojamientos ecológicos</h2>
        <span className="section-sub">{filtered.length} disponibles</span>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          className="form-input"
          placeholder="🔍  Buscar por nombre o ubicación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>
      {loading ? <Spinner />
        : error ? <div className="alert alert-error">{error}</div>
        : filtered.length === 0 ? <EmptyState icon={<BrandIcon fontSize="inherit" />} message="No se encontraron alojamientos" />
        : <div className="cards-grid">{filtered.map((a) => <AlojamientoCard key={a.id} item={a} onClick={(it) => navigate(`/alojamientos/${it.id}`)} />)}</div>
      }
    </div>
  );
};

export default PageExplorar;  