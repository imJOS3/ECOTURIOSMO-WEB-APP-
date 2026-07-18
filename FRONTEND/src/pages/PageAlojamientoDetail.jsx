import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import AlojamientoDetail from "../components/Alojamiento/AlojamientoDetail";
import ReserveModal from "../components/ReserveModal";
import { Spinner, EmptyState } from "../components/ui";
import { BrandIcon } from "../components/icons";

const PageAlojamientoDetail = ({ user, onRequireAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserveItem, setReserveItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/alojamientos/${id}`)
      .then((d) => setItem(d?.data || d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!item) return <EmptyState icon={<BrandIcon fontSize="inherit" />} message="Alojamiento no encontrado" />;

  return (
    <>
      <AlojamientoDetail
        item={item}
        user={user}
        onBack={() => navigate("/explorar")}
        onReserve={(it) => { if (!user) onRequireAuth(); else setReserveItem(it); }}
      />
      {reserveItem && <ReserveModal alojamiento={reserveItem} onClose={() => setReserveItem(null)} />}
    </>
  );
};

export default PageAlojamientoDetail;