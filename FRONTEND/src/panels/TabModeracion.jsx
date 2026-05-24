// src/panels/TabModeracion.jsx
import { useState, useEffect, useCallback } from "react";
import useModeracionStore from "../stores/useModeracionStore";
import { apiFetch } from "../utils/api";
import { Badge, Spinner, EmptyState } from "../components/ui";
import { SuccessIcon, ErrorIcon, RefreshIcon, ReviewIcon, CalendarIcon } from "../components/icons";

// ─── TabModeracion ─────────────────────────────────────────────────────────────
export const TabModeracion = ({ tipoInicial = "alojamientos" }) => {
  const [tipo, setTipo] = useState(tipoInicial);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      if (tipo === "alojamientos") {
        const d = await apiFetch("/alojamientos");
        setItems(Array.isArray(d) ? d : []);
      } else {
        const aloj = await apiFetch("/alojamientos");
        const todosAloj = Array.isArray(aloj) ? aloj : [];
        const unidadesNested = await Promise.all(
          todosAloj.map((a) =>
            apiFetch(`/unidades/alojamiento/${a.id}`)
              .then((d) => (Array.isArray(d.data) ? d.data : []))
              .catch(() => [])
          )
        );
        setItems(unidadesNested.flat());
      }
    } catch (e) { setMsg(e.message); setMsgType("error"); }
    finally { setLoading(false); }
  }, [tipo]);

  useEffect(() => { const t = setTimeout(() => { load(); }, 0); return () => clearTimeout(t); }, [load]);

  const getEstado = (item) => item.estado || item.estado_publicacion || "pendiente_revision";

  const moderate = async (id, action, motivo = "") => {
    setMsg("");
    try {
      await useModeracionStore.getState().moderate(tipo, id, action, motivo);
      setMsg(`Acción "${action}" aplicada correctamente`);
      setMsgType("success");
      load();
    } catch (e) { setMsg(e.message); setMsgType("error"); }
  };

  const pedirMotivo = (label, callback) => {
    const m = prompt(`Motivo de ${label} (obligatorio):`);
    if (m && m.trim()) callback(m.trim());
    else if (m !== null) alert("El motivo es obligatorio.");
  };

  const pendientes = items.filter((i) => getEstado(i) === "pendiente_revision");
  const resto = items.filter((i) => getEstado(i) !== "pendiente_revision");

  const AccionesHistorial = ({ i }) => {
    const est = getEstado(i);
    return (
      <div className="mod-actions">
        {est !== "aprobado" && (
          <button className="btn btn-sm btn-primary" onClick={() => moderate(i.id, "aprobar")}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SuccessIcon fontSize="small" /> Aprobar</span></button>
        )}
        {est !== "rechazado" && (
          <button className="btn btn-sm btn-danger" onClick={() => pedirMotivo("rechazo", (m) => moderate(i.id, "rechazar", m))}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ErrorIcon fontSize="small" /> Rechazar</span></button>
        )}
        {est === "aprobado" && (
          <button className="btn btn-sm" onClick={() => pedirMotivo("suspensión", (m) => moderate(i.id, "suspender", m))}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ReviewIcon fontSize="small" /> Suspender</span></button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <button className={`btn btn-sm ${tipo === "alojamientos" ? "btn-primary" : ""}`} onClick={() => setTipo("alojamientos")}>Alojamientos</button>
        <button className={`btn btn-sm ${tipo === "unidades" ? "btn-primary" : ""}`} onClick={() => setTipo("unidades")}>Unidades</button>
      </div>

      {msg && <div className={`alert alert-${msgType === "error" ? "error" : "success"}`} style={{ marginBottom: "1rem" }}>{msg}</div>}

      {loading ? <Spinner /> : (
        <>
          {pendientes.length > 0 && (
            <>
              <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--amber)", marginBottom: "0.75rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><CalendarIcon fontSize="small" /> En revisión ({pendientes.length})</span>
              </h3>
              <div className="table-wrap" style={{ marginBottom: "1.5rem" }}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{tipo === "alojamientos" ? "Título" : "Nombre"}</th>
                      <th>{tipo === "alojamientos" ? "Ubicación" : "Tipo"}</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendientes.map((i) => (
                      <tr key={i.id}>
                        <td>#{i.id}</td>
                        <td>{i.titulo || i.nombre}</td>
                        <td>{i.ubicacion || i.tipo}</td>
                        <td><Badge status={getEstado(i)} /></td>
                        <td>
                          <div className="mod-actions">
                            <button className="btn btn-sm btn-primary" onClick={() => moderate(i.id, "aprobar")}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SuccessIcon fontSize="small" /> Aprobar</span></button>
                            <button className="btn btn-sm btn-danger" onClick={() => pedirMotivo("rechazo", (m) => moderate(i.id, "rechazar", m))}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ErrorIcon fontSize="small" /> Rechazar</span></button>
                            <button className="btn btn-sm" onClick={() => pedirMotivo("suspensión", (m) => moderate(i.id, "suspender", m))}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ReviewIcon fontSize="small" /> Suspender</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {resto.length > 0 && (
            <>
              <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                Historial ({resto.length})
              </h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{tipo === "alojamientos" ? "Título" : "Nombre"}</th>
                      <th>Estado</th>
                      <th>Motivo rechazo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resto.map((i) => (
                      <tr key={i.id}>
                        <td>#{i.id}</td>
                        <td>{i.titulo || i.nombre}</td>
                        <td><Badge status={getEstado(i)} /></td>
                        <td style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: 180 }}>
                          {i.motivo_rechazo || <span style={{ fontStyle: "italic", opacity: 0.5 }}>—</span>}
                        </td>
                        <td><AccionesHistorial i={i} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {items.length === 0 && <EmptyState icon={<ReviewIcon fontSize="inherit" />} message="Sin elementos para moderar" />}
        </>
      )}
    </div>
  );
};

// ─── TabModeracionLog ──────────────────────────────────────────────────────────
export const TabModeracionLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroAccion, setFiltroAccion] = useState("todas");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      const d = await apiFetch("/admin/moderacion/log");
      setLogs(Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []));
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { const t = setTimeout(() => { load(); }, 0); return () => clearTimeout(t); }, [load]);

  const filtered = logs.filter((l) => {
    const matchTipo = filtroTipo === "todos" || l.tipo_contenido === filtroTipo;
    const matchAccion = filtroAccion === "todas" || l.accion === filtroAccion;
    return matchTipo && matchAccion;
  });

  const accionBadge = (accion) => {
    const map = { aprobado: "badge-green", rechazado: "badge-red", suspendido: "badge-amber" };
    const label = { aprobado: "aprobó", rechazado: "rechazó", suspendido: "suspendió" };
    return <span className={`badge ${map[accion] || "badge-gray"}`}>{label[accion] || accion}</span>;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["todos", "alojamientos", "unidades"].map((t) => (
            <button key={t} className={`btn btn-sm ${filtroTipo === t ? "btn-primary" : ""}`} onClick={() => setFiltroTipo(t)}>
              {t === "todos" ? "Todos" : t === "alojamientos" ? "Alojamientos" : "Unidades"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["todas", "aprobado", "rechazado", "suspendido"].map((a) => (
            <button key={a} className={`btn btn-sm ${filtroAccion === a ? "btn-teal" : ""}`} onClick={() => setFiltroAccion(a)}>
              {a === "todas" ? "Toda acción" : a}
            </button>
          ))}
        </div>
        <button className="btn btn-sm" onClick={load} style={{ marginLeft: "auto" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><RefreshIcon fontSize="small" /> Actualizar</span></button>
      </div>

      {msg && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{msg}</div>}

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={<ReviewIcon fontSize="inherit" />} message="Sin registros de moderación" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Admin</th><th>Tipo</th><th>ID</th>
                <th>Anterior</th><th>Acción</th><th>Nuevo</th><th>Motivo</th><th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td>#{l.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--amber-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "var(--amber)", fontWeight: 700 }}>
                        {(l.admin_nombre || l.nombre_admin || "A")?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: "0.82rem" }}>{l.admin_nombre || l.nombre_admin || `#${l.id_admin_revision}`}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${l.tipo_contenido === "alojamientos" ? "badge-teal" : "badge-blue"}`}>{l.tipo_contenido}</span></td>
                  <td>#{l.id_contenido}</td>
                  <td><Badge status={l.estado_anterior} /></td>
                  <td>{accionBadge(l.accion)}</td>
                  <td><Badge status={l.estado_nuevo} /></td>
                  <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {l.motivo || <span style={{ fontStyle: "italic", opacity: 0.5 }}>—</span>}
                  </td>
                  <td style={{ fontSize: "0.78rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {l.fecha_revision ? new Date(l.fecha_revision).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "8px 14px", fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "0.5px solid var(--border)" }}>
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}{filtroTipo !== "todos" || filtroAccion !== "todas" ? " (filtrados)" : " en total"}
          </div>
        </div>
      )}
    </div>
  );
};