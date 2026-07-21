// src/components/AuthModal.jsx
import { useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { CloseIcon, UserIcon, HomeIcon } from "../common/icons/icons";

const AuthModal = ({ mode: initialMode, onClose, onAuth }) => {
  const [mode, setMode] = useState(initialMode || "login");
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "turista" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const roleOptions = [
    { value: "turista", label: "Turista", description: "Explorar y reservar", icon: UserIcon },
    { value: "anfitrion", label: "Anfitrión", description: "Ofrecer alojamientos", icon: HomeIcon },
  ];

  const validateStrongPassword = (password) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[a-z]/.test(password)) return "La contraseña debe incluir al menos una letra minúscula.";
    if (!/[A-Z]/.test(password)) return "La contraseña debe incluir al menos una letra mayúscula.";
    if (!/\d/.test(password)) return "La contraseña debe incluir al menos un número.";
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return "La contraseña debe incluir al menos un símbolo.";
    }
    return "";
  };

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(form.email, form.password);
        onAuth && onAuth(user);
      } else {
        const passwordError = validateStrongPassword(form.password);
        if (passwordError) {
          setError(passwordError);
          return;
        }
        await register(form);
        setMode("login"); setError("");
      }
    } catch (e) { setError(e.message || String(e)); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">{mode === "login" ? "Bienvenido" : "Únete"}</h2>
          <button className="modal-close" onClick={onClose}><CloseIcon fontSize="inherit" /></button>
        </div>
        <div className="tabs" style={{ marginBottom: "1.5rem" }}>
          <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Ingresar</button>
          <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Registrarse</button>
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
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
            minLength={8}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            aria-describedby={mode === "register" ? "password-help" : undefined}
          />
          {mode === "register" && (
            <p id="password-help" style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 6 }}>
              Usa 8+ caracteres con mayúsculas, minúsculas, números y un símbolo.
            </p>
          )}
        </div>
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Tipo de cuenta</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const active = form.rol === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className="form-input"
                    onClick={() => setForm((current) => ({ ...current, rol: option.value }))}
                    style={{
                      textAlign: "left",
                      padding: "0.9rem",
                      borderRadius: "var(--radius-sm)",
                      border: `0.5px solid ${active ? "var(--green)" : "var(--border)"}`,
                      background: active ? "var(--green-light)" : "var(--card-bg)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icon fontSize="small" />
                      <strong>{option.label}</strong>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "0.5rem" }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Cargando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;