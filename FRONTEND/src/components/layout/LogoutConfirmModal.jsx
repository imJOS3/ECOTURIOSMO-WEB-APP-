/**
 * Confirmación antes de cerrar sesión.
 */
const LogoutConfirmModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="presentation">
      <div
        className="modal"
        style={{ maxWidth: 420 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        <div className="modal-header">
          <h2 id="logout-title" className="modal-title display">
            Cerrar sesión
          </h2>
          <button type="button" className="modal-close" onClick={onCancel} aria-label="Cerrar">
            ×
          </button>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          ¿Seguro que deseas cerrar sesión? Tendrás que volver a ingresar para acceder a tu panel,
          mensajes y reservas.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-sm" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onConfirm}>
            Sí, cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
