import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackIcon, ChatIcon } from "../../components/common/icons/icons";

const FAQS = [
  {
    id: "reserva",
    q: "¿Cómo hago una reserva?",
    a: "Explora alojamientos, abre el detalle, elige fechas y confirma. Si no has iniciado sesión, te pediremos ingresar primero.",
  },
  {
    id: "anfitrion",
    q: "¿Cómo publico un alojamiento?",
    a: "Con cuenta de anfitrión ve a Mi panel → Alojamientos → Nuevo. Completa datos, ubicación en el mapa, categorías, servicios y fotos. Quedará en revisión hasta que un admin lo apruebe.",
  },
  {
    id: "pago",
    q: "¿Dónde veo mis pagos?",
    a: "En Mi panel → Pagos encontrarás el historial asociado a tus reservas.",
  },
  {
    id: "mensaje",
    q: "¿Cómo contacto al anfitrión o al huésped?",
    a: "Usa el botón Mensajes en la barra superior para abrir tus conversaciones.",
  },
  {
    id: "cuenta",
    q: "¿Puedo cambiar mi correo o nombre?",
    a: "Sí. En Configurar perfil puedes actualizar nombre y correo. El rol (turista/anfitrión/admin) solo lo modifica soporte o un administrador.",
  },
];

/**
 * Soporte y ayuda técnica: FAQ + formulario de contacto.
 */
const PageSoporte = ({ user, onRequireAuth }) => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState("reserva");
  const [ticket, setTicket] = useState({
    asunto: "ayuda_general",
    mensaje: "",
    email: user?.email || "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) onRequireAuth?.();
  }, [user, onRequireAuth]);

  useEffect(() => {
    if (user?.email) setTicket((t) => ({ ...t, email: user.email }));
  }, [user]);

  if (!user) {
    return (
      <div className="empty">
        <div className="empty-icon">
          <ChatIcon fontSize="inherit" />
        </div>
        <p>Inicia sesión para acceder a soporte.</p>
      </div>
    );
  }

  const submitTicket = (event) => {
    event.preventDefault();
    setError("");
    if (ticket.mensaje.trim().length < 15) {
      setError("Describe tu caso con al menos 15 caracteres.");
      return;
    }

    const drafts = JSON.parse(localStorage.getItem("eco_support_tickets") || "[]");
    drafts.unshift({
      id: Date.now(),
      userId: user.id,
      ...ticket,
      mensaje: ticket.mensaje.trim(),
      createdAt: new Date().toISOString(),
      estado: "recibido",
    });
    localStorage.setItem("eco_support_tickets", JSON.stringify(drafts.slice(0, 20)));
    setSent(true);
    setTicket((t) => ({ ...t, mensaje: "" }));
  };

  return (
    <div className="cuenta-page">
      <button type="button" className="btn btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1.25rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <BackIcon fontSize="small" /> Volver
        </span>
      </button>

      <h1 className="display" style={{ fontSize: "1.85rem", marginBottom: 6 }}>
        Soporte y ayuda técnica
      </h1>
      <p className="cuenta-lead">
        Resuelve dudas frecuentes o envíanos un ticket. Te responderemos al correo de tu cuenta.
      </p>

      <section className="cuenta-card">
        <h2 className="cuenta-card-title">Preguntas frecuentes</h2>
        <div className="faq-list">
          {FAQS.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} className={`faq-item ${open ? "open" : ""}`}>
                <button
                  type="button"
                  className="faq-q"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                >
                  {item.q}
                  <span aria-hidden>{open ? "−" : "+"}</span>
                </button>
                {open && <p className="faq-a">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="cuenta-card">
        <h2 className="cuenta-card-title">Canales de ayuda</h2>
        <ul className="cuenta-list">
          <li>
            <strong>Correo:</strong> soporte@ecoturismo.app
          </li>
          <li>
            <strong>Horario:</strong> lun–vie 8:00–18:00 (hora Colombia)
          </li>
          <li>
            <strong>Urgencias de reserva:</strong> usa Mensajes con el anfitrión y copia a soporte si no hay respuesta en 24 h.
          </li>
        </ul>
        <button type="button" className="btn btn-sm" onClick={() => navigate("/cuenta/perfil")}>
          Ir a configurar perfil
        </button>
      </section>

      <section className="cuenta-card">
        <h2 className="cuenta-card-title">Enviar ticket</h2>
        {sent && (
          <div className="alert alert-success">
            Ticket recibido. Guardamos tu solicitud y te contactaremos pronto.
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submitTicket}>
          <div className="form-group">
            <label className="form-label">Asunto</label>
            <select
              className="form-input form-select"
              value={ticket.asunto}
              onChange={(e) => setTicket((t) => ({ ...t, asunto: e.target.value }))}
            >
              <option value="ayuda_general">Ayuda general</option>
              <option value="problema_tecnico">Problema técnico</option>
              <option value="reserva_pago">Reserva o pago</option>
              <option value="cuenta_acceso">Cuenta y acceso</option>
              <option value="reportar_contenido">Reportar contenido</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Correo de respuesta</label>
            <input
              className="form-input"
              type="email"
              value={ticket.email}
              onChange={(e) => setTicket((t) => ({ ...t, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Describe tu caso</label>
            <textarea
              className="form-input"
              rows={5}
              placeholder="Qué ocurrió, en qué página estabas y qué esperabas ver…"
              value={ticket.mensaje}
              onChange={(e) => setTicket((t) => ({ ...t, mensaje: e.target.value }))}
              style={{ resize: "vertical" }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Enviar solicitud
          </button>
        </form>
      </section>
    </div>
  );
};

export default PageSoporte;
