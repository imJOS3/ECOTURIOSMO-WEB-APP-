// src/pages/PageExplorar.jsx
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import AlojamientoCard from "../components/AlojamientoCard";
import AlojamientoDetail from "../components/AlojamientoDetail";
import ReserveModal from "../components/ReserveModal";
import { Spinner, EmptyState } from "../components/ui";
import { BrandIcon } from "../components/icons";

const PageExplorar = ({ user, onRequireAuth }) => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [reserveItem, setReserveItem] = useState(null);

  useEffect(() => {
    apiFetch("/alojamientos")
      .then((d) => { setAlojamientos(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = alojamientos.filter(
    (a) =>
      a.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      a.ubicacion?.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) return (
    <>
      <AlojamientoDetail
        item={selected}
        user={user}
        onBack={() => setSelected(null)}
        onReserve={(item) => { if (!user) onRequireAuth(); else setReserveItem(item); }}
      />
      {reserveItem && <ReserveModal alojamiento={reserveItem} onClose={() => setReserveItem(null)} />}
    </>
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
        : filtered.length === 0 ? <EmptyState icon={<BrandIcon fontSize="inherit" />} message="No se encontraron alojamientos" />
        : <div className="cards-grid">{filtered.map((a) => <AlojamientoCard key={a.id} item={a} onClick={setSelected} />)}</div>
      }
    </div>
  );
};

export default PageExplorar;