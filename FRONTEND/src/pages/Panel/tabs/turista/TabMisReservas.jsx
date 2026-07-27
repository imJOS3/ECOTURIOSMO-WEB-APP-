import { useState, useEffect, useCallback } from "react";
import useReservasStore from "../../../../stores/useReservasStore";
import { apiFetch } from "../../../../utils/api";
import { Badge, Spinner, EmptyState } from "../../../../components/common/ui/index";
import { CalendarIcon } from "../../../../components/common/icons/icons";

/**
 * Tab: Mis Reservas
 * Carga y gestiona únicamente las reservas del usuario autenticado.
 * No conoce nada sobre otras tabs (alojamientos, pagos, etc).
 */
const TabMisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      await useReservasStore.getState().fetchMine();
      setReservas(useReservasStore.getState().mine || []);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cancelReserva = async (id) => {
    try {
      await apiFetch(`/reservas/${id}`, { method: "PUT", body: JSON.stringify({ estado: "cancelada" }) });
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {msg && <div className="alert alert-error">{msg}</div>}
      {reservas.length === 0 ? (
        <EmptyState icon={<CalendarIcon fontSize="inherit" />} message="Sin reservas aún" />
      ) : (
        <div className="table-wrap">
          <table>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{new Date(r.fecha_inicio).toLocaleDateString("es-CO")}</td>
                  <td>{new Date(r.fecha_fin).toLocaleDateString("es-CO")}</td>
                  <td>${parseFloat(r.total || 0).toFixed(0)}</td>
                  <td><Badge status={r.estado} /></td>
                  <td>
                    {r.estado === "pendiente" && (
                      <button className="btn btn-danger btn-sm" onClick={() => cancelReserva(r.id)}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TabMisReservas;