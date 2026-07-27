import { useState } from "react";
import { CloseIcon } from "../common/icons/icons";

/**
 * Modal para iniciar una conversación (turista→anfitrión o admin→anfitrión).
 */
const StartChatModal = ({
  title = "Enviar mensaje",
  subtitle,
  defaultMessage = "",
  confirmLabel = "Enviar",
  onSubmit,
  onClose,
}) => {
  const [cuerpo, setCuerpo] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!cuerpo.trim()) {
      setError("Escribe un mensaje");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(cuerpo.trim());
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title display">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </button>
        </div>

        {subtitle && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            {subtitle}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">Mensaje</label>
          <textarea
            className="form-input"
            rows={5}
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
            placeholder="Escribe tu mensaje..."
            style={{ resize: "vertical" }}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "0.5rem" }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Enviando..." : confirmLabel}
        </button>
      </div>
    </div>
  );
};

export default StartChatModal;
