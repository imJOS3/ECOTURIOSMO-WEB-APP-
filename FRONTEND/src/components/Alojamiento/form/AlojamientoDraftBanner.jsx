const formatDraftTime = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
};

/**
 * Banner presentacional: recuperar o descartar borrador.
 */
export const AlojamientoDraftBanner = ({ draft, onRecover, onDiscard }) => {
  if (!draft) return null;

  const titulo = draft.form?.titulo?.trim();
  const when = formatDraftTime(draft.savedAt);

  return (
    <div className="alert alert-amber" style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <div style={{ flex: "1 1 220px" }}>
          <strong style={{ display: "block", marginBottom: 4 }}>
            Tienes un borrador sin guardar
          </strong>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            {titulo ? `“${titulo}”` : "Alojamiento sin título"}
            {when ? ` · guardado ${when}` : ""}
            . ¿Quieres recuperarlo o empezar de cero?
          </span>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "6px 0 0" }}>
            Las fotos no se guardan en el borrador; tendrás que volver a subirlas.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={onRecover}>
            Recuperar borrador
          </button>
          <button type="button" className="btn btn-sm" onClick={onDiscard}>
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlojamientoDraftBanner;
