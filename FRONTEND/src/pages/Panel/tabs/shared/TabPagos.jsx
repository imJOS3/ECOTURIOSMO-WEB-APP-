import { useState, useEffect, useCallback } from "react";
import usePagosStore from "../../../../stores/usePagosStore";
import { Badge, Spinner, EmptyState } from "../../../../components/common/ui/index";
import { PaymentIcon } from "../../../../components/common/icons/icons";

const TabPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      await usePagosStore.getState().fetchPagos();
      setPagos(usePagosStore.getState().pagos || []);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;

  return (
    <div>
      {msg && <div className="alert alert-error">{msg}</div>}
      {pagos.length === 0 ? (
        <EmptyState icon={<PaymentIcon fontSize="inherit" />} message="Sin pagos registrados" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Reserva</th><th>Monto</th><th>Método</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {pagos.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>#{p.id_reserva}</td>
                  <td>${parseFloat(p.monto || 0).toFixed(0)}</td>
                  <td>{p.metodo}</td>
                  <td><Badge status={p.estado} /></td>
                  <td>{new Date(p.fecha_pago).toLocaleDateString("es-CO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TabPagos;