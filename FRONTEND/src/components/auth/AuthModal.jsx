// src/components/AuthModal.jsx
import { useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { CloseIcon, UserIcon, HomeIcon } from "../common/icons/icons";
import {
  AppleGlyph,
  FacebookGlyph,
  GoogleGlyph,
  MicrosoftGlyph,
} from "./socialIcons";

const SOCIAL_PROVIDERS = [
  {
    id: "google",
    label: "Continuar con Google",
    Icon: GoogleGlyph,
    className: "social-btn social-btn-google",
  },
  {
    id: "apple",
    label: "Continuar con Apple",
    Icon: AppleGlyph,
    className: "social-btn social-btn-apple",
  },
  {
    id: "microsoft",
    label: "Continuar con Hotmail / Outlook",
    Icon: MicrosoftGlyph,
    className: "social-btn social-btn-microsoft",
  },
  {
    id: "facebook",
    label: "Continuar con Facebook",
    Icon: FacebookGlyph,
    className: "social-btn social-btn-facebook",
  },
];

const emptyForm = {
  nombre: "",
  email: "",
  password: "",
  passwordConfirm: "",
  telefono: "",
  fecha_nacimiento: "",
  ciudad: "",
  rol: "turista",
  acepta_terminos: false,
};

const calcAge = (fecha) => {
  if (!fecha) return null;
  const birth = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

const AuthModal = ({ mode: initialMode, onClose, onAuth }) => {
  const [mode, setMode] = useState(initialMode || "login");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };
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

  const validateRegister = () => {
    if (!form.nombre.trim() || form.nombre.trim().length < 3) {
      return "Ingresa tu nombre completo (mínimo 3 caracteres).";
    }
    if (!form.nombre.trim().includes(" ")) {
      return "Ingresa nombre y apellido.";
    }
    if (!form.fecha_nacimiento) return "La fecha de nacimiento es obligatoria.";
    const age = calcAge(form.fecha_nacimiento);
    if (age == null) return "Fecha de nacimiento inválida.";
    if (age < 18) return "Debes ser mayor de 18 años para registrarte.";
    if (!form.telefono.trim() || form.telefono.replace(/\D/g, "").length < 7) {
      return "Ingresa un teléfono válido.";
    }
    if (!form.ciudad.trim() || form.ciudad.trim().length < 2) {
      return "Ingresa tu ciudad de residencia.";
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      return "Ingresa un correo electrónico válido.";
    }
    const passwordError = validateStrongPassword(form.password);
    if (passwordError) return passwordError;
    if (form.password !== form.passwordConfirm) {
      return "Las contraseñas no coinciden.";
    }
    if (!form.acepta_terminos) {
      return "Debes aceptar los términos y la política de privacidad.";
    }
    return "";
  };

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const handleSocial = (providerId) => {
    setError("");
    const names = {
      google: "Google",
      apple: "Apple",
      microsoft: "Hotmail / Outlook (Microsoft)",
      facebook: "Facebook",
    };
    setInfo(
      `El acceso con ${names[providerId] || providerId} está preparado en la interfaz. ` +
        "Para activarlo hay que crear la app en el panel del proveedor y conectar OAuth en el backend."
    );
  };

  const submit = async () => {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(form.email, form.password);
        onAuth && onAuth(user);
      } else {
        const validationError = validateRegister();
        if (validationError) {
          setError(validationError);
          return;
        }
        const { passwordConfirm, ...payload } = form;
        await register({
          ...payload,
          nombre: payload.nombre.trim(),
          email: payload.email.trim().toLowerCase(),
          telefono: payload.telefono.trim(),
          ciudad: payload.ciudad.trim(),
        });
        setMode("login");
        setForm((f) => ({
          ...emptyForm,
          email: f.email,
          rol: f.rol,
        }));
        setInfo("Cuenta creada. Ahora inicia sesión con tu correo.");
      }
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal auth-modal ${mode === "register" ? "auth-modal-wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title display">{mode === "login" ? "Bienvenido" : "Únete"}</h2>
            <p className="modal-subtitle">
              {mode === "login"
                ? "Ingresa con una red social o con tu correo"
                : "Completa tus datos básicos para una cuenta más segura"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon fontSize="inherit" />
          </button>
        </div>

        <div className="tabs" style={{ marginBottom: "1.25rem" }}>
          <button
            type="button"
            className={`tab ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setError("");
              setInfo("");
            }}
          >
            Ingresar
          </button>
          <button
            type="button"
            className={`tab ${mode === "register" ? "active" : ""}`}
            onClick={() => {
              setMode("register");
              setError("");
              setInfo("");
            }}
          >
            Registrarse
          </button>
        </div>

        <div className="social-auth-grid">
          {SOCIAL_PROVIDERS.map(({ id, label, Icon, className }) => (
            <button
              key={id}
              type="button"
              className={className}
              onClick={() => handleSocial(id)}
              disabled={loading}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="auth-divider" role="separator">
          <span>o con correo electrónico</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {info && !error && <div className="alert alert-success">{info}</div>}

        {mode === "register" && (
          <>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                className="form-input"
                placeholder="Nombre y apellido"
                value={form.nombre}
                onChange={set("nombre")}
                autoComplete="name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de nacimiento</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.fecha_nacimiento}
                  onChange={set("fecha_nacimiento")}
                  max={new Date().toISOString().slice(0, 10)}
                />
                <p className="form-hint">Debes ser mayor de 18 años.</p>
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  value={form.telefono}
                  onChange={set("telefono")}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ciudad de residencia</label>
              <input
                className="form-input"
                placeholder="Ej. Medellín"
                value={form.ciudad}
                onChange={set("ciudad")}
                autoComplete="address-level2"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input
            className="form-input"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
          />
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
            <p id="password-help" className="form-hint">
              Usa 8+ caracteres con mayúsculas, minúsculas, números y un símbolo.
            </p>
          )}
        </div>

        {mode === "register" && (
          <>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input
                className="form-input"
                type="password"
                placeholder="Repite tu contraseña"
                value={form.passwordConfirm}
                onChange={set("passwordConfirm")}
                autoComplete="new-password"
              />
            </div>

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

            <label className="cuenta-check auth-terms">
              <input
                type="checkbox"
                checked={form.acepta_terminos}
                onChange={set("acepta_terminos")}
              />
              <span>
                Acepto los términos de uso y la política de privacidad. Mis datos se usan
                para gestionar la cuenta y proteger las reservas.
              </span>
            </label>
          </>
        )}

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "0.75rem" }}
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
