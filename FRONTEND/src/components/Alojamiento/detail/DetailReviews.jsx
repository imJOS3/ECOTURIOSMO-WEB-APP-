import { useState } from "react";
import { StarRating } from "../../common/ui/index";
import { StarFillIcon } from "../detailIcons";

export const DetailReviews = ({
  resenas,
  avgRating,
  user,
  onSubmit,
}) => {
  const [form, setForm] = useState({ calificacion: 5, comentario: "" });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMsg("");
    try {
      await onSubmit(form);
      setMsg("¡Reseña publicada!");
      setForm({ calificacion: 5, comentario: "" });
    } catch (error) {
      setMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="sec-resenas">
      <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        {avgRating ? (
          <>
            <StarFillIcon size={16} style={{ verticalAlign: -2 }} /> {avgRating} ·{" "}
          </>
        ) : null}
        Reseñas ({resenas.length})
      </h3>

      {resenas.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Aún no hay reseñas. ¡Sé el primero en dejar una!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "12px",
            marginBottom: "1.5rem",
          }}
        >
          {resenas.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-avatar">
                {(r.nombre_turista || "?")[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <StarRating value={r.calificacion} />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {new Date(r.fecha).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <p style={{ fontSize: "0.875rem" }}>{r.comentario}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && (
        <div
          style={{
            background: "var(--card-bg)",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.25rem",
          }}
        >
          <p style={{ fontSize: "0.85rem", fontWeight: 500, marginBottom: 10 }}>
            Deja tu reseña
          </p>
          <div className="form-group">
            <label className="form-label">Calificación</label>
            <select
              className="form-input form-select"
              value={form.calificacion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, calificacion: parseInt(e.target.value, 10) }))
              }
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Comentario</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.comentario}
              onChange={(e) => setForm((prev) => ({ ...prev, comentario: e.target.value }))}
              style={{ resize: "vertical" }}
            />
          </div>
          {msg && (
            <div className={`alert ${msg.includes("!") ? "alert-success" : "alert-error"}`}>
              {msg}
            </div>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Publicando..." : "Publicar reseña"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailReviews;
