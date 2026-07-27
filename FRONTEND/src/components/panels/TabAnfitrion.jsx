import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useReservasStore from "../../stores/useReservasStore";
import { useAlojamientosStore } from "../../stores/useAlojamientosStore";
import { Badge, Spinner, EmptyState } from "../common/ui/index";
import { imagenesService } from "../../services/imagenes.service";
import { CalendarIcon, HomeIcon, BedIcon, RefreshIcon, SuccessIcon, ErrorIcon, BackIcon } from "../common/icons/icons";

// ─── TabReservasAnfitrion ──────────────────────────────────────────────────────
export const TabReservasAnfitrion = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [filtro, setFiltro] = useState("todas");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      await useReservasStore.getState().fetchAnfitrion();
      setReservas(useReservasStore.getState().reservas || []);
    } catch (e) { setMsg(e.message); setMsgType("error"); }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const cambiarEstado = async (id, estado) => {
    setMsg("");
    try {
      await useReservasStore.getState().updateReserva(id, { estado });
      setMsg(`Reserva ${estado === "confirmada" ? "confirmada" : "cancelada"} correctamente`);
      setMsgType("success");
      load();
    } catch (e) { setMsg(e.message); setMsgType("error"); }
  };

  const filtered = filtro === "todas" ? reservas : reservas.filter((r) => r.estado === filtro);
  const pendientes = reservas.filter((r) => r.estado === "pendiente").length;

  return (
    <div>
      {pendientes > 0 && (
        <div className="alert alert-amber" style={{ marginBottom: "1rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><CalendarIcon fontSize="small" /> Tienes <strong>{pendientes}</strong> reserva{pendientes !== 1 ? "s" : ""} pendiente{pendientes !== 1 ? "s" : ""} por confirmar</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "todas", label: "Todas" },
            { id: "pendiente", label: "Pendientes", icon: CalendarIcon },
            { id: "confirmada", label: "Confirmadas", icon: SuccessIcon },
            { id: "cancelada", label: "Canceladas", icon: ErrorIcon },
          ].map((f) => (
            <button key={f.id} className={`btn btn-sm ${filtro === f.id ? "btn-primary" : ""}`} onClick={() => setFiltro(f.id)}>
              {f.icon ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><f.icon fontSize="small" /> {f.label}</span> : f.label}
            </button>
          ))}
        </div>
        <button className="btn btn-sm" onClick={load} style={{ marginLeft: "auto" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><RefreshIcon fontSize="small" /> Actualizar</span></button>
      </div>

      {msg && <div className={`alert alert-${msgType === "error" ? "error" : "success"}`} style={{ marginBottom: "1rem" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{msgType === "error" ? <ErrorIcon fontSize="small" /> : <SuccessIcon fontSize="small" />} {msg}</span></div>}

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={<CalendarIcon fontSize="inherit" />} message={`No hay reservas ${filtro !== "todas" ? `en estado "${filtro}"` : "aún"}`} />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Entrada</th><th>Salida</th><th>Total</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td style={{ fontSize: "0.85rem" }}>{r.nombre_turista || `#${r.id_turista}`}</td>
                  <td>{new Date(r.fecha_inicio).toLocaleDateString("es-CO")}</td>
                  <td>{new Date(r.fecha_fin).toLocaleDateString("es-CO")}</td>
                  <td style={{ fontWeight: 500 }}>${parseFloat(r.total || 0).toFixed(0)}</td>
                  <td><Badge status={r.estado} /></td>
                  <td>
                    <div className="mod-actions">
                      {r.estado === "pendiente" && (
                        <>
                          <button className="btn btn-sm btn-primary" onClick={() => cambiarEstado(r.id, "confirmada")}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SuccessIcon fontSize="small" /> Confirmar</span></button>
                          <button className="btn btn-sm btn-danger" onClick={() => cambiarEstado(r.id, "cancelada")}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ErrorIcon fontSize="small" /> Cancelar</span></button>
                        </>
                      )}
                      {r.estado === "confirmada" && (
                        <button className="btn btn-sm btn-danger" onClick={() => cambiarEstado(r.id, "cancelada")}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ErrorIcon fontSize="small" /> Cancelar</span></button>
                      )}
                      {r.estado === "cancelada" && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>—</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "8px 14px", fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "0.5px solid var(--border)" }}>
            {filtered.length} reserva{filtered.length !== 1 ? "s" : ""}{filtro !== "todas" ? " (filtradas)" : " en total"}
          </div>
        </div>
      )}
    </div>
  );
};