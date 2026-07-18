import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import UnidadDetail from "../components/Unidad/UnidadDetail";
import ReserveModal from "../components/ReserveModal";
import { Spinner, EmptyState } from "../components/ui";
import { BedIcon } from "../components/icons";

const PageUnidadDetail = ({ user, onRequireAuth }) => {
  const { id, unidadId } = useParams();
  const navigate = useNavigate();
  const [unidad, setUnidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserveItem, setReserveItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/unidades/${unidadId}`)
      .then((d) => setUnidad(d?.data || d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [unidadId]);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!unidad) return <EmptyState icon={<BedIcon fontSize="inherit" />} message="Unidad no encontrada" />;

  return (
    <>
      <UnidadDetail
        unidad={unidad}
        user={user}
        onBack={() => navigate(`/alojamientos/${id}`)}
        onReserve={() => { if (!user) onRequireAuth(); else setReserveItem(unidad); }}
      />
      {reserveItem && (
        <ReserveModal
          alojamiento={{ id: unidad.id_alojamiento }}
          preselectedUnidad={reserveItem}
          onClose={() => setReserveItem(null)}
        />
      )}
    </>
  );
};

export default PageUnidadDetail;