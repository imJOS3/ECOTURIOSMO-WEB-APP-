import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import useAuthStore from "../../stores/useAuthStore";
import { BackIcon, UserIcon } from "../../components/common/icons/icons";

const NOTIF_KEY = "eco_profile_prefs";

const loadPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "{}");
  } catch {
    return {};
  }
};

/**
 * Configurar perfil: datos de cuenta + preferencias locales.
 */
const PagePerfil = ({ user, onUserUpdated, onRequireAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
  });
  const [prefs, setPrefs] = useState(() => ({
    emailsReservas: true,
    emailsMensajes: true,
    emailsMarketing: false,
    ...loadPrefs(),
  }));
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) onRequireAuth?.();
  }, [user, onRequireAuth]);

  useEffect(() => {
    if (user) {
      setForm({ nombre: user.nombre || "", email: user.email || "" });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="empty">
        <div className="empty-icon">
          <UserIcon fontSize="inherit" />
        </div>
        <p>Inicia sesión para configurar tu perfil.</p>
      </div>
    );
  }

  const setField = (key) => (event) => {
    setForm((state) => ({ ...state, [key]: event.target.value }));
  };

  const saveProfile = async () => {
    setError("");
    setMsg("");
    if (!form.nombre.trim() || form.nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }

    setSaving(true);
    try {
      const updated = await apiFetch(`/usuarios/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim().toLowerCase(),
          rol: user.rol,
        }),
      });
      const nextUser = { ...user, ...updated };
      localStorage.setItem("eco_user", JSON.stringify(nextUser));
      useAuthStore.setState({ user: nextUser });
      onUserUpdated?.(nextUser);
      setMsg("Perfil actualizado correctamente.");
    } catch (e) {
      setError(e.message || "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const savePrefs = () => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
    setMsg("Preferencias guardadas en este dispositivo.");
    setError("");
  };

  return (
    <div className="cuenta-page">
      <button type="button" className="btn btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1.25rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <BackIcon fontSize="small" /> Volver
        </span>
      </button>

      <h1 className="display" style={{ fontSize: "1.85rem", marginBottom: 6 }}>
        Configurar perfil
      </h1>
      <p className="cuenta-lead">Actualiza tus datos de cuenta y cómo te contactamos.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      <section className="cuenta-card">
        <h2 className="cuenta-card-title">Datos de la cuenta</h2>
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input className="form-input" value={form.nombre} onChange={setField("nombre")} />
        </div>
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input className="form-input" type="email" value={form.email} onChange={setField("email")} />
        </div>
        <div className="form-group">
          <label className="form-label">Rol</label>
          <input className="form-input" value={user.rol} disabled />
          <p className="form-hint">El rol no se cambia desde aquí. Contacta soporte si necesitas cambiarlo.</p>
        </div>
        <button type="button" className="btn btn-primary" disabled={saving} onClick={saveProfile}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </section>

      <section className="cuenta-card">
        <h2 className="cuenta-card-title">Notificaciones</h2>
        <label className="cuenta-check">
          <input
            type="checkbox"
            checked={Boolean(prefs.emailsReservas)}
            onChange={(e) => setPrefs((p) => ({ ...p, emailsReservas: e.target.checked }))}
          />
          Avisos de reservas y pagos
        </label>
        <label className="cuenta-check">
          <input
            type="checkbox"
            checked={Boolean(prefs.emailsMensajes)}
            onChange={(e) => setPrefs((p) => ({ ...p, emailsMensajes: e.target.checked }))}
          />
          Avisos de mensajes nuevos
        </label>
        <label className="cuenta-check">
          <input
            type="checkbox"
            checked={Boolean(prefs.emailsMarketing)}
            onChange={(e) => setPrefs((p) => ({ ...p, emailsMarketing: e.target.checked }))}
          />
          Novedades y tips de ecoturismo
        </label>
        <button type="button" className="btn btn-sm" style={{ marginTop: 12 }} onClick={savePrefs}>
          Guardar preferencias
        </button>
      </section>

      <section className="cuenta-card">
        <h2 className="cuenta-card-title">Privacidad y seguridad</h2>
        <ul className="cuenta-list">
          <li>Tu contraseña se gestiona al registrarte; para restablecerla escribe a soporte.</li>
          <li>Puedes cerrar sesión desde el menú de perfil en cualquier momento.</li>
          <li>Los datos de ubicación de tus alojamientos solo se muestran con precisión tras una reserva.</li>
        </ul>
        <button type="button" className="btn btn-sm" onClick={() => navigate("/cuenta/soporte")}>
          Ir a soporte y ayuda
        </button>
      </section>
    </div>
  );
};

export default PagePerfil;
