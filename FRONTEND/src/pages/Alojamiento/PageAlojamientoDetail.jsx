import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import AlojamientoDetail from "../../components/Alojamiento/AlojamientoDetail";
import ReserveModal from "../../components/Alojamiento/ReserveModal";
import StartChatModal from "../../components/chat/StartChatModal";
import useMensajesStore from "../../stores/useMensajesStore";
import { Spinner, EmptyState } from "../../components/common/ui/index";
import { BrandIcon } from "../../components/common/icons/icons";

const PageAlojamientoDetail = ({ user, onRequireAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const startConversacion = useMensajesStore((s) => s.startConversacion);
  const setDrawerOpen = useMensajesStore((s) => s.setDrawerOpen);
  const openConversacion = useMensajesStore((s) => s.openConversacion);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserveItem, setReserveItem] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/alojamientos/${id}`)
      .then((d) => setItem(d?.data || d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMessageHost = () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    if (user.rol !== "turista") {
      alert("Solo los turistas pueden iniciar una consulta con el anfitrión desde aquí.");
      return;
    }
    setChatOpen(true);
  };

  const submitChat = async (mensaje) => {
    const conv = await startConversacion({
      tipo: "reserva",
      id_alojamiento: item.id,
      asunto: `Consulta: ${item.titulo}`,
      mensaje_inicial: mensaje,
    });
    setChatOpen(false);
    setDrawerOpen(true);
    await openConversacion(conv.id);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!item) return <EmptyState icon={<BrandIcon fontSize="inherit" />} message="Alojamiento no encontrado" />;

  return (
    <>
      <AlojamientoDetail
        item={item}
        user={user}
        onBack={() => navigate("/explorar")}
        onReserve={(it) => {
          if (!user) onRequireAuth();
          else setReserveItem(it);
        }}
        onMessageHost={handleMessageHost}
      />
      {reserveItem && (
        <ReserveModal alojamiento={reserveItem} onClose={() => setReserveItem(null)} />
      )}
      {chatOpen && (
        <StartChatModal
          title="Mensaje al anfitrión"
          subtitle={`${item.titulo} · ${item.ubicacion}`}
          defaultMessage="Hola, me interesa este alojamiento. ¿Tienen disponibilidad?"
          onSubmit={submitChat}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
};

export default PageAlojamientoDetail;
