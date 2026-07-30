import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import useReservasStore from "../../stores/useReservasStore";
import { useAlojamientosStore } from "../../stores/useAlojamientosStore";
import usePagosStore from "../../stores/usePagosStore";
import useUsuariosStore from "../../stores/useUsuariosStore";
import { useCategoriasStore } from "../../stores/useCategoriasStore";
import { Badge, Spinner, EmptyState } from "../../components/common/ui/index";
import UserAvatar from "../../components/common/UserAvatar";
import AlojamientosGrid from "../../components/panels/AlojamientosGrid";
import { TabModeracion, TabModeracionLog } from "../../components/panels/TabModeracion";
import { TabReservasAnfitrion } from "../../components/panels/TabAnfitrion";
import { CalendarIcon, HomeIcon, BedIcon, PaymentIcon, TagIcon, GroupIcon, AdminIcon, ReviewIcon } from "../../components/common/icons/icons";

// ─── Crear Categoría ───────────────────────────────────────────────────────────
const CrearCategoria = ({ onCreated }) => {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("alojamiento");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!nombre.trim()) return;
    try {
      await apiFetch("/categorias", { method: "POST", body: JSON.stringify({ nombre, tipo }) });
      setNombre(""); setMsg("¡Categoría creada!"); onCreated();
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 180px auto", gap: 8, marginBottom: "1.5rem", alignItems: "end" }}>
      <div>
        <label className="form-label">Nueva categoría</label>
        <input
          className="form-input"
          placeholder="Ej: Senderismo, Avistamiento..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
      <div>
        <label className="form-label">Tipo</label>
        <select className="form-input form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="alojamiento">Alojamiento</option>
        </select>
      </div>
      <button className="btn btn-primary btn-sm" onClick={submit} style={{ height: 42 }}>Agregar</button>
      {msg && <span style={{ fontSize: "0.8rem", color: "var(--green)" }}>{msg}</span>}
    </div>
  );
};

// ─── PagePanel ─────────────────────────────────────────────────────────────────
const PagePanel = ({ user }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("reservas");
  const [reservas, setReservas] = useState([]);
  const [alojamientos, setAlojamientos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadTab = useCallback(async (t) => {
    setLoading(true); setMsg("");
    try {
      if (t === "reservas")    { await useReservasStore.getState().fetchMine(); setReservas(useReservasStore.getState().mine || []); }
      if (t === "alojamientos"){ if (user.rol === "anfitrion") await useAlojamientosStore.getState().fetchMine(); else await useAlojamientosStore.getState().fetchAlojamientos(); setAlojamientos(useAlojamientosStore.getState().items || []); }
      if (t === "pagos")       { await usePagosStore.getState().fetchPagos(); setPagos(usePagosStore.getState().pagos || []); }
      if (t === "usuarios" && user.rol === "admin") { await useUsuariosStore.getState().fetchUsuarios(); setUsuarios(useUsuariosStore.getState().usuarios || []); }
      if (t === "categorias")  { await useCategoriasStore.getState().fetchCategorias("todas", true); setCategorias(useCategoriasStore.getState().porTipo.todas.items || []); }
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  }, [user]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadTab(tab); }, [tab, loadTab]);

  const cancelReserva = async (id) => {
    try { await apiFetch(`/reservas/${id}`, { method: "PUT", body: JSON.stringify({ estado: "cancelada" }) }); loadTab("reservas"); }
    catch (e) { setMsg(e.message); }
  };

  const deleteAlojamiento = async (id) => {
    if (!confirm("¿Eliminar este alojamiento?")) return;
    try { await useAlojamientosStore.getState().removeAlojamiento(id); loadTab("alojamientos"); }
    catch (e) { setMsg(e.message); }
  };

  const SPECIAL_TABS = ["moderacion", "moderacion_log", "reservas_recibidas"];

  const tabs = [
    { id: "reservas", label: "Mis Reservas", icon: CalendarIcon },
    ...(user.rol === "anfitrion" ? [
      { id: "reservas_recibidas", label: "Reservas recibidas", icon: CalendarIcon },
      { id: "alojamientos", label: "Alojamientos", icon: HomeIcon },
    ] : []),
    { id: "pagos", label: "Pagos", icon: PaymentIcon },
    ...(user.rol === "admin" ? [
      { id: "categorias", label: "Categorías", icon: TagIcon },
    ] : []),
    ...(user.rol === "admin" ? [
      { id: "alojamientos", label: "Alojamientos", icon: HomeIcon },
      { id: "usuarios", label: "Usuarios", icon: GroupIcon },
      { id: "moderacion", label: "Mod. Alojamientos", icon: AdminIcon },
      { id: "moderacion_log", label: "Log moderación", icon: ReviewIcon },
    ] : []),
  ];

  return (
    <div>
      {/* Profile Card */}
      <div className="profile-card">
        <UserAvatar user={user} />
        <div>
          <p style={{ fontWeight: 500, fontSize: "1rem" }}>{user.nombre}</p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.email}</p>
          <Badge status={user.rol} />
        </div>
      </div>

      {msg && <div className="alert alert-error">{msg}</div>}

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><t.icon fontSize="small" /> {t.label}</span>
          </button>
        ))}
      </div>

      {/* Special tabs (self-loading) */}
      {tab === "moderacion"         && <TabModeracion tipoInicial="alojamientos" />}

      {tab === "moderacion_log"     && <TabModeracionLog />}
      {tab === "reservas_recibidas" && <TabReservasAnfitrion />}


      {/* Data tabs */}
      {!SPECIAL_TABS.includes(tab) && (
        loading ? <Spinner /> : (
          <>
            {/* ── Mis Reservas ── */}
            {tab === "reservas" && (
              reservas.length === 0 ? <EmptyState icon={<CalendarIcon fontSize="inherit" />} message="Sin reservas aún" /> : (
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
                          <td>{r.estado === "pendiente" && <button className="btn btn-danger btn-sm" onClick={() => cancelReserva(r.id)}>Cancelar</button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* ── Alojamientos (cards) ── */}
            {tab === "alojamientos" && (
              <div>
                {(user.rol === "anfitrion" || user.rol === "admin") && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginBottom: "1rem" }}
                    onClick={() => navigate("/panel/alojamientos/nuevo")}
                  >
                    + Nuevo alojamiento
                  </button>
                )}
                <AlojamientosGrid
                  alojamientos={alojamientos}
                  user={user}
                  onView={(item) => navigate(`/alojamientos/${item.id}`)}
                  onDelete={deleteAlojamiento}
                />
              </div>
            )}

            {/* ── Pagos ── */}
            {tab === "pagos" && (
              pagos.length === 0 ? <EmptyState icon={<PaymentIcon fontSize="inherit" />} message="Sin pagos registrados" /> : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>Reserva</th><th>Monto</th><th>Método</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>
                      {pagos.map((p) => (
                        <tr key={p.id}>
                          <td>#{p.id}</td><td>#{p.id_reserva}</td>
                          <td>${parseFloat(p.monto || 0).toFixed(0)}</td>
                          <td>{p.metodo}</td>
                          <td><Badge status={p.estado} /></td>
                          <td>{new Date(p.fecha_pago).toLocaleDateString("es-CO")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* ── Categorías ── */}
            {tab === "categorias" && (
              <div>
                {user.rol === "admin" && <CrearCategoria onCreated={() => loadTab("categorias")} />}
                {categorias.length === 0 ? <EmptyState icon={<TagIcon fontSize="inherit" />} message="Sin categorías" /> : (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {categorias.map((c) => (
                      <span key={c.id} className="badge badge-green" style={{ padding: "6px 14px", fontSize: "0.875rem" }}>{c.nombre}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Usuarios (admin) ── */}
            {tab === "usuarios" && user.rol === "admin" && (
              usuarios.length === 0 ? <EmptyState icon={<GroupIcon fontSize="inherit" />} message="Sin usuarios" /> : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Registrado</th></tr></thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr key={u.id}>
                          <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "var(--green)", fontWeight: 600 }}>
                              {u.nombre?.[0]}
                            </div>
                            {u.nombre}
                          </td>
                          <td>{u.email}</td>
                          <td><Badge status={u.rol} /></td>
                          <td>{new Date(u.created_at).toLocaleDateString("es-CO")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )
      )}
    </div>
  );
};

export default PagePanel;