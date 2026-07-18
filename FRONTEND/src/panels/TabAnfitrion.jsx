// src/panels/TabAnfitrion.jsx
import { useState, useEffect, useCallback } from "react";
import useReservasStore from "../stores/useReservasStore";
import { useAlojamientosStore } from "../stores/useAlojamientosStore";
import { useUnidadesStore } from "../stores/useUnidadesStore";
import { Badge, Spinner, EmptyState } from "../components/ui";
import { AlojamientoForm } from "../components/Alojamiento/AlojamientoForm";
import { UnidadForm } from "../components/Unidad/UnidadForm";
import UnidadCard from "../components/Unidad/UnidadCard";
import { imagenesService } from "../services/imagenes.service";
import { CalendarIcon, HomeIcon, BedIcon, RefreshIcon, SuccessIcon, ErrorIcon, BackIcon } from "../components/icons";

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
                <th>ID</th><th>Turista</th><th>Unidad</th>
                <th>Entrada</th><th>Salida</th><th>Total</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td style={{ fontSize: "0.85rem" }}>{r.nombre_turista || `#${r.id_turista}`}</td>
                  <td style={{ fontSize: "0.85rem" }}>{r.nombre_unidad || `Unidad #${r.id_unidad}`}</td>
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

// ─── TabMisUnidades ────────────────────────────────────────────────────────────
export const TabMisUnidades = () => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [selectedAloj, setSelectedAloj] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await useAlojamientosStore.getState().fetchMine();
        setAlojamientos(useAlojamientosStore.getState().items || []);
      } catch {
        try {
          await useAlojamientosStore.getState().fetchAlojamientos();
          setAlojamientos(useAlojamientosStore.getState().items || []);
        } catch {
          // ignore
        }
      } finally { setLoading(false); }
    })();
  }, []);

  const loadUnidades = async (aloj) => {
    setSelectedAloj(aloj); setUnidades([]);
    try {
      await useUnidadesStore.getState().fetchByAlojamiento(aloj.id);
      const list = useUnidadesStore.getState().items || [];
      const withImages = await Promise.all(list.map(async (unidad) => {
        try {
          const images = await imagenesService.fetchUnidad(unidad.id);
          return { ...unidad, imagenes: Array.isArray(images) ? images : Array.isArray(images?.data) ? images.data : [] };
        } catch {
          return unidad;
        }
      }));
      setUnidades(withImages);
    } catch (e) { setMsg(e.message); }
  };

  const deleteUnidad = async (id) => {
    if (!confirm("¿Eliminar esta unidad?")) return;
    try {
      await useUnidadesStore.getState().removeUnidad(id);
      loadUnidades(selectedAloj);
    } catch (e) { setMsg(e.message); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {msg && <div className="alert alert-error">{msg}</div>}
      {alojamientos.length === 0 ? (
        <EmptyState icon={<HomeIcon fontSize="inherit" />} message="Crea un alojamiento primero para agregar unidades." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              Mis alojamientos
            </p>
            {alojamientos.map((a) => (
              <div
                key={a.id}
                onClick={() => loadUnidades(a)}
                style={{
                  padding: "10px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", marginBottom: 6,
                  background: selectedAloj?.id === a.id ? "var(--green-light)" : "var(--card-bg)",
                  border: `0.5px solid ${selectedAloj?.id === a.id ? "var(--green)" : "var(--border)"}`,
                  fontSize: "0.875rem",
                }}
              >
                <p style={{ fontWeight: 500 }}>{a.titulo}</p>
                <Badge status={a.estado || a.estado_publicacion} />
              </div>
            ))}
          </div>
          <div>
            {!selectedAloj ? (
              <EmptyState icon={<BackIcon fontSize="inherit" />} message="Selecciona un alojamiento" />
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 className="display" style={{ fontSize: "1.1rem" }}>Unidades — {selectedAloj.titulo}</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nueva unidad</button>
                </div>
                {unidades.length === 0 ? (
                  <EmptyState icon={<BedIcon fontSize="inherit" />} message="Sin unidades. Agrega una." />
                ) : (
                  <div className="unidad-grid">
                    {unidades.map((u) => (
                      <UnidadCard
                        key={u.id}
                        unidad={u}
                        actions={(
                          <button className="btn btn-danger btn-sm" onClick={() => deleteUnidad(u.id)}>
                            Eliminar
                          </button>
                        )}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showForm && selectedAloj && (
        <UnidadForm
          alojamientoId={selectedAloj.id}
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); loadUnidades(selectedAloj); }}
        />
      )}
    </div>
  );
};