import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:3000/api";

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #3B6D11;
    --green-light: #EAF3DE;
    --green-mid: #97C459;
    --teal: #0F6E56;
    --teal-light: #E1F5EE;
    --amber: #854F0B;
    --amber-light: #FAEEDA;
    --red: #A32D2D;
    --red-light: #FCEBEB;
    --text: #27500A;
    --text-muted: #5F5E5A;
    --surface: #F7FAF2;
    --white: #ffffff;
    --border: rgba(59,109,17,0.15);
    --border-mid: rgba(59,109,17,0.3);
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 2px 12px rgba(59,109,17,0.08);
    --shadow-md: 0 4px 24px rgba(59,109,17,0.12);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--surface); color: var(--text); line-height: 1.6; }
  .display { font-family: 'Playfair Display', serif; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    background: var(--white); border-bottom: 0.5px solid var(--border-mid);
    padding: 0 2rem; display: flex; align-items: center;
    justify-content: space-between; height: 64px;
    position: sticky; top: 0; z-index: 100;
  }
  .nav-logo { font-family:'Playfair Display',serif; font-size:1.4rem; color:var(--green); display:flex; align-items:center; gap:8px; cursor:pointer; }
  .nav-links { display:flex; gap:4px; }
  .nav-link { padding:6px 14px; border-radius:var(--radius-sm); font-size:0.875rem; color:var(--text-muted); cursor:pointer; border:none; background:transparent; transition:all .15s; }
  .nav-link:hover { background:var(--green-light); color:var(--green); }
  .nav-link.active { background:var(--green-light); color:var(--green); font-weight:500; }
  .nav-actions { display:flex; gap:8px; align-items:center; }

  .btn { padding:8px 18px; border-radius:var(--radius-sm); font-size:0.875rem; font-weight:500; cursor:pointer; border:0.5px solid var(--border-mid); background:transparent; color:var(--green); transition:all .15s; font-family:'DM Sans',sans-serif; }
  .btn:hover { background:var(--green-light); }
  .btn-primary { background:var(--green); color:var(--white); border-color:var(--green); }
  .btn-primary:hover { background:#2e560d; }
  .btn-sm { padding:5px 12px; font-size:0.8rem; }
  .btn-danger { color:var(--red); border-color:rgba(163,45,45,.3); }
  .btn-danger:hover { background:var(--red-light); }
  .btn-teal { background:var(--teal); color:var(--white); border-color:var(--teal); }
  .btn-teal:hover { background:#0a5542; }
  .btn:disabled { opacity:.5; cursor:not-allowed; }

  /* HERO */
  .hero { background:linear-gradient(135deg,#173404 0%,#3B6D11 50%,#0F6E56 100%); color:white; padding:5rem 2rem; text-align:center; position:relative; overflow:hidden; }
  .hero::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
  .hero-content { position:relative; max-width:700px; margin:0 auto; }
  .hero h1 { font-family:'Playfair Display',serif; font-size:3.5rem; font-weight:600; line-height:1.1; margin-bottom:1rem; }
  .hero h1 em { font-style:italic; color:#9FE1CB; }
  .hero p { font-size:1.1rem; font-weight:300; opacity:.85; margin-bottom:2rem; }
  .hero-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .hero-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.12); border:0.5px solid rgba(255,255,255,.25); border-radius:20px; padding:4px 14px; font-size:.8rem; margin-bottom:1.5rem; }

  /* LAYOUT */
  .main { flex:1; padding:3rem 2rem; max-width:1200px; margin:0 auto; width:100%; }
  .section-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:1.5rem; }
  .section-title { font-family:'Playfair Display',serif; font-size:1.6rem; color:var(--text); }
  .section-sub { font-size:.85rem; color:var(--text-muted); }

  /* STATS */
  .stats-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-bottom:2rem; }
  .stat-card { background:var(--white); border:0.5px solid var(--border); border-radius:var(--radius-sm); padding:1rem; }
  .stat-label { font-size:.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:.05em; }
  .stat-value { font-size:1.5rem; font-weight:500; color:var(--green); }
  .stat-icon { font-size:1.2rem; float:right; margin-top:2px; }

  /* CARDS */
  .cards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.5rem; }
  .card { background:var(--white); border:0.5px solid var(--border); border-radius:var(--radius); overflow:hidden; transition:box-shadow .2s,transform .2s; cursor:pointer; }
  .card:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
  .card-img { height:180px; background:linear-gradient(135deg,var(--green-light),#C0DD97); display:flex; align-items:center; justify-content:center; font-size:4rem; position:relative; overflow:hidden; }
  .card-img-pattern { position:absolute; inset:0; opacity:.15; background:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(59,109,17,.3) 10px,rgba(59,109,17,.3) 11px); }
  .card-badge { position:absolute; top:12px; right:12px; background:var(--white); color:var(--green); font-size:.75rem; font-weight:500; padding:3px 10px; border-radius:20px; border:0.5px solid var(--border-mid); }
  .card-body { padding:1rem 1.25rem; }
  .card-title { font-family:'Playfair Display',serif; font-size:1.1rem; margin-bottom:4px; }
  .card-location { font-size:.8rem; color:var(--text-muted); margin-bottom:8px; }
  .card-desc { font-size:.85rem; color:var(--text-muted); line-height:1.5; margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .card-footer { display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:0.5px solid var(--border); }
  .card-price { font-size:1rem; font-weight:500; color:var(--green); }
  .card-price span { font-size:.75rem; font-weight:400; color:var(--text-muted); }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; background:rgba(23,52,4,.5); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1rem; }
  .modal { background:var(--white); border-radius:var(--radius); padding:2rem; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(23,52,4,.25); }
  .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
  .modal-title { font-family:'Playfair Display',serif; font-size:1.4rem; }
  .modal-close { background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted); padding:4px; line-height:1; }

  /* FORMS */
  .form-group { margin-bottom:1rem; }
  .form-label { display:block; font-size:.8rem; font-weight:500; margin-bottom:6px; }
  .form-input { width:100%; padding:10px 14px; border:0.5px solid var(--border-mid); border-radius:var(--radius-sm); font-family:'DM Sans',sans-serif; font-size:.9rem; color:var(--text); background:var(--surface); outline:none; transition:border-color .15s; }
  .form-input:focus { border-color:var(--green); background:var(--white); }
  .form-select { appearance:none; cursor:pointer; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .form-hint { font-size:.75rem; color:var(--text-muted); margin-top:4px; }

  /* TABS */
  .tabs { display:flex; gap:4px; border-bottom:0.5px solid var(--border-mid); margin-bottom:1.5rem; flex-wrap:wrap; }
  .tab { padding:8px 16px; font-size:.875rem; cursor:pointer; border:none; background:none; color:var(--text-muted); border-bottom:2px solid transparent; transition:all .15s; margin-bottom:-0.5px; font-family:'DM Sans',sans-serif; }
  .tab:hover { color:var(--green); }
  .tab.active { color:var(--green); border-bottom-color:var(--green); font-weight:500; }

  /* TABLE */
  .table-wrap { background:var(--white); border:0.5px solid var(--border); border-radius:var(--radius); overflow:auto; }
  table { width:100%; border-collapse:collapse; font-size:.875rem; }
  thead { background:var(--green-light); }
  th { padding:10px 14px; text-align:left; font-weight:500; color:var(--green); font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; }
  td { padding:10px 14px; border-bottom:0.5px solid var(--border); color:var(--text); }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:var(--surface); }

  /* BADGES */
  .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:.75rem; font-weight:500; }
  .badge-green { background:var(--green-light); color:var(--green); }
  .badge-amber { background:var(--amber-light); color:var(--amber); }
  .badge-red { background:var(--red-light); color:var(--red); }
  .badge-teal { background:var(--teal-light); color:var(--teal); }
  .badge-gray { background:#F1EFE8; color:#5F5E5A; }
  .badge-blue { background:#E3F0FF; color:#1a56b0; }

  /* ALERTS */
  .alert { padding:10px 14px; border-radius:var(--radius-sm); font-size:.875rem; margin-bottom:1rem; }
  .alert-success { background:var(--green-light); color:var(--green); border:0.5px solid rgba(59,109,17,.2); }
  .alert-error { background:var(--red-light); color:var(--red); border:0.5px solid rgba(163,45,45,.2); }
  .alert-info { background:var(--teal-light); color:var(--teal); border:0.5px solid rgba(15,110,86,.2); }
  .alert-amber { background:var(--amber-light); color:var(--amber); border:0.5px solid rgba(133,79,11,.2); }

  /* DETAIL */
  .detail-hero { background:linear-gradient(135deg,var(--green-light),#C0DD97); height:260px; border-radius:var(--radius); display:flex; align-items:center; justify-content:center; font-size:6rem; position:relative; overflow:hidden; margin-bottom:1.5rem; }
  .detail-layout { display:grid; grid-template-columns:1fr 340px; gap:2rem; }
  .detail-sidebar { display:flex; flex-direction:column; gap:1rem; }
  .sidebar-card { background:var(--white); border:0.5px solid var(--border); border-radius:var(--radius); padding:1.25rem; }
  .sidebar-card-title { font-size:.8rem; text-transform:uppercase; letter-spacing:.05em; color:var(--text-muted); margin-bottom:1rem; }

  /* UNIT CARD */
  .unit-row { background:var(--white); border:0.5px solid var(--border); border-radius:var(--radius-sm); padding:12px 16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; cursor:pointer; transition:box-shadow .15s; }
  .unit-row:hover { box-shadow:var(--shadow); }
  .unit-row.selected { border-color:var(--green); background:var(--green-light); }

  /* PROFILE */
  .profile-card { background:var(--white); border:0.5px solid var(--border); border-radius:var(--radius); padding:1.5rem; display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; }
  .avatar { width:56px; height:56px; border-radius:50%; background:var(--green-light); display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:600; color:var(--green); font-family:'Playfair Display',serif; flex-shrink:0; }

  /* STARS */
  .stars { color:var(--amber); letter-spacing:2px; }

  /* EMPTY / LOADER */
  .empty { text-align:center; padding:3rem; color:var(--text-muted); }
  .empty-icon { font-size:3rem; margin-bottom:1rem; }
  .loader { display:flex; align-items:center; justify-content:center; padding:3rem; }
  .spinner { width:28px; height:28px; border:2px solid var(--border-mid); border-top-color:var(--green); border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* FOOTER */
  .footer { background:#27500A; color:rgba(255,255,255,.7); padding:2rem; text-align:center; font-size:.85rem; }
  .footer strong { color:white; font-family:'Playfair Display',serif; }

  /* MODERATION ACTIONS */
  .mod-actions { display:flex; gap:6px; flex-wrap:wrap; }

  @media (max-width:768px) {
    .detail-layout { grid-template-columns:1fr; }
    .hero h1 { font-size:2.2rem; }
    .nav-links { display:none; }
    .form-row { grid-template-columns:1fr; }
  }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getToken = () => localStorage.getItem("eco_token");
const getUser  = () => { try { return JSON.parse(localStorage.getItem("eco_user")); } catch { return null; } };

const apiFetch = async (path, opts = {}) => {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};

const emojis = ["🌿","🏕️","🌄","🌲","🦋","🍃","🌊","🏔️","🌸","🌺"];
const randomEmoji = (id) => emojis[(id || 0) % emojis.length];

const StarRating = ({ value = 0 }) => (
  <span className="stars">{"★".repeat(Math.min(value, 5))}{"☆".repeat(Math.max(0, 5 - value))}</span>
);

/* Badge — handles both old & new status values */
const Badge = ({ status }) => {
  const map = {
    // reservas
    pendiente: "badge-amber", confirmada: "badge-green", cancelada: "badge-red",
    // pagos
    exitoso: "badge-green", fallido: "badge-red", reembolsado: "badge-gray",
    // estado_publicacion (nuevo)
    pendiente_revision: "badge-amber", aprobado: "badge-green",
    rechazado: "badge-red", suspendido: "badge-gray",
    // roles
    turista: "badge-teal", anfitrion: "badge-green", admin: "badge-amber",
    // unidad disponibilidad
    true: "badge-green", false: "badge-red",
  };
  const label = {
    pendiente_revision: "en revisión", aprobado: "aprobado",
    rechazado: "rechazado", suspendido: "suspendido",
  };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{label[status] || status}</span>;
};

/* ─── Auth Modal ──────────────────────────────────────────────────────────── */
const AuthModal = ({ mode: initialMode, onClose, onAuth }) => {
  const [mode, setMode] = useState(initialMode || "login");
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "turista" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) });
        localStorage.setItem("eco_token", data.token);
        localStorage.setItem("eco_user", JSON.stringify(data.user));
        onAuth(data.user);
      } else {
        await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(form) });
        setMode("login"); setError("");
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">{mode === "login" ? "Bienvenido" : "Únete"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="tabs" style={{ marginBottom: "1.5rem" }}>
          <button className={`tab ${mode==="login"?"active":""}`} onClick={() => setMode("login")}>Ingresar</button>
          <button className={`tab ${mode==="register"?"active":""}`} onClick={() => setMode("register")}>Registrarse</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input className="form-input" placeholder="Tu nombre" value={form.nombre} onChange={set("nombre")} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input className="form-input" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={set("email")} />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        </div>
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Tipo de cuenta</label>
            <select className="form-input form-select" value={form.rol} onChange={set("rol")}>
              <option value="turista">🧍 Turista — Explorar y reservar</option>
              <option value="anfitrion">🏡 Anfitrión — Ofrecer alojamientos</option>
              <option value="admin">🛡️ Administrador — Gestionar plataforma</option>
            </select>
          </div>
        )}
        <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={submit} disabled={loading}>
          {loading ? "Cargando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
      </div>
    </div>
  );
};

/* ─── Alojamiento Card ────────────────────────────────────────────────────── */
const AlojamientoCard = ({ item, onClick }) => (
  <div className="card" onClick={() => onClick(item)}>
    <div className="card-img">
      <div className="card-img-pattern" />
      <span style={{ position: "relative", zIndex: 1 }}>{randomEmoji(item.id)}</span>
      <span className="card-badge">{item.estado || item.estado_publicacion || "activo"}</span>
    </div>
    <div className="card-body">
      <h3 className="card-title">{item.titulo}</h3>
      <p className="card-location">📍 {item.ubicacion}</p>
      <p className="card-desc">{item.descripcion}</p>
      <div className="card-footer">
        <span className="card-price">Ver unidades <span>→</span></span>
        <Badge status={item.estado || item.estado_publicacion} />
      </div>
    </div>
  </div>
);

/* ─── Reserve Modal (selecciona unidad) ───────────────────────────────────── */
const ReserveModal = ({ alojamiento, onClose }) => {
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [form, setForm] = useState({ fecha_inicio: "", fecha_fin: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    apiFetch(`/unidades/alojamiento/${alojamiento.id}`)
      .then(d => setUnidades(Array.isArray(d.data) ? d.data : []))
      .catch(() => {});
  }, [alojamiento.id]);

  const noches = form.fecha_inicio && form.fecha_fin
    ? Math.max(0, Math.round((new Date(form.fecha_fin) - new Date(form.fecha_inicio)) / 86400000))
    : 0;
  const total = selectedUnidad ? noches * parseFloat(selectedUnidad.precio_noche || 0) : 0;

  const submit = async () => {
    if (!selectedUnidad) { setMsg("Selecciona una unidad"); return; }
    if (!form.fecha_inicio || !form.fecha_fin) { setMsg("Completa las fechas"); return; }
    setLoading(true); setMsg("");
    try {
      await apiFetch("/reservas", {
        method: "POST",
        body: JSON.stringify({ id_unidad: selectedUnidad.id, ...form }),
      });
      setDone(true);
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">Reservar</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {done ? (
          <div>
            <div className="alert alert-success">✅ ¡Reserva creada! Queda en estado pendiente.</div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>{alojamiento.titulo} · {alojamiento.ubicacion}</p>

            {unidades.length === 0 ? (
              <div className="alert alert-info">No hay unidades disponibles para este alojamiento.</div>
            ) : (
              <>
                <p className="form-label" style={{ marginBottom: "8px" }}>Selecciona una unidad</p>
                {unidades.map(u => (
                  <div
                    key={u.id}
                    className={`unit-row ${selectedUnidad?.id === u.id ? "selected" : ""}`}
                    onClick={() => setSelectedUnidad(u)}
                  >
                    <div>
                      <span style={{ fontWeight: 500 }}>{u.nombre}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 8 }}>
                        {u.tipo} · Cap. {u.capacidad}{u.es_compartido ? " · compartido" : ""}
                      </span>
                    </div>
                    <span style={{ color: "var(--green)", fontWeight: 500 }}>${parseFloat(u.precio_noche || 0).toFixed(0)}/noche</span>
                  </div>
                ))}

                <div className="form-row" style={{ marginTop: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Entrada</label>
                    <input type="date" className="form-input" value={form.fecha_inicio} onChange={set("fecha_inicio")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salida</label>
                    <input type="date" className="form-input" value={form.fecha_fin} onChange={set("fecha_fin")} />
                  </div>
                </div>

                {noches > 0 && selectedUnidad && (
                  <div className="alert alert-info">
                    {noches} {noches === 1 ? "noche" : "noches"} · Total estimado: <strong>${total.toFixed(0)}</strong>
                  </div>
                )}
              </>
            )}

            {msg && <div className="alert alert-error">{msg}</div>}
            <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={submit} disabled={loading || !selectedUnidad || !form.fecha_inicio || !form.fecha_fin}>
              {loading ? "Procesando..." : "Confirmar reserva"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Alojamiento Detail ──────────────────────────────────────────────────── */
const AlojamientoDetail = ({ item, user, onBack, onReserve }) => {
  const [resenas, setResenas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [newResena, setNewResena] = useState({ calificacion: 5, comentario: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiFetch(`/resenas/alojamiento/${item.id}`).then(setResenas).catch(() => {});
    apiFetch(`/unidades/alojamiento/${item.id}`).then(d => setUnidades(Array.isArray(d.data) ? d.data : [])).catch(() => {});
  }, [item.id]);

  const submitResena = async () => {
    try {
      await apiFetch("/resenas", { method: "POST", body: JSON.stringify({ id_alojamiento: item.id, ...newResena }) });
      setMsg("¡Reseña publicada!");
      const updated = await apiFetch(`/resenas/alojamiento/${item.id}`);
      setResenas(updated);
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div>
      <button className="btn btn-sm" onClick={onBack} style={{ marginBottom: "1.5rem" }}>← Volver</button>
      <div className="detail-hero">
        <div className="card-img-pattern" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
        <span style={{ position: "relative", zIndex: 1, fontSize: "7rem" }}>{randomEmoji(item.id)}</span>
      </div>
      <div className="detail-layout">
        <div>
          <h1 className="display" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.titulo}</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>📍 {item.ubicacion}</p>
          <Badge status={item.estado || item.estado_publicacion} />
          <p style={{ lineHeight: "1.8", margin: "1.5rem 0 2rem" }}>{item.descripcion}</p>

          {/* Unidades */}
          {unidades.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Unidades disponibles</h3>
              {unidades.map(u => (
                <div key={u.id} className="unit-row" style={{ cursor: "default" }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{u.nombre}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 8 }}>
                      {u.tipo} · Cap. {u.capacidad}{u.es_compartido ? " · compartido" : ""}
                    </span>
                    <div style={{ marginTop: 4 }}><Badge status={u.estado || u.estado_publicacion} /></div>
                  </div>
                  <span style={{ color: "var(--green)", fontWeight: 500 }}>${parseFloat(u.precio_noche || 0).toFixed(0)}/noche</span>
                </div>
              ))}
            </div>
          )}

          {/* Reseñas */}
          <div>
            <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Reseñas ({resenas.length})</h3>
            {resenas.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Aún no hay reseñas.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1.5rem" }}>
                {resenas.map(r => (
                  <div key={r.id} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <StarRating value={r.calificacion} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(r.fecha).toLocaleDateString("es-CO")}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem" }}>{r.comentario}</p>
                  </div>
                ))}
              </div>
            )}
            {user && (
              <div style={{ background: "var(--white)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 500, marginBottom: 10 }}>Deja tu reseña</p>
                <div className="form-group">
                  <label className="form-label">Calificación</label>
                  <select className="form-input form-select" value={newResena.calificacion} onChange={e => setNewResena(r => ({ ...r, calificacion: parseInt(e.target.value) }))}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{"★".repeat(n)} {n}/5</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Comentario</label>
                  <textarea className="form-input" rows={3} value={newResena.comentario} onChange={e => setNewResena(r => ({ ...r, comentario: e.target.value }))} style={{ resize: "vertical" }} />
                </div>
                {msg && <div className={`alert ${msg.includes("!") ? "alert-success" : "alert-error"}`}>{msg}</div>}
                <button className="btn btn-primary btn-sm" onClick={submitResena}>Publicar reseña</button>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="detail-sidebar">
          <div className="sidebar-card">
            <p className="sidebar-card-title">Reservar</p>
            {user ? (
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onReserve(item)}>
                Seleccionar unidad y reservar
              </button>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Inicia sesión para reservar.</p>
            )}
          </div>
          <div className="sidebar-card">
            <p className="sidebar-card-title">Detalles</p>
            <table style={{ width: "100%", fontSize: "0.85rem" }}>
              <tbody>
                <tr><td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Estado</td><td style={{ textAlign: "right" }}><Badge status={item.estado || item.estado_publicacion} /></td></tr>
                {item.latitud && <tr><td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Coordenadas</td><td style={{ textAlign: "right", fontSize: "0.75rem" }}>{parseFloat(item.latitud).toFixed(4)}, {parseFloat(item.longitud).toFixed(4)}</td></tr>}
                <tr><td style={{ color: "var(--text-muted)", padding: "4px 0" }}>Unidades</td><td style={{ textAlign: "right" }}>{unidades.length}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Explorar ──────────────────────────────────────────────────────── */
const PageExplorar = ({ user, onRequireAuth }) => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [reserveItem, setReserveItem] = useState(null);

  useEffect(() => {
    apiFetch("/alojamientos").then(d => { setAlojamientos(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = alojamientos.filter(a =>
    a.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    a.ubicacion?.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) return (
    <>
      <AlojamientoDetail item={selected} user={user} onBack={() => setSelected(null)}
        onReserve={item => { if (!user) onRequireAuth(); else setReserveItem(item); }} />
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
        <input className="form-input" placeholder="🔍  Buscar por nombre o ubicación..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>
      {loading ? <div className="loader"><div className="spinner" /></div>
        : filtered.length === 0 ? <div className="empty"><div className="empty-icon">🌿</div><p>No se encontraron alojamientos</p></div>
        : <div className="cards-grid">{filtered.map(a => <AlojamientoCard key={a.id} item={a} onClick={setSelected} />)}</div>
      }
    </div>
  );
};

/* ─── Form: Crear Alojamiento ─────────────────────────────────────────────── */
const AlojamientoForm = ({ onClose, onCreated }) => {
  // NOTA: El precio NO va en alojamiento. La tabla `alojamiento` no tiene columna precio.
  // El precio vive en cada `unidad` (precio_noche). El schema Joi del backend tiene un
  // bug incluyendo `precio` — corrígelo en alojamiento.schema.js (ver comentario abajo).
  const [form, setForm] = useState({ titulo: "", descripcion: "", ubicacion: "", latitud: "", longitud: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.titulo.trim()) { setError("El título es obligatorio"); return; }
    if (form.descripcion.trim().length < 10) { setError("La descripción debe tener al menos 10 caracteres"); return; }
    if (!form.ubicacion.trim()) { setError("La ubicación es obligatoria"); return; }
    setLoading(true); setError("");
    try {
      await apiFetch("/alojamientos", {
        method: "POST",
        body: JSON.stringify({
          titulo: form.titulo.trim(),
          descripcion: form.descripcion.trim(),
          ubicacion: form.ubicacion.trim(),
          latitud: form.latitud ? parseFloat(form.latitud) : null,
          longitud: form.longitud ? parseFloat(form.longitud) : null,
        }),
      });
      onCreated();
    } catch (e) { setError(e.message); setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">Nuevo alojamiento</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="alert alert-amber">
          ⏳ El alojamiento quedará en revisión hasta que un admin lo apruebe. El precio se configura en cada unidad.
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Título *</label>
          <input className="form-input" placeholder="Ej: Cabaña Bosque Nublado" value={form.titulo} onChange={set("titulo")} />
        </div>
        <div className="form-group">
          <label className="form-label">Descripción * (mín. 10 caracteres)</label>
          <textarea className="form-input" rows={3} placeholder="Describe el alojamiento, sus atractivos naturales, servicios..." value={form.descripcion} onChange={set("descripcion")} style={{ resize: "vertical" }} />
        </div>
        <div className="form-group">
          <label className="form-label">Ubicación *</label>
          <input className="form-input" placeholder="Ej: Sierra Nevada, Colombia" value={form.ubicacion} onChange={set("ubicacion")} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Latitud (opcional)</label>
            <input className="form-input" type="number" step="any" placeholder="4.711" value={form.latitud} onChange={set("latitud")} />
          </div>
          <div className="form-group">
            <label className="form-label">Longitud (opcional)</label>
            <input className="form-input" type="number" step="any" placeholder="-74.072" value={form.longitud} onChange={set("longitud")} />
          </div>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          💡 Después de que el admin apruebe el alojamiento, podrás agregar unidades con su precio por noche.
        </p>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={loading}>
          {loading ? "Guardando..." : "Crear alojamiento"}
        </button>
      </div>
    </div>
  );
};

/* ─── Form: Crear Unidad ──────────────────────────────────────────────────── */
const UnidadForm = ({ alojamientoId, onClose, onCreated }) => {
  const [form, setForm] = useState({ nombre: "", tipo: "habitacion", descripcion: "", capacidad: 1, es_compartido: false, precio_noche: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.nombre || !form.precio_noche) { setError("Nombre y precio son obligatorios"); return; }
    setLoading(true); setError("");
    try {
      await apiFetch("/unidades", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          id_alojamiento: alojamientoId,
          capacidad: parseInt(form.capacidad) || 1,
          precio_noche: parseFloat(form.precio_noche),
          es_compartido: form.es_compartido === true || form.es_compartido === "true",
        }),
      });
      onCreated();
    } catch (e) { setError(e.message); setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">Nueva unidad</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="alert alert-amber">La unidad quedará en revisión hasta ser aprobada.</div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input className="form-input" placeholder="Ej: Cabaña Principal" value={form.nombre} onChange={set("nombre")} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select className="form-input form-select" value={form.tipo} onChange={set("tipo")}>
              <option value="habitacion">Habitación</option>
              <option value="cabaña">Cabaña</option>
              <option value="glamping">Glamping</option>
              <option value="apartamento">Apartamento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Capacidad (personas)</label>
            <input className="form-input" type="number" min={1} value={form.capacidad} onChange={set("capacidad")} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea className="form-input" rows={2} value={form.descripcion} onChange={set("descripcion")} style={{ resize: "vertical" }} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Precio por noche</label>
            <input className="form-input" type="number" min={0} step="1000" placeholder="150000" value={form.precio_noche} onChange={set("precio_noche")} />
          </div>
          <div className="form-group">
            <label className="form-label">¿Compartido?</label>
            <select className="form-input form-select" value={String(form.es_compartido)} onChange={e => setForm(f => ({ ...f, es_compartido: e.target.value === "true" }))}>
              <option value="false">No — privado</option>
              <option value="true">Sí — compartido</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={loading}>
          {loading ? "Guardando..." : "Crear unidad"}
        </button>
      </div>
    </div>
  );
};

/* ─── Crear Categoría ─────────────────────────────────────────────────────── */
const CrearCategoria = ({ onCreated }) => {
  const [nombre, setNombre] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async () => {
    if (!nombre.trim()) return;
    try {
      await apiFetch("/categorias", { method: "POST", body: JSON.stringify({ nombre }) });
      setNombre(""); setMsg("¡Categoría creada!"); onCreated();
    } catch (e) { setMsg(e.message); }
  };
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", alignItems: "flex-end" }}>
      <div style={{ flex: 1 }}>
        <label className="form-label">Nueva categoría</label>
        <input className="form-input" placeholder="Ej: Senderismo, Avistamiento..." value={nombre} onChange={e => setNombre(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
      </div>
      <button className="btn btn-primary btn-sm" onClick={submit} style={{ height: 42 }}>Agregar</button>
      {msg && <span style={{ fontSize: "0.8rem", color: "var(--green)" }}>{msg}</span>}
    </div>
  );
};

/* ─── Panel: Moderación (admin) ───────────────────────────────────────────── */
const TabModeracion = ({ tipoInicial = "alojamientos" }) => {
  const [tipo, setTipo] = useState(tipoInicial); // alojamientos | unidades
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
          todosAloj.map(a => apiFetch(`/unidades/alojamiento/${a.id}`).then(d => (Array.isArray(d.data) ? d.data : [])).catch(() => []))
        );
        setItems(unidadesNested.flat());
      }
    } catch (e) { setMsg(e.message); setMsgType("error"); }
    finally { setLoading(false); }
  }, [tipo]);

  useEffect(() => { load(); }, [load]);

  // Normaliza el campo estado — la tabla alojamiento usa "estado", unidad usa "estado"
  // El servicio devuelve la fila completa con RETURNING *, así que usamos el campo correcto
  const getEstado = (item) => item.estado || item.estado_publicacion || "pendiente_revision";

  // Ruta correcta del backend: POST /api/admin/moderacion/alojamientos/:id/aprobar
  const moderate = async (id, action, motivo = "") => {
    setMsg("");
    try {
      const body = motivo ? JSON.stringify({ motivo }) : JSON.stringify({});
      // tipo ya es "alojamientos" o "unidades" (plural) — coincide con las rutas del backend
      await apiFetch(`/admin/moderacion/${tipo}/${id}/${action}`, { method: "POST", body });
      setMsg(`✅ Acción "${action}" aplicada correctamente`);
      setMsgType("success");
      load();
    } catch (e) { setMsg(e.message); setMsgType("error"); }
  };

  const pedirMotivo = (label, callback) => {
    const m = prompt(`Motivo de ${label} (obligatorio):`);
    if (m && m.trim()) callback(m.trim());
    else if (m !== null) alert("El motivo es obligatorio.");
  };

  const pendientes = items.filter(i => getEstado(i) === "pendiente_revision");
  const resto = items.filter(i => getEstado(i) !== "pendiente_revision");

  const AccionesHistorial = ({ i }) => {
    const est = getEstado(i);
    return (
      <div className="mod-actions">
        {est !== "aprobado" && (
          <button className="btn btn-sm btn-primary" onClick={() => moderate(i.id, "aprobar")}>✅ Aprobar</button>
        )}
        {est !== "rechazado" && (
          <button className="btn btn-sm btn-danger" onClick={() => pedirMotivo("rechazo", m => moderate(i.id, "rechazar", m))}>❌ Rechazar</button>
        )}
        {est === "aprobado" && (
          <button className="btn btn-sm" onClick={() => pedirMotivo("suspensión", m => moderate(i.id, "suspender", m))}>⏸ Suspender</button>
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

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <>
          {pendientes.length > 0 && (
            <>
              <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--amber)", marginBottom: "0.75rem" }}>
                ⏳ En revisión ({pendientes.length})
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
                    {pendientes.map(i => (
                      <tr key={i.id}>
                        <td>#{i.id}</td>
                        <td>{i.titulo || i.nombre}</td>
                        <td>{i.ubicacion || i.tipo}</td>
                        <td><Badge status={getEstado(i)} /></td>
                        <td>
                          <div className="mod-actions">
                            <button className="btn btn-sm btn-primary" onClick={() => moderate(i.id, "aprobar")}>✅ Aprobar</button>
                            <button className="btn btn-sm btn-danger" onClick={() => pedirMotivo("rechazo", m => moderate(i.id, "rechazar", m))}>❌ Rechazar</button>
                            <button className="btn btn-sm" onClick={() => pedirMotivo("suspensión", m => moderate(i.id, "suspender", m))}>⏸ Suspender</button>
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
                    {resto.map(i => (
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

          {items.length === 0 && <div className="empty"><div className="empty-icon">🛡️</div><p>Sin elementos para moderar</p></div>}
        </>
      )}
    </div>
  );
};

/* ─── Panel: Moderación Log (admin) ───────────────────────────────────────── */
const TabModeracionLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroAccion, setFiltroAccion] = useState("todas");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      // GET /api/admin/moderacion/log — requiere token admin
      const d = await apiFetch("/admin/moderacion/log");
      setLogs(Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []));
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = logs.filter(l => {
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
          {["todos","alojamientos","unidades"].map(t => (
            <button key={t} className={`btn btn-sm ${filtroTipo === t ? "btn-primary" : ""}`} onClick={() => setFiltroTipo(t)}>
              {t === "todos" ? "Todos" : t === "alojamientos" ? "Alojamientos" : "Unidades"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["todas","aprobado","rechazado","suspendido"].map(a => (
            <button key={a} className={`btn btn-sm ${filtroAccion === a ? "btn-teal" : ""}`} onClick={() => setFiltroAccion(a)}>
              {a === "todas" ? "Toda acción" : a}
            </button>
          ))}
        </div>
        <button className="btn btn-sm" onClick={load} style={{ marginLeft: "auto" }}>↻ Actualizar</button>
      </div>

      {msg && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {msg}
          {msg.toLowerCase().includes("ruta") || msg.toLowerCase().includes("not found") ? (
            <span style={{ display: "block", fontSize: "0.8rem", marginTop: 4 }}>
              ⚠️ Verifica que el backend tenga la ruta <code>GET /api/admin/moderacion/log</code>
            </span>
          ) : null}
        </div>
      )}

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📋</div><p>Sin registros de moderación</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Admin</th>
                  <th>Tipo</th>
                  <th>ID Contenido</th>
                  <th>Estado anterior</th>
                  <th>Acción</th>
                  <th>Estado nuevo</th>
                  <th>Motivo</th>
                  <th>Fecha revisión</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
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
                    <td>
                      <span className={`badge ${l.tipo_contenido === "alojamientos" ? "badge-teal" : "badge-blue"}`}>
                        {l.tipo_contenido}
                      </span>
                    </td>
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
        )
      )}
    </div>
  );
};


/* ─── Panel: Reservas Recibidas (anfitrión) ───────────────────────────────── */
const TabReservasAnfitrion = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [filtro, setFiltro] = useState("todas");

  const load = useCallback(async () => {
    setLoading(true); setMsg("");
    try {
      // GET /reservas/anfitrion — devuelve reservas de los alojamientos del anfitrión
      const d = await apiFetch("/reservas/anfitrion");
      setReservas(Array.isArray(d) ? d : []);
    } catch (e) { setMsg(e.message); setMsgType("error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cambiarEstado = async (id, estado) => {
    setMsg("");
    try {
      await apiFetch(`/reservas/${id}`, { method: "PUT", body: JSON.stringify({ estado }) });
      setMsg(`✅ Reserva ${estado === "confirmada" ? "confirmada" : "cancelada"} correctamente`);
      setMsgType("success");
      load();
    } catch (e) { setMsg(e.message); setMsgType("error"); }
  };

  const filtered = filtro === "todas" ? reservas : reservas.filter(r => r.estado === filtro);

  const pendientes = reservas.filter(r => r.estado === "pendiente").length;

  return (
    <div>
      {pendientes > 0 && (
        <div className="alert alert-amber" style={{ marginBottom: "1rem" }}>
          ⏳ Tienes <strong>{pendientes}</strong> reserva{pendientes !== 1 ? "s" : ""} pendiente{pendientes !== 1 ? "s" : ""} por confirmar
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "todas", label: "Todas" },
            { id: "pendiente", label: "⏳ Pendientes" },
            { id: "confirmada", label: "✅ Confirmadas" },
            { id: "cancelada", label: "❌ Canceladas" },
          ].map(f => (
            <button key={f.id} className={`btn btn-sm ${filtro === f.id ? "btn-primary" : ""}`} onClick={() => setFiltro(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <button className="btn btn-sm" onClick={load} style={{ marginLeft: "auto" }}>↻ Actualizar</button>
      </div>

      {msg && <div className={`alert alert-${msgType === "error" ? "error" : "success"}`} style={{ marginBottom: "1rem" }}>{msg}</div>}

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📅</div><p>No hay reservas {filtro !== "todas" ? `en estado "${filtro}"` : "aún"}</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Turista</th>
                  <th>Unidad</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
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
                            <button className="btn btn-sm btn-primary" onClick={() => cambiarEstado(r.id, "confirmada")}>✅ Confirmar</button>
                            <button className="btn btn-sm btn-danger" onClick={() => cambiarEstado(r.id, "cancelada")}>❌ Cancelar</button>
                          </>
                        )}
                        {r.estado === "confirmada" && (
                          <button className="btn btn-sm btn-danger" onClick={() => cambiarEstado(r.id, "cancelada")}>❌ Cancelar</button>
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
        )
      )}
    </div>
  );
};

/* ─── Panel: Mis Unidades (anfitrión) ────────────────────────────────────── */
const TabMisUnidades = () => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [selectedAloj, setSelectedAloj] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");

  // NOTA BACKEND: En alojamiento.routes.js, router.get('/mine') debe ir ANTES de router.get('/:id')
  // o Express interpreta "mine" como un :id y falla. Fix: reordenar rutas en el backend.
  // El GET /alojamientos con token de anfitrion ya devuelve sus alojamientos + los aprobados.
  useEffect(() => {
    apiFetch("/alojamientos/mine")
      .then(d => { setAlojamientos(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => {
        apiFetch("/alojamientos")
          .then(d => { setAlojamientos(Array.isArray(d) ? d : []); setLoading(false); })
          .catch(() => setLoading(false));
      });
  }, []);

  const loadUnidades = async (aloj) => {
    setSelectedAloj(aloj);
    setUnidades([]);
    try {
      const d = await apiFetch(`/unidades/alojamiento/${aloj.id}`);
      setUnidades(Array.isArray(d.data) ? d.data : []);
    } catch (e) { setMsg(e.message); }
  };

  const deleteUnidad = async (id) => {
    if (!confirm("¿Eliminar esta unidad?")) return;
    try {
      await apiFetch(`/unidades/${id}`, { method: "DELETE" });
      loadUnidades(selectedAloj);
    } catch (e) { setMsg(e.message); }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div>
      {msg && <div className="alert alert-error">{msg}</div>}
      {alojamientos.length === 0 ? (
        <div className="empty"><div className="empty-icon">🏡</div><p>Crea un alojamiento primero para agregar unidades.</p></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem" }}>
          {/* Lista de alojamientos */}
          <div>
            <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Mis alojamientos</p>
            {alojamientos.map(a => (
              <div key={a.id}
                onClick={() => loadUnidades(a)}
                style={{
                  padding: "10px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", marginBottom: 6,
                  background: selectedAloj?.id === a.id ? "var(--green-light)" : "var(--white)",
                  border: `0.5px solid ${selectedAloj?.id === a.id ? "var(--green)" : "var(--border)"}`,
                  fontSize: "0.875rem",
                }}>
                <p style={{ fontWeight: 500 }}>{a.titulo}</p>
                <Badge status={a.estado || a.estado_publicacion} />
              </div>
            ))}
          </div>

          {/* Unidades del alojamiento seleccionado */}
          <div>
            {!selectedAloj ? (
              <div className="empty"><div className="empty-icon">👈</div><p>Selecciona un alojamiento</p></div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 className="display" style={{ fontSize: "1.1rem" }}>Unidades — {selectedAloj.titulo}</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nueva unidad</button>
                </div>
                {unidades.length === 0 ? (
                  <div className="empty"><div className="empty-icon">🛏️</div><p>Sin unidades. Agrega una.</p></div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Nombre</th><th>Tipo</th><th>Cap.</th><th>Precio/noche</th><th>Estado</th><th>Acción</th></tr></thead>
                      <tbody>
                        {unidades.map(u => (
                          <tr key={u.id}>
                            <td>{u.nombre}</td>
                            <td>{u.tipo}</td>
                            <td>{u.capacidad}</td>
                            <td>${parseFloat(u.precio_noche || 0).toFixed(0)}</td>
                            <td><Badge status={u.estado || u.estado_publicacion} /></td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteUnidad(u.id)}>Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

/* ─── Page: Mi Panel ──────────────────────────────────────────────────────── */
const PagePanel = ({ user }) => {
  const [tab, setTab] = useState("reservas");
  const [reservas, setReservas] = useState([]);
  const [alojamientos, setAlojamientos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlojForm, setShowAlojForm] = useState(false);
  const [msg, setMsg] = useState("");

  const loadTab = useCallback(async (t) => {
    setLoading(true); setMsg("");
    try {
      if (t === "reservas") { const d = await apiFetch("/reservas/mine"); setReservas(Array.isArray(d) ? d : []); }
      if (t === "alojamientos") {
        // BUG BACKEND: /alojamientos/mine falla porque la ruta /:id captura "mine" primero.
        // Fix backend: mover GET /mine ANTES de GET /:id en alojamiento.routes.js
        // Workaround: GET /alojamientos devuelve los correctos segun el rol del token
        const d = await apiFetch("/alojamientos");
        setAlojamientos(Array.isArray(d) ? d : []);
      }
      if (t === "pagos") { const d = await apiFetch("/pagos"); setPagos(Array.isArray(d) ? d : []); }
      if (t === "usuarios" && user.rol === "admin") { const d = await apiFetch("/usuarios"); setUsuarios(Array.isArray(d) ? d : []); }
      if (t === "categorias") { const d = await apiFetch("/categorias"); setCategorias(Array.isArray(d) ? d : []); }
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { loadTab(tab); }, [tab, loadTab]);

  const cancelReserva = async (id) => {
    try { await apiFetch(`/reservas/${id}`, { method: "PUT", body: JSON.stringify({ estado: "cancelada" }) }); loadTab("reservas"); }
    catch (e) { setMsg(e.message); }
  };

  const deleteAlojamiento = async (id) => {
    if (!confirm("¿Eliminar este alojamiento?")) return;
    try { await apiFetch(`/alojamientos/${id}`, { method: "DELETE" }); loadTab("alojamientos"); }
    catch (e) { setMsg(e.message); }
  };

  const tabs = [
    { id: "reservas", label: "📅 Mis Reservas" },
    ...(user.rol === "anfitrion" ? [{ id: "reservas_recibidas", label: "📬 Reservas recibidas" }] : []),
    ...(user.rol === "anfitrion" ? [{ id: "alojamientos", label: "🏡 Alojamientos" }] : []),
    ...(user.rol === "anfitrion" ? [{ id: "unidades", label: "🛏️ Unidades" }] : []),
    { id: "pagos", label: "💳 Pagos" },
    { id: "categorias", label: "🏷️ Categorías" },
    ...(user.rol === "admin" ? [{ id: "alojamientos", label: "🏡 Alojamientos" }] : []),
    ...(user.rol === "admin" ? [{ id: "usuarios", label: "👥 Usuarios" }] : []),
    ...(user.rol === "admin" ? [{ id: "moderacion", label: "🛡️ Mod. Alojamientos" }] : []),
    ...(user.rol === "admin" ? [{ id: "moderacion_unidades", label: "🛏️ Mod. Unidades" }] : []),
    ...(user.rol === "admin" ? [{ id: "moderacion_log", label: "📋 Log de moderación" }] : []),
  ];

  return (
    <div>
      <div className="profile-card">
        <div className="avatar">{user.nombre?.[0]?.toUpperCase()}</div>
        <div>
          <p style={{ fontWeight: 500, fontSize: "1rem" }}>{user.nombre}</p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.email}</p>
          <Badge status={user.rol} />
        </div>
      </div>

      {msg && <div className="alert alert-error">{msg}</div>}

      <div className="tabs">{tabs.map(t => (
        <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
      ))}</div>

      {/* Moderación no necesita loading wrapper propio */}
      {tab === "moderacion" && <TabModeracion tipoInicial="alojamientos" />}
      {tab === "moderacion_unidades" && <TabModeracion tipoInicial="unidades" />}
      {tab === "moderacion_log" && <TabModeracionLog />}
      {tab === "reservas_recibidas" && <TabReservasAnfitrion />}
      {tab === "unidades" && <TabMisUnidades />}

      {!["moderacion", "moderacion_unidades", "moderacion_log", "unidades", "reservas_recibidas"].includes(tab) && (loading ? <div className="loader"><div className="spinner" /></div> : (
        <>
          {/* RESERVAS */}
          {tab === "reservas" && (
            reservas.length === 0
              ? <div className="empty"><div className="empty-icon">📅</div><p>Sin reservas aún</p></div>
              : <div className="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>Unidad</th><th>Entrada</th><th>Salida</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead>
                    <tbody>
                      {reservas.map(r => (
                        <tr key={r.id}>
                          <td>#{r.id}</td>
                          <td>{r.nombre_unidad}</td>
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
          )}

          {/* ALOJAMIENTOS */}
          {tab === "alojamientos" && (
            <div>
              {(user.rol === "anfitrion" || user.rol === "admin") && (
                <button className="btn btn-primary btn-sm" style={{ marginBottom: "1rem" }} onClick={() => setShowAlojForm(true)}>+ Nuevo alojamiento</button>
              )}
              {alojamientos.length === 0
                ? <div className="empty"><div className="empty-icon">🏡</div><p>Sin alojamientos</p></div>
                : <div className="table-wrap">
                    <table>
                      <thead><tr><th>Título</th><th>Ubicación</th><th>Estado</th><th>Acción</th></tr></thead>
                      <tbody>
                        {alojamientos.map(a => (
                          <tr key={a.id}>
                            <td>{a.titulo}</td>
                            <td>{a.ubicacion}</td>
                            <td><Badge status={a.estado || a.estado_publicacion} /></td>
                            <td>
                              {(user.rol === "anfitrion" || user.rol === "admin") && (
                                <button className="btn btn-danger btn-sm" onClick={() => deleteAlojamiento(a.id)}>Eliminar</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>
          )}

          {/* PAGOS */}
          {tab === "pagos" && (
            pagos.length === 0
              ? <div className="empty"><div className="empty-icon">💳</div><p>Sin pagos registrados</p></div>
              : <div className="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>Reserva</th><th>Monto</th><th>Método</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>
                      {pagos.map(p => (
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
          )}

          {/* CATEGORÍAS */}
          {tab === "categorias" && (
            <div>
              {user.rol === "admin" && <CrearCategoria onCreated={() => loadTab("categorias")} />}
              {categorias.length === 0
                ? <div className="empty"><div className="empty-icon">🏷️</div><p>Sin categorías</p></div>
                : <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {categorias.map(c => <span key={c.id} className="badge badge-green" style={{ padding: "6px 14px", fontSize: "0.875rem" }}>{c.nombre}</span>)}
                  </div>
              }
            </div>
          )}

          {/* USUARIOS (admin) */}
          {tab === "usuarios" && user.rol === "admin" && (
            usuarios.length === 0
              ? <div className="empty"><div className="empty-icon">👥</div><p>Sin usuarios</p></div>
              : <div className="table-wrap">
                  <table>
                    <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Registrado</th></tr></thead>
                    <tbody>
                      {usuarios.map(u => (
                        <tr key={u.id}>
                          <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "var(--green)", fontWeight: 600 }}>{u.nombre?.[0]}</div>
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
          )}
        </>
      ))}

      {showAlojForm && (
        <AlojamientoForm
          onClose={() => setShowAlojForm(false)}
          onCreated={() => { setShowAlojForm(false); loadTab("alojamientos"); }}
        />
      )}
    </div>
  );
};

/* ─── Home Featured ───────────────────────────────────────────────────────── */
const HomeFeatured = ({ onSelect }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    apiFetch("/alojamientos").then(d => setItems((Array.isArray(d) ? d : []).slice(0, 3))).catch(() => {});
  }, []);

  const placeholders = [
    { id: 1, titulo: "Cabaña del Páramo", ubicacion: "Boyacá, Colombia", descripcion: "Experiencia única a 3.200 m.s.n.m. rodeado de frailejones y niebla perpetua.", estado_publicacion: "aprobado" },
    { id: 2, titulo: "Eco-Glamping Cocora", ubicacion: "Eje Cafetero, Colombia", descripcion: "Duerme entre palmas de cera, el árbol nacional de Colombia.", estado_publicacion: "aprobado" },
    { id: 3, titulo: "Casa Tayrona", ubicacion: "Magdalena, Colombia", descripcion: "A pasos del Parque Natural Tayrona, brisa marina y selva tropical.", estado_publicacion: "aprobado" },
  ];

  const display = items.length > 0 ? items : placeholders;
  return <div className="cards-grid">{display.map(a => <AlojamientoCard key={a.id} item={a} onClick={onSelect} />)}</div>;
};

/* ─── App Root ────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(getUser());
  const [authMode, setAuthMode] = useState(null);

  const logout = () => {
    localStorage.removeItem("eco_token");
    localStorage.removeItem("eco_user");
    setUser(null); setPage("home");
  };

  const onAuth = (u) => { setUser(u); setAuthMode(null); setPage("panel"); };
  const onRequireAuth = () => setAuthMode("login");

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("home")}>
            <span>🌿</span> EcoTurismo
          </div>
          <div className="nav-links">
            <button className={`nav-link ${page==="explorar"?"active":""}`} onClick={() => setPage("explorar")}>Explorar</button>
            {user && <button className={`nav-link ${page==="panel"?"active":""}`} onClick={() => setPage("panel")}>Mi panel</button>}
          </div>
          <div className="nav-actions">
            {user ? (
              <>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: "0.85rem" }}>{user.nombre?.[0]}</div>
                <button className="btn btn-sm" onClick={logout}>Salir</button>
              </>
            ) : (
              <>
                <button className="btn btn-sm" onClick={() => setAuthMode("login")}>Ingresar</button>
                <button className="btn btn-primary btn-sm" onClick={() => setAuthMode("register")}>Registrarse</button>
              </>
            )}
          </div>
        </nav>

        {/* HOME */}
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <div className="hero-badge">🌱 Turismo sostenible en Colombia</div>
                <h1>Descubre la naturaleza, <em>vívela</em></h1>
                <p>Conecta con alojamientos ecológicos únicos. Cada estancia apoya la conservación del medio ambiente y las comunidades locales.</p>
                <div className="hero-actions">
                  <button className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "0.5px solid rgba(255,255,255,0.3)" }} onClick={() => setPage("explorar")}>
                    Explorar alojamientos
                  </button>
                  {!user && <button className="btn" style={{ background: "white", color: "var(--green)" }} onClick={() => setAuthMode("register")}>Unirme gratis</button>}
                </div>
              </div>
            </section>

            <div className="main">
              <div className="stats-row">
                {[
                  { label: "Alojamientos activos", value: "48+", icon: "🏡" },
                  { label: "Turistas satisfechos", value: "1.2k", icon: "🧍" },
                  { label: "Reservas exitosas", value: "860", icon: "📅" },
                  { label: "Destinos eco", value: "12", icon: "🗺️" },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <span className="stat-icon">{s.icon}</span>
                    <p className="stat-label">{s.label}</p>
                    <p className="stat-value">{s.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <div className="section-header">
                  <h2 className="section-title display">Destacados</h2>
                  <button className="btn btn-sm" onClick={() => setPage("explorar")}>Ver todos →</button>
                </div>
                <HomeFeatured onSelect={() => setPage("explorar")} />
              </div>

              <div style={{ background: "var(--white)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem", textAlign: "center" }}>
                <h3 className="display" style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>¿Tienes un espacio en la naturaleza?</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem", maxWidth: 480, margin: "0 auto 1.25rem" }}>
                  Regístrate como anfitrión y comparte tu alojamiento ecológico con viajeros conscientes de todo el mundo.
                </p>
                <button className="btn btn-primary" onClick={() => setAuthMode("register")}>Ser anfitrión</button>
              </div>
            </div>
          </>
        )}

        {/* PÁGINAS */}
        {page === "explorar" && <div className="main"><PageExplorar user={user} onRequireAuth={onRequireAuth} /></div>}
        {page === "panel" && user && <div className="main"><PagePanel user={user} /></div>}
        {page === "panel" && !user && (
          <div className="main">
            <div className="empty">
              <div className="empty-icon">🔒</div>
              <p>Inicia sesión para acceder a tu panel.</p>
              <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setAuthMode("login")}>Ingresar</button>
            </div>
          </div>
        )}

        <footer className="footer">
          <strong>🌿 EcoTurismo</strong> — Plataforma de turismo sostenible · {new Date().getFullYear()}
        </footer>
      </div>

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onAuth={onAuth} />}
    </>
  );
}